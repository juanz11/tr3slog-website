import React from 'react'
import { api } from '../api'

const ADDRESS_KEYS = ['name', 'company', 'address', 'city', 'zip', 'phone', 'email']
const ADDRESS_REQUIRED = ['name', 'address', 'city', 'zip', 'phone']
const ADDRESS_SPAN2 = ['address']

const emptyAddress = () => ({
  name: '', company: '', address: '', city: '', zip: '', phone: '', email: '',
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
    ? config.required.every((k) => data[section][k].trim() !== '')
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
            {config.options && config.options[key] ? (
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
              <input
                type="text"
                placeholder={config.placeholders[key]}
                value={section ? data[section][key] : ''}
                onChange={(e) => onChange(key, e.target.value)}
                style={{
                  width: '100%', padding: '14px 15px',
                  border: '1.5px solid #DCE6F5', borderRadius: 11,
                  background: '#EEF4FC', font: 'inherit', color: '#001B45',
                  outline: 'none',
                }}
              />
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

      {step === 4 && error && (
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

  const getConfig = () => {
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
      keys: ADDRESS_KEYS,
      fields: c.fields,
      placeholders: c.placeholders,
      required: ADDRESS_REQUIRED,
      span2: ADDRESS_SPAN2,
    }
  }

  const config = getConfig()

  const onBack = React.useCallback(() => {
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const onNext = React.useCallback(() => {
    setStep((s) => Math.min(s + 1, c.steps.length - 1))
  }, [c.steps.length])

  const onFinish = React.useCallback(async () => {
    if (!token) {
      setError('Inicie sesión para crear un envío.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        sender: data.sender,
        recipient: data.recipient,
        package: {
          pieces: data.package.pieces,
          weight: data.package.weight,
          dimensions: data.package.dimensions,
          declared_value: data.package.declaredValue,
          content: data.package.content,
        },
        service: {
          service: data.service.service,
          pickup_date: data.service.pickupDate,
          time_window: data.service.timeWindow,
          notes: data.service.notes,
        },
        payment: {
          payment_method: data.payment.paymentMethod,
          charge_to_account: data.payment.chargeToAccount,
        },
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
