import React, { useEffect, useState } from 'react';
import API from '../../adminapi'; // ✅ use the centralized admin API instance
import './dashboardhome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Use axios instance from adminapi.js
        const res = await API.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setError('❌ Failed to load dashboard statistics');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-home">
      <h1>Admin Dashboard</h1>

      {error && <p className="error-msg">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h2>${stats.totalRevenue?.toFixed(2) || 0}</h2>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h2>{stats.totalProducts}</h2>
          <p>Products Listed</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
