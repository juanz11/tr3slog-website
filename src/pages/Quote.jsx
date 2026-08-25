import React from 'react'
import { PageHero } from '../components/Shared'
import CityAutocomplete from '../components/CityAutocomplete'
import { api } from '../api'

export default function Quote({ t, go, showToast, lang }) {
  const [quoteType, setQuoteType] = React.useState(0)
  const [qOrigin, setQOrigin] = React.useState('')
  const [qDest, setQDest] = React.useState('')
  const [qWeight, setQWeight] = React.useState('')
  const [qDims, setQDims] = React.useState('')
  const [qPieces, setQPieces] = React.useState('')
  const [qName, setQName] = React.useState('')
  const [qEmail, setQEmail] = React.useState('')
  const [qDetails, setQDetails] = React.useState('')
  const [quoteError, setQuoteError] = React.useState('')
  const [quoteSent, setQuoteSent] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [quoteCode, setQuoteCode] = React.useState('')

  const err = '#E0A0A0'

  const submit = async () => {
    if (!qOrigin.trim()) { setQuoteError(t.common.required); return }
    if (!qDest.trim()) { setQuoteError(t.common.required); return }
    if (!qName.trim()) { setQuoteError(t.common.required); return }
    if (!/\S+@\S+\.\S+/.test(qEmail)) { setQuoteError(t.common.invalidEmail); return }
    if (qPieces.trim() && !/^\d+$/.test(qPieces.trim())) { setQuoteError(t.quo.err.pieces); return }
    if (qDims.trim() && !/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(\s*(cm|in|m))?$/i.test(qDims.trim())) { setQuoteError(t.quo.err.dims); return }
    setQuoteError('')
    setSubmitting(true)
    try {
      const result = await api.createQuote({
        origin: qOrigin.trim(),
        destination: qDest.trim(),
        service_type: t.quo.types[quoteType] || '',
        weight: qWeight.trim(),
        dimensions: qDims.trim(),
        pieces: qPieces.trim(),
        client_name: qName.trim(),
        client_email: qEmail.trim(),
        details: qDetails.trim(),
      })
      setQuoteSent(true)
      setQuoteCode(result?.tracking_code || '')
      showToast(t.quo.toast)
    } catch (e) {
      setQuoteError(e.message || t.common.required)
    } finally {
      setSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (!quoteCode) return
    navigator.clipboard.writeText(quoteCode).then(() => {
      showToast((t.quo && t.quo.trackCopyDone) ? t.quo.trackCopyDone : 'Código copiado')
    })
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

  const cityList = React.useMemo(() =>
    t.cov.rows.flatMap(r => {
      const cities = r.c ? r.c.split(' · ') : []
      return cities.map(city => {
        const parts = [city]
        if (r.regions && r.regions[city]) parts.push(r.regions[city])
        parts.push(r.n)
        return parts.join(', ')
      })
    }),
  [t.cov.rows])

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
                <CityAutocomplete
                  value={qOrigin}
                  onChange={setQOrigin}
                  placeholder={t.quo.f.originPh}
                  countryCodes="VE,DO,US"
                  lang={lang}
                  cities={cityList}
                  hasError={!!quoteError && !qOrigin.trim()}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.dest}</label>
                <CityAutocomplete
                  value={qDest}
                  onChange={setQDest}
                  placeholder={t.quo.f.destPh}
                  countryCodes="VE,DO,US"
                  lang={lang}
                  cities={cityList}
                  hasError={!!quoteError && !qDest.trim()}
                />
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
                <input value={qWeight} onChange={e => setQWeight(e.target.value)} placeholder={t.quo.f.weightPh} style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.dims}</label>
                <input value={qDims} onChange={e => setQDims(e.target.value)} placeholder={t.quo.f.dimsPh} pattern="\\d+(\\.\\d+)?\\s*x\\s*\\d+(\\.\\d+)?\\s*x\\s*\\d+(\\.\\d+)?(\\s*(cm|in|m))?" style={inputStyle(false, true)} />
              </div>
              <div>
                <label style={labelStyle}>{t.quo.f.pieces}</label>
                <input value={qPieces} onChange={e => setQPieces(e.target.value.replace(/\\D/g, ''))} placeholder={t.quo.f.piecesPh} inputMode="numeric" pattern="\\d*" style={inputStyle(false, true)} />
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
                <textarea value={qDetails} onChange={e => setQDetails(e.target.value)} rows={4} placeholder={t.quo.f.detailsPh} style={{ ...inputStyle(false, true), resize: 'vertical' }} />
              </div>
              {quoteError && (
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8, alignItems: 'center', fontSize: 15, fontWeight: 600, color: '#C0392B' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>
                  {quoteError}
                </div>
              )}
              <button onClick={submit} disabled={submitting} style={{
                gridColumn: 'span 2', padding: 16,
                background: quoteSent ? '#137A45' : '#087CF0', border: 'none',
                borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
              }}>{submitting ? t.common.loading : (quoteSent ? t.quo.sent : t.quo.btn)}</button>
              {quoteCode && (
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{
                    border: '1.5px dashed #087CF0', borderRadius: 14, padding: 22,
                    background: '#EEF4FC', display: 'flex', flexDirection: 'column', gap: 10,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>
                      {(t.quo && t.quo.trackTitle) ? t.quo.trackTitle : 'Código de seguimiento'}
                    </div>
                    <div style={{
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 22,
                      color: '#001B45', letterSpacing: '.04em',
                    }}>{quoteCode}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: '#6C82A6' }}>
                      {((t.quo && t.quo.trackSub) ? t.quo.trackSub : 'Te hemos enviado el código a {{email}}.').replace('{{email}}', qEmail)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                      <button onClick={copyToClipboard} style={{
                        padding: '11px 18px', background: '#fff', border: '1.5px solid #DCE6F5',
                        borderRadius: 10, color: '#001B45', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}>{(t.quo && t.quo.trackCopy) ? t.quo.trackCopy : 'Copiar'}</button>
                      <button onClick={() => go('track')} style={{
                        padding: '11px 18px', background: '#087CF0', border: 'none',
                        borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}>{(t.quo && t.quo.trackTrack) ? t.quo.trackTrack : 'Rastrear'}</button>
                    </div>
                  </div>
                </div>
              )}
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
