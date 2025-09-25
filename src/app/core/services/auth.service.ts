import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JwtTokenService } from './jwt-token.service';
import { LocalStorageService } from './local-storage.service';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  name?: string;
  picture?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserProfileResponse;
  success: boolean;
  message: string;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  username: string;
  name?: string;
  picture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  constructor(
    private http: HttpClient,
    private jwtTokenService: JwtTokenService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    // Check if user is logged in via local storage
    if (this.localStorageService.isLoggedIn()) {
      const user = this.localStorageService.getUser();
      const token = this.localStorageService.getToken();

      if (user && token) {
        // Set token in JWT service for validation
        this.jwtTokenService.setToken(token);
        // Validate token is not expired
        if (!this.jwtTokenService.isTokenExpired()) {
          this.authStateSubject.next({
            isAuthenticated: true,
            user: user,
            isLoading: false,
          });
          // Auto-redirect to dashboard if on auth page
          if (this.router.url.includes('/auth')) {
            this.router.navigate(['/dashboard']);
          }
          return;
        } else {
          // Token expired, clear storage
          this.localStorageService.clearAuthData();
        }
      }
    }

    // Fallback to JWT token service
    const token = this.jwtTokenService.getToken();
    if (token && !this.jwtTokenService.isTokenExpired()) {
      const user = this.jwtTokenService.getCurrentUser();
      if (user) {
        this.authStateSubject.next({
          isAuthenticated: true,
          user: {
            id: parseInt(user.sub) || 0,
            email: user.email,
            username: user.name || user.email,
            picture: user.picture,
          },
          isLoading: false,
        });
        // Auto-redirect to dashboard if on auth page
        if (this.router.url.includes('/auth')) {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.handleInvalidToken();
      }
    } else {
      this.authStateSubject.next({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  }

  get authState$(): Observable<AuthState> {
    return this.authStateSubject.asObservable();
  }

  getAuthState(): Observable<AuthState> {
    return this.authStateSubject.asObservable();
  }

  /** Proper boolean observable */
  get isAuthenticated$(): Observable<boolean> {
    return this.authStateSubject
      .asObservable()
      .pipe(map((state) => state.isAuthenticated));
  }

  /** Sync accessor */
  isAuthenticatedSync(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Check if user is already authenticated and redirect to dashboard
   * This should be called when user visits the auth page
   */
  checkExistingAuth(): void {
    if (this.isAuthenticatedSync()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.setLoadingState(true);

    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.accessToken && response.user) {
            this.handleSuccessfulLogin(response);
          } else {
            console.error('Invalid response structure:', response);
            this.setLoadingState(false);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          this.setLoadingState(false);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    this.setLoadingState(true);

    return this.http.post<any>(`${this.API_URL}/register`, userData).pipe(
      tap((response) => {
        // Registration successful - don't auto-login, just show success
        this.setLoadingState(false);
      }),
      catchError((error) => {
        this.setLoadingState(false);
        return throwError(() => error);
      })
    );
  }

  signIn(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.login({ usernameOrEmail: email, password }).subscribe({
        next: () => resolve(),
        error: (error) => reject(error),
      });
    });
  }

  signInWithGoogle(): Promise<void> {
    // TODO: Implement Google OAuth
    return Promise.reject(new Error('Google sign-in not implemented yet'));
  }

  logout(): void {
    // Client-side only logout - no server call needed
    this.handleLogout();
  }

  forceLogout(): void {
    this.handleLogout();
  }

  private handleSuccessfulLogin(response: AuthResponse): void {
    if (response.accessToken && response.user) {
      // Store token and user data in local storage
      this.localStorageService.setToken(
        response.accessToken,
        response.tokenType || 'Bearer'
      );

      // Create user object from response
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        name: response.user.name || response.user.username,
        picture: response.user.picture,
      };

      this.localStorageService.setUser(user);

      // Also store in JWT service for backward compatibility
      this.jwtTokenService.setToken(response.accessToken);

      this.authStateSubject.next({
        isAuthenticated: true,
        user: user,
        isLoading: false,
      });

      this.router.navigate(['/dashboard']);
    } else {
      console.error('Missing accessToken or user in response:', response);
      this.setLoadingState(false);
    }
  }

  private handleLogout(): void {
    // Clear all authentication data from local storage
    this.localStorageService.clearAuthData();

    // Clear JWT service for backward compatibility
    this.jwtTokenService.clearToken();

    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    this.router.navigate(['/auth']);
  }

  private handleInvalidToken(): void {
    this.localStorageService.clearAuthData();
    this.jwtTokenService.clearToken();
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  }

  private setLoadingState(isLoading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      isLoading,
    });
  }

  isLoading(): boolean {
    return this.authStateSubject.value.isLoading;
  }
}
