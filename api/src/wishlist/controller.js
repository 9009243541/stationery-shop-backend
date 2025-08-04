const wishlistService = require("./service");
// const productService = require("../products/service");
const WishlistController = {};

// Add product to wishlist
WishlistController.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).send({
        status: false,
        message: "productId is required",
      });
    }
    
    //agar productId exist nhi karti he to logic likhna baki he

    // Check if product exists
    // const product = await productService.getProductById(productId);
    // if (!product) {
    //   return res.status(404).send({
    //     status: false,
    //     message: "Product not found",
    //   });
    // }
    const wishlist = await wishlistService.addToWishlist(userId, productId);
    return res.status(200).send({
      status: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

// Remove product from wishlist
WishlistController.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).send({
        status: false,
        message: "productId is required",
      });
    }

    const wishlist = await wishlistService.removeFromWishlist(
      userId,
      productId
    );

    return res.status(200).send({
      status: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

// Get wishlist for a user
WishlistController.getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).send({
        status: false,
        message: "User ID is missing in token",
      });
    }

    const wishlist = await wishlistService.getWishlist(userId);
    return res.status(200).send({
      status: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

// Delete entire wishlist for a user
WishlistController.deleteWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).send({
        status: false,
        message: "userId is required",
      });
    }
    await wishlistService.deleteWishlist(userId);
    return res.status(200).send({
      status: true,
      message: "Wishlist deleted successfully",
    });
  } catch (error) {
    console.error("Delete wishlist error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = WishlistController;
