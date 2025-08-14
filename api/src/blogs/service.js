// const BlogModel = require("./model");

// const blogService = {};

// blogService.create = async ({ title, content, image, author, tags }) => {
//   return await BlogModel.create({ title, content, image, author, tags });
// };

// blogService.getAll = async () => {
//   return await BlogModel.find({ isDeleted: false }).sort({ createdAt: -1 });
// };

// blogService.getById = async (id) => {
//   return await BlogModel.findOne({ _id: id, isDeleted: false });
// };

// blogService.update = async (id, data) => {
//   return await BlogModel.findByIdAndUpdate(id, data, { new: true });
// };

// blogService.delete = async (id) => {
//   return await BlogModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
// };

// module.exports = blogService;
const BlogModel = require("./model");

const blogService = {};

blogService.create = async ({ title, content, image, video, author, tags }) => {
  return await BlogModel.create({ title, content, image, video, author, tags });
};

blogService.getAll = async () => {
  return await BlogModel.find({ isDeleted: false }).sort({ createdAt: -1 });
};

blogService.getById = async (id) => {
  return await BlogModel.findOne({ _id: id, isDeleted: false });
};

blogService.update = async (id, data) => {
  return await BlogModel.findByIdAndUpdate(id, data, { new: true });
};

blogService.delete = async (id) => {
  return await BlogModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

module.exports = blogService;
