import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        ENDPOINTS.signup,
        "POST",
        formData
      );

      console.log("Signup response:", response);

      // Temporarily store email for OTP verification
      sessionStorage.setItem("signupEmail", formData.email);

      navigate("/verify-otp");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;