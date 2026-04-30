import React, { useState, useEffect } from 'react';
import './galary.css';

// ─── Photo Albums with categories ───────────────────────────────────────────
// Main categories: 'activities' | 'training' | 'library' | 'labs' | 'protocols'
// Each album also has an optional `subcategory`.

const albums = [
    // ── المعامل والقاعات ──
    {
        id: 'album11',
        title: 'مركز جسر السويس',
        imageUrl: '/images/pic11a1.jpg',
        photosCount: 24,
        photoPrefix: 'pic11a',
        category: 'labs',
        subcategory: 'gisr_suez',
    },
    {
        id: 'album12',
        title: 'مركز شبرا',
        imageUrl: '/images/pic12a1.jpg',
        photosCount: 11,
        photoPrefix: 'pic12a',
        category: 'labs',
        subcategory: 'shobra',
    },

    // ── الدورات التدريبية > تدريب الطلبة ──
    {
        id: 'album7',
        title: 'زيارة طلاب التدريب الصيفى إلى العاصمة الإدارية الجديدة 2017-07-1',
        imageUrl: '/images/pic07a1.jpg',
        photosCount: 16,
        photoPrefix: 'pic07a',
        category: 'training',
        subcategory: 'students',
    },
    {
        id: 'album8',
        title: 'زيارة طلاب التدريب الصيفى إلى محور روض الفرج 2017-07-20',
        imageUrl: '/images/pic08a1.jpg',
        photosCount: 4,
        photoPrefix: 'pic08a',
        category: 'training',
        subcategory: 'students',
    },
    {
        id: 'album9',
        title: 'زيارة طلبة المدرسة الفنية مشروع ميناء شرق بورسعيد 2017-07',
        imageUrl: '/images/pic09a1.jpg',
        photosCount: 8,
        photoPrefix: 'pic09a',
        category: 'training',
        subcategory: 'students',
    },

    // ── الأنشطة والفعاليات > ورش العمل ──
    {
        id: 'album16',
        title: 'السلامة فى اعمال الرفع والتصبين_مشروع معالجة مياه بحر البقر',
        imageUrl: '/images/pic16a1.jpg',
        photosCount: 6,
        photoPrefix: 'pic16a',
        category: 'activities',
        subcategory: 'workshops',
    },

    // ── الدورات التدريبية > خارج مصر ──
    {
        id: 'album2',
        title: 'التدريب فى المانيا',
        imageUrl: '/images/pic02a1.jpg',
        photosCount: 4,
        photoPrefix: 'pic02a',
        category: 'training',
        subcategory: 'outside',
    },
    {
        id: 'album6',
        title: 'زيارة المانيا مركز جسر السويس',
        imageUrl: '/images/pic06a1.jpg',
        photosCount: 23,
        photoPrefix: 'pic06a',
        category: 'training',
        subcategory: 'outside',
    },
    {
        id: 'album3',
        title: 'دورة زامبيا',
        imageUrl: '/images/pic03a1.jpg',
        photosCount: 3,
        photoPrefix: 'pic03a',
        category: 'training',
        subcategory: 'outside',
    },
    {
        id: 'album5',
        title: 'دورة طلبة كليات الهندسة جامعة جازان السعودية_اغسطس 2018',
        imageUrl: '/images/gazan0.jpg',
        photosCount: 17,
        photoPrefix: 'gazan',
        category: 'training',
        subcategory: 'outside',
    },
    {
        id: 'album13',
        title: 'طلبة السودان 2016',
        imageUrl: '/images/pic13a1.jpg',
        photosCount: 27,
        photoPrefix: 'pic13a',
        category: 'training',
        subcategory: 'outside',
    },

    // ── زيارات وبروتوكولات > زيارات الوفود ──
    {
        id: 'album10',
        title: 'زيارة وفد دولة موريتانيا إلى مدرسة المقاولون العرب الثانوية النموذجية 2017-12-17',
        imageUrl: '/images/pic10a1.jpg',
        photosCount: 5,
        photoPrefix: 'pic10a',
        category: 'protocols',
        subcategory: 'delegations',
    },

    // ── الدورات التدريبية > داخل مصر ──
    {
        id: 'albumZ',
        title: 'CEA المجموعة الرابعة',
        imageUrl: '/images/PicCEA1.jpg',
        photosCount: 11,
        photoPrefix: 'PicCEA',
        category: 'training',
        subcategory: 'inside',
    },
    {
        id: 'album15',
        title: 'معهد تدريب المهندسين العسكريين',
        imageUrl: '/images/Askry1.jpg',
        photosCount: 17,
        photoPrefix: 'Askry',
        category: 'training',
        subcategory: 'inside',
    },
    {
        id: 'album17',
        title: 'فرع الاسكندرية_17_3_2019_PMPبرنامج',
        imageUrl: '/images/pic17a1.jpg',
        photosCount: 14,
        photoPrefix: 'pic17a',
        category: 'training',
        subcategory: 'inside',
    },
    {
        id: 'album4',
        title: 'دورة اعداد السلامة_فرع شرق ووسط 24 - 3 - 2019',
        imageUrl: '/images/pic04a1.jpg',
        photosCount: 3,
        photoPrefix: 'pic04a',
        category: 'training',
        subcategory: 'inside',
    },

    // ── زيارات وبروتوكولات ──
    {
        id: 'album1',
        title: 'بروتوكول تعاون مع جمعية المحاسبين المصريين',
        imageUrl: '/images/pic01a1.jpg',
        photosCount: 1,
        photoPrefix: 'pic01a',
        category: 'protocols',
        subcategory: 'signing',
    },

    // ── الأنشطة والفعاليات > الندوات والمؤتمرات ──
    {
        id: 'album14',
        title: 'ندوة عقود الفيديك - د شريف الهجان',
        imageUrl: '/images/pic14a1.jpg',
        photosCount: 5,
        photoPrefix: 'pic14a',
        category: 'activities',
        subcategory: 'seminars',
    },
];

// ─── Photo category definitions (with sub-filters) ───────────────────────────
const photoCategories = [
    { key: 'all', label: 'الكل', subs: [] },
    {
        key: 'activities', label: 'الأنشطة والفعاليات',
        subs: [
            { key: 'seminars', label: 'الندوات والمؤتمرات' },
            { key: 'workshops', label: 'ورش العمل' },
            { key: 'official_visits', label: 'الزيارات الرسمية' },
        ],
    },
    {
        key: 'training', label: 'الدورات التدريبية',
        subs: [
            { key: 'inside', label: 'داخل مصر' },
            { key: 'outside', label: 'خارج مصر' },
            { key: 'students', label: 'تدريب الطلبة' },
        ],
    },
    { key: 'library', label: 'مكتبة المعهد وسفارة المعرفة', subs: [] },
    {
        key: 'labs', label: 'المعامل والقاعات',
        subs: [
            { key: 'nasr_city', label: 'مركز تدريب مدينة نصر' },
            { key: 'gisr_suez', label: 'مركز تدريب جسر السويس' },
            { key: 'shobra', label: 'مركز تدريب شبرا' },
        ],
    },
    {
        key: 'protocols', label: 'زيارات وبروتوكولات التعاون',
        subs: [
            { key: 'delegations', label: 'زيارات الوفود' },
            { key: 'signing', label: 'توقيع البروتوكولات' },
            { key: 'local_intl', label: 'التعاون مع جهات محلية ودولية' },
            { key: 'ac_events', label: 'فعاليات مع شركة المقاولون العرب' },
        ],
    },
];

// ─── Video category definitions (with sub-filters) ───────────────────────────
const videoCategories = [
    { key: 'all', label: 'الكل', subs: [] },
    {
        key: 'introductory', label: 'فيديوهات تعريفية وإعلامية',
        subs: [
            { key: 'about_institute', label: 'فيديو تعريفي عن المعهد' },
            { key: 'management', label: 'كلمة إدارة المعهد' },
            { key: 'media', label: 'لقاءات إعلامية' },
            { key: 'opinions', label: 'آراء المتدربين والمحاضرين' },
            { key: 'reports', label: 'تقارير مصورة' },
        ],
    },
    { key: 'aboutAC', label: 'عن المقاولون العرب', subs: [] },
    { key: 'cea', label: 'آراء المهندسين — CEA', subs: [] },
];

// ─── Video data ───────────────────────────────────────────────────────────────
const videoSections = [
    {
        key: 'aboutAC',
        category: 'aboutAC',
        title: 'فيديوهات عن المقاولون العرب ودورها التعليمى فى هندسة التشييد والبناء',
        color: '#f57c00',
        videos: [
            { id: 'ZfDfud7dV50', title: 'فيديو 1' },
            { id: '5f4Pb_agNR8', title: 'فيديو 2' },
            { id: 'km_RuntColw', title: 'فيديو 3' },
        ],
    },
    {
        key: 'aboutAC_en',
        category: 'aboutAC',
        title: 'The Arab Contractors and Their Educational Role',
        color: '#D32F2F',
        videos: [
            { id: 'XL-8BmDEaKM', title: 'Video 1' },
            { id: 'DK91iVe4DuQ', title: 'Video 2' },
            { id: 'dR5LsCk4b2Y', title: 'Video 3' },
        ],
    },
    {
        key: 'aboutAC_fr',
        category: 'aboutAC',
        title: 'Les entrepreneurs arabes et leur rôle éducatif',
        color: '#0865a8',
        videos: [
            { id: '78_PrybZMtA', title: 'Vidéo 1' },
            { id: '7CXLX7iCWcs', title: 'Vidéo 2' },
            { id: 'Lb-f8lk_cCg', title: 'Vidéo 3' },
        ],
    },
    {
        key: 'cea_g1',
        category: 'cea',
        title: 'ICEMT_CEA_Group1',
        color: '#E65100',
        videos: [
            { id: 'qVacL0aaqHY', title: 'مهندس 1' },
            { id: 'MuQt0pQenhI', title: 'مهندس 2' },
            { id: 'wujlFjykJO0', title: 'مهندس 3' },
            { id: '4CA2Aj9xM0c', title: 'مهندس 4' },
            { id: 'v-BCi9TsaoM', title: 'مهندس 5' },
            { id: 'zYa5Ohpe2QE', title: 'مهندس 6' },
            { id: 'D2GsCDbjvdY', title: 'مهندس 7' },
        ],
    },
    {
        key: 'cea_g2',
        category: 'cea',
        title: 'ICEMT_CEA_Group2',
        color: '#E65100',
        videos: [
            { id: '1FxSAiZSx9c', title: 'مهندس 1' },
            { id: 'fLsCp8m5gDw', title: 'مهندس 2' },
            { id: '6R3PvQZml6k', title: 'مهندس 3' },
            { id: 'pKkDOwUpQlE', title: 'مهندس 4' },
            { id: 'xXBddNMMZ8E', title: 'مهندس 5' },
            { id: 'qzmapa6fOo4', title: 'مهندس 6' },
            { id: '0gN8RTYHafk', title: 'مهندس 7' },
        ],
    },
];

// ─── Shared filter bar (with sub-filters) ────────────────────────────────────
const CategoryBar = ({ categories, active, activeSub, onChange, onChangeSub }) => {
    const activeCat = categories.find(c => c.key === active);
    const hasSubs = activeCat && activeCat.subs && activeCat.subs.length > 0;

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, padding: '12px 16px' }}>
                {categories.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => { onChange(cat.key); onChangeSub('all'); }}
                        style={{
                            padding: '7px 16px',
                            borderRadius: 20,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: active === cat.key ? 700 : 400,
                            background: active === cat.key
                                ? 'linear-gradient(to right, #2563eb, #60a5fa)'
                                : '#f3f4f6',
                            color: active === cat.key ? '#fff' : '#374151',
                            transition: 'all 0.2s',
                            boxShadow: active === cat.key ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
            {hasSubs && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, padding: '0 16px 12px' }}>
                    <button
                        onClick={() => onChangeSub('all')}
                        style={{
                            padding: '5px 12px',
                            borderRadius: 16,
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            fontSize: 12,
                            background: activeSub === 'all' ? '#eff6ff' : '#fff',
                            color: activeSub === 'all' ? '#1d4ed8' : '#4b5563',
                            fontWeight: activeSub === 'all' ? 700 : 400,
                            borderColor: activeSub === 'all' ? '#2563eb' : '#e5e7eb',
                            transition: 'all 0.2s',
                        }}
                    >
                        الكل
                    </button>
                    {activeCat.subs.map(sub => (
                        <button
                            key={sub.key}
                            onClick={() => onChangeSub(sub.key)}
                            style={{
                                padding: '5px 12px',
                                borderRadius: 16,
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                fontSize: 12,
                                background: activeSub === sub.key ? '#eff6ff' : '#fff',
                                color: activeSub === sub.key ? '#1d4ed8' : '#4b5563',
                                fontWeight: activeSub === sub.key ? 700 : 400,
                                borderColor: activeSub === sub.key ? '#2563eb' : '#e5e7eb',
                                transition: 'all 0.2s',
                            }}
                        >
                            {sub.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Video components ─────────────────────────────────────────────────────────
const VideoCard = ({ videoId, title, color }) => {
    const [imageError, setImageError] = useState(false);
    return (
        <div
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
            className="training-video-card"
            style={{ borderColor: `${color}50` }}
        >
            <div className="training-video-thumbnail">
                {!imageError ? (
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt={title}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="training-video-error">
                        <span>صورة غير متاحة</span>
                    </div>
                )}
                <div className="training-video-overlay" />
                <div className="training-play-button">
                    <span style={{ color: '#fff', fontSize: 22 }}>▶</span>
                </div>
                <div className="training-video-title">
                    <span>{title}</span>
                </div>
            </div>
        </div>
    );
};

const VideoSection = ({ section }) => (
    <div style={{ margin: '24px 16px' }}>
        <div style={{ marginBottom: 12 }}>
            <h3 style={{ color: section.color, fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                {section.title}
            </h3>
        </div>
        <div className="training-videos-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {section.videos.map((video) => (
                <VideoCard key={video.id} videoId={video.id} title={video.title} color={section.color} />
            ))}
        </div>
    </div>
);

const VideoGalleryPage = () => {
    const [activeVideoCategory, setActiveVideoCategory] = useState('all');
    const [activeVideoSub, setActiveVideoSub] = useState('all');

    const filtered = activeVideoCategory === 'all'
        ? videoSections
        : videoSections.filter(s => s.category === activeVideoCategory);

    // Show the CEA header banner only when cea sections are visible
    const showCeaBanner =
        activeVideoCategory === 'all' || activeVideoCategory === 'cea';

    return (
        <div>
            <style>{`
                @media (min-width: 600px) { .training-videos-grid { grid-template-columns: repeat(2, 1fr) !important; } }
                @media (min-width: 1200px) { .training-videos-grid { grid-template-columns: repeat(3, 1fr) !important; } }
                .training-video-card { border-radius: 12px; overflow: hidden; cursor: pointer; background-color: #f5f5f5; border: 2px solid; transition: transform 0.2s, box-shadow 0.2s; aspect-ratio: 16 / 10; position: relative; }
                .training-video-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
                .training-video-thumbnail { position: relative; width: 100%; height: 100%; }
                .training-video-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .training-video-error { width: 100%; height: 100%; background-color: #ddd; display: flex; align-items: center; justify-content: center; }
                .training-video-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%); }
                .training-play-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(255,0,0,0.9); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: transform 0.2s; }
                .training-video-card:hover .training-play-button { transform: translate(-50%, -50%) scale(1.1); }
                .training-video-title { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; text-align: center; }
                .training-video-title span { color: white; font-size: 14px; font-weight: bold; text-shadow: 0 0 4px rgba(0,0,0,0.8); }
            `}</style>

            <CategoryBar
                categories={videoCategories}
                active={activeVideoCategory}
                activeSub={activeVideoSub}
                onChange={setActiveVideoCategory}
                onChangeSub={setActiveVideoSub}
            />

            {showCeaBanner && activeVideoCategory !== 'aboutAC' && activeVideoCategory !== 'introductory' && (
                <div style={{ margin: 16, padding: 14, borderRadius: 12, background: 'linear-gradient(to right, #fff7ed, #ffedd5)', textAlign: 'center' }}>
                    <h3 style={{ color: '#9a3412', fontWeight: 'bold' }}>رأي بعض المهندسين في البرنامج CEA</h3>
                </div>
            )}

            {filtered.map(section => (
                <VideoSection key={section.key} section={section} />
            ))}
        </div>
    );
};

// ─── Album detail page ────────────────────────────────────────────────────────
const AlbumDetailPage = ({ album, onBack }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState({});
    const [imageError, setImageError] = useState({});

    const photos = Array.from(
        { length: album.photosCount },
        (_, i) => `/images/${album.photoPrefix}${i + 1}.jpg`
    );

    return (
        <div className="album-detail-page">
            <div className="album-detail-header">
                <div className="album-header-content">
                    <h2 className="album-title">{album.title}</h2>
                    <p className="album-counter">
                        صورة {currentPhotoIndex + 1} من {photos.length}
                    </p>
                </div>
                <button className="back-button" onClick={onBack}>
                    <span className="back-icon">←</span>
                </button>
            </div>

            <div className="album-content">
                <div className="photo-viewer-container">
                    <div className="photo-card">
                        <div className="photo-wrapper">
                            {imageLoading[currentPhotoIndex] && (
                                <div className="photo-loading">
                                    <div className="spinner" />
                                    <p className="loading-text">جاري تحميل الصورة...</p>
                                </div>
                            )}
                            {imageError[currentPhotoIndex] ? (
                                <div className="photo-error">
                                    <div className="error-icon">⚠</div>
                                    <p className="error-text">لا يمكن تحميل الصورة</p>
                                    <p className="error-url">{photos[currentPhotoIndex]}</p>
                                </div>
                            ) : (
                                <img
                                    src={photos[currentPhotoIndex]}
                                    alt={`${album.title} ${currentPhotoIndex + 1}`}
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
                        onClick={() => currentPhotoIndex < photos.length - 1 && setCurrentPhotoIndex(i => i + 1)}
                        disabled={currentPhotoIndex >= photos.length - 1}
                        className="nav-button"
                    >
                        التالي
                    </button>
                    <span className="page-indicator">
                        {currentPhotoIndex + 1} / {photos.length}
                    </span>
                    <button
                        onClick={() => currentPhotoIndex > 0 && setCurrentPhotoIndex(i => i - 1)}
                        disabled={currentPhotoIndex <= 0}
                        className="nav-button"
                    >
                        السابق
                    </button>
                </div>

                <div className="thumbnail-strip">
                    <div className="thumbnail-container">
                        {photos.map((photo, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPhotoIndex(index)}
                                className={`thumbnail ${index === currentPhotoIndex ? 'thumbnail-selected' : ''}`}
                            >
                                <img
                                    src={photo}
                                    alt={`thumb ${index + 1}`}
                                    className="thumbnail-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="thumbnail-error"></div>';
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main gallery ─────────────────────────────────────────────────────────────
const PhotoGallery = () => {
    const [showPhotos, setShowPhotos] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [activePhotoCategory, setActivePhotoCategory] = useState('all');
    const [activePhotoSub, setActivePhotoSub] = useState('all');
    const [imageLoading, setImageLoading] = useState({});
    const [imageError, setImageError] = useState({});

    const getGridColumns = (width) => {
        if (width > 1200) return 4;
        if (width > 800) return 3;
        if (width > 600) return 2;
        return 1;
    };
    const [columns, setColumns] = useState(4);

    useEffect(() => {
        const handleResize = () => setColumns(getGridColumns(window.innerWidth));
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.title = 'مكتبة الصور والفيديوهات - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    if (selectedAlbum) {
        return <AlbumDetailPage album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
    }

    const filteredAlbums = albums.filter(a => {
        if (activePhotoCategory === 'all') return true;
        if (a.category !== activePhotoCategory) return false;
        if (activePhotoSub === 'all') return true;
        return a.subcategory === activePhotoSub;
    });

    return (
        <div className="photo-gallery">
            {/* Breadcrumb */}
            <div className="breadcrumb-bar">
                <div className="breadcrumb-content">
                    <span className="breadcrumb-text">
                        <a
                            href="/"
                            className="breadcrumb-link"
                            style={{ color: '#0865a8' }}
                            onMouseEnter={e => (e.target.style.color = '#f57c00')}
                            onMouseLeave={e => (e.target.style.color = '#0865a8')}
                        >
                            الصفحة الرئيسية
                        </a>
                        <span className="breadcrumb-separator">•</span>
                        <span className="breadcrumb-current">مكتبة الصور والفيديوهات</span>
                    </span>
                </div>
            </div>

            {/* Tab switcher */}
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

            {/* Category filter bar — shown only for the photos tab */}
            {showPhotos && (
                <CategoryBar
                    categories={photoCategories}
                    active={activePhotoCategory}
                    activeSub={activePhotoSub}
                    onChange={setActivePhotoCategory}
                    onChangeSub={setActivePhotoSub}
                />
            )}

            <div className="gallery-content">
                {showPhotos ? (
                    <div className="albums-grid-wrapper">
                        {filteredAlbums.length === 0 ? (
                            <div style={{ padding: 60, textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
                                لا توجد ألبومات في هذا القسم
                            </div>
                        ) : (
                            <div
                                className="albums-grid"
                                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                            >
                                {filteredAlbums.map(album => (
                                    <button
                                        key={album.id}
                                        onClick={() => setSelectedAlbum(album)}
                                        className="album-card"
                                    >
                                        <div className="album-image-container">
                                            {imageLoading[album.id] && (
                                                <div className="album-loading">
                                                    <div className="spinner" />
                                                </div>
                                            )}
                                            {imageError[album.id] ? (
                                                <div className="album-error">
                                                    <div className="album-error-icon">🖼</div>
                                                    <p className="album-error-text">ألبوم الصور</p>
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
                                            <h3 className="album-info-title">{album.title}</h3>
                                            <div className="album-footer">
                                                <span className="album-action">
                                                    <span className="album-action-icon">▶</span>
                                                    <span className="album-action-text">عرض الألبوم</span>
                                                </span>
                                                <span className="album-count">{album.photosCount} صورة</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <VideoGalleryPage />
                )}
            </div>
        </div>
    );
};

export default PhotoGallery;
