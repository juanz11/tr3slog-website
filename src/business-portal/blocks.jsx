/**
 * blocks.jsx — content blocks shared by every TR3SLOG administration module.
 *
 * A screen is a list of block definitions: [type, dataKey, options].
 * `renderBlock` maps one definition to a component, exactly like the HTML
 * modules do. Block types: stats · chips · table · panels · cards · form ·
 * toggles · steps · timeline · scan · map (zone map) · code · swatches ·
 * markers · lines · note.
 */

import React from 'react';
import { C, FONT_HEAD, FONT_MONO, TONE, PILL_HDR, card, sectionTitle, ghostBtn, primaryBtn, outlineBtn } from './tokens.js';
import { chipCount, exportCsv, exportPdf, filterRows, downloadBlob, slug } from './engine.js';
import GeoMap from './GeoMap.jsx';
import { ManifestBlock, OptimizerBlock } from '../advanced-ops-portal/OpsBlocks.jsx';

/* Brand motif: paired skewed bars (gold + blue). Accent use only. */
export function Motif({ w = 24, h = 5, gap = 4, mb = 14 }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap, marginBottom: mb }}>
      <span style={{ width: w, height: h, background: C.gold, transform: 'skewX(-24deg)' }} />
      <span style={{ width: Math.round(w * 0.38), height: h, background: C.blue, transform: 'skewX(-24deg)' }} />
    </div>
  );
}

export function NavIcon({ spec, color, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
      {(spec || '').split('|').map((p, i) => {
        if (p.indexOf('circle:') === 0) {
          const [cx, cy, r] = p.slice(7).split(',');
          return <circle key={i} cx={cx} cy={cy} r={r} />;
        }
        return <path key={i} d={p} />;
      })}
    </svg>
  );
}

function StatsBlock({ items = [], cols = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 14 }}>
      {items.map((s, i) => (
        <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <Motif w={20} h={4} mb={12} />
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, lineHeight: 1.4, minHeight: 34 }}>{s.k}</div>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 28, letterSpacing: '-.02em', color: C.navy, margin: '6px 0 4px' }}>{s.v}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.divider}` }}>{s.d}</div>
        </div>
      ))}
    </div>
  );
}

/** Chips carry the number of rows they would show, so a 0 is visibly a 0. */
function ChipsBlock({ label, items = [], selected = 0, onPick, page, query, dropped }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.textMuted, marginRight: 4 }}>{label}</span>
      {(items || []).map((c, i) => {
        const on = selected === i;
        const term = i === 0 ? '' : c;
        const n = chipCount(page, { term, query, dropped });
        const dead = n === 0;
        return (
          <button key={i} type="button" aria-pressed={on} onClick={() => onPick(i, term)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 12px 9px 14px', border: `1.5px solid ${on ? C.navy : dead ? C.divider : C.border}`, borderRadius: 100, background: on ? C.navy : C.white, color: on ? C.white : dead ? C.textMuted : C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
            <span>{c}</span>
            <span style={{ minWidth: 20, padding: '2px 6px', borderRadius: 100, background: on ? 'rgba(255,255,255,.18)' : dead ? '#F4F8FD' : C.bg, color: on ? C.white : dead ? C.textMuted : C.textSecondary, fontSize: 11, fontWeight: 700, lineHeight: 1.5 }}>{n}</span>
          </button>
        );
      })}
    </div>
  );
}

function TableBlock({ data = {}, lang, view, common, base, onToast, onRetry, term, query, dropped, onDrop, onOpenRow }) {
  const cols = data.cols || [];
  const all = data.rows || [];
  const rows = filterRows(all, { term, query, dropped });
  const widest = rows.reduce((m, r) => Math.max(m, (r.c || []).length), 0);
  const hasPill = rows.some(r => !!r.pill);
  const header = hasPill && cols.length <= widest ? cols.concat([PILL_HDR[lang] || 'Status']) : cols;
  const exportCols = cols.concat(hasPill ? [PILL_HDR[lang] || 'Status'] : []);

  return (
    <div style={card}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={sectionTitle}>{data.t}</span>
        {data.exp && (
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="button" style={ghostBtn} onClick={() => exportPdf({ title: data.t, cols: exportCols, rows, lang, toast: onToast })}>PDF</button>
            <button type="button" style={ghostBtn} onClick={() => exportCsv({ title: data.t, cols: exportCols, rows, lang, toast: onToast })}>Excel</button>
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
                <th scope="col" style={{ padding: '13px 22px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{base.actions}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const tone = TONE[r.st] || TONE.neutral;
                const idx = all.indexOf(r);
                return (
                  <tr key={idx}>
                    {(r.c || []).map((cell, ci) => (
                      <td key={ci} style={{ padding: '14px 22px', borderTop: `1px solid ${C.divider}`, fontSize: 13, color: ci === 0 ? C.navy : C.text, fontWeight: ci === 0 ? 600 : 400, whiteSpace: 'nowrap' }}>{cell}</td>
                    ))}
                    {r.pill && (
                      <td style={{ padding: '14px 22px', borderTop: `1px solid ${C.divider}`, whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', padding: '5px 11px', borderRadius: 100, background: tone.bg, color: tone.fg, fontSize: 12, fontWeight: 600 }}>{r.pill}</span>
                      </td>
                    )}
                    <td style={{ padding: '14px 22px', borderTop: `1px solid ${C.divider}`, whiteSpace: 'nowrap', textAlign: 'right' }}>
                      <span style={{ display: 'inline-flex', gap: 8 }}>
                        <button type="button" onClick={() => onOpenRow(data, r)}
                          style={{ padding: '7px 12px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, color: C.blueDark, fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{common.view}</button>
                        <button type="button" aria-label={base.remove} onClick={() => onDrop(idx, (r.c || [])[0])}
                          style={{ width: 30, height: 30, border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, color: C.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', lineHeight: 1, font: 'inherit' }}>✕</button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {view === 'loading' && (
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }} aria-busy="true">
          {['92%', '78%', '86%', '64%'].map((w, i) => <div key={i} style={{ height: 16, borderRadius: 6, background: C.bg, width: w }} />)}
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
          <div style={{ fontSize: 14, fontWeight: 600, color: C.red }}>{common.errorT}</div>
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
      {(items || []).map((p, i) => (
        <div key={i} style={card}>
          <div style={{ ...sectionTitle, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>{p.t}</div>
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

function CardsBlock({ data = {}, actions, common, lang, onToast, onOpenRow }) {
  const isView = actions === 'view';
  return (
    <div>
      <div style={{ ...sectionTitle, margin: '0 0 12px' }}>{data.t}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 14 }}>
        {(data.items || []).map((c, i) => (
          <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, lineHeight: 1.35, textWrap: 'pretty' }}>{c.t}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, flex: 1 }}>{c.s}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {isView ? (
                <>
                  <button type="button" style={ghostBtn} onClick={() => onOpenRow({ t: c.t, cols: [data.t || ''] }, { c: [c.s] })}>{common.view}</button>
                  <button type="button" style={{ ...ghostBtn, color: C.text }}
                    onClick={() => { downloadBlob(`${slug(c.t)}.txt`, 'text/plain;charset=utf-8', `${c.t}\n\n${c.s || ''}`); onToast(`${common.download} · ${c.t}`); }}>{common.download}</button>
                </>
              ) : (
                <>
                  <button type="button" style={ghostBtn} onClick={() => exportPdf({ title: c.t, cols: c.cols || [data.t || '', ''], rows: c.rows || [{ c: [c.t, c.s] }], lang, toast: onToast })}>PDF</button>
                  <button type="button" style={ghostBtn} onClick={() => exportCsv({ title: c.t, cols: c.cols || [data.t || '', ''], rows: c.rows || [{ c: [c.t, c.s] }], lang, toast: onToast })}>Excel</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Every field is required, the record is kept in localStorage and listed back.
 * Replace onSubmit's persistence with the real endpoint when it exists.
 */
function FormBlock({ data = {}, common, base, invalid, badIndex, values = {}, records = [], onChange, onSubmit, onCancel, onDropRecord }) {
  const fields = data.fields || [];
  return (
    <div style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={sectionTitle}>{data.t}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {fields.map((f, i) => (
          <label key={i} style={{ gridColumn: `span ${f.span || 1}`, display: 'block' }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 8 }}>{f.l}</span>
            {f.file ? (
              <input type="file" onChange={e => onChange(i, e.target.files && e.target.files[0] ? e.target.files[0].name : '')} aria-label={f.l}
                style={{ width: '100%', padding: '12px 15px', border: `1.5px solid ${invalid && i === badIndex ? '#E0A0A0' : C.border}`, borderRadius: 11, background: C.bg, fontSize: 14, color: C.navy, outline: 'none', font: 'inherit' }} />
            ) : f.opts ? (
              <select value={values[i] || ''} onChange={e => onChange(i, e.target.value)}
                style={{ width: '100%', padding: '14px 15px', border: `1.5px solid ${invalid && i === badIndex ? '#E0A0A0' : C.border}`, borderRadius: 11, background: C.bg, fontSize: 15, color: C.navy, outline: 'none', font: 'inherit', cursor: 'pointer' }}>
                <option value="">{f.ph}</option>
                {(f.opts || []).map((o, oi) => {
                  const v = typeof o === 'string' ? o : o.v;
                  return <option key={oi} value={v}>{typeof o === 'string' ? o : (o.l || o.v)}</option>;
                })}
              </select>
            ) : (
              <input value={values[i] || ''} onChange={e => onChange(i, e.target.value)} placeholder={f.ph}
                style={{ width: '100%', padding: '14px 15px', border: `1.5px solid ${invalid && i === badIndex ? '#E0A0A0' : C.border}`, borderRadius: 11, background: C.bg, fontSize: 15, color: C.navy, outline: 'none', font: 'inherit' }} />
            )}
          </label>
        ))}
      </div>
      {invalid && <div role="alert" style={{ fontSize: 13, color: C.red, fontWeight: 600 }}>{common.required}</div>}

      <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 10 }}>{base.savedRecords}</div>
        {records.length === 0
          ? <div style={{ fontSize: 13, color: C.textMuted }}>{base.noRecords}</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {records.map((rec, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 11, background: C.bg }}>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13, color: C.text }}>{rec.line}</span>
                  <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: 'nowrap' }}>{rec.at}</span>
                  <button type="button" aria-label={base.remove} onClick={() => onDropRecord(ri)}
                    style={{ width: 28, height: 28, border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, color: C.textMuted, fontSize: 12, cursor: 'pointer', lineHeight: 1, flex: '0 0 auto', font: 'inherit' }}>✕</button>
                </div>
              ))}
            </div>
          )}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" onClick={onSubmit} style={primaryBtn}>{data.submit || common.save}</button>
        <button type="button" onClick={onCancel} style={outlineBtn}>{common.cancel}</button>
      </div>
    </div>
  );
}

function TogglesBlock({ data = {}, state = {}, common, onToggle }) {
  return (
    <div style={card}>
      <div style={{ ...sectionTitle, padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>{data.t}</div>
      {(data.items || []).map((it, i) => {
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
    <div style={{ ...card, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={sectionTitle}>{data.t}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
        {items.map((label, i) => {
          const done = i < stage, current = i === stage;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: done ? C.green : current ? C.gold : C.bg, color: done || current ? C.white : C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flex: '0 0 auto' }}>
                {done ? '✓' : i + 1}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: done || current ? C.navy : C.textMuted }}>{label}</span>
            </div>
          );
        })}
      </div>
      <div>
        <button type="button" onClick={onAdvance} style={{ padding: '13px 20px', border: `1.5px solid ${C.navy}`, borderRadius: 11, background: C.white, color: C.navy, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{data.action}</button>
      </div>
    </div>
  );
}

function TimelineBlock({ data = {} }) {
  const items = data.items || [];
  return (
    <div style={{ ...card, padding: '22px 24px' }}>
      <div style={{ ...sectionTitle, marginBottom: 16 }}>{data.t}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((s, i) => {
          const last = i === items.length - 1;
          return (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: last ? C.gold : C.blue, border: '2px solid rgba(8,124,240,.18)', marginTop: 4 }} />
                <span style={{ flex: 1, width: 2, background: last ? 'transparent' : C.border, minHeight: 22 }} />
              </div>
              <div style={{ paddingBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{s.t}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 3 }}>{s.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScanBlock({ data = {}, value, recent = [], onChange, onScan }) {
  return (
    <div style={{ background: C.navy, borderRadius: 16, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16, color: C.white }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blueLight} strokeWidth={1.8} style={{ flex: '0 0 auto' }}>
          <path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3" /><path d="M8 12h8" />
        </svg>
        <span style={sectionTitle}>{data.t}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9FC4EE' }}>{data.hint}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onScan(); } }} placeholder={data.ph} aria-label={data.t}
          style={{ flex: '1 1 260px', padding: '16px 18px', border: '1.5px solid rgba(255,255,255,.22)', borderRadius: 12, background: 'rgba(255,255,255,.07)', fontSize: 17, letterSpacing: '.04em', color: C.white, outline: 'none', font: 'inherit' }} />
        <button type="button" onClick={onScan} style={{ ...primaryBtn, padding: '16px 26px', fontSize: 15, minHeight: 48 }}>{data.action}</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recent.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,.06)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.03em' }}>{s.code}</span>
            <span style={{ fontSize: 12, color: '#9FC4EE' }}>{s.at}</span>
            <span style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 100, background: s.ok ? 'rgba(19,122,69,.28)' : 'rgba(192,57,43,.3)', color: C.white, fontSize: 11, fontWeight: 600 }}>
              {s.ok ? data.okLabel : data.failLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Warehouse zone map: occupancy per zone. Not a geographic map. */
function ZoneMapBlock({ data = {} }) {
  const tone = pct => pct >= 90 ? { bar: C.red, fg: C.red, bg: 'rgba(192,57,43,.06)', border: 'rgba(192,57,43,.3)' }
    : pct >= 70 ? { bar: C.gold, fg: C.goldText, bg: 'rgba(217,154,0,.07)', border: 'rgba(217,154,0,.35)' }
    : { bar: C.blue, fg: C.blueDark, bg: C.bg, border: C.border };
  return (
    <div style={{ ...card, padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={sectionTitle}>{data.t}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {(data.legend || []).map((label, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.text }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: [C.blue, C.gold, C.red][i] || C.textMuted }} />{label}
            </span>
          ))}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
        {(data.zones || []).map((z, i) => {
          const c = tone(z.pct);
          return (
            <div key={i} style={{ border: `1.5px solid ${c.border}`, background: c.bg, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 118 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13 }}>{z.code}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: c.fg }}>{z.pct}%</span>
              </div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.4, flex: 1 }}>{z.n}</div>
              <div style={{ height: 6, borderRadius: 100, background: C.border, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${z.pct}%`, background: c.bar }} />
              </div>
              <div style={{ fontSize: 11, color: C.textSecondary }}>{z.meta}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CodeBlock({ data = {}, common, onToast }) {
  return (
    <div style={{ background: C.navy, borderRadius: 16, overflow: 'hidden', color: C.white }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ ...sectionTitle, fontSize: 12, letterSpacing: '.08em' }}>{data.t}</span>
        {data.tag && (
          <span style={{ padding: '6px 12px', borderRadius: 100, background: 'rgba(8,124,240,.22)', border: '1px solid rgba(8,124,240,.5)', fontFamily: FONT_MONO, fontSize: 12, color: '#BFDDFF' }}>{data.tag}</span>
        )}
        <button type="button" onClick={() => onToast(common.copied)}
          style={{ marginLeft: 'auto', minHeight: 44, padding: '0 16px', border: '1px solid rgba(255,255,255,.28)', borderRadius: 10, background: 'none', color: C.white, fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
          {common.copy}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '20px 22px', fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.75, color: '#CFE2F7', whiteSpace: 'pre', overflowX: 'auto' }}>{data.code}</pre>
      {data.caption && <div style={{ padding: '0 22px 18px', fontSize: 12, color: '#9FC4EE' }}>{data.caption}</div>}
    </div>
  );
}

function SwatchesBlock({ data = {} }) {
  return (
    <div style={{ ...card, padding: '22px 24px' }}>
      <div style={{ ...sectionTitle, marginBottom: 16 }}>{data.t}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
        {(data.items || []).map((s, i) => (
          <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 56, background: s.hex || s.c }} />
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: FONT_MONO, marginTop: 3 }}>{s.hex || s.c}</div>
              {s.s && <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 6, lineHeight: 1.5 }}>{s.s}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarkersBlock({ data = {}, set, styles }) {
  const src = set === 'v' ? styles.V_STATES : styles.S_STATES;
  return (
    <div style={{ ...card, padding: '22px 24px' }}>
      <div style={{ ...sectionTitle, marginBottom: 16 }}>{data.t}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }}>
        {(data.items || []).map((it, i) => {
          const c = src[it.kind] || {};
          const isV = set === 'v';
          const rot = isV ? '0deg' : (c.rot || '0deg');
          return (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ width: 26, height: 26, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg || C.white, border: `${c.bw || '2.5px'} ${c.bstyle || 'solid'} ${(c.bd === '#fff' ? c.bg : c.bd) || C.border}`, borderRadius: isV ? '50%' : (c.radius || '5px'), transform: `rotate(${rot})`, position: 'relative' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.fg || C.text, transform: `rotate(${(!isV && c.rot === '45deg') ? '-45deg' : '0deg'})` }}>{isV ? '' : (c.glyph || '')}</span>
                {c.badge && <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: C.red }} />}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{it.n}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, marginTop: 2 }}>{it.s}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LinesBlock({ data = {}, styles }) {
  return (
    <div style={{ ...card, padding: '22px 24px' }}>
      <div style={{ ...sectionTitle, marginBottom: 16 }}>{data.t}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }}>
        {(data.items || []).map((it, i) => {
          const s = styles.LINE_STYLES[it.kind] || styles.LINE_STYLES.planned;
          return (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <span style={{ width: 64, height: s.h, background: s.sample, borderRadius: 100, flex: '0 0 auto' }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{it.n}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, marginTop: 2 }}>{it.s}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Side drawer with the full record — what the row's View action opens. */
export function RowDrawer({ row, common, base, lang, onClose, onToast }) {
  if (!row) return null;
  const pairs = (row.cols || []).map((c, i) => ({ k: c, v: (row.vals || [])[i] || '——' }));
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,27,69,.5)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ width: 'min(460px,92vw)', height: '100%', background: C.white, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,10,30,.28)' }}>
        <div style={{ padding: '20px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <Motif w={20} h={4} mb={8} />
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15 }}>{row.t}</div>
          </div>
          <button type="button" onClick={onClose} aria-label={common.close}
            style={{ marginLeft: 'auto', width: 40, height: 40, border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.white, cursor: 'pointer', color: C.navy, fontSize: 18, lineHeight: 1, flex: '0 0 auto' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {pairs.map((d, i) => (
            <div key={i} style={{ padding: '15px 22px', borderBottom: `1px solid ${C.divider}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.textSecondary, marginBottom: 5 }}>{d.k}</div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{d.v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '18px 22px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10 }}>
          <button type="button" style={ghostBtn} onClick={() => exportCsv({ title: row.t, cols: row.cols || [], rows: [{ c: row.vals || [] }], lang, toast: onToast })}>CSV</button>
          <button type="button" onClick={onClose}
            style={{ marginLeft: 'auto', padding: '13px 20px', border: 'none', borderRadius: 11, background: C.navy, color: C.white, fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{common.close}</button>
        </div>
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

/**
 * renderBlock(def, ctx) — def is [type, dataKey, options].
 *
 * ctx carries the module state plus the client-side behaviour: chip term and
 * row-removal maps for real filtering, form values/records for persistence, and
 * the scan lookup table. See engine.js for what each helper does.
 */
export function renderBlock(def, ctx) {
  const [type, dataKey, opts = {}] = def;
  const data = ctx.page[dataKey] || {};
  const sk = `${ctx.screen}:${dataKey}`;

  switch (type) {
    case 'stats':
      return <StatsBlock key={ctx.key} items={data} cols={opts.cols || 4} />;
    case 'chips':
      return <ChipsBlock key={ctx.key} label={ctx.common.filters} items={data} selected={ctx.chips[sk] || 0}
        page={ctx.page} query={ctx.query} dropped={ctx.dropped}
        onPick={(i, term) => ctx.setChip(sk, i, term)} />;
    case 'table':
      return <TableBlock key={ctx.key} data={data} lang={ctx.lang} view={ctx.view} common={ctx.common} base={ctx.base}
        term={ctx.term} query={ctx.query} dropped={ctx.dropped}
        onDrop={ctx.dropRow} onOpenRow={ctx.openRow}
        onToast={ctx.toast} onRetry={() => ctx.setView('data')} />;
    case 'panels':
      return <PanelsBlock key={ctx.key} items={data} cols={opts.cols || 2} />;
    case 'cards':
      return <CardsBlock key={ctx.key} data={data} actions={opts.actions} common={ctx.common} lang={ctx.lang}
        onToast={ctx.toast} onOpenRow={ctx.openRow} />;
    case 'form':
      return <FormBlock key={ctx.key} data={data} common={ctx.common} base={ctx.base}
        invalid={!!ctx.formErr[sk]} badIndex={ctx.formBad}
        values={ctx.formVals[sk] || {}} records={ctx.records[sk] || []}
        onChange={(i, v) => ctx.setFormVal(sk, i, v)}
        onSubmit={() => ctx.submitForm(sk, data)}
        onCancel={() => ctx.cancelForm(sk)}
        onDropRecord={ri => ctx.dropRecord(sk, ri)} />;
    case 'toggles':
      return <TogglesBlock key={ctx.key} data={data} common={ctx.common} state={ctx.toggles[sk] || {}} onToggle={(i, v) => ctx.setToggle(sk, i, v)} />;
    case 'steps':
      return <StepsBlock key={ctx.key} data={data} stage={ctx.stage[ctx.screen] || 0}
        onAdvance={() => { ctx.advance(ctx.screen, (data.items || []).length); ctx.toast(data.ok); }} />;
    case 'timeline':
      return <TimelineBlock key={ctx.key} data={data} />;
    case 'scan':
      return <ScanBlock key={ctx.key} data={data} value={ctx.scan[sk] || ''} recent={ctx.scanned.concat(data.recent || []).slice(0, 6)}
        onChange={v => ctx.setScan(sk, v)}
        onScan={() => ctx.runScan(sk, data)} />;
    case 'map':
      /* Geographic map in the map modules; occupancy zone map elsewhere. */
      return ctx.geo
        ? <GeoMap key={ctx.key} page={ctx.page} opts={opts} common={ctx.common} mstat={ctx.mstat} geo={ctx.geo} view={ctx.view} layers={ctx.layers} onToggleLayer={ctx.toggleLayer} onRetry={() => ctx.setView('data')} onToast={ctx.toast} />
        : <ZoneMapBlock key={ctx.key} data={data} />;
    case 'code':
      return <CodeBlock key={ctx.key} data={data} common={ctx.common} onToast={ctx.toast} />;
    case 'swatches':
      return <SwatchesBlock key={ctx.key} data={data} />;
    case 'markers':
      return <MarkersBlock key={ctx.key} data={data} set={opts.set} styles={ctx.geo || {}} />;
    case 'lines':
      return <LinesBlock key={ctx.key} data={data} styles={ctx.geo || {}} />;
    case 'manifest':
      return <ManifestBlock key={ctx.key} data={data} onToast={ctx.toast} />;
    case 'optimizer':
      return <OptimizerBlock key={ctx.key} data={data} common={ctx.common} view={ctx.view} lang={ctx.lang} onToast={ctx.toast} />;
    case 'note':
      return <NoteBlock key={ctx.key} text={typeof data === 'string' ? data : ctx.page.note} />;
    default:
      return null;
  }
}
