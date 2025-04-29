const { body, param, validationResult } = require("express-validator");

// Middleware untuk mengecek hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validasi untuk CREATE USER
const createUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password min 8 characters"),
  body("phone").notEmpty().withMessage("Phone is required"),
  validate,
];

// Validasi untuk UPDATE USER
const updateUserValidation = [
  param("id").isInt().withMessage("ID must be a number"),
  body("email").optional().isEmail().withMessage("Valid email required"),
  validate,
];

// Validasi untuk GET/DELETE BY ID
const idValidation = [
  param("id").isInt().withMessage("ID must be a number"),
  validate,
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  idValidation,
};
