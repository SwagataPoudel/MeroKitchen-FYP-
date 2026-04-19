import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardStats,
  fetchAllUsers,
  fetchUserById,
  deleteUser,
  updateUserRole,
  updateUserProfile,
  toggleUserAvailability,
  fetchAllOrders,
  fetchOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  deleteOrder,
  bulkUpdateOrderStatus,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  fetchAllReviews,
  deleteReview,
  fetchVerificationRequests,
  updateVerificationStatus,
  expireSellerSubscription,
} from "../../api/adminApi";
import "../../css/AdminDashboard.css";

const TABS = [
  "Dashboard",
  "Users",
  "Orders",
  "Products",
  "Reviews",
  "Verifications",
];
const ORDER_STATUSES = [
  "pending",
  "accepted",
  "preparing",
  "completed",
  "declined",
  "delivered",
  "cancelled",
];
const PRODUCT_CATEGORIES = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "desserts",
  "drinks",
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [stats, setStats] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userVerifFilter, setUserVerifFilter] = useState("all");
  const [userSubFilter, setUserSubFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userEditForm, setUserEditForm] = useState({});

  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("all");
  const [orderMethodFilter, setOrderMethodFilter] = useState("all");
  const [orderDateFrom, setOrderDateFrom] = useState("");
  const [orderDateTo, setOrderDateTo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("completed");

  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productAvailFilter, setProductAvailFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productEditForm, setProductEditForm] = useState({});

  const [reviews, setReviews] = useState([]);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");

  const [verifications, setVerifications] = useState([]);
  const [noteMap, setNoteMap] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  const handleExpireSubscription = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to expire this seller's subscription? This will also remove their verified badge.",
      )
    )
      return;
    try {
      const res = await expireSellerSubscription(userId);
    
      setSelectedUser((prev) =>
        prev ? { ...prev, user: res.data.user } : prev,
      );
   
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data.user : u)),
      );
      alert("Subscription expired and verified badge removed.");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to expire subscription.");
    }
  };

  const showMsg = (text, error = false) => {
    setMessage({ text, error });
    setTimeout(() => setMessage({ text: "", error: false }), 3000);
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        if (activeTab === "Dashboard") {
          const res = await fetchDashboardStats();
          setStats(res.data.stats);
          setOrdersByStatus(res.data.ordersByStatus);
          setRecentOrders(res.data.recentOrders);
          setTopProducts(res.data.topProducts || []);
        } else if (activeTab === "Users") {
          const res = await fetchAllUsers();
          setUsers(res.data.users);
        } else if (activeTab === "Orders") {
          const res = await fetchAllOrders();
          setOrders(res.data.orders);
        } else if (activeTab === "Products") {
          const res = await fetchAllProducts();
          setProducts(res.data.products);
        } else if (activeTab === "Reviews") {
          const res = await fetchAllReviews();
          setReviews(res.data.reviews);
        } else if (activeTab === "Verifications") {
          const res = await fetchVerificationRequests();
          setVerifications(res.data.requests);
        }
      } catch {
        showMsg("Failed to load data.", true);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const handleViewUser = async (id) => {
    try {
      const res = await fetchUserById(id);
      setSelectedUser(res.data);
    } catch {
      showMsg("Failed to load user.", true);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    setUsers((p) => p.filter((u) => u._id !== id));
    showMsg("User deleted.");
  };

  const handleRoleChange = async (id, role) => {
    const res = await updateUserRole(id, role);
    setUsers((p) => p.map((u) => (u._id === id ? res.data.user : u)));
    showMsg("Role updated.");
  };

  const handleToggleAvailability = async (id) => {
    const res = await toggleUserAvailability(id);
    setUsers((p) =>
      p.map((u) =>
        u._id === id ? { ...u, isAvailable: res.data.user.isAvailable } : u,
      ),
    );
    showMsg(res.data.message);
  };

  const openEditUser = (u) => {
    setEditingUser(u._id);
    setUserEditForm({
      name: u.name || "",
      phone: u.phone || "",
      city: u.city || "",
      kitchenName: u.kitchenName || "",
      kitchenDescription: u.kitchenDescription || "",
      openingHours: u.openingHours || "",
      defaultDeliveryAddress: u.defaultDeliveryAddress || "",
    });
  };

  const handleSaveUserEdit = async (id) => {
    try {
      const res = await updateUserProfile(id, userEditForm);
      setUsers((p) => p.map((u) => (u._id === id ? res.data.user : u)));
      setEditingUser(null);
      showMsg("User updated.");
    } catch {
      showMsg("Update failed.", true);
    }
  };

  const handleViewOrder = async (id) => {
    try {
      const res = await fetchOrderById(id);
      setSelectedOrder(res.data.order);
    } catch {
      showMsg("Failed to load order.", true);
    }
  };

  const handleOrderStatus = async (id, status) => {
    const res = await updateOrderStatus(id, status);
    setOrders((p) => p.map((o) => (o._id === id ? res.data.order : o)));
    showMsg("Status updated.");
  };

  const handleOrderPaymentStatus = async (id, paymentStatus) => {
    const res = await updateOrderPaymentStatus(id, paymentStatus);
    setOrders((p) =>
      p.map((o) =>
        o._id === id
          ? { ...o, paymentStatus: res.data.order.paymentStatus }
          : o,
      ),
    );
    showMsg("Payment status updated.");
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await deleteOrder(id);
    setOrders((p) => p.filter((o) => o._id !== id));
    showMsg("Order deleted.");
  };

  const handleBulkStatus = async () => {
    if (!selectedOrderIds.length)
      return showMsg("Select at least one order.", true);
    const res = await bulkUpdateOrderStatus(selectedOrderIds, bulkStatus);
    setOrders((p) =>
      p.map((o) =>
        selectedOrderIds.includes(o._id) ? { ...o, status: bulkStatus } : o,
      ),
    );
    setSelectedOrderIds([]);
    showMsg(`${res.data.modifiedCount} orders updated.`);
  };

  const toggleOrderSelect = (id) => {
    setSelectedOrderIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  };

  const handleViewProduct = async (id) => {
    try {
      const res = await fetchProductById(id);
      setSelectedProduct(res.data);
    } catch {
      showMsg("Failed to load product.", true);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((p) => p.filter((pr) => pr._id !== id));
    showMsg("Product deleted.");
  };

  const handleToggleProduct = async (id) => {
    const res = await toggleProductAvailability(id);
    setProducts((p) => p.map((pr) => (pr._id === id ? res.data.product : pr)));
    showMsg("Availability toggled.");
  };

  const openEditProduct = (p) => {
    setEditingProduct(p._id);
    setProductEditForm({
      name: p.name || "",
      price: p.price || "",
      category: p.category || "",
      description: p.description || "",
      preparationTime: p.preparationTime || "",
      ingredients: (p.ingredients || []).join(", "),
    });
  };

  const handleSaveProductEdit = async (id) => {
    try {
      const payload = {
        ...productEditForm,
        price: Number(productEditForm.price),
        preparationTime: Number(productEditForm.preparationTime),
        ingredients: productEditForm.ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await updateProduct(id, payload);
      setProducts((p) =>
        p.map((pr) => (pr._id === id ? res.data.product : pr)),
      );
      setEditingProduct(null);
      showMsg("Product updated.");
    } catch {
      showMsg("Update failed.", true);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(id);
    setReviews((p) => p.filter((r) => r._id !== id));
    showMsg("Review deleted.");
  };

  const handleVerification = async (id, status) => {
    setActionLoading(id + status);
    try {
      await updateVerificationStatus(id, status, noteMap[id] || "");
      setVerifications((p) => p.filter((v) => v._id !== id));
      showMsg(`Seller ${status}.`);
    } catch {
      showMsg("Action failed.", true);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !userSearch ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.kitchenName?.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchVerif =
      userVerifFilter === "all" || u.verificationStatus === userVerifFilter;
    const matchSub =
      userSubFilter === "all" || u.subscriptionStatus === userSubFilter;
    return matchSearch && matchRole && matchVerif && matchSub;
  });

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !orderSearch ||
      o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o._id.includes(orderSearch);
    const matchStatus =
      orderStatusFilter === "all" || o.status === orderStatusFilter;
    const matchPayment =
      orderPaymentFilter === "all" || o.paymentStatus === orderPaymentFilter;
    const matchMethod =
      orderMethodFilter === "all" || o.paymentMethod === orderMethodFilter;
    return matchSearch && matchStatus && matchPayment && matchMethod;
  });

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !productSearch ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.seller?.name?.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat =
      productCategoryFilter === "all" || p.category === productCategoryFilter;
    const matchAvail =
      productAvailFilter === "all" ||
      (productAvailFilter === "true" && p.availability) ||
      (productAvailFilter === "false" && !p.availability);
    return matchSearch && matchCat && matchAvail;
  });

  const filteredReviews = reviews.filter((r) => {
    const matchRating =
      reviewRatingFilter === "all" || r.rating === Number(reviewRatingFilter);
    const matchSearch =
      !reviewSearch ||
      r.customer?.name?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.comment?.toLowerCase().includes(reviewSearch.toLowerCase());
    return matchRating && matchSearch;
  });

  const avatar = (name) => (
    <div className="adm-avatar">{name?.[0]?.toUpperCase() || "?"}</div>
  );

  const Modal = ({ children, onClose }) => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          maxWidth: 600,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            color: "#888",
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value }) => (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "0.9rem", color: "#111" }}>
        {value || <span style={{ color: "#bbb" }}>—</span>}
      </div>
    </div>
  );

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="adm-brand-header">
            <img
              src="/src/assets/logo.png"
              alt="Mero Kitchen Logo"
              className="adm-logo-img"
            />
            <div className="logo-text">
              Mero <span>Kitchen</span>
            </div>
          </div>
          <div className="adm-brand-sub">Admin Panel</div>
        </div>
        <nav className="adm-nav">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`adm-nav-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="adm-nav-icon">
                {tab === "Dashboard"}
                {tab === "Users"}
                {tab === "Orders"}
                {tab === "Products"}
                {tab === "Reviews"}
                {tab === "Verifications"}
              </span>
              <span className="adm-nav-label">{tab}</span>
            </button>
          ))}
        </nav>
        <button className="adm-logout" onClick={handleLogout}>
          <span>Logout</span>
        </button>
      </aside>

      <main className="adm-main">
        <div className="adm-page-header">
          <h1>{activeTab}</h1>
          {message.text && (
            <div className={`adm-msg ${message.error ? "error" : ""}`}>
              {message.text}
            </div>
          )}
        </div>

        {loading ? (
          <div className="adm-loading">Loading...</div>
        ) : (
          <>
            {activeTab === "Dashboard" && stats && (
              <div>
                <div className="adm-stats-grid">
                  {[
                    { label: "Users", value: stats.totalUsers },
                    { label: "Sellers", value: stats.totalSellers },
                    { label: "Customers", value: stats.totalCustomers },
                    { label: "Orders", value: stats.totalOrders },
                    { label: "Products", value: stats.totalProducts },
                    { label: "Reviews", value: stats.totalReviews },
                    {
                      label: "Revenue",
                      value: `Rs. ${stats.totalRevenue?.toLocaleString()}`,
                      accent: true,
                    },
                    {
                      label: "Order Rev.",
                      value: `Rs. ${stats.orderRevenue?.toLocaleString()}`,
                    },
                    {
                      label: "Sub. Rev.",
                      value: `Rs. ${stats.subscriptionRevenue?.toLocaleString()}`,
                    },
                  ].map((s) => (
                    <div className="adm-stat" key={s.label}>
                      <div className="adm-stat-label">{s.label}</div>
                      <div
                        className={`adm-stat-value ${s.accent ? "accent" : ""}`}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="adm-section-title">Orders by status</div>
                <div className="adm-status-grid">
                  {ordersByStatus.map((s) => (
                    <div className="adm-status-pill" key={s._id}>
                      <span
                        className="adm-status-count"
                        style={{ color: "white" }}
                      >
                        {s.count}
                      </span>
                      <span className="adm-status-name">{s._id}</span>
                    </div>
                  ))}
                </div>

                <div className="adm-section-title">Top rated products</div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Avg Rating</th>
                        <th>Reviews</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p) => (
                        <tr key={p._id}>
                          <td className="adm-bold">{p.product?.name}</td>
                          <td className="adm-muted">{p.product?.category}</td>
                          <td>Rs. {p.product?.price?.toLocaleString()}</td>
                          <td>
                            {"⭐".repeat(Math.round(p.avgRating))} (
                            {p.avgRating})
                          </td>
                          <td>{p.reviewCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="adm-section-title">Recent orders</div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Seller</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td className="adm-mono">
                            #{o._id.slice(-6).toUpperCase()}
                          </td>
                          <td>
                            <div className="adm-user-cell">
                              {avatar(o.customer?.name)}
                              {o.customer?.name || "N/A"}
                            </div>
                          </td>
                          <td>
                            {o.seller?.kitchenName || o.seller?.name || "N/A"}
                          </td>
                          <td className="adm-bold">
                            Rs. {o.totalAmount?.toLocaleString()}
                          </td>
                          <td>
                            <span
                              className={`adm-badge pay-${o.paymentStatus}`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`adm-badge ord-${o.status}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "Users" && (
              <div>
                <div className="adm-toolbar">
                  <input
                    className="adm-search"
                    placeholder="Search name, email, kitchen, city..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                  <select
                    className="adm-select"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                  >
                    <option value="all">All roles</option>
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select
                    className="adm-select"
                    value={userVerifFilter}
                    onChange={(e) => setUserVerifFilter(e.target.value)}
                  >
                    <option value="all">All verifications</option>
                    <option value="none">None</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    className="adm-select"
                    value={userSubFilter}
                    onChange={(e) => setUserSubFilter(e.target.value)}
                  >
                    <option value="all">All subscriptions</option>
                    <option value="none">None</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                  <span className="adm-count">
                    {filteredUsers.length} users
                  </span>
                </div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>City</th>
                        <th>Verification</th>
                        <th>Subscription</th>
                        <th>Availability</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="adm-user-cell">
                              {avatar(u.name)}
                              <span className="adm-bold">{u.name}</span>
                            </div>
                          </td>
                          <td className="adm-muted">{u.email}</td>
                          <td>
                            <select
                              className="adm-select"
                              value={u.role}
                              onChange={(e) =>
                                handleRoleChange(u._id, e.target.value)
                              }
                            >
                              <option value="customer">Customer</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="adm-muted">{u.city || "—"}</td>
                          <td>
                            <span
                              className={`adm-badge ord-${u.verificationStatus === "approved" ? "completed" : u.verificationStatus === "pending" ? "pending" : u.verificationStatus === "rejected" ? "declined" : "pending"}`}
                            >
                              {u.verificationStatus}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`adm-badge ${u.subscriptionStatus === "active" ? "pay-paid" : "pay-unpaid"}`}
                            >
                              {u.subscriptionStatus}
                            </span>
                          </td>

                          <td>
                            {u.role === "seller" ? (
                              <button
                                className={`adm-btn ${u.isAvailable ? "success" : "warning"}`}
                                onClick={() => handleToggleAvailability(u._id)}
                              >
                                {u.isAvailable ? "Open" : "Closed"}
                              </button>
                            ) : (
                              <span className="adm-muted">—</span>
                            )}
                          </td>
                          <td className="adm-muted adm-small">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                className="adm-btn success"
                                onClick={() => handleViewUser(u._id)}
                              >
                                View
                              </button>
                              <button
                                className="adm-btn warning"
                                onClick={() => openEditUser(u)}
                              >
                                Edit
                              </button>
                              <button
                                className="adm-btn danger"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="adm-empty">No users found.</div>
                  )}
                </div>

                {editingUser &&
                  (() => {
                    const u = users.find((x) => x._id === editingUser);
                    return (
                      <Modal onClose={() => setEditingUser(null)}>
                        <h2
                          style={{
                            fontFamily: "Playfair Display, serif",
                            marginBottom: 20,
                            color: "#ce742a",
                          }}
                        >
                          Edit User — {u?.name}
                        </h2>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 14,
                          }}
                        >
                          {[
                            { key: "name", label: "Name" },
                            { key: "phone", label: "Phone" },
                            { key: "city", label: "City" },
                            { key: "kitchenName", label: "Kitchen Name" },
                            { key: "openingHours", label: "Opening Hours" },
                            {
                              key: "defaultDeliveryAddress",
                              label: "Delivery Address",
                            },
                          ].map(({ key, label }) => (
                            <div key={key}>
                              <label
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  color: "#888",
                                  display: "block",
                                  marginBottom: 4,
                                }}
                              >
                                {label}
                              </label>
                              <input
                                style={{
                                  width: "100%",
                                  padding: "8px 12px",
                                  borderRadius: 8,
                                  border: "1px solid #e5e7eb",
                                  fontSize: "0.875rem",
                                  outline: "none",
                                }}
                                value={userEditForm[key] || ""}
                                onChange={(e) =>
                                  setUserEditForm((p) => ({
                                    ...p,
                                    [key]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          ))}
                          <div style={{ gridColumn: "1/-1" }}>
                            <label
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "#888",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              Kitchen Description
                            </label>
                            <textarea
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                                fontSize: "0.875rem",
                                resize: "vertical",
                                outline: "none",
                              }}
                              rows={3}
                              value={userEditForm.kitchenDescription || ""}
                              onChange={(e) =>
                                setUserEditForm((p) => ({
                                  ...p,
                                  kitchenDescription: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div
                          style={{ display: "flex", gap: 10, marginTop: 20 }}
                        >
                          <button
                            className="adm-btn approve"
                            onClick={() => handleSaveUserEdit(editingUser)}
                          >
                            Save Changes
                          </button>
                          {(() => {
                            const u = users.find((x) => x._id === editingUser);
                            return u?.role === "seller" &&
                              u?.subscriptionStatus === "active" ? (
                              <button
                                className="adm-btn danger"
                                onClick={() =>
                                  handleExpireSubscription(editingUser)
                                }
                              >
                                Expire Subscription
                              </button>
                            ) : null;
                          })()}
                          <button
                            className="adm-btn danger"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </Modal>
                    );
                  })()}

                {selectedUser && (
                  <Modal onClose={() => setSelectedUser(null)}>
                    <h2
                      style={{
                        fontFamily: "Playfair Display, serif",
                        marginBottom: 4,
                        color: "#ce742a",
                      }}
                    >
                      {selectedUser.user.name}
                    </h2>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "0.82rem",
                        marginBottom: 20,
                      }}
                    >
                      {selectedUser.user.email} · {selectedUser.user.role}
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 12,
                        background: "#fdf0eb",
                        borderRadius: 10,
                        padding: "14px 16px",
                        marginBottom: 20,
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#ce742a",
                          }}
                        >
                          {selectedUser.meta.orderCount}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#888" }}>
                          Orders
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#ce742a",
                          }}
                        >
                          Rs. {selectedUser.meta.totalSpent?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#888" }}>
                          Total Spent
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#ce742a",
                          }}
                        >
                          {selectedUser.meta.reviewCount}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#888" }}>
                          Reviews
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                      }}
                    >
                      <Field label="Phone" value={selectedUser.user.phone} />
                      <Field label="City" value={selectedUser.user.city} />
                      <Field
                        label="Kitchen Name"
                        value={selectedUser.user.kitchenName}
                      />
                      <Field
                        label="Opening Hours"
                        value={selectedUser.user.openingHours}
                      />
                      <Field
                        label="Verification"
                        value={selectedUser.user.verificationStatus}
                      />
                      <Field
                        label="Subscription"
                        value={selectedUser.user.subscriptionStatus}
                      />
                      <Field
                        label="Verified Seller"
                        value={
                          selectedUser.user.isVerifiedSeller ? "Yes ✅" : "No"
                        }
                      />
                      <Field
                        label="Available"
                        value={selectedUser.user.isAvailable ? "Yes" : "No"}
                      />
                      <div style={{ gridColumn: "1/-1" }}>
                        <Field
                          label="Kitchen Description"
                          value={selectedUser.user.kitchenDescription}
                        />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <Field
                          label="Cuisine Types"
                          value={selectedUser.user.cuisineTypes?.join(", ")}
                        />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <Field
                          label="Default Delivery Address"
                          value={selectedUser.user.defaultDeliveryAddress}
                        />
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            )}

            {activeTab === "Orders" && (
              <div>
                <div className="adm-toolbar">
                  <input
                    className="adm-search"
                    placeholder="Search customer or order ID..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                  <select
                    className="adm-select"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    className="adm-select"
                    value={orderPaymentFilter}
                    onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  >
                    <option value="all">All payments</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <select
                    className="adm-select"
                    value={orderMethodFilter}
                    onChange={(e) => setOrderMethodFilter(e.target.value)}
                  >
                    <option value="all">All methods</option>
                    <option value="cod">COD</option>
                    <option value="khalti">Khalti</option>
                  </select>
                  <input
                    className="adm-select"
                    type="date"
                    value={orderDateFrom}
                    onChange={(e) => setOrderDateFrom(e.target.value)}
                    title="From date"
                  />
                  <input
                    className="adm-select"
                    type="date"
                    value={orderDateTo}
                    onChange={(e) => setOrderDateTo(e.target.value)}
                    title="To date"
                  />
                  <span className="adm-count">
                    {filteredOrders.length} orders
                  </span>
                </div>

                {selectedOrderIds.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#fdf0eb",
                      border: "1px solid #f5c9a0",
                      borderRadius: 10,
                      padding: "10px 16px",
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#ce742a",
                      }}
                    >
                      {selectedOrderIds.length} selected
                    </span>
                    <select
                      className="adm-select"
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      className="adm-btn approve"
                      onClick={handleBulkStatus}
                    >
                      Apply to all
                    </button>
                    <button
                      className="adm-btn danger"
                      onClick={() => setSelectedOrderIds([])}
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setSelectedOrderIds(
                                e.target.checked
                                  ? filteredOrders.map((o) => o._id)
                                  : [],
                              )
                            }
                            checked={
                              selectedOrderIds.length ===
                                filteredOrders.length &&
                              filteredOrders.length > 0
                            }
                          />
                        </th>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Seller</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.includes(o._id)}
                              onChange={() => toggleOrderSelect(o._id)}
                            />
                          </td>
                          <td className="adm-mono">
                            #{o._id.slice(-6).toUpperCase()}
                          </td>
                          <td>
                            <div className="adm-user-cell">
                              {avatar(o.customer?.name)}
                              {o.customer?.name || "N/A"}
                            </div>
                          </td>
                          <td>
                            {o.seller?.kitchenName || o.seller?.name || "N/A"}
                          </td>
                          <td className="adm-bold">
                            Rs. {o.totalAmount?.toLocaleString()}
                          </td>
                          <td>
                            <span className="adm-badge ord-accepted">
                              {o.paymentMethod?.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <select
                              className="adm-select"
                              value={o.paymentStatus}
                              onChange={(e) =>
                                handleOrderPaymentStatus(o._id, e.target.value)
                              }
                            >
                              <option value="paid">paid</option>
                              <option value="unpaid">unpaid</option>
                            </select>
                          </td>
                          <td>
                            <select
                              className="adm-select"
                              value={o.status}
                              onChange={(e) =>
                                handleOrderStatus(o._id, e.target.value)
                              }
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="adm-muted adm-small">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                className="adm-btn success"
                                onClick={() => handleViewOrder(o._id)}
                              >
                                View
                              </button>
                              <button
                                className="adm-btn danger"
                                onClick={() => handleDeleteOrder(o._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <div className="adm-empty">No orders found.</div>
                  )}
                </div>

                {selectedOrder && (
                  <Modal onClose={() => setSelectedOrder(null)}>
                    <h2
                      style={{
                        fontFamily: "Playfair Display, serif",
                        marginBottom: 4,
                        color: "#ce742a",
                      }}
                    >
                      Order #{selectedOrder._id.slice(-6).toUpperCase()}
                    </h2>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "0.82rem",
                        marginBottom: 20,
                      }}
                    >
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginBottom: 16,
                      }}
                    >
                      <Field
                        label="Customer"
                        value={`${selectedOrder.customer?.name} (${selectedOrder.customer?.email})`}
                      />
                      <Field
                        label="Customer Phone"
                        value={selectedOrder.customer?.phone}
                      />
                      <Field
                        label="Seller"
                        value={
                          selectedOrder.seller?.kitchenName ||
                          selectedOrder.seller?.name
                        }
                      />
                      <Field
                        label="Delivery Address"
                        value={selectedOrder.deliveryAddress}
                      />
                      <Field
                        label="Payment Method"
                        value={selectedOrder.paymentMethod?.toUpperCase()}
                      />
                      <Field
                        label="Payment Status"
                        value={selectedOrder.paymentStatus}
                      />
                      <Field
                        label="Order Status"
                        value={selectedOrder.status}
                      />
                      <Field
                        label="Special Request"
                        value={selectedOrder.specialRequest}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#888",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 10,
                      }}
                    >
                      Items
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: 16,
                      }}
                    >
                      {selectedOrder.items?.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#faf9f7",
                            borderRadius: 8,
                            padding: "10px 14px",
                          }}
                        >
                          <div>
                            <div
                              style={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              {item.product?.name || "Unknown"}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#888" }}>
                              {item.product?.category} · Qty: {item.quantity}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, color: "#ce742a" }}>
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid #f0ede8",
                        paddingTop: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 700,
                      }}
                    >
                      <span>Total</span>
                      <span style={{ color: "#ce742a" }}>
                        Rs. {selectedOrder.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </Modal>
                )}
              </div>
            )}

            {activeTab === "Products" && (
              <div>
                <div className="adm-toolbar">
                  <input
                    className="adm-search"
                    placeholder="Search products or seller..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  <select
                    className="adm-select"
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                  >
                    <option value="all">All categories</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    className="adm-select"
                    value={productAvailFilter}
                    onChange={(e) => setProductAvailFilter(e.target.value)}
                  >
                    <option value="all">All availability</option>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                  <span className="adm-count">
                    {filteredProducts.length} products
                  </span>
                </div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Seller</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Prep Time</th>
                        <th>Rating</th>
                        <th>Available</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p._id}>
                          <td className="adm-bold">{p.name}</td>
                          <td>
                            {p.seller?.kitchenName || p.seller?.name || "N/A"}
                          </td>
                          <td className="adm-muted">{p.category}</td>
                          <td>Rs. {p.price?.toLocaleString()}</td>
                          <td className="adm-muted">{p.preparationTime} min</td>
                          <td>
                            ⭐ {p.ratings?.average?.toFixed(1) || "0"} (
                            {p.ratings?.count || 0})
                          </td>
                          <td>
                            <button
                              className={`adm-btn ${p.availability ? "success" : "warning"}`}
                              onClick={() => handleToggleProduct(p._id)}
                            >
                              {p.availability ? "Yes" : "No"}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                className="adm-btn success"
                                onClick={() => handleViewProduct(p._id)}
                              >
                                View
                              </button>
                              <button
                                className="adm-btn warning"
                                onClick={() => openEditProduct(p)}
                              >
                                Edit
                              </button>
                              <button
                                className="adm-btn danger"
                                onClick={() => handleDeleteProduct(p._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <div className="adm-empty">No products found.</div>
                  )}
                </div>

                {editingProduct && (
                  <Modal onClose={() => setEditingProduct(null)}>
                    <h2
                      style={{
                        fontFamily: "Playfair Display, serif",
                        marginBottom: 20,
                        color: "#ce742a",
                      }}
                    >
                      Edit Product
                    </h2>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      {[
                        { key: "name", label: "Name" },
                        { key: "price", label: "Price (Rs.)", type: "number" },
                        {
                          key: "preparationTime",
                          label: "Prep Time (min)",
                          type: "number",
                        },
                      ].map(({ key, label, type }) => (
                        <div key={key}>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#888",
                              display: "block",
                              marginBottom: 4,
                            }}
                          >
                            {label}
                          </label>
                          <input
                            type={type || "text"}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1px solid #e5e7eb",
                              fontSize: "0.875rem",
                              outline: "none",
                            }}
                            value={productEditForm[key] || ""}
                            onChange={(e) =>
                              setProductEditForm((p) => ({
                                ...p,
                                [key]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                      <div>
                        <label
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#888",
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          Category
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: "0.875rem",
                            outline: "none",
                          }}
                          value={productEditForm.category || ""}
                          onChange={(e) =>
                            setProductEditForm((p) => ({
                              ...p,
                              category: e.target.value,
                            }))
                          }
                        >
                          {PRODUCT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <label
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#888",
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          Ingredients (comma-separated)
                        </label>
                        <input
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: "0.875rem",
                            outline: "none",
                          }}
                          value={productEditForm.ingredients || ""}
                          onChange={(e) =>
                            setProductEditForm((p) => ({
                              ...p,
                              ingredients: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <label
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#888",
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          Description
                        </label>
                        <textarea
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: "0.875rem",
                            resize: "vertical",
                            outline: "none",
                          }}
                          rows={3}
                          value={productEditForm.description || ""}
                          onChange={(e) =>
                            setProductEditForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                      <button
                        className="adm-btn approve"
                        onClick={() => handleSaveProductEdit(editingProduct)}
                      >
                        Save Changes
                      </button>
                      <button
                        className="adm-btn danger"
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </Modal>
                )}

                {selectedProduct && (
                  <Modal onClose={() => setSelectedProduct(null)}>
                    <h2
                      style={{
                        fontFamily: "Playfair Display, serif",
                        marginBottom: 4,
                        color: "#ce742a",
                      }}
                    >
                      {selectedProduct.product.name}
                    </h2>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "0.82rem",
                        marginBottom: 20,
                      }}
                    >
                      {selectedProduct.product.category}
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 12,
                        background: "#fdf0eb",
                        borderRadius: 10,
                        padding: "14px 16px",
                        marginBottom: 20,
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#ce742a",
                          }}
                        >
                          {selectedProduct.meta.avgRating} ⭐
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#888" }}>
                          Avg Rating
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#ce742a",
                          }}
                        >
                          {selectedProduct.meta.reviewCount}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#888" }}>
                          Reviews
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#ce742a",
                          }}
                        >
                          {selectedProduct.meta.orderCount}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#888" }}>
                          Orders
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                      }}
                    >
                      <Field
                        label="Price"
                        value={`Rs. ${selectedProduct.product.price?.toLocaleString()}`}
                      />
                      <Field
                        label="Preparation Time"
                        value={`${selectedProduct.product.preparationTime} min`}
                      />
                      <Field
                        label="Seller"
                        value={
                          selectedProduct.product.seller?.kitchenName ||
                          selectedProduct.product.seller?.name
                        }
                      />
                      <Field
                        label="Available"
                        value={
                          selectedProduct.product.availability
                            ? "Yes "
                            : "No ❌"
                        }
                      />
                      <div style={{ gridColumn: "1/-1" }}>
                        <Field
                          label="Description"
                          value={selectedProduct.product.description}
                        />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <Field
                          label="Ingredients"
                          value={selectedProduct.product.ingredients?.join(
                            ", ",
                          )}
                        />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <Field
                          label="Cuisine Types"
                          value={selectedProduct.product.cuisineTypes?.join(
                            ", ",
                          )}
                        />
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            )}

            {activeTab === "Reviews" && (
              <div>
                <div className="adm-toolbar">
                  <input
                    className="adm-search"
                    placeholder="Search customer, product, comment..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                  />
                  <select
                    className="adm-select"
                    value={reviewRatingFilter}
                    onChange={(e) => setReviewRatingFilter(e.target.value)}
                  >
                    <option value="all">All ratings</option>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {"⭐".repeat(r)} ({r})
                      </option>
                    ))}
                  </select>
                  <span className="adm-count">
                    {filteredReviews.length} reviews
                  </span>
                </div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Order Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReviews.map((r) => (
                        <tr key={r._id}>
                          <td>
                            <div className="adm-user-cell">
                              {avatar(r.customer?.name)}
                              {r.customer?.name || "N/A"}
                            </div>
                          </td>
                          <td>
                            {r.product?.name || "N/A"}
                            <div className="adm-muted adm-small">
                              {r.product?.category}
                            </div>
                          </td>
                          <td>
                            {"⭐".repeat(r.rating)}{" "}
                            <span className="adm-muted">({r.rating})</span>
                          </td>
                          <td className="adm-muted" style={{ maxWidth: 220 }}>
                            {r.comment || "—"}
                          </td>
                          <td>
                            <span
                              className={`adm-badge ord-${r.order?.status}`}
                            >
                              {r.order?.status || "N/A"}
                            </span>
                          </td>
                          <td className="adm-muted adm-small">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="adm-btn danger"
                              onClick={() => handleDeleteReview(r._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredReviews.length === 0 && (
                    <div className="adm-empty">No reviews found.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Verifications" && (
              <div>
                <div className="adm-toolbar">
                  <span className="adm-count">
                    {verifications.length} pending
                  </span>
                </div>
                {verifications.length === 0 ? (
                  <div className="adm-empty">
                    No pending verification requests.
                  </div>
                ) : (
                  <div className="adm-verify-list">
                    {verifications.map((v) => (
                      <div className="adm-verify-card" key={v._id}>
                        <div className="adm-verify-header">
                          <div className="adm-user-cell">
                            {avatar(v.kitchenName || v.name)}
                            <div>
                              <div className="adm-bold">
                                {v.kitchenName || v.name}
                              </div>
                              <div className="adm-muted adm-small">
                                {v.email} — {v.city}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                              alignItems: "flex-end",
                            }}
                          >
                            <span className="adm-badge ord-pending">
                              Docs: {v.verificationStatus}
                            </span>
                            <span
                              className={`adm-badge ${v.subscriptionStatus === "active" ? "pay-paid" : "pay-unpaid"}`}
                            >
                              Sub: {v.subscriptionStatus || "none"}
                            </span>
                            {v.subscriptionStatus !== "active" && (
                              <span
                                className="adm-muted adm-small"
                                style={{ color: "#b45309" }}
                              >
                                Badge withheld until subscribed
                              </span>
                            )}
                            {v.subscriptionStatus === "active" && (
                              <span
                                className="adm-muted adm-small"
                                style={{ color: "#2d7a4f" }}
                              >
                                Approval will grant badge
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="adm-verify-docs">
                          <span className="adm-muted adm-small">
                            Documents:
                          </span>
                          {v.verificationDocuments?.length > 0 ? (
                            v.verificationDocuments.map((doc, i) => (
                              <a
                                key={doc}
                                href={`http://localhost:3000${doc}`}
                                target="_blank"
                                rel="noreferrer"
                                className="adm-doc-link"
                              >
                                Doc {i + 1}
                              </a>
                            ))
                          ) : (
                            <span className="adm-muted adm-small">
                              None uploaded.
                            </span>
                          )}
                        </div>
                        <div className="adm-verify-actions">
                          <textarea
                            className="adm-verify-note"
                            placeholder="Rejection note (optional)..."
                            rows={2}
                            value={noteMap[v._id] || ""}
                            onChange={(e) =>
                              setNoteMap((p) => ({
                                ...p,
                                [v._id]: e.target.value,
                              }))
                            }
                          />
                          <div className="adm-action-btns">
                            <button
                              className="adm-btn approve"
                              disabled={actionLoading === v._id + "approved"}
                              onClick={() =>
                                handleVerification(v._id, "approved")
                              }
                            >
                              {actionLoading === v._id + "approved"
                                ? "Approving..."
                                : "Approve"}
                            </button>
                            <button
                              className="adm-btn reject"
                              disabled={actionLoading === v._id + "rejected"}
                              onClick={() =>
                                handleVerification(v._id, "rejected")
                              }
                            >
                              {actionLoading === v._id + "rejected"
                                ? "Rejecting..."
                                : " Reject"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
