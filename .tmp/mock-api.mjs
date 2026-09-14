import { createServer } from 'http'

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

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...corsHeaders })
  res.end(JSON.stringify(data))
}

const server = createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders)
    res.end()
    return
  }

  const url = req.url
  let body = ''
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => {
    const parsed = body ? JSON.parse(body) : {}

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
      return send(res, 200, [])
    }

    if (url === '/api/incidents' && req.method === 'GET') {
      return send(res, 200, [])
    }

    if (url === '/api/addresses' && req.method === 'GET') {
      return send(res, 200, [])
    }

    send(res, 404, { message: 'Not found' })
  })
})

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`)
})
