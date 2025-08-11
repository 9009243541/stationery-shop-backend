const Joi = require("joi");

const productSchema = Joi.object({
  image: Joi.string().uri().allow("").messages({
    "string.uri": "Image must be a valid URL",
  }),

  productTitle: Joi.string().trim().required().messages({
    "string.base": "Product title must be a string",
    "string.empty": "Product title cannot be empty",
    "any.required": "Product title is required",
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

  discount: Joi.number().required().min(0).messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount cannot be negative",
    "any.required": "Discount is required",
  }),

  availability: Joi.boolean().required().messages({
    "boolean.base": "Availability must be true or false",
    "any.required": "Availability is required",
  }),

  description: Joi.string().allow("").trim().messages({
    "string.base": "Description must be a string",
  }),

  rating: Joi.number().min(0).max(5).messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating cannot be less than 0",
    "number.max": "Rating cannot be more than 5",
  }),

  review: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Review must be an array of strings",
  }),
});

const updateProductSchema = Joi.object({
  image: Joi.string().uri().allow("").messages({
    "string.uri": "Image must be a valid URL",
  }),

  productTitle: Joi.string().trim().messages({
    "string.base": "Product title must be a string",
    "string.empty": "Product title cannot be empty",
  }),

  productName: Joi.string().trim().messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name cannot be empty",
  }),

  category: Joi.string().messages({
    "string.base": "Category ID must be a string",
  }),

  brand: Joi.string().trim().messages({
    "string.base": "Brand must be a string",
    "string.empty": "Brand cannot be empty",
  }),

  mrp: Joi.number().min(0).messages({
    "number.base": "MRP must be a number",
    "number.min": "MRP cannot be negative",
  }),

  discount: Joi.number().min(0).messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount cannot be negative",
  }),

  availability: Joi.boolean().messages({
    "boolean.base": "Availability must be true or false",
  }),

  description: Joi.string().allow("").trim().messages({
    "string.base": "Description must be a string",
  }),

  rating: Joi.number().min(0).max(5).messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating cannot be less than 0",
    "number.max": "Rating cannot be more than 5",
  }),

  review: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Review must be an array of strings",
  }),
}).unknown(false); 



module.exports = { productSchema,updateProductSchema };
