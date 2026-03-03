import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    AppBar, Toolbar, Box, IconButton, InputBase,
    Badge, Button, Divider, Typography, Stack,
    List, ListItemButton, ListItemText, useMediaQuery, useTheme,
    Drawer, Collapse, Paper, ClickAwayListener
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-removebg-preview.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import AuthSync from '../components/AuthSync.jsx';

const ADMIN_EMAILS = ['yasminamaged22@gmail.com', 'abeer.naguib@gmail.com', 'amrshamy91@gmail.com','abdelmawla1642@gmail.com']; // ← عدّلها

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;
const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [mainCourses, setMainCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesLoaded, setCoursesLoaded] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const searchBoxRef = useRef(null);
    const suggestionDebounce = useRef(null);
    const [selectedCatId, setSelectedCatId] = useState(null);
    const [openSub, setOpenSub] = useState(null);
    const [openTopic, setOpenTopic] = useState(null);
    const { user } = useUser();
    const isAdmin = ADMIN_EMAILS.includes(
        (user?.primaryEmailAddress?.emailAddress || '').toLowerCase()
    );

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const aboutLinks = ['نبذة عامة', 'الرؤية والأهداف', 'الشهادات والاعتمادات', 'فريق العمل', 'قائمة المحاضرين', 'الخطة التدريبية', 'التقرير الشهرى', 'مكتبة الصور والفيديوهات', 'البروتوكولات والإتفاقيات', 'عملاؤنا'];
    const aboutLinkPaths = { 'نبذة عامة': '/overview', 'الرؤية والأهداف': '/mission', 'الشهادات والاعتمادات': '/certifications', 'فريق العمل': '/team', 'قائمة المحاضرين': '/instructors', 'الخطة التدريبية': '/pdf/ICEMT_Plan_Training.pdf', 'التقرير الشهرى': '/pdf/ICEMT_Monthly_Activity.pdf', 'مكتبة الصور والفيديوهات': '/gallery', 'البروتوكولات والإتفاقيات': '/protocols', 'عملاؤنا': '/customers' };
    const serviceLinks = [{ title: 'التدريب الحرفى', path: '/vocational-training' }, { title: 'التعليم الفنى', path: '/technical-education' }, { title: 'الإختبارات', path: '/tests' }, { title: 'مجلس قادة المستقبل', path: '/future-leaders' }];

    const updateCartCount = () => {
        try {
            const s = localStorage.getItem('cartItems');
            setCartCount(s ? JSON.parse(s).length : 0);
        } catch {
            setCartCount(0);
        }
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    useEffect(() => {
        try {
            const s = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (s) setRecentSearches(JSON.parse(s));
        } catch {
            setRecentSearches([]);
        }
    }, []);

    const saveRecentSearch = useCallback((term) => {
        if (!term.trim()) return;
        setRecentSearches(prev => {
            const u = [term, ...prev.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
            try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(u)); } catch { }
            return u;
        });
    }, []);

    const removeRecentSearch = useCallback((term, e) => {
        e.stopPropagation();
        setRecentSearches(prev => {
            const u = prev.filter(s => s !== term);
            try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(u)); } catch { }
            return u;
        });
    }, []);

    const generateSlug = (title = '') =>
        title.trim().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF\u0660-\u0669-]/g, '').toLowerCase();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/Categories/tree`);
                if (!res.ok) throw new Error('Failed to load categories');
                const data = await res.json();
                const t = transformCategories(data);
                setMainCourses(t);
                if (t.length > 0) setSelectedCatId(t[0].id);
                setError(null);
            } catch (err) {
                console.error('Categories error:', err);
                setError(err.message);
                setMainCourses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const transformCategories = (apiData) => {
        if (!Array.isArray(apiData) || !apiData.length) return [];
        const root = apiData[0];
        if (!root?.children) return [];
        return root.children.map(cat => {
            const t = { id: cat.id, title: cat.title, slug: cat.slug };
            if (cat.children?.length) {
                const hasGrand = cat.children.some(c => c.children?.length);
                if (!hasGrand) {
                    t.sub = [{ id: cat.id + 1000, title: cat.title, topics: cat.children.map(c => ({ id: c.id, name: c.title, link: `/courses/${c.slug}` })) }];
                } else {
                    t.sub = cat.children.map(sub => {
                        const s = { id: sub.id, title: sub.title };
                        if (sub.children?.length) {
                            s.topics = sub.children.map(tp => {
                                const r = { id: tp.id, name: tp.title, link: `/courses/${tp.slug}` };
                                if (tp.children?.length) {
                                    r.subTopics = tp.children.map(st => {
                                        const st2 = { id: st.id, name: st.title, link: `/courses/${st.slug}` };
                                        if (st.children?.length) st2.subSubTopics = st.children.map(sst => ({ id: sst.id, name: sst.title, link: `/courses/${sst.slug}` }));
                                        return st2;
                                    });
                                }
                                return r;
                            });
                        }
                        return s;
                    });
                }
            } else {
                t.link = `/courses/${cat.slug}`;
            }
            return t;
        });
    };

    useEffect(() => {
        if (!mainCourses.length || coursesLoaded) return;
        const loadAllCourses = async () => {
            setCoursesLoading(true);
            try {
                const allSlugs = new Set();
                const collectSlugs = (categories) => { categories.forEach(cat => { if (cat.slug) allSlugs.add(cat.slug); if (cat.children) collectSlugs(cat.children); }); };
                const treeRes = await fetch(`${API_BASE}/Categories/tree`);
                if (treeRes.ok) { const treeData = await treeRes.json(); if (treeData[0]?.children) collectSlugs(treeData[0].children); }
                const coursePromises = Array.from(allSlugs).map(async (slug) => {
                    try {
                        const res = await fetch(`${API_BASE}/course/programs/${slug}/courses`);
                        if (!res.ok) return [];
                        const data = await res.json();
                        const coursesList = Array.isArray(data) ? data : (data.courses || data.data || []);
                        return coursesList.map(c => ({ id: c.id || c.courseId, title: c.title || c.name || c.courseName || '', slug: c.slug || generateSlug(c.title || c.name || String(c.id)), description: c.description || '', category: c.categoryName || c.category || '', place: c.place || '', date: c.date || '', cost: c.cost, instructor: c.instructorName || c.instructor || '', image: c.imageUrl || c.image || c.thumbnail || null }));
                    } catch (err) { return []; }
                });
                const results = await Promise.all(coursePromises);
                const allCoursesFlat = results.flat();
                const uniqueCourses = Array.from(new Map(allCoursesFlat.map(c => [c.id, c])).values());
                setAllCourses(uniqueCourses);
                setCoursesLoaded(true);
            } catch (err) { console.error('Error loading courses:', err); } finally { setCoursesLoading(false); }
        };
        loadAllCourses();
    }, [mainCourses, coursesLoaded]);

    useEffect(() => {
        if (suggestionDebounce.current) clearTimeout(suggestionDebounce.current);
        if (!searchValue.trim()) { setSuggestions([]); return; }
        suggestionDebounce.current = setTimeout(() => {
            const q = searchValue.trim().toLowerCase();
            const filtered = allCourses.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.place.toLowerCase().includes(q)).slice(0, 10);
            setSuggestions(filtered);
        }, 200);
        return () => { if (suggestionDebounce.current) clearTimeout(suggestionDebounce.current); };
    }, [searchValue, allCourses]);

    const activeCategory = mainCourses.find(c => c.id === selectedCatId) || mainCourses[0];
    const toggleDrawer = (open) => () => setMobileOpen(open);
    const dropdownVisible = searchFocused && (suggestions.length > 0 || (recentSearches.length > 0 && !searchValue.trim()) || (coursesLoading && !coursesLoaded));
    const dropdownItems = searchValue.trim() ? suggestions : recentSearches;

    const executeSearch = useCallback((term) => {
        const q = (typeof term === 'string' ? term : term?.title || '').trim();
        if (!q) return;
        saveRecentSearch(q);
        setSearchValue(q);
        setSearchFocused(false);
        setActiveSuggestionIndex(-1);
        const matched = allCourses.filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase()) || c.place.toLowerCase().includes(q.toLowerCase()));
        navigate(`/search?q=${encodeURIComponent(q)}`, { state: { results: matched, query: q } });
    }, [navigate, saveRecentSearch, allCourses]);

    const handleSearchSubmit = (e) => {
        if (e?.preventDefault) e.preventDefault();
        if (activeSuggestionIndex >= 0 && dropdownItems[activeSuggestionIndex]) {
            const item = dropdownItems[activeSuggestionIndex];
            if (typeof item === 'string') { executeSearch(item); }
            else { saveRecentSearch(item.title); setSearchValue(''); setSuggestions([]); setSearchFocused(false); setActiveSuggestionIndex(-1); navigate(`/course/${item.slug}`); }
        } else { executeSearch(searchValue); }
    };

    const handleSearchKeyDown = (e) => {
        if (!dropdownVisible) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestionIndex(p => p < dropdownItems.length - 1 ? p + 1 : 0); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestionIndex(p => p > 0 ? p - 1 : dropdownItems.length - 1); }
        else if (e.key === 'Escape') { setSearchFocused(false); setActiveSuggestionIndex(-1); searchInputRef.current?.blur(); }
    };

    return (
        <>
            <style>{`
                .courses-dropdown-wrapper,.about-dropdown-wrapper,.services-dropdown-wrapper{position:relative;display:inline-block;}
                .courses-dropdown-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(-10px);width:750px;background:white;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.12);border:1px solid #e0e0e0;overflow:hidden;opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s,transform 0.3s;z-index:1300;}
                .courses-dropdown-wrapper:hover .courses-dropdown-menu{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);}
                .about-dropdown-menu,.services-dropdown-menu{position:absolute;top:100%;right:0;min-width:220px;background:white;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.1);border:1px solid #e0e0e0;opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s,transform 0.3s;transform:translateY(-10px);z-index:1300;padding:8px 0;}
                .about-dropdown-wrapper:hover .about-dropdown-menu,.services-dropdown-wrapper:hover .services-dropdown-menu{opacity:1;visibility:visible;transform:translateY(0);}
                .dropdown-menu-item{padding:10px 16px;cursor:pointer;transition:all 0.2s;text-decoration:none;color:#000;display:block;font-family:"Droid Arabic Kufi",serif;font-size:0.85rem;}
                .dropdown-menu-item:hover{background-color:rgba(245,124,0,0.08);color:#f57c00;padding-right:24px;}
                .my-courses-nav-btn:hover { background-color: rgba(8,101,168,0.08) !important; transform: scale(1.05); }
                .admin-nav-btn {
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 3px !important;
                    width: 72px !important;
                    height: 26px !important;
                    padding: 0 !important;
                    background: #f57c00 !important;
                    color: #fff !important;
                    border-radius: 6px !important;
                    font-family: "Droid Arabic Kufi", serif !important;
                    font-size: 0.7rem !important;
                    font-weight: 700 !important;
                    text-decoration: none !important;
                    border: 2px solid #f57c00 !important;
                    transition: all 0.2s !important;
                    cursor: pointer !important;
                    white-space: nowrap !important;
                    flex-shrink: 0 !important;
                    line-height: 1 !important;
                }
                .admin-nav-btn:hover {
                    background: #fff !important;
                    color: #f57c00 !important;
                    box-shadow: 0 3px 10px rgba(245,124,0,0.28) !important;
                }
            `}</style>

            <AppBar
                position="fixed"
                elevation={4}
                sx={{
                    bgcolor: 'white',
                    color: '#000',
                    py: 0.5,
                    top: 0,
                    zIndex: 1100,
                    height:70
                    
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', display: 'flex', px: { xs: 1, md: 4 } }}>

                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        {isMobile && (<IconButton onClick={toggleDrawer(true)} sx={{ color: '#0865a8', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)' } }}><MenuIcon /></IconButton>)}
                        <Stack direction="row" alignItems="center" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
                            <Box component="img" src={logo} alt="ICEMT Logo" sx={{ height: 50, width: 'auto', minWidth: 50, flexShrink: 0 }} />
                            {!isSmallMobile && (<Box sx={{ mr: 1, textAlign: 'left' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#0865a8', fontSize: '0.8rem', whiteSpace: 'nowrap', fontFamily: '"Droid Arabic Kufi",serif' }}>المقاولون العرب</Typography>
                                <Typography variant="caption" sx={{ color: '#000', display: { xs: 'none', md: 'block' }, fontFamily: '"Droid Arabic Kufi",serif' }}>المعهد التكنولوجى لهندسة التشييد والإدارة</Typography>
                            </Box>)}
                        </Stack>
                    </Box>

                    {/* Desktop Courses Dropdown */}
                    {!isMobile && (
                        <div className="courses-dropdown-wrapper">
                            <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ px: 2, mx: 1, whiteSpace: 'nowrap', fontFamily: '"Droid Arabic Kufi",serif', color: '#000', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)', color: '#0865a8' } }}>الدورات التدريبية</Button>
                            <div className="courses-dropdown-menu">
                                <Box sx={{ display: 'flex', height: '420px' }} dir="rtl">
                                    <Box sx={{ width: '280px', borderLeft: '1px solid #e0e0e0', bgcolor: '#fafafa', overflowY: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#d0d0d0', borderRadius: '3px' } }}>
                                        <List sx={{ p: 1 }}>
                                            {loading ? (<ListItemButton><ListItemText primary="جاري التحميل..." primaryTypographyProps={{ fontSize: 13, fontFamily: '"Droid Arabic Kufi",serif', color: '#666' }} /></ListItemButton>)
                                                : error ? (<ListItemButton><ListItemText primary="حدث خطأ في التحميل" primaryTypographyProps={{ fontSize: 13, fontFamily: '"Droid Arabic Kufi",serif', color: '#f44336' }} /></ListItemButton>)
                                                    : mainCourses.map(cat => (
                                                        <ListItemButton key={cat.id} onMouseEnter={() => setSelectedCatId(cat.id)} selected={selectedCatId === cat.id} component={cat.link ? Link : 'div'} to={cat.link || undefined}
                                                            sx={{ py: 1.5, px: 2, mb: 0.5, borderRadius: 1.5, transition: 'all 0.2s', position: 'relative', '&.Mui-selected': { bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&::before': { content: '""', position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', bgcolor: '#f57c00', borderRadius: '0 2px 2px 0' } }, '&:hover': { bgcolor: selectedCatId === cat.id ? 'white' : 'rgba(8,101,168,0.05)' } }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: selectedCatId === cat.id ? '#f57c00' : '#0865a8', flexShrink: 0 }} />
                                                                <ListItemText primary={cat.title} primaryTypographyProps={{ fontSize: 13, fontFamily: '"Droid Arabic Kufi",serif', fontWeight: selectedCatId === cat.id ? 'bold' : '500', color: selectedCatId === cat.id ? '#0865a8' : '#333', lineHeight: 1.4 }} />
                                                            </Box>
                                                        </ListItemButton>
                                                    ))}
                                        </List>
                                    </Box>
                                    <Box sx={{ flex: 1, p: 2.5, bgcolor: 'white', overflowY: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#d0d0d0', borderRadius: '3px' } }}>
                                        {loading ? (<Box sx={{ textAlign: 'center', py: 4 }}><Typography sx={{ color: '#666', fontFamily: '"Droid Arabic Kufi",serif' }}>جاري التحميل...</Typography></Box>)
                                            : error ? (<Box sx={{ textAlign: 'center', py: 4 }}><Typography sx={{ color: '#f44336', fontFamily: '"Droid Arabic Kufi",serif' }}>حدث خطأ في التحميل</Typography></Box>)
                                                : activeCategory ? (<>
                                                    <Box sx={{ mb: 2.5, pb: 1.5, borderBottom: '2px solid #f57c00', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{ width: 4, height: 20, bgcolor: '#f57c00', borderRadius: 1 }} />
                                                        <Typography sx={{ color: '#0865a8', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi",serif', fontSize: '1rem' }}>{activeCategory.title}</Typography>
                                                    </Box>
                                                    {activeCategory.link && !activeCategory.sub && (
                                                        <Box sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                            <Typography sx={{ color: '#666', fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.9rem', mb: 1 }}>انقر على الفئة للانتقال إلى الصفحة</Typography>
                                                            <Button component={Link} to={activeCategory.link} variant="contained" sx={{ bgcolor: '#0865a8', color: 'white', fontFamily: '"Droid Arabic Kufi",serif', px: 4, py: 1, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#f57c00' } }}>عرض التفاصيل</Button>
                                                        </Box>
                                                    )}
                                                    {activeCategory.sub && (<Box>{activeCategory.sub.map((sub, idx) => (
                                                        <Box key={sub.id} sx={{ mb: 2.5, pb: 2, borderBottom: idx < activeCategory.sub.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                                                                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Typography sx={{ fontSize: 11, fontWeight: 'bold', color: '#0865a8', fontFamily: '"Droid Arabic Kufi",serif' }}>{idx + 1}</Typography></Box>
                                                                <Typography sx={{ fontWeight: 'bold', color: '#0865a8', fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.9rem' }}>{sub.title}</Typography>
                                                            </Box>
                                                            {sub.topics && (<Box sx={{ pr: 4 }}>{sub.topics.map(topic => (
                                                                <Link key={topic.id} to={topic.link} style={{ textDecoration: 'none' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.8, px: 1.5, mb: 0.5, borderRadius: 1, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(245,124,0,0.08)', transform: 'translateX(-4px)', '& .topic-bullet': { bgcolor: '#f57c00' } } }}>
                                                                        <Box className="topic-bullet" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#0865a8', mt: 0.8, flexShrink: 0, transition: 'all 0.2s' }} />
                                                                        <Typography sx={{ fontSize: '0.8rem', fontFamily: '"Droid Arabic Kufi",serif', color: '#444', lineHeight: 1.6 }}>{topic.name.length > 50 ? topic.name.substring(0, 50) + '...' : topic.name}</Typography>
                                                                    </Box>
                                                                </Link>
                                                            ))}</Box>)}
                                                        </Box>
                                                    ))}</Box>)}
                                                </>) : null}
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    <ClickAwayListener onClickAway={() => { setSearchFocused(false); setActiveSuggestionIndex(-1); }}>
                        <Box ref={searchBoxRef} sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, flexShrink: 1, justifyContent: 'center', width: { xs: 'auto', sm: '350px', md: '450px', lg: '550px' }, maxWidth: { xs: 'calc(100% - 200px)', sm: '350px', md: '450px', lg: '550px' }, mx: { xs: 0.5, sm: 1, md: 2 }, position: 'relative', minWidth: { xs: '120px', sm: '250px' } }}>
                            <Box component="form" onSubmit={handleSearchSubmit} role="search" sx={{ bgcolor: searchFocused ? '#ffffff' : '#f1f3f4', borderRadius: searchFocused && dropdownVisible ? '24px 24px 0 0' : 9, display: 'flex', alignItems: 'center', px: 2, py: 0.8, width: '100%', transition: 'all 0.2s', border: searchFocused ? '1px solid #0865a8' : '1px solid transparent', boxShadow: searchFocused ? '0 0 0 2px rgba(8,101,168,0.1)' : 'none', borderBottom: searchFocused && dropdownVisible ? '1px solid #e0e0e0' : undefined }}>
                                <InputBase inputRef={searchInputRef} name="q" value={searchValue} onChange={e => { setSearchValue(e.target.value); setActiveSuggestionIndex(-1); }} onFocus={() => setSearchFocused(true)} onKeyDown={handleSearchKeyDown} placeholder="بحث عن الدورات..." autoComplete="off" inputProps={{ 'aria-label': 'بحث عن الدورات', 'aria-autocomplete': 'both', 'aria-haspopup': 'true', 'aria-expanded': dropdownVisible, role: 'combobox' }} sx={{ color: '#000', flexGrow: 1, textAlign: 'right', fontFamily: '"Droid Arabic Kufi",serif', fontSize: { xs: '0.8rem', md: '0.95rem' }, pr: 1 }} />
                                {searchValue && (<IconButton size="small" onClick={() => { setSearchValue(''); setSuggestions([]); setActiveSuggestionIndex(-1); searchInputRef.current?.focus(); }} sx={{ p: 0.5, mr: 0.5 }} aria-label="مسح البحث"><CloseIcon sx={{ fontSize: 16, color: '#888' }} /></IconButton>)}
                                <IconButton type="submit" disabled={!searchValue.trim()} sx={{ p: 0.5, '&:hover': { bgcolor: 'transparent' }, '&.Mui-disabled': { opacity: 0.4 } }} aria-label="تنفيذ البحث"><SearchIcon sx={{ color: '#0865a8', fontSize: { xs: 18, md: 22 } }} /></IconButton>
                            </Box>

                            {dropdownVisible && (
                                <Paper elevation={6} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, borderRadius: '0 0 12px 12px', border: '1px solid #0865a8', borderTop: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden', bgcolor: 'white', maxHeight: '420px', overflowY: 'auto', '&::-webkit-scrollbar': { width: '5px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#d0d0d0', borderRadius: '3px' } }}>
                                    {suggestions.length === 0 && !searchValue.trim() && recentSearches.length > 0 && (<>
                                        <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <HistoryIcon sx={{ fontSize: 13, color: '#aaa' }} />
                                            <Typography sx={{ fontSize: '0.7rem', color: '#aaa', fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', letterSpacing: 0.6 }}>عمليات البحث الأخيرة</Typography>
                                        </Box>
                                        {recentSearches.map((term, i) => (
                                            <Box key={term} onMouseDown={() => { saveRecentSearch(term); setSearchValue(term); setSearchFocused(false); const matched = allCourses.filter(c => c.title.toLowerCase().includes(term.toLowerCase()) || c.description.toLowerCase().includes(term.toLowerCase())); navigate(`/search?q=${encodeURIComponent(term)}`, { state: { results: matched, query: term } }); }} onMouseEnter={() => setActiveSuggestionIndex(i)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 0.9, cursor: 'pointer', bgcolor: activeSuggestionIndex === i ? 'rgba(8,101,168,0.06)' : 'transparent', '&:hover': { bgcolor: 'rgba(8,101,168,0.06)' }, transition: 'background 0.15s' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <HistoryIcon sx={{ fontSize: 16, color: '#bbb', flexShrink: 0 }} />
                                                    <Typography sx={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.87rem', color: '#333', direction: 'rtl' }}>{term}</Typography>
                                                </Box>
                                                <IconButton size="small" onMouseDown={e => removeRecentSearch(term, e)} sx={{ p: 0.3, color: '#ccc', '&:hover': { color: '#f57c00' } }} aria-label="إزالة"><CloseIcon sx={{ fontSize: 12 }} /></IconButton>
                                            </Box>
                                        ))}
                                        <Box sx={{ height: '1px', bgcolor: '#f5f5f5', mx: 2 }} />
                                    </>)}
                                    {coursesLoading && !coursesLoaded && searchValue.trim() && (<Box sx={{ px: 2, py: 2, textAlign: 'center' }}><Typography sx={{ color: '#aaa', fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.82rem' }}>جاري تحميل الدورات...</Typography></Box>)}
                                    {suggestions.length > 0 && (<>
                                        <Box sx={{ px: 2, pt: 1.5, pb: 0.8, display: 'flex', alignItems: 'center', gap: 0.8, borderBottom: '1px solid #f5f5f5' }}>
                                            <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><SearchIcon sx={{ fontSize: 10, color: 'white' }} /></Box>
                                            <Typography sx={{ fontSize: '0.7rem', color: '#999', fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', letterSpacing: 0.5 }}>الدورات المطابقة ({suggestions.length})</Typography>
                                        </Box>
                                        {suggestions.map((course, i) => {
                                            const title = course.title || '';
                                            const q = searchValue.toLowerCase();
                                            const matchIdx = title.toLowerCase().indexOf(q);
                                            return (
                                                <Box key={course.id} onMouseDown={e => { e.preventDefault(); saveRecentSearch(title); setSearchValue(''); setSuggestions([]); setSearchFocused(false); setActiveSuggestionIndex(-1); navigate(`/course/${course.slug}`); }} onMouseEnter={() => setActiveSuggestionIndex(i)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, cursor: 'pointer', bgcolor: activeSuggestionIndex === i ? 'rgba(8,101,168,0.05)' : 'transparent', '&:hover': { bgcolor: 'rgba(8,101,168,0.05)' }, transition: 'background 0.15s', borderBottom: i < suggestions.length - 1 ? '1px solid #fafafa' : 'none' }}>
                                                    <Box sx={{ width: 52, height: 52, flexShrink: 0, borderRadius: '10px', overflow: 'hidden', background: 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(8,101,168,0.25)', position: 'relative' }}>
                                                        {course.image ? (<Box component="img" src={course.image} alt={title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : (<Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%', p: '7px', backdropFilter: 'blur(4px)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></Box>)}
                                                    </Box>
                                                    <Box sx={{ flexGrow: 1, minWidth: 0, direction: 'rtl' }}>
                                                        <Typography sx={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.88rem', fontWeight: '600', color: '#1a1a1a', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {matchIdx === -1 || !searchValue ? title : (<>{title.slice(0, matchIdx)}<Box component="span" sx={{ fontWeight: 'bold', color: '#0865a8', borderBottom: '1px solid rgba(8,101,168,0.3)' }}>{title.slice(matchIdx, matchIdx + searchValue.length)}</Box>{title.slice(matchIdx + searchValue.length)}</>)}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.4 }}>
                                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'rgba(8,101,168,0.09)', px: 0.8, py: 0.2, borderRadius: '4px', flexShrink: 0 }}><Typography sx={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.68rem', color: '#0865a8', fontWeight: 'bold' }}>دورة</Typography></Box>
                                                            {(course.category || course.place) && (<Typography sx={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.72rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.category || course.place}</Typography>)}
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ opacity: activeSuggestionIndex === i ? 1 : 0, transition: 'opacity 0.15s', color: '#0865a8', flexShrink: 0 }}><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></Box>
                                                </Box>
                                            );
                                        })}
                                    </>)}
                                    {!coursesLoading && coursesLoaded && searchValue.trim() && suggestions.length === 0 && (<Box sx={{ px: 2, py: 2, textAlign: 'center' }}><Typography sx={{ color: '#aaa', fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.82rem' }}>لا توجد نتائج لـ &quot;{searchValue}&quot;</Typography></Box>)}
                                    {searchValue.trim() && (<Box onMouseDown={e => { e.preventDefault(); executeSearch(searchValue); }} sx={{ px: 2, py: 1, borderTop: '1px solid #f0f0f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(8,101,168,0.02)', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)' }, transition: 'background 0.15s' }}><SearchIcon sx={{ fontSize: 15, color: '#0865a8' }} /><Typography sx={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.82rem', color: '#0865a8', fontWeight: 'bold', direction: 'rtl' }}>عرض جميع النتائج لـ &quot;{searchValue}&quot;</Typography></Box>)}
                                </Paper>
                            )}
                        </Box>
                    </ClickAwayListener>

                    {/* Right side */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 }, flexShrink: 0 }}>
                        {!isMobile && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <div className="about-dropdown-wrapper">
                                    <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ px: 1.5, fontFamily: '"Droid Arabic Kufi",serif', color: '#000', fontSize: '0.9rem', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)', color: '#0865a8' } }}>عن المعهد</Button>
                                    <div className="about-dropdown-menu">
                                        {aboutLinks.map(link => {
                                            const path = aboutLinkPaths[link] || `/about/${link.replace(/\s+/g, '-')}`;
                                            const isPdf = path.endsWith('.pdf');
                                            return (<Link key={link} to={!isPdf ? path : '#'} onClick={isPdf ? e => { e.preventDefault(); window.open(path, '_blank'); } : undefined} className="dropdown-menu-item">{link}</Link>);
                                        })}
                                    </div>
                                </div>
                                <Button color="inherit" component={Link} to="/news" sx={{ px: 1.5, fontFamily: '"Droid Arabic Kufi",serif', color: '#000', fontSize: '0.9rem', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)', color: '#0865a8' } }}>الأخبار</Button>
                                <Button color="inherit" component={Link} to="/library" sx={{ px: 1.5, fontFamily: '"Droid Arabic Kufi",serif', color: '#000', fontSize: '0.9rem', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)', color: '#0865a8' } }}>المكتبة</Button>
                                <div className="services-dropdown-wrapper">
                                    <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ px: 1.5, fontFamily: '"Droid Arabic Kufi",serif', color: '#000', fontSize: '0.9rem', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)', color: '#0865a8' } }}>الخدمات</Button>
                                    <div className="services-dropdown-menu">
                                        {serviceLinks.map((item, idx) => (<Link key={idx} to={item.path} className="dropdown-menu-item">{item.title}</Link>))}
                                    </div>
                                </div>

                                {/* ✅ Admin button — Desktop — visible only to admin emails when signed in */}
                                {isAdmin && (
                                    <Link to="/admin" className="admin-nav-btn">
                                        <AdminPanelSettingsIcon sx={{ fontSize: 12 }} />
                                        الإدارة
                                    </Link>
                                )}
                            </Stack>
                        )}

                        {/* My Courses icon — shown only when signed in */}
                        <SignedIn>
                            <IconButton
                                className="my-courses-nav-btn"
                                component={Link}
                                to="/my-courses"
                                size="small"
                                title="دوراتي"
                                sx={{
                                    position: 'relative',
                                    transition: 'all 0.2s',
                                    color: '#0865a8',
                                    '&:hover': { backgroundColor: 'rgba(8,101,168,0.08)', transform: 'scale(1.05)' }
                                }}
                            >
                                <MenuBookIcon sx={{ fontSize: 22 }} />
                            </IconButton>
                        </SignedIn>

                        {/* Cart icon */}
                        <IconButton color="inherit" size="small" component={Link} to="/cart" sx={{ position: 'relative', transition: 'all 0.2s', color: '#0865a8', '&:hover': { backgroundColor: 'rgba(8,101,168,0.08)', transform: 'scale(1.05)' } }}>
                            <Badge badgeContent={cartCount} sx={{ '& .MuiBadge-badge': { bgcolor: '#f57c00', color: 'white', fontSize: '0.7rem', height: '18px', minWidth: '18px', padding: '0 4px', fontFamily: '"Droid Arabic Kufi",serif' } }}>
                                <ShoppingCartIcon sx={{ fontSize: 22 }} />
                            </Badge>
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SignedOut>
                                <SignInButton mode="modal"  appearance={{ variables: { colorPrimary: '#0865a8', colorText: '#000000', colorBackground: '#ffffff', fontFamily: '"Droid Arabic Kufi",serif', borderRadius: '12px' }, elements: { card: { direction: 'ltr', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #0865a8', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }, headerTitle: { textAlign: 'center', color: '#0865a8', fontWeight: '700' }, headerSubtitle: { textAlign: 'center', color: '#000000' }, formFieldLabel: { textAlign: 'left', color: '#000000', fontWeight: '600' }, formFieldInput: { textAlign: 'left', borderRadius: '8px', border: '1px solid #0865a8' }, formButtonPrimary: { backgroundColor: '#0865a8', color: '#ffffff', fontWeight: '600', '&:hover': { backgroundColor: '#f57c00' } }, footerAction: { textAlign: 'left' }, footerActionLink: { color: '#f57c00', fontWeight: '600' } } }}>
                                    <Button variant="contained" size="small" sx={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.8rem', bgcolor: '#0865a8', color: '#ffffff', px: 1, py: 0.5, borderRadius: 5, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(8,101,168,0.25)', minWidth: 'auto', '&:hover': { bgcolor: '#f57c00', boxShadow: '0 6px 18px rgba(245,124,0,0.35)' } }}>تسجيل دخول</Button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton afterSignOutUrl="/" appearance={{ variables: { colorPrimary: '#0865a8', colorText: '#000000', fontFamily: '"Droid Arabic Kufi",serif' }, elements: { userButtonAvatarBox: { border: '2px solid #0865a8' }, userButtonPopoverCard: { direction: 'ltr', textAlign: 'left', borderRadius: '12px', border: '1px solid #0865a8' }, userButtonPopoverActionButton: { fontFamily: '"Droid Arabic Kufi",serif', textAlign: 'left', '&:hover': { backgroundColor: '#f57c00', color: '#ffffff' } } } }} />
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
                        <Typography variant="h6" sx={{ fontFamily: '"Droid Arabic Kufi",serif', color: '#0865a8', fontWeight: 'bold' }}>القائمة</Typography>
                        <IconButton onClick={toggleDrawer(false)} sx={{ color: '#f57c00', '&:hover': { bgcolor: 'rgba(245,124,0,0.08)' } }}><CloseIcon /></IconButton>
                    </Box>
                    <List>
                        <ListItemButton onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)} sx={{ bgcolor: mobileCoursesOpen ? 'rgba(8,101,168,0.08)' : 'transparent', borderRadius: 1, mb: 0.5, '&:hover': { bgcolor: 'rgba(8,101,168,0.12)' } }}>
                            <ListItemText primary="الدورات التدريبية" sx={{ textAlign: 'left', '& .MuiTypography-root': { fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', color: '#0865a8' } }} />
                            {mobileCoursesOpen ? <ExpandMoreIcon sx={{ color: '#0865a8' }} /> : <ChevronLeftIcon sx={{ color: '#0865a8' }} />}
                        </ListItemButton>
                        <Collapse in={mobileCoursesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {loading ? (<ListItemButton><ListItemText primary="جاري التحميل..." sx={{ '& .MuiTypography-root': { fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.9rem', color: '#666' } }} /></ListItemButton>)
                                    : error ? (<ListItemButton><ListItemText primary="حدث خطأ في التحميل" sx={{ '& .MuiTypography-root': { fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.9rem', color: '#f44336' } }} /></ListItemButton>)
                                        : mainCourses.map(course => (
                                            <React.Fragment key={course.id}>
                                                <ListItemButton onClick={() => { if (course.link) { navigate(course.link); toggleDrawer(false)(); } else if (course.sub) { setOpenSub(openSub === course.id ? null : course.id); } }} sx={{ bgcolor: 'rgba(0,0,0,0.02)', mb: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(245,124,0,0.08)' } }}>
                                                    <ListItemText primary={course.title} sx={{ '& .MuiTypography-root': { fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.9rem' } }} />
                                                    {course.sub && (openSub === course.id ? <ExpandMoreIcon fontSize="small" sx={{ color: '#f57c00' }} /> : <ChevronLeftIcon fontSize="small" sx={{ color: '#0865a8' }} />)}
                                                </ListItemButton>
                                                {course.sub && (
                                                    <Collapse in={openSub === course.id} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding sx={{ pr: 2 }}>
                                                            {course.sub.map(subItem => (
                                                                <React.Fragment key={subItem.id}>
                                                                    <ListItemButton onClick={() => subItem.topics && setOpenTopic(openTopic === subItem.id ? null : subItem.id)} sx={{ borderRight: '3px solid #0865a8', '&:hover': { bgcolor: 'rgba(8,101,168,0.08)' } }}>
                                                                        <ListItemText primary={subItem.title} sx={{ '& .MuiTypography-root': { fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.85rem', color: '#0865a8', fontWeight: 'bold' } }} />
                                                                        {subItem.topics && (openTopic === subItem.id ? <ExpandMoreIcon fontSize="small" sx={{ color: '#f57c00' }} /> : <ChevronLeftIcon fontSize="small" sx={{ color: '#0865a8' }} />)}
                                                                    </ListItemButton>
                                                                    {subItem.topics && (
                                                                        <Collapse in={openTopic === subItem.id} timeout="auto" unmountOnExit>
                                                                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                                                                {subItem.topics.map(topic => (
                                                                                    <ListItemButton key={topic.id} component={Link} to={topic.link || '#'} onClick={toggleDrawer(false)} sx={{ '&:hover': { bgcolor: 'rgba(245,124,0,0.08)' } }}>
                                                                                        <ListItemText primary={topic.name} primaryTypographyProps={{ fontSize: '0.8rem', color: '#000', fontFamily: '"Droid Arabic Kufi",serif' }} />
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

                        {/* My Courses in mobile drawer — only shown when signed in */}
                        <SignedIn>
                            <ListItemButton component={Link} to="/my-courses" onClick={toggleDrawer(false)} sx={{ borderRadius: 1, mb: 0.5, bgcolor: 'rgba(8,101,168,0.05)', '&:hover': { bgcolor: 'rgba(8,101,168,0.12)' } }}>
                                <MenuBookIcon sx={{ color: '#0865a8', mr: 1, fontSize: 20 }} />
                                <ListItemText primary="دوراتي" primaryTypographyProps={{ fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', color: '#0865a8' }} />
                            </ListItemButton>
                            <Divider sx={{ my: 2, bgcolor: '#0865a8', height: 2 }} />
                        </SignedIn>

                        {/* ✅ Admin button — Mobile Drawer — visible only to admin emails when signed in */}
                        {isAdmin && (
                            <>
                                <ListItemButton
                                    component={Link}
                                    to="/admin"
                                    onClick={toggleDrawer(false)}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 0.5,
                                        bgcolor: '#f57c00',
                                        border: '2px solid #f57c00',
                                        '&:hover': { bgcolor: '#e65100', borderColor: '#e65100' },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <AdminPanelSettingsIcon sx={{ color: '#fff', mr: 1, fontSize: 20 }} />
                                    <ListItemText
                                        primary="لوحة الإدارة"
                                        primaryTypographyProps={{
                                            fontFamily: '"Droid Arabic Kufi",serif',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                        }}
                                    />
                                </ListItemButton>
                                <Divider sx={{ my: 2, bgcolor: '#f57c00', height: 2 }} />
                            </>
                        )}

                        <ListItemButton onClick={() => setMobileAboutOpen(!mobileAboutOpen)} sx={{ bgcolor: mobileAboutOpen ? 'rgba(8,101,168,0.08)' : 'transparent', borderRadius: 1, mb: 0.5, '&:hover': { bgcolor: 'rgba(8,101,168,0.12)' } }}>
                            <ListItemText primary="عن المعهد" sx={{ textAlign: 'left', '& .MuiTypography-root': { fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', color: '#0865a8' } }} />
                            {mobileAboutOpen ? <ExpandMoreIcon sx={{ color: '#0865a8' }} /> : <ChevronLeftIcon sx={{ color: '#0865a8' }} />}
                        </ListItemButton>
                        <Collapse in={mobileAboutOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {aboutLinks.map(link => {
                                    const path = aboutLinkPaths[link] || `/about/${link.replace(/\s+/g, '-')}`;
                                    const isPdf = path.endsWith('.pdf');
                                    return (<ListItemButton key={link} component={isPdf ? 'a' : Link} to={!isPdf ? path : undefined} href={isPdf ? path : undefined} target={isPdf ? '_blank' : undefined} rel={isPdf ? 'noopener noreferrer' : undefined} onClick={!isPdf ? toggleDrawer(false) : undefined} sx={{ '&:hover': { bgcolor: 'rgba(245,124,0,0.08)' } }}><ListItemText primary={link} primaryTypographyProps={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.85rem' }} /></ListItemButton>);
                                })}
                            </List>
                        </Collapse>
                        <Divider sx={{ my: 2, bgcolor: '#0865a8', height: 2 }} />
                        <ListItemButton onClick={() => setMobileServicesOpen(!mobileServicesOpen)} sx={{ bgcolor: mobileServicesOpen ? 'rgba(8,101,168,0.08)' : 'transparent', borderRadius: 1, mb: 0.5, '&:hover': { bgcolor: 'rgba(8,101,168,0.12)' } }}>
                            <ListItemText primary="الخدمات" sx={{ textAlign: 'left', '& .MuiTypography-root': { fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', color: '#0865a8' } }} />
                            {mobileServicesOpen ? <ExpandMoreIcon sx={{ color: '#0865a8' }} /> : <ChevronLeftIcon sx={{ color: '#0865a8' }} />}
                        </ListItemButton>
                        <Collapse in={mobileServicesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {serviceLinks.map((item, idx) => (<ListItemButton key={idx} component={Link} to={item.path} onClick={toggleDrawer(false)} sx={{ '&:hover': { bgcolor: 'rgba(245,124,0,0.08)' } }}><ListItemText primary={item.title} primaryTypographyProps={{ fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.85rem' }} /></ListItemButton>))}
                            </List>
                        </Collapse>
                        <Divider sx={{ my: 2, bgcolor: '#0865a8', height: 2 }} />
                        <ListItemButton component={Link} to="/news" onClick={toggleDrawer(false)} sx={{ borderRadius: 1, mb: 0.5, '&:hover': { bgcolor: 'rgba(245,124,0,0.08)' } }}><ListItemText primary="الأخبار" primaryTypographyProps={{ fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', color: '#0865a8' }} /></ListItemButton>
                        <ListItemButton component={Link} to="/library" onClick={toggleDrawer(false)} sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(245,124,0,0.08)' } }}><ListItemText primary="المكتبة" primaryTypographyProps={{ fontFamily: '"Droid Arabic Kufi",serif', fontWeight: 'bold', color: '#0865a8' }} /></ListItemButton>
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ height: { xs: 56, sm: 64, md: 70 } }} />
        </>
    );
};

export default Navbar;
