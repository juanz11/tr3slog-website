/**
 * OpsBlocks.jsx — custom blocks of the Advanced Operations module
 * (`manifest` and `optimizer`), ported from
 * "TR3SLOG Advanced Operations.dc.html".
 *
 * All figures are demo placeholders, exactly like the design export.
 */

import React from 'react';
import { C, FONT_HEAD, FONT_MONO, TONE, card, sectionTitle, ghostBtn } from '../business-portal/tokens.js';
import { exportCsv, exportPdf } from '../business-portal/engine.js';

/* Brand motif: paired skewed bars (gold + blue). */
function Motif({ w = 20, h = 4, mb = 8 }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: mb }}>
      <span style={{ width: w, height: h, background: C.gold, transform: 'skewX(-24deg)' }} />
      <span style={{ width: Math.round(w * 0.38), height: h, background: C.blue, transform: 'skewX(-24deg)' }} />
    </div>
  );
}

const fill = (str, map) => String(str || '').replace(/\{(\w+)\}/g, (m0, k) => (map[k] != null ? map[k] : m0));
const optHM = m => { m = Math.round(m); return Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0') + 'm'; };
const optClock = m => { m = Math.round(m); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

/* ---- Demo QR-style pattern (deterministic from text). Not scannable. ---- */
function qrPath(text) {
  const N = 25;
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
  const finder = (x, y) => {
    for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
      const dx = x - fx, dy = y - fy;
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
        if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return 0;
        return (dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)) ? 1 : 0;
      }
    }
    return -1;
  };
  let d = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const f = finder(x, y);
    const on = f >= 0 ? f === 1 : (x === 6 || y === 6) ? (x + y) % 2 === 0 : rnd() > 0.52;
    if (on) d += 'M' + (x + 2) + ' ' + (y + 2) + 'h1v1h-1z';
  }
  return d;
}

function Qr({ text, size = 112, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 29 29" shapeRendering="crispEdges" role="img" aria-label={'QR ' + text} style={{ display: 'block', opacity }}>
      <rect width="29" height="29" fill="#fff" />
      <path fill="#001B45" d={qrPath(text)} />
    </svg>
  );
}
function qrSvgString(text, size) {
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 29 29" shape-rendering="crispEdges"><rect width="29" height="29" fill="#fff"/><path fill="#001B45" d="' + qrPath(text) + '"/></svg>';
}

const MAN_ROWS = [
  ['TR3-260729-PRSJ-00131', 'Guaynabo', '09:00–12:00', '2'],
  ['TR3-260729-PRSJ-00136', 'San Juan', '09:00–12:00', '1'],
  ['TR3-260729-PRSJ-00139', 'Bayamón', '10:00–13:00', '3'],
  ['TR3-260729-PRSJ-00142', 'Bayamón', '13:00–16:00', '3'],
  ['TR3-260729-PRSJ-00147', 'Bayamón', '13:00–16:00', '1'],
  ['TR3-260729-PRSJ-00153', 'Guaynabo', '14:00–17:00', '2']
];

const STAGE_TONE = { draft: TONE.neutral, generated: TONE.warn, issued: TONE.ok };
const STAGE_BANNER = {
  draft: { bg: '#EEF4FC', fg: '#25456E' },
  generated: { bg: 'rgba(217,154,0,.12)', fg: '#6C5220' },
  issued: { bg: 'rgba(19,122,69,.1)', fg: '#0F5F36' }
};

export function ManifestBlock({ data = {}, onToast }) {
  const [stage, setStage] = React.useState('draft');
  const [mode, setMode] = React.useState('digital');
  const manId = ((data.meta || [])[0] || {}).v || '';
  const S = STAGE_TONE[stage];
  const B = STAGE_BANNER[stage];
  const cols = (data.cols || []).slice(0, 6).concat([mode === 'print' ? (data.cols || [])[6] : data.colDigital]);
  const scanned = 3;

  const btn = (label, primary, off, run) => (
    <button type="button" aria-disabled={off} onClick={run}
      style={{ minHeight: 44, padding: '11px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: off ? 'not-allowed' : 'pointer', background: primary ? C.blue : C.white, color: primary ? C.white : C.navy, border: `1.5px solid ${primary ? C.blue : C.border}`, opacity: off ? 0.45 : 1, font: 'inherit' }}>
      {label}
    </button>
  );

  const printManifest = () => {
    if (stage !== 'issued') { onToast && onToast(data.needIssue); return; }
    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const meta = (data.meta || []).map(k => '<div><small>' + esc(k.k) + '</small><b>' + esc(k.v) + '</b></div>').join('');
    const head = (data.cols || []).map(c => '<th>' + esc(c) + '</th>').join('');
    const body = MAN_ROWS.map((r, i) => '<tr><td>' + (i + 1) + '</td><td class="m">' + esc(r[0]) + '</td><td>' + qrSvgString(r[0], 54) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td class="s"></td></tr>').join('');
    const sig = (data.sig || []).map(g => '<div><i></i><b>' + esc(g) + '</b><small>' + esc(data.sigLine) + '</small></div>').join('');
    const doc = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(manId) + '</title><style>body{font-family:Inter,Arial,sans-serif;color:#10233F;margin:28px}h1{font:800 22px Montserrat,Arial;color:#001B45;margin:2px 0 14px}.top{display:flex;gap:24px;justify-content:space-between}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 18px}small{display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#6C82A6}b{font-size:13px}table{width:100%;border-collapse:collapse;margin-top:18px;font-size:12px}th{background:#001B45;color:#fff;text-align:left;padding:7px 8px;font-size:10px;text-transform:uppercase}td{border-top:1px solid #DCE6F5;padding:6px 8px;vertical-align:middle}.m{font-family:Menlo,monospace}.s{width:130px;border-bottom:1px solid #8B9DBA}.sig{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:30px}.sig i{display:block;height:34px;border-bottom:1px solid #10233F}.f{margin-top:18px;font-size:10px;color:#6C82A6;display:flex;justify-content:space-between}</style></head><body>'
      + '<div class="top"><div><b style="letter-spacing:.08em;color:#001B45">TR3SLOG</b><h1>' + esc(data.docT) + '</h1><div class="g">' + meta + '</div></div><div style="text-align:center">' + qrSvgString(manId, 120) + '<div class="m" style="font-size:10px">' + esc(manId) + '</div></div></div>'
      + '<table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table><div class="sig">' + sig + '</div><div class="f"><span>' + esc(data.qrNote) + '</span><span>' + esc(data.footer) + '</span></div></body></html>';
    const w = window.open('', '_blank');
    if (!w) { onToast && onToast(data.popup); return; }
    w.document.write(doc); w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 350);
    onToast && onToast(data.printOk);
  };

  return (
    <div style={card}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={sectionTitle}>{data.t}</div>
        <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: S.bg, color: S.fg }}>{(data.states || {})[stage]}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {btn(data.gen, stage === 'draft', stage !== 'draft', () => { if (stage !== 'draft') return; setStage('generated'); onToast && onToast(data.genOk); })}
          {btn(data.issue, stage === 'generated', stage !== 'generated', () => { if (stage !== 'generated') return; setStage('issued'); onToast && onToast(data.issueOk); })}
          {btn(data.print, false, stage !== 'issued', printManifest)}
        </div>
      </div>

      <div role="tablist" style={{ display: 'flex', gap: 6, padding: '12px 22px', borderBottom: `1px solid ${C.divider}` }}>
        {[['digital', data.modeDigital], ['print', data.modePrint]].map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => setMode(k)}
            style={{ minHeight: 36, padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: mode === k ? C.navy : C.white, color: mode === k ? C.white : C.text, border: `1.5px solid ${mode === k ? C.navy : C.border}`, font: 'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: 22, background: C.bg, overflowX: 'auto' }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, maxWidth: 960, minWidth: 720, margin: '0 auto', padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 10px 30px rgba(0,27,69,.08)' }}>
          <div style={{ fontSize: 13, lineHeight: 1.55, padding: '10px 14px', borderRadius: 10, background: B.bg, color: B.fg }}>{(data.banner || {})[stage]}</div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Motif w={20} h={4} mb={8} />
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '.08em', color: C.navy }}>TR3SLOG</div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 22, color: C.navy, margin: '4px 0 16px' }}>{data.docT}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '12px 20px' }}>
                {(data.meta || []).map((m, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary }}>{m.k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 3 }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
              <Qr text={manId} size={112} opacity={stage === 'draft' ? 0.25 : 1} />
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.text }}>{manId}</div>
            </div>
          </div>

          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(190px,1.5fr) 60px minmax(120px,1fr) 110px 56px minmax(130px,1fr)', gap: 12, alignItems: 'center', padding: '10px 14px', background: C.navy, color: C.white, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              {cols.map((c, i) => <span key={i} style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{c}</span>)}
            </div>
            {MAN_ROWS.map((r, i) => {
              const ok = stage === 'issued' && i < scanned;
              const t = ok ? TONE.ok : TONE.info;
              const last = mode === 'print'
                ? <span style={{ display: 'inline-block', width: 110, borderBottom: `1px solid ${C.textMuted}`, height: 20 }} />
                : <span style={{ justifySelf: 'start', display: 'inline-flex', padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: t.bg, color: t.fg }}>{ok ? data.scanned : data.pending}</span>;
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px minmax(190px,1.5fr) 60px minmax(120px,1fr) 110px 56px minmax(130px,1fr)', gap: 12, alignItems: 'center', padding: '10px 14px', borderTop: `1px solid ${C.divider}`, fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: C.navy }}>{i + 1}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.text }}>{r[0]}</span>
                  <span style={{ width: 44, height: 44 }}><Qr text={r[0]} size={44} opacity={stage === 'draft' ? 0.25 : 1} /></span>
                  <span>{r[1]}</span>
                  <span style={{ color: C.textSecondary }}>{r[2]}</span>
                  <span>{r[3]}</span>
                  {last}
                </div>
              );
            })}
          </div>

          {mode === 'print' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {(data.sig || []).map((g, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ display: 'block', height: 34, borderBottom: `1px solid ${C.text}` }} />
                  <b style={{ fontSize: 13 }}>{g}</b>
                  <small style={{ fontSize: 10, color: C.textSecondary, letterSpacing: '.08em', textTransform: 'uppercase' }}>{data.sigLine}</small>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', justifyContent: 'space-between', borderTop: `1px solid ${C.divider}`, paddingTop: 12, fontSize: 11.5, color: C.textSecondary }}>
            <span>{data.qrNote}</span>
            <span>{data.footer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ ROUTE OPTIMIZER ============================ */

const OPT_DEPOT = { x: 50, y: 33 };
const OPT_H = 66;
const OPT_COLORS = ['#087CF0', '#001B45', '#D99A00', '#137A45', '#7A4FD1', '#A93226'];
const OPT_VANS = ['Van 01', 'Van 02', 'Van 03', 'Van 04', 'Van 05', 'Van 06'];
const OPT_DRIVERS = ['E. Rivera', 'R. Núñez', 'A. Bello', 'M. Peña', 'L. Ortega', 'J. Soto'];
const OPT_CAP = 60, OPT_START = 480, OPT_SHIFT_END = 960, OPT_SPAN = 540;
const OPT_SPEC = { rec: { t: 378, k: 162, c: 145, f: 14.2, d: 1 }, a: { t: 362, k: 175, c: 156, f: 15, d: 2 }, b: { t: 408, k: 159, c: 131, f: 13, d: 3 }, cur: { t: 476, k: 198, c: 176, f: 18, d: 7 } };
const OPT_PLAN_KEYS = ['rec', 'a', 'b', 'cur'];
const OPT_STOPS = (function () {
  let h = 7; const r = () => (h = (h * 9301 + 49297) % 233280) / 233280;
  const out = []; let id = 1;
  [7, 8, 9, 9, 8].forEach((n, ci) => {
    const ang = (ci / 5) * Math.PI * 2 - Math.PI / 2 + 0.3;
    for (let i = 0; i < n; i++) {
      const a = ang + (r() - 0.5) * 0.9, d = 9 + r() * 19;
      out.push({ id: id++, cl: ci, x: +(50 + Math.cos(a) * d * 1.45).toFixed(1), y: +(33 + Math.sin(a) * d).toFixed(1), pcs: 3 + Math.floor(r() * 7) });
    }
  });
  return out;
})();
const OPT_ST = ['Calle Loíza', 'Av. Ponce de León', 'Calle San Francisco', 'Av. Roosevelt', 'Calle del Parque', 'Av. Piñero', 'Calle Comercio', 'Av. Muñoz Rivera', 'Calle Fortaleza', 'Av. Las Américas'];
const addr = id => OPT_ST[id % OPT_ST.length] + ' ' + (10 + (id * 37) % 280);

const optDist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function optNN(ids) {
  const left = ids.slice(), out = []; let cur = OPT_DEPOT;
  while (left.length) {
    let bi = 0, bd = Infinity;
    left.forEach((id, i) => { const dd = optDist(cur, OPT_STOPS[id - 1]); if (dd < bd) { bd = dd; bi = i; } });
    const id = left.splice(bi, 1)[0]; out.push(id); cur = OPT_STOPS[id - 1];
  }
  return out;
}
function optInitial(key) {
  const groups = [[], [], [], [], []];
  OPT_STOPS.forEach((s, i) => {
    let g = s.cl;
    if (key === 'cur') g = i % 5;
    if (key === 'a' && i % 6 === 2) g = (s.cl + 1) % 5;
    if (key === 'b' && i % 9 === 4) g = (s.cl + 4) % 5;
    groups[g].push(s.id);
  });
  return groups.map((ids, i) => ({ id: 'R' + (i + 1), van: i, stops: key === 'cur' ? ids : optNN(ids) }));
}
const optFresh = () => { const p = {}; OPT_PLAN_KEYS.forEach(k => { p[k] = optInitial(k); }); return p; };
function optRaw(route) {
  let len = 0, p = OPT_DEPOT;
  route.stops.forEach(id => { const s = OPT_STOPS[id - 1]; len += optDist(p, s); p = s; });
  if (route.stops.length) len += optDist(p, OPT_DEPOT);
  return { len: len, t: len * 1.2 + route.stops.length * 30 };
}
const OPT_CAL = {};
OPT_PLAN_KEYS.forEach(k => {
  const rs = optInitial(k).map(optRaw), sp = OPT_SPEC[k];
  const len = rs.reduce((a, r) => a + r.len, 0), t = Math.max.apply(null, rs.map(r => r.t));
  OPT_CAL[k] = { ks: sp.k / len, ts: sp.t / t, cpk: sp.c / sp.k, fpk: sp.f / sp.k };
});
function optMetrics(key, routes) {
  const c = OPT_CAL[key];
  const rows = routes.map(r => {
    const raw = optRaw(r), km = raw.len * c.ks, t = raw.t * c.ts;
    const pcs = r.stops.reduce((a, id) => a + OPT_STOPS[id - 1].pcs, 0);
    return { r: r, km: km, t: t, cost: km * c.cpk, fuel: km * c.fpk, util: Math.round(pcs / OPT_CAP * 100), end: OPT_START + t };
  });
  const used = rows.filter(x => x.r.stops.length), late = used.filter(x => x.end > OPT_SHIFT_END);
  const sum = f => rows.reduce((a, x) => a + f(x), 0);
  return { rows: rows, t: Math.max.apply(null, [0].concat(used.map(x => x.t))), km: sum(x => x.km), cost: sum(x => x.cost), fuel: sum(x => x.fuel),
    clients: sum(x => x.r.stops.length), vans: used.length, delays: OPT_SPEC[key].d + late.length, late: late };
}

export function OptimizerBlock({ data = {}, common = {}, view = 'data', lang = 'es', onToast }) {
  const d = data;
  const toast = m => onToast && onToast(m);
  const [plans, setPlans] = React.useState(null);
  const [sel, setSel] = React.useState('rec');
  const [stage, setStage] = React.useState(3);
  const [recalc, setRecalc] = React.useState(false);
  const [vers, setVers] = React.useState(null);
  const [openRow, setOpenRow] = React.useState({});
  const [focus, setFocus] = React.useState(null);
  const [detail, setDetail] = React.useState(null);
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [consOpen, setConsOpen] = React.useState(true);
  const [F, setF] = React.useState({ date: '2026-07-29', region: '0', sup: '0', center: '0', svc: 4, obj: 0 });
  const [lastRun, setLastRun] = React.useState('08:15');

  const users = d.users || {}, ok = d.ok || {}, ver = d.ver || {}, m = d.m || {}, A = d.act || {}, btnT = d.btn || {};
  const plans_ = plans || optFresh();
  const now = () => new Date().toTimeString().slice(0, 5);
  const M = {}; OPT_PLAN_KEYS.forEach(k => { M[k] = optMetrics(k, plans_[k]); });
  const me = M[sel], cur = M.cur;
  const cal = OPT_CAL[sel];
  const objL = (d.objs || [])[F.obj] || '';
  const name = id => (d.client || '') + ' ' + id;
  const log = (vers && vers.log) || ['08:15 · ' + users.sys, '08:31 · ' + users.sup, '08:31 · ' + users.sup, '', '', ''];
  const versions = (vers && vers.list) || [{ v: 'V1', at: '08:15', u: users.sys, c: ver.init }, { v: 'V2', at: '08:31', u: users.sup, c: ver.moved }];
  const pushVer = (u, c, list) => { const l = list || versions; return l.concat([{ v: 'V' + (l.length + 1), at: now(), u: u, c: c }]); };
  const locked = stage >= 6;

  const setStageN = (n, u, vt, msg) => {
    const lg = log.slice(); lg[n - 1] = now() + ' · ' + u;
    setVers({ log: lg, list: pushVer(u, vt) });
    setStage(n); toast(msg);
  };
  const review = () => stage !== 1 ? toast(ok.already) : setStageN(2, users.sup, ver.review, ok.review);
  const changes = () => stage !== 2 ? toast(ok.already) : setStageN(3, users.sup, ver.changes, ok.changes);
  const approve = () => stage < 3 ? toast(ok.needReview) : stage > 3 ? toast(ok.already) : setStageN(4, users.mgr, ver.approve, ok.approve);
  const publish = () => stage < 4 ? toast(ok.needApprove) : stage > 4 ? toast(ok.already) : setStageN(5, users.mgr, ver.publish, ok.publish);
  const send = () => stage < 5 ? toast(ok.needPublish) : stage > 5 ? toast(ok.locked) : setStageN(6, users.mgr, ver.send, ok.send);
  const publishSend = () => {
    if (stage < 4) return toast(ok.needApprove);
    if (stage >= 6) return toast(ok.locked);
    const lg = log.slice(), t = now() + ' · ' + users.mgr; let v = versions;
    if (stage < 5) { lg[4] = t; v = pushVer(users.mgr, ver.publish, v); }
    lg[5] = t; v = pushVer(users.mgr, ver.send, v);
    setVers({ log: lg, list: v }); setStage(6); toast(ok.send);
  };
  const generate = () => {
    setRecalc(true);
    setTimeout(() => {
      const t = now();
      setPlans(optFresh()); setStage(1); setRecalc(false); setLastRun(t);
      setVers({ log: [t + ' · ' + users.sys, '', '', '', '', ''], list: pushVer(users.sys, fill(ver.gen, { o: objL })) });
      toast(fill(d.generateOk, { o: objL }));
    }, 900);
  };
  const save = () => { const nv = pushVer(users.mgr, ver.save); setVers({ log, list: nv }); toast(fill(ok.save, { v: nv[nv.length - 1].v })); };
  const revert = () => { if (locked) return toast(ok.locked); setVers({ log, list: pushVer(users.mgr, fill(ver.revert, { v: 'V2' })) }); toast(fill(ok.revert, { v: 'V2' })); };
  const compare = () => { setRecalc(true); setTimeout(() => { setRecalc(false); toast(ok.compare); }, 600); };
  const exRows = me.rows.filter(w => w.r.stops.length).map(w => ({ c: [w.r.id, OPT_VANS[w.r.van], OPT_DRIVERS[w.r.van], String(w.r.stops.length), optClock(OPT_START), optClock(w.x.end), String(Math.round(w.x.km)), optHM(w.x.t), '$' + Math.round(w.x.cost)] }));
  const exportX = () => exportCsv({ title: d.tableT, cols: d.cols || [], rows: exRows, lang, toast });
  const exportP = () => exportPdf({ title: d.tableT, cols: d.cols || [], rows: exRows, lang, toast });
  const notImpl = label => () => toast(label + ' · ' + d.notImpl);

  const rows = me.rows.map((x, ri) => {
    const r = x.r, etas = []; let len = 0, p = OPT_DEPOT;
    r.stops.forEach((id, i) => { const st = OPT_STOPS[id - 1]; len += optDist(p, st); p = st; etas.push(OPT_START + (len * 1.2 + i * 30) * cal.ts); });
    return { ri, r, x, etas, color: OPT_COLORS[r.van] || '#6C82A6', van: OPT_VANS[r.van], driver: OPT_DRIVERS[r.van] };
  });

  const cents = rows.map(w => { const n = w.r.stops.length || 1; return w.r.stops.reduce((a, id) => ({ x: a.x + OPT_STOPS[id - 1].x / n, y: a.y + OPT_STOPS[id - 1].y / n }), { x: 0, y: 0 }); });
  let closer = 0;
  rows.forEach((w, ri) => w.r.stops.forEach(id => {
    const st = OPT_STOPS[id - 1], own = optDist(st, cents[ri]);
    if (rows.some((w2, rj) => rj !== ri && w2.r.stops.length && optDist(st, cents[rj]) < own * 0.8)) closer++;
  }));
  const al = d.al || {}, TC = { ok: '#137A45', warn: '#D99A00', bad: '#C0392B' };
  const alerts = [];
  if (closer) alerts.push({ t: fill(al.closer, { n: closer }), c: TC.warn });
  rows.forEach(w => {
    if (w.x.util > 92) alerts.push({ t: fill(al.cap, { v: w.van, p: w.x.util }), c: TC.bad });
    if (w.r.stops.length && w.x.end > OPT_SHIFT_END) alerts.push({ t: fill(al.shift, { r: w.r.id }), c: TC.bad });
  });
  const pool = [];
  if (pool.length) alerts.push({ t: fill(al.pool, { n: pool.length }), c: TC.warn });
  const pct = (a2, b) => Math.round((a2 - b) / (b || 1) * 100);
  if (sel !== 'cur') { const p = -pct(me.t, cur.t); if (p > 0) alerts.push({ t: fill(al.saved, { p: p }), c: TC.ok }); }
  const used = me.rows.filter(z => z.r.stops.length).map(z => z.t);
  const W = d.why || {};
  const why = [fill(W.km, { n: Math.max(0, Math.round(cur.km - me.km)) }), fill(W.time, { n: optHM(Math.max(0, cur.t - me.t)) }),
    fill(W.bal, { n: optHM(used.length ? Math.max.apply(null, used) - Math.min.apply(null, used) : 0) }),
    fill(W.fuel, { n: Math.max(0, cur.fuel - me.fuel).toFixed(1) }), me.late.length ? fill(W.slaBad, { n: me.late.length }) : W.sla];

  const zx = x => x + '%', zy = y => (y / OPT_H * 100).toFixed(2) + '%';
  const paths = rows.filter(w => w.r.stops.length).map(w => ({
    id: w.r.id, color: w.color,
    d: 'M ' + OPT_DEPOT.x + ' ' + OPT_DEPOT.y + ' L ' + w.r.stops.map(id => OPT_STOPS[id - 1].x + ' ' + OPT_STOPS[id - 1].y).join(' L ')
  }));
  const pins = [];
  rows.forEach(w => w.r.stops.forEach((id, i) => {
    const st = OPT_STOPS[id - 1];
    pins.push({ id, left: zx(st.x), top: zy(st.y), bg: w.color, ring: id === focus ? C.navy : '#fff', fg: w.color === '#D99A00' ? C.navy : '#fff', num: String(i + 1), title: name(id) + ' · ' + w.r.id + ' · ETA ' + optClock(w.etas[i]), route: w });
  }));

  const where = id => { for (const w of rows) { const i = w.r.stops.indexOf(id); if (i >= 0) return { w, i }; } return null; };
  const pop = (focus != null && OPT_STOPS[focus - 1]) ? (() => {
    const id = focus, loc = where(id), svc = 20 + (id % 3) * 10, pr = id % 5 === 0 ? 2 : id % 3 === 0 ? 1 : 0;
    const e = loc ? loc.w.etas[loc.i] : null;
    return { name: name(id), addr: addr(id), win: e != null ? optClock(e) + ' – ' + optClock(e + svc) + ' (' + svc + ' min)' : d.poolT,
      route: loc ? loc.w.r.id + ' · ' + loc.w.van : '—', prio: (d.prios || [])[pr], prioC: ['#6C82A6', '#B07A00', '#C0392B'][pr] };
  })() : null;

  const dw = rows.find(w => w.r.id === detail && w.r.stops.length) || rows.find(w => w.r.stops.length) || null;
  const center = (d.centers || [])[+F.center] || '';
  const detailInfo = dw ? { title: dw.r.id + ' · ' + dw.van, color: dw.color,
    sub: [dw.r.stops.length + ' ' + d.clients, Math.round(dw.x.km) + ' km', optHM(dw.x.t), '$' + Math.round(dw.x.cost)].join('  ·  '),
    seq: [{ at: optClock(OPT_START), l: d.seqOut + ' · ' + center, dep: true }]
      .concat(dw.r.stops.map((id, i) => ({ at: optClock(dw.etas[i]), l: name(id) + ' · ' + addr(id), id })))
      .concat([{ at: optClock(dw.x.end), l: d.seqBack + ' · ' + center, dep: true }]) } : null;

  const dots = { rec: '#137A45', a: '#087CF0', b: '#D99A00', cur: '#8B9DBA' };
  const order = ['cur', 'rec', 'a', 'b'];
  const metr = [['time', x => optHM(x.t)], ['km', x => Math.round(x.km) + ' km'], ['fuel', x => x.fuel.toFixed(1) + ' L'], ['cost', x => '$' + Math.round(x.cost)], ['clients', x => String(x.clients)], ['vans', x => String(x.vans)], ['delays', x => String(x.delays)]];
  const chart = [['time', x => x.t, x => optHM(x.t)], ['km', x => x.km, x => Math.round(x.km) + ' km'], ['cost', x => x.cost, x => '$' + Math.round(x.cost)]].map(zz => {
    const mx = Math.max.apply(null, order.map(k => zz[1](M[k])));
    return { k: m[zz[0]], bars: order.map(k => ({ h: (zz[1](M[k]) / mx * 100).toFixed(1) + '%', c: dots[k], v: zz[2](M[k]) })) };
  });

  const runs = [null, review, changes, approve, publish, send];
  const steps = (d.steps || []).map((l, i) => ({ l, done: i < stage, on: i === stage, act: (d.stepAct || [])[i] || '', run: runs[i] || (() => {}), meta: i < stage ? (log[i] || '') : i === stage ? d.current : d.pending }));
  const stKey = recalc ? 'recalc' : stage >= 6 ? 'sent' : stage === 5 ? 'published' : stage === 4 ? 'approved' : 'done';
  const stTone = { recalc: TONE.info, sent: TONE.ok, published: TONE.ok, approved: TONE.ok, done: TONE.ok }[stKey];

  const actBtn = (label, primary, off, run, key) => (
    <button key={key || label} type="button" aria-disabled={off} onClick={run}
      style={{ minHeight: 40, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: off ? 'not-allowed' : 'pointer', background: primary ? C.blue : C.white, color: primary ? C.white : C.navy, border: `1.5px solid ${primary ? C.blue : C.border}`, opacity: off ? 0.45 : 1, font: 'inherit' }}>
      {label}
    </button>
  );
  const th = { textAlign: 'left', padding: '13px 16px', background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary, whiteSpace: 'nowrap' };
  const td = { padding: '13px 16px', borderTop: `1px solid ${C.divider}`, fontSize: 13, whiteSpace: 'nowrap' };

  if (view !== 'data') {
    const isErr = view === 'error';
    return (
      <div style={{ ...card, padding: '44px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: isErr ? C.red : C.text }}>
          {view === 'loading' ? (d.status || {}).recalc : view === 'empty' ? common.empty : common.errorT}
        </div>
        {view !== 'loading' && <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 6 }}>{view === 'empty' ? common.emptyHint : common.errorHint}</div>}
        {isErr && <button type="button" onClick={() => {}} style={{ marginTop: 12, ...ghostBtn }}>{common.retry}</button>}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header actions */}
      <div style={{ ...card, padding: '16px 22px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={sectionTitle}>{d.rvT}</span>
          <span style={{ fontSize: 12, color: C.textSecondary }}>{d.engineT}: {d.engine} · {d.lastRunT}: {(d.today || '') + ' ' + lastRun}</span>
        </div>
        <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: stTone.bg, color: stTone.fg }}>{(d.status || {})[stKey]}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {actBtn(btnT.refresh, false, false, generate)}
          {actBtn(btnT.export, false, false, exportX)}
          {actBtn(btnT.save, false, false, save)}
          {actBtn(btnT.approve, true, stage !== 3, approve)}
          {actBtn(btnT.publishSend, true, stage < 4 || stage >= 6, publishSend)}
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...card, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ ...sectionTitle, fontSize: 12 }}>{d.filtersT}</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
          <label style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 6 }}>{(d.f || {}).date}</span>
            <input type="date" value={F.date} onChange={e => setF({ ...F, date: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.bg, fontSize: 13, color: C.navy, outline: 'none', font: 'inherit' }} />
          </label>
          {[['region', d.regions], ['sup', d.sups], ['center', d.centers]].map(([k, list]) => (
            <label key={k} style={{ display: 'block' }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 6 }}>{(d.f || {})[k]}</span>
              <select value={F[k]} onChange={e => setF({ ...F, [k]: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.bg, fontSize: 13, color: C.navy, outline: 'none', font: 'inherit' }}>
                {(list || []).map((l, i) => <option key={i} value={i}>{l}</option>)}
              </select>
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 7 }}>{(d.f || {}).svc}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(d.svcs || []).map((l, i) => (
                <button key={i} type="button" onClick={() => setF({ ...F, svc: i })}
                  style={{ padding: '8px 13px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${F.svc === i ? C.navy : C.border}`, background: F.svc === i ? C.navy : C.white, color: F.svc === i ? C.white : C.text, font: 'inherit' }}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 7 }}>{(d.f || {}).obj}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(d.objs || []).map((l, i) => (
                <button key={i} type="button" onClick={() => setF({ ...F, obj: i })}
                  style={{ padding: '8px 13px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${+F.obj === i ? C.navy : C.border}`, background: +F.obj === i ? C.navy : C.white, color: +F.obj === i ? C.white : C.text, font: 'inherit' }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div><button type="button" onClick={generate} disabled={recalc}
          style={{ minHeight: 44, padding: '11px 22px', border: 'none', borderRadius: 11, background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: recalc ? 0.6 : 1, font: 'inherit' }}>
          {recalc ? (d.status || {}).recalc : d.generate}</button></div>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
        {OPT_PLAN_KEYS.map(k => {
          const x = M[k], on = sel === k;
          const kpis = [{ k: m.time, v: optHM(x.t) }, { k: m.km, v: Math.round(x.km) + ' km' }, { k: m.cost, v: '$' + Math.round(x.cost) }, { k: m.fuel, v: x.fuel.toFixed(1) + ' L' }];
          return (
            <div key={k} style={{ ...card, border: `1.5px solid ${on ? C.blue : C.border}`, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: dots[k], flex: '0 0 auto' }} />
                <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, flex: 1 }}>{(d.plans || {})[k]}</span>
                <span style={{ padding: '3px 9px', borderRadius: 100, fontSize: 10.5, fontWeight: 700, background: C.bg, color: C.textSecondary }}>{(d.tags || {})[k]}</span>
              </div>
              {kpis.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, borderTop: i ? `1px solid ${C.divider}` : 'none', paddingTop: i ? 8 : 0 }}>
                  <span style={{ color: C.textSecondary }}>{p.k}</span><b>{p.v}</b>
                </div>
              ))}
              <button type="button" onClick={() => setSel(k)}
                style={{ marginTop: 4, padding: '9px 0', borderRadius: 9, border: `1.5px solid ${on ? C.blue : C.border}`, background: on ? C.blue : C.white, color: on ? C.white : C.blueDark, fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
                {on ? d.selected : d.select}
              </button>
            </div>
          );
        })}
      </div>

      {/* KPI comparison + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>
        <div style={card}>
          <div style={{ ...sectionTitle, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>{d.kpiT}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>{d.metric}</th>{order.map(k => <th key={k} style={th}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: dots[k] }} />{(d.short || {})[k]}</span></th>)}</tr></thead>
            <tbody>
              {metr.map(([mk, fmt], i) => (
                <tr key={i}><td style={td}>{m[mk]}</td>{order.map(k => <td key={k} style={{ ...td, fontWeight: k === sel ? 700 : 400 }}>{fmt(M[k])}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...card, padding: '18px 20px' }}>
          <div style={{ ...sectionTitle, marginBottom: 14 }}>{d.chartT}</div>
          {chart.map((grp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary, marginBottom: 6 }}>{grp.k}</div>
              {grp.bars.map((b, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ height: 10, width: b.h, background: b.c, borderRadius: 100, minWidth: 2 }} />
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{b.v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Alerts + why */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div style={{ ...card, padding: '18px 20px' }}>
          <div style={{ ...sectionTitle, marginBottom: 12 }}>{d.alertsT}</div>
          {alerts.length === 0 && <div style={{ fontSize: 13, color: C.textSecondary }}>{d.noAlerts}</div>}
          {alerts.map((a2, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderTop: i ? `1px solid ${C.divider}` : 'none', fontSize: 13 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: a2.c, marginTop: 5, flex: '0 0 auto' }} />{a2.t}
            </div>
          ))}
        </div>
        <div style={{ ...card, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: whyOpen ? 12 : 0 }}>
            <span style={sectionTitle}>{d.whyT}</span>
            <button type="button" onClick={() => setWhyOpen(!whyOpen)} style={{ ...ghostBtn, marginLeft: 'auto' }}>{whyOpen ? d.whyHide : d.whyBtn}</button>
          </div>
          {whyOpen && (
            <div>
              <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>{d.whyIntro}</div>
              {why.map((w2, i) => <div key={i} style={{ fontSize: 13, padding: '6px 0', borderTop: i ? `1px solid ${C.divider}` : 'none' }}>{w2}</div>)}
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10 }}>{d.whyNote}</div>
            </div>
          )}
        </div>
      </div>

      {/* Map + route detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'stretch' }}>
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={sectionTitle}>{d.mapT}</span>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', border: '1px solid rgba(217,154,0,.4)', borderRadius: 100, background: 'rgba(217,154,0,.08)', fontSize: 11.5, fontWeight: 600, color: '#8A6300' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold }} />{d.mapBadge}
            </span>
          </div>
          <div style={{ position: 'relative', flex: 1, minHeight: 380, background: C.bg, overflow: 'hidden' }}>
            <svg viewBox="0 0 100 66" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {paths.map(p => <path key={p.id} d={p.d} fill="none" stroke={p.color} strokeWidth={0.7} opacity={0.92} />)}
            </svg>
            <span style={{ position: 'absolute', left: OPT_DEPOT.x + '%', top: zy(OPT_DEPOT.y), transform: 'translate(-50%,-50%)', width: 14, height: 14, borderRadius: 4, background: C.navy, border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
            {pins.map(p => (
              <button key={p.id} type="button" title={p.title} onClick={() => { setFocus(p.id); if (p.route) setDetail(p.route.r.id); }}
                style={{ position: 'absolute', left: p.left, top: p.top, transform: 'translate(-50%,-50%)', width: 24, height: 24, borderRadius: '50%', background: p.bg, color: p.fg, border: `2px solid ${p.ring}`, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.25)', padding: 0, font: 'inherit' }}>
                {p.num}
              </button>
            ))}
            {pop && (
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', boxShadow: '0 12px 30px rgba(0,27,69,.18)', minWidth: 220, zIndex: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <b style={{ fontSize: 14 }}>{pop.name}</b>
                  <span style={{ marginLeft: 'auto', padding: '3px 9px', borderRadius: 100, fontSize: 10.5, fontWeight: 700, background: C.bg, color: pop.prioC }}>{pop.prio}</span>
                  <button type="button" onClick={() => setFocus(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 15, font: 'inherit' }}>✕</button>
                </div>
                <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 6 }}>{pop.addr}</div>
                <div style={{ fontSize: 12, marginTop: 8 }}><b>{d.winT}:</b> {pop.win}</div>
                <div style={{ fontSize: 12, marginTop: 3 }}><b>{d.routeT}:</b> {pop.route}</div>
              </div>
            )}
            {recalc && <div style={{ position: 'absolute', inset: 0, background: 'rgba(238,244,252,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: C.navy }}>{d.recalc}</div>}
          </div>
          <div style={{ padding: '10px 20px', fontSize: 11.5, color: C.textSecondary, borderTop: `1px solid ${C.divider}` }}>{d.mapHint}</div>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...sectionTitle, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>{d.detailT}</div>
          {detailInfo && (
            <div style={{ padding: '14px 20px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: detailInfo.color }} />
                <b style={{ fontSize: 14 }}>{detailInfo.title}</b>
              </div>
              <div style={{ fontSize: 12, color: C.textSecondary, margin: '6px 0 12px' }}>{detailInfo.sub}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {detailInfo.seq.map((q, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '7px 0', borderTop: i ? `1px solid ${C.divider}` : 'none' }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: q.dep ? C.navy : C.textSecondary, fontWeight: q.dep ? 700 : 400, minWidth: 44 }}>{q.at}</span>
                    <span style={{ fontSize: 12.5, fontWeight: q.dep ? 600 : 400, color: q.dep ? C.navy : C.text, cursor: q.id ? 'pointer' : 'default' }}
                      onClick={() => q.id && setFocus(q.id)}>{q.l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Route table */}
      <div style={card}>
        <div style={{ ...sectionTitle, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>{d.tableT}</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead><tr>{(d.cols || []).map((c2, i) => <th key={i} style={th}>{c2}</th>)}<th style={th}>{d.stCol}</th><th style={th}></th></tr></thead>
            <tbody>
              {rows.filter(w => w.r.stops.length).map(w => {
                const bad = w.x.util > 92 || w.x.end > OPT_SHIFT_END, t = bad ? TONE.warn : TONE.ok, open = !!openRow[w.r.id];
                const seq = [{ at: optClock(OPT_START), l: d.seqOut }].concat(w.r.stops.map((id, i) => ({ at: optClock(w.etas[i]), l: name(id) }))).concat([{ at: optClock(w.x.end), l: d.seqBack }]);
                return (
                  <React.Fragment key={w.r.id}>
                    <tr onClick={() => setDetail(w.r.id)} style={{ cursor: 'pointer', background: detailInfo && w.r.id === dw.r.id ? '#F1F7FF' : C.white }}>
                      {[w.r.id, w.van, w.driver, String(w.r.stops.length), optClock(OPT_START), optClock(w.x.end), String(Math.round(w.x.km)), optHM(w.x.t), '$' + Math.round(w.x.cost)].map((c2, i) => (
                        <td key={i} style={{ ...td, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.navy : C.text }}>
                          {i === 0 && <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: w.color, marginRight: 8 }} />}{c2}
                        </td>
                      ))}
                      <td style={td}><span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: t.bg, color: t.fg }}>{bad ? d.stRev : d.stOk}</span></td>
                      <td style={td}>
                        <button type="button" onClick={e => { e.stopPropagation(); setOpenRow({ ...openRow, [w.r.id]: !open }); }}
                          style={{ padding: '5px 11px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, color: C.blueDark, fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
                          {open ? '−' : '+'} {d.expand}
                        </button>
                      </td>
                    </tr>
                    {open && (
                      <tr><td colSpan={11} style={{ padding: '12px 20px', borderTop: `1px solid ${C.divider}`, background: C.bg }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {seq.map((q, i) => (
                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ padding: '5px 10px', borderRadius: 8, fontSize: 12, background: i === 0 || i === seq.length - 1 ? C.navy : '#F4F8FD', color: i === 0 || i === seq.length - 1 ? C.white : C.text }}>
                                <b style={{ fontFamily: FONT_MONO, fontSize: 11 }}>{q.at}</b> {q.l}
                              </span>
                              {i < seq.length - 1 && <span style={{ color: C.textMuted }}>→</span>}
                            </span>
                          ))}
                        </div>
                      </td></tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ ...card, padding: '18px 20px' }}>
        <div style={{ ...sectionTitle, marginBottom: 14 }}>{d.tlT} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: C.textMuted }}>· {d.shiftEnd}</span></div>
        <div style={{ position: 'relative', height: 8, borderRadius: 100, background: C.bg, marginBottom: 8 }}>
          <span style={{ position: 'absolute', left: ((OPT_SHIFT_END - OPT_START) / OPT_SPAN * 100).toFixed(2) + '%', top: -4, bottom: -4, width: 2, background: C.red, opacity: 0.6 }} />
        </div>
        {rows.filter(w => w.r.stops.length).map(w => {
          const late = w.x.end > OPT_SHIFT_END;
          return (
            <div key={w.r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 62, fontSize: 11, fontWeight: 600, color: C.textSecondary, flex: '0 0 auto' }}>{w.van}</span>
              <div style={{ flex: 1, position: 'relative', height: 16, background: C.bg, borderRadius: 100 }}>
                <span onClick={() => setDetail(w.r.id)} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, w.x.t / OPT_SPAN * 100).toFixed(1) + '%', background: w.color, borderRadius: 100, cursor: 'pointer' }} />
                {late && <span style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 4, background: C.red, borderRadius: '0 100px 100px 0' }} />}
              </div>
              <span style={{ fontSize: 11, fontFamily: FONT_MONO, color: late ? C.red : C.textSecondary, flex: '0 0 auto' }}>{optClock(OPT_START)}–{optClock(w.x.end)}{late ? ' · ' + d.conflict : ''}</span>
            </div>
          );
        })}
      </div>

      {/* Constraints */}
      <div style={card}>
        <button type="button" onClick={() => setConsOpen(!consOpen)}
          style={{ width: '100%', padding: '14px 20px', borderBottom: consOpen ? `1px solid ${C.border}` : 'none', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', font: 'inherit' }}>
          <span style={sectionTitle}>{d.consT}</span>
          <span style={{ fontSize: 12, color: C.textSecondary }}>{fill(d.consOn, { n: (d.cons || []).length, t: (d.cons || []).length })}</span>
          <span style={{ marginLeft: 'auto', color: C.textMuted }}>{consOpen ? '−' : '+'}</span>
        </button>
        {consOpen && (
          <div style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(d.cons || []).map((c2, i) => <span key={i} style={{ padding: '6px 12px', borderRadius: 100, background: C.bg, border: `1px solid ${C.border}`, fontSize: 12, color: C.text }}>{c2}</span>)}
          </div>
        )}
      </div>

      {/* Approval steps + versions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'start' }}>
        <div style={{ ...card, padding: '18px 20px' }}>
          <div style={{ ...sectionTitle, marginBottom: 14 }}>{d.apprT}</div>
          {steps.map((s2, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 0', borderTop: i ? `1px solid ${C.divider}` : 'none' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flex: '0 0 auto', background: s2.done ? C.green : s2.on ? C.blue : C.bg, color: s2.done || s2.on ? C.white : C.textMuted }}>{s2.done ? '✓' : i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s2.l}</div>
                <div style={{ fontSize: 11, color: C.textSecondary }}>{s2.meta}</div>
              </div>
              {s2.on && s2.act ? <button type="button" onClick={s2.run} style={{ ...ghostBtn }}>{s2.act}</button> : null}
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{ ...sectionTitle, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>{d.verT}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{(d.verCols || []).map((c2, i) => <th key={i} style={th}>{c2}</th>)}</tr></thead>
            <tbody>
              {versions.map((v2, i) => (
                <tr key={i}>{[v2.v, v2.at, v2.u, v2.c].map((c2, j) => <td key={j} style={{ ...td, fontWeight: j === 0 ? 700 : 400 }}>{c2}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div style={{ ...card, padding: '16px 22px', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <span style={sectionTitle}>{d.actT}</span>
        {actBtn(A.save, false, false, save)}
        {actBtn(A.revert, false, locked, revert)}
        {actBtn(A.compare, false, false, compare)}
        {actBtn(A.pdf, false, false, exportP)}
        {actBtn(A.excel, false, false, exportX)}
        {actBtn(A.jira, false, true, notImpl(A.jira))}
        {actBtn(A.schedule, false, true, notImpl(A.schedule))}
        {actBtn(A.approve, true, stage !== 3, approve)}
        {actBtn(A.publish, true, stage !== 4, publish)}
        {actBtn(A.send, true, stage !== 5, send)}
      </div>
    </div>
  );
}
