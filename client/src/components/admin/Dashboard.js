import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  IconButton,
  Avatar,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  People as PeopleIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Coffee as CoffeeIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../assets/context/AuthContext';
import axios from 'axios';
import PageBackground from '../common/PageBackground';

const API_URL = 'http://localhost:5002/api';

const StatCard = ({ title, value, icon, color, loading, trend }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={3}
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.15)} 0%, ${alpha(theme.palette[color].light, 0.25)} 100%)`,
        backdropFilter: 'blur(10px)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.2)} 0%, ${alpha(theme.palette[color].light, 0.3)} 100%)`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.main`,
              color: 'white',
              width: 56,
              height: 56,
              mr: 2,
              boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography color="textPrimary" variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', color: alpha('#fff', 0.9) }}>
              {title}
            </Typography>
            {loading ? (
              <LinearProgress sx={{ mt: 1 }} />
            ) : (
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: alpha('#fff', 0.95) }}>
                {value}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', color: alpha('#4caf50', 0.9) }}>
                  {trend}% from last month
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch total users and admin users
      const usersResponse = await axios.get(`${API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const users = usersResponse.data;
      const adminUsers = users.filter(user => user.isAdmin).length;

      // Fetch total orders and revenue
      const ordersResponse = await axios.get(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const orders = ordersResponse.data;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Fetch total products
      const productsResponse = await axios.get(`${API_URL}/products`);
      const products = productsResponse.data;

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(user => user.isActive).length,
        adminUsers: adminUsers,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalProducts: products.length,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleRefresh = () => {
    fetchStats();
  };

  return (
    <PageBackground
      imageUrl="https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      overlayColor="rgba(0, 0, 0, 0.85)"
      blur="0px"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            mb: 4,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.95)} 30%, ${alpha(theme.palette.primary.dark, 0.95)} 90%)`,
            color: alpha('#fff', 0.95),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CoffeeIcon sx={{ fontSize: 40, mr: 2, color: alpha('#fff', 0.95) }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', color: alpha('#fff', 0.95) }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                color: alpha('#fff', 0.95),
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              sx={{
                color: alpha('#fff', 0.95),
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <NotificationsIcon />
            </IconButton>
            <Button 
              variant="outlined" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                color: alpha('#fff', 0.95),
                borderColor: alpha('#fff', 0.95),
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: alpha('#fff', 0.95),
                  bgcolor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<PeopleIcon />}
              color="primary"
              loading={loading}
              trend="12"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={<PersonIcon />}
              color="success"
              loading={loading}
              trend="8"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Admin Users"
              value={stats.adminUsers}
              icon={<AdminIcon />}
              color="warning"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<CartIcon />}
              color="info"
              loading={loading}
              trend="15"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              icon={<MoneyIcon />}
              color="secondary"
              loading={loading}
              trend="20"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<CoffeeIcon />}
              color="error"
              loading={loading}
              trend="5"
            />
          </Grid>
        </Grid>

        {/* Admin Info */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3,
            mt: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.3)} 0%, ${alpha(theme.palette.background.default, 0.3)} 100%)`,
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: `1px solid ${alpha('#fff', 0.1)}`,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: alpha('#fff', 0.95), textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
            Admin Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={authState.user?.name}
                    primaryTypographyProps={{ fontWeight: 'bold', color: alpha('#fff', 0.9) }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7), fontWeight: 'medium' }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ borderColor: alpha('#fff', 0.1) }} />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ 
                      bgcolor: 'secondary.main',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
                    }}>
                      <AdminIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={authState.user?.email}
                    primaryTypographyProps={{ fontWeight: 'bold', color: alpha('#fff', 0.9) }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7), fontWeight: 'medium' }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ borderColor: alpha('#fff', 0.1) }} />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ 
                      bgcolor: 'success.main',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                    }}>
                      <AdminIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Role"
                    secondary={authState.user?.isAdmin ? 'Administrator' : 'User'}
                    primaryTypographyProps={{ fontWeight: 'bold', color: alpha('#fff', 0.9) }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7), fontWeight: 'medium' }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.background.paper, 0.3),
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#fff', 0.1)}`,
              }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {authState.user?.name?.charAt(0) || 'A'}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: alpha('#fff', 0.95), textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                  Welcome back, {authState.user?.name}!
                </Typography>
                <Typography sx={{ color: alpha('#fff', 0.7), fontWeight: 'medium' }}>
                  You have full administrative access to manage the KaapiKart platform.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </PageBackground>
  );
};

export default Dashboard; 