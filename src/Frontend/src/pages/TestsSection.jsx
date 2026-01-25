import React from 'react';

const TestsPage = () => {
    return (
        <div className="tests-wrapper" style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
            {/* Fixed Overview Bar - STRICTLY UNCHANGED */}
            <div
                className="overview_intro"
                style={{
                    position: 'fixed',
                    top: '70px',
                    left: 0,
                    background: '#F5F7E1',
                    width: '100%',
                    zIndex: 1000,
                    padding: '8px 20px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'right'
                }}
            >
                <span
                    className="overview"
                    style={{
                        position: 'relative',
                        bottom: '0px',
                        fontSize: 16
                    }}
                >
                    <a href="/" className="btn_go_home">الصفحة الرئيسية</a> - الاختبارات
                </span>
            </div>
            {/* Main Content Sections */}
            <div style={{ marginTop: '120px' }}> {/* Space for fixed bar */}
                {/* Breadcrumb Section */}
                <section className="w3l-breadcrumb dir_rtl text-right" style={{ backgroundColor: '#f0f0f0', padding: '20px 0' }}>
                    <div className="container">
                        <ul className="breadcrumbs-custom-path" style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <li style={{ margin: '0 10px' }}><a href="/icemt" style={{ color: '#007bff', textDecoration: 'none' }}>الصفحة الرئيسية</a></li>
                            <li className="active" style={{ margin: '0 10px', color: '#6c757d' }}>
                                <span className="fa fa-arrow-left mx-2" aria-hidden="true"></span>الاختبارات
                            </li>
                        </ul>
                    </div>
                </section>
                {/* Section 1: Intro */}
                <section className="w3l-content-with-photo-4 dir_rtl" style={{ padding: '60px 0', background: '#f8f9fa' }}>
                    <div id="content-with-photo4-block" className="pt-5">
                        <div className="py-md-3 container">
                            <div className="heading mx-auto text-center">
                                <h3 className="title-big" style={{ fontWeight: 'bold', fontSize: '36px', color: '#343a40', marginBottom: '30px' }}>الاختبارات</h3>
                                <p className="text-dark my-3 text-right" style={{ lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                                    تم انشاء قسم الاختبارات بالمعهد مواكبة لاحد النظم في اختيار الموارد البشرية وايماناً من الشركة بأهمية اختيار افضل العناصر لشغل الوظائف المختلفة بالشركة وفقاً للضوابط والمعايير المطلوبة لكل وظيفة
                                </p>
                                <p className="head text-dark my-3 text-right" style={{ lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                                    يعد معهد الإدارة والتكنولوجيا- المقاولون العرب واحد من أوائل المعاهد في جمهورية مصر العربية ، حيث يقوم هذا القسم  باجراء عدد كبير من الاختبارات المقننة الى العملاء الخارجيين طبقا للتعاقد وجميع الفروع والإدارات داخل الشركة
                                </p>
                                <p className="head text-dark my-3 text-right" style={{ lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                                    كما يقوم القسم بعمل التقييمات اللازمة لتحديد مدى صلاحية الموظف لشغل الوظيفة ، معتمداً على خبرة السادة المحاضرين في عمل فنية تقييمات مناسبة لكافة الوظائف والمهن المختلفة ذات مرجعية لاختبارات الشهادات الدولية مثل ( ICDL & Toefl ) ، كذلك مستويات المهارات القومية ، واصدار النتيجة المعتمدة والمحددة لصلاحية شغل الوظيفة
                                </p>
                                <p className="head text-dark my-3 text-right" style={{ lineHeight: '1.8', fontSize: '16px', fontWeight: 'bold' }}>
                                    ولم يقتصر العمل في قسم الاختبارات على العاملين بالشركة فقط ، بل امتد عمل التقييمات ليشمل العملاء خارجيين ايضاً، مثال :
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section 2: Partners Stats */}
                <section className="w3l-contacts-2" id="contact" style={{ background: '#e9ecef', padding: '60px 0' }}>
                    <div className="contacts-main">
                        <div className="contant11-top-bg">
                            <div className="py-md-3 dir_rtl container">
                                <div className="d-grid contact">
                                    <div className="tests-info-left d-grid text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                                        {[
                                            { title: "هيئة المجتمعات العمرانية", val: "226" },
                                            { title: "شركة اليو مصر ", val: "16" },
                                            { title: "شركة دار المعمار DMC ", val: "51" },
                                            { title: "شركة منار الخليج ", val: "181" },
                                            { title: "شركة العربي", val: "655" }
                                        ].map((item, index) => (
                                            <div className="contact-info" key={index} style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', border: '1px solid #dee2e6' }}>
                                                <span className="fa fa-bar-chart" aria-hidden="true" style={{ color: '#28a745', fontSize: '28px', marginBottom: '20px', display: 'block' }}></span>
                                                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#495057' }}>{item.title}</h4>
                                                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>{item.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section 3: Internal Company Tests */}
                <section className="w3l-content-with-photo-4 dir_rtl" style={{ padding: '80px 0', background: '#ffffff' }}>
                    <div id="content-with-photo4-block" className="test">
                        <div className="py-md-2 container">
                            <div className="cwp4-two row align-items-center text-right">
                                <div className="cwp4-text col-lg-6">
                                    <ul className="cont-4" style={{ listStyle: 'none', padding: 0 }}>
                                        <li style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', color: '#343a40' }}>
                                            <span className="fa fa-check" style={{ marginLeft: '15px', color: '#28a745' }}></span>الاختبارات الخاصة بالعاملين بالشركة
                                            <ul className="cont-4" style={{ listStyle: 'none', padding: '20px 30px 0 0' }}>
                                                {["تعديل مهنة", "بدل حاسب", "ترقيات", "دواعى السفر للفروع الخارجية", "قادة المستقبل", "تعيين"].map((text, i) => (
                                                    <li key={i} style={{ marginBottom: '15px', fontSize: '16px', color: '#6c757d' }}>
                                                        <span className="fa fa-check-circle" style={{ marginLeft: '15px', color: '#17a2b8' }}></span> {text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="cwp4-image col-lg-6 pl-lg-5 mt-lg-0 mt-5">
                                    <img src="assets/images/test-01.jpg" className="img-fluid" alt="" style={{ borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section 4: Image Gallery */}
                <section className="w3l-content-with-photo-4 dir_rtl" style={{ padding: '60px 0', background: '#f8f9fa' }}>
                    <div id="content-with-photo4-block">
                        <div className="pb-md-5 container">
                            <div className="cwp4-two row text-right">
                                <div className="cwp4-image col-lg-6 pl-lg-5 mb-4">
                                    <img src="assets/images/test-02.jpg" className="img-fluid" alt="" style={{ borderRadius: '12px', width: '100%', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }} />
                                </div>
                                <div className="cwp4-image col-lg-6 pl-lg-5 mb-4">
                                    <img src="assets/images/test-03.jpg" className="img-fluid" alt="" style={{ borderRadius: '12px', width: '100%', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section 5: Main Counter */}
                <section className="w3_stats" id="stats" style={{ background: '#343a40', color: '#ffffff', padding: '80px 0' }}>
                    <div className="py-lg-5 py-md-4 container py-4">
                        <h3 className="title-big text-center" style={{ marginBottom: '50px', fontSize: '32px', color: '#ffffff' }}>ما تم اختباره في عام  2020-2021</h3>
                        <div className="w3-stats text-center">
                            <div className="row">
                                <div className="col-sm-12 col-12">
                                    <div className="counter">
                                        <span className="fa fa-users text-danger" style={{ fontSize: '55px', marginBottom: '20px' }}></span>
                                        <div className="timer count-title count-number mt-3" style={{ fontSize: '55px', fontWeight: 'bold', color: '#ffc107' }}>2315</div>
                                        <p className="count-text" style={{ fontSize: '22px', color: '#adb5bd' }}>مهندس</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section 6: Test Types and News */}
                <section className="w3l-content-with-photo-4" style={{ padding: '80px 0', background: '#ffffff' }}>
                    <div id="content-with-photo4-block">
                        <div className="containers cwp4-text py-md-5 text-right">
                            <div className="dir_rtl container">
                                <h3 style={{ fontWeight: 'bold', marginBottom: '40px', borderRight: '5px solid #28a745', paddingRight: '20px', fontSize: '28px', color: '#343a40' }}>انواع الاختبارات</h3>
                                <div className="cwp4-two row mb-5 text-right">
                                    <div className="cwp4-text col-lg-4 col-sm-6 mt-sm-0 mt-4">
                                        <ul className="cont-4" style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ fontSize: '16px', color: '#495057' }}><span className="fa fa-check" style={{ marginLeft: '15px', color: '#28a745' }}></span>قياسات سيكومترية ( القياسات الشخصية )</li>
                                        </ul>
                                    </div>
                                    <div className="cwp4-text col-lg-4 col-sm-6 mt-sm-0 mt-4">
                                        <ul className="cont-4" style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ fontSize: '16px', color: '#495057' }}><span className="fa fa-check" style={{ marginLeft: '15px', color: '#28a745' }}></span>قياسات أخري ( لغة - كمبيوتر- فني -.... )</li>
                                        </ul>
                                    </div>
                                </div>
                                <h3 className="pt-3" style={{ fontWeight: 'bold', marginBottom: '30px', fontSize: '28px', color: '#343a40' }}>من اخبار قسم الاختبارات</h3>
                                <ul className="cont-4" style={{ listStyle: 'none', padding: 0 }}>
                                    {[
                                        "في اطار التعاون مع وزارة الاسكان والمرافق والمجتمعات العمرانية ، ولخلق كوادر للقيادات الشابة من موظفي هيئة المجتمعات العمرانية الجديدة ، تم تتقييم عدد 226 موظف لشغل وظيفة معاون نائب رئيس الهيئة او معاون رئيس جهاز مدينة ، حيث تم التقييم لمهارات ( اللغة – الحاسب الآلي – القياسات الشخصية والذكاءات ).",
                                        "نظرا لاسناد مشروعات جديدة للشركة وحرصا من قيادات الشركة لاتاحة فرص عمل لشباب المهندسين ، يجري حاليا عمل التقييمات اللازمة لتعيين عدد من المهندسين حديثي التخرج للانضمام لاسرة الشركة ، فتم خلال العام 2019-2020 عمل التقييمات لعدد 663 مهندس في تخصصات ( مدني – عمارة – ميكانكيكا – كهرباء – مساحة ) وذلك في قدرات ومهارات استخدام الحاسب الآلي ، وتحديد درجة اجادة اللغة ، بالاضافة الى تقييم معلومات التخصص و القياسات الشخصية والذكاءات.",
                                        "حرصا من المعهد على توفير سبل الراحة للسادة الممتحنين ، فقد تم تطوير معمل الاختبارات وتزويده باحدث اجهزة الحاسب الآلي وزيادة عددها لاستيعاب اعداد الممتحنين ، وذلك تحديث الاثاث المستخدم من مكاتب وكراسي.",
                                        "ايماناً من الشركة بأهمية اتاحة الفرصة للقيادات الشابة ، يتم عمل التقييمات لقادة المستقبل على مستوى الافرع والادارات المختلفة ، حيث يتم تقييم السادة المرشحين للانضمام لمجلس قادة المستقبل في مهارات ( اللغة – الحاسب الآلي – القياسات الشخصية والذكاءات) وتجرى التقييمات بصفة دورية ، و فيما يلي عرض موجز لمشروع قادة المستقبل."
                                    ].map((text, index) => (
                                        <li key={index} style={{ marginBottom: '30px', lineHeight: '1.8', paddingBottom: '20px', borderBottom: '1px solid #e9ecef', fontSize: '16px', color: '#495057' }}>
                                            <span className="fa fa-check" style={{ marginLeft: '15px', color: '#28a745' }}></span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TestsPage;
