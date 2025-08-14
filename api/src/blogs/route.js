// const route = require("express").Router();
// const upload = require("../middleware/upload");
// const blogController = require("./controller");

// route.post("/add", upload.single("image"), blogController.create);
// route.get("/get-all", blogController.getAll);
// route.get("/get-single/:id", blogController.getById);
// route.put("/update/:id", upload.single("image"), blogController.update);
// route.delete("/delete/:id", blogController.delete);

// module.exports = route;
const route = require("express").Router();
const { uploadMedia } = require("../middleware/upload");
const blogController = require("./controller");

route.post(
  "/add",
  uploadMedia.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  blogController.create
);

route.get("/get-all", blogController.getAll);
route.get("/get-single/:id", blogController.getById);

route.put(
  "/update/:id",
  uploadMedia.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  blogController.update
);

route.delete("/delete/:id", blogController.delete);

module.exports = route;
