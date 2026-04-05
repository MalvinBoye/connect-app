import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { ScoredProfile, getTodaysProfiles, getDailyRemaining, recordSwipe } from '../lib/matching'

export default function ProfileCardScreen() {
  const navigate = useNavigate()
  const { profile: myProfile } = useAuth()
  const [profiles, setProfiles] = useState<ScoredProfile[]>([])
  const [remaining, setRemaining] = useState(5)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [actioned, setActioned] = useState<Record<string, 'connect' | 'pass'>>({})
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    if (!myProfile) return
    load()
  }, [myProfile])

  const load = async () => {
    setLoading(true)
    const [fetched, rem] = await Promise.all([
      getTodaysProfiles(myProfile!.id, myProfile!),
      getDailyRemaining(myProfile!.id),
    ])
    setProfiles(fetched)
    setRemaining(rem)
    setLoading(false)
  }

  const handleConnect = async (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation()
    if (!myProfile || connecting) return
    setConnecting(profileId)
    const { matched, matchId } = await recordSwipe(myProfile.id, profileId, 'connect')
    setActioned(prev => ({ ...prev, [profileId]: 'connect' }))
    setConnecting(null)
    if (matched && matchId) {
      const p = profiles.find(p => p.id === profileId)
      navigate('/matched', { state: { matchId, targetName: p?.name } })
    }
  }

  const handlePass = async (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation()
    if (!myProfile || connecting) return
    setConnecting(profileId)
    await recordSwipe(myProfile.id, profileId, 'pass')
    setActioned(prev => ({ ...prev, [profileId]: 'pass' }))
    setConnecting(null)
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id)
  }

  if (loading) return <LoadingState />

  const activeProfiles = profiles.filter(p => !actioned[p.id])
  const done = remaining === 0 || activeProfiles.length === 0

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--color-teal)' }}>connect</h1>
          <p style={{ fontSize: 11, color: 'var(--color-gray-400)', marginTop: 1 }}>Potential Partners</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ padding: '4px 10px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-full)' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-teal)' }}>{remaining} left today</span>
          </div>
          <button onClick={() => navigate('/transparency')} style={{ color: 'var(--color-gray-400)', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9 5.5V9.5M9 12V12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {done ? (
        <DoneState remaining={remaining} total={profiles.length} />
      ) : (
        <div style={{ padding: '8px 0' }}>
          {activeProfiles.map(p => (
            <ProfileRow
              key={p.id}
              profile={p}
              expanded={expanded === p.id}
              onToggle={() => toggleExpand(p.id)}
              onConnect={(e) => handleConnect(e, p.id)}
              onPass={(e) => handlePass(e, p.id)}
              loading={connecting === p.id}
            />
          ))}

          {/* Already actioned — faded */}
          {Object.keys(actioned).length > 0 && (
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: 11, color: 'var(--color-gray-400)', textAlign: 'center' }}>
                {Object.values(actioned).filter(a => a === 'connect').length} connection{Object.values(actioned).filter(a => a === 'connect').length !== 1 ? 's' : ''} sent today
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProfileRow({ profile, expanded, onToggle, onConnect, onPass, loading }: {
  profile: ScoredProfile
  expanded: boolean
  onToggle: () => void
  onConnect: (e: React.MouseEvent) => void
  onPass: (e: React.MouseEvent) => void
  loading: boolean
}) {
  const score = profile.score

  return (
    <div style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
      {/* Row */}
      <div
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer', background: expanded ? 'var(--color-gray-100)' : 'white', transition: 'background 0.15s' }}
      >
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--color-teal-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color: 'var(--color-teal)',
          position: 'relative',
        }}>
          {!profile.avatar_url && profile.name[0]}
          {/* Score ring indicator */}
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 18, height: 18, borderRadius: '50%',
            background: scoreColor(score.total),
            border: '2px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'white' }}>{score.total}</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px' }}>{profile.name}, {profile.age}</span>
          </div>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <Tag>{intentionLabel(profile.intention)}</Tag>
            {score.reasons.slice(0, 2).map(r => <Tag key={r}>{r}</Tag>)}
          </div>
        </div>

        {/* Connect button */}
        <button
          onClick={onConnect}
          disabled={loading}
          style={{
            flexShrink: 0,
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            background: loading ? 'var(--color-gray-200)' : 'var(--color-black)',
            color: loading ? 'var(--color-gray-400)' : 'white',
            fontSize: 12, fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
            transition: 'all 0.15s',
            border: 'none',
          }}
        >
          {loading ? '…' : 'Connect'}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', background: 'var(--color-gray-100)', borderTop: '1px solid var(--color-gray-200)' }}>

          {/* Full photo if available */}
          {profile.avatar_url && (
            <div style={{ height: 200, background: `url(${profile.avatar_url}) center/cover`, borderRadius: 'var(--radius-md)', marginBottom: 14, marginTop: 14 }} />
          )}

          {/* Bio */}
          {profile.bio && (
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-gray-800)', marginBottom: 14, marginTop: profile.avatar_url ? 0 : 14 }}>
              {profile.bio}
            </p>
          )}

          {/* Score breakdown */}
          <div style={{ padding: '12px 14px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-gray-400)', marginBottom: 10 }}>
              Why you're seeing {profile.name}
            </div>
            {[
              ['Age range', score.ageRange, 15],
              ['Interest compatibility', score.interestScore, 30],
              ['Mutual signals', score.mutualInterest, 15],
              ['Recently active', score.recency, 15],
              ['Profile complete', score.completeness, 10],
              ['Response rate', score.responseRate, 10],
              ['Readiness match', score.readiness, 5],
            ].map(([label, pts, max]) => (
              <div key={label as string} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-gray-600)' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-teal)' }}>{pts}/{max}</span>
                </div>
                <div style={{ height: 3, background: 'var(--color-gray-200)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${((pts as number) / (max as number)) * 100}%`, background: 'var(--color-teal)', borderRadius: 2 }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-gray-200)', paddingTop: 8, marginTop: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Match score</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(score.total) }}>{score.total}/100</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onPass}
              disabled={loading}
              style={{ flex: 1, padding: '13px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-gray-200)', background: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
            >
              Pass
            </button>
            <button
              onClick={onConnect}
              disabled={loading}
              style={{ flex: 1, padding: '13px', borderRadius: 'var(--radius-full)', background: 'var(--color-black)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none' }}
            >
              {loading ? 'Sending…' : 'Connect'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '2px 8px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', fontSize: 10, color: 'var(--color-gray-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
      {children}
    </div>
  )
}

function DoneState({ remaining, total }: { remaining: number, total: number }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14L11 19L22 9" stroke="var(--color-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 8 }}>You're done for today</h2>
      <p style={{ fontSize: 13, color: 'var(--color-gray-600)', lineHeight: 1.6, maxWidth: 260, marginBottom: 20 }}>
        {remaining === 0 ? "You've reviewed all 5 profiles for today." : "No more matches in your area right now."}
        {' '}Come back tomorrow for new people.
      </p>
      <div style={{ padding: '12px 16px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-md)', maxWidth: 280 }}>
        <p style={{ fontSize: 12, color: 'var(--color-teal)', lineHeight: 1.6 }}>
          We limit to 5 profiles a day intentionally. Fewer choices, more thought, better connections.
        </p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2px solid var(--color-gray-200)', borderTop: '2px solid var(--color-teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 13, color: 'var(--color-gray-400)' }}>Finding your matches…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
