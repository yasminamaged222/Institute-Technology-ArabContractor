import React, { useState } from 'react';

const GesrElSuezPage = () => {
    const [activeWorkshop, setActiveWorkshop] = useState(null);

    const workshops = [
        {
            id: 'w1',
            title: 'ورشة المبانى',
            description: 'يتم التدريب على استنتاج المدماك الثانى وبناء حوائط الطوبة والنصف طوبة وأعمدة المبانى وحساب الكميات المطلوبة.',
            images: ['wrashA1.jpg', 'wrashA2.jpg', 'wrashA3.jpg']
        },
        {
            id: 'w2',
            title: 'ورشة البياض',
            description: 'تحتوى الورشة على (6) كبائن للتدريب على مراحل البياض المختلفة من الطرطشة حتى بياض التخشين.',
            images: ['wrashb1.jpg', 'wrashb2.jpg', 'wrashb3.jpg']
        },
        {
            id: 'w3',
            title: 'ورشة الدهانات',
            description: 'تهتم بتنفيذ الدهانات التقليدية (بلاستيك ولاكيه) والدهانات ذات الطابع الفنى الابتكارى (ديكور).',
            images: ['wrashc1.jpg', 'wrashc2.jpg', 'wrashc3.jpg']
        },
        {
            id: 'w4',
            title: 'ورشة السيراميك',
            description: 'بها 3 كبائن يتم فيها التدريب على تركيب سيراميك الأرضيات والحوائط بالمونة أو المواد اللاصقة.',
            images: ['wrashd1.jpg', 'wrashd2.jpg', 'wrashd3.jpg']
        },
        {
            id: 'w5',
            title: 'ورشة السباكة',
            description: 'التدريب على اعمال التغذية والصرف وتركيب الأجهزة طبقا لإشتراطات الكود وأصول الصناعة.',
            images: ['wrashe1.jpg', 'wrashe2.jpg', 'wrashe3.jpg']
        },
        {
            id: 'w6',
            title: 'ورشة الشدات المعدنية',
            description: 'التدريب على فك وتركيب الأنظمة المختلفة للشدات المعدنية للاسقف والأعمدة والحوائط.',
            images: ['wrashf1.jpg', 'wrashf2.jpg']
        }
    ];

    const toggleAccordion = (id) => {
        setActiveWorkshop(activeWorkshop === id ? null : id);
    };
    const arabicFontStyle = {
        fontFamily: '"Droid Arabic Kufi", serif',
        direction: 'rtl'
    };
    return (
        <div style={arabicFontStyle} className="bg-white-50 pb-15 min-h-screen" dir="rtl">

            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>

                <span className="overview" style={{ position: 'relative', bottom: '5px' }}><a href="/" className="btn_go_home">الصفحة الرئيسية</a> - مركز التدريب جسر السويس</span>

            </div>

            <div className="container mx-auto px-4">

                {/* Main Intro Section */}
                <header className="mb-10 rounded-xl border-r-8 border-blue-700 bg-white p-8 shadow-md">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800">مركز التدريب جسر السويس</h1>
                    <p className="text-lg leading-relaxed text-gray-600">
                        يحتوي المركز على عدد (8) ورش تدريبية تتيح للمتدرب التعرف نظرياً وعملياً على أعمال الخرسانة والتشطيبات.
                        يتم دعم المركز فنياً من خلال تعاون بين الشركة والغرفة الألمانية ونخبة من المدربين المعتمدين دولياً.
                    </p>
                </header>

                {/* Hero Image Slider (Placeholder for logic) */}
                <div className="mb-12">
                    <img
                        src="/images/GsrSuez1.jpg"
                        alt="Main Center View"
                        className="h-96 w-full rounded-2xl object-cover shadow-lg"
                    />
                </div>

                {/* Workshops Section */}
                <h2 className="mb-8 text-center text-2xl font-bold text-blue-900 underline underline-offset-8">الورش التدريبية التخصصية</h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {workshops.map((workshop) => (
                        <div
                            key={workshop.id}
                            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleAccordion(workshop.id)}
                                className="w-full flex justify-between items-center p-5 text-right font-bold text-gray-700 hover:bg-blue-50 transition-colors"
                            >
                                <span className="text-xl">{workshop.title}</span>
                                <span className={`transform transition-transform ${activeWorkshop === workshop.id ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {activeWorkshop === workshop.id && (
                                <div className="border-t border-gray-50 bg-gray-50 p-5">
                                    <p className="mb-4 text-gray-600">{workshop.description}</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {workshop.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={`/images/${img}`}
                                                alt={workshop.title}
                                                className="h-24 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-80"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Info Cards */}
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-2xl bg-blue-900 p-6 text-white">
                        <h3 className="mb-4 flex items-center text-xl font-bold">
                            <span className="ml-2">🎯</span> أهداف التدريب
                        </h3>
                        <ul className="space-y-2 opacity-90">
                            <li>• رفع كفاءة المهندسين والمشرفيين والفنيين.</li>
                            <li>• عمل تدريب تحويلى للعمالة العادية للمهن المختلفة.</li>
                            <li>• تحقيق أقصى استفادة من الكوادر البشرية للشركة.</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl bg-blue-700 p-6 text-white">
                        <h3 className="mb-4 flex items-center text-xl font-bold">
                            <span className="ml-2">👥</span> الفئات المستهدفة
                        </h3>
                        <ul className="space-y-2 opacity-90">
                            <li>• مهندسي ومشرفي الشركة.</li>
                            <li>• طلبة كليات الهندسة والتعليم الفني.</li>
                            <li>• العمالة الراغبة في رفع مستوى المهارة.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GesrElSuezPage;