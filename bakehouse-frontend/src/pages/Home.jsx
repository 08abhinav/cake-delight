import { useEffect, useState } from "react";
import { apiRequest, ENDPOINTS } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  const [error, setError] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  const [ratings, setRatings] = useState({});

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchCakes();
  }, []);
  const handleAddToCart = async (productId) => {
    try {
      setAddingProductId(productId);
      setCartMessage("");

      const response = await apiRequest(
        ENDPOINTS.cartItems,
        "POST",
        {
          productId,
          quantity: 1,
        }
      );

      console.log("Add to cart response:", response);

      setCartMessage(
        response.message || "Item added to cart"
      );

    } catch (error) {
      console.error("Add to cart error:", error);

      setCartMessage(
        error.message || "Failed to add item to cart"
      );

    } finally {
      setAddingProductId(null);
    }
  };

  const fetchRatings = async (cakeData) => {
    try {
      const ratingResults = await Promise.all(
        cakeData.map(async (cake) => {
          try {
            const response = await apiRequest(
              ENDPOINTS.averageRating(cake._id),
              "GET"
            );

            console.log(
              `Rating response for ${cake.name}:`,
              response
            );

            return {
              productId: cake._id,
              averageRating:
                response.averageRating ?? 0,
              totalRatings:
                response.totalRatings ?? 0,
            };

          } catch (error) {

            // 404 means nobody has rated this cake yet.
            console.log(
              `No rating found for ${cake.name}`
            );

            return {
              productId: cake._id,
              averageRating: 0,
              totalRatings: 0,
            };
          }
        })
      );

      const ratingMap = {};

      ratingResults.forEach((rating) => {
        ratingMap[rating.productId] = {
          averageRating: rating.averageRating,
          totalRatings: rating.totalRatings,
        };
      });

      console.log("Rating map:", ratingMap);

      setRatings(ratingMap);

    } catch (error) {
      console.error(
        "Rating fetch error:",
        error
      );
    }
  };

  const fetchCakes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        ENDPOINTS.allCakes,
        "GET"
      );

      console.log(
        "Cake API response:",
        response
      );

      const cakeData = response.data || [];

      setCakes(cakeData);

      // Fetch ratings for all cakes
      if (cakeData.length > 0) {
        await fetchRatings(cakeData);
      } else {
        setRatings({});
      }

    } catch (error) {
      console.error(
        "Cake fetch error:",
        error
      );

      setError(
        error.message || "Unable to load cakes"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleFilter = async () => {
    try {
      setFilterLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.name.trim()) {
        params.append(
          "name",
          filters.name.trim()
        );
      }

      if (filters.category.trim()) {
        params.append(
          "category",
          filters.category.trim()
        );
      }

      if (filters.minPrice !== "") {
        params.append(
          "minPrice",
          filters.minPrice
        );
      }

      if (filters.maxPrice !== "") {
        params.append(
          "maxPrice",
          filters.maxPrice
        );
      }

      const queryString = params.toString();

      const endpoint = queryString
        ? `${ENDPOINTS.filterCakes}?${queryString}`
        : ENDPOINTS.filterCakes;

      console.log(
        "Filter request:",
        endpoint
      );

      const response = await apiRequest(
        endpoint,
        "GET"
      );

      console.log(
        "Filter response:",
        response
      );

      const filteredCakes =
        response.data || [];

      setCakes(filteredCakes);

      if (filteredCakes.length > 0) {
        await fetchRatings(filteredCakes);
      } else {
        setRatings({});
      }

    } catch (error) {
      console.error(
        "Filter error:",
        error
      );

      setError(
        error.message ||
        "Unable to filter cakes"
      );

    } finally {
      setFilterLoading(false);
    }
  };
  const handleResetFilters = async () => {
    setFilters({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });

    await fetchCakes();
  };

  if (loading) {
    return (
      <h2 className="status-message">
        Loading cakes...
      </h2>
    );
  }
  if (error) {
    return (
      <div className="status-message">

        <h2>
          Unable to load cakes
        </h2>

        <p>{error}</p>

        <button onClick={fetchCakes}>
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="page-container">

      <h1>Our Cakes</h1>
      <div className="filter-container">

        <input
          type="text"
          name="name"
          placeholder="Search cake..."
          value={filters.name}
          onChange={handleFilterChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
        />

        <input
          type="number"
          name="minPrice"
          placeholder="Min price"
          min="0"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max price"
          min="0"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />

        <button
          onClick={handleFilter}
          disabled={filterLoading}
        >
          {filterLoading
            ? "Filtering..."
            : "Apply Filters"}
        </button>

        <button
          type="button"
          onClick={handleResetFilters}
        >
          Reset
        </button>

      </div>
      {cartMessage && (
        <p className="cart-message">
          {cartMessage}
        </p>
      )}

      {cakes.length === 0 ? (

        <p>
          No cakes found matching your filters.
        </p>

      ) : (

        <div className="cake-grid">

          {cakes.map((cake) => {

            const cakeRating =
              ratings[cake._id];

            return (

              <div
                className="cake-card"
                key={cake._id}
              >

                {/* IMAGE */}

                <img
                  src={cake.image}
                  alt={cake.name}
                  className="cake-image"
                />

                {/* NAME */}

                <h2>
                  {cake.name}
                </h2>

                {/* RATING */}

                <div className="cake-rating">

                  {cakeRating &&
                  cakeRating.totalRatings > 0 ? (

                    <>

                      <span className="rating-stars">
                        ⭐
                      </span>

                      <span className="rating-value">
                        {cakeRating.averageRating}
                      </span>

                      <span className="rating-count">
                        (
                        {cakeRating.totalRatings}{" "}
                        {cakeRating.totalRatings === 1
                          ? "rating"
                          : "ratings"}
                        )
                      </span>

                    </>

                  ) : (

                    <span className="no-rating">
                      No ratings yet
                    </span>

                  )}

                </div>

                {/* DESCRIPTION */}

                <p className="description">
                  {cake.description}
                </p>

                {/* CATEGORY */}

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {cake.category}
                </p>

                {/* PRICE */}

                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  ₹{cake.price}
                </p>

                {/* AVAILABILITY */}

                <p>
                  <strong>
                    Available:
                  </strong>{" "}
                  {cake.availability}
                </p>

                {/* DELIVERY */}

                <p>
                  <strong>
                    Delivery:
                  </strong>{" "}
                  {cake.estimatedDeliveryTime}{" "}
                  hours
                </p>

                {/* BUYER */}

                {user?.role === "buyer" && (

                  <button
                    onClick={() =>
                      handleAddToCart(
                        cake._id
                      )
                    }
                    disabled={
                      addingProductId ===
                      cake._id
                    }
                  >

                    {addingProductId ===
                    cake._id
                      ? "Adding..."
                      : "Add to Cart"}

                  </button>

                )}

                {/* NOT SIGNED IN */}

                {!user && (

                  <button
                    onClick={() =>
                      alert(
                        "Please sign in to add items to your cart"
                      )
                    }
                  >
                    Sign in to Add to Cart
                  </button>

                )}

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}

export default Home;