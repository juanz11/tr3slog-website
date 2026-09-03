import React from 'react'
import { api } from '../api'
import { authI18n } from '../i18n-auth'
import { COUNTRY_NAMES, PHONE_FORMATS } from '../lib/countries'

const STATUS_COLORS = {
  active: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  route: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  available: { bg: '#EEF4FC', fg: '#10233F' },
  suspended: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
  offduty: { bg: '#EEF4FC', fg: '#6C82A6' },
}

const DOC_COLORS = {
  ok: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  soon: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  expired: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

const FILTER_KEYS = ['all', 'active', 'route', 'available', 'suspended', 'docsSoon']

function matchesFilter(driver, key) {
  if (key === 'all') return true
  if (key === 'active') return driver.st === 'active' || driver.st === 'route'
  if (key === 'route') return driver.st === 'route'
  if (key === 'available') return driver.st === 'available'
  if (key === 'suspended') return driver.st === 'suspended'
  if (key === 'docsSoon') return driver.doc === 'soon' || driver.doc === 'expired'
  return true
}

export default function Drivers({ app, lang, token }) {
  const d = app.drivers
  const [drivers, setDrivers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState('all')
  const a = authI18n[lang] || authI18n.es
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({ user_id: '', name: '', phone: '', country: '', email: '', vehicle: '', hub: '', password: '' })
  const [formError, setFormError] = React.useState('')
  const [formLoading, setFormLoading] = React.useState(false)
  const [newId, setNewId] = React.useState('')
  const [clients, setClients] = React.useState([])

  const fetchDrivers = React.useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await api.getDrivers(token)
      setDrivers(Array.isArray(data) ? data : data.data || [])
    } catch (e) {
      setError(e.message || d.error)
    } finally {
      setLoading(false)
    }
  }, [token, d.error])

  React.useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  const filtered = drivers.filter((driver) => {
    const matches = matchesFilter(driver, filter)
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || [driver.n, driver.id, driver.v, driver.hub, driver.shift]
      .some((v) => String(v).toLowerCase().includes(q))
    return matches && matchesQuery
  })

  const filterCounts = FILTER_KEYS.map((key) => ({
    key,
    count: drivers.filter((driver) => matchesFilter(driver, key)).length,
  }))

  const resetForm = () => {
    setForm({ user_id: '', name: '', phone: '', country: '', email: '', vehicle: '', hub: '', password: '' })
    setFormError('')
    setNewId('')
  }

  const fetchClients = React.useCallback(async () => {
    if (!token) return
    try {
      const data = await api.getClients(token)
      setClients(Array.isArray(data) ? data : [])
    } catch (e) {
      setClients([])
    }
  }, [token])

  React.useEffect(() => {
    if (open) fetchClients()
  }, [open, fetchClients])

  const handleClientChange = (userId) => {
    if (!userId) {
      setForm((prev) => ({ ...prev, user_id: '', name: '', phone: '', country: '', email: '', password: '' }))
      return
    }
    const client = clients.find((c) => String(c.id) === userId)
    if (!client) return
    setForm((prev) => ({
      ...prev,
      user_id: String(client.id),
      name: client.name || '',
      phone: client.phone || '',
      country: '',
      email: client.email || '',
      password: '',
    }))
  }

  const validate = () => {
    if (!/\S+@\S+\.\S+/.test(form.email)) return a.errEmail
    if (!form.user_id) {
      if (!form.country) return a.errCountry
      const fmt = PHONE_FORMATS[form.country]
      if (fmt && !fmt.pattern.test(form.phone.trim())) {
        return a.errPhoneFmt
          .replace('{country}', COUNTRY_NAMES[form.country])
          .replace('{example}', fmt.example)
      }
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(form.password)) return a.errPass
    } else if (form.country && form.phone.trim()) {
      const fmt = PHONE_FORMATS[form.country]
      if (fmt && !fmt.pattern.test(form.phone.trim())) {
        return a.errPhoneFmt
          .replace('{country}', COUNTRY_NAMES[form.country])
          .replace('{example}', fmt.example)
      }
    }
    return ''
  }

  const buildPhone = () => {
    const raw = form.phone.trim()
    if (!raw) return raw
    if (raw.startsWith('+')) return raw
    const code = PHONE_FORMATS[form.country]?.code
    return code ? `${code} ${raw}` : raw
  }

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')
    const msg = validate()
    if (msg) {
      setFormError(msg)
      return
    }
    setFormLoading(true)
    try {
      const phone = buildPhone()
      const payload = form.user_id
        ? { user_id: form.user_id, name: form.name, phone, email: form.email, vehicle: form.vehicle, hub: form.hub }
        : { ...form, phone, password_confirmation: form.password }
      const created = await api.createDriver(payload, token)
      setDrivers((prev) => [created, ...prev])
      setNewId(created.id)
      resetForm()
    } catch (err) {
      setFormError(err.message || 'No se pudo registrar el conductor')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>
      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 className="app-h1" style={{ marginBottom: 8 }}>{d.title}</h1>
          <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch' }}>{d.sub}</p>
        </div>
        <button className="app-primary" onClick={() => { setOpen(!open); resetForm() }} style={{ marginLeft: 'auto' }}>{d.registerBtn}</button>
      </div>

      {open && (
        <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 26, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {formError && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#FDECEC', color: '#B91C1C', fontSize: 14 }}>{formError}</div>
          )}
          {newId && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#F1FAF5', color: '#0F5F36', fontSize: 14 }}>
              {d.appId}: <strong>{newId}</strong>
            </div>
          )}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.selectClient}</span>
            <select value={form.user_id} onChange={(e) => handleClientChange(e.target.value)} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }}>
              <option value="">{d.newDriver}</option>
              {clients.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name} — {c.email}</option>
              ))}
            </select>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', rowGap: 28, columnGap: 24 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{a.name}</span>
              <input type="text" required disabled={!!form.user_id} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{a.phone}</span>
              <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
                <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={{ flex: '0 0 110px', padding: '14px 12px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', color: '#001B45', font: 'inherit', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
                  <option value="">{a.country}</option>
                  {Object.keys(PHONE_FORMATS).map((k) => (
                    <option key={k} value={k}>{PHONE_FORMATS[k].code} {k}</option>
                  ))}
                </select>
                <input type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={form.country && PHONE_FORMATS[form.country] ? PHONE_FORMATS[form.country].example : d.phonePh} style={{ flex: 1, padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
              </div>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{a.email}</span>
              <input type="email" required disabled={!!form.user_id} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.cols[2]}</span>
              <input type="text" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} placeholder={d.vehiclePh} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.cols[3]}</span>
              <input type="text" value={form.hub} onChange={(e) => setForm({ ...form, hub: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            {!form.user_id && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{a.password}</span>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
              </label>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" disabled={formLoading} className="app-primary">{formLoading ? 'Procesando…' : d.registerBtn}</button>
            <button type="button" onClick={() => { setOpen(false); resetForm() }} style={{ padding: '14px 24px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#fff', color: '#10233F', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{app.addr.cancelBtn}</button>
          </div>
        </form>
      )}

      <div className="app-card">
        <div className="app-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="app-card-title">{d.listTitle}</span>
        </div>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={d.searchPh}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#001B45' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTER_KEYS.map((key) => {
              const on = filter === key
              const count = filterCounts.find((c) => c.key === key)?.count || 0
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 14px', border: `1.5px solid ${on ? '#001B45' : '#DCE6F5'}`,
                    borderRadius: 100, background: on ? '#001B45' : '#fff',
                    color: on ? '#fff' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    opacity: count === 0 && !on ? .45 : 1,
                  }}
                >
                  <span>{d.filters[key]}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: on ? 'rgba(255,255,255,.22)' : '#EEF4FC', color: on ? '#fff' : '#6C82A6' }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="app-table-scroll">
          <div className="app-table" style={{ minWidth: 960 }}>
            <div className="app-table-head" style={{ gridTemplateColumns: '1.1fr .8fr 1.1fr 1fr .9fr .9fr .8fr .7fr' }}>
              {d.cols.map((col, i) => (<span key={i}>{col}</span>))}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>{d.empty}</div>
            )}
            {filtered.map((driver) => {
              const stStyle = STATUS_COLORS[driver.st] || STATUS_COLORS.available
              const docStyle = DOC_COLORS[driver.doc] || DOC_COLORS.ok
              return (
                <div key={driver.id} className="app-table-row" style={{ gridTemplateColumns: '1.1fr .8fr 1.1fr 1fr .9fr .9fr .8fr .7fr', alignItems: 'center' }}>
                  <span className="app-table-id">{driver.n}</span>
                  <span className="app-table-text">{driver.id}</span>
                  <span className="app-table-text">{driver.v}</span>
                  <span className="app-table-text">{driver.hub}</span>
                  <span className="app-table-text">{driver.shift}</span>
                  <span className="app-status" style={{ background: docStyle.bg, color: docStyle.fg }}>{d.docStates[driver.doc]}</span>
                  <span className="app-status" style={{ background: stStyle.bg, color: stStyle.fg }}>{d.statuses[driver.st]}</span>
                  <span>
                    <button style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{d.viewProfile}</button>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', border: '1px dashed #DCE6F5', background: '#EEF4FC', borderRadius: 14, padding: '16px 18px', marginTop: 16 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0768C9" strokeWidth="1.8" style={{ flex: '0 0 auto', marginTop: 1 }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 7.8v.1" />
        </svg>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: '#25456E', textWrap: 'pretty' }}>{d.note}</p>
      </div>
    </div>
  )
}
