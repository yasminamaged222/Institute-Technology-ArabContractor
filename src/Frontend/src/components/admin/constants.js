// ════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════════════════════════════════════
export const T = {
    orange: '#f57c00',
    orangeLight: '#ff9a3c',
    orangeDark: '#bf5200',
    blue: '#0865a8',
    blueLight: '#1a84d4',
    blueDark: '#044478',
    black: '#0a0a0a',
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray100: '#f0f1f2',
    gray300: '#d0d3d8',
    gray500: '#6b7280',
    gray700: '#374151',
    font: '"Droid Arabic Kufi",  serif',
};

// ════════════════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════════════════
export const ADMIN_EMAILS = [
    'yasminamaged22@gmail.com',
    'abeer.naguib@gmail.com',
    'amrshamy91@gmail.com',
    'abdelmawla1642@gmail.com',
    'mostafa.awaad@gmail.com',
];

export const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';
export const API_HOST = 'https://acwebsite-icmet-test.azurewebsites.net';
export const NAVBAR_H = 70;
export const OVERVIEW_H = 38;
export const ITEMS_PER_PAGE = 10;

// ════════════════════════════════════════════════════════════════════════════
// REFUND STATUS META
// ════════════════════════════════════════════════════════════════════════════
export const REFUND_STATUS_META = {
    Pending: { label: 'قيد المراجعة', icon: '⏳', color: '#b45309', bg: '#fff8f0', border: 'rgba(245,124,0,0.35)' },
    Approved: { label: 'موافق عليه', icon: '✅', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
    Sent: { label: 'أُرسل للبنك', icon: '🏦', color: '#0865a8', bg: 'rgba(8,101,168,0.06)', border: 'rgba(8,101,168,0.35)' },
    Rejected: { label: 'مرفوض', icon: '❌', color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.3)' },
    // lowercase aliases (API may return either casing)
    pending: { label: 'قيد المراجعة', icon: '⏳', color: '#b45309', bg: '#fff8f0', border: 'rgba(245,124,0,0.35)' },
    approved: { label: 'موافق عليه', icon: '✅', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
    sent: { label: 'أُرسل للبنك', icon: '🏦', color: '#0865a8', bg: 'rgba(8,101,168,0.06)', border: 'rgba(8,101,168,0.35)' },
    sent_to_bank: { label: 'أُرسل للبنك', icon: '🏦', color: '#0865a8', bg: 'rgba(8,101,168,0.06)', border: 'rgba(8,101,168,0.35)' },
    rejected: { label: 'مرفوض', icon: '❌', color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.3)' },
};

// ════════════════════════════════════════════════════════════════════════════
// SIDEBAR TABS
// ════════════════════════════════════════════════════════════════════════════
export const TABS = [
    { id: 'users', label: 'المستخدمون', icon: '👤' },
    { id: 'courses', label: 'الدورات', icon: '📚' },
    { id: 'attendance', label: 'الحضور', icon: '✅' },
    { id: 'certificates', label: 'الشهادات', icon: '📜' },
    { id: 'refunds', label: 'المستردات', icon: '💳' },
    { id: 'financial', label: 'المالية', icon: '💰' },
    { id: 'lecturers', label: 'المحاضرون', icon: '🎓' },
    { id: 'news', label: 'الأخبار', icon: '📰' },
    { id: 'books', label: 'الكتب', icon: '📖' },
    { id: 'planwork', label: 'خطة العمل', icon: '📋' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
];

// ════════════════════════════════════════════════════════════════════════════
// PAGE HERO META (tag + title per tab)
// ════════════════════════════════════════════════════════════════════════════
export const TAB_TITLES = {
    users: { tag: 'إدارة البيانات', title: ['المستخدمون', 'والدورات'] },
    courses: { tag: 'إدارة البيانات', title: ['الدورات', 'والمستخدمون'] },
    attendance: { tag: 'متابعة الحضور', title: ['سجل', 'الحضور'] },
    certificates: { tag: 'إدارة الشهادات', title: [ 'الشهادات', 'الإلكترونية'] },
    refunds: { tag: 'المالية', title: ['طلبات', 'الاسترداد'] },
    financial: { tag: 'التقارير المالية', title: ['إيرادات', 'المعهد'] },
    lecturers: { tag: 'إدارة الكوادر', title: ['إدارة', 'المحاضرين'] },
    news: { tag: 'إدارة المحتوى', title: ['الأخبار', 'والمستجدات'] },   // ← added
    books: { tag: 'إدارة المحتوى', title: ['إدارة', 'الكتب'] },          // ← added
    planwork: { tag: 'التخطيط', title: ['خطة', 'العمل'] },            // ← added
    settings: { tag: 'إعدادات النظام', title: ['إدارة', 'المديرين'] },
};