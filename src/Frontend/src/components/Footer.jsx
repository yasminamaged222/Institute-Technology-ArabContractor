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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';

const Footer = () => {
    const sectionDivider = {
        borderLeft: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.15)' },
        height: 'auto',
        pl: { xs: 0, md: 4 },
        pr: { xs: 0, md: 2 },
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    };

    return (
        <Box sx={{
            backgroundImage: 'linear-gradient(#070707,#0865a8)',
            color: 'white',
            py: { xs: 4, md: 6 },
            direction: 'ltr',
            borderTop: '3px solid #f57c00',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: 'radial-gradient(circle at 20% 50%, rgba(245, 124, 0, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none'
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>

                    {/* القسم 1: اسم المعهد والعنوان */}
                    <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'left' }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                color: '#f57c00',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.4
                            }}
                        >
                            المعهد التكنولوجي لهندسة التشييد والإدارة
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            mb: 2,
                            justifyContent: 'flex-start'
                        }}>
                            <LocationOnIcon
                                fontSize="small"
                                sx={{
                                    color: '#f57c00',
                                    mt: 0.3,
                                    fontSize: '1.2rem'
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    lineHeight: 1.7,
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    color: 'rgba(255,255,255,0.85)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                6 ش محمود المليجي - المنطقة السادسة - مدينة نصر - القاهرة
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            justifyContent: 'flex-start',
                            bgcolor: 'rgba(245, 124, 0, 0.1)',
                            py: 1,
                            px: 1.5,
                            borderRadius: 1,
                            border: '1px solid rgba(245, 124, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(245, 124, 0, 0.15)',
                                borderColor: 'rgba(245, 124, 0, 0.4)'
                            }
                        }}>
                            <EmailIcon
                                fontSize="small"
                                sx={{ color: '#f57c00', fontSize: '1.1rem' }}
                            />
                            <MuiLink
                                href="mailto:icemt@arabcont.com"
                                color="inherit"
                                underline="hover"
                                sx={{
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    fontSize: '0.85rem',
                                    color: 'white',
                                    '&:hover': {
                                        color: '#f57c00'
                                    }
                                }}
                            >
                                icemt@arabcont.com
                            </MuiLink>
                        </Box>
                    </Grid>

                    {/* Section 2: Contact Us */}
                    <Grid item xs={12} sm={6} md={2.5} sx={sectionDivider}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                mb: 2.5,
                                fontFamily: '"Droid Arabic Kufi", serif',
                                color: 'white',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    right: 0,
                                    width: '40px',
                                    height: '2px',
                                    bgcolor: '#f57c00'
                                }
                            }}
                        >
                            اتصل بنا
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateX(-3px)',
                                    '& .MuiSvgIcon-root': {
                                        color: '#f57c00'
                                    }
                                }
                            }}>
                                <PhoneIcon
                                    fontSize="small"
                                    sx={{
                                        color: '#0865a8',
                                        transition: 'color 0.2s ease',
                                        fontSize: '1.1rem'
                                    }}
                                />
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.75rem',
                                            mb: 0.2
                                        }}
                                    >
                                        تليفون
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        23892120 02 2+
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateX(-3px)',
                                    '& .MuiSvgIcon-root': {
                                        color: '#f57c00'
                                    }
                                }
                            }}>
                                <FaxIcon
                                    fontSize="small"
                                    sx={{
                                        color: '#0865a8',
                                        transition: 'color 0.2s ease',
                                        fontSize: '1.1rem'
                                    }}
                                />
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.75rem',
                                            mb: 0.2
                                        }}
                                    >
                                        فاكس
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        23892025 02 2+
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>


                    {/* القسم 3: ساعات العمل */}
                    <Grid item xs={12} sm={6} md={2.5} sx={sectionDivider}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                mb: 2.5,
                                fontFamily: '"Droid Arabic Kufi", serif',
                                color: 'white',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    right: 0,
                                    width: '40px',
                                    height: '2px',
                                    bgcolor: '#f57c00'
                                }
                            }}
                        >
                            ساعات العمل
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            bgcolor: 'rgba(8, 101, 168, 0.2)',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid rgba(8, 101, 168, 0.3)'
                        }}>
                            <AccessTimeIcon
                                fontSize="small"
                                sx={{
                                    color: '#f57c00',
                                    mt: 0.3,
                                    fontSize: '1.2rem'
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    الأحد - الخميس
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    8:30 ص - 5:00 م
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* القسم 4: روابط تهمك */}
                    <Grid item xs={12} sm={6} md={3} sx={sectionDivider}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                mb: 2.5,
                                fontFamily: '"Droid Arabic Kufi", serif',
                                color: 'white',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    right: 0,
                                    width: '40px',
                                    height: '2px',
                                    bgcolor: '#f57c00'
                                }
                            }}
                        >
                            روابط تهمك
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {[
                                { text: 'الرئيسية', path: '/' },
                                { text: 'عن المعهد', path: '/overview' },
                                { text: 'الأخبار', path: '/news' },
                                { text: 'اتصل بنا', path: '/contact' }
                            ].map((item, index) => (
                                <MuiLink
                                    key={index}
                                    component={Link}
                                    to={item.path}
                                    color="inherit"
                                    underline="none"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        fontSize: '0.85rem',
                                        color: 'rgba(255,255,255,0.85)',
                                        transition: 'all 0.2s ease',
                                        py: 0.5,
                                        '&:hover': {
                                            color: '#f57c00',
                                            transform: 'translateX(-5px)',
                                            '& span': {
                                                color: '#f57c00'
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            marginRight: '10px',
                                            color: '#0865a8',
                                            fontWeight: 'bold',
                                            transition: 'color 0.2s ease'
                                        }}
                                    >
                                        ◄
                                    </Box>
                                    {item.text}
                                </MuiLink>
                            ))}
                        </Box>
                    </Grid>

                </Grid>

                {/* الشريط السفلي */}
                <Box sx={{
                    mt: { xs: 5, md: 6 },
                    pt: 3,
                    borderTop: '1px solid rgba(245, 124, 0, 0.3)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 0 },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' }
                }}>

                    <Box sx={{ textAlign: 'left', flex: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                fontSize: { xs: '0.75rem', md: '0.8rem' },
                                lineHeight: 1.6,
                                mb: 1
                            }}
                        >
                            جميع الحقوق محفوظة 2025 © المعهد التكنولوجي لهندسة التشييد والإدارة
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255,255,255,0.6)',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                mb: 0.5
                            }}
                        >
                            تصميم مركز معلومات الإدارة العليا
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#f57c00',
                                display: 'block',
                                fontFamily: '"Droid Arabic Kufi", serif',
                                fontSize: '0.9rem'
                            }}
                        >
                            Designed by Yasmina Maged, Samir Yousri & Ahmed Taha
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'center'
                    }}>
                        <IconButton
                            size="small"
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: 'white',
                                    bgcolor: '#1877F2',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 12px rgba(24, 119, 242, 0.4)'
                                }
                            }}
                            href="https://ar-ar.facebook.com/arabcont2017/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FacebookIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: 'white',
                                    bgcolor: '#E4405F',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 12px rgba(228, 64, 95, 0.4)'
                                }
                            }}
                            href="#"
                        >
                            <InstagramIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: 'white',
                                    bgcolor: '#1DA1F2',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 12px rgba(29, 161, 242, 0.4)'
                                }
                            }}
                            href="https://x.com/arabcont?lang=en"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <TwitterIcon fontSize="small" />
                        </IconButton>
                    </Box>

                </Box>
            </Container>
        </Box>
    );
};

export default Footer;