import { useEffect } from "react";
import "../../css/Landing.css";
import heroBg from "../../assets/banner.jpg";
import hero1 from "../../assets/hero1.jpg";
import img1 from "../../assets/img1.jpg";
import ingredient from "../../assets/ingredients.jpg";
import menu1 from "../../assets/menu1.jpg";
import menu2 from "../../assets/menu2.jpg";
import menu3 from "../../assets/menu3.jpg";
import menu4 from "../../assets/menu4.jpg";
import menu5 from "../../assets/menu5.jpg";
import menu6 from "../../assets/menu6.jpg";
import menu7 from "../../assets/menu7.jpg";
import menu8 from "../../assets/menu8.jpg";
import browseimg from "../../assets/browseimg.png";
import placeorder from "../../assets/placeorder.png";
import cook from "../../assets/cook.jpg";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: 1, name: "Dal Bhat Set", img: menu1 },
  { id: 2, name: "Momo Basket", img: menu2 },
  { id: 3, name: "Thukpa Bowl", img: menu3 },
  { id: 4, name: "Newari Khaja Set", img: menu4 },
  { id: 5, name: "Gundruk Soup", img: menu5 },
  { id: 6, name: "Sel Roti & Chia Pudding", img: menu6 },
  { id: 7, name: "Samay Baji", img: menu7 },
  { id: 8, name: "Butter Tea & Snack", img: menu8 },
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
    img: browseimg,
  },
  {
    n: "02",
    title: "Place Your Order",
    desc: "Order online or via WhatsApp — no fuss, just simple steps.",
    img: placeorder,
  },
  {
    n: "03",
    title: "We Cook Fresh",
    desc: "Every meal is prepared to order in our home kitchen by Mero aunties.",
    img: cook,
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <main>
        <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="hero-content">
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

          <div className="hero-visual"></div>
        </section>

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
              style={{
                marginTop: "28px",
                backgroundColor: "black",
                color: "#fff8ef",
              }}
              onClick={() => navigate("/about")}
            >
              Read Our Full Story →
            </button>
          </div>
        </section>
        <section id="menu" className="menu-section">
          <div className="menu-header">
            <div className="menu-header-left">
              <div className="section-label">Today's Specials</div>
              <h2 className="section-title">
                What's <em>cooking</em> today
              </h2>
            </div>
          </div>

          <div className="menu-mosaic">
            <div className="mosaic-cell mosaic-large">
              <img src={menuItems[0].img} alt={menuItems[0].name} />
            </div>
            <div className="mosaic-cell mosaic-tall">
              <img src={menuItems[1].img} alt={menuItems[1].name} />
            </div>
            <div className="mosaic-cell mosaic-small">
              <img src={menuItems[2].img} alt={menuItems[2].name} />
            </div>
            <div className="mosaic-cell mosaic-small">
              <img src={menuItems[3].img} alt={menuItems[3].name} />
            </div>
            <div className="mosaic-cell mosaic-small">
              <img src={menuItems[4].img} alt={menuItems[4].name} />
            </div>
            <div className="mosaic-cell mosaic-small">
              <img src={menuItems[5].img} alt={menuItems[5].name} />
            </div>
            <div className="mosaic-cell mosaic-small">
              <img src={menuItems[6].img} alt={menuItems[6].name} />
            </div>
            <div className="mosaic-cell mosaic-small">
              <img src={menuItems[7].img} alt={menuItems[7].name} />
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button className="btn-primary" onClick={() => navigate("/Auth")}>
              View Full Menu →
            </button>
          </div>
        </section>

        <section id="how" className="how-section">
          <div className="steps-header">
            <div className="section-label">Simple Process</div>
            <h2 className="section-title">
              From our <em>kitchen</em> to your table
            </h2>
            <p className="section-sub">
              Ordering homemade food has never been easier. Just three simple
              steps.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-icon">
                  <img src={s.img} alt={s.title} />
                  <div className="step-num">{s.n}</div>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

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
            <button className="btn-accent" onClick={() => navigate("/Auth")}>
              Order Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Landing;
