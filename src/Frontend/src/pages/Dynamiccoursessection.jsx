import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
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

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

// ── Toast ─────────────────────────────────────────────────────────────────────
const toastAnim = `
  @keyframes toastSlideIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

const ToastNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    const borderColors = { success: '#4caf50', error: '#f44336', warning: '#ff9800' };

    return (
        <>
            <style>{toastAnim}</style>
            <div style={{
                position: 'fixed', top: '100px', right: '20px', zIndex: 9999,
                backgroundColor: '#fff', padding: '14px 20px', borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center',
                gap: '10px', maxWidth: '360px', animation: 'toastSlideIn 0.3s ease-out',
                borderRight: `4px solid ${borderColors[type]}`,
                fontFamily: '"Droid Arabic Kufi", serif', direction: 'rtl'
            }}>
                <span style={{ fontSize: '20px' }}>
                    {type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
                </span>
                <span style={{ fontSize: '14px', color: '#000', flex: 1 }}>{message}</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999', lineHeight: 1 }}>×</button>
            </div>
        </>
    );
};

// ── Icon helper ───────────────────────────────────────────────────────────────
const getCourseIcon = (index) => {
    const sz = { fontSize: '2.2rem', color: '#fff' };
    const icons = [
        <SchoolIcon sx={sz} />,
        <MenuBookIcon sx={sz} />,
        <WorkspacePremiumIcon sx={sz} />,
        <BusinessCenterIcon sx={sz} />,
        <ComputerIcon sx={sz} />,
        <ScienceIcon sx={sz} />,
    ];
    return icons[index % icons.length];
};

// ── Main Component ────────────────────────────────────────────────────────────
const DynamicCoursesSection = () => {
    const navigate = useNavigate();
    const { getToken, isSignedIn, userId } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);
    const [ownedCourseIds, setOwnedCourseIds] = useState(new Set());
    const [certificates, setCertificates] = useState({});
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    // ── Fetch owned courses ───────────────────────────────────────────────────
    const fetchOwnedCourses = useCallback(async () => {
        if (!isSignedIn) { setOwnedCourseIds(new Set()); return; }
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/course/my-courses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            setOwnedCourseIds(new Set(data.map(e => e.childId)));
        } catch {
            setOwnedCourseIds(new Set());
        }
    }, [isSignedIn, getToken]);

    // ── Fetch certificates ────────────────────────────────────────────────────
    const fetchCertificates = useCallback(async () => {
        if (!isSignedIn || !userId) return;
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/admin/certificates/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            const map = {};
            (Array.isArray(data) ? data : []).forEach(c => { if (c.courseId) map[c.courseId] = c; });
            setCertificates(map);
        } catch { /* certs optional */ }
    }, [isSignedIn, getToken, userId]);

    useEffect(() => { fetchOwnedCourses(); }, [fetchOwnedCourses, userId]);
    useEffect(() => { fetchCertificates(); }, [fetchCertificates, userId]);

    useEffect(() => {
        const handler = () => { fetchOwnedCourses(); fetchCertificates(); };
        window.addEventListener('enrollUpdated', handler);
        window.addEventListener('cartUpdated', handler);
        return () => {
            window.removeEventListener('enrollUpdated', handler);
            window.removeEventListener('cartUpdated', handler);
        };
    }, [fetchOwnedCourses, fetchCertificates]);

    // ── Fetch latest courses ──────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_BASE}/Course/latest`);
                if (!res.ok) throw new Error(`فشل تحميل الدورات: ${res.status}`);
                const data = await res.json();
                const raw = Array.isArray(data) ? data : data.courses || data.data || [];

                if (!raw.length) { setError('لا توجد دورات متاحة حالياً'); return; }

                const transformed = raw
                    .filter(c => c && c.childId)
                    .map(c => {
                        const cost = c.planCost || 0;
                        return {
                            id: c.childId,
                            slug: c.slug || String(c.childId),
                            title: c.serviceTitle || 'دورة تدريبية',
                            description: c.courseDesc || '',
                            currentPrice: cost,
                            originalPrice: cost ? cost / 0.6 : 0,
                            date: c.courseDate || '',
                            place: c.coursePlace || '',
                            days: c.courseDays || '',
                            isFree: !cost || cost === 0,
                        };
                    });

                setCourses(transformed);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ── Add to cart ───────────────────────────────────────────────────────────
    const addToCart = async (course) => {
        if (!isSignedIn) {
            showToast('الرجاء تسجيل الدخول أولاً', 'warning');
            return;
        }
        setAddingToCart(course.id);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/cart/add/${course.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: course.id, quantity: 1 }),
            });
            if (!res.ok) {
                const msgs = {
                    401: 'انتهت الجلسة، سجل دخول مرة أخرى',
                    404: 'الدورة غير موجودة',
                    409: 'الدورة موجودة بالفعل في السلة',
                    500: 'خطأ في الخادم',
                };
                throw new Error(msgs[res.status] || 'فشل إضافة الدورة');
            }

            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (!cartItems.some(i => i.id === course.id)) {
                cartItems.push({
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    instructor: course.place || 'غير محدد',
                    image: 'book',
                    currentPrice: course.currentPrice || 0,
                    originalPrice: course.originalPrice || 0,
                    quantity: 1,
                    date: course.date || '',
                    place: course.place || '',
                });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                window.dispatchEvent(new Event('cartUpdated'));
            }
            showToast('تمت إضافة الدورة إلى السلة بنجاح', 'success');
        } catch (err) {
            showToast(err.message || 'حدث خطأ', 'error');
        } finally {
            setAddingToCart(null);
        }
    };

    // ── Enroll free course ────────────────────────────────────────────────────
    const handleEnroll = (course) => {
        const existing = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        if (!existing.some(e => e.id === course.id)) {
            existing.push({
                id: course.id, slug: course.slug, title: course.title,
                place: course.place || '', instructor: course.place || 'غير محدد',
                date: course.date || '', image: 'book', currentPrice: 0, progress: 0,
            });
            localStorage.setItem('enrolledCourses', JSON.stringify(existing));
            window.dispatchEvent(new Event('enrollUpdated'));
        }
        showToast('تم التسجيل في الدورة بنجاح', 'success');
        setTimeout(() => navigate('/my-courses'), 900);
    };

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loading) return (
        <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Droid Arabic Kufi", serif', color: '#0865a8' }}>
                جاري تحميل الدورات...
            </Typography>
        </Container>
    );

    if (error || courses.length === 0) return (
        <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Droid Arabic Kufi", serif', color: 'error.main' }}>
                {error || 'لا توجد دورات متاحة حالياً'}
            </Typography>
        </Container>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 6, md: 10 }, bgcolor: '#fff' }}>

            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Section heading */}
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
                            content: '""', position: 'absolute', bottom: -8, left: '50%',
                            transform: 'translateX(-50%)', width: '80px', height: '4px',
                            background: 'linear-gradient(90deg, #f57c00 0%, #0865a8 100%)',
                            borderRadius: '2px',
                        },
                    }}
                >
                    أحدث الدورات التدريبية
                </Typography>
            </Box>

            {/* Swiper */}
            <Box sx={{ position: 'relative', px: { lg: 5 } }}>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    loop={false}
                    allowTouchMove={true}
                    navigation={{ prevEl: '.custom-prev', nextEl: '.custom-next' }}
                    breakpoints={{
                        480: { slidesPerView: 1.5 },
                        640: { slidesPerView: 2 },
                        900: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                    }}
                >
                    {courses.map((course, index) => {
                        const isOwned = ownedCourseIds.has(course.id);
                        const isAdding = addingToCart === course.id;
                        const isHovered = hoveredCourse === course.id;
                        const cert = certificates[course.id] || null;

                        const headerGradient = isOwned
                            ? 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)'
                            : course.isFree
                                ? 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)'
                                : 'linear-gradient(135deg, #0865a8 0%, #064a7a 100%)';

                        const badgeBg = isOwned ? '#4a4a8a' : course.isFree ? '#1a7a3c' : '#f57c00';
                        const badgeText = isOwned ? '✅ مسجل' : course.isFree ? 'مجاناً' : 'خصم 40%';

                        return (
                            <SwiperSlide key={course.id} style={{ height: 'auto' }}>
                                <Card
                                    onMouseEnter={() => setHoveredCourse(course.id)}
                                    onMouseLeave={() => setHoveredCourse(null)}
                                    sx={{
                                        height: cert && isOwned ? 440 : 390,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                        cursor: 'pointer',
                                        border: '2px solid',
                                        borderColor: isHovered
                                            ? (isOwned ? '#7b5ea7' : course.isFree ? '#27ae60' : '#f57c00')
                                            : '#e0e0e0',
                                        transform: isHovered ? 'translateY(-6px)' : 'none',
                                        boxShadow: isHovered
                                            ? '0 12px 28px rgba(0,0,0,0.12)'
                                            : '0 2px 8px rgba(0,0,0,0.05)',
                                    }}
                                    onClick={() => navigate(`/course/${course.slug}`)}
                                >
                                    {/* ── Card header banner ── */}
                                    <Box sx={{
                                        height: 110, flexShrink: 0,
                                        background: headerGradient,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                    }}>
                                        <Box sx={{
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            padding: '18px',
                                            backdropFilter: 'blur(8px)',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            zIndex: 2,
                                        }}>
                                            {getCourseIcon(index)}
                                        </Box>

                                        {/* Hover overlay */}
                                        <Box sx={{
                                            position: 'absolute', inset: 0, zIndex: 3,
                                            background: headerGradient,
                                            opacity: isHovered ? 0.92 : 0,
                                            transition: 'opacity 0.3s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Typography sx={{
                                                color: '#fff', fontFamily: '"Droid Arabic Kufi", serif',
                                                fontWeight: 700, fontSize: '0.9rem',
                                            }}>
                                                عرض التفاصيل ←
                                            </Typography>
                                        </Box>

                                        {/* Badge */}
                                        <Box sx={{
                                            position: 'absolute', top: 10, right: 10, zIndex: 4,
                                            backgroundColor: isOwned ? '#fff' : course.isFree ? '#fff' : badgeBg,
                                            color: isOwned ? '#4a4a8a' : course.isFree ? '#1a7a3c' : '#fff',
                                            fontSize: '11px', fontWeight: 700,
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            padding: '4px 10px', borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                        }}>
                                            {badgeText}
                                        </Box>

                                        {/* Cert ribbon */}
                                        {isOwned && cert && (
                                            <Box sx={{
                                                position: 'absolute', top: 10, left: 10, zIndex: 4,
                                                backgroundColor: 'rgba(124,58,237,0.88)',
                                                backdropFilter: 'blur(6px)',
                                                borderRadius: '8px',
                                                padding: '3px 8px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                color: '#fff',
                                                boxShadow: '0 2px 6px rgba(124,58,237,0.4)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                            }}>
                                                📜 شهادة
                                            </Box>
                                        )}
                                    </Box>

                                    {/* ── Card content ── */}
                                    <CardContent sx={{
                                        flexGrow: 1, p: '14px 14px 8px',
                                        display: 'flex', flexDirection: 'column', gap: '6px',
                                        overflow: 'hidden',
                                    }}>

                                        <Tooltip title={course.title} arrow placement="top">
                                            <Typography sx={{
                                                fontWeight: 700, fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: '0.875rem', lineHeight: 1.5, color: '#111',
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                minHeight: '2.6em', direction: 'ltr',
                                            }}>
                                                {course.title}
                                            </Typography>
                                        </Tooltip>

                                        {course.description && (
                                            <Typography sx={{
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: '0.7rem', color: '#666', lineHeight: 1.45,
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                direction: 'ltr',
                                            }}>
                                                {course.description}
                                            </Typography>
                                        )}

                                        <Box sx={{ flexGrow: 1 }} />

                                        {/* Price */}
                                        <Box sx={{ borderTop: '1px solid #f0f0f0', pt: '8px' }}>
                                            {isOwned ? (
                                                <Typography sx={{ fontWeight: 800, fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.95rem', color: '#4a4a8a' }}>
                                                    مسجل ✓
                                                </Typography>
                                            ) : course.isFree ? (
                                                <Typography sx={{ fontWeight: 800, fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.95rem', color: '#1a7a3c' }}>
                                                    مجاناً
                                                </Typography>
                                            ) : (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontWeight: 800, fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1rem', color: '#f57c00' }}>
                                                        {course.currentPrice.toFixed(2)} ج.م
                                                    </Typography>
                                                    <Typography sx={{ fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.75rem', color: '#999', textDecoration: 'line-through' }}>
                                                        {course.originalPrice.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {course.place && (
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '4px', direction: 'ltr' }}>
                                                <LocationOnIcon sx={{ fontSize: '0.8rem', color: '#0865a8', mt: '2px', flexShrink: 0 }} />
                                                <Typography variant="caption" sx={{
                                                    color: '#555', fontSize: '0.65rem', fontFamily: '"Droid Arabic Kufi", serif',
                                                    lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                }}>
                                                    {course.place}
                                                </Typography>
                                            </Box>
                                        )}

                                        {course.date && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', direction: 'ltr' }}>
                                                <AccessTimeIcon sx={{ fontSize: '0.8rem', color: '#0865a8', flexShrink: 0 }} />
                                                <Typography variant="caption" sx={{
                                                    color: '#555', fontSize: '0.65rem', fontFamily: '"Droid Arabic Kufi", serif',
                                                    display: '-webkit-box', WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                }}>
                                                    {course.date}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>

                                    {/* ── Action buttons ── */}
                                    <CardActions sx={{ p: '0 14px 14px', flexShrink: 0, flexDirection: 'column', gap: '8px' }}>

                                        {/* Certificate download button — only if cert exists and owned */}
                                        {isOwned && cert && (
                                            <Box
                                                component="a"
                                                href={cert.url}
                                                download={cert.name}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    py: '7px',
                                                    px: '12px',
                                                    background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    textDecoration: 'none',
                                                    boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 14px rgba(124,58,237,0.45)',
                                                    },
                                                }}
                                            >
                                                <span>📜</span>
                                                <span>شهادتك جاهزة — تحميل</span>
                                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                                </svg>
                                            </Box>
                                        )}

                                        {isOwned ? (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); navigate('/my-courses'); }}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)',
                                                    color: '#fff', fontWeight: 700,
                                                    borderRadius: '8px', fontSize: '0.78rem',
                                                    py: '7px', fontFamily: '"Droid Arabic Kufi", serif',
                                                    border: 'none', boxShadow: 'none',
                                                    '&:hover': { background: 'linear-gradient(135deg, #3a3a7a 0%, #6b4e97 100%)', boxShadow: 'none' },
                                                }}
                                            >
                                                عرض في دوراتي
                                            </Button>
                                        ) : course.isFree ? (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); handleEnroll(course); }}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)',
                                                    color: '#fff', fontWeight: 700,
                                                    borderRadius: '8px', fontSize: '0.78rem',
                                                    py: '7px', fontFamily: '"Droid Arabic Kufi", serif',
                                                    border: 'none', boxShadow: 'none',
                                                    '&:hover': { background: 'linear-gradient(135deg, #155f30 0%, #1e8449 100%)', boxShadow: 'none' },
                                                }}
                                            >
                                                اشترك الآن
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                disabled={isAdding}
                                                onClick={(e) => { e.stopPropagation(); addToCart(course); }}
                                                sx={{
                                                    borderColor: '#0865a8', color: '#0865a8',
                                                    fontWeight: 700, borderRadius: '8px',
                                                    fontSize: '0.78rem', py: '7px',
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    borderWidth: '2px',
                                                    '&:hover': { bgcolor: '#0865a8', color: '#fff', borderColor: '#0865a8' },
                                                    '&:disabled': { opacity: 0.6, borderColor: '#0865a8', color: '#0865a8' },
                                                }}
                                            >
                                                {isAdding ? 'جاري الإضافة...' : 'أضف إلى السلة'}
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Nav arrows */}
                <Box className="custom-prev" sx={{
                    position: 'absolute', left: -20, top: '50%', zIndex: 10, cursor: 'pointer',
                    bgcolor: '#0865a8', color: '#fff', borderRadius: '50%',
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: 'translateY(-50%)', fontSize: '22px', userSelect: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: '#f57c00' },
                    transition: 'background 0.2s',
                }}>‹</Box>

                <Box className="custom-next" sx={{
                    position: 'absolute', right: -20, top: '50%', zIndex: 10, cursor: 'pointer',
                    bgcolor: '#0865a8', color: '#fff', borderRadius: '50%',
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: 'translateY(-50%)', fontSize: '22px', userSelect: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: '#f57c00' },
                    transition: 'background 0.2s',
                }}>›</Box>
            </Box>
        </Container>
    );
};

export default DynamicCoursesSection;