import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CourseDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherCourses, setOtherCourses] = useState([]);
    const [isOwned, setIsOwned] = useState(false);

    const API_BASE_URL = 'https://acwebsite-icmet-test.azurewebsites.net/api';

    // ── Helper: read all owned IDs from localStorage ──────────────────────────
    const getOwnedIds = () => {
        try {
            const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
            const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            return new Set([
                ...purchased.map(c => String(c.id)),
                ...enrolled.map(c => String(c.id)),
            ]);
        } catch {
            return new Set();
        }
    };

    // ── Check ownership whenever course loads or storage changes ──────────────
    useEffect(() => {
        const checkOwned = () => {
            if (!course) return;
            const ownedIds = getOwnedIds();
            setIsOwned(ownedIds.has(String(course.id)));
        };
        checkOwned();
        window.addEventListener('cartUpdated', checkOwned);
        window.addEventListener('enrollUpdated', checkOwned);
        window.addEventListener('storage', checkOwned);
        return () => {
            window.removeEventListener('cartUpdated', checkOwned);
            window.removeEventListener('enrollUpdated', checkOwned);
            window.removeEventListener('storage', checkOwned);
        };
    }, [course]);

    const parseContent = (htmlContent) => {
        const parser = new DOMParser();
        return parser.parseFromString(htmlContent, 'text/html');
    };

    const extractTopics = (htmlContent) => {
        if (!htmlContent) return [];
        const doc = parseContent(htmlContent);
        const topics = [];
        const headings = Array.from(doc.querySelectorAll('h6'));
        const contentHeading = headings.find(h => h.textContent.includes('محتويات البرنامج'));
        if (contentHeading) {
            let currentElement = contentHeading.nextElementSibling;
            while (currentElement && currentElement.tagName !== 'H6') {
                if (currentElement.tagName === 'UL') {
                    currentElement.querySelectorAll('li').forEach(li => { const text = li.textContent.trim(); if (text) topics.push(text); });
                }
                currentElement = currentElement.nextElementSibling;
            }
        }
        return topics;
    };

    const extractObjectives = (htmlContent) => {
        if (!htmlContent) return [];
        const doc = parseContent(htmlContent);
        const objectives = [];
        const headings = Array.from(doc.querySelectorAll('h6'));
        const objectivesHeading = headings.find(h => h.textContent.includes('فائدة حضور البرنامج'));
        if (objectivesHeading) {
            let currentElement = objectivesHeading.nextElementSibling;
            while (currentElement && currentElement.tagName !== 'H6') {
                if (currentElement.tagName === 'UL') {
                    currentElement.querySelectorAll('li').forEach(li => { const text = li.textContent.trim(); if (text) objectives.push(text); });
                }
                currentElement = currentElement.nextElementSibling;
            }
        }
        return objectives;
    };

    const extractPrerequisites = (htmlContent) => {
        if (!htmlContent) return [];
        const doc = parseContent(htmlContent);
        const prerequisites = [];
        const headings = Array.from(doc.querySelectorAll('h6'));
        const prereqHeading = headings.find(h => h.textContent.includes('لمن يعقد البرنامج'));
        if (prereqHeading) {
            let currentElement = prereqHeading.nextElementSibling;
            while (currentElement && currentElement.tagName !== 'H6') {
                if (currentElement.tagName === 'UL') {
                    currentElement.querySelectorAll('li').forEach(li => { const text = li.textContent.trim(); if (text) prerequisites.push(text); });
                }
                currentElement = currentElement.nextElementSibling;
            }
        }
        return prerequisites;
    };

    const extractImplementationMethods = (htmlContent) => {
        if (!htmlContent) return [];
        const doc = parseContent(htmlContent);
        const methods = [];
        const headings = Array.from(doc.querySelectorAll('h6'));
        const methodHeading = headings.find(h => h.textContent.includes('طريقة تنفيذ البرنامج'));
        if (methodHeading) {
            let currentElement = methodHeading.nextElementSibling;
            while (currentElement && currentElement.tagName !== 'H6') {
                if (currentElement.tagName === 'UL') {
                    currentElement.querySelectorAll('li').forEach(li => { const text = li.textContent.trim(); if (text) methods.push(text); });
                }
                currentElement = currentElement.nextElementSibling;
            }
        }
        return methods;
    };

    const extractProgramDates = (htmlContent) => {
        if (!htmlContent) return [];
        const doc = parseContent(htmlContent);
        const dates = [];
        const headings = Array.from(doc.querySelectorAll('h6'));
        const dateHeading = headings.find(h => h.textContent.includes('تاريخ انعقاد البرنامج'));
        if (dateHeading) {
            let currentElement = dateHeading.nextElementSibling;
            while (currentElement && currentElement.tagName !== 'H6') {
                if (currentElement.tagName === 'UL') {
                    currentElement.querySelectorAll('li').forEach(li => { const text = li.textContent.trim(); if (text) dates.push(text); });
                }
                currentElement = currentElement.nextElementSibling;
            }
        }
        return dates;
    };

    const extractDates = (dateString) => {
        if (!dateString) return { startDate: '', endDate: '' };
        const dates = dateString.split(' - ');
        return { startDate: dates[0]?.trim() || '', endDate: dates[1]?.trim() || dates[0]?.trim() || '' };
    };

    const transformCourseData = (apiCourse) => {
        const topics = extractTopics(apiCourse.content);
        const objectives = extractObjectives(apiCourse.content);
        const prerequisites = extractPrerequisites(apiCourse.content);
        const implementationMethods = extractImplementationMethods(apiCourse.content);
        const programDates = extractProgramDates(apiCourse.content);
        const { startDate, endDate } = extractDates(apiCourse.date);
        const discount = apiCourse.cost && apiCourse.onSale ? Math.round(((apiCourse.onSale - apiCourse.cost) / apiCourse.onSale) * 100) : 38;
        const isFree = !apiCourse.cost || apiCourse.cost === 0;

        return {
            id: apiCourse.id,
            slug: apiCourse.slug,
            title: apiCourse.title,
            description: apiCourse.description,
            place: apiCourse.place,
            price: apiCourse.cost || 0,
            originalPrice: apiCourse.onSale || (apiCourse.cost ? apiCourse.cost * 1.6 : 0),
            currency: "جنيه",
            discount: discount,
            rating: 4.8,
            studentsCount: 8234,
            reviewsCount: 2547,
            duration: 26,
            videoDuration: 26,
            articlesCount: apiCourse.files?.length || 12,
            hasCertificate: true,
            hasLifetimeAccess: true,
            hasMoneyBackGuarantee: true,
            language: "العربية",
            level: "مبتدئ",
            isFree,
            topics,
            objectives,
            prerequisites,
            implementationMethods,
            programDates,
            startDate,
            endDate,
            date: apiCourse.date,
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
            files: apiCourse.files || [],
            instructor: {
                name: "م/ شيرين البحر",
                title: "رئيس إدارة المشاريع PMP",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
            },
            content: apiCourse.content
        };
    };

    // ── Add paid course to cart ────────────────────────────────────────────────
    const addToCart = (buyNow = false) => {
        if (!course) return;
        const existingCart = localStorage.getItem('cartItems');
        const cartItems = existingCart ? JSON.parse(existingCart) : [];
        const isInCart = cartItems.some(item => item.id === course.id);

        if (!isInCart) {
            const cartItem = {
                id: course.id,
                slug: course.slug,
                title: course.title,
                instructor: course.place || 'غير محدد',
                image: course.image || 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg',
                rating: course.rating || 4.6,
                reviews: course.reviewsCount || 2547,
                hours: course.duration || 26,
                lectures: course.articlesCount || 12,
                level: course.level || 'مبتدئ',
                currentPrice: course.price || 0,
                originalPrice: course.originalPrice || (course.price * 1.6) || 0,
                badge: 'الأكثر مبيعاً',
                coupon: 'DISCOUNT2025',
                quantity: 1
            };
            cartItems.push(cartItem);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            window.dispatchEvent(new Event('cartUpdated'));
        }

        if (buyNow) {
            navigate('/checkout');
        } else {
            navigate('/cart');
        }
    };

    // ── Enroll in free course ─────────────────────────────────────────────────
    const handleEnroll = () => {
        if (!course) return;

        const existing = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        const alreadyEnrolled = existing.some(e => String(e.id) === String(course.id));

        if (!alreadyEnrolled) {
            const enrollItem = {
                id: course.id,
                slug: course.slug,
                title: course.title,
                place: course.place || '',
                instructor: course.place || 'غير محدد',
                date: course.date || course.startDate || '',
                image: course.image || 'book',
                currentPrice: 0,
                progress: 0,
            };
            existing.push(enrollItem);
            localStorage.setItem('enrolledCourses', JSON.stringify(existing));
            window.dispatchEvent(new Event('enrollUpdated'));
        }

        navigate('/my-courses');
    };

    useEffect(() => {
        const loadCourse = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}/Course/${slug}`);
                if (!response.ok) throw new Error('Course not found');
                const apiCourse = await response.json();
                const transformedCourse = transformCourseData(apiCourse);
                setCourse(transformedCourse);

                const relatedSlugs = [
                    'solid-liquid-waste-management',
                    'construction-project-management',
                    'architectural-engineering',
                ].filter(s => s !== slug);

                const promises = relatedSlugs.slice(0, 3).map(s =>
                    fetch(`${API_BASE_URL}/Course/${s}`).then(res => res.ok ? res.json() : null).catch(() => null)
                );
                const results = await Promise.all(promises);
                setOtherCourses(results.filter(c => c !== null).map(transformCourseData));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (slug) loadCourse();
    }, [slug]);

    useEffect(() => {
        if (course && course.title) {
            document.title = `${course.title} - المعهد التكنولوجي لهندسة التشييد والإدارة`;
        } else {
            document.title = 'التدريب عن بعد ( اونلاين ) - المعهد التكنولوجي لهندسة التشييد والإدارة';
        }
    }, [course]);

    if (loading) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>
                <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh', top: 80 }}>
                    <div style={styles.overviewBar} className="overview-bar">
                        <div style={styles.overviewBarText} className="breadcrumb-text">
                            <span>
                                <a href="/" style={styles.breadcrumbLink}>الصفحة الرئيسية</a>
                                <span style={styles.breadcrumbSeparator}>•</span>
                                <span style={styles.breadcrumbCurrent}>جاري التحميل...</span>
                            </span>
                        </div>
                    </div>
                    <div style={styles.loadingContainer}><div>جاري تحميل الدورة...</div></div>
                </div>
            </>
        );
    }

    if (error || !course) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>
                <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh', top: 80 }}>
                    <div style={styles.overviewBar} className="overview-bar">
                        <div style={styles.overviewBarText} className="breadcrumb-text">
                            <span>
                                <a href="/" style={styles.breadcrumbLink}>الصفحة الرئيسية</a>
                                <span style={styles.breadcrumbSeparator}>•</span>
                                <span style={styles.breadcrumbCurrent}>خطأ</span>
                            </span>
                        </div>
                    </div>
                    <div style={styles.notFoundContainer}>
                        <div style={styles.notFoundCard}>
                            <div style={styles.notFoundIcon}>⚠️</div>
                            <h2>الدورة غير موجودة!</h2>
                            <p>عذراً، الدورة التي تبحث عنها غير متوفرة</p>
                            <Link to="/" style={styles.btnPrimary}>العودة للصفحة الرئيسية</Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>

            <div dir="rtl" style={styles.pageWrapper}>
                <div style={{ ...styles.overviewBar, top: 70 }} className="overview-bar">
                    <div style={styles.overviewBarText} className="breadcrumb-text">
                        <span>
                            <a href="/" style={styles.breadcrumbLink} onMouseEnter={e => e.target.style.color = '#f57c00'} onMouseLeave={e => e.target.style.color = '#0865a8'}>الصفحة الرئيسية</a>
                            <span style={styles.breadcrumbSeparator}>•</span>
                            <span style={styles.breadcrumbCurrent}>{course.title}</span>
                        </span>
                    </div>
                </div>

                {/* ── HERO - colour changes based on owned/free/paid ── */}
                <div style={{
                    ...styles.heroSection,
                    background: isOwned
                        ? 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)'
                        : course.isFree
                            ? 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)'
                            : 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)'
                }}>
                    <div style={styles.heroContainer}>
                        <div style={styles.heroContent}>
                            {/* Owned badge */}
                            {isOwned && (
                                <div style={{ ...styles.freeBadgeHero, backgroundColor: 'rgba(255,255,255,0.9)', color: '#4a4a8a' }}>✅ مسجل في هذه الدورة</div>
                            )}
                            {/* Free badge */}
                            {!isOwned && course.isFree && (
                                <div style={styles.freeBadgeHero}>مجاناً</div>
                            )}
                            <h1 style={styles.heroTitle}>{course.title}</h1>
                            <p style={styles.heroDescription}>{course.description}</p>
                            <div style={styles.heroInfo}>
                                <span style={styles.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}>
                                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
                                        <path d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H5.5a.5.5 0 010-1H7.5V4a.5.5 0 01.5-.5z" />
                                    </svg>
                                    تاريخ البدء: {course.startDate}
                                </span>
                                <span style={styles.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}>
                                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {course.place}
                                </span>
                                <span style={styles.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}>
                                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z" />
                                    </svg>
                                    {course.language}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.mainContainer} className="main-container">
                    <div style={styles.contentWrapper} className="content-wrapper">
                        <div style={styles.leftContent}>
                            {course.topics.length > 0 && (
                                <div style={styles.contentSection}>
                                    <h2 style={styles.sectionHeading}>محتويات البرنامج</h2>
                                    <div style={styles.topicsGrid}>
                                        {course.topics.map((topic, index) => (
                                            <div key={index} style={styles.topicCard}>
                                                <div style={styles.topicIcon}>
                                                    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1zM4.5 9a.5.5 0 010-1h7a.5.5 0 010 1h-7zM4 10.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 010-1h4a.5.5 0 010 1h-4z" />
                                                    </svg>
                                                </div>
                                                <div style={styles.topicContent}><p style={styles.topicText}>{topic}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.objectives.length > 0 && (
                                <div style={styles.contentSection}>
                                    <h2 style={styles.sectionHeading}>فائدة حضور البرنامج</h2>
                                    <div style={styles.learningObjectives}>
                                        {course.objectives.map((obj, index) => (
                                            <div key={index} style={styles.objectiveItem}>
                                                <svg style={styles.checkIcon} width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" />
                                                </svg>
                                                <span>{obj}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.prerequisites.length > 0 && (
                                <div style={styles.contentSection}>
                                    <h2 style={styles.sectionHeading}>لمن يعقد البرنامج</h2>
                                    <ul style={styles.requirementsList}>
                                        {course.prerequisites.map((pre, index) => <li key={index}>{pre}</li>)}
                                    </ul>
                                </div>
                            )}

                            {course.implementationMethods.length > 0 && (
                                <div style={styles.contentSection}>
                                    <h2 style={styles.sectionHeading}>طريقة تنفيذ البرنامج</h2>
                                    <div style={styles.methodItems}>
                                        {course.implementationMethods.map((method, index) => (
                                            <div key={index} style={styles.methodItem}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
                                                    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
                                                    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
                                                </svg>
                                                <span>{method}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.programDates.length > 0 && (
                                <div style={styles.contentSection}>
                                    <h2 style={styles.sectionHeading}>تاريخ انعقاد البرنامج</h2>
                                    <div style={styles.dateBox}>
                                        {course.programDates.map((dateRange, index) => (
                                            <div key={index} style={styles.dateItem}>
                                                <span style={styles.dateLabel}>الدورة {index + 1}:</span>
                                                <span style={styles.dateValue}>{dateRange}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.files && course.files.length > 0 && (
                                <div style={styles.contentSection}>
                                    <h2 style={styles.sectionHeading}>الملفات المرفقة</h2>
                                    <div style={styles.filesList}>
                                        {course.files.map((file, index) => (
                                            <div key={index} style={styles.fileItem}>
                                                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5zm-3 0A1.5 1.5 0 019.5 3V1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4.5h-2z" />
                                                </svg>
                                                <span>{file.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ===== RIGHT SIDEBAR ===== */}
                        <div style={styles.rightSidebar} className="right-sidebar">
                            <div style={styles.priceCard}>
                                <div style={{
                                    ...styles.pricePreview,
                                    background: isOwned
                                        ? 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)'
                                        : course.isFree
                                            ? 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)'
                                            : 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)'
                                }}>
                                    <img src={course.image} alt={course.title} style={styles.previewImage} />
                                </div>
                                <div style={styles.priceContent}>

                                    {/* ===== PRICE SECTION ===== */}
                                    <div style={styles.priceSection}>
                                        {isOwned ? (
                                            /* OWNED: show مسجل */
                                            <div style={styles.freePriceWrapper}>
                                                <span style={{ ...styles.freePriceLabel, color: '#4a4a8a' }}>✅ مسجل</span>
                                                <span style={styles.freePriceSubtext}>لديك هذه الدورة بالفعل</span>
                                            </div>
                                        ) : course.isFree ? (
                                            /* FREE: show مجاناً */
                                            <div style={styles.freePriceWrapper}>
                                                <span style={styles.freePriceLabel}>مجاناً</span>
                                                <span style={styles.freePriceSubtext}>دورة مجانية بالكامل</span>
                                            </div>
                                        ) : (
                                            /* PAID: show price */
                                            <>
                                                <span style={styles.currentPrice}>
                                                    {course.price.toLocaleString('ar-EG')} {course.currency}
                                                </span>
                                                {course.originalPrice > 0 && (
                                                    <span style={styles.originalPrice}>
                                                        {course.originalPrice.toLocaleString('ar-EG')} {course.currency}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* ===== ACTION BUTTONS =====
                                        - Owned (purchased OR enrolled free) → only "عرض في دوراتي"
                                        - Free & not owned → only "اشترك الآن"
                                        - Paid & not owned → "إضافة إلى السلة" + "اشترِ الآن"
                                    */}
                                    <div style={styles.actionButtons}>
                                        {isOwned ? (
                                            <button
                                                style={styles.btnViewMyCourses}
                                                onClick={() => navigate('/my-courses')}
                                            >
                                                عرض في دوراتي
                                            </button>
                                        ) : course.isFree ? (
                                            <button style={styles.btnEnrollNow} onClick={handleEnroll}>
                                                اشترك الآن
                                            </button>
                                        ) : (
                                            <>
                                                <button style={styles.btnAddCart} onClick={() => addToCart(false)}>
                                                    إضافة إلى السلة
                                                </button>
                                                <button style={styles.btnBuyNow} onClick={() => addToCart(true)}>
                                                    اشترِ الآن
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <div style={styles.courseIncludes}>
                                        <h3 style={styles.includesTitle}>هذه الدورة تتضمن:</h3>
                                        <ul style={styles.includesList}>
                                            <li style={styles.includesItem}>
                                                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
                                                    <path d="M6.5 5a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-4a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-4a.5.5 0 01.5-.5z" />
                                                </svg>
                                                {course.videoDuration} ساعة محتوى تدريبي
                                            </li>
                                            <li style={styles.includesItem}>
                                                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z" />
                                                </svg>
                                                {course.articlesCount} ملف تدريبي
                                            </li>
                                            <li style={styles.includesItem}>
                                                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z" />
                                                </svg>
                                                وصول كامل للمحتوى
                                            </li>
                                            {course.hasCertificate && (
                                                <li style={styles.includesItem}>
                                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z" />
                                                    </svg>
                                                    شهادة إتمام
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {otherCourses.length > 0 && (
                                <div style={styles.programsCard}>
                                    <h3 style={styles.programsTitle}>دورات أخرى قد تهمك</h3>
                                    <div style={styles.otherCoursesList}>
                                        {otherCourses.map((otherCourse) => (
                                            <Link key={otherCourse.id} to={`/course/${otherCourse.slug}`} style={styles.otherCourseCard}>
                                                <img src={otherCourse.image} alt={otherCourse.title} style={styles.otherCourseImg} />
                                                <div style={styles.otherCourseContent}>
                                                    <h4 style={styles.otherCourseTitle}>{otherCourse.title}</h4>
                                                    <div style={styles.otherCoursePrice}>
                                                        <span style={{
                                                            ...styles.otherCurrentPrice,
                                                            color: otherCourse.isFree ? '#1a7a3c' : '#f57c00'
                                                        }}>
                                                            {otherCourse.isFree ? 'مجاناً' : `${otherCourse.price.toLocaleString('ar-EG')} ${otherCourse.currency}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    overviewBar: { position: 'fixed', left: 0, top: '64px', zIndex: 40, width: '100%', backgroundColor: '#f5f5f5', padding: '12px 24px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e0e0e0' },
    overviewBarText: { textAlign: 'center', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', color: '#000000' },
    breadcrumbLink: { marginLeft: '12px', color: '#0865a8', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer', fontWeight: '500' },
    breadcrumbSeparator: { color: '#000000', margin: '0 8px', opacity: 0.4 },
    breadcrumbCurrent: { marginRight: '12px', color: '#000000', fontWeight: '600' },
    pageWrapper: { minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif', direction: 'rtl' },
    heroSection: { color: '#ffffff', padding: '100px 24px 48px', marginTop: '52px' },
    heroContainer: { maxWidth: '1200px', margin: '0 auto' },
    heroContent: { maxWidth: '900px' },
    freeBadgeHero: {
        display: 'inline-block',
        backgroundColor: '#ffffff',
        color: '#1a7a3c',
        fontWeight: 800,
        fontSize: '1rem',
        fontFamily: '"Droid Arabic Kufi", serif',
        padding: '4px 16px',
        borderRadius: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    },
    heroTitle: { fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.4', color: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif' },
    heroDescription: { fontSize: '18px', marginBottom: '24px', lineHeight: '1.6', color: '#ffffff', opacity: 0.95, fontFamily: '"Droid Arabic Kufi", serif' },
    heroInfo: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
    infoItem: { display: 'flex', alignItems: 'center', fontSize: '15px', color: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif' },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', fontSize: '20px', color: '#0865a8', fontFamily: '"Droid Arabic Kufi", serif', marginTop: '100px' },
    mainContainer: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
    contentWrapper: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' },
    leftContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
    contentSection: { backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    sectionHeading: { fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', borderRight: '4px solid #0865a8', paddingRight: '16px' },
    topicsGrid: { display: 'grid', gap: '14px' },
    topicCard: { display: 'flex', gap: '14px', padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderRight: '3px solid #f57c00', transition: 'all 0.2s' },
    topicIcon: { color: '#0865a8', flexShrink: 0, marginTop: '2px' },
    topicContent: { flex: 1 },
    topicText: { fontSize: '15px', color: '#000000', lineHeight: '1.6', fontFamily: '"Droid Arabic Kufi", serif' },
    learningObjectives: { display: 'grid', gap: '14px' },
    objectiveItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '15px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: '1.6' },
    checkIcon: { color: '#f57c00', marginTop: '4px', flexShrink: 0 },
    requirementsList: { listStyle: 'disc', paddingRight: '24px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#000000', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: '1.6' },
    methodItems: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' },
    methodItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#000000', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif' },
    dateBox: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' },
    dateItem: { padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '3px solid #0865a8' },
    dateLabel: { fontSize: '14px', color: '#000000', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', opacity: 0.7 },
    dateValue: { fontSize: '15px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif' },
    filesList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    fileItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '8px', transition: 'all 0.2s', cursor: 'pointer', color: '#000000', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif', borderRight: '3px solid #f57c00' },
    rightSidebar: { display: 'flex', flexDirection: 'column', gap: '24px', alignSelf: 'flex-start', position: 'sticky', top: '100px' },
    priceCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
    pricePreview: { width: '100%', height: '200px', overflow: 'hidden' },
    previewImage: { width: '100%', height: '100%', objectFit: 'cover' },
    priceContent: { padding: '24px' },
    priceSection: { marginBottom: '20px' },
    freePriceWrapper: { display: 'flex', flexDirection: 'column', gap: '4px' },
    freePriceLabel: { fontSize: '36px', fontWeight: 'bold', color: '#1a7a3c', display: 'block', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: 1.2 },
    freePriceSubtext: { fontSize: '13px', color: '#666', fontFamily: '"Droid Arabic Kufi", serif' },
    currentPrice: { fontSize: '32px', fontWeight: 'bold', color: '#f57c00', display: 'block', marginBottom: '8px', fontFamily: '"Droid Arabic Kufi", serif' },
    originalPrice: { fontSize: '16px', color: '#000000', textDecoration: 'line-through', opacity: 0.5, fontFamily: '"Droid Arabic Kufi", serif' },
    actionButtons: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
    btnAddCart: { width: '100%', padding: '14px 24px', backgroundColor: '#ffffff', color: '#0865a8', border: '2px solid #0865a8', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontFamily: '"Droid Arabic Kufi", serif' },
    btnBuyNow: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontFamily: '"Droid Arabic Kufi", serif', boxShadow: '0 4px 12px rgba(8,101,168,0.3)' },
    btnEnrollNow: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontFamily: '"Droid Arabic Kufi", serif', boxShadow: '0 4px 12px rgba(26,122,60,0.3)' },
    btnViewMyCourses: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontFamily: '"Droid Arabic Kufi", serif', boxShadow: '0 4px 12px rgba(74,74,138,0.3)' },
    courseIncludes: { borderTop: '2px solid #f0f0f0', paddingTop: '20px' },
    includesTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif' },
    includesList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' },
    includesItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif' },
    programsCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '24px' },
    programsTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif' },
    otherCoursesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    otherCourseCard: { display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', backgroundColor: '#f9f9f9', border: '2px solid transparent' },
    otherCourseImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
    otherCourseContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
    otherCourseTitle: { fontSize: '14px', fontWeight: 'bold', color: '#000000', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontFamily: '"Droid Arabic Kufi", serif' },
    otherCoursePrice: { display: 'flex', alignItems: 'center', gap: '8px' },
    otherCurrentPrice: { fontSize: '16px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' },
    notFoundContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', fontFamily: '"Droid Arabic Kufi", serif', direction: 'rtl', marginTop: '100px' },
    notFoundCard: { backgroundColor: '#ffffff', padding: '48px', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '500px' },
    notFoundIcon: { fontSize: '64px', marginBottom: '16px' },
    btnPrimary: { display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#ffffff', textDecoration: 'none', borderRadius: '10px', marginTop: '24px', fontWeight: 'bold', transition: 'all 0.3s', fontFamily: '"Droid Arabic Kufi", serif' },
};

const mediaQueryStyles = `
  @media (max-width: 768px) {
    .overview-bar { padding: 10px 16px !important; }
    .breadcrumb-text { font-size: 12px !important; }
    .main-container { padding: 20px 16px !important; }
    .content-wrapper { grid-template-columns: 1fr !important; gap: 24px !important; }
    .right-sidebar { position: static !important; order: -1; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .content-wrapper { grid-template-columns: 1fr 320px !important; gap: 24px !important; }
  }
  @media (hover: hover) {
    .otherCourseCard:hover { background-color: #ffffff !important; border-color: #0865a8 !important; transform: translateY(-2px); }
    .btnAddCart:hover { background-color: #0865a8 !important; color: #ffffff !important; }
    .btnBuyNow:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(8,101,168,0.4) !important; }
    .btnEnrollNow:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26,122,60,0.4) !important; }
    .btnViewMyCourses:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(74,74,138,0.4) !important; }
    .topicCard:hover { background-color: #ffffff !important; border-color: #0865a8 !important; transform: translateX(4px); }
    .fileItem:hover { background-color: #ffffff !important; border-color: #0865a8 !important; }
  }
`;

export default CourseDetails;