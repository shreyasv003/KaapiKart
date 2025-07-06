import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../../components/common/PageBackground';
import cartBg from '../images/cart-bg.jpg';

const API_URL = 'http://localhost:5002/api';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const { authState } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Navigate to payment page instead of directly creating order
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    return (
      <PageBackground
        imageUrl={cartBg}
        overlayColor="rgba(0, 0, 0, 0.85)"
        blur="0px"
      >
        <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/menu')}
            sx={{ mt: 2 }}
          >
            Browse Menu
          </Button>
        </Container>
      </PageBackground>
    );
  }

  return (
    <PageBackground
      imageUrl={cartBg}
      overlayColor="rgba(0, 0, 0, 0.85)"
      blur="0px"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          Your Cart
        </Typography>
        {!authState.isAuthenticated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please log in to complete your purchase.
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item._id} sx={{ mb: 2, bgcolor: 'rgba(70, 70, 70, 0.7)', color: '#fff' }}>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6" sx={{ color: '#fff' }}>{item.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', opacity: 0.85 }}>
                        {item.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          sx={{ color: '#fff' }}
                        >
                          <Remove sx={{ color: '#fff' }} />
                        </IconButton>
                        <Typography sx={{ mx: 2, color: '#fff' }}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          sx={{ color: '#fff' }}
                        >
                          <Add sx={{ color: '#fff' }} />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'rgba(70, 70, 70, 0.7)', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: '#fff' }}>Subtotal</Typography>
                  <Typography sx={{ color: '#fff' }}>₹{getTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: '#fff' }}>Delivery Fee</Typography>
                  <Typography sx={{ color: '#fff' }}>₹40.00</Typography>
                </Box>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>Total</Typography>
                  <Typography variant="h6" sx={{ color: '#fff' }}>₹{(getTotal() + 40).toFixed(2)}</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  sx={{ mt: 2 }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageBackground>
  );
};

export default CartPage;
