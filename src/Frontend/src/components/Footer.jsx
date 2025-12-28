import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Fax';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#636363', color: 'white', py: 6 }}>
      <Container maxWidth="md"> {/* أقصر من lg عشان يبقى shorter width */}
        <Grid container spacing={4} sx={{ textAlign: 'right' }}>
          {/* روابط سريعة */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              روابط سريعة
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MuiLink component={Link} to="/" color="inherit" underline="hover" sx={{ mb: 1 }}>
                الرئيسية
              </MuiLink>
              <MuiLink component={Link} to="/about" color="inherit" underline="hover" sx={{ mb: 1 }}>
                عن المعهد
              </MuiLink>
              <MuiLink component={Link} to="/library" color="inherit" underline="hover" sx={{ mb: 1 }}>
                المكتبة
              </MuiLink>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover" sx={{ mb: 1 }}>
                اتصل بنا
              </MuiLink>
            </Box>
          </Grid>

          {/* ساعات العمل */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              ساعات العمل
            </Typography>
            <Typography variant="body2">
              الأحد - الخميس
            </Typography>
            <Typography variant="body2">
              8:30 صباحًا إلى 5:00 مساءً
            </Typography>
          </Grid>

          {/* اتصل بنا */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              اتصل بنا
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ ml: 1 }} />
              <Typography variant="body2">+2 02 23892120</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FaxIcon sx={{ ml: 1 }} />
              <Typography variant="body2">+2 02 23892025</Typography>
            </Box>
          </Grid>

          {/* العنوان + الإيميل */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              المعهد التكنولوجي لهندسة التشييد والإدارة
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              6 ش محمود المليجي - المنطقة السادسة - مدينة نصر - القاهرة
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ ml: 1 }} />
              <MuiLink href="mailto:icemt@arabcont.com" color="inherit" underline="hover">
                icemt@arabcont.com
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        {/* Social + Copyright + Designed by */}
        <Box sx={{ textAlign: 'center', mt: 6, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton color="inherit" href="#">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="#">
              <InstagramIcon />
            </IconButton>
            <IconButton color="inherit" href="#">
              <TwitterIcon />
            </IconButton>
          </Box>

          <Typography variant="body2">
            جميع الحقوق محفوظة 2025 © المعهد التكنولوجي لهندسة التشييد والإدارة | تصميم مركز معلومات الإدارة العليا
          </Typography>
          <Typography 
  variant="body2" 
  align="center" 
  sx={{ 
    mt: 1, 
    fontWeight: 'bold', 
    color: '#ceb22f' // اللون الذهبي اللي طلبتيه
  }}
>
  Designed by Yasmina Maged & Ahmed Taha
</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;