import React from 'react';

const CoursesPage = () => {
  const courses = [
    {
      id: 1,
      title: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الأولى ( أعمال الهيكل الخرساني)',
      institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
      startDate: '2025/11/02',
      endDate: '2025/11/13',
      description: 'تزويد مهندسى مدني وعمارة حديثي التخرج حديثي التعيين بالمهارات والمعارف اللازمة للعمل في المشروعات بالطرق الصحيحة والآمنة بالجودة المطلوبة.'
    },
    {
      id: 2,
      title: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثانيه ( أعمال التشطيبات الأساسية)',
      institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
      startDate: '2025/12/07',
      endDate: '2025/12/18',
      description: 'تزويد مهندسى مدني وعمارة حديثى التخرج حديثى التعيين بالمعارف والمهارات اللازمه لتنفيذ مشروعات التشييد بالطرق الصحيحة والآمنة وكذلك بالجودة المطلوبة.'
    },
    {
      id: 3,
      title: 'إعداد وتأهيل مهندس حديث مدني وعمارة - المرحلة الثالثة (إدارة المشروعات والمالية)',
      institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
      startDate: '2026/01/11',
      endDate: '2026/01/22',
      description: 'تزويد مهندسي مدني وعمارة حديثي التخرج حديثي التعيين بالمعارف والمهارات اللازمه لتنفيذ مشروعات التشييد بالطرق الصحيحة والآمنة وكذلك بالجودة المطلوبة.'
    }
  ];

  return (
    <div>
            
    <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>
        <span className="overview" style={{ position: 'relative', bottom: '5px' }}><a href="/" className="btn_go_home">الصفحة الرئيسية</a> - الخطة التدريبية - برنامج إعداد وتأهيل مهندس حديث مدنى وعمارة</span>
    </div>
      {/* 2. Courses Grid Section - SET TO pt-0 AND mt-0 */}
      <div className="container mx-auto mt-0 px-4 pt-0"> 
        <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col overflow-hidden rounded-lg border-t-4 border-[#f57c00] bg-white shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex justify-center pt-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f57c00] shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-4 text-center text-lg font-bold leading-relaxed text-[#0865a8]">
                  {course.title}
                </h3>

                <div className="mb-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f57c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{course.institute}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="h-5 w-5 flex-shrink-0 text-[#f57c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{course.startDate} - {course.endDate}</span>
                  </div>
                </div>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">
                  {course.description}
                </p>

                <button className="w-full rounded-lg bg-[#f57c00] px-6 py-3 font-bold text-white transition-all duration-300">
                  المزيد من التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;