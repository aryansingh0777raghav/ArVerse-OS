import React, { useState, useEffect } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('arverse_calc_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('arverse_calc_history', JSON.stringify(history));
  }, [history]);

  const handleInput = (val) => {
    if (display === '0' && !isNaN(val)) {
      setDisplay(val);
      setEquation(prev => (prev === '' || prev === '0') ? val : prev + val);
    } else {
      setDisplay(prev => (prev === '0' && val === '.') ? '0.' : (prev === '0' && !isNaN(val) ? val : prev + val));
      setEquation(prev => prev + val);
    }
  };

  const handleOperator = (op) => {
    setDisplay('0');
    setEquation(prev => prev + ' ' + op + ' ');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (equation.length > 0) {
      const trimmed = equation.trim();
      const lastChar = trimmed.charAt(trimmed.length - 1);
      if (isNaN(lastChar) && lastChar !== '.') {
        // Operator backspace
        setEquation(trimmed.substring(0, trimmed.length - 1).trim());
      } else {
        setEquation(prev => prev.slice(0, -1) || '');
      }
      setDisplay(prev => prev.slice(0, -1) || '0');
    }
  };

  const handleEvaluate = () => {
    if (!equation.trim()) return;
    try {
      // Replace scientific terms for JS eval
      let evalEq = equation
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Simple safety check: check that equation contains only valid characters
      if (/[^0-9\+\-\*\/\s\.\(\)MathPIEsinocstalgqdrt\*\*]/i.test(evalEq)) {
        throw new Error("Invalid characters");
      }

      const result = Function('"use strict"; return (' + evalEq + ')')();
      const formattedResult = Number(result.toFixed(8)).toString(); // Limit decimal precision nicely

      setDisplay(formattedResult);
      setHistory(prev => [{ eq: equation, res: formattedResult, id: Date.now() }, ...prev].slice(0, 30));
      setEquation(formattedResult);
    } catch (err) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const handleSciFunction = (func) => {
    if (func === 'sq') {
      setEquation(prev => (prev === '0' || prev === '') ? '(0)^2' : `(${prev})^2`);
      setDisplay(prev => (prev === '0' || prev === '') ? '(0)^2' : `(${prev})^2`);
    } else {
      setEquation(prev => (prev === '0' || prev === '') ? `${func}(` : prev + `${func}(`);
      setDisplay(prev => (prev === '0' || prev === '') ? `${func}(` : prev + `${func}(`);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      {/* Calculator Main Frame */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', justifyContent: 'center' }}>
        {/* Screen Display */}
        <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.15)', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '80px', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {equation || '0'}
          </span>
          <span style={{ fontSize: '28px', fontWeight: '300', wordBreak: 'break-all' }}>
            {display}
          </span>
        </div>

        {/* Buttons Grid layout */}
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          {/* Scientific Buttons */}
          {isScientific && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', flex: 0.6 }}>
              {['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'π', 'e', '(', ')'].map(func => (
                <button
                  key={func}
                  onClick={() => ['π', 'e', '(', ')'].includes(func) ? handleInput(func) : handleSciFunction(func)}
                  className="glass-button"
                  style={sciBtnStyle}
                >
                  {func}
                </button>
              ))}
              <button onClick={() => handleSciFunction('sq')} className="glass-button" style={sciBtnStyle}>x²</button>
              <button onClick={() => handleInput('^')} className="glass-button" style={sciBtnStyle}>^</button>
            </div>
          )}

          {/* Core Numbers & Operators */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', flex: 1 }}>
            {/* Top row */}
            <button onClick={handleClear} className="glass-button" style={{ ...funcBtnStyle, gridColumn: 'span 2' }}>Clear</button>
            <button onClick={handleBackspace} className="glass-button" style={funcBtnStyle}>⌫</button>
            <button onClick={() => handleOperator('/')} className="glass-button" style={opBtnStyle}>÷</button>

            {/* Digits 7,8,9 */}
            <button onClick={() => handleInput('7')} className="glass-button" style={numBtnStyle}>7</button>
            <button onClick={() => handleInput('8')} className="glass-button" style={numBtnStyle}>8</button>
            <button onClick={() => handleInput('9')} className="glass-button" style={numBtnStyle}>9</button>
            <button onClick={() => handleOperator('*')} className="glass-button" style={opBtnStyle}>×</button>

            {/* Digits 4,5,6 */}
            <button onClick={() => handleInput('4')} className="glass-button" style={numBtnStyle}>4</button>
            <button onClick={() => handleInput('5')} className="glass-button" style={numBtnStyle}>5</button>
            <button onClick={() => handleInput('6')} className="glass-button" style={numBtnStyle}>6</button>
            <button onClick={() => handleOperator('-')} className="glass-button" style={opBtnStyle}>−</button>

            {/* Digits 1,2,3 */}
            <button onClick={() => handleInput('1')} className="glass-button" style={numBtnStyle}>1</button>
            <button onClick={() => handleInput('2')} className="glass-button" style={numBtnStyle}>2</button>
            <button onClick={() => handleInput('3')} className="glass-button" style={numBtnStyle}>3</button>
            <button onClick={() => handleOperator('+')} className="glass-button" style={opBtnStyle}>+</button>

            {/* Bottom Row */}
            <button onClick={() => setIsScientific(prev => !prev)} className="glass-button" style={sciToggleBtnStyle(isScientific)}>
              {isScientific ? 'Standard' : 'Scientific'}
            </button>
            <button onClick={() => handleInput('0')} className="glass-button" style={numBtnStyle}>0</button>
            <button onClick={() => handleInput('.')} className="glass-button" style={numBtnStyle}>.</button>
            <button onClick={handleEvaluate} className="glass-button" style={evalBtnStyle}>=</button>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="glass" style={{ width: '200px', borderLeft: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.05)', borderRadius: 0 }}>
        <div style={{ padding: '14px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>History</span>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '10.5px', cursor: 'pointer', padding: 0 }}>
              Clear
            </button>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '11px', marginTop: '30px' }}>
              No calculations yet
            </div>
          ) : (
            history.map(item => (
              <div 
                key={item.id} 
                onClick={() => { setEquation(item.eq); setDisplay(item.res); }}
                className="clickable"
                style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '2px', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
                  {item.eq}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>
                  {item.res}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Styling Constants
const numBtnStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: 'var(--text-primary)',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
  padding: '12px'
};

const opBtnStyle = {
  background: 'rgba(0, 113, 227, 0.15)',
  border: '1px solid rgba(0, 113, 227, 0.3)',
  color: 'var(--accent-color)',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  padding: '12px'
};

const evalBtnStyle = {
  background: 'var(--accent-color)',
  border: '1px solid var(--accent-color)',
  color: '#ffffff',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  padding: '12px',
  boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)'
};

const funcBtnStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  color: 'var(--text-primary)',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  padding: '12px'
};

const sciBtnStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  color: 'var(--text-secondary)',
  borderRadius: '8px',
  fontSize: '12.5px',
  fontWeight: '400',
  cursor: 'pointer',
  padding: '10px'
};

const sciToggleBtnStyle = (active) => ({
  background: active ? 'rgba(0, 113, 227, 0.1)' : 'rgba(255, 255, 255, 0.03)',
  border: active ? '1px solid rgba(0, 113, 227, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
  color: active ? 'var(--accent-color)' : 'var(--text-secondary)',
  borderRadius: '8px',
  fontSize: '10.5px',
  fontWeight: '600',
  cursor: 'pointer',
  padding: '12px'
});
