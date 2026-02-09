import { Component, inject, signal, computed } from '@angular/core';
import { GameService } from '../services/game.service';
import { BottomNavComponent } from './bottom-nav.component';
import { NgClass, NgOptimizedImage } from '@angular/common';

interface RankUser {
  id: string;
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser: boolean;
  trend?: 'UP' | 'DOWN' | 'SAME';
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [BottomNavComponent, NgClass, NgOptimizedImage],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24">
       <!-- Header -->
       <div class="bg-white border-b-2 border-gray-100 sticky top-0 z-10 px-4 pt-4 pb-2 shadow-sm">
          <h1 class="text-xl font-extrabold text-gray-700 text-center w-full uppercase tracking-widest mb-1">
            {{ game.userType() === 'CHILD' ? 'Yıldız Öğrenciler' : 'Liderlik Tablosu' }}
          </h1>
          <p class="text-center text-xs font-bold text-gray-400 mb-4">
            {{ game.userType() === 'CHILD' ? 'Tüm bu yıldızlara bakın!' : 'Bu hafta nasıl karşılaştığınızı görün' }}
          </p>

          <!-- Tabs -->
          <div class="bg-gray-100 p-1 rounded-xl flex font-bold text-sm">
             <button (click)="tab.set('WEEKLY')" 
                     class="flex-1 py-2 rounded-lg transition-all duration-200"
                     [ngClass]="tab() === 'WEEKLY' ? 'bg-white text-brand-green shadow-sm scale-100' : 'text-gray-400 hover:text-gray-500'">
                Haftalık
             </button>
             <button (click)="tab.set('ALL_TIME')" 
                     class="flex-1 py-2 rounded-lg transition-all duration-200"
                     [ngClass]="tab() === 'ALL_TIME' ? 'bg-white text-brand-green shadow-sm scale-100' : 'text-gray-400 hover:text-gray-500'">
                Tüm Zamanlar
             </button>
          </div>
       </div>

       <!-- List -->
       <div class="p-4 space-y-3">
          @for (user of currentList(); track user.id) {
             <div (click)="openProfile(user)" 
                  class="relative rounded-2xl p-4 flex items-center bg-white border-2 border-b-4 active:scale-95 transition-all cursor-pointer"
                  [ngClass]="getRowClass(user)">
                  
                  <!-- Rank Badge -->
                  <div class="w-10 flex-shrink-0 flex justify-center">
                     @if (user.rank === 1) {
                        <span class="material-symbols-rounded text-3xl text-brand-yellow drop-shadow-sm animate-bounce-short">emoji_events</span>
                     } @else if (user.rank === 2) {
                        <span class="material-symbols-rounded text-3xl text-gray-400 drop-shadow-sm">emoji_events</span>
                     } @else if (user.rank === 3) {
                        <span class="material-symbols-rounded text-3xl text-orange-400 drop-shadow-sm">emoji_events</span>
                     } @else {
                        <span class="font-extrabold text-lg text-gray-400">#{{ user.rank }}</span>
                     }
                  </div>

                  <!-- Avatar -->
                  <div class="relative mx-3">
                     <img [ngSrc]="user.avatar" width="48" height="48" class="rounded-full border-2 border-gray-100" [alt]="user.name">
                     @if(user.isCurrentUser) {
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-green rounded-full border-2 border-white"></div>
                     }
                  </div>

                  <!-- Info -->
                  <div class="flex-1">
                     <h3 class="font-bold text-gray-800" [ngClass]="{'text-brand-green': user.isCurrentUser}">
                        {{ user.isCurrentUser ? 'Sen' : user.name }}
                     </h3>
                     @if(user.trend === 'UP') {
                        <div class="flex items-center text-[10px] font-bold text-brand-green">
                           <span class="material-symbols-rounded text-sm">arrow_drop_up</span> Yükselişte
                        </div>
                     }
                  </div>

                  <!-- XP -->
                  <div class="flex flex-col items-end">
                     <span class="font-extrabold text-gray-700">{{ user.xp }} XP</span>
                  </div>
             </div>
          }
       </div>

       <!-- Sticky "Your Rank" Footer (If scrolled or not visible? Always showing is easier for prototype) -->
       <div class="fixed bottom-20 left-4 right-4 bg-gray-800 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-b-4 border-gray-900 animate-pop z-20">
            <div class="flex items-center">
                <div class="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center font-bold mr-3 border-2 border-brand-greenDark">
                    #{{ currentUserStats()?.rank ?? '-' }}
                </div>
                <div>
                   <div class="font-bold text-sm text-gray-300 uppercase">Sıralaman</div>
                   <div class="font-extrabold text-white text-lg">{{ currentUserStats()?.xp }} XP</div>
                </div>
            </div>
            
            <div class="flex flex-col items-end">
                 <div class="text-xs font-bold text-brand-yellow mb-1">
                    {{ nextRankDiff() }} XP sonraki sıraya
                 </div>
                 <!-- Mini Progress bar -->
                 <div class="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                     <div class="h-full bg-brand-yellow rounded-full" style="width: 70%"></div>
                 </div>
            </div>
       </div>

       <!-- Profile Modal -->
       @if (selectedUser()) {
          <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-pop" (click)="closeProfile()">
              <div class="bg-white w-full max-w-xs rounded-3xl p-6 relative text-center shadow-2xl" (click)="$event.stopPropagation()">
                  <button class="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 rounded-full p-1" (click)="closeProfile()">
                     <span class="material-symbols-rounded">close</span>
                  </button>
                  
                  <div class="relative w-24 h-24 mx-auto mb-4">
                     <img [ngSrc]="selectedUser()!.avatar" width="96" height="96" class="rounded-full border-4 border-gray-100 shadow-md">
                     <div class="absolute bottom-0 right-0 bg-brand-yellow rounded-full p-1 border-2 border-white">
                        <span class="material-symbols-rounded text-white text-sm">star</span>
                     </div>
                  </div>

                  <h2 class="text-2xl font-extrabold text-gray-800 mb-1">{{ selectedUser()!.name }}</h2>
                  <p class="text-brand-green font-bold text-sm mb-6">Seviye 3 Bilgin</p>

                  <div class="grid grid-cols-2 gap-4 mb-6">
                      <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <span class="block font-extrabold text-xl text-gray-700">{{ selectedUser()!.xp }}</span>
                          <span class="text-[10px] text-gray-400 font-bold uppercase">Toplam XP</span>
                      </div>
                      <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
                           <span class="block font-extrabold text-xl text-brand-red">#{{ selectedUser()!.rank }}</span>
                           <span class="text-[10px] text-gray-400 font-bold uppercase">Sıralama</span>
                      </div>
                  </div>

                  <button (click)="closeProfile()" class="w-full bg-brand-blue text-white font-bold py-3 rounded-xl border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide btn-3d">
                      Çak Bir Beşlik! 👋
                  </button>
              </div>
          </div>
       }

       <app-bottom-nav></app-bottom-nav>
    </div>
  `
})
export class LeaderboardComponent {
  game = inject(GameService);
  tab = signal<'WEEKLY' | 'ALL_TIME'>('WEEKLY');
  selectedUser = signal<RankUser | null>(null);

  // Mock Data Generators
  private avatars = [
      'https://picsum.photos/100/100?random=10',
      'https://picsum.photos/100/100?random=11',
      'https://picsum.photos/100/100?random=12',
      'https://picsum.photos/100/100?random=13',
      'https://picsum.photos/100/100?random=14',
      'https://picsum.photos/100/100?random=15',
  ];

  weeklyData = computed<RankUser[]>(() => {
     // User is dynamically inserted based on game service XP for demo purposes
     const userXp = this.game.xp(); // e.g. 135
     
     const list: RankUser[] = [
         { id: 'u1', rank: 1, name: 'Fatima', xp: 450, avatar: this.avatars[0], isCurrentUser: false, trend: 'UP' },
         { id: 'u2', rank: 2, name: 'Omar', xp: 380, avatar: this.avatars[1], isCurrentUser: false, trend: 'SAME' },
         { id: 'u3', rank: 3, name: 'Layla', xp: 320, avatar: this.avatars[2], isCurrentUser: false, trend: 'UP' },
         { id: 'u4', rank: 4, name: 'Zayn', xp: 210, avatar: this.avatars[3], isCurrentUser: false, trend: 'DOWN' },
         { id: 'me', rank: 5, name: 'You', xp: userXp, avatar: 'https://picsum.photos/100/100?random=1', isCurrentUser: true, trend: 'UP' },
         { id: 'u5', rank: 6, name: 'Aisha', xp: 90, avatar: this.avatars[4], isCurrentUser: false, trend: 'SAME' },
         { id: 'u6', rank: 7, name: 'Hassan', xp: 45, avatar: this.avatars[5], isCurrentUser: false, trend: 'DOWN' },
     ];
     // Sort by XP
     return list.sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
  });

  allTimeData = computed<RankUser[]>(() => {
     const userXp = this.game.xp() + 500; // Mock historical data
     const list: RankUser[] = [
         { id: 'u1', rank: 1, name: 'Fatima', xp: 2450, avatar: this.avatars[0], isCurrentUser: false },
         { id: 'u3', rank: 2, name: 'Layla', xp: 1900, avatar: this.avatars[2], isCurrentUser: false },
         { id: 'u2', rank: 3, name: 'Omar', xp: 1850, avatar: this.avatars[1], isCurrentUser: false },
         { id: 'me', rank: 4, name: 'You', xp: userXp, avatar: 'https://picsum.photos/100/100?random=1', isCurrentUser: true },
         { id: 'u4', rank: 5, name: 'Zayn', xp: 600, avatar: this.avatars[3], isCurrentUser: false },
     ];
     return list.sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
  });

  currentList = computed(() => this.tab() === 'WEEKLY' ? this.weeklyData() : this.allTimeData());

  currentUserStats = computed(() => this.currentList().find(u => u.isCurrentUser));

  nextRankDiff = computed(() => {
     const me = this.currentUserStats();
     if (!me || me.rank === 1) return 0;
     const personAbove = this.currentList().find(u => u.rank === me.rank - 1);
     return personAbove ? (personAbove.xp - me.xp) + 10 : 0;
  });

  getRowClass(user: RankUser): string {
     let classes = '';
     if (user.isCurrentUser) {
        classes += 'border-brand-green bg-green-50 ';
     } else {
        classes += 'border-gray-200 ';
     }

     if (user.rank === 1) classes += 'border-brand-yellow/50 ';
     if (user.rank === 2) classes += 'border-gray-300 ';
     if (user.rank === 3) classes += 'border-orange-200 ';

     return classes;
  }

  openProfile(user: RankUser) {
      this.selectedUser.set(user);
  }

  closeProfile() {
      this.selectedUser.set(null);
  }
}