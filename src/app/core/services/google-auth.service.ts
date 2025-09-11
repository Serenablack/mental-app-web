import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GoogleUser | null;
  accessToken: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private readonly GOOGLE_AUTH_URL =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly SCOPES = ['openid', 'profile', 'email'].join(' ');
  private readonly REDIRECT_URI = `${window.location.origin}/auth/callback`;

  private authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
  });

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const accessToken = localStorage.getItem('google_access_token');
    const userStr = localStorage.getItem('google_user');

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState$.next({
          isAuthenticated: true,
          user,
          accessToken,
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthState();
      }
    }
  }

  initiateGoogleAuth(): void {
    const state = this.generateRandomState();
    localStorage.setItem('google_auth_state', state);

    const params = new URLSearchParams({
      client_id: environment.googleClientId,
      redirect_uri: this.REDIRECT_URI,
      response_type: 'code',
      scope: this.SCOPES,
      state: state,
      access_type: 'offline',
      prompt: 'consent',
    });

    const authUrl = `${this.GOOGLE_AUTH_URL}?${params.toString()}`;
    window.location.href = authUrl;
  }

  private generateRandomState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  handleAuthCallback(code: string, state: string): Observable<any> {
    const storedState = localStorage.getItem('google_auth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }

    localStorage.removeItem('google_auth_state');

    // In production, this should be handled by your backend
    // For now, we'll simulate the token exchange
    return this.simulateTokenExchange(code);
  }

  private simulateTokenExchange(code: string): Observable<any> {
    // This is a simulation - in production, send the code to your backend
    console.log('Auth code received:', code);

    // Simulate successful authentication
    const mockUser: GoogleUser = {
      id: '123456789',
      email: 'user@example.com',
      name: 'John Doe',
      picture: 'https://via.placeholder.com/150',
    };

    const mockToken = 'mock_access_token_' + Date.now();

    this.handleSuccessfulAuth(mockToken, mockUser);

    return new Observable((observer) => {
      observer.next({ user: mockUser, accessToken: mockToken });
      observer.complete();
    });
  }

  private handleSuccessfulAuth(accessToken: string, user: GoogleUser): void {
    localStorage.setItem('google_access_token', accessToken);
    localStorage.setItem('google_user', JSON.stringify(user));

    this.authState$.next({
      isAuthenticated: true,
      user,
      accessToken,
    });
  }

  logout(): void {
    this.clearAuthState();
  }

  private clearAuthState(): void {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_user');
    localStorage.removeItem('google_auth_state');

    this.authState$.next({
      isAuthenticated: false,
      user: null,
      accessToken: null,
    });
  }

  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  getCurrentUser(): GoogleUser | null {
    return this.authState$.value.user;
  }

  isAuthenticated(): boolean {
    return this.authState$.value.isAuthenticated;
  }

  getAccessToken(): string | null {
    return this.authState$.value.accessToken;
  }
}
