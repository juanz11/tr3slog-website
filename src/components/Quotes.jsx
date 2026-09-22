import React from 'react'
import { api } from '../api'
import { Pagination, usePagination } from './Shared'

const STATUS_COLORS = {
  pending: { bg: 'rgba(217,154,0,.12)', fg: '#8A6300' },
  processing: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  approved: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  rejected: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

const STATUS_LABELS = {
  es: { pending: 'Pendiente', processing: 'En proceso', approved: 'Aprobada', rejected: 'Rechazada' },
  en: { pending: 'Pending', processing: 'Processing', approved: 'Approved', rejected: 'Rejected' },
  'zh-CN': { pending: '待处理', processing: '处理中', approved: '已批准', rejected: '已拒绝' },
}

const DEMO_QUOTES = [
  { id: 'QT-0001', origin: 'Santo Domingo, RD', destination: 'Punta Cana, RD', service_type: 'Economy Same-Day', client_name: 'Comercial Bayamón LLC', client_email: 'compras@bayamon.com', pieces: '12', weight: '48 kg', created_at: '2025-07-28T09:15:00.000Z', status: 'pending' },
  { id: 'QT-0002', origin: 'Santo Domingo, RD', destination: 'Santiago, RD', service_type: 'Priority Same-Day', client_name: 'Farmacias del Este', client_email: 'logistica@farmaciasdeleste.do', pieces: '4', weight: '9 kg', created_at: '2025-07-28T10:30:00.000Z', status: 'processing' },
  { id: 'QT-0003', origin: 'Santo Domingo, RD', destination: 'La Romana, RD', service_type: 'Express Direct', client_name: 'Importadora Caribe', client_email: 'ops@importadoracaribe.com', pieces: '30', weight: '120 kg', created_at: '2025-07-28T11:45:00.000Z', status: 'approved' },
]

const quoteClient = (quote) => {
  const c = quote.client || quote.user || {}
  return {
    name: quote.client_name || c.name || '',
    email: quote.client_email || quote.email || c.email || '',
    phone: quote.client_phone || quote.phone || c.phone || '',
  }
}

function DetailField({ label, value, wide }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: '#10233F', overflowWrap: 'anywhere' }}>{value}</div>
    </div>
  )
}

function QuoteDetail({ q, lang, quote, onClose }) {
  const det = q.detail
  const f = det.fields
  const style = STATUS_COLORS[quote.status] || STATUS_COLORS.pending
  const statusLabel = (STATUS_LABELS[lang] || STATUS_LABELS.es)[quote.status] || quote.status
  const code = quote.tracking_code || quote.code || quote.id
  const client = quoteClient(quote)

  const locale = lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'es-ES'
  const fmt = (date) => {
    if (!date) return ''
    const dt = new Date(date)
    if (isNaN(dt.getTime())) return ''
    return dt.toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const card = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: '18px 20px' }
  const secTitle = { fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', margin: '0 0 14px', color: '#001B45' }
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(16,35,63,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#F6F9FD', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '88vh', overflowY: 'auto', padding: 24, boxShadow: '0 20px 60px rgba(0,27,69,.18)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 22, margin: 0, color: '#001B45' }}>{code}</h2>
          <span className="app-status" style={{ background: style.bg, color: style.fg }}>{statusLabel}</span>
          <button onClick={onClose} aria-label={det.close} style={{ marginLeft: 'auto', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 22, lineHeight: 1, color: '#6C82A6' }}>×</button>
        </div>

        <div style={card}>
          <div style={secTitle}>{det.sections.general}</div>
          <div style={grid}>
            <DetailField label={f.code} value={code} />
            <DetailField label={f.service} value={quote.service_type || quote.service} />
            <DetailField label={f.origin} value={quote.origin} />
            <DetailField label={f.destination} value={quote.destination} />
            <DetailField label={f.status} value={statusLabel} />
            <DetailField label={f.eta} value={fmt(quote.estimated_delivery)} />
          </div>
        </div>

        {(client.name || client.email || client.phone) && (
          <div style={card}>
            <div style={secTitle}>{det.sections.client}</div>
            <div style={grid}>
              <DetailField label={f.name} value={client.name} />
              <DetailField label={f.email} value={client.email} />
              <DetailField label={f.phone} value={client.phone} />
            </div>
          </div>
        )}

        {(quote.pieces || quote.weight || quote.dimensions) && (
          <div style={card}>
            <div style={secTitle}>{det.sections.cargo}</div>
            <div style={grid}>
              <DetailField label={f.pieces} value={quote.pieces} />
              <DetailField label={f.weight} value={quote.weight} />
              <DetailField label={f.dimensions} value={quote.dimensions} />
            </div>
          </div>
        )}

        {quote.details && (
          <div style={card}>
            <div style={secTitle}>{det.sections.details}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#10233F' }}>{quote.details}</div>
          </div>
        )}

        <div style={card}>
          <div style={secTitle}>{det.sections.dates}</div>
          <div style={grid}>
            <DetailField label={f.created} value={fmt(quote.created_at)} />
            <DetailField label={f.updated} value={fmt(quote.updated_at)} />
            <DetailField label={f.viewed} value={fmt(quote.viewed_at)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Quotes({ app, lang, token }) {
  const q = app.quotes
  const [quotes, setQuotes] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [readOnly, setReadOnly] = React.useState(false)
  const [updating, setUpdating] = React.useState(null)
  const [selected, setSelected] = React.useState(null)

  const fetchQuotes = React.useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await api.getQuotes(token)
      setQuotes(Array.isArray(data) ? data : data.data || [])
      setReadOnly(false)
    } catch (e) {
      setQuotes(DEMO_QUOTES)
      setReadOnly(true)
    } finally {
      setLoading(false)
    }
  }, [token])

  React.useEffect(() => {
    fetchQuotes()
    const interval = setInterval(fetchQuotes, 30000)
    return () => clearInterval(interval)
  }, [fetchQuotes])

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleString(lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  const statusLabel = (status) => (STATUS_LABELS[lang] || STATUS_LABELS.es)[status] || status

  const pager = usePagination(quotes, 10)

  const handleStatusChange = React.useCallback(async (id, status) => {
    if (readOnly) return
    setUpdating(id)
    try {
      const updated = await api.updateQuoteStatus(id, status, token)
      setQuotes((prev) => prev.map((quote) => quote.id === id ? { ...quote, ...updated } : quote))
    } catch (e) {
      setReadOnly(true)
    } finally {
      setUpdating(null)
    }
  }, [token, readOnly])

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{q.greeting}</div>
      <h1 className="app-h1">{q.title}</h1>

      {readOnly && (
        <div style={{ padding: 14, background: 'rgba(8,124,240,.1)', color: '#0768C9', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          Mostrando cotizaciones de referencia. El backend no permite editar el estado.
        </div>
      )}

      <div className="app-card">
        <div className="app-card-head">
          <span className="app-card-title">{q.listTitle}</span>
          <span style={{ fontSize: 13, color: '#6C82A6' }}>
            {loading ? q.loading : `${q.autoRefresh} 30s`}
          </span>
        </div>
        <div className="app-table-scroll">
          <div className="app-table">
            <div className="app-table-head" style={{ gridTemplateColumns: '.9fr 1.1fr 1.1fr .8fr .9fr .9fr .7fr .4fr' }}>
              <span>{q.cols.tracking}</span>
              <span>{q.cols.origin}</span>
              <span>{q.cols.destination}</span>
              <span>{q.cols.type}</span>
              <span>{q.cols.client}</span>
              <span>{q.cols.date}</span>
              <span>{q.cols.status}</span>
              <span>{q.cols.actions}</span>
            </div>
            {quotes.length === 0 && !loading && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>
                {q.empty}
              </div>
            )}
            {pager.pageItems.map((quote) => {
              const style = STATUS_COLORS[quote.status] || STATUS_COLORS.pending
              const statusOptions = Object.keys(STATUS_COLORS)
              return (
                <div key={quote.id} className="app-table-row" style={{ gridTemplateColumns: '.9fr 1.1fr 1.1fr .8fr .9fr .9fr .7fr .4fr', alignItems: 'center' }}>
                  <span className="app-table-id" title={quote.tracking_code || quote.id}>{quote.tracking_code || quote.id}</span>
                  <span className="app-table-text" title={quote.origin}>{quote.origin}</span>
                  <span className="app-table-text" title={quote.destination}>{quote.destination}</span>
                  <span className="app-table-text">{quote.service_type || '-'}</span>
                  <span className="app-table-text">
                    {quoteClient(quote).name}
                    {quoteClient(quote).email && (
                      <span style={{ display: 'block', fontSize: 11, color: '#6C82A6', fontWeight: 400 }}>{quoteClient(quote).email}</span>
                    )}
                  </span>
                  <span className="app-table-text">{formatDate(quote.created_at)}</span>
                  <select
                    className="app-status"
                    value={quote.status}
                    disabled={readOnly || updating === quote.id}
                    onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                    style={{
                      backgroundColor: style.bg,
                      color: style.fg,
                      border: 'none',
                      borderRadius: 100,
                      cursor: 'pointer',
                      opacity: updating === quote.id ? 0.6 : 1,
                    }}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                  <span style={{ justifySelf: 'end' }}>
                    <button
                      onClick={() => setSelected(quote)}
                      aria-label={q.view}
                      title={q.view}
                      style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#087CF0', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Pagination pager={pager} labels={app.pager} />
      </div>

      {selected && (
        <QuoteDetail q={q} lang={lang} quote={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
