import { useState, useEffect } from "react";
import "../css/Landing.css";
import heroBg from "../assets/landingbanner.jpg";
import hero1 from "../assets/hero1.jpg";
import img1 from "../assets/img1.jpg";
import ingredient from "../assets/ingredients.jpg";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    id: 1,
    emoji: "🍛",
    name: "Dal Bhat Set",
    desc: "Classic Nepali comfort — steamed rice, lentil soup, seasonal veggies & pickle.",
    price: "Rs. 280",
    tag: "Bestseller",
    tagColor: "#c8753a",
  },
  {
    id: 2,
    emoji: "🥟",
    name: "Momo Basket",
    desc: "Juicy steamed dumplings with homemade tomato chutney. 10 pcs per order.",
    price: "Rs. 180",
    tag: "🔥 Hot",
    tagColor: "#d94f4f",
  },
  {
    id: 3,
    emoji: "🥘",
    name: "Thukpa Bowl",
    desc: "Hearty Tibetan noodle soup brimming with fresh vegetables and aromatic broth.",
    price: "Rs. 220",
    tag: "New",
    tagColor: "#4a9c5d",
  },
  {
    id: 4,
    emoji: "🍱",
    name: "Newari Khaja Set",
    desc: "Traditional Newari snack platter with chiura, sapu mhichā, and more.",
    price: "Rs. 350",
    tag: "Special",
    tagColor: "#7b5ea7",
  },
  {
    id: 5,
    emoji: "🫕",
    name: "Gundruk Soup",
    desc: "Fermented leafy greens slow-cooked into a tangy, nutritious winter broth.",
    price: "Rs. 160",
    tag: null,
  },
  {
    id: 6,
    emoji: "🍰",
    name: "Sel Roti & Chia Pudding",
    desc: "Crispy homemade sel roti paired with a creamy, lightly sweetened chia pudding.",
    price: "Rs. 140",
    tag: "Dessert",
    tagColor: "#c87dba",
  },
];

const reviews = [
  {
    id: 1,
    name: "Sita Tamang",
    loc: "Baneshwor",
    stars: 5,
    text: "Dal Bhat tastes just like what my aamai used to cook. I order every single day now!",
  },
  {
    id: 2,
    name: "Rohan Shrestha",
    loc: "Patan",
    stars: 5,
    text: "Momos are unbelievably good — soft, packed with flavour. Delivery was super fast too.",
  },
  {
    id: 3,
    name: "Priya Adhikari",
    loc: "Balaju",
    stars: 5,
    text: "Finally a food service that cares about ingredients. The thukpa warmed my soul on a rainy day.",
  },
];

const steps = [
  {
    n: "01",
    title: "Browse the Menu",
    desc: "Check out our daily freshly prepared dishes made with seasonal ingredients.",
    emoji: "📋",
  },
  {
    n: "02",
    title: "Place Your Order",
    desc: "Order online or via WhatsApp — no fuss, just simple steps.",
    emoji: "📱",
  },
  {
    n: "03",
    title: "We Cook Fresh",
    desc: "Every meal is prepared to order in our home kitchen by Mero aunties.",
    emoji: "👩‍🍳",
  },
  {
    n: "04",
    title: "Delivered Hot",
    desc: "Your food arrives warm and ready to eat, right at your doorstep.",
    emoji: "🛵",
  },
];

// ─── Home Page ────────────────────────────────────────────────────────────────
const Landing = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filters = ["All", "Rice & Curry", "Snacks", "Soups", "Dessert"];

  return (
    <>
      <main>
        {/* ── HERO ─────────────────────────────── */}
        <section
          className="hero"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        >
          <div className="hero-content">
            <div className="hero-badge">🏠 Home-Cooked · Delivered Fresh</div>
            <h1>
              Real Food,
              <br />
              Made with <em>Real Love</em>
            </h1>
            <p className="hero-desc">
              Authentic Nepali home cooking crafted daily from traditional
              recipes. No preservatives, no shortcuts — just wholesome meals
              delivered to your door.
            </p>
            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() =>
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Today's Menu
              </button>
              <button className="btn-ghost" onClick={() => navigate("/about")}>
                Watch Our Story
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-plate">
              <img src={hero1} alt="Hero dish" />
            </div>
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────── */}
        <section id="about" className="about-section">
          <div className="about-visual">
            <div className="about-card">
              <div className="about-card-image">
                <img src={ingredient} alt="Local Ingredients" />
              </div>
              <h3>Local Ingredients</h3>
              <p>
                Sourced from trusted local farmers and markets every morning.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-image">
                <img src={img1} alt="Family Tradition" />
              </div>
              <h3>Family Tradition</h3>
              <p>
                Three-generation recipes passed down with care and precision.
              </p>
            </div>
          </div>

          <div className="about-text">
            <div className="section-label">Our Story</div>
            <h2 className="section-title">Cooking the way Aamai did</h2>
            <p className="section-sub">
              Mero Kitchen began in a small home in Kathmandu — a mother's wish
              to share her recipes with the whole neighbourhood. Today we bring
              that same warmth to hundreds of tables across the city.
            </p>
            <ul className="about-list">
              <li>No artificial preservatives or shortcuts</li>
              <li>Freshly prepared daily, never batch-cooked</li>
              <li>Eco-friendly, compostable packaging</li>
              <li>Hygiene-certified home kitchen</li>
            </ul>
            <button
              className="btn-primary"
              style={{ marginTop: "28px" }}
              onClick={() => navigate("/about")}
            >
              Read Our Full Story →
            </button>
          </div>
        </section>

        {/* ── MENU ─────────────────────────────── */}
        <section id="menu" className="menu-section">
          <div className="menu-header">
            <div>
              <div className="section-label">Today's Specials</div>
              <h2 className="section-title">
                What's <em>cooking</em> today
              </h2>
            </div>
            <div className="filter-tabs">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${activeFilter === f ? "active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-grid">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-card">
                {item.tag && (
                  <div
                    className="menu-card-tag"
                    style={{ background: item.tagColor }}
                  >
                    {item.tag}
                  </div>
                )}
                <span className="menu-emoji">{item.emoji}</span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className="menu-card-footer">
                  <span className="menu-price">{item.price}</span>
                  <button className="add-btn" title="Add to cart">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button className="btn-primary" onClick={() => navigate("/menu")}>
              View Full Menu →
            </button>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────── */}
        <section id="how" className="how-section">
          <div className="steps-header">
            <div className="section-label">Simple Process</div>
            <h2 className="section-title">
              From our <em>kitchen</em> to your table
            </h2>
            <p className="section-sub">
              Ordering homemade food has never been easier. Just four simple
              steps.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-icon">
                  {s.emoji}
                  <div className="step-num">{s.n}</div>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── REVIEWS ──────────────────────────── */}
        <section id="reviews" className="reviews-section">
          <div className="reviews-header">
            <div className="section-label">Love from Customers</div>
            <h2 className="section-title">
              What our <em>families</em> say
            </h2>
            <p className="section-sub">
              Over 500 happy households trust Mero Kitchen for their daily
              meals.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="stars">{"★".repeat(r.stars)}</div>
                <p>"{r.text}"</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">{r.name[0]}</div>
                  <div>
                    <div className="reviewer-name">{r.name}</div>
                    <div className="reviewer-loc">📍 {r.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────── */}
        <section className="cta-section">
          <div className="section-label">Ready to Eat?</div>
          <h2 className="section-title">
            Order your first homemade meal today
          </h2>
          <p className="section-sub">
            Join hundreds of families enjoying fresh, authentic Nepali food
            every day.
          </p>
          <div className="cta-btns">
            <button className="btn-accent" onClick={() => navigate("/menu")}>
              Order Now 🍽️
            </button>
            <button
              className="btn-outline-light"
              onClick={() =>
                window.open("https://wa.me/977XXXXXXXXX", "_blank")
              }
            >
              Chat on WhatsApp
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Landing;
