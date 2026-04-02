import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';
const FILES_BASE = 'http://www.arabcont.com/icemt/assets/pdf/planpdf/';

const mediaQueryStyles = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes modalSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes certModalSlideUp { from { transform: translateY(40px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
  @keyframes certShine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @media (max-width: 768px) {
    .overview-bar { padding: 10px 16px !important; }
    .breadcrumb-text { font-size: 12px !important; }
    .main-container { padding: 20px 16px !important; }
    .content-wrapper { grid-template-columns: 1fr !important; gap: 24px !important; }
    .right-sidebar { position: static !important; order: -1; }
    .refund-modal-actions { flex-direction: column !important; }
    .cert-modal-card { max-width: 98vw !important; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .content-wrapper { grid-template-columns: 1fr 320px !important; gap: 24px !important; }
  }
  @media (hover: hover) {
    .btnAddCart:hover { background-color: #0865a8 !important; color: #ffffff !important; }
    .btnBuyNow:hover { transform: translateY(-2px); }
    .btnEnroll:hover { transform: translateY(-2px); }
    .btnViewMyCourses:hover { transform: translateY(-2px); }
    .btnRefund:hover { background-color: #e53935 !important; color: #ffffff !important; }
    .fileItemLink:hover { background-color: #eaf3ff !important; border-color: #0865a8 !important; }
    .otherCourseCard:hover { background-color: #ffffff !important; border-color: #0865a8 !important; transform: translateY(-2px); }
    .topicCard:hover { background-color: #ffffff !important; border-color: #0865a8 !important; }
    .btnCertPreview:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.45) !important; }
    .btnCertDownloadModal:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.35) !important; }
  }
`;

const S = {
    overviewBar: { position: 'fixed', left: 0, top: '64px', zIndex: 40, width: '100%', backgroundColor: '#f5f5f5', padding: '12px 24px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e0e0e0' },
    overviewBarText: { textAlign: 'center', fontSize: '14px', fontFamily: '"Droid Arabic Kufi",serif', color: '#000' },
    breadcrumbLink: { marginLeft: '12px', color: '#0865a8', textDecoration: 'none', cursor: 'pointer', fontWeight: '500' },
    breadcrumbSep: { color: '#000', margin: '0 8px', opacity: 0.4 },
    breadcrumbCur: { marginRight: '12px', color: '#000', fontWeight: '600' },
    pageWrapper: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Droid Arabic Kufi",serif', direction: 'rtl' },
    heroSection: { color: '#fff', padding: '100px 24px 48px', marginTop: '52px' },
    heroContainer: { maxWidth: '1200px', margin: '0 auto' },
    heroContent: { maxWidth: '900px' },
    ownedBadge: { display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.9)', color: '#4a4a8a', fontWeight: 800, fontSize: '1rem', padding: '4px 16px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    freeBadge: { display: 'inline-block', backgroundColor: '#fff', color: '#1a7a3c', fontWeight: 800, fontSize: '1rem', padding: '4px 16px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    heroTitle: { fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.4', color: '#fff' },
    heroDesc: { fontSize: '18px', marginBottom: '24px', lineHeight: '1.6', color: '#fff', opacity: 0.95 },
    heroInfo: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
    infoItem: { display: 'flex', alignItems: 'center', fontSize: '15px', color: '#fff' },
    loadingWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', fontSize: '20px', color: '#0865a8', marginTop: '100px' },
    mainContainer: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
    contentWrapper: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' },
    leftContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
    section: { backgroundColor: '#fff', padding: '28px', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    sectionHeading: { fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#000', borderRight: '4px solid #0865a8', paddingRight: '16px' },
    topicsGrid: { display: 'grid', gap: '14px' },
    topicCard: { display: 'flex', gap: '14px', padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderRight: '3px solid #f57c00', transition: 'all 0.2s' },
    topicIcon: { color: '#0865a8', flexShrink: 0, marginTop: '2px' },
    topicText: { fontSize: '15px', color: '#000', lineHeight: '1.6', margin: 0 },
    objGrid: { display: 'grid', gap: '14px' },
    objItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '15px', color: '#000', lineHeight: '1.6' },
    checkIcon: { color: '#f57c00', marginTop: '4px', flexShrink: 0 },
    prereqList: { listStyle: 'disc', paddingRight: '24px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#000', fontSize: '15px', lineHeight: '1.6' },
    methodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' },
    methodItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#000', fontSize: '15px' },
    dateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' },
    dateItem: { padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '3px solid #0865a8' },
    dateLabel: { fontSize: '14px', color: '#000', fontWeight: 'bold', opacity: 0.7 },
    dateValue: { fontSize: '15px', color: '#000' },
    filesList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    fileLink: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '2px solid #cce0ff', color: '#0865a8', fontSize: '15px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' },
    fileLocked: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '2px solid #e0e0e0', color: '#aaa', fontSize: '15px' },
    lockedBanner: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', backgroundColor: '#fff8e1', border: '2px solid #ffe082', borderRadius: '10px', marginBottom: '14px' },
    lockedBannerText: { fontSize: '14px', color: '#795548', lineHeight: '1.6' },
    rightSidebar: { display: 'flex', flexDirection: 'column', gap: '24px', alignSelf: 'flex-start', position: 'sticky', top: '100px' },
    priceCard: { backgroundColor: '#fff', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
    pricePreview: { width: '100%', height: '200px', overflow: 'hidden', position: 'relative' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },

    certPreviewRibbon: {
        position: 'absolute', bottom: '12px', left: '12px',
        backgroundColor: 'rgba(124,58,237,0.92)',
        backdropFilter: 'blur(6px)',
        borderRadius: '8px', padding: '6px 14px',
        fontSize: '13px', fontWeight: 'bold', color: '#fff',
        boxShadow: '0 2px 10px rgba(124,58,237,0.5)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        fontFamily: '"Droid Arabic Kufi",serif',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.2s',
        background: 'linear-gradient(100deg, rgba(124,58,237,0.95) 0%, rgba(159,103,245,0.95) 50%, rgba(124,58,237,0.95) 100%)',
        backgroundSize: '200% auto',
        animation: 'certShine 3s linear infinite',
    },

    priceContent: { padding: '24px' },
    priceSec: { marginBottom: '20px' },
    ownedLabel: { fontSize: '32px', fontWeight: 'bold', color: '#4a4a8a', display: 'block', lineHeight: 1.2 },
    freeLabel: { fontSize: '32px', fontWeight: 'bold', color: '#1a7a3c', display: 'block', lineHeight: 1.2 },
    priceSub: { fontSize: '13px', color: '#666', marginTop: '4px', display: 'block' },
    paidPrice: { fontSize: '32px', fontWeight: 'bold', color: '#f57c00', display: 'block', marginBottom: '8px' },
    strikePrice: { fontSize: '16px', color: '#000', textDecoration: 'line-through', opacity: 0.5 },
    actionBtns: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
    btnViewMyCourses: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg,#4a4a8a 0%,#7b5ea7 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(74,74,138,0.3)' },

    btnCertPreview: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        width: '100%', padding: '13px 24px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
        fontFamily: '"Droid Arabic Kufi",serif',
        boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
        transition: 'all 0.25s ease',
    },

    btnRefund: { width: '100%', padding: '12px 24px', backgroundColor: '#fff', color: '#e53935', border: '2px solid #e53935', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s' },
    btnEnroll: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg,#1a7a3c 0%,#27ae60 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(26,122,60,0.3)' },
    btnAddCart: { width: '100%', padding: '14px 24px', backgroundColor: '#fff', color: '#0865a8', border: '2px solid #0865a8', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif', transition: 'all 0.3s' },
    btnBuyNow: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(8,101,168,0.3)' },
    includesSec: { borderTop: '2px solid #f0f0f0', paddingTop: '20px' },
    includesTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#000' },
    includesList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' },
    includesItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#000' },
    otherCard: { backgroundColor: '#fff', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '24px' },
    otherTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#000' },
    otherList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    otherCourseCard: { display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', backgroundColor: '#f9f9f9', border: '2px solid transparent' },
    otherCourseImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
    otherCourseName: { fontSize: '14px', fontWeight: 'bold', color: '#000', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },
    otherCoursePrice: { fontSize: '16px', fontWeight: 'bold' },
    notFoundWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px' },
    notFoundCard: { backgroundColor: '#fff', padding: '48px', borderRadius: '12px', border: '2px solid #f0f0f0', textAlign: 'center', maxWidth: '500px' },
    btnPrimary: { display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)', color: '#fff', textDecoration: 'none', borderRadius: '10px', marginTop: '24px', fontWeight: 'bold' },

    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' },
    modalCard: { backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.22)', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', animation: 'modalSlideUp 0.3s ease-out' },
    modalHeader: { background: 'linear-gradient(135deg,#c62828 0%,#e53935 100%)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', position: 'sticky', top: 0, zIndex: 1 },
    modalHeaderIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' },
    modalTitle: { fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: 0 },
    modalSubtitle: { fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: '3px 0 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    modalClose: { marginRight: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', flexShrink: 0 },
    modalBody: { padding: '20px' },
    infoBox: { display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' },
    infoBoxText: { fontSize: '13px', color: '#1565c0', lineHeight: '1.5', margin: 0 },
    warningBox: { display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#795548', fontFamily: '"Droid Arabic Kufi",serif' },
    formLabel: { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '8px' },
    formInput: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi",serif', color: '#000', outline: 'none', boxSizing: 'border-box', direction: 'rtl', transition: 'border-color 0.2s', marginBottom: '12px' },
    textarea: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi",serif', color: '#000', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: '1.5', direction: 'rtl' },
    charCount: { textAlign: 'left', fontSize: '11px', color: '#999', marginTop: '4px', marginBottom: '12px' },
    errorBox: { display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: '#ffebee', border: '1px solid #ef9a9a', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#c62828' },
    modalActions: { display: 'flex', gap: '10px', marginTop: '6px' },
    btnCancel: { flex: 1, padding: '11px 16px', backgroundColor: '#f5f5f5', color: '#555', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif' },
    btnSubmit: { flex: 2, padding: '11px 16px', background: 'linear-gradient(135deg,#c62828 0%,#e53935 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif', boxShadow: '0 3px 10px rgba(229,57,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    successState: { textAlign: 'center', padding: '16px 0' },
    successIcon: { fontSize: '48px', marginBottom: '12px' },
    successTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1a7a3c', marginBottom: '10px' },
    successText: { fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '20px' },
    btnDone: { padding: '11px 36px', background: 'linear-gradient(135deg,#1a7a3c 0%,#27ae60 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Droid Arabic Kufi",serif' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', fontFamily: '"Droid Arabic Kufi",serif' },
    policyBox: { display: 'flex', gap: '10px', alignItems: 'flex-start', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', lineHeight: '1.6', fontFamily: '"Droid Arabic Kufi",serif' },
    enrollMsgBox: { padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontFamily: '"Droid Arabic Kufi",serif', lineHeight: '1.6', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' },

    certOverlay: {
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(10,5,30,0.75)',
        zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(8px)',
    },
    certModalCard: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 24px 64px rgba(124,58,237,0.3), 0 8px 24px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '760px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'certModalSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        border: '1.5px solid rgba(124,58,237,0.2)',
    },
    certModalHeader: {
        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #9f67f5 100%)',
        padding: '18px 22px',
        display: 'flex', alignItems: 'center', gap: '14px',
        position: 'relative', flexShrink: 0,
    },
    certModalHeaderIconWrap: {
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.18)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', flexShrink: 0,
    },
    certModalTitleWrap: { flex: 1 },
    certModalTitle: { fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0, fontFamily: '"Droid Arabic Kufi",serif' },
    certModalSubtitle: {
        fontSize: '12px', color: 'rgba(255,255,255,0.78)', margin: '4px 0 0',
        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        fontFamily: '"Droid Arabic Kufi",serif',
    },
    certModalCloseBtn: {
        background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '50%', width: '34px', height: '34px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff', flexShrink: 0, transition: 'background 0.2s',
    },
    certModalBody: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    certPreviewArea: {
        flex: 1, background: '#1a1a2e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '420px', position: 'relative', overflow: 'hidden',
    },
    certIframe: { width: '100%', height: '100%', minHeight: '420px', border: 'none', display: 'block' },
    certFallback: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '16px', padding: '40px 24px', textAlign: 'center',
    },
    certFallbackIcon: { fontSize: '64px', lineHeight: 1 },
    certFallbackText: { fontSize: '15px', color: 'rgba(255,255,255,0.7)', fontFamily: '"Droid Arabic Kufi",serif', lineHeight: '1.6' },
    certModalFooter: {
        padding: '16px 22px',
        borderTop: '1px solid #f0e8ff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        backgroundColor: '#faf7ff', flexShrink: 0, flexWrap: 'wrap',
    },
    certModalInfo: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7c3aed', fontFamily: '"Droid Arabic Kufi",serif' },
    certModalActions: { display: 'flex', gap: '10px', alignItems: 'center' },
    btnOpenNewTab: {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '9px 18px',
        backgroundColor: '#fff', color: '#7c3aed',
        border: '2px solid #7c3aed', borderRadius: '8px',
        fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
        fontFamily: '"Droid Arabic Kufi",serif', transition: 'all 0.2s',
        textDecoration: 'none',
    },
    btnCertDownloadModal: {
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '9px 22px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
        fontFamily: '"Droid Arabic Kufi",serif',
        boxShadow: '0 3px 12px rgba(124,58,237,0.35)',
        transition: 'all 0.25s ease', textDecoration: 'none',
    },
};

const REFUND_STATUS_MAP = {
    Pending: { label: 'قيد المراجعة', bg: '#fff8e1', color: '#f59e0b', icon: '⏳' },
    Approved: { label: 'تمت الموافقة', bg: '#e3f2fd', color: '#0865a8', icon: '✅' },
    Rejected: { label: 'مرفوض', bg: '#ffebee', color: '#e53935', icon: '❌' },
    Sent: { label: 'تم التحويل', bg: '#f0fff4', color: '#1a7a3c', icon: '💸' },
};

function getRefundPolicy(courseDateStr, coursePrice) {
    if (!courseDateStr) return { type: 'unknown' };
    const raw = courseDateStr.split(' - ')[0].trim();
    let startDate = null;
    const parts = raw.split(/[\/\-]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) startDate = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        else startDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    }
    if (!startDate || isNaN(startDate.getTime())) return { type: 'unknown' };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((startDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft < 2) return { type: 'blocked', daysLeft };
    if (daysLeft <= 7) return { type: 'partial', daysLeft, refundAmount: (coursePrice * 0.75).toLocaleString('ar-EG') };
    return { type: 'full', daysLeft };
}

async function parseServerError(res) {
    const status = res.status;
    let body = '';
    try { body = await res.text(); } catch (_) { }
    try {
        const j = JSON.parse(body);
        const msg = j.message || j.Message || j.error || j.Error || j.title || j.Title;
        if (msg) return `${msg} (${status})`;
    } catch (_) { }
    if (body && body.length < 300 && !body.trim().startsWith('<')) return `${body.trim()} (${status})`;
    const defaults = { 400: 'بيانات الطلب غير صحيحة (400)', 401: 'غير مصرح — يرجى تسجيل الدخول مجدداً (401)', 403: 'ليس لديك صلاحية تنفيذ هذا الإجراء (403)', 404: 'الطلب غير موجود أو الخدمة غير متاحة (404)', 409: 'لديك طلب استرداد قيد المراجعة بالفعل', 422: 'البيانات المدخلة غير مقبولة (422)', 500: 'خطأ في الخادم، يرجى المحاولة لاحقاً (500)' };
    return defaults[status] || `حدث خطأ غير متوقع (${status})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificate Preview Modal
// ─────────────────────────────────────────────────────────────────────────────
const CertificateModal = ({ cert, courseTitle, onClose }) => {
    const [iframeError, setIframeError] = useState(false);

    const certUrl = cert?.url || null;
    const certName = cert?.name || cert?.fileName || `شهادة_${courseTitle || 'الدورة'}.pdf`;
    const isPdf = certUrl && certUrl.toLowerCase().includes('.pdf');

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!certUrl) return null;

    return (
        <div style={S.certOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={S.certModalCard} className="cert-modal-card" dir="rtl">

                <div style={S.certModalHeader}>
                    <div style={S.certModalHeaderIconWrap}>📜</div>
                    <div style={S.certModalTitleWrap}>
                        <h2 style={S.certModalTitle}>شهادة الإتمام</h2>
                        <p style={S.certModalSubtitle}>{courseTitle}</p>
                    </div>
                    <button style={S.certModalCloseBtn} onClick={onClose} title="إغلاق">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div style={S.certModalBody}>
                    <div style={S.certPreviewArea}>
                        {!iframeError && isPdf ? (
                            <iframe
                                src={`${certUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                style={S.certIframe}
                                title="معاينة الشهادة"
                                onError={() => setIframeError(true)}
                            />
                        ) : (
                            !iframeError && certUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                <img
                                    src={certUrl}
                                    alt="شهادة الإتمام"
                                    style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '4px' }}
                                    onError={() => setIframeError(true)}
                                />
                            ) : (
                                <div style={S.certFallback}>
                                    <div style={S.certFallbackIcon}>📄</div>
                                    <p style={S.certFallbackText}>
                                        لا يمكن عرض الشهادة هنا مباشرةً.<br />
                                        يمكنك فتحها في تبويب جديد أو تحميلها.
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div style={S.certModalFooter}>
                    <div style={S.certModalInfo}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span>شهادتك معتمدة ✓</span>
                    </div>

                    <div style={S.certModalActions}>
                        <a href={certUrl} target="_blank" rel="noopener noreferrer" style={S.btnOpenNewTab} className="btnOpenNewTab">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                            فتح في تبويب جديد
                        </a>

                        <a href={certUrl} download={certName} style={S.btnCertDownloadModal} className="btnCertDownloadModal">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            تحميل الشهادة
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const CourseDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();   // ← removed unused userId

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherCourses, setOtherCourses] = useState([]);
    const [ownedCourseIds, setOwnedCourseIds] = useState(new Set());
    const [cert, setCert] = useState(null);
    const [certLoading, setCertLoading] = useState(false);

    const [showCertModal, setShowCertModal] = useState(false);

    const [enrolling, setEnrolling] = useState(false);
    const [enrollMsg, setEnrollMsg] = useState(null);

    const [showRefund, setShowRefund] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [bankName, setBankName] = useState('');
    const [iban, setIban] = useState('');
    const [refundSending, setRefundSending] = useState(false);
    const [refundSuccess, setRefundSuccess] = useState(false);
    const [refundError, setRefundError] = useState(null);
    const [existingRefund, setExistingRefund] = useState(null);
    const [loadingRefundCheck, setLoadingRefundCheck] = useState(false);

    const safeGetToken = useCallback(async () => {
        try { return await getToken(); } catch (_) { return null; }
    }, [getToken]);

    const fetchOwnedCourses = useCallback(async () => {
        if (!isSignedIn) { setOwnedCourseIds(new Set()); return; }
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/course/my-courses`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const data = await res.json();
            setOwnedCourseIds(new Set(data.map(e => e.childId)));
        } catch { setOwnedCourseIds(new Set()); }
    }, [isSignedIn, safeGetToken]);

    // ── Certificate fetch: NEW endpoint /Admin/certificates/{planworkId} ──────
    const fetchCertForCourse = useCallback(async (courseId) => {
        if (!isSignedIn || !courseId) return;
        setCert(null);
        setCertLoading(true);
        try {
            const token = await safeGetToken();
            if (!token) return;

            // ✅ Updated to new endpoint — no userId needed
            const res = await fetch(`${API_BASE}/Admin/certificates/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 404 means cert not uploaded yet — silently ignore
            if (!res.ok) return;

            const data = await res.json();
            const raw = Array.isArray(data) ? data[0] : data;
            if (!raw) return;

            // Resolve URL from whichever field the API uses
            const rawUrl =
                raw.url || raw.fileUrl || raw.filePath || raw.path ||
                raw.downloadUrl || raw.fileName || raw.filename || null;

            const url = rawUrl
                ? (rawUrl.startsWith('http') ? rawUrl : `${API_BASE}/${rawUrl.replace(/^\//, '')}`)
                : null;

            setCert({ ...raw, url });
        } catch {
            setCert(null);
        } finally {
            setCertLoading(false);
        }
    }, [isSignedIn, safeGetToken]);

    useEffect(() => { fetchOwnedCourses(); }, [fetchOwnedCourses]);

    useEffect(() => {
        window.addEventListener('cartUpdated', fetchOwnedCourses);
        window.addEventListener('enrollUpdated', fetchOwnedCourses);
        return () => {
            window.removeEventListener('cartUpdated', fetchOwnedCourses);
            window.removeEventListener('enrollUpdated', fetchOwnedCourses);
        };
    }, [fetchOwnedCourses]);

    const checkExistingRefund = useCallback(async (courseId) => {
        if (!isSignedIn) return;
        setLoadingRefundCheck(true);
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/refund/my`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 404 || res.status === 204) { setExistingRefund(null); return; }
            if (!res.ok) { setExistingRefund(null); return; }
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data?.data ?? data?.items ?? data?.result ?? []);
            const cid = String(courseId);
            const match = list.find(r =>
                (String(r.planworkId ?? r.planWorkId ?? r.PlanworkId ?? '') === cid) &&
                (r.status === 'Pending' || r.status === 'Approved')
            );
            setExistingRefund(match || null);
        } catch {
            setExistingRefund(null);
        } finally {
            setLoadingRefundCheck(false);
        }
    }, [isSignedIn, safeGetToken]);

    const extractList = (html, heading) => {
        if (!html) return [];
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = [];
        const h = Array.from(doc.querySelectorAll('h6')).find(n => n.textContent.includes(heading));
        if (h) {
            let el = h.nextElementSibling;
            while (el && el.tagName !== 'H6') {
                if (el.tagName === 'UL') el.querySelectorAll('li').forEach(li => { const t = li.textContent.trim(); if (t) items.push(t); });
                el = el.nextElementSibling;
            }
        }
        return items;
    };

    const extractDates = (s) => {
        if (!s) return { startDate: '', endDate: '' };
        const p = s.split(' - ');
        return { startDate: p[0]?.trim() || '', endDate: p[1]?.trim() || p[0]?.trim() || '' };
    };

    const transform = (a) => {
        const { startDate, endDate } = extractDates(a.date);
        const isFree = !a.cost || a.cost === 0;
        return {
            id: a.id, slug: a.slug, title: a.title, description: a.description,
            place: a.place, price: a.cost || 0,
            originalPrice: a.onSale || (a.cost ? a.cost * 1.6 : 0),
            currency: 'جنيه', isFree,
            duration: 26, videoDuration: 26,
            articlesCount: a.files?.length || 12,
            hasCertificate: true, language: 'العربية', level: 'مبتدئ',
            topics: extractList(a.content, 'محتويات البرنامج'),
            objectives: extractList(a.content, 'فائدة حضور البرنامج'),
            prerequisites: extractList(a.content, 'لمن يعقد البرنامج'),
            implementationMethods: extractList(a.content, 'طريقة تنفيذ البرنامج'),
            programDates: extractList(a.content, 'تاريخ انعقاد البرنامج'),
            startDate, endDate, date: a.date,
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
            files: (a.files || []).map(f => {
                const rawUrl = f.url || f.link || f.path || f.fileUrl || f.downloadUrl || f.fileName || f.filename || null;
                const url = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${FILES_BASE}${rawUrl}`) : null;
                return { id: f.id ?? null, title: f.title || f.name || 'ملف', url };
            }),
        };
    };

    useEffect(() => {
        if (!slug) return;
        (async () => {
            try {
                setLoading(true); setError(null);
                const res = await fetch(`${API_BASE}/Course/${slug}`);
                if (!res.ok) throw new Error('not found');
                const c = transform(await res.json());
                setCourse(c);
                const rel = ['solid-liquid-waste-management', 'construction-project-management', 'architectural-engineering']
                    .filter(s => s !== slug).slice(0, 3);
                const others = await Promise.all(rel.map(s =>
                    fetch(`${API_BASE}/Course/${s}`).then(r => r.ok ? r.json() : null).catch(() => null)
                ));
                setOtherCourses(others.filter(Boolean).map(transform));
            } catch (e) { setError(e.message); }
            finally { setLoading(false); }
        })();
    }, [slug]);

    const isOwned = course ? ownedCourseIds.has(course.id) : false;

    // Fetch cert whenever this course becomes owned
    useEffect(() => {
        if (course?.id && isOwned) {
            fetchCertForCourse(course.id);
        } else {
            setCert(null);
        }
    }, [course?.id, isOwned, fetchCertForCourse]);

    useEffect(() => {
        document.title = course?.title ? `${course.title} - المعهد التكنولوجي` : 'المعهد التكنولوجي';
    }, [course]);

    const addToCart = async (buyNow = false) => {
        if (!course) return;
        try {
            const token = await safeGetToken();
            if (token) {
                await fetch(`${API_BASE}/cart/add/${course.id}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: course.id, quantity: 1 }),
                });
            }
        } catch { }
        const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (!cart.some(i => i.id === course.id)) {
            cart.push({ id: course.id, slug: course.slug, title: course.title, instructor: course.place || 'غير محدد', image: course.image, currentPrice: course.price || 0, originalPrice: course.originalPrice || 0, quantity: 1 });
            localStorage.setItem('cartItems', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
        }
        navigate(buyNow ? '/checkout' : '/cart');
    };

    const handleEnroll = async () => {
        if (!course) return;
        if (!isSignedIn) { navigate('/sign-in'); return; }
        setEnrolling(true); setEnrollMsg(null);
        try {
            const token = await safeGetToken();
            if (!token) { setEnrollMsg({ type: 'error', text: 'يجب تسجيل الدخول أولاً.' }); return; }
            const res = await fetch(`${API_BASE}/course/enroll-free/${course.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setEnrollMsg({ type: 'error', text: data?.message || 'حدث خطأ، حاول مرة أخرى.' }); return; }
            if (data.alreadyEnrolled) {
                setEnrollMsg({ type: 'info', text: '✅ أنت مسجل في هذا الكورس بالفعل.' });
            } else {
                setEnrollMsg({ type: 'success', text: '🎉 تم تسجيلك بنجاح! يمكنك الآن متابعة الكورس من دوراتك.' });
            }
            await fetchOwnedCourses();
            window.dispatchEvent(new Event('enrollUpdated'));
        } catch (err) {
            setEnrollMsg({ type: 'error', text: err.message || 'حدث خطأ، حاول مرة أخرى.' });
        } finally {
            setEnrolling(false);
        }
    };

    const openRefund = () => {
        setShowRefund(true); setRefundError(null);
        setRefundSuccess(false); setExistingRefund(null);
        if (course) checkExistingRefund(course.id);
    };

    const submitRefund = async () => {
        if (!refundReason.trim()) { setRefundError('الرجاء كتابة سبب طلب الاسترداد'); return; }
        setRefundSending(true); setRefundError(null);
        try {
            const token = await safeGetToken();
            if (!token) { setRefundError('يجب تسجيل الدخول أولاً'); setRefundSending(false); return; }
            let planworkId = course.id; let orderId = null;
            try {
                const myCoursesRes = await fetch(`${API_BASE}/course/my-courses`, { headers: { Authorization: `Bearer ${token}` } });
                if (myCoursesRes.ok) {
                    const myList = await myCoursesRes.json();
                    const enrollment = myList.find(e => String(e.childId) === String(course.id));
                    if (enrollment) { planworkId = enrollment.childId ?? course.id; orderId = enrollment.orderId ?? null; }
                }
            } catch { }
            if (!orderId) { setRefundError('لم يتم العثور على بيانات الطلب الأصلي. يرجى التواصل مع الدعم.'); setRefundSending(false); return; }
            const payload = { orderId, planworkId, reason: refundReason.trim(), details: null, bankName: bankName.trim() || null, accountNumber: null, accountHolder: null, iban: iban.trim() || null };
            const res = await fetch(`${API_BASE}/refund`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.status === 409) { setRefundError('لديك طلب استرداد قيد المراجعة بالفعل لهذه الدورة'); return; }
            if (!res.ok) { setRefundError(await parseServerError(res)); return; }
            setRefundSuccess(true);
            setRefundReason(''); setBankName(''); setIban('');
        } catch (err) {
            setRefundError(err.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
        } finally {
            setRefundSending(false);
        }
    };

    const closeRefund = () => {
        setShowRefund(false); setRefundReason(''); setBankName(''); setIban('');
        setRefundError(null); setRefundSuccess(false); setExistingRefund(null);
    };

    const heroBg = isOwned
        ? 'linear-gradient(135deg,#4a4a8a 0%,#7b5ea7 100%)'
        : course?.isFree
            ? 'linear-gradient(135deg,#1a7a3c 0%,#27ae60 100%)'
            : 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)';

    const font = '"Droid Arabic Kufi",serif';
    const statusInfo = existingRefund ? REFUND_STATUS_MAP[existingRefund.status] : null;

    const getCertUrl = (c) => c?.url || null;

    if (loading) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`*{font-family:${font}!important}${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={S.overviewBar} className="overview-bar">
                    <div style={S.overviewBarText} className="breadcrumb-text">
                        <a href="/" style={S.breadcrumbLink}>الصفحة الرئيسية</a>
                        <span style={S.breadcrumbSep}>•</span>
                        <span style={S.breadcrumbCur}>جاري التحميل...</span>
                    </div>
                </div>
                <div style={S.loadingWrap}>جاري تحميل الدورة...</div>
            </div>
        </>
    );

    if (error || !course) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`*{font-family:${font}!important}${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={S.overviewBar} className="overview-bar">
                    <div style={S.overviewBarText} className="breadcrumb-text">
                        <a href="/" style={S.breadcrumbLink}>الصفحة الرئيسية</a>
                        <span style={S.breadcrumbSep}>•</span>
                        <span style={S.breadcrumbCur}>خطأ</span>
                    </div>
                </div>
                <div style={S.notFoundWrap}>
                    <div style={S.notFoundCard}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
                        <h2>الدورة غير موجودة!</h2>
                        <p style={{ marginTop: '8px', color: '#666' }}>عذراً، الدورة التي تبحث عنها غير متوفرة</p>
                        <Link to="/" style={S.btnPrimary}>العودة للصفحة الرئيسية</Link>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`*{font-family:${font}!important}${mediaQueryStyles}`}</style>

            <div dir="rtl" style={S.pageWrapper}>

                <div style={{ ...S.overviewBar, top: 70 }} className="overview-bar">
                    <div style={S.overviewBarText} className="breadcrumb-text">
                        <a href="/" style={S.breadcrumbLink}
                            onMouseEnter={e => e.target.style.color = '#f57c00'}
                            onMouseLeave={e => e.target.style.color = '#0865a8'}>الصفحة الرئيسية</a>
                        <span style={S.breadcrumbSep}>•</span>
                        <span style={S.breadcrumbCur}>{course.title}</span>
                    </div>
                </div>

                <div style={{ ...S.heroSection, background: heroBg }}>
                    <div style={S.heroContainer}>
                        <div style={S.heroContent}>
                            {isOwned && <div style={S.ownedBadge}>✅ مسجل في هذه الدورة</div>}
                            {!isOwned && course.isFree && <div style={S.freeBadge}>مجاناً</div>}
                            <h1 style={S.heroTitle}>{course.title}</h1>
                            <p style={S.heroDesc}>{course.description}</p>
                            <div style={S.heroInfo}>
                                <span style={S.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" /><path d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H5.5a.5.5 0 010-1H7.5V4a.5.5 0 01.5-.5z" /></svg>
                                    تاريخ البدء: {course.startDate}
                                </span>
                                <span style={S.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z" /></svg>
                                    {course.place}
                                </span>
                                <span style={S.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z" /></svg>
                                    {course.language}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={S.mainContainer} className="main-container">
                    <div style={S.contentWrapper} className="content-wrapper">

                        <div style={S.leftContent}>
                            {course.topics.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>محتويات البرنامج</h2>
                                    <div style={S.topicsGrid}>
                                        {course.topics.map((t, i) => (
                                            <div key={i} style={S.topicCard} className="topicCard">
                                                <div style={S.topicIcon}><svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1zM4.5 9a.5.5 0 010-1h7a.5.5 0 010 1h-7zM4 10.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 010-1h4a.5.5 0 010 1h-4z" /></svg></div>
                                                <p style={S.topicText}>{t}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {course.objectives.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>فائدة حضور البرنامج</h2>
                                    <div style={S.objGrid}>
                                        {course.objectives.map((o, i) => (
                                            <div key={i} style={S.objItem}>
                                                <svg style={S.checkIcon} width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" /></svg>
                                                <span>{o}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {course.prerequisites.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>لمن يعقد البرنامج</h2>
                                    <ul style={S.prereqList}>{course.prerequisites.map((p, i) => <li key={i}>{p}</li>)}</ul>
                                </div>
                            )}
                            {course.implementationMethods.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>طريقة تنفيذ البرنامج</h2>
                                    <div style={S.methodsGrid}>
                                        {course.implementationMethods.map((m, i) => (
                                            <div key={i} style={S.methodItem}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                <span>{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {course.programDates.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>تاريخ انعقاد البرنامج</h2>
                                    <div style={S.dateGrid}>
                                        {course.programDates.map((d, i) => (
                                            <div key={i} style={S.dateItem}>
                                                <span style={S.dateLabel}>الدورة {i + 1}:</span>
                                                <span style={S.dateValue}>{d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {course.files.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>الملفات المرفقة</h2>
                                    {!isOwned && (
                                        <div style={S.lockedBanner}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                            <span style={S.lockedBannerText}>هذه الملفات متاحة فقط بعد شراء الدورة.</span>
                                        </div>
                                    )}
                                    <div style={S.filesList}>
                                        {course.files.map((file, i) => isOwned ? (
                                            file.url
                                                ? <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" style={S.fileLink} className="fileItemLink">
                                                    <svg width="20" height="20" viewBox="0 0 16 16" fill="#0865a8"><path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5zm-3 0A1.5 1.5 0 019.5 3V1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4.5h-2z" /></svg>
                                                    <span style={{ flex: 1 }}>{file.title}</span>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0865a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                                                </a>
                                                : <div key={i} style={{ ...S.fileLink, opacity: 0.6, cursor: 'default' }}>
                                                    <svg width="20" height="20" viewBox="0 0 16 16" fill="#0865a8"><path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5zm-3 0A1.5 1.5 0 019.5 3V1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4.5h-2z" /></svg>
                                                    <span style={{ flex: 1 }}>{file.title}</span>
                                                </div>
                                        ) : (
                                            <div key={i} style={S.fileLocked}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                                <span style={{ flex: 1 }}>{file.title}</span>
                                                <span>🔒</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
                        <div style={S.rightSidebar} className="right-sidebar">
                            <div style={S.priceCard}>
                                <div style={S.pricePreview}>
                                    <img src={course.image} alt={course.title} style={S.previewImg} />

                                    {isOwned && (
                                        certLoading ? (
                                            <div style={{ ...S.certPreviewRibbon, background: 'rgba(100,100,120,0.85)', animation: 'none', cursor: 'default' }}>
                                                <svg style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                <span>جاري التحقق من الشهادة...</span>
                                            </div>
                                        ) : cert && getCertUrl(cert) ? (
                                            <div style={S.certPreviewRibbon} onClick={() => setShowCertModal(true)} title="اضغط لمعاينة شهادتك">
                                                <span>📜</span>
                                                <span>شهادتك جاهزة — اضغط للمعاينة</span>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div style={{ ...S.certPreviewRibbon, background: 'rgba(80,80,100,0.82)', animation: 'none', cursor: 'default' }}>
                                                <span>🕐</span>
                                                <span>الشهادة لم تُضف بعد</span>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div style={S.priceContent}>
                                    <div style={S.priceSec}>
                                        {isOwned ? (
                                            <><span style={S.ownedLabel}>✅ مسجل</span><span style={S.priceSub}>لديك هذه الدورة بالفعل</span></>
                                        ) : course.isFree ? (
                                            <><span style={S.freeLabel}>مجاناً</span><span style={S.priceSub}>دورة مجانية بالكامل</span></>
                                        ) : (
                                            <>
                                                <span style={S.paidPrice}>{course.price.toLocaleString('ar-EG')} {course.currency}</span>
                                            </>
                                        )}
                                    </div>

                                    <div style={S.actionBtns}>
                                        {isOwned ? (
                                            <>
                                                {certLoading ? (
                                                    <div style={{ ...S.btnCertPreview, opacity: 0.6, cursor: 'default', justifyContent: 'center' }}>
                                                        <svg style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                        <span>جاري التحقق من الشهادة...</span>
                                                    </div>
                                                ) : cert && getCertUrl(cert) ? (
                                                    <button className="btnCertPreview" style={S.btnCertPreview} onClick={() => setShowCertModal(true)}>
                                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
                                                        <span>📜 معاينة الشهادة وتحميلها</span>
                                                    </button>
                                                ) : (
                                                    <div style={{ ...S.btnCertPreview, background: 'linear-gradient(135deg,#9e9e9e 0%,#bdbdbd 100%)', cursor: 'not-allowed', boxShadow: 'none', opacity: 0.75, justifyContent: 'center' }}>
                                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span>الشهادة لم تُضف بعد</span>
                                                    </div>
                                                )}

                                                <button className="btnViewMyCourses" style={S.btnViewMyCourses} onClick={() => navigate('/my-courses')}>عرض في دوراتي</button>

                                                {!course.isFree && (
                                                    <button className="btnRefund" style={S.btnRefund} onClick={openRefund}>💸 طلب استرداد المبلغ</button>
                                                )}
                                            </>
                                        ) : course.isFree ? (
                                            <>
                                                {enrollMsg && (
                                                    <div style={{
                                                        ...S.enrollMsgBox,
                                                        backgroundColor: enrollMsg.type === 'success' ? '#e8f5e9' : enrollMsg.type === 'info' ? '#e3f2fd' : '#ffebee',
                                                        border: `1px solid ${enrollMsg.type === 'success' ? '#4caf50' : enrollMsg.type === 'info' ? '#2196f3' : '#f44336'}`,
                                                        color: enrollMsg.type === 'success' ? '#2e7d32' : enrollMsg.type === 'info' ? '#1565c0' : '#c62828',
                                                    }}>
                                                        {enrollMsg.text}
                                                    </div>
                                                )}
                                                <button
                                                    className="btnEnroll"
                                                    style={{ ...S.btnEnroll, opacity: enrolling ? 0.7 : 1, cursor: enrolling ? 'not-allowed' : 'pointer' }}
                                                    onClick={handleEnroll}
                                                    disabled={enrolling}
                                                >
                                                    {enrolling ? '⏳ جاري التسجيل...' : '🎁 اشترك الآن — مجاناً'}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btnAddCart" style={S.btnAddCart} onClick={() => addToCart(false)}>إضافة إلى السلة</button>
                                                <button className="btnBuyNow" style={S.btnBuyNow} onClick={() => addToCart(true)}>اشترِ الآن</button>
                                            </>
                                        )}
                                    </div>

                                    <div style={S.includesSec}>
                                        <h3 style={S.includesTitle}>هذه الدورة تتضمن:</h3>
                                        <ul style={S.includesList}>
                                            <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H2z" /></svg> {course.videoDuration} ساعة محتوى تدريبي</li>
                                            <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z" /></svg> {course.articlesCount} ملف تدريبي</li>
                                            <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z" /></svg> وصول كامل للمحتوى</li>
                                            {course.hasCertificate && <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z" /></svg> شهادة إتمام</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {otherCourses.length > 0 && (
                                <div style={S.otherCard}>
                                    <h3 style={S.otherTitle}>دورات أخرى قد تهمك</h3>
                                    <div style={S.otherList}>
                                        {otherCourses.map(o => (
                                            <Link key={o.id} to={`/course/${o.slug}`} style={S.otherCourseCard} className="otherCourseCard">
                                                <img src={o.image} alt={o.title} style={S.otherCourseImg} />
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <h4 style={S.otherCourseName}>{o.title}</h4>
                                                    <span style={{ ...S.otherCoursePrice, color: o.isFree ? '#1a7a3c' : '#f57c00' }}>
                                                        {o.isFree ? 'مجاناً' : `${o.price.toLocaleString('ar-EG')} ${o.currency}`}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CERTIFICATE PREVIEW MODAL ──────────────────────────────────── */}
            {showCertModal && cert && getCertUrl(cert) && (
                <CertificateModal
                    cert={cert}
                    courseTitle={course.title}
                    onClose={() => setShowCertModal(false)}
                />
            )}

            {/* ── REFUND MODAL ───────────────────────────────────────────────── */}
            {showRefund && (
                <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) closeRefund(); }}>
                    <div style={S.modalCard} dir="rtl">
                        <div style={S.modalHeader}>
                            <div style={S.modalHeaderIcon}>💸</div>
                            <div style={{ flex: 1 }}>
                                <h2 style={S.modalTitle}>طلب استرداد المبلغ</h2>
                                <p style={S.modalSubtitle}>{course.title}</p>
                            </div>
                            <button style={S.modalClose} onClick={closeRefund}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div style={S.modalBody}>
                            {loadingRefundCheck ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '160px' }}>
                                    <svg style={{ width: '40px', height: '40px', color: '#0865a8', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                            ) : existingRefund && !refundSuccess ? (
                                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                    <div style={{ fontSize: '52px', marginBottom: '16px' }}>{statusInfo?.icon}</div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', marginBottom: '12px', fontFamily: '"Droid Arabic Kufi",serif' }}>لديك طلب استرداد مسبق</h3>
                                    <div style={{ ...S.statusBadge, backgroundColor: statusInfo?.bg, color: statusInfo?.color, margin: '0 auto 16px', display: 'inline-flex' }}>{statusInfo?.label}</div>
                                    {existingRefund.status === 'Rejected' && existingRefund.rejectionReason && (
                                        <div style={{ ...S.warningBox, textAlign: 'right', marginTop: '12px' }}>
                                            <div><strong style={{ display: 'block', marginBottom: '4px' }}>سبب الرفض:</strong>{existingRefund.rejectionReason}</div>
                                        </div>
                                    )}
                                    {existingRefund.status === 'Pending' && <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', fontFamily: '"Droid Arabic Kufi",serif', marginBottom: '20px' }}>طلبك قيد المراجعة. سنتواصل معك خلال 3-5 أيام عمل.</p>}
                                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '8px', textAlign: 'right' }}>
                                        <div style={{ fontSize: '13px', color: '#888', fontFamily: '"Droid Arabic Kufi",serif' }}>رقم الطلب: <strong style={{ color: '#0865a8' }}>{existingRefund.refNumber || `#${existingRefund.id}`}</strong></div>
                                        {existingRefund.requestedAt && <div style={{ fontSize: '13px', color: '#888', fontFamily: '"Droid Arabic Kufi",serif', marginTop: '4px' }}>تاريخ الطلب: {new Date(existingRefund.requestedAt).toLocaleDateString('ar-EG')}</div>}
                                    </div>
                                    <button style={{ ...S.btnCancel, width: '100%', marginTop: '20px' }} onClick={closeRefund}>إغلاق</button>
                                </div>
                            ) : refundSuccess ? (
                                <div style={S.successState}>
                                    <div style={S.successIcon}>✅</div>
                                    <h3 style={S.successTitle}>تم إرسال طلبك بنجاح!</h3>
                                    <p style={S.successText}>سيقوم فريق الدعم بمراجعة طلبك والرد عليك خلال 3-5 أيام عمل.</p>
                                    <button style={S.btnDone} onClick={closeRefund}>حسناً، شكراً</button>
                                </div>
                            ) : (
                                <>
                                    {(() => {
                                        const policy = getRefundPolicy(course.date, course.price);
                                        if (policy.type === 'blocked') return (
                                            <div style={{ ...S.policyBox, backgroundColor: '#ffebee', border: '1px solid #ef9a9a', color: '#c62828' }}>
                                                <span style={{ fontSize: '18px', flexShrink: 0 }}>🚫</span>
                                                <span>عذراً، لا يمكن طلب الاسترداد. تبقى أقل من يومين على بدء الكورس ({policy.daysLeft} يوم).</span>
                                            </div>
                                        );
                                        if (policy.type === 'partial') return (
                                            <div style={{ ...S.policyBox, backgroundColor: '#fff8e1', border: '1px solid #ffe082', color: '#795548' }}>
                                                <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
                                                <span>تبقى <strong>{policy.daysLeft} أيام</strong> على بدء الكورس — سيُخصم 25% وستسترد <strong>{policy.refundAmount} جنيه</strong> فقط.</span>
                                            </div>
                                        );
                                        if (policy.type === 'full') return (
                                            <div style={{ ...S.policyBox, backgroundColor: '#f0fff4', border: '1px solid #a7f3d0', color: '#1a7a3c' }}>
                                                <span style={{ fontSize: '18px', flexShrink: 0 }}>✅</span>
                                                <span>مؤهل لاسترداد كامل — تبقى <strong>{policy.daysLeft} أيام</strong> على بدء الكورس.</span>
                                            </div>
                                        );
                                        return null;
                                    })()}
                                    <div style={S.infoBox}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0865a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p style={S.infoBoxText}>سيتم مراجعة طلبك من قِبل الإدارة خلال 3-5 أيام عمل.</p>
                                    </div>
                                    <label style={S.formLabel}>سبب طلب الاسترداد <span style={{ color: '#e53935' }}>*</span></label>
                                    <textarea style={S.textarea} rows={4} maxLength={500}
                                        placeholder="يرجى توضيح سبب رغبتك في استرداد المبلغ..."
                                        value={refundReason}
                                        onChange={e => { setRefundReason(e.target.value); setRefundError(null); }} />
                                    <div style={S.charCount}>{refundReason.length} / 500</div>
                                    <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '16px', marginBottom: '4px' }}>
                                        <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', fontFamily: '"Droid Arabic Kufi",serif' }}>بيانات بنكية (اختياري)</p>
                                        <label style={S.formLabel}>اسم البنك</label>
                                        <input style={S.formInput} type="text" placeholder="مثال: بنك مصر" value={bankName} onChange={e => setBankName(e.target.value)} maxLength={100} />
                                        <label style={S.formLabel}>رقم الـ IBAN أو الحساب</label>
                                        <input style={S.formInput} type="text" placeholder="EG00 0000 0000 0000 0000 0000 0000" value={iban} onChange={e => setIban(e.target.value)} maxLength={34} dir="ltr" />
                                    </div>
                                    {refundError && (
                                        <div style={S.errorBox}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span>{refundError}</span>
                                        </div>
                                    )}
                                    <div style={S.modalActions}>
                                        <button style={S.btnCancel} onClick={closeRefund}>إلغاء</button>
                                        <button
                                            style={{ ...S.btnSubmit, ...((refundSending || getRefundPolicy(course.date, course.price).type === 'blocked') ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                                            onClick={submitRefund}
                                            disabled={refundSending || getRefundPolicy(course.date, course.price).type === 'blocked'}>
                                            {refundSending
                                                ? <><svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>جاري الإرسال...</>
                                                : 'إرسال الطلب'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseDetails;