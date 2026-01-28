import React from "react";
import { motion } from "framer-motion";

const Team = () => {
    const primaryColor = "#0865a8";
    const accentColor = "#f57c00";
    const globalFont = '"Droid Arabic Kufi", serif';

    const teamMembers = [
        {
            name: "أحمد العصار",
            role: "رئيس مجلس الإدارة",
            image: "/images/team4.jpg",
        },
        {
            name: "شريف حمدي",
            role: "مدير المعهد",
            image: "/images/team1.jpg",
        },
        {
            name: "هبه عادل",
            role: "نائب مدير المعهد للشئون العلمية والجودة",
            image: "/images/team2.jpg",
        },
        {
            name: "طارق منصور",
            role: "نائب مدير المعهد للشئون الفنية والاختبارات",
            image: "/images/team3.jpg",
        },
    ];

    const MemberCard = ({ member }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
                width: "100%",
                maxWidth: "280px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                fontFamily: globalFont,
            }}
        >
            <div style={{ position: "relative", paddingTop: "100%" }}>
                <img
                    src={member.image}
                    alt={member.name}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "12px 0",
                }}
            >
                <div style={smallIconCircleStyle}>f</div>
                <div style={smallIconCircleStyle}>✉</div>
                <div style={smallIconCircleStyle}>📞</div>
            </div>

            <div style={{ padding: "0 12px 20px", textAlign: "center" }}>
                <h3
                    style={{
                        fontSize: "1.05rem",
                        fontWeight: "bold",
                        marginBottom: "6px",
                        color: primaryColor,
                        fontFamily: globalFont,
                    }}
                >
                    {member.name}
                </h3>
                <p
                    style={{
                        fontSize: "0.85rem",
                        color: "#555",
                        lineHeight: "1.4",
                        minHeight: "40px",
                        fontFamily: globalFont,
                    }}
                >
                    {member.role}
                </p>
            </div>
        </motion.div>
    );

    return (
        <div style={{ direction: "rtl", fontFamily: globalFont }}>

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
                        <span className="mr-3 text-gray-700">فريق العمل</span>
                    </span>
                </div>
            </div>

            {/* Page Content */}
            <div
                style={{
                    backgroundColor: "#f3f5f8",
                    minHeight: "100vh",
                    padding: "140px 16px 60px", // navbar + overview
                    fontFamily: globalFont,
                }}
            >
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <h1
                            style={{
                                color: primaryColor,
                                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                                fontWeight: "bold",
                                marginBottom: "8px",
                            }}
                        >
                            فريق العمل
                        </h1>
                        <p style={{ color: "#666", fontSize: "0.95rem" }}>
                            نخبة من الكفاءات والخبرات القيادية
                        </p>
                    </div>

                    {/* Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "30px",
                            justifyItems: "center",
                        }}
                    >
                        {teamMembers.map((member, index) => (
                            <MemberCard key={index} member={member} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const smallIconCircleStyle = {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "14px",
};

export default Team;
