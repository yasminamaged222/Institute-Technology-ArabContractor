import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Instructors = () => {
    const [selectedLecturer, setSelectedLecturer] = useState(null);

    const lecturers = [
        {
            name: 'م / شيرين النجار',
            specialization: 'برامج إدارة المشروعات PMP',
            imageUrl: 'https://www.arabcont.com/icemt/assets/images/lect01.jpg',
            education: [
                'بكالوريوس هندسة مدنية جامعة عين شمس 2002',
                'دبلومة الهندسة الانشائية جامعة عين شمس 2005',
                'ماجستير في الهندسة إدارة مشروعات 2015',
                'مدير إدارة مشروعات محترف باعتماد من معهد إدارة المشروعات الامريكي PMI',
                'مدير إدارة مخاطر محترف باعتماد من معهد إدارة المشروعات الامريكي',
            ],
            experienceTitle: 'تحاضر في برامج إدارة المشروعات PMP من خلال',
            experienceDetails: [
                'جامعة المستقبل',
                'أكاديمية نيفادا للتدريب - دبي',
                'المعهد التكنولوجي – المقاولون العرب',
            ],
            phone: '01xxxxxxxxx',
            email: 'shireen.elnaggar@example.com',
        },
        {
            name: 'د / أحمد محمود',
            specialization: 'البرمجة وتطوير التطبيقات',
            imageUrl: 'https://www.arabcont.com/icemt/assets/images/lect01.jpg',
            education: [
                'بكالوريوس علوم الحاسب جامعة القاهرة 2010',
                'ماجستير علوم الحاسب جامعة القاهرة 2013',
                'دكتوراه في علوم الحاسب جامعة القاهرة 2015',
                'AWS Certified Solutions Architect',
                'Google Cloud Professional Developer',
            ],
            experienceTitle: 'يحاضر في البرمجة وتطوير التطبيقات من خلال',
            experienceDetails: [
                'جامعة القاهرة - كلية الحاسبات والمعلومات',
                'أكاديمية ITI',
                'معهد التدريب التقني',
            ],
            phone: '01xxxxxxxxx',
            email: 'ahmed.mahmoud@example.com',
        },
        {
            name: 'أ / فاطمة حسن',
            specialization: 'التسويق الرقمي وإدارة الأعمال',
            imageUrl: 'https://www.arabcont.com/icemt/assets/images/lect01.jpg',
            education: [
                'بكالوريوس إدارة أعمال جامعة عين شمس 2012',
                'ماجستير إدارة أعمال الجامعة الأمريكية 2018',
                'Google Analytics Certified',
                'HubSpot Marketing Certification',
                'Facebook Blueprint Certification',
            ],
            experienceTitle: 'تحاضر في التسويق الرقمي وإدارة الأعمال من خلال',
            experienceDetails: [
                'الجامعة الأمريكية بالقاهرة',
                'أكاديمية التسويق الرقمي',
                'مركز التدريب الإداري',
            ],
            phone: '01xxxxxxxxx',
            email: 'fatma.hassan@example.com',
        },
        {
            name: 'م / محمد علي',
            specialization: 'أنظمة الطاقة المتجددة',
            imageUrl: 'https://www.arabcont.com/icemt/assets/images/lect01.jpg',
            education: [
                'بكالوريوس هندسة كهربائية جامعة الإسكندرية 2005',
                'ماجستير هندسة الطاقة المتجددة 2010',
                'Solar Energy Professional Certificate',
                'Wind Energy Specialist',
                'Energy Management Certification',
            ],
            experienceTitle: 'يحاضر في أنظمة الطاقة المتجددة من خلال',
            experienceDetails: [
                'جامعة الإسكندرية - كلية الهندسة',
                'معهد بحوث الطاقة المتجددة',
                'مركز التدريب الهندسي',
            ],
            phone: '01xxxxxxxxx',
            email: 'mohamed.ali@example.com',
        },
        {
            name: 'د / سارة أحمد',
            specialization: 'الذكاء الاصطناعي وتعلم الآلة',
            imageUrl: 'https://www.arabcont.com/icemt/assets/images/lect01.jpg',
            education: [
                'بكالوريوس هندسة الحاسبات جامعة القاهرة 2011',
                'ماجستير الذكاء الاصطناعي 2014',
                'دكتوراه في تعلم الآلة 2018',
                'Deep Learning Specialization - Coursera',
                'TensorFlow Developer Certificate',
            ],
            experienceTitle: 'تحاضر في الذكاء الاصطناعي وتعلم الآلة من خلال',
            experienceDetails: [
                'جامعة القاهرة - كلية الهندسة',
                'مركز البحوث في الذكاء الاصطناعي',
                'أكاديمية البيانات والتحليلات',
            ],
            phone: '01xxxxxxxxx',
            email: 'sara.ahmed@example.com',
        },
        {
            name: 'أ / خالد حسين',
            specialization: 'الأمن السيبراني',
            imageUrl: 'https://www.arabcont.com/icemt/assets/images/lect01.jpg',
            education: [
                'بكالوريوس علوم الحاسب جامعة عين شمس 2009',
                'ماجستير الأمن السيبراني 2013',
                'CISSP - Certified Information Systems Security Professional',
                'CEH - Certified Ethical Hacker',
                'CompTIA Security+',
            ],
            experienceTitle: 'يحاضر في الأمن السيبراني من خلال',
            experienceDetails: [
                'المعهد القومي للاتصالات',
                'أكاديمية الأمن السيبراني',
                'مركز التدريب المتقدم في أمن المعلومات',
            ],
            phone: '01xxxxxxxxx',
            email: 'khaled.hussein@example.com',
        },
    ];

    const LecturerCard = ({ lecturer }) => (
        <div className="flex h-full flex-col rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex gap-4">
                    {/* Lecturer Image */}
                    <div className="flex-shrink-0">
                        <div className="h-24 w-24 overflow-hidden rounded-lg shadow-md">
                            <img
                                src={lecturer.imageUrl}
                                alt={lecturer.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="%239e9e9e"%3E👤%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        </div>
                    </div>

                    {/* Lecturer Info */}
                    <div className="min-w-0 flex-1">
                        <h3 className="mb-2 text-lg font-bold text-orange-600">
                            {lecturer.name}
                        </h3>
                        <p className="mb-3 text-sm leading-relaxed text-gray-700">
                            {lecturer.specialization}
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-2">
                            <div className="rounded-md bg-blue-50 p-2">
                                <svg className="h-4 w-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                            <div className="rounded-md bg-orange-50 p-2">
                                <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                                </svg>
                            </div>
                            <div className="rounded-md bg-gray-100 p-2">
                                <svg className="h-4 w-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CV Button */}
                <button
                    onClick={() => setSelectedLecturer(lecturer)}
                    className="w-full mt-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    السيرة الذاتية
                </button>
            </div>
        </div>
    );

    const CVDialog = ({ lecturer, onClose }) => {
        if (!lecturer) return null;

        return (
            <div
                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 py-4"
                onClick={onClose}
                style={{ paddingTop: '80px', paddingBottom: '80px' }}
            >
                <div
                    className="mx-4 my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative rounded-t-2xl bg-gradient-to-bl from-blue-700 to-blue-600 p-6 text-center">
                        {/* Close button in header */}
                        <button
                            onClick={onClose}
                            className="absolute left-4 top-4 rounded-full p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20"
                            aria-label="إغلاق"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white">
                            <img
                                src={lecturer.imageUrl}
                                alt={lecturer.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.style.backgroundColor = '#fff';
                                }}
                            />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-white">{lecturer.name}</h2>
                        <p className="text-white text-opacity-90">{lecturer.specialization}</p>
                    </div>

                    {/* Content */}
                    <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-6">
                        {/* Education Section */}
                        <div className="mb-6">
                            <div className="mb-3 flex items-center gap-2">
                                <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                </svg>
                                <h3 className="text-xl font-bold text-blue-700">التعليم</h3>
                            </div>
                            <div className="space-y-2">
                                {lecturer.education.map((edu, index) => (
                                    <div key={index} className="flex items-start gap-3 rounded-lg border border-gray-300 bg-yellow-50 p-3">
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                        <p className="text-sm leading-relaxed text-gray-700">{edu}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="my-6 border-gray-300" />

                        {/* Experience Section */}
                        <div className="mb-6">
                            <div className="mb-3 flex items-center gap-2">
                                <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                                </svg>
                                <h3 className="text-xl font-bold text-blue-700">الخبرات</h3>
                            </div>
                            <div className="rounded-lg border border-gray-300 bg-yellow-50 p-4">
                                <p className="mb-3 font-bold text-gray-700">{lecturer.experienceTitle}</p>
                                <div className="space-y-2 pr-3">
                                    {lecturer.experienceDetails.map((exp, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <span className="font-bold text-orange-600">•</span>
                                            <p className="text-sm leading-relaxed text-gray-700">{exp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-300" />

                        {/* Contact Section */}
                        <div className="mb-6">
                            <div className="mb-3 flex items-center gap-2">
                                <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                                </svg>
                                <h3 className="text-xl font-bold text-blue-700">وسائل الإتصال</h3>
                            </div>
                            <div className="space-y-3 rounded-lg border border-gray-300 bg-yellow-50 p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                                    </svg>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">تليفون: </span>
                                        {lecturer.phone}
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">البريد الإلكتروني: </span>
                                        {lecturer.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full rounded-lg bg-orange-600 px-4 py-3 font-bold text-white transition-colors duration-200 hover:bg-orange-700"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div dir="rtl" className="min-h-screen bg-yellow-50">
            {/* Breadcrumb */}
            <div className="border-b border-gray-300 bg-yellow-50 px-5 py-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <Link to="/" className="text-gray-700 transition-colors hover:text-blue-700">
                        الصفحة الرئيسية
                    </Link>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-700">محاضرينا</span>
                </div>
            </div>

            {/* Header Section */}
            <div className="bg-gradient-to-bl from-blue-700 to-blue-600 px-5 py-10 text-center">
                <svg className="mx-auto mb-4 h-16 w-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
                <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                    لدينا مجموعة من أكفأ المحاضرين
                </h1>
                <p className="text-xl text-white text-opacity-90">قائمة المحاضرين</p>
            </div>

            {/* Description Section */}
            <div className="px-5 py-8">
                <div className="rounded-xl bg-white p-6 text-center shadow-md">
                    <p className="leading-relaxed text-gray-700">
                        إن معهد للتدريب يضم دائما أقوى المحاضرين للإنضمام للعمل معنا يدا واحدة لتحقيق هدفنا، وهو السعي لتطوير التدريب، والمساعدة في تأهيل المتدربين وفتح آفاقا جديدة لهم باستخدام احدث النظم التدريبية، وأفضل تقنيات التدريب ولأجل ذلك نحن نسعى لضم كل الكفاءات الراغبة في العمل معنا لتحقيق تلك الأهداف، وللإنضمام الى قائمة المحاضرين بالمعهد
                    </p>
                </div>
            </div>

            {/* Lecturers Grid */}
            <div className="mx-auto max-w-7xl px-5 pb-12">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {lecturers.map((lecturer, index) => (
                        <LecturerCard key={index} lecturer={lecturer} />
                    ))}
                </div>
            </div>

            {/* CV Dialog */}
            {selectedLecturer && (
                <CVDialog lecturer={selectedLecturer} onClose={() => setSelectedLecturer(null)} />
            )}
        </div>
    );
};

export default Instructors;