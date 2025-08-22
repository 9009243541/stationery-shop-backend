const billService = require("./service");
const Order = require("../order/model");
const UserModel = require("../users/model");
const generateOrderBillPDF = require("../utils/generateOrderBillPDF");
const sendEmail = require("../utils/sendEmail");
const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");

const billController = {};

billController.generateBill = async (req, res) => {
  try {
    const { orderId, paymentMode } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: "ERROR",
        message: "Unauthorized: User ID not found in token",
        data: null,
      });
    }

    // Generate bill
    const bill = await billService.generateBill(userId, orderId, paymentMode);

    if (!bill.invoiceNo) {
      throw new Error("Invoice number not generated");
    }

    // Fetch user and order details for email
    const user = await UserModel.findById(userId);
    const userName = `${user?.firstName || "Valued"} ${
      user?.lastName || "Customer"
    }`.trim();

    const order = await Order.findById(orderId).populate(
      "products.productId",
      "productName mrp discount"
    );

    if (!order) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Order not found",
        data: null,
      });
    }

    // Generate PDF
    let pdfPath;
    try {
      pdfPath = await generateOrderBillPDF({
        order,
        userName,
        deliveryAddress: order.deliveryAddress,
        bill,
      });
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      return res.status(500).json({
        status: "ERROR",
        message: `Failed to generate PDF: ${pdfError.message}`,
        data: null,
      });
    }

    // Send email with bill PDF
    try {
      await sendEmail({
        to: order.email,
        subject: `Invoice ${bill.invoiceNo} for Order ${order._id}`,
        html: generateOrderEmail({
          userName,
          order,
          deliveryAddress: order.deliveryAddress,
          paymentMode: bill.paymentMode,
          total: bill.totalAmount,
          isBill: true,
        }),
        attachments: [
          {
            filename: `Invoice_${bill.invoiceNo}.pdf`,
            path: pdfPath,
          },
        ],
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        status: "ERROR",
        message: `Failed to send email: ${emailError.message}`,
        data: null,
      });
    }

    // Respond with success
    res.status(201).json({
      status: "OK",
      message: "Bill generated and sent successfully",
      data: {
        ...bill.toObject(),
        createdAt: bill.createdAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        updatedAt: bill.updatedAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
    });
  } catch (error) {
    console.error("❌ Error generating bill:", error);
    const statusCode =
      error.message.includes("not found") ||
      error.message.includes("authorized") ||
      error.message.includes("Invalid")
        ? 400
        : 500;
    res.status(statusCode).json({
      status: "ERROR",
      message: error.message || "Something went wrong while generating bill",
      data: null,
    });
  }
};

billController.getMyBills = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: "ERROR",
        message: "Unauthorized: User ID not found in token",
        data: null,
      });
    }

    const bills = await billService.getBillsByUserId(userId);

    res.status(200).json({
      status: "OK",
      message: "Bills fetched successfully",
      data: bills.map((bill) => ({
        ...bill.toObject(),
        createdAt: bill.createdAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        updatedAt: bill.updatedAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching bills:", error);
    res.status(error.message.includes("not found") ? 404 : 500).json({
      status: "ERROR",
      message: error.message || "Something went wrong while fetching bills",
      data: null,
    });
  }
};

module.exports = billController;
