import React, { useEffect } from "react";
import './vision_goals.css';
import { FaHardHat, FaCalendarAlt, FaUsers, FaLaptop, FaGraduationCap, FaCogs } from 'react-icons/fa';
import img2 from '/images/vision.jfif';
import img1 from '../../assets/img1.jpg';

function Vision_goals() {

    useEffect(() => {
        document.title = 'الرؤية والأهداف - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <div className="page-root-vision" style={{ fontFamily: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif' }}>

            {/* ══════════════════════════════════════
                FIXED OVERVIEW BAR
                Kept exactly as requested — inline styles preserved
            ══════════════════════════════════════ */}
           
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                    <a
                        href="/"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        الصفحة الرئيسية
                    </a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', marginRight: '8px' }}>الرؤية والأهداف</span>
                </div>
            </div>


            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <section className="vision-hero">
                <div className="vision-hero-accent" />
                <div className="vision-hero-content">
                    <span className="vision-hero-eyebrow">المعهد التكنولوجي لهندسة التشييد والإدارة</span>
                    <h1 className="vision-hero-title">
                        الرؤية <em>والأهداف</em>
                    </h1>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 1 — VISION & MISSION
                white bg → diagonal blue cut at bottom
            ══════════════════════════════════════ */}
            <section className="vision-mission-section">
                <div className="section-inner">
                    <div className="vision-mission-container">

                        {/* Image */}
                        <div className="image-container">
                            <img
                                src={img1}
                                alt="الرؤية والرسالة"
                                className="main-image"
                            />
                            <div className="image-overlay">
                                <h2 className="overlay-title">الرؤية والرسالة</h2>
                            </div>
                        </div>

                        {/* Vision + Mission cards */}
                        <div className="vision-mission-grid">

                            <div className="vision-section">
                                <h2 className="section-title text-right">الرؤية</h2>
                                <p className="text-content text-right">
                                    تحقيق الريادة في التعليم والتدريب المهني محليًا وإقليميًا،
                                    وتوفير الدعم التدريبي للعاملين بالشركة.
                                </p>
                            </div>

                            <div className="mission-section">
                                <h2 className="section-title text-right">الرسالة</h2>
                                <p className="text-content text-right">
                                    إعداد وتأهيل أجيال من الكوادر المهنية المتميزة لتلبية متطلبات الشركة
                                    وسوق العمل من خلال بيئة تدريبية مثالية طبقًا لمعايير الجودة.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 2 — STRATEGY
                blue bg, diagonal top, diagonal bottom into gray
            ══════════════════════════════════════ */}
            <section className="strategy-container">
                <div className="section-inner">
                    <div className="strategy-wrapper">

                        {/* Image */}
                        <div className="image-container">
                            <img
                                src={img2}
                                alt="إستراتيجية العمل"
                                className="main-image"
                            />
                            <div className="image-overlay">
                                <h2 className="overlay-title">إستراتيجية العمل</h2>
                            </div>
                        </div>

                        {/* Strategy items */}
                        <div className="strategy-section">
                            <span className="section-label">خططنا وتوجهاتنا</span>
                            <h2 className="section-heading text-right">
                                إستراتيجية <span>العمل</span>
                            </h2>
                            <div className="heading-bar" />

                            <div className="strategy-items">

                                <div className="strategy-item">
                                    <div className="icon-box">
                                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="strategy-text text-right">
                                        إعداد أجيال من الكوادر المؤهلين في بيئة مبتكرة وداعمة يتمتعون
                                        بالتميز التقني والمهارات القيادية والمهارات العملية.
                                    </p>
                                </div>

                                <div className="strategy-item">
                                    <div className="icon-box">
                                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <p className="strategy-text text-right">
                                        الارتقاء بالدور القيادي للمعهد في مجال التعليم الفني والتطوير
                                        للمساهمة في تنمية اقتصاد المعرفة من خلال إقامة شراكات مجتمعية فاعلة.
                                    </p>
                                </div>

                                <div className="strategy-item">
                                    <div className="icon-box">
                                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="strategy-text text-right">
                                        تعزيز دور المعهد من خلال تقديم برامج وخدمات ودراسات معتمدة
                                        محليًا وعالميًا تستجيب لمتغيرات سوق العمل.
                                    </p>
                                </div>

                                <div className="strategy-item">
                                    <div className="icon-box">
                                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                        </svg>
                                    </div>
                                    <p className="strategy-text text-right">
                                        ضمان تقديم كافة الخدمات وفق معايير الجودة والكفاءة العالمية
                                        وترسيخ ثقافة الابتكار في بيئة العمل المؤسسي.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 3 — GOALS
                gray bg, diagonal top, black cut at bottom
            ══════════════════════════════════════ */}
            <section className="goals-container">
                <div className="goals-wrapper">

                    <div className="goals-title-section">
                        <h2 className="goals-title">
                            <em>الأهداف</em>
                        </h2>
                        <p className="goals-subtitle">
                            يهدف المعهد لتطوير مستوى العاملين من خلال:
                        </p>
                    </div>

                    <div className="bottom-boxes">

                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                إيجاد فرص للتعاون مع الجهات ذات الصلة مثل الجامعات ومعاهد البحوث
                                والهيئات الدولية.
                            </p>
                        </div>

                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                ربط المسار المهنى للمشرف والعامل الحرفى بخطط التدريب الفنية.
                            </p>
                        </div>

                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                إعداد وتأهيل قيادات الصف الثاني بالشركة (قادة المستقبل).
                            </p>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}

export default Vision_goals;