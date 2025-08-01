const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.DB_URL;
mongoose
  .connect(uri)
  .then(() => console.log("MONGO DB DATABASE IS CONNECTED"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
