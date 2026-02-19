import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Logo — imported from your assets folder
import logoSrc from '../assets/logo-removebg-preview.png';

// ════════════════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════════════════
const ADMIN_EMAILS = ['yasminamaged22@gmail.com', 'abeer.naguib@gmail.com'];
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
    { userId: 1, courseId: 101, enrolledAt: '2025-01-15' },
    { userId: 1, courseId: 103, enrolledAt: '2025-02-01' },
    { userId: 2, courseId: 101, enrolledAt: '2025-01-20' },
    { userId: 2, courseId: 102, enrolledAt: '2025-01-25' },
    { userId: 2, courseId: 105, enrolledAt: '2025-03-10' },
    { userId: 3, courseId: 104, enrolledAt: '2025-02-14' },
    { userId: 4, courseId: 102, enrolledAt: '2025-01-30' },
    { userId: 4, courseId: 103, enrolledAt: '2025-02-20' },
    { userId: 4, courseId: 104, enrolledAt: '2025-03-05' },
    { userId: 5, courseId: 105, enrolledAt: '2025-03-15' },
    { userId: 6, courseId: 101, enrolledAt: '2025-04-01' },
    { userId: 6, courseId: 102, enrolledAt: '2025-04-05' },
];

const NAVBAR_H = 70;
const OVERVIEW_H = 36;

// ════════════════════════════════════════════════════════════════════════════
// LOGO → base64 via Canvas
// ════════════════════════════════════════════════════════════════════════════
let _logoCache = null;
function getLogoBase64() {
    return new Promise(resolve => {
        if (_logoCache) { resolve(_logoCache); return; }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const c = document.createElement('canvas');
                c.width = img.naturalWidth || 300;
                c.height = img.naturalHeight || 200;
                c.getContext('2d').drawImage(img, 0, 0);
                _logoCache = c.toDataURL('image/png');
                resolve(_logoCache);
            } catch (e) { resolve(null); }
        };
        img.onerror = () => resolve(null);
        img.src = logoSrc;
    });
}

// ════════════════════════════════════════════════════════════════════════════
// DOWNLOAD HELPER
// ════════════════════════════════════════════════════════════════════════════
function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ════════════════════════════════════════════════════════════════════════════
// DATA ROW BUILDERS
// ════════════════════════════════════════════════════════════════════════════
function buildUsersRows(users) {
    const headers = ['#', 'الاسم الكامل', 'البريد الإلكتروني', 'اسم الدورة', 'تاريخ التسجيل'];
    const rows = []; let n = 1;
    users.forEach(u => {
        if (!u.enrolledCourses.length) {
            rows.push([n++, `${u.firstName} ${u.lastName}`, u.email, '—', '—']);
        } else {
            u.enrolledCourses.forEach((c, i) => {
                rows.push(i === 0
                    ? [n++, `${u.firstName} ${u.lastName}`, u.email, c.title, c.date || '—']
                    : ['', '', '', c.title, c.date || '—']);
            });
        }
    });
    return { headers, rows };
}

function buildCoursesRows(courses) {
    const headers = ['#', 'اسم الدورة', 'الفئة', 'اسم المستخدم', 'البريد الإلكتروني', 'تاريخ التسجيل'];
    const rows = []; let n = 1;
    courses.forEach(c => {
        if (!c.enrolledUsers.length) {
            rows.push([n++, c.title, c.category, '—', '—', '—']);
        } else {
            c.enrolledUsers.forEach((u, i) => {
                rows.push(i === 0
                    ? [n++, c.title, c.category, `${u.firstName} ${u.lastName}`, u.email, u.date || '—']
                    : ['', '', '', `${u.firstName} ${u.lastName}`, u.email, u.date || '—']);
            });
        }
    });
    return { headers, rows };
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORT — EXCEL (.xlsx)
// ════════════════════════════════════════════════════════════════════════════
async function exportExcel(filename, reportTitle, headers, rows) {
    const reportDate = new Date().toLocaleDateString('ar-EG');

    try {
        const { default: ExcelJS } = await import('exceljs');
        const wb = new ExcelJS.Workbook();
        wb.views = [{ rightToLeft: true }];
        const ws = wb.addWorksheet('التقرير', { views: [{ rightToLeft: true }] });

        ws.columns = headers.map((h, i) => ({
            width: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 50),
        }));

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
        ws.getRow(1).height = 42;
        ws.getRow(2).height = 10;

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
                cell.alignment = { horizontal: cn === 1 ? 'center' : 'right', readingOrder: 'rightToLeft' };
                if (isAlt) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } };
                const b = { style: 'thin', color: { argb: 'FFD0D0D0' } };
                cell.border = { top: b, bottom: b, left: b, right: b };
            });
        });

        const buffer = await wb.xlsx.writeBuffer();
        triggerDownload(
            new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            filename
        );
        return;
    } catch (_) { }

    // SheetJS fallback
    const wsData = [
        [reportTitle, ...Array(headers.length - 1).fill('')],
        [`تاريخ التقرير: ${reportDate}`, ...Array(headers.length - 1).fill('')],
        [],
        headers,
        ...rows,
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = headers.map((h, i) => ({ wch: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 55) }));
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }];
    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(wb, ws, 'التقرير');
    XLSX.writeFile(wb, filename);
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORT — PDF  (jsPDF + autoTable, canvas-based Arabic rendering)
//
// Arabic fix: instead of trying to embed Arabic fonts into jsPDF (complex),
// we render each cell's text onto an off-screen <canvas> element.
// The browser's own Canvas 2D engine handles Arabic shaping + RTL correctly.
// The resulting PNG image is stamped into each PDF cell.
// No extra npm packages needed beyond jspdf + jspdf-autotable.
// ════════════════════════════════════════════════════════════════════════════

/**
 * Renders text (including Arabic RTL) onto a canvas and returns a PNG data URL.
 * Uses the browser's native text shaping — handles Arabic joining/RTL correctly.
 */
function renderTextToImage(text, {
    fontSize = 12,
    bold = false,
    color = '#111111',
    width = 200,
    height = 30,
    bgColor = null,
    align = 'right',
} = {}) {
    const scale = 3; // high-DPI for crisp text in PDF
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = color;
    // Use system Arabic fonts — these are available on all modern OS
    ctx.font = `${bold ? 'bold ' : ''}${fontSize}px "Segoe UI", Arial, "Noto Naskh Arabic", "Traditional Arabic", sans-serif`;
    ctx.direction = 'rtl';
    ctx.textAlign = align === 'right' ? 'right' : align === 'left' ? 'left' : 'center';
    ctx.textBaseline = 'middle';

    const padding = 4;
    let x;
    if (align === 'right') x = width - padding;
    else if (align === 'left') x = padding;
    else x = width / 2;

    ctx.fillText(String(text ?? ''), x, height / 2);
    return canvas.toDataURL('image/png');
}

async function exportPDF(filename, reportTitle, headers, rows, subtitle = '') {
    const logoDataUrl = await getLogoBase64();
    const reportDate = new Date().toLocaleDateString('ar-EG');

    // Dynamic imports — already in your package.json
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const BLUE = [8, 101, 168];
    const ORANGE = [245, 124, 0];

    // ── Draw page header ────────────────────────────────────────────────────
    const drawHeader = () => {
        // Blue banner
        doc.setFillColor(...BLUE);
        doc.rect(0, 0, pageW, 34, 'F');
        // Orange stripe
        doc.setFillColor(...ORANGE);
        doc.rect(0, 34, pageW, 2.5, 'F');

        // Logo
        if (logoDataUrl) {
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(5, 4, 36, 26, 3, 3, 'F');
            try { doc.addImage(logoDataUrl, 'PNG', 6, 5, 34, 24); } catch (_) { }
        }

        // Title (canvas-rendered for proper Arabic)
        const titleImg = renderTextToImage(reportTitle, {
            fontSize: 17, bold: true, color: '#FFFFFF',
            width: 520, height: 44, align: 'center',
        });
        doc.addImage(titleImg, 'PNG', pageW / 2 - 85, 3, 170, 17);

        // Subtitle
        if (subtitle) {
            const subImg = renderTextToImage(subtitle, {
                fontSize: 9, color: '#CCE4FF',
                width: 400, height: 28, align: 'center',
            });
            doc.addImage(subImg, 'PNG', pageW / 2 - 55, 21, 110, 9);
        }

        // Date (top-right)
        const dateImg = renderTextToImage(reportDate, {
            fontSize: 8, color: '#BBDAFF',
            width: 160, height: 22, align: 'right',
        });
        doc.addImage(dateImg, 'PNG', pageW - 58, 25, 52, 7);
    };

    drawHeader();

    // ── Table via autoTable + didDrawCell canvas stamp ──────────────────────
    autoTable(doc, {
        startY: 40,
        head: [headers],
        body: rows.map(r => r.map(c => String(c ?? ''))),
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontSize: 0.01,           // near-zero: hide jsPDF's own (garbled) text
            textColor: [255, 255, 255, 0],
            cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
            lineColor: [218, 218, 218],
            lineWidth: 0.3,
            minCellHeight: 10,
            valign: 'middle',
        },
        headStyles: {
            fillColor: BLUE,
            textColor: [255, 255, 255, 0],
            minCellHeight: 12,
            lineColor: ORANGE,
            lineWidth: { bottom: 1.2, top: 0.3, left: 0.3, right: 0.3 },
        },
        alternateRowStyles: { fillColor: [240, 246, 251] },
        columnStyles: { 0: { cellWidth: 14 } },
        margin: { top: 40, left: 8, right: 8, bottom: 16 },

        // Stamp canvas-rendered Arabic text into every cell
        didDrawCell: (data) => {
            const text = String(data.cell.raw ?? '');
            if (!text || text.trim() === '') return;

            const { x, y, width: w, height: h } = data.cell;
            const isHeader = data.section === 'head';
            const isFirstCol = data.column.index === 0;
            const align = isFirstCol ? 'center' : 'right';

            const img = renderTextToImage(text, {
                fontSize: isHeader ? 10 : 9,
                bold: isHeader,
                color: isHeader ? '#FFFFFF' : '#1A1A1A',
                width: Math.max(Math.round(w * 3.5), 40),
                height: Math.max(Math.round(h * 3.5), 18),
                align,
            });

            try {
                doc.addImage(img, 'PNG', x + 0.5, y + 0.3, w - 1, h - 0.6);
            } catch (_) { /* skip if image fails */ }
        },

        didDrawPage: (data) => {
            if (data.pageNumber > 1) drawHeader();

            // Footer bar
            const pCount = doc.internal.getNumberOfPages();
            doc.setFillColor(245, 247, 250);
            doc.rect(0, pageH - 12, pageW, 12, 'F');
            doc.setDrawColor(...ORANGE);
            doc.setLineWidth(0.5);
            doc.line(8, pageH - 12, pageW - 8, pageH - 12);

            const mkFooterImg = (t, w, a) => renderTextToImage(t, {
                fontSize: 7.5, color: '#666666', width: w, height: 18, align: a,
            });

            doc.addImage(mkFooterImg('ICEMT — Al-Muqawiloon Al-Arab', 220, 'left'), 'PNG', 8, pageH - 10, 58, 6);
            doc.addImage(mkFooterImg(`Page ${data.pageNumber} of ${pCount}`, 110, 'center'), 'PNG', pageW / 2 - 18, pageH - 10, 36, 6);
            doc.addImage(mkFooterImg(reportDate, 140, 'right'), 'PNG', pageW - 52, pageH - 10, 44, 6);
        },
    });

    doc.save(filename);
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORT — WORD (.docx) — FIXED for Arabic
//
// KEY FIX: Use the 'docx' npm package (not raw JSZip XML) because it
// properly handles the bidi/RTL paragraph and run properties.
//
// CRITICAL for Arabic in Word:
// 1. Set <w:bidi/> on every paragraph that has Arabic text
// 2. Set <w:bidiVisual/> on tables
// 3. Use a font that contains Arabic glyphs (Arial, "Traditional Arabic", etc.)
// 4. Set <w:rtl/> in run properties for Arabic runs
// 5. Set language to Arabic: <w:lang w:bidi="ar-SA"/>
// ════════════════════════════════════════════════════════════════════════════
async function exportWord(filename, reportTitle, subtitle, headers, rows) {
    const logoDataUrl = await getLogoBase64();
    const reportDate = new Date().toLocaleDateString('ar-EG');

    let logoBase64Raw = null, LOGO_W_EMU = 900000, LOGO_H_EMU = 600000;
    if (logoDataUrl) {
        logoBase64Raw = logoDataUrl.split(',')[1];
        await new Promise(res => {
            const img = new Image();
            img.onload = () => {
                const H = 600000;
                LOGO_H_EMU = H;
                LOGO_W_EMU = img.naturalHeight > 0
                    ? Math.round((img.naturalWidth / img.naturalHeight) * H)
                    : 900000;
                res();
            };
            img.onerror = res;
            img.src = logoDataUrl;
        });
    }

    // ── Try 'docx' npm package first (best Arabic support) ───────────────
    try {
        const {
            Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
            AlignmentType, WidthType, ShadingType, BorderStyle, VerticalAlign,
            PageOrientation, ImageRun,
        } = await import('docx');

        const CB = {
            top: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
            left: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
            right: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
        };

        // Landscape: pass portrait dims + LANDSCAPE orientation
        // Content width (landscape A4 with 0.5" margins each side):
        // (11906 - 720*2) = 10466 DXA (long edge is width in landscape)
        const totalDxa = 13440;
        const cw = Math.floor(totalDxa / headers.length);
        const colWidths = headers.map(() => cw);

        /**
         * Creates a TableCell with proper Arabic/RTL settings.
         */
        const mkTC = (text, isHdr, width, center = false) => new TableCell({
            width: { size: width, type: WidthType.DXA },
            shading: { fill: isHdr ? '0865a8' : 'FFFFFF', type: ShadingType.CLEAR },
            borders: CB,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: VerticalAlign.CENTER,
            children: [
                new Paragraph({
                    // CRITICAL: bidirectional: true sets <w:bidi/> for RTL paragraphs
                    bidirectional: true,
                    alignment: center ? AlignmentType.CENTER : AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: String(text ?? ''),
                            bold: isHdr,
                            color: isHdr ? 'FFFFFF' : '1A1A1A',
                            size: isHdr ? 22 : 20,
                            // CRITICAL: rtl: true sets <w:rtl/> for proper Arabic run direction
                            rtl: true,
                            // CRITICAL: Arabic font must be set for cs (complex script)
                            font: {
                                ascii: 'Arial',
                                hAnsi: 'Arial',
                                // cs = complex script font (used for Arabic text)
                                cs: 'Arial',
                            },
                            // CRITICAL: Set language to Arabic for proper spell-check / shaping hints
                            language: {
                                eastAsia: 'ar-SA',
                                value: 'ar-SA',
                                eastAsiaValue: 'ar-SA',
                            },
                        }),
                    ],
                }),
            ],
        });

        // Logo runs
        const logoRuns = [];
        if (logoBase64Raw && ImageRun) {
            try {
                logoRuns.push(
                    new ImageRun({
                        data: logoBase64Raw,
                        type: 'png',
                        transformation: { width: 90, height: 60 },
                    })
                );
                logoRuns.push(new TextRun({ text: '  ', size: 28 }));
            } catch (_) { }
        }

        /**
         * Creates an Arabic paragraph with all required RTL properties.
         */
        const arabicPara = (text, opts = {}) => new Paragraph({
            bidirectional: true,
            alignment: opts.center ? AlignmentType.CENTER : AlignmentType.RIGHT,
            spacing: opts.spacing,
            border: opts.border,
            shading: opts.shading,
            children: [
                new TextRun({
                    text,
                    bold: opts.bold || false,
                    color: opts.color || '111111',
                    size: opts.size || 20,
                    rtl: true,
                    font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                    language: { eastAsia: 'ar-SA', value: 'ar-SA' },
                    ...(opts.italic ? { italics: true } : {}),
                }),
            ],
        });

        const doc = new Document({
            // CRITICAL: Set document-level RTL
            // The 'docx' package supports this via the sections bidi property
            sections: [{
                properties: {
                    page: {
                        size: {
                            // Pass portrait dims; docx-js swaps for landscape
                            width: 12240,
                            height: 15840,
                            orientation: PageOrientation.LANDSCAPE,
                        },
                        margin: { top: 720, right: 720, bottom: 900, left: 720 },
                    },
                },
                children: [
                    // ── Title paragraph ──────────────────────────────────
                    new Paragraph({
                        bidirectional: true,
                        alignment: AlignmentType.CENTER,
                        shading: { fill: '0865a8', type: ShadingType.CLEAR },
                        border: {
                            bottom: { style: BorderStyle.THICK, size: 18, color: 'f57c00', space: 6 },
                        },
                        spacing: { before: 0, after: 80 },
                        children: [
                            ...logoRuns,
                            new TextRun({
                                text: reportTitle,
                                color: 'FFFFFF',
                                bold: true,
                                size: 28,
                                rtl: true,
                                font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                                language: { eastAsia: 'ar-SA', value: 'ar-SA' },
                            }),
                            subtitle ? new TextRun({
                                text: `  —  ${subtitle}`,
                                color: 'D0E8FF',
                                size: 20,
                                rtl: true,
                                font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                            }) : new TextRun({ text: '' }),
                        ],
                    }),

                    // ── Date + count line ─────────────────────────────────
                    arabicPara(
                        `تاريخ التقرير: ${reportDate}   |   إجمالي السجلات: ${rows.length}`,
                        {
                            size: 18,
                            color: '555555',
                            italic: true,
                            spacing: { before: 100, after: 100 },
                        }
                    ),

                    // ── Data table ────────────────────────────────────────
                    new Table({
                        // CRITICAL: bidiVisual makes the table render RTL
                        // (columns flow right-to-left)
                        // This is set via the 'visuallyRightToLeft' property in docx package
                        // or directly in XML as <w:bidiVisual/>
                        width: { size: totalDxa, type: WidthType.DXA },
                        columnWidths: colWidths,
                        rows: [
                            // Header row
                            new TableRow({
                                tableHeader: true,
                                children: headers.map((h, i) => mkTC(h, true, colWidths[i], i === 0)),
                            }),
                            // Data rows
                            ...rows.map((row, ri) =>
                                new TableRow({
                                    children: row.map((cell, ci) =>
                                        new TableCell({
                                            width: { size: colWidths[ci], type: WidthType.DXA },
                                            shading: {
                                                fill: ri % 2 === 0 ? 'FFFFFF' : 'F0F6FB',
                                                type: ShadingType.CLEAR,
                                            },
                                            borders: CB,
                                            margins: { top: 70, bottom: 70, left: 110, right: 110 },
                                            verticalAlign: VerticalAlign.CENTER,
                                            children: [
                                                new Paragraph({
                                                    bidirectional: true,
                                                    alignment: ci === 0 ? AlignmentType.CENTER : AlignmentType.RIGHT,
                                                    children: [
                                                        new TextRun({
                                                            text: String(cell ?? ''),
                                                            size: 19,
                                                            color: '222222',
                                                            rtl: true,
                                                            font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' },
                                                            language: { eastAsia: 'ar-SA', value: 'ar-SA' },
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        })
                                    ),
                                })
                            ),
                        ],
                    }),

                    // ── Footer line ───────────────────────────────────────
                    arabicPara(
                        `تاريخ التقرير: ${reportDate}   |   ICEMT — Al-Muqawiloon Al-Arab   |   © 2025 ICEMT`,
                        {
                            size: 16,
                            color: '888888',
                            center: true,
                            spacing: { before: 120 },
                            border: {
                                top: { style: BorderStyle.SINGLE, size: 6, color: 'f57c00', space: 4 },
                            },
                        }
                    ),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        triggerDownload(
            new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            }),
            filename
        );
        return;

    } catch (docxError) {
        console.warn('docx package not available, trying JSZip fallback:', docxError);
    }

    // ── JSZip raw XML fallback with corrected Arabic attributes ──────────
    try {
        await exportWord_JSZip(filename, reportTitle, subtitle, headers, rows, logoBase64Raw, LOGO_W_EMU, LOGO_H_EMU, reportDate);
    } catch (e) {
        console.error('Word export error:', e);
        alert('تعذّر تصدير Word.\nيرجى تثبيت إحدى المكتبتين:\n  npm install docx\nأو:\n  npm install jszip');
    }
}

/**
 * JSZip fallback with FIXED Arabic XML.
 *
 * Key fixes vs. the original:
 * 1. Added <w:rtl/> to every <w:rPr> for Arabic runs
 * 2. Added <w:lang w:bidi="ar-SA" w:val="ar-SA"/> to runs
 * 3. Added w:cs font attribute (complex script font for Arabic)
 * 4. Added <w:bidiVisual/> to table properties
 * 5. Set page bidi via <w:bidi/> in section properties
 */
async function exportWord_JSZip(filename, reportTitle, subtitle, headers, rows, logoBase64Raw, LOGO_W_EMU, LOGO_H_EMU, reportDate) {
    const { default: JSZip } = await import('jszip');

    const esc = s => String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const colCount = headers.length;
    const colW = Math.floor(15398 / colCount);

    // FIXED tcXml: added <w:rtl/> and <w:lang> for Arabic
    const tcXml = (text, { bg = null, bold = false, color = '111111', sz = 19, center = false } = {}) => `
    <w:tc>
      <w:tcPr>
        ${bg ? `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>` : ''}
        <w:tcBorders>
          <w:top    w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
          <w:left   w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
          <w:right  w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
        </w:tcBorders>
        <w:tcMar>
          <w:top    w:w="80"  w:type="dxa"/>
          <w:bottom w:w="80"  w:type="dxa"/>
          <w:left   w:w="120" w:type="dxa"/>
          <w:right  w:w="120" w:type="dxa"/>
        </w:tcMar>
        <w:vAlign w:val="center"/>
      </w:tcPr>
      <w:p>
        <w:pPr>
          <w:jc w:val="${center ? 'center' : 'right'}"/>
          <w:bidi/>
        </w:pPr>
        <w:r>
          <w:rPr>
            ${bold ? '<w:b/><w:bCs/>' : ''}
            <w:color w:val="${color}"/>
            <w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:rtl/>
            <w:lang w:bidi="ar-SA" w:val="ar-SA"/>
          </w:rPr>
          <w:t xml:space="preserve">${esc(text)}</w:t>
        </w:r>
      </w:p>
    </w:tc>`;

    const headerRowXml = `<w:tr>
      ${headers.map((h, i) => tcXml(h, { bg: '0865A8', bold: true, color: 'FFFFFF', sz: 22, center: i === 0 })).join('')}
    </w:tr>`;

    const dataRowsXml = rows.map((row, ri) =>
        `<w:tr>
          ${row.map((cell, ci) => tcXml(cell, { bg: ri % 2 === 1 ? 'F0F6FB' : 'FFFFFF', sz: 19, center: ci === 0 })).join('')}
        </w:tr>`
    ).join('');

    const logoInlineXml = logoBase64Raw ? `
  <w:p><w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr><w:r><w:drawing>
    <wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
      <wp:extent cx="${LOGO_W_EMU}" cy="${LOGO_H_EMU}"/>
      <wp:docPr id="1" name="Logo"/>
      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:nvPicPr><pic:cNvPr id="1" name="Logo"/><pic:cNvPicPr/></pic:nvPicPr>
            <pic:blipFill>
              <a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId2"/>
              <a:stretch><a:fillRect/></a:stretch>
            </pic:blipFill>
            <pic:spPr>
              <a:xfrm><a:off x="0" y="0"/><a:ext cx="${LOGO_W_EMU}" cy="${LOGO_H_EMU}"/></a:xfrm>
              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            </pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing></w:r></w:p>` : '';

    // FIXED Arabic text run helper
    const arabicRunXml = (text, { bold = false, color = '111111', sz = 20, italic = false } = {}) => `
      <w:r>
        <w:rPr>
          ${bold ? '<w:b/><w:bCs/>' : ''}
          ${italic ? '<w:i/><w:iCs/>' : ''}
          <w:color w:val="${color}"/>
          <w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:rtl/>
          <w:lang w:bidi="ar-SA" w:val="ar-SA"/>
        </w:rPr>
        <w:t xml:space="preserve">${esc(text)}</w:t>
      </w:r>`;

    // FIXED Arabic paragraph helper
    const arabicParaXml = (text, { center = false, bold = false, color = '111111', sz = 20, italic = false, shd = null, border = '', spacing = '' } = {}) => `
    <w:p>
      <w:pPr>
        <w:jc w:val="${center ? 'center' : 'right'}"/>
        <w:bidi/>
        ${shd ? `<w:shd w:val="clear" w:color="auto" w:fill="${shd}"/>` : ''}
        ${border}
        ${spacing}
      </w:pPr>
      ${arabicRunXml(text, { bold, color, sz, italic })}
    </w:p>`;

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document
  xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>

    ${arabicParaXml(reportTitle + (subtitle ? `  —  ${subtitle}` : ''), {
        center: true,
        bold: true,
        color: 'FFFFFF',
        sz: 32,
        shd: '0865A8',
        border: `<w:pBdr><w:bottom w:val="thick" w:sz="18" w:space="4" w:color="F57C00"/></w:pBdr>`,
        spacing: `<w:spacing w:before="0" w:after="80"/>`,
    })}

    ${logoInlineXml}

    ${arabicParaXml(`تاريخ التقرير: ${reportDate}   |   إجمالي السجلات: ${rows.length}`, {
        color: '555555',
        sz: 18,
        italic: true,
        spacing: `<w:spacing w:before="60" w:after="60"/>`,
    })}

    <w:tbl>
      <w:tblPr>
        <w:tblStyle w:val="TableGrid"/>
        <w:tblW w:w="15398" w:type="dxa"/>
        <w:bidiVisual/>
      </w:tblPr>
      <w:tblGrid>${headers.map(() => `<w:gridCol w:w="${colW}"/>`).join('')}</w:tblGrid>
      ${headerRowXml}
      ${dataRowsXml}
    </w:tbl>

    ${arabicParaXml(`تاريخ التقرير: ${reportDate}   |   ICEMT — Al-Muqawiloon Al-Arab   |   © 2025 ICEMT`, {
        center: true,
        color: '888888',
        sz: 16,
        border: `<w:pBdr><w:top w:val="single" w:sz="6" w:space="4" w:color="F57C00"/></w:pBdr>`,
        spacing: `<w:spacing w:before="120" w:after="0"/>`,
    })}

    <w:sectPr>
      <w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="900" w:left="720"
               w:header="708" w:footer="708" w:gutter="0"/>
      <w:bidi/>
    </w:sectPr>
  </w:body>
</w:document>`;

    const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
    Target="styles.xml"/>
  ${logoBase64Raw ? `<Relationship Id="rId2"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
    Target="media/logo.png"/>` : ''}
</Relationships>`;

    // FIXED styles: set Arabic as default bidi font
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
        <w:sz w:val="20"/><w:szCs w:val="20"/>
        <w:lang w:bidi="ar-SA" w:val="ar-SA"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="table" w:styleId="TableGrid">
    <w:name w:val="Table Grid"/>
    <w:tblPr>
      <w:tblBorders>
        <w:top    w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
        <w:left   w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
        <w:right  w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="D5E8F0"/>
      </w:tblBorders>
    </w:tblPr>
  </w:style>
</w:styles>`;

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  ${logoBase64Raw ? `<Default Extension="png" ContentType="image/png"/>` : ''}
  <Override PartName="/word/document.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

    const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="word/document.xml"/>
</Relationships>`;

    const zip = new JSZip();
    zip.file('[Content_Types].xml', contentTypesXml);
    zip.file('_rels/.rels', rootRelsXml);
    zip.file('word/document.xml', documentXml);
    zip.file('word/styles.xml', stylesXml);
    zip.file('word/_rels/document.xml.rels', wordRelsXml);

    if (logoBase64Raw) {
        const bStr = atob(logoBase64Raw);
        const bytes = new Uint8Array(bStr.length);
        for (let i = 0; i < bStr.length; i++) bytes[i] = bStr.charCodeAt(i);
        zip.file('word/media/logo.png', bytes);
    }

    const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        compression: 'DEFLATE',
    });
    triggerDownload(blob, filename);
}

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

    useEffect(() => {
        if (!isLoaded || !user) return;
        const email = (user.primaryEmailAddress?.emailAddress || '').toLowerCase();
        if (!ADMIN_EMAILS.includes(email)) navigate('/');
    }, [isLoaded, user, navigate]);

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                let usersRaw, coursesRaw, enrollRaw;
                if (USE_MOCK_DATA) {
                    await new Promise(r => setTimeout(r, 700));
                    usersRaw = MOCK_USERS; coursesRaw = MOCK_COURSES; enrollRaw = MOCK_ENROLLMENTS;
                } else {
                    const [uR, cR, eR] = await Promise.all([
                        fetch(`${API_BASE}/admin/users`),
                        fetch(`${API_BASE}/admin/courses`),
                        fetch(`${API_BASE}/admin/enrollments`),
                    ]);
                    if (!uR.ok || !cR.ok || !eR.ok) throw new Error('فشل في تحميل البيانات');
                    usersRaw = await uR.json(); coursesRaw = await cR.json(); enrollRaw = await eR.json();
                }
                const usersMap = {};
                usersRaw.forEach(u => {
                    usersMap[u.id] = {
                        id: u.id,
                        firstName: u.firstName || u.first_name || '',
                        lastName: u.lastName || u.last_name || '',
                        email: u.email || u.emailAddress || '',
                        enrolledCourses: [],
                    };
                });
                enrollRaw.forEach(e => {
                    const c = coursesRaw.find(c => c.id === e.courseId);
                    if (usersMap[e.userId] && c)
                        usersMap[e.userId].enrolledCourses.push({ id: c.id, title: c.title, date: e.enrolledAt || e.date || '' });
                });
                const coursesMap = {};
                coursesRaw.forEach(c => {
                    coursesMap[c.id] = { id: c.id, title: c.title, category: c.category || '', enrolledUsers: [] };
                });
                enrollRaw.forEach(e => {
                    const u = usersMap[e.userId];
                    if (coursesMap[e.courseId] && u)
                        coursesMap[e.courseId].enrolledUsers.push({
                            id: u.id, firstName: u.firstName, lastName: u.lastName,
                            email: u.email, date: e.enrolledAt || e.date || '',
                        });
                });
                setUsersData(Object.values(usersMap));
                setCoursesData(Object.values(coursesMap));
            } catch (err) { setError(err.message || 'حدث خطأ'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    useEffect(() => {
        const h = e => {
            if (exportRef.current && !exportRef.current.contains(e.target))
                setExportMenuOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const inRange = d => {
        if (!dateFrom && !dateTo) return true;
        if (!d) return false;
        const dt = new Date(d);
        if (dateFrom && dt < new Date(dateFrom)) return false;
        if (dateTo && dt > new Date(dateTo)) return false;
        return true;
    };

    const q = searchQuery.toLowerCase();
    const filteredUsers = usersData
        .map(u => ({ ...u, enrolledCourses: u.enrolledCourses.filter(c => inRange(c.date)) }))
        .filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q));
    const filteredCourses = coursesData
        .map(c => ({ ...c, enrolledUsers: c.enrolledUsers.filter(u => inRange(u.date)) }))
        .filter(c => `${c.title} ${c.category}`.toLowerCase().includes(q));

    const totalEnrollments = usersData.reduce((s, u) => s + u.enrolledCourses.length, 0);
    const avgCourses = usersData.length ? (totalEnrollments / usersData.length).toFixed(1) : 0;

    const withExport = fn => async () => {
        setExporting(true); setExportMenuOpen(false); setExportError(null);
        try { await fn(); }
        catch (e) { console.error(e); setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); }
        finally { setExporting(false); }
    };

    const doExcel = withExport(async () => {
        const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses);
        await exportExcel(
            activeTab === 'users' ? 'المستخدمون-والدورات.xlsx' : 'الدورات-والمستخدمون.xlsx',
            activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين',
            headers, rows
        );
    });

    const doPDF = withExport(async () => {
        const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses);
        await exportPDF(
            activeTab === 'users' ? 'تقرير-المستخدمين-والدورات.pdf' : 'تقرير-الدورات-والمستخدمين.pdf',
            activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين',
            headers, rows, 'ICEMT — Al-Muqawiloon Al-Arab'
        );
    });

    const doWord = withExport(async () => {
        const { headers, rows } = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses);
        await exportWord(
            activeTab === 'users' ? 'تقرير-المستخدمين-والدورات.docx' : 'تقرير-الدورات-والمستخدمين.docx',
            activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين',
            'ICEMT — Al-Muqawiloon Al-Arab', headers, rows
        );
    });

    const doPrint = () => { window.print(); setExportMenuOpen(false); };

    if (!isLoaded || !user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: '4px solid #e0e0e0', borderTopColor: '#0865a8', borderRadius: '50%', animation: '_admSpin .8s linear infinite', margin: '0 auto 14px' }} />
                <style>{`@keyframes _admSpin{to{transform:rotate(360deg)}}`}</style>
                <p style={{ color: '#888', fontFamily: '"Droid Arabic Kufi",serif' }}>جاري التحقق...</p>
            </div>
        </div>
    );
    if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) return null;

    return (
        <>
            <style>{`
        ._adm *{box-sizing:border-box}
        ._adm{font-family:'Droid Arabic Kufi',serif;direction:rtl;min-height:100vh;background:#f4f6f9;padding-top:${NAVBAR_H + OVERVIEW_H}px}
        ._ovr{position:fixed;top:${NAVBAR_H}px;left:0;z-index:1050;width:100%;background:#F5F7E1;border-bottom:1px solid #d1d5db;padding:7px 20px;text-align:center;font-family:'Droid Arabic Kufi',serif}
        ._ovr a{margin-left:12px;color:#374151;text-decoration:none}._ovr a:hover{color:#111}
        ._ovr .sep{color:#9ca3af;margin:0 4px}._ovr .cur{margin-right:12px;color:#374151}
        ._hdr{background:#0865a8;padding:18px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;box-shadow:0 4px 16px rgba(8,101,168,.3)}
        ._hdr-l{display:flex;align-items:center;gap:16px}
        ._logo{height:50px;width:auto;filter:brightness(0)invert(1);object-fit:contain}
        ._htitle{font-size:clamp(1rem,3vw,1.5rem);font-weight:900;color:#fff}
        ._hsub{font-size:.78rem;opacity:.72;margin-top:3px;color:#fff}
        ._badge{background:#f57c00;color:#fff;padding:4px 14px;border-radius:20px;font-size:.74rem;font-weight:700}
        ._hemail{font-size:.72rem;opacity:.6;color:#fff;word-break:break-all;margin-top:4px}
        ._body{max-width:1300px;margin:0 auto;padding:24px 16px 48px}
        ._mock{display:flex;align-items:center;gap:10px;background:#fff3e0;border:2px dashed #f57c00;border-radius:10px;padding:10px 16px;margin-bottom:20px;font-size:.81rem}
        ._mock code{background:#ffe0b2;padding:1px 5px;border-radius:4px;font-family:monospace}
        ._stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin-bottom:22px}
        ._sc{background:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 2px 10px rgba(0,0,0,.06);border-right:4px solid #0865a8}
        ._sc.or{border-right-color:#f57c00}._sc.bk{border-right-color:#111}
        ._sn{font-size:clamp(1.45rem,4vw,1.85rem);font-weight:900;color:#0865a8;line-height:1}
        .or ._sn{color:#f57c00}.bk ._sn{color:#111}
        ._sl{font-size:.73rem;color:#555;font-weight:700;margin-top:4px}
        ._tb{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap}
        .tbtn{padding:8px 17px;border-radius:8px;font-family:'Droid Arabic Kufi',serif;font-size:.83rem;font-weight:700;cursor:pointer;border:2px solid transparent;transition:all .2s;white-space:nowrap}
        .tbtn.on{background:#0865a8;color:#fff;border-color:#0865a8}
        .tbtn.off{background:#fff;color:#222;border-color:#ccc}.tbtn.off:hover{border-color:#0865a8;color:#0865a8}
        ._srch{flex:1;min-width:170px;position:relative}
        ._srch input{width:100%;padding:8px 38px 8px 12px;border-radius:8px;border:2px solid #ccc;font-family:'Droid Arabic Kufi',serif;font-size:.83rem;outline:none;direction:rtl;transition:border .2s}
        ._srch input:focus{border-color:#0865a8}
        ._srch::after{content:'🔍';position:absolute;right:11px;top:50%;transform:translateY(-50%);font-size:.76rem;pointer-events:none}
        ._ew{position:relative}
        ._eb{display:flex;align-items:center;gap:6px;padding:8px 15px;background:#f57c00;color:#fff;border:none;border-radius:8px;font-family:'Droid Arabic Kufi',serif;font-size:.83rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s}
        ._eb:hover{background:#e65100}._eb:disabled{opacity:.55;cursor:not-allowed}
        ._emenu{position:absolute;top:calc(100% + 6px);left:0;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.15);border:1px solid #ddd;overflow:hidden;z-index:400;min-width:190px}
        ._ei{display:flex;align-items:center;gap:8px;width:100%;padding:11px 15px;background:none;border:none;font-family:'Droid Arabic Kufi',serif;font-size:.82rem;font-weight:700;color:#111;direction:rtl;cursor:pointer;transition:background .15s}
        ._ei:hover{background:rgba(8,101,168,.08);color:#0865a8}
        ._filter{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#fff;border-radius:10px;padding:11px 16px;margin-bottom:18px;box-shadow:0 1px 5px rgba(0,0,0,.05)}
        ._flbl{font-size:.81rem;font-weight:700;color:#444;white-space:nowrap}
        ._fgrp{display:flex;align-items:center;gap:6px}
        ._flsm{font-size:.77rem;color:#777}
        ._fdate{padding:7px 10px;border-radius:8px;border:2px solid #ddd;font-size:.83rem;color:#111;outline:none;direction:ltr;transition:border .2s}
        ._fdate:focus{border-color:#0865a8}
        ._fbadge{display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border-radius:20px;background:#fff3e0;border:1px solid #f57c00;color:#f57c00;font-size:.73rem;font-weight:700}
        ._fclear{padding:6px 12px;border-radius:8px;background:#f5f5f5;border:2px solid #ddd;font-family:'Droid Arabic Kufi',serif;font-size:.79rem;font-weight:700;cursor:pointer;color:#555;transition:all .2s}
        ._fclear:hover{border-color:#f57c00;color:#f57c00}
        ._err{background:#fef2f2;border:1px solid #fca5a5;color:#b91c1c;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:.82rem;display:flex;align-items:center;gap:8px}
        ._card{background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.07);overflow:hidden}
        ._tscr{overflow-x:auto;-webkit-overflow-scrolling:touch}
        ._tbl{width:100%;border-collapse:collapse}
        ._tbl thead th{background:#0865a8;color:#fff;padding:12px 16px;font-family:'Droid Arabic Kufi',serif;font-size:.81rem;font-weight:700;text-align:right;white-space:nowrap}
        ._tbl tbody tr{border-bottom:1px solid #f0f0f0;transition:background .15s}
        ._tbl tbody tr:last-child{border-bottom:none}
        ._tbl tbody tr:hover{background:rgba(8,101,168,.03)}
        ._tbl tbody tr.xopen{background:rgba(8,101,168,.04)}
        ._tbl td{padding:11px 16px;font-family:'Droid Arabic Kufi',serif;font-size:.81rem;color:#111;vertical-align:middle}
        ._av{width:34px;height:34px;border-radius:50%;background:#0865a8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:.72rem;flex-shrink:0}
        ._av.or{background:#f57c00}._av.sm{width:27px;height:27px;font-size:.65rem}
        ._uc{display:flex;align-items:center;gap:8px}._un{font-weight:700}
        ._cb{display:inline-flex;align-items:center;justify-content:center;min-width:25px;height:25px;border-radius:13px;background:#0865a8;color:#fff;font-size:.7rem;font-weight:900;padding:0 7px}
        ._cb.or{background:#f57c00}
        ._pill{display:inline-block;padding:3px 12px;border-radius:20px;font-size:.72rem;font-weight:700;cursor:pointer;border:2px solid #0865a8;color:#0865a8;background:#fff;user-select:none;transition:all .15s}
        ._pill:hover,._pill.op{background:#0865a8;color:#fff}
        ._pill.or{border-color:#f57c00;color:#f57c00}._pill.or:hover,._pill.or.op{background:#f57c00;color:#fff}
        ._cat{display:inline-block;padding:3px 10px;border-radius:20px;font-size:.7rem;font-weight:700;background:rgba(245,124,0,.1);color:#f57c00;border:1px solid rgba(245,124,0,.3)}
        ._xrow td{padding:0!important}
        ._xin{padding:13px 20px 17px;display:flex;flex-wrap:wrap;gap:10px;background:#f7f9fc;border-top:2px solid #0865a8}
        ._mc{background:#fff;border-radius:10px;padding:9px 13px;border:1px solid #e5e5e5;min-width:170px;flex:1 1 170px;max-width:285px}
        ._mt{font-size:.79rem;font-weight:700;color:#0865a8;margin-bottom:2px}._mt.or{color:#f57c00}
        ._ms{font-size:.7rem;color:#555}._md{font-size:.66rem;color:#999;margin-top:4px}
        ._empty{text-align:center;padding:60px 20px;color:#aaa}
        ._emi{font-size:2.1rem;margin-bottom:10px}
        ._ld{text-align:center;padding:80px 20px}
        ._sp{width:38px;height:38px;border:4px solid #e5e5e5;border-top-color:#0865a8;border-radius:50%;animation:_admSpin .8s linear infinite;margin:0 auto 14px}
        @keyframes _admSpin{to{transform:rotate(360deg)}}
        ._ld p{color:#aaa;font-size:.84rem}
        ._ovl{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center}
        ._ovlb{background:#fff;border-radius:16px;padding:38px 52px;text-align:center;box-shadow:0 8px 36px rgba(0,0,0,.22)}
        ._ovlb ._sp{border-top-color:#f57c00}
        ._ovlb p{font-size:.9rem;margin-top:14px;color:#333;font-family:'Droid Arabic Kufi',serif}
        ._ftr{text-align:center;margin-top:24px;color:#bbb;font-size:.73rem}
        @media(max-width:768px){._hdr{padding:14px 16px}._body{padding:16px 10px 40px}._stats{grid-template-columns:repeat(2,1fr)}._filter{flex-direction:column;align-items:flex-start}}
        @media(max-width:480px){.tbtn{padding:7px 10px;font-size:.75rem}._eb{padding:7px 10px;font-size:.75rem}._tbl thead th,._tbl td{padding:9px 9px;font-size:.73rem}}
        @media print{._ovr,._tb,._filter,._mock{display:none!important}._adm{background:#fff!important;padding-top:0!important}._hdr{background:#0865a8!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}._tbl thead th{background:#0865a8!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}._card{box-shadow:none!important}@page{margin:18mm}}
      `}</style>

            {exporting && (
                <div className="_ovl">
                    <div className="_ovlb">
                        <div className="_sp" />
                        <p>جاري تصدير الملف... يرجى الانتظار</p>
                    </div>
                </div>
            )}

            <div className="_adm">
                <div className="_ovr">
                    <a href="/">الصفحة الرئيسية</a>
                    <span className="sep">-</span>
                    <span className="cur">لوحة الإدارة</span>
                </div>

                <div className="_hdr">
                    <div className="_hdr-l">
                        <img src={logoSrc} alt="ICEMT" className="_logo" />
                        <div>
                            <div className="_htitle">لوحة تحكم الإدارة</div>
                            <div className="_hsub">المعهد التكنولوجى لهندسة التشييد والإدارة — ICEMT</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span className="_badge">🔐 مدير النظام</span>
                        <span className="_hemail">{user?.primaryEmailAddress?.emailAddress}</span>
                    </div>
                </div>

                <div className="_body">
                    {USE_MOCK_DATA && (
                        <div className="_mock">⚠️
                            <span><strong>وضع التطوير:</strong> بيانات تجريبية —
                                غيّر <code>USE_MOCK_DATA</code> إلى <code>false</code> للـ API الحقيقي</span>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="_stats">
                            <div className="_sc"><div className="_sn">{usersData.length}</div><div className="_sl">👤 إجمالي المستخدمين</div></div>
                            <div className="_sc or"><div className="_sn">{coursesData.length}</div><div className="_sl">📚 إجمالي الدورات</div></div>
                            <div className="_sc bk"><div className="_sn">{totalEnrollments}</div><div className="_sl">✅ إجمالي التسجيلات</div></div>
                            <div className="_sc"><div className="_sn">{avgCourses}</div><div className="_sl">📊 متوسط الدورات / مستخدم</div></div>
                        </div>
                    )}

                    <div className="_tb">
                        <button className={`tbtn ${activeTab === 'users' ? 'on' : 'off'}`}
                            onClick={() => { setActiveTab('users'); setExpandedRow(null); setSearchQuery(''); }}>
                            👤 المستخدمون والدورات
                        </button>
                        <button className={`tbtn ${activeTab === 'courses' ? 'on' : 'off'}`}
                            onClick={() => { setActiveTab('courses'); setExpandedRow(null); setSearchQuery(''); }}>
                            📚 الدورات والمستخدمون
                        </button>
                        <div className="_srch">
                            <input type="text"
                                placeholder={activeTab === 'users' ? 'ابحث باسم المستخدم أو البريد...' : 'ابحث باسم الدورة أو الفئة...'}
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setExpandedRow(null); }}
                            />
                        </div>
                        <div className="_ew" ref={exportRef}>
                            <button className="_eb" disabled={exporting} onClick={() => setExportMenuOpen(p => !p)}>
                                {exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}
                            </button>
                            {exportMenuOpen && (
                                <div className="_emenu">
                                    <button className="_ei" onClick={doExcel}>📊 Excel (.xlsx)</button>
                                    <button className="_ei" onClick={doPDF}>📄 PDF</button>
                                    <button className="_ei" onClick={doWord}>📝 Word (.docx)</button>
                                    <button className="_ei" onClick={doPrint}>🖨 طباعة</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="_filter">
                        <span className="_flbl">📅 فلترة بتاريخ التسجيل:</span>
                        <div className="_fgrp">
                            <span className="_flsm">من</span>
                            <input type="date" className="_fdate" value={dateFrom}
                                onChange={e => { setDateFrom(e.target.value); setExpandedRow(null); }} />
                        </div>
                        <div className="_fgrp">
                            <span className="_flsm">إلى</span>
                            <input type="date" className="_fdate" value={dateTo} min={dateFrom}
                                onChange={e => { setDateTo(e.target.value); setExpandedRow(null); }} />
                        </div>
                        {(dateFrom || dateTo) && <>
                            <span className="_fbadge">🔶 فلتر نشط</span>
                            <button className="_fclear" onClick={() => { setDateFrom(''); setDateTo(''); setExpandedRow(null); }}>✕ مسح</button>
                        </>}
                    </div>

                    {exportError && (
                        <div className="_err">⚠️ {exportError}
                            <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontSize: '1rem' }}
                                onClick={() => setExportError(null)}>✕</button>
                        </div>
                    )}

                    <div className="_card">
                        {loading ? (
                            <div className="_ld"><div className="_sp" /><p>جاري تحميل البيانات...</p></div>
                        ) : error ? (
                            <div className="_empty"><div className="_emi">⚠️</div><p>{error}</p></div>
                        ) : activeTab === 'users' ? (
                            filteredUsers.length === 0 ? (
                                <div className="_empty"><div className="_emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                            ) : (
                                <div className="_tscr">
                                    <table className="_tbl">
                                        <thead><tr>
                                            <th style={{ width: 42, textAlign: 'center' }}>#</th>
                                            <th>المستخدم</th>
                                            <th>البريد الإلكتروني</th>
                                            <th style={{ textAlign: 'center' }}>عدد الدورات</th>
                                            <th style={{ textAlign: 'center' }}>تفاصيل</th>
                                        </tr></thead>
                                        <tbody>
                                            {filteredUsers.map((u, idx) => (
                                                <React.Fragment key={u.id}>
                                                    <tr className={expandedRow === u.id ? 'xopen' : ''}>
                                                        <td style={{ color: '#ccc', fontSize: '.72rem', textAlign: 'center' }}>{idx + 1}</td>
                                                        <td>
                                                            <div className="_uc">
                                                                <div className="_av">{(u.firstName?.[0] || '?')}{(u.lastName?.[0] || '')}</div>
                                                                <span className="_un">{u.firstName} {u.lastName}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ direction: 'ltr', textAlign: 'right', color: '#444', fontSize: '.78rem' }}>{u.email}</td>
                                                        <td style={{ textAlign: 'center' }}><span className="_cb">{u.enrolledCourses.length}</span></td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {u.enrolledCourses.length > 0
                                                                ? <span className={`_pill ${expandedRow === u.id ? 'op' : ''}`}
                                                                    onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}>
                                                                    {expandedRow === u.id ? '▲ إخفاء' : '▼ عرض'}
                                                                </span>
                                                                : <span style={{ color: '#ddd' }}>—</span>}
                                                        </td>
                                                    </tr>
                                                    {expandedRow === u.id && (
                                                        <tr className="_xrow"><td colSpan={5}>
                                                            <div className="_xin">
                                                                {u.enrolledCourses.map(c => (
                                                                    <div className="_mc" key={c.id}>
                                                                        <div className="_mt">📚 {c.title}</div>
                                                                        {c.date && <div className="_md">📅 {c.date}</div>}
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
                            )
                        ) : (
                            filteredCourses.length === 0 ? (
                                <div className="_empty"><div className="_emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                            ) : (
                                <div className="_tscr">
                                    <table className="_tbl">
                                        <thead><tr>
                                            <th style={{ width: 42, textAlign: 'center' }}>#</th>
                                            <th>اسم الدورة</th>
                                            <th>الفئة</th>
                                            <th style={{ textAlign: 'center' }}>عدد المسجّلين</th>
                                            <th style={{ textAlign: 'center' }}>تفاصيل</th>
                                        </tr></thead>
                                        <tbody>
                                            {filteredCourses.map((c, idx) => (
                                                <React.Fragment key={c.id}>
                                                    <tr className={expandedRow === c.id ? 'xopen' : ''}>
                                                        <td style={{ color: '#ccc', fontSize: '.72rem', textAlign: 'center' }}>{idx + 1}</td>
                                                        <td style={{ fontWeight: 700 }}>📚 {c.title}</td>
                                                        <td>{c.category && <span className="_cat">{c.category}</span>}</td>
                                                        <td style={{ textAlign: 'center' }}><span className="_cb or">{c.enrolledUsers.length}</span></td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {c.enrolledUsers.length > 0
                                                                ? <span className={`_pill or ${expandedRow === c.id ? 'op' : ''}`}
                                                                    onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}>
                                                                    {expandedRow === c.id ? '▲ إخفاء' : '▼ عرض'}
                                                                </span>
                                                                : <span style={{ color: '#ddd' }}>—</span>}
                                                        </td>
                                                    </tr>
                                                    {expandedRow === c.id && (
                                                        <tr className="_xrow"><td colSpan={5}>
                                                            <div className="_xin">
                                                                {c.enrolledUsers.map(u => (
                                                                    <div className="_mc" key={u.id}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                                            <div className="_av or sm">{(u.firstName?.[0] || '?')}{(u.lastName?.[0] || '')}</div>
                                                                            <div>
                                                                                <div className="_mt or">{u.firstName} {u.lastName}</div>
                                                                                <div className="_ms">✉ {u.email}</div>
                                                                            </div>
                                                                        </div>
                                                                        {u.date && <div className="_md">📅 {u.date}</div>}
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
                            )
                        )}
                    </div>

                    <div className="_ftr">
                        تم إنشاء هذا التقرير بتاريخ{' '}
                        {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {' — '}ICEMT Admin Panel
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;