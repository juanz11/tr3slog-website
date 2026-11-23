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
  markProcessed: 'Marcar gestionado',
  processing: 'Gestionando…',
  processed: 'Gestionado',
  processedBy: (name, date) => `Gestionado por ${name}${date ? ` · ${date}` : ''}`,
  pendingProcess: 'Pendiente de gestión',
  whatsappMsg: (code) => `Hola, le contactamos de TR3SLOG sobre su envío ${code}.`,
  error: 'No se pudo marcar la revisión.',
  count: (n) => `${n} ${n === 1 ? 'caso' : 'casos'}`,
  onlyPending: 'Pendientes',
  all: 'Todos',
  details: 'Detalles',
  close: 'Cerrar',
  detailTitle: 'Detalle del envío',
  loadingDetail: 'Cargando detalle…',
  confirmTitle: 'Contactar al cliente antes de revisar',
  confirmCopy: (code) => `Antes de marcar ${code} como revisado, avise al cliente por WhatsApp sobre el estado de su caso.`,
  confirmNoPhone: 'El cliente no tiene teléfono registrado; no se puede enviar WhatsApp.',
  sendWhatsapp: 'Enviar WhatsApp',
  waSent: 'WhatsApp enviado',
  confirmReview: 'Confirmar revisión',
  cancel: 'Cancelar',
  dRoute: 'Ruta',
  dClient: 'Cliente',
  dSender: 'Remitente',
  dRecipient: 'Destinatario',
  dService: 'Servicio',
  dPackages: 'Bultos',
  dAmount: 'Monto',
  dInvoice: 'Factura',
  dNotes: 'Notas',
  dDriver: 'Conductor',
  dHistory: 'Historial de estados',
  dReview: 'Revisión',
  dPhone: 'Tel.',
  dEmail: 'Correo',
  dWeight: 'Peso',
  dDims: 'Dimensiones',
  dPieces: 'Piezas',
  dContent: 'Contenido',
  dFragile: 'Frágil',
  yes: 'Sí',
  no: 'No',
  dLastPoint: 'Último punto registrado',
  dManifest: 'Manifiesto',
  dStop: 'Parada',
  dLocation: 'Ubicación',
  dVisitedAt: 'Hora de visita',
  dFailReason: 'Motivo',
  dGps: 'GPS',
  dHubIn: 'Entró al hub',
  dHubOut: 'Salió del hub',
  dVia: 'Captura',
  dEvidence: 'Evidencia',
  mapView: 'Ver en mapa',
  stopStatus: { PENDIENTE: 'Pendiente', ENTREGADO: 'Entregado', NO_ENTREGADO: 'No entregado', TRANSFERIDO: 'Transferido' },
  noPoint: 'Sin manifiesto: el envío no llegó a subir a ruta.',
  cfgTitle: 'Porcentajes de recobro por etapa',
  cfgSubtitle: 'Cargo aplicado según hasta dónde llegó el paquete antes de la devolución o cancelación.',
  cfgNotPicked: 'Nadie lo recogió (pendiente / asignado)',
  cfgPickedUp: 'Recogido o en tránsito',
  cfgInHub: 'Recibido en el hub',
  cfgLeftHub: 'Salió del hub',
  cfgNotCancellable: 'No cancelable',
  cfgSave: 'Guardar porcentajes',
  cfgSaving: 'Guardando…',
  cfgSaved: 'Porcentajes actualizados.',
  cfgError: 'No se pudieron guardar los porcentajes.',
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
  markProcessed: 'Mark processed',
  processing: 'Processing…',
  processed: 'Processed',
  processedBy: (name, date) => `Processed by ${name}${date ? ` · ${date}` : ''}`,
  pendingProcess: 'Pending processing',
  whatsappMsg: (code) => `Hello, we are contacting you from TR3SLOG regarding your shipment ${code}.`,
  error: 'Could not mark the review.',
  count: (n) => `${n} ${n === 1 ? 'case' : 'cases'}`,
  onlyPending: 'Pending',
  all: 'All',
  details: 'Details',
  close: 'Close',
  detailTitle: 'Shipment details',
  loadingDetail: 'Loading details…',
  confirmTitle: 'Contact the client before reviewing',
  confirmCopy: (code) => `Before marking ${code} as reviewed, notify the client on WhatsApp about the status of their case.`,
  confirmNoPhone: 'The client has no registered phone; WhatsApp cannot be sent.',
  sendWhatsapp: 'Send WhatsApp',
  waSent: 'WhatsApp sent',
  confirmReview: 'Confirm review',
  cancel: 'Cancel',
  dRoute: 'Route',
  dClient: 'Client',
  dSender: 'Sender',
  dRecipient: 'Recipient',
  dService: 'Service',
  dPackages: 'Packages',
  dAmount: 'Amount',
  dInvoice: 'Invoice',
  dNotes: 'Notes',
  dDriver: 'Driver',
  dHistory: 'Status history',
  dReview: 'Review',
  dPhone: 'Phone',
  dEmail: 'Email',
  dWeight: 'Weight',
  dDims: 'Dimensions',
  dPieces: 'Pieces',
  dContent: 'Contents',
  dFragile: 'Fragile',
  yes: 'Yes',
  no: 'No',
  dLastPoint: 'Last recorded point',
  dManifest: 'Manifest',
  dStop: 'Stop',
  dLocation: 'Location',
  dVisitedAt: 'Visit time',
  dFailReason: 'Reason',
  dGps: 'GPS',
  dHubIn: 'Entered hub',
  dHubOut: 'Left hub',
  dVia: 'Capture',
  dEvidence: 'Evidence',
  mapView: 'View on map',
  stopStatus: { PENDIENTE: 'Pending', ENTREGADO: 'Delivered', NO_ENTREGADO: 'Not delivered', TRANSFERIDO: 'Transferred' },
  noPoint: 'No manifest: the shipment never made it onto a route.',
  cfgTitle: 'Recovery fee per stage',
  cfgSubtitle: 'Charge applied depending on how far the package got before the return or cancellation.',
  cfgNotPicked: 'Not picked up (pending / assigned)',
  cfgPickedUp: 'Picked up or in transit',
  cfgInHub: 'Received at the hub',
  cfgLeftHub: 'Left the hub',
  cfgNotCancellable: 'Not cancellable',
  cfgSave: 'Save percentages',
  cfgSaving: 'Saving…',
  cfgSaved: 'Percentages updated.',
  cfgError: 'Could not save the percentages.',
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
  markProcessed: '标记已处理',
  processing: '处理中…',
  processed: '已处理',
  processedBy: (name, date) => `${name} 已处理${date ? ` · ${date}` : ''}`,
  pendingProcess: '待处理',
  whatsappMsg: (code) => `您好，TR3SLOG 就您的货件 ${code} 与您联系。`,
  error: '无法标记审核。',
  count: (n) => `${n} 个案例`,
  onlyPending: '待审核',
  all: '全部',
  details: '详情',
  close: '关闭',
  detailTitle: '货件详情',
  loadingDetail: '正在加载详情…',
  confirmTitle: '审核前请先联系客户',
  confirmCopy: (code) => `在将 ${code} 标记为已审核之前，请通过 WhatsApp 告知客户案件状态。`,
  confirmNoPhone: '客户未登记电话，无法发送 WhatsApp。',
  sendWhatsapp: '发送 WhatsApp',
  waSent: 'WhatsApp 已发送',
  confirmReview: '确认审核',
  cancel: '取消',
  dRoute: '路线',
  dClient: '客户',
  dSender: '发件人',
  dRecipient: '收件人',
  dService: '服务',
  dPackages: '包裹',
  dAmount: '金额',
  dInvoice: '发票',
  dNotes: '备注',
  dDriver: '司机',
  dHistory: '状态历史',
  dReview: '审核',
  dPhone: '电话',
  dEmail: '邮箱',
  dWeight: '重量',
  dDims: '尺寸',
  dPieces: '件数',
  dContent: '内容',
  dFragile: '易碎',
  yes: '是',
  no: '否',
  dLastPoint: '最后记录位置',
  dManifest: '运单清单',
  dStop: '停靠点',
  dLocation: '位置',
  dVisitedAt: '访问时间',
  dFailReason: '原因',
  dGps: 'GPS',
  dHubIn: '进入仓库',
  dHubOut: '离开仓库',
  dVia: '采集方式',
  dEvidence: '凭证',
  mapView: '查看地图',
  stopStatus: { PENDIENTE: '待处理', ENTREGADO: '已送达', NO_ENTREGADO: '未送达', TRANSFERIDO: '已转运' },
  noPoint: '无运单清单：货件未装上路线。',
  cfgTitle: '按阶段收取回收费用',
  cfgSubtitle: '根据包裹在退货或取消前到达的阶段收取费用。',
  cfgNotPicked: '未取件（待处理 / 已分配）',
  cfgPickedUp: '已取件或运输中',
  cfgInHub: '已到达枢纽',
  cfgLeftHub: '已离开枢纽',
  cfgNotCancellable: '不可取消',
  cfgSave: '保存百分比',
  cfgSaving: '保存中…',
  cfgSaved: '百分比已更新。',
  cfgError: '无法保存百分比。',
}

const T_BY_LANG = { es: T_ES, en: T_EN, 'zh-CN': T_ZH }

const phoneDigits = (v) => String(v || '').replace(/[^\d]/g, '')

export default function Returns({ token, lang, canReview = false, canEdit = false, canProcess = false, financeView = false }) {
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
  const [detail, setDetail] = React.useState(null) // { loading, data }
  const [confirming, setConfirming] = React.useState(null) // shipment pendiente de revisar
  const [waSent, setWaSent] = React.useState({}) // id -> true cuando se abrió WhatsApp
  const [cfg, setCfg] = React.useState(null)
  const [cfgBusy, setCfgBusy] = React.useState(false)
  const [cfgMsg, setCfgMsg] = React.useState('')

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

  React.useEffect(() => {
    if (!canEdit) return
    let alive = true
    api.getPricingConfig(token)
      .then((res) => { if (alive) setCfg(res || {}) })
      .catch(() => {})
    return () => { alive = false }
  }, [token, canEdit])

  const setPolicy = (key, v) => setCfg((c) => ({
    ...c,
    policies: { ...(c.policies || {}), cancellation: { ...((c.policies || {}).cancellation || {}), [key]: v } },
  }))

  const saveCfg = async () => {
    setCfgBusy(true)
    setCfgMsg('')
    try {
      const res = await api.updatePricingConfig(cfg, token)
      setCfg(res || cfg)
      setCfgMsg(T.cfgSaved)
    } catch (e) {
      setCfgMsg(e.message || T.cfgError)
    } finally {
      setCfgBusy(false)
    }
  }

  // Operations queue: not yet reviewed. Finance queue: reviewed but the
  // charge / payment handling is not finished yet.
  const isPendingForRole = (s) => financeView
    ? (!!s.return_reviewed_at && !s.return_processed_at)
    : !s.return_reviewed_at
  const visible = scope === 'pending' ? rows.filter(isPendingForRole) : rows

  const contactPhone = (s) => s.client?.phone || s.sender?.phone || s.sender_phone || s.recipient?.phone || s.recipient_phone
  const clientName = (s) => s.client?.name || s.sender?.name || s.sender_name || s.recipient?.name || s.recipient_name || '—'
  const feePercent = (s) => s.return_recobro?.percent ?? s.cancel_fee_percent ?? s.cancel_preview?.percent
  const feeAmount = (s) => s.return_recobro?.fee ?? s.cancel_fee ?? s.cancel_preview?.fee

  const openWhatsApp = (s) => {
    const phone = phoneDigits(contactPhone(s))
    if (!phone) return
    const msg = encodeURIComponent(T.whatsappMsg(s.tracking_number || ''))
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener')
    setWaSent((m) => ({ ...m, [s.id]: true }))
  }

  const openDetail = (s) => {
    setDetail({ loading: true, data: s })
    api.getShipment(s.id, token)
      .then((d) => setDetail((cur) => (cur && cur.data?.id === s.id ? { loading: false, data: d } : cur)))
      .catch(() => setDetail((cur) => (cur && cur.data?.id === s.id ? { loading: false, data: s } : cur)))
  }

  const markReviewed = async (s) => {
    setBusy(s.id)
    try {
      const res = await api.reviewShipmentReturn(s.id, token)
      setRows((list) => list.map((x) => (x.id === s.id
        ? { ...x, return_reviewed_at: res.return_reviewed_at, return_reviewed_by: res.return_reviewed_by, return_reviewer: res.return_reviewer }
        : x)))
      setConfirming(null)
    } catch (e) {
      alert(e.message || T.error)
    } finally {
      setBusy(null)
    }
  }

  const markProcessed = async (s) => {
    setBusy(`p-${s.id}`)
    try {
      const res = await api.processShipmentReturn(s.id, token)
      setRows((list) => list.map((x) => (x.id === s.id
        ? { ...x, return_processed_at: res.return_processed_at, return_processed_by: res.return_processed_by, return_processor: res.return_processor }
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

      {canEdit && cfg && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E3EAF4', padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#10233F' }}>{T.cfgTitle}</div>
          <p style={{ margin: '3px 0 14px', fontSize: 12, color: '#8B9DBA' }}>{T.cfgSubtitle}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
            {[
              ['percent', T.cfgNotPicked],
              ['picked_up_percent', T.cfgPickedUp],
              ['recobro_percent', T.cfgInHub],
            ].map(([key, label]) => (
              <div key={key} style={{ border: '1px solid #EDF2F8', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 11.5, color: '#6C82A6', fontWeight: 600, marginBottom: 6 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    inputMode="decimal"
                    value={cfg.policies?.cancellation?.[key] ?? ''}
                    placeholder="0"
                    onChange={(e) => setPolicy(key, e.target.value === '' ? null : Number(e.target.value))}
                    style={{
                      width: 80, padding: '6px 8px', borderRadius: 8, border: '1px solid #D8E2EF',
                      fontSize: 15, fontWeight: 800, color: '#C0392B', textAlign: 'right',
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#C0392B' }}>%</span>
                </div>
              </div>
            ))}
            <div style={{ border: '1px dashed #E3B8B1', borderRadius: 10, padding: '10px 12px', background: 'rgba(192,57,43,.04)' }}>
              <div style={{ fontSize: 11.5, color: '#A93226', fontWeight: 600, marginBottom: 6 }}>{T.cfgLeftHub}</div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#A93226' }}>{T.cfgNotCancellable}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <button
              onClick={saveCfg}
              disabled={cfgBusy}
              style={{
                padding: '8px 18px', borderRadius: 8, border: 'none',
                background: '#0A4E96', color: '#fff', fontSize: 12.5, fontWeight: 700,
                cursor: cfgBusy ? 'wait' : 'pointer', opacity: cfgBusy ? .6 : 1,
              }}
            >{cfgBusy ? T.cfgSaving : T.cfgSave}</button>
            {cfgMsg && <span style={{ fontSize: 12, color: '#0F5F36', fontWeight: 600 }}>{cfgMsg}</span>}
          </div>
        </div>
      )}

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
                const processed = !!s.return_processed_at
                const processorName = s.return_processor?.name || ''
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {reviewed ? (
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 100, alignSelf: 'flex-start',
                            background: 'rgba(19,122,69,.12)', color: '#0F5F36', fontSize: 12, fontWeight: 700,
                          }}>{T.reviewedBy(reviewerName || T.reviewed, fmt(s.return_reviewed_at))}</span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#8A6300', fontWeight: 600 }}>{T.pendingReview}</span>
                        )}
                        {processed ? (
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 100, alignSelf: 'flex-start',
                            background: 'rgba(8,124,240,.12)', color: '#0A4E96', fontSize: 12, fontWeight: 700,
                          }}>{T.processedBy(processorName || T.processed, fmt(s.return_processed_at))}</span>
                        ) : reviewed ? (
                          <span style={{ fontSize: 12, color: '#8A6300', fontWeight: 600 }}>{T.pendingProcess}</span>
                        ) : null}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openDetail(s)}
                          style={{
                            padding: '7px 12px', borderRadius: 8, border: '1px solid #D8E2EF',
                            background: '#fff', color: '#4A5D7E', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                          }}
                        >{T.details}</button>
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
                            onClick={() => setConfirming(s)}
                            disabled={busy === s.id}
                            style={{
                              padding: '7px 12px', borderRadius: 8, border: '1px solid #0A4E96',
                              background: '#fff', color: '#0A4E96', fontSize: 12.5, fontWeight: 700,
                              cursor: busy === s.id ? 'wait' : 'pointer', opacity: busy === s.id ? .6 : 1,
                            }}
                          >{busy === s.id ? T.reviewing : T.markReviewed}</button>
                        )}
                        {canProcess && reviewed && !processed && (
                          <button
                            onClick={() => markProcessed(s)}
                            disabled={busy === `p-${s.id}`}
                            style={{
                              padding: '7px 12px', borderRadius: 8, border: 'none',
                              background: '#0F5F36', color: '#fff', fontSize: 12.5, fontWeight: 700,
                              cursor: busy === `p-${s.id}` ? 'wait' : 'pointer', opacity: busy === `p-${s.id}` ? .6 : 1,
                            }}
                          >{busy === `p-${s.id}` ? T.processing : T.markProcessed}</button>
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

      {detail && <DetailModal T={T} fmt={fmt} locale={locale} entry={detail} onClose={() => setDetail(null)} feePercent={feePercent} feeAmount={feeAmount} />}

      {confirming && (() => {
        const s = confirming
        const code = s.tracking_number || `#${s.id}`
        const phone = phoneDigits(contactPhone(s))
        const needsWa = !!phone && !waSent[s.id]
        return (
          <div
            onClick={() => setConfirming(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(16,35,63,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, maxWidth: '100%', boxShadow: '0 24px 64px rgba(16,35,63,.25)' }}
            >
              <h3 style={{ margin: '0 0 8px', fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 800, color: '#001B45' }}>{T.confirmTitle}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: '#6C82A6', lineHeight: 1.6 }}>{T.confirmCopy(code)}</p>
              {!phone && <p style={{ margin: '12px 0 0', fontSize: 12.5, color: '#8A6300', fontWeight: 600 }}>{T.confirmNoPhone}</p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
                {phone ? (
                  <button
                    type="button"
                    onClick={() => openWhatsApp(s)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '11px 16px', borderRadius: 10, border: 'none',
                      background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}
                  >{waSent[s.id] ? `✓ ${T.waSent}` : T.sendWhatsapp}</button>
                ) : null}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setConfirming(null)}
                    style={{ padding: '11px 16px', borderRadius: 10, border: '1.5px solid #DCE6F5', background: '#fff', color: '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >{T.cancel}</button>
                  <button
                    type="button"
                    disabled={needsWa || busy === s.id}
                    onClick={() => markReviewed(s)}
                    style={{
                      padding: '11px 16px', borderRadius: 10, border: 'none',
                      background: needsWa ? '#9FB6D8' : '#0A4E96', color: '#fff', fontSize: 13, fontWeight: 700,
                      cursor: needsWa ? 'not-allowed' : busy === s.id ? 'wait' : 'pointer',
                    }}
                  >{busy === s.id ? T.reviewing : T.confirmReview}</button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

function DetailModal({ T, fmt, locale, entry, onClose, feePercent, feeAmount }) {
  const s = entry.data || {}
  const meta = STATUS_META[s.status] || STATUS_META.returned
  const statusLabel = T.status[s.status] || s.status || '—'
  const pkgs = Array.isArray(s.packages) ? s.packages : []
  const history = Array.isArray(s.status_history) ? s.status_history : []
  const pct = feePercent(s)
  const amt = feeAmount(s)
  const sect = { fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }
  const box = { background: '#F6FAFF', border: '1px solid #E3EBF7', borderRadius: 10, padding: '10px 14px' }
  const line = { fontSize: 13, color: '#10233F', lineHeight: 1.55 }
  const person = (name, ...rest) => (
    <div>
      <div style={{ ...line, fontWeight: 700 }}>{name || '—'}</div>
      {rest.filter(Boolean).map((v, i) => <div key={i} style={{ ...line, fontSize: 12.5, color: '#4A5B76' }}>{v}</div>)}
    </div>
  )
  const addr = (o) => [o.address, [o.city, o.country].filter(Boolean).join(', '), o.zip].filter(Boolean).join(' · ')
  const parties = [
    [T.dClient, s.client, person(s.client?.name, s.client?.phone ? `${T.dPhone}: ${s.client.phone}` : null, s.client?.email ? `${T.dEmail}: ${s.client.email}` : null)],
    [T.dSender, s.sender_name, person(s.sender_name, addr(s.sender_city || s.sender_address ? { address: s.sender_address, city: s.sender_city, country: s.sender_country, zip: s.sender_zip } : {}) || s.origin, s.sender_phone ? `${T.dPhone}: ${s.sender_phone}` : null, s.sender_company)],
    [T.dRecipient, s.recipient_name, person(s.recipient_name, addr({ address: s.recipient_address, city: s.recipient_city, country: s.recipient_country, zip: s.recipient_zip }) || s.destination, s.recipient_phone ? `${T.dPhone}: ${s.recipient_phone}` : null, s.recipient_company)],
    [T.dDriver, s.driver?.name, s.driver ? person(s.driver.name, s.driver.phone ? `${T.dPhone}: ${s.driver.phone}` : null) : <span style={{ ...line, color: '#8B9DBA' }}>—</span>],
  ]
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
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{T.detailTitle}</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 17, fontWeight: 800, color: '#001B45' }}>{s.tracking_number || `#${s.id}`}</div>
          </div>
          <span style={{ padding: '4px 12px', borderRadius: 100, background: meta.bg, color: meta.fg, fontSize: 12, fontWeight: 700 }}>{statusLabel}</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#6C82A6', lineHeight: 1 }}>×</button>
        </div>

        {entry.loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6', fontSize: 13 }}>{T.loadingDetail}</div>
        ) : (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              <div style={box}><div style={sect}>{T.dRoute}</div><div style={line}>{s.origin || '—'} → {s.destination || '—'}</div></div>
              <div style={box}><div style={sect}>{T.dService}</div><div style={line}>{[s.service_type, s.delivery_mode].filter(Boolean).join(' · ') || '—'}</div></div>
              <div style={box}><div style={sect}>{T.dAmount}</div><div style={line}>{s.amount != null ? `$${Number(s.amount).toFixed(2)}` : '—'}</div></div>
              <div style={box}><div style={sect}>{T.dInvoice}</div><div style={line}>{s.invoice_number || '—'}{s.invoiced_at ? ` · ${fmt(s.invoiced_at)}` : ''}</div></div>
              <div style={box}><div style={sect}>{T.feeTitle}</div><div style={{ ...line, color: pct != null ? '#C0392B' : '#8B9DBA', fontWeight: pct != null ? 800 : 400 }}>{pct != null ? `${pct}%${amt != null ? ` · $${Number(amt).toFixed(2)}` : ''}` : T.noFee}</div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {parties.map(([lbl, , node]) => <div key={lbl} style={box}><div style={sect}>{lbl}</div>{node}</div>)}
            </div>

            {pkgs.length > 0 && (
              <div>
                <div style={sect}>{T.dPackages} ({pkgs.length})</div>
                <div style={{ border: '1px solid #E3EBF7', borderRadius: 10, overflow: 'hidden' }}>
                  {pkgs.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', padding: '10px 14px', fontSize: 12.5, color: '#10233F', borderTop: i ? '1px solid #EDF2F8' : 'none', background: i % 2 ? '#F8FBFF' : '#fff', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, minWidth: 70 }}>{p.type || '—'}</span>
                      <span>{T.dPieces}: {p.pieces ?? '—'}</span>
                      <span>{T.dWeight}: {p.weight != null ? `${p.weight} ${p.weight_unit || 'kg'}` : '—'}</span>
                      <span>{T.dDims}: {p.dimensions || '—'}</span>
                      {p.content && <span style={{ flex: '1 1 100%', color: '#4A5B76' }}>{T.dContent}: {p.content}</span>}
                      {p.fragile && <span style={{ background: '#C0392B', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>FRÁGIL</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(s.weight || s.dimensions || s.pieces) && (
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12.5, color: '#4A5B76' }}>
                {s.weight != null && <span>{T.dWeight}: <b style={{ color: '#10233F' }}>{s.weight} {s.weight_unit || 'kg'}</b></span>}
                {s.dimensions && <span>{T.dDims}: <b style={{ color: '#10233F' }}>{s.dimensions}</b></span>}
                {s.pieces && <span>{T.dPieces}: <b style={{ color: '#10233F' }}>{s.pieces}</b></span>}
              </div>
            )}

            {s.notes && <div style={box}><div style={sect}>{T.dNotes}</div><div style={line}>{s.notes}</div></div>}

            <div>
              <div style={sect}>{T.dLastPoint}</div>
              {(() => {
                const md = s.manifest_detail
                const mani = md?.manifest
                if (!md) return <div style={{ ...line, color: '#8B9DBA' }}>{T.noPoint}</div>
                const row = (k, v) => v ? <div style={{ display: 'flex', gap: 8, fontSize: 12.5, padding: '5px 0' }}><span style={{ minWidth: 120, color: '#6C82A6' }}>{k}</span><span style={{ color: '#10233F', fontWeight: 600 }}>{v}</span></div> : null
                const gps = md.lat != null && md.lng != null ? `${md.lat}, ${md.lng}${md.gps_accuracy ? ` (±${Math.round(md.gps_accuracy)} m)` : ''}` : null
                const evidence = md.pod_url || md.evidence_url || md.evidence_path || null
                return (
                  <div style={box}>
                    {mani && row(T.dManifest, `${mani.code || `#${mani.id}`}${mani.status ? ` · ${mani.status}` : ''}`)}
                    {row(T.dStop, `${md.sequence != null ? `#${md.sequence}` : ''}${md.status ? ` · ${T.stopStatus[md.status] || md.status}` : ''}`)}
                    {row(T.dLocation, md.location)}
                    {row(T.dVisitedAt, fmt(md.visited_at || md.hora_visita))}
                    {row(T.dFailReason, md.failure_reason || md.motivo_fallo)}
                    {row(T.dVia, md.capture_via)}
                    {mani?.hub_received_at && row(T.dHubIn, fmt(mani.hub_received_at))}
                    {mani?.hub_dispatched_at && row(T.dHubOut, fmt(mani.hub_dispatched_at))}
                    {gps && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12.5, padding: '5px 0' }}>
                        <span style={{ minWidth: 120, color: '#6C82A6' }}>{T.dGps}</span>
                        <a href={`https://www.google.com/maps?q=${md.lat},${md.lng}`} target="_blank" rel="noreferrer" style={{ color: '#087CF0', fontWeight: 600 }}>{gps} · {T.mapView}</a>
                      </div>
                    )}
                    {evidence && row(T.dEvidence, <a href={evidence} target="_blank" rel="noreferrer" style={{ color: '#087CF0' }}>{T.dEvidence}</a>)}
                  </div>
                )
              })()}
            </div>

            {history.length > 0 && (
              <div>
                <div style={sect}>{T.dHistory}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12.5 }}>
                      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 700, color: '#001B45', minWidth: 130 }}>{h.status}</span>
                      <span style={{ color: '#6C82A6' }}>{fmt(h.at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {s.return_reviewed_at && (
              <div style={box}><div style={sect}>{T.dReview}</div><div style={line}>{T.reviewedBy(s.return_reviewer?.name || T.reviewed, fmt(s.return_reviewed_at))}</div></div>
            )}
          </div>
        )}

        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid #E3EAF4', textAlign: 'right' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #DCE6F5', background: '#fff', color: '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{T.close}</button>
        </div>
      </div>
    </div>
  )
}
