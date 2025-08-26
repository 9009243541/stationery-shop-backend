const mongoose = require("mongoose");
const orderService = require("./service");
const sendEmail = require("../utils/sendEmail");
const UserModel = require("../users/model");
const Cart = require("../cart/model");
const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");
const Product=require('../products/model')
const orderController = {};
orderController.placeOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        status: "ERROR",
        message: "Unauthorized: user missing",
        data: null,
      });
    }

    const userId = req.user._id;
    const { deliveryAddress, phone, email, paymentMode, location } = req.body || {};

    // Validate required fields
    if (!deliveryAddress || !phone || !email || !paymentMode || !location?.latitude || !location?.longitude) {
      return res.status(400).json({
        status: "ERROR",
        message: "Missing required fields",
        data: null,
      });
    }

    // Cast userId to ObjectId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error("❌ Invalid userId format:", userId, err);
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid user ID",
        data: null,
      });
    }

    // Fetch cart and populate products
    const userCart = await Cart.findOne({ user: userObjectId })
      .populate({
        path: "products.product",
        select: "productName finalPrice",
      })
      .lean();

    console.log("🛒 UserCart:", JSON.stringify(userCart, null, 2));

    // Check if cart exists
    if (!userCart) {
      console.log("❌ No cart found for user:", userId);
      return res.status(400).json({
        status: "ERROR",
        message: "No cart found for user. Please add items to cart.",
        data: null,
      });
    }

    // Check if cart has products
    if (!userCart.products || userCart.products.length === 0) {
      console.log("❌ Cart is empty for user:", userId);
      return res.status(400).json({
        status: "ERROR",
        message: "Cart is empty. Cannot place order.",
        data: null,
      });
    }

    // Prepare order products
    const products = userCart.products
      .filter((item) => {
        if (!item?.product) {
          console.warn("⚠️ Invalid product in cart:", JSON.stringify(item, null, 2));
          return false;
        }
        return true;
      })
      .map((item) => {
        const price = Number(item.product.finalPrice ?? 0);
        console.log(price,'price')
        const qty = Number(item.quantity ?? 1);
        return {
          productId: item.product._id,
          name: item.product.productName || "Unknown Product",
          price,
          quantity: qty,
          total: price * qty,
        };
      });

    // Check if any valid products remain
    if (products.length === 0) {
      console.log("❌ No valid products after filtering for user:", userId);
      // Clean up cart by removing invalid products
      await Cart.findOneAndUpdate(
        { user: userObjectId },
        { $pull: { products: { product: { $exists: false } } } }
      );
      return res.status(400).json({
        status: "ERROR",
        message: "Cart contains invalid or unavailable products",
        data: null,
      });
    }

    // Fetch user info for email
    const user = await UserModel.findById(userObjectId).select("firstName lastName email").lean();
    const userName = `${user?.firstName || "Valued"} ${user?.lastName || "Customer"}`.trim();

    // Create order
    const order = await orderService.placeOrder({
      userId,
      deliveryAddress,
      phone,
      email,
      paymentMode,
      location,
      products,
    });

    // Send email (non-blocking)
    try {
      await sendEmail({
        to: email,
        subject: "Order Confirmation",
        html: generateOrderEmail({ userName, order, deliveryAddress }),
      });
    } catch (err) {
      console.error("✉️ Email send failed for order:", order._id, err);
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: userObjectId },
      { $set: { products: [] } },
      { new: true }
    );

    return res.status(201).json({
      status: "OK",
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Something went wrong while placing the order",
      data: null,
    });
  }
};



orderController.getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        status: "ERROR",
        message: "Unauthorized: user missing",
        data: null,
      });
    }

    const userId = req.user._id;
    const orders = await orderService.getOrdersByUserId(userId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "No orders found for this user",
        data: [],
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Something went wrong while fetching orders",
      data: null,
    });
  }
};

/**
 * GET /order/my-orders
 * Requires: auth (req.user)
 */

module.exports = orderController;
