import React from 'react'
import { i18n, langList } from './i18n'
import { api } from './api'
import Header from './components/Header'
import Footer from './components/Footer'
import CTA from './components/CTA'
import Toast from './components/Toast'
import LegalModal from './components/LegalModal'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import Services from './pages/Services'
import Track from './pages/Track'
import Quote from './pages/Quote'
import Pickup from './pages/Pickup'
import Coverage from './pages/Coverage'
import How from './pages/How'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'

const LANGS = ['en', 'es', 'zh-CN']
const STORE = 'tr3slog.lang'

export default function App() {
  const [lang, setLangState] = React.useState('es')
  const [page, setPage] = React.useState('home')
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [toast, setToast] = React.useState('')
  const [legal, setLegal] = React.useState(null)
  const [user, setUser] = React.useState(null)
  const [authOpen, setAuthOpen] = React.useState(false)
  const toastTimer = React.useRef(null)

  React.useEffect(() => {
    let saved = null
    try { saved = localStorage.getItem(STORE) } catch (e) {}
    const nl = (navigator.language || '').toLowerCase()
    const guess = nl.indexOf('zh') === 0 ? 'zh-CN' : (nl.indexOf('en') === 0 ? 'en' : 'es')
    const l = LANGS.indexOf(saved) >= 0 ? saved : guess
    document.documentElement.lang = l
    setLangState(l)
  }, [])

  React.useEffect(() => () => {
    clearTimeout(toastTimer.current)
  }, [])

  React.useEffect(() => {
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

  const t = i18n[lang] || i18n.es

  const handleLogin = (u, token) => {
    setUser(u)
    try { localStorage.setItem('tr3slog-token', token) } catch (e) {}
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
  }

  const go = (p) => {
    setPage(p)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const langs = langList.map(l => {
    const on = l.code === lang
    return {
      label: l.label, name: l.name, code: l.code,
      bg: on ? '#001B45' : 'transparent',
      fg: on ? '#fff' : '#10233F',
      footBg: on ? '#087CF0' : 'transparent',
      footFg: '#fff',
    }
  })

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home t={t} go={go} showToast={showToast} />
      case 'services': return <Services t={t} go={go} />
      case 'track': return <Track t={t} go={go} />
      case 'quote': return <Quote t={t} go={go} showToast={showToast} />
      case 'pickup': return <Pickup t={t} go={go} showToast={showToast} />
      case 'coverage': return <Coverage t={t} go={go} />
      case 'how': return <How t={t} />
      case 'about': return <About t={t} />
      case 'contact': return <Contact t={t} go={go} showToast={showToast} />
      case 'faq': return <FAQ t={t} />
      default: return <Home t={t} go={go} showToast={showToast} />
    }
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
      {renderPage()}
      <CTA t={t} go={go} />
      <Footer t={t} langs={langs} setLang={setLang} go={go} setLegal={setLegal} />
      {legal && <LegalModal t={t} legal={legal} onClose={() => setLegal(null)} />}
      {toast && <Toast text={toast} />}
      {authOpen && <AuthModal t={t} lang={lang} langs={langs} setLang={setLang} onClose={() => setAuthOpen(false)} onLogin={handleLogin} setLegal={setLegal} />}
    </div>
  )
}
