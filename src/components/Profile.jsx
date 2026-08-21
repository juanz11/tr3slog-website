import React from 'react'
import { api } from '../api'

export default function Profile({ app, user, token, onUserUpdate }) {
  const p = app.prof
  const [name, setName] = React.useState(user?.name || '')
  const [company, setCompany] = React.useState(user?.company || '')
  const [phone, setPhone] = React.useState(user?.phone || '')
  const email = user?.email || ''
  const [loading, setLoading] = React.useState(false)
  const [ok, setOk] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    setName(user?.name || '')
    setCompany(user?.company || '')
    setPhone(user?.phone || '')
  }, [user])

  const submit = async (e) => {
    e.preventDefault()
    setOk('')
    setError('')
    if (!token) {
      setError('Inicie sesión.')
      return
    }
    if (!user?.id) {
      setError(p.error)
      return
    }
    setLoading(true)
    try {
      const payload = { name, company, phone }
      const data = await api.updateUser(user.id, payload, token)
      setOk(p.saved)
      const updated = data?.user
      if (onUserUpdate) {
        onUserUpdate(updated ? { ...user, ...updated } : { ...user, name, company, phone })
      }
    } catch (err) {
      setError(err.message || p.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        <span style={{ width: 24, height: 5, background: '#D99A00', transform: 'skewX(-24deg)' }}></span>
        <span style={{ width: 9, height: 5, background: '#087CF0', transform: 'skewX(-24deg)' }}></span>
      </div>

      <h1 style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: '-.02em',
        margin: '0 0 20px',
        color: '#001B45',
      }}>{p.title}</h1>

      {ok && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', borderRadius: 8,
          background: '#F1FAF5', color: '#0F5F36', fontSize: 14,
        }}>{ok}</div>
      )}
      {error && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', borderRadius: 8,
          background: '#FDECEC', color: '#B91C1C', fontSize: 14,
        }}>{error}</div>
      )}

      <form onSubmit={submit} style={{
        background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16,
        padding: 26, display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <label style={{ display: 'block' }}>
          <span style={{
            display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8,
          }}>{p.name}</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%', padding: '14px 15px',
              border: '1.5px solid #DCE6F5', borderRadius: 11,
              background: '#EEF4FC', font: 'inherit', color: '#001B45',
              outline: 'none',
            }}
          />
        </label>

        <label style={{ display: 'block' }}>
          <span style={{
            display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8,
          }}>{p.company}</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: '100%', padding: '14px 15px',
              border: '1.5px solid #DCE6F5', borderRadius: 11,
              background: '#EEF4FC', font: 'inherit', color: '#001B45',
              outline: 'none',
            }}
          />
        </label>

        <label style={{ display: 'block' }}>
          <span style={{
            display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8,
          }}>{p.phone}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: '100%', padding: '14px 15px',
              border: '1.5px solid #DCE6F5', borderRadius: 11,
              background: '#EEF4FC', font: 'inherit', color: '#001B45',
              outline: 'none',
            }}
          />
        </label>

        <label style={{ display: 'block' }}>
          <span style={{
            display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8,
          }}>{p.email}</span>
          <input
            type="email"
            readOnly
            value={email}
            style={{
              width: '100%', padding: '14px 15px',
              border: '1.5px solid #DCE6F5', borderRadius: 11,
              background: '#F4F6FA', font: 'inherit', color: '#6C82A6',
              outline: 'none', cursor: 'not-allowed',
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8, padding: '14px 24px',
            background: loading ? '#8FC6F7' : '#087CF0',
            border: 'none', borderRadius: 11, color: '#fff',
            fontSize: 14, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          {loading ? 'Procesando…' : p.save}
        </button>
      </form>
    </div>
  )
}
