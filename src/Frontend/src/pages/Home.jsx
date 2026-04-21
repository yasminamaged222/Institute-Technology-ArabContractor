import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import StarIcon from '@mui/icons-material/Star';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HandshakeIcon from '@mui/icons-material/Handshake';
import GroupsIcon from '@mui/icons-material/Groups';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HardwareIcon from '@mui/icons-material/Hardware';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import CustomersSection from './CustomersSection';
import TechnicalEducationSection from './TechnicalEducationSection';
import DynamicCoursesSection from './Dynamiccoursessection';
import logo from '../assets/The-Role-of-Technology-in-Modern-Society-1024x570.jpg';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const slides = [
    { title: 'خدمات تدريبية مميزة', subtitle: 'التشييد والإدارة', tag: 'برامج تدريبية', link: '/training-methods', image: '/images/banner6.jpg' },
    { title: 'ورش الميكانيكا والكهرباء', subtitle: 'تأهيل الكوادر الهندسية', tag: 'تدريب تقني', link: '/shobra', image: '/images/banner3.jpg' },
    { title: 'التدريب في موقع العمل', subtitle: 'تدريب ميداني احترافي', tag: 'ميداني', link: '/onsite-training', image: '/images/banner4.jpg' },
    { title: 'برنامج التدريب المهني في الهندسة التجاريةالمتميز', subtitle: 'الهندسة التجارية', tag: 'CEA', link: '/cea-program', image: '/images/banner8.jpg' },
    { title: 'مدرسة المقاولون العرب الفنية', subtitle: 'جيل مهني متميز', tag: 'تعليم فني', link: '/Technical_Schools', image: '/images/banner7.jpg' },
];

const features = [
    { icon: 'https://static.vecteezy.com/system/resources/thumbnails/008/143/259/small/blue-book-icon-book-sign-flat-style-blue-book-symbol-vector.jpg', title: 'مكتبة علمية متخصصة', subtitle: 'آلاف المراجع الهندسية والإدارية', link: '/library', num: '01' },
    { icon: 'https://www.shutterstock.com/image-vector/blue-graduation-cap-vector-icon-260nw-2627871193.jpg', title: 'كفاءات بشرية فريدة', subtitle: 'مدربون بخبرة ومهارة استثنائية', link: '/instructors', num: '02' },
    { icon: 'https://static.vecteezy.com/system/resources/previews/024/283/038/non_2x/flat-style-blue-color-laptop-icon-vector.jpg', title: 'تدريب عن بُعد', subtitle: 'أحدث تقنيات التعلم الإلكتروني', link: '/online-training', num: '03' },
];

const downloadItems = [
    { title: 'الخطة التدريبية السنوية', Icon: EmojiEventsIcon, pdfUrl: '/pdf/ICEMT_Plan_Training.pdf', desc: 'خطة شاملة لجميع البرامج' },
    { title: 'التقرير الشهري', Icon: DescriptionIcon, pdfUrl: '/pdf/ICEMT_Monthly_Activity.pdf', desc: 'آخر تقرير نشاط شهري' },
    { title: 'الخطة الاستراتيجية', Icon: HomeWorkIcon, pdfUrl: '/pdf/StrategicPlan_2024_2030.pdf', desc: '2024 — 2030' },
];

const visionItems = [
    { title: 'الرؤية', text: 'تحقيق الريادة في التعليم ولتدريب الهندسي و  الحرف و التدريب المهني محليًا وإقليميًا، وتوفير الدعم التدريبي للعاملين بالشركة.' },
    { title: 'الرسالة', text: 'إعداد وتأهيل أجيال من الكوادر المهنية المتميزة لتلبية متطلبات الشركة وسوق العمل طبقًا لمعايير الجودة.' },
    { title: 'إستراتيجية العمل', text: 'إعداد أجيال من الكوادر المؤهلين في بيئة مبتكرة يتمتعون بالتميز التقني والمهارات القيادية والعملية.' },
    { title: 'الأهداف', text: 'إيجاد فرص التعاون مع الجامعات ومعاهد البحوث والهيئات الدولية وربط المسار المهني بخطط التدريب.' },
];

const certificates = [
    { title: 'الاعتماد القومي للجودة', text: 'اعتماد من المعهد القومي للجودة التابع لوزارة التجارة والصناعة.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/NQI-lg.jpg' },
    { title: 'ISO 9001:2015', text: 'شهادة الجودة منذ عام 2000 في مجال تصميم وتنفيذ الخدمات التدريبية.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/iso9001.jpg' },
    { title: 'PMI', text: 'اعتماد معهد إدارة الأعمال (PMI) للإعداد لاجتياز شهادة PMP.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/pmi.jpg' },
    { title: 'Autodesk Training Center', text: 'مركز تدريب معتمد من Autodesk لأحدث برامج الهندسة والتصميم.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/autodeskCert.jpg' },
];

const protocols = [
    'جمعية المحاسبين والمراجعين المصرية',
    'مؤسسة المهندسين المدنيين البريطانيين (ICE)',
    'مركز تحديث الصناعة',
    'الغرفة الألمانية العربية للصناعة والتجارة',
    'المركز الإقليمي لتعليم الكبار (أسفك) - اليونسكو',
    'نقابة المهندسين بالقاهرة',
];

const leaderProposals = [
    'تحويل الخلاطات للعمل بالغاز الطبيعي',
    'تفعيل قسم الجودة في مراحل التصنيع',
    'قاعدة بيانات شاملة للمشروعات',
    'خطة احتياجات الموارد البشرية',
    'استخدام الطاقة الشمسية',
    'الخطابات باللغتين العربية والإنجليزية',
];

const teamMembers = [
    { name: 'أحمد العصار', role: 'رئيس مجلس الإدارة', img: '/images/team4.jpg', cat: 'قيادة عليا' },
    { name: 'شريف حمدي', role: 'مدير المعهد', img: '/images/team1.jpg', cat: 'تنفيذي' },
    { name: 'هبه عادل', role: 'نائب المدير للشئون العلمية', img: '/images/team2.jpg', cat: 'تنفيذي' },
    { name: 'طارق منصور', role: 'نائب المدير للشئون الفنية', img: '/images/team3.jpg', cat: 'تنفيذي' },
];

const craftItems = [
    { Icon: EngineeringIcon, title: 'التدريب الحرفي', text: 'مراكز جسر السويس وشبرا لبناء المهارات الحرفية وتأهيل الكوادر المتخصصة.', link: '/vocational-training' },
    { Icon: SchoolIcon, title: 'التعليم الفني', text: 'بروتوكول تعاون مع وزارة التربية لتطوير الثانويات الصناعية وكوادرها.', link: '/technical-education' },
    { Icon: AssignmentTurnedInIcon, title: 'الاختبارات والتقييم', text: 'اختبارات سيكومترية وتقييمات تخصصية في اللغة والحاسب والهندسة.', link: '/tests' },
];

const stats = [
    { n: '45+', l: 'عامًا من الخبرة' },
    { n: '12,000+', l: 'متدرب سنويًا' },
    { n: '200+', l: 'برنامج تدريبي' },
    { n: '1978', l: 'سنة التأسيس' },
];

const overviewStats = [
    { n: '+60', l: 'عميل', desc: 'نساهم في تطوير صناعة التشييد فنتيح لجميع الوزارات والهيئات الاستفادة من إمكانيات الإدارة في التدريب.' },
    { n: '+2500', l: 'مادة تدريبية', desc: 'نمتلك العديد من المواد العلمية والتدريبية موضوعة من خلال مجموعة منتقاة من الخبراء وأساتذة الجامعات.' },
    { n: '176,418', l: 'متدرب', desc: 'إجمالى عدد المتدربين منذ إنشاء المعهد وحتى الآن.' },
];

const trainingPrograms = [
    { Icon: BuildCircleIcon, label: 'برامج للتدريب التحويلى' },
    { Icon: PeopleAltIcon, label: 'تكوين فرق التنفيذ الذاتى' },
    { Icon: MenuBookIcon, label: 'الحلول التدريبية المتكاملة' },
    { Icon: HardwareIcon, label: 'التدريب فى موقع العمل' },
];

const whyJoinItems = [
    { Icon: CorporateFareIcon, title: 'خدمات متميزة', text: 'برامج تدريبية، مدارس فنية، وخدمات للشركات والجهات الحكومية.' },
    { Icon: PeopleAltIcon, title: 'مدربون متميزون', text: 'كفاءات بشرية فريدة تتسم بقدر عالٍ من المهارة والخبرة الميدانية.' },
    { Icon: VerifiedIcon, title: 'اعتمادات دولية', text: 'حاصلون على ISO 9001:2015 ومعتمدون من PMI مع تحديث سنوي مستمر.' },
    { Icon: ThumbUpAltIcon, title: 'جودة لا تُضاهى', text: 'خدمات فعّالة خالية من الأخطاء ترقى لأعلى توقعات المستفيدين.' },
];

// ─── INTERSECTION OBSERVER ─────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return [ref, vis];
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const F = '"Droid Arabic Kufi","Noto Kufi Arabic",serif';
const C = {
    o: '#f57c00', od: '#e65100',
    b: '#0865a8', bd: '#044474',
    w: '#ffffff', k: '#0a0a0a', k2: '#111827',
    g1: '#f9fafb', g2: '#f3f4f6', g3: '#e5e7eb',
    g5: '#6b7280', g7: '#374151', g8: '#1f2937',
};

// ─── ATOMS ────────────────────────────────────────────────────────────────────
const Eyebrow = ({ children, light }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 2, background: C.o }} />
        <span style={{ fontFamily: F, fontSize: '.72rem', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: light ? 'rgba(255,255,255,.6)' : C.o }}>
            {children}
        </span>
    </div>
);

const SplitTitle = ({ children, light, size = 'lg' }) => (
    <h2 style={{
        fontFamily: F, fontWeight: 900, margin: 0,
        fontSize: size === 'lg' ? 'clamp(1.8rem,4vw,3.2rem)' : 'clamp(1.4rem,2.8vw,2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.02em',
        color: light ? C.w : C.k,
    }}>{children}</h2>
);

const Pill = ({ children, dark }) => (
    <span style={{
        display: 'inline-block', fontFamily: F, fontSize: '.68rem', fontWeight: 700,
        letterSpacing: 2, textTransform: 'uppercase',
        padding: '4px 14px', borderRadius: 2,
        background: dark ? 'rgba(245,124,0,.15)' : C.o,
        color: dark ? C.o : C.w,
        border: dark ? `1px solid rgba(245,124,0,.3)` : 'none',
    }}>{children}</span>
);

const ArrowBtn = ({ to, children, inv }) => (
    <Link to={to} style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontFamily: F, fontSize: 'clamp(.8rem,1.2vw,.9rem)', fontWeight: 700,
        color: inv ? C.w : C.k,
        textDecoration: 'none',
        borderBottom: `2px solid ${C.o}`,
        paddingBottom: 3,
        transition: 'gap .2s, opacity .2s',
    }}
        onMouseEnter={e => e.currentTarget.style.gap = '16px'}
        onMouseLeave={e => e.currentTarget.style.gap = '10px'}
    >{children} <NorthEastIcon sx={{ fontSize: 15 }} /></Link>
);

const SolidBtn = ({ to, href, children, orange, small }) => {
    const s = {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: F, fontSize: small ? '.78rem' : 'clamp(.8rem,1.2vw,.9rem)', fontWeight: 700,
        color: C.w, textDecoration: 'none',
        background: orange ? C.o : C.b,
        padding: small ? '8px 20px' : 'clamp(10px,1.3vw,13px) clamp(22px,3vw,34px)',
        borderRadius: 4,
        transition: 'transform .2s, opacity .2s',
    };
    const hover = e => { e.currentTarget.style.opacity = '.85'; e.currentTarget.style.transform = 'translateY(-1px)'; };
    const leave = e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = ''; };
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={s} onMouseEnter={hover} onMouseLeave={leave}>{children}</a>;
    return <Link to={to} style={s} onMouseEnter={hover} onMouseLeave={leave}>{children}</Link>;
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const [newsItems, setNewsItems] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);

    // Reveal refs — one per major section
    const [statsRef, statsVis] = useReveal(0.05);
    const [featRef, featVis] = useReveal(0.08);
    const [aboutRef, aboutVis] = useReveal(0.06);
    const [visionRef, visionVis] = useReveal(0.06);
    const [dlRef, dlVis] = useReveal(0.08);
    const [certRef, certVis] = useReveal(0.06);
    const [protoRef, protoVis] = useReveal(0.06);
    const [teamRef, teamVis] = useReveal(0.05);
    const [craftRef, craftVis] = useReveal(0.06);
    const [libRef, libVis] = useReveal(0.05);
    const [newsRef, newsVis] = useReveal(0.06);

    useEffect(() => { document.title = 'المعهد التكنولوجي — ICMET'; }, []);
    useEffect(() => {
        fetch('https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => {
                setNewsItems((d.data || []).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 6));
                setNewsLoading(false);
            })
            .catch(() => setNewsLoading(false));
    }, []);

    return (
        <div dir="rtl" style={{ fontFamily: F, overflowX: 'hidden', background: C.w }}>
            <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        /* ══ IMMERSIVE REVEAL SYSTEM ══ */
        /* Base hidden state */
        .rv       { opacity:0; transform:translateY(32px); transition:opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
        .rv-left  { opacity:0; transform:translateX(32px); transition:opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
        .rv-scale { opacity:0; transform:scale(.96); transition:opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
        /* Visible state */
        .rv.on, .rv-left.on, .rv-scale.on { opacity:1; transform:none; }
        /* Stagger delays */
        .d1{transition-delay:.08s;} .d2{transition-delay:.16s;} .d3{transition-delay:.24s;}
        .d4{transition-delay:.32s;} .d5{transition-delay:.40s;} .d6{transition-delay:.48s;}

        .W{max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,56px);}
        .S{padding:clamp(48px,7vw,96px) clamp(16px,4vw,56px);}

        /* ── Hero — shorter ── */
        .hero-swiper{width:100%;height:clamp(300px,55vh,560px);}
        .hero-swiper .swiper-slide{display:flex;align-items:flex-end;justify-content:flex-start;}
        .hero-swiper .swiper-button-prev,.hero-swiper .swiper-button-next{
          width:38px;height:38px;border-radius:0;
          background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);
          color:#fff!important;right:24px!important;left:auto!important;
          transition:background .2s;
        }
        .hero-swiper .swiper-button-prev{top:calc(50% + 24px)!important;}
        .hero-swiper .swiper-button-next{top:calc(50% - 24px)!important;}
        .hero-swiper .swiper-button-prev::after,.hero-swiper .swiper-button-next::after{font-size:10px!important;font-weight:900;}
        .hero-swiper .swiper-button-prev:hover,.hero-swiper .swiper-button-next:hover{background:${C.o};border-color:${C.o};}
        .hero-swiper .swiper-pagination{bottom:20px!important;right:auto!important;left:clamp(16px,4vw,56px)!important;width:auto!important;display:flex;gap:6px;}
        .hero-swiper .swiper-pagination-bullet{background:rgba(255,255,255,.4);opacity:1;width:20px;height:2px;border-radius:0;transition:all .3s;}
        .hero-swiper .swiper-pagination-bullet-active{background:${C.o};width:36px;}

        /* ── Stats bar ── */
        .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:0;}
        @media(max-width:760px){.stats-bar{grid-template-columns:repeat(2,1fr);}}
        .stat-cell{padding:clamp(20px,3.5vw,36px) clamp(16px,2.5vw,28px);border-left:1px solid rgba(255,255,255,.1);text-align:center;}
        .stat-cell:last-child{border-left:none;}

        /* ══ FEATURE LIST — editorial redesign ══ */
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid ${C.g3};}
        @media(max-width:780px){.feat-grid{grid-template-columns:1fr;}}
        .feat-card{
          padding:clamp(28px,4vw,48px) clamp(22px,3vw,36px);
          border-left:1px solid ${C.g3};
          position:relative;overflow:hidden;
          transition:background .3s;
          cursor:default;
        }
        .feat-card:last-child{border-left:none;}
        @media(max-width:780px){.feat-card{border-left:none;border-bottom:1px solid ${C.g3};}.feat-card:last-child{border-bottom:none;}}
        .feat-card::before{
          content:'';position:absolute;bottom:0;right:0;
          width:100%;height:3px;background:${C.o};
          transform:scaleX(0);transform-origin:left;
          transition:transform .35s cubic-bezier(.22,1,.36,1);
        }
        .feat-card:hover{background:${C.g1};}
        .feat-card:hover::before{transform:scaleX(1);}
        .feat-num{
          font-family:${F};font-size:clamp(2.2rem,4vw,3.5rem);font-weight:900;
          color:${C.g3};line-height:1;margin-bottom:16px;letter-spacing:-2px;
          transition:color .3s;
        }
        .feat-card:hover .feat-num{color:${C.o};}

        /* ── DL cards ── */
        .dl-row{display:flex;align-items:center;gap:16px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.08);text-decoration:none;color:${C.w};transition:background .2s;}
        .dl-row:last-child{border-bottom:none;}
        .dl-row:hover{background:rgba(255,255,255,.04);}

        /* ── Vision items ── */
        .vis-item{padding:28px;border-radius:2px;border:1px solid ${C.g3};background:${C.w};transition:border-color .25s,box-shadow .25s;}
        .vis-item:hover{border-color:${C.o};box-shadow:0 4px 24px rgba(245,124,0,.10);}

        /* ── Cert cards ── */
        .cert-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:2px;padding:24px;color:${C.w};transition:background .25s,border-color .25s;height:100%;display:flex;flex-direction:column;gap:14px;}
        .cert-card:hover{background:rgba(255,255,255,.1);border-color:rgba(245,124,0,.4);}

        /* ── Proto chips ── */
        .proto-chip{display:flex;align-items:center;gap:12px;padding:18px 20px;border:1px solid ${C.g3};border-radius:2px;background:${C.w};transition:border-color .25s,transform .25s;}
        .proto-chip:hover{border-color:${C.b};transform:translateX(-3px);}

        /* ── Team card ── */
        .team-card{overflow:hidden;border-radius:2px;border:1px solid ${C.g3};background:${C.w};transition:border-color .25s,transform .25s;}
        .team-card:hover{border-color:${C.o};transform:translateY(-4px);}
        .team-img{width:100%;height:clamp(160px,18vw,220px);background:linear-gradient(135deg,${C.b},${C.bd});display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;}
        .team-img img{width:100%;height:100%;object-fit:cover;}

        /* ── Craft card ── */
        .craft-card{padding:clamp(22px,3vw,36px);border:1px solid ${C.g3};border-radius:2px;background:${C.w};transition:border-color .25s,transform .25s;}
        .craft-card:hover{border-color:${C.o};transform:translateY(-4px);}

        /* ── News card ── */
        .news-card{overflow:hidden;border-radius:2px;border:1px solid ${C.g3};background:${C.w};transition:border-color .25s,transform .25s;height:100%;}
        .news-card:hover{border-color:${C.b};transform:translateY(-4px);}

        /* ── News swiper ── */
        .news-swiper .swiper-button-prev,.news-swiper .swiper-button-next{width:44px;height:44px;border-radius:0;background:${C.w};border:1px solid ${C.g3};color:${C.b}!important;transition:all .25s;}
        .news-swiper .swiper-button-prev{right:-24px;}
        .news-swiper .swiper-button-next{left:-24px;right:auto;}
        .news-swiper .swiper-button-prev::after,.news-swiper .swiper-button-next::after{font-size:12px!important;font-weight:900;}
        .news-swiper .swiper-button-prev:hover,.news-swiper .swiper-button-next:hover{background:${C.b};border-color:${C.b};color:#fff!important;}
        .news-swiper .swiper-pagination-bullet-active{background:${C.o};}
        @media(max-width:600px){.news-swiper .swiper-button-prev,.news-swiper .swiper-button-next{display:none!important;}}

        /* ── Grids ── */
        .g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(12px,2vw,24px);}
        .g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,2vw,24px);}
        .g4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(12px,1.8vw,20px);}
        @media(max-width:1080px){.g4{grid-template-columns:repeat(2,minmax(0,1fr));}}
        @media(max-width:840px){.g3{grid-template-columns:repeat(2,minmax(0,1fr));}}
        @media(max-width:580px){.g2,.g3,.g4{grid-template-columns:1fr;}}

        /* ── About split ── */
        .ab-split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,6vw,80px);align-items:start;}
        @media(max-width:780px){.ab-split{grid-template-columns:1fr;}}

        /* ── Programs grid ── */
        .prog-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0 24px;}
        @media(max-width:480px){.prog-grid{grid-template-columns:1fr;}}

        /* ── Overview stats strip ── */
        .ov-stats{display:grid;grid-template-columns:repeat(3,1fr);overflow:hidden;background:${C.w};border:1px solid ${C.g3};border-radius:2px;margin-bottom:clamp(20px,3vw,32px);}
        @media(max-width:560px){.ov-stats{grid-template-columns:1fr;}}
        .ov-stat{padding:clamp(16px,2.5vw,24px) 16px;text-align:center;border-left:1px solid ${C.g3};}
        .ov-stat:last-child{border-left:none;}

        /* ── Why join cards ── */
        .why-card{padding:clamp(18px,2.5vw,26px);border:1px solid ${C.g3};border-radius:2px;background:${C.w};transition:border-color .25s,transform .25s;display:flex;flex-direction:column;gap:10px;}
        .why-card:hover{border-color:${C.o};transform:translateY(-3px);}

        /* ── Orange outline btn ── */
        a.ob-outline{display:inline-flex;align-items:center;gap:8px;font-family:${F};font-size:clamp(.78rem,1.1vw,.88rem);font-weight:700;color:${C.o};text-decoration:none;border:1.5px solid ${C.o};padding:clamp(9px,1.2vw,12px) clamp(20px,2.8vw,32px);border-radius:4px;transition:background .2s,color .2s;}
        a.ob-outline:hover{background:${C.o};color:#fff;}

        /* ── Scroll indicator ── */
        @keyframes bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(6px);}}
        .scroll-ind{animation:bounce 1.8s ease-in-out infinite;}

        /* ── Section divider line ── */
        .s-divider{width:40px;height:3px;background:${C.o};margin:16px 0 0;}

        @media(max-width:480px){.hero-h1{font-size:1.5rem!important;}}
      `}</style>

            {/* ════════════════════════════════════════
          1. HERO  (shorter — 55 vh)
      ════════════════════════════════════════ */}
            <section style={{ position: 'relative' }}>
                <Swiper
                    className="hero-swiper"
                    modules={[Autoplay, Navigation, Pagination]}
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                    navigation pagination={{ clickable: true }} loop speed={800}
                >
                    {slides.map((sl, i) => (
                        <SwiperSlide key={i}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${sl.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(4,20,40,.92) 0%,rgba(4,20,40,.65) 45%,rgba(4,20,40,.22) 100%)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(0,0,0,.55) 0%,transparent 55%)' }} />
                            <div className="W" style={{ position: 'relative', zIndex: 2, width: '100%', paddingBottom: 'clamp(36px,5vh,60px)' }}>
                                <div style={{ maxWidth: 560 }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: '.68rem', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: C.o, marginBottom: 14 }}>
                                        <div style={{ width: 24, height: 2, background: C.o }} />
                                        {sl.tag}
                                    </div>
                                    <p style={{ fontFamily: F, fontSize: 'clamp(.78rem,1.2vw,.9rem)', color: 'rgba(255,255,255,.55)', marginBottom: 8, fontWeight: 600, letterSpacing: .5 }}>{sl.subtitle}</p>
                                    <h1 className="hero-h1" style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(1.6rem,4.5vw,3.6rem)', color: C.w, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 24 }}>{sl.title}</h1>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                                        <SolidBtn to={sl.link} orange>اقرأ المزيد <ArrowForwardIosIcon sx={{ fontSize: 11 }} /></SolidBtn>
                                        <ArrowBtn to="/overview" inv>تعرف على المعهد</ArrowBtn>
                                    </div>
                                </div>
                            </div>
                            <div className="scroll-ind" style={{ position: 'absolute', bottom: 20, right: 'clamp(16px,4vw,56px)', zIndex: 3 }}>
                                <div style={{ width: 20, height: 32, border: '1.5px solid rgba(255,255,255,.3)', borderRadius: 10, display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
                                    <div style={{ width: 3, height: 7, background: C.o, borderRadius: 2 }} />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* ════════════════════════════════════════
          2. STATS BAR  (first visible section after fold)
      ════════════════════════════════════════ */}
            <div ref={statsRef} style={{ background: C.k, borderBottom: `3px solid ${C.o}` }}>
                <div className="W">
                    <div className="stats-bar">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className={`stat-cell rv${statsVis ? ' on' : ''} d${i + 1}`}
                            >
                                <div style={{ fontFamily: F, fontSize: 'clamp(1.6rem,3.2vw,2.4rem)', fontWeight: 900, color: C.o, lineHeight: 1 }}>{s.n}</div>
                                <div style={{ fontFamily: F, fontSize: '.7rem', color: 'rgba(255,255,255,.45)', marginTop: 6, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
          3. FEATURE LIST  (editorial card redesign)
      ════════════════════════════════════════ */}
            <section style={{ background: C.w }} ref={featRef}>
                <div className="W" style={{ paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 0 }}>
                    <div className={`rv${featVis ? ' on' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <Eyebrow>ما يميزنا</Eyebrow>
                            <SplitTitle>لماذا المعهد؟</SplitTitle>
                        </div>
                        <ArrowBtn to="/overview">تعرف على المزيد</ArrowBtn>
                    </div>
                </div>

                {/* Full-bleed card strip — no wrapper padding on sides */}
                <div className="feat-grid" style={{ maxWidth: '100%', borderRight: `1px solid ${C.g3}`, borderLeft: `1px solid ${C.g3}` }}>
                    {features.map((f, i) => (
                        <div key={i} className={`feat-card rv${featVis ? ' on' : ''} d${i + 1}`}>
                            {/* Large ghost number */}
                            <div className="feat-num">{f.num}</div>

                            {/* Icon */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                <img src={f.icon} alt="" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
                                <h3 style={{ fontFamily: F, fontSize: 'clamp(.94rem,1.5vw,1.1rem)', fontWeight: 800, color: C.k, lineHeight: 1.3 }}>{f.title}</h3>
                            </div>

                            <p style={{ fontFamily: F, fontSize: 'clamp(.78rem,1.1vw,.88rem)', color: C.g5, lineHeight: 1.85, marginBottom: 20 }}>{f.subtitle}</p>

                            <Link to={f.link} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: '.76rem', fontWeight: 700, color: C.b, textDecoration: 'none', borderBottom: `1px solid ${C.b}`, paddingBottom: 2, transition: 'gap .2s' }}
                                onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                                onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                            >
                                استعرض <NorthEastIcon sx={{ fontSize: 13 }} />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Orange accent strip below the feature cards */}
                <div style={{ height: 4, background: `linear-gradient(90deg,${C.o},${C.b})` }} />
            </section>

            {/* ════════════════════════════════════════
          4. ABOUT  (condensed)
      ════════════════════════════════════════ */}
            <section className="S" style={{ background: C.g1 }} ref={aboutRef}>
                <div className="W">

                    {/* Row 1: image + text */}
                    <div className={`ab-split rv${aboutVis ? ' on' : ''}`} style={{ marginBottom: 'clamp(28px,4vw,44px)' }}>

                        {/* Image */}
                        <div className={`rv-scale${aboutVis ? ' on' : ''} d1`} style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -12, right: -12, width: 52, height: 52, background: C.o, zIndex: 0 }} />
                            <img src={logo} alt="المعهد" style={{ width: '100%', display: 'block', borderRadius: 2, aspectRatio: '4/3', objectFit: 'cover', position: 'relative', zIndex: 1 }} />
                            <div style={{ position: 'absolute', bottom: 20, left: 0, background: C.k, padding: '12px 18px', zIndex: 2 }}>
                                <div style={{ fontFamily: F, fontSize: 'clamp(1rem,1.8vw,1.4rem)', fontWeight: 900, color: C.o, lineHeight: 1 }}>1978</div>
                                <div style={{ fontFamily: F, fontSize: '.68rem', color: 'rgba(255,255,255,.5)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 3 }}>تأسيس المعهد</div>
                            </div>
                        </div>

                        {/* Text */}
                        <div className={`rv${aboutVis ? ' on' : ''} d2`}>
                            <Eyebrow>نبذة عامة</Eyebrow>
                            <SplitTitle>رائد في التدريب<br />الهندسي والإداري</SplitTitle>
                            <div style={{ width: 44, height: 3, background: C.o, margin: '16px 0 18px' }} />

                            <p style={{ fontFamily: F, fontSize: 'clamp(.86rem,1.25vw,1rem)', color: C.g7, lineHeight: 2, marginBottom: 18, textAlign: 'justify' }}>
                                أول شركة مقاولات في الشرق الأوسط تُنشئ معهدًا للتدريب منذ أكثر من 45 عامًا. نُعِدّ أجيالًا متميزة في التشييد والإدارة والتقنية، ونخدم الوزارات والهيئات والقطاع الخاص بمعايير الجودة الدولية.
                            </p>

                            {/* Mini programs */}
                            <div className="prog-grid">
                                {trainingPrograms.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: `1px solid ${C.g3}`, borderRadius: 2, background: C.w, transition: 'border-color .2s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = C.o}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = C.g3}
                                    >
                                        <p.Icon sx={{ fontSize: 18, color: C.o, flexShrink: 0 }} />
                                        <span style={{ fontFamily: F, fontSize: 'clamp(.72rem,1vw,.82rem)', fontWeight: 700, color: C.k }}>{p.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <SolidBtn to="/overview" orange>تعرف على المعهد</SolidBtn>
                                <Link to="/mission" className="ob-outline">الرؤية والرسالة <ArrowForwardIosIcon sx={{ fontSize: 11 }} /></Link>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: stats strip */}
                    <div className={`ov-stats rv${aboutVis ? ' on' : ''} d3`}>
                        {overviewStats.map((s, i) => (
                            <div key={i} className="ov-stat">
                                <div style={{ fontFamily: F, fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 900, color: C.o, lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
                                <div style={{ fontFamily: F, fontSize: 'clamp(.78rem,1.1vw,.9rem)', fontWeight: 800, color: C.k, marginBottom: 6 }}>{s.l}</div>
                                <div style={{ fontFamily: F, fontSize: 'clamp(.7rem,.95vw,.8rem)', color: C.g5, lineHeight: 1.65 }}>{s.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Row 3: why join */}
                    <div className={`rv${aboutVis ? ' on' : ''} d4`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                            <div style={{ width: 3, height: 22, background: C.o }} />
                            <h3 style={{ fontFamily: F, fontSize: 'clamp(.9rem,1.4vw,1.1rem)', fontWeight: 900, color: C.k }}>لماذا تشترك بمعهد التدريب؟</h3>
                        </div>
                        <div className="g4" style={{ gap: 12 }}>
                            {whyJoinItems.map((item, i) => (
                                <div key={i} className="why-card">
                                    <div style={{ width: 44, height: 44, borderRadius: 2, background: 'rgba(8,101,168,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <item.Icon sx={{ fontSize: 22, color: C.b }} />
                                    </div>
                                    <h4 style={{ fontFamily: F, fontSize: 'clamp(.8rem,1.2vw,.92rem)', fontWeight: 800, color: C.k }}>{item.title}</h4>
                                    <p style={{ fontFamily: F, fontSize: 'clamp(.72rem,1vw,.82rem)', color: C.g5, lineHeight: 1.75 }}>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ════════════════════════════════════════
          5. VISION
      ════════════════════════════════════════ */}
            <section className="S" style={{ background: C.k2, position: 'relative', overflow: 'hidden' }} ref={visionRef}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(270deg,rgba(8,101,168,.12) 0%,transparent 100%)', pointerEvents: 'none' }} />
                <div className="W">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(32px,6vw,80px)', alignItems: 'start' }}>
                        <div className={`rv${visionVis ? ' on' : ''} d1`}>
                            <Eyebrow light>استراتيجيتنا</Eyebrow>
                            <SplitTitle light>الرؤية والأهداف</SplitTitle>
                            <div style={{ width: 44, height: 3, background: C.o, margin: '20px 0 24px' }} />
                            <p style={{ fontFamily: F, fontSize: 'clamp(.8rem,1.2vw,.92rem)', color: 'rgba(255,255,255,.55)', lineHeight: 1.9, marginBottom: 28 }}>
                                نسعى نحو مستقبل تدريبي يرتكز على الابتكار والتميز وبناء القدرات البشرية.
                            </p>
                            <SolidBtn to="/mission" orange>عرض الرؤية كاملاً</SolidBtn>
                        </div>
                        <div className="g2" style={{ gap: 14 }}>
                            {visionItems.map((v, i) => (
                                <div key={i} className={`vis-item rv${visionVis ? ' on' : ''} d${i + 2}`}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <CheckCircleOutlineIcon sx={{ color: C.o, fontSize: 18 }} />
                                        <h4 style={{ fontFamily: F, fontSize: 'clamp(.88rem,1.3vw,1rem)', fontWeight: 800, color: C.k }}>{v.title}</h4>
                                    </div>
                                    <p style={{ fontFamily: F, fontSize: 'clamp(.76rem,1.1vw,.87rem)', color: C.g5, lineHeight: 1.85 }}>{v.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
          6. DOWNLOADS
      ════════════════════════════════════════ */}
            <div ref={dlRef} style={{ background: C.b }}>
                <div className={`rv${dlVis ? ' on' : ''}`}>
                    <div className="W" style={{ padding: 'clamp(28px,4vw,48px) clamp(16px,4vw,56px)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(24px,4vw,56px)', alignItems: 'center' }}>
                            <div>
                                <Eyebrow light>وثائق</Eyebrow>
                                <h3 style={{ fontFamily: F, fontSize: 'clamp(1.1rem,2vw,1.5rem)', fontWeight: 900, color: C.w, lineHeight: 1.2 }}>تحميل الملفات والتقارير</h3>
                            </div>
                            <div style={{ borderRight: '1px solid rgba(255,255,255,.15)', paddingRight: 'clamp(20px,3vw,40px)' }}>
                                {downloadItems.map((item, i) => (
                                    <a key={i} href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="dl-row">
                                        <div style={{ width: 44, height: 44, borderRadius: 2, background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <item.Icon sx={{ color: C.o, fontSize: '1.5rem' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: F, fontSize: 'clamp(.82rem,1.2vw,.94rem)', fontWeight: 700, color: C.w }}>{item.title}</div>
                                            <div style={{ fontFamily: F, fontSize: '.7rem', color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{item.desc}</div>
                                        </div>
                                        <NorthEastIcon sx={{ color: 'rgba(255,255,255,.35)', fontSize: 18 }} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
          7. COURSES
      ════════════════════════════════════════ */}
            <section style={{ background: C.w, paddingBottom: 24 }}>
                <div className="W" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
                    <Eyebrow>دوراتنا</Eyebrow>
                    <SplitTitle>أحدث الدورات التدريبية</SplitTitle>
                    <div style={{ width: 40, height: 3, background: C.o, margin: '16px 0 40px' }} />
                </div>
                <DynamicCoursesSection />
            </section>

            {/* ════════════════════════════════════════
          8. CERTIFICATIONS
      ════════════════════════════════════════ */}
            <section className="S" style={{ background: C.k, position: 'relative', overflow: 'hidden' }} ref={certRef}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: C.o }} />
                <div className="W">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: 16 }}>
                        <div className={`rv${certVis ? ' on' : ''} d1`}>
                            <Eyebrow light>اعتماداتنا</Eyebrow>
                            <SplitTitle light>الشهادات والاعتمادات</SplitTitle>
                        </div>
                        <div className={`rv${certVis ? ' on' : ''} d2`}><ArrowBtn to="/certifications" inv>عرض الكل</ArrowBtn></div>
                    </div>
                    <div className={`rv${certVis ? ' on' : ''} d3`}>
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            autoplay={{ delay: 4500, disableOnInteraction: false }}
                            pagination={{ clickable: true }} loop spaceBetween={16}
                            breakpoints={{ 0: { slidesPerView: 1 }, 560: { slidesPerView: 2 }, 900: { slidesPerView: 3 } }}
                            style={{ paddingBottom: 44 }}
                        >
                            {certificates.map((c, i) => (
                                <SwiperSlide key={i} style={{ height: 'auto' }}>
                                    <div className="cert-card">
                                        <div style={{ display: 'flex', gap: 3 }}>{[...Array(5)].map((_, j) => <StarIcon key={j} sx={{ color: C.o, fontSize: 13 }} />)}</div>
                                        <h3 style={{ fontFamily: F, fontSize: 'clamp(.9rem,1.4vw,1.06rem)', fontWeight: 800, color: C.w, margin: 0 }}>{c.title}</h3>
                                        <p style={{ fontFamily: F, fontSize: 'clamp(.76rem,1.1vw,.87rem)', lineHeight: 1.8, color: 'rgba(255,255,255,.65)', flex: 1, margin: 0 }}>{c.text}</p>
                                        <img src={c.image} alt={c.title} style={{ width: '100%', objectFit: 'contain', maxHeight: 100, background: C.w, padding: 8, borderRadius: 2 }} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
          9. TECHNICAL EDUCATION
      ════════════════════════════════════════ */}
            <section style={{ background: C.g1 }}>
                <div className="W" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
                    <Eyebrow>برامجنا</Eyebrow>
                    <SplitTitle>التعليم الفني والتدريب المهني</SplitTitle>
                    <div style={{ width: 40, height: 3, background: C.o, margin: '16px 0 40px' }} />
                </div>
                <TechnicalEducationSection />
                <div style={{ textAlign: 'center', padding: 'clamp(28px,4vw,48px) 0 clamp(48px,7vw,80px)' }}>
                    <SolidBtn to="/technical-education" orange>عرض تطوير التعليم الفني <ArrowForwardIosIcon sx={{ fontSize: 11 }} /></SolidBtn>
                </div>
            </section>

            {/* ════════════════════════════════════════
          10. PROTOCOLS
      ════════════════════════════════════════ */}
            <section className="S" style={{ background: C.w, borderTop: `1px solid ${C.g3}` }} ref={protoRef}>
                <div className="W">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(32px,6vw,80px)', alignItems: 'start' }}>
                        <div className={`rv${protoVis ? ' on' : ''} d1`}>
                            <Eyebrow>شراكاتنا</Eyebrow>
                            <SplitTitle size="sm">البروتوكولات والاتفاقيات</SplitTitle>
                            <div style={{ width: 40, height: 3, background: C.o, margin: '16px 0 20px' }} />
                            <p style={{ fontFamily: F, fontSize: 'clamp(.8rem,1.2vw,.92rem)', color: C.g5, lineHeight: 1.9, marginBottom: 24 }}>
                                بروتوكولات تعاون استراتيجية مع جامعات وهيئات دولية معتمدة.
                            </p>
                            <SolidBtn to="/protocols" orange>عرض الكل</SolidBtn>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {protocols.map((p, i) => (
                                <div key={i} className={`proto-chip rv${protoVis ? ' on' : ''} d${Math.min(i + 2, 6)}`}>
                                    <div style={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(8,101,168,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <HandshakeIcon sx={{ color: C.b, fontSize: 18 }} />
                                    </div>
                                    <span style={{ fontFamily: F, fontSize: 'clamp(.8rem,1.2vw,.92rem)', fontWeight: 700, color: C.k, flex: 1 }}>{p}</span>
                                    <Pill dark>اتفاقية</Pill>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
          11. TEAM
      ════════════════════════════════════════ */}
            <section className="S" style={{ background: C.k2, position: 'relative', overflow: 'hidden' }} ref={teamRef}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '30%', height: 3, background: C.o }} />
                <div className="W">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: 16 }}>
                        <div className={`rv${teamVis ? ' on' : ''} d1`}>
                            <Eyebrow light>قيادتنا</Eyebrow>
                            <SplitTitle light size="sm">فريق العمل والقيادة</SplitTitle>
                        </div>
                        <div className={`rv${teamVis ? ' on' : ''} d2`} style={{ display: 'flex', gap: 10 }}>
                            <ArrowBtn to="/future-leaders" inv>مجلس قادة المستقبل</ArrowBtn>
                            <ArrowBtn to="/team" inv>فريق العمل</ArrowBtn>
                        </div>
                    </div>
                    <div className="g4">
                        {teamMembers.map((m, i) => (
                            <div key={i} className={`team-card rv${teamVis ? ' on' : ''} d${i + 1}`}>
                                <div className="team-img">
                                    <img src={m.img} alt={m.name} onError={e => e.target.style.display = 'none'} />
                                    <GroupsIcon sx={{ color: 'rgba(255,255,255,.2)', fontSize: 52, position: 'absolute' }} />
                                </div>
                                <div style={{ padding: '14px 16px' }}>
                                    <span style={{ display: 'inline-block', fontFamily: F, fontSize: '.66rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: i === 0 ? C.od : C.b, marginBottom: 6 }}>{m.cat}</span>
                                    <div style={{ fontFamily: F, fontSize: 'clamp(.84rem,1.2vw,.96rem)', fontWeight: 800, color: C.k }}>{m.name}</div>
                                    <div style={{ fontFamily: F, fontSize: '.74rem', color: C.g5, lineHeight: 1.4, marginTop: 3 }}>{m.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`rv${teamVis ? ' on' : ''} d5`} style={{ marginTop: 40, border: '1px solid rgba(255,255,255,.08)', borderRadius: 2, padding: 'clamp(20px,3vw,32px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <div style={{ width: 3, height: 24, background: C.o }} />
                            <h3 style={{ fontFamily: F, fontSize: 'clamp(.94rem,1.5vw,1.15rem)', fontWeight: 800, color: C.w }}>
                                مقترحات <span style={{ color: C.o }}>مجلس قادة المستقبل</span>
                            </h3>
                        </div>
                        <div className="g2" style={{ gap: 10 }}>
                            {leaderProposals.map((p, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', border: '1px solid rgba(255,255,255,.06)', borderRadius: 2 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.o, flexShrink: 0, marginTop: 7 }} />
                                    <span style={{ fontFamily: F, fontSize: 'clamp(.74rem,1.1vw,.86rem)', color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
          12. NEWS
      ════════════════════════════════════════ */}
            <section className="S" style={{ background: C.g1 }} ref={newsRef}>
                <div className="W">
                    <div className={`rv${newsVis ? ' on' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <Eyebrow>أخبار</Eyebrow>
                            <SplitTitle size="sm">أحدث الأخبار</SplitTitle>
                        </div>
                        <ArrowBtn to="/news">عرض الكل</ArrowBtn>
                    </div>
                    {!newsLoading && newsItems.length > 0 && (
                        <div className={`rv${newsVis ? ' on' : ''} d2`}>
                            <Swiper
                                className="news-swiper"
                                modules={[Autoplay, Navigation, Pagination]}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                navigation pagination={{ clickable: true }} loop spaceBetween={16}
                                breakpoints={{ 0: { slidesPerView: 1 }, 560: { slidesPerView: 2 }, 900: { slidesPerView: 3 } }}
                                style={{ paddingBottom: 44 }}
                            >
                                {newsItems.map(n => (
                                    <SwiperSlide key={n.id} style={{ height: 'auto' }}>
                                        <div className="news-card">
                                            <div style={{ position: 'relative', paddingTop: '58%' }}>
                                                <img src={n.imageUrl} alt={n.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div style={{ position: 'absolute', top: 0, left: 0, background: C.b, color: C.w, padding: '5px 14px', fontFamily: F, fontSize: '.66rem', fontWeight: 700, letterSpacing: 1 }}>
                                                    {new Date(n.publishedAt).toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div style={{ padding: '16px' }}>
                                                <p style={{ margin: '0 0 14px', fontWeight: 700, fontFamily: F, lineHeight: 1.5, fontSize: 'clamp(.84rem,1.2vw,.96rem)', color: C.k, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 52 }}>{n.title}</p>
                                                <Link to={`/news/${n.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: '.76rem', fontWeight: 700, color: C.b, textDecoration: 'none', borderBottom: `1px solid ${C.b}`, paddingBottom: 1 }}>
                                                    اقرأ المزيد <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
                                                </Link>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
            </section>

            {/* ════════════════════════════════════════
          13. CRAFT + TECHNICAL + EXAMS
      ════════════════════════════════════════ */}
            <section className="S" style={{ background: C.w, borderTop: `1px solid ${C.g3}` }} ref={craftRef}>
                <div className="W">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: 16 }}>
                        <div className={`rv${craftVis ? ' on' : ''} d1`}>
                            <Eyebrow>خدمات متخصصة</Eyebrow>
                            <SplitTitle size="sm">التدريب الحرفي والفني والتقييم</SplitTitle>
                        </div>
                    </div>
                    <div className="g3">
                        {craftItems.map((c, i) => (
                            <div key={i} className={`craft-card rv${craftVis ? ' on' : ''} d${i + 2}`}>
                                <div style={{ width: 56, height: 56, borderRadius: 2, background: 'rgba(8,101,168,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                                    <c.Icon sx={{ fontSize: 28, color: C.b }} />
                                </div>
                                <div style={{ width: 32, height: 2, background: C.o, marginBottom: 14 }} />
                                <h3 style={{ fontFamily: F, fontSize: 'clamp(.9rem,1.4vw,1.06rem)', fontWeight: 800, color: C.k, marginBottom: 10 }}>{c.title}</h3>
                                <p style={{ fontFamily: F, fontSize: 'clamp(.76rem,1.1vw,.87rem)', color: C.g5, lineHeight: 1.85, flex: 1, marginBottom: 20 }}>{c.text}</p>
                                <SolidBtn to={c.link} small>اقرأ المزيد <ArrowForwardIosIcon sx={{ fontSize: 10 }} /></SolidBtn>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
          14. LIBRARY
      ════════════════════════════════════════ */}
            <section style={{ background: C.k }} ref={libRef}>
                <div className={`rv${libVis ? ' on' : ''}`}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'clamp(260px,36vw,440px)' }}>
                        <div style={{ background: C.o, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(36px,5vw,64px)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)', top: -110, right: -110, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                <LibraryBooksIcon sx={{ fontSize: 'clamp(40px,5.5vw,64px)', color: C.w, marginBottom: 12 }} />
                                <div style={{ fontFamily: F, fontSize: 'clamp(1.1rem,2vw,1.7rem)', fontWeight: 900, color: C.w, lineHeight: 1.1, marginBottom: 12 }}>المكتبة العلمية المتخصصة</div>
                                <div style={{ width: 32, height: 2, background: 'rgba(255,255,255,.5)', margin: '0 auto 16px' }} />
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    {['5,000+ كتاب', '200+ دورية', 'رقمية'].map((t, i) => (
                                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.15)', color: C.w, borderRadius: 2, padding: '4px 12px', fontSize: '.7rem', fontFamily: F, fontWeight: 700 }}>
                                            <AutoStoriesIcon sx={{ fontSize: 12 }} /> {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: 'clamp(36px,5vw,64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Eyebrow light>المكتبة</Eyebrow>
                            <h3 style={{ fontFamily: F, fontSize: 'clamp(1.1rem,2vw,1.6rem)', fontWeight: 900, color: C.w, lineHeight: 1.2, marginBottom: 16 }}>
                                مرجعك العلمي الأشمل في علوم التشييد والإدارة
                            </h3>
                            <p style={{ fontFamily: F, fontSize: 'clamp(.8rem,1.2vw,.92rem)', color: 'rgba(255,255,255,.6)', lineHeight: 1.9, marginBottom: 28 }}>
                                مفتوحة لجميع المتدربين والباحثين. تضم آلاف المراجع الهندسية والمالية والإدارية مع قواعد بيانات رقمية متكاملة.
                            </p>
                            <div><SolidBtn to="/library" orange>زيارة المكتبة <ArrowForwardIosIcon sx={{ fontSize: 11 }} /></SolidBtn></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
          15. CUSTOMERS
      ════════════════════════════════════════ */}
            <div><CustomersSection /></div>
        </div>
    );
}