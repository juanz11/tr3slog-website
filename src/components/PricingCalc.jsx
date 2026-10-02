import React from 'react'
import { api } from '../api'

const DEFAULT_SERVICES = ['Terrestre', 'Consolidado', 'Marítimo', 'Aéreo', 'Última milla']

const IN_PER_CM = 1 / 2.54
const LB_PER_KG = 2.20462

const fmt = (n, digits = 2) => Number.isFinite(n) ? n.toLocaleString('en-US', { maximumFractionDigits: digits }) : '—'

const DELIVERY_MODES = ['standard', 'express', 'same_day']

export function DeliveryIcon({ mode, color = 'currentColor', size = 22 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (mode === 'express') return <svg {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9.5V13l3 2" /><path d="M9 2.5h6" /></svg>
  if (mode === 'same_day') return <svg {...p}><path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" /></svg>
  return <svg {...p}><path d="M4 16V7h9v9" /><path d="M13 10h4l3 3v3" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></svg>
}

export default function PricingCalc({ app, lang, token }) {
  const d = app.pricing
  const ENABLED = ['Terrestre']
  const services = (d.services || DEFAULT_SERVICES).filter((s) => ENABLED.includes(s))
  const [cfg, setCfg] = React.useState({ dim_divisor: 166, service_limits: {}, service_rates: {} })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [notice, setNoticeRaw] = React.useState('')
  const [calc, setCalc] = React.useState({ service: services[0], delivery: 'standard', length: '', width: '', height: '', dimUnit: 'in', weight: '', weightUnit: 'lb' })

  const setNotice = (msg) => {
    setNoticeRaw(msg)
    if (msg) setTimeout(() => setNoticeRaw(''), 5000)
  }

  React.useEffect(() => {
    if (!token) { setLoading(false); return }
    api.getPricingConfig(token)
      .then((res) => setCfg({
        dim_divisor: res.dim_divisor ?? 166,
        service_limits: res.service_limits || {},
        service_rates: res.service_rates || {},
        surcharges: res.surcharges || {},
      }))
      .catch((e) => setError(e.message || d.error))
      .finally(() => setLoading(false))
  }, [token, d.error])

  const setLimit = (svc, v) => setCfg((c) => ({ ...c, service_limits: { ...c.service_limits, [svc]: v } }))
  const setRate = (svc, key, v) => setCfg((c) => ({ ...c, service_rates: { ...c.service_rates, [svc]: { ...(c.service_rates[svc] || {}), [key]: v } } }))
  const setSur = (mode, key, v) => setCfg((c) => ({ ...c, surcharges: { ...c.surcharges, [mode]: { ...(c.surcharges[mode] || {}), [key]: v } } }))

  const num = (v) => v.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1')
  const numVal = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0 }

  const input = { width: '100%', padding: '12px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#fff', font: 'inherit', fontSize: 15, color: '#001B45', outline: 'none' }
  const inputSm = { ...input, padding: '10px 12px', fontSize: 14 }
  const fieldLabel = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6C82A6', marginBottom: 6 }
  const cardTitle = { fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 15, color: '#001B45', marginBottom: 14 }
  const unitBtn = (active) => ({ padding: '0 12px', border: 'none', background: active ? '#087CF0' : '#fff', color: active ? '#fff' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' })

  /* ---- calculator math: everything normalized to inches + pounds ---- */
  const toIn = (v) => calc.dimUnit === 'cm' ? v * IN_PER_CM : v
  const toLb = (v) => calc.weightUnit === 'kg' ? v * LB_PER_KG : v

  const L = toIn(numVal(calc.length))
  const W = toIn(numVal(calc.width))
  const H = toIn(numVal(calc.height))
  const actualLb = toLb(numVal(calc.weight))
  const volIn3 = L * W * H
  const divisor = numVal(cfg.dim_divisor) || 166
  const dimLb = volIn3 > 0 ? volIn3 / divisor : 0
  const billableLb = Math.max(actualLb, dimLb)
  const girth = 2 * (W + H)
  const totalSize = L + girth
  const limit = numVal(cfg.service_limits?.[calc.service])
  const oversized = totalSize > 0 && limit > 0 && totalSize > limit
  const rate = cfg.service_rates?.[calc.service] || {}
  const price = billableLb > 0 ? numVal(rate.base) + billableLb * numVal(rate.per_lb) : 0
  const sur = cfg.surcharges?.[calc.delivery] || {}
  const surchargeAmt = price > 0 ? (sur.type === 'fixed' ? numVal(sur.value) : price * numVal(sur.value) / 100) : 0
  const totalPrice = price + surchargeAmt
  const hasInput = volIn3 > 0 || actualLb > 0

  const save = async () => {
    if (saving) return
    setSaving(true)
    setError('')
    try {
      const res = await api.updatePricingConfig(cfg, token)
      setCfg({
        dim_divisor: res.dim_divisor ?? cfg.dim_divisor,
        service_limits: res.service_limits || cfg.service_limits,
        service_rates: res.service_rates || cfg.service_rates,
        surcharges: res.surcharges || cfg.surcharges,
      })
      setNotice(d.saved)
    } catch (e) {
      setError(e.message || d.error)
    } finally {
      setSaving(false)
    }
  }

  const Result = ({ label, value, sub, tone }) => (
    <div style={{ background: '#F4F9FF', border: '1px solid #E2EDFB', borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{label}</div>
      <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 20, color: tone || '#001B45', marginTop: 4 }}>{value}</div>
      {sub ? <div style={{ fontSize: 12, color: '#8B9DBA', marginTop: 2 }}>{sub}</div> : null}
    </div>
  )

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>

      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>{error}</div>
      )}
      {notice && (
        <div style={{ padding: 14, background: 'rgba(19,122,69,.1)', color: '#0F5F36', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>{notice}</div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 className="app-h1" style={{ marginBottom: 8 }}>{d.title}</h1>
          <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch' }}>{d.sub}</p>
        </div>
        <button className="app-primary" onClick={save} disabled={saving || loading} style={{ marginLeft: 'auto' }}>
          {saving ? d.saving : d.save}
        </button>
      </div>

      {/* Delivery speed surcharge selector */}
      <div className="app-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={cardTitle}>{d.deliveryT}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {DELIVERY_MODES.map((m) => {
            const s = cfg.surcharges?.[m] || {}
            const active = calc.delivery === m
            const badge = s.type === 'fixed' ? `+$${fmt(numVal(s.value), 0)}` : `+${fmt(numVal(s.value), 0)}%`
            return (
              <button
                key={m}
                type="button"
                onClick={() => setCalc({ ...calc, delivery: m })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px',
                  border: `1.5px solid ${active ? '#087CF0' : '#DCE6F5'}`, borderRadius: 14,
                  background: active ? 'rgba(8,124,240,.07)' : '#fff',
                  cursor: 'pointer', font: 'inherit', textAlign: 'left',
                }}
              >
                <span style={{ color: active ? '#0768C9' : '#6C82A6', display: 'flex', flex: '0 0 auto' }}>
                  <DeliveryIcon mode={m} color="currentColor" size={26} />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#001B45' }}>{d.delivery[m]}</span>
                  <span style={{ display: 'block', fontSize: 12, color: '#8B9DBA', marginTop: 2 }}>{d.deliverySub?.[m] || ''}</span>
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
                  background: active ? '#087CF0' : '#EEF4FC', color: active ? '#fff' : '#6C82A6', flex: '0 0 auto',
                }}>{badge}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Calculator */}
      <div className="app-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={cardTitle}>{d.calcT}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={fieldLabel}>{d.f.service}</label>
            <select value={calc.service} onChange={(e) => setCalc({ ...calc, service: e.target.value })} style={{ ...input, cursor: 'pointer' }}>
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {['length', 'width', 'height'].map((k) => (
            <div key={k}>
              <label style={fieldLabel}>{d.f[k]}</label>
              <input inputMode="decimal" placeholder="0" value={calc[k]}
                onChange={(e) => setCalc({ ...calc, [k]: num(e.target.value) })} style={input} />
            </div>
          ))}
          <div>
            <label style={fieldLabel}>{d.f.dimUnit}</label>
            <div style={{ display: 'flex', border: '1.5px solid #DCE6F5', borderRadius: 11, overflow: 'hidden' }}>
              {['in', 'cm'].map((u) => (
                <button key={u} type="button" onClick={() => setCalc({ ...calc, dimUnit: u })} style={{ ...unitBtn(calc.dimUnit === u), flex: 1, padding: '12px 0' }}>{u}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={fieldLabel}>{d.f.weight}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input inputMode="decimal" placeholder="0" value={calc.weight}
                onChange={(e) => setCalc({ ...calc, weight: num(e.target.value) })} style={{ ...input, flex: 1 }} />
              <div style={{ display: 'flex', border: '1.5px solid #DCE6F5', borderRadius: 11, overflow: 'hidden', flex: '0 0 auto' }}>
                {['lb', 'kg'].map((u) => (
                  <button key={u} type="button" onClick={() => setCalc({ ...calc, weightUnit: u })} style={unitBtn(calc.weightUnit === u)}>{u}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {hasInput && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            <Result label={d.r.actual} value={`${fmt(actualLb)} lb`} sub={`${fmt(actualLb / LB_PER_KG)} kg`} />
            <Result label={d.r.dim} value={volIn3 > 0 ? `${fmt(dimLb)} lb` : '—'} sub={volIn3 > 0 ? `${fmt(volIn3, 0)} in³ ÷ ${fmt(divisor, 0)}` : ''} />
            <Result label={d.r.billable} value={`${fmt(billableLb)} lb`} sub={`${fmt(billableLb / LB_PER_KG)} kg`} />
            <Result label={d.r.girth} value={W || H ? `${fmt(girth)} in` : '—'} sub="2 × (W + H)" />
            <Result label={d.r.total} value={totalSize > 0 ? `${fmt(totalSize)} in` : '—'} sub={limit ? `${d.r.limit} ${fmt(limit, 0)} in` : ''} tone={totalSize > 0 && limit ? (oversized ? '#A93226' : '#0F5F36') : '#001B45'} />
            <Result label={d.r.status} value={totalSize > 0 && limit ? (oversized ? d.r.oversized : d.r.accepted) : '—'} tone={totalSize > 0 && limit ? (oversized ? '#A93226' : '#0F5F36') : '#6C82A6'} />
            <Result label={d.r.price} value={price > 0 ? `$${fmt(price)}` : '—'} sub={price > 0 ? `${fmt(numVal(rate.base))} + ${fmt(billableLb)} × ${fmt(numVal(rate.per_lb))}` : ''} />
            <Result label={d.r.surcharge} value={price > 0 ? (surchargeAmt > 0 ? `+$${fmt(surchargeAmt)}` : '$0') : '—'} sub={d.delivery[calc.delivery]} />
            <Result label={d.r.totalPrice} value={totalPrice > 0 ? `$${fmt(totalPrice)}` : '—'} tone="#0F5F36" />
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Parameters */}
        <div className="app-card" style={{ padding: 20 }}>
          <div style={cardTitle}>{d.paramsT}</div>
          <label style={fieldLabel}>{d.f.dimDivisor}</label>
          <input inputMode="decimal" value={cfg.dim_divisor}
            onChange={(e) => setCfg({ ...cfg, dim_divisor: num(e.target.value) })} style={inputSm} />
          <p style={{ margin: '10px 0 0', fontSize: 12, color: '#8B9DBA', lineHeight: 1.6 }}>{d.divisorHint}</p>
        </div>

        {/* Limits per service */}
        <div className="app-card" style={{ padding: 20 }}>
          <div style={cardTitle}>{d.limitsT}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {services.map((svc) => (
              <div key={svc} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#10233F' }}>{svc}</span>
                <input inputMode="decimal" value={cfg.service_limits?.[svc] ?? ''} placeholder="130"
                  onChange={(e) => setLimit(svc, num(e.target.value))} style={{ ...inputSm, width: 100, textAlign: 'right' }} />
                <span style={{ fontSize: 12, color: '#8B9DBA', width: 20 }}>in</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery surcharges */}
        <div className="app-card" style={{ padding: 20 }}>
          <div style={cardTitle}>{d.surT}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DELIVERY_MODES.map((m) => {
              const s = cfg.surcharges?.[m] || {}
              return (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 140, fontSize: 14, fontWeight: 500, color: '#10233F' }}>
                    <span style={{ color: '#6C82A6', display: 'flex' }}><DeliveryIcon mode={m} size={18} /></span>
                    {d.delivery[m]}
                  </span>
                  <select value={s.type || 'percent'} onChange={(e) => setSur(m, 'type', e.target.value)}
                    style={{ ...inputSm, width: 90, cursor: 'pointer' }}>
                    <option value="percent">%</option>
                    <option value="fixed">$</option>
                  </select>
                  <input inputMode="decimal" value={s.value ?? ''} placeholder="0"
                    onChange={(e) => setSur(m, 'value', num(e.target.value))} style={{ ...inputSm, width: 90, textAlign: 'right' }} />
                </div>
              )
            })}
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 12, color: '#8B9DBA', lineHeight: 1.6 }}>{d.surHint}</p>
        </div>

        {/* Rates per service */}
        <div className="app-card" style={{ padding: 20, gridColumn: '1 / -1' }}>
          <div style={cardTitle}>{d.ratesT}</div>
          <div className="app-table-scroll">
            <div className="app-table" style={{ minWidth: 560 }}>
              <div className="app-table-head" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
                <span>{d.f.service}</span>
                <span>{d.f.base}</span>
                <span>{d.f.perLb}</span>
              </div>
              {services.map((svc) => {
                const r = cfg.service_rates?.[svc] || {}
                return (
                  <div key={svc} className="app-table-row" style={{ gridTemplateColumns: '1.4fr 1fr 1fr', alignItems: 'center' }}>
                    <span className="app-table-text" style={{ fontWeight: 600 }}>{svc}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#8B9DBA' }}>$</span>
                      <input inputMode="decimal" value={r.base ?? ''} placeholder="0.00"
                        onChange={(e) => setRate(svc, 'base', num(e.target.value))} style={{ ...inputSm, width: 100 }} />
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#8B9DBA' }}>$</span>
                      <input inputMode="decimal" value={r.per_lb ?? ''} placeholder="0.00"
                        onChange={(e) => setRate(svc, 'per_lb', num(e.target.value))} style={{ ...inputSm, width: 100 }} />
                    </span>
                  </div>
                )
              })}
            </div>
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
