import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser, useAuth } from '@clerk/clerk-react';
import { Button } from '@mui/material';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';
const ENROLLED_KEY = 'enrolledCourses';
// ─── Progress bar ─────────────────────────────────────────────────────────────

// ─── Progress bar ─────────────────────────────────────────────────────────────

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value }) => (
    <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
);

const BookIcon = () => (
    <svg width="48" height="48" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const DeleteModal = ({ course, onConfirm, onCancel }) => (
    <div style={styles.modalOverlay}>
        <div style={styles.modalBox}>
            <div style={styles.modalIcon}>🗑️</div>
            <h3 style={styles.modalTitle}>حذف الدورة</h3>
            <p style={styles.modalText}>
                هل تريد حذف <strong>"{course?.title}"</strong> من قائمتك؟
            </p>
            {course?._type === 'purchased' && (
                <p style={styles.modalWarning}>
                    ⚠️ لن يُسترد المبلغ المدفوع. سيتم إزالة الدورة من قائمتك المحلية فقط.
                </p>
            )}
            <div style={styles.modalActions}>
                <button style={styles.modalCancelBtn} onClick={onCancel}>إلغاء</button>
                <button style={styles.modalDeleteBtn} onClick={onConfirm}>حذف</button>
            </div>
        </div>
    </div>
);
    const { getToken, isSignedIn } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [purchased, setPurchased] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    const [purchased, setPurchased] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [search, setSearch] = useState('');
    // ── Fetch enrollments from API ────────────────────────────────────────────
    const fetchMyCourses = useCallback(async () => {
        if (!isSignedIn) return;
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/course/my-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('فشل تحميل الدورات');
            const data = await res.json();
        setEnrolled(loadEnrolled());
    };
        setEnrolled(loadEnrolled());
    };

            // map API response to our card format
            const mapped = data.map(e => ({
                id: e.childId,
                slug: e.slug || '',
                title: e.serviceTitle || e.title || '',
                place: e.coursePlace || e.place || '',
                instructor: e.coursePlace || e.place || 'غير محدد',
                date: e.courseDate || e.date || '',
                enrolledAt: e.enrolledAt || '',
                progress: 0,
                _type: 'purchased', // كل الكورسات اللي جاية من الـ DB هي مدفوعة أو مسجلة
            }));
            setCourses(mapped);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        fetchMyCourses();
    }, [fetchMyCourses]);
            window.removeEventListener('enrollUpdated', reload);
    // ── Derived / filtered list ───────────────────────────────────────────────
    const filtered = courses.filter(c =>
        search.trim() === '' ||
        (c.title || '').toLowerCase().includes(search.toLowerCase())
    );
        .filter(c =>
            search.trim() === '' ||
        { label: 'إجمالي الدورات', value: courses.length, icon: '📚' },
        { label: 'الدورات المسجلة', value: courses.length, icon: '🎓' },
        );
        { label: 'إجمالي الدورات', value: allCourses.length, icon: '📚' },
        { label: 'دورات مدفوعة', value: purchased.length, icon: '🎓' },
        { label: 'دورات مسجلة', value: freeCount, icon: '✅' },
        { label: 'دورات مدفوعة', value: purchased.length, icon: '🎓' },
        { label: 'دورات مسجلة', value: freeCount, icon: '✅' },
    ];

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{css}</style>

            {deleteTarget && (
                <DeleteModal course={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
            )}

            <div dir="rtl" style={styles.page}>
                <div style={styles.overviewBar} className="mc-overview-bar">
                    <div style={styles.overviewBarText}>
                        <a href="/" style={styles.breadcrumbLink}
                            onMouseEnter={e => (e.target.style.color = '#f57c00')}
                            onMouseLeave={e => (e.target.style.color = '#0865a8')}>
                            الصفحة الرئيسية
                        </a>
                        <span style={styles.breadcrumbSep}>•</span>
                        <span style={styles.breadcrumbCurrent}>دوراتي التدريبية</span>
                    </div>
                </div>
                            <p style={styles.authGateSub}>يجب تسجيل الدخول أولاً لعرض دوراتك التدريبية</p>
                            <SignInButton mode="modal">
                                <Button variant="contained" sx={{
                                    fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1rem',
                                    bgcolor: '#0865a8', color: '#ffffff', px: 4, py: 1.5,
                                    borderRadius: 5, textTransform: 'none', fontWeight: 600,
                                    '&:hover': { bgcolor: '#f57c00' }
                                }}>
                                mode="modal"
                                appearance={{
                                    variables: { colorPrimary: '#0865a8', colorText: '#000000', colorBackground: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif', borderRadius: '12px' },
                                    elements: {
                                        card: { direction: 'ltr', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #0865a8', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' },
                                        headerTitle: { textAlign: 'center', color: '#0865a8', fontWeight: '700' },
                                        headerSubtitle: { textAlign: 'center', color: '#000000' },
                                        formFieldLabel: { textAlign: 'left', color: '#000000', fontWeight: '600' },
                                        formFieldInput: { textAlign: 'left', borderRadius: '8px', border: '1px solid #0865a8' },
                                        formButtonPrimary: { backgroundColor: '#0865a8', color: '#ffffff', fontWeight: '600' },
                                        footerAction: { textAlign: 'left' },
                                        footerActionLink: { color: '#f57c00', fontWeight: '600' },
                                    },
                                }}
                            >
                                    <p style={styles.heroGreeting}>مرحباً {userName}،</p>
                                    <h1 style={styles.heroTitle}>دوراتك التدريبية</h1>
                                <Button variant="contained" sx={{ fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1rem', bgcolor: '#0865a8', color: '#ffffff', px: 4, py: 1.5, borderRadius: 5, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(8,101,168,0.25)', '&:hover': { bgcolor: '#f57c00' } }}>
                                    تسجيل دخول
                                </Button>
                            </SignInButton>
                            <button style={styles.btnBrowse} onClick={() => navigate('/')}>استعرض الدورات بدون تسجيل</button>
                        </div>
                    </div>
                </SignedOut>

                <SignedIn>
                    <div style={styles.hero} className="mc-hero">
                        <div style={styles.heroDeco1} /><div style={styles.heroDeco2} /><div style={styles.heroDeco3} />
                        <div style={styles.heroInner}>
                            <div style={styles.heroTopRow} className="mc-hero-top">
                                    {/* ✅ Personalized greeting: مرحباً [name]، */}
                                    <p style={styles.heroGreeting}>
                                        مرحباً {userName}،
                                    </p>
                                    <h1 style={styles.heroTitle}>بدوراتك التدريبية</h1>
                                    </p>
                                    <h1 style={styles.heroTitle}>بدوراتك التدريبية</h1>
                                </div>
                            </div>
                            <p style={styles.heroSub}>تابع رحلتك التعليمية — كل دوراتك في مكان واحد</p>
                            <button onClick={fetchMyCourses} style={styles.refreshBtn}>
                                🔄 تحديث
                            </button>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div style={styles.loadingWrap}>
                                <div style={styles.spinner} />
                                <p style={styles.loadingText}>جاري تحميل دوراتك...</p>
                        </div>
                        ) : error ? (
                            <div style={styles.errorWrap}>
                                <div style={styles.emptyIcon}>⚠️</div>
                                <h3 style={styles.emptyTitle}>{error}</h3>
                                <button style={styles.emptyBtn} onClick={fetchMyCourses}>إعادة المحاولة</button>
                            </div>
                        ) : filtered.length === 0 ? (
                            <EmptyState search={search} navigate={navigate} />
                        ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                                </svg>
                            <div style={styles.tabs}>
                                {[
                                    { key: 'all', label: 'الكل' },
                                    { key: 'purchased', label: 'المدفوعة' },
                                    { key: 'enrolled', label: 'المسجلة' },
                                ].map(t => (
                                    <button key={t.key} onClick={() => setTab(t.key)}
                                        style={{ ...styles.tabBtn, ...(tab === t.key ? styles.tabBtnActive : {}) }}>
                                        {t.label}
                                    </button>
                                ))}
                                    </button>
                        </div>

                        {/* ✅ Only show courses that exist — no defaults */}
                        {filtered.length === 0 ? (
// ─── Course Card ──────────────────────────────────────────────────────────────
const CourseCard = ({ course, hovered, onHover, onLeave, navigate }) => {
    const progress = course.progress ?? 0;

    const goToCourse = () => {
        if (course.slug) navigate(`/course/${course.slug}`);
    };
                                        hovered={hoveredCard === course.id}
                                        onHover={() => setHoveredCard(course.id)}
        <div
            style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className="mc-card"
        >
                    </div>
                <div style={{
                    ...styles.cardImgPlaceholder,
                    background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
                }}>
                    <div style={styles.iconWrapper}><BookIcon /></div>
const CourseCard = ({ course, hovered, onHover, onLeave, navigate }) => {
                <span style={{ ...styles.badge, ...styles.badgePaid }}>✅ مسجل</span>
    };
        navigate(course.slug ? `/course/${course.slug}` : `/course/${course.id}`);
    };
        <div
            style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className="mc-card"

                {course.place && (
        >
                <div style={{
                    ...styles.cardImgPlaceholder,
                    background: isPurchased
                        ? 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)'
                        : 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)',
                }}>

                {course.date && (
                        <BookIcon />
                    </div>
                        <BookIcon />

                {/* Badge */}
                <span style={{ ...styles.badge, ...(isPurchased ? styles.badgePaid : styles.badgeFree) }}>
                    {isPurchased ? '💳 مدفوع' : '✅ مسجل'}
                </span>

                {/* Progress overlay on hover */}

                {/* Progress overlay on hover */}
                {progress > 0 && (
                    <div style={{ ...styles.progressOverlay, opacity: hovered ? 1 : 0 }}>
                        <span style={styles.progressOverlayText}>{progress}% مكتمل</span>
                    </div>
                )}
            </div>

                {(course.instructor || course.place) && (

                {(course.instructor || course.place) && (
                    <div style={styles.metaRow}>
                        <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />

                    <div style={styles.metaRow}>
                    style={{ ...styles.ctaBtn, ...(hovered ? styles.ctaBtnHover : {}) }}
                    onClick={goToCourse}
                >
                        <span style={styles.metaText}>{course.date}</span>
                    </div>
                )}

                {course.enrolledAt && (
                    <div style={styles.metaRow}>
        </div>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ search, navigate }) => (
    <div style={styles.emptyWrap}>
        <div style={styles.emptyIcon}>{search ? '🔍' : '📭'}</div>
        <h3 style={styles.emptyTitle}>
            {search ? 'لا توجد دورات تطابق بحثك' : 'لم تنضم إلى أي دورة بعد'}
        </h3>
        <p style={styles.emptySub}>
            {search ? 'جرّب كلمات بحث مختلفة' : 'استعرض الدورات المتاحة وابدأ رحلتك التعليمية'}
        </p>
        {!search && (
            <button style={styles.emptyBtn} onClick={() => navigate('/')}>استعرض الدورات</button>
        )}
    </div>
);
                )}

                )}
                    style={{ ...styles.ctaBtn, ...(hovered ? styles.ctaBtnHover : {}), ...(isPurchased ? {} : styles.ctaBtnFree) }}
                    onClick={goToCourse}
                >
                    onClick={goToCourse}
                >
                    {progress > 0 ? 'متابعة الدورة' : 'ابدأ الدورة'}
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px', transform: 'rotate(180deg)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
        </div>
    );
    heroAvatar: { width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '2.5px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' },
    heroGreeting: { margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif' },
    heroTitle: { margin: '4px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Droid Arabic Kufi", serif' },
const EmptyState = ({ tab, search, navigate }) => {
    const msg = search
        ? 'لا توجد دورات تطابق بحثك'
        : tab === 'purchased' ? 'لم تشترِ أي دورة بعد'
            : tab === 'enrolled' ? 'لم تسجل في أي دورة مجانية بعد'
                : 'لم تنضم إلى أي دورة بعد';
    const sub = search ? 'جرّب كلمات بحث مختلفة' : 'استعرض الدورات المتاحة وابدأ رحلتك التعليمية';

    return (
        <div style={styles.emptyWrap}>
            <div style={styles.emptyIcon}>{search ? '🔍' : '📭'}</div>
            <h3 style={styles.emptyTitle}>{msg}</h3>
    refreshBtn: { padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #e0e0e0', backgroundColor: '#fff', color: '#555', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },

    loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '20px' },
    spinner: { width: '48px', height: '48px', border: '4px solid #e0e0e0', borderTopColor: '#0865a8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadingText: { fontSize: '16px', color: '#666', fontFamily: '"Droid Arabic Kufi", serif' },
    errorWrap: { textAlign: 'center', padding: '80px 20px' },

        </div>
    );
};
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f7f8fc', fontFamily: '"Droid Arabic Kufi", serif', direction: 'rtl' },
    overviewBarText: { textAlign: 'center', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif' },
    breadcrumbLink: { marginLeft: '12px', color: '#0865a8', textDecoration: 'none', fontWeight: '500', cursor: 'pointer', transition: 'color 0.2s' },
    breadcrumbSep: { color: '#000', margin: '0 8px', opacity: 0.4 },
    breadcrumbCurrent: { marginRight: '12px', color: '#000', fontWeight: '600' },
    hero: { position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #05416d 0%, #0865a8 45%, #c96000 100%)', paddingTop: '116px', paddingBottom: '52px', paddingLeft: '24px', paddingRight: '24px' },
    heroDeco1: { position: 'absolute', top: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' },
    heroDeco2: { position: 'absolute', bottom: '-80px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(245,124,0,0.18)', pointerEvents: 'none' },
    heroDeco3: { position: 'absolute', top: '40px', right: '30%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' },
    heroAvatar: { width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '2.5px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: '0 4px 18px rgba(0,0,0,0.2)' },

    // ✅ Larger greeting line to show name prominently
    heroGreeting: { margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif', textShadow: '0 1px 6px rgba(0,0,0,0.2)' },
    heroTitle: { margin: '4px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Droid Arabic Kufi", serif', textShadow: '0 2px 12px rgba(0,0,0,0.18)' },

    ctaBtn: { marginTop: 'auto', width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' },
    heroDivider: { width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)', marginBottom: '28px' },

    statCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '16px', padding: '18px 32px', minWidth: '130px' },
    statIcon: { fontSize: '26px' },
    statValue: { fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: 1 },
    statLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.82)', fontFamily: '"Droid Arabic Kufi", serif' },
    emptyBtn: { padding: '13px 36px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },

    authGate: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '120px 20px 60px' },
    authGateCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '52px 44px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    tabBtn: { padding: '8px 20px', borderRadius: '8px', border: '1.5px solid #e0e0e0', backgroundColor: '#fff', color: '#555', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', transition: 'all 0.25s', fontWeight: '500' },
    tabBtnActive: { backgroundColor: '#0865a8', color: '#fff', borderColor: '#0865a8', boxShadow: '0 3px 10px rgba(8,101,168,0.25)' },

    tabBtnActive: { backgroundColor: '#0865a8', color: '#fff', borderColor: '#0865a8', boxShadow: '0 3px 10px rgba(8,101,168,0.25)' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', border: '2px solid #f0f0f0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' },
    cardHover: { transform: 'translateY(-7px)', boxShadow: '0 14px 28px rgba(0,0,0,0.13)', borderColor: '#0865a8' },
    cardHeader: { position: 'relative', height: '160px', overflow: 'hidden' },
    cardImgPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    iconWrapper: { borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', padding: '24px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' },
    badgeFree: { backgroundColor: '#27ae60', color: '#fff', boxShadow: '0 2px 8px rgba(39,174,96,0.35)' },
    badgePaid: { backgroundColor: '#0865a8', color: '#fff', boxShadow: '0 2px 8px rgba(8,101,168,0.35)' },
    badgeFree: { backgroundColor: '#27ae60', color: '#fff', boxShadow: '0 2px 8px rgba(39,174,96,0.35)' },
    progressOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 14px', background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 100%)', transition: 'opacity 0.3s', display: 'flex', justifyContent: 'flex-end' },
    progressOverlayText: { fontSize: '12px', color: '#fff', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' },
    cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 },
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    metaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', fontFamily: '"Droid Arabic Kufi", serif' },
    .mc-hero { padding-top: 100px !important; }
    .mc-main { padding: 24px 14px 48px !important; }
    .mc-toolbar { flex-direction: column !important; }
    .mc-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
    priceTag: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: '#fff8f0', borderRadius: '8px', border: '1.5px solid #fde0b8' },
  @media (min-width: 641px) and (max-width: 1024px) {
    .mc-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1025px) {
    .mc-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }

    ctaBtnFree: { background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)', boxShadow: '0 3px 10px rgba(26,122,60,0.2)' },

    emptyWrap: { textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '2px dashed #d0dce8' },
    emptyIcon: { fontSize: '64px', marginBottom: '16px' },
    emptyBtn: { padding: '13px 36px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', boxShadow: '0 4px 12px rgba(8,101,168,0.25)' },

    authGate: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '120px 20px 60px', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' },
    authGateCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '52px 44px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '100%', border: '1.5px solid #e8eef5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    authGate: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '120px 20px 60px', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' },
    authGateCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '52px 44px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '100%', border: '1.5px solid #e8eef5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    authGateIcon: { fontSize: '64px' },
    authGateTitle: { fontSize: '26px', fontWeight: 'bold', color: '#111', fontFamily: '"Droid Arabic Kufi", serif', margin: 0 },
    authGateSub: { fontSize: '15px', color: '#666', fontFamily: '"Droid Arabic Kufi", serif', margin: 0 },
    btnBrowse: { marginTop: '4px', width: '100%', padding: '10px 24px', backgroundColor: 'transparent', color: '#888', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalBox: { backgroundColor: '#fff', borderRadius: '20px', padding: '36px 32px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: '"Droid Arabic Kufi", serif' },
    modalIcon: { fontSize: '52px', marginBottom: '12px' },
    modalTitle: { fontSize: '22px', fontWeight: 'bold', color: '#111', marginBottom: '12px' },
    modalText: { fontSize: '15px', color: '#444', lineHeight: '1.7', marginBottom: '12px' },
    modalWarning: { fontSize: '13px', color: '#c0392b', backgroundColor: '#fef2f2', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', border: '1px solid #fecaca' },
    modalActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
    modalCancelBtn: { padding: '11px 28px', borderRadius: '10px', border: '2px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi", serif' },
    modalDeleteBtn: { padding: '11px 28px', borderRadius: '10px', border: 'none', backgroundColor: '#d32f2f', color: '#fff', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi", serif', boxShadow: '0 4px 12px rgba(211,47,47,0.3)' },
};


  * { font-family: "Droid Arabic Kufi", serif !important; box-sizing: border-box; }
    .mc-hero         { padding-top: 100px !important; padding-bottom: 36px !important; }
    .mc-hero-top     { gap: 14px !important; }
    .mc-stats-row    { gap: 10px !important; }
    .mc-stat-card    { padding: 12px 18px !important; min-width: 90px !important; }
    .mc-main         { padding: 24px 14px 48px !important; }
    .mc-toolbar      { flex-direction: column !important; align-items: stretch !important; }
    .mc-grid         { grid-template-columns: 1fr !important; gap: 18px !important; }
    .mc-overview-bar { padding: 10px 14px !important; }
    .mc-grid         { grid-template-columns: 1fr !important; gap: 18px !important; }
  @media (min-width: 641px) and (max-width: 1024px) {
    .mc-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1025px) {
    .mc-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (min-width: 1600px) {
    .mc-grid { grid-template-columns: repeat(4, 1fr) !important; }
  }
    .mc-grid { grid-template-columns: repeat(4, 1fr) !important; }
  }
`;

export default MyCourses;