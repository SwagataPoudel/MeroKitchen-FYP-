import { useEffect, useState } from "react";
import { getOrderHistory } from "../../api/orderApi";
import { submitReview } from "../../api/reviewApi";
import { useNavigate } from "react-router-dom";
import "../../css/OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewedSet, setReviewedSet] = useState(new Set());
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOrderHistory()
      .then((res) =>
        setOrders(
          res.data.orders.filter((o) =>
            ["completed", "declined", "delivered", "cancelled"].includes(
              o.status,
            ),
          ),
        ),
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []); // ← empty dep array = runs once on mount

  const openReviewModal = (orderId, productId, productName) => {
    setReviewModal({ orderId, productId, productName });
    setRating(0);
    setHoverRating(0);
    setComment("");
    setReviewMsg("");
  };

  const closeModal = () => {
    setReviewModal(null);
    setReviewMsg("");
  };

  const handleSubmitReview = async () => {
    if (!rating) return setReviewMsg("Please select a star rating.");
    setSubmitting(true);
    try {
      await submitReview({
        productId: reviewModal.productId,
        orderId: reviewModal.orderId,
        rating,
        comment,
      });
      setReviewedSet((prev) =>
        new Set(prev).add(`${reviewModal.orderId}_${reviewModal.productId}`),
      );
      setReviewMsg("Review submitted! ✓");
      setTimeout(closeModal, 1200);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Summary stats
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalItems = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  return (
    <>
      {/* ── Hero ── */}
      <div className="history-hero">
        <div className="history-hero-inner">
          <div className="history-section-label">Completed Orders</div>
          <h1 className="history-title">
            Order <em>History</em>
          </h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="history-body">
        <button
          className="history-back-btn"
          onClick={() => navigate("/orders")}
        >
          ← Back to My Orders
        </button>

        {loading ? (
          <p
            style={{
              fontFamily: "DM Serif Display, serif",
              color: "var(--muted)",
            }}
          >
            Loading history...
          </p>
        ) : orders.length === 0 ? (
          <div className="history-empty">
            <div style={{ fontSize: "4rem" }}>📦</div>
            <p>No completed orders yet.</p>
            <button
              className="history-browse-btn"
              onClick={() => navigate("/products")}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* Summary chips */}
            <div className="history-summary">
              <div className="history-summary-chip">
                <span className="history-summary-value">{orders.length}</span>
                <span className="history-summary-label">Orders Delivered</span>
              </div>
              <div className="history-summary-chip">
                <span className="history-summary-value">Rs. {totalSpent}</span>
                <span className="history-summary-label">Total Spent</span>
              </div>
              <div className="history-summary-chip">
                <span className="history-summary-value">{totalItems}</span>
                <span className="history-summary-label">Items Ordered</span>
              </div>
            </div>

            {/* Order cards */}
            {orders.map((order) => (
              <div key={order._id} className="history-card">
                {/* Header */}
                <div className="history-card-header">
                  <div>
                    <div className="history-order-id">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="history-order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-NP", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <span className={`history-delivered-badge ${order.status}`}>
                    {order.status === "delivered"
                      ? "Delivered ✓"
                      : order.status === "completed"
                        ? "Completed ✓"
                        : order.status === "cancelled"
                          ? "Cancelled ✗"
                          : "Declined ✗"}
                  </span>
                </div>

                {/* Seller */}
                <div className="history-seller">
                  From <strong>{order.seller?.name}</strong>
                </div>

                {/* Items */}
                <div className="history-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="history-item">
                      {item.product?.photos?.[0] ? (
                        <img
                          src={`http://localhost:3000${item.product.photos[0]}`}
                          alt={item.product.name}
                          className="history-item-img"
                        />
                      ) : (
                        <div className="history-item-placeholder">🍲</div>
                      )}
                      <span className="history-item-name">
                        {item.product?.name}
                      </span>
                      <span className="history-item-qty">
                        × {item.quantity}
                      </span>
                      <span className="history-item-price">
                        Rs. {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="history-card-footer">
                  <div>
                    <div className="history-address">
                      {order.deliveryAddress}
                    </div>
                    {/* Review buttons - only allow reviews for delivered/completed orders */}
                    <div className="history-review-items">
                      {order.status === "declined" ||
                      order.status === "cancelled" ? (
                        <span className="history-no-review">
                          {order.status === "cancelled"
                            ? "Order was cancelled"
                            : "No reviews available for declined orders"}
                        </span>
                      ) : (
                        order.items.map((item, i) => {
                          const key = `${order._id}_${item.product?._id}`;
                          const alreadyReviewed = reviewedSet.has(key);
                          return (
                            <button
                              key={i}
                              className="history-review-btn"
                              disabled={alreadyReviewed}
                              onClick={() =>
                                !alreadyReviewed &&
                                openReviewModal(
                                  order._id,
                                  item.product._id,
                                  item.product.name,
                                )
                              }
                            >
                              {alreadyReviewed
                                ? `✓ Reviewed ${item.product?.name}`
                                : `⭐ Review ${item.product?.name}`}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="history-total">Rs. {order.totalAmount}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Review Modal ── */}
      {reviewModal && (
        <div className="history-modal-overlay" onClick={closeModal}>
          <div
            className="history-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="history-modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="history-modal-label">Rate your experience</div>
            <h2 className="history-modal-title">{reviewModal.productName}</h2>

            <div className="history-star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`history-star-btn ${
                    star <= (hoverRating || rating) ? "filled" : ""
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="history-star-label">
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][
                hoverRating || rating
              ] || "Tap a star to rate"}
            </div>

            <textarea
              className="history-review-textarea"
              placeholder="Share your thoughts (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            {reviewMsg && (
              <p
                className={`history-review-msg ${
                  reviewMsg.includes("✓") ? "success" : "error"
                }`}
              >
                {reviewMsg}
              </p>
            )}

            <button
              className="history-submit-btn"
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
