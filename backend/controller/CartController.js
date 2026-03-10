const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");

// GET /cart — get current customer's cart
async function getCartController(req, res) {
  try {
    const cart = await Cart.findOne({ customer: req.user.id }).populate(
      "items.product",
      "name price photos availability seller preparationTime",
    );
    if (!cart) return res.status(200).json({ cart: { items: [] } });
    res.status(200).json({ cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// POST /cart/add — add item to cart
async function addToCartController(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.availability)
      return res.status(400).json({ message: "Product is not available" });

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      // create new cart
      cart = new Cart({
        customer: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // check if item already exists
      const existingItem = cart.items.find(
        (i) => i.product.toString() === productId,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// PUT /cart/update — update item quantity
async function updateCartItemController(req, res) {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1)
      return res.status(400).json({ message: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// DELETE /cart/remove/:productId — remove item from cart
async function removeFromCartController(req, res) {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId,
    );
    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// DELETE /cart/clear — clear entire cart
async function clearCartController(req, res) {
  try {
    await Cart.findOneAndDelete({ customer: req.user.id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
};
