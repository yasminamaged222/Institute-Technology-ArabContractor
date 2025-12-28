

import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/The-Role-of-Technology-in-Modern-Society-1024x570.jpg';
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

const features = [
  {
    icon: 'https://static.vecteezy.com/system/resources/thumbnails/008/143/259/small/blue-book-icon-book-sign-flat-style-blue-book-symbol-vector.jpg',
    title: 'مكتبة علمية متخصصة',
    subtitle: 'نمتلك مكتبة متخصصة في العلوم الهندسية والمالية والإدارية',
    link: '/library',
  },
  {
    icon: 'https://www.shutterstock.com/image-vector/blue-graduation-cap-vector-icon-260nw-2627871193.jpg',
    title: 'مجموعة متميزة من المدربين',
    subtitle: 'نعتمد على الخبرات والكفاءات البشرية الفريدة',
    link: '/instructors',
  },
  {
    icon: 'https://static.vecteezy.com/system/resources/previews/024/283/038/non_2x/flat-style-blue-color-laptop-icon-vector.jpg',
    title: 'التدريب عن بعد ( اونلاين )',
    subtitle: 'نسعى لتطبيق التدريب والتطوير القائم على التكنولوجيا',
    link: '/online-training',
  },
];

const Home = () => {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Hero Slider */}
      <Box sx={{ height: { xs: '70vh', md: '90vh' }, position: 'relative' }}>
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
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.45)' }} />

        {/* Hero Content */}
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
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2.2rem', md: '4.5rem' }, lineHeight: 1.2 }}>
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
              borderRadius: 30,
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: '#e65100' },
            }}
          >
            اقرأ المزيد
          </Button>
        </Box>
      </Box>

      {/* 3 Small Cards in a horizontal row & overlapping */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          top: 80,
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: { xs: 220, md: 260 },
                  borderRadius: 6,
                  boxShadow: 8,
                  bgcolor: 'white',
                  textAlign: 'center',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 16,
                  },
                }}
              >
                <Box sx={{ pt: 2 }}>
                              <Box 
                                  component="img" 
                src={feature.icon} 
                alt="icon" 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  display: 'block', // Necessary for margin auto to work
                  mx: 'auto'        // Material UI shorthand for margin-left: auto; margin-right: auto;
                }} 
              />
                </Box>
                <CardContent sx={{ px: 3, pt: 2 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="#0d47a1">
                    {feature.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
                    {feature.subtitle}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#f57c00',
                      borderRadius: 30,
                      px: 4,
                      py: 1,
                      fontSize: '0.85rem',
                      '&:hover': { bgcolor: '#e65100' },
                    }}
                    component={Link}
                    to={feature.link}
                  >
                    اقرأ المزيد
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

{/* New Section: المعهد التكنولوجي لهندسة التشييد والإدارة */}
<div style={{ backgroundColor: '#f5f5f5', padding: '80px 0' }}>
  <div style={{ 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'row-reverse', // This flips the RTL order to put image on the left
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap' 
  }}>

     {/* LEFT SIDE: Image */}
     <div style={{ flex: '0 0 450px', maxWidth: '100%' }}>
      <img 
        src={logo} 
        alt="المعهد التكنولوجي" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          borderRadius: '15px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
        }} 
      />
    </div>
    
    {/* RIGHT SIDE: Text Content */}
    <div style={{ flex: '1', minWidth: '300px', textAlign: 'right' }}>
      <h2 style={{ 
        color: '#0d47a1', 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        marginBottom: '20px',
        fontFamily: 'inherit' 
      }}>
        المعهد التكنولوجي لهندسة التشييد والإدارة
      </h2>
      
      <p style={{ 
        lineHeight: '1.9', 
        color: '#666', 
        fontSize: '1.1rem', 
        marginBottom: '15px' 
      }}>
        توجد لدى شركة المقاولون العرب إيمانًا راسخًا بأهمية التدريب، فضلاً عن أهمية البحث العلمي والتطوير، هذه العناصر هي التي تشكل حجر الزاوية للشركة لتعزيز قدرتها التنافسية واستمرارية البقاء. وبعد توصية من المجموعة الدولية للاستشارات المتخصصة في إدارة الموارد البشرية، عند تكليفها لبحث تطوير الإدارة في المقاولون العرب، استطعنا تأسيس المعهد التكنولوجي لهندسة التشييد والإدارة في عام 1978.
      </p>
      
      <p style={{ 
        lineHeight: '1.9', 
        color: '#666', 
        fontSize: '1.1rem', 
        marginBottom: '30px' 
      }}>
        للوصول إلى أعلى درجات التطوير والقدرة على الثبات وبالأخص في مجالات التسويق، إدارة الشركات، التخطيط المؤسسي، نظم المعلومات، الأشغال الكهروميكانيكية، وكذا التدريب المهني.
      </p>

      <Link to="/about" style={{ textDecoration: 'none' }}>
        <button style={{
          backgroundColor: '#f57c00',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          padding: '12px 40px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: '0.3s'
        }}>
          اقرأ المزيد
        </button>
      </Link>
    </div>

   

  </div>
</div>
</Box>
  
  );
};

export default Home;


// import React from 'react';
// import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Container } from '@mui/material';
// import { Link } from 'react-router-dom';

// const slides = [
//   {
//     title: 'خدمات تدريبية مميزة',
//     subtitle: 'يقدم المعهد خدمات مميزة',
//     image: 'https://heavyequipmentcollege.edu/wp-content/uploads/2020/10/ppe-kit-in-construction-heavyequipmentcollegesof-america-scaled-1-1024x683.jpg',
//   },
//   {
//     title: 'برامج تدريبية متنوعة',
//     subtitle: 'يقدم المعهد خدمات مميزة',
//     image: 'https://ccemagazine.com/wp-content/uploads/sites/11/2023/08/Image-of-construction-workers-training-on-site-2-scaled.jpeg',
//   },
//   {
//     title: 'التدريب في موقع العمل',
//     subtitle: 'يقدم المعهد خدمات مميزة',
//     image: 'https://pe.gatech.edu/sites/default/files/styles/medium_4_3_/public/Construction_and_General_Industry_What_You_Will_Learn_750_x_500.jpg?h=4cdf7179&itok=HgEN7uZA',
//   },
//   {
//     title: 'دورات متقدمة في الهندسة',
//     subtitle: 'يقدم المعهد خدمات مميزة',
//     image: 'https://regionalhca.org/wp-content/uploads/2025/02/Workforce-Training-Program-4-1024x576.png',
//   },
// ];

// const features = [
//   {
//     icon: 'https://static.vecteezy.com/system/resources/thumbnails/008/143/259/small/blue-book-icon-book-sign-flat-style-blue-book-symbol-vector.jpg', // blue book icon
//     title: 'مكتبة علمية متخصصة',
//     subtitle: 'نمتلك مكتبة متخصصة في العلوم الهندسية والمالية والإدارية',
//     link: '/library',
//   },
//   {
//     icon: 'https://www.shutterstock.com/image-vector/blue-graduation-cap-vector-icon-260nw-2627871193.jpg', // blue graduation cap
//     title: 'مجموعة متميزة من المدربين',
//     subtitle: 'نعتمد على الخبرات والكفاءات البشرية الفريدة',
//     link: '/instructors',
//   },
//   {
//     icon: 'https://static.vecteezy.com/system/resources/previews/024/283/038/non_2x/flat-style-blue-color-laptop-icon-vector.jpg', // blue laptop
//     title: 'التدريب عن بعد ( اونلاين )',
//     subtitle: 'نسعى لتطبيق التدريب والتطوير القائم على التكنولوجيا',
//     link: '/online-training',
//   },
// ];

// const Home = () => {
//   const [current, setCurrent] = React.useState(0);

//   React.useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % slides.length);
//     }, 6000);
//     return () => clearInterval(timer);
//   }, []);

//   const slide = slides[current];

//   return (
//     <Box sx={{ position: 'relative' }}>
//       {/* Hero Slider */}
//       <Box sx={{ height: { xs: '70vh', md: '90vh' }, position: 'relative' }}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundImage: `url(${slide.image})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             transition: 'background-image 1s ease-in-out',
//           }}
//         />
//         <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.45)' }} />

//         {/* Hero Content */}
//         <Box
//           sx={{
//             position: 'relative',
//             zIndex: 1,
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             textAlign: 'center',
//             color: 'white',
//             px: 3,
//           }}
//         >
//           <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.6rem' }, opacity: 0.9 }}>
//             {slide.subtitle}
//           </Typography>
//           <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2.2rem', md: '4.5rem' }, lineHeight: 1.2 }}>
//             {slide.title}
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             sx={{
//               mt: 5,
//               bgcolor: '#f57c00',
//               color: 'white',
//               px: 7,
//               py: 2,
//               fontSize: '1.3rem',
//               borderRadius: 30,
//               boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
//               '&:hover': { bgcolor: '#e65100' },
//             }}
//           >
//             اقرأ المزيد
//           </Button>
//         </Box>
//       </Box>

//       {/* 3 Small Cards in a horizontal row & overlapping */}
//       <Container
//         maxWidth="lg"
//         sx={{
//           position: 'relative',
//           top: 50,
//           left: 0,
//           right: 0,
//           transform: 'translateY(-50%)',
//           zIndex: 2,
//         }}
//       >
//         <Grid container spacing={3} justifyContent="center">
//           {features.map((feature, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card
//                 sx={{
//                   height: '100%',
//                   minHeight: { xs: 220, md: 260 },
//                   borderRadius: 6,
//                   boxShadow: 8,
//                   bgcolor: 'white',
//                   textAlign: 'center',
//                   transition: '0.3s',
//                   '&:hover': {
//                     transform: 'translateY(-10px)',
//                     boxShadow: 16,
//                   },
//                 }}
//               >
//                 <Box sx={{ pt: 3 }}>
//                   <Box component="img" src={feature.icon} alt="icon" sx={{ width: 50, height: 50 }} />
//                 </Box>
//                 <CardContent sx={{ px: 3, pt: 2 }}>
//                   <Typography variant="h6" gutterBottom fontWeight="bold" color="#0d47a1">
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
//                     {feature.subtitle}
//                   </Typography>
//                 </CardContent>
//                 <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     sx={{
//                       bgcolor: '#f57c00',
//                       borderRadius: 30,
//                       px: 4,
//                       py: 1,
//                       fontSize: '0.85rem',
//                       '&:hover': { bgcolor: '#e65100' },
//                     }}
//                     component={Link}
//                     to={feature.link}
//                   >
//                     اقرأ المزيد
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default Home;