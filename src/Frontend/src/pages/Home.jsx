import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredCourses = [
    { title: "CEA Program", instructor: "ICEMT Team", rating: 4.8, price: "1500 EGP", image: "/assets/images/cea-program.jpg" },
    { title: "Advanced Construction Engineering", instructor: "Dr. Ahmed Mohamed", rating: 4.5, price: "2500 EGP", image: "/assets/images/construction.jpg" },
    { title: "Project Management", instructor: "Dr. Sharif Abdel Nageb", rating: 4.7, price: "3000 EGP", image: "/assets/images/project-management.jpg" },
  ];

  return (
    <Box>
      {/* Udemy-Style Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 12, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            ICEMT LMS
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Professional Training & Online Courses
          </Typography>
          <Button variant="contained" size="large" component={Link} to="/courses" sx={{ px: 6, py: 2, bgcolor: 'white', color: 'primary.main' }}>
            View Courses
          </Button>
        </Container>
      </Box>

      {/* Featured Courses Grid (Udemy-Style Cards) */}
      <Container maxWidth="lg" sx={ { py: 8 } }>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Popular Courses
        </Typography>
        <Grid container spacing={4}>
          {featuredCourses.map((course, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
                <CardMedia component="img" height="140" image={course.image} alt={course.title} />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instructor: {course.instructor}
                  </Typography>
                  <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
                    <Rating value={course.rating} precision={0.1} readOnly />
                    <Typography variant="body2" sx={ { ml: 1 } }>({course.rating})</Typography>
                  </Stack>
                  <Typography variant="h6" color="primary" sx={ { mt: 2 } }>
                    {course.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;