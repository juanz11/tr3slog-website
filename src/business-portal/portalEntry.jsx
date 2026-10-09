import React from 'react'
import dynamic from 'next/dynamic'

const BusinessPortal = dynamic(() => import('./BusinessPortal.jsx'), { ssr: false })

export default function BusinessPortalEntry({ lang, user, onLogout }) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let on = true
    Promise.all([
      import('./i18n/biz.es.js'),
      import('./i18n/biz.en.js'),
      import('./i18n/biz.zh-CN.js'),
      import('./i18n/app.es.js'),
      import('./i18n/app.en.js'),
      import('./i18n/app.zh-CN.js'),
    ]).then(() => { if (on) setReady(true) })
    return () => { on = false }
  }, [])

  if (!ready) return null

  const name = user?.name || user?.email || ''
  const account = {
    name,
    email: user?.email || '',
    initials: (name || 'US').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
  }

  return <BusinessPortal key={lang} lang={lang} onLogout={onLogout} account={account} />
}
