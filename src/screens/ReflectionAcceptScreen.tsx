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
    if (matched && matchId) {
      navigate('/matched', { state: { matchId, targetName } })
    } else {
      navigate('/profile')
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px 20px', overflow: 'auto' }}>
      <button onClick={() => navigate('/profile')} style={{ background: 'none', alignSelf: 'flex-start', marginBottom: 24, color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: 13 }}>Back</span>
      </button>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-full)', marginBottom: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)' }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-teal)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reflection</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', lineHeight: 1.25 }}>Before you connect with {targetName ?? 'them'}</h2>
        <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 8, lineHeight: 1.5 }}>Taking a moment to reflect leads to more meaningful conversations.</p>
      </div>

      <div style={{ padding: '18px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', marginBottom: 16, background: 'var(--color-white)' }}>
        <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.2px' }}>
          "What made you want to connect with {targetName ?? 'this person'}?"
        </p>
      </div>

      <textarea
        value={response}
        onChange={e => setResponse(e.target.value)}
        placeholder="Share your thoughts… (optional)"
        style={{ flex: 1, minHeight: 120, padding: '14px 16px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', resize: 'none', fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.6, outline: 'none', marginBottom: 16 }}
      />

      <div style={{ padding: '12px 14px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--color-gray-600)', lineHeight: 1.5 }}>Your response is only for you — it won't be sent to {targetName ?? 'them'}.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={confirm} disabled={loading} style={{ padding: '15px', borderRadius: 'var(--radius-full)', background: 'var(--color-black)', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
          {loading ? 'Sending…' : 'Send connection request'}
        </button>
        <button onClick={() => navigate('/profile')} style={{ padding: '15px', borderRadius: 'var(--radius-full)', background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          Go back
        </button>
      </div>
    </div>
  )
}
