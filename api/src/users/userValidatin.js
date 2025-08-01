const Joi = require("joi");

// // ✅ Register User Validation Schema
// const registerUserValidation = Joi.object({
//   firstName: Joi.string()
//     .trim()
//     .pattern(/^[a-zA-Z]+$/)
//     .required()
//     .messages({
//       "string.empty": "First name is required",
//       "string.pattern.base": "Only letters are allowed in first name",
//     }),

//   lastName: Joi.string()
//     .trim()
//     .pattern(/^[a-zA-Z]+$/)
//     .required()
//     .messages({
//       "string.empty": "Last name is required",
//       "string.pattern.base": "Only letters are allowed in last name",
//     }),

//   age: Joi.number()
//     .required()
//     .min(1)
//     .max(100)
//     .messages({
//       "number.base": "Age must be a number",
//       "number.empty": "Age is required",
//       "number.min": "Age must be at least 1",
//       "number.max": "Age must be less than or equal to 100",
//     }),

//   email: Joi.string()
//     .email()
//     .lowercase()
//     .trim()
//     .required()
//     .messages({
//       "string.empty": "Email is required",
//       "string.email": "Enter a valid email",
//     }),

// mobile: Joi.string()
//   .pattern(/^[6-9]\d{9}$/)
//   .required()
//   .messages({
//     "string.empty": "Mobile number is required",
//     "string.pattern.base": "Mobile number must be 10 digits starting with 6-9",
//   }),


//   address: Joi.string()
//     .trim()
//     .min(5)
//     .required()
//     .messages({
//       "string.empty": "Address is required",
//       "string.min": "Address must be at least 5 characters",
//     }),

//   password: Joi.string()
//     .min(6)
//     .max(20)
//     .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/)
//     .required()
//     .messages({
//       "string.empty": "Password is required",
//       "string.min": "Password must be at least 6 characters",
//       "string.max": "Password must be at most 20 characters",
//       "string.pattern.base":
//         "Password must include lowercase, uppercase, number, and special character",
//     }),
// });





const registerUserValidation = Joi.object({
  firstName: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z]+$/)
    .required()
    .messages({
      "string.empty": "First name is required",
      "string.pattern.base": "Only letters are allowed in first name",
    }),

  lastName: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z]+$/)
    .required()
    .messages({
      "string.empty": "Last name is required",
      "string.pattern.base": "Only letters are allowed in last name",
    }),

  age: Joi.number()
    .required()
    .min(1)
    .max(100)
    .messages({
      "number.base": "Age must be a number",
      "number.empty": "Age is required",
      "number.min": "Age must be at least 1",
      "number.max": "Age must be less than or equal to 100",
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email",
    }),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits starting with 6-9",
    }),

  // address: Joi.string()
  //   .trim()
  //   .min(5)
  //   .required()
  //   .messages({
  //     "string.empty": "Address is required",
  //     "string.min": "Address must be at least 5 characters",
  //   }),

  password: Joi.string()
    .min(6)
    .max(20)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/)
    .when("googleId", {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    })
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be at most 20 characters",
      "string.pattern.base":
        "Password must include lowercase, uppercase, number, and special character",
    }),

  googleId: Joi.string().optional(),
  avatar: Joi.string().uri().optional(), // optional and must be valid URL if provided
});


// ✅ Login User Validation Schema
const loginUserValidation = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email",
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
    }),
});

module.exports = {
  registerUserValidation,
  loginUserValidation,
};