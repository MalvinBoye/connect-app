import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/messages', label: 'Messages',
    icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 5h12a1 1 0 011 1v8a1 1 0 01-1 1H6.5l-3.5 2.5V6a1 1 0 011-1z" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2" fill={a ? 'var(--sage-dim)' : 'none'}/></svg> },
  { path: '/profile', label: 'Partners',
    icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="8" r="3" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2"/><path d="M4 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { path: '/date-ideas', label: 'Date Ideas',
    icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5l1.8 3.7 4.1.6-3 2.9.7 4.1L10 11.8l-3.6 1.9.7-4.1-3-2.9 4.1-.6z" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} fill={a ? 'var(--sage-dim)' : 'none'} strokeWidth="1.2" strokeLinejoin="round"/></svg> },
  { path: '/connections', label: 'Connections',
    icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="6.5" cy="8" r="2.5" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2"/><circle cx="13.5" cy="8" r="2.5" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2"/><path d="M2 17c0-2.5 2-4.5 4.5-4.5M18 17c0-2.5-2-4.5-4.5-4.5M10 12.5c-2.2 0-4 1.8-4 4M10 12.5c2.2 0 4 1.8 4 4" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { path: '/my-profile', label: 'Me',
    icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7.5" r="3" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2"/><path d="M3.5 18c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke={a ? 'var(--sage)' : 'var(--brown-light)'} strokeWidth="1.2" strokeLinecap="round"/></svg> },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/profile') return ['/profile','/reflection-accept','/reflection-pass','/completion','/matched'].includes(location.pathname)
    if (path === '/messages') return location.pathname === '/messages'
    return location.pathname === path
  }

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const active = isActive(tab.path)
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 6px', flex: 1 }}>
            {tab.icon(active)}
            <span style={{ fontSize: 8, fontWeight: active ? 700 : 400, color: active ? 'var(--sage)' : 'var(--brown-light)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center' }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
