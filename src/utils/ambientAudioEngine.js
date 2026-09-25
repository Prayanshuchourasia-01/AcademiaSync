/**
 * Ambient White Noise & Rain Audio Synthesizer
 * Uses Web Audio API buffer node to synthesize ambient focus sound (Rain / White Noise).
 */

class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.noiseNode = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  toggleRainSound(enable = true) {
    this.init();
    if (!this.ctx) return;

    if (enable && !this.isPlaying) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.noiseNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.noiseNode.start();
      this.isPlaying = true;
    } else if (!enable && this.isPlaying && this.noiseNode) {
      this.noiseNode.stop();
      this.isPlaying = false;
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();
