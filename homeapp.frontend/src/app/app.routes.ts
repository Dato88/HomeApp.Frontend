import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'todo',
    title: 'Todo',
    canActivate: [AuthGuard],
    loadComponent: () => import('./todo/todo.component').then((m) => m.TodoComponent),
  },
  {
    path: 'budget',
    title: 'Budget',
    canActivate: [AuthGuard],
    loadComponent: () => import('./budget/budget.component').then((m) => m.BudgetComponent),
  },
  {
    path: 'settings',
    title: 'Settings',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./settings/settings-menu/settings-menu.component').then(
        (m) => m.SettingsMenuComponent
      ),
  },
  {
    path: 'registration',
    title: 'Registration',
    loadComponent: () =>
      import('./authentication/register-user/register-user.component').then(
        (m) => m.RegisterUserComponent
      ),
  },
  {
    path: 'authentication',
    title: 'Authentication',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./authentication/auth-user/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'forgotpassword',
        title: 'ForgotPassword',
        loadComponent: () =>
          import('./authentication/resetPassword/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'resetpassword',
        title: 'ResetPassword',
        loadComponent: () =>
          import('./authentication/resetPassword/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
      {
        path: 'emailconfirmation',
        title: 'EmailConfirmation',
        loadComponent: () =>
          import('./authentication/email-confirmation/email-confirmation.component').then(
            (m) => m.EmailConfirmationComponent
          ),
      },
      {
        path: 'twostepverification',
        title: 'EmailConfirmation',
        loadComponent: () =>
          import('./authentication/two-step-verification/two-step-verification.component').then(
            (m) => m.TwoStepVerificationComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
