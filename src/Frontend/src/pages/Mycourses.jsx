import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { Button } from '@mui/material';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const ENROLLED_KEY = 'enrolledCourses';
const PURCHASED_KEY = 'purchasedCourses';

// ─── Data helpers ─────────────────────────────────────────────────────────────
const loadPurchased = () => {
    try { return JSON.parse(localStorage.getItem(PURCHASED_KEY) || '[]'); }
    catch { return []; }
};

const loadEnrolled = () => {
    try { return JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]'); }
    catch { return []; }
};

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value }) => (
    <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${value}%` }} />
    </div>
);

// ─── Book Icon (matches CoursesPage style) ────────────────────────────────────
const BookIcon = () => (
    <svg width="48" height="48" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const MyCourses = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [tab, setTab] = useState('all');
    const [purchased, setPurchased] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [search, setSearch] = useState('');

    // Get user's first name
    const userName = user?.firstName || user?.fullName?.split(' ')[0] || '';

    const reload = () => {
        setPurchased(loadPurchased());
        setEnrolled(loadEnrolled());
    };

    useEffect(() => {
        reload();
        window.addEventListener('cartUpdated', reload);
        window.addEventListener('enrollUpdated', reload);
        window.addEventListener('storage', reload);
        return () => {
            window.removeEventListener('cartUpdated', reload);
            window.removeEventListener('enrollUpdated', reload);
            window.removeEventListener('storage', reload);
        };
    }, []);

    // ── Derived list — purely dynamic, no defaults ────────────────────────────
    const allCourses = [
        ...purchased.map(c => ({ ...c, _type: 'purchased' })),
        ...enrolled
            .filter(e => !purchased.find(p => p.id === e.id))
            .map(c => ({ ...c, _type: 'enrolled' })),
    ];

    const filtered = allCourses
        .filter(c => {
            if (tab === 'purchased') return c._type === 'purchased';
            if (tab === 'enrolled') return c._type === 'enrolled';
            return true;
        })
        .filter(c =>
            search.trim() === '' ||
            (c.title || '').toLowerCase().includes(search.toLowerCase())
        );

    const freeCount = enrolled.filter(e => !purchased.find(p => p.id === e.id)).length;

    const stats = [
        { label: 'إجمالي الدورات', value: allCourses.length, icon: '📚' },
        { label: 'دورات مدفوعة', value: purchased.length, icon: '🎓' },
        { label: 'دورات مسجلة', value: freeCount, icon: '✅' },
    ];

    const breadcrumb = (
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
    );

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{css}</style>

            <div dir="rtl" style={styles.page}>
                {breadcrumb}

                {/* ── NOT LOGGED IN ── */}
                <SignedOut>
                    <div style={styles.authGate}>
                        <div style={styles.authGateCard}>
                            <div style={styles.authGateIcon}>🔒</div>
                            <h2 style={styles.authGateTitle}>تسجيل الدخول مطلوب</h2>
                            <p style={styles.authGateSub}>
                                يجب تسجيل الدخول أولاً لعرض دوراتك التدريبية
                            </p>
                            <SignInButton
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
                                <Button variant="contained" sx={{ fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1rem', bgcolor: '#0865a8', color: '#ffffff', px: 4, py: 1.5, borderRadius: 5, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(8,101,168,0.25)', '&:hover': { bgcolor: '#f57c00' } }}>
                                    تسجيل دخول
                                </Button>
                            </SignInButton>
                            <button style={styles.btnBrowse} onClick={() => navigate('/')}>
                                استعرض الدورات بدون تسجيل
                            </button>
                        </div>
                    </div>
                </SignedOut>

                {/* ── LOGGED IN ── */}
                <SignedIn>
                    {/* Hero */}
                    <div style={styles.hero} className="mc-hero">
                        <div style={styles.heroDeco1} />
                        <div style={styles.heroDeco2} />
                        <div style={styles.heroDeco3} />
                        <div style={styles.heroInner}>
                            <div style={styles.heroTopRow} className="mc-hero-top">
                                <div style={styles.heroAvatar}>📚</div>
                                <div>
                                    {/* ✅ Personalized greeting: مرحباً [name]، */}
                                    <p style={styles.heroGreeting}>
                                        مرحباً {userName}،
                                    </p>
                                    <h1 style={styles.heroTitle}>بدوراتك التدريبية</h1>
                                </div>
                            </div>
                            <p style={styles.heroSub}>
                                تابع رحلتك التعليمية — كل دوراتك في مكان واحد
                            </p>
                            <div style={styles.heroDivider} />
                            <div style={styles.statsRow} className="mc-stats-row">
                                {stats.map((s, i) => (
                                    <div key={i} style={styles.statCard} className="mc-stat-card">
                                        <span style={styles.statIcon}>{s.icon}</span>
                                        <span style={styles.statValue}>{s.value}</span>
                                        <span style={styles.statLabel}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main */}
                    <div style={styles.main} className="mc-main">
                        {/* Toolbar */}
                        <div style={styles.toolbar} className="mc-toolbar">
                            <div style={styles.searchWrap}>
                                <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                                </svg>
                                <input
                                    style={styles.searchInput}
                                    placeholder="ابحث في دوراتك..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
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
                            </div>
                        </div>

                        {/* ✅ Only show courses that exist — no defaults */}
                        {filtered.length === 0 ? (
                            <EmptyState tab={tab} search={search} navigate={navigate} />
                        ) : (
                            <div style={styles.grid} className="mc-grid">
                                {filtered.map(course => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        hovered={hoveredCard === course.id}
                                        onHover={() => setHoveredCard(course.id)}
                                        onLeave={() => setHoveredCard(null)}
                                        navigate={navigate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </SignedIn>
            </div>
        </>
    );
};

// ─── Course Card ──────────────────────────────────────────────────────────────
const CourseCard = ({ course, hovered, onHover, onLeave, navigate }) => {
    const isPurchased = course._type === 'purchased';
    const progress = course.progress ?? 0; // ✅ Default to 0, no fake progress

    const goToCourse = () => {
        navigate(course.slug ? `/course/${course.slug}` : `/course/${course.id}`);
    };

    return (
        <div
            style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className="mc-card"
        >
            {/* ✅ Card header: always use icon (blue→orange gradient like CoursesPage), no static images */}
            <div style={styles.cardHeader}>
                <div style={{
                    ...styles.cardImgPlaceholder,
                    background: isPurchased
                        ? 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)'
                        : 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)',
                }}>
                    {/* Glassmorphism icon wrapper — same as CoursesPage */}
                    <div style={styles.iconWrapper}>
                        <BookIcon />
                    </div>
                </div>

                {/* Badge */}
                <span style={{ ...styles.badge, ...(isPurchased ? styles.badgePaid : styles.badgeFree) }}>
                    {isPurchased ? '💳 مدفوع' : '✅ مسجل'}
                </span>

                {/* Progress overlay on hover */}
                {progress > 0 && (
                    <div style={{ ...styles.progressOverlay, opacity: hovered ? 1 : 0 }}>
                        <span style={styles.progressOverlayText}>{progress}% مكتمل</span>
                    </div>
                )}
            </div>

            <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{course.title}</h3>

                {(course.instructor || course.place) && (
                    <div style={styles.metaRow}>
                        <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span style={styles.metaText}>{course.instructor || course.place}</span>
                    </div>
                )}

                {(course.date || course.startDate) && (
                    <div style={styles.metaRow}>
                        <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span style={styles.metaText}>{course.date || course.startDate}</span>
                    </div>
                )}

                <div style={styles.progressSection}>
                    <div style={styles.progressHeader}>
                        <span style={styles.progressLabel}>التقدم</span>
                        <span style={styles.progressPct}>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                </div>

                {isPurchased && course.currentPrice > 0 && (
                    <div style={styles.priceTag}>
                        <span style={styles.pricePaid}>{Number(course.currentPrice).toLocaleString('ar-EG')} ج.م</span>
                        <span style={styles.priceLabel}>تم الشراء</span>
                    </div>
                )}

                <button
                    style={{ ...styles.ctaBtn, ...(hovered ? styles.ctaBtnHover : {}), ...(isPurchased ? {} : styles.ctaBtnFree) }}
                    onClick={goToCourse}
                >
                    {progress > 0 ? 'متابعة الدورة' : 'ابدأ الدورة'}
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        style={{ marginRight: '8px', transform: 'rotate(180deg)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
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
            <p style={styles.emptySub}>{sub}</p>
            {!search && (
                <button style={styles.emptyBtn} onClick={() => navigate('/')}>استعرض الدورات</button>
            )}
        </div>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f7f8fc', fontFamily: '"Droid Arabic Kufi", serif', direction: 'rtl' },

    overviewBar: { position: 'fixed', right: 0, left: 0, top: 70, zIndex: 40, backgroundColor: '#f5f5f5', padding: '12px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e0e0e0' },
    overviewBarText: { textAlign: 'center', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif' },
    breadcrumbLink: { marginLeft: '12px', color: '#0865a8', textDecoration: 'none', fontWeight: '500', cursor: 'pointer', transition: 'color 0.2s' },
    breadcrumbSep: { color: '#000', margin: '0 8px', opacity: 0.4 },
    breadcrumbCurrent: { marginRight: '12px', color: '#000', fontWeight: '600' },

    hero: { position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #05416d 0%, #0865a8 45%, #c96000 100%)', paddingTop: '116px', paddingBottom: '52px', paddingLeft: '24px', paddingRight: '24px' },
    heroDeco1: { position: 'absolute', top: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' },
    heroDeco2: { position: 'absolute', bottom: '-80px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(245,124,0,0.18)', pointerEvents: 'none' },
    heroDeco3: { position: 'absolute', top: '40px', right: '30%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' },
    heroInner: { maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 },

    heroTopRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' },
    heroAvatar: { width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '2.5px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: '0 4px 18px rgba(0,0,0,0.2)' },

    // ✅ Larger greeting line to show name prominently
    heroGreeting: { margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif', textShadow: '0 1px 6px rgba(0,0,0,0.2)' },
    heroTitle: { margin: '4px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Droid Arabic Kufi", serif', textShadow: '0 2px 12px rgba(0,0,0,0.18)' },

    heroSub: { fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', fontFamily: '"Droid Arabic Kufi", serif' },
    heroDivider: { width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)', marginBottom: '28px' },

    statsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    statCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '16px', padding: '18px 32px', minWidth: '130px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 14px rgba(0,0,0,0.15)' },
    statIcon: { fontSize: '26px' },
    statValue: { fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: 1 },
    statLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.82)', fontFamily: '"Droid Arabic Kufi", serif' },

    main: { maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 60px' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1.5px solid #ebebeb' },
    searchWrap: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px', backgroundColor: '#f7f8fc', borderRadius: '10px', padding: '8px 14px', border: '1.5px solid #e0e0e0' },
    searchIcon: { width: '18px', height: '18px', color: '#aaa', flexShrink: 0 },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', color: '#333', flex: 1, direction: 'rtl' },
    tabs: { display: 'flex', gap: '8px' },
    tabBtn: { padding: '8px 20px', borderRadius: '8px', border: '1.5px solid #e0e0e0', backgroundColor: '#fff', color: '#555', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', transition: 'all 0.25s', fontWeight: '500' },
    tabBtnActive: { backgroundColor: '#0865a8', color: '#fff', borderColor: '#0865a8', boxShadow: '0 3px 10px rgba(8,101,168,0.25)' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },

    card: { backgroundColor: '#fff', borderRadius: '16px', border: '2px solid #f0f0f0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' },
    cardHover: { transform: 'translateY(-7px)', boxShadow: '0 14px 28px rgba(0,0,0,0.13)', borderColor: '#0865a8' },
    cardHeader: { position: 'relative', height: '160px', overflow: 'hidden' },

    // ✅ Icon placeholder — same style as CoursesPage card headers
    cardImgPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    // ✅ Glassmorphism icon wrapper — matches CoursesPage exactly
    iconWrapper: {
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: '24px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.3)',
    },

    badge: { position: 'absolute', top: '12px', right: '12px', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' },
    badgePaid: { backgroundColor: '#0865a8', color: '#fff', boxShadow: '0 2px 8px rgba(8,101,168,0.35)' },
    badgeFree: { backgroundColor: '#27ae60', color: '#fff', boxShadow: '0 2px 8px rgba(39,174,96,0.35)' },
    progressOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 14px', background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 100%)', transition: 'opacity 0.3s', display: 'flex', justifyContent: 'flex-end' },
    progressOverlayText: { color: '#fff', fontSize: '12px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' },

    cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#111', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },
    metaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', fontFamily: '"Droid Arabic Kufi", serif' },
    metaIcon: { width: '15px', height: '15px', flexShrink: 0, color: '#0865a8' },
    metaText: { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },

    progressSection: { marginTop: '4px' },
    progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
    progressLabel: { fontSize: '12px', color: '#888', fontFamily: '"Droid Arabic Kufi", serif' },
    progressPct: { fontSize: '12px', fontWeight: 'bold', color: '#0865a8', fontFamily: '"Droid Arabic Kufi", serif' },
    progressTrack: { height: '7px', borderRadius: '99px', backgroundColor: '#eef0f5', overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #0865a8 0%, #f57c00 100%)', transition: 'width 0.6s ease' },

    priceTag: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: '#fff8f0', borderRadius: '8px', border: '1.5px solid #fde0b8' },
    pricePaid: { fontSize: '17px', fontWeight: 'bold', color: '#f57c00', fontFamily: '"Droid Arabic Kufi", serif' },
    priceLabel: { fontSize: '12px', color: '#888', fontFamily: '"Droid Arabic Kufi", serif' },

    ctaBtn: { marginTop: 'auto', width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: '0 3px 10px rgba(8,101,168,0.2)' },
    ctaBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(8,101,168,0.32)' },
    ctaBtnFree: { background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)', boxShadow: '0 3px 10px rgba(26,122,60,0.2)' },

    emptyWrap: { textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '2px dashed #d0dce8' },
    emptyIcon: { fontSize: '64px', marginBottom: '16px' },
    emptyTitle: { fontSize: '22px', fontWeight: 'bold', color: '#222', fontFamily: '"Droid Arabic Kufi", serif', margin: '0 0 10px' },
    emptySub: { fontSize: '15px', color: '#777', fontFamily: '"Droid Arabic Kufi", serif', margin: '0 0 28px' },
    emptyBtn: { padding: '13px 36px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', boxShadow: '0 4px 12px rgba(8,101,168,0.25)' },

    authGate: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '120px 20px 60px', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' },
    authGateCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '52px 44px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '100%', border: '1.5px solid #e8eef5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    authGateIcon: { fontSize: '64px' },
    authGateTitle: { fontSize: '26px', fontWeight: 'bold', color: '#111', fontFamily: '"Droid Arabic Kufi", serif', margin: 0 },
    authGateSub: { fontSize: '15px', color: '#666', fontFamily: '"Droid Arabic Kufi", serif', margin: 0, lineHeight: '1.7' },
    btnBrowse: { marginTop: '4px', width: '100%', padding: '10px 24px', backgroundColor: 'transparent', color: '#888', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },
};

const css = `
  * { font-family: "Droid Arabic Kufi", serif !important; box-sizing: border-box; }

  @media (max-width: 640px) {
    .mc-hero         { padding-top: 100px !important; padding-bottom: 36px !important; }
    .mc-hero-top     { gap: 14px !important; }
    .mc-stats-row    { gap: 10px !important; }
    .mc-stat-card    { padding: 12px 18px !important; min-width: 90px !important; }
    .mc-main         { padding: 24px 14px 48px !important; }
    .mc-toolbar      { flex-direction: column !important; align-items: stretch !important; }
    .mc-grid         { grid-template-columns: 1fr !important; gap: 18px !important; }
    .mc-overview-bar { padding: 10px 14px !important; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .mc-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1025px) {
    .mc-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (min-width: 1600px) {
    .mc-grid { grid-template-columns: repeat(4, 1fr) !important; }
  }
`;

export default MyCourses;