const cartService = require("./service");
const CartController = {};

// Add product to cart
CartController.addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // get userId from token/middleware
    const { productId, quantity = 1 } = req.body;
    if (!userId || !productId) {
      return res.status(400).send({
        status: false,
        msg: "userId and productId are required",
      });
    }
    const cart = await cartService.addToCart(userId, productId, quantity);
    return res.status(200).send({
      status: true,
      msg: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

// Remove product from cart
CartController.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id; // get userId from token/middleware
    const { productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).send({
        status: false,
        msg: "userId and productId are required",
      });
    }
    const cart = await cartService.removeFromCart(userId, productId);
    return res.status(200).send({
      status: true,
      msg: "Product removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

// Update product quantity in cart
CartController.updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id; // get userId from token/middleware
    const { productId, quantity } = req.body;
    if (!userId || !productId || typeof quantity !== "number") {
      return res.status(400).send({
        status: false,
        msg: "userId, productId, and quantity are required",
      });
    }
    const cart = await cartService.updateQuantity(userId, productId, quantity);
    return res.status(200).send({
      status: true,
      msg: "Cart quantity updated",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

// Get cart for a user
CartController.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        status: false,
        msg: "userId is required",
      });
    }
    const cart = await cartService.getCart(userId);
    return res.status(200).send({
      status: true,
      msg: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

// Delete entire cart for a user
CartController.deleteCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        status: false,
        msg: "userId is required",
      });
    }
    const deletedCart = await cartService.deleteCart(userId);
    if (!deletedCart) {
      return res.status(404).send({
        status: false,
        msg: "Cart not found",
      });
    }
    return res.status(200).send({
      status: true,
      msg: "Cart deleted successfully",
      data: deletedCart,
    });
  } catch (error) {
    console.error("Delete cart error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
};

module.exports = CartController;
