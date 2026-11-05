import React from 'react'
import { api } from '../api'

const T = {
  title: 'Hub / almacén',
  subtitle: 'Recepción y despacho contra manifiesto: escaneo de entrada y salida por paquete, conciliación y ajustes de inventario.',
  manifestLabel: 'Manifiesto',
  loading: 'Cargando manifiestos…',
  empty: 'No hay manifiestos registrados.',
  scanTitle: 'Escanear paquete',
  codePh: 'Código de seguimiento…',
  notesPh: 'Notas (opcional)',
  phaseIn: 'Entrada',
  phaseOut: 'Salida',
  phaseMove: 'Mover',
  phaseInspect: 'Inspeccionar',
  stepAction: '1 · Acción',
  stepPackage: '2 · Paquete',
  stepConfirm: '3 · Confirmar',
  descIn: 'El paquete llega al hub',
  descOut: 'El paquete sale del hub',
  descMove: 'Cambiar de ubicación',
  descInspect: 'Revisar la mercancía',
  continueBtn: 'Continuar →',
  back: '← Volver',
  otherCode: '— Otro código (manual)…',
  backToList: '← Volver a la lista',
  locationPh: 'Ubicación (ej. A-03-2)',
  condOk: 'Íntegro',
  condDamaged: 'Dañado',
  condOpened: 'Abierto',
  scan: 'Registrar escaneo',
  receive: 'Marcar recepción',
  dispatch: 'Despachar',
  dispatched: 'Despachado',
  received: 'Recibido en hub',
  notReceived: 'Pendiente de recepción',
  blocked: 'Despacho bloqueado: hay diferencias sin ajuste aprobado.',
  awaitingReceipt: 'Manifiesto aún no recibido en el hub. Registra la recepción y escanea las entradas para conciliar.',
  ready: 'Conciliado: sin diferencias pendientes.',
  pendingAdj: 'Hay ajustes pendientes de aprobación del supervisor.',
  reconTitle: 'Conciliación',
  expected: 'Esperados',
  scannedIn: 'Entradas',
  scannedOut: 'Salidas',
  missingIn: 'Faltantes de entrada',
  unexpected: 'No esperados',
  pendingOut: 'Pendientes de salida',
  adjTitle: 'Ajustes de inventario',
  adjNew: 'Registrar ajuste',
  adjType: 'Tipo',
  adjReason: 'Motivo del ajuste…',
  adjPending: 'Pendiente',
  approve: 'Aprobar',
  reject: 'Rechazar',
  cols: ['Código', 'Fase', 'Por', 'Hora', 'Notas'],
  scansTitle: 'Escaneos registrados',
  adjCols: ['Código', 'Tipo', 'Motivo', 'Estado', 'Registrado por', 'Resuelto por', 'Acción'],
  done: 'Escaneo registrado',
  receivedOk: 'Recepción marcada.',
  dispatchOk: 'Manifiesto despachado del hub.',
  doneMsg: 'flujo completado.',
  adjOk: 'Ajuste registrado.',
  resolvedOk: 'Ajuste resuelto.',
  kpiTotal: 'Manifiestos',
  kpiReceived: 'Recibidos en hub',
  kpiDispatched: 'Despachados',
  kpiOpen: 'En conciliación',
  flowTitle: 'Flujo del manifiesto',
  steps: ['Creado', 'Recibido', 'Conciliado', 'Despachado'],
  zonesTitle: 'Zonas del almacén',
  zoneIn: 'Recepción',
  zoneStage: 'Clasificación',
  zoneOut: 'Despacho',
  locations: ['RECEPCIÓN', 'CLASIFICACIÓN', 'CUARENTENA', 'DAÑADOS', 'DESPACHO', 'A-01-1', 'A-01-2', 'A-02-1', 'A-03-2', 'B-01-4', 'B-02-1', 'C-05-3'],
  zonePkgs: 'bultos',
  activityTitle: 'Actividad reciente',
  activityEmpty: 'Sin movimientos aún.',
  progressIn: 'Avance de entrada',
  progressOut: 'Avance de salida',
  scannedBy: 'Operario',
}

const TONE = {
  neutral: { bg: '#EEF4FC', fg: '#10233F' },
  info: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  ok: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  warn: { bg: 'rgba(217,154,0,.16)', fg: '#6C5220' },
  bad: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}
const HUB_ACTIVE_STATES = ['CREADO', 'ASIGNADO', 'EN_RUTA', 'EN_SOLICITUD_TRASPASO']
const HUB_DISPATCHED_LIMIT = 20
const isHubPending = (x) => !x.hubDespachadoAt && HUB_ACTIVE_STATES.includes(x.estado)

const PKG_TYPES = { package: 'Paquete', box: 'Caja', envelope: 'Sobre', pallet: 'Pallet', other: 'Otro' }
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const PlacesInput = ({ value, onChange, placeholder, style }) => {
  const ref = React.useRef(null)
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  React.useEffect(() => {
    if (!GOOGLE_MAPS_KEY) { setFailed(true); return }
    if (window.google?.maps?.places) { setReady(true); return }
    const id = 'gmp-places-js'
    let s = document.getElementById(id)
    const onLoad = () => setReady(true)
    if (!s) {
      s = document.createElement('script')
      s.id = id
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&libraries=places&v=weekly`
      s.async = true
      document.head.appendChild(s)
    }
    s.addEventListener('load', onLoad)
    if (window.google?.maps?.places) setReady(true)
    return () => s?.removeEventListener?.('load', onLoad)
  }, [])
  React.useEffect(() => {
    if (!ready || !ref.current) return
    const AC = window.google?.maps?.places?.PlaceAutocompleteElement
    if (!AC) { setFailed(true); return }
    let active = true
    let widget = null
    try { widget = new AC() } catch { /* noop */ }
    if (!widget) widget = document.createElement('gmp-place-autocomplete')
    try { widget.includedRegionCodes = ['do', 'cr'] } catch { /* opcional */ }
    widget.setAttribute('aria-label', placeholder || 'Dirección')
    widget.style.width = '100%'
    const onSelect = async ({ placePrediction }) => {
      try {
        const place = placePrediction.toPlace()
        await place.fetchFields({ fields: ['formattedAddress'] })
        if (active && place.formattedAddress) onChange(place.formattedAddress)
      } catch { if (active) setFailed(true) }
    }
    const onErr = () => { if (active) setFailed(true) }
    widget.addEventListener('gmp-select', onSelect)
    widget.addEventListener('gmp-error', onErr)
    ref.current.appendChild(widget)
    return () => { active = false; try { ref.current?.removeChild(widget) } catch { /* noop */ } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])
  if (failed) return <input style={style} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
  if (!ready) return <input style={style} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
  return <div ref={ref} style={{ ...style, padding: 0 }} />
}

const pkgDims = (pkg) => {
  let d = [pkg.length_cm, pkg.width_cm, pkg.height_cm].map(Number)
  if (!d.every(v => v > 0) && pkg.dimensions) {
    const mm = String(pkg.dimensions).match(/([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)/i)
    if (mm) d = [+mm[1], +mm[2], +mm[3]]
  }
  return d
}
const pkgVol = (pkg) => {
  const [l, w, h] = pkgDims(pkg)
  if (pkg.volume_m3) return `${Number(pkg.volume_m3).toFixed(4)} m³`
  if (l > 0 && w > 0 && h > 0) {
    const cm3 = l * w * h
    return `${cm3.toLocaleString('es')} cm³ (${(cm3 / 1e6).toFixed(4)} m³)`
  }
  return null
}
const pkgLine = (pkg, i) => {
  const dims = pkgDims(pkg)
  const dimStr = dims.every(v => v > 0) ? `${dims[0]}×${dims[1]}×${dims[2]} cm` : null
  const parts = [
    `Bulto ${i + 1}: ${PKG_TYPES[pkg.type] || pkg.type || '—'}`,
    pkg.pieces > 1 ? `${pkg.pieces} pzas` : null,
    dimStr,
    pkgVol(pkg),
    pkg.weight ? `${pkg.weight} ${pkg.weight_unit || 'kg'}` : null,
  ].filter(Boolean)
  return parts.join(' · ')
}

const PkgInfo = ({ det }) => {
  if (!det) return null
  const p = det.pedido || {}
  const pkgs = Array.isArray(p.paquetes) ? p.paquetes : []
  const dims = pkgs[0] ? pkgDims(pkgs[0]) : []
  const dimStr = dims.length === 3 && dims.every(v => v > 0) ? `${dims[0]}×${dims[1]}×${dims[2]} cm` : null
  const stat = (label, value) => (
    <div style={{ flex: '1 1 110px', background: '#F6F9FD', borderRadius: 10, padding: '9px 12px', minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6C82A6' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#001B45', marginTop: 3, fontFamily: 'Montserrat, sans-serif' }}>{value || '—'}</div>
    </div>
  )
  return (
    <div style={{ borderRadius: 12, border: '1px solid #DCE6F5', overflow: 'hidden' }}>
      <div style={{ padding: '8px 14px', background: '#001B45', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <span>Datos del paquete</span>
        <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{det.codigoSeguimiento}</span>
      </div>
      <div style={{ padding: '13px 16px', background: '#fff' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#001B45', fontFamily: 'Montserrat, sans-serif' }}>{p.destinatario || '—'}</div>
        <div style={{ fontSize: 12.5, color: '#6C82A6', marginTop: 3 }}>
          {[p.origen, p.destino].filter(Boolean).join(' → ') || '—'}{p.telefono ? ` · ${p.telefono}` : ''}
        </div>
        {p.direccion && <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>{p.direccion}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {stat('Peso declarado', p.peso ? `${p.peso} kg` : null)}
          {stat('Piezas', p.piezas)}
          {stat('Tipo', pkgs[0] ? (PKG_TYPES[pkgs[0].type] || pkgs[0].type) : null)}
          {stat('Dimensiones', dimStr)}
          {stat('Volumen', pkgs[0] ? pkgVol(pkgs[0]) : null)}
          {stat('Monto', p.monto ? `$${p.monto}` : null)}
        </div>
        {pkgs.length > 1 && pkgs.slice(1).map((pkg, i) => (
          <div key={i} style={{ marginTop: 6, fontSize: 12, color: '#5B7BA6', fontWeight: 600 }}>{pkgLine(pkg, i + 1)}</div>
        ))}
        {pkgs[0]?.content && <div style={{ marginTop: 10, fontSize: 12, color: '#10233F' }}><span style={{ color: '#6C82A6', fontWeight: 600 }}>Contenido: </span>{pkgs[0].content}</div>}
        {p.notas && <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: '#FFF4D6', color: '#8A6100', fontSize: 12, fontWeight: 600 }}>Nota: {p.notas}</div>}
      </div>
    </div>
  )
}

const ESTADOS = {
  CREADO: 'Creado', ASIGNADO: 'Asignado', EN_RUTA: 'En ruta',
  EN_SOLICITUD_TRASPASO: 'Traspaso solicitado', COMPLETADO: 'Completado',
  COMPLETADO_CON_INCIDENCIAS: 'Con incidencias', TRANSFERIDO: 'Transferido',
}
const ADJ_TONE = { PENDIENTE: 'warn', APROBADO: 'ok', RECHAZADO: 'bad' }

const fmtDT = iso =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '—'

const chip = (label, tone) => (
  <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: tone.bg, color: tone.fg }}>
    {label}
  </span>
)

const btn = (label, primary, off, run) => (
  <button type="button" aria-disabled={off} onClick={run}
    style={{ minHeight: 40, padding: '10px 16px', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: off ? 'not-allowed' : 'pointer', background: primary ? '#087CF0' : '#fff', color: primary ? '#fff' : '#001B45', border: `1.5px solid ${primary ? '#087CF0' : '#DCE6F5'}`, opacity: off ? 0.45 : 1, font: 'inherit' }}>
    {label}
  </button>
)

const inputStyle = { padding: '10px 12px', borderRadius: 9, border: '1.5px solid #DCE6F5', font: 'inherit', fontSize: 13, background: '#fff', color: '#10233F', minWidth: 0 }

const cell = { padding: '10px 12px', borderTop: '1px solid #E3EBF7', fontSize: 13, color: '#10233F' }

const tagList = (items, tone) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {items.length ? items.map(c => chip(c, tone)) : <span style={{ fontSize: 12, color: '#8B9DBA' }}>—</span>}
  </div>
)

const Kpi = ({ label, value, tone, icon }) => (
  <div style={{ flex: '1 1 160px', background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
    <span style={{ width: 44, height: 44, borderRadius: 12, background: tone.bg, color: tone.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{icon}</span>
    <div>
      <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 24, color: '#001B45', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6C82A6', marginTop: 2 }}>{label}</div>
    </div>
  </div>
)

const Stepper = ({ steps, current }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
    {steps.map((label, i) => {
      const done = i < current
      const active = i === current
      return (
        <React.Fragment key={label}>
          {i > 0 && <div style={{ flex: 1, height: 3, minWidth: 18, borderRadius: 2, background: done || active ? '#087CF0' : '#DCE6F5' }} />}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
            <span style={{
              width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              background: done ? '#087CF0' : active ? '#fff' : '#fff',
              color: done ? '#fff' : active ? '#087CF0' : '#8B9DBA',
              border: `2px solid ${done || active ? '#087CF0' : '#DCE6F5'}`,
              boxShadow: active ? '0 0 0 4px rgba(8,124,240,.15)' : 'none',
            }}>
              {done ? '✓' : i + 1}
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: done || active ? '#0768C9' : '#8B9DBA' }}>{label}</span>
          </div>
        </React.Fragment>
      )
    })}
  </div>
)

const ProgressBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0
  return (
    <div style={{ flex: '1 1 220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
        <span style={{ fontWeight: 600, color: '#10233F' }}>{label}</span>
        <span style={{ color: '#6C82A6' }}>{value}/{total} · {pct}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 100, background: '#E3EBF7', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 100, background: color, transition: 'width .35s ease' }} />
      </div>
    </div>
  )
}

const Donut = ({ pct, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 108, height: 108, borderRadius: '50%', background: `conic-gradient(#087CF0 ${pct * 3.6}deg, #E3EBF7 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 78, height: 78, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45' }}>
        {pct}%
      </div>
    </div>
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6C82A6', textAlign: 'center' }}>{label}</span>
  </div>
)

const Zone = ({ name, count, tone, icon }) => (
  <div style={{ flex: 1, minWidth: 150, border: `1.5px ${count ? 'solid' : 'dashed'} ${tone.fg}`, borderRadius: 12, padding: '14px 16px', background: tone.bg, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: tone.fg }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>{name}</span>
    </div>
    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 26, color: '#001B45' }}>
      {count} <span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{T.zonePkgs}</span>
    </div>
  </div>
)

export default function Hub({ token, canManage = true, canResolve = true, userId = null }) {
  const [list, setList] = React.useState([])
  const [sel, setSel] = React.useState(null)
  const [detail, setDetail] = React.useState(null) // { manifest, conciliacion, escaneos }
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState('')
  const [toast, setToast] = React.useState('')
  const [scan, setScan] = React.useState({ code: '', phase: 'in', notes: '', location: '', condition: 'ok', diffs: [{ campo: '', real: '' }], step: 1, busy: false, manualCode: false })
  const [adj, setAdj] = React.useState({ open: false, codigo: '', type: 'FALTANTE', reason: '', expected: '', actual: '', busy: false })
  const [hview, setHview] = React.useState('entrada')
  const [showExpected, setShowExpected] = React.useState(false)
  const toastRef = React.useRef(null)

  const notify = (m) => {
    setToast(m)
    clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(''), 4500)
  }
  React.useEffect(() => () => clearTimeout(toastRef.current), [])

  const loadList = React.useCallback(async (keepSel = true) => {
    try {
      const rows = await api.getHubManifests(token)
      const arr = Array.isArray(rows) ? rows : []
      setList(arr)
      const firstPending = arr.find(isHubPending) || arr[0]
      setSel(prev => (keepSel && arr.some(r => r.id === prev)) ? prev : (firstPending ? firstPending.id : null))
      setErr('')
    } catch (e) {
      setErr(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }, [token])

  const loadDetail = React.useCallback(async (id) => {
    if (!id) { setDetail(null); return }
    try {
      setDetail(await api.getHubManifest(id, token))
    } catch (e) {
      notify(e.message)
      setDetail(null)
    }
  }, [token])

  React.useEffect(() => { if (token) loadList(); else setLoading(false) }, [token, loadList])
  React.useEffect(() => { loadDetail(sel) }, [sel, loadDetail])

  const [scope, setScope] = React.useState('pending')
  const pendingList = list.filter(isHubPending)
  const toReceive = pendingList.filter(x => !x.hubRecibidoAt)
  const inHub = pendingList.filter(x => x.hubRecibidoAt)
  const dispatchedList = list
    .filter(x => x.hubDespachadoAt)
    .sort((a, b) => new Date(b.hubDespachadoAt) - new Date(a.hubDespachadoAt))
    .slice(0, HUB_DISPATCHED_LIMIT)

  const changeScope = (next) => {
    setScope(next)
    const pool = next === 'pending' ? pendingList : dispatchedList
    if (!pool.some(x => x.id === sel)) setSel(pool[0] ? pool[0].id : null)
  }

  const hubOptionLabel = (x) => [
    x.codigo,
    x.chofer?.nombre,
    `${(x.detalles || []).length} bultos`,
  ].filter(Boolean).join(' · ')

  const m = detail?.manifest || null
  const rec = detail?.conciliacion || null
  const scans = detail?.escaneos || []

  const estadoPorCodigo = Object.fromEntries((m?.detalles || []).map(d => [d.codigoSeguimiento, d.estado]))
  const scanSuggestions = (() => {
    if (!rec) return []
    const esperados = rec.esperados || []
    const entradas = rec.entradas || []
    const salidas = rec.salidas || []
    if (scan.phase === 'in') return esperados.filter(c => !entradas.includes(c))
    if (scan.phase === 'out') return entradas.filter(c => esperados.includes(c) && !salidas.includes(c))
    return esperados.filter(c => !entradas.includes(c))
    return entradas.filter(c => esperados.includes(c))
  })()

  // Fase automática del escaneo: recepción mientras falten entradas; luego despacho.
  React.useEffect(() => {
    const pendingIn = (rec?.faltantesEntrada || []).length > 0
    setScan(s => (s.phase === 'inspect' || s.phase === 'move') ? s : { ...s, phase: pendingIn ? 'in' : 'out' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m?.id, (rec?.faltantesEntrada || []).length])

  React.useEffect(() => { setHview('entrada') }, [m?.id])

  const doScan = async () => {
    if (!scan.code.trim()) return
    setScan(s => ({ ...s, busy: true }))
    try {
      await api.scanHubManifest(m.id, {
        codigo: scan.code.trim(),
        phase: scan.phase,
        notes: scan.notes || undefined,
        location: scan.location.trim() || undefined,
        condition: scan.condition !== 'ok' ? scan.condition : (scan.phase === 'inspect' ? scan.condition : undefined),
      }, token)
      const diffRows = (scan.diffs || []).filter(x => x.campo)
      if (diffRows.length) {
        const det = (m?.detalles || []).find(d => d.codigoSeguimiento === scan.code.trim())
        const p = det?.pedido || {}
        for (const dv of diffRows) {
          const declared = { peso: p.peso, piezas: p.piezas, destinatario: p.destinatario, direccion: p.destino, otro: '' }[dv.campo]
          await api.createHubAdjustment(m.id, {
            codigo: scan.code.trim(), type: 'OTRO',
            reason: `Diferencia en ${dv.campo}${dv.real.trim() ? `: ${dv.real.trim()}` : ''}`,
            expected_value: declared ? String(declared) : undefined,
            actual_value: dv.real.trim() || undefined,
          }, token)
        }
      }
      notify(T.done)
      setScan({ code: '', phase: (rec?.faltantesEntrada || []).length ? 'in' : 'out', notes: '', location: '', condition: 'ok', diffs: [{ campo: '', real: '' }], step: 1, busy: false, manualCode: false })
      await loadDetail(m.id)
    } catch (e) { notify(e.message); setScan(s => ({ ...s, busy: false })) }
  }

  const doReceive = async () => {
    try { await api.receiveHubManifest(m.id, token); notify(T.receivedOk); await loadDetail(m.id) }
    catch (e) { notify(e.message) }
  }

  const doDispatch = async () => {
    try { await api.dispatchHubManifest(m.id, token); notify(T.dispatchOk); await loadDetail(m.id) }
    catch (e) { notify(e.message) }
  }

  const doAdj = async () => {
    if (!adj.codigo.trim() || !adj.reason.trim()) return
    setAdj(a => ({ ...a, busy: true }))
    try {
      await api.createHubAdjustment(m.id, { codigo: adj.codigo.trim(), type: adj.type, reason: adj.reason.trim(), expected_value: adj.expected.trim() || undefined, actual_value: adj.actual.trim() || undefined }, token)
      notify(T.adjOk)
      setAdj({ open: false, codigo: '', type: 'FALTANTE', reason: '', busy: false })
      await loadDetail(m.id)
    } catch (e) { notify(e.message); setAdj(a => ({ ...a, busy: false })) }
  }

  const resolveAdj = async (id, approve) => {
    try {
      await api.resolveHubAdjustment(id, { approve }, token)
      notify(T.resolvedOk)
      await loadDetail(m.id)
    } catch (e) { notify(e.message) }
  }

  return (
    <div style={{ maxWidth: 1220, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          <span style={{ width: 24, height: 5, background: '#D99A00', transform: 'skewX(-24deg)' }} />
          <span style={{ width: 9, height: 5, background: '#087CF0', transform: 'skewX(-24deg)' }} />
        </div>
        <h1 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: '0 0 8px', color: '#001B45' }}>
          {T.title}
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch', lineHeight: 1.6 }}>{T.subtitle}</p>
      </div>

      {/* KPIs del hub */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        <Kpi label={T.kpiTotal} value={list.length} tone={TONE.neutral} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8l8-4 8 4v8l-8 4-8-4V8z"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>} />
        <Kpi label={T.kpiReceived} value={list.filter(x => x.hubRecibidoAt).length} tone={TONE.info} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>} />
        <Kpi label={T.kpiOpen} value={list.filter(x => x.hubRecibidoAt && !x.hubDespachadoAt).length} tone={TONE.warn} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>} />
        <Kpi label={T.kpiDispatched} value={list.filter(x => x.hubDespachadoAt).length} tone={TONE.ok} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h13m0 0l-4-4m4 4l-4 4M17 5h4v14h-4"/></svg>} />
      </div>

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {T.manifestLabel}
          </div>
          <div role="tablist" style={{ display: 'inline-flex', border: '1.5px solid #DCE6F5', borderRadius: 100, overflow: 'hidden' }}>
            {[['pending', `Pendientes (${pendingList.length})`], ['dispatched', 'Despachados']].map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={scope === k} onClick={() => changeScope(k)}
                style={{ padding: '7px 14px', border: 'none', background: scope === k ? '#001B45' : '#fff', color: scope === k ? '#fff' : '#10233F', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
          <select value={sel ?? ''} onChange={e => setSel(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 340 }} aria-label={T.manifestLabel}>
            {scope === 'pending' ? (
              <>
                {!!toReceive.length && (
                  <optgroup label={`Por recibir (${toReceive.length})`}>
                    {toReceive.map(x => <option key={x.id} value={x.id}>{hubOptionLabel(x)}</option>)}
                  </optgroup>
                )}
                {!!inHub.length && (
                  <optgroup label={`En hub · por despachar (${inHub.length})`}>
                    {inHub.map(x => <option key={x.id} value={x.id}>{hubOptionLabel(x)}</option>)}
                  </optgroup>
                )}
              </>
            ) : dispatchedList.map(x => <option key={x.id} value={x.id}>{hubOptionLabel(x)} · {fmtDT(x.hubDespachadoAt)}</option>)}
            {(scope === 'pending' ? pendingList : dispatchedList).length === 0 && (
              <option value="">{scope === 'pending' ? 'No hay manifiestos pendientes' : 'No hay manifiestos despachados'}</option>
            )}
          </select>
          {scope === 'dispatched' && <span style={{ fontSize: 11.5, color: '#6C82A6' }}>Últimos {HUB_DISPATCHED_LIMIT}</span>}
          {m && chip(ESTADOS[m.estado] || m.estado, TONE.info)}
          {rec && (rec.despachadoAt
            ? chip(`${T.dispatched} · ${fmtDT(rec.despachadoAt)}`, TONE.ok)
            : rec.recibidoAt
              ? chip(`${T.received} · ${fmtDT(rec.recibidoAt)}`, TONE.info)
              : chip(T.notReceived, TONE.neutral))}
          {canManage && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {btn(T.receive, false, !m || !rec || !!rec.recibidoAt, doReceive)}
              {btn(T.dispatch, true, !m || !rec || !rec.recibidoAt || !!rec.despachadoAt || rec.bloqueado, doDispatch)}
            </div>
          )}
        </div>

        <div style={{ padding: 22, background: '#EEF4FC', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading && <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>{T.loading}</div>}
          {!loading && err && <div style={{ padding: 40, textAlign: 'center', color: '#A93226' }}>{err}</div>}
          {!loading && !err && !m && <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>{T.empty}</div>}

          {!loading && !err && m && rec && (
            <>
              {/* Banner de conciliación */}
              {rec.despachadoAt ? (
                <div style={{ fontSize: 13, lineHeight: 1.55, padding: '12px 16px', borderRadius: 10, background: '#ECEFF4', color: '#5B6B82', border: '1px solid #D5DCE6' }}>
                  {T.dispatched} · {fmtDT(rec.despachadoAt)} — {T.doneMsg}
                </div>
              ) : !rec.recibidoAt ? (
                <div style={{ fontSize: 13, lineHeight: 1.55, padding: '12px 16px', borderRadius: 10, background: 'rgba(8,124,240,.07)', color: '#0768C9', border: '1px solid rgba(8,124,240,.3)' }}>
                  {T.awaitingReceipt}
                </div>
              ) : (
                <div style={{ fontSize: 13, lineHeight: 1.55, padding: '12px 16px', borderRadius: 10, background: rec.bloqueado ? 'rgba(192,57,43,.08)' : 'rgba(19,122,69,.08)', color: rec.bloqueado ? '#A93226' : '#0F5F36', border: `1px solid ${rec.bloqueado ? 'rgba(192,57,43,.3)' : 'rgba(19,122,69,.3)'}` }}>
                  {rec.bloqueado ? T.blocked : T.ready}
                  {rec.bloqueado && rec.ajustes?.some(a => a.estado === 'PENDIENTE') ? ' ' + T.pendingAdj : ''}
                </div>
              )}

              {/* Info del manifiesto */}
              {m && (
                <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 22px', fontSize: 13 }}>
                    <span><span style={{ color: '#6C82A6' }}>Manifiesto: </span><b style={{ fontFamily: 'ui-monospace, Menlo, monospace', color: '#001B45' }}>{m.codigo}</b></span>
                    <span><span style={{ color: '#6C82A6' }}>Estado: </span><b>{ESTADOS[m.estado] || m.estado}</b></span>
                    {m.chofer?.nombre && <span><span style={{ color: '#6C82A6' }}>Chofer: </span><b>{m.chofer.nombre}{m.chofer.telefono ? ` · ${m.chofer.telefono}` : ''}</b></span>}
                    {(m.vehiculo?.nombre || m.vehiculo?.placa) && <span><span style={{ color: '#6C82A6' }}>Vehículo: </span><b>{[m.vehiculo.nombre, m.vehiculo.placa].filter(Boolean).join(' · ')}</b></span>}
                    <span><span style={{ color: '#6C82A6' }}>Bultos: </span><b>{(m.detalles || []).length}</b></span>
                    <span><span style={{ color: '#6C82A6' }}>Progreso: </span><b>{Math.round((m.progreso || 0) * 100)}%</b></span>
                  </div>
                </div>
              )}

              {/* Módulos del flujo */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['entrada', '1 · Recibir — escanear entradas'], ['conciliacion', '2 · Revisar — cuadrar y ajustes'], ['despacho', '3 · Despachar — escanear salidas']].map(([k, l]) => (
                  <button key={k} type="button" onClick={() => setHview(k)}
                    style={{ padding: '7px 16px', borderRadius: 100, border: `1.5px solid ${hview === k ? '#001B45' : '#DCE6F5'}`, background: hview === k ? '#001B45' : '#fff', color: hview === k ? '#fff' : '#10233F', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
                ))}
              </div>

              {hview === 'entrada' && canManage && rec && !rec.recibidoAt && (
                <div style={{ background: '#FFF4D6', border: '1px solid #F0D48A', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#8A6100', flex: 1 }}>¿Llegó el camión? Registra la recepción para pasar el manifiesto a «En hub».</span>
                  {btn('Marcar recepción', true, false, doReceive)}
                </div>
              )}

              {hview === 'entrada' && rec && !rec.despachadoAt && rec.recibidoAt && !(rec.faltantesEntrada || []).length && (rec.esperados || []).length > 0 && (
                <div style={{ background: 'rgba(19,122,69,.1)', border: '1px solid rgba(19,122,69,.35)', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0F5F36', flex: 1 }}>Todas las entradas escaneadas — el manifiesto está listo para cuadrar y despachar.</span>
                  <button type="button" onClick={() => setHview('conciliacion')} style={{ padding: '8px 16px', borderRadius: 10, border: '1.5px solid #0F5F36', background: '#fff', color: '#0F5F36', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Ir a Revisar →</button>
                  <button type="button" onClick={() => setHview('despacho')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#0F5F36', color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Ir a Despachar →</button>
                </div>
              )}

              {/* Paquetes del manifiesto */}
              {m && hview === 'entrada' && !!(m.detalles || []).length && (
                <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: '#001B45', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>Lo esperado · {(m.detalles || []).length} bulto{(m.detalles || []).length === 1 ? '' : 's'}</span>
                    <button type="button" onClick={() => setShowExpected(v => !v)}
                      style={{ marginLeft: 'auto', padding: '3px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,.35)', background: 'transparent', color: '#fff', fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', cursor: 'pointer' }}>
                      {showExpected ? 'OCULTAR ▲' : 'VER DETALLE ▼'}
                    </button>
                  </div>
                  {showExpected && (m.detalles || []).map((d, i) => (
                    <div key={d.id || i} style={{ padding: '10px 16px', borderTop: i ? '1px solid #F0F5FB' : 'none', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#001B45', fontSize: 12, minWidth: 20 }}>{d.secuenciaVisita || i + 1}</span>
                      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5, color: '#10233F' }}>{d.codigoSeguimiento}</span>
                      {chip(d.estado, TONE.neutral)}
                      {!d.pedido && <span style={{ fontSize: 11.5, color: '#A93226', fontWeight: 600 }}>Sin datos del pedido</span>}
                      <div style={{ flex: '1 1 100%', marginTop: 2 }}><PkgInfo det={d} /></div>
                      {canManage && !rec.despachadoAt && (
                        <span style={{ display: 'inline-flex', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
                          <button type="button" title="Inspeccionar: marcar condición (OK, dañado, defectuoso…)"
                            onClick={() => setScan(s => ({ ...s, phase: 'inspect', code: d.codigoSeguimiento, step: 1 }))}
                            style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600, borderRadius: 8, border: '1px solid #B7C8E4', background: '#EEF4FC', color: '#001B45', cursor: 'pointer' }}>
                            Condición
                          </button>
                          <button type="button" title="Registrar diferencia (faltante, sobrante, avería…)"
                            onClick={() => setAdj(a => ({ ...a, open: true, codigo: d.codigoSeguimiento }))}
                            style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600, borderRadius: 8, border: '1px solid #F0D48A', background: '#FFF4D6', color: '#8A6100', cursor: 'pointer' }}>
                            Diferencia
                          </button>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Stepper del flujo */}
              {hview === 'entrada' && (
              <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45', marginBottom: 14 }}>{T.flowTitle}</div>
                <Stepper steps={T.steps} current={rec.despachadoAt ? 4 : rec.recibidoAt ? (rec.bloqueado ? 2 : 3) : 1} />
              </div>

              )}

              {/* Escaneo guiado por pasos */}
              {hview !== 'conciliacion' && !rec.despachadoAt && canManage && (
                <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45', marginBottom: 14 }}>Paso 2 · {T.scanTitle} — entradas primero, salidas al final</div>

                  {/* Indicador de pasos */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {[T.stepPackage, T.stepConfirm].map((label, i) => {
                      const active = scan.step - 1 === i
                      const done = scan.step - 1 > i
                      return (
                        <span key={i} style={{
                          padding: '5px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 600,
                          background: active ? '#001B45' : done ? 'rgba(19,122,69,.12)' : '#EEF4FC',
                          color: active ? '#fff' : done ? '#0F5F36' : '#6C82A6',
                        }}>{label}</span>
                      )
                    })}
                  </div>

                  {/* Paso 1 — paquete */}
                  {scan.step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {chip({ in: T.phaseIn, out: T.phaseOut, move: T.phaseMove, inspect: T.phaseInspect }[scan.phase], { in: TONE.info, out: TONE.ok, move: TONE.warn, inspect: TONE.neutral }[scan.phase])}
                        <span style={{ fontSize: 11.5, color: '#6C82A6' }}>
                          {scan.phase === 'in' ? 'Escanea cada bulto que entra' : scan.phase === 'out' ? 'Escanea cada bulto que sale' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {!scan.manualCode ? (
                          <select style={{ ...inputStyle, flex: '1 1 260px', cursor: 'pointer' }} value={scan.code} autoFocus
                            onChange={e => {
                              if (e.target.value === '__manual__') setScan(s => ({ ...s, manualCode: true, code: '' }))
                              else setScan(s => ({ ...s, code: e.target.value }))
                            }}>
                            <option value="">{T.codePh}</option>
                            {scanSuggestions.map(c => (
                              <option key={c} value={c}>{c}{estadoPorCodigo[c] ? ` · ${estadoPorCodigo[c]}` : ''}</option>
                            ))}
                            <option value="__manual__">{T.otherCode}</option>
                          </select>
                        ) : (
                          <>
                            <input style={{ ...inputStyle, flex: '1 1 240px' }} placeholder={T.codePh} value={scan.code}
                              autoFocus
                              onChange={e => setScan(s => ({ ...s, code: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter' && scan.code.trim()) setScan(s => ({ ...s, step: 2 })) }} />
                            <button type="button" onClick={() => setScan(s => ({ ...s, manualCode: false, code: '' }))}
                              style={{ background: 'none', border: 'none', fontSize: 12, color: '#087CF0', cursor: 'pointer', fontWeight: 600 }}>{T.backToList}</button>
                          </>
                        )}
                        {btn(T.continueBtn, true, !scan.code.trim(), () => setScan(s => ({ ...s, step: 2 })))}
                      </div>
                      <PkgInfo det={(m?.detalles || []).find(d => d.codigoSeguimiento === scan.code)} />
                    </div>
                  )}

                  {/* Paso 3 — detalles + confirmar */}
                  {scan.step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {chip({ in: T.phaseIn, out: T.phaseOut, move: T.phaseMove, inspect: T.phaseInspect }[scan.phase], { in: TONE.info, out: TONE.ok, move: TONE.warn, inspect: TONE.neutral }[scan.phase])}
                        <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, fontWeight: 700, color: '#001B45' }}>{scan.code}</span>
                        <button type="button" onClick={() => setScan(s => ({ ...s, step: 1 }))}
                          style={{ background: 'none', border: 'none', fontSize: 12, color: '#087CF0', cursor: 'pointer', fontWeight: 600 }}>{T.back}</button>
                      </div>
                      <PkgInfo det={(m?.detalles || []).find(d => d.codigoSeguimiento === scan.code)} />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {(scan.phase === 'move' || scan.phase === 'in') && (
                          <>
                            <input style={{ ...inputStyle, flex: '0 1 200px' }} placeholder={scan.phase === 'in' ? 'Ubicación en rack (opcional)…' : T.locationPh} value={scan.location}
                              list="hub-locations" autoFocus
                              onChange={e => setScan(s => ({ ...s, location: e.target.value }))} />
                            <datalist id="hub-locations">
                              {T.locations.map(l => <option key={l} value={l} />)}
                            </datalist>
                          </>
                        )}
                        {scan.phase === 'inspect' && (
                          <select style={{ ...inputStyle, flex: '0 1 160px', cursor: 'pointer' }} value={scan.condition}
                            onChange={e => setScan(s => ({ ...s, condition: e.target.value }))}>
                            <option value="ok">{T.condOk}</option>
                            <option value="damaged">{T.condDamaged}</option>
                            <option value="opened">{T.condOpened}</option>
                          </select>
                        )}
                        <input style={{ ...inputStyle, flex: '1 1 200px' }} placeholder={T.notesPh} value={scan.notes}
                          onChange={e => setScan(s => ({ ...s, notes: e.target.value }))} />
                      </div>
                      {/* Estado del bulto + diferencia contra lo declarado */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '10px 12px', background: '#F6F9FD', borderRadius: 10 }}>
                        <select style={{ ...inputStyle, flex: '0 1 160px', cursor: 'pointer' }} value={scan.condition}
                          onChange={e => setScan(s => ({ ...s, condition: e.target.value }))}>
                          <option value="ok">Conforme</option>
                          <option value="damaged">Dañado</option>
                          <option value="opened">Abierto</option>
                        </select>
                        <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(scan.diffs || []).map((dv, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                              <select style={{ ...inputStyle, flex: '0 1 200px', cursor: 'pointer' }} value={dv.campo}
                                onChange={e => setScan(s => ({ ...s, diffs: s.diffs.map((x, j) => j === i ? { ...x, campo: e.target.value } : x) }))}>
                                <option value="">Sin diferencia</option>
                                <option value="peso">Peso distinto</option>
                                <option value="piezas">Piezas distintas</option>
                                <option value="destinatario">Destinatario distinto</option>
                                <option value="direccion">Dirección distinta</option>
                                <option value="otro">Otra diferencia</option>
                              </select>
                              {dv.campo && (
                                <>
                                  {dv.campo === 'direccion' ? (
                                    <PlacesInput style={{ ...inputStyle, flex: '1 1 280px' }} placeholder="Dirección real (busca en el mapa)…" value={dv.real}
                                      onChange={v => setScan(s => ({ ...s, diffs: s.diffs.map((x, j) => j === i ? { ...x, real: v } : x) }))} />
                                  ) : (
                                    <input type={dv.campo === 'peso' || dv.campo === 'piezas' ? 'number' : 'text'} step="any" min="0"
                                      style={{ ...inputStyle, flex: dv.campo === 'peso' || dv.campo === 'piezas' ? '0 1 110px' : '1 1 220px' }} placeholder="Valor real observado…" value={dv.real}
                                      onChange={e => setScan(s => ({ ...s, diffs: s.diffs.map((x, j) => j === i ? { ...x, real: e.target.value } : x) }))} />
                                  )}
                                  {(() => {
                                    const pp = ((m?.detalles || []).find(d => d.codigoSeguimiento === scan.code)?.pedido) || {}
                                    const dec = { peso: pp.peso ? `${pp.peso} kg` : null, piezas: pp.piezas, destinatario: pp.destinatario, direccion: pp.destino }[dv.campo]
                                    return dec ? <span style={{ fontSize: 11, color: '#6C82A6', fontWeight: 600 }}>declarado: {dec}</span> : null
                                  })()}
                                </>
                              )}
                              {scan.diffs.length > 1 && (
                                <button type="button" onClick={() => setScan(s => ({ ...s, diffs: s.diffs.filter((_, j) => j !== i) }))}
                                  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #DCE6F5', background: '#fff', color: '#A93226', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                              )}
                            </div>
                          ))}
                          <button type="button" onClick={() => setScan(s => ({ ...s, diffs: [...(s.diffs || []), { campo: '', real: '' }] }))}
                            style={{ alignSelf: 'flex-start', background: 'none', border: 'none', fontSize: 12, color: '#087CF0', cursor: 'pointer', fontWeight: 700 }}>+ Agregar otra diferencia</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {btn(T.scan, true, scan.busy || (scan.phase === 'move' && !scan.location.trim()) || (scan.diffs || []).some(dv => dv.campo && !dv.real.trim()), doScan)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conciliación */}
              {hview === 'conciliacion' && (
              <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45' }}>Paso 3 · {T.reconTitle}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', padding: '10px 14px', background: '#F6F9FD', borderRadius: 10 }}>
                  <Donut pct={(rec.esperados?.length ?? 0) > 0 ? Math.round(((rec.salidas?.length ?? 0) / rec.esperados.length) * 100) : 0} label={T.progressOut} />
                  <ProgressBar label={T.progressIn} value={rec.entradas?.length ?? 0} total={rec.esperados?.length ?? 0} color="#087CF0" />
                  <ProgressBar label={T.progressOut} value={rec.salidas?.length ?? 0} total={rec.esperados?.length ?? 0} color="#0F5F36" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{T.expected} · {rec.esperados?.length ?? 0}</div>
                    {tagList(rec.esperados || [], TONE.neutral)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{T.scannedIn} · {rec.entradas?.length ?? 0}</div>
                    {tagList(rec.entradas || [], TONE.info)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{T.scannedOut} · {rec.salidas?.length ?? 0}</div>
                    {tagList(rec.salidas || [], TONE.ok)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#A93226', marginBottom: 8 }}>{T.missingIn} · {rec.faltantesEntrada?.length ?? 0}</div>
                    {tagList(rec.faltantesEntrada || [], TONE.bad)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#A93226', marginBottom: 8 }}>{T.unexpected} · {rec.noEsperados?.length ?? 0}</div>
                    {tagList(rec.noEsperados || [], TONE.bad)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C5220', marginBottom: 8 }}>{T.pendingOut} · {rec.pendientesSalida?.length ?? 0}</div>
                    {tagList(rec.pendientesSalida || [], TONE.warn)}
                  </div>
                </div>
              </div>

              )}

              {/* Zonas del almacén */}
              {hview === 'despacho' && (
              <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45', marginBottom: 14 }}>Paso 4 · {T.zonesTitle} (estado físico del almacén)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'stretch' }}>
                  <Zone name={T.zoneIn} count={rec.entradas?.length ?? 0} tone={TONE.info}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>} />
                  <div style={{ alignSelf: 'center', color: '#8B9DBA', fontSize: 18 }}>→</div>
                  <Zone name={T.zoneStage} count={Math.max(0, (rec.entradas?.length ?? 0) - (rec.salidas?.length ?? 0)) + (rec.noEsperados?.length ?? 0)} tone={TONE.warn}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8l8-4 8 4v8l-8 4-8-4V8z"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>} />
                  <div style={{ alignSelf: 'center', color: '#8B9DBA', fontSize: 18 }}>→</div>
                  <Zone name={T.zoneOut} count={rec.salidas?.length ?? 0} tone={TONE.ok}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h13m0 0l-4-4m4 4l-4 4M17 5h4v14h-4"/></svg>} />
                </div>
                {canManage && !rec.despachadoAt && rec.recibidoAt && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F0F5FB', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    {rec.bloqueado ? (
                      <button type="button" onClick={() => setHview('conciliacion')}
                        style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#A93226', background: 'rgba(192,57,43,.08)', border: '1px solid rgba(192,57,43,.3)', borderRadius: 9, padding: '8px 12px', cursor: 'pointer' }}>
                        Despacho bloqueado: hay ajustes pendientes → Ir a Revisar
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#6C82A6', flex: 1 }}>Escanea las salidas arriba y luego despacha el manifiesto.</span>
                    )}
                    {btn('Despachar manifiesto', true, rec.bloqueado, doDispatch)}
                  </div>
                )}
              </div>

              )}

              {/* Ajustes */}
              {hview === 'conciliacion' && (<>
              <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45' }}>Paso 5 · {T.adjTitle} (diferencias)</div>
                  {canManage && !rec.despachadoAt && <div style={{ marginLeft: 'auto' }}>{btn(T.adjNew, false, false, () => setAdj(a => ({ ...a, open: !a.open })))}</div>}
                </div>
                {adj.open && canManage && !rec.despachadoAt && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '10px 12px', background: '#EEF4FC', borderRadius: 10 }}>
                    <select style={{ ...inputStyle, flex: '0 1 260px' }} value={adj.codigo}
                      onChange={e => setAdj(a => ({ ...a, codigo: e.target.value }))}>
                      <option value="">{T.codePh}</option>
                      {(m.detalles || []).map(d => (
                        <option key={d.id} value={d.codigoSeguimiento}>{d.codigoSeguimiento} · {d.estado}</option>
                      ))}
                    </select>
                    <select style={inputStyle} value={adj.type} onChange={e => setAdj(a => ({ ...a, type: e.target.value }))}>
                      {['FALTANTE', 'SOBRANTE', 'AVERIADO', 'OTRO'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input style={{ ...inputStyle, flex: '0 1 120px' }} placeholder="Esperado" value={adj.expected}
                      onChange={e => setAdj(a => ({ ...a, expected: e.target.value }))} />
                    <input style={{ ...inputStyle, flex: '0 1 120px' }} placeholder="Real" value={adj.actual}
                      onChange={e => setAdj(a => ({ ...a, actual: e.target.value }))} />
                    <input style={{ ...inputStyle, flex: '1 1 220px' }} placeholder={T.adjReason} value={adj.reason}
                      onChange={e => setAdj(a => ({ ...a, reason: e.target.value }))} />
                    {btn(T.adjNew, true, adj.busy || !adj.codigo.trim() || !adj.reason.trim(), doAdj)}
                  </div>
                )}
                {!!rec.ajustes?.length && (
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr 2fr .8fr 1fr 1fr 1.4fr', minWidth: 880 }}>
                      {T.adjCols.map(c => (
                        <div key={c} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{c}</div>
                      ))}
                      {rec.ajustes.map(a => (
                        <React.Fragment key={a.id}>
                          <div style={{ ...cell, fontFamily: 'ui-monospace, Menlo, monospace' }}>{a.codigoSeguimiento}</div>
                          <div style={cell}>{a.tipo}</div>
                          <div style={cell}>
                            {a.motivo}
                            {(a.esperado || a.real) && (
                              <div style={{ fontSize: 11.5, color: '#A93226', fontWeight: 600, marginTop: 2 }}>
                                Declarado: {a.esperado || '—'} → Real: {a.real || '—'}
                              </div>
                            )}
                          </div>
                          <div style={cell}>{chip(a.estado, TONE[ADJ_TONE[a.estado]] || TONE.neutral)}</div>
                          <div style={cell}>{a.registradoPorNombre || '—'}</div>
                          <div style={cell}>{a.resueltoPorNombre || '—'}</div>
                          <div style={cell}>
                            {a.estado === 'PENDIENTE' && (canResolve || a.registradoPor === userId) ? (
                              <div style={{ display: 'flex', gap: 6 }}>
                                {canResolve && a.registradoPor !== userId && (
                                  <button type="button" onClick={() => resolveAdj(a.id, true)}
                                    style={{ padding: '5px 12px', borderRadius: 8, border: '1.5px solid #0F5F36', background: 'rgba(19,122,69,.1)', color: '#0F5F36', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                                    {T.approve}
                                  </button>
                                )}
                                <button type="button" onClick={() => resolveAdj(a.id, false)}
                                  style={{ padding: '5px 12px', borderRadius: 8, border: '1.5px solid #A93226', background: 'rgba(192,57,43,.08)', color: '#A93226', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                                  {a.registradoPor === userId ? 'Cancelar' : T.reject}
                                </button>
                              </div>
                            ) : <span style={{ fontSize: 12, color: '#8B9DBA' }}>{a.estado === 'PENDIENTE' ? '—' : fmtDT(a.fechaResolucion)}</span>}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actividad reciente */}
              <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45', marginBottom: 14 }}>{T.activityTitle}</div>
                {!scans.length ? (
                  <div style={{ fontSize: 13, color: '#8B9DBA', padding: '8px 0' }}>{T.activityEmpty}</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {[...scans].slice(-8).reverse().map((s, i, arr) => {
                      const [phaseLabel, tone] = { in: [T.phaseIn, TONE.info], out: [T.phaseOut, TONE.ok], move: [T.phaseMove, TONE.warn], inspect: [T.phaseInspect, TONE.neutral] }[s.fase] || [s.fase, TONE.neutral]
                      return (
                        <div key={s.id} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: tone.fg, border: `3px solid ${tone.bg}`, marginTop: 3 }} />
                            {i < arr.length - 1 && <span style={{ width: 2, flex: 1, background: '#DCE6F5', minHeight: 18 }} />}
                          </div>
                          <div style={{ paddingBottom: 16 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, fontWeight: 700, color: '#001B45' }}>{s.tracking_code}</span>
                              {chip(phaseLabel, tone)}
                              {s.condicion && s.condicion !== 'ok' && chip(s.condicion === 'damaged' ? T.condDamaged : T.condOpened, TONE.bad)}
                            </div>
                            <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>
                              {fmtDT(s.scanned_at)}{s.scanned_by ? ` · ${T.scannedBy} #${s.scanned_by}` : ''}{s.ubicacion ? ` · ${s.ubicacion}` : ''}{s.notas ? ` · ${s.notas}` : ''}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Bitácora de escaneos */}
              {!!scans.length && (
                <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45', marginBottom: 10 }}>{T.scansTitle}</div>
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr .7fr .7fr 1.2fr 1.4fr', minWidth: 680 }}>
                      {T.cols.map(c => (
                        <div key={c} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{c}</div>
                      ))}
                      {scans.map(s => (
                        <React.Fragment key={s.id}>
                          <div style={{ ...cell, fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.tracking_code}</div>
                          <div style={cell}>{chip(({ in: T.phaseIn, out: T.phaseOut, move: T.phaseMove, inspect: T.phaseInspect })[s.fase] || s.fase, { in: TONE.info, out: TONE.ok, move: TONE.warn, inspect: TONE.neutral }[s.fase] || TONE.neutral)}</div>
                          <div style={cell}>{s.scanned_by ? `#${s.scanned_by}` : '—'}</div>
                          <div style={cell}>{fmtDT(s.scanned_at)}</div>
                          <div style={cell}>{s.notas || '—'}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              </>)}
            </>
          )}
        </div>
      </div>

      {toast && (
        <div role="status" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60, padding: '13px 20px', borderRadius: 12, background: '#001B45', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 14px 40px rgba(0,10,30,.3)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

export function HubScans({ token }) {
  const [rows, setRows] = React.useState(null)
  const [err, setErr] = React.useState('')
  const [q, setQ] = React.useState('')
  const [fase, setFase] = React.useState('')
  const [cond, setCond] = React.useState('')
  const [sort, setSort] = React.useState({ key: 'fecha', dir: -1 })
  const [page, setPage] = React.useState(1)
  const PER_PAGE = 15
  React.useEffect(() => {
    let on = true
    api.hubMyScans(token).then(d => { if (on) setRows(d || []) }).catch(e => { if (on) setErr(e.message) })
    return () => { on = false }
  }, [token])
  const FASES = { in: 'Entrada', out: 'Salida', move: 'Movimiento', inspect: 'Inspección' }
  const CONDS = { ok: 'Conforme', damaged: 'Dañado', opened: 'Abierto' }
  const filtered = (rows || []).filter(r =>
    (!q.trim() || [r.codigo, r.manifiesto, r.notas].some(v => (v || '').toLowerCase().includes(q.trim().toLowerCase()))) &&
    (!fase || r.fase === fase) && (!cond || r.condicion === cond)
  )
  const sorted = [...filtered].sort((a, b) => {
    const av = sort.key === 'fecha' ? (a.fecha || '') : (a[sort.key] || '')
    const bv = sort.key === 'fecha' ? (b.fecha || '') : (b[sort.key] || '')
    return String(av).localeCompare(String(bv), 'es', { numeric: true }) * sort.dir
  })
  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const cur = Math.min(page, pages)
  const visible = sorted.slice((cur - 1) * PER_PAGE, cur * PER_PAGE)
  React.useEffect(() => { setPage(1) }, [q, fase, cond])
  const cell = { padding: '10px 12px', borderTop: '1px solid #E3EBF7', fontSize: 13, color: '#10233F' }
  const th = (key, label) => (
    <div key={key} onClick={() => setSort(s => ({ key, dir: s.key === key ? -s.dir : 1 }))}
      style={{ padding: '8px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: sort.key === key ? '#0768C9' : '#6C82A6', cursor: 'pointer', userSelect: 'none' }}>
      {label}{sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}
    </div>
  )
  const thStatic = (label) => (
    <div key={label} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{label}</div>
  )
  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45' }}>Mis escaneos y despachos</div>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filtrar por código o manifiesto…" style={{ ...inputStyle, flex: '0 1 240px', marginLeft: 'auto' }} />
        <select value={fase} onChange={e => setFase(e.target.value)} style={{ ...inputStyle, flex: '0 1 150px', cursor: 'pointer' }}>
          <option value="">Todas las fases</option>
          {Object.entries(FASES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select value={cond} onChange={e => setCond(e.target.value)} style={{ ...inputStyle, flex: '0 1 150px', cursor: 'pointer' }}>
          <option value="">Toda condición</option>
          {Object.entries(CONDS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>
      {err && <div style={{ fontSize: 12.5, color: '#A93226', marginBottom: 8 }}>{err}</div>}
      {!rows ? <div style={{ fontSize: 12.5, color: '#6C82A6' }}>Cargando…</div> : !filtered.length ? (
        <div style={{ fontSize: 12.5, color: '#6C82A6' }}>Sin escaneos registrados todavía.</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.7fr 0.9fr 0.9fr 1.4fr 1.1fr', minWidth: 820 }}>
              {th('manifiesto', 'Manifiesto')}{th('codigo', 'Código')}{th('fase', 'Fase')}{thStatic('Condición')}{thStatic('Ubicación')}{thStatic('Notas')}{th('fecha', 'Fecha')}
            </div>
            {visible.map(s => (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.7fr 0.9fr 0.9fr 1.4fr 1.1fr', minWidth: 820 }}>
                <div style={{ ...cell, fontWeight: 700, color: '#001B45' }}>{s.manifiesto || `#${s.manifiestoId}`}</div>
                <div style={{ ...cell, fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.codigo}</div>
                <div style={cell}>{chip(FASES[s.fase] || s.fase || '—', { in: TONE.info, out: TONE.ok, move: TONE.warn, inspect: TONE.neutral }[s.fase] || TONE.neutral)}</div>
                <div style={cell}>{CONDS[s.condicion] || '—'}</div>
                <div style={cell}>{s.ubicacion || '—'}</div>
                <div style={cell}>{s.notas || '—'}</div>
                <div style={cell}>{fmtDT(s.fecha)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#6C82A6' }}>{sorted.length} registro{sorted.length === 1 ? '' : 's'} · Página {cur} de {pages}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)}
                style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #DCE6F5', background: '#fff', color: cur <= 1 ? '#B7C8E4' : '#001B45', fontWeight: 600, cursor: cur <= 1 ? 'default' : 'pointer' }}>‹ Anterior</button>
              <button type="button" disabled={cur >= pages} onClick={() => setPage(cur + 1)}
                style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #DCE6F5', background: '#fff', color: cur >= pages ? '#B7C8E4' : '#001B45', fontWeight: 600, cursor: cur >= pages ? 'default' : 'pointer' }}>Siguiente ›</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
