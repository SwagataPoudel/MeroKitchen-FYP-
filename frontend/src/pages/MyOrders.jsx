import { useEffect, useState } from "react";
import { getMyOrders, markDelivered } from "../api/orderApi";
import { submitReview } from "../api/reviewApi";
import { useNavigate } from "react-router-dom";
import "../css/MyOrders.css";
import ChatBox from "../components/ChatBox";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  accepted: { bg: "#dbeafe", color: "#1e40af" },
  preparing: { bg: "#ffedd5", color: "#9a3412" },
  completed: { bg: "#fef08a", color: "#713f12" },
  delivered: { bg: "#dcfce7", color: "#166534" },
  declined: { bg: "#fee2e2", color: "#991b1b" },
};

const STATUS_LABELS = {
  completed: "Ready for Delivery 🛵",
  delivered: "Delivered ✓",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  // reviewModal = { orderId, productId, productName }
  const [reviewedSet, setReviewedSet] = useState(new Set());
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [openOrderChat, setOpenOrderChat] = useState(null);

  const fetchOrders = () => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkDelivered = async (orderId) => {
    try {
      await markDelivered(orderId);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <>
      <div>
        <div className="orders-hero">
          <div className="orders-hero-inner">
            <div className="section-label">Order History</div>
            <h1 className="orders-title">
              My <em>Orders</em>
            </h1>
          </div>
        </div>

        <div className="orders-body">
          {loading ? (
            <p
              style={{
                fontFamily: "Playfair Display, serif",
                color: "var(--muted)",
              }}
            >
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "4rem" }}>📦</div>
              <p>No orders yet.</p>
              <button
                className="browse-btn"
                onClick={() => navigate("/products")}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const label = STATUS_LABELS[order.status] || order.status;
              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <div className="order-id">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-NP", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <span
                      className="status-badge"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {label}
                    </span>
                  </div>

                  <div className="order-seller">
                    From <strong>{order.seller?.name}</strong>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item">
                        {item.product?.photos?.[0] ? (
                          <img
                            src={`http://localhost:3000${item.product.photos[0]}`}
                            alt={item.product.name}
                            className="order-item-img"
                          />
                        ) : (
                          <div className="order-item-placeholder">🍲</div>
                        )}
                        <span className="order-item-name">
                          {item.product?.name}
                        </span>
                        <span className="order-item-qty">
                          × {item.quantity}
                        </span>
                        <span className="order-item-price">
                          Rs. {item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div>
                      <div className="order-address">
                        📍 {order.deliveryAddress}
                      </div>
                      {order.status === "completed" && (
                        <button
                          className="delivered-btn"
                          onClick={() => handleMarkDelivered(order._id)}
                        >
                          Mark as Delivered
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <div className="review-items">
                          {order.items.map((item, i) => {
                            const key = `${order._id}_${item.product?._id}`;
                            const alreadyReviewed = reviewedSet.has(key);
                            return (
                              <button
                                key={i}
                                className="review-btn"
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
                          })}
                        </div>
                      )}
                    </div>
                    <div className="order-total">Rs. {order.totalAmount}</div>
                  </div>
                  <div style={{ marginTop: "0.75rem" }}>
                    <button
                      onClick={() =>
                        setOpenOrderChat(
                          openOrderChat === order._id ? null : order._id,
                        )
                      }
                      style={{
                        backgroundColor: "#4F46E5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.4rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      💬{" "}
                      {openOrderChat === order._id
                        ? "Close Chat"
                        : "Chat with Seller"}
                    </button>
                    {openOrderChat === order._id && (
                      <div style={{ marginTop: "1rem" }}>
                        <ChatBox
                          currentUserId={localStorage.getItem("userId")}
                          currentUserRole="customer"
                          otherUserId={order.seller?._id}
                          roomId={`order_${order._id}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="modal-label">Rate your experience</div>
            <h2 className="modal-title">{reviewModal.productName}</h2>

            <div className="star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= (hoverRating || rating) ? "filled" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="star-label">
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][
                hoverRating || rating
              ] || "Tap a star"}
            </div>

            <textarea
              className="review-textarea"
              placeholder="Share your thoughts (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            {reviewMsg && (
              <p
                className={`review-msg ${reviewMsg.includes("✓") ? "success" : "error"}`}
              >
                {reviewMsg}
              </p>
            )}

            <button
              className="submit-review-btn"
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
