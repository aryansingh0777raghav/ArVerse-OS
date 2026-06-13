import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function LockScreen() {
  const { setIsLocked, getWallpaperBackground, profileAvatar, profileName, pinEnabled, pinCode } = useTheme();
  const [time, setTime] = useState(new Date());
  const [sliderVal, setSliderVal] = useState(0);
  const [showPinInput, setShowPinInput] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const isPinActive = pinEnabled && pinCode && pinCode.length === 4;

  // Quotes list
  const quotes = [
    "The best way to predict the future is to create it.",
    "Simplicity is the ultimate sophistication.",
    "Design is not just what it looks like and feels like. Design is how it works.",
    "Details make the design, and design makes the product."
  ];
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showPinInput) return;

    const handleKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleCancelPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPinInput, inputPin, pinCode]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleUnlock = () => {
    setIsLocked(false);
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        docEl.requestFullscreen().catch(err => {
          console.warn("Fullscreen request bypassed:", err);
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setSliderVal(val);
    if (val >= 90) {
      if (isPinActive) {
        setShowPinInput(true);
      } else {
        handleUnlock();
      }
    }
  };

  const handleSliderRelease = () => {
    if (sliderVal < 90) {
      setSliderVal(0);
    }
  };

  const handleKeyPress = (num) => {
    if (inputPin.length >= 4) return;
    setPinError(false);
    const newPin = inputPin + num;
    setInputPin(newPin);

    // Verify passcode when all 4 digits are input
    if (newPin.length === 4) {
      if (newPin === pinCode) {
        handleUnlock();
      } else {
        setPinError(true);
        // Reset input after feedback
        setTimeout(() => {
          setInputPin('');
        }, 500);
      }
    }
  };

  const handleBackspace = () => {
    if (inputPin.length > 0) {
      setInputPin(prev => prev.slice(0, -1));
      setPinError(false);
    }
  };

  const handleCancelPin = () => {
    setShowPinInput(false);
    setSliderVal(0);
    setInputPin('');
    setPinError(false);
  };

  return (
    <div 
      className="lock-screen" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '60px 20px 80px 20px',
        ...getWallpaperBackground(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden'
      }}
    >
      {/* Frosted Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(30px) saturate(120%)',
        WebkitBackdropFilter: 'blur(30px) saturate(120%)',
        backgroundColor: 'rgba(0,0,0,0.15)',
        zIndex: -1
      }} />

      {/* Top Header - Time & Date */}
      <div style={{ textAlign: 'center', color: '#ffffff', marginTop: '20px' }}>
        <h1 style={{
          fontSize: '92px',
          fontWeight: '200',
          letterSpacing: '-2px',
          lineHeight: '1',
          textShadow: '0 4px 24px rgba(0,0,0,0.2)'
        }}>
          {formatTime(time)}
        </h1>
        <p style={{
          fontSize: '20px',
          fontWeight: '400',
          letterSpacing: '0.5px',
          marginTop: '10px',
          opacity: 0.9,
          textShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {formatDate(time)}
        </p>
      </div>

      {showPinInput ? (
        /* iOS-Style PIN Entry Pad UI */
        <div className="glass" style={{
          width: '320px',
          padding: '24px 16px',
          textAlign: 'center',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'rgba(0,0,0,0.22)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          animation: 'fade-in 0.3s ease'
        }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '600', display: 'block', color: pinError ? '#ff4d4d' : '#ffffff' }}>
              {pinError ? 'Incorrect Passcode' : 'Enter Passcode'}
            </span>
          </div>

          {/* Dots Indicator grid */}
          <div 
            className={pinError ? "shake-dots" : ""}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px' }}
          >
            {[0, 1, 2, 3].map(index => {
              const filled = inputPin.length > index;
              return (
                <div 
                  key={index} 
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '1.5px solid #ffffff',
                    background: filled ? '#ffffff' : 'transparent',
                    boxShadow: filled ? '0 0 8px #ffffff' : 'none',
                    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
              );
            })}
          </div>

          {/* Keys matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            width: '100%',
            justifyItems: 'center'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="pin-pad-btn"
                style={keypadBtnStyle}
              >
                {num}
              </button>
            ))}
            
            <button
              onClick={handleCancelPin}
              className="pin-pad-text-btn"
              style={keypadTextBtnStyle}
            >
              Cancel
            </button>

            <button
              onClick={() => handleKeyPress('0')}
              className="pin-pad-btn"
              style={keypadBtnStyle}
            >
              0
            </button>

            <button
              onClick={handleBackspace}
              className="pin-pad-text-btn"
              style={keypadTextBtnStyle}
            >
              ⌫
            </button>
          </div>
        </div>
      ) : (
        /* Middle Card - Greeting & Daily Quote */
        <div className="glass" style={{
          width: '420px',
          padding: '32px',
          textAlign: 'center',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'rgba(255,255,255,0.06)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Profile Avatar */}
          {profileAvatar ? (
            <img 
              src={profileAvatar} 
              alt={profileName} 
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255,255,255,0.8)'
              }}
            />
          ) : (
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2997ff, #0071e3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: '600',
              fontSize: '24px',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(0, 113, 227, 0.3)',
              border: '2px solid rgba(255,255,255,0.8)'
            }}>
              {profileName ? profileName.charAt(0).toUpperCase() : 'A'}
            </div>
          )}

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              Welcome back, {profileName}
            </h2>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.6',
              fontStyle: 'italic',
              padding: '0 10px'
            }}>
              "{quote}"
            </p>
          </div>
        </div>
      )}

      {/* Bottom Unlock Actions (Hidden when keypad is open) */}
      {!showPinInput && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div 
            className="glass"
            style={{
              width: '280px',
              height: '56px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '28px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
          >
            {/* Slide Track Label */}
            <span style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
              fontWeight: '500',
              letterSpacing: '1px',
              pointerEvents: 'none',
              userSelect: 'none',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              animation: 'shimmer 2.5s infinite linear'
            }}>
              Slide to Unlock
            </span>

            {/* Standard Input Slider */}
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={handleSliderChange}
              onMouseUp={handleSliderRelease}
              onTouchEnd={handleSliderRelease}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />

            {/* Dynamic Slider Button Visual */}
            <div style={{
              position: 'absolute',
              left: `calc(4px + ${sliderVal * 0.77}px)`,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transition: sliderVal === 0 ? 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* Quick Bypass Button (Hidden when passcode is active) */}
          {!isPinActive && (
            <button 
              onClick={handleUnlock}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline',
                letterSpacing: '0.5px'
              }}
            >
              Skip to Desktop
            </button>
          )}
        </div>
      )}

      {/* Slide text shimmer animation and button triggers */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .pin-pad-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        .pin-pad-btn:active {
          transform: scale(0.92);
        }
        .pin-pad-text-btn:hover {
          opacity: 0.8;
        }
        .pin-pad-text-btn:active {
          transform: scale(0.9);
        }
        @keyframes shake-dots {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake-dots {
          animation: shake-dots 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Inline keypad layout styles
const keypadBtnStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '400',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
  outline: 'none'
};

const keypadTextBtnStyle = {
  width: '56px',
  height: '56px',
  background: 'transparent',
  border: 'none',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none'
};
