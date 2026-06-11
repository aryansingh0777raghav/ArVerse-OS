import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function DeveloperConsole() {
  const { portStatuses, activities, scanPorts } = useAppState();
  const [cpuHistory, setCpuHistory] = useState(() => Array(20).fill(15));
  const [ramHistory, setRamHistory] = useState(() => Array(20).fill(42));
  const [storageUsed, setStorageUsed] = useState(0);

  const cpuCanvasRef = useRef(null);
  const ramCanvasRef = useRef(null);

  // Measure local storage size used in bytes
  useEffect(() => {
    let bytes = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        bytes += (localStorage[key].length + key.length) * 2; // approximation (UTF-16)
      }
    }
    setStorageUsed(Math.round(bytes / 1024)); // in KB
  }, [activities]);

  // Simulate active CPU/RAM readings loop
  useEffect(() => {
    const interval = setInterval(() => {
      // CPU fluctuations
      setCpuHistory(prev => {
        const nextVal = Math.max(5, Math.min(95, prev[prev.length - 1] + (Math.random() * 20 - 10)));
        return [...prev.slice(1), Math.round(nextVal)];
      });
      // RAM fluctuations
      setRamHistory(prev => {
        const nextVal = Math.max(30, Math.min(85, prev[prev.length - 1] + (Math.random() * 4 - 2)));
        return [...prev.slice(1), Math.round(nextVal)];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Draw Rolling Canvas Graphs
  const drawGraph = (canvas, dataHistory, strokeColor, label) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 20; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw data line
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const sliceWidth = width / (dataHistory.length - 1);
    dataHistory.forEach((val, idx) => {
      const x = idx * sliceWidth;
      // invert scale because canvas y starts from top
      const y = height - (val / 100) * (height - 10) - 5;
      
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw value tag
    ctx.fillStyle = 'var(--text-primary)';
    ctx.font = '10px var(--font-mono)';
    ctx.fillText(`${label}: ${dataHistory[dataHistory.length - 1]}%`, 10, 16);
  };

  useEffect(() => {
    drawGraph(cpuCanvasRef.current, cpuHistory, '#2997ff', 'CPU');
  }, [cpuHistory]);

  useEffect(() => {
    drawGraph(ramCanvasRef.current, ramHistory, '#34c759', 'RAM');
  }, [ramHistory]);

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1117', color: '#f0f6fc', fontFamily: 'var(--font-mono)' }}>
      {/* Dev Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#2997ff' }}>&gt;_</span>
          <span style={{ fontWeight: '600', fontSize: '13px' }}>System Developer Console</span>
        </div>
        <button 
          onClick={scanPorts}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          Scan Port Connections
        </button>
      </div>

      {/* Dev Body Grid */}
      <div style={{ flex: 1, padding: '20px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', overflowY: 'auto' }}>
        
        {/* Left Side: Services status & storage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Ports Health card */}
          <div className="glass" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase' }}>Port Connections Monitor</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {[
                { name: 'ArFt (Vite Frontend)', port: 5173, desc: 'React build server' },
                { name: 'ArLip (FastAPI Frontend)', port: 5174, desc: 'Creation page server' },
                { name: 'ArLip (FastAPI Backend)', port: 8005, desc: 'Media API endpoint' },
                { name: 'ArCh Search (Uvicorn API)', port: 8000, desc: 'Spotlight crawler API' }
              ].map(app => (
                <div key={app.port} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                  <div>
                    <strong>Port {app.port}</strong>
                    <div style={{ fontSize: '9px', color: '#8b949e' }}>{app.name}</div>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: '700',
                    background: portStatuses[app.port] === 'active' ? 'rgba(46, 160, 67, 0.15)' : 'rgba(248, 81, 73, 0.15)',
                    color: portStatuses[app.port] === 'active' ? '#58a6ff' : '#f85149'
                  }}>
                    {portStatuses[app.port] === 'active' ? 'LISTEN' : 'CLOSED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Capacity */}
          <div className="glass" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase' }}>Local Database Space</span>
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span>Storage Limit (5MB)</span>
                <span>{storageUsed} KB</span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(storageUsed / 5120) * 100}%`,
                  background: '#2997ff',
                  borderRadius: '3px'
                }} />
              </div>
              <span style={{ fontSize: '9px', color: '#8b949e', display: 'block', marginTop: '6px' }}>
                Storage includes Memory Vault JSON structures and custom wallpapers base64 payloads.
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Graph canvases & Activity logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Canvases grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="glass" style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <canvas ref={cpuCanvasRef} width="280" height="90" style={{ width: '100%', height: '90px' }} />
            </div>
            <div className="glass" style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <canvas ref={ramCanvasRef} width="280" height="90" style={{ width: '100%', height: '90px' }} />
            </div>
          </div>

          {/* Activity Console logs */}
          <div className="glass" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '140px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>Ecosystem Log Feed</span>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
              {activities.map(act => (
                <div key={act.id} style={{ fontSize: '10px', display: 'flex', gap: '12px' }}>
                  <span style={{ color: '#8b949e' }}>[{new Date(act.timestamp).toLocaleTimeString()}]</span>
                  <span style={{ color: '#ff7b72' }}>{act.app}:</span>
                  <span style={{ color: '#c9d1d9' }}>{act.action}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
