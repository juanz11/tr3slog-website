import React from 'react'
import { api } from '../api'
import { SortControl, sortRows } from './Shared'

const CASES_KEY = 'tr3slog-support-cases'

const STATUS_TONES = {
  open: { bg: 'rgba(217,154,0,.14)', fg: '#8A6300' },
  pending: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  resolved: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  closed: { bg: '#EEF4FC', fg: '#10233F' },
}

export const caseNumber = (t) => t?.id ? `CS-${String(t.id).padStart(6, '0')}` : '—'

export default function Support({ app, token }) {
  const s = app.support
  const [subjectType, setSubjectType] = React.useState('')
  const [customSubject, setCustomSubject] = React.useState('')
  const [ship, setShip] = React.useState('')
  const [msg, setMsg] = React.useState('')

  const subject = subjectType === 'other'
    ? customSubject
    : (s.f.subjectOptions?.[subjectType] || '')
  const [formError, setFormError] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [shipments, setShipments] = React.useState([])
  const [cases, setCases] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(null)
  const [lastTicket, setLastTicket] = React.useState(null)
  const [showHidden, setShowHidden] = React.useState(false)
  const [sortMode, setSortMode] = React.useState('recent')

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(CASES_KEY)
      if (raw) setCases(JSON.parse(raw))
    } catch (e) {}
  }, [])

  const saveCases = (list) => {
    setCases(list)
    try { localStorage.setItem(CASES_KEY, JSON.stringify(list)) } catch (e) {}
  }

  const hideCase = (c, hidden = true) => {
    saveCases(cases.map((x) => x.id === c.id ? { ...x, hidden } : x))
  }

  const sortedCases = sortRows(cases, sortMode, { date: (c) => c.id, text: (c) => c.subject })

  const refreshStatus = async (c) => {
    if (!token || refreshing) return
    setRefreshing(c.id)
    try {
      const t = await api.getSupportTicket(c.id, token)
      const checkedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      saveCases(cases.map((x) => x.id === c.id ? { ...x, status: t.status || x.status, checkedAt, checkError: false } : x))
    } catch (e) {
      saveCases(cases.map((x) => x.id === c.id ? { ...x, checkError: true } : x))
    } finally {
      setRefreshing(null)
    }
  }

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
    if (sending) return
    const missing = !subject.trim() || !msg.trim()
    if (missing) {
      setFormError('Complete los campos obligatorios.')
      return
    }
    setFormError(false)
    setSending(true)
    try {
      const body = ship ? `${msg}\n\n${s.f.ship}: ${ship}` : msg
      const res = await api.createSupport({ subject, message: body, ship }, token)
      setSent(true)
      if (res?.ticket) {
        setLastTicket(res.ticket)
        saveCases([{ id: res.ticket.id, subject, status: res.ticket.status, ship }, ...cases])
      }
      setSubjectType('')
      setCustomSubject('')
      setShip('')
      setMsg('')
    } catch (err) {
      setFormError(err.message || 'No se pudo enviar el caso.')
    } finally {
      setSending(false)
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
            <select
              value={subjectType}
              onChange={(e) => { setSubjectType(e.target.value); setCustomSubject(''); setFormError(false) }}
              style={{
                width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5',
                borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
                appearance: 'none',
              }}
            >
              <option value="">{s.f.subjectPh}</option>
              {Object.entries(s.f.subjectOptions || {}).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {subjectType === 'other' && (
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{s.f.manualSubject}</label>
              <input
                value={customSubject}
                onChange={(e) => { setCustomSubject(e.target.value); setFormError(false) }}
                placeholder={s.f.manualSubjectPh}
                style={{
                  width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5',
                  borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
                }}
              />
            </div>
          )}

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
              <div>
                {s.sent}
                {lastTicket && (
                  <div style={{ marginTop: 6, fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                    {s.refLabel || 'Referencia:'} {caseNumber(lastTicket)}
                  </div>
                )}
              </div>
            </div>
          )}

          <button onClick={submit} disabled={sending} style={{
            padding: 16, background: sending ? '#8FC6F7' : '#087CF0', border: 'none', borderRadius: 11,
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer',
          }}>{sending ? 'Enviando…' : s.submit}</button>
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
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span>{s.openT}</span>
              <span style={{ marginLeft: 'auto' }}><SortControl value={sortMode} onChange={setSortMode} labels={app.sort} /></span>
            </div>
            <div style={{ padding: '18px 22px', borderTop: '1px solid #E3EBF7', fontSize: 14, lineHeight: 1.6, color: '#10233F' }}>
              {cases.length === 0 ? s.openEmpty : s.openNote}
            </div>
            {sortedCases.filter((c) => !c.hidden).map((c) => {
              const tone = STATUS_TONES[c.status] || STATUS_TONES.open
              return (
                <div key={c.id} style={{ padding: '16px 22px', borderTop: '1px solid #E3EBF7', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{caseNumber(c)} · {c.subject}</div>
                    {c.ship && <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>{s.f.ship}: {c.ship}</div>}
                    {c.checkError && <div style={{ fontSize: 12, color: '#A93226', marginTop: 2 }}>{s.statusErr || 'No se pudo consultar el estado.'}</div>}
                    {!c.checkError && c.checkedAt && <div style={{ fontSize: 12, color: '#0F5F36', marginTop: 2 }}>{s.statusChecked || 'Estado consultado'} · {c.checkedAt}</div>}
                  </div>
                  <button
                    onClick={() => refreshStatus(c)}
                    disabled={refreshing === c.id}
                    style={{
                      marginLeft: 'auto', background: 'none', border: 'none', padding: 0,
                      cursor: refreshing === c.id ? 'wait' : 'pointer', fontSize: 12,
                      fontWeight: 600, color: '#087CF0', whiteSpace: 'nowrap',
                    }}
                  >{refreshing === c.id ? '…' : (s.checkStatus || 'Consultar estado')}</button>
                  <button
                    onClick={() => hideCase(c)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, color: '#6C82A6', whiteSpace: 'nowrap',
                    }}
                  >{s.hide || 'Ocultar'}</button>
                  <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: tone.bg, color: tone.fg, whiteSpace: 'nowrap' }}>{(s.statuses || {})[c.status] || c.status}</span>
                </div>
              )
            })}
            {cases.some((c) => c.hidden) && (
              <>
                <button
                  onClick={() => setShowHidden(!showHidden)}
                  style={{
                    width: '100%', padding: '12px 22px', borderTop: '1px solid #E3EBF7',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    fontSize: 12, fontWeight: 600, color: '#6C82A6',
                    letterSpacing: '.06em', textTransform: 'uppercase',
                  }}
                >{s.hiddenT || 'Casos ocultos'} ({sortedCases.filter((c) => c.hidden).length}) {showHidden ? '▲' : '▼'}</button>
                {showHidden && sortedCases.filter((c) => c.hidden).map((c) => {
                  const tone = STATUS_TONES[c.status] || STATUS_TONES.open
                  return (
                    <div key={c.id} style={{ padding: '14px 22px', borderTop: '1px solid #F0F5FB', display: 'flex', gap: 10, alignItems: 'center', opacity: .65 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{caseNumber(c)} · {c.subject}</div>
                      </div>
                      <button
                        onClick={() => hideCase(c, false)}
                        style={{
                          marginLeft: 'auto', background: 'none', border: 'none', padding: 0,
                          cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#087CF0',
                          whiteSpace: 'nowrap',
                        }}
                      >{s.show || 'Mostrar'}</button>
                      <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: tone.bg, color: tone.fg, whiteSpace: 'nowrap' }}>{(s.statuses || {})[c.status] || c.status}</span>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
