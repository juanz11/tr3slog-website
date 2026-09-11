// -----------------------------------------------------------------------------
//  Donde vive la identidad de TR3SLOG
// -----------------------------------------------------------------------------
//  La web ya no autentica: el login lo hace el SSO de MyGlobalHub por OAuth
//  Authorization Code + PKCE, y la identidad y los roles se leen por el gateway.
//
//  POR QUE LOS VALORES POR DEFECTO SON LOS LOCALES, y no un string vacio:
//  para que `npm run dev` recien clonado ande contra el stack local sin tocar un
//  solo archivo de ambiente. Un default vacio convierte "me falta una variable"
//  en "el boton de entrar no hace nada", que es media hora de nadie.
//
//  EN PRODUCCION LOS PISA EL BUILD. Next inlinea las `NEXT_PUBLIC_*` en tiempo de
//  compilacion, no de arranque: cambiar una variable en el servidor NO cambia el
//  bundle ya construido. Hay que volver a buildear (ver SETUP_LOCAL.md).
//
//  Y ojo con lo que se pone aca: todo esto VIAJA AL NAVEGADOR. El cliente OAuth
//  es PUBLICO y no tiene secret — es exactamente el motivo por el que el flujo es
//  PKCE y no `client_credentials`. Si algun dia alguien quiere agregar un
//  `client_secret`, la respuesta es no: seria publicarlo.

// El SSO, de cara al NAVEGADOR. En local es `http://localhost` (Laravel Sail en
// el 80), no `sso-laravel.test`: el nombre del contenedor no resuelve desde el
// navegador de la persona.
export const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || 'http://localhost'

// Cliente OAuth publico de `treslog` en el SSO local, creado con `sso:app-client`.
// El de produccion es OTRO id: un cliente lleva sus `redirect_uri` registradas, y
// las del VPS no son las de localhost.
export const SSO_CLIENT_ID = process.env.NEXT_PUBLIC_SSO_CLIENT_ID
  || '01a08e52-d3e5-73df-a1e4-59e4f7f99d42'

// TIENE QUE COINCIDIR EXACTAMENTE con la registrada en el SSO, caracter por
// caracter: el servidor de autorizacion la compara con `===`, no la normaliza.
// `http://127.0.0.1:3200/...` y `http://localhost:3200/...` son DOS uris
// distintas, y SOLO la de `localhost` esta registrada: desde `127.0.0.1:3200` el
// login falla con `invalid_request` antes de mostrar nada (SETUP_LOCAL.md §4).
// Una version anterior de este comentario decia que estaban las dos; lo marco
// la auditoria del Lote 7.
export const SSO_REDIRECT_URI = process.env.NEXT_PUBLIC_SSO_REDIRECT_URI
  || 'http://localhost:3200/login/sso/callback'

// El gateway, NO el backend. Todo lo que pase por aca llega al backend de TR3SLOG
// con las cabeceras `X-User-*` ya puestas; pegarle al backend directo (`:8000`)
// devuelve 401 para siempre, porque no valida tokens — no puede, por diseño.
//
// ================= POR QUE `GATEWAY_URL` Y NO `NEXT_PUBLIC_API_URL` ==========
// DIVERGENCIA CONSCIENTE respecto de lo pedido, y esta medida, no opinada.
// `NEXT_PUBLIC_API_URL` YA EXISTE y ya significa otra cosa: el ambiente de
// produccion de esta web la tiene definida con la URL del backend LEGADO. Se
// comprobo sobre el bundle compilado, no sobre el archivo (que no se abre): antes
// de este cambio, `npm run build` inlineaba `https://api.<dominio>/api` en
// `NEXT_PUBLIC_API_URL`.
//
// Si el gateway leyera esa variable, el build de produccion mandaria `GET /me` a
// `https://api.<dominio>/api/me` —el backend viejo, que no tiene esa ruta— y de
// paso el trafico legado se iria a `http://localhost:8000`. Las dos mitades
// cruzadas, y ninguna de las dos fallando de una forma que se entienda.
//
// Con una variable NUEVA, lo peor que pasa es que el build de produccion apunte a
// `localhost:8003` y falle a la vista hasta que se la defina (ver SETUP_LOCAL.md).
// Un 404 contra el servidor equivocado es mucho mas caro de diagnosticar que un
// "connection refused" contra el propio.
export const API_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8003/api/treslog'

// La misma clave de `localStorage` de siempre. NO se renombra a proposito: la leen
// AppShell y cada componente del dashboard, y renombrarla en este lote seria
// mezclar un cambio de auth con un cambio de contrato interno.
export const TOKEN_KEY = 'tr3slog-token'
