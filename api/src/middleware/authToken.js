const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decoded._id;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({
      status: false,
      message: "Invalid or expired token.",
    });
  }
};
