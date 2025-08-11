const GalleryModel = require("./model");

const galleryService = {};

galleryService.create = async ({ image, description }) => {
  return await GalleryModel.create({ image, description });
};

galleryService.getAll = async () => {
  return await GalleryModel.find({ isDeleted: false }).sort({ createdAt: -1 });
};

galleryService.getById = async (id) => {
  return await GalleryModel.findOne({ _id: id, isDeleted: false });
};

galleryService.delete = async (id) => {
  return await GalleryModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

module.exports = galleryService;
