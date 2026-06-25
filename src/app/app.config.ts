import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withDebugTracing,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { httpInterceptorProviders } from './shared/http-interceptors';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules), withDebugTracing()),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    httpInterceptorProviders,
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
  ],
};
