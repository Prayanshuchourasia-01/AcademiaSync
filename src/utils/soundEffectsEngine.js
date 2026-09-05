/**
 * Sound Effects Synthesizer Engine
 * Uses Web Audio API oscillator synthesis for Focus HUD timer chimes, session alerts, and ticks without external audio assets.
 */

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(type = 'start') {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'complete') {
      // Arpeggio C5 - E5 - G5 - C6
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);
        noteGain.gain.setValueAtTime(0.2, now + idx * 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
        noteOsc.connect(noteGain);
        noteGain.connect(this.ctx.destination);
        noteOsc.start(now + idx * 0.12);
        noteOsc.stop(now + idx * 0.12 + 0.5);
      });
    } else if (type === 'tick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  }
}

export const soundFx = new SoundEffectsEngine();
