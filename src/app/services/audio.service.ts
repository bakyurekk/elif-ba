import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  isPlaying = signal(false);

  constructor() {
    // Initialize AudioContext on first user interaction
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Play audio for a given letter/mark
   * For now, we'll use Web Speech API as a fallback
   * In production, you would load actual audio files
   */
  async playLetterSound(letter: string, name: string): Promise<void> {
    if (this.isPlaying()) return;

    this.isPlaying.set(true);

    try {
      // Try to use Web Speech API for pronunciation
      if ('speechSynthesis' in window) {
        await this.speakText(name);
      } else {
        // Fallback: just show visual feedback
        await this.delay(1000);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      this.isPlaying.set(false);
    }
  }

  /**
   * Use Web Speech API to speak the letter name
   */
  private speakText(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.lang = 'ar-SA'; // Arabic
      utterance.rate = 0.8; // Slightly slower for learning
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        reject(error);
      };

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Play audio from a URL (for when you have actual audio files)
   */
  async playAudioFile(url: string): Promise<void> {
    if (this.isPlaying()) return;

    this.isPlaying.set(true);

    try {
      const audio = new Audio(url);
      
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = (error) => reject(error);
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Error playing audio file:', error);
    } finally {
      this.isPlaying.set(false);
    }
  }

  /**
   * Generate a simple beep sound using Web Audio API
   */
  async playBeep(frequency: number = 440, duration: number = 200): Promise<void> {
    if (!this.audioContext || this.isPlaying()) return;

    this.isPlaying.set(true);

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration / 1000
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);

      await this.delay(duration);
    } catch (error) {
      console.error('Error playing beep:', error);
    } finally {
      this.isPlaying.set(false);
    }
  }

  /**
   * Stop any currently playing audio
   */
  stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying.set(false);
  }

  /**
   * Helper method to create delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
