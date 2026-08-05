import React from 'react'
import { AccentStrip, ImageSlot } from '../components/Shared'

const TECH_ICONS = [
  'M3 12h4l2-5 3 10 2-5h7',
  'M4 20V9l8-5 8 5v11|M9 20v-6h6v6',
  'M4 12.5l4 4L20 6',
  'M4 6h16v12H4z|circle:12,12,3',
  'M12 4v3M6 10a6 6 0 0112 0v5l2 3H4l2-3z',
  'M3 5h18v12H3zM8 21h8M12 17v4',
]

function TechIcon({ spec, color, size }) {
  const kids = spec.split('|').map((p, i) => {
    if (p.indexOf('circle:') === 0) {
      const c = p.slice(7).split(',')
      return <circle key={i} cx={c[0]} cy={c[1]} r={c[2]} />
    }
    return <path key={i} d={p} />
  })
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
      {kids}
    </svg>
  )
}

export default function Home({ t, go }) {
  const trust = t.home.trust.map(l => ({ l, v: '——' }))
  const services = t.svc.items.map((s, i) => ({ t: s.t, d: s.d, slotId: 'tr3-svc-' + i }))
  const howSteps = t.how.steps.map((s, i) => ({
    t: s.t, d: s.d, n: '0' + (i + 1), ring: i === 3 ? '#D99A00' : '#087CF0',
  }))
  const techItems = t.home.tech.map((l, i) => ({ label: l, icon: TECH_ICONS[i] }))
  const mapLabels = t.cov.rows.map(r => r.n)

  return (
    <div>
      {/* Hero */}
      <section className="section-pad" style={{
        padding: '76px 32px 92px', background: '#001B45',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 180,
          background: 'repeating-linear-gradient(102deg,rgba(217,154,0,.13) 0 3px,transparent 3px 48px)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: -140, top: -140, width: 560, height: 560,
          borderRadius: '50%', border: '1px solid rgba(255,255,255,.09)', pointerEvents: 'none',
        }} />
        <div className="grid-split" style={{
          position: 'relative', maxWidth: 1240, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.02fr .98fr', gap: 56, alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '8px 15px', border: '1px solid rgba(255,255,255,.24)',
              borderRadius: 100, fontSize: 11, fontWeight: 600,
              letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#D99A00', marginBottom: 26, background: 'rgba(255,255,255,.05)',
            }}>
              <span aria-hidden="true" style={{ width: 14, height: 3, background: '#D99A00', transform: 'skewX(-24deg)' }} />
              {t.home.eyebrow}
            </div>
            <h1 className="h1-large" style={{
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
              fontSize: 60, lineHeight: 1.04, letterSpacing: '-.025em',
              margin: '0 0 20px', color: '#fff',
            }}>{t.home.title}</h1>
            <p style={{
              fontSize: 19, lineHeight: 1.6, color: '#C6D6EF',
              maxWidth: 520, margin: '0 0 32px',
            }}>{t.home.sub}</p>
            <div style={{
              background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16,
              padding: 20, boxShadow: '0 18px 44px rgba(0,27,69,.09)', maxWidth: 560,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '.14em',
                textTransform: 'uppercase', color: '#6C82A6', marginBottom: 12,
              }}>{t.home.trackTitle}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <input
                  placeholder={t.home.trackPh}
                  aria-label={t.trk.guide}
                  style={{
                    flex: '1 1 220px', padding: '15px 16px',
                    border: '1.5px solid #DCE6F5', borderRadius: 11,
                    fontSize: 15, fontWeight: 600, letterSpacing: '.05em',
                    color: '#001B45', background: '#EEF4FC', outline: 'none',
                  }}
                />
                <button onClick={() => go('track')} style={{
                  padding: '15px 22px', background: '#087CF0', border: 'none',
                  borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', flex: '0 0 auto',
                }}>{t.home.trackBtn}</button>
                <button onClick={() => go('quote')} style={{
                  padding: '15px 22px', background: '#fff', border: '1.5px solid #DCE6F5',
                  borderRadius: 11, color: '#001B45', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', flex: '0 0 auto',
                }}>{t.home.quoteBtn}</button>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              height: 470, borderRadius: 20, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,.16)',
              boxShadow: '0 30px 70px rgba(0,0,0,.45)',
              background: '#EEF4FC',
            }}>
              <img src="/hero.webp" alt="TR3SLOG logistics operation" style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} />
            </div>
            <div style={{
              position: 'absolute', left: -18, bottom: 28,
              background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14,
              padding: '16px 18px', boxShadow: '0 16px 36px rgba(0,27,69,.14)',
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: 10, background: '#EEF4FC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#087CF0" strokeWidth="1.8">
                  <path d="M3 12h4l2-5 3 10 2-5h7" />
                </svg>
              </span>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.trk.status}</div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15 }}>{t.trk.statusVal}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="section-pad" style={{
        background: '#fff', borderBottom: '1px solid #E3EBF7', padding: '38px 32px',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div className="grid-c4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
            {trust.map((s, i) => (
              <div key={i} style={{ padding: '6px 0' }}>
                <AccentStrip />
                <div style={{
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
                  fontSize: 36, color: '#001B45', letterSpacing: '-.03em',
                }}>{s.v}</div>
                <div style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: '.1em',
                  textTransform: 'uppercase', color: '#6C82A6', marginTop: 6,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#8B9DBA', marginTop: 16 }}>{t.common.placeholderNote}</div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section-pad" style={{ background: '#fff', padding: '88px 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 24, marginBottom: 40 }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#087CF0', marginBottom: 12 }}>{t.home.svcEyebrow}</div>
              <h2 className="h2-large" style={{
                fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
                fontSize: 38, lineHeight: 1.16, letterSpacing: '-.02em', margin: '0 0 12px',
              }}>{t.home.svcTitle}</h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: '#10233F' }}>{t.home.svcSub}</p>
            </div>
            <button onClick={() => go('services')} style={{
              marginLeft: 'auto', padding: '13px 20px', background: '#fff',
              border: '1.5px solid #DCE6F5', borderRadius: 10,
              color: '#001B45', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{t.common.viewAll}</button>
          </div>
          <div className="grid-c3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {services.map((s, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #DCE6F5', borderRadius: 18,
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
              }}>
                <ImageSlot placeholder={s.t} height={180} />
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <h3 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 19, margin: 0 }}>{s.t}</h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#10233F' }}>{s.d}</p>
                  <button onClick={() => go('services')} style={{
                    marginTop: 'auto', alignSelf: 'flex-start', background: 'none',
                    border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, color: '#087CF0',
                  }}>{t.common.explore} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad" style={{ background: '#EEF4FC', padding: '88px 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#D99A00', marginBottom: 12 }}>{t.home.howEyebrow}</div>
          <h2 className="h2-large" style={{
            fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
            fontSize: 38, lineHeight: 1.16, letterSpacing: '-.02em',
            margin: '0 0 44px', maxWidth: 620,
          }}>{t.home.howTitle}</h2>
          <div style={{ position: 'relative' }}>
            <div className="hide-small" style={{
              position: 'absolute', left: '6%', right: '6%', top: 26, height: 2,
              background: 'repeating-linear-gradient(90deg,#DCE6F5 0 10px,transparent 10px 20px)',
            }} />
            <div className="grid-c4" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {howSteps.map((s, i) => (
                <div key={i}>
                  <div style={{
                    width: 54, height: 54, borderRadius: '50%', background: '#fff',
                    border: `2px solid ${s.ring}`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700, fontSize: 16, color: s.ring, marginBottom: 20,
                  }}>{s.n}</div>
                  <h3 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 19, margin: '0 0 8px' }}>{s.t}</h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#10233F' }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="section-pad" style={{ background: '#fff', padding: '88px 32px' }}>
        <div className="grid-split" style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 52, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#087CF0', marginBottom: 12 }}>{t.home.covEyebrow}</div>
            <h2 className="h2-large" style={{
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
              fontSize: 38, lineHeight: 1.16, letterSpacing: '-.02em', margin: '0 0 16px',
            }}>{t.home.covTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#10233F', margin: '0 0 26px' }}>{t.cov.sub}</p>
            <button onClick={() => go('coverage')} style={{
              padding: '14px 22px', background: '#fff', border: '1.5px solid #DCE6F5',
              borderRadius: 10, color: '#001B45', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{t.nav.coverage} →</button>
          </div>
          <div style={{ border: '1px solid #DCE6F5', borderRadius: 20, background: '#EEF4FC', padding: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#10233F' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#087CF0' }} />{t.cov.active}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#10233F' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#D99A00' }} />{t.cov.future}
              </span>
            </div>
            <svg viewBox="0 0 560 340" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <g stroke="#DCE6F5" strokeWidth="1">
                <path d="M0 60H560M0 130H560M0 200H560M0 270H560" />
                <path d="M100 0V340M220 0V340M340 0V340M460 0V340" />
              </g>
              <path d="M96 92C176 112 208 158 258 188" stroke="#087CF0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M258 188C310 202 348 210 424 198" stroke="#087CF0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M258 188C290 236 306 274 334 300" stroke="#D99A00" strokeWidth="2" fill="none" strokeDasharray="6 8" strokeLinecap="round" />
              <g fill="#087CF0">
                <circle cx="96" cy="92" r="7" />
                <circle cx="258" cy="188" r="7" />
                <circle cx="424" cy="198" r="7" />
              </g>
              <circle cx="334" cy="300" r="7" fill="#D99A00" />
              <g fontFamily="Montserrat,sans-serif" fontSize="13" fontWeight="600" fill="#001B45">
                <text x="92" y="74">{mapLabels[0]}</text>
                <text x="244" y="170">{mapLabels[1]}</text>
                <text x="380" y="180">{mapLabels[2]}</text>
                <text x="292" y="326" fill="#B07C00">{mapLabels[3]}</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="section-pad" style={{ background: '#EEF4FC', padding: '88px 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#087CF0', marginBottom: 12 }}>{t.home.segEyebrow}</div>
          <h2 className="h2-large" style={{
            fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
            fontSize: 38, lineHeight: 1.16, letterSpacing: '-.02em', margin: '0 0 40px',
          }}>{t.home.segTitle}</h2>
          <div className="grid-c4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {t.home.seg.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 26 }}>
                <h3 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 18, margin: '0 0 10px' }}>{s.t}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#10233F' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section-pad" style={{ background: '#fff', padding: '88px 32px' }}>
        <div className="grid-split" style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 52, alignItems: 'start',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#D99A00', marginBottom: 12 }}>{t.home.techEyebrow}</div>
            <h2 className="h2-large" style={{
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
              fontSize: 38, lineHeight: 1.16, letterSpacing: '-.02em', margin: 0,
            }}>{t.home.techTitle}</h2>
          </div>
          <div className="grid-c2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {techItems.map((f, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'center',
                background: '#EEF4FC', border: '1px solid #DCE6F5',
                borderRadius: 14, padding: '18px 20px',
              }}>
                <TechIcon spec={f.icon} color="#087CF0" size={20} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
