import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  {
    path: '/profile',
    label: 'Discover',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'} strokeWidth="1.5"/>
        <path d="M7 11.5C7 11.5 8.5 14 11 14C13.5 14 15 11.5 15 11.5" stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8.5" cy="9.5" r="1" fill={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}/>
        <circle cx="13.5" cy="9.5" r="1" fill={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}/>
      </svg>
    )
  },
  {
    path: '/messages',
    label: 'Connections',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 5h14a1 1 0 011 1v9a1 1 0 01-1 1H7l-4 3V6a1 1 0 011-1z" stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'} strokeWidth="1.5" fill="none"/>
      </svg>
    )
  },
  {
    path: '/my-profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5" stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'} strokeWidth="1.5"/>
        <path d="M4 19c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/profile') return location.pathname === '/profile' || location.pathname === '/reflection-accept' || location.pathname === '/reflection-pass' || location.pathname === '/completion' || location.pathname === '/matched'
    return location.pathname === path || location.pathname.startsWith(path)
  }

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const active = isActive(tab.path)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3,
              padding: '6px 20px',
              background: 'none',
            }}
          >
            {tab.icon(active)}
            <span style={{
              fontSize: 10, fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-teal)' : 'var(--color-gray-400)',
              letterSpacing: '0.02em',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
