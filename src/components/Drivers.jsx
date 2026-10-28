import React from 'react'
import { api, MEDIA_URL } from '../api'
import { Pagination, usePagination, usePolling } from './Shared'
import { authI18n } from '../i18n-auth'
import { COUNTRY_NAMES, PHONE_FORMATS } from '../lib/countries'

const SHIFT_VALUES = ['Mañana', 'Tarde', 'Noche']
const SHIFT_LABELS = {
  es: { Mañana: 'Mañana', Tarde: 'Tarde', Noche: 'Noche' },
  en: { Mañana: 'Morning', Tarde: 'Afternoon', Noche: 'Night' },
  'zh-CN': { Mañana: '早班', Tarde: '晚班', Noche: '夜班' },
}
const shiftLabel = (value, lang) => (SHIFT_LABELS[lang] || SHIFT_LABELS.es)[value] || value

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
  pending: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  rejected: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

const FILTER_KEYS = ['all', 'active', 'route', 'available', 'suspended', 'docsSoon']

const emptyVehicle = () => ({
  type: '', label: '', plate: '', cargoCapacity: '',
  registrationNumber: '', insuranceNumber: '', insuranceExpires: '',
  inspectionNumber: '', inspectionExpires: '', permitNumber: '', permitExpires: '',
  files: {},
})

const FI = { padding: '10px 13px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#EEF4FC', font: 'inherit', fontSize: 14, color: '#001B45', outline: 'none', width: '100%', boxSizing: 'border-box' }
const FL = { fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }

const VEHICLE_DOCS = [
  { key: 'registration', number: 'registrationNumber', file: 'registration' },
  { key: 'insurance', number: 'insuranceNumber', expiry: 'insuranceExpires', file: 'insurance' },
  { key: 'inspection', number: 'inspectionNumber', expiry: 'inspectionExpires', file: 'inspection' },
  { key: 'permit', number: 'permitNumber', expiry: 'permitExpires', file: 'cargo_permit' },
]

function FileInput({ label, placeholder, file, onChange, accept = 'image/*,.heic,.heif,.pdf' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{label}</span>
      <span style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
        border: `1.5px dashed ${file ? '#087CF0' : '#DCE6F5'}`, borderRadius: 10,
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

function DocRow({ doc, d, busy, rejecting, reason, onApprove, onRejectToggle, onReasonChange, onRejectConfirm, onRejectCancel }) {
  const expired = doc.expires_at && new Date(doc.expires_at) < new Date()
  const stStyle = doc.status === 'rejected' ? DOC_COLORS.rejected
    : doc.status === 'approved' ? DOC_COLORS.ok
    : DOC_COLORS.pending
  const isImage = doc.file_path && !doc.file_path.toLowerCase().endsWith('.pdf')
  return (
    <div style={{ border: '1px solid #DCE6F5', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
      {isImage && (
        <a href={`${MEDIA_URL}/${doc.file_path}`} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
          <img src={`${MEDIA_URL}/${doc.file_path}`} alt={(d.docTypes && d.docTypes[doc.type]) || doc.type} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block', background: '#EEF4FC' }} />
        </a>
      )}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#001B45' }}>{(d.docTypes && d.docTypes[doc.type]) || doc.type}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: stStyle.bg, color: stStyle.fg }}>{d.docStates[doc.status] || doc.status}</span>
        </div>
        {doc.number && <div style={{ fontSize: 12, color: '#10233F', marginTop: 4 }}>{doc.number}</div>}
        {doc.expires_at && <div style={{ fontSize: 12, color: expired ? '#A93226' : '#6C82A6', marginTop: 2 }}>{d.expires} {doc.expires_at}</div>}
        {doc.status === 'rejected' && doc.rejection_reason && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#A93226' }}>{doc.rejection_reason}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {doc.file_path && !isImage && (
            <a href={`${MEDIA_URL}/${doc.file_path}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 600, color: '#087CF0' }}>{d.viewFile}</a>
          )}
          {doc.status === 'pending' && (
            <span style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              <button type="button" disabled={busy} onClick={onApprove} style={{ padding: '6px 14px', border: 'none', borderRadius: 100, background: 'rgba(19,122,69,.12)', color: '#0F5F36', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{d.review.approve}</button>
              <button type="button" disabled={busy} onClick={onRejectToggle} style={{ padding: '6px 14px', border: 'none', borderRadius: 100, background: 'rgba(192,57,43,.1)', color: '#A93226', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{d.review.reject}</button>
            </span>
          )}
        </div>
        {rejecting && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            <textarea value={reason} onChange={(e) => onReasonChange(e.target.value)} placeholder={d.review.rejectPh} rows={2} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #DCE6F5', borderRadius: 7, background: '#fff', font: 'inherit', fontSize: 12, color: '#001B45', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" disabled={busy || !reason.trim()} onClick={onRejectConfirm} style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: 7, background: '#A93226', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{d.review.confirmReject}</button>
              <button type="button" onClick={onRejectCancel} style={{ padding: '8px 12px', border: '1.5px solid #DCE6F5', borderRadius: 7, background: '#fff', color: '#10233F', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{d.review.cancel}</button>
            </div>
          </div>
        )}
      </div>
    </div>
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
  const [form, setForm] = React.useState({ user_id: '', name: '', phone: '', country: '', email: '', vehicle: '', hub: '', shift: [], password: '' })
  const [docs, setDocs] = React.useState({ idNumber: '', idExpires: '', licenseNumber: '', licenseExpires: '' })
  const [docFiles, setDocFiles] = React.useState({ photo: null, idFile: null, licenseFile: null })
  const [vehicles, setVehicles] = React.useState([])
  const [formError, setFormError] = React.useState('')
  const [formLoading, setFormLoading] = React.useState(false)
  const [newId, setNewId] = React.useState('')
  const [clients, setClients] = React.useState([])
  const [zones, setZones] = React.useState([])
  const [selected, setSelected] = React.useState(null)
  const [rejectingId, setRejectingId] = React.useState(null)
  const [rejectReason, setRejectReason] = React.useState('')
  const [reviewBusy, setReviewBusy] = React.useState(false)
  const [editForm, setEditForm] = React.useState(null)
  const [editBusy, setEditBusy] = React.useState(false)
  const [editMsg, setEditMsg] = React.useState('')

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
    setForm({ user_id: '', name: '', phone: '', country: '', email: '', vehicle: '', hub: '', shift: [], password: '' })
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

  React.useEffect(() => {
    if (!token) return
    api.getZones(token)
      .then((data) => setZones((data.zones || []).filter((z) => z.is_active)))
      .catch(() => setZones([]))
  }, [token])

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
      fd.append('shift', (form.shift || []).join(','))
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
        const label = [v.type ? (d.vehicles.types[v.type] || v.type) : '', v.label.trim()].filter(Boolean).join(' · ')
        if (label) fd.append(`vehicles[${i}][label]`, label)
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
      fetchDrivers(true)
    } catch (err) {
      setFormError(err.message || 'No se pudo registrar el conductor')
    } finally {
      setFormLoading(false)
    }
  }

  const reviewDoc = async (docId, status, reason) => {
    if (reviewBusy) return
    setReviewBusy(true)
    try {
      await api.reviewDocument(docId, { status, reason }, token)
      setRejectingId(null)
      setRejectReason('')
      const data = await api.getDrivers(token)
      const list = Array.isArray(data) ? data : data.data || []
      setDrivers(list)
      setSelected((prev) => prev ? (list.find((x) => x.user_id === prev.user_id) || prev) : prev)
    } catch (e) {
      setError(e.message || 'Error')
    } finally {
      setReviewBusy(false)
    }
  }

  const openDriver = (driver) => {
    setSelected(driver)
    setEditForm({
      name: driver.name || '',
      email: driver.email || '',
      phone: driver.phone === '—' ? '' : driver.phone || '',
      vehicle: driver.v === '—' ? '' : driver.v || '',
      hub: driver.hub === '—' ? '' : driver.hub || '',
      shift: driver.shift === '—' ? [] : String(driver.shift || '').split(',').filter(Boolean),
      available: driver.st === 'available',
    })
    setEditMsg('')
    setRejectingId(null)
    setRejectReason('')
  }

  const closeDriver = () => {
    setSelected(null)
    setEditForm(null)
    setEditMsg('')
  }

  const saveDriver = async (e) => {
    e.preventDefault()
    if (editBusy || !selected) return
    setEditBusy(true)
    setEditMsg('')
    try {
      const updated = await api.updateDriver(selected.user_id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || null,
        vehicle: editForm.vehicle || null,
        hub: editForm.hub || null,
        shift: (editForm.shift || []).length ? editForm.shift.join(',') : null,
        available: editForm.available,
      }, token)
      setDrivers((prev) => prev.map((x) => (x.user_id === updated.user_id ? updated : x)))
      setSelected(updated)
      setEditMsg(d.saved)
    } catch (err) {
      setEditMsg(err.message || 'Error')
    } finally {
      setEditBusy(false)
    }
  }

  const renderDoc = (doc) => (
    <DocRow
      key={doc.id}
      doc={doc}
      d={d}
      busy={reviewBusy}
      rejecting={rejectingId === doc.id}
      reason={rejectReason}
      onApprove={() => reviewDoc(doc.id, 'approved')}
      onRejectToggle={() => { setRejectingId(rejectingId === doc.id ? null : doc.id); setRejectReason('') }}
      onReasonChange={setRejectReason}
      onRejectConfirm={() => reviewDoc(doc.id, 'rejected', rejectReason.trim())}
      onRejectCancel={() => { setRejectingId(null); setRejectReason('') }}
    />
  )

  if (selected && editForm) {
    const sdocs = selected.documents || []
    const photoDoc = sdocs.find((x) => x.type === 'photo' && x.file_path)
    const rest = sdocs.filter((x) => x.type !== 'photo')
    const vehs = selected.vehicles || []
    const docStyle = DOC_COLORS[selected.doc] || DOC_COLORS.ok
    const stStyle = STATUS_COLORS[selected.st] || STATUS_COLORS.available
    const verifyLabel = (d.verifyStates && d.verifyStates[selected.verification_status]) || selected.verification_status
    const inputSt = { width: '100%', padding: '12px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#EEF4FC', font: 'inherit', fontSize: 14, color: '#001B45', outline: 'none', boxSizing: 'border-box' }
    const labelSt = { display: 'flex', flexDirection: 'column', gap: 6 }
    const spanSt = { fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }
    return (
      <div>
        <div className="app-motif" aria-hidden="true">
          <span style={{ background: '#D99A00' }}></span>
          <span style={{ background: '#087CF0', width: 9 }}></span>
        </div>
        <div className="app-greeting">{d.greeting}</div>

        <button onClick={closeDriver} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#087CF0', marginBottom: 16 }}>{d.back}</button>

        {error && (
          <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>{error}</div>
        )}

        <div className="app-card" style={{ marginBottom: 20 }}>
          <div style={{ padding: '22px 26px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            {photoDoc ? (
              <img src={`${MEDIA_URL}/${photoDoc.file_path}`} alt={selected.name} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #DCE6F5', flex: '0 0 auto' }} />
            ) : (
              <span style={{ width: 88, height: 88, borderRadius: '50%', background: '#001B45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 28, flex: '0 0 auto' }}>{selected.n}</span>
            )}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 className="app-h1" style={{ marginBottom: 6 }}>{selected.name || selected.n}</h1>
              <div style={{ fontSize: 13, color: '#6C82A6', marginBottom: 10 }}>{selected.id} · {selected.email}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="app-status" style={{ background: stStyle.bg, color: stStyle.fg }}>{d.statuses[selected.st]}</span>
                <span className="app-status" style={{ background: docStyle.bg, color: docStyle.fg }}>{d.docStates[selected.doc]}</span>
                {selected.verification_status && (
                  <span className="app-status" style={{ background: selected.verification_status === 'verified' ? DOC_COLORS.ok.bg : selected.verification_status === 'rejected' ? DOC_COLORS.rejected.bg : DOC_COLORS.pending.bg, color: selected.verification_status === 'verified' ? DOC_COLORS.ok.fg : selected.verification_status === 'rejected' ? DOC_COLORS.rejected.fg : DOC_COLORS.pending.fg }}>{verifyLabel}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="app-card" style={{ marginBottom: 20 }}>
          <div className="app-card-head"><span className="app-card-title">{d.dataTitle}</span></div>
          <form onSubmit={saveDriver} style={{ padding: '18px 26px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px 22px' }}>
              <label style={labelSt}><span style={spanSt}>{a.name}</span><input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={inputSt} /></label>
              <label style={labelSt}><span style={spanSt}>{a.email}</span><input type="email" required value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} style={inputSt} /></label>
              <label style={labelSt}><span style={spanSt}>{a.phone}</span><input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} style={inputSt} /></label>
              <label style={labelSt}><span style={spanSt}>{d.cols[2]}</span><input value={editForm.vehicle} onChange={(e) => setEditForm({ ...editForm, vehicle: e.target.value })} style={inputSt} /></label>
              <label style={labelSt}><span style={spanSt}>{d.cols[3]}</span>
                <select value={editForm.hub} onChange={(e) => setEditForm({ ...editForm, hub: e.target.value })} style={{ ...inputSt, cursor: 'pointer' }}>
                  <option value="">—</option>
                  {editForm.hub && !zones.some((z) => z.name === editForm.hub) && <option value={editForm.hub}>{editForm.hub}</option>}
                  {zones.map((z) => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </label>
              <label style={labelSt}><span style={spanSt}>{d.cols[4]}</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 6 }}>
                  {SHIFT_VALUES.map((s) => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: `1.5px solid ${editForm.shift.includes(s) ? '#087CF0' : '#DCE6F5'}`, background: editForm.shift.includes(s) ? 'rgba(8,124,240,.08)' : '#fff', cursor: 'pointer', fontSize: 13, color: '#10233F' }}>
                      <input type="checkbox" checked={editForm.shift.includes(s)} onChange={() => setEditForm(f => ({ ...f, shift: f.shift.includes(s) ? f.shift.filter(x => x !== s) : [...f.shift, s] }))} />
                      {shiftLabel(s, lang)}
                    </label>
                  ))}
                </div>
              </label>
              <label style={labelSt}>
                <span style={spanSt}>{d.availability}</span>
                <select value={editForm.available ? '1' : '0'} onChange={(e) => setEditForm({ ...editForm, available: e.target.value === '1' })} style={{ ...inputSt, cursor: 'pointer' }}>
                  <option value="1">{d.statuses.available}</option>
                  <option value="0">{d.statuses.offduty}</option>
                </select>
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
              <button type="submit" disabled={editBusy} className="app-primary">{editBusy ? 'Procesando…' : d.save}</button>
              {editMsg && <span style={{ fontSize: 13, color: editMsg === d.saved ? '#0F5F36' : '#A93226' }}>{editMsg}</span>}
            </div>
          </form>
        </div>

        {rest.length > 0 && (
          <div className="app-card" style={{ marginBottom: 20 }}>
            <div className="app-card-head"><span className="app-card-title">{d.docs.title}</span></div>
            <div style={{ padding: '18px 26px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
              {rest.map(renderDoc)}
            </div>
          </div>
        )}

        {vehs.length > 0 && (
          <div className="app-card" style={{ marginBottom: 20 }}>
            <div className="app-card-head"><span className="app-card-title">{d.vehicles.title}</span></div>
            <div style={{ padding: '18px 26px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {vehs.map((v, i) => (
                <div key={i} style={{ border: '1px solid #DCE6F5', borderRadius: 12, padding: 18, background: '#F6F9FD' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#001B45' }}>{[v.label, v.plate].filter(Boolean).join(' · ')}</div>
                  {v.cargo_capacity && <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>{d.vehicles.capacity}: {v.cargo_capacity}</div>}
                  {(v.documents || []).length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16, marginTop: 14 }}>
                      {v.documents.map(renderDoc)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
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
        <form onSubmit={submit} autoComplete="off" style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 24, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {formError && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#FDECEC', color: '#B91C1C', fontSize: 14 }}>{formError}</div>
          )}
          <div style={{ maxWidth: 420 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={FL}>{d.selectClient}</span>
              <select value={form.user_id} onChange={(e) => handleClientChange(e.target.value)} style={{ ...FI, cursor: 'pointer' }}>
                <option value="">{d.newDriver}</option>
                {clients.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name} — {c.email}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px 18px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={FL}>{a.name}</span>
              <input type="text" required disabled={!!form.user_id} autoComplete="off" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={FI} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={FL}>{a.email}</span>
              <input type="email" required disabled={!!form.user_id} autoComplete="off" name="driver_reg_email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={FI} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={FL}>{a.phone}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={{ flex: '0 0 92px', padding: '10px 8px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#EEF4FC', color: '#001B45', font: 'inherit', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
                  <option value="">{a.country}</option>
                  {Object.keys(PHONE_FORMATS).filter((k) => k === 'DO' || k === 'CR').map((k) => (
                    <option key={k} value={k}>{PHONE_FORMATS[k].code} {k}</option>
                  ))}
                </select>
                <input type="tel" inputMode="tel" autoComplete="off" name="driver_reg_phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={form.country && PHONE_FORMATS[form.country] ? PHONE_FORMATS[form.country].example : d.phonePh} style={{ ...FI, flex: 1, minWidth: 0 }} />
              </div>
            </label>
            {!form.user_id && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FL}>{a.password}</span>
                <input type="password" required autoComplete="new-password" name="driver_reg_password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={FI} />
              </label>
            )}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={FL}>{d.cols[3]}</span>
              <select value={form.hub} onChange={(e) => setForm({ ...form, hub: e.target.value })} style={{ ...FI, cursor: 'pointer', color: form.hub ? '#001B45' : '#6C82A6' }}>
                <option value="">—</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.name}>{z.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={FL}>{d.cols[4]}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 6 }}>
                {SHIFT_VALUES.map((s) => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: `1.5px solid ${form.shift.includes(s) ? '#087CF0' : '#DCE6F5'}`, background: form.shift.includes(s) ? 'rgba(8,124,240,.08)' : '#fff', cursor: 'pointer', fontSize: 13, color: '#10233F' }}>
                    <input type="checkbox" checked={form.shift.includes(s)} onChange={() => setForm(f => ({ ...f, shift: f.shift.includes(s) ? f.shift.filter(x => x !== s) : [...f.shift, s] }))} />
                    {shiftLabel(s, lang)}
                  </label>
                ))}
              </div>
            </label>

            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #DCE6F5', paddingTop: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#001B45', marginBottom: 4 }}>{d.docs.title}</div>
              <div style={{ fontSize: 12, color: '#6C82A6', marginBottom: 14 }}>{d.docs.required}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px 18px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FL}>{d.docs.idNumber} *</span>
                  <input type="text" value={docs.idNumber} onChange={(e) => setDocs({ ...docs, idNumber: e.target.value })} style={FI} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FL}>{d.docs.idExpiry}</span>
                  <input type="date" value={docs.idExpires} onChange={(e) => setDocs({ ...docs, idExpires: e.target.value })} style={FI} />
                </label>
                <FileInput label={d.docs.idFile} placeholder={d.docs.chooseFile} file={docFiles.idFile} onChange={(f) => setDocFiles({ ...docFiles, idFile: f })} />
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FL}>{d.docs.licenseNumber} *</span>
                  <input type="text" value={docs.licenseNumber} onChange={(e) => setDocs({ ...docs, licenseNumber: e.target.value })} style={FI} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FL}>{d.docs.licenseExpiry} *</span>
                  <input type="date" value={docs.licenseExpires} onChange={(e) => setDocs({ ...docs, licenseExpires: e.target.value })} style={FI} />
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px 14px', marginBottom: 12 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.vehicles.type}</span>
                      <select value={v.type} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, type: e.target.value } : x))} style={{ padding: '10px 12px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', font: 'inherit', fontSize: 13, color: v.type ? '#001B45' : '#6C82A6', outline: 'none' }}>
                        <option value="">{d.vehicles.selectType}</option>
                        {Object.entries(d.vehicles.types).map(([k, label]) => (
                          <option key={k} value={k}>{label}</option>
                        ))}
                      </select>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.vehicles.label}</span>
                      <input type="text" value={v.label} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder={d.vehiclePh} style={{ padding: '10px 12px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', font: 'inherit', fontSize: 13, color: '#001B45', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.vehicles.plate} *</span>
                      <input type="text" value={v.plate} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, plate: e.target.value } : x))} style={{ padding: '10px 12px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', font: 'inherit', fontSize: 13, color: '#001B45', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{d.vehicles.capacity}</span>
                      <input type="text" value={v.cargoCapacity} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, cargoCapacity: e.target.value } : x))} placeholder={d.vehicles.capacityPh} style={{ padding: '10px 12px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', font: 'inherit', fontSize: 13, color: '#001B45', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
                    {VEHICLE_DOCS.map((vd) => (
                      <div key={vd.key} style={{ border: '1px dashed #DCE6F5', borderRadius: 10, padding: 12, background: '#fff', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#001B45' }}>{d.vehicles[vd.key]}</span>
                        <input type="text" value={v[vd.number]} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, [vd.number]: e.target.value } : x))} placeholder={d.vehicles.number} style={{ padding: '8px 10px', border: '1.5px solid #DCE6F5', borderRadius: 8, background: '#EEF4FC', font: 'inherit', fontSize: 12.5, color: '#001B45', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                        {vd.expiry && (
                          <input type="date" value={v[vd.expiry]} onChange={(e) => setVehicles(vehicles.map((x, j) => j === i ? { ...x, [vd.expiry]: e.target.value } : x))} title={d.vehicles.expiry} style={{ padding: '8px 10px', border: '1.5px solid #DCE6F5', borderRadius: 8, background: '#EEF4FC', font: 'inherit', fontSize: 12.5, color: '#001B45', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
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
                  <span className="app-table-text">{String(driver.shift || '').split(',').filter(Boolean).map(v => shiftLabel(v, lang)).join(' · ') || '—'}</span>
                  <span className="app-status" style={{ background: docStyle.bg, color: docStyle.fg }}>{d.docStates[driver.doc]}</span>
                  <span className="app-status" style={{ background: stStyle.bg, color: stStyle.fg }}>{d.statuses[driver.st]}</span>
                  <span>
                    <button onClick={() => openDriver(driver)} style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{d.viewProfile}</button>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Pagination pager={pager} labels={app.pager} />
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
