import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JwtTokenService } from './jwt-token.service';

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
  id: string;
  email: string;
  username: string;
  name?: string;
  picture?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: User;
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
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.jwtTokenService.getToken();

    if (token && !this.jwtTokenService.isTokenExpired()) {
      const user = this.jwtTokenService.getCurrentUser();
      if (user) {
        this.authStateSubject.next({
          isAuthenticated: true,
          user: {
            id: user.sub,
            email: user.email,
            username: user.name || user.email,
            picture: user.picture,
          },
          isLoading: false,
        });
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

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.setLoadingState(true);

    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.token && response.user) {
            this.handleSuccessfulLogin(response);
          }
        }),
        catchError((error) => {
          this.setLoadingState(false);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.setLoadingState(true);

    return this.http
      .post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap((response) => {
          if (response.token && response.user) {
            this.handleSuccessfulLogin(response);
          }
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

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => this.handleLogout()),
      catchError(() => {
        this.handleLogout();
        return of(void 0); // ✅ proper empty observable
      })
    );
  }

  forceLogout(): void {
    this.handleLogout();
  }

  private handleSuccessfulLogin(response: AuthResponse): void {
    if (response.token) {
      this.jwtTokenService.setToken(response.token);

      this.authStateSubject.next({
        isAuthenticated: true,
        user: response.user || null,
        isLoading: false,
      });

      this.router.navigate(['/dashboard']);
    }
  }

  private handleLogout(): void {
    this.jwtTokenService.clearToken();

    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    this.router.navigate(['/auth']);
  }

  private handleInvalidToken(): void {
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
