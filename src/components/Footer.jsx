import React from 'react'

export default function Footer({ t, langs, setLang, go, setLegal }) {
  const allKeys = ['home', 'services', 'track', 'quote', 'pickup', 'coverage', 'how', 'about', 'contact', 'faq']
  const footNavKeys = allKeys.slice(0, 6)

  return (
    <footer className="section-pad" style={{
      background: '#001B45', color: '#fff',
      padding: '66px 32px 28px',
      borderTop: '1px solid rgba(255,255,255,.12)',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="grid-c4" style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.1fr',
          gap: 34, paddingBottom: 38,
          borderBottom: '1px solid rgba(255,255,255,.14)',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', background: '#fff', borderRadius: 10,
              padding: '12px 16px', marginBottom: 18,
            }}>
              <div style={{
                fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
                fontSize: 20, color: '#001B45', letterSpacing: '-.02em',
              }}>
                TR3<span style={{ color: '#D99A00' }}>S</span>LOG
              </div>
            </div>
            <p style={{
              margin: '0 0 18px', fontSize: 14, lineHeight: 1.7,
              color: '#8FA8CC', maxWidth: 320,
            }}>{t.foot.tagline}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {langs.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)} style={{
                  padding: '9px 14px', border: '1px solid rgba(255,255,255,.24)',
                  borderRadius: 100, background: l.footBg, color: l.footFg,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>{l.label}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700,
              fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#D99A00', marginBottom: 16,
            }}>{t.foot.colNav}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, alignItems: 'flex-start' }}>
              {footNavKeys.map(k => (
                <button key={k} onClick={() => go(k)} style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontSize: 14, color: '#C8D6EC',
                }}>{t.nav[k]}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700,
              fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#D99A00', marginBottom: 16,
            }}>{t.foot.colServices}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, alignItems: 'flex-start' }}>
              {t.svc.items.map(s => (
                <button key={s.t} onClick={() => go('services')} style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  textAlign: 'left', fontSize: 14, color: '#C8D6EC',
                }}>{s.t}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700,
              fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#D99A00', marginBottom: 16,
            }}>{t.foot.colContact}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 14, color: '#C8D6EC' }}>
              <span>+1 786 123 4567</span>
              <a href="mailto:info@tr3slog.com" style={{ color: '#C8D6EC' }}>info@tr3slog.com</a>
              <span style={{ whiteSpace: 'pre-line' }}>{t.cont.address}</span>
              <a href="https://wa.me/17861234567" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#D99A00', fontWeight: 600,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M20.5 3.5A11 11 0 003 18l-1 4 4-1a11 11 0 0014.5-17.5z" />
                </svg>{t.cont.waT}
              </a>
              <a href="https://t.me/TR3SLOG" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#C8D6EC', fontWeight: 600,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4L2.6 11.2l5.1 1.6M21 4l-3 15-6.3-4.6-4 2.4-.1-4M21 4L7.7 12.8" />
                </svg>Telegram
              </a>
              <a href="https://discord.gg/tr3slog" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#C8D6EC', fontWeight: 600,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.6 6.6A12.6 12.6 0 0112 6.1c1.2 0 2.3.2 3.4.5M8.6 6.6c-2.5.7-4.2 2.1-4.9 4.3-.8 2.4-.7 4.8.4 6.5 1.2.9 2.6 1.5 4 1.8l.8-1.6M15.4 6.6c2.5.7 4.2 2.1 4.9 4.3.8 2.4.7 4.8-.4 6.5-1.2.9-2.6 1.5-4 1.8l-.8-1.6" />
                  <circle cx="9.5" cy="13" r="1.1" />
                  <circle cx="14.5" cy="13" r="1.1" />
                </svg>Discord
              </a>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
          paddingTop: 22,
        }}>
          <span style={{ fontSize: 12, color: '#8FA8CC' }}>{t.foot.rights}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 18 }}>
            <button onClick={() => setLegal('privacy')} style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: 12, color: '#8FA8CC',
            }}>{t.foot.privacy}</button>
            <button onClick={() => setLegal('terms')} style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: 12, color: '#8FA8CC',
            }}>{t.foot.terms}</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
