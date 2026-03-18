import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.json({ status: true, data: user });
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json({ status: true, ...result });
};