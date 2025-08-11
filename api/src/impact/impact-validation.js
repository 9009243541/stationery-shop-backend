const Joi = require("joi");

const impactValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "any.required": "Title is required",
  }),
  description: Joi.string().allow("").optional(),
}).unknown(true); // to allow multer file

module.exports = impactValidationSchema;
