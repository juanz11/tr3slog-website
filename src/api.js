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

  getDrivers: (token) => fetch(`${API_URL}/drivers`, {
    headers: headers(token),
  }).then(handle),

  getIncidents: (token) => fetch(`${API_URL}/incidents`, {
    headers: headers(token),
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
}
