import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AppStateProvider, useAppState } from './contexts/AppStateContext';
import { ArKonBrainProvider } from './contexts/ArKonBrainContext';

// Components
import BootScreen from './components/BootScreen';
import LockScreen from './components/LockScreen';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import ControlCenter from './components/ControlCenter';
import NotificationCenter from './components/NotificationCenter';
import AppSwitcher from './components/AppSwitcher';
import SpotlightSearch from './components/SpotlightSearch';
import WindowManager from './components/WindowManager';

// Background Page Workspace
import Dashboard from './pages/Dashboard';
import FocusMode from './pages/FocusMode';

function OSShell() {
  const { 
    isBooting, 
    isLocked, 
    isSleeping, setIsSleeping,
    focusMode, 
    getWallpaperBackground, 
    brightness 
  } = useTheme();

  const { openWindows } = useAppState();

  const [ccOpen, setCcOpen] = useState(false);
  const [ncOpen, setNcOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Global Keyboard Shortcuts Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent browser default Ctrl+K and open Spotlight
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
        setCcOpen(false);
        setNcOpen(false);
      }

      // Alt + Q (Browser safe switcher fallback instead of Alt+Tab)
      if (e.altKey && (e.key === 'q' || e.key === 'Tab')) {
        e.preventDefault();
        setSwitcherOpen(true);
      }

      // Escape key closes overlays
      if (e.key === 'Escape') {
        setSpotlightOpen(false);
        setCcOpen(false);
        setNcOpen(false);
        setSwitcherOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sleep Mode Wake loop
  useEffect(() => {
    if (!isSleeping) return;

    const wakeUp = () => {
      setIsSleeping(false);
    };

    window.addEventListener('mousemove', wakeUp);
    window.addEventListener('keydown', wakeUp);
    window.addEventListener('click', wakeUp);

    return () => {
      window.removeEventListener('mousemove', wakeUp);
      window.removeEventListener('keydown', wakeUp);
      window.removeEventListener('click', wakeUp);
    };
  }, [isSleeping, setIsSleeping]);

  // Render lifecycles
  if (isBooting) {
    return <BootScreen />;
  }

  if (isLocked) {
    return <LockScreen />;
  }

  if (isSleeping) {
    return (
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          fontFamily: 'var(--font-sans)',
          cursor: 'none',
          zIndex: 10006
        }}
      >
        <span style={{ fontSize: '64px', fontWeight: '200', opacity: 0.8, animation: 'float 4s ease-in-out infinite' }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </span>
        <span style={{ fontSize: '12px', opacity: 0.4, marginTop: '12px' }}>
          Move mouse or press any key to wake
        </span>
      </div>
    );
  }

  return (
    <div 
      className="desktop-container" 
      style={{ 
        ...getWallpaperBackground()
      }}
    >
      {/* Menu Bar Status */}
      <MenuBar 
        onToggleControlCenter={() => { setCcOpen(!ccOpen); setNcOpen(false); }}
        onToggleNotifications={() => { setNcOpen(!ncOpen); setCcOpen(false); }}
        onToggleSpotlight={() => setSpotlightOpen(!spotlightOpen)}
      />

      {/* Slideout Panels */}
      <ControlCenter isOpen={ccOpen} onClose={() => setCcOpen(false)} />
      <NotificationCenter isOpen={ncOpen} onClose={() => setNcOpen(false)} />

      {/* Floating Spotlight Raycast Modal */}
      <SpotlightSearch isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />

      {/* Alt + Q Switcher Modal */}
      <AppSwitcher isOpen={switcherOpen} onClose={() => setSwitcherOpen(false)} />

      {/* Desktop App Windows */}
      <WindowManager />

      {/* Background Dashboard & Widgets Grid */}
      <div style={{
        position: 'absolute',
        top: focusMode ? 0 : '28px',
        left: 0,
        width: '100vw',
        height: focusMode ? '100vh' : 'calc(100vh - 28px)',
        zIndex: 5
      }}>
        {focusMode ? <FocusMode /> : <Dashboard onOpenSearch={() => setSpotlightOpen(true)} />}
      </div>

      {/* Launcher Dock */}
      <Dock />

      {/* Real System Screen Brightness Overlay Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        opacity: ((100 - brightness) / 100) * 0.75, // Cap maximum dimming to prevent pitch black screen
        pointerEvents: 'none',
        zIndex: 100000, // Top z-index overlays all frames, settings, and cursors
        transition: 'opacity 0.12s cubic-bezier(0.16, 1, 0.3, 1)'
      }} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <ArKonBrainProvider>
          <OSShell />
        </ArKonBrainProvider>
      </AppStateProvider>
    </ThemeProvider>
  );
}
