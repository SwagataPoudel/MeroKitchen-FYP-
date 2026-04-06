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
    phone: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    city: { type: String, default: "" },
    defaultDeliveryAddress: { type: String, default: "" },
    kitchenName: { type: String, default: "" },
    kitchenDescription: { type: String, default: "" },
    cuisineTypes: [{ type: String }],
    openingHours: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },

    // ── Store Location (Seller) ──────────────────────────
    storeLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined,
      },
      address: { type: String, default: "" },
    },

    // ── Verification ────────────────────────────────────
    verificationStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    verificationDocuments: [{ type: String }],
    verificationNote: { type: String, default: "" },
    isVerifiedSeller: { type: Boolean, default: false },

    // ── Subscription ────────────────────────────────────
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
  { timestamps: true }
);

userSchema.index({ storeLocation: "2dsphere" });

const User = mongoose.model("User", userSchema);
module.exports = User;