import React from 'react'
import { api, MEDIA_URL } from '../api'
import { Pagination, usePagination, usePolling } from './Shared'

const EMPTY_FORM = { title: '', reference: '', notes: '', file: null }

function formatSize(bytes) {
  const n = Number(bytes)
  if (!n || isNaN(n)) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export default function Audits({ app, lang, token }) {
  const d = app.audit
  const [files, setFiles] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [notice, setNotice] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [formError, setFormError] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [removeId, setRemoveId] = React.useState(null)

  const fetchFiles = React.useCallback(async (isPoll) => {
    if (!token) return
    if (!isPoll) setLoading(true)
    try {
      const data = await api.getAuditFiles(token)
      setFiles(Array.isArray(data) ? data : data.data || [])
      setError('')
    } catch (e) {
      if (!isPoll) setError(e.message || d.error)
    } finally {
      if (!isPoll) setLoading(false)
    }
  }, [token, d.error])

  usePolling(fetchFiles, 30000)

  const filtered = files.filter((f) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return [f.title, f.file_name, f.original_name, f.reference, f.user?.name, f.uploaded_by]
      .some((v) => String(v || '').toLowerCase().includes(q))
  })

  const pager = usePagination(filtered, 10, query)

  const formatDate = (date) => {
    if (!date) return '—'
    const dt = new Date(date)
    if (isNaN(dt.getTime())) return '—'
    return dt.toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'zh' ? 'zh-CN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const fileUrl = (f) => {
    if (f.url) return f.url
    if (f.file_url) return f.file_url
    if (f.file_path) return `${MEDIA_URL}/${f.file_path}`
    return null
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (uploading) return
    if (!form.title.trim() || !form.file) {
      setFormError(d.errRequired)
      return
    }
    setFormError('')
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('title', form.title.trim())
      if (form.reference) fd.append('reference', form.reference)
      if (form.notes) fd.append('notes', form.notes)
      fd.append('file', form.file)
      await api.uploadAuditFile(fd, token)
      setShowForm(false)
      setForm(EMPTY_FORM)
      setNotice(d.uploaded)
      setTimeout(() => setNotice(''), 5000)
      await fetchFiles()
    } catch (e2) {
      setFormError(e2.message || d.uploadError)
    } finally {
      setUploading(false)
    }
  }

  const doRemove = async (id) => {
    setRemoveId(null)
    setError('')
    try {
      await api.deleteAuditFile(id, token)
      setFiles((prev) => prev.filter((f) => f.id !== id))
      setNotice(d.removed)
      setTimeout(() => setNotice(''), 5000)
    } catch (e) {
      setError(e.message || d.removeError)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid #DCE6F5', borderRadius: 10, fontSize: 14, outline: 'none' }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6C82A6', marginBottom: 6 }

  return (
    <div>
      <div className="app-motif" aria-hidden="true">
        <span style={{ background: '#D99A00' }}></span>
        <span style={{ background: '#087CF0', width: 9 }}></span>
      </div>
      <div className="app-greeting">{d.greeting}</div>

      {error && (
        <div style={{ padding: 14, background: 'rgba(192,57,43,.08)', color: '#A93226', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}
      {notice && (
        <div style={{ padding: 14, background: 'rgba(19,122,69,.1)', color: '#0F5F36', borderRadius: 11, marginBottom: 20, fontSize: 14 }}>
          {notice}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleUpload} className="app-card" style={{ padding: 20, marginBottom: 20 }}>
          <div className="app-card-title" style={{ marginBottom: 14 }}>{d.formT}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>{d.f.title}</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={d.f.titlePh} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{d.f.ref}</label>
              <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder={d.f.refPh} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{d.f.notes}</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={d.f.notesPh} style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>{d.f.file}</span>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                border: `1.5px dashed ${form.file ? '#087CF0' : '#DCE6F5'}`, borderRadius: 10,
                background: '#EEF4FC', cursor: 'pointer', fontSize: 13,
                color: form.file ? '#001B45' : '#6C82A6', overflow: 'hidden',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#087CF0" strokeWidth="1.8" style={{ flex: '0 0 auto' }}>
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
                </svg>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.file ? form.file.name : d.f.chooseFile}</span>
                <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files[0] || null })} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          {formError && (
            <div role="alert" style={{ fontSize: 13, color: '#A93226', fontWeight: 600, marginBottom: 14 }}>{formError}</div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError('') }} style={{ padding: '10px 16px', border: '1.5px solid #DCE6F5', borderRadius: 10, background: '#fff', color: '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{d.cancel}</button>
            <button type="submit" disabled={uploading} className="app-primary" style={{ padding: '10px 16px' }}>{uploading ? d.uploading : d.submit}</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 className="app-h1" style={{ marginBottom: 8 }}>{d.title}</h1>
          <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch' }}>{d.sub}</p>
        </div>
        <button className="app-primary" onClick={() => setShowForm(true)} style={{ marginLeft: 'auto' }}>{d.uploadBtn}</button>
      </div>

      <div className="app-card">
        <div className="app-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="app-card-title">{d.listTitle}</span>
          {loading && <span style={{ fontSize: 12, color: '#6C82A6' }}>{d.loading}</span>}
        </div>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #DCE6F5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1.5px solid #DCE6F5', borderRadius: 11, background: '#EEF4FC', maxWidth: 420 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B9DBA" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={d.searchPh}
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#001B45' }}
            />
          </div>
        </div>

        <div className="app-table-scroll">
          <div className="app-table" style={{ minWidth: 860 }}>
            <div className="app-table-head" style={{ gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr .8fr 1fr' }}>
              {d.cols.map((col, i) => (<span key={i}>{col}</span>))}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#6C82A6', fontSize: 14 }}>{d.empty}</div>
            )}
            {pager.pageItems.map((f) => {
              const url = fileUrl(f)
              const name = f.original_name || f.file_name || (f.file_path ? f.file_path.split('/').pop() : '—')
              const size = formatSize(f.size || f.file_size)
              const uploader = f.user?.name || f.uploaded_by || '—'
              return (
                <div key={f.id} className="app-table-row" style={{ gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr .8fr 1fr', alignItems: 'center' }}>
                  <span className="app-table-text" style={{ fontWeight: 600 }}>{f.title || '—'}</span>
                  <span className="app-table-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name}{size ? ` · ${size}` : ''}
                  </span>
                  <span className="app-table-text">{f.reference || '—'}</span>
                  <span className="app-table-text">{uploader}</span>
                  <span className="app-table-text">{formatDate(f.created_at)}</span>
                  <span style={{ display: 'flex', gap: 12, justifySelf: 'end' }}>
                    {url && <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 600, color: '#087CF0', textDecoration: 'none' }}>{d.view}</a>}
                    <button onClick={() => setRemoveId(f.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#A93226' }}>{d.remove}</button>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Pagination pager={pager} labels={app.pager} />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', border: '1px dashed #DCE6F5', background: '#EEF4FC', borderRadius: 14, padding: '16px 18px', marginTop: 16 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0768C9" strokeWidth="1.8" style={{ flex: '0 0 auto', marginTop: 1 }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 7.8v.1" />
        </svg>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: '#25456E', textWrap: 'pretty' }}>{d.note}</p>
      </div>

      {removeId && (
        <div onClick={() => setRemoveId(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,27,69,.55)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 420, padding: 28,
            boxShadow: '0 20px 60px rgba(0,27,69,.25)', border: '1px solid #DCE6F5',
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(217,154,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D99A00" strokeWidth="1.8">
                  <path d="M12 3l9 16H3z" />
                  <path d="M12 9v5M12 17v.1" />
                </svg>
              </div>
              <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 18, color: '#001B45' }}>{d.confirmRemove}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setRemoveId(null)} style={{
                flex: 1, padding: '14px 20px', background: '#fff', border: '1.5px solid #DCE6F5', borderRadius: 11,
                color: '#10233F', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{d.cancel}</button>
              <button onClick={() => doRemove(removeId)} style={{
                flex: 1, padding: '14px 20px', background: '#C0392B', border: 'none', borderRadius: 11,
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>{d.remove}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
