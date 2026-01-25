import React from 'react';
import { motion } from 'framer-motion';

const Team = () => {
    const primaryColor = "#0A2A43";
    const accentColor = "#D4AF37";
    const globalFont = '"Droid Arabic Kufi", serif'; // تطبيق الخط المطلوب هنا

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
                width: '100%',
                maxWidth: '280px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: globalFont
            }}
        >
            <div style={{ position: 'relative', paddingTop: '100%' }}>
                <img
                    src={member.image}
                    alt={member.name}
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '12px 0' }}>
                <div style={smallIconCircleStyle}>f</div>
                <div style={smallIconCircleStyle}>✉</div>
                <div style={smallIconCircleStyle}>📞</div>
            </div>

            <div style={{ padding: '0 10px 20px', textAlign: 'center', fontFamily: globalFont }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 5px 0', color: primaryColor, fontFamily: globalFont }}>
                    {member.name}
                </h3>
                <p style={{ color: '#666', fontSize: '0.8rem', margin: 0, lineHeight: '1.4', minHeight: '40px', fontFamily: globalFont }}>
                    {member.role}
                </p>
            </div>
        </motion.div>
    );

    return (
        <div style={{ direction: 'rtl', fontFamily: globalFont }}>
            {/* الجزء الثابت العلوي */}
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '100', fontFamily: globalFont, padding: '10px 20px', borderBottom: '1px solid #e0e0e0' }}>
                <span className="overview" style={{ position: 'relative', bottom: '2px', fontSize: '0.9rem', fontFamily: globalFont }}>
                    <a href="/" className="btn_go_home" style={{ textDecoration: 'none', color: primaryColor, fontWeight: 'bold', fontFamily: globalFont }}>الصفحة الرئيسية</a> - فريق العمل
                </span>
            </div>

            <div style={{ backgroundColor: '#F3F5F8', minHeight: '100vh', padding: '100px 20px 60px', fontFamily: globalFont }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h1 style={{ color: primaryColor, fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '10px', fontFamily: globalFont }}>
                            فريق العمل
                        </h1>
                        <p style={{ fontSize: '1rem', color: '#666', fontFamily: globalFont }}>
                            نخبة من الكفاءات والخبرات القيادية
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '30px',
                        justifyItems: 'center'
                    }}>
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
    width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f8f9fa',
    border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '14px'
};

export default Team;