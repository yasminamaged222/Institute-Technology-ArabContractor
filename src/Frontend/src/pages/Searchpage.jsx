import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Calendar, MapPin, Search, X, TrendingUp, Clock } from 'lucide-react';

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all'); // all, courses, news, etc.

    // Popular searches for suggestions
    const popularSearches = [
        'دورات الهندسة المدنية',
        'برامج التدريب الحرفي',
        'دورات إدارة المشاريع',
        'التعليم الفني',
        'شهادات معتمدة'
    ];

    // Recent searches from localStorage
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading recent searches:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (queryParam) {
            setSearchQuery(queryParam);
            performSearch(queryParam);
        }
    }, [queryParam]);

    const saveRecentSearch = (query) => {
        if (!query.trim()) return;
        
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const performSearch = async (query) => {
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        saveRecentSearch(query);

        try {
            // Search in multiple endpoints
            const [coursesResponse, categoriesResponse] = await Promise.all([
                fetch('https://acwebsite-icmet-test.azurewebsites.net/api/course/programs/15/courses'),
                fetch('https://acwebsite-icmet-test.azurewebsites.net/api/Categories/tree')
            ]);

            const courses = await coursesResponse.json();
            const categories = await categoriesResponse.json();

            // Filter courses based on search query
            const filteredCourses = courses.courses?.filter(course => 
                course.title?.toLowerCase().includes(query.toLowerCase()) ||
                course.description?.toLowerCase().includes(query.toLowerCase()) ||
                course.place?.toLowerCase().includes(query.toLowerCase())
            ) || [];

            // Filter categories based on search query
            const filteredCategories = [];
            const searchCategories = (cats) => {
                cats.forEach(cat => {
                    if (cat.title?.toLowerCase().includes(query.toLowerCase())) {
                        filteredCategories.push(cat);
                    }
                    if (cat.children && cat.children.length > 0) {
                        searchCategories(cat.children);
                    }
                });
            };
            searchCategories(categories);

            // Combine and format results
            const results = [
                ...filteredCourses.map(course => ({
                    id: course.id,
                    type: 'course',
                    title: course.title,
                    description: course.description,
                    place: course.place,
                    date: course.date,
                    cost: course.cost,
                    link: `/course?id=${course.id}`
                })),
                ...filteredCategories.slice(0, 5).map(cat => ({
                    id: cat.id,
                    type: 'category',
                    title: cat.title,
                    description: 'تصفح الدورات في هذا التصنيف',
                    link: `/courses/${cat.id}/${generateSlug(cat.title)}`
                }))
            ];

            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title) => {
        return title
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u0600-\u06FF\u0660-\u0669-]/g, '')
            .toLowerCase();
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery });
            performSearch(searchQuery);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
        setSearchParams({});
    };

    const filteredResults = activeFilter === 'all' 
        ? searchResults 
        : searchResults.filter(r => r.type === activeFilter);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            
            <style>{`
                * {
                    font-family: "Droid Arabic Kufi", serif !important;
                }
                
                /* Responsive spacing for fixed overview bar */
                @media (max-width: 640px) {
                    .search-main-container {
                        margin-top: 100px !important;
                    }
                    .fixed-overview {
                        top: 56px !important;
                    }
                }
                
                @media (min-width: 641px) and (max-width: 768px) {
                    .search-main-container {
                        margin-top: 110px !important;
                    }
                    .fixed-overview {
                        top: 64px !important;
                    }
                }
                
                @media (min-width: 769px) and (max-width: 1024px) {
                    .search-main-container {
                        margin-top: 120px !important;
                    }
                    .fixed-overview {
                        top: 70px !important;
                    }
                }
                
                @media (min-width: 1025px) {
                    .search-main-container {
                        margin-top: 130px !important;
                    }
                    .fixed-overview {
                        top: 70px !important;
                    }
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                ::-webkit-scrollbar-thumb {
                    background: #0865a8;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #f57c00;
                }

                /* Smooth animations */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .fade-in {
                    animation: fadeIn 0.3s ease-out;
                }

                /* Search input focus effect */
                .search-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(8, 101, 168, 0.1);
                }

                /* Result card hover effect */
                .result-card {
                    transition: all 0.3s ease;
                }

                .result-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                }

                /* Responsive grid */
                @media (max-width: 300px) {
                    .search-container {
                        padding: 12px !important;
                    }
                }

                @media (min-width: 1920px) {
                    .search-container {
                        max-width: 1600px !important;
                    }
                }
            `}</style>

            <div dir="rtl" className="min-h-screen bg-white">
                {/* Fixed Overview Bar */}
                <div className="fixed-overview fixed left-0 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2">
                    <div className="text-center">
                        <span className="text-sm md:text-base">
                            <a 
                                href="/" 
                                className="ml-3 text-gray-700 transition-colors hover:text-gray-900"
                            >
                                الصفحة الرئيسية
                            </a>
                            <span className="text-gray-500"> - </span>
                            <span className="mr-3 font-semibold text-gray-900">بحث</span>
                        </span>
                    </div>
                </div>

                {/* Main Container */}
                <div className="search-main-container search-container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Search Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-3 text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                            اكتشف الدورات والبرامج التدريبية المناسبة لك
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="fade-in mx-auto mb-8 max-w-3xl">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="ابحث عن دورات، برامج، أو موضوعات..."
                                        className="search-input w-full rounded-xl border-2 border-gray-300 bg-white px-5 py-3 pr-12 text-base text-black transition-all focus:border-[#0865a8] md:py-4 md:text-lg"
                                    />
                                    <Search className="-translate-y-1/2 absolute right-4 top-1/2 h-5 w-5 text-[#0865a8] md:h-6 md:w-6" />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="-translate-y-1/2 absolute left-4 top-1/2 text-gray-400 transition-colors hover:text-[#f57c00]"
                                        >
                                            <X className="h-5 w-5 md:h-6 md:w-6" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-6 py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 md:px-8 md:py-4"
                                >
                                    {loading ? 'جاري البحث...' : 'بحث'}
                                </button>
                            </div>
                        </form>

                        {/* Filter Buttons */}
                        {hasSearched && (
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeFilter === 'all'
                                            ? 'bg-[#0865a8] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    الكل ({searchResults.length})
                                </button>
                                <button
                                    onClick={() => setActiveFilter('course')}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeFilter === 'course'
                                            ? 'bg-[#0865a8] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    دورات ({searchResults.filter(r => r.type === 'course').length})
                                </button>
                                <button
                                    onClick={() => setActiveFilter('category')}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeFilter === 'category'
                                            ? 'bg-[#0865a8] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    تصنيفات ({searchResults.filter(r => r.type === 'category').length})
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search Suggestions - Show when not searched */}
                    {!hasSearched && (
                        <div className="fade-in mx-auto max-w-4xl space-y-6">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-[#0865a8]" />
                                            <h3 className="text-lg font-bold text-black">
                                                عمليات البحث الأخيرة
                                            </h3>
                                        </div>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-sm text-gray-500 transition-colors hover:text-[#f57c00]"
                                        >
                                            مسح الكل
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSearchQuery(search);
                                                    performSearch(search);
                                                }}
                                                className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-black transition-all hover:border-[#0865a8] hover:bg-[#0865a8] hover:text-white"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Searches */}
                            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-[#f57c00]" />
                                    <h3 className="text-lg font-bold text-black">
                                        عمليات البحث الشائعة
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSearchQuery(search);
                                                performSearch(search);
                                            }}
                                            className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-black transition-all hover:border-[#f57c00] hover:bg-[#f57c00] hover:text-white"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    {hasSearched && (
                        <div className="fade-in mx-auto max-w-5xl">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#0865a8]"></div>
                                    <p className="text-lg font-semibold text-gray-600">
                                        جاري البحث...
                                    </p>
                                </div>
                            ) : filteredResults.length === 0 ? (
                                <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 text-center">
                                    <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                    <h3 className="mb-2 text-xl font-bold text-black">
                                        لم يتم العثور على نتائج
                                    </h3>
                                    <p className="mb-6 text-gray-600">
                                        حاول استخدام كلمات مفتاحية مختلفة أو أكثر عمومية
                                    </p>
                                    <button
                                        onClick={handleClearSearch}
                                        className="rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-6 py-3 font-bold text-white shadow-md transition-all hover:shadow-lg"
                                    >
                                        مسح البحث
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-6 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-black md:text-2xl">
                                            النتائج ({filteredResults.length})
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {filteredResults.map((result, index) => (
                                            <div
                                                key={`${result.type}-${result.id}-${index}`}
                                                onClick={() => navigate(result.link)}
                                                className="result-card fade-in cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm"
                                                style={{ animationDelay: `${index * 0.05}s` }}
                                            >
                                                <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start">
                                                    {/* Icon */}
                                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0865a8] to-[#f57c00]">
                                                        <BookOpen className="h-8 w-8 text-white" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${result.type === 'course'
                                                                    ? 'bg-[#0865a8] text-white'
                                                                    : 'bg-[#f57c00] text-white'
                                                                }`}>
                                                                {result.type === 'course' ? 'دورة تدريبية' : 'تصنيف'}
                                                            </span>
                                                        </div>

                                                        <h3 className="mb-2 text-lg font-bold text-black md:text-xl">
                                                            {result.title}
                                                        </h3>

                                                        {result.description && (
                                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600 md:text-base">
                                                                {result.description}
                                                            </p>
                                                        )}

                                                        {/* Course Details */}
                                                        {result.type === 'course' && (
                                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                                {result.place && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="h-4 w-4 text-[#0865a8]" />
                                                                        <span>{result.place}</span>
                                                                    </div>
                                                                )}
                                                                {result.date && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-4 w-4 text-[#0865a8]" />
                                                                        <span>{result.date}</span>
                                                                    </div>
                                                                )}
                                                                {result.cost !== null && result.cost !== undefined && (
                                                                    <div className="font-bold text-[#f57c00]">
                                                                        {result.cost.toFixed(2)} ج.م
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="flex items-center">
                                                        <svg 
                                                            className="h-6 w-6 rotate-180 text-[#0865a8] transition-transform group-hover:translate-x-2"
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth={2} 
                                                                d="M9 5l7 7-7 7" 
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchPage;