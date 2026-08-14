import React from 'react'

const SEV_COLORS = {
  low: { bg: '#EEF4FC', fg: '#10233F' },
  medium: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  high: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
  critical: { bg: '#A93226', fg: '#fff' },
}

const STATUS_COLORS = {
  open: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  investigating: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  resolved: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  closed: { bg: '#EEF4FC', fg: '#6C82A6' },
}

const DEMO_INCIDENTS = [
  { id: 'CS-0231', ship: 'TR3-260729-EUAL-08744', type: 'Mercancía dañada', sev: 'high', when: '25 jul · 10:12', owner: 'C. Méndez', st: 'investigating', cost: true },
  { id: 'CS-0230', ship: 'TR3-260729-RDPC-08790', type: 'Intento de entrega fallido', sev: 'medium', when: '24 jul · 16:40', owner: 'A. Rojas', st: 'open', cost: true },
  { id: 'CS-0229', ship: 'TR3-260729-PRSJ-08698', type: 'Pieza faltante', sev: 'high', when: '23 jul · 09:05', owner: 'C. Méndez', st: 'investigating', cost: true },
  { id: 'CS-0228', ship: 'TR3-260729-EUAL-08651', type: 'Retraso', sev: 'low', when: '21 jul · 14:22', owner: 'A. Rojas', st: 'resolved', cost: false },
  { id: 'CS-0227', ship: 'TR3-260729-RDPC-08604', type: 'Falla del vehículo', sev: 'critical', when: '19 jul · 07:48', owner: 'R. Vega', st: 'closed', cost: true },
]

const FILTER_KEYS = ['all', 'open', 'investigating', 'high', 'costly', 'closed']

function matchesFilter(incident, key) {
  if (key === 'all') return true
  if (key === 'open') return incident.st === 'open'
  if (key === 'investigating') return incident.st === 'investigating'
  if (key === 'high') return incident.sev === 'high' || incident.sev === 'critical'
  if (key === 'costly') return incident.cost
  if (key === 'closed') return incident.st === 'closed' || incident.st === 'resolved'
  return true
}

export default function Incidents({ app }) {
  const d = app.incidents
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState('all')

  const filtered = DEMO_INCIDENTS.filter((incident) => {
    const matches = matchesFilter(incident, filter)
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || [incident.id, incident.ship, incident.type, incident.owner]
      .some((v) => String(v).toLowerCase().includes(q))
    return matches && matchesQuery
  })

  const filterCounts = FILTER_KEYS.map((key) => ({
    key,
    count: DEMO_INCIDENTS.filter((incident) => matchesFilter(incident, key)).length,
  }))

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 className="app-h1" style={{ marginBottom: 8 }}>{d.title}</h1>
          <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch' }}>{d.sub}</p>
        </div>
        <button className="app-primary" style={{ marginLeft: 'auto' }}>{d.openCaseBtn}</button>
      </div>

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
          <div className="app-table" style={{ minWidth: 980 }}>
            <div className="app-table-head" style={{ gridTemplateColumns: '.8fr 1.2fr 1.2fr .8fr 1fr 1fr .9fr .7fr' }}>
              {d.cols.map((col, i) => (<span key={i}>{col}</span>))}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>{d.empty}</div>
            )}
            {filtered.map((incident) => {
              const sevStyle = SEV_COLORS[incident.sev] || SEV_COLORS.low
              const stStyle = STATUS_COLORS[incident.st] || STATUS_COLORS.open
              return (
                <div key={incident.id} className="app-table-row" style={{ gridTemplateColumns: '.8fr 1.2fr 1.2fr .8fr 1fr 1fr .9fr .7fr', alignItems: 'center' }}>
                  <span className="app-table-id">{incident.id}</span>
                  <span className="app-table-text">{incident.ship}</span>
                  <span className="app-table-text">{incident.type}</span>
                  <span className="app-status" style={{ background: sevStyle.bg, color: sevStyle.fg }}>{d.sev[incident.sev]}</span>
                  <span className="app-table-text">{incident.when}</span>
                  <span className="app-table-text">{incident.owner}</span>
                  <span className="app-status" style={{ background: stStyle.bg, color: stStyle.fg }}>{d.statuses[incident.st]}</span>
                  <span>
                    <button style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{d.viewCase}</button>
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
