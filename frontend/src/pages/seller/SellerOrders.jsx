import { useEffect, useState } from "react";
import { getSellerOrders, updateOrderStatus } from "../../api/orderApi";
import "../../css/SellerOrders.css";
import ChatBox from "../../components/ChatBox";
import SellerChatRequests from "../../components/SellerChatRequests";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  accepted: { bg: "#dbeafe", color: "#1e40af" },
  preparing: { bg: "#ffedd5", color: "#9a3412" },
  completed: { bg: "#fef08a", color: "#713f12" }, // changed
  delivered: { bg: "#dcfce7", color: "#166534" }, // new
  declined: { bg: "#fee2e2", color: "#991b1b" },
};

const STATUS_LABELS = {
  completed: "Ready for Delivery 🛵",
  delivered: "Delivered ✓",
};

const NEXT_ACTIONS = {
  pending: ["accepted", "declined"],
  accepted: ["preparing"],
  preparing: ["completed"],
  completed: [],
  declined: [],
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderChat, setOpenOrderChat] = useState(null);

  const fetchOrders = () => {
    getSellerOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <div className="seller-orders-hero">
          <div className="seller-orders-hero-inner">
            <div className="section-label">Manage Orders</div>
            <h1 className="orders-title">
              Incoming <em>Orders</em>
            </h1>
          </div>
        </div>

        <div className="orders-body">
          <SellerChatRequests />
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
              
              <p>No orders yet.</p>
            </div>
          ) : (
            orders.map((order) => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const actions = NEXT_ACTIONS[order.status] || [];
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
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  <div className="order-customer">
                    From <strong>{order.customer?.name}</strong> ·{" "}
                    {order.customer?.email}
                  </div>
                  <div className="order-address">
                     {order.deliveryAddress}
                  </div>
                  {order.specialRequest && (
                    <div className="order-address">
                       {order.specialRequest}
                    </div>
                  )}

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
                          <div className="order-item-placeholder"></div>
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
                    <div className="order-total">Rs. {order.totalAmount}</div>
                    <div className="action-btns">
                      {actions.includes("accepted") && (
                        <button
                          className="action-btn accept"
                          onClick={() => handleStatus(order._id, "accepted")}
                        >
                          Accept
                        </button>
                      )}
                      {actions.includes("preparing") && (
                        <button
                          className="action-btn prepare"
                          onClick={() => handleStatus(order._id, "preparing")}
                        >
                          Preparing
                        </button>
                      )}
                      {actions.includes("completed") && (
                        <button
                          className="action-btn complete"
                          onClick={() => handleStatus(order._id, "completed")}
                        >
                          Complete
                        </button>
                      )}
                      {actions.includes("declined") && (
                        <button
                          className="action-btn decline"
                          onClick={() => handleStatus(order._id, "declined")}
                        >
                          Decline
                        </button>
                      )}
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
                        {" "}
                        {openOrderChat === order._id
                          ? "Close Chat"
                          : "Chat with Customer"}
                      </button>
                      {openOrderChat === order._id && (
                        <div style={{ marginTop: "1rem" }}>
                          <ChatBox
                            currentUserId={localStorage.getItem("userId")}
                            currentUserRole="seller"
                            otherUserId={order.customer?._id}
                            roomId={`order_${order._id}`}
                          />
                        </div>
                      )}
                    </div>
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
