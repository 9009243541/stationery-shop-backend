
const router = require("express").Router();
const otpController = require("./otpController");
const multer = require("multer");
const upload = multer();
router.post("/send", otpController.sendOtp);
router.post("/verify", otpController.verifyOtp);
router.post("/send-mobile-otp", upload.none(), otpController.sendMobileOtp);
router.post("/verify-mobile", upload.none(), otpController.verifyMobileOtp);

module.exports = router;
