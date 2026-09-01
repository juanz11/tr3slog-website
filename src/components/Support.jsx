import React from 'react'
import { api } from '../api'

export default function Support({ app, token }) {
  const s = app.support
  const [subject, setSubject] = React.useState('')
  const [ship, setShip] = React.useState('')
  const [msg, setMsg] = React.useState('')
  const [formError, setFormError] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [shipments, setShipments] = React.useState([])

  React.useEffect(() => {
    if (!token) return
    api.getShipments(token)
      .then((data) => {
        const rows = Array.isArray(data) ? data : data.data || []
        setShipments(rows)
      })
      .catch(() => setShipments([]))
  }, [token])

  const submit = async () => {
    const missing = !subject.trim() || !msg.trim()
    if (missing) {
      setFormError('Complete los campos obligatorios.')
      return
    }
    setFormError(false)
    try {
      await api.createSupport({ subject, message: msg, ship }, token)
      setSent(true)
    } catch (err) {
      setFormError(err.message || 'No se pudo enviar el caso.')
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: '0 0 8px', color: '#001B45',
      }}>{s.title}</h1>
      <p style={{ margin: '0 0 22px', fontSize: 15, color: '#10233F' }}>{s.sub}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(280px, .9fr)', gap: 16, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
            fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
          }}>{s.formT}</div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{s.f.subject}</label>
            <input
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setFormError(false) }}
              placeholder={s.f.subjectPh}
              style={{
                width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5',
                borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{s.f.ship}</label>
            <select
              value={ship}
              onChange={(e) => { setShip(e.target.value); setFormError(false) }}
              style={{
                width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5',
                borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
                appearance: 'none',
              }}
            >
              <option value="">{s.f.shipPh}</option>
              {shipments.map((sh) => (
                <option key={sh.id} value={sh.tracking_number || sh.id}>
                  {sh.tracking_number || `#${sh.id}`} — {sh.origin || ''} → {sh.destination || ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{s.f.msg}</label>
            <textarea
              value={msg}
              onChange={(e) => { setMsg(e.target.value); setFormError(false) }}
              rows={5}
              placeholder={s.f.msgPh}
              style={{
                width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5',
                borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none', resize: 'vertical',
              }}
            />
          </div>

          {formError && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 500, color: '#C0392B' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>
              {formError}
            </div>
          )}

          {sent && (
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', padding: 16,
              border: '1px solid #C6E6D4', background: '#F1FAF5', borderRadius: 12,
              fontSize: 14, color: '#0F5F36',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#137A45" strokeWidth="1.9" style={{ flex: '0 0 auto' }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 12.5l2.5 2.5 4.5-5" />
              </svg>
              {s.sent}
            </div>
          )}

          <button onClick={submit} style={{
            padding: 16, background: '#087CF0', border: 'none', borderRadius: 11,
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{s.submit}</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{
              padding: '18px 22px', borderBottom: '1px solid #DCE6F5',
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
              fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
            }}>{s.channelsT}</div>
            {s.channels.map((c, i) => (
              <div key={i} style={{ padding: '15px 22px', borderTop: '1px solid #E3EBF7', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#6C82A6', flex: 1 }}>{c.l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#10233F' }}>{c.v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{s.hoursT}</div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6, color: '#10233F' }}>{s.hours}</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{
              padding: '18px 22px', borderBottom: '1px solid #DCE6F5',
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
              fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
            }}>{s.openT}</div>
            {s.open.map((o, i) => (
              <div key={i} style={{ padding: '16px 22px', borderTop: '1px solid #E3EBF7', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{o.id} · {o.t}</div>
                  <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>{o.when}</div>
                </div>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: 'rgba(217,154,0,.14)', color: '#8A6300', whiteSpace: 'nowrap' }}>{o.st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
