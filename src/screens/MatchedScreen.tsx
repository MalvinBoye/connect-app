import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function MatchedScreen() {
  const navigate = useNavigate()
  const { matchId, targetName } = (useLocation().state ?? {}) as { matchId: string; targetName: string }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', textAlign: 'center', background: 'var(--cream)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', border: '1px solid var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, background: 'var(--sage-dim)' }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M5 13L10.5 18.5L21 8" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontSize: 9, color: 'var(--sage)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>It's a match</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.1 }}>You and {targetName ?? 'them'} connected.</h2>
      <p style={{ fontSize: 12, color: 'var(--brown-light)', lineHeight: 1.8, maxWidth: 220, marginBottom: 36 }}>Time to start a real conversation.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <button onClick={() => navigate('/messages', { state: { matchId } })} className="btn-primary" style={{ width: '100%' }}>Start the conversation</button>
        <button onClick={() => navigate('/profile')} className="btn-secondary" style={{ width: '100%' }}>Keep browsing</button>
      </div>
    </div>
  )
}
