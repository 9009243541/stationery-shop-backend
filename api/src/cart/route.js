const router = require("express").Router();
const cartController = require("./controller");
const middleware = require("../middleware/authToken");

// Add product to cart
router.post("/add", middleware, cartController.addToCart);

// Remove product from cart
router.post("/remove", middleware, cartController.removeFromCart);

// Update product quantity in cart
router.post("/update-quantity", middleware, cartController.updateQuantity);

// Get cart for a user
router.get("/get/:userId", cartController.getCart);

// Delete entire cart for a user
router.delete("/delete/:userId", cartController.deleteCart);

module.exports = router;
