import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mood-entry',
    loadComponent: () =>
      import('./components/mood-entry-form/mood-entry-form.component').then(
        (m) => m.MoodEntryFormComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mood-entry/:id',
    loadComponent: () =>
      import('./components/mood-entry-form/mood-entry-form.component').then(
        (m) => m.MoodEntryFormComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./components/history/history.component').then(
        (m) => m.HistoryComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./components/error-page/error-page.component').then(
        (m) => m.ErrorPageComponent
      ),
  },
  { path: '**', redirectTo: '/error' },
];
