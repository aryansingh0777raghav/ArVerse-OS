import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function Dashboard({ onOpenSearch }) {
  const { openWindow } = useAppState();
  const [activeFolder, setActiveFolder] = useState(null);
  const [isUtilitiesExpanded, setIsUtilitiesExpanded] = useState(true);

  // Grouped 14 utility apps
  const appFolders = [
    {
      id: 'productivity',
      name: 'Productivity',
      desc: 'Office & Scheduler Tools',
      apps: [
        { id: 'calendar-app', name: 'ArCal', desc: 'Schedule events & alerts', icon: '📅' },
        { id: 'markdown-notepad', name: 'ArNote', desc: 'Draft formatted markdown', icon: '📝' },
        { id: 'pomodoro-timer', name: 'ArFocus', desc: 'Focus timer lists tasks', icon: '⏱️' },
        { id: 'sticky-notes', name: 'ArMemo', desc: 'Drag-style post-it boards', icon: '📌' }
      ]
    },
    {
      id: 'utilities',
      name: 'System & Utilities',
      desc: 'System Tools & Diagnostics',
      apps: [
        { id: 'calculator', name: 'ArCalc', desc: 'Scientific calculations', icon: '🧮' },
        { id: 'system-monitor', name: 'ArMon', desc: 'CPU, RAM & diagnostics', icon: '📊' },
        { id: 'system-cleaner', name: 'ArClean', desc: 'Purge storage caches', icon: '🗑️' },
        { id: 'weather-app', name: 'ArCast', desc: 'Local and global forecast', icon: '🌤️' },
        { id: 'wallpapers-hub', name: 'ArWall', desc: 'Customize background theme', icon: '📸' }
      ]
    },
    {
      id: 'developer',
      name: 'Developer Tools',
      desc: 'Terminals & Sandboxes',
      apps: [
        { id: 'retro-terminal', name: 'ArTerm', desc: 'UNIX-like terminal shell', icon: '🐚' },
        { id: 'code-sandbox', name: 'ArPlay', desc: 'HTML & CSS live playground', icon: '⚡' }
      ]
    },
    {
      id: 'media',
      name: 'Media & News',
      desc: 'Audio, Paint & Aggregator',
      apps: [
        { id: 'lofi-player', name: 'ArTune', desc: 'Cozy procedural beats', icon: '🎵' },
        { id: 'pixel-paint', name: 'ArDraw', desc: 'Draw & export pixel art', icon: '🎨' },
        { id: 'tech-news', name: 'ArNews', desc: 'RSS feed details summaries', icon: '📰' }
      ]
    }
  ];

  const totalAppsCount = appFolders.reduce((sum, f) => sum + f.apps.length, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Aryan';
    if (hour < 17) return 'Good Afternoon, Aryan';
    return 'Good Evening, Aryan';
  };

  const ecosystemApps = [
    { id: 'arkon', name: 'ArKon App', desc: 'AI Assistant', img: '/arkon.png', titleName: 'ArKon App' },
    { id: 'arlip', name: 'ArLip Creator', desc: 'Content Creation Suite', img: '/arlip.png', titleName: 'ArLip Creator' },
    { id: 'arft', name: 'ArFt Builder', desc: 'Frontend Layout Builder', img: '/arft.ico', titleName: 'ArFt Builder' },
    { id: 'arch', name: 'ArCh Search', desc: 'Spotlight Search Engine', img: '/arch.png', titleName: 'ArCh Search' }
  ];

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        padding: '30px 40px 100px 40px',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        fontFamily: 'var(--font-sans)',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      {/* Top Center Glassmorphic Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        animation: 'fade-slide-up 0.5s ease',
        marginBottom: '10px'
      }}>
        <div 
          onClick={onOpenSearch}
          className="glass glass-card-hover"
          style={{
            width: '100%',
            maxWidth: '520px',
            height: '42px',
            borderRadius: '21px',
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span style={{ fontSize: '15px', marginRight: '10px', opacity: 0.7 }}>🔍</span>
          <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: '400', flex: 1 }}>
            Search files, type commands or query ArCh...
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '2px 8px',
            borderRadius: '6px',
            color: 'rgba(255, 255, 255, 0.8)',
            letterSpacing: '0.5px'
          }}>
            Ctrl + K
          </span>
        </div>
      </div>

      {/* Top Welcome Title */}
      <div style={{ animation: 'fade-slide-up 0.8s ease' }}>
        <h1 style={{
          fontSize: '40px',
          fontWeight: '300',
          letterSpacing: '-1.5px',
          textShadow: '0 4px 16px rgba(0,0,0,0.15)',
          color: '#ffffff'
        }}>
          {getGreeting()}
        </h1>
        <p style={{
          fontSize: '16px',
          fontWeight: '400',
          opacity: 0.8,
          marginTop: '4px',
          textShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          What would you like to do today?
        </p>
      </div>

      {/* Quick Launch Ecosystem Apps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>
          Ecosystem Launchpad
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '16px'
        }}>
          {ecosystemApps.map(app => (
            <div 
              key={app.id}
              onClick={() => openWindow(app.id, app.titleName)}
              className="glass glass-card-hover"
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              <img 
                src={app.img} 
                alt={app.name} 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                  {app.name}
                </span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                  {app.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Utility App Folders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div 
          onClick={() => setIsUtilitiesExpanded(!isUtilitiesExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
        >
          <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, margin: 0 }}>
            System Applications ({totalAppsCount})
          </h3>
          <span style={{ fontSize: '9px', opacity: 0.6 }}>{isUtilitiesExpanded ? '▼' : '▶'}</span>
        </div>

        {isUtilitiesExpanded && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))',
            gap: '16px',
            animation: 'fade-slide-up 0.4s ease'
          }}>
            {appFolders.map(folder => (
              <div
                key={folder.id}
                onClick={() => setActiveFolder(folder)}
                className="glass glass-card-hover"
                style={{
                  padding: '14px 16px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                {/* Folder Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {folder.name}
                    </span>
                    <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {folder.desc}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '8px', 
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.7)', 
                    padding: '1px 6px', 
                    borderRadius: '8px', 
                    background: 'rgba(255,255,255,0.06)', 
                    border: '1px solid rgba(255,255,255,0.04)',
                    whiteSpace: 'nowrap'
                  }}>
                    {folder.apps.length} Apps
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '100%' }} />

                {/* Static Preview Grid of Apps inside folder (non-interactive display) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
                  gap: '8px',
                  width: '100%',
                  pointerEvents: 'none' // Clicks propagate to folder card
                }}>
                  {folder.apps.map(app => (
                    <div 
                      key={app.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 2px'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '16px'
                      }}>
                        {app.icon}
                      </div>
                      <span style={{ 
                        fontSize: '9.5px', 
                        fontWeight: '500', 
                        color: 'rgba(255,255,255,0.6)', 
                        textAlign: 'center', 
                        textOverflow: 'ellipsis', 
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap', 
                        width: '100%' 
                      }}>
                        {app.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* iOS Folder Popup Overlay Modal */}
      {activeFolder && (
        <div 
          onClick={() => setActiveFolder(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            animation: 'fade-in 0.2s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '440px',
              background: 'rgba(30, 30, 30, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'folder-zoom-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Folder Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                  {activeFolder.name}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
                  {activeFolder.desc}
                </span>
              </div>
              <button 
                onClick={() => setActiveFolder(null)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                className="folder-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Folder App Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              padding: '10px 0',
              justifyItems: 'center'
            }}>
              {activeFolder.apps.map(app => (
                <div 
                  key={app.id}
                  onClick={() => {
                    openWindow(app.id, app.name);
                    setActiveFolder(null); // Close folder after launching app
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    width: '90px',
                    padding: '8px 4px',
                    borderRadius: '16px',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  className="folder-app-card"
                >
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '13px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '26px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="folder-app-icon"
                  >
                    {app.icon}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: '#ffffff', textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div style={{ opacity: 0.5, fontSize: '10.5px', textAlign: 'center', marginTop: '20px' }}>
        Press <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Ctrl + K</kbd> to activate Spotlight command.
      </div>

      <style>{`
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes folder-zoom-in {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .folder-app-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .folder-app-card:hover .folder-app-icon {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 113, 227, 0.3);
          border-color: var(--accent-color);
        }
        .folder-close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}
