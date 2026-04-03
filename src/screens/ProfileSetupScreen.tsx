import React, { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const intentions = [
  { id: 'relationship', label: 'Long-term relationship' },
  { id: 'dating', label: 'Dating & seeing where it goes' },
  { id: 'connection', label: 'Meaningful connection' },
  { id: 'friendship', label: 'Friendship first' },
]

export default function ProfileSetupScreen() {
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [intention, setIntention] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const submit = async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    let avatar_url: string | null = null

    // Upload photo if provided
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })

      if (uploadError) {
        setError('Photo upload failed. Try a smaller image.')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = urlData.publicUrl
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      name: name.trim(),
      age: parseInt(age),
      bio: bio.trim() || null,
      intention,
      avatar_url,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    await refreshProfile()
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px 24px', overflow: 'auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: n <= step ? 'var(--color-black)' : 'var(--color-gray-200)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 6 }}>
            Let's set up your profile
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginBottom: 24 }}>
            This is what others will see.
          </p>

          {/* Photo upload */}
          <label style={{ cursor: 'pointer', marginBottom: 24 }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: avatarPreview ? 'transparent' : 'var(--color-teal-dim)',
              border: '2px dashed var(--color-teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {avatarPreview
                ? <img src={avatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 28 }}>+</span>
              }
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-teal)', marginTop: 6 }}>Add photo</div>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Age"
              type="number"
              min="18" max="99"
              value={age}
              onChange={e => setAge(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!name.trim() || !age || parseInt(age) < 18}
            style={{ ...btnStyle, marginTop: 'auto', background: name && age ? 'var(--color-black)' : 'var(--color-gray-200)', color: name && age ? 'white' : 'var(--color-gray-400)' }}
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 6 }}>
            What are you looking for?
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginBottom: 24, lineHeight: 1.5 }}>
            You'll only see people who want the same thing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'auto' }}>
            {intentions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setIntention(opt.id)}
                style={{
                  padding: '14px 16px',
                  border: `1px solid ${intention === opt.id ? 'var(--color-teal)' : 'var(--color-gray-200)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: intention === opt.id ? 'var(--color-teal-dim)' : 'white',
                  color: intention === opt.id ? 'var(--color-teal)' : 'var(--color-black)',
                  fontSize: 14, fontWeight: 450, textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(1)} style={{ ...btnStyle, flex: 0.4, background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)' }}>
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!intention}
              style={{ ...btnStyle, flex: 1, background: intention ? 'var(--color-black)' : 'var(--color-gray-200)', color: intention ? 'white' : 'var(--color-gray-400)' }}
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 6 }}>
            Tell people about yourself
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginBottom: 24 }}>
            Optional — but people who write bios get more connections.
          </p>

          <textarea
            placeholder="A few sentences about you, what you care about, what you're looking for..."
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={300}
            style={{
              ...inputStyle,
              minHeight: 140, resize: 'none',
              lineHeight: 1.6,
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--color-gray-400)', textAlign: 'right', marginTop: 4 }}>
            {bio.length}/300
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#cc0000', marginTop: 12 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
            <button onClick={() => setStep(2)} style={{ ...btnStyle, flex: 0.4, background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)' }}>
              Back
            </button>
            <button
              onClick={submit}
              disabled={loading}
              style={{ ...btnStyle, flex: 1, background: 'var(--color-black)', color: 'white' }}
            >
              {loading ? 'Saving…' : 'Finish'}
            </button>
          </div>
        </>
      )}
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

const btnStyle: React.CSSProperties = {
  padding: '15px',
  borderRadius: 'var(--radius-full)',
  fontSize: 15, fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
}
