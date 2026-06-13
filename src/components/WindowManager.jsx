import React from 'react';
import { useAppState } from '../contexts/AppStateContext';

// Native Pages Imports
import AICommandCenter from '../pages/AICommandCenter';
import MemoryVault from '../pages/MemoryVault';
import FilmStudio from '../pages/FilmStudio';
import DeveloperConsole from '../pages/DeveloperConsole';
import FilesHub from '../pages/FilesHub';
import Settings from '../pages/Settings';

// Modular Apps Imports
import Calculator from '../pages/apps/Calculator';
import SystemMonitor from '../pages/apps/SystemMonitor';
import CalendarApp from '../pages/apps/CalendarApp';
import SystemCleaner from '../pages/apps/SystemCleaner';
import RetroTerminal from '../pages/apps/RetroTerminal';
import CodeSandbox from '../pages/apps/CodeSandbox';
import MarkdownNotepad from '../pages/apps/MarkdownNotepad';
import LofiPlayer from '../pages/apps/LofiPlayer';
import WeatherApp from '../pages/apps/WeatherApp';
import PixelPaint from '../pages/apps/PixelPaint';
import WallpapersHub from '../pages/apps/WallpapersHub';
import PomodoroTimer from '../pages/apps/PomodoroTimer';
import TechNewsReader from '../pages/apps/TechNewsReader';
import StickyNotes from '../pages/apps/StickyNotes';

export default function WindowManager() {
  const { 
    openWindows, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow, 
    updateWindowPos, 
    updateWindowSize,
    portStatuses
  } = useAppState();

  const handleHeaderMouseDown = (e, win) => {
    if (win.isMaximized) return;
    focusWindow(win.id);

    if (e.target.closest('.window-btn')) return;

    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWinX = win.x;
    const startWinY = win.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      const nextX = Math.max(-win.w + 100, Math.min(window.innerWidth - 100, startWinX + dx));
      const nextY = Math.max(28, Math.min(window.innerHeight - 80, startWinY + dy));
      
      updateWindowPos(win.id, nextX, nextY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e, win) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.w;
    const startH = win.h;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      const nextW = Math.max(400, startW + dx);
      const nextH = Math.max(300, startH + dy);

      updateWindowSize(win.id, nextW, nextH);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Helper to render local servers with a fallback boot card if offline
  const renderAppWindow = (appId, port, titleName, defaultUrl) => {
    const status = portStatuses[port];
    
    if (status === 'inactive') {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: 'var(--panel-bg-solid)',
          color: 'var(--text-primary)',
          padding: '40px',
          textAlign: 'center',
          gap: '20px',
          fontFamily: 'var(--font-sans)'
        }}>
          {/* Large Error Warning Symbol */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: 'rgba(255, 59, 48, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(255, 59, 48, 0.15)'
          }}>
            ⚠️
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
              Local Server Offline
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: '1.6' }}>
              The dev server for <strong>{titleName}</strong> is not running on port {port}. 
              Pinging this action will launch the script files locally.
            </p>
          </div>
          
          <button 
            onClick={() => {
              fetch(`/api/launch-app?app=${appId}`).catch(e => console.warn(e));
              alert(`Pinging local server... Booting ${titleName} in an interactive terminal.`);
            }}
            className="glass-button glass-button-primary"
            style={{
              padding: '10px 24px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '600'
            }}
          >
            🚀 Boot Local Server
          </button>
        </div>
      );
    }

    return (
      <iframe 
        src={defaultUrl} 
        title={titleName}
        style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
      />
    );
  };

  const renderWindowContent = (win) => {
    switch (win.id) {
      case 'arlip':
        return renderAppWindow('arlip', 5174, 'ArLip Creator', 'http://localhost:5174');
      case 'arft':
        return renderAppWindow('arft', 5173, 'ArFt UI Builder', 'http://localhost:5173');
      case 'arch':
        return renderAppWindow('arch', 8000, 'ArCh Search', 'http://localhost:8000');
      case 'arkon':
        return <AICommandCenter />;
      case 'memory-vault':
        return <MemoryVault />;
      case 'film-studio':
        return <FilmStudio />;
      case 'files-hub':
        return <FilesHub />;
      case 'developer-console':
        return <DeveloperConsole />;
      case 'settings':
        return <Settings />;
      case 'calculator':
        return <Calculator />;
      case 'system-monitor':
        return <SystemMonitor />;
      case 'calendar-app':
        return <CalendarApp />;
      case 'system-cleaner':
        return <SystemCleaner />;
      case 'retro-terminal':
        return <RetroTerminal />;
      case 'code-sandbox':
        return <CodeSandbox />;
      case 'markdown-notepad':
        return <MarkdownNotepad />;
      case 'lofi-player':
        return <LofiPlayer />;
      case 'weather-app':
        return <WeatherApp />;
      case 'pixel-paint':
        return <PixelPaint />;
      case 'wallpapers-hub':
        return <WallpapersHub />;
      case 'pomodoro-timer':
        return <PomodoroTimer />;
      case 'tech-news':
        return <TechNewsReader />;
      case 'sticky-notes':
        return <StickyNotes />;
      default:
        return (
          <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>
            Workspace application folder loaded.
          </div>
        );
    }
  };

  return (
    <div 
      className="windows-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 500
      }}
    >
      {openWindows.map(win => {
        if (win.isMinimized) return null;

        const style = win.isMaximized 
          ? {
              top: '28px',
              left: 0,
              width: '100vw',
              height: 'calc(100vh - 96px)',
              zIndex: win.zIndex
            }
          : {
              top: `${win.y}px`,
              left: `${win.x}px`,
              width: `${win.w}px`,
              height: `${win.h}px`,
              zIndex: win.zIndex
            };

        return (
          <div 
            key={win.id}
            className="glass"
            onClick={() => focusWindow(win.id)}
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--panel-border)',
              borderRadius: win.isMaximized ? 0 : '12px',
              overflow: 'hidden',
              pointerEvents: 'auto',
              background: 'var(--panel-bg-solid)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              ...style
            }}
          >
            {/* Title Bar Header */}
            <div 
              className="window-header no-select"
              onMouseDown={(e) => handleHeaderMouseDown(e, win)}
              onDoubleClick={() => maximizeWindow(win.id)}
              style={{
                height: '38px',
                background: 'var(--panel-border)',
                borderBottom: '1px solid var(--panel-border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                cursor: win.isMaximized ? 'default' : 'move',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              {/* Left dots button controls */}
              <div style={{ display: 'flex', gap: '8px', width: '60px' }}>
                <button 
                  onClick={() => closeWindow(win.id)}
                  className="window-btn"
                  style={{ ...btnDotStyle, backgroundColor: '#ff5f56' }}
                />
                <button 
                  onClick={() => minimizeWindow(win.id)}
                  className="window-btn"
                  style={{ ...btnDotStyle, backgroundColor: '#ffbd2e' }}
                />
                <button 
                  onClick={() => maximizeWindow(win.id)}
                  className="window-btn"
                  style={{ ...btnDotStyle, backgroundColor: '#27c93f' }}
                />
              </div>

              {/* Title label */}
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                letterSpacing: '0.3px'
              }}>
                {win.title}
              </span>

              {/* Right spacer alignment */}
              <div style={{ width: '60px' }} />
            </div>

            {/* Application Window Frame Body */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              {renderWindowContent(win)}
            </div>

            {/* Bottom-right diagonal resize handle */}
            {!win.isMaximized && (
              <div 
                onMouseDown={(e) => handleResizeMouseDown(e, win)}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '12px',
                  height: '12px',
                  cursor: 'se-resize',
                  zIndex: 100
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const btnDotStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
