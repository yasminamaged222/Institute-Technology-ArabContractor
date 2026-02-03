import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// All courses data
const allCourses = [
    // برامج موجهة للمهندسين
    {
        category: 'برامج موجهة للمهندسين',
        title: 'إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء - المرحلة الأولى',
        institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
        date: '2025/08/17 - 2025/08/28',
        description: 'تزويد مهندسى ميكانيكا وكهرباء حديثى التخرج حديثى التعيين بالمعارف والمهارات التي تمكنهم من العمل فى مشروعات التشييد بالاساليب الصحيحة والآمنة وكذلك بالجودة المطلوبة.',
        price: 299.99,
        originalPrice: 499.99,
        hours: 40,
        lectures: 120,
        level: 'مبتدئ'
    },
    {
        category: 'برامج موجهة للمهندسين',
        title: 'إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء - المرحلة الثانية',
        institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
        date: '2025/12/21 - 2026/01/01',
        description: 'تزويد مهندسى ميكانيكا وكهرباء حديثى التخرج حديثى التعيين بالمعارف والمهارات التي تمكنهم من العمل فى مشروعات التشييد بالأسلوب الصحيح والآمن وكذلك بالجودة المطلوبة',
        price: 349.99,
        originalPrice: 549.99,
        hours: 45,
        lectures: 135,
        level: 'متوسط'
    },
    {
        category: 'برامج موجهة للمهندسين',
        title: 'إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء - المرحلة الثالثة',
        institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
        date: '2026/04/19 - 2026/04/30',
        description: 'تزويد مهندسى ميكانيكا وكهرباء حديثى التخرج حديثى التعيين بالمعارف والمهارات التي تمكنهم من العمل فى مشروعات التشييد بالأساليب الصحيحه والآمنة بالجودة المطلوبة.',
        price: 399.99,
        originalPrice: 599.99,
        hours: 50,
        lectures: 150,
        level: 'متقدم'
    },

    // المحور الأول : المعلومات الهندسية الأساسية
    {
        category: 'المحور الأول : المعلومات الهندسية الأساسية',
        title: 'التصميم باستخدام برنامج الــ Revit مدني (أساسيات)',
        institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
        date: '2025/12/28 - 2026/01/01',
        description: 'التعرف على كيفية التصميم باستخدام برنامج الــ Revit',
        price: 249.99,
        originalPrice: 399.99,
        hours: 30,
        lectures: 90,
        level: 'مبتدئ'
    },
    {
        category: 'المحور الأول : المعلومات الهندسية الأساسية',
        title: 'التصميم باستخدام برنامج الــ Revit عمارة (أساسيات)',
        institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
        date: '2025/09/28 - 2025/10/02',
        description: 'التعرف على كيفية التصميم باستخدام برنامج الــ Revit',
        price: 249.99,
        originalPrice: 399.99,
        hours: 30,
        lectures: 90,
        level: 'مبتدئ'
    },

    // المحور الثانى : التطبيقات الهندسية المختلفة
    {
        category: 'المحور الثانى : التطبيقات الهندسية المختلفة',
        title: 'المساحة المستوية بإستخدام تطبيقات الاكسيل',
        institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
        date: '2025/08/24 - 2025/08/28',
        description: 'تزويد المشاركين بالمهارات والمعارف التي تخص أعمال المساحة',
        price: 199.99,
        originalPrice: 349.99,
        hours: 25,
        lectures: 75,
        level: 'مبتدئ'
    },
];

const CourseCategory = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    const filteredCourses = allCourses.filter(
        (course) => course.category === decodeURIComponent(category)
    );

    const categoryTitle = decodeURIComponent(category);

    const addToCart = (course) => {
        const existingCart = localStorage.getItem('cartItems');
        const cartItems = existingCart ? JSON.parse(existingCart) : [];

        const isInCart = cartItems.some(item => item.title === course.title);
        if (!isInCart) {
            const cartItem = {
                id: Date.now(),
                title: course.title,
                instructor: 'المعهد التكنولوجي',
                image: 'https://img-c.udemycdn.com/course/240x135/4931546_c247.jpg',
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
            window.dispatchEvent(new Event('cartUpdated'));
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
                            <Link to="/" className="ml-3 text-gray-700 transition-colors hover:text-gray-900">
                                الصفحة الرئيسية
                            </Link>
                            <span className="text-gray-500"> - </span>
                            <span className="mx-2 text-gray-700">الخطة التدريبية</span>
                            <span className="text-gray-500"> - </span>
                            <span className="mr-2 text-gray-700">{categoryTitle}</span>
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
                    <div className="container mx-auto mt-24 px-4 pb-16 pt-8 md:mt-32">
                        {/* Page Title */}
                        <div className="mb-12 text-center">
                            <h1 className="mb-4 bg-gradient-to-r from-[#0865a8] to-[#f57c00] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                                {categoryTitle}
                            </h1>
                            <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#0865a8] to-[#f57c00]"></div>
                            <p className="mt-4 text-lg text-gray-600">
                                {filteredCourses.length} دورة متاحة
                            </p>
                        </div>

                        {/* Courses Grid */}
                        {filteredCourses.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredCourses.map((course, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                                    >
                                        {/* Gradient Border Effect */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                        <div className="relative m-[2px] flex h-full flex-col rounded-2xl bg-white">

                                            {/* Header with gradient */}
                                            <div className="via-[#0865a8]/90 relative h-44 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#0865a8] to-[#f57c00]">
                                                <div className="absolute inset-0 bg-black/10"></div>
                                                <div className="relative flex h-full items-center justify-center">
                                                    <div className="rounded-full bg-white/20 p-6 backdrop-blur-sm">
                                                        <svg className="h-14 w-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Discount Badge */}
                                                <div className="absolute left-4 top-4">
                                                    <span className="rounded-full bg-[#f57c00] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                                                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% خصم
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-1 flex-col p-6">
                                                {/* Title */}
                                                <h3 className="mb-4 line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-tight text-[#0865a8] transition-colors group-hover:text-[#f57c00]">
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
                                                    <span>{course.date}</span>
                                                </div>

                                                {/* Stats */}
                                                <div className="mb-4 flex flex-wrap gap-3 text-xs">
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="font-semibold text-gray-900">{course.hours}</span> ساعة
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="font-semibold text-gray-900">{course.lectures}</span> محاضرة
                                                    </span>
                                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-[#0865a8]">
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
                                                        <p className="text-xs text-gray-400 line-through">
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
                                                    </div>
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => addToCart(course)}
                                                        className="flex-1 rounded-lg bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-4 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                                    >
                                                        أضف إلى السلة
                                                    </button>
                                                    <button className="rounded-lg border-2 border-[#0865a8] bg-white px-4 py-3 font-bold text-[#0865a8] transition-all duration-300 hover:bg-[#0865a8] hover:text-white">
                                                        التفاصيل
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
                                <svg className="mx-auto mb-4 h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="mb-2 text-xl font-bold text-gray-700">لا توجد دورات متاحة</h3>
                                <p className="text-gray-500">لا توجد دورات في هذه الفئة حالياً. يرجى التحقق لاحقاً.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseCategory;