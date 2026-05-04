/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service to handle UI sound effects using Web Audio API synthesis.
 */
class AudioService {
  private static instance: AudioService;
  private audioCtx: AudioContext | null = null;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private initCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays a soft "pop" or "click" sound.
   */
  public playClick(): void {
    const ctx = this.initCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  /**
   * Plays a "success" chime.
   */
  public playSuccess(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    
    const playNote = (freq: number, start: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.3);
    };

    playNote(523.25, now); // C5
    playNote(659.25, now + 0.1); // E5
    playNote(783.99, now + 0.2); // G5
  }

  /**
   * Plays a soft "completion" chime for goals.
   */
  public playComplete(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const playNote = (freq: number, start: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.8);
    };

    playNote(880.00, now); // A5
    playNote(1174.66, now + 0.15); // D6
  }
}

export const audioService = AudioService.getInstance();
