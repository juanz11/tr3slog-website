import React from 'react'
import { api } from '../api'
import { usePolling } from './Shared'

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const SCRIPT_ID = 'gmp-maps-js'
const POLL_MS = 20000
const DEFAULT_CENTER = { lat: 18.4861, lng: -69.9312 }

const STOP_COLORS = {
  PENDIENTE: '#087CF0',
  ENTREGADO: '#137A45',
  NO_ENTREGADO: '#C0392B',
  TRANSFERIDO: '#D99A00',
}

function useGoogleMaps() {
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  React.useEffect(() => {
    if (!GOOGLE_MAPS_KEY) return
    // Google calls this when the key is rejected (API not enabled,
    // billing missing, or referrer not allowed).
    const prev = window.gm_authFailure
    window.gm_authFailure = () => { setFailed(true); prev?.() }
    if (window.google?.maps?.Map) { setReady(true); return () => { window.gm_authFailure = prev } }
    let s = document.getElementById(SCRIPT_ID)
    const onLoad = () => setReady(true)
    const onError = () => setFailed(true)
    if (!s) {
      s = document.createElement('script')
      s.id = SCRIPT_ID
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&v=weekly`
      s.async = true
      document.head.appendChild(s)
    }
    s.addEventListener('load', onLoad)
    s.addEventListener('error', onError)
    if (window.google?.maps?.Map) setReady(true)
    return () => {
      s?.removeEventListener?.('load', onLoad)
      s?.removeEventListener?.('error', onError)
      window.gm_authFailure = prev
    }
  }, [])
  return { ready, failed }
}

function timeAgo(iso, t) {
  if (!iso) return '—'
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.floor(diff / 60000)
  if (min < 1) return t.now || 'ahora'
  if (min < 60) return (t.minutesAgo || 'hace {n} min').replace('{n}', min)
  const h = Math.floor(min / 60)
  return (t.hoursAgo || 'hace {n} h').replace('{n}', h)
}

export default function LiveTracking({ app, token }) {
  const t = app.live || {}
  const { ready: mapsReady, failed: mapsFailed } = useGoogleMaps()
  const [drivers, setDrivers] = React.useState([])
  const [error, setError] = React.useState('')
  const [selectedId, setSelectedId] = React.useState(null)
  const [geoTick, setGeoTick] = React.useState(0)

  const mapEl = React.useRef(null)
  const mapRef = React.useRef(null)
  const overlaysRef = React.useRef([])
  const geoCacheRef = React.useRef(new Map())
  const routeSigRef = React.useRef('')
  const infoRef = React.useRef(null)

  const load = React.useCallback(async (isPoll) => {
    if (!token) return
    try {
      const data = await api.getLiveDriverLocations(token)
      setDrivers(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      if (!isPoll) setError(err.message)
    }
  }, [token])

  usePolling(load, POLL_MS)

  React.useEffect(() => {
    if (!mapsReady || !mapEl.current || mapRef.current) return
    mapRef.current = new window.google.maps.Map(mapEl.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
      mapId: '4fe6a967fe9b6fa371b0e34b',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })
    infoRef.current = new window.google.maps.InfoWindow()
  }, [mapsReady])

  const selected = drivers.find((d) => d.conductor.id === selectedId)
    || drivers.find((d) => d.manifiesto)
    || drivers[0]
    || null

  // Geocode pending stops of the selected driver's manifest (cached in browser).
  React.useEffect(() => {
    if (!mapsReady || !selected?.manifiesto?.detalles?.length) return
    const geocoder = new window.google.maps.Geocoder()
    let cancelled = false
    const pending = selected.manifiesto.detalles.filter(
      (d) => d.estado === 'PENDIENTE' && (d.direccion || d.destino)
    )
    pending.forEach((d) => {
      const addr = d.direccion || `${d.destino}`
      if (geoCacheRef.current.has(addr)) return
      geoCacheRef.current.set(addr, null) // evita duplicar peticiones
      geocoder.geocode({ address: addr }, (results, status) => {
        if (cancelled) return
        if (status === 'OK' && results?.[0]) {
          const loc = results[0].geometry.location
          geoCacheRef.current.set(addr, { lat: loc.lat(), lng: loc.lng() })
        }
        setGeoTick((v) => v + 1)
      })
    })
    return () => { cancelled = true }
  }, [mapsReady, selected, geoTick])

  // Draw markers + route polyline.
  React.useEffect(() => {
    const g = window.google?.maps
    const map = mapRef.current
    if (!g || !map) return

    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []

    const bounds = new g.LatLngBounds()
    let hasPoints = false

    drivers.forEach((entry) => {
      const { conductor, ubicacion } = entry
      if (!ubicacion?.lat || !ubicacion?.lng) return
      const pos = { lat: Number(ubicacion.lat), lng: Number(ubicacion.lng) }
      const isSel = selected && conductor.id === selected.conductor.id
      const marker = new g.Marker({
        position: pos,
        map,
        zIndex: isSel ? 10 : 5,
        icon: {
          path: g.SymbolPath.CIRCLE,
          scale: 15,
          fillColor: isSel ? '#087CF0' : '#001B45',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2.5,
        },
        label: { text: '🚚', fontSize: '13px' },
        title: conductor.nombre || `#${conductor.id}`,
      })
      marker.addListener('click', () => {
        setSelectedId(conductor.id)
        const info = infoRef.current
        if (info) {
          info.setContent(
            `<div style="font:13px sans-serif;color:#001B45">
              <b>${conductor.nombre || ''}</b><br/>
              ${entry.manifiesto?.codigo || (t.noManifest || 'Sin manifiesto')}<br/>
              ${timeAgo(ubicacion.fecha, t)}
            </div>`
          )
          info.open({ anchor: marker, map })
        }
      })
      overlaysRef.current.push(marker)
      bounds.extend(pos)
      hasPoints = true
    })

    if (selected?.manifiesto?.detalles?.length) {
      const waypoints = []
      selected.manifiesto.detalles.forEach((d) => {
        const addr = d.direccion || d.destino
        const coord = addr ? geoCacheRef.current.get(addr) : null
        if (!coord) return
        const color = STOP_COLORS[d.estado] || '#8B9DBA'
        const marker = new g.Marker({
          position: coord,
          map,
          icon: {
            path: g.SymbolPath.CIRCLE,
            scale: 11,
            fillColor: color,
            fillOpacity: d.estado === 'PENDIENTE' ? 1 : 0.55,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
          label: {
            text: String(d.secuencia),
            color: '#fff',
            fontSize: '10px',
            fontWeight: '700',
          },
          title: `${d.tracking} · ${d.destinatario || d.destino || ''}`,
        })
        marker.addListener('click', () => {
          const info = infoRef.current
          if (info) {
            info.setContent(
              `<div style="font:13px sans-serif;color:#001B45">
                <b>#${d.secuencia} · ${d.tracking}</b><br/>
                ${d.destinatario || ''}<br/>${addr || ''}
              </div>`
            )
            info.open({ anchor: marker, map })
          }
        })
        overlaysRef.current.push(marker)
        bounds.extend(coord)
        hasPoints = true
        if (d.estado === 'PENDIENTE') waypoints.push({ location: coord, stopover: true })
      })

      // Polyline conductor → paradas pendientes (orden del manifiesto).
      const origin = selected.ubicacion
        ? { lat: Number(selected.ubicacion.lat), lng: Number(selected.ubicacion.lng) }
        : null
      if (origin && waypoints.length) {
        const last = waypoints[waypoints.length - 1].location
        const mids = waypoints.slice(0, -1)
        const sig = `${selected.conductor.id}:${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}:${waypoints.length}:${last.lat.toFixed(4)},${last.lng.toFixed(4)}`
        if (routeSigRef.current !== sig) {
          routeSigRef.current = sig
          new g.DirectionsService().route(
            {
              origin,
              destination: last,
              waypoints: mids,
              travelMode: g.TravelMode.DRIVING,
              optimizeWaypoints: false,
            },
            (result, status) => {
              if (status !== 'OK' || !result) return
              const renderer = new g.DirectionsRenderer({
                map,
                directions: result,
                suppressMarkers: true,
                preserveViewport: true,
                polylineOptions: { strokeColor: '#087CF0', strokeWeight: 5, strokeOpacity: 0.75 },
              })
              overlaysRef.current.push(renderer)
            }
          )
        }
      }
    }

    if (hasPoints) map.fitBounds(bounds, 60)
  }, [drivers, selected, geoTick, mapsReady])

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        <span style={{ width: 24, height: 5, background: '#D99A00', transform: 'skewX(-24deg)' }}></span>
        <span style={{ width: 9, height: 5, background: '#087CF0', transform: 'skewX(-24deg)' }}></span>
      </div>

      <h1 style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif',
        fontWeight: 800, fontSize: 30, letterSpacing: '-.02em',
        margin: '0 0 6px', color: '#001B45',
      }}>{t.title || 'Rastreo en vivo'}</h1>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6C82A6' }}>
        {t.subtitle || 'Posición de conductores en ruta y orden de paradas del manifiesto.'}
      </p>

      {error && <div style={{ padding: 14, color: '#A93226' }}>{error}</div>}
      {!GOOGLE_MAPS_KEY && (
        <div style={{ padding: 14, color: '#8A6300' }}>
          {t.noKey || 'Falta NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local'}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 620px', minWidth: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #DCE6F5' }}>
          {mapsFailed ? (
            <div style={{ width: '100%', height: 560, background: '#EEF4FC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#A93226' }}>{t.mapFailTitle || 'Google Maps no pudo cargar'}</div>
              <div style={{ fontSize: 13, color: '#6C82A6', lineHeight: 1.7, maxWidth: 420 }}>
                {t.mapFailBody || 'La clave fue rechazada: active "Maps JavaScript API" (y Places/Geocoding si usa autocompletado) en Google Cloud Console y verifique la facturación. La lista de conductores sigue funcionando.'}
              </div>
            </div>
          ) : (
            <div ref={mapEl} style={{ width: '100%', height: 560, background: '#EEF4FC' }} />
          )}
        </div>

        <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6', fontWeight: 700 }}>
            {t.drivers || 'Conductores'} · {drivers.length}
          </div>
          {!drivers.length && !error && (
            <div style={{ padding: '18px 16px', background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, fontSize: 13, color: '#6C82A6' }}>
              {t.empty || 'Ningún conductor ha reportado posición recientemente.'}
            </div>
          )}
          {drivers.map((entry) => {
            const on = selected && entry.conductor.id === selected.conductor.id
            return (
              <button
                key={entry.conductor.id}
                onClick={() => setSelectedId(entry.conductor.id)}
                style={{
                  textAlign: 'left', padding: '14px 16px', cursor: 'pointer',
                  background: '#fff', borderRadius: 14,
                  border: `1.5px solid ${on ? '#087CF0' : '#DCE6F5'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 9, height: 9, borderRadius: '50%',
                    background: entry.manifiesto?.estado === 'EN_RUTA' ? '#137A45' : '#D99A00',
                  }}></span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#001B45', flex: 1 }}>
                    {entry.conductor.nombre || `#${entry.conductor.id}`}
                  </span>
                  <span style={{ fontSize: 11, color: '#8B9DBA' }}>{timeAgo(entry.ubicacion?.fecha, t)}</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#6C82A6' }}>
                  {entry.manifiesto
                    ? `${entry.manifiesto.codigo} · ${(t.stopsPending || '{n} pendientes').replace('{n}', entry.manifiesto.detalles.filter((d) => d.estado === 'PENDIENTE').length)}`
                    : (t.noManifest || 'Sin manifiesto activo')}
                </div>
                {entry.ubicacion?.velocidad != null && (
                  <div style={{ marginTop: 4, fontSize: 11.5, color: '#8B9DBA' }}>
                    {(t.speed || '{n} km/h').replace('{n}', Math.round(entry.ubicacion.velocidad * 3.6))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
