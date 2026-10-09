import React from 'react'

const DEFAULT = {
  title: 'Manifiestos de ruta',
  subtitle: 'Generar el manifiesto de cada ruta aceptada, entregarlo en digital a la app del chofer e imprimir la copia física con códigos QR.',
  stats: [
    { k: 'Rutas sin manifiesto', v: '——', d: 'Con órdenes aceptadas' },
    { k: 'Emitidos hoy', v: '——', d: 'Referencia' },
    { k: 'Reimpresiones', v: '——', d: 'Registradas en auditoría' },
    { k: 'Versiones reemplazadas', v: '——', d: 'Hoy' },
  ],
  brand: 'TR3SLOG',
  manifestTitle: 'Manifiesto de carga',
  manifestLabel: 'Manifiesto',
  routeLabel: 'Ruta',
  driverLabel: 'Chofer',
  vehicleLabel: 'Vehículo',
  hubLabel: 'Hub',
  dateLabel: 'Fecha',
  badge: 'Sin generar',
  generate: 'Generar manifiesto',
  send: 'Emitir y enviar a la app',
  print: 'Imprimir',
  tabDigital: 'Vista digital',
  tabPrinted: 'Vista impresa',
  draftNote: 'Borrador. Solo entran las órdenes que el chofer ya aceptó.',
  tableHeaders: ['#', 'Tracking ID', 'QR', 'Destino', 'Ventana', 'Piezas', 'Escaneo de carga'],
  rows: [
    { n: 1, tracking: 'TR3-260729-PRSJ-00131', dest: 'Guaynabo', window: '09:00–12:00', pieces: 2, status: 'Por cargar' },
    { n: 2, tracking: 'TR3-260729-PRSJ-00136', dest: 'San Juan', window: '09:00–12:00', pieces: 1, status: 'Por cargar' },
    { n: 3, tracking: 'TR3-260729-PRSJ-00139', dest: 'Bayamón', window: '10:00–13:00', pieces: 3, status: 'Por cargar' },
    { n: 4, tracking: 'TR3-260729-PRSJ-00142', dest: 'Bayamón', window: '13:00–16:00', pieces: 3, status: 'Por cargar' },
    { n: 5, tracking: 'TR3-260729-PRSJ-00147', dest: 'Bayamón', window: '13:00–16:00', pieces: 1, status: 'Por cargar' },
    { n: 6, tracking: 'TR3-260729-PRSJ-00153', dest: 'Guaynabo', window: '14:00–17:00', pieces: 2, status: 'Por cargar' },
  ],
  manifestId: 'MAN-RT-2607-A-v1',
  route: 'RT-2607-A',
  driver: 'E. Rivera',
  vehicle: 'Van 04',
  hub: 'Hub San Juan',
  date: '29 jul 2026 · 07:40',
  qrDemo: 'QR de demostración · no escaneable. Representa el tracking ID; el sistema real lo genera al emitir.',
  qrCopy: 'Copia impresa válida solo para la versión indicada en el QR.',
  stepsTitle: 'Del inicio al cierre',
  steps: ['Chofer acepta', 'Generar manifiesto', 'Revisar paradas', 'Emitir digital e imprimir', 'Carga con escaneo', 'En ruta', 'Cierre y archivo'],
  advance: 'Avanzar',
  digitalTitle: 'Manifiesto digital',
  digitalRows: [
    { k: 'Dónde se ve', v: 'App del chofer y Operaciones' },
    { k: 'Se actualiza', v: 'Con cada versión emitida' },
    { k: 'Escaneo', v: 'QR o tracking ID, validado contra la versión vigente' },
    { k: 'Fuente de verdad', v: 'Sí' },
  ],
  printedTitle: 'Manifiesto impreso',
  printedRows: [
    { k: 'Para qué', v: 'Respaldo sin señal y firma física de salida' },
    { k: 'Contiene', v: 'QR del manifiesto y QR por paquete' },
    { k: 'Versión', v: 'Va en el QR; una copia vieja se detecta al escanear' },
    { k: 'Reimpresión', v: 'Queda registrada en la auditoría' },
  ],
  versionsTitle: 'Versiones',
  versionsEmpty: 'No hay versiones registradas.',
  note: 'El manifiesto solo incluye órdenes aceptadas. Ninguna versión se borra: una nueva emisión reemplaza a la anterior y ambas quedan en la auditoría.',
}

function qrPath(value) {
  const N = 29
  const grid = Array(N).fill(0).map(() => Array(N).fill(0))
  const setFinder = (r0, c0) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const border = r === 0 || r === 6 || c === 0 || c === 6
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        grid[r0 + r][c0 + c] = border || inner ? 1 : 0
      }
    }
  }
  setFinder(0, 0)
  setFinder(0, N - 7)
  setFinder(N - 7, 0)
  let h = 0
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) % 1000003
  }
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)) continue
      h = (h * 31 + (r + 1) * (c + 1)) % 1000003
      grid[r][c] = h % 2
    }
  }
  const parts = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c]) parts.push(`M${c} ${r}h1v1h-1z`)
    }
  }
  return parts.join('')
}

function Qr({ value, size = 44, label }) {
  const path = React.useMemo(() => qrPath(value), [value])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 29 29"
        shapeRendering="crispEdges"
        role="img"
        aria-label={label || `QR ${value}`}
        style={{ display: 'block' }}
      >
        <rect width="29" height="29" fill="#fff" />
        <path fill="#001B45" d={path} />
      </svg>
      {label && (
        <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#10233F' }}>{label}</div>
      )}
    </div>
  )
}

export default function Manifest({ app }) {
  const t = app?.manifest || DEFAULT
  const [view, setView] = React.useState('digital')
  const [step, setStep] = React.useState(0)

  return (
    <div style={{ maxWidth: 1220, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          <span style={{ width: 24, height: 5, background: '#D99A00', transform: 'skewX(-24deg)' }} />
          <span style={{ width: 9, height: 5, background: '#087CF0', transform: 'skewX(-24deg)' }} />
        </div>
        <h1 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', margin: '0 0 8px', textWrap: 'pretty', color: '#001B45' }}>
          {t.title}
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#10233F', maxWidth: '70ch', lineHeight: 1.6, textWrap: 'pretty' }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {t.stats.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: 20 }}>
            <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
              <span style={{ width: 20, height: 4, background: '#D99A00', transform: 'skewX(-24deg)' }} />
              <span style={{ width: 8, height: 4, background: '#087CF0', transform: 'skewX(-24deg)' }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6C82A6', lineHeight: 1.4, minHeight: 34 }}>{s.k}</div>
            <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '-.02em', color: '#001B45', margin: '6px 0 4px' }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#8B9DBA', marginTop: 10, paddingTop: 10, borderTop: '1px solid #E3EBF7' }}>{s.d}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #DCE6F5', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {t.manifestLabel} · {t.route}
          </div>
          <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: '#EEF4FC', color: '#10233F' }}>
            {t.badge}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={{ minHeight: 44, padding: '11px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#087CF0', color: '#fff', border: '1.5px solid #087CF0', opacity: 1 }}>
              {t.generate}
            </button>
            <button disabled style={{ minHeight: 44, padding: '11px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: 'not-allowed', background: '#fff', color: '#001B45', border: '1.5px solid #DCE6F5', opacity: 0.45 }}>
              {t.send}
            </button>
            <button disabled style={{ minHeight: 44, padding: '11px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: 'not-allowed', background: '#fff', color: '#001B45', border: '1.5px solid #DCE6F5', opacity: 0.45 }}>
              {t.print}
            </button>
          </div>
        </div>

        <div role="tablist" style={{ display: 'flex', gap: 6, padding: '12px 22px', borderBottom: '1px solid #E3EBF7' }}>
          <button
            role="tab"
            aria-selected={view === 'digital'}
            onClick={() => setView('digital')}
            style={{ minHeight: 36, padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: view === 'digital' ? '#001B45' : '#fff', color: view === 'digital' ? '#fff' : '#10233F', border: `1.5px solid ${view === 'digital' ? '#001B45' : '#DCE6F5'}` }}
          >
            {t.tabDigital}
          </button>
          <button
            role="tab"
            aria-selected={view === 'printed'}
            onClick={() => setView('printed')}
            style={{ minHeight: 36, padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: view === 'printed' ? '#001B45' : '#fff', color: view === 'printed' ? '#fff' : '#10233F', border: `1.5px solid ${view === 'printed' ? '#001B45' : '#DCE6F5'}` }}
          >
            {t.tabPrinted}
          </button>
        </div>

        <div style={{ padding: 22, background: '#EEF4FC', overflowX: 'auto' }}>
          {view === 'digital' ? (
            <div style={{ background: '#fff', border: '1px solid #DCE6F5', maxWidth: 960, minWidth: 720, margin: '0 auto', padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 10px 30px rgba(0,27,69,.08)' }}>
              <div style={{ fontSize: 13, lineHeight: 1.55, padding: '10px 14px', borderRadius: 10, background: '#EEF4FC', color: '#25456E' }}>
                {t.draftNote}
              </div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                  <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    <span style={{ width: 20, height: 4, background: '#D99A00', transform: 'skewX(-24deg)' }} />
                    <span style={{ width: 8, height: 4, background: '#087CF0', transform: 'skewX(-24deg)' }} />
                  </div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '.08em', color: '#001B45' }}>{t.brand}</div>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 22, color: '#001B45', margin: '4px 0 16px' }}>{t.manifestTitle}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px 20px' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.manifestLabel}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#10233F', marginTop: 3 }}>{t.manifestId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.routeLabel}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#10233F', marginTop: 3 }}>{t.route}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.driverLabel}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#10233F', marginTop: 3 }}>{t.driver}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.vehicleLabel}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#10233F', marginTop: 3 }}>{t.vehicle}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.hubLabel}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#10233F', marginTop: 3 }}>{t.hub}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C82A6' }}>{t.dateLabel}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#10233F', marginTop: 3 }}>{t.date}</div>
                    </div>
                  </div>
                </div>
                <Qr value={t.manifestId} size={112} label={t.manifestId} />
              </div>

              <div style={{ border: '1px solid #DCE6F5', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(190px, 1.5fr) 60px minmax(120px, 1fr) 110px 56px minmax(130px, 1fr)', gap: 12, alignItems: 'center', padding: '10px 14px', background: '#001B45', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  {t.tableHeaders.map((h, i) => <span key={i} style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{h}</span>)}
                </div>
                {t.rows.map((r) => (
                  <div key={r.n} style={{ display: 'grid', gridTemplateColumns: '36px minmax(190px, 1.5fr) 60px minmax(120px, 1fr) 110px 56px minmax(130px, 1fr)', gap: 12, alignItems: 'center', padding: '10px 14px', borderTop: '1px solid #E3EBF7', fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: '#001B45' }}>{r.n}</span>
                    <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5, color: '#10233F' }}>{r.tracking}</span>
                    <span><Qr value={r.tracking} size={44} /></span>
                    <span>{r.dest}</span>
                    <span style={{ color: '#6C82A6' }}>{r.window}</span>
                    <span>{r.pieces}</span>
                    <span style={{ justifySelf: 'start', display: 'inline-flex', padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: 'rgba(8,124,240,.1)', color: '#0768C9' }}>{r.status}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', justifyContent: 'space-between', borderTop: '1px solid #E3EBF7', paddingTop: 12, fontSize: 11.5, color: '#6C82A6' }}>
                <span>{t.qrDemo}</span>
                <span>{t.qrCopy}</span>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 14, padding: 40, textAlign: 'center', color: '#6C82A6' }}>
              Vista impresa no implementada
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.stepsTitle}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {t.steps.map((s, i) => {
            const active = i <= step
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: active ? '#D99A00' : '#EEF4FC', color: active ? '#fff' : '#8B9DBA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flex: '0 0 auto' }}>{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#001B45' : '#8B9DBA' }}>{s}</span>
              </div>
            )
          })}
        </div>
        <div>
          <button
            onClick={() => setStep(Math.min(step + 1, t.steps.length - 1))}
            style={{ padding: '13px 20px', border: '1.5px solid #001B45', borderRadius: 11, background: '#fff', color: '#001B45', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            {t.advance}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #DCE6F5', fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.digitalTitle}</div>
          {t.digitalRows.map((r, i) => (
            <div key={i} style={{ padding: '13px 20px', borderTop: '1px solid #E3EBF7', display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ flex: 1, fontSize: 12, color: '#6C82A6' }}>{r.k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #DCE6F5', fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.printedTitle}</div>
          {t.printedRows.map((r, i) => (
            <div key={i} style={{ padding: '13px 20px', borderTop: '1px solid #E3EBF7', display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ flex: 1, fontSize: 12, color: '#6C82A6' }}>{r.k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #DCE6F5', fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.versionsTitle}</div>
        <div style={{ padding: 24, color: '#6C82A6', fontSize: 14 }}>{t.versionsEmpty}</div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', border: '1px dashed #DCE6F5', background: '#EEF4FC', borderRadius: 14, padding: '16px 18px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0768C9" strokeWidth="1.8" style={{ flex: '0 0 auto', marginTop: 1 }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 7.8v.1" />
        </svg>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: '#25456E', textWrap: 'pretty' }}>{t.note}</p>
      </div>
    </div>
  )
}
