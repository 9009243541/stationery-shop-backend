const router = require("express").Router();
const wishlistController = require("./controller");
const middleware = require("../middleware/authToken");
// Add product to wishlist
router.post("/add", middleware, wishlistController.addToWishlist);

// Remove product from wishlist
router.post("/remove", middleware, wishlistController.removeFromWishlist);

// Get wishlist for a user
router.get("/get/:userId", wishlistController.getWishlist);

// Delete entire wishlist for a user
router.delete("/delete/:userId", middleware, wishlistController.deleteWishlist);

module.exports = router;
