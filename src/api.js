import { API_URL, SSO_URL } from './config/sso'

// -----------------------------------------------------------------------------
//  DOS bases, y no es un descuido: la migracion al SSO va por lotes
// -----------------------------------------------------------------------------
//  `API_URL` (config/sso.js) es EL GATEWAY: `http://localhost:8003/api/treslog`.
//  Todo lo que salga por ahi llega al backend con las cabeceras `X-User-*` ya
//  puestas por NGINX, y exige un Bearer del SSO valido.
//
//  `LEGACY_API_URL` es el backend de TR3SLOG directo, con `auth:sanctum`. Lo usa
//  TODO lo que todavia no esta montado detras del gateway. Hoy, detras del
//  gateway hay exactamente tres cosas (`routes/api.php` del backend): la
//  administracion de roles/permisos/zonas, las rutas del conductor, y `/me`. De
//  esas, la web solo usa `/me`.
//
//  ---- LO QUE ESTO SIGNIFICA HOY, DICHO SIN MAQUILLAJE -----------------------
//  Desde este lote la web entra con un token del SSO. Ese token NO LO ENTIENDE
//  `auth:sanctum`: cada llamada de dominio de esta lista (envios, cotizaciones,
//  direcciones, soporte, choferes, incidentes) responde 401 hasta que el Lote 8
//  monte esas rutas detras del gateway. No es un bug de este lote — es el orden
//  que eligio el plan (Lote 7 antes que 8) y esta anotado en 4-tasks.md.
//
//  ---- Y ALGO QUE EL LOTE 8 TODAVIA NO RESUELVE -----------------------------
//  Tres de estas llamadas son PUBLICAS y no llevan token: `contact`,
//  `createQuote` (`/app/quotes`) y `trackQuote`. Las usa cualquiera que entra a
//  la web sin cuenta. El gateway EXIGE Bearer y responde 401 antes de tocar el
//  backend (comprobado: `POST http://localhost:8003/api/treslog/contact` -> 401),
//  asi que estas tres NO PUEDEN pasar por ahi tal cual. 4-tasks.md §8.1 no las
//  distingue del resto del dominio; necesitan decision propia (ruta publica en el
//  gateway, o quedarse contra el backend directo).
//
//  `NEXT_PUBLIC_API_URL` se queda apuntando a lo de SIEMPRE (el backend legado) y
//  el gateway estrena `NEXT_PUBLIC_GATEWAY_URL`. El porque largo —con la
//  comprobacion sobre el bundle compilado— esta en src/config/sso.js.
export const LEGACY_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const API_BASE = LEGACY_API_URL.replace(/\/api\/?$/, '')
export const MEDIA_URL = `${API_BASE}/storage`

function headers(token) {
  const h = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function handle(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data.message || Object.values(data.errors || {}).flat().join(', ') || 'Error del servidor')

    // El sobre de error del SSO y del gateway es CERRADO:
    // `error`/`message`/`request_id`. Los tres viajan pegados al Error porque
    // quien lo atrapa necesita distinguir cosas que un texto no distingue: un 403
    // `forbidden` de `/me` significa "tu cuenta no esta habilitada en TR3SLOG" y
    // NO hay que reintentar ni volver al login; un 401 si. Y el `request_id` es lo
    // unico con lo que soporte encuentra la peticion en los tres logs.
    err.status = res.status
    err.slug = data.error || null
    err.requestId = data.request_id || null

    throw err
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  // -- Por el GATEWAY ------------------------------------------------------
  //  Reemplaza a `GET /api/user` (AuthController::me). Devuelve `{data:{...}}`
  //  con el id local, los roles `treslog:*` que emitio el SSO y `is_admin`.
  me: (token) => fetch(`${API_URL}/me`, {
    headers: headers(token),
  }).then(handle),

  // -- Contra el SSO, sin pasar por TR3SLOG --------------------------------
  //  Las siete claves del perfil de plataforma (`first_name`, `last_name`,
  //  `username`, `phone`, `bio`, `location`, `website`). CUALQUIER otra clave es
  //  422 con un mensaje que dice adonde va ese dato: `name` es de solo lectura
  //  (se deriva de first_name + last_name) y `company` no existe en el SSO.
  updateSsoProfile: (data, token) => fetch(`${SSO_URL}/api/v1/profile`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  // -- Contra el backend LEGADO (migran en el Lote 8) ----------------------
  updateUser: (id, data, token) => fetch(`${LEGACY_API_URL}/users/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  createQuote: (data) => fetch(`${LEGACY_API_URL}/app/quotes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  trackQuote: (code) => fetch(`${LEGACY_API_URL}/app/quotes/track/${encodeURIComponent(code)}`, {
    headers: headers(),
  }).then(handle),

  getQuotes: (token) => fetch(`${LEGACY_API_URL}/quotes`, {
    headers: headers(token),
  }).then(handle),

  getPendingQuotesCount: (token) => fetch(`${LEGACY_API_URL}/quotes/pending-count`, {
    headers: headers(token),
  }).then(handle),

  updateQuoteStatus: (id, status, token) => fetch(`${LEGACY_API_URL}/quotes/${id}/status`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handle),

  getDrivers: (token) => fetch(`${LEGACY_API_URL}/drivers`, {
    headers: headers(token),
  }).then(handle),

  getClients: (token) => fetch(`${LEGACY_API_URL}/users/clients`, {
    headers: headers(token),
  }).then(handle),

  createDriver: (data, token) => fetch(`${LEGACY_API_URL}/drivers`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  getIncidents: (token) => fetch(`${LEGACY_API_URL}/incidents`, {
    headers: headers(token),
  }).then(handle),

  createIncident: (data, token) => fetch(`${LEGACY_API_URL}/incidents`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  updateIncidentStatus: (id, status, token) => fetch(`${LEGACY_API_URL}/incidents/${id}/status`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handle),

  getShipments: (token) => fetch(`${LEGACY_API_URL}/shipments`, {
    headers: headers(token),
  }).then(handle),

  updateShipmentStatus: (id, status, token) => fetch(`${LEGACY_API_URL}/shipments/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handle),

  createShipment: (data, token) => fetch(`${LEGACY_API_URL}/shipments`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  getAddresses: (token) => fetch(`${LEGACY_API_URL}/addresses`, {
    headers: headers(token),
  }).then(handle),

  createAddress: (data, token) => fetch(`${LEGACY_API_URL}/addresses`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  updateAddress: (id, data, token) => fetch(`${LEGACY_API_URL}/addresses/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  deleteAddress: (id, token) => fetch(`${LEGACY_API_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  }).then(handle),

  contact: (data) => fetch(`${LEGACY_API_URL}/contact`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  createSupport: (data, token) => fetch(`${LEGACY_API_URL}/support`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),
}
