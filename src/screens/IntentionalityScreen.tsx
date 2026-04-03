import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const intentions = [
  { id: 'relationship', label: 'Long-term relationship', icon: '○' },
  { id: 'dating', label: 'Dating & seeing where it goes', icon: '○' },
  { id: 'connection', label: 'Meaningful connection', icon: '○' },
  { id: 'friendship', label: 'Friendship first', icon: '○' },
]

export default function IntentionalityScreen() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const [energy, setEnergy] = useState(3)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px 16px', overflow: 'auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--color-gray-400)', textTransform: 'uppercase', marginBottom: 8 }}>
          Before you start
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          What are you looking for today?
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 8, lineHeight: 1.5 }}>
          Your answer helps us show you people who want the same thing.
        </p>
      </div>

      {/* Intention options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {intentions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              border: `1px solid ${selected === opt.id ? 'var(--color-teal)' : 'var(--color-gray-200)'}`,
              borderRadius: 'var(--radius-md)',
              background: selected === opt.id ? 'var(--color-teal-dim)' : 'var(--color-white)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{
              width: 20, height: 20,
              borderRadius: '50%',
              border: `2px solid ${selected === opt.id ? 'var(--color-teal)' : 'var(--color-gray-200)'}`,
              background: selected === opt.id ? 'var(--color-teal)' : 'transparent',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected === opt.id && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: 14, fontWeight: 450, color: selected === opt.id ? 'var(--color-teal)' : 'var(--color-black)' }}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {/* Energy check */}
      <div style={{
        padding: '16px',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'auto',
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>How are you feeling?</div>
        <div style={{ fontSize: 12, color: 'var(--color-gray-400)', marginBottom: 14 }}>
          We'll adjust your experience accordingly
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => setEnergy(n)}
              style={{
                width: 44, height: 44,
                borderRadius: '50%',
                border: `1px solid ${energy === n ? 'var(--color-teal)' : 'var(--color-gray-200)'}`,
                background: energy === n ? 'var(--color-teal)' : 'var(--color-white)',
                color: energy === n ? 'white' : 'var(--color-gray-600)',
                fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>Low energy</span>
          <span style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>High energy</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => selected && navigate('/profile')}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '15px',
          borderRadius: 'var(--radius-full)',
          background: selected ? 'var(--color-black)' : 'var(--color-gray-200)',
          color: selected ? 'var(--color-white)' : 'var(--color-gray-400)',
          fontSize: 15, fontWeight: 500,
          cursor: selected ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          letterSpacing: '-0.2px',
        }}
      >
        Continue
      </button>

      {/* Transparency note */}
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-gray-400)', marginTop: 12, lineHeight: 1.5 }}>
        Only visible to people who share the same intention
      </p>
    </div>
  )
}
