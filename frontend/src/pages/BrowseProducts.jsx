import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import "../css/BrowseProducts.css";

const CATEGORIES = [
  "all",
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "desserts",
  "drinks",
];

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    availability: "",
  });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category && filters.category !== "all")
        params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.availability !== "")
        params.availability = filters.availability;
      const res = await getAllProducts(params);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <>
      <div style={{ paddingTop: 0 }}>
        <div className="browse-hero">
          <div className="section-label">Fresh & Homemade</div>
          <h1>
            Discover <em>Today's</em> Menu
          </h1>
          <p>Real meals crafted with love by home cooks across Kathmandu.</p>
        </div>

        <div className="browse-body">
          {/* Filter Bar */}
          <div className="filter-bar">
            <label>Category</label>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filter-tab ${filters.category === c ? "active" : ""}`}
                onClick={() => setFilters({ ...filters, category: c })}
              >
                {c}
              </button>
            ))}
            <div className="divider" />
            <label>Price</label>
            <input
              className="price-input"
              type="number"
              placeholder="Min Rs."
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
            <input
              className="price-input"
              type="number"
              placeholder="Max Rs."
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
            <div className="divider" />
            <select
              className="avail-select"
              onChange={(e) =>
                setFilters({ ...filters, availability: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <p className="loading-text">✨ Loading delicious food...</p>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "4rem" }}>🍽️</div>
              <p>No dishes found. Try different filters.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="product-card"
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  {p.photos?.[0] ? (
                    <img
                      src={`http://localhost:3000${p.photos[0]}`}
                      alt={p.name}
                      className="product-img"
                    />
                  ) : (
                    <div className="product-img-placeholder">🍲</div>
                  )}
                  <div className="product-body">
                    <div className="product-cat">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-seller">by {p.seller?.name}</div>
                    <div className="product-desc">
                      {p.description.slice(0, 80)}...
                    </div>
                    <div className="product-footer">
                      <span className="product-price">Rs. {p.price}</span>
                      <span
                        className="avail-badge"
                        style={{
                          background: p.availability ? "#4a9c5d" : "#c0392b",
                        }}
                      >
                        {p.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="prep-time">
                      ⏱ {p.preparationTime} mins prep
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
