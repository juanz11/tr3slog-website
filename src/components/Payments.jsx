import React from 'react'

const PENDING = [
  { invoice: 'INV-1044', shipment: 'TR3-260729-PRSJ-08821', issued: '24 jul, 2026', amount: '$1,025.00' },
  { invoice: 'INV-1043', shipment: 'TR3-260729-RDPC-08790', issued: '21 jul, 2026', amount: '$318.00' },
]

const COMPLETED = [
  { invoice: 'INV-1042', shipment: 'TR3-260729-EUAL-08744', issued: '14 jul, 2026', amount: '$1,240.00' },
  { invoice: 'INV-1041', shipment: 'TR3-260729-PRSJ-08698', issued: '08 jul, 2026', amount: '$640.00' },
]

function Table({ p, rows, statusIdx, actionLabel, onAction }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{
        padding: '18px 22px', borderBottom: '1px solid #DCE6F5',
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
      }}>{statusIdx === 0 ? p.pending : p.completed}</div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 700 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr 0.8fr 0.7fr',
            gap: 12, padding: '12px 22px', fontSize: 11, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#6C82A6',
          }}>
            {p.cols.map((c, i) => <span key={i}>{c}</span>)}
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr 0.8fr 0.7fr',
              gap: 12, padding: '16px 22px', borderTop: '1px solid #E3EBF7', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{r.invoice}</span>
              <span style={{ fontSize: 13, color: '#10233F' }}>{r.shipment}</span>
              <span style={{ fontSize: 13, color: '#10233F' }}>{r.issued}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{r.amount}</span>
              <span style={{
                display: 'inline-flex', padding: '5px 11px', borderRadius: 100,
                fontSize: 11, fontWeight: 600,
                background: statusIdx === 0 ? 'rgba(217,154,0,.16)' : 'rgba(19,122,69,.12)',
                color: statusIdx === 0 ? '#8A6300' : '#0F5F36',
                justifySelf: 'start',
              }}>{p.statuses[statusIdx]}</span>
              <button onClick={onAction} style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{actionLabel}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Payments({ app }) {
  const p = app.payments
  const [notified, setNotified] = React.useState(false)

  const total = PENDING.reduce((sum, r) => {
    return sum + Number(r.amount.replace(/[^0-9.]/g, ''))
  }, 0)
  const totalText = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 800, fontSize: 30, letterSpacing: '-.02em',
        margin: '0 0 20px', color: '#001B45',
      }}>{p.title}</h1>

      <div style={{
        background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16,
        padding: 22, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6' }}>{p.totalDue}</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.02em' }}>{totalText}</div>
        </div>
        <button onClick={() => setNotified(true)} style={{
          marginLeft: 'auto', padding: '14px 22px', background: '#087CF0',
          border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>{p.pay}</button>
      </div>

      {notified && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            padding: 16, border: '1px solid #C6E6D4',
            background: '#F1FAF5', borderRadius: 12,
            fontSize: 14, lineHeight: 1.6, color: '#0F5F36',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#137A45" strokeWidth="1.9" style={{ flex: '0 0 auto' }}>
              <circle cx="12" cy="12" r="9" />
              <path d="M8.5 12.5l2.5 2.5 4.5-5" />
            </svg>
            {p.success}
          </div>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            border: '1px dashed rgba(217,154,0,.55)', background: 'rgba(217,154,0,.07)',
            borderRadius: 12, padding: '14px 16px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D99A00" strokeWidth="1.8" style={{ flex: '0 0 auto', marginTop: 1 }}>
              <path d="M12 3l9 16H3z" />
              <path d="M12 9v5M12 17v.1" />
            </svg>
            <span style={{ fontSize: 13, lineHeight: 1.6, color: '#6C5220' }}>{p.warning}</span>
          </div>
        </div>
      )}

      <Table p={p} rows={PENDING} statusIdx={0} actionLabel={p.pay} onAction={() => setNotified(true)} />
      <Table p={p} rows={COMPLETED} statusIdx={1} actionLabel={p.receipt} onAction={() => setNotified(true)} />
    </div>
  )
}
