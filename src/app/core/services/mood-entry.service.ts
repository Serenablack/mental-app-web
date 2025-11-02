import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtTokenService } from './jwt-token.service';
import { LocalStorageService } from './local-storage.service';
import { BaseHttpService } from './base-http.service';
import { MoodEntry, SuggestedActivity } from '../models/mood-entry.model';
import { environment } from '../../../environments/environment';
// Removed mock data imports - using backend APIs only

// Backend API DTOs - matching MoodEntryCreateRequest.java
export interface MoodEntryCreateRequest {
  emotionIds: number[];
  energyLevel: number;
  comfortEnvironment: string;
  location?: string;
  description?: string;
  passion?: string;
}

export interface MoodEntryResponse {
  id: number;
  userId: number;
  username: string;
  location?: string;
  comfortEnvironment: string;
  description?: string;
  energyLevel: number;
  passion?: string;
  emotions: EmotionResponse[];
  suggestedActivities: SuggestedActivityResponse[];
  createdAt: string;
  updatedAt: string;
  isFromToday: boolean;
}

export interface EmotionResponse {
  id: number;
  key: string;
  label: string;
  parentKey?: string;
}

export interface SuggestedActivityResponse {
  id: number;
  activityDescription: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface MoodStatistics {
  totalEntries: number;
  todayEntries: number;
  averageEnergy: number;
  weeklyEntries: number;
}

@Injectable({
  providedIn: 'root',
})
export class MoodEntryService extends BaseHttpService {
  private readonly API_URL = `${environment.apiUrl}/mood-entries`;

  constructor(
    protected override http: HttpClient,
    protected override jwtTokenService: JwtTokenService,
    protected override localStorageService: LocalStorageService
  ) {
    super(http, jwtTokenService, localStorageService);
  }

  createMoodEntry(
    moodEntry: MoodEntryCreateRequest
  ): Observable<MoodEntryResponse> {
    return this.http
      .post<MoodEntryResponse>(this.API_URL, moodEntry, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response: MoodEntryResponse) => {
          console.log('Received mood entry response from backend:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error creating mood entry:', error);
          return throwError(() => ({
            message: 'Failed to create mood entry',
            details: error.error?.message || error.message,
            status: error.status,
          }));
        })
      );
  }

  updateMoodEntry(
    id: number,
    moodEntry: MoodEntryCreateRequest
  ): Observable<MoodEntryResponse> {
    return this.http
      .put<MoodEntryResponse>(`${this.API_URL}/${id}`, moodEntry, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response: MoodEntryResponse) => {
          console.log('Updated mood entry response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error updating mood entry:', error);
          return throwError(() => ({
            message: 'Failed to update mood entry',
            details: error.error?.message || error.message,
            status: error.status,
          }));
        })
      );
  }

  deleteMoodEntry(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting mood entry:', error);
          return throwError(() => ({
            message: 'Failed to delete mood entry',
            details: error.error?.message || error.message,
            status: error.status,
          }));
        })
      );
  }

  getMoodEntriesByDate(date: Date): Observable<MoodEntry[]> {
    const dateString = date.toISOString();

    return this.http
      .get<any>(this.API_URL, {
        headers: this.getAuthHeaders(),
        params: { date: dateString },
      })
      .pipe(
        map((response: any) => {
          let moodEntriesData: MoodEntryResponse[];
          if (Array.isArray(response)) {
            moodEntriesData = response;
          } else if (response && Array.isArray(response.data)) {
            moodEntriesData = response.data;
          } else if (response && Array.isArray(response.moodEntries)) {
            moodEntriesData = response.moodEntries;
          } else if (
            response &&
            response.content &&
            Array.isArray(response.content)
          ) {
            moodEntriesData = response.content;
          } else {
            console.warn(
              'Unexpected mood entries response structure:',
              response
            );
            moodEntriesData = [];
          }

          return moodEntriesData.map((response) =>
            this.mapBackendToFrontend(response)
          );
        }),
        catchError((error) => {
          console.error('Error fetching mood entries:', error);
          if (error.status === 401) {
            this.localStorageService.clearAuthData();
            return throwError(() => ({
              message: 'Authentication required',
              details: 'Please log in again',
              status: 401,
            }));
          }
          return throwError(() => ({
            message: 'Failed to fetch mood entries',
            details: error.error?.message || error.message,
            status: error.status,
          }));
        })
      );
  }

  getTodayMoodEntries(): Observable<MoodEntry[]> {
    return this.getMoodEntriesByDate(new Date());
  }

  getAllMoodEntries(): Observable<MoodEntry[]> {
    return this.getTodayMoodEntries();
  }

  // Helper method to map backend response to frontend model
  private mapBackendToFrontend(response: MoodEntryResponse): MoodEntry {
    return {
      id: response.id,
      userId: response.userId,
      emotionKeys: response.emotions.map((e) => e.key), // Map emotion keys from emotions array
      location: response.location || '',
      environment: response.comfortEnvironment as 'ALONE' | 'IN_GROUP',
      description: response.description || '',
      energyLevel: response.energyLevel,
      entryDate: new Date(response.createdAt),
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      isVoiceInput: false,
      suggestedActivities: response.suggestedActivities.map((sa) => ({
        id: sa.id,
        userId: response.userId,
        moodEntryId: response.id,
        title: sa.activityDescription,
        description: sa.activityDescription,
        category: 'GENERAL',
        estimatedDurationMinutes: 15,
        difficultyLevel: 'EASY',
        isCompleted: sa.isCompleted,
        completedAt: sa.isCompleted ? new Date(sa.createdAt) : undefined,
        suggestedDate: new Date(sa.createdAt),
        createdAt: new Date(sa.createdAt),
        updatedAt: new Date(sa.createdAt),
      })),
    };
  }

  private getAuthHeaders() {
    const token = this.localStorageService.getToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  getEditableMoodEntries(): Observable<MoodEntry[]> {
    return this.getTodayMoodEntries().pipe(
      catchError((error) => {
        console.error('Error fetching editable mood entries:', error);
        return of([]);
      })
    );
  }

  getMoodEntriesInRange(
    startDate: string,
    endDate: string
  ): Observable<MoodEntry[]> {
    return this.getAllMoodEntries().pipe(
      map((allEntries) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return allEntries.filter((entry) => {
          const entryDate = new Date(entry.entryDate);
          return entryDate >= start && entryDate <= end;
        });
      }),
      catchError((error) => {
        console.error('Error fetching mood entries in range:', error);
        return of([]);
      })
    );
  }

  getMoodEntryById(id: number): Observable<MoodEntry> {
    return this.getAllMoodEntries().pipe(
      map((allEntries) => {
        const entry = allEntries.find((e) => e.id === id);
        if (!entry) {
          throw new Error(`Mood entry with id ${id} not found`);
        }
        return entry;
      }),
      catchError((error) => {
        console.error('Error fetching mood entry by ID:', error);
        return throwError(() => error);
      })
    );
  }

  getMoodStatistics(): Observable<MoodStatistics> {
    return this.getAllMoodEntries().pipe(
      map((allEntries) => {
        const today = new Date();
        const todayEntries = allEntries.filter((entry) => {
          const entryDate = new Date(entry.entryDate);
          return entryDate.toDateString() === today.toDateString();
        });

        const totalEntries = allEntries.length;
        const todayCount = todayEntries.length;
        const averageEnergy =
          todayEntries.length > 0
            ? todayEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) /
              todayEntries.length
            : 0;

        return {
          totalEntries,
          todayEntries: todayCount,
          averageEnergy: Math.round(averageEnergy),
          weeklyEntries: allEntries.filter((entry) => {
            const entryDate = new Date(entry.entryDate);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return entryDate >= weekAgo;
          }).length,
        };
      }),
      catchError((error) => {
        console.error('Error calculating mood statistics:', error);
        return of({
          totalEntries: 0,
          todayEntries: 0,
          averageEnergy: 0,
          weeklyEntries: 0,
        });
      })
    );
  }
}
