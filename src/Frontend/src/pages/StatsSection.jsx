import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// Data for statistics
const statsData = [
  {
    icon: <LaptopMacIcon sx={{ fontSize: 60, color: '#0d47a1' }} />,
    number: 498,
    label: 'دورة تدريبية',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 60, color: '#0d47a1' }} />,
    number: 7225,
    label: 'متدرب',
  },
  {
    icon: <LanguageIcon sx={{ fontSize: 60, color: '#0d47a1' }} />,
    number: 35,
    label: 'الدورات التدريب عن بعد (Online)',
  },
  {
    icon: <PeopleAltIcon sx={{ fontSize: 60, color: '#0d47a1' }} />,
    number: 500,
    label: 'المتدربين للدورات عن بعد (Online)',
  },
];

const StatsSection = () => {
  return (
    <Box
      component="section"
      id="stats"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#f8f9fa',
        direction: 'rtl',
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          variant="h4"
          component="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{
            mb: 8,
            color: '#0d47a1',
            fontFamily: '"Cairo", sans-serif',
          }}
        >
          لدينا خلال العام 2024 - 2025 أكثر من :
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={4} justifyContent="center">
          {statsData.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 4,
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                  },
                }}
              >
                {/* Icon */}
                <Box sx={{ mb: 3 }}>{stat.icon}</Box>

                {/* Number */}
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    color: '#0d47a1',
                    mb: 1,
                  }}
                >
                  {stat.number.toLocaleString()}
                </Typography>

                {/* Label */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#555',
                    fontFamily: '"Cairo", sans-serif',
                    fontSize: '1.1rem',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;