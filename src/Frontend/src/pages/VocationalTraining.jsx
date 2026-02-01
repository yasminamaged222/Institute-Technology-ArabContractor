import React from 'react';

export default function VocationalTraining() {
    const handleNavigate = (path) => {
        window.location.href = path;
    };

    const centers = [
        {
            title: 'مركز جسر السويس',
            description: 'مركز تدريب متخصص يقدم برامج حرفية متنوعة',
            path: '/gesr-el-suez',
            icon: '🏢',
            gradient: 'linear-gradient(135deg, #f57c00, #ff9800)'
        },
        {
            title: 'مركز تدريب شبرا',
            description: 'مركز تدريب حديث لتطوير المهارات الحرفية',
            path: '/shobra',
            icon: '🏛️',
            gradient: 'linear-gradient(135deg, #0865a8, #1976d2)'
        }
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap');

                .vocational-container * {
                    font-family: 'Droid Arabic Kufi', serif;
                }

                .vocational-card {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .vocational-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .vocational-button {
                    transition: all 0.3s ease;
                }

                .vocational-button:hover {
                    transform: scale(1.05);
                    opacity: 0.9;
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                    .vocational-header-title {
                        font-size: 2rem !important;
                    }

                    .vocational-header-description {
                        font-size: 1rem !important;
                    }

                    .vocational-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }

                    .vocational-fixed-bar {
                        top: 60px !important;
                        padding: 0.4rem 1rem !important;
                    }

                    .vocational-main-content {
                        padding-top: calc(60px + 45px + 1.5rem) !important;
                        padding-left: 0.75rem !important;
                        padding-right: 0.75rem !important;
                    }
                }

                @media (max-width: 480px) {
                    .vocational-header-title {
                        font-size: 1.75rem !important;
                    }

                    .vocational-header-description {
                        font-size: 0.95rem !important;
                        padding: 0 1rem;
                    }

                    .vocational-card-header {
                        padding: 1.25rem 1rem !important;
                    }

                    .vocational-card-icon {
                        font-size: 2.5rem !important;
                    }

                    .vocational-card-title {
                        font-size: 1.15rem !important;
                    }

                    .vocational-card-body {
                        padding: 1.25rem 1rem !important;
                    }

                    .vocational-card-description {
                        font-size: 0.9rem !important;
                    }

                    .vocational-fixed-bar-text {
                        font-size: 0.875rem !important;
                    }
                }

                @media (max-width: 360px) {
                    .vocational-header-title {
                        font-size: 1.5rem !important;
                    }

                    .vocational-grid {
                        gap: 1rem !important;
                    }
                }
            `}</style>

            {/* Fixed Overview Bar */}
            <div
                className="vocational-fixed-bar"
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
                        className="vocational-fixed-bar-text"
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
                            التدريب الحرفي
                        </span>
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div
                className="vocational-container vocational-main-content"
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                    padding: '2rem 1rem',
                    paddingTop: 'calc(7px + 50px + 2rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div style={{ maxWidth: '900px', width: '100%' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1
                            className="vocational-header-title"
                            style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#000000',
                                marginBottom: '1rem',
                                fontFamily: "'Droid Arabic Kufi', serif"
                            }}
                        >
                            التدريب الحرفي
                        </h1>
                        <p
                            className="vocational-header-description"
                            style={{
                                fontSize: '1.1rem',
                                color: '#333333',
                                maxWidth: '600px',
                                margin: '0 auto',
                                lineHeight: '1.8',
                                fontFamily: "'Droid Arabic Kufi', serif"
                            }}
                        >
                            اختر المركز المناسب لك لبدء رحلتك في التدريب المهني والحرفي
                        </p>
                    </div>

                    {/* Centers Grid */}
                    <div
                        className="vocational-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem',
                            maxWidth: '850px',
                            margin: '0 auto'
                        }}
                    >
                        {centers.map((center, index) => (
                            <div
                                key={index}
                                className="vocational-card"
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '1px solid #e8e8e8'
                                }}
                            >
                                {/* Gradient Header */}
                                <div
                                    className="vocational-card-header"
                                    style={{
                                        backgroundImage: center.gradient,
                                        padding: '2rem 1rem',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div
                                        className="vocational-card-icon"
                                        style={{
                                            fontSize: '3.5rem',
                                            marginBottom: '0.75rem',
                                            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                                        }}
                                    >
                                        {center.icon}
                                    </div>
                                    <h2
                                        className="vocational-card-title"
                                        style={{
                                            fontSize: '1.4rem',
                                            fontWeight: 'bold',
                                            color: '#ffffff',
                                            margin: 0,
                                            fontFamily: "'Droid Arabic Kufi', serif",
                                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        {center.title}
                                    </h2>
                                </div>

                                <div
                                    className="vocational-card-body"
                                    style={{
                                        padding: '1.75rem 1.5rem',
                                        backgroundColor: '#fafafa'
                                    }}
                                >
                                    {/* Description */}
                                    <p
                                        className="vocational-card-description"
                                        style={{
                                            color: '#333333',
                                            textAlign: 'center',
                                            marginBottom: '1.75rem',
                                            lineHeight: '1.7',
                                            fontSize: '1rem',
                                            fontFamily: "'Droid Arabic Kufi', serif"
                                        }}
                                    >
                                        {center.description}
                                    </p>

                                    {/* Button */}
                                    <button
                                        className="vocational-button"
                                        onClick={() => handleNavigate(center.path)}
                                        style={{
                                            display: 'block',
                                            margin: '0 auto',
                                            backgroundImage: center.gradient,
                                            color: '#ffffff',
                                            padding: '0.75rem 2rem',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontFamily: "'Droid Arabic Kufi', serif",
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                        }}
                                    >
                                        زيارة المركز ←
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Info Section */}
                    <div style={{
                        marginTop: '3rem',
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e8e8e8'
                    }}>
                        <p style={{
                            color: '#333333',
                            fontSize: '1rem',
                            lineHeight: '1.7',
                            margin: 0,
                            fontFamily: "'Droid Arabic Kufi', serif"
                        }}>
                            نقدم برامج تدريبية متخصصة تهدف إلى تطوير المهارات الحرفية والمهنية
                            <br />
                            للارتقاء بمستوى الكفاءة والاحترافية في سوق العمل
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}