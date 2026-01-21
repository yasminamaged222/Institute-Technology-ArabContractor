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
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
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
  const [current, setCurrent] = useState(0);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
      <Box sx={{ position: 'relative', overflowX: 'hidden' }}>
          <style>
              {`
            /* Specific Mobile Breakpoint - 588px to 599px */
          @media only screen and (min-width: 588px) and (max-width: 599px) {
            .hero-section { height: 52vh !important; }
            .hero-subtitle { font-size: 0.95rem !important; }
            .hero-title { font-size: 1.5rem !important; }
            .hero-button { font-size: 0.88rem !important; padding: 13px 26px !important; }
            .feature-card { min-height: 190px !important; }
            .feature-icon { width: 36px !important; height: 36px !important; }
            .feature-title { font-size: 0.98rem !important; }
            .feature-subtitle { font-size: 0.76rem !important; }
            .about-title { font-size: 1.4rem !important; }
            .about-text { font-size: 0.9rem !important; }
            .section-title { font-size: 1.55rem !important; }
            .course-card-height { height: 110px !important; }
            .course-title { font-size: 0.86rem !important; }
            .news-card-title { font-size: 0.86rem !important; height: 54px !important; }
    
            /* Wider Search Bar for this range */
            .search-bar-container { width: 95% !important; max-width: 550px !important; }
          }
          /* Mobile First - 320px to 479px */
          @media only screen and (min-width: 320px) and (max-width: 479px) {
            .hero-section { height: 45vh !important; }
            .hero-subtitle { font-size: 0.8rem !important; }
            .hero-title { font-size: 1.2rem !important; }
            .hero-button { font-size: 0.8rem !important; padding: 10px 20px !important; }
            .feature-card { min-height: 170px !important; }
            .feature-icon { width: 32px !important; height: 32px !important; }
            .feature-title { font-size: 0.9rem !important; }
            .feature-subtitle { font-size: 0.7rem !important; }
            .about-title { font-size: 1.2rem !important; }
            .about-text { font-size: 0.85rem !important; }
            .section-title { font-size: 1.4rem !important; }
            .course-card-height { height: 95px !important; }
            .course-title { font-size: 0.8rem !important; height: 30px !important; }
            .course-subtitle { font-size: 0.65rem !important; }
            .course-price { font-size: 0.85rem !important; }
            .course-button { font-size: 0.7rem !important; padding: 6px 12px !important; }
            .news-card-title { font-size: 0.8rem !important; height: 50px !important; }
            .news-date { font-size: 0.6rem !important; }
            .download-item-title { font-size: 0.8rem !important; }
            .download-icon { font-size: 1.1rem !important; }
          }

          /* Small Mobile - 480px to 599px */
          @media only screen and (min-width: 480px) and (max-width: 599px) {
            .hero-section { height: 50vh !important; }
            .hero-subtitle { font-size: 0.9rem !important; }
            .hero-title { font-size: 1.4rem !important; }
            .hero-button { font-size: 0.85rem !important; padding: 12px 24px !important; }
            .feature-card { min-height: 185px !important; }
            .feature-icon { width: 36px !important; height: 36px !important; }
            .feature-title { font-size: 0.95rem !important; }
            .feature-subtitle { font-size: 0.75rem !important; }
            .about-title { font-size: 1.35rem !important; }
            .about-text { font-size: 0.9rem !important; }
            .section-title { font-size: 1.5rem !important; }
            .course-card-height { height: 105px !important; }
            .course-title { font-size: 0.85rem !important; height: 32px !important; }
            .course-subtitle { font-size: 0.68rem !important; }
            .course-price { font-size: 0.9rem !important; }
            .course-button { font-size: 0.75rem !important; padding: 7px 14px !important; }
            .news-card-title { font-size: 0.85rem !important; height: 52px !important; }
            .news-date { font-size: 0.65rem !important; }
            .download-item-title { font-size: 0.85rem !important; }
            .download-icon { font-size: 1.2rem !important; }
          }

          /* Tablet Portrait - 600px to 767px */
          @media only screen and (min-width: 600px) and (max-width: 767px) {
            .hero-section { height: 55vh !important; }
            .hero-subtitle { font-size: 1rem !important; }
            .hero-title { font-size: 1.6rem !important; }
            .hero-button { font-size: 0.9rem !important; padding: 14px 28px !important; }
            .feature-card { min-height: 200px !important; }
            .feature-icon { width: 38px !important; height: 38px !important; }
            .feature-title { font-size: 1rem !important; }
            .feature-subtitle { font-size: 0.78rem !important; }
            .about-title { font-size: 1.5rem !important; }
            .about-text { font-size: 0.92rem !important; }
            .section-title { font-size: 1.65rem !important; }
            .course-card-height { height: 115px !important; }
            .course-title { font-size: 0.88rem !important; height: 34px !important; }
            .course-subtitle { font-size: 0.7rem !important; }
            .course-price { font-size: 0.95rem !important; }
            .course-button { font-size: 0.8rem !important; padding: 8px 16px !important; }
            .news-card-title { font-size: 0.88rem !important; height: 55px !important; }
            .news-date { font-size: 0.68rem !important; }
            .download-item-title { font-size: 0.88rem !important; }
            .download-icon { font-size: 1.3rem !important; }
          }

          /* Tablet Landscape - 768px to 991px */
          @media only screen and (min-width: 768px) and (max-width: 991px) {
            .hero-section { height: 60vh !important; }
            .hero-subtitle { font-size: 1.1rem !important; }
            .hero-title { font-size: 2rem !important; }
            .hero-button { font-size: 0.95rem !important; padding: 15px 32px !important; }
            .feature-card { min-height: 220px !important; }
            .feature-icon { width: 42px !important; height: 42px !important; }
            .feature-title { font-size: 1.05rem !important; }
            .feature-subtitle { font-size: 0.8rem !important; }
            .about-title { font-size: 1.65rem !important; }
            .about-text { font-size: 0.95rem !important; }
            .section-title { font-size: 1.8rem !important; }
            .course-card-height { height: 125px !important; }
            .course-title { font-size: 0.92rem !important; height: 36px !important; }
            .course-subtitle { font-size: 0.72rem !important; }
            .course-price { font-size: 1rem !important; }
            .course-button { font-size: 0.85rem !important; padding: 9px 18px !important; }
            .news-card-title { font-size: 0.92rem !important; height: 58px !important; }
            .news-date { font-size: 0.7rem !important; }
            .download-item-title { font-size: 0.92rem !important; }
            .download-icon { font-size: 1.4rem !important; }
          }

          /* Small Desktop - 992px to 1199px */
          @media only screen and (min-width: 992px) and (max-width: 1199px) {
            .hero-section { height: 70vh !important; }
            .hero-subtitle { font-size: 1.25rem !important; }
            .hero-title { font-size: 3rem !important; }
            .hero-button { font-size: 1.05rem !important; padding: 16px 40px !important; }
            .feature-card { min-height: 240px !important; }
            .feature-icon { width: 46px !important; height: 46px !important; }
            .feature-title { font-size: 1.15rem !important; }
            .feature-subtitle { font-size: 0.85rem !important; }
            .about-title { font-size: 1.85rem !important; }
            .about-text { font-size: 1.05rem !important; }
            .section-title { font-size: 2rem !important; }
            .course-card-height { height: 130px !important; }
            .course-title { font-size: 0.96rem !important; height: 38px !important; }
            .course-subtitle { font-size: 0.74rem !important; }
            .course-price { font-size: 1.08rem !important; }
            .course-button { font-size: 0.9rem !important; padding: 10px 20px !important; }
            .news-card-title { font-size: 0.96rem !important; height: 62px !important; }
            .news-date { font-size: 0.75rem !important; }
            .download-item-title { font-size: 0.96rem !important; }
            .download-icon { font-size: 1.6rem !important; }
          }

          /* Medium Desktop - 1200px to 1439px */
          @media only screen and (min-width: 1200px) and (max-width: 1439px) {
            .hero-section { height: 75vh !important; }
            .hero-subtitle { font-size: 1.4rem !important; }
            .hero-title { font-size: 3.8rem !important; }
            .hero-button { font-size: 1.15rem !important; padding: 18px 50px !important; }
            .feature-card { min-height: 250px !important; }
            .feature-icon { width: 48px !important; height: 48px !important; }
            .feature-title { font-size: 1.2rem !important; }
            .feature-subtitle { font-size: 0.88rem !important; }
            .about-title { font-size: 1.95rem !important; }
            .about-text { font-size: 1.08rem !important; }
            .section-title { font-size: 2.08rem !important; }
            .course-card-height { height: 133px !important; }
            .course-title { font-size: 0.98rem !important; height: 39px !important; }
            .course-subtitle { font-size: 0.75rem !important; }
            .course-price { font-size: 1.1rem !important; }
            .course-button { font-size: 0.93rem !important; padding: 10px 20px !important; }
            .news-card-title { font-size: 1rem !important; height: 66px !important; }
            .news-date { font-size: 0.78rem !important; }
            .download-item-title { font-size: 0.98rem !important; }
            .download-icon { font-size: 1.8rem !important; }
          }

          /* Large Desktop - 1440px to 1919px */
          @media only screen and (min-width: 1440px) and (max-width: 1919px) {
            .hero-section { height: 80vh !important; }
            .hero-subtitle { font-size: 1.55rem !important; }
            .hero-title { font-size: 4.3rem !important; }
            .hero-button { font-size: 1.25rem !important; padding: 20px 56px !important; }
            .feature-card { min-height: 260px !important; }
            .feature-icon { width: 50px !important; height: 50px !important; }
            .feature-title { font-size: 1.25rem !important; }
            .feature-subtitle { font-size: 0.9rem !important; }
            .about-title { font-size: 2rem !important; }
            .about-text { font-size: 1.1rem !important; }
            .section-title { font-size: 2.125rem !important; }
            .course-card-height { height: 135px !important; }
            .course-title { font-size: 1rem !important; height: 40px !important; }
            .course-subtitle { font-size: 0.75rem !important; }
            .course-price { font-size: 1.125rem !important; }
            .course-button { font-size: 0.95rem !important; padding: 10px 20px !important; }
            .news-card-title { font-size: 1.08rem !important; height: 68px !important; }
            .news-date { font-size: 0.8rem !important; }
            .download-item-title { font-size: 1rem !important; }
            .download-icon { font-size: 2rem !important; }
          }

          /* Extra Large Desktop - 1920px and above */
          @media only screen and (min-width: 1920px) {
            .hero-section { height: 85vh !important; }
            .hero-subtitle { font-size: 1.7rem !important; }
            .hero-title { font-size: 5rem !important; }
            .hero-button { font-size: 1.35rem !important; padding: 22px 64px !important; }
            .feature-card { min-height: 280px !important; }
            .feature-icon { width: 54px !important; height: 54px !important; }
            .feature-title { font-size: 1.35rem !important; }
            .feature-subtitle { font-size: 0.95rem !important; }
            .about-title { font-size: 2.2rem !important; }
            .about-text { font-size: 1.15rem !important; }
            .section-title { font-size: 2.3rem !important; }
            .course-card-height { height: 145px !important; }
            .course-title { font-size: 1.05rem !important; height: 42px !important; }
            .course-subtitle { font-size: 0.78rem !important; }
            .course-price { font-size: 1.2rem !important; }
            .course-button { font-size: 1rem !important; padding: 11px 22px !important; }
            .news-card-title { font-size: 1.15rem !important; height: 72px !important; }
            .news-date { font-size: 0.85rem !important; }
            .download-item-title { font-size: 1.05rem !important; }
            .download-icon { font-size: 2.2rem !important; }
          }
        `}
          </style>
      {/* Hero Slider */}
          <Box className="hero-section" sx={{ position: 'relative' }}>
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
                      px: 2,

          }}
        >
                  <Typography className="hero-subtitle" variant="h6" gutterBottom sx={{ opacity: 0.9, mb: 1 }}>
                      {slide.subtitle}
                  </Typography>
                  <Typography className="hero-title" variant="h3" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2, mb: 2 }}>
                      {slide.title}
                  </Typography>
          <Button
                      className="hero-button"
                      variant="contained"
                      size="large"
            sx={{
                mt: 2,
              bgcolor: '#f57c00',
              color: 'white',
              borderRadius: 30,
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                '&:hover': {
                    bgcolor: '#e65100',
                    transform: 'scale(1.05)'
                },
                transition: 'all 0.3s'
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
                  top: { xs: -30, sm: -40, md: -100 },
                  zIndex: 2,
                  px: 2,
                  mb: { xs: 4, md: -5 }
              }}
          >
              <Grid container spacing={2} justifyContent="center">
          {features.map((feature, index) => (
              <Grid item xs={12} sm={4} md={4} key={index}>
                  <Card
                      className="feature-card"
                      sx={{
                          height: '100%',
                          borderRadius: 4,
                          boxShadow: 8,
                          bgcolor: 'white',
                          textAlign: 'center',
                          transition: '0.3s',
                          '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: 16,
                          },
                      }}
                  >
                      <Box sx={{ pt: 2 }}>
                          <Box
                              component="img"
                              src={feature.icon}
                              alt="icon"
                              className="feature-icon"
                              sx={{
                                  display: 'block',
                                  mx: 'auto'
                              }}
                          />
                </Box>
                      <CardContent sx={{ px: 2, pt: 1.5 }}>
                          <Typography
                              className="feature-title"
                              variant="h6"
                              gutterBottom
                              fontWeight="bold"
                              color="#0d47a1"
                          >
                              {feature.title}
                          </Typography>
                          <Typography
                              className="feature-subtitle"
                              variant="caption"
                              color="text.secondary"
                              sx={{ lineHeight: 1.6 }}
                          >
                              {feature.subtitle}
                          </Typography>
                </CardContent>
                      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#f57c00',
                      borderRadius: 30,
                        px: 3,
                        py: 1,
                        fontSize: '0.75rem',
                      '&:hover': { bgcolor: '#e65100' },
                    }}
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
          <Box
              component="section"
              sx={{
                  bgcolor: 'white',
                  py: { xs: 8, md: 10 },
                  my: 6, // Adds space between this and other sections
                  borderTop: '1px solid #eee',
                  borderBottom: '1px solid #eee'
              }}
          >
              <Container maxWidth="lg">
                  <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row-reverse' },
                      alignItems: 'center',
                      gap: { xs: 4, md: 8 },
                  }}>
                      {/* Image Side */}
                      <Box sx={{ flex: { xs: '1', md: '0 0 45%' }, width: '100%', maxWidth: { xs: '100%', md: '500px' } }}>
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
                      </Box>

                      {/* Text Side */}
                      <Box sx={{ flex: '1', textAlign: { xs: 'left', md: 'left' } }}>
                          <Typography
                              variant="h4"
                              sx={{
                                  color: '#0d47a1',
                                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                                  fontWeight: 'bold',
                                  mb: { xs: 2, md: 3 },
                                  fontFamily: '"Droid Arabic Kufi", serif'

                              }}
                          >
                              المعهد التكنولوجي لهندسة التشييد والإدارة
                          </Typography>

                          <Typography
                              sx={{
                                  lineHeight: 2,
                                  color: '#555',
                                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                                  mb: 2,
                                  textAlign: { xs: 'center', md: 'justify' }
                              }}
                          >
                              توجد لدى شركة المقاولون العرب إيمانًا راسخًا بأهمية التدريب، فضلاً عن أهمية البحث العلمي والتطوير، هذه العناصر هي التي تشكل حجر الزاوية للشركة لتعزيز قدرتها التنافسية واستمرارية البقاء. وبعد توصية من المجموعة الدولية للاستشارات المتخصصة في إدارة الموارد البشرية، عند تكليفها لبحث تطوير الإدارة في المقاولون العرب، استطعنا تأسيس المعهد التكنولوجي لهندسة التشييد والإدارة في عام 1978.
                          </Typography>

                          <Typography
                              sx={{
                                  lineHeight: 1.8,
                                  color: '#555',
                                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                                  mb: 4,
                                  textAlign: { xs: 'center', md: 'justify' }
                              }}
                          >
                              للوصول إلى أعلى درجات التطوير والقدرة على الثبات وبالأخص في مجالات التسويق، إدارة الشركات، التخطيط المؤسسي، نظم المعلومات، الأشغال الكهروميكانيكية، وكذا التدريب المهني.
                          </Typography>

                          <Button
                              variant="contained"
                              component={Link}
                              to="/overview"
                              sx={{
                                  bgcolor: '#f57c00',
                                  color: 'white',
                                  borderRadius: '30px',
                                  px: { xs: 4, md: 6 },
                                  py: { xs: 1.5, md: 2 },
                                  fontSize: { xs: '0.9rem', md: '1rem' },
                                  fontWeight: 'bold',
                                  boxShadow: '0 4px 14px rgba(245, 124, 0, 0.4)',
                                  '&:hover': {
                                      bgcolor: '#e65100',
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 6px 20px rgba(230, 81, 0, 0.5)'
                                  },
                                  transition: 'all 0.3s'
                              }}
                          >
                              اقرأ المزيد
                          </Button>
                      </Box>
                  </Box>
              </Container>
          </Box>
      {/* New Section: Downloads (التحميلات) */}
      <div style={{ 
        width: '100%', 
              padding: '100px 0', 
              py: { xs: 8, sm: 8, md: 12 },
              mt: { xs: 4, md: 8 },
        backgroundImage: 'linear-gradient(#070707,#0865a8)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        textAlign: 'center',
        color: 'white'
      }}>
              <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                  <Typography variant="h3" sx={{
                      fontWeight: 'bold', mb: { xs: 4, md: 6 }, fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }, fontFamily: '"Droid Arabic Kufi", serif', position: 'relative', display: 'inline-block',
              '&::after': { content: '""', position: 'absolute', bottom: -15, left: '15%', width: '70%', height: '2px', bgcolor: 'white' }
          }}>
            تحميـلات
          </Typography>
                  <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
            {downloadItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  component="a"
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                        sx={{
                            p: { xs: 2, sm: 2.5, md: 4 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: '10px',
                            transition: 'all 0.3s ease-in-out',
                            bgcolor: 'white',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: { xs: 'translateY(-3px)', md: 'translateY(-8px)' },
                                boxShadow: '0 12px 25px rgba(0,0,0,0.2)'
                            },
                        }}
                    >
                        <Box sx={{ bgcolor: '#f57c00', p: { xs: 0.8, sm: 1, md: 1.5 }, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                        <item.Icon sx={{ color: 'white', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' } }} />
                        </Box>
                        <Typography variant="h6" sx={{
                            color: '#333',
                            fontWeight: 'bold',
                            textAlign: 'right',
                            flex: 1,
                            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                            lineHeight: 1.4
                        }}
                           > {item.title}
                  </Typography>
                        
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
     {/* Courses Slide Show - Flat Design Style مثل Udemy */}
          <Container maxWidth="xl"
              sx={{
                  py: { xs: 4, sm: 6, md: 10 },
                  bgcolor: '#fff',
                  px: { xs: 2, sm: 3 }
              }}
>
              <Typography variant="h4"
                  fontWeight="bold"
                  sx={{
            mb: { xs: 3, md: 4 },
            color: '#1c1d1f',
            fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2.125rem' },
            textAlign: 'center',
          }}
          >
      البرامج التدريبية     
       </Typography>
              <Box sx={{ position: 'relative' }}>
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
                          480: { slidesPerView: 2, spaceBetween: 10 },
                          768: { slidesPerView: 3, spaceBetween: 15 },
                          1024: { slidesPerView: 4, spaceBetween: 15 },
                          1440: { slidesPerView: 5, spaceBetween: 15 },
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
                    borderRadius: { xs: 3, md: 5 },
                  border: '0.5px solid #0865a8',
                  boxShadow: 'none',
                  transition: '0.1s',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.5 },
                }}
              >
                {/* Header: Course Icon */}
                      <Box sx={{
                          height: { xs: 100, sm: 120, md: 135 },
                          overflow: 'hidden',
                          bgcolor: '#f7f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                      }}>
                          <Box
                              component="img"
                              src={course.icon}
                              alt={course.title}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                      </Box>
                      <CardContent sx={{ p: {xs: 1.2, md: 1.5 }, flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{
                              lineHeight: 1.2,
                              mb: 0.5,
                              height: { xs: 32, sm: 35, md: 40 },
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                          }}>
                    {course.title}
                  </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{
                              mb: 1, fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }
                          }}>
                    {course.subtitle}
                  </Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1.125rem' } }}>
                              100ج.م
                          </Typography>
                </CardContent>

                      <CardActions sx={{ p: { xs: 1.2, md: 1.5 }, pt: 0 }}>
                          <Button
                              fullWidth
                              variant="contained"
                              sx={{
                                  bgcolor: '#0865a8',
                                  borderRadius: { xs: 3, md: 5 },
                                  fontWeight: 'bold',
                                  textTransform: 'none',
                                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                                  py: { xs: 0.7, sm: 0.8, md: 1 },
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
                  <Box
                      className="custom-prev"
                      sx={{
                          position: 'absolute',
                          left: { xs: -15, sm: -20, md: -25 },
                          top: '40%',
                          zIndex: 10,
                          bgcolor: '#0865a8',
                          color: 'white',
                          borderRadius: '50%',
                          width: { xs: 30, sm: 35, md: 48 },
                          height: { xs: 30, sm: 35, md: 48 },
                          display: { xs: 'none', sm: 'flex' },
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '1px solid rgb(59, 85, 107)'
                      }}
                  >
                      <Typography variant="h4" sx={{ mt: -0.5, fontSize: { sm: '1.2rem', md: '2.125rem' } }}>‹</Typography>
                  </Box>
                  <Box
                      className="custom-next"
                      sx={{
                          position: 'absolute',
                          right: { xs: -15, sm: -20, md: -25 },
                          top: '40%',
                          zIndex: 10,
                          bgcolor: '#0865a8',
                          color: 'white',
                          borderRadius: '50%',
                          width: { xs: 30, sm: 35, md: 48 },
                          height: { xs: 30, sm: 35, md: 48 },
                          display: { xs: 'none', sm: 'flex' },
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '1px solid #6a6f73'
                      }}
                  >
                      <Typography variant="h4" sx={{ mt: -0.5, fontSize: { sm: '1.2rem', md: '2.125rem' } }}>›</Typography>
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
                  <Box sx={{ p: 3, maxWidth: 350, bgcolor: '#fff', pointerEvents: 'auto' }}>
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

    <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
  <StatsSection />
</Box>

{/* Technical Education Section - Tight spacing */}
<Box sx={{ py: 2 }}>
        <TechnicalEducationSection />
      </Box>


{/* Latest News - 5 Items in Swiper - Modern Flat Style */}
          <Container maxWidth="lg" sx={{
              py: { xs: 4, sm: 6, md: 10 },
              bgcolor: '#f8f9fa',
              px: { xs: 2, sm: 3 }
          }}>
              <Typography
                  variant="h4"
                  fontWeight="bold"
                  textAlign="center"
                  sx={{
                      mb: { xs: 3, sm: 4, md: 6 },
                      color: '#0d47a1',
                      fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2.125rem' },
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
      spaceBetween={20}
                      slidesPerView={3}  
                      breakpoints={{
                          600: { slidesPerView: 2, spaceBetween: 15 },
                          960: { slidesPerView: 3, spaceBetween: 20 },
                      }}
      
    >
      {newsItems.map((news) => (  // Show only latest 5
        <SwiperSlide key={news.id}>
              <Card
                  sx={{
                      height: '100%',
                      borderRadius: { xs: 3, md: 5 },
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      bgcolor: 'white',
                      '&:hover': {
                          transform: { xs: 'translateY(-5px)', md: 'translateY(-12px)' },
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
                              top: { xs: 8, md: 16 },
                              right: { xs: 8, md: 16 },
                              bgcolor: 'rgba(13, 71, 161, 0.9)',
                              color: 'white',
                              px: { xs: 1, md: 2 },
                              py: 0.5,
                              borderRadius: { xs: 3, md: 5 },
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
                              fontWeight: 500,
                              backdropFilter: 'blur(4px)',
                          }}
                      >
                {news.date}
              </Box>
            </Box>

            {/* Content */}
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                              mb: { xs: 1.5, md: 2 },
                              fontFamily: '"Droid Arabic Kufi", serif',
                              lineHeight: 1.2,
                              height: { xs: 55, sm: 60, md: 70 },
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.125rem' },
                              alignSelf: 'center' // Explicitly centers the button itself

                          }}
                      >
                {news.title}
              </Typography>
           <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 3 } }}>
              <Button
                variant="contained"
                size="small"
                component={Link}
                to={news.link}
                          sx={{
                              mt: 'auto',
                              bgcolor: '#f57c00',
                              borderRadius: 30,
                              px: { xs: 3, sm: 4, md: 5 },
                              py: 1,
                              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.95rem' },
                              '&:hover': { bgcolor: '#e65100' },
                          }}
              >
                اقرأ المزيد
                          </Button>
                      </Box>
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
                          left: { xs: -25, sm: -40, md: -60 },
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 10,
                          bgcolor: 'white',
                          borderRadius: '50%',
                          width: { xs: 40, sm: 50, md: 60 },
                          height: { xs: 40, sm: 50, md: 60 },
                          display: { xs: 'none', sm: 'flex' },
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 6,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#f0f0f0' },
                      }}
    >
    <Typography sx={{ fontSize: { sm: '30px', md: '40px' }, color: '#0d47a1' }}>‹</Typography>
    </Box>

    <Box
      className="news-swiper-next"
      sx={{
        position: 'absolute',
          right: { xs: -25, sm: -40, md: -60 },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        bgcolor: 'white',
        borderRadius: '50%',
          width: { xs: 40, sm: 50, md: 60 },
          height: { xs: 40, sm: 50, md: 60 },
          display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 6,
        cursor: 'pointer',
        '&:hover': { bgcolor: '#f0f0f0' },
      }}
    >
  <Typography sx={{ fontSize: { sm: '30px', md: '40px' }, color: '#0d47a1' }}>›</Typography>
    </Box>
  </Box>
          </Container>



      <box>
      <CustomersSection />
          </box>


    </Box>
  );
};

export default Home;
