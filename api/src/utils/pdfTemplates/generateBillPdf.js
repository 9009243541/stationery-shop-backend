// const fs = require("fs");
// const path = require("path");

// function generateBillPdf(doc, { bill, order, user }) {
//   const logoPath = path.join(__dirname, "../assets/avfoundation_logo.png"); // apna logo yaha daalein
//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, 50, 30, { width: 70 }); // Logo Top Left
//   }

//   // Foundation Name
//   doc
//     .fontSize(18)
//     .font("Helvetica-Bold")
//     .text("AV FOUNDATION", 130, 45, { align: "left" });
//   doc.moveDown(2);

//   // Invoice Header
//   doc
//     .fontSize(20)
//     .font("Helvetica-Bold")
//     .text("Order Invoice", { align: "center", underline: true });
//   doc.moveDown(1);

//   // Customer + Order Info
//   doc.fontSize(12).font("Helvetica");
//   const customerInfoTop = doc.y;
//   doc.text(`Invoice No: ${bill.invoiceNo}`);
//   doc.text(`Order ID: ${order._id}`);
//   doc.text(`Customer: ${user.firstName} ${user.lastName}`);
//   doc.text(`Email: ${user.email}`);
//   doc.text(`Address: ${order.deliveryAddress}`);
//   doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);

//   doc.moveDown(2);

//   // Product Table Header
//   const tableTop = doc.y;
//   const itemX = 50;
//   const qtyX = 250;
//   const priceX = 320;
//   const totalX = 400;

//   doc
//     .font("Helvetica-Bold")
//     .text("Product", itemX, tableTop)
//     .text("Qty", qtyX, tableTop)
//     .text("Price", priceX, tableTop)
//     .text("Total", totalX, tableTop);

//   doc.moveDown(0.5);
//   doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke(); // line under header

//   // Products List
//   doc.font("Helvetica");
//   order.products.forEach((p, i) => {
//     const y = tableTop + 25 + i * 20;
//     const price = p.price || (p.productId?.finalPrice ?? 0);
//     const total = p.total || price * p.quantity;

//     doc.text(p.productId?.productName || "Unknown", itemX, y);
//     doc.text(p.quantity.toString(), qtyX, y);
//     doc.text(`₹${price}`, priceX, y);
//     doc.text(`₹${total}`, totalX, y);
//   });

//   doc.moveDown(2);
//   doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();

//   // Summary
//   doc
//     .font("Helvetica-Bold")
//     .text(`Total Amount: ₹${bill.totalAmount}`, { align: "right" });
//   doc.text(`Payment Mode: ${bill.paymentMode}`, { align: "right" });

//   doc.moveDown(2);

//   // Footer / Thank You
//   doc
//     .font("Helvetica-Oblique")
//     .fontSize(12)
//     .text("Thank you for shopping with AV Foundation!", { align: "center" });
// }

// module.exports = generateBillPdf;
