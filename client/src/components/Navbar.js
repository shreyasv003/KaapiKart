import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../assets/context/CartContext';
import { useAuth } from "../assets/context/AuthContext";

const Navbar = () => {
  const { cartItems } = useCart();
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on login or register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't render navbar on authentication pages
  if (isAuthPage) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          KaapiKart
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Home</Button>
              </Link>
              <Link to="/menu" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Menu</Button>
              </Link>
              <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Cart</Button>
              </Link>
              <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Orders</Button>
              </Link>
              <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Profile</Button>
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
                  <Button color="inherit">Admin</Button>
                </Link>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Login</Button>
              </Link>
              <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Sign Up</Button>
              </Link>
            </>
          )}
          {/* Only show cart and profile icons if authenticated and not on auth pages */}
          {isAuthenticated && !isAuthPage && (
            <>
              <IconButton 
                color="inherit" 
                component={Link} 
                to="/cart"
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton 
                color="inherit" 
                component={Link} 
                to="/profile"
                sx={{ ml: 1 }}
              >
                <Person />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 