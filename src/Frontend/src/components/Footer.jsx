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
    // Updated divider to look better on dark background
    const sectionDivider = {
        borderLeft: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.2)' },
        height: 'auto',
        pl: { xs: 0, md: 5 },
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    };

    return (
        <Box sx={{
            backgroundImage: 'linear-gradient(#070707,#0865a8)', // Apply your gradient here
            color: 'white',
            py: 6,
            direction: 'ltr',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>

                    {/* القسم 1: اسم المعهد والعنوان */}
                    <Grid item xs={12} sm={6} md={6} sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1, color: '#90caf9', fontFamily: 'Cairo, sans-serif' }}>
                            المعهد التكنولوجي لهندسة التشييد والإدارة
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5, fontFamily: 'Cairo, sans-serif', color: 'rgba(255,255,255,0.8)' }}>
                            6 ش محمود المليجي - المنطقة السادسة - مدينة نصر - القاهرة
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                            <EmailIcon fontSize="small" sx={{ color: '#90caf9' }} />
                            <MuiLink href="mailto:icemt@arabcont.com" color="inherit" underline="hover" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                                icemt@arabcont.com
                            </MuiLink>
                        </Box>
                    </Grid>

                    {/* Section 2: Contact Us */}
                    <Grid item xs={12} sm={6} md={3} sx={sectionDivider}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'Cairo, sans-serif' }}>
                            اتصل بنا
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon fontSize="small" sx={{ color: '#90caf9' }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '55px' }}>
                                    تليفون:
                                </Typography>
                                <Typography variant="body2" sx={{ direction: 'ltr' }}>
                                    +2 02 23892120
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaxIcon fontSize="small" sx={{ color: '#90caf9' }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '55px' }}>
                                    فاكس:
                                </Typography>
                                <Typography variant="body2" sx={{ direction: 'ltr' }}>
                                    +2 02 23892025
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* القسم 3: ساعات العمل */}
                    <Grid item xs={12} sm={6} md={2.5} sx={sectionDivider}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'Cairo, sans-serif' }}>
                            ساعات العمل
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, fontFamily: 'Cairo, sans-serif', color: 'rgba(255,255,255,0.8)' }}>الأحد - الخميس</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'Cairo, sans-serif', color: 'rgba(255,255,255,0.8)' }}>8:30 صباحاً إلى 5:00 مساءً</Typography>
                    </Grid>

                    {/* القسم 4: روابط تهمك */}
                    <Grid item xs={12} sm={6} md={2.5} sx={sectionDivider}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'Cairo, sans-serif' }}>
                            روابط تهمك
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {['الرئيسية', 'عن المعهد', 'الأخبار', 'اتصل بنا'].map((text, index) => (
                                <MuiLink
                                    key={index}
                                    component={Link}
                                    to={index === 0 ? "/" : index === 1 ? "/about" : index === 2 ? "/news" : "/contact"}
                                    color="inherit"
                                    underline="none"
                                    sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Cairo, sans-serif', '&:hover': { color: '#90caf9' } }}
                                >
                                    <span style={{ marginRight: '8px' }}>➔</span> {text}
                                </MuiLink>
                            ))}
                        </Box>
                    </Grid>

                </Grid>

                {/* الشريط السفلي */}
                <Box sx={{ mt: 8, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Cairo, sans-serif' }}>
                            جميع الحقوق محفوظة 2025 © المعهد التكنولوجي لهندسة التشييد والإدارة | تصميم مركز معلومات الإدارة العليا
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#ceb22f', fontWeight: 'bold', display: 'block', mt: 1 }}>
                            Designed by Yasmina Maged & Ahmed Taha
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#1877F2' } }} href="#"><FacebookIcon /></IconButton>
                        <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#E4405F' } }} href="#"><InstagramIcon /></IconButton>
                        <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#1DA1F2' } }} href="#"><TwitterIcon /></IconButton>
                    </Box>

                </Box>
            </Container>
        </Box>
    );
};

export default Footer;