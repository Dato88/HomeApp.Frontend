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
    loadComponent: () => import('./app.component').then((m) => m.AppComponent),
  },
  {
    path: 'registration',
    title: 'Registration',
    loadComponent: () =>
      import('./authentication/register-user/register-user.component').then(
        (m) => m.RegisterUserComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
