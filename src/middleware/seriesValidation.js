const { body, param, validationResult } = require("express-validator");

// Middleware untuk menangani hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validasi untuk CREATE Series
const createSeriesValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("total_episode")
    .isInt({ min: 1 })
    .withMessage("Total episode must be a positive integer"),
  body("release_date")
    .isDate()
    .withMessage("Release date must be a valid date (YYYY-MM-DD)"),
  body("rating")
    .isLength({ max: 5 })
    .withMessage("Rating must be a maximum of 5 characters"),
  validate,
];

// Validasi untuk UPDATE Series
const updateSeriesValidation = [
  param("id").isInt().withMessage("ID must be a number"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("total_episode")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total episode must be a positive integer"),
  body("release_date")
    .optional()
    .isDate()
    .withMessage("Release date must be a valid date (YYYY-MM-DD)"),
  body("rating")
    .optional()
    .isLength({ max: 5 })
    .withMessage("Rating must be a maximum of 5 characters"),
  validate,
];

// Validasi untuk GET/DELETE BY ID
const idValidation = [
  param("id").isInt().withMessage("ID must be a number"),
  validate,
];

module.exports = {
  createSeriesValidation,
  updateSeriesValidation,
  idValidation,
};
