import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function VerifyOtp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const signupEmail = sessionStorage.getItem("signupEmail");

    if (!signupEmail) {
      navigate("/signup");
      return;
    }

    setEmail(signupEmail);
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await apiRequest(
        ENDPOINTS.verifyOtp,
        "POST",
        {
          email,
          otp,
        }
      );

      console.log("OTP verification response:", response);

      setMessage(
        response.message || "Email verified successfully!"
      );

      sessionStorage.removeItem("signupEmail");

      setTimeout(() => {
        navigate("/signin");
      }, 1000);

    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      setError("");
      setMessage("");

      const response = await apiRequest(
        ENDPOINTS.resendOtp,
        "POST",
        {
          email,
        }
      );

      console.log("Resend OTP response:", response);

      setMessage(
        response.message || "A new OTP has been sent."
      );

      setCooldown(60);

    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h1>Verify Your Email</h1>

        <p>
          We have sent a verification code to:
        </p>

        <strong>{email}</strong>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 6);

            setOtp(value);
          }}
          required
        />

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resending || cooldown > 0}
        >
          {resending
            ? "Sending..."
            : cooldown > 0
            ? `Resend OTP in ${cooldown}s`
            : "Resend OTP"}
        </button>

        <p>
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
          >
            Signup again
          </button>
        </p>
      </form>
    </div>
  );
}

export default VerifyOtp;