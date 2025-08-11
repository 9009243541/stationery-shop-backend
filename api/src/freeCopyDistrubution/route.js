const router = require("express").Router();
const copyController = require("./controller");
const validate = require("../middleware/validate");
const { copyRegistrationValidation } = require("./copyRegistrationValidation ");
const authenticate = require("../middleware/authToken");
// POST: Register user
router.post(
  "/register",
  authenticate(),
  validate(copyRegistrationValidation),
  copyController.register
);

// GET: Fetch all
router.get("/get-all", copyController.getAll);

module.exports = router;
