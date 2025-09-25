import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage =
              'Unable to connect to server. Please check your internet connection.';
            break;
          case 401:
            errorMessage = 'Your session has expired. Please log in again.';
            handleUnauthorized(router, snackBar);
            break;
          case 403:
            errorMessage = 'Access denied. Your session may have expired.';
            handleUnauthorized(router, snackBar);
            break;
          case 404:
            errorMessage =
              'Resource not found. The requested data does not exist.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Server error (${error.status}): ${error.message}`;
        }
      }

      showErrorMessage(snackBar, errorMessage);
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};

function handleUnauthorized(router: Router, snackBar: MatSnackBar): void {
  router.navigate(['/auth']);
  snackBar.open('Session expired. Please log in again.', 'Close', {
    duration: 5000,
    panelClass: ['error-snackbar'],
  });
}

function showErrorMessage(snackBar: MatSnackBar, message: string): void {
  snackBar.open(message, 'Close', {
    duration: 5000,
  });
}
