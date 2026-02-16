// import { useState, useEffect } from "react";
// import { ArrowRight, ShieldCheck, Lock, CheckCircle, Tag, BookOpen } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function CheckoutPage() {
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [paymentSuccess, setPaymentSuccess] = useState(false);
//     const [showCoupon, setShowCoupon] = useState(false);
//     const [couponCode, setCouponCode] = useState('');

//     // Form state
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         phone: '',
//         acceptTerms: false
//     });

//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         const savedCart = localStorage.getItem('cartItems');
//         if (savedCart) {
//             setCartItems(JSON.parse(savedCart));
//         }
//     }, []);

//     // Calculate totals
//     const subtotal = cartItems.reduce((sum, item) =>
//         sum + (item.currentPrice * (item.quantity || 1)), 0
//     );
//     const totalOriginalPrice = cartItems.reduce((sum, item) =>
//         sum + (item.originalPrice * (item.quantity || 1)), 0
//     );
//     const totalDiscount = totalOriginalPrice - subtotal;

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         if (cartItems.length === 0) {
//             alert('السلة فارغة');
//             return;
//         }

//         setLoading(true);

//         try {
//             const orderData = {
//                 fullName: formData.fullName,
//                 email: formData.email,
//                 phone: formData.phone,
//                 courses: cartItems.map(item => ({
//                     courseId: item.id,
//                     title: item.title,
//                     quantity: item.quantity || 1,
//                     price: item.currentPrice
//                 })),
//                 totalAmount: subtotal,
//                 originalAmount: totalOriginalPrice,
//                 discount: totalDiscount
//             };

//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 2000));

//             setPaymentSuccess(true);
//             localStorage.removeItem('cartItems');
//             window.dispatchEvent(new Event('cartUpdated'));

//         } catch (error) {
//             console.error('Payment error:', error);
//             alert('حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (paymentSuccess) {
//         return (
//             <>
//                 <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
//                 <style>{`
//                     * { 
//                         font-family: "Droid Arabic Kufi", serif !important; 
//                     }
//                 `}</style>

//                 <div dir="rtl" className="min-h-screen bg-white px-4 py-16">
//                     <div className="mx-auto max-w-2xl">
//                         <div className="rounded-3xl bg-white p-8 text-center shadow-lg md:p-12">
//                             <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 md:h-24 md:w-24">
//                                 <CheckCircle className="h-12 w-12 text-green-600 md:h-16 md:w-16" />
//                             </div>
//                             <h1 className="mb-4 text-2xl font-bold text-black md:text-3xl">
//                                 تم استلام طلبك بنجاح!
//                             </h1>
//                             <p className="mb-8 text-base text-black opacity-70 md:text-lg">
//                                 سيتم تحويلك إلى بوابة الدفع الآمنة لإتمام عملية الشراء
//                             </p>
//                             <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
//                                 <p className="mb-2 text-sm font-medium text-black opacity-60">ملخص الطلب</p>
//                                 <p className="text-3xl font-bold text-[#f57c00] md:text-4xl">{subtotal.toFixed(2)} جنيه</p>
//                                 <p className="mt-2 text-sm text-black opacity-50">
//                                     {cartItems.length} {cartItems.length === 1 ? 'دورة' : 'دورات'}
//                                 </p>
//                             </div>
//                             <div className="space-y-3">
//                                 <Link
//                                     to="/"
//                                     className="block w-full rounded-xl border-2 border-gray-200 py-3 font-semibold text-black transition-colors hover:bg-gray-50 md:py-4"
//                                 >
//                                     الصفحة الرئيسية
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
//             <style>{`
//                 * {
//                     font-family: "Droid Arabic Kufi", serif !important;
//                 }
                
//                 @media (max-width: 640px) {
//                     .checkout-main {
//                         padding-top: 100px !important;
//                     }
//                 }
                
//                 @media (min-width: 641px) and (max-width: 1024px) {
//                     .checkout-main {
//                         padding-top: 120px !important;
//                     }
//                 }
                
//                 @media (min-width: 1025px) {
//                     .checkout-main {
//                         padding-top: 130px !important;
//                     }
//                 }
//             `}</style>

//             {/* Fixed Overview Bar - Exactly as requested */}
//             <div className="fixed left-0 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 md:top-20" style={{top:70}}>
//                 <div className="text-center">
//                     <span className="text-sm md:text-base">
//                         <a href="/" className="ml-3 text-gray-700 transition-colors hover:text-gray-900">الصفحة الرئيسية</a>
//                         <span className="text-gray-500"> - </span>
//                         <Link to="/cart" className="mx-2 text-gray-700 transition-colors hover:text-gray-900">سلة التسوق</Link>
//                         <span className="text-gray-500"> - </span>
//                         <span className="mr-2 font-semibold text-gray-900">إتمام الدفع</span>
//                     </span>
//                 </div>
//             </div>

//             <div dir="rtl" className="checkout-main min-h-screen bg-white px-3 pb-16 sm:px-4 md:px-6">
//                 <div className="mx-auto max-w-7xl">
//                     {/* Page Header */}
//                     <div className="mb-6 text-center md:mb-10">
//                         <h1 className="mb-2 text-3xl font-bold text-black sm:text-4xl md:mb-3 md:text-5xl">
//                             اشترك في دوراتنا
//                         </h1>
//                     </div>
//                     <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
//                         {/* Main Content - Left Side */}
//                         <div className="lg:col-span-2">
//                             {/* Payment Method */}
//                             <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-6 md:p-8">
//                                 <h2 className="mb-4 text-lg font-bold text-black md:mb-6 md:text-xl">تفاصيل الدفع</h2>
                                
//                                 <div className="space-y-3 md:space-y-4">
//                                     {/* Selected Payment Method */}
//                                     <div className="rounded-lg border-2 border-[#0865a8] bg-blue-50/30 p-4 md:p-5">
//                                         <div className="flex items-center gap-3 md:gap-4">
//                                             <div className="flex h-5 w-5 items-center justify-center md:h-6 md:w-6">
//                                                 <div className="h-4 w-4 rounded-full border-2 border-[#0865a8] bg-[#0865a8] md:h-5 md:w-5">
//                                                     <div className="flex h-full w-full items-center justify-center">
//                                                         <div className="h-1.5 w-1.5 rounded-full bg-white md:h-2 md:w-2"></div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="text-sm font-bold text-black md:text-base">بطاقة ائتمان/خصم مباشر</p>
//                                                 <p className="text-xs text-black opacity-60 md:text-sm">Visa, Mastercard</p>
//                                             </div>
//                                             <div className="flex gap-1.5 md:gap-2">
//                                                 <img 
//                                                     src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
//                                                     alt="Visa" 
//                                                     className="h-6 md:h-8"
//                                                 />
//                                                 <img 
//                                                     src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
//                                                     alt="Mastercard" 
//                                                     className="h-6 md:h-8"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Security Info */}
//                                     <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 md:gap-3 md:p-4">
//                                         <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 md:h-5 md:w-5" />
//                                         <div>
//                                             <p className="text-xs font-semibold text-black md:text-sm">
//                                                 معاملة آمنة ومشفرة بالكامل
//                                             </p>
//                                             <p className="mt-1 text-xs text-black opacity-60">
//                                                 معلوماتك محمية بأعلى معايير الأمان العالمية
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Mobile Submit Button */}
//                             <div className="mt-4 md:mt-6 lg:hidden">
//                                 <button
//                                     onClick={handleSubmit}
//                                     disabled={loading}
//                                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:py-4"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <svg className="h-4 w-4 animate-spin md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             جاري المعالجة...
//                                         </>
//                                     ) : (
//                                         <>
//                                             المتابعة إلى الدفع
//                                             <ArrowRight className="h-4 w-4 rotate-180 md:h-5 md:w-5" />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Order Summary - Right Sidebar */}
//                         <div className="lg:col-span-1">
//                             <div className="sticky top-28 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:top-32 md:p-6">
//                                 {/* Cart Items Preview */}
//                                 <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 md:mb-6 md:pb-4">
//                                     <span className="text-base font-bold text-black md:text-lg">
//                                         {cartItems.length === 1 ? 'دورة واحدة' : `${cartItems.length} دورات`}
//                                     </span>
//                                     <Link 
//                                         to="/cart" 
//                                         className="text-xs font-semibold text-[#0865a8] hover:underline md:text-sm"
//                                     >
//                                         تغيير
//                                     </Link>
//                                 </div>

//                                 {/* Order Details */}
//                                 <div className="mb-4 md:mb-6">
//                                     <p className="mb-3 text-sm font-bold text-black md:mb-4">ملخص الطلب</p>
                                    
//                                     {/* Courses List */}
//                                     <div className="mb-3 max-h-48 space-y-2.5 overflow-y-auto md:mb-4 md:space-y-3">
//                                         {cartItems.map((item) => (
//                                             <div key={item.id} className="flex items-start gap-2.5 text-sm md:gap-3">
//                                                 {/* Course Icon */}
//                                                 <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0865a8] to-[#f57c00] md:h-12 md:w-12">
//                                                     <BookOpen className="h-5 w-5 text-white md:h-6 md:w-6" />
//                                                 </div>
//                                                 <div className="min-w-0 flex-1">
//                                                     <p className="line-clamp-2 text-xs font-medium text-black md:text-sm">
//                                                         {item.title}
//                                                     </p>
//                                                     <p className="mt-1 text-xs font-bold text-[#f57c00]">
//                                                         {(item.currentPrice * (item.quantity || 1)).toFixed(2)} جنيه
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Price Breakdown */}
//                                     <div className="space-y-1.5 text-sm md:space-y-2">
//                                         <div className="flex justify-between text-black opacity-70">
//                                             <span className="text-xs md:text-sm">المجموع الفرعي</span>
//                                             <span className="text-xs md:text-sm">{totalOriginalPrice.toFixed(2)} جنيه</span>
//                                         </div>
//                                         {totalDiscount > 0 && (
//                                             <div className="flex justify-between text-green-600">
//                                                 <span className="text-xs md:text-sm">الخصم</span>
//                                                 <span className="text-xs md:text-sm">-{totalDiscount.toFixed(2)} جنيه</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Coupon */}
//                                 {!showCoupon ? (
//                                     <button
//                                         onClick={() => setShowCoupon(true)}
//                                         className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-gray-50 md:mb-6 md:py-3 md:text-sm"
//                                     >
//                                         <Tag className="h-3.5 w-3.5 md:h-4 md:w-4" />
//                                         استخدم كود الخصم
//                                     </button>
//                                 ) : (
//                                     <div className="mb-4 md:mb-6">
//                                         <div className="flex gap-2">
//                                             <input
//                                                 type="text"
//                                                 value={couponCode}
//                                                 onChange={(e) => setCouponCode(e.target.value)}
//                                                 placeholder="أدخل كود الخصم"
//                                                 className="flex-1 rounded-lg border border-gray-300 px-2.5 py-2 text-xs text-black focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20 md:px-3 md:text-sm"
//                                             />
//                                             <button className="rounded-lg bg-[#0865a8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0865a8]/90 md:px-4 md:text-sm">
//                                                 تطبيق
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Divider */}
//                                 <div className="mb-4 border-t border-gray-200 md:mb-6"></div>

//                                 {/* Total */}
//                                 <div className="mb-4 flex items-center justify-between md:mb-6">
//                                     <span className="text-sm font-bold text-black md:text-base">إجمالي المستحق</span>
//                                     <span className="text-xl font-bold text-[#f57c00] md:text-2xl">
//                                         {subtotal.toFixed(2)} جنيه
//                                     </span>
//                                 </div>

//                                 {/* Desktop Submit Button */}
//                                 <button
//                                     onClick={handleSubmit}
//                                     disabled={loading}
//                                     className="mb-3 hidden w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:mb-4 md:py-4 lg:flex"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             جاري المعالجة...
//                                         </>
//                                     ) : (
//                                         <>
//                                             المتابعة إلى الدفع
//                                             <ArrowRight className="h-5 w-5 rotate-180" />
//                                         </>
//                                     )}
//                                 </button>

//                                 {/* Security Notice */}
//                                 <div className="rounded-lg bg-gray-50 p-3 text-center md:p-4">
//                                     <Lock className="mx-auto mb-1.5 h-5 w-5 text-black opacity-60 md:mb-2 md:h-6 md:w-6" />
//                                     <p className="text-xs text-black opacity-60">
//                                         الدفع عبر بوابة بنك مصر الآمنة
//                                     </p>
//                                     <p className="mt-1 text-xs font-semibold text-black">
//                                         معاملة مشفرة بتقنية SSL
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// } 




// import { useState, useEffect } from "react";
// import { ArrowRight, ShieldCheck, Lock, CheckCircle, Tag, BookOpen, AlertCircle } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react";

// export default function CheckoutPage() {
//     const navigate = useNavigate();
//     const { getToken, isSignedIn } = useAuth();
    
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [paymentSuccess, setPaymentSuccess] = useState(false);
//     const [showCoupon, setShowCoupon] = useState(false);
//     const [couponCode, setCouponCode] = useState('');
//     const [error, setError] = useState('');
//     const [orderId, setOrderId] = useState(null);
//     const [orderAmount, setOrderAmount] = useState(0);

//     useEffect(() => {
//         const savedCart = localStorage.getItem('cartItems');
//         if (savedCart) {
//             setCartItems(JSON.parse(savedCart));
//         }
//     }, []);

//     // Check if user is signed in
//     useEffect(() => {
//         if (!isSignedIn) {
//             alert('يجب تسجيل الدخول أولاً');
//             navigate('/sign-in');
//         }
//     }, [isSignedIn, navigate]);

//     // Check payment result from URL parameters (after redirect back)
//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const orderIdParam = urlParams.get('orderId');
//         const transactionRef = urlParams.get('transactionRef');

//         if (orderIdParam && transactionRef) {
//             checkPaymentResult(orderIdParam, transactionRef);
//         }
//     }, []);

//     // Calculate totals
//     const subtotal = cartItems.reduce((sum, item) =>
//         sum + (item.currentPrice * (item.quantity || 1)), 0
//     );
//     const totalOriginalPrice = cartItems.reduce((sum, item) =>
//         sum + (item.originalPrice * (item.quantity || 1)), 0
//     );
//     const totalDiscount = totalOriginalPrice - subtotal;

//     // Helper function to handle API responses
//     const handleResponse = async (response) => {
//         const contentType = response.headers.get('content-type');
        
//         // Check if response is JSON
//         if (contentType && contentType.includes('application/json')) {
//             const data = await response.json();
            
//             if (!response.ok) {
//                 throw new Error(data.message || data.error || `خطأ: ${response.status}`);
//             }
            
//             return data;
//         } else {
//             // Response is not JSON (HTML, text, etc.)
//             const text = await response.text();
//             console.error('Non-JSON response:', text);
            
//             if (text.includes('System.Net') || text.includes('Exception')) {
//                 throw new Error('خطأ في الخادم. يرجى المحاولة لاحقاً.');
//             }
            
//             throw new Error('تنسيق استجابة غير متوقع من الخادم');
//         }
//     };

//     // Check payment result
//     const checkPaymentResult = async (orderId, transactionRef) => {
//         setLoading(true);
//         try {
//             const token = await getToken();
            
//             if (!token) {
//                 throw new Error('فشل في الحصول على رمز المصادقة');
//             }

//             console.log('Checking payment result for:', { orderId, transactionRef });
            
//             const response = await fetch(
//                 `https://acwebsite-icmet-test.azurewebsites.net/api/checkout/result?orderId=${orderId}&transactionRef=${transactionRef}`,
//                 {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                     },
//                 }
//             );

//             const result = await handleResponse(response);
//             console.log('Payment result:', result);

//             // Check for success in multiple possible formats
//             const isSuccess = 
//                 result.status === 'success' || 
//                 result.status === 'Success' ||
//                 result.paymentStatus === 'completed' || 
//                 result.paymentStatus === 'Completed' ||
//                 result.paymentStatus === 'paid' ||
//                 result.paymentStatus === 'Paid' ||
//                 result.isSuccess === true;

//             if (isSuccess) {
//                 setPaymentSuccess(true);
//                 setOrderId(orderId);
//                 setOrderAmount(result.totalAmount || subtotal);
//                 localStorage.removeItem('cartItems');
//                 window.dispatchEvent(new Event('cartUpdated'));
//             } else {
//                 setError('فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
//             }
//         } catch (error) {
//             console.error('Error checking payment result:', error);
//             setError(error.message || 'حدث خطأ أثناء التحقق من حالة الدفع');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         // Validation
//         if (cartItems.length === 0) {
//             setError('السلة فارغة. يرجى إضافة دورات أولاً.');
//             return;
//         }

//         if (!isSignedIn) {
//             alert('يجب تسجيل الدخول أولاً');
//             navigate('/sign-in');
//             return;
//         }

//         setLoading(true);

//         try {
//             // Get authentication token
//             const token = await getToken();

//             if (!token) {
//                 throw new Error('فشل في الحصول على رمز المصادقة');
//             }

//             console.log('Creating order with token:', token ? 'Valid' : 'Invalid');

//             // Prepare order data
//             const orderData = {
//                 courses: cartItems.map(item => ({
//                     courseId: item.id,
//                     title: item.title,
//                     quantity: item.quantity || 1,
//                     price: item.currentPrice
//                 })),
//                 totalAmount: subtotal,
//                 originalAmount: totalOriginalPrice,
//                 discount: totalDiscount,
//                 couponCode: couponCode || null
//             };

//             console.log('Order data:', orderData);

//             // Create order via API
//             const response = await fetch(
//                 'https://acwebsite-icmet-test.azurewebsites.net/api/checkout/checkout/',
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                     },
//                     body: JSON.stringify(orderData),
//                 }
//             );

//             const orderResponse = await handleResponse(response);
//             console.log('Order created:', orderResponse);

//             // Check if response contains payment URL
//             if (orderResponse.paymentUrl) {
//                 console.log('Redirecting to payment gateway:', orderResponse.paymentUrl);
//                 // Redirect to payment gateway
//                 window.location.href = orderResponse.paymentUrl;
//             } else if (orderResponse.id) {
//                 // Store order ID and show success (for testing or if no redirect needed)
//                 console.log('Payment URL not provided, showing success page');
//                 setOrderId(orderResponse.id);
//                 setOrderAmount(orderResponse.totalAmount || subtotal);
//                 setPaymentSuccess(true);
//                 localStorage.removeItem('cartItems');
//                 window.dispatchEvent(new Event('cartUpdated'));
//             } else {
//                 throw new Error('لم يتم استلام رابط الدفع من الخادم');
//             }

//         } catch (error) {
//             console.error('Payment error:', error);
            
//             // Handle different error types
//             let errorMessage = 'حدث خطأ أثناء معالجة الطلب';
            
//             if (error.message.includes('Failed to fetch')) {
//                 errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
//             } else if (error.message.includes('Unauthorized') || error.message.includes('401')) {
//                 errorMessage = 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.';
//                 setTimeout(() => navigate('/sign-in'), 2000);
//             } else if (error.message.includes('خطأ في الخادم')) {
//                 errorMessage = error.message;
//             } else if (error.message) {
//                 errorMessage = error.message;
//             }
            
//             setError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (paymentSuccess) {
//         return (
//             <>
//                 <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
//                 <style>{`
//                     * { 
//                         font-family: "Droid Arabic Kufi", serif !important; 
//                     }
//                 `}</style>

//                 <div dir="rtl" className="min-h-screen bg-white px-4 py-16">
//                     <div className="mx-auto max-w-2xl">
//                         <div className="rounded-3xl bg-white p-8 text-center shadow-lg md:p-12">
//                             <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 md:h-24 md:w-24">
//                                 <CheckCircle className="h-12 w-12 text-green-600 md:h-16 md:w-16" />
//                             </div>
//                             <h1 className="mb-4 text-2xl font-bold text-black md:text-3xl">
//                                 تم إتمام عملية الدفع بنجاح!
//                             </h1>
//                             <p className="mb-8 text-base text-black opacity-70 md:text-lg">
//                                 شكراً لك! تم تأكيد طلبك وسيتم تفعيل الدورات في حسابك قريباً
//                             </p>
//                             <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
//                                 <p className="mb-2 text-sm font-medium text-black opacity-60">رقم الطلب</p>
//                                 <p className="text-2xl font-bold text-[#0865a8] md:text-3xl">
//                                     {orderId || 'N/A'}
//                                 </p>
//                                 <p className="mt-4 text-sm font-medium text-black opacity-60">المبلغ المدفوع</p>
//                                 <p className="text-3xl font-bold text-[#f57c00] md:text-4xl">
//                                     {(orderAmount || subtotal).toFixed(2)} جنيه
//                                 </p>
//                                 {cartItems.length > 0 && (
//                                     <p className="mt-2 text-sm text-black opacity-50">
//                                         {cartItems.length} {cartItems.length === 1 ? 'دورة' : 'دورات'}
//                                     </p>
//                                 )}
//                             </div>
//                             <div className="space-y-3">
//                                 <Link
//                                     to="/my-courses"
//                                     className="block w-full rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-semibold text-white transition-all hover:shadow-lg md:py-4"
//                                 >
//                                     عرض دوراتي
//                                 </Link>
//                                 <Link
//                                     to="/"
//                                     className="block w-full rounded-xl border-2 border-gray-200 py-3 font-semibold text-black transition-colors hover:bg-gray-50 md:py-4"
//                                 >
//                                     الصفحة الرئيسية
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
//             <style>{`
//                 * {
//                     font-family: "Droid Arabic Kufi", serif !important;
//                 }
                
//                 @media (max-width: 640px) {
//                     .checkout-main {
//                         padding-top: 100px !important;
//                     }
//                 }
                
//                 @media (min-width: 641px) and (max-width: 1024px) {
//                     .checkout-main {
//                         padding-top: 120px !important;
//                     }
//                 }
                
//                 @media (min-width: 1025px) {
//                     .checkout-main {
//                         padding-top: 130px !important;
//                     }
//                 }
//             `}</style>

//             {/* Fixed Overview Bar */}
//             <div className="fixed left-0 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 md:top-20" style={{top:70}}>
//                 <div className="text-center">
//                     <span className="text-sm md:text-base">
//                         <a href="/" className="ml-3 text-gray-700 transition-colors hover:text-gray-900">الصفحة الرئيسية</a>
//                         <span className="text-gray-500"> - </span>
//                         <Link to="/cart" className="mx-2 text-gray-700 transition-colors hover:text-gray-900">سلة التسوق</Link>
//                         <span className="text-gray-500"> - </span>
//                         <span className="mr-2 font-semibold text-gray-900">إتمام الدفع</span>
//                     </span>
//                 </div>
//             </div>

//             <div dir="rtl" className="checkout-main min-h-screen bg-white px-3 pb-16 sm:px-4 md:px-6">
//                 <div className="mx-auto max-w-7xl">
//                     {/* Page Header */}
//                     <div className="mb-6 text-center md:mb-10">
//                         <h1 className="mb-2 text-3xl font-bold text-black sm:text-4xl md:mb-3 md:text-5xl">
//                             اشترك في دوراتنا
//                         </h1>
//                     </div>

//                     {/* Error Alert */}
//                     {error && (
//                         <div className="mb-6 rounded-lg bg-red-50 p-4 md:mb-8">
//                             <div className="flex items-start gap-3">
//                                 <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
//                                 <div className="flex-1">
//                                     <h3 className="font-semibold text-red-800">خطأ في الدفع</h3>
//                                     <p className="mt-1 text-sm text-red-700">{error}</p>
//                                     <button
//                                         onClick={() => setError('')}
//                                         className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800"
//                                     >
//                                         إغلاق
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
//                         {/* Main Content - Left Side */}
//                         <div className="lg:col-span-2">
//                             {/* Payment Method */}
//                             <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-6 md:p-8">
//                                 <h2 className="mb-4 text-lg font-bold text-black md:mb-6 md:text-xl">تفاصيل الدفع</h2>
                                
//                                 <div className="space-y-3 md:space-y-4">
//                                     {/* Selected Payment Method */}
//                                     <div className="rounded-lg border-2 border-[#0865a8] bg-blue-50/30 p-4 md:p-5">
//                                         <div className="flex items-center gap-3 md:gap-4">
//                                             <div className="flex h-5 w-5 items-center justify-center md:h-6 md:w-6">
//                                                 <div className="h-4 w-4 rounded-full border-2 border-[#0865a8] bg-[#0865a8] md:h-5 md:w-5">
//                                                     <div className="flex h-full w-full items-center justify-center">
//                                                         <div className="h-1.5 w-1.5 rounded-full bg-white md:h-2 md:w-2"></div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="text-sm font-bold text-black md:text-base">بطاقة ائتمان/خصم مباشر</p>
//                                                 <p className="text-xs text-black opacity-60 md:text-sm">Visa, Mastercard</p>
//                                             </div>
//                                             <div className="flex gap-1.5 md:gap-2">
//                                                 <img 
//                                                     src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
//                                                     alt="Visa" 
//                                                     className="h-6 md:h-8"
//                                                 />
//                                                 <img 
//                                                     src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
//                                                     alt="Mastercard" 
//                                                     className="h-6 md:h-8"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Security Info */}
//                                     <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 md:gap-3 md:p-4">
//                                         <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 md:h-5 md:w-5" />
//                                         <div>
//                                             <p className="text-xs font-semibold text-black md:text-sm">
//                                                 معاملة آمنة ومشفرة بالكامل
//                                             </p>
//                                             <p className="mt-1 text-xs text-black opacity-60">
//                                                 معلوماتك محمية بأعلى معايير الأمان العالمية
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Mobile Submit Button */}
//                             <div className="mt-4 md:mt-6 lg:hidden">
//                                 <button
//                                     onClick={handleSubmit}
//                                     disabled={loading || cartItems.length === 0}
//                                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:py-4"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <svg className="h-4 w-4 animate-spin md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             جاري المعالجة...
//                                         </>
//                                     ) : (
//                                         <>
//                                             المتابعة إلى الدفع
//                                             <ArrowRight className="h-4 w-4 rotate-180 md:h-5 md:w-5" />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Order Summary - Right Sidebar */}
//                         <div className="lg:col-span-1">
//                             <div className="sticky top-28 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:top-32 md:p-6">
//                                 {/* Cart Items Preview */}
//                                 <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 md:mb-6 md:pb-4">
//                                     <span className="text-base font-bold text-black md:text-lg">
//                                         {cartItems.length === 0 ? 'السلة فارغة' : cartItems.length === 1 ? 'دورة واحدة' : `${cartItems.length} دورات`}
//                                     </span>
//                                     <Link 
//                                         to="/cart" 
//                                         className="text-xs font-semibold text-[#0865a8] hover:underline md:text-sm"
//                                     >
//                                         تغيير
//                                     </Link>
//                                 </div>

//                                 {/* Order Details */}
//                                 <div className="mb-4 md:mb-6">
//                                     <p className="mb-3 text-sm font-bold text-black md:mb-4">ملخص الطلب</p>
                                    
//                                     {/* Courses List */}
//                                     <div className="mb-3 max-h-48 space-y-2.5 overflow-y-auto md:mb-4 md:space-y-3">
//                                         {cartItems.map((item) => (
//                                             <div key={item.id} className="flex items-start gap-2.5 text-sm md:gap-3">
//                                                 {/* Course Icon */}
//                                                 <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0865a8] to-[#f57c00] md:h-12 md:w-12">
//                                                     <BookOpen className="h-5 w-5 text-white md:h-6 md:w-6" />
//                                                 </div>
//                                                 <div className="min-w-0 flex-1">
//                                                     <p className="line-clamp-2 text-xs font-medium text-black md:text-sm">
//                                                         {item.title}
//                                                     </p>
//                                                     <p className="mt-1 text-xs font-bold text-[#f57c00]">
//                                                         {(item.currentPrice * (item.quantity || 1)).toFixed(2)} جنيه
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Price Breakdown */}
//                                     <div className="space-y-1.5 text-sm md:space-y-2">
//                                         <div className="flex justify-between text-black opacity-70">
//                                             <span className="text-xs md:text-sm">المجموع الفرعي</span>
//                                             <span className="text-xs md:text-sm">{totalOriginalPrice.toFixed(2)} جنيه</span>
//                                         </div>
//                                         {totalDiscount > 0 && (
//                                             <div className="flex justify-between text-green-600">
//                                                 <span className="text-xs md:text-sm">الخصم</span>
//                                                 <span className="text-xs md:text-sm">-{totalDiscount.toFixed(2)} جنيه</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Coupon */}
//                                 {!showCoupon ? (
//                                     <button
//                                         onClick={() => setShowCoupon(true)}
//                                         className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-gray-50 md:mb-6 md:py-3 md:text-sm"
//                                     >
//                                         <Tag className="h-3.5 w-3.5 md:h-4 md:w-4" />
//                                         استخدم كود الخصم
//                                     </button>
//                                 ) : (
//                                     <div className="mb-4 md:mb-6">
//                                         <div className="flex gap-2">
//                                             <input
//                                                 type="text"
//                                                 value={couponCode}
//                                                 onChange={(e) => setCouponCode(e.target.value)}
//                                                 placeholder="أدخل كود الخصم"
//                                                 className="flex-1 rounded-lg border border-gray-300 px-2.5 py-2 text-xs text-black focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20 md:px-3 md:text-sm"
//                                             />
//                                             <button 
//                                                 onClick={() => {
//                                                     if (couponCode.trim()) {
//                                                         alert('سيتم تطبيق الكود عند إتمام الدفع');
//                                                     }
//                                                 }}
//                                                 className="rounded-lg bg-[#0865a8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0865a8]/90 md:px-4 md:text-sm"
//                                             >
//                                                 تطبيق
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Divider */}
//                                 <div className="mb-4 border-t border-gray-200 md:mb-6"></div>

//                                 {/* Total */}
//                                 <div className="mb-4 flex items-center justify-between md:mb-6">
//                                     <span className="text-sm font-bold text-black md:text-base">إجمالي المستحق</span>
//                                     <span className="text-xl font-bold text-[#f57c00] md:text-2xl">
//                                         {subtotal.toFixed(2)} جنيه
//                                     </span>
//                                 </div>

//                                 {/* Desktop Submit Button */}
//                                 <button
//                                     onClick={handleSubmit}
//                                     disabled={loading || cartItems.length === 0}
//                                     className="mb-3 hidden w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:mb-4 md:py-4 lg:flex"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             جاري المعالجة...
//                                         </>
//                                     ) : (
//                                         <>
//                                             المتابعة إلى الدفع
//                                             <ArrowRight className="h-5 w-5 rotate-180" />
//                                         </>
//                                     )}
//                                 </button>

//                                 {/* Security Notice */}
//                                 <div className="rounded-lg bg-gray-50 p-3 text-center md:p-4">
//                                     <Lock className="mx-auto mb-1.5 h-5 w-5 text-black opacity-60 md:mb-2 md:h-6 md:w-6" />
//                                     <p className="text-xs text-black opacity-60">
//                                         الدفع عبر بوابة بنك مصر الآمنة
//                                     </p>
//                                     <p className="mt-1 text-xs font-semibold text-black">
//                                         معاملة مشفرة بتقنية SSL
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }





import { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Lock, CheckCircle, Tag, BookOpen, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();
    
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [error, setError] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [orderAmount, setOrderAmount] = useState(0);

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Check if user is signed in
    useEffect(() => {
        if (!isSignedIn) {
            alert('يجب تسجيل الدخول أولاً');
            navigate('/sign-in');
        }
    }, [isSignedIn, navigate]);

    // Check payment result from URL parameters (after redirect back)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdParam = urlParams.get('orderId');
        const transactionRef = urlParams.get('transactionRef');

        if (orderIdParam && transactionRef) {
            checkPaymentResult(orderIdParam, transactionRef);
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

    // Helper function to handle API responses
    const handleResponse = async (response) => {
        const contentType = response.headers.get('content-type');
        
        console.log('Response status:', response.status);
        console.log('Response content-type:', contentType);
        
        // Try to get the response text first
        const text = await response.text();
        console.log('Raw response:', text.substring(0, 500)); // Log first 500 chars
        
        // Check if response is JSON
        if (contentType && contentType.includes('application/json')) {
            try {
                const data = JSON.parse(text);
                
                if (!response.ok) {
                    throw new Error(data.message || data.error || `خطأ: ${response.status}`);
                }
                
                return data;
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('خطأ في تحليل استجابة الخادم');
            }
        } else {
            // Response is not JSON (HTML, text, etc.)
            console.error('Non-JSON response received');
            
            // Check for specific error patterns
            if (text.includes('System.Net') || text.includes('Exception') || text.includes('Error')) {
                // Extract error message if possible
                const errorMatch = text.match(/<title>(.*?)<\/title>/i);
                const errorMessage = errorMatch ? errorMatch[1] : 'خطأ في الخادم';
                throw new Error(`خطأ في الخادم: ${errorMessage}`);
            }
            
            // If status is 200-299 but not JSON, there might be an issue
            if (response.ok) {
                throw new Error('الخادم أرجع تنسيق غير متوقع. يرجى التواصل مع الدعم الفني.');
            }
            
            throw new Error(`خطأ: ${response.status} ${response.statusText}`);
        }
    };

    // Check payment result
    const checkPaymentResult = async (orderId, transactionRef) => {
        setLoading(true);
        try {
            const token = await getToken();
            
            if (!token) {
                throw new Error('فشل في الحصول على رمز المصادقة');
            }

            console.log('Checking payment result for:', { orderId, transactionRef });
            
            const response = await fetch(
                `https://acwebsite-icmet-test.azurewebsites.net/api/checkout/result?orderId=${orderId}&transactionRef=${transactionRef}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            const result = await handleResponse(response);
            console.log('Payment result:', result);

            // Check for success in multiple possible formats
            const isSuccess = 
                result.status === 'success' || 
                result.status === 'Success' ||
                result.paymentStatus === 'completed' || 
                result.paymentStatus === 'Completed' ||
                result.paymentStatus === 'paid' ||
                result.paymentStatus === 'Paid' ||
                result.isSuccess === true;

            if (isSuccess) {
                setPaymentSuccess(true);
                setOrderId(orderId);
                setOrderAmount(result.totalAmount || subtotal);
                localStorage.removeItem('cartItems');
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                setError('فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
            }
        } catch (error) {
            console.error('Error checking payment result:', error);
            setError(error.message || 'حدث خطأ أثناء التحقق من حالة الدفع');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (cartItems.length === 0) {
            setError('السلة فارغة. يرجى إضافة دورات أولاً.');
            return;
        }

        if (!isSignedIn) {
            alert('يجب تسجيل الدخول أولاً');
            navigate('/sign-in');
            return;
        }

        setLoading(true);

        try {
            // Get authentication token
            const token = await getToken();

            if (!token) {
                throw new Error('فشل في الحصول على رمز المصادقة');
            }

            console.log('Creating order...');
            console.log('Token exists:', !!token);

            // Prepare order data
            const orderData = {
                courses: cartItems.map(item => ({
                    courseId: item.id,
                    title: item.title,
                    quantity: item.quantity || 1,
                    price: item.currentPrice
                })),
                totalAmount: subtotal,
                originalAmount: totalOriginalPrice,
                discount: totalDiscount,
                couponCode: couponCode || null
            };

            console.log('Order data:', JSON.stringify(orderData, null, 2));

            // Create order via API
            const response = await fetch(
                'https://acwebsite-icmet-test.azurewebsites.net/api/checkout/checkout/',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                }
            );

            console.log('Response received, status:', response.status);

            const orderResponse = await handleResponse(response);
            console.log('Order created successfully:', orderResponse);

            // Check different possible response formats
            const paymentUrl = orderResponse.paymentUrl || 
                              orderResponse.PaymentUrl || 
                              orderResponse.payment_url ||
                              orderResponse.url;
            
            const orderId = orderResponse.id || 
                          orderResponse.Id || 
                          orderResponse.orderId || 
                          orderResponse.OrderId;

            console.log('Extracted paymentUrl:', paymentUrl);
            console.log('Extracted orderId:', orderId);

            // Check if response contains payment URL
            if (paymentUrl) {
                console.log('Redirecting to payment gateway:', paymentUrl);
                // Small delay to ensure console logs are visible
                setTimeout(() => {
                    window.location.href = paymentUrl;
                }, 100);
            } else if (orderId) {
                // Store order ID and show success (for testing or if no redirect needed)
                console.log('No payment URL provided, showing success page');
                console.warn('Backend did not provide paymentUrl. Check API response format.');
                
                setOrderId(orderId);
                setOrderAmount(orderResponse.totalAmount || orderResponse.TotalAmount || subtotal);
                setPaymentSuccess(true);
                localStorage.removeItem('cartItems');
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                console.error('Invalid response format:', orderResponse);
                throw new Error('استجابة غير صالحة من الخادم. لا يوجد رابط دفع أو معرف طلب.');
            }

        } catch (error) {
            console.error('Payment error:', error);
            console.error('Error stack:', error.stack);
            
            // Handle different error types
            let errorMessage = 'حدث خطأ أثناء معالجة الطلب';
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
            } else if (error.message.includes('Unauthorized') || error.message.includes('401')) {
                errorMessage = 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.';
                setTimeout(() => navigate('/sign-in'), 2000);
            } else if (error.message.includes('خطأ في الخادم')) {
                errorMessage = error.message + ' - يرجى التواصل مع الدعم الفني إذا استمرت المشكلة.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (paymentSuccess) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`
                    * { 
                        font-family: "Droid Arabic Kufi", serif !important; 
                    }
                `}</style>

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
                                <p className="text-2xl font-bold text-[#0865a8] md:text-3xl">
                                    {orderId || 'N/A'}
                                </p>
                                <p className="mt-4 text-sm font-medium text-black opacity-60">المبلغ المدفوع</p>
                                <p className="text-3xl font-bold text-[#f57c00] md:text-4xl">
                                    {(orderAmount || subtotal).toFixed(2)} جنيه
                                </p>
                                {cartItems.length > 0 && (
                                    <p className="mt-2 text-sm text-black opacity-50">
                                        {cartItems.length} {cartItems.length === 1 ? 'دورة' : 'دورات'}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Link
                                    to="/my-courses"
                                    className="block w-full rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-semibold text-white transition-all hover:shadow-lg md:py-4"
                                >
                                    عرض دوراتي
                                </Link>
                                <Link
                                    to="/"
                                    className="block w-full rounded-xl border-2 border-gray-200 py-3 font-semibold text-black transition-colors hover:bg-gray-50 md:py-4"
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
                
                @media (max-width: 640px) {
                    .checkout-main {
                        padding-top: 100px !important;
                    }
                }
                
                @media (min-width: 641px) and (max-width: 1024px) {
                    .checkout-main {
                        padding-top: 120px !important;
                    }
                }
                
                @media (min-width: 1025px) {
                    .checkout-main {
                        padding-top: 130px !important;
                    }
                }
            `}</style>

            {/* Fixed Overview Bar */}
            <div className="fixed left-0 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 md:top-20" style={{top:70}}>
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

            <div dir="rtl" className="checkout-main min-h-screen bg-white px-3 pb-16 sm:px-4 md:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Page Header */}
                    <div className="mb-6 text-center md:mb-10">
                        <h1 className="mb-2 text-3xl font-bold text-black sm:text-4xl md:mb-3 md:text-5xl">
                            اشترك في دوراتنا
                        </h1>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4 md:mb-8">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-800">خطأ في الدفع</h3>
                                    <p className="mt-1 text-sm text-red-700 whitespace-pre-wrap">{error}</p>
                                    <button
                                        onClick={() => setError('')}
                                        className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800"
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                        {/* Main Content - Left Side */}
                        <div className="lg:col-span-2">
                            {/* Payment Method */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-6 md:p-8">
                                <h2 className="mb-4 text-lg font-bold text-black md:mb-6 md:text-xl">تفاصيل الدفع</h2>
                                
                                <div className="space-y-3 md:space-y-4">
                                    {/* Selected Payment Method */}
                                    <div className="rounded-lg border-2 border-[#0865a8] bg-blue-50/30 p-4 md:p-5">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="flex h-5 w-5 items-center justify-center md:h-6 md:w-6">
                                                <div className="h-4 w-4 rounded-full border-2 border-[#0865a8] bg-[#0865a8] md:h-5 md:w-5">
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-white md:h-2 md:w-2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-black md:text-base">بطاقة ائتمان/خصم مباشر</p>
                                                <p className="text-xs text-black opacity-60 md:text-sm">Visa, Mastercard</p>
                                            </div>
                                            <div className="flex gap-1.5 md:gap-2">
                                                <img 
                                                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
                                                    alt="Visa" 
                                                    className="h-6 md:h-8"
                                                />
                                                <img 
                                                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                                                    alt="Mastercard" 
                                                    className="h-6 md:h-8"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Info */}
                                    <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 md:gap-3 md:p-4">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 md:h-5 md:w-5" />
                                        <div>
                                            <p className="text-xs font-semibold text-black md:text-sm">
                                                معاملة آمنة ومشفرة بالكامل
                                            </p>
                                            <p className="mt-1 text-xs text-black opacity-60">
                                                معلوماتك محمية بأعلى معايير الأمان العالمية
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Submit Button */}
                            <div className="mt-4 md:mt-6 lg:hidden">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:py-4"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            جاري المعالجة...
                                        </>
                                    ) : (
                                        <>
                                            المتابعة إلى الدفع
                                            <ArrowRight className="h-4 w-4 rotate-180 md:h-5 md:w-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Order Summary - Right Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:top-32 md:p-6">
                                {/* Cart Items Preview */}
                                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 md:mb-6 md:pb-4">
                                    <span className="text-base font-bold text-black md:text-lg">
                                        {cartItems.length === 0 ? 'السلة فارغة' : cartItems.length === 1 ? 'دورة واحدة' : `${cartItems.length} دورات`}
                                    </span>
                                    <Link 
                                        to="/cart" 
                                        className="text-xs font-semibold text-[#0865a8] hover:underline md:text-sm"
                                    >
                                        تغيير
                                    </Link>
                                </div>

                                {/* Order Details */}
                                <div className="mb-4 md:mb-6">
                                    <p className="mb-3 text-sm font-bold text-black md:mb-4">ملخص الطلب</p>
                                    
                                    {/* Courses List */}
                                    <div className="mb-3 max-h-48 space-y-2.5 overflow-y-auto md:mb-4 md:space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-start gap-2.5 text-sm md:gap-3">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0865a8] to-[#f57c00] md:h-12 md:w-12">
                                                    <BookOpen className="h-5 w-5 text-white md:h-6 md:w-6" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="line-clamp-2 text-xs font-medium text-black md:text-sm">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-xs font-bold text-[#f57c00]">
                                                        {(item.currentPrice * (item.quantity || 1)).toFixed(2)} جنيه
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price Breakdown */}
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
                                                onClick={() => {
                                                    if (couponCode.trim()) {
                                                        alert('سيتم تطبيق الكود عند إتمام الدفع');
                                                    }
                                                }}
                                                className="rounded-lg bg-[#0865a8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0865a8]/90 md:px-4 md:text-sm"
                                            >
                                                تطبيق
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="mb-4 border-t border-gray-200 md:mb-6"></div>

                                {/* Total */}
                                <div className="mb-4 flex items-center justify-between md:mb-6">
                                    <span className="text-sm font-bold text-black md:text-base">إجمالي المستحق</span>
                                    <span className="text-xl font-bold text-[#f57c00] md:text-2xl">
                                        {subtotal.toFixed(2)} جنيه
                                    </span>
                                </div>

                                {/* Desktop Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    className="mb-3 hidden w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:mb-4 md:py-4 lg:flex"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            جاري المعالجة...
                                        </>
                                    ) : (
                                        <>
                                            المتابعة إلى الدفع
                                            <ArrowRight className="h-5 w-5 rotate-180" />
                                        </>
                                    )}
                                </button>

                                {/* Security Notice */}
                                <div className="rounded-lg bg-gray-50 p-3 text-center md:p-4">
                                    <Lock className="mx-auto mb-1.5 h-5 w-5 text-black opacity-60 md:mb-2 md:h-6 md:w-6" />
                                    <p className="text-xs text-black opacity-60">
                                        الدفع عبر بوابة بنك مصر الآمنة
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-black">
                                        معاملة مشفرة بتقنية SSL
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