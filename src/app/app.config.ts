import {
  ApplicationConfig,
  LOCALE_ID,
  isDevMode,
  provideZonelessChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
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

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'de' },
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
