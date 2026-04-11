import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../css/Auth.css";
import loginImg from "../../assets/login.jpg";
import logoImg from "../../assets/logo.png";

// Fix Leaflet marker icon bug with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Click-to-pin handler inside map
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}
function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo([coords.lat, coords.lng], 16);
  }, [coords]);
  return null;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    city: "",
    defaultDeliveryAddress: "",
    kitchenName: "",
  });
  const [storeCoords, setStoreCoords] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? "/users/login" : "/users/create";

    // Build payload with storeLocation for sellers
    const payload = { ...formData };
    if (!isLogin && formData.role === "seller" && storeCoords) {
      payload.storeLocation = {
        type: "Point",
        coordinates: [storeCoords.lng, storeCoords.lat],
        address: locationAddress,
      };
    }

    try {
      const res = await axios.post(`http://localhost:3000${endpoint}`, payload);
      if (isLogin) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.userId);
        setMessage({ text: "Welcome back! Redirecting...", type: "success" });
        setTimeout(() => {
          if (res.data.role === "admin") navigate("/admin");
          else if (res.data.role === "seller") navigate("/sell-with-us");
          else navigate("/");
        }, 1000);
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
    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT: image panel */}
        <div
          className="auth-card-image"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(45,26,14,0.35), rgba(45,26,14,0.6)), url(${loginImg})`,
          }}
        >
          <div className="auth-card-image-text">
            Real Food,
            <br />
            Made with <em>Love</em>
          </div>
        </div>

        {/* RIGHT: form panel */}
        <div className="auth-card-form">
          <div className="auth-logo" onClick={() => navigate("/")}>
            <div className="auth-logo-icon">
              <img src={logoImg} alt="Mero Kitchen" />
            </div>
            <div className="auth-logo-text">
              Mero <span>Kitchen</span>
            </div>
          </div>

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

          {message.text && (
            <div
              className={`msg-banner ${message.type === "success" ? "msg-success" : "msg-error"}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                {/* Row 1: Name + Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      name="name"
                      placeholder="e.g. Your name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      name="phone"
                      type="tel"
                      placeholder="e.g. 9XXXXXXXX"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Row 2: City + Email */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      className="form-input"
                      name="city"
                      placeholder="e.g. Kathmandu"
                      onChange={handleChange}
                    />
                  </div>
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

                {/* Role */}
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
                        <span className="role-emoji"></span>Order Food
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
                        <span className="role-emoji"></span>Sell Food
                      </div>
                    </label>
                  </div>
                </div>

                {formData.role === "customer" && (
                  <div className="form-group">
                    <label className="form-label">
                      Default Delivery Address
                    </label>
                    <input
                      className="form-input"
                      name="defaultDeliveryAddress"
                      placeholder="e.g. Baneshwor, Kathmandu"
                      onChange={handleChange}
                    />
                  </div>
                )}

                {formData.role === "seller" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Kitchen Name</label>
                      <input
                        className="form-input"
                        name="kitchenName"
                        placeholder="e.g. Sita's Kitchen"
                        onChange={handleChange}
                      />
                    </div>

                    {/* Map Location Picker */}
                    <div className="form-group">
                      <label className="form-label">
                        Store Location{" "}
                        <span
                          style={{
                            fontWeight: 400,
                            color: "#888",
                            fontSize: "0.82rem",
                          }}
                        >
                          (click map to pin your kitchen)
                        </span>
                      </label>

                      {!mapReady ? (
                        <button
                          type="button"
                          className="form-input"
                          style={{
                            cursor: "pointer",
                            background: "#fff7ed",
                            border: "1.5px dashed #e07b39",
                            color: "#e07b39",
                            textAlign: "center",
                            fontWeight: 600,
                          }}
                          onClick={() => setMapReady(true)}
                        >
                           Open Map Picker
                        </button>
                      ) : (
                        <>
                          {/* Use Current Location Button */}
                          <button
                            type="button"
                            className="form-input"
                            style={{
                              cursor: "pointer",
                              background: "#f0fdf4",
                              border: "1.5px solid #4a9c5d",
                              color: "#4a9c5d",
                              textAlign: "center",
                              fontWeight: 600,
                              marginBottom: "8px",
                            }}
                            onClick={() => {
                              if (!navigator.geolocation) {
                                alert(
                                  "Geolocation is not supported by your browser.",
                                );
                                return;
                              }
                              navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                  const coords = {
                                    lat: pos.coords.latitude,
                                    lng: pos.coords.longitude,
                                  };
                                  setStoreCoords(coords);
                                },
                                () =>
                                  alert(
                                    "Unable to retrieve your location. Please pin it manually.",
                                  ),
                              );
                            }}
                          >
                             Use My Current Location
                          </button>

                          <MapContainer
                            center={[27.7172, 85.324]}
                            zoom={13}
                            style={{
                              height: "220px",
                              width: "100%",
                              borderRadius: "10px",
                              marginBottom: "8px",
                              zIndex: 0,
                            }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationPicker onPick={setStoreCoords} />
                            {storeCoords && (
                              <>
                                <Marker
                                  position={[storeCoords.lat, storeCoords.lng]}
                                />
                                <FlyToLocation coords={storeCoords} />
                              </>
                            )}
                          </MapContainer>

                          <input
                            className="form-input"
                            placeholder="Address label (e.g. Baneshwor, Kathmandu)"
                            value={locationAddress}
                            onChange={(e) => setLocationAddress(e.target.value)}
                          />

                          {storeCoords && (
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "#4a9c5d",
                                marginTop: "4px",
                              }}
                            >
                              ✅ Pinned: {storeCoords.lat.toFixed(5)},{" "}
                              {storeCoords.lng.toFixed(5)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Login fields */}
            {isLogin && (
              <>
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
              </>
            )}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In "
                  : "Create Account "}
            </button>
          </form>

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
    </div>
  );
};

export default Auth;
