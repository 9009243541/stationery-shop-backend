const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    invoiceNo: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true, // This creates the unique index
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentMode: {
      type: String,
      enum: {
        values: ["cash", "upi", "card", "netbanking"],
        message: "Payment mode must be cash, upi, card, or netbanking",
      },
      required: [true, "Payment mode is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-increment invoice number
billSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      console.log("Running pre-save hook for invoiceNo generation");
      const lastBill = await this.constructor.findOne({ isDeleted: false }).sort({ createdAt: -1 });
      let nextInvoiceNo = "INV001";
      if (lastBill && lastBill.invoiceNo) {
        console.log("Last bill found:", lastBill.invoiceNo);
        const lastNo = parseInt(lastBill.invoiceNo.replace("INV", ""), 10);
        if (!isNaN(lastNo)) {
          nextInvoiceNo = `INV${(lastNo + 1).toString().padStart(3, "0")}`;
        } else {
          console.warn("Invalid invoiceNo format in last bill:", lastBill.invoiceNo);
        }
      }
      console.log("Setting invoiceNo to:", nextInvoiceNo);
      this.invoiceNo = nextInvoiceNo;
    }
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(new Error("Failed to generate invoice number"));
  }
});

module.exports = mongoose.model("Bill", billSchema);