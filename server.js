// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const passport = require("passport");
// const bodyparser = require("body-parser");
// require("./config/database");
// require("dotenv").config();

// const app = express();
// app.use("/uploads", express.static("uploads"));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // ================== DB & Passport Setup ==================

// require("./api/src/google/passport"); // Google strategy

// // ================== Middlewares ==================
// app.use(bodyparser.json());
// app.use(cors());

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = [
//         "http://localhost:3000",
//         "http://localhost:5173",
//         "https://tbtdj99v-5173.inc1.devtunnels.ms",
//         "https://stationery-shop-backend-y2lb.onrender.com",
//         "https://av-frontend.onrender.com",
//       ];
//       // allow requests with no origin (like mobile apps, curl, etc.)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "https://tbtdj99v-5173.inc1.devtunnels.ms",
//   "https://av-frontend.onrender.com", // ✅ frontend ka deployed URL
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ✅ Preflight requests handle
// app.options(
//   "*",
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
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
// app.get("/", (req, res) => {
//   res.send("Stationery Shop Backend is running 🚀");
// });

// app.use("/", route); // other routes

// const PORT = process.env.PORT || 5500;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const bodyparser = require("body-parser");
require("./config/database");
require("dotenv").config();

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyparser.json());

// ================== DB & Passport Setup ==================
require("./api/src/google/passport"); // Google strategy

// ================== CORS ==================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://tbtdj99v-5173.inc1.devtunnels.ms",
  "https://av-frontend.onrender.com", // frontend deployed URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true,
  })
);
// app.options("*", cors());
// ✅ Handle preflight requests
// app.options("*", cors());

// ================== Session & Passport ==================
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
app.get("/", (req, res) => {
  res.send("Stationery Shop Backend is running 🚀");
});

app.use("/", route); // other routes

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
