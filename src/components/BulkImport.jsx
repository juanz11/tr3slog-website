import React from 'react'
import * as XLSX from 'xlsx'
import { api } from '../api'

const T = {
  es: {
    title: 'Carga masiva de envíos',
    sub: 'Sube un Excel, CSV o XML. La IA interpreta las columnas y reconstruye cada fila como un envío. Cada fila cuenta como un viaje.',
    step1: '1 · Archivo y remitente',
    step2: '2 · Revisión',
    step3: '3 · Resultado',
    fileLabel: 'Archivo de envíos',
    fileHint: '.xlsx, .xls, .csv, .xml, .json o .txt — máx. 500 filas',
    analyze: 'Analizar con IA',
    analyzing: 'La IA está interpretando tu archivo…',
    senderT: 'Remitente por defecto (se aplica a todas las filas)',
    senderSaved: 'Usar dirección guardada',
    senderManual: 'Escribir remitente',
    senderName: 'Nombre / empresa',
    senderAddress: 'Dirección',
    senderCity: 'Ciudad',
    senderCountry: 'País (ej. DO, CR, US)',
    senderZip: 'Código postal',
    senderPhone: 'Teléfono',
    senderEmail: 'Email',
    previewT: (n) => `Se encontraron ${n} envíos`,
    aiUsed: 'Interpretado por IA',
    aiFallback: 'La IA no estuvo disponible; se usó mapeo automático. Revisa bien antes de importar.',
    warnings: 'Advertencias',
    missing: 'Columnas o datos que podrían faltar',
    colDest: 'Destino',
    colRecipient: 'Destinatario',
    colPhone: 'Teléfono',
    colCity: 'Ciudad',
    colNotes: 'Notas',
    importBtn: (n) => `Importar ${n} envíos`,
    importing: 'Importando…',
    progress: (i, n) => `${i} de ${n}`,
    done: 'Carga completada',
    created: 'Envíos creados',
    failed: 'Fallidos',
    failedDetail: 'Filas con error',
    newUpload: 'Nueva carga',
    noContract: 'La carga masiva está disponible para clientes con contrato activo (ejecutivos y agentes).',
    contractActive: (u) => `Contrato ${u?.code || ''}: te quedan ${u?.remaining ?? '—'} envíos`,
    errGeneric: 'Error al leer el archivo',
    emptyFile: 'El archivo no contiene filas de datos.',
    tooMany: 'Máximo 500 filas por carga.',
    prohibitedNote: 'Al importar declaras que ningún envío contiene artículos prohibidos.',
  },
  en: {
    title: 'Bulk shipment upload',
    sub: 'Upload an Excel, CSV or XML file. AI interprets the columns and rebuilds each row as a shipment. Each row counts as one trip.',
    step1: '1 · File & sender',
    step2: '2 · Review',
    step3: '3 · Result',
    fileLabel: 'Shipments file',
    fileHint: '.xlsx, .xls, .csv, .xml, .json or .txt — max 500 rows',
    analyze: 'Analyze with AI',
    analyzing: 'AI is interpreting your file…',
    senderT: 'Default sender (applied to all rows)',
    senderSaved: 'Use saved address',
    senderManual: 'Enter sender manually',
    senderName: 'Name / company',
    senderAddress: 'Address',
    senderCity: 'City',
    senderCountry: 'Country (e.g. DO, CR, US)',
    senderZip: 'Zip code',
    senderPhone: 'Phone',
    senderEmail: 'Email',
    previewT: (n) => `${n} shipments found`,
    aiUsed: 'Interpreted by AI',
    aiFallback: 'AI was unavailable; automatic mapping was used. Review carefully before importing.',
    warnings: 'Warnings',
    missing: 'Columns or data that may be missing',
    colDest: 'Destination',
    colRecipient: 'Recipient',
    colPhone: 'Phone',
    colCity: 'City',
    colNotes: 'Notes',
    importBtn: (n) => `Import ${n} shipments`,
    importing: 'Importing…',
    progress: (i, n) => `${i} of ${n}`,
    done: 'Upload complete',
    created: 'Shipments created',
    failed: 'Failed',
    failedDetail: 'Rows with errors',
    newUpload: 'New upload',
    noContract: 'Bulk upload is available for contract clients (executives and agents).',
    contractActive: (u) => `Contract ${u?.code || ''}: ${u?.remaining ?? '—'} shipments left`,
    errGeneric: 'Error reading the file',
    emptyFile: 'The file contains no data rows.',
    tooMany: 'Maximum 500 rows per upload.',
    prohibitedNote: 'By importing you declare that no shipment contains prohibited items.',
  },
  'zh-CN': {
    title: '批量上传运单',
    sub: '上传 Excel、CSV 或 XML 文件。AI 会解析列并将每行重建为一张运单。每行计为一程。',
    step1: '1 · 文件与寄件人',
    step2: '2 · 预览',
    step3: '3 · 结果',
    fileLabel: '运单文件',
    fileHint: '.xlsx、.xls、.csv、.xml、.json 或 .txt — 最多 500 行',
    analyze: '用 AI 分析',
    analyzing: 'AI 正在解析您的文件…',
    senderT: '默认寄件人（应用于所有行）',
    senderSaved: '使用已存地址',
    senderManual: '手动输入寄件人',
    senderName: '姓名 / 公司',
    senderAddress: '地址',
    senderCity: '城市',
    senderCountry: '国家（如 DO、CR、US）',
    senderZip: '邮编',
    senderPhone: '电话',
    senderEmail: '邮箱',
    previewT: (n) => `找到 ${n} 张运单`,
    aiUsed: '由 AI 解析',
    aiFallback: 'AI 不可用，使用了自动映射。导入前请仔细检查。',
    warnings: '警告',
    missing: '可能缺失的列或数据',
    colDest: '目的地',
    colRecipient: '收件人',
    colPhone: '电话',
    colCity: '城市',
    colNotes: '备注',
    importBtn: (n) => `导入 ${n} 张运单`,
    importing: '导入中…',
    progress: (i, n) => `${i} / ${n}`,
    done: '上传完成',
    created: '已创建运单',
    failed: '失败',
    failedDetail: '出错的行',
    newUpload: '新上传',
    noContract: '批量上传仅对合同客户（主管和代理）开放。',
    contractActive: (u) => `合同 ${u?.code || ''}：剩余 ${u?.remaining ?? '—'} 单`,
    errGeneric: '读取文件时出错',
    emptyFile: '文件不包含数据行。',
    tooMany: '每次最多上传 500 行。',
    prohibitedNote: '导入即表示您声明所有运单不含违禁物品。',
  },
}

const card = { background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: 24 }
const inputStyle = { width: '100%', padding: '11px 13px', border: '1.5px solid #DCE6F5', borderRadius: 9, background: '#EEF4FC', color: '#001B45', fontSize: 13, outline: 'none', boxSizing: 'border-box' }
const btn = (bg = '#087CF0', fg = '#fff') => ({ padding: '11px 18px', borderRadius: 10, border: 'none', background: bg, color: fg, fontWeight: 600, fontSize: 14, cursor: 'pointer' })
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#8B9DBA', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }

const SENDER_FIELDS = [
  ['name', 'senderName'], ['address', 'senderAddress'], ['city', 'senderCity'],
  ['country', 'senderCountry'], ['zip', 'senderZip'], ['phone', 'senderPhone'], ['email', 'senderEmail'],
]

export default function BulkImport({ lang, token, user, onGoAddresses }) {
  const t = T[lang] || T.es
  const [step, setStep] = React.useState('upload') // upload | preview | progress | done
  const [file, setFile] = React.useState(null)
  const [parsing, setParsing] = React.useState(false)
  const [error, setError] = React.useState('')
  const [companyInfo, setCompanyInfo] = React.useState(null)
  const [addresses, setAddresses] = React.useState([])
  const [senderMode, setSenderMode] = React.useState('saved')
  const [senderAddrId, setSenderAddrId] = React.useState('')
  const [sender, setSender] = React.useState({ name: '', address: '', city: '', country: '', zip: '', phone: '', email: '' })
  const [parsed, setParsed] = React.useState(null) // {shipments, warnings, missing_columns, ai_used}
  const [prohibitedDocId, setProhibitedDocId] = React.useState(null)
  const [progress, setProgress] = React.useState({ i: 0, total: 0 })
  const [results, setResults] = React.useState({ created: 0, failed: [] })

  React.useEffect(() => {
    if (!token) return
    api.getCompany(token).then(setCompanyInfo).catch(() => {})
    api.getAddresses(token).then((res) => setAddresses(Array.isArray(res) ? res : res.addresses || [])).catch(() => {})
    api.getLegalDocument('prohibited_items', token).then((d) => setProhibitedDocId(d?.id)).catch(() => {})
  }, [token])

  const isContractUser = ['executive_client', 'company', 'shipment_agent'].includes(
    (user?.roles || []).map((r) => r.name || r).find((r) => ['executive_client', 'company', 'shipment_agent'].includes(r)) || ''
  )

  const readFile = async (f) => {
    const name = (f.name || '').toLowerCase()
    const buf = await f.arrayBuffer()
    if (/\.(xlsx|xls|csv)$/.test(name)) {
      const wb = XLSX.read(buf, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
      const headerIdx = grid.findIndex((r) => r.some((c) => String(c).trim() !== ''))
      if (headerIdx < 0) throw new Error(t.emptyFile)
      const headers = grid[headerIdx].map((h, i) => String(h || `col_${i + 1}`).trim())
      const rows = []
      for (let i = headerIdx + 1; i < grid.length; i++) {
        const r = grid[i]
        if (!r || !r.some((c) => String(c).trim() !== '')) continue
        const obj = {}
        headers.forEach((h, j) => { if (h && r[j] !== undefined && String(r[j]).trim() !== '') obj[h] = r[j] })
        rows.push(obj)
      }
      if (!rows.length) throw new Error(t.emptyFile)
      if (rows.length > 500) throw new Error(t.tooMany)
      return { rows }
    }
    const text = new TextDecoder('utf-8').decode(buf)
    return { raw_text: text.slice(0, 200000) }
  }

  const analyze = async () => {
    if (!file || !token) return
    if (companyInfo && !companyInfo.company) { setError(t.noContract); return }
    setParsing(true); setError('')
    try {
      const content = await readFile(file)
      const senderDefaults = senderMode === 'saved' && senderAddrId
        ? senderFromAddress(addresses.find((a) => String(a.id) === String(senderAddrId)))
        : sender
      const res = await api.parseBulkImport({
        filename: file.name,
        ...content,
        sender_defaults: senderDefaults,
      }, token)
      const shipments = (res.shipments || []).filter((s) => s && (s.recipient_name || s.destination || s.recipient_phone))
      if (!shipments.length) throw new Error(t.emptyFile)
      setParsed({ ...res, shipments })
      setStep('preview')
    } catch (e) {
      setError(e.message || t.errGeneric)
    } finally {
      setParsing(false)
    }
  }

  const senderFromAddress = (a) => a ? {
    name: a.name || '', address: a.address || '', city: a.city || '',
    country: a.country || '', zip: a.zip_code || '', phone: a.phone || '', email: a.email || '',
  } : sender

  const senderPayload = () => senderMode === 'saved' && senderAddrId
    ? senderFromAddress(addresses.find((a) => String(a.id) === String(senderAddrId)))
    : sender

  const buildPayload = (s) => {
    const sd = senderPayload()
    return {
      origin: s.origin || [sd.city, sd.country].filter(Boolean).join(', ') || undefined,
      destination: s.destination || [s.recipient_city, s.recipient_country].filter(Boolean).join(', ') || undefined,
      sender_name: sd.name || undefined,
      sender_company: s.sender_company || undefined,
      sender_address: sd.address || undefined,
      sender_city: sd.city || undefined,
      sender_country: sd.country || undefined,
      sender_zip: sd.zip || undefined,
      sender_phone: sd.phone || undefined,
      sender_email: sd.email || undefined,
      recipient_name: s.recipient_name || undefined,
      recipient_company: s.recipient_company || undefined,
      recipient_address: s.recipient_address || undefined,
      recipient_city: s.recipient_city || undefined,
      recipient_country: s.recipient_country || undefined,
      recipient_zip: s.recipient_zip || undefined,
      recipient_phone: s.recipient_phone || undefined,
      recipient_email: s.recipient_email || undefined,
      service_type: 'Terrestre',
      delivery_mode: s.delivery_mode === 'same_day' ? 'same_day' : 'standard',
      notes: s.notes || undefined,
      packages: [{ type: 'package', pieces: '1', content: s.notes || 'Carga', fragile: false }],
      prohibited_accepted: true,
      prohibited_document_id: prohibitedDocId,
    }
  }

  const runImport = async () => {
    if (!parsed || !token) return
    const list = parsed.shipments
    setStep('progress')
    const failed = []
    let created = 0
    for (let i = 0; i < list.length; i++) {
      setProgress({ i: i + 1, total: list.length })
      try {
        await api.createShipment(buildPayload(list[i]), token)
        created++
      } catch (e) {
        const code = e?.body?.code || ''
        failed.push({ row: i + 1, name: list[i].recipient_name || `#${i + 1}`, error: e.message || 'error' })
        if (code.startsWith('contract_')) break // cupo agotado/suspendido: no seguir
      }
    }
    setResults({ created, failed })
    setStep('done')
  }

  const reset = () => { setStep('upload'); setFile(null); setParsed(null); setResults({ created: 0, failed: [] }); setError('') }

  const usage = companyInfo?.usage
  const contractUser = isContractUser && companyInfo?.company

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        <span style={{ width: 24, height: 5, background: '#D99A00', transform: 'skewX(-24deg)' }}></span>
        <span style={{ width: 9, height: 5, background: '#087CF0', transform: 'skewX(-24deg)' }}></span>
      </div>
      <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '-.02em', margin: '0 0 6px', color: '#001B45' }}>{t.title}</h1>
      <p style={{ margin: '0 0 20px', color: '#6C82A6', fontSize: 14, maxWidth: 720 }}>{t.sub}</p>

      {usage && contractUser && (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(8,124,240,.06)', border: '1.5px solid #C9DCF5', fontSize: 13, color: '#0768C9' }}>
          {t.contractActive(usage)}
        </div>
      )}

      {step === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={card}>
            <div style={labelStyle}>{t.fileLabel}</div>
            <input type="file" accept=".xlsx,.xls,.csv,.xml,.json,.txt" onChange={(e) => { setFile(e.target.files?.[0] || null); setError('') }}
              style={{ fontSize: 13, color: '#10233F' }} />
            <div style={{ fontSize: 12, color: '#8B9DBA', marginTop: 6 }}>{t.fileHint}</div>
            {file && <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: '#001B45' }}>{file.name}</div>}
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 14 }}>{t.senderT}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[['saved', t.senderSaved], ['manual', t.senderManual]].map(([k, l]) => (
                <button key={k} type="button" onClick={() => setSenderMode(k)}
                  style={{ padding: '9px 14px', borderRadius: 100, border: `1.5px solid ${senderMode === k ? '#087CF0' : '#DCE6F5'}`, background: senderMode === k ? 'rgba(8,124,240,.08)' : '#fff', color: senderMode === k ? '#0768C9' : '#10233F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
            {senderMode === 'saved' ? (
              addresses.length === 0 ? (
                <div style={{ padding: '14px 16px', borderRadius: 10, background: '#F6FAFF', border: '1.5px dashed #C9DCF5' }}>
                  <div style={{ fontSize: 13, color: '#10233F', marginBottom: 10 }}>No tienes direcciones guardadas todavía.</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => setSenderMode('manual')}
                      style={{ padding: '9px 14px', borderRadius: 9, border: 'none', background: '#087CF0', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Escribir remitente manual
                    </button>
                    {onGoAddresses && (
                      <button type="button" onClick={onGoAddresses}
                        style={{ padding: '9px 14px', borderRadius: 9, border: '1.5px solid #DCE6F5', background: '#fff', color: '#001B45', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Ir a Direcciones
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <select value={senderAddrId} onChange={(e) => setSenderAddrId(e.target.value)} style={inputStyle}>
                  <option value="">—</option>
                  {addresses.map((a) => <option key={a.id} value={a.id}>{[a.name, a.city].filter(Boolean).join(' · ')}</option>)}
                </select>
              )
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
                {SENDER_FIELDS.map(([k, label]) => (
                  <div key={k}>
                    <label style={labelStyle}>{t[label]}</label>
                    <input value={sender[k]} onChange={(e) => setSender({ ...sender, [k]: e.target.value })} style={inputStyle} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div style={{ background: '#FDECEC', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>{error}</div>}

          <div>
            <button onClick={analyze} disabled={!file || parsing || !token} style={{ ...btn(), opacity: !file || parsing ? .6 : 1 }}>
              {parsing ? t.analyzing : t.analyze}
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && parsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 700, color: '#001B45', fontSize: 16 }}>{t.previewT(parsed.shipments.length)}</div>
              <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: parsed.ai_used ? '#E7F6EC' : '#FFF3D6', color: parsed.ai_used ? '#0F5F36' : '#8A6300' }}>
                {parsed.ai_used ? `✓ ${t.aiUsed}` : t.aiFallback}
              </span>
            </div>
            {(parsed.warnings || []).length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={labelStyle}>{t.warnings}</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#8A6300', lineHeight: 1.7 }}>
                  {parsed.warnings.slice(0, 8).map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
            {(parsed.missing_columns || []).length > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: '#FFF9EC', border: '1px solid #F0C36D', fontSize: 13, color: '#8A6300' }}>
                <strong>{t.missing}:</strong> {parsed.missing_columns.join(', ')}
              </div>
            )}
          </div>

          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F6FAFF', textAlign: 'left' }}>
                    {[t.colDest, t.colRecipient, t.colPhone, t.colCity, t.colNotes].map((h) => (
                      <th key={h} style={{ padding: '11px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8B9DBA', borderBottom: '1px solid #DCE6F5' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.shipments.slice(0, 50).map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #EEF4FC' }}>
                      <td style={{ padding: '10px 16px', color: '#10233F' }}>{s.destination || '—'}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#001B45' }}>{s.recipient_name || '—'}</td>
                      <td style={{ padding: '10px 16px', color: '#10233F' }}>{s.recipient_phone || '—'}</td>
                      <td style={{ padding: '10px 16px', color: '#10233F' }}>{s.recipient_city || '—'}</td>
                      <td style={{ padding: '10px 16px', color: '#6C82A6', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsed.shipments.length > 50 && <div style={{ padding: '10px 16px', fontSize: 12, color: '#8B9DBA' }}>…y {parsed.shipments.length - 50} más</div>}
          </div>

          <div style={{ fontSize: 12, color: '#8B9DBA' }}>{t.prohibitedNote}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={reset} style={{ ...btn('#EEF4FC', '#10233F'), border: '1.5px solid #DCE6F5' }}>{t.newUpload}</button>
            <button onClick={runImport} style={btn()}>{t.importBtn(parsed.shipments.length)}</button>
          </div>
        </div>
      )}

      {step === 'progress' && (
        <div style={card}>
          <div style={{ fontWeight: 700, color: '#001B45', marginBottom: 14 }}>{t.importing}</div>
          <div style={{ height: 10, borderRadius: 100, background: '#EEF4FC', overflow: 'hidden' }}>
            <div style={{ width: `${(progress.i / Math.max(1, progress.total)) * 100}%`, height: '100%', background: '#087CF0', transition: 'width .2s' }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#6C82A6' }}>{t.progress(progress.i, progress.total)}</div>
        </div>
      )}

      {step === 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...card, borderColor: '#C6E6D4', background: '#F1FAF5' }}>
            <div style={{ fontWeight: 700, color: '#0F5F36', fontSize: 17 }}>{t.done}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 24, fontSize: 15 }}>
              <span style={{ color: '#0F5F36' }}>✓ {t.created}: <b>{results.created}</b></span>
              <span style={{ color: results.failed.length ? '#B91C1C' : '#6C82A6' }}>✗ {t.failed}: <b>{results.failed.length}</b></span>
            </div>
          </div>
          {results.failed.length > 0 && (
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', fontWeight: 700, color: '#001B45', borderBottom: '1px solid #EEF4FC' }}>{t.failedDetail}</div>
              {results.failed.slice(0, 30).map((f, i) => (
                <div key={i} style={{ padding: '10px 18px', borderBottom: '1px solid #EEF4FC', fontSize: 13, display: 'flex', gap: 12 }}>
                  <span style={{ color: '#8B9DBA', minWidth: 40 }}>#{f.row}</span>
                  <span style={{ fontWeight: 600, color: '#001B45', minWidth: 140 }}>{f.name}</span>
                  <span style={{ color: '#B91C1C' }}>{f.error}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={reset} style={{ ...btn('#001B45', '#fff'), alignSelf: 'flex-start' }}>{t.newUpload}</button>
        </div>
      )}

      {!contractUser && companyInfo && !companyInfo.company && (
        <div style={{ ...card, borderColor: '#F0C36D', background: '#FFF9EC', color: '#8A6300', fontSize: 14 }}>{t.noContract}</div>
      )}
    </div>
  )
}
