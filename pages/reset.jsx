import React from 'react'
import { useRouter } from 'next/router'
import { api } from '../src/api'
import { authI18n } from '../src/i18n-auth'

export default function Reset({ lang, showToast, go }) {
  const a = authI18n[lang] || authI18n.es
  const router = useRouter()
  const email = (router.query.email || '')
  const token = (router.query.token || '')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [error, setError] = React.useState('')
  const [ok, setOk] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    if (password.length < 8) {
      setError(a.errPass)
      return
    }
    if (password !== confirm) {
      setError(a.errMatch)
      return
    }
    setLoading(true)
    try {
      await api.reset({ email, token, password, password_confirmation: confirm })
      setOk(a.resetSent)
      showToast(a.resetSent)
      setTimeout(() => go('home'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#EEF4FC' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, padding: 36, border: '1px solid #DCE6F5', boxShadow: '0 24px 80px rgba(0,0,0,.08)' }}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 26, color: '#001B45', margin: '0 0 10px' }}>{a.resetT}</h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: '#10233F', margin: '0 0 24px' }}>{a.resetSub}</p>

        {error && (
          <div style={{ background: '#FDECEC', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}
        {ok && (
          <div style={{ background: '#F1FAF5', color: '#0F5F36', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{ok}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{a.email}</label>
            <input type="email" value={email} readOnly style={{ width: '100%', padding: 15, border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#6C82A6' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{a.newPass}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={a.passwordPh} style={{ width: '100%', padding: 15, border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{a.confirm}</label>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={a.passwordPh} style={{ width: '100%', padding: 15, border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: 16, background: loading ? '#8FC6F7' : '#087CF0', border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Procesando…' : a.resetBtn}
          </button>
        </form>
      </div>
    </div>
  )
}
