import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Stack
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Fax';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from 'react-router-dom';

const Footer = () => {
  // التنسيق الخاص بالخطوط الفاصلة العمودية (تظهر على يسار القسم في وضع LTR)
  const sectionDivider = {
    borderLeft: { xs: 'none', md: '2.5px solid #e0e0e0' },
    height: 'auto',
    pl: { xs: 0, md: 5 }, // Padding Left
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  };

  return (
    <Box sx={{ bgcolor: 'white', color: 'black', py: 6, direction: 'ltr', borderTop: '1px solid #e0e0e0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          
          {/* القسم 1: اسم المعهد والعنوان (أقصى اليسار) */}
          <Grid item xs={12} sm={6} md={6} sx={{ textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1, color: '#0d47a1', fontFamily: 'Cairo, sans-serif' }}>
              المعهد التكنولوجي لهندسة التشييد والإدارة
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1, fontFamily: 'Cairo, sans-serif' }}>
              6 ش محمود المليجي - المنطقة السادسة - مدينة نصر - القاهرة
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
              <EmailIcon fontSize="small" sx={{ color: '#555' }} />
              <MuiLink href="mailto:icemt@arabcont.com" color="inherit" underline="hover" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                icemt@arabcont.com
              </MuiLink>
            </Box>
          </Grid>

           {/* Section 2: Contact Us (Fixed Phone Layout) */}
           <Grid item xs={12} sm={6} md={3} sx={sectionDivider}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'Cairo, sans-serif' }}>
              اتصل بنا
            </Typography>
            <Stack spacing={2}>
              {/* تليفون */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" sx={{ color: '#0d47a1' }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '55px' }}>
                  تليفون:
                </Typography>
                <Typography variant="body2" sx={{ direction: 'ltr' }}>
                  +2 02 23892120
                </Typography>
              </Box>
              {/* فاكس */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaxIcon fontSize="small" sx={{ color: '#0d47a1' }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '55px' }}>
                  فاكس:
                </Typography>
                <Typography variant="body2" sx={{ direction: 'ltr' }}>
                  +2 02 23892025
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* القسم 3: ساعات العمل (مع خط فاصل يساره) */}
          <Grid item xs={12} sm={6} md={2.5} sx={sectionDivider}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'Cairo, sans-serif' }}>
              ساعات العمل
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontFamily: 'Cairo, sans-serif' }}>الأحد - الخميس</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Cairo, sans-serif' }}>8:30 صباحاً إلى 5:00 مساءً</Typography>
          </Grid>

          {/* القسم 4: روابط تهمك (مع خط فاصل يساره) */}
          <Grid item xs={12} sm={6} md={2.5} sx={sectionDivider}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'Cairo, sans-serif' }}>
              روابط تهمك
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/" color="inherit" underline="none" sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Cairo, sans-serif' }}>
                <span style={{ marginRight: '8px' }}>➔</span> الرئيسية
              </MuiLink>
              <MuiLink component={Link} to="/about" color="inherit" underline="none" sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Cairo, sans-serif' }}>
                <span style={{ marginRight: '8px' }}>➔</span> عن المعهد
              </MuiLink>
              <MuiLink component={Link} to="/news" color="inherit" underline="none" sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Cairo, sans-serif' }}>
                <span style={{ marginRight: '8px' }}>➔</span> الأخبار
              </MuiLink>
              <MuiLink component={Link} to="/contact" color="inherit" underline="none" sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Cairo, sans-serif' }}>
                <span style={{ marginRight: '8px' }}>➔</span> اتصل بنا
              </MuiLink>
            </Box>
          </Grid>

        </Grid>

        {/* الشريط السفلي: الحقوق (يسار) والسوشيال ميديا (يمين) */}
        <Box sx={{ mt: 8, pt: 3, borderTop: '2.5px solid #e0e0e0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body2" sx={{ color: '#555', fontFamily: 'Cairo, sans-serif' }}>
               جميع الحقوق محفوظة 2025 © المعهد التكنولوجي لهندسة التشييد والإدارة | تصميم مركز معلومات الإدارة العليا
            </Typography>
            <Typography variant="caption" sx={{ color: '#ceb22f', fontWeight: 'bold', display: 'block', mt: 1 }}>
              Designed by Yasmina Maged & Ahmed Taha
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#1877F2' }} href="#"><FacebookIcon /></IconButton>
            <IconButton size="small" sx={{ color: '#E4405F' }} href="#"><InstagramIcon /></IconButton>
            <IconButton size="small" sx={{ color: '#1DA1F2' }} href="#"><TwitterIcon /></IconButton>
          </Box>
          
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;