/**
 * GeoMap.jsx — geographic operations map used by the map modules (mp1, mp2, mp3).
 *
 * Honesty rules that must not be relaxed:
 *  - Every map carries the "Demo Data · no live GPS" badge.
 *  - A stale position is never presented as current: offline and error states
 *    dim the vehicles and swap the live indicator for "paused".
 *  - Tracking exists only with an active route and shift; the customer never
 *    sees the fleet.
 *
 * Marker, stop and line styles live in the module config (`geo`), extracted
 * from the HTML modules so both stay in sync.
 */

import React from 'react';
import { C, FONT_HEAD, TONE, card, sectionTitle, primaryBtn } from './tokens.js';

export const CTRL_ICONS = {
  zoomIn: 'circle:11,11,6|M20 20l-4.6-4.6|M11 8.5v5M8.5 11h5',
  zoomOut: 'circle:11,11,6|M20 20l-4.6-4.6|M8.5 11h5',
  center: 'circle:12,12,3|M12 3v3M12 18v3M3 12h3M18 12h3',
  fit: 'M4 9V4h5|M20 9V4h-5|M4 15v5h5|M20 15v5h-5',
  layers: 'M12 4l8 4-8 4-8-4z|M4 13l8 4 8-4',
  refresh: 'M20 12a8 8 0 11-3-6.2M20 4v5h-5',
  fullscreen: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'
};

const CTRL_KEYS = ['zoomIn', 'zoomOut', 'center', 'fit', 'layers', 'refresh', 'fullscreen'];

function Ctrl({ spec, color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {spec.split('|').map((p, i) => {
        if (p.indexOf('circle:') === 0) {
          const [cx, cy, r] = p.slice(7).split(',');
          return <circle key={i} cx={cx} cy={cy} r={r} />;
        }
        return <path key={i} d={p} />;
      })}
    </svg>
  );
}

/* Static base plate: land, parks, road hierarchy, street labels. */
function BasePlate() {
  const roads = ['M0 130 H960', 'M0 300 H975', 'M0 470 H1000', 'M0 615 H985', 'M120 0 V700', 'M370 0 V700', 'M620 0 V700', 'M860 0 V700', 'M0 700 L640 60'];
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
      <rect x="0" y="0" width="1200" height="700" fill={C.bg} />
      <path d="M1010 0 C980 120 1035 250 995 360 C960 470 1020 590 985 700 L1200 700 L1200 0 Z" fill="#D7E6F5" />
      <rect x="150" y="430" width="180" height="130" rx="10" fill="#DCEBDC" />
      <rect x="640" y="90" width="130" height="110" rx="10" fill="#DCEBDC" />
      <g stroke={C.border} strokeWidth="15" strokeLinecap="round" fill="none">{roads.map((d, i) => <path key={i} d={d} />)}</g>
      <g stroke={C.white} strokeWidth="10" strokeLinecap="round" fill="none">{roads.map((d, i) => <path key={i} d={d} />)}</g>
      <g stroke={C.white} strokeWidth="4.5" fill="none" opacity=".9">
        {['M0 215 H950', 'M0 385 H960', 'M0 545 H970', 'M245 0 V700', 'M495 0 V700', 'M740 0 V700', 'M960 0 V700'].map((d, i) => <path key={i} d={d} />)}
      </g>
      <g fill={C.textMuted} fontFamily="Inter, sans-serif" fontSize="13" fontWeight="500">
        <text x="16" y="122">I-95</text><text x="16" y="292">US-1</text><text x="16" y="462">SR-836</text>
        <text x="378" y="690">NE 2 AVE</text><text x="628" y="690">NW 12</text>
      </g>
      <g stroke="#9FB3CC" strokeWidth="2" strokeDasharray="9 7" fill="none" opacity=".8">
        <path d="M330 60 H900 V430 H330 Z" />
      </g>
    </svg>
  );
}

export default function GeoMap({ page = {}, opts = {}, common, mstat = {}, geo = {}, view, layers = {}, onToggleLayer, onRetry, onToast }) {
  const { SCENES = {}, PANEL_ROWS = [], V_STATES = {}, S_STATES = {}, LINE_STYLES = {}, ST_FG = {} } = geo;
  const scene = SCENES[opts.scene] || SCENES.plain || { routes: [], stops: [], vehicles: [], zones: [] };
  const data = page.map || {};

  const degraded = view === 'offline';
  const empty = view === 'empty';
  const err = view === 'error';
  const blank = empty || err;
  const frame = opts.frame || 'desktop';
  const height = opts.h || '560px';

  const banner = err
    ? { role: 'alert', title: common.errorT, detail: common.errorHint, accent: C.red, border: 'rgba(169,50,38,.4)', retry: true }
    : empty
      ? { role: 'status', title: common.empty, detail: common.emptyHint, accent: C.goldText, border: 'rgba(217,154,0,.4)', retry: false }
      : degraded
        ? { role: 'status', title: common.offlineT, detail: common.offlineHint, accent: C.goldText, border: 'rgba(217,154,0,.4)', retry: true }
        : null;

  const rows = (blank ? [] : PANEL_ROWS).map(r => {
    const st = V_STATES[r.st] || {};
    return {
      id: r.id,
      st: mstat[r.st] || r.st,
      stFg: ST_FG[r.st] || C.text,
      line2: `${mstat.nextStop || ''} ${r.next} · ${mstat.eta || ''} ${r.eta}`,
      line3: `${r.route} · ${mstat.lastSignal || ''} ${r.sig}`,
      dot: st.bg === '#fff' ? 'transparent' : st.bg,
      dotBd: st.bd === '#fff' ? st.bg : st.bd
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: frame === 'mobile' ? 'column' : 'row', gap: 14, alignItems: 'stretch', maxWidth: frame === 'mobile' ? 440 : frame === 'tablet' ? 1000 : '100%' }}>
      <div style={{ flex: '1 1 auto', minWidth: 0, position: 'relative', height, minHeight: height, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', background: C.bg }}>
        <BasePlate />

        <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
          {(blank ? [] : scene.routes || []).map((r, i) => {
            const s = LINE_STYLES[r.k] || LINE_STYLES.planned || {};
            return <path key={i} d={r.d} fill="none" stroke={s.stroke} strokeWidth={s.w} strokeDasharray={s.dash || 'none'} strokeLinecap="round" strokeLinejoin="round" opacity={degraded ? 0.5 : s.op} />;
          })}
        </svg>

        {layers.geofences && (scene.zones || []).map((z, i) => (
          <div key={i} style={{ position: 'absolute', left: z.left, top: z.top, width: z.w, height: z.h, border: '2px dashed rgba(169,50,38,.55)', borderRadius: 10, background: 'repeating-linear-gradient(45deg,rgba(169,50,38,.09) 0 6px,transparent 6px 13px)' }}>
            <span style={{ position: 'absolute', left: 8, top: 6, fontSize: 11, fontWeight: 600, color: '#8E2C22', background: 'rgba(255,255,255,.86)', padding: '3px 7px', borderRadius: 6 }}>{mstat.geofences}</span>
          </div>
        ))}

        {(blank ? [] : scene.stops || []).map((s, i) => {
          const c = S_STATES[s.t] || S_STATES.delpend || {};
          return (
            <div key={i} role="img" aria-label={`${data.panelT || ''} · ${c.glyph || ''}`} tabIndex={0}
              style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg, border: `2.5px solid ${c.bd}`, borderRadius: c.radius, transform: `rotate(${c.rot})`, boxShadow: '0 2px 6px rgba(0,27,69,.18)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.fg, transform: `rotate(${c.rot === '45deg' ? '-45deg' : '0deg'})` }}>{c.glyph}</span>
              </span>
            </div>
          );
        })}

        {(blank ? [] : scene.vehicles || []).map((x, i) => {
          const c = V_STATES[x.st] || {};
          return (
            <div key={i} role="img" tabIndex={0}
              aria-label={`${x.id}, ${mstat[x.st] || ''}, ${mstat.updated} —— s, ${mstat.accuracy} —— m`}
              style={{ position: 'absolute', left: `${x.x}%`, top: `${x.y}%`, transform: 'translate(-50%,-50%)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: degraded ? 0.55 : c.op }}>
              {c.halo && c.halo !== '0' && (
                <span aria-hidden="true" style={{ position: 'absolute', width: c.halo, height: c.halo, borderRadius: '50%', background: c.haloBg }} />
              )}
              <span style={{ position: 'relative', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg, border: `${c.bw} ${c.bstyle} ${c.bd}`, borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,27,69,.22)' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.fg }}>{x.short}</span>
                {c.tipShow && !degraded && (
                  <span aria-hidden="true" style={{ position: 'absolute', top: -11, left: '50%', width: 0, height: 0, transform: `translateX(-50%) rotate(${x.rot}deg)`, transformOrigin: '50% 24px', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: `8px solid ${c.tip}` }} />
                )}
                {c.badge && <span aria-hidden="true" style={{ position: 'absolute', top: -3, right: -3, width: 9, height: 9, borderRadius: '50%', background: C.red, border: `1.5px solid ${C.white}` }} />}
              </span>
            </div>
          );
        })}

        {scene.cluster && !blank && (
          <button type="button" onClick={() => onToast(`${mstat.zoomIn} · ${mstat.cluster}`)}
            aria-label={`${scene.cluster.n} ${mstat.cluster}`}
            style={{ position: 'absolute', left: `${scene.cluster.x}%`, top: `${scene.cluster.y}%`, transform: 'translate(-50%,-50%)', minWidth: 40, height: 40, borderRadius: '50%', border: `2.5px solid ${C.white}`, background: C.navy, color: C.white, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,27,69,.3)' }}>
            {scene.cluster.n}
          </button>
        )}

        {/* Live status + mandatory demo-data badge */}
        <div style={{ position: 'absolute', left: 14, top: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 100, background: 'rgba(255,255,255,.94)', border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.text }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: degraded || err ? C.textMuted : C.green }} />
            {degraded || err ? mstat.paused : mstat.live}
          </span>
          <span style={{ padding: '8px 13px', borderRadius: 100, background: 'rgba(255,255,255,.94)', border: `1px solid ${C.border}`, fontSize: 12, color: C.textSecondary }}>
            {degraded ? `${mstat.lastSignal} —— min` : `${mstat.updated} —— s`}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 100, background: 'rgba(217,154,0,.14)', border: '1px solid rgba(217,154,0,.45)', fontSize: 12, fontWeight: 600, color: C.goldText }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold }} />
            {mstat.demoBadge || 'Demo Data'}
          </span>
        </div>

        {/* Map controls */}
        <div style={{ position: 'absolute', right: 14, top: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CTRL_KEYS.map(k => {
            const on = k === 'layers' ? !!layers.geofences : false;
            return (
              <button key={k} type="button" aria-label={mstat[k] || k} aria-pressed={k === 'layers' ? on : undefined}
                onClick={() => (k === 'layers' ? onToggleLayer('geofences') : onToast(mstat[k] || k))}
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? C.navy : C.border}`, borderRadius: 11, background: on ? C.navy : 'rgba(255,255,255,.94)', cursor: 'pointer' }}>
                <Ctrl spec={CTRL_ICONS[k]} color={on ? C.white : C.text} />
              </button>
            );
          })}
        </div>

        {banner && (
          <div role={banner.role} style={{ position: 'absolute', left: 14, right: 14, bottom: 14, display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,.96)', border: `1px solid ${banner.border}` }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: banner.accent }}>{banner.title}</div>
              <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{banner.detail}</div>
            </div>
            {banner.retry && (
              <button type="button" onClick={onRetry} style={{ ...primaryBtn, marginLeft: 'auto', padding: '11px 16px', fontSize: 13, flex: '0 0 auto' }}>{common.retry}</button>
            )}
          </div>
        )}
      </div>

      {/* Fleet side panel — internal only, never shown to customers. */}
      <div style={{ ...card, flex: frame === 'mobile' ? '1 1 auto' : '0 0 320px', width: frame === 'mobile' ? 'auto' : 320, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...sectionTitle, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>{data.panelT}</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {rows.length === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: C.textSecondary }}>{common.empty}</div>
          )}
          {rows.map((r, i) => (
            <div key={i} style={{ padding: '14px 20px', borderTop: i ? `1px solid ${C.divider}` : 'none', display: 'flex', gap: 11 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: r.dot, border: `2px solid ${r.dotBd}`, flex: '0 0 auto', marginTop: 3 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{r.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: r.stFg }}>{r.st}</span>
                </div>
                <div style={{ fontSize: 12, color: C.text, marginTop: 3 }}>{r.line2}</div>
                <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>{r.line3}</div>
              </div>
            </div>
          ))}
        </div>
        {data.hint && (
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>{data.hint}</div>
        )}
      </div>
    </div>
  );
}
