import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../api/api";

function AddCake() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    availability: "",
    estimatedDeliveryTime: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

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

      if (!imageFile) {
        setError("Please select a cake image");
        return;
      }

      // IMPORTANT:
      // File uploads must use FormData, not JSON.
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("price", Number(formData.price));
      payload.append("availability", Number(formData.availability));
      payload.append(
        "estimatedDeliveryTime",
        Number(formData.estimatedDeliveryTime)
      );

      // This name MUST match upload.single("image")
      payload.append("image", imageFile);

      const response = await apiRequest(
        ENDPOINTS.addCake,
        "POST",
        payload
      );

      console.log("Add cake response:", response);

      alert(response.message || "Cake added successfully");

      navigate("/my-cakes");

    } catch (error) {
      console.error("Add cake error:", error);
      setError(error.message || "Failed to add cake");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container add-cake-page">

      <h1>Add New Cake</h1>

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
            placeholder="Enter cake name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description

          <textarea
            name="description"
            placeholder="Describe the cake"
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
            placeholder="Example: birthday, eggless"
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
              placeholder="Enter price"
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
              placeholder="Available quantity"
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
            placeholder="Example: 4"
            min="1"
            value={formData.estimatedDeliveryTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Cake Image

          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
            }}
            required
          />
        </label>

        {imageFile && (
          <p>
            Selected image: <strong>{imageFile.name}</strong>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding Cake..." : "Add Cake"}
        </button>

      </form>

    </div>
  );
}

export default AddCake;