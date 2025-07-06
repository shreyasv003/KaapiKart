import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await login(formData.email, formData.password);
        if (response.user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(err.message || 'An error occurred during login');
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              required
              fullWidth
              label="Admin Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In as Admin'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Not an admin?
              </Typography>
              <Button
                component={Link}
                to="/login"
                color="primary"
                variant="text"
              >
                Go to User Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLoginPage; 