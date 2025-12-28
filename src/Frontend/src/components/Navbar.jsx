import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

import logo from '../assets/logo-removebg-preview.png'; // تأكدي إن الصورة موجودة

const Navbar = () => {
  const [coursesAnchor, setCoursesAnchor] = useState(null);
  const [subMenuAnchor, setSubMenuAnchor] = useState(null);
  const [accountAnchor, setAccountAnchor] = useState(null);

  const mainCourses = [
    { title: 'برامج موجهة للمهندسين', sub: ['هندسة التشييد', 'إدارة المشاريع', 'سلامة المواقع'] },
    { title: 'برامج موجهة للماليين', sub: ['مالية لغير الماليين', 'تكاليف'] },
    { title: 'برامج مركز جسر السويس', sub: [] },
    { title: 'دورات مستحدثة', sub: [] },
    { title: 'التدريب الصيفي', sub: [] },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#636363  ', py: 1 }}> {/* اللون الجديد #0865A8   RGB*/}
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Right Side (أقصى اليمين): Account + Cart + Links */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Account Avatar */}
          <Tooltip title="الحساب">
            <IconButton onClick={(e) => setAccountAnchor(e.currentTarget)} sx={{ ml: 2 }}>
              <Avatar sx={{ bgcolor: 'white', color: '#0865A8' }}>YM</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={() => setAccountAnchor(null)}
          >
            <MenuItem>My Learning</MenuItem>
            <MenuItem>My Cart</MenuItem>
            <MenuItem>Wishlist</MenuItem>
            <MenuItem>Account Settings</MenuItem>
            <MenuItem>Payment Methods</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>

          {/* Cart */}
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Badge badgeContent={0} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Links */}
          <Button color="inherit" component={Link} to="/about" sx={{ ml: 2 }}>
            عن المعهد
          </Button>
          <Button color="inherit" component={Link} to="/services" sx={{ ml: 2 }}>
            الخدمات
          </Button>
          <Button color="inherit" component={Link} to="/library" sx={{ ml: 2 }}>
            المكتبة
          </Button>
          <Button color="inherit" component={Link} to="/news" sx={{ ml: 2 }}>
            الأخبار
          </Button>
        </Box>

        {/* Center: Search Bar + دورات تدريبية */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Search Bar */}
          <Box sx={{ bgcolor: 'white', borderRadius: 20, display: 'flex', alignItems: 'center', px: 2, py: 0.5, mx: 3, minWidth: 300 }}>
            <InputBase placeholder="بحث عن دورة..." sx={{ color: 'black', flexGrow: 1 }} />
            <SearchIcon sx={{ color: 'gray' }} />
          </Box>

          {/* دورات تدريبية Dropdown */}
          <Button
            color="inherit"
            onMouseEnter={(e) => setCoursesAnchor(e.currentTarget)}
            sx={{ mx: 2, fontSize: '1rem' }}
          >
            دورات تدريبية
          </Button>

          <Menu
            anchorEl={coursesAnchor}
            open={Boolean(coursesAnchor)}
            onClose={() => setCoursesAnchor(null)}
            MenuListProps={{ onMouseLeave: () => setCoursesAnchor(null) }}
          >
            {mainCourses.map((cat) => (
              <MenuItem
                key={cat.title}
                onMouseEnter={(e) => cat.sub.length > 0 && setSubMenuAnchor(e.currentTarget)}
              >
                {cat.title}
                {cat.sub.length > 0 && (
                  <Menu
                    anchorEl={subMenuAnchor}
                    open={Boolean(subMenuAnchor)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    onClose={() => setSubMenuAnchor(null)}
                  >
                    {cat.sub.map((subItem) => (
                      <MenuItem
                        key={subItem}
                        onClick={() => {
                          setCoursesAnchor(null);
                          setSubMenuAnchor(null);
                        }}
                      >
                        {subItem}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Left Side (أقصى اليسار): Email Icon + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Email Icon */}
          <Tooltip title="icemt@arabcont.com">
            <IconButton
              component="a"
              href="mailto:icemt@arabcont.com"
              sx={{ color: 'white', mx: 2 }}
            >
              <AlternateEmailIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>

          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="ICEMT Logo"
            sx={{
              height: { xs: 45, md: 100 },
              width: 'auto',
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;