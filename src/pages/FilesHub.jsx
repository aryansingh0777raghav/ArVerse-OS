import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function FilesHub() {
  const { files, addFile, toggleFavoriteFile } = useAppState();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const categories = ['All', 'Images', 'Videos', 'Documents', 'Exports', 'Source Code', 'Assets'];

  const filteredFiles = files.filter(f => {
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Mock Dropzone File Uploader
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      
      // Determine matching category
      let category = 'Documents';
      if (file.type.startsWith('image/')) category = 'Images';
      else if (file.type.startsWith('video/')) category = 'Videos';
      else if (file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.py')) category = 'Source Code';
      
      // Convert size to string readable
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;

      // Read file content for preview if text
      const reader = new FileReader();
      reader.onload = (event) => {
        addFile({
          name: file.name,
          category: category,
          size: sizeStr,
          path: `/Imports/${file.name}`,
          content: event.target.result || 'Binary content / No preview'
        });
      };
      
      if (category === 'Images' || category === 'Videos') {
        // Mock links for assets preview
        addFile({
          name: file.name,
          category: category,
          size: sizeStr,
          path: `/Imports/${file.name}`,
          content: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&auto=format&fit=crop&q=60'
        });
      } else {
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)' }}>
      
      {/* LEFT: Category lists */}
      <div style={{
        width: '180px',
        borderRight: '1px solid var(--panel-border)',
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        background: 'rgba(0,0,0,0.01)'
      }}>
        <h4 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', padding: '0 8px 8px 8px' }}>
          File Manager
        </h4>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeCategory === cat ? 'var(--panel-border)' : 'transparent',
              color: activeCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {cat === 'All' ? '🗄️ All Files' : cat === 'Images' ? '🖼️ Images' : cat === 'Videos' ? '🎥 Videos' : cat === 'Documents' ? '📝 Documents' : cat === 'Exports' ? '📤 Exports' : cat === 'Source Code' ? '💻 Source Code' : '📦 Assets'}
          </button>
        ))}
      </div>

      {/* MIDDLE: File Explorer Grid Dropzone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid var(--panel-border)',
          background: dragOver ? 'rgba(0,113,227,0.03)' : 'transparent',
          transition: 'background 0.2s'
        }}
      >
        {/* Search */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input 
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input"
            style={{ padding: '6px 12px', fontSize: '11px', width: '200px' }}
          />
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Drag and drop files to import</span>
        </div>

        {/* Files Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '16px', alignContent: 'flex-start' }}>
          {filteredFiles.map(file => (
            <div 
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="glass-card glass-card-hover"
              style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                background: selectedFile && selectedFile.id === file.id ? 'var(--card-hover-bg)' : 'var(--panel-bg)',
                border: selectedFile && selectedFile.id === file.id ? '1px solid var(--accent-color)' : '1px solid var(--panel-border)',
                gap: '8px',
                position: 'relative'
              }}
            >
              {/* Favorite Badge */}
              {file.isFavorite && (
                <span style={{ position: 'absolute', top: '4px', right: '6px', color: '#ffcc00', fontSize: '10px' }}>★</span>
              )}

              {/* Large Icon circle based on type */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: file.category === 'Images' ? 'rgba(0,113,227,0.1)' : file.category === 'Videos' ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px'
              }}>
                {file.category === 'Images' ? '🖼️' : file.category === 'Videos' ? '🎥' : file.category === 'Source Code' ? '💻' : '📄'}
              </div>

              <span style={{ fontSize: '11.5px', fontWeight: '600', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>
                {file.name}
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                {file.size}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: File Info & Viewer */}
      <div style={{ width: '280px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {selectedFile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <strong style={{ fontSize: '14px', maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedFile.name}
              </strong>
              <button 
                onClick={() => toggleFavoriteFile(selectedFile.id)}
                style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
              >
                {selectedFile.isFavorite ? '★' : '☆'}
              </button>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div>Path: <strong style={{ color: 'var(--text-primary)' }}>{selectedFile.path}</strong></div>
              <div>Size: <strong style={{ color: 'var(--text-primary)' }}>{selectedFile.size}</strong></div>
              <div>Imported: <strong style={{ color: 'var(--text-primary)' }}>{new Date(selectedFile.timestamp).toLocaleDateString()}</strong></div>
            </div>

            {/* Render Preview Viewer Panel */}
            <div style={{
              flex: 1,
              borderRadius: '8px',
              border: '1px solid var(--panel-border)',
              background: 'rgba(0,0,0,0.03)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {selectedFile.category === 'Images' ? (
                <img 
                  src={selectedFile.content} 
                  alt={selectedFile.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : selectedFile.category === 'Videos' ? (
                <video 
                  src={selectedFile.content} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                /* Text/Code Viewer Panel */
                <pre style={{
                  padding: '12px',
                  fontSize: '11px',
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  overflow: 'auto',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedFile.content}
                </pre>
              )}
            </div>

          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '11px', textAlign: 'center' }}>
            Select a file to inspect details and view live media
          </div>
        )}
      </div>

    </div>
  );
}
