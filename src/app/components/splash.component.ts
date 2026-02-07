import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <div class="h-screen w-full flex flex-col items-center justify-center bg-white px-6">
      <div class="flex-1 flex flex-col items-center justify-center w-full">
        <!-- Logo Text -->
        <h1 class="text-4xl font-extrabold text-brand-green mb-8 tracking-wider">Elif-BA</h1>
        
        <!-- Mascot Image -->
        <div class="relative w-64 h-64 mb-10 animate-pop">
           <img ngSrc="https://picsum.photos/400/400?random=1" priority width="400" height="400" alt="Mascot" class="rounded-full border-8 border-brand-gray shadow-xl object-cover w-full h-full">
        </div>

        <p class="text-xl text-gray-500 font-bold text-center max-w-xs leading-relaxed">
          The free, fun, and effective way to learn Arabic letters!
        </p>
      </div>

      <div class="w-full space-y-4 mb-8">
        <a routerLink="/onboarding" class="block w-full text-center bg-brand-green text-white font-bold text-lg py-4 rounded-2xl border-b-4 border-brand-greenDark active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide">
          Get Started
        </a>
        
        <button class="block w-full text-center bg-white text-brand-green font-bold text-lg py-4 rounded-2xl border-2 border-brand-gray border-b-4 active:border-b-2 active:translate-y-0.5 transition-all uppercase tracking-wide">
          I already have an account
        </button>
      </div>
    </div>
  `
})
export class SplashComponent {}