import React from "react";
import './vision_goals.css'
import { FaHardHat, FaCalendarAlt, FaUsers, FaLaptop, FaGraduationCap, FaCogs } from 'react-icons/fa';
import img2 from '../../assets/img2.jpg';
import img1 from '../../assets/img1.jpg';




function Vision_goals() {
    return (

        <div>
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>
                <span className="overview" style={{ position: 'relative', bottom: '5px' }}><a href="/" className="btn_go_home">الصفحة الرئيسية</a> - الرؤية والأهداف</span>
            </div>


            <hr className="hr_style" />

            <div className="container">



                <div className="content-wrapper" style={{marginTop:"20px"}}>
                    {/* Main Grid - 2 columns */}
                    <div className="main-grid">
                        {/* Left Column */}
                        <div className="left-column">
                            {/* Top Image with Vision and Mission */}
                            <div className="image-container">
                                <img
                                    src={img1}
                                    alt="Vision and Mission"
                                    className="main-image"
                                />
                                <div className="image-overlay">
                                    <h1 className="overlay-title">Vision and Mission</h1>
                                </div>
                            </div>

                            {/* Strategy Section */}
                            <div className="strategy-section">
                                <h2 className="section-title text-center">إستراتيجية العمل</h2>

                                <div className="strategy-items">
                                    {/* Strategy Item 1 */}
                                    <div className="strategy-item">
                                        <div className="icon-box">
                                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="strategy-text text-right">
                                            إعداد الخبراء بين المعلمين من خلال توفير بيئة متميزة و داعمة بتمورهم بالمهارات والاستراتيجيات الحديثة والمعلومات الجامعية
                                        </p>
                                    </div>

                                    {/* Strategy Item 2 */}
                                    <div className="strategy-item">
                                        <div className="icon-box">
                                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                            </svg>
                                        </div>
                                        <p className="strategy-text text-right">
                                            الارتقاء بالأداء التعليمي من خلال التعليم التقني و التطوير للاستفادة في خدمة تحقيق المنافسة منظمة في خدمة المشاريع التنموية
                                        </p>
                                    </div>

                                    {/* Strategy Item 3 */}
                                    <div className="strategy-item">
                                        <div className="icon-box">
                                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                            </svg>
                                        </div>
                                        <p className="strategy-text text-right">
                                            تعزيز دور المعهد من خلال تقديم برامج و خدمات و دراسات متميزة تساهم و تساعد مختلف القطاعات الخدمية و التجارية في تحقيق نمو العمل
                                        </p>
                                    </div>

                                    {/* Strategy Item 4 */}
                                    <div className="strategy-item">
                                        <div className="icon-box">
                                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                            </svg>
                                        </div>
                                        <p className="strategy-text text-right">
                                            تضمن خلف الخصائص بواقع محمي الحاوية و القيادة الصناعية ومواءمة الخلية الاجتماعية من خلال نمو العمل التوعوي
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="right-column">
                            {/* الرؤية (Vision) */}
                            <div className="vision-section">
                                <h2 className="section-title text-right">الرؤية</h2>
                                <p className="text-content text-right">
                                    تحقيق الريـــادة فــي التعلــيم والتدريب المهني محلياً وإقليمياً، وتوفير الدعم التدريس للعاملين بالشركة
                                </p>
                            </div>

                            {/* الرسالة (Mission) */}
                            <div className="mission-section">
                                <h2 className="section-title text-right">الرسالة</h2>
                                <p className="text-content text-right">
                                    إعـــداد وتأهيل أجيال من الكفاءات المهنية المتميزة تلبية لمتطلبات قطاعات الشركة لكي يصرح العمل من جان موائمة تقنية بمتابعة تطبيق أفضل المعايير الجودة الشاملة
                                </p>
                            </div>

                            {/* Bottom Image */}
                            <div className="image-container">
                                <img
                                    src={img2}
                                    alt="Mission Image"
                                    className="main-image"
                                    style={{ height: "350px" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="goals-container">
                <div className="goals-wrapper">
                    {/* Top Section - Two Boxes Side by Side */}
                    <div className="top-boxes">
                        {/* Box 1 */}
                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                التعاون مع منظمات الأعمال الوطنية لتحديد متطلبات القطاع وتوفير فرص العمل مباشرة
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                العمل في تأمين من المعايير الدولية للمناهج التعليمية وإعتمادها من المنظمات الدولية
                            </p>
                        </div>
                    </div>

                    {/* Goals Title */}
                    <div className="goals-title-section">
                        <h2 className="goals-title">الأهداف</h2>
                        <p className="goals-subtitle">
                            يهدف المعهد لتطوير مستوى العاملين من خلال:
                        </p>
                    </div>

                    {/* Bottom Section - Three Boxes */}
                    <div className="bottom-boxes">
                        {/* Box 3 */}
                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                تنمية قدرة الخريجين مع المهارات ذات الصلة بعد تحليل متطلبات المجتمع والقطاع الصناعي
                            </p>
                        </div>

                        {/* Box 4 */}
                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                ربط المسار المهني بالممارسة و المبادئ النظرية بالحقيقة التطبيق العملية
                            </p>
                        </div>

                        {/* Box 5 */}
                        <div className="goal-box">
                            <div className="goal-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="goal-text">
                                رصد و تأهيل قيادات الصف الثاني بالشركة (قادة مستقبليون)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>





    );
}

export default Vision_goals;