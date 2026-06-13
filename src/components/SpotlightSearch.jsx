import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useArKonBrain } from '../contexts/ArKonBrainContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SpotlightSearch({ isOpen, onClose }) {
  const { vaultEntries, files, portStatuses, openWindow } = useAppState();
  const { submitCommand } = useArKonBrain();
  const { toggleTheme, setFocusMode } = useTheme();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [archResults, setArchResults] = useState([]);
  const [isSearchingArch, setIsSearchingArch] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setArchResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle outside click to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Live ArCh Search Debounce API Pinger
  useEffect(() => {
    if (!query.trim() || portStatuses[8000] !== 'active') {
      setArchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingArch(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query, deep_research: false })
        });
        if (res.ok) {
          const data = await res.json();
          // Map to standard results
          const mapped = (data.sources || []).slice(0, 3).map(src => ({
            id: `arch-${src.url}`,
            title: src.title,
            category: 'Web Search (ArCh)',
            content: src.snippet,
            url: src.url
          }));
          setArchResults(mapped);
        }
      } catch (err) {
        console.warn('Failed to query ArCh API: ', err);
      } finally {
        setIsSearchingArch(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query, portStatuses]);

  // System actions list - trigger native window opening directly
  const systemCommands = [
    { id: 'cmd-arlip', title: 'Open ArLip Content Suite', category: 'Commands', action: () => openWindow('arlip', 'ArLip Creator') },
    { id: 'cmd-arft', title: 'Open ArFt UI Builder', category: 'Commands', action: () => openWindow('arft', 'ArFt UI Builder') },
    { id: 'cmd-arch', title: 'Open ArCh Search Engine', category: 'Commands', action: () => openWindow('arch', 'ArCh Search Engine') },
    { id: 'cmd-arkon', title: 'Open ArKon Brain Console', category: 'Commands', action: () => openWindow('arkon', 'ArKon App') },
    { id: 'cmd-vault', title: 'Open Memory Vault Second Brain', category: 'Commands', action: () => openWindow('memory-vault', 'Memory Vault') },
    { id: 'cmd-film', title: 'Open Film Production Studio', category: 'Commands', action: () => openWindow('film-studio', 'Film Studio') },
    { id: 'cmd-theme', title: 'Toggle Theme Light/Dark', category: 'Commands', action: () => toggleTheme() },
    { id: 'cmd-focus', title: 'Toggle Distraction-Free Focus Mode', category: 'Commands', action: () => setFocusMode(prev => !prev) },
    { id: 'cmd-settings', title: 'Open System Settings', category: 'Commands', action: () => openWindow('settings', 'System Settings') },
    { id: 'cmd-calculator', title: 'Open ArCalc Calculator', category: 'Commands', action: () => openWindow('calculator', 'ArCalc') },
    { id: 'cmd-sysmon', title: 'Open ArMon System Monitor Diagnostics', category: 'Commands', action: () => openWindow('system-monitor', 'ArMon') },
    { id: 'cmd-calendar', title: 'Open ArCal Calendar Scheduler', category: 'Commands', action: () => openWindow('calendar-app', 'ArCal') },
    { id: 'cmd-cleaner', title: 'Open ArClean System Cleaner Optimizer', category: 'Commands', action: () => openWindow('system-cleaner', 'ArClean') },
    { id: 'cmd-terminal', title: 'Open ArTerm Retro UNIX Terminal Shell', category: 'Commands', action: () => openWindow('retro-terminal', 'ArTerm') },
    { id: 'cmd-sandbox', title: 'Open ArPlay Code Sandbox Playground', category: 'Commands', action: () => openWindow('code-sandbox', 'ArPlay') },
    { id: 'cmd-notepad', title: 'Open ArNote Markdown Notepad Editor', category: 'Commands', action: () => openWindow('markdown-notepad', 'ArNote') },
    { id: 'cmd-lofi', title: 'Open ArTune Lofi Music Player', category: 'Commands', action: () => openWindow('lofi-player', 'ArTune') },
    { id: 'cmd-weather', title: 'Open ArCast Weather Forecast Station', category: 'Commands', action: () => openWindow('weather-app', 'ArCast') },
    { id: 'cmd-paint', title: 'Open ArDraw Pixel Paint Studio', category: 'Commands', action: () => openWindow('pixel-paint', 'ArDraw') },
    { id: 'cmd-wallpapers', title: 'Open ArWall Wallpapers Hub Gallery', category: 'Commands', action: () => openWindow('wallpapers-hub', 'ArWall') },
    { id: 'cmd-pomodoro', title: 'Open ArFocus Pomodoro Timer Chronometer', category: 'Commands', action: () => openWindow('pomodoro-timer', 'ArFocus') },
    { id: 'cmd-news', title: 'Open ArNews Tech News Feeds Aggregator', category: 'Commands', action: () => openWindow('tech-news', 'ArNews') },
    { id: 'cmd-sticky', title: 'Open ArMemo Sticky Notes Board', category: 'Commands', action: () => openWindow('sticky-notes', 'ArMemo') },
  ];

  // Map files and vault entries to standard searchable list
  const searchablePool = [
    ...systemCommands,
    ...vaultEntries.map(v => ({ id: v.id, title: v.title, category: `Memory Vault (${v.category})`, content: v.content, action: () => openWindow('memory-vault', 'Memory Vault') })),
    ...files.map(f => ({ id: f.id, title: f.name, category: `Files Hub (${f.category})`, content: f.path, action: () => openWindow('files-hub', 'Files Hub') })),
  ];

  // Filter items matching query
  const filteredLocal = searchablePool.filter(item => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.content && item.content.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  // Combine matching local commands, search api hits, and web search fallbacks
  const getCombinedResults = () => {
    const results = [...filteredLocal, ...archResults];

    if (query.trim()) {
      // 1. Google Web Search Fallback
      results.push({
        id: 'fallback-google',
        title: `Search Google for "${query}"`,
        category: 'Web Search',
        content: `Search online for "${query}"`,
        action: () => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
      });

      // 2. ArCh Search Fallback
      results.push({
        id: 'fallback-arch',
        title: `Search ArCh for "${query}"`,
        category: 'ArCh Search',
        content: `Query local ArCh search engine for "${query}"`,
        action: () => {
          openWindow('arch', 'ArCh Search Engine', query);
        }
      });


      // 3. Ask ArKon AI Fallback
      results.push({
        id: 'fallback-arkon',
        title: `Ask ArKon: "${query}"`,
        category: 'AI Assistant',
        content: `Ask ArKon Assistant about "${query}"`,
        action: () => {
          openWindow('arkon', 'ArKon App');
          submitCommand(query);
        }
      });
    }

    return results;
  };

  const combinedResults = getCombinedResults();

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        if (combinedResults.length > 0) {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % combinedResults.length);
        }
      } else if (e.key === 'ArrowUp') {
        if (combinedResults.length > 0) {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + combinedResults.length) % combinedResults.length);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelection();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, combinedResults]);

  const executeSelection = (index = selectedIndex) => {
    if (combinedResults.length > 0) {
      const selectedItem = combinedResults[index];
      if (selectedItem.action) {
        selectedItem.action();
      } else if (selectedItem.url) {
        // Open web search result
        window.open(selectedItem.url, '_blank');
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 10002,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '15vh',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        fontFamily: 'var(--font-sans)'
      }}
    >
      <div 
        ref={modalRef}
        className="glass"
        style={{
          width: '640px',
          height: 'fit-content',
          maxHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'var(--panel-bg-solid)',
          animation: 'spotlight-slide-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--panel-border)' }}>
          <span style={{ fontSize: '18px', marginRight: '14px', opacity: 0.7 }}>🔍</span>
          <input 
            ref={inputRef}
            type="text"
            placeholder="Type a command or search anything (e.g. Open ArLip, script files...)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)'
            }}
          />
          {isSearchingArch && (
            <span style={{ fontSize: '11px', color: 'var(--accent-color)', animation: 'pulse-dot 1s infinite' }}>
              Querying ArCh...
            </span>
          )}
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {combinedResults.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No results found for "{query}"
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div 
                  key={item.id}
                  onClick={() => executeSelection(idx)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: '10px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--accent-color)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    transition: 'background 0.1s ease'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.title}</span>
                    {item.content && (
                      <span style={{ 
                        fontSize: '10.5px', 
                        opacity: 0.8,
                        color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                        maxWidth: '420px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.content}
                      </span>
                    )}
                  </div>
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--panel-border)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Action footer */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--panel-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          background: 'rgba(0,0,0,0.02)'
        }}>
          <div>
            Search powered by <span style={{ fontWeight: '700', color: portStatuses[8000] === 'active' ? 'var(--accent-color)' : 'var(--text-secondary)' }}>ArCh AI</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spotlight-slide-in {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
