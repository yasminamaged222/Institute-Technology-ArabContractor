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
        const fetchNewest20Courses = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('🔄 Step 1: Fetching categories tree...');
                const categoriesResponse = await fetch(`${API_BASE_URL}/Categories/tree`);
                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                const categoriesData = await categoriesResponse.json();
                console.log('✅ Categories data received');

                const programSlugs = [];
                const extractSlugs = (categories) => {
                    if (!categories || !Array.isArray(categories)) return;
                    categories.forEach(category => {
                        if (category.slug) programSlugs.push(category.slug);
                        if (category.subCategories && Array.isArray(category.subCategories)) extractSlugs(category.subCategories);
                        if (category.children && Array.isArray(category.children)) extractSlugs(category.children);
                    });
                };

                if (Array.isArray(categoriesData)) extractSlugs(categoriesData);
                else if (categoriesData.categories) extractSlugs(categoriesData.categories);
                else if (categoriesData.data) extractSlugs(categoriesData.data);

                console.log(`📦 Found ${programSlugs.length} program slugs:`, programSlugs);
                if (programSlugs.length === 0) throw new Error('No program slugs found in categories tree');

                console.log('🔄 Step 2: Fetching courses from all programs...');
                const allCourses = [];

                for (const slug of programSlugs) {
                    try {
                        const res = await fetch(`${API_BASE_URL}/Course/programs/${slug}/courses`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.courses && Array.isArray(data.courses)) {
                                data.courses.forEach(course => {
                                    if (course && course.id && course.slug) {
                                        allCourses.push({ ...course, programSlug: slug });
                                    }
                                });
                                if (data.courses.length > 0) console.log(`✅ ${slug}: ${data.courses.length} courses`);
                            }
                        }
                    } catch (err) {
                        console.log(`❌ ${slug}: ${err.message}`);
                    }
                }

                console.log(`📊 Total courses collected: ${allCourses.length}`);
                if (allCourses.length === 0) { setError('لا توجد دورات متاحة حالياً'); setLoading(false); return; }

                const sortedCourses = allCourses.sort((a, b) => {
                    const dateA = a.date ? new Date(a.date) : new Date(0);
                    const dateB = b.date ? new Date(b.date) : new Date(0);
                    return dateB - dateA;
                });

                const top20 = sortedCourses.slice(0, 20);
                console.log(`🎯 Selected ${top20.length} newest courses`);

                const transformedCourses = top20.map(apiCourse => {
                    const originalPrice = apiCourse.cost ? apiCourse.cost / 0.6 : 0;
                    return {
                        id: apiCourse.id,
                        slug: apiCourse.slug,
                        title: apiCourse.title || 'دورة تدريبية',
                        subtitle: apiCourse.place || 'دورة تدريبية',
                        description: apiCourse.description || 'دورة تدريبية شاملة ومتخصصة',
                        icon: apiCourse.image || 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg',
                        currentPrice: apiCourse.cost || 0,
                        originalPrice: originalPrice,
                        date: apiCourse.date || '',
                        place: apiCourse.place || '',
                        programSlug: apiCourse.programSlug || '',
                        isFree: !apiCourse.cost || apiCourse.cost === 0
                    };
                }).filter(c => c && c.id && c.slug);

                console.log(`✨ Final courses to display: ${transformedCourses.length}`);
                setCourses(transformedCourses);

            } catch (err) {
                console.error('❌ Fatal error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNewest20Courses();
    }, []);

    // ✅ UPDATED: free courses save to enrolledCourses + navigate to /my-courses
    //             paid courses add to cart + navigate to /cart
    const handleCourseAction = (course) => {
        if (course.isFree) {
            // Save to enrolledCourses localStorage
            const existing = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            const alreadyEnrolled = existing.some(e => e.id === course.id);

            if (!alreadyEnrolled) {
                const enrollItem = {
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    place: course.place || '',
                    instructor: course.place || 'غير محدد',
                    date: course.date || '',
                    image: course.icon || 'book',
                    currentPrice: 0,
                    progress: 0,
                };
                existing.push(enrollItem);
                localStorage.setItem('enrolledCourses', JSON.stringify(existing));
                window.dispatchEvent(new Event('enrollUpdated'));
            }

            navigate('/my-courses');
        } else {
            // Add to cart for paid courses
            const existingCart = localStorage.getItem('cartItems');
            const cartItems = existingCart ? JSON.parse(existingCart) : [];

            if (!cartItems.some(item => item.id === course.id)) {
                const cartItem = {
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
                };
                cartItems.push(cartItem);
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
                <Typography variant="body2" sx={{ fontFamily: '"Droid Arabic Kufi", serif', color: '#666' }}>
                    Check console (F12) for details
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
                                    aspectRatio: '1/1',
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
                                <Box
                                    sx={{
                                        height: '30%',
                                        background: 'linear-gradient(135deg, #0865a8 0%, #064a7a 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
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
                                        <Typography sx={{ color: '#fff', fontFamily: '"Droid Arabic Kufi", serif', fontWeight: 700, fontSize: '0.8rem' }}>
                                            عرض التفاصيل ←
                                        </Typography>
                                    </Box>
                                </Box>

                                <CardContent
                                    sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden' }}
                                >
                                    <Tooltip title={course.title} arrow placement="top">
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: { xs: '0.8rem', md: '0.9rem' },
                                                lineHeight: 1.3,
                                                color: '#000',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {course.title}
                                        </Typography>
                                    </Tooltip>

                                    <Box sx={{ mt: 'auto' }}>
                                        {!course.isFree ? (
                                            <Typography sx={{ fontWeight: 800, fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1.1rem', color: '#f57c00' }}>
                                                {course.currentPrice.toFixed(2)} ج.م
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ fontWeight: 800, fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1.1rem', color: '#4caf50' }}>
                                                مجاناً
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                                            {course.place && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LocationOnIcon sx={{ fontSize: '0.8rem', color: '#0865a8' }} />
                                                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.65rem' }}>{course.place}</Typography>
                                                </Box>
                                            )}
                                            {course.date && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: '0.8rem', color: '#0865a8' }} />
                                                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.65rem' }}>{course.date}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>

                                <CardActions sx={{ p: 1.5, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCourseAction(course);
                                        }}
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