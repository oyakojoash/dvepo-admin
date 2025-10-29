import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import API from '../../adminapi'; // ✅ use centralized API
import './AdminLayout.css';

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Use API instance (handles cookies + baseURL)
        await API.get('/api/admin/me');
        setLoading(false);
      } catch (err) {
        console.error('Admin auth check failed:', err);
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading admin panel...</div>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <AdminSidebar />
      </aside>

      <main className="admin-main">
        <AdminNavbar />
        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
