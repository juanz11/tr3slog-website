import React from 'react'

const CACHE = {}
const SETTLEMENT_TYPES = new Set(['city', 'town', 'village', 'municipality', 'locality', 'suburb', 'neighbourhood', 'hamlet'])

function cleanState(state = '') {
  return state
    .replace(/^Estado\s+(de\s+)?/i, '')
    .replace(/\s+State$/i, '')
    .trim()
}

function cleanCountry(country = '') {
  const c = country.toLowerCase()
  if (c.includes('estados unidos')) return 'Estados Unidos'
  if (c.includes('united states')) return 'United States'
  if (c.includes('美国')) return '美国'
  return country
}

function formatCity(item) {
  const address = item.address || {}
  const city = item.name || address.city || address.town || address.village || address.municipality || address.locality || address.county || address.suburb || address.neighbourhood || address.hamlet || ''
  const state = cleanState(address.state || '')
  const country = cleanCountry(address.country || '')
  const parts = [city]
  if (state && state.toLowerCase() !== city.toLowerCase()) parts.push(state)
  parts.push(country)
  return parts.filter(Boolean).join(', ')
}

function parseResults(data) {
  const seen = new Set()
  return data
    .filter(item => SETTLEMENT_TYPES.has(item.addresstype))
    .map(item => {
      const label = formatCity(item)
      if (!label || seen.has(label.toLowerCase())) return null
      seen.add(label.toLowerCase())
      return label
    })
    .filter(Boolean)
}

export default function CityAutocomplete({ value = '', onChange, placeholder, cities = [], hasError = false, countryCodes = '', lang = 'es' }) {
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const [suggestions, setSuggestions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const wrapRef = React.useRef(null)
  const debounceRef = React.useRef(null)
  const abortRef = React.useRef(null)

  const err = '#E0A0A0'

  const inputStyle = {
    width: '100%', padding: '14px 15px',
    border: `1.5px solid ${hasError ? err : '#DCE6F5'}`,
    borderRadius: 11, background: '#EEF4FC', fontSize: 15, color: '#001B45', outline: 'none',
  }

  const listStyle = {
    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
    background: '#fff', border: '1px solid #DCE6F5', borderRadius: 11,
    boxShadow: '0 8px 24px rgba(0,27,69,.08)', zIndex: 20,
    maxHeight: 260, overflow: 'auto', padding: '6px 0',
  }

  const itemStyle = (on) => ({
    padding: '10px 15px', fontSize: 14, cursor: 'pointer',
    background: on ? '#EEF4FC' : '#fff', color: '#001B45',
  })

  const fetchSuggestions = React.useCallback(async (q) => {
    if (!q.trim() || q.trim().length < 2) {
      setSuggestions([])
      return
    }
    const cacheKey = `${lang}:${countryCodes}:${q.trim().toLowerCase()}`
    if (CACHE[cacheKey]) {
      setSuggestions(CACHE[cacheKey])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(q)}&countrycodes=${countryCodes}`
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept-Language': lang,
          'User-Agent': 'TR3SLOG/1.0 (https://tr3slog.com)',
        },
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      const parsed = parseResults(data)
      CACHE[cacheKey] = parsed
      setSuggestions(parsed)
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError('No se pudieron cargar las ciudades')
      }
    } finally {
      setLoading(false)
    }
  }, [countryCodes, lang])

  const filtered = React.useMemo(() => {
    if (!cities.length) return []
    const v = value.trim().toLowerCase()
    if (!v) return cities
    return cities.filter(c => c.toLowerCase().includes(v))
  }, [value, cities])

  const list = React.useMemo(() => {
    if (!countryCodes) return filtered
    const seen = new Set(suggestions.map(s => s.toLowerCase()))
    return [...suggestions, ...filtered.filter(c => !seen.has(c.toLowerCase()))]
  }, [countryCodes, suggestions, filtered])

  React.useEffect(() => {
    setActive(0)
    if (!countryCodes) return
    clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(() => {
      setOpen(true)
      fetchSuggestions(value)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [value, countryCodes, lang, fetchSuggestions])

  React.useEffect(() => {
    if (list.length > 0) setActive(0)
  }, [list.length])

  const select = (city) => {
    onChange(city)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (!open || list.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => (i + 1) % list.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => (i - 1 + list.length) % list.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(list[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  React.useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        style={{ ...inputStyle, padding: loading ? '14px 40px 14px 15px' : '14px 15px' }}
      />
      {loading && (
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C82A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <g>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeOpacity=".3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>
      )}
      {open && (list.length > 0 || loading || error || value.trim() !== '') && (
        <div style={listStyle}>
          {loading && <div style={{ padding: '10px 15px', fontSize: 13, color: '#6C82A6' }}>Buscando…</div>}
          {error && <div style={{ padding: '10px 15px', fontSize: 13, color: '#C0392B' }}>{error}</div>}
          {!loading && !error && list.length === 0 && value.trim() !== '' && (
            <div style={{ padding: '10px 15px', fontSize: 13, color: '#6C82A6' }}>No se encontraron ciudades</div>
          )}
          {list.map((city, i) => (
            <div
              key={city}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); select(city) }}
              style={itemStyle(i === active)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
