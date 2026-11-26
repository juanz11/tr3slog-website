import React from 'react'
import { api } from '../api'
import { Pagination, usePagination, usePolling } from './Shared'

const I18N = {
  es: {
    title: 'Solicitudes de recolección',
    sub: 'Solicitudes de conductores para tomar envíos sin asignar y avisos de clientes para entregas de mismo día.',
    filterAll: 'Todas',
    filters: { pending: 'Pendientes', approved: 'Aprobadas', rejected: 'Rechazadas' },
    cols: ['Guía', 'Ruta', 'Tipo', 'Solicitante', 'Mensaje', 'Estado', ''],
    empty: 'No hay solicitudes.',
    approve: 'Aprobar',
    reject: 'Rechazar',
    notePh: 'Nota para el solicitante (opcional)',
    driverPh: 'Asignar conductor…',
    error: 'No se pudo actualizar la solicitud.',
    updated: 'Solicitud actualizada.',
    statuses: { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada' },
    types: { driver: 'Conductor', same_day: 'Mismo día' },
    details: 'Detalles',
    close: 'Cerrar',
    detailTitle: 'Detalle del envío',
    loadingDetail: 'Cargando detalle…',
    dReq: 'Solicitud',
    dRoute: 'Ruta',
    dService: 'Servicio',
    dAmount: 'Monto',
    dClient: 'Cliente',
    dSender: 'Remitente',
    dRecipient: 'Destinatario',
    dDriver: 'Conductor',
    dPackages: 'Paquetes',
    dNotes: 'Notas',
    dHistory: 'Historial de estados',
    dPhone: 'Teléfono',
    dEmail: 'Correo',
    dWeight: 'Peso',
    dDims: 'Dimensiones',
    dPieces: 'Piezas',
    dContent: 'Contenido',
    dType: 'Tipo',
    dBy: 'Solicitante',
    dMsg: 'Mensaje',
    dDate: 'Fecha',
    dReviewedBy: 'Revisado por',
    dReviewNotes: 'Nota de revisión',
  },
  en: {
    title: 'Pickup requests',
    sub: 'Driver requests to take unassigned shipments and client same-day priority notices.',
    filterAll: 'All',
    filters: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
    cols: ['Tracking', 'Route', 'Type', 'Requester', 'Message', 'Status', ''],
    empty: 'No requests.',
    approve: 'Approve',
    reject: 'Reject',
    notePh: 'Note for the requester (optional)',
    driverPh: 'Assign driver…',
    error: 'Could not update the request.',
    updated: 'Request updated.',
    statuses: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
    types: { driver: 'Driver', same_day: 'Same day' },
    details: 'Details',
    close: 'Close',
    detailTitle: 'Shipment details',
    loadingDetail: 'Loading details…',
    dReq: 'Request',
    dRoute: 'Route',
    dService: 'Service',
    dAmount: 'Amount',
    dClient: 'Client',
    dSender: 'Sender',
    dRecipient: 'Recipient',
    dDriver: 'Driver',
    dPackages: 'Packages',
    dNotes: 'Notes',
    dHistory: 'Status history',
    dPhone: 'Phone',
    dEmail: 'Email',
    dWeight: 'Weight',
    dDims: 'Dimensions',
    dPieces: 'Pieces',
    dContent: 'Content',
    dType: 'Type',
    dBy: 'Requester',
    dMsg: 'Message',
    dDate: 'Date',
    dReviewedBy: 'Reviewed by',
    dReviewNotes: 'Review note',
  },
  'zh-CN': {
    title: '取件请求',
    sub: '司机请求接取未分配货件，以及客户的当日达优先通知。',
    filterAll: '全部',
    filters: { pending: '待处理', approved: '已批准', rejected: '已拒绝' },
    cols: ['追踪号', '路线', '类型', '申请人', '留言', '状态', ''],
    empty: '暂无请求。',
    approve: '批准',
    reject: '拒绝',
    notePh: '给申请人的备注（可选）',
    driverPh: '分配司机…',
    error: '无法更新请求。',
    updated: '请求已更新。',
    statuses: { pending: '待处理', approved: '已批准', rejected: '已拒绝' },
    types: { driver: '司机', same_day: '当日达' },
    details: '详情',
    close: '关闭',
    detailTitle: '货件详情',
    loadingDetail: '正在加载详情…',
    dReq: '请求',
    dRoute: '路线',
    dService: '服务',
    dAmount: '金额',
    dClient: '客户',
    dSender: '发件人',
    dRecipient: '收件人',
    dDriver: '司机',
    dPackages: '包裹',
    dNotes: '备注',
    dHistory: '状态历史',
    dPhone: '电话',
    dEmail: '邮箱',
    dWeight: '重量',
    dDims: '尺寸',
    dPieces: '件数',
    dContent: '内容',
    dType: '类型',
    dBy: '申请人',
    dMsg: '留言',
    dDate: '日期',
    dReviewedBy: '审核人',
    dReviewNotes: '审核备注',
  },
}

const TYPE_COLORS = {
  same_day: { bg: 'rgba(8,124,240,.12)', fg: '#0768C9' },
  driver: { bg: '#EEF4FC', fg: '#6C82A6' },
}

const STATUS_COLORS = {
  pending: { bg: 'rgba(217,154,0,.12)', fg: '#8A6300' },
  approved: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  rejected: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

export default function ShipmentRequests({ app, lang, token }) {
  const d = I18N[lang] || I18N.es
  const [requests, setRequests] = React.useState([])
  const [drivers, setDrivers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState('pending')
  const [busy, setBusy] = React.useState(null)
  const [notes, setNotes] = React.useState({})
  const [driverSel, setDriverSel] = React.useState({})
  const [detail, setDetail] = React.useState(null) // { loading, data, req }

  const locale = lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'es-ES'
  const fmt = (date) => {
    if (!date) return ''
    const dt = new Date(date)
    if (isNaN(dt.getTime())) return ''
    return dt.toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const openDetail = (req) => {
    const s = req.shipment || {}
    const sid = s.id || req.shipment_id
    setDetail({ loading: true, data: s, req })
    if (!sid) {
      setDetail({ loading: false, data: s, req })
      return
    }
    api.getShipment(sid, token)
      .then((data) => setDetail((cur) => (cur && cur.req?.id === req.id ? { loading: false, data, req } : cur)))
      .catch(() => setDetail((cur) => (cur && cur.req?.id === req.id ? { loading: false, data: s, req } : cur)))
  }

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

  React.useEffect(() => {
    if (!token) return
    api.getDrivers(token)
      .then((data) => setDrivers(Array.isArray(data) ? data : data.data || []))
      .catch(() => setDrivers([]))
  }, [token])

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
  const pageItems = pager.pageItems

  const updateStatus = async (req, status) => {
    setBusy(req.id)
    try {
      const payload = { status, review_notes: notes[req.id] || '' }
      if (req.type === 'same_day' && driverSel[req.id]) payload.driver_id = driverSel[req.id]
      await api.updateShipmentRequest(req.id, payload, token)
      fetchRequests(false)
    } catch (e) {
      alert(e.message || d.error)
    } finally {
      setBusy(null)
    }
  }

  const onNoteChange = (id, value) => setNotes((prev) => ({ ...prev, [id]: value }))
  const onDriverChange = (id, value) => setDriverSel((prev) => ({ ...prev, [id]: value }))

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
                  const type = req.type || 'driver'
                  const isSameDay = type === 'same_day'
                  const requester = isSameDay
                    ? (req.client?.name || s.client?.name || `ID ${req.client_id}`)
                    : (req.driver?.name || `ID ${req.driver_id}`)
                  const st = req.status || 'pending'
                  const color = STATUS_COLORS[st] || STATUS_COLORS.pending
                  const typeColor = TYPE_COLORS[type] || TYPE_COLORS.driver
                  return (
                    <tr key={req.id} style={{ borderTop: '1px solid #EDF3FB' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{s.tracking_number || `ENV-${s.id}`}</td>
                      <td style={{ padding: '14px 16px' }}>{route}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 100, background: typeColor.bg, color: typeColor.fg, fontSize: 12, fontWeight: 700 }}>{d.types[type] || type}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>{requester}</td>
                      <td style={{ padding: '14px 16px', color: '#6C82A6' }}>{req.message || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 100, background: color.bg, color: color.fg, fontSize: 12, fontWeight: 700 }}>{d.statuses[st] || st}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => openDetail(req)}
                          style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #DCE6F5', background: '#fff', color: '#0768C9', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', marginBottom: st === 'pending' ? 8 : 0 }}
                        >
                          {d.details}
                        </button>
                        {st === 'pending' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                            {isSameDay && (
                              <select
                                value={driverSel[req.id] || ''}
                                onChange={(e) => onDriverChange(req.id, e.target.value)}
                                style={{ padding: '8px 10px', border: '1px solid #DCE6F5', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                              >
                                <option value="">{d.driverPh}</option>
                                {drivers.map((drv) => (
                                  <option key={drv.user_id || drv.id} value={drv.user_id || drv.id}>
                                    {drv.name || drv.n} — {drv.v || drv.vehicle || ''}
                                  </option>
                                ))}
                              </select>
                            )}
                            <input
                              type="text"
                              value={notes[req.id] || ''}
                              onChange={(e) => onNoteChange(req.id, e.target.value)}
                              placeholder={d.notePh}
                              style={{ padding: '8px 10px', border: '1px solid #DCE6F5', borderRadius: 8, fontSize: 13 }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                disabled={busy === req.id || (isSameDay && !driverSel[req.id])}
                                onClick={() => updateStatus(req, 'approved')}
                                style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#137A45', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: (isSameDay && !driverSel[req.id]) ? 0.5 : 1 }}
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

      {detail && (
        <DetailModal
          d={d}
          app={app}
          fmt={fmt}
          entry={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  )
}

function DetailModal({ d, app, fmt, entry, onClose }) {
  const s = entry.data || {}
  const req = entry.req || {}
  const statusLabel = app?.dispatch?.statuses?.[s.status] || s.status || '—'
  const pkgs = Array.isArray(s.packages) ? s.packages : []
  const history = Array.isArray(s.status_history) ? s.status_history : []
  const sect = { fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }
  const box = { background: '#F6FAFF', border: '1px solid #E3EBF7', borderRadius: 10, padding: '10px 14px' }
  const line = { fontSize: 13, color: '#10233F', lineHeight: 1.55 }
  const row = (k, v) => v ? <div style={{ display: 'flex', gap: 8, fontSize: 12.5, padding: '4px 0' }}><span style={{ minWidth: 120, color: '#6C82A6' }}>{k}</span><span style={{ color: '#10233F', fontWeight: 600 }}>{v}</span></div> : null
  const person = (name, ...rest) => (
    <div>
      <div style={{ ...line, fontWeight: 700 }}>{name || '—'}</div>
      {rest.filter(Boolean).map((v, i) => <div key={i} style={{ ...line, fontSize: 12.5, color: '#4A5B76' }}>{v}</div>)}
    </div>
  )
  const addr = (o) => [o.address, [o.city, o.country].filter(Boolean).join(', '), o.zip].filter(Boolean).join(' · ')
  const type = req.type || 'driver'
  const requester = type === 'same_day'
    ? (req.client?.name || s.client?.name || `ID ${req.client_id}`)
    : (req.driver?.name || `ID ${req.driver_id}`)
  const reqSt = req.status || 'pending'
  const reqColor = STATUS_COLORS[reqSt] || STATUS_COLORS.pending
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(16,35,63,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, width: 760, maxWidth: '100%', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(16,35,63,.25)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid #E3EAF4', position: 'sticky', top: 0, background: '#fff', borderRadius: '16px 16px 0 0', zIndex: 1 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.detailTitle}</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 17, fontWeight: 800, color: '#001B45' }}>{s.tracking_number || `ENV-${s.id}` || '—'}</div>
          </div>
          <span style={{ padding: '4px 12px', borderRadius: 100, background: '#EEF4FC', color: '#0768C9', fontSize: 12, fontWeight: 700 }}>{statusLabel}</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#6C82A6', lineHeight: 1 }}>×</button>
        </div>

        {entry.loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6', fontSize: 13 }}>{d.loadingDetail}</div>
        ) : (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={box}>
              <div style={sect}>{d.dReq}</div>
              {row(d.dType, d.types[type] || type)}
              {row(d.dBy, requester)}
              {row(d.dDate, fmt(req.created_at))}
              {req.message && row(d.dMsg, req.message)}
              {row('', <span style={{ padding: '3px 10px', borderRadius: 100, background: reqColor.bg, color: reqColor.fg, fontSize: 12, fontWeight: 700 }}>{d.statuses[reqSt] || reqSt}</span>)}
              {req.reviewer && row(d.dReviewedBy, `${req.reviewer.name}${req.reviewed_at ? ` · ${fmt(req.reviewed_at)}` : ''}`)}
              {req.review_notes && row(d.dReviewNotes, req.review_notes)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              <div style={box}><div style={sect}>{d.dRoute}</div><div style={line}>{s.origin || '—'} → {s.destination || '—'}</div></div>
              <div style={box}><div style={sect}>{d.dService}</div><div style={line}>{[s.service_type, s.delivery_mode].filter(Boolean).join(' · ') || '—'}</div></div>
              <div style={box}><div style={sect}>{d.dAmount}</div><div style={line}>{s.amount != null ? `$${Number(s.amount).toFixed(2)}` : '—'}</div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              <div style={box}><div style={sect}>{d.dClient}</div>{person(s.client?.name, s.client?.phone ? `${d.dPhone}: ${s.client.phone}` : null, s.client?.email ? `${d.dEmail}: ${s.client.email}` : null)}</div>
              <div style={box}><div style={sect}>{d.dSender}</div>{person(s.sender_name, addr({ address: s.sender_address, city: s.sender_city, country: s.sender_country, zip: s.sender_zip }) || s.origin, s.sender_phone ? `${d.dPhone}: ${s.sender_phone}` : null, s.sender_company)}</div>
              <div style={box}><div style={sect}>{d.dRecipient}</div>{person(s.recipient_name, addr({ address: s.recipient_address, city: s.recipient_city, country: s.recipient_country, zip: s.recipient_zip }) || s.destination, s.recipient_phone ? `${d.dPhone}: ${s.recipient_phone}` : null, s.recipient_company)}</div>
              <div style={box}><div style={sect}>{d.dDriver}</div>{s.driver ? person(s.driver.name, s.driver.phone ? `${d.dPhone}: ${s.driver.phone}` : null) : <span style={{ ...line, color: '#8B9DBA' }}>—</span>}</div>
            </div>

            {pkgs.length > 0 && (
              <div>
                <div style={sect}>{d.dPackages} ({pkgs.length})</div>
                <div style={{ border: '1px solid #E3EBF7', borderRadius: 10, overflow: 'hidden' }}>
                  {pkgs.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', padding: '10px 14px', fontSize: 12.5, color: '#10233F', borderTop: i ? '1px solid #EDF2F8' : 'none', background: i % 2 ? '#F8FBFF' : '#fff', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, minWidth: 70 }}>{p.type || '—'}</span>
                      <span>{d.dPieces}: {p.pieces ?? '—'}</span>
                      <span>{d.dWeight}: {p.weight != null ? `${p.weight} ${p.weight_unit || 'kg'}` : '—'}</span>
                      <span>{d.dDims}: {p.dimensions || '—'}</span>
                      {p.content && <span style={{ flex: '1 1 100%', color: '#4A5B76' }}>{d.dContent}: {p.content}</span>}
                      {p.fragile && <span style={{ background: '#C0392B', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>FRÁGIL</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {s.notes && <div style={box}><div style={sect}>{d.dNotes}</div><div style={line}>{s.notes}</div></div>}

            {history.length > 0 && (
              <div>
                <div style={sect}>{d.dHistory}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12.5 }}>
                      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 700, color: '#001B45', minWidth: 130 }}>{app?.dispatch?.statuses?.[h.status] || h.status}</span>
                      <span style={{ color: '#6C82A6' }}>{fmt(h.at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid #E3EAF4', textAlign: 'right' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #DCE6F5', background: '#fff', color: '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{d.close}</button>
        </div>
      </div>
    </div>
  )
}
