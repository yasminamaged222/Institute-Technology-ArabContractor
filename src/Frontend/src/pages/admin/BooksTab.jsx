// src/components/admin/tabs/BooksTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Books management — fully integrated into the admin dashboard architecture.
// Same adm-* CSS class system, same lec-* / news-* pattern for tab-specific
// classes (prefix: bk-). Two sub-pages: Books and Book Types, switched via
// inner nav tabs — identical pattern to the standalone books app but wired
// into the admin shell (no own sidebar/topbar, those come from the shell).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import { T } from "../../components/admin/constants";

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_BOOK_TYPES = [
    { id: 18, name: 'التحكيم' },
    { id: 15, name: 'هندسة الطرق' },
    { id: 14, name: 'الهندسة الكهربائية والميكانيكية' },
    { id: 13, name: 'الهندسة الهيدروليكية' },
    { id: 12, name: 'الهندسة المعمارية' },
    { id: 11, name: 'الهندسة المدنية' },
    { id: 10, name: 'الهندسة الصحية' },
    { id: 9, name: 'المواصفات القياسية' },
    { id: 8, name: 'المحاسبة واعمال المكاتب' },
    { id: 7, name: 'المبانى' },
];

const INITIAL_BOOKS = [
    { id: 869, name: 'CESMM3 handbook', author: 'Barnes, Martin', year: '2019', publisher: 'Thomas Telford', isbn: '978-0-7277-1975-6', category: 'الهندسة المدنية', summary: 'دليل شامل لطريقة قياس العمل الهندسي المدني الإصدار الثالث\nيُستخدم على نطاق واسع في تقدير تكاليف المشاريع المدنية\nمرجع أساسي لمهندسي التشييد والمقدرين', notes: 'الطبعة المعتمدة في مشاريع وزارة الإسكان\nمتوفرة نسخة إلكترونية PDF', cover: null },
    { id: 868, name: 'CESMM3 examples', author: 'Barnes, Martin', year: '2018', publisher: 'Thomas Telford', isbn: '978-0-7277-1976-3', category: 'الهندسة المدنية', summary: 'أمثلة تطبيقية على طريقة CESMM3 لقياس الأعمال الهندسية\nيتضمن حالات دراسية من مشاريع حقيقية', notes: 'يُستخدم مع CESMM3 handbook كمرجع مكمل', cover: null },
    { id: 867, name: 'Construction safety management', author: 'Levitt, Raymond', year: '2017', publisher: 'Wiley', isbn: '978-0-471-35062-9', category: 'المواصفات القياسية', summary: 'إدارة السلامة في مشاريع التشييد والبناء\nيغطي المبادئ الأساسية للسلامة المهنية في البيئات الإنشائية', notes: 'مرجع معتمد في برامج OSHA', cover: null },
    { id: 866, name: 'كيف تتقن فن القراءة السريعة', author: 'روزاكس، د.لورى', year: '2016', publisher: 'دار الفكر العربي', isbn: '978-977-XXXX-XX-X', category: 'المحاسبة واعمال المكاتب', summary: 'يشرح تقنيات القراءة السريعة مع الفهم الكامل\nأساليب عملية لتحسين سرعة القراءة والاستيعاب', notes: 'مترجم إلى العربية من الطبعة الأصلية الإنجليزية', cover: null },
    { id: 865, name: 'Site remediation: planning and management', author: 'Soesilo, J. Andy', year: '2015', publisher: 'CRC Press', isbn: '978-0-873-71683-5', category: 'الهندسة الصحية', summary: 'تخطيط وإدارة معالجة المواقع الملوثة\nيتناول الأساليب الحديثة في تأهيل المواقع البيئية', notes: 'مرجع تقني متخصص في المعالجة البيئية', cover: null },
];

const BLANK_BOOK = { id: 0, name: '', author: '', year: '', publisher: '', isbn: '', category: '', summary: '', notes: '', cover: null };
const BLANK_TYPE = { id: 0, name: '' };

function countLines(val) {
    return val ? val.split('\n').filter(l => l.trim()).length : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover upload zone — same pattern as lec-photo-zone / news-img-zone
// ─────────────────────────────────────────────────────────────────────────────
function CoverZone({ cover, onCoverChange, onCoverRemove }) {
    const fileRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    function applyImage(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const r = new FileReader();
        r.onload = e => onCoverChange(e.target.result);
        r.readAsDataURL(file);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
                className={`bk-cover-zone${dragOver ? ' over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); applyImage(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current.click()}
            >
                {cover ? (
                    <>
                        <img src={cover} alt="غلاف" className="bk-cover-img" />
                        <div className="bk-cover-overlay">
                            <span style={{ fontSize: '1.4rem' }}>📷</span>
                            <span className="bk-cover-overlay-txt">تغيير الغلاف</span>
                        </div>
                    </>
                ) : (
                    <div className="bk-cover-placeholder">
                        <div className="bk-cover-icon">📖</div>
                        <span className="bk-cover-hint">اسحب صورة هنا<br />أو اضغط للاختيار</span>
                        <span className="bk-cover-types">JPG · PNG · WEBP</span>
                    </div>
                )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => applyImage(e.target.files[0])} />
            {cover && (
                <button className="bk-remove-cover" onClick={e => { e.stopPropagation(); onCoverRemove(); }}>
                    ✕ حذف الغلاف
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Textarea block — same pattern as lec-textarea-block / news-ta-block
// ─────────────────────────────────────────────────────────────────────────────
function BkTextArea({ icon, label, sub, name, value, onChange, placeholder, rows = 5 }) {
    const count = countLines(value);
    return (
        <div className="bk-ta-block">
            <div className="bk-ta-hdr">
                <span className="bk-ta-icon">{icon}</span>
                <div style={{ flex: 1 }}>
                    <div className="bk-ta-label">{label}</div>
                    {sub && <div className="bk-ta-sub">{sub}</div>}
                </div>
                <span className="bk-ta-count">{count} أسطر</span>
            </div>
            <textarea
                name={name} value={value} onChange={onChange}
                placeholder={placeholder} rows={rows}
                className="bk-ta"
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BooksTab — main component
// ─────────────────────────────────────────────────────────────────────────────
const BooksTab = () => {
    // data state
    const [books, setBooks] = useState(INITIAL_BOOKS);
    const [bookTypes, setBookTypes] = useState(INITIAL_BOOK_TYPES);

    // ui state
    const [subPage, setSubPage] = useState('books'); // 'books' | 'types'
    const [search, setSearch] = useState('');

    // books state
    const [selectedBook, setSelectedBook] = useState({ ...INITIAL_BOOKS[0] });
    const [formBook, setFormBook] = useState({ ...INITIAL_BOOKS[0] });
    const [isNewBook, setIsNewBook] = useState(false);
    const [delConfBook, setDelConfBook] = useState(false);

    // types state
    const [selectedType, setSelectedType] = useState(null);
    const [formType, setFormType] = useState({ ...BLANK_TYPE });
    const [isNewType, setIsNewType] = useState(true);
    const [delConfType, setDelConfType] = useState(false);

    // notification
    const [notif, setNotif] = useState(null);
    const notifRef = useRef(null);

    const toast = (msg, type = 'success') => {
        clearTimeout(notifRef.current);
        setNotif({ msg, type });
        notifRef.current = setTimeout(() => setNotif(null), 3500);
    };

    // ── sub-page switch ──────────────────────────────────────────────────────
    function switchSub(page) {
        setSubPage(page);
        setSearch('');
        if (page === 'types' && !selectedType && bookTypes.length) {
            pickType(bookTypes[0]);
        }
    }

    // ── books helpers ────────────────────────────────────────────────────────
    const filteredBooks = books.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
    );
    const filteredTypes = bookTypes.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    function pickBook(b) {
        setSelectedBook({ ...b });
        setFormBook({ ...b });
        setIsNewBook(false);
        setDelConfBook(false);
    }
    function handleBookNew() {
        setFormBook({ ...BLANK_BOOK });
        setSelectedBook(null);
        setIsNewBook(true);
        setDelConfBook(false);
    }
    function handleBookSave() {
        if (!formBook.name.trim()) { toast('اسم الكتاب مطلوب', 'error'); return; }
        if (isNewBook) {
            const newId = Math.max(0, ...books.map(b => b.id)) + 1;
            const nb = { ...formBook, id: newId };
            setBooks([nb, ...books]);
            setSelectedBook({ ...nb }); setFormBook({ ...nb }); setIsNewBook(false);
            toast('تم إضافة الكتاب بنجاح');
        } else {
            const up = { ...formBook };
            setBooks(books.map(b => b.id === up.id ? { ...up } : b));
            setSelectedBook({ ...up });
            toast('تم حفظ التغييرات بنجاح');
        }
    }
    function handleBookReset() {
        setFormBook(isNewBook ? { ...BLANK_BOOK } : { ...selectedBook });
        setDelConfBook(false);
        toast('تم إلغاء التغييرات', 'info');
    }
    function handleBookDelete() {
        if (!delConfBook) { setDelConfBook(true); return; }
        const rest = books.filter(b => b.id !== selectedBook.id);
        setBooks(rest); setDelConfBook(false);
        if (rest.length) pickBook(rest[0]); else handleBookNew();
        toast('تم حذف الكتاب', 'error');
    }

    // ── types helpers ────────────────────────────────────────────────────────
    function pickType(t) {
        setSelectedType({ ...t }); setFormType({ ...t });
        setIsNewType(false); setDelConfType(false);
    }
    function handleTypeNew() {
        setFormType({ ...BLANK_TYPE }); setSelectedType(null);
        setIsNewType(true); setDelConfType(false);
    }
    function handleTypeSave() {
        const name = formType.name.trim();
        if (!name) { toast('اسم النوع مطلوب', 'error'); return; }
        if (isNewType) {
            const newId = Math.max(0, ...bookTypes.map(t => t.id)) + 1;
            const nt = { id: newId, name };
            setBookTypes([nt, ...bookTypes]);
            setSelectedType({ ...nt }); setFormType({ ...nt }); setIsNewType(false);
            toast('تم إضافة النوع بنجاح');
        } else {
            setBookTypes(bookTypes.map(t => t.id === formType.id ? { ...t, name } : t));
            setSelectedType({ ...formType, name });
            toast('تم حفظ التغييرات بنجاح');
        }
    }
    function handleTypeReset() {
        setFormType(isNewType ? { ...BLANK_TYPE } : { ...selectedType });
        setDelConfType(false);
        toast('تم إلغاء التغييرات', 'info');
    }
    function handleTypeDelete() {
        if (!delConfType) { setDelConfType(true); return; }
        const rest = bookTypes.filter(t => t.id !== selectedType.id);
        setBookTypes(rest); setDelConfType(false);
        if (rest.length) pickType(rest[0]); else handleTypeNew();
        toast('تم حذف النوع', 'error');
    }

    const booksOfType = typeName => books.filter(b => b.category === typeName).length;
    const listCount = subPage === 'books' ? filteredBooks.length : filteredTypes.length;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="bk-layout">

            {/* ══ LEFT PANEL — list ══ */}
            <aside className="bk-panel">

                {/* Sub-page tabs — same bk-tab pattern */}
                <div className="bk-subtabs">
                    <button className={`bk-subtab${subPage === 'books' ? ' active' : ''}`} onClick={() => switchSub('books')}>📚 الكتب</button>
                    <button className={`bk-subtab${subPage === 'types' ? ' active' : ''}`} onClick={() => switchSub('types')}>🏷️ الأنواع</button>
                </div>

                {/* Panel header */}
                <div className="bk-panel-hdr">
                    <div className="adm-section-tag" style={{ marginBottom: 0, fontSize: '.64rem' }}>
                        {subPage === 'books' ? 'الكتب' : 'الأنواع'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span className="bk-count-badge">{listCount}</span>
                        <button className="bk-new-btn" onClick={subPage === 'books' ? handleBookNew : handleTypeNew}>
                            + جديد
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="adm-search bk-search-wrap">
                    <input
                        type="text"
                        placeholder={subPage === 'books' ? ' ...بحث بالعنوان أو المؤلف...' : '....بحث بالاسم...'}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    
                </div>

                {/* List */}
                <div className="bk-list">
                    {/* ── Books list ── */}
                    {subPage === 'books' && (
                        filteredBooks.length === 0
                            ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p>لا توجد نتائج</p></div>
                            : filteredBooks.map(b => (
                                <div
                                    key={b.id}
                                    className={`bk-row${selectedBook?.id === b.id && !isNewBook ? ' active' : ''}`}
                                    onClick={() => pickBook(b)}
                                >
                                    <div className="bk-row-avatar">
                                        {b.cover
                                            ? <img src={b.cover} alt="" />
                                            : <span>📗</span>
                                        }
                                    </div>
                                    <div className="bk-row-info">
                                        <div className="bk-row-name">{b.name || 'بدون عنوان'}</div>
                                        <div className="bk-row-sub">{b.author || '—'}</div>
                                    </div>
                                    <div className="bk-row-id">#{b.id}</div>
                                </div>
                            ))
                    )}

                    {/* ── Types list ── */}
                    {subPage === 'types' && (
                        filteredTypes.length === 0
                            ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p>لا توجد نتائج</p></div>
                            : filteredTypes.map(t => (
                                <div
                                    key={t.id}
                                    className={`bk-row${selectedType?.id === t.id && !isNewType ? ' active' : ''}`}
                                    onClick={() => pickType(t)}
                                >
                                    <div className="bk-row-avatar">
                                        <span>🏷️</span>
                                    </div>
                                    <div className="bk-row-info">
                                        <div className="bk-row-name">{t.name}</div>
                                        <div className="bk-row-sub">{booksOfType(t.name)} كتاب</div>
                                    </div>
                                    <div className="bk-row-id">#{t.id}</div>
                                </div>
                            ))
                    )}
                </div>
            </aside>

            {/* ══ RIGHT PANEL — form ══ */}
            <div className="bk-form-wrap">

                {/* Notification — same lec-notif / news-notif pattern */}
                {notif && (
                    <div className={`bk-notif bk-notif-${notif.type}`}>
                        <span>{notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : 'ℹ️'}</span>
                        {notif.msg}
                    </div>
                )}

                {/* ══════ BOOKS FORM ══════ */}
                {subPage === 'books' && (
                    <div className="adm-card bk-form-card">

                        {/* Card header — same lec-form-hdr pattern */}
                        <div className="bk-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6 }}>
                                    {isNewBook ? 'كتاب جديد' : `ID: #${selectedBook?.id}`}
                                </div>
                                <h2 className="bk-form-title">
                                    {isNewBook ? '➕ إضافة كتاب جديد' : '✏️ تعديل بيانات الكتاب'}
                                </h2>
                                {!isNewBook && selectedBook && (
                                    <p className="bk-form-sub">{selectedBook.name}</p>
                                )}
                            </div>
                            <span className="bk-stat-pill">📚 {books.length} كتاب</span>
                        </div>

                        <div className="bk-form-body">

                            {/* Cover + fields row */}
                            <div className="bk-top-row">
                                {/* Cover */}
                                <div className="bk-cover-col">
                                    <label className="bk-label">غلاف الكتاب</label>
                                    <CoverZone
                                        cover={formBook.cover}
                                        onCoverChange={val => setFormBook(f => ({ ...f, cover: val }))}
                                        onCoverRemove={() => setFormBook(f => ({ ...f, cover: null }))}
                                    />
                                </div>

                                {/* Fields grid */}
                                <div className="bk-fields-grid">
                                    <div className="bk-field">
                                        <label className="bk-label">الرقم</label>
                                        <input className="bk-inp" value={isNewBook ? 'تلقائي' : formBook.id} disabled style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }} />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">اسم الكتاب *</label>
                                        <input className="bk-inp" name="name" value={formBook.name} onChange={e => setFormBook(f => ({ ...f, name: e.target.value }))} placeholder="عنوان الكتاب..." />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">المؤلف</label>
                                        <input className="bk-inp" name="author" value={formBook.author} onChange={e => setFormBook(f => ({ ...f, author: e.target.value }))} placeholder="اسم المؤلف..." />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">سنة الإصدار</label>
                                        <input className="bk-inp" name="year" value={formBook.year} onChange={e => setFormBook(f => ({ ...f, year: e.target.value }))} placeholder="مثال: 2023" />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">الناشر</label>
                                        <input className="bk-inp" name="publisher" value={formBook.publisher} onChange={e => setFormBook(f => ({ ...f, publisher: e.target.value }))} placeholder="دار النشر..." />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">رقم ISBN</label>
                                        <input className="bk-inp" name="isbn" value={formBook.isbn} onChange={e => setFormBook(f => ({ ...f, isbn: e.target.value }))} placeholder="978-X-XXX-XXXXX-X" style={{ direction: 'ltr', textAlign: 'right' }} />
                                    </div>
                                    {/* Category — full width */}
                                    <div className="bk-field" style={{ gridColumn: '1/-1' }}>
                                        <label className="bk-label">نوع الكتاب</label>
                                        <select className="bk-inp bk-select" value={formBook.category} onChange={e => setFormBook(f => ({ ...f, category: e.target.value }))}>
                                            <option value="">-- اختر النوع --</option>
                                            {bookTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="bk-divider" />

                            {/* Summary */}
                            <BkTextArea
                                icon="📝" label="ملخص الكتاب" sub="وصف مختصر لمحتوى الكتاب"
                                name="summary" value={formBook.summary}
                                onChange={e => setFormBook(f => ({ ...f, summary: e.target.value }))}
                                placeholder={'مثال:\nيتناول هذا الكتاب أساسيات إدارة المشاريع الهندسية\nويشرح أسس التخطيط والتنفيذ والمتابعة'}
                                rows={5}
                            />

                            {/* Notes */}
                            <BkTextArea
                                icon="📋" label="ملاحظات وتفاصيل إضافية" sub="معلومات إضافية عن الكتاب"
                                name="notes" value={formBook.notes}
                                onChange={e => setFormBook(f => ({ ...f, notes: e.target.value }))}
                                placeholder={'مثال:\nالطبعة الثالثة المنقحة والمزيدة\nمتاح باللغتين العربية والإنجليزية'}
                                rows={5}
                            />

                            {/* Actions — same lec-actions pattern */}
                            <div className="bk-actions">
                                <button className="bk-act-btn save" onClick={handleBookSave}>💾 حفظ</button>
                                <button className="bk-act-btn new" onClick={handleBookNew}>➕ كتاب جديد</button>
                                <button className="bk-act-btn reset" onClick={handleBookReset}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNewBook && (
                                    delConfBook ? (
                                        <div className="bk-delete-confirm">
                                            <span className="bk-delete-warn">⚠️ هل أنت متأكد من الحذف؟</span>
                                            <button className="bk-act-btn delete" onClick={handleBookDelete}>تأكيد</button>
                                            <button className="adm-fclear" onClick={() => setDelConfBook(false)}>إلغاء</button>
                                        </div>
                                    ) : (
                                        <button className="bk-act-btn delete" onClick={handleBookDelete}>🗑 حذف الكتاب</button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════ TYPES FORM ══════ */}
                {subPage === 'types' && (
                    <div className="adm-card bk-form-card">

                        <div className="bk-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6 }}>
                                    {isNewType ? 'نوع جديد' : `ID: #${selectedType?.id}`}
                                </div>
                                <h2 className="bk-form-title">
                                    {isNewType ? '➕ إضافة نوع جديد' : '✏️ تعديل النوع'}
                                </h2>
                                {!isNewType && selectedType && <p className="bk-form-sub">{selectedType.name}</p>}
                            </div>
                            <span className="bk-stat-pill">🏷️ {bookTypes.length} نوع</span>
                        </div>

                        <div className="bk-form-body">

                            {/* Type fields */}
                            <div className="bk-fields-grid" style={{ marginBottom: 20 }}>
                                <div className="bk-field">
                                    <label className="bk-label">الرقم</label>
                                    <input className="bk-inp" value={isNewType ? 'تلقائي' : formType.id} disabled style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }} />
                                </div>
                                <div className="bk-field">
                                    <label className="bk-label">اسم النوع *</label>
                                    <input className="bk-inp" value={formType.name} onChange={e => setFormType(f => ({ ...f, name: e.target.value }))} placeholder="مثال: الهندسة المدنية..." />
                                </div>
                            </div>

                            <div className="bk-divider" />

                            {/* Types table — same adm-tscr / adm-tbl pattern */}
                            <div className="bk-ta-block" style={{ marginBottom: 18 }}>
                                <div className="bk-ta-hdr">
                                    <span className="bk-ta-icon">🏷️</span>
                                    <div className="bk-ta-label" style={{ flex: 1 }}>قائمة أنواع الكتب</div>
                                    <span style={{ fontSize: '.64rem', color: T.gray500 }}>اضغط على صف لتعديله</span>
                                    <span className="bk-ta-count">{bookTypes.length} نوع</span>
                                </div>
                                <div className="adm-tscr" style={{ maxHeight: 320, overflowY: 'auto' }}>
                                    <table className="adm-tbl" style={{ minWidth: 0 }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: 80 }}>#</th>
                                                <th>الاسم</th>
                                                <th className="c" style={{ width: 100 }}>عدد الكتب</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...bookTypes].sort((a, b) => b.id - a.id).map(t => (
                                                <tr
                                                    key={t.id}
                                                    className={selectedType?.id === t.id && !isNewType ? 'xopen' : ''}
                                                    onClick={() => pickType(t)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td>
                                                        <span style={{ fontFamily: 'Courier New', fontWeight: 900, color: T.orange, fontSize: '.78rem' }}>{t.id}</span>
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span className="adm-cb">{booksOfType(t.name)}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ background: T.gray100, padding: '8px 18px', textAlign: 'center', fontSize: '.72rem', fontWeight: 700, color: T.gray500, borderTop: `1.5px solid ${T.gray300}` }}>
                                    إجمالي الأنواع: {bookTypes.length}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bk-actions">
                                <button className="bk-act-btn save" onClick={handleTypeSave}>💾 حفظ</button>
                                <button className="bk-act-btn new" onClick={handleTypeNew}>➕ نوع جديد</button>
                                <button className="bk-act-btn reset" onClick={handleTypeReset}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNewType && (
                                    delConfType ? (
                                        <div className="bk-delete-confirm">
                                            <span className="bk-delete-warn">⚠️ هل أنت متأكد من الحذف؟</span>
                                            <button className="bk-act-btn delete" onClick={handleTypeDelete}>تأكيد</button>
                                            <button className="adm-fclear" onClick={() => setDelConfType(false)}>إلغاء</button>
                                        </div>
                                    ) : (
                                        <button className="bk-act-btn delete" onClick={handleTypeDelete}>🗑 حذف النوع</button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BooksTab;