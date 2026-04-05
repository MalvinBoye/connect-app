import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { recordSwipe } from '../lib/matching'

export default function ReflectionAcceptScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile: myProfile } = useAuth()
  const { targetId, targetName } = (location.state ?? {}) as { targetId: string; targetName: string }
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!myProfile || !targetId) return
    setLoading(true)
    const { matched, matchId } = await recordSwipe(myProfile.id, targetId, 'connect')
    setLoading(false)
    if (matched && matchId) navigate('/matched', { state: { matchId, targetName } })
    else navigate('/profile')
  }

  return (
    <div className="screen" style={{ padding: '32px 24px 24px' }}>
      <button onClick={() => navigate('/profile')} style={{ alignSelf: 'flex-start', marginBottom: 32, color: 'var(--brown-light)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>

      <div style={{ fontSize: 9, color: 'var(--sage)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Reflection</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.2 }}>Before you connect with {targetName ?? 'them'}.</h2>
      <p style={{ fontSize: 12, color: 'var(--brown-light)', marginBottom: 28, lineHeight: 1.7 }}>A moment of intention leads to better conversations.</p>

      <div style={{ padding: '16px 18px', border: '1px solid var(--brown-border)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.7, color: 'var(--brown)' }}>
          "What made you want to connect with {targetName ?? 'this person'}?"
        </p>
      </div>

      <textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Share your thoughts… (optional)" style={{ width: '100%', minHeight: 110, padding: '14px 16px', border: '1px solid var(--brown-border)', borderRadius: 'var(--radius-md)', resize: 'none', fontFamily: 'var(--font)', fontSize: 13, background: 'var(--cream)', color: 'var(--brown)', outline: 'none', lineHeight: 1.7, marginBottom: 14 }} />

      <div style={{ padding: '10px 14px', background: 'var(--sage-dim)', borderRadius: 'var(--radius-sm)', marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: 'var(--sage)', lineHeight: 1.6 }}>This is just for you — it won't be shared.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
        <button onClick={confirm} disabled={loading} className="btn-primary" style={{ width: '100%' }}>{loading ? '...' : 'Send connection request'}</button>
        <button onClick={() => navigate('/profile')} className="btn-secondary" style={{ width: '100%' }}>Go back</button>
      </div>
    </div>
  )
}
