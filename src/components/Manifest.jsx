import React from 'react'
import { api } from '../api'

const T = {
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
  requestsTitle: 'Solicitudes de traspaso',
  derivedTitle: 'Manifiestos derivados',
  pkgUnit: 'bultos',
  qrDemo: 'QR representa el tracking ID real registrado en el manifiesto.',
  qrCopy: 'Copia impresa válida solo para la versión indicada en el QR.',
  statsTotal: { k: 'Manifiestos', d: 'Todos los estados' },
  statsActive: { k: 'En ruta / asignados', d: 'Operación activa' },
  statsPending: { k: 'Bultos pendientes', d: 'Del manifiesto seleccionado' },
  statsIssues: { k: 'Con incidencias', d: 'Fallos o traspasos' },
}

const ESTADOS = {
  CREADO: 'Creado',
  ASIGNADO: 'Asignado',
  EN_RUTA: 'En ruta',
  EN_SOLICITUD_TRASPASO: 'Traspaso solicitado',
  COMPLETADO: 'Completado',
  COMPLETADO_CON_INCIDENCIAS: 'Completado con incidencias',
  TRANSFERIDO: 'Transferido',
}
const DETALLES = {
  PENDIENTE: 'Pendiente',
  ENTREGADO: 'Entregado',
  NO_ENTREGADO: 'No entregado',
  TRANSFERIDO: 'Transferido',
}
const SOLICITUD = { PENDIENTE: 'Pendiente', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada' }

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

function Qr({ value, size = 44, label }) {
  const path = React.useMemo(() => qrPath(value), [value])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 29 29"
        shapeRendering="crispEdges"
        role="img"
        aria-label={label || `QR ${value}`}
        style={{ display: 'block' }}
      >
        <rect width="29" height="29" fill="#fff" />
        <path fill="#001B45" d={path} />
      </svg>
      {label && (
        <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#10233F' }}>{label}</div>
      )}
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

function CreatePanel({ create, setCreate, token, shipments, setShipments, shipQuery, setShipQuery, onCreate, onCancel }) {
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
      <input style={inputStyle} placeholder={T.codeHint} value={create.code} onChange={e => setCreate(c => ({ ...c, code: e.target.value }))} />

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
        {btn(T.create, true, create.busy, onCreate)}
        {btn(T.cancel, false, false, onCancel)}
      </div>
    </div>
  )
}

export default function Manifest({ token, selectId }) {
  const [view, setView] = React.useState('digital')
  const [list, setList] = React.useState([])
  const [sel, setSel] = React.useState(null)
  const [editStops, setEditStops] = React.useState(null)
  const [editBusy, setEditBusy] = React.useState(false)
  const [editAdd, setEditAdd] = React.useState('')
  const [viewStop, setViewStop] = React.useState(null)
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
      setSel(prev => (keepSel && arr.some(r => r.id === prev)) ? prev : (arr[0] ? arr[0].id : null))
      setErr('')
    } catch (e) {
      setErr(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }, [token])

  React.useEffect(() => { if (token) load(); else setLoading(false) }, [token, load])

  React.useEffect(() => {
    if (selectId) setSel(Number(selectId))
  }, [selectId])

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
      notify('Paradas actualizadas')
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
    if (!w) { notify('Popup bloqueado'); return }
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
          <select value={sel ?? ''} onChange={e => setSel(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 260 }} aria-label={T.manifestLabel}>
            {list.map(x => <option key={x.id} value={x.id}>{x.codigo}</option>)}
            {!list.length && <option value="">—</option>}
          </select>
          {m && chip(ESTADOS[m.estado] || m.estado, TONE[MANIFEST_TONE[m.estado]] || TONE.neutral)}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {btn(T.newManifest, false, false, () => setCreate(c => ({ ...c, open: !c.open })))}
            {btn(T.assign, true, !isEditable, () => { setAssign(a => ({ ...a, open: !a.open })); loadDrivers() })}
            {m && isEditable && btn('Editar paradas', false, false, openStopsEdit)}
            {btn(T.print, false, !m, printManifest)}
          </div>
        </div>

        {create.open && (
          <CreatePanel
            create={create}
            setCreate={setCreate}
            token={token}
            shipments={shipments}
            setShipments={setShipments}
            shipQuery={shipQuery}
            setShipQuery={setShipQuery}
            onCreate={doCreate}
            onCancel={() => { setCreate({ open: false, code: '', stops: [], busy: false }); setShipQuery('') }}
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
                {(shipments || [])
                  .filter(s => !editStops.some(x => x.tracking_code === (s.tracking_number || `ENV-${s.id}`)))
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.tracking_number || `ENV-${s.id}`} · {s.destination || '—'}{s.recipient_name ? ` · ${s.recipient_name}` : ''}</option>
                  ))}
              </select>
              {btn('Agregar', false, !editAdd, () => {
                const s = (shipments || []).find(x => String(x.id) === String(editAdd))
                if (s) setEditStops(list => [...list, { shipment_id: s.id, tracking_code: s.tracking_number || `ENV-${s.id}` }])
                setEditAdd('')
              })}
              <span style={{ flex: 1 }} />
              {btn('Guardar paradas', true, editBusy || !editStops.length, saveStops)}
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
                  <button onClick={openStopsEdit} style={{ background: 'none', border: '1.5px solid #087CF0', borderRadius: 9, padding: '8px 16px', color: '#087CF0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Editar paradas</button>
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
                    <span><Qr value={d.codigoSeguimiento} size={44} /></span>
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
                      <div key={s.id || i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', borderTop: i ? '1px solid #E3EBF7' : 'none', fontSize: 13 }}>
                        <span style={{ flex: 1, minWidth: 0 }}>{s.motivoIncidencia}</span>
                        <span style={{ color: '#6C82A6', fontSize: 12 }}>{(s.items || []).length} {T.pkgUnit}</span>
                        {chip(SOLICITUD[s.estado] || s.estado, TONE[REQ_TONE[s.estado]] || TONE.neutral)}
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
                <Field l="Destinatario" v={ped.destinatario || sh.recipient_name} />
                <Field l="Empresa" v={sh.recipient_company} />
                <Field l="Estado" v={ped.estado || sh.status} />
                <Field l="Ruta" v={[ped.origen || sh.origin, ped.destino || sh.destination].filter(Boolean).join(' → ')} />
                <Field l="Dirección" v={sh.recipient_address} />
                <Field l="Ciudad" v={sh.recipient_city} />
                <Field l="País" v={sh.recipient_country} />
                <Field l="ZIP" v={sh.recipient_zip} />
                <Field l="Teléfono" v={ped.telefono || sh.recipient_phone} />
                <Field l="Correo" v={ped.email || sh.recipient_email} />
                <Field l="Remitente" v={sh.sender_name} />
                <Field l="Tel. remitente" v={sh.sender_phone} />
                <Field l="Servicio" v={sh.service_type} />
                <Field l="Modalidad" v={sh.delivery_mode} />
                <Field l="Método de pago" v={sh.payment_method} />
                <Field l="Monto" v={sh.amount != null ? `$${sh.amount}` : null} />
                <Field l="Notas" v={sh.notes} />
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
