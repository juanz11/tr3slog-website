import React from 'react'
import { api } from '../api'
import { Pagination, usePagination, usePolling } from './Shared'

const I18N = {
  es: {
    title: 'Solicitudes de recolección',
    sub: 'Solicitudes de conductores para tomar envíos sin asignar.',
    filterAll: 'Todas',
    filters: { pending: 'Pendientes', approved: 'Aprobadas', rejected: 'Rechazadas' },
    cols: ['Guía', 'Ruta', 'Conductor', 'Mensaje', 'Estado', ''],
    empty: 'No hay solicitudes.',
    approve: 'Aprobar',
    reject: 'Rechazar',
    notePh: 'Nota para el conductor (opcional)',
    error: 'No se pudo actualizar la solicitud.',
    updated: 'Solicitud actualizada.',
    statuses: { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada' },
  },
  en: {
    title: 'Pickup requests',
    sub: 'Driver requests to take unassigned shipments.',
    filterAll: 'All',
    filters: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
    cols: ['Tracking', 'Route', 'Driver', 'Message', 'Status', ''],
    empty: 'No requests.',
    approve: 'Approve',
    reject: 'Reject',
    notePh: 'Note for the driver (optional)',
    error: 'Could not update the request.',
    updated: 'Request updated.',
    statuses: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
  },
  'zh-CN': {
    title: '取件请求',
    sub: '司机请求接取未分配货件。',
    filterAll: '全部',
    filters: { pending: '待处理', approved: '已批准', rejected: '已拒绝' },
    cols: ['追踪号', '路线', '司机', '留言', '状态', ''],
    empty: '暂无请求。',
    approve: '批准',
    reject: '拒绝',
    notePh: '给司机的备注（可选）',
    error: '无法更新请求。',
    updated: '请求已更新。',
    statuses: { pending: '待处理', approved: '已批准', rejected: '已拒绝' },
  },
}

const STATUS_COLORS = {
  pending: { bg: 'rgba(217,154,0,.12)', fg: '#8A6300' },
  approved: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  rejected: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

export default function ShipmentRequests({ app, lang, token }) {
  const d = I18N[lang] || I18N.es
  const [requests, setRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState('pending')
  const [busy, setBusy] = React.useState(null)
  const [notes, setNotes] = React.useState({})

  const fetchRequests = React.useCallback(async (isPoll = false) => {
    if (!token) return
    if (!isPoll) setLoading(true)
    try {
      const data = await api.getShipmentRequests(token)
      setRequests(Array.isArray(data) ? data : data.data || [])
    } catch (e) {
      setRequests([])
    } finally {
      if (!isPoll) setLoading(false)
    }
  }, [token])

  usePolling(fetchRequests, 30000)

  const statusOf = (req) => req.status || 'pending'
  const counts = React.useMemo(() => {
    const c = { all: requests.length, pending: 0, approved: 0, rejected: 0 }
    requests.forEach((r) => {
      const s = statusOf(r)
      if (c[s] !== undefined) c[s] += 1
    })
    return c
  }, [requests])

  const filtered = React.useMemo(
    () => (filter === 'all' ? requests : requests.filter((r) => statusOf(r) === filter)),
    [requests, filter]
  )
  const pager = usePagination(filtered, 10, `${filter}-${requests.length}`)
  const pageItems = filtered.slice(pager.start, pager.start + pager.perPage)

  const updateStatus = async (req, status) => {
    setBusy(req.id)
    try {
      await api.updateShipmentRequest(req.id, {
        status,
        review_notes: notes[req.id] || '',
      }, token)
      fetchRequests(false)
    } catch (e) {
      alert(d.error)
    } finally {
      setBusy(null)
    }
  }

  const onNoteChange = (id, value) => setNotes((prev) => ({ ...prev, [id]: value }))

  return (
    <div>
      <section className="section-pad" style={{ background: '#001B45', padding: '66px 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 46, color: '#fff', margin: 0 }}>{d.title}</h1>
          <p style={{ color: '#C6D6EF', margin: '12px 0 0' }}>{d.sub}</p>
        </div>
      </section>

      <section className="section-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[['all', d.filterAll], ['pending', d.filters.pending], ['approved', d.filters.approved], ['rejected', d.filters.rejected]]
            .map(([key, label]) => {
              const on = filter === key
              const count = counts[key] || 0
              const isPending = key === 'pending' && count > 0
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px',
                    borderRadius: 100,
                    border: '1.5px solid ' + (on ? '#001B45' : isPending ? '#C0392B' : '#DCE6F5'),
                    background: on ? '#001B45' : '#fff',
                    color: on ? '#fff' : '#001B45',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                  <span style={{
                    minWidth: 20, height: 20, padding: '0 6px', borderRadius: 100,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    background: isPending ? '#C0392B' : on ? 'rgba(255,255,255,.22)' : '#EEF4FC',
                    color: isPending || on ? '#fff' : '#6C82A6',
                  }}>
                    {count}
                  </span>
                </button>
              )
            })}
        </div>

        {loading ? (
          <p style={{ color: '#6C82A6' }}>{app?.dispatch?.loading || 'Cargando…'}</p>
        ) : pageItems.length === 0 ? (
          <div style={{ padding: 40, background: '#F6F9FD', borderRadius: 16, textAlign: 'center', color: '#6C82A6' }}>{d.empty}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#F6F9FD' }}>
                  {d.cols.map((c) => (
                    <th key={c} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, textTransform: 'uppercase', color: '#6C82A6', fontWeight: 700 }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((req) => {
                  const s = req.shipment || {}
                  const route = `${s.origin || '—'} → ${s.destination || '—'}`
                  const driver = req.driver?.name || `ID ${req.driver_id}`
                  const st = req.status || 'pending'
                  const color = STATUS_COLORS[st] || STATUS_COLORS.pending
                  return (
                    <tr key={req.id} style={{ borderTop: '1px solid #EDF3FB' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{s.tracking_number || `ENV-${s.id}`}</td>
                      <td style={{ padding: '14px 16px' }}>{route}</td>
                      <td style={{ padding: '14px 16px' }}>{driver}</td>
                      <td style={{ padding: '14px 16px', color: '#6C82A6' }}>{req.message || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 100, background: color.bg, color: color.fg, fontSize: 12, fontWeight: 700 }}>{d.statuses[st] || st}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {st === 'pending' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                            <input
                              type="text"
                              value={notes[req.id] || ''}
                              onChange={(e) => onNoteChange(req.id, e.target.value)}
                              placeholder={d.notePh}
                              style={{ padding: '8px 10px', border: '1px solid #DCE6F5', borderRadius: 8, fontSize: 13 }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                disabled={busy === req.id}
                                onClick={() => updateStatus(req, 'approved')}
                                style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#137A45', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                              >
                                {d.approve}
                              </button>
                              <button
                                disabled={busy === req.id}
                                onClick={() => updateStatus(req, 'rejected')}
                                style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1.5px solid #C0392B', background: '#fff', color: '#A93226', fontWeight: 600, cursor: 'pointer' }}
                              >
                                {d.reject}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div style={{ marginTop: 20 }}>
              <Pagination pager={pager} labels={app.pager} />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
