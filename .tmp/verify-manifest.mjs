/**
 * verify-manifest.mjs — Verificación del ciclo de vida del manifiesto.
 * Ejecutar:  node .tmp/verify-manifest.mjs
 */
import assert from 'node:assert/strict'
import {
  ESTADO_MANIFIESTO as EM,
  ESTADO_DETALLE as ED,
  ESTADO_SOLICITUD as ES,
  VIA_CAPTURA,
  crearManifiesto, asignar, rechazarAsignacion, iniciarRuta,
  validarEscaneo, registrarEntrega, registrarEntregaPorCodigo, registrarFallo,
  solicitarTraspaso, aprobarTraspaso, rechazarTraspaso, resolverAsistencia,
  finalizarManifiesto, calcularProgreso, proximaParada, accionesDisponibles,
  crearHandover, escanearHandover, estadoHandover, cerrarHandover,
  ManifestError,
} from '../src/lib/manifestFlow.js'
import { encolar, listarPendientes, sincronizar, limpiar } from '../src/lib/podQueue.js'

let passed = 0
const ok = (name) => { passed++; console.log(`  ✓ ${name}`) }
const throws = (fn, code) => {
  try { fn(); throw new Error('no lanzó') } catch (e) {
    if (e instanceof ManifestError && e.code === code) return
    throw e
  }
}

console.log('\n== 1. Enum EstadoManifiesto completo (7 valores) ==')
assert.deepEqual(Object.keys(EM).sort(), [
  'ASIGNADO', 'COMPLETADO', 'COMPLETADO_CON_INCIDENCIAS', 'CREADO',
  'EN_RUTA', 'EN_SOLICITUD_TRASPASO', 'TRANSFERIDO',
])
ok('incluye COMPLETADO y EN_SOLICITUD_TRASPASO')

console.log('\n== 2. Ciclo base: crear → asignar → iniciar ==')
let m = crearManifiesto({
  codigo: 'MAN-T-1', creadoPor: 'op-1',
  pedidos: [
    { pedidoId: 'p1', codigoSeguimiento: 'TR3-A' },
    { pedidoId: 'p2', codigoSeguimiento: 'TR3-B' },
    { pedidoId: 'p3', codigoSeguimiento: 'TR3-C' },
    { pedidoId: 'p4', codigoSeguimiento: 'TR3-D' },
  ],
})
assert.equal(m.estado, EM.CREADO)
assert.equal(m.detalles.length, 4)
assert.equal(m.detalles[0].lat, null) // campos GPS presentes
ok('manifiesto CREADO con detalles + campos lat/lng')

throws(() => asignar(m, { choferId: 'ch-1' }), 'ASIGNACION_INCOMPLETA')
ok('asignar sin vehículo → ASIGNACION_INCOMPLETA')

m = asignar(m, { choferId: 'ch-1', vehiculoId: 'van-04' })
assert.equal(m.estado, EM.ASIGNADO)
ok('CREADO → ASIGNADO (chofer + vehículo)')

console.log('\n== 3. Chofer rechaza asignación → vuelve a CREADO ==')
m = rechazarAsignacion(m, { motivo: 'Vehículo full' })
assert.equal(m.estado, EM.CREADO)
assert.equal(m.choferId, null)
assert.equal(m.motivoRechazoAsignacion, 'Vehículo full')
ok('ASIGNADO → CREADO y limpia chofer/vehículo')

m = asignar(m, { choferId: 'ch-1', vehiculoId: 'van-04' })
m = iniciarRuta(m)
assert.equal(m.estado, EM.EN_RUTA)
ok('ASIGNADO → EN_RUTA')

console.log('\n== 4. POD: validación QR / manual / GPS / evidencia ==')
throws(() => validarEscaneo(m, 'TR3-ZZZ'), 'QR_NO_PERTENECE')
ok('QR ajeno al manifiesto → QR_NO_PERTENECE')
throws(() => validarEscaneo(m, 'TR3-B'), 'PARADA_INCORRECTA')
ok('QR de otra parada (estricto) → PARADA_INCORRECTA')

// Fallback manual por QR ilegible: mismo validador, vía MANUAL
m = registrarEntregaPorCodigo(m, 'TR3-A', {
  evidenciaUrl: 's3://pod/tr3-a.jpg', lat: 18.4655, lng: -66.1057, gpsPrecision: 8,
  via: VIA_CAPTURA.MANUAL,
})
assert.equal(m.detalles[0].estado, ED.ENTREGADO)
assert.equal(m.detalles[0].capturaVia, 'MANUAL')
assert.equal(m.detalles[0].lat, 18.4655)
ok('entrega por ingreso manual con GPS + evidencia → ENTREGADO')

throws(() => registrarEntrega(m, m.detalles[1].id, { lat: 1, lng: 1 }), 'SIN_EVIDENCIA')
ok('POD sin foto → SIN_EVIDENCIA')

throws(() => registrarFallo(m, m.detalles[1].id, {}), 'SIN_MOTIVO')
ok('incidencia sin causa → SIN_MOTIVO')
m = registrarFallo(m, m.detalles[1].id, { motivo: 'Cliente ausente' })
assert.equal(m.detalles[1].estado, ED.NO_ENTREGADO)
ok('fallo con motivo → NO_ENTREGADO')

assert.equal(calcularProgreso(m), 0.5)
assert.equal(proximaParada(m).codigoSeguimiento, 'TR3-C')
ok('progreso 50% y próxima parada correcta')

throws(() => finalizarManifiesto(m), 'PEDIDOS_PENDIENTES')
ok('finalizar con pendientes → PEDIDOS_PENDIENTES')

console.log('\n== 5. Traspaso: solicitud parcial → rechazo → asistencia ==')
const pendientes = m.detalles.filter((d) => d.estado === ED.PENDIENTE).map((d) => d.id)
const sel = [pendientes[0]] // parcial: solo TR3-C; TR3-D queda fuera
let res = solicitarTraspaso(m, { motivo: 'Avería mecánica', detalleIds: sel })
m = res.manifiesto
assert.equal(m.estado, EM.EN_SOLICITUD_TRASPASO)
assert.equal(res.solicitud.estado, ES.PENDIENTE)
assert.deepEqual(res.solicitud.items, sel)
ok('EN_RUTA → EN_SOLICITUD_TRASPASO con selección parcial')

throws(() => solicitarTraspaso(m, { motivo: 'x' }), 'TRANSICION_INVALIDA')
ok('no permite segunda solicitud mientras hay una pendiente')

m = rechazarTraspaso(m, res.solicitud.id, { revisadoPor: 'sup-1', motivo: 'Sin flota cercana' })
assert.equal(m.estado, EM.EN_RUTA)
assert.equal(m.asistenciaVialPendiente, true)
assert.equal(m.solicitudes[0].estado, ES.RECHAZADA)
ok('rechazo → vuelve a EN_RUTA con asistenciaVialPendiente')

throws(() => finalizarManifiesto(m), 'ASISTENCIA_PENDIENTE')
ok('finalizar bloqueado mientras aguarda asistencia')
m = resolverAsistencia(m)
m = resolverAsistencia(m)
assert.equal(m.asistenciaVialPendiente, false)
ok('resolverAsistencia libera el bloqueo')

console.log('\n== 6. Traspaso aprobado → manifiesto derivado ==')
res = solicitarTraspaso(m, { motivo: 'Avería mecánica', detalleIds: sel })
m = res.manifiesto
const { original, derivado } = aprobarTraspaso(m, res.solicitud.id, {
  revisadoPor: 'sup-1', choferId: 'ch-2', vehiculoId: 'van-07',
})
assert.equal(original.estado, EM.TRANSFERIDO)
assert.equal(original.detalles[0].estado, ED.ENTREGADO)        // congelado
assert.equal(original.detalles[1].estado, ED.NO_ENTREGADO)      // fallo conservado
assert.equal(original.detalles[2].estado, ED.TRANSFERIDO)       // seleccionado
assert.equal(original.detalles[3].estado, ED.NO_ENTREGADO)      // no seleccionado
assert.equal(original.detalles[3].motivoFallo, 'NO_TRANSFERIDO')
ok('original TRANSFERIDO: entregados congelados, seleccionados TRANSFERIDO, resto NO_ENTREGADO')

assert.equal(derivado.estado, EM.ASIGNADO)
assert.equal(derivado.idManifiestoOrigen, original.id)
assert.equal(derivado.choferId, 'ch-2')
assert.equal(derivado.codigo, 'MAN-T-1-D1')
assert.equal(derivado.detalles.length, 1)
assert.equal(derivado.detalles[0].codigoSeguimiento, 'TR3-C')
assert.equal(derivado.detalles[0].detalleOrigenId, original.detalles[2].id)
ok('derivado ASIGNADO al reemplazo con vínculo al origen')

console.log('\n== 7. Handover físico (doble escaneo) ==')
let h = crearHandover(original, derivado)
h = escanearHandover(h, 'TR3-C', 'in') // scan-in sin scan-out → discrepancia
let eh = estadoHandover(h)
assert.equal(eh.discrepancias.length, 1)
assert.equal(eh.discrepancias[0].motivo, 'SIN_SCAN_OUT')
ok('scan-in sin scan-out → discrepancia SIN_SCAN_OUT')

h = escanearHandover(h, 'TR3-FUERA', 'in')
eh = estadoHandover(h)
assert.equal(eh.discrepancias.some((d) => d.motivo === 'PAQUETE_NO_ESPERADO'), true)
ok('paquete ajeno al encuentro → PAQUETE_NO_ESPERADO')

h = crearHandover(original, derivado)
h = escanearHandover(h, 'TR3-C', 'out')
h = escanearHandover(h, 'TR3-C', 'in', { lat: 18.4, lng: -66.0 })
eh = estadoHandover(h)
assert.equal(eh.completo, true)
ok('scan-out + scan-in → custodia transferida sin discrepancias')
h = cerrarHandover(h)
assert.equal(h.estado, 'CERRADO')
ok('handover cerrado')

console.log('\n== 8. Derivado completa la ruta → COMPLETADO ==')
let d = iniciarRuta(derivado)
d = registrarEntregaPorCodigo(d, 'TR3-C', { evidenciaUrl: 's3://pod/tr3-c.jpg', lat: 18.4, lng: -66.0 })
d = finalizarManifiesto(d)
assert.equal(d.estado, EM.COMPLETADO)
ok('derivado sin incidencias cierra COMPLETADO')

console.log('\n== 9. Cola offline de POD ==')
const storage = {
  _m: new Map(),
  getItem(k) { return this._m.has(k) ? this._m.get(k) : null },
  setItem(k, v) { this._m.set(k, String(v)) },
  removeItem(k) { this._m.delete(k) },
}
limpiar(storage)
encolar({ manifestId: 'm1', codigo: 'TR3-X', evidenciaUrl: 'data:image/jpeg;base64,..', lat: 1, lng: 2, via: 'QR' }, storage)
encolar({ manifestId: 'm1', codigo: 'TR3-Y', evidenciaUrl: 'data:image/jpeg;base64,..', via: 'MANUAL' }, storage)
assert.equal(listarPendientes(storage).length, 2)
ok('2 POD encolados sin conexión')

let llamadas = 0
const resultado = await sincronizar({
  storage,
  enviar: async (e) => { llamadas++; if (e.codigo === 'TR3-X') throw new Error('500 servidor') },
})
assert.equal(resultado.enviados, 1)
assert.equal(resultado.fallidos, 1)
assert.equal(resultado.pendientes, 1)
assert.equal(listarPendientes(storage)[0].intentos, 1)
ok('sync: éxito drena, error queda con intentos+1')

await sincronizar({ storage, enviar: async () => {} })
assert.equal(listarPendientes(storage).length, 0)
ok('reintento posterior vacía la cola')

console.log('\n== 10. Guardas de transición ==')
assert.deepEqual(accionesDisponibles(crearManifiesto({ codigo: 'x' })), ['asignar'])
assert.deepEqual(accionesDisponibles(d), [])
ok('acciones disponibles coherentes por estado')

console.log(`\n✔ ${passed} verificaciones pasaron\n`)
