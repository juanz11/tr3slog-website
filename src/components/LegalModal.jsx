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
        background: '#fff', borderRadius: 18, maxWidth: 700, width: '100%',
        maxHeight: '85vh', padding: 32, boxShadow: '0 40px 90px rgba(0,10,30,.4)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', background: '#fff', borderRadius: 8,
            padding: '8px 12px', border: '1px solid #DCE6F5',
          }}>
            <div style={{
              fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
              fontSize: 16, color: '#001B45', letterSpacing: '-.02em',
            }}>
              TR3<span style={{ color: '#D99A00' }}>S</span>LOG
            </div>
          </div>
          <h3 style={{
            fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700,
            fontSize: 22, margin: 0, color: '#001B45',
          }}>{data.t}</h3>
        </div>
        <div style={{
          fontSize: 14, lineHeight: 1.75, color: '#10233F',
          overflowY: 'auto', flex: 1, paddingRight: 12,
          whiteSpace: 'pre-line',
        }}>{data.b}</div>
        <button onClick={onClose} style={{
          padding: '14px 24px', background: '#001B45', border: 'none',
          borderRadius: 11, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          marginTop: 24, alignSelf: 'center',
        }}>{t.common.close}</button>
      </div>
    </div>
  )
}
