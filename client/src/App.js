import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from "./assets/context/CartContext";
import { AuthProvider, useAuth } from "./assets/context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./assets/pages/Home";
import CoffeeMenu from "./assets/pages/CoffeeMenu";
import CartPage from "./assets/pages/CartPage";
import LoginPage from "./assets/pages/LoginPage";
import AdminLoginPage from "./assets/pages/AdminLoginPage";
import RegisterPage from "./assets/pages/RegisterPage";
import OrdersPage from "./assets/pages/OrdersPage";
import ProfilePage from "./assets/pages/ProfilePage";
import HomePage from './assets/pages/HomePage';
import PaymentPage from './assets/pages/PaymentPage';
import Dashboard from './components/admin/Dashboard';
import theme from './theme';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { authState, loading } = useAuth();
  const { isAuthenticated, user } = authState;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const { authState } = useAuth();
  const { isAuthenticated, loading } = authState;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login';

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          } 
        />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/menu" element={<PrivateRoute><CoffeeMenu /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute adminOnly>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
  );
};

export default App;
