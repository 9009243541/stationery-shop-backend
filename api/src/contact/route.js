const route = require("express").Router();
const contactController = require("./controller");

route.post("/send", contactController.create);
route.get("/get-all", contactController.getAll);
route.get("/get-single/:id", contactController.getById);
route.put("/update/:id", contactController.update);
route.delete("/delete/:id", contactController.delete);

module.exports = route;
