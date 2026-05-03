import { useState, useRef, useEffect, useCallback } from "react";

const BASE = "https://acwebsite-icmet-test.azurewebsites.net";

const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
};

const BLANK = { id: 0, date: '', title: '', details: '', image: null, imageUrl: null };

function formatDateAr(dateStr) {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return dateStr; }
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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&display=swap');
.news-root{display:flex;height:100vh;direction:rtl;font-family:"Noto Kufi Arabic",sans-serif;background:${T.gray100};overflow:hidden;}
.news-sidebar{width:clamp(230px,26vw,290px);min-width:230px;background:#fff;display:flex;flex-direction:column;height:100vh;overflow:hidden;flex-shrink:0;border-radius:3px;border:1.5px solid #d0d3d8;box-shadow:0 2px 10px rgba(0,0,0,.06);}
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
.news-list{flex:1;overflow-y:auto;padding:4px 8px 12px;}
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
.news-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
.news-topbar{background:#fff;border-bottom:3px solid ${T.orange};padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:56px;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.06);}
.news-notif{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:3px;font-size:.8rem;font-weight:700;animation:news-notif-in .3s cubic-bezier(.34,1.56,.64,1);border-right:4px solid;margin:14px 24px 0;}
.news-notif-success{background:#f0fdf4;border-color:#16a34a;color:#15803d;}
.news-notif-error{background:#fef2f2;border-color:#dc2626;color:#dc2626;}
.news-notif-info{background:rgba(8,101,168,.06);border-color:${T.blue};color:${T.blue};}
@keyframes news-notif-in{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.news-body{flex:1;overflow-y:auto;padding:20px 24px 48px;}
.news-body::-webkit-scrollbar{width:5px;}
.news-body::-webkit-scrollbar-thumb{background:${T.gray300};border-radius:3px;}
.news-card{background:#fff;border-radius:3px;border:1.5px solid ${T.gray300};overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.06);position:relative;animation:news-card-up .22s ease;}
.news-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to left,${T.orange},${T.blue});z-index:2;}
@keyframes news-card-up{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.news-form-hdr{background:${T.blueDark};padding:20px 26px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;position:relative;overflow:hidden;}
.news-form-hdr::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(245,124,0,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,.07) 1px,transparent 1px);background-size:36px 36px;pointer-events:none;}
.news-form-tag{display:inline-block;background:${T.orange};color:#fff;font-size:.7rem;font-weight:700;padding:4px 14px;border-radius:2px;margin-bottom:6px;position:relative;z-index:1;}
.news-form-title{font-size:1.1rem;font-weight:900;color:#fff;margin:0;position:relative;z-index:1;}
.news-form-sub{font-size:.72rem;color:rgba(255,255,255,.4);margin:4px 0 0;position:relative;z-index:1;}
.news-stat-pill{display:inline-flex;align-items:center;padding:5px 14px;border-radius:2px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);color:rgba(255,255,255,.72);font-size:.72rem;font-weight:700;position:relative;z-index:1;}
.news-form-body{padding:26px;}
.news-fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;margin-bottom:22px;}
.news-field{display:flex;flex-direction:column;gap:5px;}
.news-label{font-size:.72rem;font-weight:700;color:${T.gray700};}
.news-inp{border:1.5px solid ${T.gray300};border-radius:3px;padding:9px 12px;font-size:.8rem;color:${T.black};width:100%;background:#fff;direction:rtl;font-family:inherit;transition:border .18s,box-shadow .18s;outline:none;box-sizing:border-box;}
.news-inp:focus{border-color:${T.orange};box-shadow:0 0 0 3px rgba(245,124,0,.1);}
.news-inp::placeholder{color:${T.gray500};}
.news-inp:disabled{background:${T.gray100};color:${T.gray500};cursor:not-allowed;}
.news-divider{height:1px;background:${T.gray100};margin:4px 0 20px;}

/* ── IMAGE ZONE — full image, no crop, auto height ── */
.news-img-zone{
    width:100%;
    border-radius:6px;
    border:2px dashed ${T.gray300};
    background:${T.gray50};
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    position:relative;
    transition:border-color .18s,background .18s;
    min-height:60px;
    overflow:visible; /* let image define height */
}
.news-img-zone:hover,.news-img-zone.over{border-color:${T.orange};background:rgba(245,124,0,.03);}

.news-img-zone.has-image{
    border-style:solid;
    border-color:${T.gray300};
    border-radius:8px;
    overflow:hidden;  /* clip rounded corners */
    background:#000;
}
.news-img-zone.has-image:hover{ border-color:${T.orange}; }

/* ── Full image — 100% wide, height follows natural aspect ratio, NO crop ── */
.news-img-preview{
    width:100%;
    height:auto;          /* natural height — no fixed px, no crop */
    display:block;
    object-fit:fill;      /* fill = stretch to box, but since height:auto the box = image */
}

/* dim overlay on hover */
.news-img-overlay{
    position:absolute;inset:0;
    background:rgba(0,0,0,.42);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    opacity:0;transition:opacity .2s;
}
.news-img-zone.has-image:hover .news-img-overlay{opacity:1;}
.news-img-overlay-txt{color:#fff;font-size:.78rem;font-weight:700;margin-top:6px;}

.news-img-placeholder{display:flex;flex-direction:column;align-items:center;gap:6px;padding:24px 12px;}
.news-img-icon{font-size:2rem;}
.news-img-hint{color:${T.gray500};font-size:.68rem;font-weight:600;text-align:center;line-height:1.6;}
.news-img-types{color:${T.gray300};font-size:.62rem;background:${T.gray100};padding:2px 10px;border-radius:2px;}

/* meta bar — always visible below image (not hover-only) */
.news-img-meta{
    display:flex;align-items:center;justify-content:space-between;
    padding:6px 12px;
    background:rgba(0,0,0,.6);
    width:100%;
    box-sizing:border-box;
    pointer-events:none;
    position:absolute;
    bottom:0;left:0;right:0;
}
.news-img-meta-txt{color:rgba(255,255,255,.75);font-size:.62rem;font-family:'Courier New',monospace;}

.news-remove-img{
    background:#fef2f2;color:#dc2626;
    border:1.5px solid rgba(220,38,38,.3);
    border-radius:3px;padding:7px;
    font-size:.72rem;font-weight:700;
    cursor:pointer;width:100%;
    font-family:inherit;margin-top:8px;
    transition:background .14s;
}
.news-remove-img:hover{background:#fee2e2;}

.news-ta-block{border-radius:3px;border:1.5px solid ${T.gray300};overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.news-ta-hdr{background:${T.gray50};padding:10px 16px;border-bottom:1.5px solid ${T.gray100};display:flex;align-items:center;gap:9px;}
.news-ta-icon{font-size:1.1rem;}
.news-ta-label{font-weight:800;font-size:.8rem;color:${T.black};flex:1;}
.news-ta-count{background:${T.gray100};border-radius:2px;padding:2px 10px;font-size:.66rem;color:${T.gray700};font-weight:700;}
.news-ta{width:100%;border:none;outline:none;resize:vertical;padding:13px 16px;font-size:.8rem;color:${T.black};font-family:inherit;line-height:1.9;direction:rtl;background:#fff;display:block;transition:background .14s;box-sizing:border-box;}
.news-ta:focus{background:#fffdf9;}
.news-ta::placeholder{color:${T.gray500};}
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

// ── API helpers ──
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

function buildFormData(form, imageFile, isNew) {
    const fd = new FormData();
    fd.append('Id', isNew ? '0' : String(form.id));
    fd.append('Title', form.title || '');
    fd.append('Details', form.details || '');
    fd.append('Date', form.date ? `${form.date}T00:00:00.000Z` : '');
    fd.append('ImageUrl', form.imageUrl && form.imageUrl !== 'N/A' ? form.imageUrl : (imageFile ? 'pending' : 'N/A'));
    if (imageFile) fd.append('Image', imageFile);
    return fd;
}

export default function NewsTab() {
    injectStyles();

    const [news, setNews] = useState([]);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ ...BLANK });
    const [isNew, setIsNew] = useState(false);
    const [search, setSearch] = useState('');
    const [notification, setNotif] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [deleteConfirm, setDelConf] = useState(false);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailL] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [imgNaturalSize, setImgNaturalSize] = useState(null); // { w, h }
    const fileRef = useRef();

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
        setImageFile(null);
        setImgNaturalSize(null);
        if (listItem) {
            setSelected(listItem);
            setForm({ id: listItem.id, title: listItem.title, details: '', date: toInputDate(listItem.publishedAt), imageUrl: listItem.imageUrl, image: null });
            setPreviewSrc(resolveImg(listItem.imageUrl));
        }
        try {
            const item = await apiFetch(`/api/admin/AdminNews/${id}`);
            if (item) {
                const mapped = {
                    id: item.id,
                    title: item.title || '',
                    details: item.details || '',
                    date: toInputDate(item.date || item.publishedAt),
                    imageUrl: item.imageUrl || null,
                };
                setSelected(mapped);
                setForm(mapped);
                setPreviewSrc(resolveImg(item.imageUrl));
            }
        } catch (e) {
            toast('فشل تحميل تفاصيل الخبر', 'error');
        } finally {
            setDetailL(false);
        }
    };

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const applyImage = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setImageFile(file);
        setImgNaturalSize(null);
        const blobUrl = URL.createObjectURL(file);
        setPreviewSrc(blobUrl);
        setForm(f => ({ ...f, imageUrl: null }));
    };

    const handleImgLoad = (e) => {
        setImgNaturalSize({ w: e.target.naturalWidth, h: e.target.naturalHeight });
    };

    // ── Save ──
    const handleSave = async () => {
        if (!form.title.trim()) { toast('عنوان الخبر مطلوب', 'error'); return; }
        if (!form.date) { toast('التاريخ مطلوب', 'error'); return; }
        if (!form.details.trim()) { toast('تفاصيل الخبر مطلوبة', 'error'); return; }

        setSaving(true);
        try {
            const fd = buildFormData(form, imageFile, isNew);
            if (isNew) {
                await apiFetch('/api/admin/AdminNews', { method: 'POST', body: fd });
                toast('تم إضافة الخبر بنجاح');
            } else {
                await apiFetch(`/api/admin/AdminNews/${form.id}`, { method: 'PUT', body: fd });
                toast('تم حفظ التغييرات بنجاح');
            }
            setImageFile(null);
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
        setImageFile(null);
        setPreviewSrc(null);
        setImgNaturalSize(null);
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
        if (isNew) { setForm({ ...BLANK }); setPreviewSrc(null); setImageFile(null); setImgNaturalSize(null); }
        else if (selected) {
            setForm({ ...selected });
            setPreviewSrc(resolveImg(selected.imageUrl));
            setImageFile(null);
            setImgNaturalSize(null);
        }
        setDelConf(false);
        toast('تم إلغاء التغييرات', 'info');
    };

    const filtered = news.filter(n =>
        (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
        formatDateAr(n.publishedAt).includes(search)
    );

    const wordCount = form.details ? form.details.trim().split(/\s+/).filter(Boolean).length : 0;
    const hasImage = !!previewSrc;

    return (
        <div className="news-root">

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
                                {resolveImg(item.imageUrl)
                                    ? <img src={resolveImg(item.imageUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : '📰'}
                            </div>
                            <div className="news-row-info">
                                <div className="news-row-title">{item.title || 'بدون عنوان'}</div>
                                <div className="news-row-date">{formatDateAr(item.publishedAt)}</div>
                            </div>
                            <div className="news-row-id">#{item.id}</div>
                        </div>
                    ))}
                </div>

                <div className="news-sidebar-footer">ICEMT © {new Date().getFullYear()}</div>
            </aside>

            {/* ════ MAIN ════ */}
            <main className="news-main">
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
                                <div className="news-field" style={{ gridColumn: '1/-1' }}>
                                    <label className="news-label">عنوان الخبر *</label>
                                    <input className="news-inp" name="title" value={form.title} onChange={handleChange} placeholder="أدخل عنوان الخبر هنا..." />
                                </div>
                            </div>

                            {/* ── Image upload — full size, contain ── */}
                            <div className="news-field" style={{ marginBottom: 20 }}>
                                <label className="news-label" style={{ marginBottom: 6 }}>
                                    صورة الخبر (اختياري)
                                    {imgNaturalSize && (
                                        <span style={{
                                            marginRight: 8,
                                            background: T.gray100,
                                            color: T.gray500,
                                            fontSize: '.6rem',
                                            fontWeight: 700,
                                            padding: '1px 8px',
                                            borderRadius: 2,
                                            fontFamily: "'Courier New', monospace",
                                        }}>
                                            {imgNaturalSize.w} × {imgNaturalSize.h}
                                        </span>
                                    )}
                                </label>

                                <div
                                    className={`news-img-zone${hasImage ? ' has-image' : ''}${dragOver ? ' over' : ''}`}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); applyImage(e.dataTransfer.files[0]); }}
                                    onClick={() => fileRef.current.click()}
                                >
                                    {hasImage ? (
                                        <>
                                            {/* Full image — auto height, contain */}
                                            <img
                                                src={previewSrc}
                                                alt="معاينة الخبر"
                                                className="news-img-preview"
                                                onLoad={handleImgLoad}
                                            />
                                            {/* Hover overlay */}
                                            <div className="news-img-overlay">
                                                <span style={{ fontSize: '1.8rem' }}>🖼️</span>
                                                <span className="news-img-overlay-txt">اضغط لتغيير الصورة</span>
                                            </div>
                                            {/* Dimensions bar */}
                                            {imgNaturalSize && (
                                                <div className="news-img-meta">
                                                    <span className="news-img-meta-txt">
                                                        {imgNaturalSize.w} × {imgNaturalSize.h} px
                                                    </span>
                                                    <span className="news-img-meta-txt">
                                                        {imageFile
                                                            ? `${(imageFile.size / 1024).toFixed(0)} KB`
                                                            : 'مُحمَّلة من الخادم'}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="news-img-placeholder">
                                            <div className="news-img-icon">🖼️</div>
                                            <span className="news-img-hint">اسحب صورة هنا<br />أو اضغط للاختيار</span>
                                            <span className="news-img-types">JPG · PNG · WEBP</span>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={e => applyImage(e.target.files[0])}
                                />

                                {hasImage && (
                                    <button
                                        className="news-remove-img"
                                        onClick={() => {
                                            setPreviewSrc(null);
                                            setImageFile(null);
                                            setImgNaturalSize(null);
                                            setForm(f => ({ ...f, imageUrl: null }));
                                        }}
                                    >
                                        ✕ حذف الصورة
                                    </button>
                                )}
                            </div>

                            <div className="news-divider" />

                            <div className="news-ta-block">
                                <div className="news-ta-hdr">
                                    <span className="news-ta-icon">📝</span>
                                    <div className="news-ta-label">تفاصيل الخبر *</div>
                                    <span className="news-ta-count">{wordCount} كلمة</span>
                                </div>
                                <textarea
                                    className="news-ta"
                                    name="details"
                                    rows={9}
                                    value={form.details}
                                    onChange={handleChange}
                                    placeholder={"أدخل تفاصيل الخبر هنا...\n\nيمكنك كتابة الخبر بشكل كامل بما يشمل المقدمة، والتفاصيل، والخاتمة."}
                                />
                            </div>

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