import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function Widgets() {
  const { activities } = useAppState();

  // Widget states
  const [widgets, setWidgets] = useState([
    { id: 'w-clock', name: 'Analogue Clock', category: 'Productivity', isPinned: true, size: 'medium' },
    { id: 'w-todo', name: 'Task Checklist', category: 'Productivity', isPinned: true, size: 'large' },
    { id: 'w-weather', name: 'Weather Forecast', category: 'Productivity', isPinned: true, size: 'small' },
    { id: 'w-cpu', name: 'CPU Usage Monitor', category: 'Developer', isPinned: true, size: 'small' },
    { id: 'w-habits', name: 'Habit Tracker', category: 'Personal', isPinned: false, size: 'medium' },
    { id: 'w-quotes', name: 'Daily Quote Card', category: 'Personal', isPinned: true, size: 'medium' }
  ]);

  const [todoList, setTodoList] = useState([
    { id: 1, text: 'Review film screenplay scenes', done: true },
    { id: 2, text: 'Compile Vite server bundle size', done: false },
    { id: 3, text: 'Check local port API scan pings', done: false }
  ]);

  const [newTodo, setNewTodo] = useState('');

  const handleToggleTodo = (id) => {
    setTodoList(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodoList(prev => [...prev, { id: Date.now(), text: newTodo, done: false }]);
    setNewTodo('');
  };

  const togglePinWidget = (id) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isPinned: !w.isPinned } : w));
  };

  const resizeWidget = (id, size) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  };

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)' }}>
      {/* Sub Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.01)'
      }}>
        <span style={{ fontWeight: '700', fontSize: '14px' }}>Widgets Workspace Dashboard</span>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Customize sizes and pins dynamically</span>
      </div>

      {/* Grid Desktop Dashboard */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', alignContent: 'flex-start' }}>
        {widgets.map(w => {
          const isPinned = w.isPinned;
          const size = w.size;

          return (
            <div 
              key={w.id}
              className="glass-card"
              style={{
                gridColumn: size === 'large' ? 'span 2' : 'span 1',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--panel-border)',
                minHeight: '160px',
                position: 'relative'
              }}
            >
              {/* Header Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  {w.category} • {w.name}
                </span>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  {/* Size toggler */}
                  <button 
                    onClick={() => resizeWidget(w.id, size === 'small' ? 'medium' : size === 'medium' ? 'large' : 'small')}
                    style={{ background: 'none', border: 'none', fontSize: '10px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    title="Resize Widget"
                  >
                    📐
                  </button>
                  <button 
                    onClick={() => togglePinWidget(w.id)}
                    style={{ background: 'none', border: 'none', fontSize: '10px', color: isPinned ? 'var(--accent-color)' : 'var(--text-secondary)', cursor: 'pointer' }}
                    title={isPinned ? 'Unpin' : 'Pin Widget'}
                  >
                    {isPinned ? '📌' : '📎'}
                  </button>
                </div>
              </div>

              {/* RENDER SPECIFIC WIDGETS */}
              {w.id === 'w-clock' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '300', color: 'var(--text-primary)' }}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Gorakhpur, India</span>
                </div>
              )}

              {w.id === 'w-todo' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                    {todoList.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <input type="checkbox" checked={t.done} onChange={() => handleToggleTodo(t.id)} style={{ cursor: 'pointer' }} />
                        <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{t.text}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                    <input type="text" placeholder="Add widget item..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} className="glass-input" style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }} />
                    <button type="submit" className="glass-button" style={{ padding: '4px 10px', fontSize: '11px' }}>+</button>
                  </form>
                </div>
              )}

              {w.id === 'w-weather' && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '36px' }}>⛅</span>
                  <div>
                    <span style={{ fontSize: '22px', fontWeight: '300' }}>32°C</span>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Scattered Clouds</div>
                  </div>
                </div>
              )}

              {w.id === 'w-cpu' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span>Ecosystem Health</span>
                    <strong>Excellent</strong>
                  </div>
                  <div style={{ height: '6px', background: 'var(--panel-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '12%', background: '#34c759' }} />
                  </div>
                  <span style={{ fontSize: '8.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>Port scanners running in sandbox background</span>
                </div>
              )}

              {w.id === 'w-quotes' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontStyle: 'italic', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  "Simplicity is the ultimate sophistication."
                </div>
              )}

              {w.id === 'w-habits' && (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  {['Code 💻', 'Workout 🏋️', 'Read 📖'].map(h => (
                    <div key={h} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                      <span>{h}</span>
                      <input type="checkbox" style={{ cursor: 'pointer' }} />
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
