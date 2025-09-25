import { HttpErrorResponse } from '@angular/common/http';

export interface AppError {
  message: string;
  type:
    | 'network'
    | 'validation'
    | 'authentication'
    | 'authorization'
    | 'server'
    | 'unknown';
  status?: number;
  details?: any;
  timestamp: string;
  userFriendly: boolean;
}

export class ErrorHandlerUtil {
  static handleHttpError(error: HttpErrorResponse): AppError {
    const timestamp = new Date().toISOString();

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return {
        message:
          'Network error occurred. Please check your internet connection.',
        type: 'network',
        timestamp,
        userFriendly: true,
        details: error.error.message,
      };
    }

    // Server-side error
    switch (error.status) {
      case 0:
        return {
          message:
            'Unable to connect to server. Please check your internet connection.',
          type: 'network',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 400:
        return {
          message: 'Invalid request. Please check your input and try again.',
          type: 'validation',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 401:
        return {
          message: 'Authentication required. Please log in again.',
          type: 'authentication',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 403:
        return {
          message:
            "Access denied. You don't have permission to perform this action.",
          type: 'authorization',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 404:
        return {
          message: 'Resource not found. The requested data does not exist.',
          type: 'validation',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 409:
        return {
          message:
            'Conflict. The resource already exists or has been modified.',
          type: 'validation',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 422:
        return {
          message: 'Validation error. Please check your input data.',
          type: 'validation',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 429:
        return {
          message: 'Too many requests. Please wait a moment and try again.',
          type: 'server',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 500:
        return {
          message: 'Server error. Please try again later.',
          type: 'server',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      case 503:
        return {
          message: 'Service unavailable. Please try again later.',
          type: 'server',
          status: error.status,
          timestamp,
          userFriendly: true,
          details: error.error,
        };

      default:
        return {
          message: `Server error (${error.status}): ${error.message}`,
          type: 'unknown',
          status: error.status,
          timestamp,
          userFriendly: false,
          details: error.error,
        };
    }
  }

  static handleGenericError(error: any): AppError {
    const timestamp = new Date().toISOString();

    if (error instanceof Error) {
      return {
        message: error.message || 'An unexpected error occurred',
        type: 'unknown',
        timestamp,
        userFriendly: false,
        details: error.stack,
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
        type: 'unknown',
        timestamp,
        userFriendly: true,
      };
    }

    return {
      message: 'An unexpected error occurred',
      type: 'unknown',
      timestamp,
      userFriendly: false,
      details: error,
    };
  }

  static isNetworkError(error: AppError): boolean {
    return error.type === 'network';
  }

  static isAuthenticationError(error: AppError): boolean {
    return error.type === 'authentication';
  }

  static isValidationError(error: AppError): boolean {
    return error.type === 'validation';
  }

  static isServerError(error: AppError): boolean {
    return error.type === 'server';
  }

  static shouldRetry(error: AppError): boolean {
    // Retry network errors and server errors (except 4xx client errors)
    return (
      error.type === 'network' ||
      (error.type === 'server' && (!error.status || error.status >= 500))
    );
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
    // Add some jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  static formatErrorMessage(error: AppError): string {
    if (error.userFriendly) {
      return error.message;
    }

    // For non-user-friendly errors, provide a generic message
    switch (error.type) {
      case 'network':
        return 'Connection problem. Please check your internet connection.';
      case 'server':
        return 'Server problem. Please try again later.';
      case 'authentication':
        return 'Authentication problem. Please log in again.';
      case 'authorization':
        return 'Permission problem. Please contact support.';
      case 'validation':
        return 'Input problem. Please check your data.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  static logError(error: AppError, context?: string): void {
    const logData = {
      timestamp: error.timestamp,
      type: error.type,
      status: error.status,
      message: error.message,
      context: context || 'Unknown',
      details: error.details,
    };

    if (error.type === 'server' || error.type === 'network') {
      console.error('Application Error:', logData);
    } else {
      console.warn('Application Warning:', logData);
    }

    // In production, you might want to send this to a logging service
    // this.loggingService.logError(logData);
  }
}
