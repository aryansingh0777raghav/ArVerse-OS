import React, { useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppState } from '../contexts/AppStateContext';

export default function ControlCenter({ isOpen, onClose }) {
  const { 
    theme, toggleTheme, 
    wallpaper, selectWallpaper, uploadCustomWallpaper,
    volume, setVolume, 
    brightness, setBrightness,
    focusMode, setFocusMode 
  } = useTheme();

  const { activeWorkspace, portStatuses } = useAppState();
  const panelRef = useRef(null);

  // Close panel on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadCustomWallpaper(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a file under 5MB.");
    }
  };

  // Synthesize soft Apple-like system alert sound
  const playVolumeChime = (level) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      // Short crystal frequency shift chime
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6 note
      
      gain.gain.setValueAtTime((level / 100) * 0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      console.warn("Web Audio not initialized: ", e);
    }
  };

  return (
    <div 
      ref={panelRef}
      className="glass"
      style={{
        position: 'absolute',
        top: '36px',
        right: '12px',
        width: '320px',
        padding: '20px',
        zIndex: 10000,
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        color: 'var(--text-primary)',
        animation: 'cc-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {/* Title */}
      <h3 style={{ fontSize: '14px', fontWeight: '700', opacity: 0.9 }}>Control Center</h3>

      {/* Row 1: Theme & Focus */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Theme Button */}
        <div 
          onClick={toggleTheme}
          style={{
            background: 'var(--panel-border)',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'background 0.2s'
          }}
        >
          <span style={{ fontSize: '18px' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600' }}>Theme</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
          </div>
        </div>

        {/* Focus Mode Button */}
        <div 
          onClick={() => { setFocusMode(!focusMode); onClose(); }}
          style={{
            background: focusMode ? 'var(--accent-color)' : 'var(--panel-border)',
            color: focusMode ? '#ffffff' : 'var(--text-primary)',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '18px' }}>👁️‍🗨️</span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600' }}>Focus Mode</div>
            <div style={{ fontSize: '9px', opacity: 0.8 }}>{focusMode ? 'Active' : 'Off'}</div>
          </div>
        </div>
      </div>

      {/* Volume Slider */}
      <div style={sliderContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>
          <span>Volume</span>
          <span>{volume}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={(e) => setVolume(parseInt(e.target.value))} 
          onMouseUp={() => playVolumeChime(volume)}
          onTouchEnd={() => playVolumeChime(volume)}
          style={sliderInputStyle}
        />
      </div>

      {/* Brightness Slider */}
      <div style={sliderContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>
          <span>Brightness</span>
          <span>{brightness}%</span>
        </div>
        <input 
          type="range" 
          min="10" 
          max="100" 
          value={brightness} 
          onChange={(e) => setBrightness(parseInt(e.target.value))} 
          style={sliderInputStyle}
        />
      </div>

      {/* Wallpaper Switcher */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>Wallpapers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {[
            { id: 'glass-waves', name: '🌊' },
            { id: 'aurora', name: '🌌' },
            { id: 'abstract', name: '🎨' },
            { id: 'pure-dark', name: '⚫' },
            { id: 'pure-light', name: '⚪' }
          ].map(wp => (
            <button 
              key={wp.id}
              onClick={() => selectWallpaper(wp.id)}
              style={{
                width: '100%',
                height: '36px',
                borderRadius: '8px',
                border: wallpaper === wp.id ? '2px solid var(--accent-color)' : '1px solid var(--panel-border)',
                background: 'var(--panel-border)',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border 0.2s'
              }}
              title={wp.id}
            >
              {wp.name}
            </button>
          ))}
        </div>
        
        {/* Custom Upload Button */}
        <label 
          className="clickable"
          style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: 'var(--panel-border)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📁 Upload Wallpaper
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </label>
      </div>

      {/* Services Health List */}
      <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Applications status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { name: 'ArFt Builder (5173)', port: 5173 },
            { name: 'ArLip Suite (5174)', port: 5174 },
            { name: 'ArCh Search (8000)', port: 8000 }
          ].map(app => (
            <div key={app.port} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{app.name}</span>
              <span style={{
                color: portStatuses[app.port] === 'active' ? '#34c759' : '#ff3b30',
                fontWeight: '600'
              }}>
                {portStatuses[app.port] === 'active' ? 'Active' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cc-slide-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const sliderContainerStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const sliderInputStyle = {
  width: '100%',
  height: '6px',
  borderRadius: '3px',
  outline: 'none',
  background: 'var(--panel-border)',
  cursor: 'pointer',
  WebkitAppearance: 'none'
};
