import React from 'react';

const TechnicalEducationSection = () => {
  return (
    <section className="py-1 bg-white">
      <div className="container mx-auto px-1">
        <div className="grid lg:grid-cols-2 gap-1 items-center">
          {/* Left Side - Content */}
          <div className="space-y-1" dir="rtl">
            {/* Introduction Card */}
            <div className="flex gap-1 p-6 bg-[#ECB22F]/10 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#ECB22F] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-right">
                <h6 className="text-lg font-bold text-gray-800 mb-3">
                  مدرسة المقاولون العرب الثانوية الفنية
                </h6>
                <p className="text-gray-700 leading-relaxed mb-2">
                  من منطلق المسئولية المجتمعية للشركة فقد تم انشاء مدرسة المقاولون العرب الثانوية الفنية للتعليم المزدوج لتأهيل الكوادر الفنية على أسس علمية.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  من خلالها يتم توفير فنيين متخصصين مدربين في مجال المعدات الثقيلة والمساهمة في تقليل البطالة.
                </p>
              </div>
            </div>

            {/* Qualification Card */}
            <div className="flex gap-4 p-6 bg-[#0865A8]/10 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#0865A8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-right">
                <h6 className="text-lg font-bold text-gray-800 mb-3">
                  المؤهل :
                </h6>
                <p className="text-gray-700 leading-relaxed">
                  دبلوم المدارس الثانوية الصناعية نظام الثلاث سنوات.
                </p>
              </div>
            </div>

            {/* Duration Card */}
            <div className="flex gap-4 p-6 bg-[#9F6F2A]/10 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#9F6F2A] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-right">
                <h6 className="text-lg font-bold text-gray-800 mb-3">
                  مدة الدراسة والتدريب :
                </h6>
                <p className="text-gray-700 leading-relaxed">
                  3 سنوات دراسية
                </p>
              </div>
            </div>

            {/* Academic Year Card */}
            <div className="flex gap-4 p-6 bg-[#F5F7E1]/80 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#393939] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-right">
                <h6 className="text-lg font-bold text-gray-800 mb-3">
                  العام الدراسي :
                </h6>
                <div className="space-y-2 text-gray-700">
                  <p className="leading-relaxed">
                    11 شهر ويمنح المتدرب أجازة سنوية شهر عن كل سنة بطلب توافق الشركة عليه.
                  </p>
                  <p className="leading-relaxed">
                    يتلقى الطالب الدراسة النظرية في المدرسة يومان أسبوعيا.
                  </p>
                  <p className="leading-relaxed">
                    يتلقى الطالب التدريبات المهنية 4 ايام أسبوعياً في المكان التدريبي.
                  </p>
                  <p className="leading-relaxed font-semibold text-[#393939]">
                    في نهاية المرحلة تقوم الشركة بإبرام عقد توظيف للطلاب المتميزين براتب مناسب في حالة وجود أماكن.
                  </p>
                </div>
              </div>
            </div>

            {/* Read More Button */}
            <div className="pt-100">
              <a
                href="/Technical_Schools"
                className="inline-flex items-center gap-3 bg-[#f57c00] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#065a8a] transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <svg className="w-5 h-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>اقرأ المزيد</span>
              </a>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop"
                alt="مدرسة المقاولون العرب"
                className="w-full h-[760px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 text-center">
                  تطوير التعليم الفنى
                </h3>
                <h4 className="text-xl text-center">
                  مدرسة المقاولون العرب الثانوية الفنية
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalEducationSection;