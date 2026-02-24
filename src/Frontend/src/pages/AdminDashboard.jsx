import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import logoSrc from '../assets/logo-removebg-preview.png';

// ════════════════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════════════════
const ADMIN_EMAILS = ['yasminamaged22@gmail.com', 'abeer.naguib@gmail.com','amrshamy91@gmail.com'];
const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';
const USE_MOCK_DATA = true;

const MOCK_USERS = [
    { id: 1, firstName: 'أحمد', lastName: 'محمد', email: 'ahmed.m@example.com' },
    { id: 2, firstName: 'سارة', lastName: 'علي', email: 'sara.a@example.com' },
    { id: 3, firstName: 'محمود', lastName: 'حسن', email: 'mahmoud.h@example.com' },
    { id: 4, firstName: 'نور', lastName: 'إبراهيم', email: 'nour.i@example.com' },
    { id: 5, firstName: 'خالد', lastName: 'عبدالله', email: 'khaled.a@example.com' },
    { id: 6, firstName: 'منى', lastName: 'يوسف', email: 'mona.y@example.com' },
];
const MOCK_COURSES = [
    { id: 101, title: 'إدارة المشاريع الإنشائية', category: 'إدارة' },
    { id: 102, title: 'السلامة والصحة المهنية', category: 'سلامة' },
    { id: 103, title: 'التشييد والبناء المستدام', category: 'هندسة' },
    { id: 104, title: 'إدارة العقود والمناقصات', category: 'إدارة' },
    { id: 105, title: 'AutoCAD للمهندسين', category: 'تقنية' },
];
const MOCK_ENROLLMENTS = [
    { userId: 1, courseId: 101, enrolledAt: '2025-01-15' }, { userId: 1, courseId: 103, enrolledAt: '2025-02-01' },
    { userId: 2, courseId: 101, enrolledAt: '2025-01-20' }, { userId: 2, courseId: 102, enrolledAt: '2025-01-25' },
    { userId: 2, courseId: 105, enrolledAt: '2025-03-10' }, { userId: 3, courseId: 104, enrolledAt: '2025-02-14' },
    { userId: 4, courseId: 102, enrolledAt: '2025-01-30' }, { userId: 4, courseId: 103, enrolledAt: '2025-02-20' },
    { userId: 4, courseId: 104, enrolledAt: '2025-03-05' }, { userId: 5, courseId: 105, enrolledAt: '2025-03-15' },
    { userId: 6, courseId: 101, enrolledAt: '2025-04-01' }, { userId: 6, courseId: 102, enrolledAt: '2025-04-05' },
];

const NAVBAR_H = 70;
const OVERVIEW_H = 36;

// ─── Logo → base64 ───────────────────────────────────────────────────────
let _logoCache = null;
function getLogoBase64() {
    return new Promise(resolve => {
        if (_logoCache) { resolve(_logoCache); return; }
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => { try { const c = document.createElement('canvas'); c.width = img.naturalWidth || 300; c.height = img.naturalHeight || 200; c.getContext('2d').drawImage(img, 0, 0); _logoCache = c.toDataURL('image/png'); resolve(_logoCache); } catch (e) { resolve(null); } };
        img.onerror = () => resolve(null); img.src = logoSrc;
    });
}
function triggerDownload(blob, filename) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 10000); }
function buildUsersRows(users) { const headers = ['#', 'الاسم الكامل', 'البريد الإلكتروني', 'اسم الدورة', 'تاريخ التسجيل']; const rows = []; let n = 1; users.forEach(u => { if (!u.enrolledCourses.length) { rows.push([n++, `${u.firstName} ${u.lastName}`, u.email, '—', '—']); } else { u.enrolledCourses.forEach((c, i) => { rows.push(i === 0 ? [n++, `${u.firstName} ${u.lastName}`, u.email, c.title, c.date || '—'] : ['', '', '', c.title, c.date || '—']); }); } }); return { headers, rows }; }
function buildCoursesRows(courses) { const headers = ['#', 'اسم الدورة', 'الفئة', 'اسم المستخدم', 'البريد الإلكتروني', 'تاريخ التسجيل']; const rows = []; let n = 1; courses.forEach(c => { if (!c.enrolledUsers.length) { rows.push([n++, c.title, c.category, '—', '—', '—']); } else { c.enrolledUsers.forEach((u, i) => { rows.push(i === 0 ? [n++, c.title, c.category, `${u.firstName} ${u.lastName}`, u.email, u.date || '—'] : ['', '', '', `${u.firstName} ${u.lastName}`, u.email, u.date || '—']); }); } }); return { headers, rows }; }

async function exportExcel(filename, reportTitle, headers, rows) { const reportDate = new Date().toLocaleDateString('ar-EG'); try { const { default: ExcelJS } = await import('exceljs'); const wb = new ExcelJS.Workbook(); wb.views = [{ rightToLeft: true }]; const ws = wb.addWorksheet('التقرير', { views: [{ rightToLeft: true }] }); ws.columns = headers.map((h, i) => ({ width: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 50) })); const logoB64 = await getLogoBase64(); if (logoB64) { const imgId = wb.addImage({ base64: logoB64.split(',')[1], extension: 'png' }); ws.addImage(imgId, { tl: { col: 0, row: 0 }, br: { col: 2, row: 5 } }); } ws.mergeCells(1, 1, 2, headers.length); const titleCell = ws.getCell('A1'); titleCell.value = reportTitle; titleCell.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } }; titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } }; titleCell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' }; ws.getRow(1).height = 42; ws.getRow(2).height = 10; ws.mergeCells(3, 1, 3, headers.length); const dateCell = ws.getCell('A3'); dateCell.value = `تاريخ التقرير: ${reportDate}`; dateCell.font = { italic: true, size: 10, color: { argb: 'FF555555' } }; dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } }; dateCell.alignment = { horizontal: 'center', readingOrder: 'rightToLeft' }; ws.getRow(3).height = 20; const hRow = ws.addRow(headers); hRow.height = 28; hRow.eachCell(cell => { cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } }; cell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' }; cell.border = { bottom: { style: 'medium', color: { argb: 'FFF57C00' } } }; }); rows.forEach((row, ri) => { const dr = ws.addRow(row); dr.height = 20; const isAlt = ri % 2 !== 0; dr.eachCell({ includeEmpty: true }, (cell, cn) => { cell.alignment = { horizontal: cn === 1 ? 'center' : 'right', readingOrder: 'rightToLeft' }; if (isAlt) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } }; const b = { style: 'thin', color: { argb: 'FFD0D0D0' } }; cell.border = { top: b, bottom: b, left: b, right: b }; }); }); const buffer = await wb.xlsx.writeBuffer(); triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename); return; } catch (_) { } const wsData = [[reportTitle, ...Array(headers.length - 1).fill('')], [`تاريخ التقرير: ${reportDate}`, ...Array(headers.length - 1).fill('')], [], headers, ...rows]; const ws = XLSX.utils.aoa_to_sheet(wsData); ws['!cols'] = headers.map((h, i) => ({ wch: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 55) })); ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }]; const wb = XLSX.utils.book_new(); wb.Workbook = { Views: [{ RTL: true }] }; XLSX.utils.book_append_sheet(wb, ws, 'التقرير'); XLSX.writeFile(wb, filename); }
function renderTextToImage(text, { fontSize = 12, bold = false, color = '#111111', width = 200, height = 30, bgColor = null, align = 'right' } = {}) { const scale = 3; const canvas = document.createElement('canvas'); canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale); const ctx = canvas.getContext('2d'); ctx.scale(scale, scale); if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); } ctx.fillStyle = color; ctx.font = `${bold ? 'bold ' : ''}${fontSize}px "Segoe UI", Arial, "Noto Naskh Arabic", sans-serif`; ctx.direction = 'rtl'; ctx.textAlign = align === 'right' ? 'right' : align === 'left' ? 'left' : 'center'; ctx.textBaseline = 'middle'; const padding = 4; let x; if (align === 'right') x = width - padding; else if (align === 'left') x = padding; else x = width / 2; ctx.fillText(String(text ?? ''), x, height / 2); return canvas.toDataURL('image/png'); }
async function exportPDF(filename, reportTitle, headers, rows, subtitle = '') { const logoDataUrl = await getLogoBase64(); const reportDate = new Date().toLocaleDateString('ar-EG'); const jsPDFModule = await import('jspdf'); const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF; const autoTableModule = await import('jspdf-autotable'); const autoTable = autoTableModule.default; const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' }); const pageW = doc.internal.pageSize.getWidth(); const pageH = doc.internal.pageSize.getHeight(); const BLUE = [8, 101, 168]; const ORANGE = [245, 124, 0]; const drawHeader = () => { doc.setFillColor(...BLUE); doc.rect(0, 0, pageW, 34, 'F'); doc.setFillColor(...ORANGE); doc.rect(0, 34, pageW, 2.5, 'F'); if (logoDataUrl) { doc.setFillColor(255, 255, 255); doc.roundedRect(5, 4, 36, 26, 3, 3, 'F'); try { doc.addImage(logoDataUrl, 'PNG', 6, 5, 34, 24); } catch (_) { } } const titleImg = renderTextToImage(reportTitle, { fontSize: 17, bold: true, color: '#FFFFFF', width: 520, height: 44, align: 'center' }); doc.addImage(titleImg, 'PNG', pageW / 2 - 85, 3, 170, 17); if (subtitle) { const subImg = renderTextToImage(subtitle, { fontSize: 9, color: '#CCE4FF', width: 400, height: 28, align: 'center' }); doc.addImage(subImg, 'PNG', pageW / 2 - 55, 21, 110, 9); } const dateImg = renderTextToImage(reportDate, { fontSize: 8, color: '#BBDAFF', width: 160, height: 22, align: 'right' }); doc.addImage(dateImg, 'PNG', pageW - 58, 25, 52, 7); }; drawHeader(); autoTable(doc, { startY: 40, head: [headers], body: rows.map(r => r.map(c => String(c ?? ''))), theme: 'grid', styles: { font: 'helvetica', fontSize: 0.01, textColor: [255, 255, 255, 0], cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }, lineColor: [218, 218, 218], lineWidth: 0.3, minCellHeight: 10, valign: 'middle' }, headStyles: { fillColor: BLUE, textColor: [255, 255, 255, 0], minCellHeight: 12, lineColor: ORANGE, lineWidth: { bottom: 1.2, top: 0.3, left: 0.3, right: 0.3 } }, alternateRowStyles: { fillColor: [240, 246, 251] }, columnStyles: { 0: { cellWidth: 14 } }, margin: { top: 40, left: 8, right: 8, bottom: 16 }, didDrawCell: (data) => { const text = String(data.cell.raw ?? ''); if (!text || text.trim() === '') return; const { x, y, width: w, height: h } = data.cell; const isHeader = data.section === 'head'; const isFirstCol = data.column.index === 0; const align = isFirstCol ? 'center' : 'right'; const img = renderTextToImage(text, { fontSize: isHeader ? 10 : 9, bold: isHeader, color: isHeader ? '#FFFFFF' : '#1A1A1A', width: Math.max(Math.round(w * 3.5), 40), height: Math.max(Math.round(h * 3.5), 18), align }); try { doc.addImage(img, 'PNG', x + 0.5, y + 0.3, w - 1, h - 0.6); } catch (_) { } }, didDrawPage: (data) => { if (data.pageNumber > 1) drawHeader(); const pCount = doc.internal.getNumberOfPages(); doc.setFillColor(245, 247, 250); doc.rect(0, pageH - 12, pageW, 12, 'F'); doc.setDrawColor(...ORANGE); doc.setLineWidth(0.5); doc.line(8, pageH - 12, pageW - 8, pageH - 12); const mkFI = (t, w, a) => renderTextToImage(t, { fontSize: 7.5, color: '#666666', width: w, height: 18, align: a }); doc.addImage(mkFI('ICEMT — Al-Muqawiloon Al-Arab', 220, 'left'), 'PNG', 8, pageH - 10, 58, 6); doc.addImage(mkFI(`Page ${data.pageNumber} of ${pCount}`, 110, 'center'), 'PNG', pageW / 2 - 18, pageH - 10, 36, 6); doc.addImage(mkFI(reportDate, 140, 'right'), 'PNG', pageW - 52, pageH - 10, 44, 6); } }); doc.save(filename); }
async function exportWord(filename, reportTitle, subtitle, headers, rows) { const logoDataUrl = await getLogoBase64(); const reportDate = new Date().toLocaleDateString('ar-EG'); let logoBase64Raw = null, LOGO_W_EMU = 900000, LOGO_H_EMU = 600000; if (logoDataUrl) { logoBase64Raw = logoDataUrl.split(',')[1]; await new Promise(res => { const img = new Image(); img.onload = () => { const H = 600000; LOGO_H_EMU = H; LOGO_W_EMU = img.naturalHeight > 0 ? Math.round((img.naturalWidth / img.naturalHeight) * H) : 900000; res(); }; img.onerror = res; img.src = logoDataUrl; }); } try { const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, ShadingType, BorderStyle, VerticalAlign, PageOrientation, ImageRun } = await import('docx'); const CB = { top: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' } }; const totalDxa = 13440; const cw = Math.floor(totalDxa / headers.length); const colWidths = headers.map(() => cw); const mkTC = (text, isHdr, width, center = false) => new TableCell({ width: { size: width, type: WidthType.DXA }, shading: { fill: isHdr ? '0865a8' : 'FFFFFF', type: ShadingType.CLEAR }, borders: CB, margins: { top: 80, bottom: 80, left: 120, right: 120 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ bidirectional: true, alignment: center ? AlignmentType.CENTER : AlignmentType.RIGHT, children: [new TextRun({ text: String(text ?? ''), bold: isHdr, color: isHdr ? 'FFFFFF' : '1A1A1A', size: isHdr ? 22 : 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA', eastAsiaValue: 'ar-SA' } })] })] }); const logoRuns = []; if (logoBase64Raw && ImageRun) { try { logoRuns.push(new ImageRun({ data: logoBase64Raw, type: 'png', transformation: { width: 90, height: 60 } })); logoRuns.push(new TextRun({ text: '  ', size: 28 })); } catch (_) { } } const arabicPara = (text, opts = {}) => new Paragraph({ bidirectional: true, alignment: opts.center ? AlignmentType.CENTER : AlignmentType.RIGHT, spacing: opts.spacing, border: opts.border, shading: opts.shading, children: [new TextRun({ text, bold: opts.bold || false, color: opts.color || '111111', size: opts.size || 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA' }, ...(opts.italic ? { italics: true } : {}) })] }); const doc = new Document({ sections: [{ properties: { page: { size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 900, left: 720 } } }, children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, shading: { fill: '0865a8', type: ShadingType.CLEAR }, border: { bottom: { style: BorderStyle.THICK, size: 18, color: 'f57c00', space: 6 } }, spacing: { before: 0, after: 80 }, children: [...logoRuns, new TextRun({ text: reportTitle, color: 'FFFFFF', bold: true, size: 28, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA' } }), subtitle ? new TextRun({ text: `  —  ${subtitle}`, color: 'D0E8FF', size: 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' } }) : new TextRun({ text: '' })] }), arabicPara(`تاريخ التقرير: ${reportDate}   |   إجمالي السجلات: ${rows.length}`, { size: 18, color: '555555', italic: true, spacing: { before: 100, after: 100 } }), new Table({ width: { size: totalDxa, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => mkTC(h, true, colWidths[i], i === 0)) }), ...rows.map((row, ri) => new TableRow({ children: row.map((cell, ci) => new TableCell({ width: { size: colWidths[ci], type: WidthType.DXA }, shading: { fill: ri % 2 === 0 ? 'FFFFFF' : 'F0F6FB', type: ShadingType.CLEAR }, borders: CB, margins: { top: 70, bottom: 70, left: 110, right: 110 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ bidirectional: true, alignment: ci === 0 ? AlignmentType.CENTER : AlignmentType.RIGHT, children: [new TextRun({ text: String(cell ?? ''), size: 19, color: '222222', rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA' } })] })] })) }))] })] }] }); const buffer = await Packer.toBuffer(doc); triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), filename); return; } catch (docxError) { console.warn('docx package not available:', docxError); } }

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const exportRef = useRef(null);

    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    const [attendance, setAttendance] = useState({});
    const [attendanceSaving, setAttendanceSaving] = useState({});
    const [attCourseFilter, setAttCourseFilter] = useState('all');
    const [attUserSearch, setAttUserSearch] = useState('');

    const [certificates, setCertificates] = useState({});
    const [certUploading, setCertUploading] = useState({});
    const [certModal, setCertModal] = useState(null);
    const [certDragOver, setCertDragOver] = useState(false);
    const certFileInputRef = useRef(null);
    const [certSearch, setCertSearch] = useState('');

    const toggleAttendance = async (userId, courseId) => {
        const key = `${userId}_${courseId}`;
        const newVal = !attendance[key];
        setAttendance(p => ({ ...p, [key]: newVal }));
        setAttendanceSaving(p => ({ ...p, [key]: true }));
        try {
            if (!USE_MOCK_DATA) await fetch(`${API_BASE}/admin/attendance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, courseId, attended: newVal }) });
        } catch { setAttendance(p => ({ ...p, [key]: !newVal })); }
        finally { setAttendanceSaving(p => ({ ...p, [key]: false })); }
    };

    const handleCertFile = async (userId, courseId, file) => {
        if (!file) return;
        const key = `${userId}_${courseId}`;
        setCertUploading(p => ({ ...p, [key]: true }));
        try {
            if (!USE_MOCK_DATA) { const fd = new FormData(); fd.append('file', file); fd.append('userId', userId); fd.append('courseId', courseId); const res = await fetch(`${API_BASE}/admin/certificates`, { method: 'POST', body: fd }); const data = await res.json(); setCertificates(p => ({ ...p, [key]: { name: file.name, url: data.url, size: file.size } })); }
            else { const url = URL.createObjectURL(file); setCertificates(p => ({ ...p, [key]: { name: file.name, url, size: file.size } })); }
        } catch (e) { console.error('Upload failed', e); }
        finally { setCertUploading(p => ({ ...p, [key]: false })); setCertModal(null); }
    };
    const removeCert = (userId, courseId) => { const key = `${userId}_${courseId}`; setCertificates(p => { const n = { ...p }; delete n[key]; return n; }); };

    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) navigate('/');
    }, [isLoaded, user, navigate]);

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                let usersRaw, coursesRaw, enrollRaw;
                if (USE_MOCK_DATA) { await new Promise(r => setTimeout(r, 600)); usersRaw = MOCK_USERS; coursesRaw = MOCK_COURSES; enrollRaw = MOCK_ENROLLMENTS; }
                else { const [uR, cR, eR] = await Promise.all([fetch(`${API_BASE}/admin/users`), fetch(`${API_BASE}/admin/courses`), fetch(`${API_BASE}/admin/enrollments`)]); if (!uR.ok || !cR.ok || !eR.ok) throw new Error('فشل في تحميل البيانات'); usersRaw = await uR.json(); coursesRaw = await cR.json(); enrollRaw = await eR.json(); }
                const usersMap = {};
                usersRaw.forEach(u => { usersMap[u.id] = { id: u.id, firstName: u.firstName || u.first_name || '', lastName: u.lastName || u.last_name || '', email: u.email || u.emailAddress || '', enrolledCourses: [] }; });
                enrollRaw.forEach(e => { const c = coursesRaw.find(c => c.id === e.courseId); if (usersMap[e.userId] && c) usersMap[e.userId].enrolledCourses.push({ id: c.id, title: c.title, date: e.enrolledAt || e.date || '' }); });
                const coursesMap = {};
                coursesRaw.forEach(c => { coursesMap[c.id] = { id: c.id, title: c.title, category: c.category || '', enrolledUsers: [] }; });
                enrollRaw.forEach(e => { const u = usersMap[e.userId]; if (coursesMap[e.courseId] && u) coursesMap[e.courseId].enrolledUsers.push({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, date: e.enrolledAt || e.date || '' }); });
                setUsersData(Object.values(usersMap)); setCoursesData(Object.values(coursesMap));
            } catch (err) { setError(err.message || 'حدث خطأ'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    useEffect(() => {
        const h = e => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportMenuOpen(false); };
        document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);

    const inRange = d => {
        if (!dateFrom && !dateTo) return true; if (!d) return false;
        const dt = new Date(d);
        if (dateFrom && dt < new Date(dateFrom)) return false;
        if (dateTo && dt > new Date(dateTo)) return false;
        return true;
    };

    const q = searchQuery.toLowerCase();
    const filteredUsers = usersData.map(u => ({ ...u, enrolledCourses: u.enrolledCourses.filter(c => inRange(c.date)) })).filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q));
    const filteredCourses = coursesData.map(c => ({ ...c, enrolledUsers: c.enrolledUsers.filter(u => inRange(u.date)) })).filter(c => `${c.title} ${c.category}`.toLowerCase().includes(q));

    const attRows = usersData.flatMap(u => u.enrolledCourses.map(c => ({ user: u, course: c }))).filter(r => {
        const mc = attCourseFilter === 'all' || r.course.id === Number(attCourseFilter);
        const mu = `${r.user.firstName} ${r.user.lastName} ${r.user.email}`.toLowerCase().includes(attUserSearch.toLowerCase());
        return mc && mu;
    });
    const attCount = attRows.filter(r => attendance[`${r.user.id}_${r.course.id}`]).length;

    const certRows = usersData.flatMap(u => u.enrolledCourses.map(c => ({ user: u, course: c, key: `${u.id}_${c.id}` }))).filter(r => `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.course.title}`.toLowerCase().includes(certSearch.toLowerCase()));

    const totalEnrollments = usersData.reduce((s, u) => s + u.enrolledCourses.length, 0);
    const totalCerts = Object.keys(certificates).length;

    const withExport = fn => async () => {
        setExporting(true); setExportMenuOpen(false); setExportError(null);
        try { await fn(); } catch (e) { console.error(e); setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); } finally { setExporting(false); }
    };
    const doExcel = withExport(async () => { const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); await exportExcel(activeTab === 'users' ? 'المستخدمون-والدورات.xlsx' : 'الدورات-والمستخدمون.xlsx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows); });
    const doPDF = withExport(async () => { const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); await exportPDF(activeTab === 'users' ? 'تقرير-المستخدمين.pdf' : 'تقرير-الدورات.pdf', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows, 'ICEMT'); });
    const doWord = withExport(async () => { const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); await exportWord(activeTab === 'users' ? 'تقرير-المستخدمين.docx' : 'تقرير-الدورات.docx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', 'ICEMT', headers, rows); });
    const doPrint = () => { window.print(); setExportMenuOpen(false); };

    if (!isLoaded || !user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid #e8eef5', borderTopColor: '#0865a8', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 16px' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <p style={{ color: '#0865a8', fontFamily: '"Droid Arabic Kufi",serif', fontSize: '0.9rem' }}>جاري التحقق...</p>
            </div>
        </div>
    );
    if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) return null;

    const isExportTab = activeTab === 'users' || activeTab === 'courses';

    const TABS = [
        { id: 'users', label: 'المستخدمون', icon: '👤', color: 'blue' },
        { id: 'courses', label: 'الدورات', icon: '📚', color: 'blue' },
        { id: 'attendance', label: 'الحضور', icon: '✅', color: 'green' },
        { id: 'certificates', label: 'الشهادات', icon: '📜', color: 'purple' },
    ];

    const STATS = [
        { label: 'المستخدمون', value: usersData.length, icon: '👤', accent: '#0865a8', bg: 'rgba(8,101,168,0.08)', border: 'rgba(8,101,168,0.2)' },
        { label: 'الدورات', value: coursesData.length, icon: '📚', accent: '#f57c00', bg: 'rgba(245,124,0,0.08)', border: 'rgba(245,124,0,0.2)' },
        { label: 'التسجيلات', value: totalEnrollments, icon: '🔗', accent: '#1a1a2e', bg: 'rgba(26,26,46,0.06)', border: 'rgba(26,26,46,0.15)' },
        { label: 'حضروا', value: attCount, icon: '🎓', accent: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)' },
        { label: 'الشهادات', value: totalCerts, icon: '📜', accent: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
    ];

    // Sidebar width: 200px desktop, 52px collapsed, 0 mobile
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        /* ─── ANIMATIONS ─────────────────────────── */
        @keyframes d-spin   { to { transform: rotate(360deg); } }
        @keyframes d-fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes d-slideIn{ from { opacity:0; transform:translateX(8px); } to { opacity:1; transform:translateX(0); } }

        /* ─── CSS VARS ───────────────────────────── */
        :root {
          --blue:    #0865a8;
          --blue-lt: #e8f1f9;
          --blue-md: rgba(8,101,168,0.12);
          --orange:  #f57c00;
          --orng-lt: #fff3e0;
          --orng-md: rgba(245,124,0,0.12);
          --black:   #111827;
          --gray1:   #374151;
          --gray2:   #6b7280;
          --gray3:   #9ca3af;
          --gray4:   #d1d5db;
          --gray5:   #e5e7eb;
          --white:   #ffffff;
          --bg:      linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
          --bg-flat: #f5f7fa;
          --card-bg: #ffffff;
          --card-border: #e5e7eb;
          --sidebar-w: 200px;
          --sidebar-col: 52px;
          --nav-h: ${NAVBAR_H + OVERVIEW_H}px;
          --font: "Droid Arabic Kufi", serif;
          --radius: 12px;
          --shadow: 0 2px 16px rgba(8,101,168,0.08), 0 1px 4px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 24px rgba(8,101,168,0.12), 0 2px 8px rgba(0,0,0,0.06);
        }

        /* ─── ROOT ───────────────────────────────── */
        .d-root {
          font-family: var(--font);
          direction: rtl;
          min-height: 100vh;
          background: var(--bg);
          padding-top: var(--nav-h);
          color: var(--black);
          display: flex;
        }

        /* ─── BREADCRUMB ─────────────────────────── */
        ._ovr {
          position: fixed;
          top: ${NAVBAR_H}px;
          left: 0; z-index: 1050;
          width: 100%;
          background: #ffffff;
          border-bottom: 2px solid var(--orange);
          padding: 7px 20px;
          text-align: center;
          font-family: var(--font);
          font-size: clamp(0.7rem, 1.3vw, 0.78rem);
          color: var(--gray1);
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
        }
        ._ovr a { margin-left: 10px; color: var(--blue); text-decoration: none; font-weight: 700; }
        ._ovr a:hover { text-decoration: underline; }
        ._ovr .sep { color: var(--gray3); margin: 0 4px; }
        ._ovr .cur { margin-right: 10px; color: var(--gray2); }

        /* ═══════════════════════════════════════════
           SIDEBAR — fixed, right side, narrow
        ═══════════════════════════════════════════ */
        .d-sidebar {
          position: fixed;
          top: var(--nav-h);
          right: 0;
          width: var(--sidebar-w);
          height: calc(100vh - var(--nav-h));
          background: var(--white);
          border-left: 1.5px solid var(--card-border);
          box-shadow: -2px 0 12px rgba(8,101,168,0.06);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 200;
          transition: width 0.25s ease;
        }

        /* Brand block */
        .d-sidebar-brand {
          padding: 16px 12px;
          border-bottom: 1.5px solid var(--card-border);
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--blue);
          flex-shrink: 0;
        }
        .d-sb-logo {
          width: 34px; height: 34px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          flex-shrink: 0;
        }
        .d-sb-title { min-width: 0; overflow: hidden; }
        .d-sb-name {
          font-size: 0.82rem; font-weight: 900;
          color: #fff; white-space: nowrap;
          letter-spacing: 0.3px;
        }
        .d-sb-sub { font-size: 0.6rem; color: rgba(255,255,255,0.55); margin-top: 2px; white-space: nowrap; }

        /* User card */
        .d-sidebar-user {
          padding: 12px;
          border-bottom: 1.5px solid var(--card-border);
          display: flex; align-items: center; gap: 10px;
          background: var(--blue-lt);
          flex-shrink: 0;
        }
        .d-su-av {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: var(--blue);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 900; color: #fff;
          flex-shrink: 0;
          border: 2px solid rgba(8,101,168,0.2);
        }
        .d-su-info { flex: 1; min-width: 0; overflow: hidden; }
        .d-su-name {
          font-size: 0.74rem; font-weight: 700;
          color: var(--black); overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }
        .d-su-role {
          display: inline-flex; align-items: center; gap: 3px;
          margin-top: 2px; padding: 1px 7px;
          background: var(--orng-lt);
          border: 1px solid rgba(245,124,0,0.3);
          border-radius: 20px;
          font-size: 0.58rem; color: var(--orange); font-weight: 700;
        }

        /* Nav */
        .d-sidebar-nav {
          flex: 1; padding: 10px 8px;
          overflow-y: auto; overflow-x: hidden;
        }
        .d-sidebar-nav::-webkit-scrollbar { width: 3px; }
        .d-sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .d-sidebar-nav::-webkit-scrollbar-thumb { background: var(--gray4); border-radius: 2px; }

        .d-nav-section { margin-bottom: 6px; }
        .d-nav-label {
          font-size: 0.58rem; font-weight: 700;
          color: var(--gray3);
          letter-spacing: 1.2px; text-transform: uppercase;
          padding: 0 8px; margin-bottom: 4px;
        }
        .d-nav-btn {
          width: 100%;
          display: flex; align-items: center;
          gap: 8px;
          padding: 9px 10px;
          border-radius: 9px;
          border: 1.5px solid transparent;
          background: transparent;
          color: var(--gray2);
          font-family: var(--font);
          font-size: 0.78rem; font-weight: 700;
          cursor: pointer;
          transition: all 0.16s;
          text-align: right;
          margin-bottom: 2px;
          white-space: nowrap; overflow: hidden;
        }
        .d-nav-btn:hover {
          background: var(--blue-lt);
          color: var(--blue);
          border-color: rgba(8,101,168,0.15);
        }
        .d-nav-btn.active {
          background: var(--blue-md);
          color: var(--blue);
          border-color: rgba(8,101,168,0.3);
        }
        .d-nav-btn.active.gr {
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border-color: rgba(22,163,74,0.3);
        }
        .d-nav-btn.active.pu {
          background: rgba(124,58,237,0.1);
          color: #7c3aed;
          border-color: rgba(124,58,237,0.3);
        }
        .d-nav-btn.active::after {
          content: '';
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--blue);
          border-radius: 2px 0 0 2px;
        }
        .d-nav-btn { position: relative; }
        .d-nav-btn.active.gr::after { background: #16a34a; }
        .d-nav-btn.active.pu::after { background: #7c3aed; }

        .d-nav-icon { font-size: 0.9rem; flex-shrink: 0; }
        .d-nav-label-text { flex: 1; text-align: right; overflow: hidden; text-overflow: ellipsis; }
        .d-nav-badge {
          margin-right: auto;
          padding: 1px 6px; border-radius: 9px;
          font-size: 0.58rem; font-weight: 900;
          background: var(--orng-lt);
          color: var(--orange);
          border: 1px solid rgba(245,124,0,0.3);
          flex-shrink: 0;
        }

        /* Sidebar footer */
        .d-sidebar-footer {
          padding: 10px 12px;
          border-top: 1.5px solid var(--card-border);
          font-size: 0.6rem;
          color: var(--gray3);
          text-align: center;
          background: var(--bg-flat);
          flex-shrink: 0;
        }

        /* ═══════════════════════════════════════════
           MAIN
        ═══════════════════════════════════════════ */
        .d-main {
          margin-right: var(--sidebar-w);
          flex: 1; min-width: 0;
          padding: clamp(14px,2.5vw,28px) clamp(12px,2.5vw,28px) clamp(32px,5vw,56px);
          animation: d-fadeUp 0.28s ease;
        }

        /* ─── Page header ─────────────────────────── */
        .d-page-hdr {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: clamp(16px,2.5vw,28px);
          padding-bottom: clamp(14px,2vw,20px);
          border-bottom: 1.5px solid var(--gray5);
        }
        .d-page-title {
          font-size: clamp(1rem,2.5vw,1.4rem);
          font-weight: 900;
          color: var(--black);
          line-height: 1.2;
        }
        .d-page-title-accent { color: var(--blue); }
        .d-page-sub {
          font-size: clamp(0.66rem,1.2vw,0.74rem);
          color: var(--gray2);
          margin-top: 4px;
        }
        .d-page-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

        /* ─── Mock warning ────────────────────────── */
        .d-mock {
          display: flex; align-items: center; gap: 8px;
          background: #fff8f0;
          border: 1px solid rgba(245,124,0,0.35);
          border-radius: 9px;
          padding: 8px 14px;
          margin-bottom: clamp(12px,2vw,20px);
          font-size: clamp(0.68rem,1.3vw,0.76rem);
          color: #b45309;
        }
        .d-mock code {
          background: var(--orng-lt);
          color: var(--orange);
          padding: 1px 5px; border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.86em;
        }

        /* ─── Stat cards ──────────────────────────── */
        .d-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(clamp(110px,15vw,155px), 1fr));
          gap: clamp(8px,1.5vw,14px);
          margin-bottom: clamp(16px,2.5vw,26px);
        }
        .d-sc {
          background: var(--white);
          border-radius: var(--radius);
          padding: clamp(14px,2vw,18px) clamp(12px,2vw,16px);
          border: 1.5px solid var(--card-border);
          box-shadow: var(--shadow);
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .d-sc:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .d-sc::after {
          content: attr(data-icon);
          position: absolute; left: -4px; bottom: -6px;
          font-size: clamp(1.8rem,4vw,2.5rem);
          opacity: 0.06; pointer-events: none;
          transform: rotate(-10deg);
        }
        .d-sc-val {
          font-size: clamp(1.5rem,3.5vw,2rem);
          font-weight: 900; line-height: 1;
          font-family: 'Courier New', monospace;
        }
        .d-sc-lbl { font-size: clamp(0.62rem,1.1vw,0.7rem); margin-top: 5px; color: var(--gray2); font-weight: 700; }
        .d-sc-bar { height: 3px; border-radius: 2px; margin-top: 10px; width: 40%; opacity: 0.6; }

        /* ─── Toolbar ─────────────────────────────── */
        .d-toolbar {
          display: flex; align-items: center;
          gap: clamp(6px,1.2vw,10px); flex-wrap: wrap;
          margin-bottom: clamp(12px,2vw,18px);
          background: var(--white);
          border: 1.5px solid var(--card-border);
          border-radius: var(--radius);
          padding: clamp(9px,1.5vw,13px) clamp(12px,2vw,16px);
          box-shadow: var(--shadow);
        }

        /* ─── Search ──────────────────────────────── */
        .d-search { flex: 1; min-width: clamp(140px,18vw,200px); position: relative; }
        .d-search input {
          width: 100%;
          padding: clamp(7px,1.2vw,10px) 36px clamp(7px,1.2vw,10px) clamp(10px,1.5vw,14px);
          border-radius: 9px;
          border: 1.5px solid var(--gray4);
          background: var(--bg-flat);
          color: var(--black);
          font-family: var(--font);
          font-size: clamp(0.72rem,1.3vw,0.8rem);
          outline: none; direction: rtl;
          transition: border 0.18s, background 0.18s;
        }
        .d-search input::placeholder { color: var(--gray3); }
        .d-search input:focus { border-color: var(--blue); background: #fff; }
        .d-search::after { content: '🔍'; position: absolute; right: 11px; top: 50%; transform: translateY(-50%); font-size: 0.7rem; pointer-events: none; opacity: 0.5; }

        /* ─── Export button ───────────────────────── */
        .d-expw { position: relative; }
        .d-expbtn {
          display: flex; align-items: center; gap: 6px;
          padding: clamp(7px,1.2vw,10px) clamp(12px,2vw,18px);
          background: var(--orange);
          color: #fff;
          border: none; border-radius: 9px;
          font-family: var(--font);
          font-size: clamp(0.72rem,1.3vw,0.8rem);
          font-weight: 700; cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s;
          box-shadow: 0 3px 12px rgba(245,124,0,0.3);
        }
        .d-expbtn:hover { background: #e65100; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(245,124,0,0.4); }
        .d-expbtn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .d-expmenu {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: var(--white);
          border: 1.5px solid var(--card-border);
          border-radius: 11px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          overflow: hidden; z-index: 400;
          min-width: 185px;
          animation: d-slideIn 0.15s ease;
        }
        .d-expitem {
          display: flex; align-items: center; gap: 9px;
          width: 100%;
          padding: clamp(9px,1.8vw,12px) clamp(12px,2vw,16px);
          background: none; border: none;
          border-bottom: 1px solid var(--gray5);
          font-family: var(--font);
          font-size: clamp(0.72rem,1.3vw,0.8rem);
          font-weight: 700;
          color: var(--gray1);
          direction: rtl; cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .d-expitem:last-child { border-bottom: none; }
        .d-expitem:hover { background: var(--blue-lt); color: var(--blue); }

        /* ─── Date filter ─────────────────────────── */
        .d-filter {
          display: flex; align-items: center;
          gap: clamp(6px,1.2vw,12px); flex-wrap: wrap;
          background: var(--white);
          border: 1.5px solid var(--card-border);
          border-radius: var(--radius);
          padding: clamp(9px,1.5vw,12px) clamp(12px,2vw,16px);
          margin-bottom: clamp(12px,2vw,18px);
          box-shadow: var(--shadow);
        }
        .d-flbl { font-size: clamp(0.68rem,1.2vw,0.76rem); font-weight: 700; color: var(--gray2); white-space: nowrap; }
        .d-fsm  { font-size: clamp(0.64rem,1.1vw,0.7rem); color: var(--gray3); }
        .d-fdate {
          padding: clamp(5px,1vw,8px) clamp(7px,1.2vw,11px);
          border-radius: 8px;
          border: 1.5px solid var(--gray4);
          background: var(--bg-flat);
          color: var(--black);
          font-family: var(--font);
          font-size: clamp(0.7rem,1.2vw,0.78rem);
          outline: none; direction: ltr;
          transition: border 0.18s;
        }
        .d-fdate:focus { border-color: var(--blue); background: #fff; }
        .d-fsel {
          padding: clamp(5px,1vw,8px) clamp(7px,1.2vw,11px);
          border-radius: 8px;
          border: 1.5px solid var(--gray4);
          background: var(--bg-flat);
          color: var(--black);
          font-family: var(--font);
          font-size: clamp(0.7rem,1.2vw,0.78rem);
          outline: none; cursor: pointer;
        }
        .d-fbadge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 20px;
          background: var(--orng-lt);
          border: 1px solid rgba(245,124,0,0.3);
          color: var(--orange);
          font-size: clamp(0.62rem,1.1vw,0.7rem); font-weight: 700;
        }
        .d-fclear {
          padding: clamp(4px,0.9vw,7px) clamp(9px,1.5vw,12px);
          border-radius: 8px;
          background: var(--bg-flat);
          border: 1.5px solid var(--gray4);
          font-family: var(--font);
          font-size: clamp(0.64rem,1.1vw,0.72rem);
          font-weight: 700; cursor: pointer;
          color: var(--gray2);
          transition: all 0.16s;
        }
        .d-fclear:hover { border-color: var(--orange); color: var(--orange); background: var(--orng-lt); }

        /* ─── Error ───────────────────────────────── */
        .d-err {
          background: #fef2f2;
          border: 1.5px solid rgba(220,38,38,0.3);
          color: #dc2626;
          border-radius: 9px;
          padding: clamp(8px,1.5vw,11px) clamp(10px,2vw,14px);
          margin-bottom: 14px;
          font-size: clamp(0.7rem,1.3vw,0.78rem);
          display: flex; align-items: center; gap: 9px;
        }

        /* ─── Card / Table ────────────────────────── */
        .d-card {
          background: var(--white);
          border-radius: var(--radius);
          border: 1.5px solid var(--card-border);
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .d-tscr { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .d-tbl { width: 100%; border-collapse: collapse; min-width: 480px; }

        .d-tbl thead th {
          background: var(--blue);
          color: #fff;
          padding: clamp(10px,1.8vw,14px) clamp(10px,2vw,18px);
          font-family: var(--font);
          font-size: clamp(0.68rem,1.2vw,0.76rem);
          font-weight: 700; text-align: right;
          white-space: nowrap;
          border-bottom: 3px solid var(--orange);
          letter-spacing: 0.3px;
        }
        .d-tbl thead th.gr  { background: #16a34a; border-bottom-color: #86efac; }
        .d-tbl thead th.pu  { background: #7c3aed; border-bottom-color: #c4b5fd; }
        .d-tbl thead th.c   { text-align: center; }

        .d-tbl tbody tr { border-bottom: 1px solid var(--gray5); transition: background 0.12s; }
        .d-tbl tbody tr:last-child { border-bottom: none; }
        .d-tbl tbody tr:hover { background: var(--blue-lt); }
        .d-tbl tbody tr.xopen { background: var(--blue-lt); }
        .d-tbl tbody tr:nth-child(even) { background: #fafbfc; }
        .d-tbl tbody tr:nth-child(even):hover { background: var(--blue-lt); }

        .d-tbl td {
          padding: clamp(9px,1.6vw,13px) clamp(10px,2vw,18px);
          font-family: var(--font);
          font-size: clamp(0.69rem,1.25vw,0.78rem);
          color: var(--gray1);
          vertical-align: middle;
        }

        /* ─── Avatar ──────────────────────────────── */
        .d-av {
          width: clamp(28px,3.5vw,36px);
          height: clamp(28px,3.5vw,36px);
          border-radius: 9px;
          background: var(--blue);
          color: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          font-weight: 900;
          font-size: clamp(0.58rem,1vw,0.66rem);
          flex-shrink: 0;
          border: 2px solid rgba(8,101,168,0.2);
        }
        .d-av.or { background: var(--orange); border-color: rgba(245,124,0,0.2); }
        .d-av.sm { width: 24px; height: 24px; border-radius: 7px; font-size: 0.58rem; }

        /* ─── Inline elements ─────────────────────── */
        .d-uc    { display: flex; align-items: center; gap: 9px; }
        .d-uname { font-weight: 700; color: var(--black); }
        .d-cb {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 24px; height: 24px;
          border-radius: 7px;
          background: var(--blue-lt);
          border: 1.5px solid rgba(8,101,168,0.25);
          color: var(--blue);
          font-size: clamp(0.62rem,1.1vw,0.7rem); font-weight: 900;
          padding: 0 6px;
          font-family: 'Courier New', monospace;
        }
        .d-cb.or { background: var(--orng-lt); border-color: rgba(245,124,0,0.3); color: var(--orange); }
        .d-cb.gr { background: #f0fdf4; border-color: rgba(22,163,74,0.3); color: #16a34a; }

        .d-pill {
          display: inline-block; padding: 4px 12px;
          border-radius: 7px;
          font-size: clamp(0.62rem,1.1vw,0.7rem); font-weight: 700;
          cursor: pointer;
          border: 1.5px solid rgba(8,101,168,0.3);
          color: var(--blue);
          background: var(--blue-lt);
          user-select: none;
          transition: all 0.14s;
          font-family: var(--font);
        }
        .d-pill:hover, .d-pill.op { background: var(--blue-md); border-color: rgba(8,101,168,0.6); }
        .d-pill.or { border-color: rgba(245,124,0,0.3); color: var(--orange); background: var(--orng-lt); }
        .d-pill.or:hover, .d-pill.or.op { background: var(--orng-md); border-color: rgba(245,124,0,0.6); }

        .d-cat {
          display: inline-block; padding: 2px 9px;
          border-radius: 6px;
          font-size: clamp(0.6rem,1.05vw,0.68rem); font-weight: 700;
          background: var(--orng-lt);
          color: var(--orange);
          border: 1px solid rgba(245,124,0,0.25);
        }

        /* ─── Expand row ──────────────────────────── */
        .d-xrow td { padding: 0 !important; border: none; }
        .d-xin {
          padding: clamp(12px,2vw,16px) clamp(14px,2.5vw,22px);
          display: flex; flex-wrap: wrap;
          gap: clamp(7px,1.3vw,11px);
          background: var(--blue-lt);
          border-top: 2px solid rgba(8,101,168,0.15);
        }
        .d-mc {
          background: var(--white);
          border-radius: 10px;
          padding: clamp(9px,1.8vw,13px) clamp(10px,2vw,14px);
          border: 1.5px solid var(--gray5);
          min-width: clamp(150px,20vw,200px);
          flex: 1 1 150px; max-width: 260px;
          transition: border-color 0.14s;
          box-shadow: var(--shadow);
        }
        .d-mc:hover { border-color: rgba(8,101,168,0.3); }
        .d-mt { font-size: clamp(0.7rem,1.25vw,0.78rem); font-weight: 700; color: var(--blue); margin-bottom: 2px; }
        .d-mt.or { color: var(--orange); }
        .d-ms { font-size: clamp(0.63rem,1.1vw,0.7rem); color: var(--gray2); }
        .d-md { font-size: clamp(0.6rem,1vw,0.66rem); color: var(--gray3); margin-top: 4px; }

        /* ─── Empty / Loading ─────────────────────── */
        .d-empty { text-align: center; padding: clamp(40px,8vw,70px) 20px; }
        .d-emi   { font-size: clamp(1.8rem,4vw,2.5rem); margin-bottom: 12px; opacity: 0.35; }
        .d-empty p { color: var(--gray3); font-size: clamp(0.74rem,1.4vw,0.82rem); }
        .d-ld  { text-align: center; padding: clamp(50px,10vw,80px) 20px; }
        .d-sp  { width: clamp(32px,4.5vw,42px); height: clamp(32px,4.5vw,42px); border: 3px solid var(--gray5); border-top-color: var(--blue); border-radius: 50%; animation: d-spin .7s linear infinite; margin: 0 auto clamp(12px,2vw,18px); }
        .d-ld p { color: var(--gray3); font-size: clamp(0.72rem,1.3vw,0.8rem); }

        /* ─── Export overlay ──────────────────────── */
        .d-ovl { position: fixed; inset: 0; background: rgba(245,247,250,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
        .d-ovlb {
          background: var(--white);
          border-radius: 18px;
          padding: clamp(28px,5vw,44px) clamp(44px,7vw,64px);
          text-align: center;
          box-shadow: 0 16px 48px rgba(8,101,168,0.18);
          border: 2px solid rgba(8,101,168,0.15);
        }
        .d-ovlb p { font-size: clamp(0.78rem,1.5vw,0.86rem); margin-top: 14px; color: var(--gray2); font-family: var(--font); }

        /* ─── Attendance ──────────────────────────── */
        .d-chk {
          width: 22px; height: 22px; border-radius: 6px;
          border: 2px solid var(--gray4);
          background: var(--bg-flat);
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: all 0.16s; flex-shrink: 0;
          font-size: 0.75rem; color: transparent;
        }
        .d-chk:hover { border-color: #16a34a; background: #f0fdf4; }
        .d-chk.on  { background: #f0fdf4; border-color: #16a34a; color: #16a34a; }
        .d-chk.spin { border-color: #16a34a; border-top-color: transparent; border-radius: 50%; animation: d-spin .6s linear infinite; }

        .d-att-badge {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 3px 9px; border-radius: 7px;
          font-size: clamp(0.62rem,1.1vw,0.7rem); font-weight: 700;
        }
        .d-att-badge.on  { background: #f0fdf4; color: #16a34a; border: 1px solid #86efac; }
        .d-att-badge.off { background: var(--bg-flat); color: var(--gray3); border: 1px solid var(--gray4); }

        .d-att-sum {
          display: flex; align-items: center;
          gap: clamp(10px,2vw,20px); flex-wrap: wrap;
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          border-radius: var(--radius);
          padding: clamp(9px,1.8vw,13px) clamp(12px,2vw,18px);
          margin-bottom: clamp(12px,2vw,18px);
          box-shadow: var(--shadow);
        }
        .d-att-sum span { font-size: clamp(0.7rem,1.3vw,0.78rem); font-weight: 700; color: #15803d; }
        .d-prog-wrap { flex: 1; min-width: 100px; height: 6px; background: #bbf7d0; border-radius: 3px; overflow: hidden; }
        .d-prog-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #16a34a, #22c55e); transition: width 0.5s ease; }

        /* ─── Certificate grid ────────────────────── */
        .d-cert-grid { display: grid; gap: clamp(9px,1.8vw,13px); padding: clamp(12px,2vw,18px); grid-template-columns: repeat(auto-fill, minmax(clamp(260px,30vw,320px), 1fr)); }
        .d-cert-card {
          background: var(--white);
          border-radius: 12px;
          padding: clamp(11px,2vw,15px) clamp(12px,2vw,16px);
          border: 1.5px solid var(--card-border);
          display: flex; align-items: center;
          gap: clamp(9px,1.5vw,12px);
          transition: border-color 0.16s, box-shadow 0.16s;
          box-shadow: var(--shadow);
        }
        .d-cert-card:hover { border-color: rgba(124,58,237,0.3); box-shadow: 0 4px 16px rgba(124,58,237,0.1); }
        .d-cert-icon {
          width: clamp(36px,4.5vw,44px); height: clamp(36px,4.5vw,44px);
          border-radius: 10px;
          background: rgba(124,58,237,0.08);
          border: 1.5px solid rgba(124,58,237,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: clamp(0.95rem,1.8vw,1.2rem); flex-shrink: 0;
        }
        .d-cert-icon.has { background: #f0fdf4; border-color: #86efac; }
        .d-cert-info { flex: 1; min-width: 0; }
        .d-cert-name { font-weight: 700; font-size: clamp(0.72rem,1.3vw,0.8rem); color: var(--black); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .d-cert-sub  { font-size: clamp(0.62rem,1.1vw,0.7rem); color: var(--gray2); margin-top: 2px; }
        .d-cert-actions { display: flex; gap: 5px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
        .d-cert-btn {
          padding: clamp(4px,1vw,6px) clamp(8px,1.5vw,12px);
          border-radius: 7px;
          font-family: var(--font);
          font-size: clamp(0.62rem,1.1vw,0.7rem); font-weight: 700;
          cursor: pointer; border: none;
          transition: all 0.14s; white-space: nowrap;
        }
        .d-cert-btn.up  { background: rgba(124,58,237,0.1); color: #7c3aed; border: 1.5px solid rgba(124,58,237,0.25); }
        .d-cert-btn.up:hover { background: rgba(124,58,237,0.2); }
        .d-cert-btn.dl  { background: var(--blue-lt); color: var(--blue); border: 1.5px solid rgba(8,101,168,0.25); }
        .d-cert-btn.dl:hover { background: var(--blue-md); }
        .d-cert-btn.rm  { background: #fef2f2; color: #dc2626; border: 1.5px solid rgba(220,38,38,0.2); }
        .d-cert-btn.rm:hover { background: #fee2e2; }
        .d-cert-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ─── Upload modal ────────────────────────── */
        .d-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); animation: d-fadeUp 0.16s ease; }
        .d-modal {
          background: var(--white);
          border-radius: 18px;
          padding: clamp(22px,4vw,32px);
          max-width: clamp(290px,88vw,440px); width: 100%;
          box-shadow: 0 16px 48px rgba(0,0,0,0.15);
          direction: rtl;
          border: 2px solid rgba(124,58,237,0.2);
          border-top: 4px solid #7c3aed;
        }
        .d-modal h3 { font-size: clamp(0.9rem,1.7vw,1rem); font-weight: 900; color: var(--black); margin-bottom: 4px; }
        .d-modal p  { font-size: clamp(0.68rem,1.2vw,0.76rem); color: var(--gray2); margin-bottom: 18px; font-family: var(--font); }
        .d-drop {
          border: 2px dashed rgba(124,58,237,0.35);
          border-radius: 12px;
          padding: clamp(24px,5vw,36px) 16px;
          text-align: center; cursor: pointer;
          transition: all 0.16s;
          background: rgba(124,58,237,0.04);
        }
        .d-drop.over { border-color: #7c3aed; background: rgba(124,58,237,0.1); }
        .d-drop:hover { border-color: rgba(124,58,237,0.6); }
        .d-drop-icon { font-size: clamp(1.7rem,3.5vw,2.3rem); margin-bottom: 8px; }
        .d-drop-txt  { font-size: clamp(0.72rem,1.4vw,0.8rem); color: var(--gray1); margin-bottom: 4px; font-family: var(--font); }
        .d-drop-sub  { font-size: clamp(0.62rem,1.1vw,0.7rem); color: var(--gray3); }
        .d-modal-actions { display: flex; gap: 7px; margin-top: 18px; justify-content: flex-end; }
        .d-modal-cancel {
          padding: clamp(7px,1.3vw,10px) clamp(12px,2vw,18px);
          border-radius: 9px;
          background: var(--bg-flat);
          border: 1.5px solid var(--gray4);
          font-family: var(--font);
          font-size: clamp(0.7rem,1.3vw,0.78rem); font-weight: 700;
          cursor: pointer; color: var(--gray2);
          transition: all 0.14s;
        }
        .d-modal-cancel:hover { border-color: var(--gray2); color: var(--black); background: var(--white); }

        /* ─── Footer ──────────────────────────────── */
        .d-ftr {
          text-align: center;
          margin-top: clamp(20px,3.5vw,32px);
          padding-top: 18px;
          border-top: 1.5px solid var(--gray5);
          color: var(--gray3);
          font-size: clamp(0.6rem,1vw,0.67rem);
        }
        .d-ftr strong { color: var(--blue); }

        .d-email { direction: ltr; text-align: right; color: var(--gray3); font-size: clamp(0.65rem,1.15vw,0.73rem); }

        /* ═══════════════════════════════════════════
           RESPONSIVE 300px → 2400px+
        ═══════════════════════════════════════════ */

        /* ── 900–1200px: collapse sidebar text ──── */
        @media (max-width: 1100px) {
          :root { --sidebar-w: 52px; }
          .d-sb-title, .d-su-info, .d-nav-label, .d-nav-badge,
          .d-sidebar-footer, .d-nav-label-text { display: none; }
          .d-sidebar-brand { padding: 12px; justify-content: center; }
          .d-sidebar-user  { padding: 10px; justify-content: center; }
          .d-sidebar-nav   { padding: 8px 6px; }
          .d-nav-btn { justify-content: center; padding: 10px 7px; }
          .d-sb-logo { width: 28px; height: 28px; }
          .d-su-av   { width: 30px; height: 30px; }
        }

        /* ── 768px: smaller type adjustments ───── */
        @media (max-width: 768px) {
          .d-stats { grid-template-columns: repeat(3, 1fr); }
          .d-toolbar { padding: 8px 10px; gap: 6px; }
          .d-cert-grid { grid-template-columns: 1fr !important; }
          .d-mc { max-width: 100%; }
          .d-page-hdr { flex-direction: column; }
          .d-page-actions { width: 100%; }
        }

        /* ── 600px: hide sidebar completely ─────── */
        @media (max-width: 600px) {
          :root { --sidebar-w: 0px; }
          .d-sidebar { display: none; }
          .d-main { margin-right: 0; }
          .d-stats { grid-template-columns: repeat(2, 1fr); }
          .d-toolbar { padding: 7px 8px; }
          .d-filter  { padding: 7px 8px; gap: 5px; }
          .d-tbl { min-width: 380px; }
        }

        /* ── 400px: tight squeeze ────────────────── */
        @media (max-width: 400px) {
          .d-stats { grid-template-columns: repeat(2, 1fr); }
          .d-sc-val { font-size: 1.4rem; }
          .d-main { padding: 10px 8px 28px; }
          ._ovr { font-size: 0.65rem; padding: 6px 10px; }
        }

        /* ── 300px: absolute minimum ─────────────── */
        @media (max-width: 320px) {
          .d-stats { grid-template-columns: 1fr 1fr; }
          .d-sc { padding: 10px; }
          .d-sc-val { font-size: 1.25rem; }
          .d-tbl thead th, .d-tbl td { padding: 7px 8px; font-size: 0.62rem; }
        }

        /* ── 1920px+: generous spacing ───────────── */
        @media (min-width: 1920px) {
          :root { --sidebar-w: 220px; }
          .d-main { padding: 36px 44px 72px; }
          .d-tbl thead th, .d-tbl td { padding: 15px 22px; font-size: 0.85rem; }
          .d-stats { grid-template-columns: repeat(5, 1fr); }
        }

        /* ── 2200px+ ─────────────────────────────── */
        @media (min-width: 2200px) {
          :root { --sidebar-w: 240px; }
        }

        /* ─── Print ───────────────────────────────── */
        @media print {
          .d-sidebar, .d-toolbar, .d-filter, .d-mock, ._ovr { display: none !important; }
          .d-root { background: #fff !important; padding-top: 0 !important; }
          .d-main { margin-right: 0 !important; padding: 0 !important; }
          .d-card { box-shadow: none !important; border: 1px solid #ddd; }
          .d-tbl thead th { background: #0865a8 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 15mm; }
        }
      `}</style>

            {/* ── Export overlay ─────────────────────────────────────────────── */}
            {exporting && (
                <div className="d-ovl">
                    <div className="d-ovlb">
                        <div className="d-sp" />
                        <p>جاري تصدير الملف... يرجى الانتظار</p>
                    </div>
                </div>
            )}

            {/* ── Certificate modal ─────────────────────────────────────────── */}
            {certModal && (
                <div className="d-modal-bg" onClick={() => setCertModal(null)}>
                    <div className="d-modal" onClick={e => e.stopPropagation()}>
                        <h3>📜 رفع شهادة</h3>
                        <p>{certModal.userName} — {certModal.courseTitle}</p>
                        <div
                            className={`d-drop${certDragOver ? ' over' : ''}`}
                            onClick={() => certFileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setCertDragOver(true); }}
                            onDragLeave={() => setCertDragOver(false)}
                            onDrop={e => { e.preventDefault(); setCertDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleCertFile(certModal.userId, certModal.courseId, f); }}
                        >
                            <div className="d-drop-icon">📂</div>
                            <div className="d-drop-txt">اسحب الملف هنا أو اضغط للاختيار</div>
                            <div className="d-drop-sub">PDF, JPG, PNG — حجم أقصى 10 MB</div>
                            <input ref={certFileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files[0]; if (f) handleCertFile(certModal.userId, certModal.courseId, f); e.target.value = ''; }} />
                        </div>
                        {certUploading[`${certModal.userId}_${certModal.courseId}`] && (
                            <div style={{ textAlign: 'center', marginTop: 12, color: '#7c3aed', fontSize: '.8rem', fontWeight: 700, fontFamily: '"Droid Arabic Kufi",serif' }}>⏳ جاري الرفع...</div>
                        )}
                        <div className="d-modal-actions">
                            <button className="d-modal-cancel" onClick={() => setCertModal(null)}>إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
            <div className="_ovr">
                <a href="/">الصفحة الرئيسية</a>
                <span className="sep">›</span>
                <span className="cur">لوحة الإدارة</span>
            </div>

            {/* ── ROOT LAYOUT ──────────────────────────────────────────────────── */}
            <div className="d-root">

                {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
                <aside className="d-sidebar">
                    {/* Brand */}
                    <div className="d-sidebar-brand">
                        <img src={logoSrc} alt="ICEMT" className="d-sb-logo" />
                        <div className="d-sb-title">
                            <div className="d-sb-name">ICEMT</div>
                            <div className="d-sb-sub">لوحة التحكم الإدارية</div>
                        </div>
                    </div>

                    {/* User card */}
                    <div className="d-sidebar-user">
                        <div className="d-su-av">
                            {(user?.firstName?.[0] || 'م')}{(user?.lastName?.[0] || '')}
                        </div>
                        <div className="d-su-info">
                            <div className="d-su-name">{user?.firstName} {user?.lastName}</div>
                            <div className="d-su-role">🔐 مدير النظام</div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="d-sidebar-nav">
                        <div className="d-nav-section">
                            <div className="d-nav-label">القائمة</div>
                            {TABS.map(t => (
                                <button
                                    key={t.id}
                                    title={t.label}
                                    className={`d-nav-btn${activeTab === t.id ? ' active' : ''}${t.color === 'green' ? ' gr' : t.color === 'purple' ? ' pu' : ''}`}
                                    onClick={() => { setActiveTab(t.id); setExpandedRow(null); setSearchQuery(''); }}
                                >
                                    <span className="d-nav-icon">{t.icon}</span>
                                    <span className="d-nav-label-text">{t.label}</span>
                                    {t.id === 'certificates' && totalCerts > 0 && <span className="d-nav-badge">{totalCerts}</span>}
                                </button>
                            ))}
                        </div>
                    </nav>

                    <div className="d-sidebar-footer">
                        ICEMT © {new Date().getFullYear()}
                    </div>
                </aside>

                {/* ── MAIN ─────────────────────────────────────────────────────── */}
                <main className="d-main">

                    {/* Page header */}
                    <div className="d-page-hdr">
                        <div>
                            <div className="d-page-title">
                                <span style={{ color: '#f57c00' }}>{TABS.find(t => t.id === activeTab)?.icon}</span>{' '}
                                {activeTab === 'users' ? 'المستخدمون والدورات'
                                    : activeTab === 'courses' ? 'الدورات والمستخدمون'
                                        : activeTab === 'attendance' ? 'سجل الحضور'
                                            : 'الشهادات'}
                            </div>
                            <div className="d-page-sub">
                                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        {USE_MOCK_DATA && (
                            <div className="d-mock">
                                ⚠️ وضع التطوير — <code>USE_MOCK_DATA = true</code>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    {!loading && !error && (
                        <div className="d-stats">
                            {STATS.map(s => (
                                <div key={s.label} className="d-sc" data-icon={s.icon}
                                    style={{ borderColor: s.border }}>
                                    <div className="d-sc-val" style={{ color: s.accent }}>{s.value}</div>
                                    <div className="d-sc-lbl">{s.label}</div>
                                    <div className="d-sc-bar" style={{ background: s.accent }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {exportError && (
                        <div className="d-err">⚠️ {exportError}
                            <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setExportError(null)}>✕</button>
                        </div>
                    )}

                    {/* ── ATTENDANCE TAB ─────────────────────────────────────────── */}
                    {activeTab === 'attendance' && (
                        <div>
                            <div className="d-filter">
                                <span className="d-flbl">🎓 الدورة:</span>
                                <select className="d-fsel" value={attCourseFilter} onChange={e => setAttCourseFilter(e.target.value)}>
                                    <option value="all">جميع الدورات</option>
                                    {coursesData.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                                <div className="d-search" style={{ minWidth: 170 }}>
                                    <input type="text" placeholder="ابحث باسم المستخدم..." value={attUserSearch} onChange={e => setAttUserSearch(e.target.value)} />
                                </div>
                                {attUserSearch && <button className="d-fclear" onClick={() => setAttUserSearch('')}>✕ مسح</button>}
                            </div>

                            <div className="d-att-sum">
                                <span>✅ {attRows.filter(r => attendance[`${r.user.id}_${r.course.id}`]).length} حضر</span>
                                <span>❌ {attRows.filter(r => !attendance[`${r.user.id}_${r.course.id}`]).length} غائب</span>
                                <span>📋 {attRows.length} إجمالي</span>
                                {attRows.length > 0 && (
                                    <>
                                        <span>{Math.round(attRows.filter(r => attendance[`${r.user.id}_${r.course.id}`]).length / attRows.length * 100)}٪ حضور</span>
                                        <div className="d-prog-wrap">
                                            <div className="d-prog-fill" style={{ width: `${Math.round(attRows.filter(r => attendance[`${r.user.id}_${r.course.id}`]).length / attRows.length * 100)}%` }} />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="d-card">
                                {loading ? <div className="d-ld"><div className="d-sp" /><p>جاري التحميل...</p></div>
                                    : attRows.length === 0 ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد نتائج</p></div>
                                        : (
                                            <div className="d-tscr">
                                                <table className="d-tbl">
                                                    <thead>
                                                        <tr>
                                                            <th className="c" style={{ width: 40 }}>#</th>
                                                            <th>المستخدم</th>
                                                            <th>البريد الإلكتروني</th>
                                                            <th>الدورة</th>
                                                            <th className="gr c">الحضور</th>
                                                            <th className="gr c">الحالة</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {attRows.map((row, idx) => {
                                                            const key = `${row.user.id}_${row.course.id}`;
                                                            const attended = !!attendance[key]; const saving = !!attendanceSaving[key];
                                                            return (
                                                                <tr key={key}>
                                                                    <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{idx + 1}</td>
                                                                    <td><div className="d-uc"><div className="d-av">{row.user.firstName?.[0]}{row.user.lastName?.[0]}</div><span className="d-uname">{row.user.firstName} {row.user.lastName}</span></div></td>
                                                                    <td className="d-email">{row.user.email}</td>
                                                                    <td style={{ color: 'var(--blue)', fontWeight: 700 }}>{row.course.title}</td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <div className={`d-chk${saving ? ' spin' : attended ? ' on' : ''}`}
                                                                            onClick={() => !saving && toggleAttendance(row.user.id, row.course.id)}
                                                                            title={attended ? 'حضر — اضغط للتغيير' : 'غائب — اضغط للتسجيل'}>
                                                                            {!saving && attended && '✓'}
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <span className={`d-att-badge ${attended ? 'on' : 'off'}`}>{attended ? '✅ حضر' : '❌ غائب'}</span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                            </div>
                        </div>
                    )}

                    {/* ── CERTIFICATES TAB ──────────────────────────────────────── */}
                    {activeTab === 'certificates' && (
                        <div>
                            <div className="d-filter">
                                <span className="d-flbl">📜 البحث:</span>
                                <div className="d-search" style={{ minWidth: 210 }}>
                                    <input type="text" placeholder="ابحث باسم المستخدم أو الدورة..." value={certSearch} onChange={e => setCertSearch(e.target.value)} />
                                </div>
                                <span style={{ fontSize: '.74rem', color: 'var(--gray3)', marginRight: 6, fontFamily: '"Droid Arabic Kufi",serif' }}>
                                    {Object.keys(certificates).length} شهادة من أصل {certRows.length}
                                </span>
                            </div>
                            <div className="d-card">
                                {loading ? <div className="d-ld"><div className="d-sp" /><p>جاري التحميل...</p></div>
                                    : certRows.length === 0 ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد نتائج</p></div>
                                        : (
                                            <div className="d-cert-grid">
                                                {certRows.map(row => {
                                                    const cert = certificates[row.key]; const uploading = certUploading[row.key]; const attended = attendance[row.key];
                                                    return (
                                                        <div className="d-cert-card" key={row.key}>
                                                            <div className={`d-cert-icon${cert ? ' has' : ''}`}>{cert ? '📜' : '📄'}</div>
                                                            <div className="d-cert-info">
                                                                <div className="d-cert-name">{row.user.firstName} {row.user.lastName}</div>
                                                                <div className="d-cert-sub">📚 {row.course.title}</div>
                                                                {cert && <div style={{ fontSize: '.65rem', color: '#16a34a', marginTop: 2, fontWeight: 700 }}>✅ {cert.name}{cert.size && ` · ${(cert.size / 1024).toFixed(0)} KB`}</div>}
                                                                {!cert && !attended && <div style={{ fontSize: '.65rem', color: 'var(--orange)', marginTop: 2 }}>⚠️ لم يُسجَّل الحضور</div>}
                                                            </div>
                                                            <div className="d-cert-actions">
                                                                {cert ? (
                                                                    <>
                                                                        <a href={cert.url} download={cert.name} target="_blank" rel="noreferrer">
                                                                            <button className="d-cert-btn dl">⬇ تحميل</button>
                                                                        </a>
                                                                        <button className="d-cert-btn up" onClick={() => setCertModal({ userId: row.user.id, courseId: row.course.id, userName: `${row.user.firstName} ${row.user.lastName}`, courseTitle: row.course.title })}>🔄</button>
                                                                        <button className="d-cert-btn rm" onClick={() => removeCert(row.user.id, row.course.id)}>🗑</button>
                                                                    </>
                                                                ) : (
                                                                    <button className="d-cert-btn up" disabled={uploading}
                                                                        onClick={() => setCertModal({ userId: row.user.id, courseId: row.course.id, userName: `${row.user.firstName} ${row.user.lastName}`, courseTitle: row.course.title })}>
                                                                        {uploading ? '⏳ جاري...' : '⬆ رفع'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                            </div>
                        </div>
                    )}

                    {/* ── USERS / COURSES TABS ──────────────────────────────────── */}
                    {isExportTab && (
                        <>
                            {/* Toolbar */}
                            <div className="d-toolbar">
                                <div className="d-search">
                                    <input type="text"
                                        placeholder={activeTab === 'users' ? 'ابحث باسم المستخدم أو البريد...' : 'ابحث باسم الدورة أو الفئة...'}
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setExpandedRow(null); }}
                                    />
                                </div>
                                <span className="d-flbl">📅</span>
                                <span className="d-fsm">من</span>
                                <input type="date" className="d-fdate" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setExpandedRow(null); }} />
                                <span className="d-fsm">إلى</span>
                                <input type="date" className="d-fdate" value={dateTo} min={dateFrom} onChange={e => { setDateTo(e.target.value); setExpandedRow(null); }} />
                                {(dateFrom || dateTo) && (
                                    <>
                                        <span className="d-fbadge">🔶 فلتر نشط</span>
                                        <button className="d-fclear" onClick={() => { setDateFrom(''); setDateTo(''); setExpandedRow(null); }}>✕</button>
                                    </>
                                )}
                                <div className="d-expw" ref={exportRef}>
                                    <button className="d-expbtn" disabled={exporting} onClick={() => setExportMenuOpen(p => !p)}>
                                        {exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}
                                    </button>
                                    {exportMenuOpen && (
                                        <div className="d-expmenu">
                                            <button className="d-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button>
                                            <button className="d-expitem" onClick={doPDF}>📄 PDF</button>
                                            <button className="d-expitem" onClick={doWord}>📝 Word (.docx)</button>
                                            <button className="d-expitem" onClick={doPrint}>🖨 طباعة</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="d-card">
                                {loading ? <div className="d-ld"><div className="d-sp" /><p>جاري تحميل البيانات...</p></div>
                                    : error ? <div className="d-empty"><div className="d-emi">⚠️</div><p>{error}</p></div>
                                        : (activeTab === 'users' ? filteredUsers : filteredCourses).length === 0
                                            ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                                            : (
                                                <div className="d-tscr">
                                                    <table className="d-tbl">
                                                        <thead>
                                                            <tr>
                                                                <th className="c" style={{ width: 40 }}>#</th>
                                                                {activeTab === 'users' ? (
                                                                    <><th>المستخدم</th><th>البريد الإلكتروني</th><th className="c">الدورات</th><th className="c">تفاصيل</th></>
                                                                ) : (
                                                                    <><th>اسم الدورة</th><th>الفئة</th><th className="c">المسجّلون</th><th className="c">تفاصيل</th></>
                                                                )}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {activeTab === 'users'
                                                                ? filteredUsers.map((u, idx) => (
                                                                    <React.Fragment key={u.id}>
                                                                        <tr className={expandedRow === u.id ? 'xopen' : ''}>
                                                                            <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{idx + 1}</td>
                                                                            <td><div className="d-uc"><div className="d-av">{(u.firstName?.[0] || '?')}{(u.lastName?.[0] || '')}</div><span className="d-uname">{u.firstName} {u.lastName}</span></div></td>
                                                                            <td className="d-email">{u.email}</td>
                                                                            <td style={{ textAlign: 'center' }}><span className="d-cb">{u.enrolledCourses.length}</span></td>
                                                                            <td style={{ textAlign: 'center' }}>
                                                                                {u.enrolledCourses.length > 0
                                                                                    ? <span className={`d-pill ${expandedRow === u.id ? 'op' : ''}`} onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}>{expandedRow === u.id ? '▲ إخفاء' : '▼ عرض'}</span>
                                                                                    : <span style={{ color: 'var(--gray4)' }}>—</span>}
                                                                            </td>
                                                                        </tr>
                                                                        {expandedRow === u.id && (
                                                                            <tr className="d-xrow"><td colSpan={5}>
                                                                                <div className="d-xin">
                                                                                    {u.enrolledCourses.map(c => (
                                                                                        <div className="d-mc" key={c.id}>
                                                                                            <div className="d-mt">📚 {c.title}</div>
                                                                                            {c.date && <div className="d-md">📅 {c.date}</div>}
                                                                                            <div style={{ marginTop: 5, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                                                                                <span className={`d-att-badge ${attendance[`${u.id}_${c.id}`] ? 'on' : 'off'}`} style={{ fontSize: '.62rem' }}>{attendance[`${u.id}_${c.id}`] ? '✅ حضر' : '❌ غائب'}</span>
                                                                                                {certificates[`${u.id}_${c.id}`] && <span style={{ fontSize: '.62rem', color: '#7c3aed', fontWeight: 700 }}>📜 شهادة</span>}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </td></tr>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))
                                                                : filteredCourses.map((c, idx) => (
                                                                    <React.Fragment key={c.id}>
                                                                        <tr className={expandedRow === c.id ? 'xopen' : ''}>
                                                                            <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{idx + 1}</td>
                                                                            <td style={{ fontWeight: 700, color: 'var(--blue)' }}>📚 {c.title}</td>
                                                                            <td>{c.category && <span className="d-cat">{c.category}</span>}</td>
                                                                            <td style={{ textAlign: 'center' }}><span className="d-cb or">{c.enrolledUsers.length}</span></td>
                                                                            <td style={{ textAlign: 'center' }}>
                                                                                {c.enrolledUsers.length > 0
                                                                                    ? <span className={`d-pill or ${expandedRow === c.id ? 'op' : ''}`} onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}>{expandedRow === c.id ? '▲ إخفاء' : '▼ عرض'}</span>
                                                                                    : <span style={{ color: 'var(--gray4)' }}>—</span>}
                                                                            </td>
                                                                        </tr>
                                                                        {expandedRow === c.id && (
                                                                            <tr className="d-xrow"><td colSpan={5}>
                                                                                <div className="d-xin">
                                                                                    {c.enrolledUsers.map(u => (
                                                                                        <div className="d-mc" key={u.id}>
                                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                                                                                                <div className="d-av or sm">{(u.firstName?.[0] || '?')}{(u.lastName?.[0] || '')}</div>
                                                                                                <div>
                                                                                                    <div className="d-mt or">{u.firstName} {u.lastName}</div>
                                                                                                    <div className="d-ms">✉ {u.email}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            {u.date && <div className="d-md">📅 {u.date}</div>}
                                                                                            <div style={{ marginTop: 5, display: 'flex', gap: 5 }}>
                                                                                                <span className={`d-att-badge ${attendance[`${u.id}_${c.id}`] ? 'on' : 'off'}`} style={{ fontSize: '.62rem' }}>{attendance[`${u.id}_${c.id}`] ? '✅ حضر' : '❌ غائب'}</span>
                                                                                                {certificates[`${u.id}_${c.id}`] && <span style={{ fontSize: '.62rem', color: '#7c3aed', fontWeight: 700 }}>📜 شهادة</span>}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </td></tr>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div className="d-ftr">
                        تم إنشاء هذا التقرير بتاريخ {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {' — '}<strong>ICEMT Admin Panel</strong>
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;