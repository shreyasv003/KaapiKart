import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers();
      fetchProducts();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (!user?.isAdmin) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Access denied. Admin privileges required.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Users
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Products
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage;