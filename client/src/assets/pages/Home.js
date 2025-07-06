import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../../components/common/PageBackground';
import backgroundImg from '../images/background.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageBackground
      imageUrl={backgroundImg}
      overlayColor="rgba(0, 0, 0, 0.7)"
      blur="0px"
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          minHeight: '80vh',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          textAlign: 'center'
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: '#fff',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Welcome to KaapiKart
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#fff',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: '600px'
            }}
          >
            Experience the Perfect Cup of Coffee
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: '#fff',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1rem', md: '1.2rem' },
              maxWidth: '500px',
              mb: 4
            }}
          >
            From rich espresso shots to creamy cappuccinos, we bring you the finest coffee experience. 
            Order online and enjoy barista-quality coffee delivered to your doorstep.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/menu')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#8B4513',
                '&:hover': {
                  bgcolor: '#A0522D'
                }
              }}
            >
              Order Coffee
            </Button>
          </Box>
        </Box>
      </Container>
    </PageBackground>
  );
};

export default Home;
