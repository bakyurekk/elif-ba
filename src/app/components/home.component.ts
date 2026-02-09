import {
  Component,
  inject,
  computed,
  signal,
  effect,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { GameService, Lesson } from "../services/game.service";
import { Router } from "@angular/router";
import { NgClass, NgStyle } from "@angular/common";
import { BottomNavComponent } from "./bottom-nav.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [NgClass, NgStyle, BottomNavComponent],
  template: `
    <div
      class="h-screen overflow-y-auto bg-white pb-24"
      (scroll)="onScroll($event)"
      #scrollContainer
    >
      <!-- Header -->
      <header
        class="sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b-2 border-brand-gray px-4 py-3 flex justify-between items-center"
      >
        <!-- Language Flag -->
        <div
          class="w-10 h-8 rounded bg-gray-200 border-2 border-gray-300 flex items-center justify-center overflow-hidden relative"
        >
          <span class="text-xs font-bold text-gray-500">AR</span>
          <!-- Daily Goal Dot -->
          <div
            class="absolute -top-1 -right-1 w-3 h-3 bg-brand-blue rounded-full border-2 border-white"
          ></div>
        </div>

        <!-- Stats -->
        <div class="flex items-center space-x-4">
          <!-- Daily Goal / Streak -->
          <div
            class="flex items-center space-x-1"
            title="Daily Goal: {{ game.dailyGoal() }} min"
          >
            <div class="relative">
              <span
                class="material-symbols-rounded text-brand-red text-2xl animate-pulse"
                >local_fire_department</span
              >
              <svg
                class="absolute -top-1 -left-1 w-8 h-8 -rotate-90 pointer-events-none"
                viewBox="0 0 36 36"
              >
                <path
                  class="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-dasharray="100, 100"
                />
                <!-- Mock progress of 60% towards goal -->
                <path
                  class="text-brand-red opacity-30"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-dasharray="60, 100"
                />
              </svg>
            </div>
            <span class="font-extrabold text-brand-red">{{
              game.streak()
            }}</span>
          </div>

          <div class="flex items-center space-x-1">
            <span class="material-symbols-rounded text-brand-yellow text-2xl"
              >bolt</span
            >
            <span class="font-extrabold text-brand-yellow">{{
              game.xp()
            }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="material-symbols-rounded text-brand-red text-2xl"
              >favorite</span
            >
            <span class="font-extrabold text-brand-red">{{
              game.hearts()
            }}</span>
          </div>
        </div>
      </header>

      <!-- Learning Path -->
      <div
        class="flex flex-col items-center pt-8 px-4 relative w-full overflow-hidden"
      >
        <!-- Unit 1 -->
        <div class="w-full max-w-sm flex flex-col items-center mb-12">
          <!-- Unit Header -->
          <div
            class="w-full bg-brand-green p-4 rounded-2xl mb-8 text-white flex justify-between items-center shadow-lg shadow-brand-green/20"
          >
            <div>
              <h3 class="font-extrabold text-xl">Ünite 1</h3>
              <p class="opacity-90 font-medium">Temel Harfler</p>
            </div>
            <span class="material-symbols-rounded text-3xl opacity-50"
              >menu_book</span
            >
          </div>

          <!-- Unit 1 Lessons -->
          <div class="flex flex-col items-center space-y-6 relative w-full">
            <!-- Connector Line -->
            <div
              class="absolute top-4 bottom-10 w-24 left-1/2 -translate-x-1/2 -z-10 flex justify-center"
            >
              <svg height="100%" width="100">
                <path
                  d="M50 0 Q 10 50 50 100 T 50 200"
                  stroke="#E5E5E5"
                  stroke-width="8"
                  fill="transparent"
                  stroke-linecap="round"
                  stroke-dasharray="15,15"
                />
              </svg>
            </div>

            @for (lesson of unit1Lessons(); track lesson.id; let i = $index) {
              <div
                class="relative z-10"
                [ngStyle]="{ 'margin-left': getOffset(i) + 'px' }"
                [id]="'lesson-' + lesson.id"
              >
                @if (!lesson.locked && !lesson.completed) {
                  <div
                    class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-xl border-2 border-brand-gray text-brand-green font-bold text-sm uppercase animate-bounce mb-2 shadow-sm whitespace-nowrap z-20"
                  >
                    Başla!
                    <div
                      class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-brand-gray transform rotate-45"
                    ></div>
                  </div>
                }
                <button
                  (click)="startLesson(lesson.id)"
                  [disabled]="lesson.locked"
                  class="w-20 h-20 rounded-full flex items-center justify-center border-b-4 transition-all transform active:scale-95 duration-100 relative group"
                  [ngClass]="getButtonClass(lesson)"
                >
                  @if (lesson.locked) {
                    <span class="material-symbols-rounded text-3xl opacity-50"
                      >lock</span
                    >
                  } @else if (lesson.completed) {
                    <span
                      class="material-symbols-rounded text-4xl text-white drop-shadow-sm"
                      >check_circle</span
                    >
                  } @else {
                    <span class="text-3xl font-bold">{{ lesson.letter }}</span>
                  }
                  @if (lesson.completed) {
                    <div class="absolute -bottom-2 flex space-x-0.5">
                      <span
                        class="material-symbols-rounded text-brand-yellow text-sm"
                        >star</span
                      >
                      <span
                        class="material-symbols-rounded text-brand-yellow text-sm"
                        >star</span
                      >
                      <span
                        class="material-symbols-rounded text-brand-yellow text-sm"
                        >star</span
                      >
                    </div>
                  }
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Divider -->
        <div
          class="w-full border-t-2 border-dashed border-gray-300 my-4 max-w-sm"
        ></div>

        <!-- Unit 2 -->
        <div
          class="w-full max-w-sm flex flex-col items-center mt-8 pb-10"
          [class.opacity-50]="unit2Locked()"
          [class.pointer-events-none]="unit2Locked()"
        >
          <!-- Unit Header -->
          <div
            class="w-full bg-brand-purple p-4 rounded-2xl mb-8 text-white flex justify-between items-center shadow-lg shadow-brand-purple/20"
          >
            <div>
              <h3 class="font-extrabold text-xl">Ünite 2</h3>
              <p class="opacity-90 font-medium">Harekeler (Sesli Harfler)</p>
            </div>
            @if (unit2Locked()) {
              <span class="material-symbols-rounded text-3xl opacity-50"
                >lock</span
              >
            } @else {
              <span class="material-symbols-rounded text-3xl opacity-50"
                >school</span
              >
            }
          </div>

          <!-- Unit 2 Lessons -->
          <div class="flex flex-col items-center space-y-6 relative w-full">
            <!-- Connector Line -->
            <div
              class="absolute top-4 bottom-10 w-24 left-1/2 -translate-x-1/2 -z-10 flex justify-center"
            >
              <svg height="100%" width="100">
                <path
                  d="M50 0 Q 90 50 50 100 T 50 200"
                  stroke="#E5E5E5"
                  stroke-width="8"
                  fill="transparent"
                  stroke-linecap="round"
                  stroke-dasharray="15,15"
                />
              </svg>
            </div>

            @for (lesson of unit2Lessons(); track lesson.id; let i = $index) {
              <div
                class="relative z-10"
                [ngStyle]="{ 'margin-left': getOffset(i) + 'px' }"
                [id]="'lesson-' + lesson.id"
              >
                @if (!lesson.locked && !lesson.completed) {
                  <div
                    class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-xl border-2 border-brand-gray text-brand-green font-bold text-sm uppercase animate-bounce mb-2 shadow-sm whitespace-nowrap z-20"
                  >
                    Başla!
                    <div
                      class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-brand-gray transform rotate-45"
                    ></div>
                  </div>
                }
                <button
                  (click)="startLesson(lesson.id)"
                  [disabled]="lesson.locked"
                  class="w-20 h-20 rounded-full flex items-center justify-center border-b-4 transition-all transform active:scale-95 duration-100 relative group"
                  [ngClass]="getButtonClass(lesson)"
                >
                  @if (lesson.locked) {
                    <span class="material-symbols-rounded text-3xl opacity-50"
                      >lock</span
                    >
                  } @else if (lesson.completed) {
                    <span
                      class="material-symbols-rounded text-4xl text-brand-yellow drop-shadow-sm"
                      >check_circle</span
                    >
                  } @else {
                    <!-- Check for 'Mixed' to show icon instead of text -->
                    @if (lesson.name === "Mixed") {
                      <span class="material-symbols-rounded text-3xl"
                        >fitness_center</span
                      >
                    } @else {
                      <span class="text-4xl font-bold">{{
                        lesson.letter
                      }}</span>
                    }
                  }
                  @if (lesson.completed) {
                    <div class="absolute -bottom-2 flex space-x-0.5">
                      <span
                        class="material-symbols-rounded text-brand-yellow text-sm"
                        >star</span
                      >
                      <span
                        class="material-symbols-rounded text-brand-yellow text-sm"
                        >star</span
                      >
                      <span
                        class="material-symbols-rounded text-brand-yellow text-sm"
                        >star</span
                      >
                    </div>
                  }
                </button>
              </div>
            }
          </div>
        </div>

        <div class="h-20 flex items-center justify-center opacity-50 mt-8">
          <span class="text-brand-gray font-bold text-lg"
            >Daha fazla ünite çok yakında...</span
          >
        </div>
      </div>

      <!-- Scroll to Top Button -->
      @if (showScrollTop()) {
        <button
          (click)="scrollToTop()"
          class="fixed bottom-24 right-4 w-14 h-14 bg-brand-green text-white rounded-full shadow-2xl border-b-4 border-brand-greenDark flex items-center justify-center z-40 active:border-b-0 active:translate-y-1 transition-all animate-pop hover:scale-110"
        >
          <span class="material-symbols-rounded text-3xl"
            >keyboard_arrow_up</span
          >
        </button>
      }

      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
})
export class HomeComponent implements AfterViewInit {
  game = inject(GameService);
  router = inject(Router);

  @ViewChild("scrollContainer") scrollContainer?: ElementRef;
  showScrollTop = signal(false);

  unit1Lessons = computed(() =>
    this.game.lessons().filter((l) => l.unit === 1),
  );
  unit2Lessons = computed(() =>
    this.game.lessons().filter((l) => l.unit === 2),
  );

  // Unit 2 is visibly locked if the first lesson of Unit 2 is locked
  unit2Locked = computed(() => {
    const firstLessonU2 = this.game.lessons().find((l) => l.unit === 2);
    return firstLessonU2 ? firstLessonU2.locked : true;
  });

  getOffset(index: number): number {
    const pattern = [0, -60, 0, 60];
    return pattern[index % 4];
  }

  getButtonClass(lesson: Lesson): string {
    if (lesson.locked) {
      return "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed";
    }
    if (lesson.completed) {
      return "bg-brand-yellow border-brand-yellowDark text-white shadow-xl shadow-brand-yellow/30";
    }

    // Different color for Unit 2 active
    if (lesson.unit === 2) {
      return "bg-brand-purple border-brand-purple text-white shadow-xl shadow-brand-purple/30 btn-3d border-b-brand-purple/50";
    }

    return "bg-brand-green border-brand-greenDark text-white shadow-xl shadow-brand-green/30 btn-3d";
  }

  startLesson(id: string) {
    const lesson = this.game.lessons().find((l) => l.id === id);
    if (lesson && !lesson.locked) {
      this.game.currentLessonId.set(id);
      this.router.navigate(["/lesson", id]);
    }
  }

  ngAfterViewInit() {
    // Scroll to the last completed lesson or first active lesson
    setTimeout(() => {
      this.scrollToCurrentLesson();
    }, 100);
  }

  scrollToCurrentLesson() {
    const lessons = this.game.lessons();

    // Find the last completed lesson
    let targetLesson = null;
    for (let i = lessons.length - 1; i >= 0; i--) {
      if (lessons[i].completed) {
        targetLesson = lessons[i];
        break;
      }
    }

    // If no completed lesson, find the first active (unlocked but not completed) lesson
    if (!targetLesson) {
      targetLesson = lessons.find((l) => !l.locked && !l.completed);
    }

    if (targetLesson) {
      const element = document.getElementById(`lesson-${targetLesson.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    // Show scroll-to-top button when scrolled down more than 300px
    this.showScrollTop.set(target.scrollTop > 300);
  }

  scrollToTop() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}
