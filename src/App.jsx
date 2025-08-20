
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SecondNavbar from "./components/SecondNavbar";
import Footer from "./components/Footer";
import Home from "./pages/Home"; 
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminAddProduct from "./pages/AdminAddProduct";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const key = localStorage.getItem('ADMIN_API_KEY') || '';
        const jwt = localStorage.getItem('JWT_TOKEN') || '';
        const headers = {};
        if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
        if (key) headers['x-admin-key'] = key;
        if (!jwt && !key) return setAllowed(false);
        await axios.get('/api/admin/verify', { headers });
        setAllowed(true);
      } catch {
        setAllowed(false);
      }
    })();
  }, []);
  if (allowed === null) return <div className="p-8 text-center">Checking admin authorization...</div>;
  if (!allowed) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <SecondNavbar />
      <div className="text-[15px] sm:text-base">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products/new" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<div className="p-8 text-center">Page Not Found</div>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
