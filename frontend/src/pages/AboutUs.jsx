import "../css/AboutUs.css";
import img1 from "../assets/img1.jpg";
import ingredient from "../assets/ingredients.jpg";
import hero1 from "../assets/hero1.jpg";

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

const team = [
  {
    name: "Maya Devi Shrestha",
    role: "Head Cook & Founder",
    bio: "Maya started Mero Kitchen after 30 years of cooking for her family. Her dal bhat is the stuff of legend in Baneshwor.",
    initial: "M",
  },
  {
    name: "Rajan Tamang",
    role: "Delivery & Operations",
    bio: "Rajan ensures every meal arrives hot and on time. He knows every lane in Kathmandu by heart.",
    initial: "R",
  },
  {
    name: "Anisha Maharjan",
    role: "Menu & Recipe Curation",
    bio: "Anisha brings Newari culinary heritage to the menu, reviving forgotten recipes with a modern touch.",
    initial: "A",
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

      {/* ── HERO SPLIT ─────────────────────────── */}
      <section className="au-hero">
        <div className="au-hero-image">
          <img src={img1} alt="Our kitchen" />
          <div className="au-hero-image-overlay" />
          <div className="au-hero-badge">Est. 2019 · Kathmandu</div>
        </div>
        <div className="au-hero-text">
          <div className="au-label">Who We Are</div>
          <h1>
            A Kitchen Full of <em>Stories</em>
          </h1>
          <p>
            Mero Kitchen was born from a simple belief — that the best food
            is made with love, patience, and ingredients you can trust. What
            started as one mother cooking for her neighbourhood has grown into
            a community of hundreds of families who share a table with us
            every single day.
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

      {/* ── OUR STORY SPLIT (reversed) ────────── */}
      <section className="au-story">
        <div className="au-story-text">
          <div className="au-label">Our Story</div>
          <h2>How it all <em>began</em></h2>
          <p>
            In 2019, Maya Devi Shrestha — a retired schoolteacher and lifelong
            home cook — began sending tiffin boxes to neighbours who missed
            homemade food. Word spread quickly. Within months, she had more
            orders than she could handle alone.
          </p>
          <p>
            Her daughter joined. Then a neighbour. Today, Mero Kitchen is a
            small but passionate team keeping alive the recipes that have
            nourished Nepali families for generations.
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
          <img src={ingredient} alt="Fresh ingredients" />
          <div className="au-story-card">
            <div className="au-story-card-emoji">👩‍🍳</div>
            <p>"I cook every meal as if my own children will eat it."</p>
            <span>— Maya Devi, Founder</span>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────── */}
      <section className="au-values">
        <div className="au-label" style={{ textAlign: "center" }}>What We Stand For</div>
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

      {/* ── TEAM ─────────────────────────────── */}
      <section className="au-team">
        <div className="au-team-header">
          <div className="au-label">The People Behind the Food</div>
          <h2 className="au-section-title">Meet the <em>Team</em></h2>
        </div>
        <div className="au-team-grid">
          {team.map((t) => (
            <div key={t.name} className="au-team-card">
              <div className="au-team-avatar">{t.initial}</div>
              <h3>{t.name}</h3>
              <div className="au-team-role">{t.role}</div>
              <p>{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="au-cta">
        <div className="au-cta-image">
          <img src={hero1} alt="Our food" />
          <div className="au-cta-overlay" />
        </div>
        <div className="au-cta-text">
          <h2>Come eat with <em>us</em></h2>
          <p>
            Join hundreds of families who trust us with their daily meals.
            Authentic, fresh, and made with love — every single day.
          </p>
          <div className="au-cta-btns">
            <button className="au-btn-primary">Order Today 🍽️</button>
            <button className="au-btn-ghost">Chat on WhatsApp</button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutUs;