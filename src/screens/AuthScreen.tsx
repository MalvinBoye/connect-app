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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 28px 32px' }}>

      {/* Wordmark */}
      <div style={{ marginBottom: 52 }}>
        <div style={{ fontSize: 42, fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--brown)', lineHeight: 1 }}>
          Connect
        </div>
        <div style={{ fontSize: 10, color: 'var(--sage)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 6 }}>
          キルケー · Circeé
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
        {mode === 'signin' ? 'Welcome back.' : 'Create your account.'}
      </h2>
      <p style={{ fontSize: 12, color: 'var(--brown-light)', marginBottom: 28, lineHeight: 1.6 }}>
        {mode === 'signin' ? 'Sign in to continue.' : 'Dating designed to actually work.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <input
          type="email" placeholder="Email address"
          value={email} onChange={e => setEmail(e.target.value)}
          className="field-input"
        />
        <input
          type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          className="field-input"
        />
      </div>

      {error && (
        <div style={{ padding: '10px 14px', border: '1px solid rgba(180,60,60,0.3)', borderRadius: 'var(--radius-md)', fontSize: 12, color: '#8B2020', marginBottom: 16, background: 'rgba(180,60,60,0.06)' }}>
          {error}
        </div>
      )}

      <button
        onClick={handle}
        disabled={loading || !email || !password}
        className="btn-primary"
        style={{ width: '100%', marginBottom: 12 }}
      >
        {loading ? '...' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </button>

      <button
        onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null) }}
        style={{ fontSize: 12, color: 'var(--brown-light)', textAlign: 'center', padding: '8px 0' }}
      >
        {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>

      <div style={{ marginTop: 'auto', paddingTop: 32 }}>
        <p style={{ fontSize: 10, color: 'var(--sage)', textAlign: 'center', lineHeight: 1.8, letterSpacing: '0.04em' }}>
          No dark patterns. No upsells.<br/>Your data is never sold.
        </p>
      </div>
    </div>
  )
}
