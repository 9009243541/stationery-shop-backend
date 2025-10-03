const Bill = require("./model");
const Order = require("../order/model");
const User = require("../users/model");
const { generateBillPDF } = require("../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../utils/mailer");
const fs = require("fs");

// =========================
// Create a new bill
// =========================
exports.createBill = async (req, res) => {
  try {
    const { orderId, userId, totalAmount, paymentMode } = req.body;

    if (!orderId || !userId || !totalAmount || !paymentMode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: orderId, userId, totalAmount, paymentMode",
      });
    }

    // Fetch order with products
    const order = await Order.findById(orderId).populate({
      path: "products.productId",
      select: "productName mrp discount image",
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Check if bill already exists
    let bill = await Bill.findOne({ orderId });
    if (!bill) {
      bill = new Bill({ orderId, userId, totalAmount, paymentMode });
      await bill.save();
    }

    // Response with proper order & product info
    const billResponse = {
      ...bill.toObject(),
      order: {
        _id: order._id,
        products: order.products.map((p) => ({
          productId: p.productId._id,
          name: p.productId.productName,
          mrp: p.productId.mrp,
          discount: p.productId.discount,
          image: p.productId.image,
          quantity: p.quantity,
          price: p.price,
          total: p.total,
        })),
        totalAmount: order.totalAmount,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
      },
      user: {
        name: order.userId?.name || "Customer",
        email: order.userId?.email || "unknown@example.com",
      },
    };

    res.status(201).json({ success: true, bill: billResponse });
  } catch (error) {
    console.error("❌ Error creating bill:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// View bill in browser (PDF)
// =========================
exports.viewBill = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find bill by orderId
    const bill = await Bill.findOne({ orderId }).populate("orderId").populate("userId");
    if (!bill) return res.status(404).send("Bill not found");

    const order = bill.orderId;
    const user = bill.userId;

    const billData = {
      ...bill.toObject(),
      order: {
        _id: order._id,
        products: order.products.map((p) => ({
          name: p.productId?.productName || p.name,
          quantity: p.quantity,
          price: p.price,
          total: p.total,
        })),
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
      },
      user: {
        name: user?.name || "Customer",
        email: user?.email || "unknown@example.com",
      },
    };

    const pdfPath = await generateBillPDF(billData);
    res.setHeader("Content-Type", "application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.error("❌ Error generating bill:", error);
    res.status(500).send("Error generating bill: " + error.message);
  }
};

// =========================
// Send bill via email
// =========================
exports.sendBillEmail = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find bill by orderId
    const bill = await Bill.findOne({ orderId }).populate("orderId").populate("userId");
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

    const user = bill.userId;
    if (!user?.email) {
      return res.status(400).json({ success: false, message: "User email not found" });
    }

    const pdfPath = await generateBillPDF({
      ...bill.toObject(),
      order: {
        _id: bill.orderId._id,
        products: bill.orderId.products.map((p) => ({
          name: p.productId?.productName || p.name,
          quantity: p.quantity,
          price: p.price,
          total: p.total,
        })),
        totalAmount: bill.orderId.totalAmount,
        deliveryAddress: bill.orderId.deliveryAddress,
      },
      user: {
        name: user.name,
        email: user.email,
      },
    });

    await sendInvoiceEmail(user.email, pdfPath, bill.invoiceNo);

    res.json({ success: true, message: "Invoice sent to registered email" });
  } catch (error) {
    console.error("❌ Error sending bill email:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
