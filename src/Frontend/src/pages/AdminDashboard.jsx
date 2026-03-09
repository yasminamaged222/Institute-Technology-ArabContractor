import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import logoSrc from '../assets/logo-removebg-preview.png';

// ════════════════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════════════════
const ADMIN_EMAILS = ['yasminamaged22@gmail.com', 'abeer.naguib@gmail.com', 'amrshamy91@gmail.com', 'abdelmawla1642@gmail.com'];
const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const NAVBAR_H = 70;
const OVERVIEW_H = 36;

// ════════════════════════════════════════════════════════════════════════════
// REFUND STATUS META
// ════════════════════════════════════════════════════════════════════════════
const REFUND_STATUS_META = {
    Pending: { label: 'قيد المراجعة', icon: '⏳', color: '#b45309', bg: '#fff8f0', border: 'rgba(245,124,0,0.35)' },
    Approved: { label: 'موافق عليه', icon: '✅', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
    Sent: { label: 'أُرسل للبنك', icon: '🏦', color: '#0865a8', bg: '#e8f1f9', border: 'rgba(8,101,168,0.35)' },
    Rejected: { label: 'مرفوض', icon: '❌', color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.3)' },
    pending: { label: 'قيد المراجعة', icon: '⏳', color: '#b45309', bg: '#fff8f0', border: 'rgba(245,124,0,0.35)' },
    approved: { label: 'موافق عليه', icon: '✅', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
    sent: { label: 'أُرسل للبنك', icon: '🏦', color: '#0865a8', bg: '#e8f1f9', border: 'rgba(8,101,168,0.35)' },
    sent_to_bank: { label: 'أُرسل للبنك', icon: '🏦', color: '#0865a8', bg: '#e8f1f9', border: 'rgba(8,101,168,0.35)' },
    rejected: { label: 'مرفوض', icon: '❌', color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.3)' },
};

// ════════════════════════════════════════════════════════════════════════════
// LOGO / EXPORT HELPERS
// ════════════════════════════════════════════════════════════════════════════
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
async function exportExcel(filename, reportTitle, headers, rows) { const reportDate = new Date().toLocaleDateString('ar-EG'); try { const { default: ExcelJS } = await import('exceljs'); const wb = new ExcelJS.Workbook(); wb.views = [{ rightToLeft: true }]; const ws = wb.addWorksheet('التقرير', { views: [{ rightToLeft: true }] }); ws.columns = headers.map((h, i) => ({ width: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 50) })); const logoB64 = await getLogoBase64(); if (logoB64) { const imgId = wb.addImage({ base64: logoB64.split(',')[1], extension: 'png' }); ws.addImage(imgId, { tl: { col: 0, row: 0 }, br: { col: 2, row: 5 } }); } ws.mergeCells(1, 1, 2, headers.length); const titleCell = ws.getCell('A1'); titleCell.value = reportTitle; titleCell.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } }; titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } }; titleCell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' }; ws.getRow(1).height = 42; ws.getRow(2).height = 10; ws.mergeCells(3, 1, 3, headers.length); const dateCell = ws.getCell('A3'); dateCell.value = `تاريخ التقرير: ${reportDate}`; dateCell.font = { italic: true, size: 10, color: { argb: 'FF555555' } }; dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } }; dateCell.alignment = { horizontal: 'center', readingOrder: 'rightToLeft' }; ws.getRow(3).height = 20; const hRow = ws.addRow(headers); hRow.height = 28; hRow.eachCell(cell => { cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } }; cell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' }; cell.border = { bottom: { style: 'medium', color: { argb: 'FFF57C00' } } }; }); rows.forEach((row, ri) => { const dr = ws.addRow(row); dr.height = 20; const isAlt = ri % 2 !== 0; dr.eachCell({ includeEmpty: true }, (cell, cn) => { cell.alignment = { horizontal: cn === 1 ? 'center' : 'right', readingOrder: 'rightToLeft' }; if (isAlt) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } }; const b = { style: 'thin', color: { argb: 'FFD0D0D0' } }; cell.border = { top: b, bottom: b, left: b, right: b }; }); }); const buffer = await wb.xlsx.writeBuffer(); triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename); return; } catch (_) { } const wsData = [[reportTitle, ...Array(headers.length - 1).fill('')], [`تاريخ التقرير: ${reportDate}`, ...Array(headers.length - 1).fill('')], [], headers, ...rows]; const ws = XLSX.utils.aoa_to_sheet(wsData); ws['!cols'] = headers.map((h, i) => ({ wch: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 55) })); ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }]; const wb2 = XLSX.utils.book_new(); wb2.Workbook = { Views: [{ RTL: true }] }; XLSX.utils.book_append_sheet(wb2, ws, 'التقرير'); XLSX.writeFile(wb2, filename); }
function renderTextToImage(text, { fontSize = 12, bold = false, color = '#111111', width = 200, height = 30, bgColor = null, align = 'right' } = {}) { const scale = 3; const canvas = document.createElement('canvas'); canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale); const ctx = canvas.getContext('2d'); ctx.scale(scale, scale); if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); } ctx.fillStyle = color; ctx.font = `${bold ? 'bold ' : ''}${fontSize}px "Segoe UI", Arial, "Noto Naskh Arabic", sans-serif`; ctx.direction = 'rtl'; ctx.textAlign = align === 'right' ? 'right' : align === 'left' ? 'left' : 'center'; ctx.textBaseline = 'middle'; const padding = 4; let x; if (align === 'right') x = width - padding; else if (align === 'left') x = padding; else x = width / 2; ctx.fillText(String(text ?? ''), x, height / 2); return canvas.toDataURL('image/png'); }
async function exportPDF(filename, reportTitle, headers, rows, subtitle = '') { const logoDataUrl = await getLogoBase64(); const reportDate = new Date().toLocaleDateString('ar-EG'); const jsPDFModule = await import('jspdf'); const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF; const autoTableModule = await import('jspdf-autotable'); const autoTable = autoTableModule.default; const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' }); const pageW = doc.internal.pageSize.getWidth(); const pageH = doc.internal.pageSize.getHeight(); const BLUE = [8, 101, 168]; const ORANGE = [245, 124, 0]; const drawHeader = () => { doc.setFillColor(...BLUE); doc.rect(0, 0, pageW, 34, 'F'); doc.setFillColor(...ORANGE); doc.rect(0, 34, pageW, 2.5, 'F'); if (logoDataUrl) { doc.setFillColor(255, 255, 255); doc.roundedRect(5, 4, 36, 26, 3, 3, 'F'); try { doc.addImage(logoDataUrl, 'PNG', 6, 5, 34, 24); } catch (_) { } } const titleImg = renderTextToImage(reportTitle, { fontSize: 17, bold: true, color: '#FFFFFF', width: 520, height: 44, align: 'center' }); doc.addImage(titleImg, 'PNG', pageW / 2 - 85, 3, 170, 17); if (subtitle) { const subImg = renderTextToImage(subtitle, { fontSize: 9, color: '#CCE4FF', width: 400, height: 28, align: 'center' }); doc.addImage(subImg, 'PNG', pageW / 2 - 55, 21, 110, 9); } const dateImg = renderTextToImage(reportDate, { fontSize: 8, color: '#BBDAFF', width: 160, height: 22, align: 'right' }); doc.addImage(dateImg, 'PNG', pageW - 58, 25, 52, 7); }; drawHeader(); autoTable(doc, { startY: 40, head: [headers], body: rows.map(r => r.map(c => String(c ?? ''))), theme: 'grid', styles: { font: 'helvetica', fontSize: 0.01, textColor: [255, 255, 255, 0], cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }, lineColor: [218, 218, 218], lineWidth: 0.3, minCellHeight: 10, valign: 'middle' }, headStyles: { fillColor: BLUE, textColor: [255, 255, 255, 0], minCellHeight: 12, lineColor: ORANGE, lineWidth: { bottom: 1.2, top: 0.3, left: 0.3, right: 0.3 } }, alternateRowStyles: { fillColor: [240, 246, 251] }, columnStyles: { 0: { cellWidth: 14 } }, margin: { top: 40, left: 8, right: 8, bottom: 16 }, didDrawCell: (data) => { const text = String(data.cell.raw ?? ''); if (!text || text.trim() === '') return; const { x, y, width: w, height: h } = data.cell; const isHeader = data.section === 'head'; const isFirstCol = data.column.index === 0; const align = isFirstCol ? 'center' : 'right'; const img = renderTextToImage(text, { fontSize: isHeader ? 10 : 9, bold: isHeader, color: isHeader ? '#FFFFFF' : '#1A1A1A', width: Math.max(Math.round(w * 3.5), 40), height: Math.max(Math.round(h * 3.5), 18), align }); try { doc.addImage(img, 'PNG', x + 0.5, y + 0.3, w - 1, h - 0.6); } catch (_) { } }, didDrawPage: (data) => { if (data.pageNumber > 1) drawHeader(); const pCount = doc.internal.getNumberOfPages(); doc.setFillColor(245, 247, 250); doc.rect(0, pageH - 12, pageW, 12, 'F'); doc.setDrawColor(...ORANGE); doc.setLineWidth(0.5); doc.line(8, pageH - 12, pageW - 8, pageH - 12); const mkFI = (t, w, a) => renderTextToImage(t, { fontSize: 7.5, color: '#666666', width: w, height: 18, align: a }); doc.addImage(mkFI('ICEMT — Al-Muqawiloon Al-Arab', 220, 'left'), 'PNG', 8, pageH - 10, 58, 6); doc.addImage(mkFI(`Page ${data.pageNumber} of ${pCount}`, 110, 'center'), 'PNG', pageW / 2 - 18, pageH - 10, 36, 6); doc.addImage(mkFI(reportDate, 140, 'right'), 'PNG', pageW - 52, pageH - 10, 44, 6); } }); doc.save(filename); }
async function exportWord(filename, reportTitle, subtitle, headers, rows) { const logoDataUrl = await getLogoBase64(); const reportDate = new Date().toLocaleDateString('ar-EG'); let logoBase64Raw = null, LOGO_W_EMU = 900000, LOGO_H_EMU = 600000; if (logoDataUrl) { logoBase64Raw = logoDataUrl.split(',')[1]; await new Promise(res => { const img = new Image(); img.onload = () => { const H = 600000; LOGO_H_EMU = H; LOGO_W_EMU = img.naturalHeight > 0 ? Math.round((img.naturalWidth / img.naturalHeight) * H) : 900000; res(); }; img.onerror = res; img.src = logoDataUrl; }); } try { const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, ShadingType, BorderStyle, VerticalAlign, PageOrientation, ImageRun } = await import('docx'); const CB = { top: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' } }; const totalDxa = 13440; const cw = Math.floor(totalDxa / headers.length); const colWidths = headers.map(() => cw); const mkTC = (text, isHdr, width, center = false) => new TableCell({ width: { size: width, type: WidthType.DXA }, shading: { fill: isHdr ? '0865a8' : 'FFFFFF', type: ShadingType.CLEAR }, borders: CB, margins: { top: 80, bottom: 80, left: 120, right: 120 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ bidirectional: true, alignment: center ? AlignmentType.CENTER : AlignmentType.RIGHT, children: [new TextRun({ text: String(text ?? ''), bold: isHdr, color: isHdr ? 'FFFFFF' : '1A1A1A', size: isHdr ? 22 : 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA', eastAsiaValue: 'ar-SA' } })] })] }); const logoRuns = []; if (logoBase64Raw && ImageRun) { try { logoRuns.push(new ImageRun({ data: logoBase64Raw, type: 'png', transformation: { width: 90, height: 60 } })); logoRuns.push(new TextRun({ text: '  ', size: 28 })); } catch (_) { } } const arabicPara = (text, opts = {}) => new Paragraph({ bidirectional: true, alignment: opts.center ? AlignmentType.CENTER : AlignmentType.RIGHT, spacing: opts.spacing, border: opts.border, shading: opts.shading, children: [new TextRun({ text, bold: opts.bold || false, color: opts.color || '111111', size: opts.size || 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA' }, ...(opts.italic ? { italics: true } : {}) })] }); const doc = new Document({ sections: [{ properties: { page: { size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 900, left: 720 } } }, children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, shading: { fill: '0865a8', type: ShadingType.CLEAR }, border: { bottom: { style: BorderStyle.THICK, size: 18, color: 'f57c00', space: 6 } }, spacing: { before: 0, after: 80 }, children: [...logoRuns, new TextRun({ text: reportTitle, color: 'FFFFFF', bold: true, size: 28, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA' } }), subtitle ? new TextRun({ text: `  —  ${subtitle}`, color: 'D0E8FF', size: 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' } }) : new TextRun({ text: '' })] }), arabicPara(`تاريخ التقرير: ${reportDate}   |   إجمالي السجلات: ${rows.length}`, { size: 18, color: '555555', italic: true, spacing: { before: 100, after: 100 } }), new Table({ width: { size: totalDxa, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => mkTC(h, true, colWidths[i], i === 0)) }), ...rows.map((row, ri) => new TableRow({ children: row.map((cell, ci) => new TableCell({ width: { size: colWidths[ci], type: WidthType.DXA }, shading: { fill: ri % 2 === 0 ? 'FFFFFF' : 'F0F6FB', type: ShadingType.CLEAR }, borders: CB, margins: { top: 70, bottom: 70, left: 110, right: 110 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ bidirectional: true, alignment: ci === 0 ? AlignmentType.CENTER : AlignmentType.RIGHT, children: [new TextRun({ text: String(cell ?? ''), size: 19, color: '222222', rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { eastAsia: 'ar-SA', value: 'ar-SA' } })] })] })) }))] })] }] }); const buffer = await Packer.toBuffer(doc); triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), filename); return; } catch (docxError) { console.warn('docx package not available:', docxError); } }

// ════════════════════════════════════════════════════════════════════════════
// DATA NORMALIZERS
// ════════════════════════════════════════════════════════════════════════════
function normalizeUser(u) {
    const rawName = u.firstName
        ? `${u.firstName} ${u.lastName ?? ''}`.trim()
        : (u.username ?? u.name ?? '');
    const parts = rawName.trim().split(' ');
    const userId = u.id ?? u.userId ?? u.user_id;
    const username = u.username ?? u.email ?? u.emailAddress ?? '';
    return {
        id: userId,
        username,
        firstName: u.firstName ?? u.first_name ?? parts[0] ?? '',
        lastName: u.lastName ?? u.last_name ?? parts.slice(1).join(' ') ?? '',
        email: u.email ?? u.emailAddress ?? u.email_address ?? '',
        enrolledCourses: (u.courses ?? u.enrolledCourses ?? []).map(c => {
            // ── API currently returns NO enrollment ID — only title + enrolledAt ──
            // enrollmentId will be null until backend adds it to the response.
            // We store username + title so toggleAttendance can pass them to the API.
            const enrollmentId =
                c.enrollmentId ?? c.EnrollmentId ?? c.enrollment_id ??
                c.enroll_id ?? c.enrollId ??
                c.registrationId ?? c.RegistrationId ?? c.registration_id ??
                c.regId ?? c.RegId ??
                null;

            const courseId =
                c.planworkId ?? c.PlanworkId ?? c.planwork_id ??
                c.courseId ?? c.CourseId ?? c.course_id ??
                c.serviceId ?? c.ServiceId ??
                null;

            const title = c.title ?? c.serviceTitle ?? c.courseName ?? c.planworkTitle ?? c.planwork_title ?? '—';

            return {
                enrollmentId,
                id: courseId,
                title,
                date: fmtDate(c.enrolledAt ?? c.date ?? ''),
                attended: !!(c.attended ?? c.isAttended ?? c.hasAttended ?? c.IsAttended ?? false),
                certificateUrl: c.certificateUrl ?? c.CertificateUrl ?? c.certificate_url ?? null,
                certificateName: c.certificateName ?? c.CertificateName ?? c.certificate_name ?? null,
                // Store for fallback API call when enrollmentId is missing
                _username: username,
                _title: title,
                _enrolledAt: c.enrolledAt ?? c.date ?? null,
            };
        }),
    };
}
function normalizeCourse(c) {
    return {
        id: c.id ?? c.courseId ?? c.planWorkId ?? c.planwork_id,
        title: c.title ?? c.serviceTitle ?? c.name ?? c.planWorkTitle ?? c.planwork_title ?? '—',
        category: c.category ?? c.type ?? c.courseType ?? c.planwork_category ?? '',
        enrolledUsers: (c.users ?? c.enrolledUsers ?? []).map(u => {
            const rawName2 = u.firstName
                ? `${u.firstName} ${u.lastName ?? ''}`.trim()
                : (u.username ?? u.name ?? '');
            const parts2 = rawName2.trim().split(' ');
            // API currently returns: username, email, enrolledAt — no enrollment ID
            const enrollmentId =
                c.enrollmentId ?? c.EnrollmentId ?? c.enrollment_id ?? null;
                u.enroll_id ?? u.enrollId ??
                u.registrationId ?? u.RegistrationId ?? u.registration_id ??
                u.regId ?? u.RegId ?? null;
            // في normalizeUser، فوق الـ enrolledCourses map أضف:
            console.log('RAW courses from API:', u.courses ?? u.enrolledCourses);
             return {
                enrollmentId,
                id: u.id ?? u.userId ?? u.user_id ?? null,
                username: u.username ?? u.email ?? '',
                firstName: u.firstName ?? u.first_name ?? parts2[0] ?? '',
                lastName: u.lastName ?? u.last_name ?? parts2.slice(1).join(' ') ?? '',
                email: u.email ?? '',
                date: fmtDate(u.enrolledAt ?? u.date ?? ''),
                attended: !!(u.attended ?? u.isAttended ?? u.hasAttended ?? u.IsAttended ?? false),
                certificateUrl: u.certificateUrl ?? u.CertificateUrl ?? u.certificate_url ?? null,
                certificateName: u.certificateName ?? u.CertificateName ?? u.certificate_name ?? null,
                _enrolledAt: u.enrolledAt ?? u.date ?? null,
            };
        }),
    };
}

function normalizeRefund(r) {
    return {
        id: r.id ?? r.Id,
        refNumber: r.refNumber ?? r.RefNumber ?? r.ref_number ?? '',
        orderId: r.orderId ?? r.OrderId ?? r.order_id ?? '',
        userId: r.userId ?? r.UserId ?? r.user_id,
        courseId: r.planworkId ?? r.PlanworkId ?? r.planwork_id ?? r.courseId ?? r.CourseId,
        amount: r.amount ?? r.Amount ?? 0,
        currency: r.currency ?? r.Currency ?? 'EGP',
        reason: r.reason ?? r.Reason ?? '',
        details: r.details ?? r.Details ?? r.notes ?? '',
        status: toStatusKey(r.status ?? r.Status ?? 'Pending'),
        bankName: r.bankName ?? r.BankName ?? r.bank_name ?? '',
        accountNumber: r.accountNumber ?? r.AccountNumber ?? r.account_number ?? '',
        accountHolder: r.accountHolder ?? r.AccountHolder ?? r.account_holder ?? '',
        iban: r.iban ?? r.IBAN ?? '',
        adminNote: r.adminNote ?? r.AdminNote ?? '',
        rejectionReason: r.rejectionReason ?? r.RejectionReason ?? '',
        requestedAt: fmtDate(r.requestedAt ?? r.RequestedAt ?? r.createdAt ?? r.CreatedAt),
        approvedAt: fmtDate(r.approvedAt ?? r.ApprovedAt),
        sentAt: fmtDate(r.sentAt ?? r.SentAt),
        rejectedAt: fmtDate(r.rejectedAt ?? r.RejectedAt),
        bankResult: r.bankResult ?? r.BankResult ?? null,
    };
}

function toStatusKey(s) {
    if (!s) return 'Pending';
    const map = {
        pending: 'Pending', approved: 'Approved',
        sent: 'Sent', sent_to_bank: 'Sent',
        rejected: 'Rejected',
    };
    return map[String(s).toLowerCase()] ?? s;
}

// ── FIX: returns YYYY-MM-DD only — no time component ────────────────────────
function fmtDate(val) {
    if (!val) return '';
    try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return String(val);
        return d.toISOString().split('T')[0]; // always "YYYY-MM-DD"
    } catch {
        return String(val);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const exportRef = useRef(null);

    // ── general ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [apiStats, setApiStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    // ── attendance — keyed by enrollmentId ───────────────────────────────────
    // { [enrollmentId]: boolean }  — seeded from API data, toggled via PUT
    const [attendance, setAttendance] = useState({});
    const [attendanceSaving, setAttendanceSaving] = useState({});
    const [attError, setAttError] = useState(null);
    const [attCourseFilter, setAttCourseFilter] = useState('all');
    const [attUserSearch, setAttUserSearch] = useState('');

    // ── certificates — keyed by enrollmentId ─────────────────────────────────
    // { [enrollmentId]: { name, url, size } }  — seeded from API, updated on upload
    const [certificates, setCertificates] = useState({});
    const [certUploading, setCertUploading] = useState({});
    const [certError, setCertError] = useState(null);
    const [certModal, setCertModal] = useState(null);
    const [certDragOver, setCertDragOver] = useState(false);
    const certFileInputRef = useRef(null);
    const [certSearch, setCertSearch] = useState('');

    // ── REFUND STATE ──────────────────────────────────────────────────────────
    const [refunds, setRefunds] = useState([]);
    const [refundsLoading, setRefundsLoading] = useState(false);
    const [refundsError, setRefundsError] = useState(null);
    const [refundStatusFilter, setRefundStatusFilter] = useState('all');
    const [refundSearch, setRefundSearch] = useState('');
    const [refundDetailModal, setRefundDetailModal] = useState(null);
    const [refundActionModal, setRefundActionModal] = useState(null);
    const [refundActionNote, setRefundActionNote] = useState('');
    const [refundActionSaving, setRefundActionSaving] = useState(false);
    const [refundActionError, setRefundActionError] = useState('');
    const [bankResultBanner, setBankResultBanner] = useState(null);

    // ════════════════════════════════════════════════════════════════════════
    // AUTH-AWARE FETCH HELPERS
    // ════════════════════════════════════════════════════════════════════════
    const authFetch = useCallback(async (url, options = {}) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });
    }, [getToken]);

    const authFetchForm = useCallback(async (url, formData) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        return fetch(url, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });
    }, [getToken]);

    // ════════════════════════════════════════════════════════════════════════
    // REFUND API HELPERS
    // ════════════════════════════════════════════════════════════════════════
    const fetchRefunds = useCallback(async (statusFilter = 'all') => {
        setRefundsLoading(true);
        setRefundsError(null);
        try {
            const qs = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
            const res = await authFetch(`${API_BASE}/refund/admin/all${qs}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const raw = Array.isArray(json) ? json
                : Array.isArray(json?.data) ? json.data
                    : Array.isArray(json?.items) ? json.items
                        : [];
            setRefunds(raw.map(normalizeRefund));
        } catch (err) {
            console.error('Refunds fetch error:', err);
            setRefundsError('فشل تحميل طلبات الاسترداد: ' + err.message);
        } finally {
            setRefundsLoading(false);
        }
    }, [authFetch]);

    const commitRefundAction = async () => {
        if (!refundActionModal) return;
        const { refund: r, action } = refundActionModal;

        if (action === 'reject' && !refundActionNote.trim()) return;

        setRefundActionSaving(true);
        setRefundActionError('');

        try {
            const endpoint = {
                approve: `${API_BASE}/refund/${r.id}/approve`,
                reject: `${API_BASE}/refund/${r.id}/reject`,
                send_to_bank: `${API_BASE}/refund/${r.id}/sent`,
            }[action];

            const body = {};
            if (action === 'reject') body.rejectionReason = refundActionNote.trim();
            if (action === 'approve') body.adminNote = refundActionNote.trim();
            if (action === 'send_to_bank') body.adminNote = refundActionNote.trim();

            const res = await authFetch(endpoint, {
                method: 'PUT',
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson?.message ?? errJson?.error ?? `HTTP ${res.status}`);
            }

            const updated = await res.json();
            const normalized = normalizeRefund(updated);

            setRefunds(prev => prev.map(x => x.id === r.id ? normalized : x));

            if (action === 'send_to_bank') {
                const bankRes = normalized.bankResult ?? updated?.bankResult ?? updated?.BankResult ?? null;
                if (bankRes === 'SUCCESS' || bankRes === 'success') {
                    setBankResultBanner({ type: 'success', refundId: r.id, msg: `✅ نجح التحويل البنكي — الفلوس رجعت على الكارت تلقائياً (${r.refNumber || r.id})` });
                } else if (bankRes === 'FAILED' || bankRes === 'failed') {
                    setBankResultBanner({ type: 'failed', refundId: r.id, msg: `⚠️ فشل التحويل البنكي — يتم التحويل يدوياً على IBAN: ${r.iban || '—'}` });
                }
                setTimeout(() => setBankResultBanner(null), 12000);
            }

            setRefundActionModal(null);
            setRefundActionNote('');

            if (refundDetailModal?.id === r.id) setRefundDetailModal(normalized);

        } catch (err) {
            console.error('Refund action error:', err);
            setRefundActionError(err.message || 'حدث خطأ أثناء تنفيذ الإجراء');
        } finally {
            setRefundActionSaving(false);
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    // AUTH GUARD
    // ════════════════════════════════════════════════════════════════════════
    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) {
            navigate('/');
        }
    }, [isLoaded, user, navigate]);

    // ════════════════════════════════════════════════════════════════════════
    // LOAD USERS / COURSES / STATS
    // ════════════════════════════════════════════════════════════════════════
    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                const _dbgToken = await getToken().catch(() => null);
                console.log('[AdminDashboard] token present:', !!_dbgToken,
                    _dbgToken ? `(${_dbgToken.slice(0, 24)}...)` : '(null)');

                const [usersRes, coursesRes, statsRes] = await Promise.all([
                    authFetch(`${API_BASE}/Admin/users`),
                    authFetch(`${API_BASE}/Admin/planworks`),
                    authFetch(`${API_BASE}/Admin/stats`),
                ]);

                let usersRaw = [], coursesRaw = [], statsRaw = null;

                if (usersRes.ok) {
                    const j = await usersRes.json();
                    usersRaw = Array.isArray(j) ? j : j?.data ?? j?.users ?? j?.result ?? [];
                } else {
                    const errText = await usersRes.text().catch(() => '');
                    console.error('Users API failed:', usersRes.status, errText);
                    setError(`Users API ${usersRes.status}: ${errText.slice(0, 200)}`);
                }
                if (coursesRes.ok) {
                    const j = await coursesRes.json();
                    coursesRaw = Array.isArray(j) ? j : j?.data ?? j?.planWorks ?? j?.planworks ?? j?.courses ?? j?.result ?? [];
                } else {
                    const errText = await coursesRes.text().catch(() => '');
                    console.error('Planworks API failed:', coursesRes.status, errText);
                }
                if (statsRes.ok) {
                    statsRaw = await statsRes.json();
                } else {
                    const errText = await statsRes.text().catch(() => '');
                    console.error('Stats API failed:', statsRes.status, errText);
                }

                const normalizedUsers = usersRaw
                    .map(u => normalizeUser(u))
                    .filter(u => u.id != null);

                const normalizedCourses = coursesRaw
                    .map(c => normalizeCourse(c))
                    .filter(c => c.id != null);

                setUsersData(normalizedUsers);
                setCoursesData(normalizedCourses);
                setApiStats(statsRaw);

                // ── Seed attendance & certificates from API data ──────────
                seedAttendance(normalizedUsers);
                seedCertificates(normalizedUsers);
            } catch (err) {
                setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };
        if (isLoaded && user) load();
    }, [isLoaded, user, authFetch]);

    // ── Load refunds when tab opens ──────────────────────────────────────────
    useEffect(() => {
        if (activeTab === 'refunds') fetchRefunds();
    }, [activeTab, fetchRefunds]);

    // ── Re-fetch when status filter changes ──────────────────────────────────
    useEffect(() => {
        if (activeTab === 'refunds') fetchRefunds(refundStatusFilter);
    }, [refundStatusFilter]); // eslint-disable-line

    // ── Close export menu on outside click ──────────────────────────────────
    useEffect(() => {
        const h = e => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportMenuOpen(false); };
        document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);

    // ════════════════════════════════════════════════════════════════════════
    // ATTENDANCE — PUT /api/Admin/enrollments/{enrollmentId}/attendance
    // NOTE: The API currently does NOT return enrollmentId in enrollment objects.
    // Until the backend adds it, we use a composite key (username|title) to track
    // local state, and pass username+title in the request body as identifiers.
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Build a stable key for the attendance/cert maps.
     * Prefers enrollmentId, falls back to "username|title".
     */
    const attKey = (enrollmentId, username, title) =>
        enrollmentId != null ? String(enrollmentId) : `${username}|${title}`;

    /**
     * Seed attendance map from already-loaded usersData.
     */
    const seedAttendance = useCallback((users) => {
        const map = {};
        users.forEach(u => {
            u.enrolledCourses.forEach(c => {
                const k = attKey(c.enrollmentId, c._username ?? u.username ?? u.email, c.title);
                map[k] = !!c.attended;
            });
        });
        setAttendance(map);
    }, []);

    const toggleAttendance = async (enrollmentId, username, title, currentVal) => {
        const k = attKey(enrollmentId, username, title);
        const newVal = !currentVal;

        setAttendance(p => ({ ...p, [k]: newVal }));
        setAttendanceSaving(p => ({ ...p, [k]: true }));
        setAttError(null);

        try {
            if (enrollmentId == null) {
                throw new Error('enrollmentId غير موجود');
            }

            const res = await authFetch(
                `${API_BASE}/Admin/enrollments/${enrollmentId}/attendance`,
                {
                    method: 'PATCH',           // ← PATCH مش PUT
                    body: JSON.stringify(newVal) // ← boolean مباشرة مش object
                }
            );

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson?.message ?? `HTTP ${res.status}`);
            }
        } catch (err) {
            setAttendance(p => ({ ...p, [k]: currentVal }));
            setAttError('فشل تحديث الحضور: ' + err.message);
        } finally {
            setAttendanceSaving(p => ({ ...p, [k]: false }));
        }
    };
    // ════════════════════════════════════════════════════════════════════════
    // CERTIFICATES — POST /api/Admin/upload
    // Seed cert map from usersData after load
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Seed certificates map from already-loaded usersData.
     * Each enrollment that already has a certificateUrl is pre-populated.
     */
    const seedCertificates = useCallback((users) => {
        const map = {};
        users.forEach(u => {
            u.enrolledCourses.forEach(c => {
                if (c.enrollmentId != null && c.certificateUrl) {
                    map[c.enrollmentId] = {
                        name: c.certificateName || 'certificate',
                        url: c.certificateUrl,
                        size: null,
                    };
                }
            });
        });
        setCertificates(map);
    }, []);

    const handleCertFile = async (enrollmentId, certKey, file) => {
        if (!file) return;
        setCertUploading(p => ({ ...p, [certKey]: true }));
        setCertError(null);
        try {
            const fd = new FormData();
            fd.append('file', file);
            if (enrollmentId != null) fd.append('enrollmentId', enrollmentId);

            const res = await authFetchForm(`${API_BASE}/Admin/upload`, fd);
            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson?.message ?? errJson?.error ?? `HTTP ${res.status}`);
            }
            const data = await res.json();
            const url = data.url ?? data.certificateUrl ?? data.fileUrl ?? data.path ?? null;
            const name = data.name ?? data.fileName ?? data.filename ?? file.name;
            if (!url) throw new Error('لم يُعَد رابط الشهادة من السيرفر');
            setCertificates(p => ({ ...p, [certKey]: { name, url, size: file.size } }));
        } catch (err) {
            console.error('Certificate upload failed:', err);
            setCertError('فشل رفع الشهادة: ' + err.message);
        } finally {
            setCertUploading(p => ({ ...p, [certKey]: false }));
            setCertModal(null);
        }
    };

    const removeCert = (certKey) => {
        setCertificates(p => { const n = { ...p }; delete n[certKey]; return n; });
    };

    // ════════════════════════════════════════════════════════════════════════
    // DERIVED DATA
    // ════════════════════════════════════════════════════════════════════════

    /**
     * ── FIX: inRange ─────────────────────────────────────────────────────────
     * Rules:
     *  1. No filter active → show everything (with or without date).
     *  2. Filter active + record has no date → EXCLUDE (was the bug: used to include).
     *  3. Filter active + record has date → compare date-only strings (YYYY-MM-DD).
     *     "dateTo" is inclusive, so we extend it to end-of-day by advancing one day.
     */
    const inRange = d => {
        // No filter active — show all records regardless of date
        if (!dateFrom && !dateTo) return true;

        // Filter is active but record has no date → exclude
        if (!d) return false;

        const dt = new Date(d);
        if (isNaN(dt.getTime())) return false;

        // "From" boundary — record must be >= dateFrom
        if (dateFrom && dt < new Date(dateFrom)) return false;

        // "To" boundary — record must be <= dateTo (inclusive)
        // new Date('2026-02-23') = midnight UTC = start of that day
        // so we add 1 day to make the entire chosen day inclusive
        if (dateTo) {
            const toEnd = new Date(dateTo);
            toEnd.setDate(toEnd.getDate() + 1); // advance to start of next day
            if (dt >= toEnd) return false;
        }

        return true;
    };

    const q = searchQuery.toLowerCase();
    const filteredUsers = usersData
        .map(u => ({ ...u, enrolledCourses: u.enrolledCourses.filter(c => inRange(c.date)) }))
        .filter(u => {
            const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q);
            // When a date filter is active, only show users who have at least one matching course
            if ((dateFrom || dateTo) && u.enrolledCourses.length === 0) return false;
            return matchSearch;
        });

    const filteredCourses = coursesData
        .map(c => ({ ...c, enrolledUsers: c.enrolledUsers.filter(u => inRange(u.date)) }))
        .filter(c => {
            const matchSearch = `${c.title} ${c.category}`.toLowerCase().includes(q);
            // When a date filter is active, only show courses that have at least one matching user
            if ((dateFrom || dateTo) && c.enrolledUsers.length === 0) return false;
            return matchSearch;
        });

    const attRows = usersData.flatMap(u => u.enrolledCourses.map(c => ({ user: u, course: c }))).filter(r => {
        const mc = attCourseFilter === 'all' || r.course.id === Number(attCourseFilter);
        const mu = `${r.user.firstName} ${r.user.lastName} ${r.user.email}`.toLowerCase().includes(attUserSearch.toLowerCase());
        return mc && mu;
    });
    // Use composite key (enrollmentId or username|title) for attendance lookup
    const attCount = attRows.filter(r => {
        const k = attKey(r.course.enrollmentId, r.course._username ?? r.user.username ?? r.user.email, r.course.title);
        return attendance[k];
    }).length;
    // certRows uses composite key (enrollmentId or username|title)
    const certRows = usersData.flatMap(u => u.enrolledCourses.map(c => ({
        user: u,
        course: c,
        enrollmentId: c.enrollmentId,
        certKey: attKey(c.enrollmentId, c._username ?? u.username ?? u.email, c.title),
    }))).filter(r =>
        `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.course.title}`.toLowerCase().includes(certSearch.toLowerCase())
    );
    const totalCerts = Object.keys(certificates).length;
    const totalEnrollments = usersData.reduce((s, u) => s + u.enrolledCourses.length, 0);

    const gs = (fields, fb) => { if (!apiStats) return fb; for (const f of fields) { if (apiStats[f] != null) return apiStats[f]; } return fb; };
    const displayStats = {
        users: gs(['totalUsers', 'usersCount', 'users', 'userCount'], usersData.length),
        courses: gs(['totalCourses', 'coursesCount', 'courses', 'courseCount', 'totalPlanWorks', 'planWorksCount'], coursesData.length),
        enrollments: gs(['totalEnrollments', 'enrollmentsCount', 'enrollments', 'registrations', 'totalRegistrations'], totalEnrollments),
        attended: gs(['totalAttended', 'attendedCount', 'attended'], attCount),
        certificates: gs(['certificatesCount'], totalCerts),
        refundsPending: gs(['pendingRefunds', 'refundsPending', 'pendingRefundsCount'], refunds.filter(r => r.status === 'Pending').length),
    };

    const refundSearch_q = refundSearch.toLowerCase();
    const filteredRefunds = refunds.filter(r => {
        const u = usersData.find(u => u.id === r.userId);
        const c = coursesData.find(c => c.id === r.courseId);
        const matchStatus = refundStatusFilter === 'all' || r.status === toStatusKey(refundStatusFilter);
        const matchSearch = !refundSearch_q || [
            r.refNumber, r.orderId, r.reason,
            u ? `${u.firstName} ${u.lastName}` : '',
            c?.title ?? '',
            String(r.amount),
        ].join(' ').toLowerCase().includes(refundSearch_q);
        return matchStatus && matchSearch;
    });

    const refundStats = {
        total: refunds.length,
        pending: refunds.filter(r => r.status === 'Pending').length,
        approved: refunds.filter(r => r.status === 'Approved').length,
        sent: refunds.filter(r => r.status === 'Sent').length,
        rejected: refunds.filter(r => r.status === 'Rejected').length,
        totalAmount: refunds.filter(r => r.status !== 'Rejected').reduce((s, r) => s + (r.amount || 0), 0),
    };

    const refundUserLookup = id => usersData.find(u => u.id === id) ?? { firstName: '—', lastName: '', email: '—' };
    const refundCourseLookup = id => coursesData.find(c => c.id === id) ?? { title: '—' };

    // ════════════════════════════════════════════════════════════════════════
    // EXPORT
    // ════════════════════════════════════════════════════════════════════════
    const withExport = fn => async () => {
        setExporting(true); setExportMenuOpen(false); setExportError(null);
        try { await fn(); } catch (e) { console.error(e); setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); }
        finally { setExporting(false); }
    };
    const doExcel = withExport(async () => { const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); await exportExcel(activeTab === 'users' ? 'المستخدمون-والدورات.xlsx' : 'الدورات-والمستخدمون.xlsx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows); });
    const doPDF = withExport(async () => { const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); await exportPDF(activeTab === 'users' ? 'تقرير-المستخدمين.pdf' : 'تقرير-الدورات.pdf', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows, 'ICEMT'); });
    const doWord = withExport(async () => { const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); await exportWord(activeTab === 'users' ? 'تقرير-المستخدمين.docx' : 'تقرير-الدورات.docx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', 'ICEMT', headers, rows); });
    const doPrint = () => { window.print(); setExportMenuOpen(false); };

    // ════════════════════════════════════════════════════════════════════════
    // EARLY RETURNS
    // ════════════════════════════════════════════════════════════════════════
    if (!isLoaded || !user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg,#f5f7fa 0%,#e8eef5 100%)' }}>
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
        { id: 'refunds', label: 'المستردات', icon: '💳', color: 'red' },
    ];

    const STATS = [
        { label: 'المستخدمون', value: displayStats.users, icon: '👤', accent: '#0865a8', bg: 'rgba(8,101,168,0.08)', border: 'rgba(8,101,168,0.2)' },
        { label: 'الدورات', value: displayStats.courses, icon: '📚', accent: '#f57c00', bg: 'rgba(245,124,0,0.08)', border: 'rgba(245,124,0,0.2)' },
        { label: 'التسجيلات', value: displayStats.enrollments, icon: '🔗', accent: '#1a1a2e', bg: 'rgba(26,26,46,0.06)', border: 'rgba(26,26,46,0.15)' },
        { label: 'حضروا', value: displayStats.attended, icon: '🎓', accent: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)' },
        { label: 'الشهادات', value: displayStats.certificates, icon: '📜', accent: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
        { label: 'المستردات', value: displayStats.refundsPending, icon: '💳', accent: '#dc2626', bg: 'rgba(220,38,38,0.07)', border: 'rgba(220,38,38,0.2)' },
    ];

    // ════════════════════════════════════════════════════════════════════════
    // RENDER
    // ════════════════════════════════════════════════════════════════════════
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes d-spin   {to{transform:rotate(360deg)}}
        @keyframes d-fadeUp {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes d-slideIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes d-pulse  {0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes d-slideDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}

        :root{
          --blue:#0865a8;--blue-lt:#e8f1f9;--blue-md:rgba(8,101,168,0.12);
          --orange:#f57c00;--orng-lt:#fff3e0;--orng-md:rgba(245,124,0,0.12);
          --red:#dc2626;--red-lt:#fef2f2;--red-md:rgba(220,38,38,0.1);
          --black:#111827;--gray1:#374151;--gray2:#6b7280;--gray3:#9ca3af;--gray4:#d1d5db;--gray5:#e5e7eb;
          --white:#ffffff;--bg:linear-gradient(135deg,#f5f7fa 0%,#e8eef5 100%);--bg-flat:#f5f7fa;
          --card-bg:#ffffff;--card-border:#e5e7eb;
          --sidebar-w:200px;
          --nav-h:${NAVBAR_H + OVERVIEW_H}px;
          --font:"Droid Arabic Kufi",serif;--radius:12px;
          --shadow:0 2px 16px rgba(8,101,168,0.08),0 1px 4px rgba(0,0,0,0.05);
          --shadow-md:0 4px 24px rgba(8,101,168,0.12),0 2px 8px rgba(0,0,0,0.06);
        }
        .d-root{font-family:var(--font);direction:rtl;min-height:100vh;background:var(--bg);padding-top:var(--nav-h);color:var(--black);display:flex;}
        ._ovr{position:fixed;top:${NAVBAR_H}px;left:0;z-index:1050;width:100%;background:#fff;border-bottom:2px solid var(--orange);padding:7px 20px;text-align:center;font-family:var(--font);font-size:clamp(0.7rem,1.3vw,0.78rem);color:var(--gray1);box-shadow:0 1px 6px rgba(0,0,0,0.06);}
        ._ovr a{margin-left:10px;color:var(--blue);text-decoration:none;font-weight:700;}
        ._ovr .sep{color:var(--gray3);margin:0 4px;}._ovr .cur{margin-right:10px;color:var(--gray2);}
        .d-sidebar{position:fixed;top:var(--nav-h);right:0;width:var(--sidebar-w);height:calc(100vh - var(--nav-h));background:var(--white);border-left:1.5px solid var(--card-border);box-shadow:-2px 0 12px rgba(8,101,168,0.06);display:flex;flex-direction:column;overflow:hidden;z-index:200;transition:width .25s ease;}
        .d-sidebar-brand{padding:16px 12px;border-bottom:1.5px solid var(--card-border);display:flex;align-items:center;gap:10px;background:var(--blue);flex-shrink:0;}
        .d-sb-logo{width:34px;height:34px;object-fit:contain;filter:brightness(0) invert(1);flex-shrink:0;}
        .d-sb-title{min-width:0;overflow:hidden;}
        .d-sb-name{font-size:.82rem;font-weight:900;color:#fff;white-space:nowrap;letter-spacing:.3px;}
        .d-sb-sub{font-size:.6rem;color:rgba(255,255,255,.55);margin-top:2px;white-space:nowrap;}
        .d-sidebar-user{padding:12px;border-bottom:1.5px solid var(--card-border);display:flex;align-items:center;gap:10px;background:var(--blue-lt);flex-shrink:0;}
        .d-su-av{width:34px;height:34px;border-radius:9px;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;color:#fff;flex-shrink:0;border:2px solid rgba(8,101,168,.2);}
        .d-su-info{flex:1;min-width:0;overflow:hidden;}
        .d-su-name{font-size:.74rem;font-weight:700;color:var(--black);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .d-su-role{display:inline-flex;align-items:center;gap:3px;margin-top:2px;padding:1px 7px;background:var(--orng-lt);border:1px solid rgba(245,124,0,.3);border-radius:20px;font-size:.58rem;color:var(--orange);font-weight:700;}
        .d-sidebar-nav{flex:1;padding:10px 8px;overflow-y:auto;overflow-x:hidden;}
        .d-sidebar-nav::-webkit-scrollbar{width:3px;}.d-sidebar-nav::-webkit-scrollbar-thumb{background:var(--gray4);border-radius:2px;}
        .d-nav-section{margin-bottom:6px;}
        .d-nav-label{font-size:.58rem;font-weight:700;color:var(--gray3);letter-spacing:1.2px;text-transform:uppercase;padding:0 8px;margin-bottom:4px;}
        .d-nav-btn{width:100%;display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:9px;border:1.5px solid transparent;background:transparent;color:var(--gray2);font-family:var(--font);font-size:.78rem;font-weight:700;cursor:pointer;transition:all .16s;text-align:right;margin-bottom:2px;white-space:nowrap;overflow:hidden;position:relative;}
        .d-nav-btn:hover{background:var(--blue-lt);color:var(--blue);border-color:rgba(8,101,168,.15);}
        .d-nav-btn.active{background:var(--blue-md);color:var(--blue);border-color:rgba(8,101,168,.3);}
        .d-nav-btn.active.gr{background:rgba(22,163,74,.1);color:#16a34a;border-color:rgba(22,163,74,.3);}
        .d-nav-btn.active.pu{background:rgba(124,58,237,.1);color:#7c3aed;border-color:rgba(124,58,237,.3);}
        .d-nav-btn.active.rd{background:rgba(220,38,38,.08);color:#dc2626;border-color:rgba(220,38,38,.3);}
        .d-nav-btn.active::after{content:'';position:absolute;right:0;top:0;bottom:0;width:3px;background:var(--blue);border-radius:2px 0 0 2px;}
        .d-nav-btn.active.gr::after{background:#16a34a;}.d-nav-btn.active.pu::after{background:#7c3aed;}.d-nav-btn.active.rd::after{background:#dc2626;}
        .d-nav-icon{font-size:.9rem;flex-shrink:0;}
        .d-nav-label-text{flex:1;text-align:right;overflow:hidden;text-overflow:ellipsis;}
        .d-nav-badge{margin-right:auto;padding:1px 6px;border-radius:9px;font-size:.58rem;font-weight:900;background:var(--orng-lt);color:var(--orange);border:1px solid rgba(245,124,0,.3);flex-shrink:0;}
        .d-nav-badge.rd{background:var(--red-lt);color:var(--red);border-color:rgba(220,38,38,.3);animation:d-pulse 2s ease infinite;}
        .d-sidebar-footer{padding:10px 12px;border-top:1.5px solid var(--card-border);font-size:.6rem;color:var(--gray3);text-align:center;background:var(--bg-flat);flex-shrink:0;}
        .d-main{margin-right:var(--sidebar-w);flex:1;min-width:0;padding:clamp(14px,2.5vw,28px) clamp(12px,2.5vw,28px) clamp(32px,5vw,56px);animation:d-fadeUp .28s ease;}
        .d-page-hdr{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:clamp(16px,2.5vw,28px);padding-bottom:clamp(14px,2vw,20px);border-bottom:1.5px solid var(--gray5);}
        .d-page-title{font-size:clamp(1rem,2.5vw,1.4rem);font-weight:900;color:var(--black);line-height:1.2;}
        .d-page-sub{font-size:clamp(.66rem,1.2vw,.74rem);color:var(--gray2);margin-top:4px;}
        .d-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(110px,14vw,150px),1fr));gap:clamp(8px,1.5vw,14px);margin-bottom:clamp(16px,2.5vw,26px);}
        .d-sc{background:var(--white);border-radius:var(--radius);padding:clamp(14px,2vw,18px) clamp(12px,2vw,16px);border:1.5px solid var(--card-border);box-shadow:var(--shadow);position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;cursor:default;}
        .d-sc:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
        .d-sc::after{content:attr(data-icon);position:absolute;left:-4px;bottom:-6px;font-size:clamp(1.8rem,4vw,2.5rem);opacity:.06;pointer-events:none;transform:rotate(-10deg);}
        .d-sc-val{font-size:clamp(1.5rem,3.5vw,2rem);font-weight:900;line-height:1;font-family:'Courier New',monospace;}
        .d-sc-lbl{font-size:clamp(.62rem,1.1vw,.7rem);margin-top:5px;color:var(--gray2);font-weight:700;}
        .d-sc-bar{height:3px;border-radius:2px;margin-top:10px;width:40%;opacity:.6;}
        .d-toolbar{display:flex;align-items:center;gap:clamp(6px,1.2vw,10px);flex-wrap:wrap;margin-bottom:clamp(12px,2vw,18px);background:var(--white);border:1.5px solid var(--card-border);border-radius:var(--radius);padding:clamp(9px,1.5vw,13px) clamp(12px,2vw,16px);box-shadow:var(--shadow);}
        .d-search{flex:1;min-width:clamp(140px,18vw,200px);position:relative;}
        .d-search input{width:100%;padding:clamp(7px,1.2vw,10px) 36px clamp(7px,1.2vw,10px) clamp(10px,1.5vw,14px);border-radius:9px;border:1.5px solid var(--gray4);background:var(--bg-flat);color:var(--black);font-family:var(--font);font-size:clamp(.72rem,1.3vw,.8rem);outline:none;direction:rtl;transition:border .18s,background .18s;}
        .d-search input::placeholder{color:var(--gray3);}.d-search input:focus{border-color:var(--blue);background:#fff;}
        .d-search::after{content:'🔍';position:absolute;right:11px;top:50%;transform:translateY(-50%);font-size:.7rem;pointer-events:none;opacity:.5;}
        .d-expw{position:relative;}
        .d-expbtn{display:flex;align-items:center;gap:6px;padding:clamp(7px,1.2vw,10px) clamp(12px,2vw,18px);background:var(--orange);color:#fff;border:none;border-radius:9px;font-family:var(--font);font-size:clamp(.72rem,1.3vw,.8rem);font-weight:700;cursor:pointer;white-space:nowrap;transition:all .18s;box-shadow:0 3px 12px rgba(245,124,0,.3);}
        .d-expbtn:hover{background:#e65100;transform:translateY(-1px);}.d-expbtn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
        .d-expmenu{position:absolute;top:calc(100% + 6px);left:0;background:var(--white);border:1.5px solid var(--card-border);border-radius:11px;box-shadow:0 8px 32px rgba(0,0,0,.12);overflow:hidden;z-index:400;min-width:185px;animation:d-slideIn .15s ease;}
        .d-expitem{display:flex;align-items:center;gap:9px;width:100%;padding:clamp(9px,1.8vw,12px) clamp(12px,2vw,16px);background:none;border:none;border-bottom:1px solid var(--gray5);font-family:var(--font);font-size:clamp(.72rem,1.3vw,.8rem);font-weight:700;color:var(--gray1);direction:rtl;cursor:pointer;transition:background .12s,color .12s;}
        .d-expitem:last-child{border-bottom:none;}.d-expitem:hover{background:var(--blue-lt);color:var(--blue);}
        .d-filter{display:flex;align-items:center;gap:clamp(6px,1.2vw,12px);flex-wrap:wrap;background:var(--white);border:1.5px solid var(--card-border);border-radius:var(--radius);padding:clamp(9px,1.5vw,12px) clamp(12px,2vw,16px);margin-bottom:clamp(12px,2vw,18px);box-shadow:var(--shadow);}
        .d-flbl{font-size:clamp(.68rem,1.2vw,.76rem);font-weight:700;color:var(--gray2);white-space:nowrap;}
        .d-fsm{font-size:clamp(.64rem,1.1vw,.7rem);color:var(--gray3);}
        .d-fdate{padding:clamp(5px,1vw,8px) clamp(7px,1.2vw,11px);border-radius:8px;border:1.5px solid var(--gray4);background:var(--bg-flat);color:var(--black);font-family:var(--font);font-size:clamp(.7rem,1.2vw,.78rem);outline:none;direction:ltr;transition:border .18s;}
        .d-fdate:focus{border-color:var(--blue);background:#fff;}
        .d-fsel{padding:clamp(5px,1vw,8px) clamp(7px,1.2vw,11px);border-radius:8px;border:1.5px solid var(--gray4);background:var(--bg-flat);color:var(--black);font-family:var(--font);font-size:clamp(.7rem,1.2vw,.78rem);outline:none;cursor:pointer;}
        .d-fbadge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;background:var(--orng-lt);border:1px solid rgba(245,124,0,.3);color:var(--orange);font-size:clamp(.62rem,1.1vw,.7rem);font-weight:700;}
        .d-fclear{padding:clamp(4px,.9vw,7px) clamp(9px,1.5vw,12px);border-radius:8px;background:var(--bg-flat);border:1.5px solid var(--gray4);font-family:var(--font);font-size:clamp(.64rem,1.1vw,.72rem);font-weight:700;cursor:pointer;color:var(--gray2);transition:all .16s;}
        .d-fclear:hover{border-color:var(--orange);color:var(--orange);background:var(--orng-lt);}
        .d-err{background:#fef2f2;border:1.5px solid rgba(220,38,38,.3);color:#dc2626;border-radius:9px;padding:clamp(8px,1.5vw,11px) clamp(10px,2vw,14px);margin-bottom:14px;font-size:clamp(.7rem,1.3vw,.78rem);display:flex;align-items:center;gap:9px;}
        .d-card{background:var(--white);border-radius:var(--radius);border:1.5px solid var(--card-border);overflow:hidden;box-shadow:var(--shadow);}
        .d-tscr{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .d-tbl{width:100%;border-collapse:collapse;min-width:480px;}
        .d-tbl thead th{background:var(--blue);color:#fff;padding:clamp(10px,1.8vw,14px) clamp(10px,2vw,18px);font-family:var(--font);font-size:clamp(.68rem,1.2vw,.76rem);font-weight:700;text-align:right;white-space:nowrap;border-bottom:3px solid var(--orange);letter-spacing:.3px;}
        .d-tbl thead th.gr{background:#16a34a;border-bottom-color:#86efac;}
        .d-tbl thead th.pu{background:#7c3aed;border-bottom-color:#c4b5fd;}
        .d-tbl thead th.rd{background:#dc2626;border-bottom-color:#fca5a5;}
        .d-tbl thead th.c{text-align:center;}
        .d-tbl tbody tr{border-bottom:1px solid var(--gray5);transition:background .12s;}
        .d-tbl tbody tr:last-child{border-bottom:none;}.d-tbl tbody tr:hover{background:var(--blue-lt);}.d-tbl tbody tr.xopen{background:var(--blue-lt);}
        .d-tbl tbody tr:nth-child(even){background:#fafbfc;}.d-tbl tbody tr:nth-child(even):hover{background:var(--blue-lt);}
        .d-tbl td{padding:clamp(9px,1.6vw,13px) clamp(10px,2vw,18px);font-family:var(--font);font-size:clamp(.69rem,1.25vw,.78rem);color:var(--gray1);vertical-align:middle;}
        .d-av{width:clamp(28px,3.5vw,36px);height:clamp(28px,3.5vw,36px);border-radius:9px;background:var(--blue);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(.58rem,1vw,.66rem);flex-shrink:0;border:2px solid rgba(8,101,168,.2);}
        .d-av.or{background:var(--orange);border-color:rgba(245,124,0,.2);}.d-av.sm{width:24px;height:24px;border-radius:7px;font-size:.58rem;}.d-av.rd{background:#dc2626;border-color:rgba(220,38,38,.2);}
        .d-uc{display:flex;align-items:center;gap:9px;}.d-uname{font-weight:700;color:var(--black);}
        .d-cb{display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;border-radius:7px;background:var(--blue-lt);border:1.5px solid rgba(8,101,168,.25);color:var(--blue);font-size:clamp(.62rem,1.1vw,.7rem);font-weight:900;padding:0 6px;font-family:'Courier New',monospace;}
        .d-cb.or{background:var(--orng-lt);border-color:rgba(245,124,0,.3);color:var(--orange);}
        .d-pill{display:inline-block;padding:4px 12px;border-radius:7px;font-size:clamp(.62rem,1.1vw,.7rem);font-weight:700;cursor:pointer;border:1.5px solid rgba(8,101,168,.3);color:var(--blue);background:var(--blue-lt);user-select:none;transition:all .14s;font-family:var(--font);}
        .d-pill:hover,.d-pill.op{background:var(--blue-md);border-color:rgba(8,101,168,.6);}
        .d-pill.or{border-color:rgba(245,124,0,.3);color:var(--orange);background:var(--orng-lt);}
        .d-pill.or:hover,.d-pill.or.op{background:var(--orng-md);border-color:rgba(245,124,0,.6);}
        .d-cat{display:inline-block;padding:2px 9px;border-radius:6px;font-size:clamp(.6rem,1.05vw,.68rem);font-weight:700;background:var(--orng-lt);color:var(--orange);border:1px solid rgba(245,124,0,.25);}
        .d-xrow td{padding:0!important;border:none;}
        .d-xin{padding:clamp(12px,2vw,16px) clamp(14px,2.5vw,22px);display:flex;flex-wrap:wrap;gap:clamp(7px,1.3vw,11px);background:var(--blue-lt);border-top:2px solid rgba(8,101,168,.15);}
        .d-mc{background:var(--white);border-radius:10px;padding:clamp(9px,1.8vw,13px) clamp(10px,2vw,14px);border:1.5px solid var(--gray5);min-width:clamp(150px,20vw,200px);flex:1 1 150px;max-width:260px;transition:border-color .14s;box-shadow:var(--shadow);}
        .d-mc:hover{border-color:rgba(8,101,168,.3);}
        .d-mt{font-size:clamp(.7rem,1.25vw,.78rem);font-weight:700;color:var(--blue);margin-bottom:2px;}.d-mt.or{color:var(--orange);}
        .d-ms{font-size:clamp(.63rem,1.1vw,.7rem);color:var(--gray2);}.d-md{font-size:clamp(.6rem,1vw,.66rem);color:var(--gray3);margin-top:4px;}
        .d-empty{text-align:center;padding:clamp(40px,8vw,70px) 20px;}.d-emi{font-size:clamp(1.8rem,4vw,2.5rem);margin-bottom:12px;opacity:.35;}.d-empty p{color:var(--gray3);font-size:clamp(.74rem,1.4vw,.82rem);}
        .d-ld{text-align:center;padding:clamp(50px,10vw,80px) 20px;}.d-sp{width:clamp(32px,4.5vw,42px);height:clamp(32px,4.5vw,42px);border:3px solid var(--gray5);border-top-color:var(--blue);border-radius:50%;animation:d-spin .7s linear infinite;margin:0 auto clamp(12px,2vw,18px);}.d-ld p{color:var(--gray3);font-size:clamp(.72rem,1.3vw,.8rem);}
        .d-ovl{position:fixed;inset:0;background:rgba(245,247,250,.85);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);}
        .d-ovlb{background:var(--white);border-radius:18px;padding:clamp(28px,5vw,44px) clamp(44px,7vw,64px);text-align:center;box-shadow:0 16px 48px rgba(8,101,168,.18);border:2px solid rgba(8,101,168,.15);}
        .d-ovlb p{font-size:clamp(.78rem,1.5vw,.86rem);margin-top:14px;color:var(--gray2);font-family:var(--font);}
        .d-chk{width:22px;height:22px;border-radius:6px;border:2px solid var(--gray4);background:var(--bg-flat);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .16s;flex-shrink:0;font-size:.75rem;color:transparent;}
        .d-chk:hover{border-color:#16a34a;background:#f0fdf4;}.d-chk.on{background:#f0fdf4;border-color:#16a34a;color:#16a34a;}.d-chk.spin{border-color:#16a34a;border-top-color:transparent;border-radius:50%;animation:d-spin .6s linear infinite;}
        .d-att-badge{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:7px;font-size:clamp(.62rem,1.1vw,.7rem);font-weight:700;}
        .d-att-badge.on{background:#f0fdf4;color:#16a34a;border:1px solid #86efac;}.d-att-badge.off{background:var(--bg-flat);color:var(--gray3);border:1px solid var(--gray4);}
        .d-att-sum{display:flex;align-items:center;gap:clamp(10px,2vw,20px);flex-wrap:wrap;background:#f0fdf4;border:1.5px solid #86efac;border-radius:var(--radius);padding:clamp(9px,1.8vw,13px) clamp(12px,2vw,18px);margin-bottom:clamp(12px,2vw,18px);box-shadow:var(--shadow);}
        .d-att-sum span{font-size:clamp(.7rem,1.3vw,.78rem);font-weight:700;color:#15803d;}
        .d-prog-wrap{flex:1;min-width:100px;height:6px;background:#bbf7d0;border-radius:3px;overflow:hidden;}.d-prog-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#16a34a,#22c55e);transition:width .5s ease;}
        .d-cert-grid{display:grid;gap:clamp(9px,1.8vw,13px);padding:clamp(12px,2vw,18px);grid-template-columns:repeat(auto-fill,minmax(clamp(260px,30vw,320px),1fr));}
        .d-cert-card{background:var(--white);border-radius:12px;padding:clamp(11px,2vw,15px) clamp(12px,2vw,16px);border:1.5px solid var(--card-border);display:flex;align-items:center;gap:clamp(9px,1.5vw,12px);transition:border-color .16s,box-shadow .16s;box-shadow:var(--shadow);}
        .d-cert-card:hover{border-color:rgba(124,58,237,.3);box-shadow:0 4px 16px rgba(124,58,237,.1);}
        .d-cert-icon{width:clamp(36px,4.5vw,44px);height:clamp(36px,4.5vw,44px);border-radius:10px;background:rgba(124,58,237,.08);border:1.5px solid rgba(124,58,237,.2);display:flex;align-items:center;justify-content:center;font-size:clamp(.95rem,1.8vw,1.2rem);flex-shrink:0;}
        .d-cert-icon.has{background:#f0fdf4;border-color:#86efac;}
        .d-cert-info{flex:1;min-width:0;}.d-cert-name{font-weight:700;font-size:clamp(.72rem,1.3vw,.8rem);color:var(--black);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.d-cert-sub{font-size:clamp(.62rem,1.1vw,.7rem);color:var(--gray2);margin-top:2px;}
        .d-cert-actions{display:flex;gap:5px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;}
        .d-cert-btn{padding:clamp(4px,1vw,6px) clamp(8px,1.5vw,12px);border-radius:7px;font-family:var(--font);font-size:clamp(.62rem,1.1vw,.7rem);font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;}
        .d-cert-btn.up{background:rgba(124,58,237,.1);color:#7c3aed;border:1.5px solid rgba(124,58,237,.25);}.d-cert-btn.up:hover{background:rgba(124,58,237,.2);}
        .d-cert-btn.dl{background:var(--blue-lt);color:var(--blue);border:1.5px solid rgba(8,101,168,.25);}.d-cert-btn.dl:hover{background:var(--blue-md);}
        .d-cert-btn.rm{background:#fef2f2;color:#dc2626;border:1.5px solid rgba(220,38,38,.2);}.d-cert-btn.rm:hover{background:#fee2e2;}
        .d-cert-btn:disabled{opacity:.45;cursor:not-allowed;}
        .d-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);animation:d-fadeUp .16s ease;}
        .d-modal{background:var(--white);border-radius:14px;padding:clamp(14px,2.5vw,20px);max-width:clamp(290px,88vw,520px);width:100%;box-shadow:0 16px 48px rgba(0,0,0,.15);direction:rtl;border:2px solid rgba(124,58,237,.2);border-top:4px solid #7c3aed;}
        .d-modal.rd-modal{border-color:rgba(220,38,38,.2);border-top-color:#dc2626;max-width:clamp(290px,92vw,540px);max-height:90vh;overflow-y:auto;}
        .d-modal h3{font-size:clamp(.82rem,1.5vw,.92rem);font-weight:900;color:var(--black);margin-bottom:3px;}
        .d-modal p{font-size:clamp(.66rem,1.1vw,.72rem);color:var(--gray2);margin-bottom:12px;font-family:var(--font);}
        .d-drop{border:2px dashed rgba(124,58,237,.35);border-radius:12px;padding:clamp(24px,5vw,36px) 16px;text-align:center;cursor:pointer;transition:all .16s;background:rgba(124,58,237,.04);}
        .d-drop.over{border-color:#7c3aed;background:rgba(124,58,237,.1);}.d-drop:hover{border-color:rgba(124,58,237,.6);}
        .d-drop-icon{font-size:clamp(1.7rem,3.5vw,2.3rem);margin-bottom:8px;}.d-drop-txt{font-size:clamp(.72rem,1.4vw,.8rem);color:var(--gray1);margin-bottom:4px;font-family:var(--font);}.d-drop-sub{font-size:clamp(.62rem,1.1vw,.7rem);color:var(--gray3);}
        .d-modal-actions{display:flex;gap:7px;margin-top:18px;justify-content:flex-end;}
        .d-modal-cancel{padding:clamp(7px,1.3vw,10px) clamp(12px,2vw,18px);border-radius:9px;background:var(--bg-flat);border:1.5px solid var(--gray4);font-family:var(--font);font-size:clamp(.7rem,1.3vw,.78rem);font-weight:700;cursor:pointer;color:var(--gray2);transition:all .14s;}
        .d-modal-cancel:hover{border-color:var(--gray2);color:var(--black);background:var(--white);}

        /* ── REFUND ─────────────────────────────────────────────────────── */
        .rf-stat-bar{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:20px;}
        .rf-sc{background:var(--white);border-radius:11px;padding:14px 16px;border:1.5px solid var(--card-border);box-shadow:var(--shadow);display:flex;align-items:center;gap:11px;transition:transform .2s;}
        .rf-sc:hover{transform:translateY(-2px);}
        .rf-sc-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
        .rf-sc-body{flex:1;min-width:0;}.rf-sc-val{font-size:1.35rem;font-weight:900;line-height:1;font-family:'Courier New',monospace;}.rf-sc-lbl{font-size:.65rem;color:var(--gray2);font-weight:700;margin-top:3px;}
        .rf-status{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:.7rem;font-weight:700;white-space:nowrap;border:1.5px solid transparent;}
        .rf-amount{font-family:'Courier New',monospace;font-weight:900;font-size:.88rem;color:#15803d;direction:ltr;display:inline-block;}
        .rf-filter-btns{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
        .rf-fbtn{padding:5px 13px;border-radius:8px;border:1.5px solid var(--gray4);background:var(--bg-flat);font-family:var(--font);font-size:.7rem;font-weight:700;cursor:pointer;color:var(--gray2);transition:all .14s;}
        .rf-fbtn:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-lt);}
        .rf-fbtn.active{background:var(--blue-md);border-color:rgba(8,101,168,.4);color:var(--blue);}
        .rf-fbtn.active.pend{background:#fff8f0;border-color:rgba(245,124,0,.4);color:var(--orange);}
        .rf-fbtn.active.appr{background:#f0fdf4;border-color:#86efac;color:#16a34a;}
        .rf-fbtn.active.bank{background:var(--blue-lt);border-color:rgba(8,101,168,.35);color:var(--blue);}
        .rf-fbtn.active.rjct{background:var(--red-lt);border-color:rgba(220,38,38,.35);color:var(--red);}
        .rf-action-btn{padding:5px 12px;border-radius:7px;font-family:var(--font);font-size:.68rem;font-weight:700;cursor:pointer;border:1.5px solid;transition:all .14s;white-space:nowrap;}
        .rf-action-btn:disabled{opacity:.4;cursor:not-allowed;}
        .rf-action-btn.view{background:var(--blue-lt);color:var(--blue);border-color:rgba(8,101,168,.3);}.rf-action-btn.view:hover{background:var(--blue-md);}
        .rf-action-btn.approve{background:#f0fdf4;color:#16a34a;border-color:#86efac;}.rf-action-btn.approve:hover{background:#dcfce7;}
        .rf-action-btn.bank{background:var(--blue-lt);color:var(--blue);border-color:rgba(8,101,168,.35);}.rf-action-btn.bank:hover{background:var(--blue-md);}
        .rf-action-btn.reject{background:var(--red-lt);color:var(--red);border-color:rgba(220,38,38,.3);}.rf-action-btn.reject:hover{background:#fee2e2;}
        .rf-detail{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;}
        .rf-field-lbl{font-size:.58rem;color:var(--gray3);font-weight:700;margin-bottom:2px;}
        .rf-field-val{font-size:.74rem;color:var(--black);font-weight:700;word-break:break-all;}
        .rf-field-val.mono{font-family:'Courier New',monospace;direction:ltr;display:inline-block;}
        .rf-full{grid-column:1/-1;}.rf-divider{grid-column:1/-1;border:none;border-top:1.5px dashed var(--gray5);margin:2px 0;}
        .rf-bank-block{grid-column:1/-1;background:#f8faff;border:1.5px solid rgba(8,101,168,.15);border-radius:9px;padding:9px 12px;}
        .rf-bank-title{font-size:.68rem;font-weight:900;color:var(--blue);margin-bottom:7px;display:flex;align-items:center;gap:5px;}
        .rf-bank-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px 14px;}
        .rf-action-area{margin-top:12px;border-top:1.5px solid var(--gray5);padding-top:10px;}
        .rf-action-row{display:flex;gap:7px;flex-wrap:wrap;}
        .rf-textarea{width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid var(--gray4);background:var(--bg-flat);font-family:var(--font);font-size:.74rem;color:var(--black);resize:vertical;min-height:60px;outline:none;direction:rtl;margin-top:8px;transition:border .18s;}
        .rf-textarea:focus{border-color:var(--blue);background:#fff;}
        .rf-action-confirm{padding:8px 18px;border-radius:8px;font-family:var(--font);font-size:.76rem;font-weight:700;cursor:pointer;border:none;transition:all .16s;}
        .rf-action-confirm.approve{background:#16a34a;color:#fff;}.rf-action-confirm.approve:hover{background:#15803d;}
        .rf-action-confirm.bank{background:var(--blue);color:#fff;}.rf-action-confirm.bank:hover{background:#0552a0;}
        .rf-action-confirm.reject{background:var(--red);color:#fff;}.rf-action-confirm.reject:hover{background:#b91c1c;}
        .rf-action-confirm:disabled{opacity:.5;cursor:not-allowed;}
        .rf-bank-banner{padding:12px 16px;border-radius:11px;font-family:var(--font);font-size:.78rem;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:16px;animation:d-slideDown .3s ease;position:relative;}
        .rf-bank-banner.success{background:#f0fdf4;border:1.5px solid #86efac;color:#15803d;}
        .rf-bank-banner.failed{background:#fff8f0;border:1.5px solid rgba(245,124,0,.4);color:#b45309;}
        .rf-bank-banner-close{position:absolute;left:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1rem;color:inherit;opacity:.6;}
        .rf-bank-banner-close:hover{opacity:1;}
        .rf-refresh-btn{padding:6px 14px;border-radius:8px;border:1.5px solid var(--gray4);background:var(--bg-flat);font-family:var(--font);font-size:.7rem;font-weight:700;cursor:pointer;color:var(--gray2);transition:all .14s;display:flex;align-items:center;gap:5px;}
        .rf-refresh-btn:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-lt);}

        .d-api-info{display:flex;align-items:center;gap:8px;background:#f0fdf4;border:1px solid #86efac;border-radius:9px;padding:8px 14px;margin-bottom:clamp(12px,2vw,20px);font-size:clamp(.68rem,1.3vw,.76rem);color:#15803d;}
        .d-api-info code{background:#dcfce7;color:#16a34a;padding:1px 5px;border-radius:4px;font-family:'Courier New',monospace;font-size:.86em;}
        .d-ftr{text-align:center;margin-top:clamp(20px,3.5vw,32px);padding-top:18px;border-top:1.5px solid var(--gray5);color:var(--gray3);font-size:clamp(.6rem,1vw,.67rem);}
        .d-ftr strong{color:var(--blue);}
        .d-email{direction:ltr;text-align:right;color:var(--gray3);font-size:clamp(.65rem,1.15vw,.73rem);}

        @media(max-width:1100px){
          :root{--sidebar-w:52px;}
          .d-sb-title,.d-su-info,.d-nav-label,.d-nav-badge,.d-sidebar-footer,.d-nav-label-text{display:none;}
          .d-sidebar-brand{padding:12px;justify-content:center;}.d-sidebar-user{padding:10px;justify-content:center;}
          .d-sidebar-nav{padding:8px 6px;}.d-nav-btn{justify-content:center;padding:10px 7px;}
          .d-sb-logo,.d-su-av{width:28px;height:28px;}
        }
        @media(max-width:768px){
          .d-stats{grid-template-columns:repeat(3,1fr);}
          .rf-detail,.rf-bank-grid{grid-template-columns:1fr;}
          .d-cert-grid{grid-template-columns:1fr!important;}
          .d-mc{max-width:100%;}.d-page-hdr{flex-direction:column;}
        }
        @media(max-width:400px){.d-stats{grid-template-columns:repeat(2,1fr);}.d-main{padding:10px 8px 28px;}}
        @media(min-width:1920px){:root{--sidebar-w:220px;}.d-main{padding:36px 44px 72px;}}
        @media print{.d-sidebar,.d-toolbar,.d-filter,.d-api-info,._ovr{display:none!important;}.d-root{background:#fff!important;padding-top:0!important;}.d-main{margin-right:0!important;padding:0!important;}}
      `}</style>

            {/* ── Export overlay ─────────────────────────────────────────────── */}
            {exporting && (
                <div className="d-ovl"><div className="d-ovlb"><div className="d-sp" /><p>جاري تصدير الملف... يرجى الانتظار</p></div></div>
            )}

            {/* ── Certificate modal ─────────────────────────────────────────── */}
            {certModal && (
                <div className="d-modal-bg" onClick={() => setCertModal(null)}>
                    <div className="d-modal" onClick={e => e.stopPropagation()}>
                        <h3>📜 رفع شهادة</h3>
                        <p>{certModal.userName} — {certModal.courseTitle}</p>
                        <div className={`d-drop${certDragOver ? ' over' : ''}`}
                            onClick={() => certFileInputRef.current?.click()}
                            style={{ cursor: 'pointer' }}
                            onDragOver={e => { e.preventDefault(); setCertDragOver(true); }}
                            onDragLeave={() => setCertDragOver(false)}
                            onDrop={e => { e.preventDefault(); setCertDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleCertFile(certModal.enrollmentId, certModal.certKey, f); }}>
                            <div className="d-drop-icon">📂</div>
                            <div className="d-drop-txt">اسحب الملف هنا أو اضغط للاختيار</div>
                            <div className="d-drop-sub">PDF, JPG, PNG — حجم أقصى 10 MB</div>
                            <input ref={certFileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files[0]; if (f) handleCertFile(certModal.enrollmentId, certModal.certKey, f); e.target.value = ''; }} />
                        </div>
                        {certUploading[certModal.certKey] && (
                            <div style={{ textAlign: 'center', marginTop: 12, color: '#7c3aed', fontSize: '.8rem', fontWeight: 700, fontFamily: '"Droid Arabic Kufi",serif' }}>⏳ جاري الرفع على السيرفر...</div>
                        )}
                        <div className="d-modal-actions"><button className="d-modal-cancel" onClick={() => setCertModal(null)}>إلغاء</button></div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                REFUND DETAIL MODAL
            ══════════════════════════════════════════════════════════════ */}
            {refundDetailModal && (() => {
                const r = refunds.find(x => x.id === refundDetailModal.id) || refundDetailModal;
                const u = refundUserLookup(r.userId);
                const c = refundCourseLookup(r.courseId);
                const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
                return (
                    <div className="d-modal-bg" onClick={() => setRefundDetailModal(null)}>
                        <div className="d-modal rd-modal" style={{ maxWidth: 530, borderTopColor: sm.color }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div>
                                    <h3 style={{ fontSize: '.92rem' }}>💳 تفاصيل طلب الاسترداد</h3>
                                    <div style={{ fontSize: '.62rem', color: 'var(--gray3)', marginTop: 2, fontFamily: '"Droid Arabic Kufi",serif' }}>
                                        {r.refNumber || r.id}
                                    </div>
                                </div>
                                <span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span>
                            </div>

                            <div className="rf-detail">
                                <div className="rf-field">
                                    <div className="rf-field-lbl">رقم الأوردر</div>
                                    <div className="rf-field-val mono">{r.orderId || '—'}</div>
                                </div>
                                <div className="rf-field">
                                    <div className="rf-field-lbl">المبلغ</div>
                                    <div className="rf-field-val" style={{ color: '#15803d' }}>
                                        <span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span>
                                        <span style={{ fontSize: '.6rem', color: 'var(--gray3)', marginRight: 3 }}>{r.currency}</span>
                                    </div>
                                </div>
                                <div className="rf-field">
                                    <div className="rf-field-lbl">المستخدم</div>
                                    <div className="rf-field-val">{`${u.firstName} ${u.lastName}`.trim() || '—'}</div>
                                </div>
                                <div className="rf-field">
                                    <div className="rf-field-lbl">البريد الإلكتروني</div>
                                    <div className="rf-field-val mono" style={{ fontSize: '.68rem' }}>{u.email || '—'}</div>
                                </div>
                                <div className="rf-field">
                                    <div className="rf-field-lbl">الدورة</div>
                                    <div className="rf-field-val">{c.title || '—'}</div>
                                </div>
                                <div className="rf-field">
                                    <div className="rf-field-lbl">تاريخ الطلب</div>
                                    <div className="rf-field-val mono">{r.requestedAt || '—'}</div>
                                </div>
                                <div className="rf-field rf-full">
                                    <div className="rf-field-lbl">سبب الاسترداد</div>
                                    <div className="rf-field-val" style={{ fontWeight: 400, fontSize: '.74rem' }}>{r.reason || '—'}</div>
                                </div>
                                {r.details && (
                                    <div className="rf-field rf-full">
                                        <div className="rf-field-lbl">تفاصيل إضافية</div>
                                        <div className="rf-field-val" style={{ fontWeight: 400, fontSize: '.72rem', color: 'var(--gray1)', lineHeight: 1.5 }}>{r.details}</div>
                                    </div>
                                )}
                                <hr className="rf-divider" />
                                <div className="rf-bank-block">
                                    <div className="rf-bank-title">🏦 بيانات البنك (Fallback IBAN)</div>
                                    <div className="rf-bank-grid">
                                        {[['اسم البنك', r.bankName || '—', false], ['صاحب الحساب', r.accountHolder || '—', false], ['رقم الحساب', r.accountNumber || '—', true], ['IBAN', r.iban || '—', true]].map(([lbl, val, mono]) => (
                                            <div key={lbl}>
                                                <div className="rf-field-lbl">{lbl}</div>
                                                <div className={`rf-field-val${mono ? ' mono' : ''}`} style={{ fontSize: '.72rem' }}>{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {r.bankResult && (
                                    <>
                                        <hr className="rf-divider" />
                                        <div className="rf-field rf-full">
                                            <div className="rf-field-lbl">نتيجة البنك</div>
                                            {r.bankResult === 'SUCCESS' || r.bankResult === 'success'
                                                ? <div style={{ fontSize: '.72rem', color: '#16a34a', fontWeight: 700 }}>✅ SUCCESS — تم التحويل على الكارت تلقائياً</div>
                                                : <div style={{ fontSize: '.72rem', color: '#dc2626', fontWeight: 700 }}>❌ FAILED — يتم التحويل يدوياً على IBAN</div>}
                                        </div>
                                    </>
                                )}
                                {(r.approvedAt || r.sentAt || r.rejectedAt || r.rejectionReason || r.adminNote) && (
                                    <>
                                        <hr className="rf-divider" />
                                        <div className="rf-field rf-full">
                                            <div className="rf-field-lbl">سجل الإجراءات</div>
                                            <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                {r.approvedAt && <div style={{ fontSize: '.68rem', color: '#16a34a', fontFamily: '"Droid Arabic Kufi",serif' }}>✅ تمت الموافقة بتاريخ {r.approvedAt}</div>}
                                                {r.sentAt && <div style={{ fontSize: '.68rem', color: 'var(--blue)', fontFamily: '"Droid Arabic Kufi",serif' }}>🏦 أُرسل للبنك بتاريخ {r.sentAt}</div>}
                                                {r.rejectedAt && <div style={{ fontSize: '.68rem', color: 'var(--red)', fontFamily: '"Droid Arabic Kufi",serif' }}>❌ رُفض بتاريخ {r.rejectedAt}</div>}
                                                {r.rejectionReason && <div style={{ fontSize: '.66rem', color: 'var(--gray2)', background: 'var(--red-lt)', padding: '4px 9px', borderRadius: 6, fontFamily: '"Droid Arabic Kufi",serif' }}>سبب الرفض: {r.rejectionReason}</div>}
                                                {r.adminNote && <div style={{ fontSize: '.66rem', color: 'var(--gray2)', background: 'var(--blue-lt)', padding: '4px 9px', borderRadius: 6, fontFamily: '"Droid Arabic Kufi",serif' }}>ملاحظة: {r.adminNote}</div>}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {r.status === 'Pending' && (
                                <div className="rf-action-area">
                                    <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--gray2)', marginBottom: 6, fontFamily: '"Droid Arabic Kufi",serif' }}>اتخاذ إجراء:</div>
                                    <div className="rf-action-row">
                                        <button className="rf-action-btn approve" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'approve' }); }}>✅ موافقة</button>
                                        <button className="rf-action-btn bank" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'send_to_bank' }); }}>🏦 إرسال للبنك</button>
                                        <button className="rf-action-btn reject" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'reject' }); }}>❌ رفض</button>
                                    </div>
                                </div>
                            )}
                            {r.status === 'Approved' && (
                                <div className="rf-action-area">
                                    <div className="rf-action-row">
                                        <button className="rf-action-btn bank" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'send_to_bank' }); }}>🏦 إرسال للبنك (كلّم بنك مصر)</button>
                                    </div>
                                </div>
                            )}

                            <div className="d-modal-actions" style={{ marginTop: 10 }}>
                                <button className="d-modal-cancel" onClick={() => setRefundDetailModal(null)}>إغلاق</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ══════════════════════════════════════════════════════════════
                REFUND ACTION CONFIRMATION MODAL
            ══════════════════════════════════════════════════════════════ */}
            {refundActionModal && (() => {
                const { refund: r, action } = refundActionModal;
                const u = refundUserLookup(r.userId);
                const am = {
                    approve: { title: '✅ تأكيد الموافقة', color: '#16a34a', cls: 'approve', placeholder: 'ملاحظة للمستخدم (اختياري)...' },
                    reject: { title: '❌ تأكيد الرفض', color: '#dc2626', cls: 'reject', placeholder: 'سبب الرفض (مطلوب)...' },
                    send_to_bank: { title: '🏦 تأكيد الإرسال لبنك مصر', color: '#0865a8', cls: 'bank', placeholder: 'مرجع التحويل البنكي (اختياري)...' },
                }[action];
                return (
                    <div className="d-modal-bg" onClick={() => !refundActionSaving && setRefundActionModal(null)}>
                        <div className="d-modal rd-modal" style={{ maxWidth: 450, borderTopColor: am.color }} onClick={e => e.stopPropagation()}>
                            <h3>{am.title}</h3>
                            <p style={{ marginBottom: 12 }}>
                                طلب <strong>{r.refNumber || r.id}</strong> — <strong>{`${u.firstName} ${u.lastName}`.trim() || '—'}</strong><br />
                                المبلغ: <strong style={{ color: '#15803d', fontFamily: 'Courier New' }}>{Number(r.amount || 0).toLocaleString()} {r.currency}</strong>
                                &nbsp;·&nbsp; أوردر: <strong style={{ fontFamily: 'Courier New' }}>{r.orderId || '—'}</strong>
                            </p>

                            {action === 'send_to_bank' && (
                                <div style={{ background: '#f0f7ff', border: '1.5px solid rgba(8,101,168,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
                                    <div style={{ fontSize: '.66rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 6, fontFamily: '"Droid Arabic Kufi",serif' }}>
                                        🏦 سيتم استدعاء RefundPaymentAsync ببنك مصر:
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 14px' }}>
                                        {[['البنك', r.bankName || '—'], ['صاحب الحساب', r.accountHolder || '—'], ['رقم الحساب', r.accountNumber || '—'], ['IBAN (Fallback)', r.iban || '—']].map(([lbl, val]) => (
                                            <div key={lbl}>
                                                <div style={{ fontSize: '.58rem', color: 'var(--gray3)', fontFamily: '"Droid Arabic Kufi",serif' }}>{lbl}</div>
                                                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--black)', fontFamily: lbl.includes('IBAN') || lbl.includes('حساب') ? 'Courier New' : '"Droid Arabic Kufi",serif', direction: 'ltr', textAlign: 'right' }}>{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 8, fontSize: '.62rem', color: '#555', fontFamily: '"Droid Arabic Kufi",serif', borderTop: '1px dashed #cce', paddingTop: 6 }}>
                                        ⚡ إذا نجح البنك (SUCCESS) → ترجع الفلوس على الكارت تلقائياً<br />
                                        ⚠️ إذا فشل (FAILED) → يُحوَّل يدوياً على IBAN
                                    </div>
                                </div>
                            )}

                            {refundActionError && (
                                <div style={{ background: '#fef2f2', border: '1.5px solid rgba(220,38,38,.3)', color: '#dc2626', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: '.72rem', fontFamily: '"Droid Arabic Kufi",serif' }}>
                                    ⚠️ {refundActionError}
                                </div>
                            )}

                            <textarea
                                className="rf-textarea"
                                placeholder={am.placeholder}
                                value={refundActionNote}
                                onChange={e => setRefundActionNote(e.target.value)}
                                disabled={refundActionSaving}
                            />

                            <div className="d-modal-actions">
                                <button className="d-modal-cancel" onClick={() => { setRefundActionModal(null); setRefundActionNote(''); setRefundActionError(''); }} disabled={refundActionSaving}>إلغاء</button>
                                <button
                                    className={`rf-action-confirm ${am.cls}`}
                                    onClick={commitRefundAction}
                                    disabled={refundActionSaving || (action === 'reject' && !refundActionNote.trim())}
                                >
                                    {refundActionSaving
                                        ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'd-spin .6s linear infinite', marginLeft: 6, verticalAlign: 'middle' }} />جاري...</>
                                        : 'تأكيد'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
            <div className="_ovr">
                <a href="/">الصفحة الرئيسية</a>
                <span className="sep">›</span>
                <span className="cur">لوحة الإدارة</span>
            </div>

            <div className="d-root">
                {/* ── SIDEBAR ─────────────────────────────────────────────── */}
                <aside className="d-sidebar">
                    <div className="d-sidebar-brand">
                        <img src={logoSrc} alt="ICEMT" className="d-sb-logo" />
                        <div className="d-sb-title"><div className="d-sb-name">ICEMT</div><div className="d-sb-sub">لوحة التحكم الإدارية</div></div>
                    </div>
                    <div className="d-sidebar-user">
                        <div className="d-su-av">{user?.firstName?.[0] || 'م'}{user?.lastName?.[0] || ''}</div>
                        <div className="d-su-info">
                            <div className="d-su-name">{user?.firstName} {user?.lastName}</div>
                            <div className="d-su-role">🔐 مدير النظام</div>
                        </div>
                    </div>
                    <nav className="d-sidebar-nav">
                        <div className="d-nav-section">
                            <div className="d-nav-label">القائمة</div>
                            {TABS.map(t => (
                                <button key={t.id} title={t.label}
                                    className={`d-nav-btn${activeTab === t.id ? ' active' : ''}${t.color === 'green' ? ' gr' : t.color === 'purple' ? ' pu' : t.color === 'red' ? ' rd' : ''}`}
                                    onClick={() => { setActiveTab(t.id); setExpandedRow(null); setSearchQuery(''); }}>
                                    <span className="d-nav-icon">{t.icon}</span>
                                    <span className="d-nav-label-text">{t.label}</span>
                                    {t.id === 'certificates' && totalCerts > 0 && <span className="d-nav-badge">{totalCerts}</span>}
                                    {t.id === 'refunds' && refundStats.pending > 0 && <span className="d-nav-badge rd">{refundStats.pending}</span>}
                                </button>
                            ))}
                        </div>
                    </nav>
                    <div className="d-sidebar-footer">ICEMT © {new Date().getFullYear()}</div>
                </aside>

                {/* ── MAIN ────────────────────────────────────────────────── */}
                <main className="d-main">
                    <div className="d-page-hdr">
                        <div>
                            <div className="d-page-title">
                                <span style={{ color: '#f57c00' }}>{TABS.find(t => t.id === activeTab)?.icon}</span>{' '}
                                {activeTab === 'users' ? 'المستخدمون والدورات' : activeTab === 'courses' ? 'الدورات والمستخدمون' : activeTab === 'attendance' ? 'سجل الحضور' : activeTab === 'certificates' ? 'الشهادات' : 'طلبات الاسترداد'}
                            </div>
                            <div className="d-page-sub">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div className="d-api-info">🟢 بيانات حية من <code>API</code></div>
                    </div>

                    {!loading && !error && (
                        <div className="d-stats">
                            {STATS.map(s => (
                                <div key={s.label} className="d-sc" data-icon={s.icon} style={{ borderColor: s.border }}>
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

                    {/* ══════════════════════════════════════════════════════
                        REFUNDS TAB
                    ══════════════════════════════════════════════════════ */}
                    {activeTab === 'refunds' && (
                        <div>
                            {bankResultBanner && (
                                <div className={`rf-bank-banner ${bankResultBanner.type}`}>
                                    <span>{bankResultBanner.msg}</span>
                                    <button className="rf-bank-banner-close" onClick={() => setBankResultBanner(null)}>✕</button>
                                </div>
                            )}

                            <div className="rf-stat-bar">
                                {[
                                    { lbl: 'إجمالي', val: refundStats.total, icon: '📋', bg: '#f0f4f8', color: 'var(--black)' },
                                    { lbl: 'قيد المراجعة', val: refundStats.pending, icon: '⏳', bg: '#fff8f0', color: '#b45309' },
                                    { lbl: 'موافق عليها', val: refundStats.approved, icon: '✅', bg: '#f0fdf4', color: '#16a34a' },
                                    { lbl: 'أُرسل للبنك', val: refundStats.sent, icon: '🏦', bg: '#e8f1f9', color: 'var(--blue)' },
                                    { lbl: 'مرفوضة', val: refundStats.rejected, icon: '❌', bg: '#fef2f2', color: 'var(--red)' },
                                    { lbl: 'إجمالي المبالغ', val: `${refundStats.totalAmount.toLocaleString()} EGP`, icon: '💰', bg: '#f0fdf4', color: '#15803d' },
                                ].map(s => (
                                    <div key={s.lbl} className="rf-sc">
                                        <div className="rf-sc-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                                        <div className="rf-sc-body">
                                            <div className="rf-sc-val" style={{ color: s.color, fontSize: typeof s.val === 'string' ? '.82rem' : '1.35rem' }}>{s.val}</div>
                                            <div className="rf-sc-lbl">{s.lbl}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-filter">
                                <div className="d-search" style={{ minWidth: 200 }}>
                                    <input type="text" placeholder="ابحث برقم الطلب، المبلغ، المستخدم..." value={refundSearch} onChange={e => setRefundSearch(e.target.value)} />
                                </div>
                                <div className="rf-filter-btns">
                                    <span className="d-flbl">الحالة:</span>
                                    {[
                                        { id: 'all', lbl: 'الكل', cls: '' },
                                        { id: 'Pending', lbl: '⏳ قيد المراجعة', cls: 'pend' },
                                        { id: 'Approved', lbl: '✅ موافق عليه', cls: 'appr' },
                                        { id: 'Sent', lbl: '🏦 أُرسل للبنك', cls: 'bank' },
                                        { id: 'Rejected', lbl: '❌ مرفوض', cls: 'rjct' },
                                    ].map(f => (
                                        <button key={f.id}
                                            className={`rf-fbtn${refundStatusFilter === f.id ? ` active ${f.cls}` : ''}`}
                                            onClick={() => setRefundStatusFilter(f.id)}>
                                            {f.lbl}
                                        </button>
                                    ))}
                                </div>
                                {refundSearch && <button className="d-fclear" onClick={() => setRefundSearch('')}>✕</button>}
                                <button className="rf-refresh-btn" onClick={() => fetchRefunds(refundStatusFilter)} disabled={refundsLoading}>
                                    {refundsLoading ? <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid var(--gray3)', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'd-spin .6s linear infinite' }} /> : '↻'}
                                    تحديث
                                </button>
                            </div>

                            {refundsError && (
                                <div className="d-err">⚠️ {refundsError}
                                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setRefundsError(null)}>✕</button>
                                </div>
                            )}

                            <div className="d-card">
                                {refundsLoading
                                    ? <div className="d-ld"><div className="d-sp" /><p>جاري تحميل طلبات الاسترداد...</p></div>
                                    : filteredRefunds.length === 0
                                        ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد طلبات مطابقة</p></div>
                                        : (
                                            <div className="d-tscr">
                                                <table className="d-tbl">
                                                    <thead>
                                                        <tr>
                                                            <th className="rd c" style={{ width: 36 }}>#</th>
                                                            <th className="rd">رقم الطلب</th>
                                                            <th className="rd">رقم الأوردر</th>
                                                            <th className="rd">المستخدم</th>
                                                            <th className="rd">الدورة</th>
                                                            <th className="rd c">المبلغ</th>
                                                            <th className="rd">السبب</th>
                                                            <th className="rd c">الحالة</th>
                                                            <th className="rd">تاريخ الطلب</th>
                                                            <th className="rd c">الإجراءات</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredRefunds.map((r, idx) => {
                                                            const u = refundUserLookup(r.userId);
                                                            const c = refundCourseLookup(r.courseId);
                                                            const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
                                                            return (
                                                                <tr key={r.id}>
                                                                    <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{idx + 1}</td>
                                                                    <td><span style={{ fontFamily: 'Courier New', fontSize: '.76rem', fontWeight: 700, color: 'var(--blue)' }}>{r.refNumber || r.id}</span></td>
                                                                    <td><span style={{ fontFamily: 'Courier New', fontSize: '.76rem', color: 'var(--gray2)' }}>{r.orderId || '—'}</span></td>
                                                                    <td>
                                                                        <div className="d-uc">
                                                                            <div className="d-av rd">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                                                                            <div>
                                                                                <div style={{ fontWeight: 700, color: 'var(--black)', fontSize: '.78rem' }}>{`${u.firstName} ${u.lastName}`.trim() || '—'}</div>
                                                                                <div className="d-email" style={{ fontSize: '.65rem' }}>{u.email}</div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ fontSize: '.76rem', maxWidth: 160 }}>
                                                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                                                                    </td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span>
                                                                        <span style={{ fontSize: '.6rem', color: 'var(--gray3)', marginRight: 3 }}>{r.currency}</span>
                                                                    </td>
                                                                    <td style={{ maxWidth: 150 }}>
                                                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '.74rem', color: 'var(--gray2)' }} title={r.reason}>{r.reason || '—'}</div>
                                                                    </td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span>
                                                                    </td>
                                                                    <td style={{ fontSize: '.72rem', fontFamily: 'Courier New', color: 'var(--gray3)', whiteSpace: 'nowrap' }}>{r.requestedAt || '—'}</td>
                                                                    <td>
                                                                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                                            <button className="rf-action-btn view" onClick={() => setRefundDetailModal(r)}>🔍 تفاصيل</button>
                                                                            {r.status === 'Pending' && <>
                                                                                <button className="rf-action-btn approve" onClick={() => setRefundActionModal({ refund: r, action: 'approve' })}>✅</button>
                                                                                <button className="rf-action-btn bank" onClick={() => setRefundActionModal({ refund: r, action: 'send_to_bank' })}>🏦</button>
                                                                                <button className="rf-action-btn reject" onClick={() => setRefundActionModal({ refund: r, action: 'reject' })}>❌</button>
                                                                            </>}
                                                                            {r.status === 'Approved' && (
                                                                                <button className="rf-action-btn bank" onClick={() => setRefundActionModal({ refund: r, action: 'send_to_bank' })}>🏦 إرسال للبنك</button>
                                                                            )}
                                                                        </div>
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

                    {/* ── ATTENDANCE TAB ──────────────────────────────────── */}
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
                                <span>✅ {attRows.filter(r => { const k = attKey(r.course.enrollmentId, r.course._username ?? r.user.username ?? r.user.email, r.course.title); return attendance[k]; }).length} حضر</span>
                                <span>❌ {attRows.filter(r => { const k = attKey(r.course.enrollmentId, r.course._username ?? r.user.username ?? r.user.email, r.course.title); return !attendance[k]; }).length} غائب</span>
                                <span>📋 {attRows.length} إجمالي</span>
                                {attRows.length > 0 && (() => { const cnt = attRows.filter(r => { const k = attKey(r.course.enrollmentId, r.course._username ?? r.user.username ?? r.user.email, r.course.title); return attendance[k]; }).length; const pct = Math.round(cnt / attRows.length * 100); return (<><span>{pct}٪ حضور</span><div className="d-prog-wrap"><div className="d-prog-fill" style={{ width: `${pct}%` }} /></div></>); })()}
                            </div>
                            {attError && (
                                <div className="d-err">⚠️ {attError}
                                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setAttError(null)}>✕</button>
                                </div>
                            )}
                            <div className="d-card">
                                {loading ? <div className="d-ld"><div className="d-sp" /><p>جاري التحميل...</p></div>
                                    : attRows.length === 0 ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد نتائج</p></div>
                                        : (
                                            <div className="d-tscr">
                                                <table className="d-tbl">
                                                    <thead><tr>
                                                        <th className="c" style={{ width: 40 }}>#</th>
                                                        <th>المستخدم</th><th>البريد الإلكتروني</th><th>الدورة</th>
                                                        <th className="gr c">الحضور</th><th className="gr c">الحالة</th>
                                                    </tr></thead>
                                                    <tbody>
                                                        {attRows.map((row, idx) => {
                                                            const eid = row.course.enrollmentId;
                                                            const uname = row.course._username ?? row.user.username ?? row.user.email;
                                                            const k = attKey(eid, uname, row.course.title);
                                                            const attended = !!attendance[k];
                                                            const saving = !!attendanceSaving[k];
                                                            return (
                                                                <tr key={k}>
                                                                    <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{idx + 1}</td>
                                                                    <td><div className="d-uc"><div className="d-av">{row.user.firstName?.[0]}{row.user.lastName?.[0]}</div><span className="d-uname">{row.user.firstName} {row.user.lastName}</span></div></td>
                                                                    <td className="d-email">{row.user.email}</td>
                                                                    <td style={{ color: 'var(--blue)', fontWeight: 700 }}>{row.course.title}</td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <div className={`d-chk${saving ? ' spin' : attended ? ' on' : ''}`}
                                                                            onClick={() => !saving && toggleAttendance(eid, uname, row.course.title, attended)}>
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

                    {/* ── CERTIFICATES TAB ────────────────────────────────── */}
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
                            {certError && (
                                <div className="d-err">⚠️ {certError}
                                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setCertError(null)}>✕</button>
                                </div>
                            )}
                            <div className="d-card">
                                {loading ? <div className="d-ld"><div className="d-sp" /><p>جاري التحميل...</p></div>
                                    : certRows.length === 0 ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد نتائج</p></div>
                                        : (
                                            <div className="d-cert-grid">
                                                {certRows.map(row => {
                                                    const eid = row.enrollmentId;
                                                    const ck = row.certKey;
                                                    const cert = certificates[ck];
                                                    const uploading = certUploading[ck];
                                                    const attended = attendance[ck];
                                                    return (
                                                        <div className="d-cert-card" key={ck}>
                                                            <div className={`d-cert-icon${cert ? ' has' : ''}`}>{cert ? '📜' : '📄'}</div>
                                                            <div className="d-cert-info">
                                                                <div className="d-cert-name">{row.user.firstName} {row.user.lastName}</div>
                                                                <div className="d-cert-sub">📚 {row.course.title}</div>
                                                                {cert && <div style={{ fontSize: '.65rem', color: '#16a34a', marginTop: 2, fontWeight: 700 }}>✅ {cert.name}{cert.size ? ` · ${(cert.size / 1024).toFixed(0)} KB` : ''}</div>}
                                                                {!cert && !attended && <div style={{ fontSize: '.65rem', color: 'var(--orange)', marginTop: 2 }}>⚠️ لم يُسجَّل الحضور</div>}
                                                            </div>
                                                            <div className="d-cert-actions">
                                                                {cert ? (
                                                                    <>
                                                                        <a href={cert.url} download={cert.name} target="_blank" rel="noreferrer">
                                                                            <button className="d-cert-btn dl">⬇ تحميل</button>
                                                                        </a>
                                                                        <button className="d-cert-btn up"
                                                                            onClick={() => setCertModal({ enrollmentId: eid, certKey: ck, userName: `${row.user.firstName} ${row.user.lastName}`, courseTitle: row.course.title })}>
                                                                            🔄
                                                                        </button>
                                                                        <button className="d-cert-btn rm" onClick={() => removeCert(ck)}>🗑</button>
                                                                    </>
                                                                ) : (
                                                                    <button className="d-cert-btn up" disabled={uploading}
                                                                        onClick={() => setCertModal({ enrollmentId: eid, certKey: ck, userName: `${row.user.firstName} ${row.user.lastName}`, courseTitle: row.course.title })}>
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

                    {/* ── USERS / COURSES TABS ────────────────────────────── */}
                    {isExportTab && (
                        <>
                            <div className="d-toolbar">
                                <div className="d-search">
                                    <input type="text"
                                        placeholder={activeTab === 'users' ? 'ابحث باسم المستخدم أو البريد...' : 'ابحث باسم الدورة أو الفئة...'}
                                        value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setExpandedRow(null); }} />
                                </div>
                                <span className="d-flbl">📅</span>
                                <span className="d-fsm">من</span>
                                <input type="date" className="d-fdate" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setExpandedRow(null); }} />
                                <span className="d-fsm">إلى</span>
                                <input type="date" className="d-fdate" value={dateTo} min={dateFrom} onChange={e => { setDateTo(e.target.value); setExpandedRow(null); }} />
                                {(dateFrom || dateTo) && (
                                    <><span className="d-fbadge">🔶 فلتر نشط</span><button className="d-fclear" onClick={() => { setDateFrom(''); setDateTo(''); setExpandedRow(null); }}>✕</button></>
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
                                                                {activeTab === 'users'
                                                                    ? <><th>المستخدم</th><th>البريد الإلكتروني</th><th className="c">الدورات</th><th className="c">تفاصيل</th></>
                                                                    : <><th>اسم الدورة</th><th className="c">المسجّلون</th><th className="c">تفاصيل</th></>}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {activeTab === 'users'
                                                                ? filteredUsers.map((u, idx) => (
                                                                    <React.Fragment key={u.id}>
                                                                        <tr className={expandedRow === u.id ? 'xopen' : ''}>
                                                                            <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{idx + 1}</td>
                                                                            <td><div className="d-uc"><div className="d-av">{u.firstName?.[0] || '?'}{u.lastName?.[0] || ''}</div><span className="d-uname">{u.firstName} {u.lastName}</span></div></td>
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
                                                                                        <div className="d-mc" key={c.enrollmentId ?? c._title ?? c.title}>
                                                                                            <div className="d-mt">📚 {c.title}</div>
                                                                                            {c.date && <div className="d-md">📅 {c.date}</div>}
                                                                                            <div style={{ marginTop: 5, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                                                                                {(() => { const k = attKey(c.enrollmentId, c._username ?? u.username ?? u.email, c.title); return <span className={`d-att-badge ${attendance[k] ? 'on' : 'off'}`} style={{ fontSize: '.62rem' }}>{attendance[k] ? '✅ حضر' : '❌ غائب'}</span>; })()}
                                                                                                {(() => { const k = attKey(c.enrollmentId, c._username ?? u.username ?? u.email, c.title); return certificates[k] ? <span style={{ fontSize: '.62rem', color: '#7c3aed', fontWeight: 700 }}>📜 شهادة</span> : null; })()}
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
                                                                                        <div className="d-mc" key={u.enrollmentId ?? u.username ?? u.email}>
                                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                                                                                                <div className="d-av or sm">{u.firstName?.[0] || '?'}{u.lastName?.[0] || ''}</div>
                                                                                                <div><div className="d-mt or">{u.firstName || u.username} {u.lastName}</div><div className="d-ms">✉ {u.email}</div></div>
                                                                                            </div>
                                                                                            {u.date && <div className="d-md">📅 {u.date}</div>}
                                                                                            <div style={{ marginTop: 5, display: 'flex', gap: 5 }}>
                                                                                                {(() => { const k = attKey(u.enrollmentId, u.username ?? u.email, c.title); return <span className={`d-att-badge ${attendance[k] ? 'on' : 'off'}`} style={{ fontSize: '.62rem' }}>{attendance[k] ? '✅ حضر' : '❌ غائب'}</span>; })()}
                                                                                                {(() => { const k = attKey(u.enrollmentId, u.username ?? u.email, c.title); return certificates[k] ? <span style={{ fontSize: '.62rem', color: '#7c3aed', fontWeight: 700 }}>📜 شهادة</span> : null; })()}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </td></tr>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                            </div>
                        </>
                    )}

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