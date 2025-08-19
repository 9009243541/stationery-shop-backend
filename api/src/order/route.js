const router = require("express").Router();
const orderController = require("./controller");
const validate = require("../middleware/validate");
const { orderValidation } = require("./orderValidation");
const authenticate = require("../middleware/authToken");

router.post(
  "/place-order",
  authenticate(),
  validate(orderValidation),
  orderController.placeOrder
);
router.get(
  "/my-orders",
  authenticate(),
  orderController.getUserOrders
);

module.exports = router;
