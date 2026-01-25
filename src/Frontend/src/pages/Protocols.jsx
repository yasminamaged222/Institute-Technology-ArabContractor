import React from "react";

export default function Protocols() {
    const isMobile = window.innerWidth < 700;

    const partners = [
        "جمعية المحاسبين والمراجعين المصرية",
        "مؤسسة المهندسين المدنيين البريطانيين (ICE)",
        "مركز تحديث الصناعة",
        "الغرفة الألمانية العربية للصناعة والتجارة",
        "المركز الإقليمي لتعليم الكبار (أسفك)",
        "المؤسسة الثقافية العمالية",
        "المجمع التعليمي التكنولوجي المتكامل بأسيوط",
        "نقابة المهندسين بالقاهرة",
        "جامعة 6 أكتوبر (كلية الهندسة)",
        "صندوق تطوير التعليم",
        "المؤسسة المصرية للزكاة",
        "جامعة عين شمس (التعليم المفتوح)",
        "الجامعة المصرية الروسية (كلية الهندسة)",
    ];

    const getColumns = () => {
        const w = window.innerWidth;
        if (w > 900) return 3;
        if (w > 600) return 2;
        return 1;
    };

    return (
        <div dir="rtl" style={{ background: "#F7F9FC", minHeight: "100vh" }}>
            {/* ===== FIXED HEADER ===== */}
            {/* ======== ADDED PART (NO CHANGE) ======== */}
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>
                <span className="overview" style={{ position: 'relative', bottom: '5px' }}>
                    <a href="/" className="btn_go_home">الصفحة الرئيسية</a> -البروتوكولات والاتفاقيات
                </span>
            </div>


            {/* ===== CONTENT ===== */}
            <div
                style={{
                    paddingTop: 80,
                    paddingLeft: isMobile ? 16 : 80,
                    paddingRight: isMobile ? 16 : 80,
                    paddingBottom: 40,
                }}
            >
                {/* ===== TITLE ===== */}
                <div style={{ textAlign: "center" }}>
                    <h1
                        style={{
                            fontSize: isMobile ? 22 : 32,
                            color: "#0A3D62",
                            marginBottom: 10,
                        }}
                    >
                        البروتوكولات والاتفاقيات
                    </h1>
                    <div
                        style={{
                            width: 90,
                            height: 4,
                            background: "#0A3D62",
                            borderRadius: 8,
                            margin: "0 auto",
                        }}
                    />
                </div>

                {/* ===== DESCRIPTION ===== */}
                <p
                    style={{
                        marginTop: 30,
                        fontSize: isMobile ? 14 : 16,
                        lineHeight: 1.9,
                        color: "#444",
                    }}
                >
                    تشرف المعهد بعقد بروتوكولات واتفاقيات تعاون وعقود تدريب مع العديد من
                    الجامعات والهيئات بهدف إثراء العملية التدريبية وتبادل الخبرات، وتتمثل
                    في:
                </p>

                {/* ===== PARTNERS GRID ===== */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
                        gap: 14,
                        marginTop: 30,
                    }}
                >
                    {partners.map((p, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#fff",
                                borderRadius: 16,
                                padding: "12px 14px",
                                display: "flex",
                                alignItems: "center",
                                boxShadow: "0 5px 10px rgba(0,0,0,0.06)",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: isMobile ? 20 : 22,
                                    color: "#0A3D62",
                                    marginLeft: 10,
                                }}
                            >
                                🏢
                            </span>
                            <span
                                style={{
                                    fontSize: isMobile ? 12 : 13.5,
                                    lineHeight: 1.5,
                                }}
                            >
                                {p}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ===== IMAGES ===== */}
                <div
                    style={{
                        display: isMobile ? "block" : "flex",
                        gap: 20,
                        marginTop: 40,
                    }}
                >
                    <ImageCard url="https://www.arabcont.com/icemt/assets/images/protocol1.jpg" />
                    <ImageCard url="https://www.arabcont.com/icemt/assets/images/protocol2.jpg" />
                </div>
            </div>
        </div>
    );
}

function ImageCard({ url }) {
    return (
        <div
            style={{
                flex: 1,
                borderRadius: 18,
                overflow: "hidden",
                marginBottom: 16,
            }}
        >
            <div style={{ aspectRatio: "16 / 9" }}>
                <img
                    src={url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
        </div>
    );
}
