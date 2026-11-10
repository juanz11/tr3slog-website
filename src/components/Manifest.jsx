import React from 'react'
import { api } from '../api'

const T_ES = {
  title: 'Manifiestos de ruta',
  subtitle: 'Crear manifiestos, asignar chofer y vehículo, y seguir el estado real de cada bulto.',
  manifestTitle: 'Manifiesto de carga',
  manifestLabel: 'Manifiesto',
  driverLabel: 'Chofer',
  vehicleLabel: 'Vehículo',
  createdLabel: 'Creado',
  startedLabel: 'Inicio de ruta',
  closedLabel: 'Cierre',
  packagesLabel: 'Bultos',
  progressLabel: 'Progreso',
  statusLabel: 'Estado',
  newManifest: 'Nuevo manifiesto',
  assign: 'Asignar chofer y vehículo',
  assignShort: 'Asignar',
  create: 'Crear',
  cancel: 'Cancelar',
  print: 'Imprimir',
  tabDigital: 'Vista digital',
  tabPrinted: 'Vista impresa',
  loading: 'Cargando manifiestos…',
  empty: 'No hay manifiestos. Cree el primero con "Nuevo manifiesto".',
  codeHint: 'Código (opcional, se genera automático)',
  stopsHint: 'Un tracking por línea',
  stopsRequired: 'Agregue al menos un código de seguimiento.',
  pickBoth: 'Seleccione chofer y vehículo.',
  driverPh: 'Chofer…',
  vehiclePh: 'Vehículo…',
  created: c => `Manifiesto ${c} creado.`,
  assigned: 'Manifiesto asignado al chofer.',
  derivedBanner: id => `Manifiesto derivado del traspaso del manifiesto #${id}.`,
  assistanceBanner: 'Aguardando asistencia vial: el traspaso fue rechazado y el manifiesto volvió a ruta.',
  detailCols: ['#', 'Tracking', 'QR', 'Estado', 'Hora visita', 'Motivo / GPS'],
  routeOrder: 'Orden de la ruta',
  requestsTitle: 'Solicitudes de traspaso',
  derivedTitle: 'Manifiestos derivados',
  pkgUnit: 'bultos',
  qrDemo: 'QR representa el tracking ID real registrado en el manifiesto.',
  qrCopy: 'Copia impresa válida solo para la versión indicada en el QR.',
  statsTotal: { k: 'Manifiestos', d: 'Todos los estados' },
  statsActive: { k: 'En ruta / asignados', d: 'Operación activa' },
  statsPending: { k: 'Bultos pendientes', d: 'Del manifiesto seleccionado' },
  statsIssues: { k: 'Con incidencias', d: 'Fallos o traspasos' },
  err: 'Error',
  noDriver: 'Sin chofer',
  pickReplacement: 'Elige el conductor de reemplazo',
  transferOk: 'Traspaso aprobado — manifiesto derivado creado',
  transferNo: 'Traspaso rechazado',
  stopsSaved: 'Paradas actualizadas',
  popupBlocked: 'Popup bloqueado',
  scopeActive: n => `Activos (${n})`,
  scopeClosed: 'Cerrados',
  noActive: 'No hay manifiestos activos',
  noClosed: 'No hay manifiestos cerrados',
  lastN: n => `Últimos ${n}`,
  editStops: 'Editar paradas',
  add: 'Agregar',
  saveStops: 'Guardar paradas',
  approveBtn: 'Aprobar',
  rejectBtn: 'Rechazar',
  replPh: 'Chofer reemplazo…',
  sfRecipient: 'Destinatario', sfCompany: 'Empresa', sfStatus: 'Estado', sfRoute: 'Ruta',
  sfAddress: 'Dirección', sfCity: 'Ciudad', sfCountry: 'País', sfZip: 'ZIP',
  sfPhone: 'Teléfono', sfEmail: 'Correo', sfSender: 'Remitente', sfSenderPhone: 'Tel. remitente',
  sfService: 'Servicio', sfMode: 'Modalidad', sfPay: 'Método de pago', sfAmount: 'Monto',
  histT: 'Historial del manifiesto',
  evCreated: 'Manifiesto creado',
  evHubIn: 'Recibido en hub',
  evStart: 'Inicio de ruta',
  evStopOk: 'Parada entregada',
  evStopFail: 'Entrega fallida',
  evTransferReq: 'Traspaso solicitado',
  evTransferOk: 'Traspaso aprobado',
  evTransferNo: 'Traspaso rechazado',
  evHubOut: 'Despachado del hub',
  evClosed: 'Manifiesto cerrado',
}

const T_EN = {
  title: 'Route manifests',
  subtitle: 'Create manifests, assign driver and vehicle, and track the real status of each package.',
  manifestTitle: 'Cargo manifest',
  manifestLabel: 'Manifest',
  driverLabel: 'Driver',
  vehicleLabel: 'Vehicle',
  createdLabel: 'Created',
  startedLabel: 'Route start',
  closedLabel: 'Closed',
  packagesLabel: 'Packages',
  progressLabel: 'Progress',
  statusLabel: 'Status',
  newManifest: 'New manifest',
  assign: 'Assign driver & vehicle',
  assignShort: 'Assign',
  create: 'Create',
  cancel: 'Cancel',
  print: 'Print',
  tabDigital: 'Digital view',
  tabPrinted: 'Print view',
  loading: 'Loading manifests…',
  empty: 'No manifests. Create the first one with "New manifest".',
  codeHint: 'Code (optional, auto-generated)',
  stopsHint: 'One tracking per line',
  stopsRequired: 'Add at least one tracking code.',
  pickBoth: 'Select driver and vehicle.',
  driverPh: 'Driver…',
  vehiclePh: 'Vehicle…',
  created: c => `Manifest ${c} created.`,
  assigned: 'Manifest assigned to driver.',
  derivedBanner: id => `Manifest derived from transfer of manifest #${id}.`,
  assistanceBanner: 'Awaiting roadside assistance: the transfer was rejected and the manifest is back on route.',
  detailCols: ['#', 'Tracking', 'QR', 'Status', 'Visit time', 'Reason / GPS'],
  routeOrder: 'Route order',
  requestsTitle: 'Transfer requests',
  derivedTitle: 'Derived manifests',
  pkgUnit: 'packages',
  qrDemo: 'QR represents the real tracking ID registered in the manifest.',
  qrCopy: 'Printed copy valid only for the version shown in the QR.',
  statsTotal: { k: 'Manifests', d: 'All statuses' },
  statsActive: { k: 'On route / assigned', d: 'Active operation' },
  statsPending: { k: 'Pending packages', d: 'From selected manifest' },
  statsIssues: { k: 'With issues', d: 'Failures or transfers' },
  err: 'Error',
  noDriver: 'No driver',
  pickReplacement: 'Choose the replacement driver',
  transferOk: 'Transfer approved — derived manifest created',
  transferNo: 'Transfer rejected',
  stopsSaved: 'Stops updated',
  popupBlocked: 'Popup blocked',
  scopeActive: n => `Active (${n})`,
  scopeClosed: 'Closed',
  noActive: 'No active manifests',
  noClosed: 'No closed manifests',
  lastN: n => `Last ${n}`,
  editStops: 'Edit stops',
  add: 'Add',
  saveStops: 'Save stops',
  approveBtn: 'Approve',
  rejectBtn: 'Reject',
  replPh: 'Replacement driver…',
  sfRecipient: 'Recipient', sfCompany: 'Company', sfStatus: 'Status', sfRoute: 'Route',
  sfAddress: 'Address', sfCity: 'City', sfCountry: 'Country', sfZip: 'ZIP',
  sfPhone: 'Phone', sfEmail: 'Email', sfSender: 'Sender', sfSenderPhone: 'Sender phone',
  sfService: 'Service', sfMode: 'Delivery mode', sfPay: 'Payment method', sfAmount: 'Amount',
  histT: 'Manifest history',
  evCreated: 'Manifest created',
  evHubIn: 'Received at hub',
  evStart: 'Route started',
  evStopOk: 'Stop delivered',
  evStopFail: 'Delivery failed',
  evTransferReq: 'Transfer requested',
  evTransferOk: 'Transfer approved',
  evTransferNo: 'Transfer rejected',
  evHubOut: 'Dispatched from hub',
  evClosed: 'Manifest closed',
}

const T_ZH = {
  title: '路线舱单',
  subtitle: '创建舱单、分配司机和车辆，并跟踪每件货物的真实状态。',
  manifestTitle: '货运舱单',
  manifestLabel: '舱单',
  driverLabel: '司机',
  vehicleLabel: '车辆',
  createdLabel: '创建时间',
  startedLabel: '路线开始',
  closedLabel: '关闭时间',
  packagesLabel: '包裹',
  progressLabel: '进度',
  statusLabel: '状态',
  newManifest: '新建舱单',
  assign: '分配司机和车辆',
  assignShort: '分配',
  create: '创建',
  cancel: '取消',
  print: '打印',
  tabDigital: '数字视图',
  tabPrinted: '打印视图',
  loading: '正在加载舱单…',
  empty: '暂无舱单。点击"新建舱单"创建第一个。',
  codeHint: '编号（可选，自动生成）',
  stopsHint: '每行一个运单号',
  stopsRequired: '请至少添加一个运单号。',
  pickBoth: '请选择司机和车辆。',
  driverPh: '司机…',
  vehiclePh: '车辆…',
  created: c => `舱单 ${c} 已创建。`,
  assigned: '舱单已分配给司机。',
  derivedBanner: id => `由舱单 #${id} 的转移派生的舱单。`,
  assistanceBanner: '等待道路救援：转移被拒绝，舱单已恢复在途。',
  detailCols: ['#', '运单号', '二维码', '状态', '到访时间', '原因 / GPS'],
  routeOrder: '路线顺序',
  requestsTitle: '转移请求',
  derivedTitle: '派生舱单',
  pkgUnit: '件',
  qrDemo: '二维码代表舱单中登记的真实运单号。',
  qrCopy: '打印件仅对二维码所示版本有效。',
  statsTotal: { k: '舱单', d: '所有状态' },
  statsActive: { k: '在途 / 已分配', d: '进行中业务' },
  statsPending: { k: '待处理包裹', d: '所选舱单' },
  statsIssues: { k: '有异常', d: '失败或转移' },
  err: '错误',
  noDriver: '无司机',
  pickReplacement: '请选择替代司机',
  transferOk: '转移已批准——已创建派生舱单',
  transferNo: '转移已拒绝',
  stopsSaved: '停靠点已更新',
  popupBlocked: '弹窗被拦截',
  scopeActive: n => `进行中（${n}）`,
  scopeClosed: '已关闭',
  noActive: '没有进行中的舱单',
  noClosed: '没有已关闭的舱单',
  lastN: n => `最近 ${n} 条`,
  editStops: '编辑停靠点',
  add: '添加',
  saveStops: '保存停靠点',
  approveBtn: '批准',
  rejectBtn: '拒绝',
  replPh: '替代司机…',
  sfRecipient: '收件人', sfCompany: '公司', sfStatus: '状态', sfRoute: '路线',
  sfAddress: '地址', sfCity: '城市', sfCountry: '国家', sfZip: '邮编',
  sfPhone: '电话', sfEmail: '邮箱', sfSender: '寄件人', sfSenderPhone: '寄件人电话',
  sfService: '服务', sfMode: '配送方式', sfPay: '付款方式', sfAmount: '金额',
  histT: '舱单历史',
  evCreated: '舱单已创建',
  evHubIn: '已到仓库',
  evStart: '路线开始',
  evStopOk: '停靠点已送达',
  evStopFail: '投递失败',
  evTransferReq: '已请求转移',
  evTransferOk: '转移已批准',
  evTransferNo: '转移已拒绝',
  evHubOut: '已从仓库发出',
  evClosed: '舱单已关闭',
}

const T_BY_LANG = { es: T_ES, en: T_EN, 'zh-CN': T_ZH }

const ACTIVE_STATES = ['CREADO', 'ASIGNADO', 'EN_RUTA', 'EN_SOLICITUD_TRASPASO']
const CLOSED_LIMIT = 20

const ESTADOS_ES = {
  CREADO: 'Creado',
  ASIGNADO: 'Asignado',
  EN_RUTA: 'En ruta',
  EN_SOLICITUD_TRASPASO: 'Traspaso solicitado',
  COMPLETADO: 'Completado',
  COMPLETADO_CON_INCIDENCIAS: 'Completado con incidencias',
  TRANSFERIDO: 'Transferido',
}
const DETALLES_ES = {
  PENDIENTE: 'Pendiente',
  ENTREGADO: 'Entregado',
  NO_ENTREGADO: 'No entregado',
  TRANSFERIDO: 'Transferido',
}
const SOLICITUD_ES = { PENDIENTE: 'Pendiente', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada' }

const ESTADOS_EN = {
  CREADO: 'Created',
  ASIGNADO: 'Assigned',
  EN_RUTA: 'On route',
  EN_SOLICITUD_TRASPASO: 'Transfer requested',
  COMPLETADO: 'Completed',
  COMPLETADO_CON_INCIDENCIAS: 'Completed with issues',
  TRANSFERIDO: 'Transferred',
}
const DETALLES_EN = {
  PENDIENTE: 'Pending',
  ENTREGADO: 'Delivered',
  NO_ENTREGADO: 'Not delivered',
  TRANSFERIDO: 'Transferred',
}
const SOLICITUD_EN = { PENDIENTE: 'Pending', APROBADA: 'Approved', RECHAZADA: 'Rejected' }

const ESTADOS_ZH = {
  CREADO: '已创建',
  ASIGNADO: '已分配',
  EN_RUTA: '在途',
  EN_SOLICITUD_TRASPASO: '已请求转移',
  COMPLETADO: '已完成',
  COMPLETADO_CON_INCIDENCIAS: '已完成（有异常）',
  TRANSFERIDO: '已转移',
}
const DETALLES_ZH = {
  PENDIENTE: '待处理',
  ENTREGADO: '已送达',
  NO_ENTREGADO: '未送达',
  TRANSFERIDO: '已转移',
}
const SOLICITUD_ZH = { PENDIENTE: '待处理', APROBADA: '已批准', RECHAZADA: '已拒绝' }

const ESTADOS_BY_LANG = { es: ESTADOS_ES, en: ESTADOS_EN, 'zh-CN': ESTADOS_ZH }
const DETALLES_BY_LANG = { es: DETALLES_ES, en: DETALLES_EN, 'zh-CN': DETALLES_ZH }
const SOLICITUD_BY_LANG = { es: SOLICITUD_ES, en: SOLICITUD_EN, 'zh-CN': SOLICITUD_ZH }

const TONE = {
  neutral: { bg: '#EEF4FC', fg: '#10233F' },
  info: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  ok: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  warn: { bg: 'rgba(217,154,0,.16)', fg: '#6C5220' },
  bad: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}
const MANIFEST_TONE = {
  CREADO: 'neutral', ASIGNADO: 'info', EN_RUTA: 'info',
  EN_SOLICITUD_TRASPASO: 'warn', COMPLETADO: 'ok',
  COMPLETADO_CON_INCIDENCIAS: 'warn', TRANSFERIDO: 'neutral',
}
const DETAIL_TONE = { PENDIENTE: 'warn', ENTREGADO: 'ok', NO_ENTREGADO: 'bad', TRANSFERIDO: 'neutral' }
const REQ_TONE = { PENDIENTE: 'warn', APROBADA: 'ok', RECHAZADA: 'bad' }

const fmtDT = iso =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '—'

function qrPath(value) {
  const N = 29
  const grid = Array(N).fill(0).map(() => Array(N).fill(0))
  const setFinder = (r0, c0) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const border = r === 0 || r === 6 || c === 0 || c === 6
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        grid[r0 + r][c0 + c] = border || inner ? 1 : 0
      }
    }
  }
  setFinder(0, 0)
  setFinder(0, N - 7)
  setFinder(N - 7, 0)
  let h = 0
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) % 1000003
  }
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)) continue
      h = (h * 31 + (r + 1) * (c + 1)) % 1000003
      grid[r][c] = h % 2
    }
  }
  const parts = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c]) parts.push(`M${c} ${r}h1v1h-1z`)
    }
  }
  return parts.join('')
}

export const SITE_URL = (typeof window !== 'undefined' && window.location?.origin) || 'https://termocontroljb.com'
export const trackUrl = (code) => `${SITE_URL}/track?code=${encodeURIComponent(code || '')}`

export function Qr({ value, size = 44, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size * 4}x${size * 4}&margin=0&data=${encodeURIComponent(value)}`}
        width={size}
        height={size}
        alt={label || `QR ${value}`}
        style={{ display: 'block' }}
      />
      {label && (
        <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#10233F' }}>{label}</div>
      )}
    </div>
  )
}

const C128 = ['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112']

export function Barcode({ value, height = 56 }) {
  const segs = React.useMemo(() => {
    const vals = [104]
    let chk = 104
    ;[...String(value || '')].forEach((ch, i) => {
      const v = Math.min(Math.max(ch.charCodeAt(0), 32), 126) - 32
      vals.push(v)
      chk += v * (i + 1)
    })
    vals.push(chk % 103, 106)
    const out = []
    for (const v of vals) {
      const p = C128[v]
      for (let i = 0; i < p.length; i++) out.push(i % 2 === 0 ? +p[i] : -+p[i])
    }
    return out
  }, [value])
  let x = 0
  const rects = []
  segs.forEach((s, i) => {
    const w = Math.abs(s)
    if (s > 0) rects.push(<rect key={i} x={x} y={0} width={w} height={height} fill="#10233F" />)
    x += w
  })
  return <svg width="100%" height={height} viewBox={`0 0 ${x} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>{rects}</svg>
}

function ShippingLabel({ m, d }) {
  const ped = d.pedido || {}
  const pk = (ped.paquetes || [])[0] || {}
  const code = d.codigoSeguimiento || ''
  const seq = d.secuenciaVisita || 1
  const total = Math.max(1, (m?.detalles || []).length)
  const fragile = !!pk.fragile || (ped.paquetes || []).some(p => p.fragile) || /fr[aá]gil/i.test([ped.notas, pk.contenido, pk.notas].filter(Boolean).join(' '))
  const lbs = pk.peso ?? ped.peso ?? ped.pesoTotal
  const dims = pk.dimensiones || ((pk.largo && pk.ancho && pk.alto) ? `${pk.largo}×${pk.ancho}×${pk.alto}` : null)
  const mono = { fontFamily: 'ui-monospace, Menlo, monospace' }
  const lbl = { fontSize: 9, fontWeight: 700, letterSpacing: '.12em', color: '#087CF0', textTransform: 'uppercase' }
  return (
    <div style={{ width: 560, maxWidth: '100%', background: '#fff', border: '1px solid #C9D6EA', borderRadius: 6, overflow: 'hidden', fontFamily: 'Arial, sans-serif', color: '#10233F' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #E3EBF7' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 20, color: '#001B45' }}>TR3S<span style={{ color: '#087CF0' }}>LOG</span></div>
        <div style={{ background: '#001B45', color: '#fff', padding: '8px 16px', borderRadius: 4, fontWeight: 800, fontSize: 15, letterSpacing: '.04em', textAlign: 'center' }}>ÚLTIMA MILLA</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 20px', borderBottom: '1px solid #E3EBF7' }}>
        <div>
          <div style={lbl}>Remitente</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{ped.remitente || 'TR3SLOG'}</div>
          <div style={{ fontSize: 12, color: '#4A5B76' }}>{ped.origen || '—'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={lbl}>Fecha</div>
          <div style={{ fontSize: 13 }}>{new Date().toLocaleDateString()}</div>
          <div style={{ ...lbl, marginTop: 8 }}>Referencia</div>
          <div style={{ fontSize: 12, ...mono, color: '#0768C9' }}>{m?.codigo || '—'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #E3EBF7' }}>
        <div style={{ background: '#001B45', color: '#fff', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 10, letterSpacing: '.18em', fontWeight: 700, display: 'flex', alignItems: 'center', padding: '14px 8px' }}>DESTINATARIO</div>
        <div style={{ flex: 1, padding: '16px 20px' }}>
          <div style={{ fontSize: 19, fontWeight: 800 }}>{ped.destinatario || '—'}</div>
          <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.45 }}>{ped.direccion || '—'}</div>
          <div style={{ fontSize: 13, color: '#4A5B76' }}>{ped.destino || ''}</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>{ped.telefono || ''}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #E3EBF7' }}>
        <div>
          <div style={lbl}>Manifiesto · Secuencia</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#001B45', marginTop: 4 }}>{m?.codigo || '—'} · {seq}</div>
        </div>
        <div style={{ border: '2px solid #087CF0', borderRadius: 6, padding: '6px 14px', fontSize: 18, fontWeight: 800, color: '#001B45' }}>{seq} de {total}</div>
      </div>
      <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid #E3EBF7' }}>
        <Barcode value={code} height={62} />
        <div style={{ textAlign: 'center', ...mono, fontSize: 15, fontWeight: 700, letterSpacing: '.14em', marginTop: 6 }}>{code}</div>
      </div>
      <div style={{ display: 'flex', gap: 20, padding: '14px 20px', alignItems: 'center', borderBottom: '1px solid #E3EBF7' }}>
        <Qr value={trackUrl(code)} size={92} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1 }}>
          <div><div style={lbl}>Peso</div><div style={{ fontSize: 15, fontWeight: 700 }}>{lbs != null ? `${lbs} kg` : '—'}</div></div>
          <div><div style={lbl}>Dimensiones</div><div style={{ fontSize: 15, fontWeight: 700 }}>{dims || '—'}</div></div>
          <div><div style={lbl}>Piezas</div><div style={{ fontSize: 15, fontWeight: 700 }}>{pk.piezas ?? ped.piezas ?? '—'}</div></div>
          <div><div style={lbl}>Tipo</div><div style={{ fontSize: 15, fontWeight: 700 }}>{pk.tipo || '—'}</div></div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '12px 20px', alignItems: 'center' }}>
        {fragile && <span style={{ background: '#C0392B', color: '#fff', padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 800 }}>FRÁGIL</span>}
        <span style={{ background: '#D99A00', color: '#001B45', padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 800 }}>FIRMA REQUERIDA</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#8B9DBA' }}>Escanea el QR para rastrear</span>
      </div>
    </div>
  )
}

const chip = (label, tone) => (
  <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: tone.bg, color: tone.fg }}>
    {label}
  </span>
)

const btn = (label, primary, off, run) => (
  <button type="button" aria-disabled={off} onClick={run}
    style={{ minHeight: 44, padding: '11px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: off ? 'not-allowed' : 'pointer', background: primary ? '#087CF0' : '#fff', color: primary ? '#fff' : '#001B45', border: `1.5px solid ${primary ? '#087CF0' : '#DCE6F5'}`, opacity: off ? 0.45 : 1, font: 'inherit' }}>
    {label}
  </button>
)

const inputStyle = { padding: '10px 12px', borderRadius: 9, border: '1.5px solid #DCE6F5', font: 'inherit', fontSize: 13, background: '#fff', color: '#10233F', minWidth: 0 }

function CreatePanel({ create, setCreate, token, shipments, setShipments, shipQuery, setShipQuery, onCreate, onCancel, t }) {
  React.useEffect(() => {
    if (!create.open || !token) return
    let cancelled = false
    api.getShipments(token)
      .then(rows => {
        if (cancelled) return
        const arr = Array.isArray(rows) ? rows : (rows && rows.data) || []
        setShipments(arr)
      })
      .catch(() => setShipments([]))
    return () => { cancelled = true }
  }, [create.open, token, setShipments])

  const filtered = React.useMemo(() => {
    const q = shipQuery.trim().toLowerCase()
    if (!q) return shipments
    return shipments.filter(s => {
      const t = String(s.tracking_number || '').toLowerCase()
      const d = String(s.destination || '').toLowerCase()
      const r = String(s.recipient_name || '').toLowerCase()
      return t.includes(q) || d.includes(q) || r.includes(q)
    })
  }, [shipments, shipQuery])

  const isSelected = (id) => create.stops.some(s => s.shipment_id === id)

  const toggle = (s) => {
    setCreate(c => {
      const exists = c.stops.some(x => x.shipment_id === s.id)
      if (exists) {
        return { ...c, stops: c.stops.filter(x => x.shipment_id !== s.id) }
      }
      return {
        ...c,
        stops: [...c.stops, { shipment_id: s.id, tracking_code: s.tracking_number || `ENV-${s.id}` }],
      }
    })
  }

  const remove = (id) => setCreate(c => ({ ...c, stops: c.stops.filter(x => x.shipment_id !== id) }))

  const chipStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100,
    background: 'rgba(8,124,240,.1)', color: '#0768C9', fontSize: 12, fontWeight: 600,
  }

  return (
    <div style={{ padding: '14px 22px', borderBottom: '1px solid #E3EBF7', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input style={inputStyle} placeholder={t.codeHint} value={create.code} onChange={e => setCreate(c => ({ ...c, code: e.target.value }))} />

      <div style={{ fontSize: 13, fontWeight: 700, color: '#001B45' }}>Envíos a incluir</div>
      <input style={inputStyle} placeholder="Buscar por tracking, destino o destinatario…" value={shipQuery} onChange={e => setShipQuery(e.target.value)} />

      <div style={{ border: '1.5px solid #DCE6F5', borderRadius: 9, maxHeight: 240, overflow: 'auto', background: '#fff' }}>
        {filtered.length === 0 && (
          <div style={{ padding: 16, color: '#6C82A6', fontSize: 13 }}>No hay envíos disponibles. Cargue envíos primero o verifique permisos.</div>
        )}
        {filtered.map(s => {
          const checked = isSelected(s.id)
          return (
            <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: '1px solid #E3EBF7', cursor: 'pointer', background: checked ? 'rgba(8,124,240,.06)' : '#fff' }}>
              <input type="checkbox" checked={checked} onChange={() => toggle(s)} />
              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5, color: '#001B45', minWidth: 150 }}>{s.tracking_number || `ENV-${s.id}`}</span>
              <span style={{ flex: 1, fontSize: 12.5, color: '#10233F', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.destination || '—'}</span>
              <span style={{ fontSize: 12, color: '#6C82A6' }}>{s.recipient_name || s.status || ''}</span>
            </label>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#6C82A6' }}>{create.stops.length} seleccionado(s)</span>
        {create.stops.map((s, i) => (
          <span key={s.shipment_id || i} style={chipStyle}>
            {s.tracking_code}
            <button type="button" onClick={() => remove(s.shipment_id)}
              style={{ background: 'transparent', border: 'none', color: '#0768C9', fontSize: 16, lineHeight: 1, cursor: 'pointer', padding: 0, width: 18 }}>
              ×
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {btn(t.create, true, create.busy, onCreate)}
        {btn(t.cancel, false, false, onCancel)}
      </div>
    </div>
  )
}

export default function Manifest({ token, selectId, lang }) {
  const T = T_BY_LANG[lang] || T_ES
  const ESTADOS = ESTADOS_BY_LANG[lang] || ESTADOS_ES
  const DETALLES = DETALLES_BY_LANG[lang] || DETALLES_ES
  const SOLICITUD = SOLICITUD_BY_LANG[lang] || SOLICITUD_ES
  const [view, setView] = React.useState('digital')
  const [list, setList] = React.useState([])
  const [sel, setSel] = React.useState(null)
  const [editStops, setEditStops] = React.useState(null)
  const [editBusy, setEditBusy] = React.useState(false)
  const [editAdd, setEditAdd] = React.useState('')
  const [viewStop, setViewStop] = React.useState(null)
  const [labelDetail, setLabelDetail] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState('')
  const [toast, setToast] = React.useState('')
  const [drivers, setDrivers] = React.useState(null)
  const [assign, setAssign] = React.useState({ open: false, driverId: '', vehicleId: '', busy: false })
  const [create, setCreate] = React.useState({ open: false, code: '', stops: [], busy: false })
  const [shipments, setShipments] = React.useState([])
  const [shipQuery, setShipQuery] = React.useState('')
  const toastRef = React.useRef(null)

  const notify = (m) => {
    setToast(m)
    clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(''), 4500)
  }
  React.useEffect(() => () => clearTimeout(toastRef.current), [])

  const load = React.useCallback(async (keepSel = true) => {
    try {
      const rows = await api.getManifests(token)
      const arr = Array.isArray(rows) ? rows : []
      setList(arr)
      const firstActive = arr.find(r => ACTIVE_STATES.includes(r.estado)) || arr[0]
      setSel(prev => (keepSel && arr.some(r => r.id === prev)) ? prev : (firstActive ? firstActive.id : null))
      setErr('')
    } catch (e) {
      setErr(e.message || T.err)
    } finally {
      setLoading(false)
    }
  }, [token])

  React.useEffect(() => { if (token) load(); else setLoading(false) }, [token, load])

  React.useEffect(() => {
    if (selectId) setSel(Number(selectId))
  }, [selectId])

  const [scope, setScope] = React.useState('active')
  const activeList = list.filter(x => ACTIVE_STATES.includes(x.estado))
  const closedList = list
    .filter(x => !ACTIVE_STATES.includes(x.estado))
    .sort((a, b) => new Date(b.fechaCierre || b.fechaCreacion || 0) - new Date(a.fechaCierre || a.fechaCreacion || 0))
    .slice(0, CLOSED_LIMIT)

  // El manifiesto seleccionado siempre debe estar visible en el selector.
  React.useEffect(() => {
    const cur = list.find(x => x.id === sel)
    if (!cur) return
    const isActive = ACTIVE_STATES.includes(cur.estado)
    if (isActive && scope !== 'active') setScope('active')
    if (!isActive && scope !== 'closed') setScope('closed')
  }, [sel, list])

  const changeScope = (next) => {
    setScope(next)
    const pool = next === 'active' ? activeList : closedList
    if (!pool.some(x => x.id === sel)) setSel(pool[0] ? pool[0].id : null)
  }

  const optionLabel = (x) => [
    x.codigo,
    x.chofer?.nombre || (x.estado === 'CREADO' ? T.noDriver : null),
    `${(x.detalles || []).length} ${T.pkgUnit}`,
  ].filter(Boolean).join(' · ')

  const loadDrivers = async () => {
    if (drivers) return
    try {
      const rows = await api.getDrivers(token)
      setDrivers(Array.isArray(rows) ? rows : (rows && rows.data) || [])
    } catch (e) {
      notify(e.message)
      setDrivers([])
    }
  }

  const m = list.find(x => x.id === sel) || null
  const isEditable = m && ['CREADO', 'ASIGNADO'].includes(m.estado)

  const history = React.useMemo(() => {
    if (!m) return []
    const ev = []
    if (m.fechaCreacion) ev.push({ at: m.fechaCreacion, l: T.evCreated })
    if (m.hubRecibidoAt) ev.push({ at: m.hubRecibidoAt, l: T.evHubIn })
    if (m.fechaInicioRuta) ev.push({
      at: m.fechaInicioRuta, l: T.evStart,
      d: [m.chofer?.nombre, m.vehiculo ? [m.vehiculo.nombre, m.vehiculo.placa].filter(Boolean).join(' · ') : null].filter(Boolean).join(' — '),
    })
    ;(m.detalles || []).forEach((d, i) => {
      if (!d.horaVisita) return
      ev.push({
        at: d.horaVisita,
        l: d.estado === 'NO_ENTREGADO' ? T.evStopFail : T.evStopOk,
        d: `#${d.secuenciaVisita || i + 1} ${d.codigoSeguimiento}${d.motivoFallo ? ` · ${d.motivoFallo}` : ''}`,
      })
    })
    ;(m.solicitudes || []).forEach((s) => {
      if (s.fechaSolicitud) ev.push({ at: s.fechaSolicitud, l: T.evTransferReq, d: s.motivoIncidencia })
      if (s.fechaResolucion) ev.push({ at: s.fechaResolucion, l: s.estado === 'APROBADA' ? T.evTransferOk : T.evTransferNo, d: s.motivoResolucion })
    })
    if (m.hubDespachadoAt) ev.push({ at: m.hubDespachadoAt, l: T.evHubOut })
    if (m.fechaCierre) ev.push({ at: m.fechaCierre, l: T.evClosed, d: ESTADOS[m.estado] || m.estado })
    return ev.sort((a, b) => new Date(a.at) - new Date(b.at))
  }, [m, T, ESTADOS])

  const MANI_CLOSED = ['COMPLETADO', 'COMPLETADO_CON_INCIDENCIAS', 'TRANSFERIDO']
  const SHIP_DONE = ['delivered', 'entregado', 'entregada', 'cancelled', 'cancelado', 'no_entregado', 'devuelto', 'returned']
  const takenTrackings = React.useMemo(() => new Set(
    list.filter(x => !MANI_CLOSED.includes(x.estado))
        .flatMap(x => (x.detalles || []).map(d => d.codigoSeguimiento))
  ), [list])
  const selectableShipments = shipments.filter(s =>
    !takenTrackings.has(s.tracking_number) &&
    !SHIP_DONE.includes(String(s.status || '').toLowerCase())
  )

  const [resolveDriver, setResolveDriver] = React.useState({})
  const [resolveBusy, setResolveBusy] = React.useState(null)

  React.useEffect(() => {
    if ((m?.solicitudes || []).some(s => s.estado === 'PENDIENTE')) loadDrivers()
  }, [m])

  const resolveTransfer = async (s, approve) => {
    const driverId = resolveDriver[s.id]
    if (approve && !driverId) { notify(T.pickReplacement); return }
    setResolveBusy(s.id)
    try {
      await api.resolveTransferRequest(s.id, { approve, replacement_driver_id: driverId ? Number(driverId) : undefined }, token)
      await load()
      notify(approve ? T.transferOk : T.transferNo)
    } catch (e) {
      notify(e.message)
    } finally {
      setResolveBusy(null)
    }
  }

  const openStopsEdit = () => {
    setEditStops((m.detalles || []).map(d => ({ shipment_id: d.pedidoId, tracking_code: d.codigoSeguimiento })))
    setEditAdd('')
    api.getShipments(token)
      .then(r => setShipments(Array.isArray(r) ? r : (r && r.data) || []))
      .catch(() => {})
  }

  const saveStops = async () => {
    if (!editStops || !editStops.length) return
    setEditBusy(true)
    try {
      await api.updateManifestStops(m.id, editStops, token)
      setEditStops(null)
      await load()
      notify(T.stopsSaved)
    } catch (e) {
      notify(e.message)
    } finally {
      setEditBusy(false)
    }
  }

  const driverName = (id) => {
    const d = (drivers || []).find(x => x.user_id === id)
    return d ? d.name : (id ? `#${id}` : '—')
  }
  const vehicleName = (id) => {
    const all = (drivers || []).flatMap(d => d.vehicles || [])
    const v = all.find(x => x.id === id)
    return v ? `${v.label || ''}${v.plate ? ' · ' + v.plate : ''}` : (id ? `#${id}` : '—')
  }
  const selectedDriver = (drivers || []).find(d => String(d.user_id) === String(assign.driverId))
  const pendingCount = m ? (m.detalles || []).filter(d => d.estado === 'PENDIENTE').length : 0
  const issuesCount = list.filter(x =>
    x.estado === 'COMPLETADO_CON_INCIDENCIAS' ||
    x.estado === 'EN_SOLICITUD_TRASPASO' ||
    (x.detalles || []).some(d => d.estado === 'NO_ENTREGADO')
  ).length
  const stats = [
    { ...T.statsTotal, v: String(list.length) },
    { ...T.statsActive, v: String(list.filter(x => ['ASIGNADO', 'EN_RUTA', 'EN_SOLICITUD_TRASPASO'].includes(x.estado)).length) },
    { ...T.statsPending, v: String(pendingCount) },
    { ...T.statsIssues, v: String(issuesCount) },
  ]

  const doCreate = async () => {
    if (!create.stops.length) { notify(T.stopsRequired); return }
    setCreate(c => ({ ...c, busy: true }))
    try {
      const created = await api.createManifest({ codigo: create.code.trim() || undefined, stops: create.stops }, token)
      notify(T.created(created.codigo))
      setCreate({ open: false, code: '', stops: [], busy: false })
      setShipQuery('')
      await load(false)
      setSel(created.id)
    } catch (e) { notify(e.message) }
    setCreate(c => ({ ...c, busy: false }))
  }

  const doAssign = async () => {
    if (!assign.driverId || !assign.vehicleId) { notify(T.pickBoth); return }
    setAssign(a => ({ ...a, busy: true }))
    try {
      await api.assignManifest(m.id, { driver_id: Number(assign.driverId), vehicle_id: Number(assign.vehicleId) }, token)
      notify(T.assigned)
      setAssign({ open: false, driverId: '', vehicleId: '', busy: false })
      await load()
    } catch (e) { notify(e.message) }
    setAssign(a => ({ ...a, busy: false }))
  }

  const printManifest = () => {
    if (!m) return
    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
    const qrSvgString = (text, size) =>
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 29 29" shape-rendering="crispEdges"><rect width="29" height="29" fill="#fff"/><path fill="#001B45" d="' + qrPath(text) + '"/></svg>'
    const meta = [
      [T.manifestLabel, m.codigo],
      [T.statusLabel, ESTADOS[m.estado] || m.estado],
      [T.driverLabel, driverName(m.choferId)],
      [T.vehicleLabel, vehicleName(m.vehiculoId)],
      [T.createdLabel, fmtDT(m.fechaCreacion)],
      [T.startedLabel, fmtDT(m.fechaInicioRuta)],
    ].map(([k, v]) => '<div><small>' + esc(k) + '</small><b>' + esc(v) + '</b></div>').join('')
    const head = T.detailCols.map(c => '<th>' + esc(c) + '</th>').join('')
    const body = (m.detalles || []).map((d, i) =>
      '<tr><td>' + (d.secuenciaVisita || i + 1) + '</td><td class="m">' + esc(d.codigoSeguimiento) + '</td><td>' + qrSvgString(d.codigoSeguimiento, 54) + '</td><td>' + esc(DETALLES[d.estado] || d.estado) + '</td><td>' + esc(fmtDT(d.horaVisita)) + '</td><td>' + esc(d.motivoFallo || '') + '</td></tr>'
    ).join('')
    const doc = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(m.codigo) + '</title><style>body{font-family:Inter,Arial,sans-serif;color:#10233F;margin:28px}h1{font:800 22px Montserrat,Arial;color:#001B45;margin:2px 0 14px}.top{display:flex;gap:24px;justify-content:space-between}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 18px}small{display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#6C82A6}b{font-size:13px}table{width:100%;border-collapse:collapse;margin-top:18px;font-size:12px}th{background:#001B45;color:#fff;text-align:left;padding:7px 8px;font-size:10px;text-transform:uppercase}td{border-top:1px solid #DCE6F5;padding:6px 8px;vertical-align:middle}.m{font-family:Menlo,monospace}.f{margin-top:18px;font-size:10px;color:#6C82A6;display:flex;justify-content:space-between}</style></head><body>'
      + '<div class="top"><div><b style="letter-spacing:.08em;color:#001B45">TR3SLOG</b><h1>' + esc(T.manifestTitle) + '</h1><div class="g">' + meta + '</div></div><div style="text-align:center">' + qrSvgString(m.codigo, 120) + '<div class="m" style="font-size:10px">' + esc(m.codigo) + '</div></div></div>'
      + '<table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table><div class="f"><span>' + esc(T.qrDemo) + '</span><span>' + esc(T.qrCopy) + '</span></div></body></html>'
    const w = window.open('', '_blank')
    if (!w) { notify(T.popupBlocked); return }
    w.document.write(doc); w.document.close()
    setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 350)
  }

  return (
    <div style={{ maxWidth: 1220, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          <span style={{ width: 24, height: 5, background: '#D99A00', transform: 'skewX(-24deg)' }} />
          <span style={{ width: 9, height: 5, background: '#087CF0', transform: 'skewX(-24deg)' }} />
        </div>
        <h1 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: '0 0 8px', textWrap: 'pretty', color: '#001B45' }}>
          {T.title}
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch', lineHeight: 1.6, textWrap: 'pretty' }}>
          {T.subtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6C82A6', lineHeight: 1.4, minHeight: 34 }}>{s.k}</div>
            <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '-.02em', color: '#001B45', margin: '6px 0 4px' }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#8B9DBA', marginTop: 10, paddingTop: 10, borderTop: '1px solid #E3EBF7' }}>{s.d}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {T.manifestLabel}
          </div>
          <div role="tablist" style={{ display: 'inline-flex', border: '1.5px solid #DCE6F5', borderRadius: 100, overflow: 'hidden' }}>
            {[['active', T.scopeActive(activeList.length)], ['closed', T.scopeClosed]].map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={scope === k} onClick={() => changeScope(k)}
                style={{ padding: '7px 14px', border: 'none', background: scope === k ? '#001B45' : '#fff', color: scope === k ? '#fff' : '#10233F', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
          <select value={sel ?? ''} onChange={e => setSel(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 340 }} aria-label={T.manifestLabel}>
            {scope === 'active'
              ? ACTIVE_STATES.map(st => {
                  const group = activeList.filter(x => x.estado === st)
                  return group.length ? (
                    <optgroup key={st} label={`${ESTADOS[st]} (${group.length})`}>
                      {group.map(x => <option key={x.id} value={x.id}>{optionLabel(x)}</option>)}
                    </optgroup>
                  ) : null
                })
              : closedList.map(x => <option key={x.id} value={x.id}>{optionLabel(x)} · {ESTADOS[x.estado] || x.estado}</option>)}
            {(scope === 'active' ? activeList : closedList).length === 0 && (
              <option value="">{scope === 'active' ? T.noActive : T.noClosed}</option>
            )}
          </select>
          {scope === 'closed' && <span style={{ fontSize: 11.5, color: '#6C82A6' }}>{T.lastN(CLOSED_LIMIT)}</span>}
          {m && chip(ESTADOS[m.estado] || m.estado, TONE[MANIFEST_TONE[m.estado]] || TONE.neutral)}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {btn(T.newManifest, false, false, () => setCreate(c => ({ ...c, open: !c.open })))}
            {btn(T.assign, true, !isEditable, () => { setAssign(a => ({ ...a, open: !a.open })); loadDrivers() })}
            {m && isEditable && btn(T.editStops, false, false, openStopsEdit)}
            {btn(T.print, false, !m, printManifest)}
          </div>
        </div>

        {create.open && (
          <CreatePanel
            create={create}
            setCreate={setCreate}
            token={token}
            shipments={selectableShipments}
            setShipments={setShipments}
            shipQuery={shipQuery}
            setShipQuery={setShipQuery}
            onCreate={doCreate}
            onCancel={() => { setCreate({ open: false, code: '', stops: [], busy: false }); setShipQuery('') }}
            t={T}
          />
        )}

        {assign.open && m && isEditable && (
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #E3EBF7', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <select style={{ ...inputStyle, flex: '1 1 200px' }} value={assign.driverId} onChange={e => setAssign(a => ({ ...a, driverId: e.target.value, vehicleId: '' }))}>
              <option value="">{T.driverPh}</option>
              {(drivers || []).map(d => <option key={d.user_id} value={d.user_id}>{d.name} · {d.v}</option>)}
            </select>
            <select style={{ ...inputStyle, flex: '1 1 200px' }} value={assign.vehicleId} onChange={e => setAssign(a => ({ ...a, vehicleId: e.target.value }))}>
              <option value="">{T.vehiclePh}</option>
              {(selectedDriver?.vehicles || []).map(v => <option key={v.id} value={v.id}>{v.label || `#${v.id}`}{v.plate ? ` · ${v.plate}` : ''}</option>)}
            </select>
            {btn(T.assignShort, true, assign.busy || !assign.driverId || !assign.vehicleId, doAssign)}
          </div>
        )}

        {editStops && m && (
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #E3EBF7', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#001B45' }}>Editar paradas ({editStops.length})</div>
            <div style={{ border: '1px solid #DCE6F5', borderRadius: 9, overflow: 'hidden', background: '#fff' }}>
              {editStops.map((s, i) => {
                const ped = (m.detalles || []).find(d => d.codigoSeguimiento === s.tracking_code)?.pedido
                const sh = (shipments || []).find(x => (x.tracking_number || `ENV-${x.id}`) === s.tracking_code)
                const who = ped?.destinatario || sh?.recipient_name || '—'
                const where = [ped?.origen || sh?.origin, ped?.destino || sh?.destination].filter(Boolean).join(' → ') || '—'
                const tel = ped?.telefono || sh?.recipient_phone
                const st = ped?.estado || sh?.status
                const move = (dir) => setEditStops(list => {
                  const a = [...list]
                  const j = i + dir
                  if (j < 0 || j >= a.length) return a
                  ;[a[i], a[j]] = [a[j], a[i]]
                  return a
                })
                return (
                  <div key={s.tracking_code + i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', borderTop: i ? '1px solid #F0F5FB' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button type="button" onClick={() => move(-1)} disabled={i === 0} style={{ background: 'none', border: 'none', padding: 0, cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? '#C9D6E8' : '#087CF0', fontSize: 12, lineHeight: 1 }}>▲</button>
                      <button type="button" onClick={() => move(1)} disabled={i === editStops.length - 1} style={{ background: 'none', border: 'none', padding: 0, cursor: i === editStops.length - 1 ? 'default' : 'pointer', color: i === editStops.length - 1 ? '#C9D6E8' : '#087CF0', fontSize: 12, lineHeight: 1 }}>▼</button>
                    </div>
                    <span style={{ fontWeight: 700, color: '#001B45', fontSize: 13, minWidth: 20 }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5, color: '#10233F' }}>{s.tracking_code}</div>
                      <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>{who} · {where}{tel ? ` · ${tel}` : ''}{st ? ` · ${st}` : ''}</div>
                    </div>
                    <button type="button" onClick={() => setViewStop({ ped, sh, code: s.tracking_code })}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#087CF0', whiteSpace: 'nowrap' }}>Ver detalles</button>
                    <button type="button" onClick={() => setEditStops(list => list.filter(x => x.tracking_code !== s.tracking_code))}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#A93226', whiteSpace: 'nowrap' }}>Quitar</button>
                  </div>
                )
              })}
              {!editStops.length && <div style={{ padding: 16, fontSize: 13, color: '#6C82A6' }}>Sin paradas — agrega envíos abajo.</div>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <select style={{ ...inputStyle, flex: '1 1 240px' }} value={editAdd} onChange={e => setEditAdd(e.target.value)}>
                <option value="">Agregar envío…</option>
                {(selectableShipments || [])
                  .filter(s => !editStops.some(x => x.tracking_code === (s.tracking_number || `ENV-${s.id}`)))
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.tracking_number || `ENV-${s.id}`} · {s.destination || '—'}{s.recipient_name ? ` · ${s.recipient_name}` : ''}</option>
                  ))}
              </select>
              {btn(T.add, false, !editAdd, () => {
                const s = (shipments || []).find(x => String(x.id) === String(editAdd))
                if (s) setEditStops(list => [...list, { shipment_id: s.id, tracking_code: s.tracking_number || `ENV-${s.id}` }])
                setEditAdd('')
              })}
              <span style={{ flex: 1 }} />
              {btn(T.saveStops, true, editBusy || !editStops.length, saveStops)}
              {btn(T.cancel, false, false, () => setEditStops(null))}
            </div>
          </div>
        )}

        <div role="tablist" style={{ display: 'flex', gap: 6, padding: '12px 22px', borderBottom: '1px solid #E3EBF7' }}>
          {['digital', 'printed'].map(k => (
            <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)}
              style={{ minHeight: 36, padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: view === k ? '#001B45' : '#fff', color: view === k ? '#fff' : '#10233F', border: `1.5px solid ${view === k ? '#001B45' : '#DCE6F5'}` }}>
              {k === 'digital' ? T.tabDigital : T.tabPrinted}
            </button>
          ))}
        </div>

        <div style={{ padding: 22, background: '#EEF4FC', overflowX: 'auto' }}>
          {loading && <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>{T.loading}</div>}
          {!loading && err && <div style={{ padding: 40, textAlign: 'center', color: '#A93226' }}>{err}</div>}
          {!loading && !err && !m && <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>{T.empty}</div>}
          {!loading && !err && m && view === 'digital' && (
            <div style={{ background: '#fff', border: '1px solid #DCE6F5', maxWidth: 960, minWidth: 720, margin: '0 auto', padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 10px 30px rgba(0,27,69,.08)' }}>
              {m.asistenciaVialPendiente && (
                <div style={{ fontSize: 13, lineHeight: 1.55, padding: '10px 14px', borderRadius: 10, background: 'rgba(217,154,0,.12)', color: '#6C5220' }}>
                  {T.assistanceBanner}
                </div>
              )}
              {m.idManifiestoOrigen && (
                <div style={{ fontSize: 13, lineHeight: 1.55, padding: '10px 14px', borderRadius: 10, background: 'rgba(8,124,240,.1)', color: '#0768C9' }}>
                  {T.derivedBanner(m.idManifiestoOrigen)}
                </div>
              )}

              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                  <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    <span style={{ width: 20, height: 4, background: '#D99A00', transform: 'skewX(-24deg)' }} />
                    <span style={{ width: 8, height: 4, background: '#087CF0', transform: 'skewX(-24deg)' }} />
                  </div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '.08em', color: '#001B45' }}>TR3SLOG</div>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', margin: '4px 0 16px' }}>{T.manifestTitle}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px 20px' }}>
                    {[
                      [T.manifestLabel, m.codigo],
                      [T.statusLabel, ESTADOS[m.estado] || m.estado],
                      [T.driverLabel, (m.chofer?.nombre || driverName(m.choferId)) + (m.chofer?.telefono ? ` · ${m.chofer.telefono}` : '')],
                      [T.vehicleLabel, (m.vehiculo?.nombre || vehicleName(m.vehiculoId)) + (m.vehiculo?.placa ? ` · ${m.vehiculo.placa}` : '')],
                      [T.createdLabel, fmtDT(m.fechaCreacion)],
                      [T.startedLabel, fmtDT(m.fechaInicioRuta)],
                      [T.closedLabel, fmtDT(m.fechaCierre)],
                      [T.packagesLabel, `${(m.detalles || []).length}`],
                      [T.progressLabel, `${Math.round((m.progreso || 0) * 100)}%`],
                    ].map(([k, v], i) => (
                      <div key={i}>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{k}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#10233F', marginTop: 3 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Qr value={m.codigo} size={112} label={m.codigo} />
              </div>

              {isEditable && !editStops && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <button onClick={openStopsEdit} style={{ background: 'none', border: '1.5px solid #087CF0', borderRadius: 9, padding: '8px 16px', color: '#087CF0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{T.editStops}</button>
                </div>
              )}

              {(m.detalles || []).length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', color: '#001B45', marginBottom: 10 }}>
                    {T.routeOrder}
                  </div>
                  <div style={{ border: '1px solid #DCE6F5', borderRadius: 10, padding: '14px 18px', background: '#FBFDFF' }}>
                    {(m.detalles || []).map((d, i, arr) => {
                      const tone = TONE[DETAIL_TONE[d.estado]] || TONE.neutral
                      const last = i === arr.length - 1
                      return (
                        <div key={d.id || i} style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: tone.bg, border: `2px solid ${tone.fg}`, color: tone.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                              {d.secuenciaVisita || i + 1}
                            </div>
                            {!last && <div style={{ width: 2, flex: 1, minHeight: 16, background: '#DCE6F5', margin: '3px 0' }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 12 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5, fontWeight: 600, color: '#10233F' }}>{d.codigoSeguimiento}</span>
                              {chip(DETALLES[d.estado] || d.estado, tone)}
                            </div>
                            <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 3, lineHeight: 1.5 }}>
                              {[d.pedido?.destinatario, d.pedido?.destino || d.ubicacion].filter(Boolean).join(' · ') || '—'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div style={{ border: '1px solid #DCE6F5', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(170px, 1.4fr) 60px minmax(110px, 1fr) minmax(120px, 1fr) minmax(140px, 1.2fr)', gap: 12, alignItems: 'center', padding: '10px 14px', background: '#001B45', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  {T.detailCols.map((h, i) => <span key={i} style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{h}</span>)}
                </div>
                {(m.detalles || []).map((d, i) => (
                  <div key={d.id || i} style={{ display: 'grid', gridTemplateColumns: '36px minmax(170px, 1.4fr) 60px minmax(110px, 1fr) minmax(120px, 1fr) minmax(140px, 1.2fr)', gap: 12, alignItems: 'center', padding: '10px 14px', borderTop: '1px solid #E3EBF7', fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: '#001B45' }}>{d.secuenciaVisita || i + 1}</span>
                    <span>
                      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5, color: '#10233F' }}>{d.codigoSeguimiento}</span>
                      {d.pedido && (
                        <div style={{ fontSize: 11.5, color: '#6C82A6', marginTop: 3, lineHeight: 1.5 }}>
                          {d.pedido.destinatario || '—'}{d.pedido.destino ? ` · ${d.pedido.destino}` : ''}{d.pedido.telefono ? ` · ${d.pedido.telefono}` : ''}
                        </div>
                      )}
                    </span>
                    <span>
                      <Qr value={trackUrl(d.codigoSeguimiento)} size={44} />
                      <button type="button" onClick={() => setLabelDetail(d)}
                        style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: '#0768C9', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Etiqueta</button>
                    </span>
                    <span>{chip(DETALLES[d.estado] || d.estado, TONE[DETAIL_TONE[d.estado]] || TONE.neutral)}</span>
                    <span style={{ color: '#6C82A6', fontSize: 12 }}>{fmtDT(d.horaVisita)}</span>
                    <span style={{ fontSize: 12, color: '#6C82A6' }}>
                      {d.motivoFallo || ''}
                      {d.lat != null && d.lng != null ? `${d.motivoFallo ? ' · ' : ''}GPS ${Number(d.lat).toFixed(4)},${Number(d.lng).toFixed(4)}` : ''}
                    </span>
                  </div>
                ))}
              </div>

              {(m.solicitudes || []).length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>{T.requestsTitle}</div>
                  <div style={{ border: '1px solid #DCE6F5', borderRadius: 8, overflow: 'hidden' }}>
                    {(m.solicitudes || []).map((s, i) => (
                      <div key={s.id || i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', borderTop: i ? '1px solid #E3EBF7' : 'none', fontSize: 13, flexWrap: 'wrap' }}>
                        <span style={{ flex: 1, minWidth: 0 }}>{s.motivoIncidencia}</span>
                        <span style={{ color: '#6C82A6', fontSize: 12 }}>{(s.items || []).length} {T.pkgUnit}</span>
                        {s.estado === 'PENDIENTE' ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <select style={{ ...inputStyle, maxWidth: 200 }} value={resolveDriver[s.id] || ''} onChange={e => setResolveDriver(d => ({ ...d, [s.id]: e.target.value }))}>
                              <option value="">Chofer reemplazo…</option>
                              {(drivers || []).filter(d => String(d.user_id) !== String(m.choferId)).map(d => (
                                <option key={d.user_id} value={d.user_id}>{d.name}{d.v ? ` · ${d.v}` : ''}</option>
                              ))}
                            </select>
                            {btn(T.approveBtn, true, resolveBusy === s.id || !resolveDriver[s.id], () => resolveTransfer(s, true))}
                            {btn(T.rejectBtn, false, resolveBusy === s.id, () => resolveTransfer(s, false))}
                          </div>
                        ) : chip(SOLICITUD[s.estado] || s.estado, TONE[REQ_TONE[s.estado]] || TONE.neutral)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(m.derivados || []).length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>{T.derivedTitle}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {m.derivados.map(d => (
                      <button key={d.id} type="button" onClick={() => setSel(d.id)}
                        style={{ padding: '9px 14px', border: '1.5px solid #DCE6F5', borderRadius: 9, background: '#fff', color: '#0768C9', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'ui-monospace, Menlo, monospace' }}>
                        {d.codigo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {history.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>{T.histT}</div>
                  <div style={{ border: '1px solid #DCE6F5', borderRadius: 10, padding: '6px 18px', background: '#FBFDFF' }}>
                    {history.map((e, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderTop: i ? '1px solid #EEF2F9' : 'none' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#087CF0', marginTop: 6, flexShrink: 0 }} />
                        <span style={{ flex: 1, minWidth: 0, fontSize: 13, color: '#10233F' }}>{e.l}{e.d ? ` — ${e.d}` : ''}</span>
                        <span style={{ fontSize: 12, color: '#6C82A6', whiteSpace: 'nowrap' }}>{fmtDT(e.at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', justifyContent: 'space-between', borderTop: '1px solid #E3EBF7', paddingTop: 12, fontSize: 11.5, color: '#6C82A6' }}>
                <span>{T.qrDemo}</span>
                <span>{T.qrCopy}</span>
              </div>
            </div>
          )}
          {!loading && !err && m && view === 'printed' && (
            <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: 40, textAlign: 'center', color: '#6C82A6' }}>
              {T.print} → {m.codigo}
            </div>
          )}
        </div>
      </div>

      {labelDetail && (
        <div onClick={() => setLabelDetail(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(4,17,38,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, maxWidth: 640, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#001B45' }}>Etiqueta de envío</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button type="button" onClick={() => {
                  const el = document.getElementById('shipping-label-print')
                  if (!el) return
                  const w = window.open('', '_blank', 'width=720,height=960')
                  if (!w) return
                  w.document.write(`<html><head><title>${labelDetail.codigoSeguimiento || 'etiqueta'}</title></head><body style="margin:0">${el.outerHTML}</body></html>`)
                  w.document.close()
                  w.focus()
                  w.print()
                }} style={{ padding: '8px 16px', borderRadius: 9, border: 'none', background: '#087CF0', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Imprimir</button>
                <button onClick={() => setLabelDetail(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6C82A6', lineHeight: 1 }}>×</button>
              </div>
            </div>
            <div id="shipping-label-print"><ShippingLabel m={m} d={labelDetail} /></div>
          </div>
        </div>
      )}

      {viewStop && (() => {
        const ped = viewStop.ped || {}
        const sh = viewStop.sh || {}
        const Field = ({ l, v }) => v ? (
          <div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 3 }}>{l}</div>
          <div style={{ fontSize: 13, color: '#10233F', fontWeight: 500 }}>{v}</div></div>
        ) : null
        return (
          <div onClick={() => setViewStop(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(4,17,38,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto', padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 700, fontSize: 15, color: '#001B45' }}>{viewStop.code}</div>
                <button onClick={() => setViewStop(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6C82A6', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 18px' }}>
                <Field l={T.sfRecipient} v={ped.destinatario || sh.recipient_name} />
                <Field l={T.sfCompany} v={sh.recipient_company} />
                <Field l={T.sfStatus} v={ped.estado || sh.status} />
                <Field l={T.sfRoute} v={[ped.origen || sh.origin, ped.destino || sh.destination].filter(Boolean).join(' → ')} />
                <Field l={T.sfAddress} v={sh.recipient_address} />
                <Field l={T.sfCity} v={sh.recipient_city} />
                <Field l={T.sfCountry} v={sh.recipient_country} />
                <Field l={T.sfZip} v={sh.recipient_zip} />
                <Field l={T.sfPhone} v={ped.telefono || sh.recipient_phone} />
                <Field l={T.sfEmail} v={ped.email || sh.recipient_email} />
                <Field l={T.sfSender} v={sh.sender_name} />
                <Field l={T.sfSenderPhone} v={sh.sender_phone} />
                <Field l={T.sfService} v={sh.service_type} />
                <Field l={T.sfMode} v={sh.delivery_mode} />
                <Field l={T.sfPay} v={sh.payment_method} />
                <Field l={T.sfAmount} v={sh.amount != null ? `$${sh.amount}` : null} />
                <Field l="Notas" v={ped.notas || sh.notes} />
              </div>
            </div>
          </div>
        )
      })()}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#001B45', color: '#fff', padding: '12px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, boxShadow: '0 10px 30px rgba(0,27,69,.25)', zIndex: 50 }}>
          {toast}
        </div>
      )}
    </div>
  )
}
