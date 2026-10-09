/**
 * FinancePortal.jsx — finance & claims portal for TR3SLOG.
 * Adapted from the shared ModuleConsole of the design export for the
 * `finance` role. Renders the screens from "TR3SLOG Finance and Claims.dc.html".
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { C, FONT_HEAD, FONT_BODY, LANGS, LANG_STORE, VIEW_STATES, card } from '../business-portal/tokens.js';
import { renderBlock, RowDrawer, Motif, NavIcon } from '../business-portal/blocks.jsx';
import { loadStore, saveStore, knownCodes, stampClock, stampMinute } from '../business-portal/engine.js';

const SUPER_ROLES = ['sysadmin', 'super'];

export default function FinancePortal({ config, dict = null, lang: langProp = null, onLogout = null, onLangChange = null, account = null }) {
  const { pack, badge, roles: ROLES, pages: PAGES, navGroups: NAV_GROUPS, navIcons: NAV_ICONS } = config;

  const [lang, setLang] = useState(langProp || 'es');
  const [screen, setScreen] = useState(PAGES[config.defaultScreen] ? config.defaultScreen : Object.keys(PAGES)[0]);
  const [role, setRole] = useState(ROLES.indexOf(config.defaultRole) >= 0 ? config.defaultRole : ROLES[0]);
  const [view, setView] = useState('data');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chips, setChips] = useState({});
  const [chipTerm, setChipTerm] = useState({});
  const [dropped, setDropped] = useState({});
  const [toggles, setToggles] = useState({});
  const [stage, setStage] = useState(config.defaultStage || {});
  const [scan, setScan] = useState({});
  const [scanned, setScanned] = useState([]);
  const [formErr, setFormErr] = useState({});
  const [formBad, setFormBad] = useState(0);
  const [formVals, setFormVals] = useState({});
  const [records, setRecords] = useState({});
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    if (!langProp) {
      let saved = null;
      try { saved = window.localStorage.getItem(LANG_STORE); } catch (e) { /* ignore */ }
      const nl = (navigator.language || '').toLowerCase();
      const guess = nl.indexOf('zh') === 0 ? 'zh-CN' : nl.indexOf('en') === 0 ? 'en' : 'es';
      setLang(LANGS.indexOf(saved) >= 0 ? saved : guess);
    }
  }, [langProp]);

  useEffect(() => {
    if (langProp) setLang(langProp);
  }, [langProp]);

  const recKey = `tr3slog.${pack}.records`;
  const scanKey = `tr3slog.${pack}.scanned`;

  useEffect(() => {
    const kept = loadStore(recKey, null);
    if (kept) setRecords(kept);
    const queue = loadStore(scanKey, null);
    if (queue) setScanned(queue);
  }, [recKey, scanKey]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => () => clearTimeout(toastRef.current), []);

  const showToast = useCallback(text => {
    setToast(text);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 4500);
  }, []);

  const pickLang = useCallback(code => {
    try { window.localStorage.setItem(LANG_STORE, code); } catch (e) { /* ignore */ }
    if (onLangChange) onLangChange(code);
    setLang(code);
    setMenuOpen(false);
  }, [onLangChange]);

  const go = useCallback(next => {
    setScreen(next);
    setMenuOpen(false);
    setView('data');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const all = dict || (typeof window !== 'undefined' ? window.TR3S_I18N : null) || {};
  const t = all[lang] || all.es || all.en || {};
  const f = useMemo(() => t[pack] || {}, [t, pack]);
  const shell = f.shell || { states: {}, roles: {}, section: {} };
  const nav = f.nav || {};
  const common = useMemo(() => ({ active: 'Active', inactive: 'Inactive', ...(f.common || {}) }), [f.common]);

  const meta = PAGES[screen] || { roles: ROLES, blocks: [] };
  const page = f[screen] || {};
  const allowed = SUPER_ROLES.indexOf(role) >= 0 || meta.roles.indexOf(role) >= 0;

  const codes = useMemo(() => knownCodes(f), [f]);
  const base = t.common || {};

  const ctx = {
    page, screen, lang, view, common, base,
    mstat: f.mstat || {},
    chips, toggles, stage, scan, scanned, formErr, formBad, formVals, records,
    query,
    term: chipTerm[screen] || '',
    dropped: dropped[screen] || {},

    setChip: (k, i, term) => {
      setChips(p => ({ ...p, [k]: i }));
      setChipTerm(p => ({ ...p, [screen]: term || '' }));
    },

    dropRow: (idx, label) => {
      setDropped(p => ({ ...p, [screen]: { ...(p[screen] || {}), [idx]: true } }));
      showToast(`${base.removed || 'Removed'} · ${label || ''}`);
    },

    openRow: (blk, r) => setDrawer({
      t: blk.t,
      cols: (blk.cols || []).concat(r.pill ? ['Status'] : []),
      vals: (r.c || []).concat(r.pill ? [r.pill] : [])
    }),

    setFormVal: (k, i, v) => setFormVals(p => ({ ...p, [k]: { ...(p[k] || {}), [i]: v } })),

    submitForm: (k, data) => {
      const fields = data.fields || [];
      const vals = fields.map((fl, i) => String((formVals[k] || {})[i] || '').trim());
      const firstBad = vals.findIndex(v => !v);
      if (firstBad >= 0) {
        setFormBad(firstBad);
        setFormErr(p => ({ ...p, [k]: true }));
        return;
      }
      const next = { ...records, [k]: [{ line: vals.join(' · '), at: stampMinute() }, ...(records[k] || [])].slice(0, 25) };
      setRecords(next);
      saveStore(recKey, next);
      setFormErr(p => ({ ...p, [k]: false }));
      setFormVals(p => ({ ...p, [k]: {} }));
      showToast(data.ok || common.exported);
    },

    cancelForm: k => {
      setFormErr(p => ({ ...p, [k]: false }));
      setFormVals(p => ({ ...p, [k]: {} }));
      showToast(base.discarded || 'Changes discarded.');
    },

    dropRecord: (k, ri) => {
      const next = { ...records, [k]: (records[k] || []).filter((x, i) => i !== ri) };
      setRecords(next);
      saveStore(recKey, next);
      showToast(base.removed || 'Removed');
    },

    runScan: (k, data) => {
      const raw = String(scan[k] || '').trim().toUpperCase();
      if (!raw) return showToast(data.empty);
      const dupe = scanned.some(s => String(s.code).toUpperCase() === raw);
      const known = !!codes[raw];
      const list = [{ code: raw, at: stampClock(), ok: known && !dupe }, ...scanned].slice(0, 8);
      setScan(p => ({ ...p, [k]: '' }));
      setScanned(list);
      saveStore(scanKey, list);
      if (dupe) return showToast(`${base.scanDuplicate || 'Duplicate'} · ${raw}`);
      if (!known) return showToast(`${base.scanUnknown || 'Not found'} · ${raw}`);
      showToast(`${data.ok} · ${raw}`);
    },

    setToggle: (k, i, v) => setToggles(p => ({ ...p, [k]: { ...(p[k] || {}), [i]: v } })),
    advance: (k, len) => setStage(p => ({ ...p, [k]: Math.min(len - 1, (p[k] || 0) + 1) })),
    setScan: (k, v) => setScan(p => ({ ...p, [k]: v })),
    pushScan: entry => setScanned(p => [entry, ...p].slice(0, 4)),
    clearFormErr: k => setFormErr(p => ({ ...p, [k]: false })),
    toast: showToast,
    setView
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
        style={{ flex: 1, padding: big ? '12px 0' : '9px 0', border: `1px solid ${on ? C.navy : C.border}`, borderRadius: big ? 10 : 9, background: on ? C.navy : C.white, color: on ? C.white : C.text, fontSize: big ? 13 : 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
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

  const accountName = account?.name || '';
  const accountEmail = account?.email || '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.navy, fontFamily: FONT_BODY }}>
      <aside style={{ width: 272, flex: '0 0 272px', background: C.white, borderRight: `1px solid ${C.border}`, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', gap: 12, alignItems: 'center', background: C.bg }}>
          <span style={{ width: 36, height: 36, borderRadius: 9, background: C.navy, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, flex: '0 0 auto' }}>{badge}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13 }}>{shell.portal}</div>
            <div style={{ fontSize: 11, color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{accountName ? `${accountName} · ${accountEmail || shell.account}` : shell.account}</div>
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
          <button type="button" onClick={() => { if (onLogout) onLogout(); }}
            style={{ padding: 11, border: 'none', borderRadius: 10, background: 'none', color: C.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{shell.signout}</button>
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

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', border: '1px solid rgba(217,154,0,.4)', borderRadius: 100, background: 'rgba(217,154,0,.08)', fontSize: 12, fontWeight: 600, color: C.goldText, whiteSpace: 'nowrap' }}>
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
                <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 15 }}>TR3SLOG</span>
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
              <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: '0 0 8px', textWrap: 'pretty' }}>{page.title || ''}</h1>
              <p style={{ margin: 0, fontSize: 15, color: C.text, maxWidth: '70ch', lineHeight: 1.6, textWrap: 'pretty' }}>{page.sub || ''}</p>
            </div>

            {!allowed && (
              <div style={{ ...card, padding: '44px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                <span style={{ width: 56, height: 56, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth={1.7}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                </span>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 19 }}>{common.deniedT}</div>
                <p style={{ margin: 0, fontSize: 14, color: C.text, maxWidth: '52ch', lineHeight: 1.6 }}>{common.deniedHint}</p>
              </div>
            )}

            {allowed && (meta.blocks || []).map((def, i) => renderBlock(def, { ...ctx, key: i }))}
          </div>
        </main>
      </div>

      <RowDrawer row={drawer} common={common} base={base} lang={lang} onClose={() => setDrawer(null)} onToast={showToast} />

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
