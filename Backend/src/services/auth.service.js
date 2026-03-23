import User from "../models/User.model.js";
import Customer from "../models/Customer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/response.js";

export const registerUser = async (data) => {
  const { name, email, password, role } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, "User with this email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role
  });

  return user;
};

export const loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid email or password");

  if (!user.active) throw new ApiError(403, "Your account is deactivated. Please contact support.");
  if (user.deletedAt) throw new ApiError(403, "This account no longer exists.");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, "Invalid email or password");

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError(401, "Refresh token is generally required");

  // Verify the refresh token cryptographically
  const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  // Find user and verify the token wasn't revoked/replaced in DB
  const user = await User.findOne({ _id: decoded.id, refreshToken: incomingRefreshToken });
  if (!user) {
    throw new ApiError(403, "Invalid or revoked refresh token");
  }

  // Check if they were fully banned since the refresh token was issued
  if (!user.active || user.deletedAt) throw new ApiError(403, "This account is inactive or deleted");

  // Generate new tokens
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d" }
  );

  // Update DB 
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const loginCustomerAccount = async (data) => {
  const { username, password } = data;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const customer = await Customer.findOne({ username });
  if (!customer) throw new ApiError(401, "Invalid credentials");

  if (!customer.active) throw new ApiError(403, "Your account is deactivated. Please contact support.");

  // Password for customer portal is a plain generated string according to the schema
  if (customer.password !== password) throw new ApiError(401, "Invalid credentials");

  const accessToken = jwt.sign(
    { id: customer._id, role: "Customer" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: customer._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d" }
  );

  // Return generated tokens back to controller
  return { customer: { id: customer._id, name: customer.name, companyName: customer.companyName, username: customer.username }, accessToken, refreshToken };
};

export const logoutUser = async (userId, role) => {
  // If the user is an admin/agent/accountant, remove the refresh token from the DB
  if (role !== "customer" && role !== "Customer") {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }
  // For customers, tokens are purely stateless here
  return true;
};

export const getProfile = async (userId, role) => {
  if (role === "Customer" || role === "customer") {
    const customer = await Customer.findById(userId).select("-password");
    if (!customer) throw new ApiError(404, "Customer not found");
    return { customer };
  } else {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");
    return { user };
  }
};