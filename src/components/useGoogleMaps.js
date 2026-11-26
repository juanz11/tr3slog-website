import React from 'react'

export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const SCRIPT_ID = 'gmp-maps-js'

export function useGoogleMaps() {
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

const LEAFLET_JS = 'lf-leaflet-js'
const LEAFLET_CSS = 'lf-leaflet-css'

/** Leaflet + OSM: respaldo sin API key cuando Maps JS no está activado. */
export function useLeaflet() {
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  React.useEffect(() => {
    if (window.L?.Map) { setReady(true); return }
    if (!document.getElementById(LEAFLET_CSS)) {
      const css = document.createElement('link')
      css.id = LEAFLET_CSS
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(css)
    }
    let s = document.getElementById(LEAFLET_JS)
    const onLoad = () => setReady(true)
    const onError = () => setFailed(true)
    if (!s) {
      s = document.createElement('script')
      s.id = LEAFLET_JS
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.async = true
      document.head.appendChild(s)
    }
    s.addEventListener('load', onLoad)
    s.addEventListener('error', onError)
    if (window.L?.Map) setReady(true)
    return () => {
      s?.removeEventListener?.('load', onLoad)
      s?.removeEventListener?.('error', onError)
    }
  }, [])
  return { ready, failed }
}
