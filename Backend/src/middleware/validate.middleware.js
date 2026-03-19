export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: "Validation failed", 
      errors: err.issues ? err.issues.map(e => ({ code: e.code, message: e.message, path: e.path })) : []
    });
  }
};