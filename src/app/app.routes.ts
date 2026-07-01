import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'authentication',
    title: 'Anmeldung',
    loadComponent: () =>
      import('./authentication/authentication.component').then((m) => m.AuthenticationComponent),
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'todo',
    title: 'Todo',
    canActivate: [authGuard],
    loadComponent: () => import('./todo/todo.component').then((m) => m.TodoComponent),
  },
  {
    path: 'budget',
    title: 'Budget',
    canActivate: [authGuard],
    loadComponent: () => import('./budget/budget.component').then((m) => m.BudgetComponent),
  },
  {
    path: 'settings',
    title: 'Settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./settings/settings-menu/settings-menu.component').then(
        (m) => m.SettingsMenuComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
