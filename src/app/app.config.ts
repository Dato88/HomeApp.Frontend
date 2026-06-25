import { ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withDebugTracing,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
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
    provideHttpClient(withXhr(), withInterceptors([errorHandlerInterceptor])),
    provideAnimationsAsync(),
  ],
};
