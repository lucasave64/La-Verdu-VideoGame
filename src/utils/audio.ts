/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API dynamic synthesizer for nostalgic, fun 8-bit VerduPlay sounds!
// Does not require downloading any heavy external audio files.

let audioCtx: AudioContext | null = null;
let musicInterval: any = null;
let isMusicMutedGlobal = false;
let isSfxMutedGlobal = false;

// Persist separate mute settings through local storage
if (typeof window !== 'undefined') {
  isMusicMutedGlobal = localStorage.getItem('verduplay_music_muted') === 'true';
  isSfxMutedGlobal = localStorage.getItem('verduplay_sfx_muted') === 'true';
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard AudioContext initialization with fallback names
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  // Resume if suspended (browser auto-play safeguard)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const audioManager = {
  isMusicMuted() {
    return isMusicMutedGlobal;
  },

  isSfxMuted() {
    return isSfxMutedGlobal;
  },

  isMuted() {
    return isMusicMutedGlobal && isSfxMutedGlobal;
  },

  setMusicMuted(muted: boolean) {
    isMusicMutedGlobal = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('verduplay_music_muted', String(muted));
    }
    if (muted) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  },

  setSfxMuted(muted: boolean) {
    isSfxMutedGlobal = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('verduplay_sfx_muted', String(muted));
    }
  },

  setMuted(muted: boolean) {
    this.setMusicMuted(muted);
    this.setSfxMuted(muted);
  },

  // Delightful pop click sound for menus
  playClick() {
    if (isSfxMutedGlobal) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio failure is harmless:", e);
    }
  },

  // Ascending cheerful major triad chord for correct answers
  playCorrect() {
    if (isSfxMutedGlobal) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const notes = [523, 659, 784, 1046];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {
      console.error(e);
    }
  },

  // Playful disappointed descending slide for wrong answers
  playWrong() {
    if (isSfxMutedGlobal) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.35);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.error(e);
    }
  },

  // Win Jingle for completing a whole lesson
  playWinJingle() {
    if (isSfxMutedGlobal) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Fun retro arpeggio: C4, G4, C5, E5, G5, C6!!
      const notes = [261.63, 392.0, 523.25, 659.25, 784.0, 1046.5];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch (e) {
      console.error(e);
    }
  },

  // Start a delightful, lightweight looping video-game chiptune melody!
  startBackgroundMusic() {
    if (isMusicMutedGlobal) return;
    if (musicInterval) return; // Already playing

    const ctx = getAudioContext();
    if (!ctx) return;

    // A cheerful pentatonic scale song track for La Verdu, repeating every 4 seconds
    // Notes: C4, D4, E4, G4, A4, C5
    const melody = [
      { note: 261.63, time: 0 },    // C4
      { note: 329.63, time: 0.25 }, // E4
      { note: 392.00, time: 0.5 },  // G4
      { note: 329.63, time: 0.75 }, // E4
      { note: 440.00, time: 1.0 },  // A4
      { note: 392.00, time: 1.25 }, // G4
      { note: 523.25, time: 1.5 },  // C5
      { note: 440.00, time: 1.75 }, // A4
      
      { note: 293.66, time: 2.0 },  // D4
      { note: 392.00, time: 2.25 }, // G4
      { note: 329.63, time: 2.5 },  // E4
      { note: 261.63, time: 2.75 }, // C4
      { note: 392.00, time: 3.0 },  // G4
      { note: 440.00, time: 3.25 }, // A4
      { note: 523.25, time: 3.5 },  // C5
      { note: 0,      time: 3.75 }  // pause
    ];

    let beat = 0;
    const playNote = () => {
      if (isMusicMutedGlobal) return;
      const ctxActive = getAudioContext();
      if (!ctxActive) return;

      const currentMelodyStep = melody[beat % melody.length];
      const freq = currentMelodyStep.note;

      if (freq > 0) {
        try {
          const osc = ctxActive.createOscillator();
          const gain = ctxActive.createGain();

          osc.type = 'triangle'; // Smooth classic retro 8-bit sound
          osc.frequency.setValueAtTime(freq, ctxActive.currentTime);

          // Very quiet background music style volume (only 0.02) so it is pleasant and not overwhelming
          gain.gain.setValueAtTime(0.025, ctxActive.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctxActive.currentTime + 0.2);

          osc.connect(gain);
          gain.connect(ctxActive.destination);

          osc.start();
          osc.stop(ctxActive.currentTime + 0.22);
        } catch (e) {
          // ignore
        }
      }
      beat++;
    };

    // Play initial beat
    playNote();
    // Schedule subsequent beats every 250 milliseconds
    musicInterval = setInterval(playNote, 250);
  },

  // Stops background music track immediately
  stopBackgroundMusic() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }
};
