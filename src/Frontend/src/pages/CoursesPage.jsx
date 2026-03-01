import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const styles = {
    overviewBar: { position: 'fixed', left: 0, top: '64px', zIndex: 40, width: '100%', backgroundColor: '#f5f5f5', padding: '12px 24px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e0e0e0' },
    overviewBarText: { textAlign: 'center', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', color: '#000000' },
    breadcrumbLink: { marginLeft: '12px', color: '#0865a8', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer', fontWeight: '500', borderBottom: '2px solid transparent', paddingBottom: '2px' },
    breadcrumbSeparator: { color: '#000000', margin: '0 8px', opacity: 0.4 },
    breadcrumbCurrent: { marginRight: '12px', color: '#000000', fontWeight: '600' },
    mainContainer: { maxWidth: '1400px', margin: '0 auto', marginTop: '110px', padding: '30px 20px 50px', boxSizing: 'border-box', backgroundColor: '#ffffff' },
    pageHeader: { textAlign: 'center', marginBottom: '40px', padding: '30px 20px', backgroundColor: '#ffffff', borderRadius: '12px' },
    h1: { fontSize: '36px', fontWeight: 'bold', color: '#000000', marginBottom: '12px', fontFamily: '"Droid Arabic Kufi", serif', position: 'relative', display: 'inline-block' },
    h1Underline: { content: '""', position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '3px', background: 'linear-gradient(90deg, #0865a8 0%, #f57c00 100%)', borderRadius: '2px' },
    subtitle: { fontSize: '18px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', marginTop: '20px', opacity: 0.7 },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', fontSize: '20px', color: '#0865a8', fontFamily: '"Droid Arabic Kufi", serif' },
    errorContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', fontSize: '20px', color: '#f57c00', flexDirection: 'column', gap: '24px', fontFamily: '"Droid Arabic Kufi", serif' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', padding: '10px 0' },
    card: { display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '16px', backgroundColor: '#ffffff', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default', position: 'relative' },
    cardHover: { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.12)', borderColor: '#0865a8' },
    cardHeader: { position: 'relative', height: '160px', overflow: 'hidden', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cardHeaderFree: { background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)' },
    cardHeaderOwned: { background: 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)' },
    cardHeaderOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(8,101,168,0.9) 0%, rgba(245,124,0,0.9) 100%)', opacity: 0, transition: 'opacity 0.3s ease' },
    cardHeaderOverlayFree: { background: 'linear-gradient(135deg, rgba(26,122,60,0.9) 0%, rgba(39,174,96,0.9) 100%)' },
    cardHeaderOverlayHover: { opacity: 1 },
    iconWrapper: { position: 'relative', zIndex: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', padding: '24px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' },
    icon: { width: '48px', height: '48px', color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' },
    discountBadge: { position: 'absolute', right: '12px', top: '12px', borderRadius: '10px', backgroundColor: '#f57c00', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', boxShadow: '0 2px 8px rgba(245,124,0,0.4)', fontFamily: '"Droid Arabic Kufi", serif', zIndex: 3 },
    freeBadge: { position: 'absolute', right: '12px', top: '12px', borderRadius: '10px', backgroundColor: '#ffffff', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', color: '#1a7a3c', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontFamily: '"Droid Arabic Kufi", serif', zIndex: 3 },
    ownedBadge: { position: 'absolute', right: '12px', top: '12px', borderRadius: '10px', backgroundColor: '#ffffff', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', color: '#4a4a8a', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontFamily: '"Droid Arabic Kufi", serif', zIndex: 3 },
    cardBody: { display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#ffffff' },
    courseTitle: { fontSize: '17px', fontWeight: 'bold', color: '#000000', marginBottom: '16px', lineHeight: '1.5', minHeight: '52px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: '"Droid Arabic Kufi", serif' },
    infoSection: { marginBottom: '16px' },
    infoRow: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#000000', marginBottom: '10px', fontFamily: '"Droid Arabic Kufi", serif', padding: '6px 10px', backgroundColor: '#f9f9f9', borderRadius: '6px', borderRight: '3px solid #0865a8' },
    infoIcon: { width: '18px', height: '18px', flexShrink: 0, color: '#0865a8', marginTop: '2px' },
    clampText: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4', flex: 1 },
    description: { fontSize: '14px', lineHeight: '1.6', color: '#000000', opacity: 0.7, marginBottom: '16px', fontFamily: '"Droid Arabic Kufi", serif' },
    priceSection: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #f0f0f0', marginBottom: '16px' },
    priceContainer: { display: 'flex', flexDirection: 'column', gap: '4px' },
    originalPrice: { fontSize: '13px', color: '#000000', textDecoration: 'line-through', fontFamily: '"Droid Arabic Kufi", serif', opacity: 0.5 },
    currentPrice: { fontSize: '24px', fontWeight: 'bold', color: '#f57c00', fontFamily: '"Droid Arabic Kufi", serif' },
    freePriceLabel: { fontSize: '24px', fontWeight: 'bold', color: '#1a7a3c', fontFamily: '"Droid Arabic Kufi", serif' },
    priceLabel: { fontSize: '12px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', opacity: 0.6, marginTop: '2px' },
    buttonsContainer: { display: 'flex', gap: '10px', flexDirection: 'column' },
    addToCartBtn: { width: '100%', borderRadius: '10px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', padding: '12px 20px', fontWeight: 'bold', color: '#ffffff', border: 'none', boxShadow: '0 3px 10px rgba(8,101,168,0.25)', transition: 'all 0.3s ease', cursor: 'pointer', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif' },
    enrollBtn: { width: '100%', borderRadius: '10px', background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)', padding: '12px 20px', fontWeight: 'bold', color: '#ffffff', border: 'none', boxShadow: '0 3px 10px rgba(26,122,60,0.25)', transition: 'all 0.3s ease', cursor: 'pointer', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif' },
    addToCartBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(8,101,168,0.35)' },
    enrollBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(26,122,60,0.35)' },
    addToCartBtnDisabled: { opacity: 0.6, cursor: 'not-allowed', transform: 'none' },
    detailsBtn: { width: '100%', borderRadius: '10px', border: '2px solid #0865a8', backgroundColor: '#ffffff', padding: '10px 20px', fontWeight: 'bold', color: '#0865a8', transition: 'all 0.3s ease', cursor: 'pointer', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif' },
    detailsBtnHover: { backgroundColor: '#0865a8', color: '#ffffff', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(8,101,168,0.25)' },
    emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9f9f9', borderRadius: '16px', border: '2px dashed #0865a8' },
    emptyStateIcon: { width: '80px', height: '80px', margin: '0 auto 20px', color: '#0865a8', opacity: 0.5 },
    emptyStateText: { fontSize: '20px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', opacity: 0.7 },
    toast: { position: 'fixed', top: '100px', right: '20px', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '400px', animation: 'slideIn 0.3s ease-out', fontFamily: '"Droid Arabic Kufi", serif' },
    toastSuccess: { borderRight: '4px solid #4caf50' },
    toastError: { borderRight: '4px solid #f44336' },
    toastWarning: { borderRight: '4px solid #ff9800' },
    toastIcon: { width: '24px', height: '24px', flexShrink: 0 },
    toastMessage: { fontSize: '14px', color: '#000000', flex: 1 },
};

const mediaQueryStyles = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .grid { margin-left: auto !important; margin-right: auto !important; justify-items: center !important; }
    @media (max-width: 768px) {
        .main-container { margin-top: 100px !important; padding: 20px 16px 40px !important; }
        .grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        .overview-bar { padding: 10px 16px !important; }
        .card-header { height: 140px !important; }
        .card-body { padding: 16px !important; }
        .toast { right: 10px !important; left: 10px !important; max-width: calc(100% - 20px) !important; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
        .grid { grid-template-columns: repeat(2, 1fr) !important; gap: 22px !important; }
    }
    @media (min-width: 1025px) {
        .grid { grid-template-columns: repeat(3, 1fr) !important; gap: 22px !important; }
    }
    @media (min-width: 1921px) {
        .grid { grid-template-columns: repeat(4, 1fr) !important; gap: 28px !important; }
    }
`;

// Toast Component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
    const colors = { success: '#4caf50', error: '#f44336', warning: '#ff9800' };
    const paths = {
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    };
    const borderMap = { success: styles.toastSuccess, error: styles.toastError, warning: styles.toastWarning };
    return (
        <div style={{ ...styles.toast, ...borderMap[type] }}>
            <svg style={{ ...styles.toastIcon, color: colors[type] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[type]} />
            </svg>
            <span style={styles.toastMessage}>{message}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const CoursesPage = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { getToken, isSignedIn, userId } = useAuth(); // ✅ أضفنا userId

    const [programData, setProgramData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);
    const [toast, setToast] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredAddBtn, setHoveredAddBtn] = useState(null);
    const [hoveredDetailsBtn, setHoveredDetailsBtn] = useState(null);
    const [hoveredHeaderCard, setHoveredHeaderCard] = useState(null);

    // ✅ ownedCourseIds مبدئياً فاضية — هتتملى من الـ API
    const [ownedCourseIds, setOwnedCourseIds] = useState(new Set());

    const showToast = (message, type = 'success') => setToast({ message, type });

    // ✅ جيب الـ enrollments من الـ API مربوطة بالـ user الحالي
    const fetchOwnedCourses = useCallback(async () => {
        if (!isSignedIn) {
            setOwnedCourseIds(new Set()); // مش مسجل دخول = مفيش كورسات
            return;
        }
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/course/my-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            // data هو array من { childId, ... }
            const ids = new Set(data.map(e => e.childId));
            setOwnedCourseIds(ids);
        } catch {
            // في حالة error نفضل بـ empty set — مش هنكسر الصفحة
            setOwnedCourseIds(new Set());
        }
    }, [isSignedIn, getToken]);

    // ✅ اجري الـ fetch كل ما يتغير الـ user أو يتحدث الـ enrollment
    useEffect(() => {
        fetchOwnedCourses();
    }, [fetchOwnedCourses, userId]); // userId يتغير عند sign in / sign out

    useEffect(() => {
        // بعد كل payment ناجح نحدث الـ owned list
        const onEnrollUpdate = () => fetchOwnedCourses();
        window.addEventListener('enrollUpdated', onEnrollUpdate);
        window.addEventListener('cartUpdated', onEnrollUpdate);
        return () => {
            window.removeEventListener('enrollUpdated', onEnrollUpdate);
            window.removeEventListener('cartUpdated', onEnrollUpdate);
        };
    }, [fetchOwnedCourses]);

    // جيب كورسات البرنامج
    useEffect(() => {
        if (!slug) return;
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_BASE}/course/programs/${slug}/courses`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error('البرنامج غير موجود');
                    throw new Error('فشل في تحميل البيانات');
                }
                setProgramData(await res.json());
            } catch (err) {
                setError(err.message);
                showToast(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [slug]);

    useEffect(() => {
        document.title = programData?.programName
            ? `${programData.programName} - المعهد التكنولوجي`
            : 'الدورات التدريبية - المعهد التكنولوجي';
    }, [programData]);

    // التسجيل في كورس مجاني
    const handleEnroll = (course) => {
        showToast('تم التسجيل في الدورة بنجاح', 'success');
        setTimeout(() => navigate('/my-courses'), 1000);
    };

    // إضافة للسلة
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
                const msgs = { 401: 'انتهت الجلسة، سجل دخول مرة أخرى', 404: 'الدورة غير موجودة', 409: 'الدورة موجودة بالفعل في السلة', 500: 'خطأ في الخادم' };
                throw new Error(msgs[res.status] || 'فشل إضافة الدورة');
            }
            // sync localStorage للـ cart badge فقط
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (!cartItems.some(i => i.id === course.id)) {
                cartItems.push({ id: course.id, title: course.title, instructor: course.place || 'غير محدد', image: 'book', currentPrice: course.cost || 0, originalPrice: course.cost ? course.cost / 0.6 : 0, quantity: 1, slug: course.slug || '', date: course.date || '', place: course.place || '' });
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

    // ─── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                <div style={styles.overviewBar} className="overview-bar">
                    <div style={styles.overviewBarText}>
                        <a href="/" style={styles.breadcrumbLink}>الصفحة الرئيسية</a>
                        <span style={styles.breadcrumbSeparator}>•</span>
                        <span style={styles.breadcrumbCurrent}>جاري التحميل...</span>
                    </div>
                </div>
                <div style={styles.loadingContainer}>
                    <svg style={{ width: '60px', height: '60px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            </div>
        </>
    );

    if (error) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                <div style={styles.overviewBar}><div style={styles.overviewBarText}><a href="/" style={styles.breadcrumbLink}>الصفحة الرئيسية</a><span style={styles.breadcrumbSeparator}>•</span><span style={styles.breadcrumbCurrent}>خطأ</span></div></div>
                <div style={styles.errorContainer}>
                    <div>{error}</div>
                    <button onClick={() => window.location.reload()} style={{ ...styles.addToCartBtn, width: 'auto', minWidth: '200px' }}>إعادة المحاولة</button>
                </div>
            </div>
        </>
    );

    const courses = programData?.courses || [];

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>

            <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                <div style={{ ...styles.overviewBar, top: 70 }} className="overview-bar">
                    <div style={styles.overviewBarText}>
                        <a href="/" style={styles.breadcrumbLink} onMouseEnter={e => e.target.style.color = '#f57c00'} onMouseLeave={e => e.target.style.color = '#0865a8'}>الصفحة الرئيسية</a>
                        <span style={styles.breadcrumbSeparator}>•</span>
                        <span style={styles.breadcrumbCurrent}>{programData?.programName || ''}</span>
                    </div>
                </div>

                <div style={styles.mainContainer} className="main-container">
                    <div style={styles.pageHeader} className="page-header">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <h1 style={styles.h1} className="page-title">{programData?.programName || 'الدورات التدريبية'}</h1>
                            <div style={styles.h1Underline} />
                        </div>
                        <p style={styles.subtitle} className="page-subtitle">اختر الدورة المناسبة لك وابدأ رحلتك التعليمية</p>
                    </div>

                    {courses.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyStateText}>لا توجد دورات متاحة حالياً</div>
                        </div>
                    ) : (
                        <div style={styles.grid} className="grid">
                            {courses.map((course) => {
                                const isFree = !course.cost || course.cost === 0;
                                const isOwned = ownedCourseIds.has(course.id); // ✅ من الـ API
                                const isAdding = addingToCart === course.id;
                                const currentPrice = course.cost;
                                const originalPrice = course.cost ? course.cost / 0.6 : null;

                                return (
                                    <div key={course.id}
                                        style={{ ...styles.card, ...(hoveredCard === course.id ? styles.cardHover : {}) }}
                                        onMouseEnter={() => setHoveredCard(course.id)}
                                        onMouseLeave={() => setHoveredCard(null)}>

                                        {/* Header */}
                                        <div style={{ ...styles.cardHeader, ...(isOwned ? styles.cardHeaderOwned : isFree ? styles.cardHeaderFree : {}) }}
                                            className="card-header"
                                            onMouseEnter={() => setHoveredHeaderCard(course.id)}
                                            onMouseLeave={() => setHoveredHeaderCard(null)}>
                                            <div style={{ ...styles.cardHeaderOverlay, ...(isFree ? styles.cardHeaderOverlayFree : {}), ...(hoveredHeaderCard === course.id ? styles.cardHeaderOverlayHover : {}) }} />
                                            <div style={styles.iconWrapper}>
                                                <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            {isOwned ? <div style={styles.ownedBadge}>✅ مسجل</div>
                                                : isFree ? <div style={styles.freeBadge}>مجاناً</div>
                                                    : <div style={styles.discountBadge}>خصم 40%</div>}
                                        </div>

                                        {/* Body */}
                                        <div style={styles.cardBody} className="card-body">
                                            <h3 style={styles.courseTitle} className="course-title">{course.title}</h3>
                                            <div style={styles.infoSection}>
                                                {course.place && (
                                                    <div style={styles.infoRow}>
                                                        <svg style={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                        <span style={styles.clampText}>{course.place}</span>
                                                    </div>
                                                )}
                                                {course.date && (
                                                    <div style={styles.infoRow}>
                                                        <svg style={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <span>{course.date}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {course.description && <p style={styles.description}>{course.description}</p>}

                                            {/* Price */}
                                            <div style={styles.priceSection}>
                                                <div style={styles.priceContainer}>
                                                    {isOwned ? (
                                                        <><span style={{ ...styles.freePriceLabel, color: '#4a4a8a' }}>مسجل ✓</span><span style={styles.priceLabel}>لديك هذه الدورة بالفعل</span></>
                                                    ) : isFree ? (
                                                        <><span style={styles.freePriceLabel}>مجاناً</span><span style={styles.priceLabel}>دورة مجانية بالكامل</span></>
                                                    ) : (
                                                        <><span style={styles.originalPrice}>{originalPrice?.toFixed(2)} ج.م</span><span style={styles.currentPrice} className="current-price">{currentPrice?.toFixed(2)} ج.م</span><span style={styles.priceLabel}>السعر الشامل</span></>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div style={styles.buttonsContainer}>
                                                {isOwned ? (
                                                    <button style={{ ...styles.detailsBtn, ...(hoveredDetailsBtn === course.id ? styles.detailsBtnHover : {}) }}
                                                        onMouseEnter={() => setHoveredDetailsBtn(course.id)} onMouseLeave={() => setHoveredDetailsBtn(null)}
                                                        onClick={() => navigate(`/course/${course.slug}`)}>عرض التفاصيل</button>
                                                ) : isFree ? (
                                                    <>
                                                        <button onClick={() => handleEnroll(course)} style={{ ...styles.enrollBtn, ...(hoveredAddBtn === course.id ? styles.enrollBtnHover : {}) }}
                                                            onMouseEnter={() => setHoveredAddBtn(course.id)} onMouseLeave={() => setHoveredAddBtn(null)}>اشترك الآن</button>
                                                        <button style={{ ...styles.detailsBtn, ...(hoveredDetailsBtn === course.id ? styles.detailsBtnHover : {}) }}
                                                            onMouseEnter={() => setHoveredDetailsBtn(course.id)} onMouseLeave={() => setHoveredDetailsBtn(null)}
                                                            onClick={() => navigate(`/course/${course.slug}`)}>عرض التفاصيل</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => addToCart(course)} disabled={isAdding}
                                                            style={{ ...styles.addToCartBtn, ...(hoveredAddBtn === course.id && !isAdding ? styles.addToCartBtnHover : {}), ...(isAdding ? styles.addToCartBtnDisabled : {}) }}
                                                            onMouseEnter={() => !isAdding && setHoveredAddBtn(course.id)} onMouseLeave={() => setHoveredAddBtn(null)}>
                                                            {isAdding ? (
                                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                    <svg style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                                    جاري الإضافة...
                                                                </span>
                                                            ) : 'أضف إلى السلة'}
                                                        </button>
                                                        <button style={{ ...styles.detailsBtn, ...(hoveredDetailsBtn === course.id ? styles.detailsBtnHover : {}) }}
                                                            onMouseEnter={() => setHoveredDetailsBtn(course.id)} onMouseLeave={() => setHoveredDetailsBtn(null)}
                                                            onClick={() => navigate(`/course/${course.slug}`)}>عرض التفاصيل</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CoursesPage;