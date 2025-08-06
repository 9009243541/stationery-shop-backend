// model.js
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const BannerModel = mongoose.model("Banner", bannerSchema);
module.exports = BannerModel;
