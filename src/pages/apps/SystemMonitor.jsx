import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../contexts/AppStateContext';

export default function SystemMonitor() {
  const { openWindows, portStatuses } = useAppState();
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(48);
  const [latency, setLatency] = useState(24);
  const cpuHistory = useRef(Array(40).fill(10));
  const canvasRef = useRef(null);

  // Simulate CPU, RAM, and Latency fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(prev => {
        const next = Math.max(5, Math.min(95, Math.round(prev + (Math.random() * 20 - 10))));
        cpuHistory.current.push(next);
        cpuHistory.current.shift();
        drawCpuGraph();
        return next;
      });

      setRam(prev => Math.max(30, Math.min(85, Math.round(prev + (Math.random() * 4 - 2)))));
      setLatency(prev => Math.max(8, Math.min(120, Math.round(prev + (Math.random() * 10 - 5)))));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Draw smooth CPU graph on Canvas
  const drawCpuGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 20; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw CPU Line
    const points = cpuHistory.current;
    ctx.strokeStyle = 'var(--accent-color)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const dx = canvas.width / (points.length - 1);
    points.forEach((val, idx) => {
      const x = idx * dx;
      const y = canvas.height - (val / 100) * canvas.height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill underneath the graph with a smooth gradient
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 113, 227, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 113, 227, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  useEffect(() => {
    drawCpuGraph();
  }, []);

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowY: 'auto', padding: '24px', gap: '20px' }}>
      
      {/* Top Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* CPU Card */}
        <div className="glass" style={metricCardStyle}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>CPU Usage</span>
          <span style={{ fontSize: '32px', fontWeight: '200', color: 'var(--accent-color)' }}>{cpu}%</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Model: Virtual 8-Core Processor</span>
        </div>

        {/* RAM Card */}
        <div className="glass" style={metricCardStyle}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>RAM Usage</span>
          <span style={{ fontSize: '32px', fontWeight: '200', color: '#34c759' }}>{ram}%</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Used: {(16 * (ram / 100)).toFixed(1)} GB / 16.0 GB</span>
        </div>

        {/* Network Ping latency */}
        <div className="glass" style={metricCardStyle}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Network latency</span>
          <span style={{ fontSize: '32px', fontWeight: '200', color: '#ff3b30' }}>{latency} ms</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Ping host: 127.0.0.1 (Localhost)</span>
        </div>
      </div>

      {/* Real-time CPU History Canvas Graph */}
      <div className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '700' }}>CPU History Graph</span>
        <canvas ref={canvasRef} width="600" height="120" style={{ width: '100%', height: '120px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)' }} />
      </div>

      {/* Split section: Processes vs Ports health */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Open Windows / Virtual Tasks */}
        <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '700' }}>Active Tasks / Windows ({openWindows.length})</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {openWindows.length === 0 ? (
              <span style={{ color: 'var(--text-secondary)', fontSize: '11.5px', fontStyle: 'italic' }}>No active user applications</span>
            ) : (
              openWindows.map(w => (
                <div key={w.id} style={taskRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px' }}>💻</span>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{w.title}</span>
                  </div>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '8px', background: 'rgba(0,113,227,0.12)', color: 'var(--accent-color)', fontWeight: '700' }}>
                    PID {w.zIndex + 100}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ports Monitor */}
        <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '700' }}>System Port Diagnoses</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { port: 5173, app: 'ArFt Builder', status: portStatuses[5173] },
              { port: 5174, app: 'ArLip Frontend', status: portStatuses[5174] },
              { port: 8000, app: 'ArCh API engine', status: portStatuses[8000] },
              { port: 8005, app: 'ArLip Backend', status: portStatuses[8005] }
            ].map(p => (
              <div key={p.port} style={portRowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ ...statusDotStyle, backgroundColor: p.status === 'active' ? '#34c759' : '#ff3b30' }} />
                  <span style={{ fontSize: '11.5px', fontWeight: '600' }}>{p.app}</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Port {p.port}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

const metricCardStyle = {
  padding: '16px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  background: 'rgba(0,0,0,0.05)',
  border: '1px solid var(--panel-border)'
};

const taskRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)'
};

const portRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 12px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid rgba(255, 255, 255, 0.03)'
};

const statusDotStyle = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  display: 'inline-block'
};
