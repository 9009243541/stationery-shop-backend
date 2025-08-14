const ourReachService = require("./service");

const ourReachController = {};

ourReachController.create = async (req, res) => {
  try {
    const { title, count } = req.body;
    const icon = req.file ? req.file.filename : "";

    if (!title || !count) {
      return res.status(400).send({ status: false, message: "Title and count are required" });
    }

    const created = await ourReachService.create({ title, count, icon });

    return res.status(201).send({
      status: true,
      message: "Our Reach item created successfully",
      data: created,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

ourReachController.getAll = async (req, res) => {
  try {
    const list = await ourReachService.getAll();
    return res.status(200).send({
      status: true,
      message: "Our Reach list fetched successfully",
      data: list,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

ourReachController.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await ourReachService.getById(id);

    if (!item) {
      return res.status(404).send({ status: false, message: "Item not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Item fetched successfully",
      data: item,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

ourReachController.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await ourReachService.delete(id);

    if (!deleted) {
      return res.status(404).send({ status: false, message: "Item not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Item deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

module.exports = ourReachController;
