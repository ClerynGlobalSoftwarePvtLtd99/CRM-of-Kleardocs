import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/response.js";
 
const getCookieOptions = (req) => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd, // Only true in production (HTTPS)
    sameSite: isProd ? "None" : "Lax",
    // "none" for cross-site prod, "lax" for local dev
  };
};

export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  
  const options = getCookieOptions(req);
  res.status(200)
     .cookie("refreshToken", result.refreshToken, { ...options, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), path: "/" }) 
     .cookie("accessToken", result.accessToken, { ...options, expires: new Date(Date.now() + 15 * 60 * 1000), path: "/" }) 
     .json(new ApiResponse(200, {
        user: result.user || result.customer,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
     }, "User logged in successfully"));
};

export const customerLogin = async (req, res) => {
  const result = await authService.loginCustomerAccount(req.body);
  
  const options = getCookieOptions(req);
  res.status(200)
     .cookie("refreshToken", result.refreshToken, { ...options, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), path: "/" })
     .cookie("accessToken", result.accessToken, { ...options, expires: new Date(Date.now() + 15 * 60 * 1000), path: "/" })
     .json(new ApiResponse(200, {
        customer: result.customer,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
     }, "Customer logged in successfully"));
};

export const refresh = async (req, res) => {
  // Try taking the refresh token from httpOnly cookie OR body
  const rawRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (!rawRefreshToken) {
     return res.status(401).json({ success: false, message: "Refresh token is required" });
  }

  const result = await authService.refreshAccessToken(rawRefreshToken);
  const options = getCookieOptions(req);

  res.status(200)
     .cookie("refreshToken", result.refreshToken, { ...options, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), path: "/" })
     .cookie("accessToken", result.accessToken, { ...options, expires: new Date(Date.now() + 15 * 60 * 1000), path: "/" })
     .json(new ApiResponse(200, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
     }, "Token refreshed successfully"));
};

export const logout = async (req, res) => {
  try {
    // 1. Try to clear refresh token from DB if we can resolve the user from cookies
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            const decoded = (await import("jsonwebtoken")).default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            if (decoded?.id) {
                await authService.logoutUser(decoded.id, decoded.role || "customer");
            }
        } catch (e) {
            // Silently ignore decode errors; we still want to clear cookies
        }
    }

    // 2. AGGRESSIVE COOKIE CLEARANCE
    // We clear with path: "/" and the same options used for setting
    const options = getCookieOptions(req);
    const clearOptions = { 
        ...options, 
        expires: new Date(0), 
        path: "/" 
    };

    res.status(200)
       .cookie("accessToken", "", clearOptions)
       .cookie("refreshToken", "", clearOptions)
       .json(new ApiResponse(200, null, "Logged out successfully"));
       
  } catch (error) {
    // If everything fails, still try to send a 200 to clear frontend state
    res.status(200).json(new ApiResponse(200, null, "Logged out (with errors)"));
  }
};

export const getMe = async (req, res) => {
  // Identify the class of logged in persona securely fetched from DB
  let currentUser = null;
  if (req.user.role?.toLowerCase() === "customer") {
      const Customer = (await import("../models/Customer.model.js")).default;
      const customerDoc = await Customer.findById(req.user.id).select("-password -__v").lean();
      if (customerDoc) currentUser = { ...customerDoc, role: "customer" };
  } else {
      const User = (await import("../models/User.model.js")).default;
      const userDoc = await User.findById(req.user.id).select("-password -__v -refreshToken").lean();
      if (userDoc) currentUser = userDoc;
  }

  if (!currentUser) throw new ApiError(404, "Account identity missing or revoked");
  if (currentUser.active === false || currentUser.deletedAt) throw new ApiError(403, "Account deactivated");

  res.status(200).json(new ApiResponse(200, currentUser, "Session strictly hydrated"));
};
