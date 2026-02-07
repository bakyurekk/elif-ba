import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-brand-gray h-20 pb-4 px-4 flex justify-around items-center z-50">
      <a routerLink="/home" routerLinkActive="text-brand-green" [routerLinkActiveOptions]="{exact: true}" 
         class="flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 rounded-xl p-2 w-16 transition-colors">
        <span class="material-symbols-rounded text-3xl mb-1">home</span>
        <span class="text-xs font-bold uppercase hidden">Home</span>
      </a>
      
      <a routerLink="/leaderboard" routerLinkActive="text-brand-yellow"
         class="flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 rounded-xl p-2 w-16 transition-colors">
        <span class="material-symbols-rounded text-3xl mb-1">leaderboard</span>
      </a>

      <a routerLink="/school" routerLinkActive="text-brand-purple"
         class="flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 rounded-xl p-2 w-16 transition-colors">
         <span class="material-symbols-rounded text-3xl mb-1">school</span>
      </a>

      <a routerLink="/profile" routerLinkActive="text-brand-blue" 
         class="flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 rounded-xl p-2 w-16 transition-colors">
         <span class="material-symbols-rounded text-3xl mb-1">face</span>
      </a>
    </nav>
  `
})
export class BottomNavComponent {}