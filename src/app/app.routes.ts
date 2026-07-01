import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'authentication',
    title: 'Anmeldung',
    loadComponent: () =>
      import('./authentication/authentication.component').then((m) => m.AuthenticationComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'todo',
        title: 'Todo',
        loadComponent: () => import('./todo/todo.component').then((m) => m.TodoComponent),
      },
      {
        path: 'budget',
        title: 'Budget',
        loadComponent: () => import('./budget/budget.component').then((m) => m.BudgetComponent),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () =>
          import('./settings/settings-menu/settings-menu.component').then(
            (m) => m.SettingsMenuComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
