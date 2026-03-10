const { z } = require("zod");

module.exports = function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next({
        code: "VALIDATION_ERROR",
        message: err.errors[0].message,
        status: 422
      });
    }
  };
};
