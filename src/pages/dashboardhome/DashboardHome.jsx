// admin/src/pages/dashboardhome/dashboradhome.jsx
import React, { useEffect, useState } from 'react';
import './dashboardhome.css'; // Create this CSS file for styling

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    // Example: Fetch data from backend
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          credentials: 'include', // if using cookies
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-home">
      <h1>Admin Dashboard</h1>
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
          <h2>${stats.totalRevenue.toFixed(2)}</h2>
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
