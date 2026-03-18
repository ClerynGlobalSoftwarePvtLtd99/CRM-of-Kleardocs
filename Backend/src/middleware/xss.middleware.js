import xss from "xss";
import mongoSanitize from "express-mongo-sanitize";

export const securityMiddleware = (req, res, next) => {
  // MongoDB Sanitize (mutates in-place)
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);

  // XSS Sanitize (mutates in-place)
  if (req.body) cleanObjInPlace(req.body);
  if (req.query) cleanObjInPlace(req.query);
  if (req.params) cleanObjInPlace(req.params);

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
