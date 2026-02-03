import React, { useState, useEffect } from "react";

export default function TechnicalEducationAlt() {
    const [isMobile, setIsMobile] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const openModal = (imageSrc, title) => {
        setModalImage({ src: imageSrc, title });
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap');

                .tech-container * {
                    font-family: 'Droid Arabic Kufi', serif;
                }

                .tech-image {
                    object-fit: contain;
                    background-color: #f5f5f5;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .tech-image:hover {
                    transform: scale(1.02);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
                }

                /* Modal Styles */
                .tech-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .tech-modal-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    animation: scaleIn 0.3s ease;
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .tech-modal-image {
                    max-width: 100%;
                    max-height: 85vh;
                    width: auto;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    object-fit: contain;
                }

                .tech-modal-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background-color: #f57c00;
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }

                .tech-modal-close:hover {
                    background-color: #0865a8;
                    transform: rotate(90deg);
                }

                .tech-modal-title {
                    position: absolute;
                    bottom: -50px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    color: white;
                    font-size: 1.1rem;
                    padding: 0.5rem;
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                    .tech-fixed-bar {
                        top: 60px !important;
                        padding: 0.4rem 1rem !important;
                    }

                    .tech-container {
                        padding-top: calc(60px + 45px + 1.5rem) !important;
                    }

                    .tech-modal-close {
                        top: 10px;
                        right: 10px;
                    }

                    .tech-modal-title {
                        position: relative;
                        bottom: auto;
                        margin-top: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .tech-fixed-bar-text {
                        font-size: 0.875rem !important;
                    }

                    .tech-modal-close {
                        width: 32px;
                        height: 32px;
                        font-size: 1.2rem;
                    }

                    .tech-modal-title {
                        font-size: 0.9rem;
                    }
                }
            `}</style>

            <div
                className="tech-container"
                style={{
                    direction: "rtl",
                    background: "#ffffff",
                    minHeight: "100vh",
                    padding: isMobile ? "20px 14px" : "60px 0",
                }}
            >
                {/* Fixed Overview Bar */}
                <div
                    className="tech-fixed-bar"
                    style={{
                        position: 'fixed',
                        top: '70px',
                        left: 0,
                        zIndex: 40,
                        width: '100%',
                        borderBottom: '2px solid #e0e0e0',
                        backgroundColor: '#F5F7E1',
                        padding: '0.5rem 1.25rem'
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <span
                            className="tech-fixed-bar-text"
                            style={{ fontSize: '15px' }}
                        >
                            <a
                                href="/"
                                style={{
                                    marginLeft: '0.75rem',
                                    color: '#000000',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    transition: 'color 0.3s'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#f57c00'}
                                onMouseLeave={(e) => e.target.style.color = '#000000'}
                            >
                                الصفحة الرئيسية
                            </a>
                            <span style={{ color: '#666666', margin: '0 0.5rem' }}>-</span>
                            <span style={{ marginRight: '0.75rem', color: '#000000' }}>
                                تطوير التعليم الفني
                            </span>
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: isMobile ? "0" : "0 20px",
                        paddingTop: 'calc(70px + 50px + 2rem)'
                    }}
                >
                    {/* Header Card */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 18,
                            padding: isMobile ? 18 : 28,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            marginBottom: 30,
                            textAlign: "center",
                            border: '1px solid #e8e8e8'
                        }}
                    >
                        <h1
                            style={{
                                fontSize: isMobile ? 22 : 34,
                                fontWeight: "bold",
                                color: "#0865a8",
                                marginBottom: 10,
                            }}
                        >
                            تطوير التعليم الفني
                        </h1>
                        <div
                            style={{
                                width: 70,
                                height: 4,
                                background: "#f57c00",
                                borderRadius: 6,
                                marginBottom: 20,
                                margin: '0 auto 20px'
                            }}
                        />
                        <p
                            style={{
                                fontSize: isMobile ? 14 : 16,
                                color: "#333333",
                                marginBottom: 20,
                                fontWeight: '600'
                            }}
                        >
                            بروتوكول التعاون بين وزارة التربية والتعليم وشركة المقاولون العرب
                        </p>
                        <p
                            style={{
                                lineHeight: 1.9,
                                fontSize: isMobile ? 14 : 15.5,
                                color: "#333",
                            }}
                        >
                            الهدف من هذا البروتوكول إنشاء جيل جديد من خريجي المدارس الثانوية
                            الصناعية يتميز بالجدية في العمل وقادر على تحمل المسئولية والتعامل مع
                            كل جديد في صناعة البناء والتشييد مما يتيح له فرصاً عديدة للعمل
                            بالداخل والخارج ويسهم في توفير إحتياجات السوق المتعطش لهذه العمالة
                            الفنية المدربة.
                        </p>
                    </div>

                    {/* Company Role Card */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 18,
                            padding: isMobile ? 18 : 28,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            marginBottom: 30,
                            border: '1px solid #e8e8e8'
                        }}
                    >
                        <h3
                            style={{
                                color: "#0865a8",
                                fontWeight: "bold",
                                marginBottom: 15,
                                fontSize: isMobile ? 18 : 22,
                            }}
                        >
                            دور الشركة في ثلاثة محاور
                        </h3>
                        <ul style={{ paddingRight: 18, margin: 0 }}>
                            <li
                                style={{
                                    lineHeight: 1.9,
                                    fontSize: isMobile ? 14 : 15.5,
                                    color: "#333",
                                    marginBottom: 12,
                                }}
                            >
                                <span style={{ color: '#f57c00', fontWeight: 'bold', marginLeft: 8 }}>✔</span>
                                اختيار أفضل العناصر ورعايتهم عمليًا وصحيًا وأخلاقيًا.
                            </li>
                            <li
                                style={{
                                    lineHeight: 1.9,
                                    fontSize: isMobile ? 14 : 15.5,
                                    color: "#333",
                                    marginBottom: 12,
                                }}
                            >
                                <span style={{ color: '#f57c00', fontWeight: 'bold', marginLeft: 8 }}>✔</span>
                                رفع كفاءة الكوادر البشرية بالمدارس عبر الدورات التدريبية.
                            </li>
                            <li
                                style={{
                                    lineHeight: 1.9,
                                    fontSize: isMobile ? 14 : 15.5,
                                    color: "#333",
                                }}
                            >
                                <span style={{ color: '#f57c00', fontWeight: 'bold', marginLeft: 8 }}>✔</span>
                                تطوير الورش وإمدادها بالمعدات والأدوات وصيانتها.
                            </li>
                        </ul>
                    </div>

                    {/* Schools Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                            gap: 24,
                            marginBottom: 40,
                        }}
                    >
                        <SchoolCard
                            title="مدرسة المعدات الثقيلة الصناعية بالإسماعيلية"
                            text="التدريب بورش فرع سيناء يوم السبت من كل أسبوع مع توفير أتوبيس لنقل الطلاب لعدد (20) طالب."
                            isMobile={isMobile}
                        />
                        <SchoolCard
                            title="مدرسة أبو رواش الثانوية الصناعية المشتركة"
                            text="التدريب يومي الأربعاء والخميس بالمعهد التكنولوجي – مركز تدريب شبرا لعدد (18) طالب."
                            isMobile={isMobile}
                        />
                        <SchoolCard
                            title="مدرسة الشاطبي الثانوية الصناعية"
                            text="التدريب بورش العامرية المركزية بالإسكندرية – قسم اللحام لعدد (19) طالب."
                            isMobile={isMobile}
                        />
                        <SchoolCard
                            title="مدرسة مدينة نصر الثانوية الصناعية"
                            text="التدريب يوم السبت بمركز تدريب شبرا – قسم الكهرباء لعدد (20) طالب."
                            isMobile={isMobile}
                        />
                    </div>

                    {/* Images Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                            gap: 24,
                        }}
                    >
                        <ImageCard
                            src="/images/tech-02.jpg"
                            alt="صورة تعليم فني 1"
                            openModal={openModal}
                            isMobile={isMobile}
                        />
                        <ImageCard
                            src="/images/tech-03.jpg"
                            alt="صورة تعليم فني 2"
                            openModal={openModal}
                            isMobile={isMobile}
                        />
                    </div>
                </div>

                {/* Image Modal */}
                {modalImage && (
                    <div
                        className="tech-modal-overlay"
                        onClick={closeModal}
                    >
                        <div
                            className="tech-modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="tech-modal-close"
                                onClick={closeModal}
                                aria-label="إغلاق"
                            >
                                ✕
                            </button>
                            <img
                                src={modalImage.src}
                                alt={modalImage.title}
                                className="tech-modal-image"
                            />
                            <div className="tech-modal-title">
                                {modalImage.title}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function SchoolCard({ title, text, isMobile }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                border: '1px solid #e8e8e8',
                borderTop: '4px solid #0865a8',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(8, 101, 168, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
            }}
        >
            <h4
                style={{
                    marginBottom: 10,
                    color: "#0865a8",
                    fontWeight: 'bold',
                    fontSize: isMobile ? 15 : 17,
                    lineHeight: 1.5,
                }}
            >
                {title}
            </h4>
            <p
                style={{
                    lineHeight: 1.8,
                    fontSize: isMobile ? 13 : 14,
                    color: '#333333',
                    margin: 0,
                }}
            >
                {text}
            </p>
        </div>
    );
}

function ImageCard({ src, alt, openModal, isMobile }) {
    return (
        <div
            style={{
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                border: '1px solid #e8e8e8',
                height: isMobile ? 250 : 350,
            }}
        >
            <img
                src={src}
                alt={alt}
                className="tech-image"
                onClick={() => openModal(src, alt)}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
}