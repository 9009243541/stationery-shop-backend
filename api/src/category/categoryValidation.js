const Joi = require("joi");
const categorySchema = Joi.object({
  categoryname: Joi.string()
    .min(3)
    .max(30)
    .trim()
    .regex(/^[a-zA-Z0-9 ]+$/)
    .required()
    .messages({
      "string.base": "Category name should be a text",
      "string.empty": "Category name cannot be empty",
      "string.min": "Category name should be at least 3 characters long",
      "string.max": "Category name should not exceed 30 characters",
      "string.pattern.base":
        "Category name can only contain letters, numbers, and spaces",
      "any.required": "Category name is required",
    }),
});
module.exports = categorySchema;
