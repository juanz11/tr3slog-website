import React from 'react'
import { PageHero, ImageSlot } from '../components/Shared'

export default function About({ t }) {
  return (
    <div>
      <PageHero title={t.about.title} sub={t.about.sub} />
      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div className="grid-c2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 44 }}>
            <div style={{ border: '1px solid #DCE6F5', borderRadius: 18, padding: 30 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#087CF0', marginBottom: 12 }}>{t.about.missionT}</div>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: '#001B45' }}>{t.about.missionB}</p>
            </div>
            <div style={{ border: '1px solid #DCE6F5', borderRadius: 18, padding: 30, background: '#EEF4FC' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#D99A00', marginBottom: 12 }}>{t.about.promiseT}</div>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: '#001B45' }}>{t.about.promiseB}</p>
            </div>
          </div>
          <h2 className="h2-large" style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 30, margin: '0 0 24px' }}>{t.about.valuesT}</h2>
          <div className="grid-c4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 52 }}>
            {t.about.values.map((v, i) => (
              <div key={i} style={{ border: '1px solid #DCE6F5', borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 17, margin: '0 0 8px' }}>{v.t}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#10233F' }}>{v.d}</p>
              </div>
            ))}
          </div>
          <h2 className="h2-large" style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 800, fontSize: 30, margin: '0 0 24px' }}>{t.about.teamT}</h2>
          <div className="grid-c3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {t.about.team.map((p, i) => (
              <div key={i} style={{ border: '1px solid #DCE6F5', borderRadius: 16, overflow: 'hidden' }}>
                <ImageSlot placeholder={p.n} height={220} />
                <div style={{ padding: 22 }}>
                  <div style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 17 }}>{p.n}</div>
                  <div style={{ fontSize: 13, color: '#6C82A6', marginTop: 4 }}>{p.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
