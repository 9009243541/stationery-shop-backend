const CopyRegistrationModel = require("./model");

const copyService = {};

copyService.create = async (data) => {
  return await CopyRegistrationModel.create(data);
};

copyService.isExist = async (email) => {
  return await CopyRegistrationModel.findOne({ email, isDeleted: false });
};

copyService.getAll = async () => {
  return await CopyRegistrationModel.find({ isDeleted: false }).sort({ createdAt: -1 });
};

module.exports = copyService;
