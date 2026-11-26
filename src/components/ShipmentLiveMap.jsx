import React from 'react'
import { api } from '../api'
import { usePolling } from './Shared'
import { useGoogleMaps } from './useGoogleMaps'

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

/**
 * Mapa del detalle de envío en camino: dónde va el chofer (GPS) y la ruta
 * solo hasta ESTE envío — sin mostrar las demás paradas del manifiesto.
 */
export default function ShipmentLiveMap({ app, shipment, token }) {
  const t = app.live || {}
  const { ready: mapsReady, failed: mapsFailed } = useGoogleMaps()
  const [live, setLive] = React.useState(null)
  const [destCoord, setDestCoord] = React.useState(null)

  const mapEl = React.useRef(null)
  const mapRef = React.useRef(null)
  const overlaysRef = React.useRef([])
  const routeSigRef = React.useRef('')

  const destAddress = shipment.recipient_address || shipment.destination || ''

  const load = React.useCallback(async (isPoll) => {
    if (!token || !shipment?.id) return
    try {
      const data = await api.getShipmentDriverLocation(shipment.id, token)
      setLive(data)
    } catch (err) {
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
      .catch(() => {})
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
  }, [mapsReady])

  // Marcadores + polyline chofer→destino.
  React.useEffect(() => {
    const g = window.google?.maps
    const map = mapRef.current
    if (!g || !map || !pos) return

    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []
    const bounds = new g.LatLngBounds()

    const driver = new g.Marker({
      position: pos, map, zIndex: 10,
      icon: {
        path: g.SymbolPath.CIRCLE, scale: 15,
        fillColor: '#087CF0', fillOpacity: 1,
        strokeColor: '#fff', strokeWeight: 2.5,
      },
      label: { text: '🚚', fontSize: '13px' },
      title: live?.conductor?.nombre || '',
    })
    overlaysRef.current.push(driver)
    bounds.extend(pos)

    if (destCoord) {
      const dest = new g.Marker({
        position: destCoord, map,
        icon: {
          path: g.SymbolPath.CIRCLE, scale: 12,
          fillColor: '#137A45', fillOpacity: 1,
          strokeColor: '#fff', strokeWeight: 2,
        },
        label: { text: '📦', fontSize: '12px' },
        title: destAddress,
      })
      overlaysRef.current.push(dest)
      bounds.extend(destCoord)

      // Ruta por calles chofer→este envío (Google→OSRM en el backend).
      const sig = `${pos.lat.toFixed(3)},${pos.lng.toFixed(3)}:${destCoord.lat.toFixed(4)},${destCoord.lng.toFixed(4)}`
      if (routeSigRef.current !== sig) {
        routeSigRef.current = sig
        api.geoDirections({
          origin: `${pos.lat},${pos.lng}`,
          destination: `${destCoord.lat},${destCoord.lng}`,
        }, token).then((r) => {
          const line = r?.route?.polyline ? decodePolyline(r.route.polyline) : null
          if (!line?.length) return
          const poly = new g.Polyline({
            path: line, map,
            strokeColor: '#087CF0', strokeWeight: 5, strokeOpacity: 0.75,
          })
          overlaysRef.current.push(poly)
        }).catch(() => {})
      }
    }

    map.fitBounds(bounds, 60)
  }, [pos?.lat, pos?.lng, destCoord, mapsReady])

  if (!live?.en_camino || !pos) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: 24 }}>
      <div style={{
        fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13,
        letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, color: '#001B45',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#137A45' }}></span>
        {t.driverEnRoute || 'Chofer en camino'}
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, letterSpacing: 0, textTransform: 'none', color: '#8B9DBA' }}>
          {timeAgo(live.ubicacion?.fecha)}
        </span>
      </div>

      {mapsFailed || !mapsReady ? (
        <div style={{ fontSize: 13, color: '#6C82A6', padding: '10px 0' }}>
          {mapsFailed
            ? (t.mapFailTitle || 'Google Maps no pudo cargar')
            : (t.loading || 'Cargando mapa…')}
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
