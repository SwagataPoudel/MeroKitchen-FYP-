import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerStats } from "../../api/orderApi";
import "../../css/SellerAnalysics.css";

const STATUS_COLORS = {
  pending:   { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  accepted:  { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  preparing: { bg: "#fefce8", color: "#a16207", border: "#fde68a" },
  completed: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  delivered: { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  declined:  { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

export default function SellerAnalytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    getSellerStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fmtRs = (n) => `Rs. ${Number(n).toLocaleString()}`;
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-NP", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div className="sa-page">
      {/* ── HERO ── */}
      <div className="sa-hero">
        <div className="sa-hero-inner">
          <div>
            <div className="sa-label">Seller Analytics</div>
            <h1 className="sa-title">Your <em>Dashboard</em></h1>
          </div>
          <button className="sa-listings-btn" onClick={() => navigate("/seller/dashboard")}>
           Manage Listings
          </button>
        </div>

        {/* Section nav */}
        <div className="sa-nav">
          {[
            { key: "overview",  label: "Overview" },
            { key: "revenue",   label: " Revenue" },
            { key: "orders",    label: " Orders" },
            { key: "reviews",   label: "Reviews" },
          ].map((s) => (
            <button
              key={s.key}
              className={`sa-nav-btn ${activeSection === s.key ? "active" : ""}`}
              onClick={() => setActiveSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sa-body">
        {loading ? (
          <p className="sa-loading"> Loading your analytics...</p>
        ) : !stats ? (
          <p className="sa-loading">Could not load data. Please refresh.</p>
        ) : (
          <>
            {/* ══ OVERVIEW ══ */}
            {activeSection === "overview" && (
              <>
                <div className="sa-stat-grid">
                  <div className="sa-stat-card">
                
                    <div>
                      <div className="sa-stat-label">Total Orders</div>
                      <div className="sa-stat-val">{stats.totalOrders}</div>
                      <div className="sa-stat-sub">all time</div>
                    </div>
                  </div>
                  <div className="sa-stat-card">
                    
                    <div>
                      <div className="sa-stat-label">Unique Customers</div>
                      <div className="sa-stat-val">{stats.totalCustomers}</div>
                      <div className="sa-stat-sub">who ordered from you</div>
                    </div>
                  </div>
                  <div className="sa-stat-card">
                    
                    <div>
                      <div className="sa-stat-label">Total Revenue</div>
                      <div className="sa-stat-val" style={{ color: "#16a34a" }}>{fmtRs(stats.totalRevenue)}</div>
                      <div className="sa-stat-sub">completed orders</div>
                    </div>
                  </div>
                  <div className="sa-stat-card">
                    
                    <div>
                      <div className="sa-stat-label">Pending Revenue</div>
                      <div className="sa-stat-val" style={{ color: "#a16207" }}>{fmtRs(stats.pendingRevenue)}</div>
                      <div className="sa-stat-sub">active orders</div>
                    </div>
                  </div>
                  <div className="sa-stat-card">
                    
                    <div>
                      <div className="sa-stat-label">Avg Rating</div>
                      <div className="sa-stat-val" style={{ color: "#c8753a" }}>
                        {stats.avgRating > 0 ? `${stats.avgRating} / 5` : "—"}
                      </div>
                      <div className="sa-stat-sub">{stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div className="sa-stat-card">
                    
                    <div>
                      <div className="sa-stat-label">Completed Orders</div>
                      <div className="sa-stat-val" style={{ color: "#16a34a" }}>
                        {(stats.statusBreakdown?.completed || 0) + (stats.statusBreakdown?.delivered || 0)}
                      </div>
                      <div className="sa-stat-sub">delivered + completed</div>
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div className="sa-quick-links">
                  <div className="sa-quick-card" onClick={() => navigate("/seller/orders")}>
                    
                    <div>
                      <div className="sa-quick-title">Manage Orders</div>
                      <div className="sa-quick-sub">View & update order statuses</div>
                    </div>
                    <span className="sa-quick-arrow">→</span>
                  </div>
                  <div className="sa-quick-card" onClick={() => navigate("/seller/dashboard")}>
                 
                    <div>
                      <div className="sa-quick-title">My Listings</div>
                      <div className="sa-quick-sub">Add, edit or remove dishes</div>
                    </div>
                    <span className="sa-quick-arrow">→</span>
                  </div>
                  <div className="sa-quick-card" onClick={() => navigate("/profile")}>
                    
                    <div>
                      <div className="sa-quick-title">My Profile</div>
                      <div className="sa-quick-sub">Update kitchen details</div>
                    </div>
                    <span className="sa-quick-arrow">→</span>
                  </div>
                </div>
              </>
            )}

            {/* ══ REVENUE ══ */}
            {activeSection === "revenue" && (
              <>
                <div className="sa-two-col">
                  {/* Monthly chart */}
                  <div className="sa-panel">
                    <div className="sa-panel-title">Monthly Revenue — Last 6 Months</div>
                    <div className="sa-bar-chart">
                      {stats.monthlyRevenue.map((m) => {
                        const maxRev = Math.max(...stats.monthlyRevenue.map((x) => x.revenue), 1);
                        const pct = (m.revenue / maxRev) * 100;
                        return (
                          <div key={m.label} className="sa-bar-col">
                            <div className="sa-bar-val">
                              {m.revenue > 0 ? fmtRs(m.revenue) : "—"}
                            </div>
                            <div className="sa-bar-track">
                              <div className="sa-bar-fill" style={{ height: `${Math.max(pct, 3)}%` }} />
                            </div>
                            <div className="sa-bar-label">{m.label}</div>
                            <div className="sa-bar-orders">{m.orders} orders</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Revenue summary */}
                  <div className="sa-panel">
                    <div className="sa-panel-title">Revenue Summary</div>
                    <div className="sa-rev-summary">
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Total Earned</span>
                        <span className="sa-rev-val green">{fmtRs(stats.totalRevenue)}</span>
                      </div>
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Pending (active orders)</span>
                        <span className="sa-rev-val amber">{fmtRs(stats.pendingRevenue)}</span>
                      </div>
                      <div className="sa-rev-divider" />
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">This Month</span>
                        <span className="sa-rev-val spice">
                          {fmtRs(stats.monthlyRevenue?.[stats.monthlyRevenue.length - 1]?.revenue || 0)}
                        </span>
                      </div>
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Last Month</span>
                        <span className="sa-rev-val">
                          {fmtRs(stats.monthlyRevenue?.[stats.monthlyRevenue.length - 2]?.revenue || 0)}
                        </span>
                      </div>
                      <div className="sa-rev-divider" />
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Avg per Order</span>
                        <span className="sa-rev-val">
                          {stats.totalOrders > 0
                            ? fmtRs(Math.round(stats.totalRevenue / stats.totalOrders))
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══ ORDERS ══ */}
            {activeSection === "orders" && (
              <>
                <div className="sa-two-col">
                  {/* Status breakdown */}
                  <div className="sa-panel">
                    <div className="sa-panel-title">Orders by Status</div>
                    <div className="sa-status-list">
                      {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                        <div key={status} className="sa-status-row">
                          <span
                            className="sa-status-pill"
                            style={{
                              background: STATUS_COLORS[status]?.bg,
                              color: STATUS_COLORS[status]?.color,
                              border: `1px solid ${STATUS_COLORS[status]?.border}`,
                            }}
                          >
                            {status}
                          </span>
                          <div className="sa-status-bar-wrap">
                            <div
                              className="sa-status-bar"
                              style={{
                                width: stats.totalOrders > 0
                                  ? `${(count / stats.totalOrders) * 100}%`
                                  : "0%",
                                background: STATUS_COLORS[status]?.color,
                              }}
                            />
                          </div>
                          <span className="sa-status-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order stats */}
                  <div className="sa-panel">
                    <div className="sa-panel-title">Order Insights</div>
                    <div className="sa-rev-summary">
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Total Orders</span>
                        <span className="sa-rev-val">{stats.totalOrders}</span>
                      </div>
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Completed + Delivered</span>
                        <span className="sa-rev-val green">
                          {(stats.statusBreakdown?.completed || 0) + (stats.statusBreakdown?.delivered || 0)}
                        </span>
                      </div>
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Declined</span>
                        <span className="sa-rev-val" style={{ color: "#dc2626" }}>
                          {stats.statusBreakdown?.declined || 0}
                        </span>
                      </div>
                      <div className="sa-rev-divider" />
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Unique Customers</span>
                        <span className="sa-rev-val">{stats.totalCustomers}</span>
                      </div>
                      <div className="sa-rev-row">
                        <span className="sa-rev-label">Repeat Rate</span>
                        <span className="sa-rev-val spice">
                          {stats.totalOrders > 0 && stats.totalCustomers > 0
                            ? `${((stats.totalOrders / stats.totalCustomers)).toFixed(1)}x avg`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent orders table */}
                <div className="sa-panel" style={{ marginTop: "24px" }}>
                  <div className="sa-panel-title">Recent Orders</div>
                  {stats.recentOrders.length === 0 ? (
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", padding: "16px 0" }}>No orders yet.</p>
                  ) : (
                    <div className="sa-orders-table">
                      <div className="sa-ot-header">
                        <span>Customer</span>
                        <span>Date</span>
                        <span>Items</span>
                        <span>Amount</span>
                        <span>Payment</span>
                        <span>Status</span>
                      </div>
                      {stats.recentOrders.map((o) => (
                        <div key={o._id} className="sa-ot-row">
                          <span className="sa-ot-name">{o.customerName}</span>
                          <span className="sa-ot-muted">{fmtDate(o.createdAt)}</span>
                          <span className="sa-ot-muted">{o.itemCount} item{o.itemCount !== 1 ? "s" : ""}</span>
                          <span className="sa-ot-amount">{fmtRs(o.totalAmount)}</span>
                          <span>
                            <span className={`sa-pay-badge ${o.paymentStatus}`}>
                              {o.paymentStatus}
                            </span>
                          </span>
                          <span>
                            <span
                              className="sa-status-pill"
                              style={{
                                background: STATUS_COLORS[o.status]?.bg,
                                color: STATUS_COLORS[o.status]?.color,
                                border: `1px solid ${STATUS_COLORS[o.status]?.border}`,
                              }}
                            >
                              {o.status}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="sa-view-all-btn" onClick={() => navigate("/seller/orders")}>
                    View All Orders →
                  </button>
                </div>
              </>
            )}

            {/* ══ REVIEWS ══ */}
            {activeSection === "reviews" && (
              <>
                <div className="sa-review-hero">
                  <div className="sa-big-rating">
                    {stats.avgRating > 0 ? stats.avgRating : "—"}
                  </div>
                  <div>
                    <div className="sa-big-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ color: s <= Math.round(stats.avgRating || 0) ? "#e8a055" : "#d6c4a8" }}>★</span>
                      ))}
                    </div>
                    <div className="sa-review-count">
                      {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""} from customers
                    </div>
                  </div>
                </div>

                {!stats.reviews?.length ? (
                  <div className="sa-empty">
                    <div style={{ fontSize: "3rem" }}>⭐</div>
                    <p>No reviews yet — keep cooking great food!</p>
                  </div>
                ) : (
                  <div className="sa-reviews-list">
                    {stats.reviews.map((r) => (
                      <div key={r._id} className="sa-review-card">
                        <div className="sa-review-top">
                          <div className="sa-review-avatar">
                            {(r.customer?.name || "C").charAt(0).toUpperCase()}
                          </div>
                          <div className="sa-review-meta">
                            <div className="sa-review-name">{r.customer?.name || "Customer"}</div>
                            <div className="sa-review-dish">on {r.product?.name}</div>
                            <div className="sa-review-date">{fmtDate(r.createdAt)}</div>
                          </div>
                          <div className="sa-review-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} style={{ color: s <= r.rating ? "#e8a055" : "#d6c4a8" }}>★</span>
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="sa-review-comment">"{r.comment}"</p>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}