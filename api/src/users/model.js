// const mongoose = require("mongoose");
// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     age: {
//       type: Number,
//       required: true,
//     },
//     mobile: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     googleId: String,
//     avatar: String,
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// const User = mongoose.model("User", userSchema);
// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    age: Number,
    mobile: String,
    email: { type: String, required: true }, // email hamesha chahiye
    address: String,
    password: String, // Optional for Google
    googleId: String,
    avatar: String,
    image: String, // For storing user profile image
    address: String, // Optional for Google
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
