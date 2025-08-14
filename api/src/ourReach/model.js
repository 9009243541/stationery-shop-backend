const mongoose = require("mongoose");

const ourReachSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    icon: {
      type: String, // store filename or URL
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OurReach", ourReachSchema);
