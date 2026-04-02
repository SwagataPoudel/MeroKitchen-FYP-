import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../api/adminApi";

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => {
        setStats(res.data.stats);
        setOrdersByStatus(res.data.ordersByStatus);
        setRecentOrders(res.data.recentOrders);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      {/* ─── Stat Cards ─── */}
      <div className="stats-grid">
        <div className="stat-card">👤 Users<span>{stats.totalUsers}</span></div>
        <div className="stat-card">📦 Orders<span>{stats.totalOrders}</span></div>
        <div className="stat-card">🍱 Products<span>{stats.totalProducts}</span></div>
        <div className="stat-card">⭐ Reviews<span>{stats.totalReviews}</span></div>
        <div className="stat-card">💰 Revenue<span>Rs. {stats.totalRevenue}</span></div>
      </div>

      {/* ─── Orders by Status ─── */}
      <h2>Orders by Status</h2>
      <div className="stats-grid">
        {ordersByStatus.map((s) => (
          <div className="stat-card" key={s._id}>
            {s._id}<span>{s.count}</span>
          </div>
        ))}
      </div>

      {/* ─── Recent Orders ─── */}
      <h2>Recent Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Seller</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{order.customer?.name || "N/A"}</td>
              <td>{order.seller?.name || "N/A"}</td>
              <td>Rs. {order.totalAmount}</td>
              <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHome;