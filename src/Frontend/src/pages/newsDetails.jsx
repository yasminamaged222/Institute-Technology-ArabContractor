import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './newsDetails.css';

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fetch news details
        setLoading(true);
        fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/news/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch news details');
                return response.json();
            })
            .then(data => {
                setNewsItem(data);
                setLoading(false);
                
                // Fetch related news from the same year
                const year = new Date(data.publishedAt).getFullYear();
                return fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews?year=${year}`);
            })
            .then(response => response.json())
            .then(data => {
                // Filter out current news and take 3 random related news
                const filtered = (data.data || []).filter(item => item.id !== parseInt(id));
                const shuffled = filtered.sort(() => 0.5 - Math.random());
                setRelatedNews(shuffled.slice(0, 3));
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="news-details-container" style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p style={{ marginTop: '20px', color: '#f57c00', fontSize: '1.1rem' }}>جارٍ تحميل التفاصيل...</p>
                </div>
            </div>
        );
    }

    if (error || !newsItem) {
        return (
            <div className="news-details-container" style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <p style={{ color: '#e74c3c', fontSize: '1.2rem', marginBottom: '20px' }}>حدث خطأ في تحميل الخبر</p>
                <button onClick={() => navigate('/news')} className="back-button">العودة للأخبار</button>
            </div>
        );
    }

    const formattedDate = new Date(newsItem.publishedAt).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="news-details-container" style={{ paddingTop: '70px', backgroundColor: '#fff', direction: 'rtl' }}>
            
            {/* Breadcrumb */}
            <div className="breadcrumb-section" style={{ background: '#F5F7E1', padding: '15px 5%', borderBottom: '2px solid #eee' }}>
                <span style={{ fontSize: '0.95rem' }}>
                    <a href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>الصفحة الرئيسية</a>
                    {' '}-{' '}
                    <a href="/news" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>الأخبار</a>
                    {' '}-{' '}
                    <span style={{ color: '#f57c00' }}>تفاصيل الخبر</span>
                </span>
            </div>

            {/* Hero Section with Image */}
            <div className="hero-section" style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
                <div className="hero-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                    zIndex: 1
                }}></div>
                <img 
                    src={newsItem.imageUrl} 
                    alt={newsItem.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        animation: 'zoomIn 0.8s ease-out'
                    }}
                />
                <div className="hero-content" style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '5%',
                    left: '5%',
                    zIndex: 2,
                    color: '#fff'
                }}>
                    <div className="date-badge" style={{
                        display: 'inline-block',
                        background: '#f57c00',
                        padding: '8px 20px',
                        borderRadius: '25px',
                        fontSize: '0.9rem',
                        marginBottom: '15px',
                        fontWeight: 'bold'
                    }}>
                        {formattedDate}
                    </div>
                    <h1 className="news-title" style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        margin: 0,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        lineHeight: '1.3',
                        animation: 'slideUp 0.6s ease-out'
                    }}>
                        {newsItem.title}
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="content-wrapper" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="news-content" style={{
                    fontSize: '1.15rem',
                    lineHeight: '2',
                    color: '#333',
                    textAlign: 'justify',
                    animation: 'fadeIn 0.8s ease-out',
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                    {newsItem.content ? (
                        <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
                    ) : (
                        <p>{newsItem.description || 'لا يوجد محتوى متاح لهذا الخبر.'}</p>
                    )}
                </div>

                {/* Share Section */}
                <div className="share-section" style={{
                    marginTop: '50px',
                    padding: '30px',
                    background: '#F5F7E1',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>شارك هذا الخبر:</span>
                        <button className="share-btn" style={{ background: '#1877f2', color: '#fff' }}>
                            Facebook
                        </button>
                        <button className="share-btn" style={{ background: '#1da1f2', color: '#fff' }}>
                            Twitter
                        </button>
                        <button className="share-btn" style={{ background: '#25d366', color: '#fff' }}>
                            WhatsApp
                        </button>
                    </div>
                    <button onClick={() => navigate('/news')} className="back-button-secondary">
                        العودة إلى الأخبار
                    </button>
                </div>
            </div>

            {/* Related News Section */}
            {relatedNews.length > 0 && (
                <div className="related-news-section" style={{
                    background: '#f9f9f9',
                    padding: '60px 5%',
                    borderTop: '3px solid #f57c00'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '40px',
                            color: '#333',
                            textAlign: 'center',
                            position: 'relative',
                            paddingBottom: '15px'
                        }}>
                            أخبار ذات صلة
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                right: '50%',
                                transform: 'translateX(50%)',
                                width: '80px',
                                height: '3px',
                                background: '#f57c00'
                            }}></div>
                        </h2>
                        
                        <div className="related-news-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '30px'
                        }}>
                            {relatedNews.map(item => (
                                <div 
                                    key={item.id} 
                                    className="related-news-card"
                                    onClick={() => navigate(`/news/${item.id}`)}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                                    }}
                                >
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />
                                    </div>
                                    <div style={{ padding: '20px' }}>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#f57c00',
                                            marginBottom: '10px',
                                            fontWeight: 'bold'
                                        }}>
                                            {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            lineHeight: '1.5',
                                            margin: 0
                                        }}>
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes zoomIn {
                    from {
                        transform: scale(1.1);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f5f5f5;
                    border-top: 4px solid #f57c00;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .share-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: opacity 0.3s ease;
                }

                .share-btn:hover {
                    opacity: 0.8;
                }

                .back-button, .back-button-secondary {
                    padding: 12px 30px;
                    background: #f57c00;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .back-button:hover, .back-button-secondary:hover {
                    background: #e06900;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(245, 124, 0, 0.3);
                }

                .related-news-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
                }

                .related-news-card:hover img {
                    transform: scale(1.05);
                }

                @media (max-width: 768px) {
                    .hero-section {
                        height: 350px !important;
                    }

                    .news-title {
                        font-size: 1.8rem !important;
                    }

                    .news-content {
                        padding: 25px !important;
                        font-size: 1rem !important;
                    }

                    .share-section {
                        flex-direction: column;
                        align-items: flex-start !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default NewsDetails;