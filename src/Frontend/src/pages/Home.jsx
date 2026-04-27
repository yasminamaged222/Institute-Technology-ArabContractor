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
import EngineeringIcon from '@mui/icons-material/Engineering';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HardwareIcon from '@mui/icons-material/Hardware';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
    { title: 'الرؤية', text: 'تحقيق الريادة في التعليم والتدريب الهندسي والمهني محليًا وإقليميًا.' },
    { title: 'الرسالة', text: 'إعداد وتأهيل أجيال من الكوادر المهنية المتميزة وفق معايير الجودة.' },
    { title: 'إستراتيجية العمل', text: 'بيئة مبتكرة تجمع التميز التقني بالمهارات القيادية والعملية.' },
    { title: 'الأهداف', text: 'شراكات مع جامعات وهيئات دولية وربط المسار المهني بخطط التدريب.' },
];

const certificates = [
    { title: 'الاعتماد القومي للجودة', text: 'اعتماد من المعهد القومي للجودة التابع لوزارة التجارة والصناعة.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/NQI-lg.jpg' },
    { title: 'ISO 9001:2015', text: 'شهادة الجودة منذ عام 2000 في مجال تصميم وتنفيذ الخدمات التدريبية.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/iso9001.jpg' },
    { title: 'PMI', text: 'اعتماد معهد إدارة الأعمال (PMI) للإعداد لاجتياز شهادة PMP.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/pmi.jpg' },
    { title: 'Autodesk Training Center', text: 'مركز تدريب معتمد من Autodesk لأحدث برامج الهندسة والتصميم.', image: 'https://images.weserv.nl/?url=www.arabcont.com/icemt/assets/images/autodeskCert.jpg' },
];

// ── 5 schools ─────────────────────────────────────────────────────────────────
const schoolItems = [
    {
        name: 'مدرسة المقاولون العرب الفنية',
        location: 'فروع الشركة',
        IconComp: SchoolIcon,
        tag: 'مدرسة فنية',
        students: '—',
        schedule: 'وفق الجدول الدراسي',
        dept: 'تخصصات متعددة',
        desc: 'مدرسة فنية متكاملة تابعة لشركة المقاولون العرب، تُعِدّ جيلًا من الكوادر المهنية المؤهلة في مجالات الهندسة والحرف الصناعية بأعلى معايير الجودة.',
        isMakawlen: true,
        link: '/Technical_Schools',
    },
    {
        name: 'مدرسة المعدات الثقيلة الصناعية بالإسماعيلية',
        location: 'الإسماعيلية — فرع سيناء',
        IconComp: PrecisionManufacturingIcon,
        tag: 'ميكانيكا معدات',
        students: '20',
        schedule: 'كل سبت',
        dept: 'ميكانيكا المعدات',
        desc: 'تدريب الطلاب على ميكانيكا المعدات بورش فرع سيناء يوم السبت، مع توفير أتوبيس لنقلهم من المدرسة إلى موقع التدريب والعودة.',
        isMakawlen: false,
    },
    {
        name: 'مدرسة أبو رواش الثانوية الصناعية المشتركة',
        location: 'مركز تدريب شبرا',
        IconComp: EngineeringIcon,
        tag: 'ميكانيكا معدات',
        students: '18',
        schedule: 'الأربعاء والخميس',
        dept: 'ميكانيكا المعدات',
        desc: 'تدريب الطلاب على ميكانيكا المعدات يومين أسبوعيًا بالمعهد التكنولوجي — مركز تدريب شبرا، من بدء العام الدراسي.',
        isMakawlen: false,
    },
    {
        name: 'مدرسة الشاطبي الثانوية الصناعية',
        location: 'ورش العامرية — الإسكندرية',
        IconComp: ElectricBoltIcon,
        tag: 'قسم اللحام',
        students: '19',
        schedule: 'وفق الجدول',
        dept: 'اللحام',
        desc: 'تدريب الطلاب بورش العامرية المركزية بالإسكندرية، قسم اللحام، تحت إشراف مدربين متخصصين من المعهد التكنولوجي.',
        isMakawlen: false,
    },
    {
        name: 'مدرسة مدينة نصر الثانوية الصناعية',
        location: 'مركز تدريب شبرا',
        IconComp: ElectricBoltIcon,
        tag: 'قسم الكهرباء',
        students: '20',
        schedule: 'كل سبت',
        dept: 'الكهرباء',
        desc: 'التدريب يوم السبت من كل أسبوع بمركز تدريب شبرا، قسم الكهرباء، لبناء كوادر متخصصة في المجال الكهربائي الصناعي.',
        isMakawlen: false,
    },
];

// ── Protocols ─────────────────────────────────────────────────────────────────
const protocols = [
    { name: 'جمعية المحاسبين والمراجعين المصرية', country: 'مصر', type: 'مهني' },
    { name: 'مؤسسة المهندسين المدنيين البريطانيين (ICE)', country: 'المملكة المتحدة', type: 'دولي' },
    { name: 'مركز تحديث الصناعة', country: 'مصر', type: 'صناعي' },
    { name: 'الغرفة الألمانية العربية للصناعة والتجارة', country: 'ألمانيا', type: 'تجاري' },
    { name: 'المركز الإقليمي لتعليم الكبار (أسفك) - اليونسكو', country: 'اليونسكو', type: 'دولي' },
    { name: 'نقابة المهندسين بالقاهرة', country: 'مصر', type: 'مهني' },
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
const trainingPrograms = [
    { Icon: BuildCircleIcon, label: 'برامج للتدريب التحويلى' },
    { Icon: PeopleAltIcon, label: 'تكوين فرق التنفيذ الذاتى' },
    { Icon: MenuBookIcon, label: 'الحلول التدريبية المتكاملة' },
    { Icon: HardwareIcon, label: 'التدريب فى موقع العمل' },
];

// ─── INTERSECTION OBSERVER ────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVis(true);
        }, { threshold });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return [ref, vis];
}

const F = '"Droid Arabic Kufi","Noto Kufi Arabic",serif';
const C = {
    o: '#f57c00', od: '#e65100',
    b: '#0865a8', bd: '#044474',
    w: '#ffffff', k: '#0a0a0a', k2: '#111827',
    g1: '#f9fafb', g2: '#f3f4f6', g3: '#e5e7eb',
    g5: '#6b7280', g7: '#374151', g8: '#1f2937',
};

// ─── ATOMS ────────────────────────────────────────────────────────────────────
const Eyebrow = ({ children, light, center }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, justifyContent: center ? 'center' : 'flex-start' }}>
        <div style={{ width: 32, height: 2, background: C.o }} />
        <span style={{ fontFamily: F, fontSize: '.72rem', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: light ? 'rgba(255,255,255,.6)' : C.o }}>{children}</span>
        {center && <div style={{ width: 32, height: 2, background: C.o }} />}
    </div>
);

const SplitTitle = ({ children, light, size = 'lg', center }) => (
    <h2 style={{
        fontFamily: F, fontWeight: 900, margin: 0,
        fontSize: size === 'lg' ? 'clamp(1.8rem,4vw,3.2rem)' : 'clamp(1.4rem,2.8vw,2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.02em',
        color: light ? C.w : C.k,
        textAlign: center ? 'center' : 'inherit',
    }}>{children}</h2>
);

const ArrowBtn = ({ to, children, inv }) => (
    <Link to={to} style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontFamily: F, fontSize: 'clamp(.78rem,1.1vw,.88rem)', fontWeight: 700,
        color: inv ? C.w : C.b, textDecoration: 'none',
        background: inv ? 'rgba(255,255,255,.1)' : 'rgba(8,101,168,.08)',
        border: `1.5px solid ${inv ? 'rgba(255,255,255,.25)' : 'rgba(8,101,168,.25)'}`,
        padding: '9px 20px', borderRadius: 40,
        transition: 'all .25s cubic-bezier(.22,1,.36,1)',
    }}
        onMouseEnter={e => { e.currentTarget.style.background = inv ? 'rgba(255,255,255,.18)' : C.b; e.currentTarget.style.color = C.w; e.currentTarget.style.borderColor = inv ? 'rgba(255,255,255,.5)' : C.b; e.currentTarget.style.gap = '14px'; }}
        onMouseLeave={e => { e.currentTarget.style.background = inv ? 'rgba(255,255,255,.1)' : 'rgba(8,101,168,.08)'; e.currentTarget.style.color = inv ? C.w : C.b; e.currentTarget.style.borderColor = inv ? 'rgba(255,255,255,.25)' : 'rgba(8,101,168,.25)'; e.currentTarget.style.gap = '10px'; }}
    >{children} <NorthEastIcon sx={{ fontSize: 14 }} /></Link>
);

const SolidBtn = ({ to, href, children, orange, small }) => {
    const s = {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: F, fontSize: small ? '.78rem' : 'clamp(.8rem,1.2vw,.9rem)', fontWeight: 700,
        color: C.w, textDecoration: 'none',
        background: orange ? C.o : C.b,
        padding: small ? '8px 20px' : 'clamp(10px,1.3vw,13px) clamp(22px,3vw,34px)',
        borderRadius: 4, transition: 'transform .2s, opacity .2s',
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

    const [statsRef, statsVis] = useReveal(0.05);
    const [featRef, featVis] = useReveal(0.08);
    const [aboutRef, aboutVis] = useReveal(0.06);
    const [visionRef, visionVis] = useReveal(0.06);
    const [dlRef, dlVis] = useReveal(0.08);
    const [certRef, certVis] = useReveal(0.06);
    const [protoRef, protoVis] = useReveal(0.06);
    const [craftRef, craftVis] = useReveal(0.06);
    const [libRef, libVis] = useReveal(0.05);
    const [newsRef, newsVis] = useReveal(0.06);
    const [coursesRef, coursesVis] = useReveal(0.06);
    const [techRef, techVis] = useReveal(0.06);
    const [schoolsRef, schoolsVis] = useReveal(0.05);

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

        /* ══ SCROLL REVEAL ══ */
        .rv      {opacity:0;transform:translateY(40px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1);}
        .rv-left {opacity:0;transform:translateX(40px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1);}
        .rv-scale{opacity:0;transform:scale(.94);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1);}
        .rv.on,.rv-left.on,.rv-scale.on{opacity:1;transform:none;}
        .d1{transition-delay:.06s;}.d2{transition-delay:.14s;}.d3{transition-delay:.22s;}
        .d4{transition-delay:.30s;}.d5{transition-delay:.38s;}.d6{transition-delay:.46s;}

        .W{max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,56px);}
        .S{padding:clamp(48px,7vw,96px) clamp(16px,4vw,56px);}

        /* ── Hero ── */
        .hero-swiper{width:100%;height:clamp(300px,100vh,710px);}
        .hero-swiper .swiper-slide{display:flex;align-items:center;justify-content:center;}
        .hero-swiper .swiper-button-prev,.hero-swiper .swiper-button-next{
          width:50px;height:50px;border-radius:50%;
          background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.35);
          color:#fff!important;top:90%!important;transform:translateY(-50%);
          transition:background .25s,border-color .25s,transform .25s;backdrop-filter:blur(6px);
        }
        .hero-swiper .swiper-button-prev{right:60px!important;left:auto!important;}
        .hero-swiper .swiper-button-next{left:60px!important;right:auto!important;}
        .hero-swiper .swiper-button-prev::after,.hero-swiper .swiper-button-next::after{font-size:20px!important;font-weight:500;}
        .hero-swiper .swiper-button-prev:hover,.hero-swiper .swiper-button-next:hover{background:${C.o};border-color:${C.o};transform:translateY(-50%) scale(1.08);}
        .hero-swiper .swiper-pagination{bottom:22px!important;display:flex;gap:6px;justify-content:center;width:100%!important;left:0!important;}
        .hero-swiper .swiper-pagination-bullet{background:rgba(255,255,255,.35);opacity:1;width:24px;height:3px;border-radius:0;transition:all .3s;}
        .hero-swiper .swiper-pagination-bullet-active{background:${C.o};width:44px;}

        /* ── Stats ── */
        .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);}
        @media(max-width:760px){.stats-bar{grid-template-columns:repeat(2,1fr);}}
        .stat-cell{padding:clamp(20px,3.5vw,36px) clamp(16px,2.5vw,28px);border-left:1px solid rgba(255,255,255,.1);text-align:center;}
        .stat-cell:last-child{border-left:none;}

        /* ── Feature cards ── */
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid ${C.g3};}
        @media(max-width:780px){.feat-grid{grid-template-columns:1fr;}}
        .feat-card{padding:clamp(32px,4vw,52px) clamp(24px,3vw,40px);border-left:1px solid ${C.g3};position:relative;overflow:hidden;transition:background .3s;display:flex;flex-direction:column;align-items:center;text-align:center;}
        .feat-card:last-child{border-left:none;}
        @media(max-width:780px){.feat-card{border-left:none;border-bottom:1px solid ${C.g3};}.feat-card:last-child{border-bottom:none;}}
        .feat-card::before{content:'';position:absolute;bottom:0;right:0;width:100%;height:3px;background:${C.o};transform:scaleX(0);transform-origin:center;transition:transform .35s cubic-bezier(.22,1,.36,1);}
        .feat-card:hover{background:${C.g1};}.feat-card:hover::before{transform:scaleX(1);}
        .feat-num{font-family:${F};font-size:clamp(2.4rem,4vw,3.8rem);font-weight:900;color:${C.g3};line-height:1;margin-bottom:20px;letter-spacing:-2px;transition:color .3s;}
        .feat-card:hover .feat-num{color:${C.o};}

        /* ── Downloads ── */
        .dl-row{display:flex;align-items:center;gap:16px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.08);text-decoration:none;color:${C.w};transition:background .2s;}
        .dl-row:last-child{border-bottom:none;}.dl-row:hover{background:rgba(255,255,255,.04);}

        /* ── Vision ── */
        .vis-item{padding:28px;border-radius:2px;border:1px solid ${C.g3};background:${C.w};transition:border-color .25s,box-shadow .25s;}
        .vis-item:hover{border-color:${C.o};box-shadow:0 4px 24px rgba(245,124,0,.10);}

        /* ── Cert cards ── */
        .cert-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:2px;padding:24px;color:${C.w};transition:background .25s,border-color .25s;height:100%;display:flex;flex-direction:column;gap:14px;}
        .cert-card:hover{background:rgba(255,255,255,.1);border-color:rgba(245,124,0,.4);}

        /* ══ PROTOCOLS — card grid (new style) ══ */
        .proto-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        @media(max-width:900px){.proto-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:560px){.proto-grid{grid-template-columns:1fr;}}
        .proto-card{
          position:relative;overflow:hidden;border-radius:8px;
          background:${C.w};border:1px solid ${C.g3};
          padding:24px 20px;display:flex;flex-direction:column;gap:12px;
          transition:border-color .25s,transform .25s,box-shadow .25s;
        }
        .proto-card:hover{border-color:${C.b};transform:translateY(-4px);box-shadow:0 8px 28px rgba(8,101,168,.12);}
        .proto-card::after{content:'';position:absolute;top:0;right:0;width:3px;height:100%;
          background:linear-gradient(180deg,${C.o},${C.b});
          transform:scaleY(0);transform-origin:top;transition:transform .3s cubic-bezier(.22,1,.36,1);}
        .proto-card:hover::after{transform:scaleY(1);}

        /* ══ SCHOOLS ══ */
        .school-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        @media(max-width:960px){.school-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:560px){.school-grid{grid-template-columns:1fr;}}
        .school-card{border-radius:8px;border:1px solid ${C.g3};background:${C.w};display:flex;flex-direction:column;overflow:hidden;transition:border-color .25s,transform .25s,box-shadow .25s;}
        .school-card:hover{border-color:${C.b};transform:translateY(-5px);box-shadow:0 12px 32px rgba(8,101,168,.12);}
        .sc-meta{font-family:${F};font-size:.7rem;font-weight:700;color:${C.g5};display:flex;align-items:center;gap:5px;}

        /* ── Craft ── */
        .craft-card{padding:clamp(22px,3vw,36px);border:1px solid ${C.g3};border-radius:2px;background:${C.w};transition:border-color .25s,transform .25s;}
        .craft-card:hover{border-color:${C.o};transform:translateY(-4px);}

        /* ── News ── */
        .news-card{overflow:hidden;border-radius:2px;border:1px solid ${C.g3};background:${C.w};transition:border-color .25s,transform .25s;height:100%;}
        .news-card:hover{border-color:${C.b};transform:translateY(-4px);}
        .news-swiper .swiper-button-prev,.news-swiper .swiper-button-next{width:44px;height:44px;border-radius:50%;background:${C.w};border:1px solid ${C.g3};color:${C.b}!important;transition:all .25s;}
        .news-swiper .swiper-button-prev{right:-24px;}.news-swiper .swiper-button-next{left:-24px;right:auto;}
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
        .ab-split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,6vw,80px);align-items:start;}
        @media(max-width:780px){.ab-split{grid-template-columns:1fr;}}
        .prog-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0 24px;}
        @media(max-width:480px){.prog-grid{grid-template-columns:1fr;}}
        .ov-stats{display:grid;grid-template-columns:repeat(3,1fr);overflow:hidden;background:${C.w};border:1px solid ${C.g3};border-radius:2px;margin-bottom:clamp(20px,3vw,32px);}
        @media(max-width:560px){.ov-stats{grid-template-columns:1fr;}}
        .ov-stat{padding:clamp(16px,2.5vw,24px) 16px;text-align:center;border-left:1px solid ${C.g3};}
        .ov-stat:last-child{border-left:none;}
        .why-card{padding:clamp(18px,2.5vw,26px);border:1px solid ${C.g3};border-radius:2px;background:${C.w};transition:border-color .25s,transform .25s;display:flex;flex-direction:column;gap:10px;}
        .why-card:hover{border-color:${C.o};transform:translateY(-3px);}
        a.ob-outline{display:inline-flex;align-items:center;gap:8px;font-family:${F};font-size:clamp(.78rem,1.1vw,.88rem);font-weight:700;color:${C.o};text-decoration:none;border:1.5px solid ${C.o};padding:clamp(9px,1.2vw,12px) clamp(20px,2.8vw,32px);border-radius:4px;transition:background .2s,color .2s;}
        a.ob-outline:hover{background:${C.o};color:#fff;}
        @keyframes bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(7px);}}
        .scroll-ind{animation:bounce 2s ease-in-out infinite;}
        @media(max-width:480px){.hero-h1{font-size:1.4rem!important;}}
      `}</style>

            {/* 1 ─ HERO ──────────────────────────────────────────────────────── */}
            <section style={{ position: 'relative' }}>
                <Swiper className="hero-swiper" modules={[Autoplay, Navigation, Pagination]}
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                    navigation pagination={{ clickable: true }} loop speed={800}>
                    {slides.map((sl, i) => (
                        <SwiperSlide key={i}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${sl.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(4,20,40,.82) 0%, rgba(4,20,40,.58) 60%, rgba(4,20,40,.28) 100%)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(0,0,0,.5) 0%,transparent 50%)' }} />
                            <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 700, textAlign: 'center', padding: '0 clamp(16px,5vw,56px)', paddingBottom: 'clamp(48px,6vh,80px)' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: '.68rem', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: C.o, marginBottom: 14 }}>
                                    <div style={{ width: 24, height: 2, background: C.o }} />{sl.tag}<div style={{ width: 24, height: 2, background: C.o }} />
                                </div>
                                <p style={{ fontFamily: F, fontSize: 'clamp(.78rem,1.2vw,.9rem)', color: 'rgba(255,255,255,.55)', marginBottom: 10, fontWeight: 600 }}>{sl.subtitle}</p>
                                <h1 className="hero-h1" style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(1.7rem,4.5vw,3.8rem)', color: C.w, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 28 }}>{sl.title}</h1>
                                <div style={{ width: 56, height: 3, background: C.o, margin: '0 auto 28px', borderRadius: 2 }} />
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                                    <SolidBtn to={sl.link} orange>اقرأ المزيد <ArrowForwardIosIcon sx={{ fontSize: 11 }} /></SolidBtn>
                                    <ArrowBtn to="/overview" inv>تعرف على المعهد</ArrowBtn>
                                </div>
                            </div>
                            <div className="scroll-ind" style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
                                <div style={{ width: 22, height: 34, border: '1.5px solid rgba(255,255,255,.3)', borderRadius: 11, display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
                                    <div style={{ width: 3, height: 8, background: C.o, borderRadius: 2 }} />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* 2 ─ STATS ─────────────────────────────────────────────────────── */}
            <div ref={statsRef} style={{ background: C.k, borderBottom: `3px solid ${C.o}` }}>
                <div className="W">
                    <div className="stats-bar">
                        {stats.map((s, i) => (
                            <div key={i} className={`stat-cell rv${statsVis ? ' on' : ''} d${i + 1}`}>
                                <div style={{ fontFamily: F, fontSize: 'clamp(1.6rem,3.2vw,2.4rem)', fontWeight: 900, color: C.o, lineHeight: 1 }}>{s.n}</div>
                                <div style={{ fontFamily: F, fontSize: '.7rem', color: 'rgba(255,255,255,.45)', marginTop: 6, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3 ─ FEATURES ──────────────────────────────────────────────────── */}
            <section style={{ background: C.w }} ref={featRef}>
                <div className="W" style={{ paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 0 }}>
                    <div className={`rv${featVis ? ' on' : ''}`} style={{ textAlign: 'center', marginBottom: 36 }}>
                        <Eyebrow center>ما يميزنا</Eyebrow>
                        <SplitTitle center>لماذا المعهد؟</SplitTitle>
                        <div style={{ width: 56, height: 3, background: C.o, margin: '16px auto 24px', borderRadius: 2 }} />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ArrowBtn to="/overview">تعرف على المزيد</ArrowBtn>
                        </div>
                    </div>
                </div>
                <div className="feat-grid" style={{ maxWidth: '100%', borderRight: `1px solid ${C.g3}`, borderLeft: `1px solid ${C.g3}` }}>
                    {features.map((f, i) => (
                        <div key={i} className={`feat-card rv${featVis ? ' on' : ''} d${i + 1}`}>
                            <div className="feat-num">{f.num}</div>
                            <div style={{ marginBottom: 16 }}><img src={f.icon} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} /></div>
                            <h3 style={{ fontFamily: F, fontSize: 'clamp(.94rem,1.5vw,1.1rem)', fontWeight: 800, color: C.k, lineHeight: 1.3, marginBottom: 10 }}>{f.title}</h3>
                            <p style={{ fontFamily: F, fontSize: 'clamp(.78rem,1.1vw,.88rem)', color: C.g5, lineHeight: 1.85, marginBottom: 22 }}>{f.subtitle}</p>
                            <Link to={f.link} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: '.76rem', fontWeight: 700, color: C.b, textDecoration: 'none', borderBottom: `1px solid ${C.b}`, paddingBottom: 2, transition: 'gap .2s' }}
                                onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                                onMouseLeave={e => e.currentTarget.style.gap = '6px'}>
                                استعرض <NorthEastIcon sx={{ fontSize: 13 }} />
                            </Link>
                        </div>
                    ))}
                </div>
                <div style={{ height: 4, background: `linear-gradient(90deg,${C.o},${C.b})` }} />
            </section>

            {/* 4 ─ ABOUT ─────────────────────────────────────────────────────── */}
            <section className="S" style={{ background: C.g1 }} ref={aboutRef}>
                <div className="W">
                    <div className={`ab-split rv${aboutVis ? ' on' : ''}`} style={{ marginBottom: 'clamp(28px,4vw,44px)' }}>
                        <div className={`rv-scale${aboutVis ? ' on' : ''} d1`} style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -12, right: -12, width: 52, height: 52, background: C.o, zIndex: 0 }} />
                            <img src={logo} alt="المعهد" style={{ width: '100%', display: 'block', borderRadius: 2, aspectRatio: '4/3', objectFit: 'cover', position: 'relative', zIndex: 1 }} />
                            <div style={{ position: 'absolute', bottom: 20, left: 0, background: C.k, padding: '12px 18px', zIndex: 2 }}>
                                <div style={{ fontFamily: F, fontSize: 'clamp(1rem,1.8vw,1.4rem)', fontWeight: 900, color: C.o, lineHeight: 1 }}>1978</div>
                                <div style={{ fontFamily: F, fontSize: '.68rem', color: 'rgba(255,255,255,.5)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 3 }}>تأسيس المعهد</div>
                            </div>
                        </div>
                        <div className={`rv${aboutVis ? ' on' : ''} d2`}>
                            <Eyebrow>نبذة عامة</Eyebrow>
                            <SplitTitle>رائد في التدريب<br />الهندسي والإداري والحرفي</SplitTitle>
                            <div style={{ width: 44, height: 3, background: C.o, margin: '16px 0 18px' }} />
                            <p style={{ fontFamily: F, fontSize: 'clamp(.86rem,1.25vw,1rem)', color: C.g7, lineHeight: 2, marginBottom: 18, textAlign: 'justify' }}>
                                أول شركة مقاولات في الشرق الأوسط تُنشئ معهدًا للتدريب منذ أكثر من 45 عامًا. نُعِدّ أجيالًا متميزة في التشييد والإدارة والتقنية، ونخدم الوزارات والهيئات والقطاع الخاص بمعايير الجودة الدولية.
                            </p>
                            <div className="prog-grid">
                                {trainingPrograms.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: `1px solid ${C.g3}`, borderRadius: 2, background: C.w, transition: 'border-color .2s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = C.o}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = C.g3}>
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
                </div>
            </section>

            {/* 5 ─ VISION ────────────────────────────────────────────────────── */}
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

            {/* 6 ─ DOWNLOADS ─────────────────────────────────────────────────── */}
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

            {/* 7 ─ COURSES ───────────────────────────────────────────────────── */}
            <section style={{ background: C.w, paddingBottom: 24 }} ref={coursesRef}>
                <div className="W" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
                    <div className={`rv${coursesVis ? ' on' : ''}`} style={{ textAlign: 'center', marginBottom: 40 }}>
                        <Eyebrow center>دوراتنا</Eyebrow>
                        <SplitTitle center>أحدث الدورات التدريبية</SplitTitle>
                        <div style={{ width: 56, height: 3, background: C.o, margin: '16px auto 0', borderRadius: 2 }} />
                    </div>
                </div>
                <DynamicCoursesSection />
            </section>

            {/* 8 ─ CERTIFICATIONS ────────────────────────────────────────────── */}
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
                        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4500, disableOnInteraction: false }}
                            pagination={{ clickable: true }} loop spaceBetween={16}
                            breakpoints={{ 0: { slidesPerView: 1 }, 560: { slidesPerView: 2 }, 900: { slidesPerView: 3 } }}
                            style={{ paddingBottom: 44 }}>
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

            {/* 9 ─ TECHNICAL EDUCATION + SCHOOLS ─────────────────────────────── */}
            <section style={{ background: C.g1 }} ref={techRef}>
                {/* Compact header */}
                <div className="W" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
                    <div className={`rv${techVis ? ' on' : ''}`} style={{ textAlign: 'center', marginBottom: 20 }}>
                        <Eyebrow center>برامجنا</Eyebrow>
                        <SplitTitle center >المدارس المشاركة في البروتوكول التدريبي</SplitTitle>
                        <div style={{ width: 56, height: 3, background: C.o, margin: '14px auto 16px', borderRadius: 2 }} />
                        <p style={{ fontFamily: F, fontSize: 'clamp(.82rem,1.2vw,.95rem)', color: C.g5, lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}>
                            نتعاون مع وزارة التربية والتعليم لتأهيل طلاب الثانويات الصناعية عمليًا داخل ورش ومراكز تدريب المعهد في عدة محافظات.
                        </p>
                    </div>
                </div>
                {/* Schools grid */}
                <div className="W" style={{ paddingTop: 'clamp(36px,5vw,56px)', paddingBottom: 'clamp(48px,7vw,80px)' }} ref={schoolsRef}>
                    <div className="school-grid">
                        {schoolItems.map((sc, i) => (
                            <div key={i} className={`school-card rv${schoolsVis ? ' on' : ''} d${Math.min(i + 1, 6)}`} >

                                {/* Head */}
                                <div style={{
                                    padding: '22px 20px 18px',
                                    borderBottom: `1px solid ${C.g3}`,
                                    background: sc.isMakawlen ? `linear-gradient(135deg,${C.b} 0%,${C.bd} 100%)` : C.w,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
                                        <div style={{
                                            width: 50, height: 50, borderRadius: 8, flexShrink: 0,
                                            background: sc.isMakawlen ? 'rgba(255,255,255,.15)' : 'rgba(8,101,168,.08)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <sc.IconComp sx={{ fontSize: 26, color: sc.isMakawlen ? C.w : C.b }} />
                                        </div>
                                        {/* Tag pill */}
                                        <span style={{
                                            fontFamily: F, fontSize: '.62rem', fontWeight: 700, letterSpacing: 1.2,
                                            padding: '3px 10px', borderRadius: 20,
                                            background: sc.isMakawlen ? 'rgba(255,255,255,.15)' : 'rgba(8,101,168,.1)',
                                            color: sc.isMakawlen ? C.w : C.b,
                                            border: sc.isMakawlen ? '1px solid rgba(255,255,255,.25)' : '1px solid rgba(8,101,168,.2)',
                                        }}>{sc.tag}</span>
                                    </div>
                                    <h3 style={{ fontFamily: F, fontSize: 'clamp(.84rem,1.2vw,.96rem)', fontWeight: 800, lineHeight: 1.45, color: sc.isMakawlen ? C.w : C.k, margin: 0 }}>{sc.name}</h3>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontFamily: F, fontSize: 'clamp(.74rem,1vw,.84rem)', color: C.g5, lineHeight: 1.8, marginBottom: 16, flex: 1 }}>{sc.desc}</p>

                                    {/* Meta */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                                        <span className="sc-meta"><LocationOnIcon sx={{ fontSize: 14, color: C.b }} />{sc.location}</span>
                                        <span className="sc-meta"><CalendarTodayIcon sx={{ fontSize: 13, color: C.b }} />{sc.schedule}</span>
                                        <span className="sc-meta"><GroupsIcon sx={{ fontSize: 14, color: C.b }} />{sc.students !== '—' ? `${sc.students} طالب` : 'متعدد'}</span>
                                    </div>

                                    {/* CTA */}
                                    {sc.isMakawlen ? (
                                        <SolidBtn to={sc.link} orange small>
                                            اقرأ المزيد <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
                                        </SolidBtn>
                                    ) : (
                                        <Link to="/technical-education" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            fontFamily: F, fontSize: '.76rem', fontWeight: 700,
                                            color: C.b, textDecoration: 'none',
                                            borderBottom: `1px solid ${C.b}`, paddingBottom: 2,
                                            transition: 'gap .2s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                                            onMouseLeave={e => e.currentTarget.style.gap = '6px'}>
                                            عرض تطوير التعليم الفني <OpenInNewIcon sx={{ fontSize: 12 }} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10 ─ PROTOCOLS (redesigned) ────────────────────────────────────── */}
            <section className="S" style={{ background: C.k2, position: 'relative', overflow: 'hidden' }} ref={protoRef}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', bottom: -80, left: -80, width: 340, height: 340, borderRadius: '50%', border: '1px solid rgba(8,101,168,.15)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(245,124,0,.1)', pointerEvents: 'none' }} />

                <div className="W" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
                        <div className={`rv${protoVis ? ' on' : ''} d1`}>
                            <Eyebrow light>شراكاتنا</Eyebrow>
                            <SplitTitle light size="sm">البروتوكولات والاتفاقيات</SplitTitle>
                            <div style={{ width: 44, height: 3, background: C.o, marginTop: 16 }} />
                        </div>
                        <div className={`rv${protoVis ? ' on' : ''} d2`}>
                            <SolidBtn to="/protocols" orange>عرض الكل <ArrowForwardIosIcon sx={{ fontSize: 10 }} /></SolidBtn>
                        </div>
                    </div>

                    <p className={`rv${protoVis ? ' on' : ''} d2`} style={{ fontFamily: F, fontSize: 'clamp(.82rem,1.2vw,.95rem)', color: 'rgba(255,255,255,.5)', lineHeight: 1.8, marginBottom: 36, maxWidth: 560 }}>
                        بروتوكولات تعاون استراتيجية مع مؤسسات وهيئات دولية معتمدة لتعزيز جودة التدريب والاعتماد المهني.
                    </p>

                    {/* Cards */}
                    <div className="proto-grid">
                        {protocols.map((p, i) => (
                            <div key={i} className={`proto-card rv${protoVis ? ' on' : ''} d${Math.min(i + 1, 6)}`}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(8,101,168,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <HandshakeIcon sx={{ color: C.b, fontSize: 22 }} />
                                    </div>
                                    <span style={{
                                        fontFamily: F, fontSize: '.62rem', fontWeight: 700, letterSpacing: 1.2,
                                        padding: '3px 10px', borderRadius: 20,
                                        background: 'rgba(245,124,0,.1)', border: '1px solid rgba(245,124,0,.2)',
                                        color: C.o,
                                    }}>{p.type}</span>
                                </div>
                                <h4 style={{ fontFamily: F, fontSize: 'clamp(.82rem,1.2vw,.94rem)', fontWeight: 800, color: C.k, lineHeight: 1.45, margin: 0 }}>{p.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <LocationOnIcon sx={{ fontSize: 13, color: C.g5 }} />
                                    <span style={{ fontFamily: F, fontSize: '.7rem', color: C.g5, fontWeight: 600 }}>{p.country}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 11 ─ NEWS ─────────────────────────────────────────────────────── */}
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
                            <Swiper className="news-swiper" modules={[Autoplay, Navigation, Pagination]}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                navigation pagination={{ clickable: true }} loop spaceBetween={16}
                                breakpoints={{ 0: { slidesPerView: 1 }, 560: { slidesPerView: 2 }, 900: { slidesPerView: 3 } }}
                                style={{ paddingBottom: 44 }}>
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

            {/* 12 ─ CRAFT + TECHNICAL + EXAMS ─────────────────────────────────── */}
            <section className="S" style={{ background: C.w, borderTop: `1px solid ${C.g3}` }} ref={craftRef}>
                <div className="W">
                    <div className={`rv${craftVis ? ' on' : ''} d1`} style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,44px)' }}>
                        <Eyebrow center>خدمات متخصصة</Eyebrow>
                        <SplitTitle center size="sm">التدريب الحرفي والفني والتقييم</SplitTitle>
                        <div style={{ width: 48, height: 3, background: C.o, margin: '16px auto 0', borderRadius: 2 }} />
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

            {/* 13 ─ LIBRARY ──────────────────────────────────────────────────── */}
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

            {/* ── Gap spacer before Customers ── */}
            <div style={{ height: 'clamp(48px,7vw,80px)', background: C.w }} />

            {/* 14 ─ CUSTOMERS ────────────────────────────────────────────────── */}
            <div><CustomersSection /></div>
        </div>
    );
}