const impactService = require("./service");

const impactController = {};

impactController.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const document = req.file ? req.file.filename : null;

    if (!document) {
      return res
        .status(400)
        .send({ status: false, message: "Document is required" });
    }

    const report = await impactService.create({ title, description, document });

    return res.status(201).send({
      status: true,
      message: "Impact report created successfully",
      data: report,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

impactController.getAll = async (req, res) => {
  try {
    const reports = await impactService.getAll();
    return res.status(200).send({
      status: true,
      message: "Impact reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

impactController.getById = async (req, res) => {
  try {
    const report = await impactService.getById(req.params.id);

    if (!report) {
      return res
        .status(404)
        .send({ status: false, message: "Report not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Impact report fetched successfully",
      data: report,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

impactController.delete = async (req, res) => {
  try {
    const deleted = await impactService.delete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .send({ status: false, message: "Report not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Impact report deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

module.exports = impactController;
