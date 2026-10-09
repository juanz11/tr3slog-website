import React from 'react'
import { api } from '../api'
import { usePolling } from './Shared'

const I18N = {
  es: {
    title: 'Roles del sistema',
    sub: 'Roles disponibles y las funcionalidades que cada uno habilita en la plataforma.',
    loading: 'Cargando roles…',
    empty: 'No hay roles registrados.',
    error: 'No se pudieron cargar los roles.',
    retry: 'Reintentar',
    users: 'usuarios',
    perms: 'permisos',
    noPerms: 'Sin permisos asignados',
    modules: {
      users: 'Usuarios',
      roles: 'Roles y permisos',
      quotes: 'Cotizaciones',
      shipments: 'Envíos',
      dispatch: 'Despacho',
      reports: 'Reportes',
      pricing: 'Precios',
      audit: 'Auditoría',
      incidents: 'Incidencias',
      finance: 'Finanzas',
      hub: 'Hub / Almacén',
    },
  },
  en: {
    title: 'System roles',
    sub: 'Available roles and the capabilities each one enables on the platform.',
    loading: 'Loading roles…',
    empty: 'No roles registered.',
    error: 'Could not load roles.',
    retry: 'Retry',
    users: 'users',
    perms: 'permissions',
    noPerms: 'No permissions assigned',
    modules: {
      users: 'Users',
      roles: 'Roles & permissions',
      quotes: 'Quotes',
      shipments: 'Shipments',
      dispatch: 'Dispatch',
      reports: 'Reports',
      pricing: 'Pricing',
      audit: 'Audit',
      incidents: 'Incidents',
      finance: 'Finance',
      hub: 'Hub / Warehouse',
    },
  },
  'zh-CN': {
    title: '系统角色',
    sub: '可用角色及每个角色在平台上启用的功能。',
    loading: '正在加载角色…',
    empty: '暂无角色。',
    error: '无法加载角色。',
    retry: '重试',
    users: '个用户',
    perms: '项权限',
    noPerms: '未分配权限',
    modules: {
      users: '用户',
      roles: '角色与权限',
      quotes: '报价',
      shipments: '货运',
      dispatch: '调度',
      reports: '报表',
      pricing: '定价',
      audit: '审计',
      incidents: '事故',
      finance: '财务',
      hub: '枢纽/仓库',
    },
  },
}

export default function Roles({ lang, token }) {
  const d = I18N[lang] || I18N.es
  const [roles, setRoles] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  const fetchRoles = React.useCallback(async (isPoll) => {
    if (!token) return
    if (!isPoll) setLoading(true)
    try {
      const data = await api.getRoles(token)
      setRoles(data?.roles || (Array.isArray(data) ? data : data?.data || []))
      setError('')
    } catch (e) {
      if (!isPoll) setError(e.message || d.error)
    } finally {
      if (!isPoll) setLoading(false)
    }
  }, [token, d.error])

  usePolling(fetchRoles, 60000)

  const permsByModule = (perms) => {
    const groups = {}
    ;(perms || []).forEach((p) => {
      const mod = p.module || 'other'
      if (!groups[mod]) groups[mod] = []
      groups[mod].push(p)
    })
    return Object.entries(groups)
  }

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.title}</div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="app-h1" style={{ marginBottom: 8 }}>{d.title}</h1>
        <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch' }}>{d.sub}</p>
      </div>

      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => fetchRoles(false)} style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #C0392B', background: '#fff', color: '#A93226', fontWeight: 600, cursor: 'pointer' }}>{d.retry}</button>
        </div>
      )}

      {loading && roles.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#6C82A6' }}>{d.loading}</div>
      ) : roles.length === 0 ? (
        <div style={{ padding: 40, background: '#F6F9FD', borderRadius: 16, textAlign: 'center', color: '#6C82A6' }}>{d.empty}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {roles.map((r) => {
            const perms = r.permissions || []
            const groups = permsByModule(perms)
            return (
              <div key={r.id} style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #DCE6F5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#001B45' }}>{r.display_name || r.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: '#EEF4FC', color: '#6C82A6', textTransform: 'uppercase', letterSpacing: '.06em' }}>{r.name}</span>
                    <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'rgba(8,124,240,.1)', color: '#0768C9' }}>{r.users_count ?? 0} {d.users}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'rgba(19,122,69,.12)', color: '#0F5F36' }}>{perms.length} {d.perms}</span>
                    </span>
                  </div>
                  {r.description && (
                    <p style={{ margin: '10px 0 0', fontSize: 13, color: '#6C82A6', lineHeight: 1.6 }}>{r.description}</p>
                  )}
                </div>
                <div style={{ padding: '14px 20px 18px' }}>
                  {groups.length === 0 ? (
                    <span style={{ fontSize: 13, color: '#B6C4DA' }}>{d.noPerms}</span>
                  ) : groups.map(([mod, list]) => (
                    <div key={mod} style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8B9DBA', marginBottom: 7 }}>
                        {d.modules[mod] || mod}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {list.map((p) => (
                          <span key={p.id || p.name} title={p.description || ''} style={{ fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 8, background: '#EEF4FC', color: '#10233F', border: '1px solid #DCE6F5' }}>
                            {p.display_name || p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
