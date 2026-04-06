const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["seller", "customer", "admin"],
      default: "customer",
    },

    // Contact
    phone: { type: String, default: "" },

    // Shared
    profilePhoto: { type: String, default: "" },
    city: { type: String, default: "" },

    // Customer-specific
    defaultDeliveryAddress: { type: String, default: "" },

    // Seller-specific
    kitchenName: { type: String, default: "" },
    kitchenDescription: { type: String, default: "" },
    cuisineTypes: [{ type: String }],
    openingHours: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },

    // ── Verification Badge ──────────────────────────
    verificationStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    verificationDocuments: [{ type: String }], // file paths
    verificationNote: { type: String, default: "" }, // admin rejection note
    isVerifiedSeller: { type: Boolean, default: false },

    // ── Subscription ────────────────────────────────
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["none", "active", "expired"],
      default: "none",
    },
  },

  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
