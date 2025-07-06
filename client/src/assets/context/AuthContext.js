import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Update the API URL to ensure it's correctly configured
const API_URL = 'http://localhost:5002/api';

// Create Context
const AuthContext = createContext();

// AuthProvider component to wrap your app
const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: true
  });

  useEffect(() => {
    // Check if a token is present in localStorage and validate it
    const token = localStorage.getItem("token");
    if (token) {
      // If a token exists, fetch user details
      axios
        .get(`${API_URL}/auth/verifyToken`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setAuthState({
            isAuthenticated: true,
            token,
            user: response.data.user,
            loading: false
          });
        })
        .catch((error) => {
          console.error('Token verification error:', error);
          // If token is invalid, clear it
          localStorage.removeItem("token");
          setAuthState({
            isAuthenticated: false,
            token: null,
            user: null,
            loading: false
          });
        });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      console.log('=== Registration Process Started ===');
      console.log('Attempting registration with:', { name, email });
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      console.log('Registration response:', response.data);
      
      // Registration successful - don't auto-login, let user go to login page
      return response.data;
    } catch (error) {
      console.error('=== Registration Error ===');
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        throw new Error('No response from server. Please try again.');
      } else {
        throw new Error('An error occurred during registration.');
      }
    }
  };

  const login = async (email, password) => {
    try {
      console.log('=== Login Process Started ===');
      console.log('Attempting login with:', { email });
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response received:', {
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user
      });

      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token in localStorage
      localStorage.setItem("token", token);
      setAuthState({
        isAuthenticated: true,
        token,
        user,
        loading: false
      });
      
      console.log('Login successful:', {
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      });
      
      return response.data;
    } catch (error) {
      console.error('=== Login Error ===');
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message || 'An error occurred during login');
      }
    }
  };

  const logout = () => {
    // Clear token and user state
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext in components
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
