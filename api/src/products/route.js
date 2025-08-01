const productController = require("./controller");
const validate = require("../middleware/validate");
// const middleWare = require("../../middleWare/authToken");
const { productSchema } = require("./productValidation");
const router = require("express").Router();
const upload = require("../middleware/upload");

router.post(
  "/add-product",
  //   middleWare,
  validate(productSchema),
  upload.single("image"),
  productController.addProduct
);

router.put(
  "/update-product/:productId",
  //   middleWare,
  validate(productSchema),
  upload.single("image"),

  productController.updateProductDetails
);
router.get("/getproducts", productController.getproduct);
router.get(
  "/get-single-product/:productId",
  //   middleWare,
  productController.getSingleProductById
);

router.delete(
  "/delete-product/:productId",
  //   middleWare,
  productController.deleteProduct
);
module.exports = router;
