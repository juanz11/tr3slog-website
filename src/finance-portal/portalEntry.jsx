import React from 'react'
import dynamic from 'next/dynamic'
import finConfig from './finConfig'
import { api } from '../api'

const FinancePortal = dynamic(() => import('./FinancePortal.jsx'), { ssr: false })

const labels = {
  en: 'EN',
  es: 'ES',
  'zh-CN': 'ZH'
}

const money = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })

export default function FinancePortalEntry({ lang, setLang, user, onLogout }) {
  const [ready, setReady] = React.useState(false)
  const [live, setLive] = React.useState(null)

  React.useEffect(() => {
    let on = true
    Promise.all([
      import('./i18n/fin.es.js'),
      import('./i18n/fin.en.js'),
      import('./i18n/fin.zh-CN.js'),
    ]).then(() => { if (on) setReady(true) })
    return () => { on = false }
  }, [])

  React.useEffect(() => {
    let on = true
    let token = null
    try { token = window.localStorage.getItem('tr3slog-token') } catch (e) {}
    if (!token) return
    api.getFinanceOverview(token)
      .then((d) => { if (on) setLive(d) })
      .catch(() => {})
    return () => { on = false }
  }, [])

  if (!ready) return null

  const name = user?.name || user?.email || ''
  const account = {
    name,
    email: user?.email || '',
    initials: (name || 'FC').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
  }

  const raw = typeof window !== 'undefined' ? window.TR3S_I18N : {}
  const dict = {}
  ;['es', 'en', 'zh-CN'].forEach((code) => {
    dict[code] = { ...(raw[code] || {}), label: labels[code] }
  })

  if (live) {
    const s = live.summary || {}
    const sevSt = { high: 'bad', critical: 'bad', medium: 'warn', low: 'info' }
    const incSt = { open: 'warn', in_progress: 'warn', resolved: 'ok', closed: 'neutral' }
    ;['es', 'en', 'zh-CN'].forEach((code) => {
      const fin = dict[code].fin || {}
      if (fin.tx?.live) {
        const L = fin.tx.live
        fin.tx.list = { t: fin.tx.list.t, exp: true, cols: L.cols, rows: (live.payments || []).map((p) => ({
          c: [p.ref, p.driver, p.period, money(p.base), money(p.bonuses), money(p.deductions), money(p.total), p.paid_on || '—'],
          st: p.status === 'Paid' ? 'ok' : 'warn',
          pill: L.pills[p.status] || p.status,
        })) }
        fin.tx.stats = L.stats.map((k, i) => ({ k, v: [String(s.tx_count ?? '—'), String(s.paid_count ?? '—'), String(s.pending_count ?? '—'), money(s.paid_total)][i], d: L.d }))
        fin.tx.filters = [fin.tx.filters?.[0], ...Object.values(L.pills)].filter(Boolean)
      }
      if (fin.fin?.live) {
        const L = fin.fin.live
        fin.fin.stats = L.stats.map((k, i) => ({ k, v: [money(s.paid_total), money(s.pending_total), String(s.shipments ?? '—'), String(s.quotes ?? '—'), String(s.incidents ?? '—'), String(s.tx_count ?? '—')][i], d: L.d }))
        const svcRows = (live.services || []).filter((r) => /terrestre/i.test(r.type || ''))
        const svcTotal = svcRows.reduce((a, r) => a + (r.count || 0), 0)
        fin.fin.svc = { t: fin.fin.svc.t, exp: true, cols: fin.fin.svc.cols, rows: svcRows.map((r) => ({
          c: [r.type || L.none, String(r.count), '$ ——', '$ ——', svcTotal ? Math.round((r.count / svcTotal) * 100) + ' %' : '—'],
        })) }
        fin.fin.track = { t: L.trackT, exp: true, cols: L.trackCols, rows: (live.shipments || []).filter((sh) => /terrestre/i.test(sh.service_type || '')).map((sh) => ({
          c: [sh.tracking, sh.service_type || L.none, sh.origin || '—', sh.destination || '—', sh.created_at || '—'],
          st: { delivered: 'ok', in_transit: 'info', cancelled: 'bad' }[sh.status] || 'neutral',
          pill: L.pills[sh.status] || sh.status,
        })) }
        fin.fin.mkt = { t: fin.fin.mkt.t, exp: true, cols: L.mktCols, rows: (live.markets || []).map((m) => ({
          c: [L.markets[m.market] || m.market || L.other, String(m.count), '$ ——'],
          st: m.market === 'VE' ? 'warn' : 'ok',
          pill: m.market === 'VE' ? L.mktPills.future : L.mktPills.active,
        })) }
        fin.fin.fails = { t: L.failT, exp: true, cols: L.failCols, rows: (live.incidents || []).map((i) => ({
          c: [i.code, i.title || i.category || '—', i.driver || '—', i.severity || '—', i.created_at || '—'],
          st: incSt[i.status] || sevSt[String(i.severity || '').toLowerCase()] || 'neutral',
          pill: L.incPills[i.status] || i.status,
        })) }
      }
      if (fin.refunds?.form?.fields?.length) {
        fin.refunds.form.fields[0].opts = (live.shipments || [])
          .filter((sh) => sh.status === 'pending' && sh.tracking)
          .map((sh) => ({ v: sh.tracking, l: `${sh.tracking} · ${sh.origin || '—'} → ${sh.destination || '—'}` }))
      }
      if (fin.claims?.live) {
        const L = fin.claims.live
        fin.claims.list = { t: fin.claims.list.t, exp: true, cols: L.cols, rows: (live.incidents || []).map((i) => ({
          c: [i.code, i.ship || '—', i.title || i.category || '—', i.driver || '—', i.severity || '—', i.created_at || '—', i.photo ? '✓' : '—'],
          st: incSt[i.status] || sevSt[String(i.severity || '').toLowerCase()] || 'neutral',
          pill: L.pills[i.status] || i.status,
        })) }
        fin.claims.filters = [...new Set([fin.claims.filters?.[0], ...Object.values(L.pills)].filter(Boolean))]
        const inc = live.incidents || []
        const incCount = (st) => inc.filter((i) => i.status === st).length
        if (L.stats) fin.claims.stats = L.stats.map((k, i) => ({ k, v: String([incCount('open'), incCount('in_progress'), incCount('resolved'), incCount('closed'), inc.length][i]), d: L.d }))
      }
      if (fin.finrep?.live && Array.isArray(fin.finrep.cards?.items)) {
        const items = fin.finrep.cards.items
        const attach = (idx, cols, rows) => {
          const c = items[idx]
          if (!c || !rows?.length) return
          c.cols = cols
          c.rows = rows
          c.s = `${c.s} ${(fin.finrep.live.suffix || '').replace('{n}', String(rows.length))}`.trim()
        }
        attach(0, fin.tx?.live?.cols, fin.tx?.list?.rows)
        attach(3, fin.tx?.live?.cols, fin.tx?.list?.rows)
        attach(6, fin.fin?.svc?.cols, fin.fin?.svc?.rows)
        attach(8, (fin.fin?.live?.mktCols || []).slice(0, -1), fin.fin?.mkt?.rows)
      }
    })
  }

  return (
    <FinancePortal
      key={lang}
      config={finConfig}
      dict={dict}
      lang={lang}
      onLogout={onLogout}
      onLangChange={setLang}
      account={account}
    />
  )
}
