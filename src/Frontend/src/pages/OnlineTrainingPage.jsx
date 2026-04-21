import React, { useEffect } from 'react';
import {
    FaProjectDiagram,
    FaUserTie,
    FaFileContract,
    FaLightbulb,
    FaShieldAlt,
} from 'react-icons/fa';

const css = `
/* ── page root ── */
.ot-page-root {
    min-height: 100vh;
    background: #fff;
    margin: 0;
    padding: 0;
    font-family: "Droid Arabic Kufi", "Noto Kufi Arabic", serif;
}

/* ── HERO ── */
.ot-hero {
    position: relative;
    padding: clamp(80px,10vw,120px) clamp(20px,5vw,80px) clamp(60px,8vw,100px);
    background: linear-gradient(135deg, #0a3d6b 0%, #0865a8 60%, #1a7abf 100%);
    color: #fff;
    overflow: hidden;
    margin-top: 36px;
    text-align: right;
}
.ot-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
}
.ot-hero-accent-bar {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
    background: #f57c00;
}
.ot-hero-content {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
}
.ot-hero-eyebrow {
    display: inline-block;
    font-size: clamp(12px,1.4vw,15px);
    font-weight: 700;
    color: #f9c56a;
    margin-bottom: 14px;
    padding: 4px 14px;
    border: 1px solid rgba(249,197,106,0.4);
    border-radius: 20px;
}
.ot-hero-title {
    font-size: clamp(28px,5vw,52px);
    font-weight: 900;
    line-height: 1.25;
    margin: 0 0 20px;
    color: #fff;
}
.ot-hero-title em {
    font-style: normal;
    color: #f9c56a;
}
.ot-hero-body {
    font-size: clamp(14px,1.6vw,17px);
    line-height: 2;
    color: rgba(255,255,255,0.88);
    margin: 0;
    max-width: 680px;
}

/* ── SHARED SECTIONS ── */
.ot-section-white { background: #fff; padding: clamp(40px,6vw,80px) 0; text-align: right; }
.ot-section-gray  { background: #f8fafc; padding: clamp(40px,6vw,80px) 0; text-align: right; }
.ot-section-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(20px,4vw,60px);
}
.ot-section-heading {
    font-size: clamp(20px,2.5vw,28px);
    font-weight: 900;
    color: #1e293b;
    margin: 0 0 10px;
}
.ot-section-heading span { color: #0865a8; }
.ot-heading-bar {
    width: 60px;
    height: 4px;
    background: #f57c00;
    border-radius: 2px;
    margin: 0 0 36px auto;
}

/* ── INTRO GRID ── */
.ot-intro-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(30px,4vw,60px);
    align-items: center;
}
@media (max-width: 768px) {
    .ot-intro-grid { grid-template-columns: 1fr; }
}
.ot-intro-text { display: flex; flex-direction: column; gap: 16px; }
.ot-intro-p {
    font-size: clamp(14px,1.4vw,16px);
    line-height: 2;
    color: #374151;
    margin: 0;
}
.ot-intro-image img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    display: block;
}

/* ── PROGRAMS LIST ── */
.ot-programs-list { display: flex; flex-direction: column; }
.ot-program-card {
    display: flex;
    gap: clamp(16px,2vw,24px);
    align-items: flex-start;
    padding: clamp(20px,2.5vw,28px) 0;
    border-bottom: 1px solid #e2e8f0;
}
.ot-program-card:last-child { border-bottom: none; }
.ot-icon {
    flex-shrink: 0;
    width: clamp(48px,5vw,58px);
    height: clamp(48px,5vw,58px);
    border-radius: 50%;
    background: linear-gradient(135deg, #0865a8, #1a7abf);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(8,101,168,0.25);
    margin-top: 4px;
}
.ot-program-content { flex: 1; }
.ot-program-title {
    font-size: clamp(15px,1.6vw,18px);
    font-weight: 900;
    margin: 0 0 10px;
    line-height: 1.5;
}
.ot-program-title a { color: #0865a8; text-decoration: none; transition: color 0.2s; }
.ot-program-title a:hover { color: #f57c00; }
.ot-program-desc {
    font-size: clamp(13px,1.3vw,15px);
    line-height: 2;
    color: #374151;
    margin: 0;
}
`;

export default function OnlineTrainingPage() {
    const programs = [
        {
            icon: <FaProjectDiagram size={28} color="white" />,
            title: 'برنامج Project Management Professional (PMP)',
            description:
                'وهو برنامج إدارة المشاريع الإحترافية (PMP) الذي اصبح الآن متوفر أون لاين تحت اشراف طقم ادارى متخصص (تدريب عن بعد) مما يتيح تنفيذ العملية اون لاين، بحيث تتمكن من الإستفسار عن أي نقطة أو تساؤل أثناء مشاهدة المادة وحضور البرنامج وايضا الاستفادة بالحصول على مقاطع فيديو متعددة تشرح مادة إدارة المشاريع الإحترافية (PMP) مبنيةً على آخر إصدار من كتاب و منهجية إدارة المشاريع الإحترافية PMBOK وايضا امثلة من الاختبارات للمساعدة في تأكيد المعلومات الواردة في كل وحدة وفور اكتمال حضور المتدرب ثلاثة اسابيع بواقع 45 ساعة تدريبية واجتيازه تقييم كل اسبوع من الاسابيع الثلاثة بنجاح يحصل على شهادة من المعهد كجهة معتمدة من معهد ادارة المشروعات الامريكى PMI.',
        },
        {
            icon: <FaUserTie size={28} color="white" />,
            title: 'القيادة التنفيذية',
            description:
                'وهى ندوة اليوم الواحد حيث تم تنظيمها باستخدام تكنولوجيا الاتصالات عن بعد حيث يتم حضور المتدربين الندوة عن بعد والاستفادة من المادة العلمية التى يلقيها المحاضر وتشمل (الانماط المختلفة للقيادة - اساليب القيادة الفعالة)',
        },
        {
            icon: <FaFileContract size={28} color="white" />,
            title: 'عقود الفيديك',
            description:
                'وهى ندوة تعقد لمدة يومين للمهتمين بتفاصيل العقود الخاصة بالمشروعات أو مدير مشروع أو مسئول التعاقدات حيث تحتوى الندوة على فكرة عامة عن عقود الفيديك وشروطه والبنود المتعلقة بالوقت به والبنود المتعلقة بالتغيرات والمطالبات والبنود المتعلقة بدفع المستحقات وايضا تسوية النزاعات فى عقود الفيديك ويتم تنفيذها ايضا عن بعد',
        },
        {
            icon: <FaLightbulb size={28} color="white" />,
            title: 'اساليب تحليل المشكلات واتخاذ القرارات',
            description:
                'وهى ندوة لمدة يومين تتيح للمتدرب حل المشكلات واتخاذ القرارات والتى تنظم طريقة تفكير المتدرب عند مواجهة المشكلات فى جميع نواحي الحياة العملية ومن خلالها يستطيع المتدرب التعرف على الطرق العلمية المنظمة لحل المشكلات واتخاذ القرارات بداية من الاسلوب الادارى فى تحليل وحل المشكلات ثم معرفة انماط المديرين فى حل المشكلات الى ان يتم الإتفاق على افضل القرارات لتطبيقها ووضع ورقة عمل لتنفيذها ومتابعتها وتقييم فاعليته ويتم تنفيذها ايضا عن بعد',
        },
        {
            icon: <FaShieldAlt size={28} color="white" />,
            title: 'برنامجى السلامة والجودة للمهندسين المرشحين للترقى',
            description:
                'وفى اطار حرص الشركة لتزويد العاملين بها بالمعرفة الكاملة بأسس السلامة والصحة المهنية ومتطلبات الجودة بالشركة فقد حرصت على ضرورة حضور المهندسين المرشحين للترقى لبرنامجى السلامة والجودة مما يتيح للمهندسين الحاضرين لتلك البرامج التعامل مع متطلبات السلامة من حيث (مهمات الحماية الشخصية – دليل و خطة السلامة والصحة المهنية للمشروعات - خطة الاستجابة للطوارئ والحريق - تصاريح الاعمال الخطرة - تحليل مؤشرات الحوادث والاصابات والامراض المهنية - تقييم المخاطر - ترتيب ونظافة مواقع العمل) وايضا لتحقيق اعلى جودة من حيث (التعريفات الهامة والتطور التاريخى للجودة - المواصفات الدولية الأيزو) ويتم تنفيذها ايضا عن بعد',
        },
    ];

    useEffect(() => {
        document.title = 'التدريب عن بعد ( اونلاين ) - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <>
            <style>{css}</style>

            <div className="ot-page-root" dir="rtl">

                {/* ── BREADCRUMB ── */}
                <div style={{
                    position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%',
                    borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px'
                }}>
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
                        <span style={{ color: '#374151', marginRight: '8px' }}>تدريب عن بعد ( اونلاين )</span>
                    </div>
                </div>

                {/* ── HERO ── */}
                <section className="ot-hero">
                    <div className="ot-hero-accent-bar" />
                    <div className="ot-hero-content">
                        <span className="ot-hero-eyebrow">تعلم بلا حدود جغرافية</span>
                        <h1 className="ot-hero-title">
                            التدريب عن بعد<br />
                            <em>( أونلاين )</em>
                        </h1>
                        <p className="ot-hero-body">
                            فى ظل حرص الشركة على رفع كفاءة العاملين وتزويدهم بالمعارف الجديدة، وفى ظل الظروف التى
                            يمر بها العالم، اتجه المعهد إلى تنفيذ عملية التدريب عن بعد معتمدًا على تكنولوجيا المعلومات
                            وآليات الاتصال الحديثة لكسر الحدود الجغرافية والزمنية.
                        </p>
                    </div>
                </section>

                {/* ── INTRO WITH IMAGE ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">
                            ما هو <span>التدريب عن بعد</span>
                        </h2>
                        <div className="ot-heading-bar" />

                        <div className="ot-intro-grid">
                            <div className="ot-intro-text">
                                <p className="ot-intro-p">
                                    هي عملية تدريبية تعتمد على تحديد الاحتياجات التدريبية وتصميم البرامج وتخطيط وادارة
                                    العملية التدريبية، إلا أنها تعتمد على تكنولوجيا المعلومات باستخدام آليات الاتصال الحديثة
                                    من حاسب وشبكاته ووسائطه المتعددة من صوت وصورة في التواصل بين المدرب والمتدربين
                                    والطاقم الإداري.
                                </p>
                                <p className="ot-intro-p">
                                    الهدف هو كسر الحدود الجغرافية والزمنية التي تعيق عمليات التدريب، واستخدام التقنية
                                    الإلكترونية بجميع أنواعها في إيصال المعلومة للمتعلم بأقصر وقت وأقل جهد وأكبر فائدة.
                                </p>
                            </div>
                            <div className="ot-intro-image">
                                <img
                                    src="https://www.arabcont.com/icemt/assets/images/online-training.jpg"
                                    alt="التدريب عن بعد"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── PROGRAMS ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">
                            أمثلة فعلية على <span>البرامج التدريبية عن بعد</span>
                        </h2>
                        <div className="ot-heading-bar" />

                        <div className="ot-programs-list">
                            {programs.map((program, index) => (
                                <div className="ot-program-card" key={index}>
                                    <div className="ot-icon">{program.icon}</div>
                                    <div className="ot-program-content">
                                        <h3 className="ot-program-title">
                                            <a href="#">{program.title}</a>
                                        </h3>
                                        <p className="ot-program-desc">{program.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}