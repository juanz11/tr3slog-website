import React from 'react'

export default function LegalModal({ t, legal, onClose }) {
  const data = t.legal[legal]
  if (!data) return null

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 80,
      background: 'rgba(0,27,69,.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 18, maxWidth: 600, width: '100%',
        padding: 34, boxShadow: '0 40px 90px rgba(0,10,30,.4)',
      }}>
        <h3 style={{
          fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700,
          fontSize: 25, margin: '0 0 16px',
        }}>{data.t}</h3>
        <p style={{
          fontSize: 15, lineHeight: 1.75, color: '#10233F', margin: '0 0 26px',
        }}>{data.b}</p>
        <button onClick={onClose} style={{
          padding: '14px 24px', background: '#001B45', border: 'none',
          borderRadius: 11, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>{t.common.close}</button>
      </div>
    </div>
  )
}
