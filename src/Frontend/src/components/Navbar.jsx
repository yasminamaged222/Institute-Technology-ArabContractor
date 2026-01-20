import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, IconButton, InputBase, Menu, MenuItem,
  Avatar, Badge, Button, Divider, Typography, Stack, Popover, List, 
    ListItemButton, ListItemText, useMediaQuery, useTheme, Grid,Drawer, Collapse // Added Grid here
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu'; 
import CloseIcon from '@mui/icons-material/Close'; // Added CloseIcon
import { Link } from 'react-router-dom';
import logo from '../assets/logo-removebg-preview.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import AuthSync from '../components/AuthSync.jsx';


const Navbar = () => {
    const [coursesAnchor, setCoursesAnchor] = useState(null);
    const [aboutAnchor, setAboutAnchor] = useState(null);
    const [accountAnchor, setAccountAnchor] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const aboutLinks = [
    'نبذة عامة', 'الرؤية والأهداف', 'الشهادات والاعتمادات', 'فريق العمل',
    'قائمة المحاضرين', 'الخطة التدريبية', 'التقرير الشهرى',
    'مكتبة الصور والفيديوهات', 'البروتوكولات والإتفاقيات', 'عملاؤنا'
  ];

  // هيكلة البيانات الجديدة للخطة التدريبية داخل القائمة
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
    // These are now correctly separated main domains
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
    'فريق العمل': '/team',
    'الشهادات والاعتمادات': '/certifications'
  };

  const [selectedCatId, setSelectedCatId] = useState(1);
  const [selectedSubId, setSelectedSubId] = useState(null);

  const activeCategory = mainCourses.find(c => c.id === selectedCatId) || mainCourses[0];
  const activeSub = activeCategory.sub?.find(s => s.id === selectedSubId) || activeCategory.sub?.[0];

  const handleCoursesOpen = (event) => setCoursesAnchor(event.currentTarget);
  const handleClose = () => {
    setAboutAnchor(null);
    setCoursesAnchor(null);
    setAccountAnchor(null);
  };
    const toggleDrawer = (open) => () => setMobileOpen(open);
    return (
        <> {/* <--- ADDED FRAGMENT WRAPPER */}
<AppBar position="sticky" elevation={4} sx={{ bgcolor: 'white', color: 'black', py: 0.5 }}>
  <Toolbar sx={{ justifyContent: 'space-between', display: 'flex', px: { xs: 1, md: 4 } }}>
        
            {/* LOGO SECTION - Tightened gaps */}
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

                    {/* COURSES BUTTON - Right next to logo */}
                          {!isMobile && (
                              <Button
                                  color="inherit"
                                  endIcon={<KeyboardArrowDownIcon />}
                                  onMouseEnter={handleCoursesOpen}
                                  sx={{  px: 2, mx: 1, whiteSpace: 'nowrap' }}
                              >
                                  الدورات التدريبية
                              </Button>
                          )}

                        {/* SEARCH BAR - Fixed flex and padding */}
                              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center', maxWidth: { xs: '150px', md: '400px' }, mx: 2 }}>
                          <Box sx={{ bgcolor: '#f1f3f4', borderRadius: 9, display: 'flex', alignItems: 'center', px: 2, py: 0.5, width: '100%' }}>
                            <InputBase
                              placeholder="بحث..."
                              sx={{ color: 'black', flexGrow: 1, textAlign: 'right', fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.85rem' }}
                            />
                            <SearchIcon sx={{ color: 'gray', fontSize: 20 }} />
                          </Box>
                        </Box>

                    {/* NAV LINKS & AUTH */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        {!isMobile && (
                            <Stack direction="row" spacing={1}>
                                <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} onMouseEnter={(e) => setAboutAnchor(e.currentTarget)}>عن المعهد</Button>
                                <Button color="inherit" component={Link} to="/news">الأخبار</Button>
                                <Button color="inherit" component={Link} to="/lib">المكتبة</Button>
                                <Button color="inherit" component={Link} to="/services">الخدمات</Button>
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
            {/* --- MOBILE DRAWER --- */}
            <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 280, p: 2 }} dir="rtl">
                    <IconButton onClick={toggleDrawer(false)} sx={{ mb: 2 }}><CloseIcon /></IconButton>
                    <List>
                        <ListItemButton onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}>
                            <ListItemText primary="الدورات التدريبية" />
                            {mobileCoursesOpen ? <ExpandMoreIcon /> : <ChevronLeftIcon />}
                        </ListItemButton>
                        <Collapse in={mobileCoursesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pr: 2 }}>
                                {mainCourses.map(course => (
                                    <ListItemButton key={course.id} component={Link} to={course.link || '#'} onClick={toggleDrawer(false)}>
                                        <ListItemText primary={course.title} />
                                    </ListItemButton>
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

            {/* --- DESKTOP MEGA MENU --- */}
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

            {/* --- ABOUT MENU --- */}
            <Menu
                anchorEl={aboutAnchor}
                open={Boolean(aboutAnchor)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: handleClose }}
                // This aligns the menu to the right edge of the button
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    direction: 'rtl',
                    '& .MuiPaper-root': {
                        minWidth: '220px',
                    }
                }}
            >
                {aboutLinks.map((link) => (
                    <MenuItem
                        key={link}
                        component={Link}
                        to={aboutLinkPaths[link] || `/about/${link.replace(/\s+/g, '-')}`}
                        onClick={handleClose}
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontSize: '0.85rem',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'left', // In RTL flex-start is the right side
                            textAlign: 'right',          // Force text to start from the right
                            px: 2,                        // Add padding for breathing room
                            '&:hover': { bgcolor: '#f5f5f5', color: '#0d47a1' }
                        }}
                    >
                        {link}
                    </MenuItem>
                ))}
            </Menu>
        </>
  );
};

export default Navbar;