import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import { useNavigate } from "react-router-dom";
import "../css/MyOrders.css";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  accepted: { bg: "#dbeafe", color: "#1e40af" },
  preparing: { bg: "#ffedd5", color: "#9a3412" },
  completed: { bg: "#dcfce7", color: "#166534" },
  declined: { bg: "#fee2e2", color: "#991b1b" },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
                      {order.status}
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
                    <div className="order-address">
                      📍 {order.deliveryAddress}
                    </div>
                    <div className="order-total">Rs. {order.totalAmount}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
