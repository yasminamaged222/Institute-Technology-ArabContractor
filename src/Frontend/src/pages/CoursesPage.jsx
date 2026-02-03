import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
    overviewBar: {
        position: 'fixed',
        left: 0,
        top: '64px',
        zIndex: 40,
        width: '100%',
        borderBottom: '1px solid #d1d5db',
        backgroundColor: '#F5F7E1',
        padding: '8px 20px',
        boxSizing: 'border-box',
    },
    overviewBarText: {
        textAlign: 'center',
        fontSize: '14px',
    },
    breadcrumbLink: {
        marginLeft: '12px',
        color: '#374151',
        textDecoration: 'none',
        transition: 'color 0.2s',
        cursor: 'pointer',
    },
    breadcrumbSeparator: {
        color: '#6b7280',
    },
    breadcrumbCurrent: {
        marginRight: '12px',
        color: '#374151',
    },
    mainContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: '96px',
        padding: '24px 16px 48px',
        boxSizing: 'border-box',
    },
    pageTitle: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    h1: {
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#0865a8',
        marginBottom: '16px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#4b5563',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '18px',
        color: '#4b5563',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '18px',
        color: '#dc2626',
        flexDirection: 'column',
        gap: '16px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '16px',
        borderTop: '4px solid #f57c00',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
        
    },
    cardHover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 25px 25px -5px rgba(0,0,0,0.15)',
    },
    cardImageWrapper: {
        position: 'relative',
        height: '192px',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #0865a8, #f57c00)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '32px',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: '64px',
        height: '64px',
        color: '#ffffff',
    },
    discountBadge: {
        position: 'absolute',
        left: '12px',
        top: '12px',
        borderRadius: '9999px',
        backgroundColor: '#f57c00',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    },
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '24px',
    },
    courseTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#0865a8',
        marginBottom: '16px',
        lineHeight: '1.4',
        minHeight: '80px',  // Increased from 56px
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        fontSize: '14px',
        color: '#374151',
        marginBottom: '12px',
    },
    infoRowCenter: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#374151',
        marginBottom: '16px',
    },
    infoIcon: {
        width: '20px',
        height: '20px',
        flexShrink: 0,
        color: '#f57c00',
        marginTop: '2px',
    },
    infoIconNoMargin: {
        width: '20px',
        height: '20px',
        flexShrink: 0,
        color: '#f57c00',
    },
    clampText: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    statsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        color: '#4b5563',
        marginBottom: '16px',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    statIcon: {
        width: '16px',
        height: '16px',
        color: '#0865a8',
    },
    statNumber: {
        fontWeight: '600',
        color: '#111827',
    },
    levelBadge: {
        borderRadius: '9999px',
        backgroundColor: '#eff6ff',
        padding: '4px 8px',
        fontWeight: '500',
        color: '#0865a8',
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.625',
        color: '#6b7280',
        marginBottom: '24px',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    priceSection: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '16px',
        marginBottom: '16px',
    },
    originalPrice: {
        fontSize: '12px',
        color: '#6b7280',
        textDecoration: 'line-through',
    },
    currentPrice: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#f57c00',
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        color: '#4b5563',
    },
    starIcon: {
        width: '16px',
        height: '16px',
        fill: '#fbbf24',
        color: '#fbbf24',
    },
    ratingNumber: {
        fontWeight: 'bold',
        color: '#111827',
    },
    buttonsRow: {
        display: 'flex',
        gap: '8px',
    },
    addToCartBtn: {
        flex: 1,
        borderRadius: '8px',
        background: 'linear-gradient(to right, #0865a8, #f57c00)',
        padding: '12px 24px',
        fontWeight: 'bold',
        color: '#ffffff',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        fontSize: '14px',
    },
    addToCartBtnHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    },
    detailsBtn: {
        borderRadius: '8px',
        border: '2px solid #0865a8',
        backgroundColor: '#ffffff',
        padding: '12px 24px',
        fontWeight: 'bold',
        color: '#0865a8',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        cursor: 'pointer',
        fontSize: '14px',
    },
    detailsBtnHover: {
        backgroundColor: '#0865a8',
        color: '#ffffff',
    },
};

const CoursesPage = () => {
    const navigate = useNavigate();
    const { id, slug } = useParams(); // Get both id and slug from URL params
    
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredAddBtn, setHoveredAddBtn] = useState(null);
    const [hoveredDetailsBtn, setHoveredDetailsBtn] = useState(null);
    
    const [programData, setProgramData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                
                // Use ID from params, or default to 15 if not provided
                const programId = id || 15;
                
                const response = await fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/course/programs/${programId}/courses`);
                
                if (!response.ok) {
                    throw new Error('فشل في تحميل البيانات');
                }
                
                const data = await response.json();
                setProgramData(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [id]); // Re-fetch when id changes

    const addToCart = (course) => {
        const existingCart = localStorage.getItem('cartItems');
        const cartItems = existingCart ? JSON.parse(existingCart) : [];

        const isInCart = cartItems.some(item => item.id === course.id);
        if (!isInCart) {
            const cartItem = {
                id: course.id,
                title: course.title,
                instructor: course.instructor || 'غير محدد',
                image: course.image || 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg',
                rating: 4.6,
                reviews: 5500,
                hours: course.hours || 45,
                lectures: course.lectures || 128,
                level: course.level || 'متوسط',
                currentPrice: course.price || 299.99,
                originalPrice: course.originalPrice || 499.99,
                badge: 'الأكثر مبيعاً',
                coupon: 'DISCOUNT2025'
            };

            cartItems.push(cartItem);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            setCart(cartItems);
            window.dispatchEvent(new Event('cartUpdated'));

            navigate('/cart');
        }
    };

    if (loading) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`
                    * {
                        font-family: "Droid Arabic Kufi", serif !important;
                    }
                `}</style>
                <div dir="rtl">
                    <div style={styles.overviewBar}>
                        <div style={styles.overviewBarText}>
                            <span>
                                <a
                                    href="/"
                                    style={styles.breadcrumbLink}
                                    onMouseEnter={e => e.target.style.color = '#111827'}
                                    onMouseLeave={e => e.target.style.color = '#374151'}
                                >
                                    الصفحة الرئيسية
                                </a>
                                <span style={styles.breadcrumbSeparator}> - </span>
                                <span style={styles.breadcrumbCurrent}>جاري التحميل...</span>
                            </span>
                        </div>
                    </div>
                    <div style={styles.loadingContainer}>
                        <div>جاري تحميل الدورات...</div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`
                    * {
                        font-family: "Droid Arabic Kufi", serif !important;
                    }
                `}</style>
                <div dir="rtl">
                    <div style={styles.overviewBar}>
                        <div style={styles.overviewBarText}>
                            <span>
                                <a
                                    href="/"
                                    style={styles.breadcrumbLink}
                                    onMouseEnter={e => e.target.style.color = '#111827'}
                                    onMouseLeave={e => e.target.style.color = '#374151'}
                                >
                                    الصفحة الرئيسية
                                </a>
                                <span style={styles.breadcrumbSeparator}> - </span>
                                <span style={styles.breadcrumbCurrent}>خطأ</span>
                            </span>
                        </div>
                    </div>
                    <div style={styles.errorContainer}>
                        <div>⚠️ {error}</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={{
                                ...styles.addToCartBtn,
                                flex: 'none',
                                width: 'auto'
                            }}
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const courses = programData?.courses || [];

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />

            <style>{`
                * {
                    font-family: "Droid Arabic Kufi", serif !important;
                }
            `}</style>

            <div dir="rtl">
                {/* Fixed Overview Bar */}
                <div style={styles.overviewBar}>
                    <div style={styles.overviewBarText}>
                        <span>
                            <a
                                href="/"
                                style={styles.breadcrumbLink}
                                onMouseEnter={e => e.target.style.color = '#111827'}
                                onMouseLeave={e => e.target.style.color = '#374151'}
                            >
                                الصفحة الرئيسية
                            </a>
                            <span style={styles.breadcrumbSeparator}> - </span>
                            <span style={styles.breadcrumbCurrent}>
                                الخطة التدريبية - {programData?.programName || 'برنامج إعداد وتأهيل مهندس حديث مدنى وعمارة'}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div style={styles.mainContainer}>
                    <div style={styles.pageTitle}>
                        <h1 style={styles.h1}>{programData?.programName || 'دورات إعداد وتأهيل المهندسين'}</h1>
                        <p style={styles.subtitle}>اختر الدورة المناسبة لك وابدأ رحلتك التعليمية</p>
                    </div>

                    {courses.length === 0 ? (
                        <div style={styles.loadingContainer}>
                            <div>لا توجد دورات متاحة حالياً</div>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {courses.map((course) => {
                                // Use cost from API if available, otherwise calculate mock price
                                let originalPrice = null;
                                let currentPrice = null;
                                let discountPercent = 40;
                                
                                if (course.cost !== null && course.cost !== undefined) {
                                    // If cost is provided by API, use it
                                    currentPrice = course.cost;
                                    originalPrice = course.cost / 0.6; // Assume 40% discount
                                } else {
                                    // If cost is null, leave prices as null (don't show)
                                    originalPrice = null;
                                    currentPrice = null;
                                }
                                
                                return (
                                    <div
                                        key={course.id}
                                        style={{
                                            ...styles.card,
                                            ...(hoveredCard === course.id ? styles.cardHover : {}),
                                        }}
                                        onMouseEnter={() => setHoveredCard(course.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        {/* Course Image / Header */}
                                        <div style={styles.cardImageWrapper}>
                                            <div style={styles.iconCircle}>
                                                <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                </svg>
                                            </div>
                                            {currentPrice !== null && (
                                                <div style={styles.discountBadge}>
                                                    {discountPercent}% خصم
                                                </div>
                                            )}
                                        </div>

                                        <div style={styles.cardBody}>
                                            {/* Title */}
                                            <h3 style={styles.courseTitle}>{course.title}</h3>

                                            {/* Institute */}
                                            <div style={styles.infoRow}>
                                                <svg style={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span style={styles.clampText}>{course.place}</span>
                                            </div>

                                            {/* Date */}
                                            <div style={styles.infoRowCenter}>
                                                <svg style={styles.infoIconNoMargin} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{course.date}</span>
                                            </div>

                                            {/* Description */}
                                            <p style={styles.description}>{course.description}</p>

                                            {/* Price */}
                                            {currentPrice !== null ? (
                                                <div style={styles.priceSection}>
                                                    <div>
                                                        <p style={styles.originalPrice}>{originalPrice.toFixed(2)} ج.م</p>
                                                        <p style={styles.currentPrice}>{currentPrice.toFixed(2)} ج.م</p>
                                                    </div>
                                                    
                                                </div>
                                            ) : (
                                                <div style={{...styles.priceSection, borderTop: 'none'}}>
                                                    <div style={styles.ratingRow}>
                                                        
                                                        
                                                    </div>
                                                </div>
                                            )}

                                            {/* Buttons */}
                                            <div style={styles.buttonsRow}>
                                                <button
                                                    onClick={() => addToCart({
                                                        ...course,
                                                        price: currentPrice || 0,
                                                        originalPrice: originalPrice || 0,
                                                        image: 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg',
                                                        instructor: 'غير محدد',
                                                        hours: 45,
                                                        lectures: 128,
                                                        level: 'متوسط'
                                                    })}
                                                    style={{
                                                        ...styles.addToCartBtn,
                                                        ...(hoveredAddBtn === course.id ? styles.addToCartBtnHover : {}),
                                                    }}
                                                    onMouseEnter={() => setHoveredAddBtn(course.id)}
                                                    onMouseLeave={() => setHoveredAddBtn(null)}
                                                >
                                                    أضف إلى السلة
                                                </button>
                                                <button
                                                    style={{
                                                        ...styles.detailsBtn,
                                                        ...(hoveredDetailsBtn === course.id ? styles.detailsBtnHover : {}),
                                                    }}
                                                    onMouseEnter={() => setHoveredDetailsBtn(course.id)}
                                                    onMouseLeave={() => setHoveredDetailsBtn(null)}
                                                >
                                                    التفاصيل
                                                </button>
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