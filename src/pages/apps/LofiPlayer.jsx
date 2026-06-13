import React, { useState, useEffect, useRef } from 'react';

export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [noiseRain, setNoiseRain] = useState(false);
  const [noiseVinyl, setNoiseVinyl] = useState(true);
  
  const audioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const vinylNodeRef = useRef(null);
  const rainNodeRef = useRef(null);
  const vinylSourceRef = useRef(null);
  const rainSourceRef = useRef(null);
  const visualizerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const playlist = [
    { title: "Midnight Code Space", tempo: "Slow Jazz", chords: [[60, 63, 67, 70], [58, 62, 65, 69], [57, 60, 64, 67], [55, 58, 62, 65]] },
    { title: "Gorakhpur Rainy Cafe", tempo: "Ambient Chill", chords: [[57, 60, 64, 67], [62, 65, 69, 72], [60, 63, 67, 70], [55, 59, 62, 66]] },
    { title: "Antigravity Orbit", tempo: "Dream Synth", chords: [[65, 68, 72, 75], [63, 67, 70, 74], [60, 63, 67, 71], [58, 62, 65, 68]] }
  ];

  // Initialize Audio Context on demand (user interaction required)
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();
  };

  // Stop all active loop sound sources
  const stopAllSounds = () => {
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    
    if (vinylSourceRef.current) {
      try { vinylSourceRef.current.stop(); } catch {}
      vinylSourceRef.current = null;
    }
    if (vinylNodeRef.current) {
      try { vinylNodeRef.current.disconnect(); } catch {}
      vinylNodeRef.current = null;
    }

    if (rainSourceRef.current) {
      try { rainSourceRef.current.stop(); } catch {}
      rainSourceRef.current = null;
    }
    if (rainNodeRef.current) {
      try { rainNodeRef.current.disconnect(); } catch {}
      rainNodeRef.current = null;
    }
  };

  // Synthesize procedural vinyl crackle noise
  const createVinylNoise = () => {
    if (!audioCtxRef.current) return null;
    const ctx = audioCtxRef.current;
    
    // Generate 2 seconds of noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Filter noise to sound like low rumble crackle
      data[i] = white * 0.012; 
      // Add random impulse crackle pops
      if (Math.random() > 0.9998) {
        data[i] += (Math.random() * 2 - 1) * 0.45;
      }
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    vinylSourceRef.current = source;
    
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1000;

    const gainNode = ctx.createGain();
    gainNode.gain.value = noiseVinyl ? volume / 400 : 0;
    vinylNodeRef.current = gainNode;

    source.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start(0);
    return gainNode;
  };

  // Synthesize rain noise
  const createRainNoise = () => {
    if (!audioCtxRef.current) return null;
    const ctx = audioCtxRef.current;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter approximation
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    rainSourceRef.current = source;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 450;
    bandpass.Q.value = 1.0;

    const gainNode = ctx.createGain();
    gainNode.gain.value = noiseRain ? volume / 300 : 0;
    rainNodeRef.current = gainNode;

    source.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
    return gainNode;
  };

  // Play a synthesized chord (Lofi chords)
  const playSynthesizedChord = (notesArray) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;

    // Convert MIDI to frequency
    const midiToFreq = (note) => Math.pow(2, (note - 69) / 12) * 440;

    notesArray.forEach((note, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft triangle/sine blend for warm lofi sound
      osc.type = index % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.value = midiToFreq(note - 12); // Octave down for extra warmth

      filter.type = 'lowpass';
      filter.frequency.value = 600; // Muffled warm cutoff

      // Gentle Lofi swell envelope
      const now = ctx.currentTime;
      const attack = 1.8 + Math.random() * 0.5;
      const decay = 4.0;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06 * (volume / 100), now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + attack + decay);
    });
  };

  // Play loops
  useEffect(() => {
    if (isPlaying) {
      initAudio();
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop old instances first to prevent overlapping sounds
      stopAllSounds();

      // Start vinyl and rain sounds
      createVinylNoise();
      createRainNoise();

      // Start playing chords
      let chordIndex = 0;
      const chordSequence = playlist[currentTrack].chords;

      const triggerNextChord = () => {
        playSynthesizedChord(chordSequence[chordIndex]);
        chordIndex = (chordIndex + 1) % chordSequence.length;
      };

      triggerNextChord();
      // Cozy chord changes every 6.5 seconds
      synthIntervalRef.current = setInterval(triggerNextChord, 6500);

      // Start canvas drawing
      drawWaveform();
    } else {
      // Cleanup
      stopAllSounds();
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      stopAllSounds();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentTrack]);

  // Adjust volume dynamically
  useEffect(() => {
    if (audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      if (vinylNodeRef.current) {
        vinylNodeRef.current.gain.setValueAtTime(noiseVinyl ? volume / 400 : 0, now);
      }
      if (rainNodeRef.current) {
        rainNodeRef.current.gain.setValueAtTime(noiseRain ? volume / 300 : 0, now);
      }
    }
  }, [volume, noiseRain, noiseVinyl]);

  // Draw cozy audio visualizer canvas
  const drawWaveform = () => {
    const canvas = visualizerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      for (let x = 0; x < width; x += 4) {
        // Draw standard sinusoidal wave with random fluctuations when playing
        const amp = isPlaying ? (12 + Math.sin(step + x * 0.05) * 5) * (volume / 100) : 1;
        const y = mid + Math.sin(step + x * 0.03) * amp * Math.cos(step * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, mid - (y - mid)); // symmetry
      }
      ctx.stroke();

      step += isPlaying ? 0.05 : 0.005;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  useEffect(() => {
    drawWaveform();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const handleTogglePlay = () => {
    initAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack(prev => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentTrack(prev => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowY: 'auto', padding: '24px', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Vinyl Disc Container */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Disc */}
        <div 
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #222 30%, #050505 70%, #111 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${isPlaying ? 360 : 0}deg)`,
            transition: isPlaying ? 'transform 10s linear infinite' : 'transform 1s ease',
            animation: isPlaying ? 'rotateDisc 12s linear infinite' : 'none'
          }}
        >
          {/* Vinyl Grooves */}
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', position: 'absolute' }} />
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', position: 'absolute' }} />
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', position: 'absolute' }} />
          
          {/* Album Cover Art center */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-color), #34c759)',
            border: '3px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            ☕
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rotateDisc {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Track Information */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>{playlist[currentTrack].title}</h2>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{playlist[currentTrack].tempo}</span>
      </div>

      {/* Waveform Canvas */}
      <canvas 
        ref={visualizerRef} 
        width="300" 
        height="50" 
        style={{ width: '300px', height: '50px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }} 
      />

      {/* Music controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={handlePrev} style={audioControlBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        
        <button onClick={handleTogglePlay} style={{ ...audioControlBtn, width: '48px', height: '48px', backgroundColor: 'var(--accent-color)', border: 'none', color: '#fff' }}>
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>

        <button onClick={handleNext} style={audioControlBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
      </div>

      {/* Ambient Soundboard Layers */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => setNoiseRain(!noiseRain)}
          style={{ ...layerBtnStyle, border: noiseRain ? '1px solid #0a84ff' : '1px solid var(--panel-border)', background: noiseRain ? 'rgba(10,132,255,0.1)' : 'transparent' }}
        >
          🌧️ Rain Noise
        </button>
        <button 
          onClick={() => setNoiseVinyl(!noiseVinyl)}
          style={{ ...layerBtnStyle, border: noiseVinyl ? '1px solid #ff9500' : '1px solid var(--panel-border)', background: noiseVinyl ? 'rgba(255,149,0,0.1)' : 'transparent' }}
        >
          📻 Vinyl crackle
        </button>
      </div>

      {/* Volume Slider row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '200px' }}>
        <span style={{ fontSize: '14px' }}>🔈</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={(e) => setVolume(Number(e.target.value))} 
          style={{ flex: 1, accentColor: 'var(--accent-color)' }}
        />
        <span style={{ fontSize: '14px' }}>🔊</span>
      </div>

    </div>
  );
}

const audioControlBtn = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: '1px solid var(--panel-border)',
  background: 'rgba(255,255,255,0.03)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.1s',
  outline: 'none'
};

const layerBtnStyle = {
  padding: '6px 12px',
  borderRadius: '16px',
  color: 'var(--text-primary)',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  outline: 'none'
};
