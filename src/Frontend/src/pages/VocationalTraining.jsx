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
        <div style={{
            minHeight: '50vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)',
            padding: '2rem 1rem', // تقليل البادينج الخارجي
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ maxWidth: '900px', width: '100%' }}> {/* تقليل العرض الأقصى للحاوية */}
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem', // تصغير العنوان الرئيسي
                        fontWeight: 'bold',
                        color: '#1a202c',
                        marginBottom: '0.5rem'
                    }}>
                        التدريب الحرفي
                    </h1>
                    <p style={{
                        fontSize: '1.1rem', // تصغير النص الوصفي
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
                    // جعل الصناديق أصغر عبر تغيير 350px إلى 280px
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem', // تقليل الفجوات بين الصناديق
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {centers.map((center, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '1rem', // زوايا أنعم أصغر
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
                                padding: '1.5rem 1rem', // تقليل البادينج الداخلي
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    fontSize: '3rem', // تصغير حجم الأيقونة
                                    marginBottom: '0.5rem'
                                }}>
                                    {center.icon}
                                </div>
                                <h2 style={{
                                    fontSize: '1.3rem', // تصغير عنوان المركز
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
                                    fontSize: '0.95rem' // تصغير وصف المركز
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
                                        padding: '0.5rem 1.25rem', // زر أصغر
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
    );
}