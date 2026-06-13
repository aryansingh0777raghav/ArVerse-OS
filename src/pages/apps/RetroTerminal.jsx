import React, { useState, useEffect, useRef } from 'react';

export default function RetroTerminal() {
  const [history, setHistory] = useState([
    { text: 'ArVerse Shell v1.0.4 (tty/1)', type: 'system' },
    { text: 'Type "help" for a list of available commands.', type: 'system' },
    { text: '', type: 'system' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [termTheme, setTermTheme] = useState('green'); // green, amber, cyan, Matrix
  const [matrixActive, setMatrixActive] = useState(false);
  
  const bottomRef = useRef(null);
  const canvasRef = useRef(null);

  const commandHistory = useRef([]);
  const historyIdx = useRef(-1);

  const mockFiles = {
    'kernel_sys.log': 'SYSTEM DEPLOYED ON LOCALHOST\nKERN_VER: 2026.06.13\nSTATUS: ONLINE\nMEMORY_STATE: COMPACTED',
    'about.txt': 'ArVerse OS\nAn elegant glassmorphic workspace operating system built on React & Vite.\nCreated by Aryan Raghav.',
    'secret.md': '# ACCESS RESTRICTED\nProject Antigravity is active.\n"The Night of Life" film script is synchronized with local storage memory vaults.'
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, matrixActive]);

  // Matrix Digital Rain effect
  useEffect(() => {
    if (!matrixActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const rainDrops = Array.from({ length: columns }).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = termTheme === 'amber' ? '#ff9500' : termTheme === 'cyan' ? '#0071e7' : '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 30);

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [matrixActive, termTheme]);

  const executeCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    commandHistory.current.push(trimmed);
    historyIdx.current = commandHistory.current.length;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLogs = [{ text: `arverse@os:~$ ${trimmed}`, type: 'input' }];

    switch (command) {
      case 'help':
        newLogs.push({ text: 'Available commands:', type: 'system' });
        newLogs.push({ text: '  ls            - List directory files', type: 'system' });
        newLogs.push({ text: '  cat [file]    - Read contents of a file', type: 'system' });
        newLogs.push({ text: '  neofetch      - Display system metadata summary', type: 'system' });
        newLogs.push({ text: '  ping [ip]     - Ping a specific IP or address', type: 'system' });
        newLogs.push({ text: '  matrix        - Toggle Matrix code rain wallpaper', type: 'system' });
        newLogs.push({ text: '  theme [theme] - Change text theme (green, amber, cyan)', type: 'system' });
        newLogs.push({ text: '  clear         - Clear terminal history buffer', type: 'system' });
        break;

      case 'ls':
        const fileNames = Object.keys(mockFiles).join('    ');
        newLogs.push({ text: fileNames, type: 'output' });
        break;

      case 'cat':
        if (!args[0]) {
          newLogs.push({ text: 'Usage: cat [filename]', type: 'error' });
        } else if (mockFiles[args[0]]) {
          newLogs.push({ text: mockFiles[args[0]], type: 'output' });
        } else {
          newLogs.push({ text: `cat: ${args[0]}: File not found`, type: 'error' });
        }
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'theme':
        const selectedTheme = args[0]?.toLowerCase();
        if (['green', 'amber', 'cyan'].includes(selectedTheme)) {
          setTermTheme(selectedTheme);
          newLogs.push({ text: `Theme successfully changed to: ${selectedTheme}`, type: 'system' });
        } else {
          newLogs.push({ text: 'Usage: theme [green | amber | cyan]', type: 'error' });
        }
        break;

      case 'matrix':
        setMatrixActive(prev => !prev);
        newLogs.push({ text: `Matrix digital rain backdrop: ${!matrixActive ? 'ENABLED' : 'DISABLED'}`, type: 'system' });
        break;

      case 'ping':
        const host = args[0] || 'google.com';
        newLogs.push({ text: `PING ${host} (142.250.190.46): 56 data bytes`, type: 'system' });
        newLogs.push({ text: `64 bytes from 142.250.190.46: icmp_seq=0 ttl=116 time=${Math.round(15 + Math.random() * 20)} ms`, type: 'output' });
        newLogs.push({ text: `64 bytes from 142.250.190.46: icmp_seq=1 ttl=116 time=${Math.round(15 + Math.random() * 20)} ms`, type: 'output' });
        newLogs.push({ text: `--- ${host} ping statistics ---`, type: 'system' });
        newLogs.push({ text: '2 packets transmitted, 2 packets received, 0.0% packet loss', type: 'system' });
        break;

      case 'neofetch':
        newLogs.push({ text: '            ,-.      Aryan@ArVerseOS', type: 'accent' });
        newLogs.push({ text: '       _(*_*)_    ----------------', type: 'accent' });
        newLogs.push({ text: '      (_  o  _)   OS: ArVerse OS v1.0.0 Stable', type: 'accent' });
        newLogs.push({ text: '        / o \\     Kernel: React 19.2.6 Client', type: 'accent' });
        newLogs.push({ text: '       (_/ \\_)    Uptime: 2 hours, 14 mins', type: 'accent' });
        newLogs.push({ text: '                  Shell: Vite Term (bash core)', type: 'accent' });
        newLogs.push({ text: '                  Resolution: ' + window.innerWidth + 'x' + window.innerHeight, type: 'accent' });
        newLogs.push({ text: '                  CPU: Virtual 8-Core Intel/Apple Hybrid', type: 'accent' });
        newLogs.push({ text: '                  Memory: 8.2 GB / 16.0 GB (51%)', type: 'accent' });
        break;

      default:
        newLogs.push({ text: `arverse-sh: command not found: ${command}`, type: 'error' });
    }

    setHistory(prev => [...prev, ...newLogs]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx.current > 0) {
        historyIdx.current--;
        setInputVal(commandHistory.current[historyIdx.current]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx.current < commandHistory.current.length - 1) {
        historyIdx.current++;
        setInputVal(commandHistory.current[historyIdx.current]);
      } else {
        historyIdx.current = commandHistory.current.length;
        setInputVal('');
      }
    }
  };

  const themeColors = {
    green: { text: '#34c759', prompt: '#30d158', ascii: '#34c759' },
    amber: { text: '#ff9500', prompt: '#ffb340', ascii: '#ff9500' },
    cyan: { text: '#0a84ff', prompt: '#64d2ff', ascii: '#0a84ff' }
  };

  const colors = themeColors[termTheme] || themeColors.green;

  return (
    <div 
      className="window-content" 
      onClick={() => document.getElementById('term-input')?.focus()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#090a0f',
        color: colors.text,
        fontFamily: 'Consolas, "SF Mono", Monaco, Courier, monospace',
        fontSize: '13px',
        padding: '16px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Matrix Backdrop Canvas */}
      {matrixActive && (
        <canvas 
          ref={canvasRef} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.18
          }} 
        />
      )}

      {/* Terminal History Logs */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {history.map((log, idx) => {
          let logColor = colors.text;
          if (log.type === 'input') logColor = colors.prompt;
          else if (log.type === 'error') logColor = '#ff453a';
          else if (log.type === 'accent') logColor = colors.ascii;

          return (
            <div 
              key={idx} 
              style={{
                color: logColor,
                whiteSpace: 'pre-wrap',
                lineHeight: '1.4'
              }}
            >
              {log.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt row */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '8px',
          zIndex: 2,
          position: 'relative',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '8px'
        }}
      >
        <span style={{ color: colors.prompt, fontWeight: '700' }}>arverse@os:~$</span>
        <input 
          id="term-input"
          type="text" 
          value={inputVal} 
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoFocus
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: colors.text,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            caretColor: colors.text
          }}
        />
      </div>
    </div>
  );
}
