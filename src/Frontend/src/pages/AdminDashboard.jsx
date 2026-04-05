import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import logoSrc from '../assets/logo-removebg-preview.png';

// ════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — matched to Team component
// ════════════════════════════════════════════════════════════════════════════
const T = {
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
    font: '"Droid Arabic Kufi", "Noto Kufi Arabic", serif',
};

// ════════════════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════════════════
const ADMIN_EMAILS = ['yasminamaged22@gmail.com', 'abeer.naguib@gmail.com', 'amrshamy91@gmail.com', 'abdelmawla1642@gmail.com'];
const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';
const API_HOST = 'https://acwebsite-icmet-test.azurewebsites.net';
const NAVBAR_H = 70;
const OVERVIEW_H = 38;
const ITEMS_PER_PAGE = 10;

// ════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES — Team-inspired
// ════════════════════════════════════════════════════════════════════════════
const ADMIN_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&display=swap');

    .adm-root {
        direction: rtl;
        font-family: ${T.font};
        background: ${T.white};
        overflow-x: hidden;
        margin-top: ${NAVBAR_H + OVERVIEW_H}px;
        display: flex;
        min-height: calc(100vh - ${NAVBAR_H + OVERVIEW_H}px);
    }

    /* ── Keyframes ── */
    @keyframes adm-spin    { to { transform: rotate(360deg) } }
    @keyframes adm-fadeUp  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
    @keyframes adm-slideIn { from { opacity:0; transform:translateX(8px)  } to { opacity:1; transform:translateX(0) } }
    @keyframes adm-pulse   { 0%,100%{ opacity:1 } 50%{ opacity:.45 } }
    @keyframes adm-slideDown { from { opacity:0; transform:translateY(-14px) } to { opacity:1; transform:translateY(0) } }
    @keyframes adm-barGrow { from { transform:scaleY(0) } to { transform:scaleY(1) } }

    /* ── Sidebar ── */
    .adm-sidebar {
        width: 220px;
        flex-shrink: 0;
        background: ${T.blueDark};
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 0;
        height: calc(100vh - ${NAVBAR_H + OVERVIEW_H}px);
        overflow: hidden;
        z-index: 200;
        box-shadow: -4px 0 24px rgba(4,68,120,0.35);
        border-left: 3px solid ${T.orange};
    }

    /* grid overlay on sidebar like hero */
    .adm-sidebar::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(245,124,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.05) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
        z-index: 0;
    }

    .adm-sidebar-brand {
        position: relative; z-index: 1;
        padding: 18px 16px 14px;
        border-bottom: 3px solid ${T.orange};
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0,0,0,0.25);
        flex-shrink: 0;
    }
    .adm-sb-logo  { width: 36px; height: 36px; object-fit: contain; filter: brightness(0) invert(1); flex-shrink:0; }
    .adm-sb-name  { font-size: .86rem; font-weight: 900; color: ${T.white}; white-space:nowrap; }
    .adm-sb-sub   { font-size: .6rem; color: rgba(255,255,255,.45); margin-top:2px; }

    .adm-sidebar-user {
        position: relative; z-index: 1;
        padding: 12px 16px;
        border-bottom: 1.5px solid rgba(245,124,0,0.2);
        display: flex; align-items: center; gap: 10px;
        background: rgba(0,0,0,0.15);
        flex-shrink: 0;
    }
    .adm-su-av   { width: 36px; height: 36px; border-radius: 4px; background: ${T.orange}; display: flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: 900; color: ${T.white}; flex-shrink:0; }
    .adm-su-name { font-size: .75rem; font-weight: 700; color: ${T.white}; }
    .adm-su-role { display: inline-flex; align-items: center; gap: 3px; margin-top: 2px; padding: 1px 7px; background: rgba(245,124,0,0.2); border: 1px solid rgba(245,124,0,0.4); border-radius: 2px; font-size: .58rem; color: ${T.orangeLight}; font-weight: 700; }

    .adm-sidebar-nav { flex:1; padding: 12px 8px; overflow-y:auto; overflow-x:hidden; position:relative; z-index:1; }
    .adm-sidebar-nav::-webkit-scrollbar { width:3px; }
    .adm-sidebar-nav::-webkit-scrollbar-thumb { background: rgba(245,124,0,0.4); border-radius:2px; }

    .adm-nav-label { font-size:.56rem; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:1.5px; text-transform:uppercase; padding: 0 8px; margin-bottom:6px; margin-top:4px; }

    .adm-nav-btn {
        width: 100%; display:flex; align-items:center; gap:9px;
        padding: 10px 12px; border-radius:3px;
        border: 1.5px solid transparent;
        background: transparent;
        color: rgba(255,255,255,0.6);
        font-family: ${T.font}; font-size:.8rem; font-weight:700;
        cursor:pointer; transition: all .22s cubic-bezier(.4,0,.2,1);
        text-align:right; margin-bottom:3px; white-space:nowrap; overflow:hidden;
        position:relative;
    }
    .adm-nav-btn::before {
        content:''; position:absolute; right:0; top:0; bottom:0;
        width:3px; background:${T.orange}; transform:scaleY(0);
        transform-origin:bottom; transition:transform .3s cubic-bezier(.4,0,.2,1);
    }
    .adm-nav-btn:hover { background: rgba(245,124,0,0.1); color:${T.white}; border-color:rgba(245,124,0,0.2); }
    .adm-nav-btn.active { background: rgba(245,124,0,0.15); color:${T.white}; border-color:rgba(245,124,0,0.35); }
    .adm-nav-btn.active::before { transform:scaleY(1); }
    .adm-nav-icon { font-size:.95rem; flex-shrink:0; }
    .adm-nav-txt  { flex:1; text-align:right; overflow:hidden; text-overflow:ellipsis; }
    .adm-nav-badge { padding:1px 7px; border-radius:2px; font-size:.58rem; font-weight:900; background:${T.orange}; color:${T.white}; flex-shrink:0; }
    .adm-nav-badge.pulse { animation: adm-pulse 2s ease infinite; }

    .adm-sidebar-footer {
        position:relative; z-index:1;
        padding: 10px 14px;
        border-top: 1.5px solid rgba(245,124,0,0.2);
        font-size:.6rem; color:rgba(255,255,255,0.25);
        text-align:center; background:rgba(0,0,0,0.2); flex-shrink:0;
    }

    /* ── Main ── */
    .adm-main {
        flex:1; min-width:0;
        overflow-y:auto;
        background: ${T.gray100};
        animation: adm-fadeUp .28s ease;
    }
    .adm-main::-webkit-scrollbar { width:5px; }
    .adm-main::-webkit-scrollbar-thumb { background:${T.gray300}; border-radius:3px; }

    /* ── Page hero (like Team hero) ── */
    .adm-page-hero {
        position:relative;
        background: ${T.blueDark};
        padding: 32px clamp(20px,4vw,48px) 56px;
        overflow:hidden;
    }
    .adm-page-hero::before {
        content:'';
        position:absolute; inset:0;
        background-image:
            linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px);
        background-size:40px 40px;
        pointer-events:none;
    }
    /* diagonal cut at bottom like Team */
    .adm-page-hero::after {
        content:''; position:absolute; bottom:-2px; left:0; right:0;
        height: clamp(28px,5vw,56px);
        background:${T.gray100};
        clip-path: polygon(0 100%, 100% 0, 100% 100%);
    }
    .adm-hero-accent { position:absolute; top:0; right:0; width:6px; height:100%; background:linear-gradient(to bottom,${T.orange},${T.orangeLight}); }
    .adm-hero-content { position:relative; z-index:2; }
    .adm-hero-tag {
        display:inline-block; background:${T.orange}; color:${T.white};
        font-family:${T.font}; font-size:clamp(9px,1.1vw,12px); font-weight:700;
        padding: 4px 16px; border-radius:2px; margin-bottom:10px; letter-spacing:.05em;
    }
    .adm-hero-title { font-size:clamp(18px,3vw,32px); font-weight:900; color:${T.white}; font-family:${T.font}; line-height:1.3; }
    .adm-hero-title span { color:${T.orangeLight}; }
    .adm-hero-date { font-size:clamp(10px,1.2vw,13px); color:rgba(255,255,255,0.5); margin-top:6px; }

    /* ── Content area ── */
    .adm-content { padding: clamp(16px,2.5vw,32px) clamp(16px,3vw,40px) clamp(40px,5vw,64px); }

    /* ── Stat cards ── */
    .adm-stats {
        display:grid;
        grid-template-columns: repeat(6,1fr);
        gap: clamp(10px,1.5vw,18px);
        margin-bottom: clamp(20px,2.5vw,32px);
    }
    @media(max-width:1100px){ .adm-stats{ grid-template-columns:repeat(3,1fr); } }
    @media(max-width:640px) { .adm-stats{ grid-template-columns:repeat(2,1fr); } }

    .adm-sc {
        background: ${T.white};
        border-radius:3px;
        border: 1.5px solid ${T.gray300};
        border-top: 4px solid ${T.orange};
        padding: clamp(14px,2vw,20px) clamp(12px,1.8vw,16px);
        display:flex; flex-direction:column; gap:6px;
        position:relative; overflow:hidden;
        transition: transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s cubic-bezier(.4,0,.2,1);
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        min-width:0;
    }
    .adm-sc:hover { transform:translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
    .adm-sc.blue  { border-top-color:${T.blue}; }
    /* right accent bar like team card */
    .adm-sc::before {
        content:''; position:absolute; top:0; right:0; width:3px; height:100%;
        background:${T.orange}; transform:scaleY(0); transform-origin:bottom;
        transition:transform .3s cubic-bezier(.4,0,.2,1); z-index:2;
    }
    .adm-sc.blue::before { background:${T.blue}; }
    .adm-sc:hover::before { transform:scaleY(1); }
    .adm-sc-icon { font-size:1.4rem; margin-bottom:2px; }
    .adm-sc-val  { font-size:clamp(1.6rem,3vw,2rem); font-weight:900; color:${T.orange}; line-height:1; font-family:'Courier New',monospace; }
    .adm-sc.blue .adm-sc-val { color:${T.blue}; }
    .adm-sc-lbl  { font-size:clamp(.62rem,1.1vw,.72rem); color:${T.gray500}; font-weight:700; }
    .adm-sc-bar  { height:3px; border-radius:2px; background:linear-gradient(to left,${T.orange},${T.orangeLight}); margin-top:4px; width:50%; opacity:.6; }
    .adm-sc.blue .adm-sc-bar { background:linear-gradient(to left,${T.blue},${T.blueLight}); }

    /* ── Section headers (like Team section) ── */
    .adm-section-hdr {
        display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
        margin-bottom: clamp(14px,2vw,22px);
        padding-bottom: clamp(10px,1.5vw,16px);
        border-bottom: 3px solid ${T.orange};
        position:relative;
    }
    .adm-section-tag {
        display:inline-block; background:${T.blue}; color:${T.white};
        font-family:${T.font}; font-size:clamp(9px,1.1vw,12px); font-weight:700;
        padding:4px 14px; border-radius:2px; margin-bottom:4px; letter-spacing:.04em;
    }
    .adm-section-title { font-size:clamp(14px,2vw,20px); font-weight:900; color:${T.black}; font-family:${T.font}; }
    .adm-section-title span { color:${T.orange}; }

    /* ── Toolbar ── */
    .adm-toolbar {
        display:flex; align-items:center; gap:10px; flex-wrap:wrap;
        margin-bottom: clamp(12px,2vw,18px);
        background:${T.white}; border:1.5px solid ${T.gray300};
        border-radius:3px; padding: clamp(10px,1.5vw,14px) clamp(12px,2vw,18px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .adm-search { flex:1; min-width:160px; position:relative; }
    .adm-search input {
        width:100%; padding: clamp(8px,1.2vw,11px) 34px clamp(8px,1.2vw,11px) clamp(10px,1.5vw,14px);
        border-radius:3px; border:1.5px solid ${T.gray300};
        background:${T.gray100}; color:${T.black}; font-family:${T.font};
        font-size:clamp(.72rem,1.3vw,.8rem); outline:none; direction:rtl;
        transition: border .18s, box-shadow .18s;
    }
    .adm-search input::placeholder { color:${T.gray500}; }
    .adm-search input:focus { border-color:${T.orange}; background:${T.white}; box-shadow:0 0 0 3px rgba(245,124,0,0.1); }
    .adm-search::after { content:'🔍'; position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:.68rem; pointer-events:none; opacity:.5; }

    .adm-fdate {
        padding: clamp(7px,1.1vw,10px) clamp(8px,1.2vw,12px);
        border-radius:3px; border:1.5px solid ${T.gray300};
        background:${T.gray100}; color:${T.black}; font-family:${T.font};
        font-size:clamp(.7rem,1.2vw,.78rem); outline:none; direction:ltr;
        transition: border .18s;
    }
    .adm-fdate:focus { border-color:${T.orange}; background:${T.white}; }

    .adm-fsel {
        padding: clamp(7px,1.1vw,10px) clamp(8px,1.2vw,12px);
        border-radius:3px; border:1.5px solid ${T.gray300};
        background:${T.gray100}; color:${T.black}; font-family:${T.font};
        font-size:clamp(.7rem,1.2vw,.78rem); outline:none; cursor:pointer;
    }

    .adm-filter-active {
        display:inline-flex; align-items:center; gap:5px;
        padding:3px 12px; border-radius:2px;
        background:rgba(245,124,0,0.08); border:1.5px solid rgba(245,124,0,0.3);
        color:${T.orange}; font-size:.68rem; font-weight:700;
    }

    .adm-fclear {
        padding: clamp(6px,1vw,9px) clamp(10px,1.5vw,14px);
        border-radius:3px; background:${T.gray100}; border:1.5px solid ${T.gray300};
        font-family:${T.font}; font-size:clamp(.64rem,1.1vw,.72rem); font-weight:700;
        cursor:pointer; color:${T.gray500}; transition:all .16s;
    }
    .adm-fclear:hover { border-color:${T.orange}; color:${T.orange}; background:rgba(245,124,0,0.06); }

    /* ── Export button (orange, like team social btns) ── */
    .adm-expw { position:relative; }
    .adm-expbtn {
        display:flex; align-items:center; gap:6px;
        padding: clamp(8px,1.2vw,11px) clamp(14px,2vw,20px);
        background:${T.orange}; color:${T.white};
        border:none; border-radius:3px; font-family:${T.font};
        font-size:clamp(.72rem,1.3vw,.8rem); font-weight:700; cursor:pointer;
        white-space:nowrap; transition:all .22s cubic-bezier(.4,0,.2,1);
        box-shadow:0 4px 14px rgba(245,124,0,0.3);
    }
    .adm-expbtn:hover { background:${T.orangeDark}; transform:translateY(-2px); box-shadow:0 6px 20px rgba(245,124,0,0.38); }
    .adm-expbtn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .adm-expmenu {
        position:absolute; top:calc(100% + 6px); left:0;
        background:${T.white}; border:1.5px solid ${T.gray300};
        border-radius:3px; box-shadow:0 10px 32px rgba(0,0,0,0.12);
        overflow:hidden; z-index:400; min-width:190px;
        animation: adm-slideIn .15s ease;
        border-top:3px solid ${T.orange};
    }
    .adm-expitem {
        display:flex; align-items:center; gap:9px; width:100%;
        padding: clamp(10px,1.8vw,13px) clamp(14px,2vw,18px);
        background:none; border:none; border-bottom:1px solid ${T.gray100};
        font-family:${T.font}; font-size:clamp(.72rem,1.3vw,.8rem); font-weight:700;
        color:${T.gray700}; direction:rtl; cursor:pointer; transition:background .12s,color .12s;
    }
    .adm-expitem:last-child { border-bottom:none; }
    .adm-expitem:hover { background:rgba(245,124,0,0.06); color:${T.orange}; }

    /* ── Table card ── */
    .adm-card {
        background:${T.white}; border-radius:3px;
        border:1.5px solid ${T.gray300};
        overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06);
        position:relative;
    }
    /* top border gradient like team card bar */
    .adm-card::before {
        content:''; position:absolute; top:0; left:0; right:0;
        height:3px; background:linear-gradient(to left,${T.orange},${T.blue});
        z-index:2;
    }
    .adm-tscr { overflow-x:auto; -webkit-overflow-scrolling:touch; }
    .adm-tbl  { width:100%; border-collapse:collapse; min-width:480px; }

    .adm-tbl thead th {
        background:${T.blue}; color:${T.white};
        padding: clamp(12px,1.8vw,16px) clamp(10px,2vw,18px);
        font-family:${T.font}; font-size:clamp(.7rem,1.2vw,.78rem); font-weight:700;
        text-align:right; white-space:nowrap;
        border-bottom:3px solid ${T.orange};
        letter-spacing:.3px;
    }
    .adm-tbl thead th.or { background:${T.orange}; border-bottom-color:rgba(255,255,255,0.3); }
    .adm-tbl thead th.gr { background:#16a34a; border-bottom-color:#86efac; }
    .adm-tbl thead th.pu { background:#7c3aed; border-bottom-color:#c4b5fd; }
    .adm-tbl thead th.rd { background:#dc2626; border-bottom-color:#fca5a5; }
    .adm-tbl thead th.c  { text-align:center; }

    .adm-tbl tbody tr { border-bottom:1px solid ${T.gray100}; transition:background .12s; }
    .adm-tbl tbody tr:last-child { border-bottom:none; }
    .adm-tbl tbody tr:hover { background:rgba(8,101,168,0.04); }
    .adm-tbl tbody tr.xopen { background:rgba(8,101,168,0.05); }
    .adm-tbl tbody tr:nth-child(even) { background:#fafbfc; }
    .adm-tbl tbody tr:nth-child(even):hover { background:rgba(8,101,168,0.04); }
    .adm-tbl td { padding: clamp(11px,1.6vw,14px) clamp(10px,2vw,18px); font-family:${T.font}; font-size:clamp(.69rem,1.25vw,.78rem); color:${T.gray700}; vertical-align:middle; }

    .adm-av { width:clamp(30px,3.5vw,36px); height:clamp(30px,3.5vw,36px); border-radius:3px; background:${T.blue}; color:${T.white}; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:clamp(.6rem,1vw,.68rem); flex-shrink:0; }
    .adm-av.or { background:${T.orange}; }
    .adm-av.rd { background:#dc2626; }
    .adm-av.sm { width:24px; height:24px; font-size:.58rem; }
    .adm-uc { display:flex; align-items:center; gap:9px; }
    .adm-uname { font-weight:700; color:${T.black}; }
    .adm-cb { display:inline-flex; align-items:center; justify-content:center; min-width:26px; height:26px; border-radius:2px; background:rgba(8,101,168,0.08); border:1.5px solid rgba(8,101,168,0.25); color:${T.blue}; font-size:clamp(.64rem,1.1vw,.72rem); font-weight:900; padding:0 6px; font-family:'Courier New',monospace; }
    .adm-cb.or { background:rgba(245,124,0,0.08); border-color:rgba(245,124,0,0.3); color:${T.orange}; }
    .adm-pill { display:inline-block; padding:4px 12px; border-radius:2px; font-size:clamp(.62rem,1.1vw,.7rem); font-weight:700; cursor:pointer; border:1.5px solid rgba(8,101,168,0.3); color:${T.blue}; background:rgba(8,101,168,0.07); user-select:none; transition:all .14s; font-family:${T.font}; }
    .adm-pill:hover,.adm-pill.op { background:rgba(8,101,168,0.14); border-color:rgba(8,101,168,0.55); }
    .adm-pill.or { border-color:rgba(245,124,0,0.3); color:${T.orange}; background:rgba(245,124,0,0.07); }
    .adm-pill.or:hover,.adm-pill.or.op { background:rgba(245,124,0,0.14); border-color:rgba(245,124,0,0.55); }

    .adm-xrow td { padding:0!important; border:none; }
    .adm-xin  { padding: clamp(12px,2vw,16px) clamp(14px,2.5vw,22px); display:flex; flex-wrap:wrap; gap:clamp(7px,1.3vw,11px); background:rgba(8,101,168,0.04); border-top:2px solid rgba(8,101,168,0.1); }
    .adm-mc   { background:${T.white}; border-radius:3px; padding:clamp(9px,1.8vw,13px) clamp(10px,2vw,14px); border:1.5px solid ${T.gray300}; min-width:clamp(150px,20vw,200px); flex:1 1 150px; max-width:260px; transition:border-color .14s; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
    .adm-mc:hover { border-color:rgba(245,124,0,0.4); }
    .adm-mt { font-size:clamp(.7rem,1.25vw,.78rem); font-weight:700; color:${T.blue}; margin-bottom:2px; }
    .adm-mt.or { color:${T.orange}; }
    .adm-ms { font-size:clamp(.63rem,1.1vw,.7rem); color:${T.gray500}; }
    .adm-md { font-size:clamp(.6rem,1vw,.66rem); color:${T.gray300}; margin-top:4px; }

    .adm-empty { text-align:center; padding:clamp(40px,8vw,70px) 20px; }
    .adm-emi   { font-size:clamp(1.8rem,4vw,2.5rem); margin-bottom:12px; opacity:.35; }
    .adm-empty p { color:${T.gray300}; font-size:clamp(.74rem,1.4vw,.82rem); }
    .adm-ld    { text-align:center; padding:clamp(50px,10vw,80px) 20px; }
    .adm-sp    { width:clamp(32px,4.5vw,42px); height:clamp(32px,4.5vw,42px); border:3px solid ${T.gray300}; border-top-color:${T.blue}; border-radius:50%; animation:adm-spin .7s linear infinite; margin:0 auto clamp(12px,2vw,18px); }
    .adm-ld p  { color:${T.gray300}; font-size:clamp(.72rem,1.3vw,.8rem); }

    .adm-ovl  { position:fixed; inset:0; background:rgba(245,247,250,.88); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
    .adm-ovlb { background:${T.white}; border-radius:3px; padding:clamp(28px,5vw,44px) clamp(44px,7vw,64px); text-align:center; box-shadow:0 20px 56px rgba(8,101,168,0.18); border:2px solid rgba(8,101,168,0.15); border-top:4px solid ${T.orange}; }
    .adm-ovlb p { font-size:clamp(.78rem,1.5vw,.86rem); margin-top:14px; color:${T.gray500}; font-family:${T.font}; }

    .adm-err { background:#fef2f2; border:1.5px solid rgba(220,38,38,.3); color:#dc2626; border-radius:3px; padding:clamp(8px,1.5vw,11px) clamp(10px,2vw,14px); margin-bottom:14px; font-size:clamp(.7rem,1.3vw,.78rem); display:flex; align-items:center; gap:9px; border-right:4px solid #dc2626; }

    .adm-chk { width:22px; height:22px; border-radius:3px; border:2px solid ${T.gray300}; background:${T.gray100}; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all .16s; flex-shrink:0; font-size:.75rem; color:transparent; }
    .adm-chk:hover { border-color:#16a34a; background:#f0fdf4; }
    .adm-chk.on { background:#f0fdf4; border-color:#16a34a; color:#16a34a; }
    .adm-chk.spin { border-color:#16a34a; border-top-color:transparent; border-radius:50%; animation:adm-spin .6s linear infinite; }
    .adm-att-badge { display:inline-flex; align-items:center; gap:3px; padding:3px 9px; border-radius:2px; font-size:clamp(.62rem,1.1vw,.7rem); font-weight:700; }
    .adm-att-badge.on  { background:#f0fdf4; color:#16a34a; border:1px solid #86efac; }
    .adm-att-badge.off { background:${T.gray100}; color:${T.gray300}; border:1px solid ${T.gray300}; }

    /* attendance summary — blue bg like team section */
    .adm-att-sum {
        display:flex; align-items:center; gap:clamp(10px,2vw,20px); flex-wrap:wrap;
        background:${T.blue}; border-radius:3px;
        padding:clamp(10px,1.8vw,14px) clamp(14px,2.5vw,20px);
        margin-bottom:clamp(12px,2vw,18px); box-shadow:0 4px 16px rgba(8,101,168,0.25);
        position:relative; overflow:hidden;
    }
    .adm-att-sum::before {
        content:''; position:absolute; inset:0;
        background-image: linear-gradient(rgba(245,124,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,0.06) 1px,transparent 1px);
        background-size:28px 28px; pointer-events:none;
    }
    .adm-att-sum span { font-size:clamp(.7rem,1.3vw,.78rem); font-weight:700; color:rgba(255,255,255,0.85); position:relative; z-index:1; }
    .adm-prog-wrap { flex:1; min-width:100px; height:5px; background:rgba(255,255,255,0.2); border-radius:3px; overflow:hidden; position:relative; z-index:1; }
    .adm-prog-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,${T.orange},${T.orangeLight}); transition:width .5s ease; }

    /* ── Certificate cards ── */
    .adm-cert-grid { display:grid; gap:clamp(10px,1.8vw,16px); padding:clamp(12px,2vw,20px); grid-template-columns:repeat(auto-fill,minmax(clamp(240px,28vw,300px),1fr)); }
    .adm-cert-card {
        background:${T.white}; border-radius:3px;
        padding:clamp(12px,2vw,16px); border:1.5px solid ${T.gray300};
        display:flex; flex-direction:column; gap:10px;
        transition:transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s, border-color .3s;
        box-shadow:0 2px 8px rgba(0,0,0,0.05); position:relative;
    }
    .adm-cert-card::before {
        content:''; position:absolute; top:0; right:0; width:3px; height:100%;
        background:${T.orange}; transform:scaleY(0); transform-origin:bottom;
        transition:transform .3s cubic-bezier(.4,0,.2,1);
    }
    .adm-cert-card:hover { border-color:${T.orange}; box-shadow:0 8px 28px rgba(245,124,0,0.14); transform:translateY(-4px); }
    .adm-cert-card:hover::before { transform:scaleY(1); }
    .adm-cert-card.has-cert::before { background:#16a34a; }
    .adm-cert-card.has-cert:hover { border-color:#86efac; box-shadow:0 8px 28px rgba(22,163,74,0.12); }
    .adm-cert-card-top { display:flex; align-items:flex-start; gap:10px; }
    .adm-cert-icon { width:40px; height:40px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; background:rgba(8,101,168,0.08); border:1.5px solid rgba(8,101,168,0.2); }
    .adm-cert-icon.has  { background:#f0fdf4; border-color:#86efac; }
    .adm-cert-icon.grey { background:rgba(156,163,175,.06); border-color:rgba(156,163,175,.15); }
    .adm-cert-info { flex:1; min-width:0; }
    .adm-cert-name   { font-weight:700; font-size:.8rem; color:${T.black}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .adm-cert-course { font-size:.7rem; color:${T.blue}; margin-top:3px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .adm-cert-badges { display:flex; gap:5px; flex-wrap:wrap; margin-top:5px; }
    .adm-cert-actions { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; border-top:1px solid ${T.gray100}; padding-top:9px; }
    .adm-cert-btn { padding:clamp(5px,1vw,7px) clamp(10px,1.5vw,14px); border-radius:2px; font-family:${T.font}; font-size:clamp(.64rem,1.1vw,.72rem); font-weight:700; cursor:pointer; border:none; transition:all .16s; white-space:nowrap; }
    .adm-cert-btn.up   { background:rgba(8,101,168,0.08); color:${T.blue}; border:1.5px solid rgba(8,101,168,0.25); }
    .adm-cert-btn.up:hover { background:rgba(8,101,168,0.16); }
    .adm-cert-btn.dl   { background:rgba(245,124,0,0.08); color:${T.orange}; border:1.5px solid rgba(245,124,0,0.25); }
    .adm-cert-btn.dl:hover { background:rgba(245,124,0,0.16); }
    .adm-cert-btn.rm   { background:#fef2f2; color:#dc2626; border:1.5px solid rgba(220,38,38,.2); }
    .adm-cert-btn.rm:hover { background:#fee2e2; }
    .adm-cert-btn.full { width:100%; text-align:center; justify-content:center; background:${T.blue}; color:${T.white}; border:none; }
    .adm-cert-btn.full:hover { background:${T.blueDark}; }
    .adm-cert-btn:disabled { opacity:.45; cursor:not-allowed; }

    /* ── Upload modal ── */
    .adm-modal-bg { position:fixed; inset:0; background:rgba(4,68,120,0.45); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(6px); animation:adm-fadeUp .16s ease; }
    .adm-modal {
        background:${T.white}; border-radius:3px;
        padding:clamp(16px,2.5vw,24px); max-width:clamp(290px,88vw,520px); width:100%;
        box-shadow:0 20px 56px rgba(4,68,120,0.22); direction:rtl;
        border:1.5px solid ${T.gray300}; border-top:4px solid ${T.orange};
    }
    .adm-modal.rd { border-top-color:#dc2626; max-width:clamp(290px,92vw,540px); max-height:90vh; overflow-y:auto; }
    .adm-modal h3 { font-size:clamp(.82rem,1.5vw,.94rem); font-weight:900; color:${T.black}; margin-bottom:4px; }
    .adm-modal p  { font-size:clamp(.66rem,1.1vw,.74rem); color:${T.gray500}; margin-bottom:12px; font-family:${T.font}; }
    .adm-drop {
        border:2px dashed rgba(8,101,168,0.35); border-radius:3px;
        padding:clamp(24px,5vw,36px) 16px; text-align:center;
        cursor:pointer; transition:all .16s; background:rgba(8,101,168,0.03);
    }
    .adm-drop.over { border-color:${T.orange}; background:rgba(245,124,0,0.05); }
    .adm-drop:hover { border-color:rgba(8,101,168,0.6); }
    .adm-drop-icon { font-size:clamp(1.7rem,3.5vw,2.3rem); margin-bottom:8px; }
    .adm-drop-txt  { font-size:clamp(.72rem,1.4vw,.8rem); color:${T.gray700}; margin-bottom:4px; font-family:${T.font}; }
    .adm-drop-sub  { font-size:clamp(.62rem,1.1vw,.7rem); color:${T.gray500}; }
    .adm-modal-actions { display:flex; gap:7px; margin-top:18px; justify-content:flex-end; }
    .adm-modal-cancel { padding:clamp(7px,1.3vw,10px) clamp(12px,2vw,18px); border-radius:3px; background:${T.gray100}; border:1.5px solid ${T.gray300}; font-family:${T.font}; font-size:clamp(.7rem,1.3vw,.78rem); font-weight:700; cursor:pointer; color:${T.gray500}; transition:all .14s; }
    .adm-modal-cancel:hover { border-color:${T.black}; color:${T.black}; background:${T.white}; }

    .adm-email { direction:ltr; text-align:right; color:${T.gray500}; font-size:clamp(.65rem,1.15vw,.73rem); }

    /* ── Refund section ── */
    .rf-stat-bar { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:10px; margin-bottom:20px; }
    .rf-sc {
        background:${T.white}; border-radius:3px;
        padding:14px 16px; border:1.5px solid ${T.gray300};
        box-shadow:0 2px 8px rgba(0,0,0,0.05);
        display:flex; align-items:center; gap:11px; transition:transform .2s;
        border-right:4px solid ${T.orange};
    }
    .rf-sc:hover { transform:translateY(-2px); }
    .rf-sc-icon { width:36px; height:36px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
    .rf-sc-val  { font-size:1.3rem; font-weight:900; line-height:1; font-family:'Courier New',monospace; }
    .rf-sc-lbl  { font-size:.62rem; color:${T.gray500}; font-weight:700; margin-top:3px; }
    .rf-status  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:2px; font-size:.7rem; font-weight:700; white-space:nowrap; border:1.5px solid transparent; }
    .rf-amount  { font-family:'Courier New',monospace; font-weight:900; font-size:.88rem; color:#15803d; direction:ltr; display:inline-block; }

    .rf-filter-btns { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
    .rf-fbtn { padding:5px 13px; border-radius:2px; border:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; font-size:.7rem; font-weight:700; cursor:pointer; color:${T.gray500}; transition:all .14s; }
    .rf-fbtn:hover { border-color:${T.blue}; color:${T.blue}; background:rgba(8,101,168,0.06); }
    .rf-fbtn.active      { background:rgba(8,101,168,0.1); border-color:rgba(8,101,168,0.4); color:${T.blue}; }
    .rf-fbtn.active.pend { background:rgba(245,124,0,0.08); border-color:rgba(245,124,0,0.4); color:${T.orange}; }
    .rf-fbtn.active.appr { background:#f0fdf4; border-color:#86efac; color:#16a34a; }
    .rf-fbtn.active.bank { background:rgba(8,101,168,0.08); border-color:rgba(8,101,168,0.35); color:${T.blue}; }
    .rf-fbtn.active.rjct { background:#fef2f2; border-color:rgba(220,38,38,.35); color:#dc2626; }

    .rf-action-btn { padding:5px 12px; border-radius:2px; font-family:${T.font}; font-size:.68rem; font-weight:700; cursor:pointer; border:1.5px solid; transition:all .14s; white-space:nowrap; }
    .rf-action-btn:disabled { opacity:.4; cursor:not-allowed; }
    .rf-action-btn.view    { background:rgba(8,101,168,0.07); color:${T.blue}; border-color:rgba(8,101,168,0.3); }
    .rf-action-btn.view:hover { background:rgba(8,101,168,0.14); }
    .rf-action-btn.approve { background:#f0fdf4; color:#16a34a; border-color:#86efac; }
    .rf-action-btn.approve:hover { background:#dcfce7; }
    .rf-action-btn.bank    { background:rgba(8,101,168,0.07); color:${T.blue}; border-color:rgba(8,101,168,0.35); }
    .rf-action-btn.bank:hover { background:rgba(8,101,168,0.14); }
    .rf-action-btn.reject  { background:#fef2f2; color:#dc2626; border-color:rgba(220,38,38,.3); }
    .rf-action-btn.reject:hover { background:#fee2e2; }

    .rf-detail    { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; }
    .rf-field-lbl { font-size:.58rem; color:${T.gray500}; font-weight:700; margin-bottom:2px; }
    .rf-field-val { font-size:.74rem; color:${T.black}; font-weight:700; word-break:break-all; }
    .rf-field-val.mono { font-family:'Courier New',monospace; direction:ltr; display:inline-block; }
    .rf-full      { grid-column:1/-1; }
    .rf-divider   { grid-column:1/-1; border:none; border-top:1.5px dashed ${T.gray300}; margin:4px 0; }
    .rf-bank-block  { grid-column:1/-1; background:${T.gray100}; border:1.5px solid rgba(8,101,168,0.15); border-radius:3px; padding:10px 14px; border-right:4px solid ${T.blue}; }
    .rf-bank-title  { font-size:.68rem; font-weight:900; color:${T.blue}; margin-bottom:7px; display:flex; align-items:center; gap:5px; }
    .rf-bank-grid   { display:grid; grid-template-columns:1fr 1fr; gap:5px 14px; }
    .rf-action-area { margin-top:12px; border-top:1.5px solid ${T.gray300}; padding-top:10px; }
    .rf-action-row  { display:flex; gap:7px; flex-wrap:wrap; }
    .rf-textarea { width:100%; padding:8px 10px; border-radius:3px; border:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; font-size:.74rem; color:${T.black}; resize:vertical; min-height:60px; outline:none; direction:rtl; margin-top:8px; transition:border .18s; }
    .rf-textarea:focus { border-color:${T.orange}; background:${T.white}; }
    .rf-action-confirm { padding:8px 18px; border-radius:2px; font-family:${T.font}; font-size:.76rem; font-weight:700; cursor:pointer; border:none; transition:all .16s; }
    .rf-action-confirm.approve { background:#16a34a; color:${T.white}; }
    .rf-action-confirm.approve:hover { background:#15803d; }
    .rf-action-confirm.bank    { background:${T.blue}; color:${T.white}; }
    .rf-action-confirm.bank:hover { background:${T.blueDark}; }
    .rf-action-confirm.reject  { background:#dc2626; color:${T.white}; }
    .rf-action-confirm.reject:hover { background:#b91c1c; }
    .rf-action-confirm:disabled { opacity:.5; cursor:not-allowed; }

    .rf-bank-banner { padding:12px 16px; border-radius:3px; font-family:${T.font}; font-size:.78rem; font-weight:700; display:flex; align-items:center; gap:10px; margin-bottom:16px; animation:adm-slideDown .3s ease; position:relative; border-right:4px solid; }
    .rf-bank-banner.success { background:#f0fdf4; border-color:#86efac; color:#15803d; }
    .rf-bank-banner.failed  { background:rgba(245,124,0,0.06); border-color:${T.orange}; color:${T.orangeDark}; }
    .rf-bank-banner-close { position:absolute; left:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:1rem; color:inherit; opacity:.6; }
    .rf-bank-banner-close:hover { opacity:1; }

    /* ── Pagination ── */
    .adm-pg { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:14px 18px; border-top:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; direction:rtl; }
    .adm-pg-info { font-size:.72rem; color:${T.gray500}; font-weight:700; }
    .adm-pg-info strong { color:${T.black}; }

    /* ── Footer ── */
    .adm-footer {
        background:${T.black};
        padding:clamp(24px,4vw,40px) clamp(16px,3vw,32px);
        text-align:center;
        margin-top: clamp(32px,5vw,60px);
    }
    .adm-footer p { color:rgba(255,255,255,0.25); font-family:${T.font}; font-size:clamp(.62rem,1.1vw,.7rem); }

    /* ── Cert summary bar ── */
    .adm-cert-sum {
        display:flex; align-items:center; gap:14px; flex-wrap:wrap;
        background:${T.white}; border:1.5px solid ${T.gray300};
        border-radius:3px; padding:12px 20px; margin-bottom:16px;
        box-shadow:0 2px 8px rgba(0,0,0,0.05);
        border-top:4px solid ${T.blue};
    }

    /* ── Breadcrumb ── */
    .adm-bc {
        position:fixed; top:${NAVBAR_H}px; left:0; z-index:1050;
        width:100%; height:${OVERVIEW_H}px;
        background:#f5f5f5; border-bottom:1px solid ${T.gray300};
        display:flex; align-items:center; justify-content:center;
        font-family:${T.font}; font-size:clamp(.72rem,1.3vw,.82rem);
    }
    .adm-bc a { margin-left:6px; color:${T.blue}; text-decoration:none; font-weight:700; transition:color .15s; }
    .adm-bc a:hover { color:${T.orange}; }
    .adm-bc .sep { color:${T.gray500}; margin:0 6px; }
    .adm-bc .cur { color:${T.gray700}; margin-right:8px; }

    /* ── Responsive ── */
    @media(max-width:1100px){
        .adm-sidebar { width:54px; }
        .adm-sb-title,.adm-su-info,.adm-nav-label,.adm-nav-badge,.adm-sidebar-footer,.adm-nav-txt { display:none; }
        .adm-sidebar-brand { padding:12px; justify-content:center; }
        .adm-sidebar-user  { padding:10px; justify-content:center; }
        .adm-sidebar-nav   { padding:8px 5px; }
        .adm-nav-btn { justify-content:center; padding:10px 6px; }
        .adm-sb-logo,.adm-su-av { width:28px; height:28px; }
    }
    @media(max-width:768px){
        .rf-detail,.rf-bank-grid { grid-template-columns:1fr; }
        .adm-cert-grid { grid-template-columns:1fr!important; }
        .adm-mc { max-width:100%; }
        .adm-toolbar { flex-direction:column; align-items:stretch; }
        .adm-expw { align-self:flex-start; }
    }
    @media(max-width:480px){
        .adm-content { padding:12px 10px 32px; }
    }
    @media print {
        .adm-sidebar,.adm-toolbar,.adm-bc { display:none!important; }
        .adm-root { margin-top:0!important; }
    }
`;

function injectAdminStyles() {
    if (document.getElementById('adm-styles')) return;
    const el = document.createElement('style');
    el.id = 'adm-styles';
    el.textContent = ADMIN_STYLES;
    document.head.appendChild(el);
}

// ════════════════════════════════════════════════════════════════════════════
// REFUND STATUS META
// ════════════════════════════════════════════════════════════════════════════
const REFUND_STATUS_META = {
    Pending: { label: 'قيد المراجعة', icon: '⏳', color: '#b45309', bg: '#fff8f0', border: 'rgba(245,124,0,0.35)' },
    Approved: { label: 'موافق عليه', icon: '✅', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
    Sent: { label: 'أُرسل للبنك', icon: '🏦', color: T.blue, bg: 'rgba(8,101,168,0.06)', border: 'rgba(8,101,168,0.35)' },
    Rejected: { label: 'مرفوض', icon: '❌', color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.3)' },
    pending: { label: 'قيد المراجعة', icon: '⏳', color: '#b45309', bg: '#fff8f0', border: 'rgba(245,124,0,0.35)' },
    approved: { label: 'موافق عليه', icon: '✅', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
    sent: { label: 'أُرسل للبنك', icon: '🏦', color: T.blue, bg: 'rgba(8,101,168,0.06)', border: 'rgba(8,101,168,0.35)' },
    sent_to_bank: { label: 'أُرسل للبنك', icon: '🏦', color: T.blue, bg: 'rgba(8,101,168,0.06)', border: 'rgba(8,101,168,0.35)' },
    rejected: { label: 'مرفوض', icon: '❌', color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.3)' },
};

// ════════════════════════════════════════════════════════════════════════════
// RTL EXPORT HELPER
// ════════════════════════════════════════════════════════════════════════════
function rtlExport(headers, rows) {
    return {
        headers: [...headers].reverse(),
        rows: rows.map(r => [...r].reverse()),
    };
}

// ════════════════════════════════════════════════════════════════════════════
// LOGO / EXPORT HELPERS
// ════════════════════════════════════════════════════════════════════════════
let _logoCache = null;
function getLogoBase64() {
    return new Promise(resolve => {
        if (_logoCache) { resolve(_logoCache); return; }
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => { try { const c = document.createElement('canvas'); c.width = img.naturalWidth || 300; c.height = img.naturalHeight || 200; c.getContext('2d').drawImage(img, 0, 0); _logoCache = c.toDataURL('image/png'); resolve(_logoCache); } catch (e) { resolve(null); } };
        img.onerror = () => resolve(null); img.src = logoSrc;
    });
}
function triggerDownload(blob, filename) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 10000); }
function buildUsersRows(users) { const headers = ['#', 'الاسم الكامل', 'البريد الإلكتروني', 'اسم الدورة', 'تاريخ التسجيل']; const rows = []; let n = 1; users.forEach(u => { if (!u.enrolledCourses.length) { rows.push([n++, `${u.firstName} ${u.lastName}`, u.email, '—', '—']); } else { u.enrolledCourses.forEach((c, i) => { rows.push(i === 0 ? [n++, `${u.firstName} ${u.lastName}`, u.email, c.title, c.date || '—'] : ['', '', '', c.title, c.date || '—']); }); } }); return { headers, rows }; }
function buildCoursesRows(courses) { const headers = ['#', 'اسم الدورة', 'الفئة', 'اسم المستخدم', 'البريد الإلكتروني', 'تاريخ التسجيل']; const rows = []; let n = 1; courses.forEach(c => { if (!c.enrolledUsers.length) { rows.push([n++, c.title, c.category, '—', '—', '—']); } else { c.enrolledUsers.forEach((u, i) => { rows.push(i === 0 ? [n++, c.title, c.category, `${u.firstName} ${u.lastName}`, u.email, u.date || '—'] : ['', '', '', `${u.firstName} ${u.lastName}`, u.email, u.date || '—']); }); } }); return { headers, rows }; }

async function exportExcel(filename, reportTitle, headers, rows) {
    const reportDate = new Date().toLocaleDateString('ar-EG');
    try {
        const { default: ExcelJS } = await import('exceljs');
        const wb = new ExcelJS.Workbook();
        wb.views = [{ rightToLeft: true }];
        const ws = wb.addWorksheet('التقرير', { views: [{ rightToLeft: true }] });
        ws.columns = headers.map((h, i) => ({ width: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 50) }));
        const logoB64 = await getLogoBase64();
        if (logoB64) { const imgId = wb.addImage({ base64: logoB64.split(',')[1], extension: 'png' }); ws.addImage(imgId, { tl: { col: 0, row: 0 }, br: { col: 2, row: 5 } }); }
        ws.mergeCells(1, 1, 2, headers.length);
        const titleCell = ws.getCell('A1');
        titleCell.value = reportTitle;
        titleCell.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' };
        ws.getRow(1).height = 42; ws.getRow(2).height = 10;
        ws.mergeCells(3, 1, 3, headers.length);
        const dateCell = ws.getCell('A3');
        dateCell.value = `تاريخ التقرير: ${reportDate}`;
        dateCell.font = { italic: true, size: 10, color: { argb: 'FF555555' } };
        dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
        dateCell.alignment = { horizontal: 'center', readingOrder: 'rightToLeft' };
        ws.getRow(3).height = 20;
        const hRow = ws.addRow(headers);
        hRow.height = 28;
        hRow.eachCell(cell => { cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } }; cell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' }; cell.border = { bottom: { style: 'medium', color: { argb: 'FFF57C00' } } }; });
        rows.forEach((row, ri) => { const dr = ws.addRow(row); dr.height = 20; const isAlt = ri % 2 !== 0; dr.eachCell({ includeEmpty: true }, (cell, cn) => { cell.alignment = { horizontal: cn === headers.length ? 'center' : 'right', readingOrder: 'rightToLeft' }; if (isAlt) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } }; const b = { style: 'thin', color: { argb: 'FFD0D0D0' } }; cell.border = { top: b, bottom: b, left: b, right: b }; }); });
        const buffer = await wb.xlsx.writeBuffer();
        triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
        return;
    } catch (_) { }
    const wsData = [[reportTitle, ...Array(headers.length - 1).fill('')], [`تاريخ التقرير: ${reportDate}`, ...Array(headers.length - 1).fill('')], [], headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = headers.map((h, i) => ({ wch: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 55) }));
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }];
    const wb2 = XLSX.utils.book_new();
    wb2.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(wb2, ws, 'التقرير');
    XLSX.writeFile(wb2, filename);
}

function renderTextToImage(text, { fontSize = 12, bold = false, color = '#111111', width = 200, height = 30, bgColor = null, align = 'right' } = {}) {
    const scale = 3; const canvas = document.createElement('canvas'); canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale); const ctx = canvas.getContext('2d'); ctx.scale(scale, scale); if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); } const fontStack = `${bold ? 'bold ' : ''}${fontSize}px "Cairo","Amiri","Noto Naskh Arabic","Noto Sans Arabic","Droid Arabic Kufi","Tahoma","Arial Unicode MS","Arial",sans-serif`; ctx.font = fontStack; ctx.direction = 'rtl'; ctx.textAlign = align === 'center' ? 'center' : align === 'left' ? 'left' : 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; const padding = 6; let x; if (align === 'right') x = width - padding; else if (align === 'left') x = padding; else x = width / 2; const str = String(text ?? ''); let finalStr = str; const maxW = width - padding * 2; if (ctx.measureText(finalStr).width > maxW) { let lo = 0, hi = str.length; while (lo < hi) { const mid = Math.floor((lo + hi + 1) / 2); if (ctx.measureText(str.slice(0, mid) + '…').width <= maxW) lo = mid; else hi = mid - 1; } finalStr = str.slice(0, lo) + '…'; } ctx.fillText(finalStr, x, height / 2); return canvas.toDataURL('image/png');
}

async function exportPDF(filename, reportTitle, headers, rows, subtitle = '') {
    const logoDataUrl = await getLogoBase64(); const reportDate = new Date().toLocaleDateString('ar-EG'); const jsPDFModule = await import('jspdf'); const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF; const autoTableModule = await import('jspdf-autotable'); const autoTable = autoTableModule.default; const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' }); const pageW = doc.internal.pageSize.getWidth(); const pageH = doc.internal.pageSize.getHeight(); const BLUE = [8, 101, 168]; const ORANGE = [245, 124, 0]; const FOOTER_TEXT = 'المعهد التكنولوجى لهندسة التشييد والإدارة'; const drawHeader = () => { doc.setFillColor(...BLUE); doc.rect(0, 0, pageW, 34, 'F'); doc.setFillColor(...ORANGE); doc.rect(0, 34, pageW, 2.5, 'F'); if (logoDataUrl) { doc.setFillColor(255, 255, 255); doc.roundedRect(5, 4, 36, 26, 3, 3, 'F'); try { doc.addImage(logoDataUrl, 'PNG', 6, 5, 34, 24); } catch (_) { } } const titleImg = renderTextToImage(reportTitle, { fontSize: 17, bold: true, color: '#FFFFFF', width: 520, height: 44, align: 'center' }); doc.addImage(titleImg, 'PNG', pageW / 2 - 85, 3, 170, 17); if (subtitle) { const subImg = renderTextToImage(subtitle, { fontSize: 9, color: '#CCE4FF', width: 400, height: 28, align: 'center' }); doc.addImage(subImg, 'PNG', pageW / 2 - 55, 21, 110, 9); } const dateImg = renderTextToImage(reportDate, { fontSize: 8, color: '#BBDAFF', width: 160, height: 22, align: 'right' }); doc.addImage(dateImg, 'PNG', pageW - 58, 25, 52, 7); }; drawHeader(); const hashColIndex = headers.length - 1; autoTable(doc, { startY: 40, head: [headers], body: rows.map(r => r.map(c => String(c ?? ''))), theme: 'grid', styles: { font: 'helvetica', fontSize: 0.01, textColor: [255, 255, 255, 0], cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }, lineColor: [218, 218, 218], lineWidth: 0.3, minCellHeight: 10, valign: 'middle' }, headStyles: { fillColor: BLUE, textColor: [255, 255, 255, 0], minCellHeight: 12, lineColor: ORANGE, lineWidth: { bottom: 1.2, top: 0.3, left: 0.3, right: 0.3 } }, alternateRowStyles: { fillColor: [240, 246, 251] }, columnStyles: { [hashColIndex]: { cellWidth: 14, halign: 'center' } }, margin: { top: 40, left: 8, right: 8, bottom: 16 }, didDrawCell: (data) => { const text = String(data.cell.raw ?? ''); if (!text || text.trim() === '') return; const { x, y, width: w, height: h } = data.cell; const isHeader = data.section === 'head'; const isHashCol = data.column.index === data.table.columns.length - 1; const cellAlign = isHashCol ? 'center' : 'right'; const img = renderTextToImage(text, { fontSize: isHeader ? 10 : 9, bold: isHeader, color: isHeader ? '#FFFFFF' : '#1A1A1A', width: Math.max(Math.round(w * 3.8), 50), height: Math.max(Math.round(h * 3.8), 20), align: cellAlign }); try { doc.addImage(img, 'PNG', x + 0.5, y + 0.3, w - 1, h - 0.6); } catch (_) { } }, didDrawPage: (data) => { if (data.pageNumber > 1) drawHeader(); const pCount = doc.internal.getNumberOfPages(); doc.setFillColor(245, 247, 250); doc.rect(0, pageH - 12, pageW, 12, 'F'); doc.setDrawColor(...ORANGE); doc.setLineWidth(0.5); doc.line(8, pageH - 12, pageW - 8, pageH - 12); const mk = (t, w, a) => renderTextToImage(t, { fontSize: 7.5, color: '#555555', width: w, height: 18, align: a }); doc.addImage(mk(FOOTER_TEXT, 340, 'right'), 'PNG', 8, pageH - 10.5, 90, 6); doc.addImage(mk(`${data.pageNumber} / ${pCount}`, 110, 'center'), 'PNG', pageW / 2 - 18, pageH - 10.5, 36, 6); doc.addImage(mk(reportDate, 160, 'left'), 'PNG', pageW - 56, pageH - 10.5, 48, 6); } }); doc.save(filename);
}

async function exportWord(filename, reportTitle, subtitle, headers, rows) {
    const reportDate = new Date().toLocaleDateString('ar-EG'); const logoDataUrl = await getLogoBase64(); let logoBase64Raw = null; let logoW = 90, logoH = 60; if (logoDataUrl) { logoBase64Raw = logoDataUrl.split(',')[1]; await new Promise(res => { const img = new Image(); img.onload = () => { if (img.naturalHeight > 0) { logoH = 60; logoW = Math.round((img.naturalWidth / img.naturalHeight) * logoH); } res(); }; img.onerror = res; img.src = logoDataUrl; }); }
    try {
        const docxModule = await import('docx'); const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, ShadingType, BorderStyle, VerticalAlign, PageOrientation, ImageRun } = docxModule; const totalDxa = 13440; const hashColIdx = headers.length - 1; const narrowW = Math.max(600, Math.floor(totalDxa * 0.05)); const wideW = Math.floor((totalDxa - narrowW) / Math.max(headers.length - 1, 1)); const colWidths = headers.map((_, i) => i === hashColIdx ? narrowW : wideW); const CB = { top: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' } }; const makeCell = (text, { isHeader = false, width, center = false, altRow = false } = {}) => new TableCell({ width: { size: width, type: WidthType.DXA }, shading: { fill: isHeader ? '0865A8' : altRow ? 'F0F6FB' : 'FFFFFF', type: ShadingType.CLEAR }, borders: CB, margins: { top: 80, bottom: 80, left: 120, right: 120 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ bidirectional: true, alignment: center ? AlignmentType.CENTER : AlignmentType.RIGHT, children: [new TextRun({ text: String(text ?? ''), bold: isHeader, color: isHeader ? 'FFFFFF' : '1A1A1A', size: isHeader ? 22 : 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { value: 'ar-SA', eastAsia: 'ar-SA' } })] })] }); const logoRuns = []; if (logoBase64Raw && ImageRun) { try { const binary = atob(logoBase64Raw); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i); logoRuns.push(new ImageRun({ data: bytes, transformation: { width: logoW, height: logoH }, type: 'png' }), new TextRun({ text: '   ', size: 28 })); } catch (imgErr) { } } const arabicPara = (text, opts = {}) => new Paragraph({ bidirectional: true, alignment: opts.center ? AlignmentType.CENTER : AlignmentType.RIGHT, spacing: opts.spacing, shading: opts.shading, border: opts.border, children: [new TextRun({ text, bold: opts.bold || false, italics: opts.italic || false, color: opts.color || '111111', size: opts.size || 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { value: 'ar-SA', eastAsia: 'ar-SA' } })] }); const doc = new Document({ sections: [{ properties: { page: { size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 900, left: 720 } } }, children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, shading: { fill: '0865A8', type: ShadingType.CLEAR }, border: { bottom: { style: BorderStyle.THICK, size: 18, color: 'F57C00', space: 6 } }, spacing: { before: 0, after: 80 }, children: [...logoRuns, new TextRun({ text: reportTitle, color: 'FFFFFF', bold: true, size: 28, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { value: 'ar-SA', eastAsia: 'ar-SA' } }), ...(subtitle ? [new TextRun({ text: `  —  ${subtitle}`, color: 'D0E8FF', size: 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' } })] : [])] }), arabicPara(`تاريخ التقرير: ${reportDate}   |   إجمالي السجلات: ${rows.length}`, { size: 18, color: '555555', italic: true, spacing: { before: 100, after: 200 } }), new Table({ width: { size: totalDxa, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => makeCell(h, { isHeader: true, width: colWidths[i], center: i === hashColIdx })) }), ...rows.map((row, ri) => new TableRow({ children: row.map((cell, ci) => makeCell(cell, { isHeader: false, width: colWidths[ci], center: ci === hashColIdx, altRow: ri % 2 !== 0 })) }))] })] }] });
        let blob; if (typeof Packer.toBlob === 'function') { blob = await Packer.toBlob(doc); } else { const buf = await Packer.toBuffer(doc); blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }); } triggerDownload(blob, filename);
    } catch (err) { console.error('[exportWord] failed:', err); throw err; }
}

// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════
function resolveCertUrl(url) { if (!url) return null; if (url === 'uploaded') return url; if (url.startsWith('http://') || url.startsWith('https://')) return url; if (url.startsWith('/')) return `${API_HOST}${url}`; return url; }
function fmtDate(val) { if (!val) return ''; try { const d = new Date(val); if (isNaN(d.getTime())) return String(val); return d.toISOString().split('T')[0]; } catch { return String(val); } }
function toStatusKey(s) { if (!s) return 'Pending'; const map = { pending: 'Pending', approved: 'Approved', sent: 'Sent', sent_to_bank: 'Sent', rejected: 'Rejected' }; return map[String(s).toLowerCase()] ?? s; }

// ════════════════════════════════════════════════════════════════════════════
// PAGINATION COMPONENT — Team-styled
// ════════════════════════════════════════════════════════════════════════════
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, accentColor = T.blue }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    const buildPages = () => {
        const pages = []; const delta = 2; const left = currentPage - delta; const right = currentPage + delta;
        for (let i = 1; i <= totalPages; i++) { if (i === 1 || i === totalPages || (i >= left && i <= right)) pages.push(i); }
        const result = []; let prev = null;
        for (const p of pages) { if (prev !== null && p - prev > 1) result.push('...'); result.push(p); prev = p; }
        return result;
    };
    const pgBtn = (label, onClick, isActive, isDisabled) => (
        <button
            key={label + Math.random()}
            onClick={onClick}
            disabled={isDisabled}
            style={{
                minWidth: 34, height: 34, padding: '0 8px', borderRadius: 2,
                border: isActive ? `2px solid ${accentColor}` : `1.5px solid ${T.gray300}`,
                background: isActive ? accentColor : isDisabled ? T.gray100 : T.white,
                color: isActive ? T.white : isDisabled ? T.gray300 : T.gray700,
                fontFamily: T.font, fontSize: '.78rem', fontWeight: 700,
                cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1,
                transition: 'all .14s', lineHeight: 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
        >{label}</button>
    );
    return (
        <div className="adm-pg">
            <span className="adm-pg-info">
                عرض <strong>{start}</strong> – <strong>{end}</strong> من إجمالي{' '}
                <strong style={{ color: accentColor }}>{totalItems}</strong> سجل
            </span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                {pgBtn('«', () => onPageChange(1), false, currentPage === 1)}
                {pgBtn('‹', () => onPageChange(currentPage - 1), false, currentPage === 1)}
                {buildPages().map((p, i) =>
                    p === '...'
                        ? <span key={`el-${i}`} style={{ padding: '0 4px', color: T.gray300, fontSize: '.78rem' }}>…</span>
                        : pgBtn(p, () => onPageChange(p), p === currentPage, false)
                )}
                {pgBtn('›', () => onPageChange(currentPage + 1), false, currentPage === totalPages)}
                {pgBtn('»', () => onPageChange(totalPages), false, currentPage === totalPages)}
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// DATA NORMALIZERS
// ════════════════════════════════════════════════════════════════════════════
function normalizeUser(u) { return { id: u.id, username: u.username ?? u.email ?? '', firstName: u.firstName ?? u.first_name ?? (u.username ?? '').split(' ')[0] ?? '', lastName: u.lastName ?? u.last_name ?? (u.username ?? '').split(' ').slice(1).join(' ') ?? '', email: u.email ?? '', enrolledCourses: (u.courses ?? []).map(c => ({ enrollmentId: c.enrollmentId, id: c.planworkId ?? c.PlanworkId ?? c.planwork_id ?? c.courseId ?? c.serviceId ?? null, title: c.title ?? c.serviceTitle ?? '—', date: fmtDate(c.enrolledAt), attended: !!(c.attended), certificateUrl: c.certificateUrl ?? null, certificateName: c.certificateName ?? null, _userId: u.id, _titleRaw: c.title ?? c.serviceTitle ?? '' })) }; }
function normalizeCourse(c) { return { id: c.id, title: c.serviceTitle ?? c.title ?? '—', category: c.category ?? c.type ?? '', enrolledUsers: (c.users ?? []).map(u => { const nameParts = (u.username ?? '').trim().split(' '); return { enrollmentId: u.enrollmentId ?? null, id: u.id ?? u.userId ?? null, username: u.username ?? u.email ?? '', firstName: u.firstName ?? nameParts[0] ?? '', lastName: u.lastName ?? nameParts.slice(1).join(' ') ?? '', email: u.email ?? '', date: fmtDate(u.enrolledAt), attended: !!(u.attended ?? false), certificateUrl: u.certificateUrl ?? null, certificateName: u.certificateName ?? null }; }) }; }
function normalizeRefund(r) { return { id: r.id ?? r.Id, refNumber: r.refNumber ?? r.RefNumber ?? r.ref_number ?? '', orderId: r.orderId ?? r.OrderId ?? r.order_id ?? '', userId: r.userId ?? r.UserId ?? r.user_id, courseId: r.planworkId ?? r.PlanworkId ?? r.planwork_id ?? r.courseId ?? r.CourseId, amount: r.amount ?? r.Amount ?? 0, currency: r.currency ?? r.Currency ?? 'EGP', reason: r.reason ?? r.Reason ?? '', details: r.details ?? r.Details ?? r.notes ?? '', status: toStatusKey(r.status ?? r.Status ?? 'Pending'), bankName: r.bankName ?? r.BankName ?? r.bank_name ?? '', accountNumber: r.accountNumber ?? r.AccountNumber ?? r.account_number ?? '', accountHolder: r.accountHolder ?? r.AccountHolder ?? r.account_holder ?? '', iban: r.iban ?? r.IBAN ?? '', adminNote: r.adminNote ?? r.AdminNote ?? '', rejectionReason: r.rejectionReason ?? r.RejectionReason ?? '', requestedAt: fmtDate(r.requestedAt ?? r.RequestedAt ?? r.createdAt ?? r.CreatedAt), approvedAt: fmtDate(r.approvedAt ?? r.ApprovedAt), sentAt: fmtDate(r.sentAt ?? r.SentAt), rejectedAt: fmtDate(r.rejectedAt ?? r.RejectedAt), bankResult: r.bankResult ?? r.BankResult ?? null }; }

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const exportRef = useRef(null);
    const exportAttRef = useRef(null);
    const exportCertRef = useRef(null);
    const exportRefundRef = useRef(null);

    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const coursesDataRef = useRef([]);
    const usersDataRef = useRef([]);
    React.useEffect(() => { coursesDataRef.current = coursesData; }, [coursesData]);
    React.useEffect(() => { usersDataRef.current = usersData; }, [usersData]);
    const [apiStats, setApiStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [exportAttMenuOpen, setExportAttMenuOpen] = useState(false);
    const [exportCertMenuOpen, setExportCertMenuOpen] = useState(false);
    const [exportRefMenuOpen, setExportRefMenuOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState(null);
    const [usersPage, setUsersPage] = useState(1);
    const [coursesPage, setCoursesPage] = useState(1);
    const [attPage, setAttPage] = useState(1);
    const [certPage, setCertPage] = useState(1);
    const [refundPage, setRefundPage] = useState(1);
    const [attendance, setAttendance] = useState({});
    const [attendanceSaving, setAttendanceSaving] = useState({});
    const [attError, setAttError] = useState(null);
    const [attCourseFilter, setAttCourseFilter] = useState('all');
    const [attUserSearch, setAttUserSearch] = useState('');
    const [certificates, setCertificates] = useState({});
    const [certUploading, setCertUploading] = useState({});
    const [certDeleting, setCertDeleting] = useState({});
    const [certError, setCertError] = useState(null);
    const [certModal, setCertModal] = useState(null);
    const [certDragOver, setCertDragOver] = useState(false);
    const certFileInputRef = useRef(null);
    const [certSearch, setCertSearch] = useState('');
    const [certStatusFilter, setCertStatusFilter] = useState('all');
    const [refunds, setRefunds] = useState([]);
    const [refundsLoading, setRefundsLoading] = useState(false);
    const [refundsError, setRefundsError] = useState(null);
    const [refundStatusFilter, setRefundStatusFilter] = useState('all');
    const [refundSearch, setRefundSearch] = useState('');
    const [refundDetailModal, setRefundDetailModal] = useState(null);
    const [refundActionModal, setRefundActionModal] = useState(null);
    const [refundActionNote, setRefundActionNote] = useState('');
    const [refundActionSaving, setRefundActionSaving] = useState(false);
    const [refundActionError, setRefundActionError] = useState('');
    const [bankResultBanner, setBankResultBanner] = useState(null);

    useEffect(() => { injectAdminStyles(); }, []);
    useEffect(() => { setUsersPage(1); setExpandedRow(null); }, [searchQuery, dateFrom, dateTo]);
    useEffect(() => { setCoursesPage(1); setExpandedRow(null); }, [searchQuery, dateFrom, dateTo]);
    useEffect(() => { setUsersPage(1); setCoursesPage(1); setExpandedRow(null); }, [activeTab]);
    useEffect(() => { setAttPage(1); }, [attCourseFilter, attUserSearch]);
    useEffect(() => { setCertPage(1); }, [certSearch, certStatusFilter]);
    useEffect(() => { setRefundPage(1); }, [refundSearch, refundStatusFilter]);

    const authFetch = useCallback(async (url, options = {}) => {
        let token = null; try { token = await getToken(); } catch (_) { }
        return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
    }, [getToken]);

    const authFetchForm = useCallback(async (url, formData) => {
        let token = null; try { token = await getToken(); } catch (_) { }
        return fetch(url, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData });
    }, [getToken]);

    const fetchRefunds = useCallback(async (statusFilter = 'all') => {
        setRefundsLoading(true); setRefundsError(null);
        try {
            const qs = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
            const res = await authFetch(`${API_BASE}/refund/admin/all${qs}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const raw = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.items) ? json.items : [];
            setRefunds(raw.map(normalizeRefund));
        } catch (err) { setRefundsError('فشل تحميل طلبات الاسترداد: ' + err.message); }
        finally { setRefundsLoading(false); }
    }, [authFetch]);

    const commitRefundAction = async () => {
        if (!refundActionModal) return;
        const { refund: r, action } = refundActionModal;
        if (action === 'reject' && !refundActionNote.trim()) return;
        setRefundActionSaving(true); setRefundActionError('');
        try {
            const endpoint = { approve: `${API_BASE}/refund/${r.id}/approve`, reject: `${API_BASE}/refund/${r.id}/reject`, send_to_bank: `${API_BASE}/refund/${r.id}/sent` }[action];
            const body = {};
            if (action === 'reject') body.rejectionReason = refundActionNote.trim();
            if (action === 'approve') body.adminNote = refundActionNote.trim();
            if (action === 'send_to_bank') body.adminNote = refundActionNote.trim();
            const res = await authFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) });
            if (!res.ok) { const errJson = await res.json().catch(() => ({})); throw new Error(errJson?.message ?? errJson?.error ?? `HTTP ${res.status}`); }
            const updated = await res.json();
            const normalized = normalizeRefund(updated);
            if (action === 'send_to_bank') {
                const bankRes = normalized.bankResult ?? updated?.bankResult ?? null;
                if (bankRes === 'SUCCESS' || bankRes === 'success') setBankResultBanner({ type: 'success', msg: `✅ نجح التحويل البنكي — الفلوس رجعت على الكارت تلقائياً (${r.refNumber || r.id})` });
                else if (bankRes === 'FAILED' || bankRes === 'failed') setBankResultBanner({ type: 'failed', msg: `⚠️ فشل التحويل البنكي — يتم التحويل يدوياً على IBAN: ${r.iban || '—'}` });
                setTimeout(() => setBankResultBanner(null), 12000);
            }
            setRefundActionModal(null); setRefundActionNote(''); setRefundDetailModal(null);
            await fetchRefunds(refundStatusFilter);
        } catch (err) { setRefundActionError(err.message || 'حدث خطأ أثناء تنفيذ الإجراء'); }
        finally { setRefundActionSaving(false); }
    };

    useEffect(() => { if (!isLoaded || !user) return; if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) navigate('/'); }, [isLoaded, user, navigate]);

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                const [usersRes, coursesRes, statsRes] = await Promise.all([authFetch(`${API_BASE}/Admin/users`), authFetch(`${API_BASE}/Admin/planworks`), authFetch(`${API_BASE}/Admin/stats`)]);
                let usersRaw = [], coursesRaw = [], statsRaw = null;
                if (usersRes.ok) { const j = await usersRes.json(); usersRaw = Array.isArray(j) ? j : j?.data ?? j?.users ?? j?.result ?? []; } else { const errText = await usersRes.text().catch(() => ''); setError(`Users API ${usersRes.status}: ${errText.slice(0, 200)}`); }
                if (coursesRes.ok) { const j = await coursesRes.json(); coursesRaw = Array.isArray(j) ? j : j?.data ?? j?.planWorks ?? j?.planworks ?? j?.courses ?? j?.result ?? []; }
                if (statsRes.ok) statsRaw = await statsRes.json();
                const normalizedUsers = usersRaw.map(normalizeUser).filter(u => u.id != null);
                const normalizedCourses = coursesRaw.map(normalizeCourse).filter(c => c.id != null);
                setUsersData(normalizedUsers); setCoursesData(normalizedCourses); setApiStats(statsRaw);
                seedAttendance(normalizedUsers);
                await loadCertificatesFromApi(normalizedUsers);
            } catch (err) { setError(err.message || 'حدث خطأ أثناء تحميل البيانات'); }
            finally { setLoading(false); }
        };
        if (isLoaded && user) load();
    }, [isLoaded, user, authFetch]);

    useEffect(() => { if (activeTab === 'refunds') fetchRefunds(); }, [activeTab, fetchRefunds]);
    useEffect(() => { if (activeTab === 'refunds') fetchRefunds(refundStatusFilter); }, [refundStatusFilter]); // eslint-disable-line
    useEffect(() => { if (activeTab === 'certificates') refreshCertificates(); }, [activeTab]); // eslint-disable-line

    useEffect(() => {
        const h = e => {
            if (exportRef.current && !exportRef.current.contains(e.target)) setExportMenuOpen(false);
            if (exportAttRef.current && !exportAttRef.current.contains(e.target)) setExportAttMenuOpen(false);
            if (exportCertRef.current && !exportCertRef.current.contains(e.target)) setExportCertMenuOpen(false);
            if (exportRefundRef.current && !exportRefundRef.current.contains(e.target)) setExportRefMenuOpen(false);
        };
        document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);

    const loadCertificatesFromApi = useCallback(async (_usersArr) => {
        try {
            const res = await authFetch(`${API_BASE}/Admin/certificates`);
            if (!res.ok) return;
            const json = await res.json();
            const certsArr = Array.isArray(json) ? json : json?.data ?? json?.certificates ?? json?.result ?? [];
            const map = {};
            certsArr.forEach(raw => {
                const certId = raw.id ?? raw.Id ?? null;
                const userId = raw.userId ?? raw.UserId ?? null;
                const planworkId = raw.planworkId ?? raw.PlanworkId ?? null;
                const rawFileUrl = raw.fileUrl ?? raw.FileUrl ?? raw.filePath ?? raw.FilePath ?? null;
                const fileName = raw.fileName ?? raw.FileName ?? (rawFileUrl ? rawFileUrl.split('/').pop().split('?')[0] : 'certificate');
                const uploadedAt = fmtDate(raw.uploadedAt ?? raw.UploadedAt ?? null);
                let fileUrl = null;
                if (rawFileUrl && rawFileUrl !== 'uploaded') fileUrl = rawFileUrl.startsWith('http') ? rawFileUrl : `${API_HOST}${rawFileUrl}`;
                if (!certId || userId == null || planworkId == null) return;
                const key = `${Number(userId)}-${Number(planworkId)}`;
                map[key] = { certId, name: fileName, url: fileUrl, rawUrl: rawFileUrl, size: null, fromDb: true, uploadedAt, userId, planworkId };
            });
            setCertificates(map);
        } catch (err) { console.warn('[Certs] load failed:', err.message); }
    }, [authFetch]);

    const refreshCertificates = useCallback(async () => { await loadCertificatesFromApi(); }, [loadCertificatesFromApi]);
    const seedAttendance = useCallback((users) => { const map = {}; users.forEach(u => { u.enrolledCourses.forEach(c => { if (c.enrollmentId != null) map[String(c.enrollmentId)] = !!c.attended; }); }); setAttendance(map); }, []);

    const toggleAttendance = async (enrollmentId, currentVal) => {
        if (enrollmentId == null) { setAttError('لا يوجد enrollmentId لهذا التسجيل'); return; }
        const k = String(enrollmentId); const newVal = !currentVal;
        setAttendance(p => ({ ...p, [k]: newVal })); setAttendanceSaving(p => ({ ...p, [k]: true })); setAttError(null);
        try {
            const res = await authFetch(`${API_BASE}/Admin/enrollments/${enrollmentId}/attendance`, { method: 'PATCH', body: JSON.stringify(newVal) });
            if (!res.ok) { const errJson = await res.json().catch(() => ({})); throw new Error(errJson?.message ?? `HTTP ${res.status}`); }
        } catch (err) { setAttendance(p => ({ ...p, [k]: currentVal })); setAttError('فشل تحديث الحضور: ' + err.message); }
        finally { setAttendanceSaving(p => ({ ...p, [k]: false })); }
    };

    const handleCertFile = async (enrollmentId, userId, planworkId, file) => {
        if (!file) return;
        const fallbackKey = `${Number(userId)}-${Number(planworkId)}`;
        setCertUploading(p => ({ ...p, [fallbackKey]: true })); setCertError(null);
        try {
            const existing = certificates[fallbackKey];
            let uploadRes, uploadText;
            if (existing?.certId != null) {
                const fd = new FormData(); fd.append('CertificateId', Number(existing.certId)); fd.append('File', file, file.name);
                let token = null; try { token = await getToken(); } catch (_) { }
                uploadRes = await fetch(`${API_BASE}/Admin/certificates`, { method: 'PUT', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd }); uploadText = await uploadRes.text();
            } else {
                const fd = new FormData();
                if (userId != null) fd.append('UserId', Number(userId));
                if (planworkId != null) fd.append('PlanworkId', Number(planworkId));
                if (enrollmentId != null) fd.append('EnrollmentId', Number(enrollmentId));
                fd.append('File', file, file.name);
                uploadRes = await authFetchForm(`${API_BASE}/Admin/upload`, fd); uploadText = await uploadRes.text();
            }
            if (!uploadRes.ok) { let msg = `HTTP ${uploadRes.status}`; try { const j = JSON.parse(uploadText); msg = j?.message ?? j?.error ?? j?.title ?? j?.detail ?? msg; } catch { if (uploadText.trim().length < 400) msg = uploadText.trim(); } throw new Error(msg); }
            await refreshCertificates();
        } catch (err) { setCertError('فشل رفع الشهادة: ' + err.message); }
        finally { setCertUploading(p => ({ ...p, [fallbackKey]: false })); setCertModal(null); }
    };

    const viewCert = useCallback(async (certId, url, rawUrl, filename = 'certificate', userId = null, planworkId = null) => {
        if (certId == null && !url && !rawUrl && userId == null) return;

        let token = null;
        try { token = await getToken(); } catch (_) { }
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

        let fileUrl = null;

        // جيب الـ URL من الـ API
        if (userId != null && planworkId != null) {
            try {
                const metaRes = await fetch(`${API_BASE}/Admin/certificates/${userId}/${planworkId}`, { headers: authHeaders });
                if (metaRes.ok) {
                    const meta = await metaRes.json();
                    const obj = Array.isArray(meta) ? meta[0] : meta;
                    const fu = obj?.fileUrl ?? obj?.FileUrl ?? obj?.url ?? obj?.Url ?? null;
                    if (fu && fu !== 'uploaded') {
                        fileUrl = fu.startsWith('http') ? fu : `${API_HOST}${fu}`;
                    }
                }
            } catch (_) { }
        }

        if (!fileUrl && url && url !== 'uploaded') fileUrl = url;
        if (!fileUrl && rawUrl) fileUrl = rawUrl.startsWith('http') ? rawUrl : `${API_HOST}${rawUrl}`;

        // ✅ افتح مباشرة بدون blob
        if (fileUrl) {
            window.open(fileUrl, '_blank');
            return;
        }

        setCertError('تعذّر فتح الشهادة — تأكد من صلاحية الجلسة أو تواصل مع المطور');
    }, [getToken]);
    const deleteCert = useCallback(async (ck, altKey = null) => {
        const cert = certificates[ck] ?? (altKey ? certificates[altKey] : undefined); const certId = cert?.certId;
        if (!window.confirm('هل تريد حذف هذه الشهادة؟')) return;
        setCertDeleting(p => ({ ...p, [ck]: true })); setCertError(null);
        try {
            if (certId != null) { const res = await authFetch(`${API_BASE}/Admin/certificates/${certId}`, { method: 'DELETE' }); if (!res.ok && res.status !== 404) { const j = await res.json().catch(() => ({})); throw new Error(j?.message ?? j?.title ?? `HTTP ${res.status}`); } }
            await refreshCertificates();
        } catch (err) { setCertError('فشل حذف الشهادة: ' + err.message); }
        finally { setCertDeleting(p => ({ ...p, [ck]: false })); }
    }, [authFetch, certificates, refreshCertificates]);

    // ── Derived Data ──
    const inRange = d => { if (!dateFrom && !dateTo) return true; if (!d) return false; const dt = new Date(d); if (isNaN(dt.getTime())) return false; if (dateFrom && dt < new Date(dateFrom)) return false; if (dateTo) { const toEnd = new Date(dateTo); toEnd.setDate(toEnd.getDate() + 1); if (dt >= toEnd) return false; } return true; };
    const q = searchQuery.toLowerCase();
    const filteredUsers = usersData.map(u => ({ ...u, enrolledCourses: u.enrolledCourses.filter(c => inRange(c.date)) })).filter(u => { const matchSearch = `${u.firstName} ${u.lastName} ${u.email} ${u.username}`.toLowerCase().includes(q); if ((dateFrom || dateTo) && u.enrolledCourses.length === 0) return false; return matchSearch; });
    const filteredCourses = coursesData.map(c => ({ ...c, enrolledUsers: c.enrolledUsers.filter(u => inRange(u.date)) })).filter(c => { const matchSearch = `${c.title} ${c.category}`.toLowerCase().includes(q); if ((dateFrom || dateTo) && c.enrolledUsers.length === 0) return false; return matchSearch; });
    const paginatedUsers = filteredUsers.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE);
    const paginatedCourses = filteredCourses.slice((coursesPage - 1) * ITEMS_PER_PAGE, coursesPage * ITEMS_PER_PAGE);
    const attRows = usersData.flatMap(u => u.enrolledCourses.filter(c => c.enrollmentId != null).map(c => ({ user: u, course: c }))).filter(r => { const mc = attCourseFilter === 'all' || r.course.id === Number(attCourseFilter); const mu = `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.user.username}`.toLowerCase().includes(attUserSearch.toLowerCase()); return mc && mu; });
    const attCount = attRows.filter(r => !!attendance[String(r.course.enrollmentId)]).length;
    const certsByUser = {};
    Object.values(certificates).forEach(ce => { if (!ce || ce.userId == null || ce.planworkId == null) return; const uid = Number(ce.userId); if (!certsByUser[uid]) certsByUser[uid] = []; certsByUser[uid].push(ce); });
    const certRows = usersData.flatMap(u => u.enrolledCourses.map(c => {
        const matchedCourse = coursesData.find(cd => cd.title === (c._titleRaw || c.title) || cd.title === c.title);
        const resolvedPlanworkId = c.id ?? matchedCourse?.id ?? null;
        const eidKey = c.enrollmentId != null ? String(c.enrollmentId) : null;
        const fallbackKey = resolvedPlanworkId != null ? `${Number(u.id)}-${Number(resolvedPlanworkId)}` : null;
        const userCerts = certsByUser[Number(u.id)] ?? [];
        const titleMatch = userCerts.find(ce => { const mc = coursesData.find(cd => Number(cd.id) === Number(ce.planworkId)); return mc && (mc.title === (c._titleRaw || c.title) || mc.title === c.title); });
        const titleMatchKey = titleMatch ? `${Number(u.id)}-${Number(titleMatch.planworkId)}` : null;
        const certKey = fallbackKey ?? titleMatchKey ?? eidKey ?? `${u.id}-unknown`;
        const altKey = certKey !== titleMatchKey ? titleMatchKey : (certKey !== eidKey ? eidKey : null);
        const finalPlanworkId = resolvedPlanworkId ?? titleMatch?.planworkId ?? null;
        return { user: u, course: c, certKey, altKey, enrollmentId: c.enrollmentId, userId: u.id, planworkId: finalPlanworkId };
    })).filter(r => {
        const matchSearch = `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.user.username} ${r.course.title}`.toLowerCase().includes(certSearch.toLowerCase());
        const hasCert = !!(certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined));
        const isAtt = !!attendance[String(r.enrollmentId)];
        const matchStatus = certStatusFilter === 'all' ? true : certStatusFilter === 'uploaded' ? hasCert : certStatusFilter === 'pending' ? (!hasCert && isAtt) : certStatusFilter === 'not-attended' ? !isAtt : true;
        return matchSearch && matchStatus;
    });
    const totalCerts = (() => { const seen = new Set(); let n = 0; Object.values(certificates).forEach(v => { const key = v?.certId ?? `_noId_${n}`; if (!seen.has(key)) { seen.add(key); n++; } }); return n; })();
    const totalEnrollments = usersData.reduce((s, u) => s + u.enrolledCourses.length, 0);
    const gs = (fields, fb) => { if (!apiStats) return fb; for (const f of fields) { if (apiStats[f] != null) return apiStats[f]; } return fb; };
    const displayStats = { users: gs(['usersCount'], usersData.length), courses: gs(['planworksCount'], coursesData.length), enrollments: gs(['enrollmentsCount'], totalEnrollments), attended: gs(['attendanceCount'], attCount), certificates: gs(['certificatesCount'], totalCerts), refundsPending: gs(['refundsCount'], refunds.filter(r => r.status === 'Pending').length) };
    const refundSearch_q = refundSearch.toLowerCase();
    const filteredRefunds = refunds.filter(r => { const u = usersData.find(u => u.id === r.userId); const c = coursesData.find(c => c.id === r.courseId); const matchStatus = refundStatusFilter === 'all' || r.status === toStatusKey(refundStatusFilter); const matchSearch = !refundSearch_q || [r.refNumber, r.orderId, r.reason, u ? `${u.firstName} ${u.lastName}` : '', c?.title ?? '', String(r.amount)].join(' ').toLowerCase().includes(refundSearch_q); return matchStatus && matchSearch; });
    const refundStats = { total: refunds.length, pending: refunds.filter(r => r.status === 'Pending').length, approved: refunds.filter(r => r.status === 'Approved').length, sent: refunds.filter(r => r.status === 'Sent').length, rejected: refunds.filter(r => r.status === 'Rejected').length, totalAmount: refunds.filter(r => r.status !== 'Rejected').reduce((s, r) => s + (r.amount || 0), 0) };
    const refundUserLookup = id => usersData.find(u => u.id === id) ?? { firstName: '—', lastName: '', email: '—' };
    const refundCourseLookup = id => coursesData.find(c => c.id === id) ?? { title: '—' };
    const paginatedAttRows = attRows.slice((attPage - 1) * ITEMS_PER_PAGE, attPage * ITEMS_PER_PAGE);
    const paginatedCertRows = certRows.slice((certPage - 1) * ITEMS_PER_PAGE, certPage * ITEMS_PER_PAGE);
    const paginatedRefunds = filteredRefunds.slice((refundPage - 1) * ITEMS_PER_PAGE, refundPage * ITEMS_PER_PAGE);

    // ── Export helpers ──
    const withExport = fn => async () => { setExporting(true); setExportMenuOpen(false); setExportAttMenuOpen(false); setExportCertMenuOpen(false); setExportRefMenuOpen(false); setExportError(null); try { await fn(); } catch (e) { setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); } finally { setExporting(false); } };
    const doExcel = withExport(async () => { const raw = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportExcel(activeTab === 'users' ? 'المستخدمون-والدورات.xlsx' : 'الدورات-والمستخدمون.xlsx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows); });
    const doPDF = withExport(async () => { const raw = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportPDF(activeTab === 'users' ? 'تقرير-المستخدمين.pdf' : 'تقرير-الدورات.pdf', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', headers, rows, 'ICEMT'); });
    const doWord = withExport(async () => { const raw = activeTab === 'users' ? buildUsersRows(filteredUsers) : buildCoursesRows(filteredCourses); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportWord(activeTab === 'users' ? 'تقرير-المستخدمين.docx' : 'تقرير-الدورات.docx', activeTab === 'users' ? 'تقرير المستخدمين والدورات' : 'تقرير الدورات والمستخدمين', 'ICEMT', headers, rows); });
    const buildAttRows = () => { const headers = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'الحضور']; const rows = attRows.map((r, i) => [i + 1, `${r.user.firstName || r.user.username} ${r.user.lastName}`.trim(), r.user.email, r.course.title, attendance[String(r.course.enrollmentId)] ? 'حضر' : 'غائب']); return { headers, rows }; };
    const doAttExcel = withExport(async () => { const raw = buildAttRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportExcel('تقرير-الحضور.xlsx', 'تقرير الحضور', headers, rows); });
    const doAttPDF = withExport(async () => { const raw = buildAttRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportPDF('تقرير-الحضور.pdf', 'تقرير الحضور', headers, rows, 'ICEMT'); });
    const doAttWord = withExport(async () => { const raw = buildAttRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportWord('تقرير-الحضور.docx', 'تقرير الحضور', 'ICEMT', headers, rows); });
    const buildCertRows = () => { const headers = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'الحضور', 'الشهادة']; const rows = certRows.map((r, i) => { const cert = certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined); const isAtt = !!attendance[String(r.enrollmentId)]; return [i + 1, `${r.user.firstName || r.user.username} ${r.user.lastName}`.trim(), r.user.email, r.course.title, isAtt ? 'حضر' : 'غائب', cert ? (cert.name && cert.name !== 'uploaded' ? cert.name : 'مرفوعة') : 'لم تُرفع']; }); return { headers, rows }; };
    const doCertExcel = withExport(async () => { const raw = buildCertRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportExcel('تقرير-الشهادات.xlsx', 'تقرير الشهادات', headers, rows); });
    const doCertPDF = withExport(async () => { const raw = buildCertRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportPDF('تقرير-الشهادات.pdf', 'تقرير الشهادات', headers, rows, 'ICEMT'); });
    const doCertWord = withExport(async () => { const raw = buildCertRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportWord('تقرير-الشهادات.docx', 'تقرير الشهادات', 'ICEMT', headers, rows); });
    const buildRefundRows = () => { const headers = ['#', 'رقم الطلب', 'المستخدم', 'البريد الإلكتروني', 'الدورة', 'المبلغ', 'العملة', 'الحالة', 'السبب', 'تاريخ الطلب']; const rows = filteredRefunds.map((r, i) => { const u = refundUserLookup(r.userId); const c = refundCourseLookup(r.courseId); const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending; return [i + 1, r.refNumber || r.id, `${u.firstName} ${u.lastName}`.trim(), u.email, c.title, r.amount, r.currency, sm.label, r.reason || '', r.requestedAt || '']; }); return { headers, rows }; };
    const doRefundExcel = withExport(async () => { const raw = buildRefundRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportExcel('تقرير-المستردات.xlsx', 'تقرير المستردات', headers, rows); });
    const doRefundPDF = withExport(async () => { const raw = buildRefundRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportPDF('تقرير-المستردات.pdf', 'تقرير المستردات', headers, rows, 'ICEMT'); });
    const doRefundWord = withExport(async () => { const raw = buildRefundRows(); const { headers, rows } = rtlExport(raw.headers, raw.rows); await exportWord('تقرير-المستردات.docx', 'تقرير المستردات', 'ICEMT', headers, rows); });

    // ── Early returns ──
    if (!isLoaded || !user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: T.gray100 }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: `3px solid ${T.gray300}`, borderTopColor: T.blue, borderRadius: '50%', animation: 'adm-spin .7s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: T.blue, fontFamily: T.font, fontSize: '.9rem' }}>جاري التحقق...</p>
            </div>
        </div>
    );
    if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) return null;

    const isExportTab = activeTab === 'users' || activeTab === 'courses';

    const TABS = [
        { id: 'users', label: 'المستخدمون', icon: '👤' },
        { id: 'courses', label: 'الدورات', icon: '📚' },
        { id: 'attendance', label: 'الحضور', icon: '✅' },
        { id: 'certificates', label: 'الشهادات', icon: '📜' },
        { id: 'refunds', label: 'المستردات', icon: '💳' },
    ];

    const STATS = [
        { label: 'المستخدمون', value: displayStats.users, icon: '👤', blue: false },
        { label: 'الدورات', value: displayStats.courses, icon: '📚', blue: true },
        { label: 'التسجيلات', value: displayStats.enrollments, icon: '🔗', blue: false },
        { label: 'حضروا', value: displayStats.attended, icon: '🎓', blue: true },
        { label: 'الشهادات', value: displayStats.certificates, icon: '📜', blue: false },
        { label: 'المستردات', value: displayStats.refundsPending, icon: '💳', blue: true },
    ];

    const TAB_TITLES = {
        users: { tag: 'إدارة البيانات', title: <>المستخدمون <span>والدورات</span></> },
        courses: { tag: 'إدارة البيانات', title: <>الدورات <span>والمستخدمون</span></> },
        attendance: { tag: 'متابعة الحضور', title: <>سجل <span>الحضور</span></> },
        certificates: { tag: 'إدارة الشهادات', title: <><span>الشهادات</span> الإلكترونية</> },
        refunds: { tag: 'المالية', title: <>طلبات <span>الاسترداد</span></> },
    };

    return (
        <>
            {/* ── Loading overlay ── */}
            {exporting && (
                <div className="adm-ovl">
                    <div className="adm-ovlb">
                        <div className="adm-sp" />
                        <p>جاري تصدير الملف... يرجى الانتظار</p>
                    </div>
                </div>
            )}

            {/* ── Breadcrumb ── */}
            <div className="adm-bc">
                <a href="/">الصفحة الرئيسية</a>
                <span className="sep">•</span>
                <span className="cur">لوحة الإدارة</span>
            </div>

            {/* ── Upload Certificate Modal ── */}
            {certModal && (
                <div className="adm-modal-bg" onClick={() => setCertModal(null)}>
                    <div className="adm-modal" onClick={e => e.stopPropagation()}>
                        <h3>📜 رفع شهادة</h3>
                        <p>{certModal.userName} — {certModal.courseTitle}</p>
                        <div
                            className={`adm-drop${certDragOver ? ' over' : ''}`}
                            onClick={() => certFileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setCertDragOver(true); }}
                            onDragLeave={() => setCertDragOver(false)}
                            onDrop={e => { e.preventDefault(); setCertDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleCertFile(certModal.enrollmentId, certModal.userId, certModal.planworkId, f); }}
                        >
                            <div className="adm-drop-icon">📂</div>
                            <div className="adm-drop-txt">اسحب الملف هنا أو اضغط للاختيار</div>
                            <div className="adm-drop-sub">PDF, JPG, PNG — حجم أقصى 10 MB</div>
                            <input ref={certFileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                                onChange={e => { const f = e.target.files[0]; if (f) handleCertFile(certModal.enrollmentId, certModal.userId, certModal.planworkId, f); e.target.value = ''; }} />
                        </div>
                        {certUploading[certModal.certKey] && (
                            <div style={{ textAlign: 'center', marginTop: 12, color: T.orange, fontSize: '.8rem', fontWeight: 700, fontFamily: T.font }}>⏳ جاري الرفع على السيرفر...</div>
                        )}
                        <div className="adm-modal-actions">
                            <button className="adm-modal-cancel" onClick={() => setCertModal(null)}>إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Refund Detail Modal ── */}
            {refundDetailModal && (() => {
                const r = refunds.find(x => x.id === refundDetailModal.id) || refundDetailModal;
                const u = refundUserLookup(r.userId);
                const c = refundCourseLookup(r.courseId);
                const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
                return (
                    <div className="adm-modal-bg" onClick={() => setRefundDetailModal(null)}>
                        <div className="adm-modal rd" style={{ borderTopColor: sm.color }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div>
                                    <h3>💳 تفاصيل طلب الاسترداد</h3>
                                    <div style={{ fontSize: '.62rem', color: T.gray500, marginTop: 2, fontFamily: T.font }}>{r.refNumber || r.id}</div>
                                </div>
                                <span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span>
                            </div>
                            <div className="rf-detail">
                                <div><div className="rf-field-lbl">رقم الأوردر</div><div className="rf-field-val mono">{r.orderId || '—'}</div></div>
                                <div><div className="rf-field-lbl">المبلغ</div><div className="rf-field-val"><span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span> <span style={{ fontSize: '.6rem', color: T.gray500 }}>{r.currency}</span></div></div>
                                <div><div className="rf-field-lbl">المستخدم</div><div className="rf-field-val">{`${u.firstName} ${u.lastName}`.trim() || '—'}</div></div>
                                <div><div className="rf-field-lbl">البريد الإلكتروني</div><div className="rf-field-val mono" style={{ fontSize: '.68rem' }}>{u.email || '—'}</div></div>
                                <div><div className="rf-field-lbl">الدورة</div><div className="rf-field-val">{c.title || '—'}</div></div>
                                <div><div className="rf-field-lbl">تاريخ الطلب</div><div className="rf-field-val mono">{r.requestedAt || '—'}</div></div>
                                <div className="rf-full"><div className="rf-field-lbl">سبب الاسترداد</div><div className="rf-field-val" style={{ fontWeight: 400 }}>{r.reason || '—'}</div></div>
                                {r.details && <div className="rf-full"><div className="rf-field-lbl">تفاصيل إضافية</div><div className="rf-field-val" style={{ fontWeight: 400, fontSize: '.72rem', lineHeight: 1.5 }}>{r.details}</div></div>}
                                <hr className="rf-divider" />
                                <div className="rf-bank-block">
                                    <div className="rf-bank-title">🏦 بيانات البنك</div>
                                    <div className="rf-bank-grid">
                                        {[['اسم البنك', r.bankName || '—', false], ['صاحب الحساب', r.accountHolder || '—', false], ['رقم الحساب', r.accountNumber || '—', true], ['IBAN', r.iban || '—', true]].map(([lbl, val, mono]) => (
                                            <div key={lbl}><div className="rf-field-lbl">{lbl}</div><div className={`rf-field-val${mono ? ' mono' : ''}`} style={{ fontSize: '.72rem' }}>{val}</div></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {(r.status === 'Pending' || r.status === 'Approved') && (
                                <div className="rf-action-area">
                                    <div className="rf-action-row">
                                        {r.status === 'Pending' && <><button className="rf-action-btn approve" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'approve' }); }}>✅ موافقة</button><button className="rf-action-btn bank" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'send_to_bank' }); }}>🏦 إرسال للبنك</button><button className="rf-action-btn reject" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'reject' }); }}>❌ رفض</button></>}
                                        {r.status === 'Approved' && <button className="rf-action-btn bank" onClick={() => { setRefundDetailModal(null); setRefundActionModal({ refund: r, action: 'send_to_bank' }); }}>🏦 إرسال للبنك</button>}
                                    </div>
                                </div>
                            )}
                            <div className="adm-modal-actions">
                                <button className="adm-modal-cancel" onClick={() => setRefundDetailModal(null)}>إغلاق</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ── Refund Action Modal ── */}
            {refundActionModal && (() => {
                const { refund: r, action } = refundActionModal;
                const u = refundUserLookup(r.userId);
                const am = {
                    approve: { title: '✅ تأكيد الموافقة', color: '#16a34a', cls: 'approve', placeholder: 'ملاحظة للمستخدم (اختياري)...' },
                    reject: { title: '❌ تأكيد الرفض', color: '#dc2626', cls: 'reject', placeholder: 'سبب الرفض (مطلوب)...' },
                    send_to_bank: { title: '🏦 تأكيد الإرسال للبنك', color: T.blue, cls: 'bank', placeholder: 'مرجع التحويل البنكي (اختياري)...' },
                }[action];
                return (
                    <div className="adm-modal-bg" onClick={() => !refundActionSaving && setRefundActionModal(null)}>
                        <div className="adm-modal rd" style={{ maxWidth: 450, borderTopColor: am.color }} onClick={e => e.stopPropagation()}>
                            <h3>{am.title}</h3>
                            <p>طلب <strong>{r.refNumber || r.id}</strong> — <strong>{`${u.firstName} ${u.lastName}`.trim() || '—'}</strong><br />
                                المبلغ: <strong style={{ color: '#15803d', fontFamily: 'Courier New' }}>{Number(r.amount || 0).toLocaleString()} {r.currency}</strong></p>
                            {refundActionError && <div className="adm-err">⚠️ {refundActionError}</div>}
                            <textarea className="rf-textarea" placeholder={am.placeholder} value={refundActionNote} onChange={e => setRefundActionNote(e.target.value)} disabled={refundActionSaving} />
                            <div className="adm-modal-actions">
                                <button className="adm-modal-cancel" onClick={() => { setRefundActionModal(null); setRefundActionNote(''); setRefundActionError(''); }} disabled={refundActionSaving}>إلغاء</button>
                                <button className={`rf-action-confirm ${am.cls}`} onClick={commitRefundAction} disabled={refundActionSaving || (action === 'reject' && !refundActionNote.trim())}>
                                    {refundActionSaving ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'adm-spin .6s linear infinite', marginLeft: 6, verticalAlign: 'middle' }} />جاري...</> : 'تأكيد'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ══ ROOT ══ */}
            <div className="adm-root">

                {/* ── SIDEBAR ── */}
                <aside className="adm-sidebar">
                    <div className="adm-sidebar-brand">
                        <img src={logoSrc} alt="ICEMT" className="adm-sb-logo" />
                        <div className="adm-sb-title">
                            <div className="adm-sb-name">ICEMT</div>
                            <div className="adm-sb-sub">لوحة التحكم الإدارية</div>
                        </div>
                    </div>
                    <div className="adm-sidebar-user">
                        <div className="adm-su-av">{user?.firstName?.[0] || 'م'}{user?.lastName?.[0] || ''}</div>
                        <div className="adm-su-info">
                            <div className="adm-su-name">{user?.firstName} {user?.lastName}</div>
                            <div className="adm-su-role">🔐 مدير النظام</div>
                        </div>
                    </div>
                    <nav className="adm-sidebar-nav">
                        <div className="adm-nav-label">القائمة الرئيسية</div>
                        {TABS.map(t => (
                            <button
                                key={t.id}
                                title={t.label}
                                className={`adm-nav-btn${activeTab === t.id ? ' active' : ''}`}
                                onClick={() => { setActiveTab(t.id); setExpandedRow(null); setSearchQuery(''); }}
                            >
                                <span className="adm-nav-icon">{t.icon}</span>
                                <span className="adm-nav-txt">{t.label}</span>
                                {t.id === 'certificates' && totalCerts > 0 && <span className="adm-nav-badge">{totalCerts}</span>}
                                {t.id === 'refunds' && refundStats.pending > 0 && <span className="adm-nav-badge pulse">{refundStats.pending}</span>}
                            </button>
                        ))}
                    </nav>
                    <div className="adm-sidebar-footer">المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}</div>
                </aside>

                {/* ── MAIN ── */}
                <main className="adm-main">

                    {/* ── Page hero (Team-style) ── */}
                    <div className="adm-page-hero">
                        <div className="adm-hero-accent" />
                        <div className="adm-hero-content">
                            <div className="adm-hero-tag">{TAB_TITLES[activeTab]?.tag || 'لوحة الإدارة'}</div>
                            <h1 className="adm-hero-title">{TAB_TITLES[activeTab]?.title}</h1>
                            <div className="adm-hero-date">
                                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    <div className="adm-content">

                        {/* ── Stat Cards ── */}
                        {!loading && !error && (
                            <div className="adm-stats">
                                {STATS.map(s => (
                                    <div key={s.label} className={`adm-sc${s.blue ? ' blue' : ''}`}>
                                        <div className="adm-sc-icon">{s.icon}</div>
                                        <div className="adm-sc-val">{s.value}</div>
                                        <div className="adm-sc-lbl">{s.label}</div>
                                        <div className="adm-sc-bar" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {exportError && (
                            <div className="adm-err">⚠️ {exportError}
                                <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setExportError(null)}>✕</button>
                            </div>
                        )}

                        {/* ══ REFUNDS TAB ══ */}
                        {activeTab === 'refunds' && (
                            <div>
                                <div className="adm-section-hdr">
                                    <div>
                                        <div className="adm-section-tag">إدارة المالية</div>
                                        <div className="adm-section-title">طلبات <span>الاسترداد</span></div>
                                    </div>
                                </div>
                                {bankResultBanner && (
                                    <div className={`rf-bank-banner ${bankResultBanner.type}`}>
                                        <span>{bankResultBanner.msg}</span>
                                        <button className="rf-bank-banner-close" onClick={() => setBankResultBanner(null)}>✕</button>
                                    </div>
                                )}
                                <div className="rf-stat-bar">
                                    {[
                                        { lbl: 'إجمالي', val: refundStats.total, icon: '📋', bg: T.gray100, color: T.black },
                                        { lbl: 'قيد المراجعة', val: refundStats.pending, icon: '⏳', bg: 'rgba(245,124,0,0.08)', color: T.orange },
                                        { lbl: 'موافق عليها', val: refundStats.approved, icon: '✅', bg: '#f0fdf4', color: '#16a34a' },
                                        { lbl: 'أُرسل للبنك', val: refundStats.sent, icon: '🏦', bg: 'rgba(8,101,168,0.06)', color: T.blue },
                                        { lbl: 'مرفوضة', val: refundStats.rejected, icon: '❌', bg: '#fef2f2', color: '#dc2626' },
                                        { lbl: 'إجمالي المبالغ', val: `${refundStats.totalAmount.toLocaleString()} EGP`, icon: '💰', bg: '#f0fdf4', color: '#15803d' },
                                    ].map(s => (
                                        <div key={s.lbl} className="rf-sc">
                                            <div className="rf-sc-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                                            <div><div className="rf-sc-val" style={{ color: s.color, fontSize: typeof s.val === 'string' ? '.82rem' : '1.3rem' }}>{s.val}</div><div className="rf-sc-lbl">{s.lbl}</div></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="adm-toolbar">
                                    <div className="adm-search" style={{ minWidth: 200 }}>
                                        <input type="text" placeholder="ابحث برقم الطلب، المبلغ، المستخدم..." value={refundSearch} onChange={e => setRefundSearch(e.target.value)} />
                                    </div>
                                    <div className="rf-filter-btns">
                                        <span style={{ fontSize: '.74rem', fontWeight: 700, color: T.gray700, fontFamily: T.font }}>الحالة:</span>
                                        {[{ id: 'all', lbl: 'الكل', cls: '' }, { id: 'Pending', lbl: '⏳ قيد المراجعة', cls: 'pend' }, { id: 'Approved', lbl: '✅ موافق عليه', cls: 'appr' }, { id: 'Sent', lbl: '🏦 أُرسل للبنك', cls: 'bank' }, { id: 'Rejected', lbl: '❌ مرفوض', cls: 'rjct' }].map(f => (
                                            <button key={f.id} className={`rf-fbtn${refundStatusFilter === f.id ? ` active ${f.cls}` : ''}`} onClick={() => setRefundStatusFilter(f.id)}>{f.lbl}</button>
                                        ))}
                                    </div>
                                    {refundSearch && <button className="adm-fclear" onClick={() => setRefundSearch('')}>✕</button>}
                                    <div className="adm-expw" ref={exportRefundRef} style={{ marginRight: 'auto' }}>
                                        <button className="adm-expbtn" disabled={exporting} onClick={() => setExportRefMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                        {exportRefMenuOpen && <div className="adm-expmenu"><button className="adm-expitem" onClick={doRefundExcel}>📊 Excel (.xlsx)</button><button className="adm-expitem" onClick={doRefundPDF}>📄 PDF</button><button className="adm-expitem" onClick={doRefundWord}>📝 Word (.docx)</button></div>}
                                    </div>
                                </div>
                                {refundsError && <div className="adm-err">⚠️ {refundsError}<button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setRefundsError(null)}>✕</button></div>}
                                <div className="adm-card">
                                    {refundsLoading ? <div className="adm-ld"><div className="adm-sp" /><p>جاري تحميل طلبات الاسترداد...</p></div>
                                        : filteredRefunds.length === 0 ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد طلبات مطابقة</p></div>
                                            : (<>
                                                <div className="adm-tscr">
                                                    <table className="adm-tbl">
                                                        <thead><tr>
                                                            <th className="rd c" style={{ width: 36 }}>#</th>
                                                            <th className="rd">رقم الطلب</th>
                                                            <th className="rd">المستخدم</th>
                                                            <th className="rd c">المبلغ</th>
                                                            <th className="rd">السبب</th>
                                                            <th className="rd c">الحالة</th>
                                                            <th className="rd">تاريخ الطلب</th>
                                                            <th className="rd c">الإجراءات</th>
                                                        </tr></thead>
                                                        <tbody>
                                                            {paginatedRefunds.map((r, idx) => {
                                                                const rowNum = (refundPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                const u = refundUserLookup(r.userId);
                                                                const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
                                                                return (
                                                                    <tr key={r.id}>
                                                                        <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                        <td><span style={{ fontFamily: 'Courier New', fontSize: '.76rem', fontWeight: 700, color: T.blue }}>{r.refNumber || r.id}</span></td>
                                                                        <td><div className="adm-uc"><div className="adm-av rd">{u.firstName?.[0]}{u.lastName?.[0]}</div><div><div style={{ fontWeight: 700, fontSize: '.78rem' }}>{`${u.firstName} ${u.lastName}`.trim() || '—'}</div><div className="adm-email">{u.email}</div></div></div></td>
                                                                        <td style={{ textAlign: 'center' }}><span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span><span style={{ fontSize: '.6rem', color: T.gray500, marginRight: 3 }}>{r.currency}</span></td>
                                                                        <td style={{ maxWidth: 150 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '.74rem', color: T.gray500 }} title={r.reason}>{r.reason || '—'}</div></td>
                                                                        <td style={{ textAlign: 'center' }}><span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span></td>
                                                                        <td style={{ fontSize: '.72rem', fontFamily: 'Courier New', color: T.gray500, whiteSpace: 'nowrap' }}>{r.requestedAt || '—'}</td>
                                                                        <td><div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                                            <button className="rf-action-btn view" onClick={() => setRefundDetailModal(r)}>🔍 تفاصيل</button>
                                                                            {r.status === 'Pending' && <><button className="rf-action-btn approve" onClick={() => setRefundActionModal({ refund: r, action: 'approve' })}>✅</button><button className="rf-action-btn bank" onClick={() => setRefundActionModal({ refund: r, action: 'send_to_bank' })}>🏦</button><button className="rf-action-btn reject" onClick={() => setRefundActionModal({ refund: r, action: 'reject' })}>❌</button></>}
                                                                            {r.status === 'Approved' && <button className="rf-action-btn bank" onClick={() => setRefundActionModal({ refund: r, action: 'send_to_bank' })}>🏦 إرسال للبنك</button>}
                                                                        </div></td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Pagination currentPage={refundPage} totalItems={filteredRefunds.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setRefundPage} accentColor="#dc2626" />
                                            </>)}
                                </div>
                            </div>
                        )}

                        {/* ══ ATTENDANCE TAB ══ */}
                        {activeTab === 'attendance' && (
                            <div>
                                <div className="adm-section-hdr">
                                    <div>
                                        <div className="adm-section-tag">متابعة الحضور</div>
                                        <div className="adm-section-title">سجل <span>الحضور</span></div>
                                    </div>
                                </div>
                                <div className="adm-toolbar">
                                    <span style={{ fontSize: '.74rem', fontWeight: 700, color: T.gray700, fontFamily: T.font }}>🎓 الدورة:</span>
                                    <select className="adm-fsel" value={attCourseFilter} onChange={e => setAttCourseFilter(e.target.value)}>
                                        <option value="all">جميع الدورات</option>
                                        {coursesData.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                    <div className="adm-search" style={{ minWidth: 170 }}>
                                        <input type="text" placeholder="ابحث باسم المستخدم..." value={attUserSearch} onChange={e => setAttUserSearch(e.target.value)} />
                                    </div>
                                    {attUserSearch && <button className="adm-fclear" onClick={() => setAttUserSearch('')}>✕ مسح</button>}
                                    <div className="adm-expw" ref={exportAttRef} style={{ marginRight: 'auto' }}>
                                        <button className="adm-expbtn" disabled={exporting} onClick={() => setExportAttMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                        {exportAttMenuOpen && <div className="adm-expmenu"><button className="adm-expitem" onClick={doAttExcel}>📊 Excel (.xlsx)</button><button className="adm-expitem" onClick={doAttPDF}>📄 PDF</button><button className="adm-expitem" onClick={doAttWord}>📝 Word (.docx)</button></div>}
                                    </div>
                                </div>
                                <div className="adm-att-sum">
                                    <span>✅ {attRows.filter(r => !!attendance[String(r.course.enrollmentId)]).length} حضر</span>
                                    <span>❌ {attRows.filter(r => !attendance[String(r.course.enrollmentId)]).length} غائب</span>
                                    <span>📋 {attRows.length} إجمالي</span>
                                    {attRows.length > 0 && (() => { const cnt = attRows.filter(r => !!attendance[String(r.course.enrollmentId)]).length; const pct = Math.round(cnt / attRows.length * 100); return (<><span>{pct}٪ حضور</span><div className="adm-prog-wrap"><div className="adm-prog-fill" style={{ width: `${pct}%` }} /></div></>); })()}
                                </div>
                                {attError && <div className="adm-err">⚠️ {attError}<button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setAttError(null)}>✕</button></div>}
                                <div className="adm-card">
                                    {loading ? <div className="adm-ld"><div className="adm-sp" /><p>جاري التحميل...</p></div>
                                        : attRows.length === 0 ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج</p></div>
                                            : (<>
                                                <div className="adm-tscr">
                                                    <table className="adm-tbl">
                                                        <thead><tr>
                                                            <th className="c" style={{ width: 40 }}>#</th>
                                                            <th>المستخدم</th>
                                                            <th>البريد الإلكتروني</th>
                                                            <th>الدورة</th>
                                                            <th className="gr c">تسجيل الحضور</th>
                                                            <th className="gr c">الحالة</th>
                                                        </tr></thead>
                                                        <tbody>
                                                            {paginatedAttRows.map((row, idx) => {
                                                                const rowNum = (attPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                const eid = row.course.enrollmentId; const k = String(eid);
                                                                const attended = !!attendance[k]; const saving = !!attendanceSaving[k];
                                                                return (
                                                                    <tr key={k + idx}>
                                                                        <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                        <td><div className="adm-uc"><div className="adm-av">{(row.user.firstName || row.user.username || '?')[0]}{(row.user.lastName || '')[0]}</div><span className="adm-uname">{row.user.firstName || row.user.username} {row.user.lastName}</span></div></td>
                                                                        <td className="adm-email">{row.user.email}</td>
                                                                        <td style={{ color: T.blue, fontWeight: 700 }}>{row.course.title}</td>
                                                                        <td style={{ textAlign: 'center' }}>
                                                                            <div className={`adm-chk${saving ? ' spin' : attended ? ' on' : ''}`} onClick={() => !saving && toggleAttendance(eid, attended)}>{!saving && attended && '✓'}</div>
                                                                        </td>
                                                                        <td style={{ textAlign: 'center' }}><span className={`adm-att-badge ${attended ? 'on' : 'off'}`}>{attended ? '✅ حضر' : '❌ غائب'}</span></td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Pagination currentPage={attPage} totalItems={attRows.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setAttPage} accentColor="#16a34a" />
                                            </>)}
                                </div>
                            </div>
                        )}

                        {/* ══ CERTIFICATES TAB ══ */}
                        {activeTab === 'certificates' && (
                            <div>
                                <div className="adm-section-hdr">
                                    <div>
                                        <div className="adm-section-tag">إدارة الشهادات</div>
                                        <div className="adm-section-title"><span>الشهادات</span> الإلكترونية</div>
                                    </div>
                                </div>
                                <div className="adm-toolbar">
                                    <div className="adm-search" style={{ minWidth: 210 }}>
                                        <input type="text" placeholder="ابحث باسم المستخدم أو الدورة..." value={certSearch} onChange={e => setCertSearch(e.target.value)} />
                                    </div>
                                    {certSearch && <button className="adm-fclear" onClick={() => setCertSearch('')}>✕</button>}
                                    <div style={{ display: 'flex', gap: 5, marginRight: 'auto', flexWrap: 'wrap' }}>
                                        {[{ id: 'all', label: 'الكل', icon: '📋' }, { id: 'uploaded', label: 'مرفوعة', icon: '✅' }, { id: 'pending', label: 'حضر / لم تُرفع', icon: '📄' }, { id: 'not-attended', label: 'لم يحضر', icon: '🚫' }].map(f => (
                                            <button key={f.id} style={{ padding: '5px 12px', borderRadius: 2, border: '1.5px solid', fontFamily: T.font, fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all .14s', background: certStatusFilter === f.id ? (f.id === 'uploaded' ? '#f0fdf4' : f.id === 'pending' ? T.gray100 : 'rgba(8,101,168,0.08)') : T.gray100, borderColor: certStatusFilter === f.id ? (f.id === 'uploaded' ? '#86efac' : f.id === 'pending' ? T.gray300 : 'rgba(8,101,168,0.3)') : T.gray300, color: certStatusFilter === f.id ? (f.id === 'uploaded' ? '#15803d' : f.id === 'pending' ? T.gray700 : T.blue) : T.gray500 }} onClick={() => setCertStatusFilter(f.id)}>{f.icon} {f.label}</button>
                                        ))}
                                    </div>
                                    <div className="adm-expw" ref={exportCertRef}>
                                        <button className="adm-expbtn" disabled={exporting} onClick={() => setExportCertMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                        {exportCertMenuOpen && <div className="adm-expmenu"><button className="adm-expitem" onClick={doCertExcel}>📊 Excel (.xlsx)</button><button className="adm-expitem" onClick={doCertPDF}>📄 PDF</button><button className="adm-expitem" onClick={doCertWord}>📝 Word (.docx)</button></div>}
                                    </div>
                                </div>
                                {!loading && (() => {
                                    const uploaded = certRows.filter(r => !!(certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined))).length;
                                    const withUrl = certRows.filter(r => { const c = certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined); return c && c.url && c.url !== 'uploaded'; }).length;
                                    const attendedTotal = certRows.filter(r => !!attendance[String(r.enrollmentId)]).length;
                                    const pendingUpload = certRows.filter(r => !(certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined)) && !!attendance[String(r.enrollmentId)]).length;
                                    const notAttended = certRows.filter(r => !attendance[String(r.enrollmentId)]).length;
                                    const pct = attendedTotal > 0 ? Math.round(uploaded / attendedTotal * 100) : 0;
                                    return (
                                        <div className="adm-cert-sum">
                                            <span style={{ fontSize: '.76rem', fontWeight: 900, color: T.black, fontFamily: T.font }}>📜 ملخص الشهادات</span>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                                                {[
                                                    { label: `✅ مرفوعة: ${uploaded}${withUrl > 0 ? ` (${withUrl} قابلة للعرض)` : ''}`, bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
                                                    { label: `📄 حضر ولم تُرفع: ${pendingUpload}`, bg: 'rgba(8,101,168,0.06)', color: T.blue, border: 'rgba(8,101,168,0.2)' },
                                                    { label: `🚫 لم يحضر: ${notAttended}`, bg: T.gray100, color: T.gray500, border: T.gray300 },
                                                    { label: `📋 الإجمالي: ${certRows.length}`, bg: 'rgba(8,101,168,0.06)', color: T.blue, border: 'rgba(8,101,168,0.2)' },
                                                ].map(b => (
                                                    <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 11px', borderRadius: 2, background: b.bg, border: `1.5px solid ${b.border}`, color: b.color, fontSize: '.7rem', fontWeight: 700 }}>{b.label}</span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
                                                <div style={{ flex: 1, height: 6, background: T.gray300, borderRadius: 3, overflow: 'hidden' }}>
                                                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${T.orange},${T.orangeLight})`, borderRadius: 3, transition: 'width .5s ease' }} />
                                                </div>
                                                <span style={{ fontSize: '.68rem', fontWeight: 700, color: T.orange, minWidth: 32 }}>{pct}٪</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                                {certError && <div className="adm-err">⚠️ {certError}<button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setCertError(null)}>✕</button></div>}
                                <div className="adm-card">
                                    {loading ? <div className="adm-ld"><div className="adm-sp" /><p>جاري التحميل...</p></div>
                                        : certRows.length === 0 ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج</p></div>
                                            : (<>
                                                <div className="adm-cert-grid">
                                                    {paginatedCertRows.map(row => {
                                                        const ck = row.certKey;
                                                        const cert = certificates[ck] ?? (row.altKey ? certificates[row.altKey] : undefined);
                                                        const uploading = certUploading[ck];
                                                        const deleting = !!certDeleting[ck];
                                                        const isAttended = !!attendance[String(row.enrollmentId)];
                                                        const canUpload = isAttended;
                                                        const hasRealUrl = cert && cert.certId != null;
                                                        const hasPlaceholder = cert && cert.certId == null;
                                                        const cardCls = cert ? 'has-cert' : '';
                                                        const iconCls = cert ? 'has' : !canUpload ? 'grey' : '';
                                                        return (
                                                            <div className={`adm-cert-card ${cardCls}`} key={ck} style={{ opacity: !canUpload && !cert ? 0.75 : 1 }}>
                                                                <div className="adm-cert-card-top">
                                                                    <div className={`adm-cert-icon${iconCls ? ` ${iconCls}` : ''}`}>{cert ? '📜' : canUpload ? '📄' : '🚫'}</div>
                                                                    <div className="adm-cert-info">
                                                                        <div className="adm-cert-name">{row.user.firstName || row.user.username} {row.user.lastName}</div>
                                                                        <div className="adm-cert-course">📚 {row.course.title}</div>
                                                                        <div className="adm-cert-badges">
                                                                            <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 2, background: isAttended ? '#f0fdf4' : T.gray100, color: isAttended ? '#15803d' : T.gray500, border: `1px solid ${isAttended ? '#86efac' : T.gray300}` }}>{isAttended ? '✅ حضر' : '❌ غائب'}</span>
                                                                            {hasRealUrl && <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 2, background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}>📜 {cert.name && cert.name !== 'uploaded' ? (cert.name.length > 20 ? cert.name.slice(0, 20) + '…' : cert.name) : 'مرفوعة'}</span>}
                                                                            {hasPlaceholder && <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 2, background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac' }}>✅ مرفوعة على السيرفر</span>}
                                                                            {!cert && canUpload && <span style={{ fontSize: '.6rem', color: T.orange, padding: '2px 8px', borderRadius: 2, background: 'rgba(245,124,0,0.06)', border: `1px solid rgba(245,124,0,0.2)` }}>لم تُرفع بعد</span>}
                                                                            {!cert && !canUpload && <span style={{ fontSize: '.6rem', color: T.gray500, padding: '2px 8px', borderRadius: 2, background: T.gray100, border: `1px solid ${T.gray300}` }}>يجب تسجيل الحضور أولاً</span>}
                                                                            {cert?.uploadedAt && <span style={{ fontSize: '.58rem', color: T.gray500, padding: '2px 6px', borderRadius: 2, background: T.gray100, border: `1px solid ${T.gray300}` }}>🗓 {cert.uploadedAt}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="adm-cert-actions">
                                                                    {cert ? (
                                                                        <>
                                                                            {/* زرار View الجديد */}
                                                                            <button
                                                                                className="adm-cert-btn dl"
                                                                                onClick={() => viewCert(
                                                                                    cert.certId,
                                                                                    cert.url,
                                                                                    cert.rawUrl,
                                                                                    cert.name,
                                                                                    row.userId,
                                                                                    row.planworkId
                                                                                )}
                                                                            >
                                                                                👁 عرض
                                                                            </button>

                                                                            <button
                                                                                className="adm-cert-btn up"
                                                                                disabled={uploading}
                                                                                onClick={() => setCertModal({
                                                                                    enrollmentId: row.enrollmentId,
                                                                                    userId: row.userId,
                                                                                    planworkId: row.planworkId,
                                                                                    certKey: ck,
                                                                                    userName: `${row.user.firstName || row.user.username} ${row.user.lastName}`,
                                                                                    courseTitle: row.course.title
                                                                                })}
                                                                            >
                                                                                {uploading ? '⏳' : '🔄 تحديث'}
                                                                            </button>

                                                                            <button
                                                                                className="adm-cert-btn rm"
                                                                                disabled={deleting}
                                                                                onClick={() => deleteCert(ck, row.altKey)}
                                                                            >
                                                                                {deleting ? '⏳' : '🗑'}
                                                                            </button>
                                                                        </>
                                                                    ) : canUpload ? (
                                                                        <button className="adm-cert-btn up full" disabled={uploading}
                                                                            onClick={() => setCertModal({
                                                                                enrollmentId: row.enrollmentId,
                                                                                userId: row.userId,
                                                                                planworkId: row.planworkId,
                                                                                certKey: ck,
                                                                                userName: `${row.user.firstName || row.user.username} ${row.user.lastName}`,
                                                                                courseTitle: row.course.title
                                                                            })}>
                                                                            {uploading ? '⏳ جاري الرفع...' : '⬆ رفع شهادة'}
                                                                        </button>
                                                                    ) : (
                                                                        <span style={{
                                                                            fontSize: '.62rem', color: T.gray300, width: '100%',
                                                                            textAlign: 'center', fontFamily: T.font
                                                                        }}>
                                                                            سجّل الحضور أولاً لرفع الشهادة
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <Pagination currentPage={certPage} totalItems={certRows.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCertPage} accentColor={T.orange} />
                                            </>)}
                                </div>
                            </div>
                        )}

                        {/* ══ USERS / COURSES TABS ══ */}
                        {isExportTab && (
                            <>
                                <div className="adm-section-hdr">
                                    <div>
                                        <div className="adm-section-tag">إدارة البيانات</div>
                                        <div className="adm-section-title">
                                            {activeTab === 'users' ? <>المستخدمون <span>والدورات</span></> : <>الدورات <span>والمستخدمون</span></>}
                                        </div>
                                    </div>
                                </div>
                                <div className="adm-toolbar">
                                    <div className="adm-search">
                                        <input type="text" placeholder={activeTab === 'users' ? 'ابحث باسم المستخدم أو البريد...' : 'ابحث باسم الدورة أو الفئة...'} value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setExpandedRow(null); }} />
                                    </div>
                                    <span style={{ fontSize: '.74rem', fontWeight: 700, color: T.gray700, fontFamily: T.font }}>📅</span>
                                    <span style={{ fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>من</span>
                                    <input type="date" className="adm-fdate" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setExpandedRow(null); }} />
                                    <span style={{ fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>إلى</span>
                                    <input type="date" className="adm-fdate" value={dateTo} min={dateFrom} onChange={e => { setDateTo(e.target.value); setExpandedRow(null); }} />
                                    {(dateFrom || dateTo) && (<><span className="adm-filter-active">🔶 فلتر نشط</span><button className="adm-fclear" onClick={() => { setDateFrom(''); setDateTo(''); setExpandedRow(null); }}>✕</button></>)}
                                    <div className="adm-expw" ref={exportRef} style={{ marginRight: 'auto' }}>
                                        <button className="adm-expbtn" disabled={exporting} onClick={() => setExportMenuOpen(p => !p)}>{exporting ? '⏳ جاري...' : '⬇ تصدير ▾'}</button>
                                        {exportMenuOpen && <div className="adm-expmenu"><button className="adm-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button><button className="adm-expitem" onClick={doPDF}>📄 PDF</button><button className="adm-expitem" onClick={doWord}>📝 Word (.docx)</button></div>}
                                    </div>
                                </div>
                                <div className="adm-card">
                                    {loading ? <div className="adm-ld"><div className="adm-sp" /><p>جاري تحميل البيانات...</p></div>
                                        : error ? <div className="adm-empty"><div className="adm-emi">⚠️</div><p>{error}</p></div>
                                            : (activeTab === 'users' ? filteredUsers : filteredCourses).length === 0
                                                ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                                                : (<>
                                                    <div className="adm-tscr">
                                                        <table className="adm-tbl">
                                                            <thead><tr>
                                                                <th className="c" style={{ width: 40 }}>#</th>
                                                                {activeTab === 'users'
                                                                    ? <><th>المستخدم</th><th>البريد الإلكتروني</th><th className="c">الدورات</th><th className="c">تفاصيل</th></>
                                                                    : <><th className="or">اسم الدورة</th><th className="or c">المسجّلون</th><th className="or c">تفاصيل</th></>}
                                                            </tr></thead>
                                                            <tbody>
                                                                {activeTab === 'users'
                                                                    ? paginatedUsers.map((u, idx) => {
                                                                        const rowNum = (usersPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                        return (
                                                                            <React.Fragment key={u.id}>
                                                                                <tr className={expandedRow === u.id ? 'xopen' : ''}>
                                                                                    <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                                    <td><div className="adm-uc"><div className="adm-av">{(u.firstName || u.username || '?')[0]}{(u.lastName || '')[0]}</div><span className="adm-uname">{u.firstName || u.username} {u.lastName}</span></div></td>
                                                                                    <td className="adm-email">{u.email}</td>
                                                                                    <td style={{ textAlign: 'center' }}><span className="adm-cb">{u.enrolledCourses.length}</span></td>
                                                                                    <td style={{ textAlign: 'center' }}>{u.enrolledCourses.length > 0 ? <span className={`adm-pill${expandedRow === u.id ? ' op' : ''}`} onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}>{expandedRow === u.id ? '▲ إخفاء' : '▼ عرض'}</span> : <span style={{ color: T.gray300 }}>—</span>}</td>
                                                                                </tr>
                                                                                {expandedRow === u.id && (
                                                                                    <tr className="adm-xrow"><td colSpan={5}><div className="adm-xin">{u.enrolledCourses.map(c => { const ck = String(c.enrollmentId ?? `${u.id}-${c.id}`); return (<div className="adm-mc" key={ck}><div className="adm-mt">📚 {c.title}</div>{c.date && <div className="adm-md">📅 {c.date}</div>}<div style={{ marginTop: 5, display: 'flex', gap: 5, flexWrap: 'wrap' }}><span className={`adm-att-badge ${attendance[String(c.enrollmentId)] ? 'on' : 'off'}`} style={{ fontSize: '.62rem' }}>{attendance[String(c.enrollmentId)] ? '✅ حضر' : '❌ غائب'}</span>{(certificates[ck] ?? certificates[`${u.id}-${c.id}`]) ? <span style={{ fontSize: '.62rem', color: T.orange, fontWeight: 700 }}>📜 شهادة</span> : null}</div></div>); })}</div></td></tr>
                                                                                )}
                                                                            </React.Fragment>
                                                                        );
                                                                    })
                                                                    : paginatedCourses.map((c, idx) => {
                                                                        const rowNum = (coursesPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                                        return (
                                                                            <React.Fragment key={c.id}>
                                                                                <tr className={expandedRow === c.id ? 'xopen' : ''}>
                                                                                    <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                                                    <td style={{ fontWeight: 700, color: T.blue }}>📚 {c.title}</td>
                                                                                    <td style={{ textAlign: 'center' }}><span className="adm-cb or">{c.enrolledUsers.length}</span></td>
                                                                                    <td style={{ textAlign: 'center' }}>{c.enrolledUsers.length > 0 ? <span className={`adm-pill or${expandedRow === c.id ? ' op' : ''}`} onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}>{expandedRow === c.id ? '▲ إخفاء' : '▼ عرض'}</span> : <span style={{ color: T.gray300 }}>—</span>}</td>
                                                                                </tr>
                                                                                {expandedRow === c.id && (
                                                                                    <tr className="adm-xrow"><td colSpan={4}><div className="adm-xin">{c.enrolledUsers.map(u => (<div className="adm-mc" key={u.enrollmentId ?? u.username ?? u.email}><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}><div className="adm-av or sm">{(u.firstName || u.username || '?')[0]}{(u.lastName || '')[0]}</div><div><div className="adm-mt or">{u.firstName || u.username} {u.lastName}</div><div className="adm-ms">✉ {u.email}</div></div></div>{u.date && <div className="adm-md">📅 {u.date}</div>}</div>))}</div></td></tr>
                                                                                )}
                                                                            </React.Fragment>
                                                                        );
                                                                    })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <Pagination
                                                        currentPage={activeTab === 'users' ? usersPage : coursesPage}
                                                        totalItems={activeTab === 'users' ? filteredUsers.length : filteredCourses.length}
                                                        itemsPerPage={ITEMS_PER_PAGE}
                                                        onPageChange={activeTab === 'users' ? p => { setUsersPage(p); setExpandedRow(null); } : p => { setCoursesPage(p); setExpandedRow(null); }}
                                                        accentColor={activeTab === 'users' ? T.blue : T.orange}
                                                    />
                                                </>)}
                                </div>
                            </>
                        )}

                    </div>{/* /adm-content */}

                    {/* ── Black closing strip (like Team) ── */}
                    <div className="adm-footer">
                        <p>المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}</p>
                    </div>

                </main>
            </div>
        </>
    );
};

export default AdminDashboard;