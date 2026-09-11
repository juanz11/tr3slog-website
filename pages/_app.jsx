import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { i18n, langList } from '../src/i18n'
import { authI18n } from '../src/i18n-auth'
import { api } from '../src/api'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import CTA from '../src/components/CTA'
import Toast from '../src/components/Toast'
import LegalModal from '../src/components/LegalModal'
import { iniciarLogin, cerrarSesionGlobal, leerToken, borrarToken } from '../src/lib/sso'

import '../src/index.css'
import '../src/components/AppShell.css'

const LANGS = ['en', 'es', 'zh-CN']
const STORE = 'tr3slog.lang'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [lang, setLangState] = useState('es')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [legal, setLegal] = useState(null)
  const [user, setUser] = useState(null)
  // El 403 `forbidden` de `/me`: existe en el SSO, no esta habilitada en TR3SLOG.
  // Es un estado propio y NO un "no logueado" porque se trata al reves — no hay
  // que mandar a loguearse de nuevo, hay que mostrar que falta y a quien pedirselo.
  const [bloqueo, setBloqueo] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => {
    const detect = async () => {
      let saved = null
      try { saved = localStorage.getItem(STORE) } catch (e) {}
      if (!saved) {
        try {
          const m = document.cookie.match(new RegExp('(^| )' + STORE + '=([^;]+)'))
          if (m) saved = m[2]
        } catch (e) {}
      }
      if (LANGS.indexOf(saved) >= 0) {
        document.documentElement.lang = saved
        setLangState(saved)
        return
      }

      let geoLang = ''
      try {
        const res = await fetch('https://ipapi.co/json/')
        if (res.ok) {
          const data = await res.json()
          const cc = data?.country_code?.toUpperCase() || ''
          if (['CN', 'TW', 'HK', 'MO'].includes(cc)) geoLang = 'zh-CN'
          else if (['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'DO', 'PR', 'CU', 'GQ'].includes(cc)) geoLang = 'es'
          else if (['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'IN', 'PH'].includes(cc)) geoLang = 'en'
        }
      } catch (e) {}

      if (!geoLang) {
        const nl = (navigator.language || '').toLowerCase()
        geoLang = nl.indexOf('zh') === 0 ? 'zh-CN' : (nl.indexOf('en') === 0 ? 'en' : 'es')
      }
      document.documentElement.lang = geoLang
      setLangState(geoLang)
    }
    detect()
  }, [])

  useEffect(() => () => {
    clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => {
    let active = true
    const verify = async () => {
      const token = leerToken()
      if (token) {
        try {
          // `GET /me` por el GATEWAY. Devuelve `{data:{...}}` con el id local,
          // los roles `treslog:*` que emitio el SSO y `is_admin`. El SSO por su
          // cuenta NO devuelve roles (contrato §4.1), por eso no se le pregunta
          // directo a `/api/v1/user`.
          const respuesta = await api.me(token)
          if (active) setUser(respuesta?.data || null)
        } catch (e) {
          if (e?.status === 403 && e?.slug === 'forbidden') {
            // EL TOKEN NO SE BORRA ACA, y es lo que corta el bucle: si lo
            // borraramos, la persona veria "inicia sesion", entraria al SSO —que
            // ya tiene su sesion abierta y la devuelve al instante— y volveria a
            // este mismo 403. Para siempre, sin tocar una tecla.
            if (active) setBloqueo({ mensaje: e.message, requestId: e.requestId })
          } else {
            // 401 o red: el token no sirve. Se borra y se vuelve a empezar.
            borrarToken()
          }
        }
      }
      if (active) setAuthReady(true)
    }
    verify()
    return () => { active = false }
  }, [])


  const t = i18n[lang] || i18n.es
  const page = router.pathname === '/' ? 'home' : router.pathname.replace(/^\//, '')

  const go = (p) => {
    const path = p === 'home' ? '/' : '/' + p
    router.push(path)
    setMenuOpen(false)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const setLang = (code) => {
    try { localStorage.setItem(STORE, code) } catch (e) {}
    try {
      document.cookie = `${STORE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch (e) {}
    document.documentElement.lang = code
    setLangState(code)
    setMenuOpen(false)
  }

  const showToast = (text) => {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 6000)
  }

  // «Iniciar sesion» y «Registrarse» son EL MISMO boton ahora, y salen de la web:
  // el alta la hace el SSO (es su pantalla, su verificacion de email y su
  // contraseña). Esta aplicacion ya no pide credenciales en ningun formulario.
  const entrar = () => {
    setMenuOpen(false)
    iniciarLogin().catch((e) => showToast(e?.message || (authI18n[lang] || authI18n.es).ssoStartFail))
  }

  const handleLogout = async () => {
    // Cierre GLOBAL: borra el token de aca, revoca los de todas las aplicaciones
    // y SALE hacia el `/logout` del SSO, que es el unico que puede cerrar la
    // sesion del navegador (y la de Clerk). Sin ese salto, volver a entrar no
    // pedia nada y el logout parecia no hacer nada.
    //
    // El estado local se limpia ANTES de navegar: la navegacion tarda, y durante
    // ese rato la pantalla no puede seguir mostrando datos de alguien que acaba
    // de irse.
    setUser(null)
    setBloqueo(null)
    showToast('Cerrando sesión…')

    await cerrarSesionGlobal(leerToken())
  }

  const langs = langList.map((l) => {
    const on = l.code === lang
    return {
      label: l.label,
      name: l.name,
      code: l.code,
      bg: on ? '#001B45' : 'transparent',
      fg: on ? '#fff' : '#10233F',
      footBg: on ? '#087CF0' : 'transparent',
      footFg: '#fff',
    }
  })

  const isApp = router.pathname === '/dashboard'

  // El callback del SSO se pinta SOLO, sin Header ni Footer ni CTA: no es una
  // pagina del sitio, es un paso del login que dura dos segundos. Con el layout de
  // marketing alrededor, la persona ve aparecer y desaparecer la web entera.
  if (router.pathname === '/login/sso/callback') {
    // Sin layout, pero CON idioma: la web es trilingue y el paso del login no
    // puede ser la unica pantalla que ignora la eleccion de la persona.
    return <Component {...pageProps} lang={lang} />
  }

  if (isApp) {
    if (!authReady) {
      return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#EEF4FC' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', letterSpacing: '-.02em' }}>TR3<span style={{ color: '#D99A00' }}>S</span>LOG</div>
            <div style={{ marginTop: 16, fontSize: 15, color: '#6C82A6' }}>Cargando…</div>
          </div>
        </div>
      )
    }
    return (
      <div style={{ width: '100%', overflowX: 'hidden' }}>
        {user ? (
          <Component
            user={user}
            onLogout={handleLogout}
            lang={lang}
            langs={langs}
            setLang={setLang}
            onUserUpdate={(u) => setUser(u)}
            {...pageProps}
          />
        ) : (
          <Puerta a={authI18n[lang] || authI18n.es} bloqueo={bloqueo} onEntrar={entrar} onSalir={handleLogout} />
        )}
        {toast && <Toast text={toast} />}
      </div>
    )
  }

  return (
    <div style={{ width: '100%', overflowX: 'hidden', background: '#fff' }}>
      <Header
        t={t}
        langs={langs}
        setLang={setLang}
        page={page}
        go={go}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        user={user}
        onSignIn={entrar}
        onLogout={handleLogout}
      />
      <Component t={t} go={go} showToast={showToast} lang={lang} langs={langs} setLang={setLang} user={user} onLogout={handleLogout} onSignIn={entrar} {...pageProps} />
      <CTA t={t} go={go} />
      <Footer t={t} langs={langs} setLang={setLang} go={go} setLegal={setLegal} />
      {legal && <LegalModal t={t} legal={legal} onClose={() => setLegal(null)} />}
      {toast && <Toast text={toast} />}
    </div>
  )
}

// -----------------------------------------------------------------------------
//  La puerta del dashboard: dos «no» que NO se tratan igual
// -----------------------------------------------------------------------------
//  1. No hay sesion -> un boton que manda al SSO. Y es un BOTON, no un redirect
//     automatico: un redirect en el montaje es exactamente la forma en que se
//     arma un bucle cuando algo del otro lado falla, y el bucle no se ve en
//     desarrollo — se ve en produccion, con una persona mirando la pantalla
//     parpadear.
//  2. Hay sesion en el SSO pero la cuenta no esta habilitada en TR3SLOG (el 403
//     `forbidden` de `gateway.user`) -> NO se ofrece entrar de nuevo, porque
//     entrar de nuevo no lo arregla NUNCA: el SSO ya la conoce, el que falta es
//     TR3SLOG. Se muestra que hacer y el `request_id`, que es el unico dato con
//     el que soporte encuentra esta peticion entre los logs del gateway, del SSO
//     y del backend.
// `a` son los textos de i18n-auth.js en el idioma elegido: el modal viejo era
// trilingue y esta pantalla, que lo reemplaza, no puede ser menos.
function Puerta({ a, bloqueo, onEntrar, onSalir }) {
  const caja = { width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#EEF4FC' }
  const tarjeta = { width: '100%', maxWidth: 460, background: '#fff', borderRadius: 16, padding: 36, border: '1px solid #DCE6F5', boxShadow: '0 24px 80px rgba(0,0,0,.08)', textAlign: 'center' }
  const marca = { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', letterSpacing: '-.02em', marginBottom: 18 }
  const titulo = { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', margin: '0 0 12px' }
  const texto = { fontSize: 15, lineHeight: 1.65, color: '#10233F', margin: 0 }
  const boton = { marginTop: 22, padding: '14px 24px', background: '#087CF0', border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }

  return (
    <div style={caja}>
      <div style={tarjeta}>
        <div style={marca}>TR3<span style={{ color: '#D99A00' }}>S</span>LOG</div>

        {bloqueo ? (
          <>
            <h1 style={titulo}>{a.ssoBlockedTitle}</h1>
            <p style={texto}>{a.ssoBlockedText}</p>
            {bloqueo.requestId && (
              <p style={{ ...texto, marginTop: 14, fontSize: 13, color: '#6C82A6' }}>
                {a.ssoRef} <code>{bloqueo.requestId}</code>
              </p>
            )}
            <button type="button" onClick={onSalir} style={{ ...boton, background: '#10233F' }}>{a.ssoLogout}</button>
          </>
        ) : (
          <>
            <h1 style={titulo}>{a.ssoEnterTitle}</h1>
            <p style={texto}>{a.ssoEnterText}</p>
            <button type="button" onClick={onEntrar} style={boton}>{a.ssoEnterBtn}</button>
          </>
        )}
      </div>
    </div>
  )
}
