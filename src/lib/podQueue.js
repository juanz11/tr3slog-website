/**
 * podQueue.js — Cola offline de pruebas de entrega (POD).
 *
 * Si el chofer pierde señal, la entrega queda encolada en localStorage con
 * su evidencia y metadatos GPS/hora; al volver la conexión se sincroniza en
 * orden (FIFO) contra la API. Pensado para la Driver App / portal móvil.
 */

const KEY = 'tr3slog.podQueue.v1'

/* Fallback en memoria para entornos sin localStorage (tests, SSR). */
const memStore = (() => {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  }
})()

function store(storage) {
  if (storage) return storage
  try {
    if (typeof localStorage !== 'undefined') return localStorage
  } catch (e) { /* modo privado, etc. */ }
  return memStore
}

function leer(storage) {
  try {
    const raw = store(storage).getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    return []
  }
}

function escribir(items, storage) {
  store(storage).setItem(KEY, JSON.stringify(items))
}

/** Entradas pendientes de sincronizar, en orden de captura. */
export function listarPendientes(storage) {
  return leer(storage)
}

/**
 * Encola un POD capturado sin conexión.
 * entry: { manifestId, detalleId?, codigo, via, evidenciaUrl|fotoDataUrl,
 *          lat, lng, gpsPrecision, horaVisita, motivoFallo? }
 * Devuelve la entrada con id y metadata de cola.
 */
export function encolar(entry, storage) {
  const items = leer(storage)
  const queued = {
    id: entry.id || `pod-${Date.now().toString(36)}-${items.length}`,
    enColaDesde: new Date().toISOString(),
    intentos: 0,
    ultimoError: null,
    ...entry,
  }
  escribir([...items, queued], storage)
  return queued
}

export function quitar(id, storage) {
  escribir(leer(storage).filter((i) => i.id !== id), storage)
}

export function limpiar(storage) {
  store(storage).removeItem(KEY)
}

export function hayConexion() {
  return typeof navigator === 'undefined' ? true : navigator.onLine !== false
}

/**
 * Drena la cola contra la API.
 * `enviar(entry)` debe resolver si el servidor aceptó el POD y rechazar si no.
 * Las entradas que fallen permanecen con `intentos` incrementado y
 * `ultimoError`; un error de red detiene el drenado (se reintentará luego).
 * Devuelve { enviados, fallidos, pendientes }.
 */
export async function sincronizar({ enviar, storage, alFallar } = {}) {
  if (typeof enviar !== 'function') throw new Error('sincronizar requiere enviar(entry)')
  const resultado = { enviados: 0, fallidos: 0, pendientes: 0 }
  for (const entry of leer(storage)) {
    try {
      await enviar(entry)
      quitar(entry.id, storage)
      resultado.enviados++
    } catch (e) {
      const items = leer(storage).map((i) =>
        i.id === entry.id
          ? { ...i, intentos: i.intentos + 1, ultimoError: e && e.message ? e.message : String(e) }
          : i
      )
      escribir(items, storage)
      resultado.fallidos++
      alFallar && alFallar(entry, e)
      if (!hayConexion()) break // sin señal: no seguir intentando
    }
  }
  resultado.pendientes = leer(storage).length
  return resultado
}

/**
 * Registra sincronización automática al recuperar conexión.
 * Devuelve función cleanup para quitar el listener.
 */
export function alVolverOnline(sincronizarFn) {
  if (typeof window === 'undefined' || !window.addEventListener) return () => {}
  const handler = () => sincronizarFn()
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}

/**
 * Captura GPS del dispositivo (Geolocation API).
 * Devuelve { lat, lng, gpsPrecision } o null si no está disponible/rechazado.
 */
export function capturarGps({ timeout = 8000, enableHighAccuracy = true } = {}) {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve(null)
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        gpsPrecision: pos.coords.accuracy,
      }),
      () => resolve(null),
      { timeout, enableHighAccuracy, maximumAge: 15000 }
    )
  })
}
