// // // utils/sendEmail.js
// // const nodemailer = require("nodemailer");
// // require("dotenv").config();

// // const sendEmail = async (to, subject, text) => {
// //   const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });

// //   const mailOptions = {
// //     from: process.env.EMAIL_USER,
// //     to,
// //     subject,
// //     text,
// //   };

// //   await transporter.sendMail(mailOptions);
// // };

// // module.exports = sendEmail;
// // utils/sendEmail.js
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const sendEmail = async (to, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       from: `"OTP Service" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: ", info.response);
//   } catch (error) {
//     console.error("Error sending email:", error.message);
//     throw error;
//   }
// };

// module.exports = sendEmail;
// module.exports = async ({ to, subject, text }) => {
//   console.log(`📧 Sending email to ${to}: ${subject} - ${text}`);
//   // Integrate with nodemailer, SendGrid, etc.
// };
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP settings
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app password (not your actual Gmail password)
      },
    });

    // Email options
    const mailOptions = {
      from: `"AV Foundation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
