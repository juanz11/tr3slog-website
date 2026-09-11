import React from 'react'
import { api } from '../api'

// -----------------------------------------------------------------------------
//  El perfil esta PARTIDO, porque los datos ya no viven todos en el mismo lado
// -----------------------------------------------------------------------------
//  IDENTIDAD (la gobierna el SSO de MyGlobalHub, y es la misma persona en todas
//  las aplicaciones del ecosistema):
//    - `phone`  -> `PUT /api/v1/profile` del SSO, con el Bearer. Es la unica de
//                  las tres claves de este formulario que el SSO acepta tal cual.
//    - `name`   -> SOLO LECTURA aca. El contrato del SSO (§4.2) es explicito:
//                  «`name` es de solo lectura: se deriva de first_name y
//                  last_name». Mandarlo NO es un 200 que ignora la clave, es un
//                  422. Partir este campo en dos inputs (nombre y apellido) es la
//                  forma correcta y no se hace en este lote: necesita tres claves
//                  de i18n nuevas en tres idiomas y decidir como se migra el
//                  `name` de la gente que ya existe.  @todo Lote 8
//    - `email`  -> SOLO LECTURA, como ya era: lo gobierna Clerk.
//
//  DOMINIO (vive en TR3SLOG y el SSO no sabe que existe):
//    - `company` -> sigue yendo al backend, a `PUT /users/{id}`, igual que ayer.
//
//  ------- LO QUE HOY NO ANDA, Y POR QUE NO ES UN BUG DE ESTA PANTALLA ---------
//  Desde este lote la web entra con un token del SSO, y `PUT /users/{id}` esta
//  detras de `auth:sanctum`, que NO entiende ese token: responde 401 hasta que el
//  Lote 8 monte el resto del dominio detras del gateway. Por eso las dos mitades
//  se guardan por separado y se informan por separado — si se hicieran en un solo
//  `try`, el 401 de `company` se comeria el "telefono guardado" y la persona
//  volveria a intentar algo que ya funciono.
export default function Profile({ app, user, token, onUserUpdate }) {
  const p = app.prof
  const name = user?.name || ''
  const [company, setCompany] = React.useState(user?.company || '')
  const [phone, setPhone] = React.useState(user?.phone || '')
  const email = user?.email || ''
  const [loading, setLoading] = React.useState(false)
  const [ok, setOk] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
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

    const hechos = []
    const fallos = []

    // Identidad -> el SSO. Solo si cambio: un PUT de perfil que no cambia nada
    // igual gasta una peticion y puede fallar por otra cosa.
    if (phone !== (user?.phone || '')) {
      try {
        await api.updateSsoProfile({ phone }, token)
        hechos.push('Teléfono actualizado en MyGlobalHub.')
      } catch (err) {
        fallos.push(`Teléfono: ${err.message}`)
      }
    }

    // Dominio -> el backend de TR3SLOG.
    if (company !== (user?.company || '')) {
      try {
        await api.updateUser(user.id, { company }, token)
        hechos.push('Empresa actualizada en TR3SLOG.')
      } catch (err) {
        fallos.push(`Empresa: ${err.message}`)
      }
    }

    if (hechos.length && onUserUpdate) {
      onUserUpdate({ ...user, company, phone })
    }

    if (hechos.length) setOk(hechos.join(' '))
    if (fallos.length) setError(fallos.join(' · '))
    if (!hechos.length && !fallos.length) setOk(p.saved)

    setLoading(false)
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
            readOnly
            value={name}
            style={{
              width: '100%', padding: '14px 15px',
              border: '1.5px solid #DCE6F5', borderRadius: 11,
              background: '#F4F6FA', font: 'inherit', color: '#6C82A6',
              outline: 'none', cursor: 'not-allowed',
            }}
          />
          <span style={{ display: 'block', marginTop: 8, fontSize: 12, color: '#6C82A6' }}>
            Tu nombre y tu correo se administran en tu cuenta de MyGlobalHub.
          </span>
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
