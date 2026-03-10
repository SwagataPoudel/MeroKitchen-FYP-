import { useEffect, useState } from "react";
import { getMyProducts, createProduct, deleteProduct } from "../api/productApi";
import "../css/SellerDashboard.css";

const CATEGORIES = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "desserts",
  "drinks",
];
const emptyForm = {
  name: "",
  description: "",
  price: "",
  ingredients: "",
  category: "snacks",
  preparationTime: "",
  availability: true,
};

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [photos, setPhotos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const fetchMyProducts = async () => {
    try {
      const res = await getMyProducts();
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      photos.forEach((file) => data.append("photos", file));
      await createProduct(data);
      setMessage({ text: "Product listed successfully!", type: "success" });
      setForm(emptyForm);
      setPhotos([]);
      setShowForm(false);
      fetchMyProducts();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error creating product",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this listing?")) return;
    try {
      await deleteProduct(id);
      fetchMyProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      

      <div>
        <div className="dash-hero">
          <div className="dash-hero-inner">
            <div>
              <div className="dash-label">Seller Dashboard</div>
              <h1 className="dash-title">
                My <em>Listings</em>
              </h1>
            </div>
            {showForm ? (
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                ✕ Cancel
              </button>
            ) : (
              <button
                className="add-listing-btn"
                onClick={() => setShowForm(true)}
              >
                + New Listing
              </button>
            )}
          </div>
        </div>

        <div className="dash-body">
          {message.text && (
            <div
              className={`msg-banner ${message.type === "success" ? "msg-success" : "msg-error"}`}
            >
              {message.text}
            </div>
          )}

          {/* Add Form */}
          {showForm && (
            <div className="form-panel">
              <h3>New Food Listing</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Dish Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Chicken Momo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe your dish..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (Rs.)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="e.g. 250"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prep Time (mins)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="e.g. 20"
                    value={form.preparationTime}
                    onChange={(e) =>
                      setForm({ ...form, preparationTime: e.target.value })
                    }
                  />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">
                    Ingredients (comma separated)
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. chicken, flour, garlic, ginger"
                    value={form.ingredients}
                    onChange={(e) =>
                      setForm({ ...form, ingredients: e.target.value })
                    }
                  />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Photos (up to 5)</label>
                  <input
                    className="form-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotos(Array.from(e.target.files))}
                  />
                </div>
              </div>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Publishing..." : "Publish Listing 🍽️"}
              </button>
            </div>
          )}

          {/* Listings */}
          <div className="section-heading">
            Your <em>Listings</em> ({products.length})
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3.5rem" }}>🍳</div>
              <p>No listings yet — add your first dish!</p>
            </div>
          ) : (
            products.map((p) => (
              <div key={p._id} className="listing-card">
                {p.photos?.[0] ? (
                  <img
                    src={`http://localhost:3000${p.photos[0]}`}
                    alt={p.name}
                    className="listing-thumb"
                  />
                ) : (
                  <div className="listing-thumb-placeholder">🍲</div>
                )}
                <div className="listing-info">
                  <div className="listing-name">{p.name}</div>
                  <div className="listing-meta">
                    {p.category} · Rs. {p.price} · ⏱ {p.preparationTime} mins
                  </div>
                  <div className="listing-ingredients">
                    {p.ingredients.join(" · ")}
                  </div>
                </div>
                <div className="listing-actions">
                  <span
                    className="avail-badge"
                    style={{
                      background: p.availability ? "#4a9c5d" : "#c0392b",
                    }}
                  >
                    {p.availability ? "Available" : "Unavailable"}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
