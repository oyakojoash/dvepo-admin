import React, { useEffect, useState } from 'react';
import './ManageVendors.css';

export default function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id: '',
    name: '',
    logo: '',
    description: '',
  });

  // ✅ Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vendors');
      if (!res.ok) throw new Error('Failed to fetch vendors');
      const data = await res.json();
      setVendors(data);
    } catch (err) {
      console.error(err);
      setError('Could not load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add Vendor
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to add vendor');
      const newVendor = await res.json();
      setVendors((prev) => [...prev, newVendor]);
      setForm({ id: '', name: '', logo: '', description: '' });
    } catch (err) {
      alert('Error adding vendor');
      console.error(err);
    }
  };

  // ✅ Delete Vendor
  const handleDelete = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/vendors/${_id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete vendor');
      setVendors((prev) => prev.filter((v) => v._id !== _id));
    } catch (err) {
      alert('Error deleting vendor');
      console.error(err);
    }
  };

  return (
    <div className="manage-vendors">
      <h1>Vendor Management</h1>

      {/* Add Vendor Form */}
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

      {/* Vendor Table */}
      {loading ? (
        <p>Loading vendors...</p>
      ) : error ? (
        <p className="error">{error}</p>
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
                    src={`http://localhost:5000/${vendor.logo}`}
                    alt={vendor.name}
                    className="vendor-logo"
                  />
                </td>
                <td>{vendor.name}</td>
                <td>{vendor.description}</td>
                <td>
                  <button onClick={() => handleDelete(vendor._id)} className="delete-button">
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
}
