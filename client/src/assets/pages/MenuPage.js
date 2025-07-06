import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PageBackground from '../../components/common/PageBackground';
import menuBg from '../images/menu-bg.jpg';

const MenuPage = () => {
  return (
    <PageBackground
      imageUrl={menuBg}
      overlayColor="rgba(0, 0, 0, 0.85)"
      blur="0px"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          mb: 4
        }}>
          Our Menu
        </Typography>
        {/* Rest of your menu page content */}
      </Container>
    </PageBackground>
  );
};

export default MenuPage; 