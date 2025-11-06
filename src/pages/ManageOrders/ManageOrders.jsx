import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ManageOrders.css";
import API from "../../adminapi";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("/api/admin/orders", {
        withCredentials: true, // ✅ ensures cookie is sent
      });
      setOrders(res.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message;

      setError("Failed to fetch orders. Are you logged in as admin?");
      console.error("Fetch orders failed:", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // ✅ Search and Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="manage-orders-container">
      <div className="manage-orders-header">
        <h1 className="manage-orders-title">Manage Orders</h1>
      </div>

      {/* 🔍 Search & Filter Row */}
      <div className="search-filter-row">
        <input
          type="text"
          placeholder="Search by Customer or Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* 📦 Orders Table or Status */}
      {loading ? (
        <p className="loading-text">Loading orders...</p>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders-text">No matching orders found.</div>
      ) : (
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || "N/A"}</td>
                  <td>UGX {order.totalPrice.toLocaleString()}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="view-button"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
