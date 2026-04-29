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

// ── Static records (matching tree labels so clicks fill form) ─────────────────
const INITIAL_RECORDS = [
    { id: 1, priority: 1, days: 5, username: 'admin1', password: '', name: 'الخطة التدريبية', show: true, hasDetails: true, showOnHome: true, category: '', price: '1500', description: 'الخطة التدريبية الرئيسية للمعهد', place: 'القاهرة', date: '2025-01-15', details: '' },
    { id: 2, priority: 2, days: 3, username: 'admin2', password: '', name: 'برامج موجهة للمهندسين', show: true, hasDetails: true, showOnHome: false, category: '', price: '2000', description: 'برامج تدريبية متخصصة للمهندسين', place: 'الجيزة', date: '2025-02-10', details: '' },
    { id: 3, priority: 3, days: 7, username: 'admin3', password: '', name: 'برامج تأهيلية للمهندسين', show: true, hasDetails: false, showOnHome: false, category: '', price: '2500', description: 'برامج تأهيل وتطوير مهني', place: 'الإسكندرية', date: '2025-03-05', details: '' },
    { id: 4, priority: 4, days: 4, username: 'admin4', password: '', name: 'برامج موجهة للماليين', show: false, hasDetails: true, showOnHome: false, category: '', price: '1800', description: 'برامج مالية ومحاسبية متقدمة', place: 'القاهرة', date: '2025-04-20', details: '' },
    { id: 5, priority: 5, days: 2, username: 'admin5', password: '', name: 'برامج موجهة للأمن', show: true, hasDetails: false, showOnHome: true, category: '', price: '1200', description: 'برامج أمنية وسلامة مهنية', place: 'مركز جسر السويس', date: '2025-05-12', details: '' },
    { id: 6, priority: 6, days: 6, username: 'admin6', password: '', name: 'برامج مركز جسر السويس', show: true, hasDetails: true, showOnHome: true, category: '', price: '3000', description: 'برامج مركز التدريب الإقليمي', place: 'جسر السويس', date: '2025-06-01', details: '' },
    { id: 7, priority: 7, days: 3, username: 'admin7', password: '', name: 'برامج مركز شبرا', show: true, hasDetails: false, showOnHome: false, category: '', price: '1400', description: 'برامج فرع شبرا التدريبي', place: 'شبرا', date: '2025-06-15', details: '' },
    { id: 8, priority: 8, days: 5, username: 'admin8', password: '', name: 'برامج مالية موجهه لغير الماليين', show: false, hasDetails: true, showOnHome: false, category: '', price: '1600', description: 'تأسيس مالي لغير المتخصصين', place: 'القاهرة', date: '2025-07-08', details: '' },
    { id: 9, priority: 9, days: 10, username: 'admin9', password: '', name: 'برامج القطاع القانوني والعقارى', show: true, hasDetails: true, showOnHome: true, category: '', price: '3500', description: 'تدريب قانوني وعقاري متخصص', place: 'القاهرة', date: '2025-08-20', details: '' },
    { id: 10, priority: 10, days: 4, username: 'admin10', password: '', name: 'دورات مستحدثة', show: true, hasDetails: false, showOnHome: true, category: '', price: '900', description: 'دورات جديدة ومتجددة', place: 'أونلاين', date: '2025-09-01', details: '' },
    { id: 21, priority: 1, days: 3, username: 'admin21', password: '', name: 'برامج تأهيلية', show: true, hasDetails: true, showOnHome: false, category: '', price: '2200', description: 'برامج تأهيل المهندسين الجدد', place: 'القاهرة', date: '2025-03-01', details: '' },
    { id: 211, priority: 1, days: 5, username: 'admin211', password: '', name: 'برنامج إعداد وتأهيل مهندس حديث مدني وعمارة', show: true, hasDetails: true, showOnHome: true, category: '', price: '2800', description: 'برنامج شامل لتأهيل مهندس مدني حديث', place: 'القاهرة', date: '2025-04-01', details: '' },
    { id: 212, priority: 2, days: 4, username: 'admin212', password: '', name: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الأولى ( أعمال الهيكل الخرساني)', show: true, hasDetails: true, showOnHome: false, category: '', price: '1800', description: 'المرحلة الأولى - أعمال الهيكل الخرساني', place: 'القاهرة', date: '2025-04-10', details: '' },
    { id: 213, priority: 3, days: 4, username: 'admin213', password: '', name: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثانيه ( أعمال التشطيبات الأساسية)', show: true, hasDetails: false, showOnHome: false, category: '', price: '1800', description: 'المرحلة الثانية - أعمال التشطيبات', place: 'الجيزة', date: '2025-05-01', details: '' },
    { id: 214, priority: 4, days: 4, username: 'admin214', password: '', name: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثالثة (إدارة المشروعات والمالية)', show: true, hasDetails: true, showOnHome: false, category: '', price: '1800', description: 'المرحلة الثالثة - إدارة المشروعات', place: 'القاهرة', date: '2025-05-15', details: '' },
];

// ── Static files ──────────────────────────────────────────────────────────────
const INITIAL_FILES = {
    1: [{ id: 1, name: 'pdf.11263', order: 1, title: 'الخطة التدريبية الرئيسية', file: null }, { id: 2, name: 'pdf.130175', order: 2, title: 'ملحق الخطة', file: null }, { id: 3, name: 'pdf.130192', order: 3, title: 'جداول الخطة', file: null }],
    211: [{ id: 4, name: 'pdf.44001', order: 1, title: 'خطة البرنامج الأول', file: null }],
    6: [{ id: 5, name: 'pdf.55002', order: 1, title: 'خطة مركز جسر السويس', file: null }],
};

const BLANK = { id: 0, priority: '', days: '', username: '', password: '', name: '', show: false, hasDetails: false, showOnHome: false, category: '', price: '', description: '', place: '', date: '', details: '' };
const FILE_BLANK = { id: 0, name: '', order: '', title: '', file: null };

// ── Helpers ───────────────────────────────────────────────────────────────────
function textToHtml(text = '') {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.split('\n').map(l => l ? `<div>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : '<div><br></div>').join('');
}
function wrapSelectionWithStyle(prop, val) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0), span = document.createElement('span');
    span.style[prop] = val;
    try { range.surroundContents(span); } catch { const f = range.extractContents(); span.appendChild(f); range.insertNode(span); }
    sel.removeAllRanges(); const nr = document.createRange(); nr.selectNodeContents(span); sel.addRange(nr);
}
const FONT_FAMILIES = [
    { label: 'افتراضي', value: 'inherit' }, { label: 'Cairo', value: "'Cairo', sans-serif" },
    { label: 'Tajawal', value: "'Tajawal', sans-serif" }, { label: 'Amiri', value: "'Amiri', serif" },
    { label: 'Noto Kufi', value: "'Noto Kufi Arabic', sans-serif" }, { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: "'Times New Roman', serif" }, { label: 'Tahoma', value: 'Tahoma, sans-serif' },
];

// ══════════════════════════════════════════════════════════════════════════════
// RichTextEditor — no font-size
// ══════════════════════════════════════════════════════════════════════════════
function RichTextEditor({ icon, label, sub, name, value, onChange, placeholder, minHeight = 120 }) {
    const editorRef = useRef(null), savedSelRef = useRef(null), lastValueRef = useRef(null), urlInputRef = useRef(null);
    const [fontColor, setFontColor] = useState('#0a0a0a'), [fontFamily, setFontFamily] = useState('inherit');
    const [urlOpen, setUrlOpen] = useState(false), [urlValue, setUrlValue] = useState('');

    useEffect(() => {
        if (!editorRef.current || value === lastValueRef.current) return;
        editorRef.current.innerHTML = textToHtml(value); lastValueRef.current = value;
    }, [value]);
    useEffect(() => { if (urlOpen && urlInputRef.current) urlInputRef.current.focus(); }, [urlOpen]);
    useEffect(() => {
        if (!urlOpen) return;
        const h = e => { if (!e.target.closest('.lec-tb-url-wrap')) setUrlOpen(false); };
        document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, [urlOpen]);

    const saveSelection = () => { const s = window.getSelection(); if (s?.rangeCount > 0) savedSelRef.current = s.getRangeAt(0).cloneRange(); };
    const restoreSelection = () => { const s = window.getSelection(); if (s && savedSelRef.current) { s.removeAllRanges(); s.addRange(savedSelRef.current); } };
    const emitChange = () => { if (!editorRef.current) return; const h = editorRef.current.innerHTML; lastValueRef.current = h; onChange({ target: { name, value: h } }); };
    const exec = (cmd, val = null) => { editorRef.current?.focus(); document.execCommand(cmd, false, val); emitChange(); };

    return (
        <div className="lec-rte-block">
            <div className="lec-rte-hdr">
                <span className="lec-rte-icon">{icon}</span>
                <div style={{ flex: 1 }}><div className="lec-rte-label">{label}</div>{sub && <div className="lec-rte-sub">{sub}</div>}</div>
            </div>
            <div className="lec-rte-toolbar" onMouseDown={e => e.preventDefault()}>
                <button className="lec-tb-btn bold" onClick={() => exec('bold')}>B</button>
                <button className="lec-tb-btn italic" onClick={() => exec('italic')}>I</button>
                <button className="lec-tb-btn under" onClick={() => exec('underline')}>U</button>
                <div className="lec-rte-sep" />
                <select className="lec-tb-font-select" value={fontFamily} onChange={e => { const ff = e.target.value; setFontFamily(ff); restoreSelection(); editorRef.current?.focus(); wrapSelectionWithStyle('fontFamily', ff); emitChange(); }} onMouseDown={saveSelection}>
                    {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="lec-rte-sep" />
                <div className="lec-tb-color-wrap">
                    <button className="lec-tb-color-btn" onMouseDown={saveSelection}>
                        <span className="color-letter" style={{ color: fontColor }}>A</span>
                        <span className="color-bar" style={{ background: fontColor }} />
                        <input type="color" className="lec-tb-color-input" value={fontColor} onChange={e => { const c = e.target.value; setFontColor(c); restoreSelection(); exec('foreColor', c); }} />
                    </button>
                </div>
                <div className="lec-rte-sep" />
                <div className="lec-tb-url-wrap">
                    <button className={`lec-tb-btn${urlOpen ? ' active' : ''}`} onClick={() => { saveSelection(); setUrlValue('https://'); setUrlOpen(true); }} onMouseDown={saveSelection}>🔗</button>
                    {urlOpen && (
                        <div className="lec-url-popover">
                            <input ref={urlInputRef} type="url" placeholder="https://example.com" value={urlValue} onChange={e => setUrlValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { restoreSelection(); exec('createLink', urlValue.trim()); setUrlOpen(false); emitChange(); } if (e.key === 'Escape') { setUrlOpen(false); restoreSelection(); } }} />
                            <button className="lec-url-popover-ok" onClick={() => { restoreSelection(); exec('createLink', urlValue.trim()); setUrlOpen(false); emitChange(); }}>إدراج</button>
                            <button className="lec-url-popover-cancel" onClick={() => { setUrlOpen(false); restoreSelection(); }}>إلغاء</button>
                        </div>
                    )}
                </div>
                <button className="lec-tb-btn" onClick={() => exec('unlink')} onMouseDown={saveSelection} style={{ fontSize: '.7rem' }}>✂️</button>
            </div>
            <div ref={editorRef} contentEditable suppressContentEditableWarning className="lec-rte-editor" data-placeholder={placeholder} style={{ minHeight }}
                onInput={emitChange}
                onKeyDown={e => { if (e.ctrlKey || e.metaKey) { if (e.key === 'b') { e.preventDefault(); exec('bold'); } if (e.key === 'i') { e.preventDefault(); exec('italic'); } if (e.key === 'u') { e.preventDefault(); exec('underline'); } } }}
                onMouseUp={saveSelection} onKeyUp={saveSelection} />
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TreeNode — depth-aware, click sets form directly via records lookup
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
    const nextFileId = useRef(200);

    useEffect(() => {
        setFiles(INITIAL_FILES[planworkId] ? [...INITIAL_FILES[planworkId]] : []);
        setFileForm({ ...FILE_BLANK }); setSelectedFile(null); setIsNewFile(true); setFileDelConfirm(false);
    }, [planworkId]);

    const fileToast = (msg, type = 'success') => { setFileNotif({ msg, type }); setTimeout(() => setFileNotif(null), 3000); };
    const pickFile = rec => { setSelectedFile(rec); setFileForm({ ...rec }); setIsNewFile(false); setFileDelConfirm(false); };

    const handleFileSave = () => {
        if (!fileForm.name.trim()) { fileToast('اسم الملف مطلوب', 'error'); return; }
        if (isNewFile) {
            const id = nextFileId.current++, newFile = { ...fileForm, id };
            setFiles(prev => [...prev, newFile]); setSelectedFile(newFile); setFileForm({ ...newFile }); setIsNewFile(false); fileToast('تم الإضافة');
        } else {
            const updated = { ...fileForm }; setFiles(prev => prev.map(f => f.id === updated.id ? updated : f)); setSelectedFile(updated); fileToast('تم الحفظ');
        }
    };
    const handleFileDelete = () => {
        if (!fileDelConfirm) { setFileDelConfirm(true); return; }
        const rest = files.filter(f => f.id !== selectedFile.id); setFiles(rest); setFileDelConfirm(false); setFileForm({ ...FILE_BLANK }); setSelectedFile(null); setIsNewFile(true); fileToast('تم الحذف', 'error');
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
                {/* form */}
                <div className="pw-files-form">
                    <div className="lec-field">
                        <label className="lec-label">الرقم</label>
                        <input className="lec-inp" value={isNewFile ? 'تلقائي' : fileForm.id} disabled style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }} />
                    </div>
                    <div className="lec-field">
                        <label className="lec-label">اسم الملف</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input className="lec-inp" name="name" value={fileForm.name} onChange={e => setFileForm(f => ({ ...f, name: e.target.value }))} placeholder="اسم الملف..." style={{ flex: 1 }} />
                            <button className="pw-select-file-btn" onClick={() => fileInputRef.current.click()}>📂 Select File</button>
                            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) setFileForm(prev => ({ ...prev, name: f.name, file: f })); }} />
                        </div>
                    </div>
                    <div className="lec-field">
                        <label className="lec-label">الترتيب</label>
                        <input className="lec-inp" name="order" type="number" min="1" value={fileForm.order} onChange={e => setFileForm(f => ({ ...f, order: e.target.value }))} placeholder="الترتيب..." />
                    </div>
                    <div className="lec-field">
                        <label className="lec-label">عنوان الملف</label>
                        <input className="lec-inp" name="title" value={fileForm.title} onChange={e => setFileForm(f => ({ ...f, title: e.target.value }))} placeholder="عنوان الملف..." />
                    </div>
                    <div className="pw-files-actions">
                        <button className="lec-act-btn save" onClick={handleFileSave} style={{ padding: '7px 16px', fontSize: '.76rem' }}>💾 حفظ</button>
                        <button className="lec-act-btn new" onClick={() => { setFileForm({ ...FILE_BLANK }); setSelectedFile(null); setIsNewFile(true); setFileDelConfirm(false); }} style={{ padding: '7px 16px', fontSize: '.76rem' }}>➕ جديد</button>
                        {!isNewFile && (fileDelConfirm
                            ? <><button className="lec-act-btn delete" onClick={handleFileDelete} style={{ padding: '7px 14px', fontSize: '.74rem' }}>تأكيد</button><button className="adm-fclear" onClick={() => setFileDelConfirm(false)}>إلغاء</button></>
                            : <button className="lec-act-btn delete" onClick={handleFileDelete} style={{ padding: '7px 16px', fontSize: '.76rem' }}>🗑 حذف</button>
                        )}
                    </div>
                </div>

                {/* table */}
                <div className="pw-files-table-wrap">
                    {files.length === 0 ? (
                        <div className="adm-empty" style={{ padding: '28px 12px' }}><div className="adm-emi">📂</div><p>لا توجد ملفات</p></div>
                    ) : (
                        <table className="pw-files-tbl">
                            <thead><tr><th>الرقم</th><th>الأسم</th></tr></thead>
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

    const toast = (msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3500); };

    const pick = rec => { setSelected(rec); setForm({ ...rec }); setIsNew(false); setDeleteConfirm(false); };

    // ── tree click: find matching record by label=name, or prefill name only ──
    const handleTreeSelect = node => {
        setTreeSelected(node);
        const match = records.find(r => r.name === node.label);
        if (match) {
            pick(match);
        } else {
            setSelected(null);
            setForm({ ...BLANK, name: node.label });
            setIsNew(true);
            setDeleteConfirm(false);
        }
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        if (!form.name.trim()) { toast('الأسم مطلوب', 'error'); return; }
        if (isNew) {
            const id = nextId.current++, newRec = { ...form, id };
            setRecords(prev => [newRec, ...prev]); setSelected(newRec); setForm({ ...newRec }); setIsNew(false); toast('تم الإضافة');
        } else {
            const updated = { ...form }; setRecords(prev => prev.map(r => r.id === updated.id ? updated : r)); setSelected(updated); toast('تم الحفظ');
        }
    };
    const handleNew = () => { setForm({ ...BLANK }); setSelected(null); setIsNew(true); setDeleteConfirm(false); };
    const handleReset = () => { if (isNew) setForm({ ...BLANK }); else setForm({ ...selected }); setDeleteConfirm(false); toast('تم الإلغاء', 'info'); };
    const handleDelete = () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        const rest = records.filter(r => r.id !== selected.id); setRecords(rest); setDeleteConfirm(false);
        if (rest.length) pick(rest[0]); else handleNew();
        toast('تم الحذف', 'error');
    };

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

                    <div style={{ padding: '10px 10px 6px', position: 'relative' }}>
                        <div className="adm-search" style={{ minWidth: 'unset' }}>
                            <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '.76rem' }} />
                            {search && <button className="lec-search-clear" onClick={() => setSearch('')}>✕</button>}
                        </div>
                    </div>

                    {/* Records list */}
                    <div className="lec-list pw-records-list">
                        {filtered.length === 0 && (
                            <div className="adm-empty" style={{ padding: '20px 12px' }}><div className="adm-emi">📋</div><p>{records.length === 0 ? 'لا توجد سجلات' : 'لا توجد نتائج'}</p></div>
                        )}
                        {filtered.map(rec => (
                            <div key={rec.id} className={`lec-row${selected?.id === rec.id ? ' active' : ''}`} onClick={() => pick(rec)}>
                                <div className="lec-avatar"><span style={{ fontSize: '.7rem', fontWeight: 900 }}>{rec.priority || '#'}</span></div>
                                <div className="lec-row-info">
                                    <div className="lec-row-name">{rec.name || 'بدون اسم'}</div>
                                    <div className="lec-row-spec">{rec.place || rec.date || '—'}</div>
                                </div>
                                <div className="lec-row-id">#{rec.id}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tree */}
                    <div className="pw-tree-panel">
                        <div className="pw-tree-header">خطه المعهد</div>
                        <div className="pw-tree-scroll">
                            {STATIC_TREE.map(node => (
                                <TreeNode key={node.id} node={node} selectedId={treeSelected?.id} onSelect={handleTreeSelect} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ FORM AREA ══ */}
                <div className="lec-form-wrap">
                    <div className="adm-card lec-form-card">
                        <div className="lec-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
                                    {isNew ? 'سجل جديد' : `ID: #${selected?.id}`}
                                </div>
                                <h2 className="lec-form-title">{isNew ? '➕ إضافة سجل جديد' : '✏️ تعديل بيانات خطة العمل'}</h2>
                                {!isNew && selected && <p className="lec-form-sub">{selected.name}</p>}
                            </div>
                            <div className="lec-stat-pill">📋 {records.length} سجل</div>
                        </div>

                        <div className="lec-form-body">
                            <div className="lec-fields-grid" style={{ marginBottom: 20 }}>
                                <Field label="الرقم">
                                    <input className="lec-inp" value={isNew ? 'تلقائي' : form.id} disabled style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }} />
                                </Field>
                                <Field label="الأولويه">
                                    <input className="lec-inp" name="priority" type="number" min="1" value={form.priority} onChange={handleChange} placeholder="الأولويه..." />
                                </Field>
                                <Field label="عدد الأيام">
                                    <input className="lec-inp" name="days" type="number" min="1" value={form.days} onChange={handleChange} placeholder="عدد الأيام..." />
                                </Field>
                                <Field label="اسم المستخدم">
                                    <input className="lec-inp" name="username" value={form.username} onChange={handleChange} placeholder="اسم المستخدم..." />
                                </Field>
                                <Field label="كلمه السر">
                                    <input className="lec-inp" name="password" type="password" value={form.password} onChange={handleChange} placeholder="كلمه السر..." />
                                </Field>
                                <Field label="الأسم">
                                    <input className="lec-inp" name="name" value={form.name} onChange={handleChange} placeholder="الأسم..." />
                                </Field>
                                <Field label="السعر">
                                    <input className="lec-inp" name="price" value={form.price} onChange={handleChange} placeholder="السعر..." />
                                </Field>
                                <Field label="المكان">
                                    <input className="lec-inp" name="place" value={form.place} onChange={handleChange} placeholder="المكان..." />
                                </Field>
                                <Field label="التاريخ">
                                    <input className="lec-inp" name="date" type="date" value={form.date} onChange={handleChange} style={{ direction: 'ltr', textAlign: 'right' }} />
                                </Field>
                                <Field label="الوصف" full>
                                    <input className="lec-inp" name="description" value={form.description} onChange={handleChange} placeholder="الوصف..." />
                                </Field>
                                <div className="lec-field" style={{ gridColumn: '1/-1' }}>
                                    <label className="lec-label">الخيارات</label>
                                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: '10px 12px', border: '1.5px solid #d0d3d8', borderRadius: 3, background: '#fff' }}>
                                        {[{ name: 'show', label: 'عرض' }, { name: 'hasDetails', label: 'له تفاصيل' }, { name: 'showOnHome', label: 'عرض على الصفحه الرئيسيه' }].map(cb => (
                                            <label key={cb.name} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, color: '#374151' }}>
                                                <input type="checkbox" name={cb.name} checked={!!form[cb.name]} onChange={handleChange} style={{ width: 16, height: 16, accentColor: T.orange, cursor: 'pointer' }} />
                                                {cb.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lec-divider" />

                            <RichTextEditor icon="📄" label="تفاصيل الكورس" sub="حدد النص ثم اختر الخط أو اللون" name="details" value={form.details} onChange={handleChange} placeholder="أدخل تفاصيل الكورس هنا..." minHeight={150} />

                            <div className="lec-actions">
                                <button className="lec-act-btn save" onClick={handleSave}>💾 حفظ</button>
                                <button className="lec-act-btn new" onClick={handleNew}>➕ سجل جديد</button>
                                <button className="lec-act-btn reset" onClick={handleReset}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNew && (deleteConfirm
                                    ? <div className="lec-delete-confirm"><span className="lec-delete-warn">⚠️ هل أنت متأكد؟</span><button className="lec-act-btn delete" onClick={handleDelete}>تأكيد الحذف</button><button className="adm-fclear" onClick={() => setDeleteConfirm(false)}>إلغاء</button></div>
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