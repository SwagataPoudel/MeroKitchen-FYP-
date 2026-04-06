const express = require("express");
const router = express.Router();
const {
  initiateSubscriptionController,
  verifySubscriptionPaymentController,
  getMySubscriptionController,
} = require("../controller/subscriptionController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { sellerOnlyMiddleware } = require("../middleware/RoleMiddleware");

// All routes require auth
router.post(
  "/initiate",
  validateTokenMiddleware,
  sellerOnlyMiddleware,
  initiateSubscriptionController
);

// verify-payment has no sellerOnly — Khalti redirect may not carry role context
router.post("/verify-payment", verifySubscriptionPaymentController);

router.get(
  "/me",
  validateTokenMiddleware,
  sellerOnlyMiddleware,
  getMySubscriptionController
);

module.exports = router;