const nodemailer = require("nodemailer");
const path = require("path");

// Configure transporter (using Gmail as example; update for your service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password or normal password
  },
});

// Send invoice email
exports.sendInvoiceEmail = async (toEmail, pdfPath, invoiceNo) => {
  try {
    if (!toEmail) throw new Error("Recipient email not provided");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Your Invoice ${invoiceNo}`,
      text: `Dear Customer,\n\nPlease find attached your invoice ${invoiceNo}.\n\nThank you for shopping with us!\n\n- Stationery Shop`,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Invoice ${invoiceNo} sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("❌ Error sending invoice email:", err);
    throw err;
  }
};
