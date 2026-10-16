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
  scan: 'Registrar escaneo',
  receive: 'Marcar recepción',
  dispatch: 'Despachar',
  dispatched: 'Despachado',
  received: 'Recibido en hub',
  notReceived: 'Pendiente de recepción',
  blocked: 'Despacho bloqueado: hay diferencias sin ajuste aprobado.',
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
  adjCols: ['Código', 'Tipo', 'Motivo', 'Estado', 'Acción'],
  done: 'Escaneo registrado',
  receivedOk: 'Recepción marcada.',
  dispatchOk: 'Manifiesto despachado del hub.',
  adjOk: 'Ajuste registrado.',
  resolvedOk: 'Ajuste resuelto.',
}

const TONE = {
  neutral: { bg: '#EEF4FC', fg: '#10233F' },
  info: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  ok: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  warn: { bg: 'rgba(217,154,0,.16)', fg: '#6C5220' },
  bad: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
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

export default function Hub({ token }) {
  const [list, setList] = React.useState([])
  const [sel, setSel] = React.useState(null)
  const [detail, setDetail] = React.useState(null) // { manifest, conciliacion, escaneos }
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState('')
  const [toast, setToast] = React.useState('')
  const [scan, setScan] = React.useState({ code: '', phase: 'in', notes: '', busy: false })
  const [adj, setAdj] = React.useState({ open: false, codigo: '', type: 'FALTANTE', reason: '', busy: false })
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
      setSel(prev => (keepSel && arr.some(r => r.id === prev)) ? prev : (arr[0] ? arr[0].id : null))
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

  const m = detail?.manifest || null
  const rec = detail?.conciliacion || null
  const scans = detail?.escaneos || []

  const doScan = async () => {
    if (!scan.code.trim()) return
    setScan(s => ({ ...s, busy: true }))
    try {
      await api.scanHubManifest(m.id, { codigo: scan.code.trim(), phase: scan.phase, notes: scan.notes || undefined }, token)
      notify(T.done)
      setScan(s => ({ ...s, code: '', notes: '', busy: false }))
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
      await api.createHubAdjustment(m.id, { codigo: adj.codigo.trim(), type: adj.type, reason: adj.reason.trim() }, token)
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

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {T.manifestLabel}
          </div>
          <select value={sel ?? ''} onChange={e => setSel(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 260 }} aria-label={T.manifestLabel}>
            {list.map(x => <option key={x.id} value={x.id}>{x.codigo}</option>)}
            {!list.length && <option value="">—</option>}
          </select>
          {m && chip(ESTADOS[m.estado] || m.estado, TONE.info)}
          {rec && (rec.despachadoAt
            ? chip(`${T.dispatched} · ${fmtDT(rec.despachadoAt)}`, TONE.ok)
            : rec.recibidoAt
              ? chip(`${T.received} · ${fmtDT(rec.recibidoAt)}`, TONE.info)
              : chip(T.notReceived, TONE.neutral))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {btn(T.receive, false, !m || !rec || !!rec.recibidoAt, doReceive)}
            {btn(T.dispatch, true, !m || !rec || !rec.recibidoAt || !!rec.despachadoAt || rec.bloqueado, doDispatch)}
          </div>
        </div>

        <div style={{ padding: 22, background: '#EEF4FC', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading && <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>{T.loading}</div>}
          {!loading && err && <div style={{ padding: 40, textAlign: 'center', color: '#A93226' }}>{err}</div>}
          {!loading && !err && !m && <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>{T.empty}</div>}

          {!loading && !err && m && rec && (
            <>
              {/* Banner de conciliación */}
              <div style={{ fontSize: 13, lineHeight: 1.55, padding: '12px 16px', borderRadius: 10, background: rec.bloqueado ? 'rgba(192,57,43,.08)' : 'rgba(19,122,69,.08)', color: rec.bloqueado ? '#A93226' : '#0F5F36', border: `1px solid ${rec.bloqueado ? 'rgba(192,57,43,.3)' : 'rgba(19,122,69,.3)'}` }}>
                {rec.bloqueado ? T.blocked : T.ready}
                {rec.bloqueado && rec.ajustes?.some(a => a.estado === 'PENDIENTE') ? ' ' + T.pendingAdj : ''}
              </div>

              {/* Escaneo */}
              {!rec.despachadoAt && (
                <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45', marginBottom: 12 }}>{T.scanTitle}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['in', 'out'].map(p => (
                        <button key={p} type="button" onClick={() => setScan(s => ({ ...s, phase: p }))}
                          style={{ minHeight: 36, padding: '7px 16px', borderRadius: 100, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: scan.phase === p ? '#001B45' : '#fff', color: scan.phase === p ? '#fff' : '#10233F', border: `1.5px solid ${scan.phase === p ? '#001B45' : '#DCE6F5'}` }}>
                          {p === 'in' ? T.phaseIn : T.phaseOut}
                        </button>
                      ))}
                    </div>
                    <input style={{ ...inputStyle, flex: '1 1 220px' }} placeholder={T.codePh} value={scan.code}
                      onChange={e => setScan(s => ({ ...s, code: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') doScan() }} />
                    <input style={{ ...inputStyle, flex: '1 1 180px' }} placeholder={T.notesPh} value={scan.notes}
                      onChange={e => setScan(s => ({ ...s, notes: e.target.value }))} />
                    {btn(T.scan, true, scan.busy || !scan.code.trim(), doScan)}
                  </div>
                </div>
              )}

              {/* Conciliación */}
              <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45' }}>{T.reconTitle}</div>
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

              {/* Ajustes */}
              <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45' }}>{T.adjTitle}</div>
                  <div style={{ marginLeft: 'auto' }}>{btn(T.adjNew, false, false, () => setAdj(a => ({ ...a, open: !a.open })))}</div>
                </div>
                {adj.open && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '10px 12px', background: '#EEF4FC', borderRadius: 10 }}>
                    <input style={{ ...inputStyle, flex: '0 1 180px' }} placeholder={T.codePh} value={adj.codigo}
                      onChange={e => setAdj(a => ({ ...a, codigo: e.target.value }))} />
                    <select style={inputStyle} value={adj.type} onChange={e => setAdj(a => ({ ...a, type: e.target.value }))}>
                      {['FALTANTE', 'SOBRANTE', 'AVERIADO', 'OTRO'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input style={{ ...inputStyle, flex: '1 1 220px' }} placeholder={T.adjReason} value={adj.reason}
                      onChange={e => setAdj(a => ({ ...a, reason: e.target.value }))} />
                    {btn(T.adjNew, true, adj.busy || !adj.codigo.trim() || !adj.reason.trim(), doAdj)}
                  </div>
                )}
                {!!rec.ajustes?.length && (
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr 2fr .8fr 1.4fr', minWidth: 700 }}>
                      {T.adjCols.map(c => (
                        <div key={c} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{c}</div>
                      ))}
                      {rec.ajustes.map(a => (
                        <React.Fragment key={a.id}>
                          <div style={{ ...cell, fontFamily: 'ui-monospace, Menlo, monospace' }}>{a.codigoSeguimiento}</div>
                          <div style={cell}>{a.tipo}</div>
                          <div style={cell}>{a.motivo}</div>
                          <div style={cell}>{chip(a.estado, TONE[ADJ_TONE[a.estado]] || TONE.neutral)}</div>
                          <div style={cell}>
                            {a.estado === 'PENDIENTE' ? (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button type="button" onClick={() => resolveAdj(a.id, true)}
                                  style={{ padding: '5px 12px', borderRadius: 8, border: '1.5px solid #0F5F36', background: 'rgba(19,122,69,.1)', color: '#0F5F36', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                                  {T.approve}
                                </button>
                                <button type="button" onClick={() => resolveAdj(a.id, false)}
                                  style={{ padding: '5px 12px', borderRadius: 8, border: '1.5px solid #A93226', background: 'rgba(192,57,43,.08)', color: '#A93226', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                                  {T.reject}
                                </button>
                              </div>
                            ) : <span style={{ fontSize: 12, color: '#8B9DBA' }}>{fmtDT(a.fechaResolucion)}</span>}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
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
                          <div style={cell}>{chip(s.fase === 'in' ? T.phaseIn : T.phaseOut, s.fase === 'in' ? TONE.info : TONE.ok)}</div>
                          <div style={cell}>{s.scanned_by ? `#${s.scanned_by}` : '—'}</div>
                          <div style={cell}>{fmtDT(s.scanned_at)}</div>
                          <div style={cell}>{s.notas || '—'}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
