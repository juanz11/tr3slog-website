import React from 'react'
import { api } from '../api'
import { PageHero, ImageSlot } from '../components/Shared'

export default function Track({ t }) {
  const [code, setCode] = React.useState('')
  const [trackState, setTrackState] = React.useState('ok')
  const [trackError, setTrackError] = React.useState('')
  const [shownCode, setShownCode] = React.useState('TR3-260729-PRSJ-08821')
  const [quote, setQuote] = React.useState(null)

  const onTrack = async () => {
    const raw = (code || '').trim().toUpperCase()
    if (!raw) { setTrackError(t.trk.errEmpty); setTrackState('empty'); return }
    if (!/^TR3-\d{6}-[A-Z]{4}-\d{5}$/.test(raw)) { setTrackError(t.trk.errFormat); setTrackState('empty'); return }
    setTrackError(''); setTrackState('loading')
    try {
      const data = await api.trackQuote(raw)
      setQuote(data)
      setShownCode(raw)
      setTrackState('ok')
    } catch (e) {
      setTrackError((t.trk && t.trk.notFound) ? t.trk.notFound : 'No se encontró una cotización con ese código.')
      setTrackState('empty')
    }
  }

  const statusLabels = { pending: 'Pendiente', processing: 'En proceso', approved: 'Aprobada', rejected: 'Rechazada' }

  const dateLocale = () => {
    if (t.label === 'EN') return 'en-US'
    if (t.label === '中文') return 'zh-CN'
    return 'es-ES'
  }

  const fmtDate = (d) => {
    if (!d) return ''
    return d.toLocaleString(dateLocale(), { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const dateAfter = (base, days, h, m) => {
    const d = new Date(base)
    d.setDate(d.getDate() + days)
    d.setHours(h, m, 0, 0)
    return d
  }

  const parseDateFromCode = (code) => {
    const m = (code || '').match(/^TR3-(\d{6})-[A-Z]{4}-\d{5}$/)
    if (!m) return null
    const y = 2000 + parseInt(m[1].slice(0, 2), 10)
    const mo = parseInt(m[1].slice(2, 4), 10) - 1
    const d = parseInt(m[1].slice(4, 6), 10)
    const out = new Date(y, mo, d, 8, 0, 0)
    if (isNaN(out.getTime())) return null
    return out
  }

  const serverCreated = quote?.created_at ? new Date(quote.created_at) : null
  const creationDate = (serverCreated && !isNaN(serverCreated.getTime())) ? serverCreated : parseDateFromCode(shownCode)

  const etaVal = creationDate
    ? fmtDate(dateAfter(creationDate, 3, 16, 30))
    : t.trk.etaVal

  const trackFacts = quote ? [
    { l: (t.quo && t.quo.f && t.quo.f.origin) ? t.quo.f.origin : 'Origen', v: quote.origin },
    { l: (t.quo && t.quo.f && t.quo.f.dest) ? t.quo.f.dest : 'Destino', v: quote.destination },
    { l: (t.quo && t.quo.f && t.quo.f.type) ? t.quo.f.type : 'Servicio', v: quote.service_type || '-' },
    { l: t.trk.status, v: statusLabels[quote.status] || quote.status },
  ] : [
    { l: t.trk.location, v: t.trk.locationVal },
    { l: t.trk.eta, v: etaVal },
    { l: t.trk.service, v: t.trk.serviceVal },
    { l: t.trk.status, v: t.trk.statusVal },
  ]

  if (creationDate) {
    trackFacts.push({ l: t.trk.created || 'Creado', v: fmtDate(creationDate) })
  }

  const current = 3
  const timelineOffsets = [
    { d: 0, h: 8, m: 0 },
    { d: 0, h: 9, m: 15 },
    { d: 1, h: 6, m: 0 },
    { d: 2, h: 14, m: 0 },
    null,
  ]
  const timeline = (creationDate ? t.trk.timeline.map((s, i) => {
    const o = timelineOffsets[i]
    if (!o) return s
    return { ...s, time: fmtDate(dateAfter(creationDate, o.d, o.h, o.m)) }
  }) : t.trk.timeline).map((s, i) => ({
    ...s,
    dot: i < current ? '#087CF0' : (i === current ? '#D99A00' : '#fff'),
    ring: i <= current ? 'rgba(8,124,240,.18)' : '#DCE6F5',
    line: i < current ? '#087CF0' : '#DCE6F5',
    fg: i <= current ? '#001B45' : '#8B9DBA',
  }))

  return (
    <div>
      <PageHero title={t.trk.title} sub={t.trk.sub}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxWidth: 620, marginTop: 26 }}>
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={t.trk.ph}
            aria-label={t.trk.guide}
            style={{
              flex: '1 1 240px', padding: 16,
              border: '1.5px solid #DCE6F5', borderRadius: 11,
              fontSize: 15, fontWeight: 600, letterSpacing: '.05em',
              background: '#fff', color: '#001B45', outline: 'none',
            }}
          />
          <button onClick={onTrack} style={{
            padding: '16px 26px', background: '#087CF0', border: 'none',
            borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{trackState === 'loading' ? t.common.loading : t.trk.btn}</button>
        </div>
        {trackError && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 600, color: '#FFB4A6' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" />
            </svg>{trackError}
          </div>
        )}
      </PageHero>

      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px 88px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          {(trackState === 'empty' || trackState === 'loading') && (
            <div style={{
              border: '1px dashed #DCE6F5', borderRadius: 18,
              padding: '60px 32px', textAlign: 'center', background: '#EEF4FC',
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.6" style={{ marginBottom: 14 }}>
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-4.5-4.5" />
              </svg>
              <p style={{ margin: '0 auto', fontSize: 15, color: '#10233F', maxWidth: 420 }}>{t.trk.empty}</p>
            </div>
          )}
          {trackState === 'ok' && (
            <div className="grid-split" style={{
              display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 24, alignItems: 'start',
            }}>
              <div style={{ border: '1px solid #DCE6F5', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{
                  padding: '24px 26px', borderBottom: '1px solid #DCE6F5',
                  background: '#EEF4FC', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.trk.guide}</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '.02em' }}>{shownCode}</div>
                  </div>
                  <span style={{
                    marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '9px 16px', borderRadius: 100,
                    background: 'rgba(8,124,240,.1)', color: '#0768C9',
                    fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase',
                  }}>{statusLabels[quote?.status] || quote?.status || t.trk.statusVal}</span>
                </div>
                <div className="grid-c2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#DCE6F5' }}>
                  {trackFacts.map((f, i) => (
                    <div key={i} style={{ background: '#fff', padding: '20px 26px' }}>
                      <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }}>{f.l}</div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{f.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: 26 }}>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>{t.trk.timelineTitle}</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {timeline.map((s, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', background: s.dot, border: `3px solid ${s.ring}`, flex: '0 0 auto' }} />
                          <span style={{ flex: 1, width: 2, background: s.line, minHeight: 34 }} />
                        </div>
                        <div style={{ paddingBottom: 18 }}>
                          <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 600, fontSize: 15, color: s.fg }}>{s.label}</div>
                          <div style={{ fontSize: 13, color: '#6C82A6', marginTop: 3 }}>{s.time} · {s.place}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ border: '1px solid #DCE6F5', borderRadius: 18, padding: 26, background: '#fff' }}>
                <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{t.trk.proofTitle}</div>
                <div style={{ height: 200, borderRadius: 14, overflow: 'hidden', background: '#EEF4FC', marginBottom: 12 }}>
                  <img src="/proof.webp" alt={t.trk.proofPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #DCE6F5', borderRadius: 12 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#087CF0" strokeWidth="1.7"><path d="M3 18c3 0 4-9 7-9s3 7 5.5 7S19 12 21 12" /></svg>
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{t.trk.proofSign}</span>
                    <span style={{ fontSize: 12, color: '#6C82A6' }}>{t.trk.proofPending}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #DCE6F5', borderRadius: 12 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#087CF0" strokeWidth="1.7"><path d="M6 3h8l4 4v14H6zM14 3v4h4" /></svg>
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{t.trk.proofDoc}</span>
                    <span style={{ fontSize: 12, color: '#6C82A6' }}>{t.trk.proofPending}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
