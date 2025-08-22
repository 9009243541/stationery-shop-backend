const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateOrderBillPDF = async ({ order, userName, deliveryAddress, bill }) => {
  try {
    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const pdfPath = path.join(invoicesDir, `Invoice_${bill.invoiceNo}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Add logo if it exists
    const logoPath = path.join(__dirname, "../public/logo/aa.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 100 });
    } else {
      console.warn(`Logo file not found at ${logoPath}, skipping logo`);
      doc.fontSize(12).text("No logo available", 50, 50);
    }

    // Add bill details
    doc.fontSize(20).text("Invoice", 50, 100);
    doc.fontSize(12).text(`Invoice No: ${bill.invoiceNo}`, 50, 130);
    doc.text(`Order ID: ${order._id}`, 50, 150);
    doc.text(`User: ${userName}`, 50, 170);
    doc.text(`Delivery Address: ${deliveryAddress}`, 50, 190);
    doc.text(`Payment Mode: ${bill.paymentMode}`, 50, 210);
    doc.text(`Total Amount: $${bill.totalAmount}`, 50, 230);

    // Add product details
    doc.text("Products:", 50, 260);
    order.products.forEach((item, index) => {
      const product = item.productId;
      doc.text(
        `${index + 1}. ${product.productName} - Quantity: ${item.quantity} - Price: $${product.mrp * (1 - (product.discount || 0) / 100)}`,
        50,
        280 + index * 20
      );
    });

    doc.end();

    // Return the PDF path when the stream finishes
    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", (err) => reject(new Error(`Failed to write PDF: ${err.message}`)));
    });
  } catch (error) {
    console.error("Error in generateOrderBillPDF:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = generateOrderBillPDF;