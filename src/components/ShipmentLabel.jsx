import React from 'react'
import { Qr, Barcode, trackUrl } from './Manifest'

const fmtDT = (d) => {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return '—'
  return `${dt.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · ${dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`
}

export const shipmentTracking = (shipment) => shipment?.tracking_number || (shipment?.id ? `ENV-${shipment.id}` : '')

/* Abre la etiqueta en una ventana aparte y lanza el diálogo de impresión
   cuando el QR (imagen remota) terminó de cargar. */
export function printLabel(el, title) {
  if (!el) return false
  const w = window.open('', '_blank', 'width=720,height=900')
  if (!w) return false
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title || 'etiqueta'}</title>
<style>
  @page { size: auto; margin: 10mm; }
  body { margin: 0; padding: 16px; display: flex; justify-content: center; background: #fff; font-family: Arial, sans-serif; }
  @media print { body { padding: 0; } }
</style></head><body>${el.outerHTML}</body></html>`)
  w.document.close()
  const imgs = Array.from(w.document.images)
  let pending = imgs.filter((img) => !img.complete).length
  const go = () => { w.focus(); w.print() }
  if (!pending) setTimeout(go, 150)
  else imgs.forEach((img) => { img.onload = img.onerror = () => { if (--pending === 0) setTimeout(go, 150) } })
  return true
}

export const ShipmentLabel = React.forwardRef(function ShipmentLabel({ shipment, compact = false }, ref) {
  const sh = shipment || {}
  const md = sh.manifest_detail
  const mani = md?.manifest
  const trk = shipmentTracking(sh)
  const nPkgs = Math.max((sh.packages || []).length || 0, Number(sh.pieces) || 1)
  const express = /express|prioridad|same_day/i.test(`${sh.service_type || ''} ${sh.delivery_mode || ''}`)
  const fragile = (sh.packages || []).some((pk) => pk.fragile) || /fr[aá]gil/i.test(`${sh.notes || ''} ${(sh.packages || []).map((pk) => pk.content || '').join(' ')}`)
  const pk0 = (sh.packages || [])[0] || {}
  const weight = sh.weight || (pk0.weight ? `${pk0.weight} ${pk0.weight_unit || 'kg'}` : null)
  const dims = sh.dimensions || pk0.dimensions || null
  const label = { fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 6 }
  const mono = { fontFamily: 'ui-monospace, Menlo, monospace' }

  return (
    <div ref={ref} style={{ border: '1.5px solid #DCE6F5', borderRadius: 12, overflow: 'hidden', background: '#fff', fontSize: 12.5, width: compact ? '100%' : 560, maxWidth: '100%', color: '#10233F', fontFamily: 'Arial, sans-serif', textAlign: 'left' }}>
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
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{[sh.sender_company || 'TR3SLOG', sh.sender_name].filter(Boolean).join(' · ')}</div>
          <div style={{ fontSize: 11.5, color: '#6C82A6' }}>{[sh.sender_address, [sh.sender_city, sh.sender_country].filter(Boolean).join(', '), sh.sender_zip].filter(Boolean).join(' · ') || sh.origin || '—'}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={label}>Fecha</div>
          <div style={{ fontSize: 12.5 }}>{fmtDT(sh.created_at)}</div>
          <div style={{ ...label, marginTop: 8 }}>Referencia</div>
          <div style={{ fontSize: 12, ...mono, color: '#0768C9' }}>{sh.invoice_number || (sh.id ? `ORD-${String(sh.id).padStart(4, '0')}` : '—')}</div>
        </div>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #E3EBF7' }}>
        <div style={{ background: '#001B45', color: '#fff', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 9, letterSpacing: '.18em', fontWeight: 700, display: 'flex', alignItems: 'center', padding: '12px 7px' }}>DESTINATARIO</div>
        <div style={{ flex: 1, padding: '14px 18px' }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{[sh.recipient_company, sh.recipient_name].filter(Boolean).join(' · ') || sh.recipient_name || '—'}</div>
          <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.45 }}>{[sh.recipient_address, [sh.recipient_city, sh.recipient_country].filter(Boolean).join(', '), sh.recipient_zip].filter(Boolean).join(' · ') || sh.destination || '—'}</div>
          {sh.recipient_phone && <div style={{ fontSize: 12, marginTop: 5 }}>{sh.recipient_phone}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 16px', borderBottom: '1px solid #E3EBF7' }}>
        <div>
          <div style={label}>Hub · Ruta · Parada</div>
          <div style={{ ...mono, fontWeight: 800, fontSize: 15, color: '#001B45', marginTop: 3 }}>
            {mani ? [mani.codigo, md?.sequence != null ? `P${String(md.sequence).padStart(2, '0')}` : null].filter(Boolean).join(' · ') : 'SIN ASIGNAR'}
          </div>
        </div>
        <div style={{ border: '2px solid #087CF0', borderRadius: 6, padding: '5px 12px', fontSize: 14, fontWeight: 800, color: '#001B45', flexShrink: 0 }}>1 de {nPkgs}</div>
      </div>
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #E3EBF7' }}>
        <Barcode value={trk} height={52} />
        <div style={{ textAlign: 'center', ...mono, fontWeight: 800, fontSize: 14, color: '#001B45', letterSpacing: '.1em', marginTop: 6 }}>{trk}</div>
      </div>
      <div style={{ display: 'flex', gap: 16, padding: '12px 16px', alignItems: 'center', borderBottom: '1px solid #E3EBF7' }}>
        <Qr value={trackUrl(trk)} size={80} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', flex: 1 }}>
          <div><div style={label}>Peso</div><div style={{ fontSize: 13, fontWeight: 700 }}>{weight || '—'}</div></div>
          <div><div style={label}>Dimensiones</div><div style={{ fontSize: 13, fontWeight: 700 }}>{dims || '—'}</div></div>
          <div><div style={label}>Bultos</div><div style={{ fontSize: 13, fontWeight: 700 }}>{nPkgs}</div></div>
          <div><div style={label}>Pod</div><div style={{ fontSize: 13, fontWeight: 700 }}>QR + foto + GPS</div></div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '10px 16px', alignItems: 'center' }}>
        {express && <span style={{ fontSize: 10.5, fontWeight: 800, color: '#A93226' }}>PRIORITARIO</span>}
        {fragile && <span style={{ background: '#C0392B', color: '#fff', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>FRÁGIL</span>}
        <span style={{ background: '#D99A00', color: '#001B45', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>FIRMA REQUERIDA</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#8B9DBA' }}>Escanea el QR · tr3slog.com</span>
      </div>
    </div>
  )
})

/* Etiqueta con botón de impresión. */
export function PrintableLabel({ shipment, compact, buttonLabel = 'Imprimir etiqueta', onPopupBlocked }) {
  const ref = React.useRef(null)
  const trk = shipmentTracking(shipment)
  const print = () => {
    if (!printLabel(ref.current, `Etiqueta ${trk}`) && onPopupBlocked) onPopupBlocked()
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: compact ? 'stretch' : 'flex-start' }}>
      <ShipmentLabel ref={ref} shipment={shipment} compact={compact} />
      <button type="button" onClick={print}
        style={{ alignSelf: compact ? 'center' : 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 11, border: 'none', background: '#087CF0', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="9" rx="2" /><path d="M6 15h12v6H6z" /></svg>
        {buttonLabel}
      </button>
    </div>
  )
}

export default ShipmentLabel
