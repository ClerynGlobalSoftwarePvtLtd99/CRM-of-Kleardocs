import xss from "xss";
import mongoSanitize from "express-mongo-sanitize";

export const securityMiddleware = (req, res, next) => {
  // Manual MongoDB Sanitization for Body (Safe in Express 5)
  if (req.body && typeof req.body === "object") {
    mongoSanitize.sanitize(req.body);
  }

  // XSS Sanitize for Body (Safe in Express 5 as req.body is not a protected getter)
  if (req.body && typeof req.body === "object") {
    cleanObjInPlace(req.body);
  }

  // NOTE: In Express 5, req.query and req.params are READ-ONLY getters.
  // Standard hpp() and mongoSanitize() middlewares often crash by trying to reassign them.
  // We avoid mutating them here to prevent "Cannot set property query" errors.

  next();
};

function cleanObjInPlace(obj) {
  if (typeof obj !== "object" || obj === null) return;

  for (let key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === "object") {
      cleanObjInPlace(obj[key]);
    }
  }
}
