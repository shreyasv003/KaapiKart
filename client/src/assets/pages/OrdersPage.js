import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Button,
  useTheme,
  Paper,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  AccessTime as TimeIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';
import PageBackground from '../../components/common/PageBackground';
import ordersBg from '../images/orders-bg.jpg';
import { downloadInvoice } from '../../utils/invoiceGenerator';
import { downloadSimpleInvoice } from '../../utils/simpleInvoiceGenerator';
import { downloadImprovedInvoice } from '../../utils/improvedInvoiceGenerator';

const API_URL = 'http://localhost:5002/api';

const OrderStatus = ({ status }) => {
  const theme = useTheme();
  
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'warning',
          icon: <TimeIcon />,
          label: 'Pending',
          bgColor: alpha(theme.palette.warning.main, 0.15),
          textColor: theme.palette.warning.dark,
        };
      case 'processing':
        return {
          color: 'info',
          icon: <ShippingIcon />,
          label: 'Processing',
          bgColor: alpha(theme.palette.info.main, 0.15),
          textColor: theme.palette.info.dark,
        };
      case 'completed':
        return {
          color: 'success',
          icon: <CheckCircleIcon />,
          label: 'Delivered',
          bgColor: 'rgba(76, 175, 80, 0.2)',
          textColor: '#43a047',
        };
      case 'cancelled':
        return {
          color: 'error',
          icon: <CancelIcon />,
          label: 'Cancelled',
          bgColor: alpha(theme.palette.error.main, 0.15),
          textColor: theme.palette.error.dark,
        };
      default:
        return {
          color: 'default',
          icon: <TimeIcon />,
          label: 'Unknown',
          bgColor: alpha(theme.palette.grey[500], 0.15),
          textColor: theme.palette.grey[700],
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      sx={{
        bgcolor: config.bgColor,
        color: config.textColor,
        fontWeight: 'bold',
        '& .MuiChip-icon': {
          color: config.textColor,
        },
      }}
    />
  );
};

const OrderCard = ({ order, authState }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        mb: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        bgcolor: 'rgba(70, 70, 70, 0.7)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          {/* Order Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#fff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}>
                  Order #{order._id.slice(-6)}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                }}>
                  Placed on {formatDate(order.paidAt)}
                </Typography>
              </Box>
              <OrderStatus status={order.isPaid ? 'completed' : 'pending'} />
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'rgba(70, 70, 70, 0.7)',
              p: 2,
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  color: '#fff',
                  fontWeight: 600,
                }}>
                  Total Items
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  color: '#fff',
                  fontWeight: 600,
                }}>
                  Total Amount
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                  ₹{order.total.toFixed(2)}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<ExpandMoreIcon sx={{ 
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }} />}
                  onClick={handleExpandClick}
                  sx={{
                    bgcolor: '#8B4513',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#6b2e0a',
                    },
                  }}
                >
                  {expanded ? 'Hide Details' : 'View Details'}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Order Details */}
          <Grid item xs={12}>
            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  color: '#fff',
                }}>
                  Order Details
                </Typography>
                
                {/* Items List */}
                <Paper elevation={0} sx={{ 
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  {order.items.map((item, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                          }}>
                            {item.product?.name || 'Product'}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: alpha(theme.palette.text.secondary, 0.9),
                            fontWeight: 500,
                          }}>
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                      {index < order.items.length - 1 && (
                        <Divider sx={{ my: 1, borderColor: alpha(theme.palette.divider, 0.1) }} />
                      )}
                    </Box>
                  ))}
                </Paper>

                {/* Order Summary */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 2,
                  pt: 2,
                  borderTop: 1,
                  borderColor: alpha(theme.palette.divider, 0.1),
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                    Total Amount
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                    ₹{order.total.toFixed(2)}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    sx={{
                      bgcolor: '#8B4513',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#6b2e0a',
                      },
                    }}
                  >
                    Print Order
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      try {
                        downloadImprovedInvoice(order, authState.user);
                      } catch (error) {
                        console.log('Falling back to original invoice generator:', error.message);
                        try {
                          downloadInvoice(order, authState.user);
                        } catch (secondError) {
                          console.log('Falling back to simple invoice generator:', secondError.message);
                          try {
                            downloadSimpleInvoice(order, authState.user);
                          } catch (fallbackError) {
                            console.error('All invoice generators failed:', fallbackError.message);
                            alert('Failed to generate invoice. Please try again.');
                          }
                        }
                      }
                    }}
                    sx={{
                      bgcolor: '#8B4513',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#6b2e0a',
                      },
                    }}
                  >
                    Download Invoice
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authState } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    if (authState.isAuthenticated) {
      fetchOrders();
    }
  }, [authState]);

  if (!authState.isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info" sx={{ 
          bgcolor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.dark,
        }}>
          Please log in to view your order history.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ 
          bgcolor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
        }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}>
          Order History
        </Typography>
        <Alert severity="info" sx={{ 
          bgcolor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.dark,
        }}>
          You haven't placed any orders yet.
        </Alert>
      </Container>
    );
  }

  return (
    <PageBackground
      imageUrl={ordersBg}
      overlayColor="rgba(0, 0, 0, 0.85)"
      blur="0px"
    >
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            Order History
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha(theme.palette.text.secondary, 0.9),
            fontWeight: 500,
          }}>
            View and manage all your orders
          </Typography>
        </Box>
        
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} authState={authState} />
        ))}
      </Container>
    </PageBackground>
  );
};

export default OrdersPage; 