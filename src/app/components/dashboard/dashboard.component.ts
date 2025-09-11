import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MoodEntryService } from '../../core/services/mood-entry.service';
import { SuggestedActivityService } from '../../core/services/suggested-activity.service';
import {
  MoodEntry,
  SuggestedActivity,
} from '../../core/models/mood-entry.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // User data
  userName: string = 'Friend';

  // Dashboard statistics
  todayMoodEntries: number = 0;
  completedTasks: number = 0;
  averageEnergy: number = 0;

  // Data
  latestMoodEntry: MoodEntry | null = null;
  suggestedActivities: SuggestedActivity[] = [];

  // UI state
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private moodEntryService: MoodEntryService,
    private suggestedActivityService: SuggestedActivityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData(): void {
    this.isLoading = true;

    // Load today's mood entries
    this.loadTodayMoodEntries();

    // Load suggested activities
    this.loadSuggestedActivities();

    // Calculate statistics
    this.calculateStatistics();

    this.isLoading = false;
  }

  /**
   * Load today's mood entries
   */
  loadTodayMoodEntries(): void {
    // Subscribe to the observable and map to expected type
    this.moodEntryService.getTodayMoodEntries().subscribe((todayEntries) => {
      if (todayEntries && todayEntries.length > 0) {
        // Map the response to match our MoodEntry model
        this.latestMoodEntry = {
          ...todayEntries[0],
          userId: 0, // Default value since it's not in the response
          entryDate: new Date(todayEntries[0].entryDate),
          createdAt: new Date(todayEntries[0].createdAt),
          updatedAt: new Date(todayEntries[0].updatedAt),
          isVoiceInput: todayEntries[0].isVoiceInput,
        };
        this.todayMoodEntries = todayEntries.length;
      } else {
        this.latestMoodEntry = null;
        this.todayMoodEntries = 0;
      }
    });
  }

  /**
   * Load suggested activities
   */
  loadSuggestedActivities(): void {
    // Subscribe to the observable and map to expected type
    this.suggestedActivityService
      .getTodaySuggestedActivities()
      .subscribe((activities) => {
        // Map the response to match our SuggestedActivity model
        this.suggestedActivities = activities.map((activity) => ({
          ...activity,
          userId: 0, // Default value since it's not in the response
          suggestedDate: new Date(activity.suggestedDate),
          createdAt: new Date(activity.createdAt),
          updatedAt: new Date(activity.updatedAt),
          completedAt: activity.completedAt
            ? new Date(activity.completedAt)
            : undefined,
        }));
      });
  }

  calculateStatistics(): void {
    // Calculate completed tasks
    this.completedTasks = this.suggestedActivities.filter(
      (task) => task.isCompleted
    ).length;

    if (this.latestMoodEntry) {
      this.averageEnergy = this.latestMoodEntry.energyLevel;
    } else {
      this.averageEnergy = 0;
    }
  }

  toggleTaskCompletion(task: SuggestedActivity): void {
    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      task.completedAt = new Date();
      this.snackBar.open(`Great job completing "${task.title}"!`, 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    } else {
      task.completedAt = undefined;
      this.snackBar.open(`Task "${task.title}" marked as incomplete`, 'Close', {
        duration: 2000,
      });
    }

    this.calculateStatistics();

    // TODO: Save to backend when API is ready
    // this.suggestedActivityService.updateSuggestedActivity(task).subscribe(...);
  }

  /**
   * Open mood entry form
   */
  openMoodEntryForm(): void {
    this.router.navigate(['/mood-entry']);
  }

  /**
   * View task details
   */
  viewTaskDetails(task: SuggestedActivity): void {
    this.snackBar.open(
      `Task: ${task.title}\nDescription: ${
        task.description || 'No description'
      }\nCategory: ${task.category}`,
      'Close',
      {
        duration: 5000,
        panelClass: ['info-snackbar'],
      }
    );
  }

  /**
   * View history
   */
  viewHistory(): void {
    this.router.navigate(['/history']);
  }

  /**
   * View analytics
   */
  viewAnalytics(): void {
    this.snackBar.open('Analytics feature coming soon!', 'Close', {
      duration: 3000,
    });
  }

  /**
   * Open settings
   */
  openSettings(): void {
    this.snackBar.open('Settings feature coming soon!', 'Close', {
      duration: 3000,
    });
  }

  trackByTaskId(index: number, task: SuggestedActivity): number {
    return task.id;
  }
}
