const router = require("express").Router();
const cartController = require("./controller");
const authenticate = require("../middleware/authToken");

// Add product to cart
router.post("/add", authenticate(), cartController.addToCart);

// Remove product from cart
router.post("/remove", authenticate(), cartController.removeFromCart);

// Update product quantity in cart
router.post("/update-quantity", authenticate(), cartController.updateQuantity);

// Get cart for a user
router.get("/get", authenticate(), cartController.getCart);

// Delete entire cart for a user
router.delete("/delete", authenticate(), cartController.deleteCart);

module.exports = router;
