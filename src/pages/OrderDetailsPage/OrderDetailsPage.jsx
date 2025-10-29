import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../adminapi"; // ✅ Import centralized axios instance
import "./OrderDetailsPage.css";

const OrderDetailsPage = () => {
  const { id } = useParams(); // Order ID from URL
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/api/admin/orders/${id}`);
        setOrder(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(
          err.response?.data?.message || "❌ Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ✅ Handle status update
  const handleStatusUpdate = async () => {
    try {
      await API.patch(`/api/admin/orders/${id}/status`, { status });
      alert("✅ Order status updated successfully.");
    } catch (err) {
      console.error("Status update error:", err);
      alert(
        err.response?.data?.message || "❌ Failed to update order status."
      );
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return null;

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>

      <div className="section">
        <h3>Customer Info</h3>
        <p><strong>Name:</strong> {order.user?.name}</p>
        <p><strong>Email:</strong> {order.user?.email}</p>
      </div>

      <div className="section">
        <h3>Shipping Address</h3>
        <p>{order.shippingAddress.street}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.country}
        </p>
        <p>{order.shippingAddress.postalCode}</p>
      </div>

      <div className="section">
        <h3>Products</h3>
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price (UGX)</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, index) => (
              <tr key={index}>
                <td>{item.name || item.productId?.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString()}</td>
                <td>{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total">
          <strong>Total:</strong> UGX {order.totalPrice.toLocaleString()}
        </p>
      </div>

      <div className="section">
        <h3>Status</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={handleStatusUpdate}>Update Status</button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
