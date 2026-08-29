import React from 'react'

export default function Maintenance({ t }) {
  return (
    <section className="section-pad" style={{ background: '#fff', padding: '96px 32px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔧</div>
        <h1 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 28, color: '#001B45', margin: '0 0 16px' }}>
          {t.maintenance.title}
        </h1>
        <p style={{ fontSize: 16, color: '#6C82A6', margin: '0 0 32px' }}>
          {t.maintenance.sub}
        </p>
        <div style={{ fontSize: 14, color: '#8B9DBA' }}>
          {t.maintenance.contact}
        </div>
      </div>
    </section>
  )
}
