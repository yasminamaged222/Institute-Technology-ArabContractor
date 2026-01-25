import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link at the top
const CustomersSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerSlide, setItemsPerSlide] = useState(6);

    const customers = [
        { id: 1, name: 'جامعة حلوان', image: 'customer01.jpg' },
        { id: 2, name: 'جامعة القاهرة', image: 'customer02.jpg' },
        { id: 3, name: 'نقابه المهندسين المصرية العامة', image: 'customer03.jpg' },
        { id: 4, name: 'المعهد العالى للتكنولوجيا السادس من اكتوبر', image: 'customer04.jpg' },
        { id: 5, name: 'مصر الجديدة للإسكان والتعمير', image: 'customer05.jpg' },
        { id: 6, name: 'المعهد العالى للتكنولوجيا العاشر من رمضان', image: 'customer06.jpg' },
        { id: 7, name: 'جامعة المنوفية', image: 'customer07.jpg' },
        { id: 8, name: 'جامعة عين شمس', image: 'customer08.jpg' },
        { id: 9, name: 'جامعة 6 اكتوبر', image: 'customer09.jpg' },
        { id: 10, name: '(مختار ابراهيم سابقا)المقاولات المصرية', image: 'customer10.jpg' },
        { id: 11, name: 'جامعة قناة السويس', image: 'customer11.jpg' },
        { id: 12, name: 'الجامعة الامريكية', image: 'customer12.jpg' },
        { id: 13, name: 'العربية العامة للمقاولات', image: 'customer13.jpg' },
        { id: 14, name: 'شركة بتروجيت', image: 'customer14.jpg' },
        { id: 15, name: 'مجموعة شركات طلعت مصطفى', image: 'customer15.jpg' },
        { id: 16, name: 'جامعة جازان (المملكة العربية السعودية)', image: 'customer16.jpg' },
        { id: 17, name: 'مودرن اكاديمي', image: 'customer17.jpg' },
        { id: 18, name: 'جامعة الاهرام الكندية', image: 'customer18.jpg' },
        { id: 19, name: 'هيئة المحطات النووية لتوليد الكهرباء', image: 'customer19.jpg' },
        { id: 20, name: 'الجامعة الروسية', image: 'customer20.jpg' },
        { id: 21, name: 'شركة فنسي الفرنسية', image: 'customer21.jpg' },
        { id: 22, name: 'مؤسسة الثقافة العمالية', image: 'customer22.jpg' },
        { id: 23, name: 'جامعة دمشق', image: 'customer23.jpg' },
        { id: 24, name: 'مجلس التدريب الصناعى', image: 'customer24.jpg' },
        { id: 25, name: 'جامعة السودان', image: 'customer25.jpg' },
        { id: 26, name: 'جمعية المحاسبين والمراجعين المصرية', image: 'customer26.jpg' },
        { id: 27, name: 'جامعة اليمن', image: 'customer27.jpg' },
        { id: 28, name: 'نقابه المهندسين المصرية الفرعية بالقاهرة', image: 'customer28.jpg' },
        { id: 29, name: 'وزارة الاسكان والمرافق والمجتمعات العمرانية', image: 'customer29.jpg' },
        { id: 30, name: 'جمعية الهندسة الادارية', image: 'customer30.jpg' },
        { id: 31, name: 'نقابه المهندسين المصرية الفرعية بدمياط', image: 'customer31.jpg' },
        { id: 32, name: 'شركة خليج السويس ( جابكو )', image: 'customer32.jpg' },
        { id: 33, name: 'شركة بترول بلاعيم', image: 'customer33.jpg' },
        { id: 34, name: 'شركة غاز مصر', image: 'customer34.jpg' },
        { id: 35, name: 'القابضة للتشييد والتعمير', image: 'customer35.jpg' },
        { id: 36, name: 'طابا للمقاولات', image: 'customer36.jpg' },
        { id: 37, name: 'الاتحاد المصرى لمقاولى التشييد و البناء', image: 'customer37.jpg' },
        { id: 38, name: 'الصعيد العامة للمقاولات', image: 'customer38.jpg' },
        { id: 39, name: 'النصر للمرافق والتركيبات', image: 'customer39.jpg' },
        { id: 40, name: 'العامة للإنشاءات (رولان)', image: 'customer40.jpg' },
        { id: 41, name: 'هيئة قناة السويس', image: 'customer41.jpg' },
        { id: 42, name: 'الهيئة العامة للابنية التعليمية', image: 'customer42.jpg' },
        { id: 43, name: 'دول الكومنولث', image: 'customer43.jpg' },
        { id: 44, name: 'وزارة الاسكان اليمنية', image: 'customer44.jpg' },
        { id: 45, name: 'وزارة الدفاع المصرية', image: 'customer45.jpg' },
        { id: 46, name: 'البحر الاحمر العامة للمقاولات', image: 'customer46.jpg' },
        { id: 47, name: 'رئاسة جمهورية مصر العربية', image: 'customer47.jpg' },
        { id: 48, name: 'الجيزة العامة للمقاولات', image: 'customer48.jpg' },
        { id: 49, name: 'النيل للخرسانة الجاهزة', image: 'customer49.jpg' },
        { id: 50, name: 'النصر العامة للمقاولات (حسن علام)', image: 'customer50.jpg' },
        { id: 51, name: 'مدينة نصر للإسكان والتعمير', image: 'customer51.jpg' },
        { id: 52, name: 'العامة للمقاولات والاعمال الصحية والتكميلية', image: 'customer52.jpg' },
        { id: 53, name: 'دريم لاند (احمد بهجت)', image: 'customer53.jpg' },
        { id: 54, name: 'الهيئة العامة للطرق و الكبارى و النقل البرى', image: 'customer54.jpg' },
        { id: 55, name: 'اطلس العامة للمقاولات', image: 'customer55.jpg' },
        { id: 56, name: 'اتحاد عمال البناء', image: 'customer56.jpg' },
        { id: 57, name: 'الهيئة القومية للانفاق', image: 'customer57.jpg' },
        { id: 58, name: 'القاهرة العامة للمقاولات', image: 'customer58.jpg' },
        { id: 59, name: 'النصر العامة للأعمال المدنية', image: 'customer59.jpg' },
        { id: 60, name: 'الدلتا العامة للمقاولات المصرية للإنشاءات', image: 'customer60.jpg' },
        { id: 61, name: 'وزارة الاسكان البحرانية', image: 'customer61.jpg' },
        { id: 62, name: 'هندسة المنشآت العسكرية الكويتية', image: 'customer62.jpg' },
        { id: 63, name: 'وزارة الاسكان السودانية', image: 'customer63.jpg' },
        { id: 64, name: 'وزارة البترول الليبية', image: 'customer64.jpg' },
        { id: 65, name: 'الشمس للإسكان والتعمير', image: 'customer65.jpg' },
        { id: 66, name: 'مصر لأعمال الاسمنت المسلح', image: 'customer66.jpg' },
        { id: 67, name: 'المكتب العربي للتصميمات', image: 'customer67.jpg' },
        { id: 68, name: 'المحمودية العامة للمقاولات', image: 'customer68.jpg' },
        { id: 69, name: 'النصر للمباني والانشاءات', image: 'customer69.jpg' },
        { id: 70, name: 'شركة مصر الدولية للمقاولات', image: 'customer70.jpg' },
        { id: 71, name: 'شركة AHD', image: 'customer71.jpg' },
        { id: 72, name: 'شركة ايفل', image: 'customer72.jpg' },
        { id: 73, name: 'شركة ريدكون للتعمير', image: 'customer73.jpg' },
        { id: 74, name: 'شركة الحازق', image: 'customer74.jpg' },
    ];

    // 1. Adaptive Breakpoints: Sync JS logic with Tailwind breakpoints
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) { // mobile
                setItemsPerSlide(2);
            } else if (width < 768) { // sm
                setItemsPerSlide(3);
            } else if (width < 1024) { // md
                setItemsPerSlide(4);
            } else if (width < 1280) { // lg
                setItemsPerSlide(5);
            } else { // xl+
                setItemsPerSlide(6);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = Math.ceil(customers.length / itemsPerSlide);

    // Reset index if it exceeds new totalSlides on resize
    useEffect(() => {
        if (currentIndex >= totalSlides) {
            setCurrentIndex(0);
        }
    }, [itemsPerSlide, totalSlides, currentIndex]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

    useEffect(() => {
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [totalSlides]);

    const getVisibleCustomers = () => {
        const start = currentIndex * itemsPerSlide;
        return customers.slice(start, start + itemsPerSlide);
    };

    return (
        <section style={{ height: '500px' }} className="bg-gray-5 overflow-hidden py-1 md:py-2" dir="rtl">
            <div  className="container mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="mb-16 text-center">
                    <Link to="/customers" className="group/title inline-block">
                        <h3 className="mb-1 text-3xl font-bold text-[#065a8a] transition-colors group-hover/title:text-blue-700 md:text-4xl">
                            عملاؤنا
                        </h3>
                        <div className="mx-auto mb-1 h-1 w-20 rounded-full bg-[#065a8a] transition-all group-hover/title:w-32"></div>
                    </Link>
                    <p className="text-gray-600">نسعى دائما لإرضاء العميل بتقديم أفضل الخدمات</p>
                </div>

                {/* Slider Wrapper - No margin at the end */}
                <div className="group relative">

                    {/* Navigation Buttons - Hidden on small mobile for cleaner look */}
                    <button
                        onClick={prevSlide}
                        className="-translate-y-1/2 absolute -left-4 top-1/2 z-20 hidden rounded-full bg-white/90 p-2 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-[#065a8a] hover:text-white sm:block md:-left-6 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Grid with explicit column mapping to itemsPerSlide */}
                    <div className="w-full">
                        <div className={`grid gap-4 md:gap-8 transition-all duration-700 ease-in-out
              grid-cols-2 
              sm:grid-cols-3 
              md:grid-cols-4 
              lg:grid-cols-5 
              xl:grid-cols-6`
                        }>
                            {getVisibleCustomers().map((customer) => (
                                <div
                                    key={customer.id}
                                    className="animate-fadeIn group flex flex-col items-center"
                                >
                                    <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                                        <img
                                            src={`/images/${customer.image}`}
                                            alt={customer.name}
                                            className="max-h-full max-w-full object-contain grayscale filter transition-all duration-500 hover:grayscale-0"
                                        />
                                    </div>
                                    <h6 className="mt-4 line-clamp-2 px-2 text-center text-xs font-semibold text-gray-500 group-hover:text-[#065a8a] md:text-sm">
                                        {customer.name}
                                    </h6>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextSlide}
                        className="-translate-y-1/2 absolute -right-4 top-1/2 z-20 hidden rounded-full bg-white/90 p-2 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-[#065a8a] hover:text-white sm:block md:-right-6 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Indicators */}
                <div className="mt-12 flex items-center justify-center gap-3">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all duration-500 rounded-full ${currentIndex === index
                                    ? 'w-8 h-2 bg-[#065a8a]'
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomersSection;