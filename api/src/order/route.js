const router = require("express").Router();
const orderController = require("./controller");
const validate = require("../middleware/validate");
const { orderValidation } = require("./orderValidation");
const middleware = require("../middleware/authToken");

router.post(
  "/place-order",
  middleware,
  validate(orderValidation),
  orderController.placeOrder
);

module.exports = router;
