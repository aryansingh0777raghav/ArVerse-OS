import React, { useState, useEffect } from 'react';

export default function SystemCleaner() {
  const [cleaningItems, setCleaningItems] = useState([
    { id: 'temp', name: 'Temporary Cache Files', size: 1024 * 1024 * 450, checked: true, icon: '🗑️' },
    { id: 'logs', name: 'System Crash & Diagnostics Logs', size: 1024 * 1024 * 128, checked: true, icon: '📄' },
    { id: 'browser', name: 'Browser Session Databases', size: 1024 * 1024 * 890, checked: false, icon: '🌐' },
    { id: 'trash', name: 'Bin / Workspace Junk Trash', size: 1024 * 1024 * 1230, checked: true, icon: '📦' },
    { id: 'bundles', name: 'Unused npm/Vite Build Cache', size: 1024 * 1024 * 2100, checked: false, icon: '⚙️' }
  ]);

  const [status, setStatus] = useState('idle'); // idle, scanning, scan-done, cleaning, cleaned
  const [progress, setProgress] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [totalDisk, setTotalDisk] = useState(256); // GB
  const [freeDisk, setFreeDisk] = useState(145.2); // GB
  const [cleanedSize, setCleanedSize] = useState(0);

  const addLog = (text) => {
    setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`].slice(-25));
  };

  const handleToggle = (id) => {
    if (status !== 'idle' && status !== 'scan-done') return;
    setCleaningItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const startScan = () => {
    setStatus('scanning');
    setProgress(0);
    setConsoleLogs([]);
    addLog("Initializing Deep System Scan...");
    addLog("Accessing core system registry...");
  };

  const startClean = () => {
    setStatus('cleaning');
    setProgress(0);
    addLog("Beginning file cleanup operations...");
  };

  // Scan simulation
  useEffect(() => {
    if (status !== 'scanning') return;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(timer);
          setStatus('scan-done');
          addLog("System scan completed. Ready to clean selected junk.");
          return 100;
        }
        
        // Add dummy diagnostic log steps
        if (next === 20) addLog("Scanning /tmp directory...");
        if (next === 40) addLog("Scanning local application storage cache...");
        if (next === 65) addLog("Scanning old node_modules build artifacts...");
        if (next === 85) addLog("Calculating directory file maps...");

        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [status]);

  // Clean simulation
  useEffect(() => {
    if (status !== 'cleaning') return;

    const selectedJunk = cleaningItems.filter(i => i.checked);
    const totalBytesToClean = selectedJunk.reduce((acc, curr) => acc + curr.size, 0);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 8;
        if (next >= 100) {
          clearInterval(timer);
          setStatus('cleaned');
          const finalCleanedGB = (totalBytesToClean / (1024 * 1024 * 1024)).toFixed(2);
          setCleanedSize(finalCleanedGB);
          setFreeDisk(f => parseFloat((f + parseFloat(finalCleanedGB)).toFixed(2)));
          addLog(`SUCCESS: Cleanup finished. Purged ${finalCleanedGB} GB.`);
          
          // Disable cleaned items
          setCleaningItems(items => items.map(item => 
            item.checked ? { ...item, size: 0, checked: false } : item
          ));
          return 100;
        }

        // Add dummy purging logs
        if (next === 16) addLog(`Purging: ${selectedJunk[0]?.name || 'Cache Files'}...`);
        if (next === 48 && selectedJunk[1]) addLog(`Purging: ${selectedJunk[1].name}...`);
        if (next === 72 && selectedJunk[2]) addLog(`Purging: ${selectedJunk[2].name}...`);
        if (next === 88) addLog("Re-aligning file system index descriptors...");

        return next;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [status, cleaningItems]);

  const selectedTotalSize = cleaningItems
    .filter(i => i.checked)
    .reduce((acc, curr) => acc + curr.size, 0);

  const bytesToGB = (bytes) => {
    if (bytes === 0) return '0.00 GB';
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getDiskPercentage = () => {
    return ((totalDisk - freeDisk) / totalDisk) * 100;
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      
      {/* Configuration Panels */}
      <div style={{ flex: 1.2, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderRight: '1px solid var(--panel-border)', overflowY: 'auto' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>System Cleaner</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Free up active memory and storage files</span>
        </div>

        {/* Disk Usage Graph */}
        <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>Disk Space: Macintosh HD</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{freeDisk.toFixed(1)} GB Free / {totalDisk} GB</span>
          </div>
          
          {/* Progress Bar Container */}
          <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex' }}>
            <div style={{
              width: `${100 - getDiskPercentage()}%`,
              background: 'linear-gradient(90deg, #34c759, #30b0c7)',
              borderRadius: '8px 0 0 8px',
              transition: 'width 0.5s ease-in-out'
            }} />
            <div style={{
              width: `${getDiskPercentage()}%`,
              background: 'rgba(255,255,255,0.1)',
            }} />
          </div>
        </div>

        {/* Cleaning Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Target Files</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cleaningItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => handleToggle(item.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '10px',
                  background: item.checked ? 'rgba(0, 113, 227, 0.08)' : 'rgba(255,255,255,0.01)',
                  border: item.checked ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.03)',
                  cursor: (status === 'idle' || status === 'scan-done') ? 'pointer' : 'default',
                  opacity: (status !== 'idle' && status !== 'scan-done') ? 0.6 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: '600' }}>{item.name}</span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{bytesToGB(item.size)}</span>
                  </div>
                </div>
                
                {/* Custom Checkbox */}
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: item.checked ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.3)',
                  background: item.checked ? 'var(--accent-color)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s'
                }}>
                  {item.checked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cleaning Action trigger */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
          {status === 'idle' && (
            <button onClick={startScan} style={mainBtnStyle}>
              Start Deep Scan
            </button>
          )}

          {status === 'scanning' && (
            <button disabled style={{ ...mainBtnStyle, background: 'rgba(255,255,255,0.1)', cursor: 'not-allowed' }}>
              Scanning ({progress}%)
            </button>
          )}

          {status === 'scan-done' && (
            <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
              <button onClick={startScan} style={{ ...mainBtnStyle, flex: 0.6, background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                Re-Scan
              </button>
              <button onClick={startClean} disabled={selectedTotalSize === 0} style={{ ...mainBtnStyle, flex: 1.4, background: selectedTotalSize === 0 ? 'rgba(255,255,255,0.05)' : 'var(--accent-color)' }}>
                Clean Junk ({bytesToGB(selectedTotalSize)})
              </button>
            </div>
          )}

          {status === 'cleaning' && (
            <button disabled style={{ ...mainBtnStyle, background: 'rgba(255,255,255,0.1)', cursor: 'not-allowed' }}>
              Cleaning File Structures ({progress}%)
            </button>
          )}

          {status === 'cleaned' && (
            <button onClick={() => setStatus('idle')} style={{ ...mainBtnStyle, background: '#34c759' }}>
              Reset Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Terminal Logging / Console Side */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Operation Console Log</span>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontFamily: 'var(--font-mono)' }}>LOGGING ACTIVE</span>
        </div>

        {/* Cleaned Banner state */}
        {status === 'cleaned' && (
          <div className="glass" style={{ padding: '16px', borderRadius: '10px', background: 'rgba(52, 199, 89, 0.1)', border: '1px solid #34c759', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '28px' }}>🎉</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#34c759' }}>System Cleaned!</span>
            <span style={{ fontSize: '11px', opacity: 0.8 }}>Saved {cleanedSize} GB of workspace disk storage.</span>
          </div>
        )}

        {/* Scan/Clean progress loader */}
        {(status === 'scanning' || status === 'cleaning') && (
          <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-color)', transition: 'width 0.1s ease' }} />
          </div>
        )}

        {/* Console Log Rows */}
        <div style={{
          flex: 1,
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '10px',
          border: '1px solid var(--panel-border)',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#34c759',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {consoleLogs.length === 0 ? (
            <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>System idle. Trigger scan to debug cache.</span>
          ) : (
            consoleLogs.map((log, idx) => (
              <div key={idx} style={{ lineBreak: 'anywhere' }}>{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const mainBtnStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: 'var(--accent-color)',
  color: '#fff',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
