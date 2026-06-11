import React, { useState, useRef } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Dock() {
  const { openWindows, openWindow } = useAppState();
  const { theme, focusMode } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dockRef = useRef(null);

  const apps = [
    { 
      id: 'arkon', 
      name: 'ArKon App', 
      img: '/arkon.png'
    },
    { 
      id: 'arlip', 
      name: 'ArLip Creator', 
      img: '/arlip.png'
    },
    { 
      id: 'arft', 
      name: 'ArFt UI Builder', 
      img: '/arft.ico'
    },
    { 
      id: 'arch', 
      name: 'ArCh Search', 
      img: '/arch.png'
    },
    { 
      id: 'divider', 
      isDivider: true 
    },
    { 
      id: 'memory-vault', 
      name: 'Memory Vault', 
      color: 'linear-gradient(135deg, #6366f1, #818cf8)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      )
    },
    { 
      id: 'film-studio', 
      name: 'Film Studio', 
      color: 'linear-gradient(135deg, #db2777, #ec4899)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    },
    { 
      id: 'files-hub', 
      name: 'Files Hub', 
      color: 'linear-gradient(135deg, #ca8a04, #eab308)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    { 
      id: 'developer-console', 
      name: 'Dev Console', 
      color: 'linear-gradient(135deg, #4b5563, #6b7280)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      name: 'System Settings', 
      color: 'linear-gradient(135deg, #1e293b, #475569)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  const handleAppClick = (appId, name) => {
    openWindow(appId, name);
  };

  const isAppRunning = (appId) => {
    return openWindows.some(w => w.id === appId);
  };

  const getScale = (index) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.35;
    if (distance === 1) return 1.18;
    if (distance === 2) return 1.06;
    return 1;
  };

  if (focusMode) return null; // hide dock in focus mode

  return (
    <div 
      className="dock-wrapper"
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        pointerEvents: 'auto'
      }}
    >
      <div 
        ref={dockRef}
        className="glass"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '6px 14px',
          height: '68px',
          gap: '8px',
          borderRadius: '24px',
          background: theme === 'light' ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)',
          border: '1px solid var(--panel-border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {apps.map((app, idx) => {
          if (app.isDivider) {
            return (
              <div 
                key={`divider-${idx}`}
                style={{
                  width: '1px',
                  height: '40px',
                  backgroundColor: 'var(--panel-border)',
                  margin: '0 6px',
                  alignSelf: 'center'
                }}
              />
            );
          }

          const running = isAppRunning(app.id);
          const scale = getScale(idx);

          return (
            <div 
              key={app.id}
              className="dock-item-container"
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => handleAppClick(app.id, app.name)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                width: '44px',
                height: '56px',
                justifyContent: 'flex-end'
              }}
            >
              {/* App Name Tooltip */}
              {hoveredIndex === idx && (
                <div 
                  className="glass-solid"
                  style={{
                    position: 'absolute',
                    top: '-46px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    animation: 'tooltip-fade 0.15s ease'
                  }}
                >
                  {app.name}
                </div>
              )}

              {/* App Icon Box */}
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: app.img ? 'transparent' : app.color,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ffffff',
                  transform: `scale(${scale})`,
                  transformOrigin: 'bottom center',
                  transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {app.img ? (
                  <img 
                    src={app.img} 
                    alt={app.name} 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }} 
                  />
                ) : (
                  app.icon
                )}
              </div>

              {/* Running Indicator Dot */}
              <div style={{ height: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                {running && (
                  <div 
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-primary)',
                      boxShadow: '0 0 4px var(--text-primary)',
                      animation: 'pulse-dot 2s infinite ease-in-out'
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes tooltip-fade {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
