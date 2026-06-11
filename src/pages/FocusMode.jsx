import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function FocusMode() {
  const { setFocusMode } = useTheme();
  const [seconds, setSeconds] = useState(1500); // 25 min default
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTimer = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        zIndex: 10005,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        fontFamily: 'var(--font-sans)',
        animation: 'fade-in 0.4s ease'
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>Focus Session</span>
        <h1 style={{ fontSize: '84px', fontWeight: '200', letterSpacing: '-2px', fontFamily: 'var(--font-mono)' }}>{formatTimer()}</h1>
        
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          "Focus is a matter of deciding what things you're not going to do."
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button 
            className="glass" 
            onClick={() => setIsActive(!isActive)}
            style={{
              padding: '10px 24px',
              borderRadius: '20px',
              border: 'none',
              background: isActive ? '#ff3b30' : 'var(--accent-color)',
              color: '#ffffff',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isActive ? 'Pause Session' : 'Start Focus'}
          </button>
          <button 
            className="glass"
            onClick={() => { setIsActive(false); setSeconds(1500); }}
            style={{
              padding: '10px 24px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>

        <button 
          onClick={() => setFocusMode(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '11px',
            marginTop: '48px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Exit Focus Workspace
        </button>
      </div>
    </div>
  );
}
