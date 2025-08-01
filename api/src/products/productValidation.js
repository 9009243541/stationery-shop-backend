const Joi = require("joi");

const productSchema = Joi.object({
  image: Joi.string().uri().allow("").messages({
    "string.uri": "Image must be a valid URL",
  }),

  productName: Joi.string().trim().required().messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name cannot be empty",
    "any.required": "Product name is required",
  }),

  category: Joi.string().required().messages({
    "string.base": "Category ID must be a string",
    "any.required": "Category is required",
  }),

  brand: Joi.string().trim().required().messages({
    "string.base": "Brand must be a string",
    "string.empty": "Brand cannot be empty",
    "any.required": "Brand is required",
  }),

  mrp: Joi.number().required().min(0).messages({
    "number.base": "MRP must be a number",
    "number.min": "MRP cannot be negative",
    "any.required": "MRP is required",
  }),

  rate: Joi.number().required().min(0).messages({
    "number.base": "Rate must be a number",
    "number.min": "Rate cannot be negative",
    "any.required": "Rate is required",
  }),

  stock: Joi.number().required().min(0).messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),

  unit: Joi.string()
    .valid("piece", "pack", "box", "dozen")
    .required()
    .messages({
      "any.only": "Unit must be one of: piece, pack, box, dozen",
      "any.required": "Unit is required",
    }),

  description: Joi.string().allow("").trim().messages({
    "string.base": "Description must be a string",
  }),

  isFeatured: Joi.boolean().messages({
    "boolean.base": "isFeatured must be a boolean value",
  }),
});

module.exports = { productSchema };
