import React from 'react'
import { api } from '../api'
import { COUNTRY_NAMES, PHONE_FORMATS } from '../lib/countries'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { DeliveryIcon } from './PricingCalc'

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  || 'pk_test_51U9oCHLy571aG6WWmqNdtAiM9E7ZVDjTeB2Qs62VvLjOhv0Y253OGaFztaJseVBUhhkiZ3Q3CxaY8Fy9S2VHOg8L00mmeKsQQK'

const ADDRESS_KEYS = ['name', 'company', 'address', 'country', 'phone', 'email']
const ADDRESS_REQUIRED = ['name', 'address', 'city', 'country', 'zip', 'phone', 'email']
const ADDRESS_SPAN2 = ['address', 'country', 'phone', 'email']

const COUNTRY_LABELS = { DO: 'República Dominicana', CR: 'Costa Rica' }

const CITIES = [
  'San Juan', 'Santo Domingo', 'Punta Cana', 'Miami', 'New York', 'Atlanta',
  'Montego Bay', 'Seoul', 'Tokyo', 'Shanghai', 'Caracas', 'Valencia',
  'Maracaibo', 'Montevideo', 'Punta del Este', 'Paysandú', 'Salto', 'Colonia',
]


const CITY_COUNTRY = {
  'San Juan': 'PR',
  'Santo Domingo': 'DO',
  'Punta Cana': 'DO',
  'Miami': 'US',
  'New York': 'US',
  'Atlanta': 'US',
  'Montego Bay': 'JM',
  'Seoul': 'KR',
  'Tokyo': 'JP',
  'Shanghai': 'CN',
  'Caracas': 'VE',
  'Valencia': 'VE',
  'Maracaibo': 'VE',
  'Montevideo': 'UY',
  'Punta del Este': 'UY',
  'Paysandú': 'UY',
  'Salto': 'UY',
  'Colonia': 'UY',
}


const emptyAddress = () => ({
  addressId: '', name: '', company: '', address: '', city: '', country: '', zip: '', phone: '', phoneCountry: '', email: '',
})

const emptyPackage = () => ({
  type: 'package', length: '', width: '', height: '', weight: '', weightUnit: 'kg',
  pieces: '1', declaredValue: '', content: '',
})

const migratePackage = (pkg = {}) => {
  const merged = { ...emptyPackage(), ...pkg }
  if (!merged.length && pkg.dimensions) {
    const m = String(pkg.dimensions).match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i)
    if (m) {
      merged.length = m[1]
      merged.width = m[2]
      merged.height = m[3]
    }
  }
  merged.weightUnit = 'kg'
  return merged
}

const emptyService = () => ({
  service: 'Terrestre', delivery: 'standard', pickupDate: '', timeWindow: '', notes: '',
})

const emptyPayment = () => ({
  method: '', paymentMethod: '', chargeToAccount: '', cardholderName: '', billingZip: '', bank: '', reference: '',
})

const DRAFT_KEY = 'tr3slog-shipment-draft'

const getInitials = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] || ''
  const second = words[1]?.[0] || words[0]?.[1] || ''
  return (first + second).toUpperCase()
}

const PKG_TYPES = ['package', 'box', 'envelope', 'pallet', 'other']

/* Dimension fields per package type: envelopes are flat (no height). */
const PKG_DIMS = {
  package: ['length', 'width', 'height'],
  box: ['length', 'width', 'height'],
  envelope: ['length', 'width'],
  pallet: ['length', 'width', 'height'],
  other: ['length', 'width', 'height'],
}
const pkgDims = (type) => PKG_DIMS[type] || PKG_DIMS.package
const pkgRequired = (pkg) => [...pkgDims(pkg.type), 'weight']

function PkgIcon({ name, size = 22 }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  switch (name) {
    case 'package':
      return <svg {...p}><path d="M12 2.6l8.5 4.8v9.2L12 21.4l-8.5-4.8V7.4L12 2.6z"/><path d="M3.6 7.4L12 12.1l8.4-4.7"/><path d="M12 12.1v9.2"/></svg>
    case 'box':
      return <svg {...p}><path d="M4 9h16v11H4V9z"/><path d="M4 9l2.6-4.5h10.8L20 9"/><path d="M10 9v4h4V9"/></svg>
    case 'envelope':
      return <svg {...p}><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>
    case 'pallet':
      return <svg {...p}><rect x="3" y="6.5" width="18" height="5" rx="1"/><path d="M4.5 11.5V18"/><path d="M12 11.5V18"/><path d="M19.5 11.5V18"/><path d="M3 18.5h18"/></svg>
    case 'ruler':
      return <svg {...p}><rect x="2.5" y="9" width="19" height="7" rx="1.5"/><path d="M7 9v3"/><path d="M11 9v4"/><path d="M15 9v3"/><path d="M18.5 9v4"/></svg>
    case 'weight':
      return <svg {...p}><circle cx="12" cy="5" r="2.2"/><path d="M12 7.2V9"/><path d="M5.2 21L6.8 9h10.4L18.8 21H5.2z"/></svg>
    case 'volume':
      return <svg {...p}><path d="M12 3l7.5 4.3v8.4L12 20l-7.5-4.3V7.3L12 3z"/><path d="M4.6 7.3L12 11.5l7.4-4.2"/><path d="M12 11.5V20"/></svg>
    default:
      return <svg {...p}><circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>
  }
}

const fmtNum = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 4 })

function PackagePanel({ icon, title, subtitle, children }) {
  return (
    <div style={{ background: '#F4F9FF', border: '1px solid #E2EDFB', borderRadius: 16, padding: '18px 20px 20px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ color: '#087CF0', display: 'flex', marginTop: 2 }}>{icon}</span>
        <div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#001B45' }}>{title}</div>
          <div style={{ fontSize: 13, color: '#6C82A6', marginTop: 3 }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

function PackageList({ c, packages, onPackageChange, onAddPackage, onRemovePackage }) {
  const p = c.package || {}
  const types = p.types || {}
  const num = (v) => v.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1')
  const input = { width: '100%', padding: '13px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#fff', font: 'inherit', fontSize: 15, color: '#001B45', outline: 'none' }
  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#10233F' }
  const unitTag = { marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#8B9DBA' }

  const summary = (pkg) => {
    const keys = pkgDims(pkg.type)
    const dims = keys.map((k) => parseFloat(pkg[k]))
    const ok = dims.every((n) => Number.isFinite(n) && n > 0)
    const vol = ok && keys.length === 3 ? dims[0] * dims[1] * dims[2] : 0
    return {
      dims: ok ? `${dims.map(fmtNum).join(' × ')} cm` : '—',
      dimsSub: ok ? (keys.length === 3 ? (p.dimsCaption || '') : (p.dimsCaptionLw || '')) : '',
      vol: vol ? `${fmtNum(vol)} cm³` : '—',
      volSub: vol ? `(${fmtNum(vol / 1e6)} m³)` : '',
      weight: Number(pkg.weight) > 0 ? `${fmtNum(Number(pkg.weight))} ${pkg.weightUnit || 'kg'}` : '—',
    }
  }

  const dimField = (pkg, i, key, label) => (
    <div key={key}>
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={fieldLabel}>{label}</span>
        <span style={unitTag}>cm</span>
      </div>
      <input
        inputMode="decimal"
        value={pkg[key]}
        onChange={(e) => onPackageChange(i, key, num(e.target.value))}
        placeholder="0"
        style={input}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ color: '#001B45', display: 'flex', marginTop: 2 }}><PkgIcon name="package" size={26} /></span>
        <div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#001B45' }}>{p.title || 'Datos del paquete'}</div>
          <div style={{ fontSize: 13, color: '#6C82A6', marginTop: 3 }}>{p.subtitle || ''}</div>
        </div>
      </div>
      {packages.map((pkg, i) => {
        const s = summary(pkg)
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: i ? 22 : 0, borderTop: i ? '1px solid #E2EDFB' : 'none' }}>
            {packages.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#001B45' }}>{(p.packageN || 'Paquete {n}').replace('{n}', i + 1)}</span>
                <button
                  type="button"
                  onClick={() => onRemovePackage(i)}
                  style={{ width: 28, height: 28, border: '1.5px solid #C0392B', borderRadius: 8, background: '#fff', color: '#C0392B', fontSize: 18, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  −
                </button>
              </div>
            )}
            <div>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 10 }}>{p.typeLabel || 'Tipo de paquete'}</span>
              <div className='pkg-type-grid'>
                {PKG_TYPES.map((t) => {
                  const active = (pkg.type || 'package') === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onPackageChange(i, 'type', t)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                        border: `1.5px solid ${active ? '#087CF0' : '#DCE6F5'}`, borderRadius: 13,
                        background: active ? 'rgba(8,124,240,.07)' : '#fff',
                        cursor: 'pointer', font: 'inherit', textAlign: 'left',
                      }}
                    >
                      <span style={{ color: active ? '#0768C9' : '#10233F', display: 'flex', flex: '0 0 auto' }}><PkgIcon name={t} /></span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#001B45' }}>{types[t] || t}</span>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${active ? '#087CF0' : '#C4D4EA'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', flex: '0 0 auto' }}>
                        {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#087CF0' }} />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            <PackagePanel icon={<PkgIcon name="ruler" />} title={p.dimsTitle || 'Dimensiones del paquete'} subtitle={p.dimsSubtitle || ''}>
              <div className='pkg-dims-grid' style={{ display: 'grid', gridTemplateColumns: `repeat(${pkgDims(pkg.type).length}, 1fr)`, gap: 16 }}>
                {pkgDims(pkg.type).map((k) => dimField(pkg, i, k, p[k]))}
              </div>
              {(p.measureHints || {})[pkg.type || 'package'] && (
                <p style={{ margin: '12px 0 0', fontSize: 12, lineHeight: 1.6, color: '#6C82A6' }}>
                  {(p.measureHints || {})[pkg.type || 'package']}
                </p>
              )}
              {(pkg.type === 'other') && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={fieldLabel}>{p.otherDesc || 'Descripción de la pieza'}</span>
                  </div>
                  <input
                    value={pkg.content}
                    onChange={(e) => onPackageChange(i, 'content', e.target.value)}
                    placeholder={p.otherDescPh || ''}
                    style={input}
                  />
                </div>
              )}
            </PackagePanel>
            <PackagePanel icon={<PkgIcon name="weight" />} title={p.weightTitle || 'Peso del paquete'} subtitle={p.weightSubtitle || ''}>
              <div className='pkg-weight-grid'>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={fieldLabel}>{(p.fields && p.fields.weight) || 'Peso'}</span>
                    <span style={unitTag}>{pkg.weightUnit || 'kg'}</span>
                  </div>
                  <input
                    inputMode="decimal"
                    value={pkg.weight}
                    onChange={(e) => onPackageChange(i, 'weight', num(e.target.value))}
                    placeholder="0"
                    style={input}
                  />
                </div>
              </div>
            </PackagePanel>
            <div className='pkg-summary'>
              {[
                { icon: 'package', label: (p.summary && p.summary.dimensions) || 'Dimensiones', value: s.dims, sub: s.dimsSub },
                { icon: 'volume', label: (p.summary && p.summary.volume) || 'Volumen', value: s.vol, sub: s.volSub },
                { icon: 'weight', label: (p.summary && p.summary.weight) || 'Peso', value: s.weight, sub: '' },
              ].map((col, ci) => (
                <div key={ci} className='pkg-summary-item'>
                  <span style={{ color: '#087CF0', display: 'flex', flex: '0 0 auto' }}><PkgIcon name={col.icon} size={24} /></span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#6C82A6' }}>{col.label}</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 700, color: '#001B45' }}>{col.value}</div>
                    {col.sub ? <div style={{ fontSize: 12, color: '#8B9DBA' }}>{col.sub}</div> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <button
        type="button"
        onClick={onAddPackage}
        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1.5px solid #087CF0', borderRadius: 11, background: 'rgba(8,124,240,.08)', color: '#0768C9', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
      >
        <span style={{ fontSize: 18 }}>+</span> {p.addPackage || 'Agregar paquete'}
      </button>
    </div>
  )
}

function ShipmentForm({ c, step, section, config, data, savedAddresses, surcharges, onSelectAddress, submitted, error, submitting, result, onChange, onPackageChange, onAddPackage, onRemovePackage, isAfterHours, afterHoursMsg, onBack, onNext, onFinish }) {
  const isLastStep = step === c.steps.length - 1
  const isComplete = section
    ? (section === 'package'
      ? data[section].every((pkg) => pkgRequired(pkg).every((k) => String(pkg[k] || '').trim() !== ''))
      : config.required.every((k) => String(data[section][k] || '').trim() !== ''))
    : true
  const isServiceAvailable = section !== 'service' || data.service.service === 'Terrestre'
  const canContinue = isComplete && isServiceAvailable
  const today = new Date()
  const minBase = isAfterHours ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) : today
  const minDate = `${minBase.getFullYear()}-${String(minBase.getMonth() + 1).padStart(2, '0')}-${String(minBase.getDate()).padStart(2, '0')}`

  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 26 }}>
      {isAfterHours && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: '#FEF3C7', color: '#92400E', fontSize: 14, lineHeight: 1.6 }}>
          {afterHoursMsg}
        </div>
      )}

      {section === 'package' && (
        <PackageList
          c={c}
          packages={data.package}
          onPackageChange={onPackageChange}
          onAddPackage={onAddPackage}
          onRemovePackage={onRemovePackage}
        />
      )}
      {section === 'service' && (
        <div style={{ marginBottom: 20 }}>
          <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 10 }}>{c.deliveryT}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
            {['standard', 'express', 'same_day'].map((m) => {
              const s = (surcharges || {})[m] || {}
              const active = (data.service.delivery || 'standard') === m
              const val = parseFloat(s.value) || 0
              const badge = s.type === 'fixed' ? `+$${val}` : `+${val}%`
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange('delivery', m)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    border: `1.5px solid ${active ? '#087CF0' : '#DCE6F5'}`, borderRadius: 13,
                    background: active ? 'rgba(8,124,240,.07)' : '#fff',
                    cursor: 'pointer', font: 'inherit', textAlign: 'left',
                  }}
                >
                  <span style={{ color: active ? '#0768C9' : '#6C82A6', display: 'flex', flex: '0 0 auto' }}>
                    <DeliveryIcon mode={m} color="currentColor" size={24} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#001B45' }}>{c.delivery[m]}</span>
                    <span style={{ display: 'block', fontSize: 12, color: '#8B9DBA', marginTop: 2 }}>{(c.deliverySub || {})[m] || ''}</span>
                  </span>
                  {val > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
                      background: active ? '#087CF0' : '#EEF4FC', color: active ? '#fff' : '#6C82A6', flex: '0 0 auto',
                    }}>{badge}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {config.keys.map((key) => (
          <React.Fragment key={key}>
            <label style={{ gridColumn: (config.span2.includes(key) || key === 'method') ? 'span 2' : 'span 1', display: 'block' }}>
            <span style={{
              display: 'flex', gap: 8, alignItems: 'baseline',
              fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
              textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8,
            }}>
              {config.fields[key]}
              <span style={{ fontSize: 10, letterSpacing: '.06em', color: '#8B9DBA' }}>
                {config.required.includes(key) ? c.required : c.optional}
              </span>
            </span>
            {key === 'phone' && config.countryOptions ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
                <select
                  value={section ? (data[section].phoneCountry || data[section].country || '') : ''}
                  onChange={(e) => onChange('phoneCountry', e.target.value)}
                  style={{
                    flex: '0 0 130px', padding: '14px 15px',
                    border: '1.5px solid #DCE6F5', borderRadius: 11,
                    background: '#EEF4FC', font: 'inherit', color: '#001B45',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">Código</option>
                  {config.countryOptions.map((o) => (
                    <option key={o.code} value={o.code}>{o.flag} {o.short}</option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="tel"
                  placeholder={config.phoneExample}
                  value={section ? data[section].phone : ''}
                  onChange={(e) => onChange('phone', e.target.value)}
                  style={{
                    flex: 1, padding: '14px 15px',
                    border: '1.5px solid #DCE6F5', borderRadius: 11,
                    background: '#EEF4FC', font: 'inherit', color: '#001B45',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: 12, color: '#8B9DBA', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                  Ej: {config.phoneExample}
                </span>
              </div>
            ) : key === 'method' && config.options && config.options.method ? (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {config.options.method.map((opt) => {
                  const value = opt.value
                  const label = opt.label
                  const active = (section ? data[section][key] : '') === value
                  const icon =
                    value === 'card' ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    ) : value === 'transfer' ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4M7 4L3 8M7 4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10h.01M6 14h.01M18 10h.01M18 14h.01"/></svg>
                    )
                  return (
                    <button
                      key={value}
                      type="button"
                      title={label}
                      onClick={() => onChange(key, value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '14px 18px', borderRadius: 11, border: '1.5px solid',
                        borderColor: active ? '#087CF0' : '#DCE6F5',
                        background: active ? 'rgba(8,124,240,.08)' : '#fff',
                        color: active ? '#0768C9' : '#001B45',
                        font: 'inherit', fontSize: 14, fontWeight: 600,
                        cursor: 'pointer', transition: 'all .15s ease',
                      }}
                    >
                      {icon}
                      {label}
                    </button>
                  )
                })}
              </div>
            ) : key === 'country' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr 1fr', gap: 12 }}>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{config.fields.country}</span>
                  <select
                    value={section ? data[section].country : ''}
                    onChange={(e) => onChange('country', e.target.value)}
                    style={{ width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="">{config.placeholders.country}</option>
                    {config.options.country.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{config.fields.city}</span>
                  <input
                    type="text"
                    list={config.datalist && config.datalist.city ? 'city-suggestions' : undefined}
                    placeholder={config.placeholders.city}
                    value={section ? data[section].city : ''}
                    onChange={(e) => onChange('city', e.target.value)}
                    style={{ width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }}
                  />
                  {config.datalist && config.datalist.city && (
                    <datalist id="city-suggestions">
                      {config.datalist.city.map((opt) => (<option key={opt} value={opt} />))}
                    </datalist>
                  )}
                </label>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>{config.fields.zip}</span>
                  <input
                    type="text"
                    placeholder={config.placeholders.zip}
                    value={section ? data[section].zip : ''}
                    onChange={(e) => onChange('zip', e.target.value)}
                    style={{ width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none' }}
                  />
                </label>
              </div>
            ) : config.options && config.options[key] ? (
              <select
                value={section ? data[section][key] : ''}
                onChange={(e) => onChange(key, e.target.value)}
                style={{
                  width: '100%', padding: '14px 15px',
                  border: '1.5px solid #DCE6F5', borderRadius: 11,
                  background: '#EEF4FC', font: 'inherit', color: '#001B45',
                  outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="">{config.placeholders[key]}</option>
                {config.options[key].map((opt) => {
                  const value = typeof opt === 'object' ? opt.value : opt
                  const label = typeof opt === 'object' ? opt.label : opt
                  return (
                    <option key={value} value={value}>{label}</option>
                  )
                })}
              </select>
            ) : key === 'paymentMethod' && section === 'payment' ? (
              <div style={{ width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC' }}>
                <CardElement
                  onChange={(e) => {
                    onChange('paymentMethod', e.complete ? 'card' : '')
                  }}
                  options={{ style: { base: { fontSize: '14px', color: '#001B45', '::placeholder': { color: '#8B9DBA' } } } }}
                />
              </div>
            ) : key === 'weight' ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="\\d+(\\.\\d+)?"
                  placeholder={config.placeholders[key]}
                  value={section ? data[section][key] : ''}
                  onChange={(e) => onChange(key, e.target.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\./g, '$1'))}
                  style={{
                    flex: 1, padding: '14px 15px',
                    border: '1.5px solid #DCE6F5', borderRadius: 11,
                    background: '#EEF4FC', font: 'inherit', color: '#001B45',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', flex: '0 0 auto', border: '1.5px solid #DCE6F5', borderRadius: 11, overflow: 'hidden' }}>
                  {['kg','lb'].map((u) => {
                    const active = (data[section].weightUnit || 'kg') === u
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => onChange('weightUnit', u)}
                        style={{
                          padding: '0 14px', border: 'none',
                          background: active ? '#087CF0' : '#fff',
                          color: active ? '#fff' : '#10233F',
                          fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {u}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <>
                <input
                    type={key === 'pickupDate' ? 'date' : 'text'}
                    min={key === 'pickupDate' ? minDate : undefined}
                    list={config.datalist && config.datalist[key] ? `${key}-suggestions` : undefined}
                    inputMode={key === 'pieces' ? 'numeric' : key === 'pickupDate' ? undefined : 'text'}
                    pattern={key === 'pieces' ? '\\d*' : key === 'dimensions' ? '\\d+(\\.\\d+)?\\s*x\\s*\\d+(\\.\\d+)?\\s*x\\s*\\d+(\\.\\d+)?(\\s*(cm|in|m))?' : undefined}
                    placeholder={config.placeholders[key]}
                    value={section ? data[section][key] : ''}
                    onChange={(e) => onChange(key, key === 'pieces' ? e.target.value.replace(/\\D/g, '') : e.target.value)}
                    style={{
                      width: '100%', padding: '14px 15px',
                      border: '1.5px solid #DCE6F5', borderRadius: 11,
                      background: '#EEF4FC', font: 'inherit', color: '#001B45',
                      outline: 'none',
                    }}
                  />
                {config.datalist && config.datalist[key] && (
                  <datalist id={`${key}-suggestions`}>
                    {config.datalist[key].map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                )}
              </>
            )}
          </label>
          {(section === 'sender' || section === 'recipient') && key === 'company' && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '.12em',
                  textTransform: 'uppercase', color: '#6C82A6',
                }}>
                  {c.selectAddress || 'Dirección'}
                </span>
                <select
                  value={data[section].addressId || ''}
                  onChange={(e) => onSelectAddress(section, e.target.value)}
                  style={{
                    width: '100%', padding: '14px 15px',
                    border: '1.5px solid #DCE6F5', borderRadius: 11,
                    background: '#EEF4FC', font: 'inherit', color: '#001B45',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">{c.selectHere || '— Seleccione aquí —'}</option>
                  <option value="manual">{c.manualAddress || 'Ingresar manualmente'}</option>
                  {savedAddresses.filter((addr) => {
                    if (section !== 'recipient') return true
                    if (!data.sender.addressId || data.sender.addressId === 'manual') return true
                    return String(addr.id) !== String(data.sender.addressId)
                  }).map((addr) => {
                    const initials = getInitials(addr.address || addr.name)
                    const label = [initials ? `${initials} —` : '', addr.address || addr.name, addr.city].filter(Boolean).join(' ')
                    return (
                      <option key={addr.id} value={String(addr.id)}>
                        {label}
                      </option>
                    )
                  })}
                </select>
              </label>
            </div>
          )}
          </React.Fragment>
        ))}
      </div>

      {section === 'service' && data.service.service !== 'Terrestre' && data.service.service && (
        <div style={{
          marginTop: 20, padding: 14, borderRadius: 12,
          background: '#FEF3C7', color: '#92400E', fontSize: 14,
        }}>
          {c.serviceUnavailable || 'Servicio no disponible. Pronto estará habilitado.'}
        </div>
      )}

      {step === 4 && submitted && result && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            Envío creado. Se asignó la guía {result.tracking_number || result.id || result.guide || ''}.
          </div>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 20, padding: 14, borderRadius: 12,
          background: '#FDECEC', color: '#B91C1C', fontSize: 14,
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid #DCE6F5', alignItems: 'center' }}>
        {step > 0 && (
          <button
            onClick={onBack}
            disabled={submitting}
            style={{
              padding: '14px 8px', background: 'transparent',
              border: 'none',
              color: '#001B45', fontSize: 14, fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? .6 : 1,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          ><span style={{ fontSize: 15 }}>←</span> {c.back}</button>
        )}
        <button
          onClick={() => {
            if (isLastStep) {
              onFinish()
            } else if (canContinue) {
              onNext()
            }
          }}
          disabled={!canContinue || submitting}
          style={{
            marginLeft: 'auto', padding: '14px 24px',
            background: (canContinue && !submitting) ? '#087CF0' : '#8FC6F7',
            border: 'none', borderRadius: 11,
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: (canContinue && !submitting) ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >{isLastStep ? (submitting ? 'Procesando…' : c.payment.submit) : c.continue}{!isLastStep && <span style={{ fontSize: 15 }}>→</span>}</button>
      </div>
    </div>
  )
}

function ShipmentSuccess({ app, result, onNew }) {
  const [copied, setCopied] = React.useState(false)
  const guide = result.tracking_number || result.id || result.guide || ''
  const copy = async () => {
    if (!guide) return
    try {
      await navigator.clipboard.writeText(guide)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {}
  }
  return (
    <div style={{
      background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16,
      padding: 40, textAlign: 'center', color: '#6C82A6', fontSize: 15,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: '#F1FAF5', color: '#0F5F36',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 28,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      </div>
      <h2 style={{
        fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 24,
        color: '#001B45', margin: '0 0 8px',
      }}>Envío creado</h2>
      <p style={{ margin: '0 0 24px', color: '#6C82A6' }}>Se asignó la guía</p>
      <div style={{
        display: 'inline-block', padding: '14px 24px', borderRadius: 12,
        background: '#F6FAFF', border: '1px solid #DCE6F5',
        color: '#001B45', fontSize: 20, fontWeight: 700, letterSpacing: '.02em',
        wordBreak: 'break-word',
      }}>
        {guide}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={copy}
          style={{
            padding: '12px 20px', borderRadius: 11, border: '1.5px solid #DCE6F5',
            background: '#fff', color: '#001B45', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}
        >{copied ? 'Copiado' : 'Copiar guía'}</button>
        <button
          type="button"
          onClick={() => app.go('track?code=' + encodeURIComponent(guide))}
          style={{
            padding: '12px 20px', borderRadius: 11, border: 'none',
            background: '#087CF0', color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}
        >Rastrear envío</button>
        <button
          type="button"
          onClick={onNew}
          style={{
            padding: '12px 20px', borderRadius: 11, border: 'none',
            background: '#001B45', color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}
        >Crear otro envío</button>
      </div>
    </div>
  )
}

function ShipmentCreateInner({ app, token }) {
  const c = app.create
  const [step, setStep] = React.useState(0)
  const [submitted, setSubmitted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [result, setResult] = React.useState(null)
  const [savedAddresses, setSavedAddresses] = React.useState([])
  const [surcharges, setSurcharges] = React.useState({})
  const [data, setData] = React.useState({
    sender: emptyAddress(),
    recipient: emptyAddress(),
    package: [emptyPackage()],
    service: emptyService(),
    payment: emptyPayment(),
  })
  const draftLoaded = React.useRef(false)

  React.useEffect(() => {
    if (draftLoaded.current) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        const draft = parsed.data || {}
        setData({
          sender: { ...emptyAddress(), ...draft.sender },
          recipient: { ...emptyAddress(), ...draft.recipient },
          package: (Array.isArray(draft.package) && draft.package.length ? draft.package : [emptyPackage()]).map(migratePackage),
          service: { ...emptyService(), ...draft.service },
          payment: { ...emptyPayment(), ...draft.payment },
        })
        setStep(typeof parsed.step === 'number' ? parsed.step : 0)
      }
    } catch (e) {}
    draftLoaded.current = true
  }, [])

  React.useEffect(() => {
    if (!draftLoaded.current) return
    if (submitted) {
      try { localStorage.removeItem(DRAFT_KEY) } catch (e) {}
      return
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step }))
    } catch (e) {}
  }, [data, step, submitted])

  const afterHours = React.useCallback(() => {
    const hour = Number(new Date().toLocaleString('en-US', { timeZone: 'America/Santo_Domingo', hour: 'numeric', hour12: false }))
    return hour >= 20
  }, [])

  const [isAfterHours, setIsAfterHours] = React.useState(afterHours)
  const afterHoursMsg = c.afterHours || 'Los envíos se pueden recoger hasta las 8:00 p.m. (hora de República Dominicana). Estaremos abiertos de lunes a viernes, de 8:00 a.m. a 6:00 p.m. Si desea, puede programar su recogida para mañana.'

  React.useEffect(() => {
    const id = setInterval(() => setIsAfterHours(afterHours()), 60000)
    return () => clearInterval(id)
  }, [afterHours])

  React.useEffect(() => {
    setError('')
  }, [step])

  React.useEffect(() => {
    if (!token) return
    api.getAddresses(token)
      .then((res) => setSavedAddresses(Array.isArray(res) ? res : res.addresses || []))
      .catch(() => setSavedAddresses([]))
    api.getPricingConfig(token)
      .then((res) => setSurcharges(res?.surcharges || {}))
      .catch(() => {})
  }, [token])

  const sectionMap = { 0: 'sender', 1: 'recipient', 2: 'package', 3: 'service', 4: 'payment' }
  const section = sectionMap[step]

  const getPhoneExample = (section) => {
    const country = section ? (data[section].phoneCountry || data[section].country) : ''
    return country && PHONE_FORMATS[country] ? PHONE_FORMATS[country].example : '+1 000 000 0000'
  }

  const getConfig = () => {
    const phoneExample = getPhoneExample(section)
    if (step === 2) {
      return {
        keys: [],
        required: c.package.required,
      }
    }
    if (step === 3) {
      return {
        keys: Object.keys(c.service.fields).filter((k) => k !== 'service'),
        fields: c.service.fields,
        placeholders: c.service.placeholders,
        required: c.service.required,
        span2: c.service.span2,
        options: {
          service: ['Terrestre', 'Consolidado', 'Marítimo', 'Aéreo', 'Última milla'],
          timeWindow: c.service.windows,
        },
      }
    }
    if (step === 4) {
      const method = data.payment.method || ''
      const baseKeys = ['method', 'chargeToAccount']
      const extraKeys = []
      const extraRequired = []
      if (method === 'card') {
        extraKeys.push('paymentMethod', 'cardholderName', 'billingZip')
        extraRequired.push('paymentMethod', 'cardholderName', 'billingZip')
      } else if (method === 'transfer') {
        extraKeys.push('bank', 'reference')
        extraRequired.push('bank', 'reference')
      }
      const methodOptions = c.payment.methodOptions
        ? Object.keys(c.payment.methodOptions).map((k) => ({ value: k, label: c.payment.methodOptions[k] }))
        : [{ value: 'card', label: 'Tarjeta' }, { value: 'transfer', label: 'Transferencia' }, { value: 'cash', label: 'Efectivo' }]
      return {
        keys: [...baseKeys, ...extraKeys],
        fields: c.payment.fields,
        placeholders: c.payment.placeholders,
        required: ['method', 'chargeToAccount', ...extraRequired],
        span2: c.payment.span2,
        payment: c.payment,
        options: {
          method: methodOptions,
          bank: [
            { value: 'bhd', label: 'BHD León' },
            { value: 'popular', label: 'Banco Popular' },
            { value: 'santacruz', label: 'Banco Santa Cruz' },
            { value: 'reservas', label: 'BanReservas' },
            { value: 'international', label: 'Transferencia internacional' },
          ],
          chargeToAccount: ['No', 'Sí'],
        },
      }
    }
    const isManual = data[section]?.addressId === 'manual'
    const isHiddenIfSaved = (k) => k === 'address' || k === 'city' || k === 'zip' || k === 'country'
    const countryOptions = Object.keys(PHONE_FORMATS).filter((k) => k === 'DO' || k === 'CR').map((k) => ({
      code: k, short: k, flag: PHONE_FORMATS[k].code,
    }))
    return {
      keys: ADDRESS_KEYS.filter((k) => !isHiddenIfSaved(k) || isManual),
      fields: c.fields,
      placeholders: c.placeholders,
      required: ADDRESS_REQUIRED,
      span2: ADDRESS_SPAN2,
      datalist: {
        city: CITIES,
      },
      options: {
        country: countryOptions.map((o) => ({ value: o.code, label: COUNTRY_LABELS[o.code] || COUNTRY_NAMES[o.code] })),
      },
      countryOptions,
      phoneExample,
    }
  }

  const config = getConfig()

  const stripe = useStripe()
  const elements = useElements()

  const onBack = React.useCallback(() => {
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const validateAddress = (section) => {
    const addr = data[section]
    const country = addr.phoneCountry || addr.country
    if (!addr.email.trim() || !/^\S+@\S+\.\S+$/.test(addr.email.trim())) {
      return c.errEmail
    }
    if (!addr.phone.trim()) {
      return c.errPhone
    }
    if (country && PHONE_FORMATS[country] && !PHONE_FORMATS[country].pattern.test(addr.phone.trim())) {
      return c.errPhoneFmt.replace('{country}', COUNTRY_NAMES[country]).replace('{example}', PHONE_FORMATS[country].example)
    }
    return ''
  }

  const validatePackage = () => {
    const positive = (v) => /^\d+(\.\d+)?$/.test(String(v).trim()) && Number(v) > 0
    for (const pkg of data.package) {
      if (!positive(pkg.weight)) {
        return c.errWeight
      }
      if (!pkgDims(pkg.type).every((k) => positive(pkg[k]))) {
        return c.errDimensions
      }
    }
    return ''
  }

  const validateService = () => {
    const { service, pickupDate, timeWindow } = data.service
    if (service !== 'Terrestre') {
      return c.serviceUnavailable || 'Servicio no disponible. Pronto estará habilitado.'
    }
    if (!pickupDate) return ''
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    if (pickupDate < todayStr) return c.errPickupDate
    if (pickupDate === todayStr && afterHours()) {
      return c.errPickupAfterHours || c.errTimeWindow
    }
    if (pickupDate === todayStr && timeWindow) {
      const end = timeWindow.split(' - ')[1]
      const [endHour, endMin] = end.split(':').map(Number)
      const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Santo_Domingo', hour12: false })
      const [currentHour, currentMin] = currentTime.split(':').map(Number)
      const currentMinutes = currentHour * 60 + currentMin
      const endMinutes = endHour * 60 + endMin
      if (currentMinutes >= endMinutes) {
        return c.errTimeWindow || 'La ventana de horario ya no está disponible para hoy. Seleccione una fecha futura.'
      }
    }
    return ''
  }

  const onNext = React.useCallback(() => {
    if (section === 'sender' || section === 'recipient') {
      const err = validateAddress(section)
      if (err) { setError(err); return }
    }
    if (section === 'package') {
      const err = validatePackage()
      if (err) { setError(err); return }
    }
    if (section === 'service') {
      const err = validateService()
      if (err) { setError(err); return }
    }
    setStep((s) => Math.min(s + 1, c.steps.length - 1))
  }, [c, data, section])

  const validatePayment = () => {
    const p = data.payment
    if (!p.method || !p.chargeToAccount) {
      return c.errStep
    }
    if (p.method === 'card' && (!p.paymentMethod || !p.cardholderName.trim() || !p.billingZip.trim())) {
      return c.errStep
    }
    if (p.method === 'transfer' && (!p.bank || !p.reference.trim())) {
      return c.errStep
    }
    return ''
  }

  const validateAll = () => {
    const sections = ['sender', 'recipient']
    for (const sec of sections) {
      const err = validateAddress(sec)
      if (err) return err
    }
    const pkgErr = validatePackage()
    if (pkgErr) return pkgErr
    const payErr = validatePayment()
    if (payErr) return payErr
    return validateService()
  }

  const onFinish = React.useCallback(async () => {
    if (submitting) return
    if (!token) {
      setError('Inicie sesión para crear un envío.')
      return
    }
    const err = validateAll()
    if (err) {
      setError(err)
      return
    }
    setSubmitting(true)
    setError('')
    let payment_method_id = data.payment.method
    let payment_meta = {}
    if (data.payment.method === 'card') {
      const cardElement = elements.getElement(CardElement)
      if (!stripe || !cardElement) {
        setError('La pasarela de pago aún no está lista.')
        setSubmitting(false)
        return
      }
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: data.payment.cardholderName,
          address: { postal_code: data.payment.billingZip },
        },
      })
      if (stripeError) {
        setError(stripeError.message)
        setSubmitting(false)
        return
      }
      payment_method_id = paymentMethod.id
    } else if (data.payment.method === 'transfer') {
      payment_meta = { payment_bank: data.payment.bank, payment_reference: data.payment.reference }
    }
    try {
      const payload = {
        origin: data.sender.city,
        destination: data.recipient.city,
        sender_name: data.sender.name,
        sender_company: data.sender.company,
        sender_address: data.sender.address,
        sender_city: data.sender.city,
        sender_country: data.sender.country,
        sender_zip: data.sender.zip,
        sender_phone: data.sender.phone,
        sender_email: data.sender.email,
        recipient_name: data.recipient.name,
        recipient_company: data.recipient.company,
        recipient_address: data.recipient.address,
        recipient_city: data.recipient.city,
        recipient_country: data.recipient.country,
        recipient_zip: data.recipient.zip,
        recipient_phone: data.recipient.phone,
        recipient_email: data.recipient.email,
        service_type: data.service.service,
        delivery_mode: data.service.delivery || 'standard',
        packages: data.package.map((pkg) => {
          const keys = pkgDims(pkg.type)
          return {
            type: pkg.type,
            pieces: pkg.pieces || '1',
            weight: pkg.weight,
            weight_unit: pkg.weightUnit || 'kg',
            length_cm: pkg.length || null,
            width_cm: pkg.width || null,
            height_cm: keys.includes('height') ? (pkg.height || null) : null,
            dimensions: keys.every((k) => pkg[k]) ? `${keys.map((k) => pkg[k]).join('x')} cm` : '',
            declared_value: pkg.declaredValue,
            content: pkg.content,
          }
        }),
        notes: data.service.notes,
        payment_method: data.payment.method,
        payment_method_id,
        ...payment_meta,
        charge_to_account: data.payment.chargeToAccount,
      }
      const res = await api.createShipment(payload, token)
      setResult(res)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'No se pudo crear el envío.')
    } finally {
      setSubmitting(false)
    }
  }, [data, token, stripe, elements, c])

  const onNew = React.useCallback(() => {
    setSubmitted(false)
    setResult(null)
    setError('')
    setStep(0)
    setData({
      sender: emptyAddress(),
      recipient: emptyAddress(),
      package: [emptyPackage()],
      service: emptyService(),
      payment: emptyPayment(),
    })
  }, [])

  const onSelectAddress = React.useCallback((sec, id) => {
    if (!id) {
      setData((prev) => ({ ...prev, [sec]: { ...prev[sec], addressId: '' } }))
      return
    }
    if (id === 'manual') {
      setData((prev) => ({
        ...prev,
        [sec]: {
          ...emptyAddress(),
          addressId: 'manual',
          name: prev[sec].name || '',
          company: prev[sec].company || '',
        },
      }))
      return
    }
    const found = savedAddresses.find((a) => String(a.id) === id)
    if (!found) return
    setData((prev) => ({
      ...prev,
      [sec]: {
        ...prev[sec],
        addressId: String(found.id),
        name: prev[sec].name || '',
        company: '',
        address: found.address || '',
        city: found.city || '',
        country: found.country || '',
        zip: found.zip_code || '',
        phone: found.phone || '',
        phoneCountry: found.country || '',
      },
    }))
  }, [savedAddresses])

  const onPackageChange = React.useCallback((index, key, value) => {
    setError('')
    setData((prev) => {
      const packages = [...prev.package]
      packages[index] = { ...packages[index], [key]: value }
      return { ...prev, package: packages }
    })
  }, [])

  const onAddPackage = React.useCallback(() => {
    setData((prev) => ({ ...prev, package: [...prev.package, emptyPackage()] }))
  }, [])

  const onRemovePackage = React.useCallback((index) => {
    setData((prev) => ({ ...prev, package: prev.package.filter((_, i) => i !== index) }))
  }, [])

  const onChange = React.useCallback((key, value) => {
    if (!section) return
    setError('')
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }, [section])

  return (
    <div style={{ maxWidth: 900 }}>
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
      }}>{c.title}</h1>

      {!submitted && (<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {c.steps.map((label, i) => {
          const on = i === step
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 16px',
                border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                borderRadius: 100,
                background: on ? 'rgba(8,124,240,.08)' : '#fff',
                color: on ? '#0768C9' : '#6C82A6',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'default',
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: on ? '#087CF0' : '#EEF4FC',
                color: on ? '#fff' : '#6C82A6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>{i + 1}</span>
              {label}
            </div>
          )
        })}
      </div>)}

      {submitted && result ? (
        <ShipmentSuccess app={app} result={result} onNew={onNew} />
      ) : (
        section ? (
          <ShipmentForm
            c={c}
            step={step}
            section={section}
            config={config}
            data={data}
            savedAddresses={savedAddresses}
            surcharges={surcharges}
            onSelectAddress={onSelectAddress}
            submitted={submitted}
            error={error}
            submitting={submitting}
            result={result}
            onChange={onChange}
            onPackageChange={onPackageChange}
            onAddPackage={onAddPackage}
            onRemovePackage={onRemovePackage}
            isAfterHours={isAfterHours}
            afterHoursMsg={afterHoursMsg}
            onBack={onBack}
            onNext={onNext}
            onFinish={onFinish}
          />
        ) : (
          <div style={{
            background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16,
            padding: 40, textAlign: 'center', color: '#6C82A6', fontSize: 15,
          }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: '#001B45', marginBottom: 8, fontSize: 16 }}>
              {c.steps[step]}
            </div>
            {app.empty}
          </div>
        )
      )}
    </div>
  )
}

export default function ShipmentCreate(props) {
  const [stripe, setStripe] = React.useState(null)
  React.useEffect(() => {
    let mounted = true
    loadStripe(PUBLISHABLE_KEY).then((s) => { if (mounted) setStripe(s) })
    return () => { mounted = false }
  }, [])
  if (!stripe) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>Cargando pasarela de pago…</div>
  }
  return (
    <Elements stripe={stripe}>
      <ShipmentCreateInner {...props} />
    </Elements>
  )
}
