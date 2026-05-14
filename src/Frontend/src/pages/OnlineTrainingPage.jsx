import React, { useEffect } from 'react';
import {
    FaProjectDiagram,
    FaUserTie,
    FaFileContract,
    FaLightbulb,
    FaShieldAlt,
    FaVideo,
    FaComments,
    FaMapMarkerAlt,
    FaBook,
    FaHeadset,
    FaCheckCircle,
} from 'react-icons/fa';

/* ─────────────────────────────────────────
   Microsoft Teams SVG Icon
───────────────────────────────────────── */
const TeamsIcon = ({ size = 42 }) => (
    <svg width={size} height={size} viewBox="0 0 2228.833 2073.333" xmlns="http://www.w3.org/2000/svg">
        <path d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483v524.398
            c0,199.901-162.001,361.902-361.902,361.902h-1.78c-199.901,0.001-361.902-162-361.902-361.901
            V828.971C1504.249,800.544,1526.211,777.5,1554.637,777.5z" fill="#5059C9" />
        <circle cx="1943.75" cy="440.583" r="233.25" fill="#5059C9" />
        <circle cx="1218.083" cy="336.917" r="309.083" fill="#7B83EB" />
        <path d="M1667.323,777.5H717.01c-53.743,1.33-96.257,45.931-94.927,99.675v598.105
            c-7.825,322.069,247.353,590.279,569.422,598.104c322.069-7.825,577.247-276.035,569.422-598.104
            V877.174C1762.257,823.431,1720.906,777.5,1667.323,777.5z" fill="#7B83EB" />
        <path opacity="0.1" d="M1244,777.5v838.145c-0.258,38.435-23.549,72.964-59.09,87.598
            c-11.316,4.787-23.478,7.254-35.765,7.257H667.613c-6.738-17.105-12.958-34.21-18.142-51.833
            c-17.654-57.884-26.601-117.851-26.578-178.167V877.174c-1.33-53.744,41.185-98.345,94.927-99.674H1244z"/>
        <path opacity="0.2" d="M1192.167,777.5v889.978c-0.002,12.287-2.47,24.449-7.257,35.765
            c-14.634,35.541-49.163,58.833-87.598,59.09H691.975c-8.812-17.105-17.105-34.21-24.362-51.833
            c-7.257-17.623-12.958-34.21-18.142-51.833c-17.654-57.884-26.601-117.851-26.578-178.167V877.174
            c-1.33-53.744,41.185-98.345,94.927-99.674H1192.167z"/>
        <path opacity="0.2" d="M1192.167,777.5v786.312c-0.395,52.223-42.704,94.531-94.927,94.927H649.833
            c-17.654-57.884-26.601-117.851-26.578-178.167V877.174c-1.33-53.744,41.185-98.345,94.927-99.674H1192.167z"/>
        <path opacity="0.2" d="M1140.333,777.5v786.312c-0.395,52.223-42.704,94.531-94.927,94.927H649.833
            c-17.654-57.884-26.601-117.851-26.578-178.167V877.174c-1.33-53.744,41.185-98.345,94.927-99.674H1140.333z"/>
        <path opacity="0.1" d="M1244,509.522v163.275c-8.812,0.518-17.105,1.037-25.917,1.037
            c-8.812,0-17.105-0.518-25.917-1.037c-17.496-1.161-34.848-3.937-51.833-8.293
            c-104.963-26.655-191.679-98.609-234.603-196.003c-7.704-17.517-13.554-35.787-17.472-54.499h258.925
            C1201.827,414.866,1243.764,457.252,1244,509.522z"/>
        <path opacity="0.2" d="M1192.167,561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293
            c-104.963-26.655-191.679-98.609-234.603-196.003h191.509C1149.722,468.866,1191.917,510.8,1192.167,561.355z"/>
        <path opacity="0.2" d="M1192.167,561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293
            c-104.963-26.655-191.679-98.609-234.603-196.003h191.509C1149.722,468.866,1191.917,510.8,1192.167,561.355z"/>
        <path opacity="0.2" d="M1140.333,561.355v103.148c-104.963-26.655-191.679-98.609-234.603-196.003h139.676
            C1097.888,468.866,1140.083,510.8,1140.333,561.355z"/>
        <linearGradient id="teams_grad" x1="198.099" y1="1683.0726" x2="942.2344" y2="394.2607"
            gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5a62c3" />
            <stop offset="0.5" stopColor="#4d55bd" />
            <stop offset="1" stopColor="#3940ab" />
        </linearGradient>
        <path fill="url(#teams_grad)" d="M95.01,468.5h950.323c52.473,0,95.01,42.538,95.01,95.01v950.323
            c0,52.473-42.538,95.01-95.01,95.01H95.01C42.538,1608.843,0,1566.305,0,1513.833V563.51
            C0,511.038,42.538,468.5,95.01,468.5z"/>
        <path d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844H820.211V828.193z" fill="#ffffff" />
    </svg>
);

/* ─────────────────────────────────────────
   Illustration 1 – Virtual Meeting (Section: آلية تنفيذ التدريب)
───────────────────────────────────────── */
const VirtualMeetingIllustration = () => (
    <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}>
        <defs>
            <linearGradient id="vm_bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0a3d6b" />
                <stop offset="100%" stopColor="#0865a8" />
            </linearGradient>
            <linearGradient id="vm_screen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a4a7a" />
                <stop offset="100%" stopColor="#0d3660" />
            </linearGradient>
        </defs>

        {/* Background */}
        <rect width="700" height="320" fill="url(#vm_bg)" rx="16" />

        {/* Decorative circles */}
        <circle cx="620" cy="40" r="80" fill="white" fillOpacity="0.04" />
        <circle cx="80" cy="280" r="60" fill="white" fillOpacity="0.04" />
        <circle cx="350" cy="160" r="200" fill="white" fillOpacity="0.03" />

        {/* ── Main Screen ── */}
        <rect x="180" y="40" width="340" height="200" rx="12" fill="url(#vm_screen)" stroke="#1e6fbb" strokeWidth="2" />
        {/* Screen header bar */}
        <rect x="180" y="40" width="340" height="32" rx="12" fill="#0d3660" />
        <rect x="180" y="58" width="340" height="14" fill="#0d3660" />
        {/* Dots */}
        <circle cx="200" cy="56" r="5" fill="#e53e3e" />
        <circle cx="218" cy="56" r="5" fill="#f6ad55" />
        <circle cx="236" cy="56" r="5" fill="#68d391" />
        {/* Title bar text lines */}
        <rect x="252" y="51" width="120" height="9" rx="4" fill="white" fillOpacity="0.2" />

        {/* Video grid - 4 participants */}
        <rect x="192" y="84" width="152" height="100" rx="8" fill="#0f4880" />
        <rect x="356" y="84" width="152" height="100" rx="8" fill="#0f4880" />
        <rect x="192" y="196" width="152" height="34" rx="8" fill="#0f4880" />
        <rect x="356" y="196" width="152" height="34" rx="8" fill="#0f4880" />

        {/* Avatar circles in video tiles */}
        <circle cx="268" cy="128" r="24" fill="#1a6fbb" />
        <circle cx="268" cy="116" r="10" fill="#4aa0e0" />
        <path d="M244,150 Q268,138 292,150" fill="#4aa0e0" opacity="0.7" />

        <circle cx="432" cy="128" r="24" fill="#c05621" />
        <circle cx="432" cy="116" r="10" fill="#f57c00" />
        <path d="M408,150 Q432,138 456,150" fill="#f57c00" opacity="0.7" />

        {/* Bottom tiles - chat/mic indicators */}
        <rect x="200" y="202" width="60" height="22" rx="5" fill="#1e5f96" />
        <rect x="268" y="202" width="70" height="22" rx="5" fill="#1e5f96" />
        <rect x="364" y="202" width="60" height="22" rx="5" fill="#1e5f96" />
        <rect x="432" y="202" width="70" height="22" rx="5" fill="#1e5f96" />

        {/* Screen bottom toolbar */}
        <rect x="192" y="233" width="316" height="0" fill="none" />
        {/* Toolbar icons row */}
        {[220, 258, 296, 334, 372, 410, 448].map((x, i) => (
            <circle key={i} cx={x} cy="243" r="10"
                fill={i === 3 ? "#f57c00" : "white"}
                fillOpacity={i === 3 ? 1 : 0.15} />
        ))}

        {/* Screen stand */}
        <rect x="336" y="240" width="28" height="20" rx="3" fill="#0d3660" />
        <rect x="316" y="258" width="68" height="6" rx="3" fill="#0d3660" />

        {/* ── Left side person ── */}
        <circle cx="100" cy="155" r="38" fill="#1a4a7a" />
        <circle cx="100" cy="138" r="16" fill="#4aa0e0" />
        <path d="M68,185 Q100,168 132,185" fill="#4aa0e0" opacity="0.8" />
        {/* Laptop hint */}
        <rect x="66" y="190" width="68" height="40" rx="6" fill="#0d3660" stroke="#1e6fbb" strokeWidth="1.5" />
        <rect x="72" y="196" width="56" height="28" rx="3" fill="#0a3d6b" />
        {/* Signal waves */}
        <path d="M140,155 Q155,145 140,135" stroke="#f57c00" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M145,160 Q165,148 145,128" stroke="#f57c00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M150,165 Q175,150 150,122" stroke="#f57c00" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />

        {/* ── Right side person ── */}
        <circle cx="600" cy="155" r="38" fill="#1a4a7a" />
        <circle cx="600" cy="138" r="16" fill="#f57c00" />
        <path d="M568,185 Q600,168 632,185" fill="#f57c00" opacity="0.8" />
        <rect x="566" y="190" width="68" height="40" rx="6" fill="#0d3660" stroke="#1e6fbb" strokeWidth="1.5" />
        <rect x="572" y="196" width="56" height="28" rx="3" fill="#0a3d6b" />
        {/* Signal waves */}
        <path d="M560,155 Q545,145 560,135" stroke="#f57c00" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M555,160 Q535,148 555,128" stroke="#f57c00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M550,165 Q525,150 550,122" stroke="#f57c00" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />

        {/* ── Labels ── */}
        <text x="350" y="295" textAnchor="middle" fill="white" fillOpacity="0.7"
            fontSize="13" fontFamily="'Noto Kufi Arabic', serif">
            جلسات تدريبية مباشرة عبر Microsoft Teams
        </text>

        {/* Teams logo badge */}
        <rect x="314" y="273" width="72" height="8" rx="4" fill="white" fillOpacity="0.1" />
    </svg>
);

/* ─────────────────────────────────────────
   Illustration 2 – Online Features (Section: مميزات التدريب الأونلاين)
───────────────────────────────────────── */
const OnlineFeaturesIllustration = () => (
    <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}>
        <defs>
            <linearGradient id="of_bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e8f4fd" />
            </linearGradient>
            <linearGradient id="of_card" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0865a8" />
                <stop offset="100%" stopColor="#0a3d6b" />
            </linearGradient>
        </defs>

        <rect width="700" height="260" fill="url(#of_bg)" rx="16" />

        {/* Subtle grid lines */}
        {[100, 200, 300, 400, 500, 600].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="260" stroke="#0865a8" strokeOpacity="0.05" strokeWidth="1" />
        ))}
        {[65, 130, 195].map(y => (
            <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#0865a8" strokeOpacity="0.05" strokeWidth="1" />
        ))}

        {/* ── 5 feature tiles ── */}
        {[
            { x: 30, icon: '🎥', label: 'بث\nمباشر', color: '#0865a8' },
            { x: 165, icon: '💬', label: 'تفاعل\nفوري', color: '#f57c00' },
            { x: 300, icon: '📍', label: 'من أي\nمكان', color: '#0865a8' },
            { x: 435, icon: '📚', label: 'محتوى\nمحدّث', color: '#f57c00' },
            { x: 570, icon: '🎧', label: 'دعم\nفني', color: '#0865a8' },
        ].map((tile, i) => (
            <g key={i}>
                {/* Card shadow */}
                <rect x={tile.x + 2} y="52" width="102" height="156" rx="14" fill={tile.color} fillOpacity="0.08" />
                {/* Card */}
                <rect x={tile.x} y="50" width="102" height="156" rx="14"
                    fill="white" stroke={tile.color} strokeOpacity="0.2" strokeWidth="1.5" />
                {/* Top accent bar */}
                <rect x={tile.x} y="50" width="102" height="5" rx="14" fill={tile.color} />
                <rect x={tile.x} y="53" width="102" height="4" fill={tile.color} />
                {/* Icon circle */}
                <circle cx={tile.x + 51} cy="105" r="28" fill={tile.color} fillOpacity="0.1" />
                <text x={tile.x + 51} y="114" textAnchor="middle" fontSize="26">{tile.icon}</text>
                {/* Label */}
                {tile.label.split('\n').map((line, li) => (
                    <text key={li} x={tile.x + 51} y={155 + li * 19}
                        textAnchor="middle" fontSize="13" fontWeight="700"
                        fill="#1e293b" fontFamily="'Noto Kufi Arabic', serif">
                        {line}
                    </text>
                ))}
            </g>
        ))}

        {/* Connecting arrows between cards */}
        {[131, 266, 401, 536].map((x, i) => (
            <g key={i}>
                <line x1={x} y1="128" x2={x + 34} y2="128" stroke="#0865a8" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4,3" />
                <polygon points={`${x + 34},124 ${x + 34},132 ${x + 40},128`} fill="#0865a8" fillOpacity="0.3" />
            </g>
        ))}

        {/* Bottom label */}
        <text x="350" y="232" textAnchor="middle" fill="#0865a8" fillOpacity="0.7"
            fontSize="12" fontFamily="'Noto Kufi Arabic', serif">
            ✦ مميزات التدريب الأونلاين بالمعهد التكنولوجي لهندسة التشييد والإدارة ✦
        </text>
    </svg>
);

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const css = `
.ot-page-root {
    min-height: 100vh;
    background: #fff;
    margin: 0;
    padding: 0;
    font-family: "Droid Arabic Kufi", "Noto Kufi Arabic", serif;
}

/* ── HERO ── */
.ot-hero {
    position: relative;
    padding: clamp(80px,10vw,120px) clamp(20px,5vw,80px) clamp(60px,8vw,100px);
    background: linear-gradient(135deg, #0a3d6b 0%, #0865a8 60%, #1a7abf 100%);
    color: #fff;
    overflow: hidden;
    margin-top: 36px;
    text-align: right;
}
.ot-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
}
.ot-hero-accent-bar {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
    background: #f57c00;
}
.ot-hero-content {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
}
.ot-hero-eyebrow {
    display: inline-block;
    font-size: clamp(12px,1.4vw,15px);
    font-weight: 700;
    color: #f9c56a;
    margin-bottom: 14px;
    padding: 4px 14px;
    border: 1px solid rgba(249,197,106,0.4);
    border-radius: 20px;
}
.ot-hero-title {
    font-size: clamp(28px,5vw,52px);
    font-weight: 900;
    line-height: 1.25;
    margin: 0 0 20px;
    color: #fff;
}
.ot-hero-title em { font-style: normal; color: #f9c56a; }
.ot-hero-body {
    font-size: clamp(14px,1.6vw,17px);
    line-height: 2;
    color: rgba(255,255,255,0.88);
    margin: 0;
    max-width: 680px;
}

/* ── SHARED ── */
.ot-section-white { background: #fff; padding: clamp(40px,6vw,80px) 0; text-align: right; }
.ot-section-gray  { background: #f8fafc; padding: clamp(40px,6vw,80px) 0; text-align: right; }
.ot-section-inner { max-width: 1200px; margin: 0 auto; padding: 0 clamp(20px,4vw,60px); }
.ot-section-heading { font-size: clamp(20px,2.5vw,28px); font-weight: 900; color: #1e293b; margin: 0 0 10px; }
.ot-section-heading span { color: #0865a8; }
.ot-heading-bar { width: 60px; height: 4px; background: #f57c00; border-radius: 2px; margin: 0 0 36px auto; }
.ot-body-p { font-size: clamp(14px,1.4vw,16px); line-height: 2.1; color: #374151; margin: 0 0 16px; }

/* ── BULLET LIST ── */
.ot-bullet-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ot-bullet-list li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(14px,1.4vw,15px); line-height: 1.8; color: #374151; }
.ot-bullet-dot { flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: #f57c00; margin-top: 8px; }

/* ── WHY CARDS ── */
.ot-why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; }
.ot-why-card {
    background: #fff; border-radius: 14px; padding: 22px 18px;
    border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s; text-align: right;
}
.ot-why-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(8,101,168,0.12); }
.ot-why-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: linear-gradient(135deg, #0865a8, #1a7abf);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px; margin-right: auto; margin-left: 0;
}
.ot-why-label { font-size: 14px; font-weight: 900; color: #1e293b; margin: 0; line-height: 1.5; }

/* ── INTEGRATED BOX ── */
.ot-integrated-box {
    background: linear-gradient(135deg, #0a3d6b 0%, #0865a8 100%);
    border-radius: 20px; padding: clamp(28px,4vw,48px); color: #fff;
}
.ot-integrated-title { font-size: clamp(18px,2vw,22px); font-weight: 900; color: #f9c56a; margin: 0 0 14px; }
.ot-integrated-p { font-size: clamp(14px,1.4vw,15px); line-height: 2; color: rgba(255,255,255,0.88); margin: 0 0 16px; }
.ot-integrated-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ot-integrated-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.3vw,15px); line-height: 1.8; color: rgba(255,255,255,0.88); }
.ot-int-dot { flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: #f9c56a; margin-top: 8px; }

/* ── GOALS ── */
.ot-goals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.ot-goal-card {
    background: #fff; border-radius: 14px; padding: 22px;
    border-right: 4px solid #0865a8; box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    display: flex; align-items: flex-start; gap: 14px;
}
.ot-goal-check { flex-shrink: 0; color: #0865a8; margin-top: 2px; }
.ot-goal-text { font-size: 15px; line-height: 1.8; color: #374151; margin: 0; }

/* ── PLATFORM ── */
.ot-platform-box {
    background: #fff; border-radius: 20px; padding: clamp(24px,3vw,40px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    display: grid; grid-template-columns: auto 1fr; gap: 30px; align-items: start;
}
@media (max-width: 600px) { .ot-platform-box { grid-template-columns: 1fr; } }
.ot-platform-logo {
    width: 90px; height: 90px; border-radius: 20px;
    background: linear-gradient(135deg, #0865a8, #1a7abf);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(8,101,168,0.3); flex-shrink: 0;
}
.ot-platform-name { font-size: clamp(18px,2vw,22px); font-weight: 900; color: #0865a8; margin: 0 0 16px; }
.ot-platform-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ot-platform-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #374151; line-height: 1.7; }
.ot-platform-bullets li::before { content: ''; flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: #f57c00; margin-top: 7px; }

/* ── INFOGRAPHIC ── */
.ot-infographic-wrapper { border-radius: 16px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.14); }
.ot-infographic-wrapper img { width: 100%; height: auto; display: block; }

/* ── ILLUSTRATION WRAPPER ── */
.ot-illustration-wrapper {
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 8px 32px rgba(8,101,168,0.15);
    margin-bottom: 28px;
}

/* ── FEATURES ── */
.ot-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.ot-feature-card {
    background: #fff; border-radius: 14px; padding: 20px;
    border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.05);
    display: flex; align-items: flex-start; gap: 12px; text-align: right; transition: transform 0.2s;
}
.ot-feature-card:hover { transform: translateY(-3px); }
.ot-feature-icon {
    flex-shrink: 0; width: 42px; height: 42px; border-radius: 10px;
    background: linear-gradient(135deg, #0865a8, #1a7abf);
    display: flex; align-items: center; justify-content: center;
}
.ot-feature-label { font-size: 14px; font-weight: 900; color: #1e293b; line-height: 1.6; margin: 0; }

/* ── PROGRAMS ── */
.ot-programs-list { display: flex; flex-direction: column; }
.ot-program-card {
    display: flex; gap: clamp(16px,2vw,24px); align-items: flex-start;
    padding: clamp(20px,2.5vw,28px) 0; border-bottom: 1px solid #e2e8f0;
}
.ot-program-card:last-child { border-bottom: none; }
.ot-icon {
    flex-shrink: 0;
    width: clamp(48px,5vw,58px); height: clamp(48px,5vw,58px); border-radius: 50%;
    background: linear-gradient(135deg, #0865a8, #1a7abf);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(8,101,168,0.25); margin-top: 4px;
}
.ot-program-content { flex: 1; }
.ot-program-title { font-size: clamp(15px,1.6vw,18px); font-weight: 900; margin: 0 0 10px; line-height: 1.5; }
.ot-program-title a { color: #0865a8; text-decoration: none; transition: color 0.2s; }
.ot-program-title a:hover { color: #f57c00; }
.ot-program-desc { font-size: clamp(13px,1.3vw,15px); line-height: 2; color: #374151; margin: 0; }

/* ── CTA ── */
.ot-cta-banner {
    background: linear-gradient(135deg, #0a3d6b, #0865a8);
    border-radius: 16px; padding: 32px; text-align: center; margin-top: 40px;
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center;
}
.ot-cta-icon { color: #f9c56a; flex-shrink: 0; }
.ot-cta-text { font-size: clamp(14px,1.5vw,17px); font-weight: 700; color: #fff; margin: 0; }
`;

export default function OnlineTrainingPage() {

    const whyItems = [
        { icon: <FaVideo size={20} color="white" />, label: 'تقديم التدريب بشكل مباشر (Live) عبر Microsoft Teams' },
        { icon: <FaComments size={20} color="white" />, label: 'بيئة تعليمية تفاعلية' },
        { icon: <FaMapMarkerAlt size={20} color="white" />, label: 'إمكانية الحضور من أي مكان داخل أو خارج مصر' },
        { icon: <FaBook size={20} color="white" />, label: 'محتوى تدريبي محدث وفق احتياجات سوق العمل' },
        { icon: <FaHeadset size={20} color="white" />, label: 'دعم فني وتواصل مستمر مع المتدربين' },
    ];

    const integratedBullets = [
        'إرسال روابط الحضور والتعليمات بشكل واضح ومنظم',
        'متابعة مستمرة لضمان الالتزام والاستفادة',
        'توفير تسجيلات أو مواد مساعدة (عند الحاجة)',
        'تقييم الأداء لضمان تحقيق أهداف التدريب',
    ];

    const goals = [
        'تأهيل كوادر قادرة على مواكبة التطور التكنولوجي',
        'دعم الطلاب والخريجين بمهارات عملية حقيقية',
        'ربط التدريب بمتطلبات سوق العمل محليًا ودوليًا',
    ];

    const mechanismBullets = [
        'عقد اجتماعات مباشرة بالصوت والصورة',
        'مشاركة المحتوى والعروض التقديمية',
        'التفاعل من خلال الدردشة والأسئلة المباشرة',
        'تسجيل المحاضرات للرجوع إليها لاحقًا',
    ];

    const platformFeatures = [
        'الفصول الافتراضية المباشرة',
        'مشاركة الملفات والمواد التدريبية',
        'تنظيم الجداول التدريبية وإرسال الدعوات',
        'إدارة التفاعل بين المدرب والمتدربين بكفاءة',
    ];

    const features = [
        { icon: <FaVideo size={18} color="white" />, label: 'تدريب مباشر (Live) وليس مسجل' },
        { icon: <FaComments size={18} color="white" />, label: 'تفاعل فوري مع المدربين' },
        { icon: <FaMapMarkerAlt size={18} color="white" />, label: 'مرونة في الحضور من أي مكان' },
        { icon: <FaBook size={18} color="white" />, label: 'محتوى تدريبي محدث وفق متطلبات سوق العمل' },
        { icon: <FaHeadset size={18} color="white" />, label: 'دعم فني مستمر طوال فترة التدريب' },
    ];

    const programs = [
        {
            icon: <FaProjectDiagram size={28} color="white" />,
            title: 'برنامج Project Management Professional (PMP)',
            description: 'وهو برنامج إدارة المشاريع الإحترافية (PMP) الذي اصبح الآن متوفر أون لاين تحت اشراف طقم ادارى متخصص (تدريب عن بعد) مما يتيح تنفيذ العملية اون لاين، بحيث تتمكن من الإستفسار عن أي نقطة أو تساؤل أثناء مشاهدة المادة وحضور البرنامج وايضا الاستفادة بالحصول على مقاطع فيديو متعددة تشرح مادة إدارة المشاريع الإحترافية (PMP) مبنيةً على آخر إصدار من كتاب و منهجية إدارة المشاريع الإحترافية PMBOK وايضا امثلة من الاختبارات للمساعدة في تأكيد المعلومات الواردة في كل وحدة وفور اكتمال حضور المتدرب ثلاثة اسابيع بواقع 45 ساعة تدريبية واجتيازه تقييم كل اسبوع من الاسابيع الثلاثة بنجاح يحصل على شهادة من المعهد كجهة معتمدة من معهد ادارة المشروعات الامريكى PMI.',
        },
        {
            icon: <FaUserTie size={28} color="white" />,
            title: 'القيادة التنفيذية',
            description: 'وهى ندوة اليوم الواحد حيث تم تنظيمها باستخدام تكنولوجيا الاتصالات عن بعد حيث يتم حضور المتدربين الندوة عن بعد والاستفادة من المادة العلمية التى يلقيها المحاضر وتشمل (الانماط المختلفة للقيادة - اساليب القيادة الفعالة)',
        },
        {
            icon: <FaFileContract size={28} color="white" />,
            title: 'عقود الفيديك',
            description: 'وهى ندوة تعقد لمدة يومين للمهتمين بتفاصيل العقود الخاصة بالمشروعات أو مدير مشروع أو مسئول التعاقدات حيث تحتوى الندوة على فكرة عامة عن عقود الفيديك وشروطه والبنود المتعلقة بالوقت به والبنود المتعلقة بالتغيرات والمطالبات والبنود المتعلقة بدفع المستحقات وايضا تسوية النزاعات فى عقود الفيديك ويتم تنفيذها ايضا عن بعد',
        },
        {
            icon: <FaLightbulb size={28} color="white" />,
            title: 'اساليب تحليل المشكلات واتخاذ القرارات',
            description: 'وهى ندوة لمدة يومين تتيح للمتدرب حل المشكلات واتخاذ القرارات والتى تنظم طريقة تفكير المتدرب عند مواجهة المشكلات فى جميع نواحي الحياة العملية ومن خلالها يستطيع المتدرب التعرف على الطرق العلمية المنظمة لحل المشكلات واتخاذ القرارات بداية من الاسلوب الادارى فى تحليل وحل المشكلات ثم معرفة انماط المديرين فى حل المشكلات الى ان يتم الإتفاق على افضل القرارات لتطبيقها ووضع ورقة عمل لتنفيذها ومتابعتها وتقييم فاعليته ويتم تنفيذها ايضا عن بعد',
        },
        {
            icon: <FaShieldAlt size={28} color="white" />,
            title: 'برنامجى السلامة والجودة للمهندسين المرشحين للترقى',
            description: 'وفى اطار حرص الشركة لتزويد العاملين بها بالمعرفة الكاملة بأسس السلامة والصحة المهنية ومتطلبات الجودة بالشركة فقد حرصت على ضرورة حضور المهندسين المرشحين للترقى لبرنامجى السلامة والجودة مما يتيح للمهندسين الحاضرين لتلك البرامج التعامل مع متطلبات السلامة من حيث (مهمات الحماية الشخصية – دليل و خطة السلامة والصحة المهنية للمشروعات - خطة الاستجابة للطوارئ والحريق - تصاريح الاعمال الخطرة - تحليل مؤشرات الحوادث والاصابات والامراض المهنية - تقييم المخاطر - ترتيب ونظافة مواقع العمل) وايضا لتحقيق اعلى جودة من حيث (التعريفات الهامة والتطور التاريخى للجودة - المواصفات الدولية الأيزو) ويتم تنفيذها ايضا عن بعد',
        },
    ];

    useEffect(() => {
        document.title = 'التدريب عن بعد ( اونلاين ) - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <>
            <style>{css}</style>
            <div className="ot-page-root" dir="rtl">

                {/* ── BREADCRUMB ── */}
                <div style={{
                    position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%',
                    borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px'
                }}>
                    <div style={{ textAlign: 'center', fontFamily: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                        <a href="/" style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                            onMouseEnter={e => e.target.style.color = '#f57c00'}
                            onMouseLeave={e => e.target.style.color = '#0865a8'}>
                            الصفحة الرئيسية
                        </a>
                        <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                        <span style={{ color: '#374151', marginRight: '8px' }}>تدريب عن بعد ( اونلاين )</span>
                    </div>
                </div>

                {/* ── HERO ── */}
                <section className="ot-hero">
                    <div className="ot-hero-accent-bar" />
                    <div className="ot-hero-content">
                        <span className="ot-hero-eyebrow">تعلم بلا حدود جغرافية</span>
                        <h1 className="ot-hero-title">التدريب عن بعد<br /><em>( أونلاين )</em></h1>
                        <p className="ot-hero-body">
                            في إطار توجه المعهد التكنولوجي لهندسة التشييد والإدارة نحو التحول الرقمي وتطوير منظومة التدريب،
                            يقدم المعهد برامج تدريبية متكاملة بنظام التدريب عن بعد المباشر (Live Training)، والتي تتيح
                            للمتدربين الحصول على تجربة تعليمية تفاعلية عالية الجودة دون التقيد بالموقع الجغرافي.
                        </p>
                        <p className="ot-hero-body" style={{ marginTop: 14 }}>
                            يعتمد هذا النظام على تقديم محتوى تدريبي احترافي يتم تنفيذه بواسطة نخبة من المدربين المتخصصين،
                            من خلال جلسات مباشرة تُمكّن المتدربين من التفاعل الفوري، طرح الأسئلة، والمشاركة في المناقشات
                            والتطبيقات العملية، بما يضمن تحقيق أقصى استفادة ممكنة.
                        </p>
                    </div>
                </section>

                {/* ── 💡 لماذا التدريب الأونلاين ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">💡 لماذا <span>التدريب الأونلاين بالمعهد؟</span></h2>
                        <div className="ot-heading-bar" />
                        <p className="ot-body-p">يتميز التدريب الأونلاين لدينا بعدة عناصر تجعله أكثر مرونة وفعالية:</p>
                        <div className="ot-why-grid">
                            {whyItems.map((item, i) => (
                                <div className="ot-why-card" key={i}>
                                    <div className="ot-why-icon">{item.icon}</div>
                                    <p className="ot-why-label">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 🚀 تجربة تدريب متكاملة ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <div className="ot-integrated-box">
                            <p className="ot-integrated-title">🚀 تجربة تدريب متكاملة</p>
                            <p className="ot-integrated-p">
                                لا يقتصر التدريب الأونلاين على مجرد حضور محاضرات، بل هو منظومة تدريبية متكاملة تبدأ من لحظة
                                التسجيل، مرورًا بالتواصل المستمر عبر البريد الإلكتروني وواتساب، وحتى انتهاء البرنامج
                                والحصول على شهادة معتمدة.
                            </p>
                            <p className="ot-integrated-p">ويحرص المعهد على توفير تجربة سلسة للمتدرب من خلال:</p>
                            <ul className="ot-integrated-bullets">
                                {integratedBullets.map((b, i) => (
                                    <li key={i}><span className="ot-int-dot" />{b}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── 🎯 هدفنا ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">🎯 <span>هدفنا</span></h2>
                        <div className="ot-heading-bar" />
                        <p className="ot-body-p">نهدف من خلال منظومة التدريب عن بعد إلى:</p>
                        <div className="ot-goals-grid">
                            {goals.map((g, i) => (
                                <div className="ot-goal-card" key={i}>
                                    <FaCheckCircle size={22} className="ot-goal-check" />
                                    <p className="ot-goal-text">{g}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 💻 آلية تنفيذ التدريب ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">💻 <span>آلية تنفيذ التدريب</span></h2>
                        <div className="ot-heading-bar" />

                        {/* 🖼️ IMAGE 1 – Virtual Meeting Illustration */}
                        <div className="ot-illustration-wrapper">
                            <VirtualMeetingIllustration />
                        </div>

                        <p className="ot-body-p">
                            يتم تنفيذ البرامج التدريبية الأونلاين من خلال جلسات مباشرة (Live Sessions) يقودها مدربون
                            متخصصون، حيث يتم التفاعل مع المتدربين بشكل فوري من خلال الشرح، المناقشات، وورش العمل التطبيقية.
                        </p>
                        <p className="ot-body-p">ويعتمد التدريب على منصة Microsoft Teams، والتي تُعد من أبرز منصات التواصل والتعلم الرقمي، حيث تتيح:</p>
                        <ul className="ot-bullet-list" style={{ marginBottom: 16 }}>
                            {mechanismBullets.map((b, i) => (
                                <li key={i}><span className="ot-bullet-dot" />{b}</li>
                            ))}
                        </ul>
                        <p className="ot-body-p">وتُستخدم هذه المنصة على نطاق واسع لدعم التدريب والتعاون عن بُعد في بيئات العمل الحديثة.</p>
                    </div>
                </section>

                {/* ── ⚙️ البرنامج المستخدم ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">⚙️ البرنامج المستخدم <span>في التدريب</span></h2>
                        <div className="ot-heading-bar" />
                        <p className="ot-body-p">يعتمد المعهد على برنامج Microsoft Teams وذلك لما يوفره من بيئة تعليمية متكاملة تشمل:</p>
                        <div className="ot-platform-box">
                            {/* ✅ REPLACED: Teams SVG icon instead of text "T" */}
                            <div className="ot-platform-logo">
                                <TeamsIcon size={54} />
                            </div>
                            <div>
                                <p className="ot-platform-name">Microsoft Teams</p>
                                <ul className="ot-platform-bullets">
                                    {platformFeatures.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 🪜 خطوات الالتحاق (Infographic) ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">🪜 خطوات <span>الالتحاق والتدريب</span></h2>
                        <div className="ot-heading-bar" />
                        <p className="ot-body-p">تمر عملية التدريب الأونلاين بعدة مراحل منظمة لضمان تجربة تعليمية سلسة:</p>
                        <div className="ot-infographic-wrapper">
                            <img
                                src="/images/Teams.png"
                                alt="خطوات الالتحاق والتدريب عبر Microsoft Teams"
                            />
                        </div>
                    </div>
                </section>

                {/* ── 📌 مميزات التدريب الأونلاين ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">📌 مميزات <span>التدريب الأونلاين بالمعهد</span></h2>
                        <div className="ot-heading-bar" />

                        {/* 🖼️ IMAGE 2 – Features Illustration */}
                        <div className="ot-illustration-wrapper">
                            <OnlineFeaturesIllustration />
                        </div>

                        <div className="ot-features-grid">
                            {features.map((f, i) => (
                                <div className="ot-feature-card" key={i}>
                                    <div className="ot-feature-icon">{f.icon}</div>
                                    <p className="ot-feature-label">{f.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── PROGRAMS ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">أمثلة فعلية على <span>البرامج التدريبية عن بعد</span></h2>
                        <div className="ot-heading-bar" />
                        <div className="ot-programs-list">
                            {programs.map((program, index) => (
                                <div className="ot-program-card" key={index}>
                                    <div className="ot-icon">{program.icon}</div>
                                    <div className="ot-program-content">
                                        <h3 className="ot-program-title"><a href="#">{program.title}</a></h3>
                                        <p className="ot-program-desc">{program.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <div className="ot-cta-banner">
                            <FaShieldAlt size={28} className="ot-cta-icon" />
                            <p className="ot-cta-text">
                                نلتزم بتقديم تجربة تدريبية احترافية تفاعلية تدعم تطوير مهاراتك وتحقيق أهدافك المهنية
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}