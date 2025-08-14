const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    image: {
      type: String, // store filename or image URL
      default: "",
    },
    author: {
      type: String,
      default: "Admin",
    },
    tags: {
      type: [String], // array of tags for searching/filtering
      default: [],
    },
    video: { type: String, default: "" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
