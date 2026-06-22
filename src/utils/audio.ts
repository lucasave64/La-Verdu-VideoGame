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
let activeLevelIdGlobal = 1;

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

  // Set the current active level and switch background chiptunes instantly
  setLevel(levelId: number) {
    if (activeLevelIdGlobal === levelId) return;
    activeLevelIdGlobal = levelId;
    
    // If music is already playing, restart with the new level's retro loop!
    if (musicInterval) {
      this.stopBackgroundMusic();
      this.startBackgroundMusic();
    }
  },

  // Start a delightful, lightweight looping video-game chiptune melody!
  startBackgroundMusic() {
    if (isMusicMutedGlobal) return;
    if (musicInterval) return; // Already playing

    const ctx = getAudioContext();
    if (!ctx) return;

    // Define three distinct 8-bit compositions from the 80s:
    let melody: { note: number; type: 'triangle' | 'square'; vol: number }[] = [];

    if (activeLevelIdGlobal === 2) {
      // LEVEL 2: "Santo Pipó Mate-folk"
      // Folklore/Litoral minor chord-based retro syncopation, very nostalgic 80s atmosphere
      melody = [
        { note: 220.00, type: 'triangle', vol: 0.035 }, // A3
        { note: 261.63, type: 'triangle', vol: 0.035 }, // C4
        { note: 329.63, type: 'triangle', vol: 0.035 }, // E4
        { note: 220.00, type: 'triangle', vol: 0.035 }, // A3
        { note: 293.66, type: 'square',   vol: 0.015 }, // D4 (sharp crisp accent)
        { note: 329.63, type: 'triangle', vol: 0.035 }, // E4
        { note: 392.00, type: 'square',   vol: 0.015 }, // G4 (accent)
        { note: 0,      type: 'triangle', vol: 0.000 }, // pause
        
        { note: 329.63, type: 'triangle', vol: 0.035 }, // E4
        { note: 293.66, type: 'triangle', vol: 0.035 }, // D4
        { note: 261.63, type: 'triangle', vol: 0.035 }, // C4
        { note: 220.00, type: 'triangle', vol: 0.035 }, // A3
        { note: 261.63, type: 'square',   vol: 0.015 }, // C4
        { note: 196.00, type: 'triangle', vol: 0.035 }, // G3
        { note: 220.00, type: 'triangle', vol: 0.040 }, // A3 (deep sustained)
        { note: 0,      type: 'triangle', vol: 0.000 }  // pause
      ];
    } else if (activeLevelIdGlobal === 3) {
      // LEVEL 3: "Golden Garden Quest"
      // Heroic retro fantasy RPG adventure overworld, upbeat rising thirds and minor-major transitions
      melody = [
        { note: 261.63, type: 'square',   vol: 0.012 }, // C4
        { note: 392.00, type: 'triangle', vol: 0.030 }, // G4
        { note: 329.63, type: 'square',   vol: 0.012 }, // E4
        { note: 392.00, type: 'triangle', vol: 0.030 }, // G4
        { note: 523.25, type: 'square',   vol: 0.015 }, // C5 (higher crisp pitch!)
        { note: 392.00, type: 'triangle', vol: 0.030 }, // G4
        { note: 659.25, type: 'square',   vol: 0.012 }, // E5
        { note: 587.33, type: 'triangle', vol: 0.030 }, // D5
        
        { note: 523.25, type: 'square',   vol: 0.012 }, // C5
        { note: 493.88, type: 'triangle', vol: 0.030 }, // B4
        { note: 440.00, type: 'square',   vol: 0.012 }, // A4
        { note: 392.00, type: 'triangle', vol: 0.030 }, // G4
        { note: 349.23, type: 'square',   vol: 0.012 }, // F4
        { note: 329.63, type: 'triangle', vol: 0.030 }, // E4
        { note: 293.66, type: 'square',   vol: 0.012 }, // D4
        { note: 261.63, type: 'triangle', vol: 0.035 }  // C4
      ];
    } else {
      // LEVEL 1: "Super Bouncy Greens" (Classic)
      // Bouncy, lighthearted happy 8-bit arcade major melody, perfect for fruits & veggies
      melody = [
        { note: 261.63, type: 'triangle', vol: 0.035 }, // C4
        { note: 329.63, type: 'triangle', vol: 0.035 }, // E4
        { note: 392.00, type: 'square',   vol: 0.015 }, // G4 (crisp sound)
        { note: 329.63, type: 'triangle', vol: 0.035 }, // E4
        { note: 440.00, type: 'square',   vol: 0.015 }, // A4
        { note: 392.00, type: 'triangle', vol: 0.035 }, // G4
        { note: 523.25, type: 'square',   vol: 0.018 }, // C5
        { note: 440.00, type: 'triangle', vol: 0.035 }, // A4
        
        { note: 293.66, type: 'triangle', vol: 0.035 }, // D4
        { note: 392.00, type: 'square',   vol: 0.015 }, // G4
        { note: 329.63, type: 'triangle', vol: 0.035 }, // E4
        { note: 261.63, type: 'triangle', vol: 0.035 }, // C4
        { note: 392.00, type: 'square',   vol: 0.015 }, // G4
        { note: 440.00, type: 'triangle', vol: 0.035 }, // A4
        { note: 523.25, type: 'square',   vol: 0.018 }, // C5
        { note: 0,      type: 'triangle', vol: 0.000 }  // pause
      ];
    }

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

          osc.type = currentMelodyStep.type;
          osc.frequency.setValueAtTime(freq, ctxActive.currentTime);

          // Leveling music volume slightly so it is pleasant and highly nostalgic
          gain.gain.setValueAtTime(currentMelodyStep.vol, ctxActive.currentTime);
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
    // Schedule subsequent beats every 250 milliseconds with retro precise timing
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
