import React from 'react'
import { api } from '../api'
import { Pagination, usePagination, usePolling, SortControl, sortRows } from './Shared'
import { Qr, Barcode, trackUrl } from './Manifest'

const CITY_CODES = {
  'san juan': 'PRSJ', 'santo domingo': 'DOSD', 'punta cana': 'DOPC', 'miami': 'MIAM',
  'new york': 'NYNY', 'atlanta': 'ATLG', 'montego bay': 'JAMB', 'seoul': 'KRSE',
  'tokyo': 'JPTY', 'shanghai': 'CNSH', 'caracas': 'VECC', 'valencia': 'VEVL',
  'maracaibo': 'VEMA', 'montevideo': 'UYMV', 'punta del este': 'UYPE',
  'paysandú': 'UYPA', 'paysandu': 'UYPA', 'salto': 'UYSA', 'colonia': 'UYCO',
}

function getCityCode(city) {
  const value = String(city || '').toLowerCase().trim()
  return CITY_CODES[value] || value.substring(0, 4).toUpperCase()
}

const STATUS_TONE = [
  { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  { bg: '#EEF4FC', fg: '#10233F' },
  { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
]

const STATUS_KEY_MAP = {
  in_transit: 0, transit: 0, 'en tránsito': 0,
  out_for_delivery: 1,
  delivered: 2, entregado: 2, entregada: 2,
  cancelled: 4, cancelado: 4, cancel_requested: 4,
  pending: 3, assigned: 3, solicitud_recibida: 3,
  incident: 4, incidencia: 4,
}

const statusIndex = (status, statuses) => {
  const list = statuses || []
  if (typeof status === 'number') {
    if (status >= 0 && status < list.length) return status
    return 0
  }
  const normalized = String(status || '').toLowerCase()
  if (normalized in STATUS_KEY_MAP) return STATUS_KEY_MAP[normalized]
  const idx = list.findIndex((s) => s && s.toLowerCase() === normalized)
  return idx >= 0 ? idx : 0
}

function formatDate(date) {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const buildRow = (sh, statuses) => ({
  id: String(sh.tracking_number || sh.id || sh.guide || ''),
  route: `${getCityCode(sh.origin)} → ${getCityCode(sh.destination)}`,
  service: sh.service_type || sh.service || '',
  status: statusIndex(sh.status, statuses),
  eta: sh.eta || sh.estimated_delivery || formatDate(sh.created_at) || formatDate(sh.updated_at) || '—',
  parsed_tracking: sh.parsed_tracking || null,
  tracking_url: sh.tracking_url || null,
  raw: sh,
})

function DetailView({ app, shipment, token, onClose, onRefresh }) {
  const s = app.ship || {}
  const pt = shipment.parsed_tracking || {}
  const idx = statusIndex(shipment.status, s.statuses)
  const statusLabel = (s.statuses || [])[idx] || shipment.status
  const tone = STATUS_TONE[idx] || STATUS_TONE[0]

  const tracking = shipment.tracking_number || `#${shipment.id}`
  const route = `${shipment.origin || '—'} → ${shipment.destination || '—'}`
  const service = shipment.service_type || pt.package_type_name || '—'

  const created = shipment.created_at ? new Date(shipment.created_at) : null

  const TIMELINE = [
    { label: 'Solicitud recibida', loc: 'Portal del cliente' },
    { label: 'Mercancía recibida', loc: shipment.origin || '—' },
    { label: 'En procesamiento', loc: 'Centro de consolidación' },
    { label: 'En tránsito', loc: `En ruta a ${shipment.destination || '—'}` },
    { label: 'En ruta de entrega', loc: shipment.destination || '—' },
    { label: 'Entregada', loc: '—' },
    { label: 'Incidencia', loc: '—' },
  ]
  const STATUS_TO_TIMELINE = { 3: 0, 0: 3, 1: 4, 2: 5, 4: 6 }
  const currentIdx = STATUS_TO_TIMELINE[idx] ?? 0

  const fmt = (d) => {
    if (!d || isNaN(d.getTime())) return '—'
    return `${d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  }

  const updated = shipment.updated_at ? new Date(shipment.updated_at) : null
  const deliveredAt = shipment.delivered_at || shipment.manifest_detail?.horaVisita || shipment.manifest_detail?.hora_visita || null

  const stepDate = (i) => {
    if (i > currentIdx) return null
    if (i === 0) return created
    if (i === 5) return deliveredAt ? new Date(deliveredAt) : updated
    if (i === currentIdx || i < currentIdx) return updated
    return null
  }

  const fmtMoney = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const charges = Array.isArray(shipment.charges) && shipment.charges.length
    ? shipment.charges
    : (shipment.amount != null ? [{ label: 'Cargo de envío', amount: fmtMoney(shipment.amount) }] : [])
  const totalCharge = shipment.amount != null ? fmtMoney(shipment.amount) : (shipment.total || '—')
  const documents = shipment.documents || []
  const showProof = idx === 2 && shipment.delivery_proof

  const cardBase = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 24 }
  const sectionTitle = { fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 20, color: '#001B45' }
  const label = { fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 10 }
  const value = { fontSize: 14, lineHeight: 1.7, color: '#10233F' }

  const getAddress = (type) => {
    const obj = shipment[type] || {}
    const fallback = (k) => obj[k] || shipment[`${type}_${k}`] || ''
    const city = fallback('city') || (type === 'sender' ? shipment.origin : shipment.destination) || ''
    return {
      name: fallback('name'),
      company: fallback('company'),
      address: fallback('address'),
      city,
      country: fallback('country'),
      zip: fallback('zip'),
      phone: fallback('phone'),
      email: fallback('email'),
    }
  }

  const sender = getAddress('sender')
  const recipient = getAddress('recipient')

  const clientName = (shipment.client && shipment.client.name) || shipment.client_name
  const clientEmail = (shipment.client && shipment.client.email) || shipment.client_email
  const clientPhone = (shipment.client && shipment.client.phone) || shipment.client_phone

  const payment = {
    method: shipment.payment_method || (shipment.payment_method_id ? 'card' : ''),
    bank: shipment.payment_bank,
    reference: shipment.payment_reference,
    charge: shipment.charge_to_account,
  }
  const methodLabel = payment.method === 'card' ? 'Tarjeta' : payment.method === 'transfer' ? 'Transferencia' : payment.method === 'cash' ? 'Efectivo' : payment.method || '—'

  const AddressCard = ({ title, addr }) => (
    <div style={cardBase}>
      <div style={sectionTitle}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
        {addr.name && <div style={{ gridColumn: 'span 2' }}><div style={label}>Nombre</div><div style={value}>{addr.name}</div></div>}
        {addr.company && <div style={{ gridColumn: 'span 2' }}><div style={label}>Empresa</div><div style={value}>{addr.company}</div></div>}
        {addr.address && <div style={{ gridColumn: 'span 2' }}><div style={label}>Dirección</div><div style={value}>{addr.address}</div></div>}
        {addr.city && <div><div style={label}>Ciudad</div><div style={value}>{addr.city}</div></div>}
        {addr.country && <div><div style={label}>País</div><div style={value}>{addr.country}</div></div>}
        {addr.zip && <div><div style={label}>ZIP</div><div style={value}>{addr.zip}</div></div>}
        {addr.phone && <div><div style={label}>Teléfono</div><div style={value}>{addr.phone}</div></div>}
        {addr.email && <div style={{ gridColumn: 'span 2' }}><div style={label}>Correo</div><div style={value}>{addr.email}</div></div>}
      </div>
    </div>
  )

  return (
    <div style={{ width: '100%' }}>
      <button onClick={onClose} style={{ background: 'none', border: 'none', padding: 0, marginBottom: 14, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>← Volver a mis envíos</button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: 0, color: '#001B45' }}>{tracking}</h1>
        <span style={{ display: 'inline-flex', padding: '8px 15px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: tone.bg, color: tone.fg }}>{statusLabel}</span>
        <span style={{ fontSize: 14, color: '#10233F' }}>{route} · {service}</span>
        {!['delivered', 'entregado', 'entregada', 'cancelled', 'cancelado', 'cancel_requested'].includes(shipment.status) && (
          <button
            onClick={async () => {
              if (!window.confirm('¿Cancelar este envío?')) return
              try {
                await api.cancelShipment(shipment.id, token)
                if (onRefresh) onRefresh()
                onClose()
              } catch (e) {
                alert(e.message || 'No se pudo cancelar el envío')
              }
            }}
            style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: 'rgba(192,57,43,.1)', color: '#A93226', border: 'none', cursor: 'pointer' }}
          >Cancelar envío</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr .65fr', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardBase}>
            <div style={sectionTitle}>Línea de tiempo completa</div>
            {TIMELINE.map((step, i) => {
              const completed = i < currentIdx
              const current = i === currentIdx
              const dotBg = current ? '#D99A00' : (completed ? '#087CF0' : '#fff')
              const dotBorder = current || completed ? '3px solid rgba(8,124,240,.18)' : '3px solid #DCE6F5'
              const titleColor = i > currentIdx ? '#8B9DBA' : '#001B45'
              const date = stepDate(i)
              return (
                <div key={step.label} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: dotBg, border: dotBorder, flex: '0 0 auto' }}></span>
                    <span style={{ flex: '1 1 0%', width: 2, background: i < currentIdx ? '#087CF0' : '#DCE6F5', minHeight: 30 }}></span>
                  </div>
                  <div style={{ paddingBottom: 16 }}>
                    <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 600, fontSize: 14, color: titleColor }}>{step.label}</div>
                    <div style={{ fontSize: 12, color: '#6C82A6', marginTop: 3 }}>{date ? fmt(date) : 'Pendiente'} · {step.loc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <AddressCard title="Remitente" addr={sender} />
            <AddressCard title="Destinatario" addr={recipient} />
          </div>

          {(clientName || clientEmail || clientPhone) && (
            <div style={cardBase}>
              <div style={sectionTitle}>Cliente</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {clientName && <div><div style={label}>Nombre</div><div style={value}>{clientName}</div></div>}
                {clientEmail && <div><div style={label}>Correo</div><div style={value}>{clientEmail}</div></div>}
                {clientPhone && <div><div style={label}>Teléfono</div><div style={value}>{clientPhone}</div></div>}
              </div>
            </div>
          )}

          {(payment.method || payment.charge) && (
            <div style={cardBase}>
              <div style={sectionTitle}>Pago</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {payment.method && <div><div style={label}>Método</div><div style={value}>{methodLabel}</div></div>}
                {payment.bank && <div><div style={label}>Banco</div><div style={value}>{payment.bank}</div></div>}
                {payment.reference && <div style={{ gridColumn: payment.bank ? 'span 1' : 'span 2' }}><div style={label}>Referencia</div><div style={value}>{payment.reference}</div></div>}
                {payment.charge && <div><div style={label}>Cargar a cuenta</div><div style={value}>{payment.charge}</div></div>}
              </div>
            </div>
          )}

          {(shipment.packages || [shipment]).map((pkg, i) => (
            <div key={i} style={cardBase}>
              <div style={sectionTitle}>
                {shipment.packages ? `Paquete ${i + 1}` : 'Detalles del paquete'}
                {pkg.fragile && (
                  <span style={{ marginLeft: 8, background: '#C0392B', color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 10.5, fontWeight: 800, verticalAlign: 'middle' }}>FRÁGIL</span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={label}>Piezas</div>
                  <div style={value}>{pkg.pieces || '—'}</div>
                </div>
                <div>
                  <div style={label}>Peso</div>
                  <div style={value}>{pkg.weight ? `${pkg.weight} ${pkg.weight_unit || ''}`.trim() : '—'}</div>
                </div>
                <div>
                  <div style={label}>Dimensiones</div>
                  <div style={value}>{pkg.dimensions || '—'}</div>
                </div>
                <div>
                  <div style={label}>Valor declarado</div>
                  <div style={value}>{pkg.declared_value ? `$${pkg.declared_value}` : '—'}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={label}>Contenido</div>
                  <div style={value}>{pkg.content || '—'}</div>
                </div>
                {shipment.notes && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={label}>Notas</div>
                    <div style={value}>{shipment.notes}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {shipment.driver && (
            <div style={cardBase}>
              <div style={sectionTitle}>Conductor asignado</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {shipment.driver.name && <div><div style={label}>Nombre</div><div style={value}>{shipment.driver.name}</div></div>}
                {shipment.driver.phone && <div><div style={label}>Teléfono</div><div style={value}>{shipment.driver.phone}</div></div>}
                {shipment.driver.email && <div><div style={label}>Correo</div><div style={value}>{shipment.driver.email}</div></div>}
                {shipment.driver.driver_profile?.vehicle && <div><div style={label}>Vehículo</div><div style={value}>{typeof shipment.driver.driver_profile.vehicle === 'object' ? [shipment.driver.driver_profile.vehicle.brand, shipment.driver.driver_profile.vehicle.model, shipment.driver.driver_profile.vehicle.plate].filter(Boolean).join(' · ') : shipment.driver.driver_profile.vehicle}</div></div>}
                {shipment.assigned_at && <div><div style={label}>Asignado</div><div style={value}>{fmt(new Date(shipment.assigned_at))}</div></div>}
              </div>
            </div>
          )}

          {(() => {
            const md = shipment.manifest_detail
            const mani = md?.manifest
            const trk = shipment.tracking_number || `ENV-${shipment.id}`
            const nPkgs = Math.max((shipment.packages || []).length || 0, Number(shipment.pieces) || 1)
            const pkgCode = trk.replace(/^TR3S?-/, 'PKG-')
            const express = /express|prioridad/i.test(`${shipment.service_type || ''} ${shipment.delivery_mode || ''}`)
            const L = ({ k, v }) => v ? (
              <div><div style={label}>{k}</div><div style={{ ...value, fontSize: 12.5 }}>{v}</div></div>
            ) : null
            return (
              <div style={cardBase}>
                <div style={sectionTitle}>Etiqueta</div>
                <div style={{ border: '1.5px solid #DCE6F5', borderRadius: 12, overflow: 'hidden', background: '#fff', fontSize: 12.5, maxWidth: 560 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #E3EBF7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span aria-hidden="true" style={{ display: 'inline-flex', gap: 3 }}>
                        <span style={{ width: 16, height: 4, background: '#D99A00', transform: 'skewX(-24deg)', display: 'block' }} />
                        <span style={{ width: 7, height: 4, background: '#087CF0', transform: 'skewX(-24deg)', display: 'block' }} />
                      </span>
                      <span style={{ fontWeight: 800, letterSpacing: '.1em', color: '#001B45', fontSize: 15 }}>TR3SLOG</span>
                    </div>
                    <div style={{ background: '#001B45', color: '#fff', padding: '8px 14px', borderRadius: 4, fontWeight: 800, fontSize: 13, letterSpacing: '.04em', textAlign: 'center' }}>
                      {express ? 'EXPRESS' : 'ÚLTIMA MILLA'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderBottom: '1px solid #E3EBF7' }}>
                    <div>
                      <div style={label}>Remitente</div>
                      <div style={{ fontSize: 12.5, color: '#10233F', fontWeight: 600 }}>{[shipment.sender_company || 'TR3SLOG', shipment.sender_name].filter(Boolean).join(' · ')}</div>
                      <div style={{ fontSize: 11.5, color: '#6C82A6' }}>{[shipment.sender_address, [shipment.sender_city, shipment.sender_country].filter(Boolean).join(', '), shipment.sender_zip].filter(Boolean).join(' · ') || shipment.origin || '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={label}>Fecha</div>
                      <div style={{ fontSize: 12.5, color: '#10233F' }}>{shipment.created_at ? fmt(new Date(shipment.created_at)) : '—'}</div>
                      <div style={{ ...label, marginTop: 8 }}>Referencia</div>
                      <div style={{ fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', color: '#0768C9' }}>{shipment.invoice_number || `ORD-${String(shipment.id).padStart(4, '0')}`}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #E3EBF7' }}>
                    <div style={{ background: '#001B45', color: '#fff', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 9, letterSpacing: '.18em', fontWeight: 700, display: 'flex', alignItems: 'center', padding: '12px 7px' }}>DESTINATARIO</div>
                    <div style={{ flex: 1, padding: '14px 18px' }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: '#10233F' }}>{[shipment.recipient_company, shipment.recipient_name].filter(Boolean).join(' · ') || shipment.recipient_name || '—'}</div>
                      <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.45, color: '#10233F' }}>{[shipment.recipient_address, [shipment.recipient_city, shipment.recipient_country].filter(Boolean).join(', '), shipment.recipient_zip].filter(Boolean).join(' · ') || shipment.destination || '—'}</div>
                      {shipment.recipient_phone && <div style={{ fontSize: 12, marginTop: 5, color: '#10233F' }}>{shipment.recipient_phone}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 16px', borderBottom: '1px solid #E3EBF7' }}>
                    <div>
                      <div style={label}>Hub · Ruta · Parada</div>
                      <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, fontSize: 15, color: '#001B45', marginTop: 3 }}>
                        {mani ? [mani.codigo, md?.sequence != null ? `P${String(md.sequence).padStart(2, '0')}` : null].filter(Boolean).join(' · ') : 'SIN ASIGNAR'}
                      </div>
                    </div>
                    <div style={{ border: '2px solid #087CF0', borderRadius: 6, padding: '5px 12px', fontSize: 14, fontWeight: 800, color: '#001B45', flexShrink: 0 }}>1 de {nPkgs}</div>
                  </div>
                  <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #E3EBF7' }}>
                    <Barcode value={trk} height={52} />
                    <div style={{ textAlign: 'center', fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, fontSize: 14, color: '#001B45', letterSpacing: '.1em', marginTop: 6 }}>{trk}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, padding: '12px 16px', alignItems: 'center', borderBottom: '1px solid #E3EBF7' }}>
                    <Qr value={trackUrl(trk)} size={80} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', flex: 1 }}>
                      <div><div style={label}>Peso</div><div style={{ fontSize: 13, fontWeight: 700, color: '#10233F' }}>{shipment.weight || '—'}</div></div>
                      <div><div style={label}>Dimensiones</div><div style={{ fontSize: 13, fontWeight: 700, color: '#10233F' }}>{shipment.dimensions || '—'}</div></div>
                      <div><div style={label}>Bultos</div><div style={{ fontSize: 13, fontWeight: 700, color: '#10233F' }}>{nPkgs}</div></div>
                      <div><div style={label}>Pod</div><div style={{ fontSize: 13, fontWeight: 700, color: '#10233F' }}>QR + foto + GPS</div></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, padding: '10px 16px', alignItems: 'center' }}>
                    {express && <span style={{ fontSize: 10.5, fontWeight: 800, color: '#A93226', alignSelf: 'center' }}>PRIORITARIO</span>}
                    {((shipment.packages || []).some(pk => pk.fragile) || /fr[aá]gil/i.test(`${shipment.notes || ''} ${(shipment.packages || []).map(pk => pk.content || '').join(' ')}`)) && (
                      <span style={{ background: '#C0392B', color: '#fff', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>FRÁGIL</span>
                    )}
                    <span style={{ background: '#D99A00', color: '#001B45', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>FIRMA REQUERIDA</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: '#8B9DBA' }}>Escanea el QR · tr3slog.com</span>
                  </div>
                </div>
              </div>
            )
          })()}

          <div style={cardBase}>
            <div style={sectionTitle}>Cargos</div>
            {charges.length ? charges.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', color: '#10233F' }}>
                <span>{c.label}</span><span style={{ fontWeight: 600, color: '#001B45' }}>{c.amount}</span>
              </div>
            )) : <div style={{ fontSize: 14, color: '#6C82A6', padding: '8px 0' }}>Cargos aún no disponibles.</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 14, borderTop: '1px solid #DCE6F5' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18 }}>{totalCharge}</span>
            </div>
          </div>

          <div style={cardBase}>
            <div style={sectionTitle}>Documentos</div>
            {documents.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {documents.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', border: '1px solid #DCE6F5', borderRadius: 11 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#087CF0" strokeWidth="1.7"><path d="M6 3h8l4 4v14H6zM14 3v4h4"></path></svg>
                    <span style={{ flex: '1 1 0%', fontSize: 13, fontWeight: 600 }}>{doc.name}</span>
                    {doc.url ? (
                      <button onClick={() => window.open(doc.url, '_blank')} style={{ border: 'none', background: 'none', padding: '6px 2px', cursor: 'pointer', font: 'inherit', color: '#087CF0' }}>Descargar</button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#6C82A6' }}>Pendiente</span>
                    )}
                  </div>
                ))}
              </div>
            ) : <div style={{ fontSize: 14, color: '#6C82A6', padding: '8px 0' }}>Documentos aún no disponibles.</div>}
          </div>

          {showProof && (
            <div style={cardBase}>
              <div style={sectionTitle}>Evidencia de entrega</div>
              <div style={{ height: 180, borderRadius: 12, overflow: 'hidden', background: '#EEF4FC' }}>
                {shipment.delivery_proof ? (
                  <img src={shipment.delivery_proof} alt="Fotografía de entrega" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B9DBA', fontSize: 13 }}>Fotografía de entrega</div>
                )}
              </div>
              <button style={{ width: '100%', marginTop: 14, padding: 14, background: '#087CF0', border: 'none', borderRadius: 11, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ver expediente completo →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShipmentsList({ app, token, query: externalQuery, onQueryChange, selectId }) {
  const s = app.ship
  const isControlled = typeof externalQuery !== 'undefined'
  const [internalQuery, setInternalQuery] = React.useState('')
  const query = isControlled ? externalQuery : internalQuery
  const setQuery = isControlled ? onQueryChange : setInternalQuery
  const [filter, setFilter] = React.useState(0)
  const [sortMode, setSortMode] = React.useState('recent')
  const [shipments, setShipments] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [selected, setSelected] = React.useState(null)

  React.useEffect(() => {
    if (!selectId || !token) return
    api.getShipment(selectId, token).then(setSelected).catch(() => {})
  }, [selectId])

  const load = React.useCallback(async (isPoll) => {
    if (!token) {
      setLoading(false)
      setError('Inicie sesión para ver sus envíos.')
      return
    }
    if (!isPoll) setLoading(true)
    try {
      const data = await api.getShipments(token)
      const list = Array.isArray(data) ? data : (data?.data || [])
      setShipments(list.map((sh) => buildRow(sh, s.statuses)))
      setError('')
    } catch (err) {
      if (!isPoll) setError(err.message)
    } finally {
      if (!isPoll) setLoading(false)
    }
  }, [token, s.statuses])

  usePolling(load, 30000)

  const filtered = shipments.filter((r) => {
    const matchesFilter = filter === 0 || r.status === filter - 1
    const q = (query || '').toLowerCase()
    const statusText = s.statuses[r.status] || ''
    const matchesQuery = !q || r.id.toLowerCase().includes(q) || r.route.toLowerCase().includes(q) || statusText.toLowerCase().includes(q)
    return matchesFilter && matchesQuery
  })

  const sorted = sortRows(filtered, sortMode, {
    date: (r) => r.raw?.created_at || r.raw?.updated_at,
    text: (r) => r.id,
  })

  const pager = usePagination(sorted, 10, `${filter}|${query}|${sortMode}`)

  if (selected) {
    return <DetailView app={app} shipment={selected} token={token} onClose={() => setSelected(null)} onRefresh={() => load()} />
  }

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
              value={query || ''}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filtered.length) {
                  const exact = filtered.find((r) => r.id.toLowerCase() === (query || '').toLowerCase())
                  setSelected((exact || filtered[0]).raw)
                  setQuery('')
                }
              }}
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
          <SortControl value={sortMode} onChange={setSortMode} labels={app.sort} />
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
            {loading && (
              <div style={{ padding: 30, textAlign: 'center', color: '#6C82A6' }}>Cargando envíos…</div>
            )}
            {error && (
              <div style={{ padding: 30, textAlign: 'center', color: '#A93226' }}>{error}</div>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: '#6C82A6' }}>No hay envíos para mostrar.</div>
            )}
            {!loading && pager.pageItems.map((r, i) => (
              <div key={r.id || i} style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr 1fr 0.7fr 0.5fr',
                gap: 12, padding: '16px 22px', borderTop: '1px solid #E3EBF7', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{r.id}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.route}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.service}</span>
                <span style={{
                  display: 'inline-flex', padding: '5px 11px', borderRadius: 100,
                  fontSize: 11, fontWeight: 600,
                  background: (STATUS_TONE[r.status] || STATUS_TONE[0]).bg,
                  color: (STATUS_TONE[r.status] || STATUS_TONE[0]).fg,
                  justifySelf: 'start',
                }}>{s.statuses[r.status] || '—'}</span>
                <span style={{ fontSize: 13, color: '#10233F' }}>{r.eta}</span>
                <button onClick={() => setSelected(r.raw)} style={{ justifySelf: 'end', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#087CF0' }}>{s.view}</button>
              </div>
            ))}
          </div>
        </div>

        {!loading && !error && <Pagination pager={pager} labels={app.pager} />}
      </div>
    </div>
  )
}
