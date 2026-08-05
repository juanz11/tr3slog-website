import React from 'react'

export default function Toast({ text }) {
  return (
    <div style={{
      position: 'fixed', right: 24, bottom: 24, zIndex: 90,
      maxWidth: 380, display: 'flex', gap: 12, alignItems: 'flex-start',
      background: '#fff', color: '#001B45', border: '1px solid #DCE6F5',
      borderLeft: '4px solid #137A45', borderRadius: 14,
      padding: '18px 20px', boxShadow: '0 24px 60px rgba(0,27,69,.22)',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#137A45" strokeWidth="1.9" style={{ flex: '0 0 auto' }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.5l2.5 2.5 4.5-5" />
      </svg>
      <span style={{ fontSize: 14, lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}
