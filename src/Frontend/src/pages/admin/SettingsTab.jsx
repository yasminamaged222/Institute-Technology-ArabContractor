// ─────────────────────────────────────────────────────────────────────────────
// SettingsTab.jsx
// Path: src/pages/admin/SettingsTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

// T tokens — inline here so this file has no path dependency issues
const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
    font: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif',
};

// ── Storage key — must match the one in constants.js ─────────────────────────
const STORAGE_KEY = 'icemt_admin_emails';

// ── Hardcoded fallback (the original list — never deletable) ─────────────────
const SUPER_ADMINS = [
    'yasminamaged22@gmail.com',
    'abeer.naguib@gmail.com',
    'amrshamy91@gmail.com',
    'abdelmawla1642@gmail.com',
    'mostafa.awaad@gmail.com',
    'samiryousri96@gmail.com',   // ← kept from your navbar list
];

// ── Public helper (mirrors constants.js — imported by Navbar & AdminDashboard)
export function getAdminEmails() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (_) { }
    return [...SUPER_ADMINS];
}

function saveAdminEmails(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsTab({ currentUserEmail = '' }) {
    const [emails, setEmails] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null); // email pending confirm

    // Load on mount
    useEffect(() => {
        setEmails(getAdminEmails());
    }, []);

    const showSuccess = msg => { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); };
    const showError = msg => { setError(msg); setTimeout(() => setError(''), 3500); };

    const isValidEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim().toLowerCase());

    const handleAdd = () => {
        const val = input.trim().toLowerCase();
        if (!val) { showError('أدخل البريد الإلكتروني أولاً'); return; }
        if (!isValidEmail(val)) { showError('صيغة البريد الإلكتروني غير صحيحة'); return; }
        if (emails.includes(val)) { showError('هذا البريد مضاف بالفعل'); return; }
        const updated = [...emails, val];
        setEmails(updated);
        saveAdminEmails(updated);
        setInput('');
        showSuccess(`✅ تم إضافة ${val} كمدير`);
    };

    const handleDelete = (email) => {
        if (deleteTarget !== email) { setDeleteTarget(email); return; }
        // confirm
        const updated = emails.filter(e => e !== email);
        setEmails(updated);
        saveAdminEmails(updated);
        setDeleteTarget(null);
        showSuccess(`تم حذف ${email} من قائمة المديرين`);
    };

    const isSuperAdmin = email => SUPER_ADMINS.includes(email);
    const isCurrentUser = email => email === currentUserEmail?.toLowerCase();

    return (
        <div>
            {/* ── Section header ── */}
            <div className="adm-section-hdr">
                <div>
                    <div className="adm-section-tag">إعدادات النظام</div>
                    <div className="adm-section-title">إدارة <span>المديرين</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '.72rem', color: T.gray500, fontFamily: T.font }}>
                        إجمالي المديرين:
                    </span>
                    <span style={{ fontFamily: 'Courier New', fontWeight: 900, fontSize: '.9rem', color: T.blue }}>
                        {emails.length}
                    </span>
                </div>
            </div>

            {/* ── Info banner ── */}
            <div style={{ background: 'rgba(8,101,168,0.05)', border: `1.5px solid rgba(8,101,168,0.18)`, borderRadius: 3, borderRight: `4px solid ${T.blue}`, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: T.font }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, marginBottom: 3 }}>كيف تعمل صلاحيات المديرين؟</div>
                    <div style={{ fontSize: '.72rem', color: T.gray700, lineHeight: 1.7 }}>
                        أي مستخدم بريده الإلكتروني موجود في هذه القائمة سيتمكن من الوصول للوحة الإدارة.
                        البريد المُضاف يظهر في قائمة <code style={{ background: T.gray100, padding: '1px 5px', borderRadius: 2, fontFamily: 'Courier New', fontSize: '.7rem' }}>ADMIN_EMAILS</code> تلقائياً.
                        المديرون الأساسيون (🔒) لا يمكن حذفهم.
                    </div>
                </div>
            </div>

            {/* ── Notifications ── */}
            {error && (
                <div className="adm-err" style={{ marginBottom: 14 }}>
                    ⚠️ {error}
                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setError('')}>✕</button>
                </div>
            )}
            {success && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', borderRadius: 3, padding: '10px 14px', marginBottom: 14, fontSize: '.78rem', display: 'flex', alignItems: 'center', gap: 8, fontFamily: T.font, borderRight: '4px solid #16a34a' }}>
                    {success}
                </div>
            )}

            {/* ── Add email form ── */}
            <div className="adm-card" style={{ marginBottom: 20 }}>
                <div style={{ padding: '20px 22px' }}>
                    <div style={{ fontWeight: 900, fontSize: '.88rem', color: T.black, fontFamily: T.font, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>➕</span> إضافة مدير جديد
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div className="adm-search" style={{ flex: 1, minWidth: 260 }}>
                            <input
                                type="email"
                                placeholder="أدخل البريد الإلكتروني للمدير الجديد..."
                                value={input}
                                onChange={e => { setInput(e.target.value); setError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                                style={{ direction: 'ltr', textAlign: 'left' }}
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            style={{ padding: '10px 24px', background: T.blue, color: T.white, border: 'none', borderRadius: 3, fontFamily: T.font, fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: `0 4px 14px rgba(8,101,168,0.3)`, transition: 'all .18s' }}
                            onMouseEnter={e => e.currentTarget.style.background = T.blueDark}
                            onMouseLeave={e => e.currentTarget.style.background = T.blue}
                        >
                            ✚ إضافة
                        </button>
                    </div>
                    <div style={{ marginTop: 8, fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                        💡 اضغط Enter أو زر "إضافة" — يجب أن يكون المستخدم مسجلاً في النظام بنفس البريد
                    </div>
                </div>
            </div>

            {/* ── Emails list ── */}
            <div className="adm-card">
                <div style={{ padding: '16px 22px 12px', borderBottom: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 900, fontSize: '.88rem', color: T.black, fontFamily: T.font }}>
                        📋 قائمة المديرين الحاليين
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: '.68rem', padding: '2px 10px', borderRadius: 2, background: 'rgba(8,101,168,0.08)', border: `1px solid rgba(8,101,168,0.2)`, color: T.blue, fontWeight: 700 }}>
                            🔒 {SUPER_ADMINS.length} أساسيون
                        </span>
                        <span style={{ fontSize: '.68rem', padding: '2px 10px', borderRadius: 2, background: T.gray100, border: `1px solid ${T.gray300}`, color: T.gray500, fontWeight: 700 }}>
                            ✚ {emails.filter(e => !isSuperAdmin(e)).length} مضافون
                        </span>
                    </div>
                </div>

                <div style={{ padding: '12px 16px' }}>
                    {emails.length === 0 && (
                        <div className="adm-empty"><div className="adm-emi">📭</div><p>لا يوجد مديرون</p></div>
                    )}
                    {emails.map((email, idx) => {
                        const isSuper = isSuperAdmin(email);
                        const isMe = isCurrentUser(email);
                        const isPending = deleteTarget === email;
                        return (
                            <div key={email} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 14px', borderRadius: 3, marginBottom: 6,
                                background: isMe ? 'rgba(8,101,168,0.04)' : idx % 2 === 0 ? T.white : '#fafbfc',
                                border: `1.5px solid ${isMe ? 'rgba(8,101,168,0.2)' : T.gray100}`,
                                transition: 'border-color .15s',
                            }}>
                                {/* Avatar */}
                                <div style={{ width: 36, height: 36, borderRadius: 3, background: isSuper ? T.blue : T.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.white, fontWeight: 900, fontSize: '.72rem', flexShrink: 0 }}>
                                    {email[0].toUpperCase()}
                                </div>

                                {/* Email */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: 'Courier New', fontSize: '.82rem', fontWeight: 700, color: T.black, direction: 'ltr', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {email}
                                    </div>
                                    <div style={{ display: 'flex', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
                                        {isSuper && (
                                            <span style={{ fontSize: '.58rem', fontWeight: 700, padding: '1px 7px', borderRadius: 2, background: 'rgba(8,101,168,0.08)', border: `1px solid rgba(8,101,168,0.2)`, color: T.blue }}>
                                                🔒 مدير أساسي
                                            </span>
                                        )}
                                        {!isSuper && (
                                            <span style={{ fontSize: '.58rem', fontWeight: 700, padding: '1px 7px', borderRadius: 2, background: 'rgba(245,124,0,0.06)', border: `1px solid rgba(245,124,0,0.2)`, color: T.orange }}>
                                                ✚ مُضاف
                                            </span>
                                        )}
                                        {isMe && (
                                            <span style={{ fontSize: '.58rem', fontWeight: 700, padding: '1px 7px', borderRadius: 2, background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a' }}>
                                                ● أنت
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Delete / Confirm */}
                                {!isSuper && !isMe && (
                                    isPending ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: '.72rem', color: '#dc2626', fontWeight: 700, fontFamily: T.font, whiteSpace: 'nowrap' }}>تأكيد الحذف؟</span>
                                            <button
                                                onClick={() => handleDelete(email)}
                                                style={{ padding: '5px 12px', background: '#dc2626', color: T.white, border: 'none', borderRadius: 2, fontFamily: T.font, fontSize: '.7rem', fontWeight: 700, cursor: 'pointer' }}>
                                                نعم
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(null)}
                                                style={{ padding: '5px 12px', background: T.gray100, color: T.gray500, border: `1.5px solid ${T.gray300}`, borderRadius: 2, fontFamily: T.font, fontSize: '.7rem', fontWeight: 700, cursor: 'pointer' }}>
                                                لا
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(email)}
                                            style={{ padding: '5px 12px', background: '#fef2f2', color: '#dc2626', border: '1.5px solid rgba(220,38,38,.2)', borderRadius: 2, fontFamily: T.font, fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .14s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
                                            🗑 حذف
                                        </button>
                                    )
                                )}
                                {(isSuper || isMe) && (
                                    <span style={{ fontSize: '.68rem', color: T.gray300, fontFamily: T.font, whiteSpace: 'nowrap' }}>
                                        {isMe ? '(أنت)' : '(محمي)'}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Export list */}
                {emails.length > 0 && (
                    <div style={{ padding: '12px 22px 16px', borderTop: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        <span style={{ fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                            آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
                        </span>
                        <button
                            onClick={() => {
                                const text = emails.join('\n');
                                navigator.clipboard?.writeText(text);
                                showSuccess('تم نسخ القائمة للحافظة ✅');
                            }}
                            style={{ padding: '6px 16px', background: T.gray100, color: T.gray700, border: `1.5px solid ${T.gray300}`, borderRadius: 2, fontFamily: T.font, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer' }}>
                            📋 نسخ القائمة
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}