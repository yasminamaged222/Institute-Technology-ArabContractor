import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const NAV_HEIGHT = 70; // Adjust this if your navbar height is different

const OnsiteTraining = () => {
    const benefits = [
        'هو تدريب تطبيقي علي المشروعات تحت التنفيذ ويتم بناء علي طلب العميل في المشروع المطلوب التدريب فيه للمهندسين / المشرفين / العمالة',
        'التدريب بناء علي مستندات المشروع ( المقايسة - المواصفات الفنية - الرسومات )',
        'يتم الإستعانة بخبراء متخصصين في كافة المجالات ( خرسانة - تشطيبات - كهروميكانيك ) لشرح وتطبيق المعلومات علي بنود العمل في المشروع وكذلك التدريب علي اكتشاف عيوب الصناعة وأسس استلام بنود الأعمال المختلفة.',
        'يتم عمل اختبار في نهاية البرنامج لقياس كفاءة المتدربين ومدي استيعابهم لموضوعات التدريب المختلفة'
    ];

    const projects = [
        {
            title: 'التدريب بمشروع محور روض الفرج',
            image: '/images/grid-bg1.jpg'
        },
        {
            title: 'التدريب بمشروع محور روض الفرج',
            image: '/images/grid-bg2.jpg'
        },
        {
            title: 'التدريب بمشروع العاصمة الإدارية الجديدة',
            image: '/images/grid-bg3.jpg'
        },
        {
            title: 'التدريب بمشروع العاصمة الإدارية الجديدة',
            image: '/images/grid-bg4.jpg'
        },
        {
            title: 'التدريب بمشروع العاصمة الإدارية الجديدة',
            image: '/images/grid-bg5.jpg'
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#ffffff',
                fontFamily: '"Droid Arabic Kufi", serif',
            }}
            dir="rtl"
            lang="ar"
        >
            {/* Fixed Overview Bar - positioned under navbar */}
            <Box
                sx={{
                    position: "fixed",
                    top: `${NAV_HEIGHT}px`,
                    left: 0,
                    width: "100%",
                    bgcolor: "#F5F7E1",
                    borderBottom: "1px solid #d1d5db",
                    px: { xs: 2, md: 5 },
                    py: 2,
                    zIndex: 40,
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontSize: { xs: "0.875rem", md: "1rem" }
                        }}
                    >
                        <a
                            href="/"
                            style={{
                                marginLeft: 12,
                                color: "#374151",
                                textDecoration: "none",
                            }}
                        >
                            الصفحة الرئيسية
                        </a>
                        <span style={{ color: "#6b7280" }}> - </span>
                        <span style={{ marginRight: 12, color: "#374151" }}>
                            التدريب في الموقع
                        </span>
                    </Typography>
                </Box>
            </Box>

            {/* Main Content - with top padding to account for fixed bar */}
            <Container
                maxWidth="lg"
                sx={{
                    pt: { xs: `${NAV_HEIGHT + 60}px`, md: `${NAV_HEIGHT + 80}px` },
                    pb: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3, md: 4 }
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontWeight: 'bold',
                            mb: 2,
                            color: '#000000',
                            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }
                        }}
                    >
                        التدريب في الموقع
                    </Typography>
                </Box>

                {/* Benefits List */}
                <Box sx={{ mb: { xs: 6, md: 8 }, maxWidth: "900px", mx: "auto" }}>
                    {benefits.map((benefit, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                mb: 3,
                                textAlign: 'right',
                                bgcolor: '#ffffff',
                                p: { xs: 2, md: 2.5 },
                                borderRadius: '12px',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(8, 101, 168, 0.1)',
                                    borderColor: '#0865a8',
                                }
                            }}
                        >
                            <CheckCircle
                                sx={{
                                    color: '#f57c00',
                                    ml: 2,
                                    mt: 0.5,
                                    fontSize: { xs: 24, md: 28 },
                                    flexShrink: 0
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    lineHeight: 1.9,
                                    flex: 1,
                                    color: '#000000',
                                    fontSize: { xs: "0.95rem", md: "1.05rem" }
                                }}
                            >
                                {benefit}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Section Title for Projects */}
                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontWeight: 'bold',
                            color: '#0865a8',
                            fontSize: { xs: "1.25rem", md: "1.5rem" }
                        }}
                    >
                        مشاريع التدريب
                    </Typography>
                </Box>

                {/* Project Images Grid */}
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {projects.map((project, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    position: 'relative',
                                    height: { xs: 250, sm: 280, md: 320 },
                                    overflow: 'hidden',
                                    borderRadius: '16px',
                                    transition: 'all 0.4s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                                    },
                                    '&:hover .overlay': {
                                        opacity: 1
                                    },
                                    '&:hover .image': {
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="100%"
                                    image={project.image}
                                    alt={project.title}
                                    className="image"
                                    sx={{
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.4s ease',
                                    }}
                                />
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(to top, rgba(8, 101, 168, 0.95) 0%, rgba(8, 101, 168, 0.7) 70%, transparent 100%)',
                                        color: 'white',
                                        p: { xs: 2, md: 3 },
                                        opacity: 0,
                                        transition: 'opacity 0.4s ease',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: '"Droid Arabic Kufi", serif',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            fontSize: { xs: "0.95rem", md: "1.05rem" }
                                        }}
                                    >
                                        {project.title}
                                    </Typography>
                                </Box>

                                {/* Decorative corner accent */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: 0,
                                        height: 0,
                                        borderStyle: 'solid',
                                        borderWidth: '0 60px 60px 0',
                                        borderColor: 'transparent #f57c00 transparent transparent',
                                        opacity: 0.9,
                                    }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default OnsiteTraining;
