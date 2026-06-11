import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

// Initial Mock Activities
const initialActivities = [
  { id: 'act-1', action: 'Exported Scene 1 Video', app: 'ArLip', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'act-2', action: 'Generated UI Grid Component', app: 'ArFt', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 'act-3', action: 'Performed deep research on "Vite bundle size"', app: 'ArCh', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 'act-4', action: 'Updated memory module context', app: 'ArKon', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'act-5', action: 'Created draft for script "The Night of Life"', app: 'FilmStudio', timestamp: new Date(Date.now() - 3600000 * 28).toISOString() }
];

// Initial Mock Files
const initialFiles = [
  { id: 'file-1', name: 'storyboard_draft.jpg', category: 'Images', size: '2.4 MB', path: '/FilmProduction/storyboard_draft.jpg', isFavorite: true, timestamp: new Date(Date.now() - 86400000).toISOString(), content: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60' },
  { id: 'file-2', name: 'teaser_cut_render.mp4', category: 'Videos', size: '48.2 MB', path: '/Exports/teaser_cut_render.mp4', isFavorite: false, timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), content: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'file-3', name: 'script_scene_1.fountain', category: 'Documents', size: '15 KB', path: '/Scripts/script_scene_1.fountain', isFavorite: true, timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), content: 'INT. COFFEE SHOP - DAY\n\nARYAN is coding in front of a laptop, typing furiously.\n\nARYAN\n(muttering)\nAlmost there... the system connection works.\n\nSuddenly, the screen flashes green.\n\nARKON (V.O.)\nWelcome to ArVerse OS.' },
  { id: 'file-4', name: 'App.jsx', category: 'Source Code', size: '8.4 KB', path: '/src/App.jsx', isFavorite: false, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), content: 'import React from "react";\nimport BootScreen from "./components/BootScreen";\n\nexport default function App() {\n  return <BootScreen />;\n}' },
  { id: 'file-5', name: 'voice_command_grammar.json', category: 'Assets', size: '4.2 KB', path: '/ArKon/Assets/voice_command_grammar.json', isFavorite: false, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), content: '{\n  "commands": [\n    "Open ArLip",\n    "Launch ArFt",\n    "Trigger search engine",\n    "Toggle theme"\n  ]\n}' }
];

// Initial Mock Memory Vault Entries (Second Brain)
const initialVault = [
  { id: 'v-1', title: 'The Night of Life', category: 'Projects', content: 'A neo-noir film concept revolving around an AI assistant developer who realizes his AI model is logging activities of a fictional timeline.', tags: ['Film', 'Creative', 'Noir'], isFavorite: true, timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), relatedIds: ['v-2', 'v-3', 'v-4', 'file-1'] },
  { id: 'v-2', title: 'Main Character Sheet: Kabir', category: 'Characters', content: 'Kabir is a 28-year-old developer living in Gorakhpur. Reserved, obsessive, deeply passionate about filmmaking and cybernetic systems.', tags: ['Character', 'Noir'], isFavorite: true, timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), relatedIds: ['v-1'] },
  { id: 'v-3', title: 'Dialogue Block: Kabir & AI', category: 'Dialogues', content: 'KABIR: Are you scanning my directory?\nAI: I am only arranging your ideas, Kabir. You asked me to sync them. Remember?', tags: ['Dialogue', 'Script'], isFavorite: false, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), relatedIds: ['v-1', 'v-2'] },
  { id: 'v-4', title: 'Scene 1 Script Draft', category: 'Scripts', content: 'The scene introduces Kabir in a dark room illuminated by neon lights from three distinct monitors showing code grids.', tags: ['Script', 'Scene'], isFavorite: false, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), relatedIds: ['v-1'] },
  { id: 'v-5', title: 'Groq API Key Workspace Notes', category: 'Notes', content: 'Ensure the API keys are injected via local storage setting. The ArCh FastAPI and ArKon Python model will utilize local environment variables.', tags: ['Development', 'Config'], isFavorite: false, timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), relatedIds: [] },
  { id: 'v-6', title: 'Implement spotlight scroll list UI', category: 'Tasks', content: 'Build smooth keyboard navigation for Spotlight search list items.', tags: ['Code', 'UI'], isFavorite: false, timestamp: new Date(Date.now() - 3600000).toISOString(), relatedIds: [] }
];

export const AppStateProvider = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState('Personal');
  const [openWindows, setOpenWindows] = useState([]);
  const [vaultEntries, setVaultEntries] = useState(() => {
    const saved = localStorage.getItem('arverse_vault');
    return saved ? JSON.parse(saved) : initialVault;
  });
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('arverse_files');
    return saved ? JSON.parse(saved) : initialFiles;
  });
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('arverse_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });
  const [pinnedItems, setPinnedItems] = useState(['v-1', 'file-1', 'v-5']);
  
  // Local Ports Scanner Health state
  const [portStatuses, setPortStatuses] = useState({
    5173: 'checking', // ArFt
    5174: 'checking', // ArLip Frontend
    8000: 'checking', // ArCh API
    8005: 'checking'  // ArLip Backend
  });

  // Track window stack z-index
  const [maxZIndex, setMaxZIndex] = useState(10);

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('arverse_vault', JSON.stringify(vaultEntries));
  }, [vaultEntries]);

  useEffect(() => {
    localStorage.setItem('arverse_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('arverse_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = useCallback((action, app) => {
    setActivities(prev => {
      const newAct = {
        id: `act-${Date.now()}`,
        action,
        app,
        timestamp: new Date().toISOString()
      };
      return [newAct, ...prev].slice(0, 100); // cap logs at 100
    });
  }, []);

  // Scan local service ports dynamically
  const scanPorts = useCallback(async () => {
    const ports = [5173, 5174, 8000, 8005];
    const statuses = {};
    
    for (const port of ports) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        
        // no-cors mode allows verifying if something is running without throwing CORS blocks
        await fetch(`http://127.0.0.1:${port}/api/status`, { mode: 'no-cors', signal: controller.signal });
        clearTimeout(timeoutId);
        statuses[port] = 'active';
      } catch (err) {
        // If server responded or blocked CORS, it is listening. 
        // Only TypeError 'failed to fetch' / 'abort' indicates port is dead.
        if (err.name === 'AbortError') {
          statuses[port] = 'inactive';
        } else if (err.message && (err.message.includes('CORS') || err.message.includes('cors'))) {
          statuses[port] = 'active';
        } else {
          // Double check with a fallback simple root ping
          try {
            const controller = new AbortController();
            const fallbackId = setTimeout(() => controller.abort(), 800);
            await fetch(`http://127.0.0.1:${port}/`, { mode: 'no-cors', signal: controller.signal });
            clearTimeout(fallbackId);
            statuses[port] = 'active';
          } catch {
            statuses[port] = 'inactive';
          }
        }
      }
    }
    
    setPortStatuses(statuses);
  }, []);

  // Poll ports every 12 seconds
  useEffect(() => {
    scanPorts();
    const interval = setInterval(scanPorts, 12000);
    return () => clearInterval(interval);
  }, [scanPorts]);

  // Window Management Actions
  const openWindow = (id, title, query = '') => {
    // Automatically trigger launch API for local apps
    if (['arkon', 'arlip', 'arft', 'arch'].includes(id)) {
      addActivity(`Launched ${title || id} locally`, 'System');
      const url = query
        ? `/api/launch-app?app=${id}&q=${encodeURIComponent(query)}`
        : `/api/launch-app?app=${id}`;
      fetch(url).catch(err => console.warn("Failed to ping app launcher:", err));
      return; // Do not open window inside ArVerse OS dashboard
    }


    addActivity(`Opened ${title || id}`, 'System');
    setOpenWindows(prev => {
      const existing = prev.find(w => w.id === id);
      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);

      if (existing) {
        // Bring to front and un-minimize
        return prev.map(w => 
          w.id === id 
            ? { ...w, isMinimized: false, zIndex: nextZ } 
            : w
        );
      }

      // Add a fresh window instance with default macOS window dimensions
      const defaultW = Math.min(1000, window.innerWidth - 60);
      const defaultH = Math.min(680, window.innerHeight - 120);
      const defaultX = 50 + (prev.length * 30) % 200;
      const defaultY = 60 + (prev.length * 20) % 150;

      return [...prev, {
        id,
        title: title || id.charAt(0).toUpperCase() + id.slice(1),
        isMinimized: false,
        isMaximized: false,
        x: defaultX,
        y: defaultY,
        w: defaultW,
        h: defaultH,
        zIndex: nextZ
      }];
    });
  };

  const closeWindow = (id) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const maximizeWindow = (id) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const focusWindow = (id) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w
    ));
  };

  const updateWindowPos = (id, x, y) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  };

  const updateWindowSize = (id, w, h) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, w, h } : w
    ));
  };

  // Memory Vault Actions
  const addVaultEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isFavorite: entry.isFavorite || false,
      relatedIds: entry.relatedIds || []
    };
    setVaultEntries(prev => [newEntry, ...prev]);
    addActivity(`Created ${entry.category} "${entry.title}"`, 'MemoryVault');
    return newEntry;
  };

  const updateVaultEntry = (id, updatedFields) => {
    setVaultEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updatedFields, timestamp: new Date().toISOString() } : entry
    ));
    addActivity(`Updated Vault Entry "${updatedFields.title || id}"`, 'MemoryVault');
  };

  const deleteVaultEntry = (id) => {
    const entry = vaultEntries.find(e => e.id === id);
    setVaultEntries(prev => prev.filter(entry => entry.id !== id));
    if (entry) {
      addActivity(`Deleted ${entry.category} "${entry.title}"`, 'MemoryVault');
    }
  };

  const toggleFavoriteVault = (id) => {
    setVaultEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
    ));
  };

  // Files Hub Actions
  const addFile = (file) => {
    const newFile = {
      ...file,
      id: `file-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isFavorite: false
    };
    setFiles(prev => [newFile, ...prev]);
    addActivity(`Uploaded file "${file.name}"`, 'FilesHub');
  };

  const toggleFavoriteFile = (id) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, isFavorite: !file.isFavorite } : file
    ));
  };

  return (
    <AppStateContext.Provider
      value={{
        activeWorkspace,
        setActiveWorkspace,
        openWindows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPos,
        updateWindowSize,
        vaultEntries,
        addVaultEntry,
        updateVaultEntry,
        deleteVaultEntry,
        toggleFavoriteVault,
        files,
        addFile,
        toggleFavoriteFile,
        activities,
        addActivity,
        pinnedItems,
        setPinnedItems,
        portStatuses,
        scanPorts
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
