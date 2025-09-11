import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MoodEntryFormComponent } from './components/mood-entry-form/mood-entry-form.component';
// import { HistoryComponent } from './components/history/history.component';
import { AuthComponent } from './components/auth/auth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mood-entry', component: MoodEntryFormComponent },
  { path: 'mood-entry/:id', component: MoodEntryFormComponent },
  // { path: 'history', component: HistoryComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '/dashboard' },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },

  // {
  //   path: 'history',
  //   loadChildren: () => import('./features/history/history.module').then(m => m.HistoryModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'analytics',
  //   loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'error',
  //   loadChildren: () => import('./features/error/error.module').then(m => m.ErrorModule)
  // },
  // {
  //   path: '**',
  //   redirectTo: '/error'
  // }
];
