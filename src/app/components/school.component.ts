import { Component, inject, computed } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { BottomNavComponent } from './bottom-nav.component';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [NgClass, BottomNavComponent],
  template: `
    <div class="h-screen overflow-y-auto bg-gradient-to-b from-brand-purple/10 to-white pb-24">
      <!-- Header -->
      <header class="sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b-2 border-brand-gray px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-blue rounded-2xl flex items-center justify-center shadow-lg">
              <span class="material-symbols-rounded text-white text-2xl">school</span>
            </div>
            <div>
              <h1 class="text-xl font-extrabold text-gray-800">Öğrenmem</h1>
              <p class="text-xs text-gray-500 font-medium">İlerlemenizi takip edin</p>
            </div>
          </div>
          
          <!-- Total XP Badge -->
          <div class="bg-brand-yellow/10 px-4 py-2 rounded-xl border-2 border-brand-yellow flex items-center space-x-2">
            <span class="material-symbols-rounded text-brand-yellow text-xl">bolt</span>
            <span class="font-extrabold text-brand-yellow">{{ game.xp() }}</span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="px-4 pt-6 space-y-6">
        
        <!-- Stats Overview -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Lessons Completed -->
          <div class="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-rounded text-brand-green text-3xl">check_circle</span>
              <span class="text-2xl font-extrabold text-gray-800">{{ completedLessons() }}</span>
            </div>
            <p class="text-xs text-gray-500 font-bold uppercase">Tamamlandı</p>
            <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-brand-green transition-all duration-500"
                [style.width.%]="game.progress()"
              ></div>
            </div>
          </div>

          <!-- Current Streak -->
          <div class="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-rounded text-brand-red text-3xl">local_fire_department</span>
              <span class="text-2xl font-extrabold text-gray-800">{{ game.streak() }}</span>
            </div>
            <p class="text-xs text-gray-500 font-bold uppercase">Gün Serisi</p>
            <p class="text-xs text-brand-red font-bold mt-2">Böyle devam et! 🔥</p>
          </div>

          <!-- Total Hearts -->
          <div class="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-rounded text-brand-red text-3xl fill-current">favorite</span>
              <span class="text-2xl font-extrabold text-gray-800">{{ game.hearts() }}</span>
            </div>
            <p class="text-xs text-gray-500 font-bold uppercase">Kalan Kalpler</p>
            <p class="text-xs text-gray-500 mt-2">Maks: 5 kalp</p>
          </div>

          <!-- Progress Percentage -->
          <div class="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-rounded text-brand-blue text-3xl">trending_up</span>
              <span class="text-2xl font-extrabold text-gray-800">{{ game.progress() }}%</span>
            </div>
            <p class="text-xs text-gray-500 font-bold uppercase">İlerleme</p>
            <p class="text-xs text-gray-500 mt-2">{{ totalLessons() - completedLessons() }} kaldı</p>
          </div>
        </div>

        <!-- Learning Path Summary -->
        <div class="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-extrabold text-gray-800">Öğrenme Yolu</h2>
            <span class="material-symbols-rounded text-gray-400">menu_book</span>
          </div>

          <!-- Unit 1 Progress -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">1</span>
                </div>
                <span class="font-bold text-gray-700">Temel Harfler</span>
              </div>
              <span class="text-sm font-bold text-gray-500">{{ unit1Completed() }}/{{ unit1Total() }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-brand-green transition-all duration-500"
                [style.width.%]="unit1Progress()"
              ></div>
            </div>
          </div>

          <!-- Unit 2 Progress -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">2</span>
                </div>
                <span class="font-bold text-gray-700">Harekeler (Sesli Harfler)</span>
              </div>
              <span class="text-sm font-bold text-gray-500">{{ unit2Completed() }}/{{ unit2Total() }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-brand-purple transition-all duration-500"
                [style.width.%]="unit2Progress()"
              ></div>
            </div>
          </div>
        </div>

        <!-- Achievements Section -->
        <div class="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-extrabold text-gray-800">Başarılar</h2>
            <span class="material-symbols-rounded text-brand-yellow">emoji_events</span>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <!-- First Lesson Achievement -->
            <div 
              class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
              [ngClass]="completedLessons() >= 1 ? 'bg-brand-yellow/10 border-brand-yellow' : 'bg-gray-50 border-gray-200 opacity-50'"
            >
              <span class="material-symbols-rounded text-3xl mb-1" 
                    [ngClass]="completedLessons() >= 1 ? 'text-brand-yellow' : 'text-gray-400'">
                star
              </span>
              <span class="text-xs font-bold text-center text-gray-600">İlk Adım</span>
            </div>

            <!-- 5 Lessons Achievement -->
            <div 
              class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
              [ngClass]="completedLessons() >= 5 ? 'bg-brand-green/10 border-brand-green' : 'bg-gray-50 border-gray-200 opacity-50'"
            >
              <span class="material-symbols-rounded text-3xl mb-1"
                    [ngClass]="completedLessons() >= 5 ? 'text-brand-green' : 'text-gray-400'">
                workspace_premium
              </span>
              <span class="text-xs font-bold text-center text-gray-600">5 Ders</span>
            </div>

            <!-- 10 Lessons Achievement -->
            <div 
              class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
              [ngClass]="completedLessons() >= 10 ? 'bg-brand-blue/10 border-brand-blue' : 'bg-gray-50 border-gray-200 opacity-50'"
            >
              <span class="material-symbols-rounded text-3xl mb-1"
                    [ngClass]="completedLessons() >= 10 ? 'text-brand-blue' : 'text-gray-400'">
                military_tech
              </span>
              <span class="text-xs font-bold text-center text-gray-600">10 Ders</span>
            </div>

            <!-- Streak Achievement -->
            <div 
              class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
              [ngClass]="game.streak() >= 3 ? 'bg-brand-red/10 border-brand-red' : 'bg-gray-50 border-gray-200 opacity-50'"
            >
              <span class="material-symbols-rounded text-3xl mb-1"
                    [ngClass]="game.streak() >= 3 ? 'text-brand-red' : 'text-gray-400'">
                local_fire_department
              </span>
              <span class="text-xs font-bold text-center text-gray-600">3 Gün Serisi</span>
            </div>

            <!-- Unit 1 Complete -->
            <div 
              class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
              [ngClass]="unit1Progress() === 100 ? 'bg-brand-green/10 border-brand-green' : 'bg-gray-50 border-gray-200 opacity-50'"
            >
              <span class="material-symbols-rounded text-3xl mb-1"
                    [ngClass]="unit1Progress() === 100 ? 'text-brand-green' : 'text-gray-400'">
                check_circle
              </span>
              <span class="text-xs font-bold text-center text-gray-600">Ünite 1</span>
            </div>

            <!-- Perfect Score -->
            <div 
              class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
              [ngClass]="game.progress() === 100 ? 'bg-brand-purple/10 border-brand-purple' : 'bg-gray-50 border-gray-200 opacity-50'"
            >
              <span class="material-symbols-rounded text-3xl mb-1"
                    [ngClass]="game.progress() === 100 ? 'text-brand-purple' : 'text-gray-400'">
                emoji_events
              </span>
              <span class="text-xs font-bold text-center text-gray-600">Mükemmel!</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
          <h2 class="text-lg font-extrabold text-gray-800 mb-4">Hızlı İşlemler</h2>
          
          <div class="space-y-3">
            <button 
              (click)="continueLesson()"
              class="w-full bg-brand-green text-white font-bold py-4 rounded-xl border-b-4 border-brand-greenDark active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2"
            >
              <span class="material-symbols-rounded">play_arrow</span>
              <span>Öğrenmeye Devam Et</span>
            </button>

            <button 
              (click)="reviewLessons()"
              class="w-full bg-white text-brand-blue font-bold py-4 rounded-xl border-2 border-brand-blue active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span class="material-symbols-rounded">refresh</span>
              <span>Dersleri Gözden Geçir</span>
            </button>
          </div>
        </div>

      </div>

      <app-bottom-nav></app-bottom-nav>
    </div>
  `
})
export class SchoolComponent {
  game = inject(GameService);
  router = inject(Router);

  completedLessons = computed(() => 
    this.game.lessons().filter(l => l.completed).length
  );

  totalLessons = computed(() => 
    this.game.lessons().length
  );

  unit1Lessons = computed(() => 
    this.game.lessons().filter(l => l.unit === 1)
  );

  unit2Lessons = computed(() => 
    this.game.lessons().filter(l => l.unit === 2)
  );

  unit1Completed = computed(() => 
    this.unit1Lessons().filter(l => l.completed).length
  );

  unit1Total = computed(() => 
    this.unit1Lessons().length
  );

  unit1Progress = computed(() => 
    Math.round((this.unit1Completed() / this.unit1Total()) * 100)
  );

  unit2Completed = computed(() => 
    this.unit2Lessons().filter(l => l.completed).length
  );

  unit2Total = computed(() => 
    this.unit2Lessons().length
  );

  unit2Progress = computed(() => 
    Math.round((this.unit2Completed() / this.unit2Total()) * 100)
  );

  continueLesson() {
    // Find the first unlocked, uncompleted lesson
    const nextLesson = this.game.lessons().find(l => !l.locked && !l.completed);
    if (nextLesson) {
      this.router.navigate(['/lesson', nextLesson.id]);
    } else {
      // If all lessons are completed, go to first lesson
      this.router.navigate(['/lesson', '1']);
    }
  }

  reviewLessons() {
    // Go to home page to see all lessons
    this.router.navigate(['/home']);
  }
}
