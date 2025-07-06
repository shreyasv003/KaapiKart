import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, CardMedia, 
  TextField, Button, Slider, FormControl, InputLabel, 
  Select, MenuItem, Snackbar, Alert, CircularProgress,
  Box, IconButton, CardActions
} from '@mui/material';
import { AddShoppingCart, Add, Remove } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import PageBackground from '../../components/common/PageBackground';
import backgroundImg from '../images/background.jpg';

const API_URL = 'http://localhost:5002/api';

const CoffeeMenu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(200);
  const [category, setCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Starting to fetch products...');
        console.log('API URL:', `${API_URL}/products`);
        const response = await axios.get(`${API_URL}/products`);
        console.log('Products response status:', response.status);
        console.log('Products response data:', response.data);
        setProducts(response.data);
        // Initialize quantities for all products
        const initialQuantities = {};
        response.data.forEach(product => {
          initialQuantities[product._id] = 0;
        });
        setQuantities(initialQuantities);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const currentQuantity = quantities[product._id] || 0;
    if (currentQuantity > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: currentQuantity
      });
      setSnackbar({ open: true, message: `${product.name} added to cart!` });
      // Reset quantity to 0 after adding to cart
      setQuantities(prev => ({
        ...prev,
        [product._id]: 0
      }));
    }
  };

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const filteredItems = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = item.price >= 0 && item.price <= maxPrice;
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesPrice && matchesCategory;
  });

  if (loading) {
    return (
      <PageBackground
        imageUrl={backgroundImg}
        overlayColor="rgba(0, 0, 0, 0.8)"
        blur="0px"
      >
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#fff' }} />
        </Container>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground
        imageUrl={backgroundImg}
        overlayColor="rgba(0, 0, 0, 0.8)"
        blur="0px"
      >
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </PageBackground>
    );
  }

  return (
    <PageBackground
      imageUrl={backgroundImg}
      overlayColor="rgba(0, 0, 0, 0.8)"
      blur="0px"
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        textAlign: 'center', 
        color: '#fff',
        fontWeight: 'bold',
        mb: 4,
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        Our Menu
      </Typography>

      {/* Search and Filter Section */}
      <Card sx={{ mb: 4, bgcolor: 'rgba(70, 70, 70, 0.7)', backdropFilter: 'blur(10px)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 'bold', mb: 3 }}>
            Search & Filter
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(70, 70, 70, 0.7)',
                    color: '#fff !important',
                    '&:hover fieldset': {
                      borderColor: '#8B4513',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B4513',
                    },
                    '&.Mui-focused': {
                      color: '#fff !important',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#fff',
                    '&.Mui-focused': {
                      color: '#fff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff !important',
                    '&:focus': {
                      color: '#fff !important',
                    },
                    '&.Mui-focused': {
                      color: '#fff !important',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff !important',
                    '&:focus': {
                      color: '#fff !important',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom sx={{ color: '#fff', fontWeight: 'medium', mb: 2 }}>
                Max Price: ₹{maxPrice}
              </Typography>
              <Slider
                value={maxPrice}
                onChange={(e, newValue) => setMaxPrice(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={200}
                sx={{
                  color: '#8B4513',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0px 0px 0px 8px rgba(139, 69, 19, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    bgcolor: '#8B4513',
                  },
                  '& .MuiSlider-rail': {
                    bgcolor: '#ddd',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: '#fff',
                  '&.Mui-focused': {
                    color: '#fff',
                  },
                }}>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                    bgcolor: 'rgba(70, 70, 70, 0.7)',
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      '&:hover': {
                        borderColor: '#8B4513',
                      },
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8B4513',
                    },
                    '& .MuiSelect-icon': {
                      color: '#fff',
                    },
                    '&.Mui-focused': {
                      color: '#fff',
                    },
                    '& .MuiSelect-select': {
                      color: '#fff',
                      '&:focus': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Hot">Hot Coffee</MenuItem>
                  <MenuItem value="Cold">Cold Coffee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'rgba(70, 70, 70, 0.7)',
              color: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
              },
            }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
                sx={{
                  objectFit: 'cover',
                  borderBottom: '1px solid #eee',
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  color: '#fff',
                  mb: 1
                }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.85, mb: 2 }}>
                  {item.description}
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  color: '#fff',
                  mb: 2
                }}>
                  ₹{item.price}
                </Typography>
                <CardActions>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item._id, -1)}
                      disabled={quantities[item._id] <= 0}
                      sx={{ color: '#fff' }}
                    >
                      <Remove sx={{ color: '#fff' }} />
                    </IconButton>
                    <Typography>{quantities[item._id] || 0}</Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item._id, 1)}
                      sx={{ color: '#fff' }}
                    >
                      <Add sx={{ color: '#fff' }} />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(item)}
                    disabled={quantities[item._id] <= 0}
                    startIcon={<AddShoppingCart />}
                    sx={{
                      opacity: quantities[item._id] <= 0 ? 0.5 : 1,
                      visibility: 'visible',
                      display: 'inline-flex',
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
      </Container>
    </PageBackground>
  );
};

export default CoffeeMenu; 