import React from 'react'

export function PageHero({ title, sub, children }) {
  return (
    <section className="section-pad" style={{
      background: '#001B45', padding: '66px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 110,
        background: 'repeating-linear-gradient(102deg,rgba(217,154,0,.12) 0 3px,transparent 3px 48px)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto' }}>
        <h1 className="h1-large" style={{
          fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
          fontSize: 46, letterSpacing: '-.025em', margin: '0 0 14px', color: '#fff',
        }}>{title}</h1>
        {sub && <p style={{ margin: 0, fontSize: 18, color: '#C6D6EF', maxWidth: 640 }}>{sub}</p>}
        {children}
      </div>
    </section>
  )
}

export function AccentStrip() {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
      <span style={{ width: 20, height: 4, background: '#D99A00', transform: 'skewX(-24deg)' }} />
      <span style={{ width: 8, height: 4, background: '#087CF0', transform: 'skewX(-24deg)' }} />
    </div>
  )
}

export function ImageSlot({ placeholder, height = 180 }) {
  return (
    <div style={{
      height, background: '#EEF4FC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#8B9DBA', fontSize: 13, fontWeight: 500,
      backgroundImage: 'repeating-linear-gradient(45deg,#DCE6F5 0 1px,transparent 1px 24px)',
    }}>
      {placeholder}
    </div>
  )
}
