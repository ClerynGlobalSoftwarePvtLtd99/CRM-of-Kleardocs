import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/response.js";

const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  httpOnly: true, // Prevents XSS attacks (JS cannot access the cookie)
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict" // Prevents CSRF attacks
};

export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  
  // Note: if you want auto-login on register, you can generate token in service and return {user, token}. 
  // Assuming standard register doesn't return token yet, but if it did:
  // res.cookie("token", user.token, cookieOptions);

  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  
  res.status(200)
     .cookie("token", result.token, cookieOptions)
     .json(new ApiResponse(200, result, "User logged in successfully"));
};