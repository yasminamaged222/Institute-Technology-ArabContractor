import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, Users, Target, Lightbulb, Award, TrendingUp, Zap, Sparkles, ArrowRight } from 'lucide-react';

// Helper Components
const ResponsibilityCard = ({ title, items, isExpandable = false }) => {
    const [isExpanded, setIsExpanded] = useState(!isExpandable);

    useEffect(() => {
        document.title = 'مجلس قادة المستقبل - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <div className="group relative mb-0 overflow-hidden border-2 border-gray-200 bg-white shadow-lg transition-all hover:border-gray-300 hover:shadow-2xl">
            <div
                className="relative cursor-pointer p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6"
                onClick={() => isExpandable && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center shadow-lg sm:h-9 sm:w-9 md:h-10 md:w-10" style={{ background: 'linear-gradient(135deg, #f57c00, #0865a8)' }}>
                            <CheckCircle className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-black sm:text-base md:text-lg lg:text-xl">{title}</h3>
                    </div>
                    {isExpandable && (
                        <div className="flex h-7 w-7 items-center justify-center transition-all sm:h-8 sm:w-8" style={{
                            backgroundColor: isExpanded ? '#f57c00' : '#f3f4f6',
                            color: isExpanded ? 'white' : '#374151'
                        }}>
                            <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    )}
                </div>

                {isExpanded && (
                    <ul className="border-r-4 pr-3 pt-3 sm:pr-4 sm:pt-4" style={{ borderColor: '#f57c00' }}>
                        {items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 pb-1 text-gray-700">
                                <div className="mt-2 h-2 w-2 flex-shrink-0" style={{ backgroundColor: '#0865a8' }} />
                                <span className="text-xs leading-relaxed sm:text-sm md:text-base">{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const ProposalCard = ({ title, description, subitems, color = "orange" }) => {
    const getColors = (colorName) => {
        const colors = {
            orange: { bg: '#f57c00', border: 'rgba(245, 124, 0, 0.3)', hover: 'rgba(245, 124, 0, 0.5)' },
            blue: { bg: '#0865a8', border: 'rgba(8, 101, 168, 0.3)', hover: 'rgba(8, 101, 168, 0.5)' },
            black: { bg: '#000000', border: 'rgba(0, 0, 0, 0.3)', hover: 'rgba(0, 0, 0, 0.5)' },
            mixed: { bg: 'linear-gradient(135deg, #f57c00, #0865a8)', border: 'rgba(245, 124, 0, 0.3)', hover: 'rgba(8, 101, 168, 0.5)' }
        };
        return colors[colorName];
    };

    const colors = getColors(color);

    return (
        <div className="group relative overflow-hidden border-2 bg-white p-3 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
            style={{ borderColor: colors.border }}>
            <div className="absolute right-0 top-0 h-1 w-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: color === 'mixed' ? 'linear-gradient(to right, #f57c00, #0865a8)' : colors.bg }} />

            <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center shadow-lg sm:h-9 sm:w-9"
                    style={{ background: color === 'mixed' ? 'linear-gradient(135deg, #f57c00, #0865a8)' : colors.bg }}>
                    <Sparkles className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1">
                    <h3 className="pb-1 text-sm font-bold text-black sm:text-base lg:text-lg">{title}</h3>
                    {description && (
                        <p className="text-xs leading-relaxed text-gray-700 sm:text-sm md:text-base">{description}</p>
                    )}
                    {subitems && (
                        <ul className="pt-1">
                            {subitems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 pb-1 text-gray-700">
                                    <ArrowRight className="mt-1 h-3 w-3 flex-shrink-0" style={{ color: '#f57c00' }} />
                                    <span className="text-xs leading-relaxed sm:text-sm">{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function FutureLeadersCouncil() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: '"Droid Arabic Kufi", serif' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');

                :root {
                    --primary-color: #0865a8;
                    --secondary-color: #f57c00;
                    --bg-nav: #F5F7E1;
                }

                * {
                    font-family: 'Droid Arabic Kufi', serif !important;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                html {
                    scroll-behavior: smooth;
                }

                /* Responsive Typography using Clamp */
                .responsive-h1 { font-size: clamp(1.8rem, 5vw, 4.5rem); line-height: 1.1; font-weight: 900; }
                .responsive-h2 { font-size: clamp(1.3rem, 3.5vw, 2.5rem); font-weight: 900; }
                .responsive-p { font-size: clamp(0.85rem, 2vw, 1.15rem); line-height: 1.7; }

                /* Layout Containers */
                .tech-main-wrapper {
                    max-width: 1920px;
                    margin: 0 auto;
                    width: 100%;
                }

                /* Fixed Elements */
                .fixed-progress-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 5px;
                    background: #e5e7eb;
                    z-index: 1000;
                }

                .fixed-nav-bar {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: var(--bg-nav);
                    border-bottom: 1px solid #d1d5db;
                    padding: 8px 15px;
                    z-index: 900;
                    text-align: center;
                }

                /* Sections */
                .hero-section {
                    padding-top: 130px;
                    padding-bottom: 30px;
                    text-align: center;
                    padding-left: 5%;
                    padding-right: 5%;
                }

                .content-section {
                    padding: 0 5% 40px;
                }

                /* Grid Systems */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    max-width: 800px;
                    margin: 20px auto;
                }

                .proposals-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 12px;
                }

                /* Adaptive Image Layout */
                .about-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    border: 2px solid var(--secondary-color);
                    overflow: hidden;
                    margin-bottom: 0;
                }

                @media (min-width: 1024px) {
                    .about-grid { grid-template-columns: 3fr 2fr; }
                }

                /* Remove Gaps and Margins as requested */
                .no-margin { margin: 0 !important; }
                .no-padding { padding: 0 !important; }
                .compact-list li { margin-bottom: 4px; }

                /* Scrollbar */
                ::-webkit-scrollbar { width: 10px; }
                ::-webkit-scrollbar-track { background: #f1f1f1; }
                ::-webkit-scrollbar-thumb { 
                    background: linear-gradient(to bottom, var(--secondary-color), var(--primary-color));
                    border-radius: 5px;
                }

                /* Ultra Wide Adjustments */
                @media (min-width: 1920px) {
                    .tech-main-wrapper { padding-left: 20px; padding-right: 20px; }
                }

                /* Small Screen Adjustments */
                @media (max-width: 480px) {
                    .hero-section { padding-top: 110px; }
                    .proposals-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="fixed-progress-bar">
                <div className="h-full transition-all duration-300" style={{ width: `${scrollProgress}%`, background: `linear-gradient(to right, #f57c00, #0865a8)` }} />
            </div>

           
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                    <a
                        href="/"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        الصفحة الرئيسية
                    </a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', marginRight: '8px' }}>مجلس قادة المستقبل</span>
                </div>
            </div>

            <div className="tech-main-wrapper">
                <header className="hero-section">
                    <div className="mb-4 inline-flex items-center gap-2 border-2 border-[#f57c00] px-4 py-1">
                        <Award className="h-4 w-4 text-[#f57c00]" />
                        <span className="text-xs font-bold">برنامج تطوير القيادات</span>
                    </div>
                    <h1 className="responsive-h1 mb-4">مجلس قادة المستقبل</h1>
                    <p className="responsive-p mx-auto mb-6 max-w-4xl text-gray-700">
                        نحن نؤمن بأن الاستثمار في شباب الشركة هو الاستثمار في مستقبلها، من خلال برنامج متكامل لتطوير المهارات القيادية والإدارية.
                    </p>
                    <div className="stats-grid">
                        <div className="border-2 border-[#f57c00] bg-white p-4 shadow-md">
                            <div className="font-black text-4xl text-[#f57c00]">30</div>
                            <div className="text-xs font-bold text-gray-600">فرع / إدارة</div>
                        </div>
                        <div className="border-2 border-[#0865a8] bg-white p-4 shadow-md">
                            <div className="font-black text-4xl text-[#0865a8]">9</div>
                            <div className="text-xs font-bold text-gray-600">أعضاء لكل مجلس</div>
                        </div>
                    </div>
                </header>

                <main className="content-section">
                    {/* About Section */}
                    <section className="about-grid bg-white shadow-xl">
                        <div className="flex flex-col justify-center p-4 sm:p-6 lg:p-10">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center bg-[#0865a8]">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="responsive-h2">عن المجلس</h2>
                            </div>
                            <p className="responsive-p mb-4 text-gray-700">
                                إضافة الى دور المعهد في المساهمة في اهداف الشركة الاستراتيجية و بالتحديد في تدريب الصف الثانى ورعاية المهارات الإدارية لشباب العاملين بالشركة و تاهيلهم كقادة المستقبل للشركة فقد صدور قرار رئيس مجلس الإدارة رقم 352 لسنة 2016 بتاريخ 15/05/2016 بعقد مجالس قادة المستقبل حيث يعتبر مجلس قادة المستقبل بمثابة صورة مصغرة للمجلس التنفيذي للفروع والادارات ويتشكل بعضوية مهندسين – ماليين – اداريين – بالاضافة الى ممثل المؤهلات المتوسطة ( مشرفي التنفيذ – المهن العمالية ).
                            </p>
                            <div className="border-r-4 border-[#0865a8] bg-gray-50 p-4">
                                <p className="text-sm leading-relaxed md:text-base">
                                    وقد تم مخاطبة عدد 30 فرع / ادارة لترشيح اعضاء للمجلس بما لا يزيد عدد اعضاء المجلس عن 9 اعضاء لكل مجلس ، تكون مدة عضوية المجلس سنتين ماليتين.
                                </p>
                            </div>
                        </div>
                        <div className="relative min-h-[250px]">
                            <img src="/images/leaders-01.jpg" alt="Future Leaders" className="absolute inset-0 h-full w-full object-cover" />
                            <div className="from-[#f57c00]/40 absolute inset-0 bg-gradient-to-t to-transparent" />
                        </div>
                    </section>

                    {/* Role Section */}
                    <section className="mt-0 overflow-hidden border-2 border-black bg-white shadow-xl">
                        <div className="flex items-center gap-4 bg-gradient-to-l from-[#0865a8] to-black p-4 sm:p-6">
                            <div className="flex h-10 w-10 items-center justify-center bg-[#f57c00]">
                                <Target className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="responsive-h2 text-white">دور المعهد في المجلس</h2>
                        </div>
                        <div className="p-4 sm:p-6 lg:p-10">
                            <p className="responsive-p mb-6 text-gray-700">تفعيلا لدور المعهد في الاشراف على مجالس قادة المستقبل يقوم ممثلوا المعهد بالمهام التالية:</p>
                            <div className="flex flex-col gap-0">
                                <ResponsibilityCard
                                    title="الإدارة الفعالة للاجتماعات"
                                    items={["بالحرص على ان ينعقد المجلس إداريا طبقا للاعراف والإجراءات المعمول بها (استكمال الاجندة وفقا للنموذج الموضوع- استكمال النصاب القانوني للاعضاء- الالتزام بقرار مجلس الإدارة في هذا الصدد..... الخ)"]}
                                />
                                <ResponsibilityCard
                                    title="الحرص على متابعة تنفيذ مهام و مسؤوليات المشاركون"
                                    isExpandable={true}
                                    items={[
                                        "دراسة جدول الأعمال وأى وثائق أخرى والتاكد من أستكمال بحث الموضوعات والأستعداد التام للأجتماع",
                                        "متابعه اهداف الاجتماع وتحديدها والتاكد من عدم انحرافها عن اجندة العمل",
                                        "متابعة الاستراتيجية المتبعة فى الاجتماع والاصغاء بعناية والمساهمة فى الوقت المناسب",
                                        "معرفة الاجراءات او القواعد التى سوف يسير الاجتماع وفقها والسيطرة على ردود الافعال الشخصية",
                                        "تدوين الملاحظات والمشاركة فى النقاش الجاد الفعال والمساعدة فى اتخاذ القرارات",
                                        "الحرص على الحيادية و التقيد بالموضوع فى مناقشة مجالات الاجتماع",
                                        "الحرص على تدريب أعضاء المجلس على مهارات العرض Presentation"
                                    ]}
                                />
                                <ResponsibilityCard
                                    title="متابعة مقرر المجلس في تنفيذ مهامه"
                                    isExpandable={true}
                                    items={[
                                        "التأكد من أتخاذ كافة الترتيبات الأدارية بشكل مناسب ومن سيرها بسلاسة",
                                        "تدوين ملاحظات دقيقة عن الفعاليات وكتابة محضر او ملاحظات لتكون سجلا دائما ورسميا",
                                        "مساعدة رئيس الاجتماع طوال الأجتماع والأحتفاظ بكافة الوثائق ذات العلاقة",
                                        "إجراءات التحضير قبل الأجتماع وتجهيز أجندة الاجتماع"
                                    ]}
                                />
                                <div className="flex items-center gap-3 border-2 border-[#f57c00] bg-white p-4">
                                    <TrendingUp className="h-6 w-6 text-[#f57c00]" />
                                    <span className="text-sm font-bold sm:text-base">تقييم اجتماعات قادة المستقبل دوريا</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Proposals Section */}
                    <section className="mt-0 overflow-hidden border-2 border-[#0865a8] bg-white shadow-xl">
                        <div className="flex flex-col gap-4 bg-gradient-to-l from-[#f57c00] via-black to-[#0865a8] p-4 sm:flex-row sm:items-center sm:p-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white">
                                <Lightbulb className="h-6 w-6 text-[#f57c00]" />
                            </div>
                            <div>
                                <h2 className="responsive-h2 text-white">مقترحات قادة المستقبل</h2>
                                <p className="text-xs text-white opacity-90 sm:text-sm">مبادرات مبتكرة لتطوير العمل وتحسين الأداء</p>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 lg:p-10">
                            <div className="proposals-grid">
                                <ProposalCard title="مقترح لتوفير الوقود ( بنزين - سولار )" subitems={["تحويل الخلاطات للعمل بالغاز الطبيعي", "تركيب أجهزة GPS", "استخدام خلايا الهيدروجين"]} color="orange" />
                                <ProposalCard title="تفعيل قسم الجودة في جميع مراحل التصنيع" description="من بداية اختبار العينات وحتى خروج المصنعات" color="blue" />
                                <ProposalCard title="إنشاء قاعدة بيانات شاملة للمشروعات" description="تكون بمثابة دليل مرجعي للمشروعات القادمة ( الدروس المستفادة )" color="black" />
                                <ProposalCard title="مقترح نظام الحماية الكاملة للمعدات" description="من السرقة وخلافه من خلال تكنولوجيا المعلومات" color="mixed" />
                                <ProposalCard title="عمل خطة احتياجات للموارد البشرية" subitems={["قاعدة بيانات محدثة للفنيين", "توفير عمالة يومية مؤقته", "اعادة التوزيع الجغرافي للعمالة"]} color="orange" />
                                <ProposalCard title="الإهتمام بالبيئة المحيطة بالمشروعات" description="توفير أماكن للتخلص من المخلفات والزيوت وعمل أرضيات خرسانية مناسبة" color="blue" />
                                <ProposalCard title="استخدام الطاقة الشمسية" description="وكيفية الاستفادة منها لتقليل التكاليف" color="black" />
                                <ProposalCard title="مقترح لإيجاد مصادر أخرى لزيادة الإيراد" description="عن طريق تعظيم الإستفادة من الأصول العقارية والأراضي" color="mixed" />
                                <ProposalCard title="مقترح لانشاء ورشة للسلامة" description="تقوم بعمل مهمات السلامة من بواقي عمليات الانشاء" color="orange" />
                                <ProposalCard title="مقترح بانشاء تطبيق على المحمول" description="للدليل التنظيمي للشركة" color="blue" />
                                <ProposalCard title="استغلال ناتج الكشط في خلاطات الاسفلت" description="لتوفير الخامات بنسبة توفير ٤٠%" color="mixed" />
                                <ProposalCard title="الاستغلال الأمثل للـ Cloud computing" description="في تخزين البيانات" color="orange" />
                                <ProposalCard title="استغلال كميات هالك الكاوتش" subitems={["انشاء مصنع لاعادة تدوير الكاوتش", "انتاج خلطة خرسانية مطاطية"]} color="blue" />
                                <ProposalCard title="دورات في اللغة الانجليزية" description="عقد دورات لرفع الكفاءة اللغوية العاملين في المشروعات المشتركة" color="black" />
                                <ProposalCard title="تطبيق كتابة الخطابات باللغتين" description="العربية والانجليزية معاً لرفع مستوى اللغة" color="mixed" />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
