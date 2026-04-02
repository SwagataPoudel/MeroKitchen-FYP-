const express = require("express");
const router = express.Router();
const { submitReviewController, getProductReviewsController } = require("../controller/ReviewController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { customerOnlyMiddleware } = require("../middleware/RoleMiddleware");

router.post("/", validateTokenMiddleware, customerOnlyMiddleware, submitReviewController);
router.get("/product/:productId", getProductReviewsController); // public

module.exports = router;