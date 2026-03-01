/**
 * CheckoutPage.jsx
 *
 * CRITICAL FIX APPLIED:
 * Before calling Checkout.showPaymentPage(), we now save:
 *   - localStorage('pendingOrderId')  = orderId from backend
 *   - localStorage('pendingCartItems') = copy of cart items
 *   - localStorage('successIndicator') = successIndicator from backend
 *
 * This is because showPaymentPage() does a FULL PAGE REDIRECT.
 * The React state is lost. PaymentReturnPage.jsx reads these localStorage
 * keys to know which courses were purchased.
 *
 * The gateway redirect URL must be set to:
 *   https://<your-frontend-domain>/payment-return
 * NOT to your backend API URL.
 */

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ShieldCheck, Lock, Tag, BookOpen, AlertCircle, X, FileText, RotateCcw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

// ── Your deployed backend URL ─────────────────────────────────────────────────
const API_BASE = "https://acwebsite-icmet-test.azurewebsites.net";

// ── Terms & Conditions Modal ──────────────────────────────────────────────────
function TermsModal({ onClose }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.55)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            padding: '16px'
        }}>
            <div style={{
                background: '#fff', borderRadius: 18,
                width: '100%', maxWidth: 600,
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(90deg,#0865a8,#f57c00)',
                    padding: '18px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText style={{ width: 22, height: 22, color: '#fff' }} />
                        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
                            الشروط والأحكام وسياسة الاسترداد
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.2)', border: 'none',
                        borderRadius: '50%', width: 32, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#fff'
                    }}>
                        <X style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    overflowY: 'auto', padding: '24px',
                    direction: 'rtl', lineHeight: 1.9,
                    color: '#374151', fontSize: '0.875rem'
                }}>

                    {/* Refund Policy - highlighted */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
                        border: '2px solid #f57c00',
                        borderRadius: 14, padding: '18px 20px',
                        marginBottom: 24
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <RotateCcw style={{ width: 22, height: 22, color: '#f57c00', flexShrink: 0 }} />
                            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#92400e', margin: 0 }}>
                                سياسة الاسترداد
                            </h3>
                        </div>
                        <p style={{ margin: 0, color: '#78350f', fontWeight: 600, fontSize: '0.9rem' }}>
                            يحق للمتدرب طلب استرداد المبلغ المدفوع خلال مدة تتراوح بين
                            <span style={{
                                background: '#f57c00', color: '#fff',
                                borderRadius: 6, padding: '2px 8px', margin: '0 6px', fontWeight: 700
                            }}>
                                3 إلى 7 أيام
                            </span>
                            من تاريخ الشراء، وذلك في حال عدم الاستفادة من الدورة أو وجود مشكلة تقنية لا يمكن حلها.
                        </p>
                        <ul style={{ marginTop: 12, marginBottom: 0, paddingRight: 20, color: '#92400e' }}>
                            <li style={{ marginBottom: 6 }}>يتم تقديم طلب الاسترداد عبر التواصل مع فريق الدعم الفني.</li>
                            <li style={{ marginBottom: 6 }}>لا يسري الاسترداد بعد انتهاء مدة 7 أيام من تاريخ الشراء.</li>
                            <li style={{ marginBottom: 6 }}>يُعالَج الاسترداد خلال 3 إلى 7 أيام عمل بعد الموافقة على الطلب.</li>
                            <li>لا ينطبق الاسترداد على الدورات التي استُكملت بنسبة تزيد عن 20%.</li>
                        </ul>
                    </div>

                    {/* T&C Sections */}
                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8, marginTop: 0 }}>
                        ١. القبول بالشروط
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        باستخدامك لمنصة المعهد التكنولوجي لهندسة التشييد والإدارة (ICMET)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يُرجى عدم استخدام الخدمة.
                    </p>

                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8 }}>
                        ٢. الاشتراك والوصول
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        عند إتمام عملية الشراء، تحصل على حق وصول شخصي وغير قابل للنقل للدورة المشتراة. يُحظر مشاركة بيانات الدخول مع أي طرف آخر أو إعادة بيع المحتوى بأي شكل من الأشكال.
                    </p>

                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8 }}>
                        ٣. حقوق الملكية الفكرية
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        جميع المحتويات المقدمة عبر المنصة — من فيديوهات ومستندات وملاحظات — هي ملك حصري للمعهد أو للمدرب المعني، ومحمية بموجب قوانين حقوق الملكية الفكرية. يُحظر تنزيلها أو نسخها أو توزيعها دون إذن كتابي مسبق.
                    </p>

                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8 }}>
                        ٤. الالتزامات والسلوك
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        يلتزم المتدرب باحترام قواعد الأدب والتعامل اللائق مع المدربين وباقي المتدربين، والامتناع عن أي سلوك مسيء أو مزعزع لبيئة التعلم. يحق للمعهد إيقاف الحساب في حال الإخلال بهذه الالتزامات.
                    </p>

                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8 }}>
                        ٥. تعديل الأسعار والمحتوى
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        يحتفظ المعهد بحق تعديل أسعار الدورات وتحديث محتواها في أي وقت. لن تؤثر هذه التغييرات على الاشتراكات المدفوعة مسبقاً.
                    </p>

                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8 }}>
                        ٦. حماية البيانات والخصوصية
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        نلتزم بحماية بياناتك الشخصية وفقاً لسياسة الخصوصية المعتمدة لدينا. لن تُشارك بياناتك مع أطراف ثالثة إلا بموافقتك أو بموجب القانون.
                    </p>

                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8 }}>
                        ٧. تحديد المسؤولية
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        لا يتحمل المعهد المسؤولية عن أي خسائر غير مباشرة أو تبعية ناجمة عن استخدام المنصة أو عدم القدرة على الوصول إليها لأسباب خارجة عن إرادتنا.
                    </p>

                    <h3 style={{ fontWeight: 700, color: '#0865a8', fontSize: '0.95rem', marginBottom: 8 }}>
                        ٨. القانون المطبق
                    </h3>
                    <p style={{ marginTop: 0 }}>
                        تخضع هذه الشروط والأحكام لأحكام القانون المصري، وتختص المحاكم المصرية بالنظر في أي نزاع ينشأ عنها.
                    </p>

                    <div style={{
                        background: '#f0f9ff', borderRadius: 10, padding: '12px 16px',
                        marginTop: 16, borderRight: '4px solid #0865a8'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#1e40af', fontWeight: 600 }}>
                            آخر تحديث: يناير 2025 — للاستفسار تواصل مع فريق الدعم عبر البريد الإلكتروني أو الهاتف المُدرج في الموقع.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid #e5e7eb',
                    display: 'flex', justifyContent: 'flex-end', flexShrink: 0
                }}>
                    <button onClick={onClose} style={{
                        background: 'linear-gradient(90deg,#0865a8,#f57c00)',
                        color: '#fff', border: 'none', borderRadius: 10,
                        padding: '10px 28px', fontWeight: 700,
                        fontSize: '0.9rem', cursor: 'pointer'
                    }}>
                        فهمت وأوافق
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [error, setError] = useState("");

    // ── NEW: Terms & Conditions state ─────────────────────────────────────────
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsError, setTermsError] = useState(false); // shake animation trigger

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            try { setCartItems(JSON.parse(savedCart)); } catch { }
        }
    }, []);

    useEffect(() => {
        if (isSignedIn === false) {
            alert("يجب تسجيل الدخول أولاً");
            navigate("/sign-in");
        }
    }, [isSignedIn, navigate]);

    // ─── Keep refs in sync ────────────────────────────────────────────────────
    useEffect(() => {
        getTokenRef.current = getToken;
    }, [getToken]);

    useEffect(() => {
        cartItemsRef.current = cartItems;
    }, [cartItems]);

    // ─── Handle redirect back from bank ──────────────────────────────────────
    // NOTE: Bank redirects to /payment/result page now (see PaymentResultPage.jsx)
    // This useEffect is kept as fallback only
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdParam = urlParams.get("orderId");
        const resultIndicator = urlParams.get("resultIndicator");
        if (orderIdParam && resultIndicator) {
            verifyAfterRedirect(orderIdParam, resultIndicator);
        }
    }, []);

    // ─── Mastercard global callbacks ──────────────────────────────────────────
    useEffect(() => {
        window.completeCallback = async (resultIndicator) => {
            if (resultIndicator === successIndicatorRef.current) {
                try {
                    const token = await getTokenRef.current();
                    await fetch(
                        `${API_BASE}/api/checkout/result?orderId=${orderIdRef.current}&transactionRef=${resultIndicator}`,
                        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (_) { }

                // ✅ Move purchased courses to enrolled AND purchasedCourses BEFORE clearing cart
                movePurchasedToEnrolled(cartItemsRef.current);

                // ✅ Clear cart
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
            console.error("Mastercard error:", JSON.stringify(err));
            setLoading(false);
            setError("حدث خطأ أثناء الدفع: " + (err?.error?.explanation || "يرجى المحاولة مرة أخرى."));
        };

        window.cancelCallback = () => {
            setLoading(false);
            setError("تم إلغاء عملية الدفع.");
        };

        return () => {
            delete window.completeCallback;
            delete window.errorCallback;
            delete window.cancelCallback;
        };
    }, []);

    // ─── Totals ───────────────────────────────────────────────────────────────
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.currentPrice * (item.quantity || 1), 0
    );
    const totalOriginalPrice = cartItems.reduce(
        (sum, item) => sum + item.originalPrice * (item.quantity || 1), 0
    );
    const totalDiscount = totalOriginalPrice - subtotal;

    useEffect(() => {
        subtotalRef.current = subtotal;
    }, [subtotal]);

    // ─── Verify after bank redirect ───────────────────────────────────────────
    const verifyAfterRedirect = async (oid, resultIndicator) => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(
                `${API_BASE}/api/checkout/result?orderId=${oid}&resultIndicator=${resultIndicator}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.isSuccess) {
                // ✅ Move purchased courses to enrolled AND purchasedCourses BEFORE clearing cart
                const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
                movePurchasedToEnrolled(savedCart);

                localStorage.removeItem("cartItems");
                window.dispatchEvent(new Event("cartUpdated"));

                setPaymentSuccess(true);
                setOrderId(oid);
                setOrderAmount(subtotalRef.current);
            } else {
                setError("فشلت عملية الدفع. يرجى المحاولة مرة أخرى.");
            }
        } catch {
            setError("حدث خطأ أثناء التحقق من حالة الدفع.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Main payment handler ─────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // ── Validate T&C acceptance ────────────────────────────────────────
        if (!termsAccepted) {
            setTermsError(true);
            setTimeout(() => setTermsError(false), 600);
            setError("يجب الموافقة على الشروط والأحكام وسياسة الاسترداد أولاً.");
            return;
        }

        if (cartItems.length === 0) { setError("السلة فارغة. يرجى إضافة دورات أولاً."); return; }
        setLoading(true);

        try {
            const token = await getToken();
            if (!token) throw new Error("فشل في الحصول على رمز المصادقة");

            const response = await fetch(`${API_BASE}/api/checkout/checkout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `خطأ في الخادم: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success || !result.data?.sessionId) {
                throw new Error(result.message || "لم يتم استلام بيانات الجلسة من الخادم");
            }

            const { sessionId, successIndicator, orderId } = result.data;

            // ── CRITICAL: Save everything to localStorage BEFORE redirecting ──
            localStorage.setItem('pendingOrderId', String(orderId));
            localStorage.setItem('pendingSuccessIndicator', String(successIndicator));
            localStorage.setItem('pendingCartItems', JSON.stringify(cartItems));

            if (!window.Checkout) {
                throw new Error("بوابة الدفع لم تُحمَّل بعد. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
            }

            window.Checkout.configure({ session: { id: sessionId } });
            window.Checkout.showPaymentPage();

        } catch (err) {
            let msg = "حدث خطأ أثناء معالجة الطلب";
            if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
                msg = "فشل الاتصال بالخادم. تحقق من اتصال الإنترنت.";
            } else if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
                msg = "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.";
                setTimeout(() => navigate("/sign-in"), 2000);
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
            setLoading(false);
        }
    };

    const Spinner = () => (
        <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes shake{0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)}}`}</style>
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );

    const VisaLogo = () => (
        <svg style={{ height: 22, width: 'auto' }} viewBox="0 0 152 47">
            <path fill="#1A1F71" d="M62.4 45.6H50.5L57.8 1.4h11.9zM42.7 1.4L31.4 31.7l-1.3-6.6L26.2 5.2S25.7 1.4 21 1.4H2.1L2 2.1s5.7 1.2 12.4 5.2l10.3 38.3h12.4L55 1.4H42.7zm80.1 0h-11c-4 0-5 3.1-5 3.1L91.2 45.6h12.3l2.4-6.7h15l1.4 6.7h10.9L122.8 1.4zm-14.4 28.4l6.2-17.1 3.5 17.1h-9.7zm-27.1-18s-5.5-2.8-11.3-2.8c-6.2 0-21 2.7-21 16.2 0 12.6 17.6 12.8 17.6 19.4 0 .8-.7 6.6-11.5 6.6-10.8 0-15.8-5.7-15.8-5.7l-2.8 9.8s6.2 4 16.7 4c10.6 0 22.7-6.1 22.7-18.4 0-12.6-17.7-13.7-17.7-19.5 0-1.5 1.4-5.7 9.8-5.7 7.9 0 12.7 3.7 12.7 3.7l2.6-7.6z" />
        </svg>
    );

    const MastercardLogo = () => (
        <svg style={{ height: 30, width: 'auto' }} viewBox="0 0 131.39 86.9">
            <rect fill="#FF5F00" x="48.37" width="34.65" height="86.9" />
            <path fill="#EB001B" d="M51.94 43.45a55.2 55.2 0 0 1 14.12-37.42A48.19 48.19 0 0 0 0 43.45a48.19 48.19 0 0 0 66.06 43.42A55.2 55.2 0 0 1 51.94 43.45z" />
            <path fill="#F79E1B" d="M131.39 43.45A48.19 48.19 0 0 0 65.33 0a55.23 55.23 0 0 1 0 86.87 48.19 48.19 0 0 0 66.06-43.42z" />
        </svg>
    );

    return (
        <>
            {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}

            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`
                * { font-family: "Droid Arabic Kufi", serif !important; }
                .co-wrap { padding-top: 108px; }
                @media (min-width: 768px)  { .co-wrap { padding-top: 128px; } }
                @media (min-width: 1024px) { .co-wrap { padding-top: 138px; } }
                @keyframes spin { to { transform: rotate(360deg) } }
                @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
                .terms-shake { animation: shake 0.5s ease-in-out; }
                .terms-checkbox:checked { accent-color: #0865a8; }
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
                <div style={{ textAlign: 'center', padding: 'clamp(1rem,4vw,2rem) 1rem clamp(0.75rem,3vw,1.5rem)' }}>
                    <h1 style={{ fontSize: 'clamp(1.4rem,5vw,3rem)', fontWeight: 700 }}>اشترك في دوراتنا</h1>
                </div>

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

                <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(8px, 3vw, 24px)' }}>
                    <style>{`
                        @media (min-width: 1024px) {
                            .co-grid { flex-direction: row !important; align-items: flex-start !important; }
                            .co-left { flex: 1 1 0%; }
                            .co-right { width: 340px; flex-shrink: 0; position: sticky; top: 144px; }
                            .co-mobile-btn { display: none !important; }
                        }
                        @media (min-width: 1280px) { .co-right { width: 380px; } }
                    `}</style>

                    <div className="co-grid" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* ── LEFT: Payment method + Terms ── */}
                        <div className="co-left">
                            <div style={{ borderRadius: 16, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', padding: 'clamp(14px,3vw,24px)' }}>
                                <h2 style={{ fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', fontWeight: 700, marginBottom: 'clamp(12px,3vw,20px)' }}>تفاصيل الدفع</h2>

                                <div style={{ borderRadius: 12, border: '2px solid #0865a8', background: 'rgba(8,101,168,0.04)', padding: 'clamp(10px,2.5vw,18px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #0865a8', background: '#0865a8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 700, fontSize: 'clamp(0.8rem,2vw,0.95rem)' }}>بطاقة ائتمان/خصم مباشر</p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Visa, Mastercard</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <VisaLogo /><MastercardLogo />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 12, borderRadius: 12, background: '#f0fdf4', padding: 'clamp(10px,2.5vw,16px)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <ShieldCheck style={{ width: 18, height: 18, color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 'clamp(0.78rem,2vw,0.9rem)' }}>معاملة آمنة ومشفرة بالكامل</p>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 2 }}>معلوماتك محمية بأعلى معايير الأمان العالمية</p>
                                    </div>
                                </div>

                                {/* ── Refund Policy Summary ─────────────────────────────────────── */}
                                <div style={{
                                    marginTop: 14,
                                    borderRadius: 12,
                                    background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
                                    border: '1px solid #fed7aa',
                                    padding: 'clamp(10px,2.5vw,16px)',
                                    display: 'flex', gap: 10, alignItems: 'flex-start'
                                }}>
                                    <RotateCcw style={{ width: 18, height: 18, color: '#f57c00', flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 'clamp(0.78rem,2vw,0.9rem)', color: '#92400e' }}>
                                            سياسة الاسترداد
                                        </p>
                                        <p style={{ fontSize: '0.78rem', color: '#78350f', marginTop: 3, lineHeight: 1.7 }}>
                                            يمكنك استرداد مبلغك خلال مدة تتراوح بين <strong>3 إلى 7 أيام</strong> من تاريخ الشراء في حال وجود مشكلة أو عدم الرضا عن الدورة.
                                        </p>
                                    </div>
                                </div>

                                {/* ── Terms & Conditions Checkbox ───────────────────────────────── */}
                                <div
                                    className={termsError ? 'terms-shake' : ''}
                                    style={{
                                        marginTop: 16,
                                        borderRadius: 12,
                                        border: `2px solid ${termsError ? '#dc2626' : termsAccepted ? '#16a34a' : '#e5e7eb'}`,
                                        background: termsError ? '#fef2f2' : termsAccepted ? 'rgba(22,163,74,0.04)' : '#f9fafb',
                                        padding: 'clamp(10px,2.5vw,16px)',
                                        transition: 'border-color 0.25s, background 0.25s',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setTermsAccepted(prev => !prev);
                                        if (termsError) setTermsError(false);
                                        setError("");
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        {/* Custom checkbox */}
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                            border: `2px solid ${termsAccepted ? '#16a34a' : '#d1d5db'}`,
                                            background: termsAccepted ? '#16a34a' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s', marginTop: 1
                                        }}>
                                            {termsAccepted && (
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                    <path d="M2 6.5L5.5 10L11 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>

                                        <p style={{ fontSize: 'clamp(0.78rem,2vw,0.875rem)', lineHeight: 1.7, margin: 0, color: '#374151', userSelect: 'none' }}>
                                            لقد قرأت وأوافق على{' '}
                                            <span
                                                onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
                                                style={{
                                                    color: '#0865a8', fontWeight: 700, textDecoration: 'underline',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                الشروط والأحكام وسياسة الاسترداد
                                            </span>
                                            {' '}الخاصة بالمعهد التكنولوجي لهندسة التشييد والإدارة.
                                        </p>
                                    </div>

                                    {termsError && (
                                        <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: 8, marginRight: 34 }}>
                                            ⚠️ يجب الموافقة على الشروط والأحكام قبل المتابعة
                                        </p>
                                    )}
                                </div>

                                {/* Mobile-only pay button */}
                                <button onClick={handleSubmit} disabled={loading || cartItems.length === 0}
                                    className="co-mobile-btn"
                                    style={{ marginTop: 16, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: termsAccepted ? 'linear-gradient(90deg,#0865a8,#f57c00)' : '#d1d5db', padding: '0.85rem', fontWeight: 700, color: '#fff', border: 'none', cursor: loading || cartItems.length === 0 || !termsAccepted ? 'not-allowed' : 'pointer', opacity: loading || cartItems.length === 0 ? 0.7 : 1, transition: 'background 0.3s' }}>
                                    {loading ? <><Spinner />جاري المعالجة...</> : <>المتابعة إلى الدفع <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(180deg)' }} /></>}
                                </button>
                            </div>
                        </div>

                        {/* ── RIGHT: Order summary ── */}
                        <div className="co-right">
                            <div style={{ borderRadius: 16, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', padding: 'clamp(14px,3vw,24px)' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}>
                                    <span style={{ fontWeight: 700, fontSize: 'clamp(0.85rem,2.5vw,1rem)' }}>
                                        {cartItems.length === 0 ? "السلة فارغة" : cartItems.length === 1 ? "دورة واحدة" : `${cartItems.length} دورات`}
                                    </span>
                                    <Link to="/cart" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0865a8', textDecoration: 'none' }}>تغيير</Link>
                                </div>

                                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>ملخص الطلب</p>
                                <div style={{ maxHeight: 210, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                                    {cartItems.map((item) => (
                                        <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg,#0865a8,#f57c00)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BookOpen style={{ width: 22, height: 22, color: '#fff' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 'clamp(0.75rem,2vw,0.875rem)', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                                                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f57c00', marginTop: 4 }}>{((item.currentPrice || 0) * (item.quantity || 1)).toFixed(2)} جنيه</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
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

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <span style={{ fontWeight: 700, fontSize: 'clamp(0.9rem,2.5vw,1rem)' }}>إجمالي المستحق</span>
                                    <span style={{ fontWeight: 700, fontSize: 'clamp(1.2rem,3vw,1.5rem)', color: '#f57c00' }}>{subtotal.toFixed(2)} جنيه</span>
                                </div>

                                {/* Pay button — visually disabled until T&C accepted */}
                                <button onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 8, borderRadius: 12,
                                        background: termsAccepted
                                            ? 'linear-gradient(90deg,#0865a8,#f57c00)'
                                            : '#d1d5db',
                                        padding: '0.9rem', fontWeight: 700, color: '#fff',
                                        border: 'none',
                                        cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer',
                                        opacity: loading || cartItems.length === 0 ? 0.7 : 1,
                                        marginBottom: 12,
                                        transition: 'background 0.3s'
                                    }}>
                                    {loading
                                        ? <><Spinner />جاري المعالجة...</>
                                        : !termsAccepted
                                            ? <>يجب الموافقة على الشروط أولاً</>
                                            : <>المتابعة إلى الدفع <ArrowRight style={{ width: 20, height: 20, transform: 'rotate(180deg)' }} /></>
                                    }
                                </button>

                                {/* Terms reminder under button */}
                                {!termsAccepted && (
                                    <p style={{
                                        textAlign: 'center', fontSize: '0.72rem',
                                        color: '#9ca3af', marginBottom: 12
                                    }}>
                                        يرجى الموافقة على الشروط والأحكام في القسم الأيسر أولاً
                                    </p>
                                )}

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
        </>
    );
}