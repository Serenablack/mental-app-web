// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatSnackBar } from '@angular/material/snack-bar';

// import { MoodEntryService } from '../../core/services/mood-entry.service';
// import { SuggestedActivityService, SuggestedActivityResponse, ActivityCategory, DifficultyLevel } from '../../core/services/suggested-activity.service';
// import { EmotionService, Emotion } from '../../core/services/emotion.service';
// import { MoodEntry, SuggestedActivity } from '../../core/models/mood-entry.model';
// import { Subject, takeUntil } from 'rxjs';

// @Component({
//   selector: 'app-history',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule,
//     MatButtonModule,
//     MatIconModule,
//     MatChipsModule,
//     MatCheckboxModule,
//     MatProgressSpinnerModule,
//     MatTooltipModule,
//     MatDividerModule,
//   ],
//   templateUrl: './history.component.html',
//   styleUrls: ['./history.component.css'],
// })
// export class HistoryComponent implements OnInit, OnDestroy {
//   moodEntries: MoodEntry[] = [];
//   activities: SuggestedActivityResponse[] = [];
//   availableEmotions: Emotion[] = [];
//   loading = false;
//   selectedDate: string = new Date().toISOString().split('T')[0];
//   viewMode: 'entries' | 'activities' = 'entries';

//   private destroy$ = new Subject<void>();

//   constructor(
//     private moodEntryService: MoodEntryService,
//     private suggestedActivityService: SuggestedActivityService,
//     private emotionService: EmotionService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private loadData(): void {
//     this.loading = true;

//     // Load available emotions for display
//     this.emotionService
//       .getAvailableEmotions()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (emotions) => {
//           this.availableEmotions = emotions;
//         },
//         error: (error) => {
//           console.error('Error loading emotions:', error);
//         },
//       });

//     if (this.viewMode === 'entries') {
//       this.loadMoodEntries();
//     } else {
//       this.loadActivities();
//     }
//   }

//   private loadMoodEntries(): void {
//     this.moodEntryService
//       .getAllMoodEntries()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (entries) => {
//           this.moodEntries = entries;
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading mood entries:', error);
//           this.snackBar.open('Error loading mood entries. Please try again.', 'Close', {
//             duration: 3000,
//           });
//           this.loading = false;
//         },
//       });
//   }

//   private loadActivities(): void {
//     this.suggestedActivityService
//       .getPastActivities()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (activities) => {
//           this.activities = activities;
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading activities:', error);
//           this.snackBar.open('Error loading activities. Please try again.', 'Close', {
//             duration: 3000,
//           });
//           this.loading = false;
//         },
//       });
//   }

//   onViewModeChange(mode: 'entries' | 'activities'): void {
//     this.viewMode = mode;
//     this.loadData();
//   }

//   onDateChange(): void {
//     this.loadData();
//   }

//   onDeleteEntry(entry: MoodEntryResponse): void {
//     if (confirm('Are you sure you want to delete this mood entry?')) {
//       this.moodEntryService.deleteMoodEntry(entry.id).subscribe({
//         next: () => {
//           this.moodEntries = this.moodEntries.filter(e => e.id !== entry.id);
//           this.snackBar.open('Mood entry deleted successfully.', 'Close', {
//             duration: 3000,
//           });
//         },
//         error: (error) => {
//           console.error('Error deleting mood entry:', error);
//           this.snackBar.open('Error deleting mood entry. Please try again.', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     }
//   }

//   onEditEntry(entry: MoodEntryResponse): void {
//     this.router.navigate(['/mood-entry', entry.id]);
//   }

//   onActivityToggle(activity: SuggestedActivityResponse): void {
//     if (activity.isCompleted) {
//       this.suggestedActivityService
//         .uncompleteActivity(activity.id)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (updatedActivity) => {
//             const index = this.activities.findIndex(a => a.id === activity.id);
//             if (index !== -1) {
//               this.activities[index] = updatedActivity;
//             }
//           },
//           error: (error) => {
//             console.error('Error uncompleting activity:', error);
//           },
//         });
//     } else {
//       this.suggestedActivityService
//         .completeActivity(activity.id)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (updatedActivity) => {
//             const index = this.activities.findIndex(a => a.id === activity.id);
//             if (index !== -1) {
//               this.activities[index] = updatedActivity;
//             }
//           },
//           error: (error) => {
//             console.error('Error completing activity:', error);
//           },
//         });
//     }
//   }

//   onDeleteActivity(activity: SuggestedActivityResponse): void {
//     if (confirm('Are you sure you want to delete this activity?')) {
//       this.suggestedActivityService.deleteActivity(activity.id).subscribe({
//         next: () => {
//           this.activities = this.activities.filter(a => a.id !== activity.id);
//           this.snackBar.open('Activity deleted successfully.', 'Close', {
//             duration: 3000,
//           });
//         },
//         error: (error) => {
//           console.error('Error deleting activity:', error);
//           this.snackBar.open('Error deleting activity. Please try again.', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     }
//   }

//   getEmotionLabel(emotionKey: string): string {
//     const emotion = this.availableEmotions.find(e => e.key === emotionKey);
//     return emotion ? emotion.label : emotionKey;
//   }

//   getCategoryDisplayName(category: ActivityCategory): string {
//     return this.suggestedActivityService.getCategoryDisplayName(category);
//   }

//   getDifficultyDisplayName(difficulty: DifficultyLevel): string {
//     return this.suggestedActivityService.getDifficultyDisplayName(difficulty);
//   }

//   formatDate(dateString: string): string {
//     return new Date(dateString).toLocaleDateString();
//   }

//   formatTime(dateString: string): string {
//     return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }

//   canEditEntry(entry: MoodEntryResponse): boolean {
//     const entryDate = new Date(entry.entryDate);
//     const today = new Date();
//     today.setHours(23, 59, 59, 999); // End of today
//     return entryDate <= today;
//   }

//   trackByMoodEntry(index: number, entry: MoodEntryResponse): number {
//     return entry.id;
//   }

//   trackByActivity(index: number, activity: SuggestedActivityResponse): number {
//     return activity.id;
//   }
// }
