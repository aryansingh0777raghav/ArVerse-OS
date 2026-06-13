import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function Launchpad({ isOpen, onClose }) {
  const { openWindow } = useAppState();
  const [searchVal, setSearchVal] = useState('');

  if (!isOpen) return null;

  const launchpadApps = [
    { id: 'arkon', name: 'ArKon Assistant', category: 'Ecosystem', img: '/arkon.png', color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { id: 'arlip', name: 'ArLip Creator', category: 'Ecosystem', img: '/arlip.png', color: 'linear-gradient(135deg, #ec4899, #be185d)' },
    { id: 'arft', name: 'ArFt Builder', category: 'Ecosystem', img: '/arft.ico', color: 'linear-gradient(135deg, #10b981, #047857)' },
    { id: 'arch', name: 'ArCh Search', category: 'Ecosystem', img: '/arch.png', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },

    // Native OS Tools
    { id: 'memory-vault', name: 'Memory Vault', category: 'System Tools', icon: '🕸️', color: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    { id: 'film-studio', name: 'Film Studio', category: 'System Tools', icon: '📽️', color: 'linear-gradient(135deg, #db2777, #c2185b)' },
    { id: 'files-hub', name: 'Files Hub', category: 'System Tools', icon: '📂', color: 'linear-gradient(135deg, #ca8a04, #a16207)' },
    { id: 'developer-console', name: 'Dev Console', category: 'System Tools', icon: '💻', color: 'linear-gradient(135deg, #4b5563, #374151)' },
    { id: 'settings', name: 'System Settings', category: 'System Tools', icon: '⚙️', color: 'linear-gradient(135deg, #1e293b, #0f172a)' },

    // System Utilities
    { id: 'calculator', name: 'ArCalc', category: 'Utilities', icon: '🧮', color: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { id: 'system-monitor', name: 'ArMon', category: 'Utilities', icon: '📊', color: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { id: 'calendar-app', name: 'ArCal', category: 'Utilities', icon: '📅', color: 'linear-gradient(135deg, #84cc16, #65a30d)' },
    { id: 'system-cleaner', name: 'ArClean', category: 'Utilities', icon: '🗑️', color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { id: 'retro-terminal', name: 'ArTerm', category: 'Utilities', icon: '🐚', color: 'linear-gradient(135deg, #111827, #030712)' },
    { id: 'code-sandbox', name: 'ArPlay', category: 'Utilities', icon: '⚡', color: 'linear-gradient(135deg, #a855f7, #9333ea)' },
    { id: 'markdown-notepad', name: 'ArNote', category: 'Utilities', icon: '📝', color: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    { id: 'lofi-player', name: 'ArTune', category: 'Utilities', icon: '🎵', color: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { id: 'weather-app', name: 'ArCast', category: 'Utilities', icon: '🌤️', color: 'linear-gradient(135deg, #0284c7, #0369a1)' },
    { id: 'pixel-paint', name: 'ArDraw', category: 'Utilities', icon: '🎨', color: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
    { id: 'wallpapers-hub', name: 'ArWall', category: 'Utilities', icon: '📸', color: 'linear-gradient(135deg, #6b7280, #4b5563)' },
    { id: 'pomodoro-timer', name: 'ArFocus', category: 'Utilities', icon: '⏱️', color: 'linear-gradient(135deg, #e11d48, #be123c)' },
    { id: 'tech-news', name: 'ArNews', category: 'Utilities', icon: '📰', color: 'linear-gradient(135deg, #4f46e5, #4338ca)' },
    { id: 'sticky-notes', name: 'ArMemo', category: 'Utilities', icon: '📌', color: 'linear-gradient(135deg, #eab308, #ca8a04)' }
  ];

  const filteredApps = launchpadApps.filter(app => 
    app.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    app.category.toLowerCase().includes(searchVal.toLowerCase())
  );

  const handleLaunch = (id, name) => {
    openWindow(id, name);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10, 11, 18, 0.72)',
        backdropFilter: 'blur(35px) saturate(180%)',
        WebkitBackdropFilter: 'blur(35px) saturate(180%)',
        zIndex: 99000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 80px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        animation: 'launchpad-fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Search Input Container */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: '300px',
          marginBottom: '40px',
          animation: 'launchpad-scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <input 
          type="text" 
          placeholder="Search Application..." 
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            fontSize: '13px',
            outline: 'none',
            textAlign: 'center',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.15)',
            caretColor: 'var(--accent-color)'
          }}
        />
      </div>

      {/* Grid wrapper */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '30px 24px',
          width: '100%',
          maxWidth: '900px',
          justifyContent: 'center',
          animation: 'launchpad-scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {filteredApps.map(app => (
          <div 
            key={app.id}
            onClick={() => handleLaunch(app.id, app.name)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              textAlign: 'center',
              gap: '8px'
            }}
            className="launchpad-icon-card"
          >
            {/* App Icon Container */}
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: app.img ? 'transparent' : app.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: app.img ? 'none' : '0 8px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.25)',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="launchpad-app-icon"
            >
              {app.img ? (
                <img 
                  src={app.img} 
                  alt={app.name} 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }} 
                />
              ) : (
                app.icon
              )}
            </div>

            {/* Label */}
            <span style={{
              fontSize: '11.5px',
              fontWeight: '500',
              color: '#ffffff',
              textShadow: '0 2px 6px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '90px'
            }}>
              {app.name}
            </span>
          </div>
        ))}
      </div>

      {/* Embedded Animations Styles */}
      <style>{`
        @keyframes launchpad-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes launchpad-scale-up {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .launchpad-icon-card:hover .launchpad-app-icon {
          transform: scale(1.1);
          box-shadow: 0 12px 28px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}
