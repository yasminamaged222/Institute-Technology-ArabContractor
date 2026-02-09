import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, CardMedia, IconButton } from '@mui/material';
import { ExpandMore, CheckCircle, PlayArrow } from '@mui/icons-material';

const NAV_HEIGHT = 70; // Adjust this if your navbar height is different

const CEAProgram = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [openVideo, setOpenVideo] = useState(null);

    const slides = [
        {
            image: '/images/cea-slide1.jpg',
            subtitle: 'برنامج متميز',
            title: 'برنامج اعداد مهندس مكتب فني'
        },
        {
            image: '/images/cea-slide2.jpg',
            subtitle: 'تدريب احترافي',
            title: 'تطوير المهارات الهندسية'
        },
        {
            image: '/images/cea-slide3.jpg',
            subtitle: 'خبرات عملية',
            title: 'التدريب العملي في المشروعات'
        }
    ];

    const galleryImages = [
        { src: '/images/Cea1.jpg', description: 'اختبار الطلبة' },
        { src: '/images/Cea2.jpg', description: 'اختبار الطلبة' },
        { src: '/images/Cea3.jpg', description: 'فصول المدرسة' },
        { src: '/images/Cea4.jpg', description: 'فصول المدرسة' },
        { src: '/images/Cea5.jpg', description: 'قاعة الرسم' },
        { src: '/images/Cea6.jpg', description: 'قاعة الكمبيوتر' },
        { src: '/images/Cea7.jpg', description: 'ورشة الميكانيكا' },
        { src: '/images/Cea8.jpg', description: 'ورشة الميكانيكا' }
    ];

    const videos = [
        {
            id: 1,
            thumbnail: '/images/CEA-Video-bg1.jpg',
            title: 'Bibliotheca Alexandria: foundation and structural design, Egypt.',
            videoUrl: 'https://www.youtube.com/embed/rJmJhoV7vYE'
        },
        {
            id: 2,
            thumbnail: '/images/CEA-Video-bg2.jpg',
            title: 'Delivering the Emirates airline, Britain\'s First Urban Cable Car, London.',
            videoUrl: 'https://www.youtube.com/embed/5Aq8dhNO2DE'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const stages = [
        {
            title: 'المرحلة الاولي',
            content: 'بتعريف المهندسين بالشركة وقوانينها وأهدافها ورؤيتها ثم التعريف بمهام المكتب الفني بالشركة كما تشمل هذه المرحلة تعريفهم بأهمية التنفيذ بالنسبة لمهندس المكتب الفني وذلك عن طريق تدريبهم بورش جسر السويس المختلفة وقد تم التركيز فيها علي التدريب نظريا وعمليا وأن يقوم المتدرب بتنفيذ الأعمال بنفسه في الورش المختلفة (ورشة المباني – ورشة البياض – ورشة الدهانات – ورشة الشدات المعدنية – ورشة النجارة المسلحة – ورشة الحدادة المسلحة).'
        },
        {
            title: 'المرحلة الثانية',
            content: 'فتشمل دراسة مهمات الأقسام المختلفة للمكاتب الفنية من عطاءات وعقود وحصر وقياس واعداد مستخلصات ومطالبات وخطة الاحتياجات ونظام المخازن والتشوينات والمشتريات والمطالبات والمهارات الادارية ، وبالتوازي مع ذلك يتلقي المتدرب محاضرات في اللغة الانجليزية.'
        },
        {
            title: 'المرحلة الثالثة',
            content: 'فتشمل زيارة المهندسين للادارات والفروع والتي تمكنهم من محاكاة ما تم دراسته مع طبيعة العمل بالادارات التخصصية ( العطاءات – التأهيل – الاحتياجات – المشتريات – العقود – الادارة المالية – الموارد البشرية) ثم تنتهي المرحلة بزيارة المهندسين لبعض المشاريع الحيوية التي تمكنهم من التعرف علي طبيعة العمل في المكتب الفني بالمشروع.'
        }
    ];

    const objectives = [
        'المعارف النظرية اللازمة (محاضرات وورش تطبيقية متخصصة).',
        'المهارات العملية (تدريب عملي بفروع وإدارات ومشروعات الشركة).'
    ];

    useEffect(() => {
        document.title = ' ICEMT Webinar - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

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
                            ICEMT Webinar - CEA Program
                        </span>
                    </Typography>
                </Box>
            </Box>
            {/* Main Content */}
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3, md: 4 }
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'left', mb: { xs: 4, md: 6 } }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontWeight: 'bold',
                            mb: 2,
                            color: '#000000',
                            fontSize: { xs: "1.5rem", md: "2.5rem" }
                        }}
                    >
                        ICEMT Webinar - CEA Program
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#f57c00',
                            fontFamily: '"Droid Arabic Kufi", serif',
                            mb: 4,
                            fontSize: { xs: "1rem", md: "1.25rem" }
                        }}
                    >
                        برنامج اعداد مهندس مكتب فني (6شهور) - Commercial Engineering Apprenticeship Program (CEA)
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            lineHeight: 1.9,
                            mb: 3,
                            color: '#000000',
                            fontSize: { xs: "0.95rem", md: "1.05rem" }
                        }}
                    >
                        هو برنامج متميز يعتمد علي فكرة التدريب قبل التعيين ،وحيث أن المكتب الفني يُعتبر العمود الفقري للمشروع فإن هذا البرنامج يهدف إلي إعداد مهندس مكتب فني ويعمل علي تزويد المهندسين الجدد بالمعارف والمهارات اللازمة لتجعل المهندس قادر علي القيام بواجباته ومسئولياته علي الوجه الذي يساهم في إنجاح المشروع ليتم بعد ذلك توزيعهم علي المكاتب الفنية للمشروعات علي مستوي الشركة
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            lineHeight: 1.9,
                            mb: 3,
                            color: '#000000',
                            fontSize: { xs: "0.95rem", md: "1.05rem" }
                        }}
                    >
                        وقد تم تصميم البرنامج ليشمل تدريب المهندسين وتنقسم مراحل التدريب كالاتي :
                    </Typography>
                </Box>

                {/* Objectives */}
                <Box sx={{ mb: { xs: 5, md: 6 }, maxWidth: "900px", mx: "auto" }}>
                    {objectives.map((objective, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                mb: 2.5,
                                textAlign: 'left',
                                bgcolor: '#ffffff',
                                p: { xs: 2, md: 2.5 },
                                borderRadius: '12px',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(245, 124, 0, 0.1)',
                                    borderColor: '#f57c00',
                                }
                            }}
                        >
                            <CheckCircle sx={{ color: '#f57c00', ml: 2, mt: 0.5, fontSize: { xs: 24, md: 28 }, flexShrink: 0 }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: '"Droid Arabic Kufi", serif',
                                    flex: 1,
                                    color: '#000000',
                                    lineHeight: 1.9,
                                    fontSize: { xs: "0.95rem", md: "1.05rem" }
                                }}
                            >
                                {objective}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Stages Accordion */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontWeight: 'bold',
                            mb: 4,
                            textAlign: 'center',
                            color: '#0865a8',
                            fontSize: { xs: "1.5rem", md: "2rem" }
                        }}
                    >
                        وينقسم البرنامج الي مراحل ثلاثة
                    </Typography>
                    {stages.map((stage, index) => (
                        <Accordion
                            key={index}
                            sx={{
                                mb: 2,
                                borderRadius: '12px !important',
                                border: '1px solid #f0f0f0',
                                '&:before': {
                                    display: 'none',
                                },
                                '&.Mui-expanded': {
                                    boxShadow: '0 4px 12px rgba(8, 101, 168, 0.1)',
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#f57c00', fontSize: 32 }} />}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        bgcolor: '#f8f9fa'
                                    }
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        fontWeight: 'bold',
                                        color: '#0865a8',
                                        fontSize: { xs: "1.1rem", md: "1.25rem" }
                                    }}
                                >
                                    {stage.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'white', p: { xs: 2, md: 3 } }}>
                                <Typography
                                    sx={{
                                        fontFamily: '"Droid Arabic Kufi", serif',
                                        textAlign: 'right',
                                        lineHeight: 1.9,
                                        color: '#000000',
                                        fontSize: { xs: "0.95rem", md: "1.05rem" }
                                    }}
                                >
                                    {stage.content}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* Gallery Section */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontWeight: 'bold',
                            mb: 4,
                            textAlign: 'center',
                            color: '#0865a8',
                            fontSize: { xs: "1.5rem", md: "2rem" }
                        }}
                    >
                        معرض الصور
                    </Typography>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {galleryImages.map((image, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Card
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 150, sm: 200, md: 220 },
                                        overflow: 'hidden',
                                        borderRadius: '12px',
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
                                        image={image.src}
                                        alt={image.description}
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
                                            background: 'linear-gradient(to top, rgba(245, 124, 0, 0.9) 0%, transparent 100%)',
                                            color: 'white',
                                            p: 2,
                                            opacity: 0,
                                            transition: 'opacity 0.4s ease',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: '"Droid Arabic Kufi", serif',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                width: '100%',
                                                fontSize: { xs: "0.75rem", md: "0.875rem" }
                                            }}
                                        >
                                            {image.description}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Videos Section */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Droid Arabic Kufi", serif',
                            fontWeight: 'bold',
                            mb: 4,
                            textAlign: 'center',
                            color: '#0865a8',
                            fontSize: { xs: "1.5rem", md: "2rem" }
                        }}
                    >
                        فيديوهات
                    </Typography>
                    <Grid container spacing={{ xs: 3, md: 4 }} direction="row">
                        {videos.map((video) => (
                            <Grid item xs={12} sm={6} key={video.id}>
                                <Card
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 250, md: 300 },
                                        overflow: 'hidden',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                                        },
                                        '&:hover .play-icon': {
                                            transform: 'scale(1.2)',
                                            bgcolor: '#f57c00',
                                        }
                                    }}
                                    onClick={() => setOpenVideo(video.id)}
                                >
                                    {openVideo === video.id ? (
                                        <Box sx={{ height: '100%', width: '100%' }}>
                                            <iframe
                                                src={video.videoUrl}
                                                allow="autoplay; fullscreen"
                                                allowFullScreen
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    border: 'none'
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <>
                                            <CardMedia
                                                component="img"
                                                height="100%"
                                                image={video.thumbnail}
                                                alt={video.title}
                                                sx={{
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(0, 0, 0, 0.3)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <IconButton
                                                    className="play-icon"
                                                    sx={{
                                                        width: { xs: 60, md: 80 },
                                                        height: { xs: 60, md: 80 },
                                                        bgcolor: '#0865a8',
                                                        color: 'white',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f57c00',
                                                        }
                                                    }}
                                                >
                                                    <PlayArrow sx={{ fontSize: { xs: 30, md: 40 } }} />
                                                </IconButton>
                                            </Box>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)',
                                                    color: 'white',
                                                    p: { xs: 2, md: 3 },
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontFamily: '"Droid Arabic Kufi", serif',
                                                        textAlign: 'right',
                                                        fontSize: { xs: "0.875rem", md: "1rem" }
                                                    }}
                                                >
                                                    {video.title}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default CEAProgram;