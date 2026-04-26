import { useState, useRef } from "react";

/* ─── Design tokens (mirrors T from constants.js) ─── */
const T = {
  orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
  blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
  black: '#0a0a0a', white: '#ffffff',
  gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
  gray500: '#6b7280', gray700: '#374151',
};

/* ─── Initial news data ─── */
const INITIAL_NEWS = [
  {
    id: 7,
    date: '2025-04-15',
    title: 'انطلاق الدورة التدريبية في إدارة المشاريع الدولية',
    details: 'تعلن أكاديمية ICEMT عن انطلاق الدورة التدريبية المتقدمة في إدارة المشاريع الدولية بمشاركة نخبة من الخبراء والمتخصصين في المجال. تهدف الدورة إلى تأهيل الكوادر الهندسية وتزويدهم بأحدث الأساليب والأدوات في إدارة المشاريع الكبرى.',
    image: null,
  },
  {
    id: 6,
    date: '2025-03-28',
    title: 'توقيع بروتوكول تعاون مع جامعة القاهرة',
    details: 'وقّعت أكاديمية ICEMT بروتوكول تعاون مشترك مع كلية الهندسة جامعة القاهرة، يهدف إلى تبادل الخبرات وإقامة برامج تدريبية مشتركة لطلاب الدراسات العليا.',
    image: null,
  },
  {
    id: 5,
    date: '2025-03-10',
    title: 'شهادات إتمام الدورة لدفعة مارس 2025',
    details: 'تم تسليم شهادات إتمام الدورة التدريبية لدفعة مارس 2025 في حفل بسيط أُقيم بمقر الأكاديمية. وقد أعرب المتدربون عن شكرهم على الجهود المبذولة.',
    image: null,
  },
  {
    id: 4,
    date: '2025-02-20',
    title: 'إطلاق برنامج التدريب الإلكتروني الجديد',
    details: 'أطلقت الأكاديمية برنامجها الجديد للتدريب الإلكتروني عبر منصة متطورة تتيح للمتدربين الوصول إلى المحتوى التدريبي من أي مكان وفي أي وقت.',
    image: null,
  },
  {
    id: 3,
    date: '2025-01-15',
    title: 'ندوة: مستقبل البناء الذكي في مصر',
    details: 'نظّمت الأكاديمية ندوة علمية تحت عنوان "مستقبل البناء الذكي في مصر" بمشاركة عدد من الخبراء والأكاديميين المتخصصين في مجال التشييد والبناء.',
    image: null,
  },
];

const BLANK = { id: 0, date: '', title: '', details: '', image: null };

function formatDateAr(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

function previewSnippet(text, len = 55) {
  if (!text) return '—';
  return text.length > len ? text.slice(0, len) + '…' : text;
}

/* ─── Styles (injected once, mirrors adm-* + lec-* pattern) ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&display=swap');
.news-root { display:flex; height:100vh; direction:rtl; font-family:"Noto Kufi Arabic",sans-serif; background:${T.gray100}; overflow:hidden; }

/* sidebar */
.news-sidebar { width:270px; min-width:270px; background:${T.blueDark}; display:flex; flex-direction:column; height:100vh; overflow:hidden; border-left:3px solid ${T.orange}; box-shadow:-4px 0 24px rgba(4,68,120,.35); flex-shrink:0; }
.news-sidebar::before { content:''; position:absolute; top:0; right:0; bottom:0; left:0; pointer-events:none; background-image:linear-gradient(rgba(245,124,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,.05) 1px,transparent 1px); background-size:40px 40px; }
.news-brand { padding:18px 16px 14px; border-bottom:3px solid ${T.orange}; display:flex; align-items:center; gap:10px; background:rgba(0,0,0,.25); flex-shrink:0; position:relative; z-index:1; }
.news-brand-icon { width:38px; height:38px; border-radius:3px; background:${T.orange}; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
.news-brand-name { font-size:.88rem; font-weight:900; color:${T.white}; }
.news-brand-sub  { font-size:.6rem; color:rgba(255,255,255,.4); margin-top:2px; }

/* search */
.news-search-wrap { padding:12px 12px 6px; flex-shrink:0; position:relative; z-index:1; }
.news-search-wrap input { width:100%; padding:9px 34px 9px 12px; background:rgba(255,255,255,.07); border:1.5px solid rgba(255,255,255,.12); border-radius:3px; color:#e2e8f0; font-family:inherit; font-size:.76rem; direction:rtl; outline:none; transition:border .18s; }
.news-search-wrap input::placeholder { color:rgba(255,255,255,.3); }
.news-search-wrap input:focus { border-color:${T.orange}; background:rgba(255,255,255,.1); }
.news-search-icon { position:absolute; right:22px; top:50%; transform:translateY(-50%); font-size:.75rem; opacity:.4; pointer-events:none; }
.news-search-clear { position:absolute; left:20px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:rgba(255,255,255,.4); font-size:1rem; padding:2px; }

/* list header */
.news-list-hdr { padding:4px 14px 8px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; position:relative; z-index:1; }
.news-count-badge { background:rgba(245,124,0,.2); color:${T.orangeLight}; border:1.5px solid rgba(245,124,0,.35); border-radius:2px; padding:1px 9px; font-size:.66rem; font-weight:900; font-family:'Courier New',monospace; }
.news-new-btn { background:rgba(245,124,0,.15); color:${T.orangeLight}; border:1.5px solid rgba(245,124,0,.4); border-radius:2px; padding:4px 14px; font-size:.74rem; font-weight:800; cursor:pointer; font-family:inherit; transition:all .16s; }
.news-new-btn:hover { background:rgba(245,124,0,.25); }

/* list */
.news-list { flex:1; overflow-y:auto; padding:4px 8px 12px; position:relative; z-index:1; }
.news-list::-webkit-scrollbar { width:4px; }
.news-list::-webkit-scrollbar-thumb { background:rgba(245,124,0,.35); border-radius:2px; }

/* row */
.news-row { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:3px; margin-bottom:3px; cursor:pointer; border:1.5px solid transparent; transition:background .13s, border-color .13s; }
.news-row:hover  { background:rgba(8,101,168,.08); border-color:rgba(8,101,168,.15); }
.news-row.active { background:rgba(245,124,0,.12); border-color:rgba(245,124,0,.4); border-right:3px solid ${T.orange}; }
.news-row-icon { width:38px; height:38px; border-radius:3px; background:linear-gradient(135deg,${T.blue},${T.blueLight}); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; border:1.5px solid rgba(8,101,168,.3); }
.news-row-info { overflow:hidden; flex:1; }
.news-row-title { color:#e2e8f0; font-size:.75rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.news-row-date  { color:rgba(255,255,255,.35); font-size:.63rem; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.news-row-id    { background:rgba(255,255,255,.07); color:rgba(255,255,255,.35); font-size:.6rem; padding:2px 7px; border-radius:2px; flex-shrink:0; font-weight:700; font-family:'Courier New',monospace; }

/* sidebar footer */
.news-sidebar-footer { padding:10px 14px; border-top:1.5px solid rgba(245,124,0,.18); text-align:center; font-size:.6rem; color:rgba(255,255,255,.22); background:rgba(0,0,0,.2); flex-shrink:0; position:relative; z-index:1; }

/* ── main ── */
.news-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }

/* topbar */
.news-topbar { background:${T.white}; border-bottom:3px solid ${T.orange}; padding:0 28px; display:flex; align-items:center; justify-content:space-between; height:56px; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,.06); }
.news-topbar-bc { display:flex; align-items:center; gap:7px; font-size:.78rem; }
.news-topbar-bc .sep { color:${T.gray300}; }
.news-topbar-bc .cur { color:${T.black}; font-weight:800; }
.news-topbar-bc .dim { color:${T.gray300}; }
.news-meta-pills { display:flex; gap:8px; align-items:center; }
.news-pill { border-radius:2px; padding:4px 13px; font-size:.7rem; font-weight:700; }
.news-pill.green { background:#f0fdf4; border:1px solid #86efac; color:#15803d; }
.news-pill.blue  { background:rgba(8,101,168,.08); border:1px solid rgba(8,101,168,.3); color:${T.blue}; }
.news-pill.or    { background:rgba(245,124,0,.08); border:1px solid rgba(245,124,0,.3); color:${T.orange}; }

/* notification */
.news-notif { display:flex; align-items:center; gap:10px; padding:11px 16px; border-radius:3px; font-size:.8rem; font-weight:700; animation:news-notif-in .3s cubic-bezier(.34,1.56,.64,1); border-right:4px solid; margin:14px 24px 0; }
.news-notif-success { background:#f0fdf4; border-color:#16a34a; color:#15803d; }
.news-notif-error   { background:#fef2f2; border-color:#dc2626; color:#dc2626; }
.news-notif-info    { background:rgba(8,101,168,.06); border-color:${T.blue}; color:${T.blue}; }
@keyframes news-notif-in { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }

/* scrollable body */
.news-body { flex:1; overflow-y:auto; padding:20px 24px 48px; }
.news-body::-webkit-scrollbar { width:5px; }
.news-body::-webkit-scrollbar-thumb { background:${T.gray300}; border-radius:3px; }

/* card */
.news-card { background:${T.white}; border-radius:3px; border:1.5px solid ${T.gray300}; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.06); position:relative; animation:news-card-up .22s ease; }
.news-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to left,${T.orange},${T.blue}); z-index:2; }
@keyframes news-card-up { from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);} }

/* card header */
.news-form-hdr { background:${T.blueDark}; padding:20px 26px; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; position:relative; overflow:hidden; }
.news-form-hdr::before { content:''; position:absolute; inset:0; background-image:linear-gradient(rgba(245,124,0,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,.07) 1px,transparent 1px); background-size:36px 36px; pointer-events:none; }
.news-form-tag { display:inline-block; background:${T.orange}; color:${T.white}; font-size:.7rem; font-weight:700; padding:4px 14px; border-radius:2px; margin-bottom:6px; position:relative; z-index:1; }
.news-form-title { font-size:1.1rem; font-weight:900; color:${T.white}; margin:0; position:relative; z-index:1; }
.news-form-sub   { font-size:.72rem; color:rgba(255,255,255,.4); margin:4px 0 0; position:relative; z-index:1; }
.news-stat-pill  { display:inline-flex; align-items:center; padding:5px 14px; border-radius:2px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.15); color:rgba(255,255,255,.72); font-size:.72rem; font-weight:700; position:relative; z-index:1; }

/* card body */
.news-form-body { padding:26px; }

/* fields */
.news-fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px 20px; margin-bottom:22px; }
.news-field { display:flex; flex-direction:column; gap:5px; }
.news-label { font-size:.72rem; font-weight:700; color:${T.gray700}; }
.news-inp { border:1.5px solid ${T.gray300}; border-radius:3px; padding:9px 12px; font-size:.8rem; color:${T.black}; width:100%; background:${T.white}; direction:rtl; font-family:inherit; transition:border .18s, box-shadow .18s; outline:none; }
.news-inp:focus { border-color:${T.orange}; box-shadow:0 0 0 3px rgba(245,124,0,.1); }
.news-inp::placeholder { color:${T.gray500}; }
.news-inp:disabled { background:${T.gray100}; color:${T.gray500}; cursor:not-allowed; }

/* divider */
.news-divider { height:1px; background:${T.gray100}; margin:4px 0 20px; }

/* image upload */
.news-img-zone { width:100%; min-height:130px; border-radius:3px; border:2px dashed ${T.gray300}; background:${T.gray50}; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; overflow:hidden; position:relative; transition:border-color .18s, background .18s; }
.news-img-zone:hover, .news-img-zone.over { border-color:${T.orange}; background:rgba(245,124,0,.04); }
.news-img-preview { width:100%; height:130px; object-fit:cover; display:block; }
.news-img-overlay { position:absolute; inset:0; background:rgba(0,0,0,.5); display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
.news-img-zone:hover .news-img-overlay { opacity:1; }
.news-img-overlay-txt { color:${T.white}; font-size:.72rem; font-weight:700; margin-top:4px; }
.news-img-placeholder { display:flex; flex-direction:column; align-items:center; gap:6px; padding:20px 12px; }
.news-img-icon  { font-size:2rem; }
.news-img-hint  { color:${T.gray500}; font-size:.68rem; font-weight:600; text-align:center; line-height:1.6; }
.news-img-types { color:${T.gray300}; font-size:.62rem; background:${T.gray100}; padding:2px 10px; border-radius:2px; }
.news-remove-img { background:#fef2f2; color:#dc2626; border:1.5px solid rgba(220,38,38,.3); border-radius:2px; padding:6px; font-size:.72rem; font-weight:700; cursor:pointer; width:100%; font-family:inherit; margin-top:6px; transition:background .14s; }
.news-remove-img:hover { background:#fee2e2; }

/* details textarea block */
.news-ta-block { border-radius:3px; border:1.5px solid ${T.gray300}; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.04); }
.news-ta-hdr   { background:${T.gray50}; padding:10px 16px; border-bottom:1.5px solid ${T.gray100}; display:flex; align-items:center; gap:9px; }
.news-ta-icon  { font-size:1.1rem; }
.news-ta-label { font-weight:800; font-size:.8rem; color:${T.black}; flex:1; }
.news-ta-count { background:${T.gray100}; border-radius:2px; padding:2px 10px; font-size:.66rem; color:${T.gray700}; font-weight:700; }
.news-ta { width:100%; border:none; outline:none; resize:vertical; padding:13px 16px; font-size:.8rem; color:${T.black}; font-family:inherit; line-height:1.9; direction:rtl; background:${T.white}; display:block; transition:background .14s; }
.news-ta:focus { background:#fffdf9; }
.news-ta::placeholder { color:${T.gray500}; }

/* actions */
.news-actions { display:flex; gap:9px; margin-top:24px; padding-top:18px; border-top:2px solid ${T.gray100}; flex-wrap:wrap; align-items:center; }
.news-act-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; border-radius:3px; font-family:inherit; font-size:.8rem; font-weight:800; cursor:pointer; border:none; transition:all .2s cubic-bezier(.4,0,.2,1); white-space:nowrap; }
.news-act-btn:hover  { transform:translateY(-2px); }
.news-act-btn:active { transform:translateY(0); }
.news-act-btn.save   { background:#16a34a; color:${T.white}; box-shadow:0 3px 12px rgba(22,163,74,.3); }
.news-act-btn.save:hover   { background:#15803d; }
.news-act-btn.new    { background:${T.blue}; color:${T.white}; box-shadow:0 3px 12px rgba(8,101,168,.3); }
.news-act-btn.new:hover    { background:${T.blueDark}; }
.news-act-btn.reset  { background:${T.orange}; color:${T.white}; box-shadow:0 3px 12px rgba(245,124,0,.3); }
.news-act-btn.reset:hover  { background:${T.orangeDark}; }
.news-act-btn.delete { background:#dc2626; color:${T.white}; box-shadow:0 3px 12px rgba(220,38,38,.3); }
.news-act-btn.delete:hover { background:#b91c1c; }
.news-delete-confirm { display:flex; align-items:center; gap:10px; flex-wrap:wrap; background:#fef2f2; border:1.5px solid rgba(220,38,38,.3); border-radius:3px; padding:9px 14px; border-right:4px solid #dc2626; }
.news-delete-warn { font-size:.78rem; color:#dc2626; font-weight:700; }
.news-act-btn.cancel { background:${T.gray100}; color:${T.gray500}; border:1.5px solid ${T.gray300}; box-shadow:none; }
.news-act-btn.cancel:hover { border-color:${T.black}; color:${T.black}; }

/* empty */
.news-empty { text-align:center; padding:60px 20px; color:${T.gray500}; }
.news-empty-icon { font-size:2.4rem; margin-bottom:12px; opacity:.35; }

@media(max-width:900px) {
  .news-root { flex-direction:column; }
  .news-sidebar { width:100%; height:auto; max-height:280px; }
  .news-fields-grid { grid-template-columns:1fr; }
}
`;

function injectStyles() {
  if (document.getElementById('news-tab-styles')) return;
  const el = document.createElement('style');
  el.id = 'news-tab-styles';
  el.textContent = CSS;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function NewsTab() {
  injectStyles();

  const [news, setNews]             = useState(INITIAL_NEWS);
  const [selected, setSelected]     = useState(INITIAL_NEWS[0]);
  const [form, setForm]             = useState({ ...INITIAL_NEWS[0] });
  const [isNew, setIsNew]           = useState(false);
  const [search, setSearch]         = useState('');
  const [notification, setNotif]    = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const [deleteConfirm, setDelConf] = useState(false);
  const fileRef = useRef();

  const filtered = news.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    formatDateAr(n.date).includes(search)
  );

  const toast = (msg, type = 'success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  };

  const pick = (item) => {
    setSelected(item);
    setForm({ ...item });
    setIsNew(false);
    setDelConf(false);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const applyImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, image: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast('عنوان الخبر مطلوب', 'error'); return; }
    if (!form.date)         { toast('التاريخ مطلوب', 'error'); return; }
    if (!form.details.trim()) { toast('تفاصيل الخبر مطلوبة', 'error'); return; }

    if (isNew) {
      const newId = Math.max(0, ...news.map(n => n.id)) + 1;
      const newItem = { ...form, id: newId };
      setNews(prev => [newItem, ...prev]);
      setSelected(newItem);
      setForm({ ...newItem });
      setIsNew(false);
      toast('تم إضافة الخبر بنجاح');
    } else {
      const updated = { ...form };
      setNews(prev => prev.map(n => n.id === updated.id ? updated : n));
      setSelected(updated);
      toast('تم حفظ التغييرات بنجاح');
    }
  };

  const handleNew = () => {
    setForm({ ...BLANK });
    setSelected(null);
    setIsNew(true);
    setDelConf(false);
  };

  const handleDelete = () => {
    if (!deleteConfirm) { setDelConf(true); return; }
    const rest = news.filter(n => n.id !== selected.id);
    setNews(rest);
    setDelConf(false);
    if (rest.length) pick(rest[0]); else handleNew();
    toast('تم حذف الخبر', 'error');
  };

  const handleReset = () => {
    if (isNew) setForm({ ...BLANK }); else setForm({ ...selected });
    setDelConf(false);
    toast('تم إلغاء التغييرات', 'info');
  };

  const wordCount = form.details
    ? form.details.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="news-root">

      {/* ════ SIDEBAR ════ */}
      <aside className="news-sidebar">

        {/* Brand */}
        <div className="news-brand">
          <div className="news-brand-icon">📰</div>
          <div>
            <div className="news-brand-name">ICEMT</div>
            <div className="news-brand-sub">إدارة الأخبار</div>
          </div>
        </div>

        {/* Search */}
        <div className="news-search-wrap" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="بحث بالعنوان أو التاريخ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="news-search-icon">🔍</span>
          {search && (
            <button className="news-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* List header */}
        <div className="news-list-hdr">
          <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '.68rem', fontWeight: 700 }}>
            الأخبار &nbsp;
            <span className="news-count-badge">{filtered.length}</span>
          </span>
          <button className="news-new-btn" onClick={handleNew}>+ جديد</button>
        </div>

        {/* News list */}
        <div className="news-list">
          {filtered.length === 0 && (
            <div className="news-empty" style={{ padding: '32px 12px' }}>
              <div className="news-empty-icon">🔍</div>
              <p style={{ fontSize: '.74rem' }}>لا توجد نتائج</p>
            </div>
          )}
          {filtered.map(item => (
            <div
              key={item.id}
              className={`news-row${selected?.id === item.id ? ' active' : ''}`}
              onClick={() => pick(item)}
            >
              <div className="news-row-icon">
                {item.image
                  ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }} />
                  : '📰'
                }
              </div>
              <div className="news-row-info">
                <div className="news-row-title">{item.title || 'بدون عنوان'}</div>
                <div className="news-row-date">{formatDateAr(item.date)}</div>
              </div>
              <div className="news-row-id">#{item.id}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="news-sidebar-footer">ICEMT © {new Date().getFullYear()}</div>
      </aside>

      {/* ════ MAIN ════ */}
      <main className="news-main">

      

        {/* Notification */}
        {notification && (
          <div className={`news-notif news-notif-${notification.type}`}>
            <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
            {notification.msg}
          </div>
        )}

        {/* Scrollable body */}
        <div className="news-body">
          <div className="news-card">

            {/* Card header */}
            <div className="news-form-hdr">
              <div>
                <div className="news-form-tag">{isNew ? 'خبر جديد' : `ID: #${selected?.id}`}</div>
                <h2 className="news-form-title">
                  {isNew ? '➕ إضافة خبر جديد' : '✏️ تعديل بيانات الخبر'}
                </h2>
                {!isNew && selected && (
                  <p className="news-form-sub">{previewSnippet(selected.title, 60)}</p>
                )}
              </div>
              <div className="news-stat-pill">📰 {news.length} خبر</div>
            </div>

            {/* Card body */}
            <div className="news-form-body">

              {/* ── Fields grid ── */}
              <div className="news-fields-grid">

                {/* الرقم — auto */}
                <div className="news-field">
                  <label className="news-label">الرقم</label>
                  <input
                    className="news-inp"
                    value={isNew ? 'تلقائي' : form.id}
                    disabled
                  />
                </div>

                {/* التاريخ */}
                <div className="news-field">
                  <label className="news-label">التاريخ *</label>
                  <input
                    className="news-inp"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    style={{ direction: 'ltr', textAlign: 'right' }}
                  />
                </div>

                {/* عنوان الخبر — full width */}
                <div className="news-field" style={{ gridColumn: '1/-1' }}>
                  <label className="news-label">عنوان الخبر *</label>
                  <input
                    className="news-inp"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="أدخل عنوان الخبر هنا..."
                  />
                </div>
              </div>

              {/* ── Image upload ── */}
              <div className="news-field" style={{ marginBottom: 20 }}>
                <label className="news-label">صورة الخبر (اختياري)</label>
                <div
                  className={`news-img-zone${dragOver ? ' over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); applyImage(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current.click()}
                >
                  {form.image ? (
                    <>
                      <img src={form.image} alt="خبر" className="news-img-preview" />
                      <div className="news-img-overlay">
                        <span style={{ fontSize: '1.6rem' }}>🖼️</span>
                        <span className="news-img-overlay-txt">تغيير الصورة</span>
                      </div>
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
                  ref={fileRef} type="file" accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => applyImage(e.target.files[0])}
                />
                {form.image && (
                  <button className="news-remove-img" onClick={() => setForm(f => ({ ...f, image: null }))}>
                    ✕ حذف الصورة
                  </button>
                )}
              </div>

              <div className="news-divider" />

              {/* ── Details textarea ── */}
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

              {/* ── Actions ── */}
              <div className="news-actions">
                <button className="news-act-btn save" onClick={handleSave}>💾 حفظ</button>
                <button className="news-act-btn new" onClick={handleNew}>➕ خبر جديد</button>
                <button className="news-act-btn reset" onClick={handleReset}>↩ إلغاء</button>

                <div style={{ flex: 1 }} />

                {!isNew && (
                  deleteConfirm ? (
                    <div className="news-delete-confirm">
                      <span className="news-delete-warn">⚠️ هل أنت متأكد من حذف هذا الخبر؟</span>
                      <button className="news-act-btn delete" onClick={handleDelete}>تأكيد الحذف</button>
                      <button className="news-act-btn cancel" onClick={() => setDelConf(false)}>إلغاء</button>
                    </div>
                  ) : (
                    <button className="news-act-btn delete" onClick={handleDelete}>🗑 حذف الخبر</button>
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