import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtTokenService } from './jwt-token.service';
import { LocalStorageService } from './local-storage.service';
import { BaseHttpService } from './base-http.service';
import { MoodEntry, SuggestedActivity } from '../models/mood-entry.model';
import { environment } from '../../../environments/environment';
import {
  getMockMoodEntries,
  getMockTodayMoodEntries,
  getMockMoodStatistics,
} from '../../data/mock-data';

export interface MoodEntryCreateRequest {
  emotionKeys: string[];
  location?: string;
  environment: 'ALONE' | 'IN_GROUP';
  description?: string;
  energyLevel: number;
  isVoiceInput?: boolean;
}

export interface MoodStatistics {
  todayEntries: number;
  averageEnergyLevelWeek: number;
  averageEnergyLevelMonth: number;
}

@Injectable({
  providedIn: 'root',
})
export class MoodEntryService extends BaseHttpService {
  private readonly endpoint = 'mood-entries';

  constructor(
    protected override http: HttpClient,
    protected override jwtTokenService: JwtTokenService,
    protected override localStorageService: LocalStorageService
  ) {
    super(http, jwtTokenService, localStorageService);
  }

  createMoodEntry(moodEntry: MoodEntryCreateRequest): Observable<MoodEntry> {
    // Convert frontend request to backend format
    const backendRequest = {
      emotionId: 1, // TODO: Map emotionKeys to emotionId
      notes: moodEntry.description || '',
      passion: moodEntry.energyLevel,
    };

    return this.post(this.endpoint, backendRequest).pipe(
      map((response: any) => {
        const data = response.data || response; // Handle both ApiResponse and direct object
        return {
          id: data.id,
          userId: data.userId,
          emotionKeys: [moodEntry.emotionKeys[0] || 'happy'], // Map back to frontend format
          location: moodEntry.location,
          environment: moodEntry.environment,
          description: data.notes,
          energyLevel: data.passion,
          entryDate: new Date(data.createdAt),
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.createdAt),
          isVoiceInput: moodEntry.isVoiceInput || false,
          suggestedActivities: [],
        };
      })
    );
  }

  updateMoodEntry(
    id: number,
    moodEntry: MoodEntryCreateRequest
  ): Observable<MoodEntry> {
    // TODO: Uncomment when API is ready
    // return this.put(`${this.endpoint}/${id}`, moodEntry);
    const updatedEntry: MoodEntry = {
      id,
      userId: 1, // Mock user ID
      emotionKeys: moodEntry.emotionKeys,
      location: moodEntry.location,
      environment: moodEntry.environment,
      description: moodEntry.description,
      energyLevel: moodEntry.energyLevel,
      entryDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isVoiceInput: moodEntry.isVoiceInput || false,
      suggestedActivities: [],
    };
    return new Observable((observer) => {
      observer.next(updatedEntry);
      observer.complete();
    });
  }

  deleteMoodEntry(id: number): Observable<void> {
    // TODO: Uncomment when API is ready
    // return this.delete(`${this.endpoint}/${id}`);
    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }

  getAllMoodEntries(): Observable<MoodEntry[]> {
    return this.get(this.endpoint).pipe(
      map((response: any) => {
        const entries = response.data || response; // Handle both ApiResponse and direct array
        return entries.map((entry: any) => ({
          id: entry.id,
          userId: entry.userId,
          emotionKeys: ['happy'], // TODO: Map emotionId to emotionKeys
          location: '',
          environment: 'ALONE' as const,
          description: entry.notes,
          energyLevel: entry.passion,
          entryDate: new Date(entry.createdAt),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.createdAt),
          isVoiceInput: false,
          suggestedActivities: [],
        }));
      })
    );
  }

  getTodayMoodEntries(): Observable<MoodEntry[]> {
    // TODO: Uncomment when API is ready
    // return this.get(`${this.endpoint}/today`);
    return new Observable((observer) => {
      observer.next(getMockTodayMoodEntries());
      observer.complete();
    });
  }

  getEditableMoodEntries(): Observable<MoodEntry[]> {
    // TODO: Uncomment when API is ready
    // return this.get(`${this.endpoint}/editable`);
    return new Observable((observer) => {
      observer.next(getMockMoodEntries());
      observer.complete();
    });
  }

  getMoodEntriesByDate(date: string): Observable<MoodEntry[]> {
    // TODO: Uncomment when API is ready
    // return this.get(`${this.endpoint}/date/${date}`);
    return new Observable((observer) => {
      observer.next(getMockMoodEntries());
      observer.complete();
    });
  }

  getMoodEntriesInRange(
    startDate: string,
    endDate: string
  ): Observable<MoodEntry[]> {
    // TODO: Uncomment when API is ready
    // return this.http.get<MoodEntry[]>(`${this.apiUrl}/range`, {
    //   params: { startDate, endDate },
    // });
    // For now using mock data - uncomment when API is ready
    // const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    // return this.http.get<MoodEntry[]>(`${this.apiUrl}/range`, { params });
    return new Observable((observer) => {
      observer.next(getMockMoodEntries());
      observer.complete();
    });
  }

  getMoodEntryById(id: number): Observable<MoodEntry> {
    // TODO: Uncomment when API is ready
    // return this.get(`${this.endpoint}/${id}`);
    return new Observable((observer) => {
      const entries = getMockMoodEntries();
      const entry = entries.find((e) => e.id === id);
      if (entry) {
        observer.next(entry);
      } else {
        observer.error(new Error(`Mood entry with id ${id} not found`));
      }
      observer.complete();
    });
  }

  getMoodStatistics(): Observable<MoodStatistics> {
    // TODO: Uncomment when API is ready
    // return this.get(`${this.endpoint}/statistics`);
    return new Observable((observer) => {
      observer.next(getMockMoodStatistics());
      observer.complete();
    });
  }
}
