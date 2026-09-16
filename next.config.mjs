// -----------------------------------------------------------------------------
//  Perfiles de ejecucion: DONDE vive cada pieza segun que vayas a tocar
// -----------------------------------------------------------------------------
//  Se elige con PERFIL=<nombre> (ver package.json). Sin PERFIL, es `vps`: la
//  decision del equipo (2026-09-14) es que el camino por defecto sea el que
//  menos dependencias levanta —solo esta web— con identidad, gateway y backend
//  en el VPS.
//
//  POR QUE ACA Y NO EN .env.*: los .env de este repo estan versionados con otras
//  cosas adentro y no se tocan en este sprint; y un perfil es una decision del
//  proyecto, no de la maquina de cada quien. Aca hay un solo lugar, versionado y
//  con el porque escrito al lado. Una variable NEXT_PUBLIC_* puesta en el
//  entorno sigue ganando sobre el perfil: sirve para el build del VPS y para
//  probar algo raro sin editar nada.
//
//  El client_id de `vps` es el canal `frontend-dev` de `treslog` en el SSO de
//  produccion: un cliente OAuth PUBLICO (PKCE, sin secreto) cuyo unico redirect
//  es localhost:3200. Va versionado a proposito: el id de un cliente PKCE viaja
//  en la URL de cada login, no es un secreto; y lo peor que hace alguien con el
//  es abrir un login que vuelve a SU localhost.
const PERFILES = {
  // PRODUCCION · el sitio publicado en https://treslog.mysocialhub.social.
  // Cliente OAuth `frontend` de treslog (no el de desarrollo) y callback real.
  // Las rutas publicas (contacto, cotizar, tracking) van por el camino publico
  // del gateway, sin identidad. Se construye con `npm run build:produccion`.
  produccion: {
    NEXT_PUBLIC_SSO_URL: 'https://sso.mysocialhub.social',
    NEXT_PUBLIC_SSO_CLIENT_ID: '01a0a7db-b15f-70ef-8c2f-76ab6d65209c',
    NEXT_PUBLIC_SSO_REDIRECT_URI: 'https://treslog.mysocialhub.social/login/sso/callback',
    NEXT_PUBLIC_GATEWAY_URL: 'https://api.mysocialhub.social/api/treslog',
    NEXT_PUBLIC_API_URL: 'https://api.mysocialhub.social/api/treslog/public',
  },
  // A · Solo la web. Es el recomendado.
  vps: {
    NEXT_PUBLIC_SSO_URL: 'https://sso.mysocialhub.social',
    NEXT_PUBLIC_SSO_CLIENT_ID: '01a09176-34c0-725f-87d9-e20bc92137ea',
    NEXT_PUBLIC_SSO_REDIRECT_URI: 'http://localhost:3200/login/sso/callback',
    NEXT_PUBLIC_GATEWAY_URL: 'https://api.mysocialhub.social/api/treslog',
    // Contacto, cotizar y tracking tambien contra el VPS: ya no hace falta un
    // backend local para que esas tres pantallas funcionen en el perfil A.
    NEXT_PUBLIC_API_URL: 'https://api.mysocialhub.social/api/treslog/public',
  },
  // B · Tu backend y tu gateway (gateway/, `docker compose up`), identidad del VPS.
  'backend-local': {
    NEXT_PUBLIC_SSO_URL: 'https://sso.mysocialhub.social',
    NEXT_PUBLIC_SSO_CLIENT_ID: '01a09176-34c0-725f-87d9-e20bc92137ea',
    NEXT_PUBLIC_SSO_REDIRECT_URI: 'http://localhost:3200/login/sso/callback',
    NEXT_PUBLIC_GATEWAY_URL: 'http://localhost:8003/api/treslog',
    NEXT_PUBLIC_API_URL: 'http://localhost:8000/api',
  },
  // C · Todo local, incluido el SSO. Son los valores por defecto de src/config/sso.js.
  local: {},
};

const nombre = process.env.PERFIL ?? 'vps';
const perfil = PERFILES[nombre];

if (perfil === undefined) {
  throw new Error(
    `PERFIL=${nombre} no existe. Los que hay: ${Object.keys(PERFILES).join(', ')}. ` +
    'Se definen en next.config.mjs.',
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Lo que el entorno ya trae gana sobre el perfil, clave por clave... SALVO en
  // `produccion`, que es determinista a proposito: `next build` carga
  // .env.production (versionado, con valores de otro proyecto) y sin esta
  // excepcion el sitio publicado salia apuntando a un API ajeno. Lo que se
  // publica es EXACTAMENTE lo que dice el perfil, y nada mas.
  env: nombre === 'produccion'
    ? { ...perfil }
    : Object.fromEntries(
        Object.entries(perfil).map(([clave, valor]) => [clave, process.env[clave] ?? valor]),
      ),
};

export default nextConfig;
