# Levantar la web de TR3SLOG en tu máquina

Desde el Lote 7 esta web **no tiene login propio**: la identidad la resuelve el
SSO de MyGlobalHub por OAuth Authorization Code + PKCE, y los roles se leen por
el gateway (`GET /me`). No hay formulario de email y contraseña en ningún lado.

**Todo lo que hay acá está probado.** Si algo no funciona como está escrito, es
un error de esta guía y hay que corregirlo, no un problema tuyo.

---

## Elegí un perfil

| | **A — solo la web** ⭐ | **B — tu backend local** | **C — todo local** |
|---|---|---|---|
| Levantás | `npm run dev` | la web + tu backend + el gateway | todo eso + **el SSO entero** |
| Te logueás contra | el SSO del VPS | el SSO del VPS | usuarios de prueba tuyos |
| Los datos son | los del VPS | los tuyos | los tuyos |
| Docker | no | sí (el gateway) | sí (gateway + SSO) |
| Es para | tocar la web | tocar el backend de TR3SLOG | tocar el SSO |

**Usá el A.** Es la decisión del equipo (2026-09-14): cuantas menos dependencias haya que
levantar, mejor. Los perfiles viven en `next.config.mjs` (un solo lugar, versionado, con el
porqué al lado) y se eligen con el script de `package.json`. No hay nada que pedir ni que
copiar: el `client_id` ya está ahí, y es público por definición (PKCE, sin secreto, solo
redirige a `localhost`).

> **Lo que el A implica, dicho claro:** escribís sobre los datos del VPS. Hoy ese VPS es de
> demostración; el día que tenga usuarios reales, este perfil necesita un ambiente de pruebas.

## Perfil A — solo la web

```bash
npm install
npm run dev            # queda en http://localhost:3200, contra el VPS
```

Abrí **`http://localhost:3200`** y apretá «Iniciar sesión». Te lleva al SSO del VPS, entrás, y
volvés a `/dashboard` con tus datos de producción.

## Perfil B — tu backend local

Es el perfil del repo del backend (`backend_trelog/SETUP_LOCAL.md`): ahí se levanta tu
backend, tu **espejo** (`php artisan sso:espejo tu@correo.com <tu id del VPS>`) y el
gateway en `:8003`, que ya viene apuntando al SSO del VPS. De este lado:

```bash
npm run dev:backend-local
```

> El espejo lleva tu id **del SSO del VPS**, no el del SSO local. Con el id cruzado, la
> web dice «tu cuenta no está habilitada» y parece un fallo del SSO cuando es un dato
> mal copiado.

## Perfil C — todo local

Es el B con el SSO en tu máquina (`SSO/`, `docker compose up -d`, queda en
`http://localhost`), el gateway con las líneas del perfil local en su `.env`, y el
espejo con tu id **del SSO local**. De este lado:

```bash
npm run dev:local
```

> **`localhost`, NO `127.0.0.1`.** El SSO tiene registrada una sola `redirect_uri` para esta
> web —`http://localhost:3200/login/sso/callback`— y la compara caracter por caracter.

> **El puerto 3200 tampoco es decorativo**: es el que el SSO tiene registrado como origen CORS y
> dentro de la `redirect_uri`. El 3000 es de la web de MSH.

---

## Qué anda y qué todavía no

| | Estado |
|---|---|
| Entrar y salir por el SSO | anda |
| Nombre, correo y roles en el dashboard | anda (`GET /me` por el gateway) |
| Menú de administración según el rol | anda (`data.is_admin`) |
| Teléfono del perfil | anda: se guarda en el SSO (`PUT /api/v1/profile`) |
| Nombre y correo del perfil | **solo lectura**: los administra MyGlobalHub |
| Envíos, cotizaciones, direcciones, soporte, choferes, incidentes | anda desde el **Lote 8**: van por el gateway (`/api/treslog/*`), con el rol del SSO |
| Cotizar sin cuenta, seguir un envío, contacto | anda: van al backend **directo** (`NEXT_PUBLIC_API_URL`), no llevan identidad |

Necesita el backend en la rama del Lote 8 (`sso/lote8-dominio-por-gateway`) o
posterior: es la que monta el dominio bajo `/api/treslog`. Con el backend de un
lote anterior, esas llamadas dan 404 en el gateway.

Un 403 en una sección de la consola no es «volvé a loguearte»: es que tu
persona no tiene `treslog:operations` ni `treslog:admin` en el SSO. El error
trae un `request_id` para pedirlo con el dato.

---

## Publicarla (el build de producción)

Los perfiles de `next.config.mjs` son para **desarrollar**. Para publicar, las
`NEXT_PUBLIC_*` se pasan en el entorno **al compilar** y ganan sobre el perfil, clave
por clave (Next las inlinea al compilar: cambiarlas en el servidor no cambia un
bundle ya construido). Lo que cambia respecto del perfil `vps`:

| Variable | Desarrollo (perfil `vps`) | Publicada |
|---|---|---|
| `NEXT_PUBLIC_SSO_CLIENT_ID` | el cliente `frontend-dev` | **otro**: el cliente `frontend` de producción |
| `NEXT_PUBLIC_SSO_REDIRECT_URI` | `http://localhost:3200/login/sso/callback` | `https://<url pública>/login/sso/callback` |

Dos cosas que hay que hacer del lado del SSO **antes** de ese build, o el login
falla en producción y no en tu máquina:

1. Registrar la `redirect_uri` pública en el cliente OAuth. Se compara con
   `===`: sobra una barra al final y no entra nadie.
2. Registrar el origen público para CORS de la aplicación `treslog`.

### Si servís el build estático

`npm run build` genera `out/` (`output: 'export'`), y el callback queda en
`out/login/sso/callback.html`. La `redirect_uri` registrada **no lleva `.html`**,
así que el servidor tiene que resolver la extensión:

```nginx
try_files $uri $uri.html $uri/index.html =404;
```

Sin eso, el login funciona en `npm run dev` y tira 404 en producción, justo
después de que la persona se autenticó.

---

## Cuando algo falla

| Síntoma | Causa |
|---|---|
| «Tu cuenta del SSO todavía no está habilitada en TR3SLOG» | Entraste bien, pero tu identidad no tiene fila en `users` con `sso_user_id`. Es el `403 forbidden` de `gateway.user`. Volver a loguearte no lo arregla: hay que dar de alta la cuenta |
| `invalid_request` apenas apretás «Iniciar sesión» | La `redirect_uri` o el `client_id` no son los registrados. Fijate que estés en `localhost:3200` y no en `127.0.0.1:3200` |
| «No hay un login pendiente en esta pestaña» | Abriste el callback a mano, o volviste con el botón «atrás». El verifier es de un solo uso. Empezá de nuevo |
| El dashboard carga pero las listas están vacías | Es lo esperado hasta el Lote 8: esas rutas siguen con `auth:sanctum` |

---

## Los tests de la web

```bash
npm test     # node --test, sin dependencias nuevas
```

Cubren PKCE completo: el challenge contra el vector de prueba de RFC 7636, los
parámetros de `/oauth/authorize`, el cuerpo del canje, y que un `state` que no
coincide **no canjea nada**.
