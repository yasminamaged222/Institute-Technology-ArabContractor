import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const slides = [
  {
    title: 'خدمات تدريبية مميزة',
    subtitle: 'يقدم المعهد خدمات مميزة',
    image: 'https://heavyequipmentcollege.edu/wp-content/uploads/2020/10/ppe-kit-in-construction-heavyequipmentcollegesof-america-scaled-1-1024x683.jpg',
  },
  {
    title: 'برامج تدريبية متنوعة',
    subtitle: 'يقدم المعهد خدمات مميزة',
    image: 'https://ccemagazine.com/wp-content/uploads/sites/11/2023/08/Image-of-construction-workers-training-on-site-2-scaled.jpeg',
  },
  {
    title: 'التدريب في موقع العمل',
    subtitle: 'يقدم المعهد خدمات مميزة',
    image: 'https://pe.gatech.edu/sites/default/files/styles/medium_4_3_/public/Construction_and_General_Industry_What_You_Will_Learn_750_x_500.jpg?h=4cdf7179&itok=HgEN7uZA',
  },
  {
    title: 'دورات متقدمة في الهندسة',
    subtitle: 'يقدم المعهد خدمات مميزة',
    image: 'https://regionalhca.org/wp-content/uploads/2025/02/Workforce-Training-Program-4-1024x576.png',
  },
];

const Home = () => {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // تغيير كل 6 ثواني
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <Box
      sx={{
        height: { xs: '60vh', md: '85vh' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out',
        }}
      />

      {/* Light Black Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.45)', // light black shadow
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          px: 3,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.6rem' }, opacity: 0.9 }}>
          {slide.subtitle}
        </Typography>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: '2.2rem', md: '4.5rem' },
            lineHeight: 1.2,
          }}
        >
          {slide.title}
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 5,
            bgcolor: '#f57c00',
            color: 'white',
            px: 7,
            py: 2,
            fontSize: '1.3rem',
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            '&:hover': {
              bgcolor: '#e65100',
              transform: 'translateY(-3px)',
            },
          }}
        >
          اقرأ المزيد
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
// import React from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   Rating,
//   Stack,
// } from '@mui/material';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <h1>Hello</h1>
//     // <Box>
//     //   {/* Udemy-Style Hero */}
//     //   <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 12, textAlign: 'center' }}>
//     //     <Container maxWidth="lg">
//     //       <Typography variant="h2" fontWeight="bold" gutterBottom>
//     //         ICEMT LMS
//     //       </Typography>
//     //       <Typography variant="h5" sx={{ mb: 4 }}>
//     //         Professional Training & Online Courses
//     //       </Typography>
//     //       <Button variant="contained" size="large" component={Link} to="/courses" sx={{ px: 6, py: 2, bgcolor: 'white', color: 'primary.main' }}>
//     //         View Courses
//     //       </Button>
//     //     </Container>
//     //   </Box>

//     //   {/* Featured Courses Grid (Udemy-Style Cards) */}
//     //   <Container maxWidth="lg" sx={ { py: 8 } }>
//     //     <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
//     //       Popular Courses
//     //     </Typography>
//     //     <Grid container spacing={4}>
//     //       {featuredCourses.map((course, index) => (
//     //         <Grid item xs={12} md={4} key={index}>
//     //           <Card sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
//     //             <CardMedia component="img" height="140" image={course.image} alt={course.title} />
//     //             <CardContent>
//     //               <Typography variant="h6" gutterBottom>
//     //                 {course.title}
//     //               </Typography>
//     //               <Typography variant="body2" color="text.secondary">
//     //                 Instructor: {course.instructor}
//     //               </Typography>
//     //               <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
//     //                 <Rating value={course.rating} precision={0.1} readOnly />
//     //                 <Typography variant="body2" sx={ { ml: 1 } }>({course.rating})</Typography>
//     //               </Stack>
//     //               <Typography variant="h6" color="primary" sx={ { mt: 2 } }>
//     //                 {course.price}
//     //               </Typography>
//     //             </CardContent>
//     //           </Card>
//     //         </Grid>
//     //       ))}
//     //     </Grid>
//     //   </Container>
//     // </Box>
//   );
// };

// export default Home;