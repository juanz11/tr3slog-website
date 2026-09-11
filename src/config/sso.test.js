// -----------------------------------------------------------------------------
//  Los valores por defecto: el unico test que protege la demo local
// -----------------------------------------------------------------------------
//  Corre en SU PROPIO archivo a proposito: `node --test` le da un proceso a cada
//  uno, y este necesita que NINGUNA `NEXT_PUBLIC_*` este fijada — que es lo que
//  hace src/lib/sso.test.js para poder afirmar valores exactos.
//
//  Que protege: que `npm run dev` recien clonado siga apuntando al stack local.
//  El dia que alguien "limpie" estos defaults dejandolos en `''`, el sintoma no es
//  un error — es que el boton de entrar no hace nada, y eso se diagnostica lento.

import test from 'node:test'
import assert from 'node:assert/strict'

for (const clave of [
  'NEXT_PUBLIC_SSO_URL',
  'NEXT_PUBLIC_SSO_CLIENT_ID',
  'NEXT_PUBLIC_SSO_REDIRECT_URI',
  'NEXT_PUBLIC_GATEWAY_URL',
]) {
  delete process.env[clave]
}

const config = await import('./sso.js')

test('los valores por defecto son los del stack local', () => {
  assert.equal(config.SSO_URL, 'http://localhost')
  assert.equal(config.SSO_CLIENT_ID, '01a08e52-d3e5-73df-a1e4-59e4f7f99d42')
  assert.equal(config.SSO_REDIRECT_URI, 'http://localhost:3200/login/sso/callback')

  // EL GATEWAY, no el backend (`:8000`): el backend no valida tokens, no puede.
  assert.equal(config.API_URL, 'http://localhost:8003/api/treslog')
})

test('la redirect_uri por defecto usa el puerto 3200, que es el registrado en el SSO', () => {
  // El 3000 es de la web de MSH. `next dev` se corre solo a otro puerto si lo
  // encuentra ocupado, y un origen que cambia en silencio es un CORS —y una
  // `redirect_uri`— que se rompen en silencio. Por eso `dev` fija `-p 3200`.
  assert.equal(new URL(config.SSO_REDIRECT_URI).port, '3200')
  assert.equal(new URL(config.SSO_REDIRECT_URI).pathname, '/login/sso/callback')
})

test('la clave del token no cambio: la lee todo el dashboard', () => {
  assert.equal(config.TOKEN_KEY, 'tr3slog-token')
})
