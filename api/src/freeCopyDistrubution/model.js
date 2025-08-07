// models/CopyRegistration.js
const mongoose = require("mongoose");

const copyRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
     isDeleted: { type: Boolean,
         default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CopyRegistration", copyRegistrationSchema);
