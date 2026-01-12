import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, IconButton, InputBase, Menu, MenuItem,
  Avatar, Badge, Button, Divider, Typography, Stack, Popover, List, ListItemButton, ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-removebg-preview.png';
import Overview from "../pages/overview";
import Vision_goals from "../pages/vision_and_goals/vision_goals";



const Navbar = () => {
  const [coursesAnchor, setCoursesAnchor] = useState(null);
  const [aboutAnchor, setAboutAnchor] = useState(null);
  const [accountAnchor, setAccountAnchor] = useState(null);
  const [language] = useState('ar');

  const aboutLinks = [
    'نبذة عامة', 'الرؤية والأهداف', 'الشهادات والاعتمادات', 'فريق العمل',
    'قائمة المحاضرين', 'الخطة التدريبية', 'التقرير الشهرى',
    'مكتبة الصور والفيديوهات', 'البروتوكولات والإتفاقيات', 'عملاؤنا'
  ];

  const mainCourses = [
    { 
      id: 1,
      title: 'برامج موجهة للمهندسين', 
      sub: [
        { id: 11, title: 'برامج تأهيلية' },
        { id: 12, title: 'برامج عامة' }
      ] 
    },
    { 
      id: 2,
      title: 'برامج القطاع القانوني والعقارى', 
      sub: [
        { id: 21, title: 'الإجراءات القانونية' }
      ] 
    },
    { id: 3, title: 'برامج موجهة للماليين' },
    { id: 4, title: 'برامج موجهة للامن' },
  ];


  const aboutLinkPaths = {
    'نبذة عامة': '/overview',
    'الرؤية والأهداف': '/mission',
    'فريق العمل': '/team',
    'الشهادات والاعتمادات': '/certifications'
    
    // ... باقي الروابط
  };

  // Logic for tracking selection inside the mega menu
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

  return (
    <AppBar position="sticky" elevation={10} sx={{ bgcolor: 'white', color: 'black', py: 0.5 }}>
      <Toolbar sx={{ justifyContent: 'space-between', display: 'flex', px: 4 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit', ml: 2 }}
          >
            <Box component="img" src={logo} alt="ICEMT Logo" sx={{ height: 60, width: 'auto' }} />
            <Box sx={{ mr: 1, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#0d47a1', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: 1.5, fontSize: '0.9rem' }}>
                المقاولون العرب
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#0d47a1', fontFamily: '"Droid Arabic Kufi", serif', lineHeight: 1.2, fontSize: '0.8rem' }}>
                المعهد التكنولوجى لهندسة التشييد والإدارة
              </Typography>
            </Box>
          </Stack>

          {/* --- FIXED COURSE SECTION --- */}
          <Button
            color="inherit"
            endIcon={<KeyboardArrowDownIcon />}
            onMouseEnter={handleCoursesOpen}
            sx={{ fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', mr: 1 }}
          >
            الدورات التدريبية
          </Button>

          <Popover
            open={Boolean(coursesAnchor)}
            anchorEl={coursesAnchor}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { onMouseLeave: handleClose, sx: { borderRadius: 0, mt: 1, boxShadow: 6, border: '1px solid #d1d7dc' } } }}
          >
            <Box sx={{ display: 'flex', height: 450, width: 800 }} dir="rtl">
              {/* Column 1: Main Categories */}
              <List sx={{ width: 260, borderLeft: '1px solid #d1d7dc', p: 0 }}>
                {mainCourses.map((cat) => (
                  <ListItemButton 
                    key={cat.id} 
                    onMouseEnter={() => { setSelectedCatId(cat.id); setSelectedSubId(null); }}
                    selected={selectedCatId === cat.id}
                    sx={{ py: 1.5, '&.Mui-selected': { bgcolor: '#f7f9fa', color: '#0d47a1' } }}
                  >
                    <ListItemText primary={cat.title} primaryTypographyProps={{ fontSize: 13.5, fontFamily: '"Droid Arabic Kufi", serif' }} />
                    <ChevronLeft fontSize="small" sx={{ opacity: 0.3 }} />
                  </ListItemButton>
                ))}
              </List>

              {/* Column 2: Sub-Categories */}
              <List sx={{ width: 260, borderLeft: '1px solid #d1d7dc', p: 0, bgcolor: '#f7f9fa' }}>
                {activeCategory?.sub?.map((sub) => (
                  <ListItemButton 
                    key={sub.id} 
                    onMouseEnter={() => setSelectedSubId(sub.id)}
                    selected={selectedSubId === sub.id}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText primary={sub.title} primaryTypographyProps={{ fontSize: 13.5, fontFamily: '"Droid Arabic Kufi", serif' }} />
                    <ChevronLeft fontSize="small" sx={{ opacity: 0.3 }} />
                  </ListItemButton>
                ))}
              </List>

              {/* Column 3: Topics */}
              <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'white', overflowY: 'auto' }}>
                <Typography sx={{ fontWeight: 'bold', mb: 2, fontFamily: '"Droid Arabic Kufi", serif', color: '#0d47a1' }}>
                  {activeSub?.title || activeCategory?.title}
                </Typography>
                <List>
                  {activeSub?.topics?.map((topic, i) => (
                    <ListItemButton key={i} sx={{ px: 0, py: 0.5, '&:hover': { bgcolor: 'transparent' } }}>
                      <ListItemText 
                        primary={topic} 
                        primaryTypographyProps={{ fontSize: 13, color: '#5624d0', fontFamily: '"Droid Arabic Kufi", serif' }} 
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Box>
          </Popover>
          {/* --- END FIXED COURSE SECTION --- */}
        </Box>

        {/* SEARCH BAR - UNCHANGED */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 10, justifyContent: 'center', mx: 4, gap: 10 }}>
          <Box sx={{ bgcolor: '#f1f3f4', borderRadius: 9, display: 'flex', alignItems: 'center', px: 10, py: 0.5, width: '100%', maxWidth: 350 }}>
            <InputBase
              placeholder={language === 'ar' ? "بحث عن دورة...." : "Search for a course..."}
              sx={{ color: 'black', flexGrow: 1, textAlign: language === 'ar' ? 'right' : 'left', fontFamily: '"Droid Arabic Kufi", serif' }}
            />
            <SearchIcon sx={{ color: 'gray' }} />
          </Box>
        </Box>

        {/* NAVIGATION LINKS & ACCOUNT - UNCHANGED */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 5 }}>
            <Button
              color="inherit"
              endIcon={<KeyboardArrowDownIcon />}
              onMouseEnter={(e) => setAboutAnchor(e.currentTarget)}
              sx={{ fontWeight: 600, fontFamily: '"Droid Arabic Kufi", serif' }}
            >
              {language === 'ar' ? 'عن المعهد' : 'About Us'}
            </Button>
            
            <Menu
              anchorEl={aboutAnchor}
              open={Boolean(aboutAnchor)}
              onClose={handleClose}
              MenuListProps={{ onMouseLeave: handleClose }}
              sx={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
            >
              {aboutLinks.map((link) => (
                <MenuItem
                  key={link}
                  component={Link}
                  to={aboutLinkPaths[link] || `/${link.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={handleClose}
                  sx={{ fontFamily: '"Droid Arabic Kufi", serif', justifyContent: "flex-end" }}
                >
                  {link}
                </MenuItem>
              ))}
            </Menu>

            <Button color="inherit" sx={{ fontWeight: 600, fontFamily: '"Droid Arabic Kufi", serif' }}>
              {/* {language === 'ar' ? 'الأخبار' : 'News'} */}
              <a href="/news" className="nav-link">الأخبار</a>
            </Button>
            <Button color="inherit" sx={{ fontWeight: 600, fontFamily: '"Droid Arabic Kufi", serif' }}>
              {language === 'ar' ? 'المكتبة' : 'Library'}
            </Button>
            <Button color="inherit" sx={{ fontWeight: 600, fontFamily: '"Droid Arabic Kufi", serif' }}>
              {language === 'ar' ? 'الخدمات' : 'Services'}
            </Button>
          </Box>

          <IconButton color="inherit">
            <Badge badgeContent={2} color="primary">
              <ShoppingCartIcon sx={{ color: '#555' }} />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setAccountAnchor(e.currentTarget)} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#0865A8', width: 40, height: 40 }}>YM</Avatar>
          </IconButton>

          <Menu
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={handleClose}
            sx={{ direction: language === 'ar' ? 'rtl' : 'ltr'}}
            PaperProps={{ sx: { width: 280, mt: 1.5 } }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2}}>
              <Avatar sx={{ bgcolor: '#333', width: 50, height: 50 }}>YM</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' }}>ياسمينا ماجد</Typography>
                <Typography variant="body2" color="text.secondary">yasminamaged22@gmail.com</Typography>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={handleClose} sx={{ fontFamily: '"Droid Arabic Kufi", serif' }}>إعدادات الحساب</MenuItem>
            <Divider />
            <MenuItem onClick={handleClose} sx={{ color: '#0865A8', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' }}>تسجيل الخروج</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;