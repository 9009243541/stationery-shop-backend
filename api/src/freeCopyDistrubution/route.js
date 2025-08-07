const router = require("express").Router();
const copyController = require("./controller");
const validate = require("../middleware/validate");
const { copyRegistrationValidation } = require("./copyRegistrationValidation ");

// POST: Register user
router.post("/register", validate(copyRegistrationValidation), copyController.register);

// GET: Fetch all
router.get("/get-all", copyController.getAll);

module.exports = router;
