import AppShell from '../src/components/AppShell'

export default function Dashboard({ user, onLogout, lang, langs, setLang }) {
  if (!user) return null
  return (
    <AppShell
      user={user}
      lang={lang}
      langs={langs}
      setLang={setLang}
      onLogout={onLogout}
    />
  )
}
