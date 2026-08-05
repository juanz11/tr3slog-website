import React from 'react'
import { PageHero } from '../components/Shared'

export default function Contact({ t, go, showToast }) {
  const [cName, setCName] = React.useState('')
  const [cEmail, setCEmail] = React.useState('')
  const [contError, setContError] = React.useState('')
  const [contSent, setContSent] = React.useState(false)

  const err = '#E0A0A0'

  const submit = () => {
    if (!cName.trim()) { setContError(t.common.required); return }
    if (!/\S+@\S+\.\S+/.test(cEmail)) { setContError(t.common.invalidEmail); return }
    setContError(''); setContSent(true)
    showToast(t.cont.toast)
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

  const contactCards = [
    { l: t.cont.phoneT, v: '+1 786 123 4567' },
    { l: t.cont.emailT, v: 'info@tr3slog.com' },
    { l: t.cont.waT, v: '+1 786 123 4567' },
    { l: 'Telegram', v: '@TR3SLOG' },
    { l: 'Discord', v: 'discord.gg/tr3slog' },
    { l: t.cont.hoursT, v: t.cont.hours },
    { l: t.cont.addressT, v: t.cont.address },
  ]

  return (
    <div>
      <PageHero title={t.cont.title} sub={t.cont.sub} />
      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px 88px' }}>
        <div className="grid-split" style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 32, alignItems: 'start',
        }}>
          <div style={{ border: '1px solid #DCE6F5', borderRadius: 18, padding: 30 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              <div className="grid-c2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t.cont.f.name}</label>
                  <input value={cName} onChange={e => setCName(e.target.value)} placeholder={t.cont.f.namePh} style={inputStyle(contError, cName.trim())} />
                </div>
                <div>
                  <label style={labelStyle}>{t.cont.f.email}</label>
                  <input value={cEmail} onChange={e => setCEmail(e.target.value)} placeholder={t.cont.f.emailPh} style={inputStyle(contError, /\S+@\S+\.\S+/.test(cEmail))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t.cont.f.subject}</label>
                <input placeholder={t.cont.f.subjectPh} style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.cont.f.msg}</label>
                <textarea rows={5} placeholder={t.cont.f.msgPh} style={{ ...inputStyle(false, true), resize: 'vertical' }} />
              </div>
              {contError && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 500, color: '#C0392B' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>
                  {contError}
                </div>
              )}
              <button onClick={submit} style={{
                padding: 16, background: contSent ? '#137A45' : '#087CF0', border: 'none',
                borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{contSent ? t.cont.sent : t.cont.btn}</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {contactCards.map((c, i) => (
              <div key={i} style={{ border: '1px solid #DCE6F5', borderRadius: 16, padding: '22px 24px', background: '#EEF4FC' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{c.l}</div>
                <div style={{ fontSize: 16, fontWeight: 600, whiteSpace: 'pre-line', lineHeight: 1.6 }}>{c.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
