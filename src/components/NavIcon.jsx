import React from 'react'

const NAV_ICONS = {
  dashboard: 'M4 13h7V4H4zM13 20h7v-9h-7zM4 20h7v-4H4zM13 8h7V4h-7z',
  shipments: 'M3 7l9-4 9 4v10l-9 4-9-4V7z|M3 7l9 4 9-4',
  create: 'M12 5v14M5 12h14',
  payments: 'M3 7h18v10H3zM3 11h18',
  addresses: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z|circle:12,10,2.6',
  support: 'M21 12a9 9 0 11-3.2-6.9|M8 20l-4 2 1-4',
  ops: 'M4 19V5M4 19h16M8 15l3-4 3 3 4-6',
  dispatch: 'M2 16V7h11v9M13 10h4l3 3v3|circle:6,17.5,1.8|circle:17,17.5,1.8',
  drivers: 'circle:12,8,3.6|M5 20a7 7 0 0114 0',
  incidents: 'M12 3l9 16H3zM12 9v5M12 17v.1',
}

export default function NavIcon({ name, color = '#6C82A6' }) {
  const spec = NAV_ICONS[name]
  if (!spec) return null
  const kids = spec.split('|').map((p, i) => {
    if (p.indexOf('circle:') === 0) {
      const c = p.slice(7).split(',')
      return <circle key={i} cx={c[0]} cy={c[1]} r={c[2]} />
    }
    return <path key={i} d={p} />
  })
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: '0 0 auto' }}
    >
      {kids}
    </svg>
  )
}
