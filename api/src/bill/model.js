const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  invoiceNo: {
    type: String,
    
    unique: true,
  },
  paymentMode: {
    type: String,
    enum: ["cash", "upi", "card", "netbanking"],
    required: true,
  },
}, { timestamps: true });

// ✅ Auto-generate invoiceNo before saving
billSchema.pre("save", async function (next) {
  if (!this.invoiceNo) {
    const count = await mongoose.model("Bill").countDocuments();
    this.invoiceNo = `INV-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model("Bill", billSchema);
