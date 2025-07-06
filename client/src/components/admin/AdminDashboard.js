import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AdminDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    recentLogins: 0
  });
  const [settings, setSettings] = useState({
    dashboardLayout: 'default',
    notifications: {
      email: true,
      push: true
    },
    theme: 'light'
  });
  const [anchorEl, setAnchorEl] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalUsers: 150,
      activeUsers: 120,
      adminUsers: 5,
      recentLogins: 45
    });
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              Admin Dashboard
            </Typography>
            <Box>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Refresh Data</MenuItem>
                <MenuItem onClick={handleMenuClose}>Export Reports</MenuItem>
                <MenuItem onClick={handleMenuClose}>System Settings</MenuItem>
              </Menu>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<PeopleIcon sx={{ color: theme.palette.success.main }} />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Admin Users"
            value={stats.adminUsers}
            icon={<SecurityIcon sx={{ color: theme.palette.warning.main }} />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Recent Logins"
            value={stats.recentLogins}
            icon={<AnalyticsIcon sx={{ color: theme.palette.info.main }} />}
          />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={() => {/* Handle user management */}}
                >
                  Manage Users
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => {/* Handle orders */}}
                >
                  View Orders
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AnalyticsIcon />}
                  onClick={() => {/* Handle analytics */}}
                >
                  Analytics
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={() => {/* Handle settings */}}
                >
                  Settings
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Settings Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dashboard Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard Layout" />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.dashboardLayout === 'compact'}
                      onChange={(e) => handleSettingsChange('dashboardLayout', e.target.checked ? 'compact' : 'default')}
                    />
                  }
                  label="Compact View"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingsChange('notifications', { ...settings.notifications, email: e.target.checked })}
                      />
                    }
                    label="Email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingsChange('notifications', { ...settings.notifications, push: e.target.checked })}
                      />
                    }
                    label="Push"
                  />
                </Box>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="New user registered"
                  secondary="2 minutes ago"
                />
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText
                  primary="New order placed"
                  secondary="5 minutes ago"
                />
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 