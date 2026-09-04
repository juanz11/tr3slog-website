import React from 'react'
import { appI18n } from '../i18n-app'
import NavIcon from './NavIcon'
import ShipmentCreate from './ShipmentCreate'
import ShipmentsList from './ShipmentsList'
import Payments from './Payments'
import Addresses from './Addresses'
import Support from './Support'
import Quotes from './Quotes'
import Dispatch from './Dispatch'
import Drivers from './Drivers'
import Incidents from './Incidents'
import Profile from './Profile'
import { api } from '../api'

const STATUS_TONE = [
  { bg: '#EEF4FC', fg: '#10233F' },
  { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  { bg: 'rgba(217,154,0,.16)', fg: '#8A6300' },
  { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
]

const STATUS_COLORS = {
  pending: { bg: 'rgba(217,154,0,.12)', fg: '#8A6300' },
  processing: { bg: 'rgba(8,124,240,.1)', fg: '#0768C9' },
  approved: { bg: 'rgba(19,122,69,.12)', fg: '#0F5F36' },
  rejected: { bg: 'rgba(192,57,43,.1)', fg: '#A93226' },
}

export default function AppShell({ user, lang, langs, setLang, onLogout, onUserUpdate }) {
  const app = appI18n[lang] || appI18n.es
  const isAdmin = user?.roles?.some((r) => ['admin', 'operations'].includes(r.name))
  const nav = isAdmin ? app.navA : app.navC
  const navKeys = Object.keys(nav)
  const [activeKey, setActiveKey] = React.useState(navKeys[0])
  const [hquery, setHquery] = React.useState('')
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [token, setToken] = React.useState(null)
  const [pendingQuotes, setPendingQuotes] = React.useState(0)

  React.useEffect(() => {
    try {
      setToken(localStorage.getItem('tr3slog-token'))
    } catch (e) {}
  }, [])

  React.useEffect(() => {
    if (!token) return
    const fetchCount = async () => {
      try {
        const data = await api.getPendingQuotesCount(token)
        setPendingQuotes(data?.count ?? 0)
      } catch (e) {}
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [token])

  const accountInitials = (user?.name || 'US').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const accountName = user?.name || user?.email || 'Usuario'
  const accountRole = isAdmin ? app.shell.admin : app.shell.portal

  const [shipments, setShipments] = React.useState([])

  React.useEffect(() => {
    if (!token) return
    api.getShipments(token)
      .then((data) => setShipments(Array.isArray(data) ? data : data.data || []))
      .catch(() => setShipments([]))
  }, [token])

  const isDash = activeKey === navKeys[0]
  const isCreate = activeKey === 'create'
  const isShipments = activeKey === 'shipments'
  const isPayments = activeKey === 'payments'
  const isAddresses = activeKey === 'addresses'
  const isSupport = activeKey === 'support'
  const isQuotes = activeKey === 'quotes'
  const isDispatch = activeKey === 'dispatch'
  const isDrivers = activeKey === 'drivers'
  const isIncidents = activeKey === 'incidents'
  const isProfile = activeKey === 'profile'

  const Nav = ({ compact = false }) => (
    <nav className="app-nav">
      {navKeys.map((k) => {
        const on = k === activeKey
        return (
          <button
            key={k}
            onClick={() => { setActiveKey(k); setMobileOpen(false) }}
            className={`app-nav-item ${on ? 'on' : ''}`}
          >
            <NavIcon name={k} color={on ? '#fff' : '#6C82A6'} />
            <span>{nav[k]}</span>
          </button>
        )
      })}
    </nav>
  )

  const Langs = () => (
    <div className="app-langs">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className="app-lang-btn"
          style={{ background: l.bg, color: l.fg, borderColor: l.border }}
        >
          {l.label}
        </button>
      ))}
    </div>
  )

  const Sidebar = ({ mobile = false }) => (
    <>
      {!mobile && (
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', letterSpacing: '-.02em', display: 'flex', alignItems: 'center', gap: 3, margin: '6px 6px 0' }}>
          <span>TR3</span><span style={{ color: '#D99A00' }}>S</span><span>LOG</span>
        </div>
      )}
      {mobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 20, color: '#001B45', letterSpacing: '-.02em', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span>TR3</span><span style={{ color: '#D99A00' }}>S</span><span>LOG</span>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ marginLeft: 'auto', width: 40, height: 40, border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', cursor: 'pointer', color: '#001B45', fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>
      )}
      <div className="app-account" style={mobile ? { padding: 14 } : {}}>
        <span className="app-avatar" style={mobile ? { width: 40, height: 40, fontSize: 14 } : {}}>{accountInitials}</span>
        <div style={{ minWidth: 0 }}>
          <div className="app-account-name" style={mobile ? { fontSize: 14 } : {}}>{accountName}</div>
          <div className="app-account-role" style={mobile ? { fontSize: 12 } : {}}>{accountRole}</div>
        </div>
      </div>
      <Nav compact={mobile} />
      <div className="app-sidebar-foot" style={mobile ? { gap: 12, paddingTop: 16 } : {}}>
        <Langs />
        <button onClick={() => { onLogout(); setMobileOpen(false) }} className="app-signout" style={mobile ? { padding: 14, background: '#EEF4FC', color: '#001B45', borderRadius: 11 } : {}}>{app.shell.signout}</button>
      </div>
    </>
  )

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Sidebar />
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div className="app-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M20 20l-4.5-4.5"></path>
            </svg>
            <input
              value={hquery}
              onChange={(e) => setHquery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setActiveKey('shipments') } }}
              placeholder={app.shell.searchPh}
              aria-label={app.shell.searchHint}
            />
            <button onClick={() => { setActiveKey('shipments') }} className="app-search-btn">{app.shell.searchHint}</button>
          </div>
          {!isCreate && (
            <button onClick={() => setActiveKey('create')} style={{ marginLeft: 'auto', padding: '12px 18px', background: '#087CF0', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {app.dash.newShipment}
            </button>
          )}
          <button onClick={() => setMobileOpen(true)} className="app-mobnav" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16"></path>
            </svg>
          </button>
        </header>

        {mobileOpen && (
          <div className="app-mob-drawer" onClick={() => setMobileOpen(false)}>
            <div className="app-mob-panel" onClick={(e) => e.stopPropagation()}>
              <Sidebar mobile />
            </div>
          </div>
        )}

        <main className="app-content">
          {isCreate ? (
            <ShipmentCreate app={app} token={token} />
          ) : isShipments ? (
            <ShipmentsList app={app} token={token} query={hquery} onQueryChange={setHquery} />
          ) : isPayments ? (
            <Payments app={app} />
          ) : isAddresses ? (
            <Addresses app={app} token={token} />
          ) : isSupport ? (
            <Support app={app} token={token} />
          ) : isQuotes ? (
            <Quotes app={app} lang={lang} token={token} />
          ) : isDispatch ? (
            <Dispatch app={app} lang={lang} token={token} />
          ) : isDrivers ? (
            <Drivers app={app} lang={lang} token={token} />
          ) : isIncidents ? (
            <Incidents app={app} lang={lang} token={token} />
          ) : isProfile ? (
            <Profile app={app} user={user} token={token} onUserUpdate={onUserUpdate} />
          ) : isDash ? (
            <Dashboard app={app} lang={lang} token={token} shipments={shipments} onGo={setActiveKey} pendingQuotes={pendingQuotes} hquery={hquery} />
          ) : (
            <div className="app-empty">{app.empty}</div>
          )}
        </main>
      </div>
    </div>
  )
}

function Dashboard({ app, lang, token, shipments, onGo, pendingQuotes, hquery }) {
  const d = app.dash
  const q = app.quotes
  const [quotes, setQuotes] = React.useState([])

  React.useEffect(() => {
    if (!token) return
    api.getQuotes(token)
      .then((data) => setQuotes(Array.isArray(data) ? data : data.data || []))
      .catch(() => setQuotes([]))
  }, [token])

  const statusToIdx = (status) => {
    if (typeof status === 'number') return status
    const s = String(status || '').toLowerCase()
    if (s === 'in_transit' || s === 'en tránsito' || s === 'en transito') return 0
    if (s === 'in_route' || s === 'en ruta de entrega' || s === 'out_for_delivery') return 1
    if (s === 'delivered' || s === 'entregado' || s === 'entregada') return 2
    if (s === 'pending' || s === 'pendiente' || s === 'solicitud recibida') return 3
    if (s === 'incident' || s === 'incidencia') return 4
    return 0
  }

  const formatDate = (date) => {
    if (!date) return '—'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'zh' ? 'zh-CN' : 'en-US', { day: 'numeric', month: 'short' })
  }

  const timeAgo = (date) => {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    const diff = Math.floor((new Date() - d) / 1000)
    const locale = lang === 'es' ? 'es' : lang === 'zh' ? 'zh-Hans' : 'en'
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    if (diff < 60) return rtf.format(-diff, 'second')
    const min = Math.floor(diff / 60)
    if (min < 60) return rtf.format(-min, 'minute')
    const h = Math.floor(min / 60)
    if (h < 24) return rtf.format(-h, 'hour')
    const days = Math.floor(h / 24)
    if (days < 30) return rtf.format(-days, 'day')
    const months = Math.floor(days / 30)
    if (months < 12) return rtf.format(-months, 'month')
    const years = Math.floor(months / 12)
    return rtf.format(-years, 'year')
  }

  const ACTIVITY_TITLES = {
    es: {
      delivered: (sh) => `Entregado a ${sh.recipient_name || '—'}`,
      in_transit: () => 'Envío en tránsito',
      in_route: () => 'Conductor recogió la carga',
      pending: () => 'Nuevo envío creado',
      incident: () => 'Incidencia registrada',
      quote: () => 'Solicitud de cotización recibida',
    },
    en: {
      delivered: (sh) => `Delivered to ${sh.recipient_name || '—'}`,
      in_transit: () => 'Shipment in transit',
      in_route: () => 'Driver picked up the cargo',
      pending: () => 'New shipment created',
      incident: () => 'Incident reported',
      quote: () => 'Quote request received',
    },
    zh: {
      delivered: (sh) => `已送达给 ${sh.recipient_name || '—'}`,
      in_transit: () => '运单运输中',
      in_route: () => '司机已取货',
      pending: () => '已创建新运单',
      incident: () => '已报告异常',
      quote: () => '已收到报价请求',
    },
  }
  const labels = ACTIVITY_TITLES[lang] || ACTIVITY_TITLES.es

  const filteredRows = React.useMemo(() => {
    const qry = (hquery || '').trim().toLowerCase()
    const rows = shipments.map((sh) => ({
      id: sh.tracking_number || `#${sh.id}`,
      route: `${sh.origin || '—'} → ${sh.destination || '—'}`,
      statusIdx: statusToIdx(sh.status),
      eta: sh.eta || sh.estimated_delivery || formatDate(sh.updated_at || sh.created_at),
      raw: sh,
    }))
    if (!qry) return rows
    return rows.filter((r) =>
      (r.id || '').toLowerCase().includes(qry) ||
      (r.route || '').toLowerCase().includes(qry)
    )
  }, [hquery, shipments, lang])

  const statusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS.pending
  const statusLabel = (status) => (q.statuses?.[status] || status)

  const parseDate = (value) => {
    const date = value ? new Date(value) : null
    return date && !isNaN(date.getTime()) ? date : null
  }

  const inTransit = shipments.filter((sh) => {
    const idx = statusToIdx(sh.status)
    return idx === 0 || idx === 1
  }).length
  const deliveredThisMonth = shipments.filter((sh) => {
    const date = parseDate(sh.updated_at || sh.created_at)
    return statusToIdx(sh.status) === 2 && date && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()
  }).length

  const delivered = shipments.filter((sh) => statusToIdx(sh.status) === 2)
  const measuredOnTime = delivered.filter((sh) => {
    const eta = parseDate(sh.eta || sh.estimated_delivery)
    const deliveredAt = parseDate(sh.delivered_at || sh.updated_at || sh.created_at)
    return eta && deliveredAt
  })
  const onTimeCount = measuredOnTime.filter((sh) => {
    const eta = new Date(sh.eta || sh.estimated_delivery)
    const deliveredAt = new Date(sh.delivered_at || sh.updated_at || sh.created_at)
    return deliveredAt <= eta
  }).length
  const onTimeRate = measuredOnTime.length ? `${Math.round((onTimeCount / measuredOnTime.length) * 100)}%` : d.kpis[2].v
  const onTimeLabel = lang === 'zh' ? '准时' : lang === 'en' ? 'on time' : 'a tiempo'
  const onTimeNote = measuredOnTime.length ? `${onTimeCount}/${measuredOnTime.length} ${onTimeLabel}` : d.kpis[2].n

  const activeNote = d.kpis[0].n.replace(/\d+/, String(inTransit))
  const kpis = [
    { ...d.kpis[0], v: String(shipments.length), n: activeNote },
    { ...d.kpis[1], v: String(deliveredThisMonth) },
    { ...d.kpis[2], v: onTimeRate, n: onTimeNote },
    { ...d.kpis[3], v: String(pendingQuotes) },
  ]

  const activityItems = shipments.map((sh) => {
    const status = String(sh.status || '').toLowerCase()
    const date = sh.updated_at || sh.created_at
    let title = labels.pending()
    if (status === 'delivered' || status === 'entregado' || status === 'entregada') title = labels.delivered(sh)
    if (status === 'in_transit' || status === 'en tránsito' || status === 'en transito') title = labels.in_transit(sh)
    if (status === 'in_route' || status === 'en ruta de entrega') title = labels.in_route(sh)
    if (status === 'incident' || status === 'incidencia') title = labels.incident(sh)
    return { t: title, m: `${sh.tracking_number || `#${sh.id}`} · ${timeAgo(date)}`, date }
  })
  const quoteItems = quotes.map((quote) => ({
    t: labels.quote(),
    m: `${quote.tracking_code || `#${quote.id}`} · ${timeAgo(quote.created_at)}`,
    date: quote.created_at,
  }))
  const recent = [...activityItems, ...quoteItems]
    .filter((a) => a.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(({ t, m }) => ({ t, m }))
  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>
      <h1 className="app-h1">{d.title}</h1>

      <div className="app-kpis">
        {kpis.map((k, i) => (
          <div key={i} className="app-kpi">
            <div className="app-kpi-label">{k.l}</div>
            <div className="app-kpi-value">{k.v}</div>
            <div className="app-kpi-note">{k.n}</div>
          </div>
        ))}
      </div>

      <div className="app-split">
        <div className="app-card">
          <div className="app-card-head">
            <span className="app-card-title">{d.activeT}</span>
            <button onClick={() => {}} className="app-card-link">{d.seeAll}</button>
          </div>
          <div className="app-table-scroll">
            <div className="app-table">
              <div className="app-table-head">
                <span>{app.ship.cols[0]}</span>
                <span>{app.ship.cols[1]}</span>
                <span>{app.ship.cols[3]}</span>
                <span>{app.ship.cols[4]}</span>
              </div>
              {filteredRows.map((r, i) => (
                <button key={i} onClick={() => {}} className="app-table-row">
                  <span className="app-table-id">{r.id}</span>
                  <span className="app-table-text">{r.route}</span>
                  <span className="app-status" style={{ background: STATUS_TONE[r.statusIdx].bg, color: STATUS_TONE[r.statusIdx].fg }}>
                    {app.ship.statuses[r.statusIdx]}
                  </span>
                  <span className="app-table-text">{r.eta}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="app-stack">
          <div className="app-card" style={{ padding: 20 }}>
            <div className="app-card-title" style={{ marginBottom: 14 }}>{d.quickT}</div>
            <div className="app-quick-grid">
              {d.quick.map((q, i) => {
                const targets = ['create', 'create', 'shipments', 'support']
                return (
                  <button key={i} onClick={() => onGo?.(targets[i])} className="app-quick-btn">{q}</button>
                )
              })}
            </div>
          </div>

          <div className="app-card" style={{ padding: 20 }}>
            <div className="app-card-title" style={{ marginBottom: 14 }}>{q.title || 'Cotizaciones'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {quotes.length === 0 && (
                <div style={{ color: '#6C82A6', fontSize: 14 }}>{q.empty}</div>
              )}
              {quotes.slice(0, 5).map((quote) => {
                const style = statusColor(quote.status)
                return (
                  <div key={quote.id} className="app-activity-item">
                    <span className="app-dot"></span>
                    <div style={{ minWidth: 0 }}>
                      <div className="app-activity-title">{quote.tracking_code || `#${quote.id}`}</div>
                      <div className="app-activity-meta">{quote.origin} → {quote.destination}</div>
                    </div>
                    <span className="app-status" style={{ marginLeft: 'auto', background: style.bg, color: style.fg }}>
                      {statusLabel(quote.status)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="app-card" style={{ padding: 20 }}>
            <div className="app-card-title" style={{ marginBottom: 14 }}>{d.activityT}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(recent.length ? recent : d.activity).map((a, i) => (
                <div key={i} className="app-activity-item">
                  <span className="app-dot"></span>
                  <div>
                    <div className="app-activity-title">{a.t}</div>
                    <div className="app-activity-meta">{a.m}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
