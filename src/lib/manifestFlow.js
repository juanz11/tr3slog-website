/**
 * manifestFlow.js — Reglas de negocio del ciclo de vida del Manifiesto TR3SLOG.
 *
 * Fuente única de verdad compartida por el frontend (portales/app) y el mock API
 * (.tmp/mock-api.mjs). JS puro sin dependencias ni APIs de navegador en top-level.
 *
 * Cubre lo definido en los diagramas UML del módulo "Gestión de Manifiestos":
 *   - Máquina de estados con TODOS los valores del enum (incluye COMPLETADO
 *     y EN_SOLICITUD_TRASPASO, ausentes en la primera versión del ER).
 *   - Rechazo de asignación: ASIGNADO → CREADO (vuelve a mesa para reasignar).
 *   - Rechazo de traspaso: EN_SOLICITUD_TRASPASO → EN_RUTA con
 *     `asistenciaVialPendiente` (el chofer aguarda remolque/asistencia).
 *   - DetalleManifiesto con lat/lng (metadatos GPS del POD).
 *   - Traspaso parcial: solo los pendientes seleccionados pasan al derivado;
 *     los pendientes NO seleccionados cierran como NO_ENTREGADO.
 *   - Handover físico con doble escaneo (scan-out origen + scan-in reemplazo).
 */

export const ESTADO_MANIFIESTO = {
  CREADO: 'CREADO',
  ASIGNADO: 'ASIGNADO',
  EN_RUTA: 'EN_RUTA',
  EN_SOLICITUD_TRASPASO: 'EN_SOLICITUD_TRASPASO',
  COMPLETADO: 'COMPLETADO',
  COMPLETADO_CON_INCIDENCIAS: 'COMPLETADO_CON_INCIDENCIAS',
  TRANSFERIDO: 'TRANSFERIDO',
}

export const ESTADO_DETALLE = {
  PENDIENTE: 'PENDIENTE',
  ENTREGADO: 'ENTREGADO',
  NO_ENTREGADO: 'NO_ENTREGADO',
  TRANSFERIDO: 'TRANSFERIDO',
}

export const ESTADO_SOLICITUD = {
  PENDIENTE: 'PENDIENTE',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
}

export const VIA_CAPTURA = { QR: 'QR', MANUAL: 'MANUAL' }

/** Etiquetas en español para badges/estados en la UI. */
export const ESTADO_MANIFIESTO_LABELS = {
  CREADO: 'Creado',
  ASIGNADO: 'Asignado',
  EN_RUTA: 'En ruta',
  EN_SOLICITUD_TRASPASO: 'En solicitud de traspaso',
  COMPLETADO: 'Completado',
  COMPLETADO_CON_INCIDENCIAS: 'Completado con incidencias',
  TRANSFERIDO: 'Transferido',
}

export class ManifestError extends Error {
  constructor(code, message) {
    super(message || code)
    this.name = 'ManifestError'
    this.code = code
  }
}

const EM = ESTADO_MANIFIESTO
const ED = ESTADO_DETALLE
const ES = ESTADO_SOLICITUD

const uid = (() => {
  let n = 0
  return (prefix = 'id') =>
    `${prefix}-${Date.now().toString(36)}-${(++n).toString(36)}`
})()

const ahora = () => new Date().toISOString()

/**
 * Tabla de transiciones del manifiesto.
 * Cada evento declara desde qué estados es legal.
 */
const TRANSICIONES = {
  asignar:            { desde: [EM.CREADO] },
  rechazarAsignacion: { desde: [EM.ASIGNADO] },
  iniciarRuta:        { desde: [EM.ASIGNADO] },
  solicitarTraspaso:  { desde: [EM.EN_RUTA] },
  rechazarTraspaso:   { desde: [EM.EN_SOLICITUD_TRASPASO] },
  aprobarTraspaso:    { desde: [EM.EN_SOLICITUD_TRASPASO] },
  finalizar:          { desde: [EM.EN_RUTA] },
}

export function puedeTransicionar(manifiesto, evento) {
  const t = TRANSICIONES[evento]
  return !!t && t.desde.includes(manifiesto.estado)
}

export function accionesDisponibles(manifiesto) {
  return Object.keys(TRANSICIONES).filter((e) => puedeTransicionar(manifiesto, e))
}

function exigirTransicion(manifiesto, evento) {
  if (!puedeTransicionar(manifiesto, evento)) {
    throw new ManifestError(
      'TRANSICION_INVALIDA',
      `No se puede '${evento}' un manifiesto en estado ${manifiesto.estado}`
    )
  }
}

/* ------------------------------------------------------------------ */
/* Construcción                                                        */
/* ------------------------------------------------------------------ */

export function crearDetalle({ id, secuenciaVisita, pedidoId, codigoSeguimiento, detalleOrigenId = null }) {
  return {
    id: id || uid('det'),
    secuenciaVisita,
    pedidoId,
    codigoSeguimiento,
    detalleOrigenId,
    estado: ED.PENDIENTE,
    horaVisita: null,
    motivoFallo: null,
    evidenciaUrl: null,
    capturaVia: null,
    lat: null,
    lng: null,
    gpsPrecision: null,
  }
}

export function crearManifiesto({ id, codigo, pedidos = [], creadoPor = null, idManifiestoOrigen = null }) {
  return {
    id: id || uid('man'),
    codigo,
    estado: EM.CREADO,
    choferId: null,
    vehiculoId: null,
    idManifiestoOrigen,
    creadoPor,
    fechaCreacion: ahora(),
    asistenciaVialPendiente: false,
    solicitudes: [],
    detalles: pedidos.map((p, i) =>
      crearDetalle({
        secuenciaVisita: i + 1,
        pedidoId: p.pedidoId ?? p.id,
        codigoSeguimiento: p.codigoSeguimiento ?? p.tracking,
        detalleOrigenId: p.detalleOrigenId || null,
      })
    ),
  }
}

/* ------------------------------------------------------------------ */
/* Asignación (Operador: chofer + vehículo)                            */
/* ------------------------------------------------------------------ */

export function asignar(manifiesto, { choferId, vehiculoId }) {
  exigirTransicion(manifiesto, 'asignar')
  if (!choferId || !vehiculoId) {
    throw new ManifestError('ASIGNACION_INCOMPLETA', 'Asignar requiere chofer y vehículo')
  }
  return { ...manifiesto, estado: EM.ASIGNADO, choferId, vehiculoId }
}

/** El chofer rechaza la oferta: el manifiesto vuelve a CREADO sin chofer/vehículo. */
export function rechazarAsignacion(manifiesto, { motivo = '' } = {}) {
  exigirTransicion(manifiesto, 'rechazarAsignacion')
  return {
    ...manifiesto,
    estado: EM.CREADO,
    choferId: null,
    vehiculoId: null,
    motivoRechazoAsignacion: motivo,
  }
}

export function iniciarRuta(manifiesto) {
  exigirTransicion(manifiesto, 'iniciarRuta')
  return { ...manifiesto, estado: EM.EN_RUTA, fechaInicioRuta: ahora() }
}

/* ------------------------------------------------------------------ */
/* POD — Prueba de entrega                                             */
/* ------------------------------------------------------------------ */

/** Secuencia de la próxima parada pendiente (menor secuenciaVisita sin resolver). */
export function proximaParada(manifiesto) {
  const pend = manifiesto.detalles.filter((d) => d.estado === ED.PENDIENTE)
  if (!pend.length) return null
  return pend.reduce((a, b) => (a.secuenciaVisita <= b.secuenciaVisita ? a : b))
}

/**
 * Valida un código escaneado (QR) o digitado (fallback manual por QR ilegible).
 * Mismo validador para ambas vías; `via` solo queda registrado en el detalle.
 * estricto=true exige que el paquete corresponda a la parada actual
 * ("Paquete no coincide con la parada" del flujo POD).
 */
export function validarEscaneo(manifiesto, codigo, { estricto = true } = {}) {
  if (manifiesto.estado !== EM.EN_RUTA) {
    throw new ManifestError('MANIFIESTO_NO_EN_RUTA', 'El manifiesto no está en ruta')
  }
  const detalle = manifiesto.detalles.find(
    (d) => String(d.codigoSeguimiento) === String(codigo).trim()
  )
  if (!detalle) {
    throw new ManifestError('QR_NO_PERTENECE', 'El paquete no pertenece al manifiesto activo')
  }
  if (detalle.estado !== ED.PENDIENTE) {
    throw new ManifestError('YA_REGISTRADO', `El paquete ya figura como ${detalle.estado}`)
  }
  const prox = proximaParada(manifiesto)
  if (estricto && prox && detalle.id !== prox.id) {
    throw new ManifestError('PARADA_INCORRECTA', 'El paquete no coincide con la parada actual')
  }
  return detalle
}

function actualizarDetalle(manifiesto, detalleId, patch) {
  return {
    ...manifiesto,
    detalles: manifiesto.detalles.map((d) => (d.id === detalleId ? { ...d, ...patch } : d)),
  }
}

/**
 * Registra entrega exitosa. Requiere evidencia (foto POD) y guarda los
 * metadatos GPS/hora capturados por la app.
 */
export function registrarEntrega(manifiesto, detalleId, { evidenciaUrl, lat = null, lng = null, gpsPrecision = null, horaVisita, via = VIA_CAPTURA.QR }) {
  exigirEstadoEnRuta(manifiesto)
  const detalle = manifiesto.detalles.find((d) => d.id === detalleId)
  if (!detalle) throw new ManifestError('DETALLE_NO_EXISTE', 'Detalle no encontrado')
  if (detalle.estado !== ED.PENDIENTE) throw new ManifestError('YA_REGISTRADO', 'La parada ya fue resuelta')
  if (!evidenciaUrl) throw new ManifestError('SIN_EVIDENCIA', 'El POD requiere fotografía de evidencia')
  return actualizarDetalle(manifiesto, detalleId, {
    estado: ED.ENTREGADO,
    evidenciaUrl,
    lat, lng, gpsPrecision,
    horaVisita: horaVisita || ahora(),
    capturaVia: via,
  })
}

/** Atajo del flujo POD: escanea (o digita) → valida → registra entrega. */
export function registrarEntregaPorCodigo(manifiesto, codigo, meta = {}) {
  const detalle = validarEscaneo(manifiesto, codigo, { estricto: meta.estricto !== false })
  return registrarEntrega(manifiesto, detalle.id, { ...meta, via: meta.via || VIA_CAPTURA.QR })
}

/** Entrega fallida: motivo obligatorio (causa de no entrega). */
export function registrarFallo(manifiesto, detalleId, { motivo, lat = null, lng = null, horaVisita } = {}) {
  exigirEstadoEnRuta(manifiesto)
  if (!motivo) throw new ManifestError('SIN_MOTIVO', 'Registrar incidencia requiere la causa')
  const detalle = manifiesto.detalles.find((d) => d.id === detalleId)
  if (!detalle) throw new ManifestError('DETALLE_NO_EXISTE', 'Detalle no encontrado')
  if (detalle.estado !== ED.PENDIENTE) throw new ManifestError('YA_REGISTRADO', 'La parada ya fue resuelta')
  return actualizarDetalle(manifiesto, detalleId, {
    estado: ED.NO_ENTREGADO,
    motivoFallo: motivo,
    lat, lng,
    horaVisita: horaVisita || ahora(),
  })
}

function exigirEstadoEnRuta(manifiesto) {
  if (manifiesto.estado !== EM.EN_RUTA) {
    throw new ManifestError('MANIFIESTO_NO_EN_RUTA', 'El manifiesto no está en ruta')
  }
}

/* ------------------------------------------------------------------ */
/* Cierre                                                              */
/* ------------------------------------------------------------------ */

export function calcularProgreso(manifiesto) {
  const total = manifiesto.detalles.length
  if (!total) return 0
  const resueltos = manifiesto.detalles.filter(
    (d) => d.estado === ED.ENTREGADO || d.estado === ED.NO_ENTREGADO
  ).length
  return resueltos / total
}

/**
 * Cierre por el chofer. Resuelve COMPLETADO vs COMPLETADO_CON_INCIDENCIAS
 * según haya o no entregas fallidas. Todas las paradas deben estar resueltas.
 */
export function finalizarManifiesto(manifiesto) {
  exigirTransicion(manifiesto, 'finalizar')
  if (manifiesto.asistenciaVialPendiente) {
    throw new ManifestError('ASISTENCIA_PENDIENTE', 'Hay una asistencia vial pendiente de resolver')
  }
  const pendientes = manifiesto.detalles.filter((d) => d.estado === ED.PENDIENTE)
  if (pendientes.length) {
    throw new ManifestError('PEDIDOS_PENDIENTES', `Quedan ${pendientes.length} paradas sin resolver`)
  }
  const conIncidencias = manifiesto.detalles.some((d) => d.estado === ED.NO_ENTREGADO)
  return {
    ...manifiesto,
    estado: conIncidencias ? EM.COMPLETADO_CON_INCIDENCIAS : EM.COMPLETADO,
    fechaCierre: ahora(),
  }
}

/* ------------------------------------------------------------------ */
/* Traspaso                                                            */
/* ------------------------------------------------------------------ */

/**
 * El chofer solicita traspaso seleccionando las paradas pendientes a mover
 * (soporta traspaso parcial: puede no seleccionar todas).
 */
export function solicitarTraspaso(manifiesto, { motivo, detalleIds }) {
  exigirTransicion(manifiesto, 'solicitarTraspaso')
  if (!motivo) throw new ManifestError('SIN_MOTIVO', 'La solicitud requiere el motivo de la incidencia')
  const pendientes = new Set(
    manifiesto.detalles.filter((d) => d.estado === ED.PENDIENTE).map((d) => d.id)
  )
  const ids = detalleIds || [...pendientes]
  if (!ids.length) throw new ManifestError('SIN_ITEMS', 'No hay paradas pendientes para trasladar')
  const invalidos = ids.filter((id) => !pendientes.has(id))
  if (invalidos.length) {
    throw new ManifestError('ITEMS_INVALIDOS', 'Solo pueden trasladarse paradas pendientes')
  }
  const solicitud = {
    id: uid('sol'),
    fechaSolicitud: ahora(),
    motivoIncidencia: motivo,
    estado: ES.PENDIENTE,
    solicitadoPor: manifiesto.choferId,
    revisadoPor: null,
    fechaResolucion: null,
    motivoResolucion: null,
    items: ids.slice(),
  }
  return {
    manifiesto: {
      ...manifiesto,
      estado: EM.EN_SOLICITUD_TRASPASO,
      solicitudes: [...manifiesto.solicitudes, solicitud],
    },
    solicitud,
  }
}

function resolverSolicitud(manifiesto, solicitudId, patch) {
  return manifiesto.solicitudes.map((s) => (s.id === solicitudId ? { ...s, ...patch } : s))
}

function buscarSolicitud(manifiesto, solicitudId) {
  const s = manifiesto.solicitudes.find((x) => x.id === solicitudId)
  if (!s) throw new ManifestError('SOLICITUD_NO_EXISTE', 'Solicitud de traspaso no encontrada')
  if (s.estado !== ES.PENDIENTE) throw new ManifestError('SOLICITUD_RESUELTA', 'La solicitud ya fue resuelta')
  return s
}

/**
 * Operaciones aprueba el traspaso:
 *   1. Los pedidos ya entregados quedan congelados en el manifiesto original.
 *   2. Las paradas seleccionadas pasan a TRANSFERIDO en el original.
 *   3. Las pendientes NO seleccionadas cierran como NO_ENTREGADO
 *      (motivo configurable, por defecto 'NO_TRANSFERIDO').
 *   4. El original queda TRANSFERIDO y se genera el manifiesto derivado
 *      ya ASIGNADO al chofer de reemplazo.
 */
export function aprobarTraspaso(manifiesto, solicitudId, {
  revisadoPor,
  choferId,
  vehiculoId = null,
  motivoPendientes = 'NO_TRANSFERIDO',
  generarCodigo,
} = {}) {
  exigirTransicion(manifiesto, 'aprobarTraspaso')
  if (!choferId) throw new ManifestError('SIN_REEMPLAZO', 'Aprobar requiere el chofer de reemplazo')
  const solicitud = buscarSolicitud(manifiesto, solicitudId)
  const seleccion = new Set(solicitud.items)

  const original = {
    ...manifiesto,
    estado: EM.TRANSFERIDO,
    fechaCierre: ahora(),
    solicitudes: resolverSolicitud(manifiesto, solicitudId, {
      estado: ES.APROBADA,
      revisadoPor: revisadoPor || null,
      fechaResolucion: ahora(),
    }),
    detalles: manifiesto.detalles.map((d) => {
      if (d.estado !== ED.PENDIENTE) return d // entregados congelados, fallos se conservan
      return seleccion.has(d.id)
        ? { ...d, estado: ED.TRANSFERIDO }
        : { ...d, estado: ED.NO_ENTREGADO, motivoFallo: motivoPendientes, horaVisita: ahora() }
    }),
  }

  const derivados = manifiesto.detalles.filter(
    (d) => d.estado === ED.PENDIENTE && seleccion.has(d.id)
  )
  const derivado = crearManifiesto({
    codigo: (generarCodigo || ((c) => `${c}-D${manifiesto.solicitudes.filter((s) => s.estado === ES.APROBADA).length + 1}`))(manifiesto.codigo),
    creadoPor: revisadoPor || null,
    idManifiestoOrigen: manifiesto.id,
    pedidos: derivados.map((d) => ({
      pedidoId: d.pedidoId,
      codigoSeguimiento: d.codigoSeguimiento,
      detalleOrigenId: d.id,
    })),
  })
  const derivadoAsignado = {
    ...asignar(derivado, { choferId, vehiculoId: vehiculoId || 'por-confirmar' }),
    solicitudOrigenId: solicitudId,
  }

  return { original, derivado: derivadoAsignado }
}

/**
 * Operaciones rechaza el traspaso: el manifiesto vuelve a EN_RUTA y queda
 * marcado `asistenciaVialPendiente` (el chofer aguarda remolque/asistencia
 * según el swimlane). Mientras la bandera esté activa no puede finalizar.
 */
export function rechazarTraspaso(manifiesto, solicitudId, { revisadoPor, motivo } = {}) {
  exigirTransicion(manifiesto, 'rechazarTraspaso')
  buscarSolicitud(manifiesto, solicitudId)
  return {
    ...manifiesto,
    estado: EM.EN_RUTA,
    asistenciaVialPendiente: true,
    solicitudes: resolverSolicitud(manifiesto, solicitudId, {
      estado: ES.RECHAZADA,
      revisadoPor: revisadoPor || null,
      motivoResolucion: motivo || null,
      fechaResolucion: ahora(),
    }),
  }
}

/** La asistencia llegó y el chofer puede retomar la ruta (o solicitar de nuevo). */
export function resolverAsistencia(manifiesto) {
  if (manifiesto.estado !== EM.EN_RUTA) {
    throw new ManifestError('MANIFIESTO_NO_EN_RUTA', 'El manifiesto no está en ruta')
  }
  return { ...manifiesto, asistenciaVialPendiente: false }
}

/* ------------------------------------------------------------------ */
/* Handover físico — doble escaneo en el punto de avería               */
/* ------------------------------------------------------------------ */

/**
 * Custodia física de los bultos del manifiesto derivado:
 * scan-out por el chofer origen, scan-in por el de reemplazo.
 * Un scan-in sin scan-out previo o un código ajeno marca discrepancia.
 */
export function crearHandover(original, derivado) {
  return {
    id: uid('hov'),
    origenId: original.id,
    derivadoId: derivado.id,
    estado: 'ABIERTO',
    items: derivado.detalles.map((d) => ({
      detalleId: d.id,
      codigoSeguimiento: d.codigoSeguimiento,
      scanOut: null,
      scanIn: null,
      discrepancia: null,
    })),
  }
}

export function escanearHandover(handover, codigo, fase /* 'out' | 'in' */, meta = {}) {
  if (handover.estado !== 'ABIERTO') {
    throw new ManifestError('HANDOVER_CERRADO', 'El traspaso físico ya fue cerrado')
  }
  const item = handover.items.find((i) => i.codigoSeguimiento === codigo)
  if (!item) {
    // Código que no corresponde al encuentro: se registra como discrepancia.
    return {
      ...handover,
      items: [...handover.items, {
        detalleId: null, codigoSeguimiento: codigo,
        scanOut: null, scanIn: fase === 'in' ? ahora() : null,
        discrepancia: 'PAQUETE_NO_ESPERADO',
      }],
    }
  }
  const items = handover.items.map((i) => {
    if (i.codigoSeguimiento !== codigo) return i
    if (fase === 'out') return { ...i, scanOut: ahora() }
    return {
      ...i,
      scanIn: ahora(),
      discrepancia: i.scanOut ? i.discrepancia : 'SIN_SCAN_OUT',
      receptorLat: meta.lat ?? i.receptorLat,
      receptorLng: meta.lng ?? i.receptorLng,
    }
  })
  return { ...handover, items }
}

export function estadoHandover(handover) {
  const esperados = handover.items.filter((i) => i.detalleId)
  const entregados = esperados.filter((i) => i.scanOut && i.scanIn)
  const discrepancias = handover.items.filter(
    (i) => i.discrepancia || (i.scanIn && !i.scanOut)
  )
  const pendientes = esperados.filter((i) => !i.scanIn)
  return {
    esperados: esperados.length,
    entregados: entregados.length,
    pendientes: pendientes.map((i) => i.codigoSeguimiento),
    discrepancias: discrepancias.map((i) => ({
      codigo: i.codigoSeguimiento, motivo: i.discrepancia || 'SIN_SCAN_OUT',
    })),
    completo: esperados.length > 0 && pendientes.length === 0 && discrepancias.length === 0,
  }
}

/** Cierra el handover; con discrepancias o pendientes queda CERRADO_CON_DISCREPANCIAS. */
export function cerrarHandover(handover) {
  const e = estadoHandover(handover)
  return {
    ...handover,
    estado: e.completo ? 'CERRADO' : 'CERRADO_CON_DISCREPANCIAS',
    fechaCierre: ahora(),
  }
}
