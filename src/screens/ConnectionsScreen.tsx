import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { getMatches } from '../lib/matching'
import { supabase } from '../lib/supabase'

export default function ConnectionsScreen() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [matches, setMatches] = useState<any[]>([])
  const [lastMessages, setLastMessages] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (profile) load() }, [profile])

  const load = async () => {
    setLoading(true)
    const data = await getMatches(profile!.id)
    setMatches(data)
    const msgs: Record<string, any> = {}
    await Promise.all(data.map(async (m: any) => {
      const { data: last } = await supabase.from('messages').select('content, created_at, sender_id').eq('match_id', m.id).order('created_at', { ascending: false }).limit(1).single()
      if (last) msgs[m.id] = last
    }))
    setLastMessages(msgs)
    setLoading(false)
  }

  const health = (matchId: string) => {
    const last = lastMessages[matchId]
    if (!last) return { label: 'New', color: '#6B8C5A' }
    const days = (Date.now() - new Date(last.created_at).getTime()) / 86400000
    if (days < 2) return { label: 'Active', color: '#6B8C5A' }
    if (days < 5) return { label: 'Fading', color: '#8C7A4A' }
    return { label: 'Quiet', color: 'var(--brown-light)' }
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 20, height: 20, border: '1px solid var(--brown-border)', borderTop: '1px solid var(--sage)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className="screen">
      <div className="screen-header">
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Connections</div>
        <div style={{ fontSize: 10, color: 'var(--sage)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>{matches.length} mutual match{matches.length !== 1 ? 'es' : ''}</div>
      </div>

      {matches.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 16, opacity: 0.3 }}>◇</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No connections yet.</h3>
          <p style={{ fontSize: 12, color: 'var(--brown-light)', lineHeight: 1.7, maxWidth: 220 }}>
            When someone connects back, they'll appear here.
          </p>
        </div>
      ) : matches.map((match: any) => {
        const other = match.other_profile
        const h = health(match.id)
        const last = lastMessages[match.id]
        const isMe = last?.sender_id === profile?.id

        return (
          <button key={match.id} onClick={() => navigate('/messages', { state: { matchId: match.id, otherProfile: other } })} style={{ width: '100%', padding: '16px 20px', background: 'transparent', borderBottom: '1px solid var(--brown-border)', display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: other?.avatar_url ? `url(${other.avatar_url}) center/cover` : 'var(--sage-dim)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--sage)', border: '1px solid var(--brown-border)', position: 'relative' }}>
              {!other?.avatar_url && (other?.name?.[0] ?? '?')}
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: h.color, border: '2px solid var(--cream)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{other?.name ?? 'Unknown'}{other?.age ? `, ${other.age}` : ''}</span>
                <span style={{ fontSize: 10, color: 'var(--brown-light)', letterSpacing: '0.02em' }}>{formatTime(match.created_at)}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--brown-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 5 }}>
                {last ? `${isMe ? 'You: ' : ''}${last.content}` : 'Say hello.'}
              </p>
              <span style={{ fontSize: 9, color: h.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h.label}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function formatTime(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  return days === 0 ? 'Today' : days === 1 ? '1d' : `${days}d`
}
