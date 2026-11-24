import React from 'react'
import { useRouter } from 'next/router'
import { api } from '../src/api'

/* Página de aceptación de invitación de empresa (agente de envíos).
   El correo de invitación apunta a /register?token=... */
export default function Register() {
  const router = useRouter()
  const token = router.query.token
  const [state, setState] = React.useState('loading') // loading | ready | invalid | done
  const [invite, setInvite] = React.useState(null)
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    if (!router.isReady) return
    if (!token) { setState('invalid'); return }
    api.verifyInvitation(token)
      .then((res) => { setInvite(res.invitation); setState('ready') })
      .catch(() => setState('invalid'))
  }, [router.isReady, token])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
      setError('La contraseña debe tener 8+ caracteres, una mayúscula, un número y un símbolo.')
      return
    }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    setBusy(true)
    try {
      await api.acceptInvitation({ token, password })
      // Login automático con la cuenta recién creada
      const res = await api.login({ email: invite.email, password })
      try { localStorage.setItem('tr3slog-token', res.token) } catch (e) {}
      setState('done')
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch (err) {
      const errs = err?.body?.errors || {}
      const first = Object.values(errs).flat()[0]
      setError(first || err.message || 'No se pudo crear la cuenta.')
      setBusy(false)
    }
  }

  const wrap = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EEF4FC', padding: 24, fontFamily: 'inherit' }
  const card = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 36, width: 440, maxWidth: '100%', boxShadow: '0 12px 40px rgba(16,35,63,.08)' }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45' }}>TR3<span style={{ color: '#D99A00' }}>S</span>LOG</div>

        {state === 'loading' && <p style={{ marginTop: 24, color: '#6C82A6', fontSize: 14 }}>Verificando invitación…</p>}

        {state === 'invalid' && (
          <>
            <h1 style={{ fontSize: 18, color: '#001B45', margin: '20px 0 8px' }}>Invitación no válida</h1>
            <p style={{ color: '#6C82A6', fontSize: 14, lineHeight: 1.6 }}>El enlace expiró o ya fue utilizado. Pide al propietario de la empresa que te reenvíe la invitación.</p>
            <button onClick={() => router.push('/')} style={{ marginTop: 20, padding: '11px 20px', borderRadius: 10, border: 'none', background: '#001B45', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Ir al inicio</button>
          </>
        )}

        {state === 'ready' && invite && (
          <>
            <h1 style={{ fontSize: 18, color: '#001B45', margin: '20px 0 8px' }}>Crear tu cuenta de agente</h1>
            <p style={{ color: '#6C82A6', fontSize: 14, lineHeight: 1.6 }}>
              {invite.company_name ? <>Te invitaron a unirte a <b style={{ color: '#001B45' }}>{invite.company_name}</b> como agente de envíos. </> : ''}
              Crearás envíos contra el contrato de la empresa, sin pago por envío.
            </p>
            <form onSubmit={submit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }}>Nombre</label>
                <input value={invite.name || ''} disabled style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#F6FAFF', color: '#10233F', fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }}>Correo</label>
                <input value={invite.email || ''} disabled style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#F6FAFF', color: '#10233F', fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }}>Contraseña</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mín. 8 caracteres, mayúscula, número y símbolo" style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#EEF4FC', color: '#001B45', fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }}>Confirmar contraseña</label>
                <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#EEF4FC', color: '#001B45', fontSize: 14, outline: 'none' }} />
              </div>
              {error && <div style={{ background: '#FDECEC', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>{error}</div>}
              <button type="submit" disabled={busy} style={{ padding: '13px', borderRadius: 11, border: 'none', background: busy ? '#8FC6F7' : '#087CF0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: busy ? 'wait' : 'pointer' }}>
                {busy ? 'Creando cuenta…' : 'Crear cuenta y entrar'}
              </button>
            </form>
          </>
        )}

        {state === 'done' && (
          <p style={{ marginTop: 24, color: '#0F5F36', fontSize: 14, fontWeight: 600 }}>Cuenta creada. Entrando a tu panel…</p>
        )}
      </div>
    </div>
  )
}
