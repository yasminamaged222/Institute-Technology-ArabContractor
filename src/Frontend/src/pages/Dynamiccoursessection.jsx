import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Card, CardContent, CardActions, Button, Tooltip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ComputerIcon from '@mui/icons-material/Computer';
import ScienceIcon from '@mui/icons-material/Science';
import 'swiper/css';
import 'swiper/css/navigation';

const DynamicCoursesSection = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCourse, setHoveredCourse] = useState(null);

    const API_BASE_URL = 'https://acwebsite-icmet-test.azurewebsites.net/api';

    const getCourseIcon = (course, index) => {
        const iconSize = { xs: '1.8rem', sm: '2rem', md: '2.2rem', lg: '2.5rem' };
        const icons = [
            <SchoolIcon sx={{ fontSize: iconSize, color: '#fff' }} />,
            <MenuBookIcon sx={{ fontSize: iconSize, color: '#fff' }} />,
            <WorkspacePremiumIcon sx={{ fontSize: iconSize, color: '#fff' }} />,
            <BusinessCenterIcon sx={{ fontSize: iconSize, color: '#fff' }} />,
            <ComputerIcon sx={{ fontSize: iconSize, color: '#fff' }} />,
            <ScienceIcon sx={{ fontSize: iconSize, color: '#fff' }} />
        ];
        return icons[index % icons.length];
    };

    useEffect(() => {
        const fetchLatestCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE_URL}/Course/latest`);
                if (!response.ok) throw new Error(`Failed to fetch latest courses: ${response.status}`);

                const data = await response.json();
                const rawCourses = Array.isArray(data) ? data : data.courses || data.data || [];

                if (rawCourses.length === 0) {
                    setError('لا توجد دورات متاحة حالياً');
                    setLoading(false);
                    return;
                }

                const transformedCourses = rawCourses
                    .filter(c => c && c.childId)
                    .map(apiCourse => {
                        // ✅ Exact field names from the API response
                        const cost = apiCourse.planCost || 0;
                        const originalPrice = cost ? cost / 0.6 : 0;
                        return {
                            id: apiCourse.childId,
                            slug: apiCourse.slug || String(apiCourse.childId),
                            title: apiCourse.serviceTitle || 'دورة تدريبية',
                            description: apiCourse.courseDesc || 'دورة تدريبية شاملة ومتخصصة',
                            icon: apiCourse.image || apiCourse.imageUrl || '',
                            currentPrice: cost,
                            originalPrice,
                            date: apiCourse.courseDate || '',
                            place: apiCourse.coursePlace || '',
                            days: apiCourse.courseDays || '',
                            programSlug: apiCourse.slug || String(apiCourse.parentId) || '',
                            isFree: !cost || cost === 0
                        };
                    });

                setCourses(transformedCourses);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestCourses();
    }, []);

    const handleCourseAction = (course) => {
        if (course.isFree) {
            const existing = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            const alreadyEnrolled = existing.some(e => e.id === course.id);
            if (!alreadyEnrolled) {
                existing.push({
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    place: course.place || '',
                    instructor: course.place || 'غير محدد',
                    date: course.date || '',
                    image: course.icon || 'book',
                    currentPrice: 0,
                    progress: 0,
                });
                localStorage.setItem('enrolledCourses', JSON.stringify(existing));
                window.dispatchEvent(new Event('enrollUpdated'));
            }
            navigate('/my-courses');
        } else {
            const existingCart = localStorage.getItem('cartItems');
            const cartItems = existingCart ? JSON.parse(existingCart) : [];
            if (!cartItems.some(item => item.id === course.id)) {
                cartItems.push({
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    instructor: course.place || 'غير محدد',
                    image: course.icon || 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg',
                    rating: 4.6,
                    reviews: 2547,
                    hours: 26,
                    lectures: 12,
                    level: 'متوسط',
                    currentPrice: course.currentPrice || 0,
                    originalPrice: course.originalPrice || (course.currentPrice * 1.6) || 0,
                    badge: 'الأكثر مبيعاً',
                    coupon: 'DISCOUNT2025',
                    quantity: 1
                });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                window.dispatchEvent(new Event('cartUpdated'));
            }
            navigate('/cart');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontFamily: '"Droid Arabic Kufi", serif', color: '#0865a8' }}>
                    جاري تحميل الدورات...
                </Typography>
            </Container>
        );
    }

    if (error || courses.length === 0) {
        return (
            <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontFamily: '"Droid Arabic Kufi", serif', color: 'error.main', mb: 2 }}>
                    {error || 'لا توجد دورات متاحة حالياً'}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 6, md: 10 }, bgcolor: '#fff' }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        fontFamily: '"Droid Arabic Kufi", serif',
                        fontSize: { xs: '1.75rem', md: '3rem' },
                        mb: 1,
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                            content: '""', position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                            width: '80px', height: '4px', background: 'linear-gradient(90deg, #f57c00 0%, #0865a8 100%)', borderRadius: '2px'
                        }
                    }}
                >
                    أحدث الدورات التدريبية
                </Typography>
            </Box>

            <Box sx={{ position: 'relative', px: { lg: 5 } }}>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    loop={false}
                    autoplay={false}
                    allowTouchMove={true}
                    navigation={{ prevEl: '.custom-prev', nextEl: '.custom-next' }}
                    breakpoints={{
                        480: { slidesPerView: 1.5 },
                        640: { slidesPerView: 2 },
                        900: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 }
                    }}
                >
                    {courses.map((course, index) => (
                        <SwiperSlide key={course.id}>
                            <Card
                                onClick={() => navigate(`/course/${course.slug}`)}
                                onMouseEnter={() => setHoveredCourse(course.id)}
                                onMouseLeave={() => setHoveredCourse(null)}
                                sx={{
                                    width: '100%',
                                    minHeight: 300,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: '2px solid',
                                    borderColor: hoveredCourse === course.id ? '#f57c00' : '#e0e0e0',
                                    transform: hoveredCourse === course.id ? 'translateY(-5px)' : 'none',
                                    boxShadow: hoveredCourse === course.id ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {/* Header banner */}
                                <Box
                                    sx={{
                                        height: 90,
                                        background: 'linear-gradient(135deg, #0865a8 0%, #064a7a 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                                        flexShrink: 0
                                    }}
                                >
                                    {getCourseIcon(course, index)}
                                    <Box
                                        sx={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            bgcolor: 'rgba(245, 124, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: hoveredCourse === course.id ? 1 : 0, transition: 'opacity 0.3s'
                                        }}
                                    >
                                        <Typography sx={{ color: '#fff', fontFamily: '"Droid Arabic Kufi", serif', fontWeight: 700, fontSize: '0.85rem' }}>
                                            عرض التفاصيل ←
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Content */}
                                <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>

                                    {/* Title */}
                                    <Tooltip title={course.title} arrow placement="top">
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: { xs: '0.8rem', md: '0.875rem' },
                                                lineHeight: 1.4,
                                                color: '#111',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                minHeight: '2.8em'
                                            }}
                                        >
                                            {course.title}
                                        </Typography>
                                    </Tooltip>

                                    {/* Description */}
                                    {course.description && (
                                        <Typography
                                            sx={{
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: '0.7rem',
                                                color: '#666',
                                                lineHeight: 1.4,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {course.description}
                                        </Typography>
                                    )}

                                    {/* Details: place, date, days */}
                                    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>

                                        {/* Price */}
                                        <Box sx={{ mb: 0.5 }}>
                                            {!course.isFree ? (
                                                <Typography sx={{ fontWeight: 800, fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1rem', color: '#f57c00' }}>
                                                    {course.currentPrice.toFixed(2)} ج.م
                                                </Typography>
                                            ) : (
                                                <Typography sx={{ fontWeight: 800, fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1rem', color: '#4caf50' }}>
                                                    مجاناً
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Place */}
                                        {course.place && (
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                                                <LocationOnIcon sx={{ fontSize: '0.8rem', color: '#0865a8', mt: '2px', flexShrink: 0 }} />
                                                <Typography variant="caption" sx={{ color: '#555', fontSize: '0.65rem', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: 1.3 }}>
                                                    {course.place}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Date */}
                                        {course.date && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: '0.8rem', color: '#0865a8', flexShrink: 0 }} />
                                                <Typography variant="caption" sx={{ color: '#555', fontSize: '0.65rem', fontFamily: '"Droid Arabic Kufi", serif' }}>
                                                    {course.date}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Days count */}
                                        {course.days && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: '#0865a8', fontSize: '0.65rem', fontFamily: '"Droid Arabic Kufi", serif', fontWeight: 700 }}>
                                                    المدة: {course.days} أيام
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>

                                {/* Action button */}
                                <CardActions sx={{ p: 1.5, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={(e) => { e.stopPropagation(); handleCourseAction(course); }}
                                        sx={{
                                            borderColor: course.isFree ? '#27ae60' : '#0865a8',
                                            color: course.isFree ? '#27ae60' : '#0865a8',
                                            fontWeight: 600,
                                            borderRadius: 1.5,
                                            fontSize: '0.75rem',
                                            py: 0.5,
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            '&:hover': {
                                                bgcolor: course.isFree ? '#27ae60' : '#0865a8',
                                                color: '#fff',
                                                borderColor: course.isFree ? '#27ae60' : '#0865a8'
                                            }
                                        }}
                                    >
                                        {course.isFree ? 'اشترك الآن' : 'إضافة إلى السلة'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Box className="custom-prev" sx={{ position: 'absolute', left: -20, top: '50%', zIndex: 10, cursor: 'pointer', bgcolor: '#0865a8', color: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-50%)' }}>‹</Box>
                <Box className="custom-next" sx={{ position: 'absolute', right: -20, top: '50%', zIndex: 10, cursor: 'pointer', bgcolor: '#0865a8', color: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-50%)' }}>›</Box>
            </Box>
        </Container>
    );
};

export default DynamicCoursesSection;