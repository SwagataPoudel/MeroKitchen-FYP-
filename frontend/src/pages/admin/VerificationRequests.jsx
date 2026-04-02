import { useEffect, useState } from "react";
import { fetchVerificationRequests, updateVerificationStatus } from "../../api/adminApi";

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetchVerificationRequests();
      setRequests(res.data.requests);
    } catch {
      setMessage("Failed to load verification requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      setActionLoading(id + status);
      await updateVerificationStatus(id, status, noteMap[id] || "");
      setMessage(`Seller ${status} successfully.`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setMessage("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-page">
      <h2>Verification Requests</h2>
      {message && <p className="admin-message">{message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending verification requests.</p>
      ) : (
        <div className="verification-list">
          {requests.map((r) => (
            <div key={r._id} className="verification-card">
              <div className="verification-info">
                <h3>{r.kitchenName || r.name}</h3>
                <p>
                  {r.email} — {r.city}
                </p>
                <p className="verification-status">
                  Status: {r.verificationStatus}
                </p>
              </div>

              <div className="verification-docs">
                <p>
                  <strong>Documents:</strong>
                </p>
                {r.verificationDocuments?.length > 0 ? (
                  r.verificationDocuments.map((doc, i) => (
                    <a
                      key={doc}
                      href={`http://localhost:3000${doc}`}
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      📄 Document {i + 1}
                    </a>
                  ))
                ) : (
                  <p>No documents uploaded.</p>
                )}
              </div>

              <div className="verification-actions">
                <textarea
                  placeholder="Rejection note (optional)"
                  value={noteMap[r._id] || ""}
                  onChange={(e) =>
                    setNoteMap((prev) => ({ ...prev, [r._id]: e.target.value }))
                  }
                  rows={2}
                />
                <div className="action-buttons">
                  <button
                    className="btn-approve"
                    disabled={actionLoading === r._id + "approved"}
                    onClick={() => handleAction(r._id, "approved")}
                  >
                    {actionLoading === r._id + "approved"
                      ? "Approving..."
                      : "✅ Approve"}
                  </button>
                  <button
                    className="btn-reject"
                    disabled={actionLoading === r._id + "rejected"}
                    onClick={() => handleAction(r._id, "rejected")}
                  >
                    {actionLoading === r._id + "rejected"
                      ? "Rejecting..."
                      : "❌ Reject"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationRequests;
