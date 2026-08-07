import React from 'react'
import { api } from '../api'
import { authI18n } from '../i18n-auth'

export default function AuthModal({ t, lang, langs, setLang, onClose, onLogin }) {
  const a = authI18n[lang] || authI18n.es
  const [mode, setMode] = React.useState('login')
  const [name, setName] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')
  const [remember, setRemember] = React.useState(false)
  const [terms, setTerms] = React.useState(false)
  const [error, setError] = React.useState('')
  const [errorKey, setErrorKey] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const reset = () => {
    setName('')
    setCompany('')
    setEmail('')
    setPhone('')
    setPassword('')
    setPasswordConfirmation('')
    setRemember(false)
    setTerms(false)
    setError('')
    setErrorKey('')
    setSuccess('')
  }

  React.useEffect(() => {
    reset()
  }, [mode])

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const validate = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(a.errEmail)
      setErrorKey('email')
      return false
    }
    if (mode === 'forgot') return true
    if (mode === 'signup') {
      if (!name.trim()) {
        setError(t.common.required)
        setErrorKey('name')
        return false
      }
      if (password.length < 8) {
        setError(a.errPass)
        setErrorKey('password')
        return false
      }
      if (password !== passwordConfirmation) {
        setError(a.errMatch)
        setErrorKey('confirm')
        return false
      }
      if (!terms) {
        setError(a.errTerms)
        setErrorKey('terms')
        return false
      }
    } else {
      if (!password) {
        setError(t.common.required)
        setErrorKey('password')
        return false
      }
    }
    return true
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setErrorKey('')
    setSuccess('')
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'forgot') {
        await api.forgot({ email })
        setSuccess(a.resetSent)
        setLoading(false)
        return
      }
      const payload = mode === 'login'
        ? { email, password }
        : { name, company, email, phone, password, password_confirmation: passwordConfirmation }
      const res = mode === 'login'
        ? await api.login(payload)
        : await api.register(payload)
      onLogin(res.user, res.token)
      onClose()
    } catch (err) {
      setError(err.message || a.errCreds)
      setErrorKey('email')
    } finally {
      setLoading(false)
    }
  }

  const inputBorder = (key) => errorKey === key ? 'auth-input auth-input-err' : 'auth-input'

  return (
    <div className="auth-screen">
      <div className="auth-split">
        <div className="auth-art">
          <div className="auth-logo-text">
            <span>TR3</span>
            <span style={{ color: '#D99A00' }}>S</span>
            <span>LOG</span>
          </div>
          <div style={{ marginTop: 'auto', position: 'relative' }}>
            <h2 className="auth-title-art">{t.home.title}</h2>
            <p className="auth-sub-art">{t.foot.tagline}</p>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-inner">
            <div className="auth-langs">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className="auth-lang-btn"
                  style={{ background: l.bg, color: l.fg, borderColor: l.border }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <h1 className="auth-h1">
              {mode === 'login' ? a.signinT : (mode === 'signup' ? a.signupT : a.resetT)}
            </h1>
            <p className="auth-sub">
              {mode === 'login' ? a.signinSub : (mode === 'signup' ? a.signupSub : a.resetSub)}
            </p>

            {mode !== 'forgot' && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <button onClick={() => setMode('login')} style={{
                  flex: 1, padding: 10, border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: mode === 'login' ? '#087CF0' : '#E3EBF7', color: mode === 'login' ? '#fff' : '#10233F',
                }}>{a.signinBtn}</button>
                <button onClick={() => setMode('signup')} style={{
                  flex: 1, padding: 10, border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: mode === 'signup' ? '#087CF0' : '#E3EBF7', color: mode === 'signup' ? '#fff' : '#10233F',
                }}>{a.signupBtn}</button>
              </div>
            )}

            {error && (
              <div style={{ background: '#FDECEC', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: '#F1FAF5', color: '#0F5F36', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                {success}
              </div>
            )}

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mode === 'forgot' ? (
                <div>
                  <label className="auth-label">{a.email}</label>
                  <input
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder={a.emailPh}
                    className={inputBorder('email')}
                  />
                </div>
              ) : (
                <>
                  {mode === 'signup' && (
                    <>
                      <div>
                        <label className="auth-label">{a.name}</label>
                        <input
                          type="text" required
                          value={name} onChange={(e) => setName(e.target.value)}
                          placeholder={a.namePh}
                          className={inputBorder('name')}
                        />
                      </div>
                      <div>
                        <label className="auth-label">{a.company}</label>
                        <input
                          type="text"
                          value={company} onChange={(e) => setCompany(e.target.value)}
                          placeholder={a.companyPh}
                          className={inputBorder('company')}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="auth-label">{a.email}</label>
                    <input
                      type="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={a.emailPh}
                      className={inputBorder('email')}
                    />
                  </div>
                  {mode === 'signup' && (
                    <div>
                      <label className="auth-label">{a.phone}</label>
                      <input
                        type="tel"
                        value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder={a.phonePh}
                        className={inputBorder('phone')}
                      />
                    </div>
                  )}
                  <div>
                    <label className="auth-label">{a.password}</label>
                    <input
                      type="password" required
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder={a.passwordPh}
                      className={inputBorder('password')}
                    />
                  </div>
                  {mode === 'signup' && (
                    <div>
                      <label className="auth-label">{a.confirm}</label>
                      <input
                        type="password" required
                        value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder={a.passwordPh}
                        className={inputBorder('confirm')}
                      />
                    </div>
                  )}

                  {mode === 'signup' && (
                    <button type="button" onClick={() => setTerms(!terms)} className="auth-check">
                      <span className={`auth-check-box ${terms ? 'on' : ''}`}>{terms ? '✓' : ''}</span>
                      <span className="auth-check-label">{a.terms}</span>
                    </button>
                  )}

                  {mode === 'login' && (
                    <div className="auth-check-row">
                      <button type="button" onClick={() => setRemember(!remember)} className="auth-check">
                        <span className={`auth-check-box ${remember ? 'on' : ''}`}>{remember ? '✓' : ''}</span>
                        <span className="auth-check-label">{a.remember}</span>
                      </button>
                      <button type="button" onClick={() => setMode('forgot')} className="auth-forgot">{a.forgot}</button>
                    </div>
                  )}
                </>
              )}

              <button type="submit" disabled={loading} className="auth-submit">
                {loading ? 'Procesando…' : (mode === 'forgot' ? a.resetBtn : (mode === 'login' ? a.signinBtn : a.signupBtn))}
              </button>

              {mode === 'forgot' ? (
                <div className="auth-alt">
                  <span>{a.back}</span>
                  <button type="button" onClick={() => setMode('login')} className="auth-alt-link">{a.signinLink}</button>
                </div>
              ) : (
                <div className="auth-alt">
                  <span>{mode === 'login' ? a.noAccount : a.haveAccount}</span>
                  <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="auth-alt-link">
                    {mode === 'login' ? a.createLink : a.signinLink}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
