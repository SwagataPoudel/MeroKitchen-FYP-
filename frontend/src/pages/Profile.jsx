import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";
import "../css/Profile.css";
import logoImg from "../assets/logo.png";

const CUISINE_OPTIONS = [
  "Newari",
  "Tibetan",
  "Indian",
  "Chinese",
  "Continental",
  "Nepali",
  "Italian",
  "Fast Food",
];

export default function Profile() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    defaultDeliveryAddress: "",
    kitchenName: "",
    kitchenDescription: "",
    cuisineTypes: [],
    openingHours: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // ── Verification state ──────────────────────────────────
  const [verificationStatus, setVerificationStatus] = useState("none");
  const [verificationNote, setVerificationNote] = useState("");
  const [verifyDocs, setVerifyDocs] = useState([]);
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState({ text: "", type: "" });
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!token) return navigate("/auth");
    axios
      .get("http://localhost:3000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data.user;
        setFormData({
          name: u.name || "",
          phone: u.phone || "",
          city: u.city || "",
          defaultDeliveryAddress: u.defaultDeliveryAddress || "",
          kitchenName: u.kitchenName || "",
          kitchenDescription: u.kitchenDescription || "",
          cuisineTypes: u.cuisineTypes || [],
          openingHours: u.openingHours || "",
          isAvailable: u.isAvailable ?? true,
        });
        if (u.profilePhoto)
          setPhotoPreview(`http://localhost:3000${u.profilePhoto}`);
        // load verification info
        setVerificationStatus(u.verificationStatus || "none");
        setVerificationNote(u.verificationNote || "");
        setSubscriptionStatus(u.subscriptionStatus || "none"); // ✅ moved inside .then()
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCuisineToggle = (cuisine) => {
    setFormData((prev) => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter((c) => c !== cuisine)
        : [...prev.cuisineTypes, cuisine],
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      if (photoFile) {
        const fd = new FormData();
        fd.append("profilePhoto", photoFile);
        await axios.put("http://localhost:3000/users/profile/photo", fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await axios.put("http://localhost:3000/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Submit verification docs ────────────────────────────
  const handleVerifySubmit = async () => {
    if (verifyDocs.length === 0)
      return setVerifyMessage({
        text: "Please select at least one document.",
        type: "error",
      });

    setVerifySubmitting(true);
    setVerifyMessage({ text: "", type: "" });

    try {
      const fd = new FormData();
      verifyDocs.forEach((file) => fd.append("documents", file));

      await axios.post("http://localhost:3000/users/verify/submit", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVerificationStatus("pending");
      setVerifyDocs([]);
      setVerifyMessage({
        text: "Documents submitted! Admin will review shortly.",
        type: "success",
      });
    } catch (err) {
      setVerifyMessage({
        text: err.response?.data?.message || "Submission failed.",
        type: "error",
      });
    } finally {
      setVerifySubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="auth-page">
        <p>Loading...</p>
      </div>
    );

  // ── Verification UI helper ──────────────────────────────
  const renderVerificationSection = () => {
    // Step 1: Must have active subscription
    if (subscriptionStatus !== "active") {
      return (
        <div className="verify-upload-box">
          <div className="verify-title">Subscription Required 🔒</div>
          <div className="verify-desc">
            You need an active subscription to apply for the{" "}
            <strong>Verified Homemade</strong> badge. Subscribe to unlock
            verification and other seller benefits.
          </div>
          <button
            className="submit-btn verify-submit-btn"
            style={{ marginTop: 14 }}
            onClick={() => navigate("/subscription")}
          >
            View Subscription Plans 🏅
          </button>
        </div>
      );
    }

    // Step 2: Already verified
    if (verificationStatus === "approved") {
      return (
        <div className="verify-status-box verify-approved">
          <span className="verify-icon">✅</span>
          <div>
            <div className="verify-title">Verified Homemade Seller</div>
            <div className="verify-desc">
              Your kitchen has been verified by Mero Kitchen. A badge is shown
              on your public profile.
            </div>
          </div>
        </div>
      );
    }

    if (verificationStatus === "pending") {
      return (
        <div className="verify-status-box verify-pending">
          <span className="verify-icon">⏳</span>
          <div>
            <div className="verify-title">Verification Pending</div>
            <div className="verify-desc">
              Your documents have been submitted and are under review. We'll
              update you soon.
            </div>
          </div>
        </div>
      );
    }

    if (verificationStatus === "rejected") {
      return (
        <div className="verify-status-box verify-rejected">
          <span className="verify-icon">❌</span>
          <div>
            <div className="verify-title">Verification Rejected</div>
            {verificationNote && (
              <div className="verify-desc">Reason: {verificationNote}</div>
            )}
            <div className="verify-desc" style={{ marginTop: "8px" }}>
              You can resubmit new documents below.
            </div>
          </div>
          {renderUploadForm()}
        </div>
      );
    }

    // status === "none" — subscribed but not yet submitted
    return (
      <div className="verify-upload-box">
        <div className="verify-title">Get Verified 🏅</div>
        <div className="verify-desc">
          Upload documents (e.g. your ID, kitchen photos, food license) to apply
          for the <strong>Verified Homemade</strong> badge. Accepted formats:
          JPG, PNG, PDF.
        </div>
        {renderUploadForm()}
      </div>
    );
  };

  const renderUploadForm = () => (
    <div className="verify-form">
      <label className="verify-upload-label">
        📎 Choose Documents (up to 5)
        <input
          type="file"
          accept="image/*,.pdf"
          multiple
          hidden
          onChange={(e) => setVerifyDocs(Array.from(e.target.files))}
        />
      </label>

      {verifyDocs.length > 0 && (
        <ul className="verify-file-list">
          {verifyDocs.map((f, i) => (
            <li key={i}>📄 {f.name}</li>
          ))}
        </ul>
      )}

      {verifyMessage.text && (
        <div
          className={`msg-banner ${verifyMessage.type === "success" ? "msg-success" : "msg-error"}`}
        >
          {verifyMessage.text}
        </div>
      )}

      <button
        className="submit-btn verify-submit-btn"
        onClick={handleVerifySubmit}
        disabled={verifySubmitting}
      >
        {verifySubmitting ? "Submitting..." : "Submit for Verification 🚀"}
      </button>
    </div>
  );

  return (
    <div className="auth-page profile-page">
      <div className="auth-card profile-card">
        {/* Logo */}
        <div className="auth-logo" onClick={() => navigate("/")}>
          <div className="auth-logo-icon">
            <img src={logoImg} alt="Mero Kitchen" />
          </div>
          <div className="auth-logo-text">
            Mero <span>Kitchen</span>
          </div>
        </div>

        <h2 className="auth-heading">
          My <em>Profile</em>
        </h2>
        <p className="auth-subheading">
          Manage your account details and preferences.
        </p>

        {message.text && (
          <div
            className={`msg-banner ${message.type === "success" ? "msg-success" : "msg-error"}`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Photo */}
        <div className="profile-photo-section">
          <div className="profile-avatar">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {formData.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <label className="photo-upload-btn">
            📷 Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Shared Fields ── */}
          <div className="profile-section-label">Basic Info</div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-input"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="98XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              className="form-input"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Kathmandu"
            />
          </div>

          {/* ── Customer Fields ── */}
          {role === "customer" && (
            <>
              <div className="profile-section-label">Delivery</div>
              <div className="form-group">
                <label className="form-label">Default Delivery Address</label>
                <input
                  className="form-input"
                  name="defaultDeliveryAddress"
                  value={formData.defaultDeliveryAddress}
                  onChange={handleChange}
                  placeholder="e.g. Baneshwor, Kathmandu"
                />
              </div>
            </>
          )}

          {/* ── Seller Fields ── */}
          {role === "seller" && (
            <>
              <div className="profile-section-label">Kitchen Info</div>

              <div className="form-group">
                <label className="form-label">Kitchen Name</label>
                <input
                  className="form-input"
                  name="kitchenName"
                  value={formData.kitchenName}
                  onChange={handleChange}
                  placeholder="e.g. Sita's Kitchen"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kitchen Description</label>
                <textarea
                  className="form-input profile-textarea"
                  name="kitchenDescription"
                  value={formData.kitchenDescription}
                  onChange={handleChange}
                  placeholder="Tell customers about your kitchen..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cuisine Types</label>
                <div className="cuisine-grid">
                  {CUISINE_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`cuisine-chip ${formData.cuisineTypes.includes(c) ? "active" : ""}`}
                      onClick={() => handleCuisineToggle(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Opening Hours</label>
                <input
                  className="form-input"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleChange}
                  placeholder="e.g. 8am – 8pm"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Availability</label>
                <div className="toggle-row">
                  <span className="toggle-desc">
                    {formData.isAvailable
                      ? "✅ Currently accepting orders"
                      : "🔴 Not accepting orders"}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </>
          )}

          <button className="submit-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes 🍽️"}
          </button>
        </form>

        {/* ── Verification Section (sellers only) ── */}
        {role === "seller" && (
          <div className="verify-section">
            <div className="profile-section-label">Verification</div>
            {renderVerificationSection()}
          </div>
        )}
      </div>
    </div>
  );
}
