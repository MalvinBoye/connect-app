import React, { useState } from 'react'

const ideas = [
  { category: 'Low pressure', emoji: '☕', title: 'Coffee walk', desc: 'Meet at a café, grab drinks, walk and talk. 45 min max. No awkward sitting face-to-face.' },
  { category: 'Low pressure', emoji: '📚', title: 'Bookstore browse', desc: 'Wander a bookstore. What you pick up says more than any profile.' },
  { category: 'Low pressure', emoji: '🌳', title: 'Park meetup', desc: 'A bench, some sun, easy conversation. Bring snacks.' },
  { category: 'Active', emoji: '🚴', title: 'Bike ride', desc: 'Rent bikes and explore the city. Great for conversation in short bursts.' },
  { category: 'Active', emoji: '🧗', title: 'Climbing gym', desc: 'Bouldering together is surprisingly revealing. Collaborative and fun.' },
  { category: 'Active', emoji: '🎾', title: 'Tennis / padel', desc: 'Competitive but playful. You learn a lot about someone by how they handle losing.' },
  { category: 'Creative', emoji: '🎨', title: 'Paint and chat', desc: 'Drop-in painting class or just supplies from a craft store. Low stakes, high fun.' },
  { category: 'Creative', emoji: '🍳', title: 'Cook something together', desc: 'Pick a recipe neither of you has made. The chaos is half the point.' },
  { category: 'Creative', emoji: '📸', title: 'Photo walk', desc: 'Walk around with your phones. Share what you each notice.' },
  { category: 'Evening', emoji: '🎵', title: 'Live music', desc: 'A small venue show. Music gives you something to talk about and fills silence naturally.' },
  { category: 'Evening', emoji: '🎳', title: 'Bowling', desc: 'Retro, low-stakes, easy to laugh. Nobody looks graceful bowling.' },
  { category: 'Evening', emoji: '🌃', title: 'Rooftop or viewpoint', desc: 'Find somewhere with a good view. City lights and good conversation.' },
]

const categories = ['All', 'Low pressure', 'Active', 'Creative', 'Evening']

export default function DateIdeasScreen() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = ideas.filter(i => activeCategory === 'All' || i.category === activeCategory)

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--color-gray-200)', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Date Ideas</h1>
        <p style={{ fontSize: 12, color: 'var(--color-gray-400)', marginTop: 2 }}>Low pressure, real connection</p>
      </div>

      {/* Category filter */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid var(--color-gray-200)', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${activeCategory === cat ? 'var(--color-teal)' : 'var(--color-gray-200)'}`,
              background: activeCategory === cat ? 'var(--color-teal)' : 'white',
              color: activeCategory === cat ? 'white' : 'var(--color-gray-600)',
              fontSize: 12, fontWeight: 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ideas list */}
      <div style={{ padding: '8px 0' }}>
        {filtered.map((idea, i) => (
          <div key={i} style={{ padding: '16px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 28, flexShrink: 0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}>
              {idea.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{idea.title}</span>
                <span style={{ fontSize: 10, padding: '2px 7px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-full)', color: 'var(--color-teal)', fontWeight: 500 }}>{idea.category}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{idea.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{ padding: '20px 16px', margin: '8px 16px 16px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-teal)', lineHeight: 1.6 }}>
          The best first date is one where you both forget to check your phone. That's the whole goal.
        </p>
      </div>
    </div>
  )
}
