var express = require("express");

const {
  createUserController,
  loginHandleController,

  // <-- added
} = require("../controller/userController");

var router = express.Router();

/* Health check */
router.get("/", function (req, res) {
  res.json({ message: "User Controller is working" });
});

/* Public routes */
router.post("/create", createUserController);
router.post("/login", loginHandleController);

module.exports = router;
