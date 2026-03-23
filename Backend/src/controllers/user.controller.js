import * as userService from "../services/user.service.js";
import { ApiResponse, ApiError } from "../utils/response.js";

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(new ApiResponse(201, user, "User created successfully"));
  } catch (error) {
    if (error.message.includes("already exists")) {
      next(new ApiError(400, "Email already exists"));
    } else {
      next(error);
    }
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.active !== undefined) filters.active = req.query.active === 'true';

    const users = await userService.getAllUsers(filters);
    res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (!success) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, null, "User soft-deleted successfully"));
  } catch (error) {
    next(error);
  }
};