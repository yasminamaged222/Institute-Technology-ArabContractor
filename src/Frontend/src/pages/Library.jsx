import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Search, Calendar, Tag, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Clock, Award, Star, Globe, Users, Building } from 'lucide-react';

export default function ModernLibrary() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

    useEffect(() => {
        document.title = 'المكتبة - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress((window.scrollY / total) * 100);
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('scroll', handleScroll); };
    }, []);

    const isMobile = windowWidth <= 640;
    const isTablet = windowWidth <= 1024 && windowWidth > 640;

    const stats = [
        { icon: BookOpen, label: 'كتاب متاح', value: '4200+', color: '#0865a8' },
        { icon: TrendingUp, label: 'مجال علمي', value: '23', color: '#f57c00' },
        { icon: Clock, label: 'مادة علمية', value: '2500+', color: '#0865a8' },
        { icon: Award, label: 'سنوات خبرة', value: '55+', color: '#f57c00' }
    ];

    const features = [
        { text: "تضم المكتبة أكثر من 4200 كتاب في جميع مجالات العلوم الهندسية (مدنية – معمارية – ميكانيكا – كهرباء – صحي – مساحة – طرق – مائية) إلى جانب العلوم الأخرى (الإدارة – الاقتصاد – القانون – المحاسبة – السلامة والصحة المهنية – البيئة – الحاسب الآلي).", color: '#0865a8' },
        { text: "تحتوي المكتبة على أكثر من 2500 مادة علمية متخصصة تغطي 23 مجالاً وفق مصفوفة المجالات التدريبية، تم إعدادها من قبل خبراء الشركة بهدف نقل الخبرات المختلفة إلى جميع العاملين.", color: '#f57c00' },
        { text: "جميع كتب المكتبة مصنفة وفقاً لتصنيف ديوي العشري العالمي، مع قاعدة بيانات متكاملة تتيح أنظمة البحث والاسترجاع لجميع المستفيدين.", color: '#0865a8' },
        { text: "تصدر المكتبة أدلة علمية متخصصة يُعدّها المتخصصون في مجالات الهندسة المدنية والعمارة والميكانيكا والمساحة والهندسة الصحية والمهارات الإدارية والمالية.", color: '#f57c00' }
    ];

    const platforms = [
        { name: 'Le Moniteur', icon: Globe, desc: 'منصة الإنشاء والبناء الفرنسية' },
        { name: 'Global Tenders', icon: TrendingUp, desc: 'منصة المناقصات العالمية' },
        { name: 'Construct Africa', icon: Building, desc: 'منصة التشييد الأفريقية' },
        { name: 'بوابة قوانين الشرق', icon: BookOpen, desc: '5 منظومات قانونية متخصصة لـ 3 إدارات' }
    ];

    const embassyServices = [
        { title: 'مستودع الأصول الرقمية DAR', value: '509,089', unit: 'وعاء رقمي', icon: '🗄️', desc: 'يشمل كافة التخصصات العلمية في شتى فروع المعرفة البشرية' },
        { title: 'أرشيف الصحافة المصرية', value: '17,500,000', unit: 'مقالة صحفية', icon: '📰', desc: 'باللغات العربية والإنجليزية والفرنسية على مدار 67 عاماً (1950–2017)' },
        { title: 'صور ووثائق تاريخية', value: '2,052', unit: 'صورة', icon: '🖼️', desc: 'وثائق وصور تاريخية نادرة' },
        { title: 'ملفات صوتية', value: '2,447', unit: 'ملف', icon: '🎧', desc: 'فيديوهات وتسجيلات صوتية متخصصة' },
        { title: 'الخرائط الرقمية', value: '2,777', unit: 'خريطة', icon: '🗺️', desc: 'خرائط من مختلف العصور' },
        { title: 'ذاكرة مصر المعاصرة', value: '1805–1981', unit: 'فترة تاريخية', icon: '🏛️', desc: 'من عهد محمد علي حتى نهاية عصر الرئيس السادات' }
    ];

    const subscriptionInfo = [
        { label: 'خدمات لموظفي الشركة', value: 'مجاناً', color: '#0865a8' },
        { label: 'اشتراك شهري (خارجي)', value: '40 جنيه', color: '#f57c00' },
        { label: 'اشتراك سنوي (خارجي)', value: '400 جنيه', color: '#0865a8' },
        { label: 'حد الاستعارة', value: '3 كتب / 15 يوم', color: '#f57c00' },
    ];

    const books = [
        { title: "Capture and reuse of project knowledge in construction", publisher: "Willy-Blackwell", image: "https://www.arabcont.com/icemt/assets/images/Book01.jpg", url: "https://online.fliphtml5.com/cvhml/vzfl/#p=1", color: '#0865a8' },
        { title: "ICE manual of highway design and management", publisher: "Second Edition", image: "https://www.arabcont.com/icemt/assets/images/Book02.jpg", url: "https://online.fliphtml5.com/cvhml/qzxx/#p=1", color: '#f57c00' },
        { title: "Construction Dewatering and Groundwater Control", publisher: "Third Edition", image: "https://www.arabcont.com/icemt/assets/images/Book03.jpg", url: "https://online.fliphtml5.com/cvhml/wdbx/#p=1", color: '#0865a8' }
    ];

    const galleryImages = [
        { src: "https://www.arabcont.com/icemt/assets/images/library-02.jpg", caption: "مبنى المعهد التكنولوجي لهندسة التشييد والإدارة" },
    ];

    const embassyGoals = [
        'تطوير مهارات البحث العلمي لرواد السفارة',
        'تشجيع التعلم الذاتي وتنمية المهارات في شتى المجالات',
        'تنظيم ورش عمل تفاعلية في مجالات علمية وأدبية وفنية',
        'ربط المكتبة بالتدريب وتطوير المنظومة التدريبية',
        'تزويد المتدربين بأحدث الكتب والمراجع العلمية',
        'البث المباشر للفعاليات والمؤتمرات من مكتبة الإسكندرية'
    ];

    const sectionStyle = (bg = 'white') => ({ padding: isMobile ? '40px 16px' : '80px 32px', background: bg });
    const containerStyle = { maxWidth: '1400px', margin: '0 auto' };
    const sectionHeaderStyle = { textAlign: 'center', marginBottom: '48px' };
    const sectionTitleStyle = { fontSize: isMobile ? '28px' : '38px', fontWeight: '800', color: '#000', marginBottom: '12px' };
    const sectionSubStyle = { fontSize: '17px', color: '#6b7280' };
    const cardBase = { background: 'white', borderRadius: '20px', border: '2px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };

    return (
        <div style={{ minHeight: '100vh', background: 'white', fontFamily: '"Droid Arabic Kufi", serif', direction: 'rtl' }}>
            {/* Progress bar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: '#e5e7eb', zIndex: 9999 }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right, #f57c00, #0865a8)', width: `${scrollProgress}%`, transition: 'width 0.3s ease' }} />
            </div>

            {/* Nav */}
            <div style={{ position: 'fixed', top: 4, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Droid Arabic Kufi", serif', fontSize: '1rem' }}>
                    <a href="/" style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الصفحة الرئيسية</a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151' }}>المكتبة</span>
                </div>
            </div>

            {/* Hero */}
            <section style={{ ...sectionStyle('white'), paddingTop: isMobile ? '80px' : '120px', textAlign: 'center' }}>
                <div style={containerStyle}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', background: 'linear-gradient(135deg, #0865a8, #f57c00)', borderRadius: '28px', marginBottom: '28px', boxShadow: '0 16px 48px rgba(8,101,168,0.35)' }}>
                        <BookOpen style={{ width: '48px', height: '48px', color: 'white' }} />
                    </div>
                    <h1 style={{ fontSize: isMobile ? '36px' : '60px', fontWeight: '800', color: '#000', marginBottom: '16px' }}>المكتبة الرئيسية</h1>
                    <div style={{ width: '180px', height: '5px', background: '#e5e7eb', borderRadius: '999px', margin: '0 auto 24px', overflow: 'hidden' }}>
                        <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #0865a8, #f57c00)', borderRadius: '999px', animation: 'slide 2s infinite ease-in-out' }} />
                    </div>
                    <p style={{ fontSize: isMobile ? '15px' : '19px', color: '#6b7280' }}>مكتبة متخصصة في التشييد والبناء • تأسست 1970 • سفارة معرفة مكتبة الإسكندرية</p>
                </div>
            </section>

            {/* Stats */}
            <section style={sectionStyle('#f9fafb')}>
                <div style={containerStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '20px' }}>
                        {stats.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} style={{ ...cardBase, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={26} color="white" />
                                    </div>
                                    <div style={{ fontSize: isMobile ? '26px' : '32px', fontWeight: '800', color: '#000' }}>{s.value}</div>
                                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{s.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* About */}
            <section style={sectionStyle('white')}>
                <div style={containerStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', border: '2px solid #0865a8', borderRadius: '999px', color: '#0865a8', fontSize: '14px', marginBottom: '20px' }}>
                                <Sparkles size={15} /> نبذة عن المكتبة
                            </div>
                            <h2 style={sectionTitleStyle}>مكتبة متخصصة منذ 1970</h2>
                            <p style={{ fontSize: isMobile ? '15px' : '17px', color: '#4b5563', lineHeight: '1.9', marginBottom: '28px' }}>
                                تأسست المكتبة الرئيسية للمعهد عام 1970، وهي مكتبة متخصصة في مجال التشييد والبناء، إيماناً من شركة المقاولون العرب بأهمية القراءة والاطلاع المستمر ومعرفة كل ما هو حديث في سوق العمل. تقدم خدماتها للمجتمع الداخلي والخارجي على حد سواء.
                            </p>
                            {['محتوى محدث باستمرار', 'تغطية شاملة لجميع التخصصات', 'وصول سهل وسريع للمعلومات'].map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', border: `2px solid ${i % 2 === 0 ? '#0865a8' : '#f57c00'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Check size={18} color={i % 2 === 0 ? '#0865a8' : '#f57c00'} />
                                    </div>
                                    <span style={{ color: '#000', fontSize: '15px' }}>{t}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderRadius: '20px', overflow: 'hidden', border: '3px solid #e5e7eb', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                            <img src="https://www.arabcont.com/icemt/assets/images/library-02.jpg" alt="المكتبة" style={{ width: '100%', height: isMobile ? '260px' : '380px', objectFit: 'cover', display: 'block' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={sectionStyle('#f9fafb')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>مميزات المكتبة</h2>
                        <p style={sectionSubStyle}>اكتشف ما يميز مكتبتنا</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
                        {features.map((f, i) => (
                            <FeatureCard key={i} feature={f} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscription */}
            <section style={sectionStyle('white')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>خدمات واشتراكات المكتبة</h2>
                        <p style={sectionSubStyle}>خدمات متنوعة للعاملين والباحثين</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        {subscriptionInfo.map((s, i) => (
                            <div key={i} style={{ ...cardBase, textAlign: 'center' }}>
                                <div style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: s.color, marginBottom: '8px' }}>{s.value}</div>
                                <div style={{ fontSize: '13px', color: '#6b7280' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            { title: 'خدمة البحث والاسترجاع', desc: 'البحث في قاعدة البيانات عن الكتب العلمية وفق احتياجات المستفيد من خلال استمارة خدمات المستفيدين.', icon: Search },
                            { title: 'خدمة الاستعارة والاطلاع', desc: 'استعارة حتى 3 كتب لمدة 15 يوماً للعاملين، والاطلاع داخل المكتبة لجميع المشتركين.', icon: BookOpen },
                            { title: 'الاستفسارات والتصوير', desc: 'الرد على الاستفسارات عبر الهاتف أو البريد الإلكتروني Library@arabcont.com وخدمة التصوير بحد 20 صفحة.', icon: Users }
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} style={{ ...cardBase, textAlign: 'right' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: i % 2 === 0 ? '#0865a8' : '#f57c00', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', marginRight: 'auto', marginLeft: 0 }}>
                                        <Icon size={22} color="white" />
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>{s.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.7' }}>{s.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Platforms */}
            <section style={sectionStyle('#f9fafb')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>المنصات والمواقع الإلكترونية</h2>
                        <p style={sectionSubStyle}>اشتراكات في منصات علمية متخصصة</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                        {platforms.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <div key={i} style={{ ...cardBase, display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: i % 2 === 0 ? 'rgba(8,101,168,0.1)' : 'rgba(245,124,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={22} color={i % 2 === 0 ? '#0865a8' : '#f57c00'} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>{p.name}</h3>
                                        <p style={{ fontSize: '14px', color: '#6b7280' }}>{p.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Knowledge Embassy Section */}
            <section style={{ ...sectionStyle('white'), borderTop: '4px solid #0865a8' }}>
                <div style={containerStyle}>

                    {/* 1. تعريف سفارة المعرفة */}
                    <div style={sectionHeaderStyle}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 22px', background: 'linear-gradient(135deg, #0865a8, #f57c00)', borderRadius: '999px', color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '20px' }}>
                            <Star size={16} /> أول سفارة معرفة لشركة مقاولات في مصر
                        </div>
                        <h2 style={sectionTitleStyle}>سفارة المعرفة — مكتبة الإسكندرية</h2>
                    </div>

                    {/* تعريف */}
                    <div style={{ ...cardBase, marginBottom: '32px', borderRight: '5px solid #0865a8', textAlign: 'right' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0865a8', marginBottom: '12px' }}>تعريف سفارة المعرفة</h3>
                        <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.9' }}>
                            تسعى مكتبة الإسكندرية الجديدة إلى استعادة روح الانفتاح والبحث التي ميّزت المكتبة القديمة، فهي ليست مكتبة فحسب، بل مجمع ثقافي يقوم على نشر العلم والمعرفة. وتتلخص رسالتها في أن تكون مركزاً للتميز في إنتاج ونشر المعرفة، ومكاناً للتفاعل بين الشعوب والحضارات.
                        </p>
                    </div>

                    {/* 2. مفهوم سفارات المعرفة */}
                    <div style={{ ...cardBase, marginBottom: '32px', borderRight: '5px solid #f57c00', textAlign: 'right' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f57c00', marginBottom: '12px' }}>مفهوم سفارات المعرفة</h3>
                        <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.9', marginBottom: '16px' }}>
                            في عام <strong>2014</strong> جاء التفكير في إنشاء سفارات لمكتبة الإسكندرية في جميع المحافظات، حتى تتمكن المكتبة من تخطي البُعد الجغرافي والتوسع لتوصيل خدماتها إلى أكبر عدد ممكن من المستفيدين.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <div style={{ background: 'rgba(8,101,168,0.08)', border: '2px solid rgba(8,101,168,0.2)', borderRadius: '14px', padding: '14px 22px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#0865a8' }}>24</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>سفارة معرفة حالياً</div>
                            </div>
                            <div style={{ background: 'rgba(245,124,0,0.08)', border: '2px solid rgba(245,124,0,0.2)', borderRadius: '14px', padding: '14px 22px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#f57c00' }}>2014</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>سنة التأسيس</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.05)', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '14px', padding: '14px 22px', textAlign: 'center', flex: 1, minWidth: '180px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#000', lineHeight: '1.5' }}>سفارة المعرفة للمكتبة الرئيسية لشركة المقاولون العرب هي <span style={{ color: '#0865a8' }}>أول سفارة معرفة لإحدى كبرى شركات المقاولات</span></div>
                            </div>
                        </div>
                    </div>

                    {/* 3. أهداف سفارات المعرفة */}
                    <div style={{ ...cardBase, marginBottom: '32px', background: 'rgba(8,101,168,0.02)', border: '2px solid rgba(8,101,168,0.12)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0865a8', marginBottom: '20px', textAlign: 'center' }}>أهداف سفارات المعرفة ودورها داخل مكتبة المعهد</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                            {embassyGoals.map((g, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: i % 2 === 0 ? '#0865a8' : '#f57c00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                        <Check size={13} color="white" />
                                    </div>
                                    <span style={{ fontSize: '14px', color: '#1a1a1a', lineHeight: '1.75' }}>{g}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    <InaugurationGallery isMobile={isMobile} />

                    {/* 4. الخدمات المعرفية — موقع سفارة المعرفة الرقمي */}
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#000', textAlign: 'center', marginBottom: '8px' }}>الخدمات المعرفية التي تقدمها سفارة المعرفة بالمعهد</h3>
                    <p style={{ fontSize: '15px', color: '#6b7280', textAlign: 'center', marginBottom: '28px' }}>يضم موقع سفارة المعرفة الرقمي لمكتبة الإسكندرية الأقسام الآتية</p>

                    {/* DAR */}
                    <div style={{ ...cardBase, marginBottom: '20px', borderTop: '4px solid #0865a8', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0865a8', margin: 0 }}>مستودع الأصول الرقمية DAR</h4>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: '#0865a8', background: 'rgba(8,101,168,0.08)', padding: '4px 14px', borderRadius: '10px' }}>509,089 وعاء رقمي</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8', marginBottom: '14px' }}>يضم هذا المستودع الرقمي وعاءً رقمياً يشمل كافة التخصصات العلمية في شتى فروع المعرفة البشرية، بالإضافة إلى:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
                            {[
                                { label: 'صور ووثائق تاريخية', value: '2,052 صورة' },
                                { label: 'ملفات صوتية', value: '2,447 ملف' },
                                { label: 'كتب صوتية', value: '17 كتاب' },
                                { label: 'خرائط رقمية', value: '2,777 خريطة' },
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'rgba(8,101,168,0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0865a8', marginBottom: '4px' }}>{item.value}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ذاكرة مصر + وصف مصر + الأرشيفات */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ ...cardBase, borderTop: '4px solid #f57c00', textAlign: 'right' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f57c00', marginBottom: '8px' }}>ذاكرة مصر المعاصرة</h4>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>إتاحة كافة المعلومات التاريخية الهامة لمصر منذ تولي محمد علي حكم مصر سنة <strong>1805</strong> وحتى نهاية عصر الرئيس الراحل محمد أنور السادات سنة <strong>1981</strong>.</p>
                        </div>
                        <div style={{ ...cardBase, borderTop: '4px solid #0865a8', textAlign: 'right' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0865a8', marginBottom: '8px' }}>كتاب وصف مصر</h4>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>من أعظم الكتب التاريخية في عهد الحملة الفرنسية — <strong>20 جزءاً</strong>: منها <strong>11 جزء</strong> رسومات وخرائط، و<strong>9 أجزاء</strong> تصف مصر باللغة الفرنسية.</p>
                        </div>
                        <div style={{ ...cardBase, borderTop: '4px solid #f57c00', textAlign: 'right' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f57c00', marginBottom: '8px' }}>الأرشيف الرقمي للرئيس جمال عبد الناصر</h4>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>كافة المعلومات التاريخية بأشكالها المختلفة من كتب ومقالات ورسائل ومذكرات وصور وفيديوهات في فترة رئاسة الرئيس جمال عبد الناصر.</p>
                        </div>
                        <div style={{ ...cardBase, borderTop: '4px solid #0865a8', textAlign: 'right' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0865a8', marginBottom: '8px' }}>الأرشيف الرقمي للرئيس محمد أنور السادات</h4>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>كافة المعلومات التاريخية وأفلام تسجيلية وملفات صوتية ومقتطفات من نصر حرب أكتوبر ومعلومات موثقة في فترة رئاسته.</p>
                        </div>
                    </div>

                    {/* أرشيف الصحافة + أرشيف الإنترنت */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ ...cardBase, borderRight: '5px solid #f57c00', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f57c00', margin: 0 }}>أرشيف الصحافة المصرية</h4>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#f57c00', background: 'rgba(245,124,0,0.1)', padding: '3px 10px', borderRadius: '8px' }}>17,500,000 مقالة</span>
                            </div>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>مقالات صحفية رقمية باللغات العربية والإنجليزية والفرنسية على مدار <strong>67 عاماً</strong> من <strong>1950</strong> حتى <strong>2017</strong>، تعكس الحياة السياسية والثقافية والاقتصادية.</p>
                        </div>
                        <div style={{ ...cardBase, borderRight: '5px solid #0865a8', textAlign: 'right' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0865a8', marginBottom: '8px' }}>أرشيف صفحات الإنترنت</h4>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>أرشيف شامل يضم صوراً لكافة صفحات المواقع وتطورها وتغيُّر شكلها ومحتوياتها عبر الزمن، ليكون بمثابة تاريخ لشكل صفحات الإنترنت.</p>
                        </div>
                    </div>

                    {/* 5. الفئات المستفيدة وآليات الاستفادة */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                        <div style={{ ...cardBase, textAlign: 'right' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0865a8', marginBottom: '16px' }}>الفئات المستفيدة من سفارة المعرفة</h3>
                            {['موظفو الشركة', 'طلبة الجامعات', 'الباحثون لرسائل الماجستير والدكتوراه (داخل وخارج الشركة)'].map((f, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i % 2 === 0 ? '#0865a8' : '#f57c00', flexShrink: 0 }} />
                                    <span style={{ fontSize: '14px', color: '#374151' }}>{f}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ ...cardBase, textAlign: 'right' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f57c00', marginBottom: '16px' }}>آليات الاستفادة من سفارة المعرفة</h3>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.85' }}>
                                يتم حضور المستفيدين إلى مقر المكتبة الرئيسية مع تقديم كارنيه الاشتراك وتسجيل بياناتهم باستمارة خدمات المستفيدين، ثم يُوجَّهون من قبل مسؤول المكتبة للتدريب على استخدام أجهزة الحاسب الآلي الخاصة بالسفارة والمخصصة للبحث والاسترجاع عن المعلومات.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Books */}
            <section style={sectionStyle('#f9fafb')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>أمثلة من الكتب</h2>
                        <p style={sectionSubStyle}>تصفح مجموعة مختارة من أفضل الكتب</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '28px' }}>
                        {books.map((book, i) => (
                            <BookCard key={i} book={book} onClick={() => window.open(book.url, '_blank')} isMobile={isMobile} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <LibrarySearchSection isMobile={isMobile} isTablet={isTablet} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');
                @keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                input::placeholder{color:#9ca3af}
            `}</style>
        </div>
    );
}

function FeatureCard({ feature, index }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{ borderRadius: '20px', border: `2px solid ${hovered ? feature.color : '#e5e7eb'}`, overflow: 'hidden', cursor: 'pointer', boxShadow: hovered ? `0 10px 28px ${feature.color}22` : '0 2px 6px rgba(0,0,0,0.04)', transition: 'all 0.4s ease', background: 'white', transform: hovered ? 'translateY(-6px)' : 'none' }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        >
            <div style={{ height: '5px', background: feature.color, width: hovered ? '100%' : '35%', transition: 'width 0.4s ease' }} />
            <div style={{ padding: '24px 28px', display: 'flex', gap: '18px', alignItems: 'flex-start', direction: 'rtl' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '10px', background: hovered ? feature.color : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: hovered ? 'white' : feature.color, transition: 'color 0.3s ease' }}>{index + 1}</span>
                </div>
                <p style={{ fontSize: '15px', lineHeight: '1.85', color: '#1a1a1a', margin: 0, flex: 1, textAlign: 'right' }}>{feature.text}</p>
            </div>
        </div>
    );
}

function BookCard({ book, onClick, isMobile }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '2px solid #e5e7eb', cursor: 'pointer', transform: hovered ? 'translateY(-10px) scale(1.02)' : 'none', transition: 'all 0.4s ease', boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.1)` : '0 2px 8px rgba(0,0,0,0.04)' }} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: book.color, opacity: hovered ? 0.82 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'opacity 0.4s ease' }}>
                    <Search size={32} color="white" />
                    <div style={{ padding: '10px 28px', background: 'white', color: '#000', borderRadius: '999px', fontSize: '15px', fontWeight: '700' }}>اقرأ الآن</div>
                </div>
                <div style={{ position: 'absolute', top: '14px', right: '14px', padding: '6px 14px', background: book.color, borderRadius: '999px', color: 'white', fontSize: '12px', fontWeight: '700' }}>{book.publisher}</div>
            </div>
            <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '700', color: '#000', lineHeight: '1.45', marginBottom: '14px' }}>{book.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: book.color, fontWeight: '600' }}>تصفح الكتاب <ChevronLeft size={15} /></span>
                </div>
            </div>
        </div>
    );
}

function InaugurationGallery({ isMobile }) {
    const images = [
        { src: '/images/library/IMG-20241012-WA0010.jpg', caption: 'افتتاح سفارة المعرفة - 1' },
        { src: '/images/library/IMG-20241012-WA0011.jpg', caption: 'افتتاح سفارة المعرفة - 2' },
        { src: '/images/library/IMG-20241012-WA0012.jpg', caption: 'افتتاح سفارة المعرفة - 3' },
        { src: '/images/library/IMG-20241012-WA0013.jpg', caption: 'افتتاح سفارة المعرفة - 4' },
        { src: '/images/library/IMG-20241012-WA0014.jpg', caption: 'افتتاح سفارة المعرفة - 5' },
        { src: '/images/library/IMG-20241012-WA0015.jpg', caption: 'افتتاح سفارة المعرفة - 6' },
        { src: '/images/library/IMG-20241012-WA0016.jpg', caption: 'افتتاح سفارة المعرفة - 7' },
        { src: '/images/library/IMG-20241012-WA0017.jpg', caption: 'افتتاح سفارة المعرفة - 8' },
        { src: '/images/library/IMG-20241012-WA0018.jpg', caption: 'افتتاح سفارة المعرفة - 9' },
        { src: '/images/library/IMG-20241012-WA0019.jpg', caption: 'افتتاح سفارة المعرفة - 10' },
        { src: '/images/library/IMG-20241012-WA0020.jpg', caption: 'افتتاح سفارة المعرفة - 11' },
        { src: '/images/library/IMG-20241012-WA0021.jpg', caption: 'افتتاح سفارة المعرفة - 12' },
        { src: '/images/library/IMG-20241012-WA0022.jpg', caption: 'افتتاح سفارة المعرفة - 13' },
        { src: '/images/library/IMG-20241012-WA0023.jpg', caption: 'افتتاح سفارة المعرفة - 14' },
        { src: '/images/library/IMG-20241012-WA0024.jpg', caption: 'افتتاح سفارة المعرفة - 15' },
        { src: '/images/library/IMG-20241012-WA0025.jpg', caption: 'افتتاح سفارة المعرفة - 16' },
    ];

    const [current, setCurrent] = useState(0);
    const [imgError, setImgError] = useState({});

    const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
    const next = () => setCurrent(c => (c + 1) % images.length);

    const visibleDots = () => {
        const total = images.length;
        const max = isMobile ? 5 : 8;
        if (total <= max) return images.map((_, i) => i);
        let start = Math.max(0, current - Math.floor(max / 2));
        let end = start + max;
        if (end > total) { end = total; start = Math.max(0, end - max); }
        return images.slice(start, end).map((_, i) => start + i);
    };

    return (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#000', textAlign: 'center', marginBottom: '20px' }}>
                صور افتتاح سفارة المعرفة بالمعهد
            </h3>

            <div style={{ background: 'white', borderRadius: '20px', border: '2px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                {/* Main image */}
                <div style={{ position: 'relative', width: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? '220px' : '380px' }}>
                    {imgError[current] ? (
                        <div style={{ width: '100%', height: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', gap: '12px' }}>
                            <BookOpen size={48} color="#d1d5db" />
                            <span style={{ fontSize: '14px' }}>الصورة غير متاحة</span>
                        </div>
                    ) : (
                        <img
                            key={current}
                            src={images[current].src}
                            alt={images[current].caption}
                            onError={() => setImgError(e => ({ ...e, [current]: true }))}
                            style={{ width: '100%', height: 'auto', maxHeight: isMobile ? '320px' : '560px', objectFit: 'contain', display: 'block', transition: 'opacity 0.3s ease' }}
                        />
                    )}

                    {/* Prev / Next overlay buttons */}
                    <button onClick={prev} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s' }}>
                        <ChevronRight size={20} color="#0865a8" />
                    </button>
                    <button onClick={next} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s' }}>
                        <ChevronLeft size={20} color="#0865a8" />
                    </button>

                    {/* Counter badge */}
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.55)', borderRadius: '20px', padding: '4px 12px', color: 'white', fontSize: '13px', fontWeight: '600', zIndex: 2 }}>
                        {current + 1} / {images.length}
                    </div>
                </div>

                {/* Caption */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{images[current].caption}</span>
                </div>

                {/* Dots + thumbs row */}
                <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    {/* Dot indicators */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {visibleDots().map(i => (
                            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === current ? '#0865a8' : '#d1d5db', border: 'none', cursor: 'pointer', outline: 'none', transition: 'all 0.3s ease', padding: 0 }} />
                        ))}
                    </div>

                    {/* Thumbnail strip */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', width: '100%', paddingBottom: '4px', justifyContent: isMobile ? 'flex-start' : 'center' }}>
                        {images.map((img, i) => (
                            <button key={i} onClick={() => setCurrent(i)} style={{ flexShrink: 0, width: isMobile ? '52px' : '64px', height: isMobile ? '40px' : '48px', borderRadius: '8px', overflow: 'hidden', border: i === current ? '2px solid #0865a8' : '2px solid #e5e7eb', cursor: 'pointer', padding: 0, outline: 'none', background: '#f3f4f6', transition: 'border-color 0.2s', opacity: i === current ? 1 : 0.65 }}>
                                {imgError[i] ? (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                                        <BookOpen size={14} color="#d1d5db" />
                                    </div>
                                ) : (
                                    <img src={img.src} alt="" onError={() => setImgError(e => ({ ...e, [i]: true }))} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LibrarySearchSection({ isMobile, isTablet }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchText, setSearchText] = useState('');
    const [focused, setFocused] = useState(false);
    const [booksDatabase, setBooksDatabase] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;

    useEffect(() => {
        let cancelled = false;
        const fetchAll = async () => {
            try {
                setLoading(true);
                const first = await fetch('https://acwebsite-icmet-test.azurewebsites.net/api/book/getAllBooks?pageIndex=1');
                if (!first.ok) throw new Error('Failed');
                const fd = await first.json();
                const total = fd.totalPages || 1;
                let items = [...(fd.data || [])];
                if (total > 1) {
                    const pages = await Promise.all(Array.from({ length: total - 1 }, (_, i) =>
                        fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/book/getAllBooks?pageIndex=${i + 2}`).then(r => r.json())
                    ));
                    pages.forEach(p => { items = items.concat(p.data || []); });
                }
                if (cancelled) return;
                setBooksDatabase(items.map((b, i) => {
                    let year = '2000';
                    if (b.bookDate) { const m = b.bookDate.match(/\.000(\d{4})$/); if (m) year = m[1]; }
                    return { id: i + 1, category: b.typeName || 'غير مصنف', year, title: b.bookName || 'عنوان غير متوفر', author: b.author || 'مؤلف غير معروف' };
                }));
                setLoading(false);
            } catch (e) { if (!cancelled) { setError(e.message); setLoading(false); } }
        };
        fetchAll();
        return () => { cancelled = true; };
    }, []);

    const categories = React.useMemo(() => [...new Set(booksDatabase.map(b => b.category))].map((c, i) => ({ id: c, name: c, icon: ['⚖️', '📜', '📋', '📐', '🏗️', '⚡', '🏛️', '💧', '🛣️', '🚰'][i % 10] })), [booksDatabase]);
    const availableYears = React.useMemo(() => {
        const src = selectedCategory ? booksDatabase.filter(b => b.category === selectedCategory) : booksDatabase;
        return [...new Set(src.map(b => b.year))].sort((a, b) => b.localeCompare(a));
    }, [selectedCategory, booksDatabase]);

    const filtered = booksDatabase.filter(b => {
        const mc = !selectedCategory || b.category === selectedCategory;
        const my = !selectedYear || b.year === selectedYear;
        const ms = !searchText.trim() || b.title.toLowerCase().includes(searchText.toLowerCase()) || b.author.toLowerCase().includes(searchText.toLowerCase());
        return mc && my && ms;
    });

    const totalPages = Math.ceil(filtered.length / booksPerPage);
    const current = filtered.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);
    useEffect(() => setCurrentPage(1), [selectedCategory, selectedYear, searchText]);

    const inputStyle = { width: '100%', padding: '14px 46px 14px 18px', fontSize: '15px', background: 'white', border: `2px solid ${focused ? '#0865a8' : '#e5e7eb'}`, borderRadius: '14px', color: '#000', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.3s' };
    const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none', border: '2px solid #e5e7eb' };
    const iconPos = { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '18px', height: '18px', pointerEvents: 'none' };

    return (
        <section style={{ padding: '80px 32px', background: '#f9fafb' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '28px', padding: isMobile ? '28px 20px' : '44px', border: '2px solid #e5e7eb', marginBottom: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <h2 style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: '800', color: '#000', marginBottom: '8px' }}>ابحث في المكتبة</h2>
                        <p style={{ fontSize: '16px', color: '#6b7280' }}>اعثر على الكتاب المناسب بسهولة</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr 1fr', gap: '14px' }}>
                        <div style={{ position: 'relative' }}>
                            <input type="text" placeholder="ابحث عن كتاب أو مؤلف..." value={searchText} onChange={e => setSearchText(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={inputStyle} disabled={loading} />
                            <Search style={iconPos} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={selectStyle} disabled={loading}>
                                <option value="">التصنيف</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                            </select>
                            <Tag style={iconPos} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={selectStyle} disabled={loading}>
                                <option value="">السنة</option>
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <Calendar style={iconPos} />
                        </div>
                    </div>
                    {!loading && !error && (
                        <div style={{ marginTop: '24px', padding: '14px 20px', background: 'rgba(8,101,168,0.08)', border: '2px solid rgba(8,101,168,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#0865a8', fontSize: '15px', fontWeight: '600' }}>
                            <Sparkles size={16} />
                            {selectedCategory || selectedYear || searchText.trim() ? `تم العثور على ${filtered.length} نتيجة` : `عرض جميع الكتب (${filtered.length})`}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', border: '2px solid #e5e7eb' }}>
                        <div style={{ width: '44px', height: '44px', border: '4px solid #e5e7eb', borderTop: '4px solid #0865a8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                        <p style={{ color: '#6b7280', fontSize: '17px' }}>جاري تحميل الكتب...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', border: '2px solid #e5e7eb' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <p style={{ color: '#ef4444', fontSize: '16px' }}>{error}</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '18px' }}>
                            {current.map((book, i) => <SearchResultCard key={book.id} book={book} index={i} />)}
                        </div>
                        {filtered.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', border: '2px solid #e5e7eb', marginTop: '20px' }}>
                                <div style={{ fontSize: '56px', marginBottom: '16px' }}>📚</div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#000', marginBottom: '8px' }}>لا توجد نتائج</h3>
                                <p style={{ color: '#6b7280' }}>جرب تغيير معايير البحث</p>
                            </div>
                        )}
                        {filtered.length > 0 && totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isMobile={isMobile} />}
                    </>
                )}
            </div>
        </section>
    );
}

function Pagination({ currentPage, totalPages, onPageChange, isMobile }) {
    const pages = [];
    const max = isMobile ? 3 : 5;
    if (totalPages <= max + 2) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
        pages.push(1);
        let s = Math.max(2, currentPage - Math.floor(max / 2)), e = Math.min(totalPages - 1, s + max - 1);
        if (e === totalPages - 1) s = Math.max(2, e - max + 1);
        if (s > 2) pages.push('...');
        for (let i = s; i <= e; i++) pages.push(i);
        if (e < totalPages - 1) pages.push('...');
        pages.push(totalPages);
    }
    const go = (p) => { onPageChange(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const btnBase = { background: 'white', border: '2px solid #e5e7eb', borderRadius: '12px', color: '#000', fontFamily: 'inherit', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', outline: 'none' };
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '40px', padding: '20px', background: 'white', borderRadius: '18px', border: '2px solid #e5e7eb' }}>
            <button onClick={() => currentPage > 1 && go(currentPage - 1)} disabled={currentPage === 1} style={{ ...btnBase, width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}><ChevronRight size={18} /></button>
            <div style={{ display: 'flex', gap: '8px' }}>
                {pages.map((p, i) => p === '...' ? (
                    <span key={`e${i}`} style={{ color: '#9ca3af', fontSize: '15px', padding: '0 6px' }}>...</span>
                ) : (
                    <button key={p} onClick={() => p !== currentPage && go(p)} style={{ ...btnBase, minWidth: '38px', height: '38px', padding: '0 10px', ...(p === currentPage ? { background: 'linear-gradient(135deg, #0865a8, #f57c00)', border: '2px solid transparent', color: 'white' } : {}) }}>{p}</button>
                ))}
            </div>
            <button onClick={() => currentPage < totalPages && go(currentPage + 1)} disabled={currentPage === totalPages} style={{ ...btnBase, width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}><ChevronLeft size={18} /></button>
        </div>
    );
}

function SearchResultCard({ book, index }) {
    const [hovered, setHovered] = useState(false);
    const colors = ['#0865a8', '#f57c00', '#000000'];
    const color = colors[book.category.length % colors.length];
    return (
        <div style={{ background: 'white', borderRadius: '16px', border: `1.5px solid ${hovered ? color : '#e5e7eb'}`, padding: '18px', cursor: 'pointer', transform: hovered ? 'translateY(-5px)' : 'none', transition: 'all 0.4s ease', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden', boxShadow: hovered ? `0 8px 20px ${color}18` : '0 1px 4px rgba(0,0,0,0.04)' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', background: color, borderRadius: '0 16px 16px 0', opacity: hovered ? 1 : 0.2, transition: 'opacity 0.3s' }} />
            <div style={{ display: 'inline-flex', alignSelf: 'flex-end', padding: '3px 9px', borderRadius: '20px', background: `${color}14`, border: `1px solid ${color}28`, color, fontSize: '11px', fontWeight: '700' }}>{book.category}</div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111', lineHeight: '1.5', margin: 0, textAlign: 'right', flex: 1 }}>{book.title}</h4>
            <div style={{ height: '1px', background: '#f0f0f0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.author}</span>
                <span style={{ fontSize: '12px', color, fontWeight: '700', background: `${color}10`, padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>{book.year}</span>
            </div>
        </div>
    );
}