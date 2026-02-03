import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Search, Calendar, Tag, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Clock, Award } from 'lucide-react';

export default function ModernLibrary() {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );
    const [scrollY, setScrollY] = useState(0);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleScroll = () => setScrollY(window.scrollY);
        
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
            text: "تضم المكتبة نخبة من الكتب المتميزة والتي تزيد عن أربعة آلاف كتاباً في جميع مجالات العلوم الهندسية المختلفة (مدنية – معمارية – ميكانيكا – كهرباء – صحي – مساحة) إلى جانب العلوم الأخرى",
            gradient: 'linear-gradient(135deg, #0865a8 0%, #064a7a 100%)'
        },
        {
            text: "تشترك المكتبة في 17 دورية علمية متخصصة تغطي معظم المجالات المختلفة والتي تخدم جميع مشروعات الشركة",
            gradient: 'linear-gradient(135deg, #f57c00 0%, #c96300 100%)'
        },
        {
            text: "3 مواقع متخصصة (موقع global render – موقع خلاصات كتب المدير وملفات المختار الإداري – موقع بوابة الخدمات القانونية)",
            gradient: 'linear-gradient(135deg, #0865a8 0%, #0a7ec4 100%)'
        },
        {
            text: "تحتوي المكتبة على أكثر من 2500 مادة علمية متخصصة بها خلاصة الخبرات العلمية لمشروعات الشركة",
            gradient: 'linear-gradient(135deg, #f57c00 0%, #ff9100 100%)'
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

    const parallaxOffset = scrollY * 0.5;

    return (
        <div style={styles.page}>
            {/* Animated Background */}
            <div style={styles.backgroundAnimation}>
                <div style={{...styles.floatingShape, ...styles.shape1}}></div>
                <div style={{...styles.floatingShape, ...styles.shape2}}></div>
                <div style={{...styles.floatingShape, ...styles.shape3}}></div>
            </div>

            {/* Hero Section */}
            <section style={{...styles.heroSection, transform: `translateY(${parallaxOffset}px)`}}>
                <div style={styles.heroContent}>
                    <div style={styles.heroIcon}>
                        <BookOpen style={styles.heroIconSvg} />
                        <div style={styles.iconPulse}></div>
                    </div>
                    <h1 style={{...styles.heroTitle, fontSize: isMobile ? '36px' : isTablet ? '48px' : '64px'}}>
                        المكتبة الرقمية
                    </h1>
                    <div style={styles.heroUnderline}>
                        <div style={styles.underlineAnimate}></div>
                    </div>
                    <p style={{...styles.heroSubtitle, fontSize: isMobile ? '16px' : '20px'}}>
                        رحلة معرفية تبدأ منذ 1975 • مكتبة عريقة • محتوى متجدد
                    </p>
                </div>
            </section>

            {/* Stats Cards */}
            <section style={{...styles.statsSection, padding: isMobile ? '40px 16px' : '60px 32px'}}>
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
            <section style={{...styles.descriptionSection, padding: isMobile ? '40px 16px' : '80px 32px'}}>
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
                            <h2 style={{...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px'}}>
                                مكتبة عريقة منذ 1975
                            </h2>
                            <p style={{...styles.descriptionText, fontSize: isMobile ? '16px' : '18px'}}>
                                لدينا مكتبة عريقة تم إنشاؤها منذ عام 1975 وذلك إيماناً من شركة المقاولون العرب بأهمية القراءة والاطلاع المستمر ومعرفة كل ما هو حديث وجديد بسوق العمل. نسعى دائماً لتوفير أحدث المراجع العلمية والتقنية لخدمة مشاريعنا ومنسوبينا.
                            </p>
                            <div style={styles.descriptionFeatures}>
                                <DescriptionFeature icon={Check} text="محتوى محدث باستمرار" color="#0865a8" />
                                <DescriptionFeature icon={Check} text="تغطية شاملة لجميع التخصصات" color="#f57c00" />
                                <DescriptionFeature icon={Check} text="وصول سهل وسريع" color="#6b7280" />
                            </div>
                        </div>
                        <div style={styles.imageWrapper}>
                            <div style={styles.imageFrame}>
                                <img
                                    src="https://www.arabcont.com/icemt/assets/images/library-02.jpg"
                                    alt="المكتبة"
                                    style={{...styles.mainImage, height: isMobile ? '300px' : '400px'}}
                                />
                                <div style={styles.imageOverlay}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{...styles.featuresSection, padding: isMobile ? '40px 16px' : '80px 32px'}}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px'}}>
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
            <section style={{...styles.booksSection, padding: isMobile ? '40px 16px' : '80px 32px'}}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px'}}>
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

            {/* Footer Badge */}
            <section style={styles.footerSection}>
                <div style={styles.footerBadge}>
                    <Award size={20} />
                    <span>القسم الأول - المحتوى الثابت</span>
                </div>
            </section>
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
            <div style={{...styles.statIcon, background: stat.color}}>
                <Icon size={isMobile ? 24 : 28} color="white" />
            </div>
            <div style={styles.statContent}>
                <div style={{...styles.statValue, fontSize: isMobile ? '28px' : '36px'}}>
                    {stat.value}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
            </div>
            <div style={{...styles.statGlow, background: `${stat.color}33`}}></div>
        </div>
    );
}

function DescriptionFeature({ icon: Icon, text, color }) {
    return (
        <div style={styles.descFeature}>
            <div style={{...styles.descFeatureIcon, background: `${color}15`, color: color}}>
                <Icon size={20} />
            </div>
            <span style={styles.descFeatureText}>{text}</span>
        </div>
    );
}

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
                ...styles.modernFeatureCard,
                background: isHovered ? feature.gradient : 'white',
                opacity: isVisible ? 1 : 0,
                transform: isVisible 
                    ? (isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0)')
                    : 'translateY(30px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${index * 0.1}s`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.featureNumber}>
                <span style={{
                    ...styles.featureNumberText,
                    color: isHovered ? 'white' : feature.gradient
                }}>
                    {index + 1}
                </span>
            </div>
            <div style={styles.featureCheckIcon}>
                <div style={{
                    ...styles.checkIconCircle,
                    background: isHovered ? 'rgba(255,255,255,0.2)' : feature.gradient
                }}>
                    <Check size={isMobile ? 18 : 22} color={isHovered ? 'white' : 'white'} />
                </div>
            </div>
            <p style={{
                ...styles.modernFeatureText,
                color: isHovered ? 'white' : '#374151',
                fontSize: isMobile ? '15px' : '17px'
            }}>
                {feature.text}
            </p>
            <div style={styles.featureShine}></div>
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
                <div style={{...styles.bookBadge, background: book.color}}>
                    {book.publisher}
                </div>
            </div>
            <div style={styles.bookDetails}>
                <h3 style={{...styles.bookTitle, fontSize: isMobile ? '16px' : '18px'}}>
                    {book.title}
                </h3>
                <div style={styles.bookFooter}>
                    <div style={{...styles.bookCta, color: book.color}}>
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
    const booksPerPage = 10;
    

    // Fetch books from API on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://acwebsite-icmet-test.azurewebsites.net/api/book/getAllBooks');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                
                const data = await response.json();
                
                // Transform API data to match component structure
                const transformedBooks = data.map((book, index) => {
                    // Extract year from bookDate
                    const year = book.bookDate ? book.bookDate.substring(0, 4) : 'N/A';
                    
                    // Generate a placeholder image (you can customize this)
                    const placeholderImages = [
                        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=400&fit=crop'
                    ];
                    
                    return {
                        id: index + 1,
                        category: book.typeName || 'غير مصنف',
                        year: year,
                        title: book.bookName || 'عنوان غير متوفر',
                        author: book.author || 'مؤلف غير معروف',
                        image: placeholderImages[index % placeholderImages.length]
                    };
                });
                
                setBooksDatabase(transformedBooks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching books:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);


    

    // Get unique categories from API data
    const categories = React.useMemo(() => {
        const uniqueCategories = [...new Set(booksDatabase.map(book => book.category))];
        return uniqueCategories.map((cat, index) => ({
            id: cat,
            name: cat,
            icon: ['⚖️', '📜', '📋', '📐', '🏗️', '⚡', '🏛️', '💧', '🛣️', '🚰'][index % 10]
        }));
    }, [booksDatabase]);

    // Display books based on filters or show all by default
    const filteredBooks = booksDatabase.filter(book => {
        const matchesCategory = !selectedCategory || book.category === selectedCategory;
        const matchesYear = !selectedYear || book.year === selectedYear;
        const matchesSearch = !searchText.trim() || 
            book.title.toLowerCase().includes(searchText.toLowerCase()) ||
            book.author.toLowerCase().includes(searchText.toLowerCase());
        
        return matchesCategory && matchesYear && matchesSearch;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedYear, searchText]);

    const availableYears = React.useMemo(() => {
        return getYearsForCategory(selectedCategory);
    }, [selectedCategory, booksDatabase]);

    function getYearsForCategory(categoryId) {
        if (!categoryId) return [];
        const years = [...new Set(
            booksDatabase
                .filter(book => book.category === categoryId)
                .map(book => book.year)
        )];
        return years.sort((a, b) => b.localeCompare(a));
    }

    // Show message based on filter state
    const isFiltering = selectedCategory || selectedYear || searchText.trim();
    const resultMessage = isFiltering 
        ? `تم العثور على ${filteredBooks.length} نتيجة`
        : `عرض جميع الكتب (${filteredBooks.length})`;

    return (
        <section style={{...styles.searchSection, padding: isMobile ? '40px 16px' : '80px 32px'}}>
            <div style={styles.container}>
                <div style={styles.searchContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{...styles.sectionTitle, fontSize: isMobile ? '28px' : '42px'}}>
                            ابحث في المكتبة
                        </h2>
                        <p style={styles.sectionSubtitle}>
                            اعثر على الكتاب المناسب بسهولة
                        </p>
                    </div>

                    <div style={{
                        ...styles.searchForm,
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr 1fr 1fr'
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
                            <Search 
                                style={{
                                    ...styles.inputIcon,
                                    color: isSearchFocused ? '#0865a8' : '#9ca3af'
                                }} 
                            />
                        </div>

                        <div style={styles.selectWrapper}>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedYear('');
                                }}
                                style={styles.modernSelect}
                                disabled={loading}
                            >
                                <option value="">التصنيف</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                            <Tag style={styles.inputIcon} />
                        </div>

                        <div style={styles.selectWrapper}>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                style={styles.modernSelect}
                                disabled={!selectedCategory || loading}
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
                        <div style={{...styles.resultsInfo, background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}>
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

                        {/* Pagination */}
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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = isMobile ? 3 : 5;
        
        if (totalPages <= maxVisible + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages - 1, start + maxVisible - 1);
            
            // Adjust start if we're near the end
            if (end === totalPages - 1) {
                start = Math.max(2, end - maxVisible + 1);
            }
            
            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push('...');
            }
            
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageClick = (page) => {
        if (page !== '...' && page !== currentPage) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div style={{
            ...styles.paginationContainer,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease'
        }}>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                style={{
                    ...styles.paginationButton,
                    ...styles.paginationArrow,
                    opacity: currentPage === 1 ? 0.3 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
            >
                <ChevronRight size={20} />
            </button>

            <div style={styles.paginationNumbers}>
                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} style={styles.paginationEllipsis}>
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            style={{
                                ...styles.paginationButton,
                                ...styles.paginationNumber,
                                ...(page === currentPage ? styles.paginationNumberActive : {})
                            }}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                style={{
                    ...styles.paginationButton,
                    ...styles.paginationArrow,
                    opacity: currentPage === totalPages ? 0.3 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
            >
                <ChevronLeft size={20} />
            </button>
        </div>
    );
}

function SearchResultCard({ book, index }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    const getCategoryInfo = (categoryName) => {
        const colors = ['#0865a8', '#f57c00', '#6b7280'];
        const colorIndex = categoryName.length % colors.length;
        return { name: categoryName, color: colors[colorIndex] };
    };

    const categoryInfo = getCategoryInfo(book.category);

    return (
        <div
            style={{
                ...styles.resultCard,
                opacity: isVisible ? 1 : 0,
                transform: isVisible 
                    ? (isHovered ? 'translateY(-8px)' : 'translateY(0)')
                    : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${index * 0.1}s`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.resultImageWrapper}>
                <img
                    src={book.image}
                    alt={book.title}
                    style={{
                        ...styles.resultImage,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                />
                <div style={{
                    ...styles.resultOverlay,
                    opacity: isHovered ? 1 : 0
                }}></div>
            </div>
            <div style={styles.resultContent}>
                <div style={{...styles.resultCategory, background: categoryInfo.color}}>
                    {categoryInfo.name}
                </div>
                <h4 style={styles.resultTitle}>{book.title}</h4>
                <p style={styles.resultAuthor}>{book.author}</p>
                <div style={styles.resultFooter}>
                    <span style={styles.resultYear}>{book.year}</span>
                    <div style={{...styles.resultDot, background: categoryInfo.color}}></div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#0f172a',
        fontFamily: "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: 'relative',
        overflow: 'hidden'
    },
    backgroundAnimation: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
    },
    floatingShape: {
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.15,
        animation: 'float 20s infinite ease-in-out'
    },
    shape1: {
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, #0865a8 0%, #064a7a 100%)',
        top: '-200px',
        right: '-200px',
        animationDelay: '0s'
    },
    shape2: {
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, #f57c00 0%, #c96300 100%)',
        bottom: '10%',
        left: '-150px',
        animationDelay: '7s'
    },
    shape3: {
        width: '350px',
        height: '350px',
        background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
        top: '50%',
        right: '10%',
        animationDelay: '14s'
    },
    heroSection: {
        position: 'relative',
        zIndex: 1,
        padding: '120px 32px 80px',
        textAlign: 'center'
    },
    heroContent: {
        maxWidth: '900px',
        margin: '0 auto'
    },
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
        boxShadow: '0 20px 60px rgba(8, 101, 168, 0.4)',
        animation: 'bounce 2s infinite'
    },
    heroIconSvg: {
        width: '56px',
        height: '56px',
        color: 'white',
        position: 'relative',
        zIndex: 2
    },
    iconPulse: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '30px',
        background: 'rgba(8, 101, 168, 0.4)',
        animation: 'pulse 2s infinite'
    },
    heroTitle: {
        fontSize: '64px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '24px',
        lineHeight: '1.2'
    },
    heroUnderline: {
        width: '200px',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '999px',
        margin: '0 auto 32px',
        overflow: 'hidden',
        position: 'relative'
    },
    underlineAnimate: {
        width: '40%',
        height: '100%',
        background: 'linear-gradient(90deg, #0865a8 0%, #f57c00 100%)',
        borderRadius: '999px',
        animation: 'slide 2s infinite ease-in-out'
    },
    heroSubtitle: {
        fontSize: '20px',
        color: '#94a3b8',
        fontWeight: '500',
        letterSpacing: '0.5px'
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
    },
    statsSection: {
        padding: '60px 32px'
    },
    statsGrid: {
        display: 'grid',
        gap: '24px'
    },
    statCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s ease'
    },
    statIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    statContent: {
        flex: 1,
        textAlign: 'right'
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '800',
        color: 'white',
        marginBottom: '4px'
    },
    statLabel: {
        fontSize: '16px',
        color: '#94a3b8',
        fontWeight: '500'
    },
    statGlow: {
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        borderRadius: '50%',
        filter: 'blur(60px)',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
    },
    descriptionSection: {
        padding: '80px 32px'
    },
    descriptionGrid: {
        display: 'grid',
        gap: '64px',
        alignItems: 'center'
    },
    descriptionContent: {
        textAlign: 'right'
    },
    sectionBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: 'rgba(8, 101, 168, 0.1)',
        border: '1px solid rgba(8, 101, 168, 0.2)',
        borderRadius: '999px',
        color: '#0865a8',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '24px'
    },
    sectionTitle: {
        fontSize: '42px',
        fontWeight: '800',
        color: 'white',
        marginBottom: '24px',
        lineHeight: '1.2'
    },
    descriptionText: {
        fontSize: '18px',
        color: '#94a3b8',
        lineHeight: '1.8',
        marginBottom: '32px'
    },
    descriptionFeatures: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    descFeature: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    descFeatureIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    descFeatureText: {
        color: 'white',
        fontSize: '16px',
        fontWeight: '500'
    },
    imageWrapper: {
        position: 'relative'
    },
    imageFrame: {
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
    },
    mainImage: {
        width: '100%',
        height: '400px',
        objectFit: 'cover',
        display: 'block'
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(8, 101, 168, 0.3) 0%, rgba(245, 124, 0, 0.3) 100%)',
        pointerEvents: 'none'
    },
    featuresSection: {
        padding: '80px 32px'
    },
    sectionHeader: {
        textAlign: 'center',
        marginBottom: '64px'
    },
    sectionSubtitle: {
        fontSize: '18px',
        color: '#94a3b8',
        marginTop: '12px'
    },
    featuresGrid: {
        display: 'grid',
        gap: '32px'
    },
    modernFeatureCard: {
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
    },
    featureNumber: {
        position: 'absolute',
        top: '24px',
        left: '24px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
    },
    featureNumberText: {
        fontSize: '20px',
        fontWeight: '800',
        backgroundClip: 'text'
    },
    featureCheckIcon: {
        marginBottom: '24px'
    },
    checkIconCircle: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modernFeatureText: {
        fontSize: '17px',
        lineHeight: '1.8',
        textAlign: 'right',
        position: 'relative',
        zIndex: 1
    },
    featureShine: {
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
        transform: 'rotate(45deg)',
        transition: 'all 0.6s ease'
    },
    booksSection: {
        padding: '80px 32px'
    },
    booksGrid: {
        display: 'grid',
        gap: '32px'
    },
    modernBookCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer'
    },
    bookImageContainer: {
        position: 'relative',
        height: '320px',
        overflow: 'hidden'
    },
    bookImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    bookOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        transition: 'opacity 0.4s ease'
    },
    bookIcon: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'scaleIn 0.4s ease'
    },
    bookAction: {
        padding: '12px 32px',
        background: 'white',
        color: '#0f172a',
        borderRadius: '999px',
        fontSize: '16px',
        fontWeight: '700'
    },
    bookBadge: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        padding: '8px 16px',
        borderRadius: '999px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        backdropFilter: 'blur(10px)'
    },
    bookDetails: {
        padding: '24px'
    },
    bookTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: 'white',
        lineHeight: '1.4',
        marginBottom: '16px',
        minHeight: '50px'
    },
    bookFooter: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    bookCta: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600'
    },
    searchSection: {
        padding: '80px 32px',
        background: 'rgba(15, 23, 42, 0.5)'
    },
    searchContainer: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '48px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '48px'
    },
    searchForm: {
        display: 'grid',
        gap: '16px',
        alignItems: 'end'
    },
    searchInputWrapper: {
        position: 'relative'
    },
    searchInput: {
        width: '100%',
        padding: '16px 50px 16px 24px',
        fontSize: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: 'white',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    selectWrapper: {
        position: 'relative'
    },
    modernSelect: {
        width: '100%',
        padding: '16px 50px 16px 24px',
        fontSize: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: 'white',
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        appearance: 'none',
        boxSizing: 'border-box'
    },
    inputIcon: {
        position: 'absolute',
        right: '18px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#94a3b8',
        width: '20px',
        height: '20px',
        pointerEvents: 'none'
    },
    modernSearchButton: {
        padding: '16px 40px',
        fontSize: '18px',
        fontWeight: '700',
        color: 'white',
        background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
        border: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        boxShadow: '0 10px 30px rgba(8, 101, 168, 0.3)'
    },
    resultsInfo: {
        marginTop: '32px',
        padding: '16px 24px',
        background: 'rgba(8, 101, 168, 0.1)',
        border: '1px solid rgba(8, 101, 168, 0.2)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#0865a8',
        fontSize: '16px',
        fontWeight: '600'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    loadingSpinner: {
        width: '48px',
        height: '48px',
        border: '4px solid rgba(255, 255, 255, 0.1)',
        borderTop: '4px solid #0865a8',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '24px'
    },
    loadingText: {
        fontSize: '18px',
        color: '#94a3b8',
        fontWeight: '500'
    },
    resultsGrid: {
        display: 'grid',
        gap: '24px'
    },
    resultCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer'
    },
    resultImageWrapper: {
        position: 'relative',
        height: '200px',
        overflow: 'hidden'
    },
    resultImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.6s ease'
    },
    resultOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)',
        transition: 'opacity 0.3s ease'
    },
    resultContent: {
        padding: '20px'
    },
    resultCategory: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: '12px',
        letterSpacing: '0.5px'
    },
    resultTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: 'white',
        lineHeight: '1.4',
        marginBottom: '8px',
        minHeight: '44px'
    },
    resultAuthor: {
        fontSize: '13px',
        color: '#94a3b8',
        marginBottom: '12px',
        textAlign: 'right'
    },
    resultFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px'
    },
    resultYear: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#64748b'
    },
    resultDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%'
    },
    noResults: {
        textAlign: 'center',
        padding: '80px 20px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    noResultsIcon: {
        fontSize: '64px',
        marginBottom: '24px'
    },
    noResultsTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: 'white',
        marginBottom: '12px'
    },
    noResultsText: {
        fontSize: '16px',
        color: '#94a3b8'
    },
    footerSection: {
        padding: '60px 32px',
        textAlign: 'center'
    },
    footerBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 32px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '999px',
        color: '#94a3b8',
        fontSize: '16px',
        fontWeight: '600'
    },
    paginationContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '48px',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    paginationButton: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontFamily: 'inherit',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        outline: 'none'
    },
    paginationArrow: {
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer'
    },
    paginationNumbers: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    paginationNumber: {
        minWidth: '40px',
        height: '40px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        padding: '0 12px'
    },
    paginationNumberActive: {
        background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
        border: '1px solid transparent',
        boxShadow: '0 4px 12px rgba(8, 101, 168, 0.4)'
    },
    paginationEllipsis: {
        color: '#64748b',
        fontSize: '16px',
        fontWeight: '600',
        padding: '0 8px'
    }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(30px, -30px) rotate(120deg); }
        66% { transform: translate(-20px, 20px) rotate(240deg); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(1.15); opacity: 0.8; }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
    }
    @keyframes scaleIn {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    input::placeholder, select option:first-child {
        color: #64748b;
    }
    
    select option {
        background: #1e293b;
        color: white;
    }
`;
document.head.appendChild(styleSheet);