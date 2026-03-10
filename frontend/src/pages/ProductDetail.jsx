import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import "../css/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ ALL hooks must be here at the top — before any early returns
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMsg, setCartMsg] = useState("");

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data.product))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Early returns come AFTER all hooks
  if (loading)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "120px",
          fontFamily: "Playfair Display, serif",
          fontSize: "1.2rem",
          color: "#7a5c40",
        }}
      >
        ✨ Loading...
      </p>
    );
  if (!product)
    return (
      <p style={{ textAlign: "center", marginTop: "120px" }}>
        Product not found.
      </p>
    );

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) return navigate("/auth");
    if (role !== "customer")
      return setCartMsg("Only customers can add to cart.");
    try {
      await addToCart(product._id, 1);
      setCartMsg("Added to cart! ✓");
    } catch (err) {
      setCartMsg(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <>
      

      <div className="detail-page">
        <button className="back-btn" onClick={() => navigate("/products")}>
          ← Back to Menu
        </button>

        <div className="detail-grid">
          {product.photos?.[0] ? (
            <img
              src={`http://localhost:3000${product.photos[0]}`}
              alt={product.name}
              className="detail-img"
            />
          ) : (
            <div className="detail-img-placeholder">🍲</div>
          )}

          <div className="detail-info">
            <div className="detail-cat">{product.category}</div>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-seller">
              Prepared by <strong>{product.seller?.name}</strong>
            </p>
            <p className="detail-desc">{product.description}</p>

            <div className="detail-price-row">
              <span className="detail-price">Rs. {product.price}</span>
              <span
                className="avail-badge"
                style={{
                  background: product.availability ? "#4a9c5d" : "#c0392b",
                }}
              >
                {product.availability ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <div className="meta-value">⏱ {product.preparationTime}</div>
                <div className="meta-label">Minutes Prep</div>
              </div>
              <div className="meta-item">
                <div className="meta-value">
                  🌿 {product.ingredients.length}
                </div>
                <div className="meta-label">Ingredients</div>
              </div>
              <div className="meta-item">
                <div className="meta-value">
                  ⭐ {product.ratings?.average || "New"}
                </div>
                <div className="meta-label">Rating</div>
              </div>
            </div>

            <div className="ingredients-section">
              <div className="ingredients-title">What's inside</div>
              <div className="ingredient-tags">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="ingredient-tag">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {product.availability && (
              <>
                <button className="order-btn" onClick={handleAddToCart}>
                  Add to Cart 🛒
                </button>
                {cartMsg && <p className="cart-msg">{cartMsg}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
