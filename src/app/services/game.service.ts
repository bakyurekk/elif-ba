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
    { id: '1', unit: 1, letter: 'ا', name: 'Elif', desc: 'İlk harf. "Elma" daki "e" gibi ses çıkarır.', color: 'brand-green', completed: false, locked: false, stars: 0 },
    { id: '2', unit: 1, letter: 'ب', name: 'Be', desc: '"Bal" daki "b" gibi ses çıkarır. Altında bir nokta vardır.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '3', unit: 1, letter: 'ت', name: 'Te', desc: '"Tuz" daki "t" gibi ses çıkarır. Üstünde iki nokta vardır.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '4', unit: 1, letter: 'ث', name: 'Se', desc: '"Think" deki "th" gibi ses çıkarır. Üstünde üç nokta vardır.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '5', unit: 1, letter: 'ج', name: 'Cim', desc: '"Cam" daki "c" gibi ses çıkarır.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '6', unit: 1, letter: 'ح', name: 'Ha', desc: 'Derin, nefesli bir "h" sesi.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '7', unit: 1, letter: 'خ', name: 'Hı', desc: 'Boğazdan gelen "h" sesi.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '8', unit: 1, letter: 'د', name: 'Dal', desc: '"Dal" daki "d" gibi ses çıkarır.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '9', unit: 1, letter: 'ذ', name: 'Zel', desc: '"This" deki "th" gibi ses çıkarır.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '10', unit: 1, letter: 'ر', name: 'Ra', desc: 'Yuvarlanmış "r" sesi.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '11', unit: 1, letter: 'ز', name: 'Ze', desc: '"Zil" deki "z" gibi ses çıkarır.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '12', unit: 1, letter: 'س', name: 'Sin', desc: '"Su" daki "s" gibi ses çıkarır.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '13', unit: 1, letter: 'ش', name: 'Şin', desc: '"Şeker" deki "ş" gibi ses çıkarır.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '14', unit: 1, letter: 'ص', name: 'Sad', desc: 'Kalın "s" sesi.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '15', unit: 1, letter: 'ض', name: 'Dad', desc: 'Kalın "d" sesi.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '16', unit: 1, letter: 'ط', name: 'Tı', desc: 'Kalın "t" sesi.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '17', unit: 1, letter: 'ظ', name: 'Zı', desc: 'Kalın "z" sesi.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '18', unit: 1, letter: 'ع', name: 'Ayn', desc: 'Derin boğaz sesi.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '19', unit: 1, letter: 'غ', name: 'Gayn', desc: 'Gargara yapar gibi "g" sesi.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '20', unit: 1, letter: 'ف', name: 'Fe', desc: '"Fare" deki "f" gibi ses çıkarır.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '21', unit: 1, letter: 'ق', name: 'Kaf', desc: 'Boğazdan gelen derin "k" sesi.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '22', unit: 1, letter: 'ك', name: 'Kef', desc: '"Kale" deki "k" gibi ses çıkarır.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '23', unit: 1, letter: 'ل', name: 'Lam', desc: '"Lamba" daki "l" gibi ses çıkarır.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    { id: '24', unit: 1, letter: 'م', name: 'Mim', desc: '"Masa" daki "m" gibi ses çıkarır.', color: 'brand-yellow', completed: false, locked: true, stars: 0 },
    { id: '25', unit: 1, letter: 'ن', name: 'Nun', desc: '"Nar" daki "n" gibi ses çıkarır.', color: 'brand-red', completed: false, locked: true, stars: 0 },
    { id: '26', unit: 1, letter: 'ه', name: 'He', desc: 'Yumuşak "h" sesi.', color: 'brand-blue', completed: false, locked: true, stars: 0 },
    { id: '27', unit: 1, letter: 'و', name: 'Vav', desc: '"V" veya uzun "u" gibi ses çıkarır.', color: 'brand-green', completed: false, locked: true, stars: 0 },
    { id: '28', unit: 1, letter: 'ي', name: 'Ya', desc: '"Y" veya uzun "i" gibi ses çıkarır.', color: 'brand-purple', completed: false, locked: true, stars: 0 },
    
    // Unit 2: Harakat
    { id: '29', unit: 2, letter: 'َ', name: 'Fatha', desc: 'Harfin üstüne "A" sesi ekler.', color: 'brand-red', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
    { id: '30', unit: 2, letter: 'ِ', name: 'Kasra', desc: 'Harfin altına "İ" sesi ekler.', color: 'brand-blue', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
    { id: '31', unit: 2, letter: 'ُ', name: 'Damma', desc: 'Harfin üstüne "U" sesi ekler.', color: 'brand-yellow', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
    { id: '32', unit: 2, letter: 'abc', name: 'Mixed', desc: 'Tüm sesli harf işaretlerini birlikte pratik yapın.', color: 'brand-purple', completed: false, locked: true, stars: 0, baseLetter: 'ب' },
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