const ImpactModel = require("./model");

const impactService = {};

impactService.create = async ({ title, description, document }) => {
  return await ImpactModel.create({ title, description, document });
};

impactService.getAll = async () => {
  return await ImpactModel.find({ isDeleted: false }).sort({ createdAt: -1 });
};

impactService.getById = async (id) => {
  return await ImpactModel.findOne({ _id: id, isDeleted: false });
};

impactService.delete = async (id) => {
  return await ImpactModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

module.exports = impactService;
