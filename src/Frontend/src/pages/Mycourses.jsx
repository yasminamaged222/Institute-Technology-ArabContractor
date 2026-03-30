import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser, useAuth } from '@clerk/clerk-react';
import { Button } from '@mui/material';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const BookIcon = () => (
    <svg width="48" height="48" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332-4.5 1.253" />
    </svg>
);

const CertIcon = ({ color = "currentColor" }) => (
    <svg width="18" height="18" fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
);

const EyeIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

// ✅ Helper: enroll in free course
export const enrollFreeCourse = async (planworkId, getToken) => {
    const token = await getToken();
    const res = await fetch(`${API_BASE}/course/enroll-free/${planworkId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'فشل التسجيل في الكورس');
    return data;
};

// ── Certificate Preview Modal ─────────────────────────────────────────────────
const CertModal = ({ cert, onClose }) => {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const isPdf = cert?.url?.toLowerCase().includes('.pdf');

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <div style={styles.modalTitleRow}>
                        <span style={styles.modalTitleIcon}>📜</span>
                        <span style={styles.modalTitle}>شهادة الإتمام</span>
                    </div>
                    <button style={styles.modalClose} onClick={onClose}>✕</button>
                </div>

                <div style={styles.modalBody}>
                    {isPdf ? (
                        <iframe
                            src={cert.url}
                            title="certificate"
                            style={styles.certIframe}
                        />
                    ) : (
                        <img
                            src={cert.url}
                            alt={cert.name || 'شهادة'}
                            style={styles.certImg}
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    )}
                </div>

                <div style={styles.modalFooter}>
                    <a
                        href={cert.url}
                        download={cert.name || 'certificate'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.modalDownloadBtn}
                    >
                        <DownloadIcon />
                        <span>تحميل الشهادة</span>
                    </a>
                    <button style={styles.modalCancelBtn} onClick={onClose}>إغلاق</button>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ──────────────────────────────────────────────────────────
const MyCourses = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken, isSignedIn } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [search, setSearch] = useState('');
    // ✅ certificates keyed by planworkId (course.id)
    const [certificates, setCertificates] = useState({});
    const [certsLoading, setCertsLoading] = useState({});
    const [previewCert, setPreviewCert] = useState(null);

    const userName = user?.firstName || user?.fullName?.split(' ')[0] || '';

    // ── Fetch enrollments ─────────────────────────────────────────────────────
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
            const mapped = data.map(e => ({
                id: e.childId,
                slug: e.slug || '',
                title: e.serviceTitle || e.title || '',
                place: e.coursePlace || e.place || '',
                instructor: e.coursePlace || e.place || 'غير محدد',
                date: e.courseDate || e.date || '',
                enrolledAt: e.enrolledAt || '',
                isFree: e.isFree === true ||
                    (e.orderId === null || e.orderId === undefined) ||
                    (!e.cost && !e.price && !e.amount),
            }));
            setCourses(mapped);
            return mapped;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, getToken]);

    // ── Fetch certificate for a single course ─────────────────────────────────
    // GET /api/Admin/certificates/{userId}/{planworkId}
    const fetchCertForCourse = useCallback(async (planworkId) => {
        if (!isSignedIn || !user) return;
        setCertsLoading(prev => ({ ...prev, [planworkId]: true }));
        try {
            const token = await getToken();
            const res = await fetch(
                `${API_BASE}/Admin/certificates/${user.id}/${planworkId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) {
                // Not found - explicitly set to null so we know we checked
                setCertificates(prev => ({ ...prev, [planworkId]: null }));
                return;
            }
            const data = await res.json();
            if (data && data.url) {
                setCertificates(prev => ({ ...prev, [planworkId]: data }));
            } else {
                setCertificates(prev => ({ ...prev, [planworkId]: null }));
            }
        } catch {
            setCertificates(prev => ({ ...prev, [planworkId]: null }));
        } finally {
            setCertsLoading(prev => ({ ...prev, [planworkId]: false }));
        }
    }, [isSignedIn, getToken, user]);

    // ── Fetch all certs after courses load ───────────────────────────────────
    const fetchAllCerts = useCallback(async (courseList) => {
        if (!courseList?.length) return;
        // fetch in parallel
        await Promise.allSettled(courseList.map(c => fetchCertForCourse(c.id)));
    }, [fetchCertForCourse]);

    useEffect(() => {
        if (isSignedIn) {
            fetchMyCourses().then(list => fetchAllCerts(list));
        }
    }, [isSignedIn, fetchMyCourses, fetchAllCerts]);

    // ✅ Listen for enroll/cart events to refresh
    useEffect(() => {
        const onUpdate = () => {
            fetchMyCourses().then(list => fetchAllCerts(list));
        };
        window.addEventListener('enrollUpdated', onUpdate);
        window.addEventListener('cartUpdated', onUpdate);
        return () => {
            window.removeEventListener('enrollUpdated', onUpdate);
            window.removeEventListener('cartUpdated', onUpdate);
        };
    }, [fetchMyCourses, fetchAllCerts]);

    const filtered = courses.filter(c =>
        search.trim() === '' ||
        (c.title || '').toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'إجمالي الدورات', value: courses.length, icon: '📚' },
        { label: 'الدورات المسجلة', value: courses.length, icon: '🎓' },
        { label: 'الشهادات', value: Object.values(certificates).filter(v => v !== null).length, icon: '📜' },
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

                {/* Certificate Preview Modal */}
                {previewCert && (
                    <CertModal cert={previewCert} onClose={() => setPreviewCert(null)} />
                )}

                <SignedOut>
                    <div style={styles.authGate}>
                        <div style={styles.authGateCard}>
                            <div style={styles.authGateIcon}>🔒</div>
                            <h2 style={styles.authGateTitle}>يرجى تسجيل الدخول</h2>
                            <p style={styles.authGateSub}>تحتاج لتسجيل الدخول لمشاهدة دوراتك التدريبية والشهادات</p>
                            <SignInButton mode="modal">
                                <Button variant="contained" sx={{
                                    mt: 2, width: '100%', borderRadius: '10px', py: 1.5,
                                    bgcolor: '#0865a8', '&:hover': { bgcolor: '#05416d' },
                                    fontFamily: '"Droid Arabic Kufi", serif'
                                }}>
                                    تسجيل الدخول
                                </Button>
                            </SignInButton>
                            <button style={styles.btnBrowse} onClick={() => navigate('/')}>
                                استعراض الدورات العامة
                            </button>
                        </div>
                    </div>
                </SignedOut>

                <SignedIn>
                    <header style={styles.hero} className="mc-hero">
                        <div style={styles.heroDeco1} />
                        <div style={styles.heroDeco2} />
                        <div style={styles.heroDeco3} />
                        <div style={styles.heroInner}>
                            <div style={styles.heroTopRow}>
                                <div style={styles.heroAvatar}>👤</div>
                                <div>
                                    <p style={styles.heroGreeting}>أهلاً بك، {userName}</p>
                                    <h1 style={styles.heroTitle}>دوراتي التدريبية</h1>
                                </div>
                            </div>
                            <p style={styles.heroSub}>تتبع تقدمك وحمل شهاداتك المعتمدة من هنا</p>
                            <div style={styles.heroDivider} />
                            <div style={styles.statsRow}>
                                {stats.map((s, i) => (
                                    <div key={i} style={styles.statCard}>
                                        <span style={styles.statIcon}>{s.icon}</span>
                                        <span style={styles.statValue}>{s.value}</span>
                                        <span style={styles.statLabel}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </header>

                    <main style={styles.main} className="mc-main">
                        <div style={styles.toolbar} className="mc-toolbar">
                            <div style={styles.searchWrap}>
                                <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    style={styles.searchInput}
                                    placeholder="ابحث عن دورة..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <button style={styles.refreshBtn} onClick={() => fetchMyCourses().then(list => fetchAllCerts(list))}>
                                تحديث القائمة
                            </button>
                        </div>

                        {loading ? (
                            <div style={styles.loadingWrap}>
                                <div style={styles.spinner} />
                                <p style={styles.loadingText}>جاري تحميل دوراتك...</p>
                            </div>
                        ) : error ? (
                            <div style={styles.errorWrap}>
                                <p style={{ color: '#d32f2f' }}>{error}</p>
                                <button style={styles.refreshBtn} onClick={fetchMyCourses}>إعادة المحاولة</button>
                            </div>
                        ) : filtered.length === 0 ? (
                            <EmptyState search={search} navigate={navigate} />
                        ) : (
                            <div style={styles.grid} className="mc-grid">
                                {filtered.map(course => {
                                    const cert = certificates[course.id];
                                    const isCertLoading = certsLoading[course.id];
                                    const hasCert = !!cert;

                                    return (
                                        <div
                                            key={course.id}
                                            style={{
                                                ...styles.card,
                                                ...(hoveredCard === course.id ? styles.cardHover : {})
                                            }}
                                            onMouseEnter={() => setHoveredCard(course.id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            <div style={styles.cardHeader}>
                                                <div style={{
                                                    ...styles.cardImgPlaceholder,
                                                    background: 'linear-gradient(135deg, #0865a8 0%, #05416d 100%)'
                                                }}>
                                                    <div style={styles.iconWrapper}>
                                                        <BookIcon />
                                                    </div>
                                                </div>
                                                <div style={{
                                                    ...styles.badge,
                                                    ...(course.isFree ? styles.badgeFree : styles.badgePaid)
                                                }}>
                                                    {course.isFree ? 'دورة مجانية' : 'دورة مدفوعة'}
                                                </div>
                                            </div>

                                            <div style={styles.cardBody}>
                                                <h3 style={styles.cardTitle}>{course.title}</h3>

                                                <div style={styles.metaRow}>
                                                    <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span style={styles.metaText}>{course.place}</span>
                                                </div>

                                                <div style={styles.metaRow}>
                                                    <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span style={styles.metaText}>تاريخ التسجيل: {new Date(course.enrolledAt).toLocaleDateString('ar-EG')}</span>
                                                </div>

                                                {/* Certificate Section */}
                                                <div style={{
                                                    ...styles.certSection,
                                                    backgroundColor: hasCert ? '#faf5ff' : '#f9fafb',
                                                    borderColor: hasCert ? '#e8d8ff' : '#e5e7eb'
                                                }}>
                                                    <div style={{
                                                        ...styles.certSectionHeader,
                                                        color: hasCert ? '#7c3aed' : '#6b7280'
                                                    }}>
                                                        <CertIcon color={hasCert ? '#7c3aed' : '#6b7280'} />
                                                        <span style={{
                                                            ...styles.certSectionTitle,
                                                            color: hasCert ? '#7c3aed' : '#6b7280'
                                                        }}>
                                                            {isCertLoading ? 'جاري التحقق...' : hasCert ? 'الشهادة جاهزة' : 'الشهادة لم تضاف بعد'}
                                                        </span>
                                                    </div>

                                                    {hasCert && !isCertLoading && (
                                                        <div style={styles.certBtnRow}>
                                                            <button
                                                                className="mc-cert-preview-btn"
                                                                style={styles.certPreviewBtn}
                                                                onClick={() => setPreviewCert(cert)}
                                                            >
                                                                <EyeIcon />
                                                                <span>معاينة</span>
                                                            </button>
                                                            <a
                                                                href={cert.url}
                                                                download={cert.name || 'certificate'}
                                                                className="mc-cert-download-btn"
                                                                style={styles.certDownloadBtn}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <DownloadIcon />
                                                                <span>تحميل</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    style={{
                                                        ...styles.ctaBtn,
                                                        ...(hoveredCard === course.id ? styles.ctaBtnHover : {})
                                                    }}
                                                    onClick={() => navigate(`/course/${course.slug || course.id}`)}
                                                >
                                                    الذهاب لصفحة الكورس
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </SignedIn>
            </div>
        </>
    );
};

const EmptyState = ({ search, navigate }) => (
    <div style={styles.emptyWrap}>
        <div style={styles.emptyIcon}>📂</div>
        <h3 style={styles.emptyTitle}>{search ? 'لا توجد نتائج' : 'لا توجد دورات مسجلة'}</h3>
        <p style={styles.emptySub}>
            {search ? 'جرب البحث بكلمات أخرى' : 'لم تقم بالتسجيل في أي دورة تدريبية بعد'}
        </p>
        {!search && (
            <button style={styles.emptyBtn} onClick={() => navigate('/')}>استعرض الدورات</button>
        )}
    </div>
);

// ── Styles ────────────────────────────────────────────────────────────────────
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
    heroAvatar: { width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '2.5px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' },
    heroGreeting: { margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif' },
    heroTitle: { margin: '4px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Droid Arabic Kufi", serif' },
    heroSub: { fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', fontFamily: '"Droid Arabic Kufi", serif' },
    heroDivider: { width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)', marginBottom: '28px' },
    statsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    statCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '16px', padding: '18px 32px', minWidth: '130px' },
    statIcon: { fontSize: '26px' },
    statValue: { fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: 1 },
    statLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.82)', fontFamily: '"Droid Arabic Kufi", serif' },

    main: { maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 60px' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1.5px solid #ebebeb' },
    searchWrap: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px', backgroundColor: '#f7f8fc', borderRadius: '10px', padding: '8px 14px', border: '1.5px solid #e0e0e0' },
    searchIcon: { width: '18px', height: '18px', color: '#aaa', flexShrink: 0 },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', color: '#333', flex: 1, direction: 'rtl' },
    refreshBtn: { padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #e0e0e0', backgroundColor: '#fff', color: '#555', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },

    loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '20px' },
    spinner: { width: '48px', height: '48px', border: '4px solid #e0e0e0', borderTopColor: '#0865a8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadingText: { fontSize: '16px', color: '#666', fontFamily: '"Droid Arabic Kufi", serif' },
    errorWrap: { textAlign: 'center', padding: '80px 20px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', border: '2px solid #f0f0f0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' },
    cardHover: { transform: 'translateY(-7px)', boxShadow: '0 14px 28px rgba(0,0,0,0.13)', borderColor: '#0865a8' },
    cardHeader: { position: 'relative', height: '160px', overflow: 'hidden' },
    cardImgPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    iconWrapper: { borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', padding: '24px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' },
    badge: { position: 'absolute', top: '12px', right: '12px', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' },
    badgePaid: { backgroundColor: '#0865a8', color: '#fff', boxShadow: '0 2px 8px rgba(8,101,168,0.35)' },
    badgeFree: { backgroundColor: '#1a7a4a', color: '#fff', boxShadow: '0 2px 8px rgba(26,122,74,0.35)' },

    cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#111', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },
    metaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', fontFamily: '"Droid Arabic Kufi", serif' },
    metaIcon: { width: '15px', height: '15px', flexShrink: 0, color: '#0865a8' },
    metaText: { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },

    // ✅ Certificate section inside card body
    certSection: { borderRadius: '12px', border: '1.5px solid #e8d8ff', backgroundColor: '#faf5ff', padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: '10px' },
    certSectionHeader: { display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontSize: '13px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' },
    certSectionTitle: { fontSize: '13px', fontWeight: 'bold', color: '#7c3aed', fontFamily: '"Droid Arabic Kufi", serif' },
    certBtnRow: { display: 'flex', gap: '8px' },

    certPreviewBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 12px', backgroundColor: '#ffffff', color: '#7c3aed', border: '1.5px solid #c4b5fd', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', transition: 'all 0.2s ease' },
    certDownloadBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 12px', background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 3px 10px rgba(124,58,237,0.35)', transition: 'all 0.2s ease' },

    ctaBtn: { marginTop: 'auto', width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' },
    ctaBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(8,101,168,0.32)' },

    emptyWrap: { textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '2px dashed #d0dce8' },
    emptyIcon: { fontSize: '64px', marginBottom: '16px' },
    emptyTitle: { fontSize: '22px', fontWeight: 'bold', color: '#222', fontFamily: '"Droid Arabic Kufi", serif', margin: '0 0 10px' },
    emptySub: { fontSize: '15px', color: '#777', fontFamily: '"Droid Arabic Kufi", serif', margin: '0 0 28px' },
    emptyBtn: { padding: '13px 36px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },

    authGate: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '120px 20px 60px' },
    authGateCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '52px 44px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    authGateIcon: { fontSize: '64px' },
    authGateTitle: { fontSize: '26px', fontWeight: 'bold', color: '#111', fontFamily: '"Droid Arabic Kufi", serif', margin: 0 },
    authGateSub: { fontSize: '15px', color: '#666', fontFamily: '"Droid Arabic Kufi", serif', margin: 0 },
    btnBrowse: { marginTop: '4px', width: '100%', padding: '10px 24px', backgroundColor: 'transparent', color: '#888', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },

    // ── Modal ──────────────────────────────────────────────────────────────────
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalBox: { backgroundColor: '#fff', borderRadius: '20px', width: '100%', maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden' },
    modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1.5px solid #f0e6ff', background: 'linear-gradient(135deg, #faf5ff 0%, #fff 100%)' },
    modalTitleRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    modalTitleIcon: { fontSize: '22px' },
    modalTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111', fontFamily: '"Droid Arabic Kufi", serif' },
    modalClose: { width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid #e0e0e0', backgroundColor: '#f5f5f5', color: '#555', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' },
    modalBody: { flex: 1, overflow: 'auto', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', minHeight: '300px' },
    certIframe: { width: '100%', height: '500px', border: 'none', borderRadius: '8px' },
    certImg: { maxWidth: '100%', maxHeight: '500px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' },
    modalFooter: { display: 'flex', gap: '12px', padding: '16px 24px', borderTop: '1.5px solid #f0e6ff', justifyContent: 'center' },
    modalDownloadBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 28px', background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)', color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', textDecoration: 'none', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' },
    modalCancelBtn: { padding: '11px 28px', backgroundColor: '#f5f5f5', color: '#555', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', cursor: 'pointer' },
};

const css = `
  * { font-family: "Droid Arabic Kufi", serif !important; box-sizing: border-box; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .mc-cert-preview-btn:hover { background-color: #f3e8ff !important; border-color: #a78bfa !important; }
  .mc-cert-download-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  @media (max-width: 640px) {
    .mc-hero { padding-top: 100px !important; }
    .mc-main { padding: 24px 14px 48px !important; }
    .mc-toolbar { flex-direction: column !important; }
    .mc-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .mc-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1025px) {
    .mc-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
`;

export default MyCourses;

// ── CoursePage Component ──────────────────────────────────────────────────────
export const CoursePage = ({ courseId }) => {
    const { user } = useUser();
    const { getToken, isSignedIn } = useAuth();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewCert, setPreviewCert] = useState(null);

    const fetchCert = useCallback(async () => {
        if (!isSignedIn || !user || !courseId) return;
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/Admin/certificates/${user.id}/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.url) setCert(data);
            }
        } catch (err) {
            console.error("Error fetching certificate:", err);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, user, courseId, getToken]);

    useEffect(() => {
        fetchCert();
    }, [fetchCert]);

    return (
        <div style={pageStyles.container}>
            {previewCert && <CertModal cert={previewCert} onClose={() => setPreviewCert(null)} />}

            <div style={{
                ...pageStyles.certCard,
                backgroundColor: cert ? '#faf5ff' : '#f9fafb',
                borderColor: cert ? '#e8d8ff' : '#e5e7eb'
            }}>
                <div style={{
                    ...pageStyles.certHeader,
                    color: cert ? '#7c3aed' : '#6b7280'
                }}>
                    <CertIcon color={cert ? '#7c3aed' : '#6b7280'} />
                    <span style={pageStyles.certTitle}>
                        {loading ? 'جاري التحقق من الشهادة...' : cert ? 'شهادة الإتمام جاهزة' : 'الشهادة لم تضاف بعد'}
                    </span>
                </div>

                {cert && !loading && (
                    <div style={pageStyles.btnGroup}>
                        <button style={pageStyles.viewBtn} onClick={() => setPreviewCert(cert)}>
                            <EyeIcon />
                            <span>عرض الشهادة</span>
                        </button>
                        <a href={cert.url} download style={pageStyles.downloadBtn} target="_blank" rel="noopener noreferrer">
                            <DownloadIcon />
                            <span>تحميل</span>
                        </a>
                    </div>
                )}

                {!cert && !loading && (
                    <p style={pageStyles.statusText}>سيتم إشعارك فور اعتماد الشهادة من قبل الإدارة</p>
                )}
            </div>
        </div>
    );
};

// ── CourseDetails Component ──────────────────────────────────────────────────
export const CourseDetails = ({ courseId }) => {
    const { user } = useUser();
    const { getToken, isSignedIn } = useAuth();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewCert, setPreviewCert] = useState(null);

    useEffect(() => {
        const fetchCert = async () => {
            if (!isSignedIn || !user || !courseId) return;
            try {
                const token = await getToken();
                const res = await fetch(`${API_BASE}/Admin/certificates/${user.id}/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.url) setCert(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCert();
    }, [isSignedIn, user, courseId, getToken]);

    return (
        <div style={detailStyles.section}>
            {previewCert && <CertModal cert={previewCert} onClose={() => setPreviewCert(null)} />}

            <h4 style={detailStyles.title}>الشهادة المعتمدة</h4>
            <div style={{
                ...detailStyles.statusBox,
                backgroundColor: cert ? '#f5f3ff' : '#f8fafc'
            }}>
                <div style={detailStyles.info}>
                    <div style={{
                        ...detailStyles.iconBg,
                        backgroundColor: cert ? '#ddd6fe' : '#e2e8f0'
                    }}>
                        <CertIcon color={cert ? '#7c3aed' : '#64748b'} />
                    </div>
                    <div>
                        <div style={{
                            ...detailStyles.statusLabel,
                            color: cert ? '#7c3aed' : '#64748b'
                        }}>
                            {loading ? 'جاري التحقق...' : cert ? 'الشهادة متوفرة' : 'بانتظار الإدارة'}
                        </div>
                        <div style={detailStyles.statusSub}>
                            {cert ? 'يمكنك الآن تحميل شهادتك الرسمية' : 'لم يتم رفع الشهادة لهذا الكورس حتى الآن'}
                        </div>
                    </div>
                </div>

                {cert && (
                    <div style={detailStyles.actions}>
                        <button style={detailStyles.actionBtn} onClick={() => setPreviewCert(cert)}>معاينة</button>
                        <a href={cert.url} download style={detailStyles.actionBtnPrimary}>تحميل</a>
                    </div>
                )}
            </div>
        </div>
    );
};

const pageStyles = {
    container: { margin: '20px 0' },
    certCard: { padding: '20px', borderRadius: '12px', border: '1px solid', display: 'flex', flexDirection: 'column', gap: '15px' },
    certHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' },
    certTitle: { fontSize: '16px' },
    btnGroup: { display: 'flex', gap: '10px' },
    viewBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #c4b5fd', borderRadius: '8px', color: '#7c3aed', cursor: 'pointer', fontWeight: 'bold' },
    downloadBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold' },
    statusText: { fontSize: '14px', color: '#6b7280', margin: 0 }
};

const detailStyles = {
    section: { marginTop: '30px' },
    title: { fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' },
    statusBox: { padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
    info: { display: 'flex', alignItems: 'center', gap: '12px' },
    iconBg: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statusLabel: { fontWeight: 'bold', fontSize: '15px' },
    statusSub: { fontSize: '13px', color: '#94a3b8' },
    actions: { display: 'flex', gap: '8px' },
    actionBtn: { padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    actionBtnPrimary: { padding: '6px 14px', borderRadius: '6px', backgroundColor: '#7c3aed', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }
};
