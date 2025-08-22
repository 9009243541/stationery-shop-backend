// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     image: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     productTitle: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     productName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     brand: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     mrp: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     discount: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     availability: {
//       type: Boolean,
//       required: true,
//       default: true,
//     },
//     description: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     rating: {
//       type: Number,
//       min: 0,
//       max: 5,
//       default: 0,
//     },
//     organizedBy: {
//       type: String,
//       required: false,
//     },
//     review: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Product", productSchema);


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    productTitle: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP cannot be negative"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    organizedBy: {
      type: String,
      required: false,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for final price
productSchema.virtual("finalPrice").get(function () {
  const price = this.mrp - (this.mrp * this.discount) / 100;
  return Math.max(0, Number(price.toFixed(2)));
});

module.exports = mongoose.model("Product", productSchema);