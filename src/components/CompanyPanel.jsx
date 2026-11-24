import React from 'react'
import { api } from '../api'

const T = {
  es: {
    contractTitle: 'Contrato de envíos',
    loading: 'Cargando…',
    noCompany: 'Tu cuenta aún no está ligada a una empresa. Solicita un contrato para empezar.',
    requestBtn: 'Solicitar contrato',
    quotaLabel: 'Cantidad de envíos',
    nameLabel: 'Nombre del contrato (opcional)',
    endsLabel: 'Vigencia hasta (opcional)',
    notesLabel: 'Notas (opcional)',
    sendRequest: 'Enviar solicitud',
    pendingReq: 'Solicitud pendiente',
    pendingSub: 'El administrador revisará tu solicitud de cupo.',
    used: 'Usados',
    remaining: 'Disponibles',
    quota: 'Cupo total',
    ends: 'Vigencia',
    daysLeft: 'días restantes',
    noEnd: 'Sin fecha de fin',
    rate: 'Tarifa por envío',
    st: { active: 'Activo', exhausted: 'Cupo agotado', expired: 'Vencido', suspended: 'Suspendido', request: 'Solicitud pendiente', none: 'Sin contrato' },
    teamTitle: 'Equipo de la empresa',
    inviteTitle: 'Invitar agente',
    namePh: 'Nombre completo',
    emailPh: 'correo@empresa.com',
    inviteBtn: 'Enviar invitación',
    invitedOk: 'Invitación enviada por correo.',
    pendingInvites: 'Invitaciones pendientes',
    cancel: 'Cancelar',
    suspend: 'Suspender',
    reactivate: 'Reactivar',
    remove: 'Quitar',
    owner: 'Propietario',
    agent: 'Agente',
    you: 'tú',
    emptyTeam: 'Aún no hay miembros. Invita a tu primer agente.',
    confirmRemove: '¿Quitar el acceso de este miembro? Perderá el acceso al contrato.',
  },
  en: {
    contractTitle: 'Shipment contract',
    loading: 'Loading…',
    noCompany: 'Your account is not linked to a company yet. Request a contract to get started.',
    requestBtn: 'Request contract',
    quotaLabel: 'Number of shipments',
    nameLabel: 'Contract name (optional)',
    endsLabel: 'Valid until (optional)',
    notesLabel: 'Notes (optional)',
    sendRequest: 'Send request',
    pendingReq: 'Request pending',
    pendingSub: 'The administrator will review your quota request.',
    used: 'Used',
    remaining: 'Available',
    quota: 'Total quota',
    ends: 'Validity',
    daysLeft: 'days left',
    noEnd: 'No end date',
    rate: 'Rate per shipment',
    st: { active: 'Active', exhausted: 'Quota exhausted', expired: 'Expired', suspended: 'Suspended', request: 'Request pending', none: 'No contract' },
    teamTitle: 'Company team',
    inviteTitle: 'Invite agent',
    namePh: 'Full name',
    emailPh: 'name@company.com',
    inviteBtn: 'Send invitation',
    invitedOk: 'Invitation sent by email.',
    pendingInvites: 'Pending invitations',
    cancel: 'Cancel',
    suspend: 'Suspend',
    reactivate: 'Reactivate',
    remove: 'Remove',
    owner: 'Owner',
    agent: 'Agent',
    you: 'you',
    emptyTeam: 'No members yet. Invite your first agent.',
    confirmRemove: 'Remove this member\'s access? They will lose contract access.',
  },
  'zh-CN': {
    contractTitle: '运单合同',
    loading: '加载中…',
    noCompany: '您的账户尚未关联公司。请申请合同以开始使用。',
    requestBtn: '申请合同',
    quotaLabel: '运单数量',
    nameLabel: '合同名称（可选）',
    endsLabel: '有效期至（可选）',
    notesLabel: '备注（可选）',
    sendRequest: '发送申请',
    pendingReq: '申请待审核',
    pendingSub: '管理员将审核您的额度申请。',
    used: '已使用',
    remaining: '可用',
    quota: '总额度',
    ends: '有效期',
    daysLeft: '天剩余',
    noEnd: '无截止日期',
    rate: '每单运费',
    st: { active: '有效', exhausted: '额度已用完', expired: '已过期', suspended: '已暂停', request: '申请待审核', none: '无合同' },
    teamTitle: '公司团队',
    inviteTitle: '邀请代理',
    namePh: '全名',
    emailPh: 'name@company.com',
    inviteBtn: '发送邀请',
    invitedOk: '邀请已通过邮件发送。',
    pendingInvites: '待处理邀请',
    cancel: '取消',
    suspend: '暂停',
    reactivate: '恢复',
    remove: '移除',
    owner: '所有者',
    agent: '代理',
    you: '您',
    emptyTeam: '暂无成员。邀请您的第一位代理。',
    confirmRemove: '移除此成员的访问权限？其将失去合同访问权。',
  },
}

const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#EEF4FC', color: '#001B45', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
const btnPrimary = { padding: '12px 18px', borderRadius: 10, border: 'none', background: '#087CF0', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }
const btnGhost = { padding: '9px 14px', borderRadius: 9, border: '1.5px solid #DCE6F5', background: '#fff', color: '#10233F', fontWeight: 600, fontSize: 13, cursor: 'pointer' }
const btnDanger = { padding: '9px 14px', borderRadius: 9, border: '1.5px solid rgba(192,57,43,.4)', background: '#FDECEC', color: '#B91C1C', fontWeight: 600, fontSize: 13, cursor: 'pointer' }
const card = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: 24 }

export default function CompanyPanel({ lang, token, tab, embedded }) {
  const t = T[lang] || T.es
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [form, setForm] = React.useState({ quota: '', name: '', ends_at: '', notes: '' })
  const [invite, setInvite] = React.useState({ name: '', email: '' })
  const [msg, setMsg] = React.useState('')

  const load = React.useCallback(async () => {
    try {
      const res = await api.getCompany(token)
      setData(res)
    } catch (e) {
      setError(e.message || 'error')
    }
  }, [token])

  React.useEffect(() => { load() }, [load])

  const contract = data?.contract
  const usage = data?.usage
  const state = data?.state
  const team = data?.team || []
  const invites = data?.pending_invitations || []

  const submitRequest = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg(''); setError('')
    try {
      await api.requestCompanyContract({
        quota: Number(form.quota),
        name: form.name || undefined,
        ends_at: form.ends_at || undefined,
        notes: form.notes || undefined,
      }, token)
      await load()
    } catch (err) {
      setError(err.message || 'error')
    }
    setBusy(false)
  }

  const sendInvite = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg(''); setError('')
    try {
      await api.inviteTeamMember({ name: invite.name, email: invite.email }, token)
      setMsg(t.invitedOk)
      setInvite({ name: '', email: '' })
      await load()
    } catch (err) {
      setError(err.message || 'error')
    }
    setBusy(false)
  }

  const act = async (fn, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return
    setError('')
    try { await fn(); await load() } catch (err) { setError(err.message || 'error') }
  }

  const pct = usage ? Math.min(100, Math.round((usage.used / Math.max(1, usage.quota)) * 100)) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>
      {!embedded && (
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001B45', margin: '0 0 4px' }}>{tab === 'team' ? t.teamTitle : t.contractTitle}</h1>
          {data?.company && <div style={{ color: '#6C82A6', fontSize: 14 }}>{data.company.name}{data.company.tax_id ? ` · ${data.company.tax_id}` : ''}</div>}
        </div>
      )}

      {error && <div style={{ background: '#FDECEC', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>{error}</div>}
      {msg && <div style={{ background: '#E7F6EC', color: '#0F5F36', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>{msg}</div>}

      {!data && !error && <div style={{ color: '#6C82A6' }}>{t.loading}</div>}

      {data && !data.company && (
        <div style={card}>
          <p style={{ color: '#10233F', margin: '0 0 16px' }}>{t.noCompany}</p>
          <RequestForm t={t} form={form} setForm={setForm} onSubmit={submitRequest} busy={busy} />
        </div>
      )}

      {data?.company && tab === 'contract' && (
        <>
          {state === 'none' && (
            <div style={card}>
              <p style={{ color: '#10233F', margin: '0 0 16px' }}>{t.noCompany}</p>
              <RequestForm t={t} form={form} setForm={setForm} onSubmit={submitRequest} busy={busy} />
            </div>
          )}

          {state === 'request' && contract && (
            <div style={{ ...card, borderColor: '#F0C36D', background: '#FFF9EC' }}>
              <div style={{ fontWeight: 700, color: '#8A6300' }}>{t.pendingReq}</div>
              <div style={{ color: '#6C82A6', fontSize: 13, marginTop: 4 }}>{t.pendingSub}</div>
              <div style={{ marginTop: 10, fontSize: 14, color: '#10233F' }}>
                {contract.code} · {contract.name || '—'} · <b>{contract.requested_quota}</b> envíos solicitados
              </div>
            </div>
          )}

          {usage && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700, color: '#001B45' }}>{usage.code}{contract?.name ? ` · ${contract.name}` : ''}</div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                  background: state === 'active' ? '#E7F6EC' : state === 'exhausted' ? '#FFF3D6' : '#FDECEC',
                  color: state === 'active' ? '#0F5F36' : state === 'exhausted' ? '#8A6300' : '#B91C1C',
                }}>
                  {t.st[state] || state}
                </span>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6C82A6', marginBottom: 6 }}>
                  <span>{t.used}: <b style={{ color: '#001B45' }}>{usage.used}</b></span>
                  <span>{t.remaining}: <b style={{ color: '#001B45' }}>{usage.remaining}</b></span>
                  <span>{t.quota}: <b style={{ color: '#001B45' }}>{usage.quota}</b></span>
                </div>
                <div style={{ height: 10, borderRadius: 100, background: '#EEF4FC', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#C0392B' : pct >= 80 ? '#D99A00' : '#0F5F36', transition: 'width .3s' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginTop: 18 }}>
                <div><div style={{ fontSize: 11, color: '#8B9DBA', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t.ends}</div><div style={{ fontWeight: 600, color: '#001B45', fontSize: 14 }}>{usage.ends_at ? new Date(usage.ends_at).toLocaleDateString() : t.noEnd}</div></div>
                <div><div style={{ fontSize: 11, color: '#8B9DBA', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t.daysLeft}</div><div style={{ fontWeight: 600, color: '#001B45', fontSize: 14 }}>{usage.days_left ?? '—'}</div></div>
                {contract?.requested_quota != null && <div><div style={{ fontSize: 11, color: '#8B9DBA', textTransform: 'uppercase', letterSpacing: '.08em' }}>Solicitado</div><div style={{ fontWeight: 600, color: '#001B45', fontSize: 14 }}>{contract.requested_quota}</div></div>}
              </div>
              {state === 'exhausted' && (
                <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: '#FFF3D6', color: '#8A6300', fontSize: 13 }}>
                  Agotaste el cupo del contrato. Contacta al administrador para ampliar la cuota antes de crear más envíos.
                </div>
              )}
              {(state === 'expired' || state === 'suspended') && (
                <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: '#FDECEC', color: '#B91C1C', fontSize: 13 }}>
                  {state === 'expired' ? 'El contrato venció.' : 'El contrato está suspendido.'} Contacta al administrador.
                </div>
              )}
            </div>
          )}

          {(state === 'active' || state === 'exhausted') && (
            <div style={card}>
              <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 12 }}>¿Necesitas más cupo?</div>
              <RequestForm t={t} form={form} setForm={setForm} onSubmit={submitRequest} busy={busy} compact />
              <div style={{ fontSize: 12, color: '#8B9DBA', marginTop: 8 }}>La solicitud crea un nuevo contrato pendiente de aprobación por el administrador.</div>
            </div>
          )}
        </>
      )}

      {data?.company && tab === 'team' && (
        <>
          <div style={card}>
            <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 14 }}>{t.inviteTitle}</div>
            <form onSubmit={sendInvite} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.namePh}</label>
                <input required value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.emailPh}</label>
                <input required type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} style={inputStyle} />
              </div>
              <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? .6 : 1 }}>{busy ? '…' : t.inviteBtn}</button>
            </form>
          </div>

          {invites.length > 0 && (
            <div style={card}>
              <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 10 }}>{t.pendingInvites}</div>
              {invites.map((i) => (
                <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid #EEF4FC' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#001B45', fontSize: 14 }}>{i.name}</div>
                    <div style={{ color: '#6C82A6', fontSize: 13 }}>{i.email}</div>
                  </div>
                  <button style={btnGhost} onClick={() => act(() => api.cancelTeamInvitation(i.id, token))}>{t.cancel}</button>
                </div>
              ))}
            </div>
          )}

          <div style={card}>
            <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 10 }}>{t.teamTitle}</div>
            {team.length === 0 && <div style={{ color: '#6C82A6', fontSize: 14 }}>{t.emptyTeam}</div>}
            {team.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: '1px solid #EEF4FC', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 600, color: '#001B45', fontSize: 14 }}>
                    {m.name} {m.is_me && <span style={{ color: '#8B9DBA', fontWeight: 400 }}>({t.you})</span>}
                  </div>
                  <div style={{ color: '#6C82A6', fontSize: 13 }}>{m.email}</div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: m.role === 'owner' ? '#E8F0FE' : '#EEF4FC', color: '#10233F',
                }}>
                  {m.role === 'owner' ? t.owner : t.agent}
                </span>
                {m.role !== 'owner' && !m.is_me && (
                  <>
                    <span style={{
                      padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                      background: m.status === 'active' ? '#E7F6EC' : '#FDECEC',
                      color: m.status === 'active' ? '#0F5F36' : '#B91C1C',
                    }}>
                      {m.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
                    <button style={btnGhost} onClick={() => act(() => api.setTeamMemberStatus(m.id, m.status === 'active' ? 'suspended' : 'active', token))}>
                      {m.status === 'active' ? t.suspend : t.reactivate}
                    </button>
                    <button style={btnDanger} onClick={() => act(() => api.removeTeamMember(m.id, token), t.confirmRemove)}>{t.remove}</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function RequestForm({ t, form, setForm, onSubmit, busy, compact }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(auto-fit,minmax(140px,1fr))' : '1fr 1fr', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.quotaLabel} *</label>
        <input required type="number" min="1" value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.nameLabel}</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.endsLabel}</label>
        <input type="date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.notesLabel}</label>
        <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={inputStyle} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? .6 : 1 }}>{busy ? '…' : t.sendRequest}</button>
      </div>
    </form>
  )
}
