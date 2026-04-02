import { useEffect, useState } from "react";
import { fetchAllProducts, deleteProduct, toggleProductAvailability } from "../../api/adminApi";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleProductAvailability(id);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data.product : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="admin-loading">Loading products...</p>;

  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Manage Products</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Seller</th>
            <th>Category</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.seller?.name || "N/A"}</td>
              <td>{product.category}</td>
              <td>Rs. {product.price}</td>
              <td>
                <button
                  className={product.availability ? "admin-btn-success" : "admin-btn-warning"}
                  onClick={() => handleToggle(product._id)}
                >
                  {product.availability ? "Yes" : "No"}
                </button>
              </td>
              <td>
                <button
                  className="admin-btn-danger"
                  onClick={() => handleDelete(product._id)}
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

export default ManageProducts;