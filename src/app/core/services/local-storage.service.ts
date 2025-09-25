import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly TOKEN_TYPE_KEY = 'token_type';
  private readonly USER_KEY = 'user_data';

  constructor() {}

  /**
   * Set a value in local storage
   * @param key - The key to store the value under
   * @param value - The value to store (will be JSON stringified)
   */
  setItem(key: string, value: any): void {
    console.log('setItem', key, value);

    try {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  }

  /**
   * Get a value from local storage
   * @param key - The key to retrieve
   * @param defaultValue - Default value if key doesn't exist
   * @returns The stored value or default value
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue || null;
    }
  }

  /**
   * Remove a value from local storage
   * @param key - The key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  }

  /**
   * Clear all local storage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if a key exists in local storage
   * @param key - The key to check
   * @returns True if key exists
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Token-specific methods
  setToken(token: string, tokenType: string = 'Bearer'): void {
    this.setItem(this.TOKEN_KEY, token);
    this.setItem(this.TOKEN_TYPE_KEY, tokenType);
  }

  getToken(): string | null {
    return this.getItem<string>(this.TOKEN_KEY);
  }

  getTokenType(): string {
    return this.getItem<string>(this.TOKEN_TYPE_KEY) || 'Bearer';
  }

  getAuthorizationHeader(): string | null {
    const token = this.getToken();
    const tokenType = this.getTokenType();
    return token ? `${tokenType} ${token}` : null;
  }

  clearToken(): void {
    this.removeItem(this.TOKEN_KEY);
    this.removeItem(this.TOKEN_TYPE_KEY);
  }

  // User data methods
  setUser(user: any): void {
    this.setItem(this.USER_KEY, user);
  }

  getUser(): any | null {
    return this.getItem(this.USER_KEY);
  }

  clearUser(): void {
    this.removeItem(this.USER_KEY);
  }

  // Check if user is logged in (has valid token)
  isLoggedIn(): boolean {
    return this.hasItem(this.TOKEN_KEY);
  }

  // Clear all authentication data
  clearAuthData(): void {
    this.clearToken();
    this.clearUser();
  }
}




