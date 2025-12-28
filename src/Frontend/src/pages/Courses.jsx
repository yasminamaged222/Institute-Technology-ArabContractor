import React from 'react';

const Courses = () => {
  // بيانات تجريبية للدورات (هنستبدلها بعدين بـ API من الباك إند)
  const coursesList = [
    {
      id: 1,
      title: "هندسة التشييد المتقدمة",
      instructor: "د. أحمد محمد",
      price: "2500 جنيه مصري",
      duration: "3 أشهر",
      students: 120,
    },
    {
      id: 2,
      title: "إدارة المشاريع الهندسية",
      instructor: "د. شريف عبد النجيب",
      price: "3000 جنيه مصري",
      duration: "4 أشهر",
      students: 95,
    },
    {
      id: 3,
      title: "التدريب الصيفي 2026",
      instructor: "فريق المعهد",
      price: "1500 جنيه مصري",
      duration: "شهرين",
      students: 200,
    },
    {
      id: 4,
      title: "سلامة وأمان المواقع",
      instructor: "مهندس/ محمود صالح",
      price: "2000 جنيه مصري",
      duration: "شهرين",
      students: 80,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            الدورات المتاحة
          </h1>
          <p className="text-xl text-gray-700">
            اختر الدورة المناسبة لك وسجل الآن مع إمكانية الدفع الإلكتروني الآمن عبر بنك مصر
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesList.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <div className="bg-blue-700 text-white p-6 text-center">
                <h3 className="text-2xl font-bold">{course.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-600">
                  <span className="font-semibold">المحاضر:</span> {course.instructor}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">المدة:</span> {course.duration}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">عدد المتدربين:</span> {course.students} طالب
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-2xl font-bold text-blue-700 text-center mb-4">
                    {course.price}
                  </p>
                  <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                    تسجيل في الدورة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;