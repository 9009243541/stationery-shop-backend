// const billService = require("./service");
// const Order = require("../order/model");
// const UserModel = require("../users/model");
// const PDFDocument = require("pdfkit");
// const { fromBuffer } = require("pdf2pic");
// const fs = require("fs").promises;
// const path = require("path");
// const sendEmail = require("../utils/sendEmail");
// const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");
// const mongoose = require("mongoose");
// const generateBillPdf = require("../utils/pdfTemplates/generateBillPdf");
// const billController = {};

// billController.generateBill = async (req, res) => {
//   try {
//     const { orderId, paymentMode } = req.body;
//     const { returnBlob, returnImage } = req.query;
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         status: "ERROR",
//         message: "Unauthorized: User ID not found in token",
//         data: null,
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({
//         status: "ERROR",
//         message: "Invalid order ID",
//         data: null,
//       });
//     }

//     const user = await UserModel.findById(userId)
//       .select("firstName lastName email")
//       .lean();
//     if (!user) {
//       return res.status(404).json({
//         status: "ERROR",
//         message: "User not found",
//         data: null,
//       });
//     }
//     const userName = `${user.firstName || "Valued"} ${
//       user.lastName || "Customer"
//     }`.trim();

//     const order = await Order.findById(orderId)
//       .populate({
//         path: "products.productId",
//         select: "productName mrp discount",
//         options: { toJSON: { virtuals: true }, toObject: { virtuals: true } }, // Include virtuals
//       })
//       .lean();
//     if (!order) {
//       return res.status(404).json({
//         status: "ERROR",
//         message: "Order not found",
//         data: null,
//       });
//     }

//     const bill = await billService.generateBill(userId, orderId, paymentMode);
//     if (!bill.invoiceNo) {
//       throw new Error("Invoice number not generated");
//     }

//     // Generate PDF in memory
//     const doc = new PDFDocument();
//     const buffers = [];
//     doc.on("data", buffers.push.bind(buffers));
//     let pdfBuffer;

//     doc.on("end", async () => {
//       pdfBuffer = Buffer.concat(buffers);

//       // Send email with PDF attachment
//       try {
//         await sendEmail({
//           to: order.email,
//           subject: `Invoice ${bill.invoiceNo} for Order ${order._id}`,
//           html: generateOrderEmail({
//             userName,
//             order,
//             deliveryAddress: order.deliveryAddress,
//             paymentMode: bill.paymentMode,
//             total: bill.totalAmount,
//             isBill: true,
//           }),
//           attachments: [
//             {
//               filename: `Invoice_${bill.invoiceNo}.pdf`,
//               content: pdfBuffer,
//               contentType: "application/pdf",
//             },
//           ],
//         });
//         console.log("✅ Email sent successfully to", order.email);
//       } catch (emailError) {
//         console.error("✉️ Email sending failed:", emailError);
//       }

//       // Return image if requested
//       if (returnImage === "true") {
//         const outputDir = path.join(__dirname, "../uploads/bills");
//         await fs.mkdir(outputDir, { recursive: true });
//         const outputPath = path.join(outputDir, `bill_${bill.invoiceNo}.png`);

//         const converter = fromBuffer(pdfBuffer, {
//           density: 100,
//           format: "png",
//           width: 600,
//           height: 800,
//         });
//         await converter.bulk(-1, {
//           outputDir,
//           outputFile: `bill_${bill.invoiceNo}`,
//         });

//         const imageUrl = `https://stationery-shop-backend-y2lb.onrender.com/uploads/bills/bill_${bill.invoiceNo}.png`;
//         return res.status(200).json({
//           status: "OK",
//           message: "Bill image generated successfully",
//           data: { imageUrl },
//         });
//       }

//       // Return PDF blob if requested
//       if (returnBlob === "true") {
//         res.set({
//           "Content-Type": "application/pdf",
//           "Content-Disposition": `inline; filename=Invoice_${bill.invoiceNo}.pdf`,
//           "Content-Length": pdfBuffer.length,
//         });
//         return res.send(pdfBuffer);
//       }

//       // Default JSON response
//       res.status(201).json({
//         status: "OK",
//         message: "Bill generated and sent successfully",
//         data: {
//           ...bill.toObject(),
//           createdAt: bill.createdAt.toLocaleString("en-IN", {
//             timeZone: "Asia/Kolkata",
//           }),
//           updatedAt: bill.updatedAt.toLocaleString("en-IN", {
//             timeZone: "Asia/Kolkata",
//           }),
//         },
//       });
//     });

//     // PDF content
//     // doc.fontSize(20).text("Order Invoice", { align: "center" });
//     // doc.moveDown();
//     // doc.fontSize(12).text(`Invoice No: ${bill.invoiceNo}`);
//     // doc.text(`Order ID: ${order._id}`);
//     // doc.text(`Customer: ${userName}`);
//     // doc.text(`Email: ${order.email}`);
//     // doc.text(`Address: ${order.deliveryAddress}`);
//     // doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);
//     // doc.moveDown();

//     // doc.text("Products:", { underline: true });
//     // order.products.forEach((p) => {
//     //   const price = p.price || (p.productId?.finalPrice ?? 0);
//     //   doc.text(
//     //     `${p.productId?.productName || p.name || "Unknown Product"} - Quantity: ${p.quantity} - Price: ₹${price} - Total: ₹${p.total || price * p.quantity}`
//     //   );
//     // });
//     // doc.moveDown();
//     // doc.text(`Total Amount: ₹${bill.totalAmount || order.totalAmount}`, { align: "right" });
//     // doc.text(`Payment Mode: ${bill.paymentMode || paymentMode}`, { align: "right" });
//     generateBillPdf(doc, { bill, order, user });
//     doc.end();
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
// api/src/bill/controller.js
// api/src/bill/controller.js
// api/src/bill/controller.js

// api/src/bill/controller.js
// api/src/bill/controller.js
const billService = require("./service");
const Order = require("../order/model");
const UserModel = require("../users/model");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
const sendEmail = require("../utils/sendEmail");
const generateOrderEmail = require("../utils/emailTemplates/orderConfirmation");
const mongoose = require("mongoose");
const generateBillHtml = require("../utils/pdfTemplates/generateBillHtml");

const billController = {};

billController.generateBill = async (req, res) => {
  let browser = null;
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

    const user = await UserModel.findById(userId)
      .select("firstName lastName email")
      .lean();
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found",
        data: null,
      });
    }
    const userName = `${user.firstName || "Valued"} ${
      user.lastName || "Customer"
    }`.trim();

    const order = await Order.findById(orderId)
      .populate({
        path: "products.productId",
        select: "productName mrp discount",
        options: { toJSON: { virtuals: true }, toObject: { virtuals: true } },
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

    // Debug: Log data
    console.log("Bill:", bill.toObject());
    console.log("Order:", order);
    console.log("User:", user);

    // Generate HTML
    const htmlContent = await generateBillHtml({
      bill: bill.toObject(),
      order,
      user,
    });
    console.log("HTML Content Length:", htmlContent.length);

    // Launch Puppeteer with explicit executable path for Render
    console.log("Launching Puppeteer...");
    // const puppeteerOptions = {
    //   headless: "new", // Use new headless mode
    //   args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    //   executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    // };

    const puppeteerOptions = {
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      executablePath:
        "C:/Users/HP/.cache/puppeteer/chrome/win64-139.0.7258.138/chrome-win64/chrome.exe",
    };
    browser = await puppeteer.launch(puppeteerOptions);
    console.log("Puppeteer launched successfully");

    const page = await browser.newPage();

    // Debug Puppeteer logs
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    page.on("error", (err) => console.log("PAGE ERROR:", err));
    page.on("requestfailed", (request) =>
      console.log("REQUEST FAILED:", request.url(), request.failure())
    );

    // Set content with relaxed waitUntil
    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded", // Even more relaxed
      timeout: 60000, // 60s
      baseUrl: process.env.BASE_URL || "http://localhost:3300",
    });

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Debug: Save rendered HTML and screenshot
    const renderedPath = path.join(__dirname, "../../../Uploads/rendered.html");
    console.log("Rendered HTML Path:", renderedPath);
    await fs.mkdir(path.join(__dirname, "../../../Uploads"), {
      recursive: true,
    });
    await fs.writeFile(renderedPath, await page.content());
    await page.screenshot({
      path: path.join(__dirname, "../../../Uploads/debug_screenshot.png"),
      fullPage: true,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      preferCSSPageSize: true,
    });

    // Debug: Save PDF
    await fs.writeFile(
      path.join(__dirname, "../../../Uploads/debug_pdf.pdf"),
      pdfBuffer
    );

    // Send email with PDF attachment
    try {
      await sendEmail({
        to: order.email || user.email,
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
      console.log("✅ Email sent successfully to", order.email || user.email);
    } catch (emailError) {
      console.error("✉️ Email sending failed:", emailError);
    }

    // Return image if requested
    if (returnImage === "true") {
      const outputDir = path.join(__dirname, "../../../Uploads/bills");
      await fs.mkdir(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, `bill_${bill.invoiceNo}.png`);

      await page.screenshot({ path: outputPath, fullPage: true });
      const imageUrl = `${
        process.env.BASE_URL || "http://localhost:3300"
      }/uploads/bills/bill_${bill.invoiceNo}.png`;
      await browser.close();

      return res.status(200).json({
        status: "OK",
        message: "Bill image generated successfully",
        data: { imageUrl },
      });
    }

    await browser.close();

    // Return PDF blob if requested
    if (returnBlob === "true") {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=Invoice_${bill.invoiceNo}.pdf`,
        "Content-Length": pdfBuffer.length,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });
      return res.send(pdfBuffer);
    }

    // Default JSON response
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
    if (browser) await browser.close();
    const statusCode =
      error.message.includes("not found") ||
      error.message.includes("authorized") ||
      error.message.includes("Invalid") ||
      error.message.includes("waitForTimeout") ||
      error.message.includes("Navigation timeout") ||
      error.message.includes("Could not find Chrome")
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
