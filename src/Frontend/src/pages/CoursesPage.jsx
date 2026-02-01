import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CoursesPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const courses = [
        {
            id: 1,
            title: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الأولى ( أعمال الهيكل الخرساني)',
            institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
            startDate: '2025/11/02',
            endDate: '2025/11/13',
            description: 'تزويد مهندسى مدني وعمارة حديثي التخرج حديثي التعيين بالمهارات والمعارف اللازمة للعمل في المشروعات بالطرق الصحيحة والآمنة بالجودة المطلوبة.',
            price: 299.99,
            originalPrice: 499.99,
            instructor: 'د. محمد أحمد',
            hours: 45,
            lectures: 128,
            level: 'مبتدئ',
            image: 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg'
        },
        {
            id: 2,
            title: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثانيه ( أعمال التشطيبات الأساسية)',
            institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
            startDate: '2025/12/07',
            endDate: '2025/12/18',
            description: 'تزويد مهندسى مدني وعمارة حديثى التخرج حديثى التعيين بالمعارف والمهارات اللازمه لتنفيذ مشروعات التشييد بالطرق الصحيحة والآمنة وكذلك بالجودة المطلوبة.',
            price: 349.99,
            originalPrice: 549.99,
            instructor: 'د. سارة محمود',
            hours: 52,
            lectures: 156,
            level: 'متوسط',
            image: 'https://img-c.udemycdn.com/course/240x135/3237889_1bcc_2.jpg'
        },
        {
            id: 3,
            title: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثالثة (إدارة المشروعات والمالية)',
            institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
            startDate: '2026/01/11',
            endDate: '2026/01/22',
            description: 'تزويد مهندسي مدني وعمارة حديثي التخرج حديثي التعيين بالمعارف والمهارات اللازمه لتنفيذ مشروعات التشييد بالطرق الصحيحة والآمنة وكذلك بالجودة المطلوبة.',
            price: 399.99,
            originalPrice: 599.99,
            instructor: 'د. خالد عبد الرحمن',
            hours: 60,
            lectures: 180,
            level: 'متقدم',
            image: 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg'
        }
    ];

    const addToCart = (course) => {
        const existingCart = localStorage.getItem('cartItems');
        const cartItems = existingCart ? JSON.parse(existingCart) : [];

        // Check if course already in cart
        const isInCart = cartItems.some(item => item.id === course.id);
        if (!isInCart) {
            const cartItem = {
                id: course.id,
                title: course.title,
                instructor: course.instructor,
                image: course.image,
                rating: 4.6,
                reviews: 5500,
                hours: course.hours,
                lectures: course.lectures,
                level: course.level,
                currentPrice: course.price,
                originalPrice: course.originalPrice,
                badge: 'الأكثر مبيعاً',
                coupon: 'DISCOUNT2025'
            };

            cartItems.push(cartItem);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            setCart(cartItems);
            window.dispatchEvent(new Event('cartUpdated'));

            // Navigate to cart
            navigate('/cart');
        }
    };

    return (
        <>
            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />

            <style>{`
        * {
          font-family: "Droid Arabic Kufi", serif !important;
        }
      `}</style>

            <div dir="rtl">
                {/* Fixed Overview Bar - positioned under navbar */}
                <div className="fixed left-0 top-16 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2 md:top-20">
                    <div className="text-center">
                        <span className="text-sm md:text-base">
                            <a href="/" className="ml-3 text-gray-700 transition-colors hover:text-gray-900">الصفحة الرئيسية</a>
                            <span className="text-gray-500"> - </span>
                            <span className="mr-3 text-gray-700">الخطة التدريبية - برنامج إعداد وتأهيل مهندس حديث مدنى وعمارة</span>
                        </span>
                    </div>
                </div>

                {/* Main Content - with proper padding for fixed header */}
                <div className="container mx-auto mt-24 px-4 pb-12 pt-6 md:mt-32">
                    <div className="mb-8 text-center">
                        <h1 className="mb-4 text-3xl font-bold text-[#0865a8] md:text-4xl">
                            دورات إعداد وتأهيل المهندسين
                        </h1>
                        <p className="text-lg text-gray-600">
                            اختر الدورة المناسبة لك وابدأ رحلتك التعليمية
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="flex flex-col overflow-hidden rounded-2xl border-t-4 border-[#f57c00] bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                {/* Course Image */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0865a8] to-[#f57c00]">
                                    <div className="flex h-full items-center justify-center">
                                        <div className="rounded-full bg-white/20 p-8 backdrop-blur-sm">
                                            <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="absolute left-3 top-3">
                                        <span className="rounded-full bg-[#f57c00] px-3 py-1 text-xs font-bold text-white shadow-lg">
                                            {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% خصم
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    {/* Title */}
                                    <h3 className="mb-4 line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-tight text-[#0865a8]">
                                        {course.title}
                                    </h3>

                                    {/* Institute */}
                                    <div className="mb-3 flex items-start gap-2 text-sm text-gray-700">
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f57c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="line-clamp-2">{course.institute}</span>
                                    </div>

                                    {/* Date */}
                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-700">
                                        <svg className="h-5 w-5 flex-shrink-0 text-[#f57c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{course.startDate} - {course.endDate}</span>
                                    </div>

                                    {/* Course Stats */}
                                    <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">{course.hours}</span> ساعة
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">{course.lectures}</span> محاضرة
                                        </span>
                                        <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-[#0865a8]">
                                            {course.level}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                                        {course.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-4 flex items-end justify-between border-t border-gray-100 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 line-through">
                                                {course.originalPrice} ج.م
                                            </p>
                                            <p className="text-2xl font-bold text-[#f57c00]">
                                                {course.price} ج.م
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                            <svg className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="font-bold text-gray-900">4.6</span>
                                            <span>(5,500+)</span>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => addToCart(course)}
                                            className="flex-1 rounded-lg bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                        >
                                            أضف إلى السلة
                                        </button>
                                        <button className="rounded-lg border-2 border-[#0865a8] bg-white px-6 py-3 font-bold text-[#0865a8] transition-all duration-300 hover:bg-[#0865a8] hover:text-white">
                                            التفاصيل
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoursesPage;