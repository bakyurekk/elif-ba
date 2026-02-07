import { Routes } from '@angular/router';
import { SplashComponent } from './components/splash.component';
import { OnboardingComponent } from './components/onboarding.component';
import { HomeComponent } from './components/home.component';
import { LessonContainerComponent } from './components/lesson-container.component';
import { ProfileComponent } from './components/profile.component';
import { LeaderboardComponent } from './components/leaderboard.component';
import { SchoolComponent } from './components/school.component';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'lesson/:id', component: LessonContainerComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'school', component: SchoolComponent },
  { path: '**', redirectTo: 'splash' }
];
