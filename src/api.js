const API_URL = process.env.NEXT_PUBLIC_API_URL
  || import.meta.env?.VITE_API_URL
  || 'http://localhost:8000/api'

const API_BASE = API_URL.replace(/\/api\/?$/, '')
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
    throw new Error(data.message || Object.values(data.errors || {}).flat().join(', ') || 'Error del servidor')
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  register: (data) => fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  login: (data) => fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  me: (token) => fetch(`${API_URL}/user`, {
    headers: headers(token),
  }).then(handle),

  updateUser: (id, data, token) => fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  logout: (token) => fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: headers(token),
  }).then(handle),

  forgot: (data) => fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  reset: (data) => fetch(`${API_URL}/reset-password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  createQuote: (data) => fetch(`${API_URL}/app/quotes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  trackQuote: (code) => fetch(`${API_URL}/app/quotes/track/${encodeURIComponent(code)}`, {
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

  getUsers: (token) => fetch(`${API_URL}/users`, {
    headers: headers(token),
  }).then(handle),

  updateUserStatus: (id, status, token) => fetch(`${API_URL}/users/${id}/status`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handle),

  getRoles: (token) => fetch(`${API_URL}/roles`, {
    headers: headers(token),
  }).then(handle),

  getPermissions: (token) => fetch(`${API_URL}/permissions`, {
    headers: headers(token),
  }).then(handle),

  createDriver: (formData, token) => {
    const h = { 'Accept': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    return fetch(`${API_URL}/drivers`, {
      method: 'POST',
      headers: h,
      body: formData,
    }).then(handle)
  },

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

  assignShipmentDriver: (id, driverId, token) => fetch(`${API_URL}/shipments/${id}/driver`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ driver_id: driverId || null }),
  }).then(handle),

  getShipmentRequests: (token, status) => fetch(`${API_URL}/shipments/requests/list${status ? `?status=${status}` : ''}`, {
    headers: headers(token),
  }).then(handle),

  getPendingShipmentRequestsCount: (token) => fetch(`${API_URL}/shipments/requests/pending-count`, {
    headers: headers(token),
  }).then(handle),

  updateShipmentRequest: (id, data, token) => fetch(`${API_URL}/shipments/requests/${id}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(data),
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

  contact: (data) => fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handle),

  createSupport: (data, token) => fetch(`${API_URL}/support`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  getAuditFiles: (token) => fetch(`${API_URL}/audit-files`, {
    headers: headers(token),
  }).then(handle),

  uploadAuditFile: (formData, token) => {
    const h = { 'Accept': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    return fetch(`${API_URL}/audit-files`, {
      method: 'POST',
      headers: h,
      body: formData,
    }).then(handle)
  },

  deleteAuditFile: (id, token) => fetch(`${API_URL}/audit-files/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  }).then(handle),

  getPricingConfig: (token) => fetch(`${API_URL}/pricing-config`, {
    headers: headers(token),
  }).then(handle),

  updatePricingConfig: (data, token) => fetch(`${API_URL}/pricing-config`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handle),

  getFinanceOverview: (token) => fetch(`${API_URL}/finance/overview`, {
    headers: headers(token),
  }).then(handle),

  /* ---- Manifiestos — mesa de operaciones (Gestión de Manifiestos) ---- */

  getManifests: (token, status) => fetch(`${API_URL}/manifests${status ? `?status=${status}` : ''}`, {
    headers: headers(token),
  }).then(handle),

  getManifest: (id, token) => fetch(`${API_URL}/manifests/${id}`, {
    headers: headers(token),
  }).then(handle),

  createManifest: (data, token) => fetch(`${API_URL}/manifests`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data), // { codigo?, stops: [{tracking_code, shipment_id?}] }
  }).then(handle),

  /* Asignar chofer + vehículo (CREADO → ASIGNADO). */
  assignManifest: (id, data, token) => fetch(`${API_URL}/manifests/${id}/assignment`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(data), // { driver_id, vehicle_id }
  }).then(handle),

  /* Traspasos */
  getTransferRequests: (token, status) => fetch(`${API_URL}/transfer-requests${status ? `?status=${status}` : ''}`, {
    headers: headers(token),
  }).then(handle),

  /* Operaciones aprueba o rechaza (rechazo: manifiesto vuelve a EN_RUTA). */
  resolveTransferRequest: (id, data, token) => fetch(`${API_URL}/transfer-requests/${id}/resolve`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data), // { approve, replacement_driver_id, replacement_vehicle_id, reject_reason }
  }).then(handle),

  /* ---- Manifiestos — Driver App (/driver/*) ---- */

  getDriverManifests: (token) => fetch(`${API_URL}/driver/manifests`, {
    headers: headers(token),
  }).then(handle),

  getDriverManifest: (id, token) => fetch(`${API_URL}/driver/manifests/${id}`, {
    headers: headers(token),
  }).then(handle),

  /* Chofer acepta o rechaza la asignación (rechazo: ASIGNADO → CREADO). */
  respondManifestAssignment: (id, accept, reason, token) => fetch(`${API_URL}/driver/manifests/${id}/assignment-response`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ accept, reason }),
  }).then(handle),

  startManifestRoute: (id, token) => fetch(`${API_URL}/driver/manifests/${id}/start`, {
    method: 'POST',
    headers: headers(token),
  }).then(handle),

  finalizeManifest: (id, token) => fetch(`${API_URL}/driver/manifests/${id}/finalize`, {
    method: 'POST',
    headers: headers(token),
  }).then(handle),

  /* POD: entrega exitosa por QR o ingreso manual (via: 'QR' | 'MANUAL').
     `data` puede ser JSON o FormData con archivo `evidence`. */
  registerManifestDelivery: (id, data, token) => {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData
    const h = { 'Accept': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    if (!isForm) h['Content-Type'] = 'application/json'
    return fetch(`${API_URL}/driver/manifests/${id}/deliveries`, {
      method: 'POST',
      headers: h,
      body: isForm ? data : JSON.stringify(data), // { detail_id?, code, via, evidence_url|foto_data_url, lat, lng, gps_accuracy, strict }
    }).then(handle)
  },

  /* Incidencia de entrega: motivo obligatorio (NO_ENTREGADO). */
  registerManifestFailure: (id, data, token) => fetch(`${API_URL}/driver/manifests/${id}/failures`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data), // { detail_id, reason, lat, lng }
  }).then(handle),

  /* Solicitud de traspaso (selección parcial vía detail_ids). */
  createTransferRequest: (manifestId, data, token) => fetch(`${API_URL}/driver/manifests/${manifestId}/transfer-requests`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data), // { reason, detail_ids }
  }).then(handle),

  /* El chofer confirma que llegó la asistencia vial tras un rechazo. */
  resolveManifestAssistance: (id, token) => fetch(`${API_URL}/driver/manifests/${id}/assistance-resolved`, {
    method: 'POST',
    headers: headers(token),
  }).then(handle),

  /* Handover físico (doble escaneo en punto de avería). */
  getHandoverStatus: (derivadoId, token) => fetch(`${API_URL}/driver/manifests/${derivadoId}/handover`, {
    headers: headers(token),
  }).then(handle),

  scanHandover: (derivadoId, data, token) => fetch(`${API_URL}/driver/manifests/${derivadoId}/handover/scan`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data), // { code, phase: 'out' | 'in', lat, lng }
  }).then(handle),

  closeHandover: (derivadoId, token) => fetch(`${API_URL}/driver/manifests/${derivadoId}/handover/close`, {
    method: 'POST',
    headers: headers(token),
  }).then(handle),
}
