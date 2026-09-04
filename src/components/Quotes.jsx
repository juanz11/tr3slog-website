import React from 'react'
import { api } from '../api'

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

export default function Quotes({ app, lang, token }) {
  const q = app.quotes
  const [quotes, setQuotes] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [updating, setUpdating] = React.useState(null)

  const fetchQuotes = React.useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await api.getQuotes(token)
      setQuotes(Array.isArray(data) ? data : data.data || [])
    } catch (e) {
      setError(e.message || q.error)
    } finally {
      setLoading(false)
    }
  }, [token, q.error])

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

  const handleStatusChange = React.useCallback(async (id, status) => {
    setUpdating(id)
    try {
      const updated = await api.updateQuoteStatus(id, status, token)
      setQuotes((prev) => prev.map((quote) => quote.id === id ? { ...quote, ...updated } : quote))
    } catch (e) {
      setError(e.message || q.error)
    } finally {
      setUpdating(null)
    }
  }, [token, q.error])

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{q.greeting}</div>
      <h1 className="app-h1">{q.title}</h1>

      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {error}
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
            <div className="app-table-head" style={{ gridTemplateColumns: '1.2fr 1.2fr .8fr 1fr 1fr .8fr' }}>
              <span>{q.cols.origin}</span>
              <span>{q.cols.destination}</span>
              <span>{q.cols.type}</span>
              <span>{q.cols.client}</span>
              <span>{q.cols.date}</span>
              <span>{q.cols.status}</span>
            </div>
            {quotes.length === 0 && !loading && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>
                {q.empty}
              </div>
            )}
            {quotes.map((quote) => {
              const style = STATUS_COLORS[quote.status] || STATUS_COLORS.pending
              const statusOptions = Object.keys(STATUS_COLORS)
              return (
                <div key={quote.id} className="app-table-row" style={{ gridTemplateColumns: '1.2fr 1.2fr .8fr 1fr 1fr .8fr', alignItems: 'center' }}>
                  <span className="app-table-text" title={quote.origin}>{quote.origin}</span>
                  <span className="app-table-text" title={quote.destination}>{quote.destination}</span>
                  <span className="app-table-text">{quote.service_type || '-'}</span>
                  <span className="app-table-text">{quote.client_name}</span>
                  <span className="app-table-text">{formatDate(quote.created_at)}</span>
                  <select
                    className="app-status"
                    value={quote.status}
                    disabled={updating === quote.id}
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
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
