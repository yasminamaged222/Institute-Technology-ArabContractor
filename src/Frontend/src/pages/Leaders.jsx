import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, Users, Target, Lightbulb, Award, TrendingUp, Zap, Sparkles, ArrowRight } from 'lucide-react';

// Helper Components
const ResponsibilityCard = ({ title, items, isExpandable = false }) => {
    const [isExpanded, setIsExpanded] = useState(!isExpandable);

    return (
        <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg transition-all hover:border-gray-300 hover:shadow-2xl sm:rounded-2xl">
            <div
                className="relative cursor-pointer p-4 sm:p-6"
                onClick={() => isExpandable && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex flex-1 items-start gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg shadow-lg sm:h-12 sm:w-12 sm:rounded-xl" style={{ background: 'linear-gradient(135deg, #f57c00, #0865a8)' }}>
                            <CheckCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        </div>
                        <h3 className="text-base font-bold text-black sm:text-lg md:text-xl">{title}</h3>
                    </div>
                    {isExpandable && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-all sm:h-10 sm:w-10" style={{
                            backgroundColor: isExpanded ? '#f57c00' : '#f3f4f6',
                            color: isExpanded ? 'white' : '#374151'
                        }}>
                            <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    )}
                </div>

                {isExpanded && (
                    <ul className="mt-4 space-y-2 border-r-4 pr-4 sm:mt-6 sm:space-y-3 sm:pr-6" style={{ borderColor: '#f57c00' }}>
                        {items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 sm:gap-3">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: '#0865a8' }} />
                                <span className="text-sm leading-relaxed sm:text-base">{item}</span>
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
        <div className="group relative overflow-hidden rounded-xl border-2 bg-white p-4 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sm:rounded-2xl sm:p-5 md:p-6"
            style={{ borderColor: colors.border }}>
            <div className="absolute right-0 top-0 h-1 w-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: color === 'mixed' ? 'linear-gradient(to right, #f57c00, #0865a8)' : colors.bg }} />

            <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg shadow-lg sm:h-12 sm:w-12 sm:rounded-xl"
                    style={{ background: color === 'mixed' ? 'linear-gradient(135deg, #f57c00, #0865a8)' : colors.bg }}>
                    <Sparkles className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1">
                    <h3 className="mb-2 text-base font-bold text-black sm:mb-3 sm:text-lg">{title}</h3>
                    {description && (
                        <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{description}</p>
                    )}
                    {subitems && (
                        <ul className="mt-3 space-y-2 sm:mt-4">
                            {subitems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                    <ArrowRight className="mt-1 h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: '#f57c00' }} />
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
            {/* Animated Progress Bar */}
            <div className="fixed left-0 top-0 z-50 h-1.5 w-full bg-gray-200">
                <div
                    className="h-full transition-all duration-300"
                    style={{
                        width: `${scrollProgress}%`,
                        background: `linear-gradient(to right, #f57c00, #0865a8)`
                    }}
                />
            </div>

            {/* Fixed Overview Bar - positioned to appear below main site navbar */}
            <div className="fixed left-0 z-30 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2" style={{ top: '70px' }}>
                <div className="text-center">
                    <span className="text-base">
                        <a href="/" className="ml-3 text-gray-700 hover:text-gray-900">الصفحة الرئيسية</a>
                        <span className="text-gray-500">-</span>
                        <span className="mr-3 text-gray-700">مجلس قادة المستقبل</span>
                    </span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36 md:pb-24 md:pt-40">
                <div className="container relative z-10 mx-auto px-4 sm:px-6">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 shadow-lg sm:mb-8 sm:gap-3 sm:px-6 sm:py-3" style={{ borderColor: '#f57c00' }}>
                            <Award className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#f57c00' }} />
                            <span className="text-base font-bold text-black sm:text-lg">برنامج تطوير القيادات</span>
                        </div>

                        <h1 className="font-black mb-6 text-4xl leading-tight text-black sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                            مجلس قادة المستقبل
                        </h1>

                        <p className="mx-auto max-w-3xl px-4 text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl lg:text-2xl">
                            نحن نؤمن بأن الاستثمار في شباب الشركة هو الاستثمار في مستقبلها،
                            من خلال برنامج متكامل لتطوير المهارات القيادية والإدارية
                        </p>

                        {/* Enhanced Stats */}
                        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 px-4 sm:mt-16 sm:grid-cols-2 sm:gap-8">
                            <div className="group relative overflow-hidden rounded-3xl border-2 bg-white p-6 shadow-xl transition-all hover:scale-105 sm:p-8" style={{ borderColor: '#f57c00' }}>
                                <div className="relative">
                                    <div className="font-black mb-3 text-5xl sm:text-6xl" style={{ color: '#f57c00' }}>30</div>
                                    <div className="text-sm font-semibold text-gray-700 sm:text-base">فرع / إدارة</div>
                                </div>
                            </div>
                            <div className="group relative overflow-hidden rounded-3xl border-2 bg-white p-6 shadow-xl transition-all hover:scale-105 sm:p-8" style={{ borderColor: '#0865a8' }}>
                                <div className="relative">
                                    <div className="font-black mb-3 text-5xl sm:text-6xl" style={{ color: '#0865a8' }}>9</div>
                                    <div className="text-sm font-semibold text-gray-700 sm:text-base">أعضاء لكل مجلس</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container relative z-20 mx-auto px-4 pb-16 sm:px-6 sm:pb-20 md:pb-24">
                {/* About Section */}
                <div className="mb-16 overflow-hidden rounded-2xl border-2 bg-white shadow-2xl sm:mb-20 sm:rounded-3xl" style={{ borderColor: '#f57c00' }}>
                    <div className="grid gap-0 lg:grid-cols-5">
                        {/* Content */}
                        <div className="order-2 p-6 sm:p-8 md:p-10 lg:order-1 lg:col-span-3 lg:p-14">
                            <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl" style={{ background: `linear-gradient(135deg, #f57c00, #0865a8)` }}>
                                    <Users className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                                </div>
                                <h2 className="font-black text-2xl text-black sm:text-3xl md:text-4xl">عن المجلس</h2>
                            </div>

                            <div className="space-y-4 text-gray-700 sm:space-y-6">
                                <p className="text-base leading-relaxed sm:text-lg">
                                    إضافة الى دور المعهد في المساهمة في اهداف الشركة الاستراتيجية و بالتحديد في تدريب الصف الثانى ورعاية المهارات الإدارية لشباب العاملين بالشركة و تاهيلهم كقادة المستقبل للشركة فقد صدور قرار رئيس مجلس الإدارة رقم 352 لسنة 2016 بتاريخ 15/05/2016 بعقد مجالس قادة المستقبل حيث يعتبر مجلس قادة المستقبل بمثابة صورة مصغرة للمجلس التنفيذي للفروع والادارات ويتشكل بعضوية مهندسين – ماليين – اداريين – بالاضافة الى ممثل المؤهلات المتوسطة ( مشرفي التنفيذ – المهن العمالية ).
                                </p>

                                <div className="rounded-xl border-2 border-r-4 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6" style={{ borderRightColor: '#0865a8', borderColor: '#e5e7eb' }}>
                                    <p className="text-base leading-relaxed sm:text-lg">
                                        وقد تم مخاطبة عدد 30 فرع / ادارة لترشيح اعضاء للمجلس بما لا يزيد عدد اعضاء المجلس عن 9 اعضاء لكل مجلس ، تكون مدة عضوية المجلس سنتين ماليتين ، وعليه فقد تم الانتهاء من الدورة الاولى (مدة العضوية الاولى ) للفروع والادارات وجاري حالية العمل في المرحلة الثانية
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative order-1 h-64 sm:h-80 lg:order-2 lg:col-span-2 lg:h-auto">
                            <img
                                src="/images/leaders-01.jpg"
                                alt="Future Leaders"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(245, 124, 0, 0.4), rgba(8, 101, 168, 0.2), transparent)' }} />
                        </div>
                    </div>
                </div>

                {/* Institute Role Section */}
                <div className="mb-16 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-2xl sm:mb-20 sm:rounded-3xl">
                    <div className="relative overflow-hidden p-6 sm:p-8 md:p-10 lg:p-14" style={{ background: 'linear-gradient(to left, #0865a8, #000000)' }}>
                        <div className="relative flex items-center gap-3 sm:gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl" style={{ backgroundColor: '#f57c00' }}>
                                <Target className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                            </div>
                            <h2 className="font-black text-2xl text-white sm:text-3xl md:text-4xl">دور المعهد في المجلس</h2>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 md:p-10 lg:p-14">
                        <p className="mb-8 text-base leading-relaxed text-gray-700 sm:mb-10 sm:text-lg">
                            تفعيلا لدور المعهد في الاشراف على مجالس قادة المستقبل يقوم ممثلوا المعهد والذى يجب ان يكون ملما بالإجراءات الاساسية المتبعة عند عقد اى اجتماع:
                        </p>

                        <div className="space-y-5 sm:space-y-6">
                            <ResponsibilityCard
                                title="الإدارة الفعالة للاجتماعات"
                                items={[
                                    "بالحرص على ان ينعقد المجلس إداريا طبقا للاعراف والإجراءات المعمول بها (استكمال الاجندة وفقا للنموذج الموضوع- استكمال النصاب القانوني للاعضاء- الالتزام بقرار مجلس الإدارة في هذا الصدد..... الخ)"
                                ]}
                            />

                            <ResponsibilityCard
                                title="الحرص على متابعة تنفيذ مهام و مسؤوليات المشاركون في الاجتماع"
                                isExpandable={true}
                                items={[
                                    "دراسة جدول الأعمال وأى وثائق أخرى والتاكد من أستكمال بحث الموضوعات والأستعداد التام للأجتماع",
                                    "متابعه اهداف الاجتماع وتحديدها والتاكد من عدم انحرافها عن اجندة العمل",
                                    "متابعة الاستراتيجية المتبعة فى الاجتماع والاصغاء بعناية والمساهمة فى الوقت المناسب وبالكيفية الاكثر فاعلية",
                                    "دواعى السفر للفروع الخارجية",
                                    "معرفة الاجراءات او القواعد التى سوف يسير الاجتماع وفقها والسيطرة على ردود الافعال الشخصية",
                                    "تدوين الملاحظات والمشاركة فى النقاش الجاد الفعال والمساعدة فى اتخاذ القرارات والتوصيات والعمل على توضيح وجهة نظره بصوره جلية",
                                    "الحرص على الحيادية و التقيد بالموضوع فى مناقشة مجالات الاجتماع واتخاذ ما هو صالح منها والابتعاد عن الثرثرة والعدوانية والغرور",
                                    "الحرص على عدم المقاطعة الا لأسباب اجرائيه",
                                    "الحرص على تدريب أعضاء المجلس على مهارات العرض لموضوع ما Presentation فعليه يتوقف قبول او رفض وجهات نظره"
                                ]}
                            />

                            <ResponsibilityCard
                                title="متابعة مقرر المجلس في تنفيذ مهامه ومسؤولياته"
                                isExpandable={true}
                                items={[
                                    "التأكد من أتخاذ كافة الترتيبات الأدارية بشكل مناسب ومن سيرها بسلاسة قبل الأجتماع وأثناءه وبعده",
                                    "تدوين ملاحظات دقيقة عن الفعاليات وكتابة محضر او ملاحظات لتكون سجلا دائما ورسميا",
                                    "معرفة الأجراءات التى تسرى على الأجتماع والتعريف بها عند الضرورة",
                                    "مساعدة رئيس الاجتماع طوال الأجتماع والأحتفاظ بكافة الوثائق ذات العلاقة بالأجتماع",
                                    "إجراءات التحضير قبل الأجتماع وتجهيز أجندة الاجتماع",
                                    "متابعة تدوينه اثناء الاجتماع",
                                    "بعد انعقاد الاجتماع"
                                ]}
                            />

                            <div className="rounded-xl border-2 bg-white p-4 shadow-md sm:rounded-2xl sm:p-6" style={{ borderColor: '#f57c00' }}>
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <TrendingUp className="mt-1 h-6 w-6 flex-shrink-0 sm:h-7 sm:w-7" style={{ color: '#f57c00' }} />
                                    <p className="text-base font-bold text-black sm:text-lg">
                                        تقييم اجتماعات قادة المستقبل دوريا
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Proposals Section */}
                <div className="overflow-hidden rounded-2xl border-2 bg-white shadow-2xl sm:rounded-3xl" style={{ borderColor: '#0865a8' }}>
                    <div className="relative overflow-hidden p-6 sm:p-8 md:p-10 lg:p-14" style={{ background: 'linear-gradient(to left, #f57c00, #000000, #0865a8)' }}>
                        <div className="relative flex items-center gap-3 sm:gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl">
                                <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: '#f57c00' }} />
                            </div>
                            <div>
                                <h2 className="font-black text-2xl text-white sm:text-3xl md:text-4xl">مقترحات قادة المستقبل</h2>
                                <p className="mt-1 text-sm text-white sm:mt-2 sm:text-base md:text-lg">
                                    مبادرات مبتكرة لتطوير العمل وتحسين الأداء
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-14">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
                            <ProposalCard
                                title="مقترح لتوفير الوقود ( بنزين - سولار )"
                                subitems={[
                                    "تحويل الخلاطات والمعدات للعمل بالغاز الطبيعي",
                                    "تركيب أجهزة GPS",
                                    "استخدام خلايا الهيدروجين"
                                ]}
                                color="orange"
                            />

                            <ProposalCard
                                title="تفعيل قسم الجودة في جميع مراحل التصنيع"
                                description="من بداية اختبار العينات وحتى خروج المصنعات"
                                color="blue"
                            />

                            <ProposalCard
                                title="إنشاء قاعدة بيانات شاملة للمشروعات"
                                description="تكون بمثابة دليل مرجعي للمشروعات القادمة ( الدروس المستفادة من المشروعات )"
                                color="black"
                            />

                            <ProposalCard
                                title="مقترح نظام الحماية الكاملة للمعدات"
                                description="من السرقة وخلافه من خلال عرض للشركة المصرية لخدمات التتبع وتكنولوجيا المعلومات"
                                color="mixed"
                            />

                            <ProposalCard
                                title="عمل خطة احتياجات للموارد البشرية"
                                subitems={[
                                    "إنشاء وعمل قاعدة بيانات محدثة تضم جميع الفنيين وتصنيفهم حسب الخبرة وانتقاء مجموعات للعمل في المشروعات المتخصصة",
                                    "توفير عمالة يومية مؤقته لتلافي العجز",
                                    "اعادة التوزيع الجغرافي للعمالة",
                                    "اعادة تأهيل العمالة لمهن اخرى",
                                    "تمييز العامل المميز بجهد اضافي طبقاً للائحة الأجور"
                                ]}
                                color="orange"
                            />

                            <ProposalCard
                                title="الإهتمام بالبيئة المحيطة بالمشروعات"
                                description="عن طريق توفير أماكن للتخلص من المخلفات والزيوت عن طريق عمل مجرى للكشف على السيارات وعمل أرضيات خرسانية مناسبة لأعمال الصيانة بالورش"
                                color="blue"
                            />

                            <ProposalCard
                                title="استخدام الطاقة الشمسية"
                                description="وكيفية الاستفادة منها لتقليل التكاليف"
                                color="black"
                            />

                            <ProposalCard
                                title="مقترح لإيجاد مصادر أخرى لزيادة الإيراد"
                                description="عن طريق تعظيم الإستفادة من الأصول العقارية والأراضي المملوكة للشركة"
                                color="mixed"
                            />

                            <ProposalCard
                                title="مقترح لانشاء ورشة للسلامة"
                                description="تقوم بعمل مهمات السلامة من بواقي عمليات الانشاء"
                                color="orange"
                            />

                            <ProposalCard
                                title="مقترح بانشاء تطبيق على المحمول"
                                description="للدليل التنظيمي للشركة"
                                color="blue"
                            />

                            <ProposalCard
                                title="مقترح باصدار تعليمات توضح المستندات المطلوبة"
                                description="لايجار المعدات داخل المشاريع لسهولة وسرعة التنفيذ"
                                color="black"
                            />

                            <ProposalCard
                                title="استغلال ناتج الكشط في خلاطات الاسفلت"
                                description="لتوفير الخامات ( هي عبارة عن محمصة بيتم تذويدها في الخلاطة لانتاج خلطات اسفلتية من ناتج الكشط بنسبة توفير ٤٠% من الخامات)"
                                color="mixed"
                            />

                            <ProposalCard
                                title="الاستغلال الأمثل للـ Cloud computing"
                                description="في تخزين البيانات"
                                color="orange"
                            />

                            <ProposalCard
                                title="استغلال كميات هالك الكاوتش"
                                subitems={[
                                    "انشاء مصنع لاعادة تدوير الكاوتش",
                                    "استخدام الهالك في انتاج خلطة خرسانية مطاطية"
                                ]}
                                color="blue"
                            />

                            <ProposalCard
                                title="دورات في اللغة الانجليزية"
                                description="نظراً لمشاركة الشركة لشركات اجنبية وكذلك تعاملها مع استشاريين اجنبيين في المشروعات الكبرى محليا وعالميا ، و ضعف اللغة الاجنبية لمعظم موظفي الشركة ( مهندسين – ماليين – اداريين ) ، نقترح عقد دورات في اللغة الانجليزية لرفع الكفاءة اللغوية العاملين في المشروعات المشتركة"
                                color="black"
                            />

                            <ProposalCard
                                title="تطبيق كتابة الخطابات باللغتين"
                                description="العربية والانجليزية معاً لرفع مستوى اللغة الإنجليزية لدى الافراد"
                                color="mixed"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Styles */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');

                * {
                    font-family: 'Droid Arabic Kufi', serif !important;
                }

                html {
                    scroll-behavior: smooth;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 12px;
                }

                ::-webkit-scrollbar-track {
                    background: #f3f4f6;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #f57c00, #0865a8);
                    border-radius: 6px;
                    border: 2px solid #f3f4f6;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #d66a00, #064a7a);
                }
            `}</style>
        </div>
    );
}