// pages/ShoppingCartPage.jsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Tag, ArrowRight, Star } from 'lucide-react';

const initialCartItems = [
    {
        id: 1,
        title: 'دليل Asp.Net Core 10 الشامل والنهائي',
        instructor: 'أكاديمية الويب - هارشا فاردان',
        image: 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg',
        rating: 4.6,
        reviews: 7155,
        hours: 86.5,
        lectures: 432,
        level: 'جميع المستويات',
        currentPrice: 259.99,
        originalPrice: 379.99,
        badge: 'الأكثر مبيعاً',
        coupon: 'UPGRADE02223'
    },
    {
        id: 2,
        title: 'دليل C# 13 الشامل من المبتدئ للمحترف',
        instructor: 'أكاديمية الويب - هارشا فاردان',
        image: 'https://img-c.udemycdn.com/course/240x135/3237889_1bcc_2.jpg',
        rating: 4.6,
        reviews: 5509,
        hours: 86,
        lectures: 479,
        level: 'جميع المستويات',
        currentPrice: 249.99,
        originalPrice: 349.99,
        badge: 'الأكثر مبيعاً',
        coupon: 'UPGRADE02223'
    }
];

const CartItemFull = ({ item, onRemove }) => (
    <div className="group relative mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl">
        <div className="flex flex-col sm:flex-row">
            <div className="relative sm:w-56">
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover sm:h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-l"></div>
                {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        {item.badge}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="flex-1 text-lg font-bold leading-tight text-gray-900">
                        {item.title}
                    </h3>
                </div>

                <p className="mb-3 text-sm text-gray-600">
                    بواسطة {item.instructor}
                </p>

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

                <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">{item.hours}</span> ساعة إجمالي
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">{item.lectures}</span> محاضرة
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">
                        {item.level}
                    </span>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex gap-3">
                        <button
                            onClick={() => onRemove(item.id)}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                            حذف
                        </button>
                    </div>

                    <div className="text-left">
                        <div className="mb-1 flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {item.currentPrice} ج.م
                            </span>
                            {item.coupon && (
                                <Tag className="h-4 w-4 text-emerald-600" title={item.coupon} />
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-400 line-through">
                            {item.originalPrice} ج.م
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function ShoppingCartPage() {
    // Initialize cart from localStorage or use default items
    const [items, setItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            return JSON.parse(savedCart);
        }
        // Save initial items to localStorage
        localStorage.setItem('cartItems', JSON.stringify(initialCartItems));
        return initialCartItems;
    });

    // Update localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(items));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
    }, [items]);

    const handleRemove = (id) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const totalPrice = items.reduce((sum, item) => sum + item.currentPrice, 0);
    const totalOriginalPrice = items.reduce((sum, item) => sum + item.originalPrice, 0);
    const discount = totalOriginalPrice - totalPrice;
    const discountPercent = Math.round((discount / totalOriginalPrice) * 100);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />

            <style>{`
                * {
                    font-family: "Droid Arabic Kufi", serif !important;
                }
            `}</style>

            <div className="top-100 fixed left-0 z-50 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2">
                <div className="text-center">
                    <span className="text-base">
                        <a href="/" className="ml-3 text-gray-700 hover:text-gray-900">الصفحة الرئيسية</a>
                        <span className="text-gray-500">-</span>
                        <span className="mr-3 text-gray-700">سلة التسوق</span>
                    </span>
                </div>
            </div>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pb-12 pt-12" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="mb-2 text-4xl font-bold text-gray-900">
                            سلة التسوق
                        </h1>
                        <p className="text-gray-600">
                            {items.length} دورة في السلة
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            {items.length === 0 ? (
                                <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                                    <ShoppingCart className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                                    <p className="text-lg text-gray-600">سلة التسوق فارغة</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <CartItemFull
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                    />
                                ))
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl">
                                <div className="mb-6 space-y-3 border-b border-gray-200 pb-6">
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>المجموع الفرعي</span>
                                        <span className="font-semibold">{totalOriginalPrice.toFixed(2)} ج.م</span>
                                    </div>
                                    <div className="flex items-center justify-between text-emerald-600">
                                        <span className="font-medium">الخصم</span>
                                        <span className="font-semibold">-{discount.toFixed(2)} ج.م</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="mb-1 text-sm text-gray-500">الإجمالي:</p>
                                    <p className="mb-2 text-4xl font-bold text-gray-900">
                                        {totalPrice.toFixed(2)} ج.م
                                    </p>
                                    {discountPercent > 0 && (
                                        <div className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                                            خصم {discountPercent}%
                                        </div>
                                    )}
                                </div>

                                <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                                    المتابعة للدفع
                                    <ArrowRight className="h-5 w-5 rotate-180" />
                                </button>

                                <p className="mb-6 text-center text-xs text-gray-500">
                                    لن يتم الخصم الآن
                                </p>

                                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                                    <p className="mb-2 text-sm font-semibold text-gray-700">
                                        كود الخصم
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="أدخل الكود"
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                        <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
                                            تطبيق
                                        </button>
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