import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import API from "../../adminapi";
import "./CreateProductPage.css";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { admin, loading: adminLoading } = useContext(AdminContext);

  // Step 1: Image
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  // Step 2: Product info
  const [details, setDetails] = useState({
    name: "",
    price: "",
    vendorId: "",
    description: "",
  });

  // Step 3: Final
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // Handle inputs
  // -----------------------------
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // 1️⃣ Upload Image
  // -----------------------------
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return setError("Please select an image.");

    setError("");
    setLoadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await API.post("/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.filename) {
        setUploadedImageName(res.data.filename);
        setSuccess(`✅ Image uploaded: ${res.data.filename}`);
        console.log("✅ Uploaded image filename:", res.data.filename);
      } else {
        throw new Error("No filename returned from server");
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError("Image upload failed.");
    } finally {
      setLoadingImage(false);
    }
  };

  // -----------------------------
  // 3️⃣ Final Submit
  // -----------------------------
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedImageName) return setError("Please upload an image first.");

    setLoadingSubmit(true);
    setError("");
    setSuccess("");

    const productData = { ...details, image: uploadedImageName };

    try {
      const res = await API.post("/api/products", productData);
      setSuccess("✅ Product created successfully!");
      console.log("✅ Product created:", res.data);

      // Reset form
      setDetails({ name: "", price: "", vendorId: "", description: "" });
      setUploadedImageName("");
      setImageFile(null);

      // Redirect
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Failed to create product:", err);
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (adminLoading) return <p>Loading admin info...</p>;
  if (!admin) return <p>Access denied. Only admins can create products.</p>;

  return (
    <div className="create-product-page">
      <div className="create-product-box">
        <h2>🛒 Create New Product</h2>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        {/* STEP 1: Upload Image */}
        <form onSubmit={handleImageUpload} className="image-upload-form">
          <h3>1️⃣ Upload Image</h3>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="preview"
              width="120"
              style={{ marginTop: "10px", borderRadius: "4px" }}
            />
          )}
          <button type="submit" disabled={loadingImage}>
            {loadingImage ? "Uploading..." : "Upload Image"}
          </button>
          {uploadedImageName && <p>✅ Image saved as: {uploadedImageName}</p>}
        </form>

        <hr style={{ margin: "25px 0" }} />

        {/* STEP 2: Product Details */}
        <form className="product-details-form">
          <h3>2️⃣ Enter Product Details</h3>
          <label>Name</label>
          <input name="name" value={details.name} onChange={handleDetailChange} required />

          <label>Price</label>
          <input
            name="price"
            type="number"
            value={details.price}
            onChange={handleDetailChange}
            required
          />

          <label>Vendor ID</label>
          <input name="vendorId" value={details.vendorId} onChange={handleDetailChange} required />

          <label>Description</label>
          <textarea
            name="description"
            value={details.description}
            onChange={handleDetailChange}
            placeholder="Enter a short description..."
          ></textarea>
        </form>

        <hr style={{ margin: "25px 0" }} />

        {/* STEP 3: Submit Product */}
        <form onSubmit={handleFinalSubmit} className="final-submit-form">
          <h3>3️⃣ Submit Product</h3>
          <p><strong>Image:</strong> {uploadedImageName || "No image uploaded"}</p>
          <p><strong>Name:</strong> {details.name || "Not set"}</p>
          <p><strong>Price:</strong> {details.price || "Not set"}</p>
          <p><strong>Vendor:</strong> {details.vendorId || "Not set"}</p>

          <button
            type="submit"
            disabled={loadingSubmit || !uploadedImageName || !details.name}
          >
            {loadingSubmit ? "Submitting..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
