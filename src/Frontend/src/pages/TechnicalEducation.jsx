import React from "react";

export default function TechnicalEducationAlt() {
    const isMobile = window.innerWidth < 768;

    const pageStyle = {
        direction: "rtl",
        background: "#F7F9FC",
        minHeight: "100vh",
        padding: isMobile ? "20px 14px" : "60px 0",
    };

    const container = {
        maxWidth: 1200,
        margin: "0 auto",
        padding: isMobile ? "0" : "0 20px",
    };

    const card = {
        background: "#fff",
        borderRadius: 18,
        padding: isMobile ? 18 : 28,
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        marginBottom: 30,
    };

    const title = {
        fontSize: isMobile ? 22 : 34,
        fontWeight: "bold",
        color: "#0A3D62",
        marginBottom: 10,
    };

    const subtitle = {
        fontSize: isMobile ? 14 : 16,
        color: "#555",
        marginBottom: 20,
    };

    const divider = {
        width: 70,
        height: 4,
        background: "#0A3D62",
        borderRadius: 6,
        marginBottom: 20,
    };

    const text = {
        lineHeight: 1.9,
        fontSize: isMobile ? 14 : 15.5,
        color: "#333",
    };

    const schoolTitle = {
        color: "#198754",
        fontWeight: "bold",
        marginBottom: 8,
    };

    return (
        <div style={pageStyle}>
            {/* ===== FIXED HEADER (UPDATED) ===== */}
            <div
                className="overview_intro"
                style={{
                    position: 'fixed',
                    top: '70px', // <-- adjust this to match your navbar height
                    left: 0,
                    background: '#F5F7E1',
                    width: '100%',
                    zIndex: 1000,
                    padding: '8px 20px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #e0e0e0'
                }}
            >
                <span
                    className="overview"
                    style={{
                        position: 'relative',
                        bottom: '0px',
                        fontSize: 16
                    }}
                >
                    <a href="/" className="btn_go_home">الصفحة الرئيسية</a> - تطوير التعليم الفني
                </span>
            </div>


            <div style={container}>
                {/* ===== HEADER ===== */}
                <div style={{ ...card, textAlign: "center", marginTop: 80 }}>
                    <h1 style={title}>تطوير التعليم الفني</h1>
                    <div style={divider} />
                    <p style={subtitle}>
                        بروتوكول التعاون بين وزارة التربية والتعليم وشركة المقاولون العرب
                    </p>
                    <p style={text}>
                        الهدف من هذا البروتوكول إنشاء جيل جديد من خريجي المدارس الثانوية
                        الصناعية يتميز بالجدية في العمل وقادر على تحمل المسئولية والتعامل مع
                        كل جديد في صناعة البناء والتشييد مما يتيح له فرصاً عديدة للعمل
                        بالداخل والخارج ويسهم في توفير إحتياجات السوق المتعطش لهذه العمالة
                        الفنية المدربة.
                    </p>
                </div>

                {/* ===== COMPANY ROLE ===== */}
                <div style={card}>
                    <h3 style={{ ...schoolTitle, color: "#0A3D62" }}>
                        دور الشركة في ثلاثة محاور
                    </h3>
                    <ul style={{ paddingRight: 18 }}>
                        <li style={text}>✔ اختيار أفضل العناصر ورعايتهم عمليًا وصحيًا وأخلاقيًا.</li>
                        <li style={text}>
                            ✔ رفع كفاءة الكوادر البشرية بالمدارس عبر الدورات التدريبية.
                        </li>
                        <li style={text}>
                            ✔ تطوير الورش وإمدادها بالمعدات والأدوات وصيانتها.
                        </li>
                    </ul>
                </div>

                {/* ===== SCHOOLS ===== */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 24,
                    }}
                >
                    <SchoolCard
                        title="مدرسة المعدات الثقيلة الصناعية بالإسماعيلية"
                        text="التدريب بورش فرع سيناء يوم السبت من كل أسبوع مع توفير أتوبيس لنقل الطلاب لعدد (20) طالب."
                    />
                    <SchoolCard
                        title="مدرسة أبو رواش الثانوية الصناعية المشتركة"
                        text="التدريب يومي الأربعاء والخميس بالمعهد التكنولوجي – مركز تدريب شبرا لعدد (18) طالب."
                    />
                    <SchoolCard
                        title="مدرسة الشاطبي الثانوية الصناعية"
                        text="التدريب بورش العامرية المركزية بالإسكندرية – قسم اللحام لعدد (19) طالب."
                    />
                    <SchoolCard
                        title="مدرسة مدينة نصر الثانوية الصناعية"
                        text="التدريب يوم السبت بمركز تدريب شبرا – قسم الكهرباء لعدد (20) طالب."
                    />
                </div>

                {/* ===== IMAGES ===== */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 24,
                        marginTop: 40,
                    }}
                >
                    <ImageCard src="/images/tech-02.jpg" />
                    <ImageCard src="/images/tech-03.jpg" />
                </div>
            </div>
        </div>
    );
}

function SchoolCard({ title, text }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
            }}
        >
            <h4 style={{ marginBottom: 8, color: "#0d6efd" }}>{title}</h4>
            <p style={{ lineHeight: 1.8, fontSize: 14 }}>{text}</p>
        </div>
    );
}

function ImageCard({ src }) {
    return (
        <div
            style={{
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
        >
            <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
        </div>
    );
}
