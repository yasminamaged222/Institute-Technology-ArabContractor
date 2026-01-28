import React, { useState } from 'react';
import './galary.css';

const albums = [
    {
        id: 'album1',
        title: 'بروتوكول تعاون مع جمعية المحاسبين المصريين',
        imageUrl: '/images/pic01a1.jpg',
        photosCount: 1,
        photoPrefix: 'pic01a'
    },
    {
        id: 'album2',
        title: 'التدريب فى المانيا',
        imageUrl: '/images/pic02a1.jpg',
        photosCount: 4,
        photoPrefix: 'pic02a'
    },
    {
        id: 'albumZ',
        title: 'CEA المجموعة الرابعة',
        imageUrl: '/images/PicCEA1.jpg',
        photosCount: 11,
        photoPrefix: 'PicCEA'
    },
    {
        id: 'album4',
        title: 'دورة اعداد السلامة_فرع شرق ووسط 24 - 3 - 2019',
        imageUrl: '/images/pic04a1.jpg',
        photosCount: 3,
        photoPrefix: 'pic04a'
    },
    {
        id: 'album5',
        title: 'دورة طلبة كليات الهندسة جامعة جازان السعودية_اغسطس 2018',
        imageUrl: '/images/gazan0.jpg',
        photosCount: 17,
        photoPrefix: 'gazan'
    },
    {
        id: 'album15',
        title: 'معهد تدريب المهندسين العسكريين',
        imageUrl: '/images/Askry1.jpg',
        photosCount: 17,
        photoPrefix: 'Askry'
    },
    {
        id: 'album6',
        title: 'زيارة المانيا مركز جسر السويس',
        imageUrl: '/images/pic06a1.jpg',
        photosCount: 23,
        photoPrefix: 'pic06a'
    },
    {
        id: 'album7',
        title: 'زيارة طلاب التدريب الصيفى إلى العاصمة الإدارية الجديدة 2017-07-1',
        imageUrl: '/images/pic07a1.jpg',
        photosCount: 16,
        photoPrefix: 'pic07a'
    },
    {
        id: 'album8',
        title: 'زيارة طلاب التدريب الصيفى إلى محور روض الفرج 2017-07-20',
        imageUrl: '/images/pic08a1.jpg',
        photosCount: 4,
        photoPrefix: 'pic08a'
    },
    {
        id: 'album9',
        title: 'زيارة طلبة المدرسة الفنية مشروع ميناء شرق بورسعيد 2017-07',
        imageUrl: '/images/pic09a1.jpg',
        photosCount: 8,
        photoPrefix: 'pic09a'
    },
    {
        id: 'album10',
        title: 'زيارة وفد دولة موريتانيا إلى مدرسة المقاولون العرب الثانوية النموذجية 2017-12-17',
        imageUrl: '/images/pic10a1.jpg',
        photosCount: 5,
        photoPrefix: 'pic10a'
    },
    {
        id: 'album11',
        title: 'مركز جسر السويس',
        imageUrl: '/images/pic11a1.jpg',
        photosCount: 24,
        photoPrefix: 'pic11a'
    },
    {
        id: 'album12',
        title: 'مركز شبرا',
        imageUrl: '/images/pic12a1.jpg',
        photosCount: 11,
        photoPrefix: 'pic12a'
    },
    {
        id: 'album13',
        title: 'طلبة السودان 2016',
        imageUrl: '/images/pic13a1.jpg',
        photosCount: 27,
        photoPrefix: 'pic13a'
    },
    {
        id: 'album14',
        title: 'ندوة عقود الفيديك - د شريف الهجان',
        imageUrl: '/images/pic14a1.jpg',
        photosCount: 5,
        photoPrefix: 'pic14a'
    },
    {
        id: 'album16',
        title: 'السلامة فى اعمال الرفع والتصبين_مشروع معالجة مياه بحر البقر',
        imageUrl: '/images/pic16a1.jpg',
        photosCount: 6,
        photoPrefix: 'pic16a'
    },
    {
        id: 'album17',
        title: 'فرع الاسكندرية_17_3_2019_PMPبرنامج',
        imageUrl: '/images/pic17a1.jpg',
        photosCount: 14,
        photoPrefix: 'pic17a'
    },
    {
        id: 'album3',
        title: 'دورة زامبيا',
        imageUrl: '/images/pic03a1.jpg',
        photosCount: 3,
        photoPrefix: 'pic03a'
    },
];

// TrainingPlan Component (Video Gallery Content)
const VideoGalleryPage = () => {
    // Function to launch YouTube video
    const launchYouTube = (videoId) => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    };

    // Video card component
    const VideoCard = ({ videoId, title, color }) => {
        const [imageError, setImageError] = useState(false);

        return (
            <div
                onClick={() => launchYouTube(videoId)}
                className="training-video-card"
                style={{ borderColor: `${color}50` }}
            >
                <div className="training-video-thumbnail">
                    {!imageError ? (
                        <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={title}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="training-video-error">
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="#999">
                                <path d="M4 6h16v12H4z" />
                            </svg>
                        </div>
                    )}
                    <div className="training-video-overlay" />
                    <div className="training-play-button">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <div className="training-video-title">
                        <span>{title}</span>
                    </div>
                </div>
            </div>
        );
    };

    // Section component
    const Section = ({ title, videos, color }) => {
        return (
            <div className="training-section">
                <div className="training-section-header" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
                    <h2>{title}</h2>
                </div>
                <div className="training-videos-grid">
                    {videos.map((video, index) => (
                        <VideoCard
                            key={index}
                            videoId={video.id}
                            title={video.title}
                            color={color}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // Engineer group component
    const EngineerGroup = ({ groupTitle, videos }) => {
        return (
            <div className="training-section">
                <div className="training-section-header" style={{ background: 'linear-gradient(135deg, #E65100 0%, #FF6F00 100%)' }}>
                    <h2>{groupTitle}</h2>
                </div>
                <div className="training-videos-grid training-engineer-grid">
                    {videos.map((video, index) => (
                        <VideoCard
                            key={index}
                            videoId={video.id}
                            title={video.title}
                            color="#E65100"
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="training-plan-container">
            <style>{`
                .training-plan-container {
                    width: 100%;
                    padding: 20px;
                }

                .training-section {
                    background: white;
                    border-radius: 16px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                    overflow: hidden;
                }

                .training-section-header {
                    padding: 20px;
                    text-align: center;
                }

                .training-section-header h2 {
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    margin: 0;
                }

                .training-cea-header {
                    background: linear-gradient(135deg, #6A1B9A 0%, #9C27B0 100%);
                    color: white;
                    padding: 16px;
                    margin-bottom: 24px;
                    border-radius: 12px;
                    text-align: center;
                }

                .training-cea-header h2 {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0;
                }

                .training-videos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 16px;
                    padding: 16px;
                }

                .training-engineer-grid {
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 12px;
                }

                @media (min-width: 600px) {
                    .training-videos-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 900px) {
                    .training-engineer-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (min-width: 1200px) {
                    .training-videos-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .training-engineer-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                .training-video-card {
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    background-color: #f5f5f5;
                    border: 2px solid;
                    transition: transform 0.2s, box-shadow 0.2s;
                    aspect-ratio: 16 / 10;
                }

                .training-video-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
                }

                .training-video-thumbnail {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .training-video-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .training-video-error {
                    width: 100%;
                    height: 100%;
                    background-color: #ddd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .training-video-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%);
                }

                .training-play-button {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(255, 0, 0, 0.9);
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    transition: transform 0.2s;
                }

                .training-video-card:hover .training-play-button {
                    transform: translate(-50%, -50%) scale(1.1);
                }

                .training-video-title {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 12px;
                    text-align: center;
                }

                .training-video-title span {
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    text-shadow: 0 0 4px rgba(0,0,0,0.8);
                }
            `}</style>

            {/* Arabic Section */}
            <Section
                title="فيديوهات عن المقاولون العرب ودورها التعليمى فى هندسة التشييد والبناء"
                videos={[
                    { id: 'ZfDfud7dV50', title: 'فيديو 1' },
                    { id: '5f4Pb_agNR8', title: 'فيديو 2' },
                    { id: 'km_RuntColw', title: 'فيديو 3' },
                ]}
                color="#1565C0"
            />

            {/* English Section */}
            <Section
                title="The Arab Contractors and Their Educational Role"
                videos={[
                    { id: 'XL-8BmDEaKM', title: 'Video 1' },
                    { id: 'DK91iVe4DuQ', title: 'Video 2' },
                    { id: 'dR5LsCk4b2Y', title: 'Video 3' },
                ]}
                color="#2E7D32"
            />

            {/* French Section */}
            <Section
                title="Les entrepreneurs arabes et leur rôle éducatif"
                videos={[
                    { id: '78_PrybZMtA', title: 'Vidéo 1' },
                    { id: '7CXLX7iCWcs', title: 'Vidéo 2' },
                    { id: 'Lb-f8lk_cCg', title: 'Vidéo 3' },
                ]}
                color="#D32F2F"
            />

            {/* CEA Program Header */}
            <div className="training-cea-header">
                <h2>رأي بعض المهندسين في البرنامج CEA</h2>
            </div>

            {/* Group 1 */}
            <EngineerGroup
                groupTitle="ICEMT_CEA_Group1"
                videos={[
                    { id: 'qVacL0aaqHY', title: 'مهندس 1' },
                    { id: 'MuQt0pQenhI', title: 'مهندس 2' },
                    { id: 'wujlFjykJO0', title: 'مهندس 3' },
                    { id: '4CA2Aj9xM0c', title: 'مهندس 4' },
                    { id: 'v-BCi9TsaoM', title: 'مهندس 5' },
                    { id: 'zYa5Ohpe2QE', title: 'مهندس 6' },
                    { id: 'D2GsCDbjvdY', title: 'مهندس 7' },
                ]}
            />

            {/* Group 2 */}
            <EngineerGroup
                groupTitle="ICEMT_CEA_Group2"
                videos={[
                    { id: '1FxSAiZSx9c', title: 'مهندس 1' },
                    { id: 'fLsCp8m5gDw', title: 'مهندس 2' },
                    { id: '6R3PvQZml6k', title: 'مهندس 3' },
                    { id: 'pKkDOwUpQlE', title: 'مهندس 4' },
                    { id: 'xXBddNMMZ8E', title: 'مهندس 5' },
                    { id: 'qzmapa6fOo4', title: 'مهندس 6' },
                    { id: '0gN8RTYHafk', title: 'مهندس 7' },
                ]}
            />
        </div>
    );
};

const AlbumDetailPage = ({ album, onBack }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState({});
    const [imageError, setImageError] = useState({});

    // Generate photo URLs using the photoPrefix
    const photos = Array.from(
        { length: album.photosCount },
        (_, i) => `/images/${album.photoPrefix}${i + 1}.jpg`
    );

    const handlePrevious = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(currentPhotoIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
    };

    return (
        <div className="album-detail-page">
            <div className="album-detail-header">
                <div className="album-header-content">
                    <div className="album-title">{album.title}</div>
                    <div className="album-counter">
                        صورة {currentPhotoIndex + 1} من {photos.length}
                    </div>
                </div>
                <button onClick={onBack} className="back-button">
                    <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="album-content">
                <div className="photo-viewer-container">
                    <div className="photo-card">
                        <div className="photo-wrapper">
                            {imageLoading[currentPhotoIndex] && (
                                <div className="photo-loading">
                                    <div className="spinner"></div>
                                    <div className="loading-text">جاري تحميل الصورة...</div>
                                </div>
                            )}
                            {imageError[currentPhotoIndex] ? (
                                <div className="photo-error">
                                    <svg className="error-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                    </svg>
                                    <div className="error-text">لا يمكن تحميل الصورة</div>
                                    <div className="error-url">{photos[currentPhotoIndex]}</div>
                                </div>
                            ) : (
                                <img
                                    src={photos[currentPhotoIndex]}
                                    alt={`Photo ${currentPhotoIndex + 1}`}
                                    className="main-photo"
                                    onLoad={() => setImageLoading(prev => ({ ...prev, [currentPhotoIndex]: false }))}
                                    onError={() => {
                                        setImageLoading(prev => ({ ...prev, [currentPhotoIndex]: false }));
                                        setImageError(prev => ({ ...prev, [currentPhotoIndex]: true }));
                                    }}
                                    onLoadStart={() => setImageLoading(prev => ({ ...prev, [currentPhotoIndex]: true }))}
                                />
                            )}
                        </div>
                        <div className="photo-badge">
                            {currentPhotoIndex + 1} / {photos.length}
                        </div>
                    </div>
                </div>

                <div className="navigation-buttons">
                    <button
                        onClick={handleNext}
                        disabled={currentPhotoIndex >= photos.length - 1}
                        className="nav-button"
                    >
                        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>التالي</span>
                    </button>

                    <div className="page-indicator">
                        {currentPhotoIndex + 1} / {photos.length}
                    </div>

                    <button
                        onClick={handlePrevious}
                        disabled={currentPhotoIndex <= 0}
                        className="nav-button"
                    >
                        <span>السابق</span>
                        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="thumbnail-strip">
                    <div className="thumbnail-container">
                        {photos.map((photo, index) => {
                            const isSelected = index === currentPhotoIndex;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                    className={`thumbnail ${isSelected ? 'thumbnail-selected' : ''}`}
                                >
                                    <img
                                        src={photo}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="thumbnail-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div class="thumbnail-error"><svg class="thumbnail-error-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PhotoGallery = () => {
    const [showPhotos, setShowPhotos] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [imageLoading, setImageLoading] = useState({});
    const [imageError, setImageError] = useState({});

    const getGridColumns = (width) => {
        if (width > 1200) return 4;
        if (width > 800) return 3;
        if (width > 600) return 2;
        return 1;
    };

    const [columns, setColumns] = useState(4);

    React.useEffect(() => {
        const handleResize = () => {
            setColumns(getGridColumns(window.innerWidth));
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (selectedAlbum) {
        return <AlbumDetailPage album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
    }

    return (
        <div dir="rtl" className="photo-gallery">
            {/* Fixed Breadcrumb Bar */}
            <div className="breadcrumb-bar">
                <div className="breadcrumb-content">
                    <span className="breadcrumb-text">
                        <a href="/" className="breadcrumb-link">الصفحة الرئيسية</a>
                        <span className="breadcrumb-separator">-</span>
                        <span className="breadcrumb-current">مكتبة الصور والفيديوهات</span>
                    </span>
                </div>
            </div>

            <div className="gallery-header">
                <div className="tab-buttons">
                    <button
                        onClick={() => setShowPhotos(true)}
                        className={`tab-button ${showPhotos ? 'tab-button-active' : ''}`}
                    >
                        مكتبة الصور
                    </button>
                    <button
                        onClick={() => setShowPhotos(false)}
                        className={`tab-button ${!showPhotos ? 'tab-button-active' : ''}`}
                    >
                        مكتبة الفيديوهات
                    </button>
                </div>
            </div>

            <div className="gallery-content">
                {showPhotos ? (
                    <div className="albums-grid-wrapper">
                        <div
                            className="albums-grid"
                            style={{
                                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                            }}
                        >
                            {albums.map((album) => (
                                <button
                                    key={album.id}
                                    onClick={() => setSelectedAlbum(album)}
                                    className="album-card"
                                >
                                    <div className="album-image-container">
                                        {imageLoading[album.id] && (
                                            <div className="album-loading">
                                                <div className="spinner"></div>
                                            </div>
                                        )}
                                        {imageError[album.id] ? (
                                            <div className="album-error">
                                                <svg className="album-error-icon" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                </svg>
                                                <div className="album-error-text">ألبوم الصور</div>
                                            </div>
                                        ) : (
                                            <img
                                                src={album.imageUrl}
                                                alt={album.title}
                                                className="album-image"
                                                onLoad={() => setImageLoading(prev => ({ ...prev, [album.id]: false }))}
                                                onError={() => {
                                                    setImageLoading(prev => ({ ...prev, [album.id]: false }));
                                                    setImageError(prev => ({ ...prev, [album.id]: true }));
                                                }}
                                                onLoadStart={() => setImageLoading(prev => ({ ...prev, [album.id]: true }))}
                                            />
                                        )}
                                    </div>
                                    <div className="album-info">
                                        <div className="album-info-title">{album.title}</div>
                                        <div className="album-footer">
                                            <div className="album-action">
                                                <svg className="album-action-icon" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                </svg>
                                                <span className="album-action-text">عرض الألبوم</span>
                                            </div>
                                            <div className="album-count">
                                                {album.photosCount} صورة
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <VideoGalleryPage />
                )}
            </div>
        </div>
    );
};

export default PhotoGallery;