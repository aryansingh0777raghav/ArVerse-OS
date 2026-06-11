import React from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function Dashboard({ onOpenSearch }) {
  const { vaultEntries, files, openWindow } = useAppState();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Aryan';
    if (hour < 17) return 'Good Afternoon, Aryan';
    return 'Good Evening, Aryan';
  };

  const getPinnedDetails = () => {
    const pinnedVault = vaultEntries.slice(0, 3);
    const pinnedFiles = files.slice(0, 3);
    return [...pinnedVault, ...pinnedFiles];
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
        overflowY: 'auto'
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
              className="glass"
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
              className="glass glass-card-hover"
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

      {/* Middle Grid - desktop shortcuts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>
          Pinned Items & Second Brain
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '16px',
          alignContent: 'flex-start'
        }}>
          {getPinnedDetails().map((item) => {
            const isFile = !!item.name;
            const name = isFile ? item.name : item.title;
            const category = isFile ? `File (${item.category})` : `Vault (${item.category})`;

            return (
              <div 
                key={item.id}
                onDoubleClick={() => {
                  if (isFile) openWindow('files-hub', 'Files Hub');
                  else openWindow('memory-vault', 'Memory Vault');
                }}
                className="glass glass-card-hover"
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
                title="Double click to open"
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  background: isFile ? 'var(--accent-color)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '14px'
                }}>
                  {isFile ? '📄' : '🕸️'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ffffff' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                    {category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div style={{ opacity: 0.5, fontSize: '10.5px', textAlign: 'center', marginTop: '20px' }}>
        Double-click items to open managers. Press <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Ctrl + K</kbd> to activate Spotlight command.
      </div>

      <style>{`
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
