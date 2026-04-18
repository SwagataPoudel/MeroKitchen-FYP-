const express = require("express");
const router = express.Router();

const { submitReviewController, getProductReviewsController, getMyReviewsController } = require("../controller/ReviewController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { customerOnlyMiddleware } = require("../middleware/RoleMiddleware");

router.post("/", validateTokenMiddleware, customerOnlyMiddleware, submitReviewController);

router.get("/my-reviews", validateTokenMiddleware, customerOnlyMiddleware, getMyReviewsController); // add before :productId route
router.get("/product/:productId", getProductReviewsController);

module.exports = router;