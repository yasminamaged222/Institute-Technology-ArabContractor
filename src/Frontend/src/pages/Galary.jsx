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

const VideoGalleryPage = () => {
    return (
        <div className="video-gallery-container">
            <svg className="video-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h2v12H4V6zm4 0h2v12H8V6zm4 0h2v12h-2V6zm4 0h2v12h-2V6z" />
            </svg>
            <div className="video-title">مكتبة الفيديوهات</div>
            <div className="video-subtitle">سيتم إضافة الفيديوهات قريباً</div>
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