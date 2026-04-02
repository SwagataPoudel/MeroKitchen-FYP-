import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../api/adminApi";

const STATUS_OPTIONS = ["pending", "accepted", "preparing", "completed", "declined", "delivered"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? res.data.order : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="admin-loading">Loading orders...</p>;

  return (
    
    <div className="admin-page">
      <h2 className="admin-page-title">Manage Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Seller</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.customer?.name || "N/A"}</td>
              <td>{order.seller?.name || "N/A"}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="admin-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;