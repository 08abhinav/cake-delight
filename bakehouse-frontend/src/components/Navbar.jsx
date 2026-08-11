import { Link, useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, authLoading } = useAuth();

  const handleSignout = async () => {
    try {
      await apiRequest(ENDPOINTS.signout, "GET");
      setUser(null);
      alert("Signed out successfully");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  }; // Removed the extra closing brace here

  if (authLoading) {
    return (
      <nav className="navbar">
        <Link to="/" className="logo">
          BakeHouse
        </Link>
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        BakeHouse
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/signin">Signin</Link>
          </>
        )}

        {user?.role === "buyer" && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}

        {user?.role === "seller" && (
          <>
            <Link to="/add-cake">Add Cake</Link>
            <Link to="/my-cakes">My Cakes</Link>
          </>
        )}

        {user && (
          <>
            <span className="user-info">
              {user.email} ({user.role})
            </span>

            <button onClick={handleSignout} className="signout-btn">
              Signout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;