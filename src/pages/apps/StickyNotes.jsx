import React, { useState, useEffect } from 'react';

const NOTE_COLORS = [
  { id: 'yellow', bg: 'rgba(255, 204, 0, 0.15)', border: '#ffcc00', text: '#ffcc00' },
  { id: 'cyan', bg: 'rgba(10, 132, 255, 0.15)', border: '#0a84ff', text: '#0a84ff' },
  { id: 'green', bg: 'rgba(52, 199, 89, 0.15)', border: '#34c759', text: '#34c759' },
  { id: 'pink', bg: 'rgba(255, 45, 85, 0.15)', border: '#ff2d55', text: '#ff2d55' },
  { id: 'purple', bg: 'rgba(175, 82, 222, 0.15)', border: '#af52de', text: '#af52de' }
];

export default function StickyNotes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('arverse_sticky_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Call Kabir regarding Film storyboard reels.', colorId: 'yellow' },
      { id: '2', text: 'Need to research Web Audio procedural synth filters.', colorId: 'cyan' },
      { id: '3', text: 'Build the launchpad dashboard grid.', colorId: 'green' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('arverse_sticky_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (colorId = 'yellow') => {
    const newNote = {
      id: `sticky-${Date.now()}`,
      text: 'New sticky note. Double click or click to edit.',
      colorId
    };
    setNotes(prev => [...prev, newNote]);
  };

  const handleEditNoteText = (id, newText) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, text: newText } : note
    ));
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleChangeNoteColor = (id, colorId) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, colorId } : note
    ));
  };

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowY: 'auto', padding: '24px', gap: '20px' }}>
      
      {/* Sticky Notes Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Sticky Notes</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Add colorful floating stickies to draft workspace ideas</span>
        </div>

        {/* Color Palette selectors for new note */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Add Note:</span>
          {NOTE_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => handleAddNote(c.id)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: c.border,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                transition: 'transform 0.1s'
              }}
              title={`Add ${c.id} note`}
              className="sticky-color-picker-btn"
            />
          ))}
        </div>
      </div>

      {/* Bulletin Board Grid */}
      {notes.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', border: '1px dashed var(--panel-border)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '32px', marginBottom: '8px' }}>📝</span>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>No notes on the board</span>
          <span style={{ fontSize: '10.5px' }}>Click any colored circle above to pin a note.</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {notes.map(note => {
            const colorDef = NOTE_COLORS.find(c => c.id === note.colorId) || NOTE_COLORS[0];
            
            return (
              <div 
                key={note.id}
                style={{
                  background: colorDef.bg,
                  border: `1px solid ${colorDef.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '140px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                {/* Note Control row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Miniature color changers inside note */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {NOTE_COLORS.map(c => (
                      <div 
                        key={c.id}
                        onClick={() => handleChangeNoteColor(note.id, c.id)}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: c.border,
                          cursor: 'pointer',
                          opacity: note.colorId === c.id ? 1 : 0.4
                        }}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      opacity: 0.5,
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                    title="Remove note"
                  >
                    ✕
                  </button>
                </div>

                {/* Text area input field */}
                <textarea
                  value={note.text}
                  onChange={(e) => handleEditNoteText(note.id, e.target.value)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    resize: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '12.5px',
                    lineHeight: '1.4',
                    padding: 0
                  }}
                />

                <span style={{ fontSize: '9px', color: 'var(--text-secondary)', alignSelf: 'flex-end', opacity: 0.6 }}>
                  Edited
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
