import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import "../../css/CustomerHome.css";
import banner1 from "../../assets/customerbanner1.jpg";
import banner2 from "../../assets/customerbanner2.jpg";
import banner3 from "../../assets/customerbanner3.jpg";
import banner4 from "../../assets/customerbanner4.1.jpg";

const QUICK_CATEGORIES = [
  { label: "Breakfast", emoji: "🌅", value: "breakfast" },
  { label: "Lunch", emoji: "🍱", value: "lunch" },
  { label: "Dinner", emoji: "🍛", value: "dinner" },
  { label: "Snacks", emoji: "🥟", value: "snacks" },
  { label: "Desserts", emoji: "🍮", value: "desserts" },
  { label: "Drinks", emoji: "🍵", value: "drinks" },
];

const GREETINGS = ["Namaste", "Khana khaye?", "Hungry?", "Welcome back"];

export default function CustomerHome() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting] = useState(
    GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
  );
  const userName = localStorage.getItem("userName") || "there";

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getAllProducts({ availability: true });
        const all = res.data.products || [];
        setFeaturedProducts(all.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="ch-page">

      <section className="ch-hero">

        <div className="ch-slider">
          <div className="ch-slide" style={{ backgroundImage: `url(${banner1})` }} />
          <div className="ch-slide" style={{ backgroundImage: `url(${banner2})` }} />
          <div className="ch-slide" style={{ backgroundImage: `url(${banner3})` }} />
          <div className="ch-slide" style={{ backgroundImage: `url(${banner4})` }} />
        </div>
        <div className="ch-hero-overlay" />

        <div className="ch-hero-content">
          <div className="ch-greeting-badge">{greeting} 🙏</div>
          <h1 className="ch-hero-title">
            What are you <em>craving</em> today?
          </h1>
          <p className="ch-hero-sub">
            Fresh, homemade Nepali meals crafted by local home cooks — ready to
            order and delivered to your door.
          </p>
          <div className="ch-hero-actions">
            <button
              className="ch-btn-primary"
              style={{ backgroundColor: "#c8753a" }}
              onClick={() => navigate("/products")}
            >
              Browse All Dishes →
            </button>
            <button
              className="ch-btn-ghost"
              onClick={() => navigate("/orders")}
            >
              My Orders
            </button>
          </div>

          </div>
      </section>

      <section className="ch-section">
        <div className="ch-section-inner">
          <div className="ch-section-header">
            <div className="ch-label">Browse by Category</div>
             <h2 className="ch-section-title" style={{  color: "#c8753a" }}>
              What's on your <em style={{  color: "#c8753a" }}>mind?</em>
            </h2>
          </div>
          <div className="ch-categories">
            {QUICK_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className="ch-cat-card"
                onClick={() =>
                  navigate(`/products?category=${cat.value}`)
                }
              >
                <span className="ch-cat-emoji">{cat.emoji}</span>
                <span className="ch-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="ch-section ch-section-alt">
        <div className="ch-section-inner">
          <div className="ch-section-header">
            <div className="ch-label">Available Now</div>
            <h2 className="ch-section-title">
              Today's <em>fresh picks</em>
            </h2>
          </div>

          {loading ? (
            <p className="ch-loading">✨ Loading fresh dishes...</p>
          ) : featuredProducts.length === 0 ? (
            <p className="ch-loading">No dishes available right now.</p>
          ) : (
            <div className="ch-products-grid">
              {featuredProducts.map((p) => (
                <div
                  key={p._id}
                  className="ch-product-card"
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  {p.photos?.[0] ? (
                    <img
                      src={`http://localhost:3000${p.photos[0]}`}
                      alt={p.name}
                      className="ch-product-img"
                    />
                  ) : (
                    <div className="ch-product-img-placeholder">🍲</div>
                  )}
                  <div className="ch-product-body">
                    <div className="ch-product-cat">{p.category}</div>
                    <div className="ch-product-name">{p.name}</div>
                    <div
                      className="ch-product-seller"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/users/${p.seller?._id}`);
                      }}
                    >
                      by{" "}
                      <span className="ch-seller-link">{p.seller?.name}</span>
                    </div>
                    <div className="ch-product-footer">
                      <span className="ch-price">Rs. {p.price}</span>
                      <span className="ch-prep">⏱ {p.preparationTime} mins</span>
                    </div>
                    {p.ratings?.count > 0 && (
                      <div className="ch-rating">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={
                              s <= Math.round(p.ratings.average)
                                ? "ch-star filled"
                                : "ch-star"
                            }
                          >
                            ★
                          </span>
                        ))}
                        <span className="ch-rating-text">
                          {p.ratings.average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="ch-see-all">
            <button
              className="ch-btn-primary"
              onClick={() => navigate("/products")}
            >
              See All Dishes →
            </button>
          </div>
        </div>
      </section>

      <section className="ch-section">
        <div className="ch-section-inner">
          <div className="ch-section-header">
            <div className="ch-label">Your Account</div>
          </div>
          <div className="ch-actions-grid">
            <div
              className="ch-action-card"
              onClick={() => navigate("/orders")}
            >
              <div className="ch-action-icon">📦</div>
              <div className="ch-action-body">
                <h3>My Orders</h3>
                <p>Track your current and past orders</p>
              </div>
              <span className="ch-action-arrow">→</span>
            </div>
            <div className="ch-action-card" onClick={() => navigate("/cart")}>
              <div className="ch-action-icon">🛒</div>
              <div className="ch-action-body">
                <h3>My Cart</h3>
                <p>Review items saved in your cart</p>
              </div>
              <span className="ch-action-arrow">→</span>
            </div>
            <div
              className="ch-action-card"
              onClick={() => navigate("/profile")}
            >
              <div className="ch-action-icon">👤</div>
              <div className="ch-action-body">
                <h3>My Profile</h3>
                <p>Update your delivery address and details</p>
              </div>
              <span className="ch-action-arrow">→</span>
            </div>
            <div
              className="ch-action-card"
              onClick={() => navigate("/products?nearby=true")}
            >
              <div className="ch-action-icon">📍</div>
              <div className="ch-action-body">
                <h3>Near Me</h3>
                <p>Find home cooks closest to you</p>
              </div>
              <span className="ch-action-arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ch-trust-strip">
        <div className="ch-trust-inner">
          <div className="ch-trust-item">
            <span className="ch-trust-icon">🏠</span>
            <span>100% Home-Cooked</span>
          </div>
          <div className="ch-trust-divider" />
          <div className="ch-trust-item">
            <span className="ch-trust-icon">🌿</span>
            <span>No Preservatives</span>
          </div>
          <div className="ch-trust-divider" />
          <div className="ch-trust-item">
            <span className="ch-trust-icon">⚡</span>
            <span>Fast Delivery</span>
          </div>
          <div className="ch-trust-divider" />
          <div className="ch-trust-item">
            <span className="ch-trust-icon">✅</span>
            <span>Hygiene Certified</span>
          </div>
        </div>
      </section>
    </div>
  );
}