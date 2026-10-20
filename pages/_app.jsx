import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { i18n, langList } from '../src/i18n'
import { api } from '../src/api'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import CTA from '../src/components/CTA'
import Toast from '../src/components/Toast'
import LegalModal from '../src/components/LegalModal'
import AuthModal from '../src/components/AuthModal'

import '../src/index.css'
import '../src/components/AuthModal.css'
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
  const [authOpen, setAuthOpen] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [notifToast, setNotifToast] = useState(null)
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
      let token = null
      try { token = localStorage.getItem('tr3slog-token') } catch (e) {}
      if (token) {
        try {
          const data = await api.me(token)
          const u = data?.user || data?.data || data
          if (active) setUser(u)
        } catch (e) {
          try { localStorage.removeItem('tr3slog-token') } catch (e) {}
        }
      }
      if (active) setAuthReady(true)
    }
    verify()
    return () => { active = false }
  }, [])

  // Poll personal notifications for the logged-in user, on every page/portal.
  // Unread alerts pop on every refresh until the user opens them (marked read).
  useEffect(() => {
    if (!user) return
    let token = null
    try { token = localStorage.getItem('tr3slog-token') } catch (e) {}
    if (!token) return
    const fetchNotifs = async () => {
      try {
        const notifs = await api.getNotifications(token)
        const list = Array.isArray(notifs) ? notifs : notifs.data || []
        const unread = list.filter((n) => !n.read_at)
        if (unread.length) setNotifToast(unread[0])
      } catch (e) {}
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    if (!notifToast) return
    const t = setTimeout(() => setNotifToast(null), 15000)
    return () => clearTimeout(t)
  }, [notifToast])

  const openNotif = () => {
    const n = notifToast
    setNotifToast(null)
    try {
      const token = localStorage.getItem('tr3slog-token')
      if (token) api.markNotificationRead(n.id, token).catch(() => {})
    } catch (e) {}
    router.push('/dashboard')
  }

  const NotifCard = () => (
    <button
      onClick={openNotif}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
        display: 'flex', alignItems: 'center', gap: 12, maxWidth: 380,
        padding: '14px 18px', border: 'none', borderRadius: 12,
        background: '#001B45', color: '#fff', cursor: 'pointer',
        boxShadow: '0 12px 32px rgba(0,27,69,.35)', font: 'inherit', textAlign: 'left',
      }}
    >
      <span style={{
        width: 34, height: 34, borderRadius: 10, background: '#C0392B',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      </span>
      <span>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>{notifToast.title}</span>
        <span style={{ display: 'block', fontSize: 12, color: '#C6D6EF' }}>{notifToast.body}</span>
      </span>
    </button>
  )


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

  const handleLogin = (u, token) => {
    setUser(u)
    try { localStorage.setItem('tr3slog-token', token) } catch (e) {}
    if (typeof window !== 'undefined') {
      router.push('/dashboard')
    }
  }

  const handleLogout = async () => {
    if (user) {
      let token = null
      try { token = localStorage.getItem('tr3slog-token') } catch (e) {}
      if (token) {
        try { await api.logout(token) } catch (e) {}
      }
    }
    setUser(null)
    try { localStorage.removeItem('tr3slog-token') } catch (e) {}
    showToast('Sesión cerrada')
    router.push('/')
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
          <AuthModal
            t={t}
            lang={lang}
            langs={langs}
            setLang={setLang}
            onClose={() => router.push('/')}
            onLogin={handleLogin}
            setLegal={setLegal}
          />
        )}
        {toast && <Toast text={toast} />}
        {notifToast && <NotifCard />}
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
        onSignIn={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />
      <Component t={t} go={go} showToast={showToast} lang={lang} langs={langs} setLang={setLang} user={user} onLogout={handleLogout} onSignIn={() => setAuthOpen(true)} {...pageProps} />
      <CTA t={t} go={go} />
      <Footer t={t} langs={langs} setLang={setLang} go={go} setLegal={setLegal} />
      {legal && <LegalModal t={t} legal={legal} onClose={() => setLegal(null)} />}
      {toast && <Toast text={toast} />}
      {authOpen && <AuthModal t={t} lang={lang} langs={langs} setLang={setLang} onClose={() => setAuthOpen(false)} onLogin={handleLogin} setLegal={setLegal} />}
      {notifToast && <NotifCard />}
    </div>
  )
}
