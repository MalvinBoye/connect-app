import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TransparencyScreen() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-gray-200)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', color: 'var(--color-gray-600)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px' }}>Transparency Dashboard</h2>
          <p style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>How the app makes decisions about you</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Your visibility */}
        <Section title="Your visibility">
          <MetricRow label="Profile shown today" value="12 people" />
          <MetricRow label="How you're ranked" value="Chronologically" note="Not by payment" />
          <MetricRow label="Boost active" value="No boosts" highlight />
        </Section>

        {/* Algorithm */}
        <Section title="Why you see who you see">
          <div style={{ fontSize: 13, color: 'var(--color-gray-600)', lineHeight: 1.6, marginBottom: 8 }}>
            Profiles shown are filtered by:
          </div>
          {['Shared intention', 'Distance preference', 'Age range', 'Active in last 7 days'].map(f => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)', flexShrink: 0 }} />
              <span style={{ fontSize: 13 }}>{f}</span>
            </div>
          ))}
          <div style={{
            marginTop: 10, padding: '10px 12px',
            background: 'var(--color-teal-dim)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <p style={{ fontSize: 12, color: 'var(--color-teal)', lineHeight: 1.5 }}>
              Paying users do not appear more frequently. Filters are available to all users equally.
            </p>
          </div>
        </Section>

        {/* Your data */}
        <Section title="Your data">
          <MetricRow label="Data collected" value="Profile only" />
          <MetricRow label="Sold to advertisers" value="Never" highlight />
          <MetricRow label="Used for AI training" value="Never without consent" />
          <button style={{
            marginTop: 10, width: '100%',
            padding: '10px 14px',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            fontSize: 12, fontWeight: 500,
            color: 'var(--color-gray-600)',
            cursor: 'pointer',
          }}>
            Download your data
          </button>
        </Section>

        {/* Subscription */}
        <Section title="What your subscription includes">
          <div style={{ fontSize: 13, color: 'var(--color-gray-600)', lineHeight: 1.6, marginBottom: 4 }}>
            $12/month flat. No tiers, no upsells.
          </div>
          {['Unlimited connections', 'All filters included', 'No ads, ever', 'Full message history'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" fill="var(--color-teal)" opacity="0.15"/>
                <path d="M4 7L6 9L10 5" stroke="var(--color-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-gray-200)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-gray-200)',
        fontSize: 12, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.07em',
        color: 'var(--color-gray-400)',
      }}>
        {title}
      </div>
      <div style={{ padding: '14px 16px' }}>
        {children}
      </div>
    </div>
  )
}

function MetricRow({ label, value, note, highlight }: { label: string, value: string, note?: string, highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: 'var(--color-gray-600)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: highlight ? 'var(--color-teal)' : 'var(--color-black)' }}>
          {value}
        </span>
        {note && <div style={{ fontSize: 11, color: 'var(--color-gray-400)', marginTop: 1 }}>{note}</div>}
      </div>
    </div>
  )
}
