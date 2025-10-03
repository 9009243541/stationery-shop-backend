const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Utility to generate unique invoice numbers
const generateInvoiceNo = () => {
  const random = Math.floor(100 + Math.random() * 900);
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${datePart}-${random}`;
};

exports.generateBillPDF = async (billData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const invoiceNo = billData.invoiceNo || generateInvoiceNo();
      billData.invoiceNo = invoiceNo;

      const filePath = path.join(__dirname, "..", "uploads", `bill-${invoiceNo}.pdf`);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Header
      doc
        .fontSize(20)
        .text("Stationery Shop Invoice", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Invoice No: ${invoiceNo}`)
        .text(`Date: ${new Date().toLocaleDateString()}`)
        .moveDown(0.5);

      // Customer info
      doc
        .text(`Customer: ${billData.user?.name || "Customer"} (${billData.user?.email || "N/A"})`)
        .text(`Order ID: ${billData.order?._id || "N/A"}`)
        .text(`Payment Mode: ${billData.paymentMode || "N/A"}`)
        .moveDown(0.5);

      // Table header
      doc.fontSize(12).text("Products:", { underline: true });
      doc.moveDown(0.3);

      // Table columns
      const tableTop = doc.y;
      doc.fontSize(10);
      doc.text("Product", 50, tableTop);
      doc.text("Qty", 250, tableTop);
      doc.text("Price", 300, tableTop);
      doc.text("Total", 400, tableTop);

      doc.moveDown(0.5);

      // Products
      billData.order?.products?.forEach((p, i) => {
        const y = tableTop + 25 + i * 20;
        doc.text(p.name || "Product", 50, y);
        doc.text(p.quantity, 250, y);
        doc.text(`₹${p.price?.toFixed(2) || "0.00"}`, 300, y);
        doc.text(`₹${p.total?.toFixed(2) || "0.00"}`, 400, y);
      });

      doc.moveDown(billData.order?.products?.length + 1);

      // Total
      doc
        .fontSize(12)
        .text(`Total Amount: ₹${billData.order?.totalAmount?.toFixed(2) || "0.00"}`, { align: "right" })
        .moveDown(0.5);

      // Footer
      doc
        .fontSize(10)
        .text("Thank you for shopping with us!", { align: "center", underline: true });

      doc.end();

      writeStream.on("finish", () => resolve(filePath));
      writeStream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
