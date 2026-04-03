import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function MatchedScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { matchId, targetName } = (location.state ?? {}) as { matchId: string; targetName: string }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M8 18L14 24L28 12" stroke="var(--color-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10 }}>
        It's a match!
      </h2>
      <p style={{ fontSize: 14, color: 'var(--color-gray-600)', lineHeight: 1.6, maxWidth: 260, marginBottom: 32 }}>
        You and {targetName ?? 'them'} both wanted to connect. Time to start a real conversation.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <button
          onClick={() => navigate('/messages')}
          style={{ padding: '15px', borderRadius: 'var(--radius-full)', background: 'var(--color-black)', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
        >
          Go to messages
        </button>
        <button
          onClick={() => navigate('/profile')}
          style={{ padding: '15px', borderRadius: 'var(--radius-full)', background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          Keep browsing
        </button>
      </div>
    </div>
  )
}
