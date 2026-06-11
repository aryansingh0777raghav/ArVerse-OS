import React from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function AICommandCenter() {
  const { addActivity } = useAppState();

  const handleManualLaunch = () => {
    fetch('/api/launch-app?app=arkon')
      .then(() => {
        addActivity('Launched ArKon App from dashboard', 'System');
        alert("Pinging local launcher... ArKon HUD window is opening on your desktop screen!");
      })
      .catch(err => {
        console.error("Failed to launch app:", err);
      });
  };

  return (
    <div className="window-content" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      {/* Header bar */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/arkon.png" alt="ArKon" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
          <span style={{ fontWeight: '700', fontSize: '13px' }}>ArKon System Control Panel</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ecosystem Core</span>
      </div>

      {/* Main launch layout card */}
      <div style={{
        flex: 1,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        overflowY: 'auto'
      }}>
        {/* Real App Icon */}
        <div className="animate-float" style={{ position: 'relative' }}>
          <img 
            src="/arkon.png" 
            alt="ArKon Logo" 
            style={{
              width: '92px',
              height: '92px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid rgba(255,255,255,0.1)'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#34c759',
            border: '3px solid var(--panel-bg-solid)',
            boxShadow: '0 0 8px #34c759'
          }} />
        </div>

        {/* Info */}
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>ArKon AI Assistant</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            ArKon is your local personal AI assistant running a Pygame wavefield overlay. 
            It logs conversations, triggers system automations, and runs directly on your desktop shell.
          </p>
        </div>

        {/* Launch Button & Direct Link */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleManualLaunch}
            className="glass-button glass-button-primary"
            style={{
              padding: '12px 28px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 8px 20px rgba(0, 113, 227, 0.25)'
            }}
          >
            🚀 Launch ArKon App
          </button>

          <a 
            href="file:///C:/Users/aryan/OneDrive/Desktop/Antigravity Projects/ArKon-Personal-AI/ArKon-Personal-AI/Launch-ArKon.cmd"
            style={{
              fontSize: '11px',
              color: 'var(--accent-color)',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Direct File Link: Launch-ArKon.cmd
          </a>
        </div>

        {/* Launch instruction details card */}
        <div className="glass" style={{
          width: '100%',
          maxWidth: '460px',
          padding: '20px',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.02)',
          border: '1px solid var(--panel-border)',
          fontSize: '11.5px',
          lineHeight: '1.6'
        }}>
          <strong style={{ display: 'block', marginBottom: '8px' }}>Active Shell Instructions:</strong>
          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
            <li>Launching ArKon starts the local python service `main.py` directly.</li>
            <li>Press keys 1 / 2 / 3 to toggle states inside ArKon's prism core HUD.</li>
            <li>Status records and chats sync directly to database log files.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
