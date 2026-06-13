import React, { useState, useEffect, useRef } from 'react';

const PALETTE = [
  '#ff3b30', '#ff9500', '#ffcc00', '#34c759', 
  '#0071e7', '#af52de', '#ff2d55', '#ffffff', 
  '#8e8e93', '#1c1c1e', '#5856d6', '#000000'
];

export default function PixelPaint() {
  const [gridSize, setGridSize] = useState(16); // 16x16 grid
  const [grid, setGrid] = useState(() => Array(16 * 16).fill('#transparent'));
  const [currentColor, setCurrentColor] = useState('#0071e7');
  const [activeTool, setActiveTool] = useState('pencil'); // pencil, eraser
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [savedArts, setSavedArts] = useState(() => {
    const saved = localStorage.getItem('arverse_paint_gallery');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('arverse_paint_gallery', JSON.stringify(savedArts));
  }, [savedArts]);

  const handleCellPaint = (index) => {
    const color = activeTool === 'pencil' ? currentColor : 'transparent';
    setGrid(prev => {
      const next = [...prev];
      next[index] = color;
      return next;
    });
  };

  const handleCellMouseEnter = (index) => {
    if (isMouseDown) {
      handleCellPaint(index);
    }
  };

  const clearGrid = () => {
    setGrid(Array(gridSize * gridSize).fill('transparent'));
  };

  const saveToGallery = () => {
    const title = prompt("Enter artwork name:") || `Artwork-${Date.now()}`;
    const newArt = {
      id: `art-${Date.now()}`,
      title,
      grid: [...grid],
      gridSize
    };
    setSavedArts(prev => [newArt, ...prev]);
  };

  const loadArt = (art) => {
    setGrid(art.grid);
    setGridSize(art.gridSize);
  };

  const deleteArt = (id, e) => {
    e.stopPropagation();
    setSavedArts(prev => prev.filter(a => a.id !== id));
  };

  // Export grid to standard canvas and download as PNG
  const downloadArtwork = () => {
    const canvas = document.createElement('canvas');
    const scale = 20; // 20px per pixel cell
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    grid.forEach((color, idx) => {
      const x = (idx % gridSize) * scale;
      const y = Math.floor(idx / gridSize) * scale;
      if (color === 'transparent') {
        // Transparent checkerboard fill
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, scale, scale);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, scale, scale);
      }
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pixel-art-${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      
      {/* Editor Main Canvas Side */}
      <div 
        style={{ flex: 1.5, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--panel-border)', overflowY: 'auto' }}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Pixel Art Studio</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Click or drag to paint 16x16 matrix grids</span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveTool('pencil')} 
              style={{ ...toolBtnStyle, background: activeTool === 'pencil' ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)', border: activeTool === 'pencil' ? '1px solid var(--accent-color)' : '1px solid var(--panel-border)' }}
            >
              ✏️ Pencil
            </button>
            <button 
              onClick={() => setActiveTool('eraser')} 
              style={{ ...toolBtnStyle, background: activeTool === 'eraser' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', border: activeTool === 'eraser' ? '1px solid #fff' : '1px solid var(--panel-border)' }}
            >
              🧼 Eraser
            </button>
            <button onClick={clearGrid} style={{ ...toolBtnStyle, background: 'rgba(255,59,48,0.1)', color: '#ff3b30', border: '1px solid rgba(255,59,48,0.2)' }}>
              Reset
            </button>
          </div>
        </div>

        {/* Pixel Art Drawing Grid Container */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: '320px',
            height: '320px',
            background: '#0d0d12',
            border: '2px solid var(--panel-border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            cursor: 'crosshair',
            userSelect: 'none'
          }}
        >
          {grid.map((color, idx) => {
            const isTransparent = color === 'transparent';
            // Alternating checkerboard patterns for transparent layers
            const isEvenRow = Math.floor(idx / gridSize) % 2 === 0;
            const isEvenCol = (idx % gridSize) % 2 === 0;
            const checkBg = (isEvenRow === isEvenCol) ? '#181920' : '#111217';

            return (
              <div 
                key={idx}
                onMouseDown={() => handleCellPaint(idx)}
                onMouseEnter={() => handleCellMouseEnter(idx)}
                style={{
                  background: isTransparent ? checkBg : color,
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  boxSizing: 'border-box'
                }}
              />
            );
          })}
        </div>

        {/* Color Palette controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', width: '320px' }}>
          {PALETTE.map(c => (
            <div 
              key={c}
              onClick={() => {
                setCurrentColor(c);
                setActiveTool('pencil');
              }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: c,
                border: currentColor === c && activeTool === 'pencil' ? '2.5px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                boxShadow: currentColor === c ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                transition: 'all 0.15s'
              }}
            />
          ))}
          
          {/* Custom picker */}
          <input 
            type="color" 
            value={currentColor} 
            onChange={(e) => {
              setCurrentColor(e.target.value);
              setActiveTool('pencil');
            }}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              background: 'none',
              cursor: 'pointer'
            }}
            title="Custom Hex Picker"
          />
        </div>
      </div>

      {/* Gallery & Export Side */}
      <div style={{ flex: 1.1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(0,0,0,0.02)', overflowY: 'auto' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0' }}>Gallery & Actions</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Export code or save pixel boards</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={saveToGallery} style={actionBtnStyle}>
            💾 Save Art
          </button>
          <button onClick={downloadArtwork} style={{ ...actionBtnStyle, background: 'var(--accent-color)', color: '#fff' }}>
            📥 Download PNG
          </button>
        </div>

        {/* Gallery List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Saved Artworks ({savedArts.length})</span>
          
          {savedArts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-secondary)', border: '1px dashed var(--panel-border)', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px' }}>No saved artwork yet. Click Save Art to archive drawings.</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {savedArts.map(art => (
                <div 
                  key={art.id}
                  onClick={() => loadArt(art)}
                  className="glass art-card-grid"
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--panel-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    position: 'relative'
                  }}
                >
                  {/* Thumbnail mini preview */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(16, 1fr)',
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    background: '#111'
                  }}>
                    {art.grid.map((c, i) => (
                      <div key={i} style={{ background: c === 'transparent' ? '#1c1d25' : c }} />
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75px' }}>{art.title}</span>
                    <button 
                      onClick={(e) => deleteArt(art.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,59,48,0.7)',
                        cursor: 'pointer',
                        padding: '2px',
                        fontSize: '11px'
                      }}
                      title="Delete artwork"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const toolBtnStyle = {
  padding: '6px 12px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '11.5px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  transition: 'all 0.15s'
};

const actionBtnStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid var(--panel-border)',
  background: 'rgba(255,255,255,0.02)',
  color: 'var(--text-primary)',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s'
};
