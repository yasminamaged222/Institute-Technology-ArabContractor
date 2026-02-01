import React, { useState } from 'react';

export default function ICMETTests() {
    const [selectedImg, setSelectedImg] = useState(null);

    const externalClients = [
        { name: 'هيئة المجتمعات العمرانية', count: 226 },
        { name: 'شركة اليو مصر', count: 16 },
        { name: 'شركة دار المعمار DMC', count: 51 },
        { name: 'شركة منار الخليج', count: 181 },
        { name: 'شركة العربي', count: 655 }
    ];

    const internalTests = [
        'تعديل مهنة',
        'بدل حاسب',
        'ترقيات',
        'دواعى السفر للفروع الخارجية',
        'قادة المستقبل',
        'تعيين'
    ];

    const testTypes = [
        'قياسات سيكومترية ( القياسات الشخصية )',
        'قياسات أخري ( لغة - كمبيوتر- فني -.... )'
    ];

    const news = [
        'في اطار التعاون مع وزارة الاسكان والمرافق والمجتمعات العمرانية ، ولخلق كوادر للقيادات الشابة من موظفي هيئة المجتمعات العمرانية الجديدة ، تم تتقييم عدد 226 موظف لشغل وظيفة معاون نائب رئيس الهيئة او معاون رئيس جهاز مدينة ، حيث تم التقييم لمهارات ( اللغة – الحاسب الآلي – القياسات الشخصية والذكاءات ).',
        'نظرا لاسناد مشروعات جديدة للشركة وحرصا من قيادات الشركة لاتاحة فرص عمل لشباب المهندسين ، يجري حاليا عمل التقييمات اللازمة لتعيين عدد من المهندسين حديثي التخرج للانضمام لاسرة الشركة ، فتم خلال العام 2019-2020 عمل التقييمات لعدد 663 مهندس في تخصصات ( مدني – عمارة – ميكانكيكا – كهرباء – مساحة ) وذلك في قدرات ومهارات استخدام الحاسب الآلي ، وتحديد درجة اجادة اللغة ، بالاضافة الى تقييم معلومات التخصص و القياسات الشخصية والذكاءات.',
        'حرصا من المعهد على توفير سبل الراحة للسادة الممتحنين ، فقد تم تطوير معمل الاختبارات وتزويده باحدث اجهزة الحاسب الآلي وزيادة عددها لاستيعاب اعداد الممتحنين ، وذلك تحديث الاثاث المستخدم من مكاتب وكراسي.',
        'ايماناً من الشركة بأهمية اتاحة الفرصة للقيادات الشابة ، يتم عمل التقييمات لقادة المستقبل على مستوى الافرع والادارات المختلفة ، حيث يتم تقييم السادة المرشحين للانضمام لمجلس قادة المستقبل في مهارات ( اللغة – الحاسب الآلي – القياسات الشخصية والذكاءات) وتجرى التقييمات بصفة دورية ، و فيما يلي عرض موجز لمشروع قادة المستقبل.'
    ];

    return (
        <div className="rtl-layout" dir="rtl">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/earlyaccess/droidarabickufi.css');
        
        :root {
          --primary: #0865a8;
          --secondary: #f57c00;
          --accent: #000000;
          --dark: #000000;
          --light: #ffffff;
          --gold: #d4af37;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Droid Arabic Kufi', serif;
          background: #ffffff;
          color: var(--dark);
          line-height: 1.8;
        }

        .rtl-layout {
          text-align: right;
          direction: rtl;
          min-height: 100vh;
          padding-top: 130px; 
        }

        /* Hero Section */
        .hero-section {
          max-width: 1200px;
          margin: 1rem auto;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-title {
          font-family: 'Droid Arabic Kufi', serif;
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--primary);
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          display: inline-block;
          width: 100%;
          animation: fadeInScale 1s ease-out;
        }

        .hero-title::after {
          content: '';
          position: absolute;
          bottom: -15px;
          right: 50%;
          transform: translateX(50%);
          width: 120px;
          height: 5px;
          background: linear-gradient(90deg, transparent, var(--secondary), transparent);
          border-radius: 3px;
        }

        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .hero-description {
          font-size: 1.2rem;
          line-height: 2;
          color: var(--dark);
          margin-bottom: 1.5rem;
          padding: 2rem;
          background: #f9f9f9;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
          border-right: 5px solid var(--secondary);
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin: 4rem auto;
          max-width: 1200px;
          padding: 0 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem 1rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.8s ease-out;
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 5px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.5s ease;
        }

        .stat-card:hover::before { transform: scaleX(1); }

        .stat-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 70px rgba(8, 101, 168, 0.25);
        }

        .stat-icon {
          font-size: 2rem;
          color: var(--secondary);
          margin-bottom: 0.5rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .stat-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.3rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
        }

        /* Content Sections */
        .content-section {
          max-width: 1200px;
          margin: 5rem auto;
          padding: 0 2rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 4rem;
        }

        @media (max-width: 968px) {
          .content-grid { grid-template-columns: 1fr; }
        }

        .content-text { animation: fadeInRight 0.8s ease-out; }

        .content-image {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          position: relative;
          animation: fadeInUp 0.8s ease-out 0.2s both;
          cursor: pointer;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content-image img {
          width: 100%;
          height: 100%;
          object-fit: contain; /* Prevents zooming, fits perfectly */
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .content-image:hover img { transform: scale(1.05); }

        .list-container {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08);
          border: 1px solid #eee;
        }

        .custom-list { list-style: none; padding: 0; }

        .custom-list > li {
          margin-bottom: 1.5rem;
          padding-right: 2.5rem;
          position: relative;
          font-size: 1.1rem;
          animation: fadeInRight 0.6s ease-out both;
        }

        .custom-list > li::before {
          content: '✓';
          position: absolute;
          right: 0;
          top: 0;
          width: 28px;
          height: 28px;
          background: var(--secondary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .nested-list { list-style: none; margin-top: 1rem; padding-right: 1.5rem; }

        .nested-list li {
          margin-bottom: 0.8rem;
          padding-right: 2rem;
          position: relative;
          color: #333;
        }

        .nested-list li::before {
          content: '◆';
          position: absolute;
          right: 0;
          color: var(--primary);
        }

        /* Large Stats Section */
        .large-stats-section {
          background: var(--primary);
          padding: 3rem 2rem;
          position: relative;
          margin: 5rem 0;
        }

        .large-stats-title {
          font-family: 'Droid Arabic Kufi', serif;
          font-size: 2.8rem;
          color: white;
          margin-bottom: 2rem;
          font-weight: 700;
          text-align: center;
        }

        .large-stat-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .large-stat-icon { font-size: 3.5rem; color: var(--secondary); animation: bounce 2s ease-in-out infinite; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .large-stat-number { font-size: 6rem; font-weight: 900; color: white; }

        .large-stat-label { font-size: 2rem; color: white; font-weight: 600; }

        /* News Section */
        .news-section {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          margin-top: 3rem;
        }

        .news-item {
          padding: 2rem;
          margin-bottom: 2rem;
          background: #fcfcfc;
          border-radius: 16px;
          border-right: 4px solid var(--primary);
          position: relative;
          padding-right: 3rem;
          line-height: 2;
          animation: fadeInRight 0.6s ease-out both;
        }

        .news-item::before {
          content: '✓';
          position: absolute;
          right: 1rem;
          top: 2rem;
          width: 24px;
          height: 24px;
          background: var(--secondary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin: 4rem 0;
        }

        /* Modal Dialog Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        }

        .modal-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }

        .modal-content img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.5);
        }

        .close-modal {
            position: absolute;
            top: -40px;
            left: 0;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
          .image-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.5rem; }
        }
      `}</style>

            {/* Fixed Overview Bar - Exactly as requested */}
            <div className="top-100 fixed left-0 z-50 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2" style={{ top: '75px' }}>
                <div className="text-center">
                    <span className="text-base">
                        <a href="/" className="ml-3 text-gray-700 hover:text-gray-900">الصفحة الرئيسية</a>
                        <span className="text-gray-500">-</span>
                        <span className="mr-3 text-gray-700">الاختبارات</span>
                    </span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">الاختبارات</h1>
                <p className="hero-description">
                    تم انشاء قسم الاختبارات بالمعهد مواكبة لاحد النظم في اختيار الموارد البشرية وايماناً من الشركة بأهمية اختيار افضل العناصر لشغل الوظائف المختلفة بالشركة وفقاً للضوابط والمعايير المطلوبة لكل وظيفة
                </p>
                <p className="hero-description">
                    يعد معهد الإدارة والتكنولوجيا- المقاولون العرب واحد من أوائل المعاهد في جمهورية مصر العربية ، حيث يقوم هذا القسم  باجراء عدد كبير من الاختبارات المقننة الى العملاء الخارجيين طبقا للتعاقد وجميع الفروع والإدارات داخل الشركة
                </p>
            </section>

            {/* External Clients Stats */}
            <div className="stats-grid">
                {externalClients.map((client, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">📊</div>
                        <h3 className="stat-title">{client.name}</h3>
                        <div className="stat-number">{client.count}</div>
                    </div>
                ))}
            </div>

            {/* Internal Tests Section */}
            <section className="content-section">
                <div className="content-grid">
                    <div className="content-text">
                        <div className="list-container">
                            <ul className="custom-list">
                                <li>
                                    الاختبارات الخاصة بالعاملين بالشركة
                                    <ul className="nested-list">
                                        {internalTests.map((test, index) => (
                                            <li key={index}>{test}</li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="content-image" onClick={() => setSelectedImg('/images/test-01.jpg')}>
                        <img src="/images/test-01.jpg" alt="Testing facilities" />
                    </div>
                </div>

                <div className="image-grid">
                    <div className="content-image" onClick={() => setSelectedImg('/images/test-02.jpg')}>
                        <img src="/images/test-02.jpg" alt="Testing environment" />
                    </div>
                    <div className="content-image" onClick={() => setSelectedImg('/images/test-03.jpg')}>
                        <img src="/images/test-03.jpg" alt="Testing sessions" />
                    </div>
                </div>
            </section>

            {/* Large Stats Section */}
            <section className="large-stats-section">
                <div className="large-stats-content">
                    <h2 className="large-stats-title">ما تم اختباره في عام 2020-2021</h2>
                    <div className="large-stat-display">
                        <div className="large-stat-icon">👥</div>
                        <div className="large-stat-number">2315</div>
                        <div className="large-stat-label">مهندس</div>
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="content-section">
                <div className="news-section">
                    <h2 className="section-title" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '2rem', marginBottom: '20px' }}>من اخبار قسم الاختبارات</h2>
                    {news.map((item, index) => (
                        <div key={index} className="news-item">
                            {item}
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal Dialog */}
            {selectedImg && (
                <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal">&times;</span>
                        <img src={selectedImg} alt="Larger View" />
                    </div>
                </div>
            )}
        </div>
    );
}