import { Component, inject, signal, computed } from '@angular/core';
import { GameService } from '../services/game.service';
import { BottomNavComponent } from './bottom-nav.component';
import { NgOptimizedImage, NgClass } from '@angular/common';

interface DailyStat {
  id: number;
  day: string; 
  fullDay: string; 
  status: 'COMPLETED' | 'MISSED' | 'CURRENT' | 'FUTURE';
  xp: number;
  lessons: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [BottomNavComponent, NgOptimizedImage, NgClass],
  template: `
    <div class="min-h-screen bg-white pb-24">
       <!-- Header -->
       <div class="border-b-2 border-brand-gray px-4 py-4 flex justify-between items-center bg-white sticky top-0 z-10">
          <h1 class="text-xl font-bold text-gray-400 uppercase tracking-widest text-center w-full">Profil</h1>
          <button class="absolute right-4 text-brand-blue font-bold uppercase text-sm hover:bg-blue-50 px-3 py-1 rounded-xl transition-colors">Ayarlar</button>
       </div>

       <!-- User Info -->
       <div class="p-6 flex flex-col items-center border-b-2 border-gray-100">
           <!-- Avatar -->
           <div class="relative mb-4">
              <img ngSrc="https://picsum.photos/400/400?random=1" priority width="120" height="120" class="rounded-full border-4 border-dashed border-brand-green p-1">
              <div class="absolute bottom-0 right-0 bg-brand-blue rounded-full p-2 border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                  <span class="material-symbols-rounded text-white text-sm">edit</span>
              </div>
           </div>
           
           <h2 class="text-2xl font-extrabold text-gray-800">Öğrenci</h2>
           <p class="text-gray-500 font-medium">Eylül 2023'te katıldı</p>
           
           <!-- User Type Badge -->
           <div class="mt-2 bg-brand-gray/20 px-3 py-1 rounded-lg text-xs font-bold uppercase text-gray-500 tracking-wide">
               {{ game.userType() }} HESABI
           </div>
           
           <div class="flex space-x-6 mt-6 w-full justify-center">
               <div class="flex flex-col items-center">
                   <span class="material-symbols-rounded text-brand-yellow text-2xl">bolt</span>
                   <span class="font-extrabold text-gray-700 text-xl">{{ game.xp() }}</span>
                   <span class="text-xs text-gray-400 font-bold uppercase">Toplam XP</span>
               </div>
               <div class="flex flex-col items-center">
                   <span class="material-symbols-rounded text-brand-red text-2xl">local_fire_department</span>
                   <span class="font-extrabold text-gray-700 text-xl">{{ game.streak() }}</span>
                   <span class="text-xs text-gray-400 font-bold uppercase">Gün Serisi</span>
               </div>
               <div class="flex flex-col items-center">
                   <span class="material-symbols-rounded text-brand-purple text-2xl">military_tech</span>
                   <span class="font-extrabold text-gray-700 text-xl">Bronz</span>
                   <span class="text-xs text-gray-400 font-bold uppercase">Lig</span>
               </div>
           </div>
       </div>

       <!-- Weekly Activity Section -->
       <div class="p-6 border-b-2 border-gray-100">
            <div class="mb-6 flex justify-between items-start">
                <div>
                    <h3 class="font-extrabold text-xl text-gray-800">Haftalık Aktivite</h3>
                    <p class="text-gray-500 font-medium text-sm">Hedef: {{ game.dailyGoal() }} dk / gün</p>
                </div>
                <div class="bg-brand-blue/10 rounded-lg p-2">
                    <span class="material-symbols-rounded text-brand-blue">target</span>
                </div>
            </div>

            <!-- Tracker -->
            <div class="flex justify-between items-start mb-8 px-1">
                @for(day of weekStats(); track day.id) {
                    <div (click)="selectDay(day)" class="flex flex-col items-center cursor-pointer group relative">
                        <!-- Day Label -->
                        <span class="text-xs font-bold mb-3 uppercase transition-colors"
                              [ngClass]="{'text-brand-green': day.status === 'CURRENT', 'text-gray-400': day.status !== 'CURRENT'}">
                            {{ day.day }}
                        </span>

                        <!-- Indicator -->
                        <div class="w-10 h-10 rounded-full flex items-center justify-center border-b-4 transition-all duration-300"
                             [ngClass]="getDayStyles(day)">
                            
                             @if(day.status === 'COMPLETED') {
                                 <span class="material-symbols-rounded text-xl animate-pop">check</span>
                             }
                             @if(day.status === 'MISSED') {
                                 <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                             }
                             @if(day.status === 'CURRENT') {
                                 <span class="material-symbols-rounded text-xl animate-pulse">edit</span>
                             }
                             @if(day.status === 'FUTURE') {
                                 <span class="text-gray-200 font-bold text-lg">-</span>
                             }
                        </div>
                        
                        <!-- Selection Indicator -->
                        @if(selectedDay()?.id === day.id) {
                            <div class="absolute -bottom-4 w-3 h-3 bg-gray-800 rotate-45 animate-pop"></div>
                        }
                    </div>
                }
            </div>

            <!-- Selected Day Detail Card -->
            @if(selectedDay(); as day) {
                 <div class="bg-gray-800 text-white rounded-2xl p-4 flex justify-between items-center animate-pop mb-6 shadow-xl shadow-gray-200">
                    <div>
                       <div class="font-extrabold text-lg">{{ day.fullDay }}</div>
                       <div class="text-sm opacity-80 font-medium">
                          {{ day.lessons > 0 ? day.lessons + ' ders tamamlandı' : (day.status === 'FUTURE' ? 'Yaklaşan' : 'Tamamlanan ders yok') }}
                       </div>
                    </div>
                    <div class="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl">
                        <span class="material-symbols-rounded text-brand-yellow">bolt</span>
                        <span class="font-extrabold text-brand-yellow">{{ day.xp }} XP</span>
                    </div>
                 </div>
            }

            <!-- Weekly Summary Grid -->
            <div class="grid grid-cols-2 gap-3">
                 <div class="border-2 border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50">
                     <span class="text-2xl font-extrabold text-gray-700">{{ totalWeekLessons() }}</span>
                     <span class="text-xs font-bold text-gray-400 uppercase">Bu Hafta Dersler</span>
                 </div>
                 <div class="border-2 border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50">
                     <span class="text-2xl font-extrabold text-brand-yellow">{{ totalWeekXp() }}</span>
                     <span class="text-xs font-bold text-gray-400 uppercase">Bu Hafta XP</span>
                 </div>
                 <div class="border-2 border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50">
                     <div class="flex items-center">
                        <span class="material-symbols-rounded text-brand-red mr-1">local_fire_department</span>
                        <span class="text-2xl font-extrabold text-gray-700">{{ game.streak() }}</span>
                     </div>
                     <span class="text-xs font-bold text-gray-400 uppercase">Mevcut Seri</span>
                 </div>
                 <div class="border-2 border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50">
                      <div class="flex items-center">
                        <span class="material-symbols-rounded text-brand-yellow mr-1">emoji_events</span>
                        <span class="text-2xl font-extrabold text-gray-700">14</span>
                     </div>
                     <span class="text-xs font-bold text-gray-400 uppercase">En İyi Seri</span>
                 </div>
            </div>
       </div>

       <!-- Stats Section -->
       <div class="p-6">
          <h3 class="font-extrabold text-xl text-gray-800 mb-4">Kurs İstatistikleri</h3>
          
          <div class="grid grid-cols-2 gap-4">
             <div class="border-2 border-gray-200 rounded-2xl p-4 flex items-center space-x-3">
                 <span class="material-symbols-rounded text-brand-green text-3xl">check_circle</span>
                 <div>
                    <div class="font-extrabold text-lg text-gray-700">{{ game.progress() }}%</div>
                    <div class="text-xs text-gray-400 font-bold uppercase">Kurs</div>
                 </div>
             </div>
             
             <div class="border-2 border-gray-200 rounded-2xl p-4 flex items-center space-x-3">
                 <span class="material-symbols-rounded text-brand-blue text-3xl">school</span>
                 <div>
                    <div class="font-extrabold text-lg text-gray-700">24</div>
                    <div class="text-xs text-gray-400 font-bold uppercase">Kelimeler</div>
                 </div>
             </div>
          </div>
       </div>

       <!-- Achievements -->
       <div class="p-6 pt-0">
          <div class="flex justify-between items-end mb-4">
             <h3 class="font-extrabold text-xl text-gray-800">Başarılar</h3>
             <button class="text-brand-blue font-bold uppercase text-xs">Tümünü Gör</button>
          </div>

          <div class="space-y-4">
              <div class="border-2 border-gray-200 rounded-2xl p-4 flex items-center space-x-4">
                  <div class="w-16 h-16 bg-brand-yellow rounded-xl flex items-center justify-center border-b-4 border-brand-yellowDark">
                      <span class="material-symbols-rounded text-white text-3xl">local_fire_department</span>
                  </div>
                  <div class="flex-1">
                      <h4 class="font-extrabold text-gray-700">Ateş</h4>
                      <p class="text-sm text-gray-500 font-medium mb-2">3 günlük seri yapın</p>
                      <!-- Progress Bar -->
                      <div class="w-full bg-gray-200 rounded-full h-3">
                          <div class="bg-brand-yellow h-3 rounded-full" style="width: 100%"></div>
                      </div>
                  </div>
              </div>

              <div class="border-2 border-gray-200 rounded-2xl p-4 flex items-center space-x-4 opacity-70">
                  <div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center border-b-4 border-gray-300">
                      <span class="material-symbols-rounded text-white text-3xl">menu_book</span>
                  </div>
                  <div class="flex-1">
                      <h4 class="font-extrabold text-gray-500">Bilgin</h4>
                      <p class="text-sm text-gray-400 font-medium mb-2">50 yeni kelime öğrenin</p>
                       <div class="w-full bg-gray-200 rounded-full h-3">
                          <div class="bg-brand-green h-3 rounded-full" style="width: 15%"></div>
                      </div>
                  </div>
              </div>
          </div>
       </div>

       <app-bottom-nav></app-bottom-nav>
    </div>
  `
})
export class ProfileComponent {
  game = inject(GameService);

  weekStats = signal<DailyStat[]>([
    { id: 1, day: 'P', fullDay: 'Pazartesi', status: 'COMPLETED', xp: 45, lessons: 3 },
    { id: 2, day: 'S', fullDay: 'Salı', status: 'COMPLETED', xp: 30, lessons: 2 },
    { id: 3, day: 'Ç', fullDay: 'Çarşamba', status: 'COMPLETED', xp: 15, lessons: 1 },
    { id: 4, day: 'P', fullDay: 'Perşembe', status: 'MISSED', xp: 0, lessons: 0 },
    { id: 5, day: 'C', fullDay: 'Cuma', status: 'CURRENT', xp: 10, lessons: 1 },
    { id: 6, day: 'C', fullDay: 'Cumartesi', status: 'FUTURE', xp: 0, lessons: 0 },
    { id: 7, day: 'P', fullDay: 'Pazar', status: 'FUTURE', xp: 0, lessons: 0 },
  ]);

  selectedDay = signal<DailyStat | null>(this.weekStats()[4]);

  totalWeekXp = computed(() => this.weekStats().reduce((acc, d) => acc + d.xp, 0));
  totalWeekLessons = computed(() => this.weekStats().reduce((acc, d) => acc + d.lessons, 0));

  selectDay(day: DailyStat) {
      this.selectedDay.set(day);
  }

  getDayStyles(day: DailyStat): string {
      switch (day.status) {
          case 'COMPLETED':
              return 'bg-brand-green border-brand-greenDark text-white shadow-lg active:scale-95';
          case 'MISSED':
              return 'bg-gray-100 border-gray-200 text-gray-400';
          case 'CURRENT':
              return 'bg-white border-brand-green text-brand-green border-dashed shadow-lg shadow-brand-green/20';
          case 'FUTURE':
              return 'bg-white border-gray-100 text-gray-200';
          default:
              return '';
      }
  }
}