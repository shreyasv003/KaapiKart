import React from 'react';
import PageBackground from '../../components/common/PageBackground';
import bgImage from '../images/background.jpg';

const HomePage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '12px' }}>
        <h1>Welcome to KaapiKart</h1>
        <p>Discover the finest coffee blends</p>
      </div>
    </div>
  );
};


export default HomePage;
