import React from 'react'
import dynamic from 'next/dynamic'
import opsConfig from './opsConfig'

const FinancePortal = dynamic(() => import('../finance-portal/FinancePortal.jsx'), { ssr: false })

const labels = {
  en: 'EN',
  es: 'ES',
  'zh-CN': 'ZH'
}

export default function AdvancedOpsPortalEntry({ lang, setLang, user, onLogout }) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let on = true
    Promise.all([
      import('./i18n/ops.es.js'),
      import('./i18n/ops.en.js'),
      import('./i18n/ops.zh-CN.js'),
    ]).then(() => { if (on) setReady(true) })
    return () => { on = false }
  }, [])

  if (!ready) return null

  const name = user?.name || user?.email || ''
  const account = {
    name,
    email: user?.email || '',
    initials: (name || 'OP').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
  }

  const raw = typeof window !== 'undefined' ? window.TR3S_I18N : {}
  const dict = {}
  ;['es', 'en', 'zh-CN'].forEach((code) => {
    dict[code] = { ...(raw[code] || {}), label: labels[code] }
  })

  return (
    <FinancePortal
      key={lang}
      config={opsConfig}
      dict={dict}
      lang={lang}
      defaultRole="ops"
      onLogout={onLogout}
      onLangChange={setLang}
      account={account}
    />
  )
}
