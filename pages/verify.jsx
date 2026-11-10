import React from 'react'
import { api } from '../src/api'

const NAVY = '#001B45'
const BLUE = '#087CF0'
const CARD = {
  width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24,
  padding: '40px 32px', boxShadow: '0 24px 64px rgba(0,27,69,.18)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
}
const INPUT = {
  width: '100%', padding: '15px 16px', border: '1.5px solid #DCE6F5',
  borderRadius: 12, background: '#EEF4FC', fontSize: 17, letterSpacing: '.3em',
  textAlign: 'center', color: NAVY, outline: 'none', boxSizing: 'border-box',
}
const BTN = {
  width: '100%', padding: '15px 16px', border: 'none', borderRadius: 12,
  background: BLUE, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
}

export default function VerifyPage() {
  const [step, setStep] = React.useState(1)
  const [email, setEmail] = React.useState('')
  const [phoneNeeded, setPhoneNeeded] = React.useState(true)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setEmail(q.get('email') || '')
    if (q.get('step') === '2') setStep(2)
    if (q.get('phone') === '0') setPhoneNeeded(false)
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (loading || !code.trim()) return
    setError('')
    setLoading(true)
    try {
      if (step === 1) {
        await api.verifyCode({ email, code: code.trim() })
        if (!phoneNeeded) {
          window.location.href = '/dashboard'
          return
        }
        setCode('')
        setStep(2)
      } else {
        const res = await api.verifyPhone({ email, code: code.trim() })
        localStorage.setItem('tr3slog-token', res.token)
        window.location.href = '/dashboard'
        return
      }
    } catch (err) {
      setError(err.message === 'invalid_code' ? 'Código inválido. Inténtalo de nuevo.' : (err.message || 'Error'))
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${NAVY} 0%, #02306E 55%, ${BLUE} 130%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: '"Noto Sans", sans-serif' }}>
      <div style={CARD}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 26, color: NAVY, letterSpacing: '.04em' }}>TR3SLOG</div>
        <div style={{ width: 44, height: 4, borderRadius: 99, background: BLUE }}></div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', color: '#6C82A6', textTransform: 'uppercase' }}>
          Paso {step} de 2
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 36, height: 5, borderRadius: 99, background: BLUE }}></span>
          <span style={{ width: 36, height: 5, borderRadius: 99, background: step === 2 ? BLUE : '#DCE6F5' }}></span>
        </div>

        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 20, color: NAVY, textAlign: 'center' }}>
          {step === 1 ? 'Verifica tu correo' : 'Verifica tu número telefónico'}
        </div>
        <div style={{ fontSize: 13, color: '#6C82A6', textAlign: 'center', lineHeight: 1.55 }}>
          {step === 1
            ? <>Ingresa el código de 6 dígitos enviado a <b>{email || 'tu correo'}</b>.</>
            : 'Ingresa el código enviado por SMS a tu número telefónico.'}
        </div>

        <form onSubmit={submit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder={step === 1 ? '------' : '----'}
            style={INPUT}
            autoFocus
          />
          {error && <div style={{ fontSize: 13, color: '#C0392B', textAlign: 'center' }}>{error}</div>}
          <button type="submit" style={BTN} disabled={loading}>
            {loading ? 'Verificando…' : step === 1 ? 'Verificar correo' : 'Verificar teléfono'}
          </button>
        </form>

        <div style={{ fontSize: 11, color: '#8B9DBA', textAlign: 'center' }}>
          TR3SLOG · Verificación de cuenta
        </div>
      </div>
    </div>
  )
}
