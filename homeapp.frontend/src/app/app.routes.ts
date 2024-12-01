import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'registration',
    title: 'Registration',
    loadComponent: () => import('./authentication/register-user/register-user.component').then((m) => m.RegisterUserComponent),
  },
  {
    path: 'authentication',
    title: 'Authentication',
    children: [
      {
        path: '',
        loadComponent: () => import('./authentication/auth-user/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'forgotpassword',
        title: 'ForgotPassword',
        loadComponent: () => import('./authentication/resetPassword/forgot-password.component').then((m) => m.ForgotPasswordComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
