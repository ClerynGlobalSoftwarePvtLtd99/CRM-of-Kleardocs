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
     .cookie("refreshToken", result.refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), path: "/" }) 
     .cookie("accessToken", result.accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000), path: "/" }) 
     .json(new ApiResponse(200, {
        user: result.user || result.customer,
        accessToken: result.accessToken 
     }, "User logged in successfully"));
};

export const customerLogin = async (req, res) => {
  const result = await authService.loginCustomerAccount(req.body);
  
  res.status(200)
     .cookie("refreshToken", result.refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), path: "/" })
     .cookie("accessToken", result.accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000), path: "/" })
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
     .cookie("refreshToken", result.refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), path: "/" })
     .cookie("accessToken", result.accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000), path: "/" })
     .json(new ApiResponse(200, {
        accessToken: result.accessToken
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
    const clearOptions = { 
        ...cookieOptions, 
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
