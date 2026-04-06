const User = require("../model/UserModel");
const Product = require("../model/ProductModel");
const Review = require("../model/ReviewModel");
const Order = require("../model/OrderModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUserController(req, res) {
  try {
    const {
      name, email, password, role, phone, city,
      defaultDeliveryAddress, kitchenName, storeLocation,
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      phone: phone || "",
      city: city || "",
      defaultDeliveryAddress: defaultDeliveryAddress || "",
      kitchenName: kitchenName || "",
      // Only set storeLocation if coordinates are provided
      ...(storeLocation?.coordinates?.length === 2 && {
        storeLocation: {
          type: "Point",
          coordinates: storeLocation.coordinates,
          address: storeLocation.address || "",
        },
      }),
    });

    await newUser.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function loginHandleController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getProfileController(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateProfileController(req, res) {
  try {
    const allowedFields = [
      "name", "phone", "city", "defaultDeliveryAddress",
      "kitchenName", "kitchenDescription", "cuisineTypes",
      "openingHours", "isAvailable", "storeLocation",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Validate storeLocation if provided
    if (updates.storeLocation) {
      const loc = updates.storeLocation;
      if (!loc.coordinates || loc.coordinates.length !== 2) {
        delete updates.storeLocation;
      } else {
        updates.storeLocation = {
          type: "Point",
          coordinates: loc.coordinates,
          address: loc.address || "",
        };
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    );
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateProfilePhotoController(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No photo uploaded" });

    const photoPath = `/uploads/profiles/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePhoto: photoPath } },
      { new: true }
    );
    res.status(200).json({ message: "Photo updated", profilePhoto: user.profilePhoto });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getPublicProfileController(req, res) {
  try {
    const user = await User.findById(req.params.id).select(
      "name role city profilePhoto kitchenName kitchenDescription cuisineTypes openingHours isAvailable isVerifiedSeller verificationStatus storeLocation createdAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "seller") {
      const products = await Product.find({ seller: user._id, availability: true })
        .select("name photos price category ratings preparationTime")
        .sort({ createdAt: -1 });

      const reviews = await Review.find({
        product: { $in: products.map((p) => p._id) },
      })
        .populate("customer", "name profilePhoto")
        .populate("product", "name")
        .sort({ createdAt: -1 })
        .limit(10);

      const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

      return res.status(200).json({
        user, products, reviews,
        stats: { totalProducts: products.length, totalReviews: reviews.length, avgRating },
      });
    }

    if (user.role === "customer") {
      const orderCount = await Order.countDocuments({ customer: user._id });
      const reviewCount = await Review.countDocuments({ customer: user._id });
      return res.status(200).json({ user, stats: { orderCount, reviewCount } });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function submitVerificationController(req, res) {
  try {
    const user = await User.findById(req.user.id).populate("subscription");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "seller")
      return res.status(403).json({ message: "Only sellers can submit verification" });

    if (user.subscriptionStatus !== "active")
      return res.status(403).json({
        message: "You must have an active subscription to apply for verification.",
      });

    if (user.verificationStatus === "approved")
      return res.status(400).json({ message: "Already verified" });
    if (user.verificationStatus === "pending")
      return res.status(400).json({ message: "Verification already pending" });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "Please upload at least one document" });

    const docPaths = req.files.map((f) => `/uploads/verification/${f.filename}`);

    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        verificationStatus: "pending",
        verificationDocuments: docPaths,
        verificationNote: "",
      },
    });

    res.status(200).json({ message: "Verification documents submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  createUserController,
  loginHandleController,
  getProfileController,
  updateProfileController,
  updateProfilePhotoController,
  getPublicProfileController,
  submitVerificationController,
};