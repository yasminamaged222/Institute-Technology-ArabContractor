// ════════════════════════════════════════════════════════════════════════════
// FINANCIAL TAB — تبويب المالية
// ════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useMemo } from 'react';
import logoSrc from "../../../assets/finaaaaallogoara.white.png";
import * as XLSX from 'xlsx';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { rtlExport } from '../helpers';
import { exportExcel, exportPDF, exportWord, withExport } from '../exportHelpers';

// ════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════════════════════════════════════
const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
    green: '#16a34a', greenLight: '#f0fdf4', greenBorder: '#86efac',
    red: '#dc2626', redLight: '#fef2f2',
    purple: '#7c3aed',
    font: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif',
};

const CHART_COLORS = [T.blue, T.orange, T.green, T.purple, '#ec4899', '#06b6d4', '#f59e0b', '#84cc16'];
const ITEMS_PER_PAGE = 15;

// ════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════════════════════════════════
const MOCK_USERS_DATA = [
    { id: 1, firstName: 'أحمد', lastName: 'محمد', username: 'ahmed.m', email: 'ahmed@example.com', enrolledCourses: [{ id: 1, title: 'AutoCAD للمبتدئين', coursePrice: 1500, date: '2025-01-10' }, { id: 2, title: 'Revit Architecture', coursePrice: 2200, date: '2025-02-05' }] },
    { id: 2, firstName: 'سارة', lastName: 'علي', username: 'sara.a', email: 'sara@example.com', enrolledCourses: [{ id: 3, title: 'إدارة المشاريع PMP', coursePrice: 3500, date: '2025-01-20' }] },
    { id: 3, firstName: 'محمود', lastName: 'حسن', username: 'mahmoud.h', email: 'mahmoud@example.com', enrolledCourses: [{ id: 1, title: 'AutoCAD للمبتدئين', coursePrice: 1500, date: '2025-02-01' }, { id: 4, title: 'MS Project', coursePrice: 1800, date: '2025-03-15' }, { id: 5, title: 'تقدير التكاليف', coursePrice: 2000, date: '2025-03-20' }] },
    { id: 4, firstName: 'فاطمة', lastName: 'إبراهيم', username: 'fatma.i', email: 'fatma@example.com', enrolledCourses: [{ id: 2, title: 'Revit Architecture', coursePrice: 2200, date: '2025-01-15' }, { id: 6, title: 'BIM Foundation', coursePrice: 2800, date: '2025-04-01' }] },
    { id: 5, firstName: 'عمر', lastName: 'خالد', username: 'omar.k', email: 'omar@example.com', enrolledCourses: [{ id: 3, title: 'إدارة المشاريع PMP', coursePrice: 3500, date: '2025-02-10' }, { id: 7, title: 'تقنيات البناء', coursePrice: 1200, date: '2025-04-10' }] },
    { id: 6, firstName: 'نور', lastName: 'محمد', username: 'nour.m', email: 'nour@example.com', enrolledCourses: [{ id: 6, title: 'BIM Foundation', coursePrice: 2800, date: '2025-03-01' }] },
    { id: 7, firstName: 'يوسف', lastName: 'أحمد', username: 'yousef.a', email: 'yousef@example.com', enrolledCourses: [{ id: 4, title: 'MS Project', coursePrice: 1800, date: '2025-01-25' }, { id: 5, title: 'تقدير التكاليف', coursePrice: 2000, date: '2025-05-01' }] },
    { id: 8, firstName: 'منى', lastName: 'سالم', username: 'mona.s', email: 'mona@example.com', enrolledCourses: [{ id: 1, title: 'AutoCAD للمبتدئين', coursePrice: 1500, date: '2025-05-15' }] },
    { id: 9, firstName: 'كريم', lastName: 'حسام', username: 'karim.h', email: 'karim@example.com', enrolledCourses: [{ id: 2, title: 'Revit Architecture', coursePrice: 2200, date: '2025-06-01' }, { id: 3, title: 'إدارة المشاريع PMP', coursePrice: 3500, date: '2025-06-10' }, { id: 6, title: 'BIM Foundation', coursePrice: 2800, date: '2025-06-15' }] },
    { id: 10, firstName: 'ريم', lastName: 'عادل', username: 'reem.a', email: 'reem@example.com', enrolledCourses: [{ id: 7, title: 'تقنيات البناء', coursePrice: 1200, date: '2025-06-20' }, { id: 5, title: 'تقدير التكاليف', coursePrice: 2000, date: '2025-07-01' }] },
    { id: 11, firstName: 'حسن', lastName: 'طارق', username: 'hassan.t', email: 'hassan@example.com', enrolledCourses: [{ id: 1, title: 'AutoCAD للمبتدئين', coursePrice: 1500, date: '2025-07-05' }] },
    { id: 12, firstName: 'دينا', lastName: 'وليد', username: 'dina.w', email: 'dina@example.com', enrolledCourses: [{ id: 3, title: 'إدارة المشاريع PMP', coursePrice: 3500, date: '2025-07-15' }, { id: 4, title: 'MS Project', coursePrice: 1800, date: '2025-08-01' }] },
];

const MOCK_MONTHLY_DATA = [
    { month: 'يناير', revenue: 8700, enrollments: 5 },
    { month: 'فبراير', revenue: 11200, enrollments: 6 },
    { month: 'مارس', revenue: 9500, enrollments: 5 },
    { month: 'إبريل', revenue: 14300, enrollments: 7 },
    { month: 'مايو', revenue: 10800, enrollments: 5 },
    { month: 'يونيو', revenue: 18500, enrollments: 8 },
    { month: 'يوليو', revenue: 12100, enrollments: 6 },
    { month: 'أغسطس', revenue: 8900, enrollments: 4 },
];

// ════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════
const FIN_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
    .fin-wrap { direction: rtl; font-family: ${T.font}; }
    .fin-income-hero {
        display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
        background: linear-gradient(135deg, ${T.blueDark} 0%, #073f6e 50%, #0a3a5c 100%);
        border-radius:6px; padding:clamp(20px,3vw,32px) clamp(20px,3.5vw,40px);
        margin-bottom:clamp(18px,2.5vw,24px); position:relative; overflow:hidden;
        box-shadow: 0 8px 32px rgba(4,68,120,0.35); border:1.5px solid rgba(245,124,0,0.3);
    }
    .fin-income-hero::before { content:''; position:absolute; inset:0; background-image: linear-gradient(rgba(245,124,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(245,124,0,0.06) 1px, transparent 1px); background-size:40px 40px; pointer-events:none; }
    .fin-income-hero::after  { content:''; position:absolute; top:0; right:0; width:5px; height:100%; background:linear-gradient(to bottom,${T.orange},${T.orangeLight}); }
    .fin-total-label  { font-size:clamp(.72rem,1.3vw,.82rem); color:rgba(255,255,255,.55); font-family:${T.font}; font-weight:700; margin-bottom:6px; }
    .fin-total-amount { font-size:clamp(2rem,4.5vw,3.2rem); font-weight:900; color:${T.white}; font-family:'Cairo','Courier New',monospace; line-height:1; letter-spacing:-1px; text-shadow:0 2px 12px rgba(245,124,0,0.35); }
    .fin-total-amount .fin-currency { font-size:clamp(.9rem,1.8vw,1.3rem); color:${T.orangeLight}; margin-right:6px; font-weight:700; }
    .fin-total-sub { font-size:clamp(.65rem,1.15vw,.74rem); color:rgba(255,255,255,.4); margin-top:4px; font-family:${T.font}; }
    .fin-income-pills { display:flex; gap:10px; flex-wrap:wrap; position:relative; z-index:1; }
    .fin-ip { display:flex; flex-direction:column; align-items:center; padding:12px 18px; border-radius:6px; min-width:110px; background:rgba(255,255,255,0.07); border:1.5px solid rgba(255,255,255,0.12); backdrop-filter:blur(8px); transition:all .2s; }
    .fin-ip:hover { background:rgba(255,255,255,0.12); border-color:rgba(245,124,0,0.5); transform:translateY(-2px); }
    .fin-ip-val { font-size:clamp(1rem,2.2vw,1.4rem); font-weight:900; font-family:'Cairo',monospace; color:${T.white}; }
    .fin-ip-lbl { font-size:clamp(.58rem,1vw,.65rem); color:rgba(255,255,255,.5); margin-top:3px; font-family:${T.font}; font-weight:700; text-align:center; }
    .fin-mock-banner { display:flex; align-items:center; gap:10px; padding:10px 16px; background:linear-gradient(90deg,rgba(245,124,0,0.1),rgba(245,124,0,0.05)); border:1.5px dashed ${T.orange}; border-radius:6px; margin-bottom:20px; font-family:${T.font}; font-size:.76rem; color:${T.orangeDark}; }
    .fin-mock-dot { width:8px; height:8px; border-radius:50%; background:${T.orange}; animation:fin-pulse 1.5s infinite; flex-shrink:0; }
    @keyframes fin-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
    .fin-kpi-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; margin-bottom:22px; }
    @media(max-width:1100px){ .fin-kpi-grid{ grid-template-columns:repeat(3,1fr); } }
    @media(max-width:680px) { .fin-kpi-grid{ grid-template-columns:repeat(2,1fr); } }
    .fin-kpi { background:${T.white}; border-radius:6px; border:1.5px solid ${T.gray300}; padding:16px; display:flex; flex-direction:column; gap:6px; box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative; overflow:hidden; transition:transform .25s,box-shadow .25s; }
    .fin-kpi::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; }
    .fin-kpi.orange::after { background:${T.orange}; }
    .fin-kpi.blue::after { background:${T.blue}; }
    .fin-kpi.green::after { background:${T.green}; }
    .fin-kpi.red::after { background:${T.red}; }
    .fin-kpi.purple::after { background:${T.purple}; }
    .fin-kpi:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
    .fin-kpi-icon { font-size:1.6rem; line-height:1; }
    .fin-kpi-val { font-size:clamp(1.2rem,2.5vw,1.6rem); font-weight:900; font-family:'Cairo','Courier New',monospace; line-height:1.1; }
    .fin-kpi-lbl { font-size:.68rem; color:${T.gray500}; font-weight:700; font-family:${T.font}; }
    .fin-kpi-sub { font-size:.62rem; color:${T.gray500}; font-family:${T.font}; }
    .fin-charts-grid { display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-bottom:22px; }
    @media(max-width:900px) { .fin-charts-grid{ grid-template-columns:1fr; } }
    .fin-chart-card { background:${T.white}; border-radius:6px; border:1.5px solid ${T.gray300}; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06); }
    .fin-chart-hdr { padding:14px 20px 10px; border-bottom:1px solid ${T.gray100}; display:flex; align-items:center; justify-content:space-between; }
    .fin-chart-title { font-weight:900; font-size:.88rem; color:${T.black}; font-family:${T.font}; }
    .fin-chart-sub { font-size:.65rem; color:${T.gray500}; font-family:${T.font}; }
    .fin-chart-body { padding:14px 8px 8px; }
    .fin-charts-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:22px; }
    @media(max-width:800px) { .fin-charts-row{ grid-template-columns:1fr; } }
    .fin-sc { background:${T.white}; border-radius:6px; border:1.5px solid ${T.gray300}; padding:clamp(14px,2vw,20px) clamp(12px,1.8vw,16px); display:flex; align-items:center; gap:12px; box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative; overflow:hidden; transition:transform .25s,box-shadow .25s; }
    .fin-sc::before { content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform .3s cubic-bezier(.4,0,.2,1); }
    .fin-sc:hover { transform:translateY(-4px); box-shadow:0 10px 28px rgba(0,0,0,0.1); }
    .fin-sc:hover::before { transform:scaleY(1); }
    .fin-sc.blue::before  { background:${T.blue}; }
    .fin-sc.green::before { background:${T.green}; }
    .fin-sc-icon { width:44px; height:44px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
    .fin-sc-body { flex:1; min-width:0; }
    .fin-sc-val { font-size:clamp(1.15rem,2.5vw,1.5rem); font-weight:900; font-family:'Cairo','Courier New',monospace; line-height:1; }
    .fin-sc-lbl { font-size:clamp(.62rem,1.1vw,.7rem); color:${T.gray500}; font-weight:700; margin-top:3px; font-family:${T.font}; }
    .fin-sc-bar { height:3px; border-radius:2px; margin-top:6px; width:60%; opacity:.55; }
    .fin-course-bars { margin-bottom:0; }
    .fin-cb-row { display:flex; align-items:center; gap:12px; margin-bottom:8px; font-family:${T.font}; }
    .fin-cb-name  { font-size:.74rem; font-weight:700; color:${T.black}; min-width:clamp(100px,22vw,180px); max-width:clamp(100px,22vw,180px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right; }
    .fin-cb-track { flex:1; height:8px; background:${T.gray100}; border-radius:4px; overflow:hidden; }
    .fin-cb-fill  { height:100%; border-radius:4px; background:linear-gradient(90deg,${T.orange},${T.orangeLight}); transition:width .8s cubic-bezier(.4,0,.2,1); }
    .fin-cb-fill.blue { background:linear-gradient(90deg,${T.blue},${T.blueLight}); }
    .fin-cb-amt   { font-size:.72rem; font-weight:900; font-family:'Cairo',monospace; color:${T.orange}; min-width:75px; text-align:left; }
    .fin-cb-count { font-size:.62rem; color:${T.gray500}; min-width:48px; text-align:left; }
    .fin-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
    .fin-tbl { width:100%; border-collapse:collapse; min-width:700px; }
    .fin-tbl thead th { background:${T.blueDark}; color:${T.white}; padding:14px 16px; font-family:${T.font}; font-size:.76rem; font-weight:700; text-align:right; white-space:nowrap; border-bottom:3px solid ${T.orange}; }
    .fin-tbl thead th.c  { text-align:center; }
    .fin-tbl thead th.gr { background:${T.green}; border-bottom-color:${T.greenBorder}; }
    .fin-tbl thead th.or { background:${T.orange}; border-bottom-color:rgba(255,255,255,0.3); }
    .fin-tbl tbody tr { border-bottom:1px solid ${T.gray100}; transition:background .12s; }
    .fin-tbl tbody tr:last-child { border-bottom:none; }
    .fin-tbl tbody tr:hover { background:rgba(8,101,168,0.04); }
    .fin-tbl tbody tr:nth-child(even) { background:#fafbfc; }
    .fin-tbl tbody tr:nth-child(even):hover { background:rgba(8,101,168,0.04); }
    .fin-tbl td { padding:11px 16px; font-family:${T.font}; font-size:.76rem; color:${T.gray700}; vertical-align:middle; }
    .fin-tbl td.c { text-align:center; }
    .fin-tbl .fin-xrow td { padding:0!important; border:none; }
    .fin-xin { padding:14px 20px; background:rgba(8,101,168,0.03); border-top:2px solid rgba(8,101,168,0.08); }
    .fin-course-chip { display:inline-flex; align-items:center; gap:7px; background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:4px; padding:7px 12px; margin:4px; font-size:.72rem; font-family:${T.font}; transition:border-color .15s; }
    .fin-course-chip:hover { border-color:${T.orange}; }
    .fin-course-chip-name  { font-weight:700; color:${T.black}; }
    .fin-course-chip-price { font-family:'Cairo',monospace; font-weight:900; color:${T.green}; font-size:.78rem; }
    .fin-user-total { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:3px; background:${T.greenLight}; border:1.5px solid ${T.greenBorder}; font-family:'Cairo',monospace; font-size:.78rem; font-weight:900; color:${T.green}; }
    .fin-pg { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:14px 18px; border-top:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; direction:rtl; }
    .fin-pg-info { font-size:.72rem; color:${T.gray500}; font-weight:700; }
    .fin-pg-info strong { color:${T.black}; }
    .fin-expw { position:relative; }
    .fin-expbtn { display:flex; align-items:center; gap:6px; padding:9px 20px; background:${T.green}; color:${T.white}; border:none; border-radius:6px; font-family:${T.font}; font-size:.8rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all .22s; box-shadow:0 4px 14px rgba(22,163,74,0.3); }
    .fin-expbtn:hover    { background:#15803d; transform:translateY(-2px); box-shadow:0 6px 20px rgba(22,163,74,0.38); }
    .fin-expbtn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .fin-expmenu { position:absolute; top:calc(100% + 6px); left:0; background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:6px; box-shadow:0 10px 32px rgba(0,0,0,0.12); overflow:hidden; z-index:400; min-width:210px; border-top:3px solid ${T.green}; animation:fin-slide .15s ease; }
    @keyframes fin-slide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
    .fin-expitem { display:flex; align-items:center; gap:9px; width:100%; padding:12px 18px; background:none; border:none; border-bottom:1px solid ${T.gray100}; font-family:${T.font}; font-size:.8rem; font-weight:700; color:${T.gray700}; direction:rtl; cursor:pointer; transition:background .12s,color .12s; }
    .fin-expitem:last-child { border-bottom:none; }
    .fin-expitem:hover { background:rgba(22,163,74,0.06); color:${T.green}; }
    .fin-search-input { padding:9px 14px; border-radius:6px; border:1.5px solid ${T.gray300}; background:${T.gray100}; color:${T.black}; font-family:${T.font}; font-size:.8rem; outline:none; direction:rtl; transition:border .18s,box-shadow .18s; min-width:220px; }
    .fin-search-input:focus { border-color:${T.orange}; background:${T.white}; box-shadow:0 0 0 3px rgba(245,124,0,0.1); }
    .fin-search-input::placeholder { color:${T.gray500}; }
    .fin-sort-sel { padding:9px 12px; border-radius:6px; border:1.5px solid ${T.gray300}; background:${T.gray100}; color:${T.black}; font-family:${T.font}; font-size:.78rem; outline:none; cursor:pointer; }
    .fin-toolbar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:18px; background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:6px; padding:12px 18px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    .fin-av    { width:36px; height:36px; border-radius:6px; background:${T.blue}; color:${T.white}; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:.68rem; flex-shrink:0; }
    .fin-uc    { display:flex; align-items:center; gap:9px; }
    .fin-uname { font-weight:700; color:${T.black}; font-size:.8rem; }
    .fin-email { font-size:.68rem; color:${T.gray500}; direction:ltr; display:block; }
    .fin-pill  { display:inline-block; padding:4px 12px; border-radius:3px; font-size:.7rem; font-weight:700; cursor:pointer; border:1.5px solid rgba(8,101,168,0.3); color:${T.blue}; background:rgba(8,101,168,0.07); user-select:none; transition:all .14s; font-family:${T.font}; }
    .fin-pill:hover,.fin-pill.op { background:rgba(8,101,168,0.14); border-color:rgba(8,101,168,0.55); }
    .fin-err   { background:#fef2f2; border:1.5px solid rgba(220,38,38,.3); color:#dc2626; border-radius:6px; padding:10px 14px; margin-bottom:14px; font-size:.76rem; display:flex; align-items:center; gap:9px; border-right:4px solid #dc2626; font-family:${T.font}; }
    .fin-ld    { text-align:center; padding:60px 20px; }
    .fin-sp    { width:40px; height:40px; border:3px solid ${T.gray300}; border-top-color:${T.blue}; border-radius:50%; animation:fin-spin .7s linear infinite; margin:0 auto 16px; }
    @keyframes fin-spin { to{transform:rotate(360deg)} }
    .fin-ld p  { color:${T.gray500}; font-size:.8rem; font-family:${T.font}; }
    .fin-empty { text-align:center; padding:60px 20px; }
    .fin-emi   { font-size:2.4rem; margin-bottom:12px; opacity:.3; }
    .fin-empty p { color:${T.gray300}; font-size:.8rem; font-family:${T.font}; }
    .fin-section-hdr   { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; padding-bottom:14px; border-bottom:3px solid ${T.orange}; }
    .fin-section-tag   { display:inline-block; background:${T.blue}; color:${T.white}; font-family:${T.font}; font-size:11px; font-weight:700; padding:4px 14px; border-radius:3px; margin-bottom:4px; letter-spacing:.04em; }
    .fin-section-title { font-size:clamp(15px,2vw,20px); font-weight:900; color:${T.black}; font-family:${T.font}; }
    .fin-section-title span { color:${T.orange}; }
    .fin-card { background:${T.white}; border-radius:6px; border:1.5px solid ${T.gray300}; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative; }
    .fin-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to left,${T.orange},${T.blue}); z-index:2; }
    .recharts-tooltip-wrapper { font-family:${T.font}!important; direction:rtl; }
    @media(max-width:700px){ .fin-toolbar{ flex-direction:column; align-items:stretch; } .fin-expw{ align-self:flex-start; } }
`;

function injectFinStyles() {
    if (document.getElementById('fin-styles-v2')) return;
    const el = document.createElement('style');
    el.id = 'fin-styles-v2';
    el.textContent = FIN_STYLES;
    document.head.appendChild(el);
}

// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════
function fmtMoney(n) {
    if (n == null || isNaN(Number(n))) return '0';
    return Number(n).toLocaleString('ar-EG');
}

// ════════════════════════════════════════════════════════════════════════════
// DATA BUILDER
// ════════════════════════════════════════════════════════════════════════════
function formatEnrolledAt(raw) {
    if (!raw) return null;
    try {
        const d = new Date(raw);
        return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return raw; }
}

function buildFinancialRows(usersData, coursesData) {
    const costByCourse = {};
    (coursesData || []).forEach(c => {
        const price = Number(c.cost ?? c.price ?? c.Price ?? c.Cost ?? 0);
        if (c.id != null && price > 0) costByCourse[Number(c.id)] = price;
    });
    return usersData
        .filter(u => u.enrolledCourses && u.enrolledCourses.length > 0)
        .map(u => {
            const courses = u.enrolledCourses.map(c => {
                let price = Number(c.coursePrice ?? c.CoursePrice ?? c.course_price ?? c.price ?? c.Price ?? 0);
                if (price === 0 && c.id != null && costByCourse[Number(c.id)] != null) price = costByCourse[Number(c.id)];
                const rawDate = c.enrolledAt ?? c.date ?? c.enrollDate ?? null;
                return { title: c.title, date: formatEnrolledAt(rawDate), rawDate, price, enrollmentId: c.enrollmentId ?? c.id ?? null, attended: c.attended ?? null };
            });
            const totalPaid = courses.reduce((s, c) => s + c.price, 0);
            return { id: u.id, firstName: u.firstName, lastName: u.lastName, username: u.username, email: u.email, courses, totalPaid };
        });
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORT ROW BUILDER — produces headers + rows for shared exportHelpers
// ════════════════════════════════════════════════════════════════════════════
function buildFinancialExportRows(rows, grandTotal) {
    const headers = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'سعر الدورة (EGP)', 'إجمالي المستخدم (EGP)'];
    const dataRows = [];
    let n = 1;
    rows.forEach(r => {
        r.courses.forEach((c, i) => {
            dataRows.push(i === 0
                ? [n++, `${r.firstName} ${r.lastName}`.trim() || r.username, r.email, c.title, c.price, r.totalPaid]
                : ['', '', '', c.title, c.price, '']);
        });
    });
    // Grand total footer row
    dataRows.push(['', '', '', '', 'الإجمالي الكلي للمعهد', grandTotal]);
    return { headers, rows: dataRows };
}

// ════════════════════════════════════════════════════════════════════════════
// CHART TOOLTIPS
// ════════════════════════════════════════════════════════════════════════════
const CustomTooltip = ({ active, payload, label, suffix = 'EGP' }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: T.white, border: `1.5px solid ${T.gray300}`, borderRadius: 6, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontFamily: T.font, direction: 'rtl', minWidth: 140 }}>
            <div style={{ fontWeight: 900, fontSize: '.78rem', color: T.black, marginBottom: 6 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ fontSize: '.74rem', color: p.color, fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                    {fmtMoney(p.value)} {suffix}
                </div>
            ))}
        </div>
    );
};

const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div style={{ background: T.white, border: `1.5px solid ${T.gray300}`, borderRadius: 6, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontFamily: T.font, direction: 'rtl' }}>
            <div style={{ fontWeight: 900, fontSize: '.76rem', color: T.black, marginBottom: 4 }}>{d.name}</div>
            <div style={{ fontSize: '.74rem', color: d.payload.fill, fontWeight: 700 }}>{fmtMoney(d.value)} EGP</div>
            <div style={{ fontSize: '.65rem', color: T.gray500 }}>{d.payload.percent}% من الإجمالي</div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// PAGINATION
// ════════════════════════════════════════════════════════════════════════════
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    const buildPages = () => {
        const pages = [], delta = 2;
        for (let i = 1; i <= totalPages; i++) { if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) pages.push(i); }
        const result = []; let prev = null;
        for (const p of pages) { if (prev !== null && p - prev > 1) result.push('...'); result.push(p); prev = p; }
        return result;
    };
    const btn = (label, onClick, isActive, isDisabled) => (
        <button key={label + Math.random()} onClick={onClick} disabled={isDisabled}
            style={{ minWidth: 34, height: 34, padding: '0 8px', borderRadius: 4, border: isActive ? `2px solid ${T.blue}` : `1.5px solid ${T.gray300}`, background: isActive ? T.blue : isDisabled ? T.gray100 : T.white, color: isActive ? T.white : isDisabled ? T.gray300 : T.gray700, fontFamily: T.font, fontSize: '.78rem', fontWeight: 700, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1, transition: 'all .14s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {label}
        </button>
    );
    return (
        <div className="fin-pg">
            <span className="fin-pg-info">عرض <strong>{start}</strong> – <strong>{end}</strong> من <strong style={{ color: T.blue }}>{totalItems}</strong> مستخدم</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {btn('«', () => onPageChange(1), false, currentPage === 1)}
                {btn('‹', () => onPageChange(currentPage - 1), false, currentPage === 1)}
                {buildPages().map((p, i) => p === '...' ? <span key={`el-${i}`} style={{ padding: '0 4px', color: T.gray300, fontSize: '.78rem' }}>…</span> : btn(p, () => onPageChange(p), p === currentPage, false))}
                {btn('›', () => onPageChange(currentPage + 1), false, currentPage === totalPages)}
                {btn('»', () => onPageChange(totalPages), false, currentPage === totalPages)}
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const FinancialTab = ({ usersData = [], coursesData = [], refunds = [], setExporting: setParentExporting, setExportError: setParentExportError }) => {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('total_desc');
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [exportError, setExportError] = useState(null);
    const exportRef = useRef(null);

    const isMockData = usersData.length === 0 && coursesData.length === 0;
    const effectiveUsers = isMockData ? MOCK_USERS_DATA : usersData;

    useEffect(() => { injectFinStyles(); }, []);

    useEffect(() => {
        const h = e => { if (exportRef.current && !exportRef.current.contains(e.target)) setMenuOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        if (effectiveUsers.length > 0) { setLoading(false); return; }
        const t = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(t);
    }, [effectiveUsers]);

    const allRows = useMemo(() => buildFinancialRows(effectiveUsers, coursesData), [effectiveUsers, coursesData]);

    const grandTotal = allRows.reduce((s, r) => s + r.totalPaid, 0);
    const totalEnrollments = allRows.reduce((s, r) => s + r.courses.length, 0);
    const avgPerUser = allRows.length > 0 ? Math.round(grandTotal / allRows.length) : 0;
    const maxPayer = allRows.length > 0 ? allRows.reduce((a, b) => a.totalPaid > b.totalPaid ? a : b) : null;

    const totalRefunds = refunds.reduce((sum, r) => (r.status === 'Approved' || r.status === 'Sent') ? sum + (r.amount || 0) : sum, 0);
    const netRevenue = grandTotal - totalRefunds;

    const courseRevenue = useMemo(() => {
        const map = {};
        allRows.forEach(r => r.courses.forEach(c => {
            if (!map[c.title]) map[c.title] = { title: c.title, total: 0, count: 0 };
            map[c.title].total += c.price; map[c.title].count += 1;
        }));
        return Object.values(map).sort((a, b) => b.total - a.total);
    }, [allRows]);
    const maxCourseRev = courseRevenue[0]?.total || 1;

    const pieData = useMemo(() => {
        const top5 = courseRevenue.slice(0, 5);
        const otherTotal = courseRevenue.slice(5).reduce((s, c) => s + c.total, 0);
        const all = otherTotal > 0 ? [...top5, { title: 'أخرى', total: otherTotal, count: 0 }] : top5;
        return all.map(c => ({ name: c.title, value: c.total, fill: CHART_COLORS[all.indexOf(c) % CHART_COLORS.length], percent: grandTotal > 0 ? Math.round(c.total / grandTotal * 100) : 0 }));
    }, [courseRevenue, grandTotal]);

    const monthlyData = isMockData ? MOCK_MONTHLY_DATA : (() => {
        const map = {};
        const monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        allRows.forEach(r => r.courses.forEach(c => {
            if (!c.rawDate) return;
            const d = new Date(c.rawDate);
            if (isNaN(d.getTime())) return;
            const key = monthNames[d.getMonth()];
            if (!map[key]) map[key] = { month: key, revenue: 0, enrollments: 0, order: d.getMonth() };
            map[key].revenue += c.price; map[key].enrollments += 1;
        }));
        return Object.values(map).sort((a, b) => a.order - b.order);
    })();

    const q = search.toLowerCase();
    const filtered = allRows.filter(r =>
        `${r.firstName} ${r.lastName} ${r.username} ${r.email}`.toLowerCase().includes(q) ||
        r.courses.some(c => c.title.toLowerCase().includes(q))
    );
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'total_desc') return b.totalPaid - a.totalPaid;
        if (sortBy === 'total_asc') return a.totalPaid - b.totalPaid;
        if (sortBy === 'courses_desc') return b.courses.length - a.courses.length;
        if (sortBy === 'name') return `${a.firstName}${a.lastName}`.localeCompare(`${b.firstName}${b.lastName}`, 'ar');
        return 0;
    });
    const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // ── Export wiring using shared exportHelpers ──────────────────────────
    // Use parent's state if provided (overlay spinner), else local state
    const _setExp = setParentExporting ?? setExporting;
    const _setErr = setParentExportError ?? setExportError;

    const wrap = withExport(_setExp, _setErr, () => setMenuOpen(false));

    const doExcel = wrap(async () => {
        const { headers, rows: r } = buildFinancialExportRows(sorted, grandTotal);
        const { headers: rh, rows: rr } = rtlExport(headers, r);
        await exportExcel('التقرير-المالي.xlsx', 'التقرير المالي — إيرادات المعهد', rh, rr, logoSrc);
    });

    const doPDF = wrap(async () => {
        const { headers, rows: r } = buildFinancialExportRows(sorted, grandTotal);
        const { headers: rh, rows: rr } = rtlExport(headers, r);
        await exportPDF('التقرير-المالي.pdf', 'التقرير المالي — إيرادات المعهد', rh, rr, 'ICEMT', logoSrc);
    });

    const doWord = wrap(async () => {
        const { headers, rows: r } = buildFinancialExportRows(sorted, grandTotal);
        const { headers: rh, rows: rr } = rtlExport(headers, r);
        await exportWord('التقرير-المالي.docx', 'التقرير المالي — إيرادات المعهد', 'ICEMT', rh, rr, logoSrc);
    });

    const kpis = [
        { icon: '💰', val: `${fmtMoney(grandTotal)} EGP`, lbl: 'إجمالي الإيرادات', sub: 'قبل المرتجعات', cls: 'orange', color: T.orange },
        { icon: '🔻', val: `${fmtMoney(totalRefunds)} EGP`, lbl: 'إجمالي المرتجعات', sub: refunds.length + ' طلب مرتجع', cls: 'red', color: T.red },
        { icon: '✅', val: `${fmtMoney(netRevenue)} EGP`, lbl: 'صافي الإيرادات', sub: 'بعد خصم المرتجعات', cls: 'green', color: T.green },
        { icon: '📚', val: totalEnrollments, lbl: 'إجمالي الاشتراكات', sub: `عبر ${courseRevenue.length} دورة`, cls: 'blue', color: T.blue },
        { icon: '👥', val: allRows.length, lbl: 'العملاء الدافعون', sub: `متوسط ${fmtMoney(avgPerUser)} EGP`, cls: 'purple', color: T.purple },
    ];

    // ════════════════════════════════════════════════════════════════════════
    // RENDER
    // ════════════════════════════════════════════════════════════════════════
    return (
        <div className="fin-wrap">
            <div className="fin-section-hdr">
                <div>
                    <div className="fin-section-tag">التقارير المالية</div>
                    <div className="fin-section-title">إيرادات <span>المعهد</span></div>
                </div>
            </div>

            {isMockData && (
                <div className="fin-mock-banner">
                    <div className="fin-mock-dot" />
                    <strong>بيانات تجريبية</strong> — يتم عرض بيانات وهمية ريثما يجهز API الـ Backend.
                </div>
            )}

            {!loading && (
                <div className="fin-income-hero">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="fin-total-label">💰 إجمالي الإيرادات الكلية</div>
                        <div className="fin-total-amount"><span className="fin-currency">EGP</span>{fmtMoney(grandTotal)}</div>
                        <div className="fin-total-sub">من {allRows.length} مستخدم مسجّل في {totalEnrollments} تسجيل</div>
                    </div>
                    <div className="fin-income-pills">
                        {[
                            { label: 'المستخدمون الدافعون', val: allRows.length, icon: '👤' },
                            { label: 'إجمالي التسجيلات', val: totalEnrollments, icon: '📚' },
                            { label: 'متوسط لكل مستخدم', val: `${fmtMoney(avgPerUser)} EGP`, icon: '📊' },
                            { label: 'صافي الإيرادات', val: `${fmtMoney(netRevenue)} EGP`, icon: '✅' },
                            ...(maxPayer ? [{ label: 'أعلى دافع', val: `${maxPayer.firstName} ${maxPayer.lastName}`.trim() || maxPayer.username, icon: '🏆' }] : []),
                        ].map(p => (
                            <div className="fin-ip" key={p.label}>
                                <div className="fin-ip-val">{p.icon} {p.val}</div>
                                <div className="fin-ip-lbl">{p.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && (
                <div className="fin-kpi-grid">
                    {kpis.map(k => (
                        <div key={k.lbl} className={`fin-kpi ${k.cls}`}>
                            <div className="fin-kpi-icon">{k.icon}</div>
                            <div className="fin-kpi-val" style={{ color: k.color }}>{k.val}</div>
                            <div className="fin-kpi-lbl">{k.lbl}</div>
                            <div className="fin-kpi-sub">{k.sub}</div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && monthlyData.length > 0 && (
                <div className="fin-charts-grid">
                    <div className="fin-chart-card">
                        <div className="fin-chart-hdr">
                            <div><div className="fin-chart-title">📈 الإيرادات الشهرية</div><div className="fin-chart-sub">تطور الإيرادات عبر الأشهر</div></div>
                        </div>
                        <div className="fin-chart-body">
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.gray100} />
                                    <XAxis dataKey="month" tick={{ fontFamily: T.font, fontSize: 11, fill: T.gray500 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontFamily: 'Cairo', fontSize: 10, fill: T.gray500 }} axisLine={false} tickLine={false} tickFormatter={v => fmtMoney(v)} width={65} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="revenue" stroke={T.blue} strokeWidth={2.5} dot={{ fill: T.blue, r: 4, strokeWidth: 2, stroke: T.white }} activeDot={{ r: 6, fill: T.orange }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="fin-chart-card">
                        <div className="fin-chart-hdr">
                            <div><div className="fin-chart-title">🥧 توزيع إيرادات الدورات</div><div className="fin-chart-sub">نسبة كل دورة من الإجمالي</div></div>
                        </div>
                        <div className="fin-chart-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />)}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: '0 10px 10px' }}>
                                {pieData.map(d => (
                                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.62rem', fontFamily: T.font, color: T.gray700 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: 2, background: d.fill, display: 'inline-block', flexShrink: 0 }} />
                                        {d.name.slice(0, 18)}{d.name.length > 18 ? '…' : ''} ({d.percent}%)
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <div className="fin-charts-row">
                    <div className="fin-chart-card">
                        <div className="fin-chart-hdr">
                            <div><div className="fin-chart-title">📊 الاشتراكات الشهرية</div><div className="fin-chart-sub">عدد التسجيلات لكل شهر</div></div>
                        </div>
                        <div className="fin-chart-body">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.gray100} />
                                    <XAxis dataKey="month" tick={{ fontFamily: T.font, fontSize: 11, fill: T.gray500 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontFamily: 'Cairo', fontSize: 10, fill: T.gray500 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip suffix="تسجيل" />} />
                                    <Bar dataKey="enrollments" fill={T.orange} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="fin-chart-card">
                        <div className="fin-chart-hdr">
                            <div><div className="fin-chart-title">📉 الإيرادات vs المرتجعات</div><div className="fin-chart-sub">مقارنة الصافي بالمرتجعات</div></div>
                        </div>
                        <div className="fin-chart-body">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={[{ name: 'الإيرادات الكلية', value: grandTotal }, { name: 'المرتجعات', value: totalRefunds }, { name: 'الصافي', value: netRevenue }]} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.gray100} />
                                    <XAxis dataKey="name" tick={{ fontFamily: T.font, fontSize: 10, fill: T.gray500 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontFamily: 'Cairo', fontSize: 10, fill: T.gray500 }} axisLine={false} tickLine={false} tickFormatter={v => fmtMoney(v)} width={65} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        <Cell fill={T.blue} /><Cell fill={T.red} /><Cell fill={T.green} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {!loading && courseRevenue.length > 0 && (
                <div className="fin-card" style={{ marginBottom: 22 }}>
                    <div style={{ padding: '16px 20px 4px', borderBottom: `1.5px solid ${T.gray100}` }}>
                        <span style={{ fontWeight: 900, fontSize: '.9rem', color: T.black, fontFamily: T.font }}>📊 إيرادات الدورات</span>
                        <span style={{ fontSize: '.68rem', color: T.gray500, marginRight: 10, fontFamily: T.font }}>أعلى {Math.min(courseRevenue.length, 8)} دورات حسب الإيرادات</span>
                    </div>
                    <div className="fin-course-bars" style={{ padding: '16px 20px' }}>
                        {courseRevenue.slice(0, 8).map((c, i) => (
                            <div className="fin-cb-row" key={c.title}>
                                <div className="fin-cb-name" title={c.title}>{c.title}</div>
                                <div className="fin-cb-track"><div className={`fin-cb-fill${i % 2 === 0 ? '' : ' blue'}`} style={{ width: `${Math.round(c.total / maxCourseRev * 100)}%` }} /></div>
                                <div className="fin-cb-amt">{fmtMoney(c.total)} EGP</div>
                                <div className="fin-cb-count">{c.count} مسجّل</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Toolbar with Export ── */}
            <div className="fin-toolbar">
                <input className="fin-search-input" type="text" placeholder="ابحث باسم المستخدم، البريد، أو الدورة..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                {search && <button style={{ padding: '7px 12px', borderRadius: 4, border: `1.5px solid ${T.gray300}`, background: T.gray100, cursor: 'pointer', color: T.gray500, fontFamily: T.font, fontSize: '.72rem', fontWeight: 700 }} onClick={() => { setSearch(''); setPage(1); }}>✕ مسح</button>}
                <select className="fin-sort-sel" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                    <option value="total_desc">ترتيب: الأعلى دفعًا</option>
                    <option value="total_asc">ترتيب: الأقل دفعًا</option>
                    <option value="courses_desc">ترتيب: الأكثر دورات</option>
                    <option value="name">ترتيب: الاسم أبجديًا</option>
                </select>

                {/* Export button — same pattern as all other tabs */}
                <div className="fin-expw" ref={exportRef} style={{ marginRight: 'auto' }}>
                    <button className="fin-expbtn" disabled={exporting} onClick={() => setMenuOpen(p => !p)}>
                        {exporting ? '⏳ جاري التصدير...' : '⬇ تصدير التقرير المالي ▾'}
                    </button>
                    {menuOpen && (
                        <div className="fin-expmenu">
                            <button className="fin-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button>
                            <button className="fin-expitem" onClick={doPDF}>📄 PDF</button>
                            <button className="fin-expitem" onClick={doWord}>📝 Word (.docx)</button>
                        </div>
                    )}
                </div>
            </div>

            {exportError && (
                <div className="fin-err">⚠️ {exportError}
                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setExportError(null)}>✕</button>
                </div>
            )}

            {/* ── Table ── */}
            <div className="fin-card">
                {loading ? (
                    <div className="fin-ld"><div className="fin-sp" /><p>جاري تحميل البيانات المالية...</p></div>
                ) : sorted.length === 0 ? (
                    <div className="fin-empty"><div className="fin-emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                ) : (
                    <>
                        <div className="fin-table-wrap">
                            <table className="fin-tbl">
                                <thead>
                                    <tr>
                                        <th className="c" style={{ width: 40 }}>#</th>
                                        <th>المستخدم</th>
                                        <th>البريد الإلكتروني</th>
                                        <th className="c">عدد الدورات</th>
                                        <th className="gr c">إجمالي المدفوع (EGP)</th>
                                        <th className="or c">تفاصيل الدورات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map((r, idx) => {
                                        const rowNum = (page - 1) * ITEMS_PER_PAGE + idx + 1;
                                        const isOpen = expanded === r.id;
                                        return (
                                            <React.Fragment key={r.id}>
                                                <tr style={{ background: isOpen ? 'rgba(8,101,168,0.05)' : undefined }}>
                                                    <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                    <td>
                                                        <div className="fin-uc">
                                                            <div className="fin-av">{(r.firstName || r.username || '?')[0]}{(r.lastName || '')[0]}</div>
                                                            <div className="fin-uname">{r.firstName || r.username} {r.lastName}</div>
                                                        </div>
                                                    </td>
                                                    <td><span className="fin-email">{r.email}</span></td>
                                                    <td className="c">
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 28, borderRadius: 4, background: 'rgba(8,101,168,0.08)', border: `1.5px solid rgba(8,101,168,0.25)`, color: T.blue, fontSize: '.76rem', fontWeight: 900, fontFamily: 'Cairo', padding: '0 6px' }}>{r.courses.length}</span>
                                                    </td>
                                                    <td className="c"><span className="fin-user-total">{fmtMoney(r.totalPaid)} EGP</span></td>
                                                    <td className="c">
                                                        <span className={`fin-pill${isOpen ? ' op' : ''}`} onClick={() => setExpanded(isOpen ? null : r.id)}>
                                                            {isOpen ? '▲ إخفاء' : '▼ عرض الدورات'}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {isOpen && (
                                                    <tr className="fin-xrow">
                                                        <td colSpan={6}>
                                                            <div className="fin-xin">
                                                                <div style={{ marginBottom: 10 }}>
                                                                    <span style={{ fontSize: '.72rem', fontWeight: 900, color: T.blue, fontFamily: T.font }}>📚 دورات {r.firstName || r.username} ({r.courses.length} دورة)</span>
                                                                </div>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                                    {r.courses.map((c, ci) => (
                                                                        <div className="fin-course-chip" key={ci}>
                                                                            <span className="fin-course-chip-name">📖 {c.title}</span>
                                                                            <span style={{ width: 1, height: 14, background: T.gray300, display: 'inline-block', margin: '0 4px' }} />
                                                                            <span className="fin-course-chip-price">{fmtMoney(c.price)} EGP</span>
                                                                            {c.date && <span style={{ fontSize: '.62rem', color: T.gray500, fontFamily: T.font }}>📅 {c.date}</span>}
                                                                            {c.attended != null && (
                                                                                <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: c.attended ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)', color: c.attended ? T.green : T.red, border: `1px solid ${c.attended ? T.greenBorder : 'rgba(220,38,38,0.3)'}`, fontFamily: T.font }}>
                                                                                    {c.attended ? '✓ حضر' : '✗ غائب'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <span style={{ fontSize: '.74rem', fontWeight: 700, color: T.gray700, fontFamily: T.font }}>المجموع:</span>
                                                                    <span className="fin-user-total" style={{ fontSize: '.82rem' }}>{fmtMoney(r.totalPaid)} EGP</span>
                                                                    <span style={{ fontSize: '.65rem', color: T.gray500, fontFamily: T.font }}>({r.courses.length} دورة × متوسط {fmtMoney(r.courses.length > 0 ? Math.round(r.totalPaid / r.courses.length) : 0)} EGP)</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr style={{ background: T.blueDark }}>
                                        <td colSpan={4} style={{ padding: '12px 16px', fontWeight: 900, color: T.white, fontSize: '.82rem', fontFamily: T.font }}>
                                            💰 الإجمالي الكلي لإيرادات المعهد
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <span style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: '1rem', color: T.orangeLight }}>{fmtMoney(grandTotal)} EGP</span>
                                        </td>
                                        <td />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <Pagination currentPage={page} totalItems={sorted.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={p => { setPage(p); setExpanded(null); }} />
                    </>
                )}
            </div>
        </div>
    );
};

export default FinancialTab;