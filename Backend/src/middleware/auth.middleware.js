import jwt from "jsonwebtoken";
import { ApiError } from "../utils/response.js";

export const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Not authorized to access this route, please log in");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};