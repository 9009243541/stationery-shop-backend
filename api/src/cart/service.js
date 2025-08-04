const Cart = require("./model");

const cartService = {};

// Add product to cart (create cart if not exists)
cartService.addToCart = async (userId, productId, quantity = 1) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      products: [{ product: productId, quantity }],
    });
  } else {
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString()
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();
  }
  return cart.populate("products.product");
};

// Remove product from cart
cartService.removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { products: { product: productId } } },
    { new: true }
  ).populate("products.product");
  return cart;
};

// Update product quantity in cart
cartService.updateQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;
  const productItem = cart.products.find(
    (item) => item.product.toString() === productId.toString()
  );
  if (productItem) {
    productItem.quantity = quantity;
    await cart.save();
  }
  return cart.populate("products.product");
};

// Get cart for a user
cartService.getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("products.product");
};

// Delete entire cart for a user
cartService.deleteCart = async (userId) => {
  const cart = await Cart.findOneAndDelete({ user: userId });
  return cart;
};

module.exports = cartService;