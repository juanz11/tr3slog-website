// Con extension, como src/lib/sso.js: `node --test` importa este modulo sin
// pasar por webpack y Node no adivina extensiones en ESM.
import { API_URL, SSO_URL } from './config/sso.js'

// -----------------------------------------------------------------------------
//  DOS bases, y las dos son deliberadas (Lote 8)
// -----------------------------------------------------------------------------
//  `API_URL` (config/sso.js) es EL GATEWAY: `http://localhost:8003/api/treslog`.
//  Todo lo que salga por ahi llega al backend con las cabeceras `X-User-*` ya
//  puestas por NGINX, y exige un Bearer del SSO valido. Desde el Lote 8 TODO el
//  dominio con identidad va por aca: envios, cotizaciones de la consola,
//  direcciones, soporte, choferes, incidentes, usuarios (routes/domain.php del
//  backend, montado bajo `/api/treslog`).
//
//  `PUBLIC_API_URL` es el backend de TR3SLOG DIRECTO, y se queda para lo que NO
//  lleva identidad: el formulario de contacto, cotizar sin cuenta y seguir un
//  envio por codigo (D8.1). El gateway exige Bearer y responde 401 antes de
//  tocar el backend (comprobado: `POST .../api/treslog/contact` -> 401), asi que
//  esas tres no pueden pasar por ahi, y no tienen por que: no hay nadie a quien
//  identificar. Tambien sirve los archivos de `storage` (MEDIA_URL), que el
//  gateway no proxya.
//
//  Se llama PUBLIC y no LEGACY a proposito: cuando el bloque `auth:sanctum` del
//  backend muera (Lote 9), estas rutas siguen vivas. Un nombre que dice "legado"
//  invita a borrarlas junto con lo que si se retira.
//
//  `NEXT_PUBLIC_API_URL` sigue significando lo de SIEMPRE (el backend directo) y
//  el gateway usa `NEXT_PUBLIC_GATEWAY_URL`. El porque largo —con la comprobacion
//  sobre el bundle compilado— esta en src/config/sso.js.
export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const API_BASE = PUBLIC_API_URL.replace(/\/api\/?$/, '')
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

  // -- Por el GATEWAY: el dominio con identidad (Lote 8, routes/domain.php) --
  updateUser: (id, data, token) => fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  // -- Sin identidad: backend DIRECTO (D8.1). Cotizar y seguir un envio no
  //    piden cuenta; el gateway exigiria un Bearer que no existe.
  createQuote: (data) => fetch(`${PUBLIC_API_URL}/app/quotes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  trackQuote: (code) => fetch(`${PUBLIC_API_URL}/app/quotes/track/${encodeURIComponent(code)}`, {
    headers: headers(),
  }).then(handle),

  getQuotes: (token) => fetch(`${API_URL}/quotes`, {
    headers: headers(token),
  }).then(handle),

  getPendingQuotesCount: (token) => fetch(`${API_URL}/quotes/pending-count`, {
    headers: headers(token),
  }).then(handle),

  updateQuoteStatus: (id, status, token) => fetch(`${API_URL}/quotes/${id}/status`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handle),

  getDrivers: (token) => fetch(`${API_URL}/drivers`, {
    headers: headers(token),
  }).then(handle),

  getClients: (token) => fetch(`${API_URL}/users/clients`, {
    headers: headers(token),
  }).then(handle),

  createDriver: (data, token) => fetch(`${API_URL}/drivers`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  getIncidents: (token) => fetch(`${API_URL}/incidents`, {
    headers: headers(token),
  }).then(handle),

  createIncident: (data, token) => fetch(`${API_URL}/incidents`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  updateIncidentStatus: (id, status, token) => fetch(`${API_URL}/incidents/${id}/status`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handle),

  getShipments: (token) => fetch(`${API_URL}/shipments`, {
    headers: headers(token),
  }).then(handle),

  updateShipmentStatus: (id, status, token) => fetch(`${API_URL}/shipments/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handle),

  createShipment: (data, token) => fetch(`${API_URL}/shipments`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  getAddresses: (token) => fetch(`${API_URL}/addresses`, {
    headers: headers(token),
  }).then(handle),

  createAddress: (data, token) => fetch(`${API_URL}/addresses`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  updateAddress: (id, data, token) => fetch(`${API_URL}/addresses/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  deleteAddress: (id, token) => fetch(`${API_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  }).then(handle),

  // Sin identidad: backend DIRECTO (D8.1), igual que cotizar.
  contact: (data) => fetch(`${PUBLIC_API_URL}/contact`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  createSupport: (data, token) => fetch(`${API_URL}/support`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),
}
