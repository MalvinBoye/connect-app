import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { getMatches } from '../lib/matching'
import { Match } from '../lib/supabase'
import { supabase } from '../lib/supabase'

export default function MessagesScreen() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!profile) return
    loadMatches()
  }, [profile])

  const loadMatches = async () => {
    setLoading(true)
    const data = await getMatches(profile!.id)
    setMatches(data)

    // Fetch last message for each match
    const msgs: Record<string, string> = {}
    await Promise.all(data.map(async (m) => {
      const { data: last } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('match_id', m.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (last) msgs[m.id] = last.content
    }))
    setLastMessages(msgs)
    setLoading(false)
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 13, color: 'var(--color-gray-400)' }}>Loading…</p>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 14px', background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px' }}>Connections</h2>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', fontSize: 13, color: 'var(--color-teal)', fontWeight: 500 }}>Discover</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {matches.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--color-gray-400)', lineHeight: 1.6 }}>No connections yet. Keep browsing — matches appear here when both of you connect.</p>
          </div>
        ) : matches.map(match => (
          <button
            key={match.id}
            onClick={() => navigate('/conversation', { state: { matchId: match.id, otherProfile: match.other_profile } })}
            style={{ width: '100%', padding: '14px 16px', background: 'white', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: match.other_profile?.avatar_url ? `url(${match.other_profile.avatar_url}) center/cover` : 'var(--color-teal-dim)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: 'var(--color-teal)' }}>
              {!match.other_profile?.avatar_url && (match.other_profile?.name?.[0] ?? '?')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{match.other_profile?.name ?? 'Unknown'}, {match.other_profile?.age}</span>
                <span style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>{formatTime(match.created_at)}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lastMessages[match.id] ?? 'Say hello!'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d'
  return `${days}d`
}
