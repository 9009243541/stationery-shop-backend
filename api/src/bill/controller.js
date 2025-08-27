// const billService = require("./service");
// const Order = require("../order/model");
// const UserModel = require("../users/model");
// const generateOrderBillPDF = require("../utils/generateOrderBillPDF");
// const sendEmail = require("../utils/sendEmail");
// const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");

// const billController = {};

// billController.generateBill = async (req, res) => {
//   try {
//     const { orderId, paymentMode } = req.body;
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         status: "ERROR",
//         message: "Unauthorized: User ID not found in token",
//         data: null,
//       });
//     }

//     // Generate bill
//     const bill = await billService.generateBill(userId, orderId, paymentMode);

//     if (!bill.invoiceNo) {
//       throw new Error("Invoice number not generated");
//     }

//     // Fetch user and order details for email
//     const user = await UserModel.findById(userId);
//     const userName = `${user?.firstName || "Valued"} ${
//       user?.lastName || "Customer"
//     }`.trim();

//     const order = await Order.findById(orderId).populate(
//       "products.productId",
//       "productName mrp discount"
//     );

//     if (!order) {
//       return res.status(404).json({
//         status: "NOT_FOUND",
//         message: "Order not found",
//         data: null,
//       });
//     }

//     // Generate PDF
//     let pdfPath;
//     try {
//       pdfPath = await generateOrderBillPDF({
//         order,
//         userName,
//         deliveryAddress: order.deliveryAddress,
//         bill,
//       });
//     } catch (pdfError) {
//       console.error("PDF generation failed:", pdfError);
//       return res.status(500).json({
//         status: "ERROR",
//         message: `Failed to generate PDF: ${pdfError.message}`,
//         data: null,
//       });
//     }

//     // Send email with bill PDF
//     try {
//       await sendEmail({
//         to: order.email,
//         subject: `Invoice ${bill.invoiceNo} for Order ${order._id}`,
//         html: generateOrderEmail({
//           userName,
//           order,
//           deliveryAddress: order.deliveryAddress,
//           paymentMode: bill.paymentMode,
//           total: bill.totalAmount,
//           isBill: true,
//         }),
//         attachments: [
//           {
//             filename: `Invoice_${bill.invoiceNo}.pdf`,
//             path: pdfPath,
//           },
//         ],
//       });
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//       return res.status(500).json({
//         status: "ERROR",
//         message: `Failed to send email: ${emailError.message}`,
//         data: null,
//       });
//     }

//     // Respond with success
//     res.status(201).json({
//       status: "OK",
//       message: "Bill generated and sent successfully",
//       data: {
//         ...bill.toObject(),
//         createdAt: bill.createdAt.toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//         updatedAt: bill.updatedAt.toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error generating bill:", error);
//     const statusCode =
//       error.message.includes("not found") ||
//       error.message.includes("authorized") ||
//       error.message.includes("Invalid")
//         ? 400
//         : 500;
//     res.status(statusCode).json({
//       status: "ERROR",
//       message: error.message || "Something went wrong while generating bill",
//       data: null,
//     });
//   }
// };

// billController.getMyBills = async (req, res) => {
//   try {
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         status: "ERROR",
//         message: "Unauthorized: User ID not found in token",
//         data: null,
//       });
//     }

//     const bills = await billService.getBillsByUserId(userId);

//     res.status(200).json({
//       status: "OK",
//       message: "Bills fetched successfully",
//       data: bills.map((bill) => ({
//         ...bill.toObject(),
//         createdAt: bill.createdAt.toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//         updatedAt: bill.updatedAt.toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//       })),
//     });
//   } catch (error) {
//     console.error("❌ Error fetching bills:", error);
//     res.status(error.message.includes("not found") ? 404 : 500).json({
//       status: "ERROR",
//       message: error.message || "Something went wrong while fetching bills",
//       data: null,
//     });
//   }
// };

// module.exports = billController;
const billService = require("./service");
const Order = require("../order/model");
const UserModel = require("../users/model");
const PDFDocument = require("pdfkit");
const { fromBuffer } = require("pdf2pic");
const fs = require("fs").promises;
const path = require("path");
const sendEmail = require("../utils/sendEmail");
const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");
const mongoose=require('mongoose')
const billController = {};

billController.generateBill = async (req, res) => {
  try {
    const { orderId, paymentMode } = req.body;
    const { returnBlob, returnImage } = req.query;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: "ERROR",
        message: "Unauthorized: User ID not found in token",
        data: null,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid order ID",
        data: null,
      });
    }

    const user = await UserModel.findById(userId).select("firstName lastName email").lean();
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found",
        data: null,
      });
    }
    const userName = `${user.firstName || "Valued"} ${user.lastName || "Customer"}`.trim();

    const order = await Order.findById(orderId)
      .populate({
        path: "products.productId",
        select: "productName mrp discount",
        options: { toJSON: { virtuals: true }, toObject: { virtuals: true } }, // Include virtuals
      })
      .lean();
    if (!order) {
      return res.status(404).json({
        status: "ERROR",
        message: "Order not found",
        data: null,
      });
    }

    const bill = await billService.generateBill(userId, orderId, paymentMode);
    if (!bill.invoiceNo) {
      throw new Error("Invoice number not generated");
    }

    // Generate PDF in memory
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    let pdfBuffer;

    doc.on("end", async () => {
      pdfBuffer = Buffer.concat(buffers);

      // Send email with PDF attachment
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
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        });
        console.log("✅ Email sent successfully to", order.email);
      } catch (emailError) {
        console.error("✉️ Email sending failed:", emailError);
      }

      // Return image if requested
      if (returnImage === "true") {
        const outputDir = path.join(__dirname, "../uploads/bills");
        await fs.mkdir(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, `bill_${bill.invoiceNo}.png`);

        const converter = fromBuffer(pdfBuffer, {
          density: 100,
          format: "png",
          width: 600,
          height: 800,
        });
        await converter.bulk(-1, { outputDir, outputFile: `bill_${bill.invoiceNo}` });

        const imageUrl = `https://stationery-shop-backend-y2lb.onrender.com/uploads/bills/bill_${bill.invoiceNo}.png`;
        return res.status(200).json({
          status: "OK",
          message: "Bill image generated successfully",
          data: { imageUrl },
        });
      }

      // Return PDF blob if requested
      if (returnBlob === "true") {
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename=Invoice_${bill.invoiceNo}.pdf`,
          "Content-Length": pdfBuffer.length,
        });
        return res.send(pdfBuffer);
      }

      // Default JSON response
      res.status(201).json({
        status: "OK",
        message: "Bill generated and sent successfully",
        data: {
          ...bill.toObject(),
          createdAt: bill.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          updatedAt: bill.updatedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        },
      });
    });

    // PDF content
    doc.fontSize(20).text("Order Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${bill.invoiceNo}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${userName}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Address: ${order.deliveryAddress}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);
    doc.moveDown();

    doc.text("Products:", { underline: true });
    order.products.forEach((p) => {
      const price = p.price || (p.productId?.finalPrice ?? 0);
      doc.text(
        `${p.productId?.productName || p.name || "Unknown Product"} - Quantity: ${p.quantity} - Price: ₹${price} - Total: ₹${p.total || price * p.quantity}`
      );
    });
    doc.moveDown();
    doc.text(`Total Amount: ₹${bill.totalAmount || order.totalAmount}`, { align: "right" });
    doc.text(`Payment Mode: ${bill.paymentMode || paymentMode}`, { align: "right" });

    doc.end();
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
        createdAt: bill.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        updatedAt: bill.updatedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
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