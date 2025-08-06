const Joi = require("joi");

const orderValidation = Joi.object({
  deliveryAddress: Joi.string().min(5).required().messages({
    "string.empty": "Delivery address is required",
    "string.min": "Delivery address must be at least 5 characters",
  }),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be 10 digits starting with 6-9",
    }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
  location: Joi.object({
    latitude: Joi.string().required().messages({
      "string.empty": "Latitude is required",
    }),
    longitude: Joi.string().required().messages({
      "string.empty": "Longitude is required",
    }),
  }),
});

module.exports = { orderValidation };
