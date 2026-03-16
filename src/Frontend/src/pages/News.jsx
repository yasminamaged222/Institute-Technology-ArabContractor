import React, { useState, useEffect, useRef } from 'react';
import './news.css';

const IMAGES_BASE = 'https://www.arabcont.com/icemt/assets/jmages/news/';

const getImageUrl = (raw) => {
    if (!raw) return '';
    return raw.startsWith('http') ? raw : `${IMAGES_BASE}${raw}`;
};

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [animate, setAnimate] = useState(false);

    // --- Pagination State (now server-driven) ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const scrollRef = useRef(null);

    const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

    useEffect(() => {
        document.title = ' الاخبار - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    // --- Fetch runs whenever year OR currentPage changes ---
    useEffect(() => {
        setLoading(true);
        setError(null);
        setAnimate(false);

        fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews?year=${selectedYear}&pageIndex=${currentPage}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch news');
                return response.json();
            })
            .then(data => {
                // Normalise image URLs for every item
                const items = (data.data || []).map(item => ({
                    ...item,
                    imageUrl: getImageUrl(item.imageUrl),
                }));
                setNews(items);
                setTotalPages(data.totalPages || 0);
                setLoading(false);
                setTimeout(() => setAnimate(true), 50);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [selectedYear, currentPage]);

    // --- Reset page to 1 whenever the year changes ---
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedYear]);

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth / 2;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="news-page-container">

            {/* Breadcrumb */}
            <div className="overview_intro" style={{ position: 'relative', bottom: '50px', background: '#F5F7E1', width: '100%', zIndex: '10', padding: '5px 10px', borderBottom: '2px solid #eee', bottom: 70 }}>
                <span className="overview"><a href="/" className="btn_go_home" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>الصفحة الرئيسية</a> - الأخبار</span>
            </div>

            {/* Year Slider */}
            <div className="year-slider-container">
                <div className="year-slider-box">
                    <div onClick={() => handleScroll('right')} className="year-scroll-arrow">«</div>
                    <div ref={scrollRef} className="timeline-scroller">
                        <div className="year-items-wrapper">
                            {years.map((year) => (
                                <div
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className="year-item"
                                >
                                    <span className={selectedYear === year ? 'year-text year-text-active' : 'year-text'}>
                                        {year}
                                    </span>
                                    {selectedYear === year && <div className="year-item-highlight" />}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div onClick={() => handleScroll('left')} className="year-scroll-arrow">»</div>
                </div>
            </div>

            {/* News Grid */}
            <div className="news-content-wrapper">
                <div className={`news-cards-grid ${animate ? 'active' : ''} news-fade-in`}>

                    {loading && (
                        <div className="news-loading-message">
                            جارٍ تحميل الأخبار...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="news-error-message">
                            حدث خطأ في تحميل الأخبار
                        </div>
                    )}

                    {!loading && !error && news.length > 0 ? (
                        news.map(item => (
                            <div key={item.id} className="news-card-item news-card-hover">
                                <div className="news-card-inner">
                                    <div className="news-date-badge">
                                        {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <a href={`/news/${item.id}`} className="news-image-wrapper">
                                        <img src={item.imageUrl} alt={item.title} className="news-image" />
                                    </a>
                                    <div className="news-title-wrapper">
                                        <a href={`/news/${item.id}`} className="news-title-link">
                                            {item.title}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && !error && (
                            <div className="news-empty-message">
                                لا توجد أخبار لعام {selectedYear}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Dynamic Pagination Bar */}
            {!loading && totalPages > 1 && (
                <div className="pagination-wrapper">
                    <div className="pagination-container">
                        <button
                            className={`pagination-arrow ${currentPage === 1 ? 'pagination-arrow-disabled' : ''}`}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            ‹
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`pagination-dot ${currentPage === index + 1 ? 'pagination-dot-active' : ''}`}
                                onClick={() => {
                                    setCurrentPage(index + 1);
                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className={`pagination-arrow ${currentPage === totalPages ? 'pagination-arrow-disabled' : ''}`}
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default News;