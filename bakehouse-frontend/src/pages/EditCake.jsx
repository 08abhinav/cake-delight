import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function EditCake() {
const { id } = useParams();
const navigate = useNavigate();

const [formData, setFormData] = useState({
name: "",
description: "",
category: "",
price: "",
availability: "",
estimatedDeliveryTime: "",
image: "",
});

const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
const fetchCake = async () => {
try {
    setLoading(true);
    setError("");

    const response = await apiRequest(
      ENDPOINTS.cakeById(id),
      "GET"
    );

    console.log("Cake to edit:", response);

    const cake = response.data;

    setFormData({
      name: cake.name || "",
      description: cake.description || "",
      category: cake.category || "",
      price: cake.price ?? "",
      availability: cake.availability ?? "",
      estimatedDeliveryTime: cake.estimatedDeliveryTime ?? "",
      image: cake.image || "",
    });
  } catch (error) {
    console.error("Fetch cake error:", error);
    setError(error.message || "Failed to load cake");
  } finally {
    setLoading(false);
  }
};

fetchCake();

}, [id]);

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((previousData) => ({
  ...previousData,
  [name]: value,
}));

};

const handleSubmit = async (e) => {
e.preventDefault();

try {
  setSubmitting(true);
  setError("");

  const payload = {
    ...formData,
    price: Number(formData.price),
    availability: Number(formData.availability),
    estimatedDeliveryTime: Number(formData.estimatedDeliveryTime),
  };

  const response = await apiRequest(
    ENDPOINTS.updateCake(id),
    "PUT",
    payload
  );

  console.log("Update cake response:", response);

  alert(response.message || "Cake updated successfully");

  navigate("/my-cakes");
} catch (error) {
  console.error("Update cake error:", error);
  setError(error.message || "Failed to update cake");
} finally {
  setSubmitting(false);
}

};

if (loading) {
return ( <div className="page-container"> <h2>Loading cake details...</h2> </div>
);
}

return ( <div className="page-container edit-cake-page"> <h1>Edit Cake</h1>

  {error && (
    <p className="error-message">
      {error}
    </p>
  )}

  <form
    className="cake-form"
    onSubmit={handleSubmit}
  >
    <label>
      Cake Name
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Description
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Category
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      />
    </label>

    <div className="cake-form-row">
      <label>
        Price
        <input
          type="number"
          name="price"
          min="1"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Availability
        <input
          type="number"
          name="availability"
          min="0"
          value={formData.availability}
          onChange={handleChange}
          required
        />
      </label>
    </div>

    <label>
      Estimated Delivery Time (Hours)
      <input
        type="number"
        name="estimatedDeliveryTime"
        min="1"
        value={formData.estimatedDeliveryTime}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Image URL
      <input
        type="url"
        name="image"
        value={formData.image}
        onChange={handleChange}
      />
    </label>

    <div className="edit-cake-actions">
      <button
        type="button"
        onClick={() => navigate("/my-cakes")}
        disabled={submitting}
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting
          ? "Updating..."
          : "Update Cake"}
      </button>
    </div>
  </form>
</div>

);
}

export default EditCake;
