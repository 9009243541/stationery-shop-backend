const express = require("express");
const router = express.Router();
const billController = require("./controller");

// Create a new bill (optional)
router.post("/", billController.createBill);

// View bill by order ID
router.get("/view-by-order/:orderId", billController.viewBill);

// Send bill by order ID via email
router.post("/email-by-order/:orderId", billController.sendBillEmail);

module.exports = router;
