// service.js
const BannerModel = require("./model");

const bannerService = {};

bannerService.createBanner = async (data) => {
  return await BannerModel.create(data);
};

bannerService.getAllBanners = async () => {
  return await BannerModel.find({ isDeleted: false }).sort({ createdAt: -1 });
};

bannerService.getBannerById = async (id) => {
  return await BannerModel.findOne({ _id: id, isDeleted: false });
};

bannerService.updateBanner = async (id, updateData) => {
  return await BannerModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true }
  );
};

bannerService.deleteBanner = async (id) => {
  return await BannerModel.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
};

module.exports = bannerService;
