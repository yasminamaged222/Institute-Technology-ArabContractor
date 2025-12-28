import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs= {12} md={3}>
            <Typography variant="h6" gutterBottom>
              ICEMT LMS
            </Typography>
            <Typography>
              6 Mahmoud El-Meligy St., 6th District, Nasr City, Cairo
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Email: icemt@arabcont.com
            </Typography>
          </Grid>
          <Grid item xs= {12} md={3}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MuiLink component={Link} to="/about" color="inherit">Overview</MuiLink>
              <MuiLink component={Link} to="/mission" color="inherit">Vision & Goals</MuiLink>
              <MuiLink component={Link} to="/certificates" color="inherit">Certificates</MuiLink>
              <MuiLink component={Link} to="/team" color="inherit">Team</MuiLink>
            </Box>
          </Grid>
          <Grid item xs= {12} md={3}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MuiLink component={Link} to="/training" color="inherit">Training Programs</MuiLink>
              <MuiLink component={Link} to="/gesr-elsuez" color="inherit">Craft Training</MuiLink>
              <MuiLink component={Link} to="/technical-education" color="inherit">Technical Education</MuiLink>
              <MuiLink component={Link} to="/tests" color="inherit">Tests</MuiLink>
            </Box>
          </Grid>
          <Grid item xs= {12} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FacebookIcon />
              <YouTubeIcon />
              <GoogleIcon />
            </Box>
            <Typography sx={{ mt: 2 }}>
              © 2025 ICEMT. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;