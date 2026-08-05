import React from 'react'
import { PageHero } from '../components/Shared'

export default function Pickup({ t, go, showToast }) {
  const [pickWindow, setPickWindow] = React.useState(0)
  const [pFrom, setPFrom] = React.useState('')
  const [pTo, setPTo] = React.useState('')
  const [pickError, setPickError] = React.useState(false)
  const [pickSent, setPickSent] = React.useState(false)

  const err = '#E0A0A0'

  const submit = () => {
    if (!pFrom.trim() || !pTo.trim()) { setPickError(true); return }
    setPickError(false); setPickSent(true)
    showToast(t.pick.toast)
  }

  const inputStyle = (hasError, value) => ({
    width: '100%', padding: '14px 15px',
    border: `1.5px solid ${hasError && !value ? err : '#DCE6F5'}`,
    borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
  })

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8,
  }

  return (
    <div>
      <PageHero title={t.pick.title} sub={t.pick.sub} />
      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px 88px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', border: '1px solid #DCE6F5', borderRadius: 18, padding: 30 }}>
          <div className="grid-c2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>{t.pick.f.from}</label>
              <input value={pFrom} onChange={e => setPFrom(e.target.value)} placeholder={t.pick.f.fromPh} style={inputStyle(pickError, pFrom.trim())} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>{t.pick.f.to}</label>
              <input value={pTo} onChange={e => setPTo(e.target.value)} placeholder={t.pick.f.toPh} style={inputStyle(pickError, pTo.trim())} />
            </div>
            <div>
              <label style={labelStyle}>{t.pick.f.date}</label>
              <input type="date" style={inputStyle(false, true)} />
            </div>
            <div>
              <label style={labelStyle}>{t.pick.f.time}</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {t.pick.windows.map((label, i) => {
                  const on = pickWindow === i
                  return (
                    <button key={i} onClick={() => setPickWindow(i)} style={{
                      padding: '12px 14px', border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                      borderRadius: 100, background: on ? 'rgba(8,124,240,.08)' : '#fff',
                      color: on ? '#0768C9' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>{label}</button>
                  )
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t.pick.f.contact}</label>
              <input placeholder={t.pick.f.contactPh} style={inputStyle(false, true)} />
            </div>
            <div>
              <label style={labelStyle}>{t.pick.f.pkg}</label>
              <input placeholder={t.pick.f.pkgPh} style={inputStyle(false, true)} />
            </div>
            {pickError && (
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 500, color: '#C0392B' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>
                {t.common.required}
              </div>
            )}
            <button onClick={submit} style={{
              gridColumn: 'span 2', padding: 16,
              background: pickSent ? '#137A45' : '#087CF0', border: 'none',
              borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{pickSent ? t.pick.sent : t.pick.btn}</button>
          </div>
        </div>
      </section>
    </div>
  )
}
