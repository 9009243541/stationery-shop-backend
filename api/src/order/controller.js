
const orderService = require("./service");
const sendEmail = require("../utils/sendEmail");
const UserModel = require("../users/model");
const Cart = require("../cart/model");
const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");

const orderController = {};

// ✅ Place Order Function
orderController.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      deliveryAddress,
      phone,
      email,
      location: { latitude, longitude },
    } = req.body;

    // ✅ Step 1: Fetch user cart
    const userCart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({
        status: "Error",
        message: "Cart is empty. Cannot place order.",
        data: null,
      });
    }

    console.log("User Cart Found:", userCart);

    // ✅ Step 2: Prepare product data from cart
    const products = userCart.products.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    // ✅ Step 3: Get user name for email
    const user = await UserModel.findById(userId);
    const userName = `${user?.firstName || "Valued"} ${
      user?.lastName || "Customer"
    }`.trim();

    // ✅ Step 4: Create order via service
    const order = await orderService.placeOrder({
      userId,
      deliveryAddress,
      phone,
      email,
      location: { latitude, longitude },
      products,
    });

    // ✅ Step 5: Send confirmation email
    await sendEmail({
      to: email,
      subject: "Order Confirmation",
      html: generateOrderEmail({ userName, order, deliveryAddress }),
    });

    // ✅ Step 6: Clear the cart
    await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [] } });

    // ✅ Step 7: Respond success
    res.status(201).json({
      status: "OK",
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Something went wrong while placing the order",
      data: null,
    });
  }
};
orderController.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderService.getOrdersByUserId(userId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "No orders found for this user",
        data: [],
      });
    }

    res.status(200).json({
      status: "OK",
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Something went wrong while fetching orders",
      data: null,
    });
  }
};
module.exports = orderController;
