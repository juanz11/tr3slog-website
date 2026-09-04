import React from 'react'
import { api } from '../api'

const CITY_CODES = {
  'san juan': 'PRSJ', 'santo domingo': 'DOSD', 'punta cana': 'DOPC', 'miami': 'MIAM',
  'new york': 'NYNY', 'atlanta': 'ATLG', 'montego bay': 'JAMB', 'seoul': 'KRSE',
  'tokyo': 'JPTY', 'shanghai': 'CNSH', 'caracas': 'VECC', 'valencia': 'VEVL',
  'maracaibo': 'VEMA', 'montevideo': 'UYMV', 'punta del este': 'UYPE',
  'paysandú': 'UYPA', 'paysandu': 'UYPA', 'salto': 'UYSA', 'colonia': 'UYCO',
}

function getCityCode(city) {
  const value = String(city || '').toLowerCase().trim()
  return CITY_CODES[value] || value.substring(0, 4).toUpperCase()
}

const STATUS_TONE = [
  { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  { bg: '#EEF4FC', fg: '#10233F' },
  { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
]

const statusIndex = (status, statuses) => {
  if (typeof status === 'number') return status
  const list = statuses || []
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'pending') return 3
  const idx = list.findIndex((s) => s && s.toLowerCase() === normalized)
  return idx >= 0 ? idx : 0
}

function formatDate(date) {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const buildRow = (sh, statuses) => ({
  id: sh.tracking_number || sh.id || sh.guide || '',
  route: `${getCityCode(sh.origin)} → ${getCityCode(sh.destination)}`,
  service: sh.service_type || sh.service || '',
  status: statusIndex(sh.status, statuses),
  eta: sh.eta || sh.estimated_delivery || formatDate(sh.created_at) || formatDate(sh.updated_at) || '—',
  parsed_tracking: sh.parsed_tracking || null,
  tracking_url: sh.tracking_url || null,
  raw: sh,
})

function DetailView({ app, shipment, onClose }) {
  const s = app.ship || {}
  const pt = shipment.parsed_tracking || {}
  const idx = statusIndex(shipment.status, s.statuses)
  const statusLabel = (s.statuses || [])[idx] || shipment.status
  const tone = STATUS_TONE[idx] || STATUS_TONE[0]

  const tracking = shipment.tracking_number || `#${shipment.id}`
  const route = `${shipment.origin || '—'} → ${shipment.destination || '—'}`
  const service = shipment.service_type || pt.package_type_name || '—'

  const created = shipment.created_at ? new Date(shipment.created_at) : null

  const TIMELINE = [
    { label: 'Solicitud recibida', loc: 'Portal del cliente' },
    { label: 'Mercancía recibida', loc: shipment.origin || '—' },
    { label: 'En procesamiento', loc: 'Centro de consolidación' },
    { label: 'En tránsito', loc: `En ruta a ${shipment.destination || '—'}` },
    { label: 'En ruta de entrega', loc: shipment.destination || '—' },
    { label: 'Entregada', loc: '—' },
    { label: 'Incidencia', loc: '—' },
  ]
  const STATUS_TO_TIMELINE = { 3: 0, 0: 3, 1: 4, 2: 5, 4: 6 }
  const currentIdx = STATUS_TO_TIMELINE[idx] ?? 0

  const fmt = (d) => {
    if (!d || isNaN(d.getTime())) return '—'
    return `${d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  }

  const stepDate = (i) => {
    if (i > currentIdx || !created) return null
    return new Date(created.getTime() + i * 86400000)
  }

  const charges = shipment.charges || []
  const documents = shipment.documents || []
  const showProof = idx === 2 && shipment.delivery_proof

  const cardBase = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 24 }
  const sectionTitle = { fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 20, color: '#001B45' }
  const label = { fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 10 }
  const value = { fontSize: 14, lineHeight: 1.7, color: '#10233F' }

  return (
    <div style={{ width: '100%' }}>
      <button onClick={onClose} style={{ background: 'none', border: 'none', padding: 0, marginBottom: 14, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>← Volver a mis envíos</button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: 0, color: '#001B45' }}>{tracking}</h1>
        <span style={{ display: 'inline-flex', padding: '8px 15px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: tone.bg, color: tone.fg }}>{statusLabel}</span>
        <span style={{ fontSize: 14, color: '#10233F' }}>{route} · {service}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr .65fr', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardBase}>
            <div style={sectionTitle}>Línea de tiempo completa</div>
            {TIMELINE.map((step, i) => {
              const completed = i < currentIdx
              const current = i === currentIdx
              const dotBg = current ? '#D99A00' : (completed ? '#087CF0' : '#fff')
              const dotBorder = current || completed ? '3px solid rgba(8,124,240,.18)' : '3px solid #DCE6F5'
              const titleColor = i > currentIdx ? '#8B9DBA' : '#001B45'
              const date = stepDate(i)
              return (
                <div key={step.label} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: dotBg, border: dotBorder, flex: '0 0 auto' }}></span>
                    <span style={{ flex: '1 1 0%', width: 2, background: i < currentIdx ? '#087CF0' : '#DCE6F5', minHeight: 30 }}></span>
                  </div>
                  <div style={{ paddingBottom: 16 }}>
                    <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 600, fontSize: 14, color: titleColor }}>{step.label}</div>
                    <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 3 }}>{date ? fmt(date) : 'Pendiente'} · {step.loc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={cardBase}>
              <div style={label}>Remitente</div>
              <div style={value}>{shipment.sender_name || '—'}</div>
              <div style={value}>{shipment.origin || '—'}</div>
            </div>
            <div style={cardBase}>
              <div style={label}>Destinatario</div>
              <div style={value}>{shipment.recipient_name || '—'}</div>
              <div style={value}>{shipment.destination || '—'}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardBase}>
            <div style={sectionTitle}>Cargos</div>
            {charges.length ? charges.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', color: '#10233F' }}>
                <span>{c.label}</span><span style={{ fontWeight: 600, color: '#001B45' }}>{c.amount}</span>
              </div>
            )) : <div style={{ fontSize: 14, color: '#6C82A6', padding: '8px 0' }}>Cargos aún no disponibles.</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 14, borderTop: '1px solid #DCE6F5' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18 }}>{shipment.total || '—'}</span>
            </div>
          </div>

          <div style={cardBase}>
            <div style={sectionTitle}>Documentos</div>
            {documents.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {documents.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', border: '1px solid #DCE6F5', borderRadius: 11 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#087CF0" strokeWidth="1.7"><path d="M6 3h8l4 4v14H6zM14 3v4h4"></path></svg>
                    <span style={{ flex: '1 1 0%', fontSize: 13, fontWeight: 600 }}>{doc.name}</span>
                    {doc.url ? (
                      <button onClick={() => window.open(doc.url, '_blank')} style={{ border: 'none', background: 'none', padding: '6px 2px', cursor: 'pointer', font: 'inherit', color: '#087CF0' }}>Descargar</button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#6C82A6' }}>Pendiente</span>
                    )}
                  </div>
                ))}
              </div>
            ) : <div style={{ fontSize: 14, color: '#6C82A6', padding: '8px 0' }}>Documentos aún no disponibles.</div>}
          </div>

          {showProof && (
            <div style={cardBase}>
              <div style={sectionTitle}>Evidencia de entrega</div>
              <div style={{ height: 180, borderRadius: 12, overflow: 'hidden', background: '#EEF4FC' }}>
                {shipment.delivery_proof ? (
                  <img src={shipment.delivery_proof} alt="Fotografía de entrega" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B9DBA', fontSize: 13 }}>Fotografía de entrega</div>
                )}
              </div>
              <button style={{ width: '100%', marginTop: 14, padding: 14, background: '#087CF0', border: 'none', borderRadius: 11, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ver expediente completo →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShipmentsList({ app, token, query: externalQuery, onQueryChange }) {
  const s = app.ship
  const isControlled = typeof externalQuery !== 'undefined'
  const [internalQuery, setInternalQuery] = React.useState('')
  const query = isControlled ? externalQuery : internalQuery
  const setQuery = isControlled ? onQueryChange : setInternalQuery
  const [filter, setFilter] = React.useState(0)
  const [shipments, setShipments] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [selected, setSelected] = React.useState(null)

  React.useEffect(() => {
    if (!token) {
      setLoading(false)
      setError('Inicie sesión para ver sus envíos.')
      return
    }
    setLoading(true)
    setError('')
    api.getShipments(token)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || [])
        setShipments(list.map((sh) => buildRow(sh, s.statuses)))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token, s.statuses])

  const filtered = shipments.filter((r) => {
    const matchesFilter = filter === 0 || r.status === filter - 1
    const q = query.toLowerCase()
    const matchesQuery = !q || r.id.toLowerCase().includes(q) || r.route.toLowerCase().includes(q) || s.statuses[r.status].toLowerCase().includes(q)
    return matchesFilter && matchesQuery
  })

  if (selected) {
    return <DetailView app={app} shipment={selected} onClose={() => setSelected(null)} />
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        <span style={{ width: 24, height: 5, background: '#D99A00', transform: 'skewX(-24deg)' }}></span>
        <span style={{ width: 9, height: 5, background: '#087CF0', transform: 'skewX(-24deg)' }}></span>
      </div>

      <h1 style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: '-.02em',
        margin: '0 0 20px',
        color: '#001B45',
      }}>{s.title}</h1>

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <input
              value={query || ''}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filtered.length) {
                  const exact = filtered.find((r) => r.id.toLowerCase() === (query || '').toLowerCase())
                  setSelected((exact || filtered[0]).raw)
                }
              }}
              placeholder={s.searchPh}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#001B45' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {s.filters.map((f, i) => {
              const on = i === filter
              return (
                <button
                  key={i}
                  onClick={() => setFilter(i)}
                  style={{
                    padding: '10px 14px',
                    border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                    borderRadius: 100,
                    background: on ? 'rgba(8,124,240,.08)' : '#fff',
                    color: on ? '#0768C9' : '#10233F',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >{f}</button>
              )
            })}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 760 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr 1fr 0.7fr 0.5fr',
              gap: 12, padding: '12px 22px', fontSize: 11, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#6C82A6',
            }}>
              {s.cols.map((col, i) => <span key={i}>{col}</span>)}
            </div>
            {loading && (
              <div style={{ padding: 30, textAlign: 'center', color: '#6C82A6' }}>Cargando envíos…</div>
            )}
            {error && (
              <div style={{ padding: 30, textAlign: 'center', color: '#A93226' }}>{error}</div>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: '#6C82A6' }}>No hay envíos para mostrar.</div>
            )}
            {!loading && filtered.map((r, i) => (
              <div key={r.id || i} style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr 1fr 0.7fr 0.5fr',
                gap: 12, padding: '16px 22px', borderTop: '1px solid #E3EBF7', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{r.id}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.route}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.service}</span>
                <span style={{
                  display: 'inline-flex', padding: '5px 11px', borderRadius: 100,
                  fontSize: 11, fontWeight: 600,
                  background: STATUS_TONE[r.status].bg, color: STATUS_TONE[r.status].fg,
                  justifySelf: 'start',
                }}>{s.statuses[r.status]}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.eta}</span>
                <button onClick={() => setSelected(r.raw)} style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{s.view}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
