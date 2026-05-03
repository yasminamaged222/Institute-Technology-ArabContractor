// src/components/admin/tabs/PlanworkTab.jsx
import React, { useState, useRef, useEffect } from 'react';
import { T } from "../../components/admin/constants";

// ── Static tree data ──────────────────────────────────────────────────────────
const STATIC_TREE = [
    {
        id: 1, label: 'الخطة التدريبية', expanded: true, children: [
            {
                id: 2, label: 'برامج موجهة للمهندسين', expanded: false, children: [
                    {
                        id: 21, label: 'برامج تأهيلية', expanded: false, children: [
                            { id: 211, label: 'برنامج إعداد وتأهيل مهندس حديث مدني وعمارة', children: [] },
                            { id: 212, label: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الأولى ( أعمال الهيكل الخرساني)', children: [] },
                            { id: 213, label: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثانيه ( أعمال التشطيبات الأساسية)', children: [] },
                            { id: 214, label: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثالثة (إدارة المشروعات والمالية)', children: [] },
                            { id: 215, label: 'برنامج إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء', children: [] },
                            { id: 216, label: 'الدورة المتقدمة مهندس حديث', children: [] },
                        ]
                    },
                    { id: 22, label: 'برامج عامة', children: [] },
                ]
            },
            { id: 3, label: 'برامج تأهيلية للمهندسين', expanded: false, children: [{ id: 31, label: 'تأهيل مهندس مدني متقدم', children: [] }, { id: 32, label: 'تأهيل مهندس كهرباء متقدم', children: [] }] },
            { id: 4, label: 'برامج موجهة للماليين', expanded: false, children: [{ id: 41, label: 'محاسبة مالية متقدمة', children: [] }, { id: 42, label: 'تحليل مالي وإعداد الميزانيات', children: [] }] },
            { id: 5, label: 'برامج موجهة للأمن', expanded: false, children: [{ id: 51, label: 'أمن المنشآت', children: [] }, { id: 52, label: 'السلامة والصحة المهنية', children: [] }] },
            { id: 6, label: 'برامج مركز جسر السويس', expanded: false, children: [{ id: 61, label: 'برامج الهندسة الإقليمية', children: [] }] },
            { id: 7, label: 'برامج مركز شبرا', expanded: false, children: [{ id: 71, label: 'دورات هندسية شبرا', children: [] }] },
            { id: 8, label: 'برامج مالية موجهه لغير الماليين', expanded: false, children: [{ id: 81, label: 'أساسيات المحاسبة للمهندسين', children: [] }] },
            { id: 9, label: 'برامج تأهيلية لأعضاء المجلس التنفيذى لشباب قادة المستقبل', expanded: false, children: [{ id: 91, label: 'القيادة وصنع القرار', children: [] }] },
            { id: 10, label: 'برامج القطاع القانوني والعقارى', expanded: false, children: [{ id: 101, label: 'قانون العقود', children: [] }] },
            { id: 11, label: 'برامج الإدارة الطبية', expanded: false, children: [{ id: 111, label: 'إدارة المستشفيات', children: [] }] },
            { id: 12, label: 'دورات مستحدثة', children: [] },
            { id: 13, label: 'تدريب الطلاب الصيفى', children: [] },
        ]
    }
];

function flattenTree(nodes, acc = []) {
    nodes.forEach(n => { acc.push({ id: n.id, label: n.label }); if (n.children?.length) flattenTree(n.children, acc); });
    return acc;
}
const ALL_TREE_NODES = flattenTree(STATIC_TREE);

// ── Initial records ───────────────────────────────────────────────────────────
const INITIAL_RECORDS = [
    { id: 1, parentId: null, priority: 1, days: 5, name: 'الخطة التدريبية', slug: 'training-plan', sku: 'TP-001', show: true, hasDetails: true, showOnHome: true, price: '1500', description: 'الخطة التدريبية الرئيسية للمعهد', place: 'القاهرة', date: '2025-01-15', details: '' },
    { id: 2, parentId: 1, priority: 2, days: 3, name: 'برامج موجهة للمهندسين', slug: 'engineers-programs', sku: 'EP-001', show: true, hasDetails: true, showOnHome: false, price: '2000', description: 'برامج تدريبية متخصصة للمهندسين', place: 'الجيزة', date: '2025-02-10', details: '' },
    { id: 3, parentId: 1, priority: 3, days: 7, name: 'برامج تأهيلية للمهندسين', slug: 'engineers-qualify', sku: 'EQ-001', show: true, hasDetails: false, showOnHome: false, price: '2500', description: 'برامج تأهيل وتطوير مهني', place: 'الإسكندرية', date: '2025-03-05', details: '' },
    { id: 4, parentId: 1, priority: 4, days: 4, name: 'برامج موجهة للماليين', slug: 'finance-programs', sku: 'FP-001', show: false, hasDetails: true, showOnHome: false, price: '1800', description: 'برامج مالية ومحاسبية متقدمة', place: 'القاهرة', date: '2025-04-20', details: '' },
    { id: 5, parentId: 1, priority: 5, days: 2, name: 'برامج موجهة للأمن', slug: 'security-programs', sku: 'SP-001', show: true, hasDetails: false, showOnHome: true, price: '1200', description: 'برامج أمنية وسلامة مهنية', place: 'مركز جسر السويس', date: '2025-05-12', details: '' },
    { id: 6, parentId: 1, priority: 6, days: 6, name: 'برامج مركز جسر السويس', slug: 'suez-bridge-center', sku: 'SB-001', show: true, hasDetails: true, showOnHome: true, price: '3000', description: 'برامج مركز التدريب الإقليمي', place: 'جسر السويس', date: '2025-06-01', details: '' },
    { id: 7, parentId: 1, priority: 7, days: 3, name: 'برامج مركز شبرا', slug: 'shubra-center', sku: 'SC-001', show: true, hasDetails: false, showOnHome: false, price: '1400', description: 'برامج فرع شبرا التدريبي', place: 'شبرا', date: '2025-06-15', details: '' },
    { id: 21, parentId: 2, priority: 1, days: 3, name: 'برامج تأهيلية', slug: 'qualify-sub', sku: 'QS-001', show: true, hasDetails: true, showOnHome: false, price: '2200', description: 'برامج تأهيل المهندسين الجدد', place: 'القاهرة', date: '2025-03-01', details: '' },
    { id: 211, parentId: 21, priority: 1, days: 5, name: 'برنامج إعداد وتأهيل مهندس حديث مدني وعمارة', slug: 'civil-eng-program', sku: 'CE-001', show: true, hasDetails: true, showOnHome: true, price: '2800', description: 'برنامج شامل لتأهيل مهندس مدني حديث', place: 'القاهرة', date: '2025-04-01', details: '' },
    { id: 212, parentId: 21, priority: 2, days: 4, name: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الأولى ( أعمال الهيكل الخرساني)', slug: 'civil-phase-1', sku: 'CE-002', show: true, hasDetails: true, showOnHome: false, price: '1800', description: 'المرحلة الأولى - أعمال الهيكل الخرساني', place: 'القاهرة', date: '2025-04-10', details: '' },
];

// ── Static files ──────────────────────────────────────────────────────────────
const INITIAL_FILES = {
    1: [{ id: 1, name: 'pdf.11263', order: 1, title: 'الخطة التدريبية الرئيسية', file: null }, { id: 2, name: 'pdf.130175', order: 2, title: 'ملحق الخطة', file: null }, { id: 3, name: 'pdf.130192', order: 3, title: 'جداول الخطة', file: null }],
    211: [{ id: 4, name: 'pdf.44001', order: 1, title: 'خطة البرنامج الأول', file: null }],
    6: [{ id: 5, name: 'pdf.55002', order: 1, title: 'خطة مركز جسر السويس', file: null }],
};

const BLANK = { id: 0, parentId: null, priority: '', days: '', name: '', slug: '', sku: '', show: false, hasDetails: false, showOnHome: false, price: '', description: '', place: '', date: '', details: '' };
const FILE_BLANK = { id: 0, name: '', order: '', title: '', file: null };

// ── Helpers ───────────────────────────────────────────────────────────────────
function textToHtml(text = '') {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.split('\n').map(l => l
        ? `<div>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
        : '<div><br></div>'
    ).join('');
}

function wrapSelectionWithStyle(prop, val) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0), span = document.createElement('span');
    span.style[prop] = val;
    try { range.surroundContents(span); }
    catch { const f = range.extractContents(); span.appendChild(f); range.insertNode(span); }
    sel.removeAllRanges();
    const nr = document.createRange();
    nr.selectNodeContents(span);
    sel.addRange(nr);
}

function getComputedAtCursor(editorEl, cssProp) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node = sel.anchorNode;
    while (node && node !== editorEl) {
        if (node.nodeType === 1) {
            const v = window.getComputedStyle(node)[cssProp];
            if (v) return v;
        }
        node = node.parentNode;
    }
    return null;
}

function toSlug(str) {
    return str.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '').replace(/-+/g, '-').slice(0, 60);
}

const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];

// ══════════════════════════════════════════════════════════════════════════════
// RichTextEditor — font size + color + bold/italic/underline + link/unlink
// ══════════════════════════════════════════════════════════════════════════════
function RichTextEditor({ icon, label, sub, name, value, onChange, placeholder, minHeight = 120 }) {
    const editorRef = useRef(null);
    const savedSelRef = useRef(null);
    const lastValueRef = useRef(null);
    const urlInputRef = useRef(null);

    const [fontColor, setFontColor] = useState('#0a0a0a');
    const [fontSize, setFontSize] = useState(14);
    const [urlOpen, setUrlOpen] = useState(false);
    const [urlValue, setUrlValue] = useState('');

    useEffect(() => {
        if (!editorRef.current || value === lastValueRef.current) return;
        editorRef.current.innerHTML = textToHtml(value);
        lastValueRef.current = value;
    }, [value]);

    useEffect(() => {
        if (urlOpen && urlInputRef.current) urlInputRef.current.focus();
    }, [urlOpen]);

    useEffect(() => {
        if (!urlOpen) return;
        const h = e => { if (!e.target.closest('.lec-tb-url-wrap')) setUrlOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [urlOpen]);

    const saveSelection = () => {
        const s = window.getSelection();
        if (s?.rangeCount > 0) savedSelRef.current = s.getRangeAt(0).cloneRange();
    };
    const restoreSelection = () => {
        const s = window.getSelection();
        if (s && savedSelRef.current) { s.removeAllRanges(); s.addRange(savedSelRef.current); }
    };
    const emitChange = () => {
        if (!editorRef.current) return;
        const h = editorRef.current.innerHTML;
        lastValueRef.current = h;
        onChange({ target: { name, value: h } });
    };
    const exec = (cmd, val = null) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        emitChange();
    };

    const detectFontSize = () => {
        const fsVal = getComputedAtCursor(editorRef.current, 'fontSize');
        if (fsVal) {
            const px = Math.round(parseFloat(fsVal));
            const closest = FONT_SIZES.reduce((p, c) => Math.abs(c - px) < Math.abs(p - px) ? c : p);
            setFontSize(closest);
        }
    };

    const handleFontSize = e => {
        const px = Number(e.target.value);
        setFontSize(px);
        restoreSelection();
        editorRef.current?.focus();
        wrapSelectionWithStyle('fontSize', `${px}px`);
        emitChange();
    };

    const confirmUrl = () => {
        restoreSelection();
        const url = urlValue.trim();
        if (url && url !== 'https://') {
            exec('createLink', url);
            const sel = window.getSelection();
            if (sel?.anchorNode) {
                let node = sel.anchorNode;
                while (node && node !== editorRef.current) {
                    if (node.nodeName === 'A') { node.target = '_blank'; node.rel = 'noopener noreferrer'; break; }
                    node = node.parentNode;
                }
            }
        }
        setUrlOpen(false);
        emitChange();
    };

    return (
        <div className="lec-rte-block">
            <div className="lec-rte-hdr">
                <span className="lec-rte-icon">{icon}</span>
                <div style={{ flex: 1 }}>
                    <div className="lec-rte-label">{label}</div>
                    {sub && <div className="lec-rte-sub">{sub}</div>}
                </div>
            </div>

            <div className="lec-rte-toolbar" onMouseDown={e => { if (e.target.tagName === 'SELECT') return; e.preventDefault(); }}>
                <button className="lec-tb-btn bold" title="عريض (Ctrl+B)" onClick={() => exec('bold')}>B</button>
                <button className="lec-tb-btn italic" title="مائل (Ctrl+I)" onClick={() => exec('italic')}>I</button>
                <button className="lec-tb-btn under" title="تحته خط (Ctrl+U)" onClick={() => exec('underline')}>U</button>
                <div className="lec-rte-sep" />
                <div className="lec-tb-size-wrap" title="حجم الخط (بالبكسل)">
                    <select className="lec-tb-select lec-tb-size-select" value={fontSize} onChange={handleFontSize} onMouseDown={saveSelection}>
                        {FONT_SIZES.map(px => <option key={px} value={px}>{px}</option>)}
                    </select>
                    <span className="lec-tb-size-unit">px</span>
                </div>
                <div className="lec-rte-sep" />
                <div className="lec-tb-color-wrap" title="لون الخط">
                    <button className="lec-tb-color-btn" onMouseDown={saveSelection}>
                        <span className="color-letter" style={{ color: fontColor }}>A</span>
                        <span className="color-bar" style={{ background: fontColor }} />
                        <input type="color" className="lec-tb-color-input" value={fontColor}
                            onChange={e => { const c = e.target.value; setFontColor(c); restoreSelection(); exec('foreColor', c); }} />
                    </button>
                </div>
                <div className="lec-rte-sep" />
                <div className="lec-tb-url-wrap">
                    <button className={`lec-tb-btn${urlOpen ? ' active' : ''}`} title="إضافة رابط"
                        onClick={() => { saveSelection(); setUrlValue('https://'); setUrlOpen(true); }}
                        onMouseDown={saveSelection}>🔗</button>
                    {urlOpen && (
                        <div className="lec-url-popover">
                            <input ref={urlInputRef} type="url" placeholder="https://example.com" value={urlValue}
                                onChange={e => setUrlValue(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') confirmUrl();
                                    if (e.key === 'Escape') { setUrlOpen(false); restoreSelection(); }
                                }} />
                            <button className="lec-url-popover-ok" onClick={confirmUrl}>إدراج</button>
                            <button className="lec-url-popover-cancel" onClick={() => { setUrlOpen(false); restoreSelection(); }}>إلغاء</button>
                        </div>
                    )}
                </div>
                <button className="lec-tb-btn" title="إزالة الرابط" onClick={() => exec('unlink')} onMouseDown={saveSelection} style={{ fontSize: '.7rem' }}>✂️</button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="lec-rte-editor"
                data-placeholder={placeholder}
                style={{ minHeight }}
                onInput={emitChange}
                onKeyDown={e => {
                    if (e.ctrlKey || e.metaKey) {
                        if (e.key === 'b') { e.preventDefault(); exec('bold'); }
                        if (e.key === 'i') { e.preventDefault(); exec('italic'); }
                        if (e.key === 'u') { e.preventDefault(); exec('underline'); }
                    }
                }}
                onMouseUp={() => { saveSelection(); detectFontSize(); }}
                onKeyUp={() => { saveSelection(); detectFontSize(); }}
            />
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TreeNode
// ══════════════════════════════════════════════════════════════════════════════
function TreeNode({ node, selectedId, onSelect, depth = 0 }) {
    const [open, setOpen] = useState(node.expanded ?? false);
    const hasChildren = node.children && node.children.length > 0;
    const depthClass = ['pw-tree-d0', 'pw-tree-d1', 'pw-tree-d2', 'pw-tree-d3'][Math.min(depth, 3)];
    return (
        <div>
            <div
                className={`pw-tree-row ${depthClass}${selectedId === node.id ? ' active' : ''}`}
                style={{ paddingRight: 10 + depth * 14 }}
                onClick={e => { e.stopPropagation(); onSelect(node); if (hasChildren) setOpen(o => !o); }}
            >
                <span className="pw-tree-toggle">{hasChildren ? (open ? '⊟' : '⊞') : ''}</span>
                <span className="pw-tree-label">{node.label}</span>
            </div>
            {hasChildren && open && (
                <div className={`pw-tree-children pw-children-d${Math.min(depth, 2)}`}>
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// FilesSection
// ══════════════════════════════════════════════════════════════════════════════
function FilesSection({ planworkId, planworkName }) {
    const [files, setFiles] = useState(() => INITIAL_FILES[planworkId] ? [...INITIAL_FILES[planworkId]] : []);
    const [fileForm, setFileForm] = useState({ ...FILE_BLANK });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isNewFile, setIsNewFile] = useState(true);
    const [fileNotif, setFileNotif] = useState(null);
    const [fileDelConfirm, setFileDelConfirm] = useState(false);
    const fileInputRef = useRef(null);
    const nextFileId = useRef(planworkId * 1000 + (INITIAL_FILES[planworkId]?.length || 0) + 1);

    useEffect(() => {
        setFiles(INITIAL_FILES[planworkId] ? [...INITIAL_FILES[planworkId]] : []);
        setFileForm({ ...FILE_BLANK });
        setSelectedFile(null);
        setIsNewFile(true);
        setFileDelConfirm(false);
        nextFileId.current = planworkId * 1000 + (INITIAL_FILES[planworkId]?.length || 0) + 1;
    }, [planworkId]);

    const fileToast = (msg, type = 'success') => {
        setFileNotif({ msg, type });
        setTimeout(() => setFileNotif(null), 3000);
    };
    const pickFile = rec => { setSelectedFile(rec); setFileForm({ ...rec }); setIsNewFile(false); setFileDelConfirm(false); };

    const handleFileInput = e => {
        const f = e.target.files[0];
        if (!f) return;
        const autoOrder = files.length + 1;
        setFileForm(prev => ({ ...prev, name: f.name, file: f, order: prev.order || String(autoOrder) }));
    };

    const handleFileSave = () => {
        if (!fileForm.name.trim()) { fileToast('اسم الملف مطلوب', 'error'); return; }
        if (isNewFile) {
            const id = nextFileId.current++;
            const order = fileForm.order || String(files.length + 1);
            const newFile = { ...fileForm, id, order };
            setFiles(prev => [...prev, newFile]);
            setSelectedFile(newFile);
            setFileForm({ ...newFile });
            setIsNewFile(false);
            fileToast('تم الإضافة');
        } else {
            const updated = { ...fileForm };
            setFiles(prev => prev.map(f => f.id === updated.id ? updated : f));
            setSelectedFile(updated);
            fileToast('تم الحفظ');
        }
    };

    const handleFileDelete = () => {
        if (!fileDelConfirm) { setFileDelConfirm(true); return; }
        const rest = files.filter(f => f.id !== selectedFile.id);
        setFiles(rest);
        setFileDelConfirm(false);
        setFileForm({ ...FILE_BLANK });
        setSelectedFile(null);
        setIsNewFile(true);
        fileToast('تم الحذف', 'error');
    };

    return (
        <div className="pw-files-section">
            <div className="pw-files-hdr">
                <span className="pw-files-icon">📎</span>
                <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <div className="pw-files-title">ملفات الخطه التدريبيه</div>
                    <div className="pw-files-sub">{planworkName}</div>
                </div>
                <span className="lec-count-badge" style={{ position: 'relative', zIndex: 1 }}>{files.length}</span>
            </div>
            {fileNotif && (
                <div className={`lec-notif lec-notif-${fileNotif.type}`} style={{ margin: '10px 14px 0' }}>
                    <span>{fileNotif.type === 'success' ? '✅' : fileNotif.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {fileNotif.msg}
                </div>
            )}
            <div className="pw-files-body">
                <div className="pw-files-form">
                    <div className="lec-field">
                        <label className="lec-label">الرقم</label>
                        <input className="lec-inp" value={isNewFile ? `${planworkId * 1000 + files.length + 1} (تلقائي)` : fileForm.id} disabled
                            style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed', fontFamily: "'Courier New',monospace", fontSize: '.74rem' }} />
                    </div>
                    <div className="lec-field">
                        <label className="lec-label">اسم الملف</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input className="lec-inp" name="name" value={fileForm.name}
                                onChange={e => setFileForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="اسم الملف..." style={{ flex: 1 }} />
                            <button className="pw-select-file-btn" onClick={() => fileInputRef.current.click()}>📂 Select File</button>
                            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileInput} />
                        </div>
                    </div>
                    <div className="lec-field">
                        <label className="lec-label">الترتيب</label>
                        <input className="lec-inp" name="order" type="number" min="1" value={fileForm.order}
                            onChange={e => setFileForm(f => ({ ...f, order: e.target.value }))}
                            placeholder={`${files.length + 1} (تلقائي)`} />
                    </div>
                    <div className="lec-field">
                        <label className="lec-label">عنوان الملف</label>
                        <input className="lec-inp" name="title" value={fileForm.title}
                            onChange={e => setFileForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="عنوان الملف..." />
                    </div>
                    <div className="pw-files-actions">
                        <button className="lec-act-btn save" onClick={handleFileSave} style={{ padding: '7px 16px', fontSize: '.76rem' }}>💾 حفظ</button>
                        <button className="lec-act-btn new" onClick={() => { setFileForm({ ...FILE_BLANK }); setSelectedFile(null); setIsNewFile(true); setFileDelConfirm(false); }}
                            style={{ padding: '7px 16px', fontSize: '.76rem' }}>➕ جديد</button>
                        {!isNewFile && (
                            fileDelConfirm
                                ? <>
                                    <button className="lec-act-btn delete" onClick={handleFileDelete} style={{ padding: '7px 14px', fontSize: '.74rem' }}>تأكيد</button>
                                    <button className="adm-fclear" onClick={() => setFileDelConfirm(false)}>إلغاء</button>
                                </>
                                : <button className="lec-act-btn delete" onClick={handleFileDelete} style={{ padding: '7px 16px', fontSize: '.76rem' }}>🗑 حذف</button>
                        )}
                    </div>
                </div>
                <div className="pw-files-table-wrap">
                    {files.length === 0 ? (
                        <div className="adm-empty" style={{ padding: '28px 12px' }}>
                            <div className="adm-emi">📂</div>
                            <p>لا توجد ملفات</p>
                        </div>
                    ) : (
                        <table className="pw-files-tbl">
                            <thead>
                                <tr><th>الرقم</th><th>الأسم</th></tr>
                            </thead>
                            <tbody>
                                {[...files].sort((a, b) => Number(a.order) - Number(b.order)).map(f => (
                                    <tr key={f.id} className={selectedFile?.id === f.id ? 'active' : ''} onClick={() => pickFile(f)}>
                                        <td style={{ fontFamily: "'Courier New',monospace", fontWeight: 900, color: T.blue }}>{f.id}</td>
                                        <td>{f.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// ParentSelector
// ══════════════════════════════════════════════════════════════════════════════
function ParentSelector({ parentId, onChange, records }) {
    const recOptions = records.filter(r => r.id !== 0).map(r => ({ id: r.id, label: r.name }));
    const merged = [...ALL_TREE_NODES];
    recOptions.forEach(ro => { if (!merged.find(m => m.id === ro.id)) merged.push(ro); });
    merged.sort((a, b) => a.id - b.id);
    return (
        <div className="pw-parent-wrap">
            <div style={{ flex: '0 0 80px' }}>
                <select className="lec-inp pw-parent-id-sel" value={parentId ?? ''}
                    onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}>
                    <option value="">—</option>
                    {merged.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <select className="lec-inp" value={parentId ?? ''}
                    onChange={e => { const found = merged.find(m => m.id === Number(e.target.value)); onChange(found ? found.id : null); }}>
                    <option value="">— بدون أب (رئيسي) —</option>
                    {merged.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
            </div>
            {parentId != null && (
                <button className="pw-parent-clear" title="إزالة الأب" onClick={() => onChange(null)}>✕</button>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// PlanworkTab
// ══════════════════════════════════════════════════════════════════════════════
const PlanworkTab = () => {
    const [records, setRecords] = useState(INITIAL_RECORDS);
    const [selected, setSelected] = useState(INITIAL_RECORDS[0]);
    const [form, setForm] = useState({ ...INITIAL_RECORDS[0] });
    const [isNew, setIsNew] = useState(false);
    const [search, setSearch] = useState('');
    const [notification, setNotification] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [treeSelected, setTreeSelected] = useState(null);
    const nextId = useRef(300);

    const filtered = records.filter(r =>
        (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.place || '').toLowerCase().includes(search.toLowerCase())
    );

    const toast = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };
    const pick = rec => { setSelected(rec); setForm({ ...rec }); setIsNew(false); setDeleteConfirm(false); };

    const handleTreeSelect = node => {
        setTreeSelected(node);
        const match = records.find(r => r.name === node.label || r.id === node.id);
        if (match) pick(match);
    };

    const handleNew = () => {
        const parentId = treeSelected ? treeSelected.id : null;
        setForm({ ...BLANK, parentId });
        setSelected(null);
        setIsNew(true);
        setDeleteConfirm(false);
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => {
            const updated = { ...f, [name]: type === 'checkbox' ? checked : value };
            if (name === 'name' && !f._slugManual) updated.slug = toSlug(value);
            if (name === 'slug') updated._slugManual = value.length > 0;
            return updated;
        });
    };

    const handleSave = () => {
        if (!form.name.trim()) { toast('الأسم مطلوب', 'error'); return; }
        const clean = { ...form }; delete clean._slugManual;
        if (isNew) {
            const id = nextId.current++, newRec = { ...clean, id };
            setRecords(prev => [...prev, newRec]);
            setSelected(newRec);
            setForm({ ...newRec });
            setIsNew(false);
            toast('تم الإضافة');
        } else {
            setRecords(prev => prev.map(r => r.id === clean.id ? clean : r));
            setSelected(clean);
            setForm({ ...clean });
            toast('تم الحفظ');
        }
    };

    const handleReset = () => {
        if (isNew) setForm({ ...BLANK });
        else setForm({ ...selected });
        setDeleteConfirm(false);
        toast('تم الإلغاء', 'info');
    };

    const handleDelete = () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        const rest = records.filter(r => r.id !== selected.id);
        setRecords(rest);
        setDeleteConfirm(false);
        if (rest.length) pick(rest[0]); else handleNew();
        toast('تم الحذف', 'error');
    };

    const parentName = form.parentId != null
        ? (records.find(r => r.id === form.parentId)?.name || ALL_TREE_NODES.find(n => n.id === form.parentId)?.label || `#${form.parentId}`)
        : null;

    const Field = ({ label, children, full }) => (
        <div className="lec-field" style={full ? { gridColumn: '1/-1' } : {}}>
            <label className="lec-label">{label}</label>
            {children}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {notification && (
                <div className={`lec-notif lec-notif-${notification.type}`} style={{ marginBottom: 12 }}>
                    <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {notification.msg}
                </div>
            )}

            <div className="lec-layout">

                {/* ══ LEFT PANEL ══ */}
                <div className="lec-panel pw-left-panel">
                    <div className="lec-panel-hdr">
                        <span className="lec-count-badge">{filtered.length}</span>
                        <span style={{ fontWeight: 800, fontSize: '.8rem', color: '#0a0a0a', flex: 1, textAlign: 'center' }}>خطة العمل</span>
                        <button className="lec-new-btn" onClick={handleNew}>+ جديد</button>
                    </div>

                    <div className="pw-tree-panel" style={{ borderTop: 'none', flex: 1 }}>
                        <div className="pw-tree-header">
                            خطه المعهد
                            {treeSelected && (
                                <span className="pw-tree-selected-badge">
                                    ← {treeSelected.label.slice(0, 22)}{treeSelected.label.length > 22 ? '…' : ''}
                                </span>
                            )}
                        </div>
                        <div className="pw-tree-scroll" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                            {STATIC_TREE.map(node => (
                                <TreeNode key={node.id} node={node} selectedId={treeSelected?.id} onSelect={handleTreeSelect} />
                            ))}
                        </div>
                        {treeSelected && (
                            <div className="pw-tree-footer">
                                <span style={{ fontSize: '.7rem', color: '#6b7280' }}>الأب المحدد:</span>
                                <span className="pw-tree-footer-name">{treeSelected.label}</span>
                                <button className="pw-tree-footer-clear" onClick={() => setTreeSelected(null)}>✕ إلغاء</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ══ FORM AREA ══ */}
                <div className="lec-form-wrap">
                    <div className="adm-card lec-form-card">
                        <div className="lec-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
                                    {isNew ? 'سجل جديد' : `ID: #${selected?.id}`}
                                    {form.parentId != null && (
                                        <span style={{ marginRight: 8, fontSize: '.72rem', opacity: .8 }}>↳ {parentName}</span>
                                    )}
                                </div>
                                <h2 className="lec-form-title">{isNew ? '➕ إضافة سجل جديد' : '✏️ تعديل بيانات خطة العمل'}</h2>
                                {!isNew && selected && <p className="lec-form-sub">{selected.name}</p>}
                            </div>
                            <div className="lec-stat-pill">📋 {records.length} سجل</div>
                        </div>

                        <div className="lec-form-body">
                            <div className="lec-fields-grid" style={{ marginBottom: 20 }}>

                                <Field label="الرقم">
                                    <input className="lec-inp" value={isNew ? 'تلقائي' : form.id} disabled
                                        style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }} />
                                </Field>

                                <div className="lec-field pw-parent-field">
                                    <label className="lec-label">أساسى (الأب)</label>
                                    <ParentSelector parentId={form.parentId} onChange={v => setForm(f => ({ ...f, parentId: v }))} records={records} />
                                </div>

                                <Field label="الأولويه">
                                    <input className="lec-inp" name="priority" type="number" min="1" value={form.priority} onChange={handleChange} placeholder="الأولويه..." />
                                </Field>
                                <Field label="عدد الأيام">
                                    <input className="lec-inp" name="days" type="number" min="1" value={form.days} onChange={handleChange} placeholder="عدد الأيام..." />
                                </Field>
                                <Field label="الأسم" full>
                                    <input className="lec-inp" name="name" value={form.name} onChange={handleChange} placeholder="الأسم..." />
                                </Field>
                                <Field label="Slug" full>
                                    <input className="lec-inp" name="slug" value={form.slug || ''} onChange={handleChange}
                                        placeholder="auto-generated-slug"
                                        style={{ direction: 'ltr', textAlign: 'right', fontFamily: "'Courier New',monospace", fontSize: '.76rem' }} />
                                </Field>
                                <Field label="SKU">
                                    <input className="lec-inp" name="sku" value={form.sku || ''} onChange={handleChange}
                                        placeholder="SKU-001"
                                        style={{ direction: 'ltr', textAlign: 'right', fontFamily: "'Courier New',monospace", fontSize: '.76rem' }} />
                                </Field>
                                <Field label="السعر">
                                    <input className="lec-inp" name="price" value={form.price} onChange={handleChange} placeholder="السعر..." />
                                </Field>
                                <Field label="المكان">
                                    <input className="lec-inp" name="place" value={form.place} onChange={handleChange} placeholder="المكان..." />
                                </Field>
                                <Field label="التاريخ">
                                    <input className="lec-inp" name="date" type="date" value={form.date} onChange={handleChange}
                                        style={{ direction: 'ltr', textAlign: 'right' }} />
                                </Field>
                                <Field label="الوصف" full>
                                    <input className="lec-inp" name="description" value={form.description} onChange={handleChange} placeholder="الوصف..." />
                                </Field>

                                <div className="lec-field" style={{ gridColumn: '1/-1' }}>
                                    <label className="lec-label">الخيارات</label>
                                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: '10px 12px', border: '1.5px solid #d0d3d8', borderRadius: 3, background: '#fff' }}>
                                        {[{ name: 'show', label: 'عرض' }, { name: 'hasDetails', label: 'له تفاصيل' }, { name: 'showOnHome', label: 'عرض على الصفحه الرئيسيه' }].map(cb => (
                                            <label key={cb.name} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, color: '#374151' }}>
                                                <input type="checkbox" name={cb.name} checked={!!form[cb.name]} onChange={handleChange}
                                                    style={{ width: 16, height: 16, accentColor: T.orange, cursor: 'pointer' }} />
                                                {cb.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lec-divider" />

                            {/* ── Updated RichTextEditor with font size ── */}
                            <RichTextEditor
                                icon="📄"
                                label="تفاصيل الكورس"
                                sub="حدد النص أولاً ثم اختر الحجم أو اللون من شريط الأدوات — يمكن إضافة روابط للمشاريع"
                                name="details"
                                value={form.details}
                                onChange={handleChange}
                                placeholder="أدخل تفاصيل الكورس هنا..."
                                minHeight={150}
                            />

                            <div className="lec-actions">
                                <button className="lec-act-btn save" onClick={handleSave}>💾 حفظ</button>
                                <button className="lec-act-btn new" onClick={handleNew}>➕ سجل جديد</button>
                                <button className="lec-act-btn reset" onClick={handleReset}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNew && (
                                    deleteConfirm
                                        ? <div className="lec-delete-confirm">
                                            <span className="lec-delete-warn">⚠️ هل أنت متأكد؟</span>
                                            <button className="lec-act-btn delete" onClick={handleDelete}>تأكيد الحذف</button>
                                            <button className="adm-fclear" onClick={() => setDeleteConfirm(false)}>إلغاء</button>
                                        </div>
                                        : <button className="lec-act-btn delete" onClick={handleDelete}>🗑 حذف السجل</button>
                                )}
                            </div>

                            <div className="lec-divider" style={{ marginTop: 8 }} />
                            {!isNew && selected && <FilesSection planworkId={selected.id} planworkName={selected.name} />}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PlanworkTab;