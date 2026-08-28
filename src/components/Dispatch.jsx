import React from 'react'
import { api } from '../api'

const STATUS_COLORS = {
  pending: { bg: '#EEF4FC', fg: '#10233F' },
  in_transit: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  out_for_delivery: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  delivered: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  incident: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

const NEXT_STATUS = {
  pending: 'in_transit',
  in_transit: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

export default function Dispatch({ app, lang, token }) {
  const d = app.dispatch
  const [shipments, setShipments] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [updateError, setUpdateError] = React.useState('')
  const [updatingId, setUpdatingId] = React.useState(null)
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState('all')

  const fetchShipments = React.useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await api.getShipments(token)
      setShipments(Array.isArray(data) ? data : data.data || [])
    } catch (e) {
      setError(e.message || d.error)
    } finally {
      setLoading(false)
    }
  }, [token, d.error])

  React.useEffect(() => {
    fetchShipments()
    const interval = setInterval(fetchShipments, 30000)
    return () => clearInterval(interval)
  }, [fetchShipments])

  const formatDate = (date) => {
    if (!date) return '—'
    const dt = new Date(date)
    return dt.toLocaleString(lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'es-ES', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })
  }

  const statusLabel = (status) => d.statuses[status] || status

  const filtered = shipments.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || [s.tracking_number, s.origin, s.destination, s.recipient_name]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q))
    return matchesFilter && matchesQuery
  })

  const formatTracking = (s) => {
    if (s.parsed_tracking) {
      const pt = s.parsed_tracking
      return `${pt.location_name} · ${pt.package_type_name}`
    }
    return s.tracking_number || `#${s.id}`
  }

  const advanceStatus = async (shipment) => {
    const next = NEXT_STATUS[shipment.status]
    if (!next) return
    setUpdatingId(shipment.id)
    setUpdateError('')
    try {
      const updated = await api.updateShipmentStatus(shipment.id, next, token)
      setShipments((prev) => prev.map((s) => (s.id === shipment.id ? { ...s, ...updated } : s)))
    } catch (e) {
      setUpdateError(e.message || d.updateError)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>
      <h1 className="app-h1">{d.title}</h1>

      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}
      {updateError && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {updateError}
        </div>
      )}

      <div className="app-card">
        <div className="app-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="app-card-title">{d.listTitle}</span>
          <span style={{ fontSize: 13, color: '#6C82A6' }}>
            {loading ? d.loading : `${d.autoRefresh} 30s`}
          </span>
        </div>

        <div style={{ padding: '14px 18px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={d.searchPh}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#001B45' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {d.filters.map((f) => {
              const on = f === filter
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '9px 14px',
                    border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                    borderRadius: 100,
                    background: on ? 'rgba(8,124,240,.08)' : '#fff',
                    color: on ? '#0768C9' : '#10233F',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >{f === 'all' ? d.filterAll : statusLabel(f)}</button>
              )
            })}
          </div>
        </div>

        <div className="app-table-scroll">
          <div className="app-table">
            <div className="app-table-head" style={{ gridTemplateColumns: '1fr 1.4fr 1fr .9fr .9fr .9fr 1.2fr' }}>
              <span>{d.cols.tracking}</span>
              <span>{d.cols.route}</span>
              <span>{d.cols.recipient}</span>
              <span>{d.cols.service}</span>
              <span>{d.cols.status}</span>
              <span>{d.cols.updatedAt}</span>
              <span>{d.cols.actions}</span>
            </div>
            {filtered.length === 0 && !loading && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>
                {d.empty}
              </div>
            )}
            {filtered.map((s) => {
              const style = STATUS_COLORS[s.status] || STATUS_COLORS.pending
              const next = NEXT_STATUS[s.status]
              return (
                <div key={s.id} className="app-table-row" style={{ gridTemplateColumns: '1fr 1.4fr 1fr .9fr .9fr .9fr 1.2fr', alignItems: 'center' }}>
                  <span className="app-table-id" title={s.tracking_number}>
                    {s.tracking_number || `#${s.id}`}
                    {s.parsed_tracking && (
                      <span style={{ display: 'block', fontSize: 11, color: '#6C82A6', fontWeight: 400 }}>
                        {formatTracking(s)}
                      </span>
                    )}
                  </span>
                  <span className="app-table-text" title={`${s.origin || ''} → ${s.destination || ''}`}>
                    {s.origin || '—'} → {s.destination || '—'}
                  </span>
                  <span className="app-table-text">{s.recipient_name || '—'}</span>
                  <span className="app-table-text">{s.service_type || '—'}</span>
                  <span className="app-status" style={{ background: style.bg, color: style.fg }}>
                    {statusLabel(s.status)}
                  </span>
                  <span className="app-table-text">{formatDate(s.updated_at)}</span>
                  <span>
                    {next && s.status !== 'incident' && (
                      <button
                        onClick={() => advanceStatus(s)}
                        disabled={updatingId === s.id}
                        style={{
                          border: 'none', borderRadius: 8, padding: '8px 12px',
                          background: '#087CF0', color: '#fff', fontSize: 12, fontWeight: 600,
                          cursor: updatingId === s.id ? 'not-allowed' : 'pointer',
                          opacity: updatingId === s.id ? .7 : 1,
                        }}
                      >{updatingId === s.id ? d.updating : d.advanceTo[next]}</button>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
