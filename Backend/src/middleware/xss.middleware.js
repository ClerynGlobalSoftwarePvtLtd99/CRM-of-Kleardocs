import xss from "xss";
import mongoSanitize from "express-mongo-sanitize";

export const securityMiddleware = (req, res, next) => {
  // MongoDB Sanitize is already applied globally in app.js via app.use(mongoSanitize())
  // We only need redundant checks here if we want to be paranoid, but in Express 5
  // mutating req.query/req.params can trigger "Only a getter" errors.

  // XSS Sanitize (focus on req.body which is usually where persistent XSS payloads live)
  if (req.body && typeof req.body === "object") {
    cleanObjInPlace(req.body);
  }

  // Note: For req.query and req.params, Express 5 uses getters. 
  // If you need to clean them, you must do so at the point of use or 
  // ensure the cleanup doesn't attempt to reassign protected properties.
  
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
