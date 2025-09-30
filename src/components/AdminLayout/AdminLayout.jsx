import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';
import './AdminLayout.css';

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5000/api/admin/me', {
          withCredentials: true,
        });
        setLoading(false);
      } catch (err) {
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
