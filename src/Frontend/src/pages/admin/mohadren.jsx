// src/components/admin/tabs/LecturersTab.jsx
import React, { useState, useRef, useCallback } from 'react';
import { T } from "../../components/admin/constants";

// ── Initial data ──────────────────────────────────────────────────────────────
const INITIAL_LECTURERS = [
    {
        id: 41, name: 'د.م / عمرو رمضان محمد المنياوي', specialty: 'إدارة الأزمات والمخاطر',
        email: 'dr_amrelminyawy@yahoo.com', phone: '01012345678',
        courses: 'بكالوريوس الهندسة - دكتوراه في إدارة الأزمات والمخاطر',
        level: 'دكتوراه في إدارة الأزمات والمخاطر',
        certificates: 'حاصل على بكالوريوس الهندسة – قسم ميكانيكا شعبه عامة\nحاصل على درجة الماجستير بتقدير - عام امتياز\nحاصل على درجة الدكتوراه في إدارة الأزمات والمخاطر جامعة القاهرة\nمؤلف كتاب إدارة الأزمات ومخاطر المشروعات',
        details: 'أشراف على مشاريع وزارة الشباب والرياضة – المركز الأولمبي\nأشراف على مستشفى القاهرة الجديد\nأشراف على مشاريع وزارة الصحة 6 أكتوبر الدقي\nأشراف على مشاريع وزاره الآثار كنيسة ماري جرجس',
        photo: null,
    },
    { id: 40, name: 'Abd ElAzim Yasen Idries', specialty: 'Engineering Management', email: 'abdelazim@icemt.com', phone: '', courses: 'Bachelor of Engineering', level: 'PhD Engineering', certificates: '', details: '', photo: null },
    { id: 39, name: 'حسن محمد مصطفى فرج', specialty: 'الهندسة الإنشائية', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
    { id: 38, name: 'Dr. Abdallah Mostafa', specialty: 'Project Management – PMP', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
    { id: 37, name: 'أ. أمل صفوت', specialty: 'إدارة الأعمال', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
    { id: 36, name: 'أ. عماد رمضان الحق', specialty: 'الهندسة المدنية', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
    { id: 35, name: 'م. زكريا عبد الحميد محمد', specialty: 'التخطيط العمراني', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
    { id: 34, name: 'د. م. شريف الهجان', specialty: 'إدارة المشاريع', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
    { id: 33, name: 'احمد بهاء الدين السيد احمد', specialty: 'الهندسة المعمارية', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
    { id: 32, name: 'مهدي عبد النور مهدي سعيد', specialty: 'إدارة التشييد', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null },
];

const BLANK = { id: 0, name: '', specialty: '', email: '', phone: '', courses: '', level: '', certificates: '', details: '', photo: null };

function initials(name = '') {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '؟';
}

// ── Textarea sub-component ─────────────────────────────────────────────────────
function LecTextArea({ icon, label, sub, name, value, onChange, placeholder, rows }) {
    const count = value ? value.split('\n').filter(l => l.trim()).length : 0;
    return (
        <div className="lec-textarea-block">
            <div className="lec-textarea-hdr">
                <span className="lec-textarea-icon">{icon}</span>
                <div style={{ flex: 1 }}>
                    <div className="lec-textarea-label">{label}</div>
                    {sub && <div className="lec-textarea-sub">{sub}</div>}
                </div>
                <span className="lec-textarea-count">{count} بنود</span>
            </div>
            <textarea
                name={name} value={value} onChange={onChange}
                placeholder={placeholder} rows={rows}
                className="lec-textarea"
            />
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────
const LecturersTab = () => {
    const [lecturers, setLecturers] = useState(INITIAL_LECTURERS);
    const [selected, setSelected] = useState(INITIAL_LECTURERS[0]);
    const [form, setForm] = useState({ ...INITIAL_LECTURERS[0] });
    const [isNew, setIsNew] = useState(false);
    const [search, setSearch] = useState('');
    const [notification, setNotification] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const fileRef = useRef();

    const filtered = lecturers.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.specialty.toLowerCase().includes(search.toLowerCase())
    );

    const toast = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const pick = (lec) => {
        setSelected(lec); setForm({ ...lec });
        setIsNew(false); setDeleteConfirm(false);
    };

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const applyPhoto = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = e => setForm(f => ({ ...f, photo: e.target.result }));
        reader.readAsDataURL(file);
    }, []);

    const handleSave = () => {
        if (!form.name.trim()) { toast('الاسم مطلوب', 'error'); return; }
        if (isNew) {
            const newId = Math.max(0, ...lecturers.map(l => l.id)) + 1;
            const newLec = { ...form, id: newId };
            setLecturers(prev => [newLec, ...prev]);
            setSelected(newLec); setForm({ ...newLec }); setIsNew(false);
            toast('تم إضافة المحاضر بنجاح');
        } else {
            const updated = { ...form };
            setLecturers(prev => prev.map(l => l.id === updated.id ? updated : l));
            setSelected(updated);
            toast('تم حفظ التغييرات بنجاح');
        }
    };

    const handleNew = () => {
        setForm({ ...BLANK }); setSelected(null);
        setIsNew(true); setDeleteConfirm(false);
    };

    const handleDelete = () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        const rest = lecturers.filter(l => l.id !== selected.id);
        setLecturers(rest); setDeleteConfirm(false);
        if (rest.length) pick(rest[0]); else handleNew();
        toast('تم حذف المحاضر', 'error');
    };

    const handleReset = () => {
        if (isNew) setForm({ ...BLANK }); else setForm({ ...selected });
        setDeleteConfirm(false);
        toast('تم إلغاء التغييرات', 'info');
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Notification */}
            {notification && (
                <div className={`lec-notif lec-notif-${notification.type}`} style={{ marginBottom: 12 }}>
                    <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {notification.msg}
                </div>
            )}

            <div className="lec-layout">

                {/* ══ LEFT PANEL — list ══ */}
                <div className="lec-panel">

                    {/* Header */}
                    <div className="lec-panel-hdr">
                        <span className="lec-count-badge">{filtered.length}</span>
                        <span style={{ fontWeight: 800, fontSize: '.8rem', color: '#0a0a0a', flex: 1, textAlign: 'center' }}>
                            المحاضرون
                        </span>
                        <button className="lec-new-btn" onClick={handleNew}>+ جديد</button>
                    </div>

                    {/* Search */}
                    <div style={{ padding: '10px 10px 6px', position: 'relative' }}>
                        <div className="adm-search" style={{ minWidth: 'unset' }}>
                            <input
                                type="text"
                                placeholder="بحث بالاسم أو التخصص..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ fontSize: '.76rem' }}
                            />
                            {search && (
                                <button
                                    className="lec-search-clear"
                                    onClick={() => setSearch('')}
                                >✕</button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="lec-list">
                        {filtered.length === 0 && (
                            <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                <div className="adm-emi">🔍</div>
                                <p>لا توجد نتائج</p>
                            </div>
                        )}
                        {filtered.map(lec => (
                            <div
                                key={lec.id}
                                className={`lec-row${selected?.id === lec.id ? ' active' : ''}`}
                                onClick={() => pick(lec)}
                            >
                                <div className="lec-avatar">
                                    {lec.photo
                                        ? <img src={lec.photo} alt="" />
                                        : <span>{initials(lec.name)}</span>
                                    }
                                </div>
                                <div className="lec-row-info">
                                    <div className="lec-row-name">{lec.name || 'بدون اسم'}</div>
                                    <div className="lec-row-spec">{lec.specialty || '—'}</div>
                                </div>
                                <div className="lec-row-id">#{lec.id}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══ FORM AREA ══ */}
                <div className="lec-form-wrap">
                    <div className="adm-card lec-form-card">

                        {/* Card header */}
                        <div className="lec-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
                                    {isNew ? 'محاضر جديد' : `ID: #${selected?.id}`}
                                </div>
                                <h2 className="lec-form-title">
                                    {isNew ? '➕ إضافة محاضر جديد' : '✏️ تعديل بيانات المحاضر'}
                                </h2>
                                {!isNew && selected && (
                                    <p className="lec-form-sub">{selected.name}</p>
                                )}
                            </div>
                            <div className="lec-stat-pill">
                                📋 {lecturers.length} محاضر
                            </div>
                        </div>

                        <div className="lec-form-body">

                            {/* Photo + fields */}
                            <div className="lec-top-row">

                                {/* Photo */}
                                <div className="lec-photo-col">
                                    <label className="lec-label">صورة المحاضر</label>
                                    <div
                                        className={`lec-photo-zone${dragOver ? ' over' : ''}`}
                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={e => { e.preventDefault(); setDragOver(false); applyPhoto(e.dataTransfer.files[0]); }}
                                        onClick={() => fileRef.current.click()}
                                    >
                                        {form.photo ? (
                                            <>
                                                <img src={form.photo} alt="محاضر" className="lec-photo-img" />
                                                <div className="lec-photo-overlay">
                                                    <span style={{ fontSize: '1.6rem' }}>📷</span>
                                                    <span className="lec-photo-overlay-txt">تغيير الصورة</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="lec-photo-placeholder">
                                                <div className="lec-photo-icon">👤</div>
                                                <span className="lec-photo-hint">اسحب صورة هنا<br />أو اضغط للاختيار</span>
                                                <span className="lec-photo-types">JPG · PNG · WEBP</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileRef} type="file" accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={e => applyPhoto(e.target.files[0])}
                                    />
                                    {form.photo && (
                                        <button className="lec-remove-photo" onClick={() => setForm(f => ({ ...f, photo: null }))}>
                                            ✕ حذف الصورة
                                        </button>
                                    )}
                                </div>

                                {/* Fields grid */}
                                <div className="lec-fields-grid">
                                    <div className="lec-field">
                                        <label className="lec-label">الرقم</label>
                                        <input
                                            className="lec-inp"
                                            value={isNew ? 'تلقائي' : form.id}
                                            disabled
                                            style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">الاسم الكامل *</label>
                                        <input className="lec-inp" name="name" value={form.name} onChange={handleChange} placeholder="د. / م. / أ. الاسم الكامل..." />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">التخصص</label>
                                        <input className="lec-inp" name="specialty" value={form.specialty} onChange={handleChange} placeholder="مجال التخصص الرئيسي..." />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">الكورسات والمؤهلات</label>
                                        <input className="lec-inp" name="courses" value={form.courses} onChange={handleChange} placeholder="المؤهلات العلمية..." />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">رقم الهاتف</label>
                                        <input className="lec-inp" name="phone" value={form.phone} onChange={handleChange} placeholder="01xxxxxxxxx" style={{ direction: 'ltr', textAlign: 'right' }} />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">البريد الإلكتروني</label>
                                        <input className="lec-inp" name="email" value={form.email} onChange={handleChange} placeholder="example@domain.com" style={{ direction: 'ltr', textAlign: 'right' }} />
                                    </div>
                                    <div className="lec-field" style={{ gridColumn: '1/-1' }}>
                                        <label className="lec-label">المستوى العلمي</label>
                                        <input className="lec-inp" name="level" value={form.level} onChange={handleChange} placeholder="بكالوريوس / ماجستير / دكتوراه في ..." />
                                    </div>
                                </div>
                            </div>

                            <div className="lec-divider" />

                            <LecTextArea
                                icon="🎓" label="الشهادات والمؤهلات" sub="كل شهادة في سطر مستقل"
                                name="certificates" value={form.certificates} onChange={handleChange}
                                placeholder={'مثال:\nحاصل على بكالوريوس الهندسة – قسم ميكانيكا\nحاصل على درجة الماجستير بتقدير امتياز\nحاصل على درجة الدكتوراه – جامعة القاهرة'}
                                rows={5}
                            />

                            <LecTextArea
                                icon="📋" label="التفاصيل والخبرات العملية" sub="المشاريع والإنجازات والخبرات"
                                name="details" value={form.details} onChange={handleChange}
                                placeholder={'مثال:\nأشراف على مشاريع وزارة الشباب والرياضة\nأشراف على مستشفى القاهرة الجديد\nمبنى مشروع تطوير معمار العرفة'}
                                rows={6}
                            />

                            {/* Actions */}
                            <div className="lec-actions">
                                <button className="lec-act-btn save" onClick={handleSave}>💾 حفظ</button>
                                <button className="lec-act-btn new" onClick={handleNew}>➕ محاضر جديد</button>
                                <button className="lec-act-btn reset" onClick={handleReset}>↩ إلغاء</button>

                                <div style={{ flex: 1 }} />

                                {!isNew && (
                                    deleteConfirm ? (
                                        <div className="lec-delete-confirm">
                                            <span className="lec-delete-warn">⚠️ هل أنت متأكد من الحذف؟</span>
                                            <button className="lec-act-btn delete" onClick={handleDelete}>تأكيد الحذف</button>
                                            <button className="adm-fclear" onClick={() => setDeleteConfirm(false)}>إلغاء</button>
                                        </div>
                                    ) : (
                                        <button className="lec-act-btn delete" onClick={handleDelete}>🗑 حذف المحاضر</button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LecturersTab;