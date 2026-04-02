import './Footer.css';

const Footer = () => {
  return (
    <>


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
