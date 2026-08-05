import React from 'react'
import { PageHero, AccentStrip } from '../components/Shared'

export default function Coverage({ t, go }) {
  const markets = t.cov.rows.map((m, i) => {
    const f = i === 3
    return {
      n: m.n, d: m.d, c: m.c,
      tag: f ? t.cov.future : t.cov.active,
      accent: f ? '#D99A00' : '#087CF0',
      border: f ? 'rgba(217,154,0,.45)' : '#DCE6F5',
      borderStyle: f ? 'dashed' : 'solid',
      bg: f ? 'rgba(217,154,0,.06)' : '#fff',
      ini: ['US', 'PR', 'RD', 'VE'][i] || '',
      iniBg: f ? 'rgba(217,154,0,.14)' : '#EEF4FC',
      iniFg: f ? '#8A6300' : '#001B45',
      pillBg: f ? 'rgba(217,154,0,.14)' : 'rgba(19,122,69,.12)',
      pillFg: f ? '#8A6300' : '#137A45',
      cities: (m.c || '').split(' · '),
    }
  })

  return (
    <div>
      <PageHero title={t.cov.title} sub={t.cov.sub}>
        <div aria-hidden="true" style={{ width: 38, height: 5, background: '#D99A00', transform: 'skewX(-24deg)', margin: '0 0 18px' }} />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
          {t.cov.stats.map((s, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '11px 18px', border: '1px solid rgba(255,255,255,.2)',
              borderRadius: 100, background: 'rgba(255,255,255,.06)',
            }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff' }}>{s.v}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#C6D6EF' }}>{s.l}</span>
            </span>
          ))}
        </div>
      </PageHero>

      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px 88px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div className="grid-split" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {markets.map((m, i) => (
                <div key={i} style={{
                  border: `1px ${m.borderStyle} ${m.border}`, borderRadius: 16,
                  padding: '20px 22px', background: m.bg,
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                }}>
                  <span style={{
                    width: 46, height: 46, borderRadius: '50%', background: m.iniBg, color: m.iniFg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 14, flex: '0 0 auto',
                  }}>{m.ini}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 19, margin: 0 }}>{m.n}</h2>
                      <span style={{
                        marginLeft: 'auto', display: 'inline-flex', padding: '6px 12px',
                        borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
                        textTransform: 'uppercase', background: m.pillBg, color: m.pillFg,
                      }}>{m.tag}</span>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.7, color: '#10233F' }}>{m.d}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {m.cities.map((c, ci) => (
                        <span key={ci} style={{
                          padding: '6px 12px', border: '1px solid #DCE6F5', borderRadius: 100,
                          fontSize: 12, fontWeight: 600, color: '#6C82A6', background: '#fff',
                        }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid #DCE6F5', borderRadius: 20, background: '#EEF4FC', padding: 26 }}>
              <div style={{ position: 'relative' }}>
                <div className="cov-map" style={{
                  position: 'relative', width: '100%', paddingBottom: '43%',
                  borderRadius: 14, overflow: 'hidden', background: '#fff',
                  backgroundImage: 'repeating-linear-gradient(0deg,#DCE6F5 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,#DCE6F5 0 1px,transparent 1px 40px)',
                }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B9DBA', fontSize: 14 }}>
                    {t.cov.mapAlt}
                  </div>
                </div>
                <div className="cov-legend" style={{
                  position: 'absolute', left: '2%', top: '44%', width: '38%', bottom: 0,
                  background: '#fff', border: '1px solid #DCE6F5', borderBottom: 'none',
                  borderRadius: '10px 10px 0 0', padding: '12px 14px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 9,
                }}>
                  {markets.map((m, i) => (
                    <span key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: 11, fontWeight: 600, color: '#10233F', lineHeight: 1.3,
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.accent, flex: '0 0 auto' }} />
                      {m.n}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14,
                marginTop: 22, paddingTop: 20, borderTop: '1px solid #DCE6F5',
              }}>
                {t.cov.stats.map((s, i) => (
                  <div key={i}>
                    <AccentStrip />
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 26, letterSpacing: '-.02em', color: '#001B45' }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 32, background: '#EEF4FC', border: '1px solid #DCE6F5',
            borderRadius: 18, padding: '24px 28px',
            display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <span style={{
              width: 46, height: 46, borderRadius: '50%', background: '#001B45',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
                <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9s1.3-6.6 3.8-9z" />
              </svg>
            </span>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 16, color: '#001B45' }}>{t.cov.ctaT}</div>
              <div style={{ fontSize: 13, color: '#6C82A6', marginTop: 3 }}>{t.cov.ctaSub}</div>
            </div>
            <button onClick={() => go('quote')} style={{
              padding: '14px 22px', background: '#087CF0', border: 'none',
              borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{t.common.quote} →</button>
          </div>
        </div>
      </section>
    </div>
  )
}
