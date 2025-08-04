const wishlistService = require("./service");
const WishlistController = {};

// Add product to wishlist
WishlistController.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // comes from token
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).send({
        status: false,
        msg: "productId is required",
      });
    }

    const wishlist = await wishlistService.addToWishlist(userId, productId);
    return res.status(200).send({
      status: true,
      msg: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

// Remove product from wishlist
WishlistController.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // comes from token
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).send({
        status: false,
        msg: "productId is required",
      });
    }

    const wishlist = await wishlistService.removeFromWishlist(
      userId,
      productId
    );

    return res.status(200).send({
      status: true,
      msg: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

// Get wishlist for a user
WishlistController.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        status: false,
        msg: "userId is required",
      });
    }

    const wishlist = await wishlistService.getWishlist(userId);
    return res.status(200).send({
      status: true,
      msg: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

// Delete entire wishlist for a user
WishlistController.deleteWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        status: false,
        msg: "userId is required",
      });
    }
    await wishlistService.deleteWishlist(userId);
    return res.status(200).send({
      status: true,
      msg: "Wishlist deleted successfully",
    });
  } catch (error) {
    console.error("Delete wishlist error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

module.exports = WishlistController;

// const Wishlist = require("../models/Wishlist");
// const Product = require("../models/Product");

// exports.getWishlist = async (req, res) => {
//   try {
//     const userId = req.userId; // assuming user is authenticated
//     const items = await Wishlist.find({ userId }).populate("productId");
//     const formatted = items.map(item => ({
//       _id: item._id,
//       name: item.productId.name,
//       price: item.productId.price,
//       image: item.productId.image
//     }));
//     res.json(formatted);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch wishlist." });
//   }
// };

// exports.addToWishlist = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.userId;
//     const exists = await Wishlist.findOne({ userId, productId });
//     if (exists) return res.status(400).json({ message: "Already in wishlist" });

//     const wishlistItem = new Wishlist({ userId, productId });
//     await wishlistItem.save();
//     res.status(201).json({ message: "Added to wishlist" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add to wishlist." });
//   }
// };

// exports.removeFromWishlist = async (req, res) => {
//   try {
//     const id = req.params.id;
//     await Wishlist.findByIdAndDelete(id);
//     res.json({ message: "Removed from wishlist" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to remove item." });
//   }
// };
