import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DecodedToken {
  sub: string; // User ID
  email: string;
  name: string;
  picture?: string;
  iat: number; // Issued at
  exp: number; // Expiration time
  scope?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';

  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.initializeTokenFromStorage();
  }

  /**
   * Initialize token from localStorage on service startup
   */
  private initializeTokenFromStorage(): void {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  /**
   * Store JWT token in localStorage and memory
   */
  setToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  /**
   * Get current token from memory
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Get current token as observable
   */
  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  /**
   * Get access token for API requests
   */
  getAccessToken(): string | null {
    return this.getToken();
  }

  /**
   * Decode JWT token payload
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Get user information from current token
   */
  getCurrentUser(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  getCurrentUserId(): string | null {
    return this.getCurrentUser()?.sub || null;
  }

  getCurrentUserEmail(): string | null {
    return this.getCurrentUser()?.email || null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const user = this.getCurrentUser();
    if (!user?.exp) return true;
    return Date.now() >= user.exp * 1000;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }

  /**
   * Clear token
   */
  clearToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.tokenSubject.next(null);
  }

  /**
   * Get authorization header value
   */
  getAuthorizationHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}
