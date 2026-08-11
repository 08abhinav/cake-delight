import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email saved during signup
  const email = sessionStorage.getItem("signupEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Signup session expired. Please signup again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        ENDPOINTS.verifyOtp,
        "POST",
        {
          email,
          otp,
        }
      );

      console.log("OTP verification response:", response);

      // Signup process is complete
      sessionStorage.removeItem("signupEmail");

      alert("Account verified successfully. Please sign in.");
      navigate("/signin");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Verify OTP</h1>

        <p className="otp-info">
          Enter the OTP sent to:
          <br />
          <strong>{email || "your email"}</strong>
        </p>

        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          maxLength="6"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;