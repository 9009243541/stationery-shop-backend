// const express = require("express");
// const app = express();
// const cors = require("cors");
// const route = require("./api/src/routes");
// const bodyparser = require("body-parser");

// app.use(bodyparser.json());
// app.use(cors());

// app.use(cors());

// require("./config/database");

// app.use("/", route);
// const PORT = process.env.PORT || 5500;

// app.get("/", (req, res) => {
//   res.send("Server is running ✅");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
///////////////////////////////////////////////////////////////////////////////

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const bodyparser = require("body-parser");
require("dotenv").config();

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================== DB & Passport Setup ==================
require("./config/database");
require("./api/src/google/passport"); // Google strategy

// ================== Middlewares ==================
app.use(bodyparser.json());
// app.use(cors());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ================== Routes ==================
const route = require("./api/src/routes");
app.use("/", route); // other routes

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
//////////////////////////////////////////////////////////////
// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const passport = require("passport");
// const bodyparser = require("body-parser");
// const multer = require("multer");
// const upload = multer(); // This is needed for parsing form-data

// require("dotenv").config();

// const app = express();

// // ================== DB & Passport Setup ==================
// require("./config/database");
// require("./api/src/google/passport");

// // ================== Middlewares ==================
// app.use(bodyparser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // ================== Routes ==================
// const route = require("./api/src/routes");
// app.use("/", route);

// // ✅ ✅ NEW: Add OTP routes here
// const {
//   sendMobileOtp,
//   verifyMobileOtp,
// } = require("./api/src/otp/otpController");

// app.post("/send-otp", upload.none(), sendMobileOtp); // for form-data
// app.post("/verify-otp", upload.none(), verifyMobileOtp); // for form-data

// // ================== Start Server ==================
// const PORT = process.env.PORT || 5500;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
