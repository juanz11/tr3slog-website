/**
 * admin.jsx — TR3SLOG platform administration console (screens 341–348)
 *
 * React source export of "TR3SLOG Admin Console.dc.html".
 * Self-contained: no CSS files, no UI library, no build-time config.
 * Inline styles use the TR3SLOG tokens (navy #001B45, electric blue #087CF0,
 * gold #D99A00 as accent only, light background #EEF4FC).
 *
 * i18n: reads window.TR3S_I18N[lang].adm — load i18n/adm.en.js, adm.es.js and
 * adm.zh-CN.js before mounting, or pass a `dict` prop with the same shape.
 *
 * Placeholder data lives in the i18n packs (values rendered as "——").
 * No backend is connected. Services marked "not implemented" must stay that way.
 *
 * Usage:  <AdminConsole defaultRole="sysadmin" startScreen="adash" />
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const LANGS = ['en', 'es', 'zh-CN'];
export const LANG_STORE = 'tr3slog.lang';
export const ROLES = ['sysadmin', 'secadmin', 'compliance', 'opsmgr', 'finance', 'support'];

const C = {
  navy: '#001B45',
  blue: '#087CF0',
  blueDark: '#0768C9',
  gold: '#D99A00',
  white: '#FFFFFF',
  bg: '#EEF4FC',
  border: '#DCE6F5',
  divider: '#E3EBF7',
  text: '#10233F',
  textSecondary: '#6C82A6',
  textMuted: '#8B9DBA'
};

const TONE = {
  ok: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  warn: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  bad: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
  info: { bg: 'rgba(8,124,240,.1)', fg: C.blueDark },
  neutral: { bg: C.bg, fg: C.text }
};

const HEAD = `Montserrat,'Noto Sans SC',sans-serif`;
const PILL_HDR = { es: 'Estado', en: 'Status', 'zh-CN': '状态' };
const VIEW_STATES = ['data', 'loading', 'empty', 'error', 'offline'];

/* Screen definitions — do not rename keys: they are the route identifiers. */
export const PAGES = {
  adash: { roles: ['sysadmin', 'secadmin', 'compliance', 'opsmgr'], blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'health'], ['table', 'activity'], ['note', 'note']] },
  users: { roles: ['sysadmin', 'secadmin'], sensitive: true, blocks: [['chips', 'filters'], ['table', 'list'], ['form', 'form'], ['toggles', 'toggles'], ['note', 'note']] },
  roles: { roles: ['sysadmin', 'secadmin', 'compliance'], sensitive: true, blocks: [['chips', 'filters'], ['table', 'matrix'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  audit: { roles: ['sysadmin', 'secadmin', 'compliance', 'finance'], sensitive: true, blocks: [['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  integr: { roles: ['sysadmin', 'secadmin', 'opsmgr'], blocks: [['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  flags: { roles: ['sysadmin', 'opsmgr'], blocks: [['toggles', 'toggles'], ['table', 'list'], ['note', 'note']] },
  keys: { roles: ['sysadmin', 'secadmin'], sensitive: true, blocks: [['chips', 'filters'], ['table', 'list'], ['form', 'form'], ['table', 'hist'], ['note', 'note']] },
  maint: { roles: ['sysadmin'], sensitive: true, blocks: [['stats', 'stats', { cols: 4 }], ['steps', 'steps'], ['panels', 'panels', { cols: 2 }], ['table', 'hist'], ['note', 'note']] }
};

export const NAV_GROUPS = [
  { key: 'platform', keys: ['adash', 'integr', 'flags'] },
  { key: 'access', keys: ['users', 'roles', 'audit'] },
  { key: 'system', keys: ['keys', 'maint'] }
];

export const NAV_ICONS = {
  adash: 'M4 19V5M4 19h16M9 16V9M13 16v-4M17 16v-7',
  users: 'circle:9,8,3.2|M3 20c0-3.2 2.7-5 6-5s6 1.8 6 5|M17 15c2 .6 3.4 2.2 3.4 4.6|circle:17.5,9,2.6',
  roles: 'M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z|M9.5 12l1.8 1.8L15 10',
  audit: 'M6 3h9l4 4v14H6z|M9 11h7M9 15h7M9 7h4',
  integr: 'circle:6,12,2.6|circle:18,6,2.6|circle:18,18,2.6|M8.4 11l7.2-4M8.4 13l7.2 4',
  flags: 'M6 21V4h11l-2 3.5L17 11H6',
  keys: 'circle:8,12,3.4|M11.4 12H21M17 12v3.4M19.5 12v2.4',
  maint: 'M4 7h16v11H4z|M4 11h16|M9 15h6|M9 4v3M15 4v3'
};

function NavIcon({ spec, color }) {
  const parts = (spec || '').split('|');
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
      {parts.map((p, i) => {
        if (p.indexOf('circle:') === 0) {
          const [cx, cy, r] = p.slice(7).split(',');
          return <circle key={i} cx={cx} cy={cy} r={r} />;
        }
        return <path key={i} d={p} />;
      })}
    </svg>
  );
}

/* Brand motif: paired skewed bars (gold + blue). Accent use only. */
function Motif({ w = 24, h = 5, gap = 4 }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap, marginBottom: 14 }}>
      <span style={{ width: w, height: h, background: C.gold, transform: 'skewX(-24deg)' }} />
      <span style={{ width: Math.round(w * 0.38), height: h, background: C.blue, transform: 'skewX(-24deg)' }} />
    </div>
  );
}

const cardStyle = { background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' };
const sectionTitleStyle = { fontFamily: HEAD, fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' };
const ghostBtn = { padding: '9px 14px', border: `1.5px solid ${C.border}`, borderRadius: 9, background: C.white, color: C.blueDark, fontSize: 12, fontWeight: 600, cursor: 'pointer' };
const primaryBtn = { padding: '14px 22px', border: 'none', borderRadius: 11, background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: 'pointer' };

function StatsBlock({ items = [], cols = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 14 }}>
      {items.map((s, i) => (
        <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <Motif w={20} h={4} />
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, lineHeight: 1.4, minHeight: 34 }}>{s.k}</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 28, letterSpacing: '-.02em', color: C.navy, margin: '6px 0 4px' }}>{s.v}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.divider}` }}>{s.d}</div>
        </div>
      ))}
    </div>
  );
}

function ChipsBlock({ label, items = [], selected = 0, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.textMuted, marginRight: 4 }}>{label}</span>
      {items.map((c, i) => {
        const on = selected === i;
        return (
          <button key={i} type="button" aria-pressed={on} onClick={() => onPick(i)}
            style={{ padding: '9px 14px', border: `1.5px solid ${on ? C.navy : C.border}`, borderRadius: 100, background: on ? C.navy : C.white, color: on ? C.white : C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {c}
          </button>
        );
      })}
    </div>
  );
}

function TableBlock({ data = {}, lang, view, common, onToast, onRetry }) {
  const cols = data.cols || [];
  const rows = data.rows || [];
  const hasPill = rows.some(r => !!r.pill);
  const header = hasPill && cols.length <= rows.reduce((m, r) => Math.max(m, (r.c || []).length), 0)
    ? cols.concat([PILL_HDR[lang] || 'Status'])
    : cols;

  return (
    <div style={cardStyle}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={sectionTitleStyle}>{data.t}</span>
        {data.exp && (
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="button" style={ghostBtn} onClick={() => onToast(`${data.t} · PDF · ${common.exported}`)}>PDF</button>
            <button type="button" style={ghostBtn} onClick={() => onToast(`${data.t} · Excel · ${common.exported}`)}>Excel</button>
          </span>
        )}
      </div>

      {(view === 'data' || view === 'offline') && (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                {header.map((c, i) => (
                  <th key={i} scope="col" style={{ textAlign: 'left', padding: '13px 22px', background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary, whiteSpace: 'nowrap' }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => {
                const tone = TONE[r.st] || TONE.neutral;
                return (
                  <tr key={ri}>
                    {(r.c || []).map((cell, ci) => (
                      <td key={ci} style={{ padding: '14px 22px', borderTop: `1px solid ${C.divider}`, fontSize: 13, color: ci === 0 ? C.navy : C.text, fontWeight: ci === 0 ? 600 : 400, whiteSpace: 'nowrap' }}>{cell}</td>
                    ))}
                    {r.pill && (
                      <td style={{ padding: '14px 22px', borderTop: `1px solid ${C.divider}`, whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', padding: '5px 11px', borderRadius: 100, background: tone.bg, color: tone.fg, fontSize: 12, fontWeight: 600 }}>{r.pill}</span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {view === 'loading' && (
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }} aria-busy="true">
          {['92%', '78%', '86%', '64%'].map((w, i) => (
            <div key={i} style={{ height: 16, borderRadius: 6, background: C.bg, width: w }} />
          ))}
        </div>
      )}

      {view === 'empty' && (
        <div style={{ padding: '44px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{common.empty}</div>
          <div style={{ fontSize: 13, color: C.textSecondary }}>{common.emptyHint}</div>
        </div>
      )}

      {view === 'error' && (
        <div role="alert" style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#A93226' }}>{common.errorT}</div>
          <div style={{ fontSize: 13, color: C.textSecondary }}>{common.errorHint}</div>
          <button type="button" onClick={onRetry} style={{ ...primaryBtn, padding: '11px 18px', fontSize: 13, marginTop: 4 }}>{common.retry}</button>
        </div>
      )}
    </div>
  );
}

function PanelsBlock({ items = [], cols = 2 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 16, alignItems: 'start' }}>
      {items.map((p, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ ...sectionTitleStyle, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>{p.t}</div>
          {(p.items || []).map((kv, j) => (
            <div key={j} style={{ padding: '13px 20px', borderTop: `1px solid ${C.divider}`, display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ flex: 1, fontSize: 12, color: C.textSecondary }}>{kv.k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{kv.v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function FormBlock({ data = {}, common, invalid, onSubmit }) {
  return (
    <div style={{ ...cardStyle, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={sectionTitleStyle}>{data.t}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {(data.fields || []).map((f, i) => (
          <div key={i} style={{ gridColumn: `span ${f.span || 1}` }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 8 }}>
              {f.l}
              <input placeholder={f.ph}
                style={{ width: '100%', marginTop: 8, padding: '14px 15px', border: `1.5px solid ${invalid && i === 0 ? '#E0A0A0' : C.border}`, borderRadius: 11, background: C.bg, fontSize: 15, color: C.navy, outline: 'none', font: 'inherit', fontWeight: 400, letterSpacing: 'normal', textTransform: 'none' }} />
            </label>
          </div>
        ))}
      </div>
      {invalid && <div role="alert" style={{ fontSize: 13, color: '#A93226', fontWeight: 600 }}>{common.required}</div>}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" onClick={onSubmit} style={primaryBtn}>{data.submit || common.save}</button>
        <button type="button" style={{ ...primaryBtn, background: C.white, border: `1.5px solid ${C.border}`, color: C.text }}>{common.cancel}</button>
      </div>
    </div>
  );
}

function TogglesBlock({ data = {}, state, common, onToggle }) {
  const items = data.items || [];
  return (
    <div style={cardStyle}>
      <div style={{ ...sectionTitleStyle, padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>{data.t}</div>
      {items.map((it, i) => {
        const on = state[i] === undefined ? !!it.on : state[i];
        return (
          <div key={i} style={{ padding: '14px 22px', borderTop: `1px solid ${C.divider}`, display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{it.k}</span>
            <span style={{ fontSize: 12, color: C.textSecondary }}>{on ? common.active : common.inactive}</span>
            <button type="button" role="switch" aria-checked={on} aria-label={it.k} onClick={() => onToggle(i, !on)}
              style={{ width: 44, height: 26, border: 'none', borderRadius: 100, background: on ? C.blue : C.border, position: 'relative', cursor: 'pointer', flex: '0 0 auto' }}>
              <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: C.white, transition: 'left .16s ease' }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function StepsBlock({ data = {}, stage = 0, onAdvance }) {
  const items = data.items || [];
  return (
    <div style={{ ...cardStyle, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={sectionTitleStyle}>{data.t}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
        {items.map((label, i) => {
          const done = i < stage, current = i === stage;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#137A45' : current ? C.gold : C.bg, color: done || current ? C.white : C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flex: '0 0 auto' }}>
                {done ? '✓' : i + 1}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: done || current ? C.navy : C.textMuted }}>{label}</span>
            </div>
          );
        })}
      </div>
      <div>
        <button type="button" onClick={onAdvance}
          style={{ padding: '13px 20px', border: `1.5px solid ${C.navy}`, borderRadius: 11, background: C.white, color: C.navy, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {data.action}
        </button>
      </div>
    </div>
  );
}

function NoteBlock({ text }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', border: `1px dashed ${C.border}`, background: C.bg, borderRadius: 14, padding: '16px 18px' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blueDark} strokeWidth={1.8} style={{ flex: '0 0 auto', marginTop: 1 }}>
        <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.8v.1" />
      </svg>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: '#25456E', textWrap: 'pretty' }}>{text}</p>
    </div>
  );
}

export default function AdminConsole({ defaultRole = 'sysadmin', startScreen = 'adash', dict = null, lang: langProp = null }) {
  const [lang, setLang] = useState(langProp || 'es');
  const [screen, setScreen] = useState(PAGES[startScreen] ? startScreen : 'adash');
  const [role, setRole] = useState(ROLES.indexOf(defaultRole) >= 0 ? defaultRole : 'sysadmin');
  const [view, setView] = useState('data');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chips, setChips] = useState({});
  const [toggles, setToggles] = useState({});
  const [stage, setStage] = useState({ maint: 2 });
  const [formErr, setFormErr] = useState({});
  const [toast, setToast] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    if (langProp) return;
    let saved = null;
    try { saved = window.localStorage.getItem(LANG_STORE); } catch (e) { /* storage unavailable */ }
    const nl = (navigator.language || '').toLowerCase();
    const guess = nl.indexOf('zh') === 0 ? 'zh-CN' : nl.indexOf('en') === 0 ? 'en' : 'es';
    setLang(LANGS.indexOf(saved) >= 0 ? saved : guess);
  }, [langProp]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => () => clearTimeout(toastRef.current), []);

  const pickLang = useCallback(code => {
    try { window.localStorage.setItem(LANG_STORE, code); } catch (e) { /* storage unavailable */ }
    setLang(code);
    setMenuOpen(false);
  }, []);

  const showToast = useCallback(text => {
    setToast(text);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 4500);
  }, []);

  const go = useCallback(next => {
    setScreen(next);
    setMenuOpen(false);
    setView('data');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const all = dict || (typeof window !== 'undefined' ? window.TR3S_I18N : null) || {};
  const t = all[lang] || all.es || all.en || {};
  const f = t.adm || {};
  const shell = f.shell || { states: {}, roles: {}, section: {} };
  const common = useMemo(() => ({ active: 'Active', inactive: 'Inactive', ...(f.common || {}) }), [f.common]);
  const nav = f.nav || {};

  const meta = PAGES[screen] || { roles: ROLES, blocks: [] };
  const page = f[screen] || {};
  const allowed = meta.roles.indexOf(role) >= 0;

  const renderBlock = (def, i) => {
    const [type, key, opts = {}] = def;
    const data = page[key] || {};
    const stateKey = `${screen}:${key}`;

    switch (type) {
      case 'stats':
        return <StatsBlock key={i} items={data} cols={opts.cols || 4} />;
      case 'chips':
        return <ChipsBlock key={i} label={common.filters} items={data} selected={chips[stateKey] || 0} onPick={idx => setChips(p => ({ ...p, [stateKey]: idx }))} />;
      case 'table':
        return <TableBlock key={i} data={data} lang={lang} view={view} common={common} onToast={showToast} onRetry={() => setView('data')} />;
      case 'panels':
        return <PanelsBlock key={i} items={data} cols={opts.cols || 2} />;
      case 'form':
        return <FormBlock key={i} data={data} common={common} invalid={!!formErr[stateKey]}
          onSubmit={() => { setFormErr(p => ({ ...p, [stateKey]: false })); showToast(data.ok || common.exported); }} />;
      case 'toggles':
        return <TogglesBlock key={i} data={data} common={common} state={toggles[stateKey] || {}}
          onToggle={(idx, val) => setToggles(p => ({ ...p, [stateKey]: { ...(p[stateKey] || {}), [idx]: val } }))} />;
      case 'steps':
        return <StepsBlock key={i} data={data} stage={stage[screen] || 0}
          onAdvance={() => { setStage(p => ({ ...p, [screen]: Math.min((data.items || []).length - 1, (p[screen] || 0) + 1) })); showToast(data.ok); }} />;
      case 'note':
        return <NoteBlock key={i} text={data || page.note} />;
      default:
        return null;
    }
  };

  const navButton = (k, big) => {
    const on = screen === k;
    return (
      <button key={k} type="button" onClick={() => go(k)}
        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: big ? 13 : '11px 13px', border: 'none', borderRadius: 10, background: on ? C.navy : 'transparent', color: on ? C.white : C.text, fontSize: big ? 15 : 14, fontWeight: on ? 600 : 500, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
        <NavIcon spec={NAV_ICONS[k]} color={on ? C.white : C.textSecondary} />
        <span>{nav[k] || k}</span>
      </button>
    );
  };

  const langButtons = big => LANGS.map(code => {
    const on = code === lang;
    return (
      <button key={code} type="button" onClick={() => pickLang(code)}
        style={{ flex: 1, padding: big ? '12px 0' : '9px 0', border: `1px solid ${on ? C.navy : C.border}`, borderRadius: big ? 10 : 9, background: on ? C.navy : C.white, color: on ? C.white : C.text, fontSize: big ? 13 : 12, fontWeight: 600, cursor: 'pointer' }}>
        {(all[code] || {}).label || code}
      </button>
    );
  });

  const roleSelect = big => (
    <select value={role} onChange={e => setRole(e.target.value)} aria-label={shell.roleT}
      style={{ width: '100%', padding: big ? 12 : '11px 12px', border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.bg, fontSize: big ? 14 : 13, color: C.navy, outline: 'none', font: 'inherit' }}>
      {ROLES.map(r => <option key={r} value={r}>{(shell.roles || {})[r] || r}</option>)}
    </select>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.navy, fontFamily: `Inter,'Noto Sans SC',system-ui,sans-serif` }}>
      <aside style={{ width: 272, flex: '0 0 272px', background: C.white, borderRight: `1px solid ${C.border}`, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', gap: 12, alignItems: 'center', background: C.bg }}>
          <span style={{ width: 36, height: 36, borderRadius: 9, background: C.navy, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 13, flex: '0 0 auto' }}>AD</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 13 }}>{shell.portal}</div>
            <div style={{ fontSize: 11, color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shell.account}</div>
          </div>
        </div>

        {NAV_GROUPS.map(g => (
          <div key={g.key}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, margin: '0 6px 8px' }}>{(shell.section || {})[g.key]}</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{g.keys.map(k => navButton(k, false))}</nav>
          </div>
        ))}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, margin: '0 2px 7px' }}>{shell.roleT}</div>
            {roleSelect(false)}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>{langButtons(false)}</div>
          <button type="button" style={{ padding: 11, border: 'none', borderRadius: 10, background: 'none', color: C.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{shell.signout}</button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, zIndex: 20 }}>
          <label style={{ flex: '1 1 260px', maxWidth: 420, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 11, background: C.bg, cursor: 'text' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth={1.8}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.5-4.5" /></svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={shell.searchPh} aria-label={common.search}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: C.navy, font: 'inherit' }} />
          </label>

          <div style={{ display: 'flex', gap: 3, padding: 3, border: `1.5px solid ${C.border}`, borderRadius: 11, background: C.bg }}>
            {VIEW_STATES.map(k => {
              const on = view === k;
              return (
                <button key={k} type="button" onClick={() => setView(k)}
                  style={{ padding: '8px 12px', border: 'none', borderRadius: 8, background: on ? C.white : 'transparent', color: on ? C.navy : C.textSecondary, fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
                  {(shell.states || {})[k] || k}
                </button>
              );
            })}
          </div>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', border: '1px solid rgba(217,154,0,.4)', borderRadius: 100, background: 'rgba(217,154,0,.08)', fontSize: 12, fontWeight: 600, color: '#8A6300', whiteSpace: 'nowrap' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold }} />{shell.demo}
          </span>

          <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label="Menu"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, border: `1.5px solid ${C.border}`, borderRadius: 11, background: C.white, cursor: 'pointer', color: C.navy, flex: '0 0 auto', marginLeft: 'auto' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </header>

        {menuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,27,69,.5)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 'min(320px,88vw)', height: '100%', background: C.white, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 15 }}>TR3SLOG</span>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label={common.cancel}
                  style={{ marginLeft: 'auto', width: 40, height: 40, border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.white, cursor: 'pointer', color: C.navy, fontSize: 18, lineHeight: 1 }}>✕</button>
              </div>
              {NAV_GROUPS.map(g => (
                <div key={g.key}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, margin: '0 0 8px' }}>{(shell.section || {})[g.key]}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{g.keys.map(k => navButton(k, true))}</div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, margin: '0 0 7px' }}>{shell.roleT}</div>
                {roleSelect(true)}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>{langButtons(true)}</div>
            </div>
          </div>
        )}

        {view === 'offline' && (
          <div role="status" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px 28px', background: 'rgba(217,154,0,.12)', borderBottom: '1px solid rgba(217,154,0,.35)', color: '#8A6300', fontSize: 13, fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.9} style={{ flex: '0 0 auto' }}>
              <path d="M3 8.5C6 6 9 5 12 5s6 1 9 3.5M6.5 12.5C8.4 11 10.2 10.3 12 10.3s3.6.7 5.5 2.2M12 18v.1" /><path d="M4 4l16 16" />
            </svg>
            <span>{common.offlineT}</span>
            <span style={{ fontWeight: 500, color: '#7A5900' }}>{common.offlineHint}</span>
          </div>
        )}

        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ maxWidth: 1220, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              {meta.sensitive && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 12, padding: '7px 13px', border: `1px solid ${C.border}`, borderRadius: 100, background: C.white, fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.text }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={1.9}><path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z" /></svg>
                  {common.restricted}
                </span>
              )}
              <Motif />
              <h1 style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: '0 0 8px', textWrap: 'pretty' }}>{page.title || ''}</h1>
              <p style={{ margin: 0, fontSize: 15, color: C.text, maxWidth: '70ch', lineHeight: 1.6, textWrap: 'pretty' }}>{page.sub || ''}</p>
            </div>

            {!allowed && (
              <div style={{ ...cardStyle, padding: '44px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                <span style={{ width: 56, height: 56, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth={1.7}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                </span>
                <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 19 }}>{common.deniedT}</div>
                <p style={{ margin: 0, fontSize: 14, color: C.text, maxWidth: '52ch', lineHeight: 1.6 }}>{common.deniedHint}</p>
              </div>
            )}

            {allowed && meta.blocks.map(renderBlock)}
          </div>
        </main>
      </div>

      {toast && (
        <div role="status" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 95, maxWidth: 380, display: 'flex', gap: 12, alignItems: 'flex-start', background: C.white, border: `1px solid ${C.border}`, borderLeft: '4px solid #137A45', borderRadius: 14, padding: '18px 20px', boxShadow: '0 24px 60px rgba(0,27,69,.22)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#137A45" strokeWidth={1.9} style={{ flex: '0 0 auto' }}>
            <circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" />
          </svg>
          <span style={{ fontSize: 14, lineHeight: 1.6 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
