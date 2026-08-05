import React from 'react'
import { PageHero } from '../components/Shared'

export default function FAQ({ t }) {
  const [faqOpen, setFaqOpen] = React.useState('0-0')

  return (
    <div>
      <PageHero title={t.faq.title} sub={t.faq.sub} />
      <section className="section-pad" style={{ background: '#fff', padding: '64px 32px 88px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 38 }}>
          {t.faq.groups.map((g, gi) => (
            <div key={gi}>
              <h2 style={{ fontFamily: 'Montserrat, "Noto Sans SC", sans-serif', fontWeight: 700, fontSize: 22, margin: '0 0 16px' }}>{g.t}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {g.items.map((q, qi) => {
                  const key = gi + '-' + qi
                  const open = faqOpen === key
                  return (
                    <div key={key} style={{ border: '1px solid #DCE6F5', borderRadius: 14, overflow: 'hidden' }}>
                      <button onClick={() => setFaqOpen(open ? null : key)} style={{
                        width: '100%', textAlign: 'left', background: '#fff', border: 'none',
                        padding: '20px 22px', cursor: 'pointer',
                        display: 'flex', gap: 16, alignItems: 'center',
                      }}>
                        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: '#001B45' }}>{q.q}</span>
                        <span style={{ fontSize: 20, color: '#087CF0', lineHeight: 1 }}>{open ? '−' : '+'}</span>
                      </button>
                      {open && (
                        <div style={{ padding: '0 22px 22px', fontSize: 15, lineHeight: 1.75, color: '#10233F' }}>{q.a}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
