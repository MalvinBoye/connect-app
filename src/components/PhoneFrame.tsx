import React from 'react'

interface PhoneFrameProps {
  children: React.ReactNode
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: 'var(--color-white)',
      borderRadius: 50,
      boxShadow: '0 0 0 10px #1a1a1a, 0 0 0 12px #333, var(--shadow-lg)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Status bar */}
      <div style={{
        height: 44,
        background: 'var(--color-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.2px' }}>9:41</span>
        <div style={{
          width: 120,
          height: 30,
          background: '#1a1a1a',
          borderRadius: 20,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 8,
        }} />
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="4" width="3" height="8" rx="0.5" fill="#000" />
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" fill="#000" />
            <rect x="9" y="0.5" width="3" height="11.5" rx="0.5" fill="#000" />
            <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="#000" opacity="0.3"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 2.5C10.2 2.5 12.2 3.4 13.6 4.9L15 3.5C13.2 1.6 10.7 0.5 8 0.5C5.3 0.5 2.8 1.6 1 3.5L2.4 4.9C3.8 3.4 5.8 2.5 8 2.5Z" fill="#000"/>
            <path d="M8 5.5C9.5 5.5 10.9 6.1 11.9 7.1L13.3 5.7C11.9 4.3 10 3.5 8 3.5C6 3.5 4.1 4.3 2.7 5.7L4.1 7.1C5.1 6.1 6.5 5.5 8 5.5Z" fill="#000"/>
            <circle cx="8" cy="10" r="1.5" fill="#000"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#000" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="17" height="8" rx="2" fill="#000"/>
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="#000" opacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Home indicator */}
      <div style={{
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-white)',
        flexShrink: 0,
      }}>
        <div style={{ width: 134, height: 5, background: '#000', borderRadius: 3, opacity: 0.2 }} />
      </div>
    </div>
  )
}
