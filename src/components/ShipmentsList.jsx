import React from 'react'

const STATUS_TONE = [
  { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  { bg: '#EEF4FC', fg: '#10233F' },
  { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
]

const ROWS = [
  { id: 'TR3-260729-PRSJ-08821', route: 'Miami → San Juan', service: 'Consolidado', status: 0, eta: '31 jul' },
  { id: 'TR3-260729-RDPC-08790', route: 'San Juan → Ponce', service: 'Última milla', status: 1, eta: '27 jul' },
  { id: 'TR3-260729-EUAL-08744', route: 'Miami → Santo Domingo', service: 'Marítimo', status: 2, eta: '22 jul' },
  { id: 'TR3-260729-EUAL-08702', route: 'Bayamón → Caguas', service: 'Entrega local', status: 3, eta: '—' },
  { id: 'TR3-260729-PRSJ-08698', route: 'Miami → Orlando', service: 'Carga terrestre', status: 4, eta: '26 jul' },
]

export default function ShipmentsList({ app }) {
  const s = app.ship
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState(0)

  const filtered = ROWS.filter((r) => {
    const matchesFilter = filter === 0 || r.status === filter - 1
    const q = query.toLowerCase()
    const matchesQuery = !q || r.id.toLowerCase().includes(q) || r.route.toLowerCase().includes(q) || s.statuses[r.status].toLowerCase().includes(q)
    return matchesFilter && matchesQuery
  })

  return (
    <div style={{ width: '100%' }}>
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
      }}>{s.title}</h1>

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.searchPh}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#001B45' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {s.filters.map((f, i) => {
              const on = i === filter
              return (
                <button
                  key={i}
                  onClick={() => setFilter(i)}
                  style={{
                    padding: '10px 14px',
                    border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                    borderRadius: 100,
                    background: on ? 'rgba(8,124,240,.08)' : '#fff',
                    color: on ? '#0768C9' : '#10233F',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >{f}</button>
              )
            })}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 760 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr 1fr 0.7fr 0.5fr',
              gap: 12, padding: '12px 22px', fontSize: 11, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#6C82A6',
            }}>
              {s.cols.map((col, i) => <span key={i}>{col}</span>)}
            </div>
            {filtered.map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr 1fr 0.7fr 0.5fr',
                gap: 12, padding: '16px 22px', borderTop: '1px solid #E3EBF7', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{r.id}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.route}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.service}</span>
                <span style={{
                  display: 'inline-flex', padding: '5px 11px', borderRadius: 100,
                  fontSize: 11, fontWeight: 600,
                  background: STATUS_TONE[r.status].bg, color: STATUS_TONE[r.status].fg,
                  justifySelf: 'start',
                }}>{s.statuses[r.status]}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.eta}</span>
                <button style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{s.view}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
