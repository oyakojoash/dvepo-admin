import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../adminapi'; // ✅ use centralized admin API instance
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Automatically includes baseURL + cookies
        await API.get('/api/admin/me');
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
      await API.post('/api/auth/logout', {}); // ✅ uses same instance
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
