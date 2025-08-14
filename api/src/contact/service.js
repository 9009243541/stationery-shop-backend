const ContactModel = require("./model");

const contactService = {};

contactService.create = async ({ name, email, message }) => {
  return await ContactModel.create({ name, email, message });
};

contactService.getAll = async () => {
  return await ContactModel.find({ isDeleted: false }).sort({ createdAt: -1 });
};

contactService.getById = async (id) => {
  return await ContactModel.findOne({ _id: id, isDeleted: false });
};

contactService.update = async (id, data) => {
  return await ContactModel.findByIdAndUpdate(id, data, { new: true });
};

contactService.delete = async (id) => {
  return await ContactModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

module.exports = contactService;
