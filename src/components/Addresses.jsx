import React from 'react'
import { api } from '../api'

const COUNTRY_OPTIONS = [
  { code: 'AF', name: 'Afganistán' },
  { code: 'AL', name: 'Albania' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CA', name: 'Canadá' },
  { code: 'CH', name: 'Suiza' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DE', name: 'Alemania' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egipto' },
  { code: 'ES', name: 'España' },
  { code: 'FR', name: 'Francia' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'IT', name: 'Italia' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japón' },
  { code: 'KR', name: 'Corea del Sur' },
  { code: 'MX', name: 'México' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NL', name: 'Países Bajos' },
  { code: 'PA', name: 'Panamá' },
  { code: 'PE', name: 'Perú' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Rusia' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'ZA', name: 'Sudáfrica' },
]

const ZIP_PATTERNS = {
  PR: /^\d{5}(-\d{4})?$/,
  US: /^\d{5}(-\d{4})?$/,
  DO: /^\d{5}$/,
  JM: /^[A-Z0-9\s-]{3,10}$/i,
  KR: /^\d{5}$/,
  JP: /^\d{3}[- ]?\d{4}$/,
  CN: /^\d{6}$/,
  VE: /^\d{4,5}$/,
  UY: /^\d{5}$/,
}

const PHONE_PATTERNS = {
  PR: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/,
  DO: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/,
  US: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/,
  JM: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/,
  KR: /^(\+82\s?)?\d{2,3}[-.\s]?\d{3,4}[-.\s]?\d{4}$/,
  JP: /^(\+81\s?)?\d{1,2}[-.\s]?\d{4}[-.\s]?\d{4}$/,
  CN: /^(\+86\s?)?\d{11}$/,
  VE: /^(\+58\s?)?\d{3}\s?\d{7}$/,
  UY: /^(\+598\s?)?\d{2,3}\s?\d{3}\s?\d{3}$/,
}

const FIELD_KEYS = ['name', 'address', 'country', 'city', 'zip', 'contact', 'phone', 'instructions']
const TYPE_STRINGS = ['pickup', 'delivery', 'billing']

function backendToRow(addr) {
  const typeIdx = TYPE_STRINGS.indexOf(addr.type)
  return {
    id: addr.id,
    n: addr.name || '',
    a: addr.address || '',
    city: addr.city || '',
    country: addr.country || '',
    zip: addr.zip_code || '',
    c: addr.contact_name || '',
    phone: addr.phone || '',
    ins: addr.delivery_instructions || '',
    type: typeIdx >= 0 ? typeIdx : 0,
    primary: !!addr.is_default,
  }
}
const SPAN2 = ['address', 'instructions']
const REQUIRED = ['name', 'address', 'city', 'country', 'zip', 'contact']

function initialPrimary(rows) {
  const found = rows.find((r) => r.primary)
  return found ? found.id : null
}

export default function Addresses({ app, token }) {
  const a = app.addr
  const [rows, setRows] = React.useState([])
  const [primaryId, setPrimaryId] = React.useState(null)
  const [formMode, setFormMode] = React.useState(null)
  const [formVals, setFormVals] = React.useState({ type: 0 })
  const [err, setErr] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [removeId, setRemoveId] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [loadError, setLoadError] = React.useState(null)

  const loadAddresses = React.useCallback(async () => {
    if (!token) return
    setLoading(true)
    setLoadError(null)
    try {
      const data = await api.getAddresses(token)
      const list = Array.isArray(data) ? data : (data.addresses || [])
      const mapped = list.map(backendToRow)
      setRows(mapped)
      setPrimaryId(initialPrimary(mapped))
    } catch (e) {
      setLoadError(e.message || 'Error cargando direcciones')
    } finally {
      setLoading(false)
    }
  }, [token])

  React.useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  const formOpen = formMode !== null
  const formTitle = formMode === 'new' ? a.newT : a.editT

  const pendingRow = removeId ? rows.find((r) => r.id === removeId) : null

  const openNew = () => {
    setFormMode('new')
    setFormVals({ name: '', address: '', city: '', country: '', zip: '', contact: '', phone: '', instructions: '', type: 0 })
    setErr(false)
    setSaved(false)
    setLoadError(null)
    setRemoveId(null)
  }

  const openEdit = (row) => {
    setFormMode(row.id)
    setFormVals({
      name: row.n,
      address: row.a,
      city: row.city || '',
      country: row.country || '',
      zip: row.zip || '',
      contact: row.c,
      phone: row.phone || '',
      instructions: row.ins || '',
      type: row.type || 0,
    })
    setErr(false)
    setSaved(false)
    setLoadError(null)
    setRemoveId(null)
  }

  const save = async () => {
    const missing = REQUIRED.some((k) => !(formVals[k] || '').trim())
    if (missing) return setErr(true)

    const country = formVals.country
    if (country) {
      const zipPattern = ZIP_PATTERNS[country] || /^[A-Z0-9\s-]{3,15}$/i
      if (!zipPattern.test(String(formVals.zip || '').trim())) {
        setLoadError(a.errZip.replace('{country}', COUNTRY_OPTIONS.find((c) => c.code === country)?.name || country))
        return
      }
      const phonePattern = PHONE_PATTERNS[country] || /^[+\d\s\-()]{7,20}$/
      const phoneVal = String(formVals.phone || '').trim()
      if (phoneVal && !phonePattern.test(phoneVal)) {
        setLoadError(a.errPhone.replace('{country}', COUNTRY_OPTIONS.find((c) => c.code === country)?.name || country))
        return
      }
    }

    const payload = {
      name: formVals.name,
      address: formVals.address,
      city: formVals.city,
      country: formVals.country,
      zip_code: formVals.zip,
      contact_name: formVals.contact,
      phone: formVals.phone,
      delivery_instructions: formVals.instructions,
      type: TYPE_STRINGS[formVals.type || 0],
      is_default: rows.length === 0,
    }

    setLoading(true)
    setErr(false)
    setLoadError(null)
    try {
      if (formMode === 'new') {
        await api.createAddress(payload, token)
      } else {
        await api.updateAddress(formMode, payload, token)
      }
      await loadAddresses()
      setFormMode(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setLoadError(e.message || 'Error guardando dirección')
    } finally {
      setLoading(false)
    }
  }

  const doRemove = async (id) => {
    setLoading(true)
    setLoadError(null)
    try {
      await api.deleteAddress(id, token)
      await loadAddresses()
    } catch (e) {
      setLoadError(e.message || 'Error eliminando dirección')
    } finally {
      setLoading(false)
      setRemoveId(null)
      setSaved(false)
    }
  }

  const setPrimary = async (row) => {
    setLoading(true)
    setLoadError(null)
    try {
      await api.updateAddress(row.id, {
        type: TYPE_STRINGS[row.type],
        is_default: true,
      }, token)
      await loadAddresses()
    } catch (e) {
      setLoadError(e.message || 'Error marcando dirección principal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{
          fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
          fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: 0, color: '#001B45',
        }}>{a.title}</h1>
        <button onClick={openNew} style={{
          marginLeft: 'auto', padding: '13px 20px', background: '#fff',
          border: '1.5px solid #DCE6F5', borderRadius: 11, color: '#001B45',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>{a.add}</button>
      </div>

      {loadError && (
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start', padding: 16,
          border: '1px solid #F5C6CB', background: '#F8D7DA', borderRadius: 12,
          fontSize: 14, color: '#721C24', marginBottom: 16,
        }}>
          {loadError}
        </div>
      )}

      {saved && (
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start', padding: 16,
          border: '1px solid #C6E6D4', background: '#F1FAF5', borderRadius: 12,
          fontSize: 14, color: '#0F5F36', marginBottom: 16,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#137A45" strokeWidth="1.9" style={{ flex: '0 0 auto' }}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.5 2.5 4.5-5" />
          </svg>
          {a.saved}
        </div>
      )}

      {pendingRow && (
        <div onClick={() => setRemoveId(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,27,69,.55)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 420, padding: 28,
            boxShadow: '0 20px 60px rgba(0,27,69,.25)', border: '1px solid #DCE6F5',
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(217,154,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D99A00" strokeWidth="1.8">
                  <path d="M12 3l9 16H3z" />
                  <path d="M12 9v5M12 17v.1" />
                </svg>
              </div>
              <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 18, color: '#001B45' }}>{a.confirmRemove}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#6C82A6', marginTop: 8 }}>{a.confirmSub}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setRemoveId(null)} style={{
                flex: 1, padding: '14px 20px', background: '#fff', border: '1.5px solid #DCE6F5', borderRadius: 11,
                color: '#10233F', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{a.cancelBtn}</button>
              <button onClick={() => doRemove(removeId)} style={{
                flex: 1, padding: '14px 20px', background: '#C0392B', border: 'none', borderRadius: 11,
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{a.removeBtn}</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{
            fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
            fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
          }}>{formTitle}</div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 10 }}>{a.typeT}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {a.types.map((t, i) => {
                const on = (formVals.type || 0) === i
                return (
                  <button key={i} onClick={() => setFormVals((v) => ({ ...v, type: i }))} style={{
                    padding: '11px 15px', border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                    borderRadius: 100, background: on ? 'rgba(8,124,240,.08)' : '#fff',
                    color: on ? '#0768C9' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{t}</button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FIELD_KEYS.map((k) => (
              <label key={k} style={{ gridColumn: SPAN2.includes(k) ? 'span 2' : 'span 1', display: 'block' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>
                  {a.f[k]}
                </span>
                {k === 'country' ? (
                  <select
                    value={formVals[k] || ''}
                    onChange={(e) => { setFormVals((v) => ({ ...v, [k]: e.target.value })); setErr(false); setLoadError(null) }}
                    style={{
                      width: '100%', padding: '14px 15px',
                      border: `1.5px solid ${err && REQUIRED.includes(k) && !(formVals[k] || '').trim() ? '#C0392B' : '#DCE6F5'}`,
                      borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none', cursor: 'pointer',
                    }}
                  >
                    <option value="">{a.f[k]}</option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={formVals[k] || ''}
                    onChange={(e) => { setFormVals((v) => ({ ...v, [k]: e.target.value })); setErr(false); setLoadError(null) }}
                    placeholder={a.f[k]}
                    inputMode={k === 'phone' ? 'tel' : undefined}
                    style={{
                      width: '100%', padding: '14px 15px',
                      border: `1.5px solid ${err && REQUIRED.includes(k) && !(formVals[k] || '').trim() ? '#C0392B' : '#DCE6F5'}`,
                      borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
                    }}
                  />
                )}
              </label>
            ))}
          </div>

          {err && (
            <div role="alert" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 500, color: '#C0392B' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>
              {(app.create && app.create.errStep) ? app.create.errStep : 'Complete los campos obligatorios.'}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', border: '1px dashed #DCE6F5', background: '#EEF4FC', borderRadius: 12, padding: '14px 16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0768C9" strokeWidth="1.8" style={{ flex: '0 0 auto', marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.8v.1" /></svg>
            <span style={{ fontSize: 13, lineHeight: 1.6, color: '#25456E' }}>{a.localNote}</span>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setFormMode(null)} style={{
              padding: '14px 20px', background: '#fff', border: '1.5px solid #DCE6F5',
              borderRadius: 11, color: '#10233F', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{a.cancelBtn}</button>
            <button onClick={save} style={{
              marginLeft: 'auto', padding: '14px 22px', background: '#087CF0',
              border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{a.save}</button>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 760 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 0.6fr 1.1fr 1.2fr',
              gap: 12, padding: '14px 22px', fontSize: 11, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#6C82A6',
            }}>
              {a.cols.map((col, i) => <span key={i}>{col}</span>)}
            </div>

            {rows.length === 0 ? (
              <div style={{ padding: '24px 22px', textAlign: 'center', color: '#6C82A6', fontSize: 15, borderTop: '1px solid #E3EBF7' }}>
                {a.empty}
              </div>
            ) : rows.map((r, i) => {
              const isPrimary = r.id === primaryId
              const removing = r.id === removeId
              return (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 0.6fr 1.1fr 1.2fr',
                  gap: 12, padding: '16px 22px', borderTop: '1px solid #E3EBF7', alignItems: 'center',
                  background: removing ? 'rgba(217,154,0,.05)' : 'transparent',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{r.n}</div>
                    {isPrimary && (
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#0768C9', marginTop: 3 }}>{a.primary}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: '#10233F' }}>{r.a}</span>
                  <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: '#EEF4FC', color: '#10233F', justifySelf: 'start' }}>{a.types[r.type]}</span>
                  <span style={{ fontSize: 13, color: '#10233F' }}>{r.c}</span>
                  <div style={{ display: 'flex', gap: 14, justifySelf: 'end', whiteSpace: 'nowrap' }}>
                    <button onClick={() => setPrimary(r)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: isPrimary ? '#6C82A6' : '#087CF0' }}>{isPrimary ? a.primary : a.setPrimary}</button>
                    <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#6C82A6' }}>{a.edit}</button>
                    <button onClick={() => setRemoveId(r.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#A93226' }}>{a.removeBtn}</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
