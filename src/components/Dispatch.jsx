import React from 'react'
import { api } from '../api'
import { Pagination, usePagination } from './Shared'

const STATUS_COLORS = {
  pending: { bg: '#EEF4FC', fg: '#10233F' },
  assigned: { bg: 'rgba(8,124,240,.16)', fg: '#0A4E96' },
  in_transit: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  out_for_delivery: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  delivered: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  incident: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

const NEXT_STATUS = {
  pending: 'in_transit',
  assigned: 'in_transit',
  in_transit: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

const INACTIVE_STATUSES = ['delivered', 'incident']

const DRIVER_TONE = {
  active: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  route: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  available: { bg: '#EEF4FC', fg: '#10233F' },
  suspended: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
  offduty: { bg: '#EEF4FC', fg: '#6C82A6' },
}

const driverNameOf = (shipment, drivers) => {
  const dr = (drivers || []).find((x) => String(x.user_id || x.id) === String(shipment.driver_id))
  return shipment.driver_name || (shipment.driver && shipment.driver.name) || (dr && (dr.name || dr.n)) || ''
}

function AssignDriverModal({ d, app, shipment, drivers, busyDrivers, saving, error, onConfirm, onClose }) {
  const a = d.assign
  const [query, setQuery] = React.useState('')
  const initialId = shipment.driver_id ? String(shipment.driver_id) : ''
  const [driverId, setDriverId] = React.useState(initialId)

  const isBusy = (dr) => busyDrivers.has(String(dr.user_id || dr.id)) && String(dr.user_id || dr.id) !== initialId

  const q = query.trim().toLowerCase()
  const filtered = (drivers || [])
    .filter((dr) => !q || [dr.name || dr.n, dr.user_id || dr.id, dr.vehicle || dr.v, dr.hub]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q)))
    .sort((x, y) => Number(isBusy(x)) - Number(isBusy(y)))

  const submit = async () => {
    const ok = await onConfirm(driverId || null)
    if (ok) onClose()
  }

  const radio = (on) => (
    <span style={{
      width: 16, height: 16, borderRadius: '50%', flex: '0 0 auto',
      border: `2px solid ${on ? '#087CF0' : '#C9D6EA'}`,
      background: on ? '#087CF0' : '#fff',
      boxShadow: on ? 'inset 0 0 0 3px #fff' : 'none',
    }} />
  )

  const rowStyle = (on) => ({
    display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
    padding: '12px 14px', border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`, borderRadius: 11,
    background: on ? 'rgba(8,124,240,.06)' : '#fff', cursor: 'pointer', font: 'inherit',
  })

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(16,35,63,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '86vh', padding: 24, boxShadow: '0 20px 60px rgba(0,27,69,.18)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div>
            <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 20, margin: 0, color: '#001B45' }}>{a.title}</h2>
            <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 4 }}>{shipment.tracking_number || `#${shipment.id}`}</div>
          </div>
          <button onClick={onClose} aria-label={a.cancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 22, lineHeight: 1, color: '#6C82A6' }}>×</button>
        </div>

        {error && (
          <div style={{ padding: '12px 14px', background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 10, fontSize: 13 }}>{error}</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4.5-4.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={a.searchPh}
            autoFocus
            style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#001B45' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', minHeight: 0 }}>
          <button onClick={() => setDriverId('')} style={rowStyle(driverId === '')}>
            {radio(driverId === '')}
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#6C82A6' }}>{a.unassign}</span>
          </button>
          {filtered.map((dr) => {
            const id = String(dr.user_id || dr.id)
            const on = driverId === id
            const busy = isBusy(dr)
            const st = dr.st || dr.status
            const stLabel = (app.drivers && app.drivers.statuses && app.drivers.statuses[st]) || ''
            const tone = DRIVER_TONE[st] || DRIVER_TONE.available
            return (
              <button
                key={id}
                onClick={() => !busy && setDriverId(id)}
                disabled={busy}
                style={{ ...rowStyle(on), opacity: busy ? .55 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
              >
                {radio(on)}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#001B45' }}>{dr.name || dr.n}</span>
                  <span style={{ display: 'block', fontSize: 12, color: '#6C82A6', marginTop: 2 }}>
                    {[dr.user_id || dr.id, dr.vehicle || dr.v, dr.hub].filter(Boolean).join(' · ')}
                  </span>
                </span>
                {busy ? (
                  <span className="app-status" style={{ background: 'rgba(217,154,0,.16)', color: '#8A6300' }}>{a.busy}</span>
                ) : stLabel && <span className="app-status" style={{ background: tone.bg, color: tone.fg }}>{stLabel}</span>}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '18px 14px', textAlign: 'center', color: '#6C82A6', fontSize: 13 }}>{a.empty}</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '11px 18px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', color: '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{a.cancel}</button>
          <button
            onClick={submit}
            disabled={saving || driverId === initialId}
            className="app-primary"
            style={{ padding: '11px 20px', opacity: saving || driverId === initialId ? .6 : 1 }}
          >{saving ? d.updating : a.confirm}</button>
        </div>
      </div>
    </div>
  )
}

function DetailField({ label, value, wide }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: '#10233F', overflowWrap: 'anywhere' }}>{value}</div>
    </div>
  )
}

function ShipmentDetail({ d, lang, shipment, drivers, onClose }) {
  const s = shipment
  const det = d.detail
  const f = det.fields
  const style = STATUS_COLORS[s.status] || STATUS_COLORS.pending
  const inProgress = !INACTIVE_STATUSES.includes(s.status) && s.status !== 2 && s.status !== 4

  const driver = (drivers || []).find((dr) => String(dr.user_id || dr.id) === String(s.driver_id))
  const embeddedDriver = s.driver || {}
  const driverInfo = {
    name: s.driver_name || embeddedDriver.name || (driver && (driver.name || driver.n)),
    vehicle: s.driver_vehicle || embeddedDriver.vehicle || (driver && (driver.vehicle || driver.v)),
    phone: embeddedDriver.phone || (driver && driver.phone),
    email: embeddedDriver.email || (driver && driver.email),
  }
  const hasDriver = driverInfo.name || driverInfo.vehicle || driverInfo.phone || s.assigned_at

  const locale = lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'es-ES'
  const fmt = (date) => {
    if (!date) return ''
    const dt = new Date(date)
    if (isNaN(dt.getTime())) return ''
    return dt.toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const party = (prefix) => {
    const obj = s[prefix] || {}
    const pick = (k) => obj[k] || s[`${prefix}_${k}`] || ''
    return {
      name: pick('name'), company: pick('company'), address: pick('address'),
      city: pick('city'), country: pick('country'), zip: pick('zip'),
      phone: pick('phone'), email: pick('email'),
    }
  }
  const sender = party('sender')
  const recipient = party('recipient')
  const clientName = (s.client && s.client.name) || s.client_name

  const method = s.payment_method || (s.payment_method_id ? 'card' : '')
  const methodLabel = det.methods[method] || method

  const packages = Array.isArray(s.packages) && s.packages.length ? s.packages : [s]
  const pt = s.parsed_tracking || {}

  const card = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: '18px 20px' }
  const secTitle = { fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', margin: '0 0 14px', color: '#001B45' }
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }

  const PartyCard = ({ title, p, fallbackCity }) => (
    <div style={card}>
      <div style={secTitle}>{title}</div>
      <div style={grid}>
        <DetailField label={f.name} value={p.name} />
        <DetailField label={f.company} value={p.company} />
        <DetailField label={f.address} value={p.address} wide />
        <DetailField label={f.city} value={p.city || fallbackCity} />
        <DetailField label={f.country} value={p.country} />
        <DetailField label={f.zip} value={p.zip} />
        <DetailField label={f.phone} value={p.phone} />
        <DetailField label={f.email} value={p.email} wide />
      </div>
    </div>
  )

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(16,35,63,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#F6F9FD', borderRadius: 16, width: '100%', maxWidth: 760, maxHeight: '88vh', overflowY: 'auto', padding: 24, boxShadow: '0 20px 60px rgba(0,27,69,.18)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 22, margin: 0, color: '#001B45' }}>{s.tracking_number || `#${s.id}`}</h2>
          <span className="app-status" style={{ background: style.bg, color: style.fg }}>{d.statuses[s.status] || s.status}</span>
          <span style={{
            display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600,
            background: inProgress ? 'rgba(8,124,240,.1)' : '#EEF4FC',
            color: inProgress ? '#0768C9' : '#6C82A6',
          }}>{det.inProgress}: {inProgress ? det.yes : det.no}</span>
          <button onClick={onClose} aria-label={det.close} style={{ marginLeft: 'auto', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 22, lineHeight: 1, color: '#6C82A6' }}>×</button>
        </div>

        <div style={card}>
          <div style={secTitle}>{det.sections.general}</div>
          <div style={grid}>
            <DetailField label={f.tracking} value={s.tracking_number || `#${s.id}`} />
            <DetailField label={f.service} value={s.service_type || s.service} />
            <DetailField label={f.origin} value={s.origin} />
            <DetailField label={f.destination} value={s.destination} />
            <DetailField label={f.client} value={clientName} />
            <DetailField label={f.eta} value={fmt(s.eta || s.estimated_delivery)} />
            {(pt.location_name || pt.package_type_name) && (
              <DetailField label={f.trackingDetail} value={[pt.location_name, pt.package_type_name].filter(Boolean).join(' · ')} wide />
            )}
          </div>
        </div>

        <div style={card}>
          <div style={secTitle}>{det.sections.driver}</div>
          {hasDriver ? (
            <div style={grid}>
              <DetailField label={f.name} value={driverInfo.name || d.unassigned} />
              <DetailField label={f.vehicle} value={driverInfo.vehicle} />
              <DetailField label={f.phone} value={driverInfo.phone} />
              <DetailField label={f.email} value={driverInfo.email} />
              <DetailField label={f.assignedAt} value={fmt(s.assigned_at)} />
            </div>
          ) : (
            <div style={{ fontSize: 14, color: '#6C82A6' }}>{d.unassigned}</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <PartyCard title={det.sections.sender} p={sender} fallbackCity={s.origin} />
          <PartyCard title={det.sections.recipient} p={recipient} fallbackCity={s.destination} />
        </div>

        {packages.map((pkg, i) => {
          if (!(pkg.pieces || pkg.weight || pkg.dimensions || pkg.declared_value || pkg.content)) return null
          return (
            <div key={i} style={card}>
              <div style={secTitle}>{packages.length > 1 ? det.packageN.replace('{n}', i + 1) : det.sections.package}</div>
              <div style={grid}>
                <DetailField label={f.pieces} value={pkg.pieces} />
                <DetailField label={f.weight} value={pkg.weight ? `${pkg.weight} ${pkg.weight_unit || ''}`.trim() : ''} />
                <DetailField label={f.dimensions} value={pkg.dimensions} />
                <DetailField label={f.declaredValue} value={pkg.declared_value ? `$${pkg.declared_value}` : ''} />
                <DetailField label={f.content} value={pkg.content} wide />
              </div>
            </div>
          )
        })}

        <div style={card}>
          <div style={secTitle}>{det.sections.dates}</div>
          <div style={grid}>
            <DetailField label={f.created} value={fmt(s.created_at)} />
            <DetailField label={f.updated} value={fmt(s.updated_at)} />
            <DetailField label={f.pickup} value={[fmt(s.pickup_date), s.pickup_window].filter(Boolean).join(' · ')} />
            <DetailField label={f.delivered} value={fmt(s.delivered_at)} />
          </div>
        </div>

        {(method || s.charge_to_account) && (
          <div style={card}>
            <div style={secTitle}>{det.sections.payment}</div>
            <div style={grid}>
              <DetailField label={f.method} value={methodLabel} />
              <DetailField label={f.bank} value={s.payment_bank} />
              <DetailField label={f.reference} value={s.payment_reference} />
              <DetailField label={f.charge} value={s.charge_to_account} />
            </div>
          </div>
        )}

        {s.notes && (
          <div style={card}>
            <div style={secTitle}>{det.sections.notes}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#10233F' }}>{s.notes}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dispatch({ app, lang, token }) {
  const d = app.dispatch
  const [shipments, setShipments] = React.useState([])
  const [drivers, setDrivers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [updateError, setUpdateError] = React.useState('')
  const [updatingId, setUpdatingId] = React.useState(null)
  const [assigningId, setAssigningId] = React.useState(null)
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState('all')
  const [selected, setSelected] = React.useState(null)
  const [assignTarget, setAssignTarget] = React.useState(null)

  const fetchShipments = React.useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [shipmentData, driverData] = await Promise.all([
        api.getShipments(token),
        api.getDrivers(token),
      ])
      setShipments(Array.isArray(shipmentData) ? shipmentData : shipmentData.data || [])
      setDrivers(Array.isArray(driverData) ? driverData : driverData.data || [])
    } catch (e) {
      setError(e.message || d.error)
    } finally {
      setLoading(false)
    }
  }, [token, d.error])

  React.useEffect(() => {
    fetchShipments()
    const interval = setInterval(fetchShipments, 30000)
    return () => clearInterval(interval)
  }, [fetchShipments])

  const formatDate = (date) => {
    if (!date) return '—'
    const dt = new Date(date)
    return dt.toLocaleString(lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'es-ES', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })
  }

  const statusLabel = (status) => d.statuses[status] || status

  const filtered = shipments.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || [s.tracking_number, s.origin, s.destination, s.recipient_name]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q))
    return matchesFilter && matchesQuery
  })

  const busyDriverIds = React.useMemo(() => {
    const ids = new Set()
    shipments.forEach((s) => {
      if (!s.driver_id) return
      const active = !INACTIVE_STATUSES.includes(s.status) && s.status !== 2 && s.status !== 4
      if (active) ids.add(String(s.driver_id))
    })
    return ids
  }, [shipments])

  const pager = usePagination(filtered, 10, `${filter}|${query}`)

  const formatTracking = (s) => {
    if (s.parsed_tracking) {
      const pt = s.parsed_tracking
      return `${pt.location_name} · ${pt.package_type_name}`
    }
    return s.tracking_number || `#${s.id}`
  }

  const advanceStatus = async (shipment) => {
    const next = NEXT_STATUS[shipment.status]
    if (!next) return
    setUpdatingId(shipment.id)
    setUpdateError('')
    try {
      const updated = await api.updateShipmentStatus(shipment.id, next, token)
      setShipments((prev) => prev.map((s) => (s.id === shipment.id ? { ...s, ...updated } : s)))
    } catch (e) {
      setUpdateError(e.message || d.updateError)
    } finally {
      setUpdatingId(null)
    }
  }

  const assignDriver = async (shipment, driverId) => {
    setAssigningId(shipment.id)
    setUpdateError('')
    try {
      const result = await api.assignShipmentDriver(shipment.id, driverId, token)
      setShipments((prev) => prev.map((s) => (s.id === shipment.id ? { ...s, ...result.shipment } : s)))
      return true
    } catch (e) {
      setUpdateError(e.message || d.assignError)
      return false
    } finally {
      setAssigningId(null)
    }
  }

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>
      <h1 className="app-h1">{d.title}</h1>

      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}
      {updateError && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {updateError}
        </div>
      )}

      <div className="app-card">
        <div className="app-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="app-card-title">{d.listTitle}</span>
          <span style={{ fontSize: 13, color: '#6C82A6' }}>
            {loading ? d.loading : `${d.autoRefresh} 30s`}
          </span>
        </div>

        <div style={{ padding: '14px 18px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
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
            {d.filters.map((f) => {
              const on = f === filter
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '9px 14px',
                    border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                    borderRadius: 100,
                    background: on ? 'rgba(8,124,240,.08)' : '#fff',
                    color: on ? '#0768C9' : '#10233F',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >{f === 'all' ? d.filterAll : statusLabel(f)}</button>
              )
            })}
          </div>
        </div>

        <div className="app-table-scroll">
          <div className="app-table">
            <div className="app-table-head" style={{ gridTemplateColumns: '1fr 1.3fr 1fr .8fr .9fr 1.2fr .8fr 1fr' }}>
              <span>{d.cols.tracking}</span>
              <span>{d.cols.route}</span>
              <span>{d.cols.recipient}</span>
              <span>{d.cols.service}</span>
              <span>{d.cols.status}</span>
              <span>{d.cols.driver}</span>
              <span>{d.cols.updatedAt}</span>
              <span>{d.cols.actions}</span>
            </div>
            {filtered.length === 0 && !loading && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>
                {d.empty}
              </div>
            )}
            {pager.pageItems.map((s) => {
              const style = STATUS_COLORS[s.status] || STATUS_COLORS.pending
              const next = NEXT_STATUS[s.status]
              return (
                <div key={s.id} className="app-table-row" style={{ gridTemplateColumns: '1fr 1.3fr 1fr .8fr .9fr 1.2fr .8fr 1fr', alignItems: 'center' }}>
                  <span className="app-table-id" title={s.tracking_number}>
                    <button
                      onClick={() => setSelected(s)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', fontWeight: 700, color: '#087CF0', textAlign: 'left' }}
                    >{s.tracking_number || `#${s.id}`}</button>
                    {s.parsed_tracking && (
                      <span style={{ display: 'block', fontSize: 11, color: '#6C82A6', fontWeight: 400 }}>
                        {formatTracking(s)}
                      </span>
                    )}
                  </span>
                  <span className="app-table-text" title={`${s.origin || ''} → ${s.destination || ''}`}>
                    {s.origin || '—'} → {s.destination || '—'}
                  </span>
                  <span className="app-table-text">{s.recipient_name || '—'}</span>
                  <span className="app-table-text">{s.service_type || '—'}</span>
                  <span className="app-status" style={{ background: style.bg, color: style.fg }}>
                    {statusLabel(s.status)}
                  </span>
                  <span>
                    {(() => {
                      const name = driverNameOf(s, drivers)
                      return name ? (
                        <button
                          onClick={() => setAssignTarget(s)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', fontSize: 13, fontWeight: 600, color: '#087CF0', textAlign: 'left' }}
                        >{name}</button>
                      ) : (
                        <button
                          onClick={() => setAssignTarget(s)}
                          disabled={assigningId === s.id}
                          style={{
                            border: '1.5px solid #087CF0', borderRadius: 8, padding: '7px 12px',
                            background: 'rgba(8,124,240,.08)', color: '#0768C9', fontSize: 12, fontWeight: 600,
                            cursor: assigningId === s.id ? 'not-allowed' : 'pointer',
                          }}
                        >{assigningId === s.id ? d.updating : d.assign.btn}</button>
                      )
                    })()}
                    {s.assigned_at && (
                      <span style={{ display: 'block', fontSize: 11, color: '#6C82A6', marginTop: 4 }}>
                        {formatDate(s.assigned_at)}
                      </span>
                    )}
                  </span>
                  <span className="app-table-text">{formatDate(s.updated_at)}</span>
                  <span>
                    {next && s.status !== 'incident' && (
                      <button
                        onClick={() => advanceStatus(s)}
                        disabled={updatingId === s.id}
                        style={{
                          border: 'none', borderRadius: 8, padding: '8px 12px',
                          background: '#087CF0', color: '#fff', fontSize: 12, fontWeight: 600,
                          cursor: updatingId === s.id ? 'not-allowed' : 'pointer',
                          opacity: updatingId === s.id ? .7 : 1,
                        }}
                      >{updatingId === s.id ? d.updating : d.advanceTo[next]}</button>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Pagination pager={pager} labels={app.pager} />
      </div>

      {selected && (
        <ShipmentDetail d={d} lang={lang} shipment={selected} drivers={drivers} onClose={() => setSelected(null)} />
      )}

      {assignTarget && (
        <AssignDriverModal
          d={d}
          app={app}
          shipment={assignTarget}
          drivers={drivers}
          busyDrivers={busyDriverIds}
          saving={assigningId === assignTarget.id}
          error={updateError}
          onConfirm={(driverId) => assignDriver(assignTarget, driverId)}
          onClose={() => setAssignTarget(null)}
        />
      )}
    </div>
  )
}
