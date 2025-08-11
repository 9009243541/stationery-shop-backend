const router = require("express").Router();
const wishlistController = require("./controller");
const authenticate = require("../middleware/authToken");

// Add product to wishlist
router.post("/add", authenticate(), wishlistController.addToWishlist);

// Remove product from wishlist
router.post("/remove", authenticate(), wishlistController.removeFromWishlist);

// Get wishlist for a user
router.get("/get", authenticate(), wishlistController.getWishlist);

// Delete entire wishlist for a user
router.delete("/delete", authenticate(), wishlistController.deleteWishlist);

module.exports = router;
