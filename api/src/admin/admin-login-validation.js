const Joi = require("joi");

const adminLoginValidationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = adminLoginValidationSchema;
