const sendEmail = require("../utils/sendEmail");

const otpStore = {}; // Use DB or Redis in production

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log("req.body ===>", req.body);

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const otp = generateOtp();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // expires in 5 mins

  try {
    await sendEmail({
      to: email,
      subject: "A V Foundation - Your OTP Code",
      html: `
    <p>Dear User,</p>
    <p>Welcome to A V Foundation!</p>
    <p>Your One-Time Password (OTP) is: <b>${otp}</b></p>
    <p>This OTP will expire in 5 minutes.</p>
  `,
    });

    console.log(`OTP ${otp} sent to ${email}`);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res
      .status(400)
      .json({ success: false, message: "No OTP sent to this email" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email];
  return res.json({
    success: true,
    message: "OTP verified successfully",
    email: email,
  });
};

const axios = require("axios");
const tough = require("tough-cookie");
// const { wrapper } = require("axios-cookiejar-support");
const { wrapper } = await import("axios-cookiejar-support");
// const { wrapper } = require("axios-cookiejar-support");



const client = wrapper(
  axios.create({
    jar: new tough.CookieJar(),
    withCredentials: true,
  })
);

// SEND OTP to phone number
exports.sendMobileOtp = async (req, res) => {
  const { phone_no } = req.body;
  console.log("Sending OTP request with:", { phone_no, phone_country: "+91" });

  if (!phone_no || phone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number" });
  }

  try {
    const response = await client.post(
      "https://auth.phone.email/submit-login",
      {
        phone_no: phone,
        phone_country: "+91",
        client_id: process.env.PHONE_EMAIL_CLIENT_ID,
      }
    );
    return res.json({
      success: true,
      message: "OTP sent successfully",
      data: response.data,
    });
  } catch (err) {
    console.error("Error sending OTP:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

// VERIFY OTP
exports.verifyMobileOtp = async (req, res) => {
  const { otp, fname, lname } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }

  try {
    const response = await client.post(
      "https://auth.phone.email/verify-login",
      {
        otp,
        client_id: process.env.PHONE_EMAIL_CLIENT_ID,
        fname,
        lname,
      }
    );

    return res.json({
      success: true,
      message: "OTP verified",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "OTP verification failed:",
      err.response?.data || err.message
    );
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }
};
