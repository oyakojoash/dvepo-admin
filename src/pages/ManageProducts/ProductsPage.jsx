import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../adminapi'; // ✅ Import axios instance
import './ProductsPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    image: '',
    countInStock: 1,
    vendorId: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fetch product details on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products/${id}`);
        setProduct({
          ...res.data,
          countInStock: res.data.countInStock || 1,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError(
          err.response?.data?.message || '❌ Failed to load product details.'
        );
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'countInStock' ? Number(value) : value,
    }));
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.put(`/api/products/${id}`, product);
      alert('✅ Product updated successfully!');
      navigate('/dashboard/products');
    } catch (err) {
      console.error('Update error:', err);
      setError(
        err.response?.data?.message || '❌ Failed to update product. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product-page">
      <h1>Edit Product</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label>Name</label>
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <label>Price</label>
        <input
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          name="image"
          value={product.image}
          onChange={handleChange}
          required
        />

        <label>Stock</label>
        <input
          name="countInStock"
          type="number"
          value={product.countInStock}
          onChange={handleChange}
          required
        />

        <label>Vendor ID</label>
        <input
          name="vendorId"
          value={product.vendorId}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
