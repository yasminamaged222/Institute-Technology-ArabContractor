import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Tag, ArrowRight, Star, Minus, Plus } from 'lucide-react';
import { Link } from "react-router-dom";

const CartItemFull = ({ item, onRemove, onUpdateQuantity }) => {
    const [quantity, setQuantity] = useState(item.quantity || 1);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="group relative mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative md:w-64">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-48 w-full object-cover md:h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-l"></div>
                    {item.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            {item.badge}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="flex-1 text-lg font-bold leading-tight text-gray-900 md:text-xl">
                            {item.title}
                        </h3>
                    </div>

                    <p className="mb-3 text-sm text-gray-600">
                        بواسطة <span className="font-semibold text-[#0865a8]">{item.instructor}</span>
                    </p>

                    {/* Rating */}
                    <div className="mb-3 flex items-center gap-2">
                        <span className="text-base font-bold text-amber-600">{item.rating}</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(item.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            ({item.reviews.toLocaleString('ar-EG')} تقييم)
                        </span>
                    </div>

                    {/* Course Info */}
                    <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-gray-900">{item.hours}</span> ساعة إجمالي
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold text-gray-900">{item.lectures}</span> محاضرة
                        </span>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-[#0865a8]">
                            {item.level}
                        </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-4 md:flex-row md:items-end md:justify-between">
                        {/* Quantity & Remove */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-100"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-100"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => onRemove(item.id)}
                                className="flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                                حذف
                            </button>
                        </div>

                        {/* Price */}
                        <div className="text-left md:text-right">
                            <div className="mb-1 flex items-center gap-2">
                                <span className="text-2xl font-bold text-[#f57c00]">
                                    {(item.currentPrice * quantity).toFixed(2)} ج.م
                                </span>
                                {item.coupon && (
                                    <Tag className="h-4 w-4 text-emerald-600" title={item.coupon} />
                                )}
                            </div>
                            <p className="text-sm font-medium text-gray-400 line-through">
                                {(item.originalPrice * quantity).toFixed(2)} ج.م
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ShoppingCartPage() {
    const [items, setItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            return JSON.parse(savedCart).map(item => ({
                ...item,
                quantity: item.quantity || 1
            }));
        }
        return [];
    });

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(items));
        window.dispatchEvent(new Event('cartUpdated'));
    }, [items]);

    const handleRemove = (id) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id, quantity) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'DISCOUNT2025') {
            setAppliedCoupon({ code: 'DISCOUNT2025', discount: 50 });
        } else if (couponCode.toUpperCase() === 'WELCOME10') {
            setAppliedCoupon({ code: 'WELCOME10', discount: 25 });
        } else {
            alert('كود الخصم غير صالح');
        }
    };

    const subtotal = items.reduce((sum, item) => sum + (item.currentPrice * (item.quantity || 1)), 0);
    const totalOriginalPrice = items.reduce((sum, item) => sum + (item.originalPrice * (item.quantity || 1)), 0);
    const baseDiscount = totalOriginalPrice - subtotal;
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const totalPrice = subtotal - couponDiscount;
    const totalSavings = totalOriginalPrice - totalPrice;
    const discountPercent = Math.round((totalSavings / totalOriginalPrice) * 100);

    return (
        <>
            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />

            <style>{`
        * {
          font-family: "Droid Arabic Kufi", serif !important;
        }
      `}</style>

            {/* Fixed Overview Bar - positioned under navbar */}
            <div className="fixed left-0 top-16 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 md:top-20">
                <div className="text-center">
                    <span className="text-sm md:text-base">
                        <a href="/" className="ml-3 text-gray-700 transition-colors hover:text-gray-900">الصفحة الرئيسية</a>
                        <span className="text-gray-500"> - </span>
                        <span className="mr-3 text-gray-700">سلة التسوق</span>
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20 pb-12 pt-28 md:pt-32" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 bg-gradient-to-r from-[#0865a8] to-[#f57c00] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                            سلة التسوق
                        </h1>
                        <p className="text-lg text-gray-600">
                            {items.length} {items.length === 1 ? 'دورة' : items.length === 2 ? 'دورتان' : 'دورات'} في السلة
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            {items.length === 0 ? (
                                <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
                                    <ShoppingCart className="mx-auto mb-4 h-24 w-24 text-gray-300" />
                                    <h3 className="mb-2 text-2xl font-bold text-gray-700">سلة التسوق فارغة</h3>
                                    <p className="mb-6 text-gray-500">لم تقم بإضافة أي دورات إلى السلة بعد</p>
                                    <Link
                                        to="/courses"
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
                                    >
                                        تصفح الدورات
                                        <ArrowRight className="h-5 w-5 rotate-180" />
                                    </Link>
                                </div>
                            ) : (
                                items.map(item => (
                                    <CartItemFull
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                        onUpdateQuantity={handleUpdateQuantity}
                                    />
                                ))
                            )}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 rounded-2xl bg-white p-6 shadow-xl">
                                <h2 className="mb-6 text-xl font-bold text-gray-900">ملخص الطلب</h2>

                                {/* Price Breakdown */}
                                <div className="mb-6 space-y-3 border-b border-gray-200 pb-6">
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>المجموع الفرعي</span>
                                        <span className="font-semibold">{totalOriginalPrice.toFixed(2)} ج.م</span>
                                    </div>
                                    {baseDiscount > 0 && (
                                        <div className="flex items-center justify-between text-emerald-600">
                                            <span className="font-medium">خصم الدورات</span>
                                            <span className="font-semibold">-{baseDiscount.toFixed(2)} ج.م</span>
                                        </div>
                                    )}
                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between text-emerald-600">
                                            <span className="font-medium">كود الخصم ({appliedCoupon.code})</span>
                                            <span className="font-semibold">-{couponDiscount.toFixed(2)} ج.م</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="mb-6">
                                    <p className="mb-1 text-sm text-gray-500">الإجمالي:</p>
                                    <p className="mb-3 text-4xl font-bold text-[#f57c00]">
                                        {totalPrice.toFixed(2)} ج.م
                                    </p>
                                    {discountPercent > 0 && (
                                        <div className="inline-block rounded-full bg-gradient-to-r from-emerald-100 to-green-100 px-4 py-2 text-sm font-bold text-emerald-700">
                                            🎉 وفرت {discountPercent}% ({totalSavings.toFixed(2)} ج.م)
                                        </div>
                                    )}
                                </div>

                                {/* Checkout Button */}
                                {items.length > 0 && (
                                    <Link
                                        to="/checkout"
                                        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        المتابعة للدفع
                                        <ArrowRight className="h-5 w-5 rotate-180" />
                                    </Link>
                                )}

                                <p className="mb-6 text-center text-xs text-gray-500">
                                    🔒 معاملة آمنة ومحمية
                                </p>

                                {/* Coupon Section */}
                                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/30 p-4">
                                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Tag className="h-4 w-4 text-[#f57c00]" />
                                        هل لديك كود خصم؟
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="أدخل الكود"
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="rounded-lg bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
                                        >
                                            تطبيق
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        جرب: <span className="font-mono font-semibold">DISCOUNT2025</span>
                                    </p>
                                </div>

                                {/* Security Badges */}
                                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                        SSL آمن
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                        </svg>
                                        دفع آمن
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