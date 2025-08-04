const Wishlist = require("./model");

const wishlistService = {};

// Add product to wishlist
wishlistService.addToWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [productId] });
  } else {
    const exists = wishlist.products.some(
      (p) => p.toString() === productId.toString()
    );
    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  return await wishlist.populate("products");
};

// Remove product from wishlist
wishlistService.removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { products: productId } },
    { new: true }
  ).populate("products");

  return wishlist || null;
};

// Get wishlist
wishlistService.getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
  return wishlist || null;
};

// Delete wishlist
wishlistService.deleteWishlist = async (userId) => {
  return await Wishlist.findOneAndDelete({ user: userId });
};

module.exports = wishlistService;
