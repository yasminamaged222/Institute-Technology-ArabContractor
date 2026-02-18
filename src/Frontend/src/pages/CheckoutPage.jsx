import { useState, useEffect, useRef } from "react";
import { ArrowRight, ShieldCheck, Lock, CheckCircle, Tag, BookOpen, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = "https://localhost:7177";

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

    // Refs so Mastercard callbacks (outside React) can access current values
    const successIndicatorRef = useRef(null);
    const orderIdRef = useRef(null);
    const subtotalRef = useRef(0);
    const getTokenRef = useRef(null);

    // ─── Load cart ────────────────────────────────────────────
    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, []);

    // ─── Auth guard ───────────────────────────────────────────
    useEffect(() => {
        if (isSignedIn === false) {
            alert("يجب تسجيل الدخول أولاً");
            navigate("/sign-in");
        }
    }, [isSignedIn, navigate]);

    // ─── Keep getToken accessible in callbacks ─────────────────
    useEffect(() => {
        getTokenRef.current = getToken;
    }, [getToken]);

    // ─── Handle redirect back from bank ──────────────────────
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdParam = urlParams.get("orderId");
        const transactionRef = urlParams.get("transactionRef");
        if (orderIdParam && transactionRef) {
            verifyAfterRedirect(orderIdParam, transactionRef);
        }
    }, []);

    // ─── Register Mastercard global callbacks ─────────────────
    // NOTE: The script tag in index.html uses data-complete/error/cancel
    // so these window functions must exist BEFORE Mastercard script runs.
    // We define them here so React state updates work correctly.
    useEffect(() => {
        window.completeCallback = async (resultIndicator) => {
            if (resultIndicator === successIndicatorRef.current) {
                try {
                    const token = await getTokenRef.current();
                    await fetch(
                        `${API_BASE}/api/checkout/result?orderId=${orderIdRef.current}&transactionRef=${resultIndicator}`,
                        {
                            method: "GET",
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                } catch (_) { /* sync error is non-critical */ }

                setPaymentSuccess(true);
                setOrderId(orderIdRef.current);
                setOrderAmount(subtotalRef.current);
                localStorage.removeItem("cartItems");
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                setLoading(false);
                setError("فشل التحقق من الدفع. يرجى التواصل مع الدعم الفني.");
            }
        };

        window.errorCallback = (err) => {
            console.error("Mastercard error full:", JSON.stringify(err));
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

    // ─── Totals ───────────────────────────────────────────────
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

    // ─── Verify after bank redirect ───────────────────────────
    const verifyAfterRedirect = async (oid, transactionRef) => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(
                `${API_BASE}/api/checkout/result?orderId=${oid}&transactionRef=${transactionRef}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.isSuccess) {
                setPaymentSuccess(true);
                setOrderId(oid);
                setOrderAmount(subtotalRef.current);
                localStorage.removeItem("cartItems");
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                setError("فشلت عملية الدفع. يرجى المحاولة مرة أخرى.");
            }
        } catch {
            setError("حدث خطأ أثناء التحقق من حالة الدفع.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Main payment handler ─────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (cartItems.length === 0) {
            setError("السلة فارغة. يرجى إضافة دورات أولاً.");
            return;
        }

        setLoading(true);

        try {
            const token = await getToken();
            if (!token) throw new Error("فشل في الحصول على رمز المصادقة");

            // ── Step 1: POST to backend → get Mastercard session ──
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
            console.log("Checkout session:", result);

            if (!result.success || !result.data?.sessionId) {
                throw new Error(result.message || "لم يتم استلام بيانات الجلسة من الخادم");
            }

            const { sessionId, successIndicator, orderId } = result.data;

            // Store in refs for callbacks
            successIndicatorRef.current = successIndicator;
            orderIdRef.current = orderId;
            setOrderId(orderId);

            // ── Step 2: Make sure Checkout is loaded (from index.html script tag) ──
            if (!window.Checkout) {
                throw new Error("بوابة الدفع لم تُحمَّل بعد. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
            }

            // ── Step 3: Configure & open payment page ──
            window.Checkout.configure({
                session: { id: sessionId }
            });

            window.Checkout.showPaymentPage();

        } catch (err) {
            console.error("Payment error:", err);
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

    // ════════════════════════════════════════════════════════════
    // SUCCESS SCREEN
    // ════════════════════════════════════════════════════════════
    if (paymentSuccess) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`* { font-family: "Droid Arabic Kufi", serif !important; }`}</style>
                <div dir="rtl" className="min-h-screen bg-white px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-3xl bg-white p-8 text-center shadow-lg md:p-12">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 md:h-24 md:w-24">
                                <CheckCircle className="h-12 w-12 text-green-600 md:h-16 md:w-16" />
                            </div>
                            <h1 className="mb-4 text-2xl font-bold text-black md:text-3xl">
                                تم إتمام عملية الدفع بنجاح!
                            </h1>
                            <p className="mb-8 text-base text-black opacity-70 md:text-lg">
                                شكراً لك! تم تأكيد طلبك وسيتم تفعيل الدورات في حسابك قريباً
                            </p>
                            <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                                <p className="mb-2 text-sm font-medium text-black opacity-60">رقم الطلب</p>
                                <p className="text-2xl font-bold text-[#0865a8] md:text-3xl">{orderId || "N/A"}</p>
                                <p className="mt-4 text-sm font-medium text-black opacity-60">المبلغ المدفوع</p>
                                <p className="text-3xl font-bold text-[#f57c00] md:text-4xl">
                                    {(orderAmount || subtotal).toFixed(2)} جنيه
                                </p>
                                {cartItems.length > 0 && (
                                    <p className="mt-2 text-sm text-black opacity-50">
                                        {cartItems.length} {cartItems.length === 1 ? "دورة" : "دورات"}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Link to="/my-courses" className="block w-full rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-semibold text-white transition-all hover:shadow-lg md:py-4">
                                    عرض دوراتي
                                </Link>
                                <Link to="/" className="block w-full rounded-xl border-2 border-gray-200 py-3 font-semibold text-black transition-colors hover:bg-gray-50 md:py-4">
                                    الصفحة الرئيسية
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ════════════════════════════════════════════════════════════
    // CHECKOUT SCREEN
    // ════════════════════════════════════════════════════════════
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`
                * { font-family: "Droid Arabic Kufi", serif !important; }
                @media (max-width: 640px) { .checkout-main { padding-top: 100px !important; } }
                @media (min-width: 641px) and (max-width: 1024px) { .checkout-main { padding-top: 120px !important; } }
                @media (min-width: 1025px) { .checkout-main { padding-top: 130px !important; } }
            `}</style>

            {/* Breadcrumb */}
            <div className="fixed left-0 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 md:top-20" style={{ top: 70 }}>
                <div className="text-center text-sm md:text-base">
                    <a href="/" className="ml-3 text-gray-700 hover:text-gray-900">الصفحة الرئيسية</a>
                    <span className="text-gray-500"> - </span>
                    <Link to="/cart" className="mx-2 text-gray-700 hover:text-gray-900">سلة التسوق</Link>
                    <span className="text-gray-500"> - </span>
                    <span className="mr-2 font-semibold text-gray-900">إتمام الدفع</span>
                </div>
            </div>

            <div dir="rtl" className="checkout-main min-h-screen bg-white px-3 pb-16 sm:px-4 md:px-6">
                <div className="mx-auto max-w-7xl">

                    {/* Title */}
                    <div className="mb-6 text-center md:mb-10">
                        <h1 className="mb-2 text-3xl font-bold text-black sm:text-4xl md:mb-3 md:text-5xl">
                            اشترك في دوراتنا
                        </h1>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4 md:mb-8">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-800">خطأ في الدفع</h3>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">{error}</p>
                                    <button onClick={() => setError("")} className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800">
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">

                        {/* ── Left: Payment method ── */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-6 md:p-8">
                                <h2 className="mb-4 text-lg font-bold text-black md:mb-6 md:text-xl">تفاصيل الدفع</h2>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="rounded-lg border-2 border-[#0865a8] bg-blue-50/30 p-4 md:p-5">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="flex h-5 w-5 items-center justify-center">
                                                <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0865a8] bg-[#0865a8] md:h-5 md:w-5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white md:h-2 md:w-2" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-black md:text-base">بطاقة ائتمان/خصم مباشر</p>
                                                <p className="text-xs text-black opacity-60 md:text-sm">Visa, Mastercard</p>
                                            </div>
                                            <div className="flex gap-1.5 md:gap-2">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6 md:h-8" />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 md:h-8" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 md:gap-3 md:p-4">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 md:h-5 md:w-5" />
                                        <div>
                                            <p className="text-xs font-semibold text-black md:text-sm">معاملة آمنة ومشفرة بالكامل</p>
                                            <p className="mt-1 text-xs text-black opacity-60">معلوماتك محمية بأعلى معايير الأمان العالمية</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile button */}
                            <div className="mt-4 md:mt-6 lg:hidden">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:py-4"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            جاري المعالجة...
                                        </>
                                    ) : (
                                        <>المتابعة إلى الدفع <ArrowRight className="h-4 w-4 rotate-180" /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ── Right: Order summary ── */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:top-32 md:p-6">

                                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 md:mb-6 md:pb-4">
                                    <span className="text-base font-bold text-black md:text-lg">
                                        {cartItems.length === 0 ? "السلة فارغة" : cartItems.length === 1 ? "دورة واحدة" : `${cartItems.length} دورات`}
                                    </span>
                                    <Link to="/cart" className="text-xs font-semibold text-[#0865a8] hover:underline md:text-sm">تغيير</Link>
                                </div>

                                <div className="mb-4 md:mb-6">
                                    <p className="mb-3 text-sm font-bold text-black md:mb-4">ملخص الطلب</p>
                                    <div className="mb-3 max-h-48 space-y-2.5 overflow-y-auto md:mb-4 md:space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-start gap-2.5 text-sm md:gap-3">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0865a8] to-[#f57c00] md:h-12 md:w-12">
                                                    <BookOpen className="h-5 w-5 text-white md:h-6 md:w-6" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="line-clamp-2 text-xs font-medium text-black md:text-sm">{item.title}</p>
                                                    <p className="mt-1 text-xs font-bold text-[#f57c00]">
                                                        {(item.currentPrice * (item.quantity || 1)).toFixed(2)} جنيه
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-1.5 text-sm md:space-y-2">
                                        <div className="flex justify-between text-black opacity-70">
                                            <span className="text-xs md:text-sm">المجموع الفرعي</span>
                                            <span className="text-xs md:text-sm">{totalOriginalPrice.toFixed(2)} جنيه</span>
                                        </div>
                                        {totalDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span className="text-xs md:text-sm">الخصم</span>
                                                <span className="text-xs md:text-sm">-{totalDiscount.toFixed(2)} جنيه</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Coupon */}
                                {!showCoupon ? (
                                    <button
                                        onClick={() => setShowCoupon(true)}
                                        className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-gray-50 md:mb-6 md:py-3 md:text-sm"
                                    >
                                        <Tag className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        استخدم كود الخصم
                                    </button>
                                ) : (
                                    <div className="mb-4 md:mb-6">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="أدخل كود الخصم"
                                                className="flex-1 rounded-lg border border-gray-300 px-2.5 py-2 text-xs text-black focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20 md:px-3 md:text-sm"
                                            />
                                            <button
                                                onClick={() => couponCode.trim() && alert("سيتم تطبيق الكود عند إتمام الدفع")}
                                                className="rounded-lg bg-[#0865a8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0865a8]/90 md:px-4 md:text-sm"
                                            >
                                                تطبيق
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4 border-t border-gray-200 md:mb-6" />

                                {/* Total */}
                                <div className="mb-4 flex items-center justify-between md:mb-6">
                                    <span className="text-sm font-bold text-black md:text-base">إجمالي المستحق</span>
                                    <span className="text-xl font-bold text-[#f57c00] md:text-2xl">{subtotal.toFixed(2)} جنيه</span>
                                </div>

                                {/* Desktop button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    className="mb-3 hidden w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:mb-4 md:py-4 lg:flex"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            جاري المعالجة...
                                        </>
                                    ) : (
                                        <>المتابعة إلى الدفع <ArrowRight className="h-5 w-5 rotate-180" /></>
                                    )}
                                </button>

                                {/* Security notice */}
                                <div className="rounded-lg bg-gray-50 p-3 text-center md:p-4">
                                    <Lock className="mx-auto mb-1.5 h-5 w-5 text-black opacity-60 md:mb-2 md:h-6 md:w-6" />
                                    <p className="text-xs text-black opacity-60">الدفع عبر بوابة بنك مصر الآمنة</p>
                                    <p className="mt-1 text-xs font-semibold text-black">معاملة مشفرة بتقنية SSL</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}