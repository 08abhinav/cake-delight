import { useEffect, useState } from "react";
import { apiRequest, ENDPOINTS } from "../api/api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        ENDPOINTS.cartItems,
        "GET"
      );

      console.log("Cart response:", response);

      // Your backend returns no data when cart is empty
      if (!response.data) {
        setCart(null);
        return;
      }

      setCart(response.data);
    } catch (error) {
      console.error("Cart error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      setUpdatingProductId(productId);
      setError("");

      const response = await apiRequest(
        ENDPOINTS.cartItems,
        "PUT",
        {
          productId,
          quantity,
        }
      );

      console.log("Cart update response:", response);

      // When last item is removed, backend returns:
      // { success: true, message: "Cart is empty" }
      if (!response.data) {
        setCart(null);
        return;
      }

      setCart(response.data);
    } catch (error) {
      console.error("Cart update error:", error);
      setError(error.message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Cart</h1>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!cart || cart.items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some delicious cakes from the home page.</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.items.map((item) => (
              <div
                className="cart-item"
                key={item.productId}
              >
                <div>
                  <h3>{item.productName}</h3>

                  <p>
                    Price: ₹{item.price}
                  </p>

                  <p>
                    Delivery: {item.estimatedDeliveryTime} hours
                  </p>
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity - 1
                      )
                    }
                    disabled={
                      updatingProductId === item.productId
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity + 1
                      )
                    }
                    disabled={
                      updatingProductId === item.productId
                    }
                  >
                    +
                  </button>
                </div>

                <div>
                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      0
                    )
                  }
                  disabled={
                    updatingProductId === item.productId
                  }
                >
                  {updatingProductId === item.productId
                    ? "Updating..."
                    : "Remove"}
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>
              Total: ₹{cart.totalAmount}
            </h2>

            <button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;