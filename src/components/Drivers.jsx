import React from 'react'
import { api, MEDIA_URL } from '../api'
import { Pagination, usePagination, usePolling } from './Shared'
import { authI18n } from '../i18n-auth'
import { COUNTRY_NAMES, PHONE_FORMATS } from '../lib/countries'

const SHIFT_PLACEHOLDERS = {
  es: 'Ej. Mañana / Tarde / Noche',
  en: 'e.g. Morning / Afternoon / Night',
  'zh-CN': '例如：早班 / 中班 / 晚班',
}

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

const emptyVehicle = () => ({
  label: '', plate: '', cargoCapacity: '',
  registrationNumber: '', insuranceNumber: '', insuranceExpires: '',
  inspectionNumber: '', inspectionExpires: '', permitNumber: '', permitExpires: '',
  files: {},
})

const VEHICLE_DOCS = [
  { key: 'registration', number: 'registrationNumber', file: 'registration' },
  { key: 'insurance', number: 'insuranceNumber', expiry: 'insuranceExpires', file: 'insurance' },
  { key: 'inspection', number: 'inspectionNumber', expiry: 'inspectionExpires', file: 'inspection' },
  { key: 'permit', number: 'permitNumber', expiry: 'permitExpires', file: 'cargo_permit' },
]

function FileInput({ label, placeholder, file, onChange, accept = 'image/*,.pdf' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{label}</span>
      <span style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
        border: `1.5px dashed ${file ? '#087CF0' : '#DCE6F5'}`, borderRadius: 11,
        background: '#EEF4FC', cursor: 'pointer', fontSize: 13,
        color: file ? '#001B45' : '#6C82A6', overflow: 'hidden',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#087CF0" strokeWidth="1.8" style={{ flex: '0 0 auto' }}>
          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
        </svg>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file ? file.name : placeholder}</span>
        <input type="file" accept={accept} onChange={(e) => onChange(e.target.files[0] || null)} style={{ display: 'none' }} />
      </span>
    </label>
  )
}

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
  const [form, setForm] = React.useState({ user_id: '', name: '', phone: '', country: '', email: '', vehicle: '', hub: '', shift: '', password: '' })
  const [docs, setDocs] = React.useState({ idNumber: '', idExpires: '', licenseNumber: '', licenseExpires: '' })
  const [docFiles, setDocFiles] = React.useState({ photo: null, idFile: null, licenseFile: null })
  const [vehicles, setVehicles] = React.useState([])
  const [formError, setFormError] = React.useState('')
  const [formLoading, setFormLoading] = React.useState(false)
  const [newId, setNewId] = React.useState('')
  const [clients, setClients] = React.useState([])
  const [selected, setSelected] = React.useState(null)

  const fetchDrivers = React.useCallback(async (isPoll) => {
    if (!token) return
    if (!isPoll) setLoading(true)
    try {
      const data = await api.getDrivers(token)
      setDrivers(Array.isArray(data) ? data : data.data || [])
      setError('')
    } catch (e) {
      if (!isPoll) setError(e.message || d.error)
    } finally {
      if (!isPoll) setLoading(false)
    }
  }, [token, d.error])

  usePolling(fetchDrivers, 30000)

  const filtered = drivers.filter((driver) => {
    const matches = matchesFilter(driver, filter)
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || [driver.n, driver.id, driver.v, driver.hub, driver.shift]
      .some((v) => String(v).toLowerCase().includes(q))
    return matches && matchesQuery
  })

  const pager = usePagination(filtered, 10, `${filter}|${query}`)

  const filterCounts = FILTER_KEYS.map((key) => ({
    key,
    count: drivers.filter((driver) => matchesFilter(driver, key)).length,
  }))

  const resetForm = () => {
    setForm({ user_id: '', name: '', phone: '', country: '', email: '', vehicle: '', hub: '', shift: '', password: '' })
    setDocs({ idNumber: '', idExpires: '', licenseNumber: '', licenseExpires: '' })
    setDocFiles({ photo: null, idFile: null, licenseFile: null })
    setVehicles([])
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
    if (!docs.idNumber.trim() || !docs.licenseNumber.trim() || !docs.licenseExpires || !docFiles.photo) return d.errDocs
    if (vehicles.some((v) => !v.plate.trim())) return d.errPlate
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
    if (formLoading) return
    setFormError('')
    const msg = validate()
    if (msg) {
      setFormError(msg)
      return
    }
    setFormLoading(true)
    try {
      const phone = buildPhone()
      const fd = new FormData()
      if (form.user_id) fd.append('user_id', form.user_id)
      fd.append('name', form.name)
      fd.append('phone', phone)
      fd.append('email', form.email)
      if (form.vehicle) fd.append('vehicle', form.vehicle)
      if (form.hub) fd.append('hub', form.hub)
      fd.append('shift', form.shift)
      if (!form.user_id) {
        fd.append('password', form.password)
        fd.append('password_confirmation', form.password)
      }
      fd.append('id_document_number', docs.idNumber)
      if (docs.idExpires) fd.append('id_document_expires_at', docs.idExpires)
      fd.append('license_number', docs.licenseNumber)
      fd.append('license_expires_at', docs.licenseExpires)
      if (docFiles.photo) fd.append('photo', docFiles.photo)
      if (docFiles.idFile) fd.append('id_document_file', docFiles.idFile)
      if (docFiles.licenseFile) fd.append('license_file', docFiles.licenseFile)
      vehicles.forEach((v, i) => {
        fd.append(`vehicles[${i}][plate]`, v.plate)
        if (v.label) fd.append(`vehicles[${i}][label]`, v.label)
        if (v.cargoCapacity) fd.append(`vehicles[${i}][cargo_capacity]`, v.cargoCapacity)
        if (v.registrationNumber) fd.append(`vehicles[${i}][registration_number]`, v.registrationNumber)
        if (v.insuranceNumber) fd.append(`vehicles[${i}][insurance_number]`, v.insuranceNumber)
        if (v.insuranceExpires) fd.append(`vehicles[${i}][insurance_expires_at]`, v.insuranceExpires)
        if (v.inspectionNumber) fd.append(`vehicles[${i}][inspection_number]`, v.inspectionNumber)
        if (v.inspectionExpires) fd.append(`vehicles[${i}][inspection_expires_at]`, v.inspectionExpires)
        if (v.permitNumber) fd.append(`vehicles[${i}][permit_number]`, v.permitNumber)
        if (v.permitExpires) fd.append(`vehicles[${i}][permit_expires_at]`, v.permitExpires)
        Object.entries(v.files || {}).forEach(([type, file]) => {
          if (file) fd.append(`vehicles[${i}][files][${type}]`, file)
        })
      })
      const created = await api.createDriver(fd, token)
      setDrivers((prev) => [created, ...prev])
      resetForm()
      setNewId(created.id)
      setOpen(false)
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

      {newId && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#F1FAF5', color: '#0F5F36', fontSize: 14, marginBottom: 20 }}>
          {d.appId}: <strong>{newId}</strong>
        </div>
      )}

      {open && (
        <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 26, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {formError && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#FDECEC', color: '#B91C1C', fontSize: 14 }}>{formError}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', rowGap: 28, columnGap: 24 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{a.name}</span>
              <input type="text" required disabled={!!form.user_id} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{a.email}</span>
              <input type="email" required disabled={!!form.user_id} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.cols[3]}</span>
              <input type="text" value={form.hub} onChange={(e) => setForm({ ...form, hub: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.cols[4]}</span>
              <input type="text" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} placeholder={SHIFT_PLACEHOLDERS[lang] || SHIFT_PLACEHOLDERS.es} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
            </label>
            {!form.user_id && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{a.password}</span>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
              </label>
            )}

            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #DCE6F5', paddingTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#001B45', marginBottom: 6 }}>{d.docs.title}</div>
              <div style={{ fontSize: 12, color: '#6C82A6', marginBottom: 18 }}>{d.docs.required}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px 24px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.docs.idNumber} *</span>
                  <input type="text" value={docs.idNumber} onChange={(e) => setDocs({ ...docs, idNumber: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.docs.idExpiry}</span>
                  <input type="date" value={docs.idExpires} onChange={(e) => setDocs({ ...docs, idExpires: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
                </label>
                <FileInput label={d.docs.idFile} placeholder={d.docs.chooseFile} file={docFiles.idFile} onChange={(f) => setDocFiles({ ...docFiles, idFile: f })} />
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.docs.licenseNumber} *</span>
                  <input type="text" value={docs.licenseNumber} onChange={(e) => setDocs({ ...docs, licenseNumber: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.docs.licenseExpiry} *</span>
                  <input type="date" value={docs.licenseExpires} onChange={(e) => setDocs({ ...docs, licenseExpires: e.target.value })} style={{ padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }} />
                </label>
                <FileInput label={d.docs.licenseFile} placeholder={d.docs.chooseFile} file={docFiles.licenseFile} onChange={(f) => setDocFiles({ ...docFiles, licenseFile: f })} />
                <FileInput label={`${d.docs.photo} *`} placeholder={d.docs.chooseFile} file={docFiles.photo} onChange={(f) => setDocFiles({ ...docFiles, photo: f })} accept="image/*" />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #DCE6F5', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#001B45' }}>{d.vehicles.title}</span>
                <button type="button" onClick={() => setVehicles([...vehicles, emptyVehicle()])} style={{ border: '1.5px solid #087CF0', borderRadius: 100, padding: '8px 16px', background: 'rgba(8,124,240,.08)', color: '#0768C9', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ {d.vehicles.add}</button>
              </div>
              {vehicles.map((v, i) => (
                <div key={i} style={{ border: '1px solid #DCE6F5', borderRadius: 12, padding: 18, marginBottom: 14, background: '#F6F9FD' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, color: '#001B45' }}>{d.vehicles.name.replace('{n}', i + 1)}</span>
                    <button type="button" onClick={() => setVehicles(vehicles.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#A93226' }}>{d.vehicles.remove}</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px 18px', marginBottom: 14 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.vehicles.label}</span>
                      <input type="text" value={v.label} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder={d.vehiclePh} style={{ padding: '12px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', font: 'inherit', color: '#001B45', outline: 'none' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.vehicles.plate} *</span>
                      <input type="text" value={v.plate} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, plate: e.target.value } : x))} style={{ padding: '12px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', font: 'inherit', color: '#001B45', outline: 'none' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.vehicles.capacity}</span>
                      <input type="text" value={v.cargoCapacity} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, cargoCapacity: e.target.value } : x))} placeholder={d.vehicles.capacityPh} style={{ padding: '12px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', font: 'inherit', color: '#001B45', outline: 'none' }} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    {VEHICLE_DOCS.map((vd) => (
                      <div key={vd.key} style={{ border: '1px dashed #DCE6F5', borderRadius: 10, padding: 12, background: '#fff', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45' }}>{d.vehicles[vd.key]}</span>
                        <input type="text" value={v[vd.number]} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, [vd.number]: e.target.value } : x))} placeholder={d.vehicles.number} style={{ padding: '9px 12px', border: '1.5px solid #DCE6F5', borderRadius: 8, background: '#EEF4FC', font: 'inherit', fontSize: 13, color: '#001B45', outline: 'none' }} />
                        {vd.expiry && (
                          <input type="date" value={v[vd.expiry]} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, [vd.expiry]: e.target.value } : x))} title={d.vehicles.expiry} style={{ padding: '9px 12px', border: '1.5px solid #DCE6F5', borderRadius: 8, background: '#EEF4FC', font: 'inherit', fontSize: 13, color: '#001B45', outline: 'none' }} />
                        )}
                        <FileInput label={d.vehicles.file} placeholder={d.docs.chooseFile} file={v.files[vd.file]} onChange={(f) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, files: { ...x.files, [vd.file]: f } } : x))} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
            {pager.pageItems.map((driver) => {
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
                    <button onClick={() => setSelected(driver)} style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{d.viewProfile}</button>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Pagination pager={pager} labels={app.pager} />
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(16,35,63,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 26, boxShadow: '0 20px 60px rgba(0,27,69,.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 20, margin: 0, color: '#001B45' }}>{selected.n}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 20, color: '#6C82A6' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.cols[1]}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.id}</div></div>
                <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.userId}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.user_id || '—'}</div></div>
              </div>
              <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{a.name}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.name || selected.n}</div></div>
              <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{a.email}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.email}</div></div>
              <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{a.phone}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.phone}</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.cols[2]}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.v}</div></div>
                <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.cols[3]}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.hub}</div></div>
              </div>
              <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.cols[4]}</span><div style={{ fontSize: 14, color: '#001B45' }}>{selected.shift}</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.cols[6]}</span><div style={{ fontSize: 14, color: '#001B45' }}>{d.statuses[selected.st]}</div></div>
                <div><span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.cols[5]}</span><div style={{ fontSize: 14, color: '#001B45' }}>{d.docStates[selected.doc]}</div></div>
              </div>
              {(() => {
                const sdocs = selected.documents || []
                const photoDoc = sdocs.find((x) => x.type === 'photo' && x.file_path)
                const rest = sdocs.filter((x) => x.type !== 'photo')
                const vehs = selected.vehicles || []
                if (!photoDoc && !rest.length && !vehs.length) return null
                const DocRow = ({ doc }) => {
                  const expired = doc.expires_at && new Date(doc.expires_at) < new Date()
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: '1px solid #DCE6F5', borderRadius: 8, fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: '#001B45' }}>{(d.docTypes && d.docTypes[doc.type]) || doc.type}</span>
                      {doc.number && <span style={{ color: '#10233F' }}>{doc.number}</span>}
                      {doc.expires_at && <span style={{ color: expired ? '#A93226' : '#6C82A6' }}>{d.expires} {doc.expires_at}</span>}
                      {doc.file_path && <a href={`${MEDIA_URL}/${doc.file_path}`} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: '#087CF0', fontWeight: 600 }}>{d.viewFile}</a>}
                    </div>
                  )
                }
                return (
                  <>
                    {photoDoc && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={`${MEDIA_URL}/${photoDoc.file_path}`} alt={d.docTypes.photo} style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '2px solid #DCE6F5' }} />
                      </div>
                    )}
                    {rest.length > 0 && (
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.docs.title}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>{rest.map((doc, j) => <DocRow key={j} doc={doc} />)}</div>
                      </div>
                    )}
                    {vehs.length > 0 && (
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#6C82A6' }}>{d.vehicles.title}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                          {vehs.map((v, i) => (
                            <div key={i} style={{ border: '1px solid #DCE6F5', borderRadius: 10, padding: 12 }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#001B45' }}>{[v.label, v.plate].filter(Boolean).join(' · ')}</div>
                              {v.cargo_capacity && <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>{d.vehicles.capacity}: {v.cargo_capacity}</div>}
                              {(v.documents || []).length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                                  {v.documents.map((doc, j) => <DocRow key={j} doc={doc} />)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

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
