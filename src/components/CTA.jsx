import React from 'react'

export default function CTA({ t, go }) {
  return (
    <section className="section-pad" style={{
      background: '#001B45', padding: '78px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 150,
        background: 'repeating-linear-gradient(102deg,rgba(217,154,0,.14) 0 2px,transparent 2px 44px)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="h2-large" style={{
          fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
          fontSize: 38, lineHeight: 1.2, letterSpacing: '-.02em',
          color: '#fff', margin: '0 0 14px',
        }}>{t.home.ctaTitle}</h2>
        <p style={{
          fontSize: 17, lineHeight: 1.6, color: '#C8D6EC', margin: '0 0 30px',
        }}>{t.home.ctaSub}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => go('quote')} style={{
            padding: '16px 26px', background: '#087CF0', border: 'none',
            borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{t.home.ctaBtn1}</button>
          <button onClick={() => go('contact')} style={{
            padding: '16px 26px', background: 'transparent',
            border: '1.5px solid rgba(255,255,255,.4)', borderRadius: 11,
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{t.home.ctaBtn2}</button>
        </div>
      </div>
    </section>
  )
}
