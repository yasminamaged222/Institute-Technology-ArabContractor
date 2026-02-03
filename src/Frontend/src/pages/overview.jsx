import React from "react";
import './overview.css'
import { FaHardHat, FaCalendarAlt, FaUsers  , FaLaptop , FaGraduationCap , FaCogs} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Overview() {
    return (
        <div>
            
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>
                <span className="overview" style={{ position: 'relative', bottom: '5px' }}><a href="/" className="btn_go_home">الصفحة الرئيسية</a> - نبذة عامة</span>
            </div>


            <hr className="hr_style" />


            <div className="overview_intro" style={{ paddingTop: '100px' }}>
                <h1 className="h1_style">المعهد التكنولوجى لهندسة التشييد والإدارة</h1>
            </div>

            <div className="overview_intro">
                <p className="p_style">ايمانا من شركة المقاولون العرب بأهمية التدريب لتنمية المعارف والمهارات للموارد البشرية والتطوير والتحسين المستمر للكفاءات بإعتبارها احد دعائم التنمية لذا فقد كانت اولى شركات المقاولات فى منطقة الشرق الأوسط التى قامت بإنشاء معهد للتدريب منذ أكثر من 40 عاما لمواكبة التطورات المستمرة فى مجال التشييد والبناء</p>
            </div>


            <div className="section_2">
                <div className="section_2_inside">
                    <h1 style={{ textAlign: 'center' , fontSize:'30px' , fontWeight:"bold"}}>لدينا القدرة على عمل برامج تدريبة متنوعة منها</h1>
                    <div className="section_2_cards">
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">برامج للتدريب التحويلى</h3>
                        </div>
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">برامج لتكوين فرق التنفيذ الذاتى</h3>
                        </div>
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">وضع الحلول التدريبية المتكاملة للمشروعات</h3>
                        </div>
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">التدريب فى موقع العمل</h3>
                        </div>
                    </div>
                </div>
            </div>


            <div className="section_3">
                <div className="section_3_content">
                    <div className="cards_sec_3">
                        <div className="card_sec_3">
                            <h2 className="h1_card_sec3">أكثر من 60 عميل</h2>
                            <br />
                            <p className="p_sec_3">نساهم فى تطوير صناعة التشييد فنتيح لجميع الوزارات والهيئات الحكومية والخاصة أن تستفيد بإمكانيات الإدارة فى التدريب</p>
                        </div>

                        <div className="card_sec_3">
                            <h2 className="h1_card_sec3">أكثر من 2500 مادة تدريبية</h2>
                            <br />
                            <p className="p_sec_3">نمتلك العديد من المواد العلمية والتدريبية موضوعه من خلال مجموعة منتقاه من الخبراء وأساتذة الجامعات</p>

                        </div>

                        <div className="card_sec_3">
                            <h2 className="h1_card_sec3">بدأنا منذ 1978</h2>
                            <br />
                            <p className="p_sec_3">تم تأسيس المعهد التكنولوجى لهندسة التشييــد والإدارة في عام 1978 منذ أكثر من 40 عاما لمواكبة التطورات المستمرة فى مجال التشييد والبناء</p>
                        </div>
                    </div>
                </div>

            </div>


            <div className="section_4">
                <h1 className="h1_sec_4">اول دورة بالمعهد</h1>
                <br />
                <div className="content_sec_4">
                    <div className="cards_sec_4">
                        <div className="card_sec_4">
                            <div className="icon_sec_4">            
                                <FaUsers size={40} color="white" style={{ marginTop: '50px' }} />
                            </div>

                            <div className="content_icon_sec_4">
                                <h3 className="txt_content_icon_sec_4">اجمالى عدد المتدربين منذ انشاء المعهد وحتى الان</h3>
                                <h3 className="txt_content_icon_sec_4">176418 متدرب</h3>

                            </div>
                        </div>

                        <div className="card_sec_4">
                            <div className="icon_sec_4">            
                                <FaUsers size={40} color="white" style={{ marginTop: '50px' }} />
                            </div>

                            <div className="content_icon_sec_4">
                                <h3 className="txt_content_icon_sec_4">العدد</h3>
                                <h3 className="txt_content_icon_sec_4">مدرب 9</h3>

                            </div>
                        </div>

                        <div className="card_sec_4">
                            <div className="icon_sec_4">
                                <FaCalendarAlt size={40} color="white" style={{ marginTop: '50px' }} />
                            </div>

                            <div className="content_icon_sec_4">
                                <h3 className="txt_content_icon_sec_4">تاريخ انعقاد الدورة</h3>
                                <h3 className="txt_content_icon_sec_4">22/04/1978 من</h3>
                                <h3 className="txt_content_icon_sec_4">01/06/1978 الي</h3>

                            </div>

                        </div>

                        <div className="card_sec_4">
                            <div className="icon_sec_4">
                                <FaHardHat size={40} color="white" style={{ marginTop: '50px' }} />
                            </div>

                            <div className="content_icon_sec_4">
                                <h3 className="txt_content_icon_sec_4">دورة برامج الهندسة المدنية </h3>
                            </div>
                           
                        </div>

                    </div>
                </div>

            </div>


            <div className="section_5">
                <div className="content_sec_5">
                    <div className="h1_sec_5">
                        <h1 style={{fontFamily:"-apple-system" , fontSize:"50px" , textAlign:"center"}}>لماذا تشترك بمعهد التدريب</h1>
                    </div>

                    <div className="cards_sec_5">
                        <div className="card_sec_5"> 
                            <div className="div_icon">
                                <FaCogs className="my-custom-class" style={{ fontSize: '50px', color: '#ECB22F' }} />
                            </div>

                            <div className="div_title">
                                <h2 style={{fontFamily:"-apple-system" , fontSize:"25px"}}>خدمات متميزة</h2>
                            </div>

                            <div className="div_dis">
                                <p className="div_dis_txt">نقدم مجموعة من الخدمات منها البرامج التدريبية ومدارس التعليم الفنى والتدريب للشركات والجهات الحكومية</p>
                            </div>
                        </div>  




                        <div className="card_sec_5">  
                            <div className="div_icon">
                                <FaUsers className="my-custom-class" style={{ fontSize: '50px', color: '#ECB22F' }} />
                            </div>

                            <div className="div_title">
                                <h2 style={{fontFamily:"-apple-system" , fontSize:"25px"}}>مجموعة متميزة من المدربين</h2>
                            </div>

                            <div className="div_dis">
                                <p className="div_dis_txt">نعتمد على الخبرات والكفاءات البشرية الفريدة التي تتسم بقدر عالي من المهارات والقدرات</p>
                            </div>
                        </div>  




                        <div className="card_sec_5">  
                            <div className="div_icon">
                                <FaGraduationCap className="my-custom-class" style={{ fontSize: '50px', color: '#ECB22F' }} />
                            </div>

                            <div className="div_title">
                                <h2 style={{fontFamily:"-apple-system", fontSize:"25px"}}>مجموعة من الشهادات المعتمدة</h2>
                            </div>

                            <div className="div_dis">
                                <p className="div_dis_txt">حاصلين على شهادة الجودة منذ عام 2000 في مجال تصميم وإدارة وتنفيذ الخدمات التدريبية والتقييم والاختبارات مع تحديثها سنويا وحتي أخر إصدار لها (ISO9001:2015) كما تم إعتماد المعهد التكنولوجي لهندسة التشييد والإدارة من معهد إدارة الأعمال (PMI)</p>
                            </div>
                        </div>  




                        <div className="card_sec_5">  
                            <div className="div_icon">
                                <FaLaptop className="my-custom-class" style={{ fontSize: '50px', color: '#ECB22F' }} />
                            </div>

                            <div className="div_title">
                                <h2 style={{fontFamily:"-apple-system", fontSize:"25px"}}>جودة الخدمات التدريبية</h2>
                            </div>

                            <div className="div_dis">
                                <p className="div_dis_txt">الجودة تعني التميز في تقديم الخدمات المطلوبة بفاعلية بحيث تكون خالية من الأخطاء والعيوب، وتقدم بأقل تكلفة، وترقى لمستوى توقعات ورغبات المستفيدين، وتحقق رضاهم التام حاضراً ومستقبلاً</p>
                            </div>
                        </div>  
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Overview;