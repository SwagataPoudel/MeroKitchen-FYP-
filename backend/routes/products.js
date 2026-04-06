const express = require("express");
const router = express.Router();

const {
  createProductController,
  getAllProductsController,
  getNearbyProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getMyProductsController,
} = require("../controller/ProductController");

const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { sellerOnlyMiddleware } = require("../middleware/RoleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getAllProductsController);
router.get("/nearby", getNearbyProductsController); // 👈 must be before /:id
router.get("/my", validateTokenMiddleware, sellerOnlyMiddleware, getMyProductsController);
router.get("/:id", getProductByIdController);

// Seller-only routes
router.post("/", validateTokenMiddleware, sellerOnlyMiddleware, upload.array("photos", 5), createProductController);
router.put("/:id", validateTokenMiddleware, sellerOnlyMiddleware, upload.array("photos", 5), updateProductController);
router.delete("/:id", validateTokenMiddleware, sellerOnlyMiddleware, deleteProductController);

module.exports = router;