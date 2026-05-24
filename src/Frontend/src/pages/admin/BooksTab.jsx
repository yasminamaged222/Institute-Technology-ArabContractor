import React, { useState, useRef, useEffect, useCallback } from 'react';
import { T } from "../../components/admin/constants";

// ─────────────────────────────────────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api/admin';
const BOOKS_API = `${API_BASE}/AdminBook`;
const TYPES_API = `${API_BASE}/AdminBooksType`;

// ✅ FIX: Large page size so all books load at once — list scrolls natively, no pagination needed
const PAGE_SIZE = 999;

const BLANK_BOOK = { bookId: 0, bookName: '', author: '', bookDate: '', typeId: '', typeName: '' };
const BLANK_TYPE = { typeId: 0, typeName: '' };

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function countLines(val) {
    return val ? val.split('\n').filter(l => l.trim()).length : 0;
}

async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    return res.text();
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover upload zone
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
// Textarea block
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
    // ── Books state ──────────────────────────────────────────────────────────
    const [books, setBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(false);
    const [booksError, setBooksError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);

    // ── Book Types state ─────────────────────────────────────────────────────
    const [bookTypes, setBookTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(false);
    const [typesError, setTypesError] = useState(null);

    // ── UI state ─────────────────────────────────────────────────────────────
    const [subPage, setSubPage] = useState('books');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // ── Books form state ─────────────────────────────────────────────────────
    const [selectedBook, setSelectedBook] = useState(null);
    const [formBook, setFormBook] = useState({ ...BLANK_BOOK, cover: null });
    const [isNewBook, setIsNewBook] = useState(false);
    const [delConfBook, setDelConfBook] = useState(false);
    const [bookSaving, setBookSaving] = useState(false);

    // ── Types form state ─────────────────────────────────────────────────────
    const [selectedType, setSelectedType] = useState(null);
    const [formType, setFormType] = useState({ ...BLANK_TYPE });
    const [isNewType, setIsNewType] = useState(true);
    const [delConfType, setDelConfType] = useState(false);
    const [typeSaving, setTypeSaving] = useState(false);

    // ── Notification ─────────────────────────────────────────────────────────
    const [notif, setNotif] = useState(null);
    const notifRef = useRef(null);

    const toast = (msg, type = 'success') => {
        clearTimeout(notifRef.current);
        setNotif({ msg, type });
        notifRef.current = setTimeout(() => setNotif(null), 3500);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Debounce search
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    // ─────────────────────────────────────────────────────────────────────────
    // Fetch books (all at once — no pagination)
    // ─────────────────────────────────────────────────────────────────────────
    const fetchBooks = useCallback(async (searchTerm = '') => {
        setBooksLoading(true);
        setBooksError(null);
        try {
            const params = new URLSearchParams({ pageIndex: 1, pageSize: PAGE_SIZE });
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            const data = await apiFetch(`${BOOKS_API}?${params}`);
            setBooks(data.data ?? []);
            setTotalItems(data.totalItems ?? 0);
        } catch (err) {
            setBooksError(err.message);
        } finally {
            setBooksLoading(false);
        }
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // Fetch book types
    // ─────────────────────────────────────────────────────────────────────────
    const fetchTypes = useCallback(async () => {
        setTypesLoading(true);
        setTypesError(null);
        try {
            const data = await apiFetch(TYPES_API);
            const list = Array.isArray(data) ? data : (data.data ?? []);
            setBookTypes(list);
            if (list.length && !selectedType) pickType(list[0]);
        } catch (err) {
            setTypesError(err.message);
        } finally {
            setTypesLoading(false);
        }
    }, []); // eslint-disable-line

    // ─────────────────────────────────────────────────────────────────────────
    // Fetch book by ID (for detail view)
    // ─────────────────────────────────────────────────────────────────────────
    async function fetchBookById(id) {
        try {
            const data = await apiFetch(`${BOOKS_API}/${id}`);
            return data;
        } catch (err) {
            toast(`خطأ في تحميل بيانات الكتاب: ${err.message}`, 'error');
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Effects
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (subPage === 'books') fetchBooks(debouncedSearch);
    }, [subPage, debouncedSearch, fetchBooks]);

    useEffect(() => {
        if (subPage === 'types') fetchTypes();
    }, [subPage, fetchTypes]);

    useEffect(() => {
        fetchTypes();
    }, []); // eslint-disable-line

    // ─────────────────────────────────────────────────────────────────────────
    // Sub-page switch
    // ─────────────────────────────────────────────────────────────────────────
    function switchSub(page) {
        setSubPage(page);
        setSearch('');
        setDebouncedSearch('');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Books helpers
    // ─────────────────────────────────────────────────────────────────────────
    async function pickBook(b) {
        const detail = await fetchBookById(b.bookId);
        const book = detail ?? b;
        setSelectedBook({ ...book });
        setFormBook({ ...book, cover: book.cover ?? null });
        setIsNewBook(false);
        setDelConfBook(false);
    }

    function handleBookNew() {
        setFormBook({ ...BLANK_BOOK, cover: null });
        setSelectedBook(null);
        setIsNewBook(true);
        setDelConfBook(false);
    }

    async function handleBookSave() {
        if (!formBook.bookName?.trim()) { toast('اسم الكتاب مطلوب', 'error'); return; }
        setBookSaving(true);
        const payload = {
            bookName: formBook.bookName?.trim() ?? '',
            author: formBook.author?.trim() ?? '',
            bookDate: Number(formBook.bookDate) || 0,
            typeId: Number(formBook.typeId) || 0,
        };
        try {
            if (isNewBook) {
                const created = await apiFetch(BOOKS_API, { method: 'POST', body: JSON.stringify(payload) });
                toast('تم إضافة الكتاب بنجاح');
                await fetchBooks(debouncedSearch);
                if (created?.bookId) {
                    const detail = await fetchBookById(created.bookId);
                    if (detail) { setSelectedBook({ ...detail }); setFormBook({ ...detail, cover: null }); setIsNewBook(false); }
                } else {
                    handleBookNew();
                }
            } else {
                await apiFetch(`${BOOKS_API}/${formBook.bookId}`, { method: 'PUT', body: JSON.stringify(payload) });
                const detail = await fetchBookById(formBook.bookId);
                const updated = detail ?? { ...formBook };
                setSelectedBook({ ...updated });
                setFormBook({ ...updated, cover: formBook.cover });
                await fetchBooks(debouncedSearch);
                toast('تم حفظ التغييرات بنجاح');
            }
        } catch (err) {
            toast(`خطأ: ${err.message}`, 'error');
        } finally {
            setBookSaving(false);
        }
    }

    function handleBookReset() {
        setFormBook(isNewBook ? { ...BLANK_BOOK, cover: null } : { ...selectedBook, cover: selectedBook?.cover ?? null });
        setDelConfBook(false);
        toast('تم إلغاء التغييرات', 'info');
    }

    async function handleBookDelete() {
        if (!delConfBook) { setDelConfBook(true); return; }
        try {
            await apiFetch(`${BOOKS_API}/${selectedBook.bookId}`, { method: 'DELETE' });
            setDelConfBook(false);
            setSelectedBook(null);
            setFormBook({ ...BLANK_BOOK, cover: null });
            setIsNewBook(false);
            setSubPage('books');
            await fetchBooks('');
            setSearch('');
            setDebouncedSearch('');
            toast('✅ تم حذف الكتاب بنجاح');
        } catch (err) {
            toast(`خطأ في الحذف: ${err.message}`, 'error');
            setDelConfBook(false);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Types helpers
    // ─────────────────────────────────────────────────────────────────────────
    function pickType(t) {
        setSelectedType({ ...t }); setFormType({ ...t });
        setIsNewType(false); setDelConfType(false);
    }
    function handleTypeNew() {
        setFormType({ ...BLANK_TYPE }); setSelectedType(null);
        setIsNewType(true); setDelConfType(false);
    }

    async function handleTypeSave() {
        const name = formType.typeName?.trim();
        if (!name) { toast('اسم النوع مطلوب', 'error'); return; }
        setTypeSaving(true);
        const payload = { typeName: name };
        try {
            if (isNewType) {
                const created = await apiFetch(TYPES_API, { method: 'POST', body: JSON.stringify(payload) });
                toast('تم إضافة النوع بنجاح');
                await fetchTypes();
                if (created?.typeId) pickType(created);
            } else {
                await apiFetch(`${TYPES_API}/${formType.typeId}`, { method: 'PUT', body: JSON.stringify(payload) });
                toast('تم حفظ التغييرات بنجاح');
                await fetchTypes();
                setSelectedType({ ...formType, typeName: name });
            }
        } catch (err) {
            toast(`خطأ: ${err.message}`, 'error');
        } finally {
            setTypeSaving(false);
        }
    }

    function handleTypeReset() {
        setFormType(isNewType ? { ...BLANK_TYPE } : { ...selectedType });
        setDelConfType(false);
        toast('تم إلغاء التغييرات', 'info');
    }

    async function handleTypeDelete() {
        if (!delConfType) { setDelConfType(true); return; }
        try {
            await apiFetch(`${TYPES_API}/${selectedType.typeId}`, { method: 'DELETE' });
            setDelConfType(false);
            setSelectedType(null);
            setFormType({ ...BLANK_TYPE });
            setIsNewType(true);
            await fetchTypes();
            toast('✅ تم حذف النوع بنجاح');
        } catch (err) {
            toast(`خطأ في الحذف: ${err.message}`, 'error');
            setDelConfType(false);
        }
    }

    const filteredTypes = bookTypes.filter(t =>
        t.typeName?.toLowerCase().includes(search.toLowerCase())
    );

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        /*
         * ✅ FIX: flexWrap:'wrap' lets panels stack vertically on small screens.
         *    On wide screens  → side-by-side (row).
         *    On narrow screens → list on top, form below (column-like wrap).
         *    Height is 'auto' so content drives the height on mobile.
         */
        <div
            style={{
                display: 'flex',
                gap: 'clamp(10px, 1.5vw, 20px)',
                alignItems: 'stretch',
                flexWrap: 'wrap',                        // ✅ wrap on mobile
                height: 'calc(100vh - 200px)',
                minHeight: 0,
            }}
        >
            {/* ══ LEFT PANEL — list ══ */}
            <aside
                className="bk-panel"
                style={{
                    overflowY: 'auto',
                    /*
                     * ✅ FIX: flex-basis clamps between 220 px and 300 px on desktop.
                     *    On mobile (< ~580 px) flexWrap kicks in and this takes 100%.
                     *    'position:sticky' removed — it fought against overflow:auto.
                     */
                    flex: '0 0 clamp(220px, 30%, 300px)',
                    minWidth: 0,
                    height: '100%',
                }}
            >
                {/* Sub-page tabs */}
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
                        <span className="bk-count-badge">
                            {subPage === 'books' ? totalItems : filteredTypes.length}
                        </span>
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

                {/* ✅ FIX: List is scrollable — no pagination needed */}
                <div className="bk-list" style={{ overflowY: 'auto', flex: 1 }}>

                    {/* ── Books list ── */}
                    {subPage === 'books' && (
                        booksLoading
                            ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p>⏳ جارٍ التحميل...</p></div>
                            : booksError
                                ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p style={{ color: 'red' }}>❌ {booksError}</p></div>
                                : books.length === 0
                                    ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p>لا توجد نتائج</p></div>
                                    : books.map(b => (
                                        <div
                                            key={b.bookId}
                                            className={`bk-row${selectedBook?.bookId === b.bookId && !isNewBook ? ' active' : ''}`}
                                            onClick={() => pickBook(b)}
                                        >
                                            <div className="bk-row-avatar">
                                                <span>📗</span>
                                            </div>
                                            <div className="bk-row-info">
                                                <div className="bk-row-name">{b.bookName || 'بدون عنوان'}</div>
                                                <div className="bk-row-sub">{b.author || '—'}</div>
                                            </div>
                                            <div className="bk-row-id">#{b.bookId}</div>
                                        </div>
                                    ))
                    )}

                    {/* ── Types list ── */}
                    {subPage === 'types' && (
                        typesLoading
                            ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p>⏳ جارٍ التحميل...</p></div>
                            : typesError
                                ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p style={{ color: 'red' }}>❌ {typesError}</p></div>
                                : filteredTypes.length === 0
                                    ? <div className="adm-empty" style={{ padding: '28px 12px' }}><p>لا توجد نتائج</p></div>
                                    : filteredTypes.map(t => (
                                        <div
                                            key={t.typeId}
                                            className={`bk-row${selectedType?.typeId === t.typeId && !isNewType ? ' active' : ''}`}
                                            onClick={() => pickType(t)}
                                        >
                                            <div className="bk-row-avatar">
                                                <span>🏷️</span>
                                            </div>
                                            <div className="bk-row-info">
                                                <div className="bk-row-name">{t.typeName}</div>
                                                <div className="bk-row-sub">{t.bookCount ?? '—'} كتاب</div>
                                            </div>
                                            <div className="bk-row-id">#{t.typeId}</div>
                                        </div>
                                    ))
                    )}
                </div>

                {/* ✅ FIX: Pagination REMOVED — list scrolls naturally */}
            </aside>

            {/* ══ RIGHT PANEL — form ══ */}
            {/*
             * ✅ FIX: flex:'1 1 300px' means:
             *   - On wide screens  → takes remaining space beside the aside.
             *   - On narrow screens → wraps to its own row (100% width) below the list.
             */}
            <div
                className="bk-form-wrap"
                style={{
                    flex: '1 1 300px',
                    minWidth: 0,
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                {/* Notification */}
                {notif && (
                    <div className={`bk-notif bk-notif-${notif.type}`}>
                        <span>{notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : 'ℹ️'}</span>
                        {notif.msg}
                    </div>
                )}

                {/* ══════ BOOKS FORM ══════ */}
                {subPage === 'books' && (
                    <div
                        className="adm-card bk-form-card"
                        style={{
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="bk-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6 }}>
                                    {isNewBook ? 'كتاب جديد' : selectedBook ? `ID: #${selectedBook.bookId}` : '—'}
                                </div>
                                <h2 className="bk-form-title">
                                    {isNewBook ? '➕ إضافة كتاب جديد' : '✏️ تعديل بيانات الكتاب'}
                                </h2>
                                {!isNewBook && selectedBook && (
                                    <p className="bk-form-sub">{selectedBook.bookName}</p>
                                )}
                            </div>
                            <span className="bk-stat-pill">📚 {totalItems} كتاب</span>
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
                                        <input
                                            className="bk-inp"
                                            value={isNewBook ? 'تلقائي' : (formBook.bookId || '—')}
                                            disabled
                                            style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">اسم الكتاب *</label>
                                        <input
                                            className="bk-inp"
                                            name="bookName"
                                            value={formBook.bookName ?? ''}
                                            onChange={e => setFormBook(f => ({ ...f, bookName: e.target.value }))}
                                            placeholder="عنوان الكتاب..."
                                        />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">المؤلف</label>
                                        <input
                                            className="bk-inp"
                                            name="author"
                                            value={formBook.author ?? ''}
                                            onChange={e => setFormBook(f => ({ ...f, author: e.target.value }))}
                                            placeholder="اسم المؤلف..."
                                        />
                                    </div>
                                    <div className="bk-field">
                                        <label className="bk-label">سنة الإصدار</label>
                                        <input
                                            className="bk-inp"
                                            name="bookDate"
                                            value={formBook.bookDate ?? ''}
                                            onChange={e => setFormBook(f => ({ ...f, bookDate: e.target.value }))}
                                            placeholder="مثال: 2023"
                                            type="number"
                                            min="1900"
                                            max="2100"
                                        />
                                    </div>
                                    {/* Category — full width */}
                                    <div className="bk-field" style={{ gridColumn: '1/-1' }}>
                                        <label className="bk-label">نوع الكتاب</label>
                                        <select
                                            className="bk-inp bk-select"
                                            value={formBook.typeId ?? ''}
                                            onChange={e => {
                                                const id = Number(e.target.value);
                                                const found = bookTypes.find(t => t.typeId === id);
                                                setFormBook(f => ({ ...f, typeId: id, typeName: found?.typeName ?? '' }));
                                            }}
                                        >
                                            <option value="">-- اختر النوع --</option>
                                            {bookTypes.map(t => (
                                                <option key={t.typeId} value={t.typeId}>{t.typeName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="bk-divider" />

                            {/* Actions */}
                            <div className="bk-actions">
                                <button
                                    className="bk-act-btn save"
                                    onClick={handleBookSave}
                                    disabled={bookSaving}
                                >
                                    {bookSaving ? '⏳ جارٍ الحفظ...' : '💾 حفظ'}
                                </button>
                                <button className="bk-act-btn new" onClick={handleBookNew}>➕ كتاب جديد</button>
                                <button className="bk-act-btn reset" onClick={handleBookReset}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNewBook && selectedBook && (
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
                    <div
                        className="adm-card bk-form-card"
                        style={{
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="bk-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6 }}>
                                    {isNewType ? 'نوع جديد' : `ID: #${selectedType?.typeId}`}
                                </div>
                                <h2 className="bk-form-title">
                                    {isNewType ? '➕ إضافة نوع جديد' : '✏️ تعديل النوع'}
                                </h2>
                                {!isNewType && selectedType && <p className="bk-form-sub">{selectedType.typeName}</p>}
                            </div>
                            <span className="bk-stat-pill">🏷️ {bookTypes.length} نوع</span>
                        </div>

                        <div className="bk-form-body">

                            {/* Type fields */}
                            <div className="bk-fields-grid" style={{ marginBottom: 20 }}>
                                <div className="bk-field">
                                    <label className="bk-label">الرقم</label>
                                    <input
                                        className="bk-inp"
                                        value={isNewType ? 'تلقائي' : formType.typeId}
                                        disabled
                                        style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }}
                                    />
                                </div>
                                <div className="bk-field">
                                    <label className="bk-label">اسم النوع *</label>
                                    <input
                                        className="bk-inp"
                                        value={formType.typeName ?? ''}
                                        onChange={e => setFormType(f => ({ ...f, typeName: e.target.value }))}
                                        placeholder="مثال: الهندسة المدنية..."
                                    />
                                </div>
                            </div>

                            <div className="bk-divider" />

                            {/* Types table */}
                            <div className="bk-ta-block" style={{ marginBottom: 18 }}>
                                <div className="bk-ta-hdr">
                                    <span className="bk-ta-icon">🏷️</span>
                                    <div className="bk-ta-label" style={{ flex: 1 }}>قائمة أنواع الكتب</div>
                                    <span style={{ fontSize: '.64rem', color: T.gray500 }}>اضغط على صف لتعديله</span>
                                    <span className="bk-ta-count">{bookTypes.length} نوع</span>
                                </div>
                                {typesLoading ? (
                                    <div style={{ padding: 20, textAlign: 'center' }}>⏳ جارٍ التحميل...</div>
                                ) : typesError ? (
                                    <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>❌ {typesError}</div>
                                ) : (
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
                                                {[...bookTypes].sort((a, b) => b.typeId - a.typeId).map(t => (
                                                    <tr
                                                        key={t.typeId}
                                                        className={selectedType?.typeId === t.typeId && !isNewType ? 'xopen' : ''}
                                                        onClick={() => pickType(t)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>
                                                            <span style={{ fontFamily: 'Courier New', fontWeight: 900, color: T.orange, fontSize: '.78rem' }}>{t.typeId}</span>
                                                        </td>
                                                        <td style={{ fontWeight: 600 }}>{t.typeName}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <span className="adm-cb">{t.bookCount ?? '—'}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div style={{ background: T.gray100, padding: '8px 18px', textAlign: 'center', fontSize: '.72rem', fontWeight: 700, color: T.gray500, borderTop: `1.5px solid ${T.gray300}` }}>
                                    إجمالي الأنواع: {bookTypes.length}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bk-actions">
                                <button
                                    className="bk-act-btn save"
                                    onClick={handleTypeSave}
                                    disabled={typeSaving}
                                >
                                    {typeSaving ? '⏳ جارٍ الحفظ...' : '💾 حفظ'}
                                </button>
                                <button className="bk-act-btn new" onClick={handleTypeNew}>➕ نوع جديد</button>
                                <button className="bk-act-btn reset" onClick={handleTypeReset}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNewType && selectedType && (
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