import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { recordSwipe } from '../lib/matching'

const reasons = ["Not what I'm looking for right now", "Different values or interests", "Didn't feel a connection", "Profile felt incomplete", "Other"]

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
    setLoading(false); navigate('/profile')
  }

  return (
    <div className="screen" style={{ padding: '32px 24px 24px' }}>
      <button onClick={() => navigate('/profile')} style={{ alignSelf: 'flex-start', marginBottom: 32, color: 'var(--brown-light)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Passing on {targetName ?? 'this person'}.</h2>
      <p style={{ fontSize: 12, color: 'var(--brown-light)', marginBottom: 28, lineHeight: 1.7 }}>Helps us learn — and helps you understand what you're looking for.</p>

      <div style={{ fontSize: 9, color: 'var(--sage)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Reason (optional)</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'auto' }}>
        {reasons.map(r => (
          <button key={r} onClick={() => setSelected(r === selected ? null : r)} style={{ padding: '13px 16px', border: `1px solid ${selected === r ? 'var(--sage)' : 'var(--brown-border)'}`, borderRadius: 'var(--radius-full)', background: selected === r ? 'var(--sage-dim)' : 'transparent', color: selected === r ? 'var(--sage)' : 'var(--brown)', fontSize: 12, textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s' }}>
            {r}
          </button>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'var(--sage-dim)', borderRadius: 'var(--radius-sm)', margin: '20px 0' }}>
        <p style={{ fontSize: 11, color: 'var(--sage)', lineHeight: 1.6 }}>Anonymous. Never shared with {targetName ?? 'them'}.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={confirm} disabled={loading} className="btn-primary" style={{ width: '100%' }}>{loading ? '...' : 'Confirm pass'}</button>
        <button onClick={() => navigate('/profile')} className="btn-secondary" style={{ width: '100%' }}>Go back</button>
      </div>
    </div>
  )
}
