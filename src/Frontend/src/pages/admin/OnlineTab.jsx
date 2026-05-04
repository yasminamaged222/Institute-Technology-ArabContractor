// src/pages/admin/OnlineTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin tab: manage online meeting links per planwork.
// Styled to match PlanworkTab / BooksTab conventions.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { T, API_BASE } from '../../components/admin/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function isValidUrl(str) {
    try { new URL(str); return true; } catch { return false; }
}

// ─────────────────────────────────────────────────────────────────────────────
// OnlineTab
// ─────────────────────────────────────────────────────────────────────────────
const OnlineTab = () => {
    const { getToken } = useAuth();

    // ── Data ──
    const [planworks, setPlanworks] = useState([]);     // flat list from API
    const [links, setLinks] = useState({});             // { [planworkId]: { link, visible, saving } }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── UI ──
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);    // selected planwork object
    const [notification, setNotification] = useState(null);
    const [filter, setFilter] = useState('all');        // 'all' | 'linked' | 'unlinked'

    // ── Auth ──
    const authFetch = useCallback(async (url, opts = {}) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        return fetch(url, {
            ...opts,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...opts.headers,
            },
        });
    }, [getToken]);

    // ── Toast ──
    const toast = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    // ── Load planworks + their online settings ──
    const loadData = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            // Load planworks list
            const pwRes = await authFetch(`${API_BASE}/Admin/planworks`);
            if (!pwRes.ok) throw new Error(`Planworks API ${pwRes.status}`);
            const pwJson = await pwRes.json();
            const list = (Array.isArray(pwJson) ? pwJson : pwJson?.data ?? pwJson?.planWorks ?? pwJson?.result ?? [])
                .map(p => ({
                    id: p.childId ?? p.id,
                    title: p.serviceTitle ?? p.title ?? '—',
                    slug: p.slug ?? '',
                    date: p.courseDate ?? p.date ?? '',
                    place: p.coursePlace ?? p.place ?? '',
                    price: p.planCost ?? p.cost ?? 0,
                }))
                .filter(p => p.id != null);
            setPlanworks(list);

            // Load online settings for all planworks
            // Expected endpoint: GET /api/Admin/online-settings  → [{ planworkId, meetingLink, isVisible }]
            // Falls back gracefully if endpoint doesn't exist yet.
            try {
                const olRes = await authFetch(`${API_BASE}/Admin/online-settings`);
                if (olRes.ok) {
                    const olData = await olRes.json();
                    const arr = Array.isArray(olData) ? olData : olData?.data ?? olData?.result ?? [];
                    const map = {};
                    arr.forEach(item => {
                        const id = item.planworkId ?? item.PlanworkId;
                        if (id == null) return;
                        map[id] = {
                            link: item.meetingLink ?? item.MeetingLink ?? '',
                            visible: !!(item.isVisible ?? item.IsVisible ?? false),
                            saving: false,
                        };
                    });
                    setLinks(map);
                }
            } catch (_) {
                // Online settings endpoint not available yet — start empty
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => { loadData(); }, [loadData]);

    // ── Save link for a planwork ──
    const handleSave = async (planworkId) => {
        const entry = links[planworkId] ?? { link: '', visible: false };
        if (entry.link && !isValidUrl(entry.link)) {
            toast('الرابط غير صحيح — تأكد من البدء بـ https://', 'error');
            return;
        }
        setLinks(prev => ({ ...prev, [planworkId]: { ...prev[planworkId], saving: true } }));
        try {
            // Try PUT first (update), then POST (create)
            const payload = {
                planworkId,
                meetingLink: entry.link || null,
                isVisible: !!entry.visible,
            };
            const putRes = await authFetch(`${API_BASE}/Admin/online-settings/${planworkId}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
            if (!putRes.ok && putRes.status !== 404) {
                const postRes = await authFetch(`${API_BASE}/Admin/online-settings`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
            }
            toast('تم الحفظ بنجاح ✓');
        } catch (e) {
            toast('فشل الحفظ: ' + e.message, 'error');
        } finally {
            setLinks(prev => ({ ...prev, [planworkId]: { ...prev[planworkId], saving: false } }));
        }
    };

    // ── Helpers ──
    const setLink = (id, field, val) =>
        setLinks(prev => ({ ...prev, [id]: { ...(prev[id] ?? { link: '', visible: false, saving: false }), [field]: val } }));

    // ── Filter + search ──
    const filtered = planworks.filter(p => {
        const q = search.toLowerCase();
        const matchQ = !q || p.title.toLowerCase().includes(q) || (p.slug ?? '').includes(q) || String(p.id).includes(q);
        const entry = links[p.id];
        const hasLink = !!(entry?.link);
        const matchFilter = filter === 'all' ? true : filter === 'linked' ? hasLink : !hasLink;
        return matchQ && matchFilter;
    });

    const linkedCount = planworks.filter(p => !!(links[p.id]?.link)).length;

    // ── Render form for selected planwork ──
    const renderForm = () => {
        if (!selected) return (
            <div className="adm-empty" style={{ padding: '60px 20px' }}>
                <div className="adm-emi">🌐</div>
                <p>اختر دورة من القائمة لإضافة أو تعديل رابط الاجتماع عبر الإنترنت</p>
            </div>
        );

        const id = selected.id;
        const entry = links[id] ?? { link: '', visible: false, saving: false };
        const hasLink = !!entry.link;

        return (
            <div className="adm-card" style={{ overflow: 'visible' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #3730a3 100%)',
                    padding: 'clamp(16px,2.5vw,22px) clamp(18px,3vw,28px)',
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                    position: 'relative', overflow: 'hidden', borderRadius: '3px 3px 0 0',
                }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.08) 1px,transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 5, height: '100%', background: 'linear-gradient(to bottom,#7c3aed,#a78bfa)' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="adm-hero-tag" style={{ background: '#7c3aed', marginBottom: 6 }}>
                            ID: #{selected.id}
                        </div>
                        <h2 style={{ fontSize: 'clamp(15px,2vw,19px)', fontWeight: 900, color: '#fff', margin: 0, fontFamily: T.font }}>
                            🌐 رابط الاجتماع الإلكتروني
                        </h2>
                        <p style={{ fontSize: '.74rem', color: 'rgba(255,255,255,.45)', margin: '4px 0 0', fontFamily: T.font, maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selected.title}
                        </p>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 14px', borderRadius: 2, background: hasLink ? 'rgba(22,163,74,0.18)' : 'rgba(255,255,255,0.08)', border: `1.5px solid ${hasLink ? 'rgba(22,163,74,0.5)' : 'rgba(255,255,255,0.15)'}`, color: hasLink ? '#4ade80' : 'rgba(255,255,255,.75)', fontSize: '.72rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>
                        {hasLink ? '🔗 يوجد رابط' : '⚠️ لا يوجد رابط'}
                    </div>
                </div>

                <div style={{ padding: 'clamp(14px,2.5vw,24px)' }}>

                    {/* Course info strip */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, padding: '10px 14px', background: '#f8f9fa', borderRadius: 3, border: '1.5px solid #e2e8f0', direction: 'rtl' }}>
                        {selected.date && (
                            <span style={{ fontSize: '.74rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                                📅 <strong>{selected.date}</strong>
                            </span>
                        )}
                        {selected.place && (
                            <span style={{ fontSize: '.74rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                                📍 {selected.place}
                            </span>
                        )}
                        {selected.price > 0 && (
                            <span style={{ fontSize: '.74rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                                💰 {(selected.price).toLocaleString('ar-EG')} جنيه
                            </span>
                        )}
                    </div>

                    {/* Meeting link input */}
                    <div className="lec-field" style={{ marginBottom: 18 }}>
                        <label className="lec-label" style={{ fontSize: '.82rem', marginBottom: 8 }}>
                            🔗 رابط الاجتماع (Microsoft Teams / Zoom / Google Meet)
                        </label>
                        <input
                            className="lec-inp"
                            value={entry.link}
                            onChange={e => setLink(id, 'link', e.target.value)}
                            placeholder="https://teams.microsoft.com/l/meetup-join/..."
                            style={{ direction: 'ltr', textAlign: 'right', fontFamily: "'Courier New',monospace", fontSize: '.76rem', color: '#1d4ed8' }}
                        />
                        {entry.link && !isValidUrl(entry.link) && (
                            <p style={{ fontSize: '.68rem', color: '#dc2626', marginTop: 4, fontFamily: T.font }}>
                                ⚠️ الرابط يبدو غير صحيح — تأكد من البدء بـ https://
                            </p>
                        )}
                        {entry.link && isValidUrl(entry.link) && (
                            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <a href={entry.link} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: '.72rem', color: '#2563eb', textDecoration: 'underline' }}>
                                    🔗 اختبار الرابط
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Visibility toggle */}
                    <div style={{ padding: '14px 16px', borderRadius: 3, border: `1.5px solid ${entry.visible ? 'rgba(22,163,74,0.35)' : '#e2e8f0'}`, background: entry.visible ? 'rgba(22,163,74,0.05)' : '#f8f9fa', marginBottom: 20, transition: 'all .2s' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', direction: 'rtl' }}>
                            <div
                                onClick={() => setLink(id, 'visible', !entry.visible)}
                                style={{
                                    width: 48, height: 26, borderRadius: 13,
                                    background: entry.visible ? '#16a34a' : '#d0d3d8',
                                    position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0,
                                }}>
                                <div style={{
                                    position: 'absolute', top: 3,
                                    right: entry.visible ? 3 : 'auto',
                                    left: entry.visible ? 'auto' : 3,
                                    width: 20, height: 20, borderRadius: '50%', background: '#fff',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'all .2s',
                                }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '.8rem', fontWeight: 800, color: entry.visible ? '#15803d' : '#374151', fontFamily: T.font }}>
                                    {entry.visible ? '✅ الرابط مرئي للمسجلين الآن' : '🔒 الرابط مخفي (غير مرئي)'}
                                </div>
                                <div style={{ fontSize: '.68rem', color: '#6b7280', marginTop: 2, fontFamily: T.font }}>
                                    {entry.visible
                                        ? 'سيتمكن المستخدمون المسجلون في هذه الدورة من رؤية رابط الاجتماع'
                                        : 'الرابط محفوظ لكنه مخفي عن المستخدمين حتى تقوم بتفعيله'}
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Clear link button */}
                    {entry.link && (
                        <div style={{ marginBottom: 16 }}>
                            <button
                                onClick={() => setLink(id, 'link', '')}
                                style={{ padding: '6px 14px', borderRadius: 3, border: '1.5px solid rgba(220,38,38,.3)', background: '#fef2f2', color: '#dc2626', fontSize: '.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: T.font }}>
                                🗑 مسح الرابط
                            </button>
                        </div>
                    )}

                    {/* Save button */}
                    <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '2px solid #f0f1f2', flexWrap: 'wrap' }}>
                        <button
                            className="lec-act-btn save"
                            onClick={() => handleSave(id)}
                            disabled={entry.saving}
                            style={{ minWidth: 140 }}>
                            {entry.saving ? '⏳ جاري الحفظ...' : '💾 حفظ الإعدادات'}
                        </button>
                        <button
                            className="lec-act-btn reset"
                            onClick={() => { setSelected(null); }}
                            style={{ background: T.gray100, color: T.gray700, boxShadow: 'none' }}>
                            ← رجوع للقائمة
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="adm-ld">
            <div className="adm-sp" />
            <p>جاري تحميل الدورات...</p>
        </div>
    );

    if (error) return (
        <div className="adm-err">⚠️ {error}
            <button onClick={loadData} style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: T.blue, fontSize: '.8rem', fontFamily: T.font }}>
                إعادة المحاولة
            </button>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Toast */}
            {notification && (
                <div className={`lec-notif lec-notif-${notification.type}`} style={{ marginBottom: 12 }}>
                    <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {notification.msg}
                </div>
            )}

            {/* Summary bar */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, padding: '12px 16px', background: 'linear-gradient(135deg,#1e1b4b,#3730a3)', borderRadius: 3, direction: 'rtl', boxShadow: '0 4px 16px rgba(55,48,163,0.25)' }}>
                <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'rgba(255,255,255,.85)', fontFamily: T.font }}>
                    📊 إجمالي الدورات: <strong style={{ color: '#c4b5fd' }}>{planworks.length}</strong>
                </span>
                <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'rgba(255,255,255,.85)', fontFamily: T.font }}>
                    🔗 دورات بروابط: <strong style={{ color: '#4ade80' }}>{linkedCount}</strong>
                </span>
                <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'rgba(255,255,255,.85)', fontFamily: T.font }}>
                    🔒 دورات بدون روابط: <strong style={{ color: '#fca5a5' }}>{planworks.length - linkedCount}</strong>
                </span>
            </div>

            <div className="lec-layout" style={{ alignItems: 'stretch' }}>

                {/* ══ LEFT PANEL ══ */}
                <div
                    className="lec-panel pw-left-panel"
                    style={{ height: 'calc(100vh - 160px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                    {/* Panel header */}
                    <div className="lec-panel-hdr" style={{ flexShrink: 0 }}>
                        <span className="lec-count-badge">{filtered.length}</span>
                        <span style={{ fontWeight: 800, fontSize: '.8rem', color: '#0a0a0a', flex: 1, textAlign: 'center' }}>الدورات</span>
                        <button onClick={loadData} disabled={loading} title="تحديث"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.85rem', opacity: .6 }}>🔄</button>
                    </div>

                    {/* Search */}
                    <div className="lec-search-wrap adm-search" style={{ padding: '8px 10px 5px', flexShrink: 0, position: 'relative' }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="بحث في الدورات..."
                            style={{ width: '100%', padding: '8px 12px', borderRadius: 3, border: '1.5px solid #d0d3d8', background: '#f0f1f2', color: '#0a0a0a', fontFamily: T.font, fontSize: '.74rem', outline: 'none', direction: 'rtl' }}
                        />
                        {search && (
                            <button className="lec-search-clear" onClick={() => setSearch('')}>✕</button>
                        )}
                    </div>

                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: 4, padding: '5px 10px 8px', flexShrink: 0 }}>
                        {[
                            { key: 'all', label: 'الكل' },
                            { key: 'linked', label: '🔗 بروابط' },
                            { key: 'unlinked', label: '⚠️ بدون' },
                        ].map(f => (
                            <button key={f.key}
                                onClick={() => setFilter(f.key)}
                                style={{
                                    flex: 1, padding: '5px 4px', borderRadius: 3, fontSize: '.66rem', fontWeight: 800,
                                    cursor: 'pointer', fontFamily: T.font,
                                    border: `1.5px solid ${filter === f.key ? 'rgba(124,58,237,0.4)' : 'rgba(0,0,0,0.1)'}`,
                                    background: filter === f.key ? 'rgba(124,58,237,0.1)' : 'transparent',
                                    color: filter === f.key ? '#7c3aed' : '#6b7280',
                                    transition: 'all .15s',
                                }}>
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="lec-list" style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 10px' }}>
                        {filtered.length === 0 ? (
                            <div className="adm-empty" style={{ padding: '30px 12px' }}>
                                <div className="adm-emi">📭</div>
                                <p>لا توجد دورات</p>
                            </div>
                        ) : filtered.map(p => {
                            const entry = links[p.id];
                            const hasLink = !!(entry?.link);
                            const isVisible = !!(entry?.visible);
                            return (
                                <div key={p.id}
                                    className={`lec-row${selected?.id === p.id ? ' active' : ''}`}
                                    onClick={() => setSelected(p)}>
                                    <div className="lec-avatar" style={{ background: hasLink ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'linear-gradient(135deg,#374151,#6b7280)' }}>
                                        <span>{hasLink ? '🔗' : '⚠️'}</span>
                                    </div>
                                    <div className="lec-row-info">
                                        <div className="lec-row-name" style={{ fontSize: '.73rem' }}>{p.title}</div>
                                        <div className="lec-row-spec">
                                            {hasLink
                                                ? <span style={{ color: isVisible ? '#16a34a' : '#f59e0b', fontWeight: 700 }}>
                                                    {isVisible ? '✅ مرئي' : '🔒 مخفي'}
                                                </span>
                                                : <span style={{ color: '#9ca3af' }}>لا يوجد رابط</span>
                                            }
                                        </div>
                                    </div>
                                    <span className="lec-row-id">#{p.id}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ══ FORM AREA ══ */}
                <div
                    className="lec-form-wrap"
                    style={{ height: 'calc(100vh - 160px)', overflowY: 'auto' }}>
                    {renderForm()}
                </div>

            </div>
        </div>
    );
};

export default OnlineTab;