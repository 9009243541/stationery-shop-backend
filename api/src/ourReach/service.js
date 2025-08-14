const OurReachModel = require("./model");

const ourReachService = {};

ourReachService.create = async ({ title, count, icon }) => {
  return await OurReachModel.create({ title, count, icon });
};

ourReachService.getAll = async () => {
  return await OurReachModel.find({ isDeleted: false }).sort({ createdAt: -1 });
};

ourReachService.getById = async (id) => {
  return await OurReachModel.findOne({ _id: id, isDeleted: false });
};

ourReachService.delete = async (id) => {
  return await OurReachModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

module.exports = ourReachService;
