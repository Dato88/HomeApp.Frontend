import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerService, multi: true },
];
