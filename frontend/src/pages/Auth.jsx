import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? "/users/login" : "/users/create";
    try {
      const res = await axios.post(
        `http://localhost:3000${endpoint}`,
        formData,
      );
      if (isLogin) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("role", res.data.role);
        setMessage({ text: "Welcome back! Redirecting...", type: "success" });
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage({ text: "Account created! Please login.", type: "success" });
        setIsLogin(true);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo" onClick={() => navigate("/")}>
            <div className="auth-logo-icon">🍲</div>
            <div className="auth-logo-text">
              Mero <span>Kitchen</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="auth-heading">
            {isLogin ? (
              <>
                Welcome <em>back</em>
              </>
            ) : (
              <>
                Join <em>us</em> today
              </>
            )}
          </h2>
          <p className="auth-subheading">
            {isLogin
              ? "Sign in to order homemade food or manage your listings."
              : "Create an account to start your homemade food journey."}
          </p>

          {/* Message */}
          {message.text && (
            <div
              className={`msg-banner ${message.type === "success" ? "msg-success" : "msg-error"}`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  name="name"
                  placeholder="e.g. Sita Sharma"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">I want to</label>
                <div className="role-grid">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      defaultChecked
                      onChange={handleChange}
                    />
                    <div className="role-label">
                      <span className="role-emoji">🛒</span>
                      Order Food
                    </div>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      onChange={handleChange}
                    />
                    <div className="role-label">
                      <span className="role-emoji">🍳</span>
                      Sell Food
                    </div>
                  </label>
                </div>
              </div>
            )}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In 🍽️"
                  : "Create Account 🍽️"}
            </button>
          </form>

          <div className="divider">or</div>

          <div className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage({ text: "", type: "" });
              }}
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
