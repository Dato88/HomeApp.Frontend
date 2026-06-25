import { Routes } from '@angular/router';

export const routes: Routes = [
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
  {
    path: '**',
    redirectTo: '/',
  },
];
