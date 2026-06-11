import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppState } from '../contexts/AppStateContext';

export default function MenuBar({ onToggleControlCenter, onToggleNotifications, onToggleSpotlight }) {
  const { theme, setIsLocked, setIsSleeping, focusMode, toggleTheme, setFocusMode } = useTheme();
  const { 
    activeWorkspace, setActiveWorkspace, portStatuses, 
    openWindow, openWindows, closeWindow, minimizeWindow, maximizeWindow, addActivity 
  } = useAppState();
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState(null); // 'apple', 'workspace', 'file', 'edit', 'view', 'go', 'window'
  const menuBarRef = React.useRef(null);

  // Real Battery API states
  const [batteryLevel, setBatteryLevel] = useState(98);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Battery API loading
  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        const updateBatteryInfo = () => {
          setBatteryLevel(Math.round(bat.level * 100));
          setIsCharging(bat.charging);
        };
        updateBatteryInfo();
        
        bat.addEventListener('levelchange', updateBatteryInfo);
        bat.addEventListener('chargingchange', updateBatteryInfo);
      });
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (activeMenu && menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeMenu]);

  const formatTimeDate = (date) => {
    const weekday = date.toLocaleDateString([], { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString([], { month: 'short' });
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${weekday} ${day} ${month}   ${timeStr}`;
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  };

  const handleMenuMouseEnter = (menuName) => {
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  const handleAppleAction = (action) => {
    setActiveMenu(null);
    if (action === 'lock') {
      setIsLocked(true);
    } else if (action === 'sleep') {
      setIsSleeping(true);
    } else if (action === 'restart') {
      window.location.reload();
    }
  };

  const getActiveWindow = () => {
    if (!openWindows || openWindows.length === 0) return null;
    const sorted = [...openWindows]
      .filter(w => !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex);
    return sorted[0] || null;
  };

  const handleEditAction = (action) => {
    setActiveMenu(null);
    try {
      if (action === 'undo') document.execCommand('undo');
      else if (action === 'redo') document.execCommand('redo');
      else if (action === 'selectall') document.execCommand('selectAll');
      else {
        addActivity(`Executed ${action} edit action`, 'System');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleToggleFullscreen = () => {
    setActiveMenu(null);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.warn(e));
    } else {
      document.exitFullscreen();
    }
  };

  if (focusMode) return null; // hide menu bar in focus mode

  return (
    <div 
      ref={menuBarRef}
      className="glass" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '28px',
        borderRadius: 0,
        border: 'none',
        borderBottom: '1px solid var(--panel-border)',
        background: theme === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 12px',
        zIndex: 10000, // Make sure menu dropdowns render on top
        fontFamily: 'var(--font-sans)',
        fontSize: '12.5px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        boxShadow: 'none'
      }}
    >
      {/* Left Menu Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {/* ArVerse Dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/favicon.svg" 
            alt="ArVerse OS" 
            className="clickable clickable-hover" 
            onClick={() => handleMenuClick('apple')}
            onMouseEnter={() => handleMenuMouseEnter('apple')}
            style={{ 
              height: '16px', 
              width: '16px', 
              objectFit: 'contain',
              padding: '1px', 
              borderRadius: '4px',
              display: 'block',
              cursor: 'pointer',
              filter: theme === 'light' ? 'invert(1) brightness(0.2)' : 'none'
            }}
          />
          {activeMenu === 'apple' && (
            <div 
              className="glass-solid dropdown-menu-container" 
              style={dropdownMenuContainerStyle}
            >
              <div className="dropdown-item" onClick={() => handleAppleAction('lock')}>Lock Screen</div>
              <div className="dropdown-item" onClick={() => handleAppleAction('sleep')}>Sleep Mode</div>
              <div className="dropdown-item" onClick={() => handleAppleAction('restart')}>Restart OS</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => { setActiveMenu(null); openWindow('settings', 'System Settings'); }}>System Settings...</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>ArVerse OS v1.2</div>
            </div>
          )}
        </div>

        {/* Workspace Switcher */}
        <div style={{ position: 'relative', marginRight: '6px' }}>
          <span 
            className="clickable" 
            onClick={() => handleMenuClick('workspace')}
            onMouseEnter={() => handleMenuMouseEnter('workspace')}
            style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--panel-border)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {activeWorkspace} Workspace
            <span style={{ fontSize: '8px' }}>▼</span>
          </span>
          {activeMenu === 'workspace' && (
            <div 
              className="glass-solid dropdown-menu-container" 
              style={dropdownMenuContainerStyle}
            >
              {['Personal', 'Development', 'Content Creation', 'Film Production'].map(ws => (
                <div 
                  key={ws}
                  className="dropdown-item" 
                  onClick={() => { setActiveWorkspace(ws); setActiveMenu(null); }}
                  style={{
                    fontWeight: activeWorkspace === ws ? '600' : '400',
                    color: activeWorkspace === ws ? 'var(--accent-color)' : 'var(--text-primary)'
                  }}
                >
                  {ws}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Dropdown */}
        <div style={{ position: 'relative' }}>
          <span 
            className="clickable" 
            onClick={() => handleMenuClick('file')}
            onMouseEnter={() => handleMenuMouseEnter('file')}
            style={{ ...menuItemStyle, background: activeMenu === 'file' ? 'var(--panel-border)' : 'transparent' }}
          >
            File
          </span>
          {activeMenu === 'file' && (
            <div className="glass-solid dropdown-menu-container" style={dropdownMenuContainerStyle}>
              <div className="dropdown-item" onClick={() => { openWindow('memory-vault', 'Memory Vault'); setActiveMenu(null); }}>
                <span>New Memory Note</span>
                <span style={shortcutKeyStyle}>Ctrl + N</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('files-hub', 'Files Hub'); setActiveMenu(null); }}>
                <span>Import File...</span>
                <span style={shortcutKeyStyle}>Ctrl + I</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => {
                const active = getActiveWindow();
                if (active) closeWindow(active.id);
                setActiveMenu(null);
              }} style={{ color: getActiveWindow() ? 'inherit' : 'var(--text-tertiary)', pointerEvents: getActiveWindow() ? 'auto' : 'none' }}>
                <span>Close Window</span>
                <span style={shortcutKeyStyle}>Ctrl + W</span>
              </div>
            </div>
          )}
        </div>

        {/* Edit Dropdown */}
        <div style={{ position: 'relative' }}>
          <span 
            className="clickable" 
            onClick={() => handleMenuClick('edit')}
            onMouseEnter={() => handleMenuMouseEnter('edit')}
            style={{ ...menuItemStyle, background: activeMenu === 'edit' ? 'var(--panel-border)' : 'transparent' }}
          >
            Edit
          </span>
          {activeMenu === 'edit' && (
            <div className="glass-solid dropdown-menu-container" style={dropdownMenuContainerStyle}>
              <div className="dropdown-item" onClick={() => handleEditAction('undo')}>
                <span>Undo</span>
                <span style={shortcutKeyStyle}>Ctrl + Z</span>
              </div>
              <div className="dropdown-item" onClick={() => handleEditAction('redo')}>
                <span>Redo</span>
                <span style={shortcutKeyStyle}>Ctrl + Y</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => handleEditAction('cut')}>
                <span>Cut</span>
                <span style={shortcutKeyStyle}>Ctrl + X</span>
              </div>
              <div className="dropdown-item" onClick={() => handleEditAction('copy')}>
                <span>Copy</span>
                <span style={shortcutKeyStyle}>Ctrl + C</span>
              </div>
              <div className="dropdown-item" onClick={() => handleEditAction('paste')}>
                <span>Paste</span>
                <span style={shortcutKeyStyle}>Ctrl + V</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => handleEditAction('selectall')}>
                <span>Select All</span>
                <span style={shortcutKeyStyle}>Ctrl + A</span>
              </div>
            </div>
          )}
        </div>

        {/* View Dropdown */}
        <div style={{ position: 'relative' }}>
          <span 
            className="clickable" 
            onClick={() => handleMenuClick('view')}
            onMouseEnter={() => handleMenuMouseEnter('view')}
            style={{ ...menuItemStyle, background: activeMenu === 'view' ? 'var(--panel-border)' : 'transparent' }}
          >
            View
          </span>
          {activeMenu === 'view' && (
            <div className="glass-solid dropdown-menu-container" style={dropdownMenuContainerStyle}>
              <div className="dropdown-item" onClick={() => { toggleTheme(); setActiveMenu(null); }}>
                <span>Toggle Theme</span>
                <span style={shortcutKeyStyle}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
              </div>
              <div className="dropdown-item" onClick={() => { setFocusMode(prev => !prev); setActiveMenu(null); }}>
                <span>Toggle Focus Mode</span>
                <span style={shortcutKeyStyle}>Alt + F</span>
              </div>
              <div className="dropdown-item" onClick={handleToggleFullscreen}>
                <span>Toggle Fullscreen</span>
                <span style={shortcutKeyStyle}>F11</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => { window.location.reload(); }}>
                <span>Reload OS</span>
                <span style={shortcutKeyStyle}>Ctrl + R</span>
              </div>
            </div>
          )}
        </div>

        {/* Go Dropdown */}
        <div style={{ position: 'relative' }}>
          <span 
            className="clickable" 
            onClick={() => handleMenuClick('go')}
            onMouseEnter={() => handleMenuMouseEnter('go')}
            style={{ ...menuItemStyle, background: activeMenu === 'go' ? 'var(--panel-border)' : 'transparent' }}
          >
            Go
          </span>
          {activeMenu === 'go' && (
            <div className="glass-solid dropdown-menu-container" style={{ ...dropdownMenuContainerStyle, width: '220px' }}>
              <div style={{ padding: '4px 16px', fontSize: '9px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ecosystem Apps</div>
              <div className="dropdown-item" onClick={() => { openWindow('arkon', 'ArKon App'); setActiveMenu(null); }}>
                <span>🚀 ArKon Assistant</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('arlip', 'ArLip Creator'); setActiveMenu(null); }}>
                <span>🎬 ArLip Content Creator</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('arft', 'ArFt UI Builder'); setActiveMenu(null); }}>
                <span>📐 ArFt Web Builder</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('arch', 'ArCh Search Engine'); setActiveMenu(null); }}>
                <span>🔍 ArCh Spotlight Search</span>
              </div>
              <div className="dropdown-divider" />
              <div style={{ padding: '4px 16px', fontSize: '9px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Native OS Tools</div>
              <div className="dropdown-item" onClick={() => { openWindow('memory-vault', 'Memory Vault'); setActiveMenu(null); }}>
                <span>🕸️ Memory Vault</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('film-studio', 'Film Studio'); setActiveMenu(null); }}>
                <span>📽️ Film Studio</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('files-hub', 'Files Hub'); setActiveMenu(null); }}>
                <span>📂 Files Hub</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('developer-console', 'Dev Console'); setActiveMenu(null); }}>
                <span>💻 Developer Console</span>
              </div>
              <div className="dropdown-item" onClick={() => { openWindow('settings', 'System Settings'); setActiveMenu(null); }}>
                <span>⚙️ System Settings</span>
              </div>
            </div>
          )}
        </div>

        {/* Window Dropdown */}
        <div style={{ position: 'relative' }}>
          <span 
            className="clickable" 
            onClick={() => handleMenuClick('window')}
            onMouseEnter={() => handleMenuMouseEnter('window')}
            style={{ ...menuItemStyle, background: activeMenu === 'window' ? 'var(--panel-border)' : 'transparent' }}
          >
            Window
          </span>
          {activeMenu === 'window' && (
            <div className="glass-solid dropdown-menu-container" style={dropdownMenuContainerStyle}>
              <div className="dropdown-item" onClick={() => {
                const active = getActiveWindow();
                if (active) minimizeWindow(active.id);
                setActiveMenu(null);
              }} style={{ color: getActiveWindow() ? 'inherit' : 'var(--text-tertiary)', pointerEvents: getActiveWindow() ? 'auto' : 'none' }}>
                <span>Minimize Window</span>
                <span style={shortcutKeyStyle}>Ctrl + M</span>
              </div>
              <div className="dropdown-item" onClick={() => {
                const active = getActiveWindow();
                if (active) maximizeWindow(active.id);
                setActiveMenu(null);
              }} style={{ color: getActiveWindow() ? 'inherit' : 'var(--text-tertiary)', pointerEvents: getActiveWindow() ? 'auto' : 'none' }}>
                <span>Zoom / Maximize</span>
                <span style={shortcutKeyStyle}>Ctrl + F</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => {
                if (openWindows && openWindows.length > 0) {
                  openWindows.forEach(w => closeWindow(w.id));
                }
                setActiveMenu(null);
              }} style={{ color: openWindows && openWindows.length > 0 ? 'inherit' : 'var(--text-tertiary)', pointerEvents: openWindows && openWindows.length > 0 ? 'auto' : 'none' }}>
                <span>Close All Windows</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Menu Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Local Ports Health Lights */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--panel-border)', padding: '2px 8px', borderRadius: '12px' }} title="Port Statuses (5173 ArFt, 5174 ArLip, 8000 ArCh)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginRight: '2px' }}>ports:</span>
            {/* ArFt */}
            <span 
              style={{ ...indicatorDotStyle, backgroundColor: portStatuses[5173] === 'active' ? '#34c759' : '#ff3b30' }} 
              title={`ArFt (5173): ${portStatuses[5173]}`}
            />
            {/* ArLip */}
            <span 
              style={{ ...indicatorDotStyle, backgroundColor: portStatuses[5174] === 'active' ? '#34c759' : '#ff3b30' }} 
              title={`ArLip (5174): ${portStatuses[5174]}`}
            />
            {/* ArCh */}
            <span 
              style={{ ...indicatorDotStyle, backgroundColor: portStatuses[8000] === 'active' ? '#34c759' : '#ff3b30' }} 
              title={`ArCh (8000): ${portStatuses[8000]}`}
            />
          </div>
        </div>

        {/* Real Battery Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            {isCharging && '⚡ '}{batteryLevel}%
          </span>
          <svg width="18" height="10" viewBox="0 0 24 12" fill="none" stroke="var(--text-primary)" strokeWidth="1.5">
            <rect x="1" y="1" width="18" height="10" rx="2" />
            <line x1="21" y1="4" x2="21" y2="8" strokeWidth="2" strokeLinecap="round" />
            <rect x="3" y="3" width={`${Math.max(1, (batteryLevel / 100) * 14)}`} height="6" fill={isCharging ? '#34c759' : batteryLevel < 20 ? '#ff3b30' : 'var(--text-primary)'} rx="1" />
          </svg>
        </div>

        {/* Search Trigger */}
        <div className="clickable" onClick={onToggleSpotlight} style={iconStyle} title="Search (Ctrl + K)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Control Center Trigger */}
        <div className="clickable" onClick={onToggleControlCenter} style={iconStyle} title="Control Center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <circle cx="4" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="10" r="2" fill="currentColor" />
            <circle cx="20" cy="14" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Notifications Trigger */}
        <div className="clickable" onClick={onToggleNotifications} style={iconStyle} title="Notifications">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>

        {/* Time Date */}
        <span className="clickable" onClick={onToggleNotifications} style={{ padding: '2px 4px', borderRadius: '4px' }}>
          {formatTimeDate(time)}
        </span>
      </div>
    </div>
  );
}

const menuItemStyle = {
  cursor: 'pointer',
  padding: '2px 8px',
  borderRadius: '4px',
  transition: 'background 0.15s ease',
  fontSize: '12.5px',
  fontWeight: '500',
  userSelect: 'none'
};

const dropdownMenuContainerStyle = {
  position: 'absolute',
  top: '24px',
  left: '0',
  width: '180px',
  padding: '6px 0',
  zIndex: 10005,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--shadow-lg)'
};

const shortcutKeyStyle = {
  fontSize: '10px',
  opacity: 0.5,
  marginLeft: '10px',
  fontFamily: 'var(--font-mono)'
};

const dropdownItemStyle = {
  cursor: 'pointer',
  userSelect: 'none'
};

const indicatorDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  display: 'inline-block'
};

const iconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2px 4px',
  borderRadius: '4px'
};
