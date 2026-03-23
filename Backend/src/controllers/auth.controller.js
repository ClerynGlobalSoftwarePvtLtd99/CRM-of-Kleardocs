import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/response.js";

const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks
  secure: true, // HTTPS required for cross-domain
  sameSite: "none" // Allows Vercel Frontend to talk to Render Backend
};

export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  
  res.status(200)
     .cookie("refreshToken", result.refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) 
     .cookie("accessToken", result.accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000) }) 
     .json(new ApiResponse(200, {
        user: result.user,
        accessToken: result.accessToken // Give frontend API access to use Bearer manually if they prefer
     }, "User logged in successfully"));
};

export const customerLogin = async (req, res) => {
  const result = await authService.loginCustomerAccount(req.body);
  
  res.status(200)
     .cookie("refreshToken", result.refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
     .cookie("accessToken", result.accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000) })
     .json(new ApiResponse(200, {
        customer: result.customer,
        accessToken: result.accessToken
     }, "Customer logged in successfully"));
};

export const refresh = async (req, res) => {
  // Try taking the refresh token from httpOnly cookie OR body
  const rawRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (!rawRefreshToken) {
     return res.status(401).json({ success: false, message: "Refresh token is required" });
  }

  const result = await authService.refreshAccessToken(rawRefreshToken);

  res.status(200)
     .cookie("refreshToken", result.refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
     .cookie("accessToken", result.accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000) })
     .json(new ApiResponse(200, {
        accessToken: result.accessToken
     }, "Token refreshed successfully"));
};

export const logout = async (req, res) => {
  await authService.logoutUser(req.user.id, req.user.role || "customer");

  res.status(200)
     .clearCookie("accessToken", cookieOptions)
     .clearCookie("refreshToken", cookieOptions)
     .json(new ApiResponse(200, null, "Logged out successfully"));
};

export const getMe = async (req, res) => {
  // Identify the class of logged in persona securely fetched from DB
  // Identify the class of logged in persona securely fetched from DB
  let currentUser = null;
  if (req.user.role === "Customer" || req.user.role === "customer") {
      const Customer = (await import("../models/Customer.model.js")).default;
      currentUser = await Customer.findById(req.user.id).select("-password -__v");
  } else {
      const User = (await import("../models/User.model.js")).default;
      currentUser = await User.findById(req.user.id).select("-password -__v");
  }

  if (!currentUser) throw new ApiError(404, "Account identity missing or revoked");
  if (currentUser.active === false || currentUser.deletedAt) throw new ApiError(403, "Account deactivated");

  res.status(200).json(new ApiResponse(200, currentUser, "Session strictly hydrated"));
};