import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function FilmStudio() {
  const { vaultEntries, addVaultEntry } = useAppState();
  const [activeTab, setActiveTab] = useState('Scripts');

  // Shot list state
  const [shots, setShots] = useState([
    { id: 's-1', scene: '1', shot: '1A', angle: 'Extreme Close Up', desc: 'Kabir typing on keyboard, screen reflected in glasses.', isDone: true },
    { id: 's-2', scene: '1', shot: '1B', angle: 'Medium Close Up', desc: 'Over the shoulder. Monitor flashing notification.', isDone: false },
    { id: 's-3', scene: '1', shot: '2A', angle: 'Wide Shot', desc: 'Room setup: three glowing monitors, dark room.', isDone: false },
    { id: 's-4', scene: '2', shot: '1A', angle: 'Medium Close Up', desc: 'Kabir speaking to microphone, audio waveforms on screen.', isDone: false }
  ]);

  const [newSceneNum, setNewSceneNum] = useState('');
  const [newShotNum, setNewShotNum] = useState('');
  const [newAngle, setNewAngle] = useState('Medium Shot');
  const [newDesc, setNewDesc] = useState('');

  // Character profiles
  const characters = vaultEntries.filter(e => e.category === 'Characters');
  const scriptEntries = vaultEntries.filter(e => e.category === 'Scripts');

  const handleAddShot = (e) => {
    e.preventDefault();
    if (!newSceneNum.trim() || !newShotNum.trim()) return;

    setShots(prev => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        scene: newSceneNum,
        shot: newShotNum,
        angle: newAngle,
        desc: newDesc,
        isDone: false
      }
    ]);
    setNewSceneNum('');
    setNewShotNum('');
    setNewDesc('');
  };

  const toggleShotDone = (id) => {
    setShots(prev => prev.map(s => s.id === id ? { ...s, isDone: !s.isDone } : s));
  };

  const calculatedProgress = () => {
    if (shots.length === 0) return 0;
    const completed = shots.filter(s => s.isDone).length;
    return Math.round((completed / shots.length) * 100);
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)' }}>
      {/* Sidebar Navigation */}
      <div style={{
        width: '180px',
        borderRight: '1px solid var(--panel-border)',
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(0,0,0,0.01)'
      }}>
        <h4 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', padding: '0 8px 8px 8px' }}>
          Film Studio
        </h4>
        {['Scripts', 'Characters DB', 'Shot List', 'Production Sync'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab ? 'var(--panel-border)' : 'transparent',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {tab === 'Scripts' ? '🎬 Scripts' : tab === 'Characters DB' ? '👥 Characters' : tab === 'Shot List' ? '📹 Shot List' : '📊 Progress Ring'}
          </button>
        ))}
      </div>

      {/* Main Studio Console Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Scripts Screenplay format */}
        {activeTab === 'Scripts' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '13px' }}>Screenplay Script Editor</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Courier Screenplay Format</span>
            </div>
            
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Draft List */}
              <div style={{ width: '220px', borderRight: '1px solid var(--panel-border)', overflowY: 'auto', padding: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>Drafts Pool</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {scriptEntries.map(s => (
                    <div key={s.id} className="glass-card" style={{ padding: '8px 12px', fontSize: '11.5px', cursor: 'default' }}>
                      <strong>{s.title}</strong>
                      <div style={{ fontSize: '9px', opacity: 0.7 }}>Scene Draft</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Script Text Editor */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
                <div className="glass" style={{
                  flex: 1,
                  padding: '30px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--panel-border)'
                }}>
                  <textarea 
                    defaultValue={`SCENE 1. INT. COFFEE SHOP - DAY

KABIR sits looking at the neon displays in front of him. A console flash green.

KABIR
Is the local API active?

ARKON (AI)
Connecting to port 8000. All databases are synced, Kabir.`}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontFamily: 'var(--font-script)',
                      fontSize: '13.5px',
                      lineHeight: '1.8',
                      color: 'var(--text-primary)',
                      resize: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Character Database */}
        {activeTab === 'Characters DB' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Character Bios Sheets</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {characters.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  No characters logged in Memory Vault. Add one to view biography grids.
                </div>
              ) : (
                characters.map(char => (
                  <div key={char.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff', fontWeight: '600' }}>
                        {char.title.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ fontSize: '13px' }}>{char.title}</strong>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Noir Film Cast</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '11.5px', lineHeight: '1.6', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.01)', padding: '10px', borderRadius: '6px' }}>
                      {char.content}
                    </p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {char.tags.map(t => (
                        <span key={t} style={{ fontSize: '9px', background: 'var(--panel-border)', padding: '2px 6px', borderRadius: '4px' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Shot List grid */}
        {activeTab === 'Shot List' && (
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Scene Shot List</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Completed: {shots.filter(s => s.isDone).length}/{shots.length} shots</span>
            </div>

            {/* Shots Table */}
            <div className="glass" style={{ overflowX: 'auto', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--panel-border)', borderBottom: '1px solid var(--panel-border)' }}>
                    <th style={{ padding: '10px' }}>Scene</th>
                    <th style={{ padding: '10px' }}>Shot</th>
                    <th style={{ padding: '10px' }}>Camera Angle</th>
                    <th style={{ padding: '10px' }}>Description</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Done</th>
                  </tr>
                </thead>
                <tbody>
                  {shots.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--panel-border)', background: s.isDone ? 'rgba(52, 199, 89, 0.03)' : 'transparent' }}>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{s.scene}</td>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{s.shot}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ background: 'var(--panel-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{s.angle}</span>
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{s.desc}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={s.isDone} 
                          onChange={() => toggleShotDone(s.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Shot Form */}
            <form onSubmit={handleAddShot} className="glass-card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '80px' }}>
                <label style={{ fontSize: '9px', fontWeight: '600' }}>Scene #</label>
                <input type="text" placeholder="e.g. 1" value={newSceneNum} onChange={(e) => setNewSceneNum(e.target.value)} required className="glass-input" style={{ padding: '6px', fontSize: '11px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '80px' }}>
                <label style={{ fontSize: '9px', fontWeight: '600' }}>Shot #</label>
                <input type="text" placeholder="e.g. 1C" value={newShotNum} onChange={(e) => setNewShotNum(e.target.value)} required className="glass-input" style={{ padding: '6px', fontSize: '11px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '130px' }}>
                <label style={{ fontSize: '9px', fontWeight: '600' }}>Angle</label>
                <select value={newAngle} onChange={(e) => setNewAngle(e.target.value)} className="glass-input" style={{ padding: '6px', fontSize: '11px', height: '32px' }}>
                  {['Medium Shot', 'Wide Shot', 'Close Up', 'Extreme Close Up', 'Two Shot', 'Pan Zoom'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '9px', fontWeight: '600' }}>Shot details description</label>
                <input type="text" placeholder="e.g. Camera follows Kabir walking..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="glass-input" style={{ padding: '6px', fontSize: '11px' }} />
              </div>
              <button type="submit" className="glass-button glass-button-primary" style={{ padding: '8px 14px', fontSize: '11px' }}>+ Add Shot</button>
            </form>
          </div>
        )}

        {/* Progress Tracker Ring */}
        {activeTab === 'Production Sync' && (
          <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Production Scene Completion Sync</h3>
            
            {/* Visual SVG Progress Ring */}
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="var(--panel-border)" strokeWidth="12" />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="none" 
                  stroke="var(--accent-color)" 
                  strokeWidth="12" 
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - calculatedProgress() / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '36px', fontWeight: '700' }}>{calculatedProgress()}%</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Completed</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', maxWidth: '320px' }}>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Progress calculated dynamically from verified Shot List checkboxes. All logs synced to Memory Vault nodes automatically.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
