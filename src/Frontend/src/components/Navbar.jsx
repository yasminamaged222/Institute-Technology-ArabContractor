import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
    AppBar, Toolbar, Box, IconButton, InputBase, Menu, MenuItem,
    Badge, Button, Divider, Typography, Stack, Popover, List,
    ListItemButton, ListItemText, useMediaQuery, useTheme, Drawer, Collapse,
    Paper, Popper, ClickAwayListener
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-removebg-preview.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import AuthSync from '../components/AuthSync.jsx';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

const Navbar = () => {
    const [coursesAnchor, setCoursesAnchor] = useState(null);
    const [aboutAnchor, setAboutAnchor] = useState(null);
    const [servicesAnchor, setServicesAnchor] = useState(null);
    const [accountAnchor, setAccountAnchor] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    // API State
    const [mainCourses, setMainCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cart State
    const [cartCount, setCartCount] = useState(0);

    // ── Search State (Udemy-style) ──────────────────────────────────────────
    const [searchValue, setSearchValue] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);       // filtered course objects
    const [allCourses, setAllCourses] = useState([]);         // flat list of every course
    const [coursesPreloaded, setCoursesPreloaded] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [suggestionLoading, setSuggestionLoading] = useState(false);
    const searchInputRef = useRef(null);
    const searchBoxRef = useRef(null);
    const suggestionDebounceRef = useRef(null);
    // ────────────────────────────────────────────────────────────────────────

    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const aboutLinks = [
        'نبذة عامة', 'الرؤية والأهداف', 'الشهادات والاعتمادات', 'فريق العمل',
        'قائمة المحاضرين', 'الخطة التدريبية', 'التقرير الشهرى',
        'مكتبة الصور والفيديوهات', 'البروتوكولات والإتفاقيات', 'عملاؤنا'
    ];

    const serviceLinks = [
        { title: 'التدريب الحرفى', path: '/vocational-training' },
        { title: 'التعليم الفنى', path: '/technical-education' },
        { title: 'الإختبارات', path: '/tests' },
        { title: 'مجلس قادة المستقبل', path: '/future-leaders' },
    ];

    const aboutLinkPaths = {
        'نبذة عامة': '/overview',
        'الرؤية والأهداف': '/mission',
        'الشهادات والاعتمادات': '/certifications',
        'فريق العمل': '/team',
        'قائمة المحاضرين': '/instructors',
        'الخطة التدريبية': '/pdf/ICEMT_Plan_Training.pdf',
        'التقرير الشهرى': '/pdf/ICEMT_Monthly_Activity.pdf',
        'مكتبة الصور والفيديوهات': '/gallery',
        'البروتوكولات والإتفاقيات': '/protocols',
        'عملاؤنا': '/customers',
    };

    const [selectedCatId, setSelectedCatId] = useState(null);
    const [selectedSubId, setSelectedSubId] = useState(null);

    const [openSub, setOpenSub] = useState(null);
    const [openTopic, setOpenTopic] = useState(null);

    // Function to update cart count from localStorage
    const updateCartCount = () => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                const cartItems = JSON.parse(savedCart);
                setCartCount(cartItems.length);
            } catch (error) {
                console.error('Error parsing cart items:', error);
                setCartCount(0);
            }
        } else {
            setCartCount(0);
        }
    };

    // Update cart count on component mount and when cart changes
    useEffect(() => {
        updateCartCount();

        const handleCartUpdate = () => {
            updateCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    // ── Load recent searches from localStorage ─────────────────────────────
    useEffect(() => {
        try {
            const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (stored) setRecentSearches(JSON.parse(stored));
        } catch {
            setRecentSearches([]);
        }
    }, []);

    const saveRecentSearch = useCallback((term) => {
        if (!term.trim()) return;
        setRecentSearches(prev => {
            const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase());
            const updated = [term, ...filtered].slice(0, MAX_RECENT_SEARCHES);
            try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);

    const removeRecentSearch = useCallback((term, e) => {
        e.stopPropagation();
        setRecentSearches(prev => {
            const updated = prev.filter(s => s !== term);
            try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);
    // ────────────────────────────────────────────────────────────────────────

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://acwebsite-icmet-test.azurewebsites.net/api/Categories/tree');

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await response.json();

                const transformedData = transformCategories(data);
                setMainCourses(transformedData);

                if (transformedData.length > 0) {
                    setSelectedCatId(transformedData[0].id);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err.message);
                setMainCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // ── Preload ALL courses from every program once categories are ready ──────
    useEffect(() => {
        if (!mainCourses.length || coursesPreloaded) return;

        // Collect all numeric IDs from category links + top-level IDs
        const collectIds = (nodes) => {
            const ids = new Set();
            const walk = (list) => {
                list.forEach(node => {
                    if (node.link) {
                        const m = node.link.match(/\/courses\/(\d+)\//);
                        if (m) ids.add(Number(m[1]));
                    }
                    if (node.sub) walk(node.sub);
                    if (node.topics) {
                        node.topics.forEach(t => {
                            const m2 = (t.link || '').match(/\/courses\/(\d+)\//);
                            if (m2) ids.add(Number(m2[1]));
                        });
                    }
                });
            };
            walk(nodes);
            return [...ids];
        };

        const topIds = mainCourses.map(c => c.id);
        const deepIds = collectIds(mainCourses);
        const allIds = [...new Set([...topIds, ...deepIds])];

        const fetchAll = async () => {
            setSuggestionLoading(true);
            try {
                const results = await Promise.allSettled(
                    allIds.map(pid =>
                        fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/course/programs/${pid}/courses`)
                            .then(r => r.ok ? r.json() : null)
                            .catch(() => null)
                    )
                );

                const flat = [];
                const seen = new Set();

                results.forEach(r => {
                    if (r.status !== 'fulfilled' || !r.value) return;
                    const payload = r.value;
                    const list = Array.isArray(payload)
                        ? payload
                        : payload.courses || payload.data || [];

                    list.forEach(course => {
                        const cid = course.id ?? course.courseId;
                        if (cid == null || seen.has(cid)) return;
                        seen.add(cid);
                        const title = course.title || course.name || course.courseName || '';
                        flat.push({
                            id: cid,
                            title,
                            category: course.categoryName || course.category || '',
                            instructor: course.instructorName || course.instructor || '',
                            image: course.imageUrl || course.image || course.thumbnail || null,
                            link: `/courses/${cid}/${generateSlug(title || String(cid))}`,
                        });
                    });
                });

                setAllCourses(flat);
                setCoursesPreloaded(true);
            } catch {
                // silent
            } finally {
                setSuggestionLoading(false);
            }
        };

        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainCourses]);
    // ────────────────────────────────────────────────────────────────────────

    // ── Filter courses locally as user types (instant, zero extra requests) ─
    useEffect(() => {
        if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);

        if (!searchValue.trim()) {
            setSuggestions([]);
            return;
        }

        suggestionDebounceRef.current = setTimeout(() => {
            const q = searchValue.trim().toLowerCase();
            const matched = allCourses
                .filter(c => c.title.toLowerCase().includes(q))
                .slice(0, 10);
            setSuggestions(matched);
        }, 200);

        return () => {
            if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);
        };
    }, [searchValue, allCourses]);
    // ────────────────────────────────────────────────────────────────────────

    // Transform API data to match the component's expected structure
    const transformCategories = (apiData) => {
        if (!Array.isArray(apiData) || apiData.length === 0) return [];

        const rootCategory = apiData[0];

        if (!rootCategory || !rootCategory.children) return [];

        return rootCategory.children.map(category => {
            const transformed = {
                id: category.id,
                title: category.title,
            };

            if (category.children && category.children.length > 0) {
                const hasGrandchildren = category.children.some(child => child.children && child.children.length > 0);

                if (!hasGrandchildren) {
                    transformed.sub = [{
                        id: category.id + 1000,
                        title: category.title,
                        topics: category.children.map(child => ({
                            id: child.id,
                            name: child.title,
                            link: `/courses/${child.id}/${generateSlug(child.title)}`,
                        }))
                    }];
                } else {
                    transformed.sub = category.children.map(subCategory => {
                        const transformedSub = {
                            id: subCategory.id,
                            title: subCategory.title,
                        };

                        if (subCategory.children && subCategory.children.length > 0) {
                            transformedSub.topics = subCategory.children.map(topic => {
                                const transformedTopic = {
                                    id: topic.id,
                                    name: topic.title,
                                    link: `/courses/${topic.id}/${generateSlug(topic.title)}`,
                                };

                                if (topic.children && topic.children.length > 0) {
                                    transformedTopic.subTopics = topic.children.map(subTopic => {
                                        const transformedSubTopic = {
                                            id: subTopic.id,
                                            name: subTopic.title,
                                            link: `/courses/${subTopic.id}/${generateSlug(subTopic.title)}`,
                                        };

                                        if (subTopic.children && subTopic.children.length > 0) {
                                            transformedSubTopic.subSubTopics = subTopic.children.map(subSubTopic => ({
                                                id: subSubTopic.id,
                                                name: subSubTopic.title,
                                                link: `/courses/${subSubTopic.id}/${generateSlug(subSubTopic.title)}`,
                                            }));
                                        }

                                        return transformedSubTopic;
                                    });
                                }

                                return transformedTopic;
                            });
                        }

                        return transformedSub;
                    });
                }
            } else {
                transformed.link = `/courses/${category.id}/${generateSlug(category.title)}`;
            }

            return transformed;
        });
    };

    const generateSlug = (title) => {
        return title
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u0600-\u06FF\u0660-\u0669-]/g, '')
            .toLowerCase();
    };

    const activeCategory = mainCourses.find(c => c.id === selectedCatId) || mainCourses[0];
    const activeSub = activeCategory?.sub?.find(s => s.id === selectedSubId) || activeCategory?.sub?.[0];

    const handleLinkClick = (path) => {
        if (!path) return;
        if (path.endsWith('.pdf')) {
            window.open(path, '_blank');
        } else {
            navigate(path);
        }
        handleClose();
    };

    const handleCoursesOpen = (event) => setCoursesAnchor(event.currentTarget);
    const handleClose = () => {
        setAboutAnchor(null);
        setCoursesAnchor(null);
        setServicesAnchor(null);
        setAccountAnchor(null);
    };
    const toggleDrawer = (open) => () => setMobileOpen(open);

    // ── Search handlers ────────────────────────────────────────────────────
    const dropdownVisible = searchFocused && (
        suggestions.length > 0 ||
        (recentSearches.length > 0 && !searchValue.trim()) ||
        (suggestionLoading && !coursesPreloaded)
    );

    // Flat list for keyboard nav:
    // When typing → course objects; when empty → recent search strings
    const dropdownItems = searchValue.trim()
        ? suggestions                  // array of { id, title, link, ... }
        : recentSearches;              // array of strings

    const executeSearch = useCallback((term) => {
        const q = (typeof term === 'string' ? term : term?.title || '').trim();
        if (!q) return;
        saveRecentSearch(q);
        setSearchValue(q);
        setSearchFocused(false);
        setActiveSuggestionIndex(-1);
        navigate(`/search?q=${encodeURIComponent(q)}`);
    }, [navigate, saveRecentSearch]);

    const handleSearchSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (activeSuggestionIndex >= 0 && dropdownItems[activeSuggestionIndex]) {
            const item = dropdownItems[activeSuggestionIndex];
            if (typeof item === 'string') {
                executeSearch(item);
            } else {
                // Course object – navigate directly to the course details page
                saveRecentSearch(item.title);
                setSearchValue('');
                setSuggestions([]);
                setSearchFocused(false);
                setActiveSuggestionIndex(-1);
                navigate(`/course?id=${item.id}`);
            }
        } else {
            executeSearch(searchValue);
        }
    };

    const handleSearchKeyDown = (e) => {
        if (!dropdownVisible) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev =>
                prev < dropdownItems.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev =>
                prev > 0 ? prev - 1 : dropdownItems.length - 1
            );
        } else if (e.key === 'Escape') {
            setSearchFocused(false);
            setActiveSuggestionIndex(-1);
            searchInputRef.current?.blur();
        }
        // Enter is handled by form onSubmit
    };

    const handleSuggestionClick = (term) => {
        executeSearch(term);
    };
    // ────────────────────────────────────────────────────────────────────────

    return (
        <>
            <AppBar
                position="fixed"
                elevation={4}
                sx={{
                    bgcolor: 'white',
                    color: '#000',
                    py: 0.5,
                    top: 0,
                    zIndex: 1100
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', display: 'flex', px: { xs: 1, md: 4 } }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isMobile && (
                            <IconButton
                                onClick={toggleDrawer(true)}
                                sx={{
                                    color: '#0865a8',
                                    '&:hover': {
                                        bgcolor: 'rgba(8, 101, 168, 0.08)'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Stack
                            direction="row"
                            alignItems="center"
                            component={Link}
                            to="/"
                            sx={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Box component="img" src={logo} alt="ICEMT Logo" sx={{ height: { xs: 40, md: 55 }, width: 'auto' }} />
                            {!isSmallMobile && (
                                <Box sx={{ mr: 1, textAlign: 'left' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#0865a8',
                                            fontSize: '0.8rem',
                                            whiteSpace: 'nowrap',
                                            fontFamily: '"Droid Arabic Kufi", serif'
                                        }}
                                    >
                                        المقاولون العرب
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: '#000',
                                            display: { xs: 'none', md: 'block' },
                                            fontFamily: '"Droid Arabic Kufi", serif'
                                        }}
                                    >
                                        المعهد التكنولوجى لهندسة التشييد والإدارة
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    {!isMobile && (
                        <Button
                            color="inherit"
                            endIcon={<KeyboardArrowDownIcon />}
                            onMouseEnter={handleCoursesOpen}
                            sx={{
                                px: 2,
                                mx: 1,
                                whiteSpace: 'nowrap',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                color: '#000',
                                '&:hover': {
                                    bgcolor: 'rgba(8, 101, 168, 0.08)',
                                    color: '#0865a8'
                                }
                            }}
                        >
                            الدورات التدريبية
                        </Button>
                    )}

                    {/* ── Udemy-style Search Bar ─────────────────────────── */}
                    <ClickAwayListener onClickAway={() => {
                        setSearchFocused(false);
                        setActiveSuggestionIndex(-1);
                    }}>
                        <Box
                            ref={searchBoxRef}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexGrow: 1,
                                justifyContent: 'center',
                                maxWidth: { xs: '70%', sm: '500px', md: '800px' },
                                mx: { xs: 1, md: 4 },
                                position: 'relative',
                            }}
                        >
                            <Box
                                component="form"
                                onSubmit={handleSearchSubmit}
                                role="search"
                                sx={{
                                    bgcolor: searchFocused ? '#ffffff' : '#f1f3f4',
                                    borderRadius: searchFocused && dropdownVisible ? '24px 24px 0 0' : 9,
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: 2,
                                    py: 0.8,
                                    width: '100%',
                                    transition: 'all 0.2s ease',
                                    border: searchFocused
                                        ? '1px solid #0865a8'
                                        : '1px solid transparent',
                                    boxShadow: searchFocused
                                        ? '0 0 0 2px rgba(8, 101, 168, 0.1)'
                                        : 'none',
                                    borderBottom: searchFocused && dropdownVisible
                                        ? '1px solid #e0e0e0'
                                        : undefined,
                                }}
                            >
                                <InputBase
                                    inputRef={searchInputRef}
                                    name="q"
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                        setActiveSuggestionIndex(-1);
                                    }}
                                    onFocus={() => setSearchFocused(true)}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="بحث عن الدورات..."
                                    autoComplete="off"
                                    inputProps={{
                                        'aria-label': 'بحث عن الدورات',
                                        'aria-autocomplete': 'both',
                                        'aria-haspopup': 'true',
                                        'aria-expanded': dropdownVisible,
                                        role: 'combobox',
                                    }}
                                    sx={{
                                        color: '#000',
                                        flexGrow: 1,
                                        textAlign: 'right',
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        fontSize: { xs: '0.8rem', md: '0.95rem' },
                                        pr: 1
                                    }}
                                />

                                {/* Clear button – shown when there is text, mirrors Udemy */}
                                {searchValue && (
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setSearchValue('');
                                            setSuggestions([]);
                                            setActiveSuggestionIndex(-1);
                                            searchInputRef.current?.focus();
                                        }}
                                        sx={{ p: 0.5, mr: 0.5 }}
                                        aria-label="مسح البحث"
                                    >
                                        <CloseIcon sx={{ fontSize: 16, color: '#888' }} />
                                    </IconButton>
                                )}

                                <IconButton
                                    type="submit"
                                    disabled={!searchValue.trim()}
                                    sx={{
                                        p: 0.5,
                                        '&:hover': { bgcolor: 'transparent' },
                                        '&.Mui-disabled': { opacity: 0.4 },
                                    }}
                                    aria-label="تنفيذ البحث"
                                >
                                    <SearchIcon sx={{ color: '#0865a8', fontSize: { xs: 18, md: 22 } }} />
                                </IconButton>
                            </Box>

                            {/* ── Dropdown Panel ──────────────────────────── */}
                            {dropdownVisible && (
                                <Paper
                                    elevation={6}
                                    sx={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        zIndex: 1300,
                                        borderRadius: '0 0 12px 12px',
                                        border: '1px solid #0865a8',
                                        borderTop: 'none',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                                        overflow: 'hidden',
                                        bgcolor: 'white',
                                        maxHeight: '420px',
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': { width: '5px' },
                                        '&::-webkit-scrollbar-thumb': { bgcolor: '#d0d0d0', borderRadius: '3px' },
                                    }}
                                >
                                    {/* ── Recent searches (shown when input is empty) ── */}
                                    {suggestions.length === 0 && !searchValue.trim() && recentSearches.length > 0 && (
                                        <>
                                            <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <HistoryIcon sx={{ fontSize: 13, color: '#aaa' }} />
                                                <Typography sx={{
                                                    fontSize: '0.7rem', color: '#aaa',
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    fontWeight: 'bold', letterSpacing: 0.6
                                                }}>
                                                    عمليات البحث الأخيرة
                                                </Typography>
                                            </Box>
                                            {recentSearches.map((term, i) => (
                                                <Box
                                                    key={term}
                                                    onMouseDown={() => handleSuggestionClick(term)}
                                                    onMouseEnter={() => setActiveSuggestionIndex(i)}
                                                    sx={{
                                                        display: 'flex', alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        px: 2, py: 0.9, cursor: 'pointer',
                                                        bgcolor: activeSuggestionIndex === i ? 'rgba(8,101,168,0.06)' : 'transparent',
                                                        '&:hover': { bgcolor: 'rgba(8,101,168,0.06)' },
                                                        transition: 'background 0.15s',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <HistoryIcon sx={{ fontSize: 16, color: '#bbb', flexShrink: 0 }} />
                                                        <Typography sx={{ fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.87rem', color: '#333', direction: 'rtl' }}>
                                                            {term}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton size="small" onMouseDown={(e) => removeRecentSearch(term, e)}
                                                        sx={{ p: 0.3, color: '#ccc', '&:hover': { color: '#f57c00' } }}
                                                        aria-label="إزالة"
                                                    >
                                                        <CloseIcon sx={{ fontSize: 12 }} />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                            <Divider sx={{ my: 0.5 }} />
                                        </>
                                    )}

                                    {/* ── Course suggestions ── */}
                                    {suggestions.length > 0 && (
                                        <>
                                            <Box sx={{
                                                px: 2, pt: 1.5, pb: 0.8,
                                                display: 'flex', alignItems: 'center', gap: 0.8,
                                                borderBottom: '1px solid #f5f5f5',
                                            }}>
                                                <Box sx={{
                                                    width: 18, height: 18, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                }}>
                                                    <SearchIcon sx={{ fontSize: 10, color: 'white' }} />
                                                </Box>
                                                <Typography sx={{
                                                    fontSize: '0.7rem', color: '#999',
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    fontWeight: 'bold', letterSpacing: 0.5,
                                                }}>
                                                    الدورات المطابقة ({suggestions.length})
                                                </Typography>
                                            </Box>

                                            {suggestions.map((course, i) => {
                                                const title = course.title || '';
                                                const q = searchValue.toLowerCase();
                                                const matchIdx = title.toLowerCase().indexOf(q);
                                                // Navigate to course details page — matching CoursesPage's navigate(`/course?id=...`)
                                                const courseDetailUrl = `/course?id=${course.id}`;

                                                return (
                                                    <Box
                                                        key={course.id}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            saveRecentSearch(title);
                                                            setSearchValue('');
                                                            setSuggestions([]);
                                                            setSearchFocused(false);
                                                            setActiveSuggestionIndex(-1);
                                                            navigate(courseDetailUrl);
                                                        }}
                                                        onMouseEnter={() => setActiveSuggestionIndex(i)}
                                                        sx={{
                                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                                            px: 1.5, py: 1, cursor: 'pointer', textDecoration: 'none',
                                                            bgcolor: activeSuggestionIndex === i ? 'rgba(8,101,168,0.05)' : 'transparent',
                                                            '&:hover': { bgcolor: 'rgba(8,101,168,0.05)' },
                                                            transition: 'background 0.15s',
                                                            borderBottom: i < suggestions.length - 1 ? '1px solid #fafafa' : 'none',
                                                        }}
                                                    >
                                                        {/* ── Course icon thumbnail — gradient style matching CoursesPage ── */}
                                                        <Box sx={{
                                                            width: 52, height: 52, flexShrink: 0,
                                                            borderRadius: '10px',
                                                            overflow: 'hidden',
                                                            background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            boxShadow: '0 3px 8px rgba(8,101,168,0.25)',
                                                            position: 'relative',
                                                        }}>
                                                            {course.image ? (
                                                                <Box component="img" src={course.image} alt={title}
                                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                /* Book SVG icon — exact copy from CoursesPage */
                                                                <Box sx={{
                                                                    bgcolor: 'rgba(255,255,255,0.15)',
                                                                    borderRadius: '50%',
                                                                    p: '7px',
                                                                    backdropFilter: 'blur(4px)',
                                                                    border: '1.5px solid rgba(255,255,255,0.3)',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                }}>
                                                                    <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24"
                                                                        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                    </svg>
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        {/* ── Text info ── */}
                                                        <Box sx={{ flexGrow: 1, minWidth: 0, direction: 'rtl' }}>
                                                            {/* Title with highlighted match */}
                                                            <Typography sx={{
                                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                                fontSize: '0.88rem',
                                                                fontWeight: '600',
                                                                color: '#1a1a1a',
                                                                lineHeight: 1.4,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}>
                                                                {matchIdx === -1 || !searchValue ? title : (
                                                                    <>
                                                                        {title.slice(0, matchIdx)}
                                                                        <Box component="span" sx={{
                                                                            fontWeight: 'bold',
                                                                            color: '#0865a8',
                                                                            borderBottom: '1px solid rgba(8,101,168,0.3)',
                                                                        }}>
                                                                            {title.slice(matchIdx, matchIdx + searchValue.length)}
                                                                        </Box>
                                                                        {title.slice(matchIdx + searchValue.length)}
                                                                    </>
                                                                )}
                                                            </Typography>

                                                            {/* Sub-line badge + category */}
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.4 }}>
                                                                <Box sx={{
                                                                    display: 'inline-flex', alignItems: 'center',
                                                                    bgcolor: 'rgba(8,101,168,0.09)',
                                                                    px: 0.8, py: 0.2, borderRadius: '4px',
                                                                    flexShrink: 0,
                                                                }}>
                                                                    <Typography sx={{
                                                                        fontFamily: '"Droid Arabic Kufi", serif',
                                                                        fontSize: '0.68rem',
                                                                        color: '#0865a8',
                                                                        fontWeight: 'bold',
                                                                    }}>
                                                                        دورة
                                                                    </Typography>
                                                                </Box>
                                                                {(course.category || course.instructor) && (
                                                                    <Typography sx={{
                                                                        fontFamily: '"Droid Arabic Kufi", serif',
                                                                        fontSize: '0.72rem',
                                                                        color: '#888',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                    }}>
                                                                        {course.category || course.instructor}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        {/* ── Arrow indicator on hover ── */}
                                                        <Box sx={{
                                                            opacity: activeSuggestionIndex === i ? 1 : 0,
                                                            transition: 'opacity 0.15s',
                                                            color: '#0865a8',
                                                            flexShrink: 0,
                                                        }}>
                                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </>
                                    )}

                                    {/* ── Loading state ── */}
                                    {suggestionLoading && !coursesPreloaded && searchValue.trim() && (
                                        <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                                            <Typography sx={{ color: '#aaa', fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.82rem' }}>
                                                جاري تحميل الدورات...
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* ── No results ── */}
                                    {!suggestionLoading && coursesPreloaded && searchValue.trim() && suggestions.length === 0 && (
                                        <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                                            <Typography sx={{ color: '#aaa', fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.82rem' }}>
                                                لا توجد نتائج لـ &quot;{searchValue}&quot;
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* ── "Show all results" footer ── */}
                                    {searchValue.trim() && (
                                        <Box
                                            onMouseDown={handleSearchSubmit}
                                            sx={{
                                                px: 2, py: 1,
                                                borderTop: '1px solid #f0f0f0',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 1,
                                                bgcolor: 'rgba(8,101,168,0.02)',
                                                '&:hover': { bgcolor: 'rgba(8,101,168,0.08)' },
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            <SearchIcon sx={{ fontSize: 15, color: '#0865a8' }} />
                                            <Typography sx={{
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: '0.82rem', color: '#0865a8',
                                                fontWeight: 'bold', direction: 'rtl',
                                            }}>
                                                عرض جميع النتائج لـ &quot;{searchValue}&quot;
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            )}
                            {/* ─────────────────────────────────────────────── */}
                        </Box>
                    </ClickAwayListener>
                    {/* ─────────────────────────────────────────────────────── */}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        {!isMobile && (
                            <Stack direction="row" spacing={1}>
                                <Button
                                    color="inherit"
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onMouseEnter={(e) => setAboutAnchor(e.currentTarget)}
                                    sx={{
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        color: '#000',
                                        '&:hover': {
                                            bgcolor: 'rgba(8, 101, 168, 0.08)',
                                            color: '#0865a8'
                                        }
                                    }}
                                >
                                    عن المعهد
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/news"
                                    sx={{
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        color: '#000',
                                        '&:hover': {
                                            bgcolor: 'rgba(8, 101, 168, 0.08)',
                                            color: '#0865a8'
                                        }
                                    }}
                                >
                                    الأخبار
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/library"
                                    sx={{
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        color: '#000',
                                        '&:hover': {
                                            bgcolor: 'rgba(8, 101, 168, 0.08)',
                                            color: '#0865a8'
                                        }
                                    }}
                                >
                                    المكتبة
                                </Button>

                                <Button
                                    color="inherit"
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onMouseEnter={(e) => setServicesAnchor(e.currentTarget)}
                                    sx={{
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        color: '#000',
                                        '&:hover': {
                                            bgcolor: 'rgba(8, 101, 168, 0.08)',
                                            color: '#0865a8'
                                        }
                                    }}
                                >
                                    الخدمات
                                </Button>
                            </Stack>
                        )}

                        <IconButton
                            color="inherit"
                            size="small"
                            component={Link}
                            to="/cart"
                            sx={{
                                position: 'relative',
                                transition: 'all 0.2s ease',
                                color: '#0865a8',
                                '&:hover': {
                                    backgroundColor: 'rgba(8, 101, 168, 0.08)',
                                    transform: 'scale(1.05)',
                                }
                            }}
                        >
                            <Badge
                                badgeContent={cartCount}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        bgcolor: '#f57c00',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        height: '18px',
                                        minWidth: '18px',
                                        padding: '0 4px',
                                        fontFamily: '"Droid Arabic Kufi", serif'
                                    }
                                }}
                            >
                                <ShoppingCartIcon sx={{ fontSize: 22 }} />
                            </Badge>
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SignedOut>
                                <SignInButton
                                    mode="modal"
                                    appearance={{
                                        variables: {
                                            colorPrimary: '#0865a8',
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            borderRadius: '0.75rem',
                                        },
                                        elements: {
                                            formButtonPrimary: {
                                                backgroundColor: '#0865a8',
                                                '&:hover': {
                                                    backgroundColor: '#f57c00',
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            fontSize: '0.75rem',
                                            bgcolor: '#0865a8',
                                            color: 'white',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 1.5,
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            minWidth: 'auto',
                                            '&:hover': {
                                                bgcolor: '#f57c00',
                                                boxShadow: '0 2px 8px rgba(245, 124, 0, 0.3)'
                                            }
                                        }}
                                    >
                                        تسجيل دخول
                                    </Button>
                                </SignInButton>
                            </SignedOut>

                            <SignedIn>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        variables: {
                                            colorPrimary: '#0865a8',
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                        }
                                    }}
                                />
                                <AuthSync />
                            </SignedIn>
                        </Box>

                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 300, p: 2, bgcolor: 'white', height: '100%' }} dir="rtl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #0865a8' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Droid Arabic Kufi", serif',
                                color: '#0865a8',
                                fontWeight: 'bold'
                            }}
                        >
                            القائمة
                        </Typography>
                        <IconButton
                            onClick={toggleDrawer(false)}
                            sx={{
                                color: '#f57c00',
                                '&:hover': {
                                    bgcolor: 'rgba(245, 124, 0, 0.08)'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <List>
                        {/* الدورات التدريبية */}
                        <ListItemButton
                            onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                            sx={{
                                bgcolor: mobileCoursesOpen ? 'rgba(8, 101, 168, 0.08)' : 'transparent',
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: 'rgba(8, 101, 168, 0.12)'
                                }
                            }}
                        >
                            <ListItemText
                                primary="الدورات التدريبية"
                                sx={{
                                    textAlign: 'right',
                                    '& .MuiTypography-root': {
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        fontWeight: 'bold',
                                        color: '#0865a8'
                                    }
                                }}
                            />
                            {mobileCoursesOpen ? <ExpandMoreIcon sx={{ color: '#0865a8' }} /> : <ChevronLeftIcon sx={{ color: '#0865a8' }} />}
                        </ListItemButton>

                        <Collapse in={mobileCoursesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {loading ? (
                                    <ListItemButton>
                                        <ListItemText
                                            primary="جاري التحميل..."
                                            sx={{
                                                '& .MuiTypography-root': {
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    fontSize: '0.9rem',
                                                    color: '#666'
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                ) : error ? (
                                    <ListItemButton>
                                        <ListItemText
                                            primary="حدث خطأ في التحميل"
                                            sx={{
                                                '& .MuiTypography-root': {
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    fontSize: '0.9rem',
                                                    color: '#f44336'
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                ) : mainCourses.map(course => (
                                    <React.Fragment key={course.id}>
                                        <ListItemButton
                                            onClick={() => {
                                                if (course.link) {
                                                    navigate(course.link);
                                                    toggleDrawer(false)();
                                                } else if (course.sub) {
                                                    setOpenSub(openSub === course.id ? null : course.id);
                                                }
                                            }}
                                            sx={{
                                                bgcolor: 'rgba(0,0,0,0.02)',
                                                mb: 0.5,
                                                borderRadius: 1,
                                                '&:hover': {
                                                    bgcolor: 'rgba(245, 124, 0, 0.08)'
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={course.title}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontFamily: '"Droid Arabic Kufi", serif',
                                                        fontSize: '0.9rem'
                                                    }
                                                }}
                                            />
                                            {course.sub && (openSub === course.id ?
                                                <ExpandMoreIcon fontSize="small" sx={{ color: '#f57c00' }} /> :
                                                <ChevronLeftIcon fontSize="small" sx={{ color: '#0865a8' }} />
                                            )}
                                        </ListItemButton>

                                        {course.sub && (
                                            <Collapse in={openSub === course.id} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding sx={{ pr: 2 }}>
                                                    {course.sub.map(subItem => (
                                                        <React.Fragment key={subItem.id}>
                                                            <ListItemButton
                                                                onClick={() => subItem.topics && setOpenTopic(openTopic === subItem.id ? null : subItem.id)}
                                                                sx={{
                                                                    borderRight: '3px solid #0865a8',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(8, 101, 168, 0.08)'
                                                                    }
                                                                }}
                                                            >
                                                                <ListItemText
                                                                    primary={subItem.title}
                                                                    sx={{
                                                                        '& .MuiTypography-root': {
                                                                            fontFamily: '"Droid Arabic Kufi", serif',
                                                                            fontSize: '0.85rem',
                                                                            color: '#0865a8',
                                                                            fontWeight: 'bold'
                                                                        }
                                                                    }}
                                                                />
                                                                {subItem.topics && (openTopic === subItem.id ?
                                                                    <ExpandMoreIcon fontSize="small" sx={{ color: '#f57c00' }} /> :
                                                                    <ChevronLeftIcon fontSize="small" sx={{ color: '#0865a8' }} />
                                                                )}
                                                            </ListItemButton>

                                                            {subItem.topics && (
                                                                <Collapse in={openTopic === subItem.id} timeout="auto" unmountOnExit>
                                                                    <List component="div" disablePadding sx={{ pr: 2 }}>
                                                                        {subItem.topics.map(topic => (
                                                                            <ListItemButton
                                                                                key={topic.id}
                                                                                component={Link}
                                                                                to={topic.link || '#'}
                                                                                onClick={toggleDrawer(false)}
                                                                                sx={{
                                                                                    '&:hover': {
                                                                                        bgcolor: 'rgba(245, 124, 0, 0.08)'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <ListItemText
                                                                                    primary={topic.name}
                                                                                    primaryTypographyProps={{
                                                                                        fontSize: '0.8rem',
                                                                                        color: '#000',
                                                                                        fontFamily: '"Droid Arabic Kufi", serif'
                                                                                    }}
                                                                                />
                                                                            </ListItemButton>
                                                                        ))}
                                                                    </List>
                                                                </Collapse>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Collapse>

                        <Divider sx={{ my: 2, bgcolor: '#0865a8', height: 2 }} />

                        {/* عن المعهد */}
                        <ListItemButton
                            onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                            sx={{
                                bgcolor: mobileAboutOpen ? 'rgba(8, 101, 168, 0.08)' : 'transparent',
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: 'rgba(8, 101, 168, 0.12)'
                                }
                            }}
                        >
                            <ListItemText
                                primary="عن المعهد"
                                sx={{
                                    textAlign: 'right',
                                    '& .MuiTypography-root': {
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        fontWeight: 'bold',
                                        color: '#0865a8'
                                    }
                                }}
                            />
                            {mobileAboutOpen ? <ExpandMoreIcon sx={{ color: '#0865a8' }} /> : <ChevronLeftIcon sx={{ color: '#0865a8' }} />}
                        </ListItemButton>

                        <Collapse in={mobileAboutOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {aboutLinks.map(link => {
                                    const path = aboutLinkPaths[link] || `/about/${link.replace(/\s+/g, '-')}`;
                                    const isPdf = path.endsWith('.pdf');

                                    return (
                                        <ListItemButton
                                            key={link}
                                            component={isPdf ? 'a' : Link}
                                            to={!isPdf ? path : undefined}
                                            href={isPdf ? path : undefined}
                                            target={isPdf ? '_blank' : undefined}
                                            rel={isPdf ? 'noopener noreferrer' : undefined}
                                            onClick={!isPdf ? toggleDrawer(false) : undefined}
                                            sx={{
                                                '&:hover': {
                                                    bgcolor: 'rgba(245, 124, 0, 0.08)'
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={link}
                                                primaryTypographyProps={{
                                                    fontFamily: '"Droid Arabic Kufi", serif',
                                                    fontSize: '0.85rem'
                                                }}
                                            />
                                        </ListItemButton>
                                    );
                                })}
                            </List>
                        </Collapse>

                        <Divider sx={{ my: 2, bgcolor: '#0865a8', height: 2 }} />

                        {/* الخدمات */}
                        <ListItemButton
                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                            sx={{
                                bgcolor: mobileServicesOpen ? 'rgba(8, 101, 168, 0.08)' : 'transparent',
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: 'rgba(8, 101, 168, 0.12)'
                                }
                            }}
                        >
                            <ListItemText
                                primary="الخدمات"
                                sx={{
                                    textAlign: 'right',
                                    '& .MuiTypography-root': {
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        fontWeight: 'bold',
                                        color: '#0865a8'
                                    }
                                }}
                            />
                            {mobileServicesOpen ? <ExpandMoreIcon sx={{ color: '#0865a8' }} /> : <ChevronLeftIcon sx={{ color: '#0865a8' }} />}
                        </ListItemButton>

                        <Collapse in={mobileServicesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {serviceLinks.map((item, index) => (
                                    <ListItemButton
                                        key={index}
                                        component={Link}
                                        to={item.path}
                                        onClick={toggleDrawer(false)}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'rgba(245, 124, 0, 0.08)'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.title}
                                            primaryTypographyProps={{
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: '0.85rem'
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>

                        <Divider sx={{ my: 2, bgcolor: '#0865a8', height: 2 }} />

                        {/* روابط إضافية */}
                        <ListItemButton
                            component={Link}
                            to="/news"
                            onClick={toggleDrawer(false)}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: 'rgba(245, 124, 0, 0.08)'
                                }
                            }}
                        >
                            <ListItemText
                                primary="الأخبار"
                                primaryTypographyProps={{
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    fontWeight: 'bold',
                                    color: '#0865a8'
                                }}
                            />
                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/library"
                            onClick={toggleDrawer(false)}
                            sx={{
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: 'rgba(245, 124, 0, 0.08)'
                                }
                            }}
                        >
                            <ListItemText
                                primary="المكتبة"
                                primaryTypographyProps={{
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    fontWeight: 'bold',
                                    color: '#0865a8'
                                }}
                            />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>

            {/* Desktop Courses Popover */}
            <Popover
                open={Boolean(coursesAnchor)}
                anchorEl={coursesAnchor}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                slotProps={{
                    paper: {
                        onMouseLeave: handleClose,
                        sx: {
                            width: 750,
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden'
                        }
                    }
                }}
            >
                <Box sx={{ display: 'flex', height: '420px' }} dir="rtl">
                    {/* Right Panel - Main Categories */}
                    <Box sx={{
                        width: '280px',
                        borderLeft: '1px solid #e0e0e0',
                        bgcolor: '#fafafa',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#d0d0d0',
                            borderRadius: '3px',
                        }
                    }}>
                        <List sx={{ p: 1 }}>
                            {loading ? (
                                <ListItemButton>
                                    <ListItemText
                                        primary="جاري التحميل..."
                                        primaryTypographyProps={{
                                            fontSize: 13,
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            color: '#666'
                                        }}
                                    />
                                </ListItemButton>
                            ) : error ? (
                                <ListItemButton>
                                    <ListItemText
                                        primary="حدث خطأ في التحميل"
                                        primaryTypographyProps={{
                                            fontSize: 13,
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            color: '#f44336'
                                        }}
                                    />
                                </ListItemButton>
                            ) : mainCourses.map((cat) => (
                                <ListItemButton
                                    key={cat.id}
                                    onMouseEnter={() => setSelectedCatId(cat.id)}
                                    selected={selectedCatId === cat.id}
                                    component={cat.link ? Link : 'div'}
                                    to={cat.link || undefined}
                                    onClick={cat.link ? handleClose : undefined}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        mb: 0.5,
                                        borderRadius: 1.5,
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        '&.Mui-selected': {
                                            bgcolor: 'white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                right: 0,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '4px',
                                                height: '60%',
                                                bgcolor: '#f57c00',
                                                borderRadius: '0 2px 2px 0'
                                            }
                                        },
                                        '&:hover': {
                                            bgcolor: selectedCatId === cat.id ? 'white' : 'rgba(8, 101, 168, 0.05)',
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                bgcolor: selectedCatId === cat.id ? '#f57c00' : '#0865a8',
                                                flexShrink: 0
                                            }}
                                        />
                                        <ListItemText
                                            primary={cat.title}
                                            primaryTypographyProps={{
                                                fontSize: 13,
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontWeight: selectedCatId === cat.id ? 'bold' : '500',
                                                color: selectedCatId === cat.id ? '#0865a8' : '#333',
                                                lineHeight: 1.4
                                            }}
                                        />
                                    </Box>
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>

                    {/* Left Panel - Sub Categories and Topics */}
                    <Box sx={{
                        flex: 1,
                        p: 2.5,
                        bgcolor: 'white',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#d0d0d0',
                            borderRadius: '3px',
                        }
                    }}>
                        {loading ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography sx={{ color: '#666', fontFamily: '"Droid Arabic Kufi", serif' }}>
                                    جاري التحميل...
                                </Typography>
                            </Box>
                        ) : error ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography sx={{ color: '#f44336', fontFamily: '"Droid Arabic Kufi", serif' }}>
                                    حدث خطأ في التحميل
                                </Typography>
                            </Box>
                        ) : activeCategory ? (
                            <>
                                {/* Category Title */}
                                <Box sx={{
                                    mb: 2.5,
                                    pb: 1.5,
                                    borderBottom: '2px solid #f57c00',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Box sx={{
                                        width: 4,
                                        height: 20,
                                        bgcolor: '#f57c00',
                                        borderRadius: 1
                                    }} />
                                    <Typography
                                        sx={{
                                            color: '#0865a8',
                                            fontWeight: 'bold',
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {activeCategory.title}
                                    </Typography>
                                </Box>

                                {/* If category has direct link and no sub-categories */}
                                {activeCategory.link && !activeCategory.sub && (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Typography
                                            sx={{
                                                color: '#666',
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                fontSize: '0.9rem',
                                                mb: 1
                                            }}
                                        >
                                            انقر على الفئة للانتقال إلى الصفحة
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={activeCategory.link}
                                            onClick={handleClose}
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#0865a8',
                                                color: 'white',
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                px: 4,
                                                py: 1,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    bgcolor: '#f57c00'
                                                }
                                            }}
                                        >
                                            عرض التفاصيل
                                        </Button>
                                    </Box>
                                )}

                                {/* Sub Categories with Topics */}
                                {activeCategory.sub && (
                                    <Box>
                                        {activeCategory.sub.map((sub, index) => (
                                            <Box
                                                key={sub.id}
                                                sx={{
                                                    mb: 2.5,
                                                    pb: 2,
                                                    borderBottom: index < activeCategory.sub.length - 1 ? '1px solid #f0f0f0' : 'none'
                                                }}
                                            >
                                                {/* Sub Category Title */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1.5,
                                                    gap: 1
                                                }}>
                                                    <Box sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        bgcolor: '#f0f7ff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        <Typography sx={{
                                                            fontSize: 11,
                                                            fontWeight: 'bold',
                                                            color: '#0865a8',
                                                            fontFamily: '"Droid Arabic Kufi", serif'
                                                        }}>
                                                            {index + 1}
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: '#0865a8',
                                                            fontFamily: '"Droid Arabic Kufi", serif',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        {sub.title}
                                                    </Typography>
                                                </Box>

                                                {/* Topics List */}
                                                {sub.topics && (
                                                    <Box sx={{ pr: 4 }}>
                                                        {sub.topics.map((topic) => (
                                                            <Link
                                                                key={topic.id}
                                                                to={topic.link}
                                                                style={{ textDecoration: 'none' }}
                                                                onClick={handleClose}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'flex-start',
                                                                        gap: 1,
                                                                        py: 0.8,
                                                                        px: 1.5,
                                                                        mb: 0.5,
                                                                        borderRadius: 1,
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(245, 124, 0, 0.08)',
                                                                            transform: 'translateX(-4px)',
                                                                            '& .topic-bullet': {
                                                                                bgcolor: '#f57c00'
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <Box
                                                                        className="topic-bullet"
                                                                        sx={{
                                                                            width: 6,
                                                                            height: 6,
                                                                            borderRadius: '50%',
                                                                            bgcolor: '#0865a8',
                                                                            mt: 0.8,
                                                                            flexShrink: 0,
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '0.8rem',
                                                                            fontFamily: '"Droid Arabic Kufi", serif',
                                                                            color: '#444',
                                                                            lineHeight: 1.6,
                                                                            '&:hover': {
                                                                                color: '#f57c00'
                                                                            }
                                                                        }}
                                                                    >
                                                                        {topic.name.length > 50 ? topic.name.substring(0, 50) + '...' : topic.name}
                                                                    </Typography>
                                                                </Box>
                                                            </Link>
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </>
                        ) : null}
                    </Box>
                </Box>
            </Popover>

            {/* About Menu */}
            <Menu
                anchorEl={aboutAnchor}
                open={Boolean(aboutAnchor)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: handleClose }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    direction: 'rtl',
                    '& .MuiPaper-root': {
                        minWidth: '220px',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                }}
            >
                {aboutLinks.map((link) => {
                    const path = aboutLinkPaths[link] || `/about/${link.replace(/\s+/g, '-')}`;
                    const isPdf = path.endsWith('.pdf');

                    return (
                        <MenuItem
                            key={link}
                            component={isPdf ? 'a' : Link}
                            to={!isPdf ? path : undefined}
                            href={isPdf ? path : undefined}
                            target={isPdf ? '_blank' : undefined}
                            rel={isPdf ? 'noopener noreferrer' : undefined}
                            onClick={handleClose}
                            sx={{
                                fontFamily: '"Droid Arabic Kufi", serif',
                                fontSize: '0.85rem',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'left',
                                textAlign: 'right',
                                px: 2,
                                textDecoration: 'none',
                                color: '#000',
                                '&:hover': {
                                    bgcolor: 'rgba(245, 124, 0, 0.08)',
                                    color: '#f57c00',
                                    paddingRight: '24px',
                                    transition: 'all 0.2s ease'
                                }
                            }}
                        >
                            {link}
                        </MenuItem>
                    );
                })}
            </Menu>

            {/* Services Menu */}
            <Menu
                anchorEl={servicesAnchor}
                open={Boolean(servicesAnchor)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: () => setServicesAnchor(null) }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    direction: 'rtl',
                    '& .MuiPaper-root': {
                        minWidth: '220px',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                }}
            >
                {serviceLinks.map((item, index) => (
                    <MenuItem
                        key={index}
                        component={Link}
                        to={item.path}
                        onClick={() => setServicesAnchor(null)}
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontSize: '0.85rem',
                            textAlign: 'right',
                            width: '100%',
                            justifyContent: 'flex-end',
                            color: '#000',
                            '&:hover': {
                                bgcolor: 'rgba(245, 124, 0, 0.08)',
                                color: '#f57c00',
                                paddingRight: '24px',
                                transition: 'all 0.2s ease'
                            }
                        }}
                    >
                        {item.title}
                    </MenuItem>
                ))}
            </Menu>

            {/* Spacer for fixed navbar */}
            <Box sx={{ height: { xs: 56, sm: 64, md: 70 } }} />
        </>
    );
};

export default Navbar;