import React from 'react'

export function PageHero({ title, sub, children }) {
  return (
    <section className="section-pad" style={{
      background: '#001B45', padding: '66px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 110,
        background: 'repeating-linear-gradient(102deg,rgba(217,154,0,.12) 0 3px,transparent 3px 48px)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto' }}>
        <h1 className="h1-large" style={{
          fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800,
          fontSize: 46, letterSpacing: '-.025em', margin: '0 0 14px', color: '#fff',
        }}>{title}</h1>
        {sub && <p style={{ margin: 0, fontSize: 18, color: '#C6D6EF', maxWidth: 640 }}>{sub}</p>}
        {children}
      </div>
    </section>
  )
}

export function AccentStrip() {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
      <span style={{ width: 20, height: 4, background: '#D99A00', transform: 'skewX(-24deg)' }} />
      <span style={{ width: 8, height: 4, background: '#087CF0', transform: 'skewX(-24deg)' }} />
    </div>
  )
}

const PAGER_FALLBACK = {
  showing: 'Mostrando {from}–{to} de {total}',
  prev: 'Anterior',
  next: 'Siguiente',
  perPage: 'Por página',
  page: 'Página',
}

export const PER_PAGE_OPTIONS = [10, 15, 25, 50]

/**
 * Runs `callback` right away, then every `intervalMs` while the tab is
 * visible. The callback receives `true` on poll ticks and `false` on the
 * initial run, so background refreshes can skip loading spinners/errors.
 */
export function usePolling(callback, intervalMs = 30000) {
  React.useEffect(() => {
    callback(false)
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') callback(true)
    }, intervalMs)
    return () => clearInterval(id)
  }, [callback, intervalMs])
}

/**
 * Client-side pagination over an already filtered list.
 * Returns the slice for the current page plus the state the pager needs.
 */
export function usePagination(items, initialPerPage = 10, resetKey = '') {
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(initialPerPage)

  // Going back to the first page whenever the filters change.
  React.useEffect(() => { setPage(1) }, [resetKey])

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(page, totalPages)

  React.useEffect(() => {
    if (page !== current) setPage(current)
  }, [page, current])

  const start = (current - 1) * perPage

  return {
    page: current,
    setPage,
    perPage,
    setPerPage: (value) => { setPerPage(value); setPage(1) },
    total,
    totalPages,
    from: total ? start + 1 : 0,
    to: Math.min(start + perPage, total),
    pageItems: items.slice(start, start + perPage),
  }
}

function pageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set([1, totalPages, page, page - 1, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('…')
    out.push(p)
  })
  return out
}

export function Pagination({ pager, labels, showPerPage = true }) {
  const t = { ...PAGER_FALLBACK, ...(labels || {}) }
  const { page, setPage, perPage, setPerPage, total, totalPages, from, to } = pager

  if (!total) return null

  const btn = (extra) => ({
    minWidth: 34, padding: '7px 10px', border: '1.5px solid #DCE6F5', borderRadius: 9,
    background: '#fff', color: '#10233F', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', ...extra,
  })

  const showing = t.showing
    .replace('{from}', from)
    .replace('{to}', to)
    .replace('{total}', total)

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
      justifyContent: 'space-between', padding: '14px 18px', borderTop: '1px solid #DCE6F5',
    }}>
      <span style={{ fontSize: 13, color: '#6C82A6' }}>{showing}</span>

      <div style={{ display: totalPages === 1 ? 'none' : 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {showPerPage && (
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            aria-label={t.perPage}
            style={btn({ padding: '7px 8px', cursor: 'pointer' })}
          >
            {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n} / {t.page.toLowerCase()}</option>)}
          </select>
        )}

        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          style={btn({ cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? .5 : 1 })}
        >{t.prev}</button>

        {pageNumbers(page, totalPages).map((p, i) => (
          p === '…'
            ? <span key={`gap-${i}`} style={{ fontSize: 13, color: '#8B9DBA', padding: '0 2px' }}>…</span>
            : (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={p === page ? 'page' : undefined}
                style={btn(p === page
                  ? { borderColor: '#087CF0', background: 'rgba(8,124,240,.08)', color: '#0768C9' }
                  : {})}
              >{p}</button>
            )
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          style={btn({ cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? .5 : 1 })}
        >{t.next}</button>
      </div>
    </div>
  )
}

export function ImageSlot({ placeholder, src, alt, height = 180 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || placeholder}
        style={{
          width: '100%', height, objectFit: 'cover', display: 'block',
        }}
      />
    )
  }
  return (
    <div style={{
      height, background: '#EEF4FC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#8B9DBA', fontSize: 13, fontWeight: 500,
      backgroundImage: 'repeating-linear-gradient(45deg,#DCE6F5 0 1px,transparent 1px 24px)',
    }}>
      {placeholder}
    </div>
  )
}
