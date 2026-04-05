import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CompletionScreen() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px 24px', overflow: 'auto' }}>

      {/* Done indicator */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          border: '2px solid var(--sage)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 16L13 21L24 11" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 10 }}>
          You're done for today
        </h2>
        <p style={{ fontSize: 14, color: 'var(--brown-light)', textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>
          You've reviewed today's profiles. Come back tomorrow for new people — we surface 5 per day to keep things intentional.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 1,
          marginTop: 32, marginBottom: 32,
          border: '1px solid var(--brown-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          width: '100%',
        }}>
          {[
            { n: '5', label: 'Reviewed today' },
            { n: '2', label: 'Connections sent' },
            { n: '3', label: 'Days active' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, padding: '16px 12px',
              background: 'var(--cream)',
              textAlign: 'center',
              borderRight: i < 2 ? '1px solid var(--brown-border)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--sage)' }}>{stat.n}</div>
              <div style={{ fontSize: 11, color: 'var(--brown-light)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why this design */}
        <div style={{
          padding: '14px 16px',
          background: 'var(--cream-dark)',
          borderRadius: 'var(--radius-md)',
          width: '100%',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--brown)' }}>
            Why only 5 profiles a day?
          </div>
          <p style={{ fontSize: 12, color: 'var(--brown-light)', lineHeight: 1.6 }}>
            Most dating apps show you hundreds of profiles to keep you scrolling. We believe fewer, better choices lead to more real connections.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => navigate('/messages')}
          style={{
            padding: '15px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--brown)',
            color: 'var(--cream)',
            fontSize: 15, fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '-0.2px',
          }}
        >
          Check your conversations
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '15px',
            borderRadius: 'var(--radius-full)',
            background: 'transparent',
            border: '1px solid var(--brown-border)',
            color: 'var(--brown-light)',
            fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Back to home
        </button>
      </div>
    </div>
  )
}
