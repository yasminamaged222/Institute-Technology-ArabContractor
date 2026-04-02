import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ─── Design tokens (mirrored from Team.jsx) ──────────────────────── */
const T = {
    orange: '#f57c00',
    orangeLight: '#ff9a3c',
    orangeDark: '#bf5200',
    blue: '#0865a8',
    blueLight: '#1a84d4',
    blueDark: '#044478',
    black: '#0a0a0a',
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray100: '#f0f1f2',
    gray300: '#d0d3d8',
    gray500: '#6b7280',
    gray700: '#374151',
    font: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif',
};

/* ─── Keyframe injection (one-time) ─────── */
const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&display=swap');

    .nd-root { direction: rtl; font-family: ${T.font}; background: ${T.white}; overflow-x: hidden; }

    /* hero grid overlay */
    .nd-hero-grid::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px);
        background-size: 56px 56px;
        pointer-events: none;
        z-index: 1;
    }

    /* diagonal cuts */
    .nd-hero-cut::after  { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.white}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }
    .nd-blue-cut::after  { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.blue}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }
    .nd-black-cut::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.black}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }

    /* breadcrumb link */
    .nd-bc-link { transition: color 0.25s; }
    .nd-bc-link:hover { color: ${T.orange} !important; }

    /* share buttons */
    .nd-share-btn { transition: opacity 0.28s, transform 0.28s, box-shadow 0.28s; cursor: pointer; }
    .nd-share-btn:hover { opacity: 0.88; transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.22) !important; }

    /* back button */
    .nd-back-btn { transition: background 0.28s, transform 0.28s, box-shadow 0.28s; cursor: pointer; }
    .nd-back-btn:hover { background: ${T.blueDark} !important; transform: translateY(-3px); box-shadow: 0 6px 16px rgba(8,101,168,0.35) !important; }

    /* related card */
    .nd-rel-card { transition: transform 0.38s cubic-bezier(.4,0,.2,1), box-shadow 0.38s, border-color 0.38s; cursor: pointer; }
    .nd-rel-card::before { content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform 0.38s cubic-bezier(.4,0,.2,1); z-index:2; }
    .nd-rel-card:hover { transform: translateY(-8px); box-shadow: 0 18px 48px rgba(0,0,0,0.18) !important; border-color: ${T.orange} !important; }
    .nd-rel-card:hover::before { transform: scaleY(1); }
    .nd-rel-card:hover .nd-rel-img { transform: scale(1.06); }

    /* gradient bar */
    .nd-bar { height:4px; background:linear-gradient(to left,${T.orange},${T.blue}); transform:scaleX(0); transform-origin:right; transition:transform 0.38s cubic-bezier(.4,0,.2,1); }
    .nd-rel-card:hover .nd-bar { transform:scaleX(1); }

    /* rel-img */
    .nd-rel-img { transition: transform 0.5s cubic-bezier(.4,0,.2,1); }

    /* hero zoom icon */
    .nd-zoom-badge { transition: background 0.28s; }
    .nd-hero-section:hover .nd-zoom-badge { background: rgba(8,101,168,0.85) !important; }

    /* image modal fade */
    @keyframes nd-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes nd-zoomIn  { from { transform:scale(1.08); opacity:0; } to { transform:scale(1); opacity:1; } }
    @keyframes nd-slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    @keyframes nd-spin    { 0%{ transform:rotate(0deg); } 100%{ transform:rotate(360deg); } }

    .nd-spinner {
        width: 52px; height: 52px;
        border: 4px solid ${T.gray100};
        border-top: 4px solid ${T.orange};
        border-radius: 50%;
        animation: nd-spin 1s linear infinite;
    }

    /* responsive related grid */
    .nd-rel-grid { display:grid; gap:clamp(16px,3vw,28px); grid-template-columns:1fr; }
    @media(min-width:600px){ .nd-rel-grid { grid-template-columns:repeat(2,1fr); } }
    @media(min-width:960px){ .nd-rel-grid { grid-template-columns:repeat(3,1fr); } }

    /* content html */
    .nd-content-html { font-size:clamp(14px,1.8vw,17px); line-height:2; color:${T.black}; font-family:${T.font}; }
    .nd-content-html p  { margin-bottom: 1.2em; }
    .nd-content-html img { max-width:100%; border-radius:4px; margin:1em 0; }

    /* mobile */
    @media(max-width:768px){
        .nd-hero-inner h1 { font-size:clamp(18px,5vw,28px) !important; }
    }
`;

function injectStyles() {
    if (document.getElementById('nd-styles')) return;
    const el = document.createElement('style');
    el.id = 'nd-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
}

/* ─── Shared sub-components (same API as Team.jsx) ─────────────────── */
const SectionLabel = ({ light = false, children }) => (
    <span style={{
        display: 'inline-block',
        background: light ? 'rgba(255,255,255,0.12)' : T.orange,
        color: light ? T.orangeLight : T.white,
        fontFamily: T.font,
        fontSize: 'clamp(10px,1.2vw,13px)',
        fontWeight: 700,
        padding: '5px 18px',
        borderRadius: '2px',
        marginBottom: '10px',
        letterSpacing: '0.05em',
    }}>
        {children}
    </span>
);

const SectionHeading = ({ light = false, children }) => (
    <h2 style={{
        fontSize: 'clamp(20px,3vw,36px)',
        fontWeight: 900,
        color: light ? T.white : T.black,
        fontFamily: T.font,
        lineHeight: 1.35,
        marginBottom: '10px',
    }}>
        {children}
    </h2>
);

const HeadingBar = ({ light = false }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: 'clamp(28px,4.5vw,50px)' }}>
        <div style={{ width: '52px', height: '4px', background: light ? T.orangeLight : T.orange, borderRadius: '2px' }} />
    </div>
);

/* ─── Main Component ────────────────────────────────────────────────── */
const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        injectStyles();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setLoading(true);
        fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/news/${id}`)
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(data => {
                setNewsItem(data);
                setLoading(false);
                const year = new Date(data.publishedAt).getFullYear();
                return fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews?year=${year}`);
            })
            .then(r => r.json())
            .then(data => {
                const filtered = (data.data || []).filter(i => i.id !== parseInt(id));
                setRelatedNews(filtered.sort(() => 0.5 - Math.random()).slice(0, 3));
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [id]);

    useEffect(() => {
        document.title = newsItem?.title
            ? `${newsItem.title} - المعهد التكنولوجي لهندسة التشييد والإدارة`
            : 'تفاصيل الخبر - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, [newsItem]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = newsItem?.title || '';
        const map = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        };
        if (map[platform]) window.open(map[platform], '_blank');
    };

    const sectionInner = { maxWidth: 'min(1280px,94vw)', margin: '0 auto' };

    /* ── Loading ── */
    if (loading) return (
        <div className="nd-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.blueDark }}>
            <div className="nd-spinner" />
            <p style={{ marginTop: '22px', color: T.orangeLight, fontFamily: T.font, fontSize: 'clamp(13px,1.6vw,17px)' }}>
                جارٍ تحميل التفاصيل...
            </p>
        </div>
    );

    /* ── Error ── */
    if (error || !newsItem) return (
        <div className="nd-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.blueDark, gap: '20px' }}>
            <p style={{ color: T.orangeLight, fontFamily: T.font, fontSize: 'clamp(14px,1.8vw,18px)' }}>حدث خطأ في تحميل الخبر</p>
            <button
                className="nd-back-btn"
                onClick={() => navigate('/news')}
                style={{ padding: '12px 36px', background: T.orange, color: T.white, border: 'none', borderRadius: '3px', fontFamily: T.font, fontWeight: 700, fontSize: '1rem' }}
            >
                العودة للأخبار
            </button>
        </div>
    );

    const formattedDate = new Date(newsItem.publishedAt).toLocaleDateString('ar-EG', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="nd-root">

            {/* ══ FIXED BREADCRUMB BAR ══════════════════ */}
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: `1px solid ${T.gray300}`, backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: T.font, fontSize: '1rem' }}>
                    <a href="/" className="nd-bc-link" style={{ color: T.gray700, fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الصفحة الرئيسية</a>
                    <span style={{ color: T.gray500, margin: '0 6px' }}>-</span>
                    <a href="/news" className="nd-bc-link" style={{ color: T.gray700, fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الأخبار</a>
                    <span style={{ color: T.gray500, margin: '0 6px' }}>-</span>
                    <span style={{ color: T.gray700, fontWeight: 700 }}>تفاصيل الخبر</span>
                </div>
            </div>

            {/* ══ HERO ════════════════════════════════════ */}
            <section
                className="nd-hero-grid nd-hero-cut nd-hero-section"
                style={{
                    position: 'relative',
                    minHeight: 'clamp(340px,52vw,580px)',
                    background: T.blueDark,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 'clamp(130px,16vw,180px) 0 clamp(90px,13vw,150px)',
                    cursor: 'pointer',
                    marginTop: '0',
                }}
                onClick={() => setShowModal(true)}
            >
                {/* Right orange accent bar */}
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 'clamp(6px,0.8vw,10px)', height: '100%',
                    background: `linear-gradient(to bottom, ${T.orange}, ${T.orangeLight})`,
                    zIndex: 4,
                }} />

                {/* Background image */}
                <img
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center',
                        animation: 'nd-zoomIn 0.9s ease-out',
                        zIndex: 0,
                    }}
                />

                {/* Dark gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(180deg, rgba(4,68,120,0.45) 0%, rgba(4,68,120,0.82) 100%)`,
                    zIndex: 2,
                }} />

                {/* Zoom badge */}
                <span
                    className="nd-zoom-badge"
                    style={{
                        position: 'absolute', top: '80px', left: '24px', zIndex: 4,
                        background: 'rgba(0,0,0,0.55)',
                        color: T.white,
                        padding: '8px 16px',
                        borderRadius: '3px',
                        fontSize: 'clamp(11px,1.3vw,14px)',
                        fontFamily: T.font,
                        fontWeight: 700,
                    }}
                >
                    🔍 اضغط للتكبير
                </span>

                {/* Hero text */}
                <div className="nd-hero-inner" style={{ position: 'relative', zIndex: 4, padding: '0 clamp(20px,6vw,80px)', width: '100%' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <span style={{
                            display: 'inline-block',
                            background: T.orange,
                            color: T.white,
                            fontFamily: T.font,
                            fontSize: 'clamp(10px,1.2vw,13px)',
                            fontWeight: 700,
                            padding: '6px 22px',
                            borderRadius: '2px',
                            marginBottom: 'clamp(12px,2vw,20px)',
                            letterSpacing: '0.05em',
                        }}>
                            {formattedDate}
                        </span>

                        <h1 style={{
                            fontSize: 'clamp(20px,3.8vw,50px)',
                            fontWeight: 900,
                            color: T.white,
                            fontFamily: T.font,
                            lineHeight: 1.35,
                            maxWidth: '820px',
                            margin: 0,
                            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                            animation: 'nd-slideUp 0.65s ease-out',
                        }}>
                            {newsItem.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* ══ ARTICLE CONTENT — white bg → blue cut ══ */}
            <section
                className="nd-blue-cut"
                style={{
                    position: 'relative',
                    background: T.white,
                    padding: 'clamp(48px,7vw,90px) clamp(16px,6vw,60px) clamp(100px,15vw,170px)',
                }}
            >
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4.5vw,48px)' }}>
                        <SectionLabel>تفاصيل الخبر</SectionLabel><br />
                        <SectionHeading>
                            محتوى <span style={{ color: T.orange }}>الخبر</span>
                        </SectionHeading>
                        <HeadingBar />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                            background: T.white,
                            border: `1.5px solid ${T.gray100}`,
                            borderRadius: '3px',
                            boxShadow: `0 4px 24px rgba(0,0,0,0.07)`,
                            overflow: 'hidden',
                        }}
                    >
                        {/* top accent bar */}
                        <div style={{ height: '4px', background: `linear-gradient(to left, ${T.orange}, ${T.blue})` }} />
                        <div style={{ padding: 'clamp(24px,4vw,48px) clamp(20px,4vw,48px)', textAlign: 'justify' }}>
                            {newsItem.details
                                ? <div className="nd-content-html" dangerouslySetInnerHTML={{ __html: newsItem.details }} />
                                : <p className="nd-content-html">{newsItem.description || 'لا يوجد محتوى متاح لهذا الخبر.'}</p>
                            }
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══ SHARE SECTION — blue bg → black cut ═════ */}
            <section
                className="nd-black-cut"
                style={{
                    position: 'relative',
                    background: T.blue,
                    padding: 'clamp(80px,12vw,140px) clamp(16px,6vw,60px) clamp(100px,15vw,170px)',
                }}
            >
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
                        <SectionLabel light>التفاعل مع الخبر</SectionLabel><br />
                        <SectionHeading light>
                            شارك <span style={{ color: T.orangeLight }}>الخبر</span>
                        </SectionHeading>
                        <HeadingBar light />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'clamp(12px,2vw,20px)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {[
                            { label: 'Facebook', platform: 'facebook', bg: '#1877f2' },
                            { label: 'WhatsApp', platform: 'whatsapp', bg: '#25d366' },
                            { label: 'Twitter', platform: 'twitter', bg: '#1da1f2' },
                        ].map(({ label, platform, bg }) => (
                            <button
                                key={platform}
                                className="nd-share-btn"
                                onClick={() => handleShare(platform)}
                                style={{
                                    background: bg,
                                    color: T.white,
                                    fontFamily: T.font,
                                    fontSize: 'clamp(13px,1.5vw,16px)',
                                    fontWeight: 700,
                                    padding: 'clamp(10px,1.5vw,14px) clamp(24px,3.5vw,40px)',
                                    border: 'none',
                                    borderRadius: '3px',
                                    minWidth: 'clamp(130px,14vw,170px)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                                }}
                            >
                                {label}
                            </button>
                        ))}

                        <button
                            className="nd-back-btn"
                            onClick={() => navigate('/news')}
                            style={{
                                background: T.orange,
                                color: T.white,
                                fontFamily: T.font,
                                fontSize: 'clamp(13px,1.5vw,16px)',
                                fontWeight: 700,
                                padding: 'clamp(10px,1.5vw,14px) clamp(24px,3.5vw,40px)',
                                border: 'none',
                                borderRadius: '3px',
                                minWidth: 'clamp(160px,16vw,200px)',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                            }}
                        >
                            العودة إلى الأخبار
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ══ RELATED NEWS — black bg ══════════════════ */}
            {relatedNews.length > 0 && (
                <section style={{
                    background: T.black,
                    padding: 'clamp(56px,9vw,110px) clamp(16px,6vw,60px) clamp(56px,9vw,110px)',
                }}>
                    <div style={sectionInner}>
                        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
                            <SectionLabel light>اكتشف المزيد</SectionLabel><br />
                            <SectionHeading light>
                                أخبار <span style={{ color: T.orangeLight }}>ذات صلة</span>
                            </SectionHeading>
                            <HeadingBar light />
                        </div>

                        <div className="nd-rel-grid">
                            {relatedNews.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="nd-rel-card"
                                    initial={{ opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                                    onClick={() => navigate(`/news/${item.id}`)}
                                    style={{
                                        position: 'relative',
                                        background: T.white,
                                        borderRadius: '3px',
                                        overflow: 'hidden',
                                        border: `1.5px solid ${T.gray100}`,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                                    }}
                                >
                                    {/* Image */}
                                    <div style={{ position: 'relative', height: 'clamp(160px,18vw,220px)', overflow: 'hidden' }}>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="nd-rel-img"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </div>

                                    {/* Gradient bar */}
                                    <div className="nd-bar" />

                                    {/* Body */}
                                    <div style={{ padding: 'clamp(14px,2vw,22px) clamp(12px,2vw,18px)' }}>
                                        <p style={{
                                            fontSize: 'clamp(10px,1.2vw,13px)',
                                            color: T.orange,
                                            fontFamily: T.font,
                                            fontWeight: 700,
                                            marginBottom: '8px',
                                        }}>
                                            {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                            })}
                                        </p>
                                        <h3 style={{
                                            fontSize: 'clamp(13px,1.6vw,16px)',
                                            fontWeight: 700,
                                            color: T.blue,
                                            fontFamily: T.font,
                                            lineHeight: 1.6,
                                            margin: 0,
                                            transition: 'color 0.3s',
                                        }}>
                                            {item.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══ BLACK CLOSING STRIP ══════════════════════ */}
            <div style={{
                background: T.black,
                borderTop: `1px solid rgba(255,255,255,0.06)`,
                padding: 'clamp(36px,5vw,60px) clamp(16px,6vw,60px)',
                textAlign: 'center',
            }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: T.font, fontSize: 'clamp(11px,1.3vw,14px)' }}>
                    المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}
                </p>
            </div>

            {/* ══ IMAGE MODAL ════════════════════════════════ */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.92)',
                        zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px',
                        animation: 'nd-fadeIn 0.3s ease-out',
                    }}
                >
                    <button
                        onClick={e => { e.stopPropagation(); setShowModal(false); }}
                        style={{
                            position: 'absolute', top: '20px', left: '20px',
                            background: T.orange,
                            border: 'none', borderRadius: '50%',
                            width: '42px', height: '42px',
                            fontSize: '22px', cursor: 'pointer',
                            color: T.white,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                            zIndex: 10000,
                            fontWeight: 900,
                        }}
                    >
                        ×
                    </button>
                    <img
                        src={newsItem.imageUrl}
                        alt={newsItem.title}
                        onClick={e => e.stopPropagation()}
                        style={{
                            maxWidth: '90%', maxHeight: '90%',
                            objectFit: 'contain',
                            borderRadius: '3px',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                            animation: 'nd-zoomIn 0.4s ease-out',
                        }}
                    />
                </div>
            )}

        </div>
    );
};

export default NewsDetails;