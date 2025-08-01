// sendOtpTest.js
const axios = require("axios");
const FormData = require("form-data");

let data = new FormData();
data.append("phone", "8745213695"); // Backend expects 'phone' here

let config = {
  method: "post",
  url: "http://localhost:5500/otp/send-mobile-otp", // ✅ hit your own backend
  headers: {
    ...data.getHeaders(),
  },
  data: data,
};

axios(config)
  .then((response) => {
    console.log("✅ OTP Send Response:", response.data);
  })
  .catch((error) => {
    console.error("❌ OTP Send Error:", error.response?.data || error.message);
  });
