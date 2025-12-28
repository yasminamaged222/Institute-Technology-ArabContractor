import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const slides = [
  'خدمات تدريبية مميزة',
  'برامج تدريبية متنوعة',
  'التدريب في موقع العمل',
  'دورات متقدمة في الهندسة',
];

const HeroSlider = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        height: { xs: '60vh', md: '80vh' },
        backgroundImage: 'ur[](https://heavyequipmentcollege.edu/wp-content/uploads/2020/10/ppe-kit-in-construction-heavyequipmentcollegesof-america-scaled-1-1024x683.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
      }}
    >
      {/* Light black overlay */}
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />

      <Box sx={{ position: 'relative', zIndex: 1, px: 3 }}>
        <Typography variant="h6" gutterBottom>
          يقدم المعهد خدمات مميزة
        </Typography>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '4rem' } }}>
          {slides[index]}
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            bgcolor: '#f57c00',
            px: 6,
            py: 2,
            fontSize: '1.2rem',
            '&:hover': { bgcolor: '#e65100' },
          }}
        >
          اقرأ المزيد
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSlider;