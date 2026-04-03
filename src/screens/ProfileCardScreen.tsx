import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Profile } from '../lib/supabase'
import { getTodaysProfiles, getDailyRemaining } from '../lib/matching'

export default function ProfileCardScreen() {
  const navigate = useNavigate()
  const { profile: myProfile, signOut } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [current, setCurrent] = useState(0)
  const [remaining, setRemaining] = useState(5)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!myProfile) return
    loadProfiles()
  }, [myProfile])

  const loadProfiles = async () => {
    setLoading(true)
    const [fetched, rem] = await Promise.all([
      getTodaysProfiles(myProfile!.id, myProfile!.intention),
      getDailyRemaining(myProfile!.id),
    ])
    setProfiles(fetched)
    setRemaining(rem)
    setLoading(false)
  }

  const handleSwipe = (action: 'connect' | 'pass') => {
    const target = profiles[current]
    if (!target) return
    if (action === 'pass') {
      navigate('/reflection-pass', { state: { targetId: target.id, targetName: target.name } })
    } else {
      navigate('/reflection-accept', { state: { targetId: target.id, targetName: target.name, targetProfile: target } })
    }
  }

  const activeProfile = profiles[current]

  if (loading) return <LoadingState />
  if (remaining === 0 || profiles.length === 0) {
    navigate('/completion')
    return null
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-gray-100)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-200)' }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--color-teal)' }}>connect</div>
        <div style={{ fontSize: 12, color: 'var(--color-gray-400)' }}>{remaining} left today</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/transparency')} style={{ background: 'none', padding: 4, color: 'var(--color-gray-600)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10 6V10.5M10 13.5V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
          <button onClick={() => navigate('/messages')} style={{ background: 'none', padding: 4, color: 'var(--color-gray-600)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button onClick={signOut} style={{ background: 'none', padding: 4, color: 'var(--color-gray-600)', fontSize: 11 }}>Sign out</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 16px 0', overflow: 'auto' }}>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-200)' }}>
          <div style={{ height: 300, background: activeProfile.avatar_url ? `url(${activeProfile.avatar_url}) center/cover` : 'linear-gradient(160deg, #e8f0ef 0%, #d0e4e3 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!activeProfile.avatar_url && <div style={{ fontSize: 64, color: 'var(--color-teal)', opacity: 0.3, fontWeight: 700 }}>{activeProfile.name[0]}</div>}
            <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: activeProfile.avatar_url ? 'white' : 'var(--color-black)', textShadow: activeProfile.avatar_url ? '0 1px 4px rgba(0,0,0,0.4)' : 'none' }}>{activeProfile.name}, {activeProfile.age}</div>
            </div>
          </div>

          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-full)', marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-teal)' }}>Looking for: {intentionLabel(activeProfile.intention)}</span>
            </div>

            {activeProfile.bio && <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-gray-800)', marginBottom: 14 }}>{activeProfile.bio}</p>}

            <button onClick={() => setExpanded(!expanded)} style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-sm)', background: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-gray-600)' }}>Why you're seeing {activeProfile.name}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><path d="M3 5L7 9L11 5" stroke="var(--color-gray-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {expanded && (
              <div style={{ padding: '12px 14px', border: '1px solid var(--color-gray-200)', borderTop: 'none', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)', background: 'white' }}>
                {[['Shared intention', intentionLabel(activeProfile.intention)], ['Ranking', 'Chronological — not by payment'], ['Pay-to-win', 'None']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                    <span style={{ color: 'var(--color-gray-400)' }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', gap: 12, background: 'var(--color-gray-100)' }}>
        <button onClick={() => handleSwipe('pass')} style={{ flex: 1, padding: '14px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-full)', background: 'var(--color-white)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Pass</button>
        <button onClick={() => handleSwipe('connect')} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 'var(--radius-full)', background: 'var(--color-black)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Connect</button>
      </div>
    </div>
  )
}

function intentionLabel(intention: string) {
  const map: Record<string, string> = { relationship: 'Long-term relationship', dating: 'Dating & seeing where it goes', connection: 'Meaningful connection', friendship: 'Friendship first' }
  return map[intention] ?? intention
}

function LoadingState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--color-gray-200)', borderTop: '2px solid var(--color-teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 13, color: 'var(--color-gray-400)' }}>Finding people…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
