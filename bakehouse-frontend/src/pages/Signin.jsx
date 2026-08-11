import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function Signin() {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
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
        ENDPOINTS.signin,
        "POST",
        formData
      );

      console.log("Signin response:", response);

      alert("Signin successful");

      await getCurrentUser();

      navigate("/");
    } catch (error) {
      console.error("Signin error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        {error && <p className="error-message">{error}</p>}

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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;