import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }
  next();
};

export const validateSignup = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["patient", "doctor"]).withMessage("Role must be patient or doctor")
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

export const validateAppointment = [
  body("doctorId").isMongoId().withMessage("Valid doctor ID is required"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("slot").notEmpty().withMessage("Time slot is required"),
  body("reason").trim().notEmpty().withMessage("Reason for appointment is required")
];