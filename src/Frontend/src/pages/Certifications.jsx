import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useEffect } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Certifications = () => {
    const primaryColor = "#0865a8"; // blue
    const accentColor = "#f57c00"; // orange
    const globalFont = '"Droid Arabic Kufi", serif';

    const certificates = [
        {
            title: "الإعتماد القومي للجودة",
            text: "تم إعتماد المعهد التكنولوجي لهندسة التشييد والإدارة من المعهد القومي للجودة التابع إلى وزارة التجارة والصناعة",
            image:
                "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/NQI-lg.jpg",
        },
        {
            title: "ISO 9001:2015",
            text: "تم الحصول علي شهادة الجودة منذ عام 2000 في مجال تصميم وإدارة وتنفيذ الخدمات التدريبية والتقييم والاختبارات مع تحديثها سنويا وحتي أخر إصدار لها (ISO9001:2015) وذلك لتقديم أفضل خدمة للمتدربين",
            image:
                "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/iso9001.jpg",
        },
        {
            title: "PMI",
            text: "تم إعتماد المعهد التكنولوجي لهندسة التشييد والإدارة من معهد إدارة الأعمال (PMI) لإعداد المتدربين لإجتياز إختبار شهادة ال PMP",
            image:
                "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/pmi.jpg",
        },
        {
            title: "Authorized Training Partner",
            text: " تم إعتماد المعهد التكنولوجي لهندسة التشييد والإدارة (Authorized Training Partner)",
            image:
                "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/Partner.jpg",
        },
        {
            title: "Autodesk Training Center",
            text: "تم إعتماد المعهد التكنولوجي لهندسة التشييد والإدارة (Autodesk Authorized Training Center)",
            image:
                "https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/autodeskCert.jpg",
        },
    ];

    const thankNames = [
        "شكر دولة موريتانيا",
        "شكر الغرفة الالمانية",
        "وزارة القوى العاملة",
        "الغرفة الالمانية",
        "جامعة جازان السعودية",
        "الاكاديمية الحديثة للهندسة والتكنولوجيا",
        "البرنامج السودانى",
        "البرنامج الاثيوبى",
    ];

    const thankImages = thankNames.map((name, i) => ({
        name,
        url: `https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/certificates/cert0${i +
            1}.jpg`,
    }));

    const [visibleImages, setVisibleImages] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleImage = (index) => {
        setVisibleImages((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    useEffect(() => {
        document.title = ' الشهادات وخطابات الشكر - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <div style={{ direction: "rtl", fontFamily: globalFont }}>

            {/* Custom CSS for Swiper Pagination */}
            <style>{`
                .swiper-pagination {
                    bottom: 0px !important;
                }
                
                .swiper-pagination-bullet {
                    background-color: ${primaryColor};
                    opacity: 0.5;
                }
                
                .swiper-pagination-bullet-active {
                    opacity: 1;
                }
            `}</style>

            {/* Fixed Overview Bar */}
            
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                    <a
                        href="/"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        الصفحة الرئيسية
                    </a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', marginRight: '8px' }}>الشهادات وخطابات الشكر</span>
                </div>
            </div>




            {/* Page Content */}
            <div
                style={{
                    backgroundColor: "#f5f5f5",
                    minHeight: "100vh",
                    padding: "90px 16px 40px",
                }}
            >
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                    {/* Header */}
                    <header style={{ textAlign: "center", marginBottom: "40px" }}>
                        <h1
                            style={{
                                color: primaryColor,
                                fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                                fontWeight: "bold",
                            }}
                        >
                            الشهادات وخطابات الشكر
                        </h1>
                        <div
                            style={{
                                height: "4px",
                                width: "70px",
                                backgroundColor: accentColor,
                                margin: "12px auto",
                            }}
                        />
                    </header>

                    {/* Certificates */}
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: "18px",
                                padding: "24px",
                                marginBottom: "24px",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "24px",
                            }}
                        >
                            <div style={{ flex: "1 1 450px" }}>
                                <h2
                                    style={{
                                        color: primaryColor,
                                        fontSize: "1.4rem",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {cert.title}
                                </h2>

                                <p style={{ lineHeight: "1.8", color: "#333" }}>
                                    {cert.text}
                                </p>

                                <button
                                    onClick={() => toggleImage(index)}
                                    style={{
                                        marginTop: "16px",
                                        backgroundColor: visibleImages[index]
                                            ? "#eee"
                                            : accentColor,
                                        color: "#000",
                                        border: "none",
                                        padding: "10px 26px",
                                        borderRadius: "30px",
                                        fontWeight: "600",
                                        cursor: "pointer",
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
                                        style={{ flex: "1 1 280px", textAlign: "center" }}
                                    >
                                        <img
                                            src={cert.image}
                                            alt={cert.title}
                                            onClick={() => setSelectedImage(cert.image)}
                                            style={{
                                                maxWidth: "100%",
                                                borderRadius: "14px",
                                                cursor: "zoom-in",
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}

                    {/* Thank Letters */}
                    <section style={{ marginTop: "60px", textAlign: "center" }}>
                        <h2 style={{ color: primaryColor, marginBottom: "10px" }}>
                            خطابات الشكر
                        </h2>
                        <p style={{ color: "#555", marginBottom: "30px" }}>
                            بعض خطابات الشكر الموجهة الى المعهد التكنولوجي من عملاؤئنا الكرام داخل وخارج جمهورية مصر العربية
                        </p>

                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            autoplay={{ delay: 2500 }}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            style={{
                                paddingBottom: '50px' // Add space for pagination dots
                            }}
                        >
                            {thankImages.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <div
                                        onClick={() => setSelectedImage(img.url)}
                                        style={{
                                            backgroundColor: "#fff",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.name}
                                            style={{
                                                width: "100%",
                                                height: "240px",
                                                objectFit: "contain",
                                                padding: "10px",
                                            }}
                                        />
                                        <div
                                            style={{
                                                backgroundColor: primaryColor,
                                                color: "#fff",
                                                padding: "10px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {img.name}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                </div>
            </div>

            {/* Image Preview */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.9)",
                            zIndex: 9999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                        }}
                    >
                        <img
                            src={selectedImage}
                            alt="preview"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "90%",
                                borderRadius: "12px",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Certifications;