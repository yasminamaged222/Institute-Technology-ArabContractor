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
const API_HOST = 'https://acwebsite-icmet-test.azurewebsites.net';

const NAVBAR_H = 70;
const OVERVIEW_H = 38;
const ITEMS_PER_PAGE = 10;

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
// RTL EXPORT HELPER
// ════════════════════════════════════════════════════════════════════════════
function rtlExport(headers, rows) {
    return {
        headers: [...headers].reverse(),
        rows: rows.map(r => [...r].reverse()),
    };
}

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

async function exportExcel(filename, reportTitle, headers, rows) {
    const reportDate = new Date().toLocaleDateString('ar-EG');
    try {
        const { default: ExcelJS } = await import('exceljs');
        const wb = new ExcelJS.Workbook();
        wb.views = [{ rightToLeft: true }];
        const ws = wb.addWorksheet('التقرير', { views: [{ rightToLeft: true }] });
        ws.columns = headers.map((h, i) => ({ width: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 50) }));
        const logoB64 = await getLogoBase64();
        if (logoB64) {
            const imgId = wb.addImage({ base64: logoB64.split(',')[1], extension: 'png' });
            ws.addImage(imgId, { tl: { col: 0, row: 0 }, br: { col: 2, row: 5 } });
        }
        ws.mergeCells(1, 1, 2, headers.length);
        const titleCell = ws.getCell('A1');
        titleCell.value = reportTitle;
        titleCell.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' };
        ws.getRow(1).height = 42; ws.getRow(2).height = 10;
        ws.mergeCells(3, 1, 3, headers.length);
        const dateCell = ws.getCell('A3');
        dateCell.value = `تاريخ التقرير: ${reportDate}`;
        dateCell.font = { italic: true, size: 10, color: { argb: 'FF555555' } };
        dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
        dateCell.alignment = { horizontal: 'center', readingOrder: 'rightToLeft' };
        ws.getRow(3).height = 20;
        const hRow = ws.addRow(headers);
        hRow.height = 28;
        hRow.eachCell(cell => {
            cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' };
            cell.border = { bottom: { style: 'medium', color: { argb: 'FFF57C00' } } };
        });
        rows.forEach((row, ri) => {
            const dr = ws.addRow(row);
            dr.height = 20;
            const isAlt = ri % 2 !== 0;
            dr.eachCell({ includeEmpty: true }, (cell, cn) => {
                cell.alignment = { horizontal: cn === headers.length ? 'center' : 'right', readingOrder: 'rightToLeft' };
                if (isAlt) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } };
                const b = { style: 'thin', color: { argb: 'FFD0D0D0' } };
                cell.border = { top: b, bottom: b, left: b, right: b };
            });
        });
        const buffer = await wb.xlsx.writeBuffer();
        triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
        return;
    } catch (_) { }
    const wsData = [[reportTitle, ...Array(headers.length - 1).fill('')], [`تاريخ التقرير: ${reportDate}`, ...Array(headers.length - 1).fill('')], [], headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = headers.map((h, i) => ({ wch: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 55) }));
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }];
    const wb2 = XLSX.utils.book_new();
    wb2.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(wb2, ws, 'التقرير');
    XLSX.writeFile(wb2, filename);
}

// ── Arabic-safe canvas text renderer ─────────────────────────────────────────
function renderTextToImage(text, { fontSize = 12, bold = false, color = '#111111', width = 200, height = 30, bgColor = null, align = 'right' } = {}) {
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); }
    const fontStack = `${bold ? 'bold ' : ''}${fontSize}px "Cairo","Amiri","Noto Naskh Arabic","Noto Sans Arabic","Droid Arabic Kufi","Tahoma","Arial Unicode MS","Arial",sans-serif`;
    ctx.font = fontStack;
    ctx.direction = 'rtl';
    ctx.textAlign = align === 'center' ? 'center' : align === 'left' ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    const padding = 6;
    let x;
    if (align === 'right') x = width - padding;
    else if (align === 'left') x = padding;
    else x = width / 2;
    const str = String(text ?? '');
    let finalStr = str;
    const maxW = width - padding * 2;
    if (ctx.measureText(finalStr).width > maxW) {
        let lo = 0, hi = str.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi + 1) / 2);
            if (ctx.measureText(str.slice(0, mid) + '…').width <= maxW) lo = mid; else hi = mid - 1;
        }
        finalStr = str.slice(0, lo) + '…';
    }
    ctx.fillText(finalStr, x, height / 2);
    return canvas.toDataURL('image/png');
}

async function exportPDF(filename, reportTitle, headers, rows, subtitle = '') {
    const logoDataUrl = await getLogoBase64();
    const reportDate = new Date().toLocaleDateString('ar-EG');
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const BLUE = [8, 101, 168];
    const ORANGE = [245, 124, 0];
    const FOOTER_TEXT = 'المعهد التكنولوجى لهندسة التشييد والإدارة';

    const drawHeader = () => {
        doc.setFillColor(...BLUE);
        doc.rect(0, 0, pageW, 34, 'F');
        doc.setFillColor(...ORANGE);
        doc.rect(0, 34, pageW, 2.5, 'F');
        if (logoDataUrl) {
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(5, 4, 36, 26, 3, 3, 'F');
            try { doc.addImage(logoDataUrl, 'PNG', 6, 5, 34, 24); } catch (_) { }
        }
        const titleImg = renderTextToImage(reportTitle, { fontSize: 17, bold: true, color: '#FFFFFF', width: 520, height: 44, align: 'center' });
        doc.addImage(titleImg, 'PNG', pageW / 2 - 85, 3, 170, 17);
        if (subtitle) {
            const subImg = renderTextToImage(subtitle, { fontSize: 9, color: '#CCE4FF', width: 400, height: 28, align: 'center' });
            doc.addImage(subImg, 'PNG', pageW / 2 - 55, 21, 110, 9);
        }
        const dateImg = renderTextToImage(reportDate, { fontSize: 8, color: '#BBDAFF', width: 160, height: 22, align: 'right' });
        doc.addImage(dateImg, 'PNG', pageW - 58, 25, 52, 7);
    };

    drawHeader();

    const hashColIndex = headers.length - 1;

    autoTable(doc, {
        startY: 40,
        head: [headers],
        body: rows.map(r => r.map(c => String(c ?? ''))),
        theme: 'grid',
        styles: {
            font: 'helvetica', fontSize: 0.01,
            textColor: [255, 255, 255, 0],
            cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
            lineColor: [218, 218, 218], lineWidth: 0.3,
            minCellHeight: 10, valign: 'middle',
        },
        headStyles: {
            fillColor: BLUE, textColor: [255, 255, 255, 0],
            minCellHeight: 12,
            lineColor: ORANGE,
            lineWidth: { bottom: 1.2, top: 0.3, left: 0.3, right: 0.3 },
        },
        alternateRowStyles: { fillColor: [240, 246, 251] },
        columnStyles: { [hashColIndex]: { cellWidth: 14, halign: 'center' } },
        margin: { top: 40, left: 8, right: 8, bottom: 16 },

        didDrawCell: (data) => {
            const text = String(data.cell.raw ?? '');
            if (!text || text.trim() === '') return;
            const { x, y, width: w, height: h } = data.cell;
            const isHeader = data.section === 'head';
            const isHashCol = data.column.index === data.table.columns.length - 1;
            const cellAlign = isHashCol ? 'center' : 'right';
            const img = renderTextToImage(text, {
                fontSize: isHeader ? 10 : 9,
                bold: isHeader,
                color: isHeader ? '#FFFFFF' : '#1A1A1A',
                width: Math.max(Math.round(w * 3.8), 50),
                height: Math.max(Math.round(h * 3.8), 20),
                align: cellAlign,
            });
            try { doc.addImage(img, 'PNG', x + 0.5, y + 0.3, w - 1, h - 0.6); } catch (_) { }
        },

        didDrawPage: (data) => {
            if (data.pageNumber > 1) drawHeader();
            const pCount = doc.internal.getNumberOfPages();
            doc.setFillColor(245, 247, 250);
            doc.rect(0, pageH - 12, pageW, 12, 'F');
            doc.setDrawColor(...ORANGE);
            doc.setLineWidth(0.5);
            doc.line(8, pageH - 12, pageW - 8, pageH - 12);
            const mk = (t, w, a) => renderTextToImage(t, { fontSize: 7.5, color: '#555555', width: w, height: 18, align: a });
            doc.addImage(mk(FOOTER_TEXT, 340, 'right'), 'PNG', 8, pageH - 10.5, 90, 6);
            doc.addImage(mk(`${data.pageNumber} / ${pCount}`, 110, 'center'), 'PNG', pageW / 2 - 18, pageH - 10.5, 36, 6);
            doc.addImage(mk(reportDate, 160, 'left'), 'PNG', pageW - 56, pageH - 10.5, 48, 6);
        },
    });

    doc.save(filename);
}

async function exportWord(filename, reportTitle, subtitle, headers, rows) {
    const reportDate = new Date().toLocaleDateString('ar-EG');
    const logoDataUrl = await getLogoBase64();

    let logoBase64Raw = null;
    let logoW = 90, logoH = 60;
    if (logoDataUrl) {
        logoBase64Raw = logoDataUrl.split(',')[1];
        await new Promise(res => {
            const img = new Image();
            img.onload = () => {
                if (img.naturalHeight > 0) {
                    logoH = 60;
                    logoW = Math.round((img.naturalWidth / img.naturalHeight) * logoH);
                }
                res();
            };
            img.onerror = res;
            img.src = logoDataUrl;
        });
    }

    try {
        const docxModule = await import('docx');
        const {
            Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
            AlignmentType, WidthType, ShadingType, BorderStyle, VerticalAlign,
            PageOrientation, ImageRun,
        } = docxModule;

        const totalDxa = 13440;
        const hashColIdx = headers.length - 1;
        const narrowW = Math.max(600, Math.floor(totalDxa * 0.05));
        const wideW = Math.floor((totalDxa - narrowW) / Math.max(headers.length - 1, 1));
        const colWidths = headers.map((_, i) => i === hashColIdx ? narrowW : wideW);

        const CB = {
            top: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
            left: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
            right: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
        };

        const makeCell = (text, { isHeader = false, width, center = false, altRow = false } = {}) =>
            new TableCell({
                width: { size: width, type: WidthType.DXA },
                shading: {
                    fill: isHeader ? '0865A8' : altRow ? 'F0F6FB' : 'FFFFFF',
                    type: ShadingType.CLEAR,
                },
                borders: CB,
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                    bidirectional: true,
                    alignment: center ? AlignmentType.CENTER : AlignmentType.RIGHT,
                    children: [new TextRun({
                        text: String(text ?? ''),
                        bold: isHeader,
                        color: isHeader ? 'FFFFFF' : '1A1A1A',
                        size: isHeader ? 22 : 20,
                        rtl: true,
                        font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                        language: { value: 'ar-SA', eastAsia: 'ar-SA' },
                    })],
                })],
            });

        const logoRuns = [];
        if (logoBase64Raw && ImageRun) {
            try {
                const binary = atob(logoBase64Raw);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                logoRuns.push(
                    new ImageRun({ data: bytes, transformation: { width: logoW, height: logoH }, type: 'png' }),
                    new TextRun({ text: '   ', size: 28 }),
                );
            } catch (imgErr) {
                console.warn('[exportWord] logo embed failed:', imgErr);
            }
        }

        const arabicPara = (text, opts = {}) =>
            new Paragraph({
                bidirectional: true,
                alignment: opts.center ? AlignmentType.CENTER : AlignmentType.RIGHT,
                spacing: opts.spacing,
                shading: opts.shading,
                border: opts.border,
                children: [new TextRun({
                    text,
                    bold: opts.bold || false,
                    italics: opts.italic || false,
                    color: opts.color || '111111',
                    size: opts.size || 20,
                    rtl: true,
                    font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                    language: { value: 'ar-SA', eastAsia: 'ar-SA' },
                })],
            });

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE },
                        margin: { top: 720, right: 720, bottom: 900, left: 720 },
                    },
                },
                children: [
                    new Paragraph({
                        bidirectional: true,
                        alignment: AlignmentType.CENTER,
                        shading: { fill: '0865A8', type: ShadingType.CLEAR },
                        border: { bottom: { style: BorderStyle.THICK, size: 18, color: 'F57C00', space: 6 } },
                        spacing: { before: 0, after: 80 },
                        children: [
                            ...logoRuns,
                            new TextRun({
                                text: reportTitle,
                                color: 'FFFFFF', bold: true, size: 28, rtl: true,
                                font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                                language: { value: 'ar-SA', eastAsia: 'ar-SA' },
                            }),
                            ...(subtitle ? [new TextRun({
                                text: `  —  ${subtitle}`,
                                color: 'D0E8FF', size: 20, rtl: true,
                                font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                            })] : []),
                        ],
                    }),
                    arabicPara(
                        `تاريخ التقرير: ${reportDate}   |   إجمالي السجلات: ${rows.length}`,
                        { size: 18, color: '555555', italic: true, spacing: { before: 100, after: 200 } },
                    ),
                    new Table({
                        width: { size: totalDxa, type: WidthType.DXA },
                        columnWidths: colWidths,
                        rows: [
                            new TableRow({
                                tableHeader: true,
                                children: headers.map((h, i) =>
                                    makeCell(h, { isHeader: true, width: colWidths[i], center: i === hashColIdx })
                                ),
                            }),
                            ...rows.map((row, ri) =>
                                new TableRow({
                                    children: row.map((cell, ci) =>
                                        makeCell(cell, { isHeader: false, width: colWidths[ci], center: ci === hashColIdx, altRow: ri % 2 !== 0 })
                                    ),
                                })
                            ),
                        ],
                    }),
                ],
            }],
        });

        let blob;
        if (typeof Packer.toBlob === 'function') {
            blob = await Packer.toBlob(doc);
        } else {
            const buf = await Packer.toBuffer(doc);
            blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        }
        triggerDownload(blob, filename);

    } catch (err) {
        console.error('[exportWord] failed:', err);
        throw err;
    }
}

// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════
function resolveCertUrl(url) {
    if (!url) return null;
    if (url === 'uploaded') return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_HOST}${url}`;
    return url;
}

function fmtDate(val) {
    if (!val) return '';
    try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return String(val);
        return d.toISOString().split('T')[0];
    } catch { return String(val); }
}

function toStatusKey(s) {
    if (!s) return 'Pending';
    const map = { pending: 'Pending', approved: 'Approved', sent: 'Sent', sent_to_bank: 'Sent', rejected: 'Rejected' };
    return map[String(s).toLowerCase()] ?? s;
}

// ════════════════════════════════════════════════════════════════════════════
// PAGINATION COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, accentColor = '#0865a8' }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    const buildPages = () => {
        const pages = []; const delta = 2; const left = currentPage - delta; const right = currentPage + delta;
        for (let i = 1; i <= totalPages; i++) { if (i === 1 || i === totalPages || (i >= left && i <= right)) pages.push(i); }
        const result = []; let prev = null;
        for (const p of pages) { if (prev !== null && p - prev > 1) result.push('...'); result.push(p); prev = p; }
        return result;
    };
    const pages = buildPages();
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '14px 18px', borderTop: '1.5px solid #e5e7eb', background: '#f5f7fa', fontFamily: '"Droid Arabic Kufi", serif', direction: 'rtl' }}>
            <span style={{ fontSize: '.72rem', color: '#6b7280', fontWeight: 700 }}>
                عرض <strong style={{ color: '#111827' }}>{start}</strong> – <strong style={{ color: '#111827' }}>{end}</strong> من إجمالي <strong style={{ color: accentColor }}>{totalItems}</strong> سجل
            </span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <button disabled={currentPage === 1} onClick={() => onPageChange(1)} style={pgBtnStyle(false, currentPage === 1, accentColor, true)} title="الأولى">«</button>
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} style={pgBtnStyle(false, currentPage === 1, accentColor, true)} title="السابقة">‹</button>
                {pages.map((p, i) => p === '...' ? <span key={`el-${i}`} style={{ padding: '0 4px', color: '#9ca3af', fontSize: '.78rem', userSelect: 'none' }}>…</span> : <button key={p} onClick={() => onPageChange(p)} style={pgBtnStyle(p === currentPage, false, accentColor, false)}>{p}</button>)}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} style={pgBtnStyle(false, currentPage === totalPages, accentColor, true)} title="التالية">›</button>
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} style={pgBtnStyle(false, currentPage === totalPages, accentColor, true)} title="الأخيرة">»</button>
            </div>
        </div>
    );
};

function pgBtnStyle(isActive, isDisabled, accent, isNav) {
    return { minWidth: isNav ? 32 : 34, height: 34, padding: `0 ${isNav ? '8px' : '6px'}`, borderRadius: 8, border: isActive ? `2px solid ${accent}` : '1.5px solid #d1d5db', background: isActive ? accent : isDisabled ? '#f5f7fa' : '#ffffff', color: isActive ? '#fff' : isDisabled ? '#d1d5db' : '#374151', fontFamily: '"Droid Arabic Kufi", serif', fontSize: isNav ? '1rem' : '.78rem', fontWeight: 700, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1, transition: 'all .14s', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? `0 2px 8px ${accent}44` : 'none' };
}

// ════════════════════════════════════════════════════════════════════════════
// DATA NORMALIZERS
// ════════════════════════════════════════════════════════════════════════════
function normalizeUser(u) {
    return {
        id: u.id,
        username: u.username ?? u.email ?? '',
        firstName: u.firstName ?? u.first_name ?? (u.username ?? '').split(' ')[0] ?? '',
        lastName: u.lastName ?? u.last_name ?? (u.username ?? '').split(' ').slice(1).join(' ') ?? '',
        email: u.email ?? '',
        enrolledCourses: (u.courses ?? []).map(c => ({
            enrollmentId: c.enrollmentId,
            id: c.planworkId ?? c.PlanworkId ?? c.planwork_id ?? c.courseId ?? c.serviceId ?? null,
            title: c.title ?? c.serviceTitle ?? '—',
            date: fmtDate(c.enrolledAt),
            attended: !!(c.attended),
            certificateUrl: c.certificateUrl ?? null,
            certificateName: c.certificateName ?? null,
            _userId: u.id,
            _titleRaw: c.title ?? c.serviceTitle ?? '',
        })),
    };
}

function normalizeCourse(c) {
    return {
        id: c.id,
        title: c.serviceTitle ?? c.title ?? '—',
        category: c.category ?? c.type ?? '',
        enrolledUsers: (c.users ?? []).map(u => {
            const nameParts = (u.username ?? '').trim().split(' ');
            return {
                enrollmentId: u.enrollmentId ?? null,
                id: u.id ?? u.userId ?? null,
                username: u.username ?? u.email ?? '',
                firstName: u.firstName ?? nameParts[0] ?? '',
                lastName: u.lastName ?? nameParts.slice(1).join(' ') ?? '',
                email: u.email ?? '',
                date: fmtDate(u.enrolledAt),
                attended: !!(u.attended ?? false),
                certificateUrl: u.certificateUrl ?? null,
                certificateName: u.certificateName ?? null,
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

function normalizeCert(cert) {
    const rawUrl = cert.fileUrl ?? cert.FileUrl ?? cert.url ?? null;
    return {
        id: cert.id ?? cert.Id,
        userId: cert.userId ?? cert.UserId,
        username: cert.username ?? cert.Username ?? '',
        planworkId: cert.planworkId ?? cert.PlanworkId,
        planworkTitle: cert.planworkTitle ?? cert.PlanworkTitle ?? '',
        fileUrl: resolveCertUrl(rawUrl),
        rawFileUrl: rawUrl,
        fileName: cert.fileName ?? cert.FileName ?? (rawUrl ? rawUrl.split('/').pop() : 'certificate'),
        uploadedAt: fmtDate(cert.uploadedAt ?? cert.UploadedAt),
    };
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const exportRef = useRef(null);
    const exportAttRef = useRef(null);
    const exportCertRef = useRef(null);
    const exportRefundRef = useRef(null);

    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    React.useEffect(() => { coursesDataRef.current = coursesData; }, [coursesData]);
    const [apiStats, setApiStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [exportAttMenuOpen, setExportAttMenuOpen] = useState(false);
    const [exportCertMenuOpen, setExportCertMenuOpen] = useState(false);
    const [exportRefMenuOpen, setExportRefMenuOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    const [usersPage, setUsersPage] = useState(1);
    const [coursesPage, setCoursesPage] = useState(1);
    const [attPage, setAttPage] = useState(1);
    const [certPage, setCertPage] = useState(1);
    const [refundPage, setRefundPage] = useState(1);

    const [attendance, setAttendance] = useState({});
    const [attendanceSaving, setAttendanceSaving] = useState({});
    const [attError, setAttError] = useState(null);
    const [attCourseFilter, setAttCourseFilter] = useState('all');
    const [attUserSearch, setAttUserSearch] = useState('');

    const [certificates, setCertificates] = useState({});
    const [certUploading, setCertUploading] = useState({});
    const [certDeleting, setCertDeleting] = useState({});
    const [certError, setCertError] = useState(null);
    const [certModal, setCertModal] = useState(null);
    const [certDragOver, setCertDragOver] = useState(false);
    const certFileInputRef = useRef(null);
    const coursesDataRef = useRef([]);
    const usersDataRef = useRef([]);
    const [certSearch, setCertSearch] = useState('');
    const [certStatusFilter, setCertStatusFilter] = useState('all');

    React.useEffect(() => { usersDataRef.current = usersData; }, [usersData]);

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

    useEffect(() => { setUsersPage(1); setExpandedRow(null); }, [searchQuery, dateFrom, dateTo]);
    useEffect(() => { setCoursesPage(1); setExpandedRow(null); }, [searchQuery, dateFrom, dateTo]);
    useEffect(() => { setUsersPage(1); setCoursesPage(1); setExpandedRow(null); }, [activeTab]);
    useEffect(() => { setAttPage(1); }, [attCourseFilter, attUserSearch]);
    useEffect(() => { setCertPage(1); }, [certSearch, certStatusFilter]);
    useEffect(() => { setRefundPage(1); }, [refundSearch, refundStatusFilter]);

    const authFetch = useCallback(async (url, options = {}) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
    }, [getToken]);

    const authFetchForm = useCallback(async (url, formData) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        return fetch(url, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData });
    }, [getToken]);

    const fetchRefunds = useCallback(async (statusFilter = 'all') => {
        setRefundsLoading(true); setRefundsError(null);
        try {
            const qs = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
            const res = await authFetch(`${API_BASE}/refund/admin/all${qs}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const raw = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.items) ? json.items : [];
            setRefunds(raw.map(normalizeRefund));
        } catch (err) {
            console.error('Refunds fetch error:', err);
            setRefundsError('فشل تحميل طلبات الاسترداد: ' + err.message);
        } finally { setRefundsLoading(false); }
    }, [authFetch]);

    const commitRefundAction = async () => {
        if (!refundActionModal) return;
        const { refund: r, action } = refundActionModal;
        if (action === 'reject' && !refundActionNote.trim()) return;
        setRefundActionSaving(true); setRefundActionError('');
        try {
            const endpoint = { approve: `${API_BASE}/refund/${r.id}/approve`, reject: `${API_BASE}/refund/${r.id}/reject`, send_to_bank: `${API_BASE}/refund/${r.id}/sent` }[action];
            const body = {};
            if (action === 'reject') body.rejectionReason = refundActionNote.trim();
            if (action === 'approve') body.adminNote = refundActionNote.trim();
            if (action === 'send_to_bank') body.adminNote = refundActionNote.trim();
            const res = await authFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) });
            if (!res.ok) { const errJson = await res.json().catch(() => ({})); throw new Error(errJson?.message ?? errJson?.error ?? `HTTP ${res.status}`); }
            const updated = await res.json();
            const normalized = normalizeRefund(updated);
            if (action === 'send_to_bank') {
                const bankRes = normalized.bankResult ?? updated?.bankResult ?? updated?.BankResult ?? null;
                if (bankRes === 'SUCCESS' || bankRes === 'success') { setBankResultBanner({ type: 'success', refundId: r.id, msg: `✅ نجح التحويل البنكي — الفلوس رجعت على الكارت تلقائياً (${r.refNumber || r.id})` }); }
                else if (bankRes === 'FAILED' || bankRes === 'failed') { setBankResultBanner({ type: 'failed', refundId: r.id, msg: `⚠️ فشل التحويل البنكي — يتم التحويل يدوياً على IBAN: ${r.iban || '—'}` }); }
                setTimeout(() => setBankResultBanner(null), 12000);
            }
            setRefundActionModal(null); setRefundActionNote(''); setRefundDetailModal(null);
            await fetchRefunds(refundStatusFilter);
        } catch (err) {
            console.error('Refund action error:', err);
            setRefundActionError(err.message || 'حدث خطأ أثناء تنفيذ الإجراء');
        } finally { setRefundActionSaving(false); }
    };

    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) { navigate('/'); }
    }, [isLoaded, user, navigate]);

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                const [usersRes, coursesRes, statsRes] = await Promise.all([authFetch(`${API_BASE}/Admin/users`), authFetch(`${API_BASE}/Admin/planworks`), authFetch(`${API_BASE}/Admin/stats`)]);
                let usersRaw = [], coursesRaw = [], statsRaw = null;
                if (usersRes.ok) { const j = await usersRes.json(); usersRaw = Array.isArray(j) ? j : j?.data ?? j?.users ?? j?.result ?? []; }
                else { const errText = await usersRes.text().catch(() => ''); setError(`Users API ${usersRes.status}: ${errText.slice(0, 200)}`); }
                if (coursesRes.ok) { const j = await coursesRes.json(); coursesRaw = Array.isArray(j) ? j : j?.data ?? j?.planWorks ?? j?.planworks ?? j?.courses ?? j?.result ?? []; }
                if (statsRes.ok) statsRaw = await statsRes.json();
                const normalizedUsers = usersRaw.map(u => normalizeUser(u)).filter(u => u.id != null);
                const normalizedCourses = coursesRaw.map(c => normalizeCourse(c)).filter(c => c.id != null);
                setUsersData(normalizedUsers); setCoursesData(normalizedCourses); setApiStats(statsRaw);
                seedAttendance(normalizedUsers);
                await loadCertificatesFromApi(normalizedUsers);
            } catch (err) { setError(err.message || 'حدث خطأ أثناء تحميل البيانات'); }
            finally { setLoading(false); }
        };
        if (isLoaded && user) load();
    }, [isLoaded, user, authFetch]);

    useEffect(() => { if (activeTab === 'refunds') fetchRefunds(); }, [activeTab, fetchRefunds]);
    useEffect(() => { if (activeTab === 'refunds') fetchRefunds(refundStatusFilter); }, [refundStatusFilter]); // eslint-disable-line

    // Auto-refresh certs from GET /api/Admin/certificates whenever the tab is opened
    useEffect(() => { if (activeTab === 'certificates') refreshCertificates(); }, [activeTab]); // eslint-disable-line

    useEffect(() => {
        const h = e => {
            if (exportRef.current && !exportRef.current.contains(e.target)) setExportMenuOpen(false);
            if (exportAttRef.current && !exportAttRef.current.contains(e.target)) setExportAttMenuOpen(false);
            if (exportCertRef.current && !exportCertRef.current.contains(e.target)) setExportCertMenuOpen(false);
            if (exportRefundRef.current && !exportRefundRef.current.contains(e.target)) setExportRefMenuOpen(false);
        };
        document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);

    // ════════════════════════════════════════════════════════════════════════
    // CERT FUNCTION 1 — loadCertificatesFromApi
    // ════════════════════════════════════════════════════════════════════════
    const loadCertificatesFromApi = useCallback(async (_usersArr) => {
        try {
            const res = await authFetch(`${API_BASE}/Admin/certificates`);
            if (!res.ok) { console.warn('[Certs] GET /Admin/certificates failed:', res.status); return; }
            const json = await res.json();
            const certsArr = Array.isArray(json) ? json : json?.data ?? json?.certificates ?? json?.result ?? [];

            const map = {};
            certsArr.forEach(raw => {
                const certId = raw.id ?? raw.Id ?? null;
                const userId = raw.userId ?? raw.UserId ?? null;
                const planworkId = raw.planworkId ?? raw.PlanworkId ?? null;
                const rawFileUrl = raw.fileUrl ?? raw.FileUrl ?? raw.filePath ?? raw.FilePath ?? null;
                const fileName = raw.fileName ?? raw.FileName ?? (rawFileUrl ? rawFileUrl.split('/').pop().split('?')[0] : 'certificate');
                const uploadedAt = fmtDate(raw.uploadedAt ?? raw.UploadedAt ?? null);
                let fileUrl = null;
                if (rawFileUrl && rawFileUrl !== 'uploaded') {
                    fileUrl = rawFileUrl.startsWith('http') ? rawFileUrl : `${API_HOST}${rawFileUrl}`;
                }

                if (!certId || userId == null || planworkId == null) {
                    console.warn('[Certs] skipping — missing fields. raw:', JSON.stringify(raw));
                    return;
                }

                const key = `${Number(userId)}-${Number(planworkId)}`;
                console.log('[Certs] storing key:', key, '| certId:', certId, '| file:', fileName);
                map[key] = { certId, name: fileName, url: fileUrl, rawUrl: rawFileUrl, size: null, fromDb: true, uploadedAt, userId, planworkId };
            });
            console.log('[Certs] total certs loaded:', Object.keys(map).length, '| keys:', Object.keys(map));
            setCertificates(map);
        } catch (err) { console.warn('[Certs] loadCertificatesFromApi failed:', err.message); }
    }, [authFetch]);

    // ── refreshCertificates: always re-fetches from server ──────────────────
    const refreshCertificates = useCallback(async () => {
        await loadCertificatesFromApi();
    }, [loadCertificatesFromApi]);

    const seedAttendance = useCallback((users) => {
        const map = {};
        users.forEach(u => { u.enrolledCourses.forEach(c => { if (c.enrollmentId != null) map[String(c.enrollmentId)] = !!c.attended; }); });
        setAttendance(map);
    }, []);

    const toggleAttendance = async (enrollmentId, currentVal) => {
        if (enrollmentId == null) { setAttError('لا يوجد enrollmentId لهذا التسجيل'); return; }
        const k = String(enrollmentId); const newVal = !currentVal;
        setAttendance(p => ({ ...p, [k]: newVal })); setAttendanceSaving(p => ({ ...p, [k]: true })); setAttError(null);
        try {
            const res = await authFetch(`${API_BASE}/Admin/enrollments/${enrollmentId}/attendance`, { method: 'PATCH', body: JSON.stringify(newVal) });
            if (!res.ok) { const errJson = await res.json().catch(() => ({})); throw new Error(errJson?.message ?? `HTTP ${res.status}`); }
        } catch (err) { setAttendance(p => ({ ...p, [k]: currentVal })); setAttError('فشل تحديث الحضور: ' + err.message); }
        finally { setAttendanceSaving(p => ({ ...p, [k]: false })); }
    };

    // ════════════════════════════════════════════════════════════════════════
    // handleCertFile — auto-refreshes after every upload / update
    // ════════════════════════════════════════════════════════════════════════
    const handleCertFile = async (enrollmentId, userId, planworkId, file) => {
        if (!file) return;
        const fallbackKey = `${Number(userId)}-${Number(planworkId)}`;

        setCertUploading(p => ({ ...p, [fallbackKey]: true }));
        setCertError(null);
        try {
            const existing = certificates[fallbackKey];

            let uploadRes, uploadText;

            if (existing?.certId != null) {
                // ── UPDATE: PUT /api/Admin/certificates  { CertificateId, File } ──
                const fd = new FormData();
                fd.append('CertificateId', Number(existing.certId));
                fd.append('File', file, file.name);
                let token = null; try { token = await getToken(); } catch (_) { }
                uploadRes = await fetch(`${API_BASE}/Admin/certificates`, {
                    method: 'PUT',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: fd,
                });
                uploadText = await uploadRes.text();
            } else {
                // ── NEW UPLOAD: POST /api/Admin/upload  { UserId, PlanworkId, File } ──
                const fd = new FormData();
                if (userId != null) fd.append('UserId', Number(userId));
                if (planworkId != null) fd.append('PlanworkId', Number(planworkId));
                if (enrollmentId != null) fd.append('EnrollmentId', Number(enrollmentId));
                fd.append('File', file, file.name);
                uploadRes = await authFetchForm(`${API_BASE}/Admin/upload`, fd);
                uploadText = await uploadRes.text();
            }

            if (!uploadRes.ok) {
                let msg = `HTTP ${uploadRes.status}`;
                try { const j = JSON.parse(uploadText); msg = j?.message ?? j?.error ?? j?.title ?? j?.detail ?? msg; }
                catch { if (uploadText.trim().length < 400) msg = uploadText.trim(); }
                throw new Error(msg);
            }

            // ── Always refresh full cert list from server after upload/update ──
            await refreshCertificates();

        } catch (err) {
            console.error('[CertUpload] failed:', err);
            setCertError('فشل رفع الشهادة: ' + err.message);
        } finally {
            setCertUploading(p => ({ ...p, [fallbackKey]: false }));
            setCertModal(null);
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    // viewCert
    // ════════════════════════════════════════════════════════════════════════
    const viewCert = useCallback(async (certId, url, rawUrl, filename = 'certificate', userId = null, planworkId = null) => {
        if (certId == null && !url && !rawUrl && userId == null) return;
        let token = null; try { token = await getToken(); } catch (_) { }
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

        let fileUrl = null;
        if (userId != null && planworkId != null) {
            try {
                const metaRes = await fetch(`${API_BASE}/Admin/certificates/${userId}/${planworkId}`, { headers: authHeaders });
                if (metaRes.ok) {
                    const meta = await metaRes.json();
                    const obj = Array.isArray(meta) ? meta[0] : meta;
                    const fu = obj?.fileUrl ?? obj?.FileUrl ?? obj?.url ?? obj?.Url ?? null;
                    if (fu && fu !== 'uploaded') {
                        fileUrl = fu.startsWith('http') ? fu : `${API_HOST}${fu}`;
                    }
                }
            } catch (_) { }
        }

        if (!fileUrl && url && url !== 'uploaded') fileUrl = url;
        if (!fileUrl && rawUrl) fileUrl = rawUrl.startsWith('http') ? rawUrl : `${API_HOST}${rawUrl}`;

        if (fileUrl) {
            const isExternal = fileUrl.includes('blob.core.windows.net') ||
                fileUrl.includes('amazonaws.com') ||
                fileUrl.includes('storage.googleapis.com') ||
                fileUrl.includes('cloudinary.com');
            if (isExternal) { window.open(fileUrl, '_blank'); return; }

            try {
                const fileRes = await fetch(fileUrl, { headers: authHeaders });
                if (fileRes.ok) {
                    const ct = fileRes.headers.get('content-type') ?? '';
                    if (!ct.includes('application/json')) {
                        const blob = await fileRes.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        const fname = filename || 'certificate';
                        const isPdf = ct.includes('pdf') || blob.type.includes('pdf') || fname.toLowerCase().endsWith('.pdf');
                        if (isPdf) {
                            const win = window.open('', '_blank');
                            if (win) win.document.write(`<!DOCTYPE html><html><head><title>${fname}</title></head><body style="margin:0"><iframe src="${blobUrl}" style="width:100%;height:100vh;border:none"></iframe></body></html>`);
                        } else {
                            window.open(blobUrl, '_blank');
                        }
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 90000);
                        return;
                    }
                }
            } catch (_) { }
            window.open(fileUrl, '_blank');
            return;
        }

        setCertError('تعذّر فتح الشهادة — تأكد من صلاحية الجلسة أو تواصل مع المطور');
    }, [getToken]);

    // ════════════════════════════════════════════════════════════════════════
    // deleteCert — auto-refreshes after deletion
    // ════════════════════════════════════════════════════════════════════════
    const deleteCert = useCallback(async (ck, altKey = null) => {
        const cert = certificates[ck] ?? (altKey ? certificates[altKey] : undefined);
        const certId = cert?.certId;
        if (!window.confirm('هل تريد حذف هذه الشهادة؟')) return;
        setCertDeleting(p => ({ ...p, [ck]: true })); setCertError(null);
        try {
            if (certId != null) {
                const res = await authFetch(`${API_BASE}/Admin/certificates/${certId}`, { method: 'DELETE' });
                if (!res.ok && res.status !== 404) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.message ?? j?.title ?? `HTTP ${res.status}`);
                }
            }
            // ── Auto-refresh from server after delete ──
            await refreshCertificates();
        } catch (err) {
            console.error('[deleteCert]', err);
            setCertError('فشل حذف الشهادة: ' + err.message);
        } finally {
            setCertDeleting(p => ({ ...p, [ck]: false }));
        }
    }, [authFetch, certificates, refreshCertificates]);


    // ════════════════════════════════════════════════════════════════════════
    // DERIVED DATA
    // ════════════════════════════════════════════════════════════════════════
    const inRange = d => {
        if (!dateFrom && !dateTo) return true; if (!d) return false;
        const dt = new Date(d); if (isNaN(dt.getTime())) return false;
        if (dateFrom && dt < new Date(dateFrom)) return false;
        if (dateTo) { const toEnd = new Date(dateTo); toEnd.setDate(toEnd.getDate() + 1); if (dt >= toEnd) return false; }
        return true;
    };

    const q = searchQuery.toLowerCase();
    const filteredUsers = usersData.map(u => ({ ...u, enrolledCourses: u.enrolledCourses.filter(c => inRange(c.date)) })).filter(u => { const matchSearch = `${u.firstName} ${u.lastName} ${u.email} ${u.username}`.toLowerCase().includes(q); if ((dateFrom || dateTo) && u.enrolledCourses.length === 0) return false; return matchSearch; });
    const filteredCourses = coursesData.map(c => ({ ...c, enrolledUsers: c.enrolledUsers.filter(u => inRange(u.date)) })).filter(c => { const matchSearch = `${c.title} ${c.category}`.toLowerCase().includes(q); if ((dateFrom || dateTo) && c.enrolledUsers.length === 0) return false; return matchSearch; });

    const paginatedUsers = filteredUsers.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE);
    const paginatedCourses = filteredCourses.slice((coursesPage - 1) * ITEMS_PER_PAGE, coursesPage * ITEMS_PER_PAGE);

    const attRows = usersData.flatMap(u => u.enrolledCourses.filter(c => c.enrollmentId != null).map(c => ({ user: u, course: c }))).filter(r => { const mc = attCourseFilter === 'all' || r.course.id === Number(attCourseFilter); const mu = `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.user.username}`.toLowerCase().includes(attUserSearch.toLowerCase()); return mc && mu; });
    const attCount = attRows.filter(r => !!attendance[String(r.course.enrollmentId)]).length;

    const certsByUser = {};
    Object.values(certificates).forEach(ce => {
        if (!ce || ce.userId == null || ce.planworkId == null) return;
        const uid = Number(ce.userId);
        if (!certsByUser[uid]) certsByUser[uid] = [];
        certsByUser[uid].push(ce);
    });

    const certRows = usersData.flatMap(u => u.enrolledCourses.map(c => {
        const matchedCourse = coursesData.find(cd =>
            cd.title === (c._titleRaw || c.title) ||
            cd.title === c.title
        );
        const resolvedPlanworkId = c.id ?? matchedCourse?.id ?? null;

        const eidKey = c.enrollmentId != null ? String(c.enrollmentId) : null;
        const fallbackKey = resolvedPlanworkId != null
            ? `${Number(u.id)}-${Number(resolvedPlanworkId)}`
            : null;

        const userCerts = certsByUser[Number(u.id)] ?? [];
        const titleMatch = userCerts.find(ce => {
            const mc = coursesData.find(cd => Number(cd.id) === Number(ce.planworkId));
            return mc && (mc.title === (c._titleRaw || c.title) || mc.title === c.title);
        });
        const titleMatchKey = titleMatch
            ? `${Number(u.id)}-${Number(titleMatch.planworkId)}`
            : null;

        const certKey = fallbackKey ?? titleMatchKey ?? eidKey ?? `${u.id}-unknown`;
        const altKey = certKey !== titleMatchKey ? titleMatchKey : (certKey !== eidKey ? eidKey : null);
        const finalPlanworkId = resolvedPlanworkId ?? titleMatch?.planworkId ?? null;

        return { user: u, course: c, certKey, altKey, enrollmentId: c.enrollmentId, userId: u.id, planworkId: finalPlanworkId };
    })).filter(r => {
        const matchSearch = `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.user.username} ${r.course.title}`.toLowerCase().includes(certSearch.toLowerCase());
        const hasCert = !!(certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined));
        const isAtt = !!attendance[String(r.enrollmentId)];
        const matchStatus = certStatusFilter === 'all' ? true : certStatusFilter === 'uploaded' ? hasCert : certStatusFilter === 'pending' ? (!hasCert && isAtt) : certStatusFilter === 'not-attended' ? !isAtt : true;
        return matchSearch && matchStatus;
    });

    const totalCerts = (() => { const seen = new Set(); let n = 0; Object.values(certificates).forEach(v => { const key = v?.certId ?? `_noId_${n}`; if (!seen.has(key)) { seen.add(key); n++; } }); return n; })();
    const totalEnrollments = usersData.reduce((s, u) => s + u.enrolledCourses.length, 0);

    const gs = (fields, fb) => { if (!apiStats) return fb; for (const f of fields) { if (apiStats[f] != null) return apiStats[f]; } return fb; };
    const displayStats = {
        users: gs(['usersCount'], usersData.length), courses: gs(['planworksCount'], coursesData.length),
        enrollments: gs(['enrollmentsCount'], totalEnrollments), attended: gs(['attendanceCount'], attCount),
        certificates: gs(['certificatesCount'], totalCerts), refundsPending: gs(['refundsCount'], refunds.filter(r => r.status === 'Pending').length),
    };

    const refundSearch_q = refundSearch.toLowerCase();
    const filteredRefunds = refunds.filter(r => {
        const u = usersData.find(u => u.id === r.userId); const c = coursesData.find(c => c.id === r.courseId);
        const matchStatus = refundStatusFilter === 'all' || r.status === toStatusKey(refundStatusFilter);
        const matchSearch = !refundSearch_q || [r.refNumber, r.orderId, r.reason, u ? `${u.firstName} ${u.lastName}` : '', c?.title ?? '', String(r.amount)].join(' ').toLowerCase().includes(refundSearch_q);
        return matchStatus && matchSearch;
    });

    const refundStats = { total: refunds.length, pending: refunds.filter(r => r.status === 'Pending').length, approved: refunds.filter(r => r.status === 'Approved').length, sent: refunds.filter(r => r.status === 'Sent').length, rejected: refunds.filter(r => r.status === 'Rejected').length, totalAmount: refunds.filter(r => r.status !== 'Rejected').reduce((s, r) => s + (r.amount || 0), 0) };
    const refundUserLookup = id => usersData.find(u => u.id === id) ?? { firstName: '—', lastName: '', email: '—' };
    const refundCourseLookup = id => coursesData.find(c => c.id === id) ?? { title: '—' };

    const paginatedAttRows = attRows.slice((attPage - 1) * ITEMS_PER_PAGE, attPage * ITEMS_PER_PAGE);
    const paginatedCertRows = certRows.slice((certPage - 1) * ITEMS_PER_PAGE, certPage * ITEMS_PER_PAGE);
    const paginatedRefunds = filteredRefunds.slice((refundPage - 1) * ITEMS_PER_PAGE, refundPage * ITEMS_PER_PAGE);

    // ════════════════════════════════════════════════════════════════════════
    // EXPORT
    // ════════════════════════════════════════════════════════════════════════
    const withExport = fn => async () => {
        setExporting(true);
        setExportMenuOpen(false); setExportAttMenuOpen(false); setExportCertMenuOpen(false); setExportRefMenuOpen(false);
        setExportError(null);
        try { await fn(); } catch (e) { console.error(e); setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); }
        finally { setExporting(false); }
    };

    const doExcel = withExport(async () => {
        const raw = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses);
        const { headers, rows } = rtlExport(raw.headers, raw.rows);
        await exportExcel(activeTab === 'users' ? 'المستخدمون-والدورات.xlsx' : 'الدورات-والمستخدمون.xlsx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows);
    });
    const doPDF = withExport(async () => {
        const raw = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses);
        const { headers, rows } = rtlExport(raw.headers, raw.rows);
        await exportPDF(activeTab === 'users' ? 'تقرير-المستخدمين.pdf' : 'تقرير-الدورات.pdf', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows, 'ICEMT');
    });
    const doWord = withExport(async () => {
        const raw = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses);
        const { headers, rows } = rtlExport(raw.headers, raw.rows);
        await exportWord(activeTab === 'users' ? 'تقرير-المستخدمين.docx' : 'تقرير-الدورات.docx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', 'ICEMT', headers, rows);
    });

    const buildAttRows = () => {
        const headers = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'الحضور'];
        const rows = attRows.map((r, i) => [i + 1, `${r.user.firstName || r.user.username} ${r.user.lastName}`.trim(), r.user.email, r.course.title, attendance[String(r.course.enrollmentId)] ? 'حضر' : 'غائب']);
        return { headers, rows };
    };
    const doAttExcel = withExport(async () => { const raw = buildAttRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportExcel('تقرير-الحضور.xlsx', 'تقرير الحضور', headers, rows); });
    const doAttPDF = withExport(async () => { const raw = buildAttRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportPDF('تقرير-الحضور.pdf', 'تقرير الحضور', headers, rows, 'ICEMT'); });
    const doAttWord = withExport(async () => { const raw = buildAttRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportWord('تقرير-الحضور.docx', 'تقرير الحضور', 'ICEMT', headers, rows); });

    const buildCertRows = () => {
        const headers = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'الحضور', 'الشهادة'];
        const rows = certRows.map((r, i) => {
            const cert = certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined);
            const isAtt = !!attendance[String(r.enrollmentId)];
            return [i + 1, `${r.user.firstName || r.user.username} ${r.user.lastName}`.trim(), r.user.email, r.course.title, isAtt ? 'حضر' : 'غائب', cert ? (cert.name && cert.name !== 'uploaded' ? cert.name : 'مرفوعة') : 'لم تُرفع'];
        });
        return { headers, rows };
    };
    const doCertExcel = withExport(async () => { const raw = buildCertRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportExcel('تقرير-الشهادات.xlsx', 'تقرير الشهادات', headers, rows); });
    const doCertPDF = withExport(async () => { const raw = buildCertRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportPDF('تقرير-الشهادات.pdf', 'تقرير الشهادات', headers, rows, 'ICEMT'); });
    const doCertWord = withExport(async () => { const raw = buildCertRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportWord('تقرير-الشهادات.docx', 'تقرير الشهادات', 'ICEMT', headers, rows); });

    const buildRefundRows = () => {
        const headers = ['#', 'رقم الطلب', 'المستخدم', 'البريد الإلكتروني', 'الدورة', 'المبلغ', 'العملة', 'الحالة', 'السبب', 'تاريخ الطلب'];
        const rows = filteredRefunds.map((r, i) => {
            const u = refundUserLookup(r.userId); const c = refundCourseLookup(r.courseId);
            const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
            return [i + 1, r.refNumber || r.id, `${u.firstName} ${u.lastName}`.trim(), u.email, c.title, r.amount, r.currency, sm.label, r.reason || '', r.requestedAt || ''];
        });
        return { headers, rows };
    };
    const doRefundExcel = withExport(async () => { const raw = buildRefundRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportExcel('تقرير-المستردات.xlsx', 'تقرير المستردات', headers, rows); });
    const doRefundPDF = withExport(async () => { const raw = buildRefundRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportPDF('تقرير-المستردات.pdf', 'تقرير المستردات', headers, rows, 'ICEMT'); });
    const doRefundWord = withExport(async () => { const raw = buildRefundRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportWord('تقرير-المستردات.docx', 'تقرير المستردات', 'ICEMT', headers, rows); });

    // ════════════════════════════════════════════════════════════════════════
    // EARLY RETURNS
    // ════════════════════════════════════════════════════════════════════════
    if (!isLoaded || !user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5f7fa' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#0865a8', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 16px' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <p style={{ color: '#0865a8', fontFamily: '"Droid Arabic Kufi", serif', fontSize: '0.9rem' }}>جاري التحقق...</p>
            </div>
        </div>
    );
    if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) return null;

    const isExportTab = activeTab === 'users' || activeTab === 'courses';

    const TABS = [
        { id: 'users', label: 'المستخدمون', icon: '👤', colorCls: '' },
        { id: 'courses', label: 'الدورات', icon: '📚', colorCls: 'or' },
        { id: 'attendance', label: 'الحضور', icon: '✅', colorCls: 'gr' },
        { id: 'certificates', label: 'الشهادات', icon: '📜', colorCls: 'pu' },
        { id: 'refunds', label: 'المستردات', icon: '💳', colorCls: 'rd' },
    ];

    const STATS = [
        { label: 'المستخدمون', value: displayStats.users, icon: '👤', accent: '#0865a8', bg: 'linear-gradient(135deg,rgba(8,101,168,0.1) 0%,rgba(8,101,168,0.04) 100%)', border: 'rgba(8,101,168,0.22)' },
        { label: 'الدورات', value: displayStats.courses, icon: '📚', accent: '#f57c00', bg: 'linear-gradient(135deg,rgba(245,124,0,0.1) 0%,rgba(245,124,0,0.04) 100%)', border: 'rgba(245,124,0,0.22)' },
        { label: 'التسجيلات', value: displayStats.enrollments, icon: '🔗', accent: '#0865a8', bg: 'linear-gradient(135deg,rgba(8,101,168,0.06) 0%,rgba(8,101,168,0.02) 100%)', border: 'rgba(8,101,168,0.14)' },
        { label: 'حضروا', value: displayStats.attended, icon: '🎓', accent: '#f57c00', bg: 'linear-gradient(135deg,rgba(245,124,0,0.06) 0%,rgba(245,124,0,0.02) 100%)', border: 'rgba(245,124,0,0.14)' },
        { label: 'الشهادات', value: displayStats.certificates, icon: '📜', accent: '#0865a8', bg: 'linear-gradient(135deg,rgba(8,101,168,0.08) 0%,rgba(8,101,168,0.03) 100%)', border: 'rgba(8,101,168,0.18)' },
        { label: 'المستردات', value: displayStats.refundsPending, icon: '💳', accent: '#f57c00', bg: 'linear-gradient(135deg,rgba(245,124,0,0.08) 0%,rgba(245,124,0,0.03) 100%)', border: 'rgba(245,124,0,0.18)' },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes d-spin    { to { transform: rotate(360deg) } }
        @keyframes d-fadeUp  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes d-slideIn { from { opacity: 0; transform: translateX(8px)  } to { opacity: 1; transform: translateX(0) } }
        @keyframes d-pulse   { 0%,100%{ opacity:1 } 50%{ opacity:.5 } }
        @keyframes d-slideDown { from { opacity:0; transform:translateY(-14px) } to { opacity:1; transform:translateY(0) } }

        :root {
          --blue:    #0865a8;
          --blue-lt: rgba(8,101,168,0.08);
          --blue-md: rgba(8,101,168,0.15);
          --orange:  #f57c00;
          --orng-lt: rgba(245,124,0,0.08);
          --orng-md: rgba(245,124,0,0.15);
          --black:   #111827;
          --white:   #ffffff;
          --gray1: #374151; --gray2: #6b7280; --gray3: #9ca3af; --gray4: #d1d5db; --gray5: #e5e7eb;
          --bg:    #f0f4f8;
          --card-bg: #ffffff; --card-border: #e5e7eb;
          --radius: 12px;
          --shadow: 0 2px 12px rgba(8,101,168,0.07), 0 1px 3px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 20px rgba(8,101,168,0.11), 0 2px 6px rgba(0,0,0,0.05);
          --navbar-h:   ${NAVBAR_H}px;
          --overview-h: ${OVERVIEW_H}px;
          --total-offset: ${NAVBAR_H + OVERVIEW_H}px;
          --sidebar-w:  200px;
          --font: "Droid Arabic Kufi", serif;
        }

        .d-root { font-family: var(--font); direction: rtl; min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%); padding-top: var(--total-offset); color: var(--black); display: flex; align-items: flex-start; }
        ._ovr { position: fixed; top: var(--navbar-h); left: 0; z-index: 1050; width: 100%; height: var(--overview-h); background: #F5F7E1; border-bottom: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-family: var(--font); font-size: clamp(0.72rem, 1.3vw, 0.82rem); }
        ._ovr a { margin-left: 6px; color: #374151; text-decoration: none; font-weight: 600; transition: color .15s; }
        ._ovr a:hover { color: #111827; }
        ._ovr .sep { color: #9ca3af; margin: 0 4px; }
        ._ovr .cur { margin-right: 6px; color: #374151; }

        .d-sidebar { position: sticky; top: var(--total-offset); width: var(--sidebar-w); height: calc(100vh - var(--total-offset)); flex-shrink: 0; align-self: flex-start; background: var(--white); border-left: 2px solid var(--card-border); box-shadow: -2px 0 10px rgba(8,101,168,0.05); display: flex; flex-direction: column; overflow: hidden; z-index: 200; transition: width .25s ease; }
        .d-sidebar-brand { padding: 16px 14px; border-bottom: 2px solid var(--orange); display: flex; align-items: center; gap: 10px; background: var(--blue); flex-shrink: 0; }
        .d-sb-logo { width: 34px; height: 34px; object-fit: contain; filter: brightness(0) invert(1); flex-shrink: 0; }
        .d-sb-title { min-width: 0; overflow: hidden; }
        .d-sb-name { font-size: .84rem; font-weight: 900; color: #fff; white-space: nowrap; letter-spacing: .3px; }
        .d-sb-sub { font-size: .6rem; color: rgba(255,255,255,.55); margin-top: 2px; white-space: nowrap; }
        .d-sidebar-user { padding: 12px 14px; border-bottom: 1.5px solid var(--card-border); display: flex; align-items: center; gap: 10px; background: var(--blue-lt); flex-shrink: 0; }
        .d-su-av { width: 34px; height: 34px; border-radius: 9px; background: var(--blue); display: flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: 900; color: #fff; flex-shrink: 0; border: 2px solid rgba(8,101,168,.2); }
        .d-su-info { flex: 1; min-width: 0; overflow: hidden; }
        .d-su-name { font-size: .74rem; font-weight: 700; color: var(--black); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .d-su-role { display: inline-flex; align-items: center; gap: 3px; margin-top: 2px; padding: 1px 7px; background: var(--orng-lt); border: 1px solid rgba(245,124,0,.3); border-radius: 20px; font-size: .58rem; color: var(--orange); font-weight: 700; }
        .d-sidebar-nav { flex: 1; padding: 10px 8px; overflow-y: auto; overflow-x: hidden; }
        .d-sidebar-nav::-webkit-scrollbar { width: 3px; }
        .d-sidebar-nav::-webkit-scrollbar-thumb { background: var(--gray4); border-radius: 2px; }
        .d-nav-section { margin-bottom: 6px; }
        .d-nav-label { font-size: .58rem; font-weight: 700; color: var(--gray3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 8px; margin-bottom: 4px; }
        .d-nav-btn { width: 100%; display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 9px; border: 1.5px solid transparent; background: transparent; color: var(--gray2); font-family: var(--font); font-size: .78rem; font-weight: 700; cursor: pointer; transition: all .16s; text-align: right; margin-bottom: 2px; white-space: nowrap; overflow: hidden; position: relative; }
        .d-nav-btn:hover { background: var(--blue-lt); color: var(--blue); border-color: rgba(8,101,168,.15); }
        .d-nav-btn.active { background: var(--blue-md); color: var(--blue); border-color: rgba(8,101,168,.3); }
        .d-nav-btn.active.or { background: var(--orng-lt); color: var(--orange); border-color: rgba(245,124,0,.3); }
        .d-nav-btn.active.gr { background: rgba(22,163,74,.1); color: #16a34a; border-color: rgba(22,163,74,.3); }
        .d-nav-btn.active.pu { background: rgba(124,58,237,.1); color: #7c3aed; border-color: rgba(124,58,237,.3); }
        .d-nav-btn.active.rd { background: rgba(220,38,38,.08); color: #dc2626; border-color: rgba(220,38,38,.3); }
        .d-nav-btn.active::after { content:''; position:absolute; right:0; top:0; bottom:0; width:3px; background: var(--blue); border-radius:2px 0 0 2px; }
        .d-nav-btn.active.or::after { background: var(--orange); }
        .d-nav-btn.active.gr::after { background: #16a34a; }
        .d-nav-btn.active.pu::after { background: #7c3aed; }
        .d-nav-btn.active.rd::after { background: #dc2626; }
        .d-nav-icon { font-size: .9rem; flex-shrink: 0; }
        .d-nav-label-txt { flex: 1; text-align: right; overflow: hidden; text-overflow: ellipsis; }
        .d-nav-badge { margin-right: auto; padding: 1px 6px; border-radius: 9px; font-size: .58rem; font-weight: 900; background: var(--orng-lt); color: var(--orange); border: 1px solid rgba(245,124,0,.3); flex-shrink: 0; }
        .d-nav-badge.rd { background: rgba(220,38,38,.08); color: #dc2626; border-color: rgba(220,38,38,.3); animation: d-pulse 2s ease infinite; }
        .d-sidebar-footer { padding: 10px 12px; border-top: 1.5px solid var(--card-border); font-size: .6rem; color: var(--gray3); text-align: center; background: var(--bg); flex-shrink: 0; }

        .d-main { flex: 1; min-width: 0; padding: clamp(16px,2.5vw,28px) clamp(14px,2.5vw,28px) clamp(40px,5vw,60px); animation: d-fadeUp .28s ease; }
        .d-page-hdr { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: clamp(18px,2.5vw,28px); padding-bottom: clamp(14px,2vw,20px); border-bottom: 2px solid var(--orange); }
        .d-page-title { font-size: clamp(1rem,2.5vw,1.4rem); font-weight: 900; color: var(--black); line-height: 1.2; }
        .d-page-sub { font-size: clamp(.65rem,1.2vw,.74rem); color: var(--gray2); margin-top: 4px; }

        .d-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(clamp(110px,14vw,150px),1fr)); gap: clamp(8px,1.5vw,14px); margin-bottom: clamp(18px,2.5vw,26px); }
        .d-sc { background: #ffffff; border-radius: var(--radius); padding: clamp(14px,2vw,18px) clamp(12px,2vw,16px); border: 1.5px solid var(--card-border); border-right: 4px solid transparent; box-shadow: var(--shadow); position: relative; overflow: hidden; transition: transform .2s, box-shadow .2s; }
        .d-sc:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .d-sc::after { content: attr(data-icon); position: absolute; left: -4px; bottom: -6px; font-size: clamp(1.8rem,4vw,2.5rem); opacity: .06; pointer-events: none; transform: rotate(-10deg); }
        .d-sc-val { font-size: clamp(1.5rem,3.5vw,2rem); font-weight: 900; line-height: 1; font-family: 'Courier New', monospace; }
        .d-sc-lbl { font-size: clamp(.62rem,1.1vw,.7rem); margin-top: 5px; color: var(--gray2); font-weight: 700; }
        .d-sc-bar { height: 3px; border-radius: 2px; margin-top: 10px; width: 40%; opacity: .6; }

        .d-toolbar { display: flex; align-items: center; gap: clamp(6px,1.2vw,10px); flex-wrap: wrap; margin-bottom: clamp(12px,2vw,18px); background: var(--white); border: 1.5px solid var(--card-border); border-radius: var(--radius); padding: clamp(9px,1.5vw,13px) clamp(12px,2vw,16px); box-shadow: var(--shadow); }
        .d-search { flex: 1; min-width: clamp(140px,18vw,200px); position: relative; }
        .d-search input { width: 100%; padding: clamp(7px,1.2vw,10px) 36px clamp(7px,1.2vw,10px) clamp(10px,1.5vw,14px); border-radius: 9px; border: 1.5px solid var(--gray4); background: var(--bg); color: var(--black); font-family: var(--font); font-size: clamp(.72rem,1.3vw,.8rem); outline: none; direction: rtl; transition: border .18s, background .18s; }
        .d-search input::placeholder { color: var(--gray3); }
        .d-search input:focus { border-color: var(--blue); background: #fff; }
        .d-search::after { content: '🔍'; position: absolute; right: 11px; top: 50%; transform: translateY(-50%); font-size: .7rem; pointer-events: none; opacity: .5; }

        .d-expw { position: relative; }
        .d-expbtn { display: flex; align-items: center; gap: 6px; padding: clamp(7px,1.2vw,10px) clamp(12px,2vw,18px); background: var(--orange); color: #fff; border: none; border-radius: 9px; font-family: var(--font); font-size: clamp(.72rem,1.3vw,.8rem); font-weight: 700; cursor: pointer; white-space: nowrap; transition: all .18s; box-shadow: 0 3px 10px rgba(245,124,0,.3); }
        .d-expbtn:hover { background: #e65100; transform: translateY(-1px); }
        .d-expbtn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .d-expmenu { position: absolute; top: calc(100% + 6px); left: 0; background: var(--white); border: 1.5px solid var(--card-border); border-radius: 11px; box-shadow: 0 8px 28px rgba(0,0,0,.1); overflow: hidden; z-index: 400; min-width: 185px; animation: d-slideIn .15s ease; }
        .d-expitem { display: flex; align-items: center; gap: 9px; width: 100%; padding: clamp(9px,1.8vw,12px) clamp(12px,2vw,16px); background: none; border: none; border-bottom: 1px solid var(--gray5); font-family: var(--font); font-size: clamp(.72rem,1.3vw,.8rem); font-weight: 700; color: var(--gray1); direction: rtl; cursor: pointer; transition: background .12s, color .12s; }
        .d-expitem:last-child { border-bottom: none; }
        .d-expitem:hover { background: var(--blue-lt); color: var(--blue); }

        .d-filter { display: flex; align-items: center; gap: clamp(6px,1.2vw,12px); flex-wrap: wrap; background: var(--white); border: 1.5px solid var(--card-border); border-radius: var(--radius); padding: clamp(9px,1.5vw,12px) clamp(12px,2vw,16px); margin-bottom: clamp(12px,2vw,18px); box-shadow: var(--shadow); }
        .d-flbl { font-size: clamp(.68rem,1.2vw,.76rem); font-weight: 700; color: var(--gray2); white-space: nowrap; }
        .d-fsm { font-size: clamp(.64rem,1.1vw,.7rem); color: var(--gray3); }
        .d-fdate { padding: clamp(5px,1vw,8px) clamp(7px,1.2vw,11px); border-radius: 8px; border: 1.5px solid var(--gray4); background: var(--bg); color: var(--black); font-family: var(--font); font-size: clamp(.7rem,1.2vw,.78rem); outline: none; direction: ltr; transition: border .18s; }
        .d-fdate:focus { border-color: var(--blue); background: #fff; }
        .d-fsel { padding: clamp(5px,1vw,8px) clamp(7px,1.2vw,11px); border-radius: 8px; border: 1.5px solid var(--gray4); background: var(--bg); color: var(--black); font-family: var(--font); font-size: clamp(.7rem,1.2vw,.78rem); outline: none; cursor: pointer; }
        .d-fbadge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; background: var(--orng-lt); border: 1px solid rgba(245,124,0,.3); color: var(--orange); font-size: clamp(.62rem,1.1vw,.7rem); font-weight: 700; }
        .d-fclear { padding: clamp(4px,.9vw,7px) clamp(9px,1.5vw,12px); border-radius: 8px; background: var(--bg); border: 1.5px solid var(--gray4); font-family: var(--font); font-size: clamp(.64rem,1.1vw,.72rem); font-weight: 700; cursor: pointer; color: var(--gray2); transition: all .16s; }
        .d-fclear:hover { border-color: var(--orange); color: var(--orange); background: var(--orng-lt); }

        .d-err { background: #fef2f2; border: 1.5px solid rgba(220,38,38,.3); color: #dc2626; border-radius: 9px; padding: clamp(8px,1.5vw,11px) clamp(10px,2vw,14px); margin-bottom: 14px; font-size: clamp(.7rem,1.3vw,.78rem); display: flex; align-items: center; gap: 9px; }

        .d-card { background: var(--white); border-radius: var(--radius); border: 1.5px solid var(--card-border); overflow: hidden; box-shadow: var(--shadow); }
        .d-tscr { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .d-tbl { width: 100%; border-collapse: collapse; min-width: 480px; }
        .d-tbl thead th { background: var(--blue); color: #fff; padding: clamp(10px,1.8vw,14px) clamp(10px,2vw,18px); font-family: var(--font); font-size: clamp(.68rem,1.2vw,.76rem); font-weight: 700; text-align: right; white-space: nowrap; border-bottom: 3px solid var(--orange); letter-spacing: .3px; }
        .d-tbl thead th.or { background: var(--orange); border-bottom-color: #fff3e0; }
        .d-tbl thead th.gr { background: #16a34a; border-bottom-color: #86efac; }
        .d-tbl thead th.pu { background: #7c3aed; border-bottom-color: #c4b5fd; }
        .d-tbl thead th.rd { background: #dc2626; border-bottom-color: #fca5a5; }
        .d-tbl thead th.c { text-align: center; }
        .d-tbl tbody tr { border-bottom: 1px solid var(--gray5); transition: background .12s; }
        .d-tbl tbody tr:last-child { border-bottom: none; }
        .d-tbl tbody tr:hover { background: var(--blue-lt); }
        .d-tbl tbody tr.xopen { background: var(--blue-lt); }
        .d-tbl tbody tr:nth-child(even) { background: #fafbfc; }
        .d-tbl tbody tr:nth-child(even):hover { background: var(--blue-lt); }
        .d-tbl td { padding: clamp(9px,1.6vw,13px) clamp(10px,2vw,18px); font-family: var(--font); font-size: clamp(.69rem,1.25vw,.78rem); color: var(--gray1); vertical-align: middle; }

        .d-av { width: clamp(28px,3.5vw,36px); height: clamp(28px,3.5vw,36px); border-radius: 9px; background: var(--blue); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: clamp(.58rem,1vw,.66rem); flex-shrink: 0; border: 2px solid rgba(8,101,168,.2); }
        .d-av.or { background: var(--orange); border-color: rgba(245,124,0,.2); }
        .d-av.sm { width: 24px; height: 24px; border-radius: 7px; font-size: .58rem; }
        .d-av.rd { background: #dc2626; border-color: rgba(220,38,38,.2); }
        .d-uc { display: flex; align-items: center; gap: 9px; }
        .d-uname { font-weight: 700; color: var(--black); }
        .d-cb { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; border-radius: 7px; background: var(--blue-lt); border: 1.5px solid rgba(8,101,168,.25); color: var(--blue); font-size: clamp(.62rem,1.1vw,.7rem); font-weight: 900; padding: 0 6px; font-family: 'Courier New', monospace; }
        .d-cb.or { background: var(--orng-lt); border-color: rgba(245,124,0,.3); color: var(--orange); }
        .d-pill { display: inline-block; padding: 4px 12px; border-radius: 7px; font-size: clamp(.62rem,1.1vw,.7rem); font-weight: 700; cursor: pointer; border: 1.5px solid rgba(8,101,168,.3); color: var(--blue); background: var(--blue-lt); user-select: none; transition: all .14s; font-family: var(--font); }
        .d-pill:hover,.d-pill.op { background: var(--blue-md); border-color: rgba(8,101,168,.55); }
        .d-pill.or { border-color: rgba(245,124,0,.3); color: var(--orange); background: var(--orng-lt); }
        .d-pill.or:hover,.d-pill.or.op { background: var(--orng-md); border-color: rgba(245,124,0,.55); }
        .d-xrow td { padding: 0!important; border: none; }
        .d-xin { padding: clamp(12px,2vw,16px) clamp(14px,2.5vw,22px); display: flex; flex-wrap: wrap; gap: clamp(7px,1.3vw,11px); background: var(--blue-lt); border-top: 2px solid rgba(8,101,168,.15); }
        .d-mc { background: var(--white); border-radius: 10px; padding: clamp(9px,1.8vw,13px) clamp(10px,2vw,14px); border: 1.5px solid var(--gray5); min-width: clamp(150px,20vw,200px); flex: 1 1 150px; max-width: 260px; transition: border-color .14s; box-shadow: var(--shadow); }
        .d-mc:hover { border-color: rgba(8,101,168,.3); }
        .d-mt { font-size: clamp(.7rem,1.25vw,.78rem); font-weight: 700; color: var(--blue); margin-bottom: 2px; }
        .d-mt.or { color: var(--orange); }
        .d-ms { font-size: clamp(.63rem,1.1vw,.7rem); color: var(--gray2); }
        .d-md { font-size: clamp(.6rem,1vw,.66rem); color: var(--gray3); margin-top: 4px; }

        .d-empty { text-align: center; padding: clamp(40px,8vw,70px) 20px; }
        .d-emi { font-size: clamp(1.8rem,4vw,2.5rem); margin-bottom: 12px; opacity: .35; }
        .d-empty p { color: var(--gray3); font-size: clamp(.74rem,1.4vw,.82rem); }
        .d-ld { text-align: center; padding: clamp(50px,10vw,80px) 20px; }
        .d-sp { width: clamp(32px,4.5vw,42px); height: clamp(32px,4.5vw,42px); border: 3px solid var(--gray5); border-top-color: var(--blue); border-radius: 50%; animation: d-spin .7s linear infinite; margin: 0 auto clamp(12px,2vw,18px); }
        .d-ld p { color: var(--gray3); font-size: clamp(.72rem,1.3vw,.8rem); }

        .d-ovl { position: fixed; inset: 0; background: rgba(245,247,250,.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
        .d-ovlb { background: var(--white); border-radius: 18px; padding: clamp(28px,5vw,44px) clamp(44px,7vw,64px); text-align: center; box-shadow: 0 16px 48px rgba(8,101,168,.18); border: 2px solid rgba(8,101,168,.15); }
        .d-ovlb p { font-size: clamp(.78rem,1.5vw,.86rem); margin-top: 14px; color: var(--gray2); font-family: var(--font); }

        .d-chk { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--gray4); background: var(--bg); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all .16s; flex-shrink: 0; font-size: .75rem; color: transparent; }
        .d-chk:hover { border-color: #16a34a; background: #f0fdf4; }
        .d-chk.on { background: #f0fdf4; border-color: #16a34a; color: #16a34a; }
        .d-chk.spin { border-color: #16a34a; border-top-color: transparent; border-radius: 50%; animation: d-spin .6s linear infinite; }
        .d-att-badge { display: inline-flex; align-items: center; gap: 3px; padding: 3px 9px; border-radius: 7px; font-size: clamp(.62rem,1.1vw,.7rem); font-weight: 700; }
        .d-att-badge.on { background: #f0fdf4; color: #16a34a; border: 1px solid #86efac; }
        .d-att-badge.off { background: var(--bg); color: var(--gray3); border: 1px solid var(--gray4); }
        .d-att-sum { display: flex; align-items: center; gap: clamp(10px,2vw,20px); flex-wrap: wrap; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--radius); padding: clamp(9px,1.8vw,13px) clamp(12px,2vw,18px); margin-bottom: clamp(12px,2vw,18px); box-shadow: var(--shadow); }
        .d-att-sum span { font-size: clamp(.7rem,1.3vw,.78rem); font-weight: 700; color: #15803d; }
        .d-prog-wrap { flex: 1; min-width: 100px; height: 6px; background: #bbf7d0; border-radius: 3px; overflow: hidden; }
        .d-prog-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg,#16a34a,#22c55e); transition: width .5s ease; }

        .d-cert-grid { display: grid; gap: clamp(10px,1.8vw,14px); padding: clamp(12px,2vw,18px); grid-template-columns: repeat(auto-fill,minmax(clamp(240px,28vw,300px),1fr)); }
        .d-cert-card { background: var(--white); border-radius: 13px; padding: clamp(12px,2vw,16px); border: 1.5px solid var(--card-border); display: flex; flex-direction: column; gap: 10px; transition: border-color .16s, box-shadow .16s, transform .16s; box-shadow: var(--shadow); }
        .d-cert-card:hover { border-color: rgba(124,58,237,.3); box-shadow: 0 4px 18px rgba(124,58,237,.1); transform: translateY(-1px); }
        .d-cert-card-top { display: flex; align-items: flex-start; gap: 10px; }
        .d-cert-icon { width: 42px; height: 42px; border-radius: 10px; background: rgba(124,58,237,.08); border: 1.5px solid rgba(124,58,237,.2); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; }
        .d-cert-icon.has { background: #f0fdf4; border-color: #86efac; }
        .d-cert-icon.grey { background: rgba(156,163,175,.06); border-color: rgba(156,163,175,.15); }
        .d-cert-info { flex: 1; min-width: 0; }
        .d-cert-name { font-weight: 700; font-size: .8rem; color: var(--black); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .d-cert-course { font-size: .7rem; color: var(--blue); margin-top: 3px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .d-cert-badges { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px; }
        .d-cert-actions { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; border-top: 1px solid var(--gray5); padding-top: 9px; }
        .d-cert-btn { padding: clamp(5px,1vw,7px) clamp(10px,1.5vw,14px); border-radius: 8px; font-family: var(--font); font-size: clamp(.64rem,1.1vw,.72rem); font-weight: 700; cursor: pointer; border: none; transition: all .14s; white-space: nowrap; }
        .d-cert-btn.up { background: rgba(124,58,237,.1); color: #7c3aed; border: 1.5px solid rgba(124,58,237,.25); }
        .d-cert-btn.up:hover { background: rgba(124,58,237,.2); }
        .d-cert-btn.dl { background: var(--blue-lt); color: var(--blue); border: 1.5px solid rgba(8,101,168,.25); }
        .d-cert-btn.dl:hover { background: var(--blue-md); }
        .d-cert-btn.rm { background: #fef2f2; color: #dc2626; border: 1.5px solid rgba(220,38,38,.2); }
        .d-cert-btn.rm:hover { background: #fee2e2; }
        .d-cert-btn.full { width: 100%; text-align: center; justify-content: center; }
        .d-cert-btn:disabled { opacity: .45; cursor: not-allowed; }

        .d-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); animation: d-fadeUp .16s ease; }
        .d-modal { background: var(--white); border-radius: 14px; padding: clamp(14px,2.5vw,20px); max-width: clamp(290px,88vw,520px); width: 100%; box-shadow: 0 16px 48px rgba(0,0,0,.15); direction: rtl; border: 2px solid rgba(124,58,237,.2); border-top: 4px solid #7c3aed; }
        .d-modal.rd-modal { border-color: rgba(220,38,38,.2); border-top-color: #dc2626; max-width: clamp(290px,92vw,540px); max-height: 90vh; overflow-y: auto; }
        .d-modal h3 { font-size: clamp(.82rem,1.5vw,.92rem); font-weight: 900; color: var(--black); margin-bottom: 3px; }
        .d-modal p { font-size: clamp(.66rem,1.1vw,.72rem); color: var(--gray2); margin-bottom: 12px; font-family: var(--font); }
        .d-drop { border: 2px dashed rgba(124,58,237,.35); border-radius: 12px; padding: clamp(24px,5vw,36px) 16px; text-align: center; cursor: pointer; transition: all .16s; background: rgba(124,58,237,.04); }
        .d-drop.over { border-color: #7c3aed; background: rgba(124,58,237,.1); }
        .d-drop:hover { border-color: rgba(124,58,237,.6); }
        .d-drop-icon { font-size: clamp(1.7rem,3.5vw,2.3rem); margin-bottom: 8px; }
        .d-drop-txt { font-size: clamp(.72rem,1.4vw,.8rem); color: var(--gray1); margin-bottom: 4px; font-family: var(--font); }
        .d-drop-sub { font-size: clamp(.62rem,1.1vw,.7rem); color: var(--gray3); }
        .d-modal-actions { display: flex; gap: 7px; margin-top: 18px; justify-content: flex-end; }
        .d-modal-cancel { padding: clamp(7px,1.3vw,10px) clamp(12px,2vw,18px); border-radius: 9px; background: var(--bg); border: 1.5px solid var(--gray4); font-family: var(--font); font-size: clamp(.7rem,1.3vw,.78rem); font-weight: 700; cursor: pointer; color: var(--gray2); transition: all .14s; }
        .d-modal-cancel:hover { border-color: var(--gray2); color: var(--black); background: var(--white); }

        .d-email { direction: ltr; text-align: right; color: var(--gray3); font-size: clamp(.65rem,1.15vw,.73rem); }

        .rf-stat-bar { display: grid; grid-template-columns: repeat(auto-fill,minmax(130px,1fr)); gap: 10px; margin-bottom: 20px; }
        .rf-sc { background: var(--white); border-radius: 11px; padding: 14px 16px; border: 1.5px solid var(--card-border); box-shadow: var(--shadow); display: flex; align-items: center; gap: 11px; transition: transform .2s; }
        .rf-sc:hover { transform: translateY(-2px); }
        .rf-sc-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .rf-sc-body { flex: 1; min-width: 0; }
        .rf-sc-val { font-size: 1.35rem; font-weight: 900; line-height: 1; font-family: 'Courier New', monospace; }
        .rf-sc-lbl { font-size: .65rem; color: var(--gray2); font-weight: 700; margin-top: 3px; }
        .rf-status { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 8px; font-size: .7rem; font-weight: 700; white-space: nowrap; border: 1.5px solid transparent; }
        .rf-amount { font-family: 'Courier New', monospace; font-weight: 900; font-size: .88rem; color: #15803d; direction: ltr; display: inline-block; }
        .rf-filter-btns { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
        .rf-fbtn { padding: 5px 13px; border-radius: 8px; border: 1.5px solid var(--gray4); background: var(--bg); font-family: var(--font); font-size: .7rem; font-weight: 700; cursor: pointer; color: var(--gray2); transition: all .14s; }
        .rf-fbtn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-lt); }
        .rf-fbtn.active { background: var(--blue-md); border-color: rgba(8,101,168,.4); color: var(--blue); }
        .rf-fbtn.active.pend { background: #fff8f0; border-color: rgba(245,124,0,.4); color: var(--orange); }
        .rf-fbtn.active.appr { background: #f0fdf4; border-color: #86efac; color: #16a34a; }
        .rf-fbtn.active.bank { background: var(--blue-lt); border-color: rgba(8,101,168,.35); color: var(--blue); }
        .rf-fbtn.active.rjct { background: #fef2f2; border-color: rgba(220,38,38,.35); color: #dc2626; }
        .rf-action-btn { padding: 5px 12px; border-radius: 7px; font-family: var(--font); font-size: .68rem; font-weight: 700; cursor: pointer; border: 1.5px solid; transition: all .14s; white-space: nowrap; }
        .rf-action-btn:disabled { opacity: .4; cursor: not-allowed; }
        .rf-action-btn.view { background: var(--blue-lt); color: var(--blue); border-color: rgba(8,101,168,.3); }
        .rf-action-btn.view:hover { background: var(--blue-md); }
        .rf-action-btn.approve { background: #f0fdf4; color: #16a34a; border-color: #86efac; }
        .rf-action-btn.approve:hover { background: #dcfce7; }
        .rf-action-btn.bank { background: var(--blue-lt); color: var(--blue); border-color: rgba(8,101,168,.35); }
        .rf-action-btn.bank:hover { background: var(--blue-md); }
        .rf-action-btn.reject { background: #fef2f2; color: #dc2626; border-color: rgba(220,38,38,.3); }
        .rf-action-btn.reject:hover { background: #fee2e2; }
        .rf-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
        .rf-field-lbl { font-size: .58rem; color: var(--gray3); font-weight: 700; margin-bottom: 2px; }
        .rf-field-val { font-size: .74rem; color: var(--black); font-weight: 700; word-break: break-all; }
        .rf-field-val.mono { font-family: 'Courier New', monospace; direction: ltr; display: inline-block; }
        .rf-full { grid-column: 1/-1; }
        .rf-divider { grid-column: 1/-1; border: none; border-top: 1.5px dashed var(--gray5); margin: 2px 0; }
        .rf-bank-block { grid-column: 1/-1; background: #f8faff; border: 1.5px solid rgba(8,101,168,.15); border-radius: 9px; padding: 9px 12px; }
        .rf-bank-title { font-size: .68rem; font-weight: 900; color: var(--blue); margin-bottom: 7px; display: flex; align-items: center; gap: 5px; }
        .rf-bank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 14px; }
        .rf-action-area { margin-top: 12px; border-top: 1.5px solid var(--gray5); padding-top: 10px; }
        .rf-action-row { display: flex; gap: 7px; flex-wrap: wrap; }
        .rf-textarea { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1.5px solid var(--gray4); background: var(--bg); font-family: var(--font); font-size: .74rem; color: var(--black); resize: vertical; min-height: 60px; outline: none; direction: rtl; margin-top: 8px; transition: border .18s; }
        .rf-textarea:focus { border-color: var(--blue); background: #fff; }
        .rf-action-confirm { padding: 8px 18px; border-radius: 8px; font-family: var(--font); font-size: .76rem; font-weight: 700; cursor: pointer; border: none; transition: all .16s; }
        .rf-action-confirm.approve { background: #16a34a; color: #fff; }
        .rf-action-confirm.approve:hover { background: #15803d; }
        .rf-action-confirm.bank { background: var(--blue); color: #fff; }
        .rf-action-confirm.bank:hover { background: #0552a0; }
        .rf-action-confirm.reject { background: #dc2626; color: #fff; }
        .rf-action-confirm.reject:hover { background: #b91c1c; }
        .rf-action-confirm:disabled { opacity: .5; cursor: not-allowed; }
        .rf-bank-banner { padding: 12px 16px; border-radius: 11px; font-family: var(--font); font-size: .78rem; font-weight: 700; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; animation: d-slideDown .3s ease; position: relative; }
        .rf-bank-banner.success { background: #f0fdf4; border: 1.5px solid #86efac; color: #15803d; }
        .rf-bank-banner.failed { background: #fff8f0; border: 1.5px solid rgba(245,124,0,.4); color: #b45309; }
        .rf-bank-banner-close { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; color: inherit; opacity: .6; }
        .rf-bank-banner-close:hover { opacity: 1; }

        .d-ftr { text-align: center; margin-top: clamp(20px,3.5vw,32px); padding-top: 18px; border-top: 1.5px solid var(--gray5); color: var(--gray3); font-size: clamp(.6rem,1vw,.67rem); }
        .d-ftr strong { color: var(--blue); }

        @media(max-width:1100px){
          :root{ --sidebar-w: 54px; }
          .d-sb-title,.d-su-info,.d-nav-label,.d-nav-badge,.d-sidebar-footer,.d-nav-label-txt { display: none; }
          .d-sidebar-brand { padding: 12px; justify-content: center; }
          .d-sidebar-user { padding: 10px; justify-content: center; }
          .d-sidebar-nav { padding: 8px 6px; }
          .d-nav-btn { justify-content: center; padding: 10px 7px; }
          .d-sb-logo,.d-su-av { width: 28px; height: 28px; }
        }
        @media(max-width:768px){
          .d-stats { grid-template-columns: repeat(3,1fr); }
          .rf-detail,.rf-bank-grid { grid-template-columns: 1fr; }
          .d-cert-grid { grid-template-columns: 1fr!important; }
          .d-mc { max-width: 100%; }
          .d-page-hdr { flex-direction: column; }
          .d-toolbar { flex-direction: column; align-items: stretch; }
          .d-expw { align-self: flex-start; }
        }
        @media(max-width:480px){
          .d-stats { grid-template-columns: repeat(2,1fr); }
          .d-main { padding: 12px 10px 32px; }
          ._ovr { font-size: .7rem; }
        }
        @media(min-width:1920px){
          :root{ --sidebar-w: 220px; }
          .d-main { padding: 36px 44px 72px; }
        }
        @media print {
          .d-sidebar,.d-toolbar,.d-filter,._ovr { display: none!important; }
          .d-root { background: #fff!important; padding-top: 0!important; }
          .d-main { padding: 0!important; }
        }
      `}</style>

            {exporting && (
                <div className="d-ovl">
                    <div className="d-ovlb">
                        <div className="d-sp" />
                        <p>جاري تصدير الملف... يرجى الانتظار</p>
                    </div>
                </div>
            )}

            {certModal && (
                <div className="d-modal-bg" onClick={() => setCertModal(null)}>
                    <div className="d-modal" onClick={e => e.stopPropagation()}>
                        <h3>📜 رفع شهادة</h3>
                        <p>{certModal.userName} — {certModal.courseTitle}</p>
                        <div className={`d-drop${certDragOver ? ' over' : ''}`}
                            onClick={() => certFileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setCertDragOver(true); }}
                            onDragLeave={() => setCertDragOver(false)}
                            onDrop={e => { e.preventDefault(); setCertDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleCertFile(certModal.enrollmentId, certModal.userId, certModal.planworkId, f); }}>
                            <div className="d-drop-icon">📂</div>
                            <div className="d-drop-txt">اسحب الملف هنا أو اضغط للاختيار</div>
                            <div className="d-drop-sub">PDF, JPG, PNG — حجم أقصى 10 MB</div>
                            <input ref={certFileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files[0]; if (f) handleCertFile(certModal.enrollmentId, certModal.userId, certModal.planworkId, f); e.target.value = ''; }} />
                        </div>
                        {certUploading[certModal.certKey] && (
                            <div style={{ textAlign: 'center', marginTop: 12, color: '#7c3aed', fontSize: '.8rem', fontWeight: 700, fontFamily: '"Droid Arabic Kufi", serif' }}>⏳ جاري الرفع على السيرفر...</div>
                        )}
                        <div className="d-modal-actions">
                            <button className="d-modal-cancel" onClick={() => setCertModal(null)}>إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

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
                                    <div style={{ fontSize: '.62rem', color: 'var(--gray3)', marginTop: 2, fontFamily: '"Droid Arabic Kufi", serif' }}>{r.refNumber || r.id}</div>
                                </div>
                                <span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span>
                            </div>
                            <div className="rf-detail">
                                <div className="rf-field"><div className="rf-field-lbl">رقم الأوردر</div><div className="rf-field-val mono">{r.orderId || '—'}</div></div>
                                <div className="rf-field"><div className="rf-field-lbl">المبلغ</div><div className="rf-field-val" style={{ color: '#15803d' }}><span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span><span style={{ fontSize: '.6rem', color: 'var(--gray3)', marginRight: 3 }}>{r.currency}</span></div></div>
                                <div className="rf-field"><div className="rf-field-lbl">المستخدم</div><div className="rf-field-val">{`${u.firstName} ${u.lastName}`.trim() || '—'}</div></div>
                                <div className="rf-field"><div className="rf-field-lbl">البريد الإلكتروني</div><div className="rf-field-val mono" style={{ fontSize: '.68rem' }}>{u.email || '—'}</div></div>
                                <div className="rf-field"><div className="rf-field-lbl">الدورة</div><div className="rf-field-val">{c.title || '—'}</div></div>
                                <div className="rf-field"><div className="rf-field-lbl">تاريخ الطلب</div><div className="rf-field-val mono">{r.requestedAt || '—'}</div></div>
                                <div className="rf-field rf-full"><div className="rf-field-lbl">سبب الاسترداد</div><div className="rf-field-val" style={{ fontWeight: 400, fontSize: '.74rem' }}>{r.reason || '—'}</div></div>
                                {r.details && <div className="rf-field rf-full"><div className="rf-field-lbl">تفاصيل إضافية</div><div className="rf-field-val" style={{ fontWeight: 400, fontSize: '.72rem', color: 'var(--gray1)', lineHeight: 1.5 }}>{r.details}</div></div>}
                                <hr className="rf-divider" />
                                <div className="rf-bank-block">
                                    <div className="rf-bank-title">🏦 بيانات البنك</div>
                                    <div className="rf-bank-grid">
                                        {[['اسم البنك', r.bankName || '—', false], ['صاحب الحساب', r.accountHolder || '—', false], ['رقم الحساب', r.accountNumber || '—', true], ['IBAN', r.iban || '—', true]].map(([lbl, val, mono]) => (
                                            <div key={lbl}><div className="rf-field-lbl">{lbl}</div><div className={`rf-field-val${mono ? ' mono' : ''}`} style={{ fontSize: '.72rem' }}>{val}</div></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {r.status === 'Pending' && (
                                <div className="rf-action-area">
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
                                        <button className="rf-action-btn bank" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'send_to_bank' }); }}>🏦 إرسال للبنك</button>
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

            {refundActionModal && (() => {
                const { refund: r, action } = refundActionModal;
                const u = refundUserLookup(r.userId);
                const am = {
                    approve: { title: '✅ تأكيد الموافقة', color: '#16a34a', cls: 'approve', placeholder: 'ملاحظة للمستخدم (اختياري)...' },
                    reject: { title: '❌ تأكيد الرفض', color: '#dc2626', cls: 'reject', placeholder: 'سبب الرفض (مطلوب)...' },
                    send_to_bank: { title: '🏦 تأكيد الإرسال للبنك', color: '#0865a8', cls: 'bank', placeholder: 'مرجع التحويل البنكي (اختياري)...' },
                }[action];
                return (
                    <div className="d-modal-bg" onClick={() => !refundActionSaving && setRefundActionModal(null)}>
                        <div className="d-modal rd-modal" style={{ maxWidth: 450, borderTopColor: am.color }} onClick={e => e.stopPropagation()}>
                            <h3>{am.title}</h3>
                            <p style={{ marginBottom: 12 }}>
                                طلب <strong>{r.refNumber || r.id}</strong> — <strong>{`${u.firstName} ${u.lastName}`.trim() || '—'}</strong><br />
                                المبلغ: <strong style={{ color: '#15803d', fontFamily: 'Courier New' }}>{Number(r.amount || 0).toLocaleString()} {r.currency}</strong>
                            </p>
                            {refundActionError && (
                                <div style={{ background: '#fef2f2', border: '1.5px solid rgba(220,38,38,.3)', color: '#dc2626', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: '.72rem', fontFamily: '"Droid Arabic Kufi", serif' }}>
                                    ⚠️ {refundActionError}
                                </div>
                            )}
                            <textarea className="rf-textarea" placeholder={am.placeholder} value={refundActionNote} onChange={e => setRefundActionNote(e.target.value)} disabled={refundActionSaving} />
                            <div className="d-modal-actions">
                                <button className="d-modal-cancel" onClick={() => { setRefundActionModal(null); setRefundActionNote(''); setRefundActionError(''); }} disabled={refundActionSaving}>إلغاء</button>
                                <button className={`rf-action-confirm ${am.cls}`} onClick={commitRefundAction} disabled={refundActionSaving || (action === 'reject' && !refundActionNote.trim())}>
                                    {refundActionSaving
                                        ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'd-spin .6s linear infinite', marginLeft: 6, verticalAlign: 'middle' }} />جاري...</>
                                        : 'تأكيد'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            <div className="_ovr">
                <span>
                    <a href="/" className="ml-3">الصفحة الرئيسية</a>
                    <span className="sep">-</span>
                    <span className="cur">لوحة الإدارة</span>
                </span>
            </div>

            <div className="d-root">
                <aside className="d-sidebar">
                    <div className="d-sidebar-brand">
                        <img src={logoSrc} alt="ICEMT" className="d-sb-logo" />
                        <div className="d-sb-title">
                            <div className="d-sb-name">ICEMT</div>
                            <div className="d-sb-sub">لوحة التحكم الإدارية</div>
                        </div>
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
                                    className={`d-nav-btn${activeTab === t.id ? ` active${t.colorCls ? ` ${t.colorCls}` : ''}` : ''}`}
                                    onClick={() => { setActiveTab(t.id); setExpandedRow(null); setSearchQuery(''); }}>
                                    <span className="d-nav-icon">{t.icon}</span>
                                    <span className="d-nav-label-txt">{t.label}</span>
                                    {t.id === 'certificates' && totalCerts > 0 && <span className="d-nav-badge">{totalCerts}</span>}
                                    {t.id === 'refunds' && refundStats.pending > 0 && <span className="d-nav-badge rd">{refundStats.pending}</span>}
                                </button>
                            ))}
                        </div>
                    </nav>
                    <div className="d-sidebar-footer">ICEMT © {new Date().getFullYear()}</div>
                </aside>

                <main className="d-main">
                    <div className="d-page-hdr">
                        <div>
                            <div className="d-page-title">
                                <span style={{ color: '#f57c00', marginLeft: 6 }}>{TABS.find(t => t.id === activeTab)?.icon}</span>
                                {activeTab === 'users' ? 'المستخدمون والدورات' : activeTab === 'courses' ? 'الدورات والمستخدمون' : activeTab === 'attendance' ? 'سجل الحضور' : activeTab === 'certificates' ? 'الشهادات' : 'طلبات الاسترداد'}
                            </div>
                            <div className="d-page-sub">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>

                    {!loading && !error && (
                        <div className="d-stats">
                            {STATS.map(s => (
                                <div key={s.label} className="d-sc" data-icon={s.icon} style={{ borderRightColor: s.accent, borderColor: s.border }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: 4, bottom: 0, background: s.accent, borderRadius: '0 var(--radius) var(--radius) 0' }} />
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

                    {/* ══ REFUNDS TAB ══ */}
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
                                    { lbl: 'مرفوضة', val: refundStats.rejected, icon: '❌', bg: '#fef2f2', color: '#dc2626' },
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
                                    {[{ id: 'all', lbl: 'الكل', cls: '' }, { id: 'Pending', lbl: '⏳ قيد المراجعة', cls: 'pend' }, { id: 'Approved', lbl: '✅ موافق عليه', cls: 'appr' }, { id: 'Sent', lbl: '🏦 أُرسل للبنك', cls: 'bank' }, { id: 'Rejected', lbl: '❌ مرفوض', cls: 'rjct' }].map(f => (
                                        <button key={f.id} className={`rf-fbtn${refundStatusFilter === f.id ? ` active ${f.cls}` : ''}`} onClick={() => setRefundStatusFilter(f.id)}>{f.lbl}</button>
                                    ))}
                                </div>
                                {refundSearch && <button className="d-fclear" onClick={() => setRefundSearch('')}>✕</button>}
                                <div className="d-expw" ref={exportRefundRef} style={{ marginRight: 'auto' }}>
                                    <button className="d-expbtn" disabled={exporting} onClick={() => setExportRefMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                    {exportRefMenuOpen && (
                                        <div className="d-expmenu">
                                            <button className="d-expitem" onClick={doRefundExcel}>📊 Excel (.xlsx)</button>
                                            <button className="d-expitem" onClick={doRefundPDF}>📄 PDF</button>
                                            <button className="d-expitem" onClick={doRefundWord}>📝 Word (.docx)</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {refundsError && (
                                <div className="d-err">⚠️ {refundsError}
                                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setRefundsError(null)}>✕</button>
                                </div>
                            )}
                            <div className="d-card">
                                {refundsLoading ? <div className="d-ld"><div className="d-sp" /><p>جاري تحميل طلبات الاسترداد...</p></div>
                                    : filteredRefunds.length === 0 ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد طلبات مطابقة</p></div>
                                        : (
                                            <>
                                                <div className="d-tscr">
                                                    <table className="d-tbl">
                                                        <thead><tr>
                                                            <th className="rd c" style={{ width: 36 }}>#</th>
                                                            <th className="rd">رقم الطلب</th>
                                                            <th className="rd">المستخدم</th>
                                                            <th className="rd c">المبلغ</th>
                                                            <th className="rd">السبب</th>
                                                            <th className="rd c">الحالة</th>
                                                            <th className="rd">تاريخ الطلب</th>
                                                            <th className="rd c">الإجراءات</th>
                                                        </tr></thead>
                                                        <tbody>
                                                            {paginatedRefunds.map((r, idx) => {
                                                                const rowNum = (refundPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                const u = refundUserLookup(r.userId);
                                                                const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
                                                                return (
                                                                    <tr key={r.id}>
                                                                        <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                        <td><span style={{ fontFamily: 'Courier New', fontSize: '.76rem', fontWeight: 700, color: 'var(--blue)' }}>{r.refNumber || r.id}</span></td>
                                                                        <td>
                                                                            <div className="d-uc">
                                                                                <div className="d-av rd">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                                                                                <div>
                                                                                    <div style={{ fontWeight: 700, color: 'var(--black)', fontSize: '.78rem' }}>{`${u.firstName} ${u.lastName}`.trim() || '—'}</div>
                                                                                    <div className="d-email" style={{ fontSize: '.65rem' }}>{u.email}</div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ textAlign: 'center' }}><span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span><span style={{ fontSize: '.6rem', color: 'var(--gray3)', marginRight: 3 }}>{r.currency}</span></td>
                                                                        <td style={{ maxWidth: 150 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '.74rem', color: 'var(--gray2)' }} title={r.reason}>{r.reason || '—'}</div></td>
                                                                        <td style={{ textAlign: 'center' }}><span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span></td>
                                                                        <td style={{ fontSize: '.72rem', fontFamily: 'Courier New', color: 'var(--gray3)', whiteSpace: 'nowrap' }}>{r.requestedAt || '—'}</td>
                                                                        <td>
                                                                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                                                <button className="rf-action-btn view" onClick={() => setRefundDetailModal(r)}>🔍 تفاصيل</button>
                                                                                {r.status === 'Pending' && <>
                                                                                    <button className="rf-action-btn approve" onClick={() => setRefundActionModal({ refund: r, action: 'approve' })}>✅</button>
                                                                                    <button className="rf-action-btn bank" onClick={() => setRefundActionModal({ refund: r, action: 'send_to_bank' })}>🏦</button>
                                                                                    <button className="rf-action-btn reject" onClick={() => setRefundActionModal({ refund: r, action: 'reject' })}>❌</button>
                                                                                </>}
                                                                                {r.status === 'Approved' && <button className="rf-action-btn bank" onClick={() => setRefundActionModal({ refund: r, action: 'send_to_bank' })}>🏦 إرسال للبنك</button>}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Pagination currentPage={refundPage} totalItems={filteredRefunds.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setRefundPage} accentColor="#dc2626" />
                                            </>
                                        )}
                            </div>
                        </div>
                    )}

                    {/* ══ ATTENDANCE TAB ══ */}
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
                                <div className="d-expw" ref={exportAttRef} style={{ marginRight: 'auto' }}>
                                    <button className="d-expbtn" disabled={exporting} onClick={() => setExportAttMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                    {exportAttMenuOpen && (
                                        <div className="d-expmenu">
                                            <button className="d-expitem" onClick={doAttExcel}>📊 Excel (.xlsx)</button>
                                            <button className="d-expitem" onClick={doAttPDF}>📄 PDF</button>
                                            <button className="d-expitem" onClick={doAttWord}>📝 Word (.docx)</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="d-att-sum">
                                <span>✅ {attRows.filter(r => !!attendance[String(r.course.enrollmentId)]).length} حضر</span>
                                <span>❌ {attRows.filter(r => !attendance[String(r.course.enrollmentId)]).length} غائب</span>
                                <span>📋 {attRows.length} إجمالي</span>
                                {attRows.length > 0 && (() => { const cnt = attRows.filter(r => !!attendance[String(r.course.enrollmentId)]).length; const pct = Math.round(cnt / attRows.length * 100); return (<><span>{pct}٪ حضور</span><div className="d-prog-wrap"><div className="d-prog-fill" style={{ width: `${pct}%` }} /></div></>); })()}
                            </div>
                            {attError && <div className="d-err">⚠️ {attError}<button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setAttError(null)}>✕</button></div>}
                            <div className="d-card">
                                {loading ? <div className="d-ld"><div className="d-sp" /><p>جاري التحميل...</p></div>
                                    : attRows.length === 0 ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد نتائج</p></div>
                                        : (
                                            <>
                                                <div className="d-tscr">
                                                    <table className="d-tbl">
                                                        <thead><tr>
                                                            <th className="c" style={{ width: 40 }}>#</th>
                                                            <th>المستخدم</th>
                                                            <th>البريد الإلكتروني</th>
                                                            <th>الدورة</th>
                                                            <th className="gr c">تسجيل الحضور</th>
                                                            <th className="gr c">الحالة</th>
                                                        </tr></thead>
                                                        <tbody>
                                                            {paginatedAttRows.map((row, idx) => {
                                                                const rowNum = (attPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                const eid = row.course.enrollmentId; const k = String(eid);
                                                                const attended = !!attendance[k]; const saving = !!attendanceSaving[k];
                                                                return (
                                                                    <tr key={k + idx}>
                                                                        <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                        <td><div className="d-uc"><div className="d-av">{(row.user.firstName || row.user.username || '?')[0]}{(row.user.lastName || '')[0]}</div><span className="d-uname">{row.user.firstName || row.user.username} {row.user.lastName}</span></div></td>
                                                                        <td className="d-email">{row.user.email}</td>
                                                                        <td style={{ color: 'var(--blue)', fontWeight: 700 }}>{row.course.title}</td>
                                                                        <td style={{ textAlign: 'center' }}>
                                                                            <div className={`d-chk${saving ? ' spin' : attended ? ' on' : ''}`} onClick={() => !saving && toggleAttendance(eid, attended)} title={eid == null ? 'لا يوجد enrollmentId' : ''}>{!saving && attended && '✓'}</div>
                                                                        </td>
                                                                        <td style={{ textAlign: 'center' }}><span className={`d-att-badge ${attended ? 'on' : 'off'}`}>{attended ? '✅ حضر' : '❌ غائب'}</span></td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Pagination currentPage={attPage} totalItems={attRows.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setAttPage} accentColor="#16a34a" />
                                            </>
                                        )}
                            </div>
                        </div>
                    )}

                    {/* ══ CERTIFICATES TAB ══ */}
                    {activeTab === 'certificates' && (
                        <div>
                            <div className="d-filter">
                                <span className="d-flbl">📜 البحث:</span>
                                <div className="d-search" style={{ minWidth: 210 }}>
                                    <input type="text" placeholder="ابحث باسم المستخدم أو الدورة..." value={certSearch} onChange={e => setCertSearch(e.target.value)} />
                                </div>
                                {certSearch && <button className="d-fclear" onClick={() => setCertSearch('')}>✕</button>}
                                <div style={{ display: 'flex', gap: 5, marginRight: 'auto', flexWrap: 'wrap' }}>
                                    {[{ id: 'all', label: 'الكل', icon: '📋' }, { id: 'uploaded', label: 'مرفوعة', icon: '✅' }, { id: 'pending', label: 'حضر / لم تُرفع', icon: '📄' }, { id: 'not-attended', label: 'لم يحضر', icon: '🚫' }].map(f => (
                                        <button key={f.id} style={{ padding: '5px 12px', borderRadius: 8, border: '1.5px solid', fontFamily: '"Droid Arabic Kufi", serif', fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all .14s', background: certStatusFilter === f.id ? (f.id === 'uploaded' ? '#f0fdf4' : f.id === 'pending' ? 'rgba(156,163,175,.1)' : 'var(--blue-lt)') : 'var(--bg)', borderColor: certStatusFilter === f.id ? (f.id === 'uploaded' ? '#86efac' : f.id === 'pending' ? 'var(--gray4)' : 'rgba(8,101,168,.3)') : 'var(--gray4)', color: certStatusFilter === f.id ? (f.id === 'uploaded' ? '#15803d' : f.id === 'pending' ? 'var(--gray2)' : 'var(--blue)') : 'var(--gray2)' }} onClick={() => setCertStatusFilter(f.id)}>{f.icon} {f.label}</button>
                                    ))}
                                </div>
                                {/* ↻ Manual refresh button REMOVED — auto-refresh now happens on upload/update/delete */}
                                <div className="d-expw" ref={exportCertRef}>
                                    <button className="d-expbtn" disabled={exporting} onClick={() => setExportCertMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                    {exportCertMenuOpen && (
                                        <div className="d-expmenu">
                                            <button className="d-expitem" onClick={doCertExcel}>📊 Excel (.xlsx)</button>
                                            <button className="d-expitem" onClick={doCertPDF}>📄 PDF</button>
                                            <button className="d-expitem" onClick={doCertWord}>📝 Word (.docx)</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!loading && (() => {
                                const uploaded = certRows.filter(r => !!(certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined))).length;
                                const withUrl = certRows.filter(r => { const c = certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined); return c && c.url && c.url !== 'uploaded'; }).length;
                                const attendedTotal = certRows.filter(r => !!attendance[String(r.enrollmentId)]).length;
                                const pendingUpload = certRows.filter(r => !(certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined)) && !!attendance[String(r.enrollmentId)]).length;
                                const notAttended = certRows.filter(r => !attendance[String(r.enrollmentId)]).length;
                                const pct = attendedTotal > 0 ? Math.round(uploaded / attendedTotal * 100) : 0;
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: 'var(--white)', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '11px 18px', marginBottom: 16, boxShadow: 'var(--shadow)', fontFamily: '"Droid Arabic Kufi", serif' }}>
                                        <span style={{ fontSize: '.76rem', fontWeight: 900, color: 'var(--black)' }}>📜 الشهادات</span>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 8, background: '#f0fdf4', border: '1.5px solid #86efac', color: '#15803d', fontSize: '.7rem', fontWeight: 700 }}>✅ مرفوعة: {uploaded}{withUrl > 0 && <span style={{ fontSize: '.62rem', color: '#16a34a', fontWeight: 400 }}>({withUrl} قابلة للعرض)</span>}</span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 8, background: 'rgba(124,58,237,.06)', border: '1.5px solid rgba(124,58,237,.2)', color: '#7c3aed', fontSize: '.7rem', fontWeight: 700 }}>📄 حضر ولم تُرفع: {pendingUpload}</span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 8, background: 'rgba(156,163,175,.08)', border: '1.5px solid var(--gray4)', color: 'var(--gray3)', fontSize: '.7rem', fontWeight: 700 }}>🚫 لم يحضر: {notAttended}</span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 8, background: 'var(--blue-lt)', border: '1.5px solid rgba(8,101,168,.2)', color: 'var(--blue)', fontSize: '.7rem', fontWeight: 700 }}>📋 الإجمالي: {certRows.length}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
                                            <div style={{ flex: 1, height: 7, background: 'var(--gray5)', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius: 4, transition: 'width .5s ease' }} /></div>
                                            <span style={{ fontSize: '.68rem', fontWeight: 700, color: '#15803d', minWidth: 32 }} title="من إجمالي الحاضرين">{pct}٪</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {certError && <div className="d-err">⚠️ {certError}<button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setCertError(null)}>✕</button></div>}

                            <div className="d-card">
                                {loading ? <div className="d-ld"><div className="d-sp" /><p>جاري التحميل...</p></div>
                                    : certRows.length === 0 ? <div className="d-empty"><div className="d-emi">🔍</div><p>لا توجد نتائج</p></div>
                                        : (
                                            <>
                                                <div className="d-cert-grid">
                                                    {paginatedCertRows.map(row => {
                                                        const ck = row.certKey;
                                                        const cert = certificates[ck] ?? (row.altKey ? certificates[row.altKey] : undefined);
                                                        const uploading = certUploading[ck];
                                                        const deleting = !!certDeleting[ck];
                                                        const isAttended = !!attendance[String(row.enrollmentId)];
                                                        const canUpload = isAttended;
                                                        const hasRealUrl = cert && cert.certId != null;
                                                        const hasPlaceholder = cert && cert.certId == null;
                                                        let cardBorder, cardBg;
                                                        if (cert) { cardBorder = '#86efac'; cardBg = '#f8fffe'; }
                                                        else if (!canUpload) { cardBorder = 'var(--gray5)'; cardBg = '#fafafa'; }
                                                        else { cardBorder = 'rgba(124,58,237,.2)'; cardBg = 'var(--white)'; }
                                                        const iconCls = cert ? 'has' : !canUpload ? 'grey' : '';
                                                        return (
                                                            <div className="d-cert-card" key={ck} style={{ borderColor: cardBorder, background: cardBg, opacity: !canUpload && !cert ? 0.75 : 1 }}>
                                                                <div className="d-cert-card-top">
                                                                    <div className={`d-cert-icon${iconCls ? ` ${iconCls}` : ''}`}>{cert ? '📜' : canUpload ? '📄' : '🚫'}</div>
                                                                    <div className="d-cert-info">
                                                                        <div className="d-cert-name" title={`${row.user.firstName || row.user.username} ${row.user.lastName}`.trim()}>{row.user.firstName || row.user.username} {row.user.lastName}</div>
                                                                        <div className="d-cert-course" title={row.course.title}>📚 {row.course.title}</div>
                                                                        <div className="d-cert-badges">
                                                                            <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: isAttended ? '#f0fdf4' : 'rgba(156,163,175,.08)', color: isAttended ? '#15803d' : 'var(--gray3)', border: `1px solid ${isAttended ? '#86efac' : 'var(--gray4)'}` }}>{isAttended ? '✅ حضر' : '❌ غائب'}</span>
                                                                            {hasRealUrl && <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}>📜 {cert.name && cert.name !== 'uploaded' ? (cert.name.length > 20 ? cert.name.slice(0, 20) + '…' : cert.name) : 'مرفوعة'}</span>}
                                                                            {hasPlaceholder && <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac' }}>✅ مرفوعة على السيرفر</span>}
                                                                            {!cert && canUpload && <span style={{ fontSize: '.6rem', color: '#7c3aed', padding: '2px 8px', borderRadius: 6, background: 'rgba(124,58,237,.05)', border: '1px solid rgba(124,58,237,.15)' }}>لم تُرفع بعد</span>}
                                                                            {!cert && !canUpload && <span style={{ fontSize: '.6rem', color: 'var(--gray4)', padding: '2px 8px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--gray5)' }}>يجب تسجيل الحضور أولاً</span>}
                                                                            {cert?.uploadedAt && <span style={{ fontSize: '.58rem', color: 'var(--gray3)', padding: '2px 6px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--gray5)' }}>🗓 {cert.uploadedAt}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="d-cert-actions">
                                                                    {cert ? (
                                                                        <>
                                                                            {hasRealUrl && <button className="d-cert-btn dl" onClick={() => viewCert(cert.certId, cert.url, cert.rawUrl, cert.name, cert.userId, cert.planworkId)}>👁 عرض</button>}
                                                                            <button className="d-cert-btn up" disabled={uploading} onClick={() => setCertModal({ enrollmentId: row.enrollmentId, userId: row.userId, planworkId: row.planworkId, certKey: ck, userName: `${row.user.firstName || row.user.username} ${row.user.lastName}`, courseTitle: row.course.title })}>{uploading ? '⏳' : '🔄 تحديث'}</button>
                                                                            <button className="d-cert-btn rm" disabled={deleting} onClick={() => deleteCert(ck, row.altKey)}>{deleting ? '⏳' : '🗑'}</button>
                                                                        </>
                                                                    ) : canUpload ? (
                                                                        <button className="d-cert-btn up full" disabled={uploading} onClick={() => setCertModal({ enrollmentId: row.enrollmentId, userId: row.userId, planworkId: row.planworkId, certKey: ck, userName: `${row.user.firstName || row.user.username} ${row.user.lastName}`, courseTitle: row.course.title })}>{uploading ? '⏳ جاري الرفع...' : '⬆ رفع شهادة'}</button>
                                                                    ) : (
                                                                        <span style={{ fontSize: '.62rem', color: 'var(--gray4)', width: '100%', textAlign: 'center', fontFamily: '"Droid Arabic Kufi", serif' }}>سجّل الحضور أولاً لرفع الشهادة</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <Pagination currentPage={certPage} totalItems={certRows.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCertPage} accentColor="#7c3aed" />
                                            </>
                                        )}
                            </div>
                        </div>
                    )}

                    {/* ══ USERS / COURSES TABS ══ */}
                    {isExportTab && (
                        <>
                            <div className="d-toolbar">
                                <div className="d-search">
                                    <input type="text" placeholder={activeTab === 'users' ? 'ابحث باسم المستخدم أو البريد...' : 'ابحث باسم الدورة أو الفئة...'} value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setExpandedRow(null); }} />
                                </div>
                                <span className="d-flbl">📅</span>
                                <span className="d-fsm">من</span>
                                <input type="date" className="d-fdate" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setExpandedRow(null); }} />
                                <span className="d-fsm">إلى</span>
                                <input type="date" className="d-fdate" value={dateTo} min={dateFrom} onChange={e => { setDateTo(e.target.value); setExpandedRow(null); }} />
                                {(dateFrom || dateTo) && (<><span className="d-fbadge">🔶 فلتر نشط</span><button className="d-fclear" onClick={() => { setDateFrom(''); setDateTo(''); setExpandedRow(null); }}>✕</button></>)}
                                <div className="d-expw" ref={exportRef}>
                                    <button className="d-expbtn" disabled={exporting} onClick={() => setExportMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                    {exportMenuOpen && (
                                        <div className="d-expmenu">
                                            <button className="d-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button>
                                            <button className="d-expitem" onClick={doPDF}>📄 PDF</button>
                                            <button className="d-expitem" onClick={doWord}>📝 Word (.docx)</button>
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
                                                <>
                                                    <div className="d-tscr">
                                                        <table className="d-tbl">
                                                            <thead>
                                                                <tr>
                                                                    <th className="c" style={{ width: 40 }}>#</th>
                                                                    {activeTab === 'users'
                                                                        ? <><th>المستخدم</th><th>البريد الإلكتروني</th><th className="c">الدورات</th><th className="c">تفاصيل</th></>
                                                                        : <><th className="or">اسم الدورة</th><th className="or c">المسجّلون</th><th className="or c">تفاصيل</th></>}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {activeTab === 'users'
                                                                    ? paginatedUsers.map((u, idx) => {
                                                                        const rowNum = (usersPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                        return (
                                                                            <React.Fragment key={u.id}>
                                                                                <tr className={expandedRow === u.id ? 'xopen' : ''}>
                                                                                    <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                                    <td><div className="d-uc"><div className="d-av">{(u.firstName || u.username || '?')[0]}{(u.lastName || '')[0]}</div><span className="d-uname">{u.firstName || u.username} {u.lastName}</span></div></td>
                                                                                    <td className="d-email">{u.email}</td>
                                                                                    <td style={{ textAlign: 'center' }}><span className="d-cb">{u.enrolledCourses.length}</span></td>
                                                                                    <td style={{ textAlign: 'center' }}>{u.enrolledCourses.length > 0 ? <span className={`d-pill${expandedRow === u.id ? ' op' : ''}`} onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}>{expandedRow === u.id ? '▲ إخفاء' : '▼ عرض'}</span> : <span style={{ color: 'var(--gray4)' }}>—</span>}</td>
                                                                                </tr>
                                                                                {expandedRow === u.id && (
                                                                                    <tr className="d-xrow"><td colSpan={5}><div className="d-xin">{u.enrolledCourses.map(c => { const ck = String(c.enrollmentId ?? `${u.id}-${c.id}`); return (<div className="d-mc" key={ck}><div className="d-mt">📚 {c.title}</div>{c.date && <div className="d-md">📅 {c.date}</div>}<div style={{ marginTop: 5, display: 'flex', gap: 5, flexWrap: 'wrap' }}><span className={`d-att-badge ${attendance[String(c.enrollmentId)] ? 'on' : 'off'}`} style={{ fontSize: '.62rem' }}>{attendance[String(c.enrollmentId)] ? '✅ حضر' : '❌ غائب'}</span>{(certificates[ck] ?? certificates[`${u.id}-${c.id}`]) ? <span style={{ fontSize: '.62rem', color: '#7c3aed', fontWeight: 700 }}>📜 شهادة</span> : null}</div></div>); })}</div></td></tr>
                                                                                )}
                                                                            </React.Fragment>
                                                                        );
                                                                    })
                                                                    : paginatedCourses.map((c, idx) => {
                                                                        const rowNum = (coursesPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                        return (
                                                                            <React.Fragment key={c.id}>
                                                                                <tr className={expandedRow === c.id ? 'xopen' : ''}>
                                                                                    <td style={{ color: 'var(--gray3)', fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                                    <td style={{ fontWeight: 700, color: 'var(--blue)' }}>📚 {c.title}</td>
                                                                                    <td style={{ textAlign: 'center' }}><span className="d-cb or">{c.enrolledUsers.length}</span></td>
                                                                                    <td style={{ textAlign: 'center' }}>{c.enrolledUsers.length > 0 ? <span className={`d-pill or${expandedRow === c.id ? ' op' : ''}`} onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}>{expandedRow === c.id ? '▲ إخفاء' : '▼ عرض'}</span> : <span style={{ color: 'var(--gray4)' }}>—</span>}</td>
                                                                                </tr>
                                                                                {expandedRow === c.id && (
                                                                                    <tr className="d-xrow"><td colSpan={4}><div className="d-xin">{c.enrolledUsers.map(u => (<div className="d-mc" key={u.enrollmentId ?? u.username ?? u.email}><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}><div className="d-av or sm">{(u.firstName || u.username || '?')[0]}{(u.lastName || '')[0]}</div><div><div className="d-mt or">{u.firstName || u.username} {u.lastName}</div><div className="d-ms">✉ {u.email}</div></div></div>{u.date && <div className="d-md">📅 {u.date}</div>}</div>))}</div></td></tr>
                                                                                )}
                                                                            </React.Fragment>
                                                                        );
                                                                    })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <Pagination
                                                        currentPage={activeTab === 'users' ? usersPage : coursesPage}
                                                        totalItems={activeTab === 'users' ? filteredUsers.length : filteredCourses.length}
                                                        itemsPerPage={ITEMS_PER_PAGE}
                                                        onPageChange={activeTab === 'users' ? p => { setUsersPage(p); setExpandedRow(null); } : p => { setCoursesPage(p); setExpandedRow(null); }}
                                                        accentColor={activeTab === 'users' ? '#0865a8' : '#f57c00'}
                                                    />
                                                </>
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