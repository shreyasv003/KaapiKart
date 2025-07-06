import React from 'react';
import { Box } from '@mui/material';

const PageBackground = ({ 
  children, 
  imageUrl, 
  overlayColor = 'rgba(0, 0, 0, 0.85)',
  blur = '0px',
  minHeight = '100vh'
}) => {
  return (
    <Box
      sx={{
        minHeight,
        width: '100%',
        background: `linear-gradient(${overlayColor}, ${overlayColor}), url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backdropFilter: `blur(${blur})`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: `blur(${blur})`,
          zIndex: 0,
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageBackground; 