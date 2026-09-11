// -----------------------------------------------------------------------------
//  Tests de PKCE, con `node --test`: sin navegador, sin jsdom, sin dependencias
// -----------------------------------------------------------------------------
//  Se puede porque src/lib/sso.js no importa React ni toca el DOM: `crypto.subtle`
//  y `fetch` son globales en Node desde la 18, y son LOS MISMOS del navegador
//  (WebCrypto y la Fetch API estandar). El unico invento son `sessionStorage` y
//  `localStorage`, que Node no tiene.
//
//  Las variables de ambiente se fijan ANTES del import a proposito: config/sso.js
//  las lee una sola vez, al cargarse. Asi las aserciones dicen valores exactos en
//  vez de compararse contra si mismas. Los valores por defecto —los que hacen que
//  la demo local ande sin tocar nada— los cubre src/config/sso.test.js, que corre
//  en otro proceso justamente para poder no fijarlas.

import test from 'node:test'
import assert from 'node:assert/strict'

process.env.NEXT_PUBLIC_SSO_URL = 'https://sso.test'
process.env.NEXT_PUBLIC_SSO_CLIENT_ID = 'cliente-de-prueba'
process.env.NEXT_PUBLIC_SSO_REDIRECT_URI = 'https://web.test/login/sso/callback'
process.env.NEXT_PUBLIC_GATEWAY_URL = 'https://gw.test/api/treslog'

const sso = await import('./sso.js')

/** Un `sessionStorage`/`localStorage` de juguete, que es todo lo que hace falta. */
function almacenFalso() {
  const datos = new Map()

  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: (k) => datos.delete(k),
    get tamaño() { return datos.size },
  }
}

function conAlmacenes() {
  const sesion = almacenFalso()
  const local = almacenFalso()
  globalThis.sessionStorage = sesion
  globalThis.localStorage = local

  return { sesion, local }
}

// =============================================================================
//  El challenge: el vector de prueba del propio RFC 7636
// =============================================================================

/**
 * Apendice B de RFC 7636. Es EL ejemplo canonico del estandar, y por eso vale
 * mucho mas que un valor que hubiera calculado yo mismo con la misma funcion que
 * estoy probando: si `derivarChallenge` tuviera el bug de dejar el padding `=`, o
 * de usar base64 comun (con `+` y `/`), o de hashear los bytes equivocados, este
 * assert se pone rojo. Un valor auto-generado no agarraria ninguno de los tres.
 */
test('derivarChallenge reproduce el vector de prueba de RFC 7636', async () => {
  const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'

  assert.equal(
    await sso.derivarChallenge(verifier),
    'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
  )
})

test('el challenge no lleva padding ni caracteres fuera de base64url', async () => {
  const challenge = await sso.derivarChallenge(sso.generarVerifier())

  assert.match(challenge, /^[A-Za-z0-9_-]{43}$/)
})

test('generarVerifier cumple la longitud minima de RFC 7636 y no se repite', () => {
  const a = sso.generarVerifier()
  const b = sso.generarVerifier()

  // 43-128 caracteres del juego `[A-Za-z0-9-._~]`. Con menos, el SSO responde 400
  // `invalid_request` con el hint "Code challenge must follow the specifications
  // of RFC-7636" — comprobado contra el SSO local.
  assert.match(a, /^[A-Za-z0-9_-]{43,128}$/)
  assert.notEqual(a, b, 'Dos verifiers iguales significan que no hay aleatoriedad.')
})

// =============================================================================
//  La URL de authorize: los siete parametros, exactos
// =============================================================================

test('construirUrlAuthorize manda los siete parametros que el SSO espera', async () => {
  const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
  const url = new URL(await sso.construirUrlAuthorize({ verifier, state: 'estado-123' }))

  assert.equal(url.origin + url.pathname, 'https://sso.test/oauth/authorize')
  assert.equal(url.searchParams.get('client_id'), 'cliente-de-prueba')
  assert.equal(url.searchParams.get('redirect_uri'), 'https://web.test/login/sso/callback')
  assert.equal(url.searchParams.get('response_type'), 'code')
  assert.equal(url.searchParams.get('scope'), '')
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
  assert.equal(url.searchParams.get('state'), 'estado-123')

  // Va el HASH, nunca el verifier: mandarlo seria tirar por la borda todo PKCE.
  assert.equal(url.searchParams.get('code_challenge'), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
  assert.ok(!url.search.includes(verifier), 'El verifier viajo en la URL de authorize.')
})

// =============================================================================
//  El canje: form-urlencoded, con verifier y sin secreto
// =============================================================================

test('canjearCodigo hace POST form-urlencoded con grant_type y code_verifier', async () => {
  let pedido = null
  globalThis.fetch = async (url, opciones) => {
    pedido = { url, opciones }
    return new Response(JSON.stringify({ access_token: 'tok-123', token_type: 'Bearer' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const token = await sso.canjearCodigo({ code: 'cod-abc', verifier: 'ver-xyz' })

  assert.equal(token.access_token, 'tok-123')
  assert.equal(pedido.url, 'https://sso.test/oauth/token')
  assert.equal(pedido.opciones.method, 'POST')
  assert.equal(pedido.opciones.headers['Content-Type'], 'application/x-www-form-urlencoded')

  const cuerpo = new URLSearchParams(pedido.opciones.body)
  assert.equal(cuerpo.get('grant_type'), 'authorization_code')
  assert.equal(cuerpo.get('code_verifier'), 'ver-xyz')
  assert.equal(cuerpo.get('code'), 'cod-abc')
  assert.equal(cuerpo.get('client_id'), 'cliente-de-prueba')
  assert.equal(cuerpo.get('redirect_uri'), 'https://web.test/login/sso/callback')

  // Cliente PUBLICO: si algun dia aparece un secreto aca, esta publicado.
  assert.equal(cuerpo.get('client_secret'), null)
})

test('canjearCodigo levanta el `hint` del error de OAuth, que es el unico util', async () => {
  globalThis.fetch = async () => new Response(
    JSON.stringify({
      error: 'invalid_request',
      error_description: 'The request is missing a required parameter...',
      hint: 'Code challenge must follow the specifications of RFC-7636.',
    }),
    { status: 400, headers: { 'Content-Type': 'application/json' } },
  )

  await assert.rejects(
    () => sso.canjearCodigo({ code: 'c', verifier: 'v' }),
    /RFC-7636/,
  )
})

// =============================================================================
//  El pendiente: de un solo uso
// =============================================================================

test('leerPendiente devuelve el par y lo BORRA', () => {
  const { sesion } = conAlmacenes()

  sso.guardarPendiente({ verifier: 'v1', state: 's1' })
  assert.deepEqual(sso.leerPendiente(), { verifier: 'v1', state: 's1' })

  // El segundo intento no encuentra nada: un verifier que sobrevive al canje se
  // puede reusar, y un codigo ya gastado da un error incomprensible.
  assert.equal(sso.leerPendiente(), null)
  assert.equal(sesion.tamaño, 0)
})

// =============================================================================
//  completarLogin: el orden de las comprobaciones ES la seguridad
// =============================================================================

test('completarLogin RECHAZA si el state no coincide, y no canjea nada', async () => {
  conAlmacenes()
  sso.guardarPendiente({ verifier: 'v1', state: 'el-mio' })

  let canjeo = false
  globalThis.fetch = async () => { canjeo = true; return new Response('{}', { status: 200 }) }

  await assert.rejects(
    () => sso.completarLogin({ code: 'cod', state: 'el-de-otro' }),
    /state/i,
  )

  // Esta es LA asercion del test: no alcanza con que tire error, tiene que no
  // haber hablado con el SSO. Canjear y despues arrepentirse es haber entrado.
  assert.equal(canjeo, false, 'Se canjeo el codigo pese a que el `state` no coincidia.')
  assert.equal(globalThis.localStorage.getItem('tr3slog-token'), null)
})

test('completarLogin con `error` en la URL no canjea y conserva el motivo', async () => {
  conAlmacenes()
  sso.guardarPendiente({ verifier: 'v1', state: 's1' })

  let canjeo = false
  globalThis.fetch = async () => { canjeo = true; return new Response('{}', { status: 200 }) }

  // Es lo que llega cuando la persona aprieta "cancelar" en la pantalla del SSO.
  await assert.rejects(
    () => sso.completarLogin({ error: 'access_denied', error_description: 'El usuario cancelo.' }),
    (e) => e.codigo === 'access_denied' && /cancel/i.test(e.message),
  )

  assert.equal(canjeo, false)
})

test('completarLogin sin pendiente no canjea: ese callback no salio de esta pestaña', async () => {
  conAlmacenes()

  let canjeo = false
  globalThis.fetch = async () => { canjeo = true; return new Response('{}', { status: 200 }) }

  await assert.rejects(() => sso.completarLogin({ code: 'cod', state: 's1' }), /pendiente/i)
  assert.equal(canjeo, false)
})

test('completarLogin feliz: canjea, guarda el token y consume el pendiente', async () => {
  const { sesion, local } = conAlmacenes()
  sso.guardarPendiente({ verifier: 'v1', state: 's1' })

  globalThis.fetch = async () => new Response(
    JSON.stringify({ access_token: 'tok-feliz', token_type: 'Bearer', expires_in: 3600 }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )

  const token = await sso.completarLogin({ code: 'cod', state: 's1' })

  assert.equal(token.access_token, 'tok-feliz')
  // La MISMA clave de siempre: la leen AppShell y todo el dashboard.
  assert.equal(local.getItem('tr3slog-token'), 'tok-feliz')
  assert.equal(sesion.tamaño, 0, 'El verifier quedo guardado despues de usarse.')
})

// =============================================================================
//  Logout: best-effort de verdad
// =============================================================================

test('cerrarSesionEnElSso manda el Bearer al SSO y se traga el error de red', async () => {
  let pedido = null
  globalThis.fetch = async (url, opciones) => {
    pedido = { url, opciones }
    throw new Error('ECONNREFUSED')
  }

  // No rechaza: el token local se borra igual del lado de quien llama. Dejar a
  // alguien "logueado" porque el servidor no contesto es lo peor de las dos.
  await sso.cerrarSesionEnElSso('tok-123')

  assert.equal(pedido.url, 'https://sso.test/api/logout')
  assert.equal(pedido.opciones.method, 'POST')
  assert.equal(pedido.opciones.headers.Authorization, 'Bearer tok-123')
})
