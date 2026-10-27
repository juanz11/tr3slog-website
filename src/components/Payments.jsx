import React from 'react'
import { Pagination, usePagination } from './Shared'
import { api } from '../api'

const fmtMoney = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—'

const METHOD_LABELS = {
  card: 'Tarjeta', transfer: 'Transferencia', cash: 'Efectivo', paypal: 'PayPal',
}
const MODE_LABELS = {
  standard: 'Estándar', express: 'Express', same_day: 'Mismo día', next_day: 'Día siguiente', scheduled: 'Programado',
}

function rowOf(s) {
  return {
    id: s.id,
    invoice: s.invoice_number || `REC-${String(s.id).padStart(6, '0')}`,
    shipment: s.tracking_number || `ENV-${s.id}`,
    issued: fmtDate(s.invoiced_at || s.created_at),
    amount: s.amount != null ? fmtMoney(s.amount) : '—',
    raw: s,
  }
}

function Table({ p, pagerLabels, rows, statusIdx, actionLabel, onAction }) {
  const pager = usePagination(rows, 10)

  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{
        padding: '18px 22px', borderBottom: '1px solid #DCE6F5',
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
      }}>{p.completed}</div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 700 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr 0.8fr 0.7fr',
            gap: 12, padding: '12px 22px', fontSize: 11, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#6C82A6',
          }}>
            {p.cols.map((c, i) => <span key={i}>{c}</span>)}
          </div>
          {pager.pageItems.length === 0 && (
            <div style={{ padding: '22px', borderTop: '1px solid #E3EBF7', fontSize: 13, color: '#6C82A6' }}>{p.empty}</div>
          )}
          {pager.pageItems.map((r) => (
            <div key={r.id} style={{
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
                background: 'rgba(19,122,69,.12)',
                color: '#0F5F36',
                justifySelf: 'start',
              }}>{p.statuses[1]}</span>
              <button onClick={() => onAction(r)} style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{actionLabel}</button>
            </div>
          ))}
        </div>
      </div>

      <Pagination pager={pager} labels={pagerLabels} />
    </div>
  )
}

function InvoiceModal({ p, shipment, onClose }) {
  const s = shipment
  const iv = p.inv
  const client = s.client || {}
  const packages = Array.isArray(s.packages) ? s.packages : []

  const Field = ({ label, children }) => (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#10233F', fontWeight: 500 }}>{children || '—'}</div>
    </div>
  )

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(4,17,38,.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 620,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(4,17,38,.35)',
      }}>
        <div style={{ padding: '26px 30px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', letterSpacing: '.02em' }}>TR3SLOG</div>
            <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 2 }}>Logistics &amp; Transport</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', color: '#001B45' }}>{iv.title}</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#087CF0' }}>{s.invoice_number || `REC-${String(s.id).padStart(6, '0')}`}</div>
            <span style={{
              display: 'inline-block', marginTop: 6, padding: '4px 12px', borderRadius: 100,
              fontSize: 11, fontWeight: 600,
              background: 'rgba(19,122,69,.12)',
              color: '#0F5F36',
            }}>{p.statuses[1]}</span>
          </div>
        </div>

        <div style={{ padding: '18px 30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, borderBottom: '1px solid #E3EBF7' }}>
          <Field label={iv.billTo}>{client.name || '—'}{client.email ? ` · ${client.email}` : ''}</Field>
          <Field label={iv.issued}>{fmtDate(s.invoiced_at || s.created_at)}</Field>
          <Field label={iv.guide}>{s.tracking_number}</Field>
          <Field label={iv.payMethod}>{METHOD_LABELS[s.payment_method] || s.payment_method || '—'}{s.payment_bank ? ` · ${s.payment_bank}` : ''}{s.payment_reference ? ` (${s.payment_reference})` : ''}</Field>
          <Field label={iv.route}>{s.origin} → {s.destination}</Field>
          <Field label={iv.mode}>{MODE_LABELS[s.delivery_mode] || s.service_type || s.delivery_mode || '—'}</Field>
        </div>

        <div style={{ padding: '18px 30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', paddingBottom: 8, borderBottom: '1px solid #DCE6F5' }}>
            <span>{iv.desc}</span><span style={{ textAlign: 'right' }}>{iv.amount}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10, padding: '12px 0', borderBottom: '1px solid #E3EBF7', fontSize: 13 }}>
            <span>{iv.service} — {MODE_LABELS[s.delivery_mode] || s.service_type || ''}</span>
            <span style={{ textAlign: 'right', fontWeight: 600 }}>{fmtMoney(s.amount)}</span>
          </div>
          {packages.map((pk, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10, padding: '10px 0', borderBottom: '1px solid #F0F5FB', fontSize: 12, color: '#4A5F80' }}>
              <span>{pk.content || pk.description || `Paquete ${i + 1}`}{pk.weight ? ` · ${pk.weight} ${pk.weight_unit || 'kg'}` : ''}{pk.pieces ? ` · ${pk.pieces} pza` : ''}</span>
              <span style={{ textAlign: 'right' }}>—</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10, padding: '14px 0 0', fontSize: 13 }}>
            <span style={{ textAlign: 'right', fontWeight: 600, color: '#6C82A6' }}>{iv.subtotal}</span>
            <span style={{ textAlign: 'right', fontWeight: 600 }}>{fmtMoney(s.amount)}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10, padding: '6px 0 4px' }}>
            <span style={{ textAlign: 'right', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, textTransform: 'uppercase' }}>{iv.total}</span>
            <span style={{ textAlign: 'right', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#087CF0' }}>{fmtMoney(s.amount)}</span>
          </div>
        </div>

        <div style={{ padding: '0 30px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#9AAEC9' }}>{s.tracking_number}</div>
          <button onClick={onClose} style={{
            padding: '11px 22px', background: '#087CF0', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>{iv.close}</button>
        </div>
      </div>
    </div>
  )
}

export default function Payments({ app, token, user }) {
  const p = app.payments
  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [view, setView] = React.useState(null)
  const [detail, setDetail] = React.useState(null)

  React.useEffect(() => {
    api.getShipments(token)
      .then((list) => setRows((Array.isArray(list) ? list : []).map(rowOf)))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [token])

  const openInvoice = (r) => {
    setView(r.raw)
    setDetail(null)
    api.getShipment(r.id, token)
      .then(setDetail)
      .catch(() => {})
  }

  const billTo = detail?.client || (user ? { name: user.name, email: user.email } : null)
  const invShipment = detail || view

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 800, fontSize: 30, letterSpacing: '-.02em',
        margin: '0 0 20px', color: '#001B45',
      }}>{p.title}</h1>

      {loading ? (
        <div style={{ padding: 30, textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>…</div>
      ) : (
        <Table p={p} pagerLabels={app.pager} rows={rows} statusIdx={1} actionLabel={p.view} onAction={openInvoice} />
      )}

      {view && invShipment && (
        <InvoiceModal
          p={p}
          shipment={{ ...view, ...invShipment, client: billTo }}
          onClose={() => { setView(null); setDetail(null) }}
        />
      )}
    </div>
  )
}
