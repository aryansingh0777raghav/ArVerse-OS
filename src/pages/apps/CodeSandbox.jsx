import React, { useState, useEffect, useRef } from 'react';

const PRESETS = {
  button: {
    title: 'Glassmorphic Button',
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, #1e1e24, #0d0e15);
    font-family: system-ui, sans-serif;
  }
  .glass-btn {
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .glass-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(0, 113, 227, 0.6);
    box-shadow: 0 8px 32px rgba(0, 113, 227, 0.3);
    transform: translateY(-2px);
  }
</style>
</head>
<body>
  <button class="glass-btn" onclick="alert('Hi from the sandbox!')">Click Me</button>
</body>
</html>`
  },
  clock: {
    title: 'Gradient Clock',
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: #0f1016;
    color: #fff;
    font-family: monospace;
  }
  .clock {
    font-size: 48px;
    font-weight: bold;
    background: linear-gradient(90deg, #0071e7, #34c759);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
  }
</style>
</head>
<body>
  <div class="clock" id="display">00:00:00</div>
  <script>
    function update() {
      const now = new Date();
      const time = now.toTimeString().split(' ')[0];
      document.getElementById('display').innerText = time;
    }
    setInterval(update, 1000);
    update();
  </script>
</body>
</html>`
  },
  card: {
    title: 'Dynamic Glow Card',
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: #05060b;
    font-family: system-ui, sans-serif;
  }
  .card {
    position: relative;
    width: 240px;
    height: 140px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 24px;
    color: #fff;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%);
    transition: transform 0.5s;
  }
  .card:hover::before {
    transform: translate(20px, 20px);
  }
  h3 { margin: 0 0 8px 0; font-size: 18px; }
  p { margin: 0; font-size: 13px; color: rgba(255,255,255,0.6); }
</style>
</head>
<body>
  <div class="card">
    <h3>ArVerse Labs</h3>
    <p>Move your mouse around this card to see the glowing reactive gradient shifting.</p>
  </div>
</body>
</html>`
  }
};

export default function CodeSandbox() {
  const [activePreset, setActivePreset] = useState('button');
  const [editorCode, setEditorCode] = useState(PRESETS.button.code);
  const [iframeSrc, setIframeSrc] = useState('');
  const [sandboxLogs, setSandboxLogs] = useState([]);
  
  const iframeRef = useRef(null);

  useEffect(() => {
    runCode();
  }, []);

  const runCode = () => {
    // Generate data URI or write to iframe directly
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Create custom script injection to capture console.log inside the iframe
    const consoleInterceptor = `
      <script>
        const _log = console.log;
        console.log = function(...args) {
          _log(...args);
          window.parent.postMessage({ type: 'SANDBOX_LOG', text: args.join(' ') }, '*');
        };
        window.onerror = function(message, source, lineno, colno, error) {
          window.parent.postMessage({ type: 'SANDBOX_ERROR', text: message + ' (line ' + lineno + ')' }, '*');
        };
      </script>
    `;

    const fullCode = editorCode.replace('<head>', `<head>${consoleInterceptor}`);
    
    // Inject source into iframe srcDoc
    iframe.srcdoc = fullCode;
    
    setSandboxLogs([]);
    addConsoleLog('Compiling bundle & launching web view...');
  };

  const addConsoleLog = (text, isError = false) => {
    setSandboxLogs(prev => [...prev, { id: Date.now() + Math.random(), text, isError }]);
  };

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'SANDBOX_LOG') {
        addConsoleLog(`[console] ${e.data.text}`);
      } else if (e.data?.type === 'SANDBOX_ERROR') {
        addConsoleLog(`[error] ${e.data.text}`, true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSelectPreset = (key) => {
    setActivePreset(key);
    setEditorCode(PRESETS[key].code);
    setSandboxLogs([]);
    
    // Auto run the loaded preset code
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.srcdoc = PRESETS[key].code;
    }
  };

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      
      {/* Sandbox Header ToolBar */}
      <div style={{
        height: '48px',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.05)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700' }}>⚡ Web Sandbox Playground</span>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '2px', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
            {Object.keys(PRESETS).map(key => (
              <button 
                key={key} 
                onClick={() => handleSelectPreset(key)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activePreset === key ? 'var(--accent-color)' : 'transparent',
                  color: activePreset === key ? '#fff' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {PRESETS[key].title}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={runCode}
          style={{
            padding: '6px 16px',
            background: 'var(--accent-color)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Run Sandbox
        </button>
      </div>

      {/* Editor & Web Preview Splitter Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', flex: 1, overflow: 'hidden' }}>
        
        {/* Code Editor Left Frame */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: 'rgba(0,0,0,0.1)', borderBottom: '1px solid var(--panel-border)' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.5px' }}>HTML/CSS Editor</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>index.html</span>
          </div>
          <textarea
            value={editorCode}
            onChange={(e) => setEditorCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              background: '#12131a',
              color: '#d4d4d4',
              fontFamily: 'Consolas, "Fira Code", monospace',
              fontSize: '12.5px',
              padding: '16px',
              border: 'none',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.5',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Live Preview & Console Logs right frame */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
          
          {/* Main Web View Frame container */}
          <div style={{ flex: 1.5, background: '#fff', position: 'relative' }}>
            <iframe 
              ref={iframeRef}
              title="Sandbox Web View Output"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#ffffff'
              }}
              sandbox="allow-scripts"
            />
          </div>

          {/* Sandbox diagnostic consoles */}
          <div style={{
            flex: 0.8,
            borderTop: '1px solid var(--panel-border)',
            background: '#0c0d12',
            color: '#a9b2c3',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Virtual Sandbox Console Logs</span>
              <button 
                onClick={() => setSandboxLogs([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontSize: '9px',
                  fontWeight: '600'
                }}
              >
                Clear
              </button>
            </div>
            
            <div style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              fontFamily: 'Consolas, monospace',
              fontSize: '11px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {sandboxLogs.length === 0 ? (
                <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>No console logs printed yet.</span>
              ) : (
                sandboxLogs.map(log => (
                  <div 
                    key={log.id} 
                    style={{ 
                      color: log.isError ? '#ff453a' : log.text.includes('Compiling') ? 'var(--accent-color)' : '#e5c07b',
                      lineBreak: 'anywhere'
                    }}
                  >
                    {log.text}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
