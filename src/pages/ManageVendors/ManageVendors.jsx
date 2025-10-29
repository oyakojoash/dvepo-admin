import React, { useEffect, useState } from "react";
import API from "../../adminapi"; // ✅ Use centralized axios instance
import "./ManageVendors.css";

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    logo: "",
    description: "",
  });

  // ✅ Fetch all vendors
  const fetchVendors = async () => {
    try {
      const res = await API.get("/api/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch vendors:", err);
      setError(err.response?.data?.message || "❌ Could not load vendors");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial data fetch
  useEffect(() => {
    fetchVendors();
  }, []);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add new vendor
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/vendors", form);
      setVendors((prev) => [...prev, res.data]);
      setForm({ id: "", name: "", logo: "", description: "" });
    } catch (err) {
      console.error("❌ Error adding vendor:", err);
      alert(err.response?.data?.message || "Error adding vendor");
    }
  };

  // ✅ Delete vendor
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await API.delete(`/api/vendors/${_id}`);
      setVendors((prev) => prev.filter((v) => v._id !== _id));
    } catch (err) {
      console.error("❌ Error deleting vendor:", err);
      alert(err.response?.data?.message || "Error deleting vendor");
    }
  };

  return (
    <div className="manage-vendors">
      <h2>🏢 Manage Vendors</h2>

      {error && <p className="error-msg">{error}</p>}

      {/* ✅ Add Vendor Form */}
      <form className="vendor-form" onSubmit={handleAddVendor}>
        <input
          name="id"
          placeholder="Vendor ID (e.g. vendor1)"
          value={form.id}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="logo"
          placeholder="Logo path (e.g. vendors/logo.png)"
          value={form.logo}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Vendor</button>
      </form>

      {/* ✅ Vendor Table */}
      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length === 0 ? (
        <p>No vendors found.</p>
      ) : (
        <table className="vendor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id}>
                <td>{vendor.id}</td>
                <td>
                  <img
                    src={`${API.defaults.baseURL.replace("/api", "")}/${vendor.logo}`}
                    alt={vendor.name}
                    className="vendor-logo"
                  />
                </td>
                <td>{vendor.name}</td>
                <td>{vendor.description}</td>
                <td>
                  <button
                    onClick={() => handleDelete(vendor._id)}
                    className="delete-button"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageVendors;
