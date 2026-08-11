import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function Checkout() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
houseno: "",
street: "",
city: "",
state: "",
pincode: "",
mobileNumber: "",
paymentType: "COD",
paymentStatus: "UNPAID",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [notification, setNotification] = useState(null);

const handleChange = (e) => {
const { name, value } = e.target;

if (name === "paymentType") {
  setFormData((prev) => ({
    ...prev,
    paymentType: value,
    paymentStatus:
      value === "COD" ? "UNPAID" : "PAID",
  }));
  return;
}

setFormData((prev) => ({
  ...prev,
  [name]: value,
}));
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
  setLoading(true);
  setError("");
  setNotification(null);

  const response = await apiRequest(
    ENDPOINTS.checkout,
    "POST",
    formData
  );

  console.log("Checkout response:", response);

  setNotification({
    type: "success",
    title: "Order placed successfully!",
    message:
      "Your order has been confirmed. Order details will be sent to your email.",
  });

  /*
   * Give the user a moment to see the
   * notification before navigating.
   */
  setTimeout(() => {
    navigate("/orders");
  }, 3000);

} catch (error) {
  console.error("Checkout error:", error);

  setNotification({
    type: "error",
    title: "Order failed",
    message:
      error.message || "Unable to place your order.",
  });

  setError(error.message);
} finally {
  setLoading(false);
}
};

return ( <div className="page-container checkout-page">
  {notification && (
    <div
      className={`checkout-notification ${notification.type}`}
    >
      <div className="notification-icon">
        {notification.type === "success"
          ? "✓"
          : "!"}
      </div>

      <div className="notification-content">
        <strong>
          {notification.title}
        </strong>

        <p>
          {notification.message}
        </p>
      </div>

      <button
        type="button"
        className="notification-close"
        onClick={() => setNotification(null)}
      >
        ×
      </button>
    </div>
  )}

  <h1>Checkout</h1>

  {error && !notification && (
    <p className="error-message">
      {error}
    </p>
  )}

  <form
    className="checkout-form"
    onSubmit={handleSubmit}
  >
    <h2>Delivery Address</h2>

    <input
      type="text"
      name="houseno"
      placeholder="House No."
      value={formData.houseno}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="street"
      placeholder="Street"
      value={formData.street}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="city"
      placeholder="City"
      value={formData.city}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="state"
      placeholder="State"
      value={formData.state}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="pincode"
      placeholder="Pincode"
      value={formData.pincode}
      onChange={handleChange}
      required
      maxLength="6"
    />

    <input
      type="tel"
      name="mobileNumber"
      placeholder="Mobile Number"
      value={formData.mobileNumber}
      onChange={handleChange}
      required
      maxLength="10"
    />

    <h2>Payment</h2>

    <select
      name="paymentType"
      value={formData.paymentType}
      onChange={handleChange}
    >
      <option value="COD">
        Cash on Delivery
      </option>

      <option value="UPI">
        UPI
      </option>

      <option value="NET BANKING">
        Net Banking
      </option>
    </select>

    <div className="payment-status">
      Payment Status:{" "}
      <strong>
        {formData.paymentStatus}
      </strong>
    </div>

    <button
      type="submit"
      disabled={loading}
    >
      {loading
        ? "Placing Order..."
        : "Place Order"}
    </button>
  </form>
</div>
);
}

export default Checkout;
