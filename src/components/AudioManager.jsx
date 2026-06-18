import { useState, useEffect, useRef, useCallback } from 'react';

// Generates spooky ambient dungeon sounds using Web Audio API
// No external audio files needed

export default function AudioManager() {
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const startAudio = useCallback(() => {
    if (ctxRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0.25;
      master.connect(ctx.destination);

      // 1. Deep drone (low frequency)
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = 'sine';
      drone.frequency.value = 55; // low A
      droneGain.gain.value = 0.15;
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start();

      // Slow frequency modulation for the drone
      const droneLfo = ctx.createOscillator();
      const droneLfoGain = ctx.createGain();
      droneLfo.type = 'sine';
      droneLfo.frequency.value = 0.08;
      droneLfoGain.gain.value = 3;
      droneLfo.connect(droneLfoGain);
      droneLfoGain.connect(drone.frequency);
      droneLfo.start();

      // 2. Second drone (fifth interval)
      const drone2 = ctx.createOscillator();
      const drone2Gain = ctx.createGain();
      drone2.type = 'sine';
      drone2.frequency.value = 82; // low E
      drone2Gain.gain.value = 0.08;
      drone2.connect(drone2Gain);
      drone2Gain.connect(master);
      drone2.start();

      // 3. Filtered noise (wind/atmosphere)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 200;
      noiseFilter.Q.value = 1;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.06;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start();

      // Slow filter sweep
      const noiseLfo = ctx.createOscillator();
      const noiseLfoGain = ctx.createGain();
      noiseLfo.frequency.value = 0.05;
      noiseLfoGain.gain.value = 100;
      noiseLfo.connect(noiseLfoGain);
      noiseLfoGain.connect(noiseFilter.frequency);
      noiseLfo.start();

      // 4. Occasional eerie tones (water drips / mystery)
      const playTone = () => {
        if (!ctxRef.current || ctxRef.current.state === 'closed') return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const freq = [220, 330, 440, 293, 370][Math.floor(Math.random() * 5)];
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.value = 0;
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        osc.connect(g);
        g.connect(master);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2.5);
        setTimeout(playTone, 4000 + Math.random() * 8000);
      };
      setTimeout(playTone, 3000);

      nodesRef.current = [drone, drone2, droneLfo, noise, noiseLfo, master];
      setStarted(true);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (!started) {
      startAudio();
      setMuted(false);
    } else if (ctxRef.current) {
      if (muted) {
        ctxRef.current.resume();
        setMuted(false);
      } else {
        ctxRef.current.suspend();
        setMuted(true);
      }
    }
  };

  return (
    <button className="audio-toggle" onClick={toggle} title={muted ? '소리 켜기' : '소리 끄기'}>
      {muted ? '♪ 소리 켜기' : '♪ 소리 끄기'}
    </button>
  );
}
