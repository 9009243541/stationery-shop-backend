const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
