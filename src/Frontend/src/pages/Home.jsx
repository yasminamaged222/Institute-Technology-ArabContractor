import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Grid, Card, CardContent,
    CardActions, Container, Paper, CardMedia, Tooltip,
    Rating, IconButton, Popover
} from '@mui/material';
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
import DynamicCoursesSection from './Dynamiccoursessection';
import logo from '../assets/The-Role-of-Technology-in-Modern-Society-1024x570.jpg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const slides = [
    {
        title: 'خدمات تدريبية مميزة',
        subtitle: 'يقدم المعهد خدمات مميزة',
        link: '/training-methods',
        image: '/images/banner6.jpg',
    },
    {
        title: 'ورش فى مجال تدريب الميكانيكا والكهرباء',
        subtitle: 'يقدم المعهد خدمات مميزة',
        link: '/shobra',
        image: '/images/banner3.jpg',
    },
    {
        title: 'التدريب فى موقع العمل',
        subtitle: 'يقدم المعهد خدمات مميزة',
        link: '/onsite-training',
        image: '/images/banner4.jpg',
    },
    {
        title: 'Commercial Engineering Apprenticeship (CEA)',
        subtitle: 'يقدم المعهد خدمات مميزة',
        link: '/cea-program',
        image: '/images/banner8.jpg',
    },
    {
        title: 'مدرسة المقاولون العرب الثانوية الفنية',
        subtitle: 'يقدم المعهد خدمات مميزة',
        link: '/Technical_Schools',
        image: '/images/banner7.jpg',
    },
];

const features = [
    {
        icon: 'https://static.vecteezy.com/system/resources/thumbnails/008/143/259/small/blue-book-icon-book-sign-flat-style-blue-book-symbol-vector.jpg',
        title: 'مكتبة علمية متخصصة',
        subtitle: 'نمتلك مكتبة متخصصة فى العلوم الهندسية والمالية والإدارية لخدمة قطاع البناء والتشييد',
        link: '/library',
    },
    {
        icon: 'https://www.shutterstock.com/image-vector/blue-graduation-cap-vector-icon-260nw-2627871193.jpg',
        title: 'مجموعة متميزة من المدربين',
        subtitle: 'نعتمد على الخبرات والكفاءات البشرية الفريدة التي تتسم بقدر عالي من المهارات والقدرات والحماس',
        link: '/instructors',
    },
    {
        icon: 'https://static.vecteezy.com/system/resources/previews/024/283/038/non_2x/flat-style-blue-color-laptop-icon-vector.jpg',
        title: 'التدريب عن بعد ( اونلاين )',
        subtitle: 'نسعى دائما لنصبح الأفضل في تطبيق التدريب والتطوير القائم على التكنولوجيا حيث نقوم بتصميم وإجراء دورات تدريبية عبر الإنترنت',
        link: '/online-training',
    },
];

const downloadItems = [
    {
        title: "الخطة التدريبية السنوية",
        Icon: EmojiEventsIcon,
        pdfUrl: '/pdf/ICEMT_Plan_Training.pdf'
    },
    {
        title: "التقرير الشهــرى",
        Icon: DescriptionIcon,
        pdfUrl: '/pdf/ICEMT_Monthly_Activity.pdf'
    },
    {
        title: "الخطة الاستراتيجية للمعهد",
        Icon: HomeWorkIcon,
        pdfUrl: '/pdf/StrategicPlan_2024_2030.pdf'
    }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsItems, setNewsItems] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);

    useEffect(() => {
        document.title = 'المعهد التكنولوجي لهندسة التشييد والإدارة - الصفحة الرئيسية';
    }, []);

    

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const slide = slides[currentSlide];


    useEffect(() => {
        fetch('https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch news');
                return res.json();
            })
            .then(data => {
                const latestFive = (data.data || [])
                    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                    .slice(0, 5);

                setNewsItems(latestFive);
                setNewsLoading(false);
            })
            .catch(() => setNewsLoading(false));
    }, []);

    return (
        <Box sx={{ position: 'relative', overflowX: 'hidden' }}>


            <style>
                {`
/* ===================================
   SWIPER GLOBAL FIXES
   =================================== */
.courses-swiper {
    padding: 0 !important;
    margin: 0 auto;
    overflow: visible !important;
}

.courses-swiper .swiper-wrapper {
    align-items: stretch;
}

.courses-swiper .swiper-slide {
    height: auto;
    display: flex;
}

/* ===================================
   CARD HOVER EFFECTS
   =================================== */
.MuiCard-root {
    position: relative;
    overflow: hidden;
}

.MuiCard-root::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(8, 101, 168, 0.05) 0%, rgba(6, 74, 122, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
}

.MuiCard-root:hover::before {
    opacity: 1;
}

.course-card-image {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.course-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 2;
}


/* ===================================
   MOBILE FIRST - 320px to 479px
   =================================== */
@media only screen and (min-width: 320px) and (max-width: 479px) {
    .courses-swiper { max-width: 100% !important; padding: 0 8px !important; }
    .hero-section { height: 45vh !important; }
    .hero-subtitle { font-size: 0.8rem !important; }
    .hero-title { font-size: 1.2rem !important; }
    .hero-button { font-size: 0.8rem !important; padding: 10px 20px !important; }
    .feature-card { min-height: 170px !important; width: 250px !important; max-width: 280px; margin: 0 auto; }
    .feature-icon { width: 32px !important; height: 32px !important; }
    .feature-title { font-size: 0.9rem !important; }
    .feature-subtitle { font-size: 0.7rem !important; }
    .about-title { font-size: 1.2rem !important; }
    .about-text { font-size: 0.85rem !important; }
    .section-title { font-size: 1.3rem !important; margin-bottom: 1.5rem !important; }
    .course-card-height { height: 95px !important; }
    .course-title { font-size: 0.8rem !important; min-height: 32px !important; }
    .course-subtitle { font-size: 0.65rem !important; }
    .course-price { font-size: 0.85rem !important; }
    .download-item-title { font-size: 0.8rem !important; }
    .download-icon { font-size: 1.1rem !important; }
    .search-bar-container { width: 95% !important; max-width: 300px !important; }
}

/* ===================================
   SMALL MOBILE - 480px to 599px
   =================================== */
@media only screen and (min-width: 480px) and (max-width: 599px) {
    .courses-swiper { max-width: 100% !important; padding: 0 10px !important; }
    .hero-section { height: 50vh !important; }
    .hero-subtitle { font-size: 0.9rem !important; }
    .hero-title { font-size: 1.4rem !important; }
    .hero-button { font-size: 0.85rem !important; padding: 12px 24px !important; }
    .feature-card { min-height: 180px !important; width: 300px !important; max-width: 350px; margin: 0 auto; }
    .feature-icon { width: 36px !important; height: 36px !important; }
    .feature-title { font-size: 0.95rem !important; }
    .feature-subtitle { font-size: 0.75rem !important; }
    .about-title { font-size: 1.35rem !important; }
    .about-text { font-size: 0.9rem !important; }
    .section-title { font-size: 1.5rem !important; margin-bottom: 1.75rem !important; }
    .course-card-height { height: 105px !important; }
    .course-title { font-size: 0.85rem !important; min-height: 36px !important; }
    .course-subtitle { font-size: 0.68rem !important; }
    .course-price { font-size: 0.9rem !important; }
    .course-button { font-size: 0.75rem !important; padding: 7px 14px !important; }
    .news-card-title { font-size: 0.85rem !important; height: 52px !important; }
    .news-date { font-size: 0.65rem !important; }
    .download-item-title { font-size: 0.85rem !important; }
    .download-icon { font-size: 1.2rem !important; }
    .search-bar-container { width: 95% !important; max-width: 400px !important; }
}

/* ===================================
   SPECIFIC MOBILE - 588px to 599px
   =================================== */
@media only screen and (min-width: 588px) and (max-width: 599px) {
    .hero-section { height: 52vh !important; }
    .hero-subtitle { font-size: 0.95rem !important; }
    .hero-title { font-size: 1.5rem !important; }
    .hero-button { font-size: 0.88rem !important; padding: 13px 26px !important; }
    .feature-card { min-height: 190px !important; width: 250px !important; max-width: 400px; margin: 0 auto; }
    .feature-icon { width: 36px !important; height: 36px !important; }
    .feature-title { font-size: 0.98rem !important; }
    .feature-subtitle { font-size: 0.76rem !important; }
    .about-title { font-size: 1.4rem !important; }
    .about-text { font-size: 0.9rem !important; }
    .section-title { font-size: 1.55rem !important; }
    .course-card-height { height: 110px !important; }
    .course-title { font-size: 0.86rem !important; }
    .news-card-title { font-size: 0.86rem !important; height: 54px !important; }
    .search-bar-container { width: 95% !important; max-width: 550px !important; }
}

/* ===================================
   TABLET PORTRAIT - 600px to 767px
   =================================== */
@media only screen and (min-width: 600px) and (max-width: 767px) {
    .courses-swiper { max-width: 100% !important; padding: 0 12px !important; }
    .hero-section { height: 55vh !important; }
    .hero-subtitle { font-size: 1rem !important; }
    .hero-title { font-size: 1.6rem !important; }
    .hero-button { font-size: 0.9rem !important; padding: 14px 28px !important; }
    .feature-card { min-height: 200px !important;width: 250px !important; max-width: 350px; }
    .feature-icon { width: 38px !important; height: 38px !important; }
    .feature-title { font-size: 1rem !important; }
    .feature-subtitle { font-size: 0.78rem !important; }
    .about-title { fontSize: 1.5rem !important; }
    .about-text { fontSize: 0.92rem !important; }
    .section-title { fontSize: 1.65rem !important; margin-bottom: 2rem !important; }
    .course-card-height { height: 115px !important; }
    .course-title { font-size: 0.88rem !important; min-height: 38px !important; }
    .course-subtitle { font-size: 0.7rem !important; }
    .course-price { font-size: 0.95rem !important; }
    .course-button { font-size: 0.8rem !important; padding: 8px 16px !important; }
    .news-card-title { font-size: 0.88rem !important; height: 55px !important; }
    .news-date { font-size: 0.68rem !important; }
    .download-item-title { font-size: 0.88rem !important; }
    .download-icon { font-size: 1.3rem !important; }
}

/* ===================================
   TABLET LANDSCAPE - 768px to 991px
   =================================== */
@media only screen and (min-width: 768px) and (max-width: 991px) {
    .courses-swiper { max-width: 100% !important; padding: 0 15px !important; }
    .hero-section { height: 60vh !important; }
    .hero-subtitle { font-size: 1.1rem !important; }
    .hero-title { font-size: 2rem !important; }
    .hero-button { font-size: 0.95rem !important; padding: 15px 32px !important; }
    .feature-card { min-height: 220px !important;width: 300px !important; }
    .feature-icon { width: 42px !important; height: 42px !important; }
    .feature-title { font-size: 1.05rem !important; }
    .feature-subtitle { font-size: 0.8rem !important; }
    .about-title { font-size: 1.65rem !important; }
    .about-text { font-size: 0.95rem !important; }
    .section-title { font-size: 1.8rem !important; margin-bottom: 2.5rem !important; }
    .course-card-height { height: 125px !important; }
    .course-title { font-size: 0.92rem !important; min-height: 40px !important; }
    .course-subtitle { font-size: 0.72rem !important; }
    .course-price { font-size: 1rem !important; }
    .course-button { font-size: 0.85rem !important; padding: 9px 18px !important; }
    .news-card-title { font-size: 0.92rem !important; height: 58px !important; }
    .news-date { font-size: 0.7rem !important; }
    .download-item-title { font-size: 0.92rem !important; }
    .download-icon { font-size: 1.4rem !important; }
}

/* ===================================
   SMALL DESKTOP - 992px to 1199px
   =================================== */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
    .courses-swiper { max-width: 100% !important; }
    .hero-section { height: 70vh !important; }
    .hero-subtitle { font-size: 1.25rem !important; }
    .hero-title { font-size: 3rem !important; }
    .hero-button { font-size: 1.05rem !important; padding: 16px 40px !important; }
    .feature-card { min-height: 240px !important; width: 300px !important; }
    .feature-icon { width: 46px !important; height: 46px !important; }
    .feature-title { font-size: 1.15rem !important; }
    .feature-subtitle { font-size: 0.85rem !important; }
    .about-title { font-size: 1.85rem !important; }
    .about-text { font-size: 1.05rem !important; }
    .section-title { font-size: 2rem !important; margin-bottom: 3rem !important; }
    .course-card-height { height: 130px !important; }
    .course-title { font-size: 0.96rem !important; min-height: 42px !important; }
    .course-subtitle { font-size: 0.74rem !important; }
    .course-price { font-size: 1.08rem !important; }
    .course-button { font-size: 0.9rem !important; padding: 10px 20px !important; }
    .news-card-title { font-size: 0.96rem !important; height: 62px !important; }
    .news-date { font-size: 0.75rem !important; }
    .download-item-title { font-size: 0.96rem !important; }
    .download-icon { font-size: 1.6rem !important; }
}

/* ===================================
   MEDIUM DESKTOP - 1200px to 1439px
   =================================== */
@media only screen and (min-width: 1200px) and (max-width: 1439px) {
    .courses-swiper { max-width: 100% !important; }
    .hero-section { height: 75vh !important; }
    .hero-subtitle { font-size: 1.4rem !important; }
    .hero-title { font-size: 3.8rem !important; }
    .hero-button { fontSize: 1.15rem !important; padding: 18px 50px !important; }
    .feature-card { min-height: 250px !important; width: 350px !important; }
    .feature-icon { width: 48px !important; height: 48px !important; }
    .feature-title { font-size: 1.2rem !important; }
    .feature-subtitle { font-size: 0.88rem !important; }
    .about-title { font-size: 1.95rem !important; }
    .about-text { font-size: 1.08rem !important; }
    .section-title { font-size: 2.08rem !important; margin-bottom: 3rem !important; }
    .course-card-height { height: 133px !important; }
    .course-title { font-size: 0.98rem !important; min-height: 42px !important; }
    .course-subtitle { font-size: 0.75rem !important; }
    .course-price { font-size: 1.1rem !important; }
    .course-button { font-size: 0.93rem !important; padding: 10px 20px !important; }
    .news-card-title { font-size: 1rem !important; height: 66px !important; }
    .news-date { font-size: 0.78rem !important; }
    .download-item-title { font-size: 0.98rem !important; }
    .download-icon { font-size: 1.8rem !important; }
}

/* ===================================
   LARGE DESKTOP - 1440px to 1919px
   =================================== */
@media only screen and (min-width: 1440px) and (max-width: 1919px) {
    .courses-swiper { max-width: 100% !important; }
    .hero-section { height: 80vh !important; }
    .hero-subtitle { font-size: 1.55rem !important; }
    .hero-title { font-size: 4.3rem !important; }
    .hero-button { font-size: 1.25rem !important; padding: 20px 56px !important; }
    .feature-card { min-height: 260px !important; width: 350px !important; }
    .feature-icon { width: 50px !important; height: 50px !important; }
    .feature-title { font-size: 1.25rem !important; }
    .feature-subtitle { font-size: 0.9rem !important; }
    .about-title { font-size: 2rem !important; }
    .about-text { font-size: 1.1rem !important; }
    .section-title { font-size: 2.125rem !important; margin-bottom: 3rem !important; }
    .course-card-height { height: 135px !important; }
    .course-title { font-size: 1rem !important; min-height: 44px !important; }
    .course-subtitle { font-size: 0.75rem !important; }
    .course-price { font-size: 1.125rem !important; }
    .course-button { font-size: 0.95rem !important; padding: 10px 20px !important; }
    .news-card-title { font-size: 1.08rem !important; height: 68px !important; }
    .news-date { font-size: 0.8rem !important; }
    .download-item-title { font-size: 1rem !important; }
    .download-icon { font-size: 2rem !important; }
}

/* ===================================
   EXTRA LARGE DESKTOP - 1920px+
   =================================== */
@media only screen and (min-width: 1920px) {
    .courses-swiper { max-width: 100% !important; }
    .hero-section { height: 85vh !important; }
    .hero-subtitle { font-size: 1.7rem !important; }
    .hero-title { font-size: 5rem !important; }
    .hero-button { font-size: 1.35rem !important; padding: 22px 64px !important; }
    .feature-card { min-height: 280px !important; width: 350px !important; }
    .feature-icon { width: 54px !important; height: 54px !important; }
    .feature-title { font-size: 1.35rem !important; }
    .feature-subtitle { font-size: 0.95rem !important; }
    .about-title { font-size: 2.2rem !important; }
    .about-text { font-size: 1.15rem !important; }
    .section-title { font-size: 2.3rem !important; margin-bottom: 3.5rem !important; }
    .course-card-height { height: 145px !important; }
    .course-title { font-size: 1.05rem !important; min-height: 46px !important; }
    .course-subtitle { font-size: 0.78rem !important; }
    .course-price { font-size: 1.2rem !important; }
    .course-button { font-size: 1rem !important; padding: 11px 22px !important; }
    .news-card-title { font-size: 1.15rem !important; height: 72px !important; }
    .news-date { font-size: 0.85rem !important; }
    .download-item-title { font-size: 1.05rem !important; }
    .download-icon { fontSize: 2.2rem !important; }
}

/* ===================================
   NAVIGATION ARROWS RESPONSIVE
   =================================== */
@media only screen and (max-width: 599px) {
    .custom-prev, .custom-next { display: none !important; }
}

.custom-prev, .custom-next {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 2px 8px rgba(8, 101, 168, 0.2);
}

.custom-prev:hover, .custom-next:hover {
    box-shadow: 0 4px 16px rgba(8, 101, 168, 0.3) !important;
}

.custom-prev:active, .custom-next:active {
    transform: translateY(-50%) scale(0.95) !important;
}


/* ===================================
   RTL OPTIMIZATION
   =================================== */
[dir="rtl"] .courses-swiper { direction: rtl; }
[dir="rtl"] .custom-prev { right: -25px; left: auto; }
[dir="rtl"] .custom-next { left: -25px; right: auto; }

/* ===================================
   PERFORMANCE OPTIMIZATIONS
   =================================== */
.courses-swiper * {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-perspective: 1000;
    perspective: 1000;
}

/* Smooth scrolling */
.courses-swiper .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent text selection during swipe */
.courses-swiper {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Enable text selection inside cards */
.MuiCard-root {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
}

`}
            </style>



            {/* Hero Slider */}
            <Box
                className="hero-section"
                sx={{
                    position: 'relative',
                    height: '600px',
                    overflow: 'hidden',
                    borderBottomLeftRadius: '24px',
                    borderBottomRightRadius: '24px'
                }}
            >{/* Background Image */}
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
                        borderBottomLeftRadius: '24px',
                        borderBottomRightRadius: '24px'
                    }}
                />
                {/* Dark Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.45)',
                        borderBottomLeftRadius: '24px',
                        borderBottomRightRadius: '24px'
                    }}
                />
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
                    <Typography
                        className="hero-subtitle"
                        variant="h6"
                        gutterBottom
                        sx={{
                            opacity: 0.9,
                            mb: 1,
                            fontFamily: '"Droid Arabic Kufi", serif'
                        }}
                    >
                        {slide.subtitle}
                    </Typography>

                    <Typography
                        className="hero-title"
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            lineHeight: 1.2,
                            mb: 3,
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}
                    >
                        {slide.title}
                    </Typography>

                    <Button
                        variant="contained"
                        href={slide.link}
                        sx={{
                            mt: { xs: 2, sm: 3 },
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontFamily: '"Droid Arabic Kufi", serif',
                            bgcolor: '#f57c00',
                            borderRadius: '25px',
                            '&:hover': {
                                bgcolor: '#e65100',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s ease',
                            }
                        }}
                    >
                        اقرأ المزيد
                    </Button>

                </Box>
                {/* Navigation Controls */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 10,
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center',
                        zIndex: 3,
                    }}
                >
                    {/* Previous Button */}
                    <IconButton
                        onClick={handlePrevSlide}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            width: 45,
                            height: 45,
                            '&:hover': {
                                bgcolor: '#f57c00',
                                transform: 'scale(1.1)',
                                border: '2px solid #f57c00',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <KeyboardArrowUpIcon />
                    </IconButton>

                    {/* Dots */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {slides.map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                sx={{
                                    width: 10,
                                    height: currentSlide === index ? 28 : 10,
                                    borderRadius: '5px',
                                    bgcolor:
                                        currentSlide === index
                                            ? '#f57c00'
                                            : 'rgba(255,255,255,0.6)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        ))}
                    </Box>

                    {/* Next Button */}
                    <IconButton
                        onClick={handleNextSlide}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            width: 45,
                            height: 45,
                            '&:hover': {
                                bgcolor: '#f57c00',
                                transform: 'scale(1.1)',
                                border: '2px solid #f57c00',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </Box>

            </Box>


            {/* 3 Small Cards */}
            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    top: { xs: -30, sm: -40, md: -65 },
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
                                        sx={{
                                            color: '#0865a8',
                                            fontFamily: '"Droid Arabic Kufi", serif'
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        className="feature-subtitle"
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.6,
                                            fontFamily: '"Droid Arabic Kufi", serif'
                                        }}
                                    >
                                        {feature.subtitle}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Button
                                        component={Link}
                                        to={feature.link}
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            bgcolor: '#f57c00',
                                            borderRadius: 30,
                                            px: 3,
                                            py: 1,
                                            fontSize: '0.75rem',
                                            fontFamily: '"Droid Arabic Kufi", serif',
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
                    my: 6,
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
                                    color: '#0865a8',
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
                                    color: '#333',
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    mb: 2,
                                    textAlign: { xs: 'center', md: 'justify' },
                                    fontFamily: '"Droid Arabic Kufi", serif'
                                }}
                            >
                                توجد لدى شركة المقاولون العرب إيمانًا راسخًا بأهمية التدريب، فضلاً عن أهمية البحث العلمي والتطوير، هذه العناصر هي التي تشكل حجر الزاوية للشركة لتعزيز قدرتها التنافسية واستمرارية البقاء. وبعد توصية من المجموعة الدولية للاستشارات المتخصصة في إدارة الموارد البشرية، عند تكليفها لبحث تطوير الإدارة في المقاولون العرب، استطعنا تأسيس المعهد التكنولوجي لهندسة التشييد والإدارة في عام 1978.
                            </Typography>

                            <Typography
                                sx={{
                                    lineHeight: 1.8,
                                    color: '#333',
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    mb: 4,
                                    textAlign: { xs: 'center', md: 'justify' },
                                    fontFamily: '"Droid Arabic Kufi", serif'
                                }}
                            >
                                للوصول إلى أعلى درجات التطوير والقدرة على الثبات وبالأخص في مجالات التسويق، إدارة الشركات، التخطيط المؤسسي، نظم المعلومات، الأشغال الكهروميكانيكية، وكذا التدريب المهني.
                            </Typography>

                            {/* Button centered under text */}
                            <Box sx={{ textAlign: 'center' }}>
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
                                        fontFamily: '"Droid Arabic Kufi", serif',
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

                    </Box>
                </Container>
            </Box>

            {/* New Section: Downloads (التحميلات) */}
            <div style={{
                width: '100%',
                padding: '50px 0',
                backgroundImage: 'linear-gradient(#000000, #0865a8)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                color: 'white',
                direction: 'rtl'
            }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="h3"
                        className="section-title"
                        sx={{
                            fontWeight: 'bold',
                            mb: { xs: 4, md: 6 },
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                            fontFamily: '"Droid Arabic Kufi", serif',
                            position: 'relative',
                            display: 'inline-block',
                            textAlign: 'center',
                            width: '100%',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -15,
                                left: '15%',
                                width: '70%',
                                height: '2px',
                                bgcolor: 'white'
                            }
                        }}
                    >
                        تحميـلات
                    </Typography>

                  <Grid container spacing={3} justifyContent="center">
                        {downloadItems.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Paper
                                    elevation={2}
                                    component="a"
                                    href={item.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        p: 2.5,
                                        display: 'flex',
                                        flexDirection: 'row', 
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease',
                                        bgcolor: 'white',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        // --- THE FIX FOR UNIFORM SIZE ---
                                        width: '300px',      // Fixed width
                                        height: '110px',     // Fixed height ensures all boxes match
                                        boxSizing: 'border-box', 
                                        // --------------------------------
                                        border: '1px solid #f0f0f0',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                            borderColor: '#f57c00'
                                        },
                                    }}
                                >
                                    {/* Icon on the Right */}
                                    <Box sx={{
                                        bgcolor: '#f57c00',
                                        width: 50,
                                        height: 50,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0, // Prevents icon from squishing if text is long
                                    }}>
                                        <item.Icon sx={{ color: 'white', fontSize: '1.8rem' }} />
                                    </Box>

                                    {/* Text on the Left */}
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#333',
                                            fontWeight: '700',
                                            textAlign: 'left',
                                            flex: 1,
                                            pr: 2, 
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            fontSize: '0.918rem',
                                            lineHeight: 1.3,
                                            // --- PREVENTS TEXT FROM STRETCHING BOX ---
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2, // Limits text to 2 lines
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            // ----------------------------------------
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                </Container>
            </div>

            {/* Courses Slide Show */}
            <Box sx={{ m: 0, p: 0 }}>
                <DynamicCoursesSection />
            </Box>


            {/* Technical Education Section */}
            <Box sx={{ py: 2 }}>
                <TechnicalEducationSection />
            </Box>

            {/* Latest News - Dynamic Swiper */}
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 4, sm: 6, md: 10 },
                    bgcolor: '#f8f9fa',
                    px: { xs: 2, sm: 3 }
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{
                        mb: { xs: 3, sm: 4, md: 6 },
                        color: '#0865a8',
                        fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2.125rem' },
                        fontFamily: '"Droid Arabic Kufi", serif',
                    }}
                >
                    أحدث الأخبــار
                </Typography>

                {!newsLoading && newsItems.length > 0 && (
                    <Box sx={{ position: 'relative' }}>
                        <Swiper
                            modules={[Autoplay, Navigation]}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            navigation={{
                                nextEl: '.news-swiper-next',
                                prevEl: '.news-swiper-prev',
                            }}
                            loop
                            spaceBetween={20}
                            slidesPerView={3}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                600: { slidesPerView: 2, spaceBetween: 15 },
                                960: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {newsItems.map(news => (
                                <SwiperSlide key={news.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: { xs: 3, md: 5 },
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                            },
                                        }}
                                    >
                                        {/* Image */}
                                        <Box sx={{ position: 'relative', paddingTop: '70%' }}>
                                            <img
                                                src={news.imageUrl}
                                                alt={news.title}
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />

                                            {/* Date */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    bgcolor: 'rgba(8,101,168,.9)',
                                                    color: '#fff',
                                                    px: 2,
                                                    py: .5,
                                                    borderRadius: 4,
                                                    fontSize: '0.75rem',
                                                    fontFamily: '"Droid Arabic Kufi", serif'
                                                }}
                                            >
                                                {new Date(news.publishedAt).toLocaleDateString('ar-EG', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </Box>
                                        </Box>

                                        {/* Content */}
                                        <CardContent>
                                            <Typography
                                                fontWeight="bold"
                                                sx={{
                                                    mb: 2,
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    lineHeight: 1.3,
                                                    height: 65,
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {news.title}
                                            </Typography>

                                            <Box textAlign="center">
                                                <Button
                                                    component={Link}
                                                    to={`/news/${news.id}`}
                                                    variant="contained"
                                                    sx={{
                                                        bgcolor: '#f57c00',
                                                        borderRadius: 30,
                                                        px: 4,
                                                        fontFamily: '"Droid Arabic Kufi", serif',
                                                        '&:hover': { bgcolor: '#e65100' }
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

                        {/* Arrows */}
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
                            <Typography sx={{ fontSize: { xs: 25, sm: 30, md: 40 }, color: '#0865a8' }}>‹</Typography>
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
                            <Typography sx={{ fontSize: { xs: 25, sm: 30, md: 40 }, color: '#0865a8' }}>›</Typography>
                        </Box>

                    </Box>
                )}
            </Container>


            {/* NEW CODE - No margin or padding */}
            <Box sx={{ m: 0, p: 0 }}>
                <CustomersSection />
            </Box>
        </Box>
    );
};

export default Home;