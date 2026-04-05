import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  {
    path: '/messages',
    label: 'Messages',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 5h14a1 1 0 011 1v9a1 1 0 01-1 1H7l-4 3V6a1 1 0 011-1z"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          fill={active ? 'var(--color-teal-dim)' : 'none'}
          strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    path: '/profile',
    label: 'Potential Partners',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="9" r="3.5"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5"/>
        <path d="M5 19c0-3.314 2.686-6 6-6s6 2.686 6 6"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    path: '/date-ideas',
    label: 'Date Ideas',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3l2.09 4.26L18 8.27l-3.5 3.41.83 4.82L11 14.27l-4.33 2.23.83-4.82L4 8.27l4.91-.71L11 3z"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          fill={active ? 'var(--color-teal-dim)' : 'none'}
          strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    path: '/connections',
    label: 'Connections',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="7" cy="9" r="2.5"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5"/>
        <circle cx="15" cy="9" r="2.5"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5"/>
        <path d="M2 19c0-2.761 2.239-5 5-5"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 19c0-2.761-2.239-5-5-5"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 14c-2.209 0-4 1.791-4 4"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 14c2.209 0 4 1.791 4 4"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    path: '/my-profile',
    label: 'Me',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5"/>
        <path d="M4 19c0-3.866 3.134-7 7-7s7 3.134 7 7"
          stroke={active ? 'var(--color-teal)' : 'var(--color-gray-400)'}
          strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/profile') return ['/profile', '/reflection-accept', '/reflection-pass', '/completion', '/matched', '/profile-detail'].includes(location.pathname)
    if (path === '/connections') return location.pathname === '/connections'
    if (path === '/messages') return location.pathname === '/messages' || location.pathname === '/conversation'
    return location.pathname === path
  }

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const active = isActive(tab.path)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 8px', background: 'none', flex: 1 }}
          >
            {tab.icon(active)}
            <span style={{
              fontSize: 9, fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-teal)' : 'var(--color-gray-400)',
              letterSpacing: '0.01em', textAlign: 'center', lineHeight: 1.2,
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
