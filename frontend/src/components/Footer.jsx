const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        .footer {
          background: #1e1008;
          color: #d4a878;
          padding: 72px 48px 32px;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c8753a, #e8a055, #c8753a);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
          max-width: 1200px;
          margin: 0 auto 56px;
        }

        .footer-brand .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #fff8ef;
          margin-bottom: 16px;
        }

        .footer-brand .logo-text span {
          color: #e8a055;
          font-style: italic;
        }

        .footer-brand p {
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          line-height: 1.75;
          color: #9a7a5a;
          max-width: 260px;
          margin-bottom: 24px;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 38px;
          height: 38px;
          border: 1px solid #3a2510;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s;
          cursor: pointer;
          background: transparent;
        }

        .social-link:hover {
          border-color: #c8753a;
          background: rgba(200,117,58,0.15);
          transform: translateY(-2px);
        }

        .footer-col h4 {
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #fff8ef;
          margin-bottom: 20px;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .footer-col ul li a {
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          color: #9a7a5a;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-col ul li a:hover { color: #e8a055; }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .newsletter-form p {
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem;
          color: #9a7a5a;
          line-height: 1.6;
        }

        .newsletter-input-group {
          display: flex;
          border: 1px solid #3a2510;
          border-radius: 50px;
          overflow: hidden;
          background: #2a1508;
        }

        .newsletter-input-group input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 11px 18px;
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          color: #d4a878;
        }

        .newsletter-input-group input::placeholder { color: #5a3d22; }

        .newsletter-input-group button {
          background: #c8753a;
          border: none;
          color: #fff8ef;
          padding: 10px 18px;
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 0 50px 50px 0;
          transition: background 0.3s;
        }

        .newsletter-input-group button:hover { background: #e8a055; }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 28px;
          border-top: 1px solid #2a1a0a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-bottom p {
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem;
          color: #5a3d22;
        }

        .footer-bottom span { color: #c8753a; }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-links a {
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem;
          color: #5a3d22;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-bottom-links a:hover { color: #c8753a; }

        @media (max-width: 900px) {
          .footer { padding: 56px 24px 28px; }
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
        }

        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-text">Mero <span>Kitchen</span></div>
            <p>Handcrafted meals made with love, traditional recipes, and the freshest local ingredients — delivered straight to your door.</p>
            <div className="social-links">
              <div className="social-link" title="Facebook">📘</div>
              <div className="social-link" title="Instagram">📸</div>
              <div className="social-link" title="TikTok">🎵</div>
              <div className="social-link" title="WhatsApp">💬</div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#menu">Today's Menu</a></li>
              <li><a href="#about">Our Story</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+977-9800000000">+977-9800000000</a></li>
              <li><a href="mailto:hello@merokitchen.com">hello@merokitchen.com</a></li>
              <li><a href="#">Kathmandu, Nepal</a></li>
              <li><a href="#">Mon–Sat: 8am – 8pm</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Stay Updated</h4>
            <div className="newsletter-form">
              <p>Get daily menu updates and special offers in your inbox.</p>
              <div className="newsletter-input-group">
                <input type="email" placeholder="your@email.com" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Mero Kitchen. Made with <span>♥</span> in Nepal.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
