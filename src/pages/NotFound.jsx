import React from 'react'

export default function NotFound({ t, go }) {
  return (
    <section className="section-pad" style={{ background: '#fff', padding: '96px 32px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 96, color: '#087CF0', lineHeight: 1, marginBottom: 16 }}>404</div>
        <h1 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 28, color: '#001B45', margin: '0 0 16px' }}>
          {t.notFound.title}
        </h1>
        <p style={{ fontSize: 16, color: '#6C82A6', margin: '0 0 32px' }}>
          {t.notFound.sub}
        </p>
        <button
          onClick={() => go('home')}
          style={{
            padding: '14px 24px',
            background: '#087CF0',
            border: 'none',
            borderRadius: 11,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t.notFound.back}
        </button>
      </div>
    </section>
  )
}
