import React, { useState, useEffect } from 'react';

const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Welcome to ArVerse OS',
    content: `# Welcome to Markdown Notepad!

This is a **lightweight**, *interactive* notepad app that parses markdown dynamically inside your workspace.

## Features
- Dynamic text-to-html live preview.
- Multi-note manager pane (saves directly to localStorage).
- Fast formatting.

### Code Example
\`\`\`javascript
const kernel = "ArVerse OS";
console.log("Welcome to " + kernel);
\`\`\`

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci
`
  },
  {
    id: 'note-2',
    title: 'Antigravity Plan',
    content: `# Antigravity Project SPEC

## Checklist
- [x] Set up Vite dev servers
- [x] Build scientific Calculator app
- [ ] Add retro Terminal shell
- [ ] Complete glassmorphic wallpapers repository
`
  }
];

export default function MarkdownNotepad() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('arverse_notepad_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || 'note-1');
  const [activeNoteContent, setActiveNoteContent] = useState('');
  const [activeNoteTitle, setActiveNoteTitle] = useState('');

  // Sync selected note content/title into editing states
  useEffect(() => {
    const activeNote = notes.find(n => n.id === activeNoteId);
    if (activeNote) {
      setActiveNoteContent(activeNote.content);
      setActiveNoteTitle(activeNote.title);
    }
  }, [activeNoteId]);

  // Save changes to localStorage on note edits
  useEffect(() => {
    localStorage.setItem('arverse_notepad_notes', JSON.stringify(notes));
  }, [notes]);

  const handleContentChange = (val) => {
    setActiveNoteContent(val);
    setNotes(prev => prev.map(n => 
      n.id === activeNoteId ? { ...n, content: val } : n
    ));
  };

  const handleTitleChange = (val) => {
    setActiveNoteTitle(val);
    setNotes(prev => prev.map(n => 
      n.id === activeNoteId ? { ...n, title: val } : n
    ));
  };

  const createNewNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '# Untitled\n\nStart typing here...'
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id, e) => {
    e.stopPropagation();
    if (notes.length <= 1) {
      alert("You must keep at least one note.");
      return;
    }
    const remainingNotes = notes.filter(n => n.id !== id);
    setNotes(remainingNotes);
    if (activeNoteId === id) {
      setActiveNoteId(remainingNotes[0].id);
    }
  };

  // Safe custom Markdown Parser
  const parseMarkdown = (md) => {
    if (!md) return '';

    let html = md
      // Escaping HTML entities to prevent XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks (multiline)
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px; font-family: monospace; overflow-x: auto; font-size: 11.5px; border: 1px solid rgba(255,255,255,0.05); color: #8cb4ff;"><code>${code.trim()}</code></pre>`;
    });

    // Blockquotes
    html = html.replace(/^\s*&gt;\s+(.*)$/gm, '<blockquote style="border-left: 3px solid var(--accent-color); margin: 8px 0; padding-left: 12px; color: var(--text-secondary); font-style: italic;">$1</blockquote>');

    // Headers
    html = html.replace(/^\s*###\s+(.*)$/gm, '<h4 style="margin: 12px 0 6px 0; font-size: 13px; font-weight: 700;">$1</h4>');
    html = html.replace(/^\s*##\s+(.*)$/gm, '<h3 style="margin: 16px 0 8px 0; font-size: 15px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;">$1</h3>');
    html = html.replace(/^\s*#\s+(.*)$/gm, '<h2 style="margin: 18px 0 10px 0; font-size: 18px; font-weight: 700;">$1</h2>');

    // Unordered Lists
    html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li style="margin-left: 16px; font-size: 12.5px; margin-bottom: 4px;">$1</li>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italics (*text* or _text_)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 11.5px;">$1</code>');

    // Links [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-color); text-decoration: none;">$1</a>');

    // Horizontal Rule
    html = html.replace(/^\s*---\s*$/gm, '<hr style="border: none; border-bottom: 1px solid rgba(255,255,255,0.08); margin: 16px 0;" />');

    // Line breaks
    html = html.split('\n').map(line => {
      // If the line is already a structural HTML element, return as is, otherwise wrap in paragraph if it's text
      if (line.trim().startsWith('<h') || line.trim().startsWith('<li') || line.trim().startsWith('<blockquote') || line.trim().startsWith('<pre') || line.trim().startsWith('<hr') || line.trim().startsWith('</') || line.trim() === '') {
        return line;
      }
      return `<p style="margin: 8px 0; font-size: 12.5px; line-height: 1.6; color: var(--text-primary);">${line}</p>`;
    }).join('\n');

    return html;
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      
      {/* Sidebar - Note List */}
      <div style={{
        width: '200px',
        borderRight: '1px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0,0,0,0.05)',
        flexShrink: 0
      }}>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)' }}>
          <span style={{ fontSize: '12px', fontWeight: '700' }}>My Notes</span>
          <button 
            onClick={createNewNote}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--accent-color)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            +
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {notes.map(n => (
            <div 
              key={n.id}
              onClick={() => setActiveNoteId(n.id)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeNoteId === n.id ? 'rgba(0, 113, 227, 0.12)' : 'transparent',
                border: activeNoteId === n.id ? '1px solid var(--accent-color)' : '1px solid transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              className="note-sidebar-item"
            >
              <span style={{
                fontSize: '12px',
                fontWeight: activeNoteId === n.id ? '600' : '500',
                color: activeNoteId === n.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '120px'
              }}>{n.title || 'Untitled'}</span>
              
              <button 
                onClick={(e) => deleteNote(n.id, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: activeNoteId === n.id ? 'block' : 'none'
                }}
                className="delete-note-sidebar-btn"
                title="Delete note"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Title Editor Header */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--panel-border)', display: 'flex', background: 'rgba(255,255,255,0.01)' }}>
          <input 
            type="text" 
            value={activeNoteTitle} 
            onChange={(e) => handleTitleChange(e.target.value)} 
            placeholder="Note Title"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontWeight: '700',
              fontFamily: 'inherit',
              width: '100%'
            }}
          />
        </div>

        {/* Text split editor/viewer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* Markdown input text area */}
          <textarea
            value={activeNoteContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="# Title..."
            style={{
              border: 'none',
              borderRight: '1px solid var(--panel-border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'Consolas, monospace',
              fontSize: '13px',
              padding: '20px',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.5',
              boxSizing: 'border-box',
              height: '100%'
            }}
          />

          {/* HTML rendered markdown preview pane */}
          <div 
            style={{
              padding: '20px',
              overflowY: 'auto',
              height: '100%',
              boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.02)'
            }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(activeNoteContent) }}
          />

        </div>

      </div>

    </div>
  );
}
