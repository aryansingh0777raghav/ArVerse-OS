import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function AppSwitcher({ isOpen, onClose }) {
  const { openWindows, focusWindow } = useAppState();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // List of items available to cycle (only active open windows)
  const switchableApps = openWindows;

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || switchableApps.length === 0) return;

    const handleKeyDown = (e) => {
      // If user presses Tab or arrow keys
      if (e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % switchableApps.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + switchableApps.length) % switchableApps.length);
      } else if (e.key === 'Enter') {
        // Confirm selection
        confirmSwitch();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    // If they release the Alt key (in the case of Alt+Tab or Alt+Q)
    const handleKeyUp = (e) => {
      if (e.key === 'Alt') {
        confirmSwitch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, selectedIndex, switchableApps]);

  const confirmSwitch = () => {
    if (switchableApps.length > 0) {
      const selectedApp = switchableApps[selectedIndex];
      focusWindow(selectedApp.id);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'var(--font-sans)',
        color: '#ffffff'
      }}
      onClick={onClose}
    >
      <div style={{ marginBottom: '24px', opacity: 0.8, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Press <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Tab</span> or <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Arrows</span> to cycle. Release <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Alt</span> to select.
      </div>

      {switchableApps.length === 0 ? (
        <div className="glass" style={{ padding: '24px 48px', fontSize: '14px', textAlign: 'center', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
          No application windows are currently open.
        </div>
      ) : (
        <div 
          style={{
            display: 'flex',
            gap: '16px',
            padding: '20px',
            maxWidth: '90vw',
            overflowX: 'auto',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {switchableApps.map((app, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div 
                key={app.id}
                onClick={() => { setSelectedIndex(idx); setTimeout(confirmSwitch, 50); }}
                className="glass"
                style={{
                  width: '140px',
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)',
                  background: isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.35)',
                  boxShadow: isSelected ? '0 10px 30px rgba(0, 113, 227, 0.4)' : 'var(--shadow-md)',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Simulated Icon circle matching Dock colors */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: getAppGradient(app.id),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ffffff'
                }}>
                  {getAppIcon(app.id)}
                </div>
                
                <span style={{ fontSize: '12px', fontWeight: '600', textAlign: 'center', color: '#ffffff' }}>
                  {app.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helpers for Switcher
const getAppGradient = (id) => {
  switch (id) {
    case 'arkon': return 'linear-gradient(135deg, #2563eb, #3b82f6)';
    case 'arlip': return 'linear-gradient(135deg, #ea580c, #f97316)';
    case 'arft': return 'linear-gradient(135deg, #059669, #10b981)';
    case 'arch': return 'linear-gradient(135deg, #0284c7, #06b6d4)';
    case 'memory-vault': return 'linear-gradient(135deg, #6366f1, #818cf8)';
    case 'film-studio': return 'linear-gradient(135deg, #db2777, #ec4899)';
    case 'files-hub': return 'linear-gradient(135deg, #ca8a04, #eab308)';
    default: return 'linear-gradient(135deg, #4b5563, #6b7280)';
  }
};

const getAppIcon = (id) => {
  switch (id) {
    case 'arkon':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v12M6 12h12" />
        </svg>
      );
    case 'arlip':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      );
    case 'arft':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M21 9H3M21 15H3M12 3v18" />
        </svg>
      );
    case 'arch':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'memory-vault':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        </svg>
      );
    case 'film-studio':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        </svg>
      );
    case 'files-hub':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" />
        </svg>
      );
  }
};
