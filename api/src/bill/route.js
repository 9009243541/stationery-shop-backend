const express = require("express");
const router = express.Router();
const billController = require("./controller");
const authenticate = require("../middleware/authToken");
const validate = require("../middleware/validate");
const Joi = require("joi");

const billValidation = Joi.object({
  orderId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.base": "Order ID must be a string",
      "string.pattern.base": "Order ID must be a valid ObjectId",
      "any.required": "Order ID is required",
    }),
  paymentMode: Joi.string()
    .valid("cash", "upi", "card", "netbanking")
    .required()
    .messages({
      "string.base": "Payment mode must be a string",
      "any.only": "Payment mode must be cash, upi, card, or netbanking",
      "any.required": "Payment mode is required",
    }),
});

router.post(
  "/generate-bill",
  authenticate(),
  validate(billValidation),
  billController.generateBill
);

router.get("/my-bills", authenticate(), billController.getMyBills);

module.exports = router;