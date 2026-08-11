import { useEffect, useState } from "react";
import { apiRequest, ENDPOINTS } from "../api/api";

function Orders() {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// Currently selected rating
const [selectedRatings, setSelectedRatings] = useState({});

// Ratings successfully submitted
const [submittedRatings, setSubmittedRatings] = useState({});

// Loading state for each product
const [ratingLoading, setRatingLoading] = useState({});

// Success message for each product
const [ratingSuccess, setRatingSuccess] = useState({});

// Error message for each product
const [ratingErrors, setRatingErrors] = useState({});

useEffect(() => {
const fetchOrders = async () => {
try {
setLoading(true);
setError("");
    const response = await apiRequest(
      ENDPOINTS.checkout,
      "GET"
    );

    console.log("Orders response:", response);

    setOrders(response.data || []);
  } catch (error) {
    console.error("Orders error:", error);

    setError(
      error.message || "Failed to fetch orders"
    );
  } finally {
    setLoading(false);
  }
};

fetchOrders();

}, []);

const formatDate = (date) => {
return new Date(date).toLocaleString();
};

const handleRatingSelect = (productId, rating) => {
setSelectedRatings((previous) => ({
...previous,
[productId]: rating,
}));


setRatingErrors((previous) => ({
  ...previous,
  [productId]: "",
}));

setRatingSuccess((previous) => ({
  ...previous,
  [productId]: "",
}));


};

const handleSubmitRating = async (productId) => {
const rating = selectedRatings[productId];


if (!rating) {
  setRatingErrors((previous) => ({
    ...previous,
    [productId]: "Please select a rating first.",
  }));

  return;
}

try {
  setRatingLoading((previous) => ({
    ...previous,
    [productId]: true,
  }));

  setRatingErrors((previous) => ({
    ...previous,
    [productId]: "",
  }));

  setRatingSuccess((previous) => ({
    ...previous,
    [productId]: "",
  }));

  const response = await apiRequest(
    ENDPOINTS.submitRating,
    "POST",
    {
      productId,
      rating,
    }
  );

  console.log("Rating response:", response);

  // IMPORTANT:
  // Keep the successfully submitted rating.
  setSubmittedRatings((previous) => ({
    ...previous,
    [productId]: rating,
  }));

  // Keep selected rating as well.
  setSelectedRatings((previous) => ({
    ...previous,
    [productId]: rating,
  }));

  setRatingSuccess((previous) => ({
    ...previous,
    [productId]:
      response.message ||
      "Thank you for rating the product!",
  }));

} catch (error) {
  console.error("Rating error:", error);

  setRatingErrors((previous) => ({
    ...previous,
    [productId]:
      error.message ||
      "Failed to submit rating.",
  }));
} finally {
  setRatingLoading((previous) => ({
    ...previous,
    [productId]: false,
  }));
}
};

if (loading) {
return ( <div className="page-container"> <h2>Loading orders...</h2> </div>
);
}

return ( <div className="page-container orders-page"> <h1>My Orders</h1>
  {error && (
    <p className="error-message">
      {error}
    </p>
  )}

  {!error && orders.length === 0 && (
    <div className="empty-orders">
      <h2>No orders found</h2>

      <p>
        Your placed orders will appear here.
      </p>
    </div>
  )}

  <div className="orders-list">
    {orders.map((order) => (
      <div
        className="order-card"
        key={order._id}
      >

        <div className="order-header">
          <div>
            <h2>
              Order #{order._id}
            </h2>

            <p>
              Placed on:{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>

          <span
            className={`payment-status ${order.paymentStatus.toLowerCase()}`}
          >
            {order.paymentStatus}
          </span>
        </div>

        <div className="order-items">
          <h3>Items</h3>

          {order.items.map((item) => {
            const selectedRating =
              selectedRatings[item.productId] ||
              submittedRatings[item.productId] ||
              0;

            const isSubmitting =
              ratingLoading[item.productId];

            const successMessage =
              ratingSuccess[item.productId];

            const ratingError =
              ratingErrors[item.productId];

            return (
              <div
                className="order-item"
                key={item.productId}
              >
                <div className="order-item-info">
                  <strong>
                    {item.productName}
                  </strong>

                  <p>
                    ₹{item.price} ×{" "}
                    {item.quantity}
                  </p>

                  <p>
                    Estimated
                    preparation/delivery:
                    {" "}
                    {item.estimatedDeliveryTime}{" "}
                    hours
                  </p>
                </div>

                <div className="order-item-right">
                  <strong>
                    ₹
                    {item.price *
                      item.quantity}
                  </strong>

                  <div className="rating-section">
                    <p className="rate-title">
                      Rate this cake
                    </p>

                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <button
                            type="button"
                            key={star}
                            className={
                              star <= selectedRating
                                ? "star active"
                                : "star"
                            }
                            onClick={() =>
                              handleRatingSelect(
                                item.productId,
                                star
                              )
                            }
                            disabled={isSubmitting}
                            aria-label={`Rate ${star} out of 5`}
                          >
                            ★
                          </button>
                        )
                      )}
                    </div>

                    {selectedRating > 0 && (
                      <p className="selected-rating">
                        {selectedRating}/5
                      </p>
                    )}

                    {/* SUBMIT BUTTON */}

                    <button
                      type="button"
                      className="submit-rating-button"
                      onClick={() =>
                        handleSubmitRating(
                          item.productId
                        )
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit Rating"}
                    </button>

                    {/* SUCCESS */}

                    {successMessage && (
                      <p className="rating-success">
                        {successMessage}
                      </p>
                    )}

                    {/* ERROR */}

                    {ratingError && (
                      <p className="rating-error">
                        {ratingError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="order-address">
          <h3>Delivery Address</h3>

          <p>
            {order.address.houseno},{" "}
            {order.address.street}
          </p>

          <p>
            {order.address.city},{" "}
            {order.address.state} -{" "}
            {order.address.pincode}
          </p>

          <p>
            Mobile: {order.mobileNumber}
          </p>
        </div>

        <div className="order-payment">
          <p>
            <strong>
              Payment Type:
            </strong>{" "}
            {order.paymentType}
          </p>

          <p>
            <strong>
              Payment Status:
            </strong>{" "}
            {order.paymentStatus}
          </p>
        </div>

        <div className="order-total">
          <h2>
            Total: ₹{order.totalAmount}
          </h2>
        </div>
      </div>
    ))}
  </div>
</div>
);
}

export default Orders;
