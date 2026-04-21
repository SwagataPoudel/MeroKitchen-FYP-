import './Footer.css';
import logoImg from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div className="footer-brand">
          <div className="logo-text">
            <img src={logoImg} alt="Mero Kitchen" className="logo-img" />
            Mero <span>Kitchen</span>
          </div>
          <p>Handcrafted meals made with love, traditional recipes, and the freshest local ingredients.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#menu">Today's Menu</a></li>
            <li><a href="#about">Our Story</a></li>
            <li><a href="#how">How It Works</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>hello@merokitchen.com</li>
            <li>Kathmandu, Nepal</li>
            <li>Mon–Sat: 8am – 8pm</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Mero Kitchen. Made with <span>♥</span> in Nepal.</p>
      </div>
    </footer>
  );
};

export default Footer;