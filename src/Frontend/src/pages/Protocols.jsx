import React from "react";

export default function Protocols() {
    const isMobile = window.innerWidth < 700;
    const globalFont = '"Droid Arabic Kufi", serif';

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
        <div
            dir="rtl"
            style={{
                background: "#ffffff",
                minHeight: "100vh",
                fontFamily: globalFont,
            }}
        >
            {/* Fixed Overview Bar — SAME STYLE & COLORS */}
            <div className="fixed left-0 top-[64px] z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 font-['Droid_Arabic_Kufi']">
                <div className="text-center">
                    <span className="text-base">
                        <a
                            href="/"
                            className="ml-3 text-gray-700 hover:text-gray-900"
                        >
                            الصفحة الرئيسية
                        </a>
                        <span className="text-gray-500">-</span>
                        <span className="mr-3 text-gray-700">
                            البروتوكولات والاتفاقيات
                        </span>
                    </span>
                </div>
            </div>

            {/* CONTENT */}
            <div
                style={{
                    paddingTop: 140, // navbar + overview
                    paddingLeft: isMobile ? 16 : 80,
                    paddingRight: isMobile ? 16 : 80,
                    paddingBottom: 40,
                }}
            >
                {/* TITLE */}
                <div style={{ textAlign: "center" }}>
                    <h1
                        style={{
                            fontSize: isMobile ? 22 : 32,
                            color: "#0865a8",
                            marginBottom: 10,
                            fontFamily: globalFont,
                        }}
                    >
                        البروتوكولات والاتفاقيات
                    </h1>
                    <div
                        style={{
                            width: 90,
                            height: 4,
                            background: "#f57c00",
                            borderRadius: 8,
                            margin: "0 auto",
                        }}
                    />
                </div>

                {/* DESCRIPTION */}
                <p
                    style={{
                        marginTop: 30,
                        fontSize: isMobile ? 14 : 16,
                        lineHeight: 1.9,
                        color: "#000",
                        fontFamily: globalFont,
                    }}
                >
                    تشرف المعهد بعقد بروتوكولات واتفاقيات تعاون وعقود تدريب مع العديد من
                    الجامعات والهيئات بهدف إثراء العملية التدريبية وتبادل الخبرات، وتتمثل
                    في:
                </p>

                {/* PARTNERS GRID */}
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
                                boxShadow: "0 5px 12px rgba(0,0,0,0.08)",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: isMobile ? 20 : 22,
                                    color: "#0865a8",
                                    marginLeft: 10,
                                }}
                            >
                                🏢
                            </span>
                            <span
                                style={{
                                    fontSize: isMobile ? 12 : 13.5,
                                    lineHeight: 1.5,
                                    color: "#000",
                                    fontFamily: globalFont,
                                }}
                            >
                                {p}
                            </span>
                        </div>
                    ))}
                </div>

                {/* IMAGES */}
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
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>
        </div>
    );
}
