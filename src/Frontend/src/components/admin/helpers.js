import { API_HOST } from './constants';

export function fmtDate(val) {
    if (!val) return '';
    try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return String(val);
        return d.toISOString().split('T')[0];
    } catch { return String(val); }
}

export function toStatusKey(s) {
    if (!s) return 'Pending';
    const map = {
        pending: 'Pending',
        approved: 'Approved',
        sent: 'Sent',
        sent_to_bank: 'Sent',
        rejected: 'Rejected',
    };
    return map[String(s).toLowerCase()] ?? s;
}

export function resolveCertUrl(url) {
    if (!url) return null;
    if (url === 'uploaded') return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_HOST}${url}`;
    return url;
}

/** Reverse both headers and every row so Excel/PDF exports read RTL. */
export function rtlExport(headers, rows) {
    return {
        headers: [...headers].reverse(),
        rows: rows.map(r => [...r].reverse()),
    };
}

export function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

let _logoCache = null;

/** Call this whenever you swap the logo asset so the old version is not re-used. */
export function clearLogoCache() {
    _logoCache = null;
}

export function getLogoBase64(logoSrc) {
    return new Promise(resolve => {
        if (_logoCache) { resolve(_logoCache); return; }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const c = document.createElement('canvas');
                c.width = img.naturalWidth || 300;
                c.height = img.naturalHeight || 200;
                c.getContext('2d').drawImage(img, 0, 0);
                _logoCache = c.toDataURL('image/png');
                resolve(_logoCache);
            } catch { resolve(null); }
        };
        img.onerror = () => resolve(null);
        img.src = logoSrc;
    });
}