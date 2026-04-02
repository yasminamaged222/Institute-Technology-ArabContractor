import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Search, Calendar, Tag, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Clock, Award } from 'lucide-react';

export default function ModernLibrary() {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );
    const [scrollY, setScrollY] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        document.title = 'المكتبة - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleScroll = () => {
            setScrollY(window.scrollY);
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const isMobile = windowWidth <= 640;
    const isTablet = windowWidth <= 1024 && windowWidth > 640;

    const stats = [
        { icon: BookOpen, label: 'كتاب متاح', value: '4000+', color: '#0865a8' },
        { icon: TrendingUp, label: 'دورية علمية', value: '17', color: '#f57c00' },
        { icon: Clock, label: 'مواد علمية', value: '2500+', color: '#0865a8' },
        { icon: Award, label: 'سنوات خبرة', value: '49', color: '#f57c00' }
    ];

    const features = [
        {
            text: "تضم المكتبة تخبه من الكتب المتميزة والتي تزيد عن أربعة ألف كتاباً في جميع مجالات العلوم الهندسية المختلفة (مدنية – معمارية – ميكانيكا – كهرباء – صحي – مساحة .....) الى جانب العلوم الاخرى (الادارة – الاقتصاد – القانون – المحاسبة – الحاسب الآلي...)",
            color: '#0865a8'
        },
        {
            text: "تشترك المكتبة في 17 دورية علمية متخصصة تغطي معظم المجالات المختلفة والتي تخدم جميع مشروعات الشركة",
            color: '#f57c00'
        },
        {
            text: "3 مواقع متخصصة (موقع global render – موقع خلاصات كتب المدير وملفات المختار الإداري – موقع بوابة الخدمات القانونية)",
            color: '#0865a8'
        },
        {
            text: "تحتوي المكتبة على أكثر من 2500 مادة علمية متخصصة بها خلاصة الخبرات العلمية لمشروعات الشركة والتي تم اعدادها من قبل الخبراء والمتخصصين بالشركة بهدف نقل الخبرات المختلفة الى جميع العاملين من خلال العملية التدريبية.",
            color: '#f57c00'
        }
    ];

    const books = [
        {
            title: "Capture and reuse of project knowledge in construction",
            publisher: "Willy-Blackwell",
            image: "https://www.arabcont.com/icemt/assets/images/Book01.jpg",
            url: "https://online.fliphtml5.com/cvhml/vzfl/#p=1",
            color: '#0865a8'
        },
        {
            title: "ICE manual of highway design and management",
            publisher: "Second Edition",
            image: "https://www.arabcont.com/icemt/assets/images/Book02.jpg",
            url: "https://online.fliphtml5.com/cvhml/qzxx/#p=1",
            color: '#f57c00'
        },
        {
            title: "Construction Dewatering and Groundwater Control",
            publisher: "Third Edition",
            image: "https://www.arabcont.com/icemt/assets/images/Book03.jpg",
            url: "https://online.fliphtml5.com/cvhml/wdbx/#p=1",
            color: '#0865a8'
        }
    ];

    const handleBookClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div style={styles.page}>
            {/* Progress Bar */}
            <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${scrollProgress}%` }} />
            </div>

            {/* Fixed Overview Bar */}
            
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>المكــتبة</span>
                </div>
            </div>

            {/* Hero Section */}
            <section style={{ ...styles.heroSection, paddingTop: isMobile ? '140px' : '160px' }}>
                <div style={styles.heroContent}>
                    <div style={styles.heroIcon}>
                        <BookOpen style={styles.heroIconSvg} />
                    </div>
                    <h1 style={{ ...styles.heroTitle, fontSize: isMobile ? '36px' : isTablet ? '48px' : '64px' }}>
                        المكتبة
                    </h1>
                    <div style={styles.heroUnderline}>
                        <div style={styles.underlineAnimate}></div>
                    </div>
                    <p style={{ ...styles.heroSubtitle, fontSize: isMobile ? '16px' : '20px' }}>
                        رحلة معرفية تبدأ منذ 1975 • مكتبة عريقة • محتوى متجدد
                    </p>
                </div>
            </section>

            {/* Stats Cards */}
            <section style={{ ...styles.statsSection, padding: isMobile ? '40px 16px' : '60px 32px' }}>
                <div style={styles.container}>
                    <div style={{
                        ...styles.statsGrid,
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
                    }}>
                        {stats.map((stat, index) => (
                            <StatCard key={index} stat={stat} index={index} isMobile={isMobile} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Description with Image */}
            <section style={{ ...styles.descriptionSection, padding: isMobile ? '40px 16px' : '80px 32px' }}>
                <div style={styles.container}>
                    <div style={{
                        ...styles.descriptionGrid,
                        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
                        gap: isMobile ? '32px' : '64px'
                    }}>
                        <div style={styles.descriptionContent}>
                            <div style={styles.sectionBadge}>
                                <Sparkles size={16} />
                                <span>نبذة عن المكتبة</span>
                            </div>
                            <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px' }}>
                                مكتبة عريقة منذ 1975
                            </h2>
                            <p style={{ ...styles.descriptionText, fontSize: isMobile ? '16px' : '18px' }}>
                                لدينا مكتبة عريقة تم إنشاؤها منذ عام 1975 وذلك إيماناً من شركة المقاولون العرب بأهمية القراءة والاطلاع المستمر ومعرفة كل ما هو حديث وجديد بسوق العمل
                            </p>
                            <div style={styles.descriptionFeatures}>
                                <DescriptionFeature icon={Check} text="محتوى محدث باستمرار" color="#0865a8" />
                                <DescriptionFeature icon={Check} text="تغطية شاملة لجميع التخصصات" color="#f57c00" />
                                <DescriptionFeature icon={Check} text="وصول سهل وسريع" color="#000000" />
                            </div>
                        </div>
                        <div style={styles.imageWrapper}>
                            <div style={styles.imageFrame}>
                                <img
                                    src="https://www.arabcont.com/icemt/assets/images/library-02.jpg"
                                    alt="المكتبة"
                                    style={{ ...styles.mainImage, height: isMobile ? '300px' : '400px' }}
                                />
                                <div style={styles.imageOverlay}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ ...styles.featuresSection, padding: isMobile ? '40px 16px' : '80px 32px' }}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px' }}>
                            مميزات المكتبة
                        </h2>
                        <p style={styles.sectionSubtitle}>
                            اكتشف ما يميز مكتبتنا عن غيرها
                        </p>
                    </div>
                    <div style={{
                        ...styles.featuresGrid,
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(2, 1fr)'
                    }}>
                        {features.map((feature, index) => (
                            <ModernFeatureCard
                                key={index}
                                feature={feature}
                                index={index}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Books Showcase */}
            <section style={{ ...styles.booksSection, padding: isMobile ? '40px 16px' : '80px 32px' }}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px' }}>
                            أمثلة من الكتب
                        </h2>
                        <p style={styles.sectionSubtitle}>
                            تصفح مجموعة مختارة من أفضل الكتب
                        </p>
                    </div>
                    <div style={{
                        ...styles.booksGrid,
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
                    }}>
                        {books.map((book, index) => (
                            <ModernBookCard
                                key={index}
                                book={book}
                                onClick={() => handleBookClick(book.url)}
                                index={index}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <LibrarySearchSection isMobile={isMobile} isTablet={isTablet} />

            {/* Font Import */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');`}
            </style>
        </div>
    );
}

function StatCard({ stat, index, isMobile }) {
    const [isVisible, setIsVisible] = useState(false);
    const Icon = stat.icon;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div style={{
            ...styles.statCard,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.6s ease ${index * 0.1}s`
        }}>
            <div style={{ ...styles.statIcon, background: stat.color }}>
                <Icon size={isMobile ? 24 : 28} color="white" />
            </div>
            <div style={styles.statContent}>
                <div style={{ ...styles.statValue, fontSize: isMobile ? '28px' : '36px' }}>
                    {stat.value}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
            </div>
        </div>
    );
}

function DescriptionFeature({ icon: Icon, text, color }) {
    return (
        <div style={styles.descFeature}>
            <div style={{ ...styles.descFeatureIcon, background: 'white', border: `2px solid ${color}` }}>
                <Icon size={20} color={color} />
            </div>
            <span style={styles.descFeatureText}>{text}</span>
        </div>
    );
}

// ✅ FIXED: ModernFeatureCard — clean hover, no overlap issues
function ModernFeatureCard({ feature, index, isMobile }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 150);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div
            style={{
                borderRadius: '24px',
                border: `2px solid ${isHovered ? feature.color : '#e5e7eb'}`,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: isHovered ? `0 12px 32px ${feature.color}28` : '0 4px 6px rgba(0,0,0,0.05)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? isHovered ? 'translateY(-8px)' : 'translateY(0)'
                    : 'translateY(30px)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'white',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated top color bar */}
            <div style={{
                height: '6px',
                background: feature.color,
                width: isHovered ? '100%' : '40%',
                transition: 'width 0.4s ease',
            }} />

            <div style={{
                padding: '28px 32px',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                direction: 'rtl',
            }}>
                {/* Number badge */}
                <div style={{
                    flexShrink: 0,
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: isHovered ? feature.color : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s ease',
                }}>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        color: isHovered ? 'white' : feature.color,
                        transition: 'color 0.4s ease',
                        fontFamily: 'inherit',
                    }}>
                        {index + 1}
                    </span>
                </div>

                {/* Text */}
                <p style={{
                    fontSize: isMobile ? '15px' : '16px',
                    lineHeight: '1.8',
                    color: '#1a1a1a',
                    textAlign: 'right',
                    margin: 0,
                    flex: 1,
                    fontFamily: 'inherit',
                }}>
                    {feature.text}
                </p>
            </div>
        </div>
    );
}

function ModernBookCard({ book, onClick, index, isMobile }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 150);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div
            style={{
                ...styles.modernBookCard,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? (isHovered ? 'translateY(-12px) scale(1.03)' : 'translateY(0)')
                    : 'translateY(30px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${index * 0.1}s`
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.bookImageContainer}>
                <img
                    src={book.image}
                    alt={book.title}
                    style={{
                        ...styles.bookImage,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                />
                <div style={{
                    ...styles.bookOverlay,
                    opacity: isHovered ? 1 : 0,
                    background: book.color
                }}>
                    <div style={styles.bookIcon}>
                        <Search size={32} color="white" />
                    </div>
                    <div style={styles.bookAction}>اقرأ الآن</div>
                </div>
                <div style={{ ...styles.bookBadge, background: book.color }}>
                    {book.publisher}
                </div>
            </div>
            <div style={styles.bookDetails}>
                <h3 style={{ ...styles.bookTitle, fontSize: isMobile ? '16px' : '18px' }}>
                    {book.title}
                </h3>
                <div style={styles.bookFooter}>
                    <div style={{ ...styles.bookCta, color: book.color }}>
                        تصفح الكتاب
                        <ChevronLeft size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LibrarySearchSection({ isMobile, isTablet }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchText, setSearchText] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [booksDatabase, setBooksDatabase] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;

    useEffect(() => {
        let cancelled = false;

        const fetchAllPages = async () => {
            try {
                setLoading(true);

                const firstResponse = await fetch(
                    'https://acwebsite-icmet-test.azurewebsites.net/api/book/getAllBooks?pageIndex=1'
                );
                if (!firstResponse.ok) throw new Error('Failed to fetch books');
                const firstData = await firstResponse.json();

                const totalPages = firstData.totalPages || 1;
                let allItems = [...(firstData.data || [])];

                if (totalPages > 1) {
                    const promises = [];
                    for (let page = 2; page <= totalPages; page++) {
                        promises.push(
                            fetch(
                                `https://acwebsite-icmet-test.azurewebsites.net/api/book/getAllBooks?pageIndex=${page}`
                            ).then(res => {
                                if (!res.ok) throw new Error(`Page ${page} failed`);
                                return res.json();
                            })
                        );
                    }
                    const pages = await Promise.all(promises);
                    pages.forEach(page => {
                        allItems = allItems.concat(page.data || []);
                    });
                }

                if (cancelled) return;

                const transformedBooks = allItems.map((book, index) => {
                    let year = '2000';
                    if (book.bookDate) {
                        const match = book.bookDate.match(/\.000(\d{4})$/);
                        if (match && match[1]) {
                            year = match[1];
                        }
                    }

                    return {
                        id: index + 1,
                        category: book.typeName || 'غير مصنف',
                        year: year,
                        title: book.bookName || 'عنوان غير متوفر',
                        author: book.author || 'مؤلف غير معروف',
                    };
                });

                setBooksDatabase(transformedBooks);
                setLoading(false);
            } catch (err) {
                if (cancelled) return;
                console.error('Error fetching books:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAllPages();
        return () => { cancelled = true; };
    }, []);

    const categories = React.useMemo(() => {
        const uniqueCategories = [...new Set(booksDatabase.map(book => book.category))];
        return uniqueCategories.map((cat, index) => ({
            id: cat,
            name: cat,
            icon: ['⚖️', '📜', '📋', '📐', '🏗️', '⚡', '🏛️', '💧', '🛣️', '🚰'][index % 10]
        }));
    }, [booksDatabase]);

    const filteredBooks = booksDatabase.filter(book => {
        const matchesCategory = !selectedCategory || book.category === selectedCategory;
        const matchesYear = !selectedYear || book.year === selectedYear;
        const matchesSearch = !searchText.trim() ||
            book.title.toLowerCase().includes(searchText.toLowerCase()) ||
            book.author.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesYear && matchesSearch;
    });

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedYear, searchText]);

    const availableYears = React.useMemo(() => {
        if (!selectedCategory) {
            const years = [...new Set(booksDatabase.map(book => book.year))];
            return years.sort((a, b) => b.localeCompare(a));
        }
        const years = [...new Set(
            booksDatabase
                .filter(book => book.category === selectedCategory)
                .map(book => book.year)
        )];
        return years.sort((a, b) => b.localeCompare(a));
    }, [selectedCategory, booksDatabase]);

    const isFiltering = selectedCategory || selectedYear || searchText.trim();
    const resultMessage = isFiltering
        ? `تم العثور على ${filteredBooks.length} نتيجة`
        : `عرض جميع الكتب (${filteredBooks.length})`;

    return (
        <section style={{ ...styles.searchSection, padding: isMobile ? '40px 16px' : '80px 32px' }}>
            <div style={styles.container}>
                <div style={styles.searchContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px' }}>
                            ابحث في المكتبة
                        </h2>
                        <p style={styles.sectionSubtitle}>اعثر على الكتاب المناسب بسهولة</p>
                    </div>

                    <div style={{
                        ...styles.searchForm,
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr 1fr'
                    }}>
                        <div style={styles.searchInputWrapper}>
                            <input
                                type="text"
                                placeholder="ابحث عن كتاب أو مؤلف..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                style={{
                                    ...styles.searchInput,
                                    borderColor: isSearchFocused ? '#0865a8' : '#e5e7eb',
                                    boxShadow: isSearchFocused ? '0 0 0 3px rgba(8, 101, 168, 0.1)' : 'none'
                                }}
                                disabled={loading}
                            />
                            <Search style={styles.inputIcon} />
                        </div>

                        <div style={styles.selectWrapper}>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={styles.modernSelect}
                                disabled={loading}
                            >
                                <option value="">التصنيف</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                            <Tag style={styles.inputIcon} />
                        </div>

                        <div style={styles.selectWrapper}>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                style={styles.modernSelect}
                                disabled={loading}
                            >
                                <option value="">السنة</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <Calendar style={styles.inputIcon} />
                        </div>
                    </div>

                    {loading ? (
                        <div style={styles.resultsInfo}>
                            <Sparkles size={18} />
                            <span>جاري تحميل الكتب...</span>
                        </div>
                    ) : error ? (
                        <div style={{ ...styles.resultsInfo, background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                            <span>حدث خطأ في تحميل الكتب: {error}</span>
                        </div>
                    ) : (
                        <div style={styles.resultsInfo}>
                            <Sparkles size={18} />
                            <span>{resultMessage}</span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loadingSpinner}></div>
                        <p style={styles.loadingText}>جاري التحميل...</p>
                    </div>
                ) : error ? (
                    <div style={styles.noResults}>
                        <div style={styles.noResultsIcon}>⚠️</div>
                        <h3 style={styles.noResultsTitle}>حدث خطأ</h3>
                        <p style={styles.noResultsText}>{error}</p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            ...styles.resultsGrid,
                            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
                        }}>
                            {currentBooks.map((book, index) => (
                                <SearchResultCard key={book.id} book={book} index={index} />
                            ))}
                        </div>

                        {filteredBooks.length === 0 && (
                            <div style={styles.noResults}>
                                <div style={styles.noResultsIcon}>📚</div>
                                <h3 style={styles.noResultsTitle}>لا توجد نتائج</h3>
                                <p style={styles.noResultsText}>جرب تغيير معايير البحث</p>
                            </div>
                        )}

                        {filteredBooks.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                isMobile={isMobile}
                            />
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

function Pagination({ currentPage, totalPages, onPageChange, isMobile }) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = isMobile ? 3 : 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages - 1, start + maxVisible - 1);
            if (end === totalPages - 1) start = Math.max(2, end - maxVisible + 1);
            if (start > 2) pages.push('...');
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) { onPageChange(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };
    const handleNext = () => {
        if (currentPage < totalPages) { onPageChange(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };

    return (
        <div style={styles.paginationContainer}>
            <button onClick={handlePrevious} disabled={currentPage === 1}
                style={{ ...styles.paginationButton, ...styles.paginationArrow, opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                <ChevronRight size={20} />
            </button>

            <div style={styles.paginationNumbers}>
                {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                        <span key={`e-${index}`} style={styles.paginationEllipsis}>...</span>
                    ) : (
                        <button key={page} onClick={() => page !== currentPage && onPageChange(page)}
                            style={{ ...styles.paginationButton, ...styles.paginationNumber, ...(page === currentPage ? styles.paginationNumberActive : {}) }}>
                            {page}
                        </button>
                    )
                )}
            </div>

            <button onClick={handleNext} disabled={currentPage === totalPages}
                style={{ ...styles.paginationButton, ...styles.paginationArrow, opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
                <ChevronLeft size={20} />
            </button>
        </div>
    );
}

// ✅ FIXED: SearchResultCard — completely redesigned, clean and modern
function SearchResultCard({ book, index }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 80);
        return () => clearTimeout(timer);
    }, [index]);

    const colors = ['#0865a8', '#f57c00', '#000000'];
    const accentColor = colors[book.category.length % colors.length];

    return (
        <div
            style={{
                background: 'white',
                borderRadius: '16px',
                border: `1.5px solid ${isHovered ? accentColor : '#e5e7eb'}`,
                padding: '20px',
                cursor: 'pointer',
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? isHovered ? 'translateY(-6px)' : 'translateY(0)'
                    : 'translateY(20px)',
                transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${index * 0.05}s`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isHovered ? `0 8px 24px ${accentColor}20` : '0 2px 8px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Right accent bar */}
            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: accentColor,
                borderRadius: '0 16px 16px 0',
                opacity: isHovered ? 1 : 0.25,
                transition: 'opacity 0.3s ease',
            }} />

            {/* Category pill */}
            <div style={{
                display: 'inline-flex',
                alignSelf: 'flex-end',
                padding: '4px 10px',
                borderRadius: '20px',
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
                color: accentColor,
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.3px',
                fontFamily: 'inherit',
            }}>
                {book.category}
            </div>

            {/* Title */}
            <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#111827',
                lineHeight: '1.5',
                margin: 0,
                textAlign: 'right',
                fontFamily: 'inherit',
                flex: 1,
            }}>
                {book.title}
            </h4>

            {/* Divider */}
            <div style={{ height: '1px', background: '#f0f0f0' }} />

            {/* Footer: year + author */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
            }}>
                <span style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    fontFamily: 'inherit',
                    flex: 1,
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {book.author}
                </span>
                <span style={{
                    fontSize: '12px',
                    color: accentColor,
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    background: `${accentColor}10`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    flexShrink: 0,
                }}>
                    {book.year}
                </span>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'white',
        fontFamily: '"Droid Arabic Kufi", serif',
        position: 'relative',
        overflow: 'hidden'
    },
    progressBar: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: '#e5e7eb',
        zIndex: 9999
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(to right, #f57c00, #0865a8)',
        transition: 'width 0.3s ease'
    },
    heroSection: {
        position: 'relative',
        zIndex: 1,
        padding: '160px 32px 80px',
        textAlign: 'center',
        background: 'white'
    },
    heroContent: { maxWidth: '900px', margin: '0 auto' },
    heroIcon: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '120px',
        background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
        borderRadius: '30px',
        marginBottom: '32px',
        boxShadow: '0 20px 60px rgba(8, 101, 168, 0.4)'
    },
    heroIconSvg: { width: '56px', height: '56px', color: 'white', position: 'relative', zIndex: 2 },
    heroTitle: { fontSize: '64px', fontWeight: '800', color: '#000000', marginBottom: '24px', lineHeight: '1.2' },
    heroUnderline: {
        width: '200px', height: '6px', background: '#e5e7eb',
        borderRadius: '999px', margin: '0 auto 32px', overflow: 'hidden', position: 'relative'
    },
    underlineAnimate: {
        width: '40%', height: '100%',
        background: 'linear-gradient(90deg, #0865a8 0%, #f57c00 100%)',
        borderRadius: '999px', animation: 'slide 2s infinite ease-in-out'
    },
    heroSubtitle: { fontSize: '20px', color: '#6b7280', fontWeight: '500', letterSpacing: '0.5px' },
    container: { maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 },
    statsSection: { padding: '60px 32px', background: 'white' },
    statsGrid: { display: 'grid', gap: '24px' },
    statCard: {
        background: 'white', borderRadius: '20px', padding: '32px',
        border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '20px',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.4s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    statIcon: { width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    statContent: { flex: 1, textAlign: 'right' },
    statValue: { fontSize: '36px', fontWeight: '800', color: '#000000', marginBottom: '4px' },
    statLabel: { fontSize: '16px', color: '#6b7280', fontWeight: '500' },
    descriptionSection: { padding: '80px 32px', background: 'white' },
    descriptionGrid: { display: 'grid', gap: '64px', alignItems: 'center' },
    descriptionContent: { textAlign: 'right' },
    sectionBadge: {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px', background: 'white', border: '2px solid #0865a8',
        borderRadius: '999px', color: '#0865a8', fontSize: '14px', fontWeight: '600', marginBottom: '24px'
    },
    sectionTitle: { fontSize: '42px', fontWeight: '800', color: '#000000', marginBottom: '24px', lineHeight: '1.2' },
    descriptionText: { fontSize: '18px', color: '#4b5563', lineHeight: '1.8', marginBottom: '32px' },
    descriptionFeatures: { display: 'flex', flexDirection: 'column', gap: '16px' },
    descFeature: { display: 'flex', alignItems: 'center', gap: '12px' },
    descFeatureIcon: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    descFeatureText: { color: '#000000', fontSize: '16px', fontWeight: '500' },
    imageWrapper: { position: 'relative' },
    imageFrame: { position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', border: '3px solid #e5e7eb' },
    mainImage: { width: '100%', height: '400px', objectFit: 'cover', display: 'block' },
    imageOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(8,101,168,0.2) 0%, rgba(245,124,0,0.2) 100%)',
        pointerEvents: 'none'
    },
    featuresSection: { padding: '80px 32px', background: '#f9fafb' },
    sectionHeader: { textAlign: 'center', marginBottom: '64px' },
    sectionSubtitle: { fontSize: '18px', color: '#6b7280', marginTop: '12px' },
    featuresGrid: { display: 'grid', gap: '32px' },
    booksSection: { padding: '80px 32px', background: 'white' },
    booksGrid: { display: 'grid', gap: '32px' },
    modernBookCard: {
        background: 'white', borderRadius: '24px', overflow: 'hidden',
        border: '2px solid #e5e7eb', cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'all 0.3s ease'
    },
    bookImageContainer: { position: 'relative', height: '320px', overflow: 'hidden' },
    bookImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' },
    bookOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '16px', transition: 'opacity 0.4s ease'
    },
    bookIcon: {
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    bookAction: { padding: '12px 32px', background: 'white', color: '#000000', borderRadius: '999px', fontSize: '16px', fontWeight: '700' },
    bookBadge: {
        position: 'absolute', top: '16px', right: '16px',
        padding: '8px 16px', borderRadius: '999px', color: 'white',
        fontSize: '12px', fontWeight: '700', textTransform: 'uppercase'
    },
    bookDetails: { padding: '24px' },
    bookTitle: { fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: '1.4', marginBottom: '16px', minHeight: '50px' },
    bookFooter: { display: 'flex', justifyContent: 'flex-end' },
    bookCta: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' },
    searchSection: { padding: '80px 32px', background: '#f9fafb' },
    searchContainer: {
        background: 'white', borderRadius: '32px', padding: '48px',
        border: '2px solid #e5e7eb', marginBottom: '48px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    searchForm: { display: 'grid', gap: '16px', alignItems: 'end' },
    searchInputWrapper: { position: 'relative' },
    searchInput: {
        width: '100%', padding: '16px 50px 16px 24px', fontSize: '16px',
        background: 'white', border: '2px solid #e5e7eb', borderRadius: '16px',
        color: '#000000', outline: 'none', transition: 'all 0.3s ease',
        fontFamily: 'inherit', boxSizing: 'border-box'
    },
    selectWrapper: { position: 'relative' },
    modernSelect: {
        width: '100%', padding: '16px 50px 16px 24px', fontSize: '16px',
        background: 'white', border: '2px solid #e5e7eb', borderRadius: '16px',
        color: '#000000', outline: 'none', cursor: 'pointer',
        transition: 'all 0.3s ease', fontFamily: 'inherit',
        appearance: 'none', boxSizing: 'border-box'
    },
    inputIcon: {
        position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
        color: '#9ca3af', width: '20px', height: '20px', pointerEvents: 'none'
    },
    resultsInfo: {
        marginTop: '32px', padding: '16px 24px',
        background: 'rgba(8,101,168,0.1)', border: '2px solid rgba(8,101,168,0.2)',
        borderRadius: '16px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '12px', color: '#0865a8',
        fontSize: '16px', fontWeight: '600'
    },
    loadingContainer: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 20px',
        background: 'white', borderRadius: '24px', border: '2px solid #e5e7eb'
    },
    loadingSpinner: {
        width: '48px', height: '48px', border: '4px solid #e5e7eb',
        borderTop: '4px solid #0865a8', borderRadius: '50%',
        animation: 'spin 1s linear infinite', marginBottom: '24px'
    },
    loadingText: { fontSize: '18px', color: '#6b7280', fontWeight: '500' },
    resultsGrid: { display: 'grid', gap: '20px' },
    noResults: {
        textAlign: 'center', padding: '80px 20px',
        background: 'white', borderRadius: '24px', border: '2px solid #e5e7eb'
    },
    noResultsIcon: { fontSize: '64px', marginBottom: '24px' },
    noResultsTitle: { fontSize: '28px', fontWeight: '800', color: '#000000', marginBottom: '12px' },
    noResultsText: { fontSize: '16px', color: '#6b7280' },
    paginationContainer: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '12px', marginTop: '48px', padding: '24px',
        background: 'white', borderRadius: '20px', border: '2px solid #e5e7eb'
    },
    paginationButton: {
        background: 'transparent', border: 'none', color: '#000000',
        fontFamily: 'inherit', fontSize: '16px', fontWeight: '600',
        transition: 'all 0.3s ease', outline: 'none'
    },
    paginationArrow: {
        width: '40px', height: '40px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'white', border: '2px solid #e5e7eb', cursor: 'pointer'
    },
    paginationNumbers: { display: 'flex', alignItems: 'center', gap: '8px' },
    paginationNumber: {
        minWidth: '40px', height: '40px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'white', border: '2px solid #e5e7eb', cursor: 'pointer', padding: '0 12px'
    },
    paginationNumberActive: {
        background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
        border: '2px solid transparent', color: 'white'
    },
    paginationEllipsis: { color: '#9ca3af', fontSize: '16px', fontWeight: '600', padding: '0 8px' }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    input::placeholder { color: #9ca3af; }
    select option { background: white; color: #000000; }
`;
document.head.appendChild(styleSheet);