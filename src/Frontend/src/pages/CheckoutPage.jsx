import { useState, useEffect, useRef } from "react";
import { ArrowRight, ShieldCheck, Lock, CheckCircle, Tag, BookOpen, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = "https://localhost:7177";

const movePurchasedToEnrolled = (cartItems) => {
    try {
        const existingEnrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        const existingPurchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
        cartItems.forEach(item => {
            const courseObj = {
                id: item.id, slug: item.slug || '', title: item.title,
                place: item.place || item.instructor || '',
                instructor: item.instructor || item.place || 'غير محدد',
                date: item.date || '', image: item.image || 'book',
                currentPrice: item.currentPrice || 0, progress: 0,
            };
            if (!existingEnrolled.find(e => e.id === item.id)) existingEnrolled.push(courseObj);
            if (!existingPurchased.find(e => e.id === item.id)) existingPurchased.push(courseObj);
        });
        localStorage.setItem('enrolledCourses', JSON.stringify(existingEnrolled));
        localStorage.setItem('purchasedCourses', JSON.stringify(existingPurchased));
        window.dispatchEvent(new Event('enrollUpdated'));
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) { }
};

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [error, setError] = useState("");
    const [orderId, setOrderId] = useState(null);
    const [orderAmount, setOrderAmount] = useState(0);

    const successIndicatorRef = useRef(null);
    const orderIdRef = useRef(null);
    const subtotalRef = useRef(0);
    const getTokenRef = useRef(null);
    const cartItemsRef = useRef([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            setCartItems(parsed);
            cartItemsRef.current = parsed;
        }
    }, []);

    useEffect(() => {
        if (isSignedIn === false) { alert("يجب تسجيل الدخول أولاً"); navigate("/sign-in"); }
    }, [isSignedIn, navigate]);

    useEffect(() => { getTokenRef.current = getToken; }, [getToken]);
    useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdParam = urlParams.get("orderId");
        const transactionRef = urlParams.get("transactionRef");
        if (orderIdParam && transactionRef) verifyAfterRedirect(orderIdParam, transactionRef);
    }, []);

    useEffect(() => {
        window.completeCallback = async (resultIndicator) => {
            if (resultIndicator === successIndicatorRef.current) {
                try {
                    const token = await getTokenRef.current();
                    await fetch(`${API_BASE}/api/checkout/result?orderId=${orderIdRef.current}&transactionRef=${resultIndicator}`,
                        { method: "GET", headers: { Authorization: `Bearer ${token}` } });
                } catch (_) { }
                movePurchasedToEnrolled(cartItemsRef.current);
                localStorage.removeItem("cartItems");
                window.dispatchEvent(new Event("cartUpdated"));
                setPaymentSuccess(true);
                setOrderId(orderIdRef.current);
                setOrderAmount(subtotalRef.current);
            } else {
                setLoading(false);
                setError("فشل التحقق من الدفع. يرجى التواصل مع الدعم الفني.");
            }
        };
        window.errorCallback = (err) => {
            setLoading(false);
            setError("حدث خطأ أثناء الدفع: " + (err?.error?.explanation || "يرجى المحاولة مرة أخرى."));
        };
        window.cancelCallback = () => { setLoading(false); setError("تم إلغاء عملية الدفع."); };
        return () => { delete window.completeCallback; delete window.errorCallback; delete window.cancelCallback; };
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + item.currentPrice * (item.quantity || 1), 0);
    const totalOriginalPrice = cartItems.reduce((sum, item) => sum + item.originalPrice * (item.quantity || 1), 0);
    const totalDiscount = totalOriginalPrice - subtotal;
    useEffect(() => { subtotalRef.current = subtotal; }, [subtotal]);

    const verifyAfterRedirect = async (oid, transactionRef) => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/api/checkout/result?orderId=${oid}&transactionRef=${transactionRef}`,
                { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.isSuccess) {
                const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
                movePurchasedToEnrolled(savedCart);
                localStorage.removeItem("cartItems");
                window.dispatchEvent(new Event("cartUpdated"));
                setPaymentSuccess(true); setOrderId(oid); setOrderAmount(subtotalRef.current);
            } else { setError("فشلت عملية الدفع. يرجى المحاولة مرة أخرى."); }
        } catch { setError("حدث خطأ أثناء التحقق من حالة الدفع."); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (cartItems.length === 0) { setError("السلة فارغة. يرجى إضافة دورات أولاً."); return; }
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("فشل في الحصول على رمز المصادقة");
            const response = await fetch(`${API_BASE}/api/checkout/checkout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `خطأ في الخادم: ${response.status}`);
            }
            const result = await response.json();
            if (!result.success || !result.data?.sessionId) throw new Error(result.message || "لم يتم استلام بيانات الجلسة من الخادم");
            const { sessionId, successIndicator, orderId } = result.data;
            successIndicatorRef.current = successIndicator;
            orderIdRef.current = orderId;
            setOrderId(orderId);
            if (!window.Checkout) throw new Error("بوابة الدفع لم تُحمَّل بعد. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
            window.Checkout.configure({ session: { id: sessionId } });
            window.Checkout.showPaymentPage();
        } catch (err) {
            let msg = "حدث خطأ أثناء معالجة الطلب";
            if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) msg = "فشل الاتصال بالخادم. تحقق من اتصال الإنترنت.";
            else if (err.message?.includes("401") || err.message?.includes("Unauthorized")) { msg = "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى."; setTimeout(() => navigate("/sign-in"), 2000); }
            else if (err.message) msg = err.message;
            setError(msg); setLoading(false);
        }
    };

    const Spinner = () => (
        <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    /* ── Inline SVG logos — never break regardless of network ── */
    const VisaLogo = () => (
        <svg style={{ height: 22, width: 'auto' }} viewBox="0 0 152 47" xmlns="http://www.w3.org/2000/svg">
            <path fill="#1A1F71" d="M62.4 45.6H50.5L57.8 1.4h11.9zM42.7 1.4L31.4 31.7l-1.3-6.6L26.2 5.2S25.7 1.4 21 1.4H2.1L2 2.1s5.7 1.2 12.4 5.2l10.3 38.3h12.4L55 1.4H42.7zm80.1 0h-11c-4 0-5 3.1-5 3.1L91.2 45.6h12.3l2.4-6.7h15l1.4 6.7h10.9L122.8 1.4zm-14.4 28.4l6.2-17.1 3.5 17.1h-9.7zm-27.1-18s-5.5-2.8-11.3-2.8c-6.2 0-21 2.7-21 16.2 0 12.6 17.6 12.8 17.6 19.4 0 .8-.7 6.6-11.5 6.6-10.8 0-15.8-5.7-15.8-5.7l-2.8 9.8s6.2 4 16.7 4c10.6 0 22.7-6.1 22.7-18.4 0-12.6-17.7-13.7-17.7-19.5 0-1.5 1.4-5.7 9.8-5.7 7.9 0 12.7 3.7 12.7 3.7l2.6-7.6z" />
        </svg>
    );

    const MastercardLogo = () => (
        <svg style={{ height: 30, width: 'auto' }} viewBox="0 0 131.39 86.9" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#FF5F00" x="48.37" width="34.65" height="86.9" />
            <path fill="#EB001B" d="M51.94 43.45a55.2 55.2 0 0 1 14.12-37.42A48.19 48.19 0 0 0 0 43.45a48.19 48.19 0 0 0 66.06 43.42A55.2 55.2 0 0 1 51.94 43.45z" />
            <path fill="#F79E1B" d="M131.39 43.45A48.19 48.19 0 0 0 65.33 0a55.23 55.23 0 0 1 0 86.87 48.19 48.19 0 0 0 66.06-43.42z" />
        </svg>
    );

    // ════════ SUCCESS ════════
    if (paymentSuccess) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`* { font-family: "Droid Arabic Kufi", serif !important; }`}</style>
                <div dir="rtl" style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
                    <div style={{ width: '100%', maxWidth: 480 }}>
                        <div style={{ borderRadius: 24, background: '#fff', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
                            <div style={{ margin: '0 auto 1.5rem', width: 88, height: 88, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle style={{ width: 52, height: 52, color: '#16a34a' }} />
                            </div>
                            <h1 style={{ fontSize: 'clamp(1.3rem,4vw,1.8rem)', fontWeight: 700, marginBottom: '1rem' }}>تم إتمام عملية الدفع بنجاح!</h1>
                            <p style={{ color: '#666', marginBottom: '2rem', fontSize: 'clamp(0.85rem,2vw,1rem)' }}>شكراً لك! تم تأكيد طلبك وتم إضافة الدورات إلى حسابك</p>
                            <div style={{ borderRadius: 16, border: '1px solid #e5e7eb', background: '#f9fafb', padding: '1.5rem', marginBottom: '2rem' }}>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 4 }}>رقم الطلب</p>
                                <p style={{ fontSize: 'clamp(1.2rem,4vw,1.6rem)', fontWeight: 700, color: '#0865a8' }}>{orderId || "N/A"}</p>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '1rem 0 4px' }}>المبلغ المدفوع</p>
                                <p style={{ fontSize: 'clamp(1.5rem,5vw,2rem)', fontWeight: 700, color: '#f57c00' }}>{(orderAmount || subtotal).toFixed(2)} جنيه</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <Link to="/my-courses" style={{ display: 'block', borderRadius: 12, background: 'linear-gradient(90deg,#0865a8,#f57c00)', padding: '0.85rem', fontWeight: 700, color: '#fff', textDecoration: 'none', textAlign: 'center' }}>عرض دوراتي</Link>
                                <Link to="/" style={{ display: 'block', borderRadius: 12, border: '2px solid #e5e7eb', padding: '0.85rem', fontWeight: 700, color: '#000', textDecoration: 'none', textAlign: 'center' }}>الصفحة الرئيسية</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ════════ CHECKOUT ════════
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`
                * { font-family: "Droid Arabic Kufi", serif !important; }
                .co-wrap { padding-top: 108px; }
                @media (min-width: 768px)  { .co-wrap { padding-top: 128px; } }
                @media (min-width: 1024px) { .co-wrap { padding-top: 138px; } }
            `}</style>

            {/* Breadcrumb */}
            <div style={{ position: 'fixed', top: 70, left: 0, right: 0, zIndex: 40, background: '#F5F7E1', borderBottom: '1px solid #d1d5db', padding: '6px 12px', textAlign: 'center', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>
                <a href="/" style={{ color: '#374151', textDecoration: 'none' }}>الصفحة الرئيسية</a>
                <span style={{ margin: '0 6px', color: '#9ca3af' }}>-</span>
                <Link to="/cart" style={{ color: '#374151', textDecoration: 'none' }}>سلة التسوق</Link>
                <span style={{ margin: '0 6px', color: '#9ca3af' }}>-</span>
                <span style={{ fontWeight: 700, color: '#111' }}>إتمام الدفع</span>
            </div>

            <div dir="rtl" className="co-wrap" style={{ minHeight: '100vh', background: '#fff', paddingBottom: '4rem' }}>

                {/* Title */}
                <div style={{ textAlign: 'center', padding: 'clamp(1rem,4vw,2rem) 1rem clamp(0.75rem,3vw,1.5rem)' }}>
                    <h1 style={{ fontSize: 'clamp(1.4rem,5vw,3rem)', fontWeight: 700 }}>اشترك في دوراتنا</h1>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ maxWidth: 900, margin: '0 auto 1.5rem', padding: '0 12px' }}>
                        <div style={{ background: '#fef2f2', borderRadius: 10, padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <AlertCircle style={{ width: 20, height: 20, color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p style={{ fontWeight: 700, color: '#991b1b' }}>خطأ في الدفع</p>
                                    <p style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: 4 }}>{error}</p>
                                    <button onClick={() => setError("")} style={{ marginTop: 8, fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>إغلاق</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Centered content container ── */}
                <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(8px, 3vw, 24px)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'stretch' }}>

                        {/* On lg+: side by side via CSS */}
                        <style>{`
                            @media (min-width: 1024px) {
                                .co-grid { flex-direction: row !important; align-items: flex-start !important; }
                                .co-left { flex: 1 1 0%; }
                                .co-right { width: 340px; flex-shrink: 0; position: sticky; top: 144px; }
                            }
                            @media (min-width: 1280px) { .co-right { width: 380px; } }
                            @media (min-width: 1920px) { .co-right { width: 420px; } }
                        `}</style>

                        <div className="co-grid" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* ── LEFT: Payment details ── */}
                            <div className="co-left">
                                <div style={{ borderRadius: 16, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', padding: 'clamp(14px,3vw,24px)' }}>
                                    <h2 style={{ fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', fontWeight: 700, marginBottom: 'clamp(12px,3vw,20px)' }}>تفاصيل الدفع</h2>

                                    {/* Card option */}
                                    <div style={{ borderRadius: 12, border: '2px solid #0865a8', background: 'rgba(8,101,168,0.04)', padding: 'clamp(10px,2.5vw,18px)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {/* Radio */}
                                            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #0865a8', background: '#0865a8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                                            </div>
                                            {/* Text */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 700, fontSize: 'clamp(0.8rem,2vw,0.95rem)' }}>بطاقة ائتمان/خصم مباشر</p>
                                                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Visa, Mastercard</p>
                                            </div>
                                            {/* Logos */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                                <VisaLogo />
                                                <MastercardLogo />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security */}
                                    <div style={{ marginTop: 12, borderRadius: 12, background: '#f0fdf4', padding: 'clamp(10px,2.5vw,16px)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <ShieldCheck style={{ width: 18, height: 18, color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: 'clamp(0.78rem,2vw,0.9rem)' }}>معاملة آمنة ومشفرة بالكامل</p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 2 }}>معلوماتك محمية بأعلى معايير الأمان العالمية</p>
                                        </div>
                                    </div>

                                    {/* Mobile pay button */}
                                    <button onClick={handleSubmit} disabled={loading || cartItems.length === 0}
                                        style={{ marginTop: 16, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: 'linear-gradient(90deg,#0865a8,#f57c00)', padding: '0.85rem', fontWeight: 700, color: '#fff', border: 'none', cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer', opacity: loading || cartItems.length === 0 ? 0.7 : 1 }}
                                        className="co-mobile-btn"
                                    >
                                        {loading ? <><Spinner />جاري المعالجة...</> : <>المتابعة إلى الدفع <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(180deg)' }} /></>}
                                    </button>
                                    <style>{`@media (min-width: 1024px) { .co-mobile-btn { display: none !important; } }`}</style>
                                </div>
                            </div>

                            {/* ── RIGHT: Order summary ── */}
                            <div className="co-right">
                                <div style={{ borderRadius: 16, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', padding: 'clamp(14px,3vw,24px)' }}>

                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}>
                                        <span style={{ fontWeight: 700, fontSize: 'clamp(0.85rem,2.5vw,1rem)' }}>
                                            {cartItems.length === 0 ? "السلة فارغة" : cartItems.length === 1 ? "دورة واحدة" : `${cartItems.length} دورات`}
                                        </span>
                                        <Link to="/cart" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0865a8', textDecoration: 'none' }}>تغيير</Link>
                                    </div>

                                    {/* Courses */}
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>ملخص الطلب</p>
                                    <div style={{ maxHeight: 210, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                                        {cartItems.map((item) => (
                                            <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg,#0865a8,#f57c00)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BookOpen style={{ width: 22, height: 22, color: '#fff' }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 'clamp(0.75rem,2vw,0.875rem)', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                                                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f57c00', marginTop: 4 }}>{(item.currentPrice * (item.quantity || 1)).toFixed(2)} جنيه</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Subtotal */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'clamp(0.78rem,2vw,0.875rem)', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                                            <span>المجموع الفرعي</span><span>{totalOriginalPrice.toFixed(2)} جنيه</span>
                                        </div>
                                        {totalDiscount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                                                <span>الخصم</span><span>-{totalDiscount.toFixed(2)} جنيه</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Coupon */}
                                    <div style={{ marginBottom: 16 }}>
                                        {!showCoupon ? (
                                            <button onClick={() => setShowCoupon(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, border: '1px solid #d1d5db', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 600, background: '#fff', cursor: 'pointer' }}>
                                                <Tag style={{ width: 15, height: 15 }} />استخدم كود الخصم
                                            </button>
                                        ) : (
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="أدخل كود الخصم"
                                                    style={{ flex: 1, borderRadius: 10, border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', fontSize: '0.85rem', outline: 'none' }} />
                                                <button onClick={() => couponCode.trim() && alert("سيتم تطبيق الكود عند إتمام الدفع")}
                                                    style={{ borderRadius: 10, background: '#0865a8', color: '#fff', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
                                                    تطبيق
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 16 }} />

                                    {/* Total */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <span style={{ fontWeight: 700, fontSize: 'clamp(0.9rem,2.5vw,1rem)' }}>إجمالي المستحق</span>
                                        <span style={{ fontWeight: 700, fontSize: 'clamp(1.2rem,3vw,1.5rem)', color: '#f57c00' }}>{subtotal.toFixed(2)} جنيه</span>
                                    </div>

                                    {/* Desktop pay button */}
                                    <button onClick={handleSubmit} disabled={loading || cartItems.length === 0}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: 'linear-gradient(90deg,#0865a8,#f57c00)', padding: '0.9rem', fontWeight: 700, color: '#fff', border: 'none', cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer', opacity: loading || cartItems.length === 0 ? 0.7 : 1, marginBottom: 12 }}
                                    >
                                        {loading ? <><Spinner />جاري المعالجة...</> : <>المتابعة إلى الدفع <ArrowRight style={{ width: 20, height: 20, transform: 'rotate(180deg)' }} /></>}
                                    </button>

                                    {/* SSL badge */}
                                    <div style={{ borderRadius: 10, background: '#f9fafb', padding: '0.75rem', textAlign: 'center' }}>
                                        <Lock style={{ width: 20, height: 20, opacity: 0.5, margin: '0 auto 6px' }} />
                                        <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>الدفع عبر بوابة بنك مصر الآمنة</p>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 2 }}>معاملة مشفرة بتقنية SSL</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 