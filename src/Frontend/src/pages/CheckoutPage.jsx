import { useState, useEffect } from "react";
import { ArrowRight, CreditCard, ShieldCheck, Lock, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) =>
        sum + (item.currentPrice * (item.quantity || 1)), 0
    );
    const totalOriginalPrice = cartItems.reduce((sum, item) =>
        sum + (item.originalPrice * (item.quantity || 1)), 0
    );
    const totalDiscount = totalOriginalPrice - subtotal;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'الاسم الكامل مطلوب';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'رقم الهاتف مطلوب';
        } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) {
            newErrors.phone = 'رقم الهاتف غير صالح';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'يجب الموافقة على الشروط والأحكام';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (cartItems.length === 0) {
            alert('السلة فارغة');
            return;
        }

        setLoading(true);

        try {
            // Prepare order data for backend
            const orderData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                courses: cartItems.map(item => ({
                    courseId: item.id,
                    title: item.title,
                    quantity: item.quantity || 1,
                    price: item.currentPrice
                })),
                totalAmount: subtotal,
                originalAmount: totalOriginalPrice,
                discount: totalDiscount
            };

            // TODO: Replace with your actual backend API endpoint
            // Example: POST to /api/checkout or /api/payment/initiate
            // const response = await fetch('YOUR_BACKEND_API_URL/checkout', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(orderData)
            // });

            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock response - in production, you'll receive a payment URL from Banque Misr gateway
            // const data = await response.json();

            // Simulate success
            const mockPaymentUrl = `https://banquemisr.gateway.mastercard.com/checkout/pay/SESSION${Date.now()}`;

            // In production, redirect to the payment gateway URL:
            // window.location.href = data.paymentUrl;

            // For demo purposes, show success message
            setPaymentSuccess(true);

            // Clear cart after successful order
            localStorage.removeItem('cartItems');
            window.dispatchEvent(new Event('cartUpdated'));

            // Redirect to payment gateway (uncomment in production)
            // setTimeout(() => {
            //     window.location.href = mockPaymentUrl;
            // }, 2000);

        } catch (error) {
            console.error('Payment error:', error);
            alert('حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    if (paymentSuccess) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`* { font-family: "Droid Arabic Kufi", serif !important; }`}</style>

                <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20 px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-green-100">
                                <CheckCircle className="h-16 w-16 text-emerald-600" />
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900">
                                تم استلام طلبك بنجاح!
                            </h1>
                            <p className="mb-8 text-lg text-gray-600">
                                سيتم تحويلك إلى بوابة الدفع الآمنة لإتمام عملية الشراء
                            </p>
                            <div className="mb-8 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
                                <p className="mb-2 text-sm font-semibold text-gray-700">ملخص الطلب</p>
                                <p className="text-3xl font-bold text-[#f57c00]">{subtotal.toFixed(2)} ج.م</p>
                                <p className="mt-2 text-sm text-gray-500">
                                    {cartItems.length} {cartItems.length === 1 ? 'دورة' : 'دورات'}
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.href = '/courses'}
                                    className="w-full rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-4 font-bold text-white shadow-lg transition-all hover:scale-105"
                                >
                                    العودة للدورات
                                </button>
                                <Link
                                    to="/"
                                    className="block w-full rounded-xl border-2 border-gray-300 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    الصفحة الرئيسية
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />

            <style>{`
                * {
                    font-family: "Droid Arabic Kufi", serif !important;
                }
            `}</style>

            {/* Fixed Overview Bar */}
            <div className="fixed left-0 top-16 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 md:top-20">
                <div className="text-center">
                    <span className="text-sm md:text-base">
                        <a href="/" className="ml-3 text-gray-700 transition-colors hover:text-gray-900">الصفحة الرئيسية</a>
                        <span className="text-gray-500"> - </span>
                        <Link to="/cart" className="mx-2 text-gray-700 transition-colors hover:text-gray-900">سلة التسوق</Link>
                        <span className="text-gray-500"> - </span>
                        <span className="mr-2 font-semibold text-gray-900">إتمام الدفع</span>
                    </span>
                </div>
            </div>

            <div
                dir="rtl"
                className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20 px-4 pb-16 pt-28 md:pt-32"
            >
                <div className="mx-auto max-w-6xl">
                    {/* Page Title */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 bg-gradient-to-r from-[#0865a8] to-[#f57c00] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                            إتمام الدفع
                        </h1>
                        <p className="text-lg text-gray-600">
                            خطوة واحدة لبدء رحلتك التعليمية
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl">
                                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <CreditCard className="h-6 w-6 text-[#0865a8]" />
                                    معلومات الدفع
                                </h2>

                                {/* Form Fields */}
                                <div className="space-y-5">
                                    {/* Full Name */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            الاسم الكامل <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300'} px-4 py-3 focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20`}
                                            placeholder="محمد أحمد عبد الرحمن"
                                        />
                                        {errors.fullName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            البريد الإلكتروني <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-3 focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20`}
                                            placeholder="example@email.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            رقم الهاتف <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-4 py-3 focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20`}
                                            placeholder="01012345678"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                name="acceptTerms"
                                                checked={formData.acceptTerms}
                                                onChange={handleInputChange}
                                                className="mt-1 h-5 w-5 rounded border-gray-300 text-[#0865a8] focus:ring-[#0865a8]"
                                            />
                                            <span className="text-sm text-gray-700">
                                                أوافق على <a href="/terms" className="font-semibold text-[#0865a8] hover:underline">الشروط والأحكام</a> و<a href="/privacy" className="font-semibold text-[#0865a8] hover:underline">سياسة الخصوصية</a>
                                            </span>
                                        </label>
                                        {errors.acceptTerms && (
                                            <p className="mt-2 text-sm text-red-500">{errors.acceptTerms}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="mt-8 space-y-4">
                                    <div className="border-[#0865a8]/20 flex items-center gap-3 rounded-xl border-2 bg-blue-50/50 p-4">
                                        <Lock className="h-6 w-6 flex-shrink-0 text-[#0865a8]" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">الدفع عبر بنك مصر</p>
                                            <p className="text-sm text-gray-600">Banque Misr Payment Gateway - Mastercard</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
                                        <ShieldCheck className="h-6 w-6 flex-shrink-0 text-emerald-600" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">عملية دفع آمنة 100%</p>
                                            <p className="text-sm text-gray-600">معلوماتك محمية بأعلى معايير الأمان</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            جاري المعالجة...
                                        </>
                                    ) : (
                                        <>
                                            تأكيد والانتقال للدفع
                                            <ArrowRight className="h-5 w-5 rotate-180" />
                                        </>
                                    )}
                                </button>

                                <Link
                                    to="/cart"
                                    className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                    الرجوع إلى سلة التسوق
                                </Link>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 rounded-2xl bg-white p-6 shadow-xl">
                                <h2 className="mb-6 text-xl font-bold text-gray-900">ملخص الطلب</h2>

                                {/* Cart Items */}
                                <div className="mb-6 max-h-64 space-y-4 overflow-y-auto border-b border-gray-200 pb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-16 w-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    الكمية: {item.quantity || 1}
                                                </p>
                                                <p className="text-sm font-bold text-[#f57c00]">
                                                    {(item.currentPrice * (item.quantity || 1)).toFixed(2)} ج.م
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Summary */}
                                <div className="mb-6 space-y-3 border-b border-gray-200 pb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>المجموع الفرعي</span>
                                        <span className="font-semibold">{totalOriginalPrice.toFixed(2)} ج.م</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span className="font-medium">الخصم</span>
                                            <span className="font-semibold">-{totalDiscount.toFixed(2)} ج.م</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">الإجمالي</span>
                                        <span className="text-3xl font-bold text-[#f57c00]">
                                            {subtotal.toFixed(2)} ج.م
                                        </span>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 text-center">
                                    <Lock className="mx-auto mb-2 h-8 w-8 text-[#0865a8]" />
                                    <p className="text-xs font-semibold text-gray-700">
                                        معاملة آمنة ومشفرة
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        نستخدم تقنية التشفير SSL لحماية بياناتك
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}