import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { recordSwipe } from '../lib/matching'

const reasons = ['Not what I\'m looking for right now', 'Different values or interests', 'Didn\'t feel a connection', 'Profile felt incomplete', 'Other']

export default function ReflectionPassScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile: myProfile } = useAuth()
  const { targetId, targetName } = (location.state ?? {}) as { targetId: string; targetName: string }
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!myProfile || !targetId) return
    setLoading(true)
    await recordSwipe(myProfile.id, targetId, 'pass')
    setLoading(false)
    navigate('/profile')
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px 20px', overflow: 'auto' }}>
      <button onClick={() => navigate('/profile')} style={{ background: 'none', alignSelf: 'flex-start', marginBottom: 24, color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: 13 }}>Back</span>
      </button>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px' }}>Passing on {targetName ?? 'this person'}</h2>
        <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 8, lineHeight: 1.5 }}>This helps us learn — and helps you understand what you're looking for.</p>
      </div>

      <div style={{ marginBottom: 'auto' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>What's the reason? (optional)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reasons.map(r => (
            <button key={r} onClick={() => setSelected(r === selected ? null : r)} style={{ padding: '13px 16px', border: `1px solid ${selected === r ? 'var(--color-black)' : 'var(--color-gray-200)'}`, borderRadius: 'var(--radius-md)', background: selected === r ? 'var(--color-black)' : 'white', color: selected === r ? 'white' : 'var(--color-black)', fontSize: 14, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}>{r}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)', margin: '20px 0' }}>
        <p style={{ fontSize: 12, color: 'var(--color-gray-600)', lineHeight: 1.5 }}>Feedback is anonymous and never shared with {targetName ?? 'them'}.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={confirm} disabled={loading} style={{ padding: '15px', borderRadius: 'var(--radius-full)', background: 'var(--color-black)', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
          {loading ? 'Saving…' : 'Confirm pass'}
        </button>
        <button onClick={() => navigate('/profile')} style={{ padding: '15px', borderRadius: 'var(--radius-full)', background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          Actually, go back
        </button>
      </div>
    </div>
  )
}
