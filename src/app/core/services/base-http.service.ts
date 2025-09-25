import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, retry, map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JwtTokenService } from './jwt-token.service';
import { LocalStorageService } from './local-storage.service';

export interface RequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  timeout?: number;
  retries?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  protected readonly baseUrl = environment.apiUrl;
  protected readonly defaultTimeout = 30000; // 30 seconds
  protected readonly defaultRetries = 2;

  constructor(
    protected http: HttpClient,
    protected jwtTokenService: JwtTokenService,
    protected localStorageService: LocalStorageService
  ) {}

  /** GET */
  protected get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestOptions = this.buildRequestOptions(options);

    return this.http
      .get<ApiResponse<T>>(url, {
        ...requestOptions,
        observe: 'body', // This ensures we get the response body directly
        responseType: 'json',
      })
      .pipe(
        timeout(options.timeout || this.defaultTimeout),
        retry(options.retries || this.defaultRetries),
        catchError(this.handleError)
      );
  }

  /** POST */
  protected post<T>(
    endpoint: string,
    body: any,
    options: RequestOptions = {}
  ): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestOptions = this.buildRequestOptions(options);

    return this.http
      .post<ApiResponse<T>>(url, body, {
        ...requestOptions,
        observe: 'body',
        responseType: 'json',
      })
      .pipe(
        timeout(options.timeout || this.defaultTimeout),
        retry(options.retries || this.defaultRetries),
        catchError(this.handleError)
      );
  }

  /** PUT */
  protected put<T>(
    endpoint: string,
    body: any,
    options: RequestOptions = {}
  ): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestOptions = this.buildRequestOptions(options);

    return this.http
      .put<ApiResponse<T>>(url, body, {
        ...requestOptions,
        observe: 'body',
        responseType: 'json',
      })
      .pipe(
        timeout(options.timeout || this.defaultTimeout),
        retry(options.retries || this.defaultRetries),
        catchError(this.handleError)
      );
  }

  /** DELETE */
  protected delete<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestOptions = this.buildRequestOptions(options);

    return this.http
      .delete<ApiResponse<T>>(url, {
        ...requestOptions,
        observe: 'body',
        responseType: 'json',
      })
      .pipe(
        timeout(options.timeout || this.defaultTimeout),
        retry(options.retries || this.defaultRetries),
        catchError(this.handleError)
      );
  }

  /** PATCH */
  protected patch<T>(
    endpoint: string,
    body: any,
    options: RequestOptions = {}
  ): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestOptions = this.buildRequestOptions(options);

    return this.http
      .patch<ApiResponse<T>>(url, body, {
        ...requestOptions,
        observe: 'body',
        responseType: 'json',
      })
      .pipe(
        timeout(options.timeout || this.defaultTimeout),
        retry(options.retries || this.defaultRetries),
        catchError(this.handleError)
      );
  }

  /** Build URL */
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
  }

  /** Build headers + params */
  private buildRequestOptions(options: RequestOptions): {
    headers: HttpHeaders;
    params?: HttpParams;
  } {
    let headers =
      options.headers ||
      new HttpHeaders({
        'Content-Type': 'application/json',
      });

    // Try to get authorization header from local storage first
    const authHeader = this.localStorageService.getAuthorizationHeader();
    if (authHeader) {
      headers = headers.set('Authorization', authHeader);
    } else {
      // Fallback to JWT service
      const token = this.jwtTokenService.getAccessToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return {
      headers,
      params: options.params,
    };
  }

  /** Error handler */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot reach server';
          break;
        case 400:
          errorMessage = 'Invalid request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          break;
        case 403:
          errorMessage = 'Forbidden';
          break;
        case 404:
          errorMessage = 'Not found';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('HTTP Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
