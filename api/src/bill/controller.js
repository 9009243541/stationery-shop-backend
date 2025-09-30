const billService = require("./service");
const Order = require("../order/model");
const UserModel = require("../users/model");
const chromium = require("chrome-aws-lambda"); // use chrome-aws-lambda
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
        select: "productName mrp discount image",
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

    // Generate HTML
    const htmlContent = await generateBillHtml({ bill: bill.toObject(), order, user });

    // Launch Puppeteer using chrome-aws-lambda
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
      baseUrl: process.env.BASE_URL || "http://localhost:3300",
    });

    // Wait for rendering
    await page.waitForTimeout(2000);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      preferCSSPageSize: true,
    });

    await browser.close();

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
      const imageUrl = `${process.env.BASE_URL || "http://localhost:3300"}/uploads/bills/bill_${bill.invoiceNo}.png`;

      return res.status(200).json({
        status: "OK",
        message: "Bill image generated successfully",
        data: { imageUrl },
      });
    }

    // Return PDF inline if requested (for frontend new tab)
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
        createdAt: bill.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        updatedAt: bill.updatedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      },
    });
  } catch (error) {
    console.error("❌ Error generating bill:", error);
    if (browser) await browser.close();
    res.status(500).json({
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
    res.status(500).json({
      status: "ERROR",
      message: error.message || "Something went wrong while fetching bills",
      data: null,
    });
  }
};

module.exports = billController;
