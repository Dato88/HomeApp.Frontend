import { ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withDebugTracing,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { credentialsInterceptor } from './shared/http-interceptors/credentials.interceptor';
import { authInterceptor } from './shared/http-interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './shared/http-interceptors/error-handler.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      ...(isDevMode() ? [withDebugTracing()] : [])
    ),
    provideHttpClient(
      withXhr(),
      withInterceptors([credentialsInterceptor, authInterceptor, errorHandlerInterceptor])
    ),
    provideAnimationsAsync(),
  ],
};
