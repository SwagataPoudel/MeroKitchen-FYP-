import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardStats,
  fetchAllUsers, deleteUser, updateUserRole,
  fetchAllOrders, updateOrderStatus,
  fetchAllProducts, deleteProduct, toggleProductAvailability,
  fetchAllReviews, deleteReview,
  fetchVerificationRequests, updateVerificationStatus,
} from "../../api/adminApi";
import "../../css/AdminDashboard.css";

const TABS = ["Dashboard", "Users", "Orders", "Products", "Reviews", "Verifications"];
const ORDER_STATUSES = ["pending","accepted","preparing","completed","declined","delivered"];

const STATUS_COLORS = {
  pending: "#b45309", accepted: "#185fa5", preparing: "#5b21b6",
  completed: "#2d7a4f", delivered: "#2d7a4f", declined: "#c0392b",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  // ── Dashboard state ──
  const [stats, setStats] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // ── Users state ──
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  // ── Orders state ──
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // ── Products state ──
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");

  // ── Reviews state ──
  const [reviews, setReviews] = useState([]);

  // ── Verifications state ──
  const [verifications, setVerifications] = useState([]);
  const [noteMap, setNoteMap] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  // ── Loading / message ──
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  const showMsg = (text, error = false) => {
    setMessage({ text, error });
    setTimeout(() => setMessage({ text: "", error: false }), 3000);
  };

  // ── Fetch per tab ──
  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        if (activeTab === "Dashboard") {
          const res = await fetchDashboardStats();
          setStats(res.data.stats);
          setOrdersByStatus(res.data.ordersByStatus);
          setRecentOrders(res.data.recentOrders);
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
    };
    load();
  }, [activeTab]);

  const handleLogout = () => { localStorage.clear(); navigate("/auth"); };

  // ── User actions ──
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    setUsers((p) => p.filter((u) => u._id !== id));
    showMsg("User deleted.");
  };
  const handleRoleChange = async (id, role) => {
    const res = await updateUserRole(id, role);
    setUsers((p) => p.map((u) => (u._id === id ? res.data.user : u)));
  };

  // ── Order actions ──
  const handleOrderStatus = async (id, status) => {
    const res = await updateOrderStatus(id, status);
    setOrders((p) => p.map((o) => (o._id === id ? res.data.order : o)));
  };

  // ── Product actions ──
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((p) => p.filter((pr) => pr._id !== id));
    showMsg("Product deleted.");
  };
  const handleToggleProduct = async (id) => {
    const res = await toggleProductAvailability(id);
    setProducts((p) => p.map((pr) => (pr._id === id ? res.data.product : pr)));
  };

  // ── Review actions ──
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(id);
    setReviews((p) => p.filter((r) => r._id !== id));
    showMsg("Review deleted.");
  };

  // ── Verification actions ──
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

  // ── Filtered data ──
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchSearch = !orderSearch ||
      o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o._id.includes(orderSearch);
    const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.seller?.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const avatar = (name) => (
    <div className="adm-avatar">{name?.[0]?.toUpperCase() || "?"}</div>
  );

  return (
    <div className="adm-layout">
      {/* ── Sidebar ── */}
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="logo-text">
          Mero <span>Kitchen</span>
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
                {tab === "Dashboard" }
                {tab === "Users" }
                {tab === "Orders" }
                {tab === "Products" }
                {tab === "Reviews" }
                {tab === "Verifications" }
              </span>
              <span className="adm-nav-label">{tab}</span>
            </button>
          ))}
        </nav>
        <button className="adm-logout" onClick={handleLogout}>
          <span></span><span>Logout</span>
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="adm-main">
        {/* Page header */}
        <div className="adm-page-header">
          <h1>{activeTab}</h1>
          {message.text && (
            <div className={`adm-msg ${message.error ? "error" : ""}`}>{message.text}</div>
          )}
        </div>

        {loading ? (
          <div className="adm-loading">Loading...</div>
        ) : (
          <>
            {/* ════════════════ DASHBOARD ════════════════ */}
            {activeTab === "Dashboard" && stats && (
              <div>
                <div className="adm-stats-grid">
                  {[
                    { icon: "", label: "Users",    value: stats.totalUsers },
                    { icon: "", label: "Orders",   value: stats.totalOrders },
                    { icon: "", label: "Products", value: stats.totalProducts },
                    { icon: "", label: "Reviews",  value: stats.totalReviews },
                    { icon: "", label: "Revenue",  value: `Rs. ${stats.totalRevenue?.toLocaleString()}`, accent: true },
                  ].map((s) => (
                    <div className="adm-stat" key={s.label}>
                      <div className="adm-stat-icon">{s.icon}</div>
                      <div className="adm-stat-label">{s.label}</div>
                      <div className={`adm-stat-value ${s.accent ? "accent" : ""}`}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="adm-section-title">Orders by status</div>
                <div className="adm-status-grid">
                  {ordersByStatus.map((s) => (
                    <div className="adm-status-pill" key={s._id}>
                      <span className="adm-status-count" style={{ color:  "white" }}>
                        {s.count}
                      </span>
                      <span className="adm-status-name">{s._id}</span>
                    </div>
                  ))}
                </div>

                <div className="adm-section-title">Recent orders</div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Order ID</th><th>Customer</th><th>Seller</th>
                        <th>Amount</th><th>Payment</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td className="adm-mono">#{o._id.slice(-6).toUpperCase()}</td>
                          <td><div className="adm-user-cell">{avatar(o.customer?.name)}{o.customer?.name || "N/A"}</div></td>
                          <td>{o.seller?.name || "N/A"}</td>
                          <td className="adm-bold">Rs. {o.totalAmount?.toLocaleString()}</td>
                          <td><span className={`adm-badge pay-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                          <td><span className={`adm-badge ord-${o.status}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ════════════════ USERS ════════════════ */}
            {activeTab === "Users" && (
              <div>
                <div className="adm-toolbar">
                  <input className="adm-search" placeholder="Search users..." value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)} />
                  <span className="adm-count">{filteredUsers.length} users</span>
                </div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id}>
                          <td><div className="adm-user-cell">{avatar(u.name)}{u.name}</div></td>
                          <td className="adm-muted">{u.email}</td>
                          <td>
                            <select className="adm-select" value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}>
                              <option value="customer">Customer</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="adm-muted adm-small">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td><button className="adm-btn danger" onClick={() => handleDeleteUser(u._id)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && <div className="adm-empty">No users found.</div>}
                </div>
              </div>
            )}

            {/* ════════════════ ORDERS ════════════════ */}
            {activeTab === "Orders" && (
              <div>
                <div className="adm-toolbar">
                  <input className="adm-search" placeholder="Search orders..." value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)} />
                  <select className="adm-select" value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}>
                    <option value="all">All statuses</option>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="adm-count">{filteredOrders.length} orders</span>
                </div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Seller</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o._id}>
                          <td className="adm-mono">#{o._id.slice(-6).toUpperCase()}</td>
                          <td><div className="adm-user-cell">{avatar(o.customer?.name)}{o.customer?.name || "N/A"}</div></td>
                          <td>{o.seller?.name || "N/A"}</td>
                          <td className="adm-bold">Rs. {o.totalAmount?.toLocaleString()}</td>
                          <td><span className={`adm-badge pay-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                          <td>
                            <select className="adm-select" value={o.status}
                              onChange={(e) => handleOrderStatus(o._id, e.target.value)}>
                              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="adm-muted adm-small">{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && <div className="adm-empty">No orders found.</div>}
                </div>
              </div>
            )}

            {/* ════════════════ PRODUCTS ════════════════ */}
            {activeTab === "Products" && (
              <div>
                <div className="adm-toolbar">
                  <input className="adm-search" placeholder="Search products..." value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)} />
                  <span className="adm-count">{filteredProducts.length} products</span>
                </div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Name</th><th>Seller</th><th>Category</th><th>Price</th><th>Available</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p._id}>
                          <td className="adm-bold">{p.name}</td>
                          <td>{p.seller?.name || "N/A"}</td>
                          <td className="adm-muted">{p.category}</td>
                          <td>Rs. {p.price?.toLocaleString()}</td>
                          <td>
                            <button
                              className={`adm-btn ${p.availability ? "success" : "warning"}`}
                              onClick={() => handleToggleProduct(p._id)}>
                              {p.availability ? "Yes" : "No"}
                            </button>
                          </td>
                          <td><button className="adm-btn danger" onClick={() => handleDeleteProduct(p._id)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && <div className="adm-empty">No products found.</div>}
                </div>
              </div>
            )}

            {/* ════════════════ REVIEWS ════════════════ */}
            {activeTab === "Reviews" && (
              <div>
                <div className="adm-toolbar">
                  <span className="adm-count">{reviews.length} reviews</span>
                </div>
                <div className="adm-card">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Customer</th><th>Product</th><th>Rating</th><th>Comment</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {reviews.map((r) => (
                        <tr key={r._id}>
                          <td><div className="adm-user-cell">{avatar(r.customer?.name)}{r.customer?.name || "N/A"}</div></td>
                          <td>{r.product?.name || "N/A"}</td>
                          <td>{"⭐".repeat(r.rating)}</td>
                          <td className="adm-muted">{r.comment || "—"}</td>
                          <td><button className="adm-btn danger" onClick={() => handleDeleteReview(r._id)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reviews.length === 0 && <div className="adm-empty">No reviews found.</div>}
                </div>
              </div>
            )}

            {/* ════════════════ VERIFICATIONS ════════════════ */}
            {activeTab === "Verifications" && (
              <div>
                <div className="adm-toolbar">
                  <span className="adm-count">{verifications.length} pending</span>
                </div>
                {verifications.length === 0 ? (
                  <div className="adm-empty">No pending verification requests.</div>
                ) : (
                  <div className="adm-verify-list">
                    {verifications.map((v) => (
                      <div className="adm-verify-card" key={v._id}>
                        <div className="adm-verify-header">
                          <div className="adm-user-cell">
                            {avatar(v.kitchenName || v.name)}
                            <div>
                              <div className="adm-bold">{v.kitchenName || v.name}</div>
                              <div className="adm-muted adm-small">{v.email} — {v.city}</div>
                            </div>
                          </div>
                          <span className="adm-badge ord-pending">{v.verificationStatus}</span>
                        </div>

                        <div className="adm-verify-docs">
                          <span className="adm-muted adm-small">Documents:</span>
                          {v.verificationDocuments?.length > 0
                            ? v.verificationDocuments.map((doc, i) => (
                                <a key={doc} href={`http://localhost:3000${doc}`}
                                  target="_blank" rel="noreferrer" className="adm-doc-link">
                                  Doc {i + 1}
                                </a>
                              ))
                            : <span className="adm-muted adm-small">None uploaded.</span>
                          }
                        </div>

                        <div className="adm-verify-actions">
                          <textarea
                            className="adm-verify-note"
                            placeholder="Rejection note (optional)..."
                            rows={2}
                            value={noteMap[v._id] || ""}
                            onChange={(e) => setNoteMap((p) => ({ ...p, [v._id]: e.target.value }))}
                          />
                          <div className="adm-action-btns">
                            <button className="adm-btn approve"
                              disabled={actionLoading === v._id + "approved"}
                              onClick={() => handleVerification(v._id, "approved")}>
                              {actionLoading === v._id + "approved" ? "Approving..." : "✅ Approve"}
                            </button>
                            <button className="adm-btn reject"
                              disabled={actionLoading === v._id + "rejected"}
                              onClick={() => handleVerification(v._id, "rejected")}>
                              {actionLoading === v._id + "rejected" ? "Rejecting..." : "❌ Reject"}
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