import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  filter,
  take,
  switchMap,
  throwError,
  BehaviorSubject,
} from 'rxjs';
import { JwtTokenService } from '../services/jwt-token.service';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const jwtTokenService = inject(JwtTokenService);
  const authService = inject(AuthService);

  // Skip token for auth endpoints
  if (isAuthEndpoint(request.url)) {
    return next(request);
  }

  // Add token to request
  const token = jwtTokenService.getAccessToken();
  if (token) {
    request = addTokenToRequest(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handleTokenExpired(request, next, jwtTokenService, authService);
      }
      return throwError(() => error);
    })
  );
};

function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    '/auth/login',
    '/auth/refresh',
    '/auth/logout',
    '/auth/google',
  ];
  return authEndpoints.some((endpoint) => url.includes(endpoint));
}

function addTokenToRequest(
  request: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handleTokenExpired(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  jwtTokenService: JwtTokenService,
  authService: AuthService
) {
  // For simplicity, just redirect to login on token expiration
  // In a production app, you'd implement token refresh logic here
  authService.forceLogout();
  return throwError(() => new Error('Token expired'));
}
