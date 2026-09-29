import React from 'react'
import { api } from '../api'
import { Pagination, usePagination, usePolling } from './Shared'

const STATUS_COLORS = {
  active: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  pending: { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  suspended: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

const FILTER_KEYS = ['all', 'active', 'pending', 'suspended']

export default function Users({ app, lang, token, currentUser }) {
  const d = app.users
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState('all')
  const [busy, setBusy] = React.useState(null)
  const [notice, setNotice] = React.useState('')

  const fetchUsers = React.useCallback(async (isPoll) => {
    if (!token) return
    if (!isPoll) setLoading(true)
    try {
      const data = await api.getUsers(token)
      const list = Array.isArray(data) ? data : data.users || data.data || []
      setUsers(list)
      setError('')
    } catch (e) {
      if (!isPoll) setError(e.message || d.error)
    } finally {
      if (!isPoll) setLoading(false)
    }
  }, [token, d.error])

  usePolling(fetchUsers, 30000)

  const statusOf = (u) => u.status || 'active'
  const roleNames = (u) => (u.roles || []).map((r) => r.display_name || r.name).join(', ') || '—'

  const filtered = users.filter((u) => {
    if (filter !== 'all' && statusOf(u) !== filter) return false
    const q = query.trim().toLowerCase()
    return !q || [u.name, u.email, u.phone, u.company, roleNames(u)]
      .some((v) => String(v || '').toLowerCase().includes(q))
  })

  const filterCounts = FILTER_KEYS.map((key) => ({
    key,
    count: key === 'all' ? users.length : users.filter((u) => statusOf(u) === key).length,
  }))

  const pager = usePagination(filtered, 10, `${filter}|${query}`)

  const toggleStatus = async (u) => {
    const next = statusOf(u) === 'suspended' ? 'active' : 'suspended'
    setBusy(u.id)
    setNotice('')
    try {
      const res = await api.updateUserStatus(u.id, next, token)
      const updated = res?.user || { ...u, status: next }
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...updated } : x)))
      setNotice(next === 'suspended' ? d.blocked : d.unblocked)
    } catch (e) {
      setError(e.message || d.error)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="app-h1" style={{ marginBottom: 8 }}>{d.title}</h1>
        <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch' }}>{d.sub}</p>
      </div>

      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}
      {notice && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#F1FAF5', color: '#0F5F36', fontSize: 14, marginBottom: 20 }}>
          {notice}
        </div>
      )}

      <div className="app-card">
        <div className="app-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="app-card-title">{d.listTitle}</span>
        </div>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={d.searchPh}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#001B45' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTER_KEYS.map((key) => {
              const on = filter === key
              const count = filterCounts.find((c) => c.key === key)?.count || 0
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 14px', border: `1.5px solid ${on ? '#001B45' : '#DCE6F5'}`,
                    borderRadius: 100, background: on ? '#001B45' : '#fff',
                    color: on ? '#fff' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    opacity: count === 0 && !on ? .45 : 1,
                  }}
                >
                  <span>{d.filters[key]}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: on ? 'rgba(255,255,255,.22)' : '#EEF4FC', color: on ? '#fff' : '#6C82A6' }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="app-table-scroll">
          <div className="app-table" style={{ minWidth: 880 }}>
            <div className="app-table-head" style={{ gridTemplateColumns: '1.2fr 1.4fr 1fr 1.1fr .8fr .8fr' }}>
              {d.cols.map((col, i) => (<span key={i}>{col}</span>))}
            </div>
            {loading && filtered.length === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>{d.loading}</div>
            )}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>{d.empty}</div>
            )}
            {pager.pageItems.map((u) => {
              const st = statusOf(u)
              const stStyle = STATUS_COLORS[st] || STATUS_COLORS.active
              const isSelf = currentUser && u.id === currentUser.id
              const isAdminUser = (u.roles || []).some((r) => r.name === 'admin')
              const canToggle = !isSelf && !isAdminUser
              return (
                <div key={u.id} className="app-table-row" style={{ gridTemplateColumns: '1.2fr 1.4fr 1fr 1.1fr .8fr .8fr', alignItems: 'center' }}>
                  <span className="app-table-id" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</span>
                  <span className="app-table-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                  <span className="app-table-text">{u.phone || '—'}</span>
                  <span className="app-table-text">{roleNames(u)}</span>
                  <span className="app-status" style={{ background: stStyle.bg, color: stStyle.fg }}>{d.statuses[st] || st}</span>
                  <span style={{ justifySelf: 'end' }}>
                    {canToggle ? (
                      <button
                        disabled={busy === u.id}
                        onClick={() => toggleStatus(u)}
                        style={{
                          padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          border: st === 'suspended' ? '1.5px solid #137A45' : '1.5px solid #C0392B',
                          background: st === 'suspended' ? 'rgba(19,122,69,.08)' : '#fff',
                          color: st === 'suspended' ? '#0F5F36' : '#A93226',
                          opacity: busy === u.id ? .6 : 1,
                        }}
                      >
                        {busy === u.id ? '…' : st === 'suspended' ? d.unblock : d.block}
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#B6C4DA' }}>—</span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Pagination pager={pager} labels={app.pager} />
      </div>
    </div>
  )
}
