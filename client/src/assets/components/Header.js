import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Kaapikart
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link to="/menu" style={{ color: "white", textDecoration: "none" }}>
            <Button color="inherit">Menu</Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Cart</Button>
              </Link>
              <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Orders</Button>
              </Link>
              <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Profile</Button>
              </Link>
              <Button color="inherit" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Login</Button>
              </Link>
              <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>
                <Button color="inherit">Sign Up</Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
