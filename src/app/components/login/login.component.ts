import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    this.authService.isAuthenticated.subscribe((isAuth) => {
      if (isAuth) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.signIn(email, password);
        this.snackBar.open('Welcome back! 🌟', 'Close', { duration: 3000 });
      } catch (error: any) {
        this.snackBar.open(
          error.message || 'Login failed. Please try again.',
          'Close',
          { duration: 5000 }
        );
      } finally {
        this.loading = false;
      }
    }
  }

  async onGoogleSignIn(): Promise<void> {
    this.loading = true;
    try {
      await this.authService.signInWithGoogle();
      this.snackBar.open('Welcome! 🎉', 'Close', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open(error.message || 'Google sign-in failed.', 'Close', {
        duration: 5000,
      });
    } finally {
      this.loading = false;
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }
}
