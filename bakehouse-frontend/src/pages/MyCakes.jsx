import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function MyCakes() {
const navigate = useNavigate();

const [cakes, setCakes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchMyCakes = async () => {
try {
setLoading(true);
setError("");

  const response = await apiRequest(
    ENDPOINTS.myCakes,
    "GET"
  );

  console.log("My cakes response:", response);

  setCakes(response.data || []);

} catch (error) {
  console.error("My cakes error:", error);
  setError(error.message || "Failed to fetch cakes");
} finally {
  setLoading(false);
}

};

useEffect(() => {
fetchMyCakes();
}, []);

const handleDelete = async (cakeId) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this cake?"
);

if (!confirmDelete) {
  return;
}

try {
  await apiRequest(
    ENDPOINTS.deleteCake(cakeId),
    "DELETE"
  );

  setCakes((previousCakes) =>
    previousCakes.filter(
      (cake) => cake._id !== cakeId
    )
  );

} catch (error) {
  console.error("Delete cake error:", error);
  alert(error.message || "Failed to delete cake");
}

};

if (loading) {
return ( <div className="page-container"> <h2>Loading your cakes...</h2> </div>
);
}

return ( 
<div className="page-container my-cakes-page"> 
  <div className="my-cakes-header"> 
    <div> 
      <h1>My Cakes</h1> 
      <p>Manage all the cakes you have added.</p> 
    </div>

    <button
      onClick={() => navigate("/add-cake")}
    >
      Add New Cake
    </button>
  </div>

  {error && (
    <p className="error-message">
      {error}
    </p>
  )}

  {!error && cakes.length === 0 && (
    <div className="empty-cakes">
      <h2>No cakes found</h2>
      <p>You haven't added any cakes yet.</p>

      <button
        onClick={() => navigate("/add-cake")}
      >
        Add Your First Cake
      </button>
    </div>
  )}

  <div className="my-cakes-grid">
    {cakes.map((cake) => (
      <div
        className="my-cake-card"
        key={cake._id}
      >
        {cake.image ? (
          <img
            src={cake.image}
            alt={cake.name}
            className="my-cake-image"
          />
        ) : (
          <div className="my-cake-no-image">
            No Image Available
          </div>
        )}

        <div className="my-cake-content">
          <h2>{cake.name}</h2>

          <p className="my-cake-description">
            {cake.description}
          </p>

          <div className="my-cake-details">
            <p>
              <strong>Category:</strong>{" "}
              {cake.category}
            </p>

            <p>
              <strong>Price:</strong> ₹{cake.price}
            </p>

            <p>
              <strong>Available:</strong>{" "}
              {cake.availability}
            </p>

            <p>
              <strong>Delivery Time:</strong>{" "}
              {cake.estimatedDeliveryTime} hours
            </p>
          </div>

          <div className="my-cake-actions">
            <button
              onClick={() =>
                navigate(`/edit-cake/${cake._id}`)
              }
            >
              Edit
            </button>

            <button
              onClick={() =>
                handleDelete(cake._id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

);
}

export default MyCakes;
