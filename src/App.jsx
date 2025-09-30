import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout/AdminLayout';
import AdminDashboard from './pages/dashboardhome/DashboardHome';
import ManageUsers from './pages/ManageUser/ManageUser';
import ManageOrders from './pages/ManageOrders/ManageOrders';
import ManageVendor from './pages/ManageVendors/ManageVendors';
import ManageProducts from './pages/ManageProducts/ProductsPage';
import CreateProduct from './pages/ManageProducts/CreateProductPage';
import AdminLogin from './pages/adminlogin/AdminLogin';
import OrderDetailsPage from './pages/OrderDetailsPage/OrderDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Public admin login route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="vendors" element={<ManageVendor />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
