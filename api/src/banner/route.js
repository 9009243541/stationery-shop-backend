// route.js
const router = require("express").Router();
const bannerController = require("./controller");
const upload = require("../../middleware/upload"); 
// POST create banner
router.post(
  "/create",
  upload.single("image"),
  bannerController.createBanner
);

// GET all banners
router.get("/get-all", bannerController.getAllBanners);

// PUT update banner
router.put(
  "/update/:bannerId",
  upload.single("image"),
  bannerController.updateBanner
);

// DELETE banner (soft delete)
router.delete("/delete/:bannerId", bannerController.deleteBanner);

module.exports = router;
