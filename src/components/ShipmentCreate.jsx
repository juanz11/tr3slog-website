import React from 'react'
import { api } from '../api'

const ADDRESS_KEYS = ['name', 'company', 'address', 'city', 'country', 'zip', 'phone', 'email']
const ADDRESS_REQUIRED = ['name', 'address', 'city', 'country', 'zip', 'phone', 'email']
const ADDRESS_SPAN2 = ['address']

const CITIES = [
  'San Juan', 'Santo Domingo', 'Punta Cana', 'Miami', 'New York', 'Atlanta',
  'Montego Bay', 'Seoul', 'Tokyo', 'Shanghai', 'Caracas', 'Valencia',
  'Maracaibo', 'Montevideo', 'Punta del Este', 'Paysandú', 'Salto', 'Colonia',
]

const COUNTRY_NAMES = {
  PR: 'Puerto Rico',
  DO: 'República Dominicana',
  US: 'Estados Unidos',
  JM: 'Jamaica',
  KR: 'Corea del Sur',
  JP: 'Japón',
  CN: 'China',
  VE: 'Venezuela',
  UY: 'Uruguay',
}

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

const PHONE_FORMATS = {
  PR: { code: '+1', example: '+1 787 555 1234', pattern: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/ },
  DO: { code: '+1', example: '+1 809 555 1234', pattern: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/ },
  US: { code: '+1', example: '+1 305 555 1234', pattern: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/ },
  JM: { code: '+1', example: '+1 876 555 1234', pattern: /^(\+?1\s?)?\(?\d{3}\)?\s?\d{3}\s?-?\d{4}$/ },
  KR: { code: '+82', example: '+82 10-1234-5678', pattern: /^(\+82\s?)?\d{2,3}[-.\s]?\d{3,4}[-.\s]?\d{4}$/ },
  JP: { code: '+81', example: '+81 90-1234-5678', pattern: /^(\+81\s?)?\d{1,2}[-.\s]?\d{4}[-.\s]?\d{4}$/ },
  CN: { code: '+86', example: '+86 138 0013 8000', pattern: /^(\+86\s?)?\d{11}$/ },
  VE: { code: '+58', example: '+58 412 123 4567', pattern: /^(\+58\s?)?\d{3}\s?\d{7}$/ },
  UY: { code: '+598', example: '+598 91 234 567', pattern: /^(\+598\s?)?\d{2,3}\s?\d{3}\s?\d{3}$/ },
}

const emptyAddress = () => ({
  name: '', company: '', address: '', city: '', country: '', zip: '', phone: '', email: '',
})

const emptyPackage = () => ({
  pieces: '', weight: '', dimensions: '', declaredValue: '', content: '',
})

const emptyService = () => ({
  service: '', pickupDate: '', timeWindow: '', notes: '',
})

const emptyPayment = () => ({
  paymentMethod: '', chargeToAccount: '',
})

function ShipmentForm({ c, step, section, config, data, submitted, error, submitting, result, onChange, onBack, onNext, onFinish }) {
  const isLastStep = step === c.steps.length - 1
  const isComplete = section
    ? config.required.every((k) => String(data[section][k] || '').trim() !== '')
    : true

  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 26 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {config.keys.map((key) => (
          <label key={key} style={{ gridColumn: config.span2.includes(key) ? 'span 2' : 'span 1', display: 'block' }}>
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
                  value={section ? data[section].country : ''}
                  onChange={(e) => onChange('country', e.target.value)}
                  style={{
                    flex: '0 0 90px', padding: '14px 12px',
                    border: '1.5px solid #DCE6F5', borderRadius: 11,
                    background: '#EEF4FC', font: 'inherit', color: '#001B45',
                    outline: 'none', cursor: 'pointer', fontSize: 13,
                  }}
                >
                  <option value="">{c.fields.country}</option>
                  {config.countryOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.flag} {opt.short}
                    </option>
                  ))}
                </select>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
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
                  <span style={{ fontSize: 12, color: '#8B9DBA', whiteSpace: 'nowrap' }}>
                    Ej: {config.phoneExample}
                  </span>
                </div>
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
                {config.options[key].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <>
                <input
                    type="text"
                    list={config.datalist && config.datalist[key] ? `${key}-suggestions` : undefined}
                    inputMode={key === 'pieces' ? 'numeric' : 'text'}
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
        ))}
      </div>

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
        <button
          onClick={onBack}
          disabled={step === 0 || submitting}
          style={{
            padding: '14px 20px', background: '#fff',
            border: '1.5px solid #DCE6F5', borderRadius: 11,
            color: '#001B45', fontSize: 14, fontWeight: 600,
            cursor: step === 0 || submitting ? 'not-allowed' : 'pointer',
            opacity: step === 0 || submitting ? .6 : 1,
          }}
        >{c.back}</button>
        <button
          onClick={() => {
            if (isLastStep) {
              onFinish()
            } else if (isComplete) {
              onNext()
            }
          }}
          disabled={!isComplete || submitting}
          style={{
            marginLeft: 'auto', padding: '14px 24px',
            background: isComplete && !submitting ? '#087CF0' : '#8FC6F7',
            border: 'none', borderRadius: 11,
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: isComplete && !submitting ? 'pointer' : 'not-allowed',
            display: step === 0 ? 'none' : 'flex',
          }}
        >{isLastStep ? (submitting ? 'Procesando…' : c.payment.submit) : c.continue}</button>
      </div>
    </div>
  )
}

export default function ShipmentCreate({ app, token }) {
  const c = app.create
  const [step, setStep] = React.useState(0)
  const [submitted, setSubmitted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [result, setResult] = React.useState(null)
  const [data, setData] = React.useState({
    sender: emptyAddress(),
    recipient: emptyAddress(),
    package: emptyPackage(),
    service: emptyService(),
    payment: emptyPayment(),
  })

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
        keys: Object.keys(c.package.fields),
        fields: c.package.fields,
        placeholders: c.package.placeholders,
        required: c.package.required,
        span2: c.package.span2,
      }
    }
    if (step === 3) {
      return {
        keys: Object.keys(c.service.fields),
        fields: c.service.fields,
        placeholders: c.service.placeholders,
        required: c.service.required,
        span2: c.service.span2,
        options: {
          service: ['Consolidado', 'Marítimo', 'Aéreo', 'Carga terrestre', 'Última milla'],
        },
      }
    }
    if (step === 4) {
      return {
        keys: Object.keys(c.payment.fields),
        fields: c.payment.fields,
        placeholders: c.payment.placeholders,
        required: c.payment.required,
        span2: c.payment.span2,
        payment: c.payment,
      }
    }
    return {
      keys: ADDRESS_KEYS.filter((k) => k !== 'country'),
      fields: c.fields,
      placeholders: c.placeholders,
      required: ADDRESS_REQUIRED,
      span2: ADDRESS_SPAN2,
      datalist: {
        city: CITIES,
        address: CITIES,
      },
      countryOptions: Object.keys(PHONE_FORMATS).map((k) => ({
        code: k, short: k, flag: PHONE_FORMATS[k].code,
      })),
      phoneExample,
    }
  }

  const config = getConfig()

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
    const { pieces, dimensions } = data.package
    if (!/^\d+$/.test(String(pieces).trim())) {
      return c.errPieces
    }
    if (String(dimensions).trim() && !/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(\s*(cm|in|m))?$/i.test(String(dimensions).trim())) {
      return c.errDimensions
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
    setStep((s) => Math.min(s + 1, c.steps.length - 1))
  }, [c, data, section])

  const validateAll = () => {
    const sections = ['sender', 'recipient']
    for (const sec of sections) {
      const err = validateAddress(sec)
      if (err) return err
    }
    return validatePackage()
  }

  const onFinish = React.useCallback(async () => {
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
    try {
      const payload = {
        origin: data.sender.city,
        destination: data.recipient.city,
        recipient_name: data.recipient.name,
        recipient_email: data.recipient.email,
        recipient_phone: data.recipient.phone,
        service_type: data.service.service,
        weight: data.package.weight,
        dimensions: data.package.dimensions,
        pieces: data.package.pieces,
        notes: data.service.notes,
      }
      const res = await api.createShipment(payload, token)
      setResult(res)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'No se pudo crear el envío.')
    } finally {
      setSubmitting(false)
    }
  }, [data, token])

  const onChange = React.useCallback((key, value) => {
    if (!section) return
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

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {c.steps.map((label, i) => {
          const on = i === step
          return (
            <button
              key={i}
              onClick={() => setStep(i)}
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
                cursor: 'pointer',
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
            </button>
          )
        })}
      </div>

      {section ? (
        <ShipmentForm
          c={c}
          step={step}
          section={section}
          config={config}
          data={data}
          submitted={submitted}
          error={error}
          submitting={submitting}
          result={result}
          onChange={onChange}
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
      )}
    </div>
  )
}
