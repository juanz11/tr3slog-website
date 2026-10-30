import React from 'react'
import Script from 'next/script'
import { api } from '../api'
import { Pagination, usePagination, SortControl, sortRows } from './Shared'
import { COUNTRY_NAMES, PHONE_FORMATS, detectDialCountry } from '../lib/countries'

const COUNTRY_OPTIONS = [
  { code: 'DO', name: 'República Dominicana' },
  { code: 'CR', name: 'Costa Rica' },
]

const ZIP_PATTERNS = {
  AF: /^\d{4}$/,
  AL: /^\d{4}$/,
  AR: /^\d{4}$/,
  AU: /^\d{4}$/,
  BE: /^\d{4}$/,
  BO: /^\d{4}$/,
  BR: /^\d{5}-?\d{3}$/,
  CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  CH: /^\d{4}$/,
  CL: /^\d{7}$/,
  CO: /^\d{6}$/,
  CR: /^\d{5}$/,
  CU: /^\d{5}$/,
  DE: /^\d{5}$/,
  DO: /^\d{5}$/,
  EC: /^\d{6}$/,
  EG: /^\d{5}$/,
  ES: /^\d{5}$/,
  FR: /^\d{5}$/,
  GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  GT: /^\d{5}$/,
  HN: /^\d{5}$/,
  IT: /^\d{5}$/,
  JM: /^(?=.*[A-Z])[A-Z0-9\s-]{3,10}$/i,
  JP: /^\d{3}[- ]?\d{4}$/,
  KR: /^\d{5}$/,
  MX: /^\d{5}$/,
  NI: /^\d{5}$/,
  NL: /^\d{4}\s?[A-Z]{2}$/i,
  PA: /^\d{4}$/,
  PE: /^\d{5}$/,
  PR: /^\d{5}(-\d{4})?$/,
  PT: /^\d{4}-?\d{3}$/,
  PY: /^\d{4}$/,
  CN: /^\d{6}$/,
  RU: /^\d{6}$/,
  SV: /^\d{4}$/,
  US: /^\d{5}(-\d{4})?$/,
  UY: /^\d{5}$/,
  VE: /^\d{4,5}$/,
  ZA: /^\d{4}$/,
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
    created: addr.created_at || null,
  }
}
const SPAN2 = ['address', 'instructions']
const REQUIRED = ['name', 'address', 'city', 'country', 'zip', 'contact']

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const ADDRESS_DRAFT_KEY = 'tr3slog-address-draft'

function initialPrimary(rows) {
  const found = rows.find((r) => r.primary)
  return found ? found.id : null
}

export default function Addresses({ app, token }) {
  const a = app.addr
  const [rows, setRows] = React.useState([])
  const [sortMode, setSortMode] = React.useState('recent')
  const sorted = sortRows(rows, sortMode, { date: 'created', text: 'n' })
  const pager = usePagination(sorted, 10, sortMode)
  const [primaryId, setPrimaryId] = React.useState(null)
  const [formMode, setFormMode] = React.useState(null)
  const [formVals, setFormVals] = React.useState({ type: 0 })
  const [err, setErr] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [removeId, setRemoveId] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [loadError, setLoadError] = React.useState(null)
  const addressDraftLoaded = React.useRef(false)

  React.useEffect(() => {
    if (addressDraftLoaded.current) return
    try {
      const raw = localStorage.getItem(ADDRESS_DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.formMode) setFormMode(parsed.formMode)
        if (parsed.formVals) setFormVals(parsed.formVals)
      }
    } catch (e) {}
    addressDraftLoaded.current = true
  }, [])

  React.useEffect(() => {
    if (!addressDraftLoaded.current) return
    try {
      if (formMode === null) {
        localStorage.removeItem(ADDRESS_DRAFT_KEY)
      } else {
        localStorage.setItem(ADDRESS_DRAFT_KEY, JSON.stringify({ formMode, formVals }))
      }
    } catch (e) {}
  }, [formMode, formVals])

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
  const placesContainer = React.useRef(null)
  const [placesReady, setPlacesReady] = React.useState(false)
  const [placesError, setPlacesError] = React.useState(false)
  const [manualAddr, setManualAddr] = React.useState(false)

  React.useEffect(() => {
    if (!formOpen || !placesReady || manualAddr || !placesContainer.current) return
    const Autocomplete = window.google?.maps?.places?.PlaceAutocompleteElement
    if (!Autocomplete) { setPlacesError(true); return }
    let active = true
    let selection = 0
    let widget = null
    try { widget = new Autocomplete() } catch { /* constructor no disponible en esta versión */ }
    if (!widget) widget = document.createElement('gmp-place-autocomplete')
    try { widget.includedRegionCodes = ['do', 'cr'] } catch { /* propiedad opcional */ }
    widget.setAttribute('aria-label', a.f.address)
    widget.style.width = '100%'
    widget.style.setProperty('display', 'block')
    widget.style.setProperty('--gmpx-color-surface', 'transparent')
    widget.style.setProperty('--gmpx-color-on-surface', '#001B45')
    widget.style.setProperty('--gmpx-color-outline', 'transparent')
    widget.style.setProperty('background', 'transparent')
    widget.style.setProperty('border', 'none')
    widget.style.setProperty('outline', 'none')
    const onError = () => { if (active) setPlacesError(true) }
    const onSelect = async ({ placePrediction }) => {
      const request = ++selection
      try {
        const place = placePrediction.toPlace()
        await place.fetchFields({ fields: ['formattedAddress', 'addressComponents'] })
        if (!active || request !== selection) return
        const part = (type) => place.addressComponents?.find((c) => c.types.includes(type))
        const text = (type) => part(type)?.longText || ''
        const country = part('country')?.shortText?.toUpperCase() || ''
        setFormVals((v) => ({
          ...v,
          address: place.formattedAddress || v.address,
          ...(COUNTRY_OPTIONS.some((c) => c.code === country) ? { country } : {}),
          city: text('locality') || text('postal_town') || text('administrative_area_level_2') || v.city,
          zip: [text('postal_code'), text('postal_code_suffix')].filter(Boolean).join('-') || v.zip,
        }))
        setErr(false)
        setLoadError(null)
        setPlacesError(false)
      } catch {
        if (request === selection) onError()
      }
    }
    widget.addEventListener('gmp-select', onSelect)
    widget.addEventListener('gmp-error', onError)
    placesContainer.current.appendChild(widget)
    return () => {
      active = false
      widget.removeEventListener('gmp-select', onSelect)
      widget.removeEventListener('gmp-error', onError)
      widget.remove()
    }
  }, [formOpen, formMode, placesReady, manualAddr, a.f.address])

  const pendingRow = removeId ? rows.find((r) => r.id === removeId) : null

  const openNew = () => {
    setFormMode('new')
    setFormVals({ name: '', address: '', city: '', country: '', zip: '', contact: '', phone: '', phoneCountry: '', instructions: '', type: 0 })
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
      phoneCountry: detectDialCountry(row.phone, row.country, ['DO', 'CR']),
      instructions: row.ins || '',
      type: row.type || 0,
    })
    setErr(false)
    setSaved(false)
    setLoadError(null)
    setRemoveId(null)
  }

  const save = async () => {
    if (loading) return
    const missing = REQUIRED.some((k) => !(formVals[k] || '').trim())
    if (missing) return setErr(true)

    const country = formVals.country
    if (country) {
      const zipPattern = ZIP_PATTERNS[country] || /^$/
      if (!zipPattern.test(String(formVals.zip || '').trim())) {
        setLoadError(a.errZip.replace('{country}', COUNTRY_OPTIONS.find((c) => c.code === country)?.name || country))
        return
      }
    }
    const phoneVal = String(formVals.phone || '').trim()
    if (phoneVal) {
      const phoneCountry = formVals.phoneCountry || formVals.country || ''
      const phonePattern = phoneCountry && PHONE_FORMATS[phoneCountry] ? PHONE_FORMATS[phoneCountry].pattern : /^[+\d\s\-\(\)\.\/]{7,25}$/
      if (!phonePattern.test(phoneVal)) {
        const name = phoneCountry && COUNTRY_NAMES[phoneCountry] ? COUNTRY_NAMES[phoneCountry] : (COUNTRY_OPTIONS.find((c) => c.code === formVals.country)?.name || formVals.country || 'este país')
        setLoadError(a.errPhone.replace('{country}', name))
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
      phone_country: formVals.phoneCountry || formVals.country,
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
              fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
            }}>{formTitle}</div>
            <button onClick={() => setFormMode(null)} style={{
              padding: '6px 12px', borderRadius: 8, border: '1.5px solid #DCE6F5',
              background: '#fff', color: '#6C82A6', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
            }}>{a.cancelBtn}</button>
          </div>

          {GOOGLE_MAPS_KEY && (
            <Script
              id="google-places"
              src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&libraries=places&v=weekly`}
              onReady={() => setPlacesReady(true)}
              onError={() => setPlacesError(true)}
            />
          )}

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
                ) : k === 'phone' ? (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
                    <select
                      value={formVals.phoneCountry || ''}
                      onChange={(e) => { setFormVals((v) => ({ ...v, phoneCountry: e.target.value })); setErr(false); setLoadError(null) }}
                      style={{
                        flex: '0 0 90px', padding: '14px 12px',
                        border: `1.5px solid ${err && REQUIRED.includes(k) && !(formVals[k] || '').trim() ? '#C0392B' : '#DCE6F5'}`,
                        borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none', cursor: 'pointer',
                      }}
                    >
                      <option value="">{a.f.country}</option>
                      {Object.keys(PHONE_FORMATS).filter((c) => c === 'DO' || c === 'CR').map((c) => (
                        <option key={c} value={c}>{PHONE_FORMATS[c].code} {c}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={formVals[k] || ''}
                      onChange={(e) => { setFormVals((v) => ({ ...v, [k]: e.target.value })); setErr(false); setLoadError(null) }}
                      placeholder={formVals.phoneCountry && PHONE_FORMATS[formVals.phoneCountry] ? PHONE_FORMATS[formVals.phoneCountry].example : a.f[k]}
                      style={{
                        flex: 1, padding: '14px 15px',
                        border: `1.5px solid ${err && REQUIRED.includes(k) && !(formVals[k] || '').trim() ? '#C0392B' : '#DCE6F5'}`,
                        borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
                      }}
                    />
                  </div>
                ) : k === 'address' && GOOGLE_MAPS_KEY && !placesError && !manualAddr ? (
                  <div>
                    <div
                      ref={placesContainer}
                      style={{
                        border: `1.5px solid ${err && !(formVals[k] || '').trim() ? '#C0392B' : '#DCE6F5'}`,
                        borderRadius: 11, background: '#EEF4FC', minHeight: 52,
                        padding: '2px 10px',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <button type="button" onClick={() => setManualAddr(true)}
                        style={{ background: 'none', border: 'none', padding: 0, fontSize: 11.5, color: '#6C82A6', cursor: 'pointer', textDecoration: 'underline' }}>
                        Escribir manualmente
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    value={formVals[k] || ''}
                    onChange={(e) => { setFormVals((v) => ({ ...v, [k]: e.target.value })); setErr(false); setLoadError(null) }}
                    placeholder={a.f[k]}
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
            <button onClick={save} disabled={loading} style={{
              marginLeft: 'auto', padding: '14px 22px', background: loading ? '#8FC6F7' : '#087CF0',
              border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            }}>{loading ? 'Guardando…' : a.save}</button>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 22px', borderBottom: '1px solid #DCE6F5' }}>
          <SortControl value={sortMode} onChange={setSortMode} labels={app.sort} />
        </div>
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
            ) : pager.pageItems.map((r, i) => {
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

        <Pagination pager={pager} labels={app.pager} />
      </div>
    </div>
  )
}
