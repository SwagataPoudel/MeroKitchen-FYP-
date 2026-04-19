const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks", "desserts", "drinks"],
      required: true,
    },
    preparationTime: {
      type: Number, 
      required: true,
    },
    photos: {
      type: [String], 
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    cuisineTypes: [{ type: String }],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
