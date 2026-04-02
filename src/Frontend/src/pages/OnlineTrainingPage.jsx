import React from 'react';
import { useEffect } from 'react';

export default function OnlineTrainingPage() {
    const programs = [
        {
            title: 'برنامج Project Management Professional (PMP)',
            description: 'وهو برنامج إدارة المشاريع الإحترافية (PMP) الذي اصبح الآن متوفر أون لاين تحت اشراف طقم ادارى متخصص (تدريب عن بعد) مما يتيح تنفيذ العملية اون لاين، بحيث تتمكن من الإستفسار عن أي نقطة أو تساؤل أثناء مشاهدة المادة وحضور البرنامج وايضا الاستفادة بالحصول على مقاطع فيديو متعددة تشرح مادة إدارة المشاريع الإحترافية (PMP) مبنيةً على آخر إصدار من كتاب و منهجية إدارة المشاريع الإحترافية PMBOK  وايضا امثلة من الاختبارات للمساعدة في تأكيد المعلومات الواردة في كل وحدة وفور اكتمال حضور المتدرب ثلاثة اسابيع بواقع 45 ساعة تدريبية واجتيازه تقييم كل اسبوع من الاسابيع الثلاثة بنجاح يحصل على شهادة من المعهد كجهة معتمدة من معهد ادارة المشروعات الامريكى PMI ويمكنه بذلك التقدم لإختبار إدارة المشاريع الإحترافية (PMP).'
        },
        {
            title: 'القيادة التنفيذية',
            description: 'وهى ندوة اليوم الواحد حيث تم تنظيمها باستخدام تكنولوجيا الاتصالات عن بعد حيث يتم حضور المتدربين الندوة عن بعد والاستفادة من المادة العلمية التى يلقيها المحاضر وتشمل (الانماط المختلفة للقيادة - اساليب القيادة الفعالة)'
        },
        {
            title: 'عقود الفيديك',
            description: 'وهى ندوة تعقد لمدة يومين للمهتمين بتفاصيل العقود الخاصة بالمشروعات أو مدير مشروع أو مسئول التعاقدات حيث تحتوى الندوة على فكرة عامة عن عقود الفيديك وشروطه والبنود المتعلقة بالوقت به والبنود المتعلقة بالتغيرات والمطالبات والبنود المتعلقة بدفع المستحقات وايضا تسوية النزاعات فى عقود الفيديك ويتم تنفيذها ايضا عن بعد'
        },
        {
            title: 'اساليب تحليل المشكلات واتخاذ القرارات',
            description: 'وهى ندوة لمدة يومين تتيح للمتدرب حل المشكلات واتخاذ القرارات والتى تنظم طريقة تفكير المتدرب عند مواجهة المشكلات فى جميع نواحي الحياة العملية ومن خلالها يستطيع المتدرب التعرف على الطرق العلمية المنظمة لحل المشكلات واتخاذ القرارات بداية من الاسلوب الادارى فى تحليل وحل المشكلات ثم معرفة انماط المديرين فى حل المشكلات الى ان يتم الإتفاق على افضل القرارات لتطبيقها ووضع ورقة عمل لتنفيذها ومتابعتها وتقييم فاعليته ويتم تنفيذها ايضا عن بعد'
        },
        {
            title: 'برنامجى السلامة والجودة للمهندسين المرشحين للترقى',
            description: 'وفى اطار حرص الشركة لتزويد العاملين بها بالمعرفة الكاملة بأسس السلامة والصحة المهنية ومتطلبات الجودة بالشركة فقد حرصت على ضرورة حضور المهندسين المرشحين للترقى لبرنامجى السلامة والجودة مما يتيح للمهندسين الحاضرين لتلك البرامج التعامل مع متطلبات السلامة من حيث (مهمات الحماية الشخصية – دليل و خطة السلامة والصحة المهنية للمشروعات - خطة الاستجابة للطوارئ والحريق - تصاريح الاعمال الخطرة - تحليل مؤشرات الحوادث والاصابات والامراض المهنية - تقييم المخاطر - ترتيب ونظافة مواقع العمل) وايضا لتحقيق اعلى جودة من حيث (التعريفات الهامة والتطور التاريخى للجودة  - المواصفات الدولية الأيزو) ويتم تنفيذها ايضا عن بعد'
        }
    ];

    useEffect(() => {
        document.title = '      التدريب عن بعد ( اونلاين ) - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <div className="min-h-screen bg-white" dir="rtl" style={{ margin: 0, padding: 0 }}>
            {/* Header */}
           
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>تدريب عن بعد ( اونلاين )</span>
                </div>
            </div>
            {/* Main Content */}
            <div style={{ margin: 0, padding: 0, paddingTop: '60px' }}>
                {/* Online Training Section */}
                <section className="bg-white" style={{ margin: 0, padding: 0 }}>
                    <div style={{
                        margin: 0,
                        padding: '40px 20px',
                        maxWidth: '100%'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
                            gap: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '60px' : window.innerWidth >= 768 ? '40px' : '0',
                            alignItems: 'start',
                            textAlign: 'right',
                            margin: 0,
                            padding: 0
                        }}>
                            <div style={{ margin: 0, padding: 0 }}>
                                <h3 style={{
                                    marginBottom: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '24px' : '16px',
                                    marginTop: 0,
                                    fontSize: window.innerWidth >= 1920 ? '28px' : window.innerWidth >= 1360 ? '24px' : window.innerWidth >= 768 ? '22px' : '20px',
                                    fontWeight: 'bold',
                                    padding: 0
                                }}>
                                    التدريب عن بعد ( اونلاين )
                                </h3>
                                <p style={{
                                    lineHeight: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '1.9' : '1.7',
                                    color: '#374151',
                                    margin: 0,
                                    padding: 0,
                                    fontSize: window.innerWidth >= 1920 ? '25px' : window.innerWidth >= 1360 ? '16px' : window.innerWidth >= 768 ? '20px' : '14px'
                                }}>
                                    فى ظل حرص الشركة على رفع كفاءة العاملين و تزويدهم بالمعارف الجديدة من خلال حضورهم برامج تدريبية متنوعة فى مجال عملهم وفى ظل الظروف التى يمر بها العالم من تبعات جائحة كورونا مما ترتب عليه ضرورة التباعد الاجتماعى مما ادى الى ضرورة الاتجاه الي تنفيذ عملية التدريب عن بعد ، وهي عملية تدريبية تعتمد على تحديد الاحتياجات التدريبية وتصميم البرامج وتخطيط وادارة العملية التدريبية ، الا أنه يعتمد على تكنولوجيا المعلومات باستخدام آليات الاتصال الحديثة من حاسب وشبكاته ووسائطه المتعددة من صوت وصورة في التواصل بين المدرب والمتدربين والطاقم الاداري بهدف كسر الحدود الجغرافية والزمنية التي تعيق عمليات التدريب، و استخدام التقنية الالكترونية بجميع أنواعها في إيصال المعلومة للمتعلم بأقصر وقت وأقل جهد وأكبر فائدة
                                </p>
                            </div>
                            <div style={{
                                marginTop: window.innerWidth >= 768 ? 0 : '20px',
                                paddingLeft: 0,
                                margin: 0
                            }}>
                                <img
                                    src="https://www.arabcont.com/icemt/assets/images/online-training.jpg"
                                    style={{
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        margin: 0,
                                        padding: 0,
                                        display: 'block'
                                    }}
                                    alt="التدريب عن بعد"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section className="bg-white" style={{ margin: 0, padding: 0 }}>
                    <div style={{
                        margin: 0,
                        padding: '40px 20px',
                        textAlign: 'right'
                    }}>
                        <h3 style={{
                            marginBottom: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '32px' : '24px',
                            marginTop: 0,
                            fontSize: window.innerWidth >= 1920 ? '26px' : window.innerWidth >= 1360 ? '22px' : window.innerWidth >= 768 ? '20px' : '18px',
                            fontWeight: 'bold',
                            padding: 0
                        }}>
                            ومن الامثلة الفعلية التى قام المعهد التكنولوجى لهندسة التشييد والادارة التابع لشركة المقاولون العرب بتنظيم برامج تدريبية باستخدام التدريب عن بعد كالتالى :
                        </h3>

                        <div style={{ margin: 0, padding: 0 }}>
                            {programs.map((program, index) => (
                                <div
                                    key={index}
                                    style={{
                                        borderBottom: index !== programs.length - 1 ? '1px solid #e5e7eb' : 'none',
                                        paddingBottom: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '28px' : '20px',
                                        marginBottom: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '28px' : '20px',
                                        margin: 0,
                                        marginBottom: index !== programs.length - 1 ? (window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '28px' : '20px') : 0
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        gap: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '20px' : '16px',
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        <div style={{
                                            flexShrink: 0,
                                            paddingTop: '4px',
                                            margin: 0
                                        }}>
                                            <span style={{
                                                display: 'flex',
                                                height: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '28px' : '24px',
                                                width: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '28px' : '24px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                backgroundColor: '#dcfce7',
                                                color: '#16a34a',
                                                margin: 0,
                                                padding: 0
                                            }}>
                                                <svg style={{
                                                    height: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '18px' : '16px',
                                                    width: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '18px' : '16px'
                                                }} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div style={{ flex: 1, margin: 0, padding: 0 }}>
                                            <h5 style={{
                                                marginBottom: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '12px' : '8px',
                                                marginTop: 0,
                                                fontSize: window.innerWidth >= 1920 ? '20px' : window.innerWidth >= 1360 ? '18px' : window.innerWidth >= 768 ? '17px' : '16px',
                                                fontWeight: 'bold',
                                                padding: 0
                                            }}>
                                                <a href="#" style={{
                                                    color: '#1d4ed8',
                                                    textDecoration: 'none'
                                                }}
                                                    onMouseEnter={(e) => e.target.style.color = '#1e3a8a'}
                                                    onMouseLeave={(e) => e.target.style.color = '#1d4ed8'}>
                                                    {program.title}
                                                </a>
                                            </h5>
                                            <p style={{
                                                lineHeight: window.innerWidth >= 1360 && window.innerWidth <= 1920 ? '1.9' : '1.7',
                                                color: '#374151',
                                                margin: 0,
                                                padding: 0,
                                                fontSize: window.innerWidth >= 1920 ? '17px' : window.innerWidth >= 1360 ? '15px' : window.innerWidth >= 768 ? '14px' : '13px'
                                            }}>
                                                {program.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}