import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';

export default function MemoryVault() {
  const { vaultEntries, addVaultEntry, updateVaultEntry, deleteVaultEntry, toggleFavoriteVault } = useAppState();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [graphMode, setGraphMode] = useState(false);

  // Form states for creating a new vault entry
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Notes');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const categories = ['All', 'Projects', 'Ideas', 'Notes', 'Tasks', 'Scripts', 'Characters', 'Dialogues'];

  const filteredEntries = vaultEntries.filter(entry => {
    const matchesTab = activeTab === 'All' || entry.category === activeTab;
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase()) || 
                          entry.content.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    addVaultEntry({
      title: newTitle,
      category: newCategory,
      content: newContent,
      tags: tagsArray
    });

    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  // Coordinates mapping generator for Knowledge Graph SVG
  const generateGraphNodes = () => {
    const projectNode = vaultEntries.find(e => e.category === 'Projects');
    if (!projectNode) return [];

    const related = vaultEntries.filter(e => projectNode.relatedIds.includes(e.id) || e.id === projectNode.id);
    const centerX = 280;
    const centerY = 200;
    
    return related.map((node, idx) => {
      if (node.id === projectNode.id) {
        return { ...node, x: centerX, y: centerY, isCenter: true };
      }
      const angle = ((idx - 1) * 2 * Math.PI) / (related.length - 1);
      const radius = 120;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        isCenter: false
      };
    });
  };

  const graphNodes = generateGraphNodes();

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)' }}>
      {/* Sub Header tabs & controls */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.01)'
      }}>
        {/* Toggle Mode */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="glass" 
            onClick={() => setGraphMode(false)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: !graphMode ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: !graphMode ? '#ffffff' : 'var(--text-primary)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '11px'
            }}
          >
            📋 List View
          </button>
          <button 
            className="glass" 
            onClick={() => setGraphMode(true)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: graphMode ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: graphMode ? '#ffffff' : 'var(--text-primary)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '11px'
            }}
          >
            🕸️ Knowledge Graph
          </button>
        </div>

        {/* Search */}
        {!graphMode && (
          <input 
            type="text"
            placeholder="Search second brain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input"
            style={{ padding: '6px 12px', fontSize: '11px', width: '200px' }}
          />
        )}

        <button 
          className="glass-button glass-button-primary"
          onClick={() => setIsCreating(true)}
          style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px' }}
        >
          + Add Entry
        </button>
      </div>

      {/* Main Layout Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* LEFT COLUMN: List / Graph view */}
        <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid var(--panel-border)', position: 'relative' }}>
          {isCreating ? (
            /* Creation Form */
            <form onSubmit={handleCreateSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>New Vault Memory</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600' }}>Title</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="glass-input" style={{ fontSize: '12px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600' }}>Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="glass-input" style={{ fontSize: '12px', height: '38px' }}>
                    {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: '600' }}>Content</label>
                <textarea rows="4" value={newContent} onChange={(e) => setNewContent(e.target.value)} className="glass-input" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: '600' }}>Tags (comma separated)</label>
                <input type="text" placeholder="e.g. film, writing, config" value={newTags} onChange={(e) => setNewTags(e.target.value)} className="glass-input" style={{ fontSize: '12px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="glass-button glass-button-primary">Save Memory</button>
                <button type="button" className="glass-button" onClick={() => setIsCreating(false)}>Cancel</button>
              </div>
            </form>
          ) : graphMode ? (
            /* Knowledge Graph Visualizer */
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
              <svg width="100%" height="340" style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                {/* SVG Connections Lines */}
                {graphNodes.map(node => {
                  if (node.isCenter) return null;
                  const center = graphNodes.find(n => n.isCenter);
                  if (!center) return null;
                  return (
                    <line 
                      key={`line-${node.id}`} 
                      x1={center.x} 
                      y1={center.y} 
                      x2={node.x} 
                      y2={node.y} 
                      stroke="var(--panel-border)" 
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* SVG Nodes Circles */}
                {graphNodes.map(node => (
                  <g 
                    key={node.id} 
                    className="clickable"
                    onClick={() => setSelectedEntry(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={node.isCenter ? 24 : 16} 
                      fill={node.isCenter ? 'var(--accent-color)' : 'var(--panel-border)'} 
                      stroke={selectedEntry && selectedEntry.id === node.id ? '#ffffff' : 'var(--panel-border)'}
                      strokeWidth="2"
                    />
                    <text 
                      x={node.x} 
                      y={node.y + (node.isCenter ? 38 : 28)} 
                      textAnchor="middle" 
                      fill="var(--text-primary)" 
                      fontSize="9px" 
                      fontWeight="600"
                    >
                      {node.title.substring(0, 16)}
                    </text>
                  </g>
                ))}
              </svg>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Nodes indicate relational files linked to Project: <strong>The Night of Life</strong>. Click nodes to inspect.
              </span>
            </div>
          ) : (
            /* Standard Categories & Table List */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '4px', padding: '12px 24px', overflowX: 'auto', borderBottom: '1px solid var(--panel-border)' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: 'none',
                      background: activeTab === cat ? 'var(--panel-border)' : 'transparent',
                      color: activeTab === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredEntries.map(entry => (
                  <div 
                    key={entry.id}
                    className="glass-card glass-card-hover"
                    onClick={() => setSelectedEntry(entry)}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: selectedEntry && selectedEntry.id === entry.id ? 'var(--card-hover-bg)' : 'var(--panel-bg)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{entry.title}</span>
                        {entry.isFavorite && <span style={{ color: '#ffcc00', fontSize: '12px' }}>★</span>}
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        {entry.category} • {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {entry.tags.map(t => (
                        <span key={t} style={{ fontSize: '9px', background: 'var(--panel-border)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Detail Drawer */}
        <div style={{ width: '280px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedEntry ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{selectedEntry.title}</h4>
                <button 
                  onClick={() => toggleFavoriteVault(selectedEntry.id)}
                  style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                >
                  {selectedEntry.isFavorite ? '★' : '☆'}
                </button>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div>Category: <strong style={{ color: 'var(--text-primary)' }}>{selectedEntry.category}</strong></div>
                <div>Created: <strong style={{ color: 'var(--text-primary)' }}>{new Date(selectedEntry.timestamp).toLocaleString()}</strong></div>
              </div>

              <div style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid var(--panel-border)',
                fontSize: '12px',
                lineHeight: '1.6',
                fontFamily: selectedEntry.category === 'Scripts' || selectedEntry.category === 'Dialogues' ? 'var(--font-script)' : 'var(--font-sans)',
                overflowY: 'auto'
              }}>
                {selectedEntry.content}
              </div>

              {/* Action operations */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => { deleteVaultEntry(selectedEntry.id); setSelectedEntry(null); }}
                  className="glass"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255,59,48,0.1)',
                    color: '#ff3b30',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                >
                  Delete Entry
                </button>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '11px', textAlign: 'center' }}>
              Select a note or node to view details
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
