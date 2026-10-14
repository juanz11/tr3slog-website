import { createServer } from 'http'
import {
  ESTADO_MANIFIESTO as EM,
  crearManifiesto, asignar, rechazarAsignacion, iniciarRuta,
  registrarEntregaPorCodigo, registrarEntrega, registrarFallo,
  solicitarTraspaso, aprobarTraspaso, rechazarTraspaso,
  finalizarManifiesto, crearHandover, escanearHandover,
  cerrarHandover, estadoHandover, calcularProgreso,
  ManifestError,
} from '../src/lib/manifestFlow.js'

const PORT = 8000

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const operationsUser = {
  id: 99,
  name: 'Operador Demo',
  email: 'ops@tr3slog.com',
  roles: [{ name: 'operations' }],
}

const shipments = [
  {
    id: 1001,
    tracking_number: 'TR3-TEST-001',
    origin: 'San Juan',
    destination: 'Miami',
    service_type: 'Estandar',
    status: 5,
    recipient_name: 'Juan Pérez',
    eta: '2026-09-15',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-10T12:00:00Z',
  },
  {
    id: 1002,
    tracking_number: 'TR3-TEST-002',
    origin: 'Miami',
    destination: 'San Juan',
    service_type: 'Express',
    status: 'delivered',
    recipient_name: 'Ana López',
    eta: '2026-09-09',
    created_at: '2026-09-08T10:00:00Z',
    updated_at: '2026-09-09T14:00:00Z',
  },
]

/* ------------------------------------------------------------------ */
/* Store en memoria: manifiestos + handovers                           */
/* ------------------------------------------------------------------ */

const TRACKING_SEED = [
  'TR3-260729-PRSJ-00131', 'TR3-260729-PRSJ-00136', 'TR3-260729-PRSJ-00139',
  'TR3-260729-PRSJ-00142', 'TR3-260729-PRSJ-00147', 'TR3-260729-PRSJ-00153',
]

let seqMan = 1
const manifests = new Map()
const handovers = new Map() // derivadoId -> handover

const seedManifest = crearManifiesto({
  id: 'man-seed-1',
  codigo: 'MAN-RT-2607-A-v1',
  creadoPor: operationsUser.id,
  pedidos: TRACKING_SEED.map((t, i) => ({ pedidoId: `ped-${i + 1}`, codigoSeguimiento: t })),
})
manifests.set(seedManifest.id, seedManifest)

const manifestJson = (m) => ({
  ...m,
  progreso: calcularProgreso(m),
  handover: handovers.has(m.id) ? estadoHandover(handovers.get(m.id)) : undefined,
})

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...corsHeaders })
  res.end(JSON.stringify(data))
}

const sendErr = (res, e) =>
  send(res, e instanceof ManifestError ? 422 : 500, { message: e.message, code: e.code || 'ERROR' })

const findManifest = (id) => manifests.get(id)

/* Solicitudes de traspaso aplanadas para la mesa de operaciones. */
function allTransferRequests(status) {
  const out = []
  for (const m of manifests.values()) {
    for (const s of m.solicitudes) {
      out.push({
        ...s,
        manifiestoId: m.id,
        manifiestoCodigo: m.codigo,
        choferId: m.choferId,
        itemsDetalle: m.detalles.filter((d) => s.items.includes(d.id)),
      })
    }
  }
  return status ? out.filter((s) => s.estado === status) : out
}

function findRequest(id) {
  for (const m of manifests.values()) {
    const s = m.solicitudes.find((x) => x.id === id)
    if (s) return { manifiesto: m, solicitud: s }
  }
  return null
}

const match = (url, pattern) => {
  const m = url.match(pattern)
  return m ? m : null
}

const server = createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders)
    res.end()
    return
  }

  const url = req.url.split('?')[0]
  const query = new URLSearchParams(req.url.includes('?') ? req.url.split('?')[1] : '')
  let body = ''
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => {
    const parsed = body ? JSON.parse(body) : {}
    try {
      if (url === '/api/login' && req.method === 'POST') {
        return send(res, 200, { user: operationsUser, token: 'demo-token-ops' })
      }

      if (url === '/api/user' && req.method === 'GET') {
        return send(res, 200, { user: operationsUser })
      }

      if (url === '/api/logout' && req.method === 'POST') {
        return send(res, 204, null)
      }

      if (url === '/api/shipments' && req.method === 'GET') {
        return send(res, 200, shipments)
      }

      if (url.startsWith('/api/shipments/') && req.method === 'PUT') {
        return send(res, 200, parsed)
      }

      if (url === '/api/quotes/pending-count' && req.method === 'GET') {
        return send(res, 200, { count: 0 })
      }

      if (url === '/api/quotes' && req.method === 'GET') {
        return send(res, 200, [])
      }

      if (url === '/api/drivers' && req.method === 'GET') {
        return send(res, 200, [
          { id: 'drv-1', user_id: 'drv-1', name: 'E. Rivera', vehicle: 'Van 04', status: 'route' },
          { id: 'drv-2', user_id: 'drv-2', name: 'A. Bello', vehicle: 'Van 07', status: 'available' },
        ])
      }

      if (url === '/api/incidents' && req.method === 'GET') {
        return send(res, 200, [])
      }

      if (url === '/api/addresses' && req.method === 'GET') {
        return send(res, 200, [])
      }

      /* ------------------------- Manifiestos ------------------------- */

      if (url === '/api/manifests' && req.method === 'GET') {
        const status = query.get('status')
        const list = [...manifests.values()].filter((m) => !status || m.estado === status)
        return send(res, 200, list.map(manifestJson))
      }

      if (url === '/api/manifests' && req.method === 'POST') {
        const m = crearManifiesto({
          codigo: parsed.codigo || `MAN-${Date.now().toString(36).toUpperCase()}`,
          creadoPor: operationsUser.id,
          pedidos: parsed.pedidos || [],
        })
        manifests.set(m.id, m)
        return send(res, 201, manifestJson(m))
      }

      let m
      if ((m = match(url, /^\/api\/manifests\/([^/]+)$/)) && req.method === 'GET') {
        const man = findManifest(m[1])
        return man ? send(res, 200, manifestJson(man)) : send(res, 404, { message: 'Not found' })
      }

      if (url === '/api/driver/manifests' && req.method === 'GET') {
        return send(res, 200, [...manifests.values()].map(manifestJson))
      }

      if ((m = match(url, /^\/api\/manifests\/([^/]+)\/assignment$/)) && req.method === 'PATCH') {
        const man = findManifest(m[1])
        if (!man) return send(res, 404, { message: 'Not found' })
        const upd = asignar(man, { choferId: parsed.driver_id, vehiculoId: parsed.vehicle_id })
        manifests.set(upd.id, upd)
        return send(res, 200, manifestJson(upd))
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/assignment-response$/)) && req.method === 'POST') {
        const man = findManifest(m[1])
        if (!man) return send(res, 404, { message: 'Not found' })
        if (parsed.accept) return send(res, 200, manifestJson(man)) // ya está ASIGNADO
        const upd = rechazarAsignacion(man, { motivo: parsed.reason })
        manifests.set(upd.id, upd)
        return send(res, 200, manifestJson(upd))
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/start$/)) && req.method === 'POST') {
        const man = findManifest(m[1])
        if (!man) return send(res, 404, { message: 'Not found' })
        const upd = iniciarRuta(man)
        manifests.set(upd.id, upd)
        return send(res, 200, manifestJson(upd))
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/finalize$/)) && req.method === 'POST') {
        const man = findManifest(m[1])
        if (!man) return send(res, 404, { message: 'Not found' })
        const upd = finalizarManifiesto(man)
        manifests.set(upd.id, upd)
        return send(res, 200, manifestJson(upd))
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/deliveries$/)) && req.method === 'POST') {
        const man = findManifest(m[1])
        if (!man) return send(res, 404, { message: 'Not found' })
        const meta = {
          evidenciaUrl: parsed.evidence_url || parsed.foto_data_url,
          lat: parsed.lat, lng: parsed.lng,
          gpsPrecision: parsed.gps_precision,
          horaVisita: parsed.visited_at,
          via: parsed.via || 'QR',
        }
        const upd = parsed.detail_id
          ? registrarEntrega(man, parsed.detail_id, meta)
          : registrarEntregaPorCodigo(man, parsed.code, { ...meta, estricto: parsed.strict !== false })
        manifests.set(upd.id, upd)
        return send(res, 200, manifestJson(upd))
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/failures$/)) && req.method === 'POST') {
        const man = findManifest(m[1])
        if (!man) return send(res, 404, { message: 'Not found' })
        const upd = registrarFallo(man, parsed.detail_id, {
          motivo: parsed.reason, lat: parsed.lat, lng: parsed.lng,
        })
        manifests.set(upd.id, upd)
        return send(res, 200, manifestJson(upd))
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/transfer-requests$/)) && req.method === 'POST') {
        const man = findManifest(m[1])
        if (!man) return send(res, 404, { message: 'Not found' })
        const { manifiesto: upd, solicitud } = solicitarTraspaso(man, {
          motivo: parsed.reason,
          detalleIds: parsed.detail_ids,
        })
        manifests.set(upd.id, upd)
        return send(res, 201, { solicitud, manifiesto: manifestJson(upd) })
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/handover\/scan$/)) && req.method === 'POST') {
        const der = findManifest(m[1])
        if (!der || !handovers.has(der.id)) return send(res, 404, { message: 'Handover no encontrado' })
        const h = escanearHandover(handovers.get(der.id), parsed.code, parsed.phase, { lat: parsed.lat, lng: parsed.lng })
        handovers.set(der.id, h)
        return send(res, 200, estadoHandover(h))
      }

      if ((m = match(url, /^\/api\/driver\/manifests\/([^/]+)\/handover\/close$/)) && req.method === 'POST') {
        const der = findManifest(m[1])
        if (!der || !handovers.has(der.id)) return send(res, 404, { message: 'Handover no encontrado' })
        const h = cerrarHandover(handovers.get(der.id))
        handovers.set(der.id, h)
        return send(res, 200, { handover: h, resumen: estadoHandover(h) })
      }

      /* ------------------------- Traspasos --------------------------- */

      if (url === '/api/transfer-requests' && req.method === 'GET') {
        return send(res, 200, allTransferRequests(query.get('status')))
      }

      if ((m = match(url, /^\/api\/transfer-requests\/([^/]+)\/resolve$/)) && req.method === 'POST') {
        const found = findRequest(m[1])
        if (!found) return send(res, 404, { message: 'Not found' })
        if (parsed.approve) {
          const { original, derivado } = aprobarTraspaso(found.manifiesto, found.solicitud.id, {
            revisadoPor: operationsUser.id,
            choferId: parsed.replacement_driver_id || 'drv-2',
            vehiculoId: parsed.replacement_vehicle_id,
          })
          manifests.set(original.id, original)
          manifests.set(derivado.id, derivado)
          handovers.set(derivado.id, crearHandover(original, derivado))
          return send(res, 200, { original: manifestJson(original), derivado: manifestJson(derivado) })
        }
        const upd = rechazarTraspaso(found.manifiesto, found.solicitud.id, {
          revisadoPor: operationsUser.id,
          motivo: parsed.reject_reason,
        })
        manifests.set(upd.id, upd)
        return send(res, 200, manifestJson(upd))
      }

      send(res, 404, { message: 'Not found' })
    } catch (e) {
      sendErr(res, e)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`)
  console.log(`Estados de manifiesto: ${Object.values(EM).join(' | ')}`)
})
