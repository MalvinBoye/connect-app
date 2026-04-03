import React, { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const intentions = [
  { id: 'relationship', label: 'Long-term relationship' },
  { id: 'dating', label: 'Dating & seeing where it goes' },
  { id: 'connection', label: 'Meaningful connection' },
  { id: 'friendship', label: 'Friendship first' },
]
const genderOptions = ['Man', 'Woman', 'Non-binary', 'Other', 'Prefer not to say']
const lookingForOptions = ['Men', 'Women', 'Non-binary people', 'Everyone']
const readinessLabels = ['Just started thinking about it', 'Warming up to the idea', 'Open and ready', 'Actively looking', 'Very ready']

export default function ProfileSetupScreen() {
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [lookingFor, setLookingFor] = useState('')
  const [ageMin, setAgeMin] = useState('18')
  const [ageMax, setAgeMax] = useState('45')
  const [readiness, setReadiness] = useState(3)
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
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (uploadError) { setError('Photo upload failed.'); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = urlData.publicUrl
    }
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      name: name.trim(),
      age: parseInt(age),
      bio: bio.trim() || null,
      intention,
      gender,
      looking_for: lookingFor,
      age_min: parseInt(ageMin),
      age_max: parseInt(ageMax),
      relationship_readiness: readiness,
      avatar_url,
    })
    if (profileError) { setError(profileError.message); setLoading(false); return }
    await refreshProfile()
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px 24px', overflow: 'auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {[1,2,3,4].map(n => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: n <= step ? 'var(--color-black)' : 'var(--color-gray-200)', transition: 'background 0.2s' }} />
        ))}
      </div>

      {/* STEP 1: Basic info + photo */}
      {step === 1 && <>
        <h2 style={hStyle}>Tell us about yourself</h2>
        <label style={{ cursor: 'pointer', marginBottom: 20 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: avatarPreview ? 'transparent' : 'var(--color-teal-dim)', border: '2px dashed var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {avatarPreview ? <img src={avatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28 }}>+</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-teal)', marginTop: 6 }}>Add photo</div>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 'auto' }}>
          <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input placeholder="Age" type="number" min="18" max="99" value={age} onChange={e => setAge(e.target.value)} style={inputStyle} />
          <div>
            <div style={labelStyle}>I am a…</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {genderOptions.map(g => (
                <button key={g} onClick={() => setGender(g)} style={chipStyle(gender === g)}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={labelStyle}>Looking for…</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {lookingForOptions.map(g => (
                <button key={g} onClick={() => setLookingFor(g)} style={chipStyle(lookingFor === g)}>{g}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => setStep(2)} disabled={!name || !age || parseInt(age) < 18} style={{ ...btnStyle, background: name && age ? 'var(--color-black)' : 'var(--color-gray-200)', color: name && age ? 'white' : 'var(--color-gray-400)', marginTop: 20 }}>Continue</button>
      </>}

      {/* STEP 2: Preferences */}
      {step === 2 && <>
        <h2 style={hStyle}>Your preferences</h2>
        <p style={subStyle}>These filter who you see — no one outside your range will appear.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 'auto' }}>
          <div>
            <div style={labelStyle}>Age range you're open to</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, alignItems: 'center' }}>
              <input type="number" min="18" max="99" value={ageMin} onChange={e => setAgeMin(e.target.value)} style={{ ...inputStyle, width: 80, textAlign: 'center' }} />
              <span style={{ color: 'var(--color-gray-400)', fontSize: 13 }}>to</span>
              <input type="number" min="18" max="99" value={ageMax} onChange={e => setAgeMax(e.target.value)} style={{ ...inputStyle, width: 80, textAlign: 'center' }} />
            </div>
          </div>
          <div>
            <div style={labelStyle}>Relationship readiness</div>
            <p style={{ fontSize: 12, color: 'var(--color-gray-400)', marginBottom: 12, marginTop: 4 }}>
              {readinessLabels[readiness - 1]}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setReadiness(n)} style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: `1px solid ${readiness === n ? 'var(--color-teal)' : 'var(--color-gray-200)'}`, background: readiness === n ? 'var(--color-teal)' : 'white', color: readiness === n ? 'white' : 'var(--color-gray-600)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--color-gray-400)' }}>Just thinking</span>
              <span style={{ fontSize: 10, color: 'var(--color-gray-400)' }}>Very ready</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => setStep(1)} style={{ ...btnStyle, flex: 0.4, background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)' }}>Back</button>
          <button onClick={() => setStep(3)} style={{ ...btnStyle, flex: 1, background: 'var(--color-black)', color: 'white' }}>Continue</button>
        </div>
      </>}

      {/* STEP 3: Intention */}
      {step === 3 && <>
        <h2 style={hStyle}>What are you looking for?</h2>
        <p style={subStyle}>You'll only see people who want the same thing.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'auto' }}>
          {intentions.map(opt => (
            <button key={opt.id} onClick={() => setIntention(opt.id)} style={{ padding: '14px 16px', border: `1px solid ${intention === opt.id ? 'var(--color-teal)' : 'var(--color-gray-200)'}`, borderRadius: 'var(--radius-md)', background: intention === opt.id ? 'var(--color-teal-dim)' : 'white', color: intention === opt.id ? 'var(--color-teal)' : 'var(--color-black)', fontSize: 14, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}>
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => setStep(2)} style={{ ...btnStyle, flex: 0.4, background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)' }}>Back</button>
          <button onClick={() => setStep(4)} disabled={!intention} style={{ ...btnStyle, flex: 1, background: intention ? 'var(--color-black)' : 'var(--color-gray-200)', color: intention ? 'white' : 'var(--color-gray-400)' }}>Continue</button>
        </div>
      </>}

      {/* STEP 4: Bio */}
      {step === 4 && <>
        <h2 style={hStyle}>Tell people about yourself</h2>
        <p style={subStyle}>This helps the algorithm find people who share your interests.</p>
        <textarea placeholder="What do you care about? What are you into? What makes a good connection for you?" value={bio} onChange={e => setBio(e.target.value)} maxLength={300} style={{ ...inputStyle, minHeight: 160, resize: 'none', lineHeight: 1.6, marginBottom: 8 }} />
        <div style={{ fontSize: 11, color: 'var(--color-gray-400)', textAlign: 'right', marginBottom: 12 }}>{bio.length}/300</div>
        <div style={{ padding: '10px 14px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--color-teal)', lineHeight: 1.5 }}>Tip: Mention specific interests — hiking, reading, music, cooking. The algorithm uses these to find people with shared passions.</p>
        </div>
        {error && <div style={{ padding: '10px 14px', background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#cc0000', marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
          <button onClick={() => setStep(3)} style={{ ...btnStyle, flex: 0.4, background: 'transparent', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)' }}>Back</button>
          <button onClick={submit} disabled={loading} style={{ ...btnStyle, flex: 1, background: 'var(--color-black)', color: 'white' }}>{loading ? 'Saving…' : 'Finish'}</button>
        </div>
      </>}
    </div>
  )
}

const hStyle: React.CSSProperties = { fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 6 }
const subStyle: React.CSSProperties = { fontSize: 13, color: 'var(--color-gray-600)', marginBottom: 20, lineHeight: 1.5 }
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: 'var(--color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }
const inputStyle: React.CSSProperties = { padding: '13px 16px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font)', fontSize: 14, outline: 'none', width: '100%' }
const btnStyle: React.CSSProperties = { padding: '15px', borderRadius: 'var(--radius-full)', fontSize: 15, fontWeight: 500, cursor: 'pointer', border: 'none' }
const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: '7px 14px', borderRadius: 'var(--radius-full)',
  border: `1px solid ${active ? 'var(--color-teal)' : 'var(--color-gray-200)'}`,
  background: active ? 'var(--color-teal-dim)' : 'white',
  color: active ? 'var(--color-teal)' : 'var(--color-gray-600)',
  fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
})
