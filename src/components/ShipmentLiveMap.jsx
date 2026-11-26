import React from 'react'
import { api } from '../api'
import { usePolling } from './Shared'
import { useGoogleMaps, useLeaflet, GOOGLE_MAPS_KEY } from './useGoogleMaps'

const POLL_MS = 20000
const DEFAULT_CENTER = { lat: 18.4861, lng: -69.9312 }

function timeAgo(iso) {
  if (!iso) return '—'
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  return `hace ${Math.floor(min / 60)} h`
}

// Decodifica la polyline de Google/OSRM a [{lat, lng}] para dibujarla
// sin depender de la librería geometry de Maps JS.
function decodePolyline(str) {
  const pts = []
  let i = 0, lat = 0, lng = 0
  while (i < str.length) {
    let shift = 0, result = 0, b
    do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += (result & 1) ? ~(result >> 1) : (result >> 1)
    shift = 0; result = 0
    do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += (result & 1) ? ~(result >> 1) : (result >> 1)
    pts.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }
  return pts
}

/** Versión Leaflet/OSM: misma vista sin depender de la key de Google. */
function LeafletMiniMap({ pos, destCoord, destAddress, driverName, token }) {
  const { ready, failed } = useLeaflet()
  const el = React.useRef(null)
  const mapRef = React.useRef(null)
  const markersRef = React.useRef([])
  const routeRef = React.useRef(null)
  const sigRef = React.useRef('')
  const fitDoneRef = React.useRef(false)

  React.useEffect(() => {
    if (!ready || !el.current || mapRef.current) return
    const map = window.L.map(el.current, { zoomControl: true })
      .setView(pos ? [pos.lat, pos.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 13)
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)
    mapRef.current = map
  }, [ready])

  const emojiIcon = (emoji, bg) => window.L.divIcon({
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${bg};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,27,69,.35);display:flex;align-items:center;justify-content:center;font-size:14px">${emoji}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })

  React.useEffect(() => {
    const L = window.L
    const map = mapRef.current
    if (!L || !map || !pos) return
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = [
      L.marker([pos.lat, pos.lng], { icon: emojiIcon('🚚', '#087CF0'), title: driverName || '' }).addTo(map),
      ...(destCoord ? [L.marker([destCoord.lat, destCoord.lng], { icon: emojiIcon('📦', '#137A45'), title: destAddress || '' }).addTo(map)] : []),
    ]
    map.panTo([pos.lat, pos.lng])
  }, [pos, destCoord, ready])

  React.useEffect(() => {
    const L = window.L
    const map = mapRef.current
    if (!L || !map || !pos || !destCoord || fitDoneRef.current) return
    map.fitBounds([[pos.lat, pos.lng], [destCoord.lat, destCoord.lng]], { padding: [30, 30] })
    fitDoneRef.current = true
  }, [pos, destCoord])

  React.useEffect(() => {
    const L = window.L
    const map = mapRef.current
    if (!L || !map || !pos || !destCoord) return
    const sig = `${pos.lat.toFixed(3)},${pos.lng.toFixed(3)}:${destCoord.lat.toFixed(4)},${destCoord.lng.toFixed(4)}`
    if (sigRef.current === sig) return
    sigRef.current = sig
    api.geoDirections({
      origin: `${pos.lat},${pos.lng}`,
      destination: `${destCoord.lat},${destCoord.lng}`,
    }, token).then((r) => {
      const line = r?.route?.polyline ? decodePolyline(r.route.polyline) : null
      if (!line?.length || !mapRef.current) return
      routeRef.current?.remove()
      routeRef.current = L.polyline(
        line.map((p) => [p.lat, p.lng]),
        { color: '#087CF0', weight: 5, opacity: 0.75 }
      ).addTo(mapRef.current)
    }).catch(() => {})
  }, [pos, destCoord, token, ready])

  if (failed) {
    return <div style={{ fontSize: 13, color: '#6C82A6', padding: '10px 0' }}>El mapa no está disponible ahora.</div>
  }
  if (!ready) {
    return <div style={{ fontSize: 13, color: '#6C82A6', padding: '10px 0' }}>Cargando mapa…</div>
  }
  return <div ref={el} style={{ width: '100%', height: 260, borderRadius: 12, background: '#EEF4FC' }} />
}

/**
 * Mapa del detalle de envío en camino: dónde va el chofer (GPS) y la ruta
 * solo hasta ESTE envío — sin mostrar las demás paradas del manifiesto.
 */
export default function ShipmentLiveMap({ app, shipment, token }) {
  const t = (app && app.live) || {}
  const { ready: mapsReady, failed: mapsFailed } = useGoogleMaps()
  const [live, setLive] = React.useState(null)
  const [destCoord, setDestCoord] = React.useState(null)

  const mapEl = React.useRef(null)
  const mapRef = React.useRef(null)
  const markersRef = React.useRef([])
  const routeRef = React.useRef(null)
  const routeSigRef = React.useRef('')

  const destAddress = shipment.recipient_address || shipment.destination || ''

  const load = React.useCallback(async (isPoll) => {
    if (!token || !shipment?.id) return
    try {
      const data = await api.getShipmentDriverLocation(shipment.id, token)
      setLive(data)
    } catch (err) {
      console.warn('[ShipmentLiveMap] driver-location:', err.message || err)
      if (!isPoll) setLive(null)
    }
  }, [token, shipment?.id])

  usePolling(load, POLL_MS)

  // Geocodifica el destino por el proxy del backend (Google→Nominatim).
  React.useEffect(() => {
    if (!destAddress || !token) return
    let cancelled = false
    api.geoGeocode(destAddress, token)
      .then((r) => { if (!cancelled && r?.status === 'OK') setDestCoord({ lat: r.lat, lng: r.lng }) })
      .catch((err) => console.warn('[ShipmentLiveMap] geocode:', err.message || err))
    return () => { cancelled = true }
  }, [destAddress, token])

  const pos = live?.ubicacion
    ? { lat: Number(live.ubicacion.lat), lng: Number(live.ubicacion.lng) }
    : null

  React.useEffect(() => {
    if (!mapsReady || !mapEl.current || mapRef.current) return
    mapRef.current = new window.google.maps.Map(mapEl.current, {
      center: pos || DEFAULT_CENTER,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })
  }, [mapsReady, pos])

  // Marcadores chofer/destino: se redibujan en cada actualización de posición.
  React.useEffect(() => {
    const g = window.google?.maps
    const map = mapRef.current
    if (!g || !map || !pos) return

    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = [
      new g.Marker({
        position: pos, map, zIndex: 10,
        icon: {
          path: g.SymbolPath.CIRCLE, scale: 15,
          fillColor: '#087CF0', fillOpacity: 1,
          strokeColor: '#fff', strokeWeight: 2.5,
        },
        label: { text: '🚚', fontSize: '13px' },
        title: live?.conductor?.nombre || '',
      }),
      ...(destCoord ? [new g.Marker({
        position: destCoord, map,
        icon: {
          path: g.SymbolPath.CIRCLE, scale: 12,
          fillColor: '#137A45', fillOpacity: 1,
          strokeColor: '#fff', strokeWeight: 2,
        },
        label: { text: '📦', fontSize: '12px' },
        title: destAddress,
      })] : []),
    ]
    map.panTo(pos)
  }, [pos, destCoord, live?.conductor?.nombre, destAddress])

  // Encuadre inicial: chofer + destino apenas haya ambos.
  const fitDoneRef = React.useRef(false)
  React.useEffect(() => {
    const g = window.google?.maps
    const map = mapRef.current
    if (!g || !map || !pos || fitDoneRef.current) return
    const bounds = new g.LatLngBounds()
    bounds.extend(pos)
    if (destCoord) bounds.extend(destCoord)
    map.fitBounds(bounds, 60)
    fitDoneRef.current = true
  }, [pos, destCoord])

  // Ruta por calles chofer→este envío (Google→OSRM en el backend); solo se
  // recalcula cuando el origen/destino cambian de verdad.
  React.useEffect(() => {
    const g = window.google?.maps
    const map = mapRef.current
    if (!g || !map || !pos || !destCoord) return
    const sig = `${pos.lat.toFixed(3)},${pos.lng.toFixed(3)}:${destCoord.lat.toFixed(4)},${destCoord.lng.toFixed(4)}`
    if (routeSigRef.current === sig) return
    routeSigRef.current = sig
    api.geoDirections({
      origin: `${pos.lat},${pos.lng}`,
      destination: `${destCoord.lat},${destCoord.lng}`,
    }, token).then((r) => {
      const line = r?.route?.polyline ? decodePolyline(r.route.polyline) : null
      if (!line?.length || !mapRef.current) return
      routeRef.current?.setMap(null)
      routeRef.current = new g.Polyline({
        path: line, map: mapRef.current,
        strokeColor: '#087CF0', strokeWeight: 5, strokeOpacity: 0.75,
      })
    }).catch((err) => console.warn('[ShipmentLiveMap] directions:', err.message || err))
  }, [pos, destCoord, token])

  if (!live?.en_camino || !pos) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: '18px 20px' }}>
      <div style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 12,
        letterSpacing: '.06em', textTransform: 'uppercase', margin: '0 0 12px', color: '#001B45',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#137A45' }}></span>
        {t.driverEnRoute || 'Chofer en camino'}
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, letterSpacing: 0, textTransform: 'none', color: '#8B9DBA' }}>
          {timeAgo(live.ubicacion?.fecha)}
        </span>
      </div>

      {!GOOGLE_MAPS_KEY || mapsFailed ? (
        // Sin Maps JS activada cae a Leaflet + OpenStreetMap (sin key).
        <LeafletMiniMap
          pos={pos}
          destCoord={destCoord}
          destAddress={destAddress}
          driverName={live.conductor?.nombre}
          token={token}
        />
      ) : !mapsReady ? (
        <div style={{ fontSize: 13, color: '#6C82A6', padding: '10px 0' }}>
          {t.loading || 'Cargando mapa…'}
        </div>
      ) : (
        <div ref={mapEl} style={{ width: '100%', height: 260, borderRadius: 12, background: '#EEF4FC' }} />
      )}

      <div style={{ marginTop: 10, fontSize: 12.5, color: '#6C82A6', display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
        {live.conductor?.nombre && <span style={{ fontWeight: 600, color: '#10233F' }}>{live.conductor.nombre}</span>}
        {live.conductor?.vehiculo && <span>{typeof live.conductor.vehiculo === 'object' ? Object.values(live.conductor.vehiculo).filter(Boolean).join(' ') : live.conductor.vehiculo}</span>}
        {live.manifiesto?.codigo && <span>{live.manifiesto.codigo}{live.manifiesto.secuencia ? ` · parada ${live.manifiesto.secuencia}` : ''}</span>}
        {live.ubicacion?.velocidad != null && <span>{Math.round(live.ubicacion.velocidad * 3.6)} km/h</span>}
      </div>
    </div>
  )
}
