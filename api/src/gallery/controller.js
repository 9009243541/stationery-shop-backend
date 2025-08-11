const galleryService = require("./service");

const galleryController = {};

galleryController.create = async (req, res) => {
  try {
    const { description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res
        .status(400)
        .send({ status: false, message: "Image is required" });
    }

    const created = await galleryService.create({ image, description });

    return res.status(201).send({
      status: true,
      message: "Gallery item created successfully",
      data: created,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

galleryController.getAll = async (req, res) => {
  try {
    const galleryList = await galleryService.getAll();
    return res.status(200).send({
      status: true,
      message: "Gallery list fetched successfully",
      data: galleryList,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

galleryController.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const gallery = await galleryService.getById(id);

    if (!gallery) {
      return res
        .status(404)
        .send({ status: false, message: "Gallery item not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Gallery item fetched successfully",
      data: gallery,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

galleryController.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await galleryService.delete(id);

    if (!deleted) {
      return res
        .status(404)
        .send({ status: false, message: "Gallery item not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Gallery item deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

module.exports = galleryController;
