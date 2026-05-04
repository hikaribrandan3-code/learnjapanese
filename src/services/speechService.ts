/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service to handle Text-to-Speech using the Web Speech API.
 */
class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis;

  private constructor() {
    this.synth = window.speechSynthesis;
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  /**
   * Speaks the provided text in the specified language.
   * @param text The text to speak.
   * @param lang The language code (e.g., 'ja-JP', 'en-US').
   * @param rate The speed of speech (0.1 to 10).
   */
  public speak(text: string, lang: string = 'ja-JP', rate: number = 0.85): void {
    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.05; // Slightly higher for a clearer, more natural tutor-like quality

    // Try to find a high-quality Japanese voice if available
    const getBestVoice = () => {
      const voices = this.synth.getVoices();
      // Prioritize natural sounding voices from major providers
      return voices.find(v => v.lang.startsWith('ja') && (v.name.includes('Premium') || v.name.includes('Enhanced'))) ||
             voices.find(v => v.lang.startsWith('ja') && v.name.includes('Kyoko')) ||
             voices.find(v => v.lang.startsWith('ja') && v.name.includes('Nanami')) ||
             voices.find(v => v.lang.startsWith('ja') && v.name.includes('Google')) ||
             voices.find(v => v.lang.startsWith('ja') && v.name.includes('Microsoft')) ||
             voices.find(v => v.lang.startsWith('ja')) ||
             voices.find(v => v.lang.includes('ja'));
    };

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    } else {
      // If voices aren't loaded yet, try again when they are
      this.synth.onvoiceschanged = () => {
        const retryVoice = getBestVoice();
        if (retryVoice) utterance.voice = retryVoice;
        this.synth.speak(utterance);
        this.synth.onvoiceschanged = null; // Prevent memory loops
      };
      if (this.synth.getVoices().length > 0) this.synth.speak(utterance); // Fallback if voices exist but no JA match yet
      return;
    }

    this.synth.speak(utterance);
  }
}

export const speechService = SpeechService.getInstance();
