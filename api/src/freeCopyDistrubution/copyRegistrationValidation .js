const Joi = require("joi");

const copyRegistrationValidation = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
  }),
  contact: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Contact is required",
      "string.pattern.base": "Contact must be a valid 10-digit number starting with 6-9",
    }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
});

module.exports = {
  copyRegistrationValidation,
};
