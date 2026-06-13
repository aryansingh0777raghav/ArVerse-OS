import React, { useState, useEffect, useRef } from 'react';

export default function PomodoroTimer() {
  const [mode, setMode] = useState('pomodoro'); // pomodoro, short, long
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Refactor state context flows', done: false },
    { id: '2', text: 'Validate Vite bundler size constraints', done: true }
  ]);
  const [taskInput, setTaskInput] = useState('');

  const timerRef = useRef(null);

  const modeDurations = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  const handleModeChange = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modeDurations[newMode]);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            playAlertSound();
            
            if (mode === 'pomodoro') {
              setCompletedSessions(c => c + 1);
              alert("Focus session complete! Time for a short break.");
              handleModeChange('short');
            } else {
              alert("Break complete! Ready to focus?");
              handleModeChange('pomodoro');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, mode]);

  // Procedural notification sound using Web Audio API
  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 chord note
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5 chord note

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (err) {
      console.warn("Failed to trigger Web Audio beep:", err);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modeDurations[mode]);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setTasks(prev => [...prev, {
      id: `task-${Date.now()}`,
      text: taskInput.trim(),
      done: false
    }]);
    setTaskInput('');
  };

  const toggleTaskDone = (id) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // SVG Circular progress details
  const maxTime = modeDurations[mode];
  const radius = 90;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / maxTime) * circumference;

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      
      {/* Timer dial controls Left Side */}
      <div style={{ flex: 1.2, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--panel-border)', overflowY: 'auto' }}>
        
        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '2px', borderRadius: '20px', border: '1px solid var(--panel-border)' }}>
          {['pomodoro', 'short', 'long'].map(m => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                background: mode === m ? 'var(--accent-color)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {m === 'pomodoro' ? 'Focus' : m === 'short' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>

        {/* Circular SVG Timer */}
        <div style={{ position: 'relative', width: `${radius * 2}px', height: '${radius * 2}px` }}>
          <svg
            height={radius * 2}
            width={radius * 2}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          >
            {/* Background Circle */}
            <circle
              stroke="rgba(255,255,255,0.03)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Active Circle Progress */}
            <circle
              stroke={mode === 'pomodoro' ? 'var(--accent-color)' : '#34c759'}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          
          {/* Text time overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span style={{ fontSize: '32px', fontWeight: '200', letterSpacing: '-0.5px' }}>{formatTime(timeLeft)}</span>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {isActive ? 'Keep Focusing' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Start / Stop controls */}
        <div style={{ display: 'flex', gap: '12px', width: '200px' }}>
          <button 
            onClick={resetTimer} 
            style={{ ...controlBtnStyle, flex: 0.8, background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
          >
            Reset
          </button>
          <button 
            onClick={toggleTimer} 
            style={{ ...controlBtnStyle, flex: 1.2, background: isActive ? '#ff3b30' : 'var(--accent-color)', color: '#fff' }}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
        </div>

        {/* Sessions indicator summary */}
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Completed focus rounds: <strong>{completedSessions}</strong>
        </span>
      </div>

      {/* Task Checklist Side */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.02)', overflowY: 'auto' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0' }}>Focus List</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tasks under progress during Pomodoro</span>
        </div>

        {/* Add Task Input Form */}
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="text" 
            placeholder="Add task to focus on..." 
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--panel-border)',
              background: 'rgba(0,0,0,0.15)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            style={{
              padding: '0 14px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent-color)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            + Add
          </button>
        </form>

        {/* Checklist Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.map(t => (
            <div 
              key={t.id}
              onClick={() => toggleTaskDone(t.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                background: t.done ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--panel-border)',
                cursor: 'pointer',
                opacity: t.done ? 0.6 : 1,
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Simulated circle checkbox */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: t.done ? '1px solid #34c759' : '1px solid rgba(255,255,255,0.4)',
                  background: t.done ? '#34c759' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s'
                }}>
                  {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                
                <span style={{ 
                  fontSize: '12.5px', 
                  textDecoration: t.done ? 'line-through' : 'none',
                  color: t.done ? 'var(--text-secondary)' : 'var(--text-primary)'
                }}>{t.text}</span>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(t.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '4px'
                }}
                title="Remove task"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const controlBtnStyle = {
  padding: '10px',
  borderRadius: '10px',
  border: 'none',
  fontSize: '12.5px',
  fontWeight: '700',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.15s'
};
