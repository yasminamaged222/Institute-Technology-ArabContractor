import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, Users, Target, Lightbulb, Award, TrendingUp, Zap } from 'lucide-react';

// Helper Components
const ResponsibilityCard = ({ title, items, isExpandable = false }) => {
    const [isExpanded, setIsExpanded] = useState(!isExpandable);

    return (
        <div className="group relative overflow-hidden rounded-xl border-2 border-slate-300 bg-white p-6 shadow-md transition-all hover:border-[#f57c00] hover:shadow-xl">
            <div
                className="flex cursor-pointer items-start justify-between gap-4"
                onClick={() => isExpandable && setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-1 items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f57c00] to-[#0865a8]">
                        <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black">{title}</h3>
                </div>
                {isExpandable && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700 transition-all group-hover:bg-[#f57c00] group-hover:text-white">
                        {isExpanded ? '−' : '+'}
                    </div>
                )}
            </div>

            {isExpanded && (
                <ul className="mt-6 space-y-3 border-r-2 border-[#0865a8] pr-6">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-700">
                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#f57c00]" />
                            <span className="leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const ProposalCard = ({ title, description, subitems, color = "orange" }) => {
    const colorClasses = {
        orange: 'border-[#f57c00] hover:shadow-[0_0_20px_rgba(245,124,0,0.3)] bg-gradient-to-br from-orange-50 to-white',
        blue: 'border-[#0865a8] hover:shadow-[0_0_20px_rgba(8,101,168,0.3)] bg-gradient-to-br from-blue-50 to-white',
        black: 'border-black hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] bg-gradient-to-br from-slate-50 to-white',
        mixed: 'border-[#f57c00] hover:shadow-[0_0_20px_rgba(8,101,168,0.3)] bg-gradient-to-br from-orange-50 via-white to-blue-50'
    };

    const iconColorClasses = {
        orange: 'from-[#f57c00] to-orange-600',
        blue: 'from-[#0865a8] to-blue-700',
        black: 'from-slate-800 to-black',
        mixed: 'from-[#f57c00] to-[#0865a8]'
    };

    const textColorClasses = {
        orange: 'text-[#f57c00]',
        blue: 'text-[#0865a8]',
        black: 'text-black',
        mixed: 'text-[#f57c00]'
    };

    return (
        <div className={`group rounded-xl border-2 ${colorClasses[color]} p-5 transition-all duration-300 hover:scale-[1.02]`}>
            <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${iconColorClasses[color]} shadow-md`}>
                    <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className={`mb-2 text-base font-bold ${textColorClasses[color]}`}>{title}</h3>
                    {description && (
                        <p className="text-sm leading-relaxed text-slate-700">{description}</p>
                    )}
                    {subitems && (
                        <ul className="mt-3 space-y-2">
                            {subitems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-slate-700">
                                    <CheckCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${textColorClasses[color]}`} />
                                    <span className="text-sm leading-relaxed">{item}</span>
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
    const [activeSection, setActiveSection] = useState(null);
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
            {/* Progress Bar */}
            <div className="fixed left-0 top-0 z-50 h-1 w-full bg-slate-200">
                <div
                    className="h-full bg-gradient-to-r from-[#f57c00] via-[#0865a8] to-black transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            {/* Fixed Overview Bar */}
            <div className="top-100 fixed left-0 z-50 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2">
                <div className="text-center">
                    <span className="text-base">
                        <a href="/" className="ml-3 text-gray-700 hover:text-gray-900">الصفحة الرئيسية</a>
                        <span className="text-gray-500">-</span>
                        <span className="mr-3 text-gray-700">مجلس قادة المستقبل</span>
                    </span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pb-20 pt-24">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-white" />
                    <div className="bg-[radial-gradient(circle_at_30%_20%,rgba(245,124,0,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(8,101,168,0.08),transparent_50%)] absolute inset-0" />
                </div>

                <div className="container relative z-10 mx-auto px-6 py-12">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#f57c00] bg-white px-5 py-2 shadow-md">
                            <Award className="h-5 w-5 text-[#f57c00]" />
                            <span className="font-semibold text-black">برنامج تطوير القيادات</span>
                        </div>
                        <h1 className="mb-6 text-5xl font-extrabold leading-tight text-black md:text-6xl lg:text-7xl">
                            مجلس قادة المستقبل
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-black md:text-xl">
                            نحن نؤمن بأن الاستثمار في شباب الشركة هو الاستثمار في مستقبلها،
                            من خلال برنامج متكامل لتطوير المهارات القيادية والإدارية
                        </p>

                        {/* Stats */}
                        <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-8">
                            <div className="rounded-2xl border-2 border-[#f57c00] bg-white p-6 shadow-xl">
                                <div className="mb-2 text-5xl font-bold text-[#f57c00]">30</div>
                                <div className="text-sm font-medium text-black">فرع / إدارة</div>
                            </div>
                            <div className="rounded-2xl border-2 border-[#0865a8] bg-white p-6 shadow-xl">
                                <div className="mb-2 text-5xl font-bold text-[#0865a8]">9</div>
                                <div className="text-sm font-medium text-black">أعضاء لكل مجلس</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container relative z-20 mx-auto px-6 pb-20">
                {/* About Section Card */}
                <div className="mb-16 overflow-hidden rounded-2xl border-2 border-[#f57c00] bg-white shadow-2xl">
                    <div className="grid gap-0 lg:grid-cols-5">
                        {/* Content */}
                        <div className="order-2 p-8 lg:order-1 lg:col-span-3 lg:p-12">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f57c00] to-[#0865a8]">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-black">عن المجلس</h2>
                            </div>

                            <div className="space-y-5 text-slate-700">
                                <p className="leading-relaxed">
                                    إضافة إلى دور المعهد في المساهمة في أهداف الشركة الاستراتيجية وبالتحديد في تدريب الصف الثاني ورعاية المهارات الإدارية لشباب العاملين بالشركة وتأهيلهم كقادة المستقبل للشركة، فقد صدر قرار رئيس مجلس الإدارة رقم 352 لسنة 2016 بتاريخ 15/05/2016 بعقد مجالس قادة المستقبل.
                                </p>

                                <div className="rounded-xl border-r-4 border-[#0865a8] bg-gradient-to-l from-blue-50 to-white p-5 shadow-sm">
                                    <p className="mb-2 font-semibold text-[#0865a8]">تكوين المجلس:</p>
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        يعتبر مجلس قادة المستقبل بمثابة صورة مصغرة للمجلس التنفيذي للفروع والإدارات، ويتشكل بعضوية مهندسين - ماليين - إداريين - بالإضافة إلى ممثل المؤهلات المتوسطة (مشرفي التنفيذ - المهن العمالية).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative order-1 h-64 lg:order-2 lg:col-span-2 lg:h-auto">
                            <img
                                src="/images/leaders-01.jpg"
                                alt="Future Leaders"
                                className="h-full w-full object-cover"
                            />
                            <div className="from-[#f57c00]/30 via-[#0865a8]/20 absolute inset-0 bg-gradient-to-t to-transparent lg:bg-gradient-to-r" />
                        </div>
                    </div>
                </div>

                {/* Institute Role Section */}
                <div className="mb-16 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-2xl">
                    <div className="bg-gradient-to-l from-black via-[#0865a8] to-black p-8 lg:p-12">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f57c00]">
                                <Target className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white">دور المعهد في المجلس</h2>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12">
                        <p className="mb-8 text-lg leading-relaxed text-slate-700">
                            تفعيلاً لدور المعهد في الإشراف على مجالس قادة المستقبل، يقوم ممثلو المعهد والذي يجب أن يكون ملماً بالإجراءات الأساسية المتبعة عند عقد أي اجتماع:
                        </p>

                        <div className="space-y-5">
                            <ResponsibilityCard
                                title="الإدارة الفعالة للاجتماعات"
                                items={[
                                    "الحرص على أن ينعقد المجلس إدارياً طبقاً للأعراف والإجراءات المعمول بها",
                                    "استكمال الأجندة وفقاً للنموذج الموضوع",
                                    "استكمال النصاب القانوني للأعضاء",
                                    "الالتزام بقرار مجلس الإدارة في هذا الصدد"
                                ]}
                            />

                            <ResponsibilityCard
                                title="متابعة تنفيذ مهام المشاركين"
                                isExpandable={true}
                                items={[
                                    "دراسة جدول الأعمال وأي وثائق أخرى والتأكد من استكمال بحث الموضوعات والاستعداد التام للاجتماع",
                                    "متابعة أهداف الاجتماع وتحديدها والتأكد من عدم انحرافها عن أجندة العمل",
                                    "متابعة الاستراتيجية المتبعة في الاجتماع والإصغاء بعناية والمساهمة في الوقت المناسب وبالكيفية الأكثر فاعلية",
                                    "معرفة الإجراءات أو القواعد التي سوف يسير الاجتماع وفقها والسيطرة على ردود الأفعال الشخصية",
                                    "تدوين الملاحظات والمشاركة في النقاش الجاد الفعال والمساعدة في اتخاذ القرارات والتوصيات",
                                    "الحرص على الحيادية والتقيد بالموضوع في مناقشة مجالات الاجتماع",
                                    "الحرص على عدم المقاطعة إلا لأسباب إجرائية",
                                    "الحرص على تدريب أعضاء المجلس على مهارات العرض لموضوع ما (Presentation)"
                                ]}
                            />

                            <ResponsibilityCard
                                title="مسؤوليات مقرر المجلس"
                                isExpandable={true}
                                items={[
                                    "التأكد من اتخاذ كافة الترتيبات الإدارية بشكل مناسب ومن سيرها بسلاسة قبل الاجتماع وأثناءه وبعده",
                                    "تدوين ملاحظات دقيقة عن الفعاليات وكتابة محضر أو ملاحظات لتكون سجلاً دائماً ورسمياً",
                                    "معرفة الإجراءات التي تسري على الاجتماع والتعريف بها عند الضرورة",
                                    "مساعدة رئيس الاجتماع طوال الاجتماع والاحتفاظ بكافة الوثائق ذات العلاقة بالاجتماع",
                                    "إجراءات التحضير قبل الاجتماع وتجهيز أجندة الاجتماع",
                                    "متابعة تدوينه أثناء الاجتماع"
                                ]}
                            />

                            <div className="rounded-xl border-2 border-[#f57c00] bg-gradient-to-r from-orange-50 to-white p-5 shadow-md">
                                <div className="flex items-start gap-3">
                                    <TrendingUp className="mt-1 h-6 w-6 flex-shrink-0 text-[#f57c00]" />
                                    <p className="font-semibold text-black">
                                        تقييم اجتماعات قادة المستقبل دورياً
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Proposals Section */}
                <div className="overflow-hidden rounded-2xl border-2 border-[#0865a8] bg-white shadow-2xl">
                    <div className="relative overflow-hidden bg-gradient-to-l from-[#f57c00] via-black to-[#0865a8] p-8 lg:p-12">
                        <div className="bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] absolute inset-0" />
                        <div className="relative flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <Lightbulb className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">مقترحات قادة المستقبل</h2>
                                <p className="mt-1 text-sm text-white/90">
                                    مبادرات مبتكرة لتطوير العمل وتحسين الأداء
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 lg:p-12">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <ProposalCard
                                title="توفير الوقود (بنزين - سولار)"
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
                                description="تكون بمثابة دليل مرجعي للمشروعات القادمة (الدروس المستفادة من المشروعات)"
                                color="black"
                            />

                            <ProposalCard
                                title="نظام الحماية الكاملة للمعدات"
                                description="من السرقة وخلافه من خلال عرض للشركة المصرية لخدمات التتبع وتكنولوجيا المعلومات"
                                color="mixed"
                            />

                            <ProposalCard
                                title="خطة احتياجات الموارد البشرية"
                                subitems={[
                                    "إنشاء وعمل قاعدة بيانات محدثة تضم جميع الفنيين وتصنيفهم حسب الخبرة",
                                    "توفير عمالة يومية مؤقتة لتلافي العجز",
                                    "إعادة التوزيع الجغرافي للعمالة",
                                    "إعادة تأهيل العمالة لمهن أخرى",
                                    "تمييز العامل المميز بجهد إضافي طبقاً للائحة الأجور"
                                ]}
                                color="orange"
                            />

                            <ProposalCard
                                title="الاهتمام بالبيئة المحيطة بالمشروعات"
                                description="توفير أماكن للتخلص من المخلفات والزيوت وعمل أرضيات خرسانية مناسبة لأعمال الصيانة بالورش"
                                color="blue"
                            />

                            <ProposalCard
                                title="استخدام الطاقة الشمسية"
                                description="وكيفية الاستفادة منها لتقليل التكاليف"
                                color="black"
                            />

                            <ProposalCard
                                title="إيجاد مصادر أخرى لزيادة الإيراد"
                                description="عن طريق تعظيم الاستفادة من الأصول العقارية والأراضي المملوكة للشركة"
                                color="mixed"
                            />

                            <ProposalCard
                                title="إنشاء ورشة للسلامة"
                                description="تقوم بعمل مهمات السلامة من بواقي عمليات الإنشاء"
                                color="orange"
                            />

                            <ProposalCard
                                title="تطبيق على المحمول للدليل التنظيمي"
                                description="لسهولة الوصول والاستخدام"
                                color="blue"
                            />

                            <ProposalCard
                                title="تعليمات المستندات المطلوبة لإيجار المعدات"
                                description="داخل المشاريع لسهولة وسرعة التنفيذ"
                                color="black"
                            />

                            <ProposalCard
                                title="استغلال ناتج الكشط في خلاطات الأسفلت"
                                description="لتوفير الخامات (محمصة لإنتاج خلطات أسفلتية من ناتج الكشط بنسبة توفير 40% من الخامات)"
                                color="mixed"
                            />

                            <ProposalCard
                                title="الاستغلال الأمثل للـ Cloud Computing"
                                description="في تخزين البيانات"
                                color="orange"
                            />

                            <ProposalCard
                                title="استغلال كميات هالك الكاوتش"
                                subitems={[
                                    "إنشاء مصنع لإعادة تدوير الكاوتش",
                                    "استخدام الهالك في إنتاج خلطة خرسانية مطاطية"
                                ]}
                                color="blue"
                            />

                            <ProposalCard
                                title="دورات في اللغة الإنجليزية"
                                description="لرفع الكفاءة اللغوية للعاملين في المشروعات المشتركة مع شركات واستشاريين أجانب"
                                color="black"
                            />

                            <ProposalCard
                                title="كتابة الخطابات باللغتين"
                                description="العربية والإنجليزية معاً لرفع مستوى اللغة الإنجليزية لدى الأفراد"
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
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f57c00, #0865a8);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #e86f00, #064a7a);
        }
      `}</style>
        </div>
    );
}