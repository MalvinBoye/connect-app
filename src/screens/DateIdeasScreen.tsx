import React, { useState } from 'react'

const ideas = [
  { category: 'Low pressure', emoji: '-', title: 'Coffee walk', desc: 'Meet at a café, grab drinks, chill likkle walk and talk. 45 min max. No awkward sitting face-to-face.' },
  { category: 'Low pressure', emoji: '-', title: 'Bookstore browse', desc: 'Wander a bookstore together. What you pick up says more than any profile.' },
  { category: 'Low pressure', emoji: '-', title: 'Park meetup', desc: 'A bench, some sun(preferably ㅇㅅㅇ), easy conversation. Bring snacks.' },
  { category: 'Active', emoji: '-', title: 'Bike ride', desc: 'Rent bikes and explore the city. Great for conversation in short bursts.' },
  { category: 'Active', emoji: '-', title: 'Climbing gym', desc: 'Bouldering together is surprisingly revealing. Collaborative and fun.' },
  { category: 'Active', emoji: '-', title: 'Tennis / padel', desc: 'Competitive but playful. You learn a lot about someone from how they handle losing.' },
  { category: 'Creative', emoji: '-', title: 'Paint together', desc: 'Drop-in painting class or just supplies from a craft store. Low stakes, high fun.' },
  { category: 'Creative', emoji: '-', title: 'Cook something', desc: 'Pick a recipe neither of you has made. The chaos is half the point.' },
  { category: 'Creative', emoji: '-', title: 'Photo walk', desc: 'Walk around with your phones. Share what you each notice.' },
  { category: 'Evening', emoji: '-', title: 'Live music', desc: 'A small venue show. Music fills silence naturally.' },
  { category: 'Evening', emoji: '-', title: 'Bowling', desc: 'Retro, low-stakes, easy to laugh.' },
  { category: 'Evening', emoji: '-', title: 'Rooftop or viewpoint', desc: 'Find somewhere with a good view. City lights and good conversation.' },
]

const categories = ['All', 'Low pressure', 'Active', 'Creative', 'Evening']

export default function DateIdeasScreen() {
  const [active, setActive] = useState('All')
  const filtered = ideas.filter(i => active === 'All' || i.category === active)

  return (
    <div className="screen">
      <div className="screen-header">
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Date Ideas</div>
        <div style={{ fontSize: 10, color: 'var(--sage)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>Low pressure, real connection</div>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid var(--brown-border)', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActive(cat)} style={{ padding: '5px 14px', borderRadius: 'var(--radius-full)', border: `1px solid ${active === cat ? 'var(--sage)' : 'var(--brown-border)'}`, background: active === cat ? 'var(--sage)' : 'transparent', color: active === cat ? 'var(--cream)' : 'var(--brown-light)', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font)', transition: 'all 0.15s', letterSpacing: '0.04em' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '8px 0' }}>
        {filtered.map((idea, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid var(--brown-border)', display: 'flex', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--sage-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, border: '1px solid var(--brown-border)' }}>{idea.emoji}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{idea.title}</span>
                <span style={{ fontSize: 9, color: 'var(--sage)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{idea.category}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--brown-light)', lineHeight: 1.7 }}>{idea.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin: '12px 16px 20px', padding: '14px 16px', border: '1px solid var(--brown-border)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: 11, color: 'var(--sage)', lineHeight: 1.7, fontStyle: 'italic' }}>"The best first date is one where you both forget to check your phone."</p>
      </div>
    </div>
  )
}
