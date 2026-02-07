import { Injectable, signal, computed } from '@angular/core';

export interface Lesson {
  id: string;
  unit: number;
  letter: string;
  name: string;
  desc: string;
  color: string;
  completed: boolean;
  locked: boolean;
  stars: number; // 0-3
  baseLetter?: string; // For Harakat context
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // User Stats
  xp = signal<number>(120);
  streak = signal<number>(3);
  hearts = signal<number>(5);
  
  // Preferences
  userType = signal<'CHILD' | 'ADULT'>('ADULT');
  dailyGoal = signal<number>(10);
  
  // Lessons Data
  lessons = signal<Lesson[]>([
    // Unit 1: Letters
    { id: '1', unit: 1, letter: 'ا', name: 'Elif', desc: 'The first letter. Sounds like "a" in apple.', color: 'brand-green', completed: false, locked: false, stars: 0 },
    { id: '2', unit: 1, letter: 'ب', name: 'Be', desc: 'Sounds like "b" in bat. Has one dot below.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '3', unit: 1, letter: 'ت', name: 'Te', desc: 'Sounds like "t" in tea. Has two dots above.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '4', unit: 1, letter: 'ث', name: 'Se', desc: 'Sounds like "th" in think. Has three dots above.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '5', unit: 1, letter: 'ج', name: 'Cim', desc: 'Sounds like "j" in jam.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '6', unit: 1, letter: 'ح', name: 'Ha', desc: 'A deep, breathy "h" sound.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '7', unit: 1, letter: 'خ', name: 'Hı', desc: 'Throaty "kh" sound.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '8', unit: 1, letter: 'د', name: 'Dal', desc: 'Sounds like "d" in dog.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '9', unit: 1, letter: 'ذ', name: 'Zel', desc: 'Sounds like "th" in this.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '10', unit: 1, letter: 'ر', name: 'Ra', desc: 'Rolled "r" sound.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '11', unit: 1, letter: 'ز', name: 'Ze', desc: 'Sounds like "z" in zoo.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '12', unit: 1, letter: 'س', name: 'Sin', desc: 'Sounds like "s" in sun.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '13', unit: 1, letter: 'ش', name: 'Şin', desc: 'Sounds like "sh" in ship.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '14', unit: 1, letter: 'ص', name: 'Sad', desc: 'Heavy "s" sound.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '15', unit: 1, letter: 'ض', name: 'Dad', desc: 'Heavy "d" sound.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '16', unit: 1, letter: 'ط', name: 'Tı', desc: 'Heavy "t" sound.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '17', unit: 1, letter: 'ظ', name: 'Zı', desc: 'Heavy "th" sound.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '18', unit: 1, letter: 'ع', name: 'Ayn', desc: 'Deep throat sound.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '19', unit: 1, letter: 'غ', name: 'Gayn', desc: 'Gargling "gh" sound.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '20', unit: 1, letter: 'ف', name: 'Fe', desc: 'Sounds like "f" in fish.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '21', unit: 1, letter: 'ق', name: 'Kaf', desc: 'Deep "k" sound from throat.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '22', unit: 1, letter: 'ك', name: 'Kef', desc: 'Sounds like "k" in kite.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '23', unit: 1, letter: 'ل', name: 'Lam', desc: 'Sounds like "l" in lamp.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '24', unit: 1, letter: 'م', name: 'Mim', desc: 'Sounds like "m" in man.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '25', unit: 1, letter: 'ن', name: 'Nun', desc: 'Sounds like "n" in nose.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '26', unit: 1, letter: 'ه', name: 'He', desc: 'Soft "h" sound.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '27', unit: 1, letter: 'و', name: 'Vav', desc: 'Sounds like "w" or long "u".', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '28', unit: 1, letter: 'ي', name: 'Ya', desc: 'Sounds like "y" or long "i".', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    
    // Unit 2: Harakat
    { id: '29', unit: 2, letter: 'َ', name: 'Fatha', desc: 'Adds an "A" sound above the letter.', color: 'brand-red', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
    { id: '30', unit: 2, letter: 'ِ', name: 'Kasra', desc: 'Adds an "I" sound below the letter.', color: 'brand-blue', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
    { id: '31', unit: 2, letter: 'ُ', name: 'Damma', desc: 'Adds an "U" sound above the letter.', color: 'brand-yellow', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
    { id: '32', unit: 2, letter: 'abc', name: 'Mixed', desc: 'Practice all the vowel marks together.', color: 'brand-purple', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
  ]);

  currentLessonId = signal<string | null>(null);

  // Computed
  progress = computed(() => {
    const total = this.lessons().length;
    const completed = this.lessons().filter(l => l.completed).length;
    return Math.round((completed / total) * 100);
  });

  unlockNextLesson(currentId: string) {
    this.lessons.update(lessons => {
      const idx = lessons.findIndex(l => l.id === currentId);
      if (idx === -1) return lessons;

      // Mark current as completed
      const updated = [...lessons];
      updated[idx] = { ...updated[idx], completed: true, stars: 3 };

      // Unlock next
      if (idx + 1 < updated.length) {
        updated[idx + 1] = { ...updated[idx + 1], locked: false };
      }
      return updated;
    });
  }

  addXp(amount: number) {
    this.xp.update(v => v + amount);
  }
}