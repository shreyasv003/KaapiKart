import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../assets/context/AuthContext';
import App from '../App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const axios = require('axios');

describe('Authentication Persistence', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should redirect to home when user is authenticated and visits root path', async () => {
    // Mock a valid token in localStorage
    const mockToken = 'valid-token-123';
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false
    };

    localStorage.setItem('token', mockToken);

    // Mock successful token verification
    axios.get.mockResolvedValueOnce({
      data: { user: mockUser }
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for authentication check to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5002/api/auth/verifyToken',
        {
          headers: { Authorization: `Bearer ${mockToken}` }
        }
      );
    });

    // The app should redirect to /home when authenticated
    await waitFor(() => {
      expect(window.location.pathname).toBe('/home');
    });
  });

  test('should redirect to login when no token is present', async () => {
    // No token in localStorage

    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    // Should redirect to login page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('should clear invalid token and redirect to login', async () => {
    // Mock an invalid token in localStorage
    const mockToken = 'invalid-token-123';
    localStorage.setItem('token', mockToken);

    // Mock failed token verification
    axios.get.mockRejectedValueOnce(new Error('Invalid token'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for authentication check to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5002/api/auth/verifyToken',
        {
          headers: { Authorization: `Bearer ${mockToken}` }
        }
      );
    });

    // Token should be cleared from localStorage
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
    });

    // Should redirect to login page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });
}); 