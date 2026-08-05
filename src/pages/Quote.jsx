import React from 'react'
import { PageHero } from '../components/Shared'

export default function Quote({ t, go, showToast }) {
  const [quoteType, setQuoteType] = React.useState(0)
  const [qName, setQName] = React.useState('')
  const [qEmail, setQEmail] = React.useState('')
  const [quoteError, setQuoteError] = React.useState('')
  const [quoteSent, setQuoteSent] = React.useState(false)

  const err = '#E0A0A0'

  const submit = () => {
    if (!qName.trim()) { setQuoteError(t.common.required); return }
    if (!/\S+@\S+\.\S+/.test(qEmail)) { setQuoteError(t.common.invalidEmail); return }
    setQuoteError(''); setQuoteSent(true)
    showToast(t.quo.toast)
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

  const howSteps = t.how.steps.map((s, i) => ({
    t: s.t, d: s.d, n: '0' + (i + 1),
  }))

  return (
    <div>
      <PageHero title={t.quo.title} sub={t.quo.sub} />
      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px 88px' }}>
        <div className="grid-split" style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 32, alignItems: 'start',
        }}>
          <div style={{ border: '1px solid #DCE6F5', borderRadius: 18, padding: 30, background: '#fff' }}>
            <div className="grid-c2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t.quo.f.origin}</label>
                <input placeholder={t.quo.f.originPh} style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.dest}</label>
                <input placeholder={t.quo.f.destPh} style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.type}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {t.quo.types.map((label, i) => {
                    const on = quoteType === i
                    return (
                      <button key={i} onClick={() => setQuoteType(i)} style={{
                        padding: '11px 15px', border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                        borderRadius: 100, background: on ? 'rgba(8,124,240,.08)' : '#fff',
                        color: on ? '#0768C9' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}>{label}</button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.weight}</label>
                <input placeholder={t.quo.f.weightPh} style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.dims}</label>
                <input placeholder={t.quo.f.dimsPh} style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.pieces}</label>
                <input placeholder={t.quo.f.piecesPh} style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.name}</label>
                <input value={qName} onChange={e => setQName(e.target.value)} placeholder={t.quo.f.namePh} style={inputStyle(quoteError, qName.trim())} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.email}</label>
                <input value={qEmail} onChange={e => setQEmail(e.target.value)} placeholder={t.quo.f.emailPh} style={inputStyle(quoteError, /\S+@\S+\.\S+/.test(qEmail))} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>{t.quo.f.details}</label>
                <textarea rows={4} placeholder={t.quo.f.detailsPh} style={{ ...inputStyle(false, true), resize: 'vertical' }} />
              </div>
              {quoteError && (
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 500, color: '#C0392B' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>
                  {quoteError}
                </div>
              )}
              <button onClick={submit} style={{
                gridColumn: 'span 2', padding: 16,
                background: quoteSent ? '#137A45' : '#087CF0', border: 'none',
                borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{quoteSent ? t.quo.sent : t.quo.btn}</button>
            </div>
          </div>
          <div style={{ border: '1px solid #DCE6F5', borderRadius: 18, padding: 26, background: '#EEF4FC' }}>
            <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 16 }}>{t.how.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {howSteps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#fff',
                    border: '1.5px solid #DCE6F5', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700, fontSize: 12, color: '#001B45', flex: '0 0 auto',
                  }}>{s.n}</span>
                  <div>
                    <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 600, fontSize: 15 }}>{s.t}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: '#10233F', marginTop: 2 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
