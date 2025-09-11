import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  getMockEmotions,
  getMockRootEmotions,
  getMockSubEmotions,
  getMockEmotionsByParentKey,
} from '../../data/mock-data';

export interface Emotion {
  id?: number;
  key: string;
  label: string;
  parent?: Emotion;
  children?: Emotion[];
  createdAt?: string;
  updatedAt?: string;
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
export class EmotionService {
  private apiUrl = `${environment.apiUrl}/emotions`;
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

  private handleNoData<T>(
    data: T[] | T | null | undefined,
    fallback: T[] | T
  ): T[] | T {
    if (data === null || data === undefined) {
      console.warn('No data received from API, using fallback data');
      return fallback;
    }

    if (Array.isArray(data) && data.length === 0) {
      console.info('Empty data array received from API');
      return fallback;
    }

    return data;
  }

  getAllEmotions(): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(this.apiUrl)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getEmotionByKey(key: string): Observable<Emotion> {
    return this.http
      .get<Emotion>(`${this.apiUrl}/${key}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getRootEmotions(): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/root`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getEmotionsByParentKey(parentKey: string): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/parent/${parentKey}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getEmotionWheelTaxonomy(): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/taxonomy`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  searchEmotions(query: string): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/search`, {
        params: { q: query },
      })
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getEmotionsForDropdown(): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/dropdown`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getEmotionsForDropdownType(
    type: 'main' | 'sub' | 'all' | 'hierarchy'
  ): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/dropdown/${type}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getEmotionsByCategory(categoryKey: string): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/category/${categoryKey}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getSubEmotions(): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/sub`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  getSubEmotionsGrouped(): Observable<Emotion[]> {
    return this.http
      .get<Emotion[]>(`${this.apiUrl}/sub/grouped`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  emotionExists(key: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.apiUrl}/exists/${key}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError.bind(this))
      );
  }

  // Add method to get available emotions for mood entry form
  getAvailableEmotions(): Observable<Emotion[]> {
    return this.getAllEmotions();
  }
}
