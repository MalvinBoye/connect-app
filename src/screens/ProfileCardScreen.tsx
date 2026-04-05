import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { ScoredProfile, getTodaysProfiles, getDailyRemaining, recordSwipe } from '../lib/matching'
import { getInterestLabels } from '../lib/interests'

export default function ProfileCardScreen() {
  const navigate = useNavigate()
  const { profile: myProfile } = useAuth()
  const [profiles, setProfiles] = useState<ScoredProfile[]>([])
  const [remaining, setRemaining] = useState(5)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [actioned, setActioned] = useState<Record<string, 'connect' | 'pass'>>({})
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => { if (myProfile) load() }, [myProfile])

  const load = async () => {
    setLoading(true)
    const [fetched, rem] = await Promise.all([
      getTodaysProfiles(myProfile!.id, myProfile!),
      getDailyRemaining(myProfile!.id),
    ])
    setProfiles(fetched); setRemaining(rem); setLoading(false)
  }

  const handleConnect = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!myProfile || connecting) return
    setConnecting(id)
    const { matched, matchId } = await recordSwipe(myProfile.id, id, 'connect')
    setActioned(prev => ({ ...prev, [id]: 'connect' }))
    setConnecting(null)
    if (matched && matchId) navigate('/matched', { state: { matchId, targetName: profiles.find(p => p.id === id)?.name } })
  }

  const handlePass = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!myProfile || connecting) return
    setConnecting(id)
    await recordSwipe(myProfile.id, id, 'pass')
    setActioned(prev => ({ ...prev, [id]: 'pass' }))
    setConnecting(null)
  }

  if (loading) return <Loader />

  const active = profiles.filter(p => !actioned[p.id])
  if (remaining === 0 || active.length === 0) return <DoneState remaining={remaining} actioned={actioned} />

  return (
    <div className="screen">
      <div className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Potential Partners</div>
          <div style={{ fontSize: 10, color: 'var(--sage)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>{remaining} remaining today</div>
        </div>
        <button onClick={() => navigate('/transparency')} style={{ color: 'var(--brown-light)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid var(--brown-border)', borderRadius: 'var(--radius-full)', padding: '5px 10px' }}>
          Why these?
        </button>
      </div>

      <div style={{ padding: '8px 0' }}>
        {active.map(p => (
          <ProfileRow key={p.id} profile={p} expanded={expanded === p.id}
            onToggle={() => setExpanded(prev => prev === p.id ? null : p.id)}
            onConnect={e => handleConnect(e, p.id)}
            onPass={e => handlePass(e, p.id)}
            loading={connecting === p.id}
          />
        ))}
      </div>

      {Object.keys(actioned).length > 0 && (
        <div style={{ padding: '12px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--sage)', letterSpacing: '0.06em' }}>
            {Object.values(actioned).filter(a => a === 'connect').length} connection{Object.values(actioned).filter(a => a === 'connect').length !== 1 ? 's' : ''} sent
          </span>
        </div>
      )}
    </div>
  )
}

function ProfileRow({ profile, expanded, onToggle, onConnect, onPass, loading }: {
  profile: ScoredProfile; expanded: boolean
  onToggle: () => void; onConnect: (e: React.MouseEvent) => void
  onPass: (e: React.MouseEvent) => void; loading: boolean
}) {
  const interests = getInterestLabels(profile.bio ?? '')
  const score = profile.score

  return (
    <div style={{ borderBottom: '1px solid var(--brown-border)' }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer', background: expanded ? 'var(--sage-dim)' : 'transparent', transition: 'background 0.15s' }}>
        {/* Avatar */}
        <div style={{ width: 54, height: 54, borderRadius: '50%', flexShrink: 0, background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--sage-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--sage)', border: '1px solid var(--brown-border)', position: 'relative' }}>
          {!profile.avatar_url && profile.name[0]}
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: scoreColor(score.total), border: '2px solid var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 6, fontWeight: 700, color: 'white' }}>{score.total}</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.01em' }}>{profile.name}, {profile.age}</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <Tag>{intentionLabel(profile.intention)}</Tag>
            {interests.slice(0, 2).map(i => <Tag key={i}>{i}</Tag>)}
          </div>
        </div>

        {/* Connect btn */}
        <button onClick={onConnect} disabled={loading} className="btn-primary" style={{ flexShrink: 0, padding: '7px 16px', fontSize: 12 }}>
          {loading ? '...' : 'Connect'}
        </button>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: '0 20px 20px', background: 'var(--sage-dim)', borderTop: '1px solid var(--brown-border)' }}>
          {profile.avatar_url && <div style={{ height: 200, background: `url(${profile.avatar_url}) center/cover`, borderRadius: 'var(--radius-md)', marginBottom: 16, marginTop: 16 }} />}

          {profile.bio && <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--brown)', marginBottom: 16, marginTop: 16, fontStyle: 'italic' }}>"{profile.bio}"</p>}

          {/* Score breakdown */}
          <div style={{ padding: '14px', background: 'var(--cream)', borderRadius: 'var(--radius-md)', border: '1px solid var(--brown-border)', marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--sage)', marginBottom: 12 }}>Why you're seeing {profile.name}</div>
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
                  <span style={{ fontSize: 11, color: 'var(--brown-light)' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)' }}>{pts}/{max}</span>
                </div>
                <div style={{ height: 2, background: 'var(--brown-border)', borderRadius: 1 }}>
                  <div style={{ height: '100%', width: `${((pts as number)/(max as number))*100}%`, background: 'var(--sage)', borderRadius: 1, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
            {score.reasons.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--brown-border)' }}>
                {score.reasons.slice(0, 3).map(r => (
                  <div key={r} style={{ fontSize: 10, color: 'var(--sage)', marginBottom: 3, letterSpacing: '0.02em' }}>· {r}</div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--brown-border)', paddingTop: 8, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>Match score</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(score.total) }}>{score.total}/100</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onPass} className="btn-secondary" style={{ flex: 1 }}>Pass</button>
            <button onClick={onConnect} disabled={loading} className="btn-primary" style={{ flex: 1 }}>{loading ? '...' : 'Connect'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '2px 8px', border: '1px solid var(--brown-border)', borderRadius: 'var(--radius-full)', fontSize: 9, color: 'var(--brown-light)', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>{children}</div>
}

function DoneState({ remaining, actioned }: { remaining: number; actioned: Record<string, string> }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 20, opacity: 0.4 }}>○</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>Done for today.</h2>
      <p style={{ fontSize: 12, color: 'var(--brown-light)', lineHeight: 1.8, maxWidth: 240, marginBottom: 20 }}>
        {remaining === 0 ? "You've reviewed all 5 profiles." : "No more profiles right now."} Come back tomorrow.
      </p>
      <div style={{ padding: '12px 16px', border: '1px solid var(--brown-border)', borderRadius: 'var(--radius-md)', maxWidth: 260 }}>
        <p style={{ fontSize: 11, color: 'var(--sage)', lineHeight: 1.7, letterSpacing: '0.02em' }}>
          5 profiles a day, intentionally. Fewer choices, more thought, better connections.
        </p>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 24, height: 24, border: '1px solid var(--brown-border)', borderTop: '1px solid var(--sage)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function scoreColor(s: number) { return s >= 70 ? '#6B8C5A' : s >= 45 ? '#8C7A4A' : 'var(--brown-light)' }
function intentionLabel(i: string) {
  return { relationship: 'Long-term', dating: 'Dating', connection: 'Connection', friendship: 'Friendship' }[i] ?? i
}
