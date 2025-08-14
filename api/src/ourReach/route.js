const route = require("express").Router();
const upload = require("../middleware/upload");
const ourReachController = require("./controller");

route.post("/add", upload.single("icon"), ourReachController.create);
route.get("/get-all", ourReachController.getAll);
route.get("/get-single/:id", ourReachController.getById);
route.delete("/delete/:id", ourReachController.delete);

module.exports = route;
