const express = require("express");
const router = express.Router();
const {
  initiateSubscriptionController,
  verifySubscriptionPaymentController,
  getMySubscriptionController,
} = require("../controller/subscriptionController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { sellerOnlyMiddleware } = require("../middleware/RoleMiddleware");

router.post(
  "/initiate",
  validateTokenMiddleware,
  sellerOnlyMiddleware,
  initiateSubscriptionController
);

router.post("/verify-payment", verifySubscriptionPaymentController);

router.get(
  "/me",
  validateTokenMiddleware,
  sellerOnlyMiddleware,
  getMySubscriptionController
);

module.exports = router;