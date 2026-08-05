import React from 'react'
import { PageHero } from '../components/Shared'

export default function How({ t }) {
  const howSteps = t.how.steps.map((s, i) => ({
    t: s.t, d: s.d, n: '0' + (i + 1), ring: i === 3 ? '#D99A00' : '#087CF0',
  }))

  return (
    <div>
      <PageHero title={t.how.title} sub={t.how.sub} />
      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px 88px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {howSteps.map((s, i) => (
            <div key={i} className="grid-split" style={{
              display: 'grid', gridTemplateColumns: '96px 1fr', gap: 26,
              alignItems: 'center', border: '1px solid #DCE6F5',
              borderRadius: 18, padding: '28px 30px',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: '#EEF4FC',
                border: `2px solid ${s.ring}`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: 'Montserrat, sans-serif',
                fontWeight: 800, fontSize: 22, color: s.ring,
              }}>{s.n}</div>
              <div>
                <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 22, margin: '0 0 8px' }}>{s.t}</h2>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#10233F', maxWidth: 720 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
