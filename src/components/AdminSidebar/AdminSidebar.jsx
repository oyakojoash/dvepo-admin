import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manage Orders', path: '/admin/orders' },
    { name: 'Manage Products', path: '/admin/products' },
    { name: 'Create Product', path: '/admin/products/create' },
    { name: 'Manage Vendors', path: '/admin/vendors' },
    { name: 'Manage Users', path: '/admin/users' }, // ✅ Fixed path
  ];

  return (
    <aside className="admin-sidebar">
      <h1 className="admin-sidebar-title">Admin Panel</h1>
      <nav>
        <ul className="admin-sidebar-nav">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `admin-sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
