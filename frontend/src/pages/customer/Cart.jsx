import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart } from "../../api/cartApi";
import { placeOrder } from "../../api/orderApi";
import "../../css/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateCartItem(productId, quantity);
    fetchCart();
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  const handlePlaceOrder = async (paymentMethod) => {
    if (!address.trim())
      return setMessage({
        text: "Please enter a delivery address.",
        type: "error",
      });

    setPlacing(true);
    try {
      const res = await placeOrder({
        deliveryAddress: address,
        specialRequest,
        paymentMethod,
      });

      if (paymentMethod === "khalti" && res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        setMessage({ text: "Order placed successfully! 🎉", type: "success" });
        setTimeout(() => navigate("/orders"), 1500);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to place order",
        type: "error",
      });
    } finally {
      setPlacing(false);
    }
  };

  const total =
    cart?.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;

  return (
    <>
      <div>
        <div className="cart-hero">
          <div className="cart-hero-inner">
            <div className="section-label">Your Order</div>
            <h1 className="cart-title">
              My <em>Cart</em>
            </h1>
          </div>
        </div>

        <div className="cart-body">
          {loading ? (
            <p
              style={{
                fontFamily: "Playfair Display, serif",
                color: "var(--muted)",
                fontSize: "1.1rem",
              }}
            >
              Loading your cart...
            </p>
          ) : !cart?.items?.length ? (
            <div className="empty-state">
              <div style={{ fontSize: "4rem" }}></div>
              <p>Your cart is empty.</p>
              <button
                className="browse-btn"
                onClick={() => navigate("/products")}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="cart-item">
                    {item.product.photos?.[0] ? (
                      <img
                        src={`http://localhost:3000${item.product.photos[0]}`}
                        alt={item.product.name}
                        className="cart-item-img"
                      />
                    ) : (
                      <div className="cart-item-placeholder">🍲</div>
                    )}
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.product.name}</div>
                      <div className="cart-item-price">
                        Rs. {item.product.price} each
                      </div>
                      <div className="cart-item-subtotal">
                        Rs. {item.product.price * item.quantity}
                      </div>
                    </div>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantity(item.product._id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantity(item.product._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="checkout-panel">
                <div className="checkout-title">Order Summary</div>
                {cart.items.map((item) => (
                  <div key={item.product._id} className="checkout-row">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>Rs. {item.product.price * item.quantity}</span>
                  </div>
                ))}
                <div className="checkout-total">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>

                {message.text && (
                  <div
                    className={`msg-banner ${message.type === "success" ? "msg-success" : "msg-error"}`}
                  >
                    {message.text}
                  </div>
                )}

                <label className="form-label">Delivery Address</label>
                <input
                  className="form-input"
                  placeholder="e.g. Baneshwor, Kathmandu"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <label className="form-label">Special Request (optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Less spicy, extra sauce..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />

                <button
                  className="place-order-btn"
                  onClick={() => handlePlaceOrder("cod")}
                  disabled={placing}
                >
                  {placing ? "Placing Order..." : "Cash on Delivery "}
                </button>

                <button
                  className="place-order-btn"
                  onClick={() => handlePlaceOrder("khalti")}
                  disabled={placing}
                  style={{ background: "#5C2D8A", marginTop: "0.5rem" }}
                >
                  {placing ? "Redirecting..." : "Pay with Khalti "}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
