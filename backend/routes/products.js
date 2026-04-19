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

router.get("/", getAllProductsController);
router.get("/nearby", getNearbyProductsController); 
router.get("/my", validateTokenMiddleware, sellerOnlyMiddleware, getMyProductsController);
router.get("/:id", getProductByIdController);

router.post("/", validateTokenMiddleware, sellerOnlyMiddleware, upload.array("photos", 5), createProductController);
router.put("/:id", validateTokenMiddleware, sellerOnlyMiddleware, upload.array("photos", 5), updateProductController);
router.delete("/:id", validateTokenMiddleware, sellerOnlyMiddleware, deleteProductController);

module.exports = router;