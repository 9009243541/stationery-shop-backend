// controller.js
const bannerService = require("./service");

const bannerController = {};

bannerController.createBanner = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.filename : null;

    if (!imageUrl) {
      return res.status(400).send({ message: "Image is required" });
    }

    const { altText, title, link } = req.body;

    const newBanner = await bannerService.createBanner({
      imageUrl,
      altText,
      title,
      link,
    });

    return res.status(201).send({
      status: true,
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    console.log("createBanner error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

bannerController.getAllBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();
    return res.status(200).send({
      status: true,
      message: "Banners fetched successfully",
      data: banners,
    });
  } catch (error) {
    console.log("getAllBanners error:", error);
    return res.status(500).send({ status: false, message: "Internal Error" });
  }
};

bannerController.updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const imageUrl = req.file ? req.file.filename : null;
    const updateData = { ...req.body };

    if (imageUrl) updateData.imageUrl = imageUrl;

    const updated = await bannerService.updateBanner(bannerId, updateData);

    if (!updated) {
      return res.status(404).send({ message: "Banner not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Banner updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("updateBanner error:", error);
    return res.status(500).send({ status: false, message: "Internal Error" });
  }
};

bannerController.deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const deleted = await bannerService.deleteBanner(bannerId);

    if (!deleted) {
      return res.status(404).send({ message: "Banner not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Banner deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.log("deleteBanner error:", error);
    return res.status(500).send({ status: false, message: "Internal Error" });
  }
};

module.exports = bannerController;
