import { Component, inject, signal, computed, effect } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GameService, Lesson } from "../services/game.service";
import { AudioService } from "../services/audio.service";
import { NgClass } from "@angular/common";

type LessonPhase = "INTRO" | "LISTEN" | "QUIZ" | "TRACE" | "BUILD" | "COMPLETE";

@Component({
  selector: "app-lesson-container",
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="h-screen w-full flex flex-col bg-white select-none">
      <!-- Top Progress Bar (Hidden on Complete) -->
      @if (phase() !== "COMPLETE" && phase() !== "INTRO") {
        <div class="px-4 py-6 flex items-center justify-between">
          <button
            (click)="exit()"
            class="text-gray-400 hover:bg-gray-100 p-2 rounded-xl transition-colors"
          >
            <span class="material-symbols-rounded text-3xl">close</span>
          </button>

          <div class="flex-1 mx-4 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-brand-green transition-all duration-500 ease-out rounded-full"
              [style.width.%]="progressPct()"
            ></div>
          </div>

          <div class="flex items-center text-brand-red">
            <span class="material-symbols-rounded text-2xl fill-current"
              >favorite</span
            >
            <span class="ml-1 font-bold">{{ game.hearts() }}</span>
          </div>
        </div>
      }

      <!-- INTRO PHASE -->
      @if (phase() === "INTRO") {
        <div
          class="flex-1 flex flex-col items-center justify-center px-6 text-center animate-pop"
        >
          <h2
            class="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4"
          >
            @if (isMixed()) {
              Karışık Pratik
            } @else {
              {{ isUnit2() ? "Yeni Sesli Harf İşareti" : "Yeni Harf" }}
            }
          </h2>

          <div
            class="w-48 h-48 bg-white border-4 border-gray-200 rounded-3xl flex items-center justify-center mb-8 shadow-xl relative"
          >
            @if (isUnit2() && activeLesson()?.baseLetter) {
              <!-- Show with base letter faintly behind or as context -->
              <span class="text-8xl text-gray-300 font-bold absolute">{{
                activeLesson()?.baseLetter
              }}</span>
            }
            <span
              class="text-9xl text-brand-green font-bold font-sans relative z-10"
              >{{ activeLesson()?.letter }}</span
            >
          </div>

          <h1 class="text-4xl font-extrabold text-gray-700 mb-2">
            {{ activeLesson()?.name }}
          </h1>
          <p class="text-xl text-gray-500 font-medium max-w-xs">
            {{ activeLesson()?.desc }}
          </p>

          <div class="mt-12 w-full">
            <button
              (click)="nextPhase()"
              class="w-full bg-brand-green text-white font-bold text-lg py-4 rounded-2xl border-b-4 border-brand-greenDark active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide btn-3d"
            >
              Derse Başla
            </button>
          </div>
        </div>
      }

      <!-- LISTEN PHASE -->
      @if (phase() === "LISTEN") {
        <div
          class="flex-1 flex flex-col items-center justify-center px-6 animate-pop"
        >
          <h2 class="text-2xl font-extrabold text-gray-700 mb-8 self-start">
            {{
              isUnit2() ? "Ses değişimini dinle" : "Sesi dinle"
            }}
          </h2>

          <div class="flex gap-4 items-center justify-center mb-12">
            <!-- Letter Card -->
            <div
              class="w-40 h-40 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm relative"
            >
              @if (isUnit2()) {
                <!-- Combine letter and mark roughly -->
                <span class="text-7xl text-gray-700 font-bold">{{
                  activeLesson()?.baseLetter
                }}</span>
                <span class="text-7xl text-brand-red font-bold absolute">{{
                  activeLesson()?.letter
                }}</span>
              } @else {
                <span class="text-7xl text-gray-700 font-bold">{{
                  activeLesson()?.letter
                }}</span>
              }
            </div>

            <!-- Audio Button -->
            <button
              (click)="playAudio()"
              class="w-20 h-20 bg-brand-blue text-white rounded-2xl border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 flex items-center justify-center shadow-lg transition-all"
              [class.animate-shake]="audio.isPlaying()"
            >
              <span class="material-symbols-rounded text-4xl">volume_up</span>
            </button>
          </div>

          <div
            class="bg-gray-100 p-4 rounded-xl w-full text-center border-2 border-gray-200"
          >
            <p class="text-gray-500 font-bold">
              @if (isUnit2()) {
                "{{ activeLesson()?.baseLetter }}" + "{{
                  activeLesson()?.name
                }}" şu sesi çıkarır...
              } @else {
                "{{ activeLesson()?.name }}" şu sesi çıkarır...
              }
            </p>
          </div>
        </div>
      }

      <!-- QUIZ PHASE -->
      @if (phase() === "QUIZ") {
        <div class="flex-1 flex flex-col px-6 pt-4 animate-pop">
          <h2 class="text-2xl font-extrabold text-gray-700 mb-6">
            @if (isUnit2()) {
              {{ activeLesson()?.name }} hangisi?
            } @else {
              "{{ activeLesson()?.name }}" hangisi?
            }
          </h2>

          <div class="grid grid-cols-2 gap-4">
            @for (opt of quizOptions(); track opt) {
              <button
                (click)="selectQuizOption(opt)"
                class="aspect-square rounded-2xl border-2 border-b-4 flex flex-col items-center justify-center transition-all bg-white hover:bg-gray-50 active:scale-95"
                [ngClass]="getQuizBtnClass(opt)"
              >
                <div class="relative flex items-center justify-center">
                  <span class="text-6xl font-bold mb-2 z-10 relative">{{
                    opt.char
                  }}</span>
                  @if (isUnit2()) {
                    <!-- Visual helper for unit 2 options context -->
                    <span class="text-6xl text-gray-300 absolute">{{
                      opt.base
                    }}</span>
                  }
                </div>
                <span class="text-sm font-bold text-gray-400 uppercase">{{
                  opt.label
                }}</span>
              </button>
            }
          </div>
        </div>
      }

      <!-- TRACE PHASE (Interactive) - Unit 1 Only -->
      @if (phase() === "TRACE") {
        <div
          class="flex-1 flex flex-col items-center px-6 pt-4 animate-pop select-none"
        >
          <h2 class="text-2xl font-extrabold text-gray-700 mb-2 self-start">
            {{ titleTxt }}
          </h2>
          <p class="text-gray-400 font-bold self-start mb-8">
            {{
              game.userType() === "CHILD"
                ? "Harfi parmağınla çiz 👆"
                : "Aşağıdaki harfi çizin"
            }}
          </p>

          <!-- Tracing Container -->
          <div
            class="relative w-72 h-72 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center touch-none overflow-hidden cursor-crosshair active:cursor-grabbing"
            (mousedown)="startTrace($event)"
            (touchstart)="startTrace($event)"
            (mousemove)="moveTrace($event)"
            (touchmove)="moveTrace($event)"
            (mouseup)="endTrace()"
            (mouseleave)="endTrace()"
            (touchend)="endTrace()"
          >
            <!-- Background (Outline) -->
            <span
              class="text-[12rem] font-bold absolute pointer-events-none text-gray-200"
              style="-webkit-text-stroke: 4px #e5e7eb; color: transparent;"
            >
              {{ activeLesson()?.letter }}
            </span>

            <!-- Foreground (Filled based on progress) -->
            <div
              class="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-75"
              [style.clip-path]="
                'inset(' + (100 - traceProgress()) + '% 0 0 0)'
              "
            >
              <span
                class="text-[12rem] text-brand-green font-bold"
                style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));"
              >
                {{ activeLesson()?.letter }}
              </span>
            </div>

            <!-- Guide Animation (Only if little progress) -->
            @if (traceProgress() < 10 && !isTracing()) {
              <div
                class="absolute w-12 h-12 bg-brand-blue/20 rounded-full animate-ping pointer-events-none"
              ></div>
              <span
                class="material-symbols-rounded text-6xl text-brand-blue absolute pointer-events-none animate-bounce"
                >touch_app</span
              >
            }

            <!-- Error Feedback Overlay -->
            @if (showTraceError()) {
              <div
                class="absolute inset-0 bg-red-100/50 flex items-center justify-center animate-shake pointer-events-none z-20"
              >
                <span
                  class="font-bold text-brand-red bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-red-100"
                >
                  {{
                    game.userType() === "CHILD"
                      ? "Devam et! ✍️"
                      : "Tamamlanmadı, tekrar deneyin."
                  }}
                </span>
              </div>
            }
          </div>

          <!-- Progress Indicator -->
          <div class="w-full max-w-xs mt-8 flex items-center space-x-4">
            <span class="text-gray-400 font-bold text-xs uppercase"
              >İlerleme</span
            >
            <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-brand-green transition-all duration-100 ease-out"
                [style.width.%]="traceProgress()"
              ></div>
            </div>
            <span class="text-brand-green font-bold text-sm"
              >{{ Math.round(traceProgress()) }}%</span
            >
          </div>
        </div>
      }

      <!-- BUILD PHASE - Unit 2 Only -->
      @if (phase() === "BUILD") {
        <div class="flex-1 flex flex-col items-center px-6 pt-4 animate-pop">
          <h2 class="text-2xl font-extrabold text-gray-700 mb-2 self-start">
            Sesi oluştur
          </h2>
          <p class="text-gray-400 font-bold self-start mb-8">
            "{{ getVowelSound() }}" için doğru işareti seçin
          </p>

          <!-- The Base Letter Stage -->
          <div
            class="relative w-64 h-64 bg-white border-2 border-gray-200 rounded-3xl flex items-center justify-center mb-12 shadow-md"
          >
            <span class="text-9xl text-gray-800 font-bold">{{
              activeLesson()?.baseLetter
            }}</span>

            <!-- The selected mark overlay -->
            @if (selectedOption()) {
              <span
                class="text-9xl text-brand-blue font-bold absolute animate-pop"
                >{{ selectedOption().char }}</span
              >
            } @else {
              <div
                class="absolute w-full h-full flex items-center justify-center opacity-20"
              >
                <div
                  class="w-16 h-16 border-4 border-dashed border-gray-400 rounded-full animate-pulse"
                ></div>
              </div>
            }
          </div>

          <!-- Options -->
          <div class="flex gap-4 w-full justify-center">
            @for (opt of buildOptions(); track opt) {
              <button
                (click)="selectQuizOption(opt)"
                class="w-20 h-20 rounded-xl border-2 border-b-4 flex items-center justify-center text-4xl font-bold bg-white active:scale-95 transition-all"
                [ngClass]="getQuizBtnClass(opt)"
              >
                {{ opt.char }}
              </button>
            }
          </div>
        </div>
      }

      <!-- COMPLETE PHASE -->
      @if (phase() === "COMPLETE") {
        <div
          class="flex-1 flex flex-col items-center justify-center px-6 bg-white animate-pop"
        >
          <div class="w-full flex justify-center mb-8">
            <div class="relative">
              <img
                src="https://picsum.photos/300/300?random=2"
                class="w-48 h-48 rounded-full border-8 border-brand-yellow shadow-2xl object-cover animate-bounce-short"
              />
              <span
                class="material-symbols-rounded absolute -bottom-4 right-0 text-6xl text-brand-yellow animate-spin-slow"
                >star</span
              >
            </div>
          </div>

          <h1 class="text-4xl font-extrabold text-brand-yellow mb-2">
            {{ isUnit2() ? "Ünite İlerlemesi!" : "Harika!" }}
          </h1>
          <p class="text-xl text-gray-400 font-bold mb-8">
            Dersi tamamladın
          </p>

          <div class="flex space-x-4 mb-8 w-full justify-center">
            <div
              class="bg-brand-yellow/10 px-6 py-3 rounded-2xl border-2 border-brand-yellow text-brand-yellow font-extrabold flex flex-col items-center"
            >
              <span class="text-xs uppercase opacity-70">Toplam XP</span>
              <span class="text-2xl">+15</span>
            </div>
            <div
              class="bg-brand-blue/10 px-6 py-3 rounded-2xl border-2 border-brand-blue text-brand-blue font-extrabold flex flex-col items-center"
            >
              <span class="text-xs uppercase opacity-70">Hız</span>
              <span class="text-2xl">Hızlı</span>
            </div>
          </div>
        </div>
      }

      <!-- BOTTOM BAR (Contextual) -->
      @if (phase() !== "INTRO" && phase() !== "COMPLETE") {
        <div
          class="p-4 border-t-2 border-gray-100"
          [ngClass]="{
            'bg-red-100 border-red-200': feedbackState() === 'WRONG',
            'bg-green-100 border-green-200': feedbackState() === 'CORRECT',
            'bg-white': feedbackState() === 'NONE',
          }"
        >
          <!-- Feedback Text -->
          @if (feedbackState() === "CORRECT") {
            <div
              class="flex items-center text-brand-green font-extrabold text-xl mb-4 animate-pop"
            >
              <span
                class="material-symbols-rounded text-3xl mr-2 bg-white rounded-full p-1"
                >check</span
              >
              {{ game.userType() === "CHILD" ? "Başardın!" : "Mükemmel!" }}
            </div>
          }
          @if (feedbackState() === "WRONG") {
            <div
              class="flex items-center text-brand-red font-extrabold text-xl mb-4 animate-shake"
            >
              <span
                class="material-symbols-rounded text-3xl mr-2 bg-white rounded-full p-1"
                >close</span
              >
              Hay aksi! Tekrar dene.
            </div>
          }

          <button
            (click)="handleContinue()"
            [class.opacity-50]="!canContinue()"
            [disabled]="!canContinue()"
            class="w-full font-bold text-lg py-4 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide btn-3d"
            [ngClass]="getContinueBtnClass()"
          >
            {{ feedbackState() === "NONE" ? "Kontrol Et" : "Devam Et" }}
          </button>
        </div>
      }

      @if (phase() === "COMPLETE") {
        <div class="p-6 border-t border-gray-100 bg-white">
          <button
            (click)="finishLesson()"
            class="w-full bg-brand-green text-white font-bold text-lg py-4 rounded-2xl border-b-4 border-brand-greenDark active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide btn-3d"
          >
            Devam Et
          </button>
        </div>
      }
    </div>
  `,
})
export class LessonContainerComponent {
  game = inject(GameService);
  audio = inject(AudioService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  protected readonly Math = Math;

  phase = signal<LessonPhase>("INTRO");
  progressPct = signal(0);

  // Quiz/Build State
  selectedOption = signal<any>(null);
  feedbackState = signal<"NONE" | "CORRECT" | "WRONG">("NONE");
  titleTxt =
    this.game.userType() === "CHILD" ? "Hadi yazalım!" : "Yazma Pratiği";

  // Tracing State
  traceProgress = signal(0);
  isTracing = signal(false);
  showTraceError = signal(false);
  private lastPos: { x: number; y: number } | null = null;
  private totalTraceDistance = 0;
  private readonly REQUIRED_TRACE_DIST = 500; // pixels

  lessonId: string = "";

  // Mixed Lesson State
  mixedState = signal<{ base: string; vowel: Lesson } | null>(null);

  constructor() {
    this.route.params.subscribe((p) => {
      this.lessonId = p["id"];
      this.game.currentLessonId.set(this.lessonId);

      // Reset Logic
      this.phase.set("INTRO");
      this.progressPct.set(0);
      this.resetStepState();

      // Handle Mixed Logic
      const lesson = this.game.lessons().find((l) => l.id === this.lessonId);
      if (lesson && (lesson.name === "Mixed" || lesson.id === "32")) {
        this.generateMixedLesson();
      } else {
        this.mixedState.set(null);
      }
    });
  }

  generateMixedLesson() {
    const u1 = this.game.lessons().filter((l) => l.unit === 1);
    const randomBase = u1[Math.floor(Math.random() * u1.length)].letter;

    const u2 = this.game
      .lessons()
      .filter((l) => l.unit === 2 && l.name !== "Mixed");
    const randomVowel = u2[Math.floor(Math.random() * u2.length)];

    this.mixedState.set({ base: randomBase, vowel: randomVowel });
  }

  activeLesson = computed(() => {
    const curr = this.game.lessons().find((l) => l.id === this.lessonId);
    const mixed = this.mixedState();

    if (curr?.name === "Mixed" && mixed) {
      return {
        ...curr,
        letter: mixed.vowel.letter,
        name: mixed.vowel.name,
        desc: "Karışık Pratik: Doğru işareti belirleyin.",
        baseLetter: mixed.base,
      };
    }
    return curr;
  });

  isUnit2 = computed(() => (this.activeLesson()?.unit ?? 1) === 2);
  isMixed = computed(
    () =>
      this.game.lessons().find((l) => l.id === this.lessonId)?.name === "Mixed",
  );

  getVowelSound() {
    const l = this.activeLesson();
    if (l?.name === "Fatha") return "a (" + l.baseLetter + "a)";
    if (l?.name === "Kasra") return "i (" + l.baseLetter + "i)";
    if (l?.name === "Damma") return "u (" + l.baseLetter + "u)";
    return "?";
  }

  // Generate Quiz Options (Mock)
  quizOptions = computed(() => {
    const current = this.activeLesson();
    if (!current) return [];

    if (this.isUnit2()) {
      // Options: The base letter with different marks
      const base = current.baseLetter || "ب";
      const marks = [
        { char: "َ", label: "Fatha", base },
        { char: "ِ", label: "Kasra", base },
        { char: "ُ", label: "Damma", base },
      ];
      // The current lesson's letter IS the mark (e.g. Fatha 'َ')
      return marks
        .map((m) => ({
          ...m,
          isCorrect: m.char === current.letter,
        }))
        .sort(() => Math.random() - 0.5);
    } else {
      // Unit 1 logic
      const distractors = [
        { char: "ج", label: "Cim", base: undefined, isCorrect: false },
        { char: "د", label: "Dal", base: undefined, isCorrect: false },
        { char: current.letter, label: current.name, base: undefined, isCorrect: true },
      ].sort(() => Math.random() - 0.5);
      return distractors;
    }
  });

  // Build Options for Unit 2 Step 3
  buildOptions = computed(() => {
    // Just return the 3 marks
    const current = this.activeLesson();
    return [
      { char: "َ", label: "Fatha", isCorrect: current?.letter === "َ" },
      { char: "ِ", label: "Kasra", isCorrect: current?.letter === "ِ" },
      { char: "ُ", label: "Damma", isCorrect: current?.letter === "ُ" },
    ];
  });

  nextPhase() {
    if (this.phase() === "INTRO") {
      this.phase.set("LISTEN");
      this.progressPct.set(20);
    } else if (this.phase() === "LISTEN") {
      this.phase.set("QUIZ");
      this.progressPct.set(50);
    } else if (this.phase() === "QUIZ") {
      if (this.isUnit2()) {
        this.phase.set("BUILD");
      } else {
        this.phase.set("TRACE");
        // Reset Trace Logic
        this.traceProgress.set(0);
        this.totalTraceDistance = 0;
        this.showTraceError.set(false);
        this.feedbackState.set("NONE"); // Ensure fresh state
      }
      this.progressPct.set(80);
    } else if (this.phase() === "TRACE" || this.phase() === "BUILD") {
      this.phase.set("COMPLETE");
      this.progressPct.set(100);
      this.game.addXp(15);
      this.game.unlockNextLesson(this.lessonId);
    }
  }

  playAudio() {
    const lesson = this.activeLesson();
    if (!lesson) return;

    // Play the letter sound using the audio service
    this.audio.playLetterSound(lesson.letter, lesson.name);
  }

  selectQuizOption(opt: any) {
    if (this.feedbackState() !== "NONE") return;
    this.selectedOption.set(opt);
  }

  getQuizBtnClass(opt: any) {
    if (this.selectedOption() === opt) {
      if (this.feedbackState() === "NONE")
        return "border-brand-blue bg-blue-50 text-brand-blue border-b-brand-blue";
      if (this.feedbackState() === "CORRECT")
        return "border-brand-green bg-green-50 text-brand-green border-b-brand-green";
      if (this.feedbackState() === "WRONG")
        return "border-brand-red bg-red-50 text-brand-red border-b-brand-red";
    }
    return "border-gray-200 border-b-gray-300 text-gray-700";
  }

  // TRACING LOGIC
  startTrace(event: MouseEvent | TouchEvent) {
    if (this.feedbackState() === "CORRECT") return;
    this.isTracing.set(true);
    this.showTraceError.set(false);
    this.updatePos(event);
  }

  moveTrace(event: MouseEvent | TouchEvent) {
    if (!this.isTracing()) return;

    const currentPos = this.getPos(event);
    if (this.lastPos && currentPos) {
      const dx = currentPos.x - this.lastPos.x;
      const dy = currentPos.y - this.lastPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      this.totalTraceDistance += dist;

      // Cap progress at 100
      const progress = Math.min(
        100,
        (this.totalTraceDistance / this.REQUIRED_TRACE_DIST) * 100,
      );
      this.traceProgress.set(progress);
    }
    this.lastPos = currentPos;
  }

  endTrace() {
    this.isTracing.set(false);
    this.lastPos = null;
  }

  getPos(event: MouseEvent | TouchEvent) {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY };
    } else if (
      typeof TouchEvent !== "undefined" &&
      event instanceof TouchEvent &&
      event.touches.length > 0
    ) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    return null;
  }

  updatePos(event: MouseEvent | TouchEvent) {
    this.lastPos = this.getPos(event);
  }

  handleContinue() {
    if (this.phase() === "LISTEN") {
      this.nextPhase();
      return;
    }

    // TRACE VALIDATION
    if (this.phase() === "TRACE") {
      if (this.feedbackState() === "CORRECT") {
        this.nextPhase();
        return;
      }

      if (this.traceProgress() >= 80) {
        this.traceProgress.set(100); // Snap to full
        this.feedbackState.set("CORRECT");
      } else {
        this.showTraceError.set(true);
        this.game.hearts.update((h) => Math.max(0, h - 1));
        setTimeout(() => this.showTraceError.set(false), 1500);
      }
      return;
    }

    // QUIZ / BUILD VALIDATION
    if (this.phase() === "QUIZ" || this.phase() === "BUILD") {
      if (this.feedbackState() === "NONE") {
        const opt = this.selectedOption();
        if (opt && opt.isCorrect) {
          this.feedbackState.set("CORRECT");
        } else {
          this.feedbackState.set("WRONG");
          this.game.hearts.update((h) => Math.max(0, h - 1));
        }
      } else {
        if (this.feedbackState() === "CORRECT") {
          this.nextPhase();
          this.resetStepState();
        } else {
          this.feedbackState.set("NONE");
          this.selectedOption.set(null);
        }
      }
    }
  }

  resetStepState() {
    this.selectedOption.set(null);
    this.feedbackState.set("NONE");
  }

  canContinue() {
    if (this.phase() === "LISTEN") return true;
    if (this.phase() === "QUIZ" || this.phase() === "BUILD")
      return this.selectedOption() !== null;
    if (this.phase() === "TRACE") return true; // Always clickable to check progress
    return false;
  }

  getContinueBtnClass() {
    if (this.feedbackState() === "WRONG")
      return "bg-brand-red text-white border-red-700";
    if (this.feedbackState() === "CORRECT")
      return "bg-brand-green text-white border-brand-greenDark";
    if (this.canContinue())
      return "bg-brand-green text-white border-brand-greenDark";
    return "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed";
  }

  exit() {
    if (confirm("Dersten çık? İlerlemenizi kaybedeceksiniz.")) {
      this.router.navigate(["/home"]);
    }
  }

  finishLesson() {
    this.router.navigate(["/home"]);
  }
}
