// Audio Alarm Synthesizer and Native Notification Engine using Web Audio API

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Synthesize Alarm Sounds using Web Audio API
 */
export const playAlarmSound = (type = 'chime') => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'beep') {
      // Classic Double Beep Alarm
      [0, 0.2].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now + offset); // A5 note
        gain.gain.setValueAtTime(0.3, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      });
    } else if (type === 'urgent') {
      // Urgent Pulsing Siren Alarm
      for (let i = 0; i < 4; i++) {
        const offset = i * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1046.5, now + offset); // C6 note
        gain.gain.setValueAtTime(0.4, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.12);
      }
    } else {
      // Pleasant Cyber Chime
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const offset = idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.3, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.4);
      });
    }
  } catch (err) {
    console.warn('Audio alarm playback error:', err);
  }
};

/**
 * Request Native OS Desktop Notification Permissions
 */
export const requestNativeNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Trigger System Desktop Notification with Audio Alarm
 */
export const triggerSystemAlarmNotification = async (title, body, soundType = 'urgent') => {
  // Play synthesized audio alarm
  playAlarmSound(soundType);

  // Send OS level Notification if granted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`🔔 AcademiaSync: ${title}`, {
        body,
        icon: '/vite.svg',
        tag: 'academiasync-alarm',
        requireInteraction: true
      });
    } catch (e) {
      console.warn('Desktop notification spawn failed:', e);
    }
  }
};
