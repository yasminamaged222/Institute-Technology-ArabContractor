import React, { useState, useEffect } from 'react';

const CustomersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(6);

  const customers = [
    { id: 1, name: 'جامعة حلوان', image: './assets/images/customer01.jpg' },
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

  // Responsive items per slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(2);
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(4);
      } else {
        setItemsPerSlide(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(customers.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getVisibleCustomers = () => {
    const start = currentIndex * itemsPerSlide;
    const end = start + itemsPerSlide;
    return customers.slice(start, end);
  };

  return (
    <section className="py-16 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-800 text-[#065a8a] mb-2">
            عملاؤنا
          </h3>
          <p className="text-gray-600 text-[#065a8a]">نسعى دائما لإرضاء العميل</p>
        </div>
        {/* Slider Container */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Customers Grid */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 transition-all duration-500">
              {getVisibleCustomers().map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-full aspect-square bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <img
                      src={`/assets/images/${customer.image}`}
                      alt={customer.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <h6 className="mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {customer.name}
                  </h6>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
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
