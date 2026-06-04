// ─────────────────────────────────────────────────────────────────────────────
// SettingsTab.jsx  (redesigned)
// Path: src/pages/admin/SettingsTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react';

// ── Design tokens (same palette as the rest of the dashboard) ─────────────
const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray100: '#f0f1f2', gray200: '#e5e7eb', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
    green: '#16a34a', greenBg: '#f0fdf4', greenBorder: '#86efac',
    red: '#dc2626', redBg: '#fef2f2', redBorder: 'rgba(220,38,38,.2)',
    font: '"Noto Kufi Arabic", serif',
};

// ── All admin tabs in the system ──────────────────────────────────────────
const ADMIN_TABS = [
    { id: 'users', label: '👤 المستخدمون' },
    { id: 'courses', label: '📚 الدورات' },
    { id: 'attendance', label: '✅ الحضور' },
    { id: 'certificates', label: '📜 الشهادات' },
    { id: 'refunds', label: '💳 المستردات' },
    { id: 'finance', label: '💰 المالية' },
    { id: 'lecturers', label: '🎓 المحاضرون' },
    { id: 'news', label: '📰 الأخبار' },
    { id: 'books', label: '📖 الكتب' },
    { id: 'workplan', label: '📋 خطة العمل' },
    { id: 'settings', label: '⚙️ الإعدادات' },
];

// ── Static placeholder users (replace with API data when ready) ───────────
const STATIC_USERS = [
    { id: 1, username: 'yasmin.amaged', email: 'yasminamaged22@gmail.com' },
    { id: 2, username: 'abeer.naguib', email: 'abeer.naguib@gmail.com' },
    { id: 3, username: 'amr.shamy', email: 'amrshamy91@gmail.com' },
    { id: 4, username: 'abdelmawla', email: 'abdelmawla1642@gmail.com' },
    { id: 5, username: 'mostafa.awaad', email: 'mostafa.awaad@gmail.com' },
    { id: 6, username: 'samir.yousri', email: 'samiryousri96@gmail.com' },
    { id: 7, username: 'hana.khalil', email: 'hana.khalil@example.com' },
    { id: 8, username: 'omar.hassan', email: 'omar.hassan@example.com' },
    { id: 9, username: 'nada.ibrahim', email: 'nada.ibrahim@example.com' },
];

// ── Items per page ────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsTab({ currentUserEmail = '' }) {
    // ── UI state ────────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null); // user id with open tab-select panel

    // ── Per-user role state  { [userId]: { isAdmin, isManager, tabs: Set } }
    const [roles, setRoles] = useState(() => {
        const init = {};
        STATIC_USERS.forEach(u => {
            init[u.id] = { isAdmin: false, isManager: false, tabs: new Set() };
        });
        return init;
    });

    // ── Notification state ──────────────────────────────────────────────────
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3200);
    };

    // ── Filtered + paginated users ──────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return STATIC_USERS;
        return STATIC_USERS.filter(u =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
    }, [search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    // ── Role helpers ────────────────────────────────────────────────────────
    const setAdmin = (userId, checked) => {
        setRoles(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                isAdmin: checked,
                // if unchecking admin, clear tab selection; keep manager state
                tabs: checked ? prev[userId].tabs : new Set(),
            },
        }));
        if (!checked) setExpandedRow(null);
        showToast('success', checked
            ? `✅ تم منح صلاحية المدير`
            : `تم سحب صلاحية المدير`);
    };

    const setManager = (userId, checked) => {
        setRoles(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                isManager: checked,
                // manager → auto-grant all tabs; uncheck manager → keep custom tabs
                tabs: checked ? new Set(ADMIN_TABS.map(t => t.id)) : prev[userId].tabs,
            },
        }));
        showToast('success', checked
            ? `✅ تم منح صلاحية المدير العام (كل التبويبات)`
            : `تم تغيير الصلاحية`);
    };

    const toggleTab = (userId, tabId) => {
        setRoles(prev => {
            const current = new Set(prev[userId].tabs);
            current.has(tabId) ? current.delete(tabId) : current.add(tabId);
            return { ...prev, [userId]: { ...prev[userId], tabs: current } };
        });
    };

    const toggleExpanded = (userId) => {
        setExpandedRow(prev => (prev === userId ? null : userId));
    };

    const getRole = (userId) => roles[userId] || { isAdmin: false, isManager: false, tabs: new Set() };
    const isMe = (email) => email.toLowerCase() === currentUserEmail.toLowerCase();

    // ── Stats ───────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        let admins = 0, managers = 0;
        STATIC_USERS.forEach(u => {
            const r = roles[u.id];
            if (r?.isManager) managers++;
            else if (r?.isAdmin) admins++;
        });
        return { admins, managers, total: STATIC_USERS.length };
    }, [roles]);

    // ────────────────────────────────────────────────────────────────────────
    return (
        <div>
            {/* ── Section header ── */}
            <div className="adm-section-hdr">
                <div>
                    <div className="adm-section-tag">إعدادات النظام</div>
                    <div className="adm-section-title">إدارة <span>الصلاحيات</span></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <StatPill color={T.blue} icon="🛡" label="Admin" value={stats.admins} />
                    <StatPill color={T.orange} icon="👑" label="Manager" value={stats.managers} />
                    <StatPill color={T.gray500} icon="👥" label="Total" value={stats.total} />
                </div>
            </div>

            {/* ── Info banner ── */}
            <div style={infoBannerStyle}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, marginBottom: 3 }}>كيف تعمل الصلاحيات؟</div>
                    <div style={{ fontSize: '.72rem', color: T.gray700, lineHeight: 1.8 }}>
                        <b>مدير (Admin):</b> اختر التبويبات التي يمكنه الوصول إليها يدوياً.&nbsp;&nbsp;
                        <b>مدير عام (Manager):</b> يصل تلقائياً لجميع التبويبات دون قيود.
                    </div>
                </div>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div style={{
                    ...toastBase,
                    background: toast.type === 'success' ? T.greenBg : T.redBg,
                    border: `1.5px solid ${toast.type === 'success' ? T.greenBorder : T.redBorder}`,
                    borderRight: `4px solid ${toast.type === 'success' ? T.green : T.red}`,
                    color: toast.type === 'success' ? T.green : T.red,
                }}>
                    {toast.msg}
                </div>
            )}

            {/* ── Search ── */}
            <div className="adm-toolbar" style={{ marginBottom: 14 }}>
                <div className="adm-search" style={{ flex: 1 }}>
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); setExpandedRow(null); }}
                    />
                </div>
                {search && (
                    <button className="adm-fclear" onClick={() => { setSearch(''); setCurrentPage(1); }}>✕</button>
                )}
            </div>

            {/* ── Table ── */}
            <div className="adm-card">
                {/* Table header counts */}
                <div style={{ padding: '14px 20px 10px', borderBottom: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: '.88rem', color: T.black, fontFamily: T.font }}>
                        👥 قائمة المستخدمين
                    </span>
                    <span style={{ fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                        {filtered.length} نتيجة
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                ) : (
                    <div className="adm-tscr">
                        <table className="adm-tbl" style={{ minWidth: 680 }}>
                            <thead>
                                <tr>
                                    <th className="c" style={{ width: 36 }}>#</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th className="c" style={{ width: 110 }}>Admin</th>
                                    <th className="c" style={{ width: 110 }}>Manager</th>
                                    <th className="c" style={{ width: 100 }}>Tabs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((user, idx) => {
                                    const rowNum = (safePage - 1) * ITEMS_PER_PAGE + idx + 1;
                                    const role = getRole(user.id);
                                    const me = isMe(user.email);
                                    const tabCount = role.tabs.size;
                                    const isOpen = expandedRow === user.id;

                                    return (
                                        <React.Fragment key={user.id}>
                                            {/* ── Main row ── */}
                                            <tr className={isOpen ? 'xopen' : ''} style={me ? { background: 'rgba(8,101,168,0.04)' } : {}}>
                                                <td style={{ textAlign: 'center', color: T.gray500, fontSize: '.68rem' }}>{rowNum}</td>

                                                {/* User */}
                                                <td>
                                                    <div className="adm-uc">
                                                        <div className="adm-av" style={{ background: role.isManager ? T.orange : role.isAdmin ? T.blue : T.gray300 }}>
                                                            {user.username[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="adm-uname">{user.username}</span>
                                                            {me && <span style={{ marginRight: 6, fontSize: '.58rem', padding: '1px 6px', borderRadius: 2, background: T.greenBg, border: `1px solid ${T.greenBorder}`, color: T.green }}>● أنت</span>}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td className="adm-email" style={{ direction: 'ltr', textAlign: 'left' }}>{user.email}</td>

                                                {/* Admin checkbox */}
                                                <td style={{ textAlign: 'center' }}>
                                                    <label style={checkLabelStyle}>
                                                        <input
                                                            type="checkbox"
                                                            checked={role.isAdmin || role.isManager}
                                                            disabled={role.isManager}
                                                            onChange={e => setAdmin(user.id, e.target.checked)}
                                                            style={{ accentColor: T.blue, width: 15, height: 15, cursor: role.isManager ? 'not-allowed' : 'pointer' }}
                                                        />
                                                        <span style={{ fontSize: '.68rem', color: (role.isAdmin || role.isManager) ? T.blue : T.gray500, fontWeight: 700, fontFamily: T.font }}>
                                                            {(role.isAdmin || role.isManager) ? 'Admin' : 'نعم'}
                                                        </span>
                                                    </label>
                                                </td>

                                                {/* Manager checkbox */}
                                                <td style={{ textAlign: 'center' }}>
                                                    <label style={checkLabelStyle}>
                                                        <input
                                                            type="checkbox"
                                                            checked={role.isManager}
                                                            onChange={e => setManager(user.id, e.target.checked)}
                                                            style={{ accentColor: T.orange, width: 15, height: 15, cursor: 'pointer' }}
                                                        />
                                                        <span style={{ fontSize: '.68rem', color: role.isManager ? T.orange : T.gray500, fontWeight: 700, fontFamily: T.font }}>
                                                            {role.isManager ? 'Manager' : 'نعم'}
                                                        </span>
                                                    </label>
                                                </td>

                                                {/* Tab access button */}
                                                <td style={{ textAlign: 'center' }}>
                                                    {role.isManager ? (
                                                        <span style={{ fontSize: '.62rem', color: T.orange, fontWeight: 700, fontFamily: T.font }}>كل التبويبات</span>
                                                    ) : role.isAdmin ? (
                                                        <span
                                                            className={`adm-pill${isOpen ? ' op' : ''}`}
                                                            onClick={() => toggleExpanded(user.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {isOpen ? '▲ إخفاء' : `▼ ${tabCount > 0 ? tabCount : 'اختر'}`}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: T.gray300 }}>—</span>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* ── Expanded tab-select panel ── */}
                                            {isOpen && role.isAdmin && !role.isManager && (
                                                <tr className="adm-xrow">
                                                    <td colSpan={6}>
                                                        <div className="adm-xin" style={{ padding: '14px 18px' }}>
                                                            <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, fontFamily: T.font, marginBottom: 10 }}>
                                                                🔑 التبويبات المتاحة لـ <span style={{ fontFamily: 'Courier New' }}>{user.email}</span>
                                                            </div>

                                                            {/* Quick actions */}
                                                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                                                <button
                                                                    onClick={() => setRoles(prev => ({ ...prev, [user.id]: { ...prev[user.id], tabs: new Set(ADMIN_TABS.map(t => t.id)) } }))}
                                                                    style={quickBtnStyle(T.blue)}
                                                                >
                                                                    ✅ تحديد الكل
                                                                </button>
                                                                <button
                                                                    onClick={() => setRoles(prev => ({ ...prev, [user.id]: { ...prev[user.id], tabs: new Set() } }))}
                                                                    style={quickBtnStyle(T.gray500)}
                                                                >
                                                                    ✕ إلغاء الكل
                                                                </button>
                                                            </div>

                                                            {/* Tabs grid */}
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                                {ADMIN_TABS.map(tab => {
                                                                    const checked = role.tabs.has(tab.id);
                                                                    return (
                                                                        <label
                                                                            key={tab.id}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: 6,
                                                                                padding: '7px 13px', borderRadius: 3, cursor: 'pointer',
                                                                                border: `1.5px solid ${checked ? T.blue : T.gray300}`,
                                                                                background: checked ? 'rgba(8,101,168,0.06)' : T.white,
                                                                                transition: 'all .14s',
                                                                                fontFamily: T.font,
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checked}
                                                                                onChange={() => toggleTab(user.id, tab.id)}
                                                                                style={{ accentColor: T.blue, width: 13, height: 13 }}
                                                                            />
                                                                            <span style={{ fontSize: '.74rem', fontWeight: checked ? 700 : 500, color: checked ? T.blue : T.gray700 }}>
                                                                                {tab.label}
                                                                            </span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Summary */}
                                                            <div style={{ marginTop: 12, fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                                                                {role.tabs.size === 0
                                                                    ? '⚠️ لم يتم تحديد أي تبويب — المدير لن يرى أي محتوى'
                                                                    : `✅ تم تحديد ${role.tabs.size} من ${ADMIN_TABS.length} تبويب`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div style={{ padding: '10px 20px 14px', borderTop: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <button
                            disabled={safePage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            style={pageBtn(safePage === 1)}
                        >›</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                style={pageBtn(false, p === safePage)}
                            >{p}</button>
                        ))}
                        <button
                            disabled={safePage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={pageBtn(safePage === totalPages)}
                        >‹</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Small stat pill ───────────────────────────────────────────────────────────
function StatPill({ color, icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 3, background: `${color}10`, border: `1px solid ${color}30` }}>
            <span style={{ fontSize: '.8rem' }}>{icon}</span>
            <span style={{ fontSize: '.68rem', color, fontWeight: 700, fontFamily: '"Noto Kufi Arabic",serif' }}>{label}</span>
            <span style={{ fontFamily: 'Courier New', fontWeight: 900, fontSize: '.9rem', color }}>{value}</span>
        </div>
    );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const infoBannerStyle = {
    background: 'rgba(8,101,168,0.05)',
    border: '1.5px solid rgba(8,101,168,0.18)',
    borderRadius: 3,
    borderRight: '4px solid #0865a8',
    padding: '12px 16px',
    marginBottom: 18,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontFamily: '"Noto Kufi Arabic",serif',
};

const toastBase = {
    borderRadius: 3,
    padding: '10px 14px',
    marginBottom: 14,
    fontSize: '.78rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: '"Noto Kufi Arabic",serif',
};

const checkLabelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    cursor: 'pointer',
    userSelect: 'none',
};

const quickBtnStyle = (color) => ({
    padding: '5px 14px',
    background: `${color}12`,
    border: `1.5px solid ${color}40`,
    borderRadius: 2,
    color,
    fontFamily: '"Noto Kufi Arabic",serif',
    fontSize: '.7rem',
    fontWeight: 700,
    cursor: 'pointer',
});

const pageBtn = (disabled, active = false) => ({
    width: 30,
    height: 30,
    border: active ? '1.5px solid #0865a8' : '1.5px solid #d0d3d8',
    borderRadius: 2,
    background: active ? '#0865a8' : '#fff',
    color: active ? '#fff' : disabled ? '#d0d3d8' : '#374151',
    fontWeight: 700,
    fontSize: '.78rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
});