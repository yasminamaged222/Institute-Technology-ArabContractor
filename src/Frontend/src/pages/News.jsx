import React, { useState, useEffect, useRef } from 'react';
import './news.css';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [animate, setAnimate] = useState(false);

    // --- Pagination State ---
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

    // --- Logic for Pagination Calculation ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(news.length / itemsPerPage);

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="news-page-container" style={{ paddingTop: '70px', backgroundColor: '#fff', direction: 'rtl' }}>

            <style>{`
        .timeline-scroller::-webkit-scrollbar { display: none; }
        .timeline-scroller { -ms-overflow-style: none; scrollbar-width: none; }
        
        .news-fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .news-fade-in.active {
          opacity: 1;
          transform: translateY(0);
        }

        .news-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }
        .news-card-hover:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }

        .pagination-dot {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #fff;
          margin: 0 5px;
          cursor: pointer;
          transition: 0.3s;
        }
        .pagination-dot-active {
          background: #f57c00 !important;
          color: #fff !important;
          border-color: #f57c00 !important;
        }
      `}</style>

            {/* Breadcrumb */}
            <div className="overview_intro" style={{ position: 'sticky', top: '70px', background: '#F5F7E1', width: '100%', zIndex: '10', padding: '10px 20px', borderBottom: '1px solid #eee' }}>
                <span className="overview"><a href="/" className="btn_go_home" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>الصفحة الرئيسية</a> - الأخبار</span>
            </div>

            {/* 4-Year Slider */}
            <div style={{ padding: '20px 5%' }}>
                <div style={{ background: '#f5f5f5', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', height: '42px', overflow: 'hidden' }}>
                    <div onClick={() => handleScroll('right')} style={arrowStyle}>«</div>
                    <div ref={scrollRef} className="timeline-scroller" style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', flexGrow: 1, height: '100%', scrollBehavior: 'smooth' }}>
                        <div style={{ display: 'flex', width: '50%' }}>
                            {years.map((year) => (
                                <div key={year} onClick={() => setSelectedYear(year)} style={{ minWidth: '25%', height: '42px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', position: 'relative', flexShrink: 0, borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
                                    <span style={{ fontSize: selectedYear === year ? '1rem' : '0.85rem', fontWeight: selectedYear === year ? 'bold' : 'normal', color: selectedYear === year ? '#f57c00' : '#333' }}>{year}</span>
                                    {selectedYear === year && (
                                        <div style={{ position: 'absolute', height: '100%', width: '100%', borderLeft: '2.5px solid #f57c00', borderRight: '2.5px solid #f57c00', backgroundColor: 'rgba(245, 124, 0, 0.05)', pointerEvents: 'none' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div onClick={() => handleScroll('left')} style={arrowStyle}>»</div>
                </div>
            </div>

            {/* News Grid (Showing only 9 items) */}
            <div className="news-content-wrapper" style={{ padding: '0 5% 50px' }}>
                <div className={`news-cards-grid ${animate ? 'active' : ''} news-fade-in`}>

                    {loading && <p style={{ textAlign: 'center', width: '100%', padding: '50px', color: '#f57c00' }}>جارٍ تحميل الأخبار...</p>}

                    {!loading && !error && currentNews.length > 0 ? (
                        currentNews.map(item => (
                            <div key={item.id} className="news-card-item news-card-hover">
                                <div className="news-card-inner">
                                    <div className="news-date-badge">
                                        {new Date(item.publishedAt).toLocaleDateString('ar-EG', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                    <a href={`/news/${item.id}`} className="news-image-wrapper">
                                        <img src={item.imageUrl} alt={item.title} className="news-image" />
                                    </a>
                                    <div className="news-title-wrapper">
                                        <a href={`/news/${item.id}`} className="news-title-link">{item.title}</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && !error && <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>لا توجد أخبار لعام {selectedYear}</div>
                    )}
                </div>
            </div>

            {/* Dynamic Pagination Bar */}
            {!loading && totalPages > 1 && (
                <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '50px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            className="pagination-dot"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            ‹
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`pagination-dot ${currentPage === index + 1 ? 'pagination-dot-active' : ''}`}
                                onClick={() => {
                                    setCurrentPage(index + 1);
                                    window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll up to see new results
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="pagination-dot"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const arrowStyle = {
    padding: '0 15px', color: '#f57c00', fontWeight: 'bold', cursor: 'pointer',
    zIndex: 10, fontSize: '1.5rem', userSelect: 'none', background: '#f5f5f5'
};

export default News;