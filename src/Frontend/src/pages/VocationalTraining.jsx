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
            gradient: 'linear-gradient(135deg, #070707, #e65100)'
        },
        {
            title: 'مركز تدريب شبرا',
            description: 'مركز تدريب حديث لتطوير المهارات الحرفية',
            path: '/shobra',
            icon: '🏛️',
            gradient: 'linear-gradient(135deg, #070707, #0865a8)'
        }
    ];

    return (
        <>
            {/* Fixed Overview Bar */}
            <div style={{
                position: 'fixed',
                top: '70px', // Adjusted to stick right under the navbar
                left: 0,
                zIndex: 40,
                width: '100%',
                borderBottom: '1px solid #d1d5db',
                backgroundColor: '#F5F7E1',
                padding: '0.5rem 1rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1rem' }}>
                        <a
                            href="/"
                            style={{
                                marginLeft: '0.75rem',
                                color: '#374151',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#111827'}
                            onMouseLeave={(e) => e.target.style.color = '#374151'}
                        >
                            الصفحة الرئيسية
                        </a>
                        <span style={{ color: '#6b7280' }}> - </span>
                        <span style={{ marginRight: '0.75rem', color: '#374151' }}>
                            التدريب الحرفي
                        </span>
                    </span>
                </div>
            </div>

            {/* Main Content - with top padding to account for fixed bar */}
            <div style={{
                minHeight: 'auto',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)',
                padding: '2rem 1rem',
                paddingTop: 'calc(60px + 50px + 2rem)', // navbar height + breadcrumb height + extra padding
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ maxWidth: '900px', width: '100%' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#1a202c',
                            marginBottom: '0.5rem'
                        }}>
                            التدريب الحرفي
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#4a5568',
                            maxWidth: '500px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            اختر المركز المناسب لك لبدء رحلتك في التدريب المهني والحرفي
                        </p>
                    </div>

                    {/* Centers Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        {centers.map((center, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '1rem',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    overflow: 'hidden',
                                    transition: 'all 0.4s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                }}
                            >
                                {/* Gradient Header */}
                                <div style={{
                                    backgroundImage: center.gradient,
                                    padding: '1.5rem 1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {center.icon}
                                    </div>
                                    <h2 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        margin: 0
                                    }}>
                                        {center.title}
                                    </h2>
                                </div>

                                <div style={{ padding: '1.5rem 1.25rem' }}>
                                    {/* Description */}
                                    <p style={{
                                        color: '#4a5568',
                                        textAlign: 'center',
                                        marginBottom: '1.5rem',
                                        lineHeight: '1.5',
                                        fontSize: '0.95rem'
                                    }}>
                                        {center.description}
                                    </p>

                                    {/* Button */}
                                    <button
                                        onClick={() => handleNavigate(center.path)}
                                        style={{
                                            display: 'block',
                                            margin: '0 auto',
                                            backgroundImage: center.gradient,
                                            color: 'white',
                                            padding: '0.5rem 1.25rem',
                                            borderRadius: '0.4rem',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        زيارة المركز ←
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}