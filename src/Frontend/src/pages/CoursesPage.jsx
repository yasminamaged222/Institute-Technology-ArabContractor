import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const styles = {
    overviewBar: { position: 'fixed', left: 0, top: '64px', zIndex: 40, width: '100%', backgroundColor: '#f5f5f5', padding: '12px 24px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e0e0e0' },
    overviewBarText: { textAlign: 'center', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', color: '#000000' },
    breadcrumbLink: { marginLeft: '12px', color: '#0865a8', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer', fontWeight: '500', borderBottom: '2px solid transparent', paddingBottom: '2px' },
    breadcrumbSeparator: { color: '#000000', margin: '0 8px', opacity: 0.4 },
    breadcrumbCurrent: { marginRight: '12px', color: '#000000', fontWeight: '600' },
    mainContainer: { maxWidth: '1400px', margin: '0 auto', marginTop: '110px', padding: '30px 20px 50px', boxSizing: 'border-box', backgroundColor: '#ffffff' },
    pageHeader: { textAlign: 'center', marginBottom: '40px', padding: '30px 20px', backgroundColor: '#ffffff', borderRadius: '12px' },
    h1: { fontSize: '36px', fontWeight: 'bold', color: '#000000', marginBottom: '12px', fontFamily: '"Droid Arabic Kufi", serif', position: 'relative', display: 'inline-block' },
    h1Underline: { content: '""', position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '3px', background: 'linear-gradient(90deg, #0865a8 0%, #f57c00 100%)', borderRadius: '2px' },
    subtitle: { fontSize: '18px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', marginTop: '20px', opacity: 0.7 },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', fontSize: '20px', color: '#0865a8', fontFamily: '"Droid Arabic Kufi", serif' },
    errorContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', fontSize: '20px', color: '#f57c00', flexDirection: 'column', gap: '24px', fontFamily: '"Droid Arabic Kufi", serif' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', padding: '10px 0' },
    card: { display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '16px', backgroundColor: '#ffffff', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default', position: 'relative' },
    cardHover: { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.12)', borderColor: '#0865a8' },
    cardHeader: { position: 'relative', height: '160px', overflow: 'hidden', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cardHeaderFree: { background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)' },
    cardHeaderOwned: { background: 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)' },
    cardHeaderOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(8,101,168,0.9) 0%, rgba(245,124,0,0.9) 100%)', opacity: 0, transition: 'opacity 0.3s ease' },
    cardHeaderOverlayFree: { background: 'linear-gradient(135deg, rgba(26,122,60,0.9) 0%, rgba(39,174,96,0.9) 100%)' },
    cardHeaderOverlayHover: { opacity: 1 },
    iconWrapper: { position: 'relative', zIndex: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', padding: '24px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' },
    icon: { width: '48px', height: '48px', color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' },
    discountBadge: { position: 'absolute', right: '12px', top: '12px', borderRadius: '10px', backgroundColor: '#f57c00', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', boxShadow: '0 2px 8px rgba(245,124,0,0.4)', fontFamily: '"Droid Arabic Kufi", serif', zIndex: 3 },
    freeBadge: { position: 'absolute', right: '12px', top: '12px', borderRadius: '10px', backgroundColor: '#ffffff', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', color: '#1a7a3c', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontFamily: '"Droid Arabic Kufi", serif', zIndex: 3 },
    ownedBadge: { position: 'absolute', right: '12px', top: '12px', borderRadius: '10px', backgroundColor: '#ffffff', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', color: '#4a4a8a', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontFamily: '"Droid Arabic Kufi", serif', zIndex: 3 },
    certCardRibbon: { position: 'absolute', left: '12px', top: '12px', backgroundColor: 'rgba(124,58,237,0.88)', backdropFilter: 'blur(6px)', borderRadius: '8px', padding: '4px 10px', fontSize: '14px', boxShadow: '0 2px 8px rgba(124,58,237,0.4)', border: '1.5px solid rgba(255,255,255,0.3)', zIndex: 3, fontFamily: '"Droid Arabic Kufi", serif', color: '#fff', fontWeight: 'bold' },
    cardBody: { display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#ffffff' },
    courseTitle: { fontSize: '17px', fontWeight: 'bold', color: '#000000', marginBottom: '16px', lineHeight: '1.5', minHeight: '52px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: '"Droid Arabic Kufi", serif' },
    infoSection: { marginBottom: '16px' },
    infoRow: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#000000', marginBottom: '10px', fontFamily: '"Droid Arabic Kufi", serif', padding: '6px 10px', backgroundColor: '#f9f9f9', borderRadius: '6px', borderRight: '3px solid #0865a8' },
    infoIcon: { width: '18px', height: '18px', flexShrink: 0, color: '#0865a8', marginTop: '2px' },
    clampText: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4', flex: 1 },
    description: { fontSize: '14px', lineHeight: '1.6', color: '#000000', opacity: 0.7, marginBottom: '16px', fontFamily: '"Droid Arabic Kufi", serif' },
    priceSection: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #f0f0f0', marginBottom: '16px' },
    priceContainer: { display: 'flex', flexDirection: 'column', gap: '4px' },
    originalPrice: { fontSize: '13px', color: '#000000', textDecoration: 'line-through', fontFamily: '"Droid Arabic Kufi", serif', opacity: 0.5 },
    currentPrice: { fontSize: '24px', fontWeight: 'bold', color: '#f57c00', fontFamily: '"Droid Arabic Kufi", serif' },
    freePriceLabel: { fontSize: '24px', fontWeight: 'bold', color: '#1a7a3c', fontFamily: '"Droid Arabic Kufi", serif' },
    priceLabel: { fontSize: '12px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', opacity: 0.6, marginTop: '2px' },
    buttonsContainer: { display: 'flex', gap: '10px', flexDirection: 'column' },
    certDownloadBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', width: '100%', padding: '11px 20px', background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif', textDecoration: 'none', boxShadow: '0 3px 10px rgba(124,58,237,0.35)', transition: 'all 0.25s ease', cursor: 'pointer' },
    addToCartBtn: { width: '100%', borderRadius: '10px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', padding: '12px 20px', fontWeight: 'bold', color: '#ffffff', border: 'none', boxShadow: '0 3px 10px rgba(8,101,168,0.25)', transition: 'all 0.3s ease', cursor: 'pointer', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif' },
    enrollBtn: { width: '100%', borderRadius: '10px', background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)', padding: '12px 20px', fontWeight: 'bold', color: '#ffffff', border: 'none', boxShadow: '0 3px 10px rgba(26,122,60,0.25)', transition: 'all 0.3s ease', cursor: 'pointer', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif' },
    addToCartBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(8,101,168,0.35)' },
    enrollBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(26,122,60,0.35)' },
    addToCartBtnDisabled: { opacity: 0.6, cursor: 'not-allowed', transform: 'none' },
    detailsBtn: { width: '100%', borderRadius: '10px', border: '2px solid #0865a8', backgroundColor: '#ffffff', padding: '10px 20px', fontWeight: 'bold', color: '#0865a8', transition: 'all 0.3s ease', cursor: 'pointer', fontSize: '15px', fontFamily: '"Droid Arabic Kufi", serif' },
    detailsBtnHover: { backgroundColor: '#0865a8', color: '#ffffff', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(8,101,168,0.25)' },
    refundBtn: { width: '100%', padding: '12px 24px', backgroundColor: '#fff', color: '#e53935', border: '2px solid #e53935', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi", serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s' },
    refundBtnHover: { backgroundColor: '#e53935', color: '#ffffff', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(229,57,53,0.25)' },
    emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9f9f9', borderRadius: '16px', border: '2px dashed #0865a8' },
    emptyStateText: { fontSize: '20px', color: '#000000', fontFamily: '"Droid Arabic Kufi", serif', opacity: 0.7 },
    toast: { position: 'fixed', top: '100px', right: '20px', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '400px', animation: 'slideIn 0.3s ease-out', fontFamily: '"Droid Arabic Kufi", serif' },
    toastSuccess: { borderRight: '4px solid #4caf50' },
    toastError: { borderRight: '4px solid #f44336' },
    toastWarning: { borderRight: '4px solid #ff9800' },
    toastIcon: { width: '24px', height: '24px', flexShrink: 0 },
    toastMessage: { fontSize: '14px', color: '#000000', flex: 1 },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' },
    modalCard: { backgroundColor: '#ffffff', borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.22)', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', fontFamily: '"Droid Arabic Kufi", serif' },
    modalHeader: { background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff' },
    modalHeaderIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' },
    modalTitle: { fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: 0, fontFamily: '"Droid Arabic Kufi", serif' },
    modalSubtitle: { fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: '3px 0 0', fontFamily: '"Droid Arabic Kufi", serif', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    modalCloseBtn: { marginRight: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ffffff', flexShrink: 0 },
    modalBody: { padding: '20px' },
    refundInfoBox: { display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' },
    refundInfoText: { fontSize: '13px', color: '#1565c0', lineHeight: '1.5', fontFamily: '"Droid Arabic Kufi", serif', margin: 0 },
    formLabel: { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px', fontFamily: '"Droid Arabic Kufi", serif' },
    formInput: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', color: '#000000', outline: 'none', boxSizing: 'border-box', direction: 'rtl', transition: 'border-color 0.2s', marginBottom: '12px' },
    refundTextarea: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi", serif', color: '#000000', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: '1.5', direction: 'rtl' },
    charCount: { textAlign: 'left', fontSize: '11px', color: '#999', marginTop: '4px', marginBottom: '12px', fontFamily: '"Droid Arabic Kufi", serif' },
    errorBox: { display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#ffebee', border: '1px solid #ef9a9a', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#c62828', fontFamily: '"Droid Arabic Kufi", serif' },
    warningBox: { display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#795548', fontFamily: '"Droid Arabic Kufi", serif' },
    modalActions: { display: 'flex', gap: '10px', marginTop: '6px' },
    btnCancelRefund: { flex: 1, padding: '11px 16px', backgroundColor: '#f5f5f5', color: '#555', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi", serif' },
    btnSubmitRefund: { flex: 2, padding: '11px 16px', background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi", serif', boxShadow: '0 3px 10px rgba(229,57,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    successState: { textAlign: 'center', padding: '16px 0' },
    successIcon: { fontSize: '48px', marginBottom: '12px' },
    successTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1a7a3c', marginBottom: '10px', fontFamily: '"Droid Arabic Kufi", serif' },
    successText: { fontSize: '14px', color: '#555', lineHeight: '1.6', fontFamily: '"Droid Arabic Kufi", serif', marginBottom: '20px' },
    btnCloseSuccess: { padding: '11px 36px', background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi", serif' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi", serif' },
};

const mediaQueryStyles = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .grid { margin-left: auto !important; margin-right: auto !important; justify-items: center !important; }
    @media (max-width: 768px) {
        .main-container { margin-top: 100px !important; padding: 20px 16px 40px !important; }
        .grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        .overview-bar { padding: 10px 16px !important; }
        .card-header { height: 140px !important; }
        .card-body { padding: 16px !important; }
        .toast { right: 10px !important; left: 10px !important; max-width: calc(100% - 20px) !important; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
        .grid { grid-template-columns: repeat(2, 1fr) !important; gap: 22px !important; }
    }
    @media (min-width: 1025px) {
        .grid { grid-template-columns: repeat(3, 1fr) !important; gap: 22px !important; }
    }
    @media (min-width: 1921px) {
        .grid { grid-template-columns: repeat(4, 1fr) !important; gap: 28px !important; }
    }
`;

const REFUND_STATUS_MAP = {
    Pending: { label: 'قيد المراجعة', bg: '#fff8e1', color: '#f59e0b', icon: '⏳' },
    Approved: { label: 'تمت الموافقة', bg: '#e3f2fd', color: '#0865a8', icon: '✅' },
    Rejected: { label: 'مرفوض', bg: '#ffebee', color: '#e53935', icon: '❌' },
    Sent: { label: 'تم التحويل', bg: '#f0fff4', color: '#1a7a3c', icon: '💸' },
};

// ── helper: parse any server error into a readable Arabic string ──────────────
async function parseServerError(res) {
    const status = res.status;
    let body = '';
    try { body = await res.text(); } catch (_) { /* ignore */ }
    try {
        const j = JSON.parse(body);
        const msg = j.message || j.Message || j.error || j.Error || j.title || j.Title;
        if (msg) return `${msg} (${status})`;
    } catch (_) { /* not json */ }
    if (body && body.length < 300 && !body.trim().startsWith('<'))
        return `${body.trim()} (${status})`;
    const defaults = {
        400: 'بيانات الطلب غير صحيحة (400)',
        401: 'غير مصرح — يرجى تسجيل الدخول مجدداً (401)',
        403: 'ليس لديك صلاحية تنفيذ هذا الإجراء (403)',
        404: 'الطلب غير موجود أو الخدمة غير متاحة (404)',
        409: 'لديك طلب استرداد قيد المراجعة بالفعل',
        422: 'البيانات المدخلة غير مقبولة (422)',
        500: 'خطأ في الخادم، يرجى المحاولة لاحقاً (500)',
    };
    return defaults[status] || `حدث خطأ غير متوقع (${status})`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
    const colors = { success: '#4caf50', error: '#f44336', warning: '#ff9800' };
    const paths = {
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    };
    const borderMap = { success: styles.toastSuccess, error: styles.toastError, warning: styles.toastWarning };
    return (
        <div style={{ ...styles.toast, ...borderMap[type] }}>
            <svg style={{ ...styles.toastIcon, color: colors[type] }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={paths[type]} />
            </svg>
            <span style={styles.toastMessage}>{message}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// ── RefundModal ───────────────────────────────────────────────────────────────
const RefundModal = ({ course, onClose, getToken }) => {
    const [refundReason, setRefundReason] = useState('');
    const [bankName, setBankName] = useState('');
    const [iban, setIban] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [existingRefund, setExistingRefund] = useState(null);
    const [loadingCheck, setLoadingCheck] = useState(true);

    // safe token
    const safeToken = useCallback(async () => {
        try { return await getToken(); } catch (_) { return null; }
    }, [getToken]);

    // check for existing refund on mount
    useEffect(() => {
        (async () => {
            try {
                const token = await safeToken();
                if (!token) { setLoadingCheck(false); return; }

                const res = await fetch(`${API_BASE}/refund/my`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // 404 / 204 = no refunds at all — that's fine
                if (res.status === 404 || res.status === 204) { setLoadingCheck(false); return; }
                if (!res.ok) { setLoadingCheck(false); return; }

                const data = await res.json();
                const list = Array.isArray(data) ? data : (data?.data ?? data?.items ?? data?.result ?? []);
                const cid = String(course.id);

                const match = list.find(r =>
                    String(r.planworkId ?? '') === cid ||
                    String(r.planWorkId ?? '') === cid ||
                    String(r.PlanworkId ?? '') === cid ||
                    String(r.courseId ?? '') === cid ||
                    String(r.CourseId ?? '') === cid
                );
                if (match) setExistingRefund(match);
            } catch {
                // silently ignore — just show the form
            } finally {
                setLoadingCheck(false);
            }
        })();
    }, [course.id, safeToken]);

    const handleSubmit = async () => {
        if (!refundReason.trim()) { setError('الرجاء كتابة سبب طلب الاسترداد'); return; }
        setSubmitting(true); setError(null);
        try {
            const token = await safeToken();
            if (!token) { setError('يجب تسجيل الدخول أولاً'); return; }

            // ── KEY FIX: look up the enrollment record to get the real planWorkId ──
            let planWorkId = course.id; // fallback
            try {
                const myCoursesRes = await fetch(`${API_BASE}/course/my-courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (myCoursesRes.ok) {
                    const myList = await myCoursesRes.json();
                    const cid = String(course.id);
                    const enrollment = myList.find(e =>
                        String(e.childId) === cid ||
                        String(e.courseId) === cid ||
                        String(e.CourseId) === cid ||
                        String(e.planWorkId) === cid ||
                        String(e.planworkId) === cid
                    );
                    if (enrollment) {
                        planWorkId = enrollment.id ?? enrollment.planWorkId ?? enrollment.planworkId ?? course.id;
                    }
                }
            } catch { /* use fallback */ }

            const payload = {
                planworkId: planWorkId,
                planWorkId: planWorkId,
                PlanworkId: planWorkId,
                courseId: course.id,
                CourseId: course.id,
                courseTitle: course.title,
                reason: refundReason.trim(),
                bankName: bankName.trim() || null,
                iban: iban.trim() || null,
                requestedAt: new Date().toISOString(),
            };

            const res = await fetch(`${API_BASE}/refund`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            if (res.status === 409) { setError('لديك طلب استرداد قيد المراجعة بالفعل لهذه الدورة'); return; }
            if (!res.ok) { setError(await parseServerError(res)); return; }

            setSuccess(true);
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى');
        } finally {
            setSubmitting(false);
        }
    };

    const statusInfo = existingRefund ? REFUND_STATUS_MAP[existingRefund.status] : null;

    return (
        <div style={styles.modalOverlay} dir="rtl" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={styles.modalCard}>
                {/* header */}
                <div style={styles.modalHeader}>
                    <div style={styles.modalHeaderIcon}>💸</div>
                    <div style={{ flex: 1 }}>
                        <h2 style={styles.modalTitle}>طلب استرداد المبلغ</h2>
                        <p style={styles.modalSubtitle}>{course.title}</p>
                    </div>
                    <button onClick={onClose} style={styles.modalCloseBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* body */}
                <div style={styles.modalBody}>
                    {loadingCheck ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120px' }}>
                            <svg style={{ width: '36px', height: '36px', color: '#0865a8', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>

                    ) : existingRefund && !success ? (
                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <div style={{ fontSize: '44px', marginBottom: '12px' }}>{statusInfo?.icon}</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '10px', fontFamily: '"Droid Arabic Kufi", serif' }}>لديك طلب استرداد مسبق</h3>
                            <div style={{ ...styles.statusBadge, backgroundColor: statusInfo?.bg, color: statusInfo?.color, margin: '0 auto 14px', display: 'inline-flex' }}>{statusInfo?.label}</div>
                            {existingRefund.status === 'Rejected' && existingRefund.rejectionReason && (
                                <div style={{ ...styles.warningBox, textAlign: 'right', marginTop: '10px' }}>
                                    <div><strong style={{ display: 'block', marginBottom: '4px' }}>سبب الرفض:</strong>{existingRefund.rejectionReason}</div>
                                </div>
                            )}
                            {existingRefund.status === 'Sent' && <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', fontFamily: '"Droid Arabic Kufi", serif', marginBottom: '16px' }}>تم تحويل المبلغ بنجاح.</p>}
                            {existingRefund.status === 'Pending' && <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', fontFamily: '"Droid Arabic Kufi", serif', marginBottom: '16px' }}>طلبك قيد المراجعة. سنتواصل معك خلال 3-5 أيام عمل.</p>}
                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '6px', textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: '#888', fontFamily: '"Droid Arabic Kufi", serif' }}>رقم الطلب: <strong style={{ color: '#0865a8' }}>{existingRefund.refNumber || `#${existingRefund.id}`}</strong></div>
                                {existingRefund.requestedAt && <div style={{ fontSize: '12px', color: '#888', fontFamily: '"Droid Arabic Kufi", serif', marginTop: '4px' }}>تاريخ الطلب: {new Date(existingRefund.requestedAt).toLocaleDateString('ar-EG')}</div>}
                            </div>
                            <button style={{ ...styles.btnCancelRefund, width: '100%', marginTop: '16px' }} onClick={onClose}>إغلاق</button>
                        </div>

                    ) : success ? (
                        <div style={styles.successState}>
                            <div style={styles.successIcon}>✅</div>
                            <h3 style={styles.successTitle}>تم إرسال طلبك بنجاح!</h3>
                            <p style={styles.successText}>سيقوم فريق الدعم بمراجعة طلبك والرد عليك خلال 3-5 أيام عمل.</p>
                            <button style={styles.btnCloseSuccess} onClick={onClose}>حسناً، شكراً</button>
                        </div>

                    ) : (
                        <>
                            <div style={styles.refundInfoBox}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0865a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p style={styles.refundInfoText}>سيتم مراجعة طلبك من قِبل الإدارة خلال 3-5 أيام عمل.</p>
                            </div>

                            <label style={styles.formLabel}>سبب طلب الاسترداد <span style={{ color: '#e53935' }}>*</span></label>
                            <textarea
                                style={styles.refundTextarea}
                                placeholder="يرجى توضيح سبب رغبتك في استرداد المبلغ..."
                                value={refundReason}
                                onChange={e => { setRefundReason(e.target.value); setError(null); }}
                                rows={3}
                                maxLength={500}
                            />
                            <div style={styles.charCount}>{refundReason.length} / 500</div>

                            <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '12px', marginBottom: '4px' }}>
                                <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px', fontFamily: '"Droid Arabic Kufi", serif' }}>بيانات بنكية (اختياري)</p>
                                <label style={styles.formLabel}>اسم البنك</label>
                                <input style={styles.formInput} type="text" placeholder="مثال: بنك مصر" value={bankName} onChange={e => setBankName(e.target.value)} maxLength={100} />
                                <label style={styles.formLabel}>رقم الـ IBAN أو الحساب</label>
                                <input style={styles.formInput} type="text" placeholder="EG00 0000 0000 0000 0000 0000 0000" value={iban} onChange={e => setIban(e.target.value)} maxLength={34} dir="ltr" />
                            </div>

                            {error && (
                                <div style={styles.errorBox}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div style={styles.modalActions}>
                                <button style={styles.btnCancelRefund} onClick={onClose}>إلغاء</button>
                                <button
                                    style={{ ...styles.btnSubmitRefund, ...(submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <svg style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            جاري الإرسال...
                                        </>
                                    ) : 'إرسال الطلب'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const CoursesPage = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { getToken, isSignedIn, userId } = useAuth();

    const [programData, setProgramData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);
    const [toast, setToast] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredAddBtn, setHoveredAddBtn] = useState(null);
    const [hoveredDetailsBtn, setHoveredDetailsBtn] = useState(null);
    const [hoveredRefundBtn, setHoveredRefundBtn] = useState(null);
    const [hoveredHeaderCard, setHoveredHeaderCard] = useState(null);
    const [refundCourse, setRefundCourse] = useState(null);
    const [ownedCourseIds, setOwnedCourseIds] = useState(new Set());
    const [certificates, setCertificates] = useState({});

    const showToast = (message, type = 'success') => setToast({ message, type });

    // ── safe token getter ────────────────────────────────────────────────────
    const safeGetToken = useCallback(async () => {
        try { return await getToken(); } catch (_) { return null; }
    }, [getToken]);

    // ── ownership ────────────────────────────────────────────────────────────
    const fetchOwnedCourses = useCallback(async () => {
        if (!isSignedIn) { setOwnedCourseIds(new Set()); return; }
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/course/my-courses`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const data = await res.json();
            setOwnedCourseIds(new Set(data.map(e => e.childId)));
        } catch { setOwnedCourseIds(new Set()); }
    }, [isSignedIn, safeGetToken]);

    // ── certificates ─────────────────────────────────────────────────────────
    const fetchCertificates = useCallback(async () => {
        if (!isSignedIn || !userId) return;
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/admin/certificates/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const data = await res.json();
            const map = {};
            (Array.isArray(data) ? data : []).forEach(c => { if (c.courseId) map[c.courseId] = c; });
            setCertificates(map);
        } catch { /* optional */ }
    }, [isSignedIn, safeGetToken, userId]);

    useEffect(() => { fetchOwnedCourses(); }, [fetchOwnedCourses]);
    useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

    useEffect(() => {
        const onUpdate = () => { fetchOwnedCourses(); fetchCertificates(); };
        window.addEventListener('enrollUpdated', onUpdate);
        window.addEventListener('cartUpdated', onUpdate);
        return () => {
            window.removeEventListener('enrollUpdated', onUpdate);
            window.removeEventListener('cartUpdated', onUpdate);
        };
    }, [fetchOwnedCourses, fetchCertificates]);

    // ── load program courses ─────────────────────────────────────────────────
    useEffect(() => {
        if (!slug) return;
        (async () => {
            try {
                setLoading(true); setError(null);
                const res = await fetch(`${API_BASE}/course/programs/${slug}/courses`);
                if (!res.ok) { if (res.status === 404) throw new Error('البرنامج غير موجود'); throw new Error('فشل في تحميل البيانات'); }
                setProgramData(await res.json());
            } catch (err) { setError(err.message); showToast(err.message, 'error'); }
            finally { setLoading(false); }
        })();
    }, [slug]);

    useEffect(() => {
        document.title = programData?.programName
            ? `${programData.programName} - المعهد التكنولوجي`
            : 'الدورات التدريبية - المعهد التكنولوجي';
    }, [programData]);

    const handleEnroll = (course) => {
        showToast('تم التسجيل في الدورة بنجاح', 'success');
        setTimeout(() => navigate('/my-courses'), 1000);
    };

    const addToCart = async (course) => {
        if (!isSignedIn) { showToast('الرجاء تسجيل الدخول أولاً', 'warning'); return; }
        setAddingToCart(course.id);
        try {
            const token = await safeGetToken();
            if (!token) { showToast('انتهت الجلسة، سجل دخول مرة أخرى', 'error'); return; }
            const res = await fetch(`${API_BASE}/cart/add/${course.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: course.id, quantity: 1 }),
            });
            if (!res.ok) {
                const msgs = { 401: 'انتهت الجلسة، سجل دخول مرة أخرى', 404: 'الدورة غير موجودة', 409: 'الدورة موجودة بالفعل في السلة', 500: 'خطأ في الخادم' };
                throw new Error(msgs[res.status] || 'فشل إضافة الدورة');
            }
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (!cartItems.some(i => i.id === course.id)) {
                cartItems.push({ id: course.id, title: course.title, instructor: course.place || 'غير محدد', image: 'book', currentPrice: course.cost || 0, originalPrice: course.cost ? course.cost / 0.6 : 0, quantity: 1, slug: course.slug || '', date: course.date || '', place: course.place || '' });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                window.dispatchEvent(new Event('cartUpdated'));
            }
            showToast('تمت إضافة الدورة إلى السلة بنجاح', 'success');
        } catch (err) { showToast(err.message || 'حدث خطأ', 'error'); }
        finally { setAddingToCart(null); }
    };

    // ── loading / error states ────────────────────────────────────────────────
    if (loading) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                <div style={styles.overviewBar} className="overview-bar">
                    <div style={styles.overviewBarText}>
                        <a href="/" style={styles.breadcrumbLink}>الصفحة الرئيسية</a>
                        <span style={styles.breadcrumbSeparator}>•</span>
                        <span style={styles.breadcrumbCurrent}>جاري التحميل...</span>
                    </div>
                </div>
                <div style={styles.loadingContainer}>
                    <svg style={{ width: '60px', height: '60px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            </div>
        </>
    );

    if (error) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                <div style={styles.overviewBar}><div style={styles.overviewBarText}><a href="/" style={styles.breadcrumbLink}>الصفحة الرئيسية</a><span style={styles.breadcrumbSeparator}>•</span><span style={styles.breadcrumbCurrent}>خطأ</span></div></div>
                <div style={styles.errorContainer}><div>{error}</div><button onClick={() => window.location.reload()} style={{ ...styles.addToCartBtn, width: 'auto', minWidth: '200px' }}>إعادة المحاولة</button></div>
            </div>
        </>
    );

    const courses = programData?.courses || [];

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Droid Arabic Kufi", serif !important; } ${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {/* refund modal — passes safeGetToken wrapper */}
                {refundCourse && (
                    <RefundModal
                        course={refundCourse}
                        getToken={safeGetToken}
                        onClose={() => setRefundCourse(null)}
                    />
                )}

                <div style={{ ...styles.overviewBar, top: 70 }} className="overview-bar">
                    <div style={styles.overviewBarText}>
                        <a href="/" style={styles.breadcrumbLink}
                            onMouseEnter={e => e.target.style.color = '#f57c00'}
                            onMouseLeave={e => e.target.style.color = '#0865a8'}>الصفحة الرئيسية</a>
                        <span style={styles.breadcrumbSeparator}>•</span>
                        <span style={styles.breadcrumbCurrent}>{programData?.programName || ''}</span>
                    </div>
                </div>

                <div style={styles.mainContainer} className="main-container">
                    <div style={styles.pageHeader} className="page-header">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <h1 style={styles.h1} className="page-title">{programData?.programName || 'الدورات التدريبية'}</h1>
                            <div style={styles.h1Underline} />
                        </div>
                        <p style={styles.subtitle} className="page-subtitle">اختر الدورة المناسبة لك وابدأ رحلتك التعليمية</p>
                    </div>

                    {courses.length === 0 ? (
                        <div style={styles.emptyState}><div style={styles.emptyStateText}>لا توجد دورات متاحة حالياً</div></div>
                    ) : (
                        <div style={styles.grid} className="grid">
                            {courses.map((course) => {
                                const isFree = !course.cost || course.cost === 0;
                                const isOwned = ownedCourseIds.has(course.id);
                                const isAdding = addingToCart === course.id;
                                const currentPrice = course.cost;
                                const originalPrice = course.cost ? course.cost / 0.6 : null;
                                const cert = certificates[course.id] || null;

                                return (
                                    <div key={course.id}
                                        style={{ ...styles.card, ...(hoveredCard === course.id ? styles.cardHover : {}) }}
                                        onMouseEnter={() => setHoveredCard(course.id)}
                                        onMouseLeave={() => setHoveredCard(null)}>

                                        {/* card header */}
                                        <div
                                            style={{ ...styles.cardHeader, ...(isOwned ? styles.cardHeaderOwned : isFree ? styles.cardHeaderFree : {}) }}
                                            className="card-header"
                                            onMouseEnter={() => setHoveredHeaderCard(course.id)}
                                            onMouseLeave={() => setHoveredHeaderCard(null)}>
                                            <div style={{ ...styles.cardHeaderOverlay, ...(isFree ? styles.cardHeaderOverlayFree : {}), ...(hoveredHeaderCard === course.id ? styles.cardHeaderOverlayHover : {}) }} />
                                            <div style={styles.iconWrapper}>
                                                <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            {isOwned ? <div style={styles.ownedBadge}>✅ مسجل</div> : isFree ? <div style={styles.freeBadge}>مجاناً</div> : <div style={styles.discountBadge}>خصم 40%</div>}
                                            {isOwned && cert && <div style={styles.certCardRibbon}>📜 شهادة</div>}
                                        </div>

                                        {/* card body */}
                                        <div style={styles.cardBody} className="card-body">
                                            <h3 style={styles.courseTitle}>{course.title}</h3>
                                            <div style={styles.infoSection}>
                                                {course.place && (
                                                    <div style={styles.infoRow}>
                                                        <svg style={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                        <span style={styles.clampText}>{course.place}</span>
                                                    </div>
                                                )}
                                                {course.date && (
                                                    <div style={styles.infoRow}>
                                                        <svg style={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <span>{course.date}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {course.description && <p style={styles.description}>{course.description}</p>}

                                            {/* price */}
                                            <div style={styles.priceSection}>
                                                <div style={styles.priceContainer}>
                                                    {isOwned ? (
                                                        <><span style={{ ...styles.freePriceLabel, color: '#4a4a8a' }}>مسجل ✓</span><span style={styles.priceLabel}>لديك هذه الدورة بالفعل</span></>
                                                    ) : isFree ? (
                                                        <><span style={styles.freePriceLabel}>مجاناً</span><span style={styles.priceLabel}>دورة مجانية بالكامل</span></>
                                                    ) : (
                                                        <><span style={styles.originalPrice}>{originalPrice?.toFixed(2)} ج.م</span><span style={styles.currentPrice}>{currentPrice?.toFixed(2)} ج.م</span><span style={styles.priceLabel}>السعر الشامل</span></>
                                                    )}
                                                </div>
                                            </div>

                                            {/* buttons */}
                                            <div style={styles.buttonsContainer}>
                                                {isOwned ? (
                                                    <>
                                                        {cert && (
                                                            <a href={cert.url} download={cert.name} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={styles.certDownloadBtn}>
                                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                                                <span>📜 شهادتك جاهزة — تحميل</span>
                                                                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                                                            </a>
                                                        )}
                                                        <button
                                                            style={{ ...styles.detailsBtn, ...(hoveredDetailsBtn === course.id ? styles.detailsBtnHover : {}) }}
                                                            onMouseEnter={() => setHoveredDetailsBtn(course.id)}
                                                            onMouseLeave={() => setHoveredDetailsBtn(null)}
                                                            onClick={() => navigate(`/course/${course.slug}`)}>
                                                            عرض التفاصيل
                                                        </button>
                                                        {!isFree && (
                                                            <button
                                                                style={{ ...styles.refundBtn, ...(hoveredRefundBtn === course.id ? styles.refundBtnHover : {}) }}
                                                                onMouseEnter={() => setHoveredRefundBtn(course.id)}
                                                                onMouseLeave={() => setHoveredRefundBtn(null)}
                                                                onClick={() => setRefundCourse(course)}>
                                                                💸 طلب استرداد المبلغ
                                                            </button>
                                                        )}
                                                    </>
                                                ) : isFree ? (
                                                    <>
                                                        <button onClick={() => handleEnroll(course)} style={{ ...styles.enrollBtn, ...(hoveredAddBtn === course.id ? styles.enrollBtnHover : {}) }} onMouseEnter={() => setHoveredAddBtn(course.id)} onMouseLeave={() => setHoveredAddBtn(null)}>اشترك الآن</button>
                                                        <button style={{ ...styles.detailsBtn, ...(hoveredDetailsBtn === course.id ? styles.detailsBtnHover : {}) }} onMouseEnter={() => setHoveredDetailsBtn(course.id)} onMouseLeave={() => setHoveredDetailsBtn(null)} onClick={() => navigate(`/course/${course.slug}`)}>عرض التفاصيل</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => addToCart(course)}
                                                            disabled={isAdding}
                                                            style={{ ...styles.addToCartBtn, ...(hoveredAddBtn === course.id && !isAdding ? styles.addToCartBtnHover : {}), ...(isAdding ? styles.addToCartBtnDisabled : {}) }}
                                                            onMouseEnter={() => !isAdding && setHoveredAddBtn(course.id)}
                                                            onMouseLeave={() => setHoveredAddBtn(null)}>
                                                            {isAdding ? (
                                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                    <svg style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                                    جاري الإضافة...
                                                                </span>
                                                            ) : 'أضف إلى السلة'}
                                                        </button>
                                                        <button style={{ ...styles.detailsBtn, ...(hoveredDetailsBtn === course.id ? styles.detailsBtnHover : {}) }} onMouseEnter={() => setHoveredDetailsBtn(course.id)} onMouseLeave={() => setHoveredDetailsBtn(null)} onClick={() => navigate(`/course/${course.slug}`)}>عرض التفاصيل</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CoursesPage;