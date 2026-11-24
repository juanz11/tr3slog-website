import React from 'react'
import { api } from '../api'

const T = {
  es: {
    title: 'Contratos de empresa',
    subtitle: 'Cupos de envíos contratados por clientes ejecutivos.',
    loading: 'Cargando…',
    newContract: 'Nuevo contrato',
    pendingRequests: 'Solicitudes pendientes',
    companies: 'Empresas',
    contracts: 'Contratos',
    empty: 'No hay contratos todavía.',
    company: 'Empresa',
    owner: 'Propietario',
    members: 'Miembros',
    code: 'Código',
    quota: 'Cupo',
    used: 'Usados',
    remaining: 'Disponibles',
    period: 'Vigencia',
    rate: 'Tarifa/envío',
    status: 'Estado',
    requestedBy: 'Solicitado por',
    approve: 'Aprobar',
    reject: 'Rechazar',
    addQuota: 'Añadir cupo',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    notes: 'Notas',
    quotaPh: 'Cupo a aprobar',
    extraPh: 'Cupo extra',
    st: { active: 'Activo', pending: 'Pendiente', suspended: 'Suspendido', cancelled: 'Cancelado', expired: 'Vencido' },
    f: {
      company_name: 'Nombre de la empresa *',
      tax_id: 'RNC / Tax ID',
      owner_email: 'Email del propietario (debe existir)',
      contract_name: 'Nombre del contrato',
      shipment_quota: 'Envíos contratados *',
      rate_per_shipment: 'Tarifa por envío ($)',
      starts_at: 'Inicio',
      ends_at: 'Fin',
      notes: 'Notas',
    },
    reqQuota: 'Cupo solicitado',
    daysLeft: 'días',
    noEnd: 'Sin fin',
    expiredTag: 'Vencido',
    approveTitle: 'Aprobar solicitud',
  },
  en: {
    title: 'Company contracts',
    subtitle: 'Shipment quotas contracted by executive clients.',
    loading: 'Loading…',
    newContract: 'New contract',
    pendingRequests: 'Pending requests',
    companies: 'Companies',
    contracts: 'Contracts',
    empty: 'No contracts yet.',
    company: 'Company',
    owner: 'Owner',
    members: 'Members',
    code: 'Code',
    quota: 'Quota',
    used: 'Used',
    remaining: 'Available',
    period: 'Validity',
    rate: 'Rate/shipment',
    status: 'Status',
    requestedBy: 'Requested by',
    approve: 'Approve',
    reject: 'Reject',
    addQuota: 'Add quota',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    notes: 'Notes',
    quotaPh: 'Quota to approve',
    extraPh: 'Extra quota',
    st: { active: 'Active', pending: 'Pending', suspended: 'Suspended', cancelled: 'Cancelled', expired: 'Expired' },
    f: {
      company_name: 'Company name *',
      tax_id: 'Tax ID',
      owner_email: 'Owner email (must exist)',
      contract_name: 'Contract name',
      shipment_quota: 'Contracted shipments *',
      rate_per_shipment: 'Rate per shipment ($)',
      starts_at: 'Start',
      ends_at: 'End',
      notes: 'Notes',
    },
    reqQuota: 'Requested quota',
    daysLeft: 'days',
    noEnd: 'No end',
    expiredTag: 'Expired',
    approveTitle: 'Approve request',
  },
  'zh-CN': {
    title: '公司合同',
    subtitle: '执行客户签订的运单额度。',
    loading: '加载中…',
    newContract: '新建合同',
    pendingRequests: '待处理申请',
    companies: '公司',
    contracts: '合同',
    empty: '暂无合同。',
    company: '公司',
    owner: '所有者',
    members: '成员',
    code: '代码',
    quota: '额度',
    used: '已用',
    remaining: '可用',
    period: '有效期',
    rate: '单价',
    status: '状态',
    requestedBy: '申请人',
    approve: '批准',
    reject: '拒绝',
    addQuota: '增加额度',
    edit: '编辑',
    save: '保存',
    cancel: '取消',
    notes: '备注',
    quotaPh: '批准额度',
    extraPh: '额外额度',
    st: { active: '有效', pending: '待处理', suspended: '已暂停', cancelled: '已取消', expired: '已过期' },
    f: {
      company_name: '公司名称 *',
      tax_id: '税号',
      owner_email: '所有者邮箱（须已存在）',
      contract_name: '合同名称',
      shipment_quota: '合同运单数 *',
      rate_per_shipment: '每单运费 ($)',
      starts_at: '开始',
      ends_at: '结束',
      notes: '备注',
    },
    reqQuota: '申请额度',
    daysLeft: '天',
    noEnd: '无截止',
    expiredTag: '已过期',
    approveTitle: '批准申请',
  },
}

const card = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: 24 }
const inputStyle = { width: '100%', padding: '11px 13px', border: '1.5px solid #DCE6F5', borderRadius: 9, background: '#EEF4FC', color: '#001B45', fontSize: 13, outline: 'none', boxSizing: 'border-box' }
const btn = (bg = '#087CF0', fg = '#fff', border = 'none') => ({ padding: '9px 14px', borderRadius: 9, border, background: bg, color: fg, fontWeight: 600, fontSize: 13, cursor: 'pointer' })
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }

export default function Contracts({ lang, token }) {
  const t = T[lang] || T.es
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState({ company_name: '', tax_id: '', owner_email: '', contract_name: '', shipment_quota: '', rate_per_shipment: '', starts_at: '', ends_at: '', notes: '' })
  const [approveFor, setApproveFor] = React.useState(null)
  const [approveQuota, setApproveQuota] = React.useState('')
  const [extraFor, setExtraFor] = React.useState(null)
  const [extraQty, setExtraQty] = React.useState('')
  const [editFor, setEditFor] = React.useState(null)
  const [editForm, setEditForm] = React.useState({})
  const [busy, setBusy] = React.useState(false)

  const load = React.useCallback(async () => {
    try {
      const res = await api.getContracts(token)
      setData(res)
    } catch (e) { setError(e.message || 'error') }
  }, [token])

  React.useEffect(() => { load() }, [load])

  const contracts = data?.contracts || []
  const companies = data?.companies || []
  const pending = contracts.filter((c) => c.status === 'pending')
  const active = contracts.filter((c) => c.status !== 'pending')

  const run = async (fn) => {
    setBusy(true); setError('')
    try { await fn(); await load() } catch (err) { setError(err.message || 'error') }
    setBusy(false)
  }

  const submitCreate = (e) => {
    e.preventDefault()
    run(async () => {
      await api.createContract({
        company_name: form.company_name,
        tax_id: form.tax_id || undefined,
        owner_email: form.owner_email || undefined,
        contract_name: form.contract_name || undefined,
        shipment_quota: Number(form.shipment_quota),
        rate_per_shipment: form.rate_per_shipment === '' ? undefined : Number(form.rate_per_shipment),
        starts_at: form.starts_at || undefined,
        ends_at: form.ends_at || undefined,
        notes: form.notes || undefined,
      }, token)
      setShowForm(false)
      setForm({ company_name: '', tax_id: '', owner_email: '', contract_name: '', shipment_quota: '', rate_per_shipment: '', starts_at: '', ends_at: '', notes: '' })
    })
  }

  const statusBadge = (c) => {
    const expired = c.status === 'active' && c.expired
    const key = expired ? 'expired' : c.status
    const colors = { active: ['#E7F6EC', '#0F5F36'], pending: ['#FFF3D6', '#8A6300'], suspended: ['#FFF3D6', '#8A6300'], cancelled: ['#FDECEC', '#B91C1C'], expired: ['#FDECEC', '#B91C1C'] }
    const [bg, fg] = colors[key] || ['#EEF4FC', '#10233F']
    return <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: bg, color: fg }}>{t.st[key] || key}</span>
  }

  const pct = (c) => Math.min(100, Math.round((c.used / Math.max(1, c.shipment_quota)) * 100))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001B45', margin: '0 0 4px' }}>{t.title}</h1>
          <div style={{ color: '#6C82A6', fontSize: 14 }}>{t.subtitle}</div>
        </div>
        <button onClick={() => setShowForm((v) => !v)} style={btn(showForm ? '#EEF4FC' : '#001B45', showForm ? '#001B45' : '#fff', showForm ? '1.5px solid #DCE6F5' : 'none')}>
          {showForm ? t.cancel : `+ ${t.newContract}`}
        </button>
      </div>

      {error && <div style={{ background: '#FDECEC', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>{error}</div>}
      {!data && !error && <div style={{ color: '#6C82A6' }}>{t.loading}</div>}

      {showForm && (
        <form onSubmit={submitCreate} style={{ ...card, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
          {Object.entries(t.f).map(([k, label]) => (
            <div key={k}>
              <label style={labelStyle}>{label}</label>
              <input
                required={k === 'company_name' || k === 'shipment_quota'}
                type={k.includes('at') ? 'date' : (k === 'shipment_quota' || k === 'rate_per_shipment' ? 'number' : 'text')}
                step={k === 'rate_per_shipment' ? '0.01' : undefined}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                style={inputStyle}
              />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={busy} style={{ ...btn(), opacity: busy ? .6 : 1 }}>{busy ? '…' : t.save}</button>
          </div>
        </form>
      )}

      {pending.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 700, color: '#8A6300', marginBottom: 12 }}>{t.pendingRequests} ({pending.length})</div>
          {pending.map((c) => (
            <div key={c.id} style={{ borderTop: '1px solid #EEF4FC', padding: '14px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, color: '#001B45' }}>{c.company?.name} <span style={{ color: '#8B9DBA', fontWeight: 400, fontSize: 13 }}>{c.code}</span></div>
                  <div style={{ fontSize: 13, color: '#6C82A6' }}>
                    {c.requested_by?.name} ({c.requested_by?.email}) · {t.reqQuota}: <b>{c.requested_quota}</b>
                    {c.ends_at ? ` · ${t.period}: ${c.starts_at} → ${c.ends_at}` : ''}
                    {c.notes ? ` · ${c.notes}` : ''}
                  </div>
                </div>
                {approveFor === c.id ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="number" min="1" placeholder={t.quotaPh} value={approveQuota} onChange={(e) => setApproveQuota(e.target.value)} style={{ ...inputStyle, width: 140 }} />
                    <button style={btn()} disabled={busy} onClick={() => run(async () => { await api.approveContract(c.id, { shipment_quota: Number(approveQuota) || undefined }, token); setApproveFor(null); setApproveQuota('') })}>{t.approve}</button>
                    <button style={btn('#EEF4FC', '#10233F', '1.5px solid #DCE6F5')} onClick={() => { setApproveFor(null); setApproveQuota('') }}>{t.cancel}</button>
                  </div>
                ) : (
                  <>
                    <button style={btn()} disabled={busy} onClick={() => { setApproveFor(c.id); setApproveQuota(String(c.requested_quota || '')) }}>{t.approve}</button>
                    <button style={btn('#FDECEC', '#B91C1C', '1.5px solid rgba(192,57,43,.4)')} disabled={busy} onClick={() => run(() => api.rejectContract(c.id, token))}>{t.reject}</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={card}>
        <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 14 }}>{t.contracts} ({active.length})</div>
        {data && active.length === 0 && <div style={{ color: '#6C82A6', fontSize: 14 }}>{t.empty}</div>}
        {active.map((c) => (
          <div key={c.id} style={{ borderTop: '1px solid #EEF4FC', padding: '14px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 700, color: '#001B45' }}>{c.company?.name} <span style={{ color: '#8B9DBA', fontWeight: 400, fontSize: 13 }}>{c.code}{c.name ? ` · ${c.name}` : ''}</span></div>
                <div style={{ fontSize: 13, color: '#6C82A6' }}>
                  {t.period}: {c.starts_at || '—'} → {c.ends_at || t.noEnd}
                  {c.rate_per_shipment != null ? ` · ${t.rate}: $${c.rate_per_shipment}` : ''}
                  {c.requested_by ? ` · ${t.requestedBy}: ${c.requested_by.name}` : ''}
                </div>
              </div>
              {statusBadge(c)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8B9DBA', marginBottom: 4 }}>
                  <span>{t.used}: <b style={{ color: '#001B45' }}>{c.used}</b> / {c.shipment_quota}</span>
                  <span>{t.remaining}: <b style={{ color: '#001B45' }}>{c.remaining}</b></span>
                </div>
                <div style={{ height: 8, borderRadius: 100, background: '#EEF4FC', overflow: 'hidden' }}>
                  <div style={{ width: `${pct(c)}%`, height: '100%', background: pct(c) >= 100 ? '#C0392B' : pct(c) >= 80 ? '#D99A00' : '#0F5F36' }} />
                </div>
              </div>
              {extraFor === c.id ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" min="1" placeholder={t.extraPh} value={extraQty} onChange={(e) => setExtraQty(e.target.value)} style={{ ...inputStyle, width: 130 }} />
                  <button style={btn()} disabled={busy} onClick={() => run(async () => { await api.addContractQuota(c.id, Number(extraQty), token); setExtraFor(null); setExtraQty('') })}>{t.save}</button>
                  <button style={btn('#EEF4FC', '#10233F', '1.5px solid #DCE6F5')} onClick={() => setExtraFor(null)}>{t.cancel}</button>
                </div>
              ) : (
                <>
                  <button style={btn('#E8F0FE', '#001B45', '1.5px solid #C9DCF5')} disabled={busy} onClick={() => setExtraFor(c.id)}>{t.addQuota}</button>
                  <button style={btn('#EEF4FC', '#10233F', '1.5px solid #DCE6F5')} onClick={() => { setEditFor(editFor === c.id ? null : c.id); setEditForm({ shipment_quota: c.shipment_quota, rate_per_shipment: c.rate_per_shipment ?? '', ends_at: c.ends_at || '', status: c.status, notes: c.notes || '' }) }}>{editFor === c.id ? t.cancel : t.edit}</button>
                </>
              )}
            </div>
            {editFor === c.id && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginTop: 12, padding: 14, background: '#F6FAFF', borderRadius: 10 }}>
                <div><label style={labelStyle}>{t.quota}</label><input type="number" min="1" value={editForm.shipment_quota} onChange={(e) => setEditForm({ ...editForm, shipment_quota: e.target.value })} style={inputStyle} /></div>
                <div><label style={labelStyle}>{t.rate}</label><input type="number" step="0.01" min="0" value={editForm.rate_per_shipment} onChange={(e) => setEditForm({ ...editForm, rate_per_shipment: e.target.value })} style={inputStyle} /></div>
                <div><label style={labelStyle}>{t.f.ends_at}</label><input type="date" value={editForm.ends_at} onChange={(e) => setEditForm({ ...editForm, ends_at: e.target.value })} style={inputStyle} /></div>
                <div><label style={labelStyle}>{t.status}</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} style={inputStyle}>
                    {['active', 'suspended', 'cancelled'].map((s) => <option key={s} value={s}>{t.st[s]}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button style={btn()} disabled={busy} onClick={() => run(async () => {
                    await api.updateContract(c.id, {
                      shipment_quota: Number(editForm.shipment_quota) || undefined,
                      rate_per_shipment: editForm.rate_per_shipment === '' ? null : Number(editForm.rate_per_shipment),
                      ends_at: editForm.ends_at || null,
                      status: editForm.status,
                      notes: editForm.notes || undefined,
                    }, token)
                    setEditFor(null)
                  })}>{t.save}</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {companies.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 12 }}>{t.companies} ({companies.length})</div>
          {companies.map((co) => (
            <div key={co.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px solid #EEF4FC', fontSize: 14, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: '#001B45', minWidth: 200 }}>{co.name}</span>
              <span style={{ color: '#6C82A6' }}>{co.tax_id || '—'}</span>
              <span style={{ color: '#6C82A6' }}>{co.owner ? `${co.owner.name} · ${co.owner.email}` : '—'}</span>
              <span style={{ color: '#8B9DBA' }}>{co.members_count} {t.members.toLowerCase()} · {co.contracts_count} {t.contracts.toLowerCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
