/**
 * BusinessPortal.jsx — business customer portal.
 * React export of "TR3SLOG Business Portal.dc.html" (i18n packs `biz` + `app`).
 *
 * Screens: dash · shipments · bulk · recurring · locations · team · roles ·
 * reports · billing · invoices. Identifiers and translation keys unchanged.
 *
 * Product rules kept: the customer never sees the fleet, bulk batches must pass
 * validation before confirmation, credits and refunds are read-only here, and
 * every figure is a placeholder until the platform is connected.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { C, FONT_HEAD, FONT_BODY, LANGS, LANG_STORE, card, sectionTitle, primaryBtn, outlineBtn } from './tokens.js';
import { NavIcon, Motif } from './blocks.jsx';

export const NAV_ICONS = {
  dash: 'M4 13h7V4H4zM13 20h7v-9h-7zM4 20h7v-4H4zM13 8h7V4h-7z',
  shipments: 'M3 7l9-4 9 4v10l-9 4-9-4V7z|M3 7l9 4 9-4',
  bulk: 'M12 16V4M8 8l4-4 4 4M4 16v3h16v-3',
  recurring: 'M4 12a8 8 0 0113.7-5.7M20 12a8 8 0 01-13.7 5.7|M18 4v4h-4M6 20v-4h4',
  locations: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z|circle:12,10,2.6',
  team: 'circle:9,8,3.4|M3 20a6 6 0 0112 0M16 11a3 3 0 100-6M17 20a5.5 5.5 0 00-2-4',
  roles: 'M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z|M9.5 12.5l1.8 1.8 3.2-3.6',
  reports: 'M4 19V5M4 19h16M8 15l3-4 3 3 4-6',
  billing: 'M3 7h18v10H3zM3 11h18',
  invoices: 'M6 3h8l4 4v14H6zM14 3v4h4|M9 13h6M9 17h4'
};

export const NAV_GROUPS = [
  { key: 'ops', keys: ['dash', 'shipments', 'bulk', 'recurring', 'locations'] },
  { key: 'admin', keys: ['team', 'roles'] },
  { key: 'finance', keys: ['reports', 'billing', 'invoices'] }
];

const SCREENS = ['dash', 'shipments', 'bulk', 'recurring', 'locations', 'team', 'roles', 'reports', 'billing', 'invoices'];
const ERR_BORDER = '#E0A0A0';

const STATUS_TONE = i => i >= 9 ? { bg: 'rgba(192,57,43,.1)', fg: C.red }
  : i === 8 ? { bg: 'rgba(19,122,69,.12)', fg: C.greenText }
  : i === 7 ? { bg: 'rgba(217,154,0,.16)', fg: C.goldText }
  : i >= 4 ? { bg: 'rgba(8,124,240,.1)', fg: C.blueDark }
  : { bg: C.bg, fg: C.text };

const DOC_TONE = {
  paid: { bg: 'rgba(19,122,69,.12)', fg: C.greenText },
  pending: { bg: 'rgba(217,154,0,.16)', fg: C.goldText },
  overdue: { bg: 'rgba(192,57,43,.1)', fg: C.red },
  credit: { bg: 'rgba(8,124,240,.1)', fg: C.blueDark },
  adjust: { bg: C.bg, fg: C.text },
  refund: { bg: 'rgba(19,122,69,.12)', fg: C.greenText },
  disputed: { bg: 'rgba(192,57,43,.1)', fg: C.red }
};

const eyebrow = { fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 10 };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 8 };
const field = invalid => ({ width: '100%', padding: '14px 15px', border: `1.5px solid ${invalid ? ERR_BORDER : C.border}`, borderRadius: 11, background: C.bg, fontSize: 15, color: C.navy, outline: 'none', font: 'inherit' });
const panelHead = { ...sectionTitle, padding: '18px 22px', borderBottom: `1px solid ${C.border}` };
const rowDivider = { borderTop: `1px solid ${C.divider}` };
const linkBtn = { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.blue, font: 'inherit' };
const colHead = { display: 'grid', gap: 12, padding: '12px 22px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary };

function Pill({ tone, children, justify }) {
  return <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: tone.bg, color: tone.fg, whiteSpace: 'nowrap', justifySelf: justify }}>{children}</span>;
}

function Chips({ items, selected, onPick }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(items || []).map((l, i) => {
        const on = selected === i;
        return (
          <button key={i} type="button" onClick={() => onPick(i)}
            style={{ padding: '10px 14px', border: `1.5px solid ${on ? C.blue : C.border}`, borderRadius: 100, background: on ? 'rgba(8,124,240,.08)' : C.white, color: on ? C.blueDark : C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{l}</button>
        );
      })}
    </div>
  );
}

function CheckBox({ on, onClick, label }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onClick}
      style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${on ? C.blue : C.border}`, background: on ? C.blue : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 13, flex: '0 0 auto' }}>{on ? '✓' : ''}</span>
      <span style={{ fontSize: 14, color: C.text }}>{label}</span>
    </button>
  );
}

function H1({ children, style }) {
  return <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: 0, ...style }}>{children}</h1>;
}

function InlineError({ text }) {
  return (
    <div role="alert" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 500, color: '#C0392B' }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>{text}
    </div>
  );
}

export default function BusinessPortal({ startScreen = 'dash', dict = null, lang: langProp = null, onLogout = null, account = null }) {
  const [lang, setLang] = useState(langProp || 'es');
  const [screen, setScreen] = useState(SCREENS.indexOf(startScreen) >= 0 ? startScreen : 'dash');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [shipFilter, setShipFilter] = useState(0);
  const [selected, setSelected] = useState({});
  const [bulkStep, setBulkStep] = useState(0);
  const [recFormOpen, setRecFormOpen] = useState(false);
  const [recFreq, setRecFreq] = useState(1);
  const [recPaused, setRecPaused] = useState({});
  const [inactive, setInactive] = useState({});
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(2);
  const [inviteRestrict, setInviteRestrict] = useState({});
  const [inviteError, setInviteError] = useState(false);
  const [repPeriod, setRepPeriod] = useState(0);
  const [invPeriod, setInvPeriod] = useState(0);
  const [invTab, setInvTab] = useState(0);
  const [disputed, setDisputed] = useState({});
  const [autopay, setAutopay] = useState(true);
  const [billNotifs, setBillNotifs] = useState({ 0: true, 1: true, 2: true, 3: false });
  const [billEdits, setBillEdits] = useState({});
  const [toast, setToast] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    if (langProp) return;
    let saved = null;
    try { saved = window.localStorage.getItem(LANG_STORE); } catch (e) { /* storage unavailable */ }
    const nl = (navigator.language || '').toLowerCase();
    setLang(LANGS.indexOf(saved) >= 0 ? saved : nl.indexOf('zh') === 0 ? 'zh-CN' : nl.indexOf('en') === 0 ? 'en' : 'es');
  }, [langProp]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => () => clearTimeout(toastRef.current), []);

  const showToast = useCallback(text => {
    setToast(text);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 5000);
  }, []);

  const pickLang = useCallback(code => {
    try { window.localStorage.setItem(LANG_STORE, code); } catch (e) { /* storage unavailable */ }
    setLang(code);
    setMenuOpen(false);
  }, []);

  const go = useCallback(next => {
    setScreen(next);
    setMenuOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const all = dict || (typeof window !== 'undefined' ? window.TR3S_I18N : null) || {};
  const t = all[lang] || all.es || all.en || {};
  const biz = t.biz || {};
  const app = t.app || {};
  const shell = biz.shell || { section: {} };
  const common = biz.common || {};
  const statuses = (app.disp && app.disp.statuses) || [];

  const shipRows = useMemo(() => ((biz.ship && biz.ship.rows) || []).filter(r => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || `${r.id} ${r.route} ${r.emp}`.toLowerCase().indexOf(q) >= 0;
    const f = shipFilter;
    const matchF = f === 0 || (f === 1 && r.st === 6) || (f === 2 && r.st === 7) || (f === 3 && r.st === 8) || (f === 4 && r.exc);
    return matchQ && matchF;
  }), [biz.ship, query, shipFilter]);

  const selectedCount = Object.keys(selected).filter(k => selected[k]).length;
  const invRows = ((biz.inv && biz.inv.rows) || []).filter(r => r.tab === invTab);

  /* ---------- screens ---------- */

  const dashScreen = () => {
    const d = biz.dash || {};
    const accents = [C.blue, C.blue, C.blue, C.navy, C.green, C.gold];
    const recent = ((biz.inv && biz.inv.rows) || []).filter(r => r.tab === 0).slice(0, 3);
    const quickTargets = ['shipments', 'bulk', 'recurring', 'reports'];
    return (
      <div>
        <Motif />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 20 }}>
          <H1>{d.title}</H1>
          <span style={{ padding: '8px 14px', border: `1px solid ${C.border}`, borderRadius: 100, background: C.white, fontSize: 12, fontWeight: 600, color: C.text }}>{d.period}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16, marginBottom: 20 }}>
          {(d.kpis || []).map((k, i) => (
            <div key={i} style={{ ...card, padding: 22 }}>
              <div aria-hidden="true" style={{ width: 26, height: 5, background: accents[i] || C.blue, transform: 'skewX(-24deg)', marginBottom: 14 }} />
              <div style={eyebrow}>{k.l}</div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', color: C.navy }}>{k.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr .6fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card, padding: 22 }}>
              <div style={{ ...sectionTitle, marginBottom: 16 }}>{d.perfT}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14 }}>
                {(d.perf || []).map((p, i) => (
                  <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary }}>{p.l}</div>
                    <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 20, marginTop: 6 }}>{p.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={sectionTitle}>{d.invoicesT}</span>
                <button type="button" style={{ ...linkBtn, marginLeft: 'auto' }} onClick={() => go('invoices')}>{common.view}</button>
              </div>
              {recent.map((r, i) => {
                const tone = DOC_TONE[r.st] || DOC_TONE.adjust;
                return (
                  <div key={i} style={{ ...rowDivider, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '15px 22px' }}>
                    <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 13 }}>{r.id}</span>
                    <span style={{ fontSize: 13, color: C.text }}>{r.d}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600 }}>{r.a}</span>
                    <Pill tone={tone}>{(biz.inv.statuses || {})[r.st]}</Pill>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ ...sectionTitle, marginBottom: 14 }}>{d.quickT}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(d.quick || []).map((l, i) => (
                  <button key={i} type="button" onClick={() => go(quickTargets[i])}
                    style={{ padding: '14px 12px', border: `1px solid ${C.border}`, borderRadius: 12, background: C.bg, fontSize: 12, fontWeight: 600, color: C.navy, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ ...sectionTitle, marginBottom: 14 }}>{d.alertsT}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(d.alerts || []).map((a, i) => (
                  <div key={i} style={{ border: '1px solid rgba(217,154,0,.4)', background: 'rgba(217,154,0,.07)', borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.goldText }}>{a.t}</div>
                    <div style={{ fontSize: 12, color: '#6C5220', marginTop: 4, lineHeight: 1.6 }}>{a.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const shipmentsScreen = () => {
    const sh = biz.ship || {};
    const cols = '40px 1.1fr 1.3fr 1fr .9fr 1fr .9fr';
    return (
      <div>
        <H1 style={{ marginBottom: 20 }}>{sh.title}</H1>
        <div style={card}>
          <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <label style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 11, background: C.bg, cursor: 'text' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth={1.8}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.5-4.5" /></svg>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={sh.searchPh} style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: C.navy, font: 'inherit' }} />
            </label>
            <Chips items={sh.statuses} selected={shipFilter} onPick={setShipFilter} />
            <button type="button" onClick={() => showToast(common.exportOk)} style={{ ...outlineBtn, padding: '11px 16px', fontSize: 13 }}>{common.export}</button>
          </div>

          {selectedCount > 0 && (
            <div style={{ padding: '14px 22px', background: C.bg, borderBottom: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedCount} {sh.selected}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 'auto' }}>
                {(sh.bulk || []).map((l, i) => (
                  <button key={i} type="button" onClick={() => showToast(`${l} · ${selectedCount}`)}
                    style={{ padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 9, background: C.white, fontSize: 12, fontWeight: 600, color: C.navy, cursor: 'pointer', font: 'inherit' }}>{l}</button>
                ))}
              </div>
            </div>
          )}

          {shipRows.length === 0 && <div style={{ padding: '56px 22px', textAlign: 'center', fontSize: 14, color: C.text }}>{common.empty}</div>}

          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 900 }}>
              <div style={{ ...colHead, gridTemplateColumns: cols }}>
                <span />
                {(sh.cols || []).map((c, i) => <span key={i}>{c}</span>)}
              </div>
              {shipRows.map((r, i) => {
                const tone = STATUS_TONE(r.st);
                const on = !!selected[r.id];
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '15px 22px', ...rowDivider, alignItems: 'center' }}>
                    <button type="button" role="checkbox" aria-checked={on} aria-label={r.id}
                      onClick={() => setSelected(p => ({ ...p, [r.id]: !p[r.id] }))}
                      style={{ width: 20, height: 20, border: `1.5px solid ${on ? C.blue : C.border}`, borderRadius: 5, background: on ? C.blue : C.white, color: C.white, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on ? '✓' : ''}</button>
                    <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 13 }}>{r.id}</span>
                    <span style={{ fontSize: 13, color: C.text }}>{r.route}</span>
                    <span style={{ fontSize: 13, color: C.text }}>{r.svc}</span>
                    <span style={{ fontSize: 13, color: C.text }}>{r.emp}</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Pill tone={tone}>{statuses[r.st] || ''}</Pill>
                      {r.exc && <Pill tone={DOC_TONE.overdue}>{sh.exception}</Pill>}
                    </div>
                    <button type="button" onClick={() => showToast(`${sh.evidence} · ${r.id}`)} style={{ ...linkBtn, textAlign: 'left' }}>{sh.evidence}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const bulkScreen = () => {
    const b = biz.bulk || {};
    const cols = '.5fr 1.3fr 1.1fr 1fr .7fr .8fr';
    const checkAccents = [C.blue, C.blue, C.gold, '#C0392B'];
    return (
      <div style={{ maxWidth: 1000 }}>
        <H1 style={{ marginBottom: 20 }}>{b.title}</H1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {(b.steps || []).map((l, i) => {
            const on = bulkStep === i, done = i < bulkStep;
            return (
              <button key={i} type="button" onClick={() => setBulkStep(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', border: `1.5px solid ${on ? C.blue : C.border}`, borderRadius: 100, background: on ? 'rgba(8,124,240,.08)' : C.white, color: on ? C.blueDark : done ? C.navy : C.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: on || done ? C.blue : C.bg, color: on || done ? C.white : C.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>{l}
              </button>
            );
          })}
        </div>

        {bulkStep === 0 && (
          <div style={{ ...card, padding: 26 }}>
            <div style={{ border: `2px dashed ${C.border}`, borderRadius: 14, padding: '44px 24px', textAlign: 'center', background: C.bg }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={1.6} style={{ marginBottom: 12 }}><path d="M12 16V4M8 8l4-4 4 4M4 16v3h16v-3" /></svg>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{b.dropT}</div>
              <div style={{ fontSize: 13, color: C.textSecondary }}>{b.dropNote}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 16px', border: `1px solid ${C.border}`, borderRadius: 11, fontSize: 13, fontWeight: 600 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={1.7}><path d="M6 3h8l4 4v14H6zM14 3v4h4" /></svg>{b.file}
              </div>
              <button type="button" onClick={() => showToast(b.template)} style={{ ...outlineBtn, marginLeft: 'auto', padding: '12px 18px', fontSize: 13 }}>{b.template}</button>
              <button type="button" onClick={() => setBulkStep(s => Math.min(3, s + 1))} style={{ ...primaryBtn, padding: '13px 20px', fontSize: 13 }}>{common.next}</button>
            </div>
          </div>
        )}

        {bulkStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card, padding: 22 }}>
              <div style={{ ...sectionTitle, marginBottom: 16 }}>{b.validationT}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
                {(b.checks || []).map((c, i) => (
                  <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div aria-hidden="true" style={{ width: 5, height: 26, background: checkAccents[i] || C.blue, transform: 'skewY(-14deg)', borderRadius: 2, flex: '0 0 auto' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: C.textSecondary }}>{c.l}</div>
                      <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, marginTop: 4 }}>{c.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <span style={sectionTitle}>{b.errorsT}</span>
                <button type="button" style={{ ...linkBtn, marginLeft: 'auto' }} onClick={() => showToast(b.downloadErrors)}>{b.downloadErrors}</button>
              </div>
              {(b.errors || []).map((e, i) => (
                <div key={i} style={{ ...rowDivider, padding: '15px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 13, color: C.red, flex: '0 0 90px' }}>{e.row}</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{e.msg}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setBulkStep(s => Math.max(0, s - 1))} style={{ ...outlineBtn, padding: '14px 20px' }}>{common.back}</button>
              <button type="button" onClick={() => setBulkStep(s => Math.min(3, s + 1))} style={{ ...primaryBtn, marginLeft: 'auto' }}>{common.next}</button>
            </div>
          </div>
        )}

        {bulkStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={card}>
              <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
                <div style={sectionTitle}>{b.previewT}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 6 }}>{b.previewNote}</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 760 }}>
                  <div style={{ ...colHead, gridTemplateColumns: cols }}>{(b.cols || []).map((c, i) => <span key={i}>{c}</span>)}</div>
                  {(b.preview || []).map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '14px 22px', ...rowDivider, alignItems: 'center', fontSize: 13 }}>
                      <span style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}>{p.r}</span>
                      <span>{p.to}</span>
                      <span style={{ color: C.text }}>{p.dest}</span>
                      <span style={{ color: C.text }}>{p.svc}</span>
                      <span style={{ color: C.text }}>{p.w}</span>
                      <Pill justify="start" tone={p.ok ? DOC_TONE.paid : DOC_TONE.overdue}>{p.ok ? common.approved : (common.required || '').replace('.', '')}</Pill>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setBulkStep(s => Math.max(0, s - 1))} style={{ ...outlineBtn, padding: '14px 20px' }}>{common.back}</button>
              <button type="button" onClick={() => { setBulkStep(3); showToast(b.confirmed); }} style={{ ...primaryBtn, marginLeft: 'auto' }}>{b.confirmBtn}</button>
            </div>
          </div>
        )}

        {bulkStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card, padding: 26 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, border: '1px solid #C6E6D4', background: '#F1FAF5', borderRadius: 12, fontSize: 14, lineHeight: 1.6, color: C.greenText }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.9} style={{ flex: '0 0 auto' }}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></svg>{b.confirmed}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => go('shipments')} style={{ ...primaryBtn, padding: '14px 20px' }}>{(biz.nav || {}).shipments}</button>
                <button type="button" onClick={() => setBulkStep(0)} style={{ ...outlineBtn, padding: '14px 20px' }}>{b.title}</button>
              </div>
            </div>
            <div style={card}>
              <div style={panelHead}>{b.historyT}</div>
              {(b.history || []).map((h, i) => (
                <div key={i} style={{ ...rowDivider, padding: '15px 22px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 13 }}>{h.f}</span>
                  <span style={{ fontSize: 13, color: C.text }}>{h.d}</span>
                  <span style={{ fontSize: 13, color: C.text }}>{h.n}</span>
                  <span style={{ marginLeft: 'auto' }}><Pill tone={DOC_TONE.paid}>{h.st}</Pill></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const recurringScreen = () => {
    const r = biz.rec || { f: {} };
    const cols = '.8fr 1.1fr 1.3fr 1fr 1fr .8fr .9fr';
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 20 }}>
          <H1>{r.title}</H1>
          <button type="button" onClick={() => setRecFormOpen(v => !v)} style={{ ...primaryBtn, marginLeft: 'auto', padding: '13px 20px', fontSize: 13 }}>{r.create}</button>
        </div>
        {recFormOpen && (
          <div style={{ ...card, padding: 24, marginBottom: 16 }}>
            <div style={eyebrow}>{r.freqT}</div>
            <div style={{ marginBottom: 18 }}><Chips items={r.freq} selected={recFreq} onPick={setRecFreq} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {['pickup', 'dest', 'svc', 'window', 'contact'].map(k => (
                <label key={k}>
                  <span style={labelStyle}>{r.f[k]}</span>
                  <input placeholder={r.f[k]} style={field(false)} />
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="button" onClick={() => setRecFormOpen(false)} style={{ ...outlineBtn, padding: '14px 20px' }}>{common.cancel}</button>
              <button type="button" onClick={() => { setRecFormOpen(false); showToast(common.savedOk); }} style={{ ...primaryBtn, marginLeft: 'auto' }}>{common.save}</button>
            </div>
          </div>
        )}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 880 }}>
              <div style={{ ...colHead, gridTemplateColumns: cols }}>
                {(r.cols || []).map((c, i) => <span key={i}>{c}</span>)}<span />
              </div>
              {(r.rows || []).map((row, i) => {
                const active = recPaused[i] != null ? !recPaused[i] : i !== 2;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '15px 22px', ...rowDivider, alignItems: 'center', fontSize: 13 }}>
                    <span style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}>{row.id}</span>
                    <span style={{ color: C.text }}>{row.freq}</span>
                    <span style={{ color: C.text }}>{row.from}</span>
                    <span style={{ color: C.text }}>{row.to}</span>
                    <span style={{ color: C.text }}>{row.w}</span>
                    <Pill justify="start" tone={active ? DOC_TONE.paid : DOC_TONE.pending}>{active ? common.active : common.pause}</Pill>
                    <div style={{ display: 'flex', gap: 12, justifySelf: 'end', whiteSpace: 'nowrap' }}>
                      <button type="button" style={linkBtn} onClick={() => { setRecPaused(p => ({ ...p, [i]: active })); showToast(common.savedOk); }}>{active ? common.pause : common.resume}</button>
                      <button type="button" style={{ ...linkBtn, color: C.textSecondary }} onClick={() => showToast(`${common.edit} · ${row.id}`)}>{common.edit}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={card}>
          <div style={panelHead}>{r.historyT}</div>
          {(r.history || []).map((h, i) => (
            <div key={i} style={{ ...rowDivider, padding: '15px 22px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: C.text }}>{h.d}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{h.n}</span>
              <span style={{ marginLeft: 'auto' }}><Pill tone={i === 2 ? DOC_TONE.pending : DOC_TONE.paid}>{h.st}</Pill></span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const locationsScreen = () => {
    const l = biz.loc || {};
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 20 }}>
          <H1>{l.title}</H1>
          <button type="button" onClick={() => showToast(l.add)} style={{ ...outlineBtn, marginLeft: 'auto', padding: '13px 20px', fontSize: 13 }}>{l.add}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(l.rows || []).map((row, i) => {
            const active = inactive[i] != null ? !inactive[i] : row.active;
            return (
              <div key={i} style={{ ...card, padding: 22 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, margin: 0, flex: 1 }}>{row.n}</h2>
                  <Pill tone={{ bg: C.bg, fg: C.text }}>{(l.types || {})[row.type]}</Pill>
                  <Pill tone={active ? DOC_TONE.paid : { bg: C.bg, fg: C.textSecondary }}>{active ? common.active : common.inactive}</Pill>
                </div>
                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{row.addr}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.divider}`, fontSize: 13 }}>
                  <div style={{ color: C.text }}>{row.c}</div>
                  <div style={{ color: C.text }}>{row.h}</div>
                  <div><span style={{ color: C.textSecondary }}>{l.instructionsT}: </span>{row.ins}</div>
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 16 }}>
                  <button type="button" style={linkBtn} onClick={() => { setInactive(p => ({ ...p, [i]: active })); showToast(common.savedOk); }}>{active ? common.pause : common.resume}</button>
                  <button type="button" style={{ ...linkBtn, color: C.textSecondary }} onClick={() => showToast(`${common.edit} · ${row.n}`)}>{common.edit}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const teamScreen = () => {
    const tm = biz.team || { f: {} };
    const cols = '1.4fr 1.1fr 1.1fr 1fr .8fr 1fr';
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 20 }}>
          <H1>{tm.title}</H1>
          <button type="button" onClick={() => { setInviteOpen(v => !v); setInviteError(false); }} style={{ ...primaryBtn, marginLeft: 'auto', padding: '13px 20px', fontSize: 13 }}>{tm.invite}</button>
        </div>
        {inviteOpen && (
          <div style={{ ...card, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <label>
                <span style={labelStyle}>{tm.f.email}</span>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="nombre@empresa.com" style={field(inviteError)} />
              </label>
              <label>
                <span style={labelStyle}>{tm.f.loc}</span>
                <input placeholder={tm.f.loc} style={field(false)} />
              </label>
            </div>
            <div>
              <div style={eyebrow}>{tm.f.role}</div>
              <Chips items={tm.roles} selected={inviteRole} onPick={setInviteRole} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {['finance', 'ship'].map((k, i) => (
                <CheckBox key={k} on={!!inviteRestrict[i]} label={tm.f[k]} onClick={() => setInviteRestrict(p => ({ ...p, [i]: !p[i] }))} />
              ))}
            </div>
            {inviteError && <InlineError text={(t.common || {}).invalidEmail} />}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setInviteOpen(false)} style={{ ...outlineBtn, padding: '14px 20px' }}>{common.cancel}</button>
              <button type="button" style={{ ...primaryBtn, marginLeft: 'auto' }}
                onClick={() => {
                  if (!/\S+@\S+\.\S+/.test(inviteEmail)) return setInviteError(true);
                  setInviteOpen(false);
                  setInviteEmail('');
                  setInviteError(false);
                  showToast(tm.invited);
                }}>{common.invite}</button>
            </div>
          </div>
        )}
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 900 }}>
              <div style={{ ...colHead, gridTemplateColumns: cols }}>
                {(tm.cols || []).map((c, i) => <span key={i}>{c}</span>)}<span />
              </div>
              {(tm.rows || []).map((r, i) => {
                const key = `t${i}`;
                const active = inactive[key] != null ? !inactive[key] : i !== 3;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '15px 22px', ...rowDivider, alignItems: 'center', fontSize: 13 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}>{r.n}</div>
                      <div style={{ fontSize: 12, color: C.textSecondary }}>{r.e}</div>
                    </div>
                    <span style={{ color: C.text }}>{(tm.roles || [])[r.role]}</span>
                    <span style={{ color: C.text }}>{r.loc}</span>
                    <span style={{ color: C.text }}>{r.last}</span>
                    <Pill justify="start" tone={active ? DOC_TONE.paid : DOC_TONE.pending}>{active ? common.active : tm.suspend}</Pill>
                    <div style={{ display: 'flex', gap: 12, justifySelf: 'end', whiteSpace: 'nowrap' }}>
                      <button type="button" style={linkBtn} onClick={() => { setInactive(p => ({ ...p, [key]: active })); showToast(common.savedOk); }}>{active ? tm.suspend : tm.reactivate}</button>
                      <button type="button" style={{ ...linkBtn, color: C.red }} onClick={() => showToast(`${tm.removeAccess} · ${r.n}`)}>{tm.removeAccess}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const rolesScreen = () => {
    const p = biz.perm || {};
    const cols = '1.6fr repeat(5,1fr)';
    return (
      <div>
        <H1 style={{ marginBottom: 8 }}>{p.title}</H1>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: C.text }}>{p.note}</p>
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 880 }}>
              <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '14px 22px', borderBottom: `1px solid ${C.border}`, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: C.textSecondary }}>
                <span />
                {((biz.team && biz.team.roles) || []).map((r, i) => <span key={i}>{r}</span>)}
              </div>
              {(p.items || []).map((l, pi) => (
                <div key={pi} style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '13px 22px', ...rowDivider, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{l}</span>
                  {(p.matrix || []).map((row, ri) => {
                    const ok = row[pi] === 1;
                    return (
                      <span key={ri} title={ok ? p.allowed : p.denied}
                        style={{ width: 22, height: 22, borderRadius: 6, background: ok ? 'rgba(19,122,69,.12)' : C.bg, color: ok ? C.greenText : C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                        {ok ? '✓' : '—'}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const reportsScreen = () => {
    const r = biz.rep || {};
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 20 }}>
          <H1>{r.title}</H1>
          <div style={{ marginLeft: 'auto' }}><Chips items={r.periods} selected={repPeriod} onPick={setRepPeriod} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16, marginBottom: 16 }}>
          {(r.cards || []).map((c, i) => (
            <div key={i} style={{ ...card, padding: 22 }}>
              <div style={eyebrow}>{c.l}</div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 26, letterSpacing: '-.02em' }}>{c.v}</div>
              <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 6 }}>{c.n}</div>
            </div>
          ))}
        </div>
        <div style={{ ...card, padding: 22, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div>
            <div style={sectionTitle}>{r.exportT}</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{r.exportNote}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
            <button type="button" onClick={() => showToast(`${common.pdf} · ${common.exportOk}`)} style={{ ...outlineBtn, padding: '13px 18px', fontSize: 13 }}>{common.pdf}</button>
            <button type="button" onClick={() => showToast(`${common.excel} · ${common.exportOk}`)} style={{ ...outlineBtn, padding: '13px 18px', fontSize: 13 }}>{common.excel}</button>
          </div>
        </div>
      </div>
    );
  };

  const billingScreen = () => {
    const b = biz.bill || { f: {}, values: {} };
    const fields = ['legal', 'ein', 'address', 'email', 'phone'];
    const facts = [{ l: b.methodT, v: b.method }, { l: b.termsT, v: b.terms }, { l: b.creditT, v: b.credit }];
    return (
      <div>
        <H1 style={{ marginBottom: 20 }}>{b.title}</H1>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card, padding: 24 }}>
              <div style={{ ...sectionTitle, marginBottom: 18 }}>{b.profileT}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {fields.map(k => (
                  <label key={k} style={{ gridColumn: `span ${k === 'address' ? 2 : 1}` }}>
                    <span style={labelStyle}>{b.f[k]}</span>
                    <input value={billEdits[k] != null ? billEdits[k] : (b.values[k] || '')} onChange={e => setBillEdits(p => ({ ...p, [k]: e.target.value }))} style={field(false)} />
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => showToast(common.savedOk)} style={{ ...primaryBtn, marginLeft: 'auto' }}>{common.save}</button>
              </div>
            </div>
            <div style={card}>
              <div style={panelHead}>{b.contactsT}</div>
              {(b.contacts || []).map((c, i) => (
                <div key={i} style={{ ...rowDivider, padding: '15px 22px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.n}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary }}>{c.r}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 13, color: C.text }}>{c.e}</span>
                </div>
              ))}
            </div>
            <div style={{ ...card, padding: 24 }}>
              <div style={{ ...sectionTitle, marginBottom: 14 }}>{b.notifT}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(b.notifs || []).map((l, i) => (
                  <CheckBox key={i} on={!!billNotifs[i]} label={l} onClick={() => setBillNotifs(p => ({ ...p, [i]: !p[i] }))} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: C.navy, borderRadius: 16, padding: 24, color: C.white }}>
              <div style={{ ...eyebrow, color: '#8FA8CC', marginBottom: 0 }}>{b.balanceT}</div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 32, letterSpacing: '-.02em', marginTop: 8 }}>{b.balance}</div>
              <button type="button" onClick={() => go('invoices')} style={{ ...primaryBtn, marginTop: 18, width: '100%', padding: 14 }}>{(biz.inv || {}).title}</button>
            </div>
            {facts.map((f, i) => (
              <div key={i} style={{ ...card, padding: 20 }}>
                <div style={{ ...eyebrow, marginBottom: 6 }}>{f.l}</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{f.v}</div>
              </div>
            ))}
            <div style={{ ...card, padding: 20 }}>
              <div style={{ ...eyebrow, marginBottom: 12 }}>{b.autopayT}</div>
              <button type="button" role="switch" aria-checked={autopay} onClick={() => { setAutopay(v => !v); showToast(common.savedOk); }}
                style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
                <span style={{ width: 44, height: 26, borderRadius: 100, background: autopay ? C.blue : C.border, position: 'relative', flex: '0 0 auto', transition: 'background .2s' }}>
                  <span style={{ position: 'absolute', top: 3, left: autopay ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: C.white, transition: 'left .2s' }} />
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{autopay ? b.autopayOn : b.autopayOff}</span>
              </button>
            </div>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ ...eyebrow, marginBottom: 8 }}>{b.taxT}</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: C.text }}>{b.taxNote}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const invoicesScreen = () => {
    const inv = biz.inv || {};
    const cols = '.9fr 1.2fr 1fr .8fr .9fr 1fr';
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 20 }}>
          <H1>{inv.title}</H1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 'auto', alignItems: 'center' }}>
            <Chips items={inv.periods} selected={invPeriod} onPick={setInvPeriod} />
            <button type="button" onClick={() => showToast(inv.statement)} style={{ ...outlineBtn, padding: '11px 16px', fontSize: 13 }}>{inv.statement}</button>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}><Chips items={inv.tabs} selected={invTab} onPick={setInvTab} /></div>
        <div style={card}>
          {invRows.length === 0 && <div style={{ padding: '56px 22px', textAlign: 'center', fontSize: 14, color: C.text }}>{common.empty}</div>}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 820 }}>
              <div style={{ ...colHead, gridTemplateColumns: cols }}>{(inv.cols || []).map((c, i) => <span key={i}>{c}</span>)}</div>
              {invRows.map((r, i) => {
                const st = disputed[r.id] ? 'disputed' : r.st;
                const tone = DOC_TONE[st] || DOC_TONE.adjust;
                const payable = st === 'pending' || st === 'overdue';
                const primaryLabel = payable ? inv.pay : st === 'paid' ? inv.receipt : common.view;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '15px 22px', ...rowDivider, alignItems: 'center', fontSize: 13 }}>
                    <span style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}>{r.id}</span>
                    <span style={{ color: C.text }}>{r.ship}</span>
                    <span style={{ color: C.text }}>{r.d}</span>
                    <span style={{ fontWeight: 600 }}>{r.a}</span>
                    <Pill justify="start" tone={tone}>{(inv.statuses || {})[st]}</Pill>
                    <div style={{ display: 'flex', gap: 12, justifySelf: 'end', whiteSpace: 'nowrap' }}>
                      <button type="button" style={linkBtn} onClick={() => showToast(`${payable ? inv.pay : inv.receipt} · ${r.id}`)}>{primaryLabel}</button>
                      {payable && (
                        <button type="button" style={{ ...linkBtn, color: C.textSecondary }}
                          onClick={() => { setDisputed(p => ({ ...p, [r.id]: true })); showToast(inv.disputed); }}>{inv.dispute}</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const screens = {
    dash: dashScreen, shipments: shipmentsScreen, bulk: bulkScreen, recurring: recurringScreen,
    locations: locationsScreen, team: teamScreen, roles: rolesScreen, reports: reportsScreen,
    billing: billingScreen, invoices: invoicesScreen
  };

  const navButton = (k, big) => {
    const on = screen === k;
    return (
      <button key={k} type="button" onClick={() => go(k)}
        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: big ? 13 : '11px 13px', border: 'none', borderRadius: 10, background: on ? C.navy : 'transparent', color: on ? C.white : C.text, fontSize: big ? 15 : 14, fontWeight: on ? 600 : 500, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
        <NavIcon spec={NAV_ICONS[k]} color={on ? C.white : C.textSecondary} />
        <span>{(biz.nav || {})[k]}</span>
      </button>
    );
  };

  const langButtons = big => LANGS.map(code => {
    const on = code === lang;
    return (
      <button key={code} type="button" onClick={() => pickLang(code)}
        style={{ flex: 1, padding: big ? '12px 0' : '9px 0', border: `1px solid ${on ? C.navy : C.border}`, borderRadius: big ? 10 : 9, background: on ? C.navy : C.white, color: on ? C.white : C.text, fontSize: big ? 13 : 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
        {(all[code] || {}).label || code}
      </button>
    );
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.navy, fontFamily: FONT_BODY }}>
      <aside style={{ width: 270, flex: '0 0 270px', background: C.white, borderRight: `1px solid ${C.border}`, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', gap: 12, alignItems: 'center', background: C.bg }}>
          <span style={{ width: 36, height: 36, borderRadius: 9, background: C.navy, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, flex: '0 0 auto' }}>{(account?.initials) || 'CB'}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account?.name || shell.company}</div>
            <div style={{ fontSize: 11, color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account?.email || shell.account}</div>
          </div>
        </div>
        {NAV_GROUPS.map(g => (
          <div key={g.key}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, margin: '0 6px 8px' }}>{(shell.section || {})[g.key]}</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{g.keys.map(k => navButton(k, false))}</nav>
          </div>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', gap: 4 }}>{langButtons(false)}</div>
          <button type="button" onClick={onLogout || undefined} style={{ padding: 11, border: 'none', borderRadius: 10, background: 'none', color: C.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{shell.signout}</button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 20 }}>
          <label style={{ flex: '1 1 300px', maxWidth: 460, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 11, background: C.bg, cursor: 'text' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth={1.8}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.5-4.5" /></svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={shell.searchPh} aria-label={common.search}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: C.navy, font: 'inherit' }} />
          </label>
          <button type="button" onClick={() => go('bulk')} style={{ ...primaryBtn, marginLeft: 'auto', padding: '12px 18px', fontSize: 13, whiteSpace: 'nowrap' }}>{(biz.nav || {}).bulk}</button>
          <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label="Menu"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, border: `1.5px solid ${C.border}`, borderRadius: 11, background: C.white, cursor: 'pointer', color: C.navy, flex: '0 0 auto' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </header>

        {menuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,27,69,.5)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 'min(320px,88vw)', height: '100%', background: C.white, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 15 }}>TR3SLOG</span>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label={(t.common || {}).close}
                  style={{ marginLeft: 'auto', width: 40, height: 40, border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.white, cursor: 'pointer', color: C.navy, fontSize: 18, lineHeight: 1 }}>✕</button>
              </div>
              {NAV_GROUPS.map(g => (
                <div key={g.key}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, margin: '0 0 8px' }}>{(shell.section || {})[g.key]}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{g.keys.map(k => navButton(k, true))}</div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>{langButtons(true)}</div>
            </div>
          </div>
        )}

        <main style={{ flex: 1, padding: 28 }}>{(screens[screen] || dashScreen)()}</main>
      </div>

      {toast && (
        <div role="status" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 95, maxWidth: 380, display: 'flex', gap: 12, alignItems: 'flex-start', background: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.green}`, borderRadius: 14, padding: '18px 20px', boxShadow: '0 24px 60px rgba(0,27,69,.22)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.9} style={{ flex: '0 0 auto' }}>
            <circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" />
          </svg>
          <span style={{ fontSize: 14, lineHeight: 1.6 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
