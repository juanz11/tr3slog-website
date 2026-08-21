import AppShell from '../src/components/AppShell'

export default function Dashboard({ user, onLogout, lang, langs, setLang, onUserUpdate }) {
  if (!user) return null
  return (
    <AppShell
      user={user}
      onLogout={onLogout}
      lang={lang}
      langs={langs}
      setLang={setLang}
      onUserUpdate={onUserUpdate}
    />
  )
}
