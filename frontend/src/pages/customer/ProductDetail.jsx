import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import { getProductReviews } from "../../api/reviewApi";
import "../../css/ProductDetail.css";
import ChatRequestButton from "../../components/ChatRequestButton";

const REVIEWS_PER_PAGE = 3;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMsg, setCartMsg] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data.product))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (id) {
      getProductReviews(id)
        .then((res) => setReviews(res.data.reviews))
        .catch(console.error);
    }
  }, [id]);

  if (loading)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "120px",
          fontFamily: "Playfair Display, serif",
          fontSize: "1.1rem",
          color: "#7a5c40",
        }}
      >
        Loading...
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
      setCartMsg("Added to cart ✓");
    } catch (err) {
      setCartMsg(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, REVIEWS_PER_PAGE);

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate("/products")}>
        ← Back to Menu
      </button>

      <div className="detail-card">
        <div className="detail-grid">
     
          <div className="detail-img-pane">
            {product.photos?.[0] ? (
              <img
                src={`http://localhost:3000${product.photos[0]}`}
                alt={product.name}
                className="detail-img"
              />
            ) : (
              <div className="detail-img-placeholder">🍲</div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-cat">{product.category}</div>

            <h1 className="detail-name">{product.name}</h1>

            <p className="detail-seller">
              Prepared by{" "}
              <strong onClick={() => navigate(`/users/${product.seller?._id}`)}>
                {product.seller?.name}
              </strong>
            </p>

            <p className="detail-desc">{product.description}</p>

            <div className="detail-price-row">
              <span className="detail-price">Rs. {product.price}</span>
              <span
                className="avail-badge"
                style={{
                  background: product.availability ? "#c8753a" : "#c0392b",
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
              <div className="ingredients-title">Ingredients</div>
              <div className="ingredient-tags">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="ingredient-tag">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {product.cuisineTypes?.length > 0 && (
              <div className="ingredients-section">
                <div className="ingredients-title">Cuisine Types</div>
                <div className="ingredient-tags">
                  {product.cuisineTypes.map((c, i) => (
                    <span key={i} className="ingredient-tag">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.availability && (
              <div className="detail-actions">
                <button className="order-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                {cartMsg && <p className="cart-msg">{cartMsg}</p>}
                <ChatRequestButton
                  productId={product._id}
                  sellerId={product.seller?._id}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-card">
        <div className="reviews-header">
          <h2 className="reviews-title">
            {reviews.length > 0 ? "What people are saying" : "No reviews yet"}
          </h2>
          {reviews.length > 0 && (
            <div className="reviews-summary">
              <div className="reviews-stars-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={
                      s <= Math.round(product.ratings?.average)
                        ? "sum-star filled"
                        : "sum-star"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="reviews-avg">
                {product.ratings?.average?.toFixed(1)}
              </span>
              <span className="reviews-count">
                · {product.ratings?.count} review
                {product.ratings?.count !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="no-reviews-text">
            Be the first to review after your order is delivered!
          </p>
        ) : (
          <>
            <div className="reviews-list">
              {visibleReviews.map((r) => (
                <div key={r._id} className="review-card">
                  <div className="review-top">
                    <div className="reviewer-name">{r.customer?.name}</div>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={s <= r.rating ? "star filled" : "star"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="review-comment">{r.comment}</p>}
                  <div className="review-date">
                    {new Date(r.createdAt).toLocaleDateString("en-NP", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > REVIEWS_PER_PAGE && (
              <button
                className="show-more-btn"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll
                  ? "Show less ↑"
                  : `Show all ${reviews.length} reviews ↓`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
