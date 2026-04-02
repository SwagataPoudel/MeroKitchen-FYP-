import { useEffect, useState } from "react";
import { fetchAllReviews, deleteReview } from "../../api/adminApi";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews()
      .then((res) => setReviews(res.data.reviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="admin-loading">Loading reviews...</p>;

  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Manage Reviews</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review.customer?.name || "N/A"}</td>
              <td>{review.product?.name || "N/A"}</td>
              <td>{"⭐".repeat(review.rating)}</td>
              <td>{review.comment || "—"}</td>
              <td>
                <button
                  className="admin-btn-danger"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReviews;