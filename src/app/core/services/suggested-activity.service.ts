import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SuggestedActivity } from '../models/mood-entry.model';
import {
  getMockSuggestedActivities,
  getMockPendingTodayActivities,
  getMockCompletedActivities,
  getMockActivityStatistics,
} from '../../data/mock-data';

export interface SuggestedActivityResponse {
  id: number;
  title: string;
  description?: string;
  category: ActivityCategory;
  estimatedDurationMinutes?: number;
  difficultyLevel?: DifficultyLevel;
  isCompleted: boolean;
  completedAt?: string;
  suggestedDate: string;
  createdAt: string;
  updatedAt: string;
  moodEntryId: number;
}

export enum ActivityCategory {
  BREATHING = 'BREATHING',
  PHYSICAL = 'PHYSICAL',
  SOCIAL = 'SOCIAL',
  CREATIVE = 'CREATIVE',
  MINDFULNESS = 'MINDFULNESS',
  SELF_CARE = 'SELF_CARE',
  PRODUCTIVITY = 'PRODUCTIVITY',
  NATURE = 'NATURE',
  LEARNING = 'LEARNING',
  GRATITUDE = 'GRATITUDE',
}

export enum DifficultyLevel {
  VERY_EASY = 'VERY_EASY',
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  CHALLENGING = 'CHALLENGING',
  INTENSIVE = 'INTENSIVE',
}

export interface ActivityStatistics {
  todayTotal: number;
  todayCompleted: number;
  todayPending: number;
  completionRate: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  details?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SuggestedActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 2;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    let apiError: ApiError = {
      message: errorMessage,
      status: error.status,
      timestamp: new Date().toISOString(),
      path: error.url || '',
    };

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
      apiError.message = errorMessage;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage =
            'Unable to connect to server. Please check your internet connection.';
          break;
        case 400:
          errorMessage =
            'Invalid request. Please check your input and try again.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in again.';
          break;
        case 403:
          errorMessage =
            "Access denied. You don't have permission to perform this action.";
          break;
        case 404:
          errorMessage =
            'Resource not found. The requested data does not exist.';
          break;
        case 409:
          errorMessage =
            'Conflict. The resource already exists or has been modified.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input data.';
          break;
        case 429:
          errorMessage =
            'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Server error (${error.status}): ${error.message}`;
      }
      apiError.message = errorMessage;
      apiError.details = error.error;
    }

    console.error('API Error:', apiError);
    return throwError(() => apiError);
  }

  completeActivity(id: number): Observable<SuggestedActivityResponse> {
    return this.http
      .post<SuggestedActivityResponse>(`${this.apiUrl}/${id}/complete`, {})
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  uncompleteActivity(id: number): Observable<SuggestedActivityResponse> {
    return this.http
      .post<SuggestedActivityResponse>(`${this.apiUrl}/${id}/uncomplete`, {})
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getTodayActivities(): Observable<SuggestedActivityResponse[]> {
    return this.http
      .get<SuggestedActivityResponse[]>(`${this.apiUrl}/today`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getPendingTodayActivities(): Observable<SuggestedActivityResponse[]> {
    return this.http
      .get<SuggestedActivityResponse[]>(`${this.apiUrl}/today/pending`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getActivitiesByDate(date: string): Observable<SuggestedActivityResponse[]> {
    return this.http
      .get<SuggestedActivityResponse[]>(`${this.apiUrl}/date/${date}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getPastActivities(): Observable<SuggestedActivityResponse[]> {
    return this.http
      .get<SuggestedActivityResponse[]>(`${this.apiUrl}/history`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getCompletedActivities(): Observable<SuggestedActivityResponse[]> {
    return this.http
      .get<SuggestedActivityResponse[]>(`${this.apiUrl}/completed`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getActivitiesByCategory(
    category: ActivityCategory
  ): Observable<SuggestedActivityResponse[]> {
    return this.http
      .get<SuggestedActivityResponse[]>(`${this.apiUrl}/category/${category}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getActivityById(id: number): Observable<SuggestedActivityResponse> {
    return this.http
      .get<SuggestedActivityResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getActivityStatistics(): Observable<ActivityStatistics> {
    return this.http
      .get<ActivityStatistics>(`${this.apiUrl}/statistics`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  deleteActivity(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getCategoryDisplayName(category: ActivityCategory): string {
    const categoryNames = {
      [ActivityCategory.BREATHING]: 'Breathing & Relaxation',
      [ActivityCategory.PHYSICAL]: 'Physical Activity',
      [ActivityCategory.SOCIAL]: 'Social Connection',
      [ActivityCategory.CREATIVE]: 'Creative Expression',
      [ActivityCategory.MINDFULNESS]: 'Mindfulness & Meditation',
      [ActivityCategory.SELF_CARE]: 'Self Care',
      [ActivityCategory.PRODUCTIVITY]: 'Productive Tasks',
      [ActivityCategory.NATURE]: 'Nature & Outdoors',
      [ActivityCategory.LEARNING]: 'Learning & Growth',
      [ActivityCategory.GRATITUDE]: 'Gratitude & Reflection',
    };
    return categoryNames[category] || category;
  }

  getDifficultyDisplayName(difficulty: DifficultyLevel): string {
    const difficultyNames = {
      [DifficultyLevel.VERY_EASY]: 'Very Easy (1-2 min)',
      [DifficultyLevel.EASY]: 'Easy (3-5 min)',
      [DifficultyLevel.MODERATE]: 'Moderate (6-15 min)',
      [DifficultyLevel.CHALLENGING]: 'Challenging (16-30 min)',
      [DifficultyLevel.INTENSIVE]: 'Intensive (30+ min)',
    };
    return difficultyNames[difficulty] || difficulty;
  }

  // Helper method to get today's suggested activities for dashboard
  getTodaySuggestedActivities(): Observable<SuggestedActivityResponse[]> {
    return this.getTodayActivities();
  }
}
