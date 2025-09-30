import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProductPage.css';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    vendorId: '',
    countInStock: 0,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ensures cookie-based auth works
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Product created!');
        navigate('/dashboard/products');
      } else {
        alert('❌ Error: ' + (data.message || data.errors?.[0]?.msg || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to create product', err);
    }
  };

  return (
    <div className="create-product-page">
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit} className="create-product-form">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} required />

        <label>Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} required />

        <label>Stock</label>
        <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} required />

        <label>Vendor ID</label>
        <input name="vendorId" value={form.vendorId} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProductPage;
