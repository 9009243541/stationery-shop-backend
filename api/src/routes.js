const router = require("express").Router();
const otpRoute = require("./otp/otpRoute");
const userRoute = require("./users/route");
const passport = require("passport");
const productRoute = require("./products/route");
const categoryRoute = require("./category/route");
const whislistRoute = require("./wishlist/route");
const cartRoute = require("./cart/route");
const orderRoute = require("./order/route");
const copyRoute = require("./freeCopyDistrubution/route");
const adminRoute = require("./admin/route");
const galleryRoute = require("./gallery/route");
const impactRoute = require("./impact/route");
const blogRoute = require("./blogs/route");
const ourRoute = require("./ourReach/route");
const contactRoute = require("./contact/route");
const billRoute = require("./bill/route");
// const otpController = require("./otp/otpController");
// ================== GOOGLE AUTH ROUTES ==================

// Step 1: Start OAuth flow
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    // After successful login, redirect manually
    const email = req.user.email;
    res.redirect(
      `https://av-frontend.onrender.com/register?from=google&email=${encodeURIComponent(
        email
      )}`
    );
  }
);

router.get("/auth/failure", (req, res) => {
  res.status(401).send("Google login failed ❌");
});

// Logged-in user data
router.get("/auth/current_user", (req, res) => {
  res.send(req.user || null);
});

// Logout route (optional)
router.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173"); // 👈 redirect to frontend on logout
  });
});

// ================== OTHER ROUTES ==================
router.use("/otp", otpRoute);
router.use("/user", userRoute);
router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/wishlist", whislistRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/free-copy-distribution", copyRoute);
router.use("/admin", adminRoute);
router.use("/gallery", galleryRoute);
router.use("/impact-reports", impactRoute);
router.use("/blogs", blogRoute);
router.use("/our-reach", ourRoute);
router.use("/contact", contactRoute);
router.use("/bill", billRoute);
module.exports = router;




