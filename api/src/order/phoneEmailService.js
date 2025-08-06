const axios = require("axios");

const PHONE_EMAIL_API_URL = "https://auth.phone.email/message";
const API_KEY = "LKQ6Uedh3Ho34aK2BdC2pStV46mV86I2"; // Replace with actual API key

// ✅ Send SMS
const sendSMS = async ({ to, message }) => {
  try {
    const response = await axios.post(
      PHONE_EMAIL_API_URL,
      {
        to,
        type: "sms",
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("✅ SMS sent:", response.data);
  } catch (error) {
    console.error(
      "❌ Error sending SMS:",
      error.response?.data || error.message
    );
  }
};

// ✅ Send Email
const sendEmail = async ({ to, subject, text }) => {
  try {
    const response = await axios.post(
      PHONE_EMAIL_API_URL,
      {
        to,
        type: "email",
        subject,
        message: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("✅ Email sent:", response.data);
  } catch (error) {
    console.error(
      "❌ Error sending Email:",
      error.response?.data || error.message
    );
  }
};

module.exports = {
  sendSMS,
  sendEmail,
};
