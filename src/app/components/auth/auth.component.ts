import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isLoggingIn = false;
  isSigningUp = false;
  showLoginPassword = false;
  showSignupPassword = false;
  showConfirmPassword = false;
  lotusPetals = Array(5).fill(0); // 5 petals for the lotus
  selectedTabIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    // Check if user is already authenticated
    this.authService.checkExistingAuth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(
    form: FormGroup
  ): { [key: string]: any } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn = true;
    const { email, password } = this.loginForm.value;

    this.authService
      .signIn(email, password)
      .then(() => {
        this.snackBar.open('Welcome back! 🌟', 'Close', { duration: 3000 });
        // Navigation is handled by auth service
      })
      .catch((error) => {
        this.snackBar.open(
          error.message || 'Login failed. Please try again.',
          'Close',
          { duration: 5000 }
        );
      })
      .finally(() => {
        this.isLoggingIn = false;
      });
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSigningUp = true;
    const { firstName, lastName, email, password } = this.signupForm.value;

    this.authService
      .register({
        username: `${firstName}${lastName}`.toLowerCase(),
        email,
        password,
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Account created successfully! 🎉', 'Close', {
            duration: 3000,
          });
          // Switch to login tab after successful registration
          this.switchToLogin();
        },
        error: (error) => {
          this.snackBar.open(
            error.message || 'Registration failed. Please try again.',
            'Close',
            { duration: 5000 }
          );
        },
        complete: () => {
          this.isSigningUp = false;
        },
      });
  }

  signInWithGoogle(): void {
    this.authService
      .signInWithGoogle()
      .then(() => {
        this.snackBar.open('Welcome! 🎉', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.snackBar.open(error.message || 'Google sign-in failed.', 'Close', {
          duration: 5000,
        });
      });
  }

  signUpWithGoogle(): void {
    this.authService
      .signInWithGoogle()
      .then(() => {
        this.snackBar.open('Welcome! 🎉', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.snackBar.open(error.message || 'Google sign-in failed.', 'Close', {
          duration: 5000,
        });
      });
  }

  toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleSignupPassword(): void {
    this.showSignupPassword = !this.showSignupPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  switchToSignup(): void {
    this.selectedTabIndex = 1;
  }

  switchToLogin(): void {
    this.selectedTabIndex = 0;
  }
}
