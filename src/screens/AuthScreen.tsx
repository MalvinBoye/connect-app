import React, { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setError(null)
    setLoading(true)
    const fn = mode === 'signin' ? signIn : signUp
    const { error } = await fn(email, password)
    if (error) setError(error)
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-teal)' }}>
          connect
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-gray-400)', marginTop: 6 }}>
          Dating designed to actually work
        </p>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 24 }}>
        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          style={inputStyle}
        />
      </div>

      {error && (
        <div style={{
          padding: '10px 14px',
          background: '#fff0f0',
          border: '1px solid #ffcccc',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12, color: '#cc0000',
          marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handle}
        disabled={loading || !email || !password}
        style={{
          padding: '15px',
          borderRadius: 'var(--radius-full)',
          background: email && password ? 'var(--color-black)' : 'var(--color-gray-200)',
          color: email && password ? 'white' : 'var(--color-gray-400)',
          fontSize: 15, fontWeight: 500,
          cursor: email && password ? 'pointer' : 'default',
          marginBottom: 16,
        }}
      >
        {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </button>

      <button
        onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null) }}
        style={{
          background: 'none',
          fontSize: 13, color: 'var(--color-gray-600)',
          textAlign: 'center',
        }}
      >
        {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>

      <div style={{ marginTop: 'auto', padding: '16px 0 0' }}>
        <p style={{ fontSize: 11, color: 'var(--color-gray-400)', textAlign: 'center', lineHeight: 1.6 }}>
          No dark patterns. No upsells. Flat subscription. Your data is never sold.
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '13px 16px',
  border: '1px solid var(--color-gray-200)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font)',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}
