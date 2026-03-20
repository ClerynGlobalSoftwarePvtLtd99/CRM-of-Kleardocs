import { ApiError } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert generic errors to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Handle duplicate key errors (MongoDB)
  if (err.code === 11000) {
    const message = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please choose another value`;
    error = new ApiError(400, message);
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(", ");
    error = new ApiError(400, message);
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try Again!";
    error = new ApiError(401, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try Again!";
    error = new ApiError(401, message);
  }

  // Send standardized response
  return res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
  });
};