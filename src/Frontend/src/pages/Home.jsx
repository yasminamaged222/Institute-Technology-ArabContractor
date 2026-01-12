import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, 
  CardActions, Container, Paper,CardMedia, Tooltip, 
  Rating, IconButton, Popover } from '@mui/material';
import './home.css';
import CustomersSection from './CustomersSection';
import TechnicalEducationSection from './TechnicalEducationSection';
import StatsSection from "./StatsSection";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
// Standard MUI Icons to match your screenshot
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// استيراد الأيقونات المطلوبة لقسم التحميلات
import DescriptionIcon from '@mui/icons-material/Description';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
// import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import logo from '../assets/The-Role-of-Technology-in-Modern-Society-1024x570.jpg';

const newsItems = [
  {
    id: 1,
    date: '25 نوفمبر 2025',
    title: 'اتفاقية بين المعهد القومي للحوكمة والمعهد التكنولوجي لهندسة التشييد والإدارة',
    image: '/images/news/news-01.jpg', // Path to your local file
    link: '/news/2025-68'
  },
  {
    id: 2,
    date: '22 أكتوبر 2025',
    title: 'ختام المرحلة الأولى من برنامج التدريب المشترك بين المقاولون العرب والجامعة',
    image: '/images/news/news-02.jpg',
    link: '/news/2025-67'
  },
  {
    id: 3,
    date: '22 أكتوبر 2025',
    title: 'انطلاق البرنامج التدريبي للمهندسين من دولة زامبيا',
    image: '/images/news/news-03.jpg',
    link: '/news/2025-66'
  },
  {
    id: 4,
    date: '7 أكتوبر 2025',
    title: 'تجديد إعتماد المعهد من الجهاز المركزي للتنظيم والإدارة',
    image: '/images/news/news-04.jpg',
    link: '/news/2025-65'
  },
  {
    id: 5,
    date: '3 سبتمبر 2025',
    title: 'المقاولون العرب تكرم أوئل الثانوية العامة',
    image: '/images/news/news-05.jpg',
    link: '/news/2025-64'
  },
];
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

const downloadItems = [
  { title: "الشهادات والاعتمادات", Icon: EmojiEventsIcon },
  { title: "التقارير الشهرية", Icon: DescriptionIcon },
  { title: "البروتوكولات والاتفاقيات", Icon: HomeWorkIcon }
];


const courses = [
  {
    title: 'برنامج إعداد وتأهيل مهندس حديث مدنى وعمارة',
    subtitle: 'برامج موجهة للمهندسين',
    icon: 'https://media.istockphoto.com/id/1824047483/vector/civil-engineering-solid-icon-set.jpg?s=612x612&w=0&k=20&c=6Ee2eri1r54hsHX_Nfuy6n7xvdGUmXLzDjCPRqEnfvI=',
    originalPrice: 1000,
    discountedPrice: 750,
    hours: 45,
    level: 'متوسط',
    description: 'برنامج شامل لتأهيل المهندسين الجدد في مجال المدني والعمارة مع تطبيقات عملية.',
  },
  {
    title: 'برنامج إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء',
    subtitle: 'برامج موجهة للمهندسين',
    icon: 'https://www.shutterstock.com/image-vector/mechanical-engineering-icon-blue-vector-260nw-2617424085.jpg',
    originalPrice: 1200,
    discountedPrice: 800,
    hours: 50,
    level: 'متوسط',
    description: 'تدريب متخصص في الميكانيكا والكهرباء للمهندسين الحديثين.',
  },
  {
    title: 'المحور الأول : المعلومات الهندسية الأساسية',
    subtitle: 'برامج تأهيلية للمهندسين',
    icon: 'https://media.istockphoto.com/id/1652170312/vector/project-management-solid-icon-set.jpg?s=612x612&w=0&k=20&c=k3LCjVKEjqEqkTPnOyqG_sQiP4Tj6umdV2GDyc-F6QY=',
    originalPrice: 500,
    discountedPrice: 350,
    hours: 25,
    level: 'مبتدئ',
    description: 'الأساسيات الهندسية الضرورية لكل مهندس جديد.',
  },
  {
    title: 'المحور الثانى : التطبيقات الهندسية المختلفة',
    subtitle: 'برامج تأهيلية للمهندسين',
    icon: 'https://media.istockphoto.com/id/2148250739/vector/quality-assurance-solid-icons-collection-guarantee-support-improvement-development-testing.jpg?s=612x612&w=0&k=20&c=ZEgQV0sszyPEgFynhTj5ypRPZotYfRaEd2VT0kjqdFU=',
    originalPrice: 600,
    discountedPrice: 450,
    hours: 30,
    level: 'متوسط',
    description: 'تطبيقات عملية في مجالات الهندسة المختلفة.',
  },
  {
    title: 'المحور الثالث : إدارة المشروعات والجودة',
    subtitle: 'برامج الإدارة الطبية',
    icon: 'https://media.istockphoto.com/id/1652170312/vector/project-management-solid-icon-set.jpg?s=612x612&w=0&k=20&c=k3LCjVKEjqEqkTPnOyqG_sQiP4Tj6umdV2GDyc-F6QY=',
    originalPrice: 1200,
    discountedPrice: 900,
    hours: 60,
    level: 'متقدم',
    description: 'إدارة المشروعات باحترافية مع معايير الجودة العالمية.',
  },
  {
    title: 'المحور الرابع : الطرق المختلفة لدعم اتخاذ القرار',
    subtitle: 'تحليل الإحتياجات التدريبية',
    icon: 'https://static.vecteezy.com/system/resources/thumbnails/029/457/921/small_2x/decision-making-icon-icon-of-people-at-a-crossroads-icon-suitable-for-web-site-design-app-user-interfaces-printable-etc-flat-line-icon-style-simple-design-editable-free-vector.jpg',
    originalPrice: 700,
    discountedPrice: 500,
    hours: 35,
    level: 'متوسط',
    description: 'أدوات وطرق دعم اتخاذ القرار في المشاريع.',
  },
  {
    title: 'المحور الخامس :العقود والعطاءات والمشتريات',
    subtitle: 'برامج القطاع القانوني والعقارى',
    icon: 'https://www.shutterstock.com/shutterstock/photos/2639061137/display_1500/stock-vector-the-procurement-management-blue-icon-set-captures-essential-concepts-like-sourcing-contracts-2639061137.jpg',
    originalPrice: 900,
    discountedPrice: 650,
    hours: 40,
    level: 'متقدم',
    description: 'كل ما يخص العقود والمشتريات في المشاريع الكبرى.',
  },
];

let closeTimer;

const Home = () => {
  const [current, setCurrent] = React.useState(0);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // const { ref, inView } = useInView({
  //   triggerOnce: true,
  //   threshold: 0.1,
  // });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  

  const handlePopoverOpen = (event, course) => {
    // If a close timer is running, stop it!
    if (closeTimer) clearTimeout(closeTimer);
    
    setPopoverAnchor(event.currentTarget);
    setSelectedCourse(course);
  };

  const handlePopoverClose = () => {
    // Wait 300 milliseconds before hiding
    closeTimer = setTimeout(() => {
      setPopoverAnchor(null);
      setSelectedCourse(null);
    }, 300);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Hero Slider */}
      <Box sx={{ height: { xs: '60vh', md: '80vh' }, position: 'relative' }}>
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

      {/* 3 Small Cards */}
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
                      display: 'block',
                      mx: 'auto'
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

      {/* Section: About Institute */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: 'auto', 
          padding: '70px',
          display: 'flex',
          flexDirection: 'row-reverse', 
          alignItems: 'center',
          gap: '50px',
          flexWrap: 'wrap' 
        }}>
          <div style={{ flex: '0 0 400px', maxWidth: '100%' }}>
            <img 
              src={logo} 
              alt="المعهد التكنولوجي" 
              style={{ 
                width: '150%', 
                height: 'auto', 
                borderRadius: '15px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
              }} 
            />
          </div>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'right' }}>
            <h2 style={{ color: '#0d47a1', fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>
              المعهد التكنولوجي لهندسة التشييد والإدارة
            </h2>
            <p style={{ lineHeight: '2', color: '#666', fontSize: '1.1rem', marginBottom: '15px' }}>
              توجد لدى شركة المقاولون العرب إيمانًا راسخًا بأهمية التدريب، فضلاً عن أهمية البحث العلمي والتطوير، هذه العناصر هي التي تشكل حجر الزاوية للشركة لتعزيز قدرتها التنافسية واستمرارية البقاء. وبعد توصية من المجموعة الدولية للاستشارات المتخصصة في إدارة الموارد البشرية، عند تكليفها لبحث تطوير الإدارة في المقاولون العرب، استطعنا تأسيس المعهد التكنولوجي لهندسة التشييد والإدارة في عام 1978.
            </p>
            <p style={{ lineHeight: '1.6', color: '#666', fontSize: '1.1rem', marginBottom: '15px' }}>
              للوصول إلى أعلى درجات التطوير والقدرة على الثبات وبالأخص في مجالات التسويق، إدارة الشركات، التخطيط المؤسسي، نظم المعلومات، الأشغال الكهروميكانيكية، وكذا التدريب المهني.
            </p>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#f57c00', color: 'white', border: 'none', borderRadius: '30px', padding: '12px 40px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'
              }}>
                اقرأ المزيد
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* New Section: Downloads (التحميلات) */}
      <div style={{ 
        width: '100%', 
        padding: '100px 0', 
        backgroundImage: 'linear-gradient(#070707,#0865a8)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center',
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, fontFamily: '"Droid Arabic Kufi", serif', position: 'relative', display: 'inline-block',
              '&::after': { content: '""', position: 'absolute', bottom: -15, left: '15%', width: '60%', height: '2px', bgcolor: 'white' }
          }}>
            تحميـلات
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {downloadItems.map((item, index) => (
              <Grid item xs={1200} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  component="a"
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    p: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease-in-out',
                    bgcolor: 'white',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 25px rgba(0,0,0,0.2)' },
                    width:"310px"
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', textAlign: 'right', flex: 1, fontSize: '1rem', lineHeight: 1.4 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ bgcolor: '#f57c00', p: 1.5, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 2 }}>
                    {item.icon}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
     {/* Courses Slide Show - Flat Design Style مثل Udemy */}
     <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#fff' }} dir="rtl">
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#1c1d1f', pr: 2 }}>
      البرامج التدريبية     
       </Typography>
      
      <Box sx={{ position: 'relative', px: { xs: 2, md: 0 } }}>
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000 }}
          navigation={{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }}
          spaceBetween={15}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
            1440: { slidesPerView: 5 },
          }}
        >
          {courses.map((course, index) => (
            <SwiperSlide key={index}>
              <Card
                onMouseEnter={(e) => handlePopoverOpen(e, course)}
                onMouseLeave={handlePopoverClose}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 5, // Udemy uses flat edges
                  border: '0.5px solid #0865a8',
                  boxShadow: 'none',
                  transition: '0.1s',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.5 },
                }}
              >
                {/* Header: Course Icon */}
                <Box sx={{ height: 135, overflow: 'hidden', bgcolor: '#f7f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box 
                    component="img" 
                    src={course.icon} 
                    alt={course.title} 
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </Box>
                <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ 
                    lineHeight: 1.2, 
                    mb: 0.5, 
                    height: 40, 
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {course.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    {course.subtitle}
                  </Typography>
                  
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" color="#b4690e" sx={{ ml: 0.5 }}>4.8</Typography>
                    <Rating value={4.8} precision={0.1} size="small" readOnly />
                  </Box> */}

                  <Typography variant="h6" fontWeight="bold">
                    {course.Price} 100ج.م
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 1.5, pt: 1}}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: '#0865a8',
                      borderRadius: 5,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#070707' },
                    }}
                  >
                    إضافة إلى السلة
                  </Button>
                </CardActions>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <Box className="custom-prev" sx={{ position: 'absolute', left: -25, top: '40%', zIndex: 10, bgcolor: '#0865a8', color: 'white', 
        borderRadius: '50%', width: 48, height: 48, display: {xs: 'none', md: 'flex'}, 
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgb(59, 85, 107)' }}>
          <Typography variant="h4" sx={{ mt: -0.5 }}>‹</Typography>
        </Box>
        <Box className="custom-next" sx={{ position: 'absolute', right: -25, top: '40%', zIndex: 10, bgcolor: '#0865a8', color: 'white', 
        borderRadius: '50%', width: 48, height: 48, display: {xs: 'none', md: 'flex'}, 
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #6a6f73' }}>
          <Typography variant="h4" sx={{ mt: -0.5 }}>›</Typography>
        </Box>
      </Box>

      {/* Popover Expansion (RTL Optimized) */}
      <Popover
        sx={{ 
          pointerEvents: 'none', // Allows mouse to pass through the invisible backdrop
          display: { xs: 'none', lg: 'block' } 
        }}
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
        disableRestoreFocus
        // --- ADD THIS PART ---
        PaperProps={{
          onMouseEnter: () => {
            if (closeTimer) clearTimeout(closeTimer); // Don't hide if mouse enters popover
          },
          onMouseLeave: handlePopoverClose, // Start the timer if mouse leaves popover
          sx: { pointerEvents: 'auto' } // Make the popover content clickable/hoverable
        }}
      >
        <Box sx={{ p: 10, maxWidth: 350, bgcolor: '#fff', pointerEvents: 'auto' }} >
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
            {selectedCourse?.title}
          </Typography>
          <Typography variant="caption" color="success.main" fontWeight="bold" display="block" sx={{ mb: 1 }}>
            تم التحديث مؤخراً
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedCourse?.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            {['شامل للمبتدئين', 'تطبيقات عملية', 'شهادة معتمدة'].map((text, i) => (
              <Typography key={i} variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>✓</span> {text}
              </Typography>
            ))}
          </Box>
          
          <Button fullWidth variant="outlined" sx={{ borderColor: '#070707', color: '#0865a8', fontWeight: 'bold', borderRadius: 5 }}>
            إقرأ المزيد
          </Button>
        </Box>
      </Popover>
    </Container>

    <div>
     
      <StatsSection />
      
    </div>

{/* Technical Education Section - Tight spacing */}
<Box sx={{ py: 2 }}>
        <TechnicalEducationSection />
      </Box>


{/* Latest News - 5 Items in Swiper - Modern Flat Style */}
<Container maxWidth="lg" sx={{ py: 1, bgcolor: '#f8f9fa' }}>
  <Typography
    variant="h4"
    fontWeight="bold"
    textAlign="center"
    sx={{
      mb: 1,
      color: '#0d47a1',
      fontFamily: '"Droid Arabic Kufi", serif',
    }}
  >
    أحدث الأخبــار
  </Typography>

  <Box sx={{ position: 'relative' }}>
    <Swiper
      modules={[Autoplay, Navigation]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      navigation={{
        nextEl: '.news-swiper-next',
        prevEl: '.news-swiper-prev',
      }}
      loop={true}
      spaceBetween={25}
      slidesPerView={4}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 5 },
      }}
      sx={{ pb: 40 }}
    >
      {newsItems.slice(0, 5).map((news) => (  // Show only latest 5
        <SwiperSlide key={news.id}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              bgcolor: 'white',
              '&:hover': {
                transform: 'translateY(-12px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
              },
            }}
          >
            {/* Square Image Area */}
            <Box sx={{ position: 'relative', paddingTop: '70%', bgcolor: '#e3f2fd' }}>
              <img
                src={news.image}
                alt={news.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Date Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'rgba(13, 71, 161, 0.9)',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 5,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(4px)',
                }}
              >
                {news.date}
              </Box>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 5, textAlign: 'right' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  fontFamily: '"Droid Arabic Kufi", serif',
                  lineHeight: 1.2,
                  height: 70,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {news.title}
              </Typography>

              <Button
                variant="contained"
                size="small"
                component={Link}
                to={news.link}
                sx={{
                  mt: 3,
                  bgcolor: '#f57c00',
                  borderRadius: 30,
                  px: 5,
                  py: 1,
                  fontSize: '0.95rem',
                  '&:hover': { bgcolor: '#e65100' },
                }}
              >
                اقرأ المزيد
              </Button>
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Custom Navigation Arrows */}
    <Box
      className="news-swiper-prev"
      sx={{
        position: 'absolute',
        left: -60,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        bgcolor: 'white',
        borderRadius: '50%',
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 6,
        cursor: 'pointer',
        '&:hover': { bgcolor: '#f0f0f0' },
      }}
    >
      <Typography sx={{ fontSize: '40px', color: '#0d47a1' }}>‹</Typography>
    </Box>

    <Box
      className="news-swiper-next"
      sx={{
        position: 'absolute',
        right: -60,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        bgcolor: 'white',
        borderRadius: '50%',
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 6,
        cursor: 'pointer',
        '&:hover': { bgcolor: '#f0f0f0' },
      }}
    >
      <Typography sx={{ fontSize: '40px', color: '#0d47a1' }}>›</Typography>
    </Box>
  </Box>
</Container>
      <div>
      {/* Your other sections */}
      <CustomersSection />
      {/* More content */}
    </div>
    </Box>
  );
};

export default Home;
