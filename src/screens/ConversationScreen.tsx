import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase, Message, Profile } from '../lib/supabase'

export default function ConversationScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile: myProfile } = useAuth()
  const { matchId, otherProfile } = (location.state ?? {}) as { matchId: string; otherProfile: Profile }
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchId) return
    fetchMessages()

    // Real-time subscription
    const channel = supabase
      .channel(`match-${matchId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => setMessages(prev => [...prev, payload.new as Message])
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [matchId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
    setLoading(false)
  }

  const send = async () => {
    if (!input.trim() || !myProfile || !matchId) return
    const content = input.trim()
    setInput('')
    await supabase.from('messages').insert({ match_id: matchId, sender_id: myProfile.id, content })
  }

  const daysSinceMatch = () => {
    // simplified — would compute from match created_at in real impl
    return messages.length > 10 ? 5 : 0
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/messages')} style={{ background: 'none', color: 'var(--color-gray-600)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: otherProfile?.avatar_url ? `url(${otherProfile.avatar_url}) center/cover` : 'var(--color-teal-dim)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--color-teal)' }}>
          {!otherProfile?.avatar_url && (otherProfile?.name?.[0] ?? '?')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{otherProfile?.name ?? 'Match'}{otherProfile?.age ? `, ${otherProfile.age}` : ''}</div>
          <div style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>Matched connection</div>
        </div>
      </div>

      {/* Move offline nudge if many messages */}
      {daysSinceMatch() >= 5 && (
        <div style={{ padding: '12px 16px', background: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 2 }}>Ready to meet in person?</div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Real connections happen offline.</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--color-gray-100)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-gray-400)', fontSize: 13 }}>Loading…</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <p style={{ fontSize: 13, color: 'var(--color-gray-400)', lineHeight: 1.6 }}>You matched! Say something real.</p>
          </div>
        ) : messages.map(msg => {
          const isMe = msg.sender_id === myProfile?.id
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
              {!isMe && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--color-teal)', flexShrink: 0 }}>
                  {otherProfile?.name?.[0] ?? '?'}
                </div>
              )}
              <div style={{ maxWidth: '72%' }}>
                <div style={{ padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? 'var(--color-black)' : 'white', color: isMe ? 'white' : 'var(--color-black)', fontSize: 13, lineHeight: 1.5, boxShadow: 'var(--shadow-sm)' }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-gray-400)', marginTop: 3, textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', background: 'white', borderTop: '1px solid var(--color-gray-200)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={`Message ${otherProfile?.name ?? 'them'}…`}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font)', fontSize: 13, outline: 'none', background: 'var(--color-gray-100)' }}
        />
        <button onClick={send} style={{ width: 36, height: 36, borderRadius: '50%', background: input.trim() ? 'var(--color-black)' : 'var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'background 0.15s', border: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke={input.trim() ? 'white' : '#999'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}
