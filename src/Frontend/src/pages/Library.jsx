


import React, { useState } from 'react';
import { BookOpen, Check, Building2, Search, Calendar, Tag } from 'lucide-react';


export default function Library() {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );



    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 640;
    const isTablet = windowWidth <= 768 && windowWidth > 640;

    const features = [
        {
            text: " ÷„ «·„ﬂ »…  Œ»… „‰ «·ﬂ » «·„ „Ì“… Ê«· Ì  “Ìœ ⁄‰ √—»⁄… √·«› ﬂ «»« ›Ì Ã„Ì⁄ „Ã«·«  «·⁄·Ê„ «·Â‰œ”Ì… «·„Œ ·›… („œ‰Ì… ñ „⁄„«—Ì… ñ „Ìﬂ«‰Ìﬂ« ñ ﬂÂ—»«¡ ñ ’ÕÌ ñ „”«Õ… .....) ≈·Ï Ã«‰» «·⁄·Ê„ «·√Œ—Ï («·≈œ«—… ñ «·«ﬁ ’«œ ñ «·ﬁ«‰Ê‰ ñ «·„Õ«”»… ñ «·Õ«”» «·¬·Ì...)"
        },
        {
            text: " ‘ —ﬂ «·„ﬂ »… ›Ì17 œÊ—Ì… ⁄·„Ì… „ Œ’’…  €ÿÌ „⁄Ÿ„ «·„Ã«·«  «·„Œ ·›… Ê«· Ì  Œœ„ Ã„Ì⁄ „‘—Ê⁄«  «·‘—ﬂ…."
        },
        {
            text: "3 „Ê«ﬁ⁄ „ Œ’’… („Êﬁ⁄ global render ñ „Êﬁ⁄ Œ·«’«  ﬂ » «·„œÌ— Ê„·›«  «·„Œ «— «·≈œ«—Ì ñ „Êﬁ⁄ »Ê«»… «·Œœ„«  «·ﬁ«‰Ê‰Ì…)"
        },
        {
            text: " Õ ÊÌ «·„ﬂ »… ⁄·Ï √ﬂÀ— „‰ 2500 „«œ… ⁄·„Ì… „ Œ’’… »Â« Œ·«’… «·Œ»—«  «·⁄·„Ì… ·„‘—Ê⁄«  «·‘—ﬂ… Ê«· Ì  „ ≈⁄œ«œÂ« „‰ ﬁ»· «·Œ»—«¡ Ê«·„ Œ’’Ì‰ »«·‘—ﬂ… »Âœ› ‰ﬁ· «·Œ»—«  «·„Œ ·›… ≈·Ï Ã„Ì⁄ «·⁄«„·Ì‰ „‰ Œ·«· «·⁄„·Ì… «· œ—Ì»Ì…."
        }
    ];

    const books = [
        {
            title: "Capture and reuse of project knowledge in construction",
            publisher: "Willy-Blackwell",
            image: "https://www.arabcont.com/icemt/assets/images/Book01.jpg",
            url: "https://online.fliphtml5.com/cvhml/vzfl/#p=1"
        },
        {
            title: "ICE manual of highway design and management",
            publisher: "Second Edition",
            image: "https://www.arabcont.com/icemt/assets/images/Book02.jpg",
            url: "https://online.fliphtml5.com/cvhml/qzxx/#p=1"
        },
        {
            title: "Construction Dewatering and Groundwater Control",
            publisher: "Third Edition",
            image: "https://www.arabcont.com/icemt/assets/images/Book03.jpg",
            url: "https://online.fliphtml5.com/cvhml/wdbx/#p=1"
        }
    ];

    const handleBookClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const responsiveStyles = getResponsiveStyles(isMobile, isTablet);

    return (
        <div style={responsiveStyles.page}>
            {/* Main Content */}
            <main style={responsiveStyles.main}>
                {/* Title Section */}
                <div style={responsiveStyles.titleSection}>
                    <div style={responsiveStyles.iconWrapper}>
                        <BookOpen style={responsiveStyles.iconWrapperSvg} />
                    </div>
                    <h2 style={responsiveStyles.mainTitle}>«·„ﬂ »…</h2>
                    <div style={responsiveStyles.titleUnderline}></div>
                </div>

                {/* Description Card */}
                <div style={responsiveStyles.descriptionCard}>
                    <p style={responsiveStyles.descriptionText}>
                        ·œÌ‰« „ﬂ »… ⁄—Ìﬁ…  „ ≈‰‘«ƒÂ« „‰– ⁄«„ 1975 Ê–·ﬂ ≈Ì„«‰« „‰ ‘—ﬂ… «·„ﬁ«Ê·Ê‰ «·⁄—» »√Â„Ì… «·ﬁ—«¡… Ê«·«ÿ·«⁄ «·„” „— Ê„⁄—›… ﬂ· „« ÂÊ ÕœÌÀ ÊÃœÌœ »”Êﬁ «·⁄„·
                    </p>
                </div>

                {/* Library Image */}
                <div style={responsiveStyles.imageContainer}>
                    <img
                        src="https://www.arabcont.com/icemt/assets/images/library-02.jpg"
                        alt="«·„ﬂ »…"
                        style={responsiveStyles.libraryImage}
                    />
                </div>

                {/* Features Grid */}
                <div style={responsiveStyles.featuresGrid}>
                    {features.map((feature, index) => (
                        <FeatureCard key={index} text={feature.text} isMobile={isMobile} />
                    ))}
                </div>

                {/* Footer Note */}
                <div style={responsiveStyles.footerNote}>
                    <div style={responsiveStyles.noteBadge}>
                        <p style={responsiveStyles.noteText}>«·ﬁ”„ «·√Ê· - «·„Õ ÊÏ «·À«» </p>
                    </div>
                </div>

                {/* Books Section */}
                <div style={responsiveStyles.booksSection}>
                    <h2 style={responsiveStyles.booksTitle}>√„À·… „‰ «·ﬂ »</h2>
                    <div style={responsiveStyles.booksGrid}>
                        {books.map((book, index) => (
                            <BookCard
                                key={index}
                                book={book}
                                onClick={() => handleBookClick(book.url)}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>
                </div>

                {/* Search Section */}
                <LibrarySearchSection isMobile={isMobile} isTablet={isTablet} />
            </main>
        </div>
    );
}

function FeatureCard({ text, isMobile }) {
    const responsiveFeatureStyles = {
        featureText: {
            color: '#374151',
            fontSize: isMobile ? '16px' : '18px',
            lineHeight: '1.75',
            textAlign: 'right',
            flex: 1,
            margin: 0
        }
    };

    return (
        <div style={styles.featureCard}>
            <div style={styles.featureContent}>
                <div style={styles.checkIconWrapper}>
                    <div style={styles.checkIcon}>
                        <Check style={styles.checkIconSvg} />
                    </div>
                </div>
                <p style={responsiveFeatureStyles.featureText}>{text}</p>
            </div>
        </div>
    );
}

function BookCard({ book, onClick, isMobile }) {
    const [isHovered, setIsHovered] = useState(false);

    const responsiveBookStyles = {
        bookImageWrapper: {
            position: 'relative',
            overflow: 'hidden',
            height: isMobile ? '300px' : '350px'
        }
    };

    return (
        <div
            style={{
                ...styles.bookCard,
                ...(isHovered ? styles.bookCardHover : {})
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={responsiveBookStyles.bookImageWrapper}>
                <img
                    src={book.image}
                    alt={book.title}
                    style={{
                        ...styles.bookImage,
                        ...(isHovered ? styles.bookImageHover : {})
                    }}
                />
                <div style={{
                    ...styles.bookOverlay,
                    ...(isHovered ? styles.bookOverlayVisible : {})
                }}>
                    <div style={styles.searchIconWrapper}>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div style={styles.bookInfo}>
                <p style={styles.bookPublisher}>{book.publisher}</p>
                <h3 style={styles.bookTitleText}>{book.title}</h3>
            </div>
        </div>
    );
}

function LibrarySearchSection({ isMobile, isTablet }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const categories = [
        { id: 'arbitration', name: '«· ÕﬂÌ„' },
        { id: 'law', name: '«·ﬁ«‰Ê‰' },
        { id: 'contracts', name: '«·⁄ﬁÊœ' },
        { id: 'specifications', name: '«·„Ê«’›«  «·ﬁÌ«”Ì…' },
        { id: 'civil', name: '«·Â‰œ”… «·„œ‰Ì…' },
        { id: 'electrical', name: '«·Â‰œ”… «·ﬂÂ—»«∆Ì… Ê«·„Ìﬂ«‰ÌﬂÌ…' },
        { id: 'hydraulic', name: '«·Â‰œ”… «·ÂÌœ—Ê·ÌﬂÌ…' },
        { id: 'architecture', name: '«·Â‰œ”… «·„⁄„«—Ì…' },
        { id: 'roads', name: 'Â‰œ”… «·ÿ—ﬁ' },
        { id: 'sanitary', name: '«·Â‰œ”… «·’ÕÌ…' },
        { id: 'accounting', name: '«·„Õ«”»… Ê√⁄„«· «·„ﬂ« »' },
        { id: 'finance', name: '«·„«·Ì' },
        { id: 'economy', name: '«·«ﬁ ’«œ' }
    ];

    const booksDatabase = [
        {
            id: 1,
            category: 'arbitration',
            year: '2020',
            title: '«· ÕﬂÌ„ Ê«·Ê”«∆· «·»œÌ·… ·›÷ «·‰“«⁄« ',
            author: '⁄»«” «·⁄“Ì“ «·Êﬁ«‘Ì - „Õ„œ',
            authorExtra: '„«Ãœ Œ·Ê’Ì',
            image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop'
        },
        {
            id: 2,
            category: 'arbitration',
            year: '2020',
            title: '«· ÕﬂÌ„ ›Ì ⁄ﬁÊœ «·≈‰‘«¡« ',
            author: '⁄»«” «·⁄“Ì“ «·Êﬁ«‘Ì - „Õ„œ',
            authorExtra: '„«Ãœ Œ·Ê’Ì',
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'
        },
        {
            id: 3,
            category: 'arbitration',
            year: '2021',
            title: '«· ÕﬂÌ„ «·Â‰œ”Ì ›Ì ÷Ê¡ ﬁ«‰Ê‰ «· ÕﬂÌ„ «·”Ê—Ì „ﬁ«—‰… »ﬁ«‰Ê‰ «· ÕﬂÌ„ «·„’—Ì Ê‰Ÿ«„ «· ÕﬂÌ„ «·œÊ·Ì',
            author: '„Õ„œ „«Ãœ Œ·Ê’Ì - ”„Ì—',
            authorExtra: '⁄Ì”Ï Ã»Ê—',
            image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&h=400&fit=crop'
        },
        {
            id: 4,
            category: 'arbitration',
            year: '2020',
            title: '«· ÕﬂÌ„ ›Ì ÷Ê¡ ﬁ«‰Ê‰ «· ÕﬂÌ„ «·⁄„«‰Ì',
            author: '⁄»«” «·⁄“Ì“ «·Êﬁ«‘Ì - „Õ„œ',
            authorExtra: '„«Ãœ Œ·Ê’Ì',
            image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop'
        },
        {
            id: 5,
            category: 'arbitration',
            year: '2020',
            title: '«· ÕﬂÌ„ ›Ì ⁄ﬁÊœ «· Ã«—… Ê«·„ﬁ«Ê·« ',
            author: '⁄»«” «·⁄“Ì“ «·Êﬁ«‘Ì - „Õ„œ',
            authorExtra: '„«Ãœ Œ·Ê’Ì',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop'
        },
        {
            id: 6,
            category: 'law',
            year: '2019',
            title: '«·ﬁ«‰Ê‰ —ﬁ„ 182 ·”‰… 2018 »≈’œ«— ﬁ«‰Ê‰  ‰ŸÌ„ «· ⁄«„·«  «· Ì  ‰Â“Â« «·ÃÂ«  «·⁄«„…',
            author: 'Ã„ÂÊ—Ì… „’— «·⁄—»Ì…',
            image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=400&fit=crop'
        },
        {
            id: 7,
            category: 'law',
            year: '2019',
            title: '«··«∆Õ… «· ‰›Ì–Ì… ·ﬁ«‰Ê‰  ‰ŸÌ„ «· ⁄«ﬁœ«  «· Ì  »—„Â« «·ÃÂ«  «·⁄«„…',
            author: 'Ã„ÂÊ—Ì… „’— «·⁄—»Ì…',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'
        },
        {
            id: 8,
            category: 'specifications',
            year: '2017',
            title: '«·„Ê«’›«  «·ﬁÌ«”Ì… - «·ﬂÊœ «·„’—Ì',
            author: '«·„—ﬂ“ «·ﬁÊ„Ì ·»ÕÊÀ «·≈”ﬂ«‰',
            authorExtra: 'Ê«·»‰«¡',
            image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop'
        },
        {
            id: 9,
            category: 'contracts',
            year: '2017',
            title: 'Conditions of contract for construction',
            author: 'FIDIC',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=400&fit=crop'
        },
        {
            id: 10,
            category: 'contracts',
            year: '2017',
            title: 'Conditions of contract for EPC/turnkey projects',
            author: 'FIDIC',
            image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&h=400&fit=crop'
        }
    ];

    const getYearsForCategory = (categoryId) => {
        if (!categoryId) return [];
        const years = [...new Set(
            booksDatabase
                .filter(book => book.category === categoryId)
                .map(book => book.year)
        )];
        return years.sort((a, b) => b - a);
    };

    const handleSearch = () => {
        setHasSearched(true);
        let results = booksDatabase;

        if (selectedCategory) {
            results = results.filter(book => book.category === selectedCategory);
        }

        if (selectedYear) {
            results = results.filter(book => book.year === selectedYear);
        }

        if (searchText.trim()) {
            results = results.filter(book =>
                book.title.toLowerCase().includes(searchText.toLowerCase()) ||
                book.author.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredBooks(results);
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedYear('');
    };

    // Handle Enter key press in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const availableYears = getYearsForCategory(selectedCategory);

    const searchStyles = getSearchStyles(isMobile, isTablet);

    return (
        <div style={searchStyles.container}>
            <div style={searchStyles.searchSection}>
                <h2 style={searchStyles.sectionTitle}>»ÕÀ ›Ì «·„ﬂ »…</h2>

                <div style={searchStyles.searchForm}>
                    <div style={searchStyles.inputGroup}>
                        <input
                            type="text"
                            placeholder="«œŒ· ﬂ·„… «·»ÕÀ..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            style={searchStyles.searchInput}
                        />
                        <Search style={searchStyles.searchIcon} />
                    </div>

                    <div style={searchStyles.inputGroup}>
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            style={searchStyles.select}
                        >
                            <option value="">... «Œ «— «· ’‰Ì› ...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <Tag style={searchStyles.selectIcon} />
                    </div>

                    <div style={searchStyles.inputGroup}>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={searchStyles.select}
                            disabled={!selectedCategory}
                        >
                            <option value="">... «Œ «— «·”‰… ...</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <Calendar style={searchStyles.selectIcon} />
                    </div>

                    <button onClick={handleSearch} style={searchStyles.searchButton}>
                        »ÕÀ
                    </button>
                </div>

                {hasSearched && filteredBooks.length > 0 && (
                    <div style={searchStyles.resultsCount}>
                         „ «·⁄ÀÊ— ⁄·Ï {filteredBooks.length} ‰ ÌÃ…
                    </div>
                )}
            </div>

            {hasSearched && filteredBooks.length > 0 && (
                <div style={searchStyles.resultsGrid}>
                    {filteredBooks.map(book => (
                        <SearchBookResult key={book.id} book={book} />
                    ))}
                </div>
            )}

            {hasSearched && filteredBooks.length === 0 && (
                <div style={searchStyles.noResults}>
                    <p style={searchStyles.noResultsText}>·«  ÊÃœ ‰ «∆Ã ··»ÕÀ</p>
                    <p style={searchStyles.noResultsHint}>Ã—»  €ÌÌ— „⁄«ÌÌ— «·»ÕÀ</p>
                </div>
            )}


        </div>
    );
}

function SearchBookResult({ book }) {
    const [isHovered, setIsHovered] = useState(false);

    const getCategoryName = (categoryId) => {
        const categoryMap = {
            'arbitration': '«· ÕﬂÌ„',
            'law': '«·ﬁ«‰Ê‰',
            'contracts': '«·⁄ﬁÊœ',
            'specifications': '«·„Ê«’›«  «·ﬁÌ«”Ì…',
            'civil': '«·Â‰œ”… «·„œ‰Ì…',
            'electrical': '«·Â‰œ”… «·ﬂÂ—»«∆Ì… Ê«·„Ìﬂ«‰ÌﬂÌ…',
            'hydraulic': '«·Â‰œ”… «·ÂÌœ—Ê·ÌﬂÌ…',
            'architecture': '«·Â‰œ”… «·„⁄„«—Ì…',
            'roads': 'Â‰œ”… «·ÿ—ﬁ',
            'sanitary': '«·Â‰œ”… «·’ÕÌ…',
            'accounting': '«·„Õ«”»… Ê√⁄„«· «·„ﬂ« »',
            'finance': '«·„«·Ì',
            'economy': '«·«ﬁ ’«œ'
        };
        return categoryMap[categoryId] || '«·ﬂ »';
    };

    return (
        <div
            style={{
                ...searchResultStyles.bookCard,
                ...(isHovered ? searchResultStyles.bookCardHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={searchResultStyles.bookContent}>

                <div style={searchResultStyles.bookInfo}>
                    <h3 style={searchResultStyles.bookCategory}>
                        {getCategoryName(book.category)}
                    </h3>
                    <h4 style={searchResultStyles.bookTitle}>{book.title}</h4>
                    <p style={searchResultStyles.bookAuthor}>
                        «·„ƒ·›: <span style={searchResultStyles.authorName}>{book.author}</span>
                        {book.authorExtra && <span style={searchResultStyles.authorName}> - {book.authorExtra}</span>}
                    </p>
                    <p style={searchResultStyles.bookYear}>{book.year}</p>
                </div>
            </div>
        </div>
    );
}

function getResponsiveStyles(isMobile, isTablet) {
    return {
        page: styles.page,
        main: {
            ...styles.main,
            padding: isMobile ? '32px 16px' : isTablet ? '32px 16px' : '48px 32px'
        },
        titleSection: styles.titleSection,
        iconWrapper: {
            ...styles.iconWrapper,
            width: isMobile ? '64px' : '80px',
            height: isMobile ? '64px' : '80px'
        },
        iconWrapperSvg: {
            ...styles.iconWrapperSvg,
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px'
        },
        mainTitle: {
            ...styles.mainTitle,
            fontSize: isMobile ? '24px' : isTablet ? '28px' : '36px'
        },
        titleUnderline: styles.titleUnderline,
        descriptionCard: styles.descriptionCard,
        descriptionText: {
            ...styles.descriptionText,
            fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px'
        },
        imageContainer: styles.imageContainer,
        libraryImage: {
            ...styles.libraryImage,
            height: isMobile ? '250px' : isTablet ? '300px' : '384px'
        },
        featuresGrid: {
            ...styles.featuresGrid,
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(2, 1fr)'
        },
        footerNote: styles.footerNote,
        noteBadge: styles.noteBadge,
        noteText: styles.noteText,
        booksSection: styles.booksSection,
        booksTitle: {
            ...styles.booksTitle,
            fontSize: isMobile ? '22px' : isTablet ? '24px' : '32px'
        },
        booksGrid: {
            ...styles.booksGrid,
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
        }
    };
}

function getSearchStyles(isMobile, isTablet) {
    return {
        container: {
            marginTop: '80px',
            marginBottom: '40px'
        },
        searchSection: {
            background: 'white',
            borderRadius: '16px',
            padding: isMobile ? '24px' : '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '40px'
        },
        sectionTitle: {
            fontSize: isMobile ? '22px' : isTablet ? '24px' : '28px',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '32px',
            margin: '0 0 32px 0'
        },
        searchForm: {
            display: 'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(4, 1fr)',
            gap: '16px',
            alignItems: 'end'
        },
        inputGroup: {
            position: 'relative',
            width: '100%'
        },
        searchInput: {
            width: '100%',
            padding: '14px 45px 14px 16px',
            fontSize: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.3s ease',
            textAlign: 'right',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
        },
        searchIcon: {
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '20px',
            height: '20px',
            pointerEvents: 'none'
        },
        select: {
            width: '100%',
            padding: '14px 45px 14px 16px',
            fontSize: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.3s ease',
            textAlign: 'right',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontFamily: 'inherit',
            appearance: 'none',
            boxSizing: 'border-box'
        },
        selectIcon: {
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '20px',
            height: '20px',
            pointerEvents: 'none'
        },
        searchButton: {
            padding: '14px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            background: '#17a2b8',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
        },
        resultsCount: {
            marginTop: '24px',
            padding: '12px 20px',
            background: '#f0f9ff',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#0369a1',
            fontSize: '16px',
            fontWeight: '600'
        },
        resultsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '40px'
        },
        noResults: {
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            marginBottom: '40px'
        },
        noResultsText: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '12px',
            margin: '0 0 12px 0'
        },
        noResultsHint: {
            fontSize: '16px',
            color: '#9ca3af',
            margin: 0
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
        },
        paginationButton: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid #e5e7eb',
            background: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
        },
        activePage: {
            background: '#f97316',
            color: 'white',
            borderColor: '#f97316'
        }
    };
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #f8fafc 100%)',
        fontFamily: "'Cairo', 'Tajawal', 'Almarai', 'Arial', sans-serif",
        direction: 'rtl'
    },
    main: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 32px'
    },
    titleSection: {
        textAlign: 'center',
        marginBottom: '48px'
    },
    iconWrapper: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        background: '#2563eb',
        borderRadius: '50%',
        marginBottom: '24px',
        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
    },
    iconWrapperSvg: {
        width: '40px',
        height: '40px',
        color: 'white'
    },
    mainTitle: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '16px'
    },
    titleUnderline: {
        width: '96px',
        height: '4px',
        background: '#2563eb',
        margin: '0 auto',
        borderRadius: '9999px'
    },
    descriptionCard: {
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        marginBottom: '48px',
        borderTop: '4px solid #2563eb'
    },
    descriptionText: {
        fontSize: '20px',
        color: '#374151',
        lineHeight: '1.75',
        textAlign: 'right',
        margin: 0
    },
    imageContainer: {
        marginBottom: '48px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
    },
    libraryImage: {
        width: '100%',
        height: '384px',
        objectFit: 'cover',
        display: 'block'
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '32px',
        marginBottom: '48px'
    },
    featureCard: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        borderRight: '4px solid #2563eb',
        transition: 'all 0.3s ease'
    },
    featureContent: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
    },
    checkIconWrapper: {
        flexShrink: 0,
        marginTop: '4px'
    },
    checkIcon: {
        width: '32px',
        height: '32px',
        background: '#2563eb',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkIconSvg: {
        width: '20px',
        height: '20px',
        color: 'white'
    },
    featureText: {
        color: '#374151',
        fontSize: '18px',
        lineHeight: '1.75',
        textAlign: 'right',
        flex: 1,
        margin: 0
    },
    footerNote: {
        marginTop: '48px',
        textAlign: 'center'
    },
    noteBadge: {
        display: 'inline-block',
        background: '#dbeafe',
        borderRadius: '9999px',
        padding: '12px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    noteText: {
        color: '#1e40af',
        fontWeight: '600',
        margin: 0
    },
    booksSection: {
        marginTop: '80px',
        marginBottom: '48px'
    },
    booksTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: '48px'
    },
    booksGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px'
    },
    bookCard: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    bookCardHover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },
    bookImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease'
    },
    bookImageHover: {
        transform: 'scale(1.1)'
    },
    bookOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(37, 99, 235, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.3s ease'
    },
    bookOverlayVisible: {
        opacity: 1
    },
    searchIconWrapper: {
        color: 'white'
    },
    bookInfo: {
        padding: '24px'
    },
    bookPublisher: {
        color: '#f97316',
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '8px',
        textTransform: 'uppercase',
        margin: '0 0 8px 0'
    },
    bookTitleText: {
        color: '#111827',
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '1.5',
        margin: 0
    }
};

const searchResultStyles = {
    bookCard: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    },
    bookCardHover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    },
    bookContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    bookImageWrapper: {
        width: '100%',
        height: '250px',
        overflow: 'hidden'
    },
    bookImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    bookInfo: {
        padding: '20px'
    },
    bookCategory: {
        color: '#f97316',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: '8px',
        margin: '0 0 8px 0'
    },
    bookTitle: {
        color: '#111827',
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '1.4',
        marginBottom: '12px',
        minHeight: '44px',
        margin: '0 0 12px 0'
    },
    bookAuthor: {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '8px',
        textAlign: 'right',
        margin: '0 0 8px 0'
    },
    authorName: {
        color: '#374151',
        fontWeight: '500'
    },
    bookYear: {
        color: '#9ca3af',
        fontSize: '13px',
        fontWeight: '600',
        textAlign: 'right',
        margin: 0
    }
};