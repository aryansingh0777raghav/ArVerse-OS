import React, { useRef, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function NotificationCenter({ isOpen, onClose }) {
  const { activities, addActivity } = useAppState();
  const panelRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Check if click was outside the sidebar panel
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target) && e.clientX < window.innerWidth - 360) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getCalendarDays = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // empty spaces for previous month's alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }
    return days;
  };

  const getRelativeTime = (isoString) => {
    const ms = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      ref={panelRef}
      className="glass"
      style={{
        position: 'absolute',
        top: '28px',
        right: 0,
        width: '360px',
        height: 'calc(100vh - 28px)',
        borderRadius: 0,
        border: 'none',
        borderLeft: '1px solid var(--panel-border)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 9997,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        color: 'var(--text-primary)',
        animation: 'nc-slide-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        overflowY: 'auto'
      }}
    >
      {/* Calendar Header Card */}
      <div className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: '700', fontSize: '13px' }}>
            {new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '600' }}>Today</span>
        </div>
        
        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '10px', fontWeight: '600', opacity: 0.7 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => <span key={idx}>{d}</span>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginTop: '6px', textAlign: 'center', fontSize: '11px' }}>
          {getCalendarDays().map((day, idx) => {
            const isToday = day === new Date().getDate();
            return (
              <span 
                key={idx}
                style={{
                  padding: '4px 0',
                  borderRadius: '50%',
                  fontWeight: isToday ? '700' : '400',
                  background: isToday ? 'var(--accent-color)' : 'transparent',
                  color: isToday ? '#ffffff' : 'var(--text-primary)',
                  opacity: day === null ? 0 : 1
                }}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      {/* Notifications/Activities feed */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontWeight: '700', fontSize: '14px' }}>Ecosystem Activities</span>
          <button 
            onClick={() => addActivity('Cleared notification log', 'System')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-color)',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Clear All
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', marginTop: '40px' }}>
              No recent notifications
            </div>
          ) : (
            activities.map(act => (
              <div 
                key={act.id}
                className="glass-card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: act.app === 'ArLip' ? '#ea580c' : act.app === 'ArFt' ? '#059669' : act.app === 'ArCh' ? '#0284c7' : 'var(--accent-color)',
                    background: 'var(--panel-border)',
                    padding: '2px 6px',
                    borderRadius: '8px'
                  }}>
                    {act.app}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {getRelativeTime(act.timestamp)}
                  </span>
                </div>
                <p style={{ color: 'var(--text-primary)', marginTop: '4px', fontWeight: '500' }}>
                  {act.action}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes nc-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
