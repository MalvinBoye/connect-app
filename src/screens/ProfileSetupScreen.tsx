import React, { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const intentions = [
  { id: 'relationship', label: 'Long-term Relationship' },
  { id: 'dating', label: 'Dating & seeing where it goes' },
  { id: 'connection', label: 'Meaningful Connection' },
  { id: 'friendship', label: 'Friendship first' },
]
const genderOptions = ['Man', 'Woman', 'Non-binary', 'Other', 'Prefer not to say']
const lookingForOptions = ['Men', 'Women', 'Non-binary people', 'Everyone']
const readinessLabels = ['Just started thinking', 'Warming up', 'Open and ready', 'Actively looking', 'Very ready']

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
    const file = e.target.files?.[0]; if (!file) return
    setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file))
  }

  const submit = async () => {
    if (!user) return
    setLoading(true); setError(null)
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
      id: user.id, name: name.trim(), age: parseInt(age), bio: bio.trim() || null,
      intention, gender, looking_for: lookingFor,
      age_min: parseInt(ageMin), age_max: parseInt(ageMax),
      relationship_readiness: readiness, avatar_url,
    })
    if (profileError) { setError(profileError.message); setLoading(false); return }
    await refreshProfile(); setLoading(false)
  }

  const steps = ['About you', 'Preferences', 'Intention', 'Bio']

  return (
    <div className="screen" style={{ padding: '0 0 32px' }}>
      {/* Progress */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i < step ? 'var(--sage)' : 'var(--brown-border)', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--sage)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {steps[step - 1]}
        </div>
      </div>

      <div style={{ padding: '24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* STEP 1 */}
        {step === 1 && <>
          <h2 style={hStyle}>Tell us about yourself.</h2>
          <p style={subStyle}>This is what others will see.</p>

          <label style={{ cursor: 'pointer', marginBottom: 24, alignSelf: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '1px dashed var(--sage)', background: avatarPreview ? 'transparent' : 'var(--sage-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: 24, color: 'var(--sage)' }}>
              {avatarPreview ? <img src={avatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '+'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--sage)', marginTop: 4, letterSpacing: '0.08em' }}>Add photo</div>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="field-input" />
            <input placeholder="Age" type="number" min="18" max="99" value={age} onChange={e => setAge(e.target.value)} className="field-input" style={{ width: 100 }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={labelStyle}>I am a —</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {genderOptions.map(g => <Chip key={g} label={g} active={gender === g} onClick={() => setGender(g)} />)}
            </div>
          </div>

          <div style={{ marginBottom: 'auto' }}>
            <div style={labelStyle}>Looking for —</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {lookingForOptions.map(g => <Chip key={g} label={g} active={lookingFor === g} onClick={() => setLookingFor(g)} />)}
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!name || !age || parseInt(age) < 18} className="btn-primary" style={{ width: '100%', marginTop: 24 }}>Continue</button>
        </>}

        {/* STEP 2 */}
        {step === 2 && <>
          <h2 style={hStyle}>Your preferences.</h2>
          <p style={subStyle}>These filter who appears in your list.</p>

          <div style={{ marginBottom: 28 }}>
            <div style={labelStyle}>Age range</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <input type="number" min="18" max="99" value={ageMin} onChange={e => setAgeMin(e.target.value)} className="field-input" style={{ width: 80, textAlign: 'center' }} />
              <span style={{ fontSize: 12, color: 'var(--brown-light)' }}>to</span>
              <input type="number" min="18" max="99" value={ageMax} onChange={e => setAgeMax(e.target.value)} className="field-input" style={{ width: 80, textAlign: 'center' }} />
            </div>
          </div>

          <div style={{ marginBottom: 'auto' }}>
            <div style={labelStyle}>Relationship readiness</div>
            <p style={{ fontSize: 11, color: 'var(--sage)', marginBottom: 14, marginTop: 6, letterSpacing: '0.04em' }}>
              {readinessLabels[readiness - 1]}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setReadiness(n)} style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-full)', border: `1px solid ${readiness === n ? 'var(--sage)' : 'var(--brown-border)'}`, background: readiness === n ? 'var(--sage)' : 'transparent', color: readiness === n ? 'var(--cream)' : 'var(--brown-light)', fontSize: 12, fontFamily: 'var(--font)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 9, color: 'var(--sage)', letterSpacing: '0.06em' }}>THINKING</span>
              <span style={{ fontSize: 9, color: 'var(--sage)', letterSpacing: '0.06em' }}>VERY READY</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 0.4 }}>Back</button>
            <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 1 }}>Continue</button>
          </div>
        </>}

        {/* STEP 3 */}
        {step === 3 && <>
          <h2 style={hStyle}>What are you looking for?</h2>
          <p style={subStyle}>You'll only see people who want the same thing.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'auto' }}>
            {intentions.map(opt => (
              <button key={opt.id} onClick={() => setIntention(opt.id)} style={{ padding: '14px 18px', border: `1px solid ${intention === opt.id ? 'var(--sage)' : 'var(--brown-border)'}`, borderRadius: 'var(--radius-full)', background: intention === opt.id ? 'var(--sage-dim)' : 'transparent', color: intention === opt.id ? 'var(--sage)' : 'var(--brown)', fontSize: 13, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font)' }}>
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 0.4 }}>Back</button>
            <button onClick={() => setStep(4)} disabled={!intention} className="btn-primary" style={{ flex: 1 }}>Continue</button>
          </div>
        </>}

        {/* STEP 4 */}
        {step === 4 && <>
          <h2 style={hStyle}>Tell people about yourself.</h2>
          <p style={subStyle}>Mention interests — the algorithm uses these to find complementary people.</p>

          <textarea placeholder="What do you care about? What are you into?..." value={bio} onChange={e => setBio(e.target.value)} maxLength={300} style={{ width: '100%', minHeight: 160, padding: '14px 16px', border: '1px solid var(--brown-border)', borderRadius: 'var(--radius-lg)', resize: 'none', fontFamily: 'var(--font)', fontSize: 13, background: 'var(--cream)', color: 'var(--brown)', outline: 'none', lineHeight: 1.7, marginBottom: 6 }} />
          <div style={{ fontSize: 10, color: 'var(--sage)', textAlign: 'right', marginBottom: 12, letterSpacing: '0.04em' }}>{bio.length}/300</div>

          <div style={{ padding: '10px 14px', background: 'var(--sage-dim)', borderRadius: 'var(--radius-md)', marginBottom: 'auto' }}>
            <p style={{ fontSize: 11, color: 'var(--sage)', lineHeight: 1.6 }}>
              Tip: The more specific you are — hiking, learning Japanese, cooking — the better your matches.
            </p>
          </div>

          {error && <div style={{ padding: '10px 14px', border: '1px solid rgba(180,60,60,0.3)', borderRadius: 'var(--radius-md)', fontSize: 12, color: '#8B2020', marginTop: 12, background: 'rgba(180,60,60,0.06)' }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(3)} className="btn-secondary" style={{ flex: 0.4 }}>Back</button>
            <button onClick={submit} disabled={loading} className="btn-primary" style={{ flex: 1 }}>{loading ? '...' : 'Finish'}</button>
          </div>
        </>}
      </div>
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: `1px solid ${active ? 'var(--sage)' : 'var(--brown-border)'}`, background: active ? 'var(--sage-dim)' : 'transparent', color: active ? 'var(--sage)' : 'var(--brown-light)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s' }}>
      {label}
    </button>
  )
}

const hStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.2 }
const subStyle: React.CSSProperties = { fontSize: 12, color: 'var(--brown-light)', marginBottom: 24, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: '0.1em' }
