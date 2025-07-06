import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Avatar,
  Paper,
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PageBackground from '../../components/common/PageBackground';

const ProfilePage = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const theme = useTheme();

  const handleSave = () => {
    setIsEditing(!isEditing);
    // Here you would typically save the changes to the backend
    // You can add an API call here to update the user profile
  };

  return (
    <PageBackground
      imageUrl="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      overlayColor="rgba(0, 0, 0, 0.85)"
      blur="0px"
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              p: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.3)} 0%, ${alpha(theme.palette.background.default, 0.3)} 100%)`,
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: `1px solid ${alpha('#fff', 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: alpha('#fff', 0.95),
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              mb: 4,
              textAlign: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
                borderRadius: '3px',
              }
            }}>
              Profile Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    mb: 4,
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.2)} 100%)`,
                    borderRadius: 2,
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
                    }
                  }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        bgcolor: 'primary.main',
                        fontSize: '3rem',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        border: `4px solid ${alpha('#fff', 0.2)}`,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold',
                      color: alpha('#fff', 0.95),
                      textAlign: 'center',
                      mb: 1,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      color: alpha('#fff', 0.7),
                      textAlign: 'center',
                      fontWeight: 'medium',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <VerifiedIcon sx={{ fontSize: 20 }} />
                      {user?.isAdmin ? 'Administrator' : 'Coffee Enthusiast'}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 3
                  }}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ color: alpha('#fff', 0.7), mr: 1 }} />,
                        sx: { 
                          bgcolor: alpha(theme.palette.background.paper, 0.2),
                          backdropFilter: 'blur(10px)',
                          '& .MuiInputBase-input': {
                            color: alpha('#fff', 0.95),
                            fontWeight: 'medium'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: { color: alpha('#fff', 0.7) }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Email"
                      value={userInfo.email}
                      disabled={!isEditing}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ color: alpha('#fff', 0.7), mr: 1 }} />,
                        sx: { 
                          bgcolor: alpha(theme.palette.background.paper, 0.2),
                          backdropFilter: 'blur(10px)',
                          '& .MuiInputBase-input': {
                            color: alpha('#fff', 0.95),
                            fontWeight: 'medium'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: { color: alpha('#fff', 0.7) }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ color: alpha('#fff', 0.7), mr: 1 }} />,
                        sx: { 
                          bgcolor: alpha(theme.palette.background.paper, 0.2),
                          backdropFilter: 'blur(10px)',
                          '& .MuiInputBase-input': {
                            color: alpha('#fff', 0.95),
                            fontWeight: 'medium'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: { color: alpha('#fff', 0.7) }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Address"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                      disabled={!isEditing}
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: <LocationIcon sx={{ color: alpha('#fff', 0.7), mr: 1, mt: 1 }} />,
                        sx: { 
                          bgcolor: alpha(theme.palette.background.paper, 0.2),
                          backdropFilter: 'blur(10px)',
                          '& .MuiInputBase-input': {
                            color: alpha('#fff', 0.95),
                            fontWeight: 'medium'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: { color: alpha('#fff', 0.7) }
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    fullWidth
                    startIcon={<EditIcon />}
                    sx={{ 
                      py: 1.5,
                      fontWeight: 'bold',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.9)} 30%, ${alpha(theme.palette.primary.dark, 0.9)} 90%)`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 1)} 30%, ${alpha(theme.palette.primary.dark, 1)} 90%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3,
                      bgcolor: alpha(theme.palette.background.paper, 0.2),
                      borderRadius: 2,
                      height: '100%',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#fff', 0.1)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.primary.main, 0.8)})`,
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold',
                      color: alpha('#fff', 0.95),
                      mb: 3,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <VerifiedIcon sx={{ color: alpha(theme.palette.primary.main, 0.9) }} />
                      Account Information
                    </Typography>

                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3
                    }}>
                      <Box sx={{ 
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.background.paper, 0.1),
                        border: `1px solid ${alpha('#fff', 0.05)}`,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          bgcolor: alpha(theme.palette.background.paper, 0.15),
                        }
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: alpha('#fff', 0.7),
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <CalendarIcon sx={{ fontSize: 18 }} />
                          Member Since
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          color: alpha('#fff', 0.95),
                          fontWeight: 'medium',
                          ml: 3
                        }}>
                          {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.background.paper, 0.1),
                        border: `1px solid ${alpha('#fff', 0.05)}`,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          bgcolor: alpha(theme.palette.background.paper, 0.15),
                        }
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: alpha('#fff', 0.7),
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <VerifiedIcon sx={{ fontSize: 18 }} />
                          Account Status
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          color: alpha('#fff', 0.95),
                          fontWeight: 'medium',
                          ml: 3
                        }}>
                          Active
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.background.paper, 0.1),
                        border: `1px solid ${alpha('#fff', 0.05)}`,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          bgcolor: alpha(theme.palette.background.paper, 0.15),
                        }
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: alpha('#fff', 0.7),
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <TimeIcon sx={{ fontSize: 18 }} />
                          Last Login
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          color: alpha('#fff', 0.95),
                          fontWeight: 'medium',
                          ml: 3
                        }}>
                          {new Date().toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </PageBackground>
  );
};

export default ProfilePage; 