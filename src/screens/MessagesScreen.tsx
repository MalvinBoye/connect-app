import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase, Message, Profile } from '../lib/supabase'

export default function MessagesScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile: myProfile } = useAuth()
  const { matchId, otherProfile } = (location.state ?? {}) as { matchId: string; otherProfile: Profile }
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchId) { navigate('/connections'); return }
    fetchMessages()
    const channel = supabase.channel(`match-${matchId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => setMessages(prev => [...prev, payload.new as Message]))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [matchId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').eq('match_id', matchId).order('created_at', { ascending: true })
    setMessages(data ?? []); setLoading(false)
  }

  const send = async () => {
    if (!input.trim() || !myProfile || !matchId) return
    const content = input.trim(); setInput('')
    await supabase.from('messages').insert({ match_id: matchId, sender_id: myProfile.id, content })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: 'var(--cream)', borderBottom: '1px solid var(--brown-border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => navigate('/connections')} style={{ color: 'var(--brown-light)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3.5L6 9l5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: otherProfile?.avatar_url ? `url(${otherProfile.avatar_url}) center/cover` : 'var(--sage-dim)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--sage)', border: '1px solid var(--brown-border)' }}>
          {!otherProfile?.avatar_url && (otherProfile?.name?.[0] ?? '?')}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{otherProfile?.name ?? 'Match'}{otherProfile?.age ? `, ${otherProfile.age}` : ''}</div>
          <div style={{ fontSize: 9, color: 'var(--sage)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connected</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--cream-dark)' }}>
        {loading ? <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--brown-light)' }}>Loading…</div>
          : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 20px' }}>
              <p style={{ fontSize: 12, color: 'var(--brown-light)', lineHeight: 1.7, fontStyle: 'italic' }}>You matched. Say something real.</p>
            </div>
          ) : messages.map(msg => {
            const isMe = msg.sender_id === myProfile?.id
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
                {!isMe && (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--sage-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--sage)', flexShrink: 0, border: '1px solid var(--brown-border)' }}>
                    {otherProfile?.name?.[0] ?? '?'}
                  </div>
                )}
                <div style={{ maxWidth: '74%' }}>
                  <div style={{ padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? 'var(--sage)' : 'var(--cream)', color: isMe ? 'var(--cream)' : 'var(--brown)', fontSize: 13, lineHeight: 1.6, border: isMe ? 'none' : '1px solid var(--brown-border)' }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--brown-light)', marginTop: 3, textAlign: isMe ? 'right' : 'left', letterSpacing: '0.04em' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )
          })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', background: 'var(--cream)', borderTop: '1px solid var(--brown-border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Message ${otherProfile?.name ?? 'them'}…`} className="field-input" style={{ flex: 1 }} />
        <button onClick={send} style={{ width: 34, height: 34, borderRadius: '50%', background: input.trim() ? 'var(--sage)' : 'var(--brown-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s', border: 'none', cursor: input.trim() ? 'pointer' : 'default' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5H11.5M11.5 6.5L7 2M11.5 6.5L7 11" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}
