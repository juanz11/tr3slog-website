import React from 'react'
import { useRouter } from 'next/router'
import { completarLogin, iniciarLogin } from '../../../src/lib/sso'
import { authI18n } from '../../../src/i18n-auth'

// -----------------------------------------------------------------------------
//  La vuelta del SSO: `redirect_uri` = http://localhost:3200/login/sso/callback
// -----------------------------------------------------------------------------
//  Es la unica pagina de la web cuya URL esta REGISTRADA del otro lado. Cambiarla
//  (o moverla de carpeta) rompe el login sin que ningun test de la web se entere:
//  el SSO compara la `redirect_uri` con `===`. Si se mueve, se registra primero en
//  el SSO.
//
//  Toda la logica vive en src/lib/sso.js, que se prueba con `node --test`. Aca
//  queda solo lo que necesita un navegador: leer la URL y pintar tres estados.

const CAJA = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  background: '#EEF4FC',
}

const TARJETA = {
  width: '100%',
  maxWidth: 460,
  background: '#fff',
  borderRadius: 16,
  padding: 36,
  border: '1px solid #DCE6F5',
  boxShadow: '0 24px 80px rgba(0,0,0,.08)',
  textAlign: 'center',
}

const MARCA = {
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: 22,
  color: '#001B45',
  letterSpacing: '-.02em',
  marginBottom: 18,
}

const BOTON = {
  marginTop: 22,
  padding: '14px 24px',
  background: '#087CF0',
  border: 'none',
  borderRadius: 11,
  color: '#fff',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}

// `lang` lo pasa _app.jsx (que es quien lo persiste): esta pagina se pinta sin
// layout, pero no sin idioma — la web es trilingue.
export default function SsoCallback({ lang }) {
  const router = useRouter()
  const a = authI18n[lang] || authI18n.es
  const [error, setError] = React.useState('')
  const corrio = React.useRef(false)

  React.useEffect(() => {
    // `isReady` es obligatorio con `output: 'export'`: hasta que no lo es,
    // `router.query` esta VACIO aunque la URL tenga el `code`. Sin esta guarda el
    // efecto corre una vez con la query vacia y el login muere con "el SSO no
    // devolvio ningun codigo" en el primer render.
    if (!router.isReady || corrio.current) return

    // El verifier es de un solo uso y `leerPendiente` lo BORRA al leerlo, asi que
    // un segundo disparo del efecto (StrictMode en dev monta dos veces) canjearia
    // sin pendiente y mostraria un error falso.
    corrio.current = true

    completarLogin(router.query)
      .then(() => {
        // Navegacion COMPLETA, no `router.push`: al recargar, _app.jsx vuelve a
        // montar y pide `GET /me` con el token que acabamos de guardar, que es lo
        // que llena el usuario de la sesion. Con una navegacion de cliente el
        // efecto de _app.jsx no se repite y el dashboard aparece sin usuario.
        //
        // Y `replace` en vez de `assign`: deja fuera del historial esta URL, que
        // lleva el `code` y el `state` pegados. El codigo ya esta gastado, pero no
        // hay razon para que quede en el boton "atras" ni en el historial
        // compartido de un navegador ajeno.
        window.location.replace('/dashboard')
      })
      .catch((e) => {
        setError(e?.message || a.ssoFailFallback)
      })
  }, [router.isReady, router.query])

  // Reintentar es EMPEZAR DE NUEVO, no recargar esta pagina: el codigo de la URL
  // ya no sirve (es de un solo uso) y el verifier que lo acompañaba ya se borro.
  const reintentar = () => {
    setError('')
    iniciarLogin().catch((e) => setError(e?.message || a.ssoStartFail))
  }

  return (
    <div style={CAJA}>
      <div style={TARJETA}>
        <div style={MARCA}>TR3<span style={{ color: '#D99A00' }}>S</span>LOG</div>

        {error ? (
          <>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', margin: '0 0 12px' }}>
              {a.ssoFailTitle}
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: '#10233F', margin: 0 }}>{error}</p>
            <button type="button" onClick={reintentar} style={BOTON}>{a.ssoRetry}</button>
          </>
        ) : (
          <p style={{ fontSize: 15, color: '#6C82A6', margin: 0 }}>{a.ssoChecking}</p>
        )}
      </div>
    </div>
  )
}
