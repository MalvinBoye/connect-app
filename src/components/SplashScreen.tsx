import React, { useEffect, useState } from 'react'

interface SplashScreenProps {
  onDone: () => void
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<'c' | 'drop' | 'click' | 'done'>('c')

  useEffect(() => {
    // C appears
    const t1 = setTimeout(() => setPhase('drop'), 600)   
    const t2 = setTimeout(() => setPhase('click'), 1300) 
    const t3 = setTimeout(() => setPhase('done'), 2200) 
    const t4 = setTimeout(() => onDone(), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#C8C9A3',
      opacity: phase === 'done' ? 0 : 1,
      transition: phase === 'done' ? 'opacity 0.6s ease' : 'none',
      overflow: 'hidden',
    }}>

      {/* Dappled shadow texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          radial-gradient(ellipse 120px 80px at 15% 20%, rgba(90,85,50,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 80px 120px at 75% 15%, rgba(90,85,50,0.09) 0%, transparent 70%),
          radial-gradient(ellipse 140px 60px at 60% 70%, rgba(90,85,50,0.11) 0%, transparent 70%),
          radial-gradient(ellipse 60px 140px at 25% 75%, rgba(90,85,50,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 100px 100px at 85% 55%, rgba(90,85,50,0.10) 0%, transparent 70%),
          radial-gradient(ellipse 90px 70px at 40% 40%, rgba(200,210,160,0.3) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Leaf branch SVG texture */}
      <svg
        style={{ position: 'absolute', top: 0, right: 0, width: '65%', opacity: 0.18, pointerEvents: 'none' }}
        viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M380 20 Q320 80 280 160 Q240 240 200 280 Q160 320 120 380 Q80 440 40 480" stroke="#4A4020" strokeWidth="1.5" fill="none"/>
        <path d="M280 160 Q320 140 350 100" stroke="#4A4020" strokeWidth="1" fill="none"/>
        <path d="M280 160 Q260 180 240 160 Q260 155 280 160Z" fill="#4A4020" opacity="0.6"/>
        <path d="M240 240 Q280 220 300 190" stroke="#4A4020" strokeWidth="1" fill="none"/>
        <path d="M240 240 Q215 258 200 240 Q220 235 240 240Z" fill="#4A4020" opacity="0.5"/>
        <path d="M200 280 Q240 265 255 235" stroke="#4A4020" strokeWidth="1" fill="none"/>
        <path d="M200 280 Q178 295 162 278 Q182 274 200 280Z" fill="#4A4020" opacity="0.55"/>
        <path d="M160 320 Q200 302 218 275" stroke="#4A4020" strokeWidth="1" fill="none"/>
        <path d="M160 320 Q138 336 122 318 Q142 314 160 320Z" fill="#4A4020" opacity="0.5"/>
        <path d="M120 380 Q158 360 175 330" stroke="#4A4020" strokeWidth="1" fill="none"/>
        <path d="M120 380 Q98 394 82 376 Q102 372 120 380Z" fill="#4A4020" opacity="0.45"/>
      </svg>

      {/* Wanted to add some flare to the design */}
      <div style={{
        position: 'absolute', top: 32, left: 28,
        display: 'flex', flexDirection: 'column', gap: 2,
        opacity: 0.55,
      }}>
        {[['キ', 'Cir'], ['ル', 'ceé'], ['ケ', '']].map(([jp, en], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#3A3010', fontFamily: 'serif' }}>{jp}</span>
            {en && <span style={{ fontSize: 9, color: '#3A3010', fontFamily: 'Courier New', letterSpacing: '0.05em' }}>{en}</span>}
          </div>
        ))}
      </div>

      {/* wordmark */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        position: 'relative', height: 120,
      }}>
        {/* C */}
        <span style={{
          fontSize: 96,
          fontFamily: '"Courier Prime", "Courier New", monospace',
          fontWeight: 400,
          color: '#3A3010',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: phase === 'click' || phase === 'done' ? 'translateX(0)' : 'translateX(0)',
        }}>
          C
        </span>

        {/* onnect — drops from above */}
        <div style={{
          overflow: 'hidden',
          height: 72,
          display: 'flex', alignItems: 'flex-end',
          marginBottom: 4,
        }}>
          <span style={{
            fontSize: 56,
            fontFamily: '"Courier Prime", "Courier New", monospace',
            fontWeight: 400,
            color: '#3A3010',
            letterSpacing: '-0.01em',
            transform: phase === 'c'
              ? 'translateY(-80px)'
              : phase === 'drop'
              ? 'translateY(8px)'
              : 'translateY(0)',
            transition: phase === 'drop'
              ? 'transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1)'
              : phase === 'click'
              ? 'transform 0.12s cubic-bezier(0.36, 0.07, 0.19, 0.97)'
              : 'none',
            display: 'block',
          }}>
            onnect
          </span>
        </div>
      </div>

      {/* Tagline — fades in after click */}
      <div style={{
        marginTop: 24,
        opacity: phase === 'click' || phase === 'done' ? 1 : 0,
        transition: 'opacity 0.4s ease 0.1s',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 11,
          color: '#3A3010',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: '"Courier Prime", "Courier New", monospace',
          opacity: 0.6,
        }}>
          intentional connection
        </p>
      </div>
    </div>
  )
}
