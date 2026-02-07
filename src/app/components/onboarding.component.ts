import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="h-screen w-full flex flex-col bg-white">
      <!-- Top Bar -->
      <div class="flex items-center justify-between p-4">
        @if(step() > 0) {
          <button (click)="prev()" class="text-gray-400 hover:bg-gray-100 p-2 rounded-xl transition-colors">
             <span class="material-symbols-rounded">arrow_back</span>
          </button>
        } @else {
          <div></div>
        }
        
        <!-- Progress Dots -->
        <div class="flex space-x-2">
          @for(s of [0,1,2,3,4]; track s) {
            <div class="w-2 h-2 rounded-full transition-colors duration-300" 
                 [ngClass]="{'bg-brand-green': step() === s, 'bg-gray-200': step() !== s}"></div>
          }
        </div>
        
        <button (click)="skip()" class="text-gray-400 font-bold uppercase text-sm hover:bg-gray-100 px-3 py-2 rounded-xl">Skip</button>
      </div>

      <!-- Content Area -->
      <div class="flex-1 flex flex-col items-center justify-center px-6 text-center overflow-y-auto">
        
        <!-- Step 0: Intro 1 -->
        @if (step() === 0) {
          <div class="animate-pop w-full flex flex-col items-center">
            <div class="w-64 h-64 bg-brand-yellow/20 rounded-full flex items-center justify-center mb-8 relative">
               <span class="material-symbols-rounded text-brand-yellow text-9xl">school</span>
               <span class="absolute top-10 right-4 text-4xl text-brand-green font-bold animate-bounce-short">ا</span>
               <span class="absolute bottom-10 left-4 text-4xl text-brand-blue font-bold animate-bounce-short" style="animation-delay: 0.2s">ب</span>
            </div>
            <h2 class="text-2xl font-extrabold text-gray-700 mb-4">Learn Elif-Ba Easily</h2>
            <p class="text-lg text-gray-500 font-medium">Start from zero with simple, bite-sized lessons designed for everyone.</p>
          </div>
        }

        <!-- Step 1: Intro 2 -->
        @if (step() === 1) {
          <div class="animate-pop w-full flex flex-col items-center">
            <div class="w-64 h-64 bg-brand-purple/20 rounded-full flex items-center justify-center mb-8">
               <span class="material-symbols-rounded text-brand-purple text-9xl">stadia_controller</span>
            </div>
            <h2 class="text-2xl font-extrabold text-gray-700 mb-4">Learn by Playing</h2>
            <p class="text-lg text-gray-500 font-medium">Gamified lessons make learning Arabic alphabet fun and addictive.</p>
          </div>
        }

        <!-- Step 2: Intro 3 -->
        @if (step() === 2) {
          <div class="animate-pop w-full flex flex-col items-center">
             <div class="w-64 h-64 bg-brand-blue/20 rounded-full flex items-center justify-center mb-8">
               <span class="material-symbols-rounded text-brand-blue text-9xl">monitoring</span>
            </div>
            <h2 class="text-2xl font-extrabold text-gray-700 mb-4">Track Your Progress</h2>
            <p class="text-lg text-gray-500 font-medium">Earn XP, keep your streak alive, and master the alphabet!</p>
          </div>
        }

        <!-- Step 3: Who is this for? -->
        @if (step() === 3) {
          <div class="animate-pop w-full flex flex-col items-center">
             <h2 class="text-2xl font-extrabold text-gray-700 mb-8">Who will use Elif-BA?</h2>
             
             <div class="w-full space-y-4">
                 <!-- Child Option -->
                 <div (click)="selectUserType('CHILD')" 
                      class="border-2 rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all active:scale-95"
                      [ngClass]="game.userType() === 'CHILD' ? 'border-brand-green bg-green-50 shadow-lg' : 'border-gray-200 bg-white'">
                     <div class="w-20 h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center mb-4">
                        <span class="material-symbols-rounded text-brand-yellow text-5xl">child_care</span>
                     </div>
                     <h3 class="font-bold text-xl text-gray-800 mb-2">My Child</h3>
                     <p class="text-sm text-gray-500 font-medium">Playful lessons with extra encouragement</p>
                 </div>

                 <!-- Adult Option -->
                 <div (click)="selectUserType('ADULT')" 
                      class="border-2 rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all active:scale-95"
                      [ngClass]="game.userType() === 'ADULT' ? 'border-brand-blue bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'">
                     <div class="w-20 h-20 bg-brand-blue/20 rounded-full flex items-center justify-center mb-4">
                        <span class="material-symbols-rounded text-brand-blue text-5xl">person</span>
                     </div>
                     <h3 class="font-bold text-xl text-gray-800 mb-2">Myself</h3>
                     <p class="text-sm text-gray-500 font-medium">Clear explanations and focused learning</p>
                 </div>
             </div>
          </div>
        }

        <!-- Step 4: Daily Goal -->
        @if (step() === 4) {
          <div class="animate-pop w-full flex flex-col items-center">
             <h2 class="text-2xl font-extrabold text-gray-700 mb-2">How much time to study?</h2>
             <p class="text-gray-500 font-medium mb-8">Small steps every day make a big difference.</p>
             
             <div class="w-full space-y-3">
                 <!-- 5 Mins -->
                 <div (click)="selectGoal(5)" 
                      class="border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-95"
                      [ngClass]="game.dailyGoal() === 5 ? 'border-brand-green bg-green-50 shadow-md ring-2 ring-brand-green ring-offset-2' : 'border-gray-200 bg-white'">
                      <div class="flex flex-col text-left">
                          <span class="font-extrabold text-lg text-gray-700">5 minutes / day</span>
                          <span class="text-sm text-gray-500 font-bold">Easy & relaxed</span>
                      </div>
                      <div class="bg-white/50 px-3 py-1 rounded-lg border border-gray-100 text-brand-yellow font-extrabold text-sm shadow-sm">
                          10 XP
                      </div>
                 </div>

                 <!-- 10 Mins -->
                 <div (click)="selectGoal(10)" 
                      class="border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-95 relative overflow-hidden"
                      [ngClass]="game.dailyGoal() === 10 ? 'border-brand-green bg-green-50 shadow-md ring-2 ring-brand-green ring-offset-2' : 'border-gray-200 bg-white'">
                      @if(game.dailyGoal() === 10) {
                          <div class="absolute top-0 right-0 bg-brand-green text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">RECOMMENDED</div>
                      }
                      <div class="flex flex-col text-left">
                          <span class="font-extrabold text-lg text-gray-700">10 minutes / day</span>
                          <span class="text-sm text-gray-500 font-bold">Standard</span>
                      </div>
                      <div class="bg-white/50 px-3 py-1 rounded-lg border border-gray-100 text-brand-yellow font-extrabold text-sm shadow-sm">
                          20 XP
                      </div>
                 </div>

                 <!-- 15 Mins -->
                 <div (click)="selectGoal(15)" 
                      class="border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-95"
                      [ngClass]="game.dailyGoal() === 15 ? 'border-brand-green bg-green-50 shadow-md ring-2 ring-brand-green ring-offset-2' : 'border-gray-200 bg-white'">
                      <div class="flex flex-col text-left">
                          <span class="font-extrabold text-lg text-gray-700">15 minutes / day</span>
                          <span class="text-sm text-gray-500 font-bold">Serious learner</span>
                      </div>
                      <div class="bg-white/50 px-3 py-1 rounded-lg border border-gray-100 text-brand-yellow font-extrabold text-sm shadow-sm">
                          30 XP
                      </div>
                 </div>
             </div>
          </div>
        }

      </div>

      <!-- Bottom Action -->
      <div class="p-6 border-t border-gray-100">
        <button (click)="next()" class="w-full bg-brand-green text-white font-bold text-lg py-4 rounded-2xl border-b-4 border-brand-greenDark active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide shadow-lg shadow-brand-green/30">
          {{ step() === 4 ? 'Set Daily Goal' : 'Continue' }}
        </button>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  step = signal(0);
  game = inject(GameService);
  router = inject(Router);

  selectUserType(type: 'CHILD' | 'ADULT') {
      this.game.userType.set(type);
  }

  selectGoal(mins: number) {
      this.game.dailyGoal.set(mins);
  }

  next() {
    if (this.step() < 4) {
      this.step.update(s => s + 1);
    } else {
      this.router.navigate(['/home']);
    }
  }

  prev() {
    if (this.step() > 0) {
      this.step.update(s => s - 1);
    }
  }

  skip() {
    this.router.navigate(['/home']);
  }
}