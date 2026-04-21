// ════════════════════════════════════════════════════════════════════════════
// FINANCIAL TAB — تبويب المالية
// ════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
    green: '#16a34a', greenLight: '#f0fdf4', greenBorder: '#86efac',
    font: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif',
};

const ITEMS_PER_PAGE = 15;

const FIN_STYLES = `
    .fin-income-hero {
        display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
        background: linear-gradient(135deg, ${T.blueDark} 0%, #073f6e 100%);
        border-radius:3px; padding:clamp(20px,3vw,32px) clamp(20px,3.5vw,40px);
        margin-bottom:clamp(18px,2.5vw,28px); position:relative; overflow:hidden;
        box-shadow: 0 8px 32px rgba(4,68,120,0.3);
        border:1.5px solid rgba(245,124,0,0.3);
    }
    .fin-income-hero::before {
        content:''; position:absolute; inset:0;
        background-image:
            linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px);
        background-size:36px 36px; pointer-events:none;
    }
    .fin-income-hero::after {
        content:''; position:absolute; top:0; right:0; width:5px; height:100%;
        background:linear-gradient(to bottom,${T.orange},${T.orangeLight});
    }
    .fin-total-label { font-size:clamp(.72rem,1.3vw,.82rem); color:rgba(255,255,255,.55); font-family:${T.font}; font-weight:700; margin-bottom:6px; }
    .fin-total-amount {
        font-size:clamp(2rem,4.5vw,3.2rem); font-weight:900; color:${T.white};
        font-family:'Courier New', monospace; line-height:1; letter-spacing:-1px;
        text-shadow: 0 2px 12px rgba(245,124,0,0.35);
    }
    .fin-total-amount .fin-currency { font-size:clamp(.9rem,1.8vw,1.3rem); color:${T.orangeLight}; margin-right:6px; font-weight:700; }
    .fin-total-sub { font-size:clamp(.65rem,1.15vw,.74rem); color:rgba(255,255,255,.4); margin-top:4px; font-family:${T.font}; }
    .fin-income-pills { display:flex; gap:10px; flex-wrap:wrap; position:relative; z-index:1; }
    .fin-ip {
        display:flex; flex-direction:column; align-items:center;
        padding:12px 18px; border-radius:3px; min-width:110px;
        background:rgba(255,255,255,0.07); border:1.5px solid rgba(255,255,255,0.12);
        backdrop-filter:blur(4px); transition:all .2s;
    }
    .fin-ip:hover { background:rgba(255,255,255,0.12); border-color:rgba(245,124,0,0.4); }
    .fin-ip-val { font-size:clamp(1.1rem,2.2vw,1.5rem); font-weight:900; font-family:'Courier New',monospace; color:${T.white}; }
    .fin-ip-lbl { font-size:clamp(.58rem,1vw,.65rem); color:rgba(255,255,255,.5); margin-top:3px; font-family:${T.font}; font-weight:700; }
    .fin-stats-row {
        display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(10px,1.5vw,16px);
        margin-bottom:clamp(16px,2.5vw,26px);
    }
    @media(max-width:900px){ .fin-stats-row{ grid-template-columns:repeat(2,1fr); } }
    @media(max-width:480px){ .fin-stats-row{ grid-template-columns:1fr 1fr; } }
    .fin-sc {
        background:${T.white}; border-radius:3px; border:1.5px solid ${T.gray300};
        padding:clamp(14px,2vw,20px) clamp(12px,1.8vw,16px);
        display:flex; align-items:center; gap:12px;
        box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative; overflow:hidden;
        transition:transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s;
    }
    .fin-sc::before { content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform .3s cubic-bezier(.4,0,.2,1); }
    .fin-sc:hover { transform:translateY(-4px); box-shadow:0 10px 28px rgba(0,0,0,0.1); }
    .fin-sc:hover::before { transform:scaleY(1); }
    .fin-sc.blue::before { background:${T.blue}; }
    .fin-sc.green::before { background:${T.green}; }
    .fin-sc-icon { width:44px; height:44px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
    .fin-sc-body { flex:1; min-width:0; }
    .fin-sc-val { font-size:clamp(1.15rem,2.5vw,1.5rem); font-weight:900; font-family:'Courier New',monospace; line-height:1; }
    .fin-sc-lbl { font-size:clamp(.62rem,1.1vw,.7rem); color:${T.gray500}; font-weight:700; margin-top:3px; font-family:${T.font}; }
    .fin-sc-bar { height:3px; border-radius:2px; margin-top:6px; width:60%; opacity:.55; }
    .fin-course-bars { margin-bottom:clamp(18px,3vw,28px); }
    .fin-cb-row { display:flex; align-items:center; gap:12px; margin-bottom:8px; font-family:${T.font}; }
    .fin-cb-name { font-size:.76rem; font-weight:700; color:${T.black}; min-width:clamp(120px,25vw,200px); max-width:clamp(120px,25vw,200px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right; }
    .fin-cb-track { flex:1; height:8px; background:${T.gray100}; border-radius:4px; overflow:hidden; }
    .fin-cb-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,${T.orange},${T.orangeLight}); transition:width .6s cubic-bezier(.4,0,.2,1); }
    .fin-cb-fill.blue { background:linear-gradient(90deg,${T.blue},${T.blueLight}); }
    .fin-cb-amt { font-size:.74rem; font-weight:900; font-family:'Courier New',monospace; color:${T.orange}; min-width:80px; text-align:left; }
    .fin-cb-count { font-size:.64rem; color:${T.gray500}; min-width:50px; text-align:left; }
    .fin-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
    .fin-tbl { width:100%; border-collapse:collapse; min-width:700px; }
    .fin-tbl thead th {
        background:${T.blueDark}; color:${T.white}; padding:14px 16px;
        font-family:${T.font}; font-size:.76rem; font-weight:700;
        text-align:right; white-space:nowrap; border-bottom:3px solid ${T.orange};
    }
    .fin-tbl thead th.c { text-align:center; }
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
    .fin-course-chip {
        display:inline-flex; align-items:center; gap:7px;
        background:${T.white}; border:1.5px solid ${T.gray300};
        border-radius:3px; padding:7px 12px; margin:4px;
        font-size:.72rem; font-family:${T.font}; transition:border-color .15s;
    }
    .fin-course-chip:hover { border-color:${T.orange}; }
    .fin-course-chip-name { font-weight:700; color:${T.black}; }
    .fin-course-chip-price { font-family:'Courier New',monospace; font-weight:900; color:${T.green}; font-size:.78rem; }
    .fin-user-total { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:2px; background:${T.greenLight}; border:1.5px solid ${T.greenBorder}; font-family:'Courier New',monospace; font-size:.78rem; font-weight:900; color:${T.green}; }
    .fin-pg { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:14px 18px; border-top:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; direction:rtl; }
    .fin-pg-info { font-size:.72rem; color:${T.gray500}; font-weight:700; }
    .fin-pg-info strong { color:${T.black}; }
    .fin-expw { position:relative; }
    .fin-expbtn {
        display:flex; align-items:center; gap:6px;
        padding:9px 20px; background:${T.orange}; color:${T.white};
        border:none; border-radius:3px; font-family:${T.font};
        font-size:.8rem; font-weight:700; cursor:pointer; white-space:nowrap;
        transition:all .22s cubic-bezier(.4,0,.2,1); box-shadow:0 4px 14px rgba(245,124,0,0.3);
    }
    .fin-expbtn:hover { background:${T.orangeDark}; transform:translateY(-2px); box-shadow:0 6px 20px rgba(245,124,0,0.38); }
    .fin-expbtn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .fin-expmenu {
        position:absolute; top:calc(100% + 6px); left:0;
        background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:3px;
        box-shadow:0 10px 32px rgba(0,0,0,0.12); overflow:hidden; z-index:400;
        min-width:190px; border-top:3px solid ${T.orange};
        animation: adm-slideIn .15s ease;
    }
    .fin-expitem { display:flex; align-items:center; gap:9px; width:100%; padding:12px 18px; background:none; border:none; border-bottom:1px solid ${T.gray100}; font-family:${T.font}; font-size:.8rem; font-weight:700; color:${T.gray700}; direction:rtl; cursor:pointer; transition:background .12s,color .12s; }
    .fin-expitem:last-child { border-bottom:none; }
    .fin-expitem:hover { background:rgba(245,124,0,0.06); color:${T.orange}; }
    .fin-search-input { padding:9px 14px; border-radius:3px; border:1.5px solid ${T.gray300}; background:${T.gray100}; color:${T.black}; font-family:${T.font}; font-size:.8rem; outline:none; direction:rtl; transition:border .18s, box-shadow .18s; min-width:220px; }
    .fin-search-input:focus { border-color:${T.orange}; background:${T.white}; box-shadow:0 0 0 3px rgba(245,124,0,0.1); }
    .fin-search-input::placeholder { color:${T.gray500}; }
    .fin-sort-sel { padding:9px 12px; border-radius:3px; border:1.5px solid ${T.gray300}; background:${T.gray100}; color:${T.black}; font-family:${T.font}; font-size:.78rem; outline:none; cursor:pointer; }
    .fin-toolbar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:18px; background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:3px; padding:12px 18px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    .fin-av { width:36px; height:36px; border-radius:3px; background:${T.blue}; color:${T.white}; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:.68rem; flex-shrink:0; }
    .fin-uc { display:flex; align-items:center; gap:9px; }
    .fin-uname { font-weight:700; color:${T.black}; font-size:.8rem; }
    .fin-email { font-size:.68rem; color:${T.gray500}; direction:ltr; display:block; }
    .fin-pill { display:inline-block; padding:4px 12px; border-radius:2px; font-size:.7rem; font-weight:700; cursor:pointer; border:1.5px solid rgba(8,101,168,0.3); color:${T.blue}; background:rgba(8,101,168,0.07); user-select:none; transition:all .14s; font-family:${T.font}; }
    .fin-pill:hover,.fin-pill.op { background:rgba(8,101,168,0.14); border-color:rgba(8,101,168,0.55); }
    .fin-err { background:#fef2f2; border:1.5px solid rgba(220,38,38,.3); color:#dc2626; border-radius:3px; padding:10px 14px; margin-bottom:14px; font-size:.76rem; display:flex; align-items:center; gap:9px; border-right:4px solid #dc2626; font-family:${T.font}; }
    .fin-ld { text-align:center; padding:60px 20px; }
    .fin-sp { width:40px; height:40px; border:3px solid ${T.gray300}; border-top-color:${T.blue}; border-radius:50%; animation:adm-spin .7s linear infinite; margin:0 auto 16px; }
    .fin-ld p { color:${T.gray500}; font-size:.8rem; font-family:${T.font}; }
    .fin-empty { text-align:center; padding:60px 20px; }
    .fin-emi { font-size:2.4rem; margin-bottom:12px; opacity:.3; }
    .fin-empty p { color:${T.gray300}; font-size:.8rem; font-family:${T.font}; }
    .fin-section-hdr { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; padding-bottom:14px; border-bottom:3px solid ${T.orange}; }
    .fin-section-tag { display:inline-block; background:${T.blue}; color:${T.white}; font-family:${T.font}; font-size:11px; font-weight:700; padding:4px 14px; border-radius:2px; margin-bottom:4px; letter-spacing:.04em; }
    .fin-section-title { font-size:clamp(15px,2vw,20px); font-weight:900; color:${T.black}; font-family:${T.font}; }
    .fin-section-title span { color:${T.orange}; }
    .fin-card { background:${T.white}; border-radius:3px; border:1.5px solid ${T.gray300}; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative; }
    .fin-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to left,${T.orange},${T.blue}); z-index:2; }
    @media(max-width:700px){ .fin-toolbar{ flex-direction:column; align-items:stretch; } .fin-expw{ align-self:flex-start; } }
`;

function injectFinStyles() {
    if (document.getElementById('fin-styles')) return;
    const el = document.createElement('style');
    el.id = 'fin-styles';
    el.textContent = FIN_STYLES;
    document.head.appendChild(el);
}

function fmtMoney(n) {
    if (n == null || isNaN(Number(n))) return '0';
    return Number(n).toLocaleString('ar-EG');
}
function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ════════════════════════════════════════════════════════════════════════════
// DATA BUILDER
// ════════════════════════════════════════════════════════════════════════════
function buildFinancialRows(usersData, coursesData, ordersData) {
    const priceByPlanwork = {};
    ordersData.forEach(o => {
        const pid = o.planworkId ?? o.PlanworkId ?? o.planwork_id ?? o.courseId ?? o.CourseId;
        const price = o.price ?? o.Price ?? o.amount ?? o.Amount ?? 0;
        if (pid != null) priceByPlanwork[Number(pid)] = Number(price);
    });
    const orderByKey = {};
    ordersData.forEach(o => {
        const uid = o.userId ?? o.UserId ?? o.user_id;
        const pid = o.planworkId ?? o.PlanworkId ?? o.planwork_id ?? o.courseId ?? o.CourseId;
        const price = o.price ?? o.Price ?? o.amount ?? o.Amount ?? 0;
        if (uid != null && pid != null) orderByKey[`${Number(uid)}-${Number(pid)}`] = Number(price);
    });
    return usersData.map(u => {
        const courses = u.enrolledCourses.map(c => {
            const matchedCourse = coursesData.find(cd => cd.id === c.id || cd.title === c.title);
            const pid = c.id ?? matchedCourse?.id;
            const orderKey = pid != null ? `${Number(u.id)}-${Number(pid)}` : null;
            let price = 0;
            if (orderKey && orderByKey[orderKey] != null) price = orderByKey[orderKey];
            else if (pid != null && priceByPlanwork[Number(pid)] != null) price = priceByPlanwork[Number(pid)];
            else {
                const fallback = ordersData.find(o => {
                    const oUid = o.userId ?? o.UserId ?? o.user_id;
                    const oPid = o.planworkId ?? o.PlanworkId ?? o.planwork_id ?? o.courseId ?? o.CourseId;
                    return Number(oUid) === Number(u.id) && (oPid == null || Number(oPid) === Number(pid));
                });
                if (fallback) price = Number(fallback.price ?? fallback.Price ?? fallback.amount ?? fallback.Amount ?? 0);
            }
            return { title: c.title, date: c.date, price, planworkId: pid };
        });
        const totalPaid = courses.reduce((s, c) => s + c.price, 0);
        return { id: u.id, firstName: u.firstName, lastName: u.lastName, username: u.username, email: u.email, courses, totalPaid };
    }).filter(r => r.courses.length > 0);
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED RTL DATA BUILDER  ← single source of truth for both exports
// LTR order: # | name | email | course | price | total
// RTL export reverses every row so it reads right-to-left correctly
// ════════════════════════════════════════════════════════════════════════════
function buildExportData(rows, grandTotal) {
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
    // grand total footer
    dataRows.push(['', '', '', '', 'الإجمالي الكلي للمعهد', grandTotal]);

    // ← reverse columns for RTL rendering
    const rtlHeaders = [...headers].reverse();
    const rtlDataRows = dataRows.map(r => [...r].reverse());

    return { headers, dataRows, rtlHeaders, rtlDataRows };
}

// ════════════════════════════════════════════════════════════════════════════
// CANVAS HELPER  (Arabic text → PNG for jsPDF)
// ════════════════════════════════════════════════════════════════════════════
function renderTextToImage(text, { fontSize = 12, bold = false, color = '#111111', width = 200, height = 30, bgColor = null, align = 'right' } = {}) {
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d'); ctx.scale(scale, scale);
    if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); }
    ctx.font = `${bold ? 'bold ' : ''}${fontSize}px "Cairo","Noto Sans Arabic","Tahoma","Arial",sans-serif`;
    ctx.direction = 'rtl';
    ctx.textAlign = align === 'center' ? 'center' : align === 'left' ? 'left' : 'right';
    ctx.textBaseline = 'middle'; ctx.fillStyle = color;
    const padding = 6;
    const x = align === 'right' ? width - padding : align === 'left' ? padding : width / 2;
    const str = String(text ?? ''); let finalStr = str;
    const maxW = width - padding * 2;
    if (ctx.measureText(finalStr).width > maxW) {
        let lo = 0, hi = str.length;
        while (lo < hi) { const mid = Math.floor((lo + hi + 1) / 2); if (ctx.measureText(str.slice(0, mid) + '…').width <= maxW) lo = mid; else hi = mid - 1; }
        finalStr = str.slice(0, lo) + '…';
    }
    ctx.fillText(finalStr, x, height / 2);
    return canvas.toDataURL('image/png');
}

// ════════════════════════════════════════════════════════════════════════════
// EXCEL EXPORT  — RTL columns
// ════════════════════════════════════════════════════════════════════════════
async function exportFinancialExcel(rows, grandTotal) {
    const reportDate = new Date().toLocaleDateString('ar-EG');
    const { rtlHeaders, rtlDataRows } = buildExportData(rows, grandTotal);

    // ── ExcelJS (styled) ──
    try {
        const { default: ExcelJS } = await import('exceljs');
        const wb = new ExcelJS.Workbook();
        wb.views = [{ rightToLeft: true }];
        const ws = wb.addWorksheet('التقرير المالي', { views: [{ rightToLeft: true }] });

        ws.columns = rtlHeaders.map((h, i) => ({
            width: Math.min(Math.max(h.length, ...rtlDataRows.map(r => String(r[i] ?? '').length)) + 6, 50),
        }));

        // Title
        ws.mergeCells(1, 1, 2, rtlHeaders.length);
        const titleCell = ws.getCell('A1');
        titleCell.value = 'التقرير المالي — إيرادات المعهد';
        titleCell.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' };
        ws.getRow(1).height = 42; ws.getRow(2).height = 10;

        // Date
        ws.mergeCells(3, 1, 3, rtlHeaders.length);
        const dateCell = ws.getCell('A3');
        dateCell.value = `تاريخ التقرير: ${reportDate}   |   الإجمالي الكلي: ${grandTotal.toLocaleString()} EGP`;
        dateCell.font = { italic: true, size: 10, color: { argb: 'FF555555' } };
        dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
        dateCell.alignment = { horizontal: 'center', readingOrder: 'rightToLeft' };
        ws.getRow(3).height = 20;

        // Headers
        const hRow = ws.addRow(rtlHeaders);
        hRow.height = 28;
        hRow.eachCell(cell => {
            cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' };
            cell.border = { bottom: { style: 'medium', color: { argb: 'FFF57C00' } } };
        });

        // Data
        rtlDataRows.forEach((row, ri) => {
            const dr = ws.addRow(row);
            dr.height = 20;
            const isLast = ri === rtlDataRows.length - 1;
            const isAlt = ri % 2 !== 0;
            dr.eachCell({ includeEmpty: true }, cell => {
                cell.alignment = { horizontal: 'right', readingOrder: 'rightToLeft' };
                if (isLast) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF073F6E' } };
                    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                } else if (isAlt) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } };
                }
                const b = { style: 'thin', color: { argb: 'FFD0D0D0' } };
                cell.border = { top: b, bottom: b, left: b, right: b };
            });
        });

        const buffer = await wb.xlsx.writeBuffer();
        triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'التقرير-المالي.xlsx');
        return;
    } catch (_) { }

    // ── SheetJS fallback ──
    const wsData = [
        ['التقرير المالي — إيرادات المعهد'],
        [`تاريخ التقرير: ${reportDate}`],
        [],
        rtlHeaders,
        ...rtlDataRows,
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = rtlHeaders.map((h, i) => ({ wch: Math.min(Math.max(h.length, ...rtlDataRows.map(r => String(r[i] ?? '').length)) + 6, 55) }));
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: rtlHeaders.length - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: rtlHeaders.length - 1 } },
    ];
    const wb2 = XLSX.utils.book_new();
    wb2.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(wb2, ws, 'التقرير المالي');
    XLSX.writeFile(wb2, 'التقرير-المالي.xlsx');
}

// ════════════════════════════════════════════════════════════════════════════
// PDF EXPORT  — RTL columns
// ════════════════════════════════════════════════════════════════════════════
async function exportFinancialPDF(rows, grandTotal) {
    const reportDate = new Date().toLocaleDateString('ar-EG');
    const { rtlHeaders, rtlDataRows } = buildExportData(rows, grandTotal);

    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const BLUE = [8, 101, 168]; const ORANGE = [245, 124, 0];

    const drawHeader = () => {
        doc.setFillColor(...BLUE); doc.rect(0, 0, pageW, 34, 'F');
        doc.setFillColor(...ORANGE); doc.rect(0, 34, pageW, 2.5, 'F');
        const titleImg = renderTextToImage('التقرير المالي — إيرادات المعهد التكنولوجي', { fontSize: 17, bold: true, color: '#FFFFFF', width: 520, height: 44, align: 'center' });
        doc.addImage(titleImg, 'PNG', pageW / 2 - 85, 3, 170, 17);
        const subImg = renderTextToImage(`الإجمالي الكلي: ${grandTotal.toLocaleString()} EGP  |  ${reportDate}`, { fontSize: 9, color: '#CCE4FF', width: 400, height: 28, align: 'center' });
        doc.addImage(subImg, 'PNG', pageW / 2 - 55, 21, 110, 9);
    };
    drawHeader();

    autoTable(doc, {
        startY: 40,
        head: [rtlHeaders],
        body: rtlDataRows.map(r => r.map(c => String(c ?? ''))),
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 0.01, textColor: [0, 0, 0, 0], cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }, lineColor: [218, 218, 218], lineWidth: 0.3, minCellHeight: 10, valign: 'middle' },
        headStyles: { fillColor: BLUE, textColor: [255, 255, 255, 0], minCellHeight: 12, lineColor: ORANGE, lineWidth: { bottom: 1.2, top: 0.3, left: 0.3, right: 0.3 } },
        alternateRowStyles: { fillColor: [240, 246, 251] },
        // last column in RTL = # (was first in LTR)
        columnStyles: { [rtlHeaders.length - 1]: { cellWidth: 12, halign: 'center' } },
        margin: { top: 40, left: 8, right: 8, bottom: 16 },
        didDrawCell: data => {
            const text = String(data.cell.raw ?? '');
            if (!text || text.trim() === '') return;
            const { x, y, width: w, height: h } = data.cell;
            const isHeader = data.section === 'head';
            const isLast = data.row.index === rtlDataRows.length - 1;
            const img = renderTextToImage(text, {
                fontSize: isHeader ? 10 : 9,
                bold: isHeader || isLast,
                color: isHeader ? '#FFFFFF' : isLast ? '#FFFFFF' : '#1A1A1A',
                bgColor: isLast ? '#073F6E' : null,
                width: Math.max(Math.round(w * 3.8), 50),
                height: Math.max(Math.round(h * 3.8), 20),
                align: 'right',
            });
            try { doc.addImage(img, 'PNG', x + 0.5, y + 0.3, w - 1, h - 0.6); } catch (_) { }
        },
        didDrawPage: data => {
            if (data.pageNumber > 1) drawHeader();
            const pCount = doc.internal.getNumberOfPages();
            doc.setFillColor(245, 247, 250); doc.rect(0, pageH - 12, pageW, 12, 'F');
            doc.setDrawColor(...ORANGE); doc.setLineWidth(0.5); doc.line(8, pageH - 12, pageW - 8, pageH - 12);
            const mk = (t, w, a) => renderTextToImage(t, { fontSize: 7.5, color: '#555555', width: w, height: 18, align: a });
            doc.addImage(mk('المعهد التكنولوجي لهندسة التشييد والإدارة', 340, 'right'), 'PNG', 8, pageH - 10.5, 90, 6);
            doc.addImage(mk(`${data.pageNumber} / ${pCount}`, 110, 'center'), 'PNG', pageW / 2 - 18, pageH - 10.5, 36, 6);
            doc.addImage(mk(reportDate, 160, 'left'), 'PNG', pageW - 56, pageH - 10.5, 48, 6);
        },
    });
    doc.save('التقرير-المالي.pdf');
}

// ════════════════════════════════════════════════════════════════════════════
// PAGINATION
// ════════════════════════════════════════════════════════════════════════════
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    const buildPages = () => {
        const pages = []; const delta = 2;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) pages.push(i);
        }
        const result = []; let prev = null;
        for (const p of pages) { if (prev !== null && p - prev > 1) result.push('...'); result.push(p); prev = p; }
        return result;
    };
    const btn = (label, onClick, isActive, isDisabled) => (
        <button key={label + Math.random()} onClick={onClick} disabled={isDisabled}
            style={{ minWidth: 34, height: 34, padding: '0 8px', borderRadius: 2, border: isActive ? `2px solid ${T.blue}` : `1.5px solid ${T.gray300}`, background: isActive ? T.blue : isDisabled ? T.gray100 : T.white, color: isActive ? T.white : isDisabled ? T.gray300 : T.gray700, fontFamily: T.font, fontSize: '.78rem', fontWeight: 700, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1, transition: 'all .14s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{label}</button>
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
const FinancialTab = ({ usersData = [], coursesData = [], authFetch, API_BASE, API_HOST }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('total_desc');
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [exportError, setExportError] = useState(null);
    const exportRef = useRef(null);

    useEffect(() => { injectFinStyles(); }, []);

    useEffect(() => {
        const h = e => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportMenuOpen(false); };
        document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                const res = await authFetch(`${API_BASE}/Admin/orders`);
                if (res.ok) {
                    const json = await res.json();
                    setOrders(Array.isArray(json) ? json : json?.data ?? json?.orders ?? json?.payments ?? json?.items ?? json?.result ?? []);
                } else {
                    console.warn(`[FinancialTab] /Admin/orders returned ${res.status} — prices will be 0`);
                    setOrders([]);
                }
            } catch (err) {
                console.warn('[FinancialTab] fetch failed:', err.message);
                setOrders([]);
            } finally { setLoading(false); }
        };
        load();
    }, [authFetch, API_BASE]);

    const allRows = React.useMemo(() => buildFinancialRows(usersData, coursesData, orders), [usersData, coursesData, orders]);
    const grandTotal = allRows.reduce((s, r) => s + r.totalPaid, 0);
    const totalEnrollments = allRows.reduce((s, r) => s + r.courses.length, 0);
    const avgPerUser = allRows.length > 0 ? Math.round(grandTotal / allRows.length) : 0;
    const maxPayer = allRows.length > 0 ? allRows.reduce((a, b) => a.totalPaid > b.totalPaid ? a : b) : null;

    const courseRevenue = React.useMemo(() => {
        const map = {};
        allRows.forEach(r => r.courses.forEach(c => {
            if (!map[c.title]) map[c.title] = { title: c.title, total: 0, count: 0 };
            map[c.title].total += c.price; map[c.title].count += 1;
        }));
        return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 8);
    }, [allRows]);
    const maxCourseRev = courseRevenue[0]?.total || 1;

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

    const withExport = fn => async () => {
        setExporting(true); setExportMenuOpen(false); setExportError(null);
        try { await fn(); }
        catch (e) { setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); }
        finally { setExporting(false); }
    };

    return (
        <div>
            <div className="fin-section-hdr">
                <div>
                    <div className="fin-section-tag">التقارير المالية</div>
                    <div className="fin-section-title">إيرادات <span>المعهد</span></div>
                </div>
            </div>

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
                <div className="fin-stats-row">
                    {[
                        { label: 'إجمالي الإيرادات', val: `${fmtMoney(grandTotal)} EGP`, icon: '💰', bg: 'rgba(245,124,0,0.08)', iconColor: T.orange, valColor: T.orange, barBg: `linear-gradient(90deg,${T.orange},${T.orangeLight})`, cls: '' },
                        { label: 'عدد الدورات المُباعة', val: totalEnrollments, icon: '📚', bg: 'rgba(8,101,168,0.08)', iconColor: T.blue, valColor: T.blue, barBg: `linear-gradient(90deg,${T.blue},${T.blueLight})`, cls: 'blue' },
                        { label: 'متوسط إيرادات لكل مستخدم', val: `${fmtMoney(avgPerUser)} EGP`, icon: '📊', bg: 'rgba(22,163,74,0.08)', iconColor: T.green, valColor: T.green, barBg: `linear-gradient(90deg,${T.green},#22c55e)`, cls: 'green' },
                        { label: 'أكثر دورة إيرادًا', val: courseRevenue[0]?.title?.slice(0, 22) || '—', icon: '🏆', bg: 'rgba(124,58,237,0.06)', iconColor: '#7c3aed', valColor: '#7c3aed', barBg: 'linear-gradient(90deg,#7c3aed,#a78bfa)', cls: '' },
                    ].map(s => (
                        <div className={`fin-sc ${s.cls}`} key={s.label}>
                            <div className="fin-sc-icon" style={{ background: s.bg, color: s.iconColor }}>{s.icon}</div>
                            <div className="fin-sc-body">
                                <div className="fin-sc-val" style={{ color: s.valColor, fontSize: String(s.val).length > 10 ? '.85rem' : undefined }}>{s.val}</div>
                                <div className="fin-sc-lbl">{s.label}</div>
                                <div className="fin-sc-bar" style={{ background: s.barBg }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && courseRevenue.length > 0 && (
                <div className="fin-card" style={{ marginBottom: 24 }}>
                    <div style={{ padding: '16px 20px 4px', borderBottom: `1.5px solid ${T.gray100}` }}>
                        <span style={{ fontWeight: 900, fontSize: '.9rem', color: T.black, fontFamily: T.font }}>📊 إيرادات الدورات</span>
                        <span style={{ fontSize: '.68rem', color: T.gray500, marginRight: 10, fontFamily: T.font }}>أعلى {courseRevenue.length} دورات حسب الإيرادات</span>
                    </div>
                    <div className="fin-course-bars" style={{ padding: '16px 20px' }}>
                        {courseRevenue.map((c, i) => (
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

            <div className="fin-toolbar">
                <input className="fin-search-input" type="text" placeholder="ابحث باسم المستخدم، البريد، أو الدورة..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                {search && <button style={{ padding: '7px 12px', borderRadius: 3, border: `1.5px solid ${T.gray300}`, background: T.gray100, cursor: 'pointer', color: T.gray500, fontFamily: T.font, fontSize: '.72rem', fontWeight: 700 }} onClick={() => { setSearch(''); setPage(1); }}>✕ مسح</button>}
                <select className="fin-sort-sel" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                    <option value="total_desc">ترتيب: الأعلى دفعًا</option>
                    <option value="total_asc">ترتيب: الأقل دفعًا</option>
                    <option value="courses_desc">ترتيب: الأكثر دورات</option>
                    <option value="name">ترتيب: الاسم أبجديًا</option>
                </select>
                <div className="fin-expw" ref={exportRef} style={{ marginRight: 'auto' }}>
                    <button className="fin-expbtn" disabled={exporting} onClick={() => setExportMenuOpen(p => !p)}>
                        {exporting ? '⏳ جاري التصدير...' : '⬇ تصدير التقرير المالي ▾'}
                    </button>
                    {exportMenuOpen && (
                        <div className="fin-expmenu">
                            <button className="fin-expitem" onClick={withExport(() => exportFinancialExcel(sorted, grandTotal))}>📊 Excel (.xlsx) — كل المستخدمين</button>
                            <button className="fin-expitem" onClick={withExport(() => exportFinancialPDF(sorted, grandTotal))}>📄 PDF — كل المستخدمين</button>
                        </div>
                    )}
                </div>
            </div>

            {exportError && (
                <div className="fin-err">⚠️ {exportError}
                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setExportError(null)}>✕</button>
                </div>
            )}

            <div className="fin-card">
                {loading ? (
                    <div className="fin-ld"><div className="fin-sp" /><p>جاري تحميل البيانات المالية...</p></div>
                ) : error ? (
                    <div className="fin-empty"><div className="fin-emi">⚠️</div><p>{error}</p></div>
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
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 28, borderRadius: 2, background: 'rgba(8,101,168,0.08)', border: `1.5px solid rgba(8,101,168,0.25)`, color: T.blue, fontSize: '.76rem', fontWeight: 900, fontFamily: 'Courier New', padding: '0 6px' }}>{r.courses.length}</span>
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
                                                                <div style={{ width: '100%', marginBottom: 10 }}>
                                                                    <span style={{ fontSize: '.72rem', fontWeight: 900, color: T.blue, fontFamily: T.font }}>📚 دورات {r.firstName || r.username} ({r.courses.length} دورة)</span>
                                                                </div>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                                    {r.courses.map((c, ci) => (
                                                                        <div className="fin-course-chip" key={ci}>
                                                                            <span className="fin-course-chip-name">📖 {c.title}</span>
                                                                            <span style={{ width: 1, height: 14, background: T.gray300, display: 'inline-block', margin: '0 4px' }} />
                                                                            <span className="fin-course-chip-price">{fmtMoney(c.price)} EGP</span>
                                                                            {c.date && <span style={{ fontSize: '.62rem', color: T.gray500, fontFamily: T.font }}>📅 {c.date}</span>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ width: '100%', marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
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
                                            <span style={{ fontFamily: 'Courier New', fontWeight: 900, fontSize: '1rem', color: T.orangeLight }}>{fmtMoney(grandTotal)} EGP</span>
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