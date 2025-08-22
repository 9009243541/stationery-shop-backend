// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// module.exports = (req, res, next) => {
//   // Bearer token me se token extract karna
//   let token = req.headers["x-access-token"] || req.headers["authorization"];

//   if (!token) {
//     return res.status(401).json({
//       status: false,
//       message: "Access denied. No token provided.",
//     });
//   }

//   // If token is in Bearer format: "Bearer eyJhbGciOiJIUzI1NiIs..."
//   if (token.startsWith("Bearer ")) {
//     token = token.slice(7, token.length); // Remove 'Bearer ' part
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

//     // Best practice: attach full decoded user object instead of just _id
//     req.user = decoded; // e.g. { _id: '123', email: 'abc@x.com', ... }
//     next();
//   } catch (error) {
//     console.error("JWT verification failed:", error);
//     return res.status(403).json({
//       status: false,
//       message: "Invalid or expired token.",
//     });
//   }
// };


///////////////////////////////////////////////////////////////////////
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Reusable middleware with optional role check
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided.",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded;

      // 🔐 If role check is provided
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          status: false,
          message: "Forbidden. You do not have access.",
        });
      }

      next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      return res.status(403).json({
        status: false,
        message: "Invalid or expired token.",
      });
    }
  };
};


