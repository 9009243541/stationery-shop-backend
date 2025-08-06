const orderService = require("./service");
const sendEmail = require("../utils/sendEmail");
const UserModel = require("../users/model"); // Adjust path as needed
const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");
const orderController = {};

orderController.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      deliveryAddress,
      phone,
      email,
      location: { latitude, longitude },
    } = req.body;

    // ✅ Get user's first and last name
    const user = await UserModel.findById(userId);
    const userName = `${user?.firstName || "Valued"} ${
      user?.lastName || "Customer"
    }`.trim();

    const order = await orderService.placeOrder({
      userId,
      deliveryAddress,
      phone,
      email,
      location: { latitude, longitude },
    });

    // ✅ Send confirmation email using Nodemailer
    await sendEmail({
      to: email,
      subject: "Order Confirmation",
      html: generateOrderEmail({ userName, order, deliveryAddress }),
    });

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
    });
  }
};

module.exports = orderController;
