import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const intentionLabels: Record<string, string> = {
  relationship: 'Long-term relationship',
  dating: 'Dating & seeing where it goes',
  connection: 'Meaningful connection',
  friendship: 'Friendship first',
}

const readinessLabels = ['Just started thinking', 'Warming up', 'Open and ready', 'Actively looking', 'Very ready']

const intentions = [
  { id: 'relationship', label: 'Long-term relationship' },
  { id: 'dating', label: 'Dating & seeing where it goes' },
  { id: 'connection', label: 'Meaningful connection' },
  { id: 'friendship', label: 'Friendship first' },
]

export default function MyProfileScreen() {
  const { profile, refreshProfile, signOut, user } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Edit state
  const [name, setName] = useState(profile?.name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [intention, setIntention] = useState(profile?.intention ?? '')
  const [readiness, setReadiness] = useState<number>((profile as any)?.relationship_readiness ?? 3)
  const [ageMin, setAgeMin] = useState<string>(String((profile as any)?.age_min ?? 18))
  const [ageMax, setAgeMax] = useState<string>(String((profile as any)?.age_max ?? 45))
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  if (!profile) return null

  const startEdit = () => {
    setName(profile.name)
    setBio(profile.bio ?? '')
    setIntention(profile.intention)
    setReadiness((profile as any).relationship_readiness ?? 3)
    setAgeMin(String((profile as any).age_min ?? 18))
    setAgeMax(String((profile as any).age_max ?? 45))
    setAvatarPreview(null)
    setAvatarFile(null)
    setEditing(true)
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const save = async () => {
    setSaving(true)
    setError(null)

    let avatar_url = profile.avatar_url

    if (avatarFile && user) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars').upload(path, avatarFile, { upsert: true })
      if (uploadError) { setError('Photo upload failed.'); setSaving(false); return }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        bio: bio.trim() || null,
        intention,
        relationship_readiness: readiness,
        age_min: parseInt(ageMin),
        age_max: parseInt(ageMax),
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (updateError) { setError(updateError.message); setSaving(false); return }
    await refreshProfile()
    setSaving(false)
    setEditing(false)
  }

  const handleDeleteAccount = async () => {
    // Sign out — actual deletion would require a server function
    await signOut()
  }

  // ── SETTINGS VIEW ──────────────────────────────────────────────────────────
  if (showSettings) {
    return (
      <div className="screen" style={{ padding: '0 0 24px' }}>
        <div style={headerStyle}>
          <button onClick={() => setShowSettings(false)} style={{ color: 'var(--color-gray-600)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 14 }}>Back</span>
          </button>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Settings</span>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ padding: '16px' }}>
          {/* Account */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Account</div>
            <SettingRow label="Email" value={user?.email ?? ''} />
            <SettingRow label="Member since" value={new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
          </div>

          {/* Subscription */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Subscription</div>
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Connect — $12/month</div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                Flat rate. No tiers, no upsells, no ads. All features included for everyone.
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Privacy & Data</div>
            <SettingRow label="Data sold to advertisers" value="Never" highlight />
            <SettingRow label="Used for AI training" value="Never without consent" highlight />
            <SettingRow label="Profile visible to" value="Authenticated users only" />
            <button style={{ marginTop: 12, width: '100%', padding: '11px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--color-gray-600)', background: 'none', cursor: 'pointer' }}>
              Download my data
            </button>
          </div>

          {/* Notifications */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>About</div>
            <SettingRow label="Version" value="1.0.0" />
            <button onClick={() => navigate('/transparency')} style={{ marginTop: 8, width: '100%', padding: '11px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--color-teal)', fontWeight: 500, background: 'none', cursor: 'pointer', textAlign: 'left' }}>
              View transparency dashboard →
            </button>
          </div>

          {/* Sign out */}
          <button
            onClick={signOut}
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-gray-200)', fontSize: 14, fontWeight: 500, color: 'var(--color-black)', background: 'none', cursor: 'pointer', marginBottom: 12 }}
          >
            Sign out
          </button>

          {/* Delete account */}
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-full)', border: '1px solid #ffcccc', fontSize: 14, fontWeight: 500, color: '#cc0000', background: 'none', cursor: 'pointer' }}>
              Delete account
            </button>
          ) : (
            <div style={{ padding: '16px', border: '1px solid #ffcccc', borderRadius: 'var(--radius-md)', background: '#fff8f8' }}>
              <p style={{ fontSize: 13, color: '#cc0000', marginBottom: 12, lineHeight: 1.5 }}>
                This will permanently delete your profile, matches, and messages. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '11px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-gray-200)', fontSize: 13, cursor: 'pointer', background: 'white' }}>Cancel</button>
                <button onClick={handleDeleteAccount} style={{ flex: 1, padding: '11px', borderRadius: 'var(--radius-full)', background: '#cc0000', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── EDIT VIEW ──────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="screen" style={{ padding: '0 0 24px' }}>
        <div style={headerStyle}>
          <button onClick={() => setEditing(false)} style={{ color: 'var(--color-gray-600)', fontSize: 14 }}>Cancel</button>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Edit Profile</span>
          <button onClick={save} disabled={saving} style={{ color: 'var(--color-teal)', fontSize: 14, fontWeight: 600 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ cursor: 'pointer' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: (avatarPreview || profile.avatar_url) ? `url(${avatarPreview ?? profile.avatar_url}) center/cover` : 'var(--color-teal-dim)', border: '2px dashed var(--color-teal)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                {!avatarPreview && !profile.avatar_url && profile.name[0]}
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </label>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-teal)', marginTop: 2 }}>Tap to change photo</div>
            </div>
          </div>

          <Field label="Name">
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </Field>

          <Field label="Bio">
            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300} rows={4} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
            <div style={{ fontSize: 11, color: 'var(--color-gray-400)', textAlign: 'right', marginTop: 4 }}>{bio.length}/300</div>
          </Field>

          <Field label="Looking for">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {intentions.map(opt => (
                <button key={opt.id} onClick={() => setIntention(opt.id)} style={{ padding: '12px 14px', border: `1px solid ${intention === opt.id ? 'var(--color-teal)' : 'var(--color-gray-200)'}`, borderRadius: 'var(--radius-md)', background: intention === opt.id ? 'var(--color-teal-dim)' : 'white', color: intention === opt.id ? 'var(--color-teal)' : 'var(--color-black)', fontSize: 13, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Age range you're open to">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
              <input type="number" min="18" max="99" value={ageMin} onChange={e => setAgeMin(e.target.value)} style={{ ...inputStyle, width: 80, textAlign: 'center' }} />
              <span style={{ color: 'var(--color-gray-400)', fontSize: 13 }}>to</span>
              <input type="number" min="18" max="99" value={ageMax} onChange={e => setAgeMax(e.target.value)} style={{ ...inputStyle, width: 80, textAlign: 'center' }} />
            </div>
          </Field>

          <Field label={`Relationship readiness — ${readinessLabels[readiness - 1]}`}>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setReadiness(n)} style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: `1px solid ${readiness === n ? 'var(--color-teal)' : 'var(--color-gray-200)'}`, background: readiness === n ? 'var(--color-teal)' : 'white', color: readiness === n ? 'white' : 'var(--color-gray-600)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{n}</button>
              ))}
            </div>
          </Field>

          {error && <div style={{ padding: '10px 14px', background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#cc0000' }}>{error}</div>}
        </div>
      </div>
    )
  }

  // ── PROFILE VIEW ───────────────────────────────────────────────────────────
  return (
    <div className="screen">
      <div style={headerStyle}>
        <div style={{ width: 60 }} />
        <span style={{ fontSize: 16, fontWeight: 600 }}>My Profile</span>
        <button onClick={() => setShowSettings(true)} style={{ color: 'var(--color-gray-600)', width: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.2" fill="currentColor"/>
            <circle cx="10" cy="10" r="1.2" fill="currentColor"/>
            <circle cx="10" cy="16" r="1.2" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative' }}>
        <div style={{ height: 240, background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'linear-gradient(160deg, #e8f0ef, #d0e4e3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!profile.avatar_url && <div style={{ fontSize: 72, fontWeight: 700, color: 'var(--color-teal)', opacity: 0.3 }}>{profile.name[0]}</div>}
        </div>
        <button onClick={startEdit} style={{ position: 'absolute', bottom: 12, right: 12, padding: '8px 16px', background: 'white', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 500, color: 'var(--color-black)', boxShadow: 'var(--shadow-md)', cursor: 'pointer' }}>
          Edit profile
        </button>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Name & age */}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.4px' }}>{profile.name}, {profile.age}</h2>
          {profile.location && <p style={{ fontSize: 13, color: 'var(--color-gray-400)', marginTop: 2 }}>{profile.location}</p>}
        </div>

        {/* Intention badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--color-teal-dim)', borderRadius: 'var(--radius-full)', alignSelf: 'flex-start' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)' }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-teal)' }}>{intentionLabels[profile.intention]}</span>
        </div>

        {/* Bio */}
        {profile.bio ? (
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-gray-800)' }}>{profile.bio}</p>
        ) : (
          <button onClick={startEdit} style={{ padding: '12px 14px', border: '1px dashed var(--color-gray-200)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--color-gray-400)', textAlign: 'left', cursor: 'pointer', background: 'none' }}>
            + Add a bio — people with bios get more connections
          </button>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 1, border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {[
            { label: 'Readiness', value: `${(profile as any).relationship_readiness ?? 3}/5` },
            { label: 'Age range', value: `${(profile as any).age_min ?? 18}–${(profile as any).age_max ?? 45}` },
            { label: 'Joined', value: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 8px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--color-gray-200)' : 'none' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-teal)' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'var(--color-gray-400)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Profile completeness */}
        <ProfileCompleteness profile={profile} onEdit={startEdit} />

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={startEdit} style={{ padding: '14px', borderRadius: 'var(--radius-full)', background: 'var(--color-black)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            Edit profile
          </button>
          <button onClick={() => setShowSettings(true)} style={{ padding: '14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-gray-200)', fontSize: 14, fontWeight: 500, color: 'var(--color-gray-600)', cursor: 'pointer', background: 'none' }}>
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileCompleteness({ profile, onEdit }: { profile: any, onEdit: () => void }) {
  const checks = [
    { label: 'Photo', done: !!profile.avatar_url },
    { label: 'Bio', done: !!(profile.bio && profile.bio.length > 20) },
    { label: 'Intention', done: !!profile.intention },
    { label: 'Readiness set', done: !!profile.relationship_readiness },
  ]
  const score = checks.filter(c => c.done).length
  const pct = Math.round((score / checks.length) * 100)
  if (pct === 100) return null

  return (
    <div style={{ padding: '14px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Profile {pct}% complete</span>
        <span style={{ fontSize: 12, color: 'var(--color-teal)', fontWeight: 500 }}>{score}/{checks.length}</span>
      </div>
      <div style={{ height: 4, background: 'var(--color-gray-200)', borderRadius: 2, marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-teal)', borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: c.done ? '#e8f5ed' : 'var(--color-gray-100)', borderRadius: 'var(--radius-full)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.done ? '#2C7A4B' : 'var(--color-gray-400)' }} />
            <span style={{ fontSize: 11, color: c.done ? '#2C7A4B' : 'var(--color-gray-600)' }}>{c.label}</span>
          </div>
        ))}
      </div>
      <button onClick={onEdit} style={{ fontSize: 12, color: 'var(--color-teal)', fontWeight: 500, background: 'none', cursor: 'pointer' }}>
        Complete your profile →
      </button>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}

function SettingRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
      <span style={{ fontSize: 13, color: 'var(--color-gray-600)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: highlight ? 'var(--color-teal)' : 'var(--color-black)' }}>{value}</span>
    </div>
  )
}

const headerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 16px',
  borderBottom: '1px solid var(--color-gray-200)',
  background: 'white',
  position: 'sticky', top: 0, zIndex: 10,
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 20,
  padding: '14px',
  border: '1px solid var(--color-gray-200)',
  borderRadius: 'var(--radius-md)',
}

const sectionTitle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--color-gray-400)',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  border: '1px solid var(--color-gray-200)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font)', fontSize: 14,
  outline: 'none', background: 'white',
}
