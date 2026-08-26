import React from 'react'
import { MEDIA_URL } from '../api'

export default function Header({ t, langs, setLang, page, go, menuOpen, setMenuOpen, user, onSignIn, onLogout }) {
  const navKeys = ['home', 'services', 'track', 'coverage', 'about', 'contact']
  const allKeys = ['home', 'services', 'track', 'quote', 'pickup', 'coverage', 'how', 'about', 'contact', 'faq']

  const navItem = (k) => ({
    label: t.nav[k],
    active: page === k,
    go: () => go(k),
  })

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 60,
      background: 'rgba(255,255,255,.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #DCE6F5',
    }}>
      <div className="section-pad" style={{
        maxWidth: 1240, margin: '0 auto',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => go('home')} style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', flex: '0 0 auto',
        }}>
          <img
            src={`${MEDIA_URL}/tr3slog-01.webp`}
            alt="TR3SLOG"
            style={{ height: 50, width: 'auto', objectFit: 'contain' }}
          />
        </button>

        <nav className="desk-only" style={{
          display: 'flex', alignItems: 'center', gap: 22, marginLeft: 'auto',
        }}>
          {navKeys.map(k => {
            const item = navItem(k)
            return (
              <button key={k} onClick={item.go} style={{
                background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer',
                fontSize: 14, fontWeight: item.active ? 600 : 500,
                color: item.active ? '#001B45' : '#10233F',
                borderBottom: `2px solid ${item.active ? '#087CF0' : 'transparent'}`,
              }}>{item.label}</button>
            )
          })}
        </nav>

        <div className="desk-only" style={{
          display: 'flex', alignItems: 'center', gap: 2,
          padding: 4, border: '1px solid #DCE6F5', borderRadius: 100,
          flex: '0 0 auto',
        }}>
          {langs.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)} title={l.name} style={{
              padding: '7px 12px', border: 'none', borderRadius: 100,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: l.bg, color: l.fg,
            }}>{l.label}</button>
          ))}
        </div>

        <div className="desk-only" style={{
          display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto',
        }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#001B45' }}>{user.name}</span>
              <button onClick={() => go('dashboard')} style={{
                padding: '12px 18px', background: '#fff',
                border: '1.5px solid #DCE6F5', borderRadius: 10,
                color: '#001B45', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>{t.common.dashboard}</button>
              <button onClick={onLogout} style={{
                padding: '12px 18px', background: '#fff',
                border: '1.5px solid #DCE6F5', borderRadius: 10,
                color: '#001B45', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Cerrar sesión</button>
            </>
          ) : (
            <button onClick={onSignIn} style={{
              padding: '12px 18px', background: '#fff',
              border: '1.5px solid #DCE6F5', borderRadius: 10,
              color: '#001B45', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{t.common.signin}</button>
          )}
          <button onClick={() => go('quote')} style={{
            padding: '13px 20px', background: '#087CF0',
            border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>{t.common.quote}</button>
        </div>

        <button className="mob-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{
          display: 'none', marginLeft: 'auto',
          alignItems: 'center', justifyContent: 'center',
          width: 46, height: 46, border: '1.5px solid #DCE6F5',
          borderRadius: 12, background: '#fff', cursor: 'pointer',
          color: '#001B45', flex: '0 0 auto',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="section-pad" style={{
          borderTop: '1px solid #DCE6F5', background: '#fff',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {allKeys.map(k => {
              const item = navItem(k)
              return (
                <button key={k} onClick={item.go} style={{
                  background: 'none', border: 'none', textAlign: 'left',
                  padding: '13px 0', borderBottom: '1px solid #E3EBF7',
                  cursor: 'pointer', fontSize: 16, fontWeight: 600,
                  color: item.active ? '#087CF0' : '#10233F',
                }}>{item.label}</button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {langs.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} style={{
                flex: 1, padding: 13, border: '1.5px solid #DCE6F5',
                borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: l.bg, color: l.fg,
              }}>{l.name}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user ? (
              <>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#001B45', textAlign: 'center' }}>{user.name}</span>
                <button onClick={() => { go('dashboard'); setMenuOpen(false) }} style={{
                  padding: 15, background: '#fff', border: '1.5px solid #DCE6F5',
                  borderRadius: 10, color: '#001B45', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>{t.common.dashboard}</button>
                <button onClick={onLogout} style={{
                  padding: 15, background: '#fff', border: '1.5px solid #DCE6F5',
                  borderRadius: 10, color: '#001B45', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>Cerrar sesión</button>
              </>
            ) : (
              <button onClick={onSignIn} style={{
                padding: 15, background: '#fff', border: '1.5px solid #DCE6F5',
                borderRadius: 10, color: '#001B45', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{t.common.signin}</button>
            )}
            <button onClick={() => go('quote')} style={{
              padding: 15, background: '#087CF0', border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{t.common.quote}</button>
          </div>
        </div>
      )}
    </header>
  )
}
