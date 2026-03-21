import User from "../models/User.model.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || "agent"
  });

  const userRes = newUser.toObject();
  delete userRes.password;
  return userRes;
};

export const getAllUsers = async (filters = {}) => {
  const query = { deletedAt: null }; // default to active users
  
  if (filters.role) query.role = filters.role;
  if (filters.active !== undefined) query.active = filters.active;

  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  return users;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  return user;
};

export const updateUser = async (userId, updateData) => {
  // Prevent password update via this general route
  if (updateData.password) delete updateData.password;
  
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");
  return updatedUser;
};

export const deleteUser = async (userId) => {
  // Soft delete
  const updatedUser = await User.findByIdAndUpdate(
    userId, 
    { active: false, deletedAt: new Date() }, 
    { new: true }
  ).select("-password");
  return updatedUser;
};