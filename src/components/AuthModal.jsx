import React from 'react'
import { api, MEDIA_URL } from '../api'
import { authI18n } from '../i18n-auth'
import { COUNTRY_NAMES, PHONE_FORMATS } from '../lib/countries'

export default function AuthModal({ t, lang, langs, setLang, onClose, onLogin, setLegal }) {
  const a = authI18n[lang] || authI18n.es
  const [mode, setMode] = React.useState('login')
  const [name, setName] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [country, setCountry] = React.useState('')
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
    setCountry('')
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
      if (!country) {
        setError(a.errCountry)
        setErrorKey('country')
        return false
      }
      if (!phone.trim() || (PHONE_FORMATS[country] && !PHONE_FORMATS[country].pattern.test(phone.trim()))) {
        setError(a.errPhoneFmt.replace('{country}', COUNTRY_NAMES[country]).replace('{example}', PHONE_FORMATS[country] ? PHONE_FORMATS[country].example : ''))
        setErrorKey('phone')
        return false
      }
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
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
        : { name, company, email, phone, country, password, password_confirmation: passwordConfirmation }
      const res = mode === 'login'
        ? await api.login(payload)
        : await api.register(payload)
      onLogin(res.user, res.token)
      onClose()
    } catch (err) {
      const knownCodes = ['account_not_found', 'invalid_credentials']
      setError(knownCodes.includes(err.message) ? a.errCreds : (err.message || a.errCreds))
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
          <img
            src={`${MEDIA_URL}/tr3slog-10.webp`}
            alt="TR3SLOG"
            className="auth-logo-art"
          />
          <div style={{ position: 'relative' }}>
            <h2 className="auth-title-art">{t.home.title}</h2>
            <p className="auth-sub-art">{t.foot.tagline}</p>
          </div>
        </div>

        <div className="auth-form-wrap" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'none',
              border: 'none',
              fontSize: 24,
              lineHeight: 1,
              cursor: 'pointer',
              color: '#6C82A6',
              padding: 4,
            }}
          >
            ✕
          </button>
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
                      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
                        <select
                          required
                          value={country} onChange={(e) => setCountry(e.target.value)}
                          className={inputBorder('country')}
                          style={{ flex: '0 0 90px', padding: '14px 12px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', color: '#001B45', font: 'inherit', fontSize: 13, cursor: 'pointer' }}
                        >
                          <option value="">{a.country}</option>
                          {Object.keys(PHONE_FORMATS).map((k) => (
                            <option key={k} value={k}>
                              {PHONE_FORMATS[k].code} {k}
                            </option>
                          ))}
                        </select>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input
                            type="tel"
                            inputMode="tel"
                            required
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                            placeholder={country && PHONE_FORMATS[country] ? PHONE_FORMATS[country].example : a.phonePh}
                            className={inputBorder('phone')}
                            style={{ flex: 1 }}
                          />
                          {country && PHONE_FORMATS[country] && (
                            <span style={{ fontSize: 12, color: '#8B9DBA', whiteSpace: 'nowrap' }}>
                              Ej: {PHONE_FORMATS[country].example}
                            </span>
                          )}
                        </div>
                      </div>
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
                    <div onClick={() => setTerms(!terms)} className="auth-check" role="button" tabIndex={0}>
                      <span className={`auth-check-box ${terms ? 'on' : ''}`}>{terms ? '✓' : ''}</span>
                      <span className="auth-check-label">
                        Acepto los{' '}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setLegal('terms'); }}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#087CF0', fontSize: 14, fontWeight: 600 }}
                        >
                          {a.termsLink}
                        </button>
                        {' '}y la{' '}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setLegal('privacy'); }}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#087CF0', fontSize: 14, fontWeight: 600 }}
                        >
                          {a.privacyLink}
                        </button>
                      </span>
                    </div>
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
