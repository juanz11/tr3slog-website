# Levantar la web de TR3SLOG en tu máquina

Desde el Lote 7 esta web **no tiene login propio**: la identidad la resuelve el
SSO de MyGlobalHub por OAuth Authorization Code + PKCE, y los roles se leen por
el gateway (`GET /me`). No hay formulario de email y contraseña en ningún lado.

**Todo lo que hay acá está probado.** Si algo no funciona como está escrito, es
un error de esta guía y hay que corregirlo, no un problema tuyo.

---

## 1. Levantá el SSO

```bash
cd /Volumes/External/sources/myglobalhub/SSO
docker compose up -d
curl -s -o /dev/null -w '%{http_code}\n' http://localhost/login   # 200
```

## 2. Levantá el backend y el gateway de TR3SLOG

```bash
bash /Volumes/External/sources/myglobalhub/SSO/Docs/demo/treslog_stack.sh up
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8003/_health   # 200
```

Deja el backend en `:8000`, el gateway en `:8003` y un usuario espejo de prueba.
Para bajarlo todo: el mismo comando con `down`.

## 3. Levantá la web

```bash
cd /Volumes/External/sources/myglobalhub/treslog/tr3slog-website
npm install
npm run dev            # queda en http://localhost:3200
```

## 4. Entrá

Abrí **`http://localhost:3200`** y apretá «Iniciar sesión». Te lleva al SSO,
te logueás, aceptás el consentimiento, y volvés a `/dashboard` ya identificado.

> **`localhost`, NO `127.0.0.1`.** El SSO tiene registrada una sola
> `redirect_uri` para esta web —`http://localhost:3200/login/sso/callback`— y la
> compara caracter por caracter. Desde `127.0.0.1:3200` el login falla con
> `invalid_request` antes de mostrarte nada.

> **El puerto 3200 tampoco es decorativo**: es el que el SSO tiene registrado
> como origen CORS y dentro de la `redirect_uri`. El 3000 es de la web de MSH, y
> `next dev` se corre solo a otro puerto si lo encuentra ocupado — por eso el
> script `dev` fija `-p 3200`.

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

## Qué cambiar para apuntar al VPS

Cuatro variables de entorno, **en el momento del build** (Next inlinea las
`NEXT_PUBLIC_*` al compilar: cambiarlas en el servidor no cambia un bundle ya
construido — hay que volver a buildear):

| Variable | Local (valor por defecto en el código) | VPS |
|---|---|---|
| `NEXT_PUBLIC_SSO_URL` | `http://localhost` | la URL pública del SSO |
| `NEXT_PUBLIC_SSO_CLIENT_ID` | el cliente `frontend-dev` de `treslog` | **otro** client_id, el de producción |
| `NEXT_PUBLIC_SSO_REDIRECT_URI` | `http://localhost:3200/login/sso/callback` | `https://<dominio>/login/sso/callback` |
| `NEXT_PUBLIC_GATEWAY_URL` | `http://localhost:8003/api/treslog` | `https://<gateway>/api/treslog` |

Dos cosas que hay que hacer del lado del SSO **antes** de ese build, o el login
falla en producción y no en tu máquina:

1. Registrar la `redirect_uri` de producción en el cliente OAuth. Se compara con
   `===`: sobra una barra al final y no entra nadie.
2. Registrar el origen de producción para CORS de la aplicación `treslog`.

`NEXT_PUBLIC_API_URL` **no se toca**: sigue significando lo de siempre (el
backend legado) y la usan las llamadas que todavía no pasan por el gateway.

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
