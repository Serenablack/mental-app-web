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

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initializeForms();
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

    // TODO: Implement actual login logic
    setTimeout(() => {
      this.isLoggingIn = false;
      this.snackBar.open(
        'Login functionality will be implemented when backend is ready',
        'Close',
        {
          duration: 3000,
          panelClass: ['info-snackbar'],
        }
      );
    }, 1000);
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSigningUp = true;

    // TODO: Implement actual signup logic
    setTimeout(() => {
      this.isSigningUp = false;
      this.snackBar.open(
        'Signup functionality will be implemented when backend is ready',
        'Close',
        {
          duration: 3000,
          panelClass: ['info-snackbar'],
        }
      );
    }, 1000);
  }

  signInWithGoogle(): void {
    // TODO: Implement Google OAuth
    this.snackBar.open(
      'Google OAuth will be implemented when backend is ready',
      'Close',
      {
        duration: 3000,
        panelClass: ['info-snackbar'],
      }
    );
  }

  signUpWithGoogle(): void {
    // TODO: Implement Google OAuth
    this.snackBar.open(
      'Google OAuth will be implemented when backend is ready',
      'Close',
      {
        duration: 3000,
        panelClass: ['info-snackbar'],
      }
    );
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
}
