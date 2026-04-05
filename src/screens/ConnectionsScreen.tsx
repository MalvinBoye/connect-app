import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { getMatches } from '../lib/matching'
import { supabase } from '../lib/supabase'

export default function ConnectionsScreen() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [matches, setMatches] = useState<any[]>([])
  const [lastMessages, setLastMessages] = useState<Record<string, { content: string; created_at: string; sender_id: string }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    load()
  }, [profile])

  const load = async () => {
    setLoading(true)
    const data = await getMatches(profile!.id)
    setMatches(data)
    const msgs: Record<string, any> = {}
    await Promise.all(data.map(async (m: any) => {
      const { data: last } = await supabase
        .from('messages').select('content, created_at, sender_id')
        .eq('match_id', m.id).order('created_at', { ascending: false }).limit(1).single()
      if (last) msgs[m.id] = last
    }))
    setLastMessages(msgs)
    setLoading(false)
  }

  const getHealth = (matchId: string, createdAt: string) => {
    const last = lastMessages[matchId]
    if (!last) return { label: 'New match', color: '#2C7A4B', bg: '#e8f5ed' }
    const daysSince = (Date.now() - new Date(last.created_at).getTime()) / 86400000
    if (daysSince < 1) return { label: 'Active', color: '#2C7A4B', bg: '#e8f5ed' }
    if (daysSince < 3) return { label: 'Recent', color: '#2C7A4B', bg: '#e8f5ed' }
    if (daysSince < 6) return { label: 'Fading', color: '#A0622A', bg: '#fef3e8' }
    return { label: 'Needs attention', color: '#999', bg: '#f5f5f5' }
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--color-gray-200)', borderTop: '2px solid var(--color-teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className="screen">
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--color-gray-200)', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Connections</h1>
        <p style={{ fontSize: 12, color: 'var(--color-gray-400)', marginTop: 2 }}>
          {matches.length} mutual match{matches.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {matches.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No connections yet</h3>
          <p style={{ fontSize: 13, color: 'var(--color-gray-600)', lineHeight: 1.6, maxWidth: 240 }}>
            When someone connects back with you, they'll appear here.
          </p>
        </div>
      ) : (
        <div>
          {matches.map((match: any) => {
            const other = match.other_profile
            const health = getHealth(match.id, match.created_at)
            const last = lastMessages[match.id]
            const isMe = last?.sender_id === profile?.id
            const daysSinceMatch = Math.floor((Date.now() - new Date(match.created_at).getTime()) / 86400000)

            return (
              <button
                key={match.id}
                onClick={() => navigate('/messages', { state: { matchId: match.id, otherProfile: other } })}
                style={{ width: '100%', padding: '14px 16px', background: 'white', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left' }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: other?.avatar_url ? `url(${other.avatar_url}) center/cover` : 'var(--color-teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--color-teal)' }}>
                    {!other?.avatar_url && (other?.name?.[0] ?? '?')}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: health.color, border: '2px solid white' }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{other?.name ?? 'Unknown'}{other?.age ? `, ${other.age}` : ''}</span>
                    <span style={{ fontSize: 10, color: 'var(--color-gray-400)', flexShrink: 0, marginLeft: 8 }}>{formatTime(match.created_at)}</span>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--color-gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 5 }}>
                    {last ? `${isMe ? 'You: ' : ''}${last.content}` : 'Say hello! 👋'}
                  </p>

                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ padding: '2px 7px', background: health.bg, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: health.color }} />
                      <span style={{ fontSize: 10, fontWeight: 500, color: health.color }}>{health.label}</span>
                    </div>
                    {daysSinceMatch >= 5 && !last && (
                      <div style={{ padding: '2px 7px', background: '#fef3e8', borderRadius: 'var(--radius-full)' }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: '#A0622A' }}>Say hi first</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}

          {/* Move offline nudge if any match is 5+ days old with messages */}
          {matches.some((m: any) => {
            const days = (Date.now() - new Date(m.created_at).getTime()) / 86400000
            return days >= 5 && lastMessages[m.id]
          }) && (
            <div style={{ margin: '12px 16px', padding: '12px 14px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 12, color: 'var(--color-teal)', lineHeight: 1.5 }}>
                💡 Some of your connections have been chatting for a while. Real connections happen offline — ready to suggest meeting up?
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d'
  return `${days}d`
}
