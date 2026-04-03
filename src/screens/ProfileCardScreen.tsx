import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { ScoredProfile, getTodaysProfiles, getDailyRemaining } from '../lib/matching'

export default function ProfileCardScreen() {
  const navigate = useNavigate()
  const { profile: myProfile, signOut } = useAuth()
  const [profiles, setProfiles] = useState<ScoredProfile[]>([])
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
      getTodaysProfiles(myProfile!.id, myProfile!),
      getDailyRemaining(myProfile!.id),
    ])
    setProfiles(fetched)
    setRemaining(rem)
    setLoading(false)
  }

  const handleSwipe = (action: 'connect' | 'pass') => {
    const target = profiles[current]
    if (!target) return
    setExpanded(false)
    if (action === 'pass') {
      navigate('/reflection-pass', { state: { targetId: target.id, targetName: target.name } })
    } else {
      navigate('/reflection-accept', { state: { targetId: target.id, targetName: target.name } })
    }
  }

  const activeProfile = profiles[current]

  if (loading) return <LoadingState />
  if (remaining === 0 || profiles.length === 0) {
    navigate('/completion')
    return null
  }

  const score = activeProfile.score

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-gray-100)', overflow: 'hidden' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'white', borderBottom: '1px solid var(--color-gray-200)' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-teal)' }}>connect</div>
        <div style={{ fontSize: 12, color: 'var(--color-gray-400)' }}>{remaining} left today</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/transparency')} style={{ background: 'none', color: 'var(--color-gray-600)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10 6V10.5M10 13.5V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
          <button onClick={() => navigate('/messages')} style={{ background: 'none', color: 'var(--color-gray-600)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button onClick={signOut} style={{ background: 'none', color: 'var(--color-gray-600)', fontSize: 11 }}>Out</button>
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, padding: '16px 16px 0', overflow: 'auto' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-200)' }}>

          {/* Photo */}
          <div style={{ height: 280, background: activeProfile.avatar_url ? `url(${activeProfile.avatar_url}) center/cover` : 'linear-gradient(160deg, #e8f0ef, #d0e4e3)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!activeProfile.avatar_url && <div style={{ fontSize: 56, color: 'var(--color-teal)', opacity: 0.3, fontWeight: 700 }}>{activeProfile.name[0]}</div>}
            {/* Compatibility badge */}
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'white', borderRadius: 'var(--radius-full)', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor(score.total) }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: scoreColor(score.total) }}>{score.total}% match</span>
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: activeProfile.avatar_url ? 'white' : 'var(--color-black)', textShadow: activeProfile.avatar_url ? '0 1px 4px rgba(0,0,0,0.5)' : 'none' }}>
                {activeProfile.name}, {activeProfile.age}
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '14px 16px 12px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-full)', marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-teal)' }}>{intentionLabel(activeProfile.intention)}</span>
            </div>

            {/* Top reasons */}
            {score.reasons.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {score.reasons.slice(0, 3).map(r => (
                  <div key={r} style={{ padding: '3px 9px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', fontSize: 11, color: 'var(--color-gray-600)' }}>{r}</div>
                ))}
              </div>
            )}

            {activeProfile.bio && <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-gray-800)', marginBottom: 12 }}>{activeProfile.bio}</p>}

            {/* Transparency panel */}
            <button onClick={() => setExpanded(!expanded)} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-sm)', background: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-gray-600)' }}>Why you're seeing {activeProfile.name} — full breakdown</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><path d="M3 5L7 9L11 5" stroke="var(--color-gray-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {expanded && (
              <div style={{ padding: '14px', border: '1px solid var(--color-gray-200)', borderTop: 'none', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)', background: 'white' }}>
                {[
                  ['Age range', score.ageRange, 15],
                  ['Shared interests', score.bioOverlap, 25],
                  ['Mutual signals', score.mutualInterest, 20],
                  ['Recently active', score.recency, 15],
                  ['Profile completeness', score.completeness, 10],
                  ['Response rate', score.responseRate, 10],
                  ['Relationship readiness', score.readiness, 5],
                ].map(([label, pts, max]) => (
                  <div key={label as string} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-gray-600)' }}>{label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-teal)' }}>{pts}/{max}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--color-gray-200)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${((pts as number) / (max as number)) * 100}%`, background: 'var(--color-teal)', borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-gray-200)', paddingTop: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Total match score</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(score.total) }}>{score.total}/100</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--color-gray-400)', marginTop: 10, lineHeight: 1.5 }}>
                  This score is shown to you in full. No hidden factors. Payment never affects ranking.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '14px 20px', display: 'flex', gap: 12, background: 'var(--color-gray-100)' }}>
        <button onClick={() => handleSwipe('pass')} style={{ flex: 1, padding: '14px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-full)', background: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Pass</button>
        <button onClick={() => handleSwipe('connect')} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 'var(--radius-full)', background: 'var(--color-black)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Connect</button>
      </div>
    </div>
  )
}

function scoreColor(score: number) {
  if (score >= 70) return '#2C7A4B'
  if (score >= 45) return '#A0622A'
  return '#999'
}

function intentionLabel(intention: string) {
  const map: Record<string, string> = { relationship: 'Long-term relationship', dating: 'Dating & seeing where it goes', connection: 'Meaningful connection', friendship: 'Friendship first' }
  return map[intention] ?? intention
}

function LoadingState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--color-gray-200)', borderTop: '2px solid var(--color-teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 13, color: 'var(--color-gray-400)' }}>Finding your best matches…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
