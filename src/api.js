const API_URL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL)
  || import.meta.env?.VITE_API_URL
  || 'http://localhost:8000/api'

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

  logout: (token) => fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: headers(token),
  }).then(handle),
}
