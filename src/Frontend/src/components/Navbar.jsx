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
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-removebg-preview.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import AuthSync from '../components/AuthSync.jsx';



const Navbar = () => {
    const [coursesAnchor, setCoursesAnchor] = useState(null);
    const [aboutAnchor, setAboutAnchor] = useState(null);
    const [servicesAnchor, setServicesAnchor] = useState(null);
    const [accountAnchor, setAccountAnchor] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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
        {
            title: 'التدريب الحرفى',
            path: '/vocational-training',
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
        'الخطة التدريبية': '/pdf/ICEMT_Plan_Training.pdf',
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
        setServicesAnchor(null);
        setAccountAnchor(null);
    };
    const toggleDrawer = (open) => () => setMobileOpen(open);

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
                                border: '1px solid transparent',
                                '&:focus-within': {
                                    bgcolor: '#ffffff',
                                    border: '1px solid #0865a8',
                                    boxShadow: '0 0 0 2px rgba(8, 101, 168, 0.1)',
                                }
                            }}
                        >
                            <InputBase
                                placeholder="بحث عن الدورات..."
                                sx={{
                                    color: '#000',
                                    flexGrow: 1,
                                    textAlign: 'right',
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    fontSize: { xs: '0.8rem', md: '0.95rem' },
                                    pr: 1
                                }}
                            />
                            <SearchIcon sx={{ color: '#0865a8', fontSize: { xs: 18, md: 22 } }} />
                        </Box>
                    </Box>

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
                                badgeContent={2}
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
        دخول
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
                                {mainCourses.map(course => (
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
                            {mainCourses.map((cat) => (
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
                                        {cat.link && (
                                            <Box
                                                sx={{
                                                    fontSize: 10,
                                                    bgcolor: '#0865a8',
                                                    color: 'white',
                                                    px: 1,
                                                    py: 0.3,
                                                    borderRadius: 0.5,
                                                    fontFamily: '"Droid Arabic Kufi", serif'
                                                }}
                                            >
                                                مباشر
                                            </Box>
                                        )}
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
                                                {sub.topics.slice(0, 4).map((topic) => (
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

                                                {/* Show More Button */}
                                                {sub.topics.length > 4 && (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            pr: 3,
                                                            mt: 1,
                                                            cursor: 'pointer',
                                                            '&:hover .more-text': {
                                                                color: '#f57c00'
                                                            }
                                                        }}
                                                    >
                                                        <Typography
                                                            className="more-text"
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                                color: '#0865a8',
                                                                fontWeight: 'bold',
                                                                transition: 'color 0.2s ease'
                                                            }}
                                                        >
                                                            + عرض جميع الدورات ({sub.topics.length})
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
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