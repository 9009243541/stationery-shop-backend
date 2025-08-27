// const mongoose = require("mongoose");
// const BillModel = require("./model");
// const OrderModel = require("../order/model");

// const billService = {};

// billService.generateBill = async (userId, orderId, paymentMode) => {
//   try {
//     // Validate inputs
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       throw new Error("Invalid Order ID");
//     }
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       throw new Error("Invalid User ID");
//     }
//     if (!["cash", "upi", "card", "netbanking"].includes(paymentMode)) {
//       throw new Error("Invalid payment mode");
//     }

//     // Fetch order with populated product details
//     const order = await OrderModel.findById(orderId).populate({
//       path: "products.productId",
//       select: "productName mrp discount",
//     });

//     if (!order) {
//       throw new Error("Order not found");
//     }

//     if (order.userId.toString() !== userId.toString()) {
//       throw new Error("You are not authorized to generate a bill for this order");
//     }

//     // Calculate total amount
//     const totalAmount = order.products.reduce((sum, item) => {
//       if (!item.productId) {
//         console.warn(`Product not found for productId: ${item.productId}`);
//         return sum;
//       }
//       const finalPrice = item.productId.finalPrice || (item.productId.mrp * (1 - (item.productId.discount || 0) / 100));
//       if (!finalPrice && finalPrice !== 0) {
//         console.warn(`Missing price for product ${item.productId._id}`);
//         return sum;
//       }
//       return sum + item.quantity * finalPrice;
//     }, 0);

//     if (totalAmount === 0) {
//       throw new Error("No valid products found to calculate total amount");
//     }

//     // Create bill
//     const bill = new BillModel({
//       orderId: order._id,
//       userId,
//       totalAmount,
//       paymentMode,
//     });

//     // Ensure invoiceNo is set before saving
//     if (!bill.invoiceNo) {
//       console.warn("invoiceNo not set by pre-save hook, setting manually");
//       const lastBill = await BillModel.findOne({ isDeleted: false }).sort({ createdAt: -1 });
//       let nextInvoiceNo = "INV001";
//       if (lastBill && lastBill.invoiceNo) {
//         const lastNo = parseInt(lastBill.invoiceNo.replace("INV", ""), 10);
//         if (!isNaN(lastNo)) {
//           nextInvoiceNo = `INV${(lastNo + 1).toString().padStart(3, "0")}`;
//         }
//       }
//       bill.invoiceNo = nextInvoiceNo;
//     }

//     await bill.save();

//     // Populate order details in the returned bill
//     return await BillModel.findById(bill._id).populate({
//       path: "orderId",
//       populate: { path: "products.productId", select: "productName mrp discount" },
//     });
//   } catch (error) {
//     console.error("Error in generateBill:", error);
//     throw new Error(`Failed to generate bill: ${error.message}`);
//   }
// };

// billService.getBillsByUserId = async (userId) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       throw new Error("Invalid User ID");
//     }

//     const bills = await BillModel.find({ userId, isDeleted: false })
//       .populate({
//         path: "orderId",
//         populate: { path: "products.productId", select: "productName mrp discount" },
//       })
//       .sort({ createdAt: -1 });

//     if (!bills || bills.length === 0) {
//       throw new Error("No bills found for this user");
//     }

//     return bills;
//   } catch (error) {
//     throw new Error(`Failed to fetch bills: ${error.message}`);
//   }
// };

// module.exports = billService;

const mongoose = require("mongoose");
const BillModel = require("./model");
const OrderModel = require("../order/model");

const billService = {};

billService.generateBill = async (userId, orderId, paymentMode) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }
    if (!["cash", "upi", "card", "netbanking"].includes(paymentMode)) {
      throw new Error("Invalid payment mode");
    }

    const order = await OrderModel.findById(orderId).populate({
      path: "products.productId",
      select: "productName mrp discount",
      options: { toJSON: { virtuals: true }, toObject: { virtuals: true } }, // Include virtuals
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId.toString() !== userId.toString()) {
      throw new Error("You are not authorized to generate a bill for this order");
    }

    // Calculate total amount
    const totalAmount = order.products.reduce((sum, item) => {
      if (!item.productId) {
        console.warn(`Product not found for productId: ${item.productId}`);
        return sum;
      }
      const finalPrice = item.productId.finalPrice ?? (item.productId.mrp * (1 - (item.productId.discount || 0) / 100));
      if (!finalPrice && finalPrice !== 0) {
        console.warn(`Missing price for product ${item.productId._id}`);
        return sum;
      }
      return sum + item.quantity * finalPrice;
    }, 0);

    if (totalAmount === 0) {
      throw new Error("No valid products found to calculate total amount");
    }

    // Create bill
    const bill = new BillModel({
      orderId: order._id,
      userId,
      totalAmount,
      paymentMode,
    });

    // Ensure invoiceNo is set
    if (!bill.invoiceNo) {
      console.warn("invoiceNo not set by pre-save hook, setting manually");
      const lastBill = await BillModel.findOne({ isDeleted: false }).sort({ createdAt: -1 });
      let nextInvoiceNo = "INV001";
      if (lastBill && lastBill.invoiceNo) {
        const lastNo = parseInt(lastBill.invoiceNo.replace("INV", ""), 10);
        if (!isNaN(lastNo)) {
          nextInvoiceNo = `INV${(lastNo + 1).toString().padStart(3, "0")}`;
        }
      }
      bill.invoiceNo = nextInvoiceNo;
    }

    await bill.save();

    return await BillModel.findById(bill._id).populate({
      path: "orderId",
      populate: {
        path: "products.productId",
        select: "productName mrp discount",
        options: { toJSON: { virtuals: true }, toObject: { virtuals: true } },
      },
    });
  } catch (error) {
    console.error("Error in generateBill:", error);
    throw new Error(`Failed to generate bill: ${error.message}`);
  }
};

billService.getBillsByUserId = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }

    const bills = await BillModel.find({ userId, isDeleted: false })
      .populate({
        path: "orderId",
        populate: {
          path: "products.productId",
          select: "productName mrp discount",
          options: { toJSON: { virtuals: true }, toObject: { virtuals: true } },
        },
      })
      .sort({ createdAt: -1 });

    if (!bills || bills.length === 0) {
      throw new Error("No bills found for this user");
    }

    return bills;
  } catch (error) {
    throw new Error(`Failed to fetch bills: ${error.message}`);
  }
};

module.exports = billService;