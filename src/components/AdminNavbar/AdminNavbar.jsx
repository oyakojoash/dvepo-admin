import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5000/api/admin/me', {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    navigate('/admin/login');
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="admin-navbar">
      <h2 className="admin-navbar-title">Admin Dashboard</h2>
      <div className="admin-navbar-actions">
        {isLoggedIn && <span className="admin-navbar-user">Logged in as Admin</span>}
        <button
          onClick={isLoggedIn ? handleLogout : handleLogin}
          className="admin-navbar-button"
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
