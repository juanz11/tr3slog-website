import React from 'react'

const FIELD_KEYS = ['name', 'address', 'city', 'zip', 'contact', 'phone', 'instructions']
const SPAN2 = ['address', 'instructions']
const REQUIRED = ['name', 'address', 'city', 'zip', 'contact']

function initialPrimary(rows) {
  const found = rows.find((r) => r.primary)
  return found ? found.id : null
}

export default function Addresses({ app }) {
  const a = app.addr
  const [rows, setRows] = React.useState(() =>
    a.rows.map((r, i) => ({ ...r, id: `r${i}` }))
  )
  const [primaryId, setPrimaryId] = React.useState(() => initialPrimary(rows))
  const [formMode, setFormMode] = React.useState(null)
  const [formVals, setFormVals] = React.useState({ type: 0 })
  const [err, setErr] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [removeId, setRemoveId] = React.useState(null)

  const formOpen = formMode !== null
  const formTitle = formMode === 'new' ? a.newT : a.editT

  const pendingRow = removeId ? rows.find((r) => r.id === removeId) : null

  const openNew = () => {
    setFormMode('new')
    setFormVals({ name: '', address: '', city: '', zip: '', contact: '', phone: '', instructions: '', type: 0 })
    setErr(false)
    setSaved(false)
    setRemoveId(null)
  }

  const openEdit = (row) => {
    setFormMode(row.id)
    setFormVals({
      name: row.n,
      address: row.a,
      city: row.city || '',
      zip: row.zip || '',
      contact: row.c,
      phone: row.phone || '',
      instructions: row.ins || '',
      type: row.type || 0,
    })
    setErr(false)
    setSaved(false)
    setRemoveId(null)
  }

  const save = () => {
    const missing = REQUIRED.some((k) => !(formVals[k] || '').trim())
    if (missing) return setErr(true)

    const row = {
      id: formMode === 'new' ? `x${Date.now()}` : formMode,
      n: formVals.name,
      a: formVals.address,
      c: formVals.contact,
      type: formVals.type || 0,
      city: formVals.city,
      zip: formVals.zip,
      phone: formVals.phone,
      ins: formVals.instructions,
      primary: false,
    }

    if (formMode === 'new') {
      if (rows.length === 0) row.primary = true
      setRows((prev) => [...prev, row])
      if (rows.length === 0) setPrimaryId(row.id)
    } else {
      setRows((prev) => prev.map((r) => (r.id === formMode ? { ...r, ...row, primary: r.primary } : r)))
    }

    setFormMode(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const doRemove = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    setRemoveId(null)
    setSaved(false)
  }

  const setPrimary = (row) => setPrimaryId(row.id)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{
          fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
          fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: 0, color: '#001B45',
        }}>{a.title}</h1>
        <button onClick={openNew} style={{
          marginLeft: 'auto', padding: '13px 20px', background: '#fff',
          border: '1.5px solid #DCE6F5', borderRadius: 11, color: '#001B45',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>{a.add}</button>
      </div>

      {saved && (
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start', padding: 16,
          border: '1px solid #C6E6D4', background: '#F1FAF5', borderRadius: 12,
          fontSize: 14, color: '#0F5F36', marginBottom: 16,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#137A45" strokeWidth="1.9" style={{ flex: '0 0 auto' }}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.5 2.5 4.5-5" />
          </svg>
          {a.saved}
        </div>
      )}

      {pendingRow && (
        <div onClick={() => setRemoveId(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,27,69,.55)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 420, padding: 28,
            boxShadow: '0 20px 60px rgba(0,27,69,.25)', border: '1px solid #DCE6F5',
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(217,154,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D99A00" strokeWidth="1.8">
                  <path d="M12 3l9 16H3z" />
                  <path d="M12 9v5M12 17v.1" />
                </svg>
              </div>
              <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 18, color: '#001B45' }}>{a.confirmRemove}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#6C82A6', marginTop: 8 }}>{a.confirmSub}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setRemoveId(null)} style={{
                flex: 1, padding: '14px 20px', background: '#fff', border: '1.5px solid #DCE6F5', borderRadius: 11,
                color: '#10233F', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{a.cancelBtn}</button>
              <button onClick={() => doRemove(removeId)} style={{
                flex: 1, padding: '14px 20px', background: '#C0392B', border: 'none', borderRadius: 11,
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{a.removeBtn}</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{
            fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
            fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase',
          }}>{formTitle}</div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 10 }}>{a.typeT}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {a.types.map((t, i) => {
                const on = (formVals.type || 0) === i
                return (
                  <button key={i} onClick={() => setFormVals((v) => ({ ...v, type: i }))} style={{
                    padding: '11px 15px', border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                    borderRadius: 100, background: on ? 'rgba(8,124,240,.08)' : '#fff',
                    color: on ? '#0768C9' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{t}</button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FIELD_KEYS.map((k) => (
              <label key={k} style={{ gridColumn: SPAN2.includes(k) ? 'span 2' : 'span 1', display: 'block' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6C82A6', marginBottom: 8 }}>
                  {a.f[k]}
                </span>
                <input
                  value={formVals[k] || ''}
                  onChange={(e) => { setFormVals((v) => ({ ...v, [k]: e.target.value })); setErr(false) }}
                  placeholder={a.f[k]}
                  style={{
                    width: '100%', padding: '14px 15px',
                    border: `1.5px solid ${err && REQUIRED.includes(k) && !(formVals[k] || '').trim() ? '#C0392B' : '#DCE6F5'}`,
                    borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
                  }}
                />
              </label>
            ))}
          </div>

          {err && (
            <div role="alert" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 500, color: '#C0392B' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.2v.1" /></svg>
              {(app.create && app.create.errStep) ? app.create.errStep : 'Complete los campos obligatorios.'}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', border: '1px dashed #DCE6F5', background: '#EEF4FC', borderRadius: 12, padding: '14px 16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0768C9" strokeWidth="1.8" style={{ flex: '0 0 auto', marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.8v.1" /></svg>
            <span style={{ fontSize: 13, lineHeight: 1.6, color: '#25456E' }}>{a.localNote}</span>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setFormMode(null)} style={{
              padding: '14px 20px', background: '#fff', border: '1.5px solid #DCE6F5',
              borderRadius: 11, color: '#10233F', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{a.cancelBtn}</button>
            <button onClick={save} style={{
              marginLeft: 'auto', padding: '14px 22px', background: '#087CF0',
              border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{a.save}</button>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 760 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 0.6fr 1.1fr 1.2fr',
              gap: 12, padding: '14px 22px', fontSize: 11, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#6C82A6',
            }}>
              {a.cols.map((col, i) => <span key={i}>{col}</span>)}
            </div>

            {rows.length === 0 ? (
              <div style={{ padding: '24px 22px', textAlign: 'center', color: '#6C82A6', fontSize: 15, borderTop: '1px solid #E3EBF7' }}>
                {a.empty}
              </div>
            ) : rows.map((r, i) => {
              const isPrimary = r.id === primaryId
              const removing = r.id === removeId
              return (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 0.6fr 1.1fr 1.2fr',
                  gap: 12, padding: '16px 22px', borderTop: '1px solid #E3EBF7', alignItems: 'center',
                  background: removing ? 'rgba(217,154,0,.05)' : 'transparent',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 600, fontSize: 13, color: '#001B45' }}>{r.n}</div>
                    {isPrimary && (
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#0768C9', marginTop: 3 }}>{a.primary}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: '#10233F' }}>{r.a}</span>
                  <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: '#EEF4FC', color: '#10233F', justifySelf: 'start' }}>{a.types[r.type]}</span>
                  <span style={{ fontSize: 13, color: '#10233F' }}>{r.c}</span>
                  <div style={{ display: 'flex', gap: 14, justifySelf: 'end', whiteSpace: 'nowrap' }}>
                    <button onClick={() => setPrimary(r)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: isPrimary ? '#6C82A6' : '#087CF0' }}>{isPrimary ? a.primary : a.setPrimary}</button>
                    <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#6C82A6' }}>{a.edit}</button>
                    <button onClick={() => setRemoveId(r.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#A93226' }}>{a.removeBtn}</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
