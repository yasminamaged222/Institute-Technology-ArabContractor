import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Certifications = () => {
    const primaryColor = "#0A2A43";
    const accentColor = "#D4AF37";
    const globalFont = '"Droid Arabic Kufi", serif'; // تطبيق الخط المطلوب هنا

    // بيانات الشهادات
    const certificates = [
        {
            title: "الإعتماد القومي للجودة",
            text: "تم إعتماد المعهد التكنولوجي لهندسة التشييد والإدارة من المعهد القومي للجودة التابع إلى وزارة التجارة والصناعة",
            image: "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/NQI-lg.jpg",
        },
        {
            title: "ISO 9001:2015",
            text: "تم الحصول على شهادة الجودة منذ عام 2000 مع تحديثها سنويًا",
            image: "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/iso9001.jpg",
        },
        {
            title: "PMI",
            text: "إعتماد المعهد من معهد إدارة الأعمال PMI لإعداد المتدربين لإجتياز PMP",
            image: "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/pmi.jpg",
        },
        {
            title: "Authorized Training Partner",
            text: "إعتماد المعهد كشريك تدريب معتمد",
            image: "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/Partner.jpg",
        },
        {
            title: "Autodesk Training Center",
            text: "مركز تدريب معتمد من Autodesk",
            image: "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/autodeskCert.jpg",
        },
    ];

    // بيانات خطابات الشكر
    const thankNames = [
        "شكر دولة موريتانيا", "شكر الغرفة الالمانية", "وزارة القوى العاملة",
        "الغرفة الالمانية", "الغرفة الالمانية", "جامعة جازان السعودية",
        "الاكاديمية الحديثة للهندسة والتكنولوجيا", "البرنامج السودانى", "البرنامج الاثيوبى"
    ];

    const thankImages = thankNames.map((name, i) => ({
        name,
        url: `https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/certificates/cert0${i + 1}.jpg`
    }));

    const [visibleImages, setVisibleImages] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleImage = (index) => {
        setVisibleImages(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (

        <div style={{ direction: 'rtl', fontFamily: globalFont }}>
            {/* الجزء المضاف حديثاً */}
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1', fontFamily: globalFont }}>

                <span className="overview" style={{ position: 'relative', bottom: '5px', fontFamily: globalFont }}>
                    <a href="/" className="btn_go_home" style={{ fontFamily: globalFont, textDecoration: 'none', color: 'inherit' }}>الصفحة الرئيسية</a> - مركز التدريب جسر السويس
                </span>

            </div>

            <div style={{ backgroundColor: '#F3F5F8', minHeight: '100vh', padding: '80px 20px 40px', fontFamily: globalFont }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: globalFont }}>

                    {/* Header */}
                    <header style={{ textAlign: 'center', marginBottom: '50px', fontFamily: globalFont }}>
                        <h1 style={{ color: primaryColor, fontSize: '2.5rem', fontWeight: 'bold', fontFamily: globalFont }}>الشهادات وخطابات الشكر</h1>
                        <div style={{ height: '4px', width: '80px', backgroundColor: accentColor, margin: '15px auto' }}></div>
                    </header>

                    {/* Certificates Section */}
                    <section style={{ fontFamily: globalFont }}>
                        {certificates.map((cert, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    marginBottom: '30px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '30px',
                                    fontFamily: globalFont
                                }}
                            >
                                <div style={{ flex: '1 1 500px', fontFamily: globalFont }}>
                                    <h2 style={{ color: primaryColor, fontSize: '1.5rem', marginBottom: '15px', fontFamily: globalFont }}>{cert.title}</h2>
                                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '25px', fontFamily: globalFont }}>{cert.text}</p>
                                    <button
                                        onClick={() => toggleImage(index)}
                                        style={{
                                            backgroundColor: visibleImages[index] ? '#e0e0e0' : accentColor,
                                            color: 'black',
                                            border: 'none',
                                            padding: '12px 30px',
                                            borderRadius: '30px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: '0.3s',
                                            fontFamily: globalFont
                                        }}
                                    >
                                        {visibleImages[index] ? "إخفاء الشهادة" : "عرض الشهادة"}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {visibleImages[index] && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            style={{ flex: '1 1 300px', position: 'relative', textAlign: 'center' }}
                                        >
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                onClick={() => setSelectedImage(cert.image)}
                                                style={{ maxWidth: '100%', borderRadius: '15px', cursor: 'zoom-in', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </section>

                    {/* Thank Letters Slider */}
                    <section style={{ marginTop: '80px', textAlign: 'center', fontFamily: globalFont }}>
                        <h2 style={{ color: primaryColor, fontSize: '2rem', marginBottom: '10px', fontFamily: globalFont }}>خطابات الشكر</h2>
                        <p style={{ color: '#666', marginBottom: '40px', fontFamily: globalFont }}>بعض خطابات الشكر الموجهة إلى المعهد التكنولوجي من عملاؤنا داخل وخارج جمهورية مصر العربية</p>

                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            autoplay={{ delay: 2500 }}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            style={{ padding: '20px 0 50px', fontFamily: globalFont }}
                        >
                            {thankImages.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <div
                                        onClick={() => setSelectedImage(img.url)}
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: '18px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                                            fontFamily: globalFont
                                        }}
                                    >
                                        <img src={img.url} alt={img.name} style={{ width: '100%', height: '250px', objectFit: 'contain', padding: '10px' }} />
                                        <div style={{ backgroundColor: 'rgba(10, 42, 67, 0.8)', color: 'white', padding: '10px', fontWeight: 'bold', fontFamily: globalFont }}>
                                            {img.name}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                </div>

                {/* Fullscreen Image Overlay (Image Viewer) */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            style={{
                                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                                fontFamily: globalFont
                            }}
                        >
                            <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontWeight: 'bold', fontFamily: globalFont }}>✕</button>
                            <img src={selectedImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '90%', borderRadius: '10px' }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Certifications;