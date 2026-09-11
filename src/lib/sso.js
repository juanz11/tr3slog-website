// -----------------------------------------------------------------------------
//  Login contra el SSO de MyGlobalHub: Authorization Code + PKCE
// -----------------------------------------------------------------------------
//  POR QUE PKCE Y NO UN POST CON EMAIL Y CONTRASEÑA:
//  esta web es un cliente PUBLICO — todo su codigo viaja al navegador, asi que no
//  puede guardar un secreto. Sin secreto, un `authorization_code` pelado lo puede
//  canjear cualquiera que intercepte el redirect. PKCE lo arregla sin secretos: la
//  web inventa un `code_verifier` aleatorio, manda solo su SHA-256
//  (`code_challenge`) al pedir el codigo, y recien al canjearlo muestra el
//  verifier. Quien robe el codigo no tiene el verifier, y el hash no se puede dar
//  vuelta. Es lo mismo que ya hace la app de MSH
//  (MSH/app/lib/features/auth/data/datasources/sso_auth_datasource.dart).
//
//  ESTE ARCHIVO ES A PROPOSITO SIN REACT. Son funciones puras y una llamada de red
//  suelta, para que se puedan probar con `node --test` sin navegador, sin jsdom y
//  sin montar un componente. La pagina del callback es una cascara que las llama.

// Con extension `.js`, a diferencia del resto del repo: este modulo lo importa
// `node --test` sin pasar por webpack, y Node NO adivina extensiones en ESM.
// Webpack resuelve las dos formas, asi que el precio de la consistencia es cero.
import { SSO_URL, SSO_CLIENT_ID, SSO_REDIRECT_URI, TOKEN_KEY } from '../config/sso.js'

// Clave del par verifier+state mientras la persona esta del otro lado, en el SSO.
const PENDIENTE = 'tr3slog.sso.pendiente'

// Los 32 bytes son el minimo que RFC 7636 §7.1 considera suficiente entropia; en
// base64url dan 43 caracteres, que es justo el minimo de longitud que el propio
// RFC exige para el verifier (43-128). Con menos, el SSO responde 400
// `invalid_request` con el hint "Code challenge must follow the specifications of
// RFC-7636" — comprobado contra el SSO local, no leido.
const BYTES_DE_ENTROPIA = 32

/**
 * base64url SIN padding, que es lo que pide RFC 7636 §4.2 (`=` fuera, `+` -> `-`,
 * `/` -> `_`). Con padding el SSO rechaza el challenge.
 */
function base64url(bytes) {
  let ascii = ''
  for (const b of bytes) ascii += String.fromCharCode(b)

  return btoa(ascii).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function aleatorio(bytes = BYTES_DE_ENTROPIA) {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)

  return base64url(buf)
}

/** El secreto de un solo uso de este intento de login. */
export function generarVerifier() {
  return aleatorio()
}

/**
 * El `state` de OAuth: no es decorativo. Es lo unico que ata la respuesta del SSO
 * al pedido que salio de ESTA pestaña, y por eso es la defensa contra CSRF de
 * login (que alguien te haga entrar con SU codigo, en SU cuenta, sin que te
 * enteres). Si no coincide, `completarLogin` no canjea nada.
 */
export function generarState() {
  return aleatorio(16)
}

/**
 * `code_challenge` = BASE64URL(SHA256(ASCII(verifier))).
 *
 * Async porque WebCrypto lo es: `crypto.subtle.digest` devuelve una promesa y no
 * hay version sincronica en el navegador. Eso obliga a que `construirUrlAuthorize`
 * tambien sea async, y esta bien que se vea — el hash es la pieza que hace que
 * PKCE sirva para algo.
 */
export async function derivarChallenge(verifier) {
  const datos = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', datos)

  return base64url(new Uint8Array(hash))
}

/**
 * La URL de `/oauth/authorize` con los cinco parametros que el SSO exige mas el
 * `state`.
 *
 * `scope` va VACIO y explicito: el SSO de MyGlobalHub resuelve el alcance por
 * aplicacion (el `client_id` ya dice `treslog`), no por scopes de OAuth. Mandar
 * un scope inventado es un 400.
 */
export async function construirUrlAuthorize({ verifier, state }) {
  const params = new URLSearchParams({
    client_id: SSO_CLIENT_ID,
    redirect_uri: SSO_REDIRECT_URI,
    response_type: 'code',
    scope: '',
    code_challenge: await derivarChallenge(verifier),
    code_challenge_method: 'S256',
    state,
  })

  return `${SSO_URL}/oauth/authorize?${params.toString()}`
}

/**
 * Donde espera el verifier mientras la persona esta en el SSO.
 *
 * `sessionStorage` y NO `localStorage`, a proposito: muere con la pestaña. Un
 * verifier que sobrevive al cierre del navegador es un secreto guardado mas
 * tiempo que el intento de login que lo justifica. Y se lee en tiempo de llamada
 * (no en un `import`) porque en el servidor de Next, durante el prerender, no
 * existe.
 */
function almacen() {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage
  } catch (e) {
    // Safari en modo privado tira al TOCAR sessionStorage, no al escribir.
    return null
  }
}

export function guardarPendiente({ verifier, state }) {
  const s = almacen()
  if (!s) return false

  try {
    s.setItem(PENDIENTE, JSON.stringify({ verifier, state }))
    return true
  } catch (e) {
    return false
  }
}

/**
 * Lee y BORRA. El borrado no es prolijidad: el verifier es de un solo uso, y si
 * quedara, volver atras en el historial (o recargar el callback) reintentaria el
 * canje de un codigo ya gastado y mostraria un error incomprensible en vez de
 * "empeza el login de nuevo".
 */
export function leerPendiente() {
  const s = almacen()
  if (!s) return null

  let crudo = null
  try {
    crudo = s.getItem(PENDIENTE)
    s.removeItem(PENDIENTE)
  } catch (e) {
    return null
  }

  if (!crudo) return null

  try {
    const datos = JSON.parse(crudo)
    return datos?.verifier && datos?.state ? datos : null
  } catch (e) {
    return null
  }
}

/**
 * Canje del codigo por el token. `application/x-www-form-urlencoded`, no JSON:
 * lo manda RFC 6749 §4.1.3 y Passport rechaza el JSON.
 *
 * SIN `client_secret`: el cliente es publico. El verifier ocupa su lugar.
 */
export async function canjearCodigo({ code, verifier }) {
  const cuerpo = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: SSO_CLIENT_ID,
    redirect_uri: SSO_REDIRECT_URI,
    code_verifier: verifier,
    code,
  })

  const res = await fetch(`${SSO_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: cuerpo.toString(),
  })

  const datos = await res.json().catch(() => ({}))

  if (!res.ok) {
    // El sobre de `/oauth/token` NO es el del contrato del SSO
    // (`error`/`message`/`request_id`): es el de OAuth 2.0, con
    // `error_description` y `hint`. El `hint` es el unico que dice algo util
    // ("Code challenge must follow...", "Authorization code has expired"), asi
    // que va primero.
    throw new Error(datos.hint || datos.error_description || datos.error
      || `El SSO rechazo el canje del codigo (HTTP ${res.status}).`)
  }

  if (!datos.access_token) {
    throw new Error('El SSO respondio 200 pero sin access_token.')
  }

  return datos
}

export function guardarToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    return true
  } catch (e) {
    return false
  }
}

export function leerToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (e) {
    return null
  }
}

export function borrarToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (e) {}
}

/**
 * Arranca el login: guarda el pendiente y SALE de la aplicacion hacia el SSO.
 *
 * `location.assign` y no `router.push`: el SSO es otro origen, no una ruta de
 * Next. Y `assign` en vez de `replace` para que el back del navegador vuelva a
 * donde la persona estaba, no la deje en un loop contra el SSO.
 */
export async function iniciarLogin() {
  const verifier = generarVerifier()
  const state = generarState()

  if (!guardarPendiente({ verifier, state })) {
    throw new Error('El navegador no permite guardar datos de sesion, necesarios para entrar.')
  }

  const url = await construirUrlAuthorize({ verifier, state })
  window.location.assign(url)
}

/**
 * Cierra el login con lo que vino en la URL del callback.
 *
 * El orden de las comprobaciones ES la seguridad de esta funcion:
 *   1. `error` en la URL: la persona cancelo (o el SSO nego). No hay nada que canjear.
 *   2. hay pendiente: si no, este callback no lo empezo esta pestaña.
 *   3. `state` coincide: si no, NO SE CANJEA NADA. Es la defensa contra que alguien
 *      te haga entrar con su codigo en su cuenta.
 *   4. recien ahi, canjear.
 */
export async function completarLogin(query) {
  const { code, state, error, error_description: descripcion } = query || {}

  if (error) {
    const err = new Error(descripcion || 'El SSO no autorizo el ingreso.')
    err.codigo = error
    throw err
  }

  if (!code) {
    throw new Error('El SSO no devolvio ningun codigo de autorizacion.')
  }

  const pendiente = leerPendiente()

  if (!pendiente) {
    throw new Error('No hay un login pendiente en esta pestaña. Volve a intentar desde el inicio.')
  }

  if (pendiente.state !== state) {
    throw new Error('El `state` no coincide con el del pedido: el login se aborta por seguridad.')
  }

  const token = await canjearCodigo({ code, verifier: pendiente.verifier })

  guardarToken(token.access_token)

  return token
}

/**
 * Cierre de sesion COMPLETO: el unico que de verdad cierra algo.
 *
 * Son tres cosas, y la llamada de API sola hace UNA:
 *   1. el token de esta web (localStorage)          -> `borrarToken`
 *   2. los tokens de la persona en TODAS las apps   -> `POST /api/logout`
 *   3. la sesion del NAVEGADOR en el SSO y en Clerk -> solo navegando a `/logout`
 *
 * El punto 3 no se puede hacer con `fetch`: la peticion sale de otro origen y no
 * lleva la cookie de sesion del SSO. Sin el, «cerrar sesion» borraba el token de
 * aca y la persona volvia a entrar sin que le pidieran NADA —el SSO todavia la
 * reconocia— asi que parecia que el logout no hacia nada. Por eso al final se
 * SALE de la aplicacion hacia el `/logout` del SSO, que revoca, invalida la
 * sesion y termina en su pantalla de login, que ademas cierra la de Clerk.
 *
 * El `POST` se mantiene ademas de la navegacion, y no es redundancia inutil: si
 * el navegador no manda la cookie (otro perfil, cookies bloqueadas), la
 * navegacion no revoca nada y el token seguiria vivo en las otras aplicaciones.
 */
export async function cerrarSesionGlobal(token) {
  borrarToken()
  await cerrarSesionEnElSso(token)

  window.location.assign(`${SSO_URL}/logout`)
}

/**
 * Revoca los tokens en el SSO. Best-effort a proposito: si la red falla, el
 * token local se borra igual — dejar a la persona "logueada" en su navegador
 * porque el servidor no contesto es lo peor de las dos opciones.
 */
export async function cerrarSesionEnElSso(token) {
  if (!token) return

  try {
    await fetch(`${SSO_URL}/api/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  } catch (e) {}
}
