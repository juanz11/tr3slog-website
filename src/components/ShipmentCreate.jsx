import React from 'react'
import { api } from '../api'
import { COUNTRY_NAMES, PHONE_FORMATS } from '../lib/countries'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  || 'pk_test_51U9oCHLy571aG6WWmqNdtAiM9E7ZVDjTeB2Qs62VvLjOhv0Y253OGaFztaJseVBUhhkiZ3Q3CxaY8Fy9S2VHOg8L00mmeKsQQK'

const ADDRESS_KEYS = ['name', 'company', 'address', 'city', 'country', 'zip', 'phone', 'email']
const ADDRESS_REQUIRED = ['name', 'address', 'city', 'country', 'zip', 'phone', 'email']
const ADDRESS_SPAN2 = ['address']

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
  addressId: '', name: '', company: '', address: '', city: '', country: '', zip: '', phone: '', email: '',
})

const emptyPackage = () => ({
  pieces: '', weight: '', weightUnit: 'kg', dimensions: '', declaredValue: '', content: '',
})

const emptyService = () => ({
  service: 'Terrestre', pickupDate: '', timeWindow: '', notes: '',
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

function PackageList({ c, packages, onPackageChange, onAddPackage, onRemovePackage }) {
  const label = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }
  const input = { width: '100%', padding: '14px 15px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', font: 'inherit', color: '#001B45', outline: 'none', fontSize: 15 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {packages.map((pkg, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#001B45' }}>{`Paquete ${i + 1}`}</span>
            {packages.length > 1 && (
              <button
                type="button"
                onClick={() => onRemovePackage(i)}
                style={{ width: 28, height: 28, border: '1.5px solid #C0392B', borderRadius: 8, background: '#fff', color: '#C0392B', fontSize: 18, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                −
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={label}>{c.package.fields.pieces}</label>
              <input
                value={pkg.pieces}
                onChange={(e) => onPackageChange(i, 'pieces', e.target.value.replace(/\D/g, ''))}
                placeholder={c.package.placeholders.pieces}
                style={input}
              />
            </div>
            <div>
              <label style={label}>{c.package.fields.weight}</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
                <input
                  value={pkg.weight}
                  onChange={(e) => onPackageChange(i, 'weight', e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1'))}
                  placeholder={c.package.placeholders.weight}
                  style={{ ...input, flex: 1 }}
                />
                <div style={{ display: 'flex', flex: '0 0 auto', border: '1.5px solid #DCE6F5', borderRadius: 11, overflow: 'hidden' }}>
                  {['kg','lb'].map((u) => {
                    const active = (pkg.weightUnit || 'kg') === u
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => onPackageChange(i, 'weightUnit', u)}
                        style={{ padding: '0 14px', border: 'none', background: active ? '#087CF0' : '#fff', color: active ? '#fff' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        {u}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div>
              <label style={label}>{c.package.fields.dimensions}</label>
              <input
                value={pkg.dimensions}
                onChange={(e) => onPackageChange(i, 'dimensions', e.target.value)}
                placeholder={c.package.placeholders.dimensions}
                style={input}
              />
            </div>
            <div>
              <label style={label}>{c.package.fields.declaredValue}</label>
              <input
                value={pkg.declaredValue}
                onChange={(e) => onPackageChange(i, 'declaredValue', e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1'))}
                placeholder={c.package.placeholders.declaredValue}
                style={input}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={label}>{c.package.fields.content}</label>
              <textarea
                value={pkg.content}
                onChange={(e) => onPackageChange(i, 'content', e.target.value)}
                rows={3}
                placeholder={c.package.placeholders.content}
                style={{ ...input, resize: 'vertical' }}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onAddPackage}
        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1.5px solid #087CF0', borderRadius: 11, background: 'rgba(8,124,240,.08)', color: '#0768C9', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
      >
        <span style={{ fontSize: 18 }}>+</span> Agregar paquete
      </button>
    </div>
  )
}

function ShipmentForm({ c, step, section, config, data, savedAddresses, onSelectAddress, submitted, error, submitting, result, onChange, onPackageChange, onAddPackage, onRemovePackage, isAfterHours, afterHoursMsg, onBack, onNext, onFinish }) {
  const isLastStep = step === c.steps.length - 1
  const isComplete = section
    ? (section === 'package'
      ? data[section].every((pkg) => config.required.every((k) => String(pkg[k] || '').trim() !== ''))
      : config.required.every((k) => String(data[section][k] || '').trim() !== ''))
    : true
  const isServiceAvailable = section !== 'service' || data.service.service === 'Terrestre'
  const canContinue = isComplete && isServiceAvailable
  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 26 }}>
      {isAfterHours && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: '#FDECEC', color: '#B91C1C', fontSize: 14, lineHeight: 1.6 }}>
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

      <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid #DCE6F5' }}>
        {step > 0 && (
          <button
            onClick={onBack}
            disabled={submitting}
            style={{
              padding: '14px 20px', background: '#fff',
              border: '1.5px solid #DCE6F5', borderRadius: 11,
              color: '#001B45', fontSize: 14, fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? .6 : 1,
            }}
          >{c.back}</button>
        )}
        <button
          onClick={() => {
            if (isLastStep) {
              onFinish()
            } else if (canContinue) {
              onNext()
            }
          }}
          disabled={!canContinue || submitting || isAfterHours}
          style={{
            marginLeft: 'auto', padding: '14px 24px',
            background: (canContinue && !submitting && !isAfterHours) ? '#087CF0' : '#8FC6F7',
            border: 'none', borderRadius: 11,
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: (canContinue && !submitting && !isAfterHours) ? 'pointer' : 'not-allowed',
          }}
        >{isLastStep ? (submitting ? 'Procesando…' : c.payment.submit) : c.continue}</button>
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
        setData(parsed.data || {
          sender: emptyAddress(),
          recipient: emptyAddress(),
          package: [emptyPackage()],
          service: emptyService(),
          payment: emptyPayment(),
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
  const afterHoursMsg = 'Los envíos se pueden recoger hasta las 8:00 p.m. (hora de República Dominicana). Estaremos abiertos de lunes a viernes, de 8:00 a.m. a 6:00 p.m. Si desea, puede programar su recogida para mañana.'

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
  }, [token])

  const sectionMap = { 0: 'sender', 1: 'recipient', 2: 'package', 3: 'service', 4: 'payment' }
  const section = sectionMap[step]

  const getPhoneExample = (section) => {
    const country = section ? data[section].country : ''
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
        country: countryOptions.map((o) => ({ value: o.code, label: `${o.flag} ${o.short}` })),
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
    const country = addr.country
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
    for (const pkg of data.package) {
      if (!/^\d+$/.test(String(pkg.pieces).trim())) {
        return c.errPieces
      }
      if (!/^\d+(\.\d+)?$/.test(String(pkg.weight).trim()) || Number(pkg.weight) <= 0) {
        return c.errWeight
      }
      if (String(pkg.dimensions).trim() && !/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(\s*(cm|in|m))?$/i.test(String(pkg.dimensions).trim())) {
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
    if (afterHours()) {
      setError(afterHoursMsg)
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
        packages: data.package.map((pkg) => ({
          pieces: pkg.pieces,
          weight: pkg.weight,
          weight_unit: pkg.weightUnit,
          dimensions: pkg.dimensions,
          declared_value: pkg.declaredValue,
          content: pkg.content,
        })),
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
