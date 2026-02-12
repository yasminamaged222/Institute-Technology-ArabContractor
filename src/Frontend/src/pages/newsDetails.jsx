// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './newsDetails.css';

// const NewsDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [newsItem, setNewsItem] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [relatedNews, setRelatedNews] = useState([]);
//     const [showImageModal, setShowImageModal] = useState(false);

//     useEffect(() => {
//         document.title = ' تفاصيل الخبر - المعهد التكنولوجي لهندسة التشييد والإدارة';
//     }, []);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });

//         setLoading(true);
//         fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/news/${id}`)
//             .then(response => {
//                 if (!response.ok) throw new Error('Failed to fetch news details');
//                 return response.json();
//             })
//             .then(data => {
//                 setNewsItem(data);
//                 setLoading(false);

//                 const year = new Date(data.publishedAt).getFullYear();
//                 return fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews?year=${year}`);
//             })
//             .then(response => response.json())
//             .then(data => {
//                 const filtered = (data.data || []).filter(item => item.id !== parseInt(id));
//                 const shuffled = filtered.sort(() => 0.5 - Math.random());
//                 setRelatedNews(shuffled.slice(0, 3));
//             })
//             .catch(err => {
//                 setError(err.message);
//                 setLoading(false);
//             });
//     }, [id]);

//     const handleShareClick = (platform) => {
//         const url = window.location.href;
//         const text = newsItem.title;

//         switch (platform) {
//             case 'facebook':
//                 window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
//                 break;
//             case 'twitter':
//                 window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
//                 break;
//             case 'whatsapp':
//                 window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
//                 break;
//             default:
//                 break;
//         }
//     };

//     if (loading) {
//         return (
//             <div className="news-details-container" style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <div className="loading-spinner">
//                     <div className="spinner"></div>
//                     <p style={{ marginTop: '20px', color: '#0865a8', fontSize: '1.1rem', fontFamily: '"Droid Arabic Kufi", serif' }}>جارٍ تحميل التفاصيل...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !newsItem) {
//         return (
//             <div className="news-details-container" style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
//                 <p style={{ color: '#e74c3c', fontSize: '1.2rem', marginBottom: '20px', fontFamily: '"Droid Arabic Kufi", serif' }}>حدث خطأ في تحميل الخبر</p>
//                 <button onClick={() => navigate('/news')} className="back-button">العودة للأخبار</button>
//             </div>
//         );
//     }

//     const formattedDate = new Date(newsItem.publishedAt).toLocaleDateString('ar-EG', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });

//     return (
//         <div className="news-details-container" style={{ paddingTop: '70px', backgroundColor: '#fff', direction: 'rtl', fontFamily: '"Droid Arabic Kufi", serif' }}>

//             {/* Fixed Overview Bar */}
//             <div className="top-100 fixed left-0 z-50 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2" style={{
//                 top: '70px',
//                 position: 'fixed',
//                 left: 0,
//                 zIndex: 50,
//                 width: '100%',
//                 borderBottom: '1px solid #d1d5db',
//                 background: '#F5F7E1',
//                 padding: '0.5rem 1.25rem',
//                 fontFamily: '"Droid Arabic Kufi", serif'
//             }}>
//                 <div style={{ textAlign: 'center' }}>
//                     <span style={{ fontSize: '1rem' }}>
//                         <a href="/" style={{ marginLeft: '0.75rem', color: '#374151', textDecoration: 'none', transition: 'color 0.3s', fontWeight: 'bold' }}
//                             onMouseEnter={(e) => e.target.style.color = '#111827'}
//                             onMouseLeave={(e) => e.target.style.color = '#374151'}>
//                             الصفحة الرئيسية
//                         </a>
//                         <span style={{ color: '#6b7280' }}> - </span>
//                         <a href="/news" style={{ marginLeft: '0.75rem', marginRight: '0.75rem', color: '#374151', textDecoration: 'none', transition: 'color 0.3s', fontWeight: 'bold' }}
//                             onMouseEnter={(e) => e.target.style.color = '#111827'}
//                             onMouseLeave={(e) => e.target.style.color = '#374151'}>
//                             الأخبار
//                         </a>
//                         <span style={{ color: '#6b7280' }}> - </span>
//                         <span style={{ marginRight: '0.75rem', color: '#374151', fontWeight: 'bold' }}>تفاصيل الخبر</span>
//                     </span>
//                 </div>
//             </div>

//             {/* Hero Section with Image */}
//             <div className="hero-section" style={{ position: 'relative', height: '500px', overflow: 'hidden', marginTop: '50px', cursor: 'pointer' }}
//                 onClick={() => setShowImageModal(true)}>
//                 <div className="hero-overlay" style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
//                     zIndex: 1
//                 }}></div>
//                 <img
//                     src={newsItem.imageUrl}
//                     alt={newsItem.title}
//                     style={{
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'contain',
//                         objectPosition: 'center',
//                         animation: 'zoomIn 0.8s ease-out',
//                         backgroundColor: '#000'
//                     }}
//                 />
//                 <div className="zoom-icon" style={{
//                     position: 'absolute',
//                     top: '20px',
//                     left: '20px',
//                     zIndex: 2,
//                     background: 'rgba(0,0,0,0.6)',
//                     color: '#fff',
//                     padding: '10px 15px',
//                     borderRadius: '5px',
//                     fontSize: '0.9rem',
//                     fontFamily: '"Droid Arabic Kufi", serif'
//                 }}>
//                     🔍 اضغط للتكبير
//                 </div>
//                 <div className="hero-content" style={{
//                     position: 'absolute',
//                     bottom: '40px',
//                     right: '5%',
//                     left: '5%',
//                     zIndex: 2,
//                     color: '#fff'
//                 }}>
//                     <div className="date-badge" style={{
//                         display: 'inline-block',
//                         background: '#f57c00',
//                         padding: '8px 20px',
//                         borderRadius: '25px',
//                         fontSize: '0.9rem',
//                         marginBottom: '15px',
//                         fontWeight: 'bold',
//                         fontFamily: '"Droid Arabic Kufi", serif'
//                     }}>
//                         {formattedDate}
//                     </div>
//                     <h1 className="news-title" style={{
//                         fontSize: '2.5rem',
//                         fontWeight: 'bold',
//                         margin: 0,
//                         textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
//                         lineHeight: '1.3',
//                         animation: 'slideUp 0.6s ease-out',
//                         fontFamily: '"Droid Arabic Kufi", serif'
//                     }}>
//                         {newsItem.title}
//                     </h1>
//                 </div>
//             </div>

//             {/* Content Section - Now full width + closer to hero */}
//             <div className="content-wrapper" style={{ padding: '20px 0 60px', maxWidth: '100%', margin: '0 auto' }}>  {/* ← Changed padding & maxWidth */}

//                 <div className="news-content" style={{
//                     fontSize: '1.15rem',
//                     lineHeight: '2',
//                     color: '#000',
//                     textAlign: 'justify',
//                     animation: 'fadeIn 0.8s ease-out',
//                     background: '#fff',
//                     padding: '40px',
//                     borderRadius: '0',  // ← Removed border radius so it looks full-width clean
//                     boxShadow: 'none',  // ← Removed shadow for full-width look
//                     fontFamily: '"Droid Arabic Kufi", serif'
//                 }}>
//                     {newsItem.details ? (
//                         <div dangerouslySetInnerHTML={{ __html: newsItem.details }} />
//                     ) : (
//                         <p>{newsItem.description || 'لا يوجد محتوى متاح لهذا الخبر.'}</p>
//                     )}
//                 </div>

//             </div>

//             {/* Share Section */}
//             <div className="content-wrapper" style={{ padding: '0 5% 60px', maxWidth: '1200px', margin: '0 auto' }}>
//                 <div className="share-section" style={{
//                     marginTop: '30px',
//                     padding: '30px',
//                     background: '#F5F7E1',
//                     borderRadius: '10px',
//                     display: 'flex',
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     gap: '20px',
//                     justifyContent: 'center',
//                     flexWrap: 'wrap'
//                 }}>
//                     <span style={{
//                         fontSize: '1.2rem',
//                         fontWeight: 'bold',
//                         color: '#000',
//                         fontFamily: '"Droid Arabic Kufi", serif',
//                         marginBottom: '10px'
//                     }}>
//                         شارك هذا الخبر:
//                     </span>
//                     <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
//                         <button
//                             onClick={() => handleShareClick('facebook')}
//                             className="share-btn"
//                             style={{
//                                 background: '#1877f2',
//                                 color: '#fff',
//                                 fontFamily: '"Droid Arabic Kufi", serif',
//                                 padding: '12px 30px',
//                                 border: 'none',
//                                 borderRadius: '8px',
//                                 cursor: 'pointer',
//                                 fontWeight: 'bold',
//                                 fontSize: '1rem',
//                                 transition: 'all 0.3s ease',
//                                 minWidth: '150px'
//                             }}>
//                             Facebook
//                         </button>
//                         <button
//                             onClick={() => handleShareClick('whatsapp')}
//                             className="share-btn"
//                             style={{
//                                 background: '#25d366',
//                                 color: '#fff',
//                                 fontFamily: '"Droid Arabic Kufi", serif',
//                                 padding: '12px 30px',
//                                 border: 'none',
//                                 borderRadius: '8px',
//                                 cursor: 'pointer',
//                                 fontWeight: 'bold',
//                                 fontSize: '1rem',
//                                 transition: 'all 0.3s ease',
//                                 minWidth: '150px'
//                             }}>
//                             WhatsApp
//                         </button>
//                         <button
//                             onClick={() => handleShareClick('twitter')}
//                             className="share-btn"
//                             style={{
//                                 background: '#1da1f2',
//                                 color: '#fff',
//                                 fontFamily: '"Droid Arabic Kufi", serif',
//                                 padding: '12px 30px',
//                                 border: 'none',
//                                 borderRadius: '8px',
//                                 cursor: 'pointer',
//                                 fontWeight: 'bold',
//                                 fontSize: '1rem',
//                                 transition: 'all 0.3s ease',
//                                 minWidth: '150px'
//                             }}>
//                             Twitter
//                         </button>
//                     </div>
//                     <button
//                         onClick={() => navigate('/news')}
//                         className="back-button-secondary"
//                         style={{
//                             padding: '12px 40px',
//                             background: '#0865a8',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '8px',
//                             cursor: 'pointer',
//                             fontWeight: 'bold',
//                             fontSize: '1rem',
//                             fontFamily: '"Droid Arabic Kufi", serif',
//                             marginTop: '10px',
//                             minWidth: '200px'
//                         }}>
//                         العودة إلى الأخبار
//                     </button>
//                 </div>
//             </div>

//             {/* Related News Section */}
//             {relatedNews.length > 0 && (
//                 <div className="related-news-section" style={{
//                     background: '#f9f9f9',
//                     padding: '60px 5%',
//                     borderTop: '3px solid #f57c00'
//                 }}>
//                     <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//                         <h2 style={{
//                             fontSize: '2rem',
//                             fontWeight: 'bold',
//                             marginBottom: '40px',
//                             color: '#000',
//                             textAlign: 'center',
//                             position: 'relative',
//                             paddingBottom: '15px',
//                             fontFamily: '"Droid Arabic Kufi", serif'
//                         }}>
//                             أخبار ذات صلة
//                             <div style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: '50%',
//                                 transform: 'translateX(50%)',
//                                 width: '80px',
//                                 height: '3px',
//                                 background: '#0865a8'
//                             }}></div>
//                         </h2>
//                         <div className="related-news-grid" style={{
//                             display: 'grid',
//                             gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//                             gap: '30px'
//                         }}>
//                             {relatedNews.map(item => (
//                                 <div
//                                     key={item.id}
//                                     className="related-news-card"
//                                     onClick={() => navigate(`/news/${item.id}`)}
//                                     style={{
//                                         background: '#fff',
//                                         borderRadius: '10px',
//                                         overflow: 'hidden',
//                                         cursor: 'pointer',
//                                         transition: 'all 0.3s ease',
//                                         boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
//                                         border: '2px solid transparent'
//                                     }}
//                                     onMouseEnter={(e) => {
//                                         e.currentTarget.style.borderColor = '#0865a8';
//                                         e.currentTarget.style.transform = 'translateY(-5px)';
//                                         e.currentTarget.style.boxShadow = '0 8px 20px rgba(8, 101, 168, 0.2)';
//                                     }}
//                                     onMouseLeave={(e) => {
//                                         e.currentTarget.style.borderColor = 'transparent';
//                                         e.currentTarget.style.transform = 'translateY(0)';
//                                         e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
//                                     }}
//                                 >
//                                     <div style={{ height: '200px', overflow: 'hidden' }}>
//                                         <img
//                                             src={item.imageUrl}
//                                             alt={item.title}
//                                             style={{
//                                                 width: '100%',
//                                                 height: '100%',
//                                                 objectFit: 'cover',
//                                                 transition: 'transform 0.3s ease'
//                                             }}
//                                         />
//                                     </div>
//                                     <div style={{ padding: '20px' }}>
//                                         <div style={{
//                                             fontSize: '0.85rem',
//                                             color: '#f57c00',
//                                             marginBottom: '10px',
//                                             fontWeight: 'bold',
//                                             fontFamily: '"Droid Arabic Kufi", serif'
//                                         }}>
//                                             {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
//                                                 year: 'numeric',
//                                                 month: 'long',
//                                                 day: 'numeric'
//                                             })}
//                                         </div>
//                                         <h3 style={{
//                                             fontSize: '1.1rem',
//                                             fontWeight: 'bold',
//                                             color: '#000',
//                                             lineHeight: '1.5',
//                                             margin: 0,
//                                             fontFamily: '"Droid Arabic Kufi", serif'
//                                         }}>
//                                             {item.title}
//                                         </h3>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Image Modal */}
//             {showImageModal && (
//                 <div
//                     className="image-modal"
//                     onClick={() => setShowImageModal(false)}
//                     style={{
//                         position: 'fixed',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         backgroundColor: 'rgba(0, 0, 0, 0.9)',
//                         zIndex: 9999,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         padding: '20px',
//                         animation: 'fadeIn 0.3s ease-out'
//                     }}
//                 >
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             setShowImageModal(false);
//                         }}
//                         style={{
//                             position: 'absolute',
//                             top: '20px',
//                             left: '20px',
//                             background: '#fff',
//                             border: 'none',
//                             borderRadius: '50%',
//                             width: '40px',
//                             height: '40px',
//                             fontSize: '24px',
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
//                             zIndex: 10000
//                         }}
//                     >
//                         ×
//                     </button>
//                     <img
//                         src={newsItem.imageUrl}
//                         alt={newsItem.title}
//                         style={{
//                             maxWidth: '90%',
//                             maxHeight: '90%',
//                             objectFit: 'contain',
//                             borderRadius: '10px',
//                             boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                     />
//                 </div>
//             )}

//             <style>{`
//                 @keyframes zoomIn {
//                     from { transform: scale(1.1); opacity: 0; }
//                     to   { transform: scale(1); opacity: 1; }
//                 }
//                 @keyframes slideUp {
//                     from { transform: translateY(30px); opacity: 0; }
//                     to   { transform: translateY(0); opacity: 1; }
//                 }
//                 @keyframes fadeIn {
//                     from { opacity: 0; }
//                     to   { opacity: 1; }
//                 }
//                 .spinner {
//                     width: 50px;
//                     height: 50px;
//                     border: 4px solid #f5f5f5;
//                     border-top: 4px solid #0865a8;
//                     border-radius: 50%;
//                     animation: spin 1s linear infinite;
//                 }
//                 @keyframes spin {
//                     0%   { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                 }
//                 .share-btn:hover {
//                     opacity: 0.85;
//                     transform: translateY(-2px);
//                     box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//                 }
//                 .back-button-secondary:hover {
//                     background: #065280 !important;
//                     transform: translateY(-2px);
//                     box-shadow: 0 4px 8px rgba(8, 101, 168, 0.3);
//                 }
//                 .related-news-card:hover img {
//                     transform: scale(1.05);
//                 }
//                 .hero-section:hover .zoom-icon {
//                     background: rgba(8, 101, 168, 0.8);
//                 }
//                 /* Tablet Styles */
//                 @media (max-width: 992px) {
//                     .hero-section { height: 400px !important; margin-top: 50px !important; }
//                     .news-title { font-size: 2rem !important; }
//                     .news-content { padding: 30px !important; font-size: 1.05rem !important; }
//                 }
//                 /* Mobile Styles */
//                 @media (max-width: 768px) {
//                     .news-details-container { padding-top: 70px !important; }
//                     .hero-section { height: 350px !important; margin-top: 45px !important; }
//                     .hero-content { bottom: 20px !important; right: 3% !important; left: 3% !important; }
//                     .date-badge { font-size: 0.75rem !important; padding: 6px 15px !important; }
//                     .news-title { font-size: 1.5rem !important; }
//                     .news-content { padding: 20px !important; font-size: 1rem !important; }
//                     .share-section { padding: 20px !important; flex-direction: column !important; }
//                     .share-btn { width: 100%; min-width: auto !important; }
//                     .back-button-secondary { width: 100%; min-width: auto !important; }
//                     .related-news-section { padding: 40px 3% !important; }
//                     .related-news-section h2 { font-size: 1.5rem !important; margin-bottom: 30px !important; }
//                     .related-news-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
//                     .zoom-icon { top: 10px !important; left: 10px !important; padding: 6px 10px !important; font-size: 0.75rem !important; }
//                 }
//                 /* Small Mobile Styles */
//                 @media (max-width: 480px) {
//                     .hero-section { height: 280px !important; }
//                     .news-title { font-size: 1.3rem !important; }
//                     .news-content { font-size: 0.95rem !important; line-height: 1.8 !important; padding: 20px !important; }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default NewsDetails;


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
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setLoading(true);
        fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/news/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch news details');
                return response.json();
            })
            .then(data => {
                setNewsItem(data);
                setLoading(false);

                const year = new Date(data.publishedAt).getFullYear();
                return fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews?year=${year}`);
            })
            .then(response => response.json())
            .then(data => {
                const filtered = (data.data || []).filter(item => item.id !== parseInt(id));
                const shuffled = filtered.sort(() => 0.5 - Math.random());
                setRelatedNews(shuffled.slice(0, 3));
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    // Set dynamic page title based on news item
    useEffect(() => {
        if (newsItem && newsItem.title) {
            document.title = `${newsItem.title} - المعهد التكنولوجي لهندسة التشييد والإدارة`;
        } else {
            document.title = 'تفاصيل الخبر - المعهد التكنولوجي لهندسة التشييد والإدارة';
        }
    }, [newsItem]);

    const handleShareClick = (platform) => {
        const url = window.location.href;
        const text = newsItem.title;

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div className="news-details-container" style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p style={{ marginTop: '20px', color: '#0865a8', fontSize: '1.1rem', fontFamily: '"Droid Arabic Kufi", serif' }}>جارٍ تحميل التفاصيل...</p>
                </div>
            </div>
        );
    }

    if (error || !newsItem) {
        return (
            <div className="news-details-container" style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <p style={{ color: '#e74c3c', fontSize: '1.2rem', marginBottom: '20px', fontFamily: '"Droid Arabic Kufi", serif' }}>حدث خطأ في تحميل الخبر</p>
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
        <div className="news-details-container" style={{ paddingTop: '70px', backgroundColor: '#fff', direction: 'rtl', fontFamily: '"Droid Arabic Kufi", serif' }}>

            {/* Fixed Overview Bar */}
            <div className="top-100 fixed left-0 z-50 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2" style={{
                top: '80px',
                position: 'fixed',
                left: 0,
                zIndex: 50,
                width: '100%',
                borderBottom: '1px solid #d1d5db',
                background: '#F5F7E1',
                padding: '0.5rem 1.25rem',
                fontFamily: '"Droid Arabic Kufi", serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1rem' }}>
                        <a href="/" style={{ marginLeft: '0.75rem', color: '#374151', textDecoration: 'none', transition: 'color 0.3s', fontWeight: 'bold' }}
                            onMouseEnter={(e) => e.target.style.color = '#111827'}
                            onMouseLeave={(e) => e.target.style.color = '#374151'}>
                            الصفحة الرئيسية
                        </a>
                        <span style={{ color: '#6b7280' }}> - </span>
                        <a href="/news" style={{ marginLeft: '0.75rem', marginRight: '0.75rem', color: '#374151', textDecoration: 'none', transition: 'color 0.3s', fontWeight: 'bold' }}
                            onMouseEnter={(e) => e.target.style.color = '#111827'}
                            onMouseLeave={(e) => e.target.style.color = '#374151'}>
                            الأخبار
                        </a>
                        <span style={{ color: '#6b7280' }}> - </span>
                        <span style={{ marginRight: '0.75rem', color: '#374151', fontWeight: 'bold' }}>تفاصيل الخبر</span>
                    </span>
                </div>
            </div>

            {/* Hero Section with Image */}
            <div className="hero-section" style={{ position: 'relative', height: '500px', overflow: 'hidden', marginTop: '50px', cursor: 'pointer' }}
                onClick={() => setShowImageModal(true)}>
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
                        objectFit: 'contain',
                        objectPosition: 'center',
                        animation: 'zoomIn 0.8s ease-out',
                        backgroundColor: '#000'
                    }}
                />
                <div className="zoom-icon" style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 2,
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    fontSize: '0.9rem',
                    fontFamily: '"Droid Arabic Kufi", serif'
                }}>
                    🔍 اضغط للتكبير
                </div>
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
                        fontWeight: 'bold',
                        fontFamily: '"Droid Arabic Kufi", serif'
                    }}>
                        {formattedDate}
                    </div>
                    <h1 className="news-title" style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        margin: 0,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        lineHeight: '1.3',
                        animation: 'slideUp 0.6s ease-out',
                        fontFamily: '"Droid Arabic Kufi", serif'
                    }}>
                        {newsItem.title}
                    </h1>
                </div>
            </div>

            {/* Content Section - Now full width + closer to hero */}
            <div className="content-wrapper" style={{ padding: '20px 0 60px', maxWidth: '100%', margin: '0 auto' }}>

                <div className="news-content" style={{
                    fontSize: '1.15rem',
                    lineHeight: '2',
                    color: '#000',
                    textAlign: 'justify',
                    animation: 'fadeIn 0.8s ease-out',
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '0',
                    boxShadow: 'none',
                    fontFamily: '"Droid Arabic Kufi", serif'
                }}>
                    {newsItem.details ? (
                        <div dangerouslySetInnerHTML={{ __html: newsItem.details }} />
                    ) : (
                        <p>{newsItem.description || 'لا يوجد محتوى متاح لهذا الخبر.'}</p>
                    )}
                </div>

            </div>

            {/* Share Section */}
            <div className="content-wrapper" style={{ padding: '0 5% 60px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="share-section" style={{
                    marginTop: '30px',
                    padding: '30px',
                    background: '#F5F7E1',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '20px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#000',
                        fontFamily: '"Droid Arabic Kufi", serif',
                        marginBottom: '10px'
                    }}>
                        شارك هذا الخبر:
                    </span>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => handleShareClick('facebook')}
                            className="share-btn"
                            style={{
                                background: '#1877f2',
                                color: '#fff',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                padding: '12px 30px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                minWidth: '150px'
                            }}>
                            Facebook
                        </button>
                        <button
                            onClick={() => handleShareClick('whatsapp')}
                            className="share-btn"
                            style={{
                                background: '#25d366',
                                color: '#fff',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                padding: '12px 30px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                minWidth: '150px'
                            }}>
                            WhatsApp
                        </button>
                        <button
                            onClick={() => handleShareClick('twitter')}
                            className="share-btn"
                            style={{
                                background: '#1da1f2',
                                color: '#fff',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                padding: '12px 30px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                minWidth: '150px'
                            }}>
                            Twitter
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/news')}
                        className="back-button-secondary"
                        style={{
                            padding: '12px 40px',
                            background: '#0865a8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            fontFamily: '"Droid Arabic Kufi", serif',
                            marginTop: '10px',
                            minWidth: '200px'
                        }}>
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
                            color: '#000',
                            textAlign: 'center',
                            position: 'relative',
                            paddingBottom: '15px',
                            fontFamily: '"Droid Arabic Kufi", serif'
                        }}>
                            أخبار ذات صلة
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                right: '50%',
                                transform: 'translateX(50%)',
                                width: '80px',
                                height: '3px',
                                background: '#0865a8'
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
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                                        border: '2px solid transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#0865a8';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(8, 101, 168, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
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
                                            fontWeight: 'bold',
                                            fontFamily: '"Droid Arabic Kufi", serif'
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
                                            color: '#000',
                                            lineHeight: '1.5',
                                            margin: 0,
                                            fontFamily: '"Droid Arabic Kufi", serif'
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

            {/* Image Modal */}
            {showImageModal && (
                <div
                    className="image-modal"
                    onClick={() => setShowImageModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowImageModal(false);
                        }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            background: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                            zIndex: 10000
                        }}
                    >
                        ×
                    </button>
                    <img
                        src={newsItem.imageUrl}
                        alt={newsItem.title}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            borderRadius: '10px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <style>{`
                @keyframes zoomIn {
                    from { transform: scale(1.1); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f5f5f5;
                    border-top: 4px solid #0865a8;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .share-btn:hover {
                    opacity: 0.85;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                .back-button-secondary:hover {
                    background: #065280 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(8, 101, 168, 0.3);
                }
                .related-news-card:hover img {
                    transform: scale(1.05);
                }
                .hero-section:hover .zoom-icon {
                    background: rgba(8, 101, 168, 0.8);
                }
                /* Tablet Styles */
                @media (max-width: 992px) {
                    .hero-section { height: 400px !important; margin-top: 50px !important; }
                    .news-title { font-size: 2rem !important; }
                    .news-content { padding: 30px !important; font-size: 1.05rem !important; }
                }
                /* Mobile Styles */
                @media (max-width: 768px) {
                    .news-details-container { padding-top: 70px !important; }
                    .hero-section { height: 350px !important; margin-top: 45px !important; }
                    .hero-content { bottom: 20px !important; right: 3% !important; left: 3% !important; }
                    .date-badge { font-size: 0.75rem !important; padding: 6px 15px !important; }
                    .news-title { font-size: 1.5rem !important; }
                    .news-content { padding: 20px !important; font-size: 1rem !important; }
                    .share-section { padding: 20px !important; flex-direction: column !important; }
                    .share-btn { width: 100%; min-width: auto !important; }
                    .back-button-secondary { width: 100%; min-width: auto !important; }
                    .related-news-section { padding: 40px 3% !important; }
                    .related-news-section h2 { font-size: 1.5rem !important; margin-bottom: 30px !important; }
                    .related-news-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
                    .zoom-icon { top: 10px !important; left: 10px !important; padding: 6px 10px !important; font-size: 0.75rem !important; }
                }
                /* Small Mobile Styles */
                @media (max-width: 480px) {
                    .hero-section { height: 280px !important; }
                    .news-title { font-size: 1.3rem !important; }
                    .news-content { font-size: 0.95rem !important; line-height: 1.8 !important; padding: 20px !important; }
                }
            `}</style>
        </div>
    );
};

export default NewsDetails;