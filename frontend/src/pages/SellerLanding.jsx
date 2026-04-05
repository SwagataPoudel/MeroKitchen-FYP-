import { useNavigate } from "react-router-dom";
import "../css/SellerLanding.css";
import banner1 from "../assets/sellerbanner1.jpg";
import banner2 from "../assets/sellerbanner2.jpg";
import banner3 from "../assets/sellerbanner3.jpg";
import banner4 from "../assets/sellerbanner4.jpg";

const steps = [
  {
    n: "01",
    emoji: "📝",
    title: "Create Your Account",
    desc: "Sign up as a seller in minutes. Fill in your kitchen name, cuisine types, and a short description.",
  },
  {
    n: "02",
    emoji: "🏅",
    title: "Get Verified",
    desc: "Submit your documents for our quick verification process and earn the Verified Homemade badge.",
  },
  {
    n: "03",
    emoji: "🍱",
    title: "List Your Dishes",
    desc: "Add your menu items with photos, prices, and prep times. Your kitchen goes live instantly.",
  },
  {
    n: "04",
    emoji: "💰",
    title: "Start Earning",
    desc: "Customers across Kathmandu discover your food, place orders, and you earn on every meal.",
  },
];

const perks = [
  {
    emoji: "🏠",
    title: "Cook From Home",
    desc: "No restaurant needed. Your home kitchen is your business — cook on your own schedule.",
  },
  {
    emoji: "📱",
    title: "Easy Dashboard",
    desc: "Manage listings, track orders, and update availability all from one simple dashboard.",
  },
  {
    emoji: "🌍",
    title: "Reach More Customers",
    desc: "Tap into hundreds of hungry customers actively looking for homemade food in Kathmandu.",
  },
  {
    emoji: "💬",
    title: "Direct Support",
    desc: "Our team is here to help you grow — from setting up your profile to handling issues.",
  },
  {
    emoji: "⭐",
    title: "Build Your Reputation",
    desc: "Collect reviews and ratings that help you stand out and attract loyal, repeat customers.",
  },
  {
    emoji: "🔒",
    title: "Safe & Trusted",
    desc: "Verified sellers earn a badge that builds customer trust and boosts your visibility.",
  },
];

const testimonials = [
  {
    name: "Anita Maharjan",
    kitchen: "Anita's Newari Kitchen",
    loc: "Patan",
    text: "I started with just 3 dishes. Within a month I had 50+ regular customers. Mero Kitchen changed my life.",
    initial: "A",
  },
  {
    name: "Ramesh Tamang",
    kitchen: "Tamang Thali House",
    loc: "Baneshwor",
    text: "I cook traditional Tamang meals from my home. The platform is so easy to use — even my aamai uses it!",
    initial: "R",
  },
  {
    name: "Sunita Shrestha",
    kitchen: "Sunita's Sel Roti Corner",
    loc: "Bhaktapur",
    text: "My sel roti and chia pudding became viral on the platform. Now I earn more than my office job!",
    initial: "S",
  },
];

const stats = [
  { num: "500+", label: "Active Customers" },
  { num: "50+", label: "Home Sellers" },
  { num: "4.8★", label: "Avg Seller Rating" },
  { num: "Rs.0", label: "Joining Fee" },
];

const SellerLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="sl-page">

      {/* ── HERO ─────────────────────────────── */}
      <section className="sl-hero">

        {/* CSS-only background slider */}
        <div className="sl-slider">
          <div className="sl-slide" style={{ backgroundImage: `url(${banner1})` }} />
          <div className="sl-slide" style={{ backgroundImage: `url(${banner2})` }} />
          <div className="sl-slide" style={{ backgroundImage: `url(${banner3})` }} />
          <div className="sl-slide" style={{ backgroundImage: `url(${banner4})` }} />
        </div>
        <div className="sl-hero-overlay" />

        <div className="sl-hero-content">
          <div className="sl-hero-badge">🍳 For Home Cooks & Kitchen Entrepreneurs</div>
          <h1>
            Turn Your <em>Home Kitchen</em><br />Into a Business
          </h1>
          <p className="sl-hero-desc">
            Join Mero Kitchen's growing community of home cooks across Kathmandu.
            Share your recipes, reach hundreds of customers, and earn doing what you love — cooking.
          </p>
          <div className="sl-hero-actions">
            <button className="sl-btn-primary" onClick={() => navigate("/auth")}>
              Start Selling Today 
            </button>
            <button className="sl-btn-ghost" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </button>
          </div>

          <div className="sl-hero-stats">
            {stats.map((s) => (
              <div className="sl-stat" key={s.label}>
                <div className="sl-stat-num">{s.num}</div>
                <div className="sl-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── WHY SELL ─────────────────────────── */}
      <section className="sl-perks-section">
        <div className="sl-section-label">Why Choose Us</div>
        <h2 className="sl-section-title">Everything you need to <em>grow</em></h2>
        <p className="sl-section-sub" style={{ color: "#fff8ef" }}>
          We handle the platform so you can focus on what matters — cooking amazing food.
        </p>
        <div className="sl-perks-grid">
          {perks.map((p) => (
            <div className="sl-perk-card" key={p.title}>
              <div className="sl-perk-emoji">{p.emoji}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section className="sl-steps-section" id="how-it-works">
        <div className="sl-section-label">Simple Process</div>
        <h2 className="sl-section-title">From sign-up to <em>first order</em></h2>
        <p className="sl-section-sub">Get your kitchen live in four easy steps.</p>
        <div className="sl-steps-grid">
          {steps.map((s, i) => (
            <div className="sl-step-card" key={s.n}>
              <div className="sl-step-icon">
                {s.emoji}
                <div className="sl-step-num">{s.n}</div>
              </div>
              {i < steps.length - 1 && <div className="sl-step-arrow">→</div>}
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section className="sl-testimonials-section">
        <div className="sl-section-label">Seller Stories</div>
        <h2 className="sl-section-title" style={{ color: '#ce742a' }}>Hear from our <em style={{ color: '#ce742a' }}> sellers</em></h2>
        <p className="sl-section-sub" style={{ color: '#ce742a' }}>Real home cooks, real success stories from across Kathmandu.</p>
        <div className="sl-testimonials-grid">
          {testimonials.map((t) => (
            <div className="sl-testimonial-card" key={t.name}>
              <div className="sl-stars">★★★★★</div>
              <p>"{t.text}"</p>
              <div className="sl-reviewer">
                <div className="sl-reviewer-avatar">{t.initial}</div>
                <div>
                  <div className="sl-reviewer-name">{t.name}</div>
                  <div className="sl-reviewer-kitchen">🍳 {t.kitchen} · 📍 {t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="sl-cta-section">
        <div className="sl-cta-inner">
          <div className="sl-section-label" style={{ color: "#fff8ef" }}>Ready to Cook?</div>
          <h2 className="sl-section-title" style={{ color: "#fff8ef" }}>
            Your kitchen deserves<br />to be <em style={{ color: "#fff8ef" }}>discovered</em>
          </h2>
          <p className="sl-section-sub" style={{ color: "rgba(255,255,255,0.65)" }}>
            Join 50+ home sellers already earning on Mero Kitchen. It's free to join — no commission surprises.
          </p>
          <div className="sl-cta-btns">
            <button className="sl-btn-accent" onClick={() => navigate("/auth")}>
              Join as a Seller 🍽️
            </button>
            <button className="sl-btn-outline-light" onClick={() => navigate("/about")}>
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SellerLanding;