import React from 'react'
import { MEDIA_URL } from '../api'
import { PageHero, ImageSlot } from '../components/Shared'

const SVC_IMAGES = [
  'descarga%20(3).webp',
  'descarga.webp',
  'descarga%20(1).webp',
  'descarga%20(2).webp',
  'descarga%20(4).webp',
  'descarga%20(5).webp',
]

export default function Services({ t, go }) {
  return (
    <div>
      <PageHero title={t.svc.title} sub={t.svc.sub} />
      <section className="section-pad" style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div className="grid-c2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {t.svc.items.map((s, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #DCE6F5', borderRadius: 18,
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
              }}>
                <ImageSlot
                  placeholder={s.t}
                  src={SVC_IMAGES[i] ? `${MEDIA_URL}/${SVC_IMAGES[i]}` : undefined}
                  alt={s.t}
                  height={200}
                />
                <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 22, margin: 0 }}>{s.t}</h2>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#10233F' }}>{s.d}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {s.b.map((b, bi) => (
                      <div key={bi} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#001B45' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D99A00', flex: '0 0 auto' }} />
                        {b}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => go('quote')} style={{
                    alignSelf: 'flex-start', marginTop: 4, padding: '12px 18px',
                    background: '#087CF0', border: 'none', borderRadius: 10,
                    color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{t.common.quote}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
