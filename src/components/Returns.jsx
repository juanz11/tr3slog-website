import React from 'react'
import { api } from '../api'

const RETURN_STATUSES = ['failed_attempt', 'returned', 'devuelto', 'incident', 'incidencia', 'cancelled', 'cancelado', 'cancel_requested']

const STATUS_META = {
  failed_attempt: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  incident: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
  incidencia: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
  returned: { bg: 'rgba(192,57,43,.16)', fg: '#A93226' },
  devuelto: { bg: 'rgba(192,57,43,.16)', fg: '#A93226' },
  cancelled: { bg: 'rgba(108,130,166,.14)', fg: '#4A5D7E' },
  cancelado: { bg: 'rgba(108,130,166,.14)', fg: '#4A5D7E' },
  cancel_requested: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
}

const T_ES = {
  title: 'Devoluciones',
  subtitle: 'Envíos rechazados, devueltos o cancelados por el cliente. Revise cada caso, contacte al cliente y marque la revisión.',
  loading: 'Cargando devoluciones…',
  empty: 'No hay devoluciones pendientes ni registradas.',
  cols: ['Guía', 'Cliente', 'Estado', 'Recobro', 'Revisión', 'Acciones'],
  status: {
    failed_attempt: 'Intento fallido',
    incident: 'Incidencia',
    incidencia: 'Incidencia',
    returned: 'Devuelto',
    devuelto: 'Devuelto',
    cancelled: 'Cancelado',
    cancelado: 'Cancelado',
    cancel_requested: 'Cancelación solicitada',
  },
  client: 'Cliente',
  recipient: 'Destinatario',
  noFee: '—',
  feeTitle: 'Recobro',
  whatsapp: 'WhatsApp',
  markReviewed: 'Marcar revisado',
  reviewing: 'Revisando…',
  reviewed: 'Revisado',
  reviewedBy: (name, date) => `Revisado por ${name}${date ? ` · ${date}` : ''}`,
  pendingReview: 'Pendiente de revisión',
  whatsappMsg: (code) => `Hola, le contactamos de TR3SLOG sobre su envío ${code}.`,
  error: 'No se pudo marcar la revisión.',
  count: (n) => `${n} ${n === 1 ? 'caso' : 'casos'}`,
  onlyPending: 'Pendientes',
  all: 'Todos',
}

const T_EN = {
  title: 'Returns',
  subtitle: 'Shipments rejected, returned or cancelled by the client. Review each case, contact the client and mark the review.',
  loading: 'Loading returns…',
  empty: 'No pending or recorded returns.',
  cols: ['Tracking', 'Client', 'Status', 'Recovery fee', 'Review', 'Actions'],
  status: {
    failed_attempt: 'Failed attempt',
    incident: 'Incident',
    incidencia: 'Incident',
    returned: 'Returned',
    devuelto: 'Returned',
    cancelled: 'Cancelled',
    cancelado: 'Cancelled',
    cancel_requested: 'Cancellation requested',
  },
  client: 'Client',
  recipient: 'Recipient',
  noFee: '—',
  feeTitle: 'Recovery',
  whatsapp: 'WhatsApp',
  markReviewed: 'Mark reviewed',
  reviewing: 'Reviewing…',
  reviewed: 'Reviewed',
  reviewedBy: (name, date) => `Reviewed by ${name}${date ? ` · ${date}` : ''}`,
  pendingReview: 'Pending review',
  whatsappMsg: (code) => `Hello, we are contacting you from TR3SLOG regarding your shipment ${code}.`,
  error: 'Could not mark the review.',
  count: (n) => `${n} ${n === 1 ? 'case' : 'cases'}`,
  onlyPending: 'Pending',
  all: 'All',
}

const T_ZH = {
  title: '退货管理',
  subtitle: '客户拒收、退回或取消的货件。审核每个案例，联系客户并标记审核状态。',
  loading: '正在加载退货…',
  empty: '暂无退货记录。',
  cols: ['运单号', '客户', '状态', '回收费用', '审核', '操作'],
  status: {
    failed_attempt: '投递失败',
    incident: '异常',
    incidencia: '异常',
    returned: '已退回',
    devuelto: '已退回',
    cancelled: '已取消',
    cancelado: '已取消',
    cancel_requested: '已申请取消',
  },
  client: '客户',
  recipient: '收件人',
  noFee: '—',
  feeTitle: '回收',
  whatsapp: 'WhatsApp',
  markReviewed: '标记已审核',
  reviewing: '审核中…',
  reviewed: '已审核',
  reviewedBy: (name, date) => `${name} 已审核${date ? ` · ${date}` : ''}`,
  pendingReview: '待审核',
  whatsappMsg: (code) => `您好，TR3SLOG 就您的货件 ${code} 与您联系。`,
  error: '无法标记审核。',
  count: (n) => `${n} 个案例`,
  onlyPending: '待审核',
  all: '全部',
}

const T_BY_LANG = { es: T_ES, en: T_EN, 'zh-CN': T_ZH }

const phoneDigits = (v) => String(v || '').replace(/[^\d]/g, '')

export default function Returns({ token, lang, canReview = false }) {
  const T = T_BY_LANG[lang] || T_ES
  const locale = lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'es-ES'
  const fmt = (date) => {
    if (!date) return ''
    const dt = new Date(date)
    if (isNaN(dt.getTime())) return ''
    return dt.toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [scope, setScope] = React.useState('pending')
  const [busy, setBusy] = React.useState(null)

  React.useEffect(() => {
    let alive = true
    setLoading(true)
    api.getShipments(token)
      .then((data) => {
        if (!alive) return
        const list = Array.isArray(data) ? data : data.data || []
        setRows(list.filter((s) => RETURN_STATUSES.includes(s.status)))
      })
      .catch(() => { if (alive) setRows([]) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [token])

  const visible = scope === 'pending' ? rows.filter((s) => !s.return_reviewed_at) : rows

  const contactPhone = (s) => s.client?.phone || s.sender?.phone || s.recipient?.phone
  const clientName = (s) => s.client?.name || s.sender?.name || s.recipient?.name || '—'
  const feePercent = (s) => s.cancel_fee_percent ?? s.cancel_preview?.percent
  const feeAmount = (s) => s.cancel_fee ?? s.cancel_preview?.fee

  const openWhatsApp = (s) => {
    const phone = phoneDigits(contactPhone(s))
    if (!phone) return
    const msg = encodeURIComponent(T.whatsappMsg(s.tracking_number || ''))
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener')
  }

  const markReviewed = async (s) => {
    setBusy(s.id)
    try {
      const res = await api.reviewShipmentReturn(s.id, token)
      setRows((list) => list.map((x) => (x.id === s.id
        ? { ...x, return_reviewed_at: res.return_reviewed_at, return_reviewed_by: res.return_reviewed_by, return_reviewer: res.return_reviewer }
        : x)))
    } catch (e) {
      alert(e.message || T.error)
    } finally {
      setBusy(null)
    }
  }

  const thStyle = { padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6C82A6', textAlign: 'left', borderBottom: '1px solid #E3EAF4' }
  const tdStyle = { padding: '12px 14px', borderBottom: '1px solid #EDF2F8', fontSize: 13, verticalAlign: 'middle' }

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#10233F' }}>{T.title}</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6C82A6' }}>{T.subtitle}</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        {[{ k: 'pending', l: T.onlyPending }, { k: 'all', l: T.all }].map((o) => (
          <button
            key={o.k}
            onClick={() => setScope(o.k)}
            style={{
              padding: '7px 14px', borderRadius: 100, border: '1px solid',
              borderColor: scope === o.k ? '#0A4E96' : '#D8E2EF',
              background: scope === o.k ? '#0A4E96' : '#fff',
              color: scope === o.k ? '#fff' : '#4A5D7E',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            }}
          >{o.l}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#8B9DBA' }}>{T.count(visible.length)}</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E3EAF4', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6C82A6', fontSize: 13 }}>{T.loading}</div>
        ) : visible.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6C82A6', fontSize: 13 }}>{T.empty}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{T.cols.map((c) => <th key={c} style={thStyle}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {visible.map((s) => {
                const meta = STATUS_META[s.status] || STATUS_META.returned
                const pct = feePercent(s)
                const amt = feeAmount(s)
                const reviewed = !!s.return_reviewed_at
                const reviewerName = s.return_reviewer?.name || ''
                const phone = phoneDigits(contactPhone(s))
                return (
                  <tr key={s.id}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700, color: '#10233F' }}>{s.tracking_number}</div>
                      <div style={{ fontSize: 11.5, color: '#8B9DBA' }}>{fmt(s.updated_at)}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ color: '#10233F' }}>{clientName(s)}</div>
                      <div style={{ fontSize: 11.5, color: '#8B9DBA' }}>{contactPhone(s) || '—'}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 100,
                        background: meta.bg, color: meta.fg, fontSize: 12, fontWeight: 700,
                      }}>{T.status[s.status] || s.status}</span>
                    </td>
                    <td style={tdStyle}>
                      {pct != null ? (
                        <div>
                          <span style={{ color: '#C0392B', fontWeight: 800, fontSize: 15 }}>{pct}%</span>
                          <div style={{ fontSize: 11.5, color: '#8B9DBA' }}>
                            {T.feeTitle}{amt != null ? ` · $${Number(amt).toFixed(2)}` : ''}
                          </div>
                        </div>
                      ) : <span style={{ color: '#8B9DBA' }}>{T.noFee}</span>}
                    </td>
                    <td style={tdStyle}>
                      {reviewed ? (
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: 100,
                          background: 'rgba(19,122,69,.12)', color: '#0F5F36', fontSize: 12, fontWeight: 700,
                        }}>{T.reviewedBy(reviewerName || T.reviewed, fmt(s.return_reviewed_at))}</span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#8A6300', fontWeight: 600 }}>{T.pendingReview}</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {phone ? (
                          <button
                            onClick={() => openWhatsApp(s)}
                            title="WhatsApp Web"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '7px 12px', borderRadius: 8, border: 'none',
                              background: '#25D366', color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.9 2.4 2.5.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1s1.8.8 2.1 1c.3.1.5.2.6.4 0 .1 0 .8-.4 1.4z"/>
                            </svg>
                            {T.whatsapp}
                          </button>
                        ) : null}
                        {canReview && !reviewed && (
                          <button
                            onClick={() => markReviewed(s)}
                            disabled={busy === s.id}
                            style={{
                              padding: '7px 12px', borderRadius: 8, border: '1px solid #0A4E96',
                              background: '#fff', color: '#0A4E96', fontSize: 12.5, fontWeight: 700,
                              cursor: busy === s.id ? 'wait' : 'pointer', opacity: busy === s.id ? .6 : 1,
                            }}
                          >{busy === s.id ? T.reviewing : T.markReviewed}</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
