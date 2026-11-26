/**
 * ROMANTIC AUDIO ENGINE
 * Seamless Web Audio API synthesizer for romantic piano & music box tones,
 * sound effects (kisses, taps, unlocks, fanfare), plus optional HTML5 audio track support.
 */

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.currentNoteIndex = 0;
    this.bgAudioEl = document.getElementById('bgMusic');
    this.useSynth = true;

    // Romantic chord progression in C major / A minor
    // Frequencies (Hz) for an enchanting music box / soft acoustic piano
    // Notes: C4, E4, G4, B4, C5, D5, E5, G5, A5, C6
    this.scale = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
      C6: 1046.50
    };

    // A dreamy romantic arpeggio melody (Canon in D / Romantic Ballad inspired)
    this.melody = [
      { note: 'E5', dur: 0.6, vol: 0.25 },
      { note: 'G5', dur: 0.4, vol: 0.22 },
      { note: 'C6', dur: 0.8, vol: 0.28 },
      { note: 'B5', dur: 0.5, vol: 0.24 },
      { note: 'A5', dur: 0.6, vol: 0.22 },
      { note: 'G5', dur: 0.5, vol: 0.20 },
      { note: 'E5', dur: 0.5, vol: 0.22 },
      { note: 'F5', dur: 0.5, vol: 0.20 },
      { note: 'A5', dur: 0.6, vol: 0.24 },
      { note: 'G5', dur: 0.7, vol: 0.25 },
      { note: 'E5', dur: 0.5, vol: 0.20 },
      { note: 'D5', dur: 0.6, vol: 0.20 },
      { note: 'C5', dur: 1.0, vol: 0.26 },
      { note: 'E5', dur: 0.5, vol: 0.22 },
      { note: 'G5', dur: 0.8, vol: 0.25 },
      { note: 'D5', dur: 0.6, vol: 0.20 }
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle music box tone
  playMusicBoxTone(freq, duration = 0.5, volume = 0.2) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with subtle harmonics for a warm, bell-like chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone err:', e);
    }
  }

  // Start continuous romantic arpeggios
  startSynthMusic() {
    if (this.isPlayingMusic) return;
    this.initContext();
    this.isPlayingMusic = true;
    this.currentNoteIndex = 0;

    const playNextNote = () => {
      if (!this.isPlayingMusic) return;
      const step = this.melody[this.currentNoteIndex];
      const freq = this.scale[step.note] || 523.25;

      this.playMusicBoxTone(freq, step.dur * 1.5, step.vol * 0.4);

      // Play harmony root tone every 4 notes
      if (this.currentNoteIndex % 4 === 0) {
        const rootFreq = (this.currentNoteIndex % 8 === 0) ? this.scale.C4 : this.scale.G4;
        this.playMusicBoxTone(rootFreq, 2.0, 0.12);
      }

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
      this.musicTimer = setTimeout(playNextNote, step.dur * 750);
    };

    playNextNote();
  }

  stopSynthMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // Toggle Background Music
  toggleMusic() {
    this.initContext();

    // Check if external mp3 file exists and plays
    if (this.bgAudioEl && this.bgAudioEl.currentSrc) {
      if (this.bgAudioEl.paused) {
        const playPromise = this.bgAudioEl.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isPlayingMusic = true;
            this.useSynth = false;
            this.updateUi(true);
          }).catch(() => {
            // Fallback to built-in crystal synth
            this.useSynth = true;
            this.startSynthMusic();
            this.updateUi(true);
          });
          return;
        }
      } else {
        this.bgAudioEl.pause();
        this.isPlayingMusic = false;
        this.updateUi(false);
        return;
      }
    }

    // Otherwise use built-in romantic synthesizer
    if (this.isPlayingMusic) {
      this.stopSynthMusic();
      this.updateUi(false);
    } else {
      this.startSynthMusic();
      this.updateUi(true);
    }
  }

  updateUi(isPlaying) {
    const disc = document.getElementById('musicDisc')?.querySelector('.disc-vinyl');
    const wave = document.getElementById('soundWave');
    const playIcon = document.getElementById('musicPlayIcon');
    const pauseIcon = document.getElementById('musicPauseIcon');
    const label = document.getElementById('musicStatusText');

    if (isPlaying) {
      disc?.classList.add('spinning');
      wave?.classList.add('active');
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (label) label.textContent = 'Music On 💖';
    } else {
      disc?.classList.remove('spinning');
      wave?.classList.remove('active');
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (label) label.textContent = 'Play Music';
    }
  }

  // SOUND EFFECTS:

  // Keypad tap sound
  playTapSound() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Flying Kiss Sound
  playKissSound() {
    this.initContext();
    if (!this.ctx) return;
    try {
      // Soft swoosh + pop
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);

      // Chime follower
      setTimeout(() => {
        this.playSuccessChime();
      }, 200);
    } catch (e) {}
  }

  // Success Unlock Chime
  playSuccessChime() {
    this.initContext();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playMusicBoxTone(freq, 0.6, 0.2);
      }, i * 90);
    });
  }

  // Error Shake Sound
  playErrorBuzz() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(120, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Grand Love Surprise Fanfare Crescendo
  playGrandSurpriseChimes() {
    this.initContext();
    if (!this.ctx) return;
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [349.23, 440.00, 523.25, 698.46], // F Major
      [392.00, 493.88, 587.33, 783.99], // G Major
      [523.25, 659.25, 783.99, 1046.50] // High C Major Sparkle
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(freq => {
          this.playMusicBoxTone(freq, 1.2, 0.25);
        });
      }, i * 220);
    });
  }
}

// Global instance
window.romanticAudio = new RomanticAudioEngine();
