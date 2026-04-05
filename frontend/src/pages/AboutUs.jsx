import "../css/AboutUs.css";
import img1 from "../assets/img1.jpg";
import ingredient from "../assets/ingredients.jpg";
import hero1 from "../assets/hero1.jpg";
import about2 from "../assets/about2.jpg";
import swagataImg from "../assets/swagata.jpeg";
import sampadaImg from "../assets/sampada.jpeg";
import shristikaImg from "../assets/shristika.jpeg";

const values = [
  {
    emoji: "🌿",
    title: "Farm to Table",
    desc: "Every ingredient is sourced fresh from local Kathmandu Valley farmers each morning.",
  },
  {
    emoji: "🫙",
    title: "No Preservatives",
    desc: "We cook daily in small batches — no shortcuts, no frozen prep, ever.",
  },
  {
    emoji: "♻️",
    title: "Eco Packaging",
    desc: "Compostable containers and minimal plastic — because the earth matters too.",
  },
  {
    emoji: "🏅",
    title: "Hygiene Certified",
    desc: "Our home kitchen is certified and inspected regularly for your peace of mind.",
  },
];

// ✅ Updated team with images
const team = [
  {
    name: "Swagata Poudel",
    role: "Founder",
    bio: "Swagata founded Mero Kitchen with a vision to empower home cooks across Kathmandu, giving them a platform to share their passion and grow their small businesses.",
    image: swagataImg,
  },
  {
    name: "Sampada Poudel",
    role: "Management and Operations",
    bio: "Sampada oversees the day-to-day operations of Mero Kitchen, ensuring smooth coordination between sellers, customers, and the team.",
    image: sampadaImg,
  },
  {
    name: "Shristika Dhungana",
    role: "Customer Relations and Care",
    bio: "Shristika is dedicated to making every customer feel valued, handling feedback with care and ensuring a delightful experience from order to delivery.",
    image: shristikaImg,
  },
];

const milestones = [
  { year: "2019", event: "Mero Kitchen founded from a small home in Baneshwor" },
  { year: "2020", event: "First 50 loyal families during lockdown — cooked through it all" },
  { year: "2022", event: "Expanded to 200+ daily orders across Kathmandu" },
  { year: "2024", event: "Launched online ordering & WhatsApp delivery tracking" },
  { year: "2025", event: "500+ happy families and growing every day" },
];

const AboutUs = () => {
  return (
    <main className="about-page">

      {/* HERO */}
      <section className="au-hero">
        <div className="au-hero-image">
          <img src={img1} alt="Our kitchen" />
          <div className="au-hero-image-overlay" />
          <div className="au-hero-badge">Est. 2019 · Kathmandu</div>
        </div>

        <div className="au-hero-text">
          <div className="au-label">Who We Are</div>
          <h1>A Kitchen Full of <em>Stories</em></h1>

          <p>
            Mero Kitchen was born from a simple belief — that the best food
            is made with love, patience, and ingredients you can trust.
          </p>

          <p>
            We don't have a restaurant. We have a home. And in that home,
            every meal is prepared as if it's going to our own family.
          </p>

          <div className="au-hero-stats">
            <div className="au-stat">
              <span className="au-stat-num">500+</span>
              <span className="au-stat-label">Families Served</span>
            </div>

            <div className="au-stat-divider" />

            <div className="au-stat">
              <span className="au-stat-num">6+</span>
              <span className="au-stat-label">Years Cooking</span>
            </div>

            <div className="au-stat-divider" />

            <div className="au-stat">
              <span className="au-stat-num">30+</span>
              <span className="au-stat-label">Home Recipes</span>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="au-story">
        <div className="au-story-text">
          <div className="au-label">Our Story</div>
          <h2>How it all <em>began</em></h2>

          <p>
            In 2019, Maya Devi Shrestha began sending tiffin boxes to neighbours.
            Word spread quickly and soon demand grew rapidly.
          </p>

          <div className="au-timeline">
            {milestones.map((m) => (
              <div key={m.year} className="au-timeline-item">
                <div className="au-timeline-year">{m.year}</div>
                <div className="au-timeline-dot" />
                <div className="au-timeline-event">{m.event}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="au-story-image">
          <img src={about2} alt="cookimage" />
        </div>
      </section>

      {/* VALUES */}
      <section className="au-values">
        <div className="au-label" style={{ textAlign: "center" }}>
          What We Stand For
        </div>
        <h2 className="au-section-title">Our <em>Values</em></h2>

        <div className="au-values-grid">
          {values.map((v) => (
            <div key={v.title} className="au-value-card">
              <div className="au-value-emoji">{v.emoji}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="au-team">
        <div className="au-team-header">
          <div className="au-label">The People Behind the Food</div>
          <h2 className="au-section-title">Meet the <em>Team</em></h2>
        </div>

        <div className="au-team-grid">
          {team.map((t) => (
            <div key={t.name} className="au-team-card">

              {/* ✅ IMAGE INSTEAD OF INITIAL */}
              <div className="au-team-avatar">
                <img src={t.image} alt={t.name} />
              </div>

              <h3>{t.name}</h3>
              <div className="au-team-role">{t.role}</div>
              <p>{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="au-cta">
        <div className="au-cta-image">
          <img src={hero1} alt="Our food" />
          <div className="au-cta-overlay" />
        </div>

        <div className="au-cta-text">
          <h2>Come eat with <em>us</em></h2>
          <p>
            Join hundreds of families who trust us with their daily meals.
          </p>

          <div className="au-cta-btns">
            <button className="au-btn-primary">Order Today </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutUs;