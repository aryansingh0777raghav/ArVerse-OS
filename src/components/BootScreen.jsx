import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function BootScreen() {
  const { setIsBooting } = useTheme();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing kernel...');

  useEffect(() => {
    const texts = [
      'Initializing kernel...',
      'Securing sandbox memory...',
      'Checking local app ports (5173, 5174, 8000)...',
      'Mounting Memory Vault database...',
      'Opening ArKon communications channel...',
      'Preparing desktop session...'
    ];

    let textIdx = 0;
    const textInterval = setInterval(() => {
      textIdx = (textIdx + 1) % texts.length;
      setLoadingText(texts[textIdx]);
    }, 700);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(() => {
            setIsBooting(false);
          }, 600); // smooth fade transition
          return 100;
        }
        // Accelerate or decelerate progress for realistic loading
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + step);
      });
    }, 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [setIsBooting]);

  return (
    <div className="boot-screen" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      fontFamily: 'var(--font-sans)',
      transition: 'opacity 0.6s ease'
    }}>
      {/* Premium Orbiting SVG Glyph */}
      <div className="logo-container animate-float" style={{ marginBottom: '40px', position: 'relative' }}>
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
          <circle cx="50" cy="50" r="32" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" strokeDasharray="5 5" />
          <path d="M50 6C25.7 6 6 25.7 6 50C6 74.3 25.7 94 50 94C74.3 94 94 74.3 94 50" stroke="url(#logo-grad)" strokeWidth="4" strokeLinecap="round" />
          <image href="/favicon.svg" x="32" y="32" height="36" width="36" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' }} />
          <defs>
            <linearGradient id="logo-grad" x1="6" y1="6" x2="94" y2="94" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2997ff" />
              <stop offset="0.5" stopColor="#ffffff" />
              <stop offset="1" stopColor="#86868b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* OS Title */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: '300',
        letterSpacing: '5px',
        marginBottom: '48px',
        color: '#f5f5f7'
      }}>
        ARVERSE OS
      </h1>

      {/* Progress Container */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#ffffff',
            borderRadius: '2px',
            transition: 'width 0.2s ease',
            boxShadow: '0 0 8px rgba(255,255,255,0.5)'
          }} />
        </div>
        <span style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#86868b',
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}>
          {loadingText} ({progress}%)
        </span>
      </div>
    </div>
  );
}
