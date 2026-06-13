import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const PRESET_WALLPAPERS = [
  {
    id: 'glass-waves',
    title: 'Glassmorphic Waves',
    description: 'The signature layered glass waves styling, shifting with active light/dark themes.',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'aurora',
    title: 'Solar Aurora',
    description: 'Dynamic green and purple northern lights glow, blended into deep space particles.',
    preview: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'abstract',
    title: 'Minimalist Vector',
    description: 'Sleek dark geometric vectors, reducing glare and promoting high contrast coding.',
    preview: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'pure-dark',
    title: 'Console Pitch Black',
    description: 'Absolute black background for OLED screens, minimizing distraction and conserving power.',
    preview: 'https://images.unsplash.com/photo-1502239608882-93b729c6af43?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'pure-light',
    title: 'Minimal Studio White',
    description: 'Crisp studio white backdrop for high productivity and daytime environments.',
    preview: 'https://images.unsplash.com/photo-1618005198143-d366800ee7ef?w=400&auto=format&fit=crop&q=60'
  }
];

export default function WallpapersHub() {
  const { wallpaper, selectWallpaper, uploadCustomWallpaper, customWallpaper } = useTheme();
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Error: Please upload a valid image file (PNG, JPG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Error: File size exceeds 2MB limit (storage budget constraint).');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        uploadCustomWallpaper(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowY: 'auto', padding: '24px', gap: '20px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Workspace Wallpapers</h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Personalize your main desktop background system</span>
      </div>

      {/* Preset Wallpapers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Pre-installed Themes</span>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {PRESET_WALLPAPERS.map(wp => {
            const isSelected = wallpaper === wp.id;
            return (
              <div 
                key={wp.id}
                onClick={() => selectWallpaper(wp.id)}
                className="glass wallpaper-hub-card"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--panel-border)',
                  background: 'rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 113, 227, 0.3)' : 'none'
                }}
              >
                {/* Preview Thumbnail */}
                <div style={{
                  height: '110px',
                  backgroundImage: `url(${wp.preview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'var(--accent-color)',
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      textTransform: 'uppercase'
                    }}>
                      Active
                    </div>
                  )}
                </div>

                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '600' }}>{wp.title}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{wp.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Upload Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Custom Desktop Photo</span>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
          {/* Uploader Dropzone */}
          <div 
            className="glass"
            style={{
              padding: '24px',
              borderRadius: '12px',
              border: '2px dashed var(--panel-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.01)',
              cursor: 'pointer',
              position: 'relative',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '28px' }}>📸</span>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>Click to Browse local files</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Accepts JPG, PNG up to 2MB.</span>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Current Custom Wallpaper card */}
          <div 
            className="glass" 
            style={{ 
              borderRadius: '12px', 
              padding: '16px', 
              background: 'rgba(0,0,0,0.05)', 
              border: '1px solid var(--panel-border)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {customWallpaper ? (
              <>
                <div style={{
                  width: '100%',
                  height: '80px',
                  backgroundImage: `url(${customWallpaper})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '6px',
                  border: '1px solid var(--panel-border)'
                }} />
                <button 
                  onClick={() => selectWallpaper('custom')}
                  style={{
                    width: '100%',
                    padding: '6px',
                    borderRadius: '6px',
                    border: 'none',
                    background: wallpaper === 'custom' ? '#34c759' : 'var(--accent-color)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {wallpaper === 'custom' ? 'Custom Wall Active' : 'Set Custom Wallpaper'}
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '11px' }}>
                No custom photo uploaded. Choose a file to start.
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <span style={{ fontSize: '11px', color: '#ff3b30', fontWeight: '600' }}>{errorMsg}</span>
        )}
      </div>

    </div>
  );
}
