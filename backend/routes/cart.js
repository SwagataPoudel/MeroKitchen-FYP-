const express = require("express");
const router = express.Router();
const {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} = require("../controller/CartController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { customerOnlyMiddleware } = require("../middleware/RoleMiddleware");

router.use(validateTokenMiddleware, customerOnlyMiddleware); // all cart routes: customers only

router.get("/", getCartController);
router.post("/add", addToCartController);
router.put("/update", updateCartItemController);
router.delete("/remove/:productId", removeFromCartController);
router.delete("/clear", clearCartController);

module.exports = router;
