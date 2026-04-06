const Product = require("../model/ProductModel");
const User = require("../model/UserModel");

async function createProductController(req, res) {
  try {
    const { name, description, price, ingredients, category, preparationTime, cuisineTypes } = req.body;

    if (!name || !description || !price || !ingredients || !category || !preparationTime)
      return res.status(400).json({ message: "All fields are required" });

    const photos = req.files ? req.files.map((f) => `/uploads/products/${f.filename}`) : [];

    const ingredientList = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(",").map((i) => i.trim());

    const cuisineList = Array.isArray(cuisineTypes)
      ? cuisineTypes
      : cuisineTypes ? cuisineTypes.split(",").map((c) => c.trim()) : [];

    const product = new Product({
      name, description, price, ingredients: ingredientList,
      category, preparationTime, photos, cuisineTypes: cuisineList,
      seller: req.user.id,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getAllProductsController(req, res) {
  try {
    const { category, minPrice, maxPrice, availability } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (availability !== undefined) filter.availability = availability === "true";
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(filter)
      .populate("seller", "name email kitchenName storeLocation isVerifiedSeller")
      .sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getNearbyProductsController(req, res) {
  try {
    const { lat, lng, maxDistance = 5000, category, minPrice, maxPrice } = req.query;

    if (!lat || !lng)
      return res.status(400).json({ message: "lat and lng are required" });

    // Find sellers within maxDistance metres
    const nearbySellers = await User.find({
      role: "seller",
      storeLocation: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).select("_id storeLocation kitchenName name");

    if (!nearbySellers.length)
      return res.status(200).json({ products: [], sellers: [] });

    const sellerIds = nearbySellers.map((s) => s._id);

    const filter = { seller: { $in: sellerIds } };
    if (category && category !== "all") filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("seller", "name email kitchenName storeLocation isVerifiedSeller")
      .sort({ createdAt: -1 });

    // Haversine distance for each seller
    const sellerDistanceMap = {};
    nearbySellers.forEach((s) => {
      const [sLng, sLat] = s.storeLocation.coordinates;
      const R = 6371e3;
      const φ1 = (parseFloat(lat) * Math.PI) / 180;
      const φ2 = (sLat * Math.PI) / 180;
      const Δφ = ((sLat - parseFloat(lat)) * Math.PI) / 180;
      const Δλ = ((sLng - parseFloat(lng)) * Math.PI) / 180;
      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      sellerDistanceMap[s._id.toString()] = Math.round(distance);
    });

    const productsWithDistance = products
      .map((p) => ({
        ...p.toObject(),
        distanceMeters: sellerDistanceMap[p.seller._id.toString()] || null,
      }))
      .sort((a, b) => (a.distanceMeters || 9999999) - (b.distanceMeters || 9999999));

    res.status(200).json({ products: productsWithDistance, sellers: nearbySellers });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getProductByIdController(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email kitchenName storeLocation");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateProductController(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only update your own products" });

    const updates = { ...req.body };

    if (req.files && req.files.length > 0)
      updates.photos = req.files.map((f) => `/uploads/products/${f.filename}`);

    if (updates.ingredients && typeof updates.ingredients === "string")
      updates.ingredients = updates.ingredients.split(",").map((i) => i.trim());

    if (updates.cuisineTypes && typeof updates.cuisineTypes === "string")
      updates.cuisineTypes = updates.cuisineTypes.split(",").map((c) => c.trim());

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ message: "Product updated successfully", product: updated });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteProductController(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only delete your own products" });
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getMyProductsController(req, res) {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  createProductController,
  getAllProductsController,
  getNearbyProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getMyProductsController,
};