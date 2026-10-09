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
  audit: 'M6 3h9l4 4v14H6z|M9 11h7M9 15h7M9 7h4',
  pricing: 'M5 3h14v18H5z|M8 7h8|M8.5 12h.01M12 12h.01M15.5 12h.01|M8.5 16h.01M12 16h.01M15.5 16h.01',
  requests: 'M9 5h6l2 3v11H7V8zM9 8h6M9 12h6M9 16h4',
  users: 'circle:9,8,3.4|M3.5 20a5.5 5.5 0 0111 0|circle:17,9,2.6|M15.5 14.6a4.5 4.5 0 015 5.4',
  roles: 'M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z|M9.5 12l1.8 1.8L15 10',
  console: 'circle:12,12,3|M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  tower: 'M12 3v18|M7 21l5-6 5 6|M6 7l6-3 6 3|M8 11h8',
  urgent: 'M12 3l9 16H3zM12 9v5M12 17v.1',
  manual: 'circle:9,8,3.4|M3 20a6 6 0 0112 0|M15 12l2 2 4-4',
  batch: 'M4 6h12M4 12h12M4 18h12|M20 6v12',
  review: 'circle:11,11,6|M20 20l-4.5-4.5|M11 8v3l2 2',
  offers: 'circle:12,12,8|M12 8v4l3 2',
  addrchg: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z|M9 10h6M13 8l2 2-2 2',
  notify: 'M6 16v-5a6 6 0 0112 0v5l2 2H4z|M10 20a2 2 0 004 0',
  manifest: 'M6 3h12v18H6z|M9 7h6M9 11h6M9 15h3|M15 15h2v2h-2z',
  breakdown: 'M3 7h11v9H3z|M14 10h4l3 3v3h-7|circle:7,18,1.8|circle:17,18,1.8',
  handover: 'M4 8h13l-3-3|M20 16H7l3 3',
  mantransfer: 'M5 4h9l4 4v12H5z|M14 4v4h4|M8 13h7l-2-2M15 17H8l2 2',
  pkgtrace: 'M4 8l8-4 8 4v8l-8 4-8-4z|M4 8l8 4 8-4|M12 12v8',
  vehrecovery: 'M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-2.5z',
  incost: 'M6 3h12v18l-3-2-3 2-3-2-3 2z|M9 8h6M9 12h6M9 16h3',
  routeopt: 'circle:6,6,2.4|circle:18,18,2.4|M8 6h6a4 4 0 010 8H9a3 3 0 000 6h6',
  forecast: 'M4 19V5M4 19h16|M7 15l4-5 3 3 4-6',
  capplan: 'M4 6h16v12H4z|M8 6v12M12 6v12M16 6v12',
  assign: 'M4 7h10M4 12h10M4 17h6|M17 9l3 3-3 3',
  exrules: 'M12 4l9 16H3z|M12 10v4M12 17v.1',
  tasks: 'M5 5h14v14H5z|M8.5 10l2 2 4-4M8.5 15.5h7',
  shifts: 'M4 6h16v14H4z|M4 10h16M8 4v4M16 4v4|M9 14h2M14 14h2',
  profile: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
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
