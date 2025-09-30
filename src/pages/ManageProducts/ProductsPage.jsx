import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductsPage.css'; // with an 's'

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    image: '',
    vendorId: '',
    countInStock: 0,
    description: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Product updated!');
        navigate('/dashboard/products');
      } else {
        alert('❌ Error: ' + data.message || 'Failed to update.');
      }
    } catch (err) {
      console.error('Update error', err);
    }
  };

  return (
    <div className="edit-product-page">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label>Name</label>
        <input name="name" value={product.name} onChange={handleChange} required />

        <label>Price</label>
        <input name="price" type="number" value={product.price} onChange={handleChange} required />

        <label>Image URL</label>
        <input name="image" value={product.image} onChange={handleChange} required />

        <label>Stock</label>
        <input name="countInStock" type="number" value={product.countInStock} onChange={handleChange} required />

        <label>Vendor ID</label>
        <input name="vendorId" value={product.vendorId} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={product.description} onChange={handleChange}></textarea>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductPage;
