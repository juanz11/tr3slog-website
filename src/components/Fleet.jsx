import React from 'react'
import { api } from '../api'

const inputSm = {
  padding: '9px 10px', borderRadius: 9, border: '1.5px solid #D8E2EF',
  fontSize: 13, color: '#10233F', background: '#fff', outline: 'none', width: '100%',
}

export default function Fleet({ app, token }) {
  const d = app.fleet || {}
  const i18nTypes = React.useMemo(() => (app.vehicles && app.vehicles.types) || {}, [app])
  const [typeKeys, setTypeKeys] = React.useState(() => Object.keys(i18nTypes))
  const types = React.useMemo(
    () => Object.fromEntries(typeKeys.map((k) => [k, i18nTypes[k] || k])),
    [typeKeys, i18nTypes]
  )
  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [busy, setBusy] = React.useState(null)
  const [error, setError] = React.useState('')
  const [form, setForm] = React.useState({ type: '', label: '', plate: '', cargo_capacity: '' })

  const load = React.useCallback(() => {
    setLoading(true)
    api.getCompanyVehicles(token)
      .then((data) => setRows(Array.isArray(data) ? data : data.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [token])

  React.useEffect(() => { load() }, [load])

  React.useEffect(() => {
    let alive = true
    api.getCompanyVehicleTypes(token)
      .then((res) => {
        const list = res?.types || res
        if (alive && Array.isArray(list) && list.length) setTypeKeys(list)
      })
      .catch(() => {})
    return () => { alive = false }
  }, [token])

  const add = async () => {
    if (!form.label.trim() || !form.plate.trim()) { setError(d.errFields || 'Complete los campos.'); return }
    setBusy('add')
    setError('')
    try {
      await api.createCompanyVehicle({ ...form, active: true }, token)
      setForm({ type: '', label: '', plate: '', cargo_capacity: '' })
      load()
    } catch (e) {
      const taken = e?.errors?.plate || /unique|taken/i.test(e.message || '')
      setError(taken ? (d.errPlateTaken || 'Esa placa ya está registrada.') : (e.message || 'Error'))
    } finally {
      setBusy(null)
    }
  }

  const toggle = async (v) => {
    setBusy(v.id)
    try {
      await api.updateCompanyVehicle(v.id, { active: !v.active }, token)
      setRows((list) => list.map((x) => (x.id === v.id ? { ...x, active: !v.active } : x)))
    } catch (e) {
      alert(e.message || 'Error')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (v) => {
    if (!window.confirm(d.confirmRemove || '¿Eliminar este vehículo?')) return
    setBusy(v.id)
    try {
      await api.deleteCompanyVehicle(v.id, token)
      setRows((list) => list.filter((x) => x.id !== v.id))
    } catch (e) {
      alert(e.message || 'Error')
    } finally {
      setBusy(null)
    }
  }

  const thStyle = { padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6C82A6', textAlign: 'left', borderBottom: '1px solid #E3EAF4' }
  const tdStyle = { padding: '12px 14px', borderBottom: '1px solid #EDF2F8', fontSize: 13, verticalAlign: 'middle' }

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#10233F' }}>{d.title || 'Flota'}</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6C82A6' }}>{d.sub}</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E3EAF4', padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#10233F', marginBottom: 12 }}>{d.addTitle}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11.5, color: '#6C82A6', fontWeight: 600, marginBottom: 5 }}>{d.type}</div>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} style={inputSm}>
              <option value="">{d.selectType}</option>
              {Object.entries(types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: '#6C82A6', fontWeight: 600, marginBottom: 5 }}>{d.label}</div>
            <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder={d.labelPh} style={inputSm} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: '#6C82A6', fontWeight: 600, marginBottom: 5 }}>{d.plate}</div>
            <input value={form.plate} onChange={(e) => setForm((f) => ({ ...f, plate: e.target.value }))} placeholder={d.plate} style={inputSm} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: '#6C82A6', fontWeight: 600, marginBottom: 5 }}>{d.capacity}</div>
            <input value={form.cargo_capacity} onChange={(e) => setForm((f) => ({ ...f, cargo_capacity: e.target.value }))} placeholder={d.capacityPh} style={inputSm} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <button
            onClick={add}
            disabled={busy === 'add'}
            style={{
              padding: '9px 18px', borderRadius: 9, border: 'none',
              background: '#0A4E96', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: busy === 'add' ? 'wait' : 'pointer', opacity: busy === 'add' ? .6 : 1,
            }}
          >{busy === 'add' ? d.adding : d.add}</button>
          {error && <span style={{ fontSize: 12.5, color: '#A93226', fontWeight: 600 }}>{error}</span>}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E3EAF4', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6C82A6', fontSize: 13 }}>…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6C82A6', fontSize: 13 }}>{d.empty}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{(d.cols || []).map((c) => <th key={c || 'x'} style={thStyle}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} style={{ opacity: v.active ? 1 : .55 }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: '#10233F' }}>{v.label}</div>
                    <div style={{ fontSize: 11.5, color: '#8B9DBA' }}>{types[v.type] || v.type || '—'}</div>
                  </td>
                  <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10233F' }}>{v.plate}</span></td>
                  <td style={tdStyle}><span style={{ color: '#4A5D7E' }}>{v.cargo_capacity || '—'}</span></td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                      background: v.active ? 'rgba(19,122,69,.12)' : 'rgba(108,130,166,.14)',
                      color: v.active ? '#0F5F36' : '#4A5D7E',
                    }}>{v.active ? d.active : d.inactive}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => toggle(v)}
                        disabled={busy === v.id}
                        style={{
                          padding: '6px 12px', borderRadius: 8, border: '1px solid #D8E2EF',
                          background: '#fff', color: '#4A5D7E', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >{v.active ? d.deactivate : d.activate}</button>
                      <button
                        onClick={() => remove(v)}
                        disabled={busy === v.id}
                        style={{
                          padding: '6px 12px', borderRadius: 8, border: '1px solid #E3B8B1',
                          background: '#fff', color: '#A93226', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >{d.remove}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
