import React, { useState, useEffect, useRef } from 'react';
import './news.css';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [animate, setAnimate] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const scrollRef = useRef(null);

    const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

    useEffect(() => {
        setLoading(true);
        setError(null);
        setAnimate(false);
        setCurrentPage(1); // Reset to page 1 when the year changes

        fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews?year=${selectedYear}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch news');
                return response.json();
            })
            .then(data => {
                setNews(data.data || []);
                setLoading(false);
                setTimeout(() => setAnimate(true), 50);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [selectedYear]);

    // Logic for Pagination Calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(news.length / itemsPerPage);

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    return (
        <div className="news-page-container" style={{ paddingTop: '70px' }}>
            {/* Fixed Overview Bar */}
            <div className="fixed-overview-bar">
                <div className="fixed-overview-content">
                    <span>
                        <a href="/" className="fixed-overview-home-link">
                            الصفحة الرئيسية
                        </a>
                        <span className="fixed-overview-separator">-</span>
                        <span className="fixed-overview-current">الأخبار</span>
                    </span>
                </div>
            </div>

            {/* Year Filter Slider */}
            <div className="year-filter-container">
                <div
                    className="year-scroll-arrow"
                    onClick={() => handleScroll('right')}
                    role="button"
                    aria-label="التمرير إلى اليمين"
                >
                    «
                </div>

                <div ref={scrollRef} className="year-scroller">
                    <div className="year-items-container">
                        {years.map((year) => (
                            <div
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className="year-item"
                                role="button"
                                aria-label={`اختر سنة ${year}`}
                                aria-pressed={selectedYear === year}
                            >
                                <span className={selectedYear === year ? 'year-text year-text-active' : 'year-text'}>
                                    {year}
                                </span>
                                {selectedYear === year && (
                                    <div className="year-item-highlight" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="year-scroll-arrow"
                    onClick={() => handleScroll('left')}
                    role="button"
                    aria-label="التمرير إلى اليسار"
                >
                    »
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
                        <div className="news-empty-message" style={{ color: '#f57c00' }}>
                            حدث خطأ في تحميل الأخبار: {error}
                        </div>
                    )}

                    {!loading && !error && currentNews.length > 0 ? (
                        currentNews.map(item => (
                            <div key={item.id} className="news-card-item">
                                <div className="news-card-inner">
                                    <div className="news-date-badge">
                                        {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <a href={`/news/${item.id}`} className="news-image-wrapper">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="news-image"
                                            loading="lazy"
                                        />
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

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="pagination-wrapper">
                    <div className="pagination-container">
                        {/* Previous Button */}
                        <button
                            className={`pagination-arrow ${currentPage === 1 ? 'pagination-arrow-disabled' : ''}`}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-label="الصفحة السابقة"
                        >
                            ‹
                        </button>

                        {/* Page Numbers */}
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`pagination-dot ${currentPage === index + 1 ? 'pagination-dot-active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                                aria-label={`الصفحة ${index + 1}`}
                                aria-current={currentPage === index + 1 ? 'page' : undefined}
                            >
                                {index + 1}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            className={`pagination-arrow ${currentPage === totalPages ? 'pagination-arrow-disabled' : ''}`}
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="الصفحة التالية"
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