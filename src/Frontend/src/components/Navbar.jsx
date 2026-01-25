import React, { useState } from 'react';

import {
    AppBar, Toolbar, Box, IconButton, InputBase, Menu, MenuItem,
    Avatar, Badge, Button, Divider, Typography, Stack, Popover, List,
    ListItemButton, ListItemText, useMediaQuery, useTheme, Grid, Drawer, Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom'; import logo from '../assets/logo-removebg-preview.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import AuthSync from '../components/AuthSync.jsx';


const Navbar = () => {
    const [coursesAnchor, setCoursesAnchor] = useState(null);
    const [aboutAnchor, setAboutAnchor] = useState(null);
    const [servicesAnchor, setServicesAnchor] = useState(null); // Added for Services
    const [accountAnchor, setAccountAnchor] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);

    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const aboutLinks = [
        'نبذة عامة', 'الرؤية والأهداف', 'الشهادات والاعتمادات', 'فريق العمل',
        'قائمة المحاضرين', 'الخطة التدريبية', 'التقرير الشهرى',
        'مكتبة الصور والفيديوهات', 'البروتوكولات والإتفاقيات', 'عملاؤنا'
    ];

    // Added the specific Services links you requested
    const serviceLinks = [
        {
            title: 'التدريب الحرفى',
            path: '/vocational-training', // رابط مباشر بدون قائمة فرعية
        },
        { title: 'التعليم الفنى', path: '/technical-education' },
        { title: 'الإختبارات', path: '/tests' },
        { title: 'مجلس قادة المستقبل', path: '/future-leaders' },
    ];

    const mainCourses = [
        {
            id: 1,
            title: 'برامج موجهة للمهندسين',
            sub: [
                {
                    id: 11,
                    title: 'برامج تأهيلية',
                    topics: [
                        { id: 111, name: 'برنامج إعداد وتأهيل مهندس حديث مدنى وعمارة', link: '/courses/civil-engineer-training' },
                        { id: 112, name: 'إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء', link: '/courses/mechanical-electrical-training' }
                    ]
                },
                {
                    id: 12,
                    title: 'برامج عامة',
                    topics: [
                        {
                            id: 121,
                            name: 'المحور الأول : المعلومات الهندسية الأساسية',
                            link: '/courses/basic-engineering-info',
                            subTopics: [
                                { id: 1211, name: 'لمهندسى مدنى وعمارة', link: '/courses/basic-civil-architecture' },
                                { id: 1212, name: 'لمهندسى ميكانيكا وكهرباء', link: '/courses/basic-mechanical-electrical' }
                            ]
                        },
                        {
                            id: 122,
                            name: 'المحور الثانى : التطبيقات الهندسية المختلفة',
                            link: '/courses/engineering-applications',
                            subTopics: [
                                { id: 1221, name: 'لمهندسى مساحة', link: '/courses/app-surveying' },
                                { id: 1222, name: 'لمهندسى ميكانيكا', link: '/courses/app-mechanical' },
                                { id: 1223, name: 'لمهندسى كهرباء', link: '/courses/app-electrical' },
                                { id: 1224, name: 'لمهندسى مدنى و عمارة', link: '/courses/app-civil-architecture' }
                            ]
                        },
                        {
                            id: 123,
                            name: 'المحور الثالث : إدارة المشروعات والجودة',
                            link: '/courses/project-management-quality',
                            subTopics: [
                                { id: 1231, name: 'برامج إدارة المشروعات', link: '/courses/project-management-programs' },
                                {
                                    id: 1232,
                                    name: 'برامج الجودة',
                                    link: '/courses/quality-programs',
                                    subSubTopics: [
                                        { id: 12321, name: 'مهندسين التصنيع والتنفيذ ومهندسين الجودة QC', link: '/courses/quality-engineers-qc' },
                                        { id: 12322, name: 'لحامين ومشرفين التنفيذ ومراقبي الجودة QC', link: '/courses/quality-welders-supervisors' }
                                    ]
                                }
                            ]
                        },
                        { id: 124, name: 'المحور الرابع : الطرق المختلفة لدعم اتخاذ القرار وحل المشكلات', link: '/courses/decision-making' },
                        { id: 125, name: 'المحور الخامس : العقود والعطاءات والمشتريات', link: '/courses/contracts-tenders' },
                        { id: 126, name: 'المحور السادس : السلامه والصحة المهنية', link: '/courses/safety-health' },
                        { id: 127, name: 'المحور السابع : البيئة والتنمية المستدامه', link: '/courses/environment-sustainability' },
                        { id: 128, name: 'المحور الثامن : مهارات الإتصال و الإدارية و الإشرافية', link: '/courses/communication-skills' },
                        { id: 129, name: 'المحور التاسع : اخلاقيات المهنه وتطوير المسار المهنى', link: '/courses/ethics-career' }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: 'برامج موجهة للماليين',
            sub: [
                {
                    id: 21,
                    title: 'برامج مالية',
                    topics: [
                        { id: 211, name: 'عليا', link: '/courses/financial-senior' },
                        { id: 212, name: 'وسطى', link: '/courses/financial-middle' },
                        { id: 213, name: 'تنفيذى', link: '/courses/financial-executive' }
                    ]
                }
            ]
        },
        { id: 3, title: 'برامج موجهة للأمن', link: '/courses/basic-security' },
        { id: 4, title: 'برامج مركز جسر السويس', link: '/courses/suez-bridge-center' },
        { id: 5, title: 'برامج مركز شبرا', link: '/courses/shubra-center' },
        { id: 7, title: 'برامج مالية موجهه لغير الماليين', link: '/courses/financial-non-financial' },
        { id: 8, title: 'برامج تأهيلية لأعضاء المجلس التنفيذى لشباب قادة المستقبل', link: '/courses/future-leaders' },
        {
            id: 9,
            title: 'برامج القطاع القانوني والعقارى',
            sub: [
                {
                    id: 31,
                    title: 'برامج قانونية وعقارية',
                    topics: [
                        { id: 311, name: 'إجراءات وضمانات التحقيق الإداري وطرق التظلم من نتيجته على ضوء لوائح الشركة', link: '/courses/admin-investigation' },
                        { id: 312, name: 'النفقات وحجز ما للمدين لدى الغير', link: '/courses/expenses-seizure' }
                    ]
                }
            ]
        },
        {
            id: 10,
            title: 'برامج الإدارة الطبية',
            sub: [
                {
                    id: 91,
                    title: 'برامج إدارة طبية',
                    topics: [
                        { id: 911, name: 'برامج الإدارة الطبية', link: '/courses/medical-administration' }
                    ]
                }
            ]
        }
    ];

    const aboutLinkPaths = {
        'نبذة عامة': '/overview',
        'الرؤية والأهداف': '/mission',
        'الشهادات والاعتمادات': '/certifications',
        'فريق العمل': '/team',
        'قائمة المحاضرين': '/instructors',
        'الخطة التدريبية': '/pdf/ICEMT_Plan_Training.pdf', // تأكد من وجود المجلد والملف في public
        'التقرير الشهرى': '/pdf/ICEMT_Monthly_Activity.pdf',
        'مكتبة الصور والفيديوهات': '/gallery',
        'البروتوكولات والإتفاقيات': '/protocols',
        'عملاؤنا': '/customers',
    };

    const [selectedCatId, setSelectedCatId] = useState(1);
    const [selectedSubId, setSelectedSubId] = useState(null);

    const activeCategory = mainCourses.find(c => c.id === selectedCatId) || mainCourses[0];
    const activeSub = activeCategory.sub?.find(s => s.id === selectedSubId) || activeCategory.sub?.[0];

    const [openSub, setOpenSub] = React.useState(null);
    const [openTopic, setOpenTopic] = React.useState(null);

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
        setServicesAnchor(null); // Close services
        setAccountAnchor(null);
    };
    const toggleDrawer = (open) => () => setMobileOpen(open);

    return (
        <>
            {/* Changed position to sticky and top to 0 to ensure it stays at top on scroll */}
            <AppBar position="fixed" elevation={4}  sx={{ bgcolor: 'white', color: 'black', py: 0.5, top: 1, zIndex: 1100 }}>
                <Toolbar sx={{ justifyContent: 'space-between', display: 'flex', px: { xs: 1, md: 4 } }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isMobile && (
                            <IconButton onClick={toggleDrawer(true)}>
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
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#0d47a1', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                        المقاولون العرب
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#0d47a1', display: { xs: 'none', md: 'block' } }}>
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
                            sx={{ px: 2, mx: 1, whiteSpace: 'nowrap' }}
                        >
                            الدورات التدريبية
                        </Button>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                            justifyContent: 'center',
                            maxWidth: { xs: '70%', sm: '500px', md: '800px' },
                            mx: { xs: 1, md: 4 }
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: '#f1f3f4',
                                borderRadius: 9,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                                py: 0.8,
                                width: '100%',
                                transition: 'all 0.3s ease',
                                '&:focus-within': {
                                    bgcolor: '#ffffff',
                                    boxShadow: '0 0 0 2px #0d47a1',
                                }
                            }}
                        >
                            <InputBase
                                placeholder="بحث عن الدورات..."
                                sx={{
                                    color: 'black',
                                    flexGrow: 1,
                                    textAlign: 'right',
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    fontSize: { xs: '0.8rem', md: '0.95rem' },
                                    pr: 1
                                }}
                            />
                            <SearchIcon sx={{ color: 'gray', fontSize: { xs: 18, md: 22 } }} />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        {!isMobile && (
                            <Stack direction="row" spacing={1}>
                                <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} onMouseEnter={(e) => setAboutAnchor(e.currentTarget)}>عن المعهد</Button>
                                <Button color="inherit" component={Link} to="/news">الأخبار</Button>
                                <Button color="inherit" component={Link} to="/library">المكتبة</Button>

                                {/* Updated Services Button with hover */}
                                <Button
                                    color="inherit"
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onMouseEnter={(e) => setServicesAnchor(e.currentTarget)}
                                >
                                    الخدمات
                                </Button>
                            </Stack>
                        )}

                        <IconButton color="inherit" size="small">
                            <Badge badgeContent={2} color="primary">
                                <ShoppingCartIcon sx={{ fontSize: 22 }} />
                            </Badge>
                        </IconButton>

                        <Box sx={{ borderRight: '1px solid #ddd', pl: 2, ml: 1, display: 'flex', alignItems: 'center' }}>
                            <SignedOut><SignInButton mode="modal" /></SignedOut>
                            <SignedIn><UserButton afterSignOutUrl="/" /><AuthSync /></SignedIn>
                        </Box>

                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 280, p: 2 }} dir="rtl">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                        <IconButton onClick={toggleDrawer(false)} sx={{ mb: 2 }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>                    <List>
                        <ListItemButton onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}>
                            <ListItemText primary="الدورات التدريبية" sx={{ textAlign: 'right' }} />
                            {mobileCoursesOpen ? <ExpandMoreIcon /> : <ChevronLeftIcon />}
                        </ListItemButton>

                        <Collapse in={mobileCoursesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {mainCourses.map(course => (
                                    <React.Fragment key={course.id}>
                                        <ListItemButton
                                            onClick={() => course.sub && setOpenSub(openSub === course.id ? null : course.id)}
                                            component={course.link ? Link : 'div'}
                                            to={course.link || '#'}
                                            sx={{ bgcolor: 'rgba(0,0,0,0.02)', mb: 0.5 }}
                                        >
                                            <ListItemText primary={course.title} />
                                            {course.sub && (openSub === course.id ? <ExpandMoreIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />)}
                                        </ListItemButton>

                                        {course.sub && (
                                            <Collapse in={openSub === course.id} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding sx={{ pr: 2 }}>
                                                    {course.sub.map(subItem => (
                                                        <React.Fragment key={subItem.id}>
                                                            <ListItemButton
                                                                onClick={() => subItem.topics && setOpenTopic(openTopic === subItem.id ? null : subItem.id)}
                                                                sx={{ borderRight: '2px solid #ddd' }}
                                                            >
                                                                <ListItemText primary={subItem.title} />
                                                                {subItem.topics && (openTopic === subItem.id ? <ExpandMoreIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />)}
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
                                                                            >
                                                                                <ListItemText
                                                                                    primary={topic.name}
                                                                                    primaryTypographyProps={{ fontSize: '0.85rem', color: 'text.secondary' }}
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
                        <Divider sx={{ my: 1 }} />
                        {aboutLinks.map(link => (
                            <ListItemButton key={link} component={Link} to={aboutLinkPaths[link] || '#'} onClick={toggleDrawer(false)}>
                                <ListItemText primary={link} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Popover
                open={Boolean(coursesAnchor)}
                anchorEl={coursesAnchor}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                slotProps={{
                    paper: {
                        onMouseLeave: handleClose,
                        sx: { width: 900, mt: 1, borderRadius: 0, boxShadow: 6, border: '1px solid #d1d7dc' }
                    }
                }}
            >
                <Box sx={{ display: 'flex', height: 450 }} dir="rtl">
                    <List sx={{ width: 280, borderLeft: '1px solid #d1d7dc', p: 0, bgcolor: '#f8f9fa' }}>
                        {mainCourses.map((cat) => (
                            <ListItemButton
                                key={cat.id}
                                onMouseEnter={() => setSelectedCatId(cat.id)}
                                selected={selectedCatId === cat.id}
                                sx={{ py: 1.5, '&.Mui-selected': { bgcolor: 'white', color: '#0d47a1' } }}
                            >
                                <ListItemText primary={cat.title} primaryTypographyProps={{ fontSize: 13.5, fontFamily: '"Droid Arabic Kufi", serif' }} />
                                <ChevronLeft fontSize="small" sx={{ opacity: 0.3 }} />
                            </ListItemButton>
                        ))}
                    </List>
                    <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'white' }}>
                        <Typography variant="subtitle2" sx={{ color: '#f57c00', fontWeight: 'bold', mb: 2 }}>{activeCategory.title}</Typography>
                        <Grid container spacing={2}>
                            {activeCategory.sub?.map((sub) => (
                                <Grid item xs={6} key={sub.id}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, color: '#0865A8' }}>{sub.title}</Typography>
                                    {sub.topics?.map((topic) => (
                                        <Link key={topic.id} to={topic.link} style={{ textDecoration: 'none' }} onClick={handleClose}>
                                            <Typography
                                                variant="caption"
                                                sx={{ display: 'block', color: '#666', mb: 0.5, cursor: 'pointer', '&:hover': { color: '#f57c00' } }}
                                            >
                                                • {topic.name}
                                            </Typography>
                                        </Link>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Popover>

            <Menu
                anchorEl={aboutAnchor}
                open={Boolean(aboutAnchor)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: handleClose }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    direction: 'rtl',
                    '& .MuiPaper-root': { minWidth: '220px' }
                }}
            >
                {aboutLinks.map((link) => {
                    const path = aboutLinkPaths[link] || `/about/${link.replace(/\s+/g, '-')}`;
                    const isPdf = path.endsWith('.pdf');

                    return (
                        <MenuItem
                            key={link}
                            // إذا كان الرابط PDF نستخدم 'a' لفتحه في نافذة جديدة، وإذا كان صفحة داخلية نستخدم Link
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
                                textDecoration: 'none', // لضمان عدم وجود خط تحت روابط الـ a
                                color: 'inherit',
                                '&:hover': { bgcolor: '#f5f5f5', color: '#f57c00' }
                            }}
                        >
                            {link}
                        </MenuItem>
                    );
                })}
            </Menu>

            {/* --- UPDATED SERVICES DROPDOWN MENU --- */}
            <Menu
                anchorEl={servicesAnchor}
                open={Boolean(servicesAnchor)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: () => setServicesAnchor(null) }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    direction: 'rtl',
                    '& .MuiPaper-root': { minWidth: '220px' }
                }}
            >
                {serviceLinks.map((item, index) => (
                    <React.Fragment key={index}>
                        {/* Main Category Link */}
                        <MenuItem
                            component={Link}
                            to={item.path}
                            onClick={() => setServicesAnchor(null)}
                            sx={{
                                fontFamily: '"Droid Arabic Kufi", serif',
                                fontSize: '0.85rem',
                                fontWeight: item.subLinks ? 'bold' : 'normal', // Bold if it has sub-items
                                textAlign: 'right',
                                width: '100%',
                                justifyContent: 'flex-end',
                                '&:hover': { bgcolor: '#f5f5f5', color: '#f57c00' }
                            }}
                        >
                            {item.title}
                        </MenuItem>

                        {/* Sub-Links (e.g., جسر السويس / شبرا) */}
                        {item.subLinks && item.subLinks.map((sub, subIndex) => (
                            <MenuItem
                                key={`${index}-${subIndex}`}
                                component={Link}
                                to={sub.path}
                                onClick={() => setServicesAnchor(null)}
                                sx={{
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    fontSize: '0.75rem', // Slightly smaller
                                    textAlign: 'right',
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                    pr: 4, // Indent to the right for RTL
                                    '&:hover': { bgcolor: '#f5f5f5', color: '#f57c00' }
                                }}
                            >
                                {sub.title}
                                <span style={{ marginRight: '8px' }}>•</span>
                            </MenuItem>
                        ))}
                    </React.Fragment>
                ))}
            </Menu>
            <br />
            <br />
            <br />

           


        </>
    );
};

export default Navbar;