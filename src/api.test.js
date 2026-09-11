import { test } from 'node:test'
import assert from 'node:assert/strict'

// -----------------------------------------------------------------------------
//  Cada funcion de api.js apunta a la base correcta (Lote 8)
// -----------------------------------------------------------------------------
//  Tres bases y una tabla cerrada. El gateway solo sirve lo que el backend monta
//  bajo /api/treslog (routes/domain.php); una funcion que apunte al gateway sin
//  ruta detras es un 404 garantizado, y una que apunte al backend directo con
//  identidad es un 401 para siempre (el backend no valida tokens del SSO).
//
//  `fetch` se reemplaza por una captura: no hay red, solo se mira ADONDE iria.

const { api, PUBLIC_API_URL } = await import('./api.js')
const { API_URL, SSO_URL } = await import('./config/sso.js')

const GATEWAY = API_URL
const PUBLICO = PUBLIC_API_URL
const SSO = SSO_URL

// funcion -> [base esperada, argumentos con los que se la llama]
const TABLA = {
  me:                  [GATEWAY, ['tok']],
  updateSsoProfile:    [SSO, [{ phone: '1' }, 'tok']],
  updateUser:          [GATEWAY, [7, { company: 'X' }, 'tok']],
  getQuotes:           [GATEWAY, ['tok']],
  getPendingQuotesCount: [GATEWAY, ['tok']],
  updateQuoteStatus:   [GATEWAY, [3, 'approved', 'tok']],
  getDrivers:          [GATEWAY, ['tok']],
  getClients:          [GATEWAY, ['tok']],
  createDriver:        [GATEWAY, [{ name: 'D' }, 'tok']],
  getIncidents:        [GATEWAY, ['tok']],
  createIncident:      [GATEWAY, [{ title: 'I' }, 'tok']],
  updateIncidentStatus: [GATEWAY, [2, 'Closed', 'tok']],
  getShipments:        [GATEWAY, ['tok']],
  updateShipmentStatus: [GATEWAY, [5, 'delivered', 'tok']],
  createShipment:      [GATEWAY, [{ origin: 'A' }, 'tok']],
  getAddresses:        [GATEWAY, ['tok']],
  createAddress:       [GATEWAY, [{ address: 'C' }, 'tok']],
  updateAddress:       [GATEWAY, [9, { address: 'C' }, 'tok']],
  deleteAddress:       [GATEWAY, [9, 'tok']],
  createSupport:       [GATEWAY, [{ subject: 'S' }, 'tok']],
  // Sin identidad: backend directo (D8.1)
  contact:             [PUBLICO, [{ name: 'N' }]],
  createQuote:         [PUBLICO, [{ origin: 'A' }]],
  trackQuote:          [PUBLICO, ['TR3S-1']],
}

function capturar() {
  const llamadas = []
  globalThis.fetch = async (url, opts = {}) => {
    llamadas.push({ url: String(url), opts })
    return { ok: true, status: 200, json: async () => ({}) }
  }
  return llamadas
}

test('la tabla cubre TODAS las funciones de api (una nueva sin clasificar falla aca)', () => {
  const enApi = Object.keys(api).sort()
  const enTabla = Object.keys(TABLA).sort()
  assert.deepEqual(enApi, enTabla)
})

for (const [nombre, [base, args]] of Object.entries(TABLA)) {
  test(`api.${nombre} apunta a ${base === GATEWAY ? 'el gateway' : base === SSO ? 'el SSO' : 'el backend publico'}`, async () => {
    const llamadas = capturar()
    await api[nombre](...args)
    assert.equal(llamadas.length, 1, 'una sola peticion')
    assert.ok(llamadas[0].url.startsWith(base + '/'), `${llamadas[0].url} no empieza con ${base}/`)
  })
}

test('las publicas no mandan Authorization, y las del gateway si', async () => {
  const llamadas = capturar()
  await api.contact({ name: 'N' })
  await api.createQuote({ origin: 'A' })
  await api.trackQuote('TR3S-1')
  for (const l of llamadas) assert.equal(l.opts.headers?.Authorization, undefined, `${l.url} lleva Bearer sin necesitarlo`)

  const conToken = capturar()
  await api.getShipments('tok')
  assert.equal(conToken[0].opts.headers.Authorization, 'Bearer tok')
})

test('la base del gateway termina en /api/treslog: es el prefijo que el backend monta (H2)', () => {
  assert.match(GATEWAY, /\/api\/treslog$/)
  assert.doesNotMatch(PUBLICO, /treslog/)
})
