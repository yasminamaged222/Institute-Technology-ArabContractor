import React, { useState } from 'react';

const ShobraTrainingPage = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (id) => {
        setOpenSection(openSection === id ? null : id);
    };
    // التنسيق الموحد للخط
    const arabicFontStyle = {
        fontFamily: '"Droid Arabic Kufi", serif',
        direction: 'rtl'
    };
    return (
        <div style={arabicFontStyle} dir="rtl" className="bg-white-50 min-h-screen text-right">
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>

                <span className="overview" style={{ position: 'relative', bottom: '5px' }}><a href="/" className="btn_go_home">الصفحة الرئيسية</a> - مركز تدريب شبرا</span>

            </div>

            <div className="h-16"></div>

            <div className="container mx-auto px-6 py-8">

                {/* 2. النصوص التعريفية (بالنص الحرفي) */}
                <header className="mb-8 rounded-2xl border-r-8 border-yellow-500 bg-white p-8 shadow-sm">
                    <h1 className="mb-6 text-3xl font-extrabold text-gray-800">مركز التدريب شبرا</h1>
                    <div className="space-y-4 text-lg leading-loose text-gray-700">
                        <p>
                            إن حاجة الشركة المتزايدة للأيدي العاملة المدربة دفعها إلى إنشاء مركز متخصص لتدريب الفنيين ومساعدي فنيين وسائقي معدات بمختلف أنواعها ، وذلك لسد احتياجات الشركة في تنفيذ كافة المشروعات وتغذية الشركات الأخرى.
                        </p>
                        <p>
                            ويعتبر مركز تدريب المعدات - شبرا بالمعهد التكنولوجى لهندسة التشييد و الادارة هو التدريب العملي لهذه الفئات وفقا لبرامج منتظمة ومحددة.
                        </p>
                        <p>
                            إلى جانب ذلك يقوم المركز بعمل برامج تدريب دورية للعاملين في الشركة لرفع كفاءتهم الإنتاجية أو تعديل مهنهم أو التدريب التحويلي ويقدم المركز أيضا خدماته للهيئات الخارجية كتدريب طلبة المدارس الثانوية الصناعية وطلبة المعاهد الفنية وكليات الهندسة في تدريبهم الصيفي.
                        </p>
                    </div>
                </header>

                {/* 3. معرض الصور */}
                <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="h-[400px] overflow-hidden rounded-3xl shadow-lg md:col-span-2">
                        <img src="/images/Shobra10.jpg" alt="التدريبات العملية" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="h-[192px] overflow-hidden rounded-3xl shadow-md">
                            <img src="/images/Shobra2.jpg" alt="اختبار الطلبة" className="h-full w-full object-cover" />
                        </div>
                        <div className="h-[192px] overflow-hidden rounded-3xl shadow-md">
                            <img src="/images/Shobra3.jpg" alt="التدريبات العملية" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* 4. الرؤية والرسالة */}
                <div className="mb-12 grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl bg-blue-900 p-8 text-white">
                        <h3 className="mb-4 text-xl font-bold">👁️ الرؤية</h3>
                        <p className="leading-relaxed opacity-90">
                            يسعى المركز من خلال خطة تدريبية طموحة إلى تلبية كافة الاحتياجات التدريبية للشركة .
                        </p>                    </div>
                    <div className="rounded-3xl border-2 border-blue-900 bg-white p-8">
                        <h3 className="mb-4 text-xl font-bold text-blue-900">✉️ الرسالة</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li>1. تجهيز عمالة في مجالات أنشطة صيانة وإصلاح وتشغيل معدات الإنشاء بجميع أنواعها لسد احتياجات عجز العمالة بالشركة.</li>
                            <li>2. رفع مستوى وكفاءة التشغيل للعمالة الحالية حتى تواكب كل من صعوبة وتعقيد المعدات الحديثة وكذلك أساليب الإنشاء الحديثة بمجالاتها التي أصبحت غاية في التنوع والتعقيد.</li>
                            <li>3. عمل ربط ما بين عمالة الشركة من مهندسين وفنيين وعمال والتوكيلات المختلفة للتدريب الخاص بالمعدات كل في تخصصه.</li>
                            <li>4. إتاحة التدريب لمن يريد من خارج الشركة كنوع من التنمية لأبناء الوطن وكرسالة للشركة .</li>
                        </ul>
                    </div>
                </div>

                {/* 5. الورش العملية (بالنص الحرفي) */}
                <h2 className="mb-6 inline-block border-b-2 border-yellow-500 pb-2 text-2xl font-bold text-gray-800">الورش العملية بالمركز</h2>
                <div className="mb-12 space-y-4">
                    {[
                        { id: 1, title: "ورشة المحركات", text: "تحتوي الورشة علي معظم أنواع محركات الديزل والبنزين المستخدمة في المعدات والسيارات للتدريب عليها في عمليات الفك والتركيب بالطرق المعتمدة في التدريب ، ويوجد في الورشة كافة العدد والأدوات المستخدمة في أعمال الفك والتجميع للوحدات تحت الإصلاح وذلك باستخدام الطرق والأساليب الفنية السليمة." },
                        { id: 2, title: "ورشة اللحام والبرادة", text: "تحتوي ورشة اللحام على معظم ماكينات اللحام للتدريب علي أعمال القطع واللحام وإعداد اللحامين عملياً بالتدريب علي أعمال ومهارات اللحام بالقوس الكهربي واللحام بالاكسي استيلين مع مراعاة شروط واحتياطات السلامة والصحة المهنية. تحتوي ورشة البرادة على كافة العدد والأدوات المستخدمة في الأعمال الأساسية في قطع وتشغيل المعادن وإكساب المتدرب المهارات الأساسية اللازمة للعمل كبراد تركيبات أو مواسير أو تزجة." },
                        { id: 3, title: "ورشة الهيدروليك", text: "تحتوي الورشة علي معظم أنواع الطلمبات والمواتير والصمامات الهيدروليكية المستخدمة في الدوائر الهيدروليكية للمعدات للتدريب عليها ومعرفة مكوناته وطريقة عملها، ويوجد في الورشة كافة العدد والأدوات المستخدمة في أعمال الفك والتجميع للوحدات الهيدروليكية باستخدام الطرق والأساليب الفنية السليمة." },
                        { id: 4, title: "ورشة التركيبات الكهربائية الداخليه", text: "تحتوي الورشة علي مختلف أنواع دوائر التركيبات الكهربائيه الداخلية من التأسيس و التمديدات و سحب الاسلاك و توزيع الاحمال و مكوناتها و طرق التنفيذ و التوصيل و الاختبارات الخاصه بالمبانى و المنشأت ، و عمل المقايسات المطلوبة و طرق الاستلام طبقاً لمستويات المهارة القومية ، ويوجد في الورشة كافة العدد والأدوات و اجهزه القياس المستخدمة في أعمال تنفيذ التركيبات الكهربائية ." },
                        { id: 5, title: "ورشة كهرباء المعدات", text: "تحتوي الورشة علي أنواع من الدوائر الكهربائية للمعدات الثقيلة و المولدات الكهربائية و كذلك المواتير الكهربائية ومكوناتها و كذلك بعض من النماذج المستخدمة في الدوائر الكهربائية للمعدات للتدريب عليها ومعرفة مكوناتها وطريقة عملها، ويوجد في الورشة كافة العدد والأدوات المستخدمة في أعمال الفك والتجميع للوحدات الكهربائية باستخدام الطرق والأساليب الفنية السليمة." },
                        { id: 6, title: "ورشة كهرباء التحكم الالى", text: "تحتوي الورشة علي مكونات وادوات دوائر التحكم الالى الكلاسيكى و الاتوماتيكى Automatic Control Classic and و كذلك أجهزة ال PLC للتدريب عليها و عمل محاكاه لنظم التشغيل المختلفة ." }
                    ].map((ws) => (
                        <div key={ws.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <button onClick={() => toggleSection(`ws${ws.id}`)} className="w-full p-5 text-right flex justify-between items-center hover:bg-gray-50">
                                <span className="font-bold text-blue-900">{ws.title}</span>
                                <span>{openSection === `ws${ws.id}` ? '▲' : '▼'}</span>
                            </button>
                            {openSection === `ws${ws.id}` && <div className="border-t border-gray-200 bg-blue-50 p-5 text-gray-700">{ws.text}</div>}
                        </div>
                    ))}
                </div>

                {/* 6. البرامج التدريبية (بالنص الحرفي) */}
                <h2 className="mb-6 text-2xl font-bold text-gray-800">البرامج التدريبية</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border-t-4 border-blue-900 bg-white p-6 shadow-md">
                        <h4 className="mb-4 text-center font-bold text-blue-900">برامج قسم الميكانيكا</h4>
                        <ul className="space-y-2 text-sm">
                            {["إعداد وتأهيل ميكانيكا سيارات", "إعداد وتأهيل فني ميكانيكا سيارات", "إعداد وتأهيل ميكانيكا معدات", "إعداد وتأهيل فني ميكانيكا معدات", "إعداد وتأهيل فني ميكانيكا هيدروليك", "إعداد وتأهيل فني ميكانيكا محركات", "مجموعة نقل القدرة (Power Train)", "إعداد وتأهيل فني تشغيل معدات", "إعداد وتأهيل فني وناش ارضي", "دورة عامة عن سيارات الإفيكو", "صيانة وإصلاح الإطارات (لحام كاوتش)"].map(item => <li key={item}>• {item}</li>)}
                        </ul>
                    </div>
                    <div className="rounded-2xl border-t-4 border-yellow-500 bg-white p-6 shadow-md">
                        <h4 className="mb-4 text-center font-bold text-yellow-600">برامج اللحام والبرادة</h4>
                        <ul className="space-y-2 text-sm">
                            {["رفع كفاءة فني وملاحظ برادة معادن", "رفع كفاءة فني براد تركيبات", "رفع كفاءة فني و ملاحظ لحام معادن", "رفع كفاءة فني لحام كهرباء وأكسجين", "رفع كفاءة فني لحام Co2", "رفع كفاءة في عمليات اللحام والقطع المختلفة", "طرق فحص اللحام و كيفية تلافيها"].map(item => <li key={item}>• {item}</li>)}
                        </ul>
                    </div>
                    <div className="rounded-2xl border-t-4 border-blue-900 bg-white p-6 shadow-md">
                        <h4 className="mb-4 text-center font-bold text-blue-900">برامج قسم الكهرباء</h4>
                        <ul className="space-y-2 text-sm">
                            {["إعداد وتأهيل كهربائي تركيبات داخلية - المستوى الثاني", "إعداد وتأهيل فني / ملاحظ كهرباء تركيبات كهربائية - المستوى الثالث", "إعداد وتأهيل فني / ملاحظ كهرباء صيانة وتشغيل", "إعداد وتأهيل فني / ملاحظ كهرباء سيارات ومعدات", "مقدمة في التحكم المنطقي المبرمج PLC", "التمديدات ولوحات التوزيع الكهربائية", "دوائر التحكم الآلي"].map(item => <li key={item}>• {item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShobraTrainingPage;