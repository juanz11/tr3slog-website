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
  const toastTimer = useRef(null)

  useEffect(() => {
    let saved = null
    try { saved = localStorage.getItem(STORE) } catch (e) {}
    const nl = (navigator.language || '').toLowerCase()
    const guess = nl.indexOf('zh') === 0 ? 'zh-CN' : (nl.indexOf('en') === 0 ? 'en' : 'es')
    const l = LANGS.indexOf(saved) >= 0 ? saved : guess
    document.documentElement.lang = l
    setLangState(l)
  }, [])

  useEffect(() => () => {
    clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => {
    let token = null
    try { token = localStorage.getItem('tr3slog-token') } catch (e) {}
    if (token) {
      api.me(token).then((data) => {
        setUser(data)
      }).catch(() => {
        try { localStorage.removeItem('tr3slog-token') } catch (e) {}
      })
    }
  }, [])

  useEffect(() => {
    if (router.pathname === '/dashboard' && !user) {
      setAuthOpen(true)
    }
  }, [router.pathname, user])

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
    return (
      <div style={{ width: '100%', overflowX: 'hidden' }}>
        {user ? (
          <Component
            user={user}
            onLogout={handleLogout}
            lang={lang}
            langs={langs}
            setLang={setLang}
            {...pageProps}
          />
        ) : (
          authOpen && (
            <AuthModal
              t={t}
              lang={lang}
              langs={langs}
              setLang={setLang}
              onClose={() => router.push('/')}
              onLogin={handleLogin}
            />
          )
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
        onSignIn={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />
      <Component t={t} go={go} showToast={showToast} {...pageProps} />
      <CTA t={t} go={go} />
      <Footer t={t} langs={langs} setLang={setLang} go={go} setLegal={setLegal} />
      {legal && <LegalModal t={t} legal={legal} onClose={() => setLegal(null)} />}
      {toast && <Toast text={toast} />}
      {authOpen && <AuthModal t={t} lang={lang} langs={langs} setLang={setLang} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />}
    </div>
  )
}
