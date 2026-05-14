import { useState, useRef, useEffect, useCallback } from "react";

const BASE = "https://acwebsite-icmet-test.azurewebsites.net";

const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
};

const BLANK = { id: 0, date: '', title: '', details: '', isActive: true };

// ── ActiveToggle ──────────────────────────────────────────────────────────────
function ActiveToggle({ value, onChange }) {
    return (
        <label className="news-toggle-wrap" title={value ? 'الخبر مرئي — اضغط للإخفاء' : 'الخبر مخفي — اضغط للإظهار'}>
            <div className={`news-toggle-track${value ? ' on' : ''}`} onClick={() => onChange(!value)}>
                <div className="news-toggle-thumb" />
            </div>
            <span className={`news-toggle-label${value ? ' on' : ' off'}`}>
                {value ? '👁 مرئي' : '🙈 مخفي'}
            </span>
        </label>
    );
}

function formatDateAr(dateStr) {
    if (!dateStr) return '—';
    try { return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return dateStr; }
}
function toInputDate(dateStr) {
    if (!dateStr) return '';
    try { return new Date(dateStr).toISOString().slice(0, 10); } catch { return ''; }
}
function resolveImg(url) {
    if (!url || url === 'N/A' || url === 'pending') return null;
    if (url.startsWith('http')) return url;
    return `${BASE}/${url.replace(/^\//, '')}`;
}
function previewSnippet(text, len = 55) {
    if (!text) return '—';
    return text.length > len ? text.slice(0, len) + '…' : text;
}

// ── Rich Text Helpers ──────────────────────────────────────────────────────────
const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];

function textToHtml(text = '') {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.split('\n').map(line =>
        line ? `<div>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : '<div><br></div>'
    ).join('');
}

function wrapSelectionWithStyle(property, value) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style[property] = value;
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
            const val = window.getComputedStyle(node)[cssProp];
            if (val) return val;
        }
        node = node.parentNode;
    }
    return null;
}

// ── RichTextEditor ─────────────────────────────────────────────────────────────
function RichTextEditor({ icon, label, sub, name, value, onChange, placeholder, minHeight = 180 }) {
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

    useEffect(() => { if (urlOpen && urlInputRef.current) urlInputRef.current.focus(); }, [urlOpen]);

    useEffect(() => {
        if (!urlOpen) return;
        const h = e => { if (!e.target.closest('.news-rte-url-wrap')) setUrlOpen(false); };
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
        <div className="news-rte-block">
            <div className="news-rte-hdr">
                <span className="news-rte-icon">{icon}</span>
                <div style={{ flex: 1 }}>
                    <div className="news-rte-label">{label}</div>
                    {sub && <div className="news-rte-sub">{sub}</div>}
                </div>
            </div>
            <div className="news-rte-toolbar" onMouseDown={e => { if (e.target.tagName === 'SELECT') return; e.preventDefault(); }}>
                <button className="news-tb-btn bold" title="عريض" onClick={() => exec('bold')}>B</button>
                <button className="news-tb-btn italic" title="مائل" onClick={() => exec('italic')}>I</button>
                <button className="news-tb-btn under" title="تحته خط" onClick={() => exec('underline')}>U</button>
                <div className="news-rte-sep" />
                <div className="news-tb-size-wrap">
                    <select className="news-tb-select news-tb-size-select" value={fontSize} onChange={handleFontSize} onMouseDown={saveSelection}>
                        {FONT_SIZES.map(px => <option key={px} value={px}>{px}</option>)}
                    </select>
                    <span className="news-tb-size-unit">px</span>
                </div>
                <div className="news-rte-sep" />
                <div className="news-tb-color-wrap">
                    <button className="news-tb-color-btn" onMouseDown={saveSelection}>
                        <span className="news-color-letter" style={{ color: fontColor }}>A</span>
                        <span className="news-color-bar" style={{ background: fontColor }} />
                        <input type="color" className="news-tb-color-input" value={fontColor}
                            onChange={e => { const c = e.target.value; setFontColor(c); restoreSelection(); exec('foreColor', c); }} />
                    </button>
                </div>
                <div className="news-rte-sep" />
                <div className="news-rte-url-wrap">
                    <button className={`news-tb-btn${urlOpen ? ' active' : ''}`} title="إضافة رابط"
                        onClick={() => { saveSelection(); setUrlValue('https://'); setUrlOpen(true); }}
                        onMouseDown={saveSelection}>🔗</button>
                    {urlOpen && (
                        <div className="news-url-popover">
                            <input ref={urlInputRef} type="url" placeholder="https://example.com" value={urlValue}
                                onChange={e => setUrlValue(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') confirmUrl(); if (e.key === 'Escape') { setUrlOpen(false); restoreSelection(); } }} />
                            <button className="news-url-ok" onClick={confirmUrl}>إدراج</button>
                            <button className="news-url-cancel" onClick={() => { setUrlOpen(false); restoreSelection(); }}>إلغاء</button>
                        </div>
                    )}
                </div>
                <button className="news-tb-btn" title="إزالة الرابط" onClick={() => exec('unlink')} onMouseDown={saveSelection} style={{ fontSize: '.7rem' }}>✂️</button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="news-rte-editor"
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

// ── MultiImageUploader ────────────────────────────────────────────────────────
function MultiImageUploader({ images, onChange }) {
    const fileRef = useRef();
    const [dragOver, setDragOver] = useState(false);

    const addFiles = (files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (!valid.length) return;
        const newSlots = valid.map(file => ({
            file,
            previewSrc: URL.createObjectURL(file),
            serverUrl: null,
        }));
        onChange([...images, ...newSlots]);
    };

    const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

    const setMain = (idx) => {
        if (idx === 0) return;
        const next = [...images];
        const [picked] = next.splice(idx, 1);
        next.unshift(picked);
        onChange(next);
    };

    const replaceFile = (idx, file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const next = [...images];
        next[idx] = { file, previewSrc: URL.createObjectURL(file), serverUrl: null };
        onChange(next);
    };

    return (
        <div className="news-multi-img-wrap">
            <div className="news-label" style={{ marginBottom: 8 }}>
                صور الخبر
                <span style={{ marginRight: 8, fontSize: '.65rem', color: T.gray500, fontWeight: 400 }}>
                    الصورة الأولى هي الصورة الرئيسية — تظهر في القائمة وكغلاف للخبر
                </span>
            </div>
            {images.length > 0 && (
                <div className="news-imgs-grid">
                    {images.map((img, idx) => (
                        <MultiImageSlot
                            key={idx} img={img} idx={idx} isMain={idx === 0}
                            onRemove={() => remove(idx)}
                            onSetMain={() => setMain(idx)}
                            onReplace={(file) => replaceFile(idx, file)}
                        />
                    ))}
                </div>
            )}
            <div
                className={`news-img-zone${dragOver ? ' over' : ''}`}
                style={{ minHeight: 72, marginTop: images.length ? 12 : 0 }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current.click()}
            >
                <div className="news-img-placeholder" style={{ padding: '14px 12px' }}>
                    <div className="news-img-icon" style={{ fontSize: '1.6rem' }}>🖼️</div>
                    <span className="news-img-hint">
                        {images.length === 0 ? 'اسحب الصور هنا أو اضغط للاختيار' : '+ إضافة صور أخرى'}
                    </span>
                    <span className="news-img-types">JPG · PNG · WEBP — يمكن اختيار أكثر من صورة</span>
                </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
        </div>
    );
}

function MultiImageSlot({ img, idx, isMain, onRemove, onSetMain, onReplace }) {
    const fileRef = useRef();
    return (
        <div className={`news-img-slot${isMain ? ' main' : ''}`}>
            <img src={img.previewSrc} alt={`صورة ${idx + 1}`} className="news-slot-img" />
            {isMain && <div className="news-main-badge">⭐ رئيسية</div>}
            {img.file && !isMain && <div className="news-new-badge-slot">جديدة</div>}
            {img.file && isMain && <div className="news-new-badge-slot main">جديدة ⭐</div>}
            {!img.file && img.serverUrl && <div className="news-server-badge-slot">{isMain ? '⭐ محفوظة' : 'محفوظة'}</div>}
            <div className="news-slot-actions">
                {!isMain && <button className="news-slot-btn promote" title="تعيين كصورة رئيسية" onClick={onSetMain}>⭐</button>}
                <button className="news-slot-btn replace" title="استبدال الصورة" onClick={() => fileRef.current.click()}>🔄</button>
                <button className="news-slot-btn remove" title="حذف الصورة" onClick={onRemove}>✕</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { onReplace(e.target.files[0]); e.target.value = ''; }} />
        </div>
    );
}

// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&display=swap');
.news-root {
    display: flex;
    direction: rtl;
    font-family: "Noto Kufi Arabic", sans-serif;
    background: #f0f1f2;
    gap: 16px;
    padding: 16px;
    align-items: stretch; /* Forces children to match height */
    height: 100vh; /* Lock to viewport height */
    box-sizing: border-box;
    overflow: hidden; /* Prevent the whole page from scrolling */
}
.news-sidebar {
    width: clamp(230px, 26vw, 290px);
    background: #fff;
    border-radius: 3px;
    border: 1.5px solid #d0d3d8;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    /* Remove sticky and max-height */
}
.news-brand{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 10px;border-bottom:1.5px solid #f0f1f2;gap:8px;}
.news-brand-icon{width:36px;height:36px;border-radius:3px;background:linear-gradient(135deg,#0865a8,#1a84d4);display:flex;align-items:center;justify-content:center;font-size:.9rem;color:#bfdbfe;border:1.5px solid rgba(8,101,168,.25);flex-shrink:0;}
.news-brand-name{font-size:.78rem;font-weight:800;color:#0a0a0a;}
.news-brand-sub{font-size:.64rem;color:#6b7280;margin-top:2px;}
.news-search-wrap{padding:12px 12px 6px;flex-shrink:0;position:relative;z-index:1;}
.news-search-wrap input{width:100%;padding:9px 34px 9px 12px;background:#fff;border:1.5px solid #d0d3d8;border-radius:3px;color:#0a0a0a;font-family:inherit;font-size:.76rem;direction:rtl;outline:none;box-sizing:border-box;}
.news-search-wrap input::placeholder{color:#6b7280;}
.news-search-wrap input:focus{border-color:#f57c00;box-shadow:0 0 0 3px rgba(245,124,0,.1);}
.news-search-icon{position:absolute;right:22px;top:50%;transform:translateY(-50%);font-size:.75rem;opacity:.4;pointer-events:none;}
.news-search-clear{position:absolute;left:20px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#6b7280;font-size:1rem;padding:2px;}
.news-list-hdr{padding:4px 14px 8px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.news-count-badge{background:rgba(8,101,168,.1);color:#0865a8;border:1.5px solid rgba(8,101,168,.25);border-radius:2px;padding:1px 9px;font-size:.66rem;font-weight:900;font-family:'Courier New',monospace;}
.news-new-btn{background:rgba(245,124,0,.1);color:#f57c00;border:1.5px solid rgba(245,124,0,.35);border-radius:2px;padding:4px 12px;font-size:.72rem;font-weight:800;cursor:pointer;font-family:inherit;transition:all .16s;}
.news-new-btn:hover{background:rgba(245,124,0,.18);}
.news-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px 12px;
}
.news-list::-webkit-scrollbar{width:4px;}
.news-list::-webkit-scrollbar-thumb{background:rgba(245,124,0,.35);border-radius:2px;}
.news-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:3px;margin-bottom:3px;cursor:pointer;border:1.5px solid transparent;transition:background .13s,border-color .13s;}
.news-row:hover{background:rgba(8,101,168,.05);border-color:rgba(8,101,168,.12);}
.news-row.active{background:rgba(245,124,0,.09);border-color:rgba(245,124,0,.35);border-right:3px solid #f57c00;}
.news-row-icon{width:38px;height:38px;border-radius:3px;background:linear-gradient(135deg,${T.blue},${T.blueLight});display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;border:1.5px solid rgba(8,101,168,.3);overflow:hidden;}
.news-row-info{overflow:hidden;flex:1;}
.news-row-title{color:#0a0a0a;font-size:.75rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.news-row-date{color:#6b7280;font-size:.63rem;margin-top:2px;}
.news-row-id{background:#f0f1f2;color:#6b7280;font-size:.6rem;padding:2px 7px;border-radius:2px;flex-shrink:0;font-weight:700;font-family:'Courier New',monospace;}
.news-sidebar-footer{padding:10px 14px;border-top:1.5px solid #f0f1f2;text-align:center;font-size:.6rem;color:#6b7280;background:#fff;}
.news-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 100%; /* Fill parent */
}

.news-body {
    flex: 1;
    padding: 0; 
    overflow-y: auto; /* This allows the form to scroll if it's long */
    display: flex;
    flex-direction: column;
}

.news-card {
    flex: 1; /* Stretch the white card to the bottom */
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1.5px solid #d0d3d8;
    border-radius: 3px;
    margin-bottom: 0; /* Remove bottom margin to align with sidebar */
}
.news-topbar{background:#fff;border-bottom:3px solid ${T.orange};padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:56px;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.06);}
.news-notif{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:3px;font-size:.8rem;font-weight:700;animation:news-notif-in .3s cubic-bezier(.34,1.56,.64,1);border-right:4px solid;margin:14px 24px 0;}
.news-notif-success{background:#f0fdf4;border-color:#16a34a;color:#15803d;}
.news-notif-error{background:#fef2f2;border-color:#dc2626;color:#dc2626;}
.news-notif-info{background:rgba(8,101,168,.06);border-color:${T.blue};color:${T.blue};}
@keyframes news-notif-in{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.news-body::-webkit-scrollbar{width:5px;}
.news-body::-webkit-scrollbar-thumb{background:${T.gray300};border-radius:3px;}
.news-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to left,${T.orange},${T.blue});z-index:2;}
@keyframes news-card-up{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.news-form-hdr{background:${T.blueDark};padding:20px 26px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;position:relative;overflow:hidden;}
.news-form-hdr::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(245,124,0,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,.07) 1px,transparent 1px);background-size:36px 36px;pointer-events:none;}
.news-form-tag{display:inline-block;background:${T.orange};color:#fff;font-size:.7rem;font-weight:700;padding:4px 14px;border-radius:2px;margin-bottom:6px;position:relative;z-index:1;}
.news-form-title{font-size:1.1rem;font-weight:900;color:#fff;margin:0;position:relative;z-index:1;}
.news-form-sub{font-size:.72rem;color:rgba(255,255,255,.4);margin:4px 0 0;position:relative;z-index:1;}
.news-stat-pill{display:inline-flex;align-items:center;padding:5px 14px;border-radius:2px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);color:rgba(255,255,255,.72);font-size:.72rem;font-weight:700;position:relative;z-index:1;}
.news-form-body {
    padding: 26px;
    flex: 1; /* Ensures the body content area expands */
}
.news-fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;margin-bottom:22px;}
.news-field{display:flex;flex-direction:column;gap:5px;}
.news-label{font-size:.72rem;font-weight:700;color:${T.gray700};}
.news-inp{border:1.5px solid ${T.gray300};border-radius:3px;padding:9px 12px;font-size:.8rem;color:${T.black};width:100%;background:#fff;direction:rtl;font-family:inherit;transition:border .18s,box-shadow .18s;outline:none;box-sizing:border-box;}
.news-inp:focus{border-color:${T.orange};box-shadow:0 0 0 3px rgba(245,124,0,.1);}
.news-inp::placeholder{color:${T.gray500};}
.news-inp:disabled{background:${T.gray100};color:${T.gray500};cursor:not-allowed;}
.news-divider{height:1px;background:${T.gray100};margin:4px 0 20px;}

/* ── Active Toggle ── */
.news-toggle-wrap{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;padding:6px 0;}
.news-toggle-track{width:46px;height:26px;border-radius:13px;background:${T.gray300};border:1.5px solid ${T.gray300};position:relative;transition:background .22s,border-color .22s;flex-shrink:0;}
.news-toggle-track.on{background:#16a34a;border-color:#16a34a;}
.news-toggle-thumb{position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25);transition:transform .22s cubic-bezier(.4,0,.2,1);}
.news-toggle-track.on .news-toggle-thumb{transform:translateX(-20px);}
.news-toggle-label{font-size:.76rem;font-weight:800;}
.news-toggle-label.on{color:#16a34a;}
.news-toggle-label.off{color:${T.gray500};}

/* sidebar status dot */
.news-row-status{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:2px;}
.news-row-status.on{background:#16a34a;}
.news-row-status.off{background:${T.gray300};}

/* ── Multi Image Grid ── */
.news-img-zone{width:100%;border-radius:6px;border:2px dashed ${T.gray300};background:${T.gray50};display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:border-color .18s,background .18s;overflow:visible;box-sizing:border-box;}
.news-img-zone:hover,.news-img-zone.over{border-color:${T.orange};background:rgba(245,124,0,.03);}
.news-img-placeholder{display:flex;flex-direction:column;align-items:center;gap:6px;padding:18px 12px;}
.news-img-icon{font-size:2rem;}
.news-img-hint{color:${T.gray500};font-size:.68rem;font-weight:600;text-align:center;line-height:1.6;}
.news-img-types{color:${T.gray300};font-size:.62rem;background:${T.gray100};padding:2px 10px;border-radius:2px;}
.news-multi-img-wrap{margin-bottom:4px;}
.news-imgs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:4px;}
.news-img-slot{position:relative;border-radius:6px;overflow:hidden;border:2px solid ${T.gray300};background:#000;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;transition:border-color .2s,box-shadow .2s;}
.news-img-slot.main{border-color:${T.orange};box-shadow:0 0 0 3px rgba(245,124,0,.2);}
.news-slot-img{width:100%;height:100%;object-fit:cover;display:block;}
.news-main-badge{position:absolute;top:5px;right:5px;background:${T.orange};color:#fff;font-size:.55rem;font-weight:800;padding:2px 8px;border-radius:3px;pointer-events:none;z-index:2;}
.news-new-badge-slot{position:absolute;top:5px;left:5px;background:#f59e0b;color:#fff;font-size:.52rem;font-weight:800;padding:2px 6px;border-radius:3px;pointer-events:none;z-index:2;}
.news-new-badge-slot.main{background:${T.orange};}
.news-server-badge-slot{position:absolute;top:5px;left:5px;background:${T.blue};color:#fff;font-size:.52rem;font-weight:800;padding:2px 6px;border-radius:3px;pointer-events:none;z-index:2;}
.news-slot-actions{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;gap:4px;padding:5px;opacity:0;transition:opacity .18s;}
.news-img-slot:hover .news-slot-actions{opacity:1;}
.news-slot-btn{border:none;border-radius:3px;padding:4px 7px;font-size:.7rem;cursor:pointer;font-family:inherit;font-weight:700;line-height:1;}
.news-slot-btn.promote{background:${T.orange};color:#fff;}
.news-slot-btn.replace{background:${T.blue};color:#fff;}
.news-slot-btn.remove{background:#dc2626;color:#fff;}

/* ── RichTextEditor ── */
.news-rte-block{border-radius:3px;border:1.5px solid ${T.gray300};overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.news-rte-hdr{background:${T.gray50};padding:10px 16px;border-bottom:1.5px solid ${T.gray100};display:flex;align-items:center;gap:9px;}
.news-rte-icon{font-size:1.1rem;}
.news-rte-label{font-weight:800;font-size:.8rem;color:${T.black};}
.news-rte-sub{font-size:.65rem;color:${T.gray500};margin-top:2px;}
.news-rte-toolbar{display:flex;align-items:center;gap:4px;padding:7px 12px;background:#fff;border-bottom:1.5px solid ${T.gray100};flex-wrap:wrap;}
.news-rte-sep{width:1px;height:20px;background:#e5e7eb;margin:0 2px;flex-shrink:0;}
.news-tb-btn{min-width:30px;height:28px;padding:0 7px;border-radius:4px;border:1.5px solid ${T.gray300};background:${T.gray50};color:${T.gray700};font-size:.78rem;font-weight:700;cursor:pointer;transition:all .14s;font-family:inherit;}
.news-tb-btn:hover,.news-tb-btn.active{background:${T.orange};color:#fff;border-color:${T.orange};}
.news-tb-btn.bold{font-weight:900;}
.news-tb-btn.italic{font-style:italic;}
.news-tb-btn.under{text-decoration:underline;}
.news-tb-size-wrap{display:flex;align-items:center;gap:3px;}
.news-tb-select{padding:4px 6px;border-radius:4px;border:1.5px solid ${T.gray300};background:${T.gray50};color:${T.gray700};font-family:inherit;font-size:.74rem;cursor:pointer;outline:none;}
.news-tb-select:focus{border-color:${T.orange};}
.news-tb-size-unit{font-size:.65rem;color:${T.gray500};font-weight:700;}
.news-tb-color-wrap{position:relative;}
.news-tb-color-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:3px 6px;border-radius:4px;border:1.5px solid ${T.gray300};background:${T.gray50};cursor:pointer;position:relative;}
.news-color-letter{font-size:.9rem;font-weight:900;line-height:1;}
.news-color-bar{width:14px;height:3px;border-radius:2px;}
.news-tb-color-input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer;border:none;padding:0;}
.news-rte-url-wrap{position:relative;}
.news-url-popover{position:absolute;top:calc(100% + 6px);right:0;background:#fff;border:1.5px solid ${T.gray300};border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.12);padding:10px;z-index:500;display:flex;gap:6px;min-width:320px;border-top:3px solid ${T.orange};}
.news-url-popover input{flex:1;padding:7px 10px;border:1.5px solid ${T.gray300};border-radius:4px;font-family:inherit;font-size:.76rem;direction:ltr;outline:none;}
.news-url-popover input:focus{border-color:${T.orange};}
.news-url-ok{padding:7px 14px;background:${T.orange};color:#fff;border:none;border-radius:4px;font-family:inherit;font-size:.74rem;font-weight:700;cursor:pointer;}
.news-url-cancel{padding:7px 10px;background:${T.gray100};color:${T.gray700};border:1.5px solid ${T.gray300};border-radius:4px;font-family:inherit;font-size:.74rem;font-weight:700;cursor:pointer;}
.news-rte-editor{
    padding:12px 16px;
    outline:none;
    font-family:"Noto Kufi Arabic",sans-serif;
    font-size:.82rem;
    color:#0a0a0a;
    line-height:1.9;
    direction:rtl;
    background:#fff;

    /* الحل */
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
}
.news-rte-editor:empty::before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none;}
.news-rte-editor a{color:#0865a8;text-decoration:underline;}

/* ── Actions ── */
.news-actions{display:flex;gap:9px;margin-top:24px;padding-top:18px;border-top:2px solid ${T.gray100};flex-wrap:wrap;align-items:center;}
.news-act-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:3px;font-family:inherit;font-size:.8rem;font-weight:800;cursor:pointer;border:none;transition:all .2s cubic-bezier(.4,0,.2,1);white-space:nowrap;}
.news-act-btn:hover{transform:translateY(-2px);}
.news-act-btn:active{transform:translateY(0);}
.news-act-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.news-act-btn.save{background:#16a34a;color:#fff;box-shadow:0 3px 12px rgba(22,163,74,.3);}
.news-act-btn.save:hover{background:#15803d;}
.news-act-btn.new{background:${T.blue};color:#fff;box-shadow:0 3px 12px rgba(8,101,168,.3);}
.news-act-btn.new:hover{background:${T.blueDark};}
.news-act-btn.reset{background:${T.orange};color:#fff;box-shadow:0 3px 12px rgba(245,124,0,.3);}
.news-act-btn.reset:hover{background:${T.orangeDark};}
.news-act-btn.delete{background:#dc2626;color:#fff;box-shadow:0 3px 12px rgba(220,38,38,.3);}
.news-act-btn.delete:hover{background:#b91c1c;}
.news-delete-confirm{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fef2f2;border:1.5px solid rgba(220,38,38,.3);border-radius:3px;padding:9px 14px;border-right:4px solid #dc2626;}
.news-delete-warn{font-size:.78rem;color:#dc2626;font-weight:700;}
.news-act-btn.cancel{background:${T.gray100};color:${T.gray500};border:1.5px solid ${T.gray300};box-shadow:none;}
.news-act-btn.cancel:hover{border-color:${T.black};color:${T.black};}
.news-empty{text-align:center;padding:60px 20px;color:${T.gray500};}
.news-empty-icon{font-size:2.4rem;margin-bottom:12px;opacity:.35;}
.news-skeleton{background:linear-gradient(90deg,#f0f1f2 25%,#e0e2e5 50%,#f0f1f2 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:3px;}
@keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
.news-loading-row{display:flex;align-items:center;gap:10px;padding:9px 10px;margin-bottom:3px;}
@media(max-width:900px){.news-root{flex-direction:column;}.news-sidebar{width:100%;height:auto;max-height:280px;}.news-fields-grid{grid-template-columns:1fr;}}
`;

function injectStyles() {
    if (document.getElementById('news-tab-styles')) return;
    const el = document.createElement('style');
    el.id = 'news-tab-styles';
    el.textContent = CSS;
    document.head.appendChild(el);
}

// ── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
    const res = await fetch(`${BASE}${path}`, opts);
    if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                const json = await res.json();
                errMsg += ' — ' + (json?.title || json?.message || JSON.stringify(json));
            } else {
                const txt = await res.text();
                if (txt) errMsg += ' — ' + txt.slice(0, 200);
            }
        } catch { }
        throw new Error(errMsg);
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json') || ct.includes('text/plain')) {
        try { return await res.json(); } catch { return null; }
    }
    return null;
}

// ── Build FormData ────────────────────────────────────────────────────────────
function buildFormData(form, images, isNew) {
    const fd = new FormData();
    fd.append('Id', isNew ? '0' : String(form.id));
    fd.append('Title', form.title || '');
    fd.append('Details', form.details || '');
    fd.append('Date', form.date ? `${form.date}T00:00:00.000Z` : '');
    fd.append('IsActive', String(form.isActive));   // ← NEW

    const main = images[0];
    const rest = images.slice(1);

    if (main?.file) {
        fd.append('Images', main.file);
        fd.append('ImageUrl', 'pending');
    } else {
        fd.append('ImageUrl', main?.serverUrl || 'pending');
    }

    rest.forEach(img => {
        if (img.file) fd.append('Images', img.file);
        else if (img.serverUrl) fd.append('ImageUrls', img.serverUrl);
    });

    return fd;
}

// ════════════════════════════════════════════════════════════════════════════
// NewsTab
// ════════════════════════════════════════════════════════════════════════════
export default function NewsTab() {
    injectStyles();

    const [news, setNews] = useState([]);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ ...BLANK });
    const [images, setImages] = useState([]);
    const [isNew, setIsNew] = useState(false);
    const [search, setSearch] = useState('');
    const [notification, setNotif] = useState(null);
    const [deleteConfirm, setDelConf] = useState(false);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailL] = useState(false);
    const [saving, setSaving] = useState(false);

    const toast = (msg, type = 'success') => {
        setNotif({ msg, type });
        setTimeout(() => setNotif(null), 3500);
    };

    // ── Load list ──
    const loadList = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch(`/api/admin/AdminNews/getAllNews?PageIndex=1&PageSize=100`);
            const items = data?.data ?? [];
            setNews(items);
            setTotal(data?.totalItems ?? items.length);
            if (items.length && !selected) pickById(items[0].id, items[0]);
        } catch (e) {
            toast('فشل تحميل الأخبار: ' + e.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadList(); }, [loadList]);

    // ── Fetch single ──
    const pickById = async (id, listItem) => {
        setDetailL(true);
        setDelConf(false);
        setIsNew(false);

        if (listItem) {
            setSelected(listItem);
            const mainUrl = resolveImg(listItem.imageUrl);
            setImages(mainUrl ? [{ file: null, previewSrc: mainUrl, serverUrl: listItem.imageUrl }] : []);
            setForm({
                id: listItem.id,
                title: listItem.title || '',
                details: '',
                date: toInputDate(listItem.publishedAt),
                isActive: listItem.isActive ?? true,   // ← NEW
            });
        }

        try {
            const item = await apiFetch(`/api/admin/AdminNews/${id}`);
            if (item) {
                const mapped = {
                    id: item.id,
                    title: item.title || '',
                    details: item.details || '',
                    date: toInputDate(item.date || item.publishedAt),
                    isActive: item.isActive ?? true,   // ← NEW
                };
                setSelected(mapped);
                setForm(mapped);

                const slots = [];
                const mainResolved = resolveImg(item.imageUrl);
                if (mainResolved) slots.push({ file: null, previewSrc: mainResolved, serverUrl: item.imageUrl });
                const extras = item.imageUrls ?? item.ImageUrls ?? [];
                extras.forEach(u => {
                    const r = resolveImg(u);
                    if (r) slots.push({ file: null, previewSrc: r, serverUrl: u });
                });
                setImages(slots);
            }
        } catch (e) {
            toast('فشل تحميل تفاصيل الخبر', 'error');
        } finally {
            setDetailL(false);
        }
    };

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    // ── Save ──
    const handleSave = async () => {
        if (!form.title.trim()) { toast('عنوان الخبر مطلوب', 'error'); return; }
        if (!form.date) { toast('التاريخ مطلوب', 'error'); return; }
        if (images.length === 0) { toast('صورة الخبر مطلوبة', 'error'); return; }
        if (!form.details || !form.details.trim() || form.details === '<div><br></div>') {
            toast('تفاصيل الخبر مطلوبة', 'error'); return;
        }
        setSaving(true);
        try {
            const fd = buildFormData(form, images, isNew);
            if (isNew) {
                await apiFetch('/api/admin/AdminNews', { method: 'POST', body: fd });
                toast('تم إضافة الخبر بنجاح');
            } else {
                await apiFetch(`/api/admin/AdminNews/${form.id}`, { method: 'PUT', body: fd });
                toast('تم حفظ التغييرات بنجاح');
            }
            setIsNew(false);
            await loadList();
        } catch (e) {
            toast('فشل الحفظ: ' + e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleNew = () => {
        setForm({ ...BLANK });
        setSelected(null);
        setIsNew(true);
        setDelConf(false);
        setImages([]);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) { setDelConf(true); return; }
        setSaving(true);
        try {
            await apiFetch(`/api/admin/AdminNews/${selected.id}`, { method: 'DELETE' });
            toast('تم حذف الخبر', 'error');
            setDelConf(false);
            setSelected(null);
            await loadList();
            handleNew();
        } catch (e) {
            toast('فشل الحذف: ' + e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (isNew) {
            setForm({ ...BLANK });
            setImages([]);
        } else if (selected) {
            setForm({ ...selected });
            pickById(selected.id, null);
        }
        setDelConf(false);
        toast('تم إلغاء التغييرات', 'info');
    };

    const mainImageOf = (item) => resolveImg(item.imageUrl);

    const filtered = news.filter(n =>
        (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
        formatDateAr(n.publishedAt).includes(search)
    );

    return (
        <div style={{ display: 'flex', gap: '16px', direction: 'rtl', alignItems: 'flex-start' }}>

            {/* ════ SIDEBAR ════ */}
            <aside className="news-sidebar">
                <div className="news-brand">
                    <div className="news-brand-icon">📰</div>
                    <div>
                        <div className="news-brand-name">ICEMT</div>
                        <div className="news-brand-sub">إدارة الأخبار</div>
                    </div>
                </div>

                <div className="news-search-wrap" style={{ position: 'relative' }}>
                    <input type="text" placeholder="بحث بالعنوان أو التاريخ..." value={search} onChange={e => setSearch(e.target.value)} />
                    <span className="news-search-icon">🔍</span>
                    {search && <button className="news-search-clear" onClick={() => setSearch('')}>✕</button>}
                </div>

                <div className="news-list-hdr">
                    <span style={{ color: '#374151', fontSize: '.68rem', fontWeight: 700 }}>
                        الأخبار &nbsp;<span className="news-count-badge">{filtered.length}</span>
                    </span>
                    <button className="news-new-btn" onClick={handleNew}>+ جديد</button>
                </div>

                <div className="news-list">
                    {loading && [1, 2, 3].map(i => (
                        <div className="news-loading-row" key={i}>
                            <div className="news-skeleton" style={{ width: 38, height: 38, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div className="news-skeleton" style={{ height: 12, marginBottom: 6 }} />
                                <div className="news-skeleton" style={{ height: 10, width: '60%' }} />
                            </div>
                        </div>
                    ))}
                    {!loading && filtered.length === 0 && (
                        <div className="news-empty" style={{ padding: '32px 12px' }}>
                            <div className="news-empty-icon">🔍</div>
                            <p style={{ fontSize: '.74rem' }}>لا توجد نتائج</p>
                        </div>
                    )}
                    {!loading && filtered.map(item => (
                        <div
                            key={item.id}
                            className={`news-row${selected?.id === item.id ? ' active' : ''}`}
                            onClick={() => pickById(item.id, item)}
                        >
                            <div className="news-row-icon">
                                {mainImageOf(item)
                                    ? <img src={mainImageOf(item)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : '📰'}
                            </div>
                            <div className="news-row-info">
                                <div className="news-row-title">{item.title || 'بدون عنوان'}</div>
                                <div className="news-row-date">{formatDateAr(item.publishedAt)}</div>
                            </div>
                            {/* ── status dot ── */}
                            <div className={`news-row-status ${(item.isActive ?? true) ? 'on' : 'off'}`} title={(item.isActive ?? true) ? 'مرئي' : 'مخفي'} />
                            <div className="news-row-id">#{item.id}</div>
                        </div>
                    ))}
                </div>

                <div className="news-sidebar-footer">ICEMT © {new Date().getFullYear()}</div>
            </aside>

            {/* ════ MAIN ════ */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0
            }}>
                {notification && (
                    <div className={`news-notif news-notif-${notification.type}`}>
                        <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
                        {notification.msg}
                    </div>
                )}

                <div className="news-body">
                    <div className="news-card">

                        <div className="news-form-hdr">
                            <div>
                                <div className="news-form-tag">{isNew ? 'خبر جديد' : `ID: #${selected?.id}`}</div>
                                <h2 className="news-form-title">
                                    {detailLoading ? '⏳ جاري التحميل...' : isNew ? '➕ إضافة خبر جديد' : '✏️ تعديل بيانات الخبر'}
                                </h2>
                                {!isNew && selected && <p className="news-form-sub">{previewSnippet(selected.title, 60)}</p>}
                            </div>
                            <div className="news-stat-pill">📰 {total} خبر</div>
                        </div>

                        <div className="news-form-body">

                            <div className="news-fields-grid">
                                <div className="news-field">
                                    <label className="news-label">الرقم</label>
                                    <input className="news-inp" value={isNew ? 'تلقائي' : form.id} disabled />
                                </div>
                                <div className="news-field">
                                    <label className="news-label">التاريخ *</label>
                                    <input className="news-inp" type="date" name="date" value={form.date} onChange={handleChange} style={{ direction: 'ltr', textAlign: 'right' }} />
                                </div>

                                {/* ── IsActive toggle — spans full width, sits below date ── */}
                                <div className="news-field" style={{ gridColumn: '1/-1' }}>
                                    <label className="news-label">حالة الظهور</label>
                                    <ActiveToggle
                                        value={form.isActive}
                                        onChange={val => setForm(f => ({ ...f, isActive: val }))}
                                    />
                                </div>

                                <div className="news-field" style={{ gridColumn: '1/-1' }}>
                                    <label className="news-label">عنوان الخبر *</label>
                                    <input className="news-inp" name="title" value={form.title} onChange={handleChange} placeholder="أدخل عنوان الخبر هنا..." />
                                </div>
                            </div>

                            {/* ── Multi Image Upload ── */}
                            <div style={{ marginBottom: 20 }}>
                                <MultiImageUploader images={images} onChange={setImages} />
                            </div>

                            <div className="news-divider" />

                            {/* ── RichTextEditor ── */}
                            <RichTextEditor
                                icon="📝"
                                label="تفاصيل الخبر *"
                                sub="حدد النص أولاً ثم اختر التنسيق من شريط الأدوات — يمكن إضافة روابط للمقالات"
                                name="details"
                                value={form.details}
                                onChange={handleChange}
                                placeholder="أدخل تفاصيل الخبر هنا..."
                                minHeight={200}
                            />

                            <div className="news-actions">
                                <button className="news-act-btn save" onClick={handleSave} disabled={saving}>
                                    {saving ? '⏳ جاري الحفظ...' : '💾 حفظ'}
                                </button>
                                <button className="news-act-btn new" onClick={handleNew} disabled={saving}>➕ خبر جديد</button>
                                <button className="news-act-btn reset" onClick={handleReset} disabled={saving}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNew && (
                                    deleteConfirm ? (
                                        <div className="news-delete-confirm">
                                            <span className="news-delete-warn">⚠️ هل أنت متأكد من حذف هذا الخبر؟</span>
                                            <button className="news-act-btn delete" onClick={handleDelete} disabled={saving}>تأكيد الحذف</button>
                                            <button className="news-act-btn cancel" onClick={() => setDelConf(false)}>إلغاء</button>
                                        </div>
                                    ) : (
                                        <button className="news-act-btn delete" onClick={handleDelete} disabled={saving}>🗑 حذف الخبر</button>
                                    )
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}